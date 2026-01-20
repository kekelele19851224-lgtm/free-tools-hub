"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// AC size reference data
const acSizeData = [
  { tons: 1, btu: 12000, kw: 3.52, sqftMin: 400, sqftMax: 600, use: 'Small room, office' },
  { tons: 1.5, btu: 18000, kw: 5.28, sqftMin: 600, sqftMax: 900, use: 'Bedroom, small living room' },
  { tons: 2, btu: 24000, kw: 7.03, sqftMin: 900, sqftMax: 1200, use: 'Living room, master bedroom' },
  { tons: 2.5, btu: 30000, kw: 8.79, sqftMin: 1200, sqftMax: 1500, use: 'Large room, small apartment' },
  { tons: 3, btu: 36000, kw: 10.55, sqftMin: 1500, sqftMax: 1800, use: 'Small home, large apartment' },
  { tons: 3.5, btu: 42000, kw: 12.31, sqftMin: 1800, sqftMax: 2100, use: 'Medium home' },
  { tons: 4, btu: 48000, kw: 14.07, sqftMin: 2100, sqftMax: 2400, use: 'Medium-large home' },
  { tons: 5, btu: 60000, kw: 17.58, sqftMin: 2400, sqftMax: 3000, use: 'Large home' },
];

// Climate factors
const climateFactors = [
  { id: 'hot', label: 'Hot Climate', factor: 1.2, description: 'Arizona, Florida, Texas' },
  { id: 'moderate', label: 'Moderate Climate', factor: 1.0, description: 'Most US regions' },
  { id: 'cool', label: 'Cool Climate', factor: 0.85, description: 'Northern states, Pacific NW' },
];

// Insulation factors
const insulationFactors = [
  { id: 'poor', label: 'Poor Insulation', factor: 1.15, description: 'Old home, single-pane windows' },
  { id: 'average', label: 'Average Insulation', factor: 1.0, description: 'Standard construction' },
  { id: 'good', label: 'Good Insulation', factor: 0.9, description: 'New home, energy efficient' },
];

// FAQ data
const faqs = [
  {
    question: "How many BTU is a 3 ton AC unit?",
    answer: "A 3 ton AC unit has 36,000 BTU/hr of cooling capacity. This is calculated by multiplying 3 tons × 12,000 BTU/ton = 36,000 BTU/hr. A 3-ton unit is typically suitable for homes between 1,500-1,800 square feet, depending on climate and insulation."
  },
  {
    question: "How many BTU do I need for 800 sq ft?",
    answer: "For 800 square feet, you typically need 16,000-20,000 BTU/hr, which equals approximately 1.5 tons of cooling capacity. In hot climates or poorly insulated spaces, lean toward 20,000 BTU. In moderate climates with good insulation, 16,000 BTU may suffice."
  },
  {
    question: "How many BTU is a 2.5 ton AC unit?",
    answer: "A 2.5 ton AC unit provides 30,000 BTU/hr of cooling capacity (2.5 × 12,000 = 30,000). This size is ideal for spaces between 1,200-1,500 square feet and is one of the most common residential AC sizes."
  },
  {
    question: "How many BTU is a 1.5 ton unit?",
    answer: "A 1.5 ton unit provides 18,000 BTU/hr of cooling capacity. This is calculated as 1.5 × 12,000 = 18,000 BTU/hr. A 1.5-ton AC is suitable for rooms or spaces between 600-900 square feet, making it ideal for bedrooms or small living areas."
  },
  {
    question: "How do I convert BTU to tons?",
    answer: "To convert BTU to tons of refrigeration, divide the BTU/hr value by 12,000. For example: 24,000 BTU ÷ 12,000 = 2 tons. Conversely, to convert tons to BTU, multiply tons by 12,000. For example: 2.5 tons × 12,000 = 30,000 BTU/hr."
  },
  {
    question: "What size AC do I need for 1500 sq ft?",
    answer: "For 1,500 square feet, you typically need a 2.5-3 ton AC unit (30,000-36,000 BTU/hr). In hot climates like Arizona or Florida, choose 3 tons. In moderate or cool climates with good insulation, 2.5 tons may be sufficient. Always consider factors like ceiling height, window count, and sun exposure."
  }
];

// Constants
const BTU_PER_TON = 12000;
const KW_PER_BTU = 0.000293071;

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

