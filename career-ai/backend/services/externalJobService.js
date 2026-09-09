const axios = require("axios");

// =====================================================
// CONFIG
// =====================================================

const JSEARCH_HOST =
  process.env.JSEARCH_HOST || "jsearch.p.rapidapi.com";

const JSEARCH_URL =
  process.env.JSEARCH_URL ||
  "https://jsearch.p.rapidapi.com/search";

const REMOTIVE_URL =
  "https://remotive.com/api/remote-jobs";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// =====================================================
// BASIC HELPERS
// =====================================================

const cleanText = (value = "") => {
  if (!value) return "";

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const normalizeString = (value = "") =>
  String(value || "")
    .toLowerCase()
    .trim();

const safeLimit = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    Math.max(number, 1),
    MAX_LIMIT
  );
};

// =====================================================
// LOCATION ALIASES
// =====================================================

const LOCATION_ALIASES = {
  bengaluru: [
    "bengaluru",
    "bangalore",
    "bengaluru urban",
  ],

  bangalore: [
    "bengaluru",
    "bangalore",
    "bengaluru urban",
  ],

  mumbai: [
    "mumbai",
    "bombay",
  ],

  bombay: [
    "mumbai",
    "bombay",
  ],

  gurugram: [
    "gurugram",
    "gurgaon",
  ],

  gurgaon: [
    "gurugram",
    "gurgaon",
  ],

  "new delhi": [
    "new delhi",
    "delhi",
    "delhi ncr",
  ],

  delhi: [
    "new delhi",
    "delhi",
    "delhi ncr",
  ],

  noida: [
    "noida",
    "greater noida",
  ],

  chennai: [
    "chennai",
    "madras",
  ],

  kolkata: [
    "kolkata",
    "calcutta",
  ],

  kochi: [
    "kochi",
    "cochin",
  ],

  ahmedabad: [
    "ahmedabad",
  ],

  hyderabad: [
    "hyderabad",
  ],

  pune: [
    "pune",
  ],

  jaipur: [
    "jaipur",
  ],

  indore: [
    "indore",
  ],

  bhubaneswar: [
    "bhubaneswar",
  ],

  ranchi: [
    "ranchi",
  ],

  patna: [
    "patna",
  ],
};

// =====================================================
// LOCATION HELPERS
// =====================================================

const getLocationAliases = (location = "") => {
  const normalized = normalizeString(location);

  if (!normalized) {
    return [];
  }

  return (
    LOCATION_ALIASES[normalized] || [
      normalized,
    ]
  );
};

const isIndiaLocation = (location = "") => {
  const text = normalizeString(location);

  return (
    text.includes("india") ||
    text.includes("indian")
  );
};

const isWorldwideLocation = (location = "") => {
  const text = normalizeString(location);

  return (
    text.includes("worldwide") ||
    text.includes("anywhere") ||
    text.includes("global") ||
    text.includes("remote")
  );
};

// =====================================================
// JOB LOCATION
// =====================================================

