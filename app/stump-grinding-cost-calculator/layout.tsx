import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stump Grinding Cost Calculator - Estimate Tree Stump Removal Price | FreeToolsHub',
  description: 'Free stump grinding cost calculator to estimate tree stump removal prices. Calculate cost per inch, multiple stumps with bulk discount, and compare DIY vs professional rates.',
  alternates: {
    canonical: '/stump-grinding-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}