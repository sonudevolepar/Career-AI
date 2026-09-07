// backend/services/externalJobService.js
const axios = require("axios");

const fetchExternalJobs = async (role = "Developer", location = "Bengaluru") => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // ======================================================
  // 1. FREE OPEN API (REMOTIVE PUBLIC API - NO KEY NEEDED)
  // ======================================================
  try {
    console.log(`Fetching Live Open API Jobs for "${role}"...`);
    
    // Remotive Public API Endpoint (Free & Open)
    const response = await axios.get(`https://remotive.com/api/remote-jobs?search=${encodeURIComponent(role)}&limit=10`);
    const jobsData = response.data?.jobs || [];

    if (jobsData.length > 0) {
      console.log(`Open API Success: Found ${jobsData.length} live jobs!`);
      
      return jobsData.slice(0, 5).map((job) => ({
        _id: String(job.id),
        id: String(job.id),
        title: job.title || role,
        company: job.company_name || "Tech Company",
        location: job.candidate_required_location || location,
        type: job.job_type === "full_time" ? "Full Time" : "Remote",
        experience: "0-2 Years",
        salary: job.salary ? job.salary : "Not Disclosed",
        skills: job.tags || ["JavaScript", "React", "Node.js"],
        description: job.description ? job.description.replace(/<[^>]*>?/gm, "").substring(0, 200) + "..." : "",
        applyUrl: job.url || "#",
        companyUrl: "#",
        recruiterEmail: `hr@${job.company_name ? job.company_name.toLowerCase().replace(/[^a-z0-9]/g, "") : "company"}.com`,
        recruiterPhone: "+91 9876543210",
        match: 85,
        matchingSkills: ["React", "Node.js"]
      }));
    }
  } catch (openApiError) {
    console.error("Open API Error, switching to Gemini Fallback:", openApiError.message);
  }

  // ======================================================
  // 2. GEMINI AI FALLBACK (IF OPEN API HAS NO MATCHES)
  // ======================================================
  try {
    console.log("Generating Jobs via Gemini AI...");
    const prompt = `Generate 4 realistic IT job listings for role "${role}" in location "${location}". 
    Return ONLY a valid JSON array of objects. Do NOT wrap in markdown or backticks.
    Each object must have these exact keys:
    - "id": string
    - "title": string
    - "company": string
    - "location": string
    - "type": string (Full Time / Remote)
    - "experience": string
    - "salary": string
    - "skills": array of strings
    - "description": string
    - "applyUrl": string
    - "recruiterEmail": string
    - "recruiterPhone": string`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (geminiError) {
    console.error("Gemini Fallback Error:", geminiError.message || geminiError);
    return [];
  }
};

module.exports = { fetchExternalJobs };