import React, { useEffect, useRef, useState } from "react";
import "./VideoInterview.css";

const VideoInterview = ({
  role = "Software Developer",
  questions = [],
  onEndInterview,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transcript, setTranscript] = useState("");

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [cameraError, setCameraError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(true);

  const [interviewEnded, setInterviewEnded] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);

  const [aiStatus, setAiStatus] = useState("Ready");
  const [isThinking, setIsThinking] = useState(false);

  const [questionList, setQuestionList] = useState([]);

  /* =====================================================
     PREPARE QUESTIONS
  ===================================================== */

  useEffect(() => {
    if (Array.isArray(questions) && questions.length > 0) {
      setQuestionList(questions);
    } else {
      setQuestionList([
        `Tell me about yourself and your experience with ${role}.`,
        `Why are you interested in working as a ${role}?`,
        `What are your strongest technical skills?`,
        `Tell me about a project you have worked on recently.`,
        `How do you debug a difficult technical problem?`,
        `How do you handle pressure or deadlines in a project?`,
        `Where do you see yourself in the next three years?`,
      ]);
    }
  }, [questions, role]);

  /* =====================================================
     CAMERA + MICROPHONE
  ===================================================== */

  useEffect(() => {
    startCamera();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    timerRef.current = setInterval(() => {
      setInterviewTime((prev) => prev + 1);
    }, 1000);

    return () => {
      stopCamera();

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      window.speechSynthesis?.cancel();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraError(
        "Camera/Microphone permission denied. Please allow camera and microphone access."
      );
      setCameraOn(false);
      setMicOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  /* =====================================================
     FORMAT TIME
  ===================================================== */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  /* =====================================================
     CURRENT QUESTION
  ===================================================== */

  const getCurrentQuestion = () => {
    if (!questionList.length) return "";

    const item = questionList[currentQuestion];

    if (typeof item === "string") {
      return item;
    }

    if (item?.question) {
      return item.question;
    }

    if (item?.text) {
      return item.text;
    }

    return String(item);
  };

  /* =====================================================
     AI SPEAK
  ===================================================== */

  const speakQuestion = (question = getCurrentQuestion()) => {
    if (!question || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    setIsSpeaking(true);
    setAiStatus("Speaking");
    setIsThinking(false);

    const utterance = new SpeechSynthesisUtterance(question);

    utterance.lang = "en-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang === "en-IN" &&
          /female|google|natural|neural/i.test(voice.name)
      ) ||
      voices.find((voice) => voice.lang === "en-IN") ||
      voices.find((voice) => voice.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAiStatus("Speaking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAiStatus("Listening");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAiStatus("Ready");
    };

    window.speechSynthesis.speak(utterance);
  };

  /* =====================================================
     AUTO SPEAK QUESTION
  ===================================================== */

  useEffect(() => {
    if (
      questionList.length > 0 &&
      !interviewEnded &&
      currentQuestion < questionList.length
    ) {
      setTranscript("");

      setIsThinking(true);
      setAiStatus("Thinking");

      speechTimeoutRef.current = setTimeout(() => {
        speakQuestion(getCurrentQuestion());
      }, 700);
    }

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    };
  }, [currentQuestion, questionList, interviewEnded]);

  /* =====================================================
     MICROPHONE
  ===================================================== */

  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTracks = streamRef.current.getAudioTracks();

    if (!audioTracks.length) return;

    const newState = !micOn;

    audioTracks.forEach((track) => {
      track.enabled = newState;
    });

    setMicOn(newState);

    if (!newState && isListening) {
      stopListening();
    }
  };

  /* =====================================================
     CAMERA
  ===================================================== */

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTracks = streamRef.current.getVideoTracks();

    if (!videoTracks.length) return;

    const newState = !cameraOn;

    videoTracks.forEach((track) => {
      track.enabled = newState;
    });

    setCameraOn(newState);
  };

  /* =====================================================
     START LISTENING
  ===================================================== */

  const startListening = () => {
    if (!speechSupported) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (!micOn) {
      alert("Please turn ON your microphone first.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setIsSpeaking(false);
      setAiStatus("Listening");
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript((prev) => {
        const base = prev || "";
        const newText = `${base} ${finalText}`.trim();

        return interimText
          ? `${newText} ${interimText}`.trim()
          : newText;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        alert("Microphone permission is required.");
      }

      setIsListening(false);
      setAiStatus("Ready");
    };

    recognition.onend = () => {
      setIsListening(false);

      if (!interviewEnded) {
        setAiStatus("Ready");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.log(error);
    }
  };

  /* =====================================================
     STOP LISTENING
  ===================================================== */

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
    setAiStatus("Answer captured");
  };

  /* =====================================================
     SAVE ANSWER
  ===================================================== */

  const saveCurrentAnswer = () => {
    const question = getCurrentQuestion();

    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: {
        question,
        answer: transcript.trim(),
      },
    }));
  };

  /* =====================================================
     NEXT QUESTION
  ===================================================== */

  const nextQuestion = () => {
    if (isListening) {
      stopListening();
    }

    saveCurrentAnswer();

    window.speechSynthesis?.cancel();

    if (currentQuestion < questionList.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTranscript("");
      setAiStatus("Thinking");
    } else {
      finishInterview();
    }
  };

  /* =====================================================
     PREVIOUS QUESTION
  ===================================================== */

  const previousQuestion = () => {
    if (currentQuestion <= 0) return;

    if (isListening) {
      stopListening();
    }

    window.speechSynthesis?.cancel();

    setCurrentQuestion((prev) => prev - 1);

    const previousAnswer = answers[currentQuestion - 1];

    if (previousAnswer?.answer) {
      setTranscript(previousAnswer.answer);
    } else {
      setTranscript("");
    }
  };

  /* =====================================================
     FINISH INTERVIEW
  ===================================================== */

  const finishInterview = () => {
    saveCurrentAnswer();

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    window.speechSynthesis?.cancel();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    stopCamera();

    setIsListening(false);
    setIsSpeaking(false);
    setInterviewEnded(true);
    setAiStatus("Interview completed");
  };

  /* =====================================================
     EXIT
  ===================================================== */

  const handleExit = () => {
    finishInterview();

    if (onEndInterview) {
      onEndInterview();
    }
  };

  /* =====================================================
     ANSWER COUNT
  ===================================================== */

  const answeredCount = Object.values(answers).filter(
    (item) => item?.answer?.trim()
  ).length;

  /* =====================================================
     NO QUESTIONS
  ===================================================== */

  if (!questionList.length) {
    return (
      <div className="video-interview-page">
        <div className="video-empty-state">
          <div className="empty-icon">🎤</div>

          <h2>No interview questions available</h2>

          <p>
            Please generate interview questions first and then start the
            video interview.
          </p>

          <button
            className="video-back-button"
            onClick={() => onEndInterview?.()}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     COMPLETED
  ===================================================== */

  if (interviewEnded) {
    return (
      <div className="video-interview-page">
        <div className="interview-complete-card">
          <div className="complete-icon">✓</div>

          <h1>Interview Completed</h1>

          <p className="complete-role">
            AI Mock Interview · {role}
          </p>

          <div className="complete-stats">
            <div className="complete-stat">
              <strong>{questionList.length}</strong>
              <span>Questions</span>
            </div>

            <div className="complete-stat">
              <strong>{answeredCount}</strong>
              <span>Answered</span>
            </div>

            <div className="complete-stat">
              <strong>{formatTime(interviewTime)}</strong>
              <span>Duration</span>
            </div>
          </div>

          <div className="completion-message">
            <h3>Great job! 🎉</h3>

            <p>
              Your interview has been completed. You can now review your
              answers and evaluate your interview performance.
            </p>
          </div>

          <button
            className="back-interview-button"
            onClick={() => onEndInterview?.()}
          >
            ← Back to Mock Interview
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     MAIN UI
  ===================================================== */

  return (
    <div className="video-interview-page">
      <div className="video-interview-container">

        {/* HEADER */}
        <header className="video-header">
          <div className="header-left">

            <div className="ai-header-icon">
              AI
            </div>

            <div>
              <h1 className="video-title">
                AI Video Interview
              </h1>

              <p className="video-role">
                {role}
              </p>
            </div>

          </div>

          <div className="header-right">

            <div className="interview-timer">
              <span className="timer-icon">◷</span>
              {formatTime(interviewTime)}
            </div>

            <div className="live-status">
              <span className="live-dot"></span>
              LIVE
            </div>

          </div>
        </header>

        {/* CAMERA ERROR */}
        {cameraError && (
          <div className="camera-error">
            <strong>Camera access required</strong>
            <span>{cameraError}</span>

            <button onClick={startCamera}>
              Try Again
            </button>
          </div>
        )}

        {/* VIDEO GRID */}
        <div className="video-grid">

          {/* AI VIDEO */}
          <div className="video-box ai-box">

            <div className="video-label">
              <span className="online-dot"></span>
              AI Interviewer
            </div>

            <div
              className={`human-avatar ${
                isSpeaking ? "avatar-speaking" : ""
              } ${isThinking ? "avatar-thinking" : ""}`}
            >

              {/* HEAD */}
              <div className="avatar-head">

                {/* HAIR */}
                <div className="avatar-hair"></div>

                {/* FACE */}
                <div className="avatar-face">

                  {/* EYEBROWS */}
                  <div className="eyebrow eyebrow-left"></div>
                  <div className="eyebrow eyebrow-right"></div>

                  {/* EYES */}
                  <div className="eye eye-left">
                    <span></span>
                  </div>

                  <div className="eye eye-right">
                    <span></span>
                  </div>

                  {/* NOSE */}
                  <div className="avatar-nose"></div>

                  {/* MOUTH */}
                  <div className="avatar-mouth">
                    <span></span>
                  </div>

                </div>

              </div>

              {/* BODY */}
              <div className="avatar-body">

                <div className="avatar-neck"></div>

                <div className="avatar-shirt"></div>

                {/* LEFT ARM */}
                <div className="avatar-arm arm-left"></div>

                {/* RIGHT ARM */}
                <div className="avatar-arm arm-right"></div>

                {/* HANDS */}
                <div className="avatar-hand hand-left">
                  👋
                </div>

                <div className="avatar-hand hand-right">
                  ✋
                </div>

              </div>

            </div>

            {/* AI NAME */}
            <div className="ai-name-card">
              <div>
                <strong>AI Interviewer</strong>
                <span>Senior {role}</span>
              </div>

              <div className="ai-speaking-status">
                <span className="status-dot"></span>
                {aiStatus}
              </div>
            </div>

            {/* VOICE WAVE */}
            <div
              className={`voice-wave ${
                isSpeaking ? "voice-active" : ""
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>

          {/* CANDIDATE VIDEO */}
          <div className="video-box candidate-box">

            <div className="video-label candidate-video-label">
              <span className="candidate-dot"></span>
              You
            </div>

            {cameraOn ? (
              <video
                ref={videoRef}
                className="candidate-video"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <div className="camera-off-screen">
                <div className="camera-off-icon">
                  📷
                </div>

                <span>Camera Off</span>
              </div>
            )}

            <div className="candidate-bottom-bar">

              <span>
                {micOn ? "🎙️ Mic On" : "🔇 Mic Off"}
              </span>

              <span>
                {cameraOn ? "📹 Camera On" : "📷 Camera Off"}
              </span>

            </div>

          </div>

        </div>

        {/* QUESTION */}
        <div className="question-card">

          <div className="question-top">

            <div className="question-number">
              Question {currentQuestion + 1} of{" "}
              {questionList.length}
            </div>

            <div className="question-type">
              {currentQuestion === 0
                ? "Introduction"
                : "Technical / Behavioral"}
            </div>

          </div>

          <div className="question-progress">
            <div
              className="question-progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questionList.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="question-content">

            <div className="quote-icon">
              “
            </div>

            <h2>
              {getCurrentQuestion()}
            </h2>

            <div className="question-actions">

              <button
                className="repeat-question"
                onClick={() =>
                  speakQuestion(getCurrentQuestion())
                }
              >
                🔊 Repeat Question
              </button>

            </div>

          </div>

        </div>

        {/* LISTENING AREA */}
        <div
          className={`listening-area ${
            isListening ? "listening-active" : ""
          }`}
        >

          <div className="listening-icon">
            {isListening ? "🎙️" : "🎤"}
          </div>

          <div className="listening-content">

            <strong>
              {isListening
                ? "I'm listening..."
                : "Your answer"}
            </strong>

            <span>
              {isListening
                ? "Speak clearly. Your answer is being transcribed."
                : "Click Start Answer and speak your answer."}
            </span>

          </div>

          {isListening && (
            <div className="mic-animation">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          )}

        </div>

        {/* ANSWER PREVIEW */}
        {transcript && (
          <div className="answer-preview">

            <div className="answer-header">
              <span>📝 Your Answer</span>

              <button
                onClick={() => setTranscript("")}
              >
                Clear
              </button>
            </div>

            <p>{transcript}</p>

          </div>
        )}

        {/* CONTROLS */}
        <div className="interview-controls">

          {/* MIC */}
          <button
            className={`control-button ${
              !micOn ? "control-danger" : ""
            }`}
            onClick={toggleMic}
            title="Toggle microphone"
          >
            <span>
              {micOn ? "🎙️" : "🔇"}
            </span>

            <small>
              {micOn ? "Mic" : "Muted"}
            </small>
          </button>

          {/* CAMERA */}
          <button
            className={`control-button ${
              !cameraOn ? "control-danger" : ""
            }`}
            onClick={toggleCamera}
            title="Toggle camera"
          >
            <span>
              {cameraOn ? "📹" : "📷"}
            </span>

            <small>
              {cameraOn ? "Camera" : "Off"}
            </small>
          </button>

          {/* START / STOP */}
          {!isListening ? (
            <button
              className="start-speaking-button"
              onClick={startListening}
            >
              <span>🎤</span>
              Start Answer
            </button>
          ) : (
            <button
              className="stop-speaking-button"
              onClick={stopListening}
            >
              <span>⏹</span>
              Stop Answer
            </button>
          )}

          {/* PREVIOUS */}
          <button
            className="previous-question-button"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {/* NEXT */}
          <button
            className="next-question-button"
            onClick={nextQuestion}
          >
            {currentQuestion === questionList.length - 1
              ? "Finish Interview"
              : "Next Question →"}
          </button>

          {/* END */}
          <button
            className="end-interview-button"
            onClick={handleExit}
          >
            End
          </button>

        </div>

        {/* SPEECH WARNING */}
        {!speechSupported && (
          <div className="speech-warning">
            ⚠️ Speech recognition is not supported in this
            browser. Please use Google Chrome for voice
            answers.
          </div>
        )}

        {/* FOOTER */}
        <footer className="interview-footer">

          <div>
            🔒 Your interview session is private
          </div>

          <div>
            AI Voice • Live Camera • Speech Recognition
          </div>

        </footer>

      </div>
    </div>
  );
};

export default VideoInterview;