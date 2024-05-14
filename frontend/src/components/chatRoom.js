import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatRoom = () => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserNames, setSelectedUserNames] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  const createRoom = async () => {
    if (!token) {
      console.error('Error: access token not found');
      return;
    }

    if (selectedUsers.length === 0) {
      console.error('Error: no users selected');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/createRoom', {
        selectedUsers,
        selectedUserNames,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.status !== 200) {
        throw new Error('Error in the API request');
      }

      const data = response.data;
      setRoomId(data.roomId);
    } catch (error) {
      console.error('Error creating room:', error);
      // Handle error here
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

  return (
    <div>
      <h1>Select users to chat with:</h1>
      <div>
        {posts.map((user) => (
          <div key={user.id}>
            <input
              type="checkbox"
              value={user.id}
              checked={selectedUsers.includes(user.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedUsers([...selectedUsers, user.id]);
                  setSelectedUserNames([...selectedUserNames, user.name]);
                } else {
                  setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                  setSelectedUserNames(selectedUserNames.filter((name) => name !== user.name));
                }
              }}
            />
            <label>{user.name}</label>
          </div>
        ))}
      </div>
      <button onClick={createRoom} disabled={selectedUsers.length === 0}>Create Room</button>
    </div>
  );
};

export default ChatRoom;