const express = require("express");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const router = express.Router();

const User = require("../models/User");

const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/user/signup", async (req, res) => {
  try {
    const { email, username, password } = req.fields;
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).json({
        message: "This email already has an account",
      });
    } else {
      if (email && username && password) {
        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const newUser = new User({
          email,
          username,
          token,
          hash,
          salt,
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          token: newUser.token,
        });
      } else {
        res.status(400).json({
          message: "Missing parameters",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { password, email } = req.fields;

    const userLogin = await User.findOne({ email });
    if (userLogin) {
      // Compare DB password with fields password + salt
      if (
        userLogin.hash === SHA256(password + userLogin.salt).toString(encBase64)
      ) {
        res.status(200).json({
          _id: userLogin._id,
          account: userLogin.account,
          token: userLogin.token,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.get("/user/favorites", isAuthenticated, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/user/favorites/update", isAuthenticated, async (req, res) => {
  try {
    const { favoriteCharacter } = req.fields;

    const user = await User.findById(req.user.id);
    // Checking if character ID is already in our bdd

    if (user.favorites.favoriteCharacters.length === 0) {
      user.favorites.favoriteCharacters.push(favoriteCharacter);
    } else {
      let isInside = false;
      for (let i = 0; i < user.favorites.favoriteCharacters.length; i++) {
        if (
          user.favorites.favoriteCharacters[i][0].id === favoriteCharacter[0].id
        ) {
          user.favorites.favoriteCharacters.splice(i, 1);
          isInside = true;
        }
      }
      if (!isInside) {
        user.favorites.favoriteCharacters.push(favoriteCharacter);
      }
    }

    await user.save();

    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
