const {
  generateLearningRoadmap,
} = require("../services/roadmapService");

const generateRoadmap = async (req, res) => {
  try {
    console.log("=================================");
    console.log("AI LEARNING ROADMAP REQUEST");
    console.log("=================================");

    const {
      field,
      duration,
      level,
      dailyTime,
      learningMode,
    } = req.body;

    console.log("Field:", field);
    console.log("Duration:", duration);
    console.log("Level:", level);
    console.log("Daily Time:", dailyTime);
    console.log("Learning Mode:", learningMode);

    // Validate field
    if (!field || !field.trim()) {
      return res.status(400).json({
        success: false,
        message: "Learning field is required",
      });
    }

    // Generate roadmap using AI
    const roadmap = await generateLearningRoadmap({
      field,
      duration,
      level,
      dailyTime,
      learningMode,
    });

    return res.status(200).json({
      success: true,
      message: "Learning roadmap generated successfully",
      roadmap,
    });

  } catch (error) {
    console.error("Roadmap Controller Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to generate learning roadmap",
    });
  }
};

module.exports = {
  generateRoadmap,
};