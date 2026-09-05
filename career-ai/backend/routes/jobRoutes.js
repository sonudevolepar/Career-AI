const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { fetchExternalJobs } = require("../services/externalJobService");
const {
  calculateJobMatch,
  getMatchingSkills,
} = require("../services/jobMatchingService");

// Safe Import for Email Service
let sendEmail;
try {
  sendEmail = require("../services/emailService").sendEmail;
} catch (err) {
  sendEmail = null;
}

// ========================================
// 1. GET ALL JOBS
// GET /api/jobs
// ========================================
router.get("/", async (req, res) => {
  try {
    let jobs = await Job.find().sort({ createdAt: -1 }).limit(100);

    // Fallback: DB Khali Hone Par Default External/Gemini Jobs Load Hongi
    if (!jobs || jobs.length === 0) {
      console.log("Database empty: Fetching default jobs...");
      jobs = await fetchExternalJobs("MERN Stack Developer", "India");
    }

    return res.status(200).json({
      success: true,
      count: jobs ? jobs.length : 0,
      jobs: jobs || [],
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
    });
  }
});

// ========================================
// 2. SEARCH JOBS (WITH FLEXIBLE REGEX & FALLBACK)
// GET /api/jobs/search
// ========================================
router.get("/search", async (req, res) => {
  try {
    const {
      role = "",
      location = "",
      experience = "",
      jobType = "",
      skills = "",
    } = req.query;

    const query = {};

    // Loose Case-Insensitive Regex Filters
    if (role && role.trim() !== "") {
      query.title = { $regex: role.trim(), $options: "i" };
    }

    if (location && location.trim() !== "") {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    // Flexible Experience Matching ('0-1 Years' Exact Match Fix)
    if (experience && experience.trim() !== "" && experience !== "Fresher") {
      const expNumber = experience.replace(/[^0-9-]/g, "");
      query.experience = { $regex: expNumber || experience.trim(), $options: "i" };
    }

    if (jobType && jobType.trim() !== "") {
      query.type = { $regex: jobType.trim(), $options: "i" };
    }

    console.log("Executing DB Query:", query);

    let jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50);
    console.log("Found DB Jobs:", jobs.length);

    // FALLBACK: Agar Filter Se 0 Jobs Mile Toh Gemini API Live Fetch Karega
    if (!jobs || jobs.length === 0) {
      console.log("0 DB Matches. Fallback to Gemini External API...");

      const fallbackRole = role.trim() || "Software Engineer";
      const fallbackLocation = location.trim() || "Bengaluru";

      const externalJobs = await fetchExternalJobs(fallbackRole, fallbackLocation);

      return res.status(200).json({
        success: true,
        count: externalJobs ? externalJobs.length : 0,
        jobs: externalJobs || [],
      });
    }

    // Skill Match Score Calculation
    let resumeSkills = [];
    if (skills && skills.trim() !== "") {
      resumeSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const result = jobs.map((job) => {
      const match = calculateJobMatch ? calculateJobMatch(resumeSkills, job.skills || []) : 0;
      const matchingSkills = getMatchingSkills ? getMatchingSkills(resumeSkills, job.skills || []) : [];

      return {
        _id: job._id,
        id: job._id,
        title: job.title || "Untitled Job",
        company: job.company || "Unknown Company",
        location: job.location || "Not Disclosed",
        type: job.type || "Full Time",
        experience: job.experience || "Not Disclosed",
        salary: job.salary || "Not Disclosed",
        skills: Array.isArray(job.skills) ? job.skills : [],
        description: job.description || "",
        applyUrl: job.applyUrl || "",
        companyUrl: job.companyUrl || "",
        recruiterEmail: job.recruiterEmail || "",
        recruiterPhone: job.recruiterPhone || "",
        match: Number(match) || 0,
        matchingSkills: Array.isArray(matchingSkills) ? matchingSkills : [],
      };
    });

    result.sort((a, b) => b.match - a.match);

    return res.status(200).json({
      success: true,
      count: result.length,
      jobs: result,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
});

// ========================================
// 3. APPLY TO JOB & NOTIFY RECRUITER
// POST /api/jobs/apply
// ========================================
router.post("/apply", async (req, res) => {
  try {
    const { jobId, name, email, phone, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Recruiter Details Dispatch (Email Trigger)
    if (job.recruiterEmail && sendEmail) {
      await sendEmail({
        to: job.recruiterEmail,
        subject: `New Candidate Application: ${job.title} - ${name}`,
        html: `
          <h2>New Job Application Received</h2>
          <p><strong>Applied Position:</strong> ${job.title}</p>
          <p><strong>Candidate Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
          <p><strong>Resume URL:</strong> <a href="${resumeUrl}">${resumeUrl}</a></p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application sent successfully! Recruiter notified.",
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process application",
      error: error.message,
    });
  }
});

// ========================================
// 4. GET SINGLE JOB
// GET /api/jobs/:id
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Get Job Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch job" });
  }
});

module.exports = router;