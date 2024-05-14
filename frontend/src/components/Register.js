import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });


  const navigate = useNavigate()

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const routeChange = () =>{ 
    let path = `/`; 
    navigate(path);
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
  
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:5000/api/users/register', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
  
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response.data); 
          navigate('/');
        } else {
          console.error(' registering :', xhr.statusText);
        }
      };
  
      xhr.onerror = () => {
        console.error('Error registering :', xhr.statusText);
      };
  
      xhr.send(JSON.stringify(formData));
      
  console.log(formData);
    } catch (error) {
      console.error('Error registering :', error);
    }
  };





  return (
    <div className="container mt-5">
      <div className="row justify-content-center"> 
        <div className="col-md-6">
          <h2>Register Book</h2>
          <form onSubmit={handleSubmit}>
             <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div> 
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <textarea className="form-control" id="Email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password </label>
              <input type="Password" className="form-control" id="Password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
            {/* <div className="mb-3">
              <label htmlFor="mobile" className="form-label">Mobile </label>
              <input type="Number" className="form-control" id="Mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} />
            </div> */}
            <button type="submit" className="btn btn-primary">Register</button>
            <button type="submit" className="btn btn-primary" onClick={routeChange}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );  
};

export default Register;




