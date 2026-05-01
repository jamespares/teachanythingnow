/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Home: FC<{ user?: any; stripeKey: string }> = ({ user, stripeKey }) => {
  const scriptDict = JSON.stringify({
    preparing: "Preparing...",
    completePayment: "Complete Payment",
    initPaymentError: "Failed to initialize payment",
    alertEnterTopic: "Please enter a topic",
    processingPayment: "Processing Payment...",
    generationError: "Generation failed. Please contact support.",
    generate: "Generate Package",
  });

  return (
    <Layout title="Create Lesson">
      <div class="min-h-screen flex flex-col">
        <Navbar user={user} />

        <main class="flex-1">
          {/* Hero */}
          <section class="site-main--narrow pt-20 pb-12 text-center">
            <div class="animate-fade-in">
              <h1 class="font-accent text-7xl md:text-9xl lg:text-[10rem] leading-tight mb-6" style="color: var(--base-text);">
                Covering a last-minute lesson?
              </h1>
              <p class="font-accent text-4xl md:text-5xl lg:text-6xl mb-10" style="color: var(--base-text);">
                Had a busy weekend and no time to plan?
              </p>
              <p class="font-accent text-3xl md:text-4xl lg:text-5xl leading-tight mb-12" style="color: var(--accent);">
                <span class="inline-flex items-center gap-4">
                  No problem.
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" style="width: 180px; height: 18px; flex-shrink: 0;">
                    <path d="M0,15 Q60,2 120,12 T200,8" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" />
                  </svg>
                </span>
              </p>
              <p class="font-body text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-secondary">
                Type any topic. Get a complete, multi-media lesson package — presentation, podcast audio file, worksheet, and AI images — all aligned. Ready when you are!
              </p>
            </div>
          </section>

          {/* Generator Form */}
          <section class="site-main--narrow pt-0 pb-16 text-center">
            <div class="card p-10 max-w-3xl mx-auto shadow-lg relative">
              {/* Decorative blob */}
              <div class="absolute -top-5 -left-5 -right-5 -bottom-5 bg-accent-bg-light rounded-[36px] -z-10" style="transform: rotate(-1deg);"></div>

              <div class="text-left mb-6">
                <label for="topic" class="form-label text-base">What do you want to teach?</label>
                <input id="topic" type="text" placeholder="e.g., Photosynthesis, The French Revolution, Python" class="input" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <label for="curriculum" class="form-label text-sm">Curriculum (Optional)</label>
                  <input id="curriculum" type="text" placeholder="e.g., IB, IGCSE, US K-12" class="input" style="padding: 10px 16px; font-size: 0.9rem;" />
                </div>
                <div>
                  <label for="yearLevel" class="form-label text-sm">Year Level</label>
                  <input id="yearLevel" type="text" placeholder="e.g., Year 9, Grade 5" class="input" style="padding: 10px 16px; font-size: 0.9rem;" />
                </div>
              </div>

              <div id="payment-element" class="hidden animate-fade-in mb-6 text-left"></div>

              <button id="generate-btn" class="btn btn-primary btn-full btn-lg" data-state="generate">
                Generate Package
              </button>

              <p class="text-xs mt-4 font-medium text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-1" style="vertical-align: middle;">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Lesson materials aligned with research-backed learning standards
              </p>

              <div id="status-container" class="hidden animate-fade-in mt-4">
                <div class="status-box">
                  <div class="spinner"></div>
                  <div class="text-left">
                    <p id="status-text" class="text-base font-semibold m-0">Generating your content...</p>
                    <p class="text-xs text-secondary m-0 mt-1">This usually takes about 60 seconds.</p>
                  </div>
                </div>
              </div>

              <div id="error-message" class="hidden error-box mt-4 text-left"></div>
            </div>
          </section>

          {/* What's Included */}
          <section class="py-20 px-6 text-center">
            <div class="max-w-6xl mx-auto">
              <p class="font-heading text-sm font-bold text-accent uppercase tracking-widest mb-4">What's Included</p>
              <h2 class="font-accent text-3xl md:text-5xl font-normal mb-16">Everything you need to teach</h2>

              <div class="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
                {[
                  { icon: "📊", title: "Presentation", desc: "A complete slide deck with engaging visuals and speaker notes. Export as PPTX." },
                  { icon: "🎙️", title: "Podcast Audio", desc: "A narrated lesson students can listen to anywhere. Export as MP3." },
                  { icon: "📝", title: "Worksheet", desc: "Structured exercises that reinforce key concepts. Export as DOCX." },
                  { icon: "🎨", title: "AI Images", desc: "Custom illustrations generated for your exact topic. Export as PNG." },
                ].map(item => (
                  <div key={item.title} class="card p-16 text-center flex-1 min-w-[300px] max-w-[380px]">
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
              <p class="font-heading text-sm font-bold text-accent uppercase tracking-widest mb-4">Get Started</p>
              <h2 class="font-accent text-3xl md:text-5xl font-normal mb-6">Ready when you are.</h2>
              <p class="text-lg leading-relaxed mb-12 text-secondary">
                No subscriptions. No credits. Just enter a topic and get four professional teaching resources back in seconds.
              </p>

              <a href="#topic" class="btn btn-primary btn-lg" style="padding: 1rem 3rem; font-size: 1.25rem;" onclick="document.getElementById('topic').focus(); return false;">
                Generate your first lesson →
              </a>
              <p class="text-sm mt-6 text-muted">
                By using this service, you agree to the <a href="https://jamespares.me/terms/" target="_blank" rel="noopener noreferrer" class="underline">Terms of Service</a> and <a href="https://jamespares.me/privacy/" target="_blank" rel="noopener noreferrer" class="underline">Privacy Policy</a>.
              </p>
            </div>
          </section>
        </main>

        <Footer />
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
