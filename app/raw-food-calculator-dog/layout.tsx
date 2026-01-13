import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Raw Food Calculator for Dogs - Free 80/10/10 BARF Diet Tool | FreeToolsHub',
  description: 'Free raw food calculator for dogs. Calculate daily amounts, get 80/10/10 recipe breakdowns, and estimate monthly costs. Supports PMR and BARF diets for puppies and adults.',
  alternates: {
    canonical: '/raw-food-calculator-dog',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}