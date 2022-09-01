const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const transporter = require("../util/email");

exports.getLogin = (req, res, next) => {
  /*
    GET request to login page
  */

  // set flash message if exist
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  /*
    POST request to sign in a existing user
  */
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  // user input validations
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid email or Password.",
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    const user = await User.findOne({ email: email });
    // if user does not exist!
    if (!user) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: "Invalid email or Password.",
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    }

    // check raw password against hashed Password
    const doMatch = await bcrypt.compare(password, user.password);
    // set sessions for sign in user
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        if (err) {
          console.log(err);
        }

        res.redirect("/");
      });
    }

    // passwords does not match redirect /login
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: "Invalid email or Password.",
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getSignUp = (req, res, next) => {
  /*
    GET request to signup page
  */

  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Sign-up",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignUp = async (req, res, next) => {
  /*
    POST request to signup a new user
  */
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Sign-up",
      errorMessage: "Please Correct Below Errors!",
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // create new user with provided info
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await user.save();

    res.redirect("/login");
    // Send success email
    return transporter.sendMail({
      to: email,
      from: "cybera.3s@gmail.com",
      subject: "Sign up succeeded!",
      html: "<h1>You have successfully signed up!</h1>",
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getLogout = (req, res, next) => {
  /*
    GET request to log out the user
  */

  // removing session
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  /*
      GET request to reset password page
  */
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = async (req, res, next) => {
  /*
    POST request to Reset password and receive a email 
  */

  // generate a random token
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    try {
      // check if user exist with provided email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash("error", "No account with that email found");
        return res.redirect("/reset");
      };

      // save token and its expire date on user object
      const minTtl = 5;
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + minTtl * 60 * 1000;
      const expireAt = new Date(user.resetTokenExpiration);
      await user.save();

      res.redirect("/");

      transporter.sendMail({
        to: req.body.email,
        from: "cybera.3s@gmail.com",
        subject: "Password Reset!",
        html: `
            <p>You Requested Password Reset</p>
            <p>Link will expire at ${
              expireAt.toLocaleTimeString() + " - " + expireAt.toDateString()
            }</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new Password.<p>
          `,
      });
    } catch (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  /*
    GET request to new password Page
  */

  const token = req.params.token;

  try {
    // fetch user with provided token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      res.redirect("/404");
    }

    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render("auth/new-password", {
      path: "new-password",
      pageTitle: "New Password",
      errorMessage: message,
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  /*
    POST request to Set a new password for user
  */

  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  try {
    // fetch user with provided token and user id 
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });

    // hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    // update user with new data
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.redirect("/login");

  } catch (err) {

    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  };

};
