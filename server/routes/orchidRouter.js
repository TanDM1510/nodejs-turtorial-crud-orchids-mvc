const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const customerController = require("../controllers/orchidController");

router.get("/", customerController.homepage);
router.get("/add", customerController.addCustomer);
router.post("/", customerController.postCustomer);
router.get("/:id", customerController.view);
router.get("/edit/:id", customerController.edit);
router.put("/:id", customerController.editPost);
router.delete("/:id", customerController.delete);
router.post("/search", customerController.searchCustomers);

module.exports = router;
