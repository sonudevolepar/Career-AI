require("dotenv").config();

const mongoose = require("mongoose");
const Job = require("./models/Job");

const jobs = [
  {
    title: "MERN Stack Developer",
    company: "Tech Solutions Pvt. Ltd.",
    location: "Bangalore",
    type: "Full Time",
    experience: "Fresher",
    salary: "₹5 - ₹8 LPA",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    description:
      "Develop and maintain modern web applications using MERN stack.",
    applyUrl: "https://example.com/apply",
    companyUrl: "https://example.com",
  },

  {
    title: "Frontend Developer",
    company: "ABC Technologies",
    location: "Hyderabad",
    type: "Full Time",
    experience: "Fresher",
    salary: "₹4 - ₹7 LPA",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    description:
      "Build responsive frontend applications using React.",
    applyUrl: "https://example.com/apply",
    companyUrl: "https://example.com",
  },

  {
    title: "Node.js Developer",
    company: "Software Labs",
    location: "Pune",
    type: "Full Time",
    experience: "Fresher",
    salary: "₹5 - ₹9 LPA",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    description:
      "Develop scalable backend APIs using Node.js and Express.",
    applyUrl: "https://example.com/apply",
    companyUrl: "https://example.com",
  },

  {
    title: "React Developer",
    company: "Startup India",
    location: "Remote",
    type: "Remote",
    experience: "0-1 Years",
    salary: "₹4 - ₹6 LPA",
    skills: ["React", "JavaScript", "Redux", "HTML", "CSS"],
    description:
      "Create modern and responsive React applications.",
    applyUrl: "https://example.com/apply",
    companyUrl: "https://example.com",
  },

  {
    title: "Full Stack Developer",
    company: "Digital Technologies",
    location: "Delhi",
    type: "Full Time",
    experience: "0-1 Years",
    salary: "₹6 - ₹10 LPA",
    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "JavaScript",
    ],
    description:
      "Work on frontend and backend development using MERN stack.",
    applyUrl: "https://example.com/apply",
    companyUrl: "https://example.com",
  },
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Job.deleteMany({});

    await Job.insertMany(jobs);

    console.log(`${jobs.length} jobs inserted successfully`);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Seed Error:", error);
    process.exit(1);
  }
};

seedJobs();