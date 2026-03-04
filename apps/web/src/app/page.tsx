export default function Home() {
  return (
    <main className="min-h-screen">
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

      {/* Early Access Banner */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary-900/40 to-purple-900/40 border border-primary-700/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">🎉 Early Access: 50% Off Forever</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Be among the first 50 teams to validate AI code quality.
            Lock in <span className="text-primary-300 font-bold">$9.50/month</span> instead of $19/month — forever.
          </p>
          <a href="/early-access" className="inline-flex px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition text-lg">
            Claim Your Spot →
          </a>
          <p className="text-gray-500 text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-12">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-gray-800 bg-gray-900">
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-1">$0</p>
              <p className="text-gray-500 text-sm mb-6">forever</p>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex gap-2"><span className="text-green-400">✓</span> 1 repository</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> CLI tool</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Basic detectors</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Terminal reports</li>
                <li className="flex gap-2"><span className="text-gray-600">—</span> <span className="text-gray-600">PR comments</span></li>
                <li className="flex gap-2"><span className="text-gray-600">—</span> <span className="text-gray-600">AI self-heal</span></li>
              </ul>
              <a href="https://github.com/raye-deng/ai-code-validator" className="block text-center py-3 border border-gray-700 rounded-lg text-gray-300 hover:border-gray-500 transition">
                Get Started
              </a>
            </div>
            {/* Pro */}
            <div className="p-8 rounded-2xl border-2 border-primary-600 bg-primary-950/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-1">$19<span className="text-lg text-gray-400">/mo</span></p>
              <p className="text-primary-300 text-sm mb-6">Early Access: $9.50/mo</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Unlimited repositories</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> GitHub Action + GitLab CI</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> All detectors</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> PR comments & quality gate</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> AI self-heal prompts</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Quality trend dashboard</li>
              </ul>
              <a href="/early-access" className="block text-center py-3 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition">
                Start Free Trial
              </a>
            </div>
            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-gray-800 bg-gray-900">
              <h3 className="text-lg font-semibold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-1">Custom</p>
              <p className="text-gray-500 text-sm mb-6">contact us</p>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li className="flex gap-2"><span className="text-green-400">✓</span> Everything in Pro</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Self-hosted option</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Custom rules & policies</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> SSO / SAML</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> Dedicated support</li>
                <li className="flex gap-2"><span className="text-green-400">✓</span> SLA guarantee</li>
              </ul>
              <a href="mailto:fengsen.deng@gmail.com" className="block text-center py-3 border border-gray-700 rounded-lg text-gray-300 hover:border-gray-500 transition">
                Contact Sales
              </a>
            </div>
          </div>
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
