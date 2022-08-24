const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL,
  collection: "sessions",
});

const csrfProtection = csrf();

// template engine config

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

// get user from session and add to every request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user){
        return next();
      };

      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// add global variables to views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// handle error page
app.get('/500', errorController.get500);
app.use(errorController.get404);

// error middleware
app.use((error, req, res, next) => {
  res.redirect("/500");
});

const PORT = 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
