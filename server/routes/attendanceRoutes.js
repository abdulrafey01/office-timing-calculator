const express = require("express");
const {
  checkIn,
  checkOut,
  singleDayTime,
} = require("../controllers/attendanceControllers");

const router = express.Router();

router.post("/checkin", checkIn);

router.post("/checkout", checkOut);

router.post("/gettotal/:userId", singleDayTime);
module.exports = router;
