import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Inspection Cost Calculator - Estimate 2025 Prices | FreeToolsHub',
  description: 'Free home inspection cost calculator. Estimate inspection fees by square footage, home age, property type, and add-ons like radon, mold, and termite testing. Get instant price ranges.',
  alternates: {
    canonical: '/home-inspection-cost-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}