import nodemailer from "nodemailer";

type PasswordResetEmail = {
  to: string;
  name: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmail) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !password || !from) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[auth] Password reset for ${to}: ${resetUrl}`);
      return;
    }

    throw new Error("SMTP and email sender variables must be configured.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    text: `Hi ${name},\n\nUse this link to reset your password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
}
