const express = require("express");

const router = express.Router();

const calcPoints = require("../Points");

const Wrestler = require("../models/Wrestler");
const MatchRecord = require("../models/MatchRecord");

// Fetches all matches for specific Wrestler
router.get("/:name/matches", async (req, res) => {
  const matches = await MatchRecord.find({
    $or: [{ winners: req.params.name }, { losers: req.params.name }],
  });
  return res.send(matches);
});

// Fetches a Wrestlers profile
router.get("/:name/profile", async (req, res) => {
  let total = 1000;
  let regexVal = `^${req.params.name}$`;
  let regexName = new RegExp(regexVal, "i");
  try {
    const wrestler = await Wrestler.findOne({ name: { $regex: regexName } });
    if (!wrestler) {
      return res.status(404).send({ error: "Could not find wrestler" });
    } else {
      const matches = await MatchRecord.find({
        $or: [
          { winners: { $regex: regexName } },
          { losers: { $regex: regexName } },
        ],
      });
      if (matches.length > 0) {
        // let total = 0;
        matches.forEach((match) => {
          total += calcPoints(match, wrestler.name);
        });
        wrestler.set("points", total);
      } else {
        wrestler.set("points", 0);
      }
      return res.send({ points: total, ...wrestler.toJSON() });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/new", async (req, res) => {
  const user = new Wrestler(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error has occured" });
  }
});

router.get("*", (req, res) => {
  res.send("404 Not Found");
});

module.exports = router;
