
const https = require("https");

// ======================================================
// GEMINI CONFIGURATION
// ======================================================

const PRIMARY_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.8-flash";

const FALLBACK_MODELS = (
  process.env.GEMINI_FALLBACK_MODELS ||
  [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ].join(",")
)
  .split(",")
  .map((model) => model.trim())
  .filter(
    (model, index, models) =>
      model &&
      model !== PRIMARY_MODEL &&
      models.indexOf(model) === index
  );

const API_HOST = "generativelanguage.googleapis.com";
const API_PATH = "/v1beta/interactions";

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const REQUEST_TIMEOUT = 120000;

const RETRYABLE_STATUSES = [
  408, 429, 500, 502, 503, 504,
];

const RETRYABLE_NETWORK_ERRORS = [
  "ETIMEDOUT",
  "ECONNRESET",
  "ECONNREFUSED",
  "EAI_AGAIN",
  "ENOTFOUND",
];

// ======================================================
// DELAY HELPER
// ======================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======================================================
// RETRY DELAY WITH JITTER
// ======================================================

function getRetryDelay(attempt, retryAfter) {
  if (retryAfter) {
    const seconds = Number(retryAfter);

    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(
        seconds * 1000,
        MAX_RETRY_DELAY
      );
    }

    const date = Date.parse(retryAfter);

    if (!Number.isNaN(date)) {
      return Math.min(
        Math.max(date - Date.now(), 0),
        MAX_RETRY_DELAY
      );
    }
  }

  const exponentialDelay =
    BASE_DELAY * Math.pow(2, attempt);

  const jitter = 0.8 + Math.random() * 0.4;

  return Math.min(
    Math.round(exponentialDelay * jitter),
    MAX_RETRY_DELAY
  );
}

// ======================================================
// ERROR HELPER
// ======================================================

function createError(
  message,
  status = 500,
  retryable = false
) {
  const error = new Error(message);

  error.status = status;
  error.retryable = retryable;

  return error;
}

// ======================================================
// SINGLE GEMINI API REQUEST
// ======================================================

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
            const error = createError(
              "Gemini API returned an invalid response.",
              response.statusCode || 502,
              RETRYABLE_STATUSES.includes(
                response.statusCode
              )
            );

            error.retryAfter =
              response.headers["retry-after"];

            return reject(error);
          }

          const status = response.statusCode || 500;

          // HTTP ERROR HANDLING

          if (status < 200 || status >= 300) {
            const apiMessage =
              data?.error?.message ||
              data?.message ||
              `Gemini API returned HTTP ${status}.`;

            const isAuthError =
              status === 401 || status === 403;

            const isModelUnavailable =
              status === 404 &&
              /model|not found|not supported/i.test(
                apiMessage
              );

            const error = createError(
              apiMessage,
              isAuthError ? 502 : status,
              !isAuthError &&
                (
                  RETRYABLE_STATUSES.includes(status) ||
                  isModelUnavailable
                )
            );

            error.modelUnavailable =
              isModelUnavailable;

            error.retryAfter =
              response.headers["retry-after"];

            return reject(error);
          }

          // INTERACTION FAILURE

          if (
            data.status === "failed" ||
            data.status === "cancelled"
          ) {
            const message =
              data?.error?.message ||
              "Gemini could not generate the system design.";

            const error = createError(
              message,
              502,
              false
            );

            error.modelUnavailable =
              /model|not found|not supported/i.test(message);

            return reject(error);
          }

          // EXTRACT OUTPUT

          const output = extractOutput(data);

          if (!output) {
            return reject(
              createError(
                "Gemini returned no text. Please try again.",
                502,
                false
              )
            );
          }

          resolve(output);
        });
      }
    );

    // REQUEST TIMEOUT

    request.on("timeout", () => {
      const error = createError(
        "Gemini API request timed out.",
        503,
        true
      );

      error.code = "ETIMEDOUT";

      request.destroy(error);
    });

    // NETWORK ERROR

    request.on("error", (error) => {
      if (!error.status) {
        error.status = 503;
      }

      if (error.retryable === undefined) {
        error.retryable =
          RETRYABLE_NETWORK_ERRORS.includes(error.code);
      }

      reject(error);
    });

    request.write(body);
    request.end();
  });
}

