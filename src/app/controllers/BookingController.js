const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const ServiceBooking = require("../models/serviceBooking.js");
const Service = require("../models/service.js");
const Discount = require("../models/discount.js");
const Notification = require("../models/notification.js");
const sharp = require("sharp");

class BookingController {
  async search(req, res) {
    try {
      const checkintime = req.body.checkin;
      const checkouttime = req.body.checkout;
      const booked = await Booking.find({
        $or: [
          { checkin: { $gte: checkintime, $lte: checkouttime } },
          {
            checkout: { $gte: checkintime, $lte: checkouttime },
          },
          {
            $and: [
              { checkin: { $lte: checkintime } },
              { checkout: { $gte: checkouttime } },
            ],
          },
        ],
        status: { $in: ["accepted", "stayed", "reviewed"] },
      });
      var unavailable = [];
      for (var i = 0; i < booked.length; i++) {
        unavailable.push(booked[i].homestay);
      }
      const homestays = await Homestay.find({
        city: req.body.city,
        price: { $gte: 0, $lte: req.body.price },
        isActive: true,
        _id: { $nin: unavailable },
      });
      res.status(200).send({ user: req.user, homestays });
    } catch (e) {
      res.status(400).send(e);
    }
  }

  async book(req, res) {
    try {
      const homestay = await Homestay.findOne({
        _id: req.params.id,
        isActive: true,
      });
      if (!homestay) {
        res.status(400).send();
      }
      const checkintime = req.body.checkin;
      const checkouttime = req.body.checkout;
      const booked = await Booking.find({
        $or: [
          { checkin: { $gte: checkintime, $lte: checkouttime } },
          {
            checkout: { $gte: checkintime, $lte: checkouttime },
          },
          {
            $and: [
              { checkin: { $lte: checkintime } },
              { checkout: { $gte: checkouttime } },
            ],
          },
        ],
        status: { $in: ["accepted", "stayed", "reviewed"] },
        homestay: homestay._id,
      });
      console.log({ booked });
      if (booked.length) {
        throw new Error("Invalid checkin checkout time");
      }
      const booking = new Booking({
        ...req.body,
        user: req.user._id,
        homestay: homestay._id,
        status: "requested",
      });
      if (req.body.discount) {
        const discount = await Discount.findById(req.body.discount);
        discount.used = discount.used + 1;
        await discount.save();
      }
      // var datecheckin = new Date(req.body.checkin);
      // var datecheckout = new Date(req.body.checkout);
      // var date = (datecheckout - datecheckin) / (60 * 60 * 24 * 1000);
      // booking.money = homestay.price * date;
      await booking.save();
      res.status(201).send({ booking });
    } catch (e) {
      res.status(400).send(e);
      console.log({ e });
    }
  }

