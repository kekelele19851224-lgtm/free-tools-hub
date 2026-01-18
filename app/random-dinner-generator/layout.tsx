import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Random Dinner Generator - What Should I Eat Tonight? | FreeToolsHub',
  description: 'Free random dinner generator with 75+ recipes. Filter by cuisine, diet (vegetarian, vegan, healthy), cooking time, and servings. End the "what\'s for dinner" dilemma!',
  keywords: 'random dinner generator, what should I eat for dinner, random meal generator, dinner ideas, random dinner generator wheel, dinner generator with ingredients, random food generator, meal planner, dinner generator for two',
  alternates: {
    canonical: '/random-dinner-generator',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}