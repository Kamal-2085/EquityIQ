import nodemailer from "nodemailer";

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are missing in environment variables");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

export const sendOtpEmail = async ({ to, name, otp }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const subject = "Your EquityIQ verification code";
  const text = `Hi ${name},\n\nYour verification code is ${otp}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`;
  const html = `
    <p>Hi ${name},</p>
    <p>Your verification code is <strong>${otp}</strong>. It expires in 10 minutes.</p>
    <p>If you didn't request this, you can ignore this email.</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};
