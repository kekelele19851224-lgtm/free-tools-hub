import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Radical Calculator - Simplify Radicals with Steps | FreeToolsHub',
  description: 'Free radical calculator to simplify radical expressions with step-by-step solutions. Evaluate square roots, cube roots, and perform radical operations. Shows prime factorization.',
  alternates: {
    canonical: '/radical-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}