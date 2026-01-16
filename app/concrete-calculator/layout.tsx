import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concrete Calculator with Pricing - Free Cost Estimator by State | FreeToolsHub',
  description: 'Free concrete calculator with state-by-state pricing. Calculate cubic yards, bags needed, and total project cost for slabs, driveways, patios, and footings. Includes material + labor estimates for all 50 US states.',
  alternates: {
    canonical: '/concrete-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}