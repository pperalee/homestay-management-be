const express = require("express");

const bookingController = require("../app/controllers/BookingController");
const auth = require("../app/middleware/auth");

const router = express.Router();

router.post("/search", bookingController.search);
router.post("/bookings/:id", auth, bookingController.book);
router.put("/bookings/:id", auth, bookingController.update);
router.get(
  "/bookings/homestay/:homestayId",
  auth,
  bookingController.getBookingByHomestay
);
router.get("/bookings/your-booking", auth, bookingController.getYourBooking);
router.get("/bookings/:id", auth, bookingController.getBookingDetail);
//delete service booking
router.delete("/service-bookings/:id", auth, bookingController.deleteService);
module.exports = router;
