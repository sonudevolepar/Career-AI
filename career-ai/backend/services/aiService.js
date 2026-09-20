// ============================================================
// GEMINI AI SERVICE
// ============================================================

// IMPORTANT:
// Primary model remains gemini-3.6-flash.
// Other models are only used as automatic fallbacks.

const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


// ============================================================
// CALL GEMINI WITH AUTOMATIC FALLBACK
// ============================================================

const callGemini = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is missing in .env"
    );
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

      const response = await fetch(
        GEMINI_URL,
        {
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
              maxOutputTokens: 4096,
              responseMimeType:
                "application/json",
            },
          }),
        }
      );

      const responseText =
        await response.text();

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
          data = JSON.parse(
            responseText
          );
        } catch (parseError) {
          throw new Error(
            `Invalid JSON response from ${model}`
          );
        }

        const text =
          data?.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text;

        if (!text) {
          throw new Error(
            `${model} returned an empty response.`
          );
        }

        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          "✅ GEMINI SUCCESS"
        );
        console.log(
          "===================================="
        );
        console.log(
          "Model Used:",
          model
        );

        // Return both text and model
        return {
          text,
          model,
        };
      }

      // ======================================================
      // ERROR
      // ======================================================

      console.error(
        `❌ ${model} Error:`
      );

      console.error(
        responseText
      );

      const error =
        new Error(
          `Gemini ${model} failed with status ${response.status}`
        );

      error.status =
        response.status;

      error.response =
        responseText;

      lastError = error;

      // ======================================================
      // FALLBACK CONDITIONS
      // ======================================================

      if (
        response.status === 429 ||
        response.status === 503 ||
        response.status === 500 ||
        response.status === 502 ||
        response.status === 504
      ) {
        console.log("");
        console.log(
          `⚠️ ${model} unavailable.`
        );

        console.log(
          "➡️ Trying next Gemini model..."
        );

        continue;
      }

      // Authentication / bad request / permission
      // should NOT blindly fallback.

      throw error;
    } catch (error) {
      console.error(
        `❌ Error with model ${model}:`,
        error.message
      );

      lastError = error;

      if (
        error.status === 429 ||
        error.status === 503 ||
        error.status === 500 ||
        error.status === 502 ||
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

  // ==========================================================
  // ALL MODELS FAILED
  // ==========================================================

  console.error("");
  console.error(
    "===================================="
  );
  console.error(
    "❌ ALL GEMINI MODELS FAILED"
  );
  console.error(
    "===================================="
  );

  throw lastError ||
    new Error(
      "All Gemini models failed."
    );
};


// ============================================================
// PARSE GEMINI JSON
// ============================================================

const parseGeminiJSON = (text) => {
  let cleaned =
    text.trim();

  cleaned = cleaned
    .replace(
      /^```json\s*/i,
      ""
    )
    .replace(
      /^```\s*/i,
      ""
    )
    .replace(
      /\s*```$/i,
      ""
    )
    .trim();

  try {
    return JSON.parse(
      cleaned
    );
  } catch (error) {
    console.error(
      "❌ Gemini JSON Parse Error"
    );

    console.error(
      "Raw Gemini Response:"
    );

    console.error(
      text
    );

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
  console.log(
    "===================================="
  );
  console.log(
    "GENERATING INTERVIEW QUESTIONS"
  );
  console.log(
    "===================================="
  );

  console.log(
    "Role:",
    role
  );

  console.log(
    "Difficulty:",
    difficulty
  );

  console.log(
    "Question Count:",
    questionCount
  );

  console.log(
    "Primary Model: gemini-3.6-flash"
  );

  if (
    !role ||
    !role.trim()
  ) {
    throw new Error(
      "Interview role is required."
    );
  }

  const count =
    Number(questionCount);

  if (
    ![5, 10, 15].includes(
      count
    )
  ) {
    throw new Error(
      "Question count must be 5, 10 or 15."
    );
  }


  // ==========================================================
  // ROLE-SPECIFIC PROMPT
  // ==========================================================

  const prompt = `
You are an expert technical interviewer.

The candidate selected this EXACT job role:

"${role}"

Generate interview questions ONLY for this role.

Interview difficulty:

"${difficulty}"

Number of questions:

${count}


ROLE-SPECIFIC REQUIREMENTS:

If the role is MERN Stack Developer:
Focus on React.js, JavaScript, Node.js, Express.js,
MongoDB, Mongoose, REST APIs, JWT, authentication,
authorization, Redux and MERN architecture.

If the role is Full Stack Developer:
Focus on frontend, backend, databases, REST APIs,
authentication, API integration, deployment,
scalability and full-stack architecture.

If the role is Java Developer:
Focus on Core Java, OOP, Collections, Exception Handling,
Multithreading, Java 8+, Streams, JDBC and Java architecture.

If the role is Frontend Developer:
Focus on HTML, CSS, JavaScript, React,
DOM, browser concepts, responsive design,
performance and frontend architecture.

If the role is Backend Developer:
Focus on APIs, Node.js, backend architecture,
databases, authentication, authorization,
security, caching and scalability.

If the role is Python Developer:
Focus on Python, OOP, data structures,
exception handling, Django/Flask and APIs.

If the role is Data Analyst:
Focus on SQL, Excel, Pandas, statistics,
data cleaning, visualization and analytics.

If the role is Data Scientist:
Focus on Python, statistics, machine learning,
feature engineering, model evaluation and data science.

If the role is AI/ML Engineer:
Focus on machine learning, deep learning,
neural networks, NLP, transformers,
LLMs, embeddings and RAG.

If the role is DevOps Engineer:
Focus on Linux, Docker, Kubernetes,
CI/CD, cloud, deployment and monitoring.

If the role is Cloud Engineer:
Focus on AWS/Azure/GCP, networking, IAM,
storage, scaling, cloud architecture and security.

If the role is QA Engineer:
Focus on testing, test cases, automation,
Selenium, API testing and regression testing.

If the role is Cyber Security Engineer:
Focus on network security, authentication,
encryption, OWASP, vulnerabilities,
penetration testing and security.

If the role is Android Developer:
Focus on Android lifecycle, Java/Kotlin,
Activities, Fragments, RecyclerView,
Room, Firebase and Android architecture.

If the role is Software Engineer:
Focus on programming, DSA, algorithms,
OOP, databases, APIs, system design
and software engineering.


DIFFICULTY RULES:

Easy:
Ask beginner-friendly basic interview questions.

Medium:
Ask realistic interview-level technical questions.

Hard:
Ask advanced technical and problem-solving questions.

Mixed:
Mix Easy, Medium and Hard questions.


IMPORTANT:

1. Generate EXACTLY ${count} questions.
2. Every question must be different.
3. Every question must be related to "${role}".
4. Do not ask unrelated technology questions.
5. Do not provide answers.
6. Do not provide explanations.
7. Do not use markdown.
8. Questions must sound like real interview questions.
9. Return ONLY valid JSON.


RETURN EXACTLY:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`;


  // ==========================================================
  // CALL GEMINI WITH FALLBACK
  // ==========================================================

  const result =
    await callGemini(
      prompt
    );

  console.log(
    "Model that generated questions:",
    result.model
  );


  // ==========================================================
  // PARSE RESPONSE
  // ==========================================================

  const parsed =
    parseGeminiJSON(
      result.text
    );


  if (
    !parsed ||
    !Array.isArray(
      parsed.questions
    )
  ) {
    throw new Error(
      "Invalid questions received from Gemini."
    );
  }


  // ==========================================================
  // CLEAN QUESTIONS
  // ==========================================================

  const questions =
    parsed.questions
      .filter(
        (question) =>
          typeof question ===
            "string" &&
          question.trim()
            .length > 0
      )
      .map(
        (question) =>
          question.trim()
      );


  // ==========================================================
  // VALIDATE QUESTION COUNT
  // ==========================================================

  if (
    questions.length !== count
  ) {
    throw new Error(
      `Gemini returned ${questions.length} questions instead of ${count}.`
    );
  }


  // ==========================================================
  // LOG QUESTIONS
  // ==========================================================

  console.log("");
  console.log(
    "===================================="
  );

  console.log(
    "✅ QUESTIONS GENERATED"
  );

  console.log(
    "===================================="
  );

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
${JSON.stringify(
  questions
)}

Candidate answers:
${JSON.stringify(
  answers
)}

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


  const result =
    await callGemini(
      prompt
    );


  const feedback =
    parseGeminiJSON(
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