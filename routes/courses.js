var express = require("express");
var router = express.Router();

const {
  getCourseraCourses,
  getUdemyCourses,
  getSkillShareCourses,
  getCourses,
} = require("../controllers/courses");
router.get(
  "/courses",
  getUdemyCourses,
  getCourseraCourses,
  getSkillShareCourses,
  getCourses
);

module.exports = router;
