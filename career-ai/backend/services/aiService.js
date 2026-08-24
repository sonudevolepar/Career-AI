const generateInterviewFeedback = async (role, questions, answers) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }

  const prompt = `
You are an expert technical interviewer and career coach.

The candidate completed a mock interview.

Target Role:
${role || "Software Developer"}

Interview Questions and Candidate Answers:

${questions
  .map((question, index) => {
    return `
Q${index + 1}: ${question}

Candidate Answer:
${answers[index] || "No answer provided"}
`;
  })
  .join("\n")}

Analyze the candidate's answers for the target role.

Evaluate:

1. Technical knowledge
2. Concept understanding
3. Communication
4. Accuracy
5. Clarity
6. Areas of improvement
7. Overall interview performance

Give practical feedback that helps the candidate improve.

Return ONLY valid JSON.

Use exactly this structure:

{
  "overallScore": 75,
  "overallFeedback": "Short overall feedback about the candidate.",
  "strengths": [
    "Good understanding of React",
    "Clear communication"
  ],
  "weaknesses": [
    "Needs stronger understanding of JavaScript concepts",
    "Answers need more detail"
  ],
  "questionFeedback": [
    {
      "question": "Tell me about yourself.",
      "feedback": "The answer is relevant but could be more structured."
    },
    {
      "question": "What are React Hooks?",
      "feedback": "The answer should explain useState and useEffect with examples."
    }
  ],
  "recommendations": [
    "Practice JavaScript fundamentals",
    "Give structured answers",
    "Practice explaining technical concepts with examples"
  ]
}

Rules:

- overallScore must be between 0 and 100.
- All arrays must contain strings except questionFeedback.
- questionFeedback must contain objects with question and feedback.
- Do not invent answers.
- Evaluate only the answers provided.
- Feedback must be specific to the target role.
- Return ONLY JSON.
- No Markdown.
- No backticks.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Interview API Error:", data);

      throw new Error(
        data.error?.message || "Gemini interview request failed"
      );
    }

    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error("Empty Gemini interview response:", data);
      throw new Error("Gemini returned an empty interview response");
    }

    const cleanText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanText);
    } catch (error) {
      console.error("Invalid Gemini interview JSON:");
      console.error(cleanText);

      throw new Error("Gemini returned invalid interview JSON");
    }

    return result;

  } catch (error) {
    console.error("Generate Interview Feedback Error:", error.message);
    throw error;
  }
};