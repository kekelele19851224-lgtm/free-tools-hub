"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Rock types with densities (tons per cubic yard)
const rockTypes = {
  "river-rock": { name: "River Rock (1-3\")", density: 1.3, lbsPerCuYd: 2600, priceMin: 50, priceMax: 160 },
  "pea-gravel": { name: "Pea Gravel", density: 1.4, lbsPerCuYd: 2800, priceMin: 30, priceMax: 60 },
  "crushed-stone": { name: "Crushed Stone", density: 1.5, lbsPerCuYd: 3000, priceMin: 40, priceMax: 80 },
  "lava-rock": { name: "Lava Rock", density: 0.5, lbsPerCuYd: 1000, priceMin: 50, priceMax: 180 },
  "decomposed-granite": { name: "Decomposed Granite", density: 1.4, lbsPerCuYd: 2800, priceMin: 35, priceMax: 70 },
  "sand": { name: "Sand", density: 1.35, lbsPerCuYd: 2700, priceMin: 25, priceMax: 50 },
  "landscape-gravel": { name: "Landscape Gravel", density: 1.4, lbsPerCuYd: 2800, priceMin: 35, priceMax: 65 }
};

// Area shape options
const areaShapes = [
  { id: "rectangle", name: "Rectangle", icon: "▭" },
  { id: "circle", name: "Circle", icon: "○" },
  { id: "triangle", name: "Triangle", icon: "△" }
];

// Depth recommendations
const depthRecommendations = [
  { use: "Decorative/Ground Cover", depth: "2-3\"", inches: 2.5 },
  { use: "Walkways/Pathways", depth: "3-4\"", inches: 3.5 },
  { use: "Driveways", depth: "4-6\"", inches: 5 },
  { use: "French Drains", depth: "8-12\"", inches: 10 }
];

// Coverage chart (sq ft per cubic yard at different depths)
const coverageChart = [
  { depth: "1\"", sqFtPerYard: 324 },
  { depth: "2\"", sqFtPerYard: 162 },
  { depth: "3\"", sqFtPerYard: 108 },
  { depth: "4\"", sqFtPerYard: 81 },
  { depth: "6\"", sqFtPerYard: 54 }
];

