import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neck Injury Settlement Calculator - Free Estimate | FreeToolsHub',
  description: 'Free neck injury settlement calculator. Estimate your potential settlement based on medical expenses, lost wages, and pain & suffering. Calculate take-home amount after attorney fees.',
  alternates: {
    canonical: '/neck-injury-settlement-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}