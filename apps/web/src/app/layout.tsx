import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Code Validator — Quality Gate for AI-Generated Code',
  description: 'The first CI/CD quality gate built specifically for AI-generated code. Detect hallucinations, logic gaps, and architectural inconsistencies before they reach production.',
  keywords: ['AI code quality', 'code validation', 'CI/CD', 'quality gate', 'hallucination detection'],
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
