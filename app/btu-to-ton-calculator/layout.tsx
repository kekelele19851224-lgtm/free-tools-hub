import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many BTU in a Ton? Free BTU to Ton Calculator | FreeToolsHub',
  description: '1 ton = 12,000 BTU/hr. Free BTU to ton calculator for air conditioning. Convert BTU to tons instantly. 3 ton AC = 36,000 BTU. Find the right AC size for your room.',
  keywords: 'how many btu in a ton, btu to ton calculator, btu to ton conversion, 12000 btu to ton, how many btu is a 3 ton ac, ac tonnage calculator, btu calculator, ton to btu, air conditioner size calculator',
  alternates: {
    canonical: '/btu-to-ton-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}