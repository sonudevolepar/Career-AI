import React, { useCallback, useEffect, useState } from "react";
import "./JobSearch.css";

const API_BASE = "http://localhost:5000/api/jobs";

const INITIAL_FILTERS = {
  role: "Software Engineer",
  location: "Bengaluru",
  experience: "Fresher",
  jobType: "Full Time",
  workMode: "",
};

const ROLE_OPTIONS = [
  "All IT Jobs",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "Java Developer",
  "Python Developer",
  "Cloud Engineer",
  "Data Analyst",
  "AI Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
];

const LOCATION_OPTIONS = [
  "All India",
  "Bengaluru",
  "Delhi",
  "New Delhi",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Chennai",
  "Noida",
  "Gurugram",
  "Patna",
  "Remote",
];

const EXPERIENCE_OPTIONS = [
  "Fresher",
  "0-1 Years",
  "1-2 Years",
  "2-3 Years",
  "3-5 Years",
  "5+ Years",
];

const JOB_TYPE_OPTIONS = [
  "Any Type",
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
];

const WORK_MODE_OPTIONS = [
  { label: "Any mode", value: "" },
  { label: "On-site", value: "On-site" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

function getJobId(job) {
  const id = job?._id || job?.id;
  return id && typeof id === "object" ? id.toString() : id;
}

function getInitials(name = "Company") {
  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "CO";
}

function getMatch(job) {
  const score = Number(job?.match ?? job?.matchScore ?? 0);
  return Math.max(0, Math.min(100, Number.isFinite(score) ? score : 0));
}

function formatSalary(salary) {
  if (salary === null || salary === undefined || salary === "") {
    return "Salary not disclosed";
  }

  if (typeof salary === "object") {
    const min = salary.min ?? salary.minimum;
    const max = salary.max ?? salary.maximum;

    if (min && max) return `₹${min} – ₹${max}`;
    if (min || max) return `₹${min || max}`;
  }

  return String(salary);
}

function getApplyUrl(job) {
  return (
    job?.applyUrl ||
    job?.applicationUrl ||
    job?.url ||
    job?.redirect_url ||
    ""
  );
}

function JobSearch() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [applicationForm, setApplicationForm] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
    resume: null,
  });

  const searchJobs = useCallback(
    async (customFilters = filters) => {
      setLoading(true);
      setError("");
      setHasSearched(true);

      try {
        const params = new URLSearchParams();

        Object.entries(customFilters).forEach(([key, value]) => {
          if (value && value.trim()) {
            if (key === "jobType" && value === "Any Type") return;
            params.set(key, value.trim());
          }
        });

        const response = await fetch(
          `${API_BASE}/search?${params.toString()}`
        );

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("Server returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              `Job search failed (HTTP ${response.status}).`
          );
        }

        if (data?.success === false) {
          throw new Error(data.message || "Unable to search jobs.");
        }

        const receivedJobs = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : Array.isArray(data?.data?.jobs)
              ? data.data.jobs
              : [];

        setJobs(receivedJobs);
      } catch (err) {
        console.error("Job Search Error:", err);
        setJobs([]);
        setError(
          err.message ||
            "Could not connect to the server. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    searchJobs(INITIAL_FILTERS);
  }, [searchJobs]);

  function updateFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  function handleSearch(event) {
    event?.preventDefault();
    setSearchTerm("");
    searchJobs(filters);
  }

  function handleClearFilters() {
    setFilters(INITIAL_FILTERS);
    setSearchTerm("");
    searchJobs(INITIAL_FILTERS);
  }

  function toggleSaved(job) {
    const id = getJobId(job) || `${job.title}-${job.company}`;

    setSavedJobs((previous) =>
      previous.includes(id)
        ? previous.filter((savedId) => savedId !== id)
        : [...previous, id]
    );
  }

  function isSaved(job) {
    const id = getJobId(job) || `${job.title}-${job.company}`;
    return savedJobs.includes(id);
  }

  function openApply(job) {
    setSelectedJob(job);
    setApplicationMessage("");
    setApplicationError("");
    setApplicationForm({
      applicantName: "",
      applicantEmail: "",
      applicantPhone: "",
      coverLetter: "",
      resume: null,
    });

    const externalUrl = getApplyUrl(job);
    const id = getJobId(job);

    if (job.isExternal || job.source === "external" || (!id && externalUrl)) {
      if (externalUrl) {
        window.open(externalUrl, "_blank", "noopener,noreferrer");
      } else {
        setApplicationError(
          "An external application link is not available for this job."
        );
        setShowApplyModal(true);
      }
      return;
    }

    if (!id) {
      if (externalUrl) {
        window.open(externalUrl, "_blank", "noopener,noreferrer");
      } else {
        setApplicationError(
          "This job does not have an application ID or apply link."
        );
        setShowApplyModal(true);
      }
      return;
    }

    setShowApplyModal(true);
  }

  function updateApplicationField(key, value) {
    setApplicationForm((previous) => ({ ...previous, [key]: value }));
  }

  async function submitApplication(event) {
    event.preventDefault();

    if (!selectedJob) return;

    if (!applicationForm.resume) {
      setApplicationError("Please upload your resume in PDF format.");
      return;
    }

    if (applicationForm.resume.type !== "application/pdf") {
      setApplicationError("Only PDF resumes are accepted.");
      return;
    }

    const jobId = getJobId(selectedJob);
    if (!jobId) {
      setApplicationError("The selected job does not have a valid job ID.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("applicantName", applicationForm.applicantName);
    formData.append("applicantEmail", applicationForm.applicantEmail);
    formData.append("applicantPhone", applicationForm.applicantPhone);
    formData.append("coverLetter", applicationForm.coverLetter);
    formData.append("matchScore", String(getMatch(selectedJob)));
    formData.append("resume", applicationForm.resume);

    setApplying(true);
    setApplicationError("");
    setApplicationMessage("");

    try {
      const response = await fetch(`${API_BASE}/apply`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || `Application failed (HTTP ${response.status}).`
        );
      }

      setApplicationMessage(
        data.message || "Your application has been submitted successfully."
      );
    } catch (err) {
      console.error("Apply Job Error:", err);
      setApplicationError(
        err.message || "Unable to submit your application."
      );
    } finally {
      setApplying(false);
    }
  }

  const visibleJobs = jobs
    .filter((job) => {
      if (!searchTerm.trim()) return true;

      const text = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...(Array.isArray(job.skills) ? job.skills : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(searchTerm.toLowerCase().trim());
    })
    .sort((a, b) => {
      if (sortBy === "match") return getMatch(b) - getMatch(a);
      if (sortBy === "title") {
        return String(a.title || "").localeCompare(String(b.title || ""));
      }
      return 0;
    });

  return (
    <main className="job-page">
      <div className="job-background-glow job-glow-one" />
      <div className="job-background-glow job-glow-two" />

      <div className="job-container">
        <header className="job-hero">
          <div className="job-hero-copy">
            <div className="job-eyebrow">
              <span className="job-eyebrow-dot" />
              CAREER AI · YOUR NEXT OPPORTUNITY
            </div>

            <h1>
              Find work that
              <span> moves you forward.</span>
            </h1>

            <p>
              Discover opportunities, explore new career paths, and find
              jobs that match your skills and goals.
            </p>

            <div className="job-hero-points">
              <span>✓ Personalized discovery</span>
              <span>✓ Multiple locations</span>
              <span>✓ Career-focused search</span>
            </div>
          </div>

          <div className="job-hero-art" aria-hidden="true">
            <div className="job-art-orbit job-art-orbit-one" />
            <div className="job-art-orbit job-art-orbit-two" />
            <div className="job-art-center">✦</div>
            <div className="job-art-card job-art-card-top">
              <span className="job-art-mini-icon">↗</span>
              <div>
                <strong>New opportunities</strong>
                <small>Your next chapter starts here</small>
              </div>
            </div>
            <div className="job-art-card job-art-card-bottom">
              <span className="job-art-check">✓</span>
              <div>
                <strong>Career match</strong>
                <small>Skills meet opportunity</small>
              </div>
            </div>
          </div>
        </header>

        <section className="job-search-card">
          <div className="job-search-card-heading">
            <div className="job-search-icon">⌕</div>
            <div>
              <h2>Build your job search</h2>
              <p>Choose your preferences to find relevant roles.</p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="job-filter-grid">
              <label className="job-field">
                <span>Job role</span>
                <select
                  value={filters.role}
                  onChange={(e) => updateFilter("role", e.target.value)}
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label className="job-field">
                <span>Preferred location</span>
                <select
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                >
                  {LOCATION_OPTIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </label>

              <label className="job-field">
                <span>Experience level</span>
                <select
                  value={filters.experience}
                  onChange={(e) => updateFilter("experience", e.target.value)}
                >
                  {EXPERIENCE_OPTIONS.map((experience) => (
                    <option key={experience} value={experience}>
                      {experience}
                    </option>
                  ))}
                </select>
              </label>

              <label className="job-field">
                <span>Employment type</span>
                <select
                  value={filters.jobType}
                  onChange={(e) => updateFilter("jobType", e.target.value)}
                >
                  {JOB_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="job-field job-field-workmode">
                <span>Work arrangement</span>
                <select
                  value={filters.workMode}
                  onChange={(e) => updateFilter("workMode", e.target.value)}
                >
                  {WORK_MODE_OPTIONS.map((mode) => (
                    <option key={mode.value || "any"} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="job-search-actions">
              <button className="job-search-submit" type="submit" disabled={loading}>
                <span>{loading ? "◌" : "⌕"}</span>
                {loading ? "Searching opportunities..." : "Find matching jobs"}
              </button>

              <button
                className="job-clear-button"
                type="button"
                onClick={handleClearFilters}
                disabled={loading}
              >
                Reset filters
              </button>
            </div>
          </form>
        </section>

        <section className="job-results-section">
          <div className="job-results-header">
            <div>
              <span className="job-section-kicker">OPPORTUNITIES FOR YOU</span>
              <h2>
                {loading ? "Finding your next role..." : "Explore open positions"}
              </h2>
              <p>
                {loading
                  ? "Searching the available job listings."
                  : `${visibleJobs.length} ${
                      visibleJobs.length === 1 ? "opportunity" : "opportunities"
                    } found`}
              </p>
            </div>

            <div className="job-result-controls">
              <label className="job-inline-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search job results"
                />
              </label>

              <label className="job-sort-select">
                <span className="job-sort-label">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort jobs"
                >
                  <option value="match">Best match</option>
                  <option value="title">Job title</option>
                  <option value="default">Default order</option>
                </select>
              </label>
            </div>
          </div>

          {error && (
            <div className="job-error-state" role="alert">
              <span className="job-error-icon">!</span>
              <div>
                <strong>We couldn’t load the jobs.</strong>
                <p>{error}</p>
                <p className="job-error-tip">
                  Check that your backend is running and that{" "}
                  <code>/api/jobs</code> is registered in server.js.
                </p>
              </div>
              <button type="button" onClick={() => searchJobs(filters)}>
                Try again
              </button>
            </div>
          )}

          {loading && (
            <div className="job-loading-grid" aria-label="Loading jobs">
              {[1, 2, 3].map((item) => (
                <div className="job-skeleton-card" key={item}>
                  <div className="job-skeleton-line job-skeleton-short" />
                  <div className="job-skeleton-line job-skeleton-title" />
                  <div className="job-skeleton-line" />
                  <div className="job-skeleton-line job-skeleton-medium" />
                  <div className="job-skeleton-footer" />
                </div>
              ))}
            </div>
          )}

          {!loading && !error && visibleJobs.length > 0 && (
            <div className="job-list">
              {visibleJobs.map((job, index) => {
                const jobId =
                  getJobId(job) || `${job.title}-${job.company}-${index}`;
                const match = getMatch(job);
                const external =
                  job.isExternal || job.source === "external" || !getJobId(job);

                return (
                  <article className="job-card" key={jobId}>
                    <div className="job-card-main">
                      <div className="job-company-logo">
                        {job.companyLogo || job.logo ? (
                          <img
                            src={job.companyLogo || job.logo}
                            alt={`${job.company || "Company"} logo`}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span>{getInitials(job.company)}</span>
                        )}
                      </div>

                      <div className="job-card-content">
                        <div className="job-card-title-row">
                          <h3>{job.title || "Untitled Position"}</h3>
                          {match > 0 && (
                            <span
                              className={`job-match-badge ${
                                match >= 80
                                  ? "job-match-high"
                                  : match >= 50
                                    ? "job-match-medium"
                                    : "job-match-low"
                              }`}
                            >
                              {match}% match
                            </span>
                          )}
                        </div>

                        <div className="job-company-line">
                          <strong>{job.company || "Company not disclosed"}</strong>
                          {job.verified && (
                            <span className="job-verified">✓ Verified</span>
                          )}
                        </div>

                        <div className="job-meta-list">
                          <span>⌖ {job.location || "Location not disclosed"}</span>
                          <span>◷ {job.type || job.jobType || "Full Time"}</span>
                          <span>
                            ▤ {job.experience || "Experience not disclosed"}
                          </span>
                        </div>

                        <div className="job-salary-line">
                          <span className="job-salary-icon">₹</span>
                          <strong>{formatSalary(job.salary)}</strong>
                          {job.workMode && (
                            <span className="job-workmode-tag">{job.workMode}</span>
                          )}
                        </div>

                        {job.description && (
                          <p className="job-description">
                            {String(job.description).length > 220
                              ? `${String(job.description).slice(0, 220)}…`
                              : job.description}
                          </p>
                        )}

                        {Array.isArray(job.skills) && job.skills.length > 0 && (
                          <div className="job-skills">
                            {job.skills.slice(0, 5).map((skill, skillIndex) => (
                              <span key={`${skill}-${skillIndex}`}>{skill}</span>
                            ))}
                            {job.skills.length > 5 && (
                              <span>+{job.skills.length - 5} more</span>
                            )}
                          </div>
                        )}

                        <div className="job-card-footer">
                          <span className="job-source">
                            <i />
                            {job.provider ||
                              (external ? "External listing" : "Career AI")}
                          </span>
                          <div className="job-card-actions">
                            <button
                              type="button"
                              className={`job-save-button ${
                                isSaved(job) ? "is-saved" : ""
                              }`}
                              onClick={() => toggleSaved(job)}
                              aria-label={
                                isSaved(job) ? "Unsave job" : "Save job"
                              }
                              title={isSaved(job) ? "Saved" : "Save job"}
                            >
                              {isSaved(job) ? "♥ Saved" : "♡ Save"}
                            </button>

                            <button
                              type="button"
                              className="job-apply-button"
                              onClick={() => openApply(job)}
                            >
                              {external ? "Apply externally ↗" : "Apply now →"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && visibleJobs.length === 0 && (
            <div className="job-empty-state">
              <div className="job-empty-icon">⌕</div>
              <h3>{hasSearched ? "No matching jobs found" : "Ready to explore?"}</h3>
              <p>
                Try a different role, location, or experience level to discover
                more opportunities.
              </p>
              <button type="button" onClick={handleClearFilters}>
                Explore all IT jobs
              </button>
            </div>
          )}
        </section>

        <section className="job-career-banner">
          <div className="job-banner-symbol">✦</div>
          <div>
            <span>YOUR CAREER, YOUR NEXT MOVE</span>
            <h2>Every application is a step forward.</h2>
            <p>Keep learning, keep applying, and let your skills lead the way.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              const nextFilters = {
                ...filters,
                role: "All IT Jobs",
                location: "All India",
              };
              setFilters(nextFilters);
              setSearchTerm("");
              searchJobs(nextFilters);
            }}
          >
            Explore more jobs →
          </button>
        </section>

        <footer className="job-page-footer">
          <span>Career AI</span>
          <span>Learn. Practice. Get hired.</span>
        </footer>
      </div>

      {showApplyModal && selectedJob && (
        <div
          className="job-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !applying) {
              setShowApplyModal(false);
            }
          }}
        >
          <section
            className="job-apply-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-apply-modal-title"
          >
            <div className="job-modal-heading">
              <div>
                <span className="job-section-kicker">APPLICATION FORM</span>
                <h2 id="job-apply-modal-title">Apply for this role</h2>
                <p>
                  {selectedJob.title} · {selectedJob.company || "Company"}
                </p>
              </div>
              <button
                type="button"
                className="job-modal-close"
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                aria-label="Close application form"
              >
                ×
              </button>
            </div>

            {applicationMessage ? (
              <div className="job-application-success">
                <span>✓</span>
                <h3>Application submitted</h3>
                <p>{applicationMessage}</p>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="job-application-form">
                {applicationError && (
                  <div className="job-form-error" role="alert">
                    {applicationError}
                  </div>
                )}

                <label>
                  Full name
                  <input
                    type="text"
                    value={applicationForm.applicantName}
                    onChange={(e) =>
                      updateApplicationField("applicantName", e.target.value)
                    }
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  Email address
                  <input
                    type="email"
                    value={applicationForm.applicantEmail}
                    onChange={(e) =>
                      updateApplicationField("applicantEmail", e.target.value)
                    }
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  Phone number
                  <input
                    type="tel"
                    value={applicationForm.applicantPhone}
                    onChange={(e) =>
                      updateApplicationField("applicantPhone", e.target.value)
                    }
                    autoComplete="tel"
                    required
                  />
                </label>

                <label>
                  Resume (PDF, max 5 MB)
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) =>
                      updateApplicationField(
                        "resume",
                        e.target.files?.[0] || null
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Cover letter (optional)
                  <textarea
                    rows="4"
                    value={applicationForm.coverLetter}
                    onChange={(e) =>
                      updateApplicationField("coverLetter", e.target.value)
                    }
                    placeholder="Tell the recruiter why you are a good fit..."
                  />
                </label>

                <button
                  type="submit"
                  className="job-apply-button job-modal-submit"
                  disabled={applying}
                >
                  {applying ? "Submitting..." : "Submit application →"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default JobSearch;
