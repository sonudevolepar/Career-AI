const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicantName: {
      type: String,
      required: true,
      trim: true,
    },

    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    applicantPhone: {
      type: String,
      required: true,
      trim: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    resumePath: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    matchScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    recruiterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    recruiterEmailSent: {
      type: Boolean,
      default: false,
    },

    candidateEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);