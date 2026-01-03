import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Salt Pool Calculator - Free Pool Salt Calculator | FreeToolsHub',
  description: 'Calculate how much salt your pool needs with our free salt pool calculator. Get results in pounds, kilograms, and 40lb/50lb bags. Includes pool volume calculator for rectangular, circular, and oval pools.',
  alternates: {
    canonical: '/salt-pool-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}