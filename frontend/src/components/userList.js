import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
    const [roomId, setRoomId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followingState, setFollowingState] = useState({});
    const [followedUsersCount, setFollowedUsersCount] = useState(0);
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken');

    const handleFollow = async (userId) => {
        if (!token) {
            console.error('Error: access token not found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/followApi', {
                userId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error in the API request');
            }

            setFollowingState({ ...followingState, [userId]: true });
            localStorage.setItem('followingState', JSON.stringify({ ...followingState, [userId]: true }));
            setFollowedUsersCount(followedUsersCount + 1);
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
            const response = await axios.post('http://localhost:5000/api/unfollowApi', {
                userId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error in the API request');
            }

            setFollowingState({ ...followingState, [userId]: false });
            localStorage.setItem('followingState', JSON.stringify({ ...followingState, [userId]: false }));
            setFollowedUsersCount(followedUsersCount - 1);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleConfirmFollow = async (followId) => {
        if (!token) {
            console.error('Error: access token not found');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/confirm', {
                followId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error in the API request');
            }

            // Update following state
            setFollowingState({ ...followingState, [followId]: true });
            localStorage.setItem('followingState', JSON.stringify({ ...followingState, [followId]: true }));
        } catch (error) {
            console.error('Error confirming follow:', error);
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
        if (storedFollowingState) {
            setFollowingState(JSON.parse(storedFollowingState));
        }
    }, []);

    useEffect(() => {
        setFollowedUsersCount(Object.values(followingState).filter(Boolean).length);
    }, [followingState]);

    const fetchFollowers = async () => {
        if (!token) {
            console.error('Error: access token not found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/followers', {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error in the API request');
            }

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    };

    const fetchFollowing = async () => {
        if (!token) {
            console.error('Error: access tokennot found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/following', {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status !== 200) {
                throw new Error('Error in the API request');
            }

            console.log(response.data);
        } catch (error) {
            console.error('Error fetching following:', error);
        }
    };

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
                        {followingState[user.id] ? (
                            <button onClick={() => handleUnfollow(user.id)}>Unfollow</button>
                        ) : (
                            <button onClick={() => handleFollow(user.id)}>Follow</button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={fetchFollowers}>Fetch followers</button>
            <button onClick={fetchFollowing}>Fetch following</button>
            <h1>Confirm follow requests:</h1>
            <div>
                <h1>Follow Requests:</h1>
                {followRequests.map((request) => (
                    <div key={request.id}>
                        <label>{request.username} wants to follow you</label>
                        <button onClick={() => handleConfirmFollow(request.id)}>Confirm</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;