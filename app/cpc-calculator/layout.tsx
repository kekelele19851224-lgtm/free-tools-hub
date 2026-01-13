import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CPC Calculator - Free Cost Per Click Calculator for Google Ads | FreeToolsHub',
  description: 'Free CPC calculator. Calculate cost per click, CTR, CPM for Google Ads, Facebook, Amazon. Plan your ad budget and analyze campaign performance with industry benchmarks.',
  alternates: {
    canonical: '/cpc-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}