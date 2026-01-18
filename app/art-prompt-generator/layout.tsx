import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Art Prompt Generator - Free Drawing Ideas & Creative Prompts | FreeToolsHub',
  description: 'Free art prompt generator with 500+ creative drawing ideas. Generate prompts for characters, fantasy, sci-fi, animals, landscapes and more. Perfect for overcoming art block.',
  keywords: 'art prompt generator, drawing prompt generator, art prompts, drawing ideas, character prompt generator, random art generator, what to draw, art block, creative prompts, oc prompt generator',
  alternates: {
    canonical: '/art-prompt-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}