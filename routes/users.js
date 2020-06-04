var express = require('express');
var router = express.Router();
var cloudinary = require('cloudinary');
var upload = require('../handlers/multer');
var nodemailer = require('nodemailer');
var auth = require('../middlewares/auth');

// Require User Model
var User = require("../models/users");

// GET Current Logged In User
router.get("/", (req, res, next) => {
  res.render('showuser')
})

// GET Sign Up Page
router.get("/signup", (req, res, next) => {
  res.render('signup')
})

// POST Sign Up Page
router.post("/signup", upload.single('avatar'), async (req, res, next) => {
  try {
    // if(!req.file === undefined) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body.avatar = result.url;
    // }  
    const newUser = await User.create(req.body);
    res.status(201).redirect('/users/login');
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
      return res.send("Wrong Email")
    } 
    // verify password here
    if(!user.verifyPassword(password)) {
      console.log("Wrong Password")
      return res.send('Wrong Password')
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
      return res.redirect("/users");
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

// Delete User
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if(err) return next(err);
    console.log('deleted');
    res.redirect("/");
  })
});

// GET User Edit
router.get('/:id/edit', (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
      if(err) return next(err);
      res.render("edituser", { user: user })
  });
});

// POST Edit User
router.post('/:id/edit', upload.single('avatar'), async (req, res, next) => {
  try {
    if(!req.file === undefined) {
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body.avatar = result.url;  
    }
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }, (err, user) => {
      return res.redirect("/users");
    });    
  } catch (error) {
    next(error); 
  }
});

// Display Cart Page
router.get('/cart', auth.isLoggedin, async(req, res, next) =>{
  var id = req.session.userId;  
  try{
    var loggedInUser = await User.findById(id).populate('shoppingCart.item');
    var totalPrice = 0;
    loggedInUser.shoppingCart.forEach((elem,index)=>{
      totalPrice += elem.item.price*elem.quantity;
    });
    res.render('cart', {loggedInUser, totalPrice});
  }
  catch(error) {
    return next(error);
  }
});

// GET Admin Page
router.get("/admin", (req, res, next) => {
  res.render('adminlogin')
})

// GET Forgot Password
router.get("/forgot-password", (req, res, next) => {
  res.render('forgot-password')
})

module.exports = router;