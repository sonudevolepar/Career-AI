// ======================================================
// SYSTEM DESIGN AI SERVICE
// Career AI
// ======================================================

const { GoogleGenAI } = require("@google/genai");

// ======================================================
// GEMINI CLIENT
// ======================================================

if (!process.env.GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing from environment variables."
  );
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// CONSTANTS
// ======================================================

const DEFAULT_DIFFICULTY = "Beginner";

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
    throw new Error("AI returned an empty response");
  }

  let cleaned = text.trim();

  // ----------------------------------------------------
  // Remove markdown code fences
  // ----------------------------------------------------

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // ----------------------------------------------------
  // Remove accidental "json" prefix
  // ----------------------------------------------------

  if (cleaned.toLowerCase().startsWith("json")) {
    cleaned = cleaned.substring(4).trim();
  }

  return cleaned;
};

// ======================================================
// REPAIR JSON STRING
// ======================================================

const repairJSONString = (text) => {
  let repaired = text;

  // ----------------------------------------------------
  // Escape invalid backslashes.
  //
  // Valid JSON escapes are:
  // \" \\ \/ \b \f \n \r \t \uXXXX
  //
  // AI-generated architecture diagrams sometimes
  // contain single backslashes which break JSON.
  // ----------------------------------------------------

  repaired = repaired.replace(
    /\\(?!["\\/bfnrtu])/g,
    "\\\\"
  );

  return repaired;
};

// ======================================================
// EXTRACT JSON OBJECT
// ======================================================

const extractJSONObject = (text) => {
  const startIndex = text.indexOf("{");
  const endIndex = text.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("AI response does not contain a JSON object");
  }

  return text.substring(startIndex, endIndex + 1);
};

// ======================================================
// PARSE AI JSON
// ======================================================

const parseAIResponse = (text) => {
  const cleaned = cleanAIResponse(text);

  // ====================================================
  // ATTEMPT 1
  // ====================================================

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn(
      "⚠️ Normal JSON parsing failed. Trying repair..."
    );
  }

  // ====================================================
  // ATTEMPT 2 - REPAIR BACKSLASHES
  // ====================================================

  try {
    const repaired = repairJSONString(cleaned);

    return JSON.parse(repaired);
  } catch (error) {
    console.warn(
      "⚠️ Repaired JSON parsing failed. Trying extraction..."
    );
  }

  // ====================================================
  // ATTEMPT 3 - EXTRACT OBJECT
  // ====================================================

  try {
    const extracted = extractJSONObject(cleaned);

    return JSON.parse(extracted);
  } catch (error) {
    console.warn(
      "⚠️ JSON extraction failed. Trying extraction + repair..."
    );
  }

  // ====================================================
  // ATTEMPT 4 - EXTRACT + REPAIR
  // ====================================================

  try {
    const extracted = extractJSONObject(cleaned);

    const repaired = repairJSONString(extracted);

    return JSON.parse(repaired);
  } catch (error) {
    console.error(
      "❌ All JSON parsing attempts failed."
    );

    console.error(
      "Raw AI Response:"
    );

    console.error(text);

    throw new Error(
      "AI returned invalid JSON response"
    );
  }
};

// ======================================================
// VALIDATE SYSTEM DESIGN RESPONSE
// ======================================================