export default function BtuToTonCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'converter' | 'reference' | 'roomsize'>('converter');

  // Converter tab states
  const [conversionDirection, setConversionDirection] = useState<'btuToTon' | 'tonToBtu'>('btuToTon');
  const [btuValue, setBtuValue] = useState(24000);
  const [tonValue, setTonValue] = useState(2);

  // Room size calculator states
  const [roomSqft, setRoomSqft] = useState(1500);
  const [climate, setClimate] = useState('moderate');
  const [insulation, setInsulation] = useState('average');

  // Convert BTU to Ton
  const btuToTon = (btu: number) => {
    const tons = btu / BTU_PER_TON;
    const kw = btu * KW_PER_BTU;
    return { tons, kw, btu };
  };

  // Convert Ton to BTU
  const tonToBtu = (tons: number) => {
    const btu = tons * BTU_PER_TON;
    const kw = btu * KW_PER_BTU;
    return { tons, kw, btu };
  };

  // Get conversion result
  const getConversionResult = () => {
    if (conversionDirection === 'btuToTon') {
      return btuToTon(btuValue);
    } else {
      return tonToBtu(tonValue);
    }
  };

  // Calculate room size recommendation
  const calculateRoomSize = () => {
    const climateFactor = climateFactors.find(c => c.id === climate)?.factor || 1;
    const insulationFactor = insulationFactors.find(i => i.id === insulation)?.factor || 1;
    
    // Base: 20 BTU per sq ft, adjusted by factors
    const baseBtu = roomSqft * 20 * climateFactor * insulationFactor;
    const tons = baseBtu / BTU_PER_TON;
    
    // Find recommended AC size
    const recommendedTons = Math.ceil(tons * 2) / 2; // Round to nearest 0.5
    const minTons = Math.max(1, recommendedTons - 0.5);
    const maxTons = recommendedTons + 0.5;
    
    return {
      baseBtu: Math.round(baseBtu),
      tons: tons,
      recommendedTons,
      recommendedBtu: recommendedTons * BTU_PER_TON,
      minTons,
      maxTons,
      minBtu: minTons * BTU_PER_TON,
      maxBtu: maxTons * BTU_PER_TON
    };
  };

  const conversionResult = getConversionResult();
  const roomSizeResult = calculateRoomSize();

  // Find suitable room size for converted value
  const getSuitableRoomSize = (tons: number) => {
    const match = acSizeData.find(ac => ac.tons === tons);
    if (match) return `${match.sqftMin.toLocaleString()}-${match.sqftMax.toLocaleString()} sq ft`;
    
    // Estimate for non-standard sizes
    const sqftMin = Math.round(tons * 450);
    const sqftMax = Math.round(tons * 600);
    return `~${sqftMin.toLocaleString()}-${sqftMax.toLocaleString()} sq ft`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F9FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BAE6FD" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>BTU to Ton Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>❄️</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many BTU in a Ton?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Convert BTU to tons of refrigeration for air conditioning. 1 ton = 12,000 BTU/hr. 
            Find the right AC size for your room or home.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#0EA5E9",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: BTU to Ton Conversion</strong>
              </p>
              <div style={{ color: "#E0F2FE", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>1 Ton = 12,000 BTU/hr</strong> (cooling capacity)</p>
                <p style={{ margin: "0" }}>• <strong>1.5 Ton = 18,000 BTU</strong> | <strong>2 Ton = 24,000 BTU</strong> | <strong>3 Ton = 36,000 BTU</strong></p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>Formula: Tons = BTU ÷ 12,000 | BTU = Tons × 12,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('converter')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'converter' ? "#0EA5E9" : "white",
              color: activeTab === 'converter' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            🔄 BTU ↔ Ton Converter
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'reference' ? "#0EA5E9" : "white",
              color: activeTab === 'reference' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📋 AC Size Reference
          </button>
          <button
            onClick={() => setActiveTab('roomsize')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'roomsize' ? "#0EA5E9" : "white",
              color: activeTab === 'roomsize' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            🏠 Room Size Calculator
          </button>
        </div>

        {/* Converter Tab */}
        {activeTab === 'converter' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BAE6FD",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0EA5E9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔄 BTU ↔ Ton Converter
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Conversion Direction */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📐 Conversion Direction
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      onClick={() => setConversionDirection('btuToTon')}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: conversionDirection === 'btuToTon' ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                        backgroundColor: conversionDirection === 'btuToTon' ? "#F0F9FF" : "white",
                        cursor: "pointer",
                        fontWeight: conversionDirection === 'btuToTon' ? "600" : "500",
                        color: conversionDirection === 'btuToTon' ? "#0284C7" : "#374151"
                      }}
                    >
                      BTU → Ton
                    </button>
                    <button
                      onClick={() => setConversionDirection('tonToBtu')}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: conversionDirection === 'tonToBtu' ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                        backgroundColor: conversionDirection === 'tonToBtu' ? "#F0F9FF" : "white",
                        cursor: "pointer",
                        fontWeight: conversionDirection === 'tonToBtu' ? "600" : "500",
                        color: conversionDirection === 'tonToBtu' ? "#0284C7" : "#374151"
                      }}
                    >
                      Ton → BTU
                    </button>
                  </div>
                </div>

                {/* Input Value */}
                {conversionDirection === 'btuToTon' ? (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      🌡️ BTU/hr: {btuValue.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min={6000}
                      max={72000}
                      step={1000}
                      value={btuValue}
                      onChange={(e) => setBtuValue(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>6,000 BTU</span>
                      <span>72,000 BTU</span>
                    </div>
                    
                    {/* Quick Select Buttons */}
                    <div style={{ marginTop: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "8px" }}>
                        Quick Select:
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[12000, 18000, 24000, 30000, 36000, 48000, 60000].map(val => (
                          <button
                            key={val}
                            onClick={() => setBtuValue(val)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: btuValue === val ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                              backgroundColor: btuValue === val ? "#F0F9FF" : "white",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              color: btuValue === val ? "#0284C7" : "#374151"
                            }}
                          >
                            {(val / 1000)}K
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      ❄️ Tons: {tonValue}
                    </label>
                    <input
                      type="range"
                      min={0.5}
                      max={6}
                      step={0.5}
                      value={tonValue}
                      onChange={(e) => setTonValue(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>0.5 Ton</span>
                      <span>6 Tons</span>
                    </div>
                    
                    {/* Quick Select Buttons */}
                    <div style={{ marginTop: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "8px" }}>
                        Quick Select:
                      </label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[1, 1.5, 2, 2.5, 3, 4, 5].map(val => (
                          <button
                            key={val}
                            onClick={() => setTonValue(val)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: tonValue === val ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                              backgroundColor: tonValue === val ? "#F0F9FF" : "white",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              color: tonValue === val ? "#0284C7" : "#374151"
                            }}
                          >
                            {val} Ton
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Formula Box */}
                <div style={{
                  backgroundColor: "#F0F9FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BAE6FD"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0284C7", margin: "0 0 8px 0" }}>
                    📝 Formula Used
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#0369A1", margin: 0, fontFamily: "monospace" }}>
                    {conversionDirection === 'btuToTon' 
                      ? `Tons = ${btuValue.toLocaleString()} BTU ÷ 12,000 = ${(btuValue / 12000).toFixed(2)} Tons`
                      : `BTU = ${tonValue} Tons × 12,000 = ${(tonValue * 12000).toLocaleString()} BTU`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BAE6FD",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Conversion Result
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>
                    {conversionDirection === 'btuToTon' ? `${btuValue.toLocaleString()} BTU/hr =` : `${tonValue} Ton =`}
                  </div>
                  <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#0EA5E9" }}>
                    {conversionDirection === 'btuToTon' 
                      ? `${conversionResult.tons.toFixed(2)} Tons`
                      : `${conversionResult.btu.toLocaleString()} BTU`
                    }
                  </div>
                </div>

                {/* Additional Conversions */}
                <div style={{ 
                  backgroundColor: "#F0F9FF", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #BAE6FD"
                }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#0284C7", margin: "0 0 16px 0" }}>
                    Also Equals:
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>BTU/hr:</span>
                      <span style={{ fontWeight: "600" }}>{conversionResult.btu.toLocaleString()} BTU/hr</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Tons (Refrigeration):</span>
                      <span style={{ fontWeight: "600" }}>{conversionResult.tons.toFixed(2)} TR</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Kilowatts (kW):</span>
                      <span style={{ fontWeight: "600" }}>{conversionResult.kw.toFixed(2)} kW</span>
                    </div>
                    <div style={{ borderTop: "1px solid #BAE6FD", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Suitable for:</span>
                      <span style={{ fontWeight: "600", color: "#0EA5E9" }}>{getSuitableRoomSize(conversionResult.tons)}</span>
                    </div>
                  </div>
                </div>

                {/* Common Conversions */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    ❄️ Common AC Sizes
                  </p>
                  <div style={{ fontSize: "0.8rem", color: "#047857", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• 1.5 Ton = 18,000 BTU (bedroom)</p>
                    <p style={{ margin: 0 }}>• 2 Ton = 24,000 BTU (living room)</p>
                    <p style={{ margin: 0 }}>• 3 Ton = 36,000 BTU (small home)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AC Size Reference Tab */}
        {activeTab === 'reference' && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BAE6FD",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0EA5E9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 AC Size Reference Chart
                </h2>
              </div>

              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F0F9FF" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #BAE6FD" }}>AC Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BAE6FD" }}>BTU/hr</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BAE6FD" }}>kW</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BAE6FD" }}>Room Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #BAE6FD" }}>Typical Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acSizeData.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "600", color: "#0EA5E9" }}>{row.tons} Ton</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.btu.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.kw}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.sqftMin}-{row.sqftMax} sq ft</td>
                        <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#6B7280" }}>{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>
                  * Room sizes are estimates for moderate climates with average insulation. Hot climates may require larger units.
                </p>

                {/* Key Conversions */}
                <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ color: "#0284C7", margin: "0 0 8px 0", fontSize: "0.9rem" }}>🔢 Key Conversion</h4>
                    <div style={{ fontSize: "0.85rem", color: "#0369A1", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>1 Ton = 12,000 BTU/hr</p>
                      <p style={{ margin: 0 }}>1 Ton = 3.517 kW</p>
                      <p style={{ margin: 0 }}>1 BTU = 0.000293 kWh</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ color: "#0284C7", margin: "0 0 8px 0", fontSize: "0.9rem" }}>📐 Sizing Rule</h4>
                    <div style={{ fontSize: "0.85rem", color: "#0369A1", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>~20 BTU per sq ft</p>
                      <p style={{ margin: 0 }}>~1 Ton per 500 sq ft</p>
                      <p style={{ margin: 0 }}>Add 10-20% for hot climates</p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ color: "#0284C7", margin: "0 0 8px 0", fontSize: "0.9rem" }}>⚡ Why 12,000?</h4>
                    <div style={{ fontSize: "0.85rem", color: "#0369A1", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>Melting 1 ton of ice</p>
                      <p style={{ margin: 0 }}>in 24 hours requires</p>
                      <p style={{ margin: 0 }}>~12,000 BTU/hr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Room Size Calculator Tab */}
        {activeTab === 'roomsize' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BAE6FD",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0EA5E9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🏠 Room Size Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Room Size */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📐 Room/Home Size: {roomSqft.toLocaleString()} sq ft
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={5000}
                    step={100}
                    value={roomSqft}
                    onChange={(e) => setRoomSqft(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>200 sq ft</span>
                    <span>5,000 sq ft</span>
                  </div>
                </div>

                {/* Climate */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🌡️ Climate Zone
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {climateFactors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setClimate(c.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: climate === c.id ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: climate === c.id ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ 
                              fontWeight: climate === c.id ? "600" : "500",
                              color: climate === c.id ? "#0284C7" : "#374151",
                              fontSize: "0.9rem"
                            }}>
                              {c.label}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                              {c.description}
                            </div>
                          </div>
                          <div style={{ 
                            backgroundColor: climate === c.id ? "#0EA5E9" : "#F3F4F6",
                            color: climate === c.id ? "white" : "#374151",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}>
                            {c.factor > 1 ? `+${((c.factor - 1) * 100).toFixed(0)}%` : c.factor < 1 ? `-${((1 - c.factor) * 100).toFixed(0)}%` : 'Base'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Insulation */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🏗️ Insulation Quality
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {insulationFactors.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => setInsulation(i.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: insulation === i.id ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: insulation === i.id ? "#F0F9FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ 
                              fontWeight: insulation === i.id ? "600" : "500",
                              color: insulation === i.id ? "#0284C7" : "#374151",
                              fontSize: "0.9rem"
                            }}>
                              {i.label}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                              {i.description}
                            </div>
                          </div>
                          <div style={{ 
                            backgroundColor: insulation === i.id ? "#0EA5E9" : "#F3F4F6",
                            color: insulation === i.id ? "white" : "#374151",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}>
                            {i.factor > 1 ? `+${((i.factor - 1) * 100).toFixed(0)}%` : i.factor < 1 ? `-${((1 - i.factor) * 100).toFixed(0)}%` : 'Base'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BAE6FD",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ❄️ Recommended AC Size
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Recommended Size</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#0EA5E9" }}>
                    {roomSizeResult.recommendedTons} Ton
                  </div>
                  <div style={{ fontSize: "1.1rem", color: "#6B7280" }}>
                    ({roomSizeResult.recommendedBtu.toLocaleString()} BTU/hr)
                  </div>
                </div>

                {/* Range */}
                <div style={{ 
                  backgroundColor: "#F0F9FF", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #BAE6FD"
                }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#0284C7", margin: "0 0 16px 0" }}>
                    📊 Sizing Details
                  </h3>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Room Size:</span>
                      <span style={{ fontWeight: "600" }}>{roomSqft.toLocaleString()} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Calculated BTU:</span>
                      <span style={{ fontWeight: "600" }}>{roomSizeResult.baseBtu.toLocaleString()} BTU/hr</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Calculated Tons:</span>
                      <span style={{ fontWeight: "600" }}>{roomSizeResult.tons.toFixed(2)} Tons</span>
                    </div>
                    <div style={{ borderTop: "1px solid #BAE6FD", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>Recommended Range:</strong></span>
                      <span style={{ fontWeight: "700", color: "#0EA5E9" }}>{roomSizeResult.minTons}-{roomSizeResult.maxTons} Tons</span>
                    </div>
                  </div>
                </div>

                {/* BTU Range */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.9rem", color: "#065F46", margin: 0 }}>
                    <strong>BTU Range:</strong> {roomSizeResult.minBtu.toLocaleString()} - {roomSizeResult.maxBtu.toLocaleString()} BTU/hr
                  </p>
                </div>

                {/* Tips */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    💡 Sizing Tips
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Choose higher end for lots of windows/sun</li>
                    <li>Choose lower end for well-shaded homes</li>
                    <li>Don&apos;t oversize - causes humidity issues</li>
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BAE6FD", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ❄️ Understanding BTU and Tons in Air Conditioning
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When shopping for an air conditioner, you&apos;ll encounter two key measurements: <strong>BTU</strong> (British Thermal Units) 
                  and <strong>Tons</strong>. Understanding the relationship between these units helps you choose the right AC size for your space.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What is a BTU?</h3>
                <p>
                  A BTU is a unit of energy that measures heat. In air conditioning, BTU/hr indicates how much heat an AC unit 
                  can remove from a room per hour. The higher the BTU rating, the more cooling power the unit has.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What is a Ton of Refrigeration?</h3>
                <div style={{
                  backgroundColor: "#F0F9FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BAE6FD"
                }}>
                  <p style={{ margin: 0 }}>
                    <strong>1 Ton = 12,000 BTU/hr</strong>
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem" }}>
                    This comes from the historical fact that melting 1 ton (2,000 lbs) of ice in 24 hours requires 
                    approximately 12,000 BTU per hour of heat absorption.
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common AC Sizes</h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>Window & Portable Units</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#047857" }}>
                      5,000-14,000 BTU (0.4-1.2 tons). Best for single rooms. 
                      A 10,000 BTU unit can cool a 400-450 sq ft room.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ color: "#0284C7", margin: "0 0 8px 0" }}>Mini-Split Systems</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#0369A1" }}>
                      9,000-36,000 BTU (0.75-3 tons). Efficient for zones or small homes. 
                      Multi-zone systems can handle larger spaces.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <h4 style={{ color: "#B45309", margin: "0 0 8px 0" }}>Central AC Systems</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#92400E" }}>
                      24,000-60,000 BTU (2-5 tons). For whole-home cooling. 
                      Most homes need 2.5-4 tons depending on size and climate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#0EA5E9", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>❄️ Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}><strong>1 Ton = 12,000 BTU/hr</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>Average home needs <strong>2.5-3 tons</strong></p>
                <p style={{ margin: "0" }}>Rule of thumb: <strong>20 BTU per sq ft</strong></p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Oversizing Warning</h3>
              <p style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.7", margin: 0 }}>
                Bigger isn&apos;t always better! An oversized AC will short-cycle, causing 
                humidity problems, higher bills, and faster wear. Always size correctly.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/btu-to-ton-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BAE6FD", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F0F9FF", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
          <p style={{ fontSize: "0.75rem", color: "#0369A1", textAlign: "center", margin: 0 }}>
            ❄️ <strong>Disclaimer:</strong> These calculations are estimates based on general guidelines. 
            Actual AC sizing depends on many factors including ceiling height, window size, sun exposure, and local climate. 
            Consult an HVAC professional for a proper load calculation (Manual J) before purchasing.
          </p>
        </div>
      </div>
    </div>
  );
}