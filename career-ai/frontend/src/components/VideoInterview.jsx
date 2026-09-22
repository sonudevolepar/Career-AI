import React, { useEffect, useRef, useState } from "react";
import * as did from "@d-id/client-sdk";
import "./VideoInterview.css";

function VideoInterview({
  role = "MERN Stack Developer",
  difficulty = "Medium",
  questions: receivedQuestions = [],
  onEndInterview,
}) {
  // =========================================================
  // GEMINI QUESTIONS
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

  const DID_AGENT_ID = import.meta.env.VITE_DID_AGENT_ID;
  const DID_CLIENT_KEY = import.meta.env.VITE_DID_CLIENT_KEY;

  // =========================================================
  // REFS
  // =========================================================

  const videoRef = useRef(null);
  const candidateVideoRef = useRef(null);

  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  const didManagerRef = useRef(null);

  // =========================================================
  // STATE
  // =========================================================

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState([]);

  const [currentAnswer, setCurrentAnswer] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [cameraOn, setCameraOn] = useState(true);

  const [micOn, setMicOn] = useState(true);

  const [cameraReady, setCameraReady] = useState(false);

  const [interviewStarted, setInterviewStarted] = useState(false);

  const [interviewFinished, setInterviewFinished] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);

  const [didReady, setDidReady] = useState(false);

  const [didConnecting, setDidConnecting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // =========================================================
  // TIMER
  // =========================================================

  useEffect(() => {
    if (!interviewStarted || interviewFinished) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, interviewFinished]);

  // =========================================================
  // D-ID INITIALIZATION
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const initializeDID = async () => {
      if (!DID_AGENT_ID || !DID_CLIENT_KEY) {
        setErrorMessage(
          "D-ID Agent ID or Client Key is missing. Please check frontend/.env"
        );
        return;
      }

      try {
        setDidConnecting(true);

        const auth = {
          type: "key",
          clientKey: DID_CLIENT_KEY,
        };

        const callbacks = {
          // -------------------------------------------------
          // D-ID VIDEO STREAM
          // -------------------------------------------------

          onSrcObjectReady(value) {
            console.log("D-ID stream received");

            if (videoRef.current) {
              videoRef.current.srcObject = value;

              videoRef.current
                .play()
                .catch((error) => {
                  console.log(
                    "D-ID video autoplay:",
                    error
                  );
                });
            }

            return value;
          },

          // -------------------------------------------------
          // VIDEO STATE
          // -------------------------------------------------

          onVideoStateChange(state) {
            console.log(
              "D-ID video state:",
              state
            );

            if (!mounted) {
              return;
            }

            if (
              state === "STOP" ||
              state === "ENDED"
            ) {
              setIsSpeaking(false);
            } else {
              setIsSpeaking(true);
            }
          },

          // -------------------------------------------------
          // CONNECTION STATE
          // -------------------------------------------------

          onConnectionStateChange(state) {
            console.log(
              "D-ID connection state:",
              state
            );

            if (!mounted) {
              return;
            }

            if (state === "connected") {
              setDidReady(true);
              setDidConnecting(false);
            }

            if (
              state === "disconnected" ||
              state === "closed" ||
              state === "fail"
            ) {
              setDidReady(false);
              setDidConnecting(false);
              setIsSpeaking(false);
            }
          },

          // -------------------------------------------------
          // ERROR
          // -------------------------------------------------

          onError(error, errorData) {
            console.error(
              "D-ID Error:",
              error,
              errorData
            );

            if (!mounted) {
              return;
            }

            setDidConnecting(false);

            setErrorMessage(
              "D-ID connection error. Please check Agent ID, Client Key and Allowed Domain."
            );
          },

          // -------------------------------------------------
          // OPTIONAL MESSAGE CALLBACK
          // -------------------------------------------------

          onNewMessage(messages, type) {
            console.log(
              "D-ID message:",
              type,
              messages
            );
          },

          onConnectivityStateChange(state) {
            console.log(
              "D-ID connectivity:",
              state
            );
          },
        };

        // ---------------------------------------------------
        // CREATE D-ID AGENT MANAGER
        // ---------------------------------------------------

        const manager =
          await did.createAgentManager(
            DID_AGENT_ID,
            {
              auth,
              callbacks,

              // Useful for V2/V3 presenters.
              streamOptions: {
                compatibilityMode: "auto",
                streamWarmup: true,
              },
            }
          );

        if (!mounted) {
          return;
        }

        didManagerRef.current = manager;

        console.log(
          "D-ID Agent Manager initialized"
        );
      } catch (error) {
        console.error(
          "D-ID initialization error:",
          error
        );

        if (mounted) {
          setDidConnecting(false);

          setErrorMessage(
            error?.message ||
              "Unable to initialize D-ID Agent."
          );
        }
      }
    };

    initializeDID();

    return () => {
      mounted = false;

      try {
        if (didManagerRef.current) {
          didManagerRef.current.disconnect();
        }
      } catch (error) {
        console.log(
          "D-ID disconnect:",
          error
        );
      }
    };
  }, [DID_AGENT_ID, DID_CLIENT_KEY]);

  // =========================================================
  // CAMERA
  // =========================================================

  const startCamera = async () => {
    try {
      setErrorMessage("");

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = stream;

      if (candidateVideoRef.current) {
        candidateVideoRef.current.srcObject =
          stream;
      }

      setCameraReady(true);
      setCameraOn(true);
      setMicOn(true);

      console.log("Candidate camera started");
    } catch (error) {
      console.error(
        "Camera/Microphone error:",
        error
      );

      setErrorMessage(
        "Camera or microphone permission denied. Please allow access in browser."
      );
    }
  };

  // =========================================================
  // START CAMERA ON COMPONENT LOAD
  // =========================================================

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // =========================================================
  // START D-ID CONNECTION
  // =========================================================

  const connectDID = async () => {
    if (!didManagerRef.current) {
      throw new Error(
        "D-ID Agent Manager is not initialized."
      );
    }

    if (didReady) {
      return;
    }

    setDidConnecting(true);
    setErrorMessage("");

    await didManagerRef.current.connect();

    setDidReady(true);
    setDidConnecting(false);
  };

  // =========================================================
  // SPEAK GEMINI QUESTION USING D-ID
  // =========================================================

  const speakGeminiQuestion = async (
    question
  ) => {
    if (!question) {
      return;
    }

    if (!didManagerRef.current) {
      console.warn(
        "D-ID Agent Manager not available"
      );
      return;
    }

    try {
      setIsSpeaking(true);

      console.log(
        "D-ID speaking Gemini question:",
        question
      );

      await didManagerRef.current.speak({
        type: "text",
        input: question,

        // Expressive V4 can use sentiment.
        sentiment: "professional",
      });
    } catch (error) {
      console.error(
        "D-ID speak error:",
        error
      );

      setIsSpeaking(false);

      setErrorMessage(
        "AI interviewer could not speak the question."
      );
    }
  };

  // =========================================================
  // START INTERVIEW
  // =========================================================

  const startInterview = async () => {
    try {
      setErrorMessage("");

      // Start candidate camera if not ready
      if (!cameraReady) {
        await startCamera();
      }

      // Connect D-ID
      await connectDID();

      setInterviewStarted(true);
      setInterviewFinished(false);
      setElapsedTime(0);

      // Browser user gesture allows media playback.
      if (
        questions.length > 0
      ) {
        setTimeout(() => {
          speakGeminiQuestion(
            questions[0]
          );
        }, 700);
      }
    } catch (error) {
      console.error(
        "Start interview error:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to start interview."
      );
    }
  };

  // =========================================================
  // SPEAK CURRENT QUESTION
  // =========================================================

  const speakCurrentQuestion = async () => {
    if (!questions.length) {
      return;
    }

    const question =
      questions[currentQuestion];

    if (!question) {
      return;
    }

    await speakGeminiQuestion(question);
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
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (isListening) {
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (
          event.results[i].isFinal
        ) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      setCurrentAnswer(
        (previous) =>
          previous +
          finalText +
          interimText
      );
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
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
  };

  // =========================================================
  // STOP LISTENING
  // =========================================================

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // =========================================================
  // SAVE ANSWER
  // =========================================================

  const saveCurrentAnswer = () => {
    setAnswers((previous) => {
      const updated = [...previous];

      updated[currentQuestion] =
        currentAnswer;

      return updated;
    });
  };

  // =========================================================
  // START / STOP ANSWER
  // =========================================================

  const toggleAnswer = () => {
    if (isListening) {
      stopListening();
      saveCurrentAnswer();
    } else {
      setCurrentAnswer("");
      startListening();
    }
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = async () => {
    stopListening();

    saveCurrentAnswer();

    if (
      currentQuestion <
      questions.length - 1
    ) {
      const nextIndex =
        currentQuestion + 1;

      setCurrentQuestion(nextIndex);

      setCurrentAnswer(
        answers[nextIndex] || ""
      );

      // Give React time to update UI
      setTimeout(() => {
        speakGeminiQuestion(
          questions[nextIndex]
        );
      }, 500);
    } else {
      finishInterview();
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const previousQuestion = () => {
    stopListening();

    saveCurrentAnswer();

    if (currentQuestion > 0) {
      const previousIndex =
        currentQuestion - 1;

      setCurrentQuestion(
        previousIndex
      );

      setCurrentAnswer(
        answers[previousIndex] || ""
      );

      setTimeout(() => {
        speakGeminiQuestion(
          questions[previousIndex]
        );
      }, 500);
    }
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const finishInterview = () => {
    stopListening();

    saveCurrentAnswer();

    setInterviewFinished(true);
    setInterviewStarted(false);

    setIsSpeaking(false);
  };

  // =========================================================
  // END INTERVIEW
  // =========================================================

  const endInterview = async () => {
    stopListening();

    try {
      if (didManagerRef.current) {
        await didManagerRef.current.disconnect();
      }
    } catch (error) {
      console.log(
        "D-ID disconnect error:",
        error
      );
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    setInterviewStarted(false);
    setInterviewFinished(true);
    setIsSpeaking(false);
    setDidReady(false);
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

    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
      setCameraOn(track.enabled);
    });
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

    audioTracks.forEach((track) => {
      track.enabled = !track.enabled;
      setMicOn(track.enabled);
    });
  };

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (!questions.length) {
    return (
      <div className="video-interview-page">
        <div className="error-screen">
          <h2>No interview questions available</h2>

          <p>
            Gemini did not provide interview
            questions.
          </p>

          <button
            onClick={onEndInterview}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // COMPLETED SCREEN
  // =========================================================

  if (interviewFinished) {
    return (
      <div className="video-interview-page">
        <div className="completion-screen">
          <div className="completion-icon">
            ✓
          </div>

          <h1>Interview Completed</h1>

          <p>
            Your {role} interview has been
            completed successfully.
          </p>

          <div className="completion-stats">
            <div>
              <strong>
                {questions.length}
              </strong>
              <span>Questions</span>
            </div>

            <div>
              <strong>
                {formatTime(elapsedTime)}
              </strong>
              <span>Duration</span>
            </div>
          </div>

          <button
            className="finish-button"
            onClick={onEndInterview}
          >
            Back to Interview
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="video-interview-page">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="video-interview-header">
        <div>
          <h1>AI Video Interview</h1>

          <p>{role}</p>
        </div>

        <div className="interview-header-right">
          <div className="timer">
            {formatTime(elapsedTime)}
          </div>

          <div
            className={`live-status ${
              interviewStarted
                ? "active"
                : ""
            }`}
          >
            <span></span>

            {interviewStarted
              ? "LIVE"
              : "READY"}
          </div>
        </div>
      </header>

      {/* =================================================
          ERROR
      ================================================= */}

      {errorMessage && (
        <div className="interview-error">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="interview-grid">
        {/* =================================================
            AI INTERVIEWER
        ================================================= */}

        <section className="interviewer-panel">
          <div className="panel-title">
            <span>REAL AI INTERVIEWER</span>

            <span
              className={`ai-status ${
                didReady
                  ? "online"
                  : ""
              }`}
            >
              <span></span>

              {didReady
                ? "Online"
                : didConnecting
                ? "Connecting..."
                : "Offline"}
            </span>
          </div>

          <div className="real-ai-interviewer">
            {/* IMPORTANT:
                DO NOT use muted here.
                D-ID avatar needs audio.
            */}

            <video
              ref={videoRef}
              className={`ai-human-video ${
                isSpeaking
                  ? "ai-speaking"
                  : ""
              }`}
              autoPlay
              playsInline
            />

            <div className="ai-live-indicator">
              <span></span>
              AI LIVE
            </div>

            {isSpeaking && (
              <div className="ai-speaking-badge">
                🎙️ Speaking...
              </div>
            )}

            {!didReady &&
              !didConnecting && (
                <div className="ai-placeholder">
                  <div className="ai-placeholder-icon">
                    AI
                  </div>

                  <p>
                    AI Interviewer
                  </p>

                  <small>
                    Click Start Interview
                  </small>
                </div>
              )}
          </div>

          {/* AI INFORMATION */}

          <div className="ai-info-card">
            <div className="ai-avatar-small">
              AI
            </div>

            <div>
              <h3>Sarah Sharma</h3>

              <p>
                Senior {role}
              </p>

              <small>
                Difficulty: {difficulty}
              </small>
            </div>
          </div>
        </section>

        {/* =================================================
            CANDIDATE
        ================================================= */}

        <section className="candidate-panel">
          <div className="panel-title">
            <span>YOUR WEBCAM</span>

            <div className="candidate-status">
              <span
                className={
                  cameraOn
                    ? "status-on"
                    : "status-off"
                }
              >
                📹
              </span>

              <span
                className={
                  micOn
                    ? "status-on"
                    : "status-off"
                }
              >
                🎤
              </span>
            </div>
          </div>

          <div className="candidate-video-container">
            <video
              ref={candidateVideoRef}
              className="candidate-video"
              autoPlay
              playsInline
              muted
            />

            {!cameraOn && (
              <div className="camera-off-overlay">
                📷
                <p>Camera Off</p>
              </div>
            )}
          </div>

          {/* CAMERA CONTROLS */}

          <div className="candidate-controls">
            <button
              className={
                cameraOn
                  ? "media-button active"
                  : "media-button"
              }
              onClick={toggleCamera}
            >
              📹{" "}
              {cameraOn
                ? "Camera"
                : "Camera Off"}
            </button>

            <button
              className={
                micOn
                  ? "media-button active"
                  : "media-button"
              }
              onClick={toggleMic}
            >
              🎤{" "}
              {micOn
                ? "Mic"
                : "Mic Off"}
            </button>
          </div>
        </section>
      </div>

      {/* =================================================
          QUESTION
      ================================================= */}

      <section className="question-section">
        <div className="question-header">
          <span>
            Question {currentQuestion + 1} /{" "}
            {questions.length}
          </span>

          <span className="question-type">
            Technical / Behavioral
          </span>
        </div>

        <div className="question-box">
          <p>
            {questions[currentQuestion]}
          </p>

          <button
            className="repeat-question-button"
            onClick={speakCurrentQuestion}
            disabled={
              !didReady || isSpeaking
            }
          >
            🔊 Repeat Question
          </button>
        </div>
      </section>

      {/* =================================================
          ANSWER
      ================================================= */}

      <section className="answer-section">
        <div className="answer-header">
          <h3>Your Answer</h3>

          {isListening && (
            <span className="listening">
              🔴 Listening...
            </span>
          )}
        </div>

        <textarea
          value={currentAnswer}
          onChange={(event) =>
            setCurrentAnswer(
              event.target.value
            )
          }
          placeholder="Speak your answer or type here..."
        />

        <div className="answer-actions">
          <button
            className={
              isListening
                ? "answer-button stop"
                : "answer-button"
            }
            onClick={toggleAnswer}
          >
            {isListening
              ? "⏹ Stop Answer"
              : "🎤 Start Answer"}
          </button>
        </div>
      </section>

      {/* =================================================
          INTERVIEW CONTROLS
      ================================================= */}

      <div className="interview-controls">
        {!interviewStarted ? (
          <button
            className="start-interview-button"
            onClick={startInterview}
            disabled={didConnecting}
          >
            {didConnecting
              ? "Connecting AI..."
              : "▶ Start Interview"}
          </button>
        ) : (
          <>
            <button
              className="secondary-button"
              onClick={previousQuestion}
              disabled={
                currentQuestion === 0
              }
            >
              ← Previous
            </button>

            <button
              className="secondary-button"
              onClick={nextQuestion}
            >
              {currentQuestion ===
              questions.length - 1
                ? "Finish Interview"
                : "Next Question →"}
            </button>

            <button
              className="end-button"
              onClick={endInterview}
            >
              End Interview
            </button>
          </>
        )}
      </div>

      {/* =================================================
          PROGRESS
      ================================================= */}

      <div className="interview-progress">
        <div
          className="progress-bar"
          style={{
            width: `${
              ((currentQuestion + 1) /
                questions.length) *
              100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default VideoInterview;