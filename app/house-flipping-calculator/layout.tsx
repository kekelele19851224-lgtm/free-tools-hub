import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'House Flipping Calculator - 70% Rule, ROI & Profit Analysis | FreeToolsHub',
  description: 'Free house flipping calculator to analyze fix and flip deals. Calculate profit, ROI, verify the 70% rule, and get detailed cost breakdown including rehab, holding, and selling costs.',
  alternates: {
    canonical: '/house-flipping-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}