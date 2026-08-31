const fs = require("fs");

const Job = require("../models/Job");
const Application = require("../models/Application");

const {
  sendRecruiterApplicationEmail,
  sendCandidateConfirmationEmail,
} = require("../services/emailService");

// ============================================
// SUBMIT APPLICATION
// POST /api/applications/apply
// ============================================

const submitApplication = async (req, res) => {
  let uploadedResumePath = null;

  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter = "",
      matchScore = 0,
    } = req.body;

    uploadedResumePath = req.file
      ? req.file.path
      : null;

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required.",
      });
    }

    if (!applicantName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Applicant name is required.",
      });
    }

    if (!applicantEmail?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Applicant email is required.",
      });
    }

    if (!applicantPhone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Applicant phone is required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    // -----------------------------
    // FIND JOB
    // -----------------------------

    const job = await Job.findById(jobId);

    if (!job) {
      if (
        uploadedResumePath &&
        fs.existsSync(uploadedResumePath)
      ) {
        fs.unlinkSync(uploadedResumePath);
      }

      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    // -----------------------------
    // CHECK RECRUITER EMAIL
    // -----------------------------

    if (!job.recruiterEmail) {
      if (
        uploadedResumePath &&
        fs.existsSync(uploadedResumePath)
      ) {
        fs.unlinkSync(uploadedResumePath);
      }

      return res.status(400).json({
        success: false,
        message:
          "Recruiter email is not configured for this job.",
      });
    }

    // -----------------------------
    // SAVE APPLICATION
    // -----------------------------

    const application =
      await Application.create({
        job: job._id,

        applicantName:
          applicantName.trim(),

        applicantEmail:
          applicantEmail.trim().toLowerCase(),

        applicantPhone:
          applicantPhone.trim(),

        resumeName:
          req.file.originalname,

        resumePath:
          uploadedResumePath,

        coverLetter:
          coverLetter.trim(),

        matchScore:
          Number(matchScore) || 0,

        recruiterEmail:
          job.recruiterEmail,
      });

    // -----------------------------
    // SEND RECRUITER EMAIL
    // -----------------------------

    let recruiterEmailSent = false;

    try {
      await sendRecruiterApplicationEmail({
        recruiterEmail:
          job.recruiterEmail,

        applicantName:
          application.applicantName,

        applicantEmail:
          application.applicantEmail,

        applicantPhone:
          application.applicantPhone,

        jobTitle:
          job.title,

        company:
          job.company,

        location:
          job.location,

        coverLetter:
          application.coverLetter,

        resumePath:
          uploadedResumePath,
      });

      recruiterEmailSent = true;

      console.log(
        "Recruiter email sent successfully."
      );
    } catch (emailError) {
      console.error(
        "Recruiter email failed:",
        emailError.message
      );
    }

    // -----------------------------
    // SEND CANDIDATE EMAIL
    // -----------------------------

    let candidateEmailSent = false;

    try {
      await sendCandidateConfirmationEmail({
        applicantEmail:
          application.applicantEmail,

        applicantName:
          application.applicantName,

        jobTitle:
          job.title,

        company:
          job.company,

        location:
          job.location,
      });

      candidateEmailSent = true;

      console.log(
        "Candidate confirmation email sent successfully."
      );
    } catch (emailError) {
      console.error(
        "Candidate email failed:",
        emailError.message
      );
    }

    // -----------------------------
    // UPDATE EMAIL STATUS
    // -----------------------------

    application.recruiterEmailSent =
      recruiterEmailSent;

    application.candidateEmailSent =
      candidateEmailSent;

    await application.save();

    // -----------------------------
    // RESPONSE
    // -----------------------------

    return res.status(201).json({
      success: true,

      message: recruiterEmailSent
        ? "Application submitted successfully and resume sent to recruiter."
        : "Application saved, but recruiter email could not be sent. Check email configuration.",

      application: {
        id: application._id,

        jobId: job._id,

        jobTitle:
          job.title,

        company:
          job.company,

        location:
          job.location,

        resumeName:
          application.resumeName,

        status:
          application.status,

        recruiterEmailSent,

        candidateEmailSent,

        appliedAt:
          application.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Submit Application Error:",
      error
    );

    // Delete uploaded resume if something failed
    if (
      uploadedResumePath &&
      fs.existsSync(uploadedResumePath)
    ) {
      try {
        fs.unlinkSync(uploadedResumePath);
      } catch (cleanupError) {
        console.error(
          "Resume cleanup failed:",
          cleanupError.message
        );
      }
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to submit application.",
    });
  }
};

// ============================================
// GET MY APPLICATIONS
// GET /api/applications/my?email=...
// ============================================

const getMyApplications = async (req, res) => {
  try {
    const email =
      req.query.email
        ?.trim()
        .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const applications =
      await Application.find({
        applicantEmail: email,
      })
        .populate(
          "job",
          "title company location type experience salary"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        applications.length,

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
      error:
        error.message,
    });
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
};