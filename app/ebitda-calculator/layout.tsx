import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EBITDA Calculator - Free EBITDA & Margin Calculator | FreeToolsHub',
  description: 'Free EBITDA calculator. Calculate EBITDA from net income or operating profit. Get EBITDA margin, EBIT comparison, and business valuation using EV/EBITDA multiples.',
  alternates: {
    canonical: '/ebitda-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}