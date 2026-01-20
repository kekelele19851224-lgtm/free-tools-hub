"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Shingle types with bundles per square
const shingleTypes = [
  { id: '3tab', label: '3-Tab (Standard)', bundlesPerSquare: 3, description: 'Basic, flat appearance', priceRange: '$25-$35/bundle' },
  { id: 'architectural', label: 'Architectural (Dimensional)', bundlesPerSquare: 4, description: 'Thicker, textured look', priceRange: '$30-$45/bundle' },
  { id: 'luxury', label: 'Luxury/Designer', bundlesPerSquare: 5, description: 'Premium, slate-like appearance', priceRange: '$45-$60/bundle' },
];

// Quick reference data (with 10% waste included)
const quickReferenceData = [
  { sqft: 1000, squares: 10, threeTab: 33, architectural: 44, luxury: 55 },
  { sqft: 1500, squares: 15, threeTab: 50, architectural: 66, luxury: 83 },
  { sqft: 2000, squares: 20, threeTab: 66, architectural: 88, luxury: 110 },
  { sqft: 2500, squares: 25, threeTab: 83, architectural: 110, luxury: 138 },
  { sqft: 3000, squares: 30, threeTab: 99, architectural: 132, luxury: 165 },
  { sqft: 3500, squares: 35, threeTab: 116, architectural: 154, luxury: 193 },
  { sqft: 4000, squares: 40, threeTab: 132, architectural: 176, luxury: 220 },
];

// FAQ data
const faqs = [
  {
    question: "How many bundles of shingles in a square?",
    answer: "A roofing square equals 100 square feet. For standard 3-tab shingles, you need 3 bundles per square. Architectural (dimensional) shingles typically require 4 bundles per square due to their thickness. Luxury or designer shingles may need 4-5 bundles per square. Always check the manufacturer's specifications as coverage can vary by brand."
  },
  {
    question: "How many bundles of shingles for 100 square feet?",
    answer: "For 100 square feet (1 roofing square), you need 3 bundles of standard 3-tab shingles, 4 bundles of architectural shingles, or 4-5 bundles of luxury shingles. Add 10-15% extra for waste from cutting and overlaps. So realistically, plan for 3-4 bundles for 3-tab or 4-5 bundles for architectural per 100 sq ft."
  },
  {
    question: "How many bundles of shingles do I need for 2000 square feet?",
    answer: "For a 2,000 sq ft roof (20 squares): You need approximately 60 bundles of 3-tab shingles (20 × 3), or 80 bundles of architectural shingles (20 × 4). Adding 10% for waste: 66 bundles for 3-tab or 88 bundles for architectural. Always round up and buy a few extra for future repairs."
  },
  {
    question: "How many bundles of shingles for 1500 sq ft roof?",
    answer: "For a 1,500 sq ft roof (15 squares): You need about 45 bundles of 3-tab shingles or 60 bundles of architectural shingles before waste. With 10% waste factor included: approximately 50 bundles for 3-tab or 66 bundles for architectural shingles."
  },
  {
    question: "Is 3 bundles of shingles a square?",
    answer: "Yes, for standard 3-tab asphalt shingles, 3 bundles equal 1 roofing square (100 sq ft). Each bundle covers approximately 33.3 square feet. However, thicker architectural shingles often require 4 bundles per square, and luxury shingles may need 4-5 bundles. Always verify with the shingle packaging."
  },
  {
    question: "How much does a bundle of shingles cost?",
    answer: "Shingle bundle prices vary by type: 3-tab shingles cost $25-$35 per bundle, architectural shingles run $30-$45 per bundle, and luxury/designer shingles range from $45-$60 per bundle. Prices vary by region, brand, and color. Buying by the pallet can save 5-10% on larger projects."
  }
];

// Constants
const SHINGLES_PER_BUNDLE = 29;
const SQ_FT_PER_BUNDLE = 33.3;
const SQ_FT_PER_SQUARE = 100;

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

