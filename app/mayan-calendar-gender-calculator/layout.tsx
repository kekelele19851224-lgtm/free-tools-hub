import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mayan Calendar Gender Calculator 2026 - Baby Boy or Girl? | FreeToolsHub',
  description: 'Free Mayan gender predictor calculator. Find out if you\'re having a boy or girl using the ancient Mayan calendar method. Includes 2026 prediction chart and comparison with Chinese gender predictor.',
  alternates: {
    canonical: '/mayan-calendar-gender-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
