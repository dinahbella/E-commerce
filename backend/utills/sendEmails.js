import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Dinah Mall" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
};

export default sendEmail;
