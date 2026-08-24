import React, { useState } from 'react';
import {
  UploadCloud,
  Search,
  CheckCircle2,
  FileText,
  BarChart3,
  Loader2,
  AlertCircle,
  XCircle,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

const ResumeAnalyzerUI = () => {
  const [jobRole, setJobRole] = useState('MERN STACK DEVELOPMENT');
  const [file, setFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ==============================
  // ANALYZE RESUME
  // ==============================
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload your resume PDF first.');
      return;
    }

    if (!jobRole.trim()) {
      setError('Please enter a target job role.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const formData = new FormData();

      // PDF file
      formData.append('resume', file);

      // Backend expects targetRole
      formData.append('targetRole', jobRole);

      const response = await fetch(
        'http://localhost:5000/api/resume/analyze',
        {
          method: 'POST',
          body: formData,
        }
      );

      const result = await response.json();

      console.log('FULL API RESPONSE:', result);

      if (!response.ok) {
        throw new Error(
          result.message || 'Resume analysis failed.'
        );
      }

      if (!result.data) {
        throw new Error(
          'Analysis data was not returned by the server.'
        );
      }

      // Backend response:
      // {
      //   success: true,
      //   data: analysis
      // }
      setAnalysis(result.data);

    } catch (err) {
      console.error('Analysis Error:', err);

      setError(
        err.message || 'Something went wrong while analyzing resume.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // API DATA
  // ==============================

  const score = Math.min(
    100,
    Math.max(
      0,
      Number(
        analysis?.atsScore ??
        analysis?.score ??
        analysis?.atsMatchScore ??
        0
      )
    )
  );

  const summary =
    analysis?.summary ??
    analysis?.executiveSummary ??
    analysis?.aiSummary ??
    'No summary available.';

  const matchedSkills = Array.isArray(
    analysis?.matchedSkills
  )
    ? analysis.matchedSkills
    : Array.isArray(analysis?.skills?.matched)
      ? analysis.skills.matched
      : [];

  const missingSkills = Array.isArray(
    analysis?.missingSkills
  )
    ? analysis.missingSkills
    : Array.isArray(analysis?.skills?.missing)
      ? analysis.skills.missing
      : [];

  const strengths = Array.isArray(
    analysis?.strengths
  )
    ? analysis.strengths
    : [];

  const weaknesses = Array.isArray(
    analysis?.weaknesses
  )
    ? analysis.weaknesses
    : [];

  const improvementSuggestions = Array.isArray(
    analysis?.improvementSuggestions
  )
    ? analysis.improvementSuggestions
    : [];

  // ==============================
  // SCORE LABEL
  // ==============================

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Needs Improvement';
  };

  const getScoreColor = () => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700';
    if (score >= 60) return 'bg-blue-50 text-blue-700';
    if (score >= 40) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">

      <div className="max-w-5xl mx-auto space-y-10">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="text-center space-y-3">

          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            AI Resume Analyzer
          </h1>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            Apna resume analyze karke ATS Score aur recommendations dekhein
          </p>

        </div>


        {/* =========================================
            INPUT CARD
        ========================================= */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

          <div className="p-8 md:p-10">

            <form
              onSubmit={handleAnalyze}
              className="space-y-8"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* JOB ROLE */}
                <div className="space-y-3">

                  <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">

                    <Search className="w-4 h-4 mr-2 text-blue-500" />

                    Target Job Role

                  </label>

                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => {
                      setJobRole(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. Data Analyst"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-700 font-medium transition-all outline-none"
                  />

                  <p className="text-xs text-slate-400">
                    Example: MERN Developer, Data Analyst,
                    Java Developer, Frontend Developer
                  </p>

                </div>


                {/* FILE UPLOAD */}
                <div className="space-y-3">

                  <label className="flex items-center text-sm font-bold text-slate-700 uppercase tracking-wider">

                    <UploadCloud className="w-4 h-4 mr-2 text-blue-500" />

                    Upload Resume (PDF)

                  </label>

                  <div className="relative group">

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {

                        const selectedFile =
                          e.target.files?.[0];

                        setFile(selectedFile || null);
                        setError('');
                        setAnalysis(null);

                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    <div className="w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl group-hover:border-blue-500 group-hover:bg-blue-50 transition-all flex items-center justify-between">

                      <span className="text-slate-500 font-medium truncate">

                        {file
                          ? file.name
                          : 'Choose File or Drag & Drop'}

                      </span>

                      <span className="bg-white text-blue-600 text-sm font-bold px-4 py-2 rounded-lg shadow-sm border border-slate-200">

                        Browse

                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* ERROR */}
              {error && (

                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">

                  <AlertCircle className="w-5 h-5 shrink-0" />

                  <span>
                    {error}
                  </span>

                </div>

              )}


              {/* ANALYZE BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto md:px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mx-auto"
              >

                {loading ? (

                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />

                    Analyzing Resume...

                  </>

                ) : (

                  <>
                    <BarChart3 className="w-5 h-5 mr-2" />

                    Analyze Resume

                  </>

                )}

              </button>

            </form>

          </div>

        </div>


        {/* =========================================
            ANALYSIS RESULT
        ========================================= */}
        {analysis && (

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <h2 className="text-2xl font-bold text-slate-800 flex items-center">

              <BarChart3 className="w-6 h-6 mr-3 text-indigo-500" />

              Analysis Result

            </h2>


            {/* SCORE + SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


              {/* =====================================
                  ATS SCORE
              ===================================== */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center">

                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
                  ATS Match Score
                </h3>

                <div className="relative w-40 h-40 flex items-center justify-center">

                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 160 160"
                  >

                    {/* Background */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-slate-100"
                      strokeWidth="12"
                      fill="none"
                    />

                    {/* Progress */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      className="stroke-blue-500"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="440"
                      strokeDashoffset={
                        440 - (440 * score) / 100
                      }
                      strokeLinecap="round"
                    />

                  </svg>


                  <div className="absolute flex flex-col items-center">

                    <span className="text-5xl font-black text-slate-800">
                      {score}
                    </span>

                    <span className="text-sm font-bold text-slate-400">
                      / 100
                    </span>

                  </div>

                </div>


                <div
                  className={`mt-6 px-4 py-2 rounded-full text-sm font-bold ${getScoreColor()}`}
                >
                  {getScoreLabel()}
                </div>

              </div>


              {/* =====================================
                  SUMMARY
              ===================================== */}
              <div className="lg:col-span-2">

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 shadow-xl text-white h-full">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="p-2 bg-white/10 rounded-lg">

                      <FileText className="w-5 h-5 text-blue-300" />

                    </div>

                    <div>

                      <h3 className="text-lg font-bold">
                        AI Executive Summary
                      </h3>

                      <p className="text-xs text-slate-400 mt-1">
                        Analysis for: {jobRole}
                      </p>

                    </div>

                  </div>

                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    {summary}
                  </p>

                </div>

              </div>

            </div>


            {/* =========================================
                SKILLS SECTION
            ========================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* =====================================
                  MATCHED SKILLS
              ===================================== */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">

                <div className="flex items-center gap-3 mb-6">

                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />

                  <div>

                    <h3 className="text-lg font-bold text-slate-800">
                      Matched Skills
                    </h3>

                    <p className="text-xs text-slate-400">
                      Skills found in your resume
                    </p>

                  </div>

                </div>


                {matchedSkills.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {matchedSkills.map((skill, index) => (

                      <span
                        key={index}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                ) : (

                  <p className="text-slate-500">
                    No matched skills found.
                  </p>

                )}

              </div>


              {/* =====================================
                  MISSING SKILLS
              ===================================== */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">

                <div className="flex items-center gap-3 mb-6">

                  <XCircle className="w-6 h-6 text-red-500" />

                  <div>

                    <h3 className="text-lg font-bold text-slate-800">
                      Missing / Mismatch Skills
                    </h3>

                    <p className="text-xs text-slate-400">
                      Skills important for this job role
                    </p>

                  </div>

                </div>


                {missingSkills.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {missingSkills.map((skill, index) => (

                      <span
                        key={index}
                        className="px-4 py-2 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-100"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                ) : (

                  <p className="text-emerald-600 font-medium">
                    Great! No major missing skills detected for this role.
                  </p>

                )}

              </div>

            </div>


            {/* =========================================
                STRENGTHS + WEAKNESSES
            ========================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* STRENGTHS */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">

                <div className="flex items-center gap-3 mb-6">

                  <TrendingUp className="w-6 h-6 text-emerald-500" />

                  <h3 className="text-lg font-bold text-slate-800">
                    Strengths
                  </h3>

                </div>


                {strengths.length > 0 ? (

                  <ul className="space-y-3">

                    {strengths.map((item, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >

                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />

                        <span>
                          {item}
                        </span>

                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="text-slate-500">
                    No strengths available.
                  </p>

                )}

              </div>


              {/* WEAKNESSES */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">

                <div className="flex items-center gap-3 mb-6">

                  <AlertTriangle className="w-6 h-6 text-orange-500" />

                  <h3 className="text-lg font-bold text-slate-800">
                    Weaknesses
                  </h3>

                </div>


                {weaknesses.length > 0 ? (

                  <ul className="space-y-3">

                    {weaknesses.map((item, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >

                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />

                        <span>
                          {item}
                        </span>

                      </li>

                    ))}

                  </ul>

                ) : (

                  <p className="text-slate-500">
                    No weaknesses available.
                  </p>

                )}

              </div>

            </div>


            {/* =========================================
                IMPROVEMENT SUGGESTIONS
            ========================================= */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100/50">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-2 bg-white rounded-xl shadow-sm">

                  <Lightbulb className="w-6 h-6 text-yellow-500" />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-slate-800">
                    Improvement Suggestions
                  </h3>

                  <p className="text-sm text-slate-500">
                    How to improve your resume for {jobRole}
                  </p>

                </div>

              </div>


              {improvementSuggestions.length > 0 ? (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {improvementSuggestions.map(
                    (suggestion, index) => (

                      <div
                        key={index}
                        className="bg-white rounded-2xl p-5 border border-blue-100"
                      >

                        <div className="flex items-start gap-3">

                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold shrink-0">
                            {index + 1}
                          </span>

                          <p className="text-sm text-slate-600 leading-relaxed">
                            {suggestion}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-slate-500">
                  No improvement suggestions available.
                </p>

              )}

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default ResumeAnalyzerUI;