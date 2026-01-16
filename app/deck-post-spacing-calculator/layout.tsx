import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deck Post Spacing Calculator - Free Layout Planner with Visual Diagram | FreeToolsHub',
  description: 'Free deck post spacing calculator with visual layout diagram. Calculate post positions, beam sizes, and footing requirements per IRC 2021. Shows exactly where to place every post for your deck project.',
  alternates: {
    canonical: '/deck-post-spacing-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}