const { generateInterviewFeedback } = require("../services/aiService");

const getInterviewFeedback = async (req, res) => {
  try {
    console.log("=================================");
    console.log("Interview Feedback Request Received");
    console.log("=================================");

    const { role, questions, answers } = req.body;

    console.log("Role:", role);
    console.log("Questions:", questions);
    console.log("Answers:", answers);

    // -----------------------------
    // Validate Role
    // -----------------------------
    if (!role || typeof role !== "string") {
      return res.status(400).json({
        success: false,
        error: "Target role is required.",
      });
    }

    // -----------------------------
    // Validate Questions
    // -----------------------------
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Interview questions are required.",
      });
    }

    // -----------------------------
    // Validate Answers
    // -----------------------------
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        error: "Interview answers are required.",
      });
    }

    // -----------------------------
    // Generate AI Feedback
    // -----------------------------
    const feedback = await generateInterviewFeedback(
      role,
      questions,
      answers
    );

    console.log("Interview Feedback Generated Successfully");

    // -----------------------------
    // Send Response
    // -----------------------------
    return res.status(200).json({
      success: true,
      feedback,
    });

  } catch (error) {
    console.error("=================================");
    console.error("Interview Controller Error:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      error: "Failed to generate interview feedback.",
      details: error.message,
    });
  }
};

module.exports = {
  getInterviewFeedback,
};