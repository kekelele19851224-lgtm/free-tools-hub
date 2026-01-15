import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simplify Radicals Calculator - Square Root Simplifier with Steps | FreeToolsHub',
  description: 'Free radical simplifier calculator with step-by-step solutions. Simplify square roots, cube roots, and nth roots. Shows prime factorization and perfect square factors. 100% free.',
  alternates: {
    canonical: '/simplify-radicals-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}