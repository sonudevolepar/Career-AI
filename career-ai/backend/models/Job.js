const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Full Time", "Part Time", "Internship", "Remote"],
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      default: "Not Disclosed",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    applyUrl: {
      type: String,
      default: "#",
      trim: true,
    },
    companyUrl: {
      type: String,
      default: "#",
      trim: true,
    },
    // RECRUITER CONTACT DETAILS
    recruiterEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    recruiterPhone: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);