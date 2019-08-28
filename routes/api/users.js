const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// process.env.SUPPRESS_NO_CONFIG_WARNING = "y";
// const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route POST api/users/register
// @desc Register User
// @access Public Route No Token Needed

router.post(
  "/register",
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

      // Encrypt password with bcryptjs
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jswonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //Send Registered Message
      // res.send("User Registered");
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

// @route GET api/users/
// @desc Get All Users
// @access Public Route No Token Needed

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users) return res.status(400).json({ msg: "Profile not found" });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
