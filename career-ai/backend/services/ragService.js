const knowledgeBase = [
  {
    title: "Career AI Platform",
    content: `
Career AI is an AI-powered career platform.
It provides Resume Analyzer, AI Job Search, DSA Coach,
Mock Interview, AI Career Roadmap and AI System Design Coach.
`,
  },

  {
    title: "Resume Analyzer",
    content: `
Resume Analyzer checks a user's resume and provides ATS score,
resume feedback, skills analysis and improvement suggestions.
`,
  },

  {
    title: "DSA Coach",
    content: `
DSA Coach helps users learn Data Structures and Algorithms.
Important topics include Arrays, Strings, Linked Lists, Stack,
Queue, Trees, Graphs, Recursion, Dynamic Programming and Sorting.
`,
  },

  {
    title: "Mock Interview",
    content: `
Mock Interview allows users to practice technical interviews.
Users can select roles such as MERN Stack Developer or Java Developer.
`,
  },

  {
    title: "Career Roadmap",
    content: `
Career Roadmap creates a learning path based on the user's skills
and target role.
`,
  },

  {
    title: "System Design",
    content: `
AI System Design Coach helps users learn scalable architecture,
APIs, databases, caching, load balancing and system design.
`,
  },

  {
    title: "Job Search",
    content: `
AI Job Search helps users find jobs based on role, location,
experience, job type and work mode.
`,
  },

  {
    title: "Admin Dashboard",
    content: `
Admin Dashboard allows administrators to monitor the Career AI platform.
It contains platform statistics, users, verified users,
job applications, AI interviews and recent activity.
`,
  },
];


// ==========================================
// RETRIEVE RELEVANT DOCUMENTS
// ==========================================

function retrieveContext(question) {

  const words = question
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) => word.length > 2
    );

  const scoredDocuments =
    knowledgeBase.map((doc) => {

      const text =
        `${doc.title} ${doc.content}`
          .toLowerCase();

      let score = 0;

      words.forEach((word) => {

        if (text.includes(word)) {
          score++;
        }

      });

      return {
        ...doc,
        score,
      };
    });

  return scoredDocuments
    .filter(
      (doc) => doc.score > 0
    )
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, 3);
}


module.exports = {
  retrieveContext,
};