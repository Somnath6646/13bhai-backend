var express = require('express')
var router = express.Router()

const {getJobs, getJobsFromFreelanceCom, getJobsFromUpwork, getJobsFromPeoplePerHour} = require("../controllers/jobs")

// router.get("/jobs/upwork", getJobsFromUpwork);
// router.get("/jobs/freelancer", getJobsFromFreelanceCom);
// router.get("/jobs/peopleperhour", getJobsFromPeoplePerHour);
router.get("/jobs/", getJobsFromFreelanceCom, getJobsFromUpwork , getJobsFromPeoplePerHour, getJobs);

module.exports = router;