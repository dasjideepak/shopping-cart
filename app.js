// Require Modules
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();
var multer = require("multer");
var nodemailer = require("nodemailer");
var cloudinary = require("cloudinary");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var auth = require("./middlewares/auth");

// Require Handlers
require("./handlers/cloudinary");

// Connect to DB
mongoose.connect(
  "mongodb://localhost/flipkart-clone",
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    console.log("Connected to Database", err ? err : true);
  }
);

// Require Routers File
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/product");
var adminRouter = require("./routes/admin");

// Insantiate Express App
var app = express();

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares required
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "i am secret",
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
  })
);

const loggedSession = require("./middlewares/auth");
app.use(loggedSession.loggedSession);

// Use Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/admin", adminRouter);

// Catch 404 And Forward To Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the Error Page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;