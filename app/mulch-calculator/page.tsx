"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Bag sizes
const bagSizes = [
  { id: '1.5', label: '1.5 cu ft', cuft: 1.5, bagsPerYard: 18 },
  { id: '2', label: '2 cu ft (Most Common)', cuft: 2, bagsPerYard: 13.5 },
  { id: '3', label: '3 cu ft', cuft: 3, bagsPerYard: 9 },
];

// Mulch depths
const mulchDepths = [
  { id: '2', label: '2 inches', inches: 2, description: 'Light coverage, decorative' },
  { id: '3', label: '3 inches', inches: 3, description: 'Standard, good weed control' },
  { id: '4', label: '4 inches', inches: 4, description: 'Heavy coverage, max protection' },
];

// Quick reference data
const quickReferenceData = [
  { sqft: 100, depth2: { yards: 0.62, bags2: 9, bags3: 6 }, depth3: { yards: 0.93, bags2: 13, bags3: 9 } },
  { sqft: 250, depth2: { yards: 1.54, bags2: 21, bags3: 14 }, depth3: { yards: 2.31, bags2: 32, bags3: 21 } },
  { sqft: 500, depth2: { yards: 3.09, bags2: 42, bags3: 28 }, depth3: { yards: 4.63, bags2: 63, bags3: 42 } },
  { sqft: 750, depth2: { yards: 4.63, bags2: 63, bags3: 42 }, depth3: { yards: 6.94, bags2: 94, bags3: 63 } },
  { sqft: 1000, depth2: { yards: 6.17, bags2: 84, bags3: 56 }, depth3: { yards: 9.26, bags2: 125, bags3: 84 } },
  { sqft: 1500, depth2: { yards: 9.26, bags2: 125, bags3: 84 }, depth3: { yards: 13.89, bags2: 188, bags3: 125 } },
];

// FAQ data
const faqs = [
  {
    question: "How many bags of mulch in a cubic yard?",
    answer: "One cubic yard equals 27 cubic feet. For the most common 2 cubic foot bags, you need 13.5 bags per yard (27 ÷ 2 = 13.5). For 3 cubic foot bags, you need 9 bags per yard. For smaller 1.5 cubic foot bags, you need 18 bags per yard."
  },
  {
    question: "How many bags of mulch do I need for 1 yard?",
    answer: "You need approximately 13-14 bags of standard 2 cubic foot mulch to equal 1 cubic yard. If using larger 3 cubic foot bags, you only need 9 bags. Always round up and buy 10% extra to account for settling and spillage."
  },
  {
    question: "Is it cheaper to buy mulch by the yard or in bags?",
    answer: "Bulk mulch is typically 30-50% cheaper than bagged mulch. For example, bagged mulch might cost $3-5 per 2 cu ft bag ($40-67 per cubic yard), while bulk mulch costs $30-45 per cubic yard. For projects requiring 2+ cubic yards, bulk is significantly more economical."
  },
  {
    question: "How many square feet does a bag of mulch cover?",
    answer: "A standard 2 cubic foot bag covers about 12 square feet at 2 inches deep, or 8 square feet at 3 inches deep. A 3 cubic foot bag covers about 18 square feet at 2 inches deep, or 12 square feet at 3 inches deep."
  },
  {
    question: "How many bags of mulch do I need for 500 sq ft?",
    answer: "For 500 square feet at 2 inches deep, you need about 42 bags (2 cu ft) or 28 bags (3 cu ft). At 3 inches deep, you need about 63 bags (2 cu ft) or 42 bags (3 cu ft). This equals approximately 3-4.6 cubic yards depending on depth."
  },
  {
    question: "How many 1.5 cubic feet bags of mulch in a yard?",
    answer: "You need 18 bags of 1.5 cubic foot mulch to equal one cubic yard (27 ÷ 1.5 = 18). These smaller bags are easier to carry but require more bags overall, so they're best for small projects or when heavy lifting is a concern."
  }
];

// Constants
const CUBIC_FEET_PER_YARD = 27;

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

