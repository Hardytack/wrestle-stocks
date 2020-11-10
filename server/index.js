require("dotenv").config();

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

require("./db/mongoose");

// Import and Attach Routes
const WrestlerRoute = require("./routes/Wrestler");
const MatchRoute = require("./routes/MatchRecord");
const UserRoute = require("./routes/User");

app.use(bodyParser.json());
app.use("/api/wrestler", WrestlerRoute);
app.use("/api/matches", MatchRoute);
app.use("/api/user", UserRoute);

app.get("/test", (req, res) => {
  res.send({ message: "Hello World" });
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
