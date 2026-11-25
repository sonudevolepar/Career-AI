
const {
  generateSystemDesign,
} = require("../services/systemDesignService");

// ======================================================
// GENERATE SYSTEM DESIGN CONTROLLER
// ======================================================

const generateSystemDesignController = async (req, res) => {
  try {
    console.log(
      "System Design request body:",
      JSON.stringify(req.body || {})
    );

    const body = req.body || {};

    const problem =
      body.problem ||
      body.topic ||
      body.systemName ||
      body.description ||
      body.prompt ||
      "";

    // Validate input
    if (
      typeof problem !== "string" ||
      !problem.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a system design problem.",
      });
    }

    // Validate difficulty
    const allowedDifficulties = [
      "Beginner",
      "Intermediate",
      "Advanced",
    ];

    const difficulty = allowedDifficulties.includes(
      body.difficulty
    )
      ? body.difficulty
      : "Intermediate";

    // Generate system design using service
    const result = await generateSystemDesign({
      ...body,
      problem: problem.trim(),
      topic: problem.trim(),
      difficulty,
    });

    console.log(
      "System Design generated successfully:",
      result.model
    );

    return res.status(200).json({
      success: true,
      message: "System design generated successfully.",
      data: result,
    });

  } catch (error) {
    console.error(
      "System Design Controller Error:",
      {
        message: error.message,
        status: error.status,
        code: error.code,
      }
    );

    const status = Number(
      error.status || error.statusCode || 500
    );

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

    const responseStatus = allowedStatuses.includes(status)
      ? status
      : 500;

    let message = error.message || "Something went wrong.";

    if (responseStatus === 429) {
      message =
        "Gemini API rate limit reached. Please try again later.";
    } else if (responseStatus === 503) {
      message =
        "Gemini AI is temporarily unavailable. Please try again later.";
    } else if (responseStatus === 502) {
      message =
        error.message || "Gemini API returned an invalid response.";
    }

    return res.status(responseStatus).json({
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
