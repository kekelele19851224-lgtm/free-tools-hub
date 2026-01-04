import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feng Shui Bedroom Layout Generator - Free Room Planner | FreeToolsHub',
  description: 'Free feng shui bedroom layout generator. Get instant bed placement recommendations based on your door and window positions. Find the command position and avoid bad feng shui.',
  alternates: {
    canonical: '/feng-shui-bedroom-layout-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}