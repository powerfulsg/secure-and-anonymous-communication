import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext'; // Adjust the import path
import useConversation from '../../zustand/useConversation'; // Zustand store
import { io } from 'socket.io-client'; // Import Socket.IO

const socket = io('http://localhost:5000'); // Replace with your server URL

const ReceiveInput = () => {
  const { authUser } = useAuthContext(); // Get the logged-in user from context
  const { setSelectedConversation } = useConversation(); // To set the selected conversation
  const [invites, setInvites] = useState([]);
  const [friends, setFriends] = useState([]); // State to hold friends list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      if (authUser && authUser.username) {
        try {
          const response = await fetch(`/api/getInvitations/getPendingInvitations/${authUser.username}`);
          const data = await response.json();

          if (response.ok) {
            setInvites(data.invites);
          } else {
            setError(data.message || 'Error fetching invitations');
          }
        } catch (err) {
          setError('Failed to fetch invitations');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInvitations();
  }, [authUser]);

  // Listen for friend list updates via Socket.IO
  useEffect(() => {
    // Handle incoming friend list updates
    socket.on('friendListUpdated', (updatedFriends) => {
      console.log('Updated friends list received:', updatedFriends); // Debugging line
      setFriends(updatedFriends);
    });

    // Cleanup the event listener on component unmount
    return () => {
      socket.off('friendListUpdated');
    };
  }, []);

  // Handle invitation response (accept/decline)
  const handleRespondInvite = async (inviteId, action) => {
    try {
      const response = await fetch('/api/getInvitations/respondInvite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inviteId,
          action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setInvites(invites.map(invite =>
          invite._id === inviteId ? { ...invite, status: action + 'ed' } : invite
        ));

        if (action === 'accept') {
          const acceptedInvite = invites.find(invite => invite._id === inviteId);
          const sender = acceptedInvite.sender;
          const receiver = acceptedInvite.receiver;

          // Emit to Socket.IO server to update both users' friend lists
          socket.emit('updateFriendList', { sender, receiver });

          // Add the sender to the receiver's friends list and vice versa
          if (authUser.username === receiver) {
            // If the current user is the receiver, add sender to friends
            setFriends(prevFriends => Array.from(new Set([...prevFriends, sender])));
          } else {
            // If the current user is the sender, add receiver to friends
            setFriends(prevFriends => Array.from(new Set([...prevFriends, receiver])));
          }

          await startChat(sender, receiver);
        }

        alert(`Invitation ${action}ed successfully.`);
      } else {
        alert(data.message || `Failed to ${action} the invitation.`);
      }
    } catch (error) {
      alert('Server error. Please try again.');
    }
  };

  // Start chat after accepting the invitation
  const startChat = async (sender, receiver) => {
    try {
      const response = await fetch('/api/getInvitations/startChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, receiver }), // Pass sender and receiver to start chat
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedConversation({ sender, receiver });
        alert(`Chat started successfully between ${data.participants.sender} and ${data.participants.receiver}`);
      } else {
        alert(data.message || 'Failed to start the chat.');
      }
    } catch (error) {
      alert('Server error. Unable to start chat.');
    }
  };

  // Function to handle friend click and start conversation
  const handleFriendClick = (friend) => {
    setSelectedConversation({
      username: friend, // Assuming the friend is represented by their username
    });
  };

  if (!authUser) {
    return <div>Please log in to see your invitations.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3 className='text-white font-semibold'>Received Chat Invitations</h3>
      {invites.length > 0 ? (
        <ul>
          {invites.map(invite => (
            <li className='text-white font-semibold' key={invite._id}>
              From: {invite.sender} - Status: {invite.status}
              {invite.status === 'pending' && (
                <>
                  <button
                    className='bg-green-500 text-white px-2 py-1 ml-2 rounded'
                    onClick={() => handleRespondInvite(invite._id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className='bg-red-500 text-white px-2 py-1 ml-2 rounded'
                    onClick={() => handleRespondInvite(invite._id, 'decline')}
                  >
                    Decline
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending invitations</p>
      )}

      {/* Display friends list */}
      {friends.length > 0 && (
        <>
          <h3 className='text-white font-semibold mt-6'>Your Friends</h3>
          <ul>
            {friends.map((friend, index) => (
              <li className='text-white font-semibold' key={index}>
                {friend}
                <button
                  className='bg-blue-500 text-white px-2 py-1 ml-2 rounded'
                  onClick={() => handleFriendClick(friend)}
                >
                  Start Chat
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReceiveInput;
