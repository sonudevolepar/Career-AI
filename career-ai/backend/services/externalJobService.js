// backend/services/externalJobService.js
const fetchExternalJobs = async (role = "Developer", location = "Noida") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const prompt = `Generate 4 realistic IT job listings for role "${role}" in location "${location}". 
        Return ONLY a JSON array of objects. Do NOT wrap in markdown or backticks.
        Each object must have these keys:
        - "id": unique string
        - "title": string
        - "company": string
        - "location": string
        - "type": string (Full-Time / Part-Time / Remote)
        - "recruiterEmail": string (valid mock company email, e.g. hr@company.com)
        - "recruiterPhone": string (valid Indian phone number format)
        - "description": string (short 1-2 sentence description)`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        
        const cleanedText = rawText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (error) {
        console.error("External Job Service Error:", error);
        return [];
    }
};

module.exports = { fetchExternalJobs };