import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./VideoInterview.css";
import DIdAgent from "../components/DIdAgent";

function VideoInterview({
  role = "MERN Stack Developer",
  difficulty = "Medium",
  questions: receivedQuestions = [],
  onEndInterview,
}) {
  // =========================================================
  // QUESTIONS
  // =========================================================

  const questions = Array.isArray(receivedQuestions)
    ? receivedQuestions
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          if (
            item &&
            typeof item.question === "string"
          ) {
            return item.question.trim();
          }

          return "";
        })
        .filter(Boolean)
    : [];

  // =========================================================
  // D-ID CONFIG
  // =========================================================

  const DID_AGENT_ID =
    import.meta.env.VITE_DID_AGENT_ID;

  const DID_CLIENT_KEY =
    import.meta.env.VITE_DID_CLIENT_KEY;

  // =========================================================
  // REFS
  // =========================================================

  const candidateVideoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // =========================================================
  // STATE
  // =========================================================

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState([]);

  const [currentAnswer, setCurrentAnswer] =
    useState("");

  const [isListening, setIsListening] =
    useState(false);

  const [cameraOn, setCameraOn] =
    useState(true);

  const [micOn, setMicOn] =
    useState(true);

  const [cameraReady, setCameraReady] =
    useState(false);

  const [interviewStarted, setInterviewStarted] =
    useState(false);

  const [interviewFinished, setInterviewFinished] =
    useState(false);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [didReady, setDidReady] =
    useState(false);

  const [didConnecting, setDidConnecting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================================================
  // DEBUG D-ID ENV
  // =========================================================

  useEffect(() => {
    console.log(
      "================================="
    );

    console.log("D-ID ENV CHECK");

    console.log(
      "Agent ID:",
      DID_AGENT_ID || "MISSING"
    );

    console.log(
      "Client Key:",
      DID_CLIENT_KEY
        ? "Present"
        : "MISSING"
    );

    console.log(
      "================================="
    );
  }, [DID_AGENT_ID, DID_CLIENT_KEY]);

  // =========================================================
  // D-ID STATUS CALLBACK
  // =========================================================

  const handleDIDStatus = useCallback(
    (status) => {
      console.log(
        "D-ID STATUS:",
        status
      );

      if (
        status === "new" ||
        status === "connecting"
      ) {
        setDidConnecting(true);
        setDidReady(false);
      }

      if (status === "connected") {
        setDidConnecting(false);
        setDidReady(true);
        setErrorMessage("");

        console.log(
          "✅ D-ID AI INTERVIEWER ONLINE"
        );
      }

      if (
        status === "disconnected" ||
        status === "disconnecting" ||
        status === "closed"
      ) {
        setDidConnecting(false);
        setDidReady(false);
      }

      if (status === "fail") {
        setDidConnecting(false);
        setDidReady(false);

        setErrorMessage(
          "D-ID AI interviewer could not connect. Please check your D-ID Agent ID, Client Key and allowed domain."
        );
      }
    },
    []
  );

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (
      !interviewStarted ||
      interviewFinished
    ) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime(
        (previous) => previous + 1
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    interviewStarted,
    interviewFinished,
  ]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const secs = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // =========================================================
  // START CAMERA + MICROPHONE
  // =========================================================

  const startCamera = async () => {
    try {
      setErrorMessage("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera API is not supported in this browser."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
            audio: true,
          }
        );

      streamRef.current = stream;

      if (candidateVideoRef.current) {
        candidateVideoRef.current.srcObject =
          stream;

        candidateVideoRef.current
          .play()
          .catch(() => {});
      }

      setCameraReady(true);
      setCameraOn(true);
      setMicOn(true);

      console.log(
        "✅ Candidate camera and microphone started"
      );
    } catch (error) {
      console.error(
        "Camera/Microphone Error:",
        error
      );

      setCameraReady(false);

      setErrorMessage(
        "Camera or microphone permission was denied. Please allow camera and microphone access in Chrome."
      );
    }
  };

  // =========================================================
  // INITIAL CAMERA
  // =========================================================

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const startInterview = async () => {
    try {
      setErrorMessage("");

      if (!cameraReady) {
        await startCamera();
      }

      setElapsedTime(0);
      setInterviewFinished(false);
      setInterviewStarted(true);

      console.log(
        "🎤 Interview Started"
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Unable to start interview."
      );
    }
  };

  // =========================================================
  // SPEECH RECOGNITION
  // =========================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        "Speech recognition is not supported. Please use Google Chrome."
      );

      return;
    }

    if (isListening) {
      return;
    }

    try {
      const recognition =
        new SpeechRecognition();

      recognition.lang = "en-US";

      recognition.continuous = true;

      recognition.interimResults = true;

      recognition.onstart = () => {
        console.log(
          "🎤 Speech recognition started"
        );

        setIsListening(true);
      };

      recognition.onresult = (
        event
      ) => {
        let finalText = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          const transcript =
            event.results[i][0]
              .transcript;

          if (
            event.results[i].isFinal
          ) {
            finalText += transcript;
          }
        }

        if (finalText.trim()) {
          setCurrentAnswer(
            (previous) => {
              const separator =
                previous.trim()
                  ? " "
                  : "";

              return (
                previous +
                separator +
                finalText.trim()
              );
            }
          );
        }
      };

      recognition.onerror = (
        event
      ) => {
        console.error(
          "Speech Recognition Error:",
          event.error
        );

        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current =
        recognition;

      recognition.start();
    } catch (error) {
      console.error(
        "Speech recognition start error:",
        error
      );

      setIsListening(false);
    }
  };

  // =========================================================
  // STOP SPEECH
  // =========================================================

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(
          "Recognition stop:",
          error
        );
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // =========================================================
  // SAVE CURRENT ANSWER
  // =========================================================

  const saveAnswer = (
    questionIndex,
    answer
  ) => {
    setAnswers((previous) => {
      const updated = [
        ...previous,
      ];

      updated[questionIndex] =
        answer;

      return updated;
    });
  };

  // =========================================================
  // START / STOP ANSWER
  // =========================================================

  const toggleAnswer = () => {
    if (isListening) {
      stopListening();

      saveAnswer(
        currentQuestion,
        currentAnswer
      );

      return;
    }

    setErrorMessage("");

    startListening();
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = () => {
    stopListening();

    saveAnswer(
      currentQuestion,
      currentAnswer
    );

    if (
      currentQuestion <
      questions.length - 1
    ) {
      const nextIndex =
        currentQuestion + 1;

      setCurrentQuestion(
        nextIndex
      );

      setCurrentAnswer(
        answers[nextIndex] || ""
      );

      return;
    }

    finishInterview();
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const previousQuestion = () => {
    stopListening();

    saveAnswer(
      currentQuestion,
      currentAnswer
    );

    if (currentQuestion > 0) {
      const previousIndex =
        currentQuestion - 1;

      setCurrentQuestion(
        previousIndex
      );

      setCurrentAnswer(
        answers[previousIndex] || ""
      );
    }
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const finishInterview = () => {
    stopListening();

    saveAnswer(
      currentQuestion,
      currentAnswer
    );

    setInterviewFinished(true);
    setInterviewStarted(false);
  };

  // =========================================================
  // END INTERVIEW
  // =========================================================

  const endInterview = () => {
    stopListening();

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    streamRef.current = null;

    setInterviewStarted(false);
    setInterviewFinished(true);
    setCameraReady(false);
    setDidReady(false);
    setDidConnecting(false);

    console.log(
      "🛑 Interview ended"
    );
  };

  // =========================================================
  // CAMERA TOGGLE
  // =========================================================

  const toggleCamera = () => {
    if (!streamRef.current) {
      return;
    }

    const videoTracks =
      streamRef.current.getVideoTracks();

    if (!videoTracks.length) {
      return;
    }

    const newState =
      !videoTracks[0].enabled;

    videoTracks.forEach(
      (track) => {
        track.enabled = newState;
      }
    );

    setCameraOn(newState);
  };

  // =========================================================
  // MICROPHONE TOGGLE
  // =========================================================

  const toggleMic = () => {
    if (!streamRef.current) {
      return;
    }

    const audioTracks =
      streamRef.current.getAudioTracks();

    if (!audioTracks.length) {
      return;
    }

    const newState =
      !audioTracks[0].enabled;

    audioTracks.forEach(
      (track) => {
        track.enabled = newState;
      }
    );

    setMicOn(newState);
  };

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (!questions.length) {
    return (
      <div className="video-interview-page">
        <div className="error-screen">
          <div className="error-screen-icon">
            ⚠️
          </div>

          <h2>
            No Interview Questions
          </h2>

          <p>
            Gemini did not provide
            interview questions.
          </p>

          <button
            className="finish-button"
            onClick={
              onEndInterview
            }
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW COMPLETED
  // =========================================================

  if (interviewFinished) {
    return (
      <div className="video-interview-page">
        <div className="completion-screen">
          <div className="completion-card">
            <div className="completion-icon">
              ✓
            </div>

            <h1>
              Interview Completed
            </h1>

            <p>
              Your {role} interview
              has been completed.
            </p>

            <div className="completion-stats">
              <div className="completion-stat">
                <strong>
                  {questions.length}
                </strong>

                <span>
                  Questions
                </span>
              </div>

              <div className="completion-stat">
                <strong>
                  {formatTime(
                    elapsedTime
                  )}
                </strong>

                <span>
                  Duration
                </span>
              </div>

              <div className="completion-stat">
                <strong>
                  {answers.filter(
                    (answer) =>
                      answer &&
                      answer.trim()
                  ).length}
                </strong>

                <span>
                  Answers
                </span>
              </div>
            </div>

            <button
              className="finish-button"
              onClick={
                onEndInterview
              }
            >
              Back to Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="video-interview-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="video-interview-header">

        <div className="header-left">

          <div className="header-icon">
            AI
          </div>

          <div>
            <h1>
              AI Video Interview
            </h1>

            <p>
              {role}
            </p>
          </div>

        </div>

        <div className="header-right">

          <div className="timer-box">
            <span className="timer-icon">
              ⏱
            </span>

            {formatTime(
              elapsedTime
            )}
          </div>

          <div
            className={`live-status ${
              interviewStarted
                ? "active"
                : ""
            }`}
          >
            <span className="live-dot"></span>

            {interviewStarted
              ? "LIVE"
              : "READY"}
          </div>

        </div>

      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {errorMessage && (
        <div className="interview-error">

          <span>⚠️</span>

          <span>
            {errorMessage}
          </span>

          <button
            onClick={() =>
              setErrorMessage("")
            }
          >
            ×
          </button>

        </div>
      )}

      {/* =====================================================
          MAIN INTERVIEW GRID
      ===================================================== */}

      <main className="video-interview-container">

        <div className="interview-grid">

          {/* =================================================
              AI INTERVIEWER
          ================================================= */}

          <section className="interviewer-panel">

            <div className="panel-header">

              <div>
                <h2>
                  REAL AI INTERVIEWER
                </h2>

                <p>
                  AI-powered video
                  interviewer
                </p>
              </div>

              <div
                className={`ai-status ${
                  didReady
                    ? "online"
                    : didConnecting
                    ? "connecting"
                    : "offline"
                }`}
              >
                <span></span>

                {didReady
                  ? "Online"
                  : didConnecting
                  ? "Connecting..."
                  : "Offline"}
              </div>

            </div>

            {/* D-ID VIDEO */}

            <div className="real-ai-interviewer">

              <DIdAgent
                onStatusChange={
                  handleDIDStatus
                }
              />

              <div className="ai-live-indicator">
                <span></span>
                AI LIVE
              </div>

              {!didReady &&
                !didConnecting && (
                  <div className="did-loading-overlay">

                    <div className="did-loading-icon">
                      AI
                    </div>

                    <h3>
                      AI Interviewer
                    </h3>

                    <p>
                      Waiting for D-ID
                      connection...
                    </p>

                  </div>
                )}

              {didConnecting && (
                <div className="did-loading-overlay">

                  <div className="spinner"></div>

                  <h3>
                    Connecting AI...
                  </h3>

                  <p>
                    Preparing your
                    interviewer
                  </p>

                </div>
              )}

            </div>

            {/* AI INFORMATION */}

            <div className="ai-info-card">

              <div className="ai-avatar">
                AI
              </div>

              <div className="ai-info-text">

                <h3>
                  Sarah Sharma
                </h3>

                <p>
                  Senior {role}
                </p>

                <span>
                  Difficulty:{" "}
                  {difficulty}
                </span>

              </div>

              <div className="ai-ready-badge">
                {didReady
                  ? "Ready"
                  : "AI"}
              </div>

            </div>

          </section>

          {/* =================================================
              CANDIDATE CAMERA
          ================================================= */}

          <section className="candidate-panel">

            <div className="panel-header">

              <div>
                <h2>
                  YOUR WEBCAM
                </h2>

                <p>
                  Camera and microphone
                </p>
              </div>

              <div className="media-status">

                <span
                  className={
                    cameraOn
                      ? "media-on"
                      : "media-off"
                  }
                >
                  📹
                </span>

                <span
                  className={
                    micOn
                      ? "media-on"
                      : "media-off"
                  }
                >
                  🎤
                </span>

              </div>

            </div>

            {/* CAMERA */}

            <div className="candidate-video-container">

              <video
                ref={
                  candidateVideoRef
                }
                className="candidate-video"
                autoPlay
                playsInline
                muted
              />

              {!cameraReady && (
                <div className="camera-loading">

                  <div className="camera-icon">
                    📹
                  </div>

                  <h3>
                    Camera not ready
                  </h3>

                  <p>
                    Allow camera and
                    microphone access
                  </p>

                  <button
                    onClick={
                      startCamera
                    }
                  >
                    Enable Camera
                  </button>

                </div>
              )}

              {!cameraOn &&
                cameraReady && (
                  <div className="camera-off-overlay">

                    <div>
                      📷
                    </div>

                    <p>
                      Camera Off
                    </p>

                  </div>
                )}

              <div className="camera-live-badge">
                <span></span>
                YOU
              </div>

            </div>

            {/* CAMERA CONTROLS */}

            <div className="candidate-controls">

              <button
                className={`media-button ${
                  cameraOn
                    ? "active"
                    : "off"
                }`}
                onClick={
                  toggleCamera
                }
              >
                <span>
                  📹
                </span>

                {cameraOn
                  ? "Camera"
                  : "Camera Off"}
              </button>

              <button
                className={`media-button ${
                  micOn
                    ? "active"
                    : "off"
                }`}
                onClick={
                  toggleMic
                }
              >
                <span>
                  🎤
                </span>

                {micOn
                  ? "Mic"
                  : "Mic Off"}
              </button>

            </div>

          </section>

        </div>

        {/* ===================================================
            QUESTION
        =================================================== */}

        <section className="question-section">

          <div className="question-header">

            <div className="question-number">
              Question{" "}
              <strong>
                {currentQuestion + 1}
              </strong>
              {" "} /{" "}
              {questions.length}
            </div>

            <div className="question-type">
              Technical / Behavioral
            </div>

          </div>

          <div className="question-box">

            <div className="question-icon">
              ?
            </div>

            <div className="question-content">

              <p>
                {
                  questions[
                    currentQuestion
                  ]
                }
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            ANSWER
        =================================================== */}

        <section className="answer-section">

          <div className="answer-header">

            <div>
              <h2>
                Your Answer
              </h2>

              <p>
                Speak your answer or
                type it manually
              </p>
            </div>

            {isListening && (
              <div className="listening-badge">

                <span></span>

                Listening...

              </div>
            )}

          </div>

          <textarea
            value={currentAnswer}
            onChange={(event) =>
              setCurrentAnswer(
                event.target.value
              )
            }
            placeholder="Start speaking or type your answer here..."
          />

          <div className="answer-footer">

            <span className="answer-hint">
              🎤 Chrome speech
              recognition supported
            </span>

            <button
              className={`answer-button ${
                isListening
                  ? "stop"
                  : ""
              }`}
              onClick={
                toggleAnswer
              }
            >
              {isListening
                ? "⏹ Stop Answer"
                : "🎤 Start Answer"}
            </button>

          </div>

        </section>

        {/* ===================================================
            CONTROLS
        =================================================== */}

        <div className="interview-controls">

          {!interviewStarted ? (
            <button
              className="start-interview-button"
              onClick={
                startInterview
              }
            >
              <span>▶</span>

              Start Interview
            </button>
          ) : (
            <div className="active-controls">

              <button
                className="secondary-button"
                onClick={
                  previousQuestion
                }
                disabled={
                  currentQuestion ===
                  0
                }
              >
                ← Previous
              </button>

              <button
                className="secondary-button next-button"
                onClick={
                  nextQuestion
                }
              >
                {currentQuestion ===
                questions.length - 1
                  ? "Finish Interview ✓"
                  : "Next Question →"}
              </button>

              <button
                className="end-button"
                onClick={
                  endInterview
                }
              >
                End Interview
              </button>

            </div>
          )}

        </div>

        {/* ===================================================
            PROGRESS
        =================================================== */}

        <div className="progress-section">

          <div className="progress-info">

            <span>
              Interview Progress
            </span>

            <span>
              {currentQuestion + 1} /{" "}
              {questions.length}
            </span>

          </div>

          <div className="progress-track">

            <div
              className="progress-bar"
              style={{
                width: `${
                  ((currentQuestion +
                    1) /
                    questions.length) *
                  100
                }%`,
              }}
            ></div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default VideoInterview;