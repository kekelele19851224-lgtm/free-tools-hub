import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Montana Mortgage Calculator - Home Loan Payment & Affordability | FreeToolsHub',
  description: 'Free Montana mortgage calculator with county-specific property tax rates. Calculate monthly payments, home affordability, and view amortization schedules. Includes Missoula, Gallatin, Yellowstone counties.',
  alternates: {
    canonical: '/mortgage-calculator-montana',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}