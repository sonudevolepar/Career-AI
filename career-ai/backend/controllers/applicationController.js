
const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");

const {
  sendRecruiterApplicationEmail,
  sendCandidateConfirmationEmail,
} = require("../services/emailService");

// =====================================================
// APPLY FOR JOB
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
    } = req.body;

    // Validate required fields
    if (
      !jobId ||
      !applicantName ||
      !applicantEmail ||
      !applicantPhone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Job ID, name, email and phone number are required.",
      });
    }

    // Validate Job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID.",
      });
    }

    // Find Job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // Resume required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    // Get recruiter email
    const recruiterEmail =
      job.recruiterEmail ||
      job.email ||
      job.companyEmail;

    if (!recruiterEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Recruiter email is not available for this job.",
      });
    }

    // Resume information
    const resumeName = req.file.originalname;

    const resumePath =
      req.file.path ||
      req.file.location ||
      req.file.filename;

    // Check duplicate application
    const existingApplication =
      await Application.findOne({
        job: jobId,
        applicantEmail: applicantEmail
          .trim()
          .toLowerCase(),
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You have already applied for this job.",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,

      applicantName: applicantName.trim(),

      applicantEmail: applicantEmail
        .trim()
        .toLowerCase(),

      applicantPhone: applicantPhone.trim(),

      resumeName,

      resumePath,

      coverLetter: coverLetter || "",

      matchScore: Number(matchScore) || 0,

      status: "Applied",

      recruiterEmail: recruiterEmail
        .trim()
        .toLowerCase(),

      recruiterEmailSent: false,

      candidateEmailSent: false,
    });

    // Send recruiter email
    let recruiterEmailSent = false;

    try {
      await sendRecruiterApplicationEmail({
        recruiterEmail,
        applicantName,
        applicantEmail,
        applicantPhone,
        resumeName,
        resumePath,
        coverLetter,
        job,
      });

      recruiterEmailSent = true;
    } catch (emailError) {
      console.error(
        "Recruiter email error:",
        emailError.message
      );
    }

    // Send candidate confirmation
    let candidateEmailSent = false;

    try {
      await sendCandidateConfirmationEmail({
        candidateEmail: applicantEmail,
        applicantName,
        job,
      });

      candidateEmailSent = true;
    } catch (emailError) {
      console.error(
        "Candidate email error:",
        emailError.message
      );
    }

    // Update email status
    application.recruiterEmailSent =
      recruiterEmailSent;

    application.candidateEmailSent =
      candidateEmailSent;

    await application.save();

    // Success response
    return res.status(201).json({
      success: true,
      message:
        "Application submitted successfully.",

      application: {
        id: application._id,
        jobId: application.job,
        applicantName:
          application.applicantName,
        applicantEmail:
          application.applicantEmail,
        status: application.status,
        recruiterEmailSent,
        candidateEmailSent,
      },
    });
  } catch (error) {
    console.error(
      "Apply For Job Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to submit application.",
      error: error.message,
    });
  }
};

// =====================================================
// GET APPLICATION BY ID
// GET /api/applications/:id
// =====================================================

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application ID.",
      });
    }

    const application =
      await Application.findById(id).populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Get Application Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get application.",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL APPLICATIONS
// GET /api/applications
// =====================================================

const getAllApplications = async (req, res) => {
  try {
    const applications =
      await Application.find()
        .populate("job")
        .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Applications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get applications.",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE APPLICATION STATUS
// PATCH /api/applications/:id/status
// =====================================================

const updateApplicationStatus = async (
  req,
  res
) => {
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
        message:
          "Invalid application status.",
      });
    }

    const application =
      await Application.findByIdAndUpdate(
        id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Update Application Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update application status.",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  applyForJob,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
};
