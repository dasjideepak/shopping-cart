var express = require("express");
var router = express.Router();
var User = require("../models/users");

router.get("/", (req, res, next) => {
  res.render("admin");
});

module.exports = router;