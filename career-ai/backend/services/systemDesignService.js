
const https = require("https");

const MODEL = "gemini-3.8-flash";
const API_HOST = "generativelanguage.googleapis.com";
const API_PATH = "/v1beta/interactions";

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const REQUEST_TIMEOUT = 120000;

// -------------------------------
// Delay helper
// -------------------------------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// -------------------------------
// Retry delay with jitter
// -------------------------------
function getRetryDelay(attempt, retryAfter) {
  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, 30000);
    }

    const date = Date.parse(retryAfter);

    if (!Number.isNaN(date)) {
      return Math.min(Math.max(date - Date.now(), 0), 30000);
    }
  }

  const exponentialDelay = BASE_DELAY * Math.pow(2, attempt);
  const jitter = 0.8 + Math.random() * 0.4;

  return Math.round(exponentialDelay * jitter);
}

// -------------------------------
// Single Gemini API request
// -------------------------------
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
        timeout: REQUEST_TIMEOUT,
      },
      (response) => {
        let rawData = "";

        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          rawData += chunk;
        });

        response.on("end", () => {
          let data = {};

          try {
            data = JSON.parse(rawData);
          } catch {
            const error = new Error(
              "Gemini API returned an invalid response."
            );

            error.status = response.statusCode || 502;
            error.retryable = [408, 429, 500, 502, 503, 504]
              .includes(response.statusCode);

            error.retryAfter = response.headers["retry-after"];

            return reject(error);
          }

          // HTTP error handling
          if (
            response.statusCode < 200 ||
            response.statusCode >= 300
          ) {
            const status = response.statusCode;

            const error = new Error(
              data?.error?.message ||
              data?.message ||
              `Gemini API returned HTTP ${status}.`
            );

            error.status =
              status === 401 || status === 403 ? 502 : status;

            error.retryable = [
              408,
              429,
              500,
              502,
              503,
              504,
            ].includes(status);

            error.retryAfter = response.headers["retry-after"];

            return reject(error);
          }

          // Gemini interaction failure
          if (
            data.status === "failed" ||
            data.status === "cancelled"
          ) {
            const error = new Error(
              data?.error?.message ||
              "Gemini could not generate the system design."
            );

            error.status = 502;
            error.retryable = false;

            return reject(error);
          }

          const output = extractOutput(data);

          if (!output) {
            const error = new Error(
              "Gemini returned no text. Please try again."
            );

            error.status = 502;
            error.retryable = false;

            return reject(error);
          }

          resolve(output);
        });
      }
    );

    request.on("timeout", () => {
      const error = new Error(
        "Gemini API request timed out. Please try again."
      );

      error.code = "ETIMEDOUT";
      request.destroy(error);
    });

    request.on("error", (error) => {
      if (!error.status) {
        error.status = 503;
      }

      if (error.retryable === undefined) {
        error.retryable = [
          "ETIMEDOUT",
          "ECONNRESET",
          "ECONNREFUSED",
          "EAI_AGAIN",
          "ENOTFOUND",
        ].includes(error.code);
      }

      reject(error);
    });

    request.write(body);
    request.end();
  });
}

// -------------------------------
// Automatic retry mechanism
// -------------------------------
async function postToGeminiWithRetry(payload, apiKey) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Gemini request attempt ${attempt + 1}/${MAX_RETRIES + 1}`
      );

      return await postToGemini(payload, apiKey);
    } catch (error) {
      lastError = error;

      const canRetry =
        error.retryable === true &&
        attempt < MAX_RETRIES;

      if (!canRetry) {
        break;
      }

      const delay = getRetryDelay(
        attempt,
        error.retryAfter
      );

      console.warn(
        `Gemini temporary error (${error.status || error.code}). ` +
        `Retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  console.error("Gemini final failure:", {
    message: lastError.message,
    status: lastError.status,
    code: lastError.code,
  });

  if (
    [408, 429, 500, 502, 503, 504].includes(lastError.status)
  ) {
    const error = new Error(
      lastError.status === 429
        ? "Gemini API rate limit reached. Please try again shortly."
        : "Gemini AI is temporarily unavailable. Automatic retries failed. Please try again after some time."
    );

    error.status = lastError.status;
    throw error;
  }

  throw lastError;
}

// -------------------------------
// Extract Gemini output
// -------------------------------
function extractOutput(data) {
  if (
    typeof data.output_text === "string" &&
    data.output_text.trim()
  ) {
    return data.output_text.trim();
  }

  const texts = [];

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

      if (
        typeof item?.text === "string" &&
        item.text.trim()
      ) {
        texts.push(item.text);
      }

      if (Array.isArray(item?.content)) {
        for (const content of item.content) {
          if (
            content?.type === "text" &&
            typeof content.text === "string"
          ) {
            texts.push(content.text);
          }
        }
      }
    }
  }

  return texts.join("\n").trim();
}

// -------------------------------
// Get topic from frontend input
// -------------------------------
function getTopic(input) {
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

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const nestedTopic = getTopic(value);

      if (nestedTopic) return nestedTopic;
    }
  }

  return "";
}

// -------------------------------
// Generate System Design
// -------------------------------
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
      "Please enter a system design topic."
    );

    error.status = 400;
    throw error;
  }

  if (topic.length > 12000) {
    const error = new Error(
      "Please keep system design requirements under 12000 characters."
    );

    error.status = 400;
    throw error;
  }

  const difficulty =
    input &&
    typeof input === "object" &&
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

  const design = await postToGeminiWithRetry(
    payload,
    apiKey
  );

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
