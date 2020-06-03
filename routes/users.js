var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var upload = require('../handlers/multer');
var nodemailer = require('nodemailer');
var auth = require('../middlewares/auth');

// Require User Model
var User = require("../models/users");

// GET Sign Up Page
router.get("/signup", (req, res, next) => {
  res.render('signup')
})

// POST Sign Up Page
router.post("/signup", upload.single('avatar'), async (req, res, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    req.body.avatar = result.url;
    const newUser = await User.create(req.body);
    res.status(201).render('login');
  } catch (error) {
    next(error)
  }
})

// GET Login Page
router.get("/login", (req, res, next) => {
  res.render('login')
})

// POST Login Page
router.post('/login', function(req, res, next) {
  var {email, password} = req.body;
  console.log(req.body)
  User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    // verify email
    if(!user) { 
      console.log("Wrong Email")
      return next('Please enter a valid email')
    } 
    // verify password here
    if(!user.verifyPassword(password)) {
      console.log("Wrong Password")
      res.send('Wrong Password')
    };
    console.log("Logged In")
 
    req.session.userId = user.id;
    req.session.user = user;
    
    if(user.isAdmin){
      console.log("Welcome Admin")
      return res.redirect('/admin');
    }
    else {
      console.log("Welcome User")
      return res.render("showuser", {user: user});
    }

  }); 
});

// Logout
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  // delete req.session.userId;
  res.clearCookie('connect.sid')
  res.redirect('/')
}) 

// GET Admin Page
router.get("/admin", (req, res, next) => {
  res.render('adminlogin')
})

// GET Cart Page
router.get("/cart", (req, res, next) => {
  res.render('cart')
})

// GET Forgot Password
router.get("/forgot-password", (req, res, next) => {
  res.render('forgot-password')
})

module.exports = router;