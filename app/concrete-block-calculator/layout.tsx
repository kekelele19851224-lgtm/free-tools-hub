import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concrete Block Calculator - Free CMU Estimator with Opening Deductions | FreeToolsHub',
  description: 'Free concrete block calculator to estimate CMU blocks, mortar, and costs. The only calculator that deducts door & window openings automatically. Includes core fill calculator and block size reference.',
  alternates: {
    canonical: '/concrete-block-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}