const express = require("express");
const multer = require("multer");
const reviewController = require("../app/controllers/ReviewController");
const auth = require("../app/middleware/auth");

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please update an image"));
    }
    cb(undefined, true);
  },
});

const router = express.Router();

router.post("/:bookingId", auth, reviewController.create);

router.get("/:homestayId", reviewController.getAllByHomestayId);

router.get("/:id/image", reviewController.getImage);

router.post(
  "/:id/image",
  auth,
  upload.array("files"),
  reviewController.uploadImage
);

module.exports = router;
