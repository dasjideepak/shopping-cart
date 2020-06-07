// Require Modules
var express = require("express");
var router = express.Router();
var passport = require("passport");
var Product = require("../models/product");
var User = require("../models/users");

// GET Home Page
router.get("/", async (req, res, next) => {
  try {
    var allproduct = await Product.find({})
    return res.render("index", { allproduct: allproduct,  messages: req.flash('info')});      
  } catch (error) {
    return next(error)
  }
});

router.post("/search", async (req, res, next) => {
  try {
    console.log(req.body.search);

    var allproduct = await Product.find({category: req.body.search})
    console.log(allproduct);
    
    return res.render("index", {allproduct});      
  } catch (error) {
    return next(error)
  }
});

router.get("/products/:category", async (req, res, next) => {
  try {
    let {category} = req.params
    console.log(req.params.category)
    var allproduct = await Product.find({category: req.params.category})
    return res.render("index", { allproduct: allproduct,  messages: req.flash('info')});            
  } catch (error) {
    return next(error)
  }
});


// Handle request.
router.get("/auth/github", passport.authenticate("github"));

// Handle success or failure conditions.
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/users/login" }),
  (req, res) => {
    console, log("Working");
    res.send("Working");
  }
);

module.exports = router;