import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retaining Wall Cost Calculator - Estimate by Material & Size | FreeToolsHub',
  description: 'Free retaining wall cost calculator. Estimate costs by wall dimensions, material type (concrete, stone, wood, brick), and installation. Compare DIY vs professional pricing.',
  alternates: {
    canonical: '/retaining-wall-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}