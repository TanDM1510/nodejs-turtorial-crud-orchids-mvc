const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");
class UserController {
  index(req, res) {
    res.render("register");
  }
  regist(req, res, next) {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
      });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
          });
        } else {
          const newUser = new User({
            username,
            password,
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "Account created successfully! You can now log in."
                );
                res.redirect("/login");
              })
              .catch(next);
          });
        }
      });
    }
  }
  login(req, res) {
    res.render("login");
  }
  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/orchids/",
      successFlash: "Welcome back! You are now logged in.",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  }
  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      res.redirect("/login");
    });
  }

  dashboard(req, res) {
    res.render("index");
  }
}
module.exports = new UserController();
