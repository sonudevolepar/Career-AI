
const https = require("https");

const MODEL = "gemini-3.8-flash";
const API_HOST = "generativelanguage.googleapis.com";
const API_PATH = "/v1beta/interactions";

function postToGemini(payload, apiKey) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);

    const request = https.request(
      {
        hostname: API_HOST,
        path: API_PATH,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
          "Content-Length": Buffer.byteLength(body),
        },
        timeout: 120000,
      },
      (response) => {
        let rawData = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          rawData += chunk;
        });

        response.on("end", () => {
          let data;

          try {
            data = JSON.parse(rawData);
          } catch {
            return reject(
              new Error("Gemini API returned an invalid response.")
            );
          }

          if (
            response.statusCode < 200 ||
            response.statusCode >= 300
          ) {
            const error = new Error(
              data?.error?.message ||
                data?.message ||
                `Gemini API returned HTTP ${response.statusCode}.`
            );

            error.status =
              response.statusCode === 401 ||
              response.statusCode === 403
                ? 502
                : response.statusCode;

            return reject(error);
          }

          if (
            data.status === "failed" ||
            data.status === "cancelled"
          ) {
            return reject(
              new Error(
                data?.error?.message ||
                  "Gemini could not generate the system design."
              )
            );
          }

          const output = extractOutput(data);

          if (!output) {
            return reject(
              new Error(
                "Gemini returned no text. Please try again."
              )
            );
          }

          resolve(output);
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(
        new Error("Gemini API timed out. Please try again.")
      );
    });

    request.on("error", (error) => {
      reject(error);
    });

    request.write(body);
    request.end();
  });
}

function extractOutput(data) {
  // Standard Interactions API text output
  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  const texts = [];

  // Handle output/steps structures returned by API
  const collections = [
    data.output,
    data.steps,
    data.outputs,
  ];

  for (const collection of collections) {
    if (!Array.isArray(collection)) continue;

    for (const item of collection) {
      if (typeof item === "string") {
        texts.push(item);
        continue;
      }

      if (typeof item?.text === "string") {
        texts.push(item.text);
      }

      if (Array.isArray(item?.content)) {
        for (const content of item.content) {
          if (
            typeof content?.text === "string" &&
            (!content.type || content.type === "text")
          ) {
            texts.push(content.text);
          }
        }
      }
    }
  }

  return texts.join("\n").trim();
}

function getTopic(input) {
  // Accept strings directly as well as common frontend field names
  if (typeof input === "string") {
    return input.trim();
  }

  if (!input || typeof input !== "object") {
    return "";
  }

  const fields = [
    "topic",
    "problem",
    "systemName",
    "requirements",
    "description",
    "prompt",
    "systemDesignTopic",
    "systemNameInput",
    "question",
    "message",
    "query",
    "input",
    "title",
    "userInput",
    "designTopic",
  ];

  for (const field of fields) {
    const value = input[field];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    // Some forms send an object containing a topic
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedTopic = getTopic(value);

      if (nestedTopic) return nestedTopic;
    }
  }

  return "";
}

async function generateSystemDesign(input = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    const error = new Error(
      "GEMINI_API_KEY is missing in backend .env."
    );
    error.status = 500;
    throw error;
  }

  const topic = getTopic(input);

  if (!topic) {
    const error = new Error(
      "Please enter a system design topic, for example: Design YouTube, WhatsApp, or an URL shortener."
    );
    error.status = 400;
    throw error;
  }

  if (topic.length > 12000) {
    const error = new Error(
      "Please keep the system design requirements under 12000 characters."
    );
    error.status = 400;
    throw error;
  }

  const difficulty =
    input && typeof input === "object" &&
    typeof input.difficulty === "string"
      ? input.difficulty
      : "Intermediate";

  const prompt = `
You are an expert software architect and system design interviewer.

Design the following system:

${topic}

Difficulty level: ${difficulty}

Create a complete, practical system design using these sections:

1. Problem statement and assumptions
2. Functional requirements
3. Non-functional requirements
4. Expected users, traffic, and scale assumptions
5. High-level architecture
6. Components and responsibilities
7. Mermaid architecture diagram
8. API endpoints with example requests and responses
9. Database schema and relationships
10. Main data flows
11. Caching and load balancing
12. Scalability and database sharding where appropriate
13. Security, authentication, and authorization
14. Reliability, retries, and error handling
15. Monitoring and logging
16. Recommended technology stack with reasons
17. Bottlenecks, trade-offs, and future improvements

Use clear headings, lists, and code examples where helpful.
Explain complex concepts simply.
Use reasonable assumptions when requirements are missing.
Return the answer as readable Markdown.
Do not claim the system was actually deployed or tested.
`;

  const payload = {
    model: MODEL,
    input: prompt,
    store: false,
    generation_config: {
      temperature: 0.4,
    },
  };

  const design = await postToGemini(payload, apiKey);

  return {
    topic,
    difficulty,
    model: MODEL,
    design,
  };
}

module.exports = {
  generateSystemDesign,
};
