import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios";

const ChatRoomScreenMain = ({ socket }) => {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [messagesDatabase, setMessagesdatabase] = useState([])
  const [messagesDatabaseName, setMessagesdatabaseName] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);
  const token = localStorage.getItem('accessToken');
  const roomId = localStorage.getItem('accessRoomId');

  const sendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:5000/api/sendMessageRoom/${roomId}`, {
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

    const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/getMessagesRoom/${roomId}`, {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          });
          setMessagesdatabase(response.data[0]);
          setMessagesdatabaseName(response.data[1])
          console.log(response.data[0]);
          console.log(...response.data[1]);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    if (socket) {
      socket.on("messageResponse", data => setMessages([...messages, data]))
    }
  }, [socket, messages])

  useEffect(() => {
    if (socket) {
      socket.on("typingResponse", data => setTypingStatus(data))
    }
  }, [socket, typingStatus, setTypingStatus])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [message, setMessage] = useState("")
  const handleTyping = () => {
    if (socket && localStorage.getItem("userName")) {
      socket.emit("typing", `${localStorage.getItem("userName")} is typing`)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && localStorage.getItem("userName")) {
      socket.emit("message", {
        text: message,
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id
      })
    }
    setMessage("")
  }

  return (
    <>
    {messagesDatabaseName.map(message => (
         <div className="message__chats" key={message.id}>
         <p>{message.userSelected_Name}</p>
        
       </div>
        ))}
      <div className='message__container'>
        {messages.map(message => (
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className='sender__name'>You</p>
              <div className='message__sender'>
                <p>{message.text}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className='message__recipient'>
                <p>{message.text}</p>
              </div>
            </div>
          )
        ))}

        {messagesDatabase.map(message => (
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className='sender__name'>You</p>
              <div className='message__sender'>
                <p>{message.content}</p>
              </div>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.user_id}</p>
              <div className='message__recipient'>
                <p>{message.content}</p>
              </div>
            </div>
          )
        ))}

        <div className='message__status'>
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>

      <form className='form' onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder='Write message'
          className='message'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleTyping}
        />
        <button onClick={sendMessage} className="sendBtn">SEND</button>
      </form>
    </>
  )
}

export default ChatRoomScreenMain