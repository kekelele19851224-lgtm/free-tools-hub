import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Therapy Productivity Calculator - Free PT/OT/SLP Calculator | FreeToolsHub',
  description: 'Free therapy productivity calculator for PT, OT, and SLP. Calculate productivity percentage, plan daily goals, and convert minutes to CPT billing units with the 8-minute rule.',
  alternates: {
    canonical: '/therapy-productivity-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}