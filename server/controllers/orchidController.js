const Orchid = require("../models/Orchids");
const mongoose = require("mongoose");
const Categories = require("../models/Categories");
const Comment = require("../models/Orchids");
var moment = require("moment");

exports.homepage = async (req, res) => {
  // Remove
  // const messages = await req.consumeFlash('info');
  // Use this instead
  const messages = await req.flash("info");
  var user = req.user._id;
  console.log(user, "dsad");
  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 5;
  let page = req.query.page || 1;

  try {
    const orchids = await Orchid.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: perPage * page - perPage },
      { $limit: perPage },
      {
        $lookup: {
          from: "categories",
          localField: "category", // Assuming this field stores the category's _id
          foreignField: "_id", // Matches the actual foreign field in Categories schema
          as: "category",
        },
      },
    ]).exec();

    const count = await Orchid.countDocuments({});
    for (const orchid of orchids) {
      console.log(orchid.category[0]?.name); // Assuming "category" field contains the category object
    }
    res.render("index", {
      user,
      locals,
      orchids,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addComment = async (req, res) => {
  try {
    const orchid = await Orchid.findById(req.params.orchidId);
    const user = req.user._id;
    console.log(user);
    if (!orchid) {
      return res.status(404).json({ message: "Lan không tồn tại" });
    }

    // Check for existing comment by the user
    // if (orchid.comments.some((comment) => comment.author._id === user)) {
    //   return res
    //     .status(400)
    //     .json({ message: "Bạn đã bình luận trên lan này rồi" });
    // }

    // Validate and sanitize user input (req.body) before pushing

    orchid.comments.push({ ...req.body, author: user });
    await orchid.save();

    const updatedOrchid = await Orchid.findById(req.params.orchidId)
      .populate("category")
      .populate("comments.author");
    res.redirect(`/orchids/${orchid.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

exports.landingPage = async (req, res) => {
  // Remove flash message code (if applicable)

  const user = req.user._id;
  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  try {
    const orchids = await Orchid.find()
      .sort({ createdAt: -1 })
      .populate("category"); // Sort by creation date descending

    res.render("landing", {
      user,
      locals,
      orchids,
      messages: [], // Set messages to an empty array if needed
    });
  } catch (error) {
    console.log(error);
  }
};

exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add new Orchid ",
    description: "free",
  };
  res.render("orchids/add", locals);
};
// create customer
exports.postCustomer = async (req, res) => {
  console.log(req.body);

  const newOrchid = new Orchid({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    original: req.body.original,
    isNatural: req.body.isNatural,
    color: req.body.color,
  });

  try {
    await Orchid.create(newOrchid);
    await req.flash("info", "New orchid has been added");
    res.redirect("/orchids");
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
  try {
    const customer = await Orchid.findOne({ _id: req.params.id })
      .populate("category")
      .populate("comments.author");

    // Sort comments before populating author
    customer.comments.sort((a, b) => b.createdAt - a.createdAt);

    const categoryName = customer?.category?.name;
    const comments = customer?.comments;

    console.log(comments); // Now shows sorted comments in console

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("orchids/view", {
      locals,
      customer,
      categoryName,
      comments,
      moment: moment,
    });
  } catch (error) {
    console.log(error);
  }
};

// dishRouter.route("/:dishId/comments").get((req, res, next) => {
//   Dishes.findById(req.params.dishId)
//     .populate("comments.author")
//     .then(
//       (dish) => {
//         if (dish != null) {
//           res.statusCode = 200;
//           res.setHeader("Content-Type", "application/json");
//           res.json(dish.comments);
//         } else {
//           err = new Error("Dish " + req.params.dishId + " not found");
//           err.status = 404;
//           return next(err);
//         }
//       },
//       (err) => next(err)
//     )
//     .catch((err) => next(err));
// });

exports.edit = async (req, res) => {
  try {
    const customer = await Orchid.findOne({ _id: req.params.id }).populate(
      "category"
    );
    const categoryName = customer?.category?.name;
    const allCategories = await Categories.find();
    const locals = {
      title: "Edit Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("orchids/edit", {
      locals,
      customer,
      categoryName,
      allCategories,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.editPost = async (req, res) => {
  try {
    await Orchid.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      image: req.body.image,
      price: req.body.price,
      original: req.body.original,
      isNatural: req.body.isNatural,
      color: req.body.color,
      category: req.body.category,
      updatedAt: Date.now(),
    });
    res.redirect(`/orchids/edit/${req.params.id}`);
  } catch (error) {
    console.log(error);
  }
};
exports.delete = async (req, res) => {
  try {
    await Orchid.deleteOne({ _id: req.params.id }).then((customer) => {
      if (!customer) {
        res.status(404).json({ errors });
      } else {
        res.redirect("/orchids");
      }
    });
  } catch (error) {
    console.log(error);
  }
};
exports.searchCustomers = async (req, res) => {
  let searchTerm = req.body.searchTerm;
  const searchRegex = searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); // Escape special characters including whitespace
  const searchNoSpecialChar = searchRegex.replace(/\s/g, "\\s"); // Replace whitespace with regex representation

  try {
    const orchids = await Orchid.find({
      $or: [
        { name: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        // { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    }).populate("category");
    console.log(orchids);
    res.render("search", { orchids });
  } catch (error) {}
};
