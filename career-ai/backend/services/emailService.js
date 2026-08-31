const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    throw new Error("SMTP_HOST is missing in backend/.env");
  }

  if (!process.env.SMTP_PORT) {
    throw new Error("SMTP_PORT is missing in backend/.env");
  }

  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is missing in backend/.env");
  }

  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is missing in backend/.env");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure:
      process.env.SMTP_SECURE === "true",

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// ============================================
// SEND APPLICATION TO RECRUITER
// ============================================

const sendRecruiterApplicationEmail = async ({
  recruiterEmail,
  applicantName,
  applicantEmail,
  applicantPhone,
  jobTitle,
  company,
  location,
  coverLetter,
  resumePath,
}) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Career AI" <${process.env.SMTP_USER}>`,

    to: recruiterEmail,

    replyTo: applicantEmail,

    subject: `New Application - ${jobTitle} - ${applicantName}`,

    text: `
New job application received through Career AI.

Candidate Name:
${applicantName}

Candidate Email:
${applicantEmail}

Candidate Phone:
${applicantPhone}

Job:
${jobTitle}

Company:
${company}

Location:
${location}

Cover Letter:
${coverLetter || "Not provided"}

Resume is attached to this email.
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Job Application</h2>

        <p>
          A candidate has applied through
          <strong>Career AI</strong>.
        </p>

        <hr />

        <p>
          <strong>Candidate:</strong>
          ${applicantName}
        </p>

        <p>
          <strong>Email:</strong>
          ${applicantEmail}
        </p>

        <p>
          <strong>Phone:</strong>
          ${applicantPhone}
        </p>

        <p>
          <strong>Job:</strong>
          ${jobTitle}
        </p>

        <p>
          <strong>Company:</strong>
          ${company}
        </p>

        <p>
          <strong>Location:</strong>
          ${location}
        </p>

        <p>
          <strong>Cover Letter:</strong>
          <br />
          ${coverLetter || "Not provided"}
        </p>

        <hr />

        <p>
          Candidate resume is attached to this email.
        </p>
      </div>
    `,

    attachments: [
      {
        filename: require("path").basename(
          resumePath
        ),

        path: resumePath,
      },
    ],
  });
};

// ============================================
// SEND CONFIRMATION TO CANDIDATE
// ============================================

const sendCandidateConfirmationEmail = async ({
  applicantEmail,
  applicantName,
  jobTitle,
  company,
  location,
}) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Career AI" <${process.env.SMTP_USER}>`,

    to: applicantEmail,

    subject: `Application Submitted - ${jobTitle}`,

    text: `
Hi ${applicantName},

Your application has been submitted successfully.

Job:
${jobTitle}

Company:
${company}

Location:
${location}

Your resume has been sent to the recruiter configured for this job.

Regards,
Career AI
`,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">

        <h2>Application Submitted Successfully</h2>

        <p>
          Hi <strong>${applicantName}</strong>,
        </p>

        <p>
          Your application has been submitted successfully.
        </p>

        <p>
          <strong>Job:</strong>
          ${jobTitle}
        </p>

        <p>
          <strong>Company:</strong>
          ${company}
        </p>

        <p>
          <strong>Location:</strong>
          ${location}
        </p>

        <p>
          Your resume has been sent to the recruiter
          configured for this job.
        </p>

        <p>
          Regards,<br />
          <strong>Career AI</strong>
        </p>

      </div>
    `,
  });
};

module.exports = {
  sendRecruiterApplicationEmail,
  sendCandidateConfirmationEmail,
};