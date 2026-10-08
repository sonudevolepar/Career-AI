// ============================================================
// GEMINI AI SERVICE
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini models
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

// ============================================================
// CALL GEMINI
// ============================================================

const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) {
    const error = new Error(
      "GEMINI_API_KEY is missing in .env"
    );

    error.status = 500;
    throw error;
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      console.log("");
      console.log("====================================");
      console.log("🤖 TRYING GEMINI MODEL");
      console.log("====================================");
      console.log("Model:", model);

      const GEMINI_URL =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const response = await fetch(GEMINI_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      });

      const responseText = await response.text();

      console.log(
        `Gemini ${model} Status:`,
        response.status
      );

      // ======================================================
      // SUCCESS
      // ======================================================

      if (response.ok) {
        let data;

        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          const error = new Error(
            `Invalid JSON response from ${model}`
          );

          error.status = 500;
          throw error;
        }

        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
          const error = new Error(
            `${model} returned an empty response.`
          );

          error.status = 500;
          throw error;
        }

        console.log("");
        console.log("====================================");
        console.log("✅ GEMINI SUCCESS");
        console.log("====================================");
        console.log("Model Used:", model);

        return {
          text,
          model,
        };
      }

      // ======================================================
      // GEMINI ERROR
      // ======================================================

      console.error("");
      console.error(`❌ ${model} ERROR`);
      console.error("Status:", response.status);
      console.error("Response:", responseText);

      const error = new Error(
        `Gemini ${model} failed with status ${response.status}`
      );

      error.status = response.status;
      error.response = responseText;

      lastError = error;

      if (
        response.status === 404 ||
        response.status === 429 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 503 ||
        response.status === 504
      ) {
        console.log(
          `⚠️ ${model} unavailable. Trying next model...`
        );

        continue;
      }

      throw error;
    } catch (error) {
      console.error(
        `❌ Error with model ${model}:`,
        error.message
      );

      lastError = error;

      if (
        error.status === 404 ||
        error.status === 429 ||
        error.status === 500 ||
        error.status === 502 ||
        error.status === 503 ||
        error.status === 504
      ) {
        console.log(
          "➡️ Trying next fallback model..."
        );

        continue;
      }

      throw error;
    }
  }

  console.error("");
  console.error("====================================");
  console.error("❌ ALL GEMINI MODELS FAILED");
  console.error("====================================");

  throw (
    lastError ||
    new Error("All Gemini models failed.")
  );
};

// ============================================================
// PARSE GEMINI JSON
// ============================================================

const parseGeminiJSON = (text) => {
  let cleaned = text.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ Gemini JSON Parse Error");
    console.error("Raw Gemini Response:");
    console.error(text);

    throw new Error(
      "Gemini returned invalid JSON."
    );
  }
};

// ============================================================
// ANALYZE RESUME WITH AI
// ============================================================

const analyzeResumeWithAI = async (
  resumeText,
  targetRole
) => {
  console.log("");
  console.log("====================================");
  console.log("📄 STARTING RESUME AI ANALYSIS");
  console.log("====================================");

  console.log("Target Role:", targetRole);
  console.log(
    "Resume Text Length:",
    resumeText?.length || 0
  );

  if (!resumeText || !resumeText.trim()) {
    throw new Error(
      "Resume text is required."
    );
  }

  if (!targetRole || !targetRole.trim()) {
    throw new Error(
      "Target job role is required."
    );
  }

  // Limit extremely large resumes
  const cleanedResumeText =
    resumeText.trim().slice(0, 30000);

  const prompt = `
You are an expert ATS resume analyzer and professional career coach.

Analyze the candidate's resume against the target job role.

TARGET JOB ROLE:
"${targetRole}"

RESUME TEXT:
"""
${cleanedResumeText}
"""

Your task is to provide a realistic ATS-style analysis.

Evaluate:

1. ATS match score
2. Professional summary
3. Skills matching the target role
4. Missing skills
5. Resume strengths
6. Resume weaknesses
7. Practical improvement suggestions

IMPORTANT RULES:

- Evaluate ONLY the information available in the resume.
- Do not invent experience, education, projects, certifications, or skills.
- Missing skills should be skills that are relevant to the target role but are not clearly present in the resume.
- Matched skills should only contain skills clearly found in the resume.
- Give an ATS score from 0 to 100.
- Keep the analysis practical and useful for job preparation.
- Do not give markdown.
- Return ONLY valid JSON.
- Do not wrap the JSON inside markdown code fences.

Return exactly this JSON structure:

{
  "atsScore": 0,
  "summary": "Professional summary of the resume compared with the target role.",
  "matchedSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "missingSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "improvementSuggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

ATS SCORE GUIDELINES:

90-100:
Excellent match with strong relevant skills, projects, experience and keywords.

75-89:
Very good match with most important requirements covered.

60-74:
Good but has noticeable skill or keyword gaps.

40-59:
Average match with several important gaps.

0-39:
Weak match for the selected target role.

Make the analysis specific to the target role:
"${targetRole}"
`;

  const result = await callGemini(prompt);

  console.log(
    "Resume analysis model:",
    result.model
  );

  const analysis =
    parseGeminiJSON(result.text);

  // ==========================================================
  // VALIDATE RESPONSE
  // ==========================================================

  if (!analysis || typeof analysis !== "object") {
    throw new Error(
      "Invalid resume analysis received from Gemini."
    );
  }

  // ATS SCORE
  let atsScore = Number(
    analysis.atsScore
  );

  if (Number.isNaN(atsScore)) {
    atsScore = 0;
  }

  atsScore = Math.max(
    0,
    Math.min(100, atsScore)
  );

  // Arrays
  const matchedSkills =
    Array.isArray(analysis.matchedSkills)
      ? analysis.matchedSkills
      : [];

  const missingSkills =
    Array.isArray(analysis.missingSkills)
      ? analysis.missingSkills
      : [];

  const strengths =
    Array.isArray(analysis.strengths)
      ? analysis.strengths
      : [];

  const weaknesses =
    Array.isArray(analysis.weaknesses)
      ? analysis.weaknesses
      : [];

  const improvementSuggestions =
    Array.isArray(
      analysis.improvementSuggestions
    )
      ? analysis.improvementSuggestions
      : [];

  const finalAnalysis = {
    atsScore,

    summary:
      typeof analysis.summary === "string"
        ? analysis.summary
        : "No summary available.",

    matchedSkills,

    missingSkills,

    strengths,

    weaknesses,

    improvementSuggestions,
  };

  console.log("");
  console.log("====================================");
  console.log("✅ RESUME ANALYSIS COMPLETED");
  console.log("====================================");

  console.log(
    "ATS Score:",
    finalAnalysis.atsScore
  );

  console.log(
    "Matched Skills:",
    finalAnalysis.matchedSkills.length
  );

  console.log(
    "Missing Skills:",
    finalAnalysis.missingSkills.length
  );

  return finalAnalysis;
};

