import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import { EmailMessage } from "cloudflare:email";

export function getAuth(db: ReturnType<typeof getDb>, env: { BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string; SEND_EMAIL?: SendEmail }) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }, request) => {
        if (!env.SEND_EMAIL) {
          console.warn("SEND_EMAIL binding is missing. Cannot send reset password email.");
          return;
        }

        // To comply with raw MIME generation without complex node dependencies
        // we can piece together a simple plain-text compliant MIME format
        const boundary = "boundary-" + crypto.randomUUID();
        const mimeMessage = [
          `To: ${user.email}`,
          `From: Teach Anything Now <hello@teachanythingnow.com>`,
          `Subject: Reset your password`,
          `MIME-Version: 1.0`,
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          ``,
          `--${boundary}`,
          `Content-Type: text/plain; charset="utf-8"`,
          ``,
          `Click the following link to reset your password: ${url}`,
          ``,
          `--${boundary}`,
          `Content-Type: text/html; charset="utf-8"`,
          ``,
          `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
          ``,
          `--${boundary}--`,
        ].join("\\r\\n");

        const msg = new EmailMessage(
          "hello@teachanythingnow.com",
          user.email,
          mimeMessage
        );
        
        try {
          await env.SEND_EMAIL.send(msg);
        } catch (e: any) {
          console.error("Failed to send reset password email:", e?.message);
        }
      }
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
  });
}
