// Require Modules
var express = require("express");
var router = express.Router();
var passport = require("passport");
var Product = require("../models/product");
var User = require("../models/users");

// GET Home Page
router.get("/", function (req, res, next) {
  Product.find({}, (err, allproduct) => {
    if (err) console.log(err);
    res.render("index", { allproduct: allproduct,  messages: req.flash('info')});
  });
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