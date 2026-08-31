const express = require("express");

const {
  submitApplication,
  getMyApplications,
} = require("../controllers/applicationController");

const uploadResume = require("../middleware/resumeUpload");

const router = express.Router();

// ============================================
// APPLY FOR JOB
// POST /api/applications/apply
// ============================================

router.post(
  "/apply",
  uploadResume.single("resume"),
  submitApplication
);

// ============================================
// GET MY APPLICATIONS
// GET /api/applications/my?email=example@gmail.com
// ============================================

router.get(
  "/my",
  getMyApplications
);

module.exports = router;