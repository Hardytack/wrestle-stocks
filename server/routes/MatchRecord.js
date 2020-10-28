const express = require("express");

const router = express.Router();

const calcPoints = require("../Points");

const Wrestler = require("../models/Wrestler");
const MatchRecord = require("../models/MatchRecord");

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
      match.save();
      res.status(201).send(match);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }
});

module.exports = router;

// Helper functions to confirm if Wrestlers are valid
async function asyncVerify(arr, cb) {
  let check = true;
  for (let i = 0; i < arr.length; i++) {
    let result = await cb(arr[i]);

    if (!result) check = false;
  }
  return check;
}

async function verifyWrestlers(name) {
  try {
    let regexVal = `^${name}$`;
    let regexName = new RegExp(regexVal, "i");
    const wrestler = await Wrestler.findOne({
      name: { $regex: new RegExp(regexName, "i") },
    });
    if (!wrestler) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
