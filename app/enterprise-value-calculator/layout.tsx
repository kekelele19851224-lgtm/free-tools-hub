import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enterprise Value Calculator - Free EV & Business Valuation Tool | FreeToolsHub',
  description: 'Free enterprise value calculator. Calculate EV from market cap, debt, and cash. Estimate business valuation using EBITDA multiples by industry. Perfect for M&A analysis and private company valuation.',
  alternates: {
    canonical: '/enterprise-value-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}