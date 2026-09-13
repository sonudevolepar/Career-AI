import React, { useState } from "react";
import VideoInterview from "./VideoInterview";
import "./AIMockInterviewer.css";

const JOB_ROLES = [
  "MERN Stack Developer",
  "Java Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Python Developer",
  "Data Analyst",
  "Data Scientist",
  "AI/ML Engineer",
  "Software Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "QA Engineer",
  "Cyber Security Engineer",
  "Android Developer",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard", "Mixed"];
const QUESTION_COUNTS = [5, 10, 15];

function AIMockInterviewer() {
  const [role, setRole] = useState("MERN Stack Developer");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const [interviewMode, setInterviewMode] = useState("text");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    setQuestions([]);
    setAnswers({});
    setFeedback(null);
    setCurrentQuestion(0);

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            difficulty,
            questionCount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate interview questions."
        );
      }

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid questions received from server.");
      }

      setQuestions(data.questions);
      setInterviewStarted(true);
    } catch (err) {
      console.error("Question Generation Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setQuestions([]);
    setAnswers({});
    setFeedback(null);
    setError("");
    setCurrentQuestion(0);
    setInterviewStarted(false);
    setInterviewMode("text");
  };

  const handleGetFeedback = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            difficulty,
            questions,
            answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate feedback.");
      }

      setFeedback(data);
    } catch (err) {
      console.error("Feedback Error:", err);
      setError(err.message || "Failed to generate AI feedback.");
    } finally {
      setLoading(false);
    }
  };

  // VIDEO INTERVIEW SCREEN
  if (
    interviewStarted &&
    interviewMode === "video" &&
    questions.length > 0
  ) {
    return (
      <div className="mock-interview-page">
        <div className="video-mode-header">
          <div>
            <h2>🎥 AI Video Interview</h2>
            <p>
              {role} • {difficulty} Level
            </p>
          </div>

          <button className="reset-btn" onClick={handleReset}>
            ← Back
          </button>
        </div>

        <VideoInterview
          role={role}
          difficulty={difficulty}
          questions={questions}
          onComplete={(result) => {
            setFeedback(result);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mock-interview-page">
      <div className="mock-interview-container">

        {/* HEADER */}
        <div className="page-header">
          <div className="header-icon">🤖</div>

          <div>
            <h1>AI Mock Interviewer</h1>
            <p>
              Practice real interview questions with an AI interviewer.
            </p>
          </div>

          {(questions.length > 0 || interviewStarted) && (
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            <span>⚠️</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* SETUP */}
        {questions.length === 0 && !loading && (
          <div className="setup-card">

            <div className="setup-title">
              <h2>Start Your AI Interview</h2>
              <p>
                Select your job role, difficulty and interview mode.
              </p>
            </div>

            {/* ROLE */}
            <div className="form-group">
              <label>💼 Target Job Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {JOB_ROLES.map((jobRole) => (
                  <option key={jobRole} value={jobRole}>
                    {jobRole}
                  </option>
                ))}
              </select>
            </div>

            {/* DIFFICULTY */}
            <div className="form-group">
              <label>🎯 Interview Difficulty</label>

              <div className="option-grid">
                {DIFFICULTIES.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`option-card ${
                      difficulty === level ? "selected" : ""
                    }`}
                    onClick={() => setDifficulty(level)}
                  >
                    <span>
                      {level === "Easy" && "🟢"}
                      {level === "Medium" && "🟡"}
                      {level === "Hard" && "🔴"}
                      {level === "Mixed" && "🎲"}
                    </span>

                    <strong>{level}</strong>

                    <small>
                      {level === "Easy" && "Basic concepts"}
                      {level === "Medium" && "Interview level"}
                      {level === "Hard" && "Advanced concepts"}
                      {level === "Mixed" && "Easy + Medium + Hard"}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            {/* QUESTION COUNT */}
            <div className="form-group">
              <label>📝 Number of Questions</label>

              <div className="count-options">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`count-btn ${
                      questionCount === count ? "selected" : ""
                    }`}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* INTERVIEW MODE */}
            <div className="form-group">
              <label>🎤 Interview Mode</label>

              <div className="mode-grid">

                <button
                  type="button"
                  className={`mode-card ${
                    interviewMode === "text" ? "selected" : ""
                  }`}
                  onClick={() => setInterviewMode("text")}
                >
                  <div className="mode-icon">💬</div>

                  <div>
                    <strong>Text Interview</strong>
                    <p>
                      Answer questions by typing your answers.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  className={`mode-card ${
                    interviewMode === "video" ? "selected" : ""
                  }`}
                  onClick={() => setInterviewMode("video")}
                >
                  <div className="mode-icon">🎥</div>

                  <div>
                    <strong>Video Interview</strong>
                    <p>
                      Camera, microphone and AI voice interview.
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* SELECTED SUMMARY */}
            <div className="selection-summary">
              <div>
                <span>Role</span>
                <strong>{role}</strong>
              </div>

              <div>
                <span>Difficulty</span>
                <strong>{difficulty}</strong>
              </div>

              <div>
                <span>Questions</span>
                <strong>{questionCount}</strong>
              </div>

              <div>
                <span>Mode</span>
                <strong>
                  {interviewMode === "video"
                    ? "🎥 Video"
                    : "💬 Text"}
                </strong>
              </div>
            </div>

            {/* START */}
            <button
              className="start-interview-btn"
              onClick={handleStartInterview}
            >
              🚀 Start Interview
            </button>

          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading-card">
            <div className="loader"></div>

            <h2>🤖 AI is preparing your interview...</h2>

            <p>
              Generating {difficulty.toLowerCase()} level questions
              for {role}.
            </p>
          </div>
        )}

        {/* QUESTIONS */}
        {questions.length > 0 && interviewMode === "text" && (
          <div className="questions-section">

            <div className="interview-topbar">
              <div>
                <span className="small-label">Target Role</span>
                <h2>{role}</h2>
              </div>

              <div className="interview-info">
                <span>{difficulty}</span>
                <span>{questions.length} Questions</span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-info">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>

                <span>
                  {Math.round(
                    ((currentQuestion + 1) / questions.length) * 100
                  )}
                  %
                </span>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* CURRENT QUESTION */}
            <div className="question-card">

              <div className="question-number">
                Q{currentQuestion + 1}
              </div>

              <h3>
                {typeof questions[currentQuestion] === "string"
                  ? questions[currentQuestion]
                  : questions[currentQuestion]?.question}
              </h3>

              <textarea
                value={answers[currentQuestion] || ""}
                onChange={(e) =>
                  handleAnswerChange(
                    currentQuestion,
                    e.target.value
                  )
                }
                placeholder="Type your answer here..."
              />

              <div className="answer-count">
                {(answers[currentQuestion] || "").length} characters
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="question-navigation">

              <button
                className="nav-btn"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                ← Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  className="nav-btn primary"
                  onClick={handleNext}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="feedback-btn"
                  onClick={handleGetFeedback}
                >
                  ✨ Get AI Feedback
                </button>
              )}

            </div>

            {/* QUESTION LIST */}
            <div className="all-questions">
              <h3>Interview Questions</h3>

              <div className="question-list">
                {questions.map((question, index) => (
                  <button
                    key={index}
                    className={`question-list-item ${
                      currentQuestion === index ? "active" : ""
                    } ${
                      answers[index] ? "answered" : ""
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    <span>Q{index + 1}</span>

                    <p>
                      {typeof question === "string"
                        ? question
                        : question?.question}
                    </p>

                    {answers[index] && <b>✓</b>}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* FEEDBACK */}
        {feedback && (
          <div className="feedback-section">

            <div className="feedback-header">
              <span>🎯</span>
              <div>
                <h2>AI Interview Feedback</h2>
                <p>Your interview has been evaluated.</p>
              </div>
            </div>

            <div className="feedback-content">
              {typeof feedback === "string" ? (
                <p>{feedback}</p>
              ) : (
                <>
                  {feedback.score && (
                    <div className="score-card">
                      <span>Overall Score</span>
                      <strong>{feedback.score}/100</strong>
                    </div>
                  )}

                  {feedback.feedback && (
                    <div className="feedback-text">
                      <h3>AI Feedback</h3>
                      <p>{feedback.feedback}</p>
                    </div>
                  )}

                  {feedback.strengths && (
                    <div className="feedback-list">
                      <h3>💪 Strengths</h3>

                      {feedback.strengths.map((item, index) => (
                        <div key={index}>✓ {item}</div>
                      ))}
                    </div>
                  )}

                  {feedback.improvements && (
                    <div className="feedback-list">
                      <h3>📈 Areas to Improve</h3>

                      {feedback.improvements.map((item, index) => (
                        <div key={index}>• {item}</div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              className="start-again-btn"
              onClick={handleReset}
            >
              🔄 Start New Interview
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default AIMockInterviewer;