"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Drywall types with prices per sheet (4x8)
const drywallTypes = {
  "standard-half": { name: "Standard 1/2\"", pricePerSheet: 12, description: "Most common for walls" },
  "standard-5/8": { name: "Standard 5/8\"", pricePerSheet: 15, description: "Ceilings, fire-rated areas" },
  "moisture": { name: "Moisture Resistant", pricePerSheet: 18, description: "Bathrooms, kitchens" },
  "fire": { name: "Fire Resistant (Type X)", pricePerSheet: 20, description: "Garages, code requirements" },
  "soundproof": { name: "Soundproof", pricePerSheet: 45, description: "Media rooms, bedrooms" }
};

// Finish levels with costs
const finishLevels = {
  "0": { name: "Level 0", description: "No finishing, temporary", addCost: 0 },
  "1": { name: "Level 1", description: "Basic tape, concealed areas", addCost: 0.25 },
  "2": { name: "Level 2", description: "Tape + 1 coat, for tile base", addCost: 0.50 },
  "3": { name: "Level 3", description: "Tape + 2 coats, for texture", addCost: 0.75 },
  "4": { name: "Level 4", description: "Standard residential, paint-ready", addCost: 1.00 },
  "5": { name: "Level 5", description: "Smooth finish, premium quality", addCost: 1.75 }
};

// Labor rates per sq ft
const laborRates = {
  "low": { name: "Low (DIY areas)", hang: 0.85, finish: 0.65 },
  "medium": { name: "Average", hang: 1.25, finish: 1.00 },
  "high": { name: "High (Complex/Premium)", hang: 1.90, finish: 1.50 }
};

// Common door/window sizes
const doorSizes = [
  { name: "Standard Interior (3×7)", sqft: 21 },
  { name: "Exterior Door (3×6.8)", sqft: 20.4 },
  { name: "Double Door (6×7)", sqft: 42 },
  { name: "Closet Door (2.5×6.8)", sqft: 17 }
];

const windowSizes = [
  { name: "Small (2×3)", sqft: 6 },
  { name: "Standard (3×4)", sqft: 12 },
  { name: "Large (4×5)", sqft: 20 },
  { name: "Picture Window (5×6)", sqft: 30 }
];

