import nodemailer from "nodemailer";
import "dotenv/config";

/**
 * Creates and returns a Nodemailer transporter using environment variables.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. "smtp.gmail.com"
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,     // your email address
    pass: process.env.SMTP_PASS,     // your email password or app password
  },
});

/**
 * Sends an email using the configured transporter.
 * @param {string} to - Receiver email address.
 * @param {string} subject - Subject of the email.
 * @param {string} html - HTML content of the email.
 */
export async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME || "MyApp"}" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
}
