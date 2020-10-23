const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  winners: {
    type: Array,
    required: true,
  },
  losers: {
    type: Array,
    required: true,
  },
  finish: {
    type: String,
    required: true,
  },
  stipulation: {
    type: String,
    required: true,
  },
  titleMatch: {
    type: Boolean,
    required: true,
  },
  titleOptions: {
    type: Array,
    required: false,
  },
  event: {
    type: String,
    required: true,
  },
});

const MatchRecord = mongoose.model("MatchRecord", MatchSchema);

module.exports = MatchRecord;
