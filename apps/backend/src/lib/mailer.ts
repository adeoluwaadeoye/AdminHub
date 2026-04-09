import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "AdminHub <onboarding@resend.dev>";
const APP_NAME = "AdminHub";

// ── PASSWORD RESET ─────────────────────────────────────────
export const sendResetEmail = async (
  email: string,
  token: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your AdminHub password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">

            <!-- HEADER -->
            <div style="background:#4f46e5;padding:32px 32px 24px;">
              <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">
                ${APP_NAME}
              </h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:14px;">
                Password Reset Request
              </p>
            </div>

            <!-- BODY -->
            <div style="padding:32px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                Hi there,
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                We received a request to reset the password for your
                <strong>${APP_NAME}</strong> account.
                Click the button below to set a new password.
              </p>

              <!-- BUTTON -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${resetUrl}"
                  style="display:inline-block;padding:14px 32px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                  Reset Password
                </a>
              </div>

              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px;color:#4f46e5;font-size:12px;word-break:break-all;">
                ${resetUrl}
              </p>

              <!-- WARNING -->
              <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
                  ⚠️ This link expires in <strong>1 hour</strong>.
                  If you didn't request a password reset, you can safely ignore this email.
                </p>
              </div>

              <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                For security, this request was received from the ${APP_NAME} platform.
                If you have concerns, contact our support team.
              </p>
            </div>

            <!-- FOOTER -->
            <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </div>

          </div>
        </body>
      </html>
    `,
  });
};

// ── WELCOME EMAIL ──────────────────────────────────────────
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to ${APP_NAME}, ${name}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">

            <!-- HEADER -->
            <div style="background:#4f46e5;padding:32px 32px 24px;">
              <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">
                Welcome to ${APP_NAME}! 🎉
              </h1>
              <p style="margin:6px 0 0;color:#c7d2fe;font-size:14px;">
                Your account is ready
              </p>
            </div>

            <!-- BODY -->
            <div style="padding:32px;">
              <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Your ${APP_NAME} account has been created successfully.
                You now have access to your full task management dashboard.
              </p>

              <!-- FEATURES LIST -->
              <div style="background:#f5f3ff;border-radius:8px;padding:20px;margin-bottom:24px;">
                <p style="margin:0 0 12px;color:#4f46e5;font-weight:600;font-size:14px;">
                  What you can do now:
                </p>
                ${[
        "Create and manage tasks with priorities and due dates",
        "Track progress with the kanban board",
        "View analytics and completion stats",
        "Set up your profile and preferences",
      ].map((f) => `
                  <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
                    <span style="color:#4f46e5;font-size:14px;margin-top:1px;">✓</span>
                    <p style="margin:0;color:#374151;font-size:13px;line-height:1.5;">${f}</p>
                  </div>
                `).join("")}
              </div>

              <!-- BUTTON -->
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard"
                  style="display:inline-block;padding:14px 32px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">
                  Go to Dashboard
                </a>
              </div>
            </div>

            <!-- FOOTER -->
            <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </div>

          </div>
        </body>
      </html>
    `,
  });
};