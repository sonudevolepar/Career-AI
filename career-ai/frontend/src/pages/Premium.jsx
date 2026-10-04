import React from "react";
import PaymentButton from "../components/PaymentButton";

function Premium() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7ff",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#222",
          }}
        >
          🚀 Career AI Premium
        </h1>

        <p
          style={{
            color: "#666",
            fontSize: "16px",
            marginBottom: "25px",
          }}
        >
          Unlock all Career AI premium features and boost your career.
        </p>

        <h2
          style={{
            fontSize: "42px",
            margin: "20px 0",
            color: "#6c63ff",
          }}
        >
          ₹499
        </h2>

        <p
          style={{
            color: "#777",
            marginBottom: "25px",
          }}
        >
          Premium access for 30 days
        </p>

        <div
          style={{
            textAlign: "left",
            marginBottom: "30px",
          }}
        >
          <p>✅ AI Resume Analyzer</p>
          <p>✅ AI Mock Interview</p>
          <p>✅ DSA AI Coach</p>
          <p>✅ AI Career Roadmap</p>
          <p>✅ AI System Design Coach</p>
          <p>✅ Advanced Career AI Features</p>
        </div>

        <PaymentButton />

        <p
          style={{
            marginTop: "20px",
            fontSize: "13px",
            color: "#888",
          }}
        >
          🔒 Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}

export default Premium;