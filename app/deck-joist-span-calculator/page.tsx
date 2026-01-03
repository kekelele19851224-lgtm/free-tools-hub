"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Joist sizes
const joistSizes = [
  { id: "2x6", name: "2×6", depth: 5.5 },
  { id: "2x8", name: "2×8", depth: 7.25 },
  { id: "2x10", name: "2×10", depth: 9.25 },
  { id: "2x12", name: "2×12", depth: 11.25 },
];

// Spacing options
const spacingOptions = [
  { id: "12", name: '12" o.c.', value: 12 },
  { id: "16", name: '16" o.c.', value: 16 },
  { id: "24", name: '24" o.c.', value: 24 },
];

// Wood species
const woodSpecies = [
  { id: "southern-pine", name: "Southern Pine", grade: "No. 2" },
  { id: "douglas-fir", name: "Douglas Fir-Larch", grade: "No. 2" },
  { id: "hem-fir", name: "Hem-Fir", grade: "No. 2" },
  { id: "redwood-cedar", name: "Redwood / Western Cedar", grade: "No. 2" },
];

// IRC 2021 Deck Joist Span Data (40 psf live load, 10 psf dead load)
// Format: { "size-spacing": "span in inches" }
const spanData: Record<string, Record<string, number>> = {
  "southern-pine": {
    "2x6-12": 119, // 9'11"
    "2x6-16": 108, // 9'0"
    "2x6-24": 91,  // 7'7"
    "2x8-12": 157, // 13'1"
    "2x8-16": 142, // 11'10"
    "2x8-24": 116, // 9'8"
    "2x10-12": 194, // 16'2"
    "2x10-16": 168, // 14'0"
    "2x10-24": 137, // 11'5"
    "2x12-12": 216, // 18'0"
    "2x12-16": 198, // 16'6"
    "2x12-24": 162, // 13'6"
  },
  "douglas-fir": {
    "2x6-12": 114, // 9'6"
    "2x6-16": 100, // 8'4"
    "2x6-24": 82,  // 6'10"
    "2x8-12": 150, // 12'6"
    "2x8-16": 131, // 10'11"
    "2x8-24": 107, // 8'11"
    "2x10-12": 188, // 15'8"
    "2x10-16": 163, // 13'7"
    "2x10-24": 133, // 11'1"
    "2x12-12": 216, // 18'0"
    "2x12-16": 194, // 16'2"
    "2x12-24": 158, // 13'2"
  },
  "hem-fir": {
    "2x6-12": 106, // 8'10"
    "2x6-16": 91,  // 7'7"
    "2x6-24": 74,  // 6'2"
    "2x8-12": 140, // 11'8"
    "2x8-16": 120, // 10'0"
    "2x8-24": 98,  // 8'2"
    "2x10-12": 179, // 14'11"
    "2x10-16": 154, // 12'10"
    "2x10-24": 126, // 10'6"
    "2x12-12": 209, // 17'5"
    "2x12-16": 180, // 15'0"
    "2x12-24": 147, // 12'3"
  },
  "redwood-cedar": {
    "2x6-12": 100, // 8'4"
    "2x6-16": 87,  // 7'3"
    "2x6-24": 71,  // 5'11"
    "2x8-12": 132, // 11'0"
    "2x8-16": 114, // 9'6"
    "2x8-24": 93,  // 7'9"
    "2x10-12": 168, // 14'0"
    "2x10-16": 146, // 12'2"
    "2x10-24": 119, // 9'11"
    "2x12-12": 196, // 16'4"
    "2x12-16": 170, // 14'2"
    "2x12-24": 139, // 11'7"
  },
};

// Helper function to format inches to feet-inches
function formatSpan(inches: number): string {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}'${remainingInches}"`;
}

