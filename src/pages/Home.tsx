/** @jsxImportSource hono/jsx */
import { FC } from "hono/jsx";
import { Layout } from "./Layout";

export const Home: FC<{ user?: any; stripeKey: string }> = ({ user, stripeKey }) => {
  return (
    <Layout title="Create Lesson">
      <div className="min-h-screen">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Teach Anything Now</h1>
            <svg className="w-5 h-5 text-[var(--primary)]" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <span className="text-sm text-[var(--text-secondary)] hidden sm:block">{user.email}</span>
                <a href="/dashboard" className="text-sm hover:text-[var(--primary)] transition-colors">My Packages</a>
                <button id="sign-out" className="text-sm hover:text-[var(--primary)] transition-colors">Sign out</button>
              </>
            ) : (
              <a href="/login" className="btn btn-primary text-sm">Sign in</a>
            )}
          </nav>
        </header>

        {/* Hero / Input Section */}
        <main className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              Create complete lesson materials <br/> in seconds.
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Enter any topic and get a presentation, podcast, worksheet, and images.
            </p>
          </div>

          <div className="card p-8 shadow-2xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-semibold mb-2 ml-1">
                  Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  placeholder="e.g., Photosynthesis, The French Revolution, Python Basics"
                  className="input text-lg"
                  required
                />
              </div>

              <div id="payment-element" className="hidden animate-fade-in">
                {/* Stripe Payment Element will be mounted here */}
              </div>

              <button id="generate-btn" className="btn btn-primary w-full text-lg h-14">
                Generate Package for £1.00
              </button>
              
              <div id="status-container" className="hidden space-y-4 pt-2">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-[var(--border)]">
                  <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p id="status-text" className="text-sm font-medium">Generating your content...</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">This usually takes about 60 seconds.</p>
                  </div>
                </div>
              </div>

              <div id="error-message" className="hidden p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                {/* Error messages will be shown here */}
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            {[
              { label: "PPTX Presentation", icon: "📊" },
              { label: "MP3 Podcast", icon: "🎙️" },
              { label: "DOCX Worksheet", icon: "📝" },
              { label: "AI Images", icon: "🎨" },
            ].map(item => (
              <div key={item.label} className="flex flex-col items-center p-4 rounded-xl border border-[var(--border)] bg-white/5">
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{item.label}</span>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Script for Auth & Stripe */}
      <script src="https://js.stripe.com/v3/"></script>
      <script dangerouslySetInnerHTML={{ __html: `
        const stripe = Stripe('${stripeKey}');
        const generateBtn = document.getElementById('generate-btn');
        const statusContainer = document.getElementById('status-container');
        const paymentElementContainer = document.getElementById('payment-element');
        const topicInput = document.getElementById('topic');
        const errorMsg = document.getElementById('error-message');

        let elements;

        generateBtn.addEventListener('click', async () => {
          const topic = topicInput.value.trim();
          if (!topic) return alert('Please enter a topic');

          if (generateBtn.innerText.includes('Generate')) {
            generateBtn.disabled = true;
            generateBtn.innerText = 'Preparing...';
            
            try {
              const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
              });
              
              const { clientSecret, paymentIntentId } = await res.json();
              
              elements = stripe.elements({ clientSecret, appearance: { theme: 'night' } });
              const paymentElement = elements.create('payment');
              paymentElement.mount('#payment-element');
              
              paymentElementContainer.classList.remove('hidden');
              generateBtn.innerText = 'Pay £1.00';
              generateBtn.disabled = false;
            } catch (err) {
              alert('Failed to initialize payment');
              generateBtn.disabled = false;
              generateBtn.innerText = 'Generate Package for £1.00';
            }
          } else {
            // Confirm payment
            generateBtn.disabled = true;
            generateBtn.innerText = 'Processing Payment...';
            
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
            } else {
              // Start generation
              paymentElementContainer.classList.add('hidden');
              generateBtn.classList.add('hidden');
              statusContainer.classList.remove('hidden');
              startGeneration(topic);
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
          }
        }
      `}} />
    </Layout>
  );
};
