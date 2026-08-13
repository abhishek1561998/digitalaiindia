import { Resend } from "resend";

// No email service was configured anywhere in this project before this —
// gated on RESEND_API_KEY so the rest of the app keeps working (just
// logs instead of sending) until that's set. Instantiated per-call rather
// than as a module-level singleton — a top-level `new Resend(...)` read
// process.env.RESEND_API_KEY as unset in this project's serverless
// bundling even after the var was confirmed present at runtime.
const FROM = process.env.EMAIL_FROM || "DigitalAIIndia <onboarding@resend.dev>";
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "info.digitalaiindia@gmail.com";

async function send(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set — would have sent "${subject}" to ${to}`);
    return { sent: false };
  }
  try {
    const resendClient = new Resend(apiKey);
    await resendClient.emails.send({ from: FROM, to, subject, html });
    return { sent: true };
  } catch (error) {
    console.error("email_send_failed", { to, subject, error });
    return { sent: false };
  }
}

export async function sendPaymentSubmittedEmail(params: {
  userName: string;
  userEmail: string;
  trackId: string;
  paymentRef: string;
}) {
  return send(
    ADMIN_NOTIFY_EMAIL,
    `Certificate payment to verify — ${params.userName}`,
    `<p><strong>${escapeHtml(params.userName)}</strong> (${escapeHtml(params.userEmail)}) submitted a ₹49 payment for the <strong>${escapeHtml(params.trackId)}</strong> certificate.</p>
     <p>UTR / reference: <code>${escapeHtml(params.paymentRef)}</code></p>
     <p><a href="https://digitalaiindia.com/admin/payments">Review and approve →</a></p>`,
  );
}

export async function sendCertificateReadyEmail(params: {
  userName: string;
  userEmail: string;
  trackTitle: string;
  certificateUrl: string;
}) {
  return send(
    params.userEmail,
    `Your certificate is ready — ${params.trackTitle}`,
    `<div style="font-family: -apple-system, sans-serif; max-width: 480px;">
       <h2>🎉 Congratulations, ${escapeHtml(params.userName)}!</h2>
       <p>Your payment is verified and your certificate for <strong>${escapeHtml(params.trackTitle)}</strong> is ready.</p>
       <p><a href="${params.certificateUrl}" style="display:inline-block;padding:10px 20px;background:#FF7500;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">View your certificate →</a></p>
       <p style="color:#888;font-size:13px;margin-top:24px;">DigitalAIIndia Learn</p>
     </div>`,
  );
}

export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return send(
    ADMIN_NOTIFY_EMAIL,
    `New contact form message: ${params.subject}`,
    `<p><strong>${escapeHtml(params.name)}</strong> (${escapeHtml(params.email)})</p>
     <p><strong>${escapeHtml(params.subject)}</strong></p>
     <p>${escapeHtml(params.message).replace(/\n/g, "<br/>")}</p>`,
  );
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
