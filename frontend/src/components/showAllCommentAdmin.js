import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GetCommentsByPostId = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem('accessTokenAdmin');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getCommnetsAdminById/${id}`,{
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
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.comment}</td>
            <td>{post.userName}</td>
                <button className="Edit" type="button" onClick={() => navigate(`/updateCommentsById/${post.id}`)}>
                  Edit Comment
                </button>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GetCommentsByPostId;