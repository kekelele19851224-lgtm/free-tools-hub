import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PA Title Insurance Calculator - Pennsylvania TIRBOP Rates 2025 | FreeToolsHub',
  description: 'Free Pennsylvania title insurance calculator using official TIRBOP rates. Calculate costs for home purchases and refinances with endorsement fees. Accurate PA title insurance estimates.',
  alternates: {
    canonical: '/pa-title-insurance-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}