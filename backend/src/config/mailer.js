export const sendBankAccountAddedEmail = async ({
  to,
  name,
  bankName,
  accountNumber,
  ifsc,
}) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const replyTo = process.env.SMTP_REPLY_TO;

  const subject = "Bank account added to EquityIQ";
  const last4 = accountNumber ? String(accountNumber).slice(-4) : "XXXX";
  const text = `Hi ${name},\n\nYour bank account has been successfully added to your EquityIQ account ✅\n\nBank details:\n\n* Bank: ${bankName || "-"}\n* Account number: XXXX${last4}\n* IFSC: ${ifsc || "-"}\n\nYou can now use this bank account for adding funds and withdrawals on EquityIQ.\n\nIf you didn’t make this change or notice anything unusual, please contact us immediately.\n\nThanks for choosing EquityIQ,\nTeam EquityIQ`;
  const html = `
    <p>Hi ${name},</p>
    <p>Your bank account has been <strong>successfully added</strong> to your <strong>EquityIQ</strong> account ✅</p>
    <p><strong>Bank details:</strong></p>
    <ul>
      <li><strong>Bank:</strong> ${bankName || "-"}</li>
      <li><strong>Account number:</strong> XXXX${last4}</li>
      <li><strong>IFSC:</strong> ${ifsc || "-"}</li>
    </ul>
    <p>You can now use this bank account for adding funds and withdrawals on EquityIQ.</p>
    <p>If you didn’t make this change or notice anything unusual, please contact us immediately.</p>
    <p>Thanks for choosing EquityIQ,<br />Team EquityIQ</p>
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
export const sendWelcomeEmail = async ({ to, name }) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const replyTo = process.env.SMTP_REPLY_TO;

  const subject = `Welcome to EquityIQ!`;
  const text = `Hi ${name},\n\nWelcome to EquityIQ! Your account has been successfully created, and you’re all set to begin your investing journey with us.\n\nHere’s what you can do next:\n\n* Secure your account by completing KYC\n* Add funds to start investing\n* Explore stocks, insights, and market trends\n\nWe’re excited to have you on board and are here to help at every step.\nIf you have any questions, feel free to reach out to us anytime.\n\nHappy investing,\nTeam EquityIQ`;
  const html = `
    <p>Hi ${name},</p>
    <p>Welcome to <strong>EquityIQ</strong>! 🎉<br />Your account has been successfully created, and you’re all set to begin your investing journey with us.</p>
    <p><strong>Here’s what you can do next:</strong></p>
    <ul>
      <li>🔐 Secure your account by completing KYC</li>
      <li>💰 Add funds to start investing</li>
      <li>📊 Explore stocks, insights, and market trends</li>
    </ul>
    <p>We’re excited to have you on board and are here to help at every step.<br />If you have any questions, feel free to reach out to us anytime.</p>
    <p>Happy investing,<br />Team EquityIQ</p>
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
