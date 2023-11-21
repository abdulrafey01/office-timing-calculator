const Attendance = require("../models/Attendance");
const moment = require("moment");

// Check In
exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;

    //   Check if user is already checked in
    const existingCheckin = await Attendance.findOne({
      userId,
      checkoutTime: null,
    });
    if (existingCheckin) {
      return res.status(400).json({ msg: "User already checked in" });
    }

    // Check in otherwise
    const attendance = new Attendance({
      userId,
      checkinTime: new Date(),
    });

    await attendance.save();

    res.status(201).json({ msg: "User checked in successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Unable to Check In", error: error.message });
  }
};

// CheckOut
exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;

    //   Check latest Check In of User
    const latestCheckIn = await Attendance.findOne({
      userId,
      checkoutTime: null,
    }).sort({ checkinTime: -1 });

    if (!latestCheckIn) {
      return res
        .status(400)
        .json({ msg: "No Active Check In found for this user" });
    }

    latestCheckIn.checkoutTime = new Date();

    // Calculate Duration
    const duration = Math.round(
      (latestCheckIn.checkoutTime - latestCheckIn.checkinTime) / (1000 * 60) //in minutes
    );

    latestCheckIn.duration = duration;
    await latestCheckIn.save();

    res.status(201).json({ msg: "User checked out successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Unable to Check Out", error: error.message });
  }
};

// Calculate Single Day Duration
exports.singleDayTime = async (req, res) => {
  try {
    const { date } = req.body;
    const { userId } = req.params;
    const searchDate = new Date(date); // -> Acceptable Format:MM/DD/YYYY
    // console.log(searchDate);

    const attendanceEntries = await Attendance.find({
      userId,
      date: {
        $gte: searchDate,
        $lte: searchDate.getTime() + 86400000,
      },
    });
    // gte 11/18/2023 -> 12:00 AM
    // lte 11/18/2023 -> 11:59 PM

    let totalMinInOffice = 0;

    attendanceEntries.forEach((entry) => {
      totalMinInOffice += entry.duration;
    });

    let totalTimeInOffice = moment
      .utc(totalMinInOffice * 60 * 1000)
      .format("HH:mm");

    res.status(201).json({
      totalTimeInOffice,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Unable to calculate time in office",
      error: error.message,
    });
  }
};
