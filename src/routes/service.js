const express = require("express");

const serviceController = require("../app/controllers/ServiceController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("", auth, serviceController.postCreate);

router.delete("/:id", auth, serviceController.delete);
router.put("/:id", auth, serviceController.update);

router.get("/:id", serviceController.getService);
router.get("/:homestayId/all", serviceController.getServicesByHomestay);
module.exports = router;
