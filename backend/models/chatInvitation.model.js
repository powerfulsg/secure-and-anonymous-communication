import mongoose from 'mongoose';

const ChatInvitationSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

const ChatInvitation = mongoose.model('ChatInvitation', ChatInvitationSchema);

export default ChatInvitation;
