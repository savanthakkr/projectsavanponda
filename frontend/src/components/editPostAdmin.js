import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdatePostAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem('accessToken');

  const [productData, setproductData] = useState({
    id: '',
    des: '',
    plan: 'free',
  });

  useEffect(() => {
    const fetchproductData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getPostAdminById/${id}`, {
          headers: {
            'Authorization': token
          }
        });
        const data = await response.json();
        setproductData(data);
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
      const updatedData = {
        des: productData.des,
        // Add other properties to update here
      };

      const response = await axios.put(`http://localhost:5000/api/updatePostAdmin/${productData.id}`, updatedData, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        console.log('Updated successfully');
        navigate('/getPostAdmin');
      } else {
        console.error('Failed to update');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <h3>Update Product</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="des" className="form-label">Name</label>
              <input type="text" className="form-control" id="des" name="des" value={productData.des} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Update product</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePostAdmin;