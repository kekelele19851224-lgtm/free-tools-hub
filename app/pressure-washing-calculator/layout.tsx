import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pressure Washing Cost Calculator - Driveway, House & Deck | FreeToolsHub',
  description: 'Free pressure washing cost calculator for driveways, houses, decks and more. Get instant estimates per square foot. Calculate pressure washing driveway cost and other surfaces.',
  alternates: {
    canonical: '/pressure-washing-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
