const { GoogleGenerativeAI } = require("@google/generative-ai");

const { retrieveContext } = require("../services/ragService");

// ==========================================
// GEMINI SETUP
// ==========================================

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


// ==========================================
// AI ASSISTANT CHAT
// ==========================================

exports.chatWithAssistant = async (req, res) => {
  try {
    const {
      message,
      page = "/",
    } = req.body;


    // ======================================
    // VALIDATION
    // ======================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }


    // ======================================
    // RAG - GET RELEVANT CONTEXT
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
    // GEMINI MODEL
    // ======================================

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });


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
    // GENERATE AI RESPONSE
    // ======================================

    const result =
      await model.generateContent(prompt);

    const response =
      await result.response;

    const answer = response.text();


    // ======================================
    // SEND RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      answer: answer,
      page: page,
      sources: relevantDocuments.map(
        (doc) => doc.title
      ),
    });


  } catch (error) {

    console.error(
      "AI ASSISTANT ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "AI Assistant failed",
      error: error.message,
    });
  }
};