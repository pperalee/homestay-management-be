const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    buffer: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", Schema);

module.exports = Image;
