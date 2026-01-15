import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Yard Calculator for Rock - Cubic Yards, Tons & Coverage | FreeToolsHub',
  description: 'Free yard calculator for rock and gravel. Calculate cubic yards, tons, and bags needed for landscaping. Includes coverage calculator, cost estimator, and rock type comparisons.',
  alternates: {
    canonical: '/yard-calculator-for-rock',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}