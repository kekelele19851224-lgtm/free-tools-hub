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
    description: "Calculate your SHSAT scaled score and percentile ranking for NYC specialized high schools.",
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
  }
];

export const toolTypes = ["All", "Calculator", "Converter", "Counter", "Estimator"];
export const categories = ["All", "Business", "Finance", "Education", "Lifestyle", "Sports"];
