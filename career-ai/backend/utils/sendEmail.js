const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, name, otp) => {
  const mailOptions = {
    from: `"Career AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Career AI - Email Verification OTP",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #0b1020;
        color: white;
        border-radius: 15px;
      ">

        <h1 style="color:#7c3aed;">
          Career AI
        </h1>

        <h2>Email Verification</h2>

        <p>Hello ${name},</p>

        <p>
          Thank you for creating your Career AI account.
          Use the OTP below to verify your email.
        </p>

        <div style="
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 10px;
          text-align: center;
          padding: 20px;
          margin: 25px 0;
          background: #171d35;
          border-radius: 10px;
          color: #a78bfa;
        ">
          ${otp}
        </div>

        <p>
          This OTP will expire in <b>10 minutes</b>.
        </p>

        <p>
          If you did not create this account, you can safely ignore this email.
        </p>

        <hr />

        <p style="color:#94a3b8;">
          Career AI - Your AI Career Companion
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;