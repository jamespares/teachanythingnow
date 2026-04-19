/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Terms: FC = () => {
  return (
    <Layout title="Terms of Service">
      <div class="page-wrapper">
        {/* Header */}
        <header class="site-header">
          <a href="/" class="brand">Teach Anything Now</a>
          <nav class="site-nav">
            <a href="/" class="text-sm font-semibold" style="transition:color 0.2s; color:var(--text-primary);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-primary)'">Home</a>
          </nav>
        </header>

        {/* Content */}
        <main class="site-main--narrow">
          <div class="card" style="padding:2.5rem;">
            <h1 style="font-size:2rem; margin-bottom:2rem; color:var(--text-primary);">Terms of Service</h1>
            <p class="text-secondary" style="margin-bottom:2rem;">
              Last updated: 18 April 2025
            </p>

            <div style="display:flex; flex-direction:column; gap:2rem;">
            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">1. Introduction & Acceptance of Terms</h2>
              <p class="text-secondary" style="line-height:1.7;">
                These Terms of Service govern your use of the Teach Anything Now website and services, operated by EduConnect Asia Ltd ("we", "us", or "our"), a company registered in England and Wales with its registered office at 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ.
              </p>
              <p class="text-secondary" style="line-height:1.7; margin-top:0.75rem;">
                <strong>By accessing, browsing, signing up for, or using any part of our service — including generating a lesson package, making a payment, or downloading content — you acknowledge that you have read, understood, and agree to be bound by these Terms of Service in full.</strong> If you do not agree to these terms, you must not use our service. We may update these terms from time to time, and your continued use of the service after any changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">2. Service Description</h2>
              <p class="text-secondary" style="line-height:1.7;">
                Teach Anything Now is an online platform that generates educational lesson packages — including presentations, audio content, worksheets, and AI-generated images — based on topics you provide. Each lesson package is generated on demand and delivered as downloadable digital files.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">3. Payments & Pricing</h2>
              <p class="text-secondary" style="line-height:1.7;">
                Our service is charged at £1.00 (one British pound) per lesson package. Payments are processed securely via Stripe. All prices include VAT where applicable. You agree to provide accurate and complete payment information. We reserve the right to change pricing at any time, but any price changes will not affect purchases already completed.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">4. Refund Policy</h2>
              <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                <strong>4.1 Digital Nature of Service.</strong> Due to the instant, automated, and digital nature of our service — lesson packages are generated immediately upon payment and cannot be "returned" — all purchases are final. By completing your payment, you acknowledge that you lose your statutory right to cancel under the Consumer Contracts Regulations 2013 once the generation process has begun.
              </p>
              <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                <strong>4.2 Eligible Refunds.</strong> We will issue a refund only in the following limited circumstances:
              </p>
              <ul class="text-secondary" style="line-height:1.7; padding-left:1.5rem; margin-bottom:0.75rem;">
                <li>A technical failure on our side prevented the lesson package from being generated or delivered.</li>
                <li>You were charged in error (e.g., duplicate charge or incorrect amount).</li>
                <li>You did not receive any downloadable files after a successful payment due to a system malfunction attributable to us.</li>
              </ul>
              <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                <strong>4.3 Non-Refundable Situations.</strong> Refunds will not be granted for:
              </p>
              <ul class="text-secondary" style="line-height:1.7; padding-left:1.5rem; margin-bottom:0.75rem;">
                <li>Dissatisfaction with the content, quality, or subject matter of the generated materials.</li>
                <li>Change of mind after the lesson package has been generated.</li>
                <li>Errors in the topic or instructions you provided.</li>
                <li>Incompatibility with your software, device, or teaching environment.</li>
                <li>Failure to download files within a reasonable time.</li>
              </ul>
              <p class="text-secondary" style="line-height:1.7; margin-bottom:0.75rem;">
                <strong>4.4 Refund Process.</strong> To request a refund, you must contact us within 14 days of your purchase at <a href="mailto:support@teachanythingnow.com" style="color:var(--primary);">support@teachanythingnow.com</a> with your payment confirmation and a description of the issue. We will review your request within 5 business days. If approved, refunds will be issued to the original payment method within 10 business days. We reserve the right to deny refund requests that do not meet the eligible criteria above.
              </p>
              <p class="text-secondary" style="line-height:1.7;">
                <strong>4.5 Chargebacks.</strong> Initiating a chargeback with your bank or payment provider without first contacting us to resolve the issue may result in the suspension or termination of your account. We reserve the right to dispute fraudulent chargebacks and provide evidence of service delivery to the payment processor.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">5. Intellectual Property</h2>
              <p class="text-secondary" style="line-height:1.7;">
                All intellectual property rights in the Teach Anything Now platform, software, and branding belong to EduConnect Asia Ltd. Upon successful payment and generation, you are granted a non-exclusive, perpetual, royalty-free licence to use the lesson package content for your personal or institutional teaching purposes. You may not resell, redistribute, or commercially exploit the generated materials outside of your direct teaching activities without our prior written consent.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">6. User Accounts</h2>
              <p class="text-secondary" style="line-height:1.7;">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">7. Limitation of Liability</h2>
              <p class="text-secondary" style="line-height:1.7;">
                To the maximum extent permitted by law, EduConnect Asia Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service. Our total liability for any claim arising from these terms or the service shall not exceed the amount you paid for the specific lesson package that gave rise to the claim. We do not warrant that the generated content will be error-free, accurate, or suitable for every educational context. You are responsible for reviewing and adapting materials before use.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">8. Governing Law</h2>
              <p class="text-secondary" style="line-height:1.7;">
                These terms are governed by and construed in accordance with the laws of England and Wales. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">9. Changes to These Terms</h2>
              <p class="text-secondary" style="line-height:1.7;">
                We may update these Terms of Service from time to time. We will notify you of any material changes by posting the updated terms on this page with a revised "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 style="font-size:1.25rem; margin-bottom:0.75rem;">10. Contact</h2>
              <p class="text-secondary" style="line-height:1.7;">
                If you have any questions about these Terms of Service, please contact us at:<br /><br />
                EduConnect Asia Ltd<br />
                71-75 Shelton Street, Covent Garden<br />
                London, United Kingdom, WC2H 9JQ<br />
                Email: <a href="mailto:support@teachanythingnow.com" style="color:var(--primary);">support@teachanythingnow.com</a>
              </p>
            </section>
          </div>
          </div>
        </main>

        {/* Footer */}
        <footer style="border-top:1px solid var(--border-strong); padding:2rem 1.5rem; text-align:center;">
          <p class="text-xs" style="margin:0 0 0.5rem; color:var(--text-secondary);">
            © 2025 EduConnect Asia Ltd. All rights reserved. Built by James Pares.
          </p>
          <p class="text-xs" style="margin:0; color:var(--text-secondary);">
            71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ
          </p>
        </footer>
      </div>
    </Layout>
  );
};
