import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vinyl Wrap Calculator - Car Wrap Size Chart & Cost Estimator | FreeToolsHub',
  description: 'Free vinyl wrap calculator. Calculate how much vinyl you need to wrap your car by vehicle size or parts. See vinyl wrap size chart for all vehicle types and estimate DIY vs professional costs.',
  alternates: {
    canonical: '/vinyl-wrap-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}