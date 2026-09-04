const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// ===============================
// GET ALL JOBS
// ===============================
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// ===============================
// SEARCH JOBS FROM MONGODB
// ===============================
router.get("/search", async (req, res) => {
  try {
    const {
      role,
      location,
      experience,
      jobType,
    } = req.query;

    const query = {};

    // Frontend role => MongoDB title
    if (role) {
      query.title = {
        $regex: role,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (experience) {
      query.experience = experience;
    }

    // Frontend jobType => MongoDB type
    if (jobType) {
      query.type = jobType;
    }

    console.log("Search Query:", query);

    const jobs = await Job.find(query);

    console.log("Found Jobs:", jobs.length);

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});

module.exports = router;