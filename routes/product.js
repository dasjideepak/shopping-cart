var express = require('express');
var router = express.Router();

// Require Product Model
var Product = require("../models/product");

// GET Add Product
router.get('/add', (req, res, next) => {
    res.render('addproduct');
});

// POST Add Product  
router.post('/add', (req, res, next) => {
    res.send("Added");
});

module.exports = router;