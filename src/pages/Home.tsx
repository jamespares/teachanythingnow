/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Home: FC<{ user?: any; stripeKey: string }> = ({ user, stripeKey }) => {
  return (
    <Layout title="Create Lesson">
      <div class="page-wrapper">

        {/* ── Header ── */}
        <header class="site-header">
          <a href="/" class="brand">
            <img src="/logo.png" alt="Teach Anything Now" />
          </a>

          <nav class="site-nav">
            {user ? (
              <>
                <a href="/dashboard" class="text-sm" style="transition:color 0.2s; color:var(--text-secondary);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-secondary)'">My Packages</a>
                <button id="sign-out" class="text-sm btn btn-secondary" style="padding:0.4rem 0.9rem;">Sign out</button>
                <script type="module" dangerouslySetInnerHTML={{ __html: `
                  import { createAuthClient } from "https://esm.sh/better-auth/client";
                  const client = createAuthClient({ baseURL: window.location.origin });
                  document.getElementById('sign-out').addEventListener('click', async () => {
                    await client.signOut();
                    window.location.href = '/';
                  });
                `}} />
              </>
            ) : (
              <a href="/login" class="text-sm" style="transition:color 0.2s; color:var(--text-muted);" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">Sign in</a>
            )}
          </nav>
        </header>

        {/* ── Hero ── */}
        <main style="flex:1;">
          <section class="site-main--narrow" style="padding-top:4rem; padding-bottom:2rem; text-align:center;">
            <div class="hero-text">
              <h1 class="hero-title" style="font-size:clamp(2.5rem, 6vw, 4rem); margin-bottom:1.25rem;">
                Lesson materials,<br/>generated instantly.
              </h1>
              <p class="text-secondary" style="font-size:clamp(1.125rem, 2.5vw, 1.5rem); max-width:560px; margin:0 auto; line-height:1.6;">
                Type any topic. Pay £1. Get a complete teaching package — presentation, podcast, worksheet, and AI images — in under 60 seconds.
              </p>
            </div>
          </section>

          {/* ── Generator Form ── */}
          <section class="site-main--narrow" style="padding-top:0; padding-bottom:4rem; text-align:center;">
            <div class="card card-body" style="max-width:640px; margin:0 auto;">
              <div class="form-group">
                <label for="topic" class="form-label">What do you want to teach?</label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Photosynthesis, The French Revolution, Python Basics"
                  class="input input-lg"
                  required
                />
              </div>

              <div id="payment-element" class="hidden animate-fade-in" style="margin-bottom:1.5rem;"></div>

              <button id="generate-btn" class="btn btn-primary btn-full btn-lg">
                Generate Package for £1.00
              </button>

              <div id="status-container" class="hidden animate-fade-in" style="margin-top:1rem;">
                <div class="status-box">
                  <div class="spinner"></div>
                  <div>
                    <p id="status-text" style="font-size:0.875rem;font-weight:500;margin:0; color:var(--text-primary);">Generating your content...</p>
                    <p class="text-muted text-xs" style="margin:0.25rem 0 0;">This usually takes about 60 seconds.</p>
                  </div>
                </div>
              </div>

              <div id="error-message" class="hidden error-box" style="margin-top:1rem;"></div>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section style="background:#f3f4f6; padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:600; color:var(--primary); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:1rem;">How It Works</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:3.5rem;">Three steps to your lesson</h2>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:2rem; max-width:900px; margin:0 auto;">
                {[
                  { num: "01", title: "Type your topic", desc: "Enter any subject — from Ancient Rome to Quantum Physics." },
                  { num: "02", title: "Pay £1", desc: "One simple payment. No subscriptions, no hidden fees." },
                  { num: "03", title: "Download everything", desc: "Get your full package in under a minute. Ready to teach." },
                ].map(step => (
                  <div key={step.num} style="text-align:center; padding:2rem;">
                    <div style="font-family:var(--font-heading); font-size:3rem; font-weight:700; color:var(--primary); opacity:0.25; line-height:1; margin-bottom:1rem;">{step.num}</div>
                    <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:var(--text-primary);">{step.title}</h3>
                    <p class="text-secondary" style="font-size:0.9375rem; line-height:1.6; margin:0;">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Proof / Sample Gallery ── */}
          <section style="background:var(--background); padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:600; color:var(--primary); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:1rem;">See What You Get</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:1rem; color:var(--text-primary);">Real output, real quality</h2>
              <p class="text-secondary" style="font-size:1.0625rem; max-width:560px; margin:0 auto 3.5rem; line-height:1.6;">Every lesson package includes four professionally formatted resources. Here's a sample generated for "The Solar System."</p>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; max-width:1200px; margin:0 auto;">
                {[
                  { src: "/samples/ppt-screenshot.png", label: "PowerPoint Presentation", ext: ".pptx", desc: "Full-slide deck with speaker notes, ready to present." },
                  { src: "/samples/worksheet-screenshot.png", label: "Student Worksheet", ext: ".docx", desc: "Print-ready exercises with clear instructions." },
                  { src: "/samples/answer-key-screenshot.png", label: "Answer Key", ext: ".docx", desc: "Complete solutions for every question." },
                  { src: "/samples/image-sample.png", label: "AI Images", ext: ".png", desc: "Custom illustrations to support your lesson." },
                ].map(item => (
                  <div key={item.label} class="card" style="overflow:hidden; transition:border-color 0.2s, transform 0.2s, box-shadow 0.2s;" onmouseenter="this.style.borderColor='var(--primary)'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.1)';" onmouseleave="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-md)';">
                    <div style="aspect-ratio:16/10; overflow:hidden; background:#f8f9fa;">
                      <img
                        src={item.src}
                        alt={item.label}
                        style="width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.4s;"
                        onmouseenter="this.style.transform='scale(1.03)';"
                        onmouseleave="this.style.transform='scale(1)';"
                        loading="lazy"
                      />
                    </div>
                    <div style="padding:1.5rem; text-align:left;">
                      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                        <h3 style="font-size:1.0625rem; margin:0; color:var(--text-primary);">{item.label}</h3>
                        <span style="font-family:var(--font-heading); font-size:0.75rem; font-weight:600; color:var(--primary); background:rgba(0,107,84,0.08); padding:0.25rem 0.625rem; border-radius:999px;">{item.ext}</span>
                      </div>
                      <p class="text-secondary" style="font-size:0.875rem; margin:0; line-height:1.5;">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style="text-align:center; margin-top:3rem;">
                <a href="#topic" class="btn btn-primary btn-lg" style="padding:1rem 2.5rem;" onclick="document.getElementById('topic').focus(); return false;">
                  Generate your first lesson →
                </a>
              </div>
            </div>
          </section>

          {/* ── What's Included ── */}
          <section style="background:#f3f4f6; padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:600; color:var(--primary); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:1rem;">What's Included</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:3.5rem; color:var(--text-primary);">Everything you need to teach</h2>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.5rem; max-width:1000px; margin:0 auto;">
                {[
                  { icon: "📊", title: "Presentation", desc: "A complete slide deck with engaging visuals and speaker notes. Export as PPTX." },
                  { icon: "🎙️", title: "Podcast Audio", desc: "A narrated lesson students can listen to anywhere. Export as MP3." },
                  { icon: "📝", title: "Worksheet", desc: "Structured exercises that reinforce key concepts. Export as DOCX." },
                  { icon: "🎨", title: "AI Images", desc: "Custom illustrations generated for your exact topic. Export as PNG." },
                ].map(item => (
                  <div key={item.title} class="card" style="padding:2rem; text-align:center; transition:border-color 0.2s, box-shadow 0.2s;" onmouseenter="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.06)';" onmouseleave="this.style.borderColor='var(--border)'; this.style.boxShadow='var(--shadow-md)';">
                    <div style="font-size:2.5rem; margin-bottom:1rem;">{item.icon}</div>
                    <h3 style="font-size:1.125rem; margin-bottom:0.5rem; color:var(--text-primary);">{item.title}</h3>
                    <p class="text-secondary" style="font-size:0.875rem; line-height:1.6; margin:0;">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Pricing / Final CTA ── */}
          <section style="background:var(--background); padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:560px; margin:0 auto; text-align:center;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:600; color:var(--primary); text-transform:uppercase; letter-spacing:0.15em; margin-bottom:1rem;">Pricing</p>
              <h2 style="font-size:clamp(2rem, 5vw, 3rem); margin-bottom:1rem; color:var(--text-primary);">One pound. One lesson.</h2>
              <p class="text-secondary" style="font-size:1.125rem; line-height:1.6; margin-bottom:2.5rem;">
                No subscriptions. No credits. Just pay £1 when you need a lesson, and get four professional teaching resources back.
              </p>

              <div class="card" style="padding:2.5rem; margin-bottom:2rem; border:2px solid var(--primary);">
                <div style="font-family:var(--font-heading); font-size:4rem; font-weight:700; color:var(--primary); line-height:1;">£1</div>
                <div style="font-size:1rem; color:var(--text-secondary); margin-top:0.5rem;">per lesson package</div>
                <div style="margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--border);">
                  <ul style="list-style:none; padding:0; margin:0; text-align:left; display:inline-block;">
                    {[
                      "✓ PowerPoint presentation",
                      "✓ Podcast audio (MP3)",
                      "✓ Student worksheet (DOCX)",
                      "✓ AI-generated images",
                      "✓ Ready in ~60 seconds",
                    ].map(item => (
                      <li key={item} class="text-secondary" style="padding:0.35rem 0; font-size:0.9375rem;">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <a href="#topic" class="btn btn-primary btn-lg" style="padding:1rem 2.5rem; font-size:1.125rem;" onclick="document.getElementById('topic').focus(); return false;">
                Get started — £1
              </a>
              <p class="text-muted text-xs" style="margin-top:1rem;">No account required to try. Sign in when you're ready to download.</p>
              <p class="text-muted text-xs" style="margin-top:0.5rem;">
                By using this service, you agree to our <a href="/terms" style="color:var(--text-muted); text-decoration:underline;">Terms of Service</a>.
              </p>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer style="border-top:1px solid var(--border); padding:2rem 1.5rem; text-align:center;">
          <p class="text-muted text-xs" style="margin:0;">
            © {new Date().getFullYear()} Teach Anything Now. Built for educators.
          </p>
        </footer>
      </div>

      <script src="https://js.stripe.com/v3/"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        const stripe = Stripe('${stripeKey}');
        const generateBtn = document.getElementById('generate-btn');
        const statusContainer = document.getElementById('status-container');
        const paymentElementContainer = document.getElementById('payment-element');
        const topicInput = document.getElementById('topic');
        const errorMsg = document.getElementById('error-message');
        const user = ${JSON.stringify(user || null)};

        let elements;
        let currentTopic = '';

        async function startPaymentFlow(topic) {
          currentTopic = topic;
          generateBtn.disabled = true;
          generateBtn.innerText = 'Preparing...';
          errorMsg.classList.add('hidden');

          try {
            const res = await fetch('/api/payment/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic })
            });

            if (res.status === 401) {
              sessionStorage.setItem('pendingTopic', topic);
              window.location.href = '/login';
              return;
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            elements = stripe.elements({ clientSecret: data.clientSecret, appearance: { theme: 'stripe' } });
            const paymentElement = elements.create('payment');
            paymentElement.mount('#payment-element');

            paymentElementContainer.classList.remove('hidden');
            generateBtn.innerText = 'Pay £1.00';
            generateBtn.disabled = false;
          } catch (err) {
            errorMsg.innerText = err.message || 'Failed to initialize payment';
            errorMsg.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = 'Generate Package for £1.00';
          }
        }

        generateBtn.addEventListener('click', async () => {
          const topic = topicInput.value.trim();
          if (!topic) return alert('Please enter a topic');

          if (generateBtn.innerText.includes('Generate')) {
            await startPaymentFlow(topic);
          } else {
            generateBtn.disabled = true;
            generateBtn.innerText = 'Processing Payment...';
            errorMsg.classList.add('hidden');

            const { error } = await stripe.confirmPayment({
              elements,
              confirmParams: {
                return_url: window.location.origin + '?payment_success=true',
              },
              redirect: 'if_required'
            });

            if (error) {
              errorMsg.innerText = error.message;
              errorMsg.classList.remove('hidden');
              generateBtn.disabled = false;
              generateBtn.innerText = 'Pay £1.00';
            } else {
              paymentElementContainer.classList.add('hidden');
              generateBtn.classList.add('hidden');
              statusContainer.classList.remove('hidden');
              startGeneration(currentTopic);
            }
          }
        });

        async function startGeneration(topic) {
          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            window.location.href = '/dashboard?new_package=' + data.packageId;
          } catch (err) {
            errorMsg.innerText = err.message || 'Generation failed. Please contact support.';
            errorMsg.classList.remove('hidden');
            statusContainer.classList.add('hidden');
            generateBtn.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = 'Pay £1.00';
          }
        }

        const pendingTopic = sessionStorage.getItem('pendingTopic');
        if (pendingTopic && user) {
          sessionStorage.removeItem('pendingTopic');
          topicInput.value = pendingTopic;
          startPaymentFlow(pendingTopic);
        }
      `}} />
    </Layout>
  );
};
