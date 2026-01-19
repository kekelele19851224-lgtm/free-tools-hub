import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Gravestone Generator - Tombstone Meme Maker Online | FreeToolsHub',
  description: 'Free gravestone generator online. Create funny tombstone memes for RIP jokes, Halloween, and more. Multiple styles, custom text, instant PNG download. No signup required.',
  keywords: 'gravestone generator, gravestone generator meme, tombstone generator online, gravestone template generator, funny tombstone generator, RIP meme generator, grave generator free, tombstone meme maker, gravestone maker app, halloween tombstone generator',
  alternates: {
    canonical: '/gravestone-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}