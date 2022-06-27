var express = require("express");
var router = express.Router();

const {
  getDevfolioHackathons,
  getDevpostHackathons,
  getHackathons,
} = require("../controllers/hackathons");

router.get(
  "/hackathons",
  getDevfolioHackathons,
  getDevpostHackathons,
  getHackathons
);
module.exports = router;
