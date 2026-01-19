import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fantasy Story Generator - Free Plot Ideas & Writing Prompts | FreeToolsHub',
  description: 'Generate epic fantasy story ideas, plot outlines, and writing prompts for free. Perfect for novelists, D&D game masters, and creative writers. Create dark fantasy, urban fantasy, romantic fantasy plots and more!',
  alternates: {
    canonical: '/fantasy-story-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}