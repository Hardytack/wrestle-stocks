const express = require("express");

const router = express.Router();

const { updateWrestlerPoints } = require("../Points");
const { asyncVerify, verifyWrestlers } = require("../utils");

const Wrestler = require("../models/Wrestler");
const MatchRecord = require("../models/MatchRecord");

// Return a Single Wrestlers Matches
router.get("/:name/all", async (req, res) => {
  let regexVal = `^${req.params.name}$`;
  let regexName = new RegExp(regexVal, "i");
  const matches = await MatchRecord.find({
    $or: [
      { winners: { $regex: regexName } },
      { losers: { $regex: regexName } },
    ],
  });
  res.send(matches);
});

// Return an array of All Matches
router.get("/all", async (req, res) => {
  const matches = await MatchRecord.find({}).sort("date");
  res.send(matches);
});

router.post("/new", async (req, res) => {
  const winCheck = await asyncVerify(req.body.winners, verifyWrestlers);
  const loseCheck = await asyncVerify(req.body.losers, verifyWrestlers);

  if (!winCheck || !loseCheck) {
    console.log("Invalid Wrestler");
    res.send({ message: "Please make sure all wrestlers are valid" });
  } else {
    const match = new MatchRecord(req.body);
    try {
      await match.save();
      for (let i = 0; i < req.body.winners.length; i++) {
        const wrestler = await Wrestler.findOne({
          $or: [
            { name: req.body.winners[i] },
            { altNames: req.body.winners[i] },
          ],
        });
        await updateWrestlerPoints(wrestler);
      }
      for (let i = 0; i < req.body.losers.length; i++) {
        const wrestler = await Wrestler.findOne({
          $or: [{ name: req.body.losers[i] }, { altNames: req.body.losers[i] }],
        });
        await updateWrestlerPoints(wrestler);
      }
      res.status(201).send(match);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
});

module.exports = router;
