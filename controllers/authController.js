const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "SUCCESS",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.signUp = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      password: hashPassword,
    });
    console.log(newUser);
    req.session.user = newUser;
    res.status(201).json({
      status: "SUCCESS",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "FAILED",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        status: "FAILED",
        message: "User not found",
      });
      return;
    }
    const isCorrect = await bcrypt.compare(password, user.password);

    if (isCorrect) {
      req.session.user = user;
      res.status(200).json({
        status: "SUCCESS",
      });
    } else {
      res.status(400).json({
        status: "FAILED",
        message: "Incorrect username or password",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "FAILED",
    });
  }
};
