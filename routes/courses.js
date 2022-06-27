var express = require("express");
var router = express.Router();

// const {getJobsFromFreelanceCom, getJobsFromUpwork, getJobsFromPeoplePerHour} = require("../controllers/jobs")

// router.get("/jobs/upwork", getJobsFromUpwork);
// router.get("/jobs/freelancer", getJobsFromFreelanceCom);
// router.get("/jobs/peopleperhour", getJobsFromPeoplePerHour);

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