const normalizeLocation = (job) => {
  const city =
    job?.job_city ||
    job?.city ||
    "";

  const state =
    job?.job_state ||
    job?.state ||
    "";

  const country =
    job?.job_country ||
    job?.country ||
    "";

  const parts = [
    city,
    state,
    country,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  if (job?.job_location) {
    return String(job.job_location);
  }

  if (job?.location) {
    return String(job.location);
  }

  if (job?.candidate_required_location) {
    return String(
      job.candidate_required_location
    );
  }

  return "Remote";
};

// =====================================================
// EMPLOYMENT TYPE
// =====================================================

const normalizeEmploymentType = (
  job
) => {
  const value = normalizeString(
    job?.job_employment_type ||
      job?.job_employment_type_text ||
      job?.job_type ||
      job?.employment_type ||
      job?.type
  );

  if (
    value.includes("intern")
  ) {
    return "Internship";
  }

  if (
    value.includes("part")
  ) {
    return "Part Time";
  }

  if (
    value.includes("full") ||
    value.includes("permanent") ||
    value.includes("contract")
  ) {
    return "Full Time";
  }

  // Remotive sometimes uses "full_time"
  if (value === "full_time") {
    return "Full Time";
  }

  if (value === "part_time") {
    return "Part Time";
  }

  return "Full Time";
};

// =====================================================
// EXPERIENCE
// =====================================================

const normalizeExperience = (
  job
) => {
  const explicit =
    job?.job_experience_level ||
    job?.experience_level ||
    job?.experience;

  if (explicit) {
    const value = String(explicit);

    const lower =
      value.toLowerCase();

    if (
      lower.includes("entry") ||
      lower.includes("junior") ||
      lower.includes("fresher")
    ) {
      return "0-1 Years";
    }

    if (
      lower.includes("mid")
    ) {
      return "2-3 Years";
    }

    if (
      lower.includes("senior") ||
      lower.includes("lead") ||
      lower.includes("principal")
    ) {
      return "3+ Years";
    }
  }

  const text = normalizeString(
    `${job?.job_title || ""} ${
      job?.job_description || ""
    }`
  );

  if (
    text.includes("fresher") ||
    text.includes("fresh graduate") ||
    text.includes("entry level") ||
    text.includes("entry-level") ||
    text.includes("junior") ||
    text.includes("graduate") ||
    text.includes("0-1 year") ||
    text.includes("0 to 1 year") ||
    text.includes("no experience")
  ) {
    return "0-1 Years";
  }

  if (
    text.includes("senior") ||
    text.includes("sr.") ||
    text.includes("lead") ||
    text.includes("principal") ||
    text.includes("staff engineer")
  ) {
    return "3+ Years";
  }

  if (
    text.includes("mid-level") ||
    text.includes("mid level") ||
    text.includes("intermediate")
  ) {
    return "2-3 Years";
  }

  return "Not Disclosed";
};

// =====================================================
// SALARY
// =====================================================

const normalizeSalary = (
  job
) => {
  if (job?.job_salary) {
    return String(job.job_salary);
  }

  if (job?.salary) {
    return String(job.salary);
  }

  const min =
    job?.job_min_salary;

  const max =
    job?.job_max_salary;

  const currency =
    job?.job_salary_currency ||
    "";

  if (min && max) {
    return `${currency} ${min} - ${max}`.trim();
  }

  if (min) {
    return `${currency} ${min}+`.trim();
  }

  if (max) {
    return `Up to ${currency} ${max}`.trim();
  }

  return "Not Disclosed";
};

// =====================================================
// SKILLS
// =====================================================

const normalizeSkills = (
  job
) => {
  if (
    Array.isArray(
      job?.job_required_skills
    ) &&
    job.job_required_skills.length
  ) {
    return [
      ...new Set(
        job.job_required_skills
          .filter(Boolean)
          .map((skill) =>
            String(skill).trim()
          )
      ),
    ].slice(0, 20);
  }

  if (
    Array.isArray(job?.tags) &&
    job.tags.length
  ) {
    return [
      ...new Set(
        job.tags
          .filter(Boolean)
          .map((skill) =>
            String(skill).trim()
          )
      ),
    ].slice(0, 20);
  }

  const text =
    `${job?.job_title || ""} ${
      job?.title || ""
    } ${
      job?.job_description || ""
    } ${
      job?.description || ""
    }`.toLowerCase();

  const technologyMap = [
    "JavaScript",
    "TypeScript",
    "React",
    "React.js",
    "Angular",
    "Vue.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Python",
    "Django",
    "Flask",
    "Java",
    "Spring Boot",
    "C++",
    "C#",
    ".NET",
    "PHP",
    "Laravel",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "Git",
    "GitHub",
    "Machine Learning",
    "Artificial Intelligence",
    "TensorFlow",
    "PyTorch",
    "Selenium",
    "Cyber Security",
  ];

  return technologyMap.filter(
    (skill) =>
      text.includes(
        skill.toLowerCase()
      )
  );
};

// =====================================================
// WORK MODE
// =====================================================

const getWorkMode = (
  job
) => {
  if (
    job?.job_is_remote === true ||
    job?.job_is_remote === "true" ||
    job?.remote === true ||
    job?.remote === "true"
  ) {
    return "Remote";
  }

  const text = normalizeString(
    `${job?.job_location || ""} ${
      job?.candidate_required_location || ""
    } ${
      job?.location || ""
    } ${
      job?.job_description || ""
    }`
  );

  if (
    text.includes("hybrid")
  ) {
    return "Hybrid";
  }

  if (
    text.includes("remote") ||
    text.includes("worldwide") ||
    text.includes("anywhere") ||
    text.includes("work from home")
  ) {
    return "Remote";
  }

  return "On-site";
};

// =====================================================
// ROLE MATCH
// =====================================================

const roleMatches = (
  job,
  role
) => {
  if (!role) {
    return true;
  }

  const requested =
    normalizeString(role);

  const title =
    normalizeString(
      job?.title ||
        job?.job_title
    );

  const description =
    normalizeString(
      job?.description ||
        job?.job_description
    );

  const combined =
    `${title} ${description}`;

  const words = requested
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= 3
    );

  // Exact role in title
  if (
    title.includes(requested)
  ) {
    return true;
  }

  // Important technology aliases
  const aliases = {
    "software developer": [
      "software developer",
      "software engineer",
      "application developer",
      "application engineer",
    ],

    "software engineer": [
      "software engineer",
      "software developer",
      "application engineer",
    ],

    "frontend developer": [
      "frontend developer",
      "front end developer",
      "frontend engineer",
      "front-end developer",
    ],

    "backend developer": [
      "backend developer",
      "back end developer",
      "backend engineer",
      "back-end developer",
    ],

    "full stack developer": [
      "full stack developer",
      "full-stack developer",
      "fullstack developer",
      "full stack engineer",
    ],

    "mern stack developer": [
      "mern",
      "mern stack",
      "react",
      "node.js",
    ],

    "react developer": [
      "react developer",
      "react engineer",
      "react.js",
    ],

    "node.js developer": [
      "node.js developer",
      "node js developer",
      "node developer",
      "backend developer",
    ],
  };

  const roleAliases =
    aliases[requested];

  if (
    Array.isArray(roleAliases)
  ) {
    return roleAliases.some(
      (alias) =>
        combined.includes(alias)
    );
  }

  // At least 50% role words should match
  if (words.length === 0) {
    return true;
  }

  const matchedWords =
    words.filter((word) =>
      combined.includes(word)
    );

  return (
    matchedWords.length >=
    Math.ceil(words.length * 0.5)
  );
};

