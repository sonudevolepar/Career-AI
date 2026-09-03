import React, { useState } from "react";

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
  // JOB ROLES
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
  // SEARCH JOBS FROM MONGODB
  // =====================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSearched(false);
    setResumeMode(false);

    try {
      const params = new URLSearchParams();

      if (role.trim() !== "") {
        params.append(
          "role",
          role.trim()
        );
      }

      if (location.trim() !== "") {
        params.append(
          "location",
          location.trim()
        );
      }

      if (experience.trim() !== "") {
        params.append(
          "experience",
          experience.trim()
        );
      }

      if (jobType.trim() !== "") {
        params.append(
          "jobType",
          jobType.trim()
        );
      }

      const url =
        `${API_BASE_URL}/jobs/search` +
        (params.toString()
          ? `?${params.toString()}`
          : "");

      console.log(
        "Searching jobs:",
        url
      );

      const response = await fetch(url);

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to search jobs."
        );
      }

      // =================================================
      // NORMALIZE MONGODB JOBS
      // =================================================

      let apiJobs = (
        data.jobs || []
      ).map((job) => ({
        ...job,

        // VERY IMPORTANT:
        // preserve MongoDB ObjectId
        _id:
          job._id ||
          job.id,

        id:
          job._id ||
          job.id,

        title:
          job.title || "Untitled Job",

        company:
          job.company || "Unknown Company",

        location:
          job.location || "Not Disclosed",

        type:
          job.type || "Full Time",

        experience:
          job.experience || "Not Disclosed",

        salary:
          job.salary || "Not Disclosed",

        skills:
          Array.isArray(job.skills)
            ? job.skills
            : [],

        description:
          job.description || "",

        recruiterEmail:
          job.recruiterEmail || "",

        match:
          Number(job.match) || 0,

        matchingSkills:
          Array.isArray(
            job.matchingSkills
          )
            ? job.matchingSkills
            : [],

        // Backend Job model currently
        // does not have mode.
        // Keep it safe for UI.
        mode:
          job.mode || "",
      }));

      // =================================================
      // WORK MODE FILTER
      //
      // Only filter if backend actually
      // provides job.mode.
      // This prevents all jobs disappearing
      // when MongoDB Job schema has no mode.
      // =================================================

      if (
        workMode !== "Any" &&
        apiJobs.some(
          (job) => job.mode
        )
      ) {
        apiJobs =
          apiJobs.filter(
            (job) =>
              job.mode
                ?.toLowerCase() ===
              workMode.toLowerCase()
          );
      }

      // =================================================
      // SORT BY MATCH SCORE
      // =================================================

      apiJobs.sort(
        (a, b) =>
          (b.match || 0) -
          (a.match || 0)
      );

      setJobs(apiJobs);
      setSearched(true);

      console.log(
        "MongoDB Jobs:",
        apiJobs
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
  // Current backend does not expose a resume
  // upload/job recommendation endpoint.
  //
  // So this button loads MongoDB jobs instead of
  // using demoJobs.
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

        let apiJobs = (
          data.jobs || []
        ).map((job) => ({
          ...job,

          _id:
            job._id ||
            job.id,

          id:
            job._id ||
            job.id,

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

          experience:
            job.experience ||
            "Not Disclosed",

          salary:
            job.salary ||
            "Not Disclosed",

          skills:
            Array.isArray(
              job.skills
            )
              ? job.skills
              : [],

          description:
            job.description ||
            "",

          recruiterEmail:
            job.recruiterEmail ||
            "",

          match:
            Number(job.match) || 0,

          matchingSkills:
            Array.isArray(
              job.matchingSkills
            )
              ? job.matchingSkills
              : [],

          mode:
            job.mode || "",
        }));

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
            "Unable to load recommended jobs."
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

    setApplicationSuccess(
      false
    );

    setApplying(false);

    setShowJobModal(false);
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

    const extension =
      file.name
        .toLowerCase()
        .split(".")
        .pop();

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

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

      // =================================================
      // GET REAL MONGODB OBJECT ID
      // =================================================

      const mongoJobId =
        selectedJob._id ||
        selectedJob.id;

      if (!mongoJobId) {
        alert(
          "This job does not have a valid MongoDB ID."
        );

        console.error(
          "Job without MongoDB ID:",
          selectedJob
        );

        return;
      }

      setApplying(true);

      try {
        // =================================================
        // CREATE FORMDATA
        // =================================================

        const formData =
          new FormData();

        formData.append(
          "jobId",
          mongoJobId
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

        // IMPORTANT:
        // Backend multer expects "resume"
        formData.append(
          "resume",
          resumeFile
        );

        console.log(
          "Submitting application:",
          {
            jobId: mongoJobId,
            applicantName,
            applicantEmail,
            applicantPhone,
            resume:
              resumeFile.name,
          }
        );

        // =================================================
        // SEND TO BACKEND
        // =================================================

        const response =
          await fetch(
            `${API_BASE_URL}/applications/apply`,
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

        // =================================================
        // OPTIONAL LIGHTWEIGHT LOCAL HISTORY
        // =================================================

        try {
          const application = {
            id:
              data.application
                ?.id ||
              data.application
                ?._id,

            jobId:
              mongoJobId,

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

        // =================================================
        // SUCCESS
        // =================================================

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
  // RESET APPLICATION FORM
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

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="page-header">
          <div className="header-icon">
            💼
          </div>

          <div>
            <h1>
              AI Job Search
            </h1>

            <p>
              Find IT jobs based on
              your skills, experience
              and career goals.
            </p>
          </div>
        </div>

        {/* =================================================
            SEARCH CARD
        ================================================= */}

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
                Select your preferred
                role, location and work
                preferences.
              </p>
            </div>

          </div>

          <form
            onSubmit={
              handleSearch
            }
          >

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
                              key={
                                city
                              }
                              value={
                                city
                              }
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
                  value={
                    experience
                  }
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
                  value={
                    jobType
                  }
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
                  value={
                    workMode
                  }
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

            {/* BUTTONS */}

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

        {/* =================================================
            RESUME SEARCH
        ================================================= */}

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
                Let AI analyze your
                resume skills, experience
                and projects and find the
                most relevant IT jobs for
                you.
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
            {loading && resumeMode
              ? "Analyzing..."
              : "🤖 Find Jobs From My Resume"}
          </button>

        </div>

        {/* =================================================
            RESULTS
        ================================================= */}

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
                    ? "Jobs recommended according to your profile."
                    : "Jobs matching your selected filters."}
                </p>

              </div>

              <div className="job-count">
                {jobs.length} Jobs Found
              </div>

            </div>

            {/* NO JOBS */}

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

                    {/* JOB TOP */}

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

                    {/* JOB INFO */}

                    <div className="job-info">

                      <span>
                        📍{" "}
                        {job.location}
                      </span>

                      <span>
                        💼{" "}
                        {job.type}
                      </span>

                      {job.mode && (
                        <span>
                          🏠{" "}
                          {job.mode}
                        </span>
                      )}

                      <span>
                        🎓{" "}
                        {job.experience}
                      </span>

                      <span>
                        💰{" "}
                        {job.salary}
                      </span>

                    </div>

                    {/* AI MATCH */}

                    <div className="ai-match">

                      <div className="ai-match-title">
                        🎯 AI Resume Match
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
                        Your profile matches{" "}
                        <strong>
                          {job.match || 0}%
                        </strong>{" "}
                        of this job's
                        requirements.
                      </p>

                    </div>

                    {/* SKILLS */}

                    <div className="skills-box">

                      <h4>
                        Required Skills
                      </h4>

                      <div className="skills">

                        {(job.skills || []).map(
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

                    {job.matchingSkills?.length >
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

                    {/* AI REASON */}

                    {resumeMode && (

                      <div className="ai-reason">

                        <strong>
                          🤖 Why AI recommended this?
                        </strong>

                        <p>
                          This job matches
                          your technical
                          skills and is
                          suitable for your
                          current career
                          profile.
                        </p>

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
                        Apply Now →
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
                    {selectedJob.title}
                  </h2>

                  <p>
                    {selectedJob.company}
                  </p>

                </div>

              </div>

              <div className="modal-job-info">

                <span>
                  📍{" "}
                  {selectedJob.location}
                </span>

                <span>
                  💼{" "}
                  {selectedJob.type}
                </span>

                {selectedJob.mode && (
                  <span>
                    🏠{" "}
                    {selectedJob.mode}
                  </span>
                )}

                <span>
                  🎓{" "}
                  {selectedJob.experience}
                </span>

                <span>
                  💰{" "}
                  {selectedJob.salary}
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

              {/* MONGODB ID */}

              <div className="job-id-info">
                Job ID:{" "}
                {selectedJob._id ||
                  selectedJob.id}
              </div>

              <button
                type="button"
                className="modal-apply-button"
                onClick={() =>
                  handleApply(
                    selectedJob
                  )
                }
              >
                Apply With My Resume →
              </button>

            </div>

          </div>
        )}

      {/* =====================================================
          APPLY MODAL
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

                  {/* JOB SUMMARY */}

                  <div className="application-job-summary">

                    <span>
                      🎯{" "}
                      {
                        selectedJob.match ||
                        0
                      }%
                      AI Match
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

                  {/* APPLICATION FORM */}

                  <form
                    onSubmit={
                      handleApplicationSubmit
                    }
                  >

                    <div className="application-grid">

                      {/* NAME */}

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

                      {/* EMAIL */}

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

                      {/* PHONE */}

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

                      {/* SELECTED ROLE */}

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
                          required
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
                            ? "This resume will be submitted with your application."
                            : "Upload your resume in PDF, DOC or DOCX format."}
                        </small>

                      </label>

                    </div>

                    {/* COVER LETTER */}

                    <div className="application-field">

                      <label>
                        Cover Letter /
                        Message (Optional)
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

                    {/* APPLICATION INFO */}

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

                    {/* ACTIONS */}

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

                /* =================================================
                   SUCCESS
                ================================================= */

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
                        🎯 AI Match
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
                    been saved successfully.
                    The recruiter email and
                    candidate confirmation
                    are handled by the
                    backend.
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

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .job-page {
          min-height: 100vh;
          background: #f6f8fc;
          padding: 40px 20px;
        }

        .job-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HEADER */

        .page-header {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 28px;
        }

        .header-icon {
          width: 62px;
          height: 62px;
          border-radius: 15px;
          background: #dbeafe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
        }

        .page-header h1 {
          margin: 0 0 7px;
          font-size: 36px;
          color: #172554;
        }

        .page-header p {
          margin: 0;
          color: #64748b;
          font-size: 15px;
        }

        /* SEARCH CARD */

        .search-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 30px;
          box-shadow:
            0 5px 20px
            rgba(15, 23, 42, 0.06);
          margin-bottom: 24px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 25px;
        }

        .heading-icon {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .section-heading h2 {
          margin: 0 0 5px;
          color: #172554;
          font-size: 21px;
        }

        .section-heading p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .search-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .form-group select {
          width: 100%;
          min-height: 46px;
          padding: 10px 13px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #334155;
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }

        .form-group select:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.1);
        }

        /* BUTTONS */

        .search-buttons {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .search-button {
          padding: 13px 25px;
          border: none;
          border-radius: 9px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .search-button:hover {
          background: #1d4ed8;
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-button {
          padding: 13px 22px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #475569;
          font-weight: 600;
          cursor: pointer;
        }

        .clear-button:hover {
          background: #f8fafc;
        }

        .clear-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* RESUME */

        .resume-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 25px;
          margin-bottom: 35px;
          border-radius: 18px;
          border: 1px solid #bfdbfe;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #f8fafc
            );
        }

        .resume-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .resume-icon {
          min-width: 52px;
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #dbeafe;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .resume-card h2 {
          margin: 0 0 8px;
          color: #172554;
          font-size: 20px;
        }

        .resume-card p {
          margin: 0 0 12px;
          color: #64748b;
          line-height: 1.6;
          font-size: 14px;
        }

        .resume-points {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .resume-points span {
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 600;
        }

        .resume-button {
          white-space: nowrap;
          padding: 13px 20px;
          border: none;
          border-radius: 9px;
          background: #1d4ed8;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }

        .resume-button:hover {
          background: #1e40af;
        }

        .resume-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* RESULTS */

        .results-section {
          margin-top: 20px;
        }

        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .results-header h2 {
          margin: 0 0 5px;
          color: #172554;
          font-size: 23px;
        }

        .results-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .job-count {
          padding: 8px 13px;
          border-radius: 8px;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 700;
        }

        /* JOB GRID */

        .jobs-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 20px;
        }

        .job-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow:
            0 4px 15px
            rgba(15, 23, 42, 0.05);
          transition: 0.2s;
        }

        .job-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 8px 25px
            rgba(15, 23, 42, 0.09);
        }

        .job-top {
          display: flex;
          align-items: flex-start;
          gap: 11px;
        }

        .company-logo {
          width: 43px;
          min-width: 43px;
          height: 43px;
          border-radius: 10px;
          background: #dbeafe;
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .job-title {
          flex: 1;
        }

        .job-title h3 {
          margin: 0 0 5px;
          color: #172554;
          font-size: 16px;
        }

        .job-title p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
        }

        /* MATCH */

        .match {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 8px;
          border-radius: 8px;
          background: #dcfce7;
          color: #15803d;
        }

        .match strong {
          font-size: 13px;
        }

        .match small {
          font-size: 9px;
        }

        /* INFO */

        .job-info {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 18px;
          color: #475569;
          font-size: 13px;
        }

        /* AI MATCH */

        .ai-match {
          margin-top: 18px;
          padding: 12px;
          border-radius: 9px;
          background: #f8fafc;
        }

        .ai-match-title {
          margin-bottom: 9px;
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 700;
        }

        .progress {
          width: 100%;
          height: 7px;
          overflow: hidden;
          border-radius: 10px;
          background: #e2e8f0;
        }

        .progress-bar {
          height: 100%;
          border-radius: 10px;
          background: #2563eb;
        }

        .ai-match p {
          margin: 8px 0 0;
          color: #64748b;
          font-size: 11px;
        }

        /* SKILLS */

        .skills-box {
          margin-top: 17px;
        }

        .skills-box h4,
        .matching-skills h4 {
          margin: 0 0 9px;
          color: #334155;
          font-size: 13px;
        }

        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skills span {
          padding: 5px 8px;
          border-radius: 6px;
          background: #f1f5f9;
          color: #334155;
          font-size: 11px;
        }

        .matching-skills {
          margin-top: 14px;
          padding: 10px;
          border-radius: 8px;
          background: #ecfdf5;
        }

        .matching-skills h4 {
          color: #15803d;
        }

        /* AI REASON */

        .ai-reason {
          margin-top: 15px;
          padding: 11px;
          border-radius: 8px;
          background: #eff6ff;
        }

        .ai-reason strong {
          color: #1d4ed8;
          font-size: 12px;
        }

        .ai-reason p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        /* ACTIONS */

        .job-actions {
          display: flex;
          gap: 9px;
          margin-top: 19px;
        }

        .view-job,
        .apply-job {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .view-job {
          border: 1px solid #2563eb;
          background: #ffffff;
          color: #2563eb;
        }

        .view-job:hover {
          background: #eff6ff;
        }

        .apply-job {
          border: 1px solid #2563eb;
          background: #2563eb;
          color: #ffffff;
        }

        .apply-job:hover {
          background: #1d4ed8;
        }

        /* MODALS */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background:
            rgba(15, 23, 42, 0.58);
          backdrop-filter: blur(4px);
        }

        .job-modal,
        .apply-modal {
          position: relative;
          width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow:
            0 25px 70px
            rgba(15, 23, 42, 0.25);
        }

        .job-modal {
          max-width: 650px;
          padding: 30px;
        }

        .apply-modal {
          max-width: 720px;
          padding: 30px;
        }

        .modal-close {
          position: absolute;
          top: 14px;
          right: 16px;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #e2e8f0;
        }

        .modal-job-header,
        .apply-modal-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding-right: 35px;
          margin-bottom: 20px;
        }

        .modal-company-logo,
        .apply-icon {
          width: 54px;
          min-width: 54px;
          height: 54px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dbeafe;
          color: #1d4ed8;
          font-size: 25px;
          font-weight: 700;
        }

        .modal-job-header h2,
        .apply-modal-header h2 {
          margin: 0 0 5px;
          color: #172554;
          font-size: 22px;
        }

        .modal-job-header p,
        .apply-modal-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .modal-job-info,
        .application-job-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 22px;
        }

        .modal-job-info span,
        .application-job-summary span {
          padding: 8px 10px;
          border-radius: 8px;
          background: #f8fafc;
          color: #475569;
          font-size: 12px;
          font-weight: 600;
        }

        .modal-section {
          padding: 18px 0;
          border-top: 1px solid #e2e8f0;
        }

        .modal-section h3 {
          margin: 0 0 12px;
          color: #334155;
          font-size: 15px;
        }

        .job-description {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-line;
        }

        .selected-search-info {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin: 18px 0 10px;
          padding: 14px;
          border-radius: 10px;
          background: #eff6ff;
          color: #475569;
          font-size: 13px;
        }

        .selected-search-info strong:first-child {
          color: #1d4ed8;
        }

        .job-id-info {
          margin: 10px 0 18px;
          padding: 10px;
          border-radius: 8px;
          background: #f8fafc;
          color: #94a3b8;
          font-size: 10px;
          word-break: break-all;
        }

        .modal-apply-button {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 9px;
          background: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .modal-apply-button:hover {
          background: #1d4ed8;
        }

        /* APPLICATION */

        .application-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 15px;
        }

        .application-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-bottom: 16px;
        }

        .application-field label {
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .application-field input,
        .application-field textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          padding: 11px 12px;
          background: #ffffff;
          color: #334155;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          resize: vertical;
        }

        .application-field input:focus,
        .application-field textarea:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37, 99, 235, 0.1);
        }

        .application-field input[readonly] {
          background: #f8fafc;
          color: #64748b;
        }

        /* RESUME UPLOAD */

        .resume-upload-box {
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 18px;
          border: 2px dashed #93c5fd;
          border-radius: 12px;
          background: #eff6ff;
          text-align: center;
          cursor: pointer;
        }

        .resume-upload-box:hover {
          background: #dbeafe;
        }

        .resume-upload-box input {
          display: none;
        }

        .upload-icon {
          font-size: 25px;
        }

        .resume-upload-box strong {
          max-width: 100%;
          overflow: hidden;
          color: #1d4ed8;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
        }

        .resume-upload-box small {
          color: #64748b;
          font-size: 11px;
        }

        /* APPLICATION SELECTED */

        .application-selected {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 18px;
          padding: 12px;
          border-radius: 9px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
        }

        .application-selected strong {
          color: #334155;
        }

        /* APPLICATION ACTIONS */

        .application-actions,
        .success-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancel-application,
        .submit-application,
        .new-application,
        .done-application {
          padding: 11px 17px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-application {
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #475569;
        }

        .submit-application,
        .done-application {
          border: none;
          background: #2563eb;
          color: #ffffff;
        }

        .submit-application:hover,
        .done-application:hover {
          background: #1d4ed8;
        }

        .submit-application:disabled,
        .cancel-application:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* SUCCESS */

        .application-success {
          padding: 25px 10px 10px;
          text-align: center;
        }

        .success-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #dcfce7;
          color: #15803d;
          font-size: 38px;
          font-weight: 800;
        }

        .application-success h2 {
          margin: 0 0 10px;
          color: #166534;
          font-size: 24px;
        }

        .application-success > p {
          margin: 0 auto 18px;
          max-width: 570px;
          color: #64748b;
          line-height: 1.6;
          font-size: 13px;
        }

        .success-details {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0;
        }

        .success-details div {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 12px;
          border-radius: 9px;
          background: #f8fafc;
        }

        .success-details span {
          color: #64748b;
          font-size: 11px;
        }

        .success-details strong {
          overflow: hidden;
          color: #334155;
          font-size: 12px;
          text-overflow: ellipsis;
        }

        .application-success .success-note {
          padding: 10px;
          border-radius: 8px;
          background: #ecfdf5;
          color: #166534;
          font-size: 11px;
        }

        .new-application {
          border: 1px solid #2563eb;
          background: #ffffff;
          color: #2563eb;
        }

        /* NO JOBS */

        .no-jobs {
          padding: 50px 20px;
          text-align: center;
          background: #ffffff;
          border-radius: 15px;
          border: 1px solid #e2e8f0;
        }

        .no-job-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .no-jobs h3 {
          margin: 0 0 8px;
          color: #334155;
        }

        .no-jobs p {
          margin: 0 0 18px;
          color: #64748b;
        }

        .try-button {
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          background: #2563eb;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }

        .try-button:hover {
          background: #1d4ed8;
        }

        /* TABLET */

        @media (max-width: 1000px) {

          .jobs-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        /* MOBILE */

        @media (max-width: 700px) {

          .job-page {
            padding: 25px 15px;
          }

          .page-header {
            align-items: flex-start;
          }

          .page-header h1 {
            font-size: 29px;
          }

          .search-grid {
            grid-template-columns: 1fr;
          }

          .resume-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .resume-button {
            width: 100%;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .search-buttons {
            flex-direction: column;
          }

          .search-button,
          .clear-button {
            width: 100%;
          }

          .application-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .job-modal,
          .apply-modal {
            max-height: 94vh;
            padding: 22px;
          }

          .modal-job-header h2,
          .apply-modal-header h2 {
            font-size: 18px;
          }

          .success-details {
            grid-template-columns: 1fr;
          }

          .application-actions,
          .success-actions {
            flex-direction: column;
          }

          .cancel-application,
          .submit-application,
          .new-application,
          .done-application {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
};

export default JobSearch;