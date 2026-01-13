"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Material types with densities (tons per cubic yard)
const materials = [
  { id: "gravel", name: "Gravel (Standard)", density: 1.5, icon: "🪨" },
  { id: "pea_gravel", name: "Pea Gravel", density: 1.5, icon: "⚪" },
  { id: "crushed_stone", name: "Crushed Stone", density: 1.4, icon: "🔶" },
  { id: "limestone", name: "Limestone", density: 1.5, icon: "⬜" },
  { id: "sand", name: "Sand", density: 1.4, icon: "🏖️" },
  { id: "topsoil", name: "Topsoil", density: 1.15, icon: "🌱" },
  { id: "mulch", name: "Mulch", density: 0.5, icon: "🍂" },
  { id: "river_rock", name: "River Rock", density: 1.55, icon: "💎" },
  { id: "decomposed_granite", name: "Decomposed Granite", density: 1.4, icon: "🟤" },
  { id: "custom", name: "Custom Density", density: 1.5, icon: "⚙️" }
];

// Shape options
const shapes = [
  { id: "rectangle", name: "Rectangle / Square", icon: "▭" },
  { id: "circle", name: "Circle", icon: "○" },
  { id: "triangle", name: "Triangle", icon: "△" }
];

// Coverage reference data
const coverageData = [
  { depth: "1 inch", sqFtPerTon: 200 },
  { depth: "2 inches", sqFtPerTon: 100 },
  { depth: "3 inches", sqFtPerTon: 67 },
  { depth: "4 inches", sqFtPerTon: 50 },
  { depth: "6 inches", sqFtPerTon: 33 }
];

