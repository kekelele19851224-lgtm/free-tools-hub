import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many Bags of Mulch in a Yard? Free Calculator | FreeToolsHub',
  description: '13.5 bags of mulch (2 cu ft) = 1 cubic yard. Free mulch calculator - enter your area in sq ft, get bags needed. Compare bagged vs bulk mulch costs. 1 yard = 27 cu ft.',
  keywords: 'how many bags of mulch in a yard, mulch calculator, bags of mulch per yard, mulch coverage calculator, cubic yard of mulch, how much mulch do I need, mulch bag calculator, bulk vs bagged mulch',
  alternates: {
    canonical: '/mulch-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}