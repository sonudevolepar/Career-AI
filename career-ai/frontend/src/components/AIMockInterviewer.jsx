import React, { useState } from "react";

const AIMockInterviewer = () => {
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);

  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  const questions = [
    "Tell me about yourself.",
    "What are React Hooks?",
    "Explain Virtual DOM.",
    "Difference between let, const and var?",
    "What is Node.js?",
  ];

  // ================================================
  // ANSWER CHANGE
  // ================================================

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // ================================================
  // START INTERVIEW
  // ================================================

  const handleStartInterview = () => {
    if (!role.trim()) {
      alert("Please enter your target role.");
      return;
    }

    setStarted(true);
    setFeedbackResult(null);
  };

  // ================================================
  // GET AI FEEDBACK
  // ================================================

  const handleGetFeedback = async () => {
    const answeredQuestions = questions.filter(
      (_, index) => answers[index]?.trim()
    );

    if (answeredQuestions.length === 0) {
      alert("Please answer at least one question.");
      return;
    }

    setIsLoading(true);
    setFeedbackResult(null);

    try {
      console.log("Sending answers:", answers);

      const response = await fetch(
        "http://localhost:5000/api/interview/feedback",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            role: role,
            questions: questions,
            answers: answers,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "FULL INTERVIEW API RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Feedback generation failed."
        );
      }

      if (data.success) {
        /*
         * IMPORTANT:
         *
         * Backend response:
         *
         * {
         *   success: true,
         *   feedback: {
         *     overallScore: 0,
         *     overallFeedback: "...",
         *     strengths: [],
         *     weaknesses: [],
         *     questionFeedback: [],
         *     recommendations: []
         *   }
         * }
         */

        setFeedbackResult(data.feedback);

      } else {
        throw new Error(
          data.message ||
            data.error ||
            "Feedback generation failed."
        );
      }

    } catch (error) {
      console.error(
        "Interview Feedback Error:",
        error
      );

      setFeedbackResult({
        error: error.message,
      });

    } finally {
      setIsLoading(false);
    }
  };

  // ================================================
  // RESET INTERVIEW
  // ================================================

  const handleResetInterview = () => {
    setRole("");
    setStarted(false);
    setAnswers({});
    setFeedbackResult(null);
    setIsLoading(false);
  };

  // ================================================
  // UI
  // ================================================

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      <div className="max-w-5xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            AI Mock Interviewer
          </h1>

          <p className="text-slate-600">
            Practice AI-powered technical interviews.
          </p>

        </div>


        {/* ========================================= */}
        {/* ROLE SECTION */}
        {/* ========================================= */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target Role
          </label>

          <input
            type="text"
            placeholder="Frontend Developer, MERN Developer..."
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            disabled={started}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!started && (
            <button
              onClick={handleStartInterview}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Start Interview
            </button>
          )}

          {started && (
            <div className="flex items-center justify-between">

              <div className="text-green-600 font-semibold">
                Interview started for: {role}
              </div>

              <button
                onClick={handleResetInterview}
                className="bg-slate-600 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition"
              >
                Reset
              </button>

            </div>
          )}

        </div>


        {/* ========================================= */}
        {/* QUESTIONS */}
        {/* ========================================= */}

        {started && (

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Interview Questions
            </h2>


            <div className="space-y-6">

              {questions.map(
                (question, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5"
                  >

                    <h3 className="font-semibold text-lg mb-3">
                      Q{index + 1}. {question}
                    </h3>


                    <textarea
                      placeholder="Write your answer..."
                      value={answers[index] || ""}
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


            {/* ===================================== */}
            {/* FEEDBACK BUTTON */}
            {/* ===================================== */}

            <button
              onClick={handleGetFeedback}
              disabled={isLoading}
              className="mt-8 bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 disabled:bg-green-400 transition"
            >
              {isLoading
                ? "Processing Feedback..."
                : "Get AI Feedback"}
            </button>


            {/* ===================================== */}
            {/* AI FEEDBACK */}
            {/* ===================================== */}

            {feedbackResult && (

              <div className="mt-8">

                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {feedbackResult.error ? (

                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">

                    <h3 className="text-xl font-bold text-red-700 mb-2">
                      Error
                    </h3>

                    <p className="text-red-600">
                      {feedbackResult.error}
                    </p>

                  </div>

                ) : (

                  <div className="space-y-6">

                    {/* ============================= */}
                    {/* SCORE */}
                    {/* ============================= */}

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">

                      <div className="flex items-center justify-between">

                        <div>

                          <h3 className="text-2xl font-bold text-blue-800">
                            AI Interview Feedback
                          </h3>

                          <p className="text-slate-600 mt-1">
                            Overall performance evaluation
                          </p>

                        </div>


                        <div className="text-center">

                          <div className="text-4xl font-bold text-blue-600">
                            {feedbackResult.overallScore}
                          </div>

                          <div className="text-sm text-slate-500">
                            / 100
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* ============================= */}
                    {/* OVERALL FEEDBACK */}
                    {/* ============================= */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                      <h3 className="text-xl font-bold text-slate-800 mb-3">
                        Overall Feedback
                      </h3>

                      <p className="text-slate-700 leading-relaxed">
                        {feedbackResult.overallFeedback}
                      </p>

                    </div>


                    {/* ============================= */}
                    {/* STRENGTHS */}
                    {/* ============================= */}

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                      <h3 className="text-xl font-bold text-green-800 mb-4">
                        Strengths
                      </h3>

                      {Array.isArray(
                        feedbackResult.strengths
                      ) &&
                      feedbackResult.strengths.length > 0 ? (

                        <ul className="space-y-3">

                          {feedbackResult.strengths.map(
                            (strength, index) => (

                              <li
                                key={index}
                                className="flex gap-3 text-slate-700"
                              >

                                <span className="text-green-600 font-bold">
                                  ✓
                                </span>

                                <span>
                                  {strength}
                                </span>

                              </li>

                            )
                          )}

                        </ul>

                      ) : (

                        <p className="text-slate-500">
                          No strengths provided.
                        </p>

                      )}

                    </div>


                    {/* ============================= */}
                    {/* WEAKNESSES */}
                    {/* ============================= */}

                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                      <h3 className="text-xl font-bold text-red-800 mb-4">
                        Areas to Improve
                      </h3>

                      {Array.isArray(
                        feedbackResult.weaknesses
                      ) &&
                      feedbackResult.weaknesses.length > 0 ? (

                        <ul className="space-y-3">

                          {feedbackResult.weaknesses.map(
                            (weakness, index) => (

                              <li
                                key={index}
                                className="flex gap-3 text-slate-700"
                              >

                                <span className="text-red-600 font-bold">
                                  !
                                </span>

                                <span>
                                  {weakness}
                                </span>

                              </li>

                            )
                          )}

                        </ul>

                      ) : (

                        <p className="text-slate-500">
                          No weaknesses provided.
                        </p>

                      )}

                    </div>


                    {/* ============================= */}
                    {/* QUESTION FEEDBACK */}
                    {/* ============================= */}

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

                      <h3 className="text-xl font-bold text-slate-800 mb-5">
                        Question-wise Feedback
                      </h3>


                      <div className="space-y-5">

                        {Array.isArray(
                          feedbackResult.questionFeedback
                        ) &&
                        feedbackResult.questionFeedback.length > 0 ? (

                          feedbackResult.questionFeedback.map(
                            (item, index) => (

                              <div
                                key={index}
                                className="border border-slate-200 rounded-xl p-5"
                              >

                                <h4 className="font-semibold text-lg text-slate-800 mb-3">
                                  Q{index + 1}.{" "}
                                  {item.question}
                                </h4>

                                <p className="text-slate-600 leading-relaxed">
                                  {item.feedback}
                                </p>

                              </div>

                            )
                          )

                        ) : (

                          <p className="text-slate-500">
                            No question feedback available.
                          </p>

                        )}

                      </div>

                    </div>


                    {/* ============================= */}
                    {/* RECOMMENDATIONS */}
                    {/* ============================= */}

                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">

                      <h3 className="text-xl font-bold text-purple-800 mb-4">
                        Recommendations
                      </h3>

                      {Array.isArray(
                        feedbackResult.recommendations
                      ) &&
                      feedbackResult.recommendations.length > 0 ? (

                        <ul className="space-y-3">

                          {feedbackResult.recommendations.map(
                            (recommendation, index) => (

                              <li
                                key={index}
                                className="flex gap-3 text-slate-700"
                              >

                                <span className="text-purple-600 font-bold">
                                  →
                                </span>

                                <span>
                                  {recommendation}
                                </span>

                              </li>

                            )
                          )}

                        </ul>

                      ) : (

                        <p className="text-slate-500">
                          No recommendations provided.
                        </p>

                      )}

                    </div>

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