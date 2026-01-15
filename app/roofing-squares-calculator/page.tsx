"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Pitch multiplier data
const pitchMultipliers = [
  { pitch: "1:12", rise: 1, multiplier: 1.003, angle: 4.8 },
  { pitch: "2:12", rise: 2, multiplier: 1.014, angle: 9.5 },
  { pitch: "3:12", rise: 3, multiplier: 1.031, angle: 14.0 },
  { pitch: "4:12", rise: 4, multiplier: 1.054, angle: 18.4 },
  { pitch: "5:12", rise: 5, multiplier: 1.083, angle: 22.6 },
  { pitch: "6:12", rise: 6, multiplier: 1.118, angle: 26.6 },
  { pitch: "7:12", rise: 7, multiplier: 1.157, angle: 30.3 },
  { pitch: "8:12", rise: 8, multiplier: 1.202, angle: 33.7 },
  { pitch: "9:12", rise: 9, multiplier: 1.250, angle: 36.9 },
  { pitch: "10:12", rise: 10, multiplier: 1.302, angle: 39.8 },
  { pitch: "11:12", rise: 11, multiplier: 1.357, angle: 42.5 },
  { pitch: "12:12", rise: 12, multiplier: 1.414, angle: 45.0 }
];

// Waste factor options
const wasteOptions = [
  { value: 0.05, label: "5% - Simple roof" },
  { value: 0.10, label: "10% - Standard (recommended)" },
  { value: 0.15, label: "15% - Complex roof" },
  { value: 0.20, label: "20% - Very complex" }
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate roofing squares?",
    answer: "To calculate roofing squares: 1) Measure your roof's footprint area (length × width in feet). 2) Multiply by the pitch multiplier for your roof slope. 3) Divide the total square footage by 100. For example, a 2,000 sq ft footprint with a 6:12 pitch: 2,000 × 1.118 = 2,236 sq ft ÷ 100 = 22.36 squares. Always round up and add 10% for waste."
  },
  {
    question: "How many squares is a 10x10 roof?",
    answer: "A 10×10 roof has a footprint of 100 square feet, which equals exactly 1 roofing square (since 1 square = 100 sq ft). However, if the roof has pitch, you need to multiply by the pitch factor. For example, with a 6:12 pitch: 100 × 1.118 = 111.8 sq ft, or about 1.12 squares."
  },
  {
    question: "What does 17 squares mean in roofing?",
    answer: "17 squares means 1,700 square feet of roof area. In roofing, a 'square' is a unit of measurement equal to 100 square feet (a 10×10 ft area). Contractors use squares to estimate materials and costs. 17 squares would require approximately 51 bundles of shingles (3 bundles per square)."
  },
  {
    question: "How much roofing do I need for a 2000 sq ft house?",
    answer: "For a 2,000 sq ft house, the roof area depends on the roof pitch and overhang. As a rough estimate: with average pitch (6:12), multiply by 1.118 = 2,236 sq ft, then add 10% waste = 2,460 sq ft or about 25 squares. This requires approximately 75 bundles of shingles. Note: roof area is typically 1.1× to 1.5× the house footprint."
  },
  {
    question: "How many bundles of shingles per square?",
    answer: "Standard asphalt shingles require 3 bundles per roofing square. Each bundle covers approximately 33.3 square feet and contains about 29 standard-size shingles. So for 1 square (100 sq ft): 3 bundles = ~87 shingles. Some architectural or specialty shingles may require 4-5 bundles per square."
  },
  {
    question: "What is a roof pitch multiplier?",
    answer: "A roof pitch multiplier (or slope factor) converts flat/horizontal measurements to actual roof surface area. It accounts for the roof's slope. Formula: √(1 + (rise/12)²). For example, a 6:12 pitch has a multiplier of 1.118, meaning the actual roof area is 11.8% larger than the flat footprint. Steeper roofs have higher multipliers."
  },
  {
    question: "How do I measure my roof pitch?",
    answer: "To measure roof pitch: 1) Place a level horizontally against the roof or rafter. 2) Mark 12 inches on the level. 3) Measure vertically from that 12-inch mark to the roof surface. 4) This measurement is your 'rise' - expressed as rise:12 (e.g., if you measure 6 inches, pitch is 6:12). Alternatively, use a pitch finder tool or smartphone app."
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

// Calculate pitch multiplier
function getPitchMultiplier(rise: number): number {
  return Math.sqrt(1 + Math.pow(rise / 12, 2));
}

export default function RoofingSquaresCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"squares" | "shingles" | "cost">("squares");

  // Tab 1: Squares Calculator
  const [inputMode, setInputMode] = useState<"area" | "dimensions">("dimensions");
  const [roofArea, setRoofArea] = useState<string>("2000");
  const [roofLength, setRoofLength] = useState<string>("50");
  const [roofWidth, setRoofWidth] = useState<string>("40");
  const [pitchRise, setPitchRise] = useState<number>(6);
  const [wasteFactor, setWasteFactor] = useState<number>(0.10);

  // Tab 2: Shingles Calculator
  const [squaresInput, setSquaresInput] = useState<string>("");
  const [bundlesPerSquare, setBundlesPerSquare] = useState<number>(3);
  const [includeExtras, setIncludeExtras] = useState<boolean>(true);
  const [ridgeLength, setRidgeLength] = useState<string>("60");

  // Tab 3: Cost Estimator
  const [costSquares, setCostSquares] = useState<string>("");
  const [materialType, setMaterialType] = useState<string>("asphalt");
  const [materialCostPerSq, setMaterialCostPerSq] = useState<string>("150");
  const [laborCostPerSq, setLaborCostPerSq] = useState<string>("200");

  // Calculate roofing squares
  const calcSquares = () => {
    let footprintArea = 0;
    if (inputMode === "area") {
      footprintArea = parseFloat(roofArea) || 0;
    } else {
      footprintArea = (parseFloat(roofLength) || 0) * (parseFloat(roofWidth) || 0);
    }

    const multiplier = getPitchMultiplier(pitchRise);
    const actualArea = footprintArea * multiplier;
    const squares = actualArea / 100;
    const squaresWithWaste = squares * (1 + wasteFactor);

    return {
      footprintArea,
      multiplier,
      actualArea,
      squares,
      squaresWithWaste,
      angle: Math.atan(pitchRise / 12) * (180 / Math.PI)
    };
  };

  // Calculate shingles
  const calcShingles = () => {
    const squares = parseFloat(squaresInput) || calcSquares().squaresWithWaste;
    const totalBundles = Math.ceil(squares * bundlesPerSquare);
    const totalShingles = totalBundles * 29;
    
    // Starter strip: perimeter of roof (rough estimate)
    const perimeterFt = 2 * ((parseFloat(roofLength) || 50) + (parseFloat(roofWidth) || 40));
    const starterBundles = Math.ceil(perimeterFt / 105); // ~105 linear ft per bundle
    
    // Ridge cap
    const ridgeFt = parseFloat(ridgeLength) || 60;
    const ridgeBundles = Math.ceil(ridgeFt / 31); // ~31 linear ft per bundle
    
    // Roofing felt (30#: 200 sq ft per roll)
    const feltRolls = Math.ceil((squares * 100) / 200);
    
    // Nails (~2.5 lbs per square)
    const nailsLbs = Math.ceil(squares * 2.5);

    return {
      squares,
      totalBundles,
      totalShingles,
      starterBundles,
      ridgeBundles,
      feltRolls,
      nailsLbs
    };
  };

  // Calculate cost
  const calcCost = () => {
    const squares = parseFloat(costSquares) || calcSquares().squaresWithWaste;
    const materialCost = squares * (parseFloat(materialCostPerSq) || 150);
    const laborCost = squares * (parseFloat(laborCostPerSq) || 200);
    const totalCost = materialCost + laborCost;
    
    // Price ranges by material type
    let lowMultiplier = 0.8;
    let highMultiplier = 1.3;
    
    if (materialType === "metal") {
      lowMultiplier = 1.0;
      highMultiplier = 1.5;
    } else if (materialType === "tile") {
      lowMultiplier = 1.2;
      highMultiplier = 2.0;
    }

    return {
      squares,
      materialCost,
      laborCost,
      totalCost,
      lowEstimate: totalCost * lowMultiplier,
      highEstimate: totalCost * highMultiplier
    };
  };

  const squaresResult = calcSquares();
  const shinglesResult = calcShingles();
  const costResult = calcCost();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Roofing Squares Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Roofing Squares Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate roofing squares with pitch adjustment. Estimate shingles, bundles, and total roofing costs. 
            Includes pitch multiplier table and waste factor for accurate material ordering.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FFF7ED",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FDBA74"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#9A3412", margin: "0 0 4px 0" }}>
                1 Roofing Square = <strong>100 sq ft</strong> | Standard: <strong>3 bundles per square</strong>
              </p>
              <p style={{ color: "#C2410C", margin: 0, fontSize: "0.95rem" }}>
                A 2,000 sq ft footprint with 6:12 pitch = ~22.4 squares = ~67 bundles of shingles
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("squares")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "squares" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "squares" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Roofing Squares
          </button>
          <button
            onClick={() => setActiveTab("shingles")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "shingles" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "shingles" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🏗️ Shingles & Materials
          </button>
          <button
            onClick={() => setActiveTab("cost")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "cost" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "cost" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Cost Estimator
          </button>
        </div>

        {/* Tab 1: Roofing Squares */}
        {activeTab === "squares" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Roof Dimensions</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Input Mode Toggle */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Input Method
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setInputMode("dimensions")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: inputMode === "dimensions" ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "dimensions" ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: inputMode === "dimensions" ? "#EA580C" : "#374151"
                      }}
                    >
                      Length × Width
                    </button>
                    <button
                      onClick={() => setInputMode("area")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: inputMode === "area" ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "area" ? "#FFF7ED" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: inputMode === "area" ? "#EA580C" : "#374151"
                      }}
                    >
                      Total Sq Ft
                    </button>
                  </div>
                </div>

                {/* Dimensions or Area Input */}
                {inputMode === "dimensions" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        value={roofLength}
                        onChange={(e) => setRoofLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1.1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={roofWidth}
                        onChange={(e) => setRoofWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1.1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Roof Footprint Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={roofArea}
                      onChange={(e) => setRoofArea(e.target.value)}
                      placeholder="Enter square footage"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}

                {/* Roof Pitch */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roof Pitch (Rise : 12)
                  </label>
                  <select
                    value={pitchRise}
                    onChange={(e) => setPitchRise(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {pitchMultipliers.map((p) => (
                      <option key={p.rise} value={p.rise}>
                        {p.pitch} ({p.angle.toFixed(1)}°) - Multiplier: {p.multiplier.toFixed(3)}
                      </option>
                    ))}
                  </select>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Common: 4:12 to 6:12 (standard), 8:12+ (steep)
                  </p>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Waste Factor
                  </label>
                  <select
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {wasteOptions.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                </div>

                {/* Roof Diagram */}
                <div style={{
                  backgroundColor: "#FFF7ED",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "16px",
                  border: "1px solid #FDBA74"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#9A3412", fontWeight: "600" }}>
                    📐 What is Roof Pitch?
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#C2410C" }}>
                    Pitch is expressed as rise:run (e.g., 6:12 means 6 inches rise per 12 inches horizontal run). 
                    Steeper roofs have more surface area than the flat footprint.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Roofing Squares</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #86EFAC"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#166534" }}>Total Roofing Squares (with {(wasteFactor * 100).toFixed(0)}% waste)</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#16A34A" }}>
                    {squaresResult.squaresWithWaste.toFixed(1)}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#15803D" }}>
                    squares (≈ {Math.ceil(squaresResult.squaresWithWaste)} for ordering)
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Calculation Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Footprint Area</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{squaresResult.footprintArea.toLocaleString()} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Pitch Multiplier ({pitchRise}:12)</span>
                      <span style={{ fontWeight: "600", color: "#EA580C" }}>× {squaresResult.multiplier.toFixed(3)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FFF7ED", borderRadius: "6px", border: "1px solid #FDBA74" }}>
                      <span style={{ color: "#9A3412" }}>Actual Roof Area</span>
                      <span style={{ fontWeight: "600", color: "#EA580C" }}>{squaresResult.actualArea.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Base Squares (÷ 100)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{squaresResult.squares.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Waste Factor (+{(wasteFactor * 100).toFixed(0)}%)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>× {(1 + wasteFactor).toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "6px", border: "1px solid #86EFAC" }}>
                      <span style={{ color: "#166534", fontWeight: "600" }}>Total Squares</span>
                      <span style={{ fontWeight: "bold", color: "#16A34A", fontSize: "1.1rem" }}>{squaresResult.squaresWithWaste.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Estimate */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E40AF", fontWeight: "600" }}>
                    📦 Quick Material Estimate
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#1D4ED8" }}>
                    ~{Math.ceil(squaresResult.squaresWithWaste * 3)} bundles of shingles needed<br />
                    (~{Math.ceil(squaresResult.squaresWithWaste * 3 * 29)} individual shingles)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Shingles Calculator */}
        {activeTab === "shingles" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🏗️ Shingles & Materials</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Squares Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roofing Squares
                  </label>
                  <input
                    type="number"
                    value={squaresInput}
                    onChange={(e) => setSquaresInput(e.target.value)}
                    placeholder={`From Tab 1: ${squaresResult.squaresWithWaste.toFixed(1)}`}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Leave blank to use calculated value from Tab 1
                  </p>
                </div>

                {/* Bundles per Square */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Bundles per Square
                  </label>
                  <select
                    value={bundlesPerSquare}
                    onChange={(e) => setBundlesPerSquare(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value={3}>3 bundles (Standard asphalt)</option>
                    <option value={4}>4 bundles (Architectural)</option>
                    <option value={5}>5 bundles (Heavy-duty)</option>
                  </select>
                </div>

                {/* Ridge Length */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Ridge/Hip Length (ft)
                  </label>
                  <input
                    type="number"
                    value={ridgeLength}
                    onChange={(e) => setRidgeLength(e.target.value)}
                    placeholder="Total ridge and hip length"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Include Extras */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px",
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  border: "1px solid #C4B5FD"
                }}>
                  <input
                    type="checkbox"
                    checked={includeExtras}
                    onChange={(e) => setIncludeExtras(e.target.checked)}
                    style={{ width: "20px", height: "20px", accentColor: "#7C3AED" }}
                  />
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#5B21B6" }}>Include accessories</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6D28D9" }}>
                      Starter strips, ridge caps, felt, nails
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📦 Materials Needed</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Shingle Bundles Needed</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#7C3AED" }}>
                    {shinglesResult.totalBundles}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#6D28D9" }}>
                    bundles (~{shinglesResult.totalShingles.toLocaleString()} shingles)
                  </p>
                </div>

                {/* Materials List */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Complete Materials List
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "6px", border: "1px solid #C4B5FD" }}>
                      <span style={{ color: "#5B21B6" }}>🏠 Shingle Bundles</span>
                      <span style={{ fontWeight: "bold", color: "#7C3AED" }}>{shinglesResult.totalBundles} bundles</span>
                    </div>
                    
                    {includeExtras && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>📏 Starter Strip Bundles</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{shinglesResult.starterBundles} bundles</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>🔝 Ridge Cap Bundles</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{shinglesResult.ridgeBundles} bundles</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>📜 Roofing Felt (30#)</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{shinglesResult.feltRolls} rolls</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>🔩 Roofing Nails</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{shinglesResult.nailsLbs} lbs</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Always buy 1-2 extra bundles for repairs and future replacements. 
                    Store them in a cool, dry place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cost Estimator */}
        {activeTab === "cost" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0D9488", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Cost Estimator</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Squares Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roofing Squares
                  </label>
                  <input
                    type="number"
                    value={costSquares}
                    onChange={(e) => setCostSquares(e.target.value)}
                    placeholder={`From Tab 1: ${squaresResult.squaresWithWaste.toFixed(1)}`}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Material Type */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roofing Material
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="asphalt">Asphalt Shingles ($100-$200/sq)</option>
                    <option value="metal">Metal Roofing ($200-$400/sq)</option>
                    <option value="tile">Clay/Concrete Tile ($300-$500/sq)</option>
                  </select>
                </div>

                {/* Material Cost */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Material Cost per Square ($)
                  </label>
                  <input
                    type="number"
                    value={materialCostPerSq}
                    onChange={(e) => setMaterialCostPerSq(e.target.value)}
                    placeholder="150"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Labor Cost */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Labor Cost per Square ($)
                  </label>
                  <input
                    type="number"
                    value={laborCostPerSq}
                    onChange={(e) => setLaborCostPerSq(e.target.value)}
                    placeholder="200"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #5EEAD4"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#0F766E" }}>
                    💡 Labor typically costs 50-70% of total roofing project. 
                    Prices vary by region and roof complexity.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0F766E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Cost Estimate</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #5EEAD4"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#0F766E" }}>Estimated Total Cost</p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#0D9488" }}>
                    ${costResult.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#14B8A6" }}>
                    Range: ${costResult.lowEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${costResult.highEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Cost Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Roofing Squares</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{costResult.squares.toFixed(1)} squares</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Material Cost</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${costResult.materialCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Labor Cost</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${costResult.laborCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F0FDFA", borderRadius: "6px", border: "1px solid #5EEAD4" }}>
                      <span style={{ color: "#0F766E", fontWeight: "600" }}>Total Estimate</span>
                      <span style={{ fontWeight: "bold", color: "#0D9488", fontSize: "1.1rem" }}>${costResult.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                {/* Per Sq Ft */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E40AF", fontWeight: "600" }}>
                    💵 Cost per Square Foot
                  </p>
                  <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#1D4ED8" }}>
                    ${(costResult.totalCost / (costResult.squares * 100)).toFixed(2)} /sq ft
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pitch Multiplier Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Roof Pitch Multiplier Table</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FFF7ED" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Pitch</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Multiplier</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Angle</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Pitch</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Multiplier</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Angle</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{pitchMultipliers[i].pitch}</td>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#EA580C" }}>{pitchMultipliers[i].multiplier.toFixed(3)}</td>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{pitchMultipliers[i].angle}°</td>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{pitchMultipliers[i + 6].pitch}</td>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#EA580C" }}>{pitchMultipliers[i + 6].multiplier.toFixed(3)}</td>
                    <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{pitchMultipliers[i + 6].angle}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "16px 0 0 0", fontSize: "0.85rem", color: "#6B7280", textAlign: "center" }}>
              Formula: Multiplier = √(1 + (rise/12)²) | Actual Area = Footprint × Multiplier
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 Understanding Roofing Squares</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A <strong>roofing square</strong> is the standard unit of measurement in the roofing industry. 
                  One roofing square equals <strong>100 square feet</strong> (a 10×10 ft area). Contractors, 
                  suppliers, and manufacturers all use this unit to estimate materials and costs.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Use Roofing Squares?</h3>
                <p>
                  Using squares simplifies ordering and pricing. Instead of saying &quot;I need materials for 2,500 
                  square feet,&quot; you say &quot;I need 25 squares.&quot; This makes calculations cleaner and reduces 
                  errors in material ordering.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Importance of Roof Pitch</h3>
                <p>
                  Your roof&apos;s pitch (slope) significantly affects the actual surface area. A flat footprint 
                  measurement doesn&apos;t account for the angle of the roof. For example, a house with a 2,000 sq ft 
                  footprint and a 6:12 pitch has an actual roof area of about 2,236 sq ft — that&apos;s 11.8% more 
                  material needed!
                </p>

                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #FDBA74"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#9A3412" }}>📐 Example Calculation</p>
                  <ol style={{ paddingLeft: "20px", margin: 0, color: "#C2410C" }}>
                    <li>House footprint: 50 ft × 40 ft = 2,000 sq ft</li>
                    <li>Roof pitch: 6:12 (multiplier = 1.118)</li>
                    <li>Actual roof area: 2,000 × 1.118 = 2,236 sq ft</li>
                    <li>Roofing squares: 2,236 ÷ 100 = 22.36 squares</li>
                    <li>With 10% waste: 22.36 × 1.10 = 24.6 squares</li>
                    <li>Shingle bundles: 25 × 3 = 75 bundles</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Waste Factor Guidelines</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>5%:</strong> Simple gable roof with minimal cuts</li>
                  <li><strong>10%:</strong> Standard roof (recommended default)</li>
                  <li><strong>15%:</strong> Complex roof with hips, valleys, dormers</li>
                  <li><strong>20%+:</strong> Very complex or historic roof</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FFF7ED", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FDBA74" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#9A3412", marginBottom: "16px" }}>📦 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#C2410C", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>1 Square = 100 sq ft</p>
                <p style={{ margin: 0 }}>1 Square = 3 bundles (asphalt)</p>
                <p style={{ margin: 0 }}>1 Bundle = ~29 shingles</p>
                <p style={{ margin: 0 }}>1 Bundle = ~33.3 sq ft</p>
                <p style={{ margin: 0 }}>Felt roll = 200 sq ft (30#)</p>
              </div>
            </div>

            {/* Common Roof Sizes */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>🏠 Average Roof Sizes</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>Small home: 15-20 squares</p>
                <p style={{ margin: 0 }}>Average home: 20-30 squares</p>
                <p style={{ margin: 0 }}>Large home: 30-40 squares</p>
                <p style={{ margin: 0 }}>Very large: 40+ squares</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/roofing-squares-calculator" currentCategory="Construction" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. 
            Actual material needs may vary based on roof complexity, local building codes, and installation methods. 
            Always consult with a licensed roofing contractor for accurate quotes and professional installation.
          </p>
        </div>
      </div>
    </div>
  );
}