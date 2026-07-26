import { prismaAdapter } from "@better-auth/prisma-adapter";
import { waitUntil } from "@vercel/functions";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { openAPI } from "better-auth/plugins";
import { db } from "@/lib/db";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/lib/email";
import {
  registrationRequestSchema,
  resetPasswordRequestSchema,
} from "@/lib/auth-validation";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const additionalTrustedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Per-route overrides for the sensitive auth endpoints. `window` is in
// seconds; `max` is the number of requests allowed per window per IP.
const authRateLimitRules = {
  "/sign-in/email": { window: 60, max: 5 },
  "/sign-up/email": { window: 60 * 10, max: 5 },
  "/forgot-password": { window: 60 * 15, max: 3 },
  "/reset-password": { window: 60 * 15, max: 5 },
  "/send-verification-email": { window: 60 * 15, max: 3 },
};

export const auth = betterAuth({
  appName: "Auth Starter Demo",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  trustedOrigins: additionalTrustedOrigins,
  rateLimit: {
    enabled: true,
    // Vercel functions are stateless across invocations, so in-memory
    // (the better-auth default) would not actually limit anything in
    // production; persist counters in Postgres instead.
    storage: "database",
    window: 60,
    max: 20,
    customRules: authRateLimitRules,
  },
  advanced: {
    backgroundTasks: {
      handler: waitUntil,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!user.emailVerified) {
            return;
          }

          try {
            await sendWelcomeEmail({
              to: user.email,
              name: user.name,
            });
          } catch (error) {
            console.error("[auth] Welcome email delivery failed.", error);
          }
        },
      },
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({
        to: user.email,
        name: user.name,
        verificationUrl: url,
      });
    },
    afterEmailVerification: async (user) => {
      try {
        await sendWelcomeEmail({
          to: user.email,
          name: user.name,
        });
      } catch (error) {
        console.error("[auth] Welcome email delivery failed.", error);
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },
  socialProviders:
    googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {},
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path === "/sign-up/email") {
        const result = registrationRequestSchema.safeParse(context.body);

        if (!result.success) {
          throw new APIError("BAD_REQUEST", {
            message:
              result.error.issues[0]?.message ??
              "Invalid registration details",
          });
        }

        return;
      }

      if (context.path !== "/reset-password") {
        return;
      }

      const result = resetPasswordRequestSchema.safeParse(context.body);
      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message:
            result.error.issues[0]?.message ?? "Invalid password",
        });
      }
    }),
  },
  plugins: [
    nextCookies(),
    openAPI({
      disableDefaultReference: true,
    }),
  ],
});
