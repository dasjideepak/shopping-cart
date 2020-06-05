var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");
var upload = require("../handlers/multer");
var Product = require("../models/product");
var auth = require("../middlewares/auth");

// GET Add Product
router.get("/add", (req, res, next) => {
  res.render("addproduct");
});

// POST Add Product
router.post("/add", upload.single("images"), async (req, res, next) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    req.body.images = result.url;
    var product = await Product.create(req.body);
    req.flash('success', "Product Added")
    res.redirect("/admin");
  } catch (error) {
    next(error);
  }
});

module.exports = router;