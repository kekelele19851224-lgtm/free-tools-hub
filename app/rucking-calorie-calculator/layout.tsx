import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rucking Calorie Calculator - Free Online Tool | FreeToolsHub',
  description: 'Estimate calories burned rucking using body weight, pack weight, pace, and terrain. Compare against regular walking to plan training loads and track energy expenditure accurately.',
  alternates: {
    canonical: '/rucking-calorie-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
