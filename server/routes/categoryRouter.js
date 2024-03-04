const express = require("express");
const {
  getAllCategories,
  createACategory,
  updateACategory,
  deleteACategory,
  getACategory,
} = require("../controllers/categoryController");
const { ensureAuthenticatedAdmin } = require("../config/auth");
const router = express();

router.get("/", ensureAuthenticatedAdmin, getAllCategories);
router.get("/:id", ensureAuthenticatedAdmin, getACategory);
router.post("/", ensureAuthenticatedAdmin, createACategory);
router.put("/:id", ensureAuthenticatedAdmin, updateACategory);
router.delete("/:id", ensureAuthenticatedAdmin, deleteACategory);

module.exports = router;
