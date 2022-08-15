const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("62f1208a797503c96a62d09b")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;

      req.session.save((err) => {
        if (err) {
          console.log(err);
        }

        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
};
