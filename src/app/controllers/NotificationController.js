const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Notification = require("../models/notification.js");

class NotificationController {
  async getAll(req, res) {
    try {
      const noti = await Notification.find({ user: req.user._id });
      const notSeen = noti.filter((nt) => nt.seen === false);
      for (let i = 0; i < notSeen.length; i++) {
        const nt = await Notification.findById(notSeen[i]._id);
        nt.seen = true;
        await nt.save();
      }

      noti.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).send({ notifications: noti });
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }

  async check(req, res) {
    try {
      const noti = await Notification.find({ user: req.user._id });
      const notSeen = noti.some((nt) => nt.seen === false);
      res.status(200).send({ notSeen });
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }
}

module.exports = new NotificationController();
