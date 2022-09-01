/**
  check if isLoggedIn session has been set 
  otherwise redirect to login page
*/
const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
};

module.exports = isAuth;