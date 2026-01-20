import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many Bundles of Shingles in a Square? Free Calculator | FreeToolsHub',
  description: 'Find how many bundles of shingles in a square (3-5 bundles). Free roofing calculator - enter roof size, get bundles needed. 1 square = 100 sq ft. 3-tab: 3 bundles, architectural: 4 bundles.',
  keywords: 'how many bundles shingles in a square, shingles calculator, roofing square calculator, how many bundles of shingles for 2000 square feet, how many bundles of shingles for 100 square feet, roof shingle calculator, bundles per square, roofing materials calculator',
  alternates: {
    canonical: '/shingles-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}