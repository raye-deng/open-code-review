import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Open Code Review",
  description:
    "Free for individuals. Team plans from $19/seat/month. Enterprise custom pricing.",
};

const tiers = [
  {
    name: "Individual",
    price: "$0",
    period: "forever",
    description: "Everything you need for personal projects",
    features: [
      "Unlimited local scans",
      "Full CLI features",
      "L1 + L2 analysis",
      "Local Ollama models",
      "GitHub/GitLab CI integration",
      "Community support",
    ],
    cta: "Get Started",
    href: "/",
    highlighted: false,
  },
  {
    name: "Team",
    price: "$19",
    period: "/seat/month",
    description: "For teams shipping AI-generated code at scale",
    badge: "Most Popular",
    features: [
      "Everything in Individual",
      "Commercial use license",
      "Team dashboard",
      "Centralized reports and trends",
      "Priority support (24h SLA)",
      "Custom rules and thresholds",
    ],
    cta: "Start Free Trial",
    href: "mailto:fengsen.deng@gmail.com?subject=OCR%20Team%20Plan",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For organizations with advanced requirements",
    features: [
      "Everything in Team",
      "Private deployment support",
      "SSO / SAML",
      "Compliance audit logs",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "mailto:fengsen.deng@gmail.com?subject=OCR%20Enterprise",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "Is it really free for individuals?",
    a: "Yes. The CLI and all local analysis features are free forever. No credit card, no trial expiration, no feature gates.",
  },
  {
    q: "What counts as commercial use?",
    a: "Using Open Code Review within a company, organization, or for any for-profit purpose. If your team ships code for money, you need a Team or Enterprise license.",
  },
  {
    q: "Why not MIT anymore?",
    a: "The Business Source License ensures individuals always get it free while enabling sustainable development. All code becomes Apache 2.0 after 4 years — so it will be fully open source by 2030.",
  },
  {
    q: "Can I self-host?",
    a: "Individuals — yes, absolutely. Commercial self-hosting requires a Team or Enterprise license.",
  },
];

export default function Pricing() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-bold text-lg">Open Code Review</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="/#features" className="hover:text-white transition">
              Features
            </a>
            <a href="/#comparison" className="hover:text-white transition">
              Why Us
            </a>
            <a
              href="/pricing"
              className="text-white font-medium"
            >
              Pricing
            </a>
          </div>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Free for individuals. Pay only when your team needs it.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? "border-2 border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10"
                  : "border border-gray-800 bg-gray-900"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
                  {tier.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
                <p className="text-gray-500 text-sm">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-gray-400 text-sm ml-1">
                  {tier.period}
                </span>
              </div>

              <ul className="space-y-3 text-sm mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-gray-300">
                    <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.href}
                className={`block text-center py-3 rounded-lg font-medium transition ${
                  tier.highlighted
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-800 pb-8">
                <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span>🛡️</span>
            <span className="font-semibold">Open Code Review</span>
            <span className="text-gray-600">·</span>
            <span className="text-sm">
              Free for individuals. BSL-1.1 licensed.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a
              href="https://github.com/raye-deng/open-code-review"
              className="hover:text-gray-300 transition"
            >
              GitHub
            </a>
            <a href="/pricing" className="hover:text-gray-300 transition">
              Pricing
            </a>
            <a
              href="mailto:fengsen.deng@gmail.com"
              className="hover:text-gray-300 transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
