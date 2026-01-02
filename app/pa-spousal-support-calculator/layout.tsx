import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PA Spousal Support Calculator - Pennsylvania Alimony Formula 2025 | FreeToolsHub',
  description: 'Free Pennsylvania spousal support calculator using official PA guidelines. Calculate alimony pendente lite (APL) based on income with or without children. Accurate PA support estimates.',
  alternates: {
    canonical: '/pa-spousal-support-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}