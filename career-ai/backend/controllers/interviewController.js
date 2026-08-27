const {
  generateInterviewQuestions,
  generateInterviewFeedback,
} = require("../services/aiService");

// ======================================================
// GENERATE INTERVIEW QUESTIONS
// ======================================================

const getInterviewQuestions = async (req, res) => {
  try {
    console.log("=================================");
    console.log("Interview Questions Request Received");
    console.log("=================================");

    const { role } = req.body;

    console.log("Target Role:", role);

    // VALIDATE ROLE
    if (
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Target role is required.",
      });
    }

    // GENERATE QUESTIONS
    const questions = await generateInterviewQuestions(
      role.trim()
    );

    console.log("Interview Questions Generated Successfully");
    console.log("Questions:", questions);

    return res.status(200).json({
      success: true,
      role: role.trim(),
      questions,
    });

  } catch (error) {
    console.error("=================================");
    console.error("Interview Questions Controller Error:");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      error: "Failed to generate interview questions.",
      details: error.message,
    });
  }
};


// ======================================================
// GENERATE INTERVIEW FEEDBACK
// ======================================================

const getInterviewFeedback = async (req, res) => {
  try {
    console.log("=================================");
    console.log("Interview Feedback Request Received");
    console.log("=================================");

    const {
      role,
      questions,
      answers,
    } = req.body;

    console.log("Role:", role);
    console.log("Questions:", questions);
    console.log("Answers:", answers);

    // VALIDATE ROLE
    if (
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Target role is required.",
      });
    }

    // VALIDATE QUESTIONS
    if (
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Interview questions are required.",
      });
    }

    // VALIDATE ANSWERS
    if (
      !answers ||
      typeof answers !== "object"
    ) {
      return res.status(400).json({
        success: false,
        error: "Interview answers are required.",
      });
    }

    // GENERATE AI FEEDBACK
    const feedback =
      await generateInterviewFeedback(
        role.trim(),
        questions,
        answers
      );

    console.log(
      "Interview Feedback Generated Successfully"
    );

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
  getInterviewQuestions,
  getInterviewFeedback,
};