// ============================================================
// GENERATE INTERVIEW QUESTIONS
// ============================================================

const generateInterviewQuestions = async (
  role,
  difficulty = "Medium",
  questionCount = 5
) => {
  console.log("");
  console.log("====================================");
  console.log("🎯 GENERATING INTERVIEW QUESTIONS");
  console.log("====================================");

  console.log("Role:", role);
  console.log("Difficulty:", difficulty);
  console.log("Question Count:", questionCount);

  if (!role || !role.trim()) {
    throw new Error(
      "Interview role is required."
    );
  }

  const count = Number(questionCount);

  if (![5, 10, 15].includes(count)) {
    throw new Error(
      "Question count must be 5, 10 or 15."
    );
  }

  const prompt = `
You are an expert technical interviewer.

The candidate selected this exact job role:

"${role}"

Generate interview questions ONLY for this role.

Interview difficulty:

"${difficulty}"

Generate exactly ${count} questions.

Rules:

1. Generate exactly ${count} questions.
2. Every question must be different.
3. Every question must be related to "${role}".
4. Do not ask unrelated technology questions.
5. Do not provide answers.
6. Do not provide explanations.
7. Questions should sound like real interview questions.
8. Return ONLY valid JSON.

Difficulty rules:

Easy:
Ask beginner-friendly basic interview questions.

Medium:
Ask realistic interview-level technical questions.

Hard:
Ask advanced technical and problem-solving questions.

Mixed:
Mix Easy, Medium and Hard questions.

For MERN Stack Developer focus on:

- React.js
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- JWT
- Authentication
- Authorization
- Redux
- MERN architecture

Return exactly this structure:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`;

  const result = await callGemini(prompt);

  console.log(
    "Model that generated questions:",
    result.model
  );

  const parsed = parseGeminiJSON(
    result.text
  );

  if (
    !parsed ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error(
      "Invalid questions received from Gemini."
    );
  }

  const questions = parsed.questions
    .filter(
      (question) =>
        typeof question === "string" &&
        question.trim().length > 0
    )
    .map(
      (question) => question.trim()
    );

  if (questions.length !== count) {
    throw new Error(
      `Gemini returned ${questions.length} questions instead of ${count}.`
    );
  }

  console.log("");
  console.log("====================================");
  console.log("✅ QUESTIONS GENERATED");
  console.log("====================================");

  questions.forEach(
    (question, index) => {
      console.log(
        `Q${index + 1}:`,
        question
      );
    }
  );

  return questions;
};

// ============================================================
// GENERATE INTERVIEW FEEDBACK
// ============================================================

const generateInterviewFeedback = async (
  role,
  questions,
  answers
) => {
  const prompt = `
You are an expert interview evaluator.

Candidate role:
${role}

Interview questions:
${JSON.stringify(questions)}

Candidate answers:
${JSON.stringify(answers)}

Evaluate the candidate based on the selected role.

Return ONLY valid JSON:

{
  "score": 0,
  "feedback": "Overall feedback",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ]
}

Score must be between 0 and 100.
`;

  const result = await callGemini(prompt);

  const feedback = parseGeminiJSON(
    result.text
  );

  return feedback;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  callGemini,
  analyzeResumeWithAI,
  generateInterviewQuestions,
  generateInterviewFeedback,
};