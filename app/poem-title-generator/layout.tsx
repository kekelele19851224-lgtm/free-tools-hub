import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Poem Title Generator - Free Creative Title Ideas for Poems | FreeToolsHub',
  description: 'Free poem title generator with creative ideas for any theme. Generate titles for love poems, nature poems, deep poetry, and more. Browse curated title ideas and learn how to title your poem.',
  alternates: {
    canonical: '/poem-title-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}