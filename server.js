const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const app = express();
const PORT = 3000;

// MongoDB Configuration
mongoose.connect(
  "mongodb+srv://sameerg:sameerg@cluster0.vpjp3to.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  travelTimeline: [
    {
      location: String,
      coordinates: { type: [Number], index: "2dsphere" },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});
const User = mongoose.model("User", userSchema);

// Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Serve static files
app.use(express.static("D:/JS-direction_map/direction_map/public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile("D:/JS-direction_map/direction_map/public/login.html");
});

// ...

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username, password: password }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
    if (!user) {
      res.send("Invalid username or password");
    } else {
      res.sendFile("D:/JS-direction_map/direction_map/public/index.html");
    }
  });
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
    if (user) {
      res.send("Username already exists");
    } else {
      const newUser = new User({
        username: username,
        password: password,
      });
      newUser.save((err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        } else {
          res.sendFile("D:/JS-direction_map/direction_map/public/login.html");
        }
      });
    }
  });
});

// ...

app.get("/index", (req, res) => {
  // Logic to fetch user's travel timeline from the database
  // and send it to the front-end for rendering on Mapbox map
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
