const express = require("express");

const router = express.Router();

const {
  getInterviewQuestions,
  getInterviewFeedback,
} = require("../controllers/interviewController");

// ======================================================
// GENERATE ROLE-BASED INTERVIEW QUESTIONS
// ======================================================

router.post(
  "/questions",
  getInterviewQuestions
);

// ======================================================
// GENERATE AI INTERVIEW FEEDBACK
// ======================================================

router.post(
  "/feedback",
  getInterviewFeedback
);

module.exports = router;