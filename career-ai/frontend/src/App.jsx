
import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import ResumeAnalyzerUI from "./components/ResumeAnalyzerUI";
import DSACoach from "./components/DSACoach";
import AIMockInterviewer from "./components/AIMockInterviewer";
import AIRoadmap from "./components/AIRoadmap";
import AISystemDesign from "./components/AISystemDesignCoach";
import JobSearch from "./components/JobSearch";


/* =========================
   HOME PAGE
========================= */

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
    <main className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center">

          <h1 className="text-5xl font-bold text-blue-600">
            Career AI
          </h1>

          <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
            Welcome to Career AI. Analyze your resume, improve your ATS
            score, find relevant jobs, practice DSA, prepare for interviews,
            build your career roadmap, and learn system design with AI.
          </p>

        </div>


        {/* FEATURES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {features.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="
                bg-white
                p-6
                rounded-2xl
                shadow
                hover:shadow-xl
                hover:-translate-y-1
                transition
                duration-200
                block
              "
            >

              <h2 className="text-xl font-bold mb-3 text-slate-800">
                {feature.title}
              </h2>

              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-5 text-blue-600 font-semibold">
                Explore →
              </div>

            </Link>
          ))}

        </div>

      </section>

    </main>
  );
}


/* =========================
   APP
========================= */

function App() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}
      <Navbar />

      {/* ROUTES */}
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* RESUME ANALYZER */}
        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzerUI />}
        />

        {/* AI JOB SEARCH */}
        <Route
          path="/job-search"
          element={<JobSearch />}
        />

        {/* DSA COACH */}
        <Route
          path="/dsa-coach"
          element={<DSACoach />}
        />

        {/* MOCK INTERVIEW */}
        <Route
          path="/mock-interview"
          element={<AIMockInterviewer />}
        />

        {/* AI ROADMAP */}
        <Route
          path="/ai-roadmap"
          element={<AIRoadmap />}
        />

        {/* SYSTEM DESIGN */}
        <Route
          path="/system-design"
          element={<AISystemDesign />}
        />

      </Routes>

    </div>
  );
}


/* =========================
   DEFAULT EXPORT
========================= */

export default App;

