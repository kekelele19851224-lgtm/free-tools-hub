"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Pallet sizes
const palletSizes = [
  { id: '400', label: '400 sq ft', sqft: 400, description: 'Smaller pallet' },
  { id: '450', label: '450 sq ft (Most Common)', sqft: 450, description: 'Standard pallet' },
  { id: '500', label: '500 sq ft', sqft: 500, description: 'Large pallet' },
  { id: '504', label: '504 sq ft', sqft: 504, description: 'Premium pallet' },
];

// Grass types reference
const grassTypes = [
  { name: 'Bermuda', climate: 'Warm (South)', features: 'Drought-tolerant, full sun', price: '$0.35-0.55/sq ft' },
  { name: 'Zoysia', climate: 'Warm to Transition', features: 'Slow-growing, dense', price: '$0.40-0.65/sq ft' },
  { name: 'St. Augustine', climate: 'Warm (Gulf Coast)', features: 'Shade-tolerant, thick blade', price: '$0.35-0.60/sq ft' },
  { name: 'Kentucky Bluegrass', climate: 'Cool (North)', features: 'Lush, dark green', price: '$0.35-0.55/sq ft' },
  { name: 'Tall Fescue', climate: 'Transition Zone', features: 'Adaptable, deep roots', price: '$0.30-0.50/sq ft' },
  { name: 'Centipede', climate: 'Warm (Southeast)', features: 'Low maintenance', price: '$0.40-0.60/sq ft' },
];

// Quick reference data (with 10% waste)
const quickReferenceData = [
  { sqft: 500, p400: 2, p450: 2, p500: 2 },
  { sqft: 1000, p400: 3, p450: 3, p500: 3 },
  { sqft: 1500, p400: 5, p450: 4, p500: 4 },
  { sqft: 2000, p400: 6, p450: 5, p500: 5 },
  { sqft: 2500, p400: 7, p450: 7, p500: 6 },
  { sqft: 3000, p400: 9, p450: 8, p500: 7 },
  { sqft: 4000, p400: 11, p450: 10, p500: 9 },
  { sqft: 5000, p400: 14, p450: 13, p500: 11 },
];

// FAQ data
const faqs = [
  {
    question: "How many square feet in a pallet of sod?",
    answer: "A standard pallet of sod covers 400-500 square feet, with 450 sq ft being the most common size. The exact coverage varies by supplier, grass type, and harvesting method. Large roll pallets (common in northern regions) can cover 500-700 sq ft. Always confirm the exact square footage with your supplier before ordering."
  },
  {
    question: "How much is 500 square feet of sod?",
    answer: "For 500 square feet of sod, expect to pay $150-$400 for materials depending on grass type. Budget grass like Bermuda costs around $0.30-0.40/sq ft ($150-200), while premium varieties like Zoysia can cost $0.50-0.80/sq ft ($250-400). Add $50-150 for delivery and $250-500 for professional installation if needed."
  },
  {
    question: "How much does a pallet of sod weigh?",
    answer: "A pallet of sod typically weighs 1,500-3,000 pounds, depending on moisture content and grass type. Freshly cut sod is heavier due to moisture. A 450 sq ft pallet averages around 2,000-2,500 lbs. Ensure your vehicle can safely handle this weight if picking up yourself—most pickup trucks can handle one pallet."
  },
  {
    question: "How many pieces of sod are on a pallet?",
    answer: "A standard pallet contains 150-170 individual sod pieces. Each piece typically measures 16 inches by 24 inches (about 2.67 sq ft). Some suppliers use different sizes like 18\" x 24\" or sell sod in rolls covering 10 sq ft each. A 450 sq ft pallet would have approximately 168 pieces at 2.67 sq ft each."
  },
  {
    question: "Is it better to lay sod in spring or fall?",
    answer: "The best time depends on your grass type. For warm-season grasses (Bermuda, Zoysia, St. Augustine), late spring to early summer is ideal when soil temperatures are above 65°F. For cool-season grasses (Kentucky Bluegrass, Fescue), early fall is best, followed by early spring. Avoid installing sod during extreme heat or freezing temperatures."
  },
  {
    question: "How many pallets of sod do I need for 1 acre?",
    answer: "One acre equals 43,560 square feet. For a 450 sq ft pallet, you would need approximately 97 pallets (43,560 ÷ 450 = 96.8). Adding 10% for waste brings this to about 107 pallets. At 400 sq ft per pallet, you'd need about 120 pallets. This is a major project—most suppliers offer bulk pricing for large orders."
  }
];

