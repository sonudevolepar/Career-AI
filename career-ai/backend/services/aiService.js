// ============================================================
// GEMINI AI SERVICE
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use models that are commonly available through Gemini API.
// If one is unavailable, the next model will be tried.
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

      // Try another model for temporary/model availability errors
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

      // Authentication / bad request
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
  generateInterviewQuestions,
  generateInterviewFeedback,
};