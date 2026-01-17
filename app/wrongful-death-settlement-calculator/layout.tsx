import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wrongful Death Settlement Calculator - Estimate Compensation | FreeToolsHub',
  description: 'Free wrongful death settlement calculator to estimate compensation amounts. Calculate economic and non-economic damages, see how settlements are distributed, and understand key factors affecting your case.',
  alternates: {
    canonical: '/wrongful-death-settlement-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}