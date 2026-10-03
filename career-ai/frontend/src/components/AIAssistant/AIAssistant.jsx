import React, { useEffect, useRef, useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Career AI Assistant. How can I help you today?",
      time: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);


  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  // ==========================================
  // FOCUS INPUT WHEN CHAT OPENS
  // ==========================================

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [open]);


  // ==========================================
  // FORMAT INLINE TEXT
  // ==========================================

  const formatInlineText = (text) => {
    const parts = [];
    let remaining = text;
    let key = 0;

    const regex =
      /(\*\*.*?\*\*|`.*?`)/g;

    let match;

    while ((match = regex.exec(text)) !== null) {
      const before = text.slice(
        0,
        match.index
      );

      if (before) {
        parts.push(
          <React.Fragment key={key++}>
            {before}
          </React.Fragment>
        );
      }

      const value = match[0];

      if (
        value.startsWith("**") &&
        value.endsWith("**")
      ) {
        parts.push(
          <strong key={key++}>
            {value.slice(2, -2)}
          </strong>
        );
      } else if (
        value.startsWith("`") &&
        value.endsWith("`")
      ) {
        parts.push(
          <code key={key++}>
            {value.slice(1, -1)}
          </code>
        );
      }

      remaining = text.slice(
        match.index + match[0].length
      );

      text = remaining;

      regex.lastIndex = 0;
      match = null;
      break;
    }

    if (remaining) {
      const nestedParts = [];
      const nestedRegex =
        /(\*\*.*?\*\*|`.*?`)/g;

      let lastIndex = 0;
      let nestedMatch;

      while (
        (nestedMatch =
          nestedRegex.exec(remaining)) !== null
      ) {
        if (nestedMatch.index > lastIndex) {
          nestedParts.push(
            <React.Fragment key={key++}>
              {remaining.slice(
                lastIndex,
                nestedMatch.index
              )}
            </React.Fragment>
          );
        }

        const value = nestedMatch[0];

        if (
          value.startsWith("**") &&
          value.endsWith("**")
        ) {
          nestedParts.push(
            <strong key={key++}>
              {value.slice(2, -2)}
            </strong>
          );
        } else {
          nestedParts.push(
            <code key={key++}>
              {value.slice(1, -1)}
            </code>
          );
        }

        lastIndex =
          nestedMatch.index +
          nestedMatch[0].length;
      }

      if (lastIndex < remaining.length) {
        nestedParts.push(
          <React.Fragment key={key++}>
            {remaining.slice(lastIndex)}
          </React.Fragment>
        );
      }

      return (
        <>
          {parts}
          {nestedParts.length > 0
            ? nestedParts
            : remaining}
        </>
      );
    }

    return parts;
  };


  // ==========================================
  // FORMAT AI RESPONSE
  // ==========================================

  const renderAIResponse = (text) => {
    if (!text) {
      return null;
    }

    const lines = text.split("\n");

    const elements = [];

    let bulletItems = [];
    let numberedItems = [];
    let inCodeBlock = false;
    let codeLines = [];
    let key = 0;


    const flushBulletList = () => {
      if (bulletItems.length > 0) {
        elements.push(
          <ul
            className="ai-list"
            key={`ul-${key++}`}
          >
            {bulletItems.map(
              (item, index) => (
                <li key={index}>
                  {formatInlineText(item)}
                </li>
              )
            )}
          </ul>
        );

        bulletItems = [];
      }
    };


    const flushNumberedList = () => {
      if (numberedItems.length > 0) {
        elements.push(
          <ol
            className="ai-list numbered-list"
            key={`ol-${key++}`}
          >
            {numberedItems.map(
              (item, index) => (
                <li key={index}>
                  {formatInlineText(item)}
                </li>
              )
            )}
          </ol>
        );

        numberedItems = [];
      }
    };


    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        elements.push(
          <pre
            className="ai-code-block"
            key={`code-${key++}`}
          >
            <code>
              {codeLines.join("\n")}
            </code>
          </pre>
        );

        codeLines = [];
      }
    };


    lines.forEach((line) => {
      const trimmed = line.trim();


      // CODE BLOCK

      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushBulletList();
          flushNumberedList();
          inCodeBlock = true;
        }

        return;
      }


      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }


      // EMPTY LINE

      if (!trimmed) {
        flushBulletList();
        flushNumberedList();

        elements.push(
          <div
            className="ai-space"
            key={`space-${key++}`}
          />
        );

        return;
      }


      // HEADING ###

      if (trimmed.startsWith("### ")) {
        flushBulletList();
        flushNumberedList();

        elements.push(
          <h4
            className="ai-heading"
            key={`heading-${key++}`}
          >
            {formatInlineText(
              trimmed.substring(4)
            )}
          </h4>
        );

        return;
      }


      // HEADING ##

      if (trimmed.startsWith("## ")) {
        flushBulletList();
        flushNumberedList();

        elements.push(
          <h4
            className="ai-heading"
            key={`heading-${key++}`}
          >
            {formatInlineText(
              trimmed.substring(3)
            )}
          </h4>
        );

        return;
      }


      // HEADING #

      if (trimmed.startsWith("# ")) {
        flushBulletList();
        flushNumberedList();

        elements.push(
          <h4
            className="ai-heading"
            key={`heading-${key++}`}
          >
            {formatInlineText(
              trimmed.substring(2)
            )}
          </h4>
        );

        return;
      }


      // BULLET

      if (
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ")
      ) {
        flushNumberedList();

        bulletItems.push(
          trimmed.substring(2)
        );

        return;
      }


      // NUMBERED LIST

      const numberedMatch =
        trimmed.match(
          /^\d+\.\s+(.*)$/
        );

      if (numberedMatch) {
        flushBulletList();

        numberedItems.push(
          numberedMatch[1]
        );

        return;
      }


      // NORMAL TEXT

      flushBulletList();
      flushNumberedList();

      elements.push(
        <p
          className="ai-paragraph"
          key={`paragraph-${key++}`}
        >
          {formatInlineText(trimmed)}
        </p>
      );
    });


    flushBulletList();
    flushNumberedList();

    if (inCodeBlock) {
      flushCodeBlock();
    }


    return elements;
  };


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) {
      return;
    }


    // USER MESSAGE

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
        time: new Date(),
      },
    ]);


    setInput("");
    setLoading(true);


    try {
      const response = await fetch(
        "http://localhost:5000/api/ai-assistant/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            message: userMessage,
            page: window.location.pathname,
          }),
        }
      );


      const data = await response.json();

      console.log(
        "AI Assistant Response:",
        data
      );


      if (!response.ok) {
        throw new Error(
          data.message ||
            "AI Assistant request failed"
        );
      }


      // AI RESPONSE

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.answer ||
            "Sorry, I could not generate an answer.",
          time: new Date(),
          model: data.model || null,
        },
      ]);


    } catch (error) {
      console.error(
        "AI Assistant Error:",
        error
      );


      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "❌ AI Assistant se connection nahi ho pa raha hai. Please check whether the backend is running.",
          time: new Date(),
        },
      ]);


    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };


  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text:
          "Hi! 👋 I'm Career AI Assistant. How can I help you today?",
        time: new Date(),
      },
    ]);
  };


  // ==========================================
  // TIME FORMAT
  // ==========================================

  const formatTime = (time) => {
    if (!time) return "";

    return new Date(time).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  return (
    <>
      {/* =====================================
          FLOATING AI BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`ai-assistant-button ${
          open ? "button-open" : ""
        }`}
        aria-label="Open Career AI Assistant"
      >
        {open ? (
          <span className="close-icon">
            ✕
          </span>
        ) : (
          <span className="robot-icon">
            🤖
          </span>
        )}

        {!open && (
          <span className="ai-button-pulse"></span>
        )}
      </button>


      {/* =====================================
          CHAT WINDOW
      ===================================== */}

      {open && (
        <div className="ai-assistant-window">

          {/* HEADER */}

          <div className="ai-assistant-header">

            <div className="ai-header-left">

              <div className="ai-header-avatar">
                🤖
              </div>

              <div className="ai-header-info">

                <h3>
                  Career AI
                </h3>

                <span className="ai-status">
                  <span className="online-dot"></span>
                  Online
                </span>

              </div>

            </div>


            <div className="ai-header-actions">

              <button
                type="button"
                className="header-action-button"
                onClick={clearChat}
                title="Clear chat"
              >
                🗑️
              </button>

              <button
                type="button"
                className="header-action-button close-button"
                onClick={() => setOpen(false)}
                title="Close"
              >
                ✕
              </button>

            </div>

          </div>


          {/* CHAT INTRO */}

          <div className="ai-chat-subheader">

            <div className="ai-sparkle">
              ✨
            </div>

            <div>
              <strong>
                Your AI Career Assistant
              </strong>

              <span>
                Ask anything about your career
              </span>
            </div>

          </div>


          {/* =================================
              MESSAGES
          ================================= */}

          <div className="ai-assistant-messages">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`message-row ${
                    message.role === "user"
                      ? "user-row"
                      : "assistant-row"
                  }`}
                >

                  {/* AI AVATAR */}

                  {message.role ===
                    "assistant" && (
                    <div className="message-avatar">
                      🤖
                    </div>
                  )}


                  <div
                    className={`message-wrapper ${
                      message.role ===
                      "user"
                        ? "user-wrapper"
                        : "assistant-wrapper"
                    }`}
                  >

                    <div
                      className={`message ${
                        message.role ===
                        "user"
                          ? "user-message"
                          : "assistant-message"
                      }`}
                    >

                      {message.role ===
                      "assistant"
                        ? renderAIResponse(
                            message.text
                          )
                        : (
                          <p className="user-text">
                            {message.text}
                          </p>
                        )}

                    </div>


                    <div className="message-meta">

                      <span>
                        {formatTime(
                          message.time
                        )}
                      </span>

                      {message.role ===
                        "assistant" &&
                        message.model && (
                          <span className="model-badge">
                            AI
                          </span>
                        )}

                    </div>

                  </div>


                  {/* USER AVATAR */}

                  {message.role ===
                    "user" && (
                    <div className="message-avatar user-avatar">
                      👤
                    </div>
                  )}

                </div>
              )
            )}


            {/* =================================
                TYPING INDICATOR
            ================================= */}

            {loading && (
              <div className="message-row assistant-row">

                <div className="message-avatar">
                  🤖
                </div>

                <div className="message-wrapper assistant-wrapper">

                  <div className="message assistant-message typing-message">

                    <span className="typing-text">
                      AI is thinking
                    </span>

                    <span className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>

                  </div>

                </div>

              </div>
            )}


            <div ref={messagesEndRef} />

          </div>


          {/* =================================
              INPUT AREA
          ================================= */}

          <div className="ai-assistant-input-area">

            <div className="ai-input-wrapper">

              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Career AI..."
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <button
                type="button"
                onClick={sendMessage}
                disabled={
                  loading ||
                  !input.trim()
                }
                className="send-button"
                title="Send message"
              >
                ➤
              </button>

            </div>

            <div className="input-hint">
              Press Enter to send
            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;