const validateSystemDesignResponse = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error(
      "Invalid system design response"
    );
  }

  // ----------------------------------------------------
  // Required top-level fields
  // ----------------------------------------------------

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
    "architectureDiagram",
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

  // ----------------------------------------------------
  // Requirements validation
  // ----------------------------------------------------

  if (
    !data.requirements ||
    !Array.isArray(data.requirements.functional) ||
    !Array.isArray(data.requirements.nonFunctional)
  ) {
    throw new Error(
      "Invalid requirements structure"
    );
  }

  // ----------------------------------------------------
  // Architecture validation
  // ----------------------------------------------------

  if (
    !data.architecture ||
    typeof data.architecture.overview !== "string" ||
    !Array.isArray(data.architecture.components) ||
    !Array.isArray(data.architecture.requestFlow)
  ) {
    throw new Error(
      "Invalid architecture structure"
    );
  }

  // ----------------------------------------------------
  // Database validation
  // ----------------------------------------------------

  if (
    !data.databaseDesign ||
    typeof data.databaseDesign.databaseType !== "string" ||
    !Array.isArray(
      data.databaseDesign.tablesOrCollections
    )
  ) {
    throw new Error(
      "Invalid database design structure"
    );
  }

  // ----------------------------------------------------
  // Array validation
  // ----------------------------------------------------

  const arrayFields = [
    "apis",
    "scalability",
    "reliability",
    "security",
    "caching",
    "bottlenecks",
    "followUpQuestions",
    "keyTakeaways",
  ];

  for (const field of arrayFields) {
    if (!Array.isArray(data[field])) {
      throw new Error(
        `Invalid ${field} structure`
      );
    }
  }

  return true;
};

// ======================================================
// NORMALIZE RESPONSE
// ======================================================

const normalizeSystemDesignResponse = (data) => {
  return {
    title:
      data.title || "System Design Solution",

    problemStatement:
      data.problemStatement || "",

    requirements: {
      functional:
        Array.isArray(
          data.requirements?.functional
        )
          ? data.requirements.functional
          : [],

      nonFunctional:
        Array.isArray(
          data.requirements?.nonFunctional
        )
          ? data.requirements.nonFunctional
          : [],
    },

    capacityEstimation: {
      users:
        data.capacityEstimation?.users || "",

      requestsPerSecond:
        data.capacityEstimation?.requestsPerSecond ||
        "",

      storage:
        data.capacityEstimation?.storage || "",

      bandwidth:
        data.capacityEstimation?.bandwidth || "",
    },

    architecture: {
      overview:
        data.architecture?.overview || "",

      components:
        Array.isArray(
          data.architecture?.components
        )
          ? data.architecture.components
          : [],

      requestFlow:
        Array.isArray(
          data.architecture?.requestFlow
        )
          ? data.architecture.requestFlow
          : [],
    },

    databaseDesign: {
      databaseType:
        data.databaseDesign?.databaseType || "",

      reason:
        data.databaseDesign?.reason || "",

      tablesOrCollections:
        Array.isArray(
          data.databaseDesign?.tablesOrCollections
        )
          ? data.databaseDesign.tablesOrCollections
          : [],
    },

    apis:
      Array.isArray(data.apis)
        ? data.apis
        : [],

    scalability:
      Array.isArray(data.scalability)
        ? data.scalability
        : [],

    reliability:
      Array.isArray(data.reliability)
        ? data.reliability
        : [],

    security:
      Array.isArray(data.security)
        ? data.security
        : [],

    caching:
      Array.isArray(data.caching)
        ? data.caching
        : [],

    loadBalancing:
      data.loadBalancing || "",

    bottlenecks:
      Array.isArray(data.bottlenecks)
        ? data.bottlenecks
        : [],

    architectureDiagram:
      data.architectureDiagram || "",

    interviewExplanation:
      data.interviewExplanation || "",

    followUpQuestions:
      Array.isArray(data.followUpQuestions)
        ? data.followUpQuestions
        : [],

    keyTakeaways:
      Array.isArray(data.keyTakeaways)
        ? data.keyTakeaways
        : [],
  };
};

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

