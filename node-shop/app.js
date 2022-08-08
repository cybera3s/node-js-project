const path = require("path");

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");

const User = require("./models/user");

const app = express();

// template engine config

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// add user to request
app.use((req, res, next) => {
  User.findById("62f1208a797503c96a62d09b")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// handle 404 page
app.use(errorController.get404);

const PORT = 3000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Ario",
          email: "cybera.3s@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
