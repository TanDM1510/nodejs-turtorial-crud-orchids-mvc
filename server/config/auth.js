module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Please log in first!");
    res.redirect("/login");
  },
  ensureAuthenticatedAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin === true) {
      return next(); // Authorized user with admin rights
    } else if (req.isAuthenticated()) {
      // Regular user
      req.flash("error", "You are not authorized to perform this action.");
      res.render("forbiden"); // Redirect to profile page for non-admins
    } else {
      // Not authenticated
      req.flash("error", "Please log in first!");
      res.redirect("/login");
    }
  },
};
