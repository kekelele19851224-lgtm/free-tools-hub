import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Candle Calculator - Wax, Fragrance & Pricing | FreeToolsHub',
  description: 'Free candle calculator for DIY candle makers. Calculate wax and fragrance amounts, estimate costs, and set profitable prices. Includes fragrance load guide for all wax types.',
  alternates: {
    canonical: '/candle-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}