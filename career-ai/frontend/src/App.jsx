import React from "react";

import {
  Routes,
  Route,
  Link,
} from "react-router-dom";


import Navbar
  from "./components/Navbar";

import ProtectedRoute
  from "./components/ProtectedRoute";

import AdminRoute
  from "./components/AdminRoute";


import Login
  from "./pages/Login";

import Register
  from "./pages/Register";

import VerifyOTP
  from "./pages/VerifyOTP";

import AdminDashboard
  from "./pages/AdminDashboard";


import ResumeAnalyzerUI
  from "./components/ResumeAnalyzerUI";

import DSACoach
  from "./components/DSACoach";

import AIMockInterviewer
  from "./components/AIMockInterviewer";

import AIRoadmap
  from "./components/AIRoadmap";

import AISystemDesign
  from "./components/AISystemDesignCoach";

import JobSearch
  from "./components/JobSearch";


/* =====================================
   HOME
===================================== */

function Home() {

  const features = [

    {
      title: "Resume Analyzer",
      description:
        "Get ATS score and AI-powered resume feedback.",
      path: "/resume-analyzer",
    },

    {
      title: "AI Job Search",
      description:
        "Find jobs based on your resume, skills and career goals.",
      path: "/job-search",
    },

    {
      title: "DSA Coach",
      description:
        "Learn Data Structures and Algorithms with AI guidance.",
      path: "/dsa-coach",
    },

    {
      title: "Mock Interview",
      description:
        "Practice technical interviews and get AI feedback.",
      path: "/mock-interview",
    },

    {
      title: "AI Career Roadmap",
      description:
        "Get a personalized career roadmap based on your skills and target role.",
      path: "/ai-roadmap",
    },

    {
      title: "AI System Design",
      description:
        "Practice system design problems and learn scalable architecture with AI.",
      path: "/system-design",
    },

  ];


  return (

    <main className="min-h-screen bg-slate-950">

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center">

          <h1 className="text-5xl font-bold text-white">
            Career AI
          </h1>

          <p className="mt-5 text-lg text-slate-400 max-w-3xl mx-auto">
            Your AI Career Companion
          </p>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {features.map((feature) => (

            <Link
              key={feature.path}
              to={feature.path}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500 hover:-translate-y-1 transition"
            >

              <h2 className="text-xl font-bold mb-3 text-white">
                {feature.title}
              </h2>

              <p className="text-slate-400">
                {feature.description}
              </p>

              <div className="mt-5 text-purple-400 font-semibold">
                Explore →
              </div>

            </Link>

          ))}

        </div>

      </section>

    </main>

  );
}


/* =====================================
   APP
===================================== */

function App() {

  return (

    <div className="min-h-screen bg-slate-950">

      <Navbar />


      <Routes>

        {/* =================================
            PUBLIC AUTH
        ================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />


        {/* =================================
            ADMIN
        ================================= */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

        </Route>


        {/* =================================
            PROTECTED CAREER AI
        ================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/resume-analyzer"
            element={<ResumeAnalyzerUI />}
          />

          <Route
            path="/job-search"
            element={<JobSearch />}
          />

          <Route
            path="/dsa-coach"
            element={<DSACoach />}
          />

          <Route
            path="/mock-interview"
            element={<AIMockInterviewer />}
          />

          <Route
            path="/ai-roadmap"
            element={<AIRoadmap />}
          />

          <Route
            path="/system-design"
            element={<AISystemDesign />}
          />

        </Route>

      </Routes>

    </div>

  );
}


export default App;