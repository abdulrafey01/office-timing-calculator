const User = require("../models/User");

exports.addUser = async (req, res) => {
  try {
    const { username } = req.body;
    console.log(username);
    const user = new User({ username });

    await user.save();

    res.status(201).json({
      msg: `User ${username} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong Adding User",
    });
  }
};

exports.fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(201).json({
      users,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong Fetching Users",
    });
  }
};
