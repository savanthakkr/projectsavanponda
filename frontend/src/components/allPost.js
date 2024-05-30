import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from "socket.io-client";


const token = localStorage.getItem('accessToken');

const socket = io.connect("http://localhost:5000", {
  transports: ['websocket', 'polling']
});

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [FollowStatus, setFollowStatus] = useState([]);
  const [SubscribePlan, setSubscribePlan] = useState([]);
  // const [like, setLike] = useState(0);
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const [dislike, setDislike] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const navigate = useNavigate();

  const [like, setLike] = React.useState(false);

  useEffect(() => {
    const fetchPosts = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:5000/api/getPost', true);
      xhr.setRequestHeader('Authorization', token);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            setPosts(JSON.parse(xhr.responseText));
            console.log(posts);
          } else {
            console.error('Error fetching products:', xhr.statusText);
          }
        }
      };
      xhr.send();
    };


    const getFollowStatus = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:5000/api/getFollowStatus', true);
      xhr.setRequestHeader('Authorization', token);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            setFollowStatus(JSON.parse(xhr.responseText));
            console.log(FollowStatus);
          } else {
            console.error('Error fetching products:', xhr.statusText);
          }
        }
      };
      xhr.send();
    };

    const getSubscribePlan = () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:5000/api/getSubscribePlan', true);
      xhr.setRequestHeader('Authorization', token);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            setSubscribePlan(JSON.parse(xhr.responseText));
            console.log(SubscribePlan);
          } else {
            console.error('Error fetching products:', xhr.statusText);
          }
        }
      };
      xhr.send();
    };

    getFollowStatus();
    fetchPosts();
    getSubscribePlan();
  }, []);

  const handleAddPost = () => {
    navigate('/addPost');
  }
  const handleUpdateProfile = () => {
    navigate('/updateProfile');
  }
  const handleAddComment = () => {
    navigate('/addComment');
  }

  const handleLikeClick = (postId) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:5000/api/addlike', true);
    xhr.setRequestHeader('Authorization', token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === postId ? { ...post, likeCount: post.likeCount + 1 } : post
            )
          );
        } else {
          console.error('Error adding like:', xhr.responseText);
        }
      }
    };
    xhr.send(JSON.stringify({ postId }));
  };


  const handleFollowClick = async (userId) => {
    try {


      console.log(userId === posts[2].userId);

      if (userId != posts[2].userId) {
        const response = await axios.post('http://localhost:5000/api/userFollow', { followingId: userId }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });


        if (response.status === 200) {
          setPosts(prevPosts =>
            prevPosts.map(post =>
              userId === post.userId
                ? { ...post, isFollowing: !post.isFollowing }
                : post,

            ),

          );
          console.log(posts[2].userId);
          if (response.data.message === 'Followed successfully') {
            setIsFollowing(true);
          } else if (response.data.message === 'Unfollowed successfully') {
            setIsFollowing(false);
          }
          console.log(userId);
        } else {
          console.error('Error adding like:', response.data);
        }
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };




  const handleLike = async (userId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/adddlikedislike', { postId: userId }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPosts(prevPosts =>
          prevPosts.map(post =>
            userId === post.id
          )
        );
        console.log(userId);
      } else {
        console.error('Error adding like:', response.data);
      }
    } catch (error) {
      console.error('Error adding like:', error);
    }
  };
  const handleLogout = () => {
    //localStorage.removeItem('accessToken');
    navigate('/');
  }
  const handleCreateRoomClick = () => {
    navigate('/chatRoom');
  };

  const handleCreateShowRoom = () => {
    navigate('/UserRooms');
  };

  const handleCreateUser = () => {
    navigate('/userList');
  };


  const handleFollowRequest = () => {
    navigate('/followRequests');
  };
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  return (
    <div>
      <button className="btn btn-primary btn-sm mx-3" type="button" onClick={handleAddPost}>Add Post</button>
      <button className="btn btn-primary btn-sm mx-3" type="button" onClick={handleUpdateProfile}>Update Profile</button>
      <button className="btn btn-warning btn-sm mx-5" type="button" onClick={handleLogout}>Log Out</button>
      <button onClick={handleCreateRoomClick}>Create Chat Room</button>
      <button onClick={handleFollowRequest}>followRequests</button>
      <button onClick={handleCreateUser}>user List</button>
      <p>currentPlan = {SubscribePlan.plan}</p>
      
      <button onClick={handleCreateShowRoom}>show All Room</button>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.des}</h2>
          <h2>{post.userId}</h2>
          <h2>{post.userName}</h2>
          <p>Comments: {post.comments}</p>
          <p>Likes: {post.likeCount}</p>
          <button onClick={() => handleLike(post.id)}>Like</button>
          {/* <button onClick={() => handleFollowClick(post.userId)}>
                {post.isFollowing ? 'Unfollow' : 'Follow'}
              </button> */}
          {/* <button className="Edit" type="button" onClick={() => navigate(`/addComment/${post.id}`)}>
            Add Comment
          </button> */}
          <button className="Edit" type="button" onClick={() => navigate(`/updateProduct/${post.id}`)}>
            Add Comment
          </button>
          <button onClick={() => addToCart(post)}>Add to Cart</button>
          {/* <button className="btn btn-primary btn-sm mx-5" type="button" onClick={() => {
            localStorage.setItem('accessPostId', post.userId);
            navigate(`/chatBody/${localStorage.getItem('accessPostId')}`);
          }}>
            Chat
          </button> */}
          {/* <button  onClick={() => handleLikeDislikeClick(post.id)}>
            {like === 1 ? 'Unlike' : dislike === 1 ? 'Like' : 'Like'}
          </button> */}
        </div>

      ))}
      <h2>Cart:</h2>
      <ul>
        {cart.map((product) => (
          <li key={product.id}>{product.des}</li>
        ))}
      </ul>
    </div>
    
  );
};

export default Posts;