// =====================================================
// LOCATION MATCH
// =====================================================

const locationMatches = (
  jobLocation,
  selectedLocation,
  workMode = "Any"
) => {
  if (!selectedLocation) {
    return true;
  }

  const selected =
    normalizeString(
      selectedLocation
    );

  const jobText =
    normalizeString(
      jobLocation
    );

  const aliases =
    getLocationAliases(
      selectedLocation
    );

  // Exact city
  if (
    aliases.some((alias) =>
      jobText.includes(
        normalizeString(alias)
      )
    )
  ) {
    return true;
  }

  // For "All India"
  if (
    selected === "india"
  ) {
    return (
      isIndiaLocation(jobText) ||
      isWorldwideLocation(jobText)
    );
  }

  /*
   * For city search:
   *
   * Remote India jobs are useful when
   * workMode = Remote / Any.
   *
   * But worldwide jobs are NOT treated
   * as Bengaluru/Hyderabad/etc.
   */
  if (
    isIndiaLocation(jobText) &&
    (
      workMode === "Any" ||
      normalizeString(workMode) ===
        "remote"
    )
  ) {
    return true;
  }

  return false;
};

// =====================================================
// EXPERIENCE MATCH
// =====================================================

const experienceMatches = (
  job,
  requestedExperience
) => {
  if (!requestedExperience) {
    return true;
  }

  const requested =
    normalizeString(
      requestedExperience
    );

  const title =
    normalizeString(
      job?.title ||
        job?.job_title
    );

  const description =
    normalizeString(
      job?.description ||
        job?.job_description
    );

  const text =
    `${title} ${description}`;

  // Fresher
  if (
    requested === "fresher" ||
    requested === "0-1 years"
  ) {
    if (
      text.includes("senior") ||
      text.includes("sr.") ||
      text.includes("lead") ||
      text.includes("principal") ||
      text.includes("manager") ||
      text.includes("director") ||
      text.includes("5+ years") ||
      text.includes("4+ years") ||
      text.includes("3+ years")
    ) {
      return false;
    }

    return true;
  }

  if (
    requested === "1-2 years"
  ) {
    return !(
      text.includes("senior") ||
      text.includes("lead") ||
      text.includes("principal")
    );
  }

  if (
    requested === "2-3 years"
  ) {
    return !(
      text.includes("senior") ||
      text.includes("lead") ||
      text.includes("principal")
    );
  }

  if (
    requested === "3+ years"
  ) {
    return (
      text.includes("senior") ||
      text.includes("sr.") ||
      text.includes("lead") ||
      text.includes("principal") ||
      text.includes("experienced")
    );
  }

  return true;
};