const generateSystemDesign = async (
  problem,
  difficulty = DEFAULT_DIFFICULTY
) => {
  // ====================================================
  // INPUT VALIDATION
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

  // ----------------------------------------------------
  // Validate difficulty
  // ----------------------------------------------------

  if (
    !ALLOWED_DIFFICULTIES.includes(difficulty)
  ) {
    difficulty = DEFAULT_DIFFICULTY;
  }

  // ====================================================
  // PROMPT
  // ====================================================

  const prompt = `
You are an expert Senior Software Architect,
System Design Interviewer, and Backend Engineer.

The candidate is practicing a system design interview.

==================================================
SYSTEM DESIGN PROBLEM
==================================================

${problem}

==================================================
DIFFICULTY
==================================================

${difficulty}

==================================================
YOUR TASK
==================================================

Create a complete, practical, interview-focused
system design solution for the given problem.

The solution must be appropriate for the selected
difficulty.

BEGINNER:
- Keep architecture simple.
- Explain concepts clearly.
- Use common technologies.
- Avoid unnecessary distributed-system complexity.

INTERMEDIATE:
- Use realistic production architecture.
- Explain scalability.
- Explain caching.
- Explain load balancing.
- Explain database choices.
- Explain reliability.

ADVANCED:
- Design a highly scalable distributed system.
- Explain partitioning.
- Explain replication.
- Explain consistency.
- Explain fault tolerance.
- Explain queues.
- Explain caching.
- Explain observability.
- Explain failure handling.

==================================================
IMPORTANT JSON RULES
==================================================

RETURN ONLY VALID JSON.

DO NOT return Markdown.

DO NOT use:
\`\`\`json

DO NOT use:
\`\`\`

DO NOT write explanations outside JSON.

Every property must contain valid JSON values.

All strings must use double quotes.

==================================================
IMPORTANT ARCHITECTURE DIAGRAM RULE
==================================================

For "architectureDiagram":

Return a SIMPLE plain-text flow diagram.

DO NOT use:
- backslash characters
- ASCII box drawing
- special box characters
- characters such as \\, /, | for drawing boxes

Use ONLY simple arrows "->".

Example:

Client -> Load Balancer -> API Server -> Redis
API Server -> PostgreSQL
Client -> CDN -> Object Storage
Upload -> Message Queue -> Transcoding Worker -> Object Storage

==================================================
REQUIRED JSON STRUCTURE
==================================================

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
        "purpose": "string"
      }
    ],

    "requestFlow": [
      "string"
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
      "method": "GET",
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

  "architectureDiagram": "string",

  "interviewExplanation": "string",

  "followUpQuestions": [
    "string"
  ],

  "keyTakeaways": [
    "string"
  ]
}

==================================================
CONTENT REQUIREMENTS
==================================================

Include:

1. Problem statement

2. Functional requirements

3. Non-functional requirements

4. Capacity estimation

5. High-level architecture

6. Architecture components

7. Request flow

8. Database design

9. API design

10. Scalability

11. Reliability

12. Security

13. Caching

14. Load balancing

15. Bottlenecks

16. Solutions

17. Interview explanation

18. Follow-up questions

19. Key takeaways

Keep the explanation technically accurate and
useful for an actual system design interview.

Return ONLY the JSON object.
`;

  // ====================================================
  // LOG REQUEST
  // ====================================================

  console.log(
    "======================================"
  );

  console.log(
    "SYSTEM DESIGN AI REQUEST"
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
    "======================================"
  );

  try {
    // ==================================================
    // GEMINI INTERACTIONS API
    // ==================================================

    const interaction =
      await genAI.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
      });

    // ==================================================
    // GET OUTPUT
    // ==================================================

    const text = interaction.output_text;

    if (!text) {
      throw new Error(
        "AI returned an empty response"
      );
    }

    console.log(
      "System Design AI Response Received"
    );

    // ==================================================
    // PARSE RESPONSE
    // ==================================================

    const parsedResponse =
      parseAIResponse(text);

    // ==================================================
    // VALIDATE RESPONSE
    // ==================================================

    validateSystemDesignResponse(
      parsedResponse
    );

    // ==================================================
    // NORMALIZE RESPONSE
    // ==================================================

    const normalizedResponse =
      normalizeSystemDesignResponse(
        parsedResponse
      );

    console.log(
      "System Design JSON validated successfully"
    );

    console.log(
      "======================================"
    );

    return normalizedResponse;

  } catch (error) {
    // ==================================================
    // ERROR LOGGING
    // ==================================================

    console.error(
      "======================================"
    );

    console.error(
      "SYSTEM DESIGN AI ERROR"
    );

    console.error(
      error
    );

    console.error(
      "======================================"
    );

    // --------------------------------------------------
    // Preserve meaningful error
    // --------------------------------------------------

    if (
      error &&
      error.message
    ) {
      throw new Error(
        error.message
      );
    }

    throw new Error(
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