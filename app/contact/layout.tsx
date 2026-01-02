import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | FreeToolsHub',
  description: 'Contact FreeToolsHub - Get in touch with us for questions, suggestions, or bug reports about our free online calculators.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
