import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Career AI
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">

          {/* Home */}
          <Link
            to="/"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          {/* Resume Analyzer */}
          <Link
            to="/resume-analyzer"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Resume Analyzer
          </Link>

          {/* DSA Coach */}
          <Link
            to="/dsa-coach"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            DSA Coach
          </Link>

          {/* Mock Interview */}
          <Link
            to="/mock-interview"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Mock Interview
          </Link>

          {/* AI Roadmap */}
          <Link
            to="/ai-roadmap"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            AI Roadmap
          </Link>

          {/* System Design */}
          <Link
            to="/system-design"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            System Design
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;