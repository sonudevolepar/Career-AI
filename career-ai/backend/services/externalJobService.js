// backend/services/externalJobService.js
const axios = require("axios");

const fetchExternalJobs = async (role = "Developer", location = "Bengaluru") => {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. RapidAPI JSearch Method
  if (rapidApiKey) {
    try {
      console.log(`Fetching Live RapidAPI Jobs for "${role}" in "${location}"...`);

      const response = await axios({
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: `${role} in ${location}`,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "x-rapidapi-key": rapidApiKey.trim(),
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      });

      const jobsData = response.data?.data || [];

      if (jobsData.length > 0) {
        console.log(`RapidAPI Success: Fetched ${jobsData.length} live postings.`);
        return jobsData.map((job) => ({
          _id: job.job_id || String(Math.random()),
          id: job.job_id || String(Math.random()),
          title: job.job_title || role,
          company: job.employer_name || "Tech Company",
          location: job.job_city ? `${job.job_city}, ${job.job_country || "India"}` : location,
          type: job.job_employment_type === "FULLTIME" ? "Full Time" : "Part Time",
          experience: "0-2 Years",
          salary: job.job_max_salary ? `₹${job.job_max_salary}` : "Not Disclosed",
          skills: job.job_required_skills || ["JavaScript", "React", "Node.js"],
          description: job.job_description ? job.job_description.substring(0, 250) + "..." : "",
          applyUrl: job.job_apply_link || "#",
          companyUrl: job.employer_website || "#",
          recruiterEmail: "hr@company.com",
          recruiterPhone: "+91 9876543210",
          match: 85,
          matchingSkills: ["React", "Node.js"],
        }));
      }
    } catch (rapidError) {
      console.error(
        "RapidAPI Error Details:",
        rapidError.response?.data?.message || rapidError.message
      );
    }
  }

  // 2. Gemini API Backup (Compatible v1beta Endpoint)
  try {
    console.log("Fetching Gemini Fallback Jobs...");
    const prompt = `Generate 4 realistic IT job listings for role "${role}" in location "${location}". 
    Return ONLY a JSON array of objects. Do NOT wrap in markdown or backticks.
    Each object must have these exact keys: "id", "title", "company", "location", "type", "experience", "salary", "skills", "recruiterEmail", "recruiterPhone", "description", "applyUrl".`;

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