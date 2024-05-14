import React, { useState, useEffect } from "react";
import axios from "axios";
import io from 'socket.io-client';

const ChatScreen = ({ userId, partnerUserId }) => {
  const [getMessage, setMessages] = useState([]);
  const [getMessageSender, setMessagesSender] = useState([]);
  const [message, setMessage] = useState("");
  const [typingStatus, setTypingStatus] = useState(false);

  const token = localStorage.getItem('accessToken');
  const postId = localStorage.getItem('accessPostId');

  const socket = io.connect('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });

  useEffect(() => {
    if (!token || !postId) {
      console.error("Missing access token or post ID");
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getMessages/${postId}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [token, postId]);

  useEffect(() => {
    if (!token || !postId) {
      console.error("Missing access token or post ID");
      return;
    }

    const fetchMessagesSender = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/getMessagesSender/${postId}`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
}
        });
        setMessagesSender(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessagesSender();
  }, [token, postId]);

  useEffect(() => {
    socket.on("new_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  useEffect(()=> {
    socket.on("typingResponse", (data) => {
      setTypingStatus(data.typing);
    });

    return () => {
      socket.off("typingResponse");
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    } else {
      const debounce = setTimeout(() => {
        socket.emit("typing", { userId, partnerUserId, typing: true });
      }, 500);

      return () => clearTimeout(debounce);
    }
  };

  const handleKeyUp = () => {
    socket.emit("stop typing", { userId, partnerUserId, typing: false });
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:5000/api/sendMessage/${postId}`, {
          receiverId: partnerUserId,
          content: message
        },{
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
              }
        });

        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    console.log(getMessage);
  }, [getMessage]);

  return (
    <div>
      <h2>Chat with User {partnerUserId}</h2>
      <div>
        <p>{typingStatus ? "Typing..." : ""}</p>
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
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );

};


export default ChatScreen;