const express = require("express");

const chatController = require("../app/controllers/ChatController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/send-messages", auth, chatController.sendMessage);

router.post("/load-messages", auth, chatController.loadMessages);

router.get("/your-chats", auth, chatController.yourChats);

module.exports = router;
