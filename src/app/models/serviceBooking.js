const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    money: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceBooking = mongoose.model("ServiceBooking", Schema);

module.exports = ServiceBooking;
