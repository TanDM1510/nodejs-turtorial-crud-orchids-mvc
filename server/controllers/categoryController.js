//Get all categories
//route GET /categories
const asyncHandler = require("express-async-handler");
const Categories = require("../models/Categories");

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Categories.find();
  res.status(200).json(categories);
});

//create category
//route POST /categories
const createACategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const category = await Categories.create({
    name,
    description,
  });

  res.status(201).json({
    message: "Category created successfully",
    category: category,
  });
});
const getACategory = asyncHandler(async (req, res) => {
  const category = await Categories.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("No category found");
  }
  res.status(200).json(category);
});

//update category
//route POST /categories
const updateACategory = asyncHandler(async (req, res) => {
  const category = await Categories.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("No category found");
  }
  const updateContact = await Categories.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updateContact);
});

//delete category
//route DELETE /categories
const deleteACategory = asyncHandler(async (req, res) => {
  const category = await Categories.findOne({
    _id: mongoose.Types.ObjectId(req.params.id),
  });

  if (!category) {
    res.status(404);
    throw new Error("No category found");
  }
  await Categories.deleteOne(category);
  res.status(200).json({ message: "Delete a categories" });
});

//get a category
//route GET /categories

module.exports = {
  getAllCategories,
  createACategory,
  updateACategory,
  deleteACategory,
  getACategory,
};
