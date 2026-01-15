import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accelerated Aging Calculator - ASTM F1980 Medical Device | FreeToolsHub',
  description: 'Free accelerated aging calculator based on ASTM F1980 and Arrhenius equation. Calculate shelf life testing time for medical device packaging. Supports Q10=2.0, multiple temperatures.',
  alternates: {
    canonical: '/accelerated-aging-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}