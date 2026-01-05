import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Music Artist Name Generator - Free Stage Name Ideas for Musicians | FreeToolsHub',
  description: 'Free music artist name generator for solo musicians, rappers, DJs, and bands. Generate unique stage names by genre, style, or from your real name. Find your perfect artist identity!',
  alternates: {
    canonical: '/music-artist-name-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}