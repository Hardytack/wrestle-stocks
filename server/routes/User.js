const express = require("express");

const router = express.Router();

const User = require("../models/User");

const { withAuth, withAdminAuth } = require("../middleware/middleware");

router.get("/adminCheck", withAdminAuth, async (req, res) => {
  res.status(200).send("Hello");
});

router.get("/checkToken", withAuth, async (req, res) => {
  res.status(200).send();
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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.username,
      req.body.password
    );
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
