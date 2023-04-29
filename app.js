require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

async function connectDB() {
  await mongoose.connect("mongodb://localhost:27017/crime-reports", {
    useNewUrlParser: true,
  });
  console.log("MongoDB connection established");
}

connectDB();

const reportSchema = new mongoose.Schema({
  city: String,
  duration: String,
  date: String,
});
const Report = new mongoose.model("Report", reportSchema);

const policeSchema = new mongoose.Schema({
  date: String,
  crime: String,
  city: String,
  crime_rating: Number,
});

const police = mongoose.model("Police", policeSchema, "reports");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  travelsafe: String,
});

// const querySchema = new mongoose.Schema({
//   email: String,
//   message: String
// });
// const Query = new mongoose.model("Query", querySchema, 'queries')

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema, "login_details");

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/travelsafe",
      // userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/travelsafe",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/police");
  }
);

// app.get("/", (req, res) => {
//   res.render("police");
// });
app.get("/", (req, res) => {
  res.render("index");
});
// app.get('/queries',(req,res)=>{
//     res.render('index');
// })
// app.post('/queries',(req,res)=>{

//   const email  = req.body.email;
//   const message = req.body.message;
//   const new_query = new Query({
//     email,
//     message,
//     });

//     new_query.save((err) => {
//     if (!err) {
//     res.redirect("/");
//     } else {
//     res.redirect("/");
//     }
//     });
//     });

const queriesSchema = new mongoose.Schema({
  email: String,
  username: String,
  message: String,
});
const Queries = new mongoose.model("Queries", queriesSchema, "queries");

// app.get('/queries', (req,res)=>{
//   res.render('index');
// })

