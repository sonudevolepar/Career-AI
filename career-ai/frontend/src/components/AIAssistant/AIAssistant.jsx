// aiassitant generate
import React, { useEffect, useRef, useState } from "react";
import "./AIAssistant.css";

const API_URL = "http://localhost:5000/api/ai-assistant/chat";

const INITIAL_MESSAGE = {
  role: "assistant",
  text: "Hi! I'm Career AI Assistant. How can I help you today?",
  time: new Date(),
};
//function clean textfor speech
function cleanTextForSpeech(text = "") {
  return text
    .replace(/```[\w-]*\n?/g, "")
    .replace(/```/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function Avatar({ speaking, thinking, compact = false }) {
  return (
    <div
      className={[
        "career-avatar",
        speaking ? "avatar-speaking" : "",
        thinking ? "avatar-thinking" : "",
        compact ? "avatar-compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="img"
      aria-label={
        speaking
          ? "Career AI is speaking"
          : thinking
            ? "Career AI is thinking"
            : "Career AI avatar"
      }
    >
      <img
        src="/career-ai-logo.svg"
        alt="Career AI Logo"
        className="career-avatar-logo"
      />
      <div className="avatar-aura" />
      <div className="avatar-platform" />

      <div className="avatar-body">
        <div className="avatar-neck" />

        <div className="avatar-jacket">
          <div className="avatar-shirt" />
          <div className="avatar-tie" />
        </div>

        <div className="avatar-arm avatar-arm-left">
          <span className="avatar-hand" />
        </div>

        <div className="avatar-arm avatar-arm-right">
          <span className="avatar-hand" />
        </div>

        <div className="avatar-head">
          <div className="avatar-hair">
            <span className="hair-lock hair-lock-one" />
            <span className="hair-lock hair-lock-two" />
          </div>

          <div className="avatar-ear avatar-ear-left" />
          <div className="avatar-ear avatar-ear-right" />

          <div className="avatar-face">
            <div className="avatar-eyebrow eyebrow-left" />
            <div className="avatar-eyebrow eyebrow-right" />

            <div className="avatar-eye eye-left">
              <span />
            </div>
            <div className="avatar-eye eye-right">
              <span />
            </div>

            <div className="avatar-nose" />

            <div className="avatar-mouth">
              <span className="mouth-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="avatar-light avatar-light-one" />
      <div className="avatar-light avatar-light-two" />
    </div>
  );
}

function formatInlineText(text) {
  const parts = text.split(/(\*\*.*?\*\*|`[^`]*`|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderAIResponse(text = "") {
  const lines = text.split("\n");
  const elements = [];
  let bulletItems = [];
  let numberedItems = [];
  let codeLines = [];
  let inCodeBlock = false;
  let key = 0;

  const flushLists = () => {
    if (bulletItems.length) {
      elements.push(
        <ul className="ai-list" key={`ul-${key++}`}>
          {bulletItems.map((item, index) => (
            <li key={index}>{formatInlineText(item)}</li>
          ))}
        </ul>
      );
      bulletItems = [];
    }

    if (numberedItems.length) {
      elements.push(
        <ol className="ai-list numbered-list" key={`ol-${key++}`}>
          {numberedItems.map((item, index) => (
            <li key={index}>{formatInlineText(item)}</li>
          ))}
        </ol>
      );
      numberedItems = [];
    }
  };

  const flushCode = () => {
    elements.push(
      <pre className="ai-code-block" key={`code-${key++}`}>
        <code>{codeLines.join("\n")}</code>
      </pre>
    );
    codeLines = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushLists();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushLists();
      return;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushLists();
      elements.push(
        <h4 className="ai-heading" key={`heading-${key++}`}>
          {formatInlineText(heading[2])}
        </h4>
      );
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (numberedItems.length) flushLists();
      bulletItems.push(trimmed.replace(/^[-*]\s+/, ""));
      return;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      if (bulletItems.length) flushLists();
      numberedItems.push(numbered[1]);
      return;
    }

    flushLists();
    elements.push(
      <p className="ai-paragraph" key={`p-${key++}`}>
        {formatInlineText(trimmed)}
      </p>
    );
  });

  flushLists();

  if (inCodeBlock && codeLines.length) {
    flushCode();
  }

  return elements;
}

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceError, setVoiceError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(null);
  const mountedRef = useRef(true);
  const voiceEnabledRef = useRef(true);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestRef.current?.abort();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };

  const speakText = (text) => {
    if (!voiceEnabledRef.current) return;

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setVoiceError("Voice is not supported in this browser. Try a recent version of Chrome or Edge.");
      return;
    }

    const cleanText = cleanTextForSpeech(text);

    if (!cleanText) return;

    window.speechSynthesis.cancel();
    setVoiceError("");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find((voice) => voice.lang.toLowerCase() === "en-in") ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en-"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (mountedRef.current) setSpeaking(true);
    };

    utterance.onend = () => {
      if (mountedRef.current) setSpeaking(false);
    };

    utterance.onerror = (event) => {
      if (!mountedRef.current) return;
      setSpeaking(false);

      if (event.error !== "canceled" && event.error !== "interrupted") {
        setVoiceError("Voice playback failed. You can still read the text response.");
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) return;

    stopSpeaking();
    setVoiceError("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        text: userMessage,
        time: new Date(),
      },
    ]);

    setInput("");
    setLoading(true);

    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          message: userMessage,
          page: window.location.pathname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "AI Assistant request failed");
      }

      const answer =
        typeof data.answer === "string" && data.answer.trim()
          ? data.answer
          : "Sorry, I could not generate an answer.";

      if (!mountedRef.current) return;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: answer,
          time: new Date(),
          model: data.model || null,
        },
      ]);

      if (voiceEnabledRef.current) {
        speakText(answer);
      }
    } catch (error) {
      if (error.name === "AbortError") return;

      console.error("AI Assistant Error:", error);

      if (!mountedRef.current) return;

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text:
            "AI Assistant se connection nahi ho pa raha hai. Please check whether the backend is running.",
          time: new Date(),
        },
      ]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        ...INITIAL_MESSAGE,
        time: new Date(),
      },
    ]);
    setVoiceError("");
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      setVoiceEnabled(false);
      stopSpeaking();
      return;
    }

    setVoiceEnabled(true);
    setVoiceError("");
  };

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <button
        type="button"
        className={`ai-assistant-button ${open ? "button-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close Career AI Assistant" : "Open Career AI Assistant"}
        aria-expanded={open}
      >
        {open ? (
          <span className="close-icon">✕</span>
        ) : (
          <Avatar compact speaking={speaking} />
        )}
        {!open && <span className="ai-button-pulse" />}
      </button>

      {open && (
        <section className="ai-assistant-window" aria-label="Career AI chat">
          <header className="ai-assistant-header">
            <div className="ai-header-left">
              <div className="ai-header-avatar">
                <Avatar compact speaking={speaking} thinking={loading} />
              </div>

              <div className="ai-header-info">
                <h3>Career AI</h3>
                <span className="ai-status">
                  <span className="online-dot" />
                  {loading ? "Thinking..." : speaking ? "Speaking..." : "Ready to help"}
                </span>
              </div>
            </div>

            <div className="ai-header-actions">
              <button
                type="button"
                className={`header-action-button ${voiceEnabled ? "voice-active" : ""}`}
                onClick={toggleVoice}
                title={voiceEnabled ? "Turn voice responses off" : "Turn voice responses on"}
                aria-label={voiceEnabled ? "Turn voice responses off" : "Turn voice responses on"}
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>

              {speaking && (
                <button
                  type="button"
                  className="header-action-button"
                  onClick={stopSpeaking}
                  title="Stop speaking"
                  aria-label="Stop speaking"
                >
                  ⏹
                </button>
              )}

              <button
                type="button"
                className="header-action-button"
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat"
              >
                🗑
              </button>

              <button
                type="button"
                className="header-action-button"
                onClick={() => setOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </header>

          <div className="ai-chat-subheader">
            <div className="ai-sparkle">✦</div>
            <div>
              <strong>Your AI Career Assistant</strong>
              <span>Career guidance, interview prep and coding help</span>
            </div>
          </div>

          <div className="ai-avatar-stage">
            <Avatar speaking={speaking} thinking={loading} />
            <div className="avatar-caption">
              <span className="avatar-caption-dot" />
              {speaking
                ? "Career AI is speaking"
                : loading
                  ? "Preparing your answer"
                  : "Ready for your next question"}
            </div>
            <div className="avatar-voice-controls">
              <button
                type="button"
                onClick={toggleVoice}
                className="avatar-control-button"
              >
                {voiceEnabled ? "🔊 Voice on" : "🔇 Voice off"}
              </button>

              {speaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="avatar-control-button stop-control"
                >
                  Stop voice
                </button>
              )}
            </div>
          </div>

          {voiceError && (
            <div className="ai-voice-error" role="status">
              {voiceError}
            </div>
          )}

          <div className="ai-assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`message-row ${message.role === "user" ? "user-row" : "assistant-row"
                  }`}
              >
                {message.role === "assistant" && (
                  <div className="message-avatar">
                    <Avatar compact speaking={speaking && index === messages.length - 1} />
                  </div>
                )}

                <div
                  className={`message-wrapper ${message.role === "user" ? "user-wrapper" : "assistant-wrapper"
                    }`}
                >
                  <div
                    className={`message ${message.role === "user" ? "user-message" : "assistant-message"
                      }`}
                  >
                    {message.role === "assistant" ? (
                      renderAIResponse(message.text)
                    ) : (
                      <p className="user-text">{message.text}</p>
                    )}
                  </div>

                  <div className="message-meta">
                    <span>{formatTime(message.time)}</span>
                    {message.role === "assistant" && message.model && (
                      <span className="model-badge">AI</span>
                    )}
                    {message.role === "assistant" &&
                      message.text &&
                      index === messages.length - 1 && (
                        <button
                          type="button"
                          className="message-speak-button"
                          onClick={() => speakText(message.text)}
                          title="Read this answer aloud"
                        >
                          ▶ Listen
                        </button>
                      )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="message-avatar user-avatar">👤</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-row assistant-row">
                <div className="message-avatar">
                  <Avatar compact thinking />
                </div>
                <div className="message-wrapper assistant-wrapper">
                  <div className="message assistant-message typing-message">
                    <span className="typing-text">AI is thinking</span>
                    <span className="typing-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="ai-assistant-input-area">
            <div className="ai-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Career AI..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                aria-label="Message Career AI"
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="send-button"
                title="Send message"
                aria-label="Send message"
              >
                ➤
              </button>
            </div>

            <div className="input-hint">
              Press Enter to send · {voiceEnabled ? "Voice responses on" : "Text responses only"}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default AIAssistant;
