require("dotenv").config();

const testGemini = async () => {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("API KEY EXISTS:", !!apiKey);
  console.log(
    "API KEY PREFIX:",
    apiKey ? apiKey.substring(0, 8) : "MISSING"
  );

  if (!apiKey) {
    console.log("GEMINI_API_KEY missing");
    return;
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Say hello in one sentence.",
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("\nSTATUS:", response.status);

    console.log(
      "\nRESPONSE:"
    );

    console.log(
      JSON.stringify(data, null, 2)
    );

  } catch (error) {
    console.error(
      "\nREQUEST ERROR:",
      error
    );
  }
};

testGemini();