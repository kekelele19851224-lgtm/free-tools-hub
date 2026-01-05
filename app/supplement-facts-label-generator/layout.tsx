import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Supplement Facts Label Generator - Free FDA Style Label Maker | FreeToolsHub',
  description: 'Free supplement facts label generator for dietary supplements. Create FDA-style labels with vitamins, minerals, and custom ingredients. Plus funny nutrition facts labels for gifts.',
  alternates: {
    canonical: '/supplement-facts-label-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}