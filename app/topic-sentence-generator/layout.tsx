import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Topic Sentence Generator - Free Essay & Research Paper Tool | FreeToolsHub',
  description: 'Free topic sentence generator for essays, research papers, and academic writing. Generate strong opening sentences with formal, persuasive, informative, or analytical tones. Perfect for students.',
  keywords: 'topic sentence generator, topic sentence generator free, topic sentence generator for essay, topic sentence maker, introduction sentence generator, paragraph opener generator, thesis sentence generator, essay writing tool',
  alternates: {
    canonical: '/topic-sentence-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}