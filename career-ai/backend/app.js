// backend/app.js

const express = require("express");
const cors = require("cors");

// ============================================
// ROUTES
// ============================================

const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const systemDesignRoutes = require("./routes/systemDesignRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// ============================================
// INITIALIZE EXPRESS
// ============================================

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ============================================
// API ROUTES
// ============================================

// Resume Analyzer
app.use(
  "/api/resume",
  resumeRoutes
);

// AI Mock Interview
app.use(
  "/api/interview",
  interviewRoutes
);

// DSA Coach
app.use(
  "/api/dsa",
  dsaRoutes
);

// Roadmap
app.use(
  "/api/roadmap",
  roadmapRoutes
);

// System Design
app.use(
  "/api/system-design",
  systemDesignRoutes
);

// Job Search
app.use(
  "/api/jobs",
  jobRoutes
);

// ============================================
// JOB APPLICATION
// ============================================

app.use(
  "/api/applications",
  applicationRoutes
);

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Career AI Backend API is running successfully",
  });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// ============================================
// EXPORT
// ============================================

module.exports = app;