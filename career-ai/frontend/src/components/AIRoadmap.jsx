import React, { useState } from "react";

const AIRoadmap = () => {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("Beginner");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateRoadmap = async () => {
    if (!role.trim()) {
      setError("Please enter your target job role.");
      return;
    }

    setLoading(true);
    setError("");
    setRoadmap(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/roadmap/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            skills,
            experience,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate roadmap");
      }

      setRoadmap(data.roadmap);
    } catch (err) {
      console.error("Roadmap Error:", err);
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
            AI Career Roadmap
          </h1>

          <p className="text-gray-600 mt-3 text-lg">
            Get a personalized learning roadmap based on your career goal.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

          <div className="grid md:grid-cols-2 gap-6">

            {/* Target Role */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Target Job Role
              </label>

              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. MERN Stack Developer"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Experience Level
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-2">
                Current Skills
              </label>

              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. HTML, CSS, JavaScript, React, Node.js, MongoDB"
                rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Button */}
          <div className="text-center mt-7">
            <button
              onClick={generateRoadmap}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? "Generating Roadmap..." : "Generate AI Roadmap"}
            </button>
          </div>
        </div>

        {/* Roadmap Result */}
        {roadmap && (
          <div className="mt-10 bg-white rounded-2xl shadow-md p-6 md:p-8">

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🚀 Your Personalized Career Roadmap
            </h2>

            {Array.isArray(roadmap) ? (
              <div className="space-y-5">
                {roadmap.map((step, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-600 bg-gray-50 p-5 rounded-r-xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>

                      <h3 className="text-xl font-bold text-gray-800">
                        {step.title || `Step ${index + 1}`}
                      </h3>
                    </div>

                    <p className="text-gray-600 ml-11">
                      {step.description || step}
                    </p>

                    {step.duration && (
                      <p className="text-sm text-blue-600 ml-11 mt-2">
                        ⏱ Duration: {step.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700">
                {JSON.stringify(roadmap, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRoadmap;