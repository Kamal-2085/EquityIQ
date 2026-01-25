import nodemailer from "nodemailer";

const getTransporter = () => {
  const service = process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secureEnv = process.env.SMTP_SECURE;
  const secure = secureEnv ? secureEnv === "true" : port === 465;

  if (!user || !pass) {
    throw new Error("SMTP credentials are missing in environment variables");
  }

  if (service) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  if (!host) {
    throw new Error("SMTP_HOST is missing in environment variables");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

export const sendOtpEmail = async ({ to, name, otp }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const replyTo = process.env.SMTP_REPLY_TO;

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
    ...(replyTo ? { replyTo } : {}),
  });
};

export const sendAddMoneyEmail = async ({ to, name, amount, dateTime }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const replyTo = process.env.SMTP_REPLY_TO;

  const subject = "We’ve received your add-money request";
  const formattedAmount = `₹${amount}`;
  const text = `Hi ${name},\n\nWe’ve received your request to add funds to your EquityIQ account.\n\nTransaction details:\n• Amount: ${formattedAmount}\n• Date & time: ${dateTime}\n• Status: Processing\n\nYour payment is currently being verified by our payment partner.\nThis usually takes a few minutes, but in rare cases it may take a day.\n\nOnce confirmed, the funds will be available in your EquityIQ account automatically.\n\nIf the payment is unsuccessful, the amount will be refunded to your source account as per bank timelines.\n\nYou don’t need to take any action right now.\n\nThanks for trusting EquityIQ.\n\n—\nTeam EquityIQ`;

  const html = `
    <p>Hi ${name},</p>
    <p>We’ve received your request to add funds to your EquityIQ account.</p>
    <p><strong>Transaction details:</strong><br />
      • Amount: ${formattedAmount}<br />
      • Date &amp; time: ${dateTime}<br />
      • Status: Processing
    </p>
    <p>Your payment is currently being verified by our payment partner.<br />
      This usually takes a few minutes, but in rare cases it may take a day.</p>
    <p>Once confirmed, the funds will be available in your EquityIQ account automatically.</p>
    <p>If the payment is unsuccessful, the amount will be refunded to your source account as per bank timelines.</p>
    <p>You don’t need to take any action right now.</p>
    <p>Thanks for trusting EquityIQ.</p>
    <p>—<br />Team EquityIQ</p>
  `;

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
};
