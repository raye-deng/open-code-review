'use client';

import { useState } from 'react';

export default function EarlyAccess() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      repoUrl: (form.elements.namedItem('repoUrl') as HTMLInputElement).value,
      ciType: (form.elements.namedItem('ciType') as HTMLSelectElement).value,
    };

    try {
      await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Graceful fallback — still show thank you
    }

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <span className="text-6xl mb-6 block">🎉</span>
          <h1 className="text-4xl font-bold mb-4">You're In!</h1>
          <p className="text-xl text-gray-400 mb-8">
            We'll reach out within 24 hours with your access details
            and your <span className="text-primary-300 font-semibold">50% lifetime discount</span>.
          </p>
          <a href="/" className="text-primary-400 hover:text-primary-300 transition">
            ← Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20 px-6">
      {/* Back link */}
      <div className="max-w-xl mx-auto mb-8">
        <a href="/" className="text-gray-500 hover:text-gray-300 transition text-sm">
          ← Back to Home
        </a>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-5xl mb-4 block">🛡️</span>
          <h1 className="text-4xl font-bold mb-4">Join the Early Access Program</h1>
          <p className="text-gray-400 text-lg">
            Be among the first 50 teams to validate AI code quality.
            <br />
            <span className="text-primary-300 font-semibold">Lock in 50% off forever.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your name"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Company <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              placeholder="Your company"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Repo URL */}
          <div>
            <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-300 mb-2">
              GitHub / GitLab URL <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="url"
              id="repoUrl"
              name="repoUrl"
              placeholder="https://github.com/your-org/your-repo"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* CI/CD Type */}
          <div>
            <label htmlFor="ciType" className="block text-sm font-medium text-gray-300 mb-2">
              CI/CD Platform <span className="text-red-400">*</span>
            </label>
            <select
              id="ciType"
              name="ciType"
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select your platform</option>
              <option value="github">GitHub Actions</option>
              <option value="gitlab">GitLab CI</option>
              <option value="both">Both</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-lg"
          >
            {loading ? 'Submitting...' : 'Join Early Access — 50% Off Forever'}
          </button>

          <p className="text-center text-gray-500 text-sm">
            No credit card required. We'll email you access details within 24 hours.
          </p>
        </form>
      </div>
    </main>
  );
}
