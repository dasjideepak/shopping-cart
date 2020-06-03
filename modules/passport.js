let passport = require("passport");
let GitHubStrategy = require("passport-github").Strategy;
let User = require("../models/users");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    }, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
      let newUser = {
        username: profile.username,
        email: profile._json.email,
        bio: profile._json.bio,
        photos: profile.photos[0].value,
        id: profile.id,
        admin: profile.admin,
      };

      console.log('User Created.')

      if (newUser.email === "dasjideepak@gmail.com") {
        // done(null, newUser);

        User.findOne({ email: newUser.email }, (err, user) => {
          console.log('user found');
          if (!user) {
            User.create(
              {
                username: profile.username,
                email: profile._json.email,
                bio: profile._json.bio,
                photos: profile.photos[0].value,
                password: process.env.PASSWORD,
                admin: true,
                id: profile.id,
              },
              (err, admin) => {
                done(null, admin);
                console.log('user from passport created.')
              }
            );
          } else done(null, user);
        });
      } else {
        done(null, false);
        console.log('user already created.');
      }
    }
  )
);

// Serialize.
passport.serializeUser((user, done) => {
  console.log("serialize")
  done(null, user._id);
});

// Deserialize.
passport.deserializeUser((id, done) => {
  console.log("deserialize");
  done(null, id);
});

module.exports = passport;