// =====================================================
// JOB TYPE MATCH
// =====================================================

const jobTypeMatches = (
  jobType,
  job
) => {
  if (!jobType) {
    return true;
  }

  const requested =
    normalizeString(
      jobType
    );

  const type =
    normalizeString(
      job?.type
    );

  const mode =
    normalizeString(
      job?.mode
    );

  if (
    requested === "remote"
  ) {
    return (
      mode === "remote" ||
      type === "remote"
    );
  }

  return (
    type === requested
  );
};

// =====================================================
// WORK MODE MATCH
// =====================================================

const workModeMatches = (
  job,
  requestedMode
) => {
  if (
    !requestedMode ||
    requestedMode === "Any"
  ) {
    return true;
  }

  return (
    normalizeString(
      job?.mode
    ) ===
    normalizeString(
      requestedMode
    )
  );
};

// =====================================================
// NORMALIZE JSEARCH
// =====================================================

const normalizeJSearchJob = (
  job
) => {
  const id =
    job?.job_id;

  if (!id) {
    return null;
  }

  const title =
    job?.job_title ||
    "Software Engineer";

  const company =
    job?.employer_name ||
    "Unknown Company";

  const location =
    normalizeLocation(job);

  const description =
    cleanText(
      job?.job_description ||
        ""
    );

  const skills =
    normalizeSkills(job);

  const mode =
    getWorkMode(job);

  return {
    _id:
      `external-jsearch-${id}`,

    id:
      `external-jsearch-${id}`,

    externalId:
      String(id),

    source: "external",

    provider: "JSearch",

    isExternal: true,

    title,

    company,

    location,

    type:
      normalizeEmploymentType(job),

    experience:
      normalizeExperience(job),

    salary:
      normalizeSalary(job),

    skills,

    description,

    applyUrl:
      job?.job_apply_link ||
      job?.job_google_link ||
      "#",

    companyUrl:
      job?.employer_website ||
      "#",

    recruiterEmail: "",

    recruiterPhone: "",

    mode,

    match: 0,

    matchingSkills: [],

    postedAt:
      job?.job_posted_at_datetime_utc ||
      null,

    sourceUrl:
      job?.job_apply_link ||
      job?.job_google_link ||
      "#",

    sourceName:
      "JSearch",
  };
};

// =====================================================
// FETCH JSEARCH
// =====================================================

const fetchJSearchJobs = async (
  role = "Software Engineer",
  location = "India",
  options = {}
) => {
  const apiKey =
    process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    console.warn(
      "RAPIDAPI_KEY not configured. JSearch skipped."
    );

    return [];
  }

  const limit =
    safeLimit(
      options.limit
    );

  const safeRole =
    role?.trim() ||
    "Software Engineer";

  const safeLocation =
    location?.trim() ||
    "India";

  const queryParts = [
    safeRole,
    "in",
    safeLocation,
    "India",
  ];

  if (
    options.jobType &&
    options.jobType !== "Remote"
  ) {
    queryParts.push(
      options.jobType
    );
  }

  if (
    options.experience &&
    options.experience !== "Fresher"
  ) {
    queryParts.push(
      options.experience
    );
  }

  const query =
    queryParts.join(" ");

  console.log(
    `[JSearch] Query: ${query}`
  );

  try {
    const response =
      await axios.get(
        JSEARCH_URL,
        {
          params: {
            query,
            page: 1,
            num_pages: 1,
            date_posted: "all",
          },

          headers: {
            "X-RapidAPI-Key":
              apiKey,

            "X-RapidAPI-Host":
              JSEARCH_HOST,
          },

          timeout: 15000,
        }
      );

    const data =
      Array.isArray(
        response.data?.data
      )
        ? response.data.data
        : [];

    console.log(
      `[JSearch] Received: ${data.length}`
    );

    return data
      .map(
        normalizeJSearchJob
      )
      .filter(Boolean)
      .slice(0, limit);

  } catch (error) {
    console.error(
      "[JSearch] API Error:",
      error.response?.status ||
        "",
      error.response?.data ||
        error.message
    );

    return [];
  }
};

