
import React, { useState } from "react";

const JobSearch = () => {
  // =========================
  // STATES
  // =========================

  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [jobType, setJobType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Any");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [resumeMode, setResumeMode] = useState(false);

  // =========================
  // APPLICATION STATES
  // =========================

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const [resumeFile, setResumeFile] = useState(null);

  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applicantPhone, setApplicantPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // =========================
  // JOB ROLES
  // =========================

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

  // =========================
  // LOCATIONS
  // =========================

  const locations = [
    {
      state: "Karnataka",
      cities: ["Bengaluru", "Mysuru", "Mangaluru"],
    },
    {
      state: "Maharashtra",
      cities: ["Pune", "Mumbai", "Nagpur", "Nashik"],
    },
    {
      state: "Telangana",
      cities: ["Hyderabad", "Warangal"],
    },
    {
      state: "Tamil Nadu",
      cities: ["Chennai", "Coimbatore", "Madurai"],
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
      cities: ["Jaipur", "Udaipur", "Jodhpur"],
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
      cities: ["Patna", "Gaya"],
    },
    {
      state: "Jharkhand",
      cities: ["Ranchi", "Jamshedpur"],
    },
    {
      state: "Odisha",
      cities: ["Bhubaneswar", "Cuttack"],
    },
    {
      state: "Madhya Pradesh",
      cities: ["Indore", "Bhopal"],
    },
    {
      state: "Chhattisgarh",
      cities: ["Raipur", "Bhilai"],
    },
    {
      state: "Punjab",
      cities: ["Mohali", "Ludhiana", "Amritsar"],
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
      cities: ["Shimla", "Dharamshala"],
    },
    {
      state: "Jammu & Kashmir",
      cities: ["Srinagar", "Jammu"],
    },
  ];

  // =========================
  // DEMO JOB DATABASE
  // =========================

  const demoJobs = [
    {
      id: 1,
      title: "MERN Stack Developer",
      company: "Tech Solutions Pvt. Ltd.",
      location: "Bengaluru",
      type: "Full Time",
      mode: "Hybrid",
      experience: "Fresher",
      salary: "₹5 - ₹8 LPA",
      match: 96,
      skills: ["React", "Node.js", "MongoDB", "Express.js"],
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Innovation Technologies",
      location: "Hyderabad",
      type: "Full Time",
      mode: "Remote",
      experience: "Fresher",
      salary: "₹4 - ₹7 LPA",
      match: 93,
      skills: ["React", "JavaScript", "HTML", "CSS"],
    },
    {
      id: 3,
      title: "Backend Developer",
      company: "Software Labs India",
      location: "Pune",
      type: "Full Time",
      mode: "On-site",
      experience: "0-1 Years",
      salary: "₹5 - ₹9 LPA",
      match: 90,
      skills: ["Node.js", "Express.js", "MongoDB", "REST API"],
    },
    {
      id: 4,
      title: "React Developer",
      company: "Digital Solutions",
      location: "Noida",
      type: "Full Time",
      mode: "Hybrid",
      experience: "Fresher",
      salary: "₹4 - ₹7 LPA",
      match: 88,
      skills: ["React", "JavaScript", "Redux", "CSS"],
    },
    {
      id: 5,
      title: "Full Stack Developer",
      company: "WebTech India",
      location: "Mumbai",
      type: "Full Time",
      mode: "Remote",
      experience: "0-1 Years",
      salary: "₹6 - ₹10 LPA",
      match: 86,
      skills: ["React", "Node.js", "MongoDB", "Express.js"],
    },
    {
      id: 6,
      title: "Software Engineer",
      company: "NextGen Technologies",
      location: "Gurugram",
      type: "Full Time",
      mode: "Hybrid",
      experience: "Fresher",
      salary: "₹5 - ₹9 LPA",
      match: 84,
      skills: ["JavaScript", "React", "Node.js", "Git"],
    },
    {
      id: 7,
      title: "Data Analyst",
      company: "DataTech Solutions",
      location: "Bengaluru",
      type: "Full Time",
      mode: "Hybrid",
      experience: "Fresher",
      salary: "₹4 - ₹7 LPA",
      match: 82,
      skills: ["SQL", "Excel", "Python", "Power BI"],
    },
    {
      id: 8,
      title: "Python Developer",
      company: "AI Software Labs",
      location: "Hyderabad",
      type: "Full Time",
      mode: "On-site",
      experience: "0-1 Years",
      salary: "₹5 - ₹8 LPA",
      match: 80,
      skills: ["Python", "Django", "REST API", "SQL"],
    },
    {
      id: 9,
      title: "Node.js Developer",
      company: "CloudTech India",
      location: "Patna",
      type: "Full Time",
      mode: "Remote",
      experience: "Fresher",
      salary: "₹4 - ₹7 LPA",
      match: 89,
      skills: ["Node.js", "Express.js", "MongoDB", "REST API"],
    },
    {
      id: 10,
      title: "MERN Stack Developer",
      company: "Bihar Digital Labs",
      location: "Patna",
      type: "Full Time",
      mode: "Hybrid",
      experience: "Fresher",
      salary: "₹4 - ₹8 LPA",
      match: 97,
      skills: ["MongoDB", "Express.js", "React", "Node.js"],
    },
    {
      id: 11,
      title: "React Developer",
      company: "Startup India",
      location: "Patna",
      type: "Internship",
      mode: "Remote",
      experience: "Fresher",
      salary: "₹15,000 - ₹25,000 / Month",
      match: 94,
      skills: ["React", "JavaScript", "HTML", "CSS"],
    },
    {
      id: 12,
      title: "Java Developer",
      company: "Enterprise Software Pvt. Ltd.",
      location: "Bengaluru",
      type: "Full Time",
      mode: "Hybrid",
      experience: "0-1 Years",
      salary: "₹5 - ₹9 LPA",
      match: 85,
      skills: ["Java", "Spring Boot", "SQL", "REST API"],
    },
    {
      id: 13,
      title: "Python Developer",
      company: "Tech AI Solutions",
      location: "Patna",
      type: "Full Time",
      mode: "Remote",
      experience: "Fresher",
      salary: "₹4 - ₹8 LPA",
      match: 91,
      skills: ["Python", "Django", "SQL", "REST API"],
    },
    {
      id: 14,
      title: "Data Analyst",
      company: "Analytics Hub",
      location: "Pune",
      type: "Full Time",
      mode: "Hybrid",
      experience: "0-1 Years",
      salary: "₹4 - ₹8 LPA",
      match: 87,
      skills: ["SQL", "Python", "Excel", "Power BI"],
    },
    {
      id: 15,
      title: "DevOps Engineer",
      company: "Cloud Systems India",
      location: "Hyderabad",
      type: "Full Time",
      mode: "Remote",
      experience: "1-2 Years",
      salary: "₹7 - ₹12 LPA",
      match: 83,
      skills: ["AWS", "Docker", "Jenkins", "Linux"],
    },
    {
      id: 16,
      title: "QA Engineer",
      company: "Quality Tech India",
      location: "Noida",
      type: "Full Time",
      mode: "On-site",
      experience: "Fresher",
      salary: "₹3 - ₹6 LPA",
      match: 81,
      skills: ["Testing", "Selenium", "Java", "API Testing"],
    },
    {
      id: 17,
      title: "SQL Developer",
      company: "Database Solutions",
      location: "Gurugram",
      type: "Full Time",
      mode: "Hybrid",
      experience: "0-1 Years",
      salary: "₹4 - ₹8 LPA",
      match: 79,
      skills: ["SQL", "MySQL", "Database", "Queries"],
    },
    {
      id: 18,
      title: "Cyber Security Analyst",
      company: "SecureNet Technologies",
      location: "Mumbai",
      type: "Full Time",
      mode: "On-site",
      experience: "Fresher",
      salary: "₹4 - ₹8 LPA",
      match: 78,
      skills: ["Cyber Security", "Networking", "Linux", "SIEM"],
    },
    {
      id: 19,
      title: "Flutter Developer",
      company: "Mobile Apps India",
      location: "Ahmedabad",
      type: "Full Time",
      mode: "Remote",
      experience: "Fresher",
      salary: "₹4 - ₹7 LPA",
      match: 84,
      skills: ["Flutter", "Dart", "Firebase", "REST API"],
    },
    {
      id: 20,
      title: "Angular Developer",
      company: "Web Applications India",
      location: "Chennai",
      type: "Full Time",
      mode: "Hybrid",
      experience: "1-2 Years",
      salary: "₹6 - ₹10 LPA",
      match: 82,
      skills: ["Angular", "TypeScript", "JavaScript", "HTML"],
    },
  ];

  // =========================
  // RELATED ROLE KEYWORDS
  // =========================

  const roleKeywords = {
    "MERN Stack Developer": [
      "mern",
      "full stack",
      "react",
      "node.js",
      "node",
    ],

    "Full Stack Developer": [
      "full stack",
      "mern",
      "mean",
      "software developer",
    ],

    "Frontend Developer": [
      "frontend",
      "front end",
      "react",
      "angular",
      "vue",
    ],

    "Backend Developer": [
      "backend",
      "back end",
      "node.js",
      "node",
      "python",
      "java",
    ],

    "Software Engineer": [
      "software engineer",
      "software developer",
      "full stack",
      "developer",
    ],

    "Software Developer": [
      "software developer",
      "software engineer",
      "developer",
    ],

    "React Developer": [
      "react",
      "frontend",
      "front end",
    ],

    "Node.js Developer": [
      "node.js",
      "node",
      "backend",
      "back end",
    ],

    "Python Developer": [
      "python",
      "django",
      "backend",
      "back end",
    ],

    "Data Analyst": [
      "data analyst",
      "data",
      "sql",
      "analytics",
    ],

    "DevOps Engineer": [
      "devops",
      "cloud",
      "aws",
    ],

    "QA Engineer": [
      "qa",
      "tester",
      "testing",
      "automation",
    ],
  };

  // =========================
  // SEARCH FUNCTION
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    setLoading(true);
    setSearched(false);
    setResumeMode(false);

    setTimeout(() => {
      let result = [...demoJobs];

      // ROLE FILTER
      if (role.trim() !== "") {
        const searchRole = role.toLowerCase().trim();

        const keywords =
          roleKeywords[role] || [searchRole];

        result = result.filter((job) => {
          const title = job.title.toLowerCase();
          const skills = job.skills.join(" ").toLowerCase();

          return keywords.some(
            (keyword) =>
              title.includes(keyword.toLowerCase()) ||
              skills.includes(keyword.toLowerCase())
          );
        });
      }

      // LOCATION FILTER
      if (location.trim() !== "") {
        const selectedLocation =
          location.toLowerCase();

        result = result.filter((job) => {
          const jobLocation =
            job.location.toLowerCase();

          if (jobLocation === selectedLocation) {
            return true;
          }

          if (
            job.mode.toLowerCase() === "remote"
          ) {
            return true;
          }

          return false;
        });
      }

      // EXPERIENCE FILTER
      if (experience !== "") {
        const experienceResult = result.filter(
          (job) =>
            job.experience.toLowerCase() ===
            experience.toLowerCase()
        );

        if (experienceResult.length > 0) {
          result = experienceResult;
        }
      }

      // JOB TYPE FILTER
      if (jobType !== "") {
        const typeResult = result.filter(
          (job) =>
            job.type.toLowerCase() ===
            jobType.toLowerCase()
        );

        if (typeResult.length > 0) {
          result = typeResult;
        }
      }

      // WORK MODE FILTER
      if (workMode !== "Any") {
        const modeResult = result.filter(
          (job) =>
            job.mode.toLowerCase() ===
            workMode.toLowerCase()
        );

        if (modeResult.length > 0) {
          result = modeResult;
        }
      }

      // SORT BY MATCH
      result.sort(
        (a, b) => b.match - a.match
      );

      setJobs(result);
      setSearched(true);
      setLoading(false);
    }, 500);
  };

  // =========================
  // RESUME SEARCH
  // =========================

  const handleResumeSearch = () => {
    setLoading(true);
    setSearched(false);
    setResumeMode(true);

    setTimeout(() => {
      const resumeJobs = demoJobs
        .filter((job) =>
          [
            "MERN Stack Developer",
            "Full Stack Developer",
            "React Developer",
            "Frontend Developer",
            "Node.js Developer",
          ].includes(job.title)
        )
        .sort(
          (a, b) => b.match - a.match
        );

      setJobs(resumeJobs);
      setSearched(true);
      setLoading(false);
    }, 800);
  };

  // =========================
  // CLEAR
  // =========================

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

  // =========================
  // VIEW JOB
  // =========================

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  // =========================
  // APPLY
  // =========================

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationSuccess(false);
    setApplying(false);

    setShowJobModal(false);
    setShowApplyModal(true);
  };

  // =========================
  // CLOSE APPLY MODAL
  // =========================

  const closeApplyModal = () => {
    if (applying) return;

    setShowApplyModal(false);
    setSelectedJob(null);
    setApplicationSuccess(false);
  };

  // =========================
  // RESUME CHANGE
  // =========================

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const extension = file.name
      .toLowerCase()
      .split(".")
      .pop();

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(extension)
    ) {
      alert(
        "Please upload your resume in PDF, DOC or DOCX format."
      );

      e.target.value = "";
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
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

    setApplying(true);

    try {
      // =====================================================
      // STEP 1: GET REAL MONGODB JOB
      // =====================================================

      const params = new URLSearchParams();

      params.append(
        "role",
        selectedJob.title
      );

      params.append(
        "location",
        selectedJob.location
      );

      const jobResponse = await fetch(
        `http://localhost:5000/api/jobs/search?${params.toString()}`
      );

      const jobData =
        await jobResponse.json();

      if (
        !jobResponse.ok ||
        !jobData.success
      ) {
        throw new Error(
          jobData.message ||
            "Unable to find this job in database."
        );
      }

      // =====================================================
      // FIND EXACT MONGODB JOB
      // =====================================================

      const backendJob =
        (jobData.jobs || []).find(
          (job) =>
            job.title?.toLowerCase() ===
              selectedJob.title?.toLowerCase() &&
            job.company?.toLowerCase() ===
              selectedJob.company?.toLowerCase() &&
            job.location?.toLowerCase() ===
              selectedJob.location?.toLowerCase()
        );

      if (!backendJob) {
        throw new Error(
          "This job is not available in the backend database. Please add this job to MongoDB first."
        );
      }

      // MongoDB ObjectId
      const mongoJobId =
        backendJob._id ||
        backendJob.id;

      if (!mongoJobId) {
        throw new Error(
          "MongoDB job ID is missing. Please check the Job database."
        );
      }

      console.log(
        "Selected frontend job:",
        selectedJob
      );

      console.log(
        "Real MongoDB job:",
        backendJob
      );

      console.log(
        "MongoDB Job ID:",
        mongoJobId
      );

      // =====================================================
      // STEP 2: CREATE FORMDATA
      // =====================================================

      const formData = new FormData();

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

      // Actual resume file
      formData.append(
        "resume",
        resumeFile
      );

      // =====================================================
      // STEP 3: SEND APPLICATION
      // =====================================================

      console.log(
        "Sending application to backend..."
      );

      const response = await fetch(
        "http://localhost:5000/api/applications/apply",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      console.log(
        "Application API response:",
        data
      );

      // =====================================================
      // STEP 4: HANDLE ERROR
      // =====================================================

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Application submit nahi ho paya."
        );
      }

      // =====================================================
      // STEP 5: SAVE LIGHTWEIGHT LOCAL HISTORY
      // =====================================================

      const application = {
        id:
          data.application?.id,

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
          data.application?.status ||
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
          data.application?.appliedAt ||
          new Date().toISOString(),
      };

      const existingApplications =
        JSON.parse(
          localStorage.getItem(
            "careerAIApplications"
          ) || "[]"
        );

      localStorage.setItem(
        "careerAIApplications",
        JSON.stringify([
          ...existingApplications,
          application,
        ])
      );

      // =====================================================
      // SUCCESS
      // =====================================================

      setApplicationSuccess(true);

    } catch (error) {
      console.error(
        "Application error:",
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

  // =========================
  // RESET APPLICATION
  // =========================

  const resetApplicationForm = () => {
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPhone("");
    setCoverLetter("");
    setResumeFile(null);
    setApplicationSuccess(false);
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="job-page">
      <div className="job-container">

        {/* HEADER */}

        <div className="page-header">
          <div className="header-icon">
            💼
          </div>

          <div>
            <h1>AI Job Search</h1>

            <p>
              Find IT jobs based on your
              skills, experience and career
              goals.
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
                Select your preferred role,
                location and work preferences.
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
                    setRole(e.target.value)
                  }
                >
                  <option value="">
                    All IT Jobs
                  </option>

                  {jobCategories.map(
                    (category) => (
                      <optgroup
                        key={category.name}
                        label={category.name}
                      >
                        {category.roles.map(
                          (jobRole) => (
                            <option
                              key={jobRole}
                              value={jobRole}
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
                    setLocation(e.target.value)
                  }
                >
                  <option value="">
                    All India
                  </option>

                  {locations.map(
                    (item) => (
                      <optgroup
                        key={item.state}
                        label={item.state}
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

                  <option value="Contract">
                    Contract
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
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </button>

            </div>

          </form>
        </div>

        {/* RESUME SEARCH */}

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
                Let AI analyze your resume
                skills, experience and projects
                and find the most relevant IT
                jobs for you.
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
            onClick={handleResumeSearch}
            disabled={loading}
          >
            {loading && resumeMode
              ? "Analyzing..."
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
                  onClick={handleClear}
                >
                  Try All Jobs
                </button>

              </div>

            ) : (

              <div className="jobs-grid">

                {jobs.map((job) => (

                  <div
                    className="job-card"
                    key={job.id}
                  >

                    {/* JOB TOP */}

                    <div className="job-top">

                      <div className="company-logo">
                        {job.company
                          .charAt(0)
                          .toUpperCase()}
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
                          {job.match}%
                        </strong>

                        <small>
                          Match
                        </small>

                      </div>

                    </div>

                    {/* JOB INFO */}

                    <div className="job-info">

                      <span>
                        📍 {job.location}
                      </span>

                      <span>
                        💼 {job.type}
                      </span>

                      <span>
                        🏠 {job.mode}
                      </span>

                      <span>
                        🎓 {job.experience}
                      </span>

                      <span>
                        💰 {job.salary}
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
                              `${job.match}%`,
                          }}
                        />

                      </div>

                      <p>
                        Your profile matches{" "}
                        <strong>
                          {job.match}%
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

                        {job.skills.map(
                          (skill) => (
                            <span
                              key={skill}
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>

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
                          handleViewJob(job)
                        }
                      >
                        View Job
                      </button>

                      <button
                        type="button"
                        className="apply-job"
                        onClick={() =>
                          handleApply(job)
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
              setShowJobModal(false)
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
                  setShowJobModal(false)
                }
                aria-label="Close"
              >
                ×
              </button>

              <div className="modal-job-header">

                <div className="modal-company-logo">
                  {selectedJob.company
                    .charAt(0)
                    .toUpperCase()}
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
                  📍 {selectedJob.location}
                </span>

                <span>
                  💼 {selectedJob.type}
                </span>

                <span>
                  🏠 {selectedJob.mode}
                </span>

                <span>
                  🎓 {selectedJob.experience}
                </span>

                <span>
                  💰 {selectedJob.salary}
                </span>

              </div>

              <div className="modal-section">

                <h3>
                  Required Skills
                </h3>

                <div className="skills">

                  {selectedJob.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="selected-search-info">

                <strong>
                  Your Search:
                </strong>

                <span>
                  Role:{" "}
                  {role || "All IT Jobs"}
                </span>

                <span>
                  Location:{" "}
                  {location || "All India"}
                </span>

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
            onClick={closeApplyModal}
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
                onClick={closeApplyModal}
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
                        {selectedJob.title}
                      </h2>

                      <p>
                        {selectedJob.company}{" "}
                        •{" "}
                        {selectedJob.location}
                      </p>

                    </div>

                  </div>

                  <div className="application-job-summary">

                    <span>
                      🎯{" "}
                      {selectedJob.match}%
                      AI Match
                    </span>

                    <span>
                      📍{" "}
                      {selectedJob.location}
                    </span>

                    <span>
                      💼{" "}
                      {selectedJob.type}
                    </span>

                  </div>

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
                            role ||
                            "All IT Jobs"
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
                        rows="4"
                      />

                    </div>

                    {/* SEARCH INFO */}

                    <div className="application-selected">

                      <span>
                        🔎 Searching for:{" "}
                        <strong>
                          {role ||
                            "All IT Jobs"}
                        </strong>
                      </span>

                      <span>
                        📍 Location:{" "}
                        <strong>
                          {location ||
                            "All India"}
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
                        disabled={applying}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="submit-application"
                        disabled={applying}
                      >
                        {applying
                          ? "Submitting Application..."
                          : "🚀 Submit Application"}
                      </button>

                    </div>

                  </form>

                </>

              ) : (

                /* SUCCESS */

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
                      {selectedJob.title}
                    </strong>{" "}
                    at{" "}
                    <strong>
                      {selectedJob.company}
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
                        {resumeFile?.name}
                      </strong>
                    </div>

                    <div>
                      <span>
                        📍 Location
                      </span>

                      <strong>
                        {selectedJob.location}
                      </strong>
                    </div>

                    <div>
                      <span>
                        🎯 AI Match
                      </span>

                      <strong>
                        {selectedJob.match}%
                      </strong>
                    </div>

                  </div>

                  <p className="success-note">
                    Your application has been
                    saved successfully. The
                    backend handles the
                    application and email
                    notification process.
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
          box-shadow: 0 5px 20px rgba(15, 23, 42, 0.06);
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
          grid-template-columns: repeat(2, 1fr);
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
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
          background: linear-gradient(
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
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .job-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
          transition: 0.2s;
        }

        .job-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(15, 23, 42, 0.09);
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

        .skills-box h4 {
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
          background: rgba(15, 23, 42, 0.58);
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
          box-shadow: 0 25px 70px rgba(15, 23, 42, 0.25);
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

        .selected-search-info {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin: 18px 0;
          padding: 14px;
          border-radius: 10px;
          background: #eff6ff;
          color: #475569;
          font-size: 13px;
        }

        .selected-search-info strong:first-child {
          color: #1d4ed8;
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
          grid-template-columns: repeat(2, 1fr);
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
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .application-field input[readonly] {
          background: #f8fafc;
          color: #64748b;
        }

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
          grid-template-columns: repeat(3, 1fr);
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
            grid-template-columns: repeat(2, 1fr);
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

