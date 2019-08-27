const express = require("express");
const router = express.Router();

// @route GET api/auth
// @desc Test route
// @access Public Route No Token Needed
router.get("/", (req, res) => {
  res.send("Auth Test Route");
});

module.exports = router;
