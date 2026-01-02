export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 font-handwritten">Privacy Policy</h1>
      
      <div className="prose prose-green max-w-none text-gray-700">
        <p className="lead text-xl text-gray-600 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Information We Collect</h2>
          <p>We collect information to provide and improve our service:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Personal Information:</strong> Email address (when you sign up or pay).</li>
            <li><strong>Usage Data:</strong> Topics you enter for generation, feedback you submit, and interaction logs.</li>
            <li><strong>Payment Information:</strong> Processed securely by Stripe. We do not store your full credit card number.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide the AI generation service (creating slides, audio, etc.).</li>
            <li>To process payments and prevent fraud.</li>
            <li>To communicate with you about your account or generated files.</li>
            <li>To improve our AI models and user experience.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. AI Processing</h2>
          <p>
            When you use our tool, the topics and content you input are sent to third-party AI providers (such as OpenAI and Google) 
            to generate the materials. These providers are not permitted to use your personal data for training their models in a way that identifies you, 
            but your input text is processed by their systems.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We only share data with:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>Service Providers:</strong> Hosting (Vercel/Railway), Database (Supabase), AI (OpenAI/Google), Payment (Stripe).</li>
            <li><strong>Legal Requirements:</strong> If required by law or to protect our rights.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Data Retention</h2>
          <p>
            We retain your generated files (packages) for a limited time to allow you to download them. 
            We may delete old files to save storage space. You should download and save your materials immediately after generation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Your Rights</h2>
          <p>
            You may request access to or deletion of your personal data by contacting us via the feedback form.
          </p>
        </section>
      </div>
    </div>
  );
}
