const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AI Code Validator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  url: 'https://codes.evallab.ai',
  description:
    'The first CI/CD quality gate built specifically for AI-generated code. Detect hallucinations, logic gaps, and architectural inconsistencies before they reach production.',
  offers: [
    {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      name: 'Free',
    },
    {
      '@type': 'Offer',
      price: '19',
      priceCurrency: 'USD',
      name: 'Pro',
      billingIncrement: 'P1M',
    },
  ],
  author: {
    '@type': 'Organization',
    name: 'EvalLab',
    url: 'https://codes.evallab.ai',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-lg">AI Code Validator</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#comparison" className="hover:text-white transition">Why Us</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="/early-access" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition font-medium">
              Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900/30 border border-primary-700/50 rounded-full text-primary-300 text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-400"></span>
            </span>
            Early Access — First 50 teams get 50% off forever
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Quality Gate for<br />AI-Generated Code
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The first CI/CD plugin built specifically to validate AI-generated code.
            Detect hallucinations, logic gaps, and architectural inconsistencies
            before they reach production.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/early-access" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition text-lg">
              Join Early Access →
            </a>
            <a href="https://github.com/raye-deng/ai-code-validator" className="px-8 py-4 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold rounded-xl transition text-lg">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Existing Tools Aren't Enough</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            ESLint, SonarQube, and CodeClimate were built for human-written code.
            AI-generated code has fundamentally different failure modes.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border border-gray-800 bg-gray-900">
              <h3 className="text-lg font-semibold text-gray-400 mb-6">❌ Traditional Linters</h3>
              <ul className="space-y-4 text-gray-500">
                <li className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>Can't detect hallucinated npm packages</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>Miss logic gaps from context window limits</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>Don't understand AI code generation patterns</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>No feedback loop to AI assistants</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>Style-focused, not logic-focused</span>
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-primary-700/50 bg-primary-950/30">
              <h3 className="text-lg font-semibold text-primary-300 mb-6">🛡️ AI Code Validator</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Detects phantom packages, functions, and APIs</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Catches logic discontinuities and dead code</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Purpose-built for AI code failure modes</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>Self-heal: generates fix prompts for Copilot/Cursor</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>0-100 quality score with dimensional breakdown</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">5 Core Capabilities</h2>
          <p className="text-gray-400 text-center mb-12">Built for the AI-first development workflow</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '👻',
                title: 'Hallucination Detection',
                desc: 'Catches phantom packages, undefined functions, and non-existent APIs that AI models confidently generate.',
              },
              {
                icon: '🧩',
                title: 'Logic Gap Analysis',
                desc: 'Identifies empty catch blocks, unreachable code, TODO markers, and missing error handling from context window limits.',
              },
              {
                icon: '📊',
                title: 'Quality Score (0-100)',
                desc: 'Quantified scoring across 4 dimensions: completeness, coherence, consistency, and conciseness.',
              },
              {
                icon: '🚦',
                title: 'CI/CD Quality Gate',
                desc: 'Block low-quality AI code from merging. Works with GitHub Actions and GitLab CI Components.',
              },
              {
                icon: '🔄',
                title: 'AI Self-Heal Loop',
                desc: 'Generates structured fix prompts that feed directly back to Copilot, Cursor, or Claude for automatic remediation.',
              },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition bg-gray-900/50">
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Add to Your CI in 30 Seconds</h2>
          <p className="text-gray-400 text-center mb-10">Works with GitHub Actions and GitLab CI</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">GitHub Actions</h3>
              <pre className="code-block text-green-300">
{`# .github/workflows/ci.yml
- uses: raye-deng/ai-code-validator@v1
  with:
    threshold: 70
    paths: 'src/**/*.ts'
    fail-on-low-score: true`}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">GitLab CI</h3>
              <pre className="code-block text-green-300">
{`# .gitlab-ci.yml
include:
  - component: ai-code-validator/validate@v1
    inputs:
      threshold: 70
      paths: src`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section id="pricing" className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Free for Individuals</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Full CLI, all analysis features, local AI models — <span className="text-blue-300 font-bold">$0 forever</span>.
            <br />
            Team plans from <span className="text-blue-300 font-bold">$19/seat/month</span>.
          </p>
          <a href="/pricing" className="inline-flex px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition text-lg">
            View Pricing →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span>🛡️</span>
            <span className="font-semibold">AI Code Validator</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm">Built for the AI coding era</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://github.com/raye-deng/ai-code-validator" className="hover:text-gray-300 transition">GitHub</a>
            <a href="/early-access" className="hover:text-gray-300 transition">Early Access</a>
            <a href="mailto:fengsen.deng@gmail.com" className="hover:text-gray-300 transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
