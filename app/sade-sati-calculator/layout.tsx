import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sade Sati Calculator - Free Shani Sade Sati Check by Moon Sign | FreeToolsHub',
  description: 'Free Sade Sati calculator. Check if you are in Shani Sade Sati by your Moon sign (Rashi). Find your current phase, timeline, and remedies for Saturn\'s 7.5-year transit.',
  alternates: {
    canonical: '/sade-sati-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}