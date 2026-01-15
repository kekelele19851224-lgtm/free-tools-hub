import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Line of Credit Calculator - Payment, Interest & Cost | FreeToolsHub',
  description: 'Free business line of credit calculator. Calculate monthly payments, total interest, and compare interest-only vs principal & interest options. Estimate costs for revolving credit lines.',
  alternates: {
    canonical: '/business-line-of-credit-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}