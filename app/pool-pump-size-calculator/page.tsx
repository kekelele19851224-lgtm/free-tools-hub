"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Pool shapes
type PoolShape = "rectangular" | "round" | "oval";
type PoolType = "inground" | "aboveground";

// Quick reference data
const QUICK_REFERENCE = [
  { gallons: 10000, gpm8: 21, hp: "0.5 - 0.75 HP" },
  { gallons: 15000, gpm8: 31, hp: "0.75 - 1 HP" },
  { gallons: 20000, gpm8: 42, hp: "1 HP" },
  { gallons: 25000, gpm8: 52, hp: "1 - 1.5 HP" },
  { gallons: 30000, gpm8: 63, hp: "1.5 HP" },
  { gallons: 35000, gpm8: 73, hp: "1.5 - 2 HP" },
  { gallons: 40000, gpm8: 83, hp: "2 HP" },
  { gallons: 50000, gpm8: 104, hp: "2.5 - 3 HP" },
];

// HP recommendation based on GPM and TDH
const getRecommendedHP = (gpm: number, tdh: number): string => {
  // Simplified HP recommendation based on GPM (assuming typical TDH)
  if (gpm <= 25) return "0.5 HP";
  if (gpm <= 35) return "0.75 HP";
  if (gpm <= 50) return "1 HP";
  if (gpm <= 65) return "1.5 HP";
  if (gpm <= 80) return "2 HP";
  if (gpm <= 95) return "2.5 HP";
  return "3 HP";
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate what size pool pump I need?",
    answer: "To calculate pool pump size: 1) Calculate your pool's volume in gallons (Length × Width × Avg Depth × 7.5 for rectangular pools), 2) Divide by desired turnover time (8 hours is standard) to get GPH, 3) Divide GPH by 60 to get required GPM, 4) Match GPM to pump horsepower using manufacturer charts. For example, a 24,000-gallon pool needs 50 GPM (24,000 ÷ 8 ÷ 60), which typically requires a 1 HP pump."
  },
  {
    question: "What size pump do I need for a 35,000 gallon pool?",
    answer: "For a 35,000-gallon pool with an 8-hour turnover, you need approximately 73 GPM (35,000 ÷ 8 ÷ 60 = 72.9). This typically requires a 1.5 to 2 HP pump for an inground pool (50-60 TDH) or a 1.5 HP pump for an above-ground pool (30 TDH). If you have additional features like a spa, waterfall, or pool cleaner, consider going with a 2 HP pump."
  },
  {
    question: "Do I need 1 or 1.5 HP pool pump?",
    answer: "Choose based on your pool size and features: A 1 HP pump is suitable for pools up to 25,000 gallons with standard plumbing. A 1.5 HP pump is better for pools 25,000-35,000 gallons or if you have additional water features, a spa, or longer pipe runs. If your pool is between sizes, the 1.5 HP offers more flexibility. Variable-speed pumps can adjust to your needs and save up to 80% on energy costs."
  },
  {
    question: "What size pump do I need for a 24 foot round pool?",
    answer: "A 24-foot round above-ground pool holds approximately 13,500 gallons (assuming 4 ft average depth). For an 8-hour turnover, you need about 28 GPM. A 1 HP pump is typically sufficient for this size. For above-ground pools up to 24 feet, 1 HP is standard; pools larger than 24 feet usually need 1.5 HP."
  },
  {
    question: "What is turnover rate and why does it matter?",
    answer: "Turnover rate is the time needed to circulate all pool water through the filter once. The standard is 8 hours for residential pools, meaning all water passes through the filter 3 times in 24 hours. Faster turnover (6 hours) improves filtration but uses more energy. Slower turnover (10+ hours) may not adequately filter the water, leading to algae and water quality issues."
  },
  {
    question: "What is Total Dynamic Head (TDH)?",
    answer: "Total Dynamic Head (TDH) measures the total resistance to water flow in your pool system, expressed in feet. It includes vertical lift, pipe friction, filter resistance, and other equipment. Inground pools typically have 50-60 TDH, while above-ground pools average 30 TDH. Higher TDH requires more powerful pumps to maintain adequate flow."
  },
  {
    question: "Can I use a pump that's too powerful for my pool?",
    answer: "Yes, but it's not recommended. An oversized pump can damage your filter, increase energy costs, and cause cavitation (air bubbles that damage the pump). It may also exceed the flow rate limits of your plumbing (42 GPM for 1.5\" pipes, 73 GPM for 2\" pipes). Always match your pump to your pool size and plumbing system for optimal efficiency."
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

export default function PoolPumpSizeCalculator() {
  // Pool dimensions
  const [poolShape, setPoolShape] = useState<PoolShape>("rectangular");
  const [poolType, setPoolType] = useState<PoolType>("inground");
  const [length, setLength] = useState<string>("30");
  const [width, setWidth] = useState<string>("15");
  const [diameter, setDiameter] = useState<string>("24");
  const [shallowDepth, setShallowDepth] = useState<string>("3");
  const [deepDepth, setDeepDepth] = useState<string>("8");
  
  // Pump settings
  const [turnoverHours, setTurnoverHours] = useState<number>(8);
  const [pipeSize, setPipeSize] = useState<string>("1.5");

  // Calculate results
  const results = useMemo(() => {
    const avgDepth = ((parseFloat(shallowDepth) || 0) + (parseFloat(deepDepth) || 0)) / 2;
    
    let poolGallons = 0;
    
    if (poolShape === "rectangular") {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      poolGallons = l * w * avgDepth * 7.5;
    } else if (poolShape === "round") {
      const d = parseFloat(diameter) || 0;
      const radius = d / 2;
      poolGallons = 3.14159 * radius * radius * avgDepth * 7.5;
    } else if (poolShape === "oval") {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      poolGallons = l * w * avgDepth * 5.9;
    }

    // Flow rate calculations
    const gph = poolGallons / turnoverHours;
    const gpm = gph / 60;

    // TDH based on pool type
    const tdh = poolType === "inground" ? 50 : 30;

    // Max GPM based on pipe size
    const maxGPM = pipeSize === "1.5" ? 42 : 73;

    // Check if pump exceeds pipe capacity
    const exceedsPipeCapacity = gpm > maxGPM;

    // Recommended HP
    const recommendedHP = getRecommendedHP(gpm, tdh);

    return {
      poolGallons: Math.round(poolGallons),
      avgDepth: avgDepth.toFixed(1),
      gph: Math.round(gph),
      gpm: gpm.toFixed(1),
      tdh,
      maxGPM,
      exceedsPipeCapacity,
      recommendedHP
    };
  }, [poolShape, length, width, diameter, shallowDepth, deepDepth, turnoverHours, poolType, pipeSize]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pool Pump Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏊</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Pool Pump Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the right pool pump size for your swimming pool. Enter your pool dimensions to find the recommended pump horsepower (HP) based on required flow rate (GPM).
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFEFF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A5F3FC"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#0E7490", margin: "0 0 4px 0" }}>Quick Formula</p>
              <p style={{ color: "#0E7490", margin: 0, fontSize: "0.95rem" }}>
                <strong>GPM</strong> = Pool Gallons ÷ Turnover Hours ÷ 60 • Standard turnover: <strong>8 hours</strong>
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
          <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🧮 Calculate Your Pool Pump Size</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Pool Shape */}
                <div style={{ backgroundColor: "#ECFEFF", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📐 Pool Shape & Type
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Pool Shape
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { value: "rectangular", label: "▭ Rectangular" },
                        { value: "round", label: "○ Round" },
                        { value: "oval", label: "⬭ Oval" }
                      ].map((shape) => (
                        <button
                          key={shape.value}
                          onClick={() => setPoolShape(shape.value as PoolShape)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: poolShape === shape.value ? "2px solid #0891B2" : "1px solid #D1D5DB",
                            backgroundColor: poolShape === shape.value ? "#ECFEFF" : "white",
                            color: poolShape === shape.value ? "#0891B2" : "#374151",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.9rem"
                          }}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Pool Type
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { value: "inground", label: "In-ground (50 TDH)" },
                        { value: "aboveground", label: "Above-ground (30 TDH)" }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setPoolType(type.value as PoolType)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: poolType === type.value ? "2px solid #0891B2" : "1px solid #D1D5DB",
                            backgroundColor: poolType === type.value ? "#ECFEFF" : "white",
                            color: poolType === type.value ? "#0891B2" : "#374151",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.85rem"
                          }}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pool Dimensions */}
                <div style={{ backgroundColor: "#F0FDFA", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📏 Pool Dimensions (feet)
                  </h3>
                  
                  {poolShape === "round" ? (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Diameter
                      </label>
                      <input
                        type="number"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                        placeholder="24"
                      />
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                          Length
                        </label>
                        <input
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                          Width
                        </label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                          placeholder="15"
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Shallow End Depth
                      </label>
                      <input
                        type="number"
                        value={shallowDepth}
                        onChange={(e) => setShallowDepth(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                        step="0.5"
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Deep End Depth
                      </label>
                      <input
                        type="number"
                        value={deepDepth}
                        onChange={(e) => setDeepDepth(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                        step="0.5"
                        placeholder="8"
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "8px", marginBottom: 0 }}>
                    Average depth: {results.avgDepth} ft
                  </p>
                </div>

                {/* Pump Settings */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    ⚙️ Pump Settings
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Turnover Time
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[6, 8, 10].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setTurnoverHours(hours)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: turnoverHours === hours ? "2px solid #D97706" : "1px solid #D1D5DB",
                            backgroundColor: turnoverHours === hours ? "#FEF3C7" : "white",
                            color: turnoverHours === hours ? "#D97706" : "#374151",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.9rem"
                          }}
                        >
                          {hours} hours
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#92400E", marginTop: "8px", marginBottom: 0 }}>
                      8 hours is standard for residential pools
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Plumbing Size
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { value: "1.5", label: "1.5\" (max 42 GPM)" },
                        { value: "2", label: "2\" (max 73 GPM)" }
                      ].map((pipe) => (
                        <button
                          key={pipe.value}
                          onClick={() => setPipeSize(pipe.value)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: pipeSize === pipe.value ? "2px solid #D97706" : "1px solid #D1D5DB",
                            backgroundColor: pipeSize === pipe.value ? "#FEF3C7" : "white",
                            color: pipeSize === pipe.value ? "#D97706" : "#374151",
                            cursor: "pointer",
                            fontWeight: "500",
                            fontSize: "0.85rem"
                          }}
                        >
                          {pipe.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ backgroundColor: "#0891B2", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Recommended Pump Size</p>
                  <p style={{ fontSize: "2.75rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {results.recommendedHP}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    for {formatNumber(results.poolGallons)} gallon pool
                  </p>
                </div>

                {/* Flow Rate Details */}
                <div style={{ backgroundColor: "#ECFEFF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Flow Rate Calculation</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Pool Volume</span>
                      <span style={{ fontWeight: "600", color: "#0891B2" }}>{formatNumber(results.poolGallons)} gallons</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Turnover Rate</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{turnoverHours} hours</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Gallons Per Hour (GPH)</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatNumber(results.gph)} GPH</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#0891B2", borderRadius: "6px" }}>
                      <span style={{ color: "white", fontWeight: "500" }}>Required Flow (GPM)</span>
                      <span style={{ fontWeight: "700", color: "white" }}>{results.gpm} GPM</span>
                    </div>
                  </div>
                </div>

                {/* System Info */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>⚙️ System Details</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Pool Type</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{poolType === "inground" ? "In-ground" : "Above-ground"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Total Dynamic Head</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{results.tdh} feet</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Plumbing Size</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{pipeSize}" PVC</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#6B7280" }}>Max Pipe Flow</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{results.maxGPM} GPM</span>
                    </div>
                  </div>
                </div>

                {/* Warning if exceeds pipe capacity */}
                {results.exceedsPipeCapacity && (
                  <div style={{ padding: "16px", backgroundColor: "#FEE2E2", borderRadius: "8px", border: "1px solid #FECACA", marginBottom: "20px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#DC2626", margin: 0 }}>
                      ⚠️ <strong>Warning:</strong> Required GPM ({results.gpm}) exceeds your {pipeSize}" pipe capacity ({results.maxGPM} GPM). Consider upgrading to 2" plumbing or increasing turnover time.
                    </p>
                  </div>
                )}

                {/* Pro Tip */}
                <div style={{ padding: "16px", backgroundColor: "#EDE9FE", borderRadius: "8px", border: "1px solid #C4B5FD" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6D28D9", margin: 0 }}>
                    💡 <strong>Pro Tip:</strong> Variable-speed pumps can save 50-80% on energy costs by running at lower speeds during off-peak hours while still meeting turnover requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📋 Pool Pump Size Chart (Quick Reference)</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Based on 8-hour turnover and 50 TDH (in-ground pool)</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFEFF" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Pool Size (Gallons)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Required GPM</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Recommended HP</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_REFERENCE.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{formatNumber(row.gallons)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.gpm8} GPM</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#0891B2" }}>{row.hp}</td>
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
            {/* How to Size */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>How to Size a Pool Pump</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { step: "1", title: "Calculate Pool Volume", desc: "Multiply Length × Width × Avg Depth × 7.5 (for rectangular pools) to get gallons." },
                  { step: "2", title: "Determine Required GPM", desc: "Divide pool gallons by turnover hours (8 is standard), then divide by 60." },
                  { step: "3", title: "Check Plumbing Limits", desc: "Ensure GPM doesn't exceed pipe capacity (42 GPM for 1.5\", 73 GPM for 2\")." },
                  { step: "4", title: "Match to Pump HP", desc: "Use manufacturer charts to find the HP that delivers your required GPM at your TDH." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#0891B2", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "1.1rem", flexShrink: 0 }}>{item.step}</div>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pool Volume Formulas */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>Pool Volume Formulas</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#ECFEFF", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#0891B2", margin: "0 0 8px 0" }}>▭ Rectangular Pool</h4>
                  <p style={{ fontFamily: "monospace", color: "#374151", margin: 0, fontSize: "0.95rem" }}>
                    Length × Width × Avg Depth × <strong>7.5</strong> = Gallons
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F0FDFA", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#0D9488", margin: "0 0 8px 0" }}>○ Round Pool</h4>
                  <p style={{ fontFamily: "monospace", color: "#374151", margin: 0, fontSize: "0.95rem" }}>
                    3.14 × Radius² × Avg Depth × <strong>7.5</strong> = Gallons
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#EDE9FE", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#7C3AED", margin: "0 0 8px 0" }}>⬭ Oval Pool</h4>
                  <p style={{ fontFamily: "monospace", color: "#374151", margin: 0, fontSize: "0.95rem" }}>
                    Length × Width × Avg Depth × <strong>5.9</strong> = Gallons
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* HP Guide */}
            <div style={{ backgroundColor: "#ECFEFF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A5F3FC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0E7490", marginBottom: "12px" }}>⚡ HP Quick Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#0E7490" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A5F3FC" }}>
                  <span>0.5 HP</span><span>Up to 25 GPM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A5F3FC" }}>
                  <span>0.75 HP</span><span>25-35 GPM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A5F3FC" }}>
                  <span>1 HP</span><span>35-50 GPM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A5F3FC" }}>
                  <span>1.5 HP</span><span>50-65 GPM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A5F3FC" }}>
                  <span>2 HP</span><span>65-80 GPM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                  <span>3 HP</span><span>80-100+ GPM</span>
                </div>
              </div>
            </div>

            {/* Pipe Limits */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>🔧 Pipe Flow Limits</h3>
              <div style={{ fontSize: "0.85rem", color: "#92400E" }}>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>1.5" PVC</p>
                  <p style={{ margin: 0 }}>Max: 42 GPM</p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>2" PVC</p>
                  <p style={{ margin: 0 }}>Max: 73 GPM</p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/pool-pump-size-calculator" currentCategory="Home" />
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
            🏊 <strong>Disclaimer:</strong> This calculator provides estimates for general guidance. Actual pump requirements may vary based on specific equipment, plumbing configuration, and additional features (spa, waterfall, etc.). Always consult the pump manufacturer&apos;s specifications and consider professional installation advice.
          </p>
        </div>
      </div>
    </div>
  );
}