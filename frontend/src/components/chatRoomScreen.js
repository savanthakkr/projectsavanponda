import React, { useState, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client';

const ChatRoomScreen = ({ userId, partnerUserId }) => {
  const [getMessage, getMessages] = useState([]);
  const [getMessageSender, getMessagesSender] = useState([]);
  const [message, setMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState("")

  const token = localStorage.getItem('accessToken');
  const roomId = localStorage.getItem('accessRoomId');

  const socket = io.connect('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getMessagesRoom/${roomId}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });
        getMessages(response.data);
        console.log(getMessage);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchMessagesSender = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/getMessagesSenderRoom/${roomId}`, {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          });
          getMessagesSender(response.data);
          console.log(getMessage);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      fetchMessagesSender();
    fetchMessages();
  }, [token, roomId]);

  const sendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:5000/api/sendMessageRoom/${roomId}`, {
          receiverId: partnerUserId,
          content: message,
          
        },{
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
              }
        });
        

        setMessage((prevMessages) => [...prevMessages, response.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    socket.on("new_message", (newMessage) => {
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  useEffect(()=> {
    socket.on("typingResponse", data => setTypingStatus(data))
  }, [socket])



  return (
    <div>
      <h2>Chat with User {partnerUserId}</h2>
      <div>
        <p>{typingStatus}</p>
        <h3>Incoming Messages:</h3>
        {getMessage.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
        </div>
      ))}
      </div>

      <div>
        <h3>Outgoing Messages:</h3>
        {getMessageSender.map((message) => (
        <div key={message.id}>
          <p>{message.content}</p>
        </div>
      ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />
      <button onClick={() => sendMessage()}>Send</button>
    </div>
  );

};

export default ChatRoomScreen;