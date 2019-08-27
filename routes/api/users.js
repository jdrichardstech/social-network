const express = require("express");
const router = express.Router();

// @route GET api/users
// @desc Test route
// @access Public Route No Token Needed
router.get("/", (req, res) => {
  res.send("User Test Route");
});

module.exports = router;
