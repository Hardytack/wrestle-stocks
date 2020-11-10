const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
  },
  username: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isAlphanumeric(value)) {
        throw new Error('Username contains illegal characters');
      }
      if (!validator.isLength(value, {min: 4, max: 20})) {
        throw new Error('Username length is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "https://wrestle-stocks.s3.amazonaws.com/default.png",
  },
  balance: {
    type: Number,
    default: 10000,
  },
  role: {
    type: String,
    default: "User",
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
