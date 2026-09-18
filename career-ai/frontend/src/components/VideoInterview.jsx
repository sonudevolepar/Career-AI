import React, { useEffect, useRef, useState } from "react";
import "./VideoInterview.css";

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and your experience.",
  "Why do you want to work as a MERN Stack Developer?",
  "What are your strongest technical skills?",
  "Tell me about one of your projects and the challenges you faced.",
  "How do you debug a problem when your application is not working?",
];

function VideoInterview({ role = "MERN Stack Developer", onEndInterview }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const speechTimerRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions] = useState(DEFAULT_QUESTIONS);

  const [answers, setAnswers] = useState({});
  const [transcript, setTranscript] = useState("");

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [aiStatus, setAiStatus] = useState("Ready");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // CAMERA + MICROPHONE
  // --------------------------------------------------

  useEffect(() => {
    startMedia();

    return () => {
      stopMedia();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      window.speechSynthesis?.cancel();

      clearInterval(timerRef.current);
      clearTimeout(speechTimerRef.current);
    };
  }, []);

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setCameraOn(true);
      setMicOn(true);

      startTimer();
    } catch (err) {
      console.error(err);
      setError(
        "Camera or microphone permission denied. Please allow access from browser settings."
      );
    }
  };

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // --------------------------------------------------
  // TIMER
  // --------------------------------------------------

  const startTimer = () => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  // --------------------------------------------------
  // CAMERA TOGGLE
  // --------------------------------------------------

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  // --------------------------------------------------
  // MICROPHONE TOGGLE
  // --------------------------------------------------

  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicOn(audioTrack.enabled);

    if (!audioTrack.enabled && isListening) {
      stopListening();
    }
  };

  // --------------------------------------------------
  // AI SPEECH
  // --------------------------------------------------

  const speakQuestion = (question) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    clearTimeout(speechTimerRef.current);

    setIsSpeaking(true);
    setAiStatus("Speaking");

    const utterance = new SpeechSynthesisUtterance(question);

    utterance.lang = "en-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang?.toLowerCase().includes("en-in") &&
          /female|google|natural|neural/i.test(voice.name)
      ) ||
      voices.find((voice) =>
        voice.lang?.toLowerCase().includes("en-in")
      ) ||
      voices.find((voice) =>
        voice.lang?.toLowerCase().startsWith("en")
      );

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

      speechTimerRef.current = setTimeout(() => {
        setAiStatus("Ready for your answer");
      }, 500);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setAiStatus("Ready");
    };

    window.speechSynthesis.speak(utterance);
  };

  // Speak first question
  useEffect(() => {
    if (!isFinished && questions[currentQuestion]) {
      const timer = setTimeout(() => {
        speakQuestion(questions[currentQuestion]);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion, isFinished]);

  // --------------------------------------------------
  // SPEECH RECOGNITION
  // --------------------------------------------------

  const startListening = () => {
    if (!micOn) {
      setError("Please turn on your microphone first.");
      return;
    }

    setError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalText = "";

    recognition.onstart = () => {
      setIsListening(true);
      setAiStatus("Listening to you...");
    };

    recognition.onresult = (event) => {
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];

        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript((prev) => {
        const existingFinal = prev
          .replace(/\s+/g, " ")
          .trim();

        const combined =
          `${existingFinal} ${finalText} ${interimText}`
            .replace(/\s+/g, " ")
            .trim();

        return combined;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setError("Microphone permission is blocked.");
      }

      setIsListening(false);
      setAiStatus("Ready");
    };

    recognition.onend = () => {
      setIsListening(false);

      if (!isFinished) {
        setAiStatus("Ready");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setIsListening(false);
    setAiStatus("Answer captured");
  };

  // --------------------------------------------------
  // SAVE ANSWER
  // --------------------------------------------------

  const saveCurrentAnswer = () => {
    const currentAnswer = transcript.trim();

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: currentAnswer,
    }));
  };

  // --------------------------------------------------
  // NEXT QUESTION
  // --------------------------------------------------

  const nextQuestion = () => {
    saveCurrentAnswer();

    stopListening();

    setTranscript("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      finishInterview();
    }
  };

  // --------------------------------------------------
  // PREVIOUS QUESTION
  // --------------------------------------------------

  const previousQuestion = () => {
    stopListening();

    if (currentQuestion > 0) {
      const previousIndex = currentQuestion - 1;

      setCurrentQuestion(previousIndex);

      setTranscript(answers[previousIndex] || "");
    }
  };

  // --------------------------------------------------
  // FINISH
  // --------------------------------------------------

  const finishInterview = () => {
    saveCurrentAnswer();

    stopListening();

    window.speechSynthesis?.cancel();

    clearInterval(timerRef.current);

    setIsFinished(true);
    setIsSpeaking(false);
    setAiStatus("Interview completed");
  };

  const handleExit = () => {
    finishInterview();

    if (onEndInterview) {
      onEndInterview();
    }
  };

  // --------------------------------------------------
  // COMPLETED SCREEN
  // --------------------------------------------------

  if (isFinished) {
    return (
      <div className="video-interview-page">
        <div className="completed-card">
          <div className="completed-icon">✓</div>

          <h1>Interview Completed</h1>

          <p>
            Great job! Your interview has been completed successfully.
          </p>

          <div className="completed-stats">
            <div>
              <strong>{questions.length}</strong>
              <span>Questions</span>
            </div>

            <div>
              <strong>{formatTime(seconds)}</strong>
              <span>Duration</span>
            </div>

            <div>
              <strong>{Object.keys(answers).length}</strong>
              <span>Answers</span>
            </div>
          </div>

          <button className="primary-btn" onClick={handleExit}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="video-interview-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="interview-header">

        <div className="header-left">
          <div className="header-icon">
            🎥
          </div>

          <div>
            <h1>AI Video Interview</h1>

            <p>{role}</p>
          </div>
        </div>

        <div className="header-right">

          <div className="timer">
            <span className="timer-dot"></span>
            {formatTime(seconds)}
          </div>

          <div className="live-badge">
            <span></span>
            LIVE
          </div>

        </div>
      </div>


      {/* =========================================
          ERROR
      ========================================== */}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}


      {/* =========================================
          VIDEO SECTION
      ========================================== */}

      <div className="video-grid">

        {/* =====================================
            AI INTERVIEWER
        ====================================== */}

        <div className="video-box ai-video-box">

          <div className="video-label">
            <span className="label-dot ai-dot"></span>
            AI INTERVIEWER
          </div>

          <div className="virtual-interviewer">

            <div className="interviewer-glow"></div>

            {/* HEAD */}

            <div className="virtual-head">

              <div className="hair-back"></div>

              <div className="face">

                <div className="hair-front"></div>

                {/* EYEBROWS */}

                <div className="eyebrows">
                  <span></span>
                  <span></span>
                </div>

                {/* EYES */}

                <div className="eyes">

                  <div className="eye">
                    <span className="pupil"></span>
                  </div>

                  <div className="eye">
                    <span className="pupil"></span>
                  </div>

                </div>

                {/* NOSE */}

                <div className="nose"></div>

                {/* CHEEKS */}

                <div className="cheek cheek-left"></div>
                <div className="cheek cheek-right"></div>

                {/* MOUTH */}

                <div
                  className={`mouth ${
                    isSpeaking ? "mouth-speaking" : ""
                  }`}
                >
                  <span></span>
                </div>

              </div>

              <div className="virtual-neck"></div>

            </div>


            {/* BODY */}

            <div className="virtual-body">

              <div className="shirt">
                <div className="shirt-collar"></div>
              </div>


              {/* LEFT ARM */}

              <div
                className={`virtual-arm left-arm ${
                  isSpeaking ? "gesture-left" : ""
                }`}
              >
                <div className="arm-sleeve"></div>

                <div className="virtual-hand">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>


              {/* RIGHT ARM */}

              <div
                className={`virtual-arm right-arm ${
                  isSpeaking ? "gesture-right" : ""
                }`}
              >
                <div className="arm-sleeve"></div>

                <div className="virtual-hand">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

            </div>


            {/* AUDIO WAVE */}

            <div
              className={`ai-audio-wave ${
                isSpeaking ? "wave-active" : ""
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

          </div>


          {/* AI INFO */}

          <div className="ai-name-card">

            <div className="ai-avatar-small">
              👩🏻‍💼
            </div>

            <div>
              <strong>Sarah Sharma</strong>

              <small>
                Senior MERN Developer
              </small>
            </div>

            <div
              className={`ai-status ${
                isSpeaking
                  ? "speaking"
                  : isListening
                  ? "listening"
                  : ""
              }`}
            >
              <span></span>
              {aiStatus}
            </div>

          </div>

        </div>


        {/* =====================================
            CANDIDATE WEBCAM
        ====================================== */}

        <div className="video-box candidate-video-box">

          <div className="video-label">
            <span className="label-dot candidate-dot"></span>
            YOUR WEBCAM
          </div>

          {cameraOn ? (
            <video
              ref={videoRef}
              className="candidate-video"
              autoPlay
              playsInline
              muted
            />
          ) : (
            <div className="camera-off">
              <div className="camera-off-icon">
                📹
              </div>

              <p>Camera is off</p>
            </div>
          )}

          <div className="candidate-status">

            <span className={micOn ? "active" : ""}>
              🎙
            </span>

            <span className={cameraOn ? "active" : ""}>
              📹
            </span>

          </div>

        </div>

      </div>


      {/* =========================================
          QUESTION
      ========================================== */}

      <div className="question-section">

        <div className="question-top">

          <div className="question-number">
            Question {currentQuestion + 1}/{questions.length}
          </div>

          <div className="question-type">
            Technical / Behavioral
          </div>

        </div>

        <h2>{question}</h2>

      </div>


      {/* =========================================
          LISTENING
      ========================================== */}

      <div
        className={`listening-section ${
          isListening ? "listening-active" : ""
        }`}
      >

        <div className="mic-animation">

          <span></span>
          <span></span>
          <span></span>

        </div>

        <div>
          <strong>
            {isListening
              ? "I'm listening..."
              : isSpeaking
              ? "AI interviewer is speaking..."
              : "Ready for your answer"}
          </strong>

          <small>
            {isListening
              ? "Speak naturally and clearly"
              : "Click Start Answer when you're ready"}
          </small>
        </div>

      </div>


      {/* =========================================
          ANSWER PREVIEW
      ========================================== */}

      {transcript && (
        <div className="answer-preview">

          <div className="answer-title">
            <span>🎙</span>
            Your Answer
          </div>

          <p>{transcript}</p>

        </div>
      )}


      {/* =========================================
          CONTROLS
      ========================================== */}

      <div className="controls">

        <button
          className={`control-btn ${
            !micOn ? "control-off" : ""
          }`}
          onClick={toggleMic}
        >
          <span>{micOn ? "🎙" : "🔇"}</span>
          Mic
        </button>


        <button
          className={`control-btn ${
            !cameraOn ? "control-off" : ""
          }`}
          onClick={toggleCamera}
        >
          <span>{cameraOn ? "📹" : "🚫"}</span>
          Camera
        </button>


        {!isListening ? (
          <button
            className="start-answer-btn"
            onClick={startListening}
            disabled={isSpeaking}
          >
            🎙 Start Answer
          </button>
        ) : (
          <button
            className="stop-answer-btn"
            onClick={stopListening}
          >
            ⏹ Stop Answer
          </button>
        )}


        <button
          className="control-btn"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>


        <button
          className="next-btn"
          onClick={nextQuestion}
        >
          {currentQuestion === questions.length - 1
            ? "Finish Interview"
            : "Next Question →"}
        </button>

      </div>


      {/* =========================================
          FOOTER
      ========================================== */}

      <div className="interview-footer">

        <span>
          🔒 Your interview is private and secure
        </span>

        <button onClick={finishInterview}>
          End Interview
        </button>

      </div>

    </div>
  );
}

export default VideoInterview;