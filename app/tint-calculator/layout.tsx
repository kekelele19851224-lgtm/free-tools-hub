import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Window Tint Calculator - VLT Percentage, State Laws & Cost | FreeToolsHub',
  description: 'Free window tint calculator. Calculate final VLT percentage, check state tint laws for legality, and estimate car tinting costs. Supports double tint layering and all 50 states.',
  alternates: {
    canonical: '/tint-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}