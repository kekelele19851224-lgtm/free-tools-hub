import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arizona Mortgage Calculator - Monthly Payment with Taxes by County | FreeToolsHub',
  description: 'Free Arizona mortgage calculator with all 15 county property tax rates. Calculate monthly payments including taxes, insurance, PMI and HOA for Phoenix, Tucson, Mesa and all AZ areas.',
  alternates: {
    canonical: '/arizona-mortgage-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}