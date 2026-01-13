import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blow In Insulation Calculator - Free Bags & Cost Estimate | FreeToolsHub',
  description: 'Free blow in insulation calculator. Estimate bags needed, depth, and cost for cellulose or fiberglass insulation. Calculate by area or budget with R-value recommendations.',
  alternates: {
    canonical: '/blow-in-insulation-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}