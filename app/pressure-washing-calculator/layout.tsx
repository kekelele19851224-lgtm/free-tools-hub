import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pressure Washing Estimate Calculator - Free Online Tool | FreeToolsHub',
  description: 'Estimate pressure washing costs by surface and area. Get per‑square‑foot pricing for houses, driveways, decks and more, with material notes to plan a thorough professional cleaning.',
  alternates: {
    canonical: '/pressure-washing-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
