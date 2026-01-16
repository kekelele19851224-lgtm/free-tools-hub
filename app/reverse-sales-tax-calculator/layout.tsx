import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reverse Sales Tax Calculator - Calculate Pre-Tax Price by State | FreeToolsHub',
  description: 'Free reverse sales tax calculator to find the original price before tax. Select your state for auto tax rate. Works for all US states including CA, TX, FL, NY, NJ, CT, NC, and more.',
  alternates: {
    canonical: '/reverse-sales-tax-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}