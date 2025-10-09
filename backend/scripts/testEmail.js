#!/usr/bin/env node
/*
 * Usage:
 *   node scripts/testEmail.js recipient@example.com "Optional Name"
 *
 * Loads environment variables from the project .env file, then invokes the shared
 * sendEmail utility with the OTP template so you can check SMTP connectivity
 * directly from a terminal (no browser required).
 */
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const sendEmail = require("../utils/email");
const buildTemplate = require("../utils/emailTemplate");

const [recipient, nameArg] = process.argv.slice(2);

if (!recipient) {
  console.error("✗ Please provide an email address to send the test OTP to.");
  console.error(
    "  Example: node scripts/testEmail.js you@example.com 'QA User'"
  );
  process.exit(1);
}

const name = nameArg || "Test User";
const otp = Math.floor(100000 + Math.random() * 900000).toString();

console.log("[TEST EMAIL] Attempting to send OTP email");
console.log("  To:", recipient);
console.log("  Name:", name);

(async () => {
  try {
    const html = buildTemplate(name, otp);
    const result = await sendEmail({
      to: recipient,
      subject: "SMTP Test OTP",
      html,
      text: `Your verification code is ${otp}`,
    });
    console.log("[TEST EMAIL] ✓ Email accepted by SMTP server");
    console.log("[TEST EMAIL] Message ID:", result?.messageId);
    console.log("[TEST EMAIL] Response:", result?.response);
    console.log(
      "[TEST EMAIL] Remember to check the spam folder if it doesn't appear in the inbox."
    );
    process.exit(0);
  } catch (error) {
    console.error("[TEST EMAIL] ✗ Failed to send email");
    console.error("  Code:", error.code || "(no code)");
    console.error("  Message:", error.message);
    if (error.response && error.response.code === "EAUTH") {
      console.error(
        "  Hint: Gmail requires a 16-character App Password generated after enabling 2-Step Verification."
      );
    }
    console.error("  Full Error:", error);
    process.exit(1);
  }
})();
