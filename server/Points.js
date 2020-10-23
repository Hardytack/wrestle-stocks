const points = {
  events: {
    D: ["Dark", "Main Event"],
    C: ["Raw", "Dynamite"],
    B: ["Battleground"],
    A: ["Double or Nothing"],
    S: ["Wrestlemania", "Wrestle Kingdom"],
  },
};

// Wrapper Function
const calcPoints = (match, wrestler) => {
  // Check if match has special point values (ie: Rumble, MitB)
  if (
    match.stipulation == "Royal Rumble" ||
    match.stipulation == "Money in the Bank"
  )
    return;

  // Determine initial value
  let total = 0;
  if (match.finish == "DQ" || match.finish == "Countout") total += 1;
  else if (match.finish == "Pinfall") total += 2;
  else if (match.finish == "Submission") total += 3;
  else total += 5;

  // Add Title Multiplier
  if (match.titleMatch) total *= titleMultiplier(match);

  // Add Event Multiplier
  total *= eventMultiplier(match);

  // Make number negative if wrestler is loser
  if (match.losers.includes(wrestler)) total *= -1;

  return total;
};

// Returs multiplier for Title Match
const titleMultiplier = (match) => {
  if (match.titleMatch) {
    if (match.titleOptions[0]) return 3;
    else return 2;
  }
};

// Returns multiplier for Event
const eventMultiplier = (match) => {
  if (points.events.D.includes(match.event)) return 1;
  if (points.events.C.includes(match.event)) return 2;
  if (points.events.B.includes(match.event)) return 3;
  if (points.events.A.includes(match.event)) return 5;
  if (points.events.S.includes(match.event)) return 10;
};

module.exports = calcPoints;
