import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rug Size Calculator - Find the Perfect Area Rug Size | FreeToolsHub',
  description: 'Free rug size calculator for living room, bedroom, dining room, and hallways. Use the 18-inch rule to find ideal rug dimensions. Match to standard sizes like 5x7, 8x10, 9x12 instantly.',
  alternates: {
    canonical: '/rug-size-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}