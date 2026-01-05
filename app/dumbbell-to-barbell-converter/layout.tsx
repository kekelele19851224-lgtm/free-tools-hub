import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dumbbell to Barbell Converter - Free Bench Press Calculator | FreeToolsHub',
  description: 'Free dumbbell to barbell converter calculator. Estimate your barbell bench press weight from dumbbell weights. Includes conversion charts, strength standards, and training guide.',
  alternates: {
    canonical: '/dumbbell-to-barbell-converter',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}