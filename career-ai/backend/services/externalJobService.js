const axios = require("axios");

const ADZUNA_BASE_URL =
  "https://api.adzuna.com/v1/api/jobs/in/search/1";

/* =====================================================
   LOCATION
===================================================== */

const normalizeLocation = (location = "") => {
  if (!location) return "";

  if (location.toLowerCase() === "all india") {
    return "";
  }

  return location.trim();
};


/* =====================================================
   JOB TYPE
===================================================== */

const applyJobTypeFilter = (params, jobType) => {
  const type = (jobType || "").toLowerCase();

  if (type === "full time") {
    params.full_time = 1;
  }

  if (type === "part time") {
    params.part_time = 1;
  }
};


/* =====================================================
   SEARCH ADZUNA
===================================================== */

const searchAdzuna = async ({
  role,
  location,
  jobType,
  workMode,
}) => {
  const params = {
    app_id: process.env.ADZUNA_APP_ID,
    app_key: process.env.ADZUNA_APP_KEY,

    results_per_page: 30,

    what: role || "software developer",

    sort_by: "date",
  };

  if (location) {
    params.where = location;
  }

  applyJobTypeFilter(params, jobType);

  /*
    Work mode is added to keyword only when user
    specifically selects Remote/Hybrid/On-site.
  */

  if (workMode === "Remote") {
    params.what += " remote";
  }

  if (workMode === "Hybrid") {
    params.what += " hybrid";
  }

  if (workMode === "On-site") {
    params.what += " onsite";
  }

  console.log("=================================");
  console.log("Adzuna Search");
  console.log("Role:", role || "IT Jobs");
  console.log("Location:", location || "All India");
  console.log("Job Type:", jobType || "Any");
  console.log("Work Mode:", workMode || "Any");
  console.log("Search Query:", params.what);
  console.log("=================================");

  const response = await axios.get(
    ADZUNA_BASE_URL,
    {
      params,
      timeout: 15000,
    }
  );

  return response.data?.results || [];
};


/* =====================================================
   EXPERIENCE MATCH SCORE
===================================================== */

const calculateExperienceScore = (
  job,
  experience
) => {
  if (!experience || experience === "Any") {
    return 70;
  }

  const text = `
    ${job.title || ""}
    ${job.description || ""}
  `.toLowerCase();

  if (experience === "Fresher") {
    if (
      text.includes("fresher") ||
      text.includes("entry level") ||
      text.includes("graduate") ||
      text.includes("0-1") ||
      text.includes("junior")
    ) {
      return 95;
    }

    return 70;
  }

  if (experience === "0-1 Years") {
    if (
      text.includes("0-1") ||
      text.includes("entry level") ||
      text.includes("fresher") ||
      text.includes("junior")
    ) {
      return 95;
    }

    return 75;
  }

  if (experience === "1-2 Years") {
    if (
      text.includes("1-2") ||
      text.includes("1 year") ||
      text.includes("2 years")
    ) {
      return 95;
    }

    return 75;
  }

  if (experience === "2-3 Years") {
    if (
      text.includes("2-3") ||
      text.includes("2 years") ||
      text.includes("3 years")
    ) {
      return 95;
    }

    return 75;
  }

  if (experience === "3+ Years") {
    if (
      text.includes("3 years") ||
      text.includes("4 years") ||
      text.includes("5 years") ||
      text.includes("senior")
    ) {
      return 95;
    }

    return 75;
  }

  return 70;
};


/* =====================================================
   NORMALIZE JOB
===================================================== */

