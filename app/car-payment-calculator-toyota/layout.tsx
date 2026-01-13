import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Toyota Car Payment Calculator - Finance & Lease Estimator | FreeToolsHub',
  description: 'Free Toyota car payment calculator. Calculate monthly payments for Camry, RAV4, Corolla, Tacoma & more. Compare finance vs lease options with 2026 MSRP prices.',
  alternates: {
    canonical: '/car-payment-calculator-toyota',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}