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

router.get("/", async (req, res) => {
  try {
    // Request exemple http://gateway.marvel.com/v1/public/comics?ts=1&apikey=1234&hash=ffd275c5130566a2916217b101f26150

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicMarvelKey}&hash=${hash}&limit=100`
    );

    console.log(response.data.data.results);

    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
