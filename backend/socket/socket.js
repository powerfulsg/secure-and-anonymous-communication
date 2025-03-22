// import { Server  } from "socket.io";
// import http from 'http';
// import express from "express";

// const app=express();

// const server= http.createServer(app);
// const io= new Server(server,{
//     cors:{
//         origin: ['http://localhost:3000'],
//         methods: ['GET', 'POST'],
//     },
// });

// export const getReceiverSocketId= (receiverId)=>{
//     return userSocketMap[receiverId];
// }

// const userSocketMap={};

// io.on("connection", (socket) =>{

//     const userId= socket.handshake.query.userId;
//     if(userId != 'undefined') userSocketMap[userId] = socket.id;

//     io.emit('OnlineUsers', Object.keys(userSocketMap));

//     socket.on("disconnect", ()=>{
//         delete userSocketMap[userId];
//         io.emit("OnlineUsers", Object.keys(userSocketMap));
//     });
// });


// export {app, io, server};


import ChatInvitation from '../models/chatInvitation.model.js';
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Store the mapping of user IDs to socket IDs
const socketIdMap = new Map();

const getReceiverSocketId = (receiverId) => {
    return socketIdMap.get(receiverId);
};

const getUpdatedFriends = async (senderUsername, receiverUsername) => {
    try {
        // Fetch all accepted invitations where either the sender or receiver is the user
        const senderInvitations = await ChatInvitation.find({
            $or: [
                { sender: senderUsername },
            
            ],
            status: 'accepted'
        });

        const receiverInvitations = await ChatInvitation.find({
            $or: [
                { receiver: receiverUsername },
               
            ],
            status: 'accepted'
        });

        // Combine and extract the friends from both sender's and receiver's invitations
        const senderFriends = senderInvitations.map(invitation => 
            invitation.sender === senderUsername ? invitation.receiver : invitation.sender
        );

        const receiverFriends = receiverInvitations.map(invitation => 
            invitation.sender === receiverUsername ? invitation.receiver : invitation.sender
        );

        // Combine friends and remove duplicates
        const updatedFriends = [...new Set([...senderFriends, ...receiverFriends])];

        return updatedFriends;
    } catch (error) {
        console.error("Error fetching updated friends from ChatInvitation model: ", error);
        throw error;
    }
};

export default getUpdatedFriends;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Register socket with user ID
    socket.on('register', (userId) => {
        if (userId) {
            socketIdMap.set(userId, socket.id);
            console.log(`User registered: ${userId} with socket id: ${socket.id}`);
        } else {
            console.warn('Received undefined userId for registration.');
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        socketIdMap.forEach((id, userId) => {
            if (id === socket.id) {
                socketIdMap.delete(userId);
            }
        });
    });

    socket.on('updateFriendList', async ({ sender, receiver }) => {
        try {
            const updatedFriends = await getUpdatedFriends(sender, receiver);

            const senderSocketId = getReceiverSocketId(sender);
            const receiverSocketId = getReceiverSocketId(receiver);

            if (senderSocketId) {
                io.to(senderSocketId).emit('friendListUpdated', updatedFriends);
            }
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('friendListUpdated', updatedFriends);
            }
        } catch (error) {
            console.error("Error updating friend list: ", error);
        }
    });
});

export { app, server, io, getReceiverSocketId };
