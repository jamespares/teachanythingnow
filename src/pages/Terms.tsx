/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Terms = () => {
  return (
    <Layout title="Terms of Service">
      <div class="min-h-screen flex flex-col">
        <Navbar />

        <main class="site-main--narrow flex-1">
          <div class="card p-10">
            <h1 class="font-accent text-3xl font-normal mb-8">Terms of Service</h1>
            <p class="text-secondary mb-8">Last updated: 29 July 2026</p>

            <div class="flex flex-col gap-8">
              <section>
                <h2 class="font-accent text-xl font-normal mb-3">1. Introduction & Acceptance of Terms</h2>
                <p class="text-secondary leading-relaxed">These Terms of Service govern your use of the Last Minute Lessons website and services, operated by EduConnect Asia Ltd ("we", "us", or "our"), a company registered in England and Wales with its registered office at 71-75 Shelton Street, Covent Garden, London, United Kingdom, WC2H 9JQ.</p>
                <p class="text-secondary leading-relaxed mt-3"><strong>By accessing, browsing, signing up for, or using any part of our service — including generating a lesson package or downloading content — you acknowledge that you have read, understood, and agree to be bound by these Terms of Service in full. If you do not agree to these terms, you must not use our service. We may update these terms from time to time, and your continued use of the service after any changes constitutes acceptance of the revised terms.</strong></p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">2. Service Description</h2>
                <p class="text-secondary leading-relaxed">Last Minute Lessons is an online platform that generates educational lesson packages — including presentations, audio content, worksheets, and AI-generated images — based on topics you provide. Each lesson package is generated on demand and delivered as downloadable digital files.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">3. Free Service & Fair Use</h2>
                <p class="text-secondary leading-relaxed">Last Minute Lessons is currently free to use — no payment, subscription, or card details are required. To keep the service sustainable for everyone, each account may generate a limited number of lesson packages per day (currently 5 per day, resetting at midnight UTC). We reserve the right to change this limit, introduce paid tiers in the future, or suspend accounts that abuse the free service (e.g., automated scraping, bulk generation, or attempts to circumvent the daily limit). Any future pricing changes will be announced in advance and will not affect lesson packages you have already generated.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">4. Acceptable Use</h2>
                <p class="text-secondary leading-relaxed mb-3">4.1 You may use the generated lesson packages for your personal or institutional teaching purposes. You are responsible for reviewing and adapting all generated materials before classroom use.</p>
                <p class="text-secondary leading-relaxed mb-3">4.2 You must not:</p>
                <ul class="text-secondary leading-relaxed pl-6 mb-3">
                  <li>Use the service to generate unlawful, harmful, or misleading content.</li>
                  <li>Attempt to circumvent the daily generation limit or any other technical restriction.</li>
                  <li>Use automated tools, bots, or scripts to access the service in bulk.</li>
                  <li>Resell, redistribute, or commercially exploit the generated materials outside of your direct teaching activities without our prior written consent.</li>
                </ul>
                <p class="text-secondary leading-relaxed">4.3 Because the service is free and lesson packages are generated instantly on demand, no refunds apply. If you experience a technical failure that prevents your lesson package from being generated or delivered, contact us at hey@jamespares.me and we will investigate.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">5. Intellectual Property</h2>
                <p class="text-secondary leading-relaxed">All intellectual property rights in the Last Minute Lessons platform, software, and branding belong to EduConnect Asia Ltd. Upon generation, you are granted a non-exclusive, perpetual, royalty-free licence to use the lesson package content for your personal or institutional teaching purposes. You may not resell, redistribute, or commercially exploit the generated materials outside of your direct teaching activities without our prior written consent.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">6. User Accounts</h2>
                <p class="text-secondary leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.</p>
              </section>

              <section>
                <h2 class="font-accent text-xl font-normal mb-3">7. Limitation of Liability</h2>
                <p class="text-secondary leading-relaxed">To the maximum extent permitted by law, EduConnect Asia Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service. As the service is provided free of charge, our total liability for any claim arising from these terms or the service shall be limited to the maximum extent permitted by applicable law. We do not warrant that the generated content will be error-free, accurate, or suitable for every educational context. You are responsible for reviewing and adapting materials before use.</p>
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

        <Footer />
      </div>
    </Layout>
  );
};
