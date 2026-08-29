// backend/app.js

const express = require("express");
const cors = require("cors");

// Routes
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const systemDesignRoutes = require("./routes/systemDesignRoutes");

// Initialize Express
const app = express();

// ================================================
// MIDDLEWARE
// ================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================================
// API ROUTES
// ================================================

// Resume Analyzer
app.use("/api/resume", resumeRoutes);

// AI Mock Interview
app.use("/api/interview", interviewRoutes);

// DSA Coach
app.use("/api/dsa", dsaRoutes);


//roadmapRoutes
app.use("/api/roadmap", roadmapRoutes);

//systemDesign
app.use("/api/system-design", systemDesignRoutes);
// ================================================
// HEALTH CHECK
// ================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career AI Backend API is running successfully",
  });
});

// ================================================
// EXPORT
// ================================================

module.exports = app;