// FAQ data
const faqs = [
  {
    question: "How do I calculate deck joist span?",
    answer: "Deck joist span depends on three factors: joist size (2×6, 2×8, 2×10, 2×12), spacing between joists (12\", 16\", or 24\" on-center), and wood species. The IRC (International Residential Code) provides span tables based on these variables. For example, a Southern Pine 2×10 at 16\" o.c. can span up to 14 feet. Always check local building codes as they may have additional requirements."
  },
  {
    question: "Do I need 2x8 or 2x10 joists for my deck?",
    answer: "The choice between 2×8 and 2×10 depends on your span requirements. For spans up to 10-12 feet, 2×8 joists at 16\" o.c. are typically sufficient. For spans of 12-14+ feet, 2×10 joists are recommended. If using 24\" spacing for cost savings, you may need to upsize to 2×10 even for shorter spans. Consider your decking material too—composite decking often requires 16\" o.c. maximum spacing."
  },
  {
    question: "How far can you span a 2x8 deck joist?",
    answer: "A 2×8 deck joist can span from 7'9\" to 13'1\" depending on wood species and spacing. With Southern Pine at 12\" o.c., maximum span is 13'1\". At 16\" o.c., it's 11'10\". At 24\" o.c., it's 9'8\". Douglas Fir and Hem-Fir have slightly shorter spans. Always use the appropriate span for your specific lumber species and spacing."
  },
  {
    question: "How far can you span a 2x10 deck joist?",
    answer: "A 2×10 deck joist can span from 9'11\" to 16'2\" depending on wood species and spacing. Southern Pine at 12\" o.c. allows the maximum 16'2\" span. At the common 16\" o.c. spacing, Southern Pine 2×10s can span 14'0\", Douglas Fir can span 13'7\", and Hem-Fir can span 12'10\". These are the most versatile joists for medium to large decks."
  },
  {
    question: "What is 16 on-center joist spacing?",
    answer: "\"16 on-center\" (16\" o.c.) means the distance from the center of one joist to the center of the next joist is 16 inches. This is the most common spacing for deck joists and provides a good balance between structural support and material cost. Most composite decking manufacturers require maximum 16\" o.c. spacing. For diagonal decking installations, 12\" o.c. is often required."
  },
  {
    question: "Can I use 2x6 for deck joists?",
    answer: "Yes, 2×6 joists can be used for deck framing, but with significant limitations. Maximum spans range from 5'11\" to 9'11\" depending on species and spacing—suitable only for small decks or short spans. They're commonly used for ground-level decks, stair landings, or areas with additional support. For most residential decks, 2×8 or larger is recommended for better structural performance."
  },
  {
    question: "What is the maximum cantilever for deck joists?",
    answer: "The maximum cantilever (overhang beyond the beam) is typically limited to 1/4 of the joist back-span according to IRC guidelines. For example, if your joist span is 12 feet, the maximum cantilever would be 3 feet. However, specific cantilever limits vary by joist size and back-span length. Always verify with the IRC cantilever tables and local building codes for your specific situation."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer"
        }}
      >
        <h3 style={{ fontWeight: "600", color: "#111827", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function DeckJoistSpanCalculator() {
  // Inputs
  const [joistSize, setJoistSize] = useState<string>("2x10");
  const [spacing, setSpacing] = useState<string>("16");
  const [species, setSpecies] = useState<string>("southern-pine");
  const [desiredSpan, setDesiredSpan] = useState<string>("12");

  // Get span for current selection
  const getSpan = (size: string, space: string, wood: string): number => {
    const key = `${size}-${space}`;
    return spanData[wood]?.[key] || 0;
  };

  const currentSpan = getSpan(joistSize, spacing, species);
  const maxCantilever = Math.floor(currentSpan / 4);
  const totalDepth = currentSpan + maxCantilever;

  // Check if desired span is achievable
  const desiredSpanInches = parseFloat(desiredSpan) * 12;
  const isSpanOk = currentSpan >= desiredSpanInches;

  // Find best options for desired span
  const findBestOptions = () => {
    const options: Array<{ size: string; spacing: string; span: number; cantilever: number }> = [];
    
    joistSizes.forEach(size => {
      spacingOptions.forEach(space => {
        const span = getSpan(size.id, space.id, species);
        if (span >= desiredSpanInches) {
          options.push({
            size: size.name,
            spacing: space.name,
            span: span,
            cantilever: Math.floor(span / 4)
          });
        }
      });
    });

    return options.sort((a, b) => a.span - b.span).slice(0, 4);
  };

  const bestOptions = findBestOptions();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Deck Joist Span Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪵</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Deck Joist Span Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate maximum deck joist spans based on 2024 IRC building codes. Find the right joist size and spacing for your deck project.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>IRC 2024 Code Reference</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                Spans based on <strong>40 psf live load</strong> and <strong>10 psf dead load</strong> per IRC Table R507.6. Always verify with local building codes. Most common: <strong>2×10 at 16&quot; o.c.</strong> spans up to 14&apos; with Southern Pine.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          marginBottom: "40px",
          overflow: "hidden"
        }}>
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Wood Species */}
                <div style={{ backgroundColor: "#FFFBEB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🌲 Wood Species
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {woodSpecies.map((wood) => (
                      <button
                        key={wood.id}
                        onClick={() => setSpecies(wood.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: species === wood.id ? "2px solid #B45309" : "1px solid #E5E7EB",
                          backgroundColor: species === wood.id ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span style={{ fontWeight: "600", color: species === wood.id ? "#B45309" : "#374151", fontSize: "0.9rem" }}>
                          {wood.name}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{wood.grade}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Joist Size */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📏 Joist Size
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {joistSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setJoistSize(size.id)}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "8px",
                          border: joistSize === size.id ? "2px solid #B45309" : "1px solid #E5E7EB",
                          backgroundColor: joistSize === size.id ? "#B45309" : "white",
                          color: joistSize === size.id ? "white" : "#374151",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "1rem"
                        }}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px", textAlign: "center" }}>
                    Nominal lumber dimensions (actual: 1.5&quot; × depth)
                  </p>
                </div>

                {/* Joist Spacing */}
                <div style={{ backgroundColor: "#FFFBEB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    ↔️ Joist Spacing (On-Center)
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {spacingOptions.map((space) => (
                      <button
                        key={space.id}
                        onClick={() => setSpacing(space.id)}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "8px",
                          border: spacing === space.id ? "2px solid #B45309" : "1px solid #E5E7EB",
                          backgroundColor: spacing === space.id ? "#B45309" : "white",
                          color: spacing === space.id ? "white" : "#374151",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.95rem"
                        }}
                      >
                        {space.name}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px", textAlign: "center" }}>
                    16&quot; o.c. is most common • Composite decking often requires ≤16&quot;
                  </p>
                </div>

                {/* Desired Span Input */}
                <div style={{ backgroundColor: "#F3F4F6", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px", fontSize: "1.1rem" }}>
                    🎯 Your Desired Span (Optional)
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="number"
                      value={desiredSpan}
                      onChange={(e) => setDesiredSpan(e.target.value)}
                      style={{
                        width: "100px",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontWeight: "600", color: "#374151" }}>feet</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    {[8, 10, 12, 14, 16].map((ft) => (
                      <button
                        key={ft}
                        onClick={() => setDesiredSpan(ft.toString())}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: desiredSpan === ft.toString() ? "2px solid #B45309" : "1px solid #D1D5DB",
                          backgroundColor: desiredSpan === ft.toString() ? "#FEF3C7" : "white",
                          color: "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {ft}&apos;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#B45309",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Maximum Joist Span
                  </p>
                  <p style={{ fontSize: "3.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatSpan(currentSpan)}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {joistSizes.find(j => j.id === joistSize)?.name} at {spacingOptions.find(s => s.id === spacing)?.name}
                  </p>
                </div>

                {/* Additional Measurements */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#92400E", margin: "0 0 4px 0" }}>Max Cantilever</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#B45309", margin: 0 }}>
                      {formatSpan(maxCantilever)}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      (Span ÷ 4)
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#92400E", margin: "0 0 4px 0" }}>Total Deck Depth</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#B45309", margin: 0 }}>
                      {formatSpan(totalDepth)}
                    </p>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      (Span + Cantilever)
                    </p>
                  </div>
                </div>

                {/* Span Check */}
                <div style={{
                  padding: "16px",
                  backgroundColor: isSpanOk ? "#ECFDF5" : "#FEE2E2",
                  borderRadius: "8px",
                  border: `1px solid ${isSpanOk ? "#A7F3D0" : "#FECACA"}`,
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.25rem" }}>{isSpanOk ? "✅" : "⚠️"}</span>
                    <div>
                      <p style={{ fontWeight: "600", color: isSpanOk ? "#065F46" : "#991B1B", margin: 0, fontSize: "0.9rem" }}>
                        {isSpanOk ? "Your span is achievable!" : "Span exceeds maximum!"}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: isSpanOk ? "#065F46" : "#991B1B", margin: "2px 0 0 0" }}>
                        {isSpanOk 
                          ? `${desiredSpan}' span is within the ${formatSpan(currentSpan)} maximum`
                          : `${desiredSpan}' exceeds ${formatSpan(currentSpan)} - consider larger joists or tighter spacing`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Best Options for Desired Span */}
                {bestOptions.length > 0 && (
                  <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>
                      📋 Options for {desiredSpan}&apos; Span ({woodSpecies.find(w => w.id === species)?.name})
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {bestOptions.map((opt, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            backgroundColor: index === 0 ? "#FEF3C7" : "white",
                            borderRadius: "6px",
                            border: index === 0 ? "2px solid #B45309" : "1px solid #E5E7EB"
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: "600", color: "#374151" }}>{opt.size}</span>
                            <span style={{ color: "#6B7280" }}> @ </span>
                            <span style={{ fontWeight: "600", color: "#374151" }}>{opt.spacing}</span>
                            {index === 0 && <span style={{ marginLeft: "8px", backgroundColor: "#B45309", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "0.65rem" }}>BEST</span>}
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontWeight: "700", color: "#B45309" }}>{formatSpan(opt.span)}</span>
                            <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "8px" }}>+{formatSpan(opt.cantilever)} cant.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Span Chart */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📊 Complete Joist Span Chart (IRC 2024)
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>
            Based on 40 psf live load, 10 psf dead load, No. 2 grade lumber
          </p>
          
          {woodSpecies.map((wood) => (
            <div key={wood.id} style={{ marginBottom: "24px" }}>
              <h3 style={{ 
                fontWeight: "600", 
                color: species === wood.id ? "#B45309" : "#374151", 
                marginBottom: "12px",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                🌲 {wood.name}
                {species === wood.id && <span style={{ backgroundColor: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem" }}>SELECTED</span>}
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
                  <thead>
                    <tr style={{ backgroundColor: species === wood.id ? "#FEF3C7" : "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Joist Size</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>12&quot; o.c.</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>16&quot; o.c.</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>24&quot; o.c.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joistSizes.map((size, idx) => (
                      <tr key={size.id} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "700" }}>{size.name}</td>
                        {["12", "16", "24"].map((sp) => {
                          const span = getSpan(size.id, sp, wood.id);
                          const isSelected = species === wood.id && joistSize === size.id && spacing === sp;
                          return (
                            <td 
                              key={sp} 
                              style={{ 
                                padding: "12px", 
                                border: "1px solid #E5E7EB", 
                                textAlign: "center",
                                backgroundColor: isSelected ? "#B45309" : "transparent",
                                color: isSelected ? "white" : "#374151",
                                fontWeight: isSelected ? "700" : "500"
                              }}
                            >
                              {formatSpan(span)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How to Choose */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🔧 How to Choose the Right Joist Size
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#B45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Measure Your Span</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Determine the distance from ledger board to beam (or beam to beam). This is your required joist span.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#B45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Check Decking Requirements</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Composite decking typically requires 16&quot; o.c. max (12&quot; for diagonal). Wood decking may allow 24&quot; o.c.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#B45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Select Joist Size from Chart</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Find a size where the maximum span exceeds your required span. Consider cost—wider spacing needs fewer joists.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#B45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Verify with Local Codes</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Check local building department requirements. Some jurisdictions have stricter requirements than IRC minimums.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decking Spacing Requirements */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🪵 Decking Material Spacing Requirements
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Decking Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Perpendicular</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Diagonal (45°)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>5/4×6 Wood Decking</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>16&quot; o.c. max</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>12&quot; o.c. max</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>2×6 Wood Decking</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>24&quot; o.c. max</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>16&quot; o.c. max</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Composite Decking</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>16&quot; o.c. max</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>12&quot; o.c. max</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>PVC Decking</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>16&quot; o.c. max</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>12&quot; o.c. max</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "12px" }}>
                * Always check manufacturer specifications as requirements may vary by brand and product line.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FCD34D"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                📐 Quick Reference
              </h3>
              <div style={{ fontSize: "0.85rem", color: "#92400E" }}>
                <p style={{ marginBottom: "8px" }}><strong>Most Common Setup:</strong></p>
                <p style={{ marginBottom: "12px" }}>2×10 @ 16&quot; o.c. = 14&apos; span</p>
                <p style={{ marginBottom: "8px" }}><strong>Cantilever Rule:</strong></p>
                <p style={{ marginBottom: "12px" }}>Max = Span ÷ 4</p>
                <p style={{ marginBottom: "8px" }}><strong>Pressure Treated:</strong></p>
                <p style={{ margin: 0 }}>Required for outdoor decks</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: "#FEE2E2",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FECACA"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>
                ⚠️ Important Notes
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#991B1B", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Always obtain a permit before building</li>
                <li style={{ marginBottom: "8px" }}>Verify local code requirements</li>
                <li style={{ marginBottom: "8px" }}>Use pressure-treated lumber outdoors</li>
                <li>Hire a professional if unsure</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/deck-joist-span-calculator"
              currentCategory="Home"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🪵 <strong>Disclaimer:</strong> This calculator provides estimates based on IRC 2024 Table R507.6 for residential deck construction. Actual requirements may vary based on local building codes, lumber grade, and specific site conditions. Always consult with your local building department and/or a licensed contractor before construction.
          </p>
        </div>
      </div>
    </div>
  );
}