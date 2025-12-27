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
        // Validate environment variables first
        if (!process.env.RESEND_API_KEY) {
          const errorMsg = "RESEND_API_KEY is not set in environment variables";
          console.error("[Email Auth] Configuration error:", errorMsg);
          throw new Error(errorMsg);
        }

        const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
        
        console.log("[Email Auth] Attempting to send magic link:", {
          to: email,
          from: emailFrom,
          hasApiKey: !!process.env.RESEND_API_KEY,
        });

        try {
          const resend = getResend();
          const result = await resend.emails.send({
            from: emailFrom,
            to: email,
            subject: "Your sign in link for Teach Anything Now",
            html: generateMagicLinkEmail(url),
            text: `Your Sign In Link\n\nYou requested to sign in to Teach Anything Now. Click the link below to access your account:\n\n${url}\n\nThis link will expire in 24 hours for security.\n\nIf you didn't request this, you can safely ignore this email.\n\n---\nTeach Anything Now - AI-Powered Educational Content`,
            // Add reply-to to improve deliverability
            replyTo: process.env.EMAIL_REPLY_TO,
            // Add headers to improve spam score
            headers: {
              'X-Entity-Ref-ID': Date.now().toString(),
            },
          });

          console.log("[Email Auth] Resend API response:", JSON.stringify(result, null, 2));

          // Check for errors in the response
          if (result.error) {
            const errorDetails = {
              message: result.error.message,
              name: result.error.name,
              statusCode: (result.error as any).statusCode,
            };
            console.error("[Email Auth] Resend API error:", errorDetails);
            throw new Error(`Failed to send email: ${result.error.message || "Unknown error"}`);
          }

          // Verify we got a successful response
          if (!result.data || !result.data.id) {
            console.error("[Email Auth] Unexpected response format:", result);
            throw new Error("Failed to send email: Invalid response from email service");
          }

          console.log("[Email Auth] Email sent successfully:", {
            emailId: result.data.id,
            to: email,
          });
        } catch (error: any) {
          // Log the full error details
          console.error("[Email Auth] Error sending magic link email:", {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
            response: error?.response,
            statusCode: error?.statusCode,
          });

          // Re-throw with more context
          const errorMessage = error?.message || "Failed to send verification email";
          throw new Error(errorMessage);
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

// Generate a clean, professional magic link email matching the landing page theme
function generateMagicLinkEmail(url: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Sign In Link</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 48px 40px;">
              
              <!-- Header with Logo -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <img src="https://teachanything.com/logo.png" alt="Teach Anything Now" width="48" height="48" style="display: block; margin: 0 auto 12px auto;" />
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #111827;">Teach Anything Now</h1>
                  </td>
                </tr>
              </table>
              
              <!-- Main Content -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding: 0 0 24px 0;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Your sign in link is ready
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #6b7280;">
                      Click the button below to securely sign in to your account and start creating AI-powered lesson materials.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 0 32px 0; text-align: center;">
                    <a href="${url}" style="display: inline-block; padding: 14px 32px; background-color: #5eae91; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 500; border-radius: 9999px; text-align: center;">
                      Sign in to Teach Anything Now
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0 0 24px 0; padding: 12px; background-color: #f9fafb; border-radius: 8px; font-size: 13px; line-height: 1.5; color: #5eae91; word-break: break-all; font-family: monospace;">
                      ${url}
                    </p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #9ca3af;">
                      <strong style="color: #6b7280;">Security note:</strong> This link will expire in 24 hours and can only be used once.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 24px 0 0 0; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9ca3af; text-align: center;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 24px auto 0 auto;">
          <tr>
            <td style="text-align: center; padding-top: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;">
                <strong style="color: #6b7280;">Teach Anything Now</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                AI-Powered Educational Content | Create lesson materials in seconds
              </p>
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
