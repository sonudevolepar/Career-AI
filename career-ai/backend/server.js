const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

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

// ===============================
// DATABASE
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// ===============================
// ROUTES
// ===============================

const authRoutes = require("./routes/authRoutes");
const aiAssistantRoutes = require("./routes/aiAssistantRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Career AI Backend is running 🚀",
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Career AI Backend running on http://127.0.0.1:${PORT}`
  );
});