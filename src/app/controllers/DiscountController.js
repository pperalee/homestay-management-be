const express = require("express");
const User = require("../models/user.js");
const Homestay = require("../models/homestay.js");
const Discount = require("../models/discount.js");
const auth = require("../middleware/auth.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
class DiscountController {
  async create(req, res) {
    try {
      const discount = new Discount({
        ...req.body,
        user: req.user,
        homestays: [],
      });
      discount.homestay = [];
      req.body.homestays.forEach((homestay) => {
        discount.homestays.push(homestay);
      });
      await discount.save();
      await discount
        .populate({
          path: "homestays",
        })
        .execPopulate();
      res.status(201).send({ discount });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async getAll(req, res) {
    try {
      const discounts = await Discount.find({
        user: req.user._id,
      }).populate({
        path: "homestays",
      });
      const date = new Date();

      const { activeDiscounts, inactiveDiscounts } = discounts.reduce(
        (a, i) => {
          if (i.checkout >= date && i.active === true) {
            a.activeDiscounts.push(i);
          } else {
            a.inactiveDiscounts.push(i);
          }
          return a;
        },
        {
          activeDiscounts: [],
          inactiveDiscounts: [],
        }
      );
      res.status(200).send({ activeDiscounts, inactiveDiscounts });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async getDiscountByHomestay(req, res) {
    try {
      let discounts = [];
      if (!req.query.checkout) {
        const date = new Date();
        discounts = await Discount.find({
          homestays: ObjectId(req.params.id),
          checkout: { $gte: date },
          active: true,
        });
      } else {
        const checkin = req.query.checkin;
        const checkout = req.query.checkout;
        discounts = await Discount.find({
          homestays: ObjectId(req.params.id),
          active: true,
          $or: [
            { checkin: { $gte: checkin, $lte: checkout } },
            {
              checkout: { $gte: checkin, $lte: checkout },
            },
            {
              $and: [
                { checkin: { $lte: checkin } },
                { checkout: { $gte: checkout } },
              ],
            },
          ],
        });
      }

      res.status(200).send({ discounts });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async deactivate(req, res) {
    try {
      const discount = await Discount.findById(req.params.id);
      if (discount.active === false) {
        res.status(400).send(e);
      } else {
        discount.active = false;
        await discount.save();
      }

      res.status(200).send({ discount });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }
}
module.exports = new DiscountController();
