
import React, { useState } from "react";
import "./JobSearch.css";

const API_BASE_URL = "http://localhost:5000/api";

const JobSearch = () => {
  // =====================================================
  // SEARCH STATES
  // =====================================================

  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [jobType, setJobType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Any");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [resumeMode, setResumeMode] = useState(false);

  // =====================================================
  // APPLICATION STATES
  // =====================================================

  const [selectedJob, setSelectedJob] = useState(null);

  const [showApplyModal, setShowApplyModal] =
    useState(false);

  const [showJobModal, setShowJobModal] =
    useState(false);

  const [resumeFile, setResumeFile] =
    useState(null);

  const [applicantName, setApplicantName] =
    useState("");

  const [applicantEmail, setApplicantEmail] =
    useState("");

  const [applicantPhone, setApplicantPhone] =
    useState("");

  const [coverLetter, setCoverLetter] =
    useState("");

  const [applying, setApplying] =
    useState(false);

  const [applicationSuccess, setApplicationSuccess] =
    useState(false);

  // =====================================================
  // JOB CATEGORIES
  // =====================================================

  const jobCategories = [
    {
      name: "Software Development",
      roles: [
        "Software Engineer",
        "Software Developer",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "MERN Stack Developer",
        "MEAN Stack Developer",
        "React Developer",
        "Angular Developer",
        "Vue.js Developer",
        "Node.js Developer",
        "Java Developer",
        "Python Developer",
        "Django Developer",
        "Spring Boot Developer",
        ".NET Developer",
        "C# Developer",
        "PHP Developer",
        "Laravel Developer",
        "C++ Developer",
        "C Developer",
        "Go Developer",
        "Ruby on Rails Developer",
      ],
    },
    {
      name: "Mobile Development",
      roles: [
        "Mobile App Developer",
        "Android Developer",
        "iOS Developer",
        "Flutter Developer",
        "React Native Developer",
      ],
    },
    {
      name: "Data & AI",
      roles: [
        "Data Analyst",
        "Data Scientist",
        "Data Engineer",
        "Machine Learning Engineer",
        "AI Engineer",
        "Generative AI Engineer",
        "NLP Engineer",
        "Computer Vision Engineer",
        "Business Intelligence Analyst",
        "BI Developer",
      ],
    },
    {
      name: "Cloud & DevOps",
      roles: [
        "DevOps Engineer",
        "Cloud Engineer",
        "Cloud Architect",
        "AWS Engineer",
        "Azure Engineer",
        "Google Cloud Engineer",
        "Site Reliability Engineer",
        "Platform Engineer",
      ],
    },
    {
      name: "Cyber Security",
      roles: [
        "Cyber Security Analyst",
        "Cyber Security Engineer",
        "Security Engineer",
        "Information Security Analyst",
        "Ethical Hacker",
        "Penetration Tester",
        "SOC Analyst",
        "Application Security Engineer",
      ],
    },
    {
      name: "Testing & QA",
      roles: [
        "QA Engineer",
        "Software Tester",
        "Automation Tester",
        "Selenium Tester",
        "Performance Tester",
        "Test Automation Engineer",
      ],
    },
    {
      name: "Database",
      roles: [
        "Database Administrator",
        "Database Engineer",
        "SQL Developer",
        "MongoDB Developer",
        "Oracle Developer",
      ],
    },
    {
      name: "Networking & Support",
      roles: [
        "Network Engineer",
        "System Administrator",
        "System Engineer",
        "IT Support Engineer",
        "Technical Support Engineer",
        "Network Administrator",
      ],
    },
    {
      name: "Architecture",
      roles: [
        "Solutions Architect",
        "Software Architect",
        "Technical Architect",
      ],
    },
    {
      name: "UI / UX",
      roles: [
        "UI Designer",
        "UX Designer",
        "UI/UX Designer",
        "Product Designer",
      ],
    },
    {
      name: "Business & Management",
      roles: [
        "Business Analyst",
        "Technical Business Analyst",
        "Product Manager",
        "Technical Product Manager",
        "IT Project Manager",
        "Scrum Master",
        "Project Manager",
      ],
    },
    {
      name: "Emerging Technologies",
      roles: [
        "Blockchain Developer",
        "Web3 Developer",
        "AR/VR Developer",
        "Robotics Engineer",
        "IoT Engineer",
      ],
    },
  ];

  // =====================================================
  // LOCATIONS
  // =====================================================

  const locations = [
    {
      state: "Karnataka",
      cities: [
        "Bengaluru",
        "Mysuru",
        "Mangaluru",
      ],
    },
    {
      state: "Maharashtra",
      cities: [
        "Pune",
        "Mumbai",
        "Nagpur",
        "Nashik",
      ],
    },
    {
      state: "Telangana",
      cities: [
        "Hyderabad",
        "Warangal",
      ],
    },
    {
      state: "Tamil Nadu",
      cities: [
        "Chennai",
        "Coimbatore",
        "Madurai",
      ],
    },
    {
      state: "Delhi NCR",
      cities: [
        "New Delhi",
        "Noida",
        "Greater Noida",
        "Gurugram",
        "Ghaziabad",
        "Faridabad",
      ],
    },
    {
      state: "Uttar Pradesh",
      cities: [
        "Lucknow",
        "Kanpur",
        "Prayagraj",
        "Varanasi",
      ],
    },
    {
      state: "West Bengal",
      cities: ["Kolkata"],
    },
    {
      state: "Gujarat",
      cities: [
        "Ahmedabad",
        "Gandhinagar",
        "Vadodara",
        "Surat",
      ],
    },
    {
      state: "Rajasthan",
      cities: [
        "Jaipur",
        "Udaipur",
        "Jodhpur",
      ],
    },
    {
      state: "Kerala",
      cities: [
        "Kochi",
        "Thiruvananthapuram",
        "Kozhikode",
      ],
    },
    {
      state: "Andhra Pradesh",
      cities: [
        "Visakhapatnam",
        "Vijayawada",
        "Tirupati",
      ],
    },
    {
      state: "Bihar",
      cities: [
        "Patna",
        "Gaya",
      ],
    },
    {
      state: "Jharkhand",
      cities: [
        "Ranchi",
        "Jamshedpur",
      ],
    },
    {
      state: "Odisha",
      cities: [
        "Bhubaneswar",
        "Cuttack",
      ],
    },
    {
      state: "Madhya Pradesh",
      cities: [
        "Indore",
        "Bhopal",
      ],
    },
    {
      state: "Chhattisgarh",
      cities: [
        "Raipur",
        "Bhilai",
      ],
    },
    {
      state: "Punjab",
      cities: [
        "Mohali",
        "Ludhiana",
        "Amritsar",
      ],
    },
    {
      state: "Chandigarh",
      cities: ["Chandigarh"],
    },
    {
      state: "Goa",
      cities: ["Panaji"],
    },
    {
      state: "Uttarakhand",
      cities: ["Dehradun"],
    },
    {
      state: "Himachal Pradesh",
      cities: [
        "Shimla",
        "Dharamshala",
      ],
    },
    {
      state: "Jammu & Kashmir",
      cities: [
        "Srinagar",
        "Jammu",
      ],
    },
  ];

  // =====================================================
  // NORMALIZE JOB
  // =====================================================

  const normalizeJob = (job) => {
    const uniqueId =
      job?._id ||
      job?.id ||
      `${job?.company}-${job?.title}-${job?.location}`;

    return {
      ...job,

      _id: String(uniqueId),
      id: String(uniqueId),

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

      experience:
        job?.experience ||
        "Not Disclosed",

      salary:
        job?.salary ||
        "Not Disclosed",

      skills:
        Array.isArray(job?.skills)
          ? job.skills
          : [],

      description:
        job?.description ||
        "",

      applyUrl:
        job?.applyUrl ||
        "#",

      companyUrl:
        job?.companyUrl ||
        "#",

      recruiterEmail:
        job?.recruiterEmail ||
        "",

      recruiterPhone:
        job?.recruiterPhone ||
        "",

      match:
        Number(job?.match) || 0,

      matchingSkills:
        Array.isArray(
          job?.matchingSkills
        )
          ? job.matchingSkills
          : [],

      mode:
        job?.mode ||
        "",

      source:
        job?.source ||
        "mongodb",

      provider:
        job?.provider ||
        "MongoDB",

      isExternal:
        Boolean(job?.isExternal),

      externalId:
        job?.externalId ||
        "",
    };
  };

  // =====================================================
  // LOCATION MATCH
  // =====================================================

  const locationMatches = (
    jobLocation,
    selectedLocation
  ) => {
    if (!selectedLocation) {
      return true;
    }

    const jobText =
      String(jobLocation || "")
        .toLowerCase();

    const selected =
      String(selectedLocation || "")
        .toLowerCase();

    // Bengaluru / Bangalore
    if (
      selected === "bengaluru" ||
      selected === "bangalore"
    ) {
      return (
        jobText.includes("bengaluru") ||
        jobText.includes("bangalore")
      );
    }

    // Mumbai / Bombay
    if (selected === "mumbai") {
      return (
        jobText.includes("mumbai") ||
        jobText.includes("bombay")
      );
    }

    // Gurugram / Gurgaon
    if (
      selected === "gurugram" ||
      selected === "gurgaon"
    ) {
      return (
        jobText.includes("gurugram") ||
        jobText.includes("gurgaon")
      );
    }

    return jobText.includes(
      selected
    );
  };

  // =====================================================
  // WORK MODE FILTER
  // =====================================================

  const filterByWorkMode = (
    jobList
  ) => {
    if (workMode === "Any") {
      return jobList;
    }

    return jobList.filter(
      (job) => {
        const mode =
          String(
            job?.mode || ""
          ).toLowerCase();

        return (
          mode ===
          workMode.toLowerCase()
        );
      }
    );
  };

  // =====================================================
  // SEARCH JOBS
  // =====================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSearched(false);
    setResumeMode(false);

    try {
      const params = new URLSearchParams();

      if (role.trim()) {
        params.append("role", role.trim());
      }

      if (location.trim()) {
        params.append("location", location.trim());
      }

      if (experience.trim()) {
        params.append("experience", experience.trim());
      }

      if (jobType.trim()) {
        params.append("jobType", jobType.trim());
      }

      if (workMode !== "Any") {
        params.append("workMode", workMode);
      }

      const url =
        `${API_BASE_URL}/jobs/search?${params.toString()}`;

      console.log("========================================");
      console.log("SEARCH REQUEST");
      console.log("========================================");
      console.log("URL:", url);
      console.log("Filters:", {
        role,
        location,
        experience,
        jobType,
        workMode,
      });

      const response = await fetch(url);

      const data = await response.json();

      console.log("========================================");
      console.log("BACKEND RESPONSE");
      console.log("========================================");
      console.log("Success:", data.success);
      console.log("Count:", data.count);
      console.log("Jobs:", data.jobs);

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to search jobs."
        );
      }

      // =================================================
      // NORMALIZE BACKEND JOBS
      // =================================================

      let apiJobs = Array.isArray(data.jobs)
        ? data.jobs.map(normalizeJob)
        : [];

      console.log(
        "Jobs after normalize:",
        apiJobs.length
      );

      // =================================================
      // IMPORTANT:
      // DO NOT APPLY STRICT LOCATION FILTER HERE
      //
      // Backend already handles location.
      // External APIs can return:
      // Worldwide / Remote / Anywhere / Country etc.
      // =================================================

      // =================================================
      // WORK MODE
      // =================================================

      if (workMode !== "Any") {
        apiJobs = apiJobs.filter((job) => {
          const mode = String(job.mode || "").toLowerCase();
          const type = String(job.type || "").toLowerCase();
          const locationText = String(
            job.location || ""
          ).toLowerCase();

          const requestedMode =
            workMode.toLowerCase();

          // -------------------------------
          // REMOTE
          // -------------------------------

          if (requestedMode === "remote") {
            return (
              mode.includes("remote") ||
              type.includes("remote") ||
              locationText.includes("remote") ||
              locationText.includes("worldwide") ||
              locationText.includes("anywhere") ||
              job.source === "external"
            );
          }

          // -------------------------------
          // HYBRID
          // -------------------------------

          if (requestedMode === "hybrid") {
            return (
              mode.includes("hybrid") ||
              locationText.includes("hybrid")
            );
          }

          // -------------------------------
          // ON-SITE
          // -------------------------------

          if (
            requestedMode === "on-site" ||
            requestedMode === "onsite"
          ) {
            return (
              mode.includes("on-site") ||
              mode.includes("onsite") ||
              locationText.includes("on-site") ||
              locationText.includes("onsite")
            );
          }

          return true;
        });
      }

      console.log(
        "Jobs after work mode filter:",
        apiJobs.length
      );

      // =================================================
      // REMOVE DUPLICATES
      // =================================================

      const uniqueJobs = [];
      const seen = new Set();

      apiJobs.forEach((job) => {
        const normalizedTitle = String(
          job.title || ""
        )
          .toLowerCase()
          .trim();

        const normalizedCompany = String(
          job.company || ""
        )
          .toLowerCase()
          .trim();

        const normalizedLocation = String(
          job.location || ""
        )
          .toLowerCase()
          .trim();

        const key =
          job.applyUrl &&
            job.applyUrl !== "#"
            ? job.applyUrl
            : `${normalizedTitle}|${normalizedCompany}|${normalizedLocation}`;

        if (!seen.has(key)) {
          seen.add(key);
          uniqueJobs.push(job);
        }
      });

      // =================================================
      // SORT BY MATCH SCORE
      // =================================================

      uniqueJobs.sort(
        (a, b) =>
          Number(b.match || 0) -
          Number(a.match || 0)
      );

      // =================================================
      // SET RESULTS
      // =================================================

      setJobs(uniqueJobs);
      setSearched(true);

      // =================================================
      // DEBUG
      // =================================================

      const mongoJobs = uniqueJobs.filter(
        (job) =>
          job.source === "mongodb" ||
          job.source === "internal"
      );

      const externalJobs = uniqueJobs.filter(
        (job) =>
          job.source === "external" ||
          job.isExternal === true
      );

      console.log("========================================");
      console.log("FINAL JOB RESULTS");
      console.log("========================================");
      console.log("Total Jobs:", uniqueJobs.length);
      console.log("MongoDB Jobs:", mongoJobs.length);
      console.log("External Jobs:", externalJobs.length);
      console.log("========================================");

      console.table(
        uniqueJobs.map((job) => ({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          mode: job.mode,
          source: job.source,
          provider: job.provider,
          external: job.isExternal,
          match: job.match,
        }))
      );

    } catch (error) {
      console.error(
        "Job Search Error:",
        error
      );

      setJobs([]);
      setSearched(true);

      alert(
        error.message ||
        "Unable to search jobs."
      );
    } finally {
      setLoading(false);
    }
  };
  // =====================================================
  // RESUME SEARCH
  //
  // NOTE:
  // Actual resume AI recommendation requires
  // a resume upload + backend resume analysis API.
  // This function currently loads all available jobs.
  // =====================================================

  const handleResumeSearch =
    async () => {
      setLoading(true);
      setSearched(false);
      setResumeMode(true);

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/jobs/search`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Failed to load jobs."
          );
        }

        let apiJobs =
          Array.isArray(data.jobs)
            ? data.jobs.map(
              normalizeJob
            )
            : [];

        apiJobs.sort(
          (a, b) =>
            (b.match || 0) -
            (a.match || 0)
        );

        setJobs(apiJobs);
        setSearched(true);
      } catch (error) {
        console.error(
          "Resume Job Search Error:",
          error
        );

        setJobs([]);
        setSearched(true);

        alert(
          error.message ||
          "Unable to load jobs."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {
    setRole("");
    setLocation("");
    setExperience("Fresher");
    setJobType("Full Time");
    setWorkMode("Any");

    setJobs([]);
    setSearched(false);
    setResumeMode(false);
  };

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewJob = (
    job
  ) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  // =====================================================
  // APPLY
  // =====================================================

  const handleApply = (
    job
  ) => {
    setSelectedJob(job);
    setApplicationSuccess(false);
    setApplying(false);
    setShowJobModal(false);

    // ---------------------------------------------------
    // EXTERNAL JOB
    // ---------------------------------------------------

    if (
      job?.isExternal ||
      job?.source === "external"
    ) {
      if (
        job.applyUrl &&
        job.applyUrl !== "#"
      ) {
        const shouldContinue =
          window.confirm(
            `You are being redirected to ${job.company}'s application page. Continue?`
          );

        if (shouldContinue) {
          window.open(
            job.applyUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }
      } else {
        alert(
          "This external job does not have a valid application link."
        );
      }

      return;
    }

    // ---------------------------------------------------
    // MONGODB JOB
    // ---------------------------------------------------

    setShowApplyModal(true);
  };

  // =====================================================
  // CLOSE APPLY MODAL
  // =====================================================

  const closeApplyModal = () => {
    if (applying) {
      return;
    }

    setShowApplyModal(false);
    setSelectedJob(null);
    setApplicationSuccess(false);
  };

  // =====================================================
  // RESUME CHANGE
  // =====================================================

  const handleResumeChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

    const extension =
      file.name
        .toLowerCase()
        .split(".")
        .pop();

    if (
      !allowedTypes.includes(
        file.type
      ) &&
      !allowedExtensions.includes(
        extension
      )
    ) {
      alert(
        "Please upload your resume in PDF, DOC or DOCX format."
      );

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Resume size must be less than 5 MB."
      );

      e.target.value = "";
      setResumeFile(null);

      return;
    }

    setResumeFile(file);
  };

  // =====================================================
  // APPLICATION SUBMIT
  // =====================================================

  const handleApplicationSubmit =
    async (e) => {
      e.preventDefault();

      if (!selectedJob) {
        alert(
          "Please select a job first."
        );
        return;
      }

      if (
        !applicantName.trim() ||
        !applicantEmail.trim() ||
        !applicantPhone.trim()
      ) {
        alert(
          "Please fill in your name, email and phone number."
        );
        return;
      }

      if (!resumeFile) {
        alert(
          "Please upload your resume before applying."
        );
        return;
      }

      // External job should never reach this form.
      if (
        selectedJob.isExternal ||
        selectedJob.source ===
        "external"
      ) {
        alert(
          "External jobs must be applied for through the company's application page."
        );
        return;
      }

      const jobId =
        selectedJob._id ||
        selectedJob.id;

      if (!jobId) {
        alert(
          "This job does not have a valid Job ID."
        );
        return;
      }

      setApplying(true);

      try {
        const formData =
          new FormData();

        formData.append(
          "jobId",
          String(jobId)
        );

        formData.append(
          "applicantName",
          applicantName.trim()
        );

        formData.append(
          "applicantEmail",
          applicantEmail.trim()
        );

        formData.append(
          "applicantPhone",
          applicantPhone.trim()
        );

        formData.append(
          "coverLetter",
          coverLetter.trim()
        );

        formData.append(
          "matchScore",
          String(
            selectedJob.match || 0
          )
        );

        formData.append(
          "jobTitle",
          selectedJob.title || ""
        );

        formData.append(
          "company",
          selectedJob.company || ""
        );

        formData.append(
          "resume",
          resumeFile
        );

        console.log(
          "Submitting MongoDB job application:",
          {
            jobId,
            jobTitle:
              selectedJob.title,
            company:
              selectedJob.company,
            applicantName,
            applicantEmail,
            applicantPhone,
            resume:
              resumeFile.name,
          }
        );

        // IMPORTANT:
        // Backend route is /api/jobs/apply
        const response =
          await fetch(
            `${API_BASE_URL}/jobs/apply`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        console.log(
          "Application API Response:",
          data
        );

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Application submit nahi ho paya."
          );
        }

        // -------------------------------------------------
        // LOCAL APPLICATION HISTORY
        // -------------------------------------------------

        try {
          const application = {
            id:
              data.application?.id ||
              data.application?._id ||
              `${Date.now()}`,

            jobId: String(jobId),

            jobTitle:
              selectedJob.title,

            company:
              selectedJob.company,

            jobLocation:
              selectedJob.location,

            applicantName:
              applicantName.trim(),

            applicantEmail:
              applicantEmail.trim(),

            applicantPhone:
              applicantPhone.trim(),

            resumeName:
              resumeFile.name,

            coverLetter:
              coverLetter.trim(),

            status:
              data.application
                ?.status ||
              "Applied",

            recruiterEmailSent:
              data.application
                ?.recruiterEmailSent ||
              false,

            candidateEmailSent:
              data.application
                ?.candidateEmailSent ||
              false,

            appliedAt:
              data.application
                ?.createdAt ||
              new Date().toISOString(),
          };

          const existing =
            JSON.parse(
              localStorage.getItem(
                "careerAIApplications"
              ) || "[]"
            );

          localStorage.setItem(
            "careerAIApplications",
            JSON.stringify([
              ...existing,
              application,
            ])
          );
        } catch (localError) {
          console.warn(
            "Local history save failed:",
            localError
          );
        }

        setApplicationSuccess(
          true
        );
      } catch (error) {
        console.error(
          "Application Error:",
          error
        );

        alert(
          error.message ||
          "Application submit nahi ho paya. Please try again."
        );
      } finally {
        setApplying(false);
      }
    };

  // =====================================================
  // RESET APPLICATION
  // =====================================================

  const resetApplicationForm =
    () => {
      setApplicantName("");
      setApplicantEmail("");
      setApplicantPhone("");
      setCoverLetter("");
      setResumeFile(null);
      setApplicationSuccess(false);
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="job-page">
      <div className="job-container">

        {/* HEADER */}
        <div className="page-header">
          <div className="header-icon">
            💼
          </div>

          <div>
            <h1>
              AI Job Search
            </h1>

            <p>
              Find IT jobs from your
              database and live external
              job sources.
            </p>
          </div>
        </div>

        {/* SEARCH CARD */}
        <div className="search-card">

          <div className="section-heading">
            <div className="heading-icon">
              🔍
            </div>

            <div>
              <h2>
                Find Your Perfect IT Job
              </h2>

              <p>
                Search MongoDB jobs and
                live external jobs together.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch}>

            <div className="search-grid">

              {/* ROLE */}
              <div className="form-group">
                <label>
                  Job Role
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    All IT Jobs
                  </option>

                  {jobCategories.map(
                    (category) => (
                      <optgroup
                        key={
                          category.name
                        }
                        label={
                          category.name
                        }
                      >
                        {category.roles.map(
                          (jobRole) => (
                            <option
                              key={
                                jobRole
                              }
                              value={
                                jobRole
                              }
                            >
                              {jobRole}
                            </option>
                          )
                        )}
                      </optgroup>
                    )
                  )}
                </select>
              </div>

              {/* LOCATION */}
              <div className="form-group">
                <label>
                  Location
                </label>

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    All India
                  </option>

                  {locations.map(
                    (item) => (
                      <optgroup
                        key={
                          item.state
                        }
                        label={
                          item.state
                        }
                      >
                        {item.cities.map(
                          (city) => (
                            <option
                              key={city}
                              value={city}
                            >
                              {city}
                            </option>
                          )
                        )}
                      </optgroup>
                    )
                  )}
                </select>
              </div>

              {/* EXPERIENCE */}
              <div className="form-group">
                <label>
                  Experience
                </label>

                <select
                  value={experience}
                  onChange={(e) =>
                    setExperience(
                      e.target.value
                    )
                  }
                >
                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="0-1 Years">
                    0-1 Years
                  </option>

                  <option value="1-2 Years">
                    1-2 Years
                  </option>

                  <option value="2-3 Years">
                    2-3 Years
                  </option>

                  <option value="3+ Years">
                    3+ Years
                  </option>
                </select>
              </div>

              {/* JOB TYPE */}
              <div className="form-group">
                <label>
                  Job Type
                </label>

                <select
                  value={jobType}
                  onChange={(e) =>
                    setJobType(
                      e.target.value
                    )
                  }
                >
                  <option value="Full Time">
                    Full Time
                  </option>

                  <option value="Part Time">
                    Part Time
                  </option>

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Remote">
                    Remote
                  </option>
                </select>
              </div>

              {/* WORK MODE */}
              <div className="form-group">
                <label>
                  Work Mode
                </label>

                <select
                  value={workMode}
                  onChange={(e) =>
                    setWorkMode(
                      e.target.value
                    )
                  }
                >
                  <option value="Any">
                    Any
                  </option>

                  <option value="Remote">
                    Remote
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                  <option value="On-site">
                    On-site
                  </option>
                </select>
              </div>
            </div>

            <div className="search-buttons">

              <button
                type="submit"
                className="search-button"
                disabled={loading}
              >
                {loading
                  ? "Searching..."
                  : "🔍 Search IT Jobs"}
              </button>

              <button
                type="button"
                className="clear-button"
                onClick={
                  handleClear
                }
                disabled={loading}
              >
                Clear
              </button>

            </div>
          </form>
        </div>

        {/* RESUME CARD */}
        <div className="resume-card">

          <div className="resume-left">

            <div className="resume-icon">
              🤖
            </div>

            <div>
              <h2>
                Find Jobs Using My Resume
              </h2>

              <p>
                Resume-based AI matching
                will be connected to your
                resume analyzer backend.
              </p>

              <div className="resume-points">
                <span>
                  ✓ Skills Matching
                </span>

                <span>
                  ✓ AI Match Score
                </span>

                <span>
                  ✓ Skill Gap
                </span>
              </div>
            </div>

          </div>

          <button
            type="button"
            className="resume-button"
            onClick={
              handleResumeSearch
            }
            disabled={loading}
          >
            {loading &&
              resumeMode
              ? "Loading..."
              : "🤖 Find Jobs From My Resume"}
          </button>

        </div>

        {/* RESULTS */}
        {searched && (
          <div className="results-section">

            <div className="results-header">

              <div>
                <h2>
                  {resumeMode
                    ? "AI Recommended Jobs"
                    : "Job Search Results"}
                </h2>

                <p>
                  {resumeMode
                    ? "Available jobs from your connected job sources."
                    : "MongoDB and external jobs matching your search."}
                </p>
              </div>

              <div className="job-count">
                {jobs.length} Jobs Found
              </div>

            </div>

            {jobs.length === 0 ? (

              <div className="no-jobs">

                <div className="no-job-icon">
                  🔎
                </div>

                <h3>
                  No matching jobs found
                </h3>

                <p>
                  Try another role,
                  location or experience
                  filter.
                </p>

                <button
                  type="button"
                  className="try-button"
                  onClick={
                    handleClear
                  }
                >
                  Try All Jobs
                </button>

              </div>

            ) : (

              <div className="jobs-grid">

                {jobs.map((job) => (

                  <div
                    className="job-card"
                    key={
                      job._id ||
                      job.id
                    }
                  >

                    {/* TOP */}
                    <div className="job-top">

                      <div className="company-logo">
                        {job.company
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "C"}
                      </div>

                      <div className="job-title">

                        <h3>
                          {job.title}
                        </h3>

                        <p>
                          {job.company}
                        </p>

                      </div>

                      <div className="match">

                        <strong>
                          {job.match || 0}%
                        </strong>

                        <small>
                          Match
                        </small>

                      </div>

                    </div>

                    {/* SOURCE */}
                    <div className="job-source">

                      {job.source ===
                        "external" ? (
                        <span>
                          🌐 Live External Job
                        </span>
                      ) : (
                        <span>
                          🗄️ Career AI Job
                        </span>
                      )}

                      {job.provider && (
                        <small>
                          {job.provider}
                        </small>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="job-info">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.type}
                      </span>

                      {job.mode && (
                        <span>
                          🏠 {job.mode}
                        </span>
                      )}

                      <span>
                        🎓 {job.experience}
                      </span>

                      <span>
                        💰 {job.salary}
                      </span>

                    </div>

                    {/* MATCH */}
                    <div className="ai-match">

                      <div className="ai-match-title">
                        🎯 Job Match
                      </div>

                      <div className="progress">

                        <div
                          className="progress-bar"
                          style={{
                            width:
                              `${Math.min(
                                Math.max(
                                  Number(
                                    job.match
                                  ) || 0,
                                  0
                                ),
                                100
                              )}%`,
                          }}
                        />

                      </div>

                      <p>
                        Current match:
                        {" "}
                        <strong>
                          {job.match || 0}%
                        </strong>
                      </p>

                    </div>

                    {/* SKILLS */}
                    <div className="skills-box">

                      <h4>
                        Required Skills
                      </h4>

                      <div className="skills">

                        {(
                          job.skills ||
                          []
                        ).map(
                          (skill) => (
                            <span
                              key={
                                skill
                              }
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

                    {/* MATCHING SKILLS */}
                    {job.matchingSkills
                      ?.length >
                      0 && (
                        <div className="matching-skills">

                          <h4>
                            ✓ Matching Skills
                          </h4>

                          <div className="skills">

                            {job.matchingSkills.map(
                              (skill) => (
                                <span
                                  key={
                                    skill
                                  }
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    {/* ACTIONS */}
                    <div className="job-actions">

                      <button
                        type="button"
                        className="view-job"
                        onClick={() =>
                          handleViewJob(
                            job
                          )
                        }
                      >
                        View Job
                      </button>

                      <button
                        type="button"
                        className="apply-job"
                        onClick={() =>
                          handleApply(
                            job
                          )
                        }
                      >
                        {job.isExternal ||
                          job.source ===
                          "external"
                          ? "Apply on Company Site →"
                          : "Apply Now →"}
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>
        )}

      </div>

      {/* =====================================================
          VIEW JOB MODAL
      ===================================================== */}

      {showJobModal &&
        selectedJob && (

          <div
            className="modal-overlay"
            onClick={() =>
              setShowJobModal(
                false
              )
            }
          >

            <div
              className="job-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setShowJobModal(
                    false
                  )
                }
                aria-label="Close"
              >
                ×
              </button>

              <div className="modal-job-header">

                <div className="modal-company-logo">
                  {selectedJob.company
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "C"}
                </div>

                <div>

                  <h2>
                    {
                      selectedJob.title
                    }
                  </h2>

                  <p>
                    {
                      selectedJob.company
                    }
                  </p>

                </div>

              </div>

              <div className="modal-job-info">

                <span>
                  📍{" "}
                  {
                    selectedJob.location
                  }
                </span>

                <span>
                  💼{" "}
                  {
                    selectedJob.type
                  }
                </span>

                {selectedJob.mode && (
                  <span>
                    🏠{" "}
                    {
                      selectedJob.mode
                    }
                  </span>
                )}

                <span>
                  🎓{" "}
                  {
                    selectedJob.experience
                  }
                </span>

                <span>
                  💰{" "}
                  {
                    selectedJob.salary
                  }
                </span>

              </div>

              {/* SOURCE */}
              <div className="selected-search-info">

                <strong>
                  Job Source:
                </strong>

                <span>
                  {selectedJob.source ===
                    "external"
                    ? `Live External Job${selectedJob.provider
                      ? ` (${selectedJob.provider})`
                      : ""
                    }`
                    : "Career AI MongoDB"}
                </span>

              </div>

              {/* DESCRIPTION */}
              {selectedJob.description && (

                <div className="modal-section">

                  <h3>
                    Job Description
                  </h3>

                  <p className="job-description">
                    {
                      selectedJob.description
                    }
                  </p>

                </div>

              )}

              {/* SKILLS */}
              <div className="modal-section">

                <h3>
                  Required Skills
                </h3>

                <div className="skills">

                  {(
                    selectedJob.skills ||
                    []
                  ).map(
                    (skill) => (
                      <span
                        key={
                          skill
                        }
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* SEARCH INFO */}
              <div className="selected-search-info">

                <strong>
                  Your Search:
                </strong>

                <span>
                  Role:{" "}
                  {role ||
                    "All IT Jobs"}
                </span>

                <span>
                  Location:{" "}
                  {location ||
                    "All India"}
                </span>

              </div>

              {/* EXTERNAL SOURCE LINK */}
              {selectedJob.source ===
                "external" &&
                selectedJob.applyUrl &&
                selectedJob.applyUrl !==
                "#" && (
                  <a
                    href={
                      selectedJob.applyUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-apply-button"
                    style={{
                      display:
                        "block",
                      textAlign:
                        "center",
                      textDecoration:
                        "none",
                    }}
                  >
                    Open Original Job →
                  </a>
                )}

              {/* APPLY */}
              <button
                type="button"
                className="modal-apply-button"
                onClick={() =>
                  handleApply(
                    selectedJob
                  )
                }
              >
                {selectedJob.source ===
                  "external"
                  ? "Apply on Company Site →"
                  : "Apply With My Resume →"}
              </button>

            </div>

          </div>
        )}

      {/* =====================================================
          APPLY MODAL - ONLY MONGODB JOBS
      ===================================================== */}

      {showApplyModal &&
        selectedJob && (

          <div
            className="modal-overlay"
            onClick={
              closeApplyModal
            }
          >

            <div
              className="apply-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeApplyModal
                }
                aria-label="Close"
              >
                ×
              </button>

              {!applicationSuccess ? (

                <>
                  <div className="apply-modal-header">

                    <div className="apply-icon">
                      📄
                    </div>

                    <div>

                      <h2>
                        Apply for{" "}
                        {
                          selectedJob.title
                        }
                      </h2>

                      <p>
                        {
                          selectedJob.company
                        }{" "}
                        •{" "}
                        {
                          selectedJob.location
                        }
                      </p>

                    </div>

                  </div>

                  <div className="application-job-summary">

                    <span>
                      🎯{" "}
                      {
                        selectedJob.match ||
                        0
                      }% Match
                    </span>

                    <span>
                      📍{" "}
                      {
                        selectedJob.location
                      }
                    </span>

                    <span>
                      💼{" "}
                      {
                        selectedJob.type
                      }
                    </span>

                  </div>

                  <form
                    onSubmit={
                      handleApplicationSubmit
                    }
                  >

                    <div className="application-grid">

                      <div className="application-field">

                        <label>
                          Full Name *
                        </label>

                        <input
                          type="text"
                          value={
                            applicantName
                          }
                          onChange={(e) =>
                            setApplicantName(
                              e.target.value
                            )
                          }
                          placeholder="Enter your full name"
                          required
                        />

                      </div>

                      <div className="application-field">

                        <label>
                          Email *
                        </label>

                        <input
                          type="email"
                          value={
                            applicantEmail
                          }
                          onChange={(e) =>
                            setApplicantEmail(
                              e.target.value
                            )
                          }
                          placeholder="you@example.com"
                          required
                        />

                      </div>

                      <div className="application-field">

                        <label>
                          Phone Number *
                        </label>

                        <input
                          type="tel"
                          value={
                            applicantPhone
                          }
                          onChange={(e) =>
                            setApplicantPhone(
                              e.target.value
                            )
                          }
                          placeholder="Enter phone number"
                          required
                        />

                      </div>

                      <div className="application-field">

                        <label>
                          Selected Role
                        </label>

                        <input
                          type="text"
                          value={
                            selectedJob.title
                          }
                          readOnly
                        />

                      </div>

                    </div>

                    {/* RESUME */}
                    <div className="application-field">

                      <label>
                        Resume * (PDF, DOC,
                        DOCX — max 5 MB)
                      </label>

                      <label className="resume-upload-box">

                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={
                            handleResumeChange
                          }
                        />

                        <span className="upload-icon">
                          📎
                        </span>

                        <strong>
                          {resumeFile
                            ? resumeFile.name
                            : "Click to upload your resume"}
                        </strong>

                        <small>
                          {resumeFile
                            ? "Resume ready for submission."
                            : "PDF, DOC or DOCX — maximum 5 MB."}
                        </small>

                      </label>

                    </div>

                    {/* COVER LETTER */}
                    <div className="application-field">

                      <label>
                        Cover Letter / Message
                        (Optional)
                      </label>

                      <textarea
                        value={
                          coverLetter
                        }
                        onChange={(e) =>
                          setCoverLetter(
                            e.target.value
                          )
                        }
                        placeholder="Tell the recruiter why you are a good fit..."
                        rows="5"
                      />

                    </div>

                    <div className="application-selected">

                      <span>
                        💼 Applying for:{" "}
                        <strong>
                          {
                            selectedJob.title
                          }
                        </strong>
                      </span>

                      <span>
                        🏢 Company:{" "}
                        <strong>
                          {
                            selectedJob.company
                          }
                        </strong>
                      </span>

                      <span>
                        📍 Location:{" "}
                        <strong>
                          {
                            selectedJob.location
                          }
                        </strong>
                      </span>

                    </div>

                    <div className="application-actions">

                      <button
                        type="button"
                        className="cancel-application"
                        onClick={
                          closeApplyModal
                        }
                        disabled={
                          applying
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="submit-application"
                        disabled={
                          applying
                        }
                      >
                        {applying
                          ? "Submitting Application..."
                          : "🚀 Submit Application"}
                      </button>

                    </div>

                  </form>
                </>

              ) : (

                <div className="application-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Application Submitted!
                  </h2>

                  <p>
                    Your application for{" "}
                    <strong>
                      {
                        selectedJob.title
                      }
                    </strong>{" "}
                    at{" "}
                    <strong>
                      {
                        selectedJob.company
                      }
                    </strong>{" "}
                    has been submitted
                    successfully.
                  </p>

                  <div className="success-details">

                    <div>
                      <span>
                        📄 Resume
                      </span>

                      <strong>
                        {
                          resumeFile?.name
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        📍 Location
                      </span>

                      <strong>
                        {
                          selectedJob.location
                        }
                      </strong>
                    </div>

                    <div>
                      <span>
                        🎯 Match
                      </span>

                      <strong>
                        {
                          selectedJob.match ||
                          0
                        }%
                      </strong>
                    </div>

                  </div>

                  <p className="success-note">
                    Your application has
                    been submitted to the
                    Career AI backend.
                  </p>

                  <div className="success-actions">

                    <button
                      type="button"
                      className="new-application"
                      onClick={
                        resetApplicationForm
                      }
                    >
                      Apply to Another Job
                    </button>

                    <button
                      type="button"
                      className="done-application"
                      onClick={
                        closeApplyModal
                      }
                    >
                      Done
                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

    </div>
  );
};

export default JobSearch;

