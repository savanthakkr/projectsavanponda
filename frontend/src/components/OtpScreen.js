import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const OTPscreen = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (location.pathname === '/') {
            localStorage.removeItem('accessToken')
        }

    })

    const handleRegister = () => {
        navigate('/register');
    };

    // localStorage.setItem('accessToken', token);
    const token = localStorage.getItem('accessToken');
    console.log(token);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp) {
            setErrorMessage('Please enter otp and email.');
            return;
        }

        if (!token) {
            try {
                const response = await axios.post('http://localhost:5000/api/users/otp', { otp });

                if (response.status === 200) {

                    const token = response.data.token;
                    localStorage.setItem('accessToken', token);
                    navigate('/allProducts');

                } else {
                    setErrorMessage('Login failed. Please try again.');
                    console.error('Login failed:', response.data.message);
                }
            } catch (error) {
                console.error('An error occurred during login:', error);
                setErrorMessage('An error occurred during login. Please try again later.');
            }
        } else {
            try {
                const response = await fetch(`http://localhost:5000/api/users/otpEmail`, {otp}, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status === 200) {
                    navigate('/forgatePass');

                } else {
                    setErrorMessage('Login failed. Please try again.');
                    console.error('Login failed:', response.data.message);
                }
            } catch (error) {
                console.error('An error occurred during login:', error);
                setErrorMessage('An error occurred during login. Please try again later.');
            }
        }


    };

    return (
        <div className="login-form ">
            <h3 className="text-center">Login</h3>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit} className="mt-3">
                {/* <Form.Group controlId="formUsername">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your username"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                        />
                        {emailError && <Form.Text className="text-danger">{emailError}</Form.Text>}
                    </Form.Group> */}

                <Form.Group controlId="otp">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="otp"
                        placeholder="Enter your otp"
                        value={otp}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Login
                </Button>
                <Button variant="primary" className="w-100 mt-3" onClick={handleRegister}>
                    SignUp
                </Button>
            </Form>
        </div>
    );
};

export default OTPscreen;