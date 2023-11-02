const express = require("express");
const Homestay = require("../models/homestay.js");
const Booking = require("../models/booking.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Image = require("../models/image.js");
const sharp = require("sharp");

class HomestayController {
  async create(req, res) {
    const homestay = new Homestay({
      ...req.body,
      owner: req.user._id,
    });
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        const buffer = await sharp(req.files[i].buffer)
          .resize({ width: 550, height: 500 })
          .png()
          .toBuffer();
        homestay.images.push(buffer);
      }
    }
    try {
      await homestay.save();
      res.status(201).send(homestay);
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async uploadFiles(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          const buffer = await sharp(req.files[i].buffer)
            .resize({ width: 550, height: 500 })
            .png()
            .toBuffer();
          const image = new Image({
            buffer: buffer,
          });
          await image.save();
          homestay.images.push(image);
        }
      }
      await homestay.save();
      res.status(201).send(homestay);
    } catch (e) {
      res.status(400).send(e);
      console.log("Error: " + e);
    }
  }

  async getImage(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (!homestay || homestay.images.length == 0) {
        res.status(400).send(e);
      } else {
        const image = await Image.findById(homestay.images[req.query.index]);
        res.set("Content-Type", "image/png");
        res.send(image.buffer);
      }
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }

  async getHomestay(req, res) {
    try {
      const homestay = await Homestay.findById(req.params.id);
      if (!homestay) {
        res.status(400).send(e);
      } else {
        const owner = await User.findById(homestay.owner);
        await owner
          .populate({
            path: "homestays",
          })
          .execPopulate();
        res.send({
          homestay: homestay,
          owner: owner,
        });
      }
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  }

  async update(req, res) {
    const updates = Object.keys(req.body);
    const homestay = await Homestay.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isActive: true,
    });
    try {
      updates.forEach((update) => (homestay[update] = req.body[update]));
      await homestay.save();
      res.status(200).send(homestay);
    } catch (e) {
      res.status(400).send(e);
      console.log(e);
    }
  }

  async delete(req, res) {
    try {
      const homestay = await Homestay.findOne({
        _id: req.params.id,
        isActive: true,
        owner: req.user._id,
      });
      if (!homestay) {
        throw new Error("Not found");
      }
      homestay.isActive = false;
      await homestay.save();
      res.status(200).send({
        message: "delete successfully",
      });
    } catch (e) {
      res.status(400).send();
    }
  }

  async getList(req, res) {
    try {
      const homestays = await Homestay.find({
        owner: req.query.userid,
        isActive: true,
      });

      const bookings = [];
      for (const h of homestays) {
        const book = await Booking.findOne({
          homestay: h._id,
          status: "requested",
        });
        if (book) {
          bookings.push(h._id);
        }
      }
      res.status(200).send({ homestays: homestays, bookings });
    } catch (e) {
      res.status(400).send();
      console.log({ e });
    }
  }
}

module.exports = new HomestayController();
