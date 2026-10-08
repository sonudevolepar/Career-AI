const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });

// =====================================================
// ROUTES IMPORT
// =====================================================

const authRoutes = require("./routes/authRoutes");

const aiAssistantRoutes = require(
  "./routes/aiAssistantRoutes"
);

const paymentRoutes = require(
  "./routes/paymentRoutes"
);

const resumeRoutes = require(
  "./routes/resumeRoutes"
);

const interviewRoutes = require(
  "./routes/interviewRoutes"
);

const roadmapRoutes = require(
  "./routes/roadmapRoutes"
);

// =====================================================
// ROUTES REGISTRATION
// =====================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// AI Assistant
app.use(
  "/api/ai-assistant",
  aiAssistantRoutes
);

// Razorpay Payment
app.use(
  "/api/payment",
  paymentRoutes
);

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

// AI Learning Roadmap
app.use(
  "/api/roadmap",
  roadmapRoutes
);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career AI Backend is running 🚀",
  });
});

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    "Server Error:",
    err.stack
  );

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// =====================================================
// SERVER START
// =====================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  "127.0.0.1",
  () => {
    console.log(
      `Career AI Backend running on http://127.0.0.1:${PORT}`
    );
  }
);