// FAQ data
const faqs = [
  {
    question: "How much gravel do I need?",
    answer: "To calculate how much gravel you need: 1) Measure your area's length and width in feet, 2) Determine the depth you want (typically 2-4 inches for driveways, 1-2 inches for walkways), 3) Calculate volume: Length × Width × Depth (in feet), 4) Convert to cubic yards by dividing by 27, 5) Multiply by 1.5 (average gravel density) to get tons. Our calculator does all this automatically—just enter your dimensions!"
  },
  {
    question: "How many tons are in a cubic yard of gravel?",
    answer: "A cubic yard of gravel typically weighs between 1.4 to 1.7 tons, depending on the type and moisture content. Standard gravel averages about 1.5 tons per cubic yard. Pea gravel is similar at 1.5 tons/yd³, while crushed stone is slightly lighter at 1.4 tons/yd³. Sand typically weighs 1.3-1.5 tons per cubic yard. Always check with your supplier for exact densities."
  },
  {
    question: "How much area does 1 ton of gravel cover?",
    answer: "The coverage depends on the depth: At 1\" depth, 1 ton covers about 200 sq ft. At 2\" depth, 1 ton covers about 100 sq ft. At 3\" depth, 1 ton covers about 67 sq ft. At 4\" depth, 1 ton covers about 50 sq ft. For driveways, a 2-4\" depth is recommended, while pathways typically need 1-2\" depth."
  },
  {
    question: "What is the formula for aggregate calculation?",
    answer: "The formula is: Volume (cubic yards) = (Length × Width × Depth) ÷ 27, where all measurements are in feet. To convert to tons: Weight (tons) = Volume (cubic yards) × Density (tons/yd³). For example: A 10ft × 20ft area at 3\" (0.25ft) depth = (10 × 20 × 0.25) ÷ 27 = 1.85 cubic yards. At 1.5 tons/yd³ density = 2.78 tons of gravel needed."
  },
  {
    question: "Should I order extra aggregate material?",
    answer: "Yes! We recommend ordering 5-10% extra material to account for: settling and compaction (can reduce volume by up to 30%), spillage during delivery, uneven ground that requires more fill, future maintenance needs. Our calculator automatically adds a 10% buffer to help ensure you have enough material."
  },
  {
    question: "How deep should gravel be for a driveway?",
    answer: "For driveways, the recommended total depth is 4-6 inches, typically applied in layers: Base layer of larger crushed stone (3-4\"), top layer of smaller gravel (2-3\"). For walkways and pathways, 2-3 inches is usually sufficient. For decorative purposes only, 1-2 inches may be enough. Heavier traffic areas need deeper coverage."
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

export default function AggregateCalculator() {
  // State
  const [shape, setShape] = useState<string>("rectangle");
  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("10");
  const [diameter, setDiameter] = useState<string>("10");
  const [baseLength, setBaseLength] = useState<string>("10");
  const [height, setHeight] = useState<string>("8");
  const [depth, setDepth] = useState<string>("3");
  const [depthUnit, setDepthUnit] = useState<string>("inches");
  const [material, setMaterial] = useState<string>("gravel");
  const [customDensity, setCustomDensity] = useState<string>("1.5");
  const [pricePerTon, setPricePerTon] = useState<string>("");

  // Get selected material
  const selectedMaterial = materials.find(m => m.id === material) || materials[0];
  const density = material === "custom" ? (parseFloat(customDensity) || 1.5) : selectedMaterial.density;

  // Calculate area based on shape
  const calculateArea = (): number => {
    switch (shape) {
      case "rectangle":
        return (parseFloat(length) || 0) * (parseFloat(width) || 0);
      case "circle":
        const radius = (parseFloat(diameter) || 0) / 2;
        return Math.PI * radius * radius;
      case "triangle":
        return 0.5 * (parseFloat(baseLength) || 0) * (parseFloat(height) || 0);
      default:
        return 0;
    }
  };

  // Calculate volume
  const areaSquareFeet = calculateArea();
  const depthInFeet = depthUnit === "inches" 
    ? (parseFloat(depth) || 0) / 12 
    : (parseFloat(depth) || 0);
  const volumeCubicFeet = areaSquareFeet * depthInFeet;
  const volumeCubicYards = volumeCubicFeet / 27;

  // Calculate weight
  const weightTons = volumeCubicYards * density;
  const weightWithExtra = weightTons * 1.1; // 10% extra

  // Calculate cost
  const price = parseFloat(pricePerTon) || 0;
  const totalCost = weightWithExtra * price;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Aggregate Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Aggregate Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much gravel, sand, crushed stone, or other aggregate materials you need. 
            Get volume in cubic yards and weight in tons with cost estimates.
          </p>
        </div>

        {/* Quick Reference Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Reference: 1 Ton of Gravel Covers...</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>200 sq ft</strong> @ 1&quot; depth | <strong>100 sq ft</strong> @ 2&quot; depth | <strong>67 sq ft</strong> @ 3&quot; depth | <strong>50 sq ft</strong> @ 4&quot; depth
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Project Dimensions</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Shape Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Area Shape
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id)}
                      style={{
                        flex: 1,
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: shape === s.id ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: shape === s.id ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{s.icon}</div>
                      <div style={{ fontSize: "0.8rem", color: shape === s.id ? "#D97706" : "#374151", fontWeight: "500" }}>{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions based on shape */}
              {shape === "rectangle" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Length (ft)
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Width (ft)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              )}

              {shape === "circle" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                    Diameter (ft)
                  </label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              )}

              {shape === "triangle" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Base (ft)
                    </label>
                    <input
                      type="number"
                      value={baseLength}
                      onChange={(e) => setBaseLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Height (ft)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Depth */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                  Depth
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <select
                    value={depthUnit}
                    onChange={(e) => setDepthUnit(e.target.value)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="inches">inches</option>
                    <option value="feet">feet</option>
                  </select>
                </div>
              </div>

              {/* Material Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Material Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: material === m.id ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: material === m.id ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <span>{m.icon}</span>
                      <div>
                        <div style={{ fontSize: "0.8rem", fontWeight: "600", color: material === m.id ? "#D97706" : "#374151" }}>{m.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>{m.density} tons/yd³</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Density */}
              {material === "custom" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                    Custom Density (tons/cubic yard)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={customDensity}
                    onChange={(e) => setCustomDensity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              )}

              {/* Price (Optional) */}
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                  Price per Ton (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                  <input
                    type="number"
                    value={pricePerTon}
                    onChange={(e) => setPricePerTon(e.target.value)}
                    placeholder="e.g., 45"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 28px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Material Needed</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Area */}
              <div style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B7280" }}>Area</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>
                  {areaSquareFeet.toFixed(1)} sq ft
                </p>
              </div>

              {/* Volume */}
              <div style={{
                backgroundColor: "#EFF6FF",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #BFDBFE"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1D4ED8", fontWeight: "600" }}>Volume</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                      {volumeCubicYards.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3B82F6" }}>cubic yards</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                      {volumeCubicFeet.toFixed(1)}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3B82F6" }}>cubic feet</p>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div style={{
                backgroundColor: "#ECFDF5",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px",
                border: "1px solid #6EE7B7"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46", fontWeight: "600" }}>
                  Weight ({selectedMaterial.name} @ {density} tons/yd³)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ textAlign: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>Exact Amount</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                      {weightTons.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#059669" }}>tons</p>
                  </div>
                  <div style={{ textAlign: "center", padding: "12px", backgroundColor: "#D1FAE5", borderRadius: "8px", border: "2px solid #059669" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#065F46" }}>Recommended (+10%)</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#047857" }}>
                      {weightWithExtra.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>tons</p>
                  </div>
                </div>
              </div>

              {/* Cost Estimate */}
              {price > 0 && (
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#92400E", fontWeight: "600" }}>💰 Estimated Cost</p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>
                    ${totalCost.toFixed(2)}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#B45309" }}>
                    ({weightWithExtra.toFixed(2)} tons × ${price}/ton)
                  </p>
                </div>
              )}

              {/* Tips */}
              <div style={{
                backgroundColor: "#F5F3FF",
                borderRadius: "8px",
                padding: "12px 16px"
              }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                  <strong>💡 Tip:</strong> We&apos;ve added 10% extra to account for settling, spillage, and uneven ground. 
                  For compacted areas (driveways), consider adding up to 30% more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📏 Coverage Reference: How Much Does 1 Ton Cover?</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Depth</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Coverage (sq ft/ton)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>1 inch</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>~200 sq ft</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Decorative topping, light coverage</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>2 inches</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>~100 sq ft</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Walkways, garden paths</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>3 inches</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>~67 sq ft</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Patios, light traffic areas</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>4 inches</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>~50 sq ft</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Driveways, parking areas</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>6 inches</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>~33 sq ft</td>
                  <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Heavy traffic, base layer</td>
                </tr>
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              *Coverage based on standard gravel density of 1.5 tons/cubic yard. Actual coverage may vary by material type.
            </p>
          </div>
        </div>

        {/* Material Density Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⚖️ Material Density Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Tons/Cubic Yard</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Lbs/Cubic Yard</th>
                </tr>
              </thead>
              <tbody>
                {materials.filter(m => m.id !== "custom").map((m, idx) => (
                  <tr key={m.id} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>
                      <span style={{ marginRight: "8px" }}>{m.icon}</span>{m.name}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706", fontWeight: "600" }}>{m.density}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{(m.density * 2000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪨 Understanding Aggregate Materials</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Aggregate</strong> refers to granular materials like gravel, sand, and crushed stone used in construction 
                  and landscaping. These materials are essential for driveways, walkways, patios, drainage systems, and as base 
                  materials for concrete and asphalt.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Types of Aggregate</h3>
                
                <p><strong>Gravel:</strong> Loose rock fragments, typically 2-40mm. Great for driveways and drainage.</p>
                <p><strong>Pea Gravel:</strong> Small, rounded stones about the size of peas. Popular for walkways and decorative use.</p>
                <p><strong>Crushed Stone:</strong> Angular rock fragments with sharp edges. Excellent for compacting and base layers.</p>
                <p><strong>Sand:</strong> Fine granular material. Used for bedding pavers, mixing concrete, and leveling.</p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How to Calculate Aggregate Needed</h3>
                <ol style={{ paddingLeft: "20px" }}>
                  <li>Measure your area (length × width for rectangles)</li>
                  <li>Determine the depth needed (2-4&quot; for most projects)</li>
                  <li>Calculate volume: Area × Depth</li>
                  <li>Convert to cubic yards (divide cubic feet by 27)</li>
                  <li>Multiply by material density to get tons</li>
                  <li>Add 10% extra for waste and settling</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Recommended Depths */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📐 Recommended Depths</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>🚶 Walkways: <strong>2-3&quot;</strong></p>
                <p style={{ margin: 0 }}>🏠 Patios: <strong>3-4&quot;</strong></p>
                <p style={{ margin: 0 }}>🚗 Driveways: <strong>4-6&quot;</strong></p>
                <p style={{ margin: 0 }}>🌿 Garden beds: <strong>2-3&quot;</strong></p>
                <p style={{ margin: 0 }}>💧 Drainage: <strong>4-6&quot;</strong></p>
              </div>
            </div>

            {/* Delivery Info */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🚚 Delivery Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>Pickup truck: <strong>1 cubic yard</strong></p>
                <p style={{ margin: "0 0 8px 0" }}>Small dump: <strong>5-10 tons</strong></p>
                <p style={{ margin: 0 }}>Full dump: <strong>13-25 tons</strong></p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/aggregate-calculator" currentCategory="Construction" />
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
            🪨 <strong>Disclaimer:</strong> This calculator provides estimates based on standard material densities. 
            Actual amounts may vary based on material type, moisture content, and compaction requirements. 
            Always confirm quantities with your supplier before ordering. Add extra material for waste, settling, and uneven surfaces.
          </p>
        </div>
      </div>
    </div>
  );
}