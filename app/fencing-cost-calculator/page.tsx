"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Fence types with pricing data (per linear foot, installed)
const fenceTypes = [
  {
    id: "chain-link-galvanized",
    name: "Chain Link (Galvanized)",
    icon: "⛓️",
    prices: { "4": [10, 18], "5": [12, 22], "6": [15, 25], "8": [20, 35] },
    materialOnly: { "4": [5, 10], "5": [6, 12], "6": [8, 15], "8": [12, 22] },
    lifespan: "15-20 years",
    maintenance: "Low",
    pros: ["Affordable", "Durable", "Low maintenance"],
    cons: ["No privacy", "Industrial look"],
  },
  {
    id: "chain-link-vinyl",
    name: "Chain Link (Vinyl-Coated)",
    icon: "⛓️",
    prices: { "4": [15, 25], "5": [18, 30], "6": [20, 35], "8": [30, 45] },
    materialOnly: { "4": [8, 15], "5": [10, 18], "6": [12, 22], "8": [18, 30] },
    lifespan: "20-25 years",
    maintenance: "Low",
    pros: ["Color options", "Rust resistant", "Better appearance"],
    cons: ["No privacy", "More expensive than galvanized"],
  },
  {
    id: "wood-pressure-treated",
    name: "Wood (Pressure-Treated)",
    icon: "🪵",
    prices: { "4": [15, 28], "5": [18, 33], "6": [20, 38], "8": [28, 48] },
    materialOnly: { "4": [8, 15], "5": [10, 18], "6": [12, 22], "8": [18, 30] },
    lifespan: "10-15 years",
    maintenance: "Medium",
    pros: ["Affordable wood option", "Privacy", "Paintable"],
    cons: ["Requires staining", "Can warp/rot"],
  },
  {
    id: "wood-cedar",
    name: "Wood (Cedar)",
    icon: "🪵",
    prices: { "4": [20, 35], "5": [23, 40], "6": [25, 45], "8": [35, 55] },
    materialOnly: { "4": [12, 20], "5": [14, 24], "6": [15, 28], "8": [22, 38] },
    lifespan: "15-20 years",
    maintenance: "Medium",
    pros: ["Natural beauty", "Rot resistant", "Privacy"],
    cons: ["Higher cost", "Needs maintenance"],
  },
  {
    id: "vinyl",
    name: "Vinyl (PVC)",
    icon: "🏠",
    prices: { "4": [22, 35], "5": [25, 40], "6": [28, 45], "8": [35, 55] },
    materialOnly: { "4": [15, 25], "5": [18, 28], "6": [20, 32], "8": [25, 40] },
    lifespan: "20-30 years",
    maintenance: "Very Low",
    pros: ["No painting", "Won't rot", "Many styles"],
    cons: ["Can crack in cold", "Higher upfront cost"],
  },
  {
    id: "aluminum",
    name: "Aluminum",
    icon: "🔩",
    prices: { "4": [25, 40], "5": [28, 45], "6": [30, 50], "8": [40, 65] },
    materialOnly: { "4": [18, 28], "5": [20, 32], "6": [22, 36], "8": [30, 48] },
    lifespan: "20-30 years",
    maintenance: "Low",
    pros: ["Won't rust", "Elegant look", "Durable"],
    cons: ["Less privacy", "Can dent"],
  },
  {
    id: "wrought-iron",
    name: "Wrought Iron",
    icon: "🏛️",
    prices: { "4": [30, 50], "5": [35, 62], "6": [40, 75], "8": [55, 100] },
    materialOnly: { "4": [25, 40], "5": [28, 48], "6": [32, 55], "8": [45, 75] },
    lifespan: "50+ years",
    maintenance: "Medium",
    pros: ["Very durable", "Classic look", "Security"],
    cons: ["Expensive", "Can rust", "No privacy"],
  },
];

// Gate pricing
const gatePrices = {
  walk: { min: 150, max: 400, label: "Walk Gate (3-4ft)" },
  drive: { min: 500, max: 1200, label: "Drive Gate (10-12ft)" },
};

