import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Decomposed Granite Calculator - DG Coverage & Cost Estimator | FreeToolsHub',
  description: 'Free decomposed granite calculator. Calculate how much DG you need in cubic yards, tons, and bags. Includes cost estimator for natural, stabilized, and resin-coated decomposed granite.',
  alternates: {
    canonical: '/decomposed-granite-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}