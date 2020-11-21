require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());
app.use(helmet());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const charactersRoute = require("../routes/characters");
app.use(charactersRoute);
const comicsRoute = require("../routes/comics");
app.use(comicsRoute);
const usersRoute = require("../routes/user");
app.use(usersRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(process.env.PORT, (req, res) => {
  console.log("START");
});
