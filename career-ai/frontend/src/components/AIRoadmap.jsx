import React, { useState } from "react";

const AIRoadmap = () => {
  // ================================
  // FORM STATES
  // ================================

  const [field, setField] = useState("");
  const [duration, setDuration] = useState("6 Months");
  const [level, setLevel] = useState("Beginner");
  const [dailyTime, setDailyTime] = useState("2 Hours");
  const [learningMode, setLearningMode] = useState("Self Learning");

  // ================================
  // ROADMAP STATES
  // ================================

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================================
  // GENERATE ROADMAP
  // ================================

  const generateRoadmap = async () => {
    if (!field) {
      setError("Please select a learning field.");
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
            field,
            duration,
            level,
            dailyTime,
            learningMode,
          }),
        }
      );

      const data = await response.json();

      console.log("ROADMAP API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate roadmap"
        );
      }

      setRoadmap(data.roadmap);

    } catch (err) {
      console.error("Roadmap Error:", err);

      setError(
        err.message ||
          "Something went wrong while generating roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // RESET
  // ================================

  const resetRoadmap = () => {
    setRoadmap(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="max-w-7xl mx-auto">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="text-center mb-10">

          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            AI Powered Learning Planner
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
            AI Learning Roadmap
          </h1>

          <p className="text-slate-600 mt-4 text-lg max-w-2xl mx-auto">
            Select a field and get a complete month-by-month
            learning roadmap with topics, projects and free
            learning resources.
          </p>

        </div>

        {/* =====================================
            INPUT SECTION
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            🎯 Build Your Learning Plan
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* FIELD */}

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Select Learning Field
              </label>

              <select
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  Select a field
                </option>

                <option value="AI / Machine Learning">
                  AI / Machine Learning
                </option>

                <option value="Data Science">
                  Data Science
                </option>

                <option value="Data Analytics">
                  Data Analytics
                </option>

                <option value="Web Development">
                  Web Development
                </option>

                <option value="Frontend Development">
                  Frontend Development
                </option>

                <option value="Backend Development">
                  Backend Development
                </option>

                <option value="Full Stack Development">
                  Full Stack Development
                </option>

                <option value="Software Engineering">
                  Software Engineering
                </option>

                <option value="Cyber Security">
                  Cyber Security
                </option>

                <option value="Cloud Computing">
                  Cloud Computing
                </option>

                <option value="DevOps">
                  DevOps
                </option>

                <option value="Android Development">
                  Android Development
                </option>

                <option value="iOS Development">
                  iOS Development
                </option>

                <option value="Blockchain">
                  Blockchain
                </option>

                <option value="Game Development">
                  Game Development
                </option>

              </select>
            </div>

            {/* DURATION */}

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Learning Duration
              </label>

              <select
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="3 Months">
                  3 Months
                </option>

                <option value="6 Months">
                  6 Months
                </option>

                <option value="9 Months">
                  9 Months
                </option>

                <option value="12 Months">
                  12 Months
                </option>

              </select>
            </div>

            {/* LEVEL */}

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Current Level
              </label>

              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>
            </div>

            {/* DAILY TIME */}

            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Daily Study Time
              </label>

              <select
                value={dailyTime}
                onChange={(e) =>
                  setDailyTime(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="1 Hour">
                  1 Hour / Day
                </option>

                <option value="2 Hours">
                  2 Hours / Day
                </option>

                <option value="3 Hours">
                  3 Hours / Day
                </option>

                <option value="4 Hours">
                  4 Hours / Day
                </option>

                <option value="5+ Hours">
                  5+ Hours / Day
                </option>

              </select>
            </div>

            {/* LEARNING MODE */}

            <div className="md:col-span-2">

              <label className="block font-semibold text-slate-700 mb-2">
                Learning Mode
              </label>

              <select
                value={learningMode}
                onChange={(e) =>
                  setLearningMode(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="Self Learning">
                  Self Learning
                </option>

                <option value="Video Courses">
                  Video Courses
                </option>

                <option value="Documentation">
                  Documentation
                </option>

                <option value="Mixed Learning">
                  Mixed Learning
                </option>

              </select>

            </div>

          </div>

          {/* =====================================
              ERROR
          ===================================== */}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* =====================================
              BUTTONS
          ===================================== */}

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

            <button
              onClick={generateRoadmap}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition disabled:opacity-60"
            >

              {loading
                ? "🤖 Creating Your Roadmap..."
                : "🚀 Generate AI Roadmap"}

            </button>

            {roadmap && (
              <button
                onClick={resetRoadmap}
                className="border border-slate-300 text-slate-700 font-semibold px-8 py-3 rounded-xl hover:bg-slate-100 transition"
              >
                Create New Roadmap
              </button>
            )}

          </div>

        </div>

        {/* =====================================
            ROADMAP RESULT
        ===================================== */}

        {roadmap && (

          <div className="mt-10 space-y-8">

            {/* TITLE */}

            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <p className="text-blue-600 font-semibold">
                    Your Personalized Learning Plan
                  </p>

                  <h2 className="text-3xl font-bold text-slate-800 mt-2">
                    🚀 {field} Roadmap
                  </h2>

                </div>

                <div className="bg-blue-50 px-5 py-3 rounded-xl">

                  <p className="text-sm text-slate-500">
                    Duration
                  </p>

                  <p className="font-bold text-blue-600">
                    {duration}
                  </p>

                </div>

              </div>

              {roadmap.summary && (
                <p className="text-slate-600 mt-5 leading-7">
                  {roadmap.summary}
                </p>
              )}

            </div>

            {/* =====================================
                MONTHLY ROADMAP
            ===================================== */}

            {roadmap.months && (
              <div className="space-y-6">

                {roadmap.months.map(
                  (month, monthIndex) => (

                    <div
                      key={monthIndex}
                      className="bg-white rounded-2xl shadow-md p-6 md:p-8"
                    >

                      {/* MONTH HEADER */}

                      <div className="flex items-center gap-4 mb-6">

                        <div className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">
                          {monthIndex + 1}
                        </div>

                        <div>

                          <p className="text-sm text-blue-600 font-semibold">
                            MONTH {monthIndex + 1}
                          </p>

                          <h3 className="text-2xl font-bold text-slate-800">
                            {month.title}
                          </h3>

                        </div>

                      </div>

                      {/* MONTH DESCRIPTION */}

                      {month.description && (
                        <p className="text-slate-600 mb-6">
                          {month.description}
                        </p>
                      )}

                      {/* WEEKS */}

                      {month.weeks && (
                        <div className="grid md:grid-cols-2 gap-5">

                          {month.weeks.map(
                            (week, weekIndex) => (

                              <div
                                key={weekIndex}
                                className="border border-slate-200 rounded-xl p-5"
                              >

                                <h4 className="font-bold text-lg text-slate-800">
                                  Week {weekIndex + 1}
                                </h4>

                                {week.focus && (
                                  <p className="text-blue-600 font-medium mt-2">
                                    {week.focus}
                                  </p>
                                )}

                                {week.topics && (
                                  <ul className="list-disc ml-5 mt-3 space-y-1 text-slate-600">

                                    {week.topics.map(
                                      (topic, index) => (
                                        <li key={index}>
                                          {topic}
                                        </li>
                                      )
                                    )}

                                  </ul>
                                )}

                                {week.practice && (
                                  <div className="mt-4 bg-slate-50 p-3 rounded-lg">

                                    <p className="font-semibold text-slate-700">
                                      💻 Practice
                                    </p>

                                    <p className="text-sm text-slate-600 mt-1">
                                      {week.practice}
                                    </p>

                                  </div>
                                )}

                              </div>

                            )
                          )}

                        </div>
                      )}

                    </div>

                  )
                )}

              </div>
            )}

            {/* =====================================
                PROJECTS
            ===================================== */}

            {roadmap.projects && (

              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

                <h3 className="text-2xl font-bold text-slate-800 mb-6">
                  💻 Projects to Build
                </h3>

                <div className="grid md:grid-cols-2 gap-5">

                  {roadmap.projects.map(
                    (project, index) => (

                      <div
                        key={index}
                        className="border border-slate-200 rounded-xl p-5"
                      >

                        <h4 className="text-lg font-bold text-slate-800">
                          {project.name}
                        </h4>

                        <p className="text-slate-600 mt-2">
                          {project.description}
                        </p>

                        {project.technologies && (
                          <div className="flex flex-wrap gap-2 mt-4">

                            {project.technologies.map(
                              (tech, techIndex) => (

                                <span
                                  key={techIndex}
                                  className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                                >
                                  {tech}
                                </span>

                              )
                            )}

                          </div>
                        )}

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* =====================================
                FREE RESOURCES
            ===================================== */}

            {roadmap.resources && (

              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  📚 Free Learning Resources
                </h3>

                <p className="text-slate-600 mb-6">
                  Learn from free online courses, documentation
                  and practice platforms.
                </p>

                <div className="grid md:grid-cols-2 gap-5">

                  {roadmap.resources.map(
                    (resource, index) => (

                      <div
                        key={index}
                        className="border border-slate-200 rounded-xl p-5"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>

                            <h4 className="font-bold text-lg text-slate-800">
                              {resource.name}
                            </h4>

                            {resource.type && (
                              <p className="text-sm text-blue-600 mt-1">
                                {resource.type}
                              </p>
                            )}

                            {resource.description && (
                              <p className="text-slate-600 mt-2 text-sm">
                                {resource.description}
                              </p>
                            )}

                          </div>

                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                            >
                              Open
                            </a>
                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

            {/* =====================================
                DSA
            ===================================== */}

            {roadmap.dsa && (

              <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">

                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  🧠 DSA Practice
                </h3>

                {roadmap.dsa.topics && (

                  <div className="flex flex-wrap gap-3">

                    {roadmap.dsa.topics.map(
                      (topic, index) => (

                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full"
                        >
                          {topic}
                        </span>

                      )
                    )}

                  </div>

                )}

                {roadmap.dsa.practicePlan && (
                  <p className="text-slate-600 mt-5">
                    <strong>Practice Plan:</strong>{" "}
                    {roadmap.dsa.practicePlan}
                  </p>
                )}

              </div>

            )}

            {/* =====================================
                FINAL CHECKLIST
            ===================================== */}

            {roadmap.finalChecklist && (

              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8">

                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  ✅ Final Learning Checklist
                </h3>

                <div className="space-y-3">

                  {roadmap.finalChecklist.map(
                    (item, index) => (

                      <div
                        key={index}
                        className="flex gap-3 items-start"
                      >

                        <span className="text-green-600 font-bold">
                          ✓
                        </span>

                        <p className="text-slate-700">
                          {item}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
};

export default AIRoadmap;