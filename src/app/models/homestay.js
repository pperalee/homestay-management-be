const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
      default: 105.84713,
    },
    latitude: {
      type: Number,
      required: true,
      default: 21.030653,
    },
    price: {
      type: Number,
      required: true,
    },
    people: {
      type: Number,
      required: true,
    },
    bookingNumber: {
      type: Number,
      default: 0,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
      required: true,
    },
    pool: {
      type: Boolean,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Homestay = mongoose.model("Homestay", Schema);

module.exports = Homestay;
