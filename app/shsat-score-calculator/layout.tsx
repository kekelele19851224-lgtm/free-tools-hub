import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SHSAT Score Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate your SHSAT score and evaluate eligibility for NYC Specialized High Schools. See section breakdowns, cutoffs, and targets to guide focused practice and application decisions.',
  alternates: {
    canonical: '/shsat-score-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
