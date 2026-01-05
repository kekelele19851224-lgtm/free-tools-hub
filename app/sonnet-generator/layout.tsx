import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sonnet Generator - Free 14-Line Poem Creator & Checker | FreeToolsHub',
  description: 'Free sonnet generator with iambic pentameter. Create Shakespearean, Petrarchan, and Spenserian sonnets. Check your poem structure, rhyme scheme, and syllable count.',
  alternates: {
    canonical: '/sonnet-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}