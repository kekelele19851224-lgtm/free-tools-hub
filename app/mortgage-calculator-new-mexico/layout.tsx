import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Mexico Mortgage Calculator - Monthly Payment & Property Tax 2026 | FreeToolsHub',
  description: 'Free New Mexico mortgage calculator with county property tax rates. Calculate your monthly PITI payment including principal, interest, taxes, and insurance. Updated for 2026.',
  alternates: {
    canonical: '/mortgage-calculator-new-mexico',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
