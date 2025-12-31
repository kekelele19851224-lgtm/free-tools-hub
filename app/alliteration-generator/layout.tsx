import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alliteration Generator - Create Catchy Phrases Instantly | FreeToolsHub',
  description: 'Generate alliterative phrases for poetry, business names, tongue twisters, and kids learning. Choose any letter and style to create memorable phrases instantly.',
  alternates: {
    canonical: '/alliteration-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}