
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ======================================================
// ROUTES IMPORT
// ======================================================

const authRoutes = require("./routes/authRoutes");
const aiAssistantRoutes = require("./routes/aiAssistantRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const systemDesignRoutes = require("./routes/systemDesignRoutes");

// ======================================================
// ROUTES REGISTRATION
// ======================================================

// Authentication
app.use("/api/auth", authRoutes);

// AI Assistant
app.use("/api/ai-assistant", aiAssistantRoutes);

// Razorpay Payment
app.use("/api/payment", paymentRoutes);

// Resume Analyzer
app.use("/api/resume", resumeRoutes);

// AI Mock Interview
app.use("/api/interview", interviewRoutes);

// AI Learning Roadmap
app.use("/api/roadmap", roadmapRoutes);

// AI System Design Coach
app.use("/api/system-design", systemDesignRoutes);

// ======================================================
// ROOT ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career AI Backend is running 🚀",
  });
});

// ======================================================
// 404 ROUTE
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : "Something went wrong",
  });
});

// ======================================================
// SERVER START + MONGODB
// ======================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, "127.0.0.1", () => {
      console.log(
        `Career AI Backend running on http://127.0.0.1:${PORT}`
      );
    });
  } catch (error) {
    console.error("Backend startup error:", error.message);
    process.exit(1);
  }
}

startServer();
