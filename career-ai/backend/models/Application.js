const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ==========================================
    // JOB REFERENCE
    // ==========================================
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // ==========================================
    // JOB SNAPSHOT
    // ==========================================
    // Job delete/update hone ke baad bhi
    // application mein job information available rahegi.
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // APPLICANT DETAILS
    // ==========================================
    applicantName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    applicantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    applicantPhone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    // ==========================================
    // RESUME
    // ==========================================
    resumeName: {
      type: String,
      required: true,
      trim: true,
    },

    resumePath: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional public URL if later you use
    // Cloudinary/S3/etc.
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // COVER LETTER
    // ==========================================
    coverLetter: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // ==========================================
    // AI MATCH SCORE
    // ==========================================
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Skills that matched between resume and job
    matchingSkills: {
      type: [String],
      default: [],
    },

    // ==========================================
    // RECRUITER
    // ==========================================
    recruiterEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Invalid recruiter email",
      ],
    },

    recruiterEmailSent: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // CANDIDATE EMAIL
    // ==========================================
    candidateEmailSent: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================
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
      index: true,
    },

    // ==========================================
    // ADMIN / RECRUITER NOTES
    // ==========================================
    recruiterNotes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // ==========================================
    // APPLICATION SOURCE
    // ==========================================
    source: {
      type: String,
      enum: ["mongodb", "internal"],
      default: "internal",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

// Job-wise applications
applicationSchema.index({
  job: 1,
  createdAt: -1,
});

// Candidate-wise applications
applicationSchema.index({
  applicantEmail: 1,
  createdAt: -1,
});

// Recruiter-wise applications
applicationSchema.index({
  recruiterEmail: 1,
  createdAt: -1,
});

// ==========================================
// EXPORT MODEL
// ==========================================

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);