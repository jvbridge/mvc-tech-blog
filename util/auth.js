/**
 * Middleware used that will redirect the log in.
 */
const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    // If the user is logged in proceed
    next();
  }
};

module.exports = withAuth;
