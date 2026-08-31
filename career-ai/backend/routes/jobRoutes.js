const express = require("express");

const {
  searchJobs,
  getJobById,
  getAllJobs,
} = require("../controllers/jobController");

const router = express.Router();

// GET ALL JOBS
// GET /api/jobs
router.get("/", getAllJobs);

// SEARCH JOBS
// GET /api/jobs/search
router.get("/search", searchJobs);

// GET SINGLE JOB
// GET /api/jobs/:id
router.get("/:id", getJobById);

module.exports = router;