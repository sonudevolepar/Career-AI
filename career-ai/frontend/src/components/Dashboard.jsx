import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">

      {/* TOP HEADER */}
      <header className="dashboard-header">

        <div className="search-box">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search for jobs, DSA problems, or anything..."
          />
          <kbd>Ctrl + K</kbd>
        </div>

        <div className="header-right">

          <button className="notification">
            ♧
            <span></span>
          </button>

          <div className="profile">

            <div className="profile-avatar">
              SK
            </div>

            <div className="profile-info">
              <strong>Sonu Kumar</strong>
              <small>B.Tech CSE • 7th Sem</small>
            </div>

            <span className="profile-arrow">⌄</span>

          </div>

        </div>

      </header>


      {/* MAIN */}
      <main className="dashboard-main">

        {/* WELCOME */}
        <section className="welcome-section">

          <div>
            <h1>
              Good Evening,
              <span> Sonu </span>
              👋
            </h1>

            <p>
              Keep going! Every step you take today
              brings you closer to your dream career.
            </p>
          </div>

          <div className="goal-wrapper">

            <div className="career-goal">

              <div className="goal-icon">
                🎯
              </div>

              <div>
                <small>Career Goal</small>

                <strong>
                  Get a 12 LPA+ Job as MERN / AI Engineer
                </strong>
              </div>

              <button>✎</button>

            </div>

            <div className="day-progress">

              <div>
                <span>Day 47 / 120</span>
              </div>

              <div className="day-bar">
                <span></span>
              </div>

            </div>

          </div>

        </section>


        {/* STAT CARDS */}
        <section className="stats-grid">

          <StatCard
            icon="▣"
            title="ATS Score"
            value="82"
            suffix="/100"
            change="+8"
            circle="82%"
            type="cyan"
            text="Your resume is performing well!"
          />

          <StatCard
            icon="♟"
            title="Interview Score"
            value="78%"
            change="+12%"
            circle="78%"
            type="purple"
            text="Keep practicing, you're improving!"
          />

          <StatCard
            icon="</>"
            title="DSA Progress"
            value="64%"
            change="+14%"
            circle="64%"
            type="blue"
            text="Solve 2 more problems today!"
          />

          <StatCard
            icon="💼"
            title="Job Matches"
            value="24"
            change="New"
            circle="24"
            type="pink"
            text="Fresh opportunities for you"
          />

        </section>


        {/* ANALYTICS */}
        <section className="analytics-grid">

          {/* PROGRESS */}
          <div className="dashboard-card progress-card">

            <CardTitle
              icon="▥"
              title="Your Progress"
              action="View Details →"
            />

            <ProgressItem
              icon="▣"
              name="Resume Analyzer"
              value="82%"
              width="82%"
            />

            <ProgressItem
              icon="♟"
              name="Mock Interview"
              value="78%"
              width="78%"
            />

            <ProgressItem
              icon="</>"
              name="DSA Coach"
              value="64%"
              width="64%"
            />

            <ProgressItem
              icon="◇"
              name="Career Roadmap"
              value="76%"
              width="76%"
            />

            <ProgressItem
              icon="⌘"
              name="System Design"
              value="58%"
              width="58%"
            />

            <ProgressItem
              icon="💼"
              name="Job Search"
              value="71%"
              width="71%"
            />

          </div>


          {/* WEEKLY ACTIVITY */}
          <div className="dashboard-card activity-card">

            <CardTitle
              icon="▥"
              title="Weekly Activity"
              action="Last 7 Days →"
            />

            <div className="chart">

              <div className="chart-y">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              <svg
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >

                <defs>
                  <linearGradient
                    id="areaGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#8b5cf6"
                      stopOpacity="0.45"
                    />

                    <stop
                      offset="100%"
                      stopColor="#8b5cf6"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="
                    M 0 170
                    C 70 100, 100 120, 150 130
                    S 220 80, 260 110
                    S 330 70, 370 55
                    S 440 110, 480 80
                    S 540 55, 600 35
                    L 600 220
                    L 0 220
                    Z
                  "
                  fill="url(#areaGradient)"
                />

                <path
                  d="
                    M 0 170
                    C 70 100, 100 120, 150 130
                    S 220 80, 260 110
                    S 330 70, 370 55
                    S 440 110, 480 80
                    S 540 55, 600 35
                  "
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="4"
                />

              </svg>

            </div>

            <div className="chart-days">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

          </div>


          {/* PERFORMANCE */}
          <div className="dashboard-card performance-card">

            <CardTitle
              icon="🏆"
              title="Overall Performance"
            />

            <div className="performance-circle">

              <div className="performance-inner">
                <strong>76%</strong>
                <span>Good Progress</span>
              </div>

            </div>

            <div className="performance-stats">

              <div>
                <span>Skills</span>
                <strong>72%</strong>
                <small>↑ 6%</small>
              </div>

              <div>
                <span>Practice</span>
                <strong>68%</strong>
                <small>↑ 8%</small>
              </div>

              <div>
                <span>Projects</span>
                <strong>85%</strong>
                <small>↑ 10%</small>
              </div>

              <div>
                <span>Confidence</span>
                <strong>69%</strong>
                <small>↑ 7%</small>
              </div>

            </div>

          </div>

        </section>


        {/* LOWER SECTION */}
        <section className="bottom-grid">

          {/* TASKS */}
          <div className="dashboard-card tasks-card">

            <CardTitle
              icon="▣"
              title="Today's Tasks"
              action="4 tasks remaining"
            />

            <Task text="Solve 3 DSA problems" tag="Coding" checked />
            <Task text="Complete mock interview" tag="Interview" />
            <Task text="Apply to 5 jobs" tag="Job Search" />
            <Task text="Read system design concepts" tag="Learning" />

            <button className="plan-button">
              View Full Plan →
            </button>

          </div>


          {/* AI ASSISTANT */}
          <div className="dashboard-card ai-card">

            <div className="ai-card-header">

              <div className="ai-title">

                <div className="ai-small-icon">
                  🤖
                </div>

                <h3>AI Career Assistant</h3>

              </div>

              <span className="online">
                ● Online
              </span>

            </div>

            <p>
              Ask me anything about your career,
              resume, jobs, or interview.
              I'm here to help!
            </p>

            <div className="ai-input">

              <input
                placeholder="Type your question..."
              />

              <button>
                ➤
              </button>

            </div>

            <div className="quick-buttons">
              <button>Best jobs for me?</button>
              <button>Improve my resume</button>
              <button>DSA tips</button>
            </div>

          </div>


          {/* JOBS */}
          <div className="dashboard-card jobs-card">

            <CardTitle
              icon="💼"
              title="Recommended Jobs"
              action="View All →"
            />

            <Job
              company="TCS"
              title="MERN Stack Developer"
              location="Remote / Bangalore"
              salary="₹8 - 12 LPA"
            />

            <Job
              company="A"
              title="Frontend Developer"
              location="Bangalore"
              salary="₹6 - 10 LPA"
            />

            <Job
              company="I"
              title="Full Stack Developer"
              location="Noida"
              salary="₹8 - 14 LPA"
            />

          </div>

        </section>


        {/* FOOTER BANNER */}
        <section className="learning-banner">

          <div className="rocket">
            🚀
          </div>

          <div>
            <strong>
              Your Future is Built by What You Do Today
            </strong>

            <p>
              Stay consistent, keep learning,
              and let Career AI be your guide!
            </p>
          </div>

          <button>
            Start Learning →
          </button>

        </section>

      </main>

    </div>
  );
};


