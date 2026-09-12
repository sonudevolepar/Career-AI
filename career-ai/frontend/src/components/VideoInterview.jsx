import React, { useEffect, useRef, useState } from "react";
import "./VideoInterview.css";

const VideoInterview = ({
  role,
  questions = [],
  onEndInterview,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [cameraError, setCameraError] = useState("");

  const [interviewEnded, setInterviewEnded] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const [interviewTime, setInterviewTime] = useState(0);

  const [answers, setAnswers] = useState([]);

  const [speechSupported, setSpeechSupported] = useState(true);

  // =========================================================
  // CURRENT QUESTION
  // =========================================================

  const question =
    questions[currentQuestion] || "";

  // =========================================================
  // START CAMERA + MICROPHONE
  // =========================================================

  useEffect(() => {
    startCamera();

    // Check speech recognition support
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }

    // Start interview timer
    timerRef.current = setInterval(() => {
      setInterviewTime((previous) => previous + 1);
    }, 1000);

    return () => {
      stopCamera();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log(error);
        }
      }

      window.speechSynthesis.cancel();

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // =========================================================
  // ATTACH CAMERA STREAM TO VIDEO
  // =========================================================

  useEffect(() => {
    if (
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;
    }
  }, [cameraOn]);

  // =========================================================
  // START CAMERA
  // =========================================================

  const startCamera = async () => {
    try {
      setCameraError("");

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setCameraError(
          "Camera access is not supported in this browser."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject =
          stream;
      }

      setCameraOn(true);
      setMicOn(true);
    } catch (error) {
      console.error(
        "Camera/Microphone error:",
        error
      );

      setCameraError(
        "Camera or microphone permission is required. Please allow permission in your browser."
      );

      setCameraOn(false);
      setMicOn(false);
    }
  };

  // =========================================================
  // STOP CAMERA
  // =========================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // =========================================================
  // FORMAT TIMER
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(
      2,
      "0"
    )}`;
  };

  // =========================================================
  // TOGGLE MICROPHONE
  // =========================================================

  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTracks =
      streamRef.current.getAudioTracks();

    if (!audioTracks.length) return;

    const newMicState = !micOn;

    audioTracks.forEach((track) => {
      track.enabled = newMicState;
    });

    setMicOn(newMicState);

    // If microphone turned off,
    // stop speech recognition.
    if (!newMicState && isListening) {
      stopListening();
    }
  };

  // =========================================================
  // TOGGLE CAMERA
  // =========================================================

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTracks =
      streamRef.current.getVideoTracks();

    if (!videoTracks.length) return;

    const newCameraState = !cameraOn;

    videoTracks.forEach((track) => {
      track.enabled = newCameraState;
    });

    setCameraOn(newCameraState);
  };

  // =========================================================
  // SPEAK QUESTION
  // =========================================================

  const speakQuestion = () => {
    if (!question) return;

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        question
      );

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
    };

    speech.onend = () => {
      setIsSpeaking(false);
    };

    speech.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      speech
    );
  };

  // =========================================================
  // SPEAK QUESTION WHEN QUESTION CHANGES
  // =========================================================

  useEffect(() => {
    if (!question || interviewEnded) {
      return;
    }

    const timer = setTimeout(() => {
      speakQuestion();
    }, 700);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [
    currentQuestion,
    question,
    interviewEnded,
  ]);

  // =========================================================
  // START SPEECH RECOGNITION
  // =========================================================

  const startListening = () => {
    if (!micOn) {
      alert(
        "Please turn on your microphone first."
      );

      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    // Stop previous recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        finalText +=
          event.results[i][0]
            .transcript;
      }

      setTranscript((previous) => {
        if (!previous) {
          return finalText;
        }

        return finalText;
      });
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error ===
        "not-allowed"
      ) {
        alert(
          "Microphone permission denied. Please allow microphone access."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Recognition start error:",
        error
      );
    }
  };

  // =========================================================
  // STOP SPEECH RECOGNITION
  // =========================================================

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log(error);
      }
    }

    setIsListening(false);
  };

  // =========================================================
  // SAVE CURRENT ANSWER
  // =========================================================

  const saveCurrentAnswer = () => {
    const answerData = {
      questionNumber:
        currentQuestion + 1,

      question: question,

      answer:
        transcript.trim() ||
        "No answer provided.",
    };

    setAnswers((previous) => {
      const updated = [...previous];

      updated[currentQuestion] =
        answerData;

      return updated;
    });
  };

  // =========================================================
  // NEXT QUESTION
  // =========================================================

  const nextQuestion = () => {
    stopListening();

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    // Save answer
    saveCurrentAnswer();

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setTranscript("");
    } else {
      finishInterview();
    }
  };

  // =========================================================
  // PREVIOUS QUESTION
  // =========================================================

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }

    stopListening();

    window.speechSynthesis.cancel();

    saveCurrentAnswer();

    setCurrentQuestion(
      (previous) =>
        previous - 1
    );

    const previousAnswer =
      answers[currentQuestion - 1];

    setTranscript(
      previousAnswer?.answer || ""
    );
  };

  // =========================================================
  // FINISH INTERVIEW
  // =========================================================

  const finishInterview = () => {
    stopListening();

    window.speechSynthesis.cancel();

    setIsSpeaking(false);

    // Save final answer
    if (question) {
      setAnswers((previous) => {
        const updated = [...previous];

        updated[currentQuestion] = {
          questionNumber:
            currentQuestion + 1,

          question: question,

          answer:
            transcript.trim() ||
            "No answer provided.",
        };

        return updated;
      });
    }

    stopCamera();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setInterviewEnded(true);
  };

  // =========================================================
  // EXIT INTERVIEW
  // =========================================================

  const handleExit = () => {
    stopListening();

    window.speechSynthesis.cancel();

    stopCamera();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (onEndInterview) {
      onEndInterview();
    }
  };

  // =========================================================
  // NO QUESTIONS
  // =========================================================

  if (!questions.length) {
    return (
      <div className="video-interview-page">
        <div className="video-error-box">
          <div className="error-icon">
            ⚠️
          </div>

          <h2>
            No interview questions
            available
          </h2>

          <p>
            Please generate interview
            questions before starting the
            video interview.
          </p>

          <button
            onClick={handleExit}
            className="video-back-button"
          >
            ← Back to Mock Interview
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // INTERVIEW COMPLETED
  // =========================================================

  if (interviewEnded) {
    return (
      <div className="video-interview-page">
        <div className="interview-complete-card">
          <div className="complete-icon">
            ✓
          </div>

          <h1>
            Interview Completed
          </h1>

          <p>
            Great job! You completed your{" "}
            <strong>{role}</strong> mock
            interview.
          </p>

          <div className="complete-stats">
            <div>
              <strong>
                {questions.length}
              </strong>

              <span>
                Questions
              </span>
            </div>

            <div>
              <strong>
                {formatTime(
                  interviewTime
                )}
              </strong>

              <span>
                Duration
              </span>
            </div>

            <div>
              <strong>
                {answers.filter(
                  (item) =>
                    item?.answer &&
                    item.answer !==
                      "No answer provided."
                ).length}
              </strong>

              <span>
                Answered
              </span>
            </div>
          </div>

          <div className="completion-message">
            <strong>
              🤖 AI Interview Summary
            </strong>

            <p>
              Your interview session has
              been completed successfully.
              Your answers can now be
              evaluated by the AI interview
              system.
            </p>
          </div>

          <button
            className="back-interview-button"
            onClick={handleExit}
          >
            ← Back to Mock Interview
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN VIDEO INTERVIEW
  // =========================================================

  return (
    <div className="video-interview-page">
      <div className="video-interview-container">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="video-header">

          <div className="header-left">
            <div className="ai-header-icon">
              🤖
            </div>

            <div>
              <div className="video-title">
                AI Mock Interview
              </div>

              <div className="video-role">
                Interview for{" "}
                <strong>
                  {role}
                </strong>
              </div>
            </div>
          </div>

          <div className="header-right">

            <div className="interview-timer">
              ⏱️{" "}
              {formatTime(
                interviewTime
              )}
            </div>

            <div className="live-status">
              <span className="live-dot"></span>
              LIVE
            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* CAMERA ERROR */}
        {/* ================================================= */}

        {cameraError && (
          <div className="camera-error">
            ⚠️ {cameraError}

            <button
              onClick={startCamera}
            >
              Allow Camera
            </button>
          </div>
        )}

        {/* ================================================= */}
        {/* VIDEO CALL AREA */}
        {/* ================================================= */}

        <div className="video-grid">

          {/* =============================================== */}
          {/* AI INTERVIEWER */}
          {/* =============================================== */}

          <div className="video-box ai-box">

            <div className="video-label">

              <span>
                🤖 AI Interviewer
              </span>

              <span className="ai-online">
                ● Online
              </span>

            </div>

            <div className="ai-avatar">

              <div
                className={`avatar-circle ${
                  isSpeaking
                    ? "avatar-speaking"
                    : ""
                }`}
              >
                🤖
              </div>

              <div className="avatar-name">
                AI Interviewer
              </div>

              <div className="avatar-role">
                Technical Interviewer
              </div>

              {isSpeaking ? (
                <div className="speaking-status">
                  <span className="sound-wave">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </span>

                  Speaking...
                </div>
              ) : (
                <div className="speaking-status">
                  ● Waiting for your answer
                </div>
              )}

            </div>

            <div className="ai-video-footer">
              🔊 AI Voice Enabled
            </div>

          </div>

          {/* =============================================== */}
          {/* USER CAMERA */}
          {/* =============================================== */}

          <div className="video-box candidate-box">

            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="candidate-video"
              />
            ) : (
              <div className="camera-off">

                <div className="camera-off-icon">
                  📹
                </div>

                <p>
                  Camera is off
                </p>

                <small>
                  Turn on your camera
                  to continue
                </small>

              </div>
            )}

            <div className="video-label candidate-label">

              <span>
                📹 You
              </span>

              <span
                className={
                  micOn
                    ? "mic-status"
                    : "mic-status muted"
                }
              >
                {micOn
                  ? "🎤 Mic On"
                  : "🔇 Muted"}
              </span>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* QUESTION CARD */}
        {/* ================================================= */}

        <div className="question-card">

          <div className="question-top">

            <div>
              <span className="question-number">
                Question{" "}
                {currentQuestion + 1}{" "}
                of{" "}
                {questions.length}
              </span>

              <span className="question-type">
                Technical
              </span>
            </div>

            <span className="question-percent">
              {Math.round(
                ((currentQuestion + 1) /
                  questions.length) *
                  100
              )}
              %
            </span>

          </div>

          <div className="question-progress">
            <div
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="question-content">

            <span className="question-quote">
              "
            </span>

            <h2>
              {question}
            </h2>

          </div>

          {/* ============================================= */}
          {/* LISTENING AREA */}
          {/* ============================================= */}

          <div
            className={`listening-area ${
              isListening
                ? "listening-active"
                : ""
            }`}
          >

            {isListening ? (
              <>
                <div className="mic-animation">
                  🎤
                </div>

                <div>
                  <strong>
                    Listening...
                  </strong>

                  <p>
                    Speak your answer
                    clearly
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mic-static">
                  🎤
                </div>

                <div>
                  <strong>
                    Ready for your answer?
                  </strong>

                  <p>
                    Click "Start Answer"
                    and speak naturally.
                  </p>
                </div>
              </>
            )}

          </div>

          {/* ============================================= */}
          {/* TRANSCRIPT */}
          {/* ============================================= */}

          {transcript && (
            <div className="answer-preview">

              <div className="answer-header">
                <strong>
                  📝 Your Answer
                </strong>

                {isListening && (
                  <span>
                    Live transcription
                  </span>
                )}
              </div>

              <p>
                {transcript}
              </p>

            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <div className="interview-controls">

          {/* MIC */}

          <button
            type="button"
            className={`control-button ${
              micOn
                ? ""
                : "control-off"
            }`}
            onClick={toggleMic}
          >
            <span>
              {micOn
                ? "🎤"
                : "🔇"}
            </span>

            {micOn
              ? "Mute"
              : "Unmute"}
          </button>

          {/* CAMERA */}

          <button
            type="button"
            className={`control-button ${
              cameraOn
                ? ""
                : "control-off"
            }`}
            onClick={
              toggleCamera
            }
          >
            <span>
              {cameraOn
                ? "📹"
                : "🚫"}
            </span>

            {cameraOn
              ? "Camera"
              : "Camera Off"}
          </button>

          {/* SPEAK */}

          {!isListening ? (
            <button
              type="button"
              className="start-speaking-button"
              onClick={
                startListening
              }
              disabled={
                !speechSupported
              }
            >
              🎤 Start Answer
            </button>
          ) : (
            <button
              type="button"
              className="stop-speaking-button"
              onClick={
                stopListening
              }
            >
              ⏹ Stop Answer
            </button>
          )}

          {/* PREVIOUS */}

          <button
            type="button"
            className="previous-question-button"
            onClick={
              previousQuestion
            }
            disabled={
              currentQuestion === 0
            }
          >
            ← Previous
          </button>

          {/* NEXT */}

          <button
            type="button"
            className="next-question-button"
            onClick={
              nextQuestion
            }
          >
            {currentQuestion ===
            questions.length - 1
              ? "Finish Interview ✓"
              : "Next Question →"}
          </button>

          {/* END */}

          <button
            type="button"
            className="end-interview-button"
            onClick={
              finishInterview
            }
          >
            📞 End
          </button>

        </div>

        {/* ================================================= */}
        {/* SPEECH SUPPORT WARNING */}
        {/* ================================================= */}

        {!speechSupported && (
          <div className="speech-warning">
            ⚠️ Speech recognition is not
            supported in this browser.
            Please use Google Chrome.
          </div>
        )}

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="interview-footer">

          <span>
            🔒 Camera and microphone are
            used only during this interview
            session.
          </span>

          <span>
            •
          </span>

          <span>
            Question{" "}
            {currentQuestion + 1}/
            {questions.length}
          </span>

        </div>

      </div>
    </div>
  );
};

export default VideoInterview;