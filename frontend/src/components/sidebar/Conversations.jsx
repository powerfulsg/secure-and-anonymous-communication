// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Conversation from './Conversation';
import useGetConversations from '../../hooks/useGetConversations';
import { getRandomEmoji } from '../../utils/emojis';
import axios from 'axios';
import toast from "react-hot-toast";


const Conversations = () => {
  const { loading, conversations } = useGetConversations();
  const [username, setUsername] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [userAvailable, setUserAvailable] = useState(null);
  const [message, setMessage] = useState('');

  // Function to start chat by checking user availability
  const handleStartChat = async () => {
    try {
      console.log("fau");
      if(username.length == 0) {
        return toast.error("Enter your name");
      }
      const chatUser = localStorage.getItem('chat-user'); 
      const chatUserJson = JSON.parse(chatUser);
      console.log(chatUserJson.username);
      const response = await axios.post('/api/sendInvite', {
        sender: chatUserJson.username,  // Use currentUsername here
        receiver: username,
      });
      if (response.data.status == "accepted") {
        setUserAvailable(true);
        setChatStarted(true);
      } else {
        toast.success("Invite Sent to " +username);
        setUsername("");
        setUserAvailable(false);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  // Set chat expiration (15 minutes timeout)
  useEffect(() => {
    if (chatStarted) {
      const timer = setTimeout(() => {
        setChatStarted(false);
        setMessage('Chat session expired.');
      }, 15 * 60 * 1000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [chatStarted]);

  return (
    <div className='py-2 flex flex-col overflow-auto'>
      {/* Username Input and Start Chat Button */}
      {!chatStarted ? (
        <div>
          <h1>Start a New Conversation</h1>
          <div className='margin mb-2'></div>
          <div className='flex flex-row'>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='input input-bordered w-full max-w-xs'
          /> 
          <div className='divider px-3'></div>
          <button onClick={handleStartChat} className='btn btn-primary'>
            Send Invite
          </button>
          {/* {userAvailable === false && <p>User not available</p>} */}
        </div>  
        </div>
        
      ) : (
        <div>
          <h2>Chat with {username}</h2>
          {/* Display Conversations */}
          {conversations.map((conversation, idx) => (
            <Conversation
              key={conversation._id}
              conversation={conversation}
              emoji={getRandomEmoji()}
              lastIdx={idx === conversations.length - 1}
            />
          ))}
          {loading ? <span className='loading loading-spinner' /> : null}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Conversations;
