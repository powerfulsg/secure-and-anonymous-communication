/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatInvite = ({ inviteId }) => {
  const [inviteStatus, setInviteStatus] = useState('pending');
  const [chatStarted, setChatStarted] = useState(false);

  const handleInviteResponse = async (action) => {
    try {
      const response = await axios.post('/api/respondInvite', {
        inviteId,
        action,
      });
      setInviteStatus(action);
      
      if (action === 'accept') {
        setChatStarted(true);
      }
    } catch (error) {
      console.error('Error responding to invite:', error);
    }
  };

  useEffect(() => {
    if (inviteStatus === 'accepted') {
      // Start chat after accepting invite
      axios.post('/api/startChat', { inviteId })
        .then(response => {
          if (response.data.success) {
            setChatStarted(true);
          }
        })
        .catch(error => {
          console.error('Error starting chat:', error);
        });
    }
  }, [inviteStatus]);

  return (
    <div>
      {inviteStatus === 'pending' && (
        <div>
          <p>Invitation pending</p>
          <button onClick={() => handleInviteResponse('accept')}>Accept</button>
          <button onClick={() => handleInviteResponse('decline')}>Decline</button>
        </div>
      )}

      {inviteStatus === 'accepted' && chatStarted && (
        <div>
          <p>Chat started!</p>
          {/* Chat window component here */}
        </div>
      )}

      {inviteStatus === 'declined' && <p>Invitation declined.</p>}
    </div>
  );
};

export default ChatInvite;
