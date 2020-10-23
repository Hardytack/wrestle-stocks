const e = require("express");
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
  try {
    const wrestler = await Wrestler.findOne({ name: req.params.name });
    if (!wrestler) {
      return res.status(404).send({ error: "Could not find wrestler" });
    } else {
      const matches = await MatchRecord.find({
        $or: [{ winners: req.params.name }, { losers: req.params.name }],
      });
      if (matches.length > 0) {
        // let total = 0;
        matches.forEach((match) => {
          total += calcPoints(match, req.params.name);
        });
        wrestler.set("points", total);
      } else {
        wrestler.set("points", 0);
      }
      //   const wrestlerParsed = JSON.parse(JSON.stringify(wrestler));
      //   wrestlerParsed.points = total;
      return res.send({ points: total, ...wrestler.toJSON() });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("*", (req, res) => {
  res.send("404 Not Found");
});

module.exports = router;
