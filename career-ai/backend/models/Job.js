const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    // ==========================================
    // JOB TITLE
    // ==========================================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // COMPANY NAME
    // ==========================================
    company: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // JOB LOCATION
    // ==========================================
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // JOB TYPE
    // ==========================================
    type: {
      type: String,
      required: true,
      enum: [
        "Full Time",
        "Part Time",
        "Internship",
        "Remote",
      ],
    },

    // ==========================================
    // EXPERIENCE
    // ==========================================
    experience: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // SALARY
    // ==========================================
    salary: {
      type: String,
      default: "Not Disclosed",
      trim: true,
    },

    // ==========================================
    // REQUIRED SKILLS
    // ==========================================
    skills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // JOB DESCRIPTION
    // ==========================================
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // EXTERNAL APPLY URL
    // ==========================================
    applyUrl: {
      type: String,
      default: "#",
      trim: true,
    },

    // ==========================================
    // COMPANY WEBSITE
    // ==========================================
    companyUrl: {
      type: String,
      default: "#",
      trim: true,
    },

    // ==========================================
    // RECRUITER EMAIL
    // ==========================================
    // Apply Now par resume isi email par jayega.
    recruiterEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);