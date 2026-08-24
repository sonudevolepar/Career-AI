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

          <Link
            to="/"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Home
          </Link>

          <Link
            to="/resume-analyzer"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Resume Analyzer
          </Link>

          <Link
            to="/dsa-coach"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            DSA Coach
          </Link>

          <Link
            to="/mock-interview"
            className="text-slate-700 hover:text-blue-600 font-medium transition"
          >
            Mock Interview
          </Link>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;