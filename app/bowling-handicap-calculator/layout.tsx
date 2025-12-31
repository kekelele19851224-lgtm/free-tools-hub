import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bowling Handicap Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate bowling handicap and adjusted scores for league play. Supports 90% of 220, 80% of 230, and custom bases and percentages to keep team comparisons fair and consistent.',
  alternates: {
    canonical: '/bowling-handicap-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
