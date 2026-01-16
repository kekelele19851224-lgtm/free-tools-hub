"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// US State pricing data (2026 averages)
const statePricing = [
  { state: "Alabama", code: "AL", pricePerYard: 135, laborPerSqft: 4.5 },
  { state: "Alaska", code: "AK", pricePerYard: 195, laborPerSqft: 7.0 },
  { state: "Arizona", code: "AZ", pricePerYard: 155, laborPerSqft: 5.0 },
  { state: "Arkansas", code: "AR", pricePerYard: 125, laborPerSqft: 4.0 },
  { state: "California", code: "CA", pricePerYard: 195, laborPerSqft: 7.5 },
  { state: "Colorado", code: "CO", pricePerYard: 165, laborPerSqft: 5.5 },
  { state: "Connecticut", code: "CT", pricePerYard: 175, laborPerSqft: 6.5 },
  { state: "Delaware", code: "DE", pricePerYard: 160, laborPerSqft: 5.5 },
  { state: "Florida", code: "FL", pricePerYard: 155, laborPerSqft: 5.0 },
  { state: "Georgia", code: "GA", pricePerYard: 145, laborPerSqft: 4.5 },
  { state: "Hawaii", code: "HI", pricePerYard: 240, laborPerSqft: 9.0 },
  { state: "Idaho", code: "ID", pricePerYard: 150, laborPerSqft: 5.0 },
  { state: "Illinois", code: "IL", pricePerYard: 160, laborPerSqft: 5.5 },
  { state: "Indiana", code: "IN", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Iowa", code: "IA", pricePerYard: 135, laborPerSqft: 4.5 },
  { state: "Kansas", code: "KS", pricePerYard: 135, laborPerSqft: 4.5 },
  { state: "Kentucky", code: "KY", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Louisiana", code: "LA", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Maine", code: "ME", pricePerYard: 165, laborPerSqft: 6.0 },
  { state: "Maryland", code: "MD", pricePerYard: 165, laborPerSqft: 6.0 },
  { state: "Massachusetts", code: "MA", pricePerYard: 185, laborPerSqft: 7.0 },
  { state: "Michigan", code: "MI", pricePerYard: 150, laborPerSqft: 5.0 },
  { state: "Minnesota", code: "MN", pricePerYard: 155, laborPerSqft: 5.5 },
  { state: "Mississippi", code: "MS", pricePerYard: 125, laborPerSqft: 4.0 },
  { state: "Missouri", code: "MO", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Montana", code: "MT", pricePerYard: 155, laborPerSqft: 5.5 },
  { state: "Nebraska", code: "NE", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Nevada", code: "NV", pricePerYard: 165, laborPerSqft: 5.5 },
  { state: "New Hampshire", code: "NH", pricePerYard: 170, laborPerSqft: 6.0 },
  { state: "New Jersey", code: "NJ", pricePerYard: 180, laborPerSqft: 6.5 },
  { state: "New Mexico", code: "NM", pricePerYard: 150, laborPerSqft: 5.0 },
  { state: "New York", code: "NY", pricePerYard: 195, laborPerSqft: 7.5 },
  { state: "North Carolina", code: "NC", pricePerYard: 145, laborPerSqft: 4.5 },
  { state: "North Dakota", code: "ND", pricePerYard: 145, laborPerSqft: 5.0 },
  { state: "Ohio", code: "OH", pricePerYard: 145, laborPerSqft: 4.5 },
  { state: "Oklahoma", code: "OK", pricePerYard: 130, laborPerSqft: 4.0 },
  { state: "Oregon", code: "OR", pricePerYard: 170, laborPerSqft: 6.0 },
  { state: "Pennsylvania", code: "PA", pricePerYard: 160, laborPerSqft: 5.5 },
  { state: "Rhode Island", code: "RI", pricePerYard: 175, laborPerSqft: 6.5 },
  { state: "South Carolina", code: "SC", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "South Dakota", code: "SD", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Tennessee", code: "TN", pricePerYard: 140, laborPerSqft: 4.5 },
  { state: "Texas", code: "TX", pricePerYard: 135, laborPerSqft: 4.0 },
  { state: "Utah", code: "UT", pricePerYard: 155, laborPerSqft: 5.0 },
  { state: "Vermont", code: "VT", pricePerYard: 170, laborPerSqft: 6.0 },
  { state: "Virginia", code: "VA", pricePerYard: 155, laborPerSqft: 5.5 },
  { state: "Washington", code: "WA", pricePerYard: 175, laborPerSqft: 6.5 },
  { state: "West Virginia", code: "WV", pricePerYard: 145, laborPerSqft: 5.0 },
  { state: "Wisconsin", code: "WI", pricePerYard: 150, laborPerSqft: 5.0 },
  { state: "Wyoming", code: "WY", pricePerYard: 155, laborPerSqft: 5.5 },
];

// Concrete strength options
const concreteStrengths = [
  { psi: 2500, name: "2500 PSI (Basic)", multiplier: 0.9, use: "Footings, non-structural" },
  { psi: 3000, name: "3000 PSI (Standard)", multiplier: 1.0, use: "Sidewalks, patios" },
  { psi: 4000, name: "4000 PSI (Recommended)", multiplier: 1.1, use: "Driveways, slabs" },
  { psi: 5000, name: "5000 PSI (Heavy Duty)", multiplier: 1.25, use: "Commercial, heavy loads" },
];

// Common project presets
const projectPresets = [
  { name: "10x10 Patio", length: 10, width: 10, thickness: 4 },
  { name: "12x24 Driveway", length: 24, width: 12, thickness: 4 },
  { name: "20x20 Garage Slab", length: 20, width: 20, thickness: 6 },
  { name: "4x50 Sidewalk", length: 50, width: 4, thickness: 4 },
  { name: "40x60 Shop Floor", length: 60, width: 40, thickness: 6 },
];

// FAQ data
const faqs = [
  {
    question: "How much does concrete cost per cubic yard?",
    answer: "In 2026, concrete costs $125-$195 per cubic yard on average in the US, depending on your location and concrete strength. Texas averages $135/yard, while California and New York can reach $195/yard or more. This price is for ready-mix concrete delivered; add $50-$100 for short-load fees if ordering less than 10 yards."
  },
  {
    question: "How much does concrete cost per square foot?",
    answer: "For a standard 4-inch thick slab, concrete material costs $2.50-$4.50 per square foot. With professional installation, total costs range from $6-$15 per square foot for plain concrete, or $8-$25+ for decorative finishes like stamping or staining. DIY material-only costs average $2-$4 per square foot."
  },
  {
    question: "How much would a 40x60 concrete slab cost?",
    answer: "A 40x60 concrete slab (2,400 sq ft) at 4 inches thick requires about 30 cubic yards of concrete. Material cost: $4,000-$6,000. Professional installation total: $14,000-$36,000 depending on site prep, reinforcement, and finish. DIY material-only cost: approximately $5,000-$8,000 including forms, rebar, and concrete."
  },
  {
    question: "How many bags of concrete do I need?",
    answer: "For bagged concrete: an 80-lb bag yields 0.6 cubic feet, a 60-lb bag yields 0.45 cubic feet. For a 10x10 ft slab at 4 inches thick, you need about 1.23 cubic yards or approximately 56 bags of 80-lb concrete. Bagged concrete is practical for small projects under 1 cubic yard; larger projects should use ready-mix delivery."
  },
  {
    question: "How do I calculate how much concrete I need?",
    answer: "Use this formula: Cubic Yards = (Length × Width × Thickness in inches) ÷ 324. For example, a 12x20 ft driveway at 4 inches: (12 × 20 × 4) ÷ 324 = 2.96 cubic yards. Always add 10% extra for waste and spillage. Our calculator does this automatically and includes cost estimates."
  },
  {
    question: "Is it cheaper to mix your own concrete?",
    answer: "For small projects under 1 cubic yard, bagged concrete can be cheaper ($4-6 per bag vs. minimum delivery fees). For larger projects, ready-mix is more economical and practical. A 10-yard ready-mix delivery costs ~$1,500, while 270 bags of 80-lb concrete for the same volume would cost ~$1,350 plus significant labor time for mixing."
  },
  {
    question: "What thickness should my concrete slab be?",
    answer: "Standard recommendations: 4 inches for patios, walkways, and light vehicle driveways. 5-6 inches for regular vehicle driveways and garage floors. 6-8 inches for heavy equipment or commercial use. Edges and high-stress areas should be thickened to 6-8 inches regardless of slab thickness."
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
        <svg style={{ width: "20px", height: "20px", color: "#6B7280", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function ConcreteCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"slab" | "footing" | "stairs">("slab");

  // Slab calculator
  const [slabLength, setSlabLength] = useState<string>("20");
  const [slabWidth, setSlabWidth] = useState<string>("10");
  const [slabThickness, setSlabThickness] = useState<string>("4");
  const [lengthUnit, setLengthUnit] = useState<"ft" | "m">("ft");

  // Footing calculator
  const [footingShape, setFootingShape] = useState<"round" | "square">("round");
  const [footingDiameter, setFootingDiameter] = useState<string>("12");
  const [footingWidth, setFootingWidth] = useState<string>("12");
  const [footingDepth, setFootingDepth] = useState<string>("36");
  const [footingQty, setFootingQty] = useState<string>("4");

  // Stairs calculator
  const [stairWidth, setStairWidth] = useState<string>("4");
  const [stairRise, setStairRise] = useState<string>("7");
  const [stairRun, setStairRun] = useState<string>("11");
  const [stairCount, setStairCount] = useState<string>("4");
  const [platformDepth, setPlatformDepth] = useState<string>("4");

  // Pricing options
  const [selectedState, setSelectedState] = useState<number>(4); // California default
  const [selectedStrength, setSelectedStrength] = useState<number>(2); // 4000 PSI default
  const [includeLabor, setIncludeLabor] = useState<boolean>(true);
  const [includeDelivery, setIncludeDelivery] = useState<boolean>(true);
  const [wasteFactor, setWasteFactor] = useState<string>("10");

  // Get pricing data
  const stateData = statePricing[selectedState];
  const strengthData = concreteStrengths[selectedStrength];

  // Slab calculations
  const slabLengthFt = lengthUnit === "ft" ? parseFloat(slabLength) || 0 : (parseFloat(slabLength) || 0) * 3.281;
  const slabWidthFt = lengthUnit === "ft" ? parseFloat(slabWidth) || 0 : (parseFloat(slabWidth) || 0) * 3.281;
  const slabThicknessIn = parseFloat(slabThickness) || 0;
  const slabSqft = slabLengthFt * slabWidthFt;
  const slabCubicYards = (slabLengthFt * slabWidthFt * (slabThicknessIn / 12)) / 27;

  // Footing calculations
  const footingDiameterIn = parseFloat(footingDiameter) || 0;
  const footingWidthIn = parseFloat(footingWidth) || 0;
  const footingDepthIn = parseFloat(footingDepth) || 0;
  const footingQuantity = parseInt(footingQty) || 0;
  
  let singleFootingCubicFt = 0;
  if (footingShape === "round") {
    singleFootingCubicFt = Math.PI * Math.pow(footingDiameterIn / 24, 2) * (footingDepthIn / 12);
  } else {
    singleFootingCubicFt = Math.pow(footingWidthIn / 12, 2) * (footingDepthIn / 12);
  }
  const footingCubicYards = (singleFootingCubicFt * footingQuantity) / 27;

  // Stairs calculations
  const stairWidthFt = parseFloat(stairWidth) || 0;
  const stairRiseIn = parseFloat(stairRise) || 0;
  const stairRunIn = parseFloat(stairRun) || 0;
  const stairNumber = parseInt(stairCount) || 0;
  const platformDepthFt = parseFloat(platformDepth) || 0;
  
  // Simplified stairs volume calculation
  let stairsCubicFt = 0;
  for (let i = 1; i <= stairNumber; i++) {
    stairsCubicFt += stairWidthFt * (stairRunIn / 12) * ((i * stairRiseIn) / 12);
  }
  // Add platform
  stairsCubicFt += stairWidthFt * platformDepthFt * ((stairNumber * stairRiseIn) / 12);
  const stairsCubicYards = stairsCubicFt / 27;

  // Select active calculation
  let cubicYards = 0;
  let squareFeet = 0;
  if (activeTab === "slab") {
    cubicYards = slabCubicYards;
    squareFeet = slabSqft;
  } else if (activeTab === "footing") {
    cubicYards = footingCubicYards;
    squareFeet = 0;
  } else {
    cubicYards = stairsCubicYards;
    squareFeet = 0;
  }

  // Add waste factor
  const waste = (parseFloat(wasteFactor) || 0) / 100;
  const cubicYardsWithWaste = cubicYards * (1 + waste);

  // Bag calculations
  const bags80lb = Math.ceil(cubicYardsWithWaste * 27 / 0.6);
  const bags60lb = Math.ceil(cubicYardsWithWaste * 27 / 0.45);

  // Cost calculations
  const basePrice = stateData.pricePerYard * strengthData.multiplier;
  const materialCost = cubicYardsWithWaste * basePrice;
  const deliveryFee = cubicYardsWithWaste < 10 ? 100 : 0; // Short load fee
  const laborCost = squareFeet > 0 ? squareFeet * stateData.laborPerSqft : cubicYardsWithWaste * 150; // Estimate for non-slab

  const totalDIY = materialCost + (includeDelivery ? deliveryFee : 0);
  const totalPro = materialCost + (includeDelivery ? deliveryFee : 0) + (includeLabor ? laborCost : 0);

  // Cost per sq ft (for slabs only)
  const costPerSqft = squareFeet > 0 ? totalPro / squareFeet : 0;

  // Apply preset
  const applyPreset = (preset: typeof projectPresets[0]) => {
    setSlabLength(String(preset.length));
    setSlabWidth(String(preset.width));
    setSlabThickness(String(preset.thickness));
    setLengthUnit("ft");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#64748B" }}>
            <Link href="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0F172A" }}>Concrete Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏗️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#0F172A", margin: 0 }}>
              Concrete Calculator with Pricing
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#475569", maxWidth: "800px" }}>
            Calculate cubic yards, bags needed, and total project cost.
            <strong> The only calculator with state-by-state pricing</strong> — get accurate estimates for your location.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#F0F9FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BAE6FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#0369A1", margin: "0 0 4px 0" }}>
                Quick Rule: <strong>1 cubic yard = 81 sq ft at 4&quot; thick</strong>
              </p>
              <p style={{ color: "#0284C7", margin: 0, fontSize: "0.95rem" }}>
                Average cost: ${stateData.pricePerYard}/yard in {stateData.state} • $6-$15/sq ft installed
              </p>
            </div>
          </div>
        </div>

        {/* Features Badge */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#F0FDF4",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #86EFAC"
          }}>
            <span>✓</span>
            <span style={{ color: "#166534", fontWeight: "600", fontSize: "0.85rem" }}>50 State Pricing</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EFF6FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #93C5FD"
          }}>
            <span>✓</span>
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>DIY vs Pro Comparison</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#FEF3C7",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #FCD34D"
          }}>
            <span>✓</span>
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Yards + Bags + Cost</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("slab")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "slab" ? "#0284C7" : "#E2E8F0",
              color: activeTab === "slab" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🏠 Slab / Patio
          </button>
          <button
            onClick={() => setActiveTab("footing")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "footing" ? "#0284C7" : "#E2E8F0",
              color: activeTab === "footing" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔩 Footings / Columns
          </button>
          <button
            onClick={() => setActiveTab("stairs")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "stairs" ? "#0284C7" : "#E2E8F0",
              color: activeTab === "stairs" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🪜 Stairs
          </button>
        </div>

        {/* Main Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📐 {activeTab === "slab" ? "Slab Dimensions" : activeTab === "footing" ? "Footing Details" : "Stair Dimensions"}
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Tab 1: Slab Calculator */}
              {activeTab === "slab" && (
                <>
                  {/* Quick Presets */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Quick Presets
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {projectPresets.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => applyPreset(preset)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #CBD5E1",
                            backgroundColor: "white",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            color: "#475569"
                          }}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Unit Toggle */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Unit System
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setLengthUnit("ft")}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: lengthUnit === "ft" ? "2px solid #0284C7" : "1px solid #E2E8F0",
                          backgroundColor: lengthUnit === "ft" ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          fontWeight: lengthUnit === "ft" ? "600" : "normal"
                        }}
                      >
                        Feet (ft)
                      </button>
                      <button
                        onClick={() => setLengthUnit("m")}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: lengthUnit === "m" ? "2px solid #0284C7" : "1px solid #E2E8F0",
                          backgroundColor: lengthUnit === "m" ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          fontWeight: lengthUnit === "m" ? "600" : "normal"
                        }}
                      >
                        Meters (m)
                      </button>
                    </div>
                  </div>

                  {/* Length */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Length
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={slabLength}
                        onChange={(e) => setSlabLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "2px solid #0284C7",
                          fontSize: "1rem",
                          backgroundColor: "#F0F9FF",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>{lengthUnit}</span>
                    </div>
                  </div>

                  {/* Width */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Width
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={slabWidth}
                        onChange={(e) => setSlabWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>{lengthUnit}</span>
                    </div>
                  </div>

                  {/* Thickness */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Thickness
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[4, 5, 6, 8].map((t) => (
                        <button
                          key={t}
                          onClick={() => setSlabThickness(String(t))}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: slabThickness === String(t) ? "2px solid #0284C7" : "1px solid #E2E8F0",
                            backgroundColor: slabThickness === String(t) ? "#F0F9FF" : "white",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: slabThickness === String(t) ? "600" : "normal"
                          }}
                        >
                          {t}&quot;
                        </button>
                      ))}
                      <div style={{ position: "relative", flex: "1", minWidth: "80px" }}>
                        <input
                          type="number"
                          value={slabThickness}
                          onChange={(e) => setSlabThickness(e.target.value)}
                          placeholder="Custom"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            paddingRight: "35px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "0.9rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: "0.85rem" }}>in</span>
                      </div>
                    </div>
                    <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                      4&quot; for patios • 5-6&quot; for driveways • 6&quot;+ for heavy loads
                    </p>
                  </div>
                </>
              )}

              {/* Tab 2: Footing Calculator */}
              {activeTab === "footing" && (
                <>
                  {/* Shape Selection */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Footing Shape
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setFootingShape("round")}
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: footingShape === "round" ? "2px solid #0284C7" : "1px solid #E2E8F0",
                          backgroundColor: footingShape === "round" ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          fontWeight: footingShape === "round" ? "600" : "normal"
                        }}
                      >
                        ⚫ Round (Tube)
                      </button>
                      <button
                        onClick={() => setFootingShape("square")}
                        style={{
                          padding: "12px 24px",
                          borderRadius: "8px",
                          border: footingShape === "square" ? "2px solid #0284C7" : "1px solid #E2E8F0",
                          backgroundColor: footingShape === "square" ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          fontWeight: footingShape === "square" ? "600" : "normal"
                        }}
                      >
                        ⬛ Square
                      </button>
                    </div>
                  </div>

                  {/* Diameter or Width */}
                  {footingShape === "round" ? (
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                        Diameter
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[8, 10, 12, 14, 16, 18].map((d) => (
                          <button
                            key={d}
                            onClick={() => setFootingDiameter(String(d))}
                            style={{
                              padding: "8px 14px",
                              borderRadius: "6px",
                              border: footingDiameter === String(d) ? "2px solid #0284C7" : "1px solid #E2E8F0",
                              backgroundColor: footingDiameter === String(d) ? "#F0F9FF" : "white",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              fontWeight: footingDiameter === String(d) ? "600" : "normal"
                            }}
                          >
                            {d}&quot;
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                        Width/Length (square)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={footingWidth}
                          onChange={(e) => setFootingWidth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            paddingRight: "50px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>inches</span>
                      </div>
                    </div>
                  )}

                  {/* Depth */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Depth
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={footingDepth}
                        onChange={(e) => setFootingDepth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "2px solid #0284C7",
                          fontSize: "1rem",
                          backgroundColor: "#F0F9FF",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>inches</span>
                    </div>
                    <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                      Typically 36-48&quot; below frost line
                    </p>
                  </div>

                  {/* Quantity */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Number of Footings
                    </label>
                    <input
                      type="number"
                      value={footingQty}
                      onChange={(e) => setFootingQty(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </>
              )}

              {/* Tab 3: Stairs Calculator */}
              {activeTab === "stairs" && (
                <>
                  {/* Stair Width */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Stair Width
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={stairWidth}
                        onChange={(e) => setStairWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "2px solid #0284C7",
                          fontSize: "1rem",
                          backgroundColor: "#F0F9FF",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>feet</span>
                    </div>
                  </div>

                  {/* Number of Steps */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Number of Steps
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          onClick={() => setStairCount(String(n))}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: stairCount === String(n) ? "2px solid #0284C7" : "1px solid #E2E8F0",
                            backgroundColor: stairCount === String(n) ? "#F0F9FF" : "white",
                            cursor: "pointer",
                            fontWeight: stairCount === String(n) ? "600" : "normal"
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rise & Run */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                        Rise (height)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={stairRise}
                          onChange={(e) => setStairRise(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            paddingRight: "35px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: "0.85rem" }}>in</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                        Run (depth)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={stairRun}
                          onChange={(e) => setStairRun(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            paddingRight: "35px",
                            borderRadius: "8px",
                            border: "1px solid #CBD5E1",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748B", fontSize: "0.85rem" }}>in</span>
                      </div>
                    </div>
                  </div>

                  {/* Platform Depth */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                      Landing/Platform Depth
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={platformDepth}
                        onChange={(e) => setPlatformDepth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>feet</span>
                    </div>
                  </div>
                </>
              )}

              {/* Pricing Options - Common for all tabs */}
              <div style={{
                backgroundColor: "#F0FDF4",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #86EFAC",
                marginTop: "20px"
              }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#166534", fontWeight: "600" }}>
                  💰 Pricing Options
                </h3>

                {/* State Selection */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                    Your State (affects pricing)
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #86EFAC",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {statePricing.map((state, index) => (
                      <option key={index} value={index}>
                        {state.state} (~${state.pricePerYard}/yard)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Concrete Strength */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                    Concrete Strength
                  </label>
                  <select
                    value={selectedStrength}
                    onChange={(e) => setSelectedStrength(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid #86EFAC",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {concreteStrengths.map((strength, index) => (
                      <option key={index} value={index}>
                        {strength.name} - {strength.use}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                    Waste Factor: {wasteFactor}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Checkboxes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeLabor}
                      onChange={(e) => setIncludeLabor(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#166534" }}>Include labor cost</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeDelivery}
                      onChange={(e) => setIncludeDelivery(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span style={{ fontSize: "0.85rem", color: "#166534" }}>Include delivery fee (for &lt;10 yards)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results & Cost Estimate</h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Main Volume Result */}
              <div style={{
                backgroundColor: "#F0F9FF",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "20px",
                border: "2px solid #BAE6FD"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#0369A1" }}>Concrete Needed</p>
                <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#0284C7" }}>
                  {cubicYardsWithWaste.toFixed(2)} yd³
                </div>
                <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#0369A1" }}>
                  {(cubicYardsWithWaste * 27).toFixed(1)} cubic feet • includes {wasteFactor}% waste
                </p>
              </div>

              {/* Bags Conversion */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>80 lb Bags</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#D97706" }}>{bags80lb}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#B45309" }}>~$4-6 each</p>
                </div>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>60 lb Bags</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#D97706" }}>{bags60lb}</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#B45309" }}>~$3-5 each</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#475569", fontWeight: "600" }}>
                  💵 Cost Estimate ({stateData.state})
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                    <span style={{ color: "#64748B" }}>Concrete ({strengthData.psi} PSI)</span>
                    <span style={{ fontWeight: "600", color: "#0F172A" }}>${materialCost.toFixed(0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                    <span style={{ color: "#64748B" }}>Price per yard</span>
                    <span style={{ fontWeight: "600", color: "#0F172A" }}>${basePrice.toFixed(0)}/yd³</span>
                  </div>
                  {includeDelivery && deliveryFee > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                      <span style={{ color: "#991B1B" }}>Short-load fee (&lt;10 yards)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>+${deliveryFee}</span>
                    </div>
                  )}
                  {includeLabor && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#EFF6FF", borderRadius: "6px" }}>
                      <span style={{ color: "#1E40AF" }}>Labor (${stateData.laborPerSqft}/sq ft)</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>+${laborCost.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DIY vs Pro Comparison */}
              <div style={{
                backgroundColor: "#F0FDF4",
                borderRadius: "12px",
                padding: "20px",
                border: "2px solid #86EFAC",
                marginBottom: "20px"
              }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#166534", fontWeight: "600" }}>
                  🔄 DIY vs Professional
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>DIY Cost</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalDIY.toFixed(0)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#166534" }}>materials only</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>Professional</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalPro.toFixed(0)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#166534" }}>materials + labor</p>
                  </div>
                </div>
                {laborCost > 0 && (
                  <div style={{ textAlign: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #86EFAC" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
                      💰 DIY Savings: <strong>${laborCost.toFixed(0)}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Per Square Foot (for slabs) */}
              {activeTab === "slab" && squareFeet > 0 && (
                <div style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#64748B" }}>Total Area</p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#0F172A" }}>{squareFeet.toFixed(0)} sq ft</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#64748B" }}>Cost per sq ft</p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#059669" }}>${costPerSqft.toFixed(2)}/sq ft</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* State Pricing Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📍 Concrete Prices by State (2026)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {statePricing.slice(0, 12).map((state, index) => (
                <div key={index} style={{
                  padding: "12px",
                  backgroundColor: selectedState === index ? "#F0F9FF" : "#F8FAFC",
                  borderRadius: "8px",
                  border: selectedState === index ? "2px solid #0284C7" : "1px solid #E2E8F0"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#0F172A" }}>{state.state}</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B" }}>
                    ${state.pricePerYard}/yard • ${state.laborPerSqft}/sq ft labor
                  </p>
                </div>
              ))}
            </div>
            <p style={{ margin: "16px 0 0 0", fontSize: "0.85rem", color: "#64748B", textAlign: "center" }}>
              Select your state in the calculator above for accurate pricing • All 50 states available
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0F172A", marginBottom: "20px" }}>🏗️ Complete Guide to Concrete Costs</h2>

              <div style={{ color: "#475569", lineHeight: "1.8" }}>
                <p>
                  Whether you&apos;re pouring a patio, driveway, or foundation, understanding concrete costs is crucial for 
                  budgeting your project. This calculator provides <strong>state-specific pricing</strong> — the only 
                  concrete calculator that adjusts costs based on your location.
                </p>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>How to Calculate Concrete Volume</h3>
                <p>
                  The formula is simple: <strong>Length × Width × Thickness ÷ 324 = Cubic Yards</strong> (when using feet and inches). 
                  A quick rule of thumb: one cubic yard covers about 81 square feet at 4 inches thick. Always add 
                  10% extra for waste, spillage, and uneven ground.
                </p>

                <div style={{
                  backgroundColor: "#F0F9FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #BAE6FD"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#0369A1" }}>📐 Quick Formula</p>
                  <p style={{ margin: 0, color: "#0284C7", fontFamily: "monospace", fontSize: "0.95rem" }}>
                    Cubic Yards = (L ft × W ft × Thickness in) ÷ 324<br />
                    Example: (20 × 10 × 4) ÷ 324 = 2.47 yards
                  </p>
                </div>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>Ready-Mix vs Bagged Concrete</h3>
                <p>
                  For projects over 1 cubic yard, <strong>ready-mix delivery</strong> is more economical and practical. 
                  A typical truck delivers 9-11 yards at $125-$195 per yard. For smaller projects, 
                  <strong>bagged concrete</strong> (80 lb bags at $4-6 each) works well but requires significant 
                  mixing time and labor.
                </p>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>Factors Affecting Concrete Cost</h3>
                <p>
                  Several factors influence your total project cost: <strong>Location</strong> (prices vary by 30-50% 
                  between states), <strong>concrete strength</strong> (higher PSI costs more), <strong>delivery distance</strong>, 
                  and <strong>order size</strong> (short-load fees for under 10 yards). Labor typically adds $3-8 per 
                  square foot depending on your region.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#F0F9FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BAE6FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0369A1", marginBottom: "16px" }}>🏗️ Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#0284C7", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>1 yard covers:</strong> 81 sq ft @ 4&quot;</p>
                <p style={{ margin: 0 }}><strong>80 lb bag:</strong> 0.6 cu ft</p>
                <p style={{ margin: 0 }}><strong>Avg. price:</strong> $125-195/yard</p>
                <p style={{ margin: 0 }}><strong>Labor:</strong> $3-8/sq ft</p>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ backgroundColor: "#F0FDF4", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #86EFAC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#15803D", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Order 10% extra for waste</p>
                <p style={{ margin: "0 0 8px 0" }}>• Schedule mid-week for better prices</p>
                <p style={{ margin: "0 0 8px 0" }}>• 4000 PSI for driveways</p>
                <p style={{ margin: 0 }}>• Get 3+ quotes from suppliers</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/concrete-calculator" currentCategory="Construction" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0F172A", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F1F5F9", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748B", textAlign: "center", margin: 0 }}>
            🏗️ <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. Actual costs 
            vary based on supplier pricing, delivery distance, site conditions, and local labor rates. 
            Prices shown are 2026 averages and may have changed. Always get written quotes from local suppliers 
            and contractors before starting your project.
          </p>
        </div>
      </div>
    </div>
  );
}