// =====================================================
// NORMALIZE REMOTIVE
// =====================================================

const normalizeRemotiveJob = (
  job
) => {
  if (!job?.id) {
    return null;
  }

  const title =
    job.title ||
    "Software Engineer";

  const company =
    job.company_name ||
    "Unknown Company";

  const location =
    job.candidate_required_location ||
    "Remote";

  const description =
    cleanText(
      job.description ||
        ""
    );

  const skills =
    Array.isArray(job.tags)
      ? job.tags
          .filter(Boolean)
          .map((skill) =>
            String(skill).trim()
          )
      : [];

  let type = "Full Time";

  if (
    job.job_type ===
    "part_time"
  ) {
    type = "Part Time";
  }

  if (
    job.job_type ===
    "full_time"
  ) {
    type = "Full Time";
  }

  return {
    _id:
      `external-remotive-${job.id}`,

    id:
      `external-remotive-${job.id}`,

    externalId:
      String(job.id),

    source: "external",

    provider: "Remotive",

    isExternal: true,

    title,

    company,

    location,

    type,

    experience:
      normalizeExperience({
        title,
        description,
      }),

    salary:
      job.salary ||
      "Not Disclosed",

    skills,

    description,

    applyUrl:
      job.url ||
      "#",

    companyUrl:
      "#",

    recruiterEmail: "",

    recruiterPhone: "",

    mode: "Remote",

    match: 0,

    matchingSkills: [],

    postedAt:
      job.publication_date ||
      null,

    sourceUrl:
      job.url ||
      "#",

    sourceName:
      "Remotive",
  };
};

// =====================================================
// FETCH REMOTIVE
// =====================================================

const fetchRemotiveJobs = async (
  role = "Software Engineer",
  location = "India",
  options = {}
) => {
  const limit =
    safeLimit(
      options.limit
    );

  try {
    console.log(
      `[Remotive] Query: ${role}`
    );

    const response =
      await axios.get(
        REMOTIVE_URL,
        {
          params: {
            search:
              role ||
              "Software Engineer",

            limit: Math.max(
              limit,
              30
            ),
          },

          timeout: 15000,
        }
      );

    const jobs =
      Array.isArray(
        response.data?.jobs
      )
        ? response.data.jobs
        : [];

    console.log(
      `[Remotive] Received: ${jobs.length}`
    );

    return jobs
      .map(
        normalizeRemotiveJob
      )
      .filter(Boolean);

  } catch (error) {
    console.error(
      "[Remotive] API Error:",
      error.message
    );

    return [];
  }
};

// =====================================================
// APPLY ALL FILTERS TO EXTERNAL JOB
// =====================================================

const filterExternalJobs = (
  jobs,
  role,
  location,
  options
) => {
  const {
    jobType,
    experience,
    workMode,
  } = options;

  return jobs.filter(
    (job) => {
      // ROLE
      if (
        !roleMatches(
          job,
          role
        )
      ) {
        return false;
      }

      // LOCATION
      if (
        !locationMatches(
          job.location,
          location,
          workMode || "Any"
        )
      ) {
        return false;
      }

      // JOB TYPE
      if (
        jobType &&
        !jobTypeMatches(
          jobType,
          job
        )
      ) {
        return false;
      }

      // WORK MODE
      if (
        workMode &&
        workMode !== "Any" &&
        !workModeMatches(
          job,
          workMode
        )
      ) {
        return false;
      }

      // EXPERIENCE
      if (
        experience &&
        !experienceMatches(
          job,
          experience
        )
      ) {
        return false;
      }

      return true;
    }
  );
};

