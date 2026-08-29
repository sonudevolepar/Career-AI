// ======================================================
// SYSTEM DESIGN ROUTES
// ======================================================

const express = require("express");

const {
  generateSystemDesignController,
} = require("../controllers/systemDesignController");

const router = express.Router();

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

router.post(
  "/generate",
  generateSystemDesignController
);

module.exports = router;