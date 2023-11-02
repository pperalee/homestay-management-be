const express = require("express");

const notificationController = require("../app/controllers/NotificationController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.get("/", auth, notificationController.getAll);
router.get("/check", auth, notificationController.check);

module.exports = router;
