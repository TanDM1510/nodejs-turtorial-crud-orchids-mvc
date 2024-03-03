var express = require("express");
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../config/auth");
var userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users"); // Assuming your User model
userRouter
  .route("/register")
  .get(userController.index)
  .post(userController.regist);
userRouter
  .route("/login")
  .get(userController.login)
  .post(userController.signin);
userRouter.route("/logout").get(userController.signout);
userRouter
  .route("/dashboard")
  .get(ensureAuthenticated, userController.dashboard);

userRouter.route("/profile/:id").get(userController.getProfile);
userRouter.route("/:id").put(userController.updateProfile);

module.exports = userRouter;
