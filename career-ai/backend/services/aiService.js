// ======================================================
// GEMINI AI SERVICE
// ======================================================

const GEMINI_MODEL = "gemini-3.6-flash";

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;


// ======================================================
// HELPER: CALL GEMINI
// ======================================================

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing in backend/.env"
    );
  }

  console.log(
    "Gemini API key loaded:",
    apiKey.substring(0, 6) + "..."
  );

  const response = await fetch(GEMINI_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
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
        responseMimeType: "application/json",
      },
    }),
  });

  const data = await response.json();

  console.log("Gemini API Status:", response.status);

  if (!response.ok) {
    console.error("Gemini API Error:");
    console.error(JSON.stringify(data, null, 2));

    throw new Error(
      data?.error?.message ||
      "Gemini API request failed"
    );
  }

  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    console.error(
      "Gemini returned empty response:"
    );

    console.error(
      JSON.stringify(data, null, 2)
    );

    throw new Error(
      "Gemini returned an empty response"
    );
  }

  return rawText;
};


// ======================================================
// HELPER: PARSE GEMINI JSON RESPONSE
// ======================================================

const parseGeminiJSON = (rawText) => {
  const cleanText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch (error) {
    console.error(
      "Gemini returned invalid JSON:"
    );

    console.error(cleanText);

    throw new Error(
      "Gemini returned invalid JSON"
    );
  }
};


// ======================================================
// RESUME ANALYZER
// ======================================================

const analyzeResumeWithAI = async (
  resumeText,
  jobRole
) => {

  if (!resumeText || !resumeText.trim()) {
    throw new Error("Resume text is empty");
  }

  if (!jobRole || !jobRole.trim()) {
    throw new Error("Target job role is required");
  }

  const prompt = `
You are an expert ATS resume analyzer and career coach.

Analyze the following resume for the target job role.

Target Job Role:
${jobRole}

Resume:
${resumeText}

Evaluate the resume based ONLY on the information provided.

Analyze:

1. ATS score
2. Resume strengths
3. Resume weaknesses
4. Missing skills
5. Recommended skills
6. Experience relevance
7. Projects relevance
8. Keyword optimization
9. Formatting/content issues
10. Overall improvement suggestions

Important:

- Do not invent information.
- Do not assume the candidate has skills that are not present.
- Recommendations must be relevant to the target job role.
- ATS score must be between 0 and 100.
- Return ONLY valid JSON.
- Do not return Markdown.
- Do not return backticks.

Use exactly this structure:

{
  "atsScore": 75,
  "overallFeedback": "Short overall feedback.",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "missingSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "recommendedSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "keywordSuggestions": [
    "Keyword 1",
    "Keyword 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}
`;

  try {

    console.log(
      "================================="
    );

    console.log(
      "Sending resume data to Gemini..."
    );

    console.log(
      "================================="
    );

    const rawText = await callGemini(prompt);

    console.log(
      "Gemini Resume Response Received"
    );

    const result = parseGeminiJSON(rawText);

    // Validate ATS score

    if (
      typeof result.atsScore !== "number" ||
      result.atsScore < 0 ||
      result.atsScore > 100
    ) {
      throw new Error(
        "Gemini returned an invalid ATS score"
      );
    }

    if (!result.overallFeedback) {
      throw new Error(
        "Gemini returned missing overall feedback"
      );
    }

    if (!Array.isArray(result.strengths)) {
      throw new Error(
        "Gemini returned invalid strengths"
      );
    }

    if (!Array.isArray(result.weaknesses)) {
      throw new Error(
        "Gemini returned invalid weaknesses"
      );
    }

    if (!Array.isArray(result.missingSkills)) {
      throw new Error(
        "Gemini returned invalid missingSkills"
      );
    }

    if (!Array.isArray(result.recommendedSkills)) {
      throw new Error(
        "Gemini returned invalid recommendedSkills"
      );
    }

    if (!Array.isArray(result.keywordSuggestions)) {
      throw new Error(
        "Gemini returned invalid keywordSuggestions"
      );
    }

    if (!Array.isArray(result.recommendations)) {
      throw new Error(
        "Gemini returned invalid recommendations"
      );
    }

    console.log(
      "Resume Analysis Parsed Successfully"
    );

    return result;

  } catch (error) {

    console.error(
      "Analyze Resume With AI Error:",
      error.message
    );

    throw error;
  }
};


// ======================================================
// INTERVIEW FEEDBACK
// ======================================================

