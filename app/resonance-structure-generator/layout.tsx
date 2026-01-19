import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resonance Structure Generator - Free Online Tool with Steps | FreeToolsHub',
  description: 'Generate resonance structures for common molecules and ions. Free online tool showing step-by-step Lewis structures, electron movement, and resonance rules for chemistry students.',
  alternates: {
    canonical: '/resonance-structure-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}