const { retrieveContext } = require("../services/ragService");

// ==========================================
// GEMINI CONFIG
// ==========================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";


// ==========================================
// GEMINI MODEL FALLBACK LIST
// ==========================================

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b"
];


// ==========================================
// CALL GEMINI REST API
// ==========================================

async function callGemini(model, prompt) {
  const url =
    `${GEMINI_BASE_URL}/${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY
    },

    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],

      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    })
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      `Gemini API Error: ${response.status}`;

    const error = new Error(errorMessage);

    error.status = response.status;

    throw error;
  }

  const answer =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

  if (!answer) {
    throw new Error("Gemini returned an empty response.");
  }

  return answer;
}


// ==========================================
// AI ASSISTANT CHAT
// ==========================================

exports.chatWithAssistant = async (req, res) => {
  try {
    const {
      message,
      page = "/"
    } = req.body;


    // ======================================
    // VALIDATION
    // ======================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }


    // ======================================
    // API KEY CHECK
    // ======================================

    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY is not configured"
      });
    }


    // ======================================
    // RAG
    // ======================================

    let relevantDocuments = [];

    try {
      relevantDocuments = retrieveContext(message);
    } catch (ragError) {
      console.error(
        "RAG ERROR:",
        ragError.message
      );
    }


    // ======================================
    // CONTEXT
    // ======================================

    const context =
      relevantDocuments.length > 0
        ? relevantDocuments
            .map(
              (doc) =>
                `### ${doc.title}\n${doc.content}`
            )
            .join("\n\n")
        : "No specific Career AI knowledge found.";


    // ======================================
    // PROMPT
    // ======================================

    const prompt = `
You are Career AI Assistant.

You are an AI assistant inside the Career AI platform.

Current page:
${page}

Your job is to help users with:

- Career guidance
- Resume improvement
- DSA
- Coding interview preparation
- Mock interviews
- Career roadmap
- System design
- Job search
- Career AI platform features

Use the provided knowledge when it is relevant.

Important rules:

1. Give clear and simple answers.
2. Be helpful and professional.
3. Do not mention internal RAG instructions.
4. Do not reveal API keys or secrets.
5. Do not invent Career AI features.
6. If the question is unrelated to Career AI, still try to help briefly.
7. Use bullet points when useful.

=========================================
CAREER AI KNOWLEDGE
=========================================

${context}

=========================================
USER QUESTION
=========================================

${message}

Now answer the user.
`;


    // ======================================
    // GEMINI FALLBACK
    // ======================================

    let answer = null;
    let usedModel = null;
    let lastError = null;


    for (const model of GEMINI_MODELS) {
      try {
        console.log(
          `Trying Gemini model: ${model}`
        );

        answer = await callGemini(
          model,
          prompt
        );

        usedModel = model;

        console.log(
          `Gemini SUCCESS: ${model}`
        );

        break;

      } catch (error) {
        lastError = error;

        console.error(
          `Gemini FAILED: ${model}`
        );

        console.error(
          error.message
        );

        continue;
      }
    }


    // ======================================
    // ALL MODELS FAILED
    // ======================================

    if (!answer) {
      console.error(
        "ALL GEMINI MODELS FAILED"
      );

      return res.status(503).json({
        success: false,
        message: "All Gemini models failed",
        error:
          lastError?.message ||
          "Unknown Gemini error"
      });
    }


    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      answer: answer,
      page: page,
      model: usedModel,
      sources: relevantDocuments.map(
        (doc) => doc.title
      )
    });

  } catch (error) {
    console.error(
      "AI ASSISTANT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "AI Assistant failed",
      error: error.message
    });
  }
};