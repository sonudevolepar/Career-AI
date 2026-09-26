import React, {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const location =
    useLocation();

  const { login } =
    useAuth();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);


    try {

      const data =
        await login(
          email,
          password
        );


      // Admin
      if (data.user.role === "admin") {

        navigate("/admin");

      }

      // Normal user
      else {

        const from =
          location.state?.from?.pathname ||
          "/";

        navigate(from);

      }

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
          Welcome Back
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Login to Career AI
        </p>


        {error && (
          <div className="mt-5 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
            {error}
          </div>
        )}


        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >

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
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:border-purple-500"
          />


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="text-center text-slate-400 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-purple-400"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};


export default Login;