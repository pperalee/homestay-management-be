const express = require("express");
const userController = require("../app/controllers/UserController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);
router.get("/currentuser", auth, userController.getCurrentUser);
router.get("/:id", userController.getUserInfo);

module.exports = router;
