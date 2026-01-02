import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Land Clearing Cost Calculator - Free Online Tool | FreeToolsHub',
  description: 'Estimate land clearing costs by acre, vegetation type, and terrain. Get pricing for brush removal, tree clearing, stumps, and site preparation.',
  alternates: {
    canonical: '/land-clearing-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
