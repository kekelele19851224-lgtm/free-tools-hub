import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Landscaping Cost Calculator - Estimate Yard Project | FreeToolsHub',
  description: 'Free landscaping cost calculator. Estimate lawn, mulch, plants, patio and hardscaping costs. Get instant pricing for backyard and front yard projects in 2025.',
  keywords: [
    'landscaping cost calculator',
    'backyard landscaping cost calculator',
    'landscape cost estimator',
    'yard landscaping cost',
    'lawn care cost calculator',
    'landscaping price calculator',
    'garden cost calculator',
    'outdoor living cost',
    'patio cost calculator',
    'hardscaping cost'
  ],
  openGraph: {
    title: 'Landscaping Cost Calculator - Estimate Yard Project | FreeToolsHub',
    description: 'Free landscaping cost calculator. Estimate lawn, mulch, plants, patio and hardscaping costs for your backyard or front yard project.',
    type: 'website',
    siteName: 'FreeToolsHub',
  },
}

export default function LandscapingCostCalculatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}