import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Water Softener Size Calculator - Grain Capacity Guide 2025 | FreeToolsHub',
  description: 'Free water softener size calculator to find the right grain capacity for your home. Calculate based on household size, water hardness (GPG/PPM), and iron content. Includes sizing chart.',
  alternates: {
    canonical: '/water-softener-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}