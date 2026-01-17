import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nerve Damage Compensation Calculator - Estimate Your Settlement | FreeToolsHub',
  description: 'Free nerve damage compensation calculator to estimate settlement amounts. Uses the multiplier method to calculate pain and suffering damages. Get rough estimates for informational purposes.',
  alternates: {
    canonical: '/nerve-damage-compensation-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}