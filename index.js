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

const charactersRoute = require("./routes/characters");
app.use(charactersRoute);

const comicsRoute = require("./routes/comics");
app.use(comicsRoute);

app.all("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen("3100", (req, res) => {
  console.log("START");
});
