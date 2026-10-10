import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  FileText,
  BriefcaseBusiness,
  Code2,
  Video,
  Map,
  Network,
  Crown,
  CheckCircle2,
  Zap,
  Target,
} from "lucide-react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AIAssistant from "./components/AIAssistant/AIAssistant";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import AdminDashboard from "./pages/AdminDashboard";
import AllUsers from "./pages/AllUsers";
import Premium from "./pages/Premium";

import ResumeAnalyzerUI from "./components/ResumeAnalyzerUI";
import DSACoach from "./components/DSACoach";
import AIMockInterviewer from "./components/AIMockInterviewer";
import AIRoadmap from "./components/AIRoadmap";
import AISystemDesign from "./components/AISystemDesignCoach";
import JobSearch from "./components/JobSearch";

import "./App.css";

const features = [
  {
    title: "AI Resume Analyzer",
    description:
      "Analyze your resume, check ATS compatibility, and discover ways to improve your profile.",
    path: "/resume-analyzer",
    icon: FileText,
    number: "01",
    tag: "Career Profile",
    color: "blue",
  },
  {
    title: "AI Job Search",
    description:
      "Explore job opportunities based on your target role, location, and experience.",
    path: "/job-search",
    icon: BriefcaseBusiness,
    number: "02",
    tag: "Find Opportunities",
    color: "purple",
  },
  {
    title: "DSA Coach",
    description:
      "Practice coding problems, improve your problem-solving skills, and prepare for interviews.",
    path: "/dsa-coach",
    icon: Code2,
    number: "03",
    tag: "Coding Practice",
    color: "cyan",
  },
  {
    title: "AI Mock Interview",
    description:
      "Prepare for technical interviews and build confidence with structured practice.",
    path: "/mock-interview",
    icon: Video,
    number: "04",
    tag: "Interview Prep",
    color: "orange",
  },
  {
    title: "Career Roadmap",
    description:
      "Build a learning path for your target role with skills and actionable milestones.",
    path: "/ai-roadmap",
    icon: Map,
    number: "05",
    tag: "Career Growth",
    color: "green",
  },
  {
    title: "System Design Coach",
    description:
      "Learn architecture, databases, scalability, APIs, and engineering trade-offs.",
    path: "/system-design",
    icon: Network,
    number: "06",
    tag: "Advanced Learning",
    color: "pink",
  },
];

function Home() {
  return (
    <main className="career-home">
      <div className="home-background-glow home-glow-one" />
      <div className="home-background-glow home-glow-two" />

      <div className="home-container">
        <section className="career-hero">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Sparkles size={15} />
              <span>YOUR PERSONAL AI CAREER COMPANION</span>
            </div>

            <h1>
              Build your future.
              <br />
              <span>One skill at a time.</span>
            </h1>

            <p className="hero-description">
              Your all-in-one workspace to prepare for placements,
              sharpen your coding skills, discover opportunities,
              and become interview-ready.
            </p>

            <div className="hero-actions">
              <Link to="/dsa-coach" className="hero-primary-button">
                Start Learning
                <ArrowRight size={18} />
              </Link>

              <Link to="/job-search" className="hero-secondary-button">
                Explore Jobs
              </Link>
            </div>

            <div className="hero-trust-line">
              <span className="trust-icon">
                <CheckCircle2 size={17} />
              </span>
              <span>Learn at your pace. Prepare with purpose.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />

            <div className="hero-center-card">
              <div className="hero-center-icon">
                <Sparkles size={35} />
              </div>
              <span className="hero-center-label">CAREER AI</span>
              <strong>Your next chapter starts here.</strong>
              <p>Learn. Practice. Grow.</p>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-icon floating-blue">
                <Code2 size={19} />
              </span>
              <div>
                <strong>DSA Practice</strong>
                <small>Sharpen your logic</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-icon floating-purple">
                <Target size={19} />
              </span>
              <div>
                <strong>Career Goals</strong>
                <small>Keep moving forward</small>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="section-heading">
            <div>
              <div className="section-eyebrow">YOUR WORKSPACE</div>
              <h2>Everything you need to grow</h2>
              <p>
                Choose a tool and take the next step toward your career goals.
              </p>
            </div>

            <span className="feature-count">
              <Sparkles size={15} />
              6 AI-powered tools
            </span>
          </div>

          <div className="career-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Link
                  to={feature.path}
                  className={`career-feature-card feature-${feature.color}`}
                  key={feature.path}
                >
                  <div className="feature-card-top">
                    <span className="feature-icon">
                      <Icon size={24} strokeWidth={1.9} />
                    </span>

                    <span className="feature-number">
                      {feature.number}
                    </span>
                  </div>

                  <span className="feature-tag">{feature.tag}</span>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <div className="feature-card-link">
                    Open tool
                    <ArrowRight size={17} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="premium-banner">
          <div className="premium-icon">
            <Crown size={30} />
          </div>

          <div className="premium-content">
            <span className="premium-eyebrow">
              <Zap size={14} />
              TAKE YOUR PREPARATION FURTHER
            </span>

            <h2>Ready to level up your career?</h2>

            <p>
              Explore Career AI Premium and see the available benefits
              for your learning journey.
            </p>
          </div>

          <Link to="/premium" className="premium-button">
            Explore Premium
            <ArrowRight size={18} />
          </Link>
        </section>

        <footer className="career-home-footer">
          <span>
            <Sparkles size={15} />
            Career AI
          </span>
          <p>Learn today. Build tomorrow.</p>
        </footer>
      </div>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AllUsers />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzerUI />} />
          <Route path="/job-search" element={<JobSearch />} />
          <Route path="/dsa-coach" element={<DSACoach />} />
          <Route path="/mock-interview" element={<AIMockInterviewer />} />
          <Route path="/ai-roadmap" element={<AIRoadmap />} />
          <Route path="/system-design" element={<AISystemDesign />} />
          <Route path="/premium" element={<Premium />} />
        </Route>
      </Routes>

      <AIAssistant />
    </div>
  );
}

export default App;