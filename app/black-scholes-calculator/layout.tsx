import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Black-Scholes Calculator - Free Online Tool | FreeToolsHub',
  description: 'Calculate option prices and Greeks (Delta, Gamma, Theta, Vega, Rho) using the Black‑Scholes model. Supports calls and puts, implied volatility, risk‑free rate, and expiry time.',
  alternates: {
    canonical: '/black-scholes-calculator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
