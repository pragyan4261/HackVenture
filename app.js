const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const dataset = require("./dataset.json");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

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
  crime_rating: Number
});

const police = mongoose.model("Police", policeSchema,'reports');

// app.get("/", (req, res) => {
//   res.render("police");
// });
app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/user',(req,res)=>{
    res.render('user')
})
app.post("/", (req, res) => {
  const city = req.body.city;
  const duration = req.body.duration;
  const date = req.body.date;

  // console.log(message, firstName, email, subject);

  // const new_report = new Report({
  //     city,
  //     duration,
  //     date

  // });

  const report = Report.findOne({ city })
    .then((result) => {
      if (result) {
        console.log("City Found In The Database");
      } else {
        console.log("City Not Found In The Database");
      }

      // res.json({message: "area is safe"})
      // alert("You Are Not Safe");
      // res.render('police');
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("/");
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
      crime_rating
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
