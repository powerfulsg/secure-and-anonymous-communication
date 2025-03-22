// Example of backend conversation model and response
import Conversation from "../models/conversation.model";
const conversation = await Conversation.find({ /* Your query */ });
const response = conversation.map(conv => ({
  username: conv.username,
  receiverId: conv.receiverId, // Ensure this is sent
  _id: conv._id
}));

res.status(200).json(response);
