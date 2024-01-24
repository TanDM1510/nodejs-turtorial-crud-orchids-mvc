require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const connectDB = require("./server/config/db");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const errorHandler = require("./server/middleware/errorHandler");
const port = 5000 || process.env.PORT;
connectDB();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

//handle 404
app.use(errorHandler);
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
