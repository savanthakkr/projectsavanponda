const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');



const generateToken = (user) => {
  const payload = {
    email: user.email,
    password: user.password,
    id: user.id,
  };
  return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};





// Function to register a new user
// const registerUser = async (req, res) => {
//   try {

//     const { firstName, lastName, email, password, gender, hobbies} = req.body;

//     console.log(req.files);

//     const profile_pic= req.files.profile_pic


//     const dirExists = fs.existsSync(`public/assets/`);

//     if (!dirExists) {
//       fs.mkdirSync(`public/assets/`, { recursive: true });
//     }

//     if (profile_pic == undefined || profile_pic == null) throw new Error("file not found!");

//     let savePath = `/public/assets/${Date.now()}.${profile_pic.name.split(".").pop()}`




//     profile_pic.mv(path.join(__dirname, ".." + savePath), async (err) => {
//       if (err) throw new Error("error in uploading")



//       else {

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const result = await sequelize.query(
//           'INSERT INTO users (firstName, lastName, email, password, gender, hobbies, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)',
//           {
//             replacements: [firstName, lastName, email, hashedPassword, gender, hobbies, savePath],
//             type: QueryTypes.INSERT
//           }
//         );
//         res.json({ message: `User created!` });
//       }
//     });

//   } catch (error) {

//     console.error('Error registering user:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sponda.netclues@gmail.com',
    pass: 'qzfm wlmf ukeq rvvb'
  }
});

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
const otpganrate = Math.floor(100000 + Math.random() * 900000);
const now = new Date();
const expiration_time = AddMinutesToDate(now, 10);

const genrateOTP = () => {
  const payload = {
    otpganrate,
    now,
    expiration_time,
  };
  return (payload);

}
const otpPassword = Math.floor(1000 + Math.random() * 9000);

