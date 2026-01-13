import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JEPQ Dividend Calculator - Free Monthly Income & DRIP Tool | FreeToolsHub',
  description: 'Free JEPQ dividend calculator. Calculate monthly income, plan retirement goals, and compare JEPQ vs JEPI vs SCHD. DRIP reinvestment projections included.',
  alternates: {
    canonical: '/jepq-dividend-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
