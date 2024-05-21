import React, { useState, useEffect } from 'react';

const FollowRequests = () => {
  const [followRequests, setFollowRequests] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const getFollowRequests = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/getFollowRequests', {
            headers: {
              Authorization: token,
            },
          });
      
          if (!response.ok) {
            throw new Error('Error fetching follow requests');
          }
      
          const data = await response.json();
          setFollowRequests(data);
        } catch (error) {
          console.error(error);
        }
      };

    getFollowRequests();
  }, []);

  const handleAccept = async (followingId, followerId) => {
    const response = await fetch('http://localhost:5000/api/acceptFollowRequest', {
      method: 'PUT',
      body: JSON.stringify({ followingId, followerId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.ok) {
      setFollowRequests((prevFollowRequests) =>
        prevFollowRequests.filter((req) => req.following_user_id !== followingId)
      );
    }
  };

  const handleDecline = async (followingId) => {
    const response = await fetch('http://localhost:5000/api/declineFollowRequest', {
      method: 'POST',
      body: JSON.stringify({followingId}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.ok) {
      setFollowRequests((prevFollowRequests) =>
        prevFollowRequests.filter((req) => req.following_user_id !== followingId)
      );
    }
  };

  return (
    <div>
      <h2>Follow Requests</h2>
      <ul>
        {followRequests.map((req) => (
          <li key={req.following_id}>
            {req.username}
            
            <p>{req.follower_id}</p>
            <button onClick={() => handleAccept([req.following_id , req.follower_id])}>
              Accept
            </button>
            <button onClick={() => handleDecline(req.follower_id)}>
              Decline
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowRequests;