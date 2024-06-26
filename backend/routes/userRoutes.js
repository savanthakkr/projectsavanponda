const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require("../middlewares/roleMiddleware");

const {subscribePlan, deleteUserAdmin, getUserAdminById, updateUserAdmin, getUserProfileAllAdmin, adminLoginUser, getSubscribePlan, registerUser,getUserProfileFollowOnly,updateUserProfile, loginUser,sendMessageRoom,getMessagesSenderRoom,getMessagesRoom, findRoomByUserId, getUserProfile, getImage, OTPVerify,createRoom, sendPasswordOTP, OTPVerifyEmail, updatepassword } = userController; 

// Register a new user
router.post('/users/register', registerUser);


router.post('/users/passwordOTP', sendPasswordOTP);

router.post('/createRoom',verifyToken, createRoom);

router.post('/users/adminLoginUser', adminLoginUser);

router.put('/subscribe',verifyToken, subscribePlan);

router.post('/sendMessageRoom/:id',verifyToken, sendMessageRoom);

router.post('/users/otpEmail', OTPVerifyEmail);

router.post('/users/otp', OTPVerify);

// Login
router.post('/users/login', loginUser);



// Get user profile by id
router.get('/users/profile',verifyToken, getUserProfile);

router.get('/users/getUserProfileAllAdmin',verifyToken, getUserProfileAllAdmin);

router.get('/getSubscribePlan',verifyToken, getSubscribePlan);


router.delete('/deleteUserAdmin/:id',verifyToken, deleteUserAdmin);

router.get('/getUserAdminById/:id',verifyToken, getUserAdminById);

// Update a product 
router.put('/updateUserAdmin/:id',verifyToken, updateUserAdmin);


router.get('/users/getUserProfileFollowOnly',verifyToken, getUserProfileFollowOnly);

router.get('/getMessagesSenderRoom/:id',verifyToken, getMessagesSenderRoom);

router.get('/getMessagesRoom/:id',verifyToken, getMessagesRoom);

router.get('/findRoomByUserId/:id',verifyToken, findRoomByUserId);

// Update user profile 
router.put('/users/editProfile/:id',verifyToken, getImage); 

router.put('/users/editProfile',verifyToken, updateUserProfile); 


router.put('/users/updatePass',verifyToken, updatepassword); 

module.exports = router;
