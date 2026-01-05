import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3 Phase to Single Phase Calculator - Free Converter Sizing Tool | FreeToolsHub',
  description: 'Free 3 phase to single phase calculator. Calculate power conversion, find equivalent current, and size your phase converter. Includes formulas, sizing guide, and converter comparison.',
  alternates: {
    canonical: '/3-phase-to-single-phase-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}