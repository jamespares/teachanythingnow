/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import type { Lang, Dict } from "../lib/i18n";

export const Home: FC<{ user?: any; stripeKey: string; lang: Lang; dict: Dict }> = ({ user, stripeKey, lang, dict }) => {
  const scriptDict = JSON.stringify({
    preparing: dict.homeScriptPreparing,
    completePayment: dict.homeScriptCompletePayment,
    initPaymentError: dict.homeScriptInitPaymentError,
    alertEnterTopic: dict.homeScriptAlertEnterTopic,
    processingPayment: dict.homeScriptProcessingPayment,
    generationError: dict.homeScriptGenerationError,
    generate: dict.homeBtnGenerate,
  });

  return (
    <Layout title={dict.homeTitle} lang={lang} dict={dict}>
      <div class="min-h-screen flex flex-col">
        <Navbar dict={dict} user={user} />

        <main class="flex-1">
          {/* Hero */}
          <section class="site-main--narrow pt-16 pb-8 text-center">
            <div class="animate-fade-in">
              <h1
                class="font-accent font-normal mb-6"
                style="font-size: clamp(2.5rem, 6vw, 4.5rem); letter-spacing: -0.03em;"
                dangerouslySetInnerHTML={{ __html: dict.homeHeroTitle }}
              />
              <p class="text-lg md:text-xl max-w-xl mx-auto leading-relaxed text-secondary">
                {dict.homeHeroSubtitle}
              </p>

              {/* AI Branding */}
              <div class="mt-10 flex flex-col items-center gap-3">
                <p class="text-xs font-semibold uppercase tracking-widest text-muted">{dict.homePoweredBy}</p>
                <div
                  class="flex items-center gap-10 transition-all duration-300"
                  style="filter: grayscale(1); opacity: 0.6;"
                  onmouseover="this.style.filter='none'; this.style.opacity='1'"
                  onmouseout="this.style.filter='grayscale(1)'; this.style.opacity='0.6'"
                >
                  <img src="/claude.png" alt="Claude" class="h-7 w-auto" />
                </div>
              </div>
            </div>
          </section>

          {/* Generator Form */}
          <section class="site-main--narrow pt-0 pb-16 text-center">
            <div class="card p-10 max-w-3xl mx-auto shadow-lg relative">
              {/* Decorative blob */}
              <div class="absolute -top-5 -left-5 -right-5 -bottom-5 bg-accent-bg-light rounded-[36px] -z-10" style="transform: rotate(-1deg);"></div>

              <div class="text-left mb-6">
                <label for="topic" class="form-label text-base">{dict.homeFormLabelTopic}</label>
                <input id="topic" type="text" placeholder={dict.homeFormPlaceholderTopic} class="input" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <label for="curriculum" class="form-label text-sm">{dict.homeFormLabelCurriculum}</label>
                  <input id="curriculum" type="text" placeholder={dict.homeFormPlaceholderCurriculum} class="input" style="padding: 10px 16px; font-size: 0.9rem;" />
                </div>
                <div>
                  <label for="yearLevel" class="form-label text-sm">{dict.homeFormLabelYearLevel}</label>
                  <input id="yearLevel" type="text" placeholder={dict.homeFormPlaceholderYearLevel} class="input" style="padding: 10px 16px; font-size: 0.9rem;" />
                </div>
              </div>

              <div id="payment-element" class="hidden animate-fade-in mb-6 text-left"></div>

              <button id="generate-btn" class="btn btn-primary btn-full btn-lg" data-state="generate">
                {dict.homeBtnGenerate}
              </button>

              <p class="text-xs mt-4 font-medium text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-1" style="vertical-align: middle;">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {dict.homeBadgeAligned}
              </p>

              <div id="status-container" class="hidden animate-fade-in mt-4">
                <div class="status-box">
                  <div class="spinner"></div>
                  <div class="text-left">
                    <p id="status-text" class="text-base font-semibold m-0">{dict.homeStatusGenerating}</p>
                    <p class="text-xs text-secondary m-0 mt-1">{dict.homeStatusTime}</p>
                  </div>
                </div>
              </div>

              <div id="error-message" class="hidden error-box mt-4 text-left"></div>
            </div>
          </section>

          {/* What's Included */}
          <section class="py-20 px-6 text-center">
            <div class="max-w-6xl mx-auto">
              <p class="font-heading text-sm font-bold text-accent uppercase tracking-widest mb-4">{dict.homeWhatsIncludedLabel}</p>
              <h2 class="font-accent text-3xl md:text-5xl font-normal mb-16">{dict.homeWhatsIncludedTitle}</h2>

              <div class="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                {[
                  { icon: "📊", title: dict.homeFeaturePresentationTitle, desc: dict.homeFeaturePresentationDesc },
                  { icon: "🎙️", title: dict.homeFeaturePodcastTitle, desc: dict.homeFeaturePodcastDesc },
                  { icon: "📝", title: dict.homeFeatureWorksheetTitle, desc: dict.homeFeatureWorksheetDesc },
                  { icon: "🎨", title: dict.homeFeatureImagesTitle, desc: dict.homeFeatureImagesDesc },
                ].map(item => (
                  <div key={item.title} class="card p-12 text-center flex-1 min-w-[240px] max-w-[300px]">
                    <div class="feature-icon">{item.icon}</div>
                    <h3 class="text-xl mb-3">{item.title}</h3>
                    <p class="text-secondary text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section class="py-20 px-6 text-center" style="background: rgba(255,255,255,0.4);">
            <div class="max-w-xl mx-auto">
              <p class="font-heading text-sm font-bold text-accent uppercase tracking-widest mb-4">{dict.homeFinalCtaLabel}</p>
              <h2 class="font-accent text-3xl md:text-5xl font-normal mb-6">{dict.homeFinalCtaTitle}</h2>
              <p class="text-lg leading-relaxed mb-12 text-secondary">
                {dict.homeFinalCtaSubtitle}
              </p>

              <a href="#topic" class="btn btn-primary btn-lg" style="padding: 1rem 3rem; font-size: 1.25rem;" onclick="document.getElementById('topic').focus(); return false;">
                {dict.homeFinalCtaBtn}
              </a>
              <p class="text-sm mt-6 text-muted">
                {dict.homeFooterTerms} <a href="https://jamespares.me/terms/" target="_blank" rel="noopener noreferrer" class="underline">{dict.homeFooterTermsLink}</a> {dict.homeFooterAnd} <a href="https://jamespares.me/privacy/" target="_blank" rel="noopener noreferrer" class="underline">{dict.homeFooterPrivacyLink}</a>.
              </p>
            </div>
          </section>
        </main>

        <Footer dict={dict} />
      </div>

      <script src="https://js.stripe.com/v3/"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
        const t = ${scriptDict};
        const stripe = Stripe('${stripeKey}');
        const generateBtn = document.getElementById('generate-btn');
        const statusContainer = document.getElementById('status-container');
        const paymentElementContainer = document.getElementById('payment-element');
        const topicInput = document.getElementById('topic');
        const curriculumInput = document.getElementById('curriculum');
        const yearLevelInput = document.getElementById('yearLevel');
        const errorMsg = document.getElementById('error-message');
        const user = ${JSON.stringify(user || null)};

        let elements;
        let currentTopic = '';
        let currentCurriculum = '';
        let currentYearLevel = '';

        async function startPaymentFlow(topic, curriculum, yearLevel) {
          currentTopic = topic;
          currentCurriculum = curriculum;
          currentYearLevel = yearLevel;
          generateBtn.disabled = true;
          generateBtn.innerText = t.preparing;
          errorMsg.classList.add('hidden');

          try {
            const res = await fetch('/api/payment/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic, curriculum, yearLevel })
            });

            if (res.status === 401) {
              sessionStorage.setItem('pendingTopic', topic);
              sessionStorage.setItem('pendingCurriculum', curriculum);
              sessionStorage.setItem('pendingYearLevel', yearLevel);
              window.location.href = '/login';
              return;
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: 'stripe' } });
            const paymentElement = elements.create('payment');
            paymentElement.mount('#payment-element');

            paymentElementContainer.classList.remove('hidden');
            generateBtn.innerText = t.completePayment;
            generateBtn.dataset.state = 'payment';
            generateBtn.disabled = false;
          } catch (err) {
            errorMsg.innerText = err.message || t.initPaymentError;
            errorMsg.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = t.generate;
            generateBtn.dataset.state = 'generate';
          }
        }

        generateBtn.addEventListener('click', async () => {
          const topic = topicInput.value.trim();
          const curriculum = curriculumInput.value.trim();
          const yearLevel = yearLevelInput.value.trim();

          if (!topic) return alert(t.alertEnterTopic);

          if (generateBtn.dataset.state === 'generate') {
            await startPaymentFlow(topic, curriculum, yearLevel);
          } else {
            generateBtn.disabled = true;
            generateBtn.innerText = t.processingPayment;
            errorMsg.classList.add('hidden');

            const returnUrl = new URL(window.location.origin + '?payment_success=true');
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('lang')) returnUrl.searchParams.set('lang', urlParams.get('lang'));

            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: { return_url: returnUrl.toString() },
              redirect: 'if_required'
            });

            if (error) {
              errorMsg.innerText = error.message;
              errorMsg.classList.remove('hidden');
              generateBtn.disabled = false;
              generateBtn.innerText = t.completePayment;
            } else {
              paymentElementContainer.classList.add('hidden');
              generateBtn.classList.add('hidden');
              statusContainer.classList.remove('hidden');
              startGeneration(currentTopic, currentCurriculum, currentYearLevel);
            }
          }
        });

        async function startGeneration(topic, curriculum, yearLevel) {
          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic, curriculum, yearLevel })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            window.location.href = '/dashboard?new_package=' + data.packageId;
          } catch (err) {
            errorMsg.innerText = err.message || t.generationError;
            errorMsg.classList.remove('hidden');
            statusContainer.classList.add('hidden');
            generateBtn.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = t.completePayment;
            generateBtn.dataset.state = 'payment';
          }
        }

        const pendingTopic = sessionStorage.getItem('pendingTopic');
        const pendingCurriculum = sessionStorage.getItem('pendingCurriculum');
        const pendingYearLevel = sessionStorage.getItem('pendingYearLevel');

        if (pendingTopic && user) {
          sessionStorage.removeItem('pendingTopic');
          sessionStorage.removeItem('pendingCurriculum');
          sessionStorage.removeItem('pendingYearLevel');
          topicInput.value = pendingTopic;
          curriculumInput.value = pendingCurriculum || '';
          yearLevelInput.value = pendingYearLevel || '';
          startPaymentFlow(pendingTopic, pendingCurriculum, pendingYearLevel);
        }
      `}} />
    </Layout>
  );
};