// FAQ data
const faqs = [
  {
    question: "How to calculate yards for rock?",
    answer: "To calculate cubic yards for rock: (1) Measure length and width in feet, (2) Determine depth in inches and convert to feet by dividing by 12, (3) Multiply length × width × depth to get cubic feet, (4) Divide by 27 to convert to cubic yards. Formula: Cubic Yards = (Length ft × Width ft × Depth ft) ÷ 27. Example: 10ft × 10ft area, 3\" deep = 10 × 10 × 0.25 ÷ 27 = 0.93 cubic yards."
  },
  {
    question: "How far does 1 yard of rock cover?",
    answer: "One cubic yard of rock covers different areas depending on depth: 324 sq ft at 1\" deep, 162 sq ft at 2\" deep, 108 sq ft at 3\" deep, 81 sq ft at 4\" deep, and 54 sq ft at 6\" deep. For most decorative landscaping at 2-3\" depth, expect 1 yard to cover about 100-160 square feet. Larger rocks require more depth for proper coverage."
  },
  {
    question: "How much is 1 yard of rock?",
    answer: "One cubic yard of landscape rock costs $30-$180 depending on the type. River rock: $50-$160/yard. Pea gravel: $30-$60/yard. Crushed stone: $40-$80/yard. Lava rock: $50-$180/yard. Add $50-$150 for delivery. One cubic yard weighs 1.3-1.5 tons (2,600-3,000 lbs) and fills about half of a standard pickup truck bed."
  },
  {
    question: "How much area will 1 yd of gravel cover?",
    answer: "One cubic yard of gravel covers approximately 100-162 square feet at the recommended 2-3 inch depth. At 2\" depth: 162 sq ft. At 3\" depth: 108 sq ft. At 4\" depth (for driveways): 81 sq ft. For gravel driveways, plan for 4-6\" depth and expect 1 yard to cover 54-81 square feet. Always add 10% extra for waste and settling."
  },
  {
    question: "How much rock do I need per square foot?",
    answer: "Rock needed per square foot depends on depth: At 2\" depth: 0.006 cubic yards (0.17 cu ft) per sq ft. At 3\" depth: 0.009 cubic yards (0.25 cu ft) per sq ft. At 4\" depth: 0.012 cubic yards (0.33 cu ft) per sq ft. In terms of weight, plan for about 13-20 lbs of river rock per square foot at 2-3\" depth."
  },
  {
    question: "How many bags of rock in a cubic yard?",
    answer: "There are approximately 54 bags of rock (50 lb bags) in one cubic yard. This is based on rock weighing about 2,700 lbs per cubic yard. For 0.5 cubic foot bags, you'd need about 54 bags per yard. Buying bulk is much cheaper—bags cost 3-4× more than bulk per cubic yard. For projects over 1 cubic yard, always buy bulk."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #E7E5E4" }}>
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
        <h3 style={{ fontWeight: "600", color: "#1C1917", paddingRight: "16px", margin: 0, fontSize: "1rem" }}>{question}</h3>
        <svg style={{ width: "20px", height: "20px", color: "#78716C", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.3s ease-out" }}>
        <p style={{ color: "#57534E", paddingBottom: "16px", margin: 0, lineHeight: "1.7" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function YardCalculatorForRock() {
  const [activeTab, setActiveTab] = useState<"volume" | "coverage" | "cost">("volume");
  
  // Tab 1: Volume Calculator State
  const [areaShape, setAreaShape] = useState<string>("rectangle");
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("10");
  const [diameter, setDiameter] = useState<string>("10");
  const [base, setBase] = useState<string>("10");
  const [height, setHeight] = useState<string>("8");
  const [depth, setDepth] = useState<string>("3");
  const [rockType, setRockType] = useState<string>("river-rock");
  const [wasteFactor, setWasteFactor] = useState<string>("10");
  
  // Tab 2: Coverage Calculator State
  const [materialAmount, setMaterialAmount] = useState<string>("1");
  const [materialUnit, setMaterialUnit] = useState<string>("yards");
  const [coverageRockType, setCoverageRockType] = useState<string>("river-rock");
  const [coverageDepth, setCoverageDepth] = useState<string>("3");
  
  // Tab 3: Cost Estimator State
  const [bulkPrice, setBulkPrice] = useState<string>("75");
  const [bagPrice, setBagPrice] = useState<string>("5");
  const [deliveryFee, setDeliveryFee] = useState<string>("75");

  // Get rock info
  const rock = rockTypes[rockType as keyof typeof rockTypes];
  const coverageRock = rockTypes[coverageRockType as keyof typeof rockTypes];

  // Tab 1 Calculations
  const lengthNum = parseFloat(length) || 0;
  const widthNum = parseFloat(width) || 0;
  const diameterNum = parseFloat(diameter) || 0;
  const baseNum = parseFloat(base) || 0;
  const heightNum = parseFloat(height) || 0;
  const depthNum = parseFloat(depth) || 0;
  const waste = parseFloat(wasteFactor) || 10;
  
  // Calculate area based on shape
  let area = 0;
  if (areaShape === "rectangle") {
    area = lengthNum * widthNum;
  } else if (areaShape === "circle") {
    const radius = diameterNum / 2;
    area = Math.PI * radius * radius;
  } else if (areaShape === "triangle") {
    area = (baseNum * heightNum) / 2;
  }
  
  // Calculate volume
  const depthFt = depthNum / 12; // Convert inches to feet
  const volumeCuFt = area * depthFt;
  const volumeCuYd = volumeCuFt / 27;
  const volumeWithWaste = volumeCuYd * (1 + waste / 100);
  
  // Calculate weight
  const weightTons = volumeWithWaste * rock.density;
  const weightLbs = volumeWithWaste * rock.lbsPerCuYd;
  
  // Calculate bags (50 lb bags)
  const bagsNeeded = Math.ceil(weightLbs / 50);

  // Tab 2 Calculations
  const amountNum = parseFloat(materialAmount) || 0;
  const coverageDepthNum = parseFloat(coverageDepth) || 3;
  
  // Convert to cubic yards if tons
  let cuYardsAvailable = amountNum;
  if (materialUnit === "tons") {
    cuYardsAvailable = amountNum / coverageRock.density;
  }
  
  // Calculate coverage area
  const coverageDepthFt = coverageDepthNum / 12;
  const coverageSqFt = (cuYardsAvailable * 27) / coverageDepthFt;
  const equivalentRooms = coverageSqFt / 144; // 12x12 room = 144 sq ft

  // Tab 3 Calculations
  const bulkPriceNum = parseFloat(bulkPrice) || 75;
  const bagPriceNum = parseFloat(bagPrice) || 5;
  const deliveryNum = parseFloat(deliveryFee) || 0;
  
  const bulkCost = volumeWithWaste * bulkPriceNum;
  const bagCost = bagsNeeded * bagPriceNum;
  const bulkTotalWithDelivery = bulkCost + deliveryNum;
  const costPerSqFt = area > 0 ? bulkTotalWithDelivery / area : 0;

  const tabs = [
    { id: "volume", label: "Volume Calculator", icon: "📦" },
    { id: "coverage", label: "Coverage Calculator", icon: "📐" },
    { id: "cost", label: "Cost Estimator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E7E5E4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#78716C" }}>
            <Link href="/" style={{ color: "#78716C", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#1C1917" }}>Yard Calculator for Rock</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#1C1917", margin: 0 }}>
              Yard Calculator for Rock
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#57534E", maxWidth: "800px" }}>
            Calculate how much landscape rock, river rock, or gravel you need in cubic yards, tons, or bags. 
            Includes coverage calculator and cost estimator.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#78716C",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>Rock Coverage Quick Reference</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "0.85rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>1 cu yd @ 2&quot;:</strong> 162 sq ft
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>1 cu yd @ 3&quot;:</strong> 108 sq ft
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>1 cu yd @ 4&quot;:</strong> 81 sq ft
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Weight:</strong> ~1.3-1.5 tons/yd
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#78716C" : "#D6D3D1",
                color: activeTab === tab.id ? "white" : "#57534E",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E7E5E4",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#78716C", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "volume" && "📦 Area & Dimensions"}
                {activeTab === "coverage" && "📐 Material Amount"}
                {activeTab === "cost" && "💰 Pricing"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* VOLUME CALCULATOR TAB */}
              {activeTab === "volume" && (
                <>
                  {/* Area Shape */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Area Shape
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {areaShapes.map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setAreaShape(shape.id)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: areaShape === shape.id ? "2px solid #78716C" : "1px solid #D6D3D1",
                            backgroundColor: areaShape === shape.id ? "#F5F5F4" : "white",
                            color: "#57534E",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "1.25rem" }}>{shape.icon}</div>
                          <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>{shape.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions based on shape */}
                  {areaShape === "rectangle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                          Length (ft)
                        </label>
                        <input
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                          Width (ft)
                        </label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}

                  {areaShape === "circle" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                        Diameter (ft)
                      </label>
                      <input
                        type="number"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  )}

                  {areaShape === "triangle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                          Base (ft)
                        </label>
                        <input
                          type="number"
                          value={base}
                          onChange={(e) => setBase(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                          Height (ft)
                        </label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Area Presets */}
                  {areaShape === "rectangle" && (
                    <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {[
                        { l: 10, w: 10 },
                        { l: 12, w: 12 },
                        { l: 15, w: 15 },
                        { l: 20, w: 20 },
                        { l: 20, w: 10 }
                      ].map((preset) => (
                        <button
                          key={`${preset.l}x${preset.w}`}
                          onClick={() => { setLength(preset.l.toString()); setWidth(preset.w.toString()); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: length === preset.l.toString() && width === preset.w.toString() ? "2px solid #78716C" : "1px solid #D6D3D1",
                            backgroundColor: length === preset.l.toString() && width === preset.w.toString() ? "#F5F5F4" : "white",
                            color: "#57534E",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {preset.l}×{preset.w}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Depth */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Depth (inches)
                    </label>
                    <input
                      type="number"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      step="0.5"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 6].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDepth(d.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: depth === d.toString() ? "2px solid #78716C" : "1px solid #D6D3D1",
                            backgroundColor: depth === d.toString() ? "#F5F5F4" : "white",
                            color: "#57534E",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {d}&quot;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rock Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Rock Type
                    </label>
                    <select
                      value={rockType}
                      onChange={(e) => setRockType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem" }}
                    >
                      {Object.entries(rockTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} (~{value.density} tons/yd³)</option>
                      ))}
                    </select>
                  </div>

                  {/* Waste Factor */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Waste Factor (%)
                    </label>
                    <input
                      type="number"
                      value={wasteFactor}
                      onChange={(e) => setWasteFactor(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#78716C" }}>
                      Add 10% for settling and waste
                    </p>
                  </div>
                </>
              )}

              {/* COVERAGE CALCULATOR TAB */}
              {activeTab === "coverage" && (
                <>
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      📐 Enter your material amount to see how much area it will cover.
                    </p>
                  </div>

                  {/* Material Amount & Unit */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                        Material Amount
                      </label>
                      <input
                        type="number"
                        value={materialAmount}
                        onChange={(e) => setMaterialAmount(e.target.value)}
                        step="0.5"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                        Unit
                      </label>
                      <select
                        value={materialUnit}
                        onChange={(e) => setMaterialUnit(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem" }}
                      >
                        <option value="yards">Cubic Yards</option>
                        <option value="tons">Tons</option>
                      </select>
                    </div>
                  </div>

                  {/* Rock Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Rock Type
                    </label>
                    <select
                      value={coverageRockType}
                      onChange={(e) => setCoverageRockType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem" }}
                    >
                      {Object.entries(rockTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Desired Depth */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Desired Depth (inches)
                    </label>
                    <input
                      type="number"
                      value={coverageDepth}
                      onChange={(e) => setCoverageDepth(e.target.value)}
                      step="0.5"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 6].map((d) => (
                        <button
                          key={d}
                          onClick={() => setCoverageDepth(d.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: coverageDepth === d.toString() ? "2px solid #78716C" : "1px solid #D6D3D1",
                            backgroundColor: coverageDepth === d.toString() ? "#F5F5F4" : "white",
                            color: "#57534E",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {d}&quot;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Depth Recommendations */}
                  <div style={{ backgroundColor: "#F5F5F4", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#57534E" }}>💡 Recommended Depths</p>
                    <div style={{ fontSize: "0.8rem", color: "#78716C" }}>
                      {depthRecommendations.map((rec, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>{rec.use}</span>
                          <span style={{ fontWeight: "600" }}>{rec.depth}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      📦 Using volume from Tab 1: <strong>{volumeWithWaste.toFixed(2)} cu yd</strong> ({weightTons.toFixed(2)} tons)
                    </p>
                  </div>

                  {/* Bulk Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Bulk Price ($ per cubic yard)
                    </label>
                    <input
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#78716C" }}>
                      {rock.name}: ${rock.priceMin}-${rock.priceMax}/cu yd typical
                    </p>
                  </div>

                  {/* Bag Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Bag Price ($ per 50 lb bag)
                    </label>
                    <input
                      type="number"
                      value={bagPrice}
                      onChange={(e) => setBagPrice(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[3, 4, 5, 6, 8].map((p) => (
                        <button
                          key={p}
                          onClick={() => setBagPrice(p.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: bagPrice === p.toString() ? "2px solid #78716C" : "1px solid #D6D3D1",
                            backgroundColor: bagPrice === p.toString() ? "#F5F5F4" : "white",
                            color: "#57534E",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Fee */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#57534E", marginBottom: "6px", fontWeight: "600" }}>
                      Delivery Fee ($)
                    </label>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D6D3D1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#78716C" }}>
                      Typical: $50-$150 depending on distance
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E7E5E4",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#65A30D", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "volume" && "📊 Material Needed"}
                {activeTab === "coverage" && "📐 Coverage Area"}
                {activeTab === "cost" && "💵 Cost Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* VOLUME RESULTS */}
              {activeTab === "volume" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #65A30D",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>
                      {rock.name} Needed (with {waste}% waste)
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#65A30D" }}>
                      {volumeWithWaste.toFixed(2)} cu yd
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534" }}>
                      {weightTons.toFixed(2)} tons • {weightLbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs
                    </p>
                  </div>

                  {/* Alternative Measurements */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>50 lb Bags</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>
                        {bagsNeeded}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#F5F5F4", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#57534E" }}>Area Covered</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#78716C" }}>
                        {area.toFixed(0)} sq ft
                      </p>
                    </div>
                  </div>

                  {/* Volume Breakdown */}
                  <div style={{ backgroundColor: "#F5F5F4", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#57534E", fontSize: "0.9rem" }}>Calculation Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#78716C" }}>Area</span>
                        <span style={{ fontWeight: "600" }}>{area.toFixed(1)} sq ft</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#78716C" }}>Depth</span>
                        <span style={{ fontWeight: "600" }}>{depthNum}&quot; ({depthFt.toFixed(3)} ft)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#78716C" }}>Volume (before waste)</span>
                        <span style={{ fontWeight: "600" }}>{volumeCuYd.toFixed(2)} cu yd</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E7E5E4" }}>
                        <span style={{ fontWeight: "600" }}>Final Volume (+{waste}%)</span>
                        <span style={{ fontWeight: "bold", color: "#65A30D" }}>{volumeWithWaste.toFixed(2)} cu yd</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* COVERAGE RESULTS */}
              {activeTab === "coverage" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #65A30D",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>
                      {amountNum} {materialUnit === "yards" ? "cubic yard" : "ton"}{amountNum !== 1 ? "s" : ""} @ {coverageDepthNum}&quot; deep covers
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#65A30D" }}>
                      {coverageSqFt.toFixed(0)} sq ft
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534" }}>
                      ≈ {equivalentRooms.toFixed(1)} rooms (12×12 ft)
                    </p>
                  </div>

                  {/* Coverage at Different Depths */}
                  <div style={{ backgroundColor: "#F5F5F4", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#57534E", fontSize: "0.9rem" }}>Coverage at Different Depths</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      {[2, 3, 4, 6].map((d) => {
                        const cov = (cuYardsAvailable * 27) / (d / 12);
                        return (
                          <div key={d} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", padding: "6px", backgroundColor: coverageDepthNum === d ? "#ECFDF5" : "transparent", borderRadius: "4px" }}>
                            <span style={{ color: "#78716C" }}>{d}&quot; deep</span>
                            <span style={{ fontWeight: "600" }}>{cov.toFixed(0)} sq ft</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conversion Info */}
                  {materialUnit === "tons" && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                        💡 {amountNum} ton{amountNum !== 1 ? "s" : ""} of {coverageRock.name} = {cuYardsAvailable.toFixed(2)} cubic yards
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* COST RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Total Cost */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #65A30D",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>
                      Bulk Cost (with delivery)
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#65A30D" }}>
                      ${bulkTotalWithDelivery.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534" }}>
                      ${costPerSqFt.toFixed(2)} per sq ft
                    </p>
                  </div>

                  {/* Bulk vs Bag Comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center", border: "2px solid #65A30D" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#166534" }}>🏆 Bulk Price</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#65A30D" }}>
                        ${bulkCost.toFixed(2)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#166534" }}>
                        +${deliveryNum} delivery
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#FEE2E2", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#991B1B" }}>Bags ({bagsNeeded} bags)</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#DC2626" }}>
                        ${bagCost.toFixed(2)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#991B1B" }}>
                        {bagCost > bulkTotalWithDelivery ? `$${(bagCost - bulkTotalWithDelivery).toFixed(0)} more` : "Cheaper!"}
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F5F5F4", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#57534E", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#78716C" }}>Material ({volumeWithWaste.toFixed(2)} cu yd @ ${bulkPriceNum})</span>
                        <span style={{ fontWeight: "600" }}>${bulkCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#78716C" }}>Delivery</span>
                        <span style={{ fontWeight: "600" }}>${deliveryNum.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E7E5E4" }}>
                        <span style={{ fontWeight: "600" }}>Total</span>
                        <span style={{ fontWeight: "bold", color: "#65A30D" }}>${bulkTotalWithDelivery.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Savings Note */}
                  {bagCost > bulkTotalWithDelivery && (
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginTop: "16px", border: "1px solid #6EE7B7" }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                        💰 <strong>You save ${(bagCost - bulkTotalWithDelivery).toFixed(0)}</strong> by buying bulk instead of bags!
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Coverage Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E7E5E4",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#78716C", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Rock Coverage Chart (1 Cubic Yard)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F5F4" }}>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "left" }}>Depth</th>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>Coverage (sq ft)</th>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { depth: "1\"", sqFt: 324, use: "Very light top dressing" },
                  { depth: "2\"", sqFt: 162, use: "Decorative ground cover" },
                  { depth: "3\"", sqFt: 108, use: "Walkways, garden beds" },
                  { depth: "4\"", sqFt: 81, use: "Driveways, high traffic" },
                  { depth: "6\"", sqFt: 54, use: "French drains, base layer" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#FAFAF9" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", fontWeight: "600" }}>{row.depth}</td>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center", color: "#65A30D", fontWeight: "600" }}>{row.sqFt}</td>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#78716C", marginTop: "12px", marginBottom: 0 }}>
              * Coverage varies by rock size. Larger rocks (3&quot;+) may require more depth for proper coverage.
            </p>
          </div>
        </div>

        {/* Rock Types Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E7E5E4",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#57534E", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🪨 Rock Types & Weights</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F5F4" }}>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "left" }}>Rock Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>Weight (lbs/cu yd)</th>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>Tons/cu yd</th>
                  <th style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>Price Range</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(rockTypes).map(([key, rock], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 1 ? "#FAFAF9" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", fontWeight: "600" }}>{rock.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>{rock.lbsPerCuYd.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center" }}>{rock.density}</td>
                    <td style={{ padding: "12px", border: "1px solid #E7E5E4", textAlign: "center", color: "#65A30D", fontWeight: "600" }}>${rock.priceMin}-${rock.priceMax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E7E5E4", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1C1917", marginBottom: "20px" }}>🪨 How to Calculate Rock for Landscaping</h2>
              
              <div style={{ color: "#57534E", lineHeight: "1.8" }}>
                <h3 style={{ color: "#1C1917", marginTop: "0", marginBottom: "12px" }}>Understanding Cubic Yards</h3>
                <p>
                  Landscape materials are sold by the cubic yard—a volume measurement equal to a 3ft × 3ft × 3ft cube 
                  (27 cubic feet). To calculate cubic yards: measure your area in feet, multiply length × width × depth 
                  (in feet), then divide by 27. Don&apos;t forget to convert inches to feet by dividing by 12.
                </p>
                
                <h3 style={{ color: "#1C1917", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Depth</h3>
                <p>
                  Depth depends on your application. For decorative purposes, 2-3 inches is usually sufficient. 
                  Walkways need 3-4 inches for stability. Driveways require 4-6 inches to handle vehicle weight. 
                  Larger rocks (3&quot;+) need more depth since they don&apos;t pack as tightly—add an extra inch to 
                  your planned depth.
                </p>
                
                <h3 style={{ color: "#1C1917", marginTop: "24px", marginBottom: "12px" }}>Bulk vs. Bagged Rock</h3>
                <p>
                  For projects over 1 cubic yard, always buy bulk. Bagged rock costs 3-4× more than bulk per cubic 
                  yard. A single cubic yard requires about 54 fifty-pound bags—that&apos;s a lot of lifting! Bulk 
                  delivery typically costs $50-$150 extra but saves significant money on larger projects. Most 
                  pickup trucks can safely haul about 1 cubic yard of rock.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#78716C", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Quick Reference</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>1 cu yd =</strong> 27 cu ft</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>1 cu yd ≈</strong> 1.3-1.5 tons</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>1 cu yd ≈</strong> 54 bags (50 lb)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>1 ton ≈</strong> 0.7-0.8 cu yd</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  Formula: L × W × D (ft) ÷ 27 = cu yd
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <li>Always add 10% for waste</li>
                <li>Use landscape fabric first</li>
                <li>Larger rocks need more depth</li>
                <li>Bulk saves 3-4× vs bags</li>
                <li>Check truck weight capacity</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/yard-calculator-for-rock" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E7E5E4", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1C1917", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F5F5F4", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#78716C", textAlign: "center", margin: 0 }}>
            🪨 <strong>Disclaimer:</strong> Calculations are estimates. Actual coverage may vary based on rock size, shape, and settling. 
            Always order slightly more than calculated to account for waste and ensure complete coverage.
          </p>
        </div>
      </div>
    </div>
  );
}