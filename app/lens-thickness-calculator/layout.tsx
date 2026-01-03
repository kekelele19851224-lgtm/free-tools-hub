import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lens Thickness Calculator - Compare Lens Index | FreeToolsHub",
  description: "Free lens thickness calculator. Estimate how thick your eyeglass lenses will be based on prescription and lens index. Compare 1.50, 1.60, 1.67, 1.74 options instantly.",
  keywords: [
    "lens thickness calculator",
    "eyeglass lens calculator",
    "lens index comparison",
    "1.67 vs 1.74 lens",
    "high index lens calculator",
    "glasses lens thickness",
    "spectacle lens thickness",
    "lens thickness chart",
    "how thick will my lenses be",
    "thin lens calculator"
  ],
  openGraph: {
    title: "Lens Thickness Calculator - Compare Lens Index | FreeToolsHub",
    description: "Free lens thickness calculator. Estimate how thick your eyeglass lenses will be based on prescription and lens index. Compare 1.50, 1.60, 1.67, 1.74 options instantly.",
    type: "website",
    locale: "en_US",
  },
};

export default function LensThicknessCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}