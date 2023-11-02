const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    homestay: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Homestay",
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    people: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "none",
    },
    checkin: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "stayed", "declined", "reviewed"],
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    discountMoney: {
      type: Number,
    },
    money: {
      type: Number,
    },
    deposit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", Schema);

module.exports = Booking;
