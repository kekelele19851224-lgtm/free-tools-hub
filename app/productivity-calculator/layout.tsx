import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Productivity Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate productivity per hour and per employee. Track output versus time, visualize improvements, and compare scenarios to optimize staffing, workflows, and overall operational efficiency.',
  alternates: {
    canonical: '/productivity-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
