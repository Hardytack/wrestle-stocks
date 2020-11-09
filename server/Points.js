const Wrestler = require("./models/Wrestler");
const MatchRecord = require("./models/MatchRecord");

const points = {
  events: {
    D: [
      "Dark",
      "Main Event",
      "205 Live",
      "NXT UK",
      "New Japan Road",
      "Tiger Hattori Retirement Event",
      "Manabu Nakanishi Retirement Event",
    ],
    C: [
      "Raw",
      "Dynamite",
      "Smackdown",
      "NXT",
      "Strong",
      "New Years Dash",
      "The New Beginning in Sapporo",
    ],
    B: [
      "Battleground",
      "UK Takeover: Blackpool 2",
      "Worlds Collide",
      "The New Beginning in Osaka",
      "Super Showdown",
      "Elimination Chamber",
    ],
    A: [
      "Double or Nothing",
      "Revolution",
      "Royal Rumble",
      "Takeover: Portland",
    ],
    S: ["Wrestlemania", "Wrestle Kingdom"],
  },
};

// Wrapper Function
const calcPoints = (match, wrestler) => {
  // Check if match has special point values (ie: Rumble, MitB)
  if (match.stipulation == "Royal Rumble") {
    if (match.winners.includes(wrestler)) {
      return 300;
    } else if (match.losers.includes(wrestler)) {
      return -20;
    }
  }

  if (match.stipulation == "Elimination Chamber") {
    if (match.titleMatch) {
      if (match.winners.includes(wrestler)) {
        return 150;
      } else if (match.losers.includes(wrestler)) {
        return -25;
      }
    } else {
      if (match.winners.includes(wrestler)) {
        return 100;
      } else if (match.losers.includes(wrestler)) {
        return -20;
      }
    }
  }

  if (match.stipulation.includes("Tournament")) {
    if (match.stipulation.includes("Dusty Rhodes Classic")) {
      if (match.winners.includes(wrestler)) {
        return 50;
      } else if (match.losers.includes(wrestler)) {
        return -25;
      }
    }
  }

  if (match.stipulation == "Money in the Bank") return;

  // Determine initial value
  let total = 0;
  if (match.finish == "DQ" || match.finish == "Countout") total += 1;
  else if (match.finish == "Pinfall") total += 2;
  else if (match.finish == "Submission") total += 3;
  else total += 5;

  // Add Title Multiplier
  if (match.titleMatch) total *= titleMultiplier(match.titleOptions, wrestler);

  // Add Event Multiplier
  total *= eventMultiplier(match);

  // Make number negative if wrestler is loser
  if (match.losers.includes(wrestler)) total *= -1;

  return total;
};

// Returs multiplier for Title Match
const titleMultiplier = (options, wrestler) => {
  let total = 0;
  options.forEach((title) => {
    if (!title.change) {
      total += 2;
    } else {
      if (title.new.includes(wrestler) || title.old.includes(wrestler)) {
        total += 3;
      } else {
        total += 2;
      }
    }
  });
  return total;
};

// Returns multiplier for Event
const eventMultiplier = (match) => {
  if (points.events.D.includes(match.event)) return 1;
  if (points.events.C.includes(match.event)) return 2;
  if (points.events.B.includes(match.event)) return 3;
  if (points.events.A.includes(match.event)) return 5;
  if (points.events.S.includes(match.event)) return 10;
};

async function getPoints(wrestler) {
  const matches = await MatchRecord.find({
    $or: [
      { winners: wrestler.name },
      { winners: wrestler.altNames },
      { losers: wrestler.name },
      { losers: wrestler.altNames },
    ],
  });
  if (matches.length > 0) {
    let total = 1000;
    matches.forEach((match) => {
      total += calcPoints(match, wrestler.name);
    });
    return total;
  } else {
    return 1000;
  }
}

async function wrestlerReset(wrestler) {
  wrestler.points = 500;
  wrestler.prevPoints = [];

  const matches = await MatchRecord.find({
    $or: [
      { winners: { $regex: wrestler.name } },
      { losers: { $regex: wrestler.name } },
    ],
  }).sort("date");
  for (let i = 0; i < matches.length; i++) {
    let points = await calcPoints(matches[i], wrestler.name);
    if (points == wrestler.points + points) {
    } else {
      wrestler.prevPoints.push(wrestler.points);
      wrestler.points += points;
      await wrestler.save();
    }
  }

  return;
}

async function updateWrestlerPoints(wrestler) {
  let points = await getPoints(wrestler);
  if (wrestler.points != points) {
    wrestler.prevPoints.push(wrestler.points);
    wrestler.points = points;
    await wrestler.save();
    return;
  } else {
    return;
  }
}

module.exports = { calcPoints, updateWrestlerPoints, getPoints, wrestlerReset };