// ======================================================
// AUTOMATIC RETRY FOR ONE MODEL
// ======================================================

async function postToGeminiWithRetry(
  payload,
  apiKey,
  model
) {
  let lastError;

  const modelPayload = {
    ...payload,
    model,
  };

  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    try {
      console.log(
        `Gemini model: ${model} | Attempt ${
          attempt + 1
        }/${MAX_RETRIES + 1}`
      );

      const output = await postToGemini(
        modelPayload,
        apiKey
      );

      console.log(
        `Generation successful using ${model}`
      );

      return {
        output,
        model,
      };

    } catch (error) {
      lastError = error;

      // Invalid model: move directly to next model.

      if (error.modelUnavailable) {
        break;
      }

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
        `Retrying ${model} in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  console.error(`Gemini model failed: ${model}`, {
    message: lastError?.message,
    status: lastError?.status,
    code: lastError?.code,
  });

  throw lastError || createError(
    "Gemini request failed.",
    503,
    true
  );
}

// ======================================================
// SMART MULTI-MODEL FALLBACK
// ======================================================

async function generateWithFallback(payload, apiKey) {
  const models = [
    PRIMARY_MODEL,
    ...FALLBACK_MODELS,
  ];

  let lastError;

  console.log(
    `Starting Smart Fallback. Total models: ${models.length}`
  );

  for (let index = 0; index < models.length; index++) {
    const model = models[index];

    try {
      console.log(
        `Trying model ${index + 1}/${models.length}: ${model}`
      );

      const result = await postToGeminiWithRetry(
        payload,
        apiKey,
        model
      );

      console.log(
        `Smart Fallback successful: ${model}`
      );

      return {
        ...result,
        isFallback: index > 0,
      };

    } catch (error) {
      lastError = error;

      console.error(`Model failed: ${model}`, {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      // Stop for authentication and other
      // non-recoverable request errors.

      const canSwitchModel =
        error.retryable === true ||
        error.modelUnavailable === true;

      if (!canSwitchModel) {
        throw error;
      }

      if (index < models.length - 1) {
        console.warn(
          `Switching to fallback model: ${models[index + 1]}`
        );
      }
    }
  }

  console.error(
    "All Gemini fallback models failed."
  );

  const finalError = createError(
    "All Gemini models are temporarily unavailable. Please try again later.",
    lastError?.status === 429 ? 429 : 503,
    false
  );

  finalError.code = lastError?.code;

  throw finalError;
}

// ======================================================
// EXTRACT GEMINI OUTPUT
// ======================================================

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

// ======================================================
// GET TOPIC FROM FRONTEND INPUT
// ======================================================

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

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const nestedTopic = getTopic(value);

      if (nestedTopic) {
        return nestedTopic;
      }
    }
  }

  return "";
}

// ======================================================
// GENERATE SYSTEM DESIGN
// ======================================================

async function generateSystemDesign(input = {}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw createError(
      "GEMINI_API_KEY is missing in backend .env.",
      500
    );
  }

  const topic = getTopic(input);

  if (!topic) {
    throw createError(
      "Please enter a system design topic.",
      400
    );
  }

  if (topic.length > 12000) {
    throw createError(
      "Please keep system design requirements under 12000 characters.",
      400
    );
  }

  const difficulty =
    input &&
    typeof input === "object" &&
    typeof input.difficulty === "string"
      ? input.difficulty
      : "Intermediate";

  // ====================================================
  // SYSTEM DESIGN PROMPT
  // ====================================================

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
    input: prompt,
    store: false,

    generation_config: {
      temperature: 0.4,
    },
  };

  // ====================================================
  // PRIMARY + MULTI-MODEL FALLBACK
  // ====================================================

  const result = await generateWithFallback(
    payload,
    apiKey
  );

  return {
    topic,
    difficulty,
    model: result.model,
    isFallback: result.isFallback,
    design: result.output,
  };
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  generateSystemDesign,
};
