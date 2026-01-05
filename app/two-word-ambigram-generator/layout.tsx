import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Two Word Ambigram Generator - Free Online Tattoo Design Tool | FreeToolsHub',
  description: 'Free two word ambigram generator for tattoos and logos. Create designs that read differently when rotated 180°. Analyze letter compatibility and explore ambigram types.',
  alternates: {
    canonical: '/two-word-ambigram-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}