const Orchid = require("../models/Orchids");
const mongoose = require("mongoose");

exports.homepage = async (req, res) => {
  // Remove
  // const messages = await req.consumeFlash('info');
  // Use this instead
  const messages = await req.flash("info");

  const locals = {
    title: "NodeJs",
    description: "Free NodeJs User Management System",
  };

  let perPage = 7;
  let page = req.query.page || 1;

  try {
    const orchids = await Orchid.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    // Count is deprecated. Use countDocuments({}) or estimatedDocumentCount()
    // const count = await Orchids.count();
    const count = await Orchid.countDocuments({});

    res.render("index", {
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
    const customer = await Orchid.findOne({ _id: req.params.id });

    const locals = {
      title: "View Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("orchids/view", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.edit = async (req, res) => {
  try {
    const customer = await Orchid.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Customer Data",
      description: "Free NodeJs User Management System",
    };

    res.render("orchids/edit", {
      locals,
      customer,
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
  const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

  try {
    const customers = await Orchid.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", { customers });
  } catch (error) {}
};