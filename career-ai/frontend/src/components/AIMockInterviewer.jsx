import React, { useState } from "react";

const AIMockInterviewer = () => {
  const [role, setRole] = useState("");
  const [started, setStarted] = useState(false);

  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState("");

  const questions = [
    "Tell me about yourself.",
    "What are React Hooks?",
    "Explain Virtual DOM.",
    "Difference between let, const and var?",
    "What is Node.js?",
  ];

  // Answer change
  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  // Start interview
  const handleStartInterview = () => {
    if (!role.trim()) {
      alert("Please enter your target role.");
      return;
    }

    setStarted(true);
    setFeedbackResult("");
  };

  // Get AI Feedback
  const handleGetFeedback = async () => {
    // Check answers
    const answeredQuestions = questions.filter(
      (_, index) => answers[index]?.trim()
    );

    if (answeredQuestions.length === 0) {
      alert("Please answer at least one question.");
      return;
    }

    setIsLoading(true);
    setFeedbackResult("");

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

      console.log("FULL INTERVIEW API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Feedback generation failed."
        );
      }

      if (data.success) {
        setFeedbackResult(
          data.feedback ||
            data.data?.feedback ||
            "AI feedback received but response was empty."
        );
      } else {
        throw new Error(
          data.message || data.error || "Feedback generation failed."
        );
      }
    } catch (error) {
      console.error("Interview Feedback Error:", error);

      setFeedbackResult(
        `Error: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            AI Mock Interviewer
          </h1>

          <p className="text-slate-600">
            Practice AI-powered technical interviews.
          </p>
        </div>

        {/* Role Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Target Role
          </label>

          <input
            type="text"
            placeholder="Frontend Developer, MERN Developer..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            <div className="text-green-600 font-semibold">
              Interview started for: {role}
            </div>
          )}
        </div>

        {/* Questions */}
        {started && (
          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">
              Interview Questions
            </h2>

            <div className="space-y-6">

              {questions.map((question, index) => (
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
                      handleAnswerChange(index, e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>
              ))}

            </div>

            {/* Feedback Button */}
            <button
              onClick={handleGetFeedback}
              disabled={isLoading}
              className="mt-8 bg-green-600 text-white px-7 py-3 rounded-xl hover:bg-green-700 disabled:bg-green-400 transition"
            >
              {isLoading
                ? "Processing Feedback..."
                : "Get AI Feedback"}
            </button>

            {/* Feedback */}
            {feedbackResult && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">

                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  AI Interview Feedback
                </h3>

                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {feedbackResult}
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AIMockInterviewer;