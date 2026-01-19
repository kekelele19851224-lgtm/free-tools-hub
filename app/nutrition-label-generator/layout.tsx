import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Nutrition Label Generator - FDA Compliant Nutrition Facts Maker | FreeToolsHub',
  description: 'Free nutrition label generator online. Create FDA-compliant Nutrition Facts labels for food products. Multiple formats: Standard, Simplified, Linear, Tabular. Download PNG instantly. No signup required.',
  keywords: 'free nutrition label generator, nutrition facts generator, FDA nutrition label generator, nutrition label maker, food label generator, nutrition facts label generator free, nutrition label template, editable nutrition facts template, nutrition label generator with ingredients, nutrition label generator from recipe',
  alternates: {
    canonical: '/nutrition-label-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}