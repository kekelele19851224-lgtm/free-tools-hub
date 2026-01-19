import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Gallery Wall Template Generator - Layout Planner with Sizes | FreeToolsHub',
  description: 'Free gallery wall template generator online. Plan your perfect photo wall layout with frame positions and measurements. Grid, salon, linear styles. Get hanging guides instantly. No signup required.',
  keywords: 'gallery wall template generator, gallery wall layout generator, gallery wall layout generator with sizes, picture frame layout generator, gallery wall planner, gallery wall layout calculator, photo wall template generator, gallery wall layout tool, free gallery wall template',
  alternates: {
    canonical: '/gallery-wall-template-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}