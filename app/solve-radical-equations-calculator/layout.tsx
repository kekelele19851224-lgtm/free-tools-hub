import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solve Radical Equations Calculator - Step by Step Solutions | FreeToolsHub',
  description: 'Free radical equations calculator with step-by-step solutions. Solve square root and cube root equations, check for extraneous solutions, and learn the solving process.',
  alternates: {
    canonical: '/solve-radical-equations-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}