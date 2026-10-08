
import React, { useState } from "react";
import "./AIRoadmap.css";

function AIRoadmap() {
  const [field, setField] = useState("");
  const [duration, setDuration] = useState("6 Months");
  const [level, setLevel] = useState("Beginner");
  const [dailyTime, setDailyTime] = useState("2 Hours");
  const [learningMode, setLearningMode] = useState("Self Learning");

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      let data;

      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          "Server returned an invalid response. Please check whether the backend is running."
        );
      }

      console.log("ROADMAP API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to generate learning roadmap."
        );
      }

      if (!data?.roadmap) {
        throw new Error(
          "Roadmap was not received from the server."
        );
      }

      setRoadmap(data.roadmap);
    } catch (err) {
      console.error("Roadmap Error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating the roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetRoadmap = () => {
    setRoadmap(null);
    setError("");
  };

  return (
    <div className="ai-roadmap-page">
      <div className="ai-roadmap-container">
        {/* Header */}
        <div className="roadmap-header">
          <div className="roadmap-header-icon">🤖</div>

          <div>
            <h1>AI Learning Roadmap</h1>
            <p>
              Create a personalized learning roadmap based on your
              goals, level and available study time.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="roadmap-form-card">
          <h2>Build Your Learning Roadmap</h2>

          <div className="roadmap-form-grid">
            {/* Learning Field */}
            <div className="roadmap-form-group">
              <label htmlFor="field">
                Learning Field
              </label>

              <select
                id="field"
                value={field}
                onChange={(e) => setField(e.target.value)}
              >
                <option value="">
                  Select Learning Field
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

                <option value="Blockchain Development">
                  Blockchain Development
                </option>

                <option value="Game Development">
                  Game Development
                </option>
              </select>
            </div>

            {/* Duration */}
            <div className="roadmap-form-group">
              <label htmlFor="duration">
                Learning Duration
              </label>

              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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

            {/* Level */}
            <div className="roadmap-form-group">
              <label htmlFor="level">
                Current Level
              </label>

              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
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

            {/* Daily Time */}
            <div className="roadmap-form-group">
              <label htmlFor="dailyTime">
                Daily Study Time
              </label>

              <select
                id="dailyTime"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
              >
                <option value="1 Hour">
                  1 Hour
                </option>

                <option value="2 Hours">
                  2 Hours
                </option>

                <option value="3 Hours">
                  3 Hours
                </option>

                <option value="4 Hours">
                  4 Hours
                </option>

                <option value="5+ Hours">
                  5+ Hours
                </option>
              </select>
            </div>

            {/* Learning Mode */}
            <div className="roadmap-form-group">
              <label htmlFor="learningMode">
                Learning Mode
              </label>

              <select
                id="learningMode"
                value={learningMode}
                onChange={(e) =>
                  setLearningMode(e.target.value)
                }
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

                <option value="Mixed">
                  Mixed
                </option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="roadmap-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="roadmap-actions">
            <button
              type="button"
              className="generate-roadmap-btn"
              onClick={generateRoadmap}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="roadmap-spinner"></span>
                  Generating Roadmap...
                </>
              ) : (
                <>🚀 Generate Roadmap</>
              )}
            </button>

            {roadmap && (
              <button
                type="button"
                className="reset-roadmap-btn"
                onClick={resetRoadmap}
              >
                🔄 Create New
              </button>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="roadmap-loading-card">
            <div className="roadmap-loading-icon">
              🤖
            </div>

            <h3>AI is creating your roadmap...</h3>

            <p>
              Please wait while Career AI analyzes your
              learning preferences and creates a personalized
              roadmap.
            </p>
          </div>
        )}

        {/* Roadmap Result */}
        {roadmap && !loading && (
          <div className="roadmap-result">
            {/* Summary */}
            <section className="roadmap-section roadmap-summary-section">
              <div className="section-title">
                <span>🎯</span>
                <h2>Roadmap Overview</h2>
              </div>

              <div className="roadmap-summary-card">
                <p>
                  {roadmap.summary ||
                    "Your personalized learning roadmap is ready."}
                </p>

                <div className="roadmap-meta">
                  <div className="meta-item">
                    <span>📚 Field</span>
                    <strong>{field}</strong>
                  </div>

                  <div className="meta-item">
                    <span>⏳ Duration</span>
                    <strong>{duration}</strong>
                  </div>

                  <div className="meta-item">
                    <span>📈 Level</span>
                    <strong>{level}</strong>
                  </div>

                  <div className="meta-item">
                    <span>⏰ Daily Time</span>
                    <strong>{dailyTime}</strong>
                  </div>

                  <div className="meta-item">
                    <span>🎓 Mode</span>
                    <strong>{learningMode}</strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Months */}
            {Array.isArray(roadmap.months) &&
              roadmap.months.length > 0 && (
                <section className="roadmap-section">
                  <div className="section-title">
                    <span>📅</span>
                    <h2>Learning Roadmap</h2>
                  </div>

                  <div className="months-container">
                    {roadmap.months.map(
                      (month, monthIndex) => (
                        <div
                          className="month-card"
                          key={`month-${monthIndex}`}
                        >
                          <div className="month-header">
                            <div className="month-number">
                              {monthIndex + 1}
                            </div>

                            <div>
                              <h3>
                                {month.title ||
                                  `Month ${
                                    monthIndex + 1
                                  }`}
                              </h3>

                              {month.description && (
                                <p>
                                  {month.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Weeks */}
                          {Array.isArray(month.weeks) &&
                            month.weeks.length > 0 && (
                              <div className="weeks-container">
                                {month.weeks.map(
                                  (week, weekIndex) => (
                                    <div
                                      className="week-card"
                                      key={`week-${monthIndex}-${weekIndex}`}
                                    >
                                      <div className="week-header">
                                        <span className="week-badge">
                                          Week{" "}
                                          {weekIndex +
                                            1}
                                        </span>

                                        <h4>
                                          {week.focus ||
                                            "Weekly Learning"}
                                        </h4>
                                      </div>

                                      {/* Topics */}
                                      {Array.isArray(
                                        week.topics
                                      ) &&
                                        week.topics.length >
                                          0 && (
                                          <div className="week-topics">
                                            <h5>
                                              📌 Topics
                                            </h5>

                                            <ul>
                                              {week.topics.map(
                                                (
                                                  topic,
                                                  topicIndex
                                                ) => (
                                                  <li
                                                    key={`topic-${monthIndex}-${weekIndex}-${topicIndex}`}
                                                  >
                                                    {topic}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}

                                      {/* Practice */}
                                      {week.practice && (
                                        <div className="week-practice">
                                          <strong>
                                            💻 Practice:
                                          </strong>

                                          <span>
                                            {
                                              week.practice
                                            }
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {/* Monthly Project */}
                          {month.project && (
                            <div className="monthly-project">
                              <strong>
                                🚀 Monthly Project
                              </strong>

                              <p>{month.project}</p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* Projects */}
            {Array.isArray(roadmap.projects) &&
              roadmap.projects.length > 0 && (
                <section className="roadmap-section">
                  <div className="section-title">
                    <span>🚀</span>
                    <h2>Practical Projects</h2>
                  </div>

                  <div className="projects-grid">
                    {roadmap.projects.map(
                      (project, index) => (
                        <div
                          className="project-card"
                          key={`project-${index}`}
                        >
                          <div className="project-number">
                            {index + 1}
                          </div>

                          <h3>
                            {project.name ||
                              `Project ${index + 1}`}
                          </h3>

                          {project.description && (
                            <p>
                              {project.description}
                            </p>
                          )}

                          {Array.isArray(
                            project.technologies
                          ) &&
                            project.technologies.length >
                              0 && (
                              <div className="technology-list">
                                {project.technologies.map(
                                  (
                                    technology,
                                    techIndex
                                  ) => (
                                    <span
                                      key={`tech-${index}-${techIndex}`}
                                    >
                                      {technology}
                                    </span>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* Resources */}
            {Array.isArray(roadmap.resources) &&
              roadmap.resources.length > 0 && (
                <section className="roadmap-section">
                  <div className="section-title">
                    <span>📚</span>
                    <h2>Free Learning Resources</h2>
                  </div>

                  <div className="resources-grid">
                    {roadmap.resources.map(
                      (resource, index) => (
                        <div
                          className="resource-card"
                          key={`resource-${index}`}
                        >
                          <div className="resource-top">
                            <span className="resource-icon">
                              🔗
                            </span>

                            <span className="resource-type">
                              {resource.type ||
                                "Learning Resource"}
                            </span>
                          </div>

                          <h3>
                            {resource.name ||
                              `Resource ${index + 1}`}
                          </h3>

                          {resource.description && (
                            <p>
                              {resource.description}
                            </p>
                          )}

                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="resource-link"
                            >
                              Open Resource →
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* DSA */}
            {roadmap.dsa &&
              (Array.isArray(roadmap.dsa.topics) ||
                roadmap.dsa.practicePlan) && (
                <section className="roadmap-section">
                  <div className="section-title">
                    <span>🧠</span>
                    <h2>DSA Practice Plan</h2>
                  </div>

                  <div className="dsa-card">
                    {Array.isArray(
                      roadmap.dsa.topics
                    ) &&
                      roadmap.dsa.topics.length > 0 && (
                        <div className="dsa-topics">
                          <h3>Important Topics</h3>

                          <div className="dsa-topic-list">
                            {roadmap.dsa.topics.map(
                              (topic, index) => (
                                <span
                                  key={`dsa-${index}`}
                                >
                                  {topic}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {roadmap.dsa.practicePlan && (
                      <div className="dsa-practice">
                        <h3>Practice Plan</h3>

                        <p>
                          {roadmap.dsa.practicePlan}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}

            {/* Final Checklist */}
            {Array.isArray(
              roadmap.finalChecklist
            ) &&
              roadmap.finalChecklist.length > 0 && (
                <section className="roadmap-section">
                  <div className="section-title">
                    <span>✅</span>
                    <h2>Final Checklist</h2>
                  </div>

                  <div className="checklist-card">
                    {roadmap.finalChecklist.map(
                      (item, index) => (
                        <div
                          className="checklist-item"
                          key={`check-${index}`}
                        >
                          <span className="check-icon">
                            ✓
                          </span>

                          <span>{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}
          </div>
        )}

        {/* Empty State */}
        {!roadmap && !loading && !error && (
          <div className="roadmap-empty-state">
            <div className="empty-icon">🗺️</div>

            <h3>Your Learning Roadmap</h3>

            <p>
              Select your learning field and preferences
              above, then click{" "}
              <strong>Generate Roadmap</strong> to create
              your personalized AI learning plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRoadmap;