export default function MulchCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'calculator' | 'reference' | 'cost'>('calculator');

  // Calculator tab states
  const [areaSqFt, setAreaSqFt] = useState(500);
  const [depthInches, setDepthInches] = useState(3);
  const [bagSize, setBagSize] = useState('2');

  // Cost calculator states
  const [pricePerBag, setPricePerBag] = useState(5);
  const [bulkPricePerYard, setBulkPricePerYard] = useState(40);

  // Get bag size data
  const getBagData = (sizeId: string) => {
    return bagSizes.find(b => b.id === sizeId) || bagSizes[1];
  };

  // Calculate mulch needed
  const calculateMulch = () => {
    const bag = getBagData(bagSize);
    
    // Calculate cubic feet needed
    const depthFeet = depthInches / 12;
    const cubicFeet = areaSqFt * depthFeet;
    
    // Calculate cubic yards
    const cubicYards = cubicFeet / CUBIC_FEET_PER_YARD;
    
    // Calculate bags needed (round up)
    const bagsNeeded = Math.ceil(cubicFeet / bag.cuft);
    
    // Calculate with 10% extra
    const bagsWithExtra = Math.ceil(bagsNeeded * 1.1);
    
    return {
      cubicFeet,
      cubicYards,
      bagsNeeded,
      bagsWithExtra,
      bagSize: bag.cuft,
      coverage: (bag.cuft * 12 / depthInches).toFixed(1) // sq ft per bag at this depth
    };
  };

  // Calculate cost comparison
  const calculateCost = () => {
    const mulch = calculateMulch();
    
    const baggedCost = mulch.bagsWithExtra * pricePerBag;
    const bulkCost = Math.ceil(mulch.cubicYards * 10) / 10 * bulkPricePerYard; // Round yards to 0.1
    const savings = baggedCost - bulkCost;
    const savingsPercent = (savings / baggedCost * 100).toFixed(0);
    
    return {
      bagsNeeded: mulch.bagsWithExtra,
      cubicYards: mulch.cubicYards,
      baggedCost,
      bulkCost,
      savings,
      savingsPercent,
      bulkIsCheaper: bulkCost < baggedCost
    };
  };

  const mulchCalc = calculateMulch();
  const costCalc = calculateCost();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BBF7D0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Mulch Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🌿</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many Bags of Mulch in a Yard?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many bags of mulch you need for your garden or landscaping project. 
            1 cubic yard = 13.5 bags (2 cu ft). Compare bagged vs bulk mulch costs.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#16A34A",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: Bags per Cubic Yard</strong>
              </p>
              <div style={{ color: "#DCFCE7", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>2 cu ft bags: 13.5 bags</strong> per yard (most common)</p>
                <p style={{ margin: "0" }}>• <strong>3 cu ft bags: 9 bags</strong> per yard</p>
                <p style={{ margin: "0" }}>• <strong>1.5 cu ft bags: 18 bags</strong> per yard</p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>1 cubic yard = 27 cubic feet | Always buy 10% extra for settling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('calculator')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'calculator' ? "#16A34A" : "white",
              color: activeTab === 'calculator' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📦 Bags Calculator
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'reference' ? "#16A34A" : "white",
              color: activeTab === 'reference' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📋 Quick Reference
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'cost' ? "#16A34A" : "white",
              color: activeTab === 'cost' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💰 Cost Calculator
          </button>
        </div>

        {/* Bags Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BBF7D0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 Calculate Mulch Bags
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Area Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📐 Area to Cover: {areaSqFt.toLocaleString()} sq ft
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    step={50}
                    value={areaSqFt}
                    onChange={(e) => setAreaSqFt(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>50 sq ft</span>
                    <span>2,000 sq ft</span>
                  </div>
                </div>

                {/* Depth Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📏 Mulch Depth
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {mulchDepths.map((depth) => (
                      <button
                        key={depth.id}
                        onClick={() => setDepthInches(depth.inches)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: depthInches === depth.inches ? "2px solid #16A34A" : "1px solid #E5E7EB",
                          backgroundColor: depthInches === depth.inches ? "#F0FDF4" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ 
                              fontWeight: depthInches === depth.inches ? "600" : "500",
                              color: depthInches === depth.inches ? "#15803D" : "#374151",
                              fontSize: "0.9rem"
                            }}>
                              {depth.label}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                              {depth.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bag Size Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🛍️ Bag Size
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {bagSizes.map((bag) => (
                      <button
                        key={bag.id}
                        onClick={() => setBagSize(bag.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: bagSize === bag.id ? "2px solid #16A34A" : "1px solid #E5E7EB",
                          backgroundColor: bagSize === bag.id ? "#F0FDF4" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ 
                            fontWeight: bagSize === bag.id ? "600" : "500",
                            color: bagSize === bag.id ? "#15803D" : "#374151",
                            fontSize: "0.9rem"
                          }}>
                            {bag.label}
                          </div>
                          <div style={{ 
                            backgroundColor: bagSize === bag.id ? "#16A34A" : "#F3F4F6",
                            color: bagSize === bag.id ? "white" : "#374151",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}>
                            {bag.bagsPerYard} per yard
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Formula Box */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BBF7D0"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#15803D", margin: 0, lineHeight: "1.6" }}>
                    📝 <strong>Formula:</strong> Bags = (Sq ft × Depth in.) ÷ 12 ÷ Bag size
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BBF7D0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#15803D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🌿 Mulch Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Bags Needed (with 10% extra)</div>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#16A34A" }}>
                    {mulchCalc.bagsWithExtra}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280" }}>
                    bags of {getBagData(bagSize).cuft} cu ft mulch
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#F0FDF4", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #BBF7D0"
                }}>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Area:</span>
                      <span style={{ fontWeight: "600" }}>{areaSqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Depth:</span>
                      <span style={{ fontWeight: "600" }}>{depthInches} inches</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Cubic Feet:</span>
                      <span style={{ fontWeight: "600" }}>{mulchCalc.cubicFeet.toFixed(1)} cu ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Cubic Yards:</span>
                      <span style={{ fontWeight: "600" }}>{mulchCalc.cubicYards.toFixed(2)} yards</span>
                    </div>
                    <div style={{ borderTop: "2px solid #BBF7D0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>Exact Bags:</strong></span>
                      <span style={{ fontWeight: "600" }}>{mulchCalc.bagsNeeded}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>With 10% Extra:</strong></span>
                      <span style={{ fontWeight: "700", color: "#16A34A", fontSize: "1.1rem" }}>{mulchCalc.bagsWithExtra} bags</span>
                    </div>
                  </div>
                </div>

                {/* Coverage Info */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                    📊 Each {getBagData(bagSize).cuft} cu ft bag covers <strong>{mulchCalc.coverage} sq ft</strong> at {depthInches}&quot; depth
                  </p>
                </div>

                {/* Tips */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    💡 Buying Tips
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#047857", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Buy 10% extra for settling & spillage</li>
                    <li>Bulk is cheaper for 2+ cubic yards</li>
                    <li>Check for spring/fall sales</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Tab */}
        {activeTab === 'reference' && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BBF7D0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Quick Reference: Bags by Area & Depth
                </h2>
              </div>

              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F0FDF4" }}>
                      <th rowSpan={2} style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #BBF7D0", verticalAlign: "bottom" }}>Area (sq ft)</th>
                      <th colSpan={3} style={{ padding: "8px 16px", textAlign: "center", fontWeight: "600", borderBottom: "1px solid #BBF7D0" }}>2&quot; Depth</th>
                      <th colSpan={3} style={{ padding: "8px 16px", textAlign: "center", fontWeight: "600", borderBottom: "1px solid #BBF7D0" }}>3&quot; Depth</th>
                    </tr>
                    <tr style={{ backgroundColor: "#F0FDF4" }}>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>Yards</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>2 cu ft</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>3 cu ft</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>Yards</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>2 cu ft</th>
                      <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0", fontSize: "0.75rem" }}>3 cu ft</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>{row.sqft.toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#6B7280" }}>{row.depth2.yards}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#16A34A", fontWeight: "600" }}>{row.depth2.bags2}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#16A34A", fontWeight: "600" }}>{row.depth2.bags3}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#6B7280" }}>{row.depth3.yards}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#16A34A", fontWeight: "600" }}>{row.depth3.bags2}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#16A34A", fontWeight: "600" }}>{row.depth3.bags3}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>
                  * Bag counts include 10% extra for settling. Yards rounded to 2 decimal places.
                </p>

                {/* Key Conversions */}
                <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#15803D", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📦 Bags per Yard</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>1.5 cu ft: 18 bags</p>
                      <p style={{ margin: 0 }}>2 cu ft: 13.5 bags</p>
                      <p style={{ margin: 0 }}>3 cu ft: 9 bags</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#15803D", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📐 Coverage per Bag (2 cu ft)</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>@ 2&quot; deep: 12 sq ft</p>
                      <p style={{ margin: 0 }}>@ 3&quot; deep: 8 sq ft</p>
                      <p style={{ margin: 0 }}>@ 4&quot; deep: 6 sq ft</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#15803D", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📏 1 Cubic Yard Covers</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>@ 2&quot; deep: 162 sq ft</p>
                      <p style={{ margin: 0 }}>@ 3&quot; deep: 108 sq ft</p>
                      <p style={{ margin: 0 }}>@ 4&quot; deep: 81 sq ft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Calculator Tab */}
        {activeTab === 'cost' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BBF7D0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Cost Comparison
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Area Reminder */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "24px",
                  border: "1px solid #BBF7D0"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#166534", margin: 0 }}>
                    📦 Based on: <strong>{areaSqFt} sq ft</strong> @ <strong>{depthInches}&quot;</strong> depth = <strong>{mulchCalc.bagsWithExtra} bags</strong> ({mulchCalc.cubicYards.toFixed(2)} yards)
                  </p>
                </div>

                {/* Price Per Bag */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🛍️ Price Per Bag: ${pricePerBag.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    step={0.5}
                    value={pricePerBag}
                    onChange={(e) => setPricePerBag(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$2.00</span>
                    <span>$8.00</span>
                  </div>
                </div>

                {/* Bulk Price Per Yard */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🚛 Bulk Price Per Yard: ${bulkPricePerYard}
                  </label>
                  <input
                    type="range"
                    min={25}
                    max={70}
                    step={5}
                    value={bulkPricePerYard}
                    onChange={(e) => setBulkPricePerYard(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$25/yard</span>
                    <span>$70/yard</span>
                  </div>
                </div>

                {/* Price Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📊 Typical Prices
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• Economy mulch: $3-4/bag, $30-35/yard</p>
                    <p style={{ margin: 0 }}>• Premium mulch: $5-6/bag, $40-50/yard</p>
                    <p style={{ margin: 0 }}>• Cedar/hardwood: $6-8/bag, $50-70/yard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BBF7D0",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#15803D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💵 Cost Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Bagged Cost */}
                <div style={{ 
                  backgroundColor: costCalc.bulkIsCheaper ? "#FEF2F2" : "#ECFDF5", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "16px",
                  border: costCalc.bulkIsCheaper ? "1px solid #FECACA" : "1px solid #A7F3D0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#374151" }}>📦 Bagged Mulch</span>
                    {!costCalc.bulkIsCheaper && <span style={{ backgroundColor: "#16A34A", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>Best Value</span>}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>
                    {costCalc.bagsNeeded} bags × ${pricePerBag.toFixed(2)} = 
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: costCalc.bulkIsCheaper ? "#DC2626" : "#16A34A" }}>
                    ${costCalc.baggedCost.toFixed(2)}
                  </div>
                </div>

                {/* Bulk Cost */}
                <div style={{ 
                  backgroundColor: costCalc.bulkIsCheaper ? "#ECFDF5" : "#FEF2F2", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "16px",
                  border: costCalc.bulkIsCheaper ? "1px solid #A7F3D0" : "1px solid #FECACA"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#374151" }}>🚛 Bulk Mulch</span>
                    {costCalc.bulkIsCheaper && <span style={{ backgroundColor: "#16A34A", color: "white", padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem" }}>Best Value</span>}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>
                    {mulchCalc.cubicYards.toFixed(1)} yards × ${bulkPricePerYard} = 
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: costCalc.bulkIsCheaper ? "#16A34A" : "#DC2626" }}>
                    ${costCalc.bulkCost.toFixed(2)}
                  </div>
                </div>

                {/* Savings */}
                {costCalc.savings > 0 && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ fontSize: "0.9rem", color: "#92400E", margin: 0 }}>
                      💡 You save <strong>${costCalc.savings.toFixed(2)} ({costCalc.savingsPercent}%)</strong> with {costCalc.bulkIsCheaper ? 'bulk' : 'bags'}!
                    </p>
                  </div>
                )}

                {/* Recommendation */}
                <div style={{
                  backgroundColor: "#F0F9FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BAE6FD",
                  marginTop: "16px"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0369A1", margin: "0 0 8px 0" }}>
                    📝 Recommendation
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#0284C7", margin: 0, lineHeight: "1.6" }}>
                    {mulchCalc.cubicYards >= 2 
                      ? "For 2+ cubic yards, bulk delivery is usually cheaper even with delivery fees ($25-50)."
                      : "For small projects under 2 yards, bags are more convenient and often similar in cost."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BBF7D0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🌿 Understanding Mulch Measurements
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When shopping for mulch, you&apos;ll encounter two main buying options: <strong>bagged mulch</strong> (sold 
                  in cubic feet) and <strong>bulk mulch</strong> (sold by the cubic yard). Understanding the conversion 
                  between these units helps you buy the right amount and get the best value.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Conversion: 1 Cubic Yard = 27 Cubic Feet</h3>
                <div style={{
                  backgroundColor: "#F0FDF4",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BBF7D0"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>2 cu ft bags:</strong> 13.5 bags = 1 cubic yard (most common size)</li>
                    <li><strong>3 cu ft bags:</strong> 9 bags = 1 cubic yard</li>
                    <li><strong>1.5 cu ft bags:</strong> 18 bags = 1 cubic yard</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Deep Should Mulch Be?</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0" }}>2 Inches — Light Coverage</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#92400E" }}>
                      Good for decorative purposes and light weed suppression. Best for refreshing existing mulch beds.
                      1 cubic yard covers 162 sq ft at this depth.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>3 Inches — Standard (Recommended)</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#047857" }}>
                      Ideal balance of weed control, moisture retention, and soil temperature regulation.
                      1 cubic yard covers 108 sq ft at this depth.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ color: "#0369A1", margin: "0 0 8px 0" }}>4 Inches — Heavy Coverage</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#0284C7" }}>
                      Maximum weed protection. Be careful not to pile against plant stems or tree trunks.
                      1 cubic yard covers 81 sq ft at this depth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#16A34A", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🌿 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}><strong>1 yard = 13.5 bags</strong> (2 cu ft)</p>
                <p style={{ margin: "0 0 12px 0" }}>Standard depth: <strong>2-3 inches</strong></p>
                <p style={{ margin: "0" }}>Bulk saves <strong>30-50%</strong> vs bags</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Common Mistakes</h3>
              <ul style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>Piling mulch against tree trunks (causes rot)</li>
                <li>Going too thin (&lt;2&quot;) — weeds will grow through</li>
                <li>Not buying 10% extra for settling</li>
                <li>Forgetting delivery fees for bulk</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/mulch-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BBF7D0", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: "0.75rem", color: "#166534", textAlign: "center", margin: 0 }}>
            🌿 <strong>Disclaimer:</strong> Calculations include a 10% buffer for settling and spillage. 
            Actual coverage may vary based on mulch type, moisture content, and spreading technique. 
            Bulk prices may not include delivery fees.
          </p>
        </div>
      </div>
    </div>
  );
}