  async getBookingByHomestay(req, res) {
    const homestay = await Homestay.findById(req.params.homestayId);
    var bookingList = [];
    var date;
    const tab = req.query.tab;
    try {
      if (tab != "stayed") {
        if (req.query.username && req.query.time) {
          var username = req.query.username;
          if (req.query.time == "thisweek") {
            date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
          } else if (req.query.time == "thismonth") {
            date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
          }
          var users = await User.find({
            name: { $regex: username, $options: "i" },
          });
          var ids = users.map(function (user) {
            return user._id;
          });
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: tab,
            user: { $in: ids },
            createdAt: {
              $lte: new Date(),
              $gte: date,
            },
          });
        } else if (req.query.username) {
          var username = req.query.username;
          var users = await User.find({
            name: { $regex: username, $options: "i" },
          });
          var ids = users.map(function (user) {
            return user._id;
          });
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: tab,
            user: { $in: ids },
          });
        } else if (req.query.time) {
          if (req.query.time == "thisweek") {
            date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
          } else if (req.query.time == "thismonth") {
            date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
          }
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: tab,
            createdAt: {
              $lte: new Date(),
              $gte: date,
            },
          });
        } else {
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: tab,
          });
        }
      } else {
        if (req.query.username && req.query.time) {
          var username = req.query.username;
          if (req.query.time == "thisweek") {
            date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
          } else if (req.query.time == "thismonth") {
            date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
          }
          var users = await User.find({
            name: { $regex: username, $options: "i" },
          });
          var ids = users.map(function (user) {
            return user._id;
          });
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: { $in: ["stayed", "reviewed"] },
            user: { $in: ids },
            createdAt: {
              $lte: new Date(),
              $gte: date,
            },
          });
        } else if (req.query.username) {
          var username = req.query.username;
          var users = await User.find({
            name: { $regex: username, $options: "i" },
          });
          var ids = users.map(function (user) {
            return user._id;
          });
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: { $in: ["stayed", "reviewed"] },
            user: { $in: ids },
          });
        } else if (req.query.time) {
          if (req.query.time == "thisweek") {
            date = new Date(new Date() - 7 * 60 * 60 * 24 * 1000);
          } else if (req.query.time == "thismonth") {
            date = new Date(new Date() - 30 * 60 * 60 * 24 * 1000);
          }
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: { $in: ["stayed", "reviewed"] },
            createdAt: {
              $lte: new Date(),
              $gte: date,
            },
          });
        } else {
          bookingList = await Booking.find({
            homestay: req.params.homestayId,
            status: { $in: ["stayed", "reviewed"] },
          });
        }
      }

      for (var i = 0; i < bookingList.length; i++) {
        await bookingList[i]
          .populate({
            path: "user",
          })
          .execPopulate();
      }
      res.status(200).send({
        homestay,
        bookingList,
      });
    } catch (e) {
      res.status(500).send();
      console.log(e);
    }
  }

  async getBookingDetail(req, res) {
    try {
      const booking = await Booking.findById(req.params.id);
      await booking
        .populate([
          {
            path: "user",
          },
          {
            path: "discount",
          },
          {
            path: "homestay",
          },
        ])
        .execPopulate();
      // await booking
      //   .populate({
      //     path: "homestay",
      //   })
      //   .execPopulate();

      const services = await Service.find({ homestay: booking.homestay._id });
      const servicesBooking = await ServiceBooking.find({
        booking: booking._id,
      });
      for (let i = 0; i < servicesBooking.length; i++) {
        await servicesBooking[i]
          .populate({
            path: "service",
          })
          .execPopulate();
      }
      res.status(200).send({ booking, services, servicesBooking });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }

  async update(req, res) {
    try {
      const updates = Object.keys(req.body);
      const keys = updates.filter((item) => item !== "services");
      const statuses = [
        "requested",
        "accepted",
        "stayed",
        "declined",
        "reviewed",
      ];
      const booking = await Booking.findById(req.params.id);
      const homestay = await Homestay.findById(booking.homestay);
      //update number of booking
      if (
        req.body.status === "stayed" &&
        statuses.indexOf(homestay.status) < statuses.indexOf(req.body.status)
      ) {
        homestay.bookingNumber = homestay.bookingNumber + 1;
        const noti = new Notification({
          message: `You stayed in ${homestay.name}! Please let us know whether you have a wonderful vacation`,
          user: booking.user,
        });
        await noti.save();
      }
      await homestay.save();
      //update info
      keys.forEach((update) => (booking[update] = req.body[update]));
      await booking.save();
      //create notification
      if (
        req.body.status === "accepted" &&
        statuses.indexOf(homestay.status) < statuses.indexOf(req.body.status)
      ) {
        const noti = new Notification({
          message: `Your booking of homestay ${homestay.name} have been accepted!`,
          user: booking.user,
        });
        await noti.save();
      } else if (
        req.body.status === "declined" &&
        statuses.indexOf(homestay.status) < statuses.indexOf(req.body.status)
      ) {
        const noti = new Notification({
          message: `Your booking of homestay ${homestay.name} have been declined!`,
          user: booking.user,
        });
        await noti.save();
      }
      //update service
      const serviceBookings = req.body.services;
      for (let i = 0; i < serviceBookings.length; i++) {
        if (serviceBookings[i]._id === "new") {
          const serviceBooking = new ServiceBooking({
            booking: req.params.id,
            homestay: req.body.homestay,
            service: serviceBookings[i].service._id,
            quantity: serviceBookings[i].quantity,
            money: serviceBookings[i].money,
          });
          await serviceBooking.save();
        } else {
          const serviceBooking = await ServiceBooking.findById(
            serviceBookings[i]._id
          );
          serviceBooking.quantity = serviceBookings[i].quantity;
          serviceBooking.money = serviceBookings[i].money;
          await serviceBooking.save();
        }
      }

      res.status(200).send({ booking });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
  async getYourBooking(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user });
      const list = [];
      for (var i = 0; i < bookings.length; i++) {
        await bookings[i]
          .populate({
            path: "homestay",
          })
          .execPopulate();
      }
      bookings.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).send({ user: req.user, bookings });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async deleteService(req, res, next) {
    try {
      const service = await ServiceBooking.findByIdAndDelete({
        _id: req.params.id,
      });
      res.status(200).send("delete successfully");
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
}

module.exports = new BookingController();
