require("dotenv").config();

const express = require("express");

const app = express();

require("./db/mongoose");

const calcPoints = require("./Points");

const User = require("./models/User");
const MatchRecord = require("./models/MatchRecord");

// Import and Attach Routes
const WrestlerRoute = require("./routes/Wrestler");
const Wrestler = require("./models/Wrestler");

app.use("/wrestler", WrestlerRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/match", async (req, res) => {
  try {
    const match = await MatchRecord.findOne({ finish: "Submission" });
    const points = calcPoints(match, "Brodie Lee");
    console.log(points);
    res.send({ points: points });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/addMatch", async (req, res) => {
  const record = new MatchRecord({
    winners: ["Chris Jericho"],
    losers: ["Hiroshi Tanahashi"],
    finish: "Pinfall",
    stipulation: "None",
    titleMatch: false,
    titleOptions: [],
    event: "Wrestle Kingdom",
  });
  try {
    await record.save();
    res.status(201).send(record);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

app.get("/addPerson", async (req, res) => {
  const user = new Wrestler({
    name: "Chris Jericho",
    promotions: ["AEW", "NJPW"],
  });
  try {
    await user.save();
    res.send(user);
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "An error has occured" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
