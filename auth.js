// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require("express-session");
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const findOrCreate = require("mongoose-findorcreate");


// const app = express();



// app.use(express.static("public"));
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   session({
//     secret: "Our little secret",
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/crime-reports", { useNewUrlParser: true });

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
//   googleId: String,
//   secret: String,
// });

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);



// const User = new mongoose.model("User", userSchema, 'login_details');

// passport.use(User.createStrategy());


// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, {
//       id: user.id,
//       username: user.username,
//       picture: user.picture,
//     });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "http://localhost:4000/auth/google/secrets",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       console.log(profile);
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );

// // app.get("/", (req, res) => {
// //   res.render("index");
// // });
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// app.get(
//   "/auth/google/secrets",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/police");
//   }
// );

// app.get("/login", (req, res) => {
//   res.render("login");
// });
// app.post("/login", (req, res) => {
  

//   const user = new User({
//     username: req.body.username,
//     password: req.body.password,
//   });
//   req.login(user, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("/police");
//       });
//     }
//   });
// });
// app.get("/register", (req, res) => {
//   res.render("register");
// });
// // app.get("/secrets", (req, res) => {
// //   User.find({'secret': {$ne: null} })
// //   .then((foundUsers)=>{
// //     res.render("secrets", {usersWithSecrets: foundUsers})
// //   })
// //   .catch((err)=>{
// //     console.log(err);
// //   })
// // });

// app.get("/user",(req, res)=>{
//   res.render("user")
// })
// app.post("/user",(req, res)=>{
//   res.render("user")
// })


// // app.get("/submit", (req, res) => {
// //   if (req.isAuthenticated()) {
// //     res.render("submit");
// //   } else {
// //     res.redirect("/login");
// //   }
// // });
// // app.post("/submit", (req, res) => {
// //   const submittedSecret = req.body.secret;
// //   console.log(req.user.id);
  
// //   User.findById(req.user.id)
// //     .then(async (foundUser) => {
// //       foundUser.secret = submittedSecret;
// //       await foundUser.save();
// //       res.redirect("/secrets");
// //     })
// //     .catch((err) => {
// //       console.error(err);
// //     });
// // });

// app.get("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// app.post("/register", (req, res) => {
  
//   User.register(
//     { username: req.body.username },
//     req.body.password,
//     (err, user) => {
//       if (err) {
//         console.log(err);
//         res.redirect("/register");
//       } else {
//         passport.authenticate("local")(req, res, () => {
//           res.redirect("/police");
//         });
//       }
//     }
//   );
// });

















// // app.listen(4000, () => {
// //   console.log("Server listening on port 5400");
// // });
