import React, { useState } from "react";

const AISystemDesign = () => {
  const [system, setSystem] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSystemDesign = async () => {
    if (!system.trim()) {
      setError("Please enter a system design problem.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/system-design/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system,
            level,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate system design"
        );
      }

      setResult(data.result);
    } catch (err) {
      console.error("System Design Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600">
            AI System Design
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Practice system design interviews with AI.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

          {/* System Input */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              System Design Problem
            </label>

            <input
              type="text"
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              placeholder="e.g. Design YouTube, Design WhatsApp, Design URL Shortener"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Level */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Difficulty Level
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-5">
              {error}
            </div>
          )}

          {/* Button */}
          <div className="text-center">
            <button
              onClick={generateSystemDesign}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading
                ? "Generating..."
                : "Generate System Design"}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-10 bg-white rounded-2xl shadow-md p-6 md:p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🏗️ AI System Design Solution
            </h2>

            {typeof result === "object" ? (
              <div className="space-y-6">

                {/* Requirements */}
                {result.requirements && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      1. Requirements
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {Array.isArray(result.requirements)
                        ? result.requirements.join("\n")
                        : result.requirements}
                    </p>
                  </section>
                )}

                {/* Architecture */}
                {result.architecture && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      2. Architecture
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {result.architecture}
                    </p>
                  </section>
                )}

                {/* Database */}
                {result.database && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      3. Database Design
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {result.database}
                    </p>
                  </section>
                )}

                {/* API */}
                {result.api && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      4. API Design
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {result.api}
                    </p>
                  </section>
                )}

                {/* Scalability */}
                {result.scalability && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      5. Scalability
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {result.scalability}
                    </p>
                  </section>
                )}

                {/* Tradeoffs */}
                {result.tradeoffs && (
                  <section>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      6. Trade-offs
                    </h3>

                    <p className="text-gray-700 whitespace-pre-wrap">
                      {result.tradeoffs}
                    </p>
                  </section>
                )}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700 leading-7">
                {result}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AISystemDesign;