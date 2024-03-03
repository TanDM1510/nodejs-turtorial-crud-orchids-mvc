const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const customerController = require("../controllers/orchidController");
const {
  ensureAuthenticated,
  ensureAuthenticatedAdmin,
} = require("../config/auth");
router.get("/", ensureAuthenticated, customerController.homepage);
router.get("/add", ensureAuthenticatedAdmin, customerController.addCustomer);
router.post("/", ensureAuthenticatedAdmin, customerController.postCustomer);
router.get("/:id", ensureAuthenticatedAdmin, customerController.view);
router.get("/edit/:id", ensureAuthenticatedAdmin, customerController.edit);
router.put("/:id", ensureAuthenticatedAdmin, customerController.editPost);
router.delete("/:id", ensureAuthenticatedAdmin, customerController.delete);
router.post("/search", customerController.searchCustomers);

module.exports = router;
