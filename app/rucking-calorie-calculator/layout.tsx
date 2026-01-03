import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rucking Calorie Calculator | Ruck Calorie Calculator | FreeToolsHub',
  description: 'Free ruck calorie calculator to estimate calories burned while rucking. Calculate based on body weight, pack weight, distance, pace and terrain. Compare with regular walking.',
  alternates: {
    canonical: '/rucking-calorie-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
