import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectToMongoDB from "./DB/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import torRequest from 'tor-request';  // Importing tor-request

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());    // to parse the incoming requests with JSON payloads (from req body)
app.use(cookieParser());

// Example of using tor-request for outgoing requests over Tor network
app.post('/api/tor-example', (req, res) => {
    const { url } = req.body;  // Assume the incoming request provides a URL to make a Tor request to

    // Making a request over Tor using tor-request
    torRequest.request(url, (err, torRes, body) => {
        if (!err && torRes.statusCode === 200) {
            res.status(200).send(body);  // Send the response back to the client
        } else {
            res.status(500).send({ error: 'Failed to fetch data from Tor network' });
        }
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serving static files from frontend build
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Starting the server
server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