/* ================= COMPONENTS ================= */

const StatCard = ({
  icon,
  title,
  value,
  suffix,
  change,
  circle,
  type,
  text,
}) => {
  return (
    <div className={`stat-card ${type}`}>

      <div className="stat-left">

        <div className="stat-icon">
          {icon}
        </div>

        <h3>{title}</h3>

        <div className="stat-value">
          {value}
          {suffix && <small>{suffix}</small>}
        </div>

        <span className="stat-change">
          ↑ {change}
        </span>

        <p>{text}</p>

      </div>

      <div className="stat-circle">
        {circle}
      </div>

    </div>
  );
};


const CardTitle = ({ icon, title, action }) => (
  <div className="card-title">

    <div>
      <span className="card-title-icon">
        {icon}
      </span>

      <h3>{title}</h3>
    </div>

    {action && <span>{action}</span>}

  </div>
);


const ProgressItem = ({
  icon,
  name,
  value,
  width,
}) => (
  <div className="progress-item">

    <div className="progress-name">
      <span>{icon}</span>
      {name}
    </div>

    <div className="progress-bar">
      <span style={{ width }}></span>
    </div>

    <strong>{value}</strong>

  </div>
);


const Task = ({ text, tag, checked }) => (
  <div className="task">

    <div className={`checkbox ${checked ? "checked" : ""}`}>
      {checked ? "✓" : ""}
    </div>

    <span className={checked ? "task-done" : ""}>
      {text}
    </span>

    <small>{tag}</small>

    <time>Today</time>

  </div>
);


const Job = ({
  company,
  title,
  location,
  salary,
}) => (
  <div className="job-item">

    <div className="company-logo">
      {company}
    </div>

    <div className="job-info">
      <strong>{title}</strong>
      <span>{company} • {location}</span>
      <small>{salary}</small>
    </div>

    <button>
      Apply
    </button>

  </div>
);


export default Dashboard;