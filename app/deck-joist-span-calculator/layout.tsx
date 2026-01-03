import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deck Joist Span Calculator - 2024 IRC Code Charts | FreeToolsHub",
  description: "Free deck joist span calculator based on 2024 IRC building codes. Find maximum spans for 2x6, 2x8, 2x10, 2x12 joists at 12, 16, 24 inch spacing. Includes cantilever limits.",
  keywords: [
    "deck joist span calculator",
    "deck joist calculator",
    "2x8 deck joist span",
    "2x10 deck joist span",
    "2x6 deck joist span",
    "joist span chart",
    "16 on-center joist calculator",
    "deck joist spacing",
    "IRC deck joist span table",
    "deck framing calculator"
  ],
  openGraph: {
    title: "Deck Joist Span Calculator - 2024 IRC Code Charts | FreeToolsHub",
    description: "Free deck joist span calculator based on 2024 IRC building codes. Find maximum spans for 2x6, 2x8, 2x10, 2x12 joists at 12, 16, 24 inch spacing.",
    type: "website",
    locale: "en_US",
  },
};

export default function DeckJoistSpanCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}