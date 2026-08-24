import React, { useState } from 'react';
import { UploadCloud, FileText, Sparkles, Loader2 } from 'lucide-react'; //

export default function AIAnalytics() {
  const [file, setFile] = useState(null); //
  const [jobRole, setJobRole] = useState(""); //
  const [isAnalyzing, setIsAnalyzing] = useState(false); //[cite: 1]
  const [analysisResult, setAnalysisResult] = useState(null);

  // File select handle karne ke liye
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Ye function button click par chalega[cite: 1]
  const handleAnalyzeClick = async () => { //[cite: 1]
    if (!file || !jobRole) { //[cite: 1]
      alert("Please upload a resume and enter a job role."); //[cite: 1]
      return; //[cite: 1]
    }

    setIsAnalyzing(true); //[cite: 1]

    try {
      // NOTE: API ko text bhejne se pehle aapko PDF file se text extract karna padega (jaise pdfjs-dist library ka use karke)[cite: 1].
      // Abhi ke liye hum yahan ek dummy extracted text bhej rahe hain.
      const extractedText = `Simulated extracted text from ${file.name} for the role of ${jobRole}`;

      // Ab hum apna Backend API call kar rahe hain (Direct Gemini nahi)
      const response = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: extractedText,
          jobRole: jobRole
        })
      });

      const data = await response.json();
      
      if (data.success) {
         console.log("Backend Response:", data.aiResponse);
         setAnalysisResult(data.aiResponse);
      } else {
         console.error("Backend Error:", data.error);
         alert("Analysis failed. Please check backend logs.");
      }

    } catch (error) {
      console.error("Error calling backend API:", error); //[cite: 1]
    } finally {
      setIsAnalyzing(false); //[cite: 1]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      {/* Header Section */}
      <header className="max-w-3xl mx-auto text-center mt-12 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3 flex justify-center items-center gap-2">
          <Sparkles className="text-blue-600 h-8 w-8" />
          AI Resume Analytics
        </h1>
        <p className="text-lg text-slate-500">
          Advanced ATS analysis powered by Gemini AI.
        </p>
      </header>

      {/* Main Input Form */}
      <main className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        
        {/* Job Role Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Target Job Role</label>
          <input 
            type="text" 
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Senior MERN Stack Developer" 
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume (PDF)</label>
          <label className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
            <UploadCloud className="h-12 w-12 text-slate-400 group-hover:text-blue-500 transition-colors mb-4" />
            <p className="text-sm text-slate-600 font-medium">
              {file ? `Selected: ${file.name}` : "Drag & drop your resume here"}
            </p>
            <p className="text-xs text-slate-400 mt-1">or click to browse files (PDF only, max 5MB)</p>
            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        {/* Action Button (Loading state ke sath) */}
        <button 
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:bg-blue-400"
        >
          {isAnalyzing ? ( //[cite: 1]
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Analyzing... 
            </>
          ) : (
            "Analyze Resume"
          )}
        </button>
      </main>

      {/* Results Section (Agar result aaya hai tabhi dikhega) */}
      {analysisResult && (
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Analysis Result</h2>
            <p className="text-slate-500 text-sm mt-1">Based on "{jobRole}"</p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-500"/> AI Feedback
            </h3>
            <div className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap">
              {/* Yahan API ka text render hoga */}
              {analysisResult.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback received."}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}