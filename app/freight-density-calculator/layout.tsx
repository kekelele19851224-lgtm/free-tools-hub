import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Freight Density Calculator - Free LTL Freight Class Tool | FreeToolsHub',
  description: 'Calculate cargo density and determine freight class for LTL shipments. Works for XPO, FedEx, UPS, Saia, Estes and all NMFC-based carriers. Free online tool.',
  alternates: {
    canonical: '/freight-density-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}