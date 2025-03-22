import express from "express";
import User from "../models/user.model.js"; // User model
import ChatInvitation from '../models/chatInvitation.model.js'; // Assuming you're tracking invites
const router = express.Router();

// Accept or decline an invitation
router.post('/respondInvite', async (req, res) => {
    const { inviteId, action } = req.body; // Action: 'accept' or 'decline'
  
    try {
      const invite = await ChatInvitation.findById(inviteId);
  
      if (!invite) {
        return res.status(404).json({ message: 'Invitation not found' });
      }
  
      // Update the invitation status
      if (action === 'accept') {
        invite.status = 'accepted';
        // Optionally, you can initiate chat room creation here
      } else if (action === 'decline') {
        invite.status = 'declined';
      }
  
      await invite.save();
  
      res.json({
        success: true,
        message: `Invitation ${action}ed successfully.`,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// Start a chat if the invitation is accepted
router.post('/startChat', async (req, res) => {
    const { inviteId } = req.body;
  
    try {
      const invite = await ChatInvitation.findById(inviteId);
  
      if (!invite) {
        return res.status(404).json({ message: 'Invitation not found' });
      }
  
      if (invite.status === 'accepted') {
        // Start the chat session between the two users
        res.json({
          success: true,
          message: 'Chat session started',
          participants: {
            sender: invite.sender,
            receiver: invite.receiver,
          },
        });
      } else {
        res.status(400).json({ message: 'Cannot start chat, invitation not accepted' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  // Route to get pending invitations for a user (User B)
router.get('/getPendingInvitations/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const pendingInvites = await ChatInvitation.find({ receiver: username, status: 'pending' });
    
    if (pendingInvites.length > 0) {
      res.json({ invites: pendingInvites });
    } else {
      res.json({ invites: [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

  
  

export default router;
