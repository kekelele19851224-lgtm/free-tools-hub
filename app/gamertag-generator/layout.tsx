import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free AI Gamertag Generator - Xbox, PlayStation & PC Names | FreeToolsHub',
  description: 'Free AI gamertag generator online. Create unique, cool, funny gaming names for Xbox, PlayStation, Steam, Discord. Multiple styles: aesthetic, OG, dark, fantasy. No signup required.',
  keywords: 'ai gamertag generator, gamertag generator xbox, funny gamertag generator, female gamertag generator, gamertag ideas, cool gamertag generator, free ai gamertag generator, xbox username generator, psn name generator, gaming name generator, aesthetic gamertag, og gamertag generator',
  alternates: {
    canonical: '/gamertag-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}