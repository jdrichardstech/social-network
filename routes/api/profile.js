const express = require("express");
const router = express.Router();

// @route GET api/profile
// @desc Test route
// @access Public Route No Token Needed
router.get("/", (req, res) => {
  res.send("Profile Test Route");
});

module.exports = router;
