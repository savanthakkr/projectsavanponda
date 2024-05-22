import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
    const [plan, setPlan] = useState('free');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [planDetails, setPlanDetails] = useState([]);
    // Replace this with the actual user ID
    const token = localStorage.getItem('accessToken'); // Replace this with the actual token



    useEffect(() => {
        const getFollowRequests = async () => {
            try {
              const response = await fetch('http://localhost:5000/api/getPlanDetails', {
                headers: {
                  Authorization: token,
                },
              });
          
              if (!response.ok) {
                throw new Error('Error fetching follow requests');
              }
          
              const data = await response.json();
              setPlanDetails(data);
              console.log(planDetails);
            } catch (error) {
              console.error(error);
            }
          };
    
        getFollowRequests();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                'http://localhost:5000/api/subscribe',
                { plan },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            );

            console.log(token);

            setMessage(response.data.message);
            navigate('/allPost');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage('An error occurred');
            }
        }
    };

    return (
        <div>
            <h1>Subscription</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Plan:
                    <div>
                        <input
                            type="radio"
                            value="free"
                            checked={plan === 'free'}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        Free
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="premium"
                            checked={plan === 'premium'}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        Premium
                    </div>
                    <div>
                        <input
                            type="radio"
                            value="premium_plus"
                            checked={plan === 'premium_plus'}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        Premium Plus
                    </div>
                </label>
                <button type="submit">Subscribe</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Subscription;