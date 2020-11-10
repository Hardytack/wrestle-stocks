const express = require("express");

const router = express.Router();

const User = require("../models/User");

const withAuth = require("../middleware/middleware");

// router.get("/usersTest", withAuth, async (req, res) => {
//   try {
//     const user = await User.findOne({ username: req.headers.username });
//     res.send(user);
//   } catch (e) {
//     console.log(e);
//     res.status(500).send(e);
//   }
// });

router.get("/adminCheck", async (req, res) => {
  res.send("Hello");
});

router.post("/new", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthTokens();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("*", (req, res) => {
  res.send("404 Not Found");
});

module.exports = router;
