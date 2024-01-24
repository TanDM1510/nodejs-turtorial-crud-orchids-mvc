const express = require("express");
const {
  getAllCategories,
  createACategory,
  updateACategory,
  deleteACategory,
  getACategory,
} = require("../controllers/categoryController");
const router = express();

router.get("/", getAllCategories);
router.get("/:id", getACategory);
router.post("/", createACategory);
router.put("/:id", updateACategory);

router.delete("/:id", deleteACategory);

module.exports = router;
