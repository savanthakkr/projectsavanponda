import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SendOTPEmail = () => {
    const location = useLocation()
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect(()=>{
    //     if(location.pathname === '/'){
    //         localStorage.removeItem('accessToken')
    //     }
 
    // })

    const handleRegister = () => {
        navigate('/register');
    };
    const token = localStorage.getItem('accessToken');

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     // const { email } = setEmail;

    //     // if (!email) {
    //     //     setErrorMessage('All fields are required!');
    //     //     return;
    //     // }
        
    //     console.log(email);

    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', 'http://localhost:5000/api/users/sendotp', true);
    //     // xhr.setRequestHeader('Authorization', token);
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === XMLHttpRequest.DONE) {
    //             if (xhr.status === 200) {
    //                 console.log('OTP Send successfully');

    //             } else {
    //                 console.error('Error Send OTP:', xhr.responseText);

    //             }
    //         }
    //     };
    //     xhr.send(
    //         JSON.stringify({
    //             email
    //         })
    //     );
    //     navigate('/otp');
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if email or password is empty
        if (!email ) {
            setErrorMessage('Please enter both email and password.');
            return;
        }

        // Check if email is valid
        // if (!EMAIL_REGEX.test(email)) {
        //     setEmailError('Please enter a valid email address.');
        //     return;
        // }

        try {
            const response = await axios.post('http://localhost:5000/api/users/passwordOTP', { email });
            console.log(response);

            if (response.status === 200) {

                // const token = response.data.token;
                // localStorage.setItem('accessToken', token);
                navigate('/otp');

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
        <div className="login-form ">
                <h3 className="text-center">Login</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group controlId="formUsername">
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
                    </Form.Group>

                    {/* <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group> */}

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

export default SendOTPEmail;