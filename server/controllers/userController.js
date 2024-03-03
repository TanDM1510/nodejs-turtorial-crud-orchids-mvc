const User = require("../models/users");
const bcrypt = require("bcrypt");
const passport = require("passport");
class UserController {
  index(req, res) {
    res.render("register");
  }
  regist(req, res, next) {
    const { username, password, name, YOB, isAdmin } = req.body;
    let errors = [];
    if (!username || !password || !name) {
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
        name,
      });
    } else {
      User.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
            name,
          });
        } else {
          const newUser = new User({
            username,
            password,
            name,
            YOB: "",
            isAdmin: false,
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
  getProfile = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        // Handle user not found scenario (e.g., redirect, error message)
        return;
      }

      const locals = {
        title: "Edit Customer Data",
        description: "Free NodeJs User Management System",
      };

      res.render("profile", { locals, user });
    } catch (error) {
      console.error(error);
      // Handle errors appropriately (e.g., log, redirect, error message)
    }
  };
  updateProfile = async (req, res) => {
    try {
      // Validate user input (replace with your validation logic)
      const { password, name, YOB } = req.body;

      // Hash password before updating (replace with secure hashing)
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(req.params.id, {
        password: hashedPassword,
        name,
        YOB,
        updatedAt: Date.now(),
      });
      req.flash("success_msg", "Account update success !");
      res.redirect(`/profile/${req.params.id}`);
    } catch (error) {
      console.error(error);
      // Handle errors appropriately (e.g., log, redirect, error message)
    }
  };
  dashboard(req, res) {
    res.render("index");
  }
}
module.exports = new UserController();
