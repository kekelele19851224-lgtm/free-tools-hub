import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roofing Squares Calculator - Calculate Roof Area with Pitch | FreeToolsHub',
  description: 'Free roofing squares calculator. Convert square feet to roofing squares with pitch adjustment. Estimate shingles, bundles, and roofing costs. Includes pitch multiplier table.',
  alternates: {
    canonical: '/roofing-squares-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}