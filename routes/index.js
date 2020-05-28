// Require Modules
var express = require('express');
var router = express.Router();

// Require User Models
var User = require("../models/users")

// GET Home Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flipkart' });
});

module.exports = router;