import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '../src/components/Login';
import Search from './components/Search';
import UpdateProduct from './components/EditProduct';
import Register from './components/Register';
import OTPscreen from './components/OtpScreen';
import SendOTPEmail from './components/sendOTPEmail';
import ForgatePass from './components/forgatePass';
import AddPost from './components/addPost';
import AllPost from './components/allPost';
import AddComment from './components/addComent';
import UpdateProfile from './components/updateProfile';
import Chat from './components/chat';
import ChatRoom from './components/chatRoom';
import socketIO from "socket.io-client"
import UserRooms from './components/roomAll';
import ChatRoomScreen from './components/chatRoomScreen';
import ChatBody from './components/chatScreen';
import ChatRoomScreenMain from './components/chatRoomScreenMain';
import UserList from './components/userList'; 
import FollowRequests from './components/followRequest';

const socket = socketIO.connect('http://localhost:5000', {
    transports: ['websocket', 'polling']
  });
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/updateProfile" element={<UpdateProfile />} />
      <Route path="/addPost" element={<AddPost />} />
      <Route path="/chatRoom" element={<ChatRoom />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/chatBody/:id" element={<ChatBody socket={socket} />} />
      <Route path="/addComment/:id" element={<AddComment />} />
      <Route path="/allPost" element={<AllPost />} />
      <Route path="/search" element={<Search />} />
      <Route path="/updateProduct/:id" element={<UpdateProduct />} />
      <Route path="/register" element={<Register />} />
      <Route path='/otp' element={<OTPscreen/>}/>
      <Route path='/sendOTP' element={<SendOTPEmail/>}/>
      <Route path='/updatePass' element={<ForgatePass/>}/>
      <Route path='/UserRooms' element={<UserRooms/>}/>
      <Route path='/userList' element={<UserList/>}/>
      <Route path='/followRequests' element={<FollowRequests/>}/>
      <Route path='/chatRoomScreen/:id' element={<ChatRoomScreen/>}/>
      <Route path='/chatRoomMainScreen/:id' element={<ChatRoomScreenMain/>}/>
    </Routes>
  );
}

export default App; 