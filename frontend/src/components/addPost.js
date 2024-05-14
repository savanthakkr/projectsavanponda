import React, { useState } from 'react';
import {  Container,  } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddPost = ({ onSubmit }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
      des: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleShowAllProducts = () => {
        navigate('/allCategory');
    }

    const handleCancel = () => {
        navigate('/allProducts');
    }
    const token = localStorage.getItem('accessToken');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.des) {
            setErrorMessage('All fields are required!');
            return;
        }
        const { des } = formData;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5000/api/addPost', true);
        xhr.setRequestHeader('Authorization', token);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log('Category created successfully');

                } else {
                    console.error('Error creating category:', xhr.responseText);

                }
            }
        };
        xhr.send(
            JSON.stringify({
              des
            })
        );
        navigate('/allPost');
    };

    return (
        <Container>
            <h1 className="text-center mt-5">Add Post</h1>
            <div className="justify-content-center mt-5">
                <div md={6}>
                    {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                    <div>
                        <div className="form-group mx-3 mt-3">
                            <label htmlFor="des">des</label>
                            <input type="text" className="form-control" id="des" name="des" value={formData.des} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='allproduct-button mt-5'>
            <button className="btn btn-primary" onClick={handleShowAllProducts}>
                        Show All Categories
                    </button>
                    <button className="btn btn-danger mr-2 mx-3" onClick={handleCancel}>
                        Cancel
                    </button>
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

export default AddPost;
