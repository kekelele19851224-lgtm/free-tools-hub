import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Express Entry CRS Calculator 2025 - Canada Immigration Points | FreeToolsHub',
  description: 'Free Express Entry CRS calculator updated for 2025. Calculate your Comprehensive Ranking System score for Canada immigration. Includes 67-point FSWP eligibility check and IELTS to CLB conversion.',
  alternates: {
    canonical: '/express-entry-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}