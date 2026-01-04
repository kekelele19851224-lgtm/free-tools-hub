import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IL Spousal Support Calculator - Illinois Alimony 2025 | FreeToolsHub',
  description: 'Free Illinois spousal support calculator. Calculate maintenance payments using the 33%/25% formula with duration chart. Updated for 2025 Illinois law (750 ILCS 5/504).',
  alternates: {
    canonical: '/il-spousal-support-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}