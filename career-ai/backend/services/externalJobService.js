// backend/services/externalJobService.js
const axios = require("axios");

const fetchExternalJobs = async (role = "Developer", location = "Noida") => {
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // ======================================================
  // METHOD 1: RAPIDAPI JSEARCH (REAL-TIME LIVE JOBS)
  // ======================================================
  if (rapidApiKey) {
    try {
      console.log(`Fetching Live RapidAPI Jobs for ${role} in ${location}...`);

      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: `${role} in ${location}`,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const jobsData = response.data?.data || [];

      if (jobsData.length > 0) {
        return jobsData.map((job) => {
          const companySlug = job.employer_name
            ? job.employer_name.toLowerCase().replace(/[^a-z0-9]/g, "")
            : "company";

          return {
            _id: job.job_id || String(Math.random()),
            id: job.job_id || String(Math.random()),
            title: job.job_title || role,
            company: job.employer_name || "Tech Company",
            location: job.job_city
              ? `${job.job_city}, ${job.job_country || "India"}`
              : location,
            type:
              job.job_employment_type === "FULLTIME"
                ? "Full Time"
                : "Part Time",
            experience: "0-2 Years",
            salary: job.job_max_salary
              ? `₹${job.job_max_salary}`
              : "Not Disclosed",
            skills: job.job_required_skills || [
              "JavaScript",
              "React",
              "Node.js",
            ],
            description: job.job_description
              ? job.job_description.substring(0, 250) + "..."
              : "No description provided.",
            applyUrl: job.job_apply_link || "#",
            companyUrl: job.employer_website || "#",
            recruiterEmail: `hr@${companySlug}.com`,
            recruiterPhone: "+91 9876543210",
            match: 85,
            matchingSkills: ["React", "Node.js"],
          };
        });
      }
    } catch (rapidError) {
      console.error(
        "RapidAPI Error, Switching to Gemini API Fallback:",
        rapidError.message
      );
    }
  }

  // ======================================================
  // METHOD 2: GEMINI API FALLBACK (IF RAPIDAPI FAILS / NO KEY)
  // ======================================================
  try {
    console.log("Generating Fallback Jobs using Gemini API...");

    const prompt = `Generate 4 realistic IT job listings for role "${role}" in location "${location}". 
    Return ONLY a JSON array of objects. Do NOT wrap in markdown or backticks.
    Each object must have these keys:
    - "id": unique string
    - "title": string
    - "company": string
    - "location": string
    - "type": string (Full Time / Part Time / Remote)
    - "experience": string (e.g. "0-1 Years")
    - "salary": string (e.g. "₹ 6-8 LPA")
    - "skills": array of strings (e.g. ["React", "Node.js"])
    - "recruiterEmail": string (valid mock company email, e.g. hr@company.com)
    - "recruiterPhone": string (valid Indian phone number format)
    - "description": string (short 1-2 sentence description)
    - "applyUrl": string (URL e.g. "https://example.com/apply")`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const rawText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (geminiError) {
    console.error("Gemini External Job Service Error:", geminiError);
    return [];
  }
};

module.exports = { fetchExternalJobs };