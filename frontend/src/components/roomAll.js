import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"
import axios from 'axios';



const UserRooms = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
  
    // Decode the token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;
  
    const fetchUserRooms = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/findRoomByUserId/${userId}`, {
            headers: {
              Authorization: token,
            },
          });
      
          console.log("Response data:", response.data[0].user_id);
      
          setRooms(response.data);
          console.log("Rooms:", response.data);
        } catch (error) {
          console.error("Error fetching user rooms:", error);
        }
      };
  
    useEffect(() => {
      fetchUserRooms();
    }, []);
  
    return (
      <div>
        <h1>User Rooms</h1>
        <ul>
          {rooms &&
            rooms.map((room) => (
              <li key={room.id}>Room ID: {room.id}, Room Name: {room.user_id}</li>,
              <li><button className="btn btn-primary btn-sm mx-5" type="button" onClick={() => {
                localStorage.setItem('accessRoomId', room.id);
                navigate(`/chatRoomMainScreen/${localStorage.getItem('accessRoomId')}`);
              }}>
                Chat room
              </button></li>
            ))}
        </ul>
      </div>
    );
  };
  
  export default UserRooms;