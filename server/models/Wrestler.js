const mongoose = require("mongoose");

const WrestlerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  altNames: {
    type: Array,
  },
  promotions: {
    type: Array,
    required: true,
  },
  picture: {
    type: String,
    default: "https://wrestle-stocks.s3.amazonaws.com/default.png",
  },
  points: {
    type: Number,
    default: 1000,
  },
  prevPoints: {
    type: Array,
    default: [],
  },
});

const Wrestler = mongoose.model("Wrestler", WrestlerSchema);

module.exports = Wrestler;
