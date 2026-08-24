const { generateInterviewFeedback } = require("../services/aiService");

const getInterviewFeedback = async (req, res) => {
  try {
    console.log("Interview Feedback Request Received");

    const { role, questions, answers } = req.body;

    console.log("Role:", role);
    console.log("Questions:", questions);
    console.log("Answers:", answers);

    // Validate role
    if (!role) {
      return res.status(400).json({
        success: false,
        error: "Target role is required.",
      });
    }

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Interview questions are required.",
      });
    }

    // Validate answers
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        error: "Interview answers are required.",
      });
    }

    const feedback = await generateInterviewFeedback(
      role,
      questions,
      answers
    );

    console.log("Interview Feedback Generated Successfully");

    return res.status(200).json({
      success: true,
      feedback: feedback,
    });

  } catch (error) {
    console.error("Interview Controller Error:", error);

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