function generateOTPS() {
  const payload = {
    otpPassword,
    now,
    expiration_time,
  };
  return (payload);
}

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sponda.netclues@gmail.com',
      pass: 'qzfm wlmf ukeq rvvb'
    }
  });

  const mailOptions = {
    from: 'sponda.netclues@gmail.com',
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTPS();
    console.log(otp);



    // Send OTP via email
    await sendEmail({
      to: email,
      subject: 'Your OTP',
      message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}



const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await sequelize.query(
      'SELECT * FROM users WHERE email = ?',
      {
        replacements: [email],
        type: QueryTypes.SELECT
      }
    );

    if (existingUser.length === 0) {
      const result = await sequelize.query(
        'INSERT INTO users (email, password, name, loginType) VALUES (?, ?, ?, ?)',
        {
          replacements: [email, password, name, 'Login'],
          type: QueryTypes.INSERT
        }
      );
    } else {
      console.log("user already registered");
      res.status(400).json({ error: 'User already registered' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};






const OTPVerifyEmail = async (req, res) => {
  try {
    const { otp } = req.body; // get both otp and email from request body

    const existingUser = await sequelize.query('SELECT * FROM users WHERE email');
    if (existingUser) {
      const user = existingUser;

      if (otp == otpPassword) {
        const currentTime = new Date();
        const otpExpiryTime = new Date(expiration_time);

        if (currentTime < otpExpiryTime) {
          const token = generateToken(user);
          const userId = user.id;
          const userRole = user.userRole;

          return res.status(200).send({ message: 'Login success!', token: token, userId: userId, userRole: userRole });
        } else {
          return res.status(401).send({ message: 'OTP has expired! Please request for a new OTP.' });
        }
      } else {
        return res.status(401).send({ message: 'Invalid OTP! Please enter a valid OTP.' });
      }
    } else {
      return res.status(404).send({ message: 'Email not found! Sign up!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
};

const OTPVerify = async (req, res) => {
  try {
    const { otp } = req.body; // get both otp and email from request body

    const existingUser = await sequelize.query('SELECT * FROM users WHERE email');
    if (existingUser) {
      const user = existingUser;

      if (otp == otpganrate) {
        const currentTime = new Date();
        const otpExpiryTime = new Date(expiration_time);

        if (currentTime < otpExpiryTime) {
          const token = generateToken(user);
          const userId = user.id;
          const userRole = user.userRole;

          return res.status(200).send({ message: 'Login success!', token: token, userId: userId, userRole: userRole });
        } else {
          return res.status(401).send({ message: 'OTP has expired! Please request for a new OTP.' });
        }
      } else {
        return res.status(401).send({ message: 'Invalid OTP! Please enter a valid OTP.' });
      }
    } else {
      return res.status(404).send({ message: 'Email not found! Sign up!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
};


// i want to check user enter otp is valid or not and if valid then verify otp and go to home screen 

// Function to login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existingUser] = await sequelize.query('SELECT * FROM users WHERE email = ? AND password = ?',
      { replacements: [email, password], type: QueryTypes.SELECT });

      const [existingUserLoginWith] = await sequelize.query('SELECT loginType FROM users WHERE email = ? ',
      { replacements: [email], type: QueryTypes.SELECT });

    if (existingUser && existingUserLoginWith.loginType == 'Login') {

      const user = existingUser;

      const token = generateToken(user);
      const userId = user.id;

      return res.status(200).send({ message: 'Login success!', token: token, userId: userId});
    } else {
      return res.status(404).send({ message: 'Email not found! Sign up!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await sequelize.query(
      'SELECT * FROM users WHERE id != :userId',
      {
        replacements: { userId },
        type: sequelize.QueryTypes.SELECT
      }
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const { email, password, name } = req.body;

    await sequelize.query(
      'UPDATE users SET email = ?, password = ?, name = ? WHERE id = ?',
      {
        replacements: [email, password, name, userId],
        type: sequelize.QueryTypes.UPDATE
      }
    );

    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getImage = async (req, res) => {
  try {
    console.log(req.files)
    let id = req.params.id
    let image = req.files.profile_pic //key and auth


    if (image.length > 1) {
      throw new error('multiple file not allowed!')
    }

    const dirExists = fs.existsSync(`public/assets/`);

    if (!dirExists) {
      fs.mkdirSync(`public/assets/`, { recursive: true });
    }

    if (image == undefined || image == null) throw new Error("file not found!");

    let savePath = `/public/assets/${Date.now()}.${image.name.split(".").pop()}`

    image.mv(path.join(__dirname, ".." + savePath), async (err) => {
      if (err) throw new Error("error in uploading")

      else {
        const updateQuery = 'UPDATE users SET profile_pic = :profile_pic WHERE id = :id';

        await sequelize.query(updateQuery, {
          replacements: { profile_pic: savePath, id: id },
          type: sequelize.QueryTypes.UPDATE
        });
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'error in file upload api!' });
  }
}



const updatepassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const email = req.user.email;
    console.log(userId);
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.query(
      'UPDATE users SET password = ? WHERE email = ?',
      { replacements: [hashedPassword, email], type: QueryTypes.UPDATE }
    );
    res.json({ message: 'password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { selectedUsers, selected_Users_Name } = req.body;
    const userId = req.user.id;


    const userSelected_id = JSON.stringify(selectedUsers);
    const userSelected_Name = JSON.stringify(selected_Users_Name);

    console.log(userSelected_id);
    console.log(userSelected_Name);
    console.log(req.body);


    

    console.log(selectedUsers);

    await sequelize.query(
      'INSERT INTO rooms (user_id, userSelected_Name, created_user_id) VALUES (?, ?, ?)',
      {
        replacements: [userSelected_id,userSelected_Name, userId],
        type: sequelize.QueryTypes.INSERT
      }
    );
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const findRoomByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log(userId);

    const rooms = await sequelize.query(
      'SELECT user_id FROM rooms ',
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(rooms[0].user_id);

    const finduserIdFromRoom = rooms[0].user_id.includes(userId); 


    console.log(finduserIdFromRoom);


    const roomsCreatedId = await sequelize.query(
      'SELECT created_user_id FROM rooms ',
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const finduserIdFromCreatedRoom = roomsCreatedId.includes(userId); 

    console.log(finduserIdFromCreatedRoom);


    if(finduserIdFromRoom || finduserIdFromCreatedRoom){
      const roomsGet = await sequelize.query(
        'SELECT * FROM rooms ',
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      res.json(roomsGet);
    }


    

  } catch (error) {
    console.error('Error finding room by user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const googleLogin = async (req, res) => {
  
  const [existingUser] = await sequelize.query('SELECT * FROM users WHERE email = ? ',
    { replacements: [req.user.email], type: QueryTypes.SELECT });

    if (!existingUser) {
      const result = await sequelize.query(
        'INSERT INTO users (email, name, password, loginType) VALUES (?, ?, ?, ?)',
        {
          replacements: [req.user.email, req.user.name, null, 'google'],
          type: QueryTypes.INSERT
        }
      );
      res.redirect('http://localhost:3000');
    } else if(existingUser){


      const [existingUserLoginWith] = await sequelize.query('SELECT loginType FROM users WHERE email = ? ',
      { replacements: [req.user.email], type: QueryTypes.SELECT });

      console.log(existingUserLoginWith.loginType);

      if(existingUserLoginWith.loginType == 'google'){
        const token = generateToken(existingUser);
        console.log(token);
        const decoded = jwt.verify(token, 'crud');
        console.log(decoded);
        console.log(existingUser.id);
        console.log("user login with google" , token);
        res.redirect('http://localhost:3000/allPost');
      }else{
        console.log("user not login with google");
      }
      

    }else{
      res.message('faileld');
    }

}

// const findRoomByUserId = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const rooms = await sequelize.query(
//       'SELECT user_id FROM rooms ',
//       {
//         type: sequelize.QueryTypes.SELECT,
//       }
//     );

//     const roomExists = rooms.map(room => room.user_id === userId);

//     if (!roomExists) {
//       res.status(404).json({ error: 'Room not found' });
//       return;
//     }

//     const selectUserId = await sequelize.query(
//       `SELECT * FROM posts WHERE user_id IN (?)`,
//       {
//         type: sequelize.QueryTypes.SELECT,
//         replacements: [rooms[0].user_id],
//       }
//     );

//     res.json(selectUserId);
//   } catch (error) {
//     console.error('Error finding room by user ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };



const sendMessageRoom = async (req, res) => {
  const { content } = req.body;
  const receiverId = req.params.id;
  console.log(receiverId);
  const senderId = req.user.id;

  await sequelize.query(
    'INSERT INTO group_chat (user_id, room_id, created_at, content) VALUES (?, ?, NOW(), ?)',
    {
      replacements: [senderId, receiverId, content],
      type: sequelize.QueryTypes.INSERT
    }
  );

  res.json({ message: 'Message sent successfully' });
}

const getMessagesRoom = async (req, res) => {
  const receiverId = req.user.id;
  console.log(receiverId);
  const senderId = req.params.id;

  const messages = await sequelize.query(
    'SELECT * FROM group_chat WHERE room_id = ? ORDER BY created_at ASC',
    {
      replacements: [senderId, receiverId, receiverId, senderId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(messages);
}

const getMessagesSenderRoom = async (req, res) => {
  const receiverId = req.params.id;
  console.log(receiverId);
  const senderId = req.user.id;

  const messages = await sequelize.query(
    'SELECT * FROM group_chat WHERE (user_id = ? AND room_id = ?) OR (user_id = ? AND room_id = ?) ORDER BY created_at ASC',
    {
      replacements: [senderId, receiverId, senderId, receiverId],
      type: sequelize.QueryTypes.SELECT
    }
  );

  res.json(messages);
}

module.exports = {
  registerUser,
  getMessagesSenderRoom,
  sendMessageRoom,
  getMessagesRoom,
  updateUserProfile,
  loginUser,
  createRoom,
  findRoomByUserId,
  getUserProfile,
  getImage,
  googleLogin,
  OTPVerify,
  sendPasswordOTP,
  OTPVerifyEmail,
  updatepassword,
};