import React from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const stats = [
    {
      icon: "👥",
      title: "Total Users",
      value: "248",
      change: "+12%",
      description: "from last month",
      color: "blue",
    },
    {
      icon: "✅",
      title: "Verified Users",
      value: "216",
      change: "+8%",
      description: "verified accounts",
      color: "green",
    },
    {
      icon: "💼",
      title: "Job Applications",
      value: "1,284",
      change: "+18%",
      description: "this month",
      color: "purple",
    },
    {
      icon: "🎤",
      title: "AI Interviews",
      value: "376",
      change: "+24%",
      description: "completed interviews",
      color: "orange",
    },
  ];

  const activities = [
    {
      icon: "👤",
      title: "New user registered",
      description: "Rahul Kumar created an account",
      time: "5 minutes ago",
    },
    {
      icon: "📄",
      title: "Resume analyzed",
      description: "A resume was analyzed by AI",
      time: "18 minutes ago",
    },
    {
      icon: "🎤",
      title: "AI Interview completed",
      description: "MERN Stack interview completed",
      time: "35 minutes ago",
    },
    {
      icon: "💼",
      title: "Job application submitted",
      description: "Application submitted for React Developer",
      time: "1 hour ago",
    },
  ];

  const adminActions = [
    {
      icon: "👥",
      title: "Manage Users",
      description: "View, search and manage users",
    },
    {
      icon: "💼",
      title: "Manage Jobs",
      description: "Add, edit and remove job listings",
    },
    {
      icon: "📄",
      title: "Resume Management",
      description: "Monitor resume analysis activity",
    },
    {
      icon: "🎤",
      title: "Interview Management",
      description: "View AI interview activity",
    },
    {
      icon: "📊",
      title: "View Analytics",
      description: "Check platform performance",
    },
    {
      icon: "⚙️",
      title: "Settings",
      description: "Manage admin settings",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* ================= HEADER ================= */}

      <header className="admin-header">

        <div className="admin-header-left">

          <div className="admin-logo">
            <span className="admin-logo-icon">🤖</span>

            <div>
              <h1>Career AI</h1>
              <span>Admin Panel</span>
            </div>
          </div>

        </div>

        <div className="admin-header-right">

          <button className="notification-btn">
            🔔
            <span className="notification-dot"></span>
          </button>

          <div className="admin-user">

            <div className="admin-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div className="admin-user-info">
              <strong>{user?.name || "Admin"}</strong>
              <span>{user?.email || "admin@careerai.com"}</span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        {/* Welcome */}

        <section className="admin-welcome">

          <div>

            <p className="admin-welcome-label">
              ADMIN DASHBOARD
            </p>

            <h2>
              Welcome back,{" "}
              <span>{user?.name || "Admin"}</span> 👋
            </h2>

            <p>
              Monitor and manage your Career AI platform
              from one place.
            </p>

          </div>

          <div className="dashboard-date">
            <span>📅</span>
            <div>
              <small>Today</small>
              <strong>
                {new Date().toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>

        </section>


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          {stats.map((stat, index) => (

            <div
              className={`stat-card ${stat.color}`}
              key={index}
            >

              <div className="stat-top">

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <span className="stat-change">
                  {stat.change}
                </span>

              </div>

              <p className="stat-title">
                {stat.title}
              </p>

              <h3>
                {stat.value}
              </h3>

              <span className="stat-description">
                {stat.description}
              </span>

            </div>

          ))}

        </section>


        {/* ================= CONTENT GRID ================= */}

        <section className="admin-content-grid">

          {/* Recent Activity */}

          <div className="admin-panel activity-panel">

            <div className="panel-header">

              <div>
                <h3>Recent Activity</h3>
                <p>Latest platform activities</p>
              </div>

              <button className="view-all-btn">
                View All
              </button>

            </div>


            <div className="activity-list">

              {activities.map((activity, index) => (

                <div
                  className="activity-item"
                  key={index}
                >

                  <div className="activity-icon">
                    {activity.icon}
                  </div>

                  <div className="activity-info">

                    <strong>
                      {activity.title}
                    </strong>

                    <span>
                      {activity.description}
                    </span>

                  </div>

                  <time>
                    {activity.time}
                  </time>

                </div>

              ))}

            </div>

          </div>


          {/* Platform Overview */}

          <div className="admin-panel overview-panel">

            <div className="panel-header">

              <div>
                <h3>Platform Overview</h3>
                <p>Current system status</p>
              </div>

            </div>


            <div className="overview-list">

              <div className="overview-item">

                <div className="overview-label">
                  <span>👥</span>
                  <div>
                    <strong>Users</strong>
                    <small>248 registered users</small>
                  </div>
                </div>

                <span className="status-active">
                  Active
                </span>

              </div>


              <div className="overview-item">

                <div className="overview-label">
                  <span>🤖</span>
                  <div>
                    <strong>AI Services</strong>
                    <small>All AI services running</small>
                  </div>
                </div>

                <span className="status-active">
                  Online
                </span>

              </div>


              <div className="overview-item">

                <div className="overview-label">
                  <span>💼</span>
                  <div>
                    <strong>Job Search</strong>
                    <small>Job API connected</small>
                  </div>
                </div>

                <span className="status-active">
                  Online
                </span>

              </div>


              <div className="overview-item">

                <div className="overview-label">
                  <span>🗄️</span>
                  <div>
                    <strong>Database</strong>
                    <small>MongoDB connection</small>
                  </div>
                </div>

                <span className="status-active">
                  Connected
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* ================= ADMIN CONTROLS ================= */}

        <section className="admin-controls-section">

          <div className="section-title">

            <div>
              <h3>Admin Controls</h3>
              <p>
                Manage different areas of Career AI
              </p>
            </div>

          </div>


          <div className="admin-actions-grid">

            {adminActions.map((action, index) => (

              <button
                className="admin-action-card"
                key={index}
                onClick={() => {

                  if (action.title === "Manage Users") {
                    window.location.href = "/admin/users";
                  }

                }}
              >

                <div className="action-icon">
                  {action.icon}
                </div>

                <div className="action-content">

                  <h4>
                    {action.title}
                  </h4>

                  <p>
                    {action.description}
                  </p>

                </div>

                <span className="action-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </section>


        {/* ================= FOOTER ================= */}

        <footer className="admin-footer">

          <p>
            © 2026 Career AI. Admin Panel
          </p>

          <div>
            <span className="online-dot"></span>
            System Operational
          </div>

        </footer>

      </main>

    </div>
  );
};

export default AdminDashboard;