import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Drywall Installation Cost Calculator - Labor & Materials | FreeToolsHub',
  description: 'Free drywall installation cost calculator. Estimate costs per square foot for hanging and finishing drywall, calculate materials needed, and compare finish levels. Includes labor rates and material list.',
  alternates: {
    canonical: '/drywall-installation-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}