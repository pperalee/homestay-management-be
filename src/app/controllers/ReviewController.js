const express = require("express");
const Homestay = require("../models/homestay.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");
const Image = require("../models/image.js");
const sharp = require("sharp");

class ReviewController {
  async create(req, res) {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      const review = new Review({
        ...req.body,
        homestay: booking.homestay,
        user: req.user,
      });
      await review.save();
      booking.status = "reviewed";
      await booking.save();
      //update homestay rate
      const reviews = await Review.find({ homestay: booking.homestay });
      let avg = 0;
      let total = 0;
      for (let i = 0; i < reviews.length; i++) {
        await reviews[i]
          .populate({
            path: "user",
          })
          .execPopulate();
        total += reviews[i].rate;
      }
      avg = total / reviews.length;
      const homestay = await Homestay.findById(booking.homestay);
      homestay.rate = avg;
      await homestay.save();
      res.status(201).send({ review });
    } catch (e) {
      res.status(400).send(e);
      console.log({ e });
    }
  }

  async getAllByHomestayId(req, res) {
    try {
      const reviews = await Review.find({
        homestay: req.params.homestayId,
      }).populate({
        path: "user",
      });
      const homestay = await Homestay.findById(req.params.homestayId);
      reviews.sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).send({ reviews, averageStar: homestay.rate });
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async uploadImage(req, res) {
    try {
      console.log(req.files);
      const review = await Review.findById(req.params.id);
      if (req.files.length > 0) {
        const buffer = await sharp(req.files[0].buffer)
          .resize({ width: 550, height: 500 })
          .png()
          .toBuffer();
        const image = new Image({
          buffer: buffer,
        });
        await image.save();
        review.image = image;
        await review.save();
      }
      res.status(201).send();
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async getImage(req, res) {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        res.status(400).send(e);
      } else {
        const image = await Image.findById(review.image);
        res.set("Content-Type", "image/png");
        res.send(image.buffer);
      }
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }
}

module.exports = new ReviewController();
