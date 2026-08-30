// ======================================================
// SYSTEM DESIGN AI SERVICE
// Gemini -> Structured System Design JSON
// ======================================================

const { GoogleGenAI } = require("@google/genai");

// ======================================================
// GEMINI CLIENT
// ======================================================

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// MODEL
// ======================================================

const TEXT_MODEL = "gemini-3.6-flash";

// ======================================================
// ALLOWED DIFFICULTIES
// ======================================================

const ALLOWED_DIFFICULTIES = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

// ======================================================
// CLEAN AI RESPONSE
// ======================================================

const cleanAIResponse = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("AI returned empty response");
  }

  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

// ======================================================
// PARSE JSON
// ======================================================

const parseAIJSON = (text) => {
  const cleaned = cleanAIResponse(text);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    // Try extracting JSON object
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      console.error("Raw Gemini response:");
      console.error(cleaned);

      throw new Error(
        "AI returned invalid JSON response"
      );
    }

    try {
      return JSON.parse(
        cleaned.substring(start, end + 1)
      );
    } catch (parseError) {
      console.error("Raw Gemini response:");
      console.error(cleaned);

      throw new Error(
        "AI returned invalid JSON response"
      );
    }
  }
};

// ======================================================
// VALIDATE RESPONSE
// ======================================================

const validateSystemDesign = (data) => {
  const requiredFields = [
    "title",
    "problemStatement",
    "requirements",
    "capacityEstimation",
    "architecture",
    "databaseDesign",
    "apis",
    "scalability",
    "reliability",
    "security",
    "caching",
    "loadBalancing",
    "bottlenecks",
    "interviewExplanation",
    "followUpQuestions",
    "keyTakeaways",
  ];

  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(
        `AI response missing required field: ${field}`
      );
    }
  }

  if (
    !data.architecture ||
    !Array.isArray(data.architecture.components)
  ) {
    throw new Error(
      "AI response contains invalid architecture components"
    );
  }

  if (
    !Array.isArray(data.architecture.requestFlow)
  ) {
    throw new Error(
      "AI response contains invalid request flow"
    );
  }

  return true;
};

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

const generateSystemDesign = async (
  problem,
  difficulty = "Beginner"
) => {
  // ====================================================
  // VALIDATION
  // ====================================================

  if (
    !problem ||
    typeof problem !== "string" ||
    !problem.trim()
  ) {
    throw new Error(
      "System design problem is required"
    );
  }

  problem = problem.trim();

  if (
    !ALLOWED_DIFFICULTIES.includes(difficulty)
  ) {
    difficulty = "Beginner";
  }

  console.log(
    "=============================================="
  );

  console.log(
    "SYSTEM DESIGN GENERATION STARTED"
  );

  console.log(
    "Problem:",
    problem
  );

  console.log(
    "Difficulty:",
    difficulty
  );

  console.log(
    "Model:",
    TEXT_MODEL
  );

  console.log(
    "=============================================="
  );

  try {
    // ==================================================
    // PROMPT
    // ==================================================

    const prompt = `
You are an expert Senior Software Architect,
System Design Interviewer and Backend Engineer.

The candidate wants to practice system design.

==================================================
SYSTEM DESIGN PROBLEM
==================================================

${problem}

==================================================
DIFFICULTY
==================================================

${difficulty}

==================================================
TASK
==================================================

Create a complete production-grade system design.

The system should be explained in an interview-friendly
and technically accurate way.

Cover:

1. Problem Statement
2. Functional Requirements
3. Non-Functional Requirements
4. Capacity Estimation
5. System Architecture
6. Architecture Components
7. Request Flow
8. Database Design
9. API Design
10. Scalability
11. Reliability
12. Security
13. Caching
14. Load Balancing
15. Bottlenecks and Solutions
16. Interview Explanation
17. Interview Follow-up Questions
18. Key Takeaways

==================================================
IMPORTANT ARCHITECTURE REQUIREMENT
==================================================

The architecture must be structured so that a frontend
can convert it into a React Flow diagram.

Therefore:

- Give clear architecture components.
- Give logical connections between components.
- Give source and target component names in requestFlow.
- Avoid vague architecture descriptions.
- Use realistic production components.

For example:

components:

[
  {
    "name": "Client",
    "type": "client",
    "purpose": "..."
  },
  {
    "name": "API Gateway",
    "type": "gateway",
    "purpose": "..."
  },
  {
    "name": "Redis",
    "type": "cache",
    "purpose": "..."
  }
]

requestFlow:

[
  {
    "from": "Client",
    "to": "API Gateway",
    "label": "HTTP Request"
  },
  {
    "from": "API Gateway",
    "to": "Application Service",
    "label": "Forward Request"
  },
  {
    "from": "Application Service",
    "to": "Redis",
    "label": "Read Cache"
  }
]

The "from" and "to" values MUST match component names.

==================================================
RETURN ONLY JSON
==================================================

Do NOT return markdown.

Do NOT use code fences.

Do NOT write explanations outside JSON.

Return ONLY this JSON structure:

{
  "title": "string",

  "problemStatement": "string",

  "requirements": {
    "functional": [
      "string"
    ],
    "nonFunctional": [
      "string"
    ]
  },

  "capacityEstimation": {
    "users": "string",
    "requestsPerSecond": "string",
    "storage": "string",
    "bandwidth": "string"
  },

  "architecture": {
    "overview": "string",

    "components": [
      {
        "name": "string",
        "type": "client | gateway | service | database | cache | queue | storage | cdn | external",
        "purpose": "string"
      }
    ],

    "requestFlow": [
      {
        "from": "component name",
        "to": "component name",
        "label": "string"
      }
    ]
  },

  "databaseDesign": {
    "databaseType": "string",
    "reason": "string",

    "tablesOrCollections": [
      {
        "name": "string",
        "fields": [
          "string"
        ]
      }
    ]
  },

  "apis": [
    {
      "method": "GET | POST | PUT | DELETE",
      "endpoint": "string",
      "purpose": "string",
      "request": "string",
      "response": "string"
    }
  ],

  "scalability": [
    "string"
  ],

  "reliability": [
    "string"
  ],

  "security": [
    "string"
  ],

  "caching": [
    "string"
  ],

  "loadBalancing": "string",

  "bottlenecks": [
    {
      "problem": "string",
      "solution": "string"
    }
  ],

  "interviewExplanation": "string",

  "followUpQuestions": [
    "string"
  ],

  "keyTakeaways": [
    "string"
  ]
}
`;

    // ==================================================
    // GEMINI
    // ==================================================

    console.log(
      "Generating structured system design..."
    );

    const response =
      await genAI.models.generateContent({
        model: TEXT_MODEL,
        contents: prompt,
      });

    const text = response.text;

    console.log(
      "Gemini response received."
    );

    // ==================================================
    // PARSE
    // ==================================================

    const systemDesign =
      parseAIJSON(text);

    // ==================================================
    // VALIDATE
    // ==================================================

    validateSystemDesign(
      systemDesign
    );

    console.log(
      "System design JSON validated successfully."
    );

    console.log(
      "=============================================="
    );

    console.log(
      "SYSTEM DESIGN GENERATION COMPLETED"
    );

    console.log(
      "=============================================="
    );

    return systemDesign;

  } catch (error) {
    console.error(
      "=============================================="
    );

    console.error(
      "SYSTEM DESIGN SERVICE ERROR"
    );

    console.error(error);

    console.error(
      "=============================================="
    );

    throw new Error(
      error.message ||
      "Failed to generate system design"
    );
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateSystemDesign,
};