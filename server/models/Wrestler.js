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
});

const Wrestler = mongoose.model("Wrestler", WrestlerSchema);

module.exports = Wrestler;
