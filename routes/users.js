var express = require("express");
var router = express.Router();
var cloudinary = require("cloudinary");
var upload = require("../handlers/multer");
var nodemailer = require("nodemailer");
var auth = require("../middlewares/auth");
let Product = require("../models/product");
let Item = require("../models/item");
var Cart = require("../models/cart");
var User = require("../models/users");
var auth = require("../middlewares/auth");

// GET Current Logged In User
router.get("/", (req, res, next) => {
  res.render("showuser");
});

// GET Sign Up Page
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// POST Sign Up Page
router.post("/signup", upload.single("avatar"), async (req, res, next) => {
  let { email } = req.body;
  try {
    var user = await User.findOne({ email }, "-password");

    if (user) {
      req.flash("error", "Email already registered");
      res.redirect("/users/signup");
    }

    if (!user) {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.avatar = result.url;
      }

      var randomNumber = Math.floor(Math.random() * 100 + 54);
      req.body.verificationToken = randomNumber;
      var newUser = await User.create(req.body);

      var transporter = await nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var sendEmailTo = newUser.email;

      var mailOptions = {
        from: "technicaldassharma@gmail.com",
        to: sendEmailTo,
        subject: "Email Verification",
        html: `Welcome,
              Verification Link - http://localhost:3000/users/${newUser.id}/activate/${randomNumber}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("An Error Occurred", error);
        } else {
          console.log("Email Sent");
        }
      });
    }

    req.flash("success", "Registered successfully. Please Check Your Email");
    return res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
});

// Account Verification
router.get("/:id/activate/:code", async (req, res, next) => {
  let id = req.params.id;
  let code = req.params.code;
  try {
    var user = await User.findById(id);
    if (user.verificationToken == code) {
      user = await User.findByIdAndUpdate(id, { isVerifiedUser: true });
      user = await User.findByIdAndUpdate(id, {
        $unset: { verificationToken: 1 },
      });
      req.flash("success", "Activated successfully. Please Login");
      res.redirect("/users/login");
    } else {
      req.flash("error", "Invalid Link");
      res.redirect("/users/signup");
    }
  } catch (error) {
    return next(error);
  }
});

// GET Login Page
router.get("/login", (req, res, next) => {
  res.render("login");
});

// POST Login Page
router.post("/login", async (req, res, next) => {
  var { email, password } = req.body;
  try {
    var user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Wrong Email");
      return res.redirect("/users/login");
      console.log("Checking Mail");
    }
    if (!user.verifyPassword(password)) {
      req.flash("error", "Wrong Password");
      return res.redirect("/users/login");
      console.log("Checking Password");
    }
    if (user.isBlocked) {
      req.flash("error", "User blocked. Please contact support");
      return res.redirect("/users/login");
      console.log("Checking isBlocked");
    }
    if (!user.isVerifiedUser) {
      req.flash("error", "Please check email for activation link.");
      return res.redirect("/users/login");
    }

    req.session.userId = user.id;
    req.session.user = user;

    if (user.isAdmin) {
      req.flash("success", "Welcome Admin");
      return res.redirect("/admin");
    } else {
      req.flash("success", "Login Successfull, Welcome, " + user.name);
      return res.redirect("/users");
    }
  } catch (error) {
    next(error);
  }
});

// Logout
router.get("/logout", auth.isLoggedin, (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

// Delete User
router.get("/:id/delete", auth.isLoggedin, (req, res, next) => {
  var id = req.params.id;
  User.findByIdAndDelete(req.params.id, (err, user) => {
    if (err) return next(err);
    req.flash("success", "User Deleted");
    res.redirect("/");
  });
});

// GET User Edit
router.get("/:id/edit", auth.isLoggedin, (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return next(err);
    res.render("edituser", { user: user });
  });
});

// POST Edit User
router.post(
  "/:id/edit",
  auth.isLoggedin,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        req.body.avatar = result.url;
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { runValidators: true },
        (err, user) => {
          req.flash("success", "User Updated Successfully");
          return res.redirect("/users");
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

// Display Cart Page
router.get("/cart", auth.isLoggedin, async (req, res, next) => {
  try {
    var cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items",
      populate: { path: "productId" },
    });
    
    if (cart) {
      console.log(cart.items.length);
    }

    cart.items.forEach(elem => {
      if(elem.quantity <= 0) {
        var remove = Item.findByIdAndDelete(elem.id)
        console.log(remove, "Removing Item");
      }
      console.log(elem.id, "Element" );
    })  

    var totalAmount = 0;
    cart.items.forEach((elem, index) => {
      totalAmount += elem.productId.price * elem.quantity;
    });

    res.render("cart", { cart, totalAmount});
  } catch (error) {
    next(error);
  }
});

// Add Item to cart.
router.post("/:id/cart/add", auth.isLoggedin, async (req, res, next) => {
  try {
    var productId = req.params.id;
    var userId = req.user.id;

    // Find cart

    var cartToFind = await Cart.findOne({ userId }).populate("items");

    // If cart no found
    if (!cartToFind) {
      var itemToCreate = await Item.create({ productId });
      await Cart.create({ userId, items: itemToCreate.id });
    } else {
      // Search item in cart
      var isItemInCart = cartToFind.items.find(
        (item) => item.productId == productId
      );

      // If item is already in cart
      if (isItemInCart) {
        await Item.findByIdAndUpdate(isItemInCart._id, {
          $inc: { quantity: 1 },
        });

        // If item is not in cart then update
      } else {
        var itemToCreate = await Item.create({ productId });
        await Cart.findByIdAndUpdate(cartToFind.id, {
          $push: { items: itemToCreate.id },
        });
      }
    }
    req.flash("success", "Item Added to Cart");
    res.redirect("/users/cart");
  } catch (error) {
    next(error);
  }
});

// Delete Item from Cart
router.get("/item/:id/delete", auth.isLoggedin, async (req, res, next) => {
  try {
    var id = req.params.id;

    var item = await Item.findByIdAndDelete(id);
   
    req.flash("success", "Item Deleted from Cart");
    res.redirect("/users/cart");

  } catch (error) {
    next(error);
  }
});

// Cart Item Quantity Increase
router.get("/item/:id/increase", auth.isLoggedin, async (req, res, next) => {
  try {
    var id = req.params.id;
    await Item.findByIdAndUpdate(id, {$inc: { quantity: 1 }});
   
    req.flash("success", "Item Quantity Updated");
    res.redirect("/users/cart");

  } catch (error) {
    next(error);
  }
});

// Cart Item Quantity Decrease
router.get("/item/:id/decrease", auth.isLoggedin, async (req, res, next) => {
  try {
    var id = req.params.id;
    await Item.findByIdAndUpdate(id, {$inc: { quantity: -1 }});
   
    req.flash("success", "Item Quantity Updated");
    res.redirect("/users/cart");

  } catch (error) {
    next(error);
  }
});

// POST Cart Item Quantity
router.post("/item/:id/update", auth.isLoggedin, async (req, res, next) => {
  try {
    var id = req.params.id;
    var value = req.body.quantity;
    console.log(id, value)
    await Item.findByIdAndUpdate(id, { quantity: value});
   
    req.flash("success", "Item Quantity Updated");
    res.redirect("/users/cart");

  } catch (error) {
    next(error);
  }
});


// GET Forgot Password
router.get("/forgot-password", (req, res, next) => {
  res.render("forgot-password");
});

// GET Checkout Page
router.get("/cart/checkout", auth.isLoggedin, (req, res, next) => {
  res.render("checkout");
});

module.exports = router;