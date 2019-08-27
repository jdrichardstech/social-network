const express = require("express");
const router = express.Router();

// @route GET api/posts
// @desc Test route
// @access Public Route No Token Needed
router.get("/", (req, res) => {
  res.send("Posts Test Route");
});

module.exports = router;
