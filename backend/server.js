const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const { QueryTypes } = require('sequelize');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { sequelize, testConnection } = require('./config/database');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const { socket: socketFunction } = require('./controllers/soketController');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');



// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 callbackURL: "http://localhost:5000/api/auth/google/callback"
}, (accessToken, refreshToken, profile, cb) => {
  // User has authenticated, return the user profile
  return cb(null, profile._json);
}));

passport.serializeUser((user, next)=>{
  return next(null, user)
})

passport.deserializeUser((user, next)=>{
  return next(null, user)
})

// Session configuration
const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true
};

const generateToken = (user) => {
  const payload = {
    email: user.email,
    password: user.password,
    id: user.id,
  };
  return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(path.join(__dirname, './public/')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Test the database connection
testConnection()
  .then(() => {
    // Routes
    app.use('/api', userRoutes);
    app.use('/api', categoryRoutes);
    app.use('/api', productRoutes);

    // Google login route
    app.get('/api/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email']
    }));

    // Google login callback route
    app.get('/api/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/login'
    }), async (req, res) => {
      // User has authenticated, redirect to protected route

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
          console.log(existingUser.id);
          console.log("user login with google" , token);
          res.redirect('http://localhost:3000/allPost');
        }else{
          console.log("user not login with google");
        }
        

      }else{
        res.redirect('/protected');
      }


    });

    // Protected route
    app.get('/protected', (req, res) => {
      // Check if user is authenticated
      if (req.isAuthenticated()) {
        res.send(`Welcome, ${req.user.displayName}!`);
      } else {
        res.status(401).send('Unauthorized');
      }
    });

    const server = http.createServer(app);
    socketFunction(server);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });