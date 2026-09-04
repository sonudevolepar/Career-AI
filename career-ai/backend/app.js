// backend/app.js

const express = require("express");
const cors = require("cors");

// ============================================
// ROUTES IMPORT
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
// MIDDLEWARE CONFIGURATION
// ============================================

// Flexible CORS Configuration for Local & Network Access
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Local Dev Flexibility
      }
    },
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
// API ROUTES MOUNTING
// ============================================

// Resume Analyzer
app.use("/api/resume", resumeRoutes);

// AI Mock Interview
app.use("/api/interview", interviewRoutes);

// DSA Coach
app.use("/api/dsa", dsaRoutes);

// Roadmap
app.use("/api/roadmap", roadmapRoutes);

// System Design
app.use("/api/system-design", systemDesignRoutes);

// Job Search
app.use("/api/jobs", jobRoutes);

// Job Application & Resume Upload
app.use("/api/applications", applicationRoutes);

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career AI Backend API is running successfully",
  });
});

// ============================================
// 404 NOT FOUND HANDLER
// ============================================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found: ${req.originalUrl}`,
  });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  console.error("Global Error Logged:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ============================================
// EXPORT APP MODULE
// ============================================

module.exports = app;