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
                <a href="/dashboard" class="text-sm" style="transition:color 0.2s; color:#ffffff;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#ffffff'">My Packages</a>
                <button id="sign-out" class="text-sm btn btn-secondary" style="padding:0.4rem 0.9rem; color:#ffffff; border-color:rgba(255,255,255,0.35);">Sign out</button>
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
              <a href="/login" class="btn" style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.4); color:#ffffff; font-size:1rem; padding:0.6rem 1.25rem; border-radius:0.5rem; backdrop-filter:blur(4px); transition:all 0.2s;" onmouseenter="this.style.background='rgba(255,255,255,0.3)'; this.style.borderColor='rgba(255,255,255,0.6)';" onmouseleave="this.style.background='rgba(255,255,255,0.15)'; this.style.borderColor='rgba(255,255,255,0.4)';">Sign in</a>
            )}
          </nav>
        </header>

        {/* ── Hero ── */}
        <main style="flex:1;">
          <section class="site-main--narrow" style="padding-top:4rem; padding-bottom:2rem; text-align:center;">
            <div class="hero-text">
              <h1 class="hero-title" style="font-size:clamp(2.5rem, 6vw, 4rem); margin-bottom:1.25rem; color:#ffffff;">
                Lesson materials,<br/>generated instantly.
              </h1>
              <p style="font-size:clamp(1.125rem, 2.5vw, 1.5rem); max-width:560px; margin:0 auto; line-height:1.6; color:#ffffff;">
                Type any topic. Get a complete teaching package — presentation, podcast, worksheet, and AI images — in under 60 seconds.
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
                Generate Package
              </button>

              <div id="status-container" class="hidden animate-fade-in" style="margin-top:1rem;">
                <div class="status-box">
                  <div class="spinner"></div>
                  <div>
                    <p id="status-text" style="font-size:0.875rem;font-weight:500;margin:0; color:var(--text-primary);">Generating your content...</p>
                    <p class="text-xs" style="margin:0.25rem 0 0; color:var(--text-primary);">This usually takes about 60 seconds.</p>
                  </div>
                </div>
              </div>

              <div id="error-message" class="hidden error-box" style="margin-top:1rem;"></div>
            </div>
          </section>

          {/* ── How It Works ── */}
          <section style="background:rgba(0,0,0,0.35); padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:400; color:#4ade80; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem;">How It Works</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:3.5rem; color:#ffffff;">Three steps to your lesson</h2>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:2rem; max-width:900px; margin:0 auto;">
                {[
                  { num: "01", title: "Type your topic", desc: "Enter any subject — from Ancient Rome to Quantum Physics." },
                  { num: "02", title: "Generate", desc: "Our AI builds your complete teaching package in under 60 seconds." },
                  { num: "03", title: "Download everything", desc: "Get your full package in under a minute. Ready to teach." },
                ].map(step => (
                  <div key={step.num} style="text-align:center; padding:2rem;">
                    <div style="font-family:var(--font-heading); font-size:3rem; font-weight:400; color:#ffffff; line-height:1; margin-bottom:1rem;">{step.num}</div>
                    <h3 style="font-size:1.25rem; margin-bottom:0.5rem; color:#ffffff;">{step.title}</h3>
                    <p style="font-size:0.9375rem; line-height:1.6; margin:0; color:#ffffff;">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Proof / Sample Gallery ── */}
          <section style="padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:400; color:#4ade80; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem;">See What You Get</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:1rem; color:#ffffff;">Real output, real quality</h2>
              <p style="font-size:1.0625rem; max-width:560px; margin:0 auto 3.5rem; line-height:1.6; color:#ffffff;">Every lesson package includes four professionally formatted resources. Here's a sample generated for "Photosynthesis."</p>

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
                        <span style="font-family:var(--font-heading); font-size:0.75rem; font-weight:400; color:var(--primary); background:rgba(0,107,84,0.08); padding:0.25rem 0.625rem; border-radius:999px;">{item.ext}</span>
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
          <section style="background:rgba(0,0,0,0.35); padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:var(--max-width); margin:0 auto;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:400; color:#4ade80; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem;">What's Included</p>
              <h2 style="font-size:clamp(1.75rem, 4vw, 2.5rem); margin-bottom:3.5rem; color:#ffffff;">Everything you need to teach</h2>

              <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:1.5rem; max-width:1000px; margin:0 auto;">
                {[
                  { icon: "📊", title: "Presentation", desc: "A complete slide deck with engaging visuals and speaker notes. Export as PPTX." },
                  { icon: "🎙️", title: "Podcast Audio", desc: "A narrated lesson students can listen to anywhere. Export as MP3." },
                  { icon: "📝", title: "Worksheet", desc: "Structured exercises that reinforce key concepts. Export as DOCX." },
                  { icon: "🎨", title: "AI Images", desc: "Custom illustrations generated for your exact topic. Export as PNG." },
                ].map(item => (
                  <div key={item.title} class="card" style="padding:2rem; text-align:center; flex:1 1 240px; max-width:280px; transition:border-color 0.2s, box-shadow 0.2s;" onmouseenter="this.style.borderColor='var(--primary)'; this.style.boxShadow='0 8px 16px rgba(0,0,0,0.06)';" onmouseleave="this.style.borderColor='var(--border)'; this.style.boxShadow='var(--shadow-md)';">
                    <div style="font-size:2.5rem; margin-bottom:1rem;">{item.icon}</div>
                    <h3 style="font-size:1.125rem; margin-bottom:0.5rem; color:var(--text-primary);">{item.title}</h3>
                    <p class="text-secondary" style="font-size:0.875rem; line-height:1.6; margin:0;">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section style="padding:5rem 1.5rem; text-align:center;">
            <div style="max-width:560px; margin:0 auto; text-align:center;">
              <p style="font-family:var(--font-heading); font-size:0.875rem; font-weight:400; color:#4ade80; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:1rem;">Get Started</p>
              <h2 style="font-size:clamp(2rem, 5vw, 3rem); margin-bottom:1rem; color:#ffffff;">Ready when you are.</h2>
              <p style="font-size:1.125rem; line-height:1.6; margin-bottom:2.5rem; color:#ffffff;">
                No subscriptions. No credits. Just enter a topic and get four professional teaching resources back in seconds.
              </p>

              <a href="#topic" class="btn btn-primary btn-lg" style="padding:1rem 2.5rem; font-size:1.125rem;" onclick="document.getElementById('topic').focus(); return false;">
                Generate your first lesson →
              </a>
              <p class="text-xs" style="margin-top:1rem; color:#ffffff;">
                By using this service, you agree to our <a href="/terms" style="color:#ffffff; text-decoration:underline;">Terms of Service</a>.
              </p>
            </div>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer style="border-top:1px solid rgba(255,255,255,0.15); padding:2.5rem 1.5rem; text-align:center;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.75rem;">
            <p style="font-family:var(--font-heading); font-size:1rem; font-weight:400; color:#ffffff; margin:0;"
              Built by James Pares
            </p>
            <div style="display:flex; align-items:center; gap:1rem;">
              <a href="https://www.linkedin.com/in/james-p-ba7653207/" target="_blank" rel="noopener noreferrer" style="color:#ffffff; opacity:0.7; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://x.com/jamespareslfg" target="_blank" rel="noopener noreferrer" style="color:#ffffff; opacity:0.7; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'" aria-label="X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://github.com/jamespares" target="_blank" rel="noopener noreferrer" style="color:#ffffff; opacity:0.7; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
            </div>
            <a href="https://jamespares.me" target="_blank" rel="noopener noreferrer" style="font-size:0.8125rem; color:#ffffff; opacity:0.7; text-decoration:none; transition:opacity 0.2s;" onmouseenter="this.style.opacity='1'" onmouseleave="this.style.opacity='0.7'">jamespares.me</a>
            <p class="text-xs" style="margin:0; color:#ffffff; opacity:0.6;">
              All profits go to putting food on the table for me and my family x
            </p>
          </div>
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
            generateBtn.innerText = 'Complete Payment';
            generateBtn.disabled = false;
          } catch (err) {
            errorMsg.innerText = err.message || 'Failed to initialize payment';
            errorMsg.classList.remove('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = 'Generate Package';
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
              generateBtn.innerText = 'Complete Payment';
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
            generateBtn.innerText = 'Complete Payment';
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
