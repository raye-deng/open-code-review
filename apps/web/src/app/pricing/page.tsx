export default function Pricing() {
  return (
    <main className="min-h-screen py-20 px-6">
      <div className="max-w-xl mx-auto mb-8">
        <a href="/" className="text-gray-500 hover:text-gray-300 transition text-sm">
          ← Back to Home
        </a>
      </div>
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Pricing</h1>
        <p className="text-gray-400 text-lg mb-12">
          Full pricing details coming soon. In the meantime, join our Early Access program
          and lock in 50% off forever.
        </p>
        <a
          href="/early-access"
          className="inline-flex px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition text-lg"
        >
          Join Early Access →
        </a>
      </div>
    </main>
  );
}
