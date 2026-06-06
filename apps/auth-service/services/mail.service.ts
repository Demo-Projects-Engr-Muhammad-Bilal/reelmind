import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/**
 * 🛡️ Centralized Mail Dispatcher
 * Boilderplate handling: try-catch aur generic error logging
 */
async function dispatchEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `AIreelgen <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    });
    return { data, error };
  } catch (error) {
    console.error(`[MAIL-DISPATCH-CRASH] to: ${to}, subject: ${subject}`, error);
    return { data: null, error };
  }
}

// 📧 Verification Email (Sign-up)
export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const link = `${APP_URL}/verify-email?token=${token}`;
  const html = `<h2>Verify Your Account</h2><p>Hi ${name}, verify here: <a href="${link}">${link}</a></p>`;
  return dispatchEmail(email, "Verify your AIreelgen Account", html);
};

// 📧 Recovery Email (Forgot Password)
export const sendForgotPasswordEmail = async (email: string, name: string, token: string) => {
  const link = `${APP_URL}/reset-password?token=${token}`;
  const html = `<h2>Password Recovery</h2><p>Hi ${name}, reset here: <a href="${link}">${link}</a></p>`;
  return dispatchEmail(email, "Action Required: Reset Your Password", html);
};

// 📧 Resend Link (Registration Utility)
export const sendResendVerificationEmail = async (email: string, token: string) => {
  const link = `${APP_URL}/verify-email?token=${token}`;
  const html = `<h2>New Verification Link</h2><p>Verify here: <a href="${link}">${link}</a></p>`;
  return dispatchEmail(email, "New Verification Link: AIreelgen", html);
};

// 📧 Security Alert (Login)
export const sendLoginAlertEmail = async (email: string, name: string) => {
  const html = `<h2>Security Alert</h2><p>Hi ${name}, a new login was detected on ${new Date().toLocaleString()}.</p>`;
  return dispatchEmail(email, "Security Alert: New Login Detected", html);
};