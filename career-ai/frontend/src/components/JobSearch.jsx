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

      if (role.trim() !== "") params.append("role", role.trim());
      if (location.trim() !== "") params.append("location", location.trim());
      if (experience.trim() !== "") params.append("experience", experience.trim());
      if (jobType.trim() !== "") params.append("jobType", jobType.trim());

      const url = `${API_BASE_URL}/jobs/search${params.toString() ? `?${params.toString()}` : ""
        }`;

      console.log("Searching jobs URL:", url);

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to search jobs.");
      }

      // =================================================
      // NORMALIZE MONGODB & EXTERNAL JOBS DATA
      // =================================================
      let apiJobs = (data.jobs || []).map((job) => {
        const uniqueId = job._id || job.id;

        return {
          ...job,

          // Preserve unique ID for both MongoDB Hex IDs and External Numeric IDs
          _id: uniqueId,
          id: uniqueId,

          title: job.title || "Untitled Job",
          company: job.company || "Unknown Company",
          location: job.location || "Not Disclosed",
          type: job.type || "Full Time",
          experience: job.experience || "Not Disclosed",
          salary: job.salary || "Not Disclosed",
          skills: Array.isArray(job.skills) ? job.skills : [],
          description: job.description || "",
          recruiterEmail: job.recruiterEmail || "",
          match: Number(job.match) || 0,
          matchingSkills: Array.isArray(job.matchingSkills)
            ? job.matchingSkills
            : [],
          mode: job.mode || "",
        };
      });

      // =================================================
      // WORK MODE FILTER
      // =================================================
      if (workMode !== "Any" && apiJobs.some((job) => job.mode)) {
        apiJobs = apiJobs.filter(
          (job) => job.mode?.toLowerCase() === workMode.toLowerCase()
        );
      }

      // =================================================
      // SORT BY MATCH SCORE
      // =================================================
      apiJobs.sort((a, b) => (b.match || 0) - (a.match || 0));

      setJobs(apiJobs);
      setSearched(true);

      // =================================================
      // DYNAMIC LOGGING BASED ON SOURCE
      // =================================================
      if (data.source === "external" || data.isExternal) {
        console.log(`Live External API Jobs (${apiJobs.length}):`, apiJobs);
      } else {
        console.log(`MongoDB Jobs (${apiJobs.length}):`, apiJobs);
      }
    } catch (error) {
      console.error("Job Search Error:", error);

      setJobs([]);
      setSearched(true);

      alert(error.message || "Unable to search jobs.");
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
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();

    if (!selectedJob) {
      alert("Please select a job first.");
      return;
    }

    if (
      !applicantName.trim() ||
      !applicantEmail.trim() ||
      !applicantPhone.trim()
    ) {
      alert("Please fill in your name, email and phone number.");
      return;
    }

    if (!resumeFile) {
      alert("Please upload your resume before applying.");
      return;
    }

    // =================================================
    // GET JOB ID (Handles Mongo Hex ID & External Numeric ID)
    // =================================================
    const mongoJobId = selectedJob._id || selectedJob.id;

    if (!mongoJobId) {
      alert("This job does not have a valid Job ID.");
      console.error("Job without ID:", selectedJob);
      return;
    }

    setApplying(true);

    try {
      // =================================================
      // CREATE FORMDATA WITH ALL JOB DETAILS
      // =================================================
      const formData = new FormData();

      formData.append("jobId", String(mongoJobId));
      formData.append("applicantName", applicantName.trim());
      formData.append("applicantEmail", applicantEmail.trim());
      formData.append("applicantPhone", applicantPhone.trim());
      formData.append("coverLetter", coverLetter.trim());
      formData.append("matchScore", String(selectedJob.match || 0));

      // Important for External API Jobs (Fallback data)
      formData.append("jobTitle", selectedJob.title || "Software Position");
      formData.append("company", selectedJob.company || "Tech Company");
      formData.append(
        "recruiterEmail",
        selectedJob.recruiterEmail || "hr@company.com"
      );

      // Backend multer expects "resume"
      formData.append("resume", resumeFile);

      console.log("Submitting application:", {
        jobId: mongoJobId,
        jobTitle: selectedJob.title,
        company: selectedJob.company,
        applicantName,
        applicantEmail,
        applicantPhone,
        resume: resumeFile.name,
      });

      // =================================================
      // SEND TO BACKEND
      // =================================================
      const response = await fetch(`${API_BASE_URL}/job/apply`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Application API Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Application submit nahi ho paya.");
      }

      // =================================================
      // LOCAL HISTORY SYNC
      // =================================================
      try {
        const application = {
          id: data.application?.id || data.application?._id,
          jobId: String(mongoJobId),
          jobTitle: selectedJob.title,
          company: selectedJob.company,
          jobLocation: selectedJob.location,
          applicantName: applicantName.trim(),
          applicantEmail: applicantEmail.trim(),
          applicantPhone: applicantPhone.trim(),
          resumeName: resumeFile.name,
          coverLetter: coverLetter.trim(),
          status: data.application?.status || "Applied",
          recruiterEmailSent: data.application?.recruiterEmailSent || false,
          candidateEmailSent: data.application?.candidateEmailSent || false,
          appliedAt: data.application?.createdAt || new Date().toISOString(),
        };

        const existing = JSON.parse(
          localStorage.getItem("careerAIApplications") || "[]"
        );

        localStorage.setItem(
          "careerAIApplications",
          JSON.stringify([...existing, application])
        );
      } catch (localError) {
        console.warn("Local history save failed:", localError);
      }

      // =================================================
      // SUCCESS STATE
      // =================================================
      setApplicationSuccess(true);
    } catch (error) {
      console.error("Application Error:", error);

      alert(
        error.message || "Application submit nahi ho paya. Please try again."
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
                          onChange={handleResumeChange}
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




    </div>
  );
};

export default JobSearch;