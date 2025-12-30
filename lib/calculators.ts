export interface Calculator {
  name: string;
  description: string;
  url: string;
  category: string;
  type: string;
}

export const calculators: Calculator[] = [
  {
    name: "Quorum Calculator",
    description: "Calculate the minimum number of votes needed for a valid decision in meetings and organizations.",
    url: "/quorum-calculator",
    category: "Business",
    type: "Calculator"
  },
  {
    name: "Productivity Calculator",
    description: "Calculate productivity per hour and per employee",
    url: "/productivity-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Wedding Liquor Calculator",
    description: "Estimate the amount of alcohol needed for your wedding or event based on guest count.",
    url: "/wedding-liquor-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "SHSAT Score Calculator",
    description: "Calculate your SHSAT score and see which NYC Specialized High Schools you qualify for",
    url: "/shsat-score-calculator",
    category: "Education",
    type: "Calculator"
  },
  {
    name: "Black Scholes Calculator",
    description: "Calculate option prices and Greeks using Black-Scholes model",
    url: "/black-scholes-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Bowling Handicap Calculator",
    description: "Calculate your bowling handicap score to level the playing field in competitions.",
    url: "/bowling-handicap-calculator",
    category: "Sports",
    type: "Calculator"
  },
  {
    name: "Pressure Washing Estimate Calculator",
    description: "Calculate pressure washing costs for driveways, houses, decks and more. Get instant estimates per square foot.",
    url: "/pressure-washing-calculator",
    category: "Home",
    type: "Calculator"
  }
];

export const toolTypes = ["All", "Calculator", "Converter", "Counter", "Estimator"];
export const categories = ["All", "Business", "Finance", "Education", "Lifestyle", "Home", "Sports"];
