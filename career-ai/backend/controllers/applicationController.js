const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const {
  sendRecruiterApplicationEmail,
  sendCandidateConfirmationEmail,
} = require("../services/emailService");

// =====================================================
// APPLY FOR JOB (Supports DB & External API Jobs)
// POST /api/applications/apply
// =====================================================
const applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      matchScore,
      jobTitle,
      company,
    } = req.body;

    // 1. Validate required fields
    if (!jobId || !applicantName || !applicantEmail || !applicantPhone) {
      return res.status(400).json({
        success: false,
        message: "Job ID, name, email and phone number are required.",
      });
    }

    // 2. Validate Resume Upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    let job = null;
    let recruiterEmail = req.body.recruiterEmail || "hr@company.com";

    // 3. Check if Job ID belongs to MongoDB or External API
    if (mongoose.Types.ObjectId.isValid(jobId)) {
      job = await Job.findById(jobId);
      if (job) {
        recruiterEmail = job.recruiterEmail || job.email || job.companyEmail || recruiterEmail;
      }
    }

    // 4. Handle Resume details from Multer Buffer or File Path
    const resumeName = req.file.originalname;
    const resumePath = req.file.path || req.file.location || `buffer-${Date.now()}-${resumeName}`;

    const formattedEmail = applicantEmail.trim().toLowerCase();

    // 5. Check Duplicate Application
    const existingApplication = await Application.findOne({
      jobId: String(jobId),
      applicantEmail: formattedEmail,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // 6. Save Application to MongoDB
    const application = await Application.create({
      jobId: String(jobId),
      jobTitle: job ? job.title : jobTitle || "Software Position",
      company: job ? job.company : company || "Tech Company",
      applicantName: applicantName.trim(),
      applicantEmail: formattedEmail,
      applicantPhone: applicantPhone.trim(),
      resumeName,
      resumePath,
      coverLetter: coverLetter || "",
      matchScore: Number(matchScore) || 0,
      status: "Applied",
      recruiterEmail: recruiterEmail.trim().toLowerCase(),
      recruiterEmailSent: false,
      candidateEmailSent: false,
    });

    // 7. Send Recruiter Email Notification
    let recruiterEmailSent = false;
    try {
      await sendRecruiterApplicationEmail({
        recruiterEmail,
        applicantName,
        applicantEmail,
        applicantPhone,
        resumeName,
        resumeBuffer: req.file.buffer, // For memoryStorage attachments
        coverLetter,
        job: job || { title: jobTitle || "Software Role", company: company || "Tech Firm" },
      });
      recruiterEmailSent = true;
    } catch (emailError) {
      console.error("Recruiter Email Error:", emailError.message);
    }

    // 8. Send Candidate Confirmation Email
    let candidateEmailSent = false;
    try {
      await sendCandidateConfirmationEmail({
        candidateEmail: applicantEmail,
        applicantName,
        job: job || { title: jobTitle || "Software Role", company: company || "Tech Firm" },
      });
      candidateEmailSent = true;
    } catch (emailError) {
      console.error("Candidate Email Error:", emailError.message);
    }

    // Update Status Flags
    application.recruiterEmailSent = recruiterEmailSent;
    application.candidateEmailSent = candidateEmailSent;
    await application.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application: {
        id: application._id,
        jobId: application.jobId,
        applicantName: application.applicantName,
        applicantEmail: application.applicantEmail,
        status: application.status,
        recruiterEmailSent,
        candidateEmailSent,
      },
    });
  } catch (error) {
    console.error("Apply For Job Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit application.",
      error: error.message,
    });
  }
};

// =====================================================
// GET APPLICATION BY ID
// =====================================================
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Get Application Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get application.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL APPLICATIONS
// =====================================================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get applications.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update application status.",
      error: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
};