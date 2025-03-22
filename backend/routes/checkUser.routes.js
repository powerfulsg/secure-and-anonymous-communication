import express from "express";
import User from "../models/user.model.js"; // User model
import ChatInvitation from '../models/chatInvitation.model.js'; // Assuming you're tracking invites
const router = express.Router();

// Route to check if the user exists and send an invite
router.post('/api/checkUser', async (req, res) => {
  const { username } = req.body;

  try {
    // Check if user exists in the database
    const user = await User.findOne({ username });
    
    if (user) {
      // If user exists, send an invite request
      const invite = await sendInvite(username);
      
      // Return success response with available status
      res.json({
        available: true,
        message: 'Invite sent successfully',
        inviteId: invite._id, // Optionally send the invite ID
      });
    } else {
      // If user does not exist, return unavailable
      res.json({
        available: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to handle sending the invite request
const sendInvite = async (username) => {
  // Assuming we have a ChatInvitation schema to track invites
  const invite = new ChatInvitation({
    username,
    status: 'pending', // Status could be 'pending', 'accepted', or 'declined'
    createdAt: new Date(),
  });

  // Save the invitation to the database
  await invite.save();

  // Return the saved invite
  return invite;
};

export default router;
