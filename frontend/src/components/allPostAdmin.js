import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GetPostAdmin = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessTokenAdmin');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getPostAdmin',{
            headers: {
                Authorization: token,
              },
        });
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Description</th>
          <th>User Name</th>
          <th>Comments</th>
          <th>Comments Count</th>
          <th>Like Count</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.des}</td>
            <td>{post.userName}</td>
            <td>{post.comments}</td>
            <td>{post.commentCount}</td>
            <td>{post.likeCount}</td>
            <button className="Edit" type="button" onClick={() => navigate(`/updatePostAdmin/${post.id}`)}>
                  Edit Post
                </button>
                <button className="Edit" type="button" onClick={() => navigate(`/getCommentsByPostId/${post.id}`)}>
                  Show Comment
                </button>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GetPostAdmin;