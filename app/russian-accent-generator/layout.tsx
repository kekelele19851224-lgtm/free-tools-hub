import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Russian Accent Generator - Text to Speech & Converter | FreeToolsHub',
  description: 'Free Russian accent generator online. Convert English text to Russian-accented English instantly. Text to speech with authentic Russian accent. Perfect for memes, videos, and entertainment. No signup required.',
  keywords: 'russian accent generator, russian accent generator text, russian accent generator voice, russian accent text to speech, russian accent maker, russian accent translator, fake russian accent generator, russian accent converter, russian accent simulator, how to make russian accent',
  alternates: {
    canonical: '/russian-accent-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}