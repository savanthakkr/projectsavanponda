import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateProduct = () => {

  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    comment: ''
  });

  const token = localStorage.getItem('accessToken');



  const [productData, setproductData] = useState({});

  useEffect(() => {
    const fetchproductData = async () => {

      try {
        const response = await fetch(`http://localhost:5000/api/getPostId/${id}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setproductData(data);
        console.log(data)
        console.log(productData.id);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
    fetchproductData();
  }, [id]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setproductData({ ...productData, [name]: value });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      console.log(id);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://localhost:5000/api/addComment/${id}`, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response.data);
          navigate('/allPost');
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
          <div className="form-group mx-3 mt-3">
            <label htmlFor="comment">comment</label>
            <input type="text" className="form-control" id="comment" name="comment" value={setFormData.comment} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary">Add Comment</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;

