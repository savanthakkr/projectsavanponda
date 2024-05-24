import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserListAdmin = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('accessTokenAdmin');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        console.error('Error: access token not found');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/getUserProfileAllAdmin', {
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

  const handleDelete = (id) => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/api/deleteUserAdmin/${id}`);
    xhr.setRequestHeader('Authorization', token);
    xhr.onload = () => {
        if (xhr.status === 200) {
            navigate('/UserListAdmin');
            window.location.reload();
        } else {
            console.error('Failed to delete the user');
        }
    };
    xhr.onerror = () => {
        console.error('Error making the delete request');
    };
    xhr.send();
    console.log('delete user with id ', id);
  };

  const routeAdmin = () => {
    let path = `/AddUserAdmin`; 
    navigate(path);
  }

  return (
    <div>
        <button type="submit" className="btn btn-primary w-10" onClick={routeAdmin}>AddUserAdmin</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.id}</td>
              <td>{user.plan}</td>
              <td>
                <button className="Edit" type="button" onClick={() => navigate(`/UpdateUserAdmin/${user.id}`)}>
                  Edit
                </button>
                <button className="Delete" type="button" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListAdmin;


// Auto refresh page when open page 