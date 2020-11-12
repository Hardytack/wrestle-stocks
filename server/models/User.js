const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        throw new Error("Username contains illegal characters");
      }
      if (!validator.isLength(value, { min: 4, max: 20 })) {
        throw new Error("Username length is invalid");
      }
    },
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username });

  if (!user) {
    throw new Error("Could not locate user");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  return user;
};

UserSchema.methods.generateAuthTokens = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.username }, process.env.SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    if (
      !validator.isAlphanumeric(document.password) ||
      !validator.isLength(document.password, { min: 8, max: 20 })
    ) {
      const err = { response: "Your password is invalid" };
      next(err);
    }
    bcrypt.hash(document.password, parseInt(process.env.SALT_ROUNDS), function (
      err,
      hashedPassword
    ) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
