const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const customerController = require("../controllers/orchidController");
const { ensureAuthenticated } = require("../config/auth");
router.get("/", ensureAuthenticated, customerController.homepage);
router.get("/add", ensureAuthenticated, customerController.addCustomer);
router.post("/", ensureAuthenticated, customerController.postCustomer);
router.get("/:id", ensureAuthenticated, customerController.view);
router.get("/edit/:id", ensureAuthenticated, customerController.edit);
router.put("/:id", ensureAuthenticated, customerController.editPost);
router.delete("/:id", ensureAuthenticated, customerController.delete);
router.post("/search", customerController.searchCustomers);

module.exports = router;
