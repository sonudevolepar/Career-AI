
const express = require("express");

const {
  applyForJob,
  getApplicationById,
  getAllApplications,
  updateApplicationStatus,
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
  applyForJob
);

// ============================================
// GET ALL APPLICATIONS
// GET /api/applications
// ============================================

router.get(
  "/",
  getAllApplications
);

// ============================================
// GET APPLICATION BY ID
// GET /api/applications/:id
// ============================================

router.get(
  "/:id",
  getApplicationById
);

// ============================================
// UPDATE APPLICATION STATUS
// PATCH /api/applications/:id/status
// ============================================

router.patch(
  "/:id/status",
  updateApplicationStatus
);

module.exports = router;

