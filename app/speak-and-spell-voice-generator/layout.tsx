import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Speak and Spell Voice Generator - Free Online Retro TTS | FreeToolsHub',
  description: 'Free online Speak and Spell voice generator. Create retro robotic text-to-speech with the classic 80s educational toy sound. Adjustable pitch and speed, no download required.',
  alternates: {
    canonical: '/speak-and-spell-voice-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}