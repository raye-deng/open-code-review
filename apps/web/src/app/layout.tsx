import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Open Code Review — Quality Gate for AI-Generated Code',
  description: 'The first CI/CD quality gate built specifically for AI-generated code. Detect hallucinations, logic gaps, and architectural inconsistencies before they reach production.',
  keywords: ['AI code quality', 'code validation', 'CI/CD', 'quality gate', 'hallucination detection'],
  metadataBase: new URL('https://codes.evallab.ai'),
  openGraph: {
    title: 'Open Code Review — Quality Gate for AI-Generated Code',
    description: 'Detect AI code hallucinations, logic gaps & architectural issues in CI/CD. First 50 teams get 50% off forever.',
    url: 'https://codes.evallab.ai',
    siteName: 'Open Code Review',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Code Review — Quality Gate for AI-Generated Code',
    description: 'Detect AI code hallucinations, logic gaps & architectural issues in CI/CD.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