// =====================================================
// DEDUPLICATE
// =====================================================

const deduplicateJobs = (
  jobs = []
) => {
  const seen = new Set();

  return jobs.filter(
    (job) => {
      const title =
        normalizeString(
          job.title
        );

      const company =
        normalizeString(
          job.company
        );

      const location =
        normalizeString(
          job.location
        );

      const applyUrl =
        normalizeString(
          job.applyUrl
        );

      const key =
        applyUrl &&
        applyUrl !== "#"
          ? `url:${applyUrl}`
          : `${title}|${company}|${location}`;

      if (
        seen.has(key)
      ) {
        return false;
      }

      seen.add(key);

      return true;
    }
  );
};

// =====================================================
// MAIN EXTERNAL SEARCH
// =====================================================

const fetchExternalJobs = async (
  role = "Software Engineer",
  location = "India",
  options = {}
) => {
  const safeRole =
    role?.trim() ||
    "Software Engineer";

  const safeLocation =
    location?.trim() ||
    "India";

  const safeOptions = {
    limit:
      safeLimit(
        options.limit
      ),

    jobType:
      options.jobType || "",

    experience:
      options.experience || "",

    workMode:
      options.workMode || "Any",
  };

  console.log(
    "=========================================="
  );

  console.log(
    "[External Jobs]"
  );

  console.log(
    "Role:",
    safeRole
  );

  console.log(
    "Location:",
    safeLocation
  );

  console.log(
    "Experience:",
    safeOptions.experience
  );

  console.log(
    "Job Type:",
    safeOptions.jobType
  );

  console.log(
    "Work Mode:",
    safeOptions.workMode
  );

  console.log(
    "=========================================="
  );

  const [
    jsearchJobs,
    remotiveJobs,
  ] =
    await Promise.all([
      fetchJSearchJobs(
        safeRole,
        safeLocation,
        safeOptions
      ),

      fetchRemotiveJobs(
        safeRole,
        safeLocation,
        safeOptions
      ),
    ]);

  const allJobs =
    deduplicateJobs([
      ...jsearchJobs,
      ...remotiveJobs,
    ]);

  console.log(
    `[External Jobs] Before filtering: ${allJobs.length}`
  );

  let filtered =
    filterExternalJobs(
      allJobs,
      safeRole,
      safeLocation,
      safeOptions
    );

  /*
   * FALLBACK:
   *
   * If city-specific search has no exact
   * result, do NOT show Worldwide jobs.
   *
   * For Any / Remote, India remote jobs
   * are allowed.
   */
  if (
    filtered.length === 0 &&
    safeLocation &&
    safeLocation.toLowerCase() !==
      "india"
  ) {
    const indiaRemote =
      allJobs.filter(
        (job) => {
          if (
            job.mode !==
            "Remote"
          ) {
            return false;
          }

          const locationText =
            normalizeString(
              job.location
            );

          if (
            !isIndiaLocation(
              locationText
            )
          ) {
            return false;
          }

          if (
            !roleMatches(
              job,
              safeRole
            )
          ) {
            return false;
          }

          if (
            safeOptions.jobType &&
            !jobTypeMatches(
              safeOptions.jobType,
              job
            )
          ) {
            return false;
          }

          if (
            safeOptions.experience &&
            !experienceMatches(
              job,
              safeOptions.experience
            )
          ) {
            return false;
          }

          return (
            safeOptions.workMode ===
              "Any" ||
            safeOptions.workMode ===
              "Remote"
          );
        }
      );

    filtered =
      deduplicateJobs(
        indiaRemote
      );

    if (
      filtered.length > 0
    ) {
      console.log(
        `[External Jobs] Using India remote fallback: ${filtered.length}`
      );
    }
  }

  console.log(
    `[External Jobs] Final: ${filtered.length}`
  );

  return filtered.slice(
    0,
    safeOptions.limit
  );
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  fetchExternalJobs,
  fetchJSearchJobs,
  fetchRemotiveJobs,
  normalizeJSearchJob,
  normalizeRemotiveJob,
};