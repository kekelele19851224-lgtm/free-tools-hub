import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quorum Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate the minimum votes required for a valid decision across meeting sizes and rules. Quickly determine quorum thresholds to ensure compliant governance and successful approvals.',
  alternates: {
    canonical: '/quorum-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
