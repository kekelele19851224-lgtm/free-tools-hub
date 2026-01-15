import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stock Split Calculator - Forward, Reverse & Multiple Splits | FreeToolsHub',
  description: 'Free stock split calculator. Calculate how stock splits affect your shares, price, and cost basis. Supports forward splits (2-for-1, 3-for-1), reverse splits, and multiple split calculations.',
  alternates: {
    canonical: '/stock-split-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}