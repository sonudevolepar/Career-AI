import React, { useEffect, useState } from "react";
import "./jobSearch.css";

const API_BASE = "http://localhost:5000/api/jobs";

// ======================================================
// FILTER OPTIONS
// ======================================================

const roles = [
  "All IT Jobs",
  "Software Engineer",
  "Software Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "AI Engineer",
  "Machine Learning Engineer",
  "Data Scientist",
  "Data Analyst",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cyber Security Engineer",
  "QA Engineer",
  "Automation Tester",
  "Android Developer",
  "iOS Developer",
  "UI/UX Designer",
];

const locations = [
  "All India",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Delhi",
  "Noida",
  "Gurugram",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Patna",
  "Bhubaneswar",
  "Indore",
  "Coimbatore",
  "Remote",
];

const experiences = [
  "Fresher",
  "0-1 Years",
  "1-2 Years",
  "2-3 Years",
  "3+ Years",
];

const jobTypes = [
  "Full Time",
  "Part Time",
];

const workModes = [
  "Any",
  "Remote",
  "Hybrid",
  "On-site",
];

// ======================================================
// HELPERS
// ======================================================

const getMatchClass = (match) => {
  const score = Number(match) || 0;

  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "average";

  return "low";
};

const getInitials = (company = "Company") => {
  return company
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const cleanDescription = (description = "") => {
  return description
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const formatDate = (date) => {
  if (!date) return "Recently";

  const jobDate = new Date(date);

  if (Number.isNaN(jobDate.getTime())) {
    return "Recently";
  }

  return jobDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ======================================================
// COMPONENT
// ======================================================

const JobSearch = () => {
  // ======================================================
  // FILTER STATE
  // ======================================================

  const [filters, setFilters] = useState({
    role: "All IT Jobs",
    location: "All India",
    experience: "Fresher",
    jobType: "Full Time",
    workMode: "Any",
  });

  // ======================================================
  // JOB STATE
  // ======================================================

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // ======================================================
  // MODAL STATE
  // ======================================================

  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  const [showApplyModal, setShowApplyModal] = useState(false);

  // ======================================================
  // APPLICATION STATE
  // ======================================================

  const [applicationForm, setApplicationForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
  });

  const [resume, setResume] = useState(null);

  const [applicationLoading, setApplicationLoading] =
    useState(false);

  const [applicationMessage, setApplicationMessage] =
    useState("");

  const [applicationSuccess, setApplicationSuccess] =
    useState(false);

  // ======================================================
  // FILTER CHANGE
  // ======================================================

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // SEARCH JOBS
  // ======================================================

  const handleSearch = async (event) => {
    if (event) {
      event.preventDefault();
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams();

      if (filters.role && filters.role !== "All IT Jobs") {
        params.append("role", filters.role);
      }

      if (
        filters.location &&
        filters.location !== "All India"
      ) {
        params.append("location", filters.location);
      }

      if (filters.experience) {
        params.append("experience", filters.experience);
      }

      if (filters.jobType) {
        params.append("jobType", filters.jobType);
      }

      if (
        filters.workMode &&
        filters.workMode !== "Any"
      ) {
        params.append("workMode", filters.workMode);
      }

      console.log(
        "Searching jobs:",
        params.toString()
      );

      const response = await fetch(
        `${API_BASE}/search?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Job Search Response:",
        data
      );

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to search jobs"
        );
      }

      const receivedJobs = Array.isArray(
        data.jobs
      )
        ? data.jobs
        : [];

      // ==================================================
      // REMOVE DUPLICATES
      // ==================================================

      const uniqueJobs = [];
      const seen = new Set();

      receivedJobs.forEach((job) => {
        const key = [
          job.id || job._id || "",
          job.title || "",
          job.company || "",
          job.location || "",
        ]
          .join("-")
          .toLowerCase()
          .trim();

        if (!seen.has(key)) {
          seen.add(key);
          uniqueJobs.push(job);
        }
      });

      setJobs(uniqueJobs);

      if (uniqueJobs.length === 0) {
        setError(
          "No jobs found for the selected filters. Try another role or location."
        );
      }
    } catch (err) {
      console.error(
        "Job Search Error:",
        err
      );

      setJobs([]);

      if (
        err.message === "Failed to fetch" ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Backend server is not running. Please start your Career-AI backend on port 5000."
        );
      } else {
        setError(
          err.message ||
            "Unable to search jobs."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // FIRST LOAD
  // ======================================================

  useEffect(() => {
    handleSearch();
  }, []);

  // ======================================================
  // VIEW JOB
  // ======================================================

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
    setApplicationMessage("");
  };

  // ======================================================
  // CLOSE JOB MODAL
  // ======================================================

  const closeJobModal = () => {
    setShowJobModal(false);
    setSelectedJob(null);
    setApplicationMessage("");
  };

  // ======================================================
  // OPEN APPLY MODAL
  // ======================================================

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationMessage("");
    setApplicationSuccess(false);

    setShowJobModal(false);
    setShowApplyModal(true);
  };

  // ======================================================
  // CLOSE APPLY MODAL
  // ======================================================

  const closeApplyModal = () => {
    if (applicationLoading) return;

    setShowApplyModal(false);
    setSelectedJob(null);
    setApplicationMessage("");
    setApplicationSuccess(false);
  };

  // ======================================================
  // APPLICATION INPUT
  // ======================================================

  const handleApplicationChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setApplicationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // RESUME CHANGE
  // ======================================================

  const handleResumeChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      setResume(null);
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      alert(
        "Only PDF resume is allowed."
      );

      event.target.value = "";
      setResume(null);
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Resume size must be less than 5MB."
      );

      event.target.value = "";
      setResume(null);
      return;
    }

    setResume(file);
    setApplicationMessage("");
  };

  // ======================================================
  // SUBMIT APPLICATION
  // ======================================================

  const handleSubmitApplication = async (
    event
  ) => {
    event.preventDefault();

    if (!selectedJob) {
      return;
    }

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!applicationForm.applicantName.trim()) {
      setApplicationMessage(
        "Please enter your full name."
      );
      return;
    }

    if (!applicationForm.applicantEmail.trim()) {
      setApplicationMessage(
        "Please enter your email."
      );
      return;
    }

    if (!applicationForm.applicantPhone.trim()) {
      setApplicationMessage(
        "Please enter your mobile number."
      );
      return;
    }

    if (!resume) {
      setApplicationMessage(
        "Please upload your resume in PDF format."
      );
      return;
    }

    // ----------------------------------------------
    // IMPORTANT
    // ----------------------------------------------

    /*
      External Adzuna jobs normally do not have
      a Career-AI MongoDB Job document.

      Therefore we should NOT blindly send an
      external job ID to the internal application
      API unless backend supports external jobs.

      For external jobs we show a clear message
      instead of sending a wrong request.
    */

    if (selectedJob.isExternal) {
      setApplicationMessage(
        "This is an external job. Your application must be completed on the company's application website."
      );

      return;
    }

    setApplicationLoading(true);
    setApplicationMessage("");

    try {
      const formData =
        new FormData();

      formData.append(
        "jobId",
        selectedJob.id ||
          selectedJob._id
      );

      formData.append(
        "applicantName",
        applicationForm.applicantName
      );

      formData.append(
        "applicantEmail",
        applicationForm.applicantEmail
      );

      formData.append(
        "applicantPhone",
        applicationForm.applicantPhone
      );

      formData.append(
        "coverLetter",
        applicationForm.coverLetter
      );

      formData.append(
        "matchScore",
        selectedJob.match || 0
      );

      formData.append(
        "resume",
        resume
      );

      const response =
        await fetch(
          `${API_BASE}/apply`,
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      console.log(
        "Application Response:",
        data
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Application failed"
        );
      }

      // --------------------------------------------
      // SUCCESS
      // --------------------------------------------

      setApplicationSuccess(
        true
      );

      setApplicationMessage(
        ""
      );

      setApplicationForm({
        applicantName: "",
        applicantEmail: "",
        applicantPhone: "",
        coverLetter: "",
      });

      setResume(null);

      const resumeInput =
        document.getElementById(
          "resume"
        );

      if (resumeInput) {
        resumeInput.value = "";
      }
    } catch (err) {
      console.error(
        "Application Error:",
        err
      );

      setApplicationMessage(
        err.message ||
          "Application failed. Please try again."
      );
    } finally {
      setApplicationLoading(
        false
      );
    }
  };

  // ======================================================
  // RESET FILTERS
  // ======================================================

  const resetFilters = () => {
    setFilters({
      role: "All IT Jobs",
      location: "All India",
      experience: "Fresher",
      jobType: "Full Time",
      workMode: "Any",
    });

    setError("");
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="job-page">

      <div className="job-container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="page-header">

          <div className="header-icon">
            💼
          </div>

          <div>
            <h1>
              AI Job Search
            </h1>

            <p>
              Find real IT jobs matching
              your skills, experience and
              location.
            </p>
          </div>

        </div>

        {/* ==================================================
            SEARCH CARD
        ================================================== */}

        <div className="search-card">

          <div className="section-heading">

            <div className="heading-icon">
              🔎
            </div>

            <div>
              <h2>
                Find Your Next Job
              </h2>

              <p>
                Select your preferences
                and discover matching IT
                opportunities.
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSearch}
          >

            <div className="search-grid">

              {/* ROLE */}

              <div className="form-group">

                <label htmlFor="role">
                  Job Role
                </label>

                <select
                  id="role"
                  name="role"
                  value={
                    filters.role
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  {roles.map(
                    (role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* LOCATION */}

              <div className="form-group">

                <label htmlFor="location">
                  Location
                </label>

                <select
                  id="location"
                  name="location"
                  value={
                    filters.location
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  {locations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* EXPERIENCE */}

              <div className="form-group">

                <label htmlFor="experience">
                  Experience
                </label>

                <select
                  id="experience"
                  name="experience"
                  value={
                    filters.experience
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  {experiences.map(
                    (experience) => (
                      <option
                        key={
                          experience
                        }
                        value={
                          experience
                        }
                      >
                        {experience}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* JOB TYPE */}

              <div className="form-group">

                <label htmlFor="jobType">
                  Job Type
                </label>

                <select
                  id="jobType"
                  name="jobType"
                  value={
                    filters.jobType
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  {jobTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* WORK MODE */}

              <div className="form-group">

                <label htmlFor="workMode">
                  Work Mode
                </label>

                <select
                  id="workMode"
                  name="workMode"
                  value={
                    filters.workMode
                  }
                  onChange={
                    handleFilterChange
                  }
                >
                  {workModes.map(
                    (mode) => (
                      <option
                        key={mode}
                        value={mode}
                      >
                        {mode}
                      </option>
                    )
                  )}
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
                  : "🔍 Search Jobs"}
              </button>

              <button
                type="button"
                className="clear-button"
                onClick={
                  resetFilters
                }
                disabled={loading}
              >
                Clear Filters
              </button>

            </div>

          </form>

        </div>

        {/* ==================================================
            RESUME CARD
        ================================================== */}

        <div className="resume-card">

          <div className="resume-left">

            <div className="resume-icon">
              📄
            </div>

            <div>

              <h2>
                Find Jobs From My Resume
              </h2>

              <p>
                Upload your resume and use
                your skills and experience to
                discover relevant job
                opportunities.
              </p>

              <div className="resume-points">

                <span>
                  ✓ Skill Matching
                </span>

                <span>
                  ✓ Experience Matching
                </span>

                <span>
                  ✓ AI Job Matching
                </span>

              </div>

            </div>

          </div>

          <button
            type="button"
            className="resume-button"
            onClick={() => {
              alert(
                "Resume-based job matching will be connected with Resume Analyzer."
              );
            }}
          >
            📄 Use My Resume
          </button>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && !loading && (
          <div className="ai-reason">

            <strong>
              ⚠️ Job Search Message
            </strong>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="no-jobs">

            <div className="no-job-icon">
              🔄
            </div>

            <h3>
              Searching Jobs...
            </h3>

            <p>
              Connecting to job providers
              and finding matching
              opportunities.
            </p>

          </div>
        )}

        {/* ==================================================
            RESULTS
        ================================================== */}

        {!loading &&
          hasSearched && (
            <div className="results-section">

              <div className="results-header">

                <div>
                  <h2>
                    Recommended Jobs
                  </h2>

                  <p>
                    Jobs matching your
                    selected preferences.
                  </p>
                </div>

                <div className="job-count">
                  {jobs.length}{" "}
                  {jobs.length === 1
                    ? "Job"
                    : "Jobs"}{" "}
                  Found
                </div>

              </div>

              {/* ==================================================
                  JOB GRID
              ================================================== */}

              {jobs.length > 0 ? (
                <div className="jobs-grid">

                  {jobs.map(
                    (job, index) => {

                      const matchScore =
                        Number(
                          job.match
                        ) || 0;

                      const matchClass =
                        getMatchClass(
                          matchScore
                        );

                      const description =
                        cleanDescription(
                          job.description
                        );

                      return (
                        <div
                          className="job-card"
                          key={
                            job.id ||
                            job._id ||
                            `${job.title}-${job.company}-${job.location}-${index}`
                          }
                        >

                          {/* TOP */}

                          <div className="job-top">

                            <div className="company-logo">
                              {getInitials(
                                job.company
                              )}
                            </div>

                            <div className="job-title">

                              <h3>
                                {job.title ||
                                  "Software Developer"}
                              </h3>

                              <p>
                                {job.company ||
                                  "Company Not Specified"}
                              </p>

                            </div>

                            <div
                              className={`match ${matchClass}`}
                            >
                              <strong>
                                {matchScore}%
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
                              {job.location ||
                                "India"}
                            </span>

                            <span>
                              💼{" "}
                              {job.type ||
                                "Full Time"}
                            </span>

                            <span>
                              🎯{" "}
                              {job.experience ||
                                filters.experience ||
                                "Not Specified"}
                            </span>

                            <span>
                              🏠{" "}
                              {job.workMode &&
                              job.workMode !==
                                "Not Specified"
                                ? job.workMode
                                : "Any"}
                            </span>

                            <span>
                              💰{" "}
                              {job.salary ||
                                "Salary Not Disclosed"}
                            </span>

                          </div>

                          {/* AI MATCH */}

                          <div className="ai-match">

                            <div className="ai-match-title">
                              🤖 AI Job Match
                            </div>

                            <div className="progress">

                              <div
                                className="progress-bar"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      matchScore
                                    )
                                  )}%`,
                                }}
                              />

                            </div>

                            <p>
                              Your profile has a{" "}
                              {matchScore}% match
                              with this job.
                            </p>

                          </div>

                          {/* SKILLS */}

                          {Array.isArray(
                            job.skills
                          ) &&
                            job.skills.length >
                              0 && (
                              <div className="skills-box">

                                <h4>
                                  Required Skills
                                </h4>

                                <div className="skills">

                                  {job.skills
                                    .slice(
                                      0,
                                      6
                                    )
                                    .map(
                                      (
                                        skill,
                                        skillIndex
                                      ) => (
                                        <span
                                          key={`${skill}-${skillIndex}`}
                                        >
                                          {skill}
                                        </span>
                                      )
                                    )}

                                </div>

                              </div>
                            )}

                          {/* MATCHING SKILLS */}

                          {Array.isArray(
                            job.matchingSkills
                          ) &&
                            job.matchingSkills
                              .length >
                              0 && (
                              <div className="matching-skills">

                                <h4>
                                  ✓ Matching Skills
                                </h4>

                                <div className="skills">

                                  {job.matchingSkills
                                    .slice(
                                      0,
                                      5
                                    )
                                    .map(
                                      (
                                        skill,
                                        skillIndex
                                      ) => (
                                        <span
                                          key={`${skill}-${skillIndex}`}
                                        >
                                          {skill}
                                        </span>
                                      )
                                    )}

                                </div>

                              </div>
                            )}

                          {/* AI REASON */}

                          <div className="ai-reason">

                            <strong>
                              🤖 Why this job?
                            </strong>

                            <p>
                              {job.matchReason ||
                                job.reason ||
                                "This job matches your selected role, experience and location preferences."}
                            </p>

                          </div>

                          {/* SOURCE */}

                          <div className="job-info">

                            <span>
                              {job.isExternal
                                ? "🌐 External Job"
                                : "🏢 Career-AI Job"}
                            </span>

                            <span>
                              Source:{" "}
                              {job.provider ||
                                "Career-AI"}
                            </span>

                            {job.created && (
                              <span>
                                📅{" "}
                                {formatDate(
                                  job.created
                                )}
                              </span>
                            )}

                          </div>

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
                              👁 View Job
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
                      );
                    }
                  )}

                </div>
              ) : (
                <div className="no-jobs">

                  <div className="no-job-icon">
                    🔎
                  </div>

                  <h3>
                    No Jobs Found
                  </h3>

                  <p>
                    Try changing your role,
                    location or experience.
                  </p>

                  <button
                    type="button"
                    className="try-button"
                    onClick={
                      resetFilters
                    }
                  >
                    Reset Filters
                  </button>

                </div>
              )}

            </div>
          )}

      </div>

      {/* ======================================================
          JOB DETAILS MODAL
      ====================================================== */}

      {showJobModal &&
        selectedJob && (
          <div
            className="modal-overlay"
            onClick={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeJobModal();
              }
            }}
          >

            <div className="job-modal">

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeJobModal
                }
              >
                ×
              </button>

              <div className="modal-job-header">

                <div className="modal-company-logo">
                  {getInitials(
                    selectedJob.company
                  )}
                </div>

                <div>

                  <h2>
                    {selectedJob.title ||
                      "Software Developer"}
                  </h2>

                  <p>
                    {selectedJob.company ||
                      "Company Not Specified"}
                  </p>

                </div>

              </div>

              <div className="modal-job-info">

                <span>
                  📍{" "}
                  {selectedJob.location ||
                    "India"}
                </span>

                <span>
                  💼{" "}
                  {selectedJob.type ||
                    "Full Time"}
                </span>

                <span>
                  🎯{" "}
                  {selectedJob.experience ||
                    "Not Specified"}
                </span>

                <span>
                  🏠{" "}
                  {selectedJob.workMode ||
                    "Any"}
                </span>

                <span>
                  💰{" "}
                  {selectedJob.salary ||
                    "Not Disclosed"}
                </span>

                <span>
                  🤖{" "}
                  {selectedJob.match ||
                    0}
                  % Match
                </span>

              </div>

              {/* DESCRIPTION */}

              <div className="modal-section">

                <h3>
                  Job Description
                </h3>

                <p className="job-description">
                  {cleanDescription(
                    selectedJob.description
                  ) ||
                    "Job description not available."}
                </p>

              </div>

              {/* SKILLS */}

              {Array.isArray(
                selectedJob.skills
              ) &&
                selectedJob.skills.length >
                  0 && (
                  <div className="modal-section">

                    <h3>
                      Required Skills
                    </h3>

                    <div className="skills">

                      {selectedJob.skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={`${skill}-${index}`}
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* SELECTED SEARCH */}

              <div className="selected-search-info">

                <strong>
                  Your Search
                </strong>

                <span>
                  Role:{" "}
                  {filters.role}
                </span>

                <span>
                  Location:{" "}
                  {filters.location}
                </span>

                <span>
                  Experience:{" "}
                  {filters.experience}
                </span>

              </div>

              {/* SOURCE */}

              <div className="job-id-info">

                {selectedJob.isExternal
                  ? `External Provider: ${
                      selectedJob.provider ||
                      "Adzuna"
                    }`
                  : `Career-AI Job ID: ${
                      selectedJob.id ||
                      selectedJob._id ||
                      "Not available"
                    }`}

              </div>

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
                🚀 Apply Now
              </button>

            </div>

          </div>
        )}

      {/* ======================================================
          APPLICATION MODAL
      ====================================================== */}

      {showApplyModal &&
        selectedJob && (
          <div
            className="modal-overlay"
            onClick={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeApplyModal();
              }
            }}
          >

            <div className="apply-modal">

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeApplyModal
                }
                disabled={
                  applicationLoading
                }
              >
                ×
              </button>

              {!applicationSuccess ? (
                <>
                  {/* HEADER */}

                  <div className="apply-modal-header">

                    <div className="apply-icon">
                      📄
                    </div>

                    <div>

                      <h2>
                        Apply for Job
                      </h2>

                      <p>
                        Submit your application
                        through Career-AI.
                      </p>

                    </div>

                  </div>

                  {/* SELECTED JOB */}

                  <div className="application-selected">

                    <span>
                      <strong>
                        Position:
                      </strong>{" "}
                      {selectedJob.title}
                    </span>

                    <span>
                      <strong>
                        Company:
                      </strong>{" "}
                      {selectedJob.company}
                    </span>

                    <span>
                      <strong>
                        Location:
                      </strong>{" "}
                      {selectedJob.location}
                    </span>

                    {selectedJob.isExternal && (
                      <span>
                        <strong>
                          Source:
                        </strong>{" "}
                        {selectedJob.provider ||
                          "External Provider"}
                      </span>
                    )}

                  </div>

                  {/* EXTERNAL INFO */}

                  {selectedJob.isExternal && (
                    <div className="selected-search-info">

                      <strong>
                        🌐 External Job
                      </strong>

                      <span>
                        This job is provided by an
                        external job provider.
                      </span>

                      <span>
                        You can submit your
                        application on the
                        company's application
                        website.
                      </span>

                    </div>
                  )}

                  {/* FORM */}

                  <form
                    onSubmit={
                      handleSubmitApplication
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
                          name="applicantName"
                          value={
                            applicationForm.applicantName
                          }
                          onChange={
                            handleApplicationChange
                          }
                          placeholder="Enter your full name"
                          required
                        />

                      </div>

                      {/* EMAIL */}

                      <div className="application-field">

                        <label>
                          Email Address *
                        </label>

                        <input
                          type="email"
                          name="applicantEmail"
                          value={
                            applicationForm.applicantEmail
                          }
                          onChange={
                            handleApplicationChange
                          }
                          placeholder="example@gmail.com"
                          required
                        />

                      </div>

                      {/* PHONE */}

                      <div className="application-field">

                        <label>
                          Mobile Number *
                        </label>

                        <input
                          type="tel"
                          name="applicantPhone"
                          value={
                            applicationForm.applicantPhone
                          }
                          onChange={
                            handleApplicationChange
                          }
                          placeholder="Enter mobile number"
                          required
                        />

                      </div>

                      {/* RESUME */}

                      <div className="application-field">

                        <label>
                          Resume PDF *
                        </label>

                        <label
                          htmlFor="resume"
                          className="resume-upload-box"
                        >

                          <input
                            id="resume"
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={
                              handleResumeChange
                            }
                          />

                          <span className="upload-icon">
                            📤
                          </span>

                          {resume ? (
                            <>
                              <strong>
                                {resume.name}
                              </strong>

                              <small>
                                Resume selected
                              </small>
                            </>
                          ) : (
                            <>
                              <strong>
                                Click to upload
                                resume
                              </strong>

                              <small>
                                PDF only • Maximum
                                5MB
                              </small>
                            </>
                          )}

                        </label>

                      </div>

                    </div>

                    {/* COVER LETTER */}

                    <div className="application-field">

                      <label>
                        Cover Letter
                      </label>

                      <textarea
                        name="coverLetter"
                        value={
                          applicationForm.coverLetter
                        }
                        onChange={
                          handleApplicationChange
                        }
                        placeholder="Write a short cover letter..."
                        rows="6"
                      />

                    </div>

                    {/* ERROR / MESSAGE */}

                    {applicationMessage && (
                      <div className="ai-reason">

                        <strong>
                          ⚠️ Application Message
                        </strong>

                        <p>
                          {applicationMessage}
                        </p>

                      </div>
                    )}

                    {/* BUTTONS */}

                    <div className="application-actions">

                      <button
                        type="button"
                        className="cancel-application"
                        onClick={
                          closeApplyModal
                        }
                        disabled={
                          applicationLoading
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="submit-application"
                        disabled={
                          applicationLoading
                        }
                      >
                        {applicationLoading
                          ? "Submitting..."
                          : "🚀 Submit Application"}
                      </button>

                    </div>

                  </form>
                </>
              ) : (
                /* ==================================================
                   SUCCESS SCREEN
                ================================================== */

                <div className="application-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Application Submitted!
                  </h2>

                  <p>
                    Your application has been
                    successfully submitted through
                    Career-AI.
                  </p>

                  <div className="success-details">

                    <div>
                      <span>
                        Position
                      </span>

                      <strong>
                        {selectedJob.title}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Company
                      </span>

                      <strong>
                        {selectedJob.company}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Applicant
                      </span>

                      <strong>
                        {applicationForm.applicantName ||
                          "Applicant"}
                      </strong>
                    </div>

                  </div>

                  <div className="success-note">

                    📧 Your application has been
                    sent to the recruiter when
                    recruiter email configuration
                    is available.

                  </div>

                  <div className="success-actions">

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