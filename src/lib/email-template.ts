/**
 * Template customization:
 * Replace the app name, author, resource links, copy, and visual styles below
 * with your product's own brand before sending emails in production.
 */
const APP_NAME = "Auth Starter";
const AUTHOR_NAME = "Patricia Segantine";
const DOCUMENTATION_URL = "https://ps-nextjs-auth-starter.vercel.app/docs";
const REPOSITORY_URL =
  "https://github.com/patriciasegantine/nextjs-auth-starter-template";

type EmailTemplate = {
  heading: string;
  preheader: string;
  content: string;
  action?: {
    href: string;
    label: string;
  };
};

export function renderWelcomeEmail(name: string) {
  return renderEmail({
    preheader: "Your Auth Starter account is ready.",
    heading: "Welcome to Auth Starter",
    content: `
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0;">Your email has been confirmed and your account is ready. You can now securely access your authenticated session.</p>
    `,
    action: {
      href: `${getAppUrl()}/session`,
      label: "View your session",
    },
  });
}

export function renderVerificationEmail(name: string, verificationUrl: string) {
  return renderEmail({
    preheader: "Confirm your email address to finish creating your account.",
    heading: "Confirm your email address",
    content: `
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0;">Use the button below to confirm your email address and finish creating your account. This link expires in one hour.</p>
    `,
    action: {
      href: verificationUrl,
      label: "Confirm email address",
    },
  });
}

export function renderPasswordResetEmail(name: string, resetUrl: string) {
  return renderEmail({
    preheader: "Reset your Auth Starter password.",
    heading: "Reset your password",
    content: `
      <p style="margin:0 0 16px;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0;">We received a request to reset your password. Use the button below to choose a new one.</p>
    `,
    action: {
      href: resetUrl,
      label: "Reset password",
    },
  });
}

function renderEmail({
  heading,
  preheader,
  content,
  action,
}: EmailTemplate) {
  const actionMarkup = action
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
        <tr>
          <td style="border-radius:12px;background:#111111;">
            <a href="${escapeHtml(action.href)}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(action.label)}</a>
          </td>
        </tr>
      </table>
    `
    : "";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(heading)}</title>
      </head>
      <body style="margin:0;background:#ffffff;color:#111111;font-family:Arial,Helvetica,sans-serif;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;">
                <tr>
                  <td style="padding:36px;">
                    <div style="margin-bottom:36px;font-size:16px;font-weight:700;letter-spacing:-0.2px;">
                      ${APP_NAME}
                    </div>
                    <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15;letter-spacing:-0.8px;">${escapeHtml(heading)}</h1>
                    <div style="color:#656565;font-size:16px;line-height:1.65;">
                      ${content}
                    </div>
                    ${actionMarkup}
                    <p style="margin:28px 0 0;border-top:1px solid #eeeeeb;padding-top:22px;color:#8a8a8a;font-size:13px;line-height:1.6;">
                      If you did not request this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #eeeeeb;padding:22px 36px;color:#8a8a8a;font-size:12px;line-height:1.7;">
                    Created by ${AUTHOR_NAME}<br>
                    <a href="${DOCUMENTATION_URL}" style="color:#656565;">Documentation</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${REPOSITORY_URL}" style="color:#656565;">GitHub</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getAppUrl() {
  return (process.env.BETTER_AUTH_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}
