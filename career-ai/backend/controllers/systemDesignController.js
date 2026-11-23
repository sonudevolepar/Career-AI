
const {
  generateSystemDesign,
} = require("../services/systemDesignService");

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

const generateSystemDesignController = async (req, res) => {
  try {
    const {
      problem,
      difficulty = "Beginner",
    } = req.body || {};

    // Validation
    if (
      typeof problem !== "string" ||
      !problem.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "System design problem is required.",
      });
    }

    console.log("System Design request:", {
      problem: problem.trim(),
      difficulty,
    });

    // Generate system design
    const systemDesign = await generateSystemDesign({
      problem: problem.trim(),
      difficulty,
    });

    // Success response
    return res.status(200).json({
      success: true,
      message: "System design generated successfully.",
      data: systemDesign,
    });

  } catch (error) {
    console.error("System Design Controller Error:", {
      message: error.message,
      status: error.status,
      code: error.code,
    });

    // Preserve actual error status
    const allowedStatuses = [
      400,
      401,
      403,
      408,
      429,
      500,
      502,
      503,
      504,
    ];

    const status = allowedStatuses.includes(error.status)
      ? error.status
      : 500;

    let message = error.message ||
      "Failed to generate system design.";

    if (status === 503) {
      message =
        "Gemini AI is temporarily unavailable. Please try again later.";
    }

    if (status === 429) {
      message =
        "Gemini API rate limit reached. Please try again later.";
    }

    if (status === 502) {
      message =
        "Gemini API authentication or upstream error. Check backend configuration.";
    }

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateSystemDesignController,
};
