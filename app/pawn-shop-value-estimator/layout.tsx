import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pawn Shop Value Estimator - Free Calculator for Items & Gold | FreeToolsHub',
  description: 'Free pawn shop value estimator. Calculate how much pawn shops pay for electronics, jewelry, gold, tools & more. Compare pawn loan vs sell offers. See what your items are worth.',
  keywords: 'pawn shop value estimator, pawn shop value calculator, free pawn shop value estimator, pawn shop calculator, how much will a pawn shop give me, pawn shop jewelry calculator, pawn shop gold calculator, ez pawn estimates, what do pawn shops pay',
  alternates: {
    canonical: '/pawn-shop-value-estimator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}