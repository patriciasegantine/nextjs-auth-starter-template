import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "@/lib/email";
import { registrationRequestSchema } from "@/lib/auth-validation";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  appName: "Next.js Auth Starter",
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
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
      if (context.path !== "/sign-up/email") {
        return;
      }

      const result = registrationRequestSchema.safeParse(context.body);

      if (!result.success) {
        throw new APIError("BAD_REQUEST", {
          message:
            result.error.issues[0]?.message ?? "Invalid registration details",
        });
      }
    }),
  },
  plugins: [nextCookies()],
});
