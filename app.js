// Require Modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
require('dotenv').config();
var multer  = require('multer');
var cloudinary = require('cloudinary');

require('./handlers/cloudinary');

// Connect to DB
mongoose.connect("mongodb://localhost/flipkart-clone", {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology:true }, (err) => {
  console.log("Connected to Database", err ? err :true);
});

// Require Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');

// Insantiate Express
var app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Use Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);

// Catch 404 And Forward To Error Handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the Error Page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;