import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Business Jargon Generator - Corporate Buzzword & Phrase Maker | FreeToolsHub',
  description: 'Free business jargon generator online. Create corporate buzzwords, business speak, and professional phrases. Multiple industries: IT, marketing, finance, HR. Includes jargon translator.',
  keywords: 'business jargon generator, corporate jargon generator, business buzzword generator, corporate jargon phrases, funny business jargon generator, IT jargon generator, marketing jargon generator, corporate bs generator, business speak generator, corporate buzzword generator',
  alternates: {
    canonical: '/business-jargon-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}