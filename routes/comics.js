const express = require("express");
const router = express.Router();
const md5 = require("crypto-js/md5");
const axios = require("axios");

// Creation of TS
const date = new Date();
const timestamp = date.getTime() / 1000;
const ts = Math.floor(timestamp);

// Creation of Hash using Ts, private Marvel key and public Marvel key
const publicMarvelKey = "64498682b973ea81107a3d18b89aa258";
const hash = md5(
  ts + process.env.MARVEL_PRIVATE_KEY + publicMarvelKey
).toString();

router.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?orderBy=title&ts=${ts}&apikey=${publicMarvelKey}&hash=${hash}&limit=100`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/comic/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics/${req.params.id}?ts=${ts}&apikey=${publicMarvelKey}&hash=${hash}`
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
