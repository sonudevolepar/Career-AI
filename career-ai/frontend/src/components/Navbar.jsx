import React from "react";

import {
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


const Navbar = () => {

  const {
    user,
    logout,
  } = useAuth();


  return (
    <nav className="w-full bg-slate-950 border-b border-slate-800">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold text-white"
        >
          Career AI
        </Link>


        {/* Navigation */}

        <div className="flex items-center gap-5">

          <Link
            to="/"
            className="text-slate-300 hover:text-white"
          >
            Home
          </Link>


          <Link
            to="/resume-analyzer"
            className="text-slate-300 hover:text-white"
          >
            Resume
          </Link>


          <Link
            to="/dsa-coach"
            className="text-slate-300 hover:text-white"
          >
            DSA
          </Link>


          <Link
            to="/mock-interview"
            className="text-slate-300 hover:text-white"
          >
            Interview
          </Link>


          <Link
            to="/ai-roadmap"
            className="text-slate-300 hover:text-white"
          >
            Roadmap
          </Link>


          <Link
            to="/system-design"
            className="text-slate-300 hover:text-white"
          >
            System Design
          </Link>


          <Link
            to="/job-search"
            className="text-slate-300 hover:text-white"
          >
            Jobs
          </Link>


          {/* Authentication */}

          {user ? (

            <>

              {user.role === "admin" && (

                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white"
                >
                  Admin
                </Link>

              )}


              <span className="text-slate-300">
                {user.name}
              </span>


              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30"
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-purple-500/40 text-purple-400"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Register
              </Link>

            </>

          )}

        </div>

      </div>

    </nav>
  );
};


export default Navbar;