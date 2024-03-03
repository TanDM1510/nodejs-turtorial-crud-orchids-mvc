require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const methodOverride = require("method-override");
var path = require("path");
var cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
var usersRouter = require("./server/routes/users");
const { ensureAuthenticated } = require("./server/config/auth");
const passport = require("passport");
const errorHandler = require("./server/middleware/errorHandler");
const port = 5000 || process.env.PORT;
connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("./server/config/passport")(passport);
//Static file
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash({ sessionKeyName: "flashMessage" }));

//template
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//routes

// app.use("/", require("./server/routes/customer"));

app.use("/orchids", require("./server/routes/orchidRouter"));
app.use("/categories", require("./server/routes/categoryRouter"));
app.use("/", usersRouter);
//handle 404
app.use(errorHandler);
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
