import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import ResumeAnalyzerUI from './components/ResumeAnalyzerUI';
import DSACoach from './components/DSACoach';
import AIMockInterviewer from './components/AIMockInterviewer';
import AIRoadmap from './components/AIRoadmap';
import AISystemDesign from './components/AISystemDesignCoach';

function Home() {
  const features = [
    {
      title: 'Resume Analyzer',
      description: 'Get ATS score and AI-powered resume feedback.',
      path: '/resume-analyzer',
    },
    {
      title: 'DSA Coach',
      description: 'Learn Data Structures and Algorithms with AI guidance.',
      path: '/dsa-coach',
    },
    {
      title: 'Mock Interview',
      description: 'Practice technical interviews and get AI feedback.',
      path: '/mock-interview',
    },
    {
      title: 'AI Career Roadmap',
      description: 'Get a personalized career roadmap based on your skills and target role.',
      path: '/ai-roadmap',
    },
    {
      title: 'AI System Design',
      description: 'Practice system design problems and learn scalable architecture with AI.',
      path: '/system-design',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-blue-600">
        Career AI
      </h1>

      <p className="mt-4 text-lg text-slate-600 max-w-3xl">
        Welcome to Career AI. Analyze your resume, improve your ATS score,
        practice DSA, prepare for interviews, build your career roadmap,
        and learn system design with AI.
      </p>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition duration-200"
          >
            <h2 className="text-xl font-bold mb-2 text-slate-800">
              {feature.title}
            </h2>

            <p className="text-slate-600">
              {feature.description}
            </p>

            <div className="mt-4 text-blue-600 font-semibold">
              Explore →
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Resume Analyzer */}
        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzerUI />}
        />

        {/* DSA Coach */}
        <Route
          path="/dsa-coach"
          element={<DSACoach />}
        />

        {/* Mock Interview */}
        <Route
          path="/mock-interview"
          element={<AIMockInterviewer />}
        />

        {/* AI Career Roadmap */}
        <Route
          path="/ai-roadmap"
          element={<AIRoadmap />}
        />

        {/* AI System Design */}
        <Route
          path="/system-design"
          element={<AISystemDesign />}
        />

      </Routes>
    </div>
  );
}

export default App;