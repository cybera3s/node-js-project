const path = require("path");

require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");

const mongoConnect = require("./util/database").mongoConnect;
const app = express();

// template engine config

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// // add user to request
// app.use((req, res, next) => {
//   // User.findByPk(1)
//   //   .then((user) => {
//   //     // console.log(user);
//   //     req.user = user;
//   //     next();
//   //   })
//   //   .catch((err) => console.log(err));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// handle 404 page
app.use(errorController.get404);

const PORT = 3000

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});





