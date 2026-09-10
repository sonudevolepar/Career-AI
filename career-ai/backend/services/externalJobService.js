const axios = require("axios");

const fetchExternalJobs = async ({
  role = "",
  location = "",
}) => {
  try {
    const response = await axios.get(
      "https://remotive.com/api/remote-jobs"
    );

    let jobs = response.data.jobs || [];

    if (role) {
      jobs = jobs.filter((job) =>
        job.title
          .toLowerCase()
          .includes(role.toLowerCase())
      );
    }

    return jobs.slice(0, 50).map((job) => ({
      id: `ext_${job.id}`,
      title: job.title,
      company: job.company_name,
      location:
        location ||
        job.candidate_required_location ||
        "Remote",

      type: "Remote",
      experience: "Not Specified",

      salary:
        job.salary || "Not Disclosed",

      skills: [],

      description:
        job.description || "",

      applyUrl:
        job.url || "#",

      source: "external",

      provider: "Remotive",

      isExternal: true,

      match: 70,
    }));
  } catch (error) {
    console.error(
      "External Job Error:",
      error.message
    );

    return [];
  }
};

module.exports = {
  fetchExternalJobs,
};