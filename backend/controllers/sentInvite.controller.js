import express from "express";
import User from "../models/user.model.js"; // User model
import ChatInvitation from '../models/chatInvitation.model.js'; // Assuming you're tracking invites

// Send an invite to start a chat
export const sendInvite = async (req, res) => {
  const { sender, receiver } = req.body;

  try {
    // Check if receiver exists in the database
    const user = await User.findOne({ username: receiver });
    console.log(user);
    if (user) {
      // Create a new chat invitation
      const chatInvitation = new ChatInvitation({
        sender: sender,
        receiver :receiver,
        status: 'pending',
      });
        console.log(chatInvitation);
        
      if(chatInvitation){
        await chatInvitation.save().then( async (value)=>{
            console.log("Done Successful");
            // const invitations = await ChatInvitation.find();
            console.log(invitations);
            res.json({
                success: true,
                message: 'successfully',
                inviteId: chatInvitation._id,
              });
        }).catch(()=>{
            res.json({ success: false, message: 'Invalid Data' });
        });
        
      }else{
        res.json({ success: false, message: 'Invalid Data' });
      }
      
    } else {
      res.json({ success: false, message: 'Receiver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default sendInvite;