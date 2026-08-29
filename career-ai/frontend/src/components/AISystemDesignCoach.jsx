import React, { useState } from "react";

const AISystemDesignCoach = () => {
  const [problem, setProblem] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // GENERATE SYSTEM DESIGN
  // ======================================================

  const generateSystemDesign = async () => {
    // Clear previous state
    setError("");
    setResult(null);

    // Frontend validation
    if (!problem.trim()) {
      setError("Please enter a system design problem.");
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // SEND DATA TO BACKEND
      // ==================================================

      const response = await fetch(
        "http://localhost:5000/api/system-design/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            problem: problem.trim(),
            difficulty: difficulty,
          }),
        }
      );

      // Get backend response
      const data = await response.json();

      console.log("System Design Backend Response:", data);

      // ==================================================
      // HANDLE ERROR
      // ==================================================

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate system design"
        );
      }

      // ==================================================
      // SAVE RESULT
      // ==================================================

      setResult(data.data);
    } catch (err) {
      console.error("System Design Error:", err);

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-blue-600">
            AI System Design
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Practice system design interviews with AI.
          </p>

        </div>

        {/* ==================================================
            INPUT CARD
        ================================================== */}

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Problem */}

          <div className="mb-6">

            <label className="block text-gray-800 font-medium mb-2">
              System Design Problem
            </label>

            <input
              type="text"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Design YouTube, Design WhatsApp, Design URL Shortener"
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

          {/* Difficulty */}

          <div className="mb-7">

            <label className="block text-gray-800 font-medium mb-2">
              Difficulty Level
            </label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Generate Button */}

          <div className="flex justify-center">

            <button
              onClick={generateSystemDesign}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-8 py-4 rounded-xl transition"
            >
              {loading
                ? "Generating System Design..."
                : "Generate System Design"}
            </button>

          </div>

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="text-center mt-8 text-blue-600 font-medium">
            AI is designing the system... Please wait.
          </div>
        )}

        {/* ==================================================
            RESULT
        ================================================== */}

        {result && (
          <div className="mt-10 space-y-6">

            {/* Title */}

            <div className="bg-white rounded-2xl shadow-md p-8">

              <h2 className="text-3xl font-bold text-blue-600">
                {result.title}
              </h2>

              <p className="text-gray-700 mt-4">
                {result.problemStatement}
              </p>

            </div>

            {/* Requirements */}

            {result.requirements && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Requirements
                </h2>

                <h3 className="font-semibold text-lg mb-2">
                  Functional Requirements
                </h3>

                <ul className="list-disc pl-6 space-y-2">
                  {result.requirements.functional?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>

                <h3 className="font-semibold text-lg mt-6 mb-2">
                  Non-Functional Requirements
                </h3>

                <ul className="list-disc pl-6 space-y-2">
                  {result.requirements.nonFunctional?.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}
                </ul>

              </div>
            )}

            {/* Capacity Estimation */}

            {result.capacityEstimation && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Capacity Estimation
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>Users:</strong>
                    <p>{result.capacityEstimation.users}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>Requests / Second:</strong>
                    <p>
                      {result.capacityEstimation.requestsPerSecond}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>Storage:</strong>
                    <p>{result.capacityEstimation.storage}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <strong>Bandwidth:</strong>
                    <p>{result.capacityEstimation.bandwidth}</p>
                  </div>

                </div>

              </div>
            )}

            {/* Architecture */}

            {result.architecture && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  System Architecture
                </h2>

                <p className="text-gray-700 mb-6">
                  {result.architecture.overview}
                </p>

                <h3 className="font-semibold text-lg mb-3">
                  Components
                </h3>

                <div className="space-y-3">

                  {result.architecture.components?.map(
                    (component, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >
                        <h4 className="font-bold text-blue-600">
                          {component.name}
                        </h4>

                        <p className="text-gray-600 mt-1">
                          {component.purpose}
                        </p>
                      </div>
                    )
                  )}

                </div>

                <h3 className="font-semibold text-lg mt-7 mb-3">
                  Request Flow
                </h3>

                <ol className="list-decimal pl-6 space-y-2">

                  {result.architecture.requestFlow?.map(
                    (step, index) => (
                      <li key={index}>{step}</li>
                    )
                  )}

                </ol>

              </div>
            )}

            {/* Database */}

            {result.databaseDesign && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Database Design
                </h2>

                <p>
                  <strong>Database:</strong>{" "}
                  {result.databaseDesign.databaseType}
                </p>

                <p className="mt-2 text-gray-600">
                  {result.databaseDesign.reason}
                </p>

                <div className="mt-6 space-y-4">

                  {result.databaseDesign.tablesOrCollections?.map(
                    (table, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        <h3 className="font-bold text-blue-600">
                          {table.name}
                        </h3>

                        <ul className="list-disc pl-6 mt-2">
                          {table.fields?.map(
                            (field, fieldIndex) => (
                              <li key={fieldIndex}>
                                {field}
                              </li>
                            )
                          )}
                        </ul>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* APIs */}

            {result.apis && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  API Design
                </h2>

                <div className="space-y-5">

                  {result.apis.map((api, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-5"
                    >

                      <div className="flex gap-3 items-center">

                        <span className="font-bold text-blue-600">
                          {api.method}
                        </span>

                        <code className="bg-gray-100 px-3 py-1 rounded">
                          {api.endpoint}
                        </code>

                      </div>

                      <p className="mt-3">
                        <strong>Purpose:</strong>{" "}
                        {api.purpose}
                      </p>

                      <p className="mt-2">
                        <strong>Request:</strong>{" "}
                        {api.request}
                      </p>

                      <p className="mt-2">
                        <strong>Response:</strong>{" "}
                        {api.response}
                      </p>

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* Scalability */}

            {result.scalability?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Scalability
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.scalability.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* Reliability */}

            {result.reliability?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Reliability
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.reliability.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* Security */}

            {result.security?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Security
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.security.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* Bottlenecks */}

            {result.bottlenecks?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Bottlenecks & Solutions
                </h2>

                <div className="space-y-4">

                  {result.bottlenecks.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4"
                      >

                        <p>
                          <strong>Problem:</strong>{" "}
                          {item.problem}
                        </p>

                        <p className="mt-2">
                          <strong>Solution:</strong>{" "}
                          {item.solution}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Interview Explanation */}

            {result.interviewExplanation && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  How to Explain in Interview
                </h2>

                <p className="whitespace-pre-line text-gray-700">
                  {result.interviewExplanation}
                </p>

              </div>
            )}

            {/* Follow Up Questions */}

            {result.followUpQuestions?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Interview Follow-up Questions
                </h2>

                <ol className="list-decimal pl-6 space-y-3">

                  {result.followUpQuestions.map(
                    (question, index) => (
                      <li key={index}>{question}</li>
                    )
                  )}

                </ol>

              </div>
            )}

            {/* Key Takeaways */}

            {result.keyTakeaways?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8">

                <h2 className="text-2xl font-bold mb-5">
                  Key Takeaways
                </h2>

                <ul className="list-disc pl-6 space-y-2">

                  {result.keyTakeaways.map(
                    (item, index) => (
                      <li key={index}>{item}</li>
                    )
                  )}

                </ul>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default AISystemDesignCoach;