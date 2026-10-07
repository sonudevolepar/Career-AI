import React, {
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Login.css";


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
    <div className="login-page">

      <div className="login-card">

        {/* Heading */}

        <h1 className="login-title">
          Welcome Back
        </h1>

        <p className="login-subtitle">
          Login to Career AI
        </p>


        {/* Error */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* Login Form */}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >

          {/* Email */}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="login-input"
          />


          {/* Password */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="login-input"
          />


          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="login-submit"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        {/* Register */}

        <p className="register-text">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="register-link"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};


export default Login;