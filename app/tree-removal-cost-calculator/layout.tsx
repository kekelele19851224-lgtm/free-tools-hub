import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tree Removal Cost Calculator - Free Estimate by Size & Type | FreeToolsHub',
  description: 'Free tree removal cost calculator. Estimate prices by height, diameter, tree type, and location. Calculate multiple trees with bundle discounts. Average cost $400-$1,200.',
  alternates: {
    canonical: '/tree-removal-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}