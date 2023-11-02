const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Chat = require("../models/chat.js");
const Message = require("../models/message.js");

class ChatController {
  async sendMessage(req, res) {
    try {
      let chat;
      chat = await Chat.findOne({
        users: { $all: [req.body.from, req.body.to] },
      });
      if (!chat) {
        chat = new Chat({
          users: [req.body.from, req.body.to],
        });
      }
      const message = new Message({
        ...req.body,
      });
      await message.save();
      chat.lastMessage = message;
      await chat.save();
      res.status(201).send({ message });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async loadMessages(req, res) {
    try {
      const messages = await Message.find({
        from: { $in: req.body.users },
        to: { $in: req.body.users },
      });
      res.status(200).send({ messages });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async yourChats(req, res) {
    try {
      const chats = await Chat.find({
        users: { $in: [req.user._id] },
      })
        .populate({
          path: "users lastMessage",
        })
        .sort({ updatedAt: -1 });
      res.status(200).send({ chats });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
}

module.exports = new ChatController();
