const Job = require("../models/Job");

const {
  calculateJobMatch,
  getMatchingSkills,
} = require("../services/jobMatchingService");

// ========================================
// SEARCH JOBS
// GET /api/jobs/search
// ========================================

const searchJobs = async (req, res) => {
  try {
    const {
      role = "",
      location = "",
      experience = "",
      jobType = "",
      skills = "",
    } = req.query;

    const query = {};

    // Role
    if (role.trim()) {
      query.title = {
        $regex: role.trim(),
        $options: "i",
      };
    }

    // Location
    if (location.trim()) {
      query.location = {
        $regex: location.trim(),
        $options: "i",
      };
    }

    // Experience
    if (experience.trim()) {
      query.experience = {
        $regex: experience.trim(),
        $options: "i",
      };
    }

    // Job Type
    if (jobType.trim()) {
      query.type = {
        $regex: jobType.trim(),
        $options: "i",
      };
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Resume skills
    let resumeSkills = [];

    if (skills.trim()) {
      resumeSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Calculate matching
    const result = jobs.map((job) => {
      const match = calculateJobMatch(
        resumeSkills,
        job.skills
      );

      const matchingSkills = getMatchingSkills(
        resumeSkills,
        job.skills
      );

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        experience: job.experience,
        salary: job.salary,
        skills: job.skills,
        description: job.description,
        applyUrl: job.applyUrl,
        companyUrl: job.companyUrl,
        match,
        matchingSkills,
      };
    });

    // Highest match first
    result.sort((a, b) => b.match - a.match);

    res.status(200).json({
      success: true,
      count: result.length,
      jobs: result,
    });
  } catch (error) {
    console.error("Job Search Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to search jobs",
      error: error.message,
    });
  }
};

// ========================================
// GET SINGLE JOB
// GET /api/jobs/:id
// ========================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get job",
      error: error.message,
    });
  }
};

// ========================================
// GET ALL JOBS
// GET /api/jobs
// ========================================

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get jobs",
      error: error.message,
    });
  }
};

module.exports = {
  searchJobs,
  getJobById,
  getAllJobs,
};