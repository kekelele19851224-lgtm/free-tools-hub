import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chapter 13 Bankruptcy Calculator - Estimate Your Monthly Payment | FreeToolsHub',
  description: 'Free Chapter 13 bankruptcy calculator. Estimate your monthly repayment plan payment based on income, debts, and state median income. See 3 vs 5-year plan options.',
  alternates: {
    canonical: '/chapter-13-bankruptcy-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}