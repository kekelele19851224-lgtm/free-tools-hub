"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Standard block sizes (US) - dimensions in inches
const blockSizes = [
  { name: '8" x 8" x 16" (Standard)', width: 16, height: 8, depth: 8 },
  { name: '8" x 8" x 8"', width: 8, height: 8, depth: 8 },
  { name: '4" x 8" x 16"', width: 16, height: 4, depth: 4 },
  { name: '6" x 8" x 16"', width: 16, height: 8, depth: 6 },
  { name: '10" x 8" x 16"', width: 16, height: 8, depth: 10 },
  { name: '12" x 8" x 16"', width: 16, height: 8, depth: 12 },
];

// Opening presets for doors/windows
const openingPresets = [
  { name: "Standard Door", width: 36, height: 80 },
  { name: "Double Door", width: 72, height: 80 },
  { name: "Garage Door (Single)", width: 96, height: 84 },
  { name: "Garage Door (Double)", width: 192, height: 84 },
  { name: "Standard Window", width: 36, height: 48 },
  { name: "Large Window", width: 60, height: 48 },
  { name: "Small Window", width: 24, height: 36 },
];

// FAQ data
const faqs = [
  {
    question: "How many concrete blocks do I need for a wall?",
    answer: "To calculate blocks needed: 1) Measure your wall's length and height in feet, 2) Calculate wall area (length × height), 3) Subtract any door/window openings, 4) Divide by the block's face area (typically 0.89 sq ft for standard 16\"×8\" blocks), 5) Add 5-10% for waste. For example, a 20ft × 8ft wall (160 sq ft) with a 3ft × 6.67ft door (20 sq ft) needs: (160-20) ÷ 0.89 × 1.10 = ~173 blocks."
  },
  {
    question: "What is the formula for calculating concrete blocks?",
    answer: "The concrete block calculation formula is: Number of Blocks = (Wall Area - Opening Area) ÷ Block Face Area × (1 + Waste Factor). For standard 8\"×16\" blocks, the face area is 128 sq inches or 0.89 sq ft. So for a 100 sq ft wall: 100 ÷ 0.89 = 112.4 blocks, plus 10% waste = 124 blocks."
  },
  {
    question: "How many blocks per square foot or square meter?",
    answer: "For standard 8\"×8\"×16\" concrete blocks: you need approximately 1.125 blocks per square foot, or about 12.1 blocks per square meter. This accounts for the 3/8\" mortar joint between blocks. Smaller 8\"×8\" blocks require 2.25 blocks per square foot."
  },
  {
    question: "How much mortar do I need for concrete blocks?",
    answer: "On average, you need 3 bags (80 lb each) of mortar mix per 100 standard concrete blocks. This equals about 1 cubic foot of mortar per 30 blocks. For precise calculations: divide your total block count by 33.3 to get the number of mortar bags needed. Always buy an extra bag or two for waste and repairs."
  },
  {
    question: "How do I calculate blocks for a wall with doors and windows?",
    answer: "First calculate the total wall area, then subtract the area of all openings (doors and windows). For a door opening, use the rough opening size (typically 2-3 inches larger than the door). Our calculator automatically handles this - just add your openings and it will deduct them from the total block count."
  },
  {
    question: "What is the standard concrete block size?",
    answer: "The most common concrete block size in the US is 8\" × 8\" × 16\" (nominal). The actual dimensions are 7-5/8\" × 7-5/8\" × 15-5/8\" to allow for 3/8\" mortar joints. Other common sizes include 4\", 6\", 10\", and 12\" thick blocks, all typically 8\" high × 16\" long."
  },
  {
    question: "How much does a concrete block wall cost?",
    answer: "Concrete blocks cost $1-$5 each depending on size and type. A typical wall costs $10-$15 per square foot installed, including blocks, mortar, and labor. DIY material costs are roughly $5-$8 per square foot. Factors affecting cost include block type, wall height, reinforcement needs, and local labor rates."
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

// Opening interface
interface Opening {
  id: number;
  name: string;
  width: number;
  height: number;
}

export default function ConcreteBlockCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"calculator" | "fill" | "reference">("calculator");

  // Wall dimensions
  const [wallLength, setWallLength] = useState<string>("20");
  const [wallHeight, setWallHeight] = useState<string>("8");
  const [lengthUnit, setLengthUnit] = useState<"ft" | "m">("ft");

  // Block settings
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const [blockPrice, setBlockPrice] = useState<string>("1.50");
  const [wasteFactor, setWasteFactor] = useState<string>("10");

  // Openings (doors/windows)
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [nextOpeningId, setNextOpeningId] = useState<number>(1);

  // Fill calculator
  const [fillBlockCount, setFillBlockCount] = useState<string>("100");
  const [fillBlockDepth, setFillBlockDepth] = useState<number>(0);

  // Add opening
  const addOpening = (preset: typeof openingPresets[0]) => {
    const newOpening: Opening = {
      id: nextOpeningId,
      name: preset.name,
      width: preset.width,
      height: preset.height
    };
    setOpenings([...openings, newOpening]);
    setNextOpeningId(nextOpeningId + 1);
  };

  // Remove opening
  const removeOpening = (id: number) => {
    setOpenings(openings.filter(o => o.id !== id));
  };

  // Update opening
  const updateOpening = (id: number, field: "width" | "height", value: number) => {
    setOpenings(openings.map(o => o.id === id ? { ...o, [field]: value } : o));
  };

  // Calculations
  const block = blockSizes[selectedBlock];
  
  // Convert to feet if needed
  const lengthInFt = lengthUnit === "ft" ? parseFloat(wallLength) || 0 : (parseFloat(wallLength) || 0) * 3.281;
  const heightInFt = lengthUnit === "ft" ? parseFloat(wallHeight) || 0 : (parseFloat(wallHeight) || 0) * 3.281;
  
  // Wall area in sq ft
  const wallArea = lengthInFt * heightInFt;
  
  // Opening area in sq ft (convert from inches)
  const openingArea = openings.reduce((sum, o) => sum + (o.width * o.height) / 144, 0);
  
  // Net wall area
  const netWallArea = Math.max(0, wallArea - openingArea);
  
  // Block face area in sq ft (with 3/8" mortar joint)
  const blockFaceArea = ((block.width + 0.375) * (block.height + 0.375)) / 144;
  
  // Blocks needed (before waste)
  const blocksBase = netWallArea / blockFaceArea;
  
  // Waste factor
  const waste = (parseFloat(wasteFactor) || 0) / 100;
  const blocksWithWaste = Math.ceil(blocksBase * (1 + waste));
  
  // Mortar bags (3 bags per 100 blocks)
  const mortarBags = Math.ceil(blocksWithWaste / 33.3);
  
  // Cost
  const price = parseFloat(blockPrice) || 0;
  const blockCost = blocksWithWaste * price;
  const mortarCost = mortarBags * 8; // ~$8 per bag average
  const totalCost = blockCost + mortarCost;

  // Fill calculator - core volume per block in cubic inches
  const fillBlock = blockSizes[fillBlockDepth];
  const coreVolume = fillBlock.depth >= 8 
    ? (fillBlock.width - 2.5) * (fillBlock.height - 1.25) * (fillBlock.depth - 2.5) * 0.6 // approximate hollow core
    : 0;
  const totalFillVolume = (parseInt(fillBlockCount) || 0) * coreVolume; // cubic inches
  const fillCubicYards = totalFillVolume / 46656; // 27 cubic feet = 1 yard, 1728 cu in = 1 cu ft
  const fillCubicFeet = totalFillVolume / 1728;
  const concreteBags60lb = Math.ceil(fillCubicFeet * 2.2); // ~0.45 cu ft per 60lb bag
  const concreteBags80lb = Math.ceil(fillCubicFeet * 1.65); // ~0.6 cu ft per 80lb bag

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#64748B" }}>
            <Link href="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#0F172A" }}>Concrete Block Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🧱</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#0F172A", margin: 0 }}>
              Concrete Block Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#475569", maxWidth: "800px" }}>
            Calculate how many concrete blocks (CMU) you need for your wall project. 
            <strong> Includes door & window opening deductions</strong> — the only calculator that accounts for openings automatically.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                Quick Rule: <strong>1.125 blocks per sq ft</strong> for standard 8&quot;×8&quot;×16&quot; blocks
              </p>
              <p style={{ color: "#2563EB", margin: 0, fontSize: "0.95rem" }}>
                A 10ft × 8ft wall (80 sq ft) needs ~90 blocks + 3 bags of mortar ≈ $150-$180 in materials
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
            <span style={{ color: "#166534", fontWeight: "600", fontSize: "0.85rem" }}>Door/Window Deduction</span>
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
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>6 Block Sizes</span>
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
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Mortar & Cost Estimate</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculator" ? "#2563EB" : "#E2E8F0",
              color: activeTab === "calculator" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧱 Block Calculator
          </button>
          <button
            onClick={() => setActiveTab("fill")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "fill" ? "#2563EB" : "#E2E8F0",
              color: activeTab === "fill" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🪣 Core Fill Calculator
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "reference" ? "#2563EB" : "#E2E8F0",
              color: activeTab === "reference" ? "white" : "#475569",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Size Reference
          </button>
        </div>

        {/* Tab 1: Block Calculator */}
        {activeTab === "calculator" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Wall Dimensions</h2>
              </div>

              <div style={{ padding: "24px" }}>
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
                        border: lengthUnit === "ft" ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: lengthUnit === "ft" ? "#EFF6FF" : "white",
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
                        border: lengthUnit === "m" ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: lengthUnit === "m" ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontWeight: lengthUnit === "m" ? "600" : "normal"
                      }}
                    >
                      Meters (m)
                    </button>
                  </div>
                </div>

                {/* Wall Length */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Wall Length
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={wallLength}
                      onChange={(e) => setWallLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "2px solid #2563EB",
                        fontSize: "1rem",
                        backgroundColor: "#EFF6FF",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>{lengthUnit}</span>
                  </div>
                </div>

                {/* Wall Height */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Wall Height
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={wallHeight}
                      onChange={(e) => setWallHeight(e.target.value)}
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

                {/* Block Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Block Size
                  </label>
                  <select
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {blockSizes.map((b, index) => (
                      <option key={index} value={index}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Waste Factor
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[5, 10, 15].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setWasteFactor(String(pct))}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: wasteFactor === String(pct) ? "2px solid #2563EB" : "1px solid #E2E8F0",
                          backgroundColor: wasteFactor === String(pct) ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: wasteFactor === String(pct) ? "600" : "normal"
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                    Recommended: 10% for standard walls, 15% for complex layouts
                  </p>
                </div>

                {/* Block Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Price per Block (optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>$</span>
                    <input
                      type="number"
                      value={blockPrice}
                      onChange={(e) => setBlockPrice(e.target.value)}
                      step="0.01"
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingLeft: "28px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Openings Section */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "12px",
                  padding: "20px",
                  border: "1px solid #86EFAC"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#166534", fontWeight: "600" }}>
                      🚪 Door & Window Openings
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "#15803D", backgroundColor: "#DCFCE7", padding: "4px 8px", borderRadius: "4px" }}>
                      Unique Feature!
                    </span>
                  </div>
                  
                  {/* Opening Presets */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {openingPresets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => addOpening(preset)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #86EFAC",
                          backgroundColor: "white",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          color: "#166534"
                        }}
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>

                  {/* Added Openings */}
                  {openings.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {openings.map((opening) => (
                        <div key={opening.id} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "white",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          flexWrap: "wrap"
                        }}>
                          <span style={{ fontSize: "0.85rem", color: "#166534", fontWeight: "500", minWidth: "100px" }}>{opening.name}</span>
                          <input
                            type="number"
                            value={opening.width}
                            onChange={(e) => updateOpening(opening.id, "width", parseFloat(e.target.value) || 0)}
                            style={{ width: "70px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                          />
                          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>×</span>
                          <input
                            type="number"
                            value={opening.height}
                            onChange={(e) => updateOpening(opening.id, "height", parseFloat(e.target.value) || 0)}
                            style={{ width: "70px", padding: "6px 8px", borderRadius: "4px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }}
                          />
                          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>in</span>
                          <button
                            onClick={() => removeOpening(opening.id)}
                            style={{
                              marginLeft: "auto",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              border: "none",
                              backgroundColor: "#FEE2E2",
                              color: "#DC2626",
                              cursor: "pointer",
                              fontSize: "0.8rem"
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {openings.length === 0 && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#15803D" }}>
                      Click buttons above to add doors or windows. We&apos;ll deduct them from the total.
                    </p>
                  )}
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Materials Needed</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#166534" }}>Total Blocks Needed</p>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#059669" }}>
                    {blocksWithWaste.toLocaleString()}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#15803D" }}>
                    {block.name}
                  </p>
                </div>

                {/* Secondary Results */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>Mortar Bags</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#D97706" }}>{mortarBags}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#B45309" }}>80 lb bags</p>
                  </div>
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #93C5FD"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#1E40AF" }}>Est. Total Cost</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#2563EB" }}>${totalCost.toFixed(0)}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#1E40AF" }}>blocks + mortar</p>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#475569", fontWeight: "600" }}>
                    Calculation Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                      <span style={{ color: "#64748B" }}>Gross Wall Area</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>{wallArea.toFixed(1)} sq ft</span>
                    </div>
                    {openingArea > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                        <span style={{ color: "#991B1B" }}>− Openings ({openings.length})</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>−{openingArea.toFixed(1)} sq ft</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F0FDF4", borderRadius: "6px" }}>
                      <span style={{ color: "#166534" }}>Net Wall Area</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{netWallArea.toFixed(1)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                      <span style={{ color: "#64748B" }}>Block Face Area</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>{blockFaceArea.toFixed(3)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F8FAFC", borderRadius: "6px" }}>
                      <span style={{ color: "#64748B" }}>Base Blocks Needed</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>{Math.ceil(blocksBase)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <span style={{ color: "#B45309" }}>+ Waste Factor ({wasteFactor}%)</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>+{Math.ceil(blocksBase * waste)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "6px", border: "2px solid #86EFAC" }}>
                      <span style={{ color: "#166534", fontWeight: "600" }}>Total Blocks</span>
                      <span style={{ fontWeight: "bold", color: "#059669", fontSize: "1.1rem" }}>{blocksWithWaste}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {price > 0 && (
                  <div style={{
                    backgroundColor: "#F8FAFC",
                    borderRadius: "8px",
                    padding: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#475569", fontWeight: "600" }}>
                      💰 Cost Breakdown
                    </h4>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B", fontSize: "0.9rem" }}>{blocksWithWaste} blocks × ${price}</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>${blockCost.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#64748B", fontSize: "0.9rem" }}>{mortarBags} mortar bags × $8</span>
                      <span style={{ fontWeight: "600", color: "#0F172A" }}>${mortarCost.toFixed(2)}</span>
                    </div>
                    <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#0F172A", fontWeight: "600" }}>Estimated Total</span>
                      <span style={{ fontWeight: "bold", color: "#059669", fontSize: "1.1rem" }}>${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Core Fill Calculator */}
        {activeTab === "fill" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🪣 Core Fill Details</h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#64748B", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Calculate how much concrete or grout you need to fill the hollow cores of your CMU wall.
                </p>

                {/* Number of Blocks */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Number of Blocks to Fill
                  </label>
                  <input
                    type="number"
                    value={fillBlockCount}
                    onChange={(e) => setFillBlockCount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #7C3AED",
                      fontSize: "1rem",
                      backgroundColor: "#F5F3FF",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Block Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#475569", marginBottom: "8px", fontWeight: "600" }}>
                    Block Thickness
                  </label>
                  <select
                    value={fillBlockDepth}
                    onChange={(e) => setFillBlockDepth(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {blockSizes.filter(b => b.depth >= 8).map((b, index) => (
                      <option key={index} value={blockSizes.indexOf(b)}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9" }}>
                    💡 <strong>Tip:</strong> Core filling adds structural strength and is required for load-bearing walls. 
                    You can use concrete, grout, or sand depending on your structural requirements.
                  </p>
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
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Fill Material Needed</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#6D28D9" }}>Fill Volume Needed</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#7C3AED" }}>
                    {fillCubicYards.toFixed(2)} yd³
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#7C3AED" }}>
                    {fillCubicFeet.toFixed(1)} cubic feet
                  </p>
                </div>

                {/* Bag Options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>60 lb Bags</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#D97706" }}>{concreteBags60lb}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#B45309" }}>bags needed</p>
                  </div>
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #93C5FD"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#1E40AF" }}>80 lb Bags</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#2563EB" }}>{concreteBags80lb}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#1E40AF" }}>bags needed</p>
                  </div>
                </div>

                {/* Info */}
                <div style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#475569", fontWeight: "600" }}>
                    📋 Coverage Notes
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#64748B", fontSize: "0.85rem", lineHeight: "1.8" }}>
                    <li>60 lb bag yields ~0.45 cubic feet</li>
                    <li>80 lb bag yields ~0.60 cubic feet</li>
                    <li>Add 10% extra for spillage and waste</li>
                    <li>Use grout for reinforced cells with rebar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reference Charts */}
        {activeTab === "reference" && (
          <div style={{ marginBottom: "40px" }}>
            {/* Block Size Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🧱 Standard CMU Block Sizes</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#EFF6FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "left" }}>Size (D×H×L)</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Nominal Size</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Face Area (sq ft)</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Blocks per 100 sq ft</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Weight (lb)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: "white" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>8&quot; × 8&quot; × 16&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>7⅝&quot; × 7⅝&quot; × 15⅝&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>0.89</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>113</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>35-40</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F8FAFC" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>8&quot; × 8&quot; × 8&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>7⅝&quot; × 7⅝&quot; × 7⅝&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>0.44</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>226</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>18-20</td>
                    </tr>
                    <tr style={{ backgroundColor: "white" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>6&quot; × 8&quot; × 16&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>5⅝&quot; × 7⅝&quot; × 15⅝&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>0.89</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>113</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>28-32</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F8FAFC" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>10&quot; × 8&quot; × 16&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>9⅝&quot; × 7⅝&quot; × 15⅝&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>0.89</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>113</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>43-48</td>
                    </tr>
                    <tr style={{ backgroundColor: "white" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>12&quot; × 8&quot; × 16&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>11⅝&quot; × 7⅝&quot; × 15⅝&quot;</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>0.89</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>113</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>52-58</td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#64748B" }}>
                  * Nominal sizes account for 3/8&quot; mortar joints. Actual block dimensions are 3/8&quot; less than nominal.
                </p>
              </div>
            </div>

            {/* Mortar Coverage Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🪣 Mortar Coverage Guide</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FEF3C7" }}>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "left" }}>Mortar Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Bags per 100 Blocks</th>
                      <th style={{ padding: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>Best Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>Type N</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>3</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0" }}>General purpose, above grade</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F8FAFC" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>Type S</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>3</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0" }}>Below grade, high strength</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", fontWeight: "600" }}>Type M</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0", textAlign: "center" }}>3</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E2E8F0" }}>Foundation, retaining walls</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Reference Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {/* Formula Card */}
              <div style={{ backgroundColor: "#EFF6FF", borderRadius: "12px", padding: "20px", border: "1px solid #93C5FD" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>📐 Block Calculation Formula</h3>
                <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.85rem", color: "#2563EB" }}>
                  Blocks = (Wall Area − Openings) ÷ Block Face Area × (1 + Waste%)
                </div>
                <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                  Standard 16&quot;×8&quot; block face area = 0.89 sq ft
                </p>
              </div>

              {/* Quick Tips */}
              <div style={{ backgroundColor: "#F0FDF4", borderRadius: "12px", padding: "20px", border: "1px solid #86EFAC" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#166534", marginBottom: "12px" }}>✅ Pro Tips</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#15803D", fontSize: "0.9rem", lineHeight: "1.8" }}>
                  <li>Order 10-15% extra blocks for cuts/waste</li>
                  <li>Use rough opening sizes for doors/windows</li>
                  <li>Stack pallets on flat, dry surface</li>
                  <li>Keep mortar joints consistent at 3/8&quot;</li>
                </ul>
              </div>

              {/* Cost Guide */}
              <div style={{ backgroundColor: "#FEF3C7", borderRadius: "12px", padding: "20px", border: "1px solid #FCD34D" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#B45309", marginBottom: "12px" }}>💰 Typical Costs (2024)</h3>
                <div style={{ fontSize: "0.9rem", color: "#D97706", lineHeight: "1.8" }}>
                  <p style={{ margin: "0 0 8px 0" }}><strong>Standard Block:</strong> $1.50 - $3.00 each</p>
                  <p style={{ margin: "0 0 8px 0" }}><strong>Mortar (80 lb):</strong> $6 - $10 per bag</p>
                  <p style={{ margin: "0 0 8px 0" }}><strong>Labor:</strong> $8 - $15 per sq ft</p>
                  <p style={{ margin: 0 }}><strong>Total Installed:</strong> $10 - $20 per sq ft</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#0F172A", marginBottom: "20px" }}>🧱 Complete Guide to Concrete Block Calculation</h2>

              <div style={{ color: "#475569", lineHeight: "1.8" }}>
                <p>
                  Concrete blocks, also known as concrete masonry units (CMU) or cinder blocks, are one of the most 
                  versatile and cost-effective building materials for walls, foundations, and structures. This calculator 
                  helps you determine exactly how many blocks you need, accounting for openings like doors and windows — 
                  a feature most other calculators lack.
                </p>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>How to Calculate Concrete Blocks</h3>
                <p>
                  The basic formula is simple: divide your net wall area (total wall minus openings) by the face area 
                  of a single block. For standard 8&quot;×8&quot;×16&quot; blocks, each block covers approximately <strong>0.89 square feet</strong> 
                  of wall surface when including the mortar joint.
                </p>

                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>📐 Example Calculation</p>
                  <p style={{ margin: 0, color: "#2563EB", fontSize: "0.95rem" }}>
                    For a 20ft × 8ft wall (160 sq ft) with a 3ft × 7ft door opening (21 sq ft):<br />
                    Net area = 160 − 21 = 139 sq ft<br />
                    Blocks needed = 139 ÷ 0.89 = 156 blocks<br />
                    With 10% waste = 172 blocks
                  </p>
                </div>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>Why Account for Door & Window Openings?</h3>
                <p>
                  Most online calculators simply multiply wall area by blocks per square foot, resulting in 
                  <strong> over-ordering by 10-30%</strong> on walls with openings. Our calculator lets you add 
                  specific openings (doors, windows, vents) and automatically deducts them from the total. 
                  This can save hundreds of dollars on large projects.
                </p>

                <h3 style={{ color: "#0F172A", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Block Size</h3>
                <p>
                  The most common CMU size is 8&quot;×8&quot;×16&quot;, suitable for most residential and commercial walls. 
                  Use <strong>thicker blocks (10&quot; or 12&quot;)</strong> for load-bearing walls, basements, or retaining walls. 
                  <strong>Thinner blocks (4&quot; or 6&quot;)</strong> work well for partition walls and non-structural applications.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>🧱 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#2563EB", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Blocks/sq ft:</strong> 1.125 (standard)</p>
                <p style={{ margin: 0 }}><strong>Mortar/100 blocks:</strong> 3 bags</p>
                <p style={{ margin: 0 }}><strong>Standard size:</strong> 8&quot;×8&quot;×16&quot;</p>
                <p style={{ margin: 0 }}><strong>Weight:</strong> 35-40 lbs each</p>
              </div>
            </div>

            {/* Tool Tip */}
            <div style={{ backgroundColor: "#F0FDF4", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #86EFAC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "12px" }}>💡 Our Advantage</h3>
              <p style={{ fontSize: "0.9rem", color: "#15803D", lineHeight: "1.7", margin: 0 }}>
                This is the only concrete block calculator that automatically deducts door and window openings. 
                Save money by ordering exactly what you need!
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/concrete-block-calculator" currentCategory="Construction" />
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
            🧱 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. Actual material 
            requirements may vary based on wall complexity, block type, mortar joint thickness, and construction methods. 
            Always consult with a professional contractor for precise estimates on structural projects. 
            Prices shown are approximate US averages and vary by location.
          </p>
        </div>
      </div>
    </div>
  );
}