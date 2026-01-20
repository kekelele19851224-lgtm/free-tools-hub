import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Many Pounds in 100 Gallon Propane Tank? Free Calculator | FreeToolsHub',
  description: 'Find how many pounds in a 100 gallon propane tank (424 lbs). Free calculator converts gallons to pounds, estimates fill cost & usage time. 100 lb tank holds 23.6 gallons.',
  keywords: 'how many pounds in a 100 gallon propane tank, 100 gallon propane tank weight, how many gallons in 100 lb propane tank, propane tank calculator, cost to fill 100 lb propane tank, how long will 100 lb propane tank last, propane weight calculator, 100 gallon propane tank cost',
  alternates: {
    canonical: '/propane-tank-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}