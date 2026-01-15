import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'House Cleaning Cost Calculator - Estimate Cleaning Prices | FreeToolsHub',
  description: 'Free house cleaning cost calculator. Estimate cleaning prices based on home size, bedrooms, bathrooms, and cleaning type. Get accurate quotes for standard, deep, or move-out cleaning.',
  alternates: {
    canonical: '/house-cleaning-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}