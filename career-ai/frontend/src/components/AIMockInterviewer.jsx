import React, { useState } from "react";
import VideoInterview from "./VideoInterview";

const AIMockInterviewer = () => {
  // =====================================================
  // BASIC STATE
  // =====================================================

  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [isGeneratingQuestions, setIsGeneratingQuestions] =
    useState(false);

  const [isLoadingFeedback, setIsLoadingFeedback] =
    useState(false);

  const [feedbackResult, setFeedbackResult] =
    useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // VIDEO INTERVIEW STATE
  // =====================================================

  const [showVideoInterview, setShowVideoInterview] =
    useState(false);

  // =====================================================
  // ANSWER CHANGE
  // =====================================================

  const handleAnswerChange = (index, value) => {
    setAnswers((previous) => ({
      ...previous,
      [index]: value,
    }));
  };

  // =====================================================
  // START INTERVIEW
  // =====================================================

  const handleStartInterview = async () => {
    if (!role.trim()) {
      alert("Please enter your target role.");
      return;
    }

    setIsGeneratingQuestions(true);
    setError("");
    setFeedbackResult(null);
    setAnswers({});
    setShowVideoInterview(false);

    try {
      console.log(
        "Generating questions for role:",
        role
      );

      const response = await fetch(
        "http://localhost:5000/api/interview/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Questions API Response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Failed to generate interview questions."
        );
      }

      if (
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error(
          "No interview questions were generated."
        );
      }

      // Make sure every question is a string
      const cleanQuestions = data.questions
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item?.question) {
            return item.question;
          }

          return String(item);
        })
        .filter(Boolean);

      setQuestions(cleanQuestions);
      setStarted(true);

      console.log(
        "Generated Questions:",
        cleanQuestions
      );
    } catch (error) {
      console.error(
        "Question Generation Error:",
        error
      );

      setError(error.message);

      alert(
        error.message ||
          "Failed to generate interview questions."
      );
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // =====================================================
  // OPEN VIDEO INTERVIEW
  // =====================================================

  const handleStartVideoInterview = () => {
    if (!questions.length) {
      alert(
        "Please generate interview questions first."
      );
      return;
    }

    setShowVideoInterview(true);
  };

  // =====================================================
  // END VIDEO INTERVIEW
  // =====================================================

  const handleEndVideoInterview = () => {
    setShowVideoInterview(false);
  };

  // =====================================================
  // RESET INTERVIEW
  // =====================================================

  const handleReset = () => {
    setRole("");
    setStarted(false);
    setQuestions([]);
    setAnswers({});
    setFeedbackResult(null);
    setError("");
    setShowVideoInterview(false);
  };

  // =====================================================
  // GET AI FEEDBACK
  // =====================================================

  const handleGetFeedback = async () => {
    const answeredQuestions = questions.filter(
      (_, index) =>
        answers[index]?.trim()
    );

    if (answeredQuestions.length === 0) {
      alert(
        "Please answer at least one question."
      );
      return;
    }

    setIsLoadingFeedback(true);
    setFeedbackResult(null);
    setError("");

    try {
      console.log(
        "Sending interview answers:",
        answers
      );

      const response = await fetch(
        "http://localhost:5000/api/interview/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: role.trim(),
            questions,
            answers,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "FULL INTERVIEW API RESPONSE:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Feedback generation failed."
        );
      }

      setFeedbackResult(
        data.feedback || {
          overallScore: 0,
          overallFeedback:
            "No feedback received.",
          strengths: [],
          weaknesses: [],
          questionFeedback: [],
          recommendations: [],
        }
      );
    } catch (error) {
      console.error(
        "Interview Feedback Error:",
        error
      );

      setError(error.message);

      setFeedbackResult({
        overallScore: 0,
        overallFeedback: error.message,
        strengths: [],
        weaknesses: [],
        questionFeedback: [],
        recommendations: [],
      });
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  // =====================================================
  // VIDEO INTERVIEW SCREEN
  // =====================================================

  if (showVideoInterview) {
    return (
      <VideoInterview
        role={role}
        questions={questions}
        onEndInterview={
          handleEndVideoInterview
        }
      />
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            AI Mock Interviewer
          </h1>

          <p className="text-slate-600">
            Practice AI-powered technical interviews
            based on your target role.
          </p>

        </div>

        {/* =================================================
            ROLE SECTION
        ================================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target Role
          </label>

          <input
            type="text"
            placeholder="MERN Stack Developer, Data Scientist, AI/ML Engineer..."
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            disabled={
              started ||
              isGeneratingQuestions
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* START BUTTON */}

          {!started && (
            <button
              onClick={
                handleStartInterview
              }
              disabled={
                isGeneratingQuestions
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-400 transition font-semibold"
            >
              {isGeneratingQuestions
                ? "Generating Questions..."
                : "Start Interview"}
            </button>
          )}

          {/* STARTED */}

          {started && (
            <div className="flex items-center justify-between gap-4 flex-wrap">

              <div className="text-green-600 font-semibold">
                Interview started for:{" "}
                {role}
              </div>

              <button
                onClick={handleReset}
                className="bg-slate-600 text-white px-5 py-2 rounded-lg hover:bg-slate-700"
              >
                Reset
              </button>

            </div>
          )}

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* =================================================
            QUESTIONS
        ================================================= */}

        {started &&
          questions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-2">
                Interview Questions
              </h2>

              <p className="text-slate-500 mb-6">
                Questions generated specifically
                for{" "}
                <strong>{role}</strong>
              </p>

              {/* =================================================
                  VIDEO INTERVIEW BUTTON
              ================================================= */}

              <div className="mb-8 p-5 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">

                <div className="flex items-center justify-between gap-5 flex-wrap">

                  <div>

                    <h3 className="text-xl font-bold text-blue-800 mb-2">
                      🎥 Ready for a Real Interview?
                    </h3>

                    <p className="text-sm text-slate-600">
                      Start a video interview with
                      camera, microphone, AI voice
                      questions and speech recognition.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleStartVideoInterview
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition"
                  >
                    🎥 Start Video Interview
                  </button>

                </div>

              </div>

              {/* =================================================
                  NORMAL TEXT QUESTIONS
              ================================================= */}

              <div className="space-y-6">

                {questions.map(
                  (question, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-5"
                    >

                      <h3 className="font-semibold text-lg mb-3">
                        Q{index + 1}.{" "}
                        {question}
                      </h3>

                      <textarea
                        placeholder="Write your answer..."
                        value={
                          answers[index] || ""
                        }
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            e.target.value
                          )
                        }
                        className="w-full border border-slate-300 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>
                  )
                )}

              </div>

              {/* =================================================
                  FEEDBACK BUTTON
              ================================================= */}

              <button
                onClick={
                  handleGetFeedback
                }
                disabled={
                  isLoadingFeedback
                }
                className="mt-8 bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 disabled:bg-green-400 transition font-semibold"
              >
                {isLoadingFeedback
                  ? "Processing Feedback..."
                  : "Get AI Feedback"}
              </button>

              {/* =================================================
                  FEEDBACK RESULT
              ================================================= */}

              {feedbackResult && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">

                  <h3 className="text-2xl font-bold text-blue-800 mb-6">
                    AI Interview Feedback
                  </h3>

                  {/* SCORE */}

                  <div className="bg-white rounded-xl p-5 mb-5">

                    <p className="text-sm text-slate-500">
                      Overall Score
                    </p>

                    <p className="text-4xl font-bold text-blue-600">
                      {
                        feedbackResult.overallScore
                      }
                      /100
                    </p>

                  </div>

                  {/* OVERALL */}

                  <div className="mb-6">

                    <h4 className="text-lg font-bold mb-2">
                      Overall Feedback
                    </h4>

                    <p className="text-slate-700">
                      {
                        feedbackResult.overallFeedback
                      }
                    </p>

                  </div>

                  {/* STRENGTHS */}

                  {feedbackResult
                    .strengths?.length >
                    0 && (
                    <div className="mb-6">

                      <h4 className="text-lg font-bold text-green-700 mb-2">
                        Strengths
                      </h4>

                      <ul className="list-disc pl-6 space-y-1">

                        {feedbackResult.strengths.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

                  {/* WEAKNESSES */}

                  {feedbackResult
                    .weaknesses?.length >
                    0 && (
                    <div className="mb-6">

                      <h4 className="text-lg font-bold text-red-700 mb-2">
                        Weaknesses
                      </h4>

                      <ul className="list-disc pl-6 space-y-1">

                        {feedbackResult.weaknesses.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

                  {/* QUESTION FEEDBACK */}

                  {feedbackResult
                    .questionFeedback
                    ?.length > 0 && (
                    <div className="mb-6">

                      <h4 className="text-lg font-bold mb-4">
                        Question-wise Feedback
                      </h4>

                      <div className="space-y-4">

                        {feedbackResult.questionFeedback.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={index}
                              className="bg-white rounded-xl p-4 border"
                            >

                              <p className="font-semibold mb-2">
                                Q{index + 1}.{" "}
                                {
                                  item.question
                                }
                              </p>

                              <p className="text-slate-600">
                                {
                                  item.feedback
                                }
                              </p>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                  {/* RECOMMENDATIONS */}

                  {feedbackResult
                    .recommendations
                    ?.length > 0 && (
                    <div>

                      <h4 className="text-lg font-bold text-purple-700 mb-2">
                        Recommendations
                      </h4>

                      <ul className="list-disc pl-6 space-y-1">

                        {feedbackResult.recommendations.map(
                          (
                            item,
                            index
                          ) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}

                      </ul>

                    </div>
                  )}

                </div>
              )}

            </div>
          )}

      </div>
    </div>
  );
};

export default AIMockInterviewer;