import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Golf Club Length Calculator - Free Online Tool | FreeToolsHub',
  description: 'Find your correct golf club length from height and wrist‑to‑floor. Get personalized recommendations for every club to improve comfort, consistency, and overall swing performance.',
  alternates: {
    canonical: '/golf-club-length-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
