import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Barndominium Cost Calculator - Free Build Estimate | FreeToolsHub',
  description: 'Free barndominium cost calculator. Estimate build costs by square footage or budget. Get cost breakdowns for kits, turnkey builds, and custom construction with state pricing.',
  alternates: {
    canonical: '/barndominium-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}