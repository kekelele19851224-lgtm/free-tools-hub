import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dirt Calculator - Calculate Cubic Yards of Fill Dirt & Topsoil | FreeToolsHub',
  description: 'Free dirt calculator to estimate cubic yards of fill dirt, topsoil, sand, or gravel. Calculate yardage, tonnage, coverage area, and dump truck loads for your project.',
  alternates: {
    canonical: '/dirt-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}