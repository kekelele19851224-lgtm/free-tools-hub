import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Percent to Fraction Calculator - Convert % to Fraction with Steps | FreeToolsHub',
  description: 'Free percent to fraction calculator with step-by-step solution. Convert percentages to fractions in simplest form. Supports decimals like 12.5%, 33.33%, 66.67%.',
  alternates: {
    canonical: '/percent-to-fraction-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}