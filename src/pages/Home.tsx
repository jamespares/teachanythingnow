/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "../components/Layout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Home: FC<{ user?: any }> = ({ user }) => {
  const scriptDict = JSON.stringify({
    generating: "Generating your lesson package...",
    generationError: "Generation failed. Please try again.",
    alertEnterTopic: "Please enter a topic",
    generate: "Generate Package — Free",
  });

  return (
    <Layout title="Create Lesson">
      <div class="min-h-screen flex flex-col">
        <Navbar user={user} />

        <main class="flex-1">
          {/* Hero */}
          <section class="site-main--narrow pt-20 pb-12 text-center">
            <div class="animate-fade-in">
              <h1 class="font-accent hero-h1 leading-tight mb-6" style="color: var(--base-text);">
                Covering a lesson?
              </h1>
              <p class="font-accent hero-line1 mb-10" style="color: var(--base-text);">
                Had a busy weekend and no time to plan?
              </p>
              <p class="font-accent hero-line2 leading-tight mb-12" style="color: var(--accent);">
                <span class="inline-flex items-center gap-4">
                  No problem.
                  <svg viewBox="0 0 200 20" preserveAspectRatio="none" style="width: 140px; height: 14px; flex-shrink: 0;">
                    <path d="M0,15 Q60,2 120,12 T200,8" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" />
                  </svg>
                </span>
              </p>
              <p class="font-body hero-desc max-w-2xl mx-auto leading-relaxed text-secondary">
                Type any topic. Get a complete, multi-media lesson package — presentation, podcast audio file, worksheet, and AI images — all aligned. Completely free. Ready when you are!
              </p>
            </div>
          </section>

          {/* Generator Form */}
          <section class="site-main--narrow pt-0 pb-16 text-center">
            <div class="card p-10 max-w-3xl mx-auto shadow-lg relative">
              {/* Decorative blob */}
              <div class="card-blob"></div>

              <div class="text-left mb-6">
                <label for="topic" class="form-label text-base">What do you want to teach?</label>
                <input id="topic" type="text" placeholder="e.g., Photosynthesis, The French Revolution, Python" class="input" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <label for="curriculum" class="form-label text-sm">Curriculum (Optional)</label>
                  <input id="curriculum" type="text" placeholder="e.g., IB, IGCSE, US K-12" class="input input-compact" />
                </div>
                <div>
                  <label for="yearLevel" class="form-label text-sm">Year Level</label>
                  <input id="yearLevel" type="text" placeholder="e.g., Year 9, Grade 5" class="input input-compact" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <label for="duration" class="form-label text-sm">Lesson Duration</label>
                  <select id="duration" class="input input-compact">
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="60 min" selected>60 min</option>
                    <option value="90 min">90 min</option>
                  </select>
                </div>
                <div>
                  <label for="objectives" class="form-label text-sm">Lesson Objectives</label>
                  <textarea id="objectives" placeholder="e.g., Students will understand the causes of the French Revolution and be able to evaluate primary sources." class="input input-compact"></textarea>
                </div>
              </div>

              <button id="generate-btn" class="btn btn-primary btn-full btn-lg">
                Generate Package — Free
              </button>

              <p class="text-xs mt-4 font-medium text-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="inline mr-1" style="vertical-align: middle;">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                5 free lesson packages per day · No payment, no card required
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
                  { icon: "📊", title: "Presentation", desc: "A complete slide deck with engaging visuals and speaker notes. Export as PPTX. Use this to introduce concepts to the whole class — work through examples together and use speaker notes for guidance." },
                  { icon: "🎙️", title: "Podcast Audio", desc: "A narrated lesson students can listen to anywhere. Export as MP3. Play at the start of the lesson to spark discussion, or let students listen independently to reinforce what they've learned." },
                  { icon: "📝", title: "Worksheet", desc: "Structured exercises that reinforce key concepts. Export as DOCX. Distribute after the presentation to test understanding. Use as formative assessment, homework, or a peer-review activity." },
                  { icon: "🎨", title: "AI Images", desc: "Custom illustrations generated for your exact topic. Export as PNG. Use these as a provocation to start the lesson, to spark curiosity, or as visual anchors on a classroom display." },
                ].map(item => (
                  <div key={item.title} class="card p-10 text-center feature-card">
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
                Free to use. No subscriptions. No credits. Just enter a topic and get four professional teaching resources back in seconds.
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

      <script dangerouslySetInnerHTML={{
        __html: `
        const t = ${scriptDict};
        const generateBtn = document.getElementById('generate-btn');
        const statusContainer = document.getElementById('status-container');
        const topicInput = document.getElementById('topic');
        const curriculumInput = document.getElementById('curriculum');
        const yearLevelInput = document.getElementById('yearLevel');
        const durationInput = document.getElementById('duration');
        const objectivesInput = document.getElementById('objectives');
        const errorMsg = document.getElementById('error-message');
        const user = ${JSON.stringify(user || null)};

        async function startGeneration(topic, curriculum, yearLevel, duration, objectives) {
          generateBtn.disabled = true;
          generateBtn.innerText = t.generating;
          errorMsg.classList.add('hidden');
          statusContainer.classList.remove('hidden');

          try {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ topic, curriculum, yearLevel, duration, objectives })
            });

            if (res.status === 401) {
              sessionStorage.setItem('pendingTopic', topic);
              sessionStorage.setItem('pendingCurriculum', curriculum);
              sessionStorage.setItem('pendingYearLevel', yearLevel);
              sessionStorage.setItem('pendingDuration', duration);
              sessionStorage.setItem('pendingObjectives', objectives);
              window.location.href = '/login';
              return;
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);
            window.location.href = '/dashboard?new_package=' + data.packageId;
          } catch (err) {
            errorMsg.innerText = err.message || t.generationError;
            errorMsg.classList.remove('hidden');
            statusContainer.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.innerText = t.generate;
          }
        }

        generateBtn.addEventListener('click', async () => {
          const topic = topicInput.value.trim();
          const curriculum = curriculumInput.value.trim();
          const yearLevel = yearLevelInput.value.trim();
          const duration = durationInput.value;
          const objectives = objectivesInput.value.trim();

          if (!topic) return alert(t.alertEnterTopic);

          await startGeneration(topic, curriculum, yearLevel, duration, objectives);
        });

        const pendingTopic = sessionStorage.getItem('pendingTopic');
        const pendingCurriculum = sessionStorage.getItem('pendingCurriculum');
        const pendingYearLevel = sessionStorage.getItem('pendingYearLevel');
        const pendingDuration = sessionStorage.getItem('pendingDuration');
        const pendingObjectives = sessionStorage.getItem('pendingObjectives');

        if (pendingTopic && user) {
          sessionStorage.removeItem('pendingTopic');
          sessionStorage.removeItem('pendingCurriculum');
          sessionStorage.removeItem('pendingYearLevel');
          sessionStorage.removeItem('pendingDuration');
          sessionStorage.removeItem('pendingObjectives');
          topicInput.value = pendingTopic;
          curriculumInput.value = pendingCurriculum || '';
          yearLevelInput.value = pendingYearLevel || '';
          durationInput.value = pendingDuration || '60 min';
          objectivesInput.value = pendingObjectives || '';
          startGeneration(pendingTopic, pendingCurriculum, pendingYearLevel, pendingDuration, pendingObjectives);
        }
      `}} />
    </Layout>
  );
};
