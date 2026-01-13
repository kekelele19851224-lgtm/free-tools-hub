import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Monthly Savings Calculator - Compound Interest & Savings Goal | FreeToolsHub',
  description: 'Free monthly savings calculator with compound interest. Calculate future balance, how much to save monthly for a goal, or time to reach your target. See year-by-year growth.',
  alternates: {
    canonical: '/monthly-savings-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}