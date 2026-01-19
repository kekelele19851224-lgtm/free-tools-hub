import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diss Track Lyrics Generator - Free Rap Battle Lyrics Online | FreeToolsHub',
  description: 'Generate sharp, witty diss track lyrics for free. Create savage, funny, or aggressive rap battle verses that rhyme. Perfect for freestyle battles, roasting friends, and creative entertainment.',
  alternates: {
    canonical: '/diss-track-lyrics-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}