import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wood Floor Calculator - Calculate Flooring Square Feet & Boxes Needed | FreeToolsHub',
  description: 'Free wood floor calculator to estimate how much flooring you need. Calculate square feet, number of boxes, and material cost for hardwood, laminate, and vinyl flooring.',
  alternates: {
    canonical: '/wood-floor-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}