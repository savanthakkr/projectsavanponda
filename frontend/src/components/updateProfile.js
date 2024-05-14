import React, { useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('accessToken');

const UpdateProfile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event, id) => {
    event.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/api/users/editProfile`, {
        email,
        password,
        name
      },{
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('An error occurred while updating your profile.');
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProfile;