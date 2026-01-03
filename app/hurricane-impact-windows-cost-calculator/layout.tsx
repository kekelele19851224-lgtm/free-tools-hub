import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hurricane Impact Windows Cost Calculator - Free Estimate | FreeToolsHub',
  description: 'Free hurricane impact windows cost calculator. Estimate material and installation costs by window size, type, and frame material. Get instant pricing for Florida, Texas, and coastal areas.',
  alternates: {
    canonical: '/hurricane-impact-windows-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}