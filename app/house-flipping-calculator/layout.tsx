import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'House Flipping Calculator | Flip Calculator - ROI & Profit | FreeToolsHub',
  description: 'Free house flip calculator to analyze fix and flip deals. Calculate ROI, net profit, rehab costs, and verify the 70% rule. Best flip calculator for real estate investors.',
  alternates: {
    canonical: '/house-flipping-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
