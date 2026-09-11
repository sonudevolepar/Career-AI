const express = require("express");
const router = express.Router();

const multer = require("multer");
const nodemailer = require("nodemailer");

const Job = require("../models/Job");
const Application = require("../models/Application");

const {
  fetchExternalJobs,
} = require("../services/externalJobService");


/* =====================================================
   MULTER
===================================================== */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const safeName =
      file.originalname.replace(
        /[^a-zA-Z0-9.-]/g,
        "_"
      );

    cb(
      null,
      `${Date.now()}-${safeName}`
    );
  },
});


const upload = multer({

  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF resume is allowed"
        ),
        false
      );
    }
  },
});


/* =====================================================
   SEARCH JOBS
===================================================== */

router.get(
  "/search",
  async (req, res) => {

    try {

      const {
        role = "",
        location = "",
        experience = "",
        jobType = "",
        workMode = "",
      } = req.query;


      console.log(
        "Job Search:",
        {
          role,
          location,
          experience,
          jobType,
          workMode,
        }
      );


      /* ================================================
         MONGODB SEARCH
      ================================================ */

      const query = {};


      if (
        role &&
        role !== "All IT Jobs"
      ) {

        query.title = {
          $regex: role,
          $options: "i",
        };
      }


      if (
        location &&
        location !== "All India"
      ) {

        query.location = {
          $regex: location,
          $options: "i",
        };
      }


      /*
        Don't make experience filter too strict.
        Fresher jobs often don't have exact
        "Fresher" value in MongoDB.
      */

      if (
        experience &&
        experience !== "Fresher"
      ) {

        query.experience = {
          $regex: experience,
          $options: "i",
        };
      }


      /*
        Only apply type filter when explicitly selected.
      */

      if (
        jobType &&
        jobType !== "Internship"
      ) {

        query.type = {
          $regex: jobType,
          $options: "i",
        };
      }


      let mongoJobs =
        await Job.find(query)
          .sort({
            createdAt: -1,
          })
          .limit(50);


      /* ================================================
         EXTERNAL ADZUNA JOBS
      ================================================ */

      const externalJobs =
        await fetchExternalJobs({

          role:
            role === "All IT Jobs"
              ? "IT jobs"
              : role,

          location:
            location === "All India"
              ? ""
              : location,

          experience,

          jobType,

          workMode,
        });


      /* ================================================
         FORMAT MONGODB JOBS
      ================================================ */

      const formattedMongoJobs =
        mongoJobs.map((job) => ({

          ...job.toObject(),

          id:
            job._id.toString(),

          source:
            "mongodb",

          provider:
            "Career-AI",

          isExternal:
            false,

          applyUrl:
            null,

          match:
            job.matchScore ||
            80,
        }));


      /* ================================================
         COMBINE
      ================================================ */

      const allJobs = [
        ...formattedMongoJobs,
        ...externalJobs,
      ];


      /* ================================================
         REMOVE DUPLICATES
      ================================================ */

      const uniqueJobs = [];

      const seen = new Set();


      for (
        const job of allJobs
      ) {

        const key =
          `${job.title}-${job.company}-${job.location}`
            .toLowerCase()
            .trim();


        if (!seen.has(key)) {

          seen.add(key);

          uniqueJobs.push(job);
        }
      }


      /* ================================================
         RESPONSE
      ================================================ */

      return res.status(200).json({

        success:
          true,

        count:
          uniqueJobs.length,

        jobs:
          uniqueJobs,
      });


    } catch (error) {

      console.error(
        "Job Search Error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Failed to search jobs",

        error:
          error.message,
      });
    }
  }
);


/* =====================================================
   APPLY INTERNAL CAREER-AI JOB
===================================================== */

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


      if (!jobId) {

        return res.status(400).json({

          success: false,

          message:
            "Job ID is required",
        });
      }


      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Resume PDF is required",
        });
      }


      /* ================================================
         INTERNAL JOB ONLY
      ================================================ */

      const job =
        await Job.findById(jobId);


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Internal job not found",
        });
      }


      /* ================================================
         CREATE APPLICATION
      ================================================ */

      const application =
        await Application.create({

          job:
            job._id,

          jobTitle:
            job.title,

          company:
            job.company,

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


      /* ================================================
         EMAIL
      ================================================ */

      if (
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        job.recruiterEmail
      ) {

        const transporter =
          nodemailer.createTransport({

            service:
              "gmail",

            auth: {

              user:
                process.env.EMAIL_USER,

              pass:
                process.env.EMAIL_PASS,
            },
          });


        /* HR EMAIL */

        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to:
            job.recruiterEmail,

          subject:
            `New Application - ${job.title}`,

          text: `
Candidate: ${applicantName}
Email: ${applicantEmail}
Phone: ${applicantPhone}

Cover Letter:
${coverLetter || ""}
`,

          attachments: [
            {

              filename:
                req.file.originalname,

              path:
                req.file.path,
            },
          ],
        });


        /* CANDIDATE EMAIL */

        await transporter.sendMail({

          from:
            process.env.EMAIL_USER,

          to:
            applicantEmail,

          subject:
            "Application Received",

          text: `
Your application for ${job.title}
at ${job.company}
has been submitted successfully.
`,
        });
      }


      return res.status(201).json({

        success:
          true,

        message:
          "Application submitted successfully",

        application,
      });


    } catch (error) {

      console.error(
        "Application Error:",
        error
      );


      return res.status(500).json({

        success:
          false,

        message:
          "Application failed",

        error:
          error.message,
      });
    }
  }
);


module.exports = router;