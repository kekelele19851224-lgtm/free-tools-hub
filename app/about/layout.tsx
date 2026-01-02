import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | FreeToolsHub',
  description: 'Learn about FreeToolsHub - Free online calculators and tools for financial, home, real estate, and legal calculations.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
