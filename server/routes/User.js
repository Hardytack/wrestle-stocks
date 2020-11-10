const express = require("express");

const router = express.Router();

const User = require("../models/User");

router.get("/usersTest", (req, res) => {
  res.send({ message: "All Users" });
});

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
