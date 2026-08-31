const calculateJobMatch = (resumeSkills = [], jobSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) {
    return 0;
  }

  const normalizedResumeSkills = resumeSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  const normalizedJobSkills = jobSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  let matchedSkills = 0;

  normalizedJobSkills.forEach((jobSkill) => {
    const found = normalizedResumeSkills.some((resumeSkill) => {
      return (
        resumeSkill.includes(jobSkill) ||
        jobSkill.includes(resumeSkill)
      );
    });

    if (found) {
      matchedSkills++;
    }
  });

  const score =
    (matchedSkills / normalizedJobSkills.length) * 100;

  return Math.round(score);
};

const getMatchingSkills = (
  resumeSkills = [],
  jobSkills = []
) => {
  const normalizedResumeSkills = resumeSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  return jobSkills.filter((jobSkill) => {
    const normalizedJobSkill = jobSkill.toLowerCase().trim();

    return normalizedResumeSkills.some(
      (resumeSkill) =>
        resumeSkill.includes(normalizedJobSkill) ||
        normalizedJobSkill.includes(resumeSkill)
    );
  });
};

module.exports = {
  calculateJobMatch,
  getMatchingSkills,
};