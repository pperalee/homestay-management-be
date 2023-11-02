const express = require("express");

const discountController = require("../app/controllers/DiscountController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/", auth, discountController.create);
router.post("/:id", auth, discountController.deactivate);
router.get("/", auth, discountController.getAll);
router.get("/homestays/:id", discountController.getDiscountByHomestay);

module.exports = router;
