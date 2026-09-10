const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");

const Job = require("../models/Job");
const Application = require("../models/Application");

const {
  fetchExternalJobs,
} = require("../services/externalJobService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// ========================================
// SEARCH JOBS
// ========================================

router.get("/search", async (req, res) => {
  try {
    const {
      role,
      location,
      experience,
      jobType,
    } = req.query;

    const query = {};

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
      query.experience = {
        $regex: experience,
        $options: "i",
      };
    }

    if (jobType) {
      query.type = {
        $regex: jobType,
        $options: "i",
      };
    }

    const mongoJobs =
      await Job.find(query);

    const externalJobs =
      await fetchExternalJobs({
        role,
        location,
      });

    const jobs = [
      ...mongoJobs.map((job) => ({
        ...job.toObject(),
        source: "mongodb",
        provider: "MongoDB",
        isExternal: false,
      })),
      ...externalJobs,
    ];

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to search jobs",
    });
  }
});

// ========================================
// APPLY JOB
// ========================================

router.post(
  "/apply",
  upload.single("resume"),
  async (req, res) => {
    try {
      const {
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone,
        coverLetter,
        matchScore,
      } = req.body;

      const job =
        await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({
          success: false,
          message:
            "Job not found",
        });
      }

      const application =
        await Application.create({
          job: job._id,

          jobTitle: job.title,

          company: job.company,

          applicantName,

          applicantEmail,

          applicantPhone,

          resumeName:
            req.file.originalname,

          resumePath:
            req.file.path,

          coverLetter,

          recruiterEmail:
            job.recruiterEmail,

          matchScore:
            Number(matchScore) || 0,
        });

      const transporter =
        nodemailer.createTransport({
          service: "gmail",

          auth: {
            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,
          },
        });

      // HR EMAIL

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: job.recruiterEmail,

        subject: `New Application - ${job.title}`,

        text: `
Candidate: ${applicantName}
Email: ${applicantEmail}
Phone: ${applicantPhone}
`,

        attachments: [
          {
            filename:
              req.file.originalname,

            path: req.file.path,
          },
        ],
      });

      // CANDIDATE EMAIL

      await transporter.sendMail({
        from:
          process.env.EMAIL_USER,

        to: applicantEmail,

        subject:
          "Application Received",

        text: `
Your application for ${job.title}
has been submitted successfully.
`,
      });

      return res.status(201).json({
        success: true,

        message:
          "Application submitted successfully",

        application,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          "Application failed",
      });
    }
  }
);

module.exports = router;