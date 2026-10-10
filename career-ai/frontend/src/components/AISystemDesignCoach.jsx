
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./AISystemDesignCoach.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const EXAMPLE_TOPICS = [
  "Design YouTube",
  "Design WhatsApp",
  "Design Instagram",
  "Design a URL shortener like Bitly",
  "Design an online food delivery system",
];

export default function AISystemDesignCoach() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [design, setDesign] = useState("");
  const [generatedTopic, setGeneratedTopic] = useState("");
  const [generatedDifficulty, setGeneratedDifficulty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateDesign = async (event) => {
    if (event) event.preventDefault();

    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      setError("Please enter a system design topic.");
      return;
    }

    setLoading(true);
    setError("");
    setDesign("");
    setGeneratedTopic("");
    setGeneratedDifficulty("");
    setCopied(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/system-design/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problem: cleanTopic,
            topic: cleanTopic,
            difficulty,
          }),
        }
      );

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response. Please try again."
        );
      }

      console.log("System Design Backend Response:", result);

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            `System design request failed (${response.status}).`
        );
      }

      const responseData = result.data || result;

      const generatedDesign =
        responseData.design ||
        responseData.output_text ||
        responseData.answer ||
        responseData.result ||
        "";

      if (
        typeof generatedDesign !== "string" ||
        !generatedDesign.trim()
      ) {
        throw new Error(
          "The backend responded successfully, but no design text was returned."
        );
      }

      setDesign(generatedDesign);
      setGeneratedTopic(responseData.topic || cleanTopic);
      setGeneratedDifficulty(
        responseData.difficulty || difficulty
      );
    } catch (err) {
      console.error("System Design Frontend Error:", err);

      setError(
        err.message ||
          "Unable to generate system design. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyDesign = async () => {
    if (!design) return;

    try {
      await navigator.clipboard.writeText(design);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setError(
        "Unable to copy automatically. Please select and copy the design text."
      );
    }
  };

  const downloadDesign = () => {
    if (!design) return;

    const blob = new Blob([design], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${
      (generatedTopic || topic || "system-design")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "system-design"
    }.md`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="sd-page">
      <section className="sd-hero">
        <div className="sd-hero-icon" aria-hidden="true">
          🏗️
        </div>

        <p className="sd-eyebrow">CAREER AI • AI POWERED LEARNING</p>

        <h1>AI System Design Coach</h1>

        <p className="sd-subtitle">
          Learn to design scalable systems with AI guidance,
          architecture diagrams, APIs, databases, and real-world
          engineering trade-offs.
        </p>

        <div className="sd-feature-list">
          <span>✦ System Architecture</span>
          <span>✦ Database Design</span>
          <span>✦ Scalability</span>
          <span>✦ Interview Preparation</span>
        </div>
      </section>

      <section className="sd-form-card">
        <div className="sd-section-heading">
          <div>
            <h2>Generate a System Design</h2>
            <p>
              Describe the application you want to design.
            </p>
          </div>

          <span className="sd-ai-badge">AI Powered</span>
        </div>

        <form onSubmit={generateDesign}>
          <label className="sd-label" htmlFor="sd-topic">
            System design topic or requirements
          </label>

          <textarea
            id="sd-topic"
            className="sd-topic-input"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Example: Design YouTube for millions of users..."
            rows={4}
            maxLength={12000}
            disabled={loading}
          />

          <div className="sd-input-footer">
            <span>
              Be specific about features, users, and requirements.
            </span>
            <span>{topic.length}/12000</span>
          </div>

          <label className="sd-label" htmlFor="sd-difficulty">
            Difficulty level
          </label>

          <select
            id="sd-difficulty"
            className="sd-difficulty-select"
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
            disabled={loading}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <div className="sd-examples">
            <p>Need an idea? Try one of these:</p>

            <div className="sd-example-list">
              {EXAMPLE_TOPICS.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="sd-example-chip"
                  disabled={loading}
                  onClick={() => {
                    setTopic(example);
                    setError("");
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="sd-error" role="alert">
              <span aria-hidden="true">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            className="sd-generate-button"
            type="submit"
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <span className="sd-spinner" />
                Generating System Design...
              </>
            ) : (
              <>
                <span aria-hidden="true">✦</span>
                Generate System Design
              </>
            )}
          </button>

          <p className="sd-secure-note">
            Powered by your Career AI backend and Gemini API.
          </p>
        </form>
      </section>

      {loading && (
        <section className="sd-loading-card" aria-live="polite">
          <div className="sd-loading-animation">⚙️</div>
          <h3>Designing your system...</h3>
          <p>
            AI is preparing architecture, APIs, database design,
            scalability, and trade-offs. This may take a little time.
          </p>
        </section>
      )}

      {!loading && design && (
        <section className="sd-result-card">
          <div className="sd-result-header">
            <div>
              <span className="sd-result-kicker">
                GENERATED SYSTEM DESIGN
              </span>

              <h2>{generatedTopic || topic}</h2>

              <div className="sd-result-meta">
                <span>
                  Level: {generatedDifficulty || difficulty}
                </span>
                <span>Model: Gemini</span>
              </div>
            </div>

            <div className="sd-result-actions">
              <button
                type="button"
                className="sd-secondary-button"
                onClick={copyDesign}
              >
                {copied ? "✓ Copied" : "📋 Copy"}
              </button>

              <button
                type="button"
                className="sd-secondary-button"
                onClick={downloadDesign}
              >
                ⬇ Download
              </button>
            </div>
          </div>

          <div className="sd-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                pre: ({ children }) => (
                  <pre className="sd-code-block">{children}</pre>
                ),
                table: ({ children }) => (
                  <div className="sd-table-wrapper">
                    <table>{children}</table>
                  </div>
                ),
              }}
            >
              {design}
            </ReactMarkdown>
          </div>

          <div className="sd-result-footer">
            <span>Generated by Career AI</span>

            <button
              type="button"
              className="sd-text-button"
              onClick={() => {
                setDesign("");
                setError("");
                setTopic("");
                setGeneratedTopic("");
                setGeneratedDifficulty("");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              + Create another design
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
