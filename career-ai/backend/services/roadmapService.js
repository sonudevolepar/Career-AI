const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const generateLearningRoadmap = async ({
  field,
  duration,
  level,
  dailyTime,
  learningMode,
}) => {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const prompt = `
You are an expert AI learning curriculum designer.

Create a complete and realistic learning roadmap for:

Learning Field: ${field}
Learning Duration: ${duration}
Current Level: ${level}
Daily Study Time: ${dailyTime}
Learning Mode: ${learningMode}

IMPORTANT:

This is NOT a job-role roadmap.

The user wants to LEARN the selected field from the fundamentals
to advanced level.

For example, if the field is "AI / Machine Learning", the roadmap
should logically progress like:

Month 1:
Python fundamentals

Month 2:
NumPy, Pandas and data handling libraries

Month 3:
Mathematics for Machine Learning

Month 4:
Machine Learning

Month 5:
Deep Learning

Month 6:
Advanced AI / projects

However, DO NOT blindly follow this example for other fields.
Create the correct learning sequence for the selected field.

The roadmap must be divided according to the requested duration.

For every month provide:

1. Month title
2. Description
3. 4 weekly sections
4. Topics for every week
5. Practice task for every week
6. Monthly project when appropriate

Also provide:

PROJECTS:
Give practical projects from beginner to advanced.

FREE RESOURCES:
Recommend genuinely useful FREE resources.

For every resource provide:
- name
- type
- description
- URL

Resource types can include:
- Official Documentation
- Free Course
- YouTube
- Practice
- Documentation
- Tutorial

Also provide:

DSA:
Give a DSA practice plan only when it is relevant to the selected
learning field.

FINAL CHECKLIST:
Give important things the learner should complete before considering
the learning roadmap complete.

IMPORTANT RULES:

- Start from prerequisites.
- Do not put advanced topics before fundamentals.
- Keep the roadmap realistic.
- Do not overload one month.
- Match the roadmap with the selected duration.
- Consider the user's daily study time.
- Resources should preferably be free.
- Use known official websites and reliable learning platforms.
- Return ONLY valid JSON.
- Do not use Markdown.
- Do not wrap JSON inside \`\`\`json.

Return exactly this JSON structure:

{
  "summary": "short overview of the roadmap",

  "months": [
    {
      "title": "Month 1 - ...",
      "description": "...",
      "weeks": [
        {
          "focus": "...",
          "topics": [
            "...",
            "...",
            "..."
          ],
          "practice": "..."
        },
        {
          "focus": "...",
          "topics": [
            "...",
            "..."
          ],
          "practice": "..."
        },
        {
          "focus": "...",
          "topics": [
            "...",
            "..."
          ],
          "practice": "..."
        },
        {
          "focus": "...",
          "topics": [
            "...",
            "..."
          ],
          "practice": "..."
        }
      ]
    }
  ],

  "projects": [
    {
      "name": "...",
      "description": "...",
      "technologies": [
        "..."
      ]
    }
  ],

  "resources": [
    {
      "name": "...",
      "type": "...",
      "description": "...",
      "url": "https://..."
    }
  ],

  "dsa": {
    "topics": [
      "..."
    ],
    "practicePlan": "..."
  },

  "finalChecklist": [
    "...",
    "...",
    "..."
  ]
}
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },

        body: JSON.stringify({
          contents: [
            {
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
      }
    );
    const data = await response.json();

    console.log("Gemini Roadmap Status:", response.status);

    if (!response.ok) {
      console.error(
        "Gemini Roadmap Error:",
        JSON.stringify(data, null, 2)
      );

      throw new Error(
        data?.error?.message ||
        "Gemini failed to generate roadmap"
      );
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error(
        "No roadmap response received from Gemini"
      );
    }

    console.log("Gemini Roadmap Response Received");

    // Remove accidental markdown if Gemini adds it
    const cleanText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let roadmap;

    try {
      roadmap = JSON.parse(cleanText);
    } catch (parseError) {
      console.error(
        "Roadmap JSON Parse Error:",
        parseError
      );

      console.error(
        "Gemini Raw Response:",
        cleanText
      );

      throw new Error(
        "AI returned invalid roadmap format"
      );
    }

    return roadmap;

  } catch (error) {
    console.error(
      "generateLearningRoadmap Error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateLearningRoadmap,
};