import mongoose from "mongoose";
import User from "./user.model.js";
import Message from "./message.model.js";

const conversationSchema= new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    ],
    message:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:Message,
            default:[],
        }
    ]
},{timeseries:true});

const Conversation= mongoose.model("Conversation", conversationSchema);

export default Conversation;