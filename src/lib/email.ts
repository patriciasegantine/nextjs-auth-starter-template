import nodemailer from "nodemailer";
import {
  renderPasswordResetEmail,
  renderVerificationEmail,
  renderWelcomeEmail,
} from "@/lib/email-template";

type WelcomeEmail = {
  to: string;
  name: string;
};

type EmailVerificationEmail = {
  to: string;
  name: string;
  verificationUrl: string;
};

type PasswordResetEmail = {
  to: string;
  name: string;
  resetUrl: string;
};

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !password || !from) {
    return null;
  }

  return {
    from,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: password,
      },
    }),
  };
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmail) {
  const mail = getTransport();

  if (!mail) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[auth] Welcome email for ${to}`);
      return;
    }

    throw new Error("SMTP and email sender variables must be configured.");
  }

  await mail.transporter.sendMail({
    from: mail.from,
    to,
    subject: "Welcome to Auth Starter",
    text: `Hi ${name},\n\nWelcome to Auth Starter. Your account was created successfully.`,
    html: renderWelcomeEmail(name),
  });
}

export async function sendEmailVerificationEmail({
  to,
  name,
  verificationUrl,
}: EmailVerificationEmail) {
  const mail = getTransport();

  if (!mail) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[auth] Email verification for ${to}: ${verificationUrl}`);
      return;
    }

    throw new Error("SMTP and email sender variables must be configured.");
  }

  await mail.transporter.sendMail({
    from: mail.from,
    to,
    subject: "Confirm your email address",
    text: `Hi ${name},\n\nConfirm your email address to finish creating your Auth Starter account:\n${verificationUrl}\n\nIf you did not create this account, you can ignore this email.`,
    html: renderVerificationEmail(name, verificationUrl),
  });
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmail) {
  const mail = getTransport();

  if (!mail) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[auth] Password reset for ${to}: ${resetUrl}`);
      return;
    }

    throw new Error("SMTP and email sender variables must be configured.");
  }

  await mail.transporter.sendMail({
    from: mail.from,
    to,
    subject: "Reset your password",
    text: `Hi ${name},\n\nUse this link to reset your password:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: renderPasswordResetEmail(name, resetUrl),
  });
}
