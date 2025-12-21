import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from "resend";

// Lazy initialization of Resend client
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      // Use custom sendVerificationRequest for Resend
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          const resend = getResend();
          const result = await resend.emails.send({
            from: process.env.EMAIL_FROM || "Teach Anything <noreply@teachanything.app>",
            to: email,
            subject: "Sign in to Teach Anything",
            html: generateMagicLinkEmail(url),
            text: `Sign in to Teach Anything\n\nClick the link below to sign in:\n${url}\n\nThis link expires in 24 hours.\n\nIf you didn't request this email, you can safely ignore it.`,
          });

          if (result.error) {
            console.error("Resend error:", result.error);
            throw new Error(`Failed to send email: ${result.error.message}`);
          }
        } catch (error) {
          console.error("Error sending magic link email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  // Use Supabase as the database adapter
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token, user }) {
      // When using database sessions, user object is passed directly
      // When using JWT sessions, we use the token
      if (session.user) {
        session.user.id = (user?.id || token?.id) as string;
        session.user.email = (user?.email || token?.email) as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request", // Page shown after email is sent
    error: "/auth/error", // Error page
  },
  session: {
    strategy: "database", // Use database sessions for magic link auth
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Generate a clean, professional magic link email
function generateMagicLinkEmail(url: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Teach Anything</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
          <tr>
            <td style="padding: 40px 32px;">
              <!-- Logo / Header -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 32px;">
                    <div style="display: inline-block; width: 48px; height: 48px; background-color: #6366f1; border-radius: 12px; line-height: 48px; text-align: center;">
                      <span style="font-size: 24px;">&#128218;</span>
                    </div>
                    <h1 style="margin: 16px 0 0 0; font-size: 24px; font-weight: 600; color: #111827;">Teach Anything</h1>
                  </td>
                </tr>
              </table>
              
              <!-- Content -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align: center;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">Sign in to your account</h2>
                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #6b7280;">
                      Click the button below to sign in to Teach Anything. This link will expire in 24 hours.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding: 8px 0 24px 0;">
                    <a href="${url}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #6366f1; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">
                      Sign in
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Footer -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="text-align: center; padding-top: 32px; border-top: 1px solid #e5e7eb; margin-top: 32px;">
                    <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                      Trouble clicking the button? Copy and paste this URL into your browser:
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #6366f1; word-break: break-all;">
                      ${url}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
