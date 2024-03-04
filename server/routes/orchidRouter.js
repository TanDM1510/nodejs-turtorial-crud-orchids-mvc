const express = require("express");
const { model } = require("mongoose");
const Orchid = require("../models/Orchids");

const router = express.Router();
const customerController = require("../controllers/orchidController");
const {
  ensureAuthenticated,
  ensureAuthenticatedAdmin,
} = require("../config/auth");
router.get("/", ensureAuthenticatedAdmin, customerController.homepage);
router.get("/landing", ensureAuthenticated, customerController.landingPage);
router.get("/add", ensureAuthenticatedAdmin, customerController.addCustomer);
router.post("/", ensureAuthenticatedAdmin, customerController.postCustomer);
router.get("/:id", ensureAuthenticated, customerController.view);
router.get("/edit/:id", ensureAuthenticatedAdmin, customerController.edit);
router.put("/:id", ensureAuthenticatedAdmin, customerController.editPost);
router.delete("/:id", ensureAuthenticatedAdmin, customerController.delete);
router.post("/search", customerController.searchCustomers);
router.post(
  "/:orchidId/comments",
  ensureAuthenticated,
  customerController.addComment
);

module.exports = router;
