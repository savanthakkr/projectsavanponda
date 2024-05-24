import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [roomId, setRoomId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followingState, setFollowingState] = useState({});
  const [followRequestStatus, setFollowRequestStatus] = useState({});
  const [followedUsersCount, setFollowedUsersCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const handleFollow = async (userId) => {
    if (!token) {
      console.error('Error: access token not found');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/follow', {
        followingId: userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status !== 200) {
        throw new Error('Error in the API request');
      }

      setFollowRequestStatus({ ...followRequestStatus, [userId]: 'pending' });
      setFollowingState({ ...followingState, [userId]: false });
      localStorage.setItem('followingState', JSON.stringify({ ...followingState, [userId]: true }));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId) => {
    if (!token) {
      console.error('Error: access token not found');
      return;
    }

    try {
      const response = await axios.delete('http://localhost:5000/api/unfollow', {
        data: {
          followingId: userId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status !== 200) {
        throw new Error('Error in the API request');
      }

      setFollowRequestStatus({ ...followRequestStatus, [userId]: null });
      setFollowingState({ ...followingState, [userId]: false });
      localStorage.setItem('followingState', JSON.stringify({ ...followingState, [userId]: false }));
      setFollowedUsersCount(followedUsersCount - 1);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        console.error('Error: access token not found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          throw new Error('Error in the API request');
        }

        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [token]);

  useEffect(() => {
    if (roomId) {
      navigate(`/chat/${roomId}`);
    }
  }, [roomId, navigate]);

  useEffect(() => {
    const storedFollowingState = localStorage.getItem('followingState');
    console.log(storedFollowingState);
    if (storedFollowingState) {
      setFollowingState(JSON.parse(storedFollowingState));
    }
  }, []);

  useEffect(() => {
    setFollowedUsersCount(Object.values(followingState).filter(Boolean).length);
  }, [followingState]);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!token) {
        console.error('Error: access token not found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/getFollowStatus', {
          headers: {
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          throw new Error('Error in the API request');
        }

        const followStatus = response.data;
        setFollowingState(followStatus);
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    fetchFollowStatus();
  }, [token]);

  return (
    <div>
      <h1>Select users to chat with:</h1>
      <div>
        <div>
          <label>Followed users count:</label>
          <span>{followedUsersCount}</span>
        </div>
        {posts.map((user) => (
          <div key={user.id}>
            <label>{user.name}</label>
            <label>{user.id}</label>
            {followRequestStatus[user.id] === 'pending' ? (
              <span>Pending</span>
            ) : followingState[user.id] ? (
              <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
            ) : (
              <button onClick={() => handleFollow(user.id)}>Follow</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;