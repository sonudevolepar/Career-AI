import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  "http://localhost:5000/api/auth";


const Register = () => {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);


    try {

      const response =
        await fetch(
          `${API_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );


      const data =
        await response.json();


      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed"
        );
      }


      setSuccess(
        "OTP sent to your email."
      );


      navigate(
        `/verify-otp?email=${encodeURIComponent(
          email
        )}`
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

        <h1 className="text-3xl font-bold text-white text-center">
          Create Account
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Join Career AI
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
          onSubmit={handleRegister}
          className="mt-6 space-y-4"
        >

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-purple-500"
          />


          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-purple-500"
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-purple-500"
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <p className="text-center text-slate-400 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};


export default Register;