// FAQ data
const faqs = [
  {
    question: "How much does 1000 sq ft of drywall cost?",
    answer: "For 1000 sq ft of drywall installation (materials + labor), expect to pay $1,500 to $3,500. This breaks down to: materials $500-$800 (32 sheets at $12-18 each plus supplies), and labor $1,000-$2,700. Costs vary based on drywall type, finish level, and your location. Level 4 finish (standard paint-ready) in most areas runs about $2,000-$2,500 for 1000 sq ft."
  },
  {
    question: "How do you calculate labor cost for drywall?",
    answer: "Calculate drywall labor by multiplying total square footage by labor rate per sq ft. Labor typically costs $1.00-$2.70/sq ft for hanging AND finishing combined. For a 500 sq ft room: 500 × $1.50 (average) = $750 labor. Hanging alone is $0.85-$1.90/sq ft, while finishing (tape, mud, sand) adds $0.65-$1.50/sq ft. Higher ceilings, complex cuts, and premium finishes increase labor costs."
  },
  {
    question: "How much would it cost to drywall a 20x20 room?",
    answer: "A 20×20 room with 8ft ceilings has approximately 1,040 sq ft of wall and ceiling area (640 walls + 400 ceiling). At $1.50-$3.50/sq ft installed, expect $1,560-$3,640 total. With one door and two windows deducted (~45 sq ft), net area is ~995 sq ft. Average cost: $1,500-$2,500 for standard drywall with Level 4 finish. Add 15-20% for high ceilings or premium finishes."
  },
  {
    question: "How much to charge per sq ft to finish drywall?",
    answer: "Drywall finishing (taping, mudding, sanding) typically costs $0.85-$3.50 per sq ft depending on finish level. Level 1 (basic): $0.40-$0.65/sq ft. Level 3 (texture-ready): $0.75-$1.25/sq ft. Level 4 (paint-ready): $1.00-$1.75/sq ft. Level 5 (smooth/premium): $1.75-$3.50/sq ft. Most residential jobs use Level 4. Add complexity charges for high ceilings or many corners."
  },
  {
    question: "What is the cost to hang and finish drywall per square foot?",
    answer: "The combined cost to hang AND finish drywall is $1.50-$3.50 per square foot, including materials and labor. Breaking it down: hanging costs $0.85-$1.90/sq ft (labor) + $0.40-$0.60/sq ft (materials). Finishing adds $0.65-$1.50/sq ft (labor) + $0.15-$0.25/sq ft (mud, tape). Total materials: $0.50-$0.80/sq ft. Total labor: $1.00-$2.70/sq ft. National average is about $2.00-$2.50/sq ft."
  },
  {
    question: "How many sheets of drywall for a 12x12 room?",
    answer: "A 12×12 room with 8ft ceilings needs approximately 15-17 sheets of 4×8 drywall. Calculation: Walls = 2×(12+12)×8 = 384 sq ft. Ceiling = 12×12 = 144 sq ft. Total = 528 sq ft. Minus one door (21 sq ft) = 507 sq ft net. Divide by 32 sq ft per sheet = 15.8 sheets. Add 10% waste = 17 sheets. For 4×12 sheets (48 sq ft each), you'd need about 12 sheets."
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

export default function DrywallInstallationCostCalculator() {
  const [activeTab, setActiveTab] = useState<"area" | "cost" | "materials">("area");
  
  // Tab 1: Area Calculator State
  const [roomLength, setRoomLength] = useState<string>("12");
  const [roomWidth, setRoomWidth] = useState<string>("12");
  const [ceilingHeight, setCeilingHeight] = useState<string>("8");
  const [includeCeiling, setIncludeCeiling] = useState<boolean>(true);
  const [numDoors, setNumDoors] = useState<string>("1");
  const [doorSize, setDoorSize] = useState<string>("21");
  const [numWindows, setNumWindows] = useState<string>("1");
  const [windowSize, setWindowSize] = useState<string>("12");
  const [wasteFactor, setWasteFactor] = useState<string>("10");
  
  // Tab 2: Cost Estimator State
  const [drywallType, setDrywallType] = useState<string>("standard-half");
  const [finishLevel, setFinishLevel] = useState<string>("4");
  const [laborRate, setLaborRate] = useState<string>("medium");
  const [includeLaborCost, setIncludeLaborCost] = useState<boolean>(true);
  
  // Tab 3: Material List State
  const [sheetSize, setSheetSize] = useState<string>("4x8");

  // Tab 1 Calculations
  const length = parseFloat(roomLength) || 0;
  const width = parseFloat(roomWidth) || 0;
  const height = parseFloat(ceilingHeight) || 8;
  const doors = parseInt(numDoors) || 0;
  const doorSqft = parseFloat(doorSize) || 21;
  const windows = parseInt(numWindows) || 0;
  const windowSqft = parseFloat(windowSize) || 12;
  const waste = parseFloat(wasteFactor) || 10;
  
  // Calculate areas
  const wallArea = 2 * (length + width) * height;
  const ceilingArea = includeCeiling ? length * width : 0;
  const grossArea = wallArea + ceilingArea;
  const openingsArea = (doors * doorSqft) + (windows * windowSqft);
  const netArea = grossArea - openingsArea;
  const areaWithWaste = netArea * (1 + waste / 100);
  
  // Calculate sheets needed
  const sheetSqft = sheetSize === "4x8" ? 32 : 48;
  const sheetsNeeded = Math.ceil(areaWithWaste / sheetSqft);

  // Tab 2 Calculations
  const drywall = drywallTypes[drywallType as keyof typeof drywallTypes];
  const finish = finishLevels[finishLevel as keyof typeof finishLevels];
  const labor = laborRates[laborRate as keyof typeof laborRates];
  
  // Material costs
  const sheetCost = sheetsNeeded * drywall.pricePerSheet;
  const suppliesCost = netArea * 0.25; // mud, tape, screws, etc.
  const totalMaterialCost = sheetCost + suppliesCost;
  
  // Labor costs
  const hangLaborCost = includeLaborCost ? netArea * labor.hang : 0;
  const finishLaborCost = includeLaborCost ? netArea * (labor.finish + finish.addCost) : 0;
  const totalLaborCost = hangLaborCost + finishLaborCost;
  
  // Total costs
  const totalCost = totalMaterialCost + totalLaborCost;
  const costPerSqft = netArea > 0 ? totalCost / netArea : 0;

  // Tab 3 Calculations - Material quantities
  const jointCompoundGallons = Math.ceil(netArea * 0.05);
  const tapeFeet = Math.ceil(netArea * 1.1);
  const screws = Math.ceil(sheetsNeeded * 32);
  const cornerBeads = Math.ceil((length + width) / 4); // rough estimate for outside corners

  const tabs = [
    { id: "area", label: "Area Calculator", icon: "📐" },
    { id: "cost", label: "Cost Estimator", icon: "💰" },
    { id: "materials", label: "Material List", icon: "📦" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F1F5F9" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Drywall Installation Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏗️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#1E293B", margin: 0 }}>
              Drywall Installation Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#475569", maxWidth: "800px" }}>
            Calculate drywall area, estimate installation costs, and create a material list. 
            Includes labor costs for hanging and finishing at different quality levels.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#1E40AF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💵</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>Drywall Cost Quick Reference (2026)</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Total:</strong> $1.50 - $3.50 /sq ft
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Materials:</strong> $0.50 - $0.80 /sq ft
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Labor:</strong> $1.00 - $2.70 /sq ft
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
                backgroundColor: activeTab === tab.id ? "#1E40AF" : "#CBD5E1",
                color: activeTab === tab.id ? "white" : "#334155",
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
            border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "area" && "📐 Room Dimensions"}
                {activeTab === "cost" && "💰 Cost Options"}
                {activeTab === "materials" && "📦 Material Options"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* AREA CALCULATOR TAB */}
              {activeTab === "area" && (
                <>
                  {/* Room Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                        Room Length (ft)
                      </label>
                      <input
                        type="number"
                        value={roomLength}
                        onChange={(e) => setRoomLength(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                        Room Width (ft)
                      </label>
                      <input
                        type="number"
                        value={roomWidth}
                        onChange={(e) => setRoomWidth(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Ceiling Height */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Ceiling Height (ft)
                    </label>
                    <input
                      type="number"
                      value={ceilingHeight}
                      onChange={(e) => setCeilingHeight(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[8, 9, 10, 12].map((h) => (
                        <button
                          key={h}
                          onClick={() => setCeilingHeight(h.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: ceilingHeight === h.toString() ? "2px solid #1E40AF" : "1px solid #CBD5E1",
                            backgroundColor: ceilingHeight === h.toString() ? "#EFF6FF" : "white",
                            color: "#334155",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {h} ft
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Ceiling */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={includeCeiling}
                        onChange={(e) => setIncludeCeiling(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Include Ceiling</span>
                    </label>
                  </div>

                  {/* Doors */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>🚪 Doors to Deduct</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginBottom: "4px" }}>Number</label>
                        <input
                          type="number"
                          value={numDoors}
                          onChange={(e) => setNumDoors(e.target.value)}
                          min="0"
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginBottom: "4px" }}>Size (sq ft each)</label>
                        <select
                          value={doorSize}
                          onChange={(e) => setDoorSize(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                        >
                          {doorSizes.map((d) => (
                            <option key={d.sqft} value={d.sqft}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Windows */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>🪟 Windows to Deduct</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginBottom: "4px" }}>Number</label>
                        <input
                          type="number"
                          value={numWindows}
                          onChange={(e) => setNumWindows(e.target.value)}
                          min="0"
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginBottom: "4px" }}>Size (sq ft each)</label>
                        <select
                          value={windowSize}
                          onChange={(e) => setWindowSize(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                        >
                          {windowSizes.map((w) => (
                            <option key={w.sqft} value={w.sqft}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Waste Factor */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Waste Factor (%)
                    </label>
                    <input
                      type="number"
                      value={wasteFactor}
                      onChange={(e) => setWasteFactor(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[5, 10, 15, 20].map((w) => (
                        <button
                          key={w}
                          onClick={() => setWasteFactor(w.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: wasteFactor === w.toString() ? "2px solid #1E40AF" : "1px solid #CBD5E1",
                            backgroundColor: wasteFactor === w.toString() ? "#EFF6FF" : "white",
                            color: "#334155",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {w}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#1E40AF" }}>
                      📐 Using area from Tab 1: <strong>{netArea.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft</strong> (net) • <strong>{sheetsNeeded} sheets</strong>
                    </p>
                  </div>

                  {/* Drywall Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Drywall Type
                    </label>
                    <select
                      value={drywallType}
                      onChange={(e) => setDrywallType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                    >
                      {Object.entries(drywallTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} - ${value.pricePerSheet}/sheet</option>
                      ))}
                    </select>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#64748B" }}>
                      {drywall.description}
                    </p>
                  </div>

                  {/* Finish Level */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Finish Level
                    </label>
                    <select
                      value={finishLevel}
                      onChange={(e) => setFinishLevel(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                    >
                      {Object.entries(finishLevels).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} - {value.description}</option>
                      ))}
                    </select>
                    {finish.addCost > 0 && (
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#F59E0B" }}>
                        Adds +${finish.addCost.toFixed(2)}/sq ft to finishing cost
                      </p>
                    )}
                  </div>

                  {/* Include Labor */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={includeLaborCost}
                        onChange={(e) => setIncludeLaborCost(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#334155" }}>Include Labor Cost</span>
                    </label>
                  </div>

                  {/* Labor Rate */}
                  {includeLaborCost && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                        Labor Rate
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {Object.entries(laborRates).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() => setLaborRate(key)}
                            style={{
                              flex: 1,
                              padding: "12px",
                              borderRadius: "8px",
                              border: laborRate === key ? "2px solid #1E40AF" : "1px solid #CBD5E1",
                              backgroundColor: laborRate === key ? "#EFF6FF" : "white",
                              color: "#334155",
                              cursor: "pointer",
                              textAlign: "center",
                              minWidth: "100px"
                            }}
                          >
                            <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{value.name}</div>
                            <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "4px" }}>
                              ${value.hang.toFixed(2)} hang + ${value.finish.toFixed(2)} finish
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DIY Note */}
                  {!includeLaborCost && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                        🛠️ <strong>DIY Mode:</strong> Only material costs shown. Hanging drywall requires at least 2 people and proper tools (lift, stilts, T-square).
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* MATERIAL LIST TAB */}
              {activeTab === "materials" && (
                <>
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#1E40AF" }}>
                      📐 Using area from Tab 1: <strong>{areaWithWaste.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft</strong> (with {waste}% waste)
                    </p>
                  </div>

                  {/* Sheet Size */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Sheet Size
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { id: "4x8", label: "4×8 ft (32 sq ft)", desc: "Standard, easier to handle" },
                        { id: "4x12", label: "4×12 ft (48 sq ft)", desc: "Fewer seams, heavier" }
                      ].map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSheetSize(size.id)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: sheetSize === size.id ? "2px solid #1E40AF" : "1px solid #CBD5E1",
                            backgroundColor: sheetSize === size.id ? "#EFF6FF" : "white",
                            color: "#334155",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontWeight: "600", fontSize: "0.85rem" }}>{size.label}</div>
                          <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "4px" }}>{size.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drywall Type for materials */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#334155", marginBottom: "6px", fontWeight: "600" }}>
                      Drywall Type
                    </label>
                    <select
                      value={drywallType}
                      onChange={(e) => setDrywallType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem" }}
                    >
                      {Object.entries(drywallTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} - ${value.pricePerSheet}/sheet</option>
                      ))}
                    </select>
                  </div>

                  {/* Pro Tip */}
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      💡 <strong>Pro Tip:</strong> Buy 1-2 extra sheets for mistakes and future repairs. Joint compound comes in 1-gallon or 5-gallon buckets—5-gallon is more economical for larger jobs.
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
            border: "1px solid #E2E8F0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "area" && "📊 Area Results"}
                {activeTab === "cost" && "💵 Cost Estimate"}
                {activeTab === "materials" && "📋 Material List"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* AREA RESULTS */}
              {activeTab === "area" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Net Drywall Area Needed
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {netArea.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      With {waste}% waste: {areaWithWaste.toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                    </p>
                  </div>

                  {/* Sheets Needed */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>4×8 Sheets</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>
                        {Math.ceil(areaWithWaste / 32)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>4×12 Sheets</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                        {Math.ceil(areaWithWaste / 48)}
                      </p>
                    </div>
                  </div>

                  {/* Area Breakdown */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#334155", fontSize: "0.9rem" }}>Area Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748B" }}>Wall Area</span>
                        <span style={{ fontWeight: "600" }}>{wallArea.toLocaleString()} sq ft</span>
                      </div>
                      {includeCeiling && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#64748B" }}>Ceiling Area</span>
                          <span style={{ fontWeight: "600" }}>{ceilingArea.toLocaleString()} sq ft</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748B" }}>Gross Total</span>
                        <span style={{ fontWeight: "600" }}>{grossArea.toLocaleString()} sq ft</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#DC2626" }}>
                        <span>- Doors & Windows</span>
                        <span style={{ fontWeight: "600" }}>-{openingsArea.toLocaleString()} sq ft</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E2E8F0" }}>
                        <span style={{ fontWeight: "600" }}>Net Area</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{netArea.toLocaleString()} sq ft</span>
                      </div>
                    </div>
                  </div>
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
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Total Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      ${costPerSqft.toFixed(2)} per sq ft
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Materials</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ${totalMaterialCost.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Labor</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${totalLaborCost.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#334155", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748B" }}>Drywall Sheets ({sheetsNeeded} × ${drywall.pricePerSheet})</span>
                        <span style={{ fontWeight: "600" }}>${sheetCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#64748B" }}>Supplies (mud, tape, screws)</span>
                        <span style={{ fontWeight: "600" }}>${suppliesCost.toFixed(2)}</span>
                      </div>
                      {includeLaborCost && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#64748B" }}>Hanging Labor</span>
                            <span style={{ fontWeight: "600" }}>${hangLaborCost.toFixed(2)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ color: "#64748B" }}>Finishing Labor ({finish.name})</span>
                            <span style={{ fontWeight: "600" }}>${finishLaborCost.toFixed(2)}</span>
                          </div>
                        </>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E2E8F0" }}>
                        <span style={{ fontWeight: "600" }}>Total</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Range Note */}
                  <div style={{ backgroundColor: "#F0FDF4", borderRadius: "8px", padding: "12px", border: "1px solid #86EFAC" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#166534" }}>
                      💡 National average range: ${(netArea * 1.50).toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${(netArea * 3.50).toLocaleString(undefined, { maximumFractionDigits: 0 })} for {netArea.toLocaleString()} sq ft
                    </p>
                  </div>
                </>
              )}

              {/* MATERIAL LIST RESULTS */}
              {activeTab === "materials" && (
                <>
                  {/* Main Sheet Count */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {sheetSize === "4x8" ? "4×8" : "4×12"} {drywall.name} Sheets
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {sheetsNeeded} sheets
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      ${(sheetsNeeded * drywall.pricePerSheet).toFixed(2)} for sheets
                    </p>
                  </div>

                  {/* Material List */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#334155", fontSize: "0.9rem" }}>📋 Complete Material List</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#334155" }}>📦 Drywall Sheets ({sheetSize})</span>
                        <span style={{ fontWeight: "600" }}>{sheetsNeeded} sheets</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#334155" }}>🪣 Joint Compound</span>
                        <span style={{ fontWeight: "600" }}>{jointCompoundGallons} gallons</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#334155" }}>📏 Drywall Tape</span>
                        <span style={{ fontWeight: "600" }}>{tapeFeet} feet ({Math.ceil(tapeFeet / 500)} rolls)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#334155" }}>🔩 Drywall Screws</span>
                        <span style={{ fontWeight: "600" }}>{screws} ({Math.ceil(screws / 200)} boxes)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#334155" }}>📐 Corner Beads (est.)</span>
                        <span style={{ fontWeight: "600" }}>{cornerBeads} pieces</span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Material Cost */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Estimated Material Cost</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#B45309" }}>
                      ${totalMaterialCost.toFixed(2)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#92400E" }}>
                      ${(totalMaterialCost / netArea).toFixed(2)}/sq ft materials only
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cost Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 2026 Drywall Cost Guide</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F1F5F9" }}>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "left" }}>Room Size</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Approx. Sq Ft</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Sheets (4×8)</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Low Estimate</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>High Estimate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { room: "10×10 Bedroom", sqft: 400, sheets: 14, low: 600, high: 1400 },
                  { room: "12×12 Room", sqft: 500, sheets: 17, low: 750, high: 1750 },
                  { room: "15×15 Living Room", sqft: 680, sheets: 23, low: 1020, high: 2380 },
                  { room: "20×20 Large Room", sqft: 1040, sheets: 35, low: 1560, high: 3640 },
                  { room: "1000 sq ft Area", sqft: 1000, sheets: 34, low: 1500, high: 3500 },
                  { room: "2000 sq ft House", sqft: 2000, sheets: 67, low: 3000, high: 7000 }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>{row.room}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>{row.sqft}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>{row.sheets}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center", color: "#059669" }}>${row.low.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center", color: "#DC2626" }}>${row.high.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "12px", marginBottom: 0 }}>
              * Includes walls + ceiling, standard drywall, Level 4 finish. Prices vary by location and complexity. Add 10-15% for high ceilings.
            </p>
          </div>
        </div>

        {/* Finish Levels Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#374151", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎨 Drywall Finish Levels Explained</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F1F5F9" }}>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "left" }}>Level</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Best For</th>
                  <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Add. Cost/sq ft</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { level: "Level 0", desc: "No tape or finishing", use: "Temporary walls", cost: "$0" },
                  { level: "Level 1", desc: "Basic tape embedded in compound", use: "Above ceilings, concealed", cost: "+$0.25" },
                  { level: "Level 2", desc: "Tape + one coat of mud", use: "Tile substrate, garages", cost: "+$0.50" },
                  { level: "Level 3", desc: "Tape + two coats, minimal sanding", use: "Textured walls/ceilings", cost: "+$0.75" },
                  { level: "Level 4", desc: "Tape + 2-3 coats, smooth sanded", use: "Standard residential (paint)", cost: "+$1.00" },
                  { level: "Level 5", desc: "Skim coat entire surface", use: "High-end, glossy paint, lighting", cost: "+$1.75" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F8FAFC" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>{row.level}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0" }}>{row.desc}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>{row.use}</td>
                    <td style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center", color: "#F59E0B", fontWeight: "600" }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1E293B", marginBottom: "20px" }}>🏗️ Understanding Drywall Installation Costs</h2>
              
              <div style={{ color: "#475569", lineHeight: "1.8" }}>
                <h3 style={{ color: "#1E293B", marginTop: "0", marginBottom: "12px" }}>What Affects Drywall Cost?</h3>
                <p>
                  Drywall installation costs vary significantly based on several factors. The biggest variables are 
                  labor rates (which vary by region), finish level required, and project complexity. Simple rectangular 
                  rooms with standard 8-foot ceilings cost less than rooms with cathedral ceilings, multiple corners, 
                  or specialty drywall requirements. Expect to pay 15-25% more for ceilings than walls due to the 
                  difficulty of overhead work.
                </p>
                
                <h3 style={{ color: "#1E293B", marginTop: "24px", marginBottom: "12px" }}>DIY vs. Professional Installation</h3>
                <p>
                  While DIY can save 60-70% on labor costs, drywall installation is labor-intensive and requires 
                  specific skills. Hanging drywall needs at least two people (sheets weigh 50-60 lbs each), and 
                  achieving a smooth finish takes practice. Renting a drywall lift ($40-60/day) makes ceiling 
                  installation much easier. For most homeowners, hiring professionals is worth it for the 
                  time savings and quality finish.
                </p>
                
                <h3 style={{ color: "#1E293B", marginTop: "24px", marginBottom: "12px" }}>Getting Accurate Quotes</h3>
                <p>
                  When getting contractor quotes, ask for itemized estimates showing materials vs. labor. Get at 
                  least 3 quotes and verify they&apos;re quoting the same finish level. Ask about disposal fees 
                  (old drywall removal adds $0.50-$2.50/sq ft), whether texture is included, and the timeline. 
                  Be wary of quotes significantly below market rate—quality finishing takes time and skill.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#1E40AF", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💵 Quick Cost Reference</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Total:</strong> $1.50 - $3.50 /sq ft</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Materials:</strong> $0.50 - $0.80 /sq ft</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Labor (hang):</strong> $0.85 - $1.90 /sq ft</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Labor (finish):</strong> $0.65 - $1.50 /sq ft</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  4×8 sheet = 32 sq ft • 4×12 = 48 sq ft
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Money-Saving Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <li>Buy materials yourself (10-15% savings)</li>
                <li>Use 4×12 sheets (fewer seams)</li>
                <li>Level 4 is fine for most rooms</li>
                <li>Schedule during off-peak season</li>
                <li>Bundle with other work for discounts</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/drywall-installation-cost-calculator" currentCategory="Construction" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1E293B", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F1F5F9", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#64748B", textAlign: "center", margin: 0 }}>
            🏗️ <strong>Disclaimer:</strong> Cost estimates are for planning purposes and based on 2026 national averages. 
            Actual costs vary by location, contractor, project complexity, and material availability. 
            Always get multiple written quotes before starting work.
          </p>
        </div>
      </div>
    </div>
  );
}