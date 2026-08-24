const express = require("express");

const router = express.Router();

const {
  getInterviewFeedback,
} = require("../controllers/interviewController");

router.post("/feedback", getInterviewFeedback);

module.exports = router;