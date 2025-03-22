import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
      const { message, receiverId } = req.body; 
      console.log(req.body)// Destructure receiverId from request body
      const senderId = req.user._id; // Get the sender ID from the authenticated user
    
    console.log(senderId)
    console.log(receiverId)
      // Find or create a conversation
      let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
  
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
  
      const newMessage = new Message({
        receiverId,
        senderId,
        message,
      });
  
      if (newMessage) {
        conversation.message.push(newMessage._id);
      }
  
      // Save conversation and message in parallel
      await Promise.all([conversation.save(), newMessage.save()]);
  
      // Socket IO functionality (if necessary)
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
  
    } catch (err) {
      console.log("Error in sendMessage controller: ", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // User to chat with
        const senderId = req.user._id; // Sender ID from the authenticated user

        // Find the conversation between the sender and the user to chat with
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("message"); // Populate the messages

        if (!conversation) {
            return res.status(200).json([]); // No conversation found, return an empty array
        }

        const messages = conversation.message; // Get the messages from the conversation
        res.status(200).json(messages); // Respond with the messages

    } catch (err) {
        console.log("Error in getMessages controller: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
