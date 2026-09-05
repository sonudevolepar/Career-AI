// backend/controllers/jobController.js
const Job = require("../models/Job");
const { fetchExternalJobs } = require("../services/externalJobService");
const {
  calculateJobMatch,
  getMatchingSkills,
} = require("../services/jobMatchingService");

// Email Service Import (Safety try-catch ke saath)
let sendEmail;
try {
  sendEmail = require("../services/emailService").sendEmail;
} catch (err) {
  sendEmail = null;
}

// ========================================
// 1. SEARCH JOBS (WITH FLEXIBLE REGEX FILTERS)
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

    // Role Filter (Case-insensitive Regex)
    if (role && role.trim() !== "") {
      query.title = { $regex: role.trim(), $options: "i" };
    }

    // Location Filter (Case-insensitive Regex)
    if (location && location.trim() !== "") {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    // Experience Filter (FIXED: Ab ye '0-1 Years' exact search ki jagah Regex search karega)
    if (experience && experience.trim() !== "" && experience !== "Fresher") {
      // Numbers ko extract karke flexible pattern banaya
      const expNumber = experience.replace(/[^0-9-]/g, ""); 
      query.experience = { $regex: expNumber || experience.trim(), $options: "i" };
    }

    // Job Type Filter
    if (jobType && jobType.trim() !== "") {
      query.type = { $regex: jobType.trim(), $options: "i" };
    }

    console.log("Executing Search Query:", query);

    // MongoDB DB Query
    let jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50);

    // FALLBACK: Agar DB Filters Mismatch ki wajah se 0 jobs mili, tab Gemini Live Jobs chalega
    if (!jobs || jobs.length === 0) {
      console.log("No MongoDB matches found. Triggering Gemini Live Jobs fallback...");
      
      const fallbackRole = role.trim() || "Software Engineer";
      const fallbackLocation = location.trim() || "Bengaluru";

      const externalJobs = await fetchExternalJobs(fallbackRole, fallbackLocation);

      return res.status(200).json({
        success: true,
        count: externalJobs ? externalJobs.length : 0,
        jobs: externalJobs || [],
      });
    }

    // Skills Match Calculation
    let resumeSkills = [];
    if (skills && skills.trim() !== "") {
      resumeSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const result = jobs.map((job) => {
      const match = calculateJobMatch(resumeSkills, job.skills || []);
      const matchingSkills = getMatchingSkills(resumeSkills, job.skills || []);

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
    console.error("Job Search API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search jobs",
      error: error.message,
    });
  }
};

// ========================================
// 2. APPLY TO JOB & NOTIFY RECRUITER
// POST /api/jobs/apply
// ========================================
const applyToJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Candidate details recruiter ke email par bhejna
    if (job.recruiterEmail && sendEmail) {
      await sendEmail({
        to: job.recruiterEmail,
        subject: `New Application for ${job.title} - ${name}`,
        html: `
          <h2>New Applicant Submitted Resume</h2>
          <p><strong>Job Title:</strong> ${job.title}</p>
          <p><strong>Applicant Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not Provided"}</p>
          <p><strong>Resume Link:</strong> <a href="${resumeUrl}">${resumeUrl}</a></p>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application submitted! Recruiter has been notified.",
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send application to recruiter",
      error: error.message,
    });
  }
};

// ========================================
// 3. GET SINGLE & ALL JOBS
// ========================================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get job" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    let jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
    if (!jobs || jobs.length === 0) {
      jobs = await fetchExternalJobs("Software Engineer", "India");
    }
    return res.status(200).json({ success: true, count: jobs ? jobs.length : 0, jobs: jobs || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to get jobs" });
  }
};

module.exports = {
  searchJobs,
  applyToJob,
  getJobById,
  getAllJobs,
};