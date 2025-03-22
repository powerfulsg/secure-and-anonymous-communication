import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import express from "express"
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import checkUserRoutes from "./routes/checkUser.routes.js"
import sendInvite from "./controllers/sentInvite.controller.js"
import ReceiveRoutes from './routes/sendInvite.routes.js'

import connectToMongoDB from "./DB/connectToMongoDB.js";

import { app, server } from "./socket/socket.js";

const PORT=process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());    // to parse the incoming requests with JSON payloads ( from req body )
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users",userRoutes);
app.use("/api/checkUser", checkUserRoutes)
app.use("/api/sendInvite", sendInvite)
app.use("/api/getInvitations",ReceiveRoutes)
app.get("/api/conversations/:id")

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

// app.get('/',(req,res)=>{
//     res.send("Hello!");
// });


server.listen(PORT,()=>{
    connectToMongoDB();
    console.log(`Server is Reunning on port ${PORT}`);
});