import React, {
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const API_URL =
  "http://localhost:5000/api/auth";


const VerifyOTP = () => {

  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const email =
    searchParams.get("email");


  const { setUser } =
    useAuth();


  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [resending, setResending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ===============================
  // Verify OTP
  // ===============================

  const handleVerify = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/verify-otp`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              otp,
            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "OTP verification failed"
        );
      }


      localStorage.setItem(
        "careerAI_token",
        data.token
      );


      setUser(data.user);


      setSuccess(
        "Email verified successfully!"
      );


      setTimeout(() => {

        if (data.user.role === "admin") {

          navigate("/admin");

        } else {

          navigate("/");

        }

      }, 700);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  // ===============================
  // Resend OTP
  // ===============================

  const resendOTP = async () => {

    setError("");
    setSuccess("");
    setResending(true);


    try {

      const response =
        await fetch(
          `${API_URL}/resend-otp`,
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to resend OTP"
        );
      }


      setSuccess(
        "New OTP sent to your email."
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setResending(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center">
          Verify Email
        </h1>

        <p className="text-slate-400 text-center mt-3">
          OTP sent to
        </p>

        <p className="text-purple-400 text-center font-semibold">
          {email}
        </p>


        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}


        {success && (
          <div className="mt-5 bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg">
            {success}
          </div>
        )}


        <form
          onSubmit={handleVerify}
          className="mt-6"
        >

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(/\D/g, "")
              )
            }
            required
            className="w-full text-center text-2xl tracking-[10px] px-4 py-4 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-purple-500"
          />


          <button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6
            }
            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Verifying..."
              : "Verify Email"}
          </button>

        </form>


        <button
          onClick={resendOTP}
          disabled={resending}
          className="w-full mt-4 py-3 rounded-xl border border-purple-500/40 text-purple-400 hover:bg-purple-500/10"
        >
          {resending
            ? "Sending..."
            : "Resend OTP"}
        </button>

      </div>

    </div>
  );
};


export default VerifyOTP;