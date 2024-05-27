import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateUserAdmin = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem('accessToken');
  // const bookId = localStorage.getItem('accessBookId');

  const [plan, setPlan] = useState('free'); // initialize with a default value

  const [productData, setproductData] = useState({});
  
  useEffect(() => {
    const fetchproductData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getUserAdminById/${id}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setproductData(data);
        setPlan(data.plan || 'free'); // update the plan state when productData is fetched
        console.log(data)
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchproductData();
  }, [id]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setproductData({ ...productData, [name]: value });
    setPlan(value); // set the plan state here
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `http://localhost:5000/api/updateUserAdmin/${productData.id}`, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response.data);
          navigate('/UserListAdmin');
          window.location.reload();
        } else {
          console.error('Error updating product:', xhr.statusText);
        }
      };

      xhr.onerror = () => {
        console.error('Error updating product:', xhr.statusText);
      };

      xhr.send(JSON.stringify(productData));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h2>Update product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">
              ID
            </label>
            <input
              type="text"
              className="form-control"
              id="id"
              name="id"
              value={productData.id || ''}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={productData.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">email</label>
            <input type="text" className="form-control" id="email" name="email" value={productData.email} onChange={handleChange} />
          </div>
          <div>
            <input
              type="radio"
              value="free"
              checked={plan === 'free'}
              onChange={handleChange}
              name="plan" // add name attribute here
            />
            Free
          </div>
          <div>
            <input
              type="radio"
              value="premium"
              checked={plan === 'premium'}
              onChange={handleChange}
              name="plan" // add name attribute here
            />
            Premium
          </div>
          <div>
            <input
              type="radio"
              value="premium_plus"
              checked={plan === 'premium_plus'}
              onChange={handleChange}
              name="plan" // add name attribute here
            />
            Premium Plus
          </div>
          <button type="submit" className="btn btn-primary">Update product</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserAdmin;

