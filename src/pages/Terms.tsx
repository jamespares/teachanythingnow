/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";

export const Terms = () => {
  return (
    <Layout title="Terms of Service">
      <div class="min-h-screen flex flex-col">
        <Navbar />

        <main class="site-main--narrow flex-1">
          <div class="card p-10">
            <h1 class="font-accent text-3xl font-normal mb-8">Terms of Service</h1>
            <p class="text-secondary mb-8">Last updated: 18 April 2025</p>

            <div class="flex flex-col gap-8">
              <section>
                <h2 class="font-accent text-xl font-normal mb-3">1. Introduction & Acceptance of Terms</h2>
                <p class="text-secondary leading-relaxed">These Terms of Service govern your use of the Last Minute Lessons website and services, operated by EduConnect Asia Ltd ("we", "us", or "our"), a company registered in England and Wales with its registered office at 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ.</p>
                <p class="text-secondary leading-relaxed mt-3"><strong>By accessing, browsing, signing up for, or using any part of our service — including generating a lesson package, making a payment, or downloading content — you acknowledge that you have read, understood, and agree to be bound by these Terms of Service in full. If you do not agree to these terms, you must not use our service. We may update these terms from time to time, and your continued use of the service after any changes constitutes acceptance of the revised terms.</strong></p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">2. Service Description</h2>
                <p class="text-secondary leading-relaxed">Last Minute Lessons is an online platform that generates educational lesson packages — including presentations, audio content, worksheets, and AI-generated images — based on topics you provide. Each lesson package is generated on demand and delivered as downloadable digital files.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">3. Payments & Pricing</h2>
                <p class="text-secondary leading-relaxed">Our service is charged at £1.00 (one British pound) per lesson package. Payments are processed securely via Stripe. All prices include VAT where applicable. You agree to provide accurate and complete payment information. We reserve the right to change pricing at any time, but any price changes will not affect purchases already completed.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">4. Refund Policy</h2>
                <p class="text-secondary leading-relaxed mb-3">4.1 Due to the instant, automated, and digital nature of our service — lesson packages are generated immediately upon payment and cannot be "returned" — all purchases are final. By completing your payment, you acknowledge that you lose your statutory right to cancel under the Consumer Contracts Regulations 2013 once the generation process has begun.</p>
                <p class="text-secondary leading-relaxed mb-3">4.2 We will issue a refund only in the following limited circumstances:</p>
                <ul class="text-secondary leading-relaxed pl-6 mb-3">
                  <li>A technical failure on our side prevented the lesson package from being generated or delivered.</li>
                  <li>You were charged in error (e.g., duplicate charge or incorrect amount).</li>
                  <li>You did not receive any downloadable files after a successful payment due to a system malfunction attributable to us.</li>
                </ul>
                <p class="text-secondary leading-relaxed mb-3">4.3 Refunds will not be granted for:</p>
                <ul class="text-secondary leading-relaxed pl-6 mb-3">
                  <li>Dissatisfaction with the content, quality, or subject matter of the generated materials.</li>
                  <li>Change of mind after the lesson package has been generated.</li>
                  <li>Errors in the topic or instructions you provided.</li>
                  <li>Incompatibility with your software, device, or teaching environment.</li>
                  <li>Failure to download files within a reasonable time.</li>
                </ul>
                <p class="text-secondary leading-relaxed mb-3">4.4 To request a refund, you must contact us within 14 days of your purchase at hey@jamespares.me with your payment confirmation and a description of the issue. We will review your request within 5 business days. If approved, refunds will be issued to the original payment method within 10 business days. We reserve the right to deny refund requests that do not meet the eligible criteria above.</p>
                <p class="text-secondary leading-relaxed">4.5 Initiating a chargeback with your bank or payment provider without first contacting us to resolve the issue may result in the suspension or termination of your account. We reserve the right to dispute fraudulent chargebacks and provide evidence of service delivery to the payment processor.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">5. Intellectual Property</h2>
                <p class="text-secondary leading-relaxed">All intellectual property rights in the Last Minute Lessons platform, software, and branding belong to EduConnect Asia Ltd. Upon successful payment and generation, you are granted a non-exclusive, perpetual, royalty-free licence to use the lesson package content for your personal or institutional teaching purposes. You may not resell, redistribute, or commercially exploit the generated materials outside of your direct teaching activities without our prior written consent.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">6. User Accounts</h2>
                <p class="text-secondary leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">7. Limitation of Liability</h2>
                <p class="text-secondary leading-relaxed">To the maximum extent permitted by law, EduConnect Asia Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service. Our total liability for any claim arising from these terms or the service shall not exceed the amount you paid for the specific lesson package that gave rise to the claim. We do not warrant that the generated content will be error-free, accurate, or suitable for every educational context. You are responsible for reviewing and adapting materials before use.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">8. Governing Law</h2>
                <p class="text-secondary leading-relaxed">These terms are governed by and construed in accordance with the laws of England and Wales. Any dispute arising under these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">9. Changes to These Terms</h2>
                <p class="text-secondary leading-relaxed">We may update these Terms of Service from time to time. We will notify you of any material changes by posting the updated terms on this page with a revised "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the revised terms.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">10. Contact</h2>
                <p class="text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: "If you have any questions about these Terms of Service, please contact us at:<br /><br />EduConnect Asia Ltd<br />71-75 Shelton Street, Covent Garden<br />London, United Kingdom, WC2H 9JQ<br />Email: hey@jamespares.me" }} />
              </section>
            </div>
          </div>
        </main>

        <footer class="border-t-strong py-8 px-6 text-center">
          <p class="text-xs text-secondary m-0 mb-2">© 2025 EduConnect Asia Ltd. All rights reserved. Built by James Pares.</p>
          <p class="text-xs text-secondary m-0">71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ</p>
        </footer>
      </div>
    </Layout>
  );
};
