const express = require("express");
const { addUser, fetchAllUsers } = require("../controllers/userControllers");

const router = express.Router();

router.post("/add", addUser);

router.get("/getall", fetchAllUsers);

module.exports = router;
