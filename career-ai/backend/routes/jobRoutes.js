// backend/routes/jobRoutes.js

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const Job = require("../models/Job");
const Application = require("../models/Application");

const { fetchExternalJobs } = require("../services/externalJobService");

const {
  calculateJobMatch,
  getMatchingSkills,
} = require("../services/jobMatchingService");

// ============================================================
// OPTIONAL EMAIL SERVICE
// ============================================================

let sendEmail = null;

try {
  const emailService = require("../services/emailService");

  if (
    emailService &&
    typeof emailService.sendEmail === "function"
  ) {
    sendEmail = emailService.sendEmail;
  }
} catch (error) {
  console.warn(
    "Email service not available. Applications will still be saved."
  );
}

// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const uploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "resumes"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

// ============================================================
// MULTER STORAGE
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const originalName = path.basename(
      file.originalname,
      extension
    );

    const safeName = originalName
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .substring(0, 80);

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}-${safeName}${extension}`;

    cb(null, uniqueName);
  },
});

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return cb(
      new Error(
        "Only PDF, DOC and DOCX resume files are allowed."
      )
    );
  }

  cb(null, true);
};

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ============================================================
// HELPERS
// ============================================================

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
};

const escapeRegex = (value = "") => {
  return String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const cleanText = (value = "") => {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

// ============================================================
// LOCATION ALIASES
// ============================================================

const LOCATION_ALIASES = {
  bengaluru: [
    "bengaluru",
    "bangalore",
  ],

  bangalore: [
    "bengaluru",
    "bangalore",
  ],

  mumbai: [
    "mumbai",
    "bombay",
  ],

  delhi: [
    "delhi",
    "new delhi",
    "delhi ncr",
  ],

  "new delhi": [
    "delhi",
    "new delhi",
    "delhi ncr",
  ],

  "delhi ncr": [
    "delhi",
    "new delhi",
    "delhi ncr",
  ],

  gurugram: [
    "gurugram",
    "gurgaon",
  ],

  gurgaon: [
    "gurugram",
    "gurgaon",
  ],

  hyderabad: [
    "hyderabad",
  ],

  pune: [
    "pune",
  ],

  chennai: [
    "chennai",
    "madras",
  ],

  kolkata: [
    "kolkata",
    "calcutta",
  ],

  noida: [
    "noida",
  ],

  jaipur: [
    "jaipur",
  ],

  ahmedabad: [
    "ahmedabad",
  ],

  chandigarh: [
    "chandigarh",
  ],

  indore: [
    "indore",
  ],

  kochi: [
    "kochi",
    "cochin",
  ],
};

const getLocationAliases = (location = "") => {
  const normalized = normalizeText(location);

  return (
    LOCATION_ALIASES[normalized] || [
      normalized,
    ]
  );
};

// ============================================================
// LOCATION MATCH
// ============================================================

const matchesLocation = (
  jobLocation = "",
  selectedLocation = ""
) => {
  if (!selectedLocation) {
    return true;
  }

  const jobText = normalizeText(jobLocation);

  const aliases =
    getLocationAliases(selectedLocation);

  return aliases.some((location) =>
    jobText.includes(location)
  );
};

// ============================================================
// REMOTE LOCATION DETECTION
// ============================================================

const isRemoteLocation = (location = "") => {
  const value = normalizeText(location);

  return (
    value.includes("remote") ||
    value.includes("worldwide") ||
    value.includes("anywhere") ||
    value.includes("work from home") ||
    value.includes("wfh")
  );
};

// ============================================================
// ROLE MATCH
// ============================================================

const matchesRole = (
  job,
  requestedRole = ""
) => {
  if (!requestedRole) {
    return true;
  }

  const role = normalizeText(requestedRole);

  const title = normalizeText(
    job?.title
  );

  const description = normalizeText(
    job?.description
  );

  const skills = Array.isArray(job?.skills)
    ? job.skills
        .map(normalizeText)
        .join(" ")
    : "";

  // Exact / direct title match
  if (title.includes(role)) {
    return true;
  }

  // Important role aliases
  const ROLE_ALIASES = {
    "software engineer": [
      "software engineer",
      "software developer",
      "application developer",
      "developer",
      "engineer",
    ],

    "software developer": [
      "software engineer",
      "software developer",
      "application developer",
      "developer",
    ],

    "full stack developer": [
      "full stack",
      "fullstack",
      "mern",
      "mean",
      "software developer",
      "software engineer",
    ],

    "mern stack developer": [
      "mern",
      "full stack",
      "fullstack",
      "react",
      "node",
    ],

    "frontend developer": [
      "frontend",
      "front end",
      "react",
      "angular",
      "vue",
      "ui developer",
    ],

    "backend developer": [
      "backend",
      "back end",
      "node",
      "java",
      "python",
      "api developer",
    ],

    "react developer": [
      "react",
      "frontend",
      "front end",
    ],

    "node.js developer": [
      "node",
      "node.js",
      "backend",
    ],

    "data analyst": [
      "data analyst",
      "business analyst",
      "analytics",
    ],

    "data scientist": [
      "data scientist",
      "machine learning",
      "data science",
    ],
  };

  const aliases =
    ROLE_ALIASES[role] || [role];

  return aliases.some(
    (keyword) =>
      title.includes(keyword) ||
      description.includes(keyword) ||
      skills.includes(keyword)
  );
};

// ============================================================
// EXPERIENCE HELPERS
// ============================================================

const getExperienceLevel = (
  experience = ""
) => {
  const value = normalizeText(experience);

  if (
    value === "fresher" ||
    value.includes("fresher") ||
    value.includes("entry")
  ) {
    return "fresher";
  }

  if (
    value.includes("0-1") ||
    value.includes("0 - 1") ||
    value.includes("1 year")
  ) {
    return "0-1";
  }

  if (
    value.includes("1-2") ||
    value.includes("1 - 2")
  ) {
    return "1-2";
  }

  if (
    value.includes("2-3") ||
    value.includes("2 - 3")
  ) {
    return "2-3";
  }

  if (
    value.includes("3+") ||
    value.includes("3 +")
  ) {
    return "3+";
  }

  return "";
};

// ============================================================
// EXPERIENCE MATCH
// ============================================================

const matchesExperience = (
  job,
  requestedExperience = ""
) => {
  if (!requestedExperience) {
    return true;
  }

  const requested =
    getExperienceLevel(
      requestedExperience
    );

  if (!requested) {
    return true;
  }

  const title = normalizeText(
    job?.title
  );

  const description = normalizeText(
    job?.description
  );

  const experience = normalizeText(
    job?.experience
  );

  const completeText = `${title} ${description} ${experience}`;

  // ==========================================================
  // FRESHER
  // ==========================================================

  if (requested === "fresher") {
    const seniorKeywords = [
      "senior",
      "sr.",
      "lead",
      "principal",
      "manager",
      "director",
      "architect",
      "5+ years",
      "6+ years",
      "7+ years",
      "8+ years",
    ];

    const clearlySenior =
      seniorKeywords.some(
        (keyword) =>
          completeText.includes(keyword)
      );

    if (clearlySenior) {
      return false;
    }

    // Explicit fresher / entry-level
    if (
      completeText.includes("fresher") ||
      completeText.includes("entry level") ||
      completeText.includes("entry-level") ||
      completeText.includes("graduate") ||
      completeText.includes("0-1") ||
      completeText.includes("0 - 1") ||
      completeText.includes("junior")
    ) {
      return true;
    }

    /*
      External providers often do not disclose
      experience.

      We allow undisclosed experience for Fresher
      instead of throwing away every external job.
    */

    if (
      experience === "" ||
      experience === "not disclosed"
    ) {
      return true;
    }

    return false;
  }

  // ==========================================================
  // 0-1 YEARS
  // ==========================================================

  if (requested === "0-1") {
    return (
      completeText.includes("0-1") ||
      completeText.includes("0 - 1") ||
      completeText.includes("fresher") ||
      completeText.includes("entry level") ||
      completeText.includes("entry-level") ||
      completeText.includes("junior")
    );
  }

  // ==========================================================
  // 1-2 YEARS
  // ==========================================================

  if (requested === "1-2") {
    return (
      completeText.includes("1-2") ||
      completeText.includes("1 - 2")
    );
  }

  // ==========================================================
  // 2-3 YEARS
  // ==========================================================

  if (requested === "2-3") {
    return (
      completeText.includes("2-3") ||
      completeText.includes("2 - 3")
    );
  }

  // ==========================================================
  // 3+ YEARS
  // ==========================================================

  if (requested === "3+") {
    const years = completeText.match(
      /(\d+)\+?\s*(years?|yrs?)/i
    );

    if (years) {
      return Number(years[1]) >= 3;
    }

    return (
      completeText.includes("senior") ||
      completeText.includes("sr.") ||
      completeText.includes("lead") ||
      completeText.includes("principal") ||
      completeText.includes("architect")
    );
  }

  return true;
};

// ============================================================
// JOB TYPE MATCH
// ============================================================

const matchesJobType = (
  job,
  requestedType = ""
) => {
  if (!requestedType) {
    return true;
  }

  const requested =
    normalizeText(requestedType);

  const type = normalizeText(
    job?.type
  );

  if (
    requested === "full time" ||
    requested === "full-time"
  ) {
    return (
      type === "full time" ||
      type === "full-time"
    );
  }

  if (
    requested === "part time" ||
    requested === "part-time"
  ) {
    return (
      type === "part time" ||
      type === "part-time"
    );
  }

  if (
    requested === "internship" ||
    requested === "intern"
  ) {
    return (
      type === "internship" ||
      type === "intern"
    );
  }

  if (requested === "remote") {
    return (
      type === "remote" ||
      normalizeText(job?.mode) === "remote" ||
      isRemoteLocation(job?.location)
    );
  }

  return type.includes(requested);
};

// ============================================================
// WORK MODE MATCH
// ============================================================

const matchesWorkMode = (
  job,
  requestedMode = ""
) => {
  if (
    !requestedMode ||
    normalizeText(requestedMode) === "any"
  ) {
    return true;
  }

  const requested =
    normalizeText(requestedMode);

  const mode = normalizeText(
    job?.mode
  );

  const type = normalizeText(
    job?.type
  );

  const location = normalizeText(
    job?.location
  );

  // ==========================================================
  // REMOTE
  // ==========================================================

  if (requested === "remote") {
    return (
      mode === "remote" ||
      type === "remote" ||
      location.includes("remote") ||
      location.includes("worldwide") ||
      location.includes("anywhere") ||
      location.includes("work from home") ||
      location.includes("wfh")
    );
  }

  // ==========================================================
  // HYBRID
  // ==========================================================

  if (requested === "hybrid") {
    return (
      mode === "hybrid" ||
      location.includes("hybrid")
    );
  }

  // ==========================================================
  // ON-SITE
  // ==========================================================

  if (
    requested === "on-site" ||
    requested === "onsite" ||
    requested === "on site"
  ) {
    return (
      mode === "on-site" ||
      mode === "onsite" ||
      mode === "on site"
    );
  }

  return mode === requested;
};

// ============================================================
// FINAL FILTER
// ============================================================

const applyFilters = (
  jobs,
  filters
) => {
  const {
    role = "",
    location = "",
    experience = "",
    jobType = "",
    workMode = "",
  } = filters;

  return jobs.filter((job) => {
    // Role
    if (
      role &&
      !matchesRole(job, role)
    ) {
      return false;
    }

    // Location
    if (
      location &&
      !matchesLocation(
        job.location,
        location
      )
    ) {
      return false;
    }

    // Experience
    if (
      experience &&
      !matchesExperience(
        job,
        experience
      )
    ) {
      return false;
    }

    // Job type
    if (
      jobType &&
      !matchesJobType(
        job,
        jobType
      )
    ) {
      return false;
    }

    // Work mode
    if (
      workMode &&
      normalizeText(workMode) !== "any" &&
      !matchesWorkMode(
        job,
        workMode
      )
    ) {
      return false;
    }

    return true;
  });
};

// ============================================================
// MONGO JOB NORMALIZER
// ============================================================

const normalizeMongoJob = (
  job,
  resumeSkills = []
) => {
  const skills = Array.isArray(
    job?.skills
  )
    ? job.skills
    : [];

  const match =
    typeof calculateJobMatch === "function"
      ? calculateJobMatch(
          resumeSkills,
          skills
        )
      : 0;

  const matchingSkills =
    typeof getMatchingSkills === "function"
      ? getMatchingSkills(
          resumeSkills,
          skills
        )
      : [];

  return {
    _id: String(job._id),
    id: String(job._id),

    externalId: "",

    source: "mongodb",
    provider: "MongoDB",

    isExternal: false,

    title:
      job.title ||
      "Untitled Job",

    company:
      job.company ||
      "Unknown Company",

    location:
      job.location ||
      "Not Disclosed",

    type:
      job.type ||
      "Full Time",

    mode:
      job.mode ||
      "",

    experience:
      job.experience ||
      "Not Disclosed",

    salary:
      job.salary ||
      "Not Disclosed",

    skills,

    description:
      cleanText(
        job.description || ""
      ),

    applyUrl:
      job.applyUrl ||
      "",

    companyUrl:
      job.companyUrl ||
      "",

    recruiterEmail:
      job.recruiterEmail ||
      "",

    recruiterPhone:
      job.recruiterPhone ||
      "",

    match:
      Number(match) || 0,

    matchingSkills:
      Array.isArray(
        matchingSkills
      )
        ? matchingSkills
        : [],

    createdAt:
      job.createdAt || null,

    postedAt:
      job.createdAt || null,
  };
};

// ============================================================
// EXTERNAL JOB NORMALIZER
// ============================================================

const normalizeExternalJob = (
  job,
  resumeSkills = []
) => {
  const skills = Array.isArray(
    job?.skills
  )
    ? job.skills
    : [];

  const match =
    typeof calculateJobMatch === "function"
      ? calculateJobMatch(
          resumeSkills,
          skills
        )
      : Number(job?.match) || 0;

  const matchingSkills =
    typeof getMatchingSkills === "function"
      ? getMatchingSkills(
          resumeSkills,
          skills
        )
      : Array.isArray(
          job?.matchingSkills
        )
      ? job.matchingSkills
      : [];

  const externalId = String(
    job?.externalId ||
      job?.id ||
      job?._id ||
      ""
  );

  return {
    _id: String(
      job?._id ||
        job?.id ||
        `external-${Date.now()}-${Math.random()}`
    ),

    id: String(
      job?.id ||
        job?._id ||
        `external-${Date.now()}-${Math.random()}`
    ),

    externalId,

    source: "external",

    provider:
      job?.provider ||
      job?.sourceName ||
      "External",

    isExternal: true,

    title:
      job?.title ||
      "Untitled Job",

    company:
      job?.company ||
      "Unknown Company",

    location:
      job?.location ||
      "Not Disclosed",

    type:
      job?.type ||
      "Full Time",

    mode:
      job?.mode ||
      "",

    experience:
      job?.experience ||
      "Not Disclosed",

    salary:
      job?.salary ||
      "Not Disclosed",

    skills,

    description:
      cleanText(
        job?.description || ""
      ),

    applyUrl:
      job?.applyUrl ||
      job?.sourceUrl ||
      "",

    companyUrl:
      job?.companyUrl ||
      "",

    // IMPORTANT:
    // Never invent recruiter contact details
    recruiterEmail:
      job?.recruiterEmail ||
      "",

    recruiterPhone:
      job?.recruiterPhone ||
      "",

    match:
      Number(match) || 0,

    matchingSkills:
      Array.isArray(
        matchingSkills
      )
        ? matchingSkills
        : [],

    postedAt:
      job?.postedAt ||
      null,

    sourceUrl:
      job?.sourceUrl ||
      job?.applyUrl ||
      "",
  };
};

// ============================================================
// DEDUPLICATE JOBS
// ============================================================

const deduplicateJobs = (
  jobs = []
) => {
  const unique = new Map();

  for (const job of jobs) {
    if (!job) {
      continue;
    }

    const title = normalizeText(
      job.title
    );

    const company = normalizeText(
      job.company
    );

    const location = normalizeText(
      job.location
    );

    const applyUrl = normalizeText(
      job.applyUrl
    );

    const provider = normalizeText(
      job.provider
    );

    let key;

    if (
      applyUrl &&
      applyUrl !== "#"
    ) {
      key = `url:${applyUrl}`;
    } else if (
      job.externalId
    ) {
      key = `external:${provider}:${job.externalId}`;
    } else {
      key = `${title}|${company}|${location}`;
    }

    if (!unique.has(key)) {
      unique.set(key, job);
    }
  }

  return Array.from(
    unique.values()
  );
};

// ============================================================
// GET ALL JOBS
// GET /api/jobs
// ============================================================

router.get(
  "/",
  async (req, res) => {
    try {
      const mongoJobs =
        await Job.find({})
          .sort({
            createdAt: -1,
          })
          .limit(100)
          .lean();

      let externalJobs = [];

      try {
        externalJobs =
          await fetchExternalJobs(
            "Software Engineer",
            "India",
            {
              limit: 20,
            }
          );
      } catch (externalError) {
        console.error(
          "External jobs error:",
          externalError.message
        );
      }

      const normalizedMongoJobs =
        mongoJobs.map((job) =>
          normalizeMongoJob(job)
        );

      const normalizedExternalJobs =
        Array.isArray(
          externalJobs
        )
          ? externalJobs.map(
              (job) =>
                normalizeExternalJob(
                  job
                )
            )
          : [];

      const jobs =
        deduplicateJobs([
          ...normalizedMongoJobs,
          ...normalizedExternalJobs,
        ]);

      return res.status(200).json({
        success: true,

        count: jobs.length,

        jobs,

        sources: {
          mongodb:
            normalizedMongoJobs.length,

          external:
            normalizedExternalJobs.length,
        },
      });
    } catch (error) {
      console.error(
        "GET ALL JOBS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch jobs.",

        error:
          error.message,
      });
    }
  }
);

// ============================================================
// SEARCH JOBS
// GET /api/jobs/search
// ============================================================

router.get(
  "/search",
  async (req, res) => {
    try {
      const {
        role = "",
        location = "",
        experience = "",
        jobType = "",
        workMode = "",
        skills = "",
      } = req.query;

      console.log(
        "\n========================================"
      );

      console.log(
        "JOB SEARCH REQUEST"
      );

      console.log({
        role,
        location,
        experience,
        jobType,
        workMode,
        skills,
      });

      console.log(
        "========================================"
      );

      // ======================================================
      // RESUME SKILLS
      // ======================================================

      const resumeSkills =
        skills
          ? String(skills)
              .split(",")
              .map((skill) =>
                skill.trim()
              )
              .filter(Boolean)
          : [];

      // ======================================================
      // MONGODB QUERY
      // ======================================================

      const mongoQuery = {};

      // Role
      if (
        role &&
        role.trim()
      ) {
        mongoQuery.title = {
          $regex:
            escapeRegex(
              role.trim()
            ),
          $options: "i",
        };
      }

      // Location
      if (
        location &&
        location.trim()
      ) {
        const locationAliases =
          getLocationAliases(
            location
          );

        mongoQuery.location = {
          $regex:
            locationAliases
              .map(
                (value) =>
                  escapeRegex(
                    value
                  )
              )
              .join("|"),
          $options: "i",
        };
      }

      // Experience
      if (
        experience &&
        normalizeText(
          experience
        ) !== "fresher"
      ) {
        const normalizedExperience =
          normalizeText(
            experience
          );

        const numbers =
          normalizedExperience.match(
            /\d+/g
          );

        if (
          numbers &&
          numbers.length >= 2
        ) {
          mongoQuery.experience = {
            $regex: `${numbers[0]}\\s*[-–]\\s*${numbers[1]}`,
            $options: "i",
          };
        } else if (
          numbers &&
          numbers.length === 1
        ) {
          mongoQuery.experience = {
            $regex:
              escapeRegex(
                numbers[0]
              ),
            $options: "i",
          };
        }
      }

      // Job type
      if (
        jobType &&
        normalizeText(
          jobType
        ) !== "remote"
      ) {
        mongoQuery.type = {
          $regex:
            escapeRegex(
              jobType.trim()
            ),
          $options: "i",
        };
      }

      // Work mode
      // Only query MongoDB mode if field exists.
      if (
        workMode &&
        normalizeText(
          workMode
        ) !== "any"
      ) {
        mongoQuery.mode = {
          $regex:
            escapeRegex(
              workMode.trim()
            ),
          $options: "i",
        };
      }

      console.log(
        "MongoDB Query:",
        JSON.stringify(
          mongoQuery,
          null,
          2
        )
      );

      // ======================================================
      // FETCH MONGODB
      // ======================================================

      let mongoJobs = [];

      try {
        mongoJobs =
          await Job.find(
            mongoQuery
          )
            .sort({
              createdAt: -1,
            })
            .limit(100)
            .lean();

        console.log(
          `MongoDB Jobs Found: ${mongoJobs.length}`
        );
      } catch (mongoError) {
        console.error(
          "MongoDB Search Error:",
          mongoError.message
        );

        mongoJobs = [];
      }

      // ======================================================
      // FETCH EXTERNAL JOBS
      // ======================================================

      let externalJobs = [];

      try {
        const externalRole =
          role.trim() ||
          "Software Engineer";

        const externalLocation =
          location.trim() ||
          "India";

        console.log(
          `Fetching external jobs for "${externalRole}" in "${externalLocation}"...`
        );

        externalJobs =
          await fetchExternalJobs(
            externalRole,
            externalLocation,
            {
              limit: 30,

              jobType:
                jobType || "",

              experience:
                experience || "",

              workMode:
                workMode || "",
            }
          );

        if (
          !Array.isArray(
            externalJobs
          )
        ) {
          externalJobs = [];
        }

        console.log(
          `External Jobs Found Before Final Filter: ${externalJobs.length}`
        );
      } catch (externalError) {
        console.error(
          "External Job Search Error:",
          externalError.message
        );

        externalJobs = [];
      }

      // ======================================================
      // NORMALIZE
      // ======================================================

      const normalizedMongoJobs =
        mongoJobs.map((job) =>
          normalizeMongoJob(
            job,
            resumeSkills
          )
        );

      const normalizedExternalJobs =
        externalJobs.map((job) =>
          normalizeExternalJob(
            job,
            resumeSkills
          )
        );

      // ======================================================
      // FINAL SERVER-SIDE FILTER
      // ======================================================

      const filterOptions = {
        role:
          role.trim(),

        location:
          location.trim(),

        experience:
          experience.trim(),

        jobType:
          jobType.trim(),

        workMode:
          workMode.trim(),
      };

      let filteredMongoJobs =
        applyFilters(
          normalizedMongoJobs,
          filterOptions
        );

      let filteredExternalJobs =
        applyFilters(
          normalizedExternalJobs,
          filterOptions
        );

      console.log(
        "========================================"
      );

      console.log(
        "FINAL FILTER RESULT"
      );

      console.log({
        beforeMongo:
          normalizedMongoJobs.length,

        afterMongo:
          filteredMongoJobs.length,

        beforeExternal:
          normalizedExternalJobs.length,

        afterExternal:
          filteredExternalJobs.length,
      });

      console.log(
        "========================================"
      );

      // ======================================================
      // IMPORTANT FALLBACK
      // ======================================================

      /*
        If the requested location is an Indian city,
        do NOT return Worldwide / Europe / USA jobs.

        This is intentionally strict for location searches.
      */

      if (
        location &&
        normalizeText(
          location
        ) !== "india"
      ) {
        filteredExternalJobs =
          filteredExternalJobs.filter(
            (job) =>
              matchesLocation(
                job.location,
                location
              )
          );
      }

      // ======================================================
      // MERGE
      // ======================================================

      let allJobs =
        deduplicateJobs([
          ...filteredMongoJobs,
          ...filteredExternalJobs,
        ]);

      // ======================================================
      // SORT
      // ======================================================

      allJobs.sort(
        (a, b) => {
          const matchDifference =
            Number(
              b.match || 0
            ) -
            Number(
              a.match || 0
            );

          if (
            matchDifference !== 0
          ) {
            return matchDifference;
          }

          const aDate =
            a.postedAt ||
            a.createdAt ||
            0;

          const bDate =
            b.postedAt ||
            b.createdAt ||
            0;

          return (
            new Date(bDate) -
            new Date(aDate)
          );
        }
      );

      // ======================================================
      // LIMIT
      // ======================================================

      allJobs =
        allJobs.slice(0, 50);

      console.log(
        "========================================"
      );

      console.log(
        "FINAL JOB RESULTS"
      );

      console.log({
        mongodb:
          filteredMongoJobs.length,

        external:
          filteredExternalJobs.length,

        total:
          allJobs.length,
      });

      if (allJobs.length > 0) {
        console.table(
          allJobs.map(
            (job) => ({
              title:
                job.title,

              company:
                job.company,

              location:
                job.location,

              type:
                job.type,

              mode:
                job.mode,

              experience:
                job.experience,

              source:
                job.source,

              provider:
                job.provider,
            })
          )
        );
      }

      console.log(
        "========================================"
      );

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(200).json({
        success: true,

        count:
          allJobs.length,

        jobs:
          allJobs,

        sources: {
          mongodb:
            filteredMongoJobs.length,

          external:
            filteredExternalJobs.length,
        },

        search: {
          role,
          location,
          experience,
          jobType,
          workMode,
        },
      });
    } catch (error) {
      console.error(
        "SEARCH JOBS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Job search failed.",

        error:
          error.message,
      });
    }
  }
);

// ============================================================
// APPLY TO JOB
// POST /api/jobs/apply
// ============================================================

router.post(
  "/apply",
  (req, res, next) => {
    upload.single("resume")(
      req,
      res,
      (error) => {
        if (error) {
          console.error(
            "Resume Upload Error:",
            error.message
          );

          if (
            error.code ===
            "LIMIT_FILE_SIZE"
          ) {
            return res.status(400).json({
              success: false,

              message:
                "Resume size must be less than 5 MB.",
            });
          }

          return res.status(400).json({
            success: false,

            message:
              error.message ||
              "Resume upload failed.",
          });
        }

        next();
      }
    );
  },

  async (req, res) => {
    try {
      const {
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone,
        coverLetter = "",
        matchScore = "0",
        jobTitle = "",
        company = "",
        recruiterEmail = "",
      } = req.body;

      console.log(
        "\n========================================"
      );

      console.log(
        "JOB APPLICATION REQUEST"
      );

      console.log({
        jobId,
        applicantName,
        applicantEmail,
        applicantPhone,
        jobTitle,
        company,
        recruiterEmail,
        resume:
          req.file?.originalname,
      });

      console.log(
        "========================================"
      );

      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !applicantName ||
        !applicantName.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Applicant name is required.",
        });
      }

      if (
        !applicantEmail ||
        !applicantEmail.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Applicant email is required.",
        });
      }

      if (
        !applicantPhone ||
        !applicantPhone.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Applicant phone is required.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please upload your resume.",
        });
      }

      // ======================================================
      // EMAIL VALIDATION
      // ======================================================

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const normalizedApplicantEmail =
        applicantEmail
          .trim()
          .toLowerCase();

      if (
        !emailRegex.test(
          normalizedApplicantEmail
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Please enter a valid email address.",
        });
      }

      // ======================================================
      // FIND INTERNAL MONGODB JOB ONLY
      // ======================================================

      let job = null;

      if (
        jobId &&
        mongoose.Types.ObjectId.isValid(
          jobId
        )
      ) {
        job =
          await Job.findById(
            jobId
          ).lean();
      }

      // ======================================================
      // EXTERNAL JOB DETECTION
      // ======================================================

      const isExternalJob =
        !job;

      // ======================================================
      // FINAL JOB DATA
      // ======================================================

      const finalJobTitle =
        job?.title ||
        jobTitle ||
        "IT Job";

      const finalCompany =
        job?.company ||
        company ||
        "Unknown Company";

      const finalRecruiterEmail =
        job?.recruiterEmail ||
        recruiterEmail ||
        "";

      // ======================================================
      // RESUME URL
      // ======================================================

      const resumeUrl =
        `/uploads/resumes/${req.file.filename}`;

      // ======================================================
      // APPLICATION DATA
      // ======================================================

      /*
        IMPORTANT:
        This supports the new Application model.

        job:
          MongoDB ObjectId for internal jobs.

        External jobs:
          job = null

        If your Application model currently requires
        job, external applications cannot be stored
        in that model. See note below.
      */

      if (
        isExternalJob &&
        Application
      ) {
        console.log(
          "External job application detected."
        );
      }

      // ======================================================
      // CREATE APPLICATION
      // ======================================================

      let savedApplication = null;

      if (Application) {
        try {
          const applicationData = {
            job:
              job?._id || null,

            jobTitle:
              finalJobTitle,

            company:
              finalCompany,

            applicantName:
              applicantName.trim(),

            applicantEmail:
              normalizedApplicantEmail,

            applicantPhone:
              applicantPhone.trim(),

            resumeName:
              req.file.originalname,

            resumePath:
              req.file.path,

            resumeUrl,

            coverLetter:
              coverLetter.trim(),

            matchScore:
              Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    matchScore
                  ) || 0
                )
              ),

            matchingSkills: [],

            recruiterEmail:
              finalRecruiterEmail,

            recruiterEmailSent:
              false,

            candidateEmailSent:
              false,

            status:
              "Applied",

            recruiterNotes:
              "",

            source:
              isExternalJob
                ? "external"
                : "mongodb",
          };

          /*
            For external jobs there may be no recruiter email.

            If your Application schema has recruiterEmail
            as required, we cannot create an external
            application without a real recruiter email.

            Therefore save only when:
              - internal job with recruiter email
              OR
              - schema permits empty recruiterEmail.
          */

          if (
            isExternalJob &&
            !finalRecruiterEmail
          ) {
            console.log(
              "External job has no recruiter email. Application DB save skipped."
            );
          } else {
            savedApplication =
              await Application.create(
                applicationData
              );

            console.log(
              "Application saved:",
              savedApplication._id
            );
          }
        } catch (databaseError) {
          console.error(
            "Application DB Save Error:",
            databaseError.message
          );

          try {
            if (
              req.file?.path &&
              fs.existsSync(
                req.file.path
              )
            ) {
              fs.unlinkSync(
                req.file.path
              );
            }
          } catch (deleteError) {
            console.error(
              "Resume cleanup error:",
              deleteError.message
            );
          }

          return res.status(500).json({
            success: false,

            message:
              "Application could not be saved.",

            error:
              databaseError.message,
          });
        }
      }

      // ======================================================
      // RECRUITER EMAIL
      // ======================================================

      let recruiterEmailSent =
        false;

      if (
        finalRecruiterEmail &&
        sendEmail
      ) {
        try {
          await sendEmail({
            to:
              finalRecruiterEmail,

            subject:
              `New Application: ${finalJobTitle} - ${applicantName.trim()}`,

            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">

                <h2>New Job Application Received</h2>

                <p>
                  A candidate has applied for your job.
                </p>

                <hr />

                <p>
                  <strong>Position:</strong>
                  ${cleanText(finalJobTitle)}
                </p>

                <p>
                  <strong>Company:</strong>
                  ${cleanText(finalCompany)}
                </p>

                <p>
                  <strong>Candidate:</strong>
                  ${cleanText(applicantName)}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${cleanText(applicantEmail)}
                </p>

                <p>
                  <strong>Phone:</strong>
                  ${cleanText(applicantPhone)}
                </p>

                <p>
                  <strong>AI Match:</strong>
                  ${Number(matchScore) || 0}%
                </p>

                ${
                  coverLetter.trim()
                    ? `
                      <p>
                        <strong>Cover Letter:</strong>
                      </p>

                      <p>
                        ${cleanText(
                          coverLetter
                        ).replace(
                          /\n/g,
                          "<br />"
                        )}
                      </p>
                    `
                    : ""
                }

                <p>
                  <strong>Resume:</strong>
                  ${cleanText(
                    req.file.originalname
                  )}
                </p>

                <hr />

                <p>
                  Please review the candidate's resume and application.
                </p>

              </div>
            `,

            attachments: [
              {
                filename:
                  req.file.originalname,

                path:
                  req.file.path,
              },
            ],
          });

          recruiterEmailSent =
            true;

          console.log(
            "Recruiter email sent successfully."
          );
        } catch (emailError) {
          console.error(
            "Recruiter Email Error:",
            emailError.message
          );
        }
      }

      // ======================================================
      // CANDIDATE CONFIRMATION EMAIL
      // ======================================================

      let candidateEmailSent =
        false;

      if (sendEmail) {
        try {
          await sendEmail({
            to:
              normalizedApplicantEmail,

            subject:
              `Application Submitted - ${finalJobTitle}`,

            html: `
              <div style="font-family:Arial,sans-serif;line-height:1.6">

                <h2>
                  Application Submitted Successfully
                </h2>

                <p>
                  Hi ${cleanText(
                    applicantName
                  )},
                </p>

                <p>
                  Your application details have been received successfully.
                </p>

                <p>
                  <strong>Position:</strong>
                  ${cleanText(
                    finalJobTitle
                  )}
                </p>

                <p>
                  <strong>Company:</strong>
                  ${cleanText(
                    finalCompany
                  )}
                </p>

                <p>
                  <strong>AI Match:</strong>
                  ${Number(
                    matchScore
                  ) || 0}%
                </p>

                ${
                  isExternalJob
                    ? `
                      <p>
                        This is an external job listing.
                        Please complete the application on the employer's
                        original application website.
                      </p>
                    `
                    : `
                      <p>
                        Your application has been recorded in Career AI.
                      </p>
                    `
                }

                <p>
                  Best wishes,<br />
                  Career AI Team
                </p>

              </div>
            `,
          });

          candidateEmailSent =
            true;

          console.log(
            "Candidate confirmation email sent successfully."
          );
        } catch (emailError) {
          console.error(
            "Candidate Email Error:",
            emailError.message
          );
        }
      }

      // ======================================================
      // UPDATE EMAIL FLAGS
      // ======================================================

      if (savedApplication) {
        try {
          savedApplication.recruiterEmailSent =
            recruiterEmailSent;

          savedApplication.candidateEmailSent =
            candidateEmailSent;

          await savedApplication.save();
        } catch (updateError) {
          console.warn(
            "Application email status update failed:",
            updateError.message
          );
        }
      }

      // ======================================================
      // RESPONSE
      // ======================================================

      return res.status(201).json({
        success: true,

        message:
          isExternalJob
            ? "Application details received. Please also complete the application on the employer's website."
            : "Application submitted successfully.",

        application:
          savedApplication
            ? {
                _id:
                  String(
                    savedApplication._id
                  ),

                id:
                  String(
                    savedApplication._id
                  ),

                status:
                  savedApplication.status,

                createdAt:
                  savedApplication.createdAt,

                recruiterEmailSent,

                candidateEmailSent,

                source:
                  savedApplication.source,
              }
            : {
                _id: null,

                id: null,

                status:
                  "Applied",

                createdAt:
                  new Date(),

                recruiterEmailSent,

                candidateEmailSent,

                source:
                  isExternalJob
                    ? "external"
                    : "mongodb",
              },

        job: {
          id:
            job?._id
              ? String(
                  job._id
                )
              : String(
                  jobId || ""
                ),

          title:
            finalJobTitle,

          company:
            finalCompany,

          source:
            isExternalJob
              ? "external"
              : "mongodb",

          isExternal:
            isExternalJob,
        },

        resume: {
          originalName:
            req.file.originalname,

          url:
            resumeUrl,
        },
      });
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error
      );

      // ======================================================
      // CLEANUP RESUME
      // ======================================================

      try {
        if (
          req.file?.path &&
          fs.existsSync(
            req.file.path
          )
        ) {
          fs.unlinkSync(
            req.file.path
          );
        }
      } catch (cleanupError) {
        console.error(
          "Resume cleanup error:",
          cleanupError.message
        );
      }

      return res.status(500).json({
        success: false,

        message:
          "Failed to process application.",

        error:
          error.message,
      });
    }
  }
);

// ============================================================
// GET SINGLE MONGODB JOB
// GET /api/jobs/:id
// ============================================================

router.get(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      // External ID cannot be looked up in MongoDB.
      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid MongoDB Job ID.",
        });
      }

      const job =
        await Job.findById(
          id
        ).lean();

      if (!job) {
        return res.status(404).json({
          success: false,

          message:
            "Job not found.",
        });
      }

      const normalizedJob =
        normalizeMongoJob(
          job
        );

      return res.status(200).json({
        success: true,

        job:
          normalizedJob,
      });
    } catch (error) {
      console.error(
        "GET SINGLE JOB ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch job.",

        error:
          error.message,
      });
    }
  }
);

// ============================================================
// MULTER ERROR HANDLER
// ============================================================

router.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Resume size must be less than 5 MB.",
        });
      }

      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "File upload error.",
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,

        message:
          error.message ||
          "Request failed.",
      });
    }

    next();
  }
);

// ============================================================
// EXPORT
// ============================================================

module.exports = router;