app.post("/", (req, res) => {
  // const clientName = req.body.clientName;
  const email = req.body.email;
  const username = req.body.username;
  const message = req.body.message;
  // const subject = req.body.subject;
  // console.log(message, firstName, email, subject);

  res.redirect("/");
  var new_queries = new Queries({
    email,
    username,
    message,
  });

  new_queries
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/police");
      });
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/police");
        });
      }
    }
  );
});
app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/user", (req, res) => {
  res.render("user");
});
app.post("/user", (req, res) => {
  const city = req.body.city;
  const duration = req.body.duration;
  const date = new Date(Date.now());
  // console.log(message, firstName, email, subject);
  // const new_report = new Report({
  //     city,
  //     duration,
  //     date

  // });

  Report.findOne({ city })
    .then(async (result) => {
      if (result) {
        console.log("City " + city + " Found In The Database");

        /*
        var { crime } = [
          [3, 1],
          [1, 4],
          [2, 3],
          [5, 1],
          [6, 2],
          [7, 1],
          [0, 4],
        ];
        var s = 0;
        var result = "green";
        for (var i = 0; i < crime.length; i++) {
          s += crime[i][0] * crime[i][1];
        }
        var weekly = s / 7;
        */
        try {
          const crimes = await getCrimeData(city, date);
          console.log("Crime Data for " + city + " in the Last 7 Days:");
          console.log(crimes); //crime information console logging
          // Calculate total crime rate on April 27, 2023
          //const totalCrimeRate = getTotalCrimeRate(crimes, date);
          const s = getSeverity(crimes);
          let result;
          if (s >= 0 && s <= 8) {
            result = "green";
          } else if (s > 8 && s <= 16) {
            result = "yellow";
          } else {
            result = "red";
          }
          console.log("crime Rate: " + result);

          let message = "";
          switch (result) {
            case "green":
              message = "You are totally safe to go!!";
              break;
            case "yellow":
              message = "This place is mildly dangerous!!";
              break;
            case "red":
              message = "This place is very dangerous to visit!!";
              break;
          }

          res.json({ safety_level: result, safety_status: message });
        } catch (err) {
          console.error("Error in getting crime data: " + err);
          res.json({ error: err });
        }

        /*
        document.getElementById("d").style.backgroundColor = String(result);
        var conc = [
          "You are totally safe to go!!",
          "This place is mildly dangerous!!",
          "This place is very dangerous to visit!!",
        ];
        if (result == "red") {
          document.getElementById("desc").innerHTML = conc[2];
        } else if (result == "yellow") {
          document.getElementById("desc").innerHTML = conc[1];
        } else if (result == "green") {
          document.getElementById("desc").innerHTML = conc[0];
        }1
        */

        async function getCrimeData(city, startDate, endDate) {
          // Calculate date range (last 7 days)

          function formatDate(dateObj, subdays = 0) {
            var today = dateObj;
            var dd = String(
              Math.max(
                Number(String(today.getDate()).padStart(2, "0") - subdays),
                1
              )
            );
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            today = yyyy + "-" + mm + "-" + dd;
            //today = mm + "-" + dd + "-" + yyyy;
            return today;
          }

          const today = formatDate(new Date());
          const sevenDaysAgo = formatDate(new Date(), 7);
          //const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const queryStartDate = sevenDaysAgo;
          const queryEndDate = today;
          console.log("start date: " + queryStartDate);
          console.log("end date: " + queryEndDate);
          // Query for crime data for the given city and date range
          const crimes = await Report.find({
            city: city,
            date: {
              $gte: queryStartDate,
              $lte: queryEndDate,
            },
          }).exec();

          console.log("Crime data recieved: " + crimes);
          return crimes;
        }

        //get the total crime rate

        function getSeverity(crimes) {
          let ratelist = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          };
          for (let i = 0; i < crimes.length; i++) {
            switch (crimes[i].crime_rating) {
              case 1:
                ratelist["1"]++;
                break;
              case 2:
                ratelist["2"]++;
                break;
              case 3:
                ratelist["3"]++;
                break;
              case 4:
                ratelist["4"]++;
                break;
              case 5:
                ratelist["5"]++;
                break;
            }
          }

          let totalSeverity = 0;
          for (let x in ratelist) {
            totalSeverity += x * ratelist[x];
          }

          return totalSeverity / 7;
        }

        /*
        function getTotalCrimeRate(crimes, date) {
          const crimesOnDate = crimes.filter((crime) => {
            return crime.date.toDateString() === date.toDateString();
          });

          const totalCrimeRate = crimesOnDate.reduce((acc, crime) => {
            return acc + crime.crime_rating;
          }, 0);
          return totalCrimeRate;
        }
        */
      } else {
        console.log("City Not Found In The Database");
      }
    })
    .catch((err) => {
      console.log(err);
    });

  //res.redirect("/");
});

//Police Record Update

app.get("/police", (req, res) => {
  res.render("police");
});

//   app.post('/police', (req,res)=>{
//     const date = req.body.date;
//     const category = req.body.category;
//     const title = req.body.title;
//     const level = req.body.level;

//      const police = new Police({

//         date,
//         category,
//         title,
//         level

//     });

//     police.save()
//     .then((result)=>{

//         console.log("City Found In The Database")

//     }
//     )
//     .catch((err)=>{
//         console.log(err);
//     });
//     res.redirect('/police');

//   })

app.post("/police", async (req, res) => {
  console.log("Received data: ", req.body);
  const date = req.body.date;
  const crime = req.body.crime;
  const city = req.body.city;
  const crime_rating = req.body.crime_rating;

  /*
  const police = new Police({
    date,
    category,
    title,
    level
  });

  */

  await police
    .create({
      date,
      crime,
      city,
      crime_rating,
    })
    .then(() => {
      console.log("Police record saved successfully");
    })
    .catch((err) => {
      console.error("Error in saving police record: ", err);
    });

  /*
  police
    .save()
    .then((result) => {
      console.log("Police record saved successfully");
    })
    .catch((err) => {
      console.log(err);
    });
*/
  res.redirect("/");
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