export default function ShinglesCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'calculator' | 'reference' | 'cost'>('calculator');

  // Calculator tab states
  const [inputType, setInputType] = useState<'sqft' | 'squares'>('sqft');
  const [roofSqFt, setRoofSqFt] = useState(2000);
  const [roofSquares, setRoofSquares] = useState(20);
  const [shingleType, setShingleType] = useState('3tab');
  const [wasteFactor, setWasteFactor] = useState(10);

  // Cost calculator states
  const [costBundles, setCostBundles] = useState(66);
  const [pricePerBundle, setPricePerBundle] = useState(35);

  // Get shingle type data
  const getShingleData = (typeId: string) => {
    return shingleTypes.find(t => t.id === typeId) || shingleTypes[0];
  };

  // Calculate bundles needed
  const calculateBundles = () => {
    const shingle = getShingleData(shingleType);
    const squares = inputType === 'sqft' ? roofSqFt / SQ_FT_PER_SQUARE : roofSquares;
    const sqft = inputType === 'sqft' ? roofSqFt : roofSquares * SQ_FT_PER_SQUARE;
    
    const baseBundles = squares * shingle.bundlesPerSquare;
    const wasteMultiplier = 1 + (wasteFactor / 100);
    const totalBundles = Math.ceil(baseBundles * wasteMultiplier);
    const totalShingles = totalBundles * SHINGLES_PER_BUNDLE;
    
    return {
      squares: squares,
      sqft: sqft,
      bundlesPerSquare: shingle.bundlesPerSquare,
      baseBundles: Math.ceil(baseBundles),
      totalBundles: totalBundles,
      totalShingles: totalShingles,
      shingleType: shingle.label
    };
  };

  // Calculate cost
  const calculateCost = () => {
    const materialCost = costBundles * pricePerBundle;
    const contingency = materialCost * 0.10;
    const totalCost = materialCost + contingency;
    
    return {
      bundles: costBundles,
      pricePerBundle: pricePerBundle,
      materialCost: materialCost,
      contingency: contingency,
      totalCost: totalCost
    };
  };

  const bundleCalc = calculateBundles();
  const costCalc = calculateCost();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFBEB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FDE68A" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Shingles Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many Bundles of Shingles in a Square?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many bundles of shingles you need for your roof. Enter your roof size 
            and get instant estimates for 3-tab, architectural, and luxury shingles.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#D97706",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: Bundles per Square</strong>
              </p>
              <div style={{ color: "#FEF3C7", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>3-Tab Shingles:</strong> 3 bundles per square</p>
                <p style={{ margin: "0" }}>• <strong>Architectural Shingles:</strong> 4 bundles per square</p>
                <p style={{ margin: "0" }}>• <strong>Luxury Shingles:</strong> 4-5 bundles per square</p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>1 square = 100 sq ft | 1 bundle ≈ 33.3 sq ft coverage | Add 10-15% for waste</p>
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
              backgroundColor: activeTab === 'calculator' ? "#D97706" : "white",
              color: activeTab === 'calculator' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📦 Bundles Calculator
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'reference' ? "#D97706" : "white",
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
              backgroundColor: activeTab === 'cost' ? "#D97706" : "white",
              color: activeTab === 'cost' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💰 Cost Calculator
          </button>
        </div>

        {/* Calculator Tab */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDE68A",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 Calculate Bundles Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Input Type Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📐 Enter Roof Size As
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      onClick={() => setInputType('sqft')}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: inputType === 'sqft' ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: inputType === 'sqft' ? "#FFFBEB" : "white",
                        cursor: "pointer",
                        fontWeight: inputType === 'sqft' ? "600" : "500",
                        color: inputType === 'sqft' ? "#D97706" : "#374151"
                      }}
                    >
                      Square Feet
                    </button>
                    <button
                      onClick={() => setInputType('squares')}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: inputType === 'squares' ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: inputType === 'squares' ? "#FFFBEB" : "white",
                        cursor: "pointer",
                        fontWeight: inputType === 'squares' ? "600" : "500",
                        color: inputType === 'squares' ? "#D97706" : "#374151"
                      }}
                    >
                      Roofing Squares
                    </button>
                  </div>
                </div>

                {/* Roof Size Input */}
                {inputType === 'sqft' ? (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      🏠 Roof Area: {roofSqFt.toLocaleString()} sq ft
                    </label>
                    <input
                      type="range"
                      min={500}
                      max={5000}
                      step={100}
                      value={roofSqFt}
                      onChange={(e) => setRoofSqFt(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>500 sq ft</span>
                      <span>5,000 sq ft</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      🏠 Roof Size: {roofSquares} squares
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={roofSquares}
                      onChange={(e) => setRoofSquares(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>5 squares</span>
                      <span>50 squares</span>
                    </div>
                  </div>
                )}

                {/* Shingle Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🪨 Shingle Type
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {shingleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setShingleType(type.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: shingleType === type.id ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: shingleType === type.id ? "#FFFBEB" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ 
                              fontWeight: shingleType === type.id ? "600" : "500",
                              color: shingleType === type.id ? "#D97706" : "#374151",
                              fontSize: "0.9rem"
                            }}>
                              {type.label}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>
                              {type.description}
                            </div>
                          </div>
                          <div style={{ 
                            backgroundColor: shingleType === type.id ? "#D97706" : "#F3F4F6",
                            color: shingleType === type.id ? "white" : "#374151",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}>
                            {type.bundlesPerSquare} bundles/sq
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ♻️ Waste Factor: {wasteFactor}%
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={20}
                    step={1}
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>10% (simple roof)</span>
                    <span>20% (complex roof)</span>
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0, lineHeight: "1.6" }}>
                    💡 <strong>Tip:</strong> Add 15-20% waste for roofs with valleys, dormers, or complex angles. Simple gable roofs need only 10%.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDE68A",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Materials Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Bundles Needed</div>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#D97706" }}>
                    {bundleCalc.totalBundles}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280" }}>
                    bundles of {bundleCalc.shingleType.toLowerCase()}
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#FFFBEB", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #FDE68A"
                }}>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Roof Size:</span>
                      <span style={{ fontWeight: "600" }}>{bundleCalc.sqft.toLocaleString()} sq ft ({bundleCalc.squares} squares)</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Shingle Type:</span>
                      <span style={{ fontWeight: "600" }}>{bundleCalc.shingleType}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Bundles per Square:</span>
                      <span style={{ fontWeight: "600" }}>{bundleCalc.bundlesPerSquare}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Base Bundles:</span>
                      <span style={{ fontWeight: "600" }}>{bundleCalc.baseBundles}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Waste Factor:</span>
                      <span style={{ fontWeight: "600" }}>+{wasteFactor}%</span>
                    </div>
                    <div style={{ borderTop: "2px solid #FDE68A", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>Total Bundles:</strong></span>
                      <span style={{ fontWeight: "700", color: "#D97706", fontSize: "1.2rem" }}>{bundleCalc.totalBundles}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div style={{ 
                  backgroundColor: "#F0FDF4", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ color: "#065F46", fontWeight: "600" }}>📦 Individual Shingles:</span>
                    <span style={{ fontWeight: "700", color: "#059669" }}>~{bundleCalc.totalShingles.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#047857" }}>
                    Based on 29 shingles per bundle (standard)
                  </div>
                </div>

                {/* Tips */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    💡 Buying Tips
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Buy 1-2 extra bundles for future repairs</li>
                    <li>Check return policy before buying</li>
                    <li>Pallet pricing may save 5-10%</li>
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
              border: "1px solid #FDE68A",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Quick Reference: Bundles by Roof Size
                </h2>
              </div>

              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FFFBEB" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #FDE68A" }}>Roof Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FDE68A" }}>Squares</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FDE68A" }}>3-Tab</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FDE68A" }}>Architectural</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #FDE68A" }}>Luxury</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "500" }}>{row.sqft.toLocaleString()} sq ft</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.squares}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#D97706", fontWeight: "600" }}>{row.threeTab}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#D97706", fontWeight: "600" }}>{row.architectural}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#D97706", fontWeight: "600" }}>{row.luxury}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>
                  * All values include 10% waste factor. Bundles rounded up.
                </p>

                {/* Conversion Quick Reference */}
                <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ backgroundColor: "#FFFBEB", padding: "16px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📐 Key Conversions</h4>
                    <div style={{ fontSize: "0.85rem", color: "#92400E", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>1 square = 100 sq ft</p>
                      <p style={{ margin: 0 }}>1 bundle ≈ 33.3 sq ft</p>
                      <p style={{ margin: 0 }}>1 bundle = 29 shingles</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#FFFBEB", padding: "16px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📦 Bundles per Square</h4>
                    <div style={{ fontSize: "0.85rem", color: "#92400E", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>3-Tab: 3 bundles</p>
                      <p style={{ margin: 0 }}>Architectural: 4 bundles</p>
                      <p style={{ margin: 0 }}>Luxury: 5 bundles</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#FFFBEB", padding: "16px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0", fontSize: "0.9rem" }}>♻️ Waste Factors</h4>
                    <div style={{ fontSize: "0.85rem", color: "#92400E", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>Simple gable: 10%</p>
                      <p style={{ margin: 0 }}>Hip roof: 15%</p>
                      <p style={{ margin: 0 }}>Complex roof: 20%</p>
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
              border: "1px solid #FDE68A",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Cost Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Number of Bundles */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📦 Number of Bundles: {costBundles}
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    step={1}
                    value={costBundles}
                    onChange={(e) => setCostBundles(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>10 bundles</span>
                    <span>200 bundles</span>
                  </div>
                </div>

                {/* Price Per Bundle */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💵 Price Per Bundle: ${pricePerBundle}
                  </label>
                  <input
                    type="range"
                    min={25}
                    max={60}
                    step={1}
                    value={pricePerBundle}
                    onChange={(e) => setPricePerBundle(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$25</span>
                    <span>$60</span>
                  </div>
                </div>

                {/* Price Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📊 Typical Bundle Prices
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• 3-Tab shingles: $25-$35/bundle</p>
                    <p style={{ margin: 0 }}>• Architectural: $30-$45/bundle</p>
                    <p style={{ margin: 0 }}>• Luxury/Designer: $45-$60/bundle</p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>Prices vary by region, brand, and color</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDE68A",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💵 Cost Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Material Cost</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#D97706" }}>
                    ${costCalc.totalCost.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280" }}>
                    (includes 10% contingency)
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#FFFBEB", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Bundles:</span>
                      <span style={{ fontWeight: "600" }}>{costCalc.bundles}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Price per Bundle:</span>
                      <span style={{ fontWeight: "600" }}>${costCalc.pricePerBundle}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Material Cost:</span>
                      <span style={{ fontWeight: "600" }}>${costCalc.materialCost.toLocaleString()}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>+ 10% Contingency:</span>
                      <span style={{ fontWeight: "600" }}>${costCalc.contingency.toLocaleString()}</span>
                    </p>
                    <div style={{ borderTop: "2px solid #FDE68A", marginTop: "12px", paddingTop: "12px" }}>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                        <span><strong>Total:</strong></span>
                        <span style={{ fontWeight: "700", color: "#D97706" }}>${costCalc.totalCost.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#B91C1C", margin: 0 }}>
                    ⚠️ <strong>Note:</strong> This is material cost only. Labor typically adds $150-$300 per square for professional installation.
                  </p>
                </div>

                {/* Savings Tips */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0",
                  marginTop: "16px"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    💡 Ways to Save
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#047857", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Buy by the pallet (5-10% discount)</li>
                    <li>Shop off-season (winter)</li>
                    <li>Compare prices at multiple stores</li>
                    <li>Ask about contractor pricing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🏠 Understanding Roofing Squares and Bundles
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When planning a roofing project, understanding the relationship between <strong>squares</strong> and 
                  <strong> bundles</strong> is essential for accurate material estimation. Roofers use &quot;squares&quot; as 
                  the standard unit of measurement, while shingles are sold in bundles.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Measurements</h3>
                <div style={{
                  backgroundColor: "#FFFBEB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FDE68A"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>1 Roofing Square = 100 square feet</strong> of roof area</li>
                    <li><strong>1 Bundle covers ~33.3 sq ft</strong> (so 3 bundles = 1 square for standard shingles)</li>
                    <li><strong>1 Bundle contains ~29 shingles</strong> (standard 12&quot; × 36&quot; three-tab)</li>
                    <li><strong>Add 10-20% waste factor</strong> for cutting, overlaps, and mistakes</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Shingle Types Compared</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>3-Tab Shingles (3 bundles/square)</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#047857" }}>
                      Basic, flat appearance. Most affordable option at $25-$35/bundle. 
                      Lifespan of 15-20 years. Best for budget-conscious projects.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#FFFBEB", padding: "16px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0" }}>Architectural Shingles (4 bundles/square)</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#92400E" }}>
                      Dimensional, textured look. Mid-range pricing at $30-$45/bundle. 
                      Lifespan of 25-30 years. Most popular choice for homes.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <h4 style={{ color: "#1D4ED8", margin: "0 0 8px 0" }}>Luxury Shingles (4-5 bundles/square)</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#2563EB" }}>
                      Premium, slate-like appearance. Higher cost at $45-$60/bundle. 
                      Lifespan of 30+ years. Best curb appeal and warranty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Did You Know */}
            <div style={{ backgroundColor: "#D97706", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}>Average US roof = <strong>17 squares</strong> (1,700 sq ft)</p>
                <p style={{ margin: "0 0 12px 0" }}>That&apos;s about <strong>51-68 bundles</strong> depending on shingle type</p>
                <p style={{ margin: "0" }}>Architectural shingles are now <strong>80% of the market</strong></p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Common Mistakes</h3>
              <ul style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>Using house sq ft instead of roof sq ft</li>
                <li>Forgetting the 10-20% waste factor</li>
                <li>Not accounting for valleys/dormers</li>
                <li>Mixing shingle brands (color varies)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/shingles-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
          <p style={{ fontSize: "0.75rem", color: "#B45309", textAlign: "center", margin: 0 }}>
            🏠 <strong>Disclaimer:</strong> These calculations are estimates based on standard shingle specifications. 
            Actual quantities may vary by manufacturer and roof complexity. Always verify bundle coverage on packaging 
            and consult with a professional roofer for accurate estimates.
          </p>
        </div>
      </div>
    </div>
  );
}