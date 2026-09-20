const {
  generateInterviewQuestions,
  generateInterviewFeedback,
} = require("../services/aiService");

// =====================================================
// GENERATE INTERVIEW QUESTIONS
// =====================================================

const getInterviewQuestions = async (req, res) => {
  // IMPORTANT:
  // role ko try ke bahar rakha gaya hai
  // taaki catch block me bhi available rahe.
  const role = req.body?.role;
  const difficulty = req.body?.difficulty || "Medium";
  const questionCount = req.body?.questionCount || 5;

  try {
    console.log("========================================");
    console.log("🎯 INTERVIEW QUESTIONS REQUEST");
    console.log("========================================");

    console.log("Request Body:", req.body);
    console.log("Role:", role);
    console.log("Difficulty:", difficulty);
    console.log("Question Count:", questionCount);

    // -----------------------------------------
    // VALIDATE ROLE
    // -----------------------------------------

    if (
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview role is required.",
      });
    }

    // -----------------------------------------
    // VALIDATE DIFFICULTY
    // -----------------------------------------

    const allowedDifficulties = [
      "Easy",
      "Medium",
      "Hard",
      "Mixed",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message:
          "Difficulty must be Easy, Medium, Hard or Mixed.",
      });
    }

    // -----------------------------------------
    // VALIDATE QUESTION COUNT
    // -----------------------------------------

    const count = Number(questionCount);

    if (![5, 10, 15].includes(count)) {
      return res.status(400).json({
        success: false,
        message:
          "Question count must be 5, 10 or 15.",
      });
    }

    console.log("----------------------------------------");
    console.log("🚀 Calling Gemini...");
    console.log("Model: gemini-3.6-flash");
    console.log("Role:", role.trim());
    console.log("Difficulty:", difficulty);
    console.log("Questions:", count);
    console.log("----------------------------------------");

    // -----------------------------------------
    // CALL GEMINI
    // -----------------------------------------

    const questions =
      await generateInterviewQuestions(
        role.trim(),
        difficulty,
        count
      );

    // -----------------------------------------
    // SUCCESS
    // -----------------------------------------

    console.log("----------------------------------------");
    console.log("✅ QUESTIONS GENERATED SUCCESSFULLY");
    console.log("Total Questions:", questions.length);
    console.log("----------------------------------------");

    return res.status(200).json({
      success: true,
      role: role.trim(),
      difficulty,
      questionCount: count,
      questions,
    });
  } catch (error) {
    // -----------------------------------------
    // ERROR LOG
    // -----------------------------------------

    console.error("========================================");
    console.error("❌ INTERVIEW QUESTION ERROR");
    console.error("========================================");

    console.error("Message:", error.message);
    console.error("Status:", error.status);

    // -----------------------------------------
    // GEMINI QUOTA ERROR
    // -----------------------------------------

    if (error.status === 429) {
      console.error("⚠️ GEMINI QUOTA EXCEEDED");

      return res.status(429).json({
        success: false,

        errorType:
          "GEMINI_QUOTA_EXCEEDED",

        message:
          "Gemini API quota has been exceeded.",

        details:
          "gemini-3.6-flash returned HTTP 429 RESOURCE_EXHAUSTED.",

        role:
          typeof role === "string"
            ? role.trim()
            : role,

        retryAfter:
          "Please wait until the Gemini quota becomes available again.",
      });
    }

    // -----------------------------------------
    // OTHER GEMINI/API ERROR
    // -----------------------------------------

    return res.status(500).json({
      success: false,

      errorType:
        "INTERVIEW_QUESTION_ERROR",

      message:
        "Failed to generate interview questions.",

      details: error.message,

      role:
        typeof role === "string"
          ? role.trim()
          : role,
    });
  }
};


// =====================================================
// GENERATE INTERVIEW FEEDBACK
// =====================================================

const getInterviewFeedback = async (req, res) => {
  const role = req.body?.role;
  const questions = req.body?.questions;
  const answers = req.body?.answers;

  try {
    console.log("========================================");
    console.log("🎯 INTERVIEW FEEDBACK REQUEST");
    console.log("========================================");

    console.log("Role:", role);
    console.log("Questions:", questions);
    console.log("Answers:", answers);

    // -----------------------------------------
    // VALIDATE ROLE
    // -----------------------------------------

    if (
      !role ||
      typeof role !== "string" ||
      !role.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Interview role is required.",
      });
    }

    // -----------------------------------------
    // QUESTIONS VALIDATION
    // -----------------------------------------

    if (!Array.isArray(questions)) {
      return res.status(400).json({
        success: false,
        message:
          "Questions must be an array.",
      });
    }

    // -----------------------------------------
    // ANSWERS
    // -----------------------------------------
    // Frontend currently stores answers as an
    // object like:
    //
    // {
    //   0: "answer...",
    //   1: "answer..."
    // }
    //
    // So we allow both object and array.

    if (
      !answers ||
      (
        !Array.isArray(answers) &&
        typeof answers !== "object"
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Answers must be an array or object.",
      });
    }

    // -----------------------------------------
    // CALL GEMINI
    // -----------------------------------------

    const feedback =
      await generateInterviewFeedback(
        role.trim(),
        questions,
        answers
      );

    // -----------------------------------------
    // SUCCESS
    // -----------------------------------------

    return res.status(200).json({
      success: true,
      role: role.trim(),
      ...feedback,
    });
  } catch (error) {
    console.error(
      "========================================"
    );

    console.error(
      "❌ INTERVIEW FEEDBACK ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Status:",
      error.status
    );

    // -----------------------------------------
    // GEMINI QUOTA ERROR
    // -----------------------------------------

    if (error.status === 429) {
      return res.status(429).json({
        success: false,

        errorType:
          "GEMINI_QUOTA_EXCEEDED",

        message:
          "Gemini API quota has been exceeded.",

        details:
          "gemini-3.6-flash returned HTTP 429 RESOURCE_EXHAUSTED.",

        role:
          typeof role === "string"
            ? role.trim()
            : role,
      });
    }

    // -----------------------------------------
    // OTHER ERROR
    // -----------------------------------------

    return res.status(500).json({
      success: false,

      errorType:
        "INTERVIEW_FEEDBACK_ERROR",

      message:
        "Failed to generate interview feedback.",

      details: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getInterviewQuestions,
  getInterviewFeedback,
};