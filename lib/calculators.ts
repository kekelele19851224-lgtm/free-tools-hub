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
    description: "Calculate how much beer, wine, champagne and liquor you need for your wedding. Get a shopping list with cost estimates.",
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
    description: "Calculate your bowling handicap and adjusted score. Supports 90% of 220, 80% of 230, and custom league formats.",
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
  },
  {
    name: "Yards to Tons Calculator",
    description: "Convert cubic yards to tons for gravel, sand, dirt, mulch, concrete and other materials. Supports bidirectional conversion.",
    url: "/yards-to-tons-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Gravel Driveway Calculator",
    description: "Calculate how much gravel you need for your driveway in cubic yards and tons. Estimate costs for new driveways or top-up refreshes.",
    url: "/gravel-driveway-calculator",
    category: "Construction",
    type: "Calculator"
  },
  {
    name: "Golf Club Length Calculator",
    description: "Find the correct golf club length based on your height and wrist-to-floor measurement. Get personalized recommendations for every club.",
    url: "/golf-club-length-calculator",
    category: "Sports",
    type: "Calculator"
  },
  {
    name: "Rucking Calorie Calculator",
    description: "Calculate how many calories you burn rucking based on weight, pack weight, pace, and terrain. Compare with regular walking.",
    url: "/rucking-calorie-calculator",
    category: "Fitness",
    type: "Calculator"
  },
  {
    name: "Towing Estimate Calculator",
    description: "Estimate towing costs by distance, vehicle type, and time. Compare prices with AAA membership to find the best option.",
    url: "/towing-estimate-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Lawn Mowing Cost Calculator",
    description: "Calculate lawn mowing costs by size, frequency, and services. Get accurate estimates for professional lawn care.",
    url: "/lawn-mowing-cost-calculator",
    category: "Lifestyle",
    type: "Calculator"
  },
  {
    name: "Vehicle Wrap Pricing Calculator",
    description: "Estimate car wrap costs by vehicle type, material, and coverage. Compare DIY vs professional installation prices.",
    url: "/vehicle-wrap-pricing-calculator",
    category: "Finance",
    type: "Calculator"
  },
  {
    name: "Balloon Mortgage Calculator",
    description: "Calculate balloon mortgage payments, balloon payment amount, and see the full amortization schedule. Compare interest-only vs amortized payments.",
    url: "/balloon-mortgage-calculator",
    category: "Finance",
    type: "Calculator"
  }
];

export const toolTypes = ["All", "Calculator", "Converter", "Counter", "Estimator"];
export const categories = ["All", "Business", "Finance", "Education", "Lifestyle", "Home", "Construction", "Sports", "Fitness"];
