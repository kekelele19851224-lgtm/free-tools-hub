import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hypothesis Generator - Free Null & Alternative Hypothesis Maker | FreeToolsHub',
  description: 'Generate research hypotheses for free. Create null and alternative hypotheses, simple if-then statements, and complete research hypotheses for your thesis, dissertation, or research paper.',
  alternates: {
    canonical: '/hypothesis-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}