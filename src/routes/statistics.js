const express = require("express");

const statisticsController = require("../app/controllers/StatisticsController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.get("/:id", auth, statisticsController.getStatistics);
module.exports = router;
