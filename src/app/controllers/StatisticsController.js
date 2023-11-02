const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Service = require("../models/service.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class StatisticsController {
  async getStatistics(req, res) {
    var list = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var total = 0;
    let filter = "";
    var quarterList = [0, 0, 0, 0];
    var type = "Type";
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (req.query.type == "Money") {
        type = "Money";
        filter = "$money";
      } else if (req.query.type == "Guests") {
        type = "Guests";
        filter = "$people";
      }
      const year = parseInt(req.query.year);
      const moneyBooking = await Booking.aggregate([
        {
          $match: {
            homestay: ObjectId(req.params.id),
            status: { $in: ["stayed", "reviewed"] },
            $expr: { $eq: [{ $year: "$checkout" }, year] },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$checkout" },
              year: { $year: "$checkout" },
            },
            total: { $sum: filter },
          },
        },
      ]);
      for (var i = 0; i < moneyBooking.length; i++) {
        list[moneyBooking[i]._id.month - 1] = moneyBooking[i].total;
        total += moneyBooking[i].total;
      }
      for (var i = 0; i < list.length; i++) {
        if (list[i] != 0) {
          quarterList[parseInt(i / 3)] += list[i];
        }
      }
      res.status(200).send({
        user: req.user,
        homestay,
        list,
        total,
        quarterList,
        type,
      });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
}

module.exports = new StatisticsController();