const generateInterviewFeedback = async (
  role,
  questions,
  answers
) => {

  if (!role || !role.trim()) {
    throw new Error(
      "Interview role is required"
    );
  }

  if (
    !Array.isArray(questions) ||
    questions.length === 0
  ) {
    throw new Error(
      "Interview questions are required"
    );
  }

  const getAnswer = (index) => {

    if (Array.isArray(answers)) {
      return (
        answers[index] ||
        "No answer provided"
      );
    }

    if (
      answers &&
      typeof answers === "object"
    ) {
      return (
        answers[index] ||
        "No answer provided"
      );
    }

    return "No answer provided";
  };


  // ====================================================
  // BUILD INTERVIEW DATA
  // ====================================================

  const interviewData = questions
    .map((question, index) => {

      return `
Q${index + 1}: ${question}

Candidate Answer:
${getAnswer(index)}
`;

    })
    .join("\n");


  // ====================================================
  // GEMINI PROMPT
  // ====================================================

  const prompt = `
You are an expert technical interviewer and career coach.

The candidate has completed a mock technical interview.

Target Role:
${role}

Interview Questions and Candidate Answers:
${interviewData}

Analyze the candidate ONLY from the answers provided above.

Evaluate:

1. Technical knowledge
2. Concept understanding
3. Communication
4. Accuracy
5. Clarity
6. Problem solving ability
7. Overall interview performance

Important:

- Do not invent information about the candidate.
- Do not assume the candidate knows something that they did not demonstrate.
- If an answer is incorrect or meaningless, clearly mention it.
- Give practical and specific improvement suggestions.
- Feedback should be relevant to the target role.
- Evaluate only the candidate's provided answers.
- Return ONLY valid JSON.
- Do not return Markdown.
- Do not return backticks.

Use exactly this structure:

{
  "overallScore": 75,
  "overallFeedback": "Short overall feedback about the candidate.",
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2"
  ],
  "questionFeedback": [
    {
      "question": "Question text",
      "feedback": "Specific feedback about the candidate's answer."
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}

Rules:

- overallScore must be a number between 0 and 100.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- recommendations must be an array of strings.
- questionFeedback must be an array of objects.
- Every questionFeedback object must contain "question" and "feedback".
- questionFeedback must contain feedback for every question.
- Do not invent answers.
- Feedback must be specific to the target role.
- Return ONLY JSON.
`;

  try {

    console.log(
      "================================="
    );

    console.log(
      "Sending interview data to Gemini..."
    );

    console.log(
      "================================="
    );

    // ==================================================
    // CALL GEMINI
    // ==================================================

    const rawText =
      await callGemini(prompt);

    console.log(
      "Gemini Interview Response Received"
    );

    // ==================================================
    // PARSE JSON
    // ==================================================

    const result =
      parseGeminiJSON(rawText);


    // ==================================================
    // VALIDATE RESPONSE
    // ==================================================

    if (
      typeof result.overallScore !== "number" ||
      result.overallScore < 0 ||
      result.overallScore > 100
    ) {
      throw new Error(
        "Gemini returned an invalid overall score"
      );
    }

    if (!result.overallFeedback) {
      throw new Error(
        "Gemini returned missing overall feedback"
      );
    }

    if (!Array.isArray(result.strengths)) {
      throw new Error(
        "Gemini returned invalid strengths"
      );
    }

    if (!Array.isArray(result.weaknesses)) {
      throw new Error(
        "Gemini returned invalid weaknesses"
      );
    }

    if (!Array.isArray(result.questionFeedback)) {
      throw new Error(
        "Gemini returned invalid questionFeedback"
      );
    }

    if (!Array.isArray(result.recommendations)) {
      throw new Error(
        "Gemini returned invalid recommendations"
      );
    }


    // ==================================================
    // CHECK EVERY QUESTION
    // ==================================================

    if (
      result.questionFeedback.length !==
      questions.length
    ) {

      throw new Error(
        "Gemini did not return feedback for every question"
      );
    }


    for (
      const item of result.questionFeedback
    ) {

      if (
        !item.question ||
        !item.feedback
      ) {

        throw new Error(
          "Invalid questionFeedback structure"
        );
      }
    }


    console.log(
      "Interview Feedback Parsed Successfully"
    );

    console.log(
      "Overall Score:",
      result.overallScore
    );


    return result;

  } catch (error) {

    console.error(
      "Generate Interview Feedback Error:",
      error.message
    );

    throw error;
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  analyzeResumeWithAI,
  generateInterviewFeedback,
};