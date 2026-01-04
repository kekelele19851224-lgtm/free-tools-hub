import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pressure Washing Cost Calculator - Driveway, House & Deck | FreeToolsHub',
  description: 'Calculate pressure washing costs for driveways, houses, decks, and more. Get instant estimates per square foot with our free driveway pressure washing cost calculator. Compare DIY vs professional prices.',
  alternates: {
    canonical: '/pressure-washing-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
