const jwt = require("jsonwebtoken");
const User = require("../models/User");

const withAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({
      username: decoded._id,
      "tokens.token": token,
    });

    if (!user || user.username !== req.header("Username")) {
      throw new Error();
    }

    next();
  } catch (e) {
    console.log(e);
    res.status(401).send(e);
  }
};

module.exports = withAuth;
