
const express = require("express");

const {
  generateSystemDesignController,
} = require("../controllers/systemDesignController");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "System Design API is running.",
  });
});

// Generate system design
router.post("/generate", (req, res, next) => {
  console.log(
    "System Design request body:",
    JSON.stringify(req.body || {})
  );

  return generateSystemDesignController(req, res, next);
});

module.exports = router;
