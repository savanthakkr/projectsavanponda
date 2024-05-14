import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgatePass = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassowrd] = useState('');

    useEffect(()=>{
        if(location.pathname === '/'){
            localStorage.removeItem('accessToken')
        }
 
    })

    const [formData, setFormData] = useState({
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const token = localStorage.getItem('accessToken');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email or password is empty
        if (!password ) {
            setErrorMessage('Please enter both email and password.');
            return;
        }
        console.log(setPassowrd);


        // Check if email is valid
        // if (!EMAIL_REGEX.test(email)) {
        //     setEmailError('Please enter a valid email address.');
        //     return;
        // }

        try {
            const response = await axios.put('http://localhost:5000/api/users/updatePass', {password}, {
                headers: {
                    'Authorization': token
                }
            });
            console.log(password);

            if (response.status === 200) {

                // const token = response.data.token;
                // localStorage.setItem('accessToken', token);
                navigate('/allProduct');

            } else {
                setErrorMessage('Login failed. Please try again.');
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setErrorMessage('An error occurred during login. Please try again later.');
        }
    };

    return (
        <Container>
            <h1 className="text-center mt-5">Change Password</h1>
            <div className="justify-content-center mt-5">
                <div md={6}>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    <div>
                        <div className="form-group mx-3 mt-3">
                            <label htmlFor="password">password</label>
                            <input type="password" className="form-control" id="password" name="password" value={password}
                            onChange={(e) => {
                                setPassowrd(e.target.value);
                                // setEmailError('');
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='allproduct-button mt-5'>
            {/* <button className="btn btn-primary" onClick={handleShowAllProducts}>
                        Show All Categories
                    </button> */}
                    {/* <button className="btn btn-danger mr-2 mx-3" onClick={handleCancel}>
                        Cancel
                    </button> */}
                    {/* <div>
                        <p>{setCategory.categoryName}</p>
                    </div> */}
                    <button className="btn btn-primary mr-2 mx-3" onClick={handleSubmit}>
                        Submit
                    </button>
            </div>
            
        </Container>
    );
};

export default ForgatePass;