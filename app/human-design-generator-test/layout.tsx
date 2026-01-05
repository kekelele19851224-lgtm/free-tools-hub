import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Human Design Generator Test - Free Quiz & Career Guide | FreeToolsHub',
  description: 'Take our free Human Design Generator test to discover if you\'re a Generator type. Get career matches, daily strategy tips, and learn about the Generator\'s wait-to-respond approach.',
  alternates: {
    canonical: '/human-design-generator-test',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}