import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pain and Suffering Calculator - Free Personal Injury Estimate | FreeToolsHub',
  description: 'Free pain and suffering calculator for personal injury claims. Calculate using multiplier and per diem methods. Estimate car accident, slip and fall, and injury settlements instantly.',
  alternates: {
    canonical: '/pain-and-suffering-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}