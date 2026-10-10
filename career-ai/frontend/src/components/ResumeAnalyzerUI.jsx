
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ResumeAnalyzer.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ResumeAnalyzer() {
  const fileInputRef = useRef(null);

  const [targetRole, setTargetRole] = useState("MERN Stack Developer");
  const [resume, setResume] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const chooseFile = (file) => {
    setError("");
    setResult(null);

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload your resume in PDF format.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      return;
    }

    setResume(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!targetRole.trim()) {
      setError("Please enter your target job role.");
      return;
    }

    if (!resume) {
      setError("Please upload your resume PDF first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("targetRole", targetRole.trim());

    setLoading(true);

    try {
      const token = localStorage.getItem("careerAI_token");

      const response = await fetch(`${API_URL}/api/resume/analyze`, {
        method: "POST",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "Resume analysis failed. Please try again."
        );
      }

      setResult(data.data || data.result || data);
    } catch (err) {
      console.error("Resume Analyzer Error:", err);
      setError(
        err.message ||
          "Unable to connect to the server. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResume(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getScore = () => {
    const candidates = [
      result?.atsScore,
      result?.score,
      result?.ats_score,
      result?.analysis?.atsScore,
    ];

    const value = candidates.find(
      (item) => item !== undefined && item !== null && !Number.isNaN(Number(item))
    );

    return value === undefined ? null : Math.max(0, Math.min(100, Number(value)));
  };

  const score = result ? getScore() : null;

  return (
    <main className="resume-page">
      <section className="resume-hero">
        <div className="resume-hero-content">
          <div className="resume-eyebrow">
            <span className="resume-live-dot" />
            CAREER AI · SMART CAREER TOOLS
          </div>

          <h1>
            Your next opportunity
            <br />
            starts with a <span>stronger resume.</span>
          </h1>

          <p>
            Get AI-powered resume feedback, improve your ATS compatibility,
            and discover what recruiters want to see.
          </p>

          <div className="resume-hero-points">
            <span>✦ ATS insights</span>
            <span>✦ Skill gap analysis</span>
            <span>✦ Actionable feedback</span>
          </div>
        </div>

        <div className="resume-hero-art" aria-hidden="true">
          <div className="resume-orbit orbit-one" />
          <div className="resume-orbit orbit-two" />

          <div className="resume-document">
            <div className="resume-document-top">
              <span className="resume-document-icon">✦</span>
              <span className="resume-document-label">RESUME</span>
            </div>
            <div className="resume-document-avatar">👨‍💻</div>
            <div className="resume-document-line line-long" />
            <div className="resume-document-line line-medium" />
            <div className="resume-document-section">EXPERIENCE</div>
            <div className="resume-document-line line-long" />
            <div className="resume-document-line line-short" />
            <div className="resume-document-section">SKILLS</div>
            <div className="resume-skill-pills">
              <span />
              <span />
              <span />
            </div>
            <div className="resume-check">✓</div>
          </div>

          <div className="resume-floating-card">
            <span className="resume-floating-icon">✧</span>
            <div>
              <strong>AI powered</strong>
              <small>Resume insights</small>
            </div>
          </div>
        </div>
      </section>

      <section className="resume-workspace">
        <div className="resume-section-heading">
          <div>
            <span className="resume-section-kicker">LET'S GET STARTED</span>
            <h2>Analyze your resume</h2>
            <p>Upload your resume and tell us which role you're targeting.</p>
          </div>
          <span className="resume-secure-pill">♧ Private & secure</span>
        </div>

        <form className="resume-form" onSubmit={handleSubmit}>
          <div className="resume-form-grid">
            <div className="resume-field">
              <label htmlFor="targetRole">
                <span className="resume-label-icon">⌕</span>
                Target job role
              </label>

              <input
                id="targetRole"
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                placeholder="e.g. MERN Stack Developer"
                maxLength={120}
              />

              <small>
                Choose the role you want to apply for.
              </small>
            </div>

            <div className="resume-field">
              <label>
                <span className="resume-label-icon">↥</span>
                Upload your resume
              </label>

              <div
                className={`resume-dropzone ${dragging ? "is-dragging" : ""} ${
                  resume ? "has-file" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  chooseFile(event.dataTransfer.files?.[0]);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="resume-hidden-input"
                  onChange={(event) =>
                    chooseFile(event.target.files?.[0])
                  }
                />

                {resume ? (
                  <>
                    <div className="resume-file-icon">PDF</div>
                    <div className="resume-file-details">
                      <strong>{resume.name}</strong>
                      <span>
                        {(resume.size / (1024 * 1024)).toFixed(2)} MB · Ready
                        to analyze
                      </span>
                    </div>
                    <button
                      className="resume-remove-file"
                      type="button"
                      onClick={() => {
                        setResume(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      aria-label="Remove resume"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <div className="resume-upload-icon">↑</div>
                    <div className="resume-upload-copy">
                      <strong>Drop your PDF resume here</strong>
                      <span>or browse files from your computer</span>
                    </div>
                    <button
                      type="button"
                      className="resume-browse-button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse files
                    </button>
                  </>
                )}
              </div>

              <small>PDF format only · Maximum file size: 5 MB</small>
            </div>
          </div>

          {error && (
            <div className="resume-alert" role="alert">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="resume-form-actions">
            <div className="resume-form-note">
              <span>✦</span>
              AI-powered feedback tailored to your target role
            </div>

            <button
              type="submit"
              className="resume-analyze-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="resume-spinner" />
                  Analyzing resume...
                </>
              ) : (
                <>
                  Analyze my resume <span>↗</span>
                </>
              )}
            </button>
          </div>
        </form>

        {loading && (
          <div className="resume-loading-panel">
            <div className="resume-loading-orb">✦</div>
            <h3>Our AI is reviewing your resume</h3>
            <p>Checking your profile against your target role...</p>
          </div>
        )}

        {result && !loading && (
          <section className="resume-results" aria-live="polite">
            <div className="resume-results-heading">
              <div>
                <span className="resume-section-kicker">YOUR RESULTS</span>
                <h2>Resume analysis report</h2>
                <p>Review the feedback and identify your next improvements.</p>
              </div>
              <button
                type="button"
                className="resume-secondary-button"
                onClick={resetForm}
              >
                Analyze another
              </button>
            </div>

            {score !== null && (
              <div className="resume-score-card">
                <div
                  className="resume-score-ring"
                  style={{ "--score": `${score * 3.6}deg` }}
                >
                  <div className="resume-score-inner">
                    <strong>{score}</strong>
                    <span>out of 100</span>
                  </div>
                </div>
                <div className="resume-score-copy">
                  <span className="resume-section-kicker">ATS COMPATIBILITY</span>
                  <h3>
                    {score >= 80
                      ? "Great progress!"
                      : score >= 60
                      ? "Room to improve"
                      : "Let's strengthen your resume"}
                  </h3>
                  <p>
                    Use the recommendations below to improve your resume.
                    This score is an estimate, not a guarantee of selection.
                  </p>
                </div>
              </div>
            )}

            <div className="resume-report-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {typeof result === "string"
                  ? result
                  : result.report ||
                    result.analysis ||
                    result.feedback ||
                    result.design ||
                    result.message ||
                    JSON.stringify(result, null, 2)}
              </ReactMarkdown>
            </div>
          </section>
        )}
      </section>

      <footer className="resume-footer">
        <span className="resume-footer-mark">✦</span>
        <span>Built for your next career move.</span>
        <span>Career AI · Resume Intelligence</span>
      </footer>
    </main>
  );
}