// Acre to perimeter conversion
const acrePerimeters: Record<string, number> = {
  "0.25": 417,
  "0.5": 590,
  "0.75": 722,
  "1": 835,
  "2": 1181,
  "5": 1868,
};

// FAQ data
const faqs = [
  {
    question: "How much does it cost for 200 feet of fencing?",
    answer: "For 200 feet of 6-foot high fencing, costs range from: Chain link ($3,000-$5,000), Wood pressure-treated ($4,000-$7,600), Cedar ($5,000-$9,000), Vinyl ($5,600-$9,000), Aluminum ($6,000-$10,000), and Wrought iron ($8,000-$15,000). These prices include professional installation. Material-only costs are typically 40-60% less."
  },
  {
    question: "How much would a 500 ft fence cost?",
    answer: "A 500-foot fence at 6-foot height typically costs: Chain link galvanized ($7,500-$12,500), Wood privacy ($10,000-$19,000), Vinyl ($14,000-$22,500), or Aluminum ($15,000-$25,000). Add $150-$400 per walk gate and $500-$1,200 per drive gate. Labor is usually 30-40% of total cost."
  },
  {
    question: "How much is 100 linear feet of fencing?",
    answer: "100 linear feet of 6-foot fencing costs approximately: Chain link ($1,500-$2,500), Wood pressure-treated ($2,000-$3,800), Cedar ($2,500-$4,500), Vinyl ($2,800-$4,500), Aluminum ($3,000-$5,000). These are installed prices; DIY material costs are roughly half."
  },
  {
    question: "How much does 100 ft of fence cost to install?",
    answer: "Installation labor for 100 feet of fence runs $500-$1,500 depending on fence type, height, and terrain. Chain link installation is cheapest at $5-$10/ft. Wood and vinyl run $8-$15/ft for labor. Difficult terrain, slopes, or rock can increase labor costs by 25-50%."
  },
  {
    question: "What is the cheapest fence to install?",
    answer: "Chain link fencing is the cheapest option at $10-$25 per linear foot installed for a 6-foot fence. Pressure-treated wood is the cheapest privacy fence at $20-$38 per foot. For DIY, chain link materials cost $5-$15 per foot. Wire fencing is even cheaper but only suitable for rural/farm use."
  },
  {
    question: "How much does a wood fence cost vs vinyl?",
    answer: "Wood fencing costs $20-$45 per linear foot installed (6ft height), while vinyl costs $28-$45 per foot. However, vinyl requires no painting, staining, or sealing, saving $1-$3 per foot annually in maintenance. Over 20 years, vinyl often costs less total despite higher upfront price."
  },
  {
    question: "How do I calculate fencing cost by acre?",
    answer: "To fence by acre, first calculate perimeter. A square acre has approximately 835 linear feet of perimeter. For a quarter acre, it's about 417 feet. Multiply the perimeter by your chosen fence's cost per foot. Example: 1 acre with $25/ft vinyl fence = 835 × $25 = $20,875."
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

export default function FencingCostCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"length" | "acre">("length");

  // Inputs - Length calculator
  const [fenceLength, setFenceLength] = useState<string>("150");
  const [fenceHeight, setFenceHeight] = useState<string>("6");
  const [fenceType, setFenceType] = useState<string>("wood-pressure-treated");
  const [walkGates, setWalkGates] = useState<number>(1);
  const [driveGates, setDriveGates] = useState<number>(0);
  const [includeInstall, setIncludeInstall] = useState<boolean>(true);

  // Inputs - Acre calculator
  const [acreage, setAcreage] = useState<string>("0.25");

  // Get selected fence type data
  const selectedFence = fenceTypes.find(f => f.id === fenceType) || fenceTypes[0];
  const length = parseFloat(fenceLength) || 0;
  const height = fenceHeight as "4" | "5" | "6" | "8";

  // Calculate costs
  const priceRange = includeInstall ? selectedFence.prices[height] : selectedFence.materialOnly[height];
  const fenceCostMin = length * priceRange[0];
  const fenceCostMax = length * priceRange[1];

  const gateCostMin = (walkGates * gatePrices.walk.min) + (driveGates * gatePrices.drive.min);
  const gateCostMax = (walkGates * gatePrices.walk.max) + (driveGates * gatePrices.drive.max);

  const totalMin = fenceCostMin + gateCostMin;
  const totalMax = fenceCostMax + gateCostMax;

  const costPerFootMin = length > 0 ? totalMin / length : 0;
  const costPerFootMax = length > 0 ? totalMax / length : 0;

  // Acre calculations
  const acrePerimeter = acrePerimeters[acreage] || Math.round(4 * Math.sqrt(parseFloat(acreage) * 43560));
  const acreCostMin = acrePerimeter * priceRange[0];
  const acreCostMax = acrePerimeter * priceRange[1];

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Fencing Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Fencing Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate fence installation costs for wood, vinyl, chain link, aluminum, and wrought iron. Compare materials and get instant pricing.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A7F3D0"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Reference (6ft fence, installed)</p>
              <p style={{ color: "#065F46", margin: 0, fontSize: "0.95rem" }}>
                <strong>Chain Link:</strong> $15-25/ft • <strong>Wood:</strong> $20-45/ft • <strong>Vinyl:</strong> $28-45/ft • <strong>Aluminum:</strong> $30-50/ft
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
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setActiveTab("length")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "length" ? "#059669" : "transparent",
                color: activeTab === "length" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              📏 By Linear Feet
            </button>
            <button
              onClick={() => setActiveTab("acre")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "acre" ? "#059669" : "transparent",
                color: activeTab === "acre" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🌳 By Acre
            </button>
          </div>

          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Fence Length or Acreage */}
                {activeTab === "length" ? (
                  <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      📏 Fence Length
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                      <input
                        type="number"
                        value={fenceLength}
                        onChange={(e) => setFenceLength(e.target.value)}
                        style={{
                          width: "120px",
                          padding: "12px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          textAlign: "center"
                        }}
                      />
                      <span style={{ fontWeight: "600", color: "#374151" }}>linear feet</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[100, 150, 200, 300, 500].map((ft) => (
                        <button
                          key={ft}
                          onClick={() => setFenceLength(ft.toString())}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: fenceLength === ft.toString() ? "2px solid #059669" : "1px solid #D1D5DB",
                            backgroundColor: fenceLength === ft.toString() ? "#ECFDF5" : "white",
                            color: fenceLength === ft.toString() ? "#059669" : "#374151",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.85rem"
                          }}
                        >
                          {ft} ft
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      🌳 Property Size (Acres)
                    </h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {Object.keys(acrePerimeters).map((acre) => (
                        <button
                          key={acre}
                          onClick={() => setAcreage(acre)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: acreage === acre ? "2px solid #059669" : "1px solid #D1D5DB",
                            backgroundColor: acreage === acre ? "#059669" : "white",
                            color: acreage === acre ? "white" : "#374151",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.9rem"
                          }}
                        >
                          {acre} acre{parseFloat(acre) !== 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "12px" }}>
                      {acreage} acre = approx. <strong>{acrePerimeter} linear feet</strong> perimeter (square lot)
                    </p>
                  </div>
                )}

                {/* Fence Height */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📐 Fence Height
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {["4", "5", "6", "8"].map((h) => (
                      <button
                        key={h}
                        onClick={() => setFenceHeight(h)}
                        style={{
                          padding: "14px 8px",
                          borderRadius: "8px",
                          border: fenceHeight === h ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: fenceHeight === h ? "#059669" : "white",
                          color: fenceHeight === h ? "white" : "#374151",
                          cursor: "pointer",
                          fontWeight: "700",
                          fontSize: "1rem"
                        }}
                      >
                        {h} ft
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px", textAlign: "center" }}>
                    6ft is most common for privacy • 4ft for decorative
                  </p>
                </div>

                {/* Fence Type */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🪵 Fence Material
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {fenceTypes.map((fence) => (
                      <button
                        key={fence.id}
                        onClick={() => setFenceType(fence.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: fenceType === fence.id ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: fenceType === fence.id ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span style={{ fontWeight: "600", color: fenceType === fence.id ? "#059669" : "#374151", fontSize: "0.9rem" }}>
                          {fence.icon} {fence.name}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                          ${fence.prices[height][0]}-${fence.prices[height][1]}/ft
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gates */}
                {activeTab === "length" && (
                  <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      🚪 Gates
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px" }}>
                          Walk Gates (3-4ft)
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => setWalkGates(Math.max(0, walkGates - 1))} style={{ width: "36px", height: "36px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "1.2rem" }}>-</button>
                          <span style={{ width: "40px", textAlign: "center", fontWeight: "700", fontSize: "1.1rem" }}>{walkGates}</span>
                          <button onClick={() => setWalkGates(Math.min(5, walkGates + 1))} style={{ width: "36px", height: "36px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px" }}>
                          Drive Gates (10-12ft)
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => setDriveGates(Math.max(0, driveGates - 1))} style={{ width: "36px", height: "36px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "1.2rem" }}>-</button>
                          <span style={{ width: "40px", textAlign: "center", fontWeight: "700", fontSize: "1.1rem" }}>{driveGates}</span>
                          <button onClick={() => setDriveGates(Math.min(3, driveGates + 1))} style={{ width: "36px", height: "36px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "1.2rem" }}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Installation Toggle */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px 24px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0", fontSize: "1rem" }}>
                        🔧 Include Professional Installation
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                        Labor typically adds 30-40% to material cost
                      </p>
                    </div>
                    <button
                      onClick={() => setIncludeInstall(!includeInstall)}
                      style={{
                        width: "56px",
                        height: "28px",
                        borderRadius: "14px",
                        backgroundColor: includeInstall ? "#059669" : "#D1D5DB",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background-color 0.2s"
                      }}
                    >
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "2px",
                        left: includeInstall ? "30px" : "2px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#059669",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Total Estimated Cost
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {activeTab === "length" 
                      ? `${formatCurrency(totalMin)} - ${formatCurrency(totalMax)}`
                      : `${formatCurrency(acreCostMin)} - ${formatCurrency(acreCostMax)}`
                    }
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {selectedFence.name} • {fenceHeight}ft height • {activeTab === "length" ? `${fenceLength} ft` : `${acreage} acre (${acrePerimeter} ft)`}
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>
                    📋 Cost Breakdown
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ color: "#6B7280" }}>Fence ({activeTab === "length" ? fenceLength : acrePerimeter} ft)</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {activeTab === "length" 
                          ? `${formatCurrency(fenceCostMin)} - ${formatCurrency(fenceCostMax)}`
                          : `${formatCurrency(acreCostMin)} - ${formatCurrency(acreCostMax)}`
                        }
                      </span>
                    </div>
                    {activeTab === "length" && (walkGates > 0 || driveGates > 0) && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>
                          Gates ({walkGates > 0 ? `${walkGates} walk` : ""}{walkGates > 0 && driveGates > 0 ? ", " : ""}{driveGates > 0 ? `${driveGates} drive` : ""})
                        </span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(gateCostMin)} - {formatCurrency(gateCostMax)}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#6B7280" }}>Cost Per Linear Foot</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Material Info */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>
                    {selectedFence.icon} {selectedFence.name}
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 2px 0" }}>Lifespan</p>
                      <p style={{ fontWeight: "600", color: "#059669", margin: 0 }}>{selectedFence.lifespan}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 2px 0" }}>Maintenance</p>
                      <p style={{ fontWeight: "600", color: "#059669", margin: 0 }}>{selectedFence.maintenance}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {selectedFence.pros.map((pro, i) => (
                      <span key={i} style={{ fontSize: "0.75rem", backgroundColor: "#D1FAE5", color: "#065F46", padding: "4px 8px", borderRadius: "4px" }}>
                        ✓ {pro}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compare All Materials */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>
                    📊 Compare All Materials ({fenceHeight}ft)
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {fenceTypes.map((fence) => {
                      const price = fence.prices[height];
                      const isSelected = fence.id === fenceType;
                      return (
                        <div
                          key={fence.id}
                          onClick={() => setFenceType(fence.id)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 12px",
                            backgroundColor: isSelected ? "#ECFDF5" : "white",
                            borderRadius: "6px",
                            border: isSelected ? "2px solid #059669" : "1px solid #E5E7EB",
                            cursor: "pointer"
                          }}
                        >
                          <span style={{ fontSize: "0.85rem", color: isSelected ? "#059669" : "#374151", fontWeight: isSelected ? "600" : "400" }}>
                            {fence.icon} {fence.name}
                          </span>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: isSelected ? "#059669" : "#6B7280" }}>
                            ${price[0]}-${price[1]}/ft
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Comparison Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📊 Fence Cost Comparison (200 ft, 6ft height, installed)
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>
            Average costs for a typical backyard fence project
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cost/Foot</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Total (200ft)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Lifespan</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {fenceTypes.map((fence, idx) => (
                  <tr key={fence.id} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                      {fence.icon} {fence.name}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      ${fence.prices["6"][0]} - ${fence.prices["6"][1]}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>
                      {formatCurrency(200 * fence.prices["6"][0])} - {formatCurrency(200 * fence.prices["6"][1])}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {fence.lifespan}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {fence.maintenance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Cost Factors */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💰 Factors That Affect Fence Cost
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Material Type</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Chain link is cheapest ($10-25/ft), wood mid-range ($20-45/ft), vinyl and aluminum higher ($25-55/ft), wrought iron most expensive ($40-100/ft).
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Fence Height</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Taller fences cost more. A 6ft fence costs 20-30% more than a 4ft fence. An 8ft fence can cost 50%+ more than standard height.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Terrain & Access</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Slopes, rocks, tree roots, and difficult access can increase labor costs by 25-50%. Permits may be required ($50-$500).
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Gates & Extras</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Walk gates add $150-400 each. Drive gates cost $500-1,500. Post caps, staining, and decorative elements add to cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acre Reference */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🌳 Fence by Acre Reference
              </h2>
              <p style={{ color: "#6B7280", marginBottom: "16px", fontSize: "0.9rem" }}>
                Perimeter calculations assume a square lot shape
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Lot Size</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Perimeter</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Chain Link</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Wood</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Vinyl</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(acrePerimeters).slice(0, 4).map(([acre, perim], idx) => (
                      <tr key={acre} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{acre} acre</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{perim} ft</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(perim * 20)}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(perim * 32)}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(perim * 38)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px" }}>
                * Based on 6ft height, average installed pricing. Actual costs vary by location and contractor.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Tips */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                💡 Money-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#065F46", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Get 3+ quotes from contractors</li>
                <li style={{ marginBottom: "8px" }}>Consider DIY for chain link (save 40-50%)</li>
                <li style={{ marginBottom: "8px" }}>Schedule in off-season (fall/winter)</li>
                <li style={{ marginBottom: "8px" }}>Share costs with neighbors</li>
                <li>Remove old fence yourself ($3-5/ft saved)</li>
              </ul>
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FCD34D"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Before You Start
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Check local permit requirements</li>
                <li style={{ marginBottom: "8px" }}>Verify property lines (survey)</li>
                <li style={{ marginBottom: "8px" }}>Call 811 before digging</li>
                <li>Review HOA restrictions</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/fencing-cost-calculator"
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
            🏡 <strong>Disclaimer:</strong> Cost estimates are based on national averages and may vary significantly by location, contractor, terrain, and material quality. Always obtain multiple quotes from licensed contractors for accurate pricing. Prices reflect 2025 market rates.
          </p>
        </div>
      </div>
    </div>
  );
}