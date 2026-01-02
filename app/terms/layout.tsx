import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | FreeToolsHub',
  description: 'Terms of Service for FreeToolsHub - Read our terms and conditions for using our free online calculators.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
