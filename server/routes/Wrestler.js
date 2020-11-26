const express = require("express");

const router = express.Router();

const { wrestlerReset } = require("../Points");

const Wrestler = require("../models/Wrestler");
const MatchRecord = require("../models/MatchRecord");

// Fetches a list of all Wrestlers
router.get("/all", async (req, res) => {
  let wrestlers;
  if (!req.query.promotion) {
    wrestlers = await Wrestler.find({}).sort("name");
  } else {
    let regexVal = `^${req.query.promotion}$`;
    let regexName = new RegExp(regexVal, "i");
    wrestlers = await Wrestler.find({
      promotions: regexName,
    }).sort("name");
  }
  res.send({ wrestlers });
});

router.get("/topWrestlers", async (req, res) => {
  let promotions = ["WWE", "AEW", "NJPW"];
  let wrestlers = [];
  // await promotions.forEach(async (prom) => {
  //   let wrestler = await Wrestler.findOne({ promotions: prom }).sort("-points");
  //   wrestlers.push(wrestler);
  // });
  for (prom in promotions) {
    let wrestler = await Wrestler.findOne({
      promotions: promotions[prom],
    }).sort("-points");
    wrestlers.push(wrestler);
  }
  res.send({ top: wrestlers });
});

// Fetches all matches for specific Wrestler
router.get("/:name/matches", async (req, res) => {
  let regexVal = `^${req.params.name}$`;
  let regexName = new RegExp(regexVal, "i");
  const wrestler = await Wrestler.findOne({
    $or: [{ name: { $regex: regexName } }, { altNames: { $regex: regexName } }],
  });
  const matches = await MatchRecord.find({
    $or: [
      { winners: wrestler.name },
      { winners: wrestler.altNames },
      { losers: wrestler.name },
      { losers: wrestler.altNames },
    ],
  });
  return res.send(matches);
});

// Fetches a Wrestlers profile
router.get("/:name/profile", async (req, res) => {
  let regexVal = `^${req.params.name}$`;
  let regexName = new RegExp(regexVal, "i");
  try {
    const wrestler = await Wrestler.findOne({
      $or: [
        { name: { $regex: regexName } },
        { altNames: { $regex: regexName } },
      ],
    });
    if (!wrestler) {
      return res.status(404).send({ error: "Could not find wrestler" });
    } else {
      const matches = await MatchRecord.find({
        $or: [
          { winners: wrestler.name },
          { losers: wrestler.name },
          { winners: wrestler.altNames },
          { losers: wrestler.altNames },
        ],
      });
      return res.send({ profile: wrestler, matches: matches });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.post("/new", async (req, res) => {
  const wrestler = new Wrestler(req.body);
  try {
    await wrestler.save();
    res.status(201).send(wrestler);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error has occured" });
  }
});

// Resets and Recalculates all Wrestlers Values
router.get("/globalUpdate", async (req, res) => {
  const wrestlers = await Wrestler.find({});
  for (let i = 0; i < wrestlers.length; i++) {
    console.log(`Updating ${wrestlers[i]}`);
    await wrestlerReset(wrestlers[i]);
  }
  res.send("All Updated...?");
});

// Resets and Recalculates a Single Wrestler Values
router.get("/reset/:name", async (req, res) => {
  const wrestler = await Wrestler.findOne({ name: req.params.name });
  if (!wrestler) {
    return res.status(404).send({ error: "Please enter a valid name" });
  }
  try {
    await wrestlerReset(wrestler);
    res.send(`${req.params.name} has been updated`);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

router.get("*", (req, res) => {
  res.send("404 Not Found");
});

module.exports = router;