// Constants
const SQ_FT_PER_ROLL = 10;
const SQ_FT_PER_PIECE = 2.67;
const PALLET_WEIGHT_MIN = 1500;
const PALLET_WEIGHT_MAX = 3000;

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

export default function SodCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'calculator' | 'reference' | 'cost'>('calculator');

  // Calculator tab states
  const [lawnSqFt, setLawnSqFt] = useState(2000);
  const [palletSize, setPalletSize] = useState('450');
  const [wasteFactor, setWasteFactor] = useState(10);

  // Cost calculator states
  const [pricePerSqFt, setPricePerSqFt] = useState(0.50);
  const [deliveryCost, setDeliveryCost] = useState(100);
  const [includeInstall, setIncludeInstall] = useState(false);
  const [installCostPerSqFt, setInstallCostPerSqFt] = useState(1.00);

  // Get pallet size data
  const getPalletData = (sizeId: string) => {
    return palletSizes.find(p => p.id === sizeId) || palletSizes[1];
  };

  // Calculate sod needed
  const calculateSod = () => {
    const pallet = getPalletData(palletSize);
    
    // Calculate with waste factor
    const wasteMultiplier = 1 + (wasteFactor / 100);
    const totalSqFt = lawnSqFt * wasteMultiplier;
    
    // Calculate pallets (round up)
    const palletsExact = totalSqFt / pallet.sqft;
    const palletsNeeded = Math.ceil(palletsExact);
    
    // Calculate rolls and pieces
    const rollsNeeded = Math.ceil(totalSqFt / SQ_FT_PER_ROLL);
    const piecesNeeded = Math.ceil(totalSqFt / SQ_FT_PER_PIECE);
    
    // Calculate weight range
    const weightMin = palletsNeeded * PALLET_WEIGHT_MIN;
    const weightMax = palletsNeeded * PALLET_WEIGHT_MAX;
    
    return {
      lawnSqFt,
      totalSqFt: Math.round(totalSqFt),
      palletSize: pallet.sqft,
      palletsExact: palletsExact.toFixed(2),
      palletsNeeded,
      rollsNeeded,
      piecesNeeded,
      weightMin,
      weightMax,
      halfPallets: palletsExact < 1 ? Math.ceil(totalSqFt / (pallet.sqft / 2)) : null
    };
  };

  // Calculate cost
  const calculateCost = () => {
    const sod = calculateSod();
    
    const materialCost = sod.totalSqFt * pricePerSqFt;
    const installCost = includeInstall ? sod.totalSqFt * installCostPerSqFt : 0;
    const totalCost = materialCost + deliveryCost + installCost;
    
    // Cost per pallet estimate
    const costPerPallet = (sod.palletSize * pricePerSqFt);
    
    return {
      sqft: sod.totalSqFt,
      pallets: sod.palletsNeeded,
      materialCost,
      deliveryCost,
      installCost,
      totalCost,
      costPerPallet,
      pricePerSqFt
    };
  };

  const sodCalc = calculateSod();
  const costCalc = calculateCost();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BBF7D0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Sod Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🌱</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many Square Feet in a Pallet of Sod?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many pallets of sod you need for your lawn. A standard pallet covers 
            400-500 sq ft (most common: 450 sq ft). Compare grass types and estimate costs.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#22C55E",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: Square Feet per Pallet of Sod</strong>
              </p>
              <div style={{ color: "#DCFCE7", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>Standard pallet: 400-500 sq ft</strong> (most common: 450 sq ft)</p>
                <p style={{ margin: "0" }}>• <strong>Half pallet: ~225 sq ft</strong> | <strong>Single roll: 10 sq ft</strong> | <strong>Single piece: 2.67 sq ft</strong></p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>Pallet weight: 1,500-3,000 lbs | Always add 5-10% extra for cutting and waste</p>
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
              backgroundColor: activeTab === 'calculator' ? "#22C55E" : "white",
              color: activeTab === 'calculator' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            🌱 Sod Calculator
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'reference' ? "#22C55E" : "white",
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
              backgroundColor: activeTab === 'cost' ? "#22C55E" : "white",
              color: activeTab === 'cost' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💰 Cost Calculator
          </button>
        </div>

        {/* Sod Calculator Tab */}
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
              <div style={{ backgroundColor: "#22C55E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🌱 Calculate Sod Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Lawn Size Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📐 Lawn Area: {lawnSqFt.toLocaleString()} sq ft
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={10000}
                    step={100}
                    value={lawnSqFt}
                    onChange={(e) => setLawnSqFt(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>100 sq ft</span>
                    <span>10,000 sq ft</span>
                  </div>
                </div>

                {/* Pallet Size Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📦 Pallet Size
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {palletSizes.map((pallet) => (
                      <button
                        key={pallet.id}
                        onClick={() => setPalletSize(pallet.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: palletSize === pallet.id ? "2px solid #22C55E" : "1px solid #E5E7EB",
                          backgroundColor: palletSize === pallet.id ? "#F0FDF4" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ 
                              fontWeight: palletSize === pallet.id ? "600" : "500",
                              color: palletSize === pallet.id ? "#16A34A" : "#374151",
                              fontSize: "0.9rem"
                            }}>
                              {pallet.label}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                              {pallet.description}
                            </div>
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
                    min={5}
                    max={15}
                    step={1}
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>5% (straight edges)</span>
                    <span>15% (curved/complex)</span>
                  </div>
                </div>

                {/* Tip Box */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BBF7D0"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#166534", margin: 0, lineHeight: "1.6" }}>
                    💡 <strong>Tip:</strong> Add 10% for lawns with curves, flower beds, or obstacles. 5% is fine for simple rectangular areas.
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
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 Sod Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Pallets Needed</div>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#22C55E" }}>
                    {sodCalc.palletsNeeded}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280" }}>
                    pallets ({sodCalc.palletSize} sq ft each)
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
                      <span style={{ color: "#374151" }}>Lawn Area:</span>
                      <span style={{ fontWeight: "600" }}>{sodCalc.lawnSqFt.toLocaleString()} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>+ {wasteFactor}% Waste:</span>
                      <span style={{ fontWeight: "600" }}>{sodCalc.totalSqFt.toLocaleString()} sq ft total</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Exact Pallets:</span>
                      <span style={{ fontWeight: "600" }}>{sodCalc.palletsExact}</span>
                    </div>
                    <div style={{ borderTop: "2px solid #BBF7D0", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>Pallets to Order:</strong></span>
                      <span style={{ fontWeight: "700", color: "#22C55E", fontSize: "1.2rem" }}>{sodCalc.palletsNeeded}</span>
                    </div>
                  </div>
                </div>

                {/* Alternative Measurements */}
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #BFDBFE"
                }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1D4ED8", margin: "0 0 12px 0" }}>
                    📊 Alternative Measurements
                  </h3>
                  <div style={{ display: "grid", gap: "8px", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>Rolls (10 sq ft each):</span>
                      <span style={{ fontWeight: "600", color: "#1D4ED8" }}>{sodCalc.rollsNeeded} rolls</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>Pieces (2.67 sq ft each):</span>
                      <span style={{ fontWeight: "600", color: "#1D4ED8" }}>{sodCalc.piecesNeeded} pieces</span>
                    </div>
                  </div>
                </div>

                {/* Weight Warning */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                    ⚖️ <strong>Total Weight:</strong> {(sodCalc.weightMin / 1000).toFixed(1)}k - {(sodCalc.weightMax / 1000).toFixed(1)}k lbs
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#B45309", margin: "4px 0 0 0" }}>
                    Most pickup trucks can carry 1 pallet. Consider delivery for multiple pallets.
                  </p>
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
              <div style={{ backgroundColor: "#22C55E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Quick Reference: Pallets by Lawn Size
                </h2>
              </div>

              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F0FDF4" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #BBF7D0" }}>Lawn Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0" }}>400 sq ft Pallet</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0" }}>450 sq ft Pallet</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BBF7D0" }}>500 sq ft Pallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quickReferenceData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "600" }}>{row.sqft.toLocaleString()} sq ft</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#22C55E", fontWeight: "600" }}>{row.p400} pallets</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#22C55E", fontWeight: "600" }}>{row.p450} pallets</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", color: "#22C55E", fontWeight: "600" }}>{row.p500} pallets</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>
                  * Includes 10% waste factor. Always round up to nearest whole pallet.
                </p>

                {/* Grass Types Reference */}
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#111827", margin: "32px 0 16px 0" }}>
                  🌿 Grass Types by Climate
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
                  {grassTypes.map((grass, idx) => (
                    <div key={idx} style={{ 
                      backgroundColor: "#F0FDF4", 
                      padding: "16px", 
                      borderRadius: "8px", 
                      border: "1px solid #BBF7D0" 
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <h4 style={{ color: "#16A34A", margin: 0, fontSize: "0.95rem" }}>{grass.name}</h4>
                        <span style={{ 
                          backgroundColor: "#22C55E", 
                          color: "white", 
                          padding: "2px 8px", 
                          borderRadius: "4px", 
                          fontSize: "0.7rem",
                          fontWeight: "600"
                        }}>
                          {grass.climate}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#166534", margin: "0 0 4px 0" }}>{grass.features}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Price: {grass.price}</p>
                    </div>
                  ))}
                </div>

                {/* Key Conversions */}
                <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#16A34A", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📦 Pallet Facts</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>Standard: 400-500 sq ft</p>
                      <p style={{ margin: 0 }}>Half pallet: ~225 sq ft</p>
                      <p style={{ margin: 0 }}>Weight: 1,500-3,000 lbs</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#16A34A", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📏 Piece Sizes</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>Standard: 16&quot; × 24&quot; (2.67 sq ft)</p>
                      <p style={{ margin: 0 }}>Roll: ~10 sq ft</p>
                      <p style={{ margin: 0 }}>~170 pieces per pallet</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                    <h4 style={{ color: "#16A34A", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📐 Large Areas</h4>
                    <div style={{ fontSize: "0.85rem", color: "#166534", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>1/4 acre: ~24 pallets</p>
                      <p style={{ margin: 0 }}>1/2 acre: ~49 pallets</p>
                      <p style={{ margin: 0 }}>1 acre: ~97 pallets</p>
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
              <div style={{ backgroundColor: "#22C55E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Cost Calculator
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
                    📦 Based on: <strong>{sodCalc.totalSqFt.toLocaleString()} sq ft</strong> = <strong>{sodCalc.palletsNeeded} pallets</strong>
                  </p>
                </div>

                {/* Price Per Sq Ft */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🌱 Sod Price: ${pricePerSqFt.toFixed(2)}/sq ft
                  </label>
                  <input
                    type="range"
                    min={0.25}
                    max={1.00}
                    step={0.05}
                    value={pricePerSqFt}
                    onChange={(e) => setPricePerSqFt(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$0.25 (budget)</span>
                    <span>$1.00 (premium)</span>
                  </div>
                </div>

                {/* Delivery Cost */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🚛 Delivery Cost: ${deliveryCost}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={25}
                    value={deliveryCost}
                    onChange={(e) => setDeliveryCost(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$0 (pickup)</span>
                    <span>$250</span>
                  </div>
                </div>

                {/* Include Installation */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeInstall}
                      onChange={(e) => setIncludeInstall(e.target.checked)}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                      Include Professional Installation
                    </span>
                  </label>
                </div>

                {/* Installation Cost (if checked) */}
                {includeInstall && (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      👷 Install Cost: ${installCostPerSqFt.toFixed(2)}/sq ft
                    </label>
                    <input
                      type="range"
                      min={0.50}
                      max={2.00}
                      step={0.10}
                      value={installCostPerSqFt}
                      onChange={(e) => setInstallCostPerSqFt(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>$0.50 (basic)</span>
                      <span>$2.00 (full prep)</span>
                    </div>
                  </div>
                )}

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
                    <p style={{ margin: 0 }}>• Budget sod: $0.25-0.40/sq ft</p>
                    <p style={{ margin: 0 }}>• Standard sod: $0.40-0.60/sq ft</p>
                    <p style={{ margin: 0 }}>• Premium sod: $0.60-1.00/sq ft</p>
                    <p style={{ margin: 0 }}>• Installation: $0.50-2.00/sq ft</p>
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
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💵 Cost Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>
                    {includeInstall ? 'Total with Installation' : 'Total (DIY)'}
                  </div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#22C55E" }}>
                    ${costCalc.totalCost.toLocaleString()}
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
                  <div style={{ display: "grid", gap: "12px", fontSize: "0.9rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>Sod ({costCalc.sqft.toLocaleString()} sq ft):</span>
                      <span style={{ fontWeight: "600" }}>${costCalc.materialCost.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#374151" }}>Delivery:</span>
                      <span style={{ fontWeight: "600" }}>${costCalc.deliveryCost}</span>
                    </div>
                    {includeInstall && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#374151" }}>Installation:</span>
                        <span style={{ fontWeight: "600" }}>${costCalc.installCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div style={{ borderTop: "2px solid #BBF7D0", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
                      <span><strong>Total:</strong></span>
                      <span style={{ fontWeight: "700", color: "#22C55E", fontSize: "1.1rem" }}>${costCalc.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Per Pallet Cost */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BFDBFE",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#1D4ED8", margin: 0 }}>
                    📦 <strong>Cost per Pallet:</strong> ~${costCalc.costPerPallet.toFixed(0)} (sod only)
                  </p>
                </div>

                {/* DIY vs Pro Comparison */}
                {!includeInstall && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                      💡 Professional Installation Would Add
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#B45309", margin: 0 }}>
                      ${(costCalc.sqft * 0.75).toLocaleString()} - ${(costCalc.sqft * 1.50).toLocaleString()} more
                    </p>
                  </div>
                )}
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
                🌱 Understanding Sod Pallet Sizes
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When ordering sod for your lawn, understanding <strong>pallet coverage</strong> is essential for 
                  buying the right amount. Sod pallet sizes vary by supplier, grass type, and region, so 
                  always confirm with your supplier before ordering.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Standard Pallet Sizes</h3>
                <div style={{
                  backgroundColor: "#F0FDF4",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BBF7D0"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>400 sq ft</strong> — Smaller pallets, common for specialty grasses</li>
                    <li><strong>450 sq ft</strong> — Most common standard size (50 sq yards)</li>
                    <li><strong>500 sq ft</strong> — Large pallets, often for cool-season grass</li>
                    <li><strong>504 sq ft</strong> — Premium suppliers (56 sq yards)</li>
                    <li><strong>Half pallet</strong> — ~225 sq ft for smaller projects</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Sod Installation Tips</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>✅ Best Practices</h4>
                    <ul style={{ fontSize: "0.9rem", margin: 0, color: "#047857", paddingLeft: "16px", lineHeight: "1.8" }}>
                      <li>Install sod within 24-48 hours of delivery</li>
                      <li>Water immediately after installation</li>
                      <li>Stagger seams like brickwork</li>
                      <li>Roll sod to ensure soil contact</li>
                    </ul>
                  </div>
                  <div style={{ backgroundColor: "#FEF2F2", padding: "16px", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <h4 style={{ color: "#991B1B", margin: "0 0 8px 0" }}>⚠️ Common Mistakes</h4>
                    <ul style={{ fontSize: "0.9rem", margin: 0, color: "#B91C1C", paddingLeft: "16px", lineHeight: "1.8" }}>
                      <li>Letting sod sit on pallet too long (heats up)</li>
                      <li>Not preparing soil properly</li>
                      <li>Overlapping or leaving gaps at seams</li>
                      <li>Under-watering in first 2 weeks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#22C55E", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🌱 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}><strong>1 pallet = 400-500 sq ft</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>Most common: <strong>450 sq ft</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>Weight: <strong>1,500-3,000 lbs</strong></p>
                <p style={{ margin: "0" }}>~170 pieces per pallet</p>
              </div>
            </div>

            {/* Timing Tip */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>🗓️ Best Time to Install</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Warm-season grass:</strong> Late spring to early summer</p>
                <p style={{ margin: "0" }}><strong>Cool-season grass:</strong> Early fall or early spring</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/sod-calculator" currentCategory="Home" />
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
            🌱 <strong>Disclaimer:</strong> Pallet sizes and prices vary by supplier, grass type, and region. 
            Always confirm exact square footage and pricing with your sod supplier before ordering. 
            Calculations include waste factor but actual needs may vary based on lawn shape.
          </p>
        </div>
      </div>
    </div>
  );
}