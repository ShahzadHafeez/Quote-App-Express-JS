const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");

dotenv.config();
const port = process.env.PORT || 3000; // set PORT=5000


//Import Routes
const quouteRoutes = require("./routes/quotes.js");
const userRoutes = require("./routes/users.js");



// connect to Mongo DB
mongoose.connect(
  process.env.DB_CONNECT_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log("connected to MongoDB");
  }
);

//Middleware
app.use(express.json());
app.use(cors());

app.use(
  session({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: false
    }
  })
);

//Route Middleware
app.use("/quote", quouteRoutes);
app.use("/user", userRoutes);

// set the view engine to ejs
app.set("view engine", "ejs");

//Store all HTML files in view folder.
//app.use(express.static(__dirname + "/views"));
//Store all JS and CSS in Public folder.
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.redirect('user/login');
});

app.listen(port, () => {
  console.log(`listening at ${port} port`);
});
