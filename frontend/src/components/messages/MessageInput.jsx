import React, { useState } from 'react';
import { BsSend } from "react-icons/bs";
import useSendMessage from '../../hooks/useSendMessage';
import useConversation from '../../zustand/useConversation'; // Adjust the import path

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { selectedConversation } = useConversation(); // Get selected conversation from Zustand store

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure a message and conversation ID exists
    const handleSelectConversation = async (conversationId) => {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const conversation = await res.json();
    
      selectedConversation({
        username: conversation.username,
        receiverId: conversation.receiverId,  // Make sure you get and set the receiverId
        _id: conversation._id
      });
    };
    useEffect(() => {
      console.log(selectedConversation); // Check if receiverId is present
    }, [selectedConversation]);
    
 // Adjust based on your conversation structure

    // Modify this according to your actual data structure

    await sendMessage(message, receiverId); // Pass both message and receiver ID
    setMessage("");
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input 
          type="text" 
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white' 
          placeholder='Send a Message' 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type='submit' className='absolute inset-y-0 right-0 flex items-center pr-3'>
          {loading ? <span className='loading loading-spinner'></span> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;