import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Money Market Account Calculator - Free APY & Interest Calculator | FreeToolsHub',
  description: 'Free money market account calculator. Calculate compound interest earnings with APY rates, monthly contributions, and compare daily vs monthly compounding. See how much your MMA will grow.',
  alternates: {
    canonical: '/money-market-account-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}