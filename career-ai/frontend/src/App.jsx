import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ResumeAnalyzerUI from './components/ResumeAnalyzerUI';
import DSACoach from './components/DSACoach';
import AIMockInterviewer from './components/AIMockInterviewer';

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-blue-600">
        Career AI
      </h1>

      <p className="mt-4 text-lg text-slate-600">
        Welcome to Career AI. Analyze your resume, improve your ATS score,
        practice DSA, and prepare for interviews with AI.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2">
            Resume Analyzer
          </h2>
          <p className="text-slate-600">
            Get ATS score and AI-powered resume feedback.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2">
            DSA Coach
          </h2>
          <p className="text-slate-600">
            Learn Data Structures and Algorithms with AI guidance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-2">
            Mock Interview
          </h2>
          <p className="text-slate-600">
            Practice technical interviews and get AI feedback.
          </p>
        </div>

      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzerUI />}
        />

        <Route
          path="/dsa-coach"
          element={<DSACoach />}
        />

        <Route
          path="/mock-interview"
          element={<AIMockInterviewer />}
        />
      </Routes>
    </div>
  );
}

export default App;