const normalizeJob = (
  job,
  {
    experience,
    workMode,
  }
) => {

  let salary = "Not Disclosed";

  if (
    job.salary_min &&
    job.salary_max
  ) {
    salary =
      `₹${Number(job.salary_min).toLocaleString("en-IN")} - ₹${Number(job.salary_max).toLocaleString("en-IN")}`;
  } else if (job.salary_min) {
    salary =
      `From ₹${Number(job.salary_min).toLocaleString("en-IN")}`;
  }


  return {
    id: `adzuna_${job.id}`,

    title:
      job.title ||
      "Software Developer",

    company:
      job.company?.display_name ||
      "Company Not Specified",

    location:
      job.location?.display_name ||
      "India",

    type:
      job.contract_time ||
      "Not Specified",

    contractType:
      job.contract_type ||
      "",

    experience:
      experience ||
      "Not Specified",

    workMode:
      workMode ||
      "Not Specified",

    salary,

    description:
      job.description ||
      "Job description not available.",

    skills: [],

    /*
      IMPORTANT:
      This is Adzuna's real external job URL.
    */
    applyUrl:
      job.redirect_url ||
      null,

    source: "external",

    provider: "Adzuna",

    isExternal: true,

    match:
      calculateExperienceScore(
        job,
        experience
      ),

    created:
      job.created ||
      null,

    category:
      job.category?.label ||
      "IT Jobs",
  };
};


/* =====================================================
   MAIN FUNCTION
===================================================== */

const fetchExternalJobs = async ({
  role = "",
  location = "",
  experience = "",
  jobType = "",
  workMode = "",
}) => {

  try {

    /* -----------------------------------------------
       CHECK CREDENTIALS
    ----------------------------------------------- */

    if (
      !process.env.ADZUNA_APP_ID ||
      !process.env.ADZUNA_APP_KEY
    ) {
      console.error(
        "❌ Adzuna API credentials are missing"
      );

      return [];
    }


    const normalizedLocation =
      normalizeLocation(location);


    /* -----------------------------------------------
       FIRST SEARCH
    ----------------------------------------------- */

    let jobs = await searchAdzuna({
      role:
        role === "All IT Jobs"
          ? "IT jobs"
          : role,

      location:
        normalizedLocation,

      jobType,

      workMode,
    });


    console.log(
      `✅ First Search Jobs: ${jobs.length}`
    );


    /* -----------------------------------------------
       FALLBACK SEARCH
       
       If exact city gives zero results,
       search India-wide.
    ----------------------------------------------- */

    if (
      jobs.length === 0 &&
      normalizedLocation
    ) {

      console.log(
        "⚠️ No jobs found in selected city."
      );

      console.log(
        "🔄 Trying India-wide fallback..."
      );


      jobs = await searchAdzuna({
        role:
          role === "All IT Jobs"
            ? "IT jobs"
            : role,

        location: "",

        jobType,

        workMode,
      });


      console.log(
        `✅ Fallback Jobs: ${jobs.length}`
      );
    }


    /* -----------------------------------------------
       NORMALIZE
    ----------------------------------------------- */

    const normalizedJobs =
      jobs.map((job) =>
        normalizeJob(
          job,
          {
            experience,
            workMode,
          }
        )
      );


    /* -----------------------------------------------
       ONLY JOBS WITH REAL URL
    ----------------------------------------------- */

    const validJobs =
      normalizedJobs.filter(
        (job) =>
          job.applyUrl &&
          job.applyUrl.startsWith("http")
      );


    /* -----------------------------------------------
       REMOVE DUPLICATES
    ----------------------------------------------- */

    const uniqueJobs = [];

    const seen = new Set();

    for (const job of validJobs) {

      const key =
        `${job.title}-${job.company}-${job.location}`
          .toLowerCase()
          .trim();

      if (!seen.has(key)) {

        seen.add(key);

        uniqueJobs.push(job);
      }
    }


    console.log(
      `✅ Final External Jobs: ${uniqueJobs.length}`
    );


    return uniqueJobs;


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ADZUNA API ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    console.error(
      "Status:",
      error.response?.status ||
      "No Response"
    );

    console.error(
      "Response:",
      error.response?.data ||
      "No response data"
    );

    console.error(
      "================================="
    );

    return [];
  }
};


module.exports = {
  fetchExternalJobs,
};