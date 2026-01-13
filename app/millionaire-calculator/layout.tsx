import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Millionaire Calculator - How Long to Save $1 Million | FreeToolsHub',
  description: 'Free millionaire calculator. Find out how long to become a millionaire, monthly savings needed, and track wealth milestones. S&P 500 returns with inflation adjustment.',
  alternates: {
    canonical: '/millionaire-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}