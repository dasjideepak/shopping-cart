var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var cloudinary = require('cloudinary');
var upload = require('../handlers/multer');

// Require User Model
var User = require("../models/users");

// GET Sign Up Page
router.get("/signup", (req, res, next) => {
  res.render('signup')
})

const signToken = id => {
  return jwt.sign({ id }, "iamsecret")
}

// POST Sign Up Page
router.post("/signup", upload.single('avatar'), async (req, res, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path)
    req.body.avatar = result.url;
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    })
    // res.status(201).render('login');
  } catch (error) {
    next(error)
  }
})

// GET Login Page
router.get("/login", (req, res, next) => {
  res.render('login')
})

// POST Login Page
router.post("/login", (req, res, next) => {
  var {email, password} = req.body;
    User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    
    // Verify Email
    if(!user) {
      console.log("Wrong Email");
      return next('Please Enter a Valid Mail');
    }
    // Verify Password
    if(!user.verifyPassword(password)) {
      console.log("Wrong Password");
      return next('Please Enter a Valid Password')
    }
    // Correct Details
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    })
    // return res.render("showuser", {status: 'success', user: user, token})  
  })
})

// GET Forgot Password
router.get('/forgot-password', (req, res, next) => {
  res.render('forgot-password');
});

router.post('/forgot-password', (req, res, next) => {
  res.send('Working');
});


module.exports = router;