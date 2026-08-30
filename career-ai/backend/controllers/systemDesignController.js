// ======================================================
// SYSTEM DESIGN CONTROLLER
// ======================================================

const {
  generateSystemDesign,
} = require("../services/systemDesignService");

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

const generateSystemDesignController = async (
  req,
  res
) => {
  try {
    const {
      problem,
      difficulty,
    } = req.body;

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (
      !problem ||
      typeof problem !== "string" ||
      !problem.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "System design problem is required",
      });
    }

    // ----------------------------------------------
    // GENERATE
    // ----------------------------------------------

    const systemDesign =
      await generateSystemDesign(
        problem.trim(),
        difficulty || "Beginner"
      );

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "System design generated successfully",

      data: systemDesign,
    });

  } catch (error) {
    console.error(
      "Generate System Design Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to generate system design",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateSystemDesignController,
};