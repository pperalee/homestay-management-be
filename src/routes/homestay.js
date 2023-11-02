const express = require("express");
const HomestayController = require("../app/controllers/HomestayController");
const auth = require("../app/middleware/auth");
const multer = require("multer");

const router = express.Router();

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
//create
router.post("", auth, upload.array("image"), HomestayController.create);
//:id
router.post(
  "/:id",
  auth,
  upload.array("files"),
  HomestayController.uploadFiles
);
//update
router.put("/:id", auth, HomestayController.update);
//get homestay
router.get("/:id", HomestayController.getHomestay);
//get image ?index=1
router.get("/:id/images", HomestayController.getImage);
// get homestays?userid=...
router.get("", auth, HomestayController.getList);
router.post("/:id/delete", auth, HomestayController.delete);

module.exports = router;
