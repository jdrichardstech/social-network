const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
// @route POST api/users
// @desc Register User
// @access Public Route No Token Needed
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please include a valid email").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // See if user exists
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: `User already exists` }]
        });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      //Create the new user
      user = new User({
        name,
        email,
        avatar,
        password
      });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Return jswonwebtoken
      // const payload = {
      //   user: {
      //     id: user.id
      //   }
      // };
      // jwt.sign(payload);
      //Send Registered Message
      res.send("User Registered");
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
