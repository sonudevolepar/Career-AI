import React, { useState } from "react";
import "./AIAssistant.css";

function AIAssistant() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Career AI Assistant. How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // SEND MESSAGE TO BACKEND
  // ==========================================

  const sendMessage = async () => {
    const userMessage = input.trim();

    if (!userMessage || loading) {
      return;
    }

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
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

            // Current page information
            page: window.location.pathname,
          }),
        }
      );

      const data = await response.json();

      console.log("AI Assistant Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "AI Assistant request failed"
        );
      }

      // Show AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.answer ||
            "Sorry, I could not generate an answer.",
        },
      ]);
    } catch (error) {
      console.error("AI Assistant Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "❌ AI Assistant se connection nahi ho pa raha hai. Please check whether the backend is running.",
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* =====================================
          FLOATING AI BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="ai-assistant-button"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* =====================================
          CHAT WINDOW
      ===================================== */}

      {open && (
        <div className="ai-assistant-window">

          {/* HEADER */}

          <div className="ai-assistant-header">

            <div>
              <h3>🤖 Career AI</h3>

              <span>
                <span className="online-dot"></span>
                AI Assistant
              </span>
            </div>

            <button
              type="button"
              className="close-button"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>

          {/* =================================
              MESSAGES
          ================================= */}

          <div className="ai-assistant-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "message user-message"
                    : "message assistant-message"
                }
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="message assistant-message">
                🤔 Thinking...
              </div>
            )}

          </div>

          {/* =================================
              INPUT
          ================================= */}

          <div className="ai-assistant-input">

            <input
              type="text"
              placeholder="Ask Career AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default AIAssistant;