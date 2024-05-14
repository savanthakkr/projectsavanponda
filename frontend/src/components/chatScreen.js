import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios";

const ChatBody = ({ socket }) => {
  const navigate = useNavigate()

  const [messages, setMessages] = useState([])
  const [messagesDatabase, setMessagesdatabase] = useState([])
  const [typingStatus, setTypingStatus] = useState("")
  const lastMessageRef = useRef(null);
  const token = localStorage.getItem('accessToken');
  const postId = localStorage.getItem('accessPostId');


  const sendMessage = async () => {
    if (message.trim() !== "") {
      try {
        const response = await axios.post(`http://localhost:5000/api/sendMessage/${postId}`, {
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
          const response = await axios.get(`http://localhost:5000/api/getMessages/${postId}`, {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json'
            }
          });
          setMessagesdatabase(response.data);
          console.log(response.data);
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
              <p>{message.sender_id}</p>
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

export default ChatBody