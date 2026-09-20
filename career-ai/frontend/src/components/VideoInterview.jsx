import React, { useEffect, useRef, useState } from "react";
import "./VideoInterview.css";

function VideoInterview({
  role = "MERN Stack Developer",
  difficulty = "Medium",
  questions: receivedQuestions = [],
  onEndInterview,
}) {
  // ============================================================
  // QUESTIONS
  // ============================================================

  const questions = Array.isArray(receivedQuestions)
    ? receivedQuestions
        .map((item) => {
          if (typeof item === "string") {
            return item.trim();
          }

          if (item && typeof item.question === "string") {
            return item.question.trim();
          }

          return "";
        })
        .filter(Boolean)
    : [];

  // ============================================================
  // REFS
  // ============================================================

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);

  // ============================================================
  // STATE
  // ============================================================

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

  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // TIMER
  // ============================================================

  useEffect(() => {
    if (!interviewStarted || interviewFinished) {
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, interviewFinished]);

  // ============================================================
  // FORMAT TIMER
  // ============================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // ============================================================
  // CAMERA + MICROPHONE
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        setErrorMessage("");

        if (!navigator.mediaDevices?.getUserMedia) {
          setErrorMessage(
            "Your browser does not support camera and microphone access."
          );
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          try {
            await videoRef.current.play();
          } catch (error) {
            console.log("Video autoplay:", error);
          }
        }

        setCameraReady(true);
      } catch (error) {
        console.error("Camera/Microphone Error:", error);

        setCameraReady(false);

        setErrorMessage(
          "Camera or microphone permission is required. Please allow access from your browser."
        );
      }
    };

    startCamera();

    return () => {
      mounted = false;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // SPEECH SYNTHESIS
  // ============================================================

  const speakQuestion = (question) => {
    if (!question) {
      return;
    }

    if (!window.speechSynthesis) {
      console.log("Speech synthesis is not supported.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(question);

    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Prefer Indian English voice
    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find((voice) =>
        voice.lang?.toLowerCase().includes("en-in")
      ) ||
      voices.find((voice) =>
        voice.name?.toLowerCase().includes("india")
      ) ||
      voices.find((voice) =>
        voice.lang?.toLowerCase().startsWith("en")
      );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // ============================================================
  // LOAD CURRENT QUESTION
  // ============================================================

  useEffect(() => {
    if (!interviewStarted) {
      return;
    }

    if (questions.length === 0) {
      return;
    }

    const question = questions[currentQuestion];

    if (!question) {
      return;
    }

    const timer = setTimeout(() => {
      speakQuestion(question);
    }, 500);

    return () => {
      clearTimeout(timer);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      setIsSpeaking(false);
    };
  }, [currentQuestion, interviewStarted, questions]);

  // ============================================================
  // LOAD SPEECH RECOGNITION
  // ============================================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.lang = "en-IN";

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

        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interimText += transcript;
        }
      }

      if (finalText) {
        setCurrentAnswer((previous) => {
          return `${previous} ${finalText}`.trim();
        });
      }

      if (interimText) {
        setCurrentAnswer((previous) => {
          const base = previous.trim();

          if (!base) {
            return interimText;
          }

          return `${base} ${interimText}`;
        });
      }
    };

    recognition.onerror = (event) => {
      console.log("Speech Recognition Error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setErrorMessage(
          "Microphone permission is required for voice answers."
        );
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        console.log("Recognition cleanup:", error);
      }

      recognitionRef.current = null;
    };
  }, []);

  // ============================================================
  // START INTERVIEW
  // ============================================================

  const startInterview = () => {
    if (questions.length === 0) {
      setErrorMessage(
        "No interview questions were received."
      );
      return;
    }

    setInterviewStarted(true);
    setInterviewFinished(false);
    setCurrentQuestion(0);
    setCurrentAnswer("");
    setAnswers([]);
    setElapsedTime(0);

    setTimeout(() => {
      speakQuestion(questions[0]);
    }, 700);
  };

  // ============================================================
  // START ANSWER
  // ============================================================

  const startAnswer = () => {
    if (!recognitionRef.current) {
      setErrorMessage(
        "Speech recognition is not supported. Please use Google Chrome."
      );
      return;
    }

    if (!micOn) {
      setErrorMessage(
        "Please turn on the microphone first."
      );
      return;
    }

    setErrorMessage("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Recognition start:", error);
    }
  };

  // ============================================================
  // STOP ANSWER
  // ============================================================

  const stopAnswer = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.log("Recognition stop:", error);
    }

    setIsListening(false);
  };

  // ============================================================
  // SAVE CURRENT ANSWER
  // ============================================================

  const saveCurrentAnswer = () => {
    const answer = currentAnswer.trim();

    setAnswers((previous) => {
      const updatedAnswers = [...previous];

      updatedAnswers[currentQuestion] = answer;

      return updatedAnswers;
    });

    return answer;
  };

  // ============================================================
  // NEXT QUESTION
  // ============================================================

  const nextQuestion = () => {
    stopAnswer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);

    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {
      setCurrentAnswer(
        answers[currentQuestion + 1] || ""
      );

      setCurrentQuestion((previous) => previous + 1);
    } else {
      finishInterview();
    }
  };

  // ============================================================
  // PREVIOUS QUESTION
  // ============================================================

  const previousQuestion = () => {
    if (currentQuestion === 0) {
      return;
    }

    stopAnswer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);

    saveCurrentAnswer();

    const previousIndex = currentQuestion - 1;

    setCurrentQuestion(previousIndex);

    setCurrentAnswer(
      answers[previousIndex] || ""
    );
  };

  // ============================================================
  // FINISH INTERVIEW
  // ============================================================

  const finishInterview = () => {
    stopAnswer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);

    setAnswers((previous) => {
      const updatedAnswers = [...previous];

      updatedAnswers[currentQuestion] =
        currentAnswer.trim();

      return updatedAnswers;
    });

    setInterviewFinished(true);
    setInterviewStarted(false);
  };

  // ============================================================
  // END INTERVIEW
  // ============================================================

  const endInterview = () => {
    stopAnswer();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    setIsSpeaking(false);
    setInterviewStarted(false);

    if (onEndInterview) {
      onEndInterview();
    }
  };

  // ============================================================
  // CAMERA TOGGLE
  // ============================================================

  const toggleCamera = () => {
    if (!streamRef.current) {
      return;
    }

    const videoTracks =
      streamRef.current.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !cameraOn;
    });

    setCameraOn((previous) => !previous);
  };

  // ============================================================
  // MICROPHONE TOGGLE
  // ============================================================

  const toggleMicrophone = () => {
    if (!streamRef.current) {
      return;
    }

    const audioTracks =
      streamRef.current.getAudioTracks();

    audioTracks.forEach((track) => {
      track.enabled = !micOn;
    });

    setMicOn((previous) => !previous);

    if (micOn) {
      stopAnswer();
    }
  };

  // ============================================================
  // RESET INTERVIEW
  // ============================================================

  const restartInterview = () => {
    setCurrentQuestion(0);
    setCurrentAnswer("");
    setAnswers([]);
    setElapsedTime(0);
    setInterviewFinished(false);
    setInterviewStarted(false);
    setErrorMessage("");

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ============================================================
  // NO QUESTIONS
  // ============================================================

  if (questions.length === 0) {
    return (
      <div className="video-interview-page">

        <div className="interview-error-screen">

          <div className="error-icon">
            ⚠️
          </div>

          <h2>No Interview Questions</h2>

          <p>
            Gemini did not return any interview
            questions for this role.
          </p>

          <button
            className="end-interview-btn"
            onClick={onEndInterview}
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // INTERVIEW FINISHED
  // ============================================================

  if (interviewFinished) {
    const answeredQuestions = answers.filter(
      (answer) =>
        typeof answer === "string" &&
        answer.trim().length > 0
    ).length;

    const unansweredQuestions =
      questions.length - answeredQuestions;

    return (
      <div className="video-interview-page">

        <div className="interview-complete-card">

          <div className="complete-icon">
            ✓
          </div>

          <h1>Interview Completed</h1>

          <p>
            Your AI interview session has been
            completed successfully.
          </p>

          <div className="interview-stats">

            <div className="stat-card">
              <strong>
                {questions.length}
              </strong>

              <span>
                Total Questions
              </span>
            </div>

            <div className="stat-card">
              <strong>
                {answeredQuestions}
              </strong>

              <span>
                Answered
              </span>
            </div>

            <div className="stat-card">
              <strong>
                {unansweredQuestions}
              </strong>

              <span>
                Unanswered
              </span>
            </div>

            <div className="stat-card">
              <strong>
                {formatTime(elapsedTime)}
              </strong>

              <span>
                Duration
              </span>
            </div>

          </div>

          <div className="complete-actions">

            <button
              className="restart-interview-btn"
              onClick={restartInterview}
            >
              Restart Interview
            </button>

            <button
              className="end-interview-btn"
              onClick={endInterview}
            >
              Exit Interview
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="video-interview-page">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="video-interview-header">

        <div className="header-left">

          <h1>
            AI Video Interview
          </h1>

          <p>
            {role}
          </p>

        </div>

        <div className="header-center">

          <div className="interview-timer">
            {formatTime(elapsedTime)}
          </div>

        </div>

        <div className="header-right">

          <div className="live-status">
            <span></span>
            LIVE
          </div>

        </div>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {errorMessage && (
        <div className="interview-error-message">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* ======================================================
          MAIN INTERVIEW AREA
      ======================================================= */}

      <div className="video-interview-content">

        {/* ====================================================
            LEFT SIDE - AI INTERVIEWER
        ===================================================== */}

        <div className="interviewer-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                REAL AI INTERVIEWER
              </span>

              <h2>
                Sarah Sharma
              </h2>

              <p>
                {role}
              </p>
            </div>

            <div className="ai-status">
              <span></span>
              Online
            </div>

          </div>


          {/* ==================================================
              REAL HUMAN AI IMAGE
          =================================================== */}

          <div className="real-ai-interviewer">

            <img
              src="/ai-interviewer.jpg"
              alt="AI Interviewer"
              className={`ai-human-image ${
                isSpeaking ? "ai-speaking" : ""
              }`}
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

          </div>


          {/* ==================================================
              AI QUESTION
          =================================================== */}

          <div className="ai-question-box">

            <div className="question-label">

              <span>
                Question {currentQuestion + 1}
              </span>

              <span>
                {difficulty}
              </span>

            </div>

            <p>
              {questions[currentQuestion]}
            </p>

          </div>

        </div>


        {/* ====================================================
            RIGHT SIDE - CANDIDATE
        ===================================================== */}

        <div className="candidate-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                YOUR WEBCAM
              </span>

              <h2>
                Candidate
              </h2>
            </div>

            <div className="camera-status">

              <span
                className={
                  cameraOn
                    ? "status-on"
                    : "status-off"
                }
              >
                {cameraOn ? "Camera On" : "Camera Off"}
              </span>

            </div>

          </div>


          {/* ==================================================
              CANDIDATE VIDEO
          =================================================== */}

          <div className="candidate-video-container">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`candidate-video ${
                !cameraOn
                  ? "video-hidden"
                  : ""
              }`}
            />

            {!cameraOn && (
              <div className="camera-off-screen">

                <div className="camera-off-icon">
                  📷
                </div>

                <p>
                  Camera is turned off
                </p>

              </div>
            )}

            {!cameraReady && (
              <div className="camera-loading">

                <div className="camera-loading-icon">
                  📹
                </div>

                <p>
                  Starting camera...
                </p>

              </div>
            )}

            {/* Candidate live badge */}

            <div className="candidate-live-badge">
              <span></span>
              YOU
            </div>

          </div>


          {/* ==================================================
              ANSWER BOX
          =================================================== */}

          <div className="answer-section">

            <div className="answer-header">

              <span>
                Your Answer
              </span>

              {isListening && (
                <span className="listening-indicator">
                  🔴 Listening...
                </span>
              )}

            </div>

            <div className="answer-box">

              {currentAnswer ? (
                <p>
                  {currentAnswer}
                </p>
              ) : (
                <p className="answer-placeholder">
                  Click "Start Answer" and speak your
                  answer...
                </p>
              )}

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          BOTTOM CONTROLS
      ======================================================= */}

      <div className="interview-controls">

        {/* Microphone */}

        <button
          className={`control-btn ${
            micOn ? "active" : "inactive"
          }`}
          onClick={toggleMicrophone}
          title={
            micOn
              ? "Turn microphone off"
              : "Turn microphone on"
          }
        >
          {micOn ? "🎤" : "🔇"}

          <span>
            {micOn ? "Mic" : "Muted"}
          </span>
        </button>


        {/* Camera */}

        <button
          className={`control-btn ${
            cameraOn ? "active" : "inactive"
          }`}
          onClick={toggleCamera}
          title={
            cameraOn
              ? "Turn camera off"
              : "Turn camera on"
          }
        >
          {cameraOn ? "📹" : "📷"}

          <span>
            {cameraOn ? "Camera" : "Camera Off"}
          </span>
        </button>


        {/* Start / Stop Answer */}

        {!isListening ? (

          <button
            className="start-answer-btn"
            onClick={startAnswer}
          >
            🎙️ Start Answer
          </button>

        ) : (

          <button
            className="stop-answer-btn"
            onClick={stopAnswer}
          >
            ⏹ Stop Answer
          </button>

        )}


        {/* Previous */}

        <button
          className="navigation-btn"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>


        {/* Next / Finish */}

        <button
          className="navigation-btn next-btn"
          onClick={nextQuestion}
        >
          {currentQuestion === questions.length - 1
            ? "Finish Interview"
            : "Next Question →"}
        </button>


        {/* End */}

        <button
          className="end-btn"
          onClick={endInterview}
        >
          End Interview
        </button>

      </div>


      {/* ======================================================
          QUESTION PROGRESS
      ======================================================= */}

      <div className="question-progress">

        <div className="progress-info">

          <span>
            Question {currentQuestion + 1} of{" "}
            {questions.length}
          </span>

          <span>
            {Math.round(
              ((currentQuestion + 1) /
                questions.length) *
                100
            )}
            %
          </span>

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default VideoInterview;