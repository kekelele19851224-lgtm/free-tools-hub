import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QQQI Dividend Calculator - Monthly Income & DRIP Projections | FreeToolsHub',
  description: 'Calculate QQQI dividend income, find how much to invest for $1000/month in dividends, and project DRIP growth. Free NEOS Nasdaq-100 High Income ETF calculator with ~13.7% yield.',
  alternates: {
    canonical: '/qqqi-dividend-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}