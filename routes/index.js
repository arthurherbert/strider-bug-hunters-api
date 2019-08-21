var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.send("🐛 Strider Task: BUG HUNTERS");
});

module.exports = router;
