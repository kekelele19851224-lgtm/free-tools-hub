"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

type Unit = 'feet' | 'inches' | 'yards' | 'meters';
type ProjectType = 'driveway' | 'walkway' | 'patio' | 'parking' | 'foundation' | 'custom';

// Crusher run density: approximately 2,500 lbs per cubic yard (1.25 tons)
const CRUSHER_RUN_DENSITY = 1.25; // tons per cubic yard

// Price ranges per ton (2025 prices)
const PRICE_PER_TON = { min: 25, max: 50 };
const DELIVERY_FEE = { min: 50, max: 150 };

// Recommended depths by project type (in inches)
const PROJECT_DEPTHS: Record<ProjectType, { depth: number; label: string; desc: string }> = {
  driveway: { depth: 4, label: 'Driveway', desc: '4" for residential driveways' },
  walkway: { depth: 2, label: 'Walkway', desc: '2" for foot traffic only' },
  patio: { depth: 3, label: 'Patio Base', desc: '3" under pavers or stone' },
  parking: { depth: 6, label: 'Parking Area', desc: '6" for heavy vehicles' },
  foundation: { depth: 4, label: 'Shed/Foundation', desc: '4" for building bases' },
  custom: { depth: 4, label: 'Custom', desc: 'Enter your own depth' }
};

// Coverage data for reference table
const COVERAGE_DATA = [
  { depth: '2"', sqFtPerTon: 160, sqFtPerYard: 128 },
  { depth: '3"', sqFtPerTon: 107, sqFtPerYard: 85 },
  { depth: '4"', sqFtPerTon: 80, sqFtPerYard: 64 },
  { depth: '6"', sqFtPerTon: 53, sqFtPerYard: 43 },
  { depth: '8"', sqFtPerTon: 40, sqFtPerYard: 32 },
];

// Tons to cubic yards conversion table
const TONS_CONVERSION = [
  { tons: 1, cubicYards: 0.8 },
  { tons: 5, cubicYards: 4.0 },
  { tons: 10, cubicYards: 8.0 },
  { tons: 15, cubicYards: 12.0 },
  { tons: 20, cubicYards: 16.0 },
  { tons: 25, cubicYards: 20.0 },
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much crusher run do I need?",
    answer: "Multiply length × width × depth (all in feet) to get cubic feet. Divide by 27 to convert to cubic yards. Then multiply by 1.25 to get tons. For example: A 20ft × 10ft driveway at 4\" deep = 200 sq ft × 0.33 ft = 66.7 cu ft ÷ 27 = 2.47 cu yd × 1.25 = 3.09 tons."
  },
  {
    question: "How many sq ft will 1 ton of crusher run cover?",
    answer: "At 2\" depth: ~160 sq ft per ton. At 4\" depth: ~80 sq ft per ton. At 6\" depth: ~53 sq ft per ton. Coverage decreases as depth increases. Always order 10-15% extra to account for compaction and waste."
  },
  {
    question: "How many yards is 20 tons of crusher run?",
    answer: "20 tons of crusher run equals approximately 16 cubic yards. The conversion is based on crusher run weighing about 2,500 lbs (1.25 tons) per cubic yard. To convert tons to cubic yards, divide tons by 1.25."
  },
  {
    question: "How much does 1 ton of crusher run cost?",
    answer: "Crusher run costs $25-50 per ton in 2025, with an average of $35 per ton. Prices vary by location and quantity. Delivery typically adds $50-150 depending on distance. Buying in bulk (10+ tons) often qualifies for discounts."
  },
  {
    question: "What is crusher run?",
    answer: "Crusher run (also called crush and run, ABC stone, or road base) is a blend of crushed stone and stone dust. The angular pieces lock together when compacted, creating a stable base. It typically contains 3/4\" stone mixed with smaller particles down to fine dust."
  },
  {
    question: "How thick should crusher run be for a driveway?",
    answer: "For residential driveways, 4 inches of compacted crusher run is standard. For heavy vehicle traffic or commercial use, 6 inches or more is recommended. Compact in 2-inch lifts for best results."
  },
  {
    question: "What's the difference between crusher run and gravel?",
    answer: "Crusher run contains stone dust and angular pieces that compact tightly, while gravel consists of rounded stones that don't lock together. Crusher run is better for bases and driveways because it creates a more stable, solid surface."
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

export default function CrusherRunCalculator() {
  const [projectType, setProjectType] = useState<ProjectType>('driveway');
  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("10");
  const [depth, setDepth] = useState<string>("4");
  const [lengthUnit, setLengthUnit] = useState<Unit>('feet');
  const [depthUnit, setDepthUnit] = useState<Unit>('inches');
  const [pricePerTon, setPricePerTon] = useState<string>("35");
  const [includeDelivery, setIncludeDelivery] = useState(true);

  // Convert to feet
  const convertToFeet = (value: number, unit: Unit): number => {
    switch (unit) {
      case 'inches': return value / 12;
      case 'yards': return value * 3;
      case 'meters': return value * 3.28084;
      default: return value;
    }
  };

  // Calculate results
  const results = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const price = parseFloat(pricePerTon) || 35;

    const lengthFt = convertToFeet(l, lengthUnit);
    const widthFt = convertToFeet(w, lengthUnit);
    const depthFt = convertToFeet(d, depthUnit);

    const squareFeet = lengthFt * widthFt;
    const cubicFeet = squareFeet * depthFt;
    const cubicYards = cubicFeet / 27;
    const tons = cubicYards * CRUSHER_RUN_DENSITY;
    const tonsWithExtra = tons * 1.1; // 10% extra for compaction

    const materialCost = tonsWithExtra * price;
    const deliveryFee = includeDelivery ? 100 : 0;
    const totalCost = materialCost + deliveryFee;

    const totalLbs = tonsWithExtra * 2000;

    return {
      squareFeet: squareFeet.toFixed(1),
      cubicFeet: cubicFeet.toFixed(2),
      cubicYards: cubicYards.toFixed(2),
      tons: tons.toFixed(2),
      tonsWithExtra: tonsWithExtra.toFixed(2),
      totalLbs: Math.round(totalLbs),
      materialCost: materialCost.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      totalCost: totalCost.toFixed(2),
      pricePerSqFt: squareFeet > 0 ? (totalCost / squareFeet).toFixed(2) : '0.00'
    };
  }, [length, width, depth, lengthUnit, depthUnit, pricePerTon, includeDelivery]);

  const handleProjectTypeChange = (type: ProjectType) => {
    setProjectType(type);
    if (type !== 'custom') {
      setDepth(PROJECT_DEPTHS[type].depth.toString());
    }
  };

  const formatNumber = (num: string | number) => {
    return parseFloat(num.toString()).toLocaleString('en-US');
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Crusher Run Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Crusher Run Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much crusher run you need in tons and cubic yards. Get instant estimates for driveways, walkways, patios, and more with 2025 pricing.
          </p>
        </div>

        {/* Quick Answer Box */}
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Reference</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                <strong>1 cubic yard</strong> ≈ 1.25 tons (2,500 lbs) • <strong>1 ton</strong> covers ~80 sq ft at 4" depth • <strong>Cost:</strong> $25-50/ton
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
          <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Calculate Your Material Needs</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Project Type */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📋 Project Type
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {(Object.entries(PROJECT_DEPTHS) as [ProjectType, typeof PROJECT_DEPTHS.driveway][]).map(([key, project]) => (
                      <button
                        key={key}
                        onClick={() => handleProjectTypeChange(key)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: projectType === key ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: projectType === key ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: projectType === key ? "#D97706" : "#374151", margin: 0, fontSize: "0.85rem" }}>{project.label}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>{project.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div style={{ backgroundColor: "#F0F9FF", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📏 Dimensions
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Length</label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Width</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Length/Width Unit</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {(['feet', 'inches', 'yards', 'meters'] as Unit[]).map((unit) => (
                        <button
                          key={unit}
                          onClick={() => setLengthUnit(unit)}
                          style={{
                            flex: "1 1 auto",
                            minWidth: "70px",
                            padding: "8px",
                            borderRadius: "6px",
                            border: lengthUnit === unit ? "2px solid #0369A1" : "1px solid #D1D5DB",
                            backgroundColor: lengthUnit === unit ? "#E0F2FE" : "white",
                            color: lengthUnit === unit ? "#0369A1" : "#374151",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                            textTransform: "capitalize"
                          }}
                        >
                          {unit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Depth</label>
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => {
                          setDepth(e.target.value);
                          setProjectType('custom');
                        }}
                        style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Depth Unit</label>
                      <select
                        value={depthUnit}
                        onChange={(e) => setDepthUnit(e.target.value as Unit)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      >
                        <option value="inches">Inches</option>
                        <option value="feet">Feet</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    💰 Pricing Options
                  </h3>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Price per Ton ($)</label>
                    <input
                      type="number"
                      value={pricePerTon}
                      onChange={(e) => setPricePerTon(e.target.value)}
                      style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>Typical range: $25-50/ton</p>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0", fontSize: "0.9rem" }}>Include Delivery</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Est. $50-150</p>
                    </div>
                    <button
                      onClick={() => setIncludeDelivery(!includeDelivery)}
                      style={{
                        width: "56px",
                        height: "28px",
                        borderRadius: "14px",
                        backgroundColor: includeDelivery ? "#059669" : "#D1D5DB",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background-color 0.2s"
                      }}
                    >
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "2px",
                        left: includeDelivery ? "30px" : "2px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ backgroundColor: "#D97706", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Material Needed (with 10% extra)</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatNumber(results.tonsWithExtra)} tons
                  </p>
                  <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {formatNumber(results.cubicYards)} cubic yards
                  </p>
                </div>

                {/* Volume Breakdown */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Volume Details</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FCD34D" }}>
                      <span style={{ color: "#6B7280" }}>Area Coverage</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatNumber(results.squareFeet)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FCD34D" }}>
                      <span style={{ color: "#6B7280" }}>Cubic Feet</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatNumber(results.cubicFeet)} cu ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FCD34D" }}>
                      <span style={{ color: "#6B7280" }}>Cubic Yards</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatNumber(results.cubicYards)} cu yd</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #FCD34D" }}>
                      <span style={{ color: "#6B7280" }}>Base Amount</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatNumber(results.tons)} tons</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#6B7280" }}>With 10% Extra</span>
                      <span style={{ fontWeight: "700", color: "#D97706" }}>{formatNumber(results.tonsWithExtra)} tons</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>💵 Cost Estimate</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Material ({results.tonsWithExtra} tons × ${pricePerTon})</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>${formatNumber(results.materialCost)}</span>
                    </div>
                    {includeDelivery && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                        <span style={{ color: "#6B7280" }}>Delivery (estimated)</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>${formatNumber(results.deliveryFee)}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#374151", fontWeight: "600" }}>Total Estimated Cost</span>
                      <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.2rem" }}>${formatNumber(results.totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Pro Tip */}
                <div style={{ padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px", border: "1px solid #93C5FD" }}>
                  <p style={{ fontSize: "0.85rem", color: "#1E40AF", margin: 0 }}>
                    💡 <strong>Pro Tip:</strong> Order 10-15% extra to account for compaction, spreading, and waste. Compact in 2" lifts for best results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Chart */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📊 Crusher Run Coverage Chart</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>How much area does 1 ton or 1 cubic yard of crusher run cover?</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Depth</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Sq Ft per Ton</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Sq Ft per Cubic Yard</th>
                </tr>
              </thead>
              <tbody>
                {COVERAGE_DATA.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{row.depth}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706", fontWeight: "600" }}>{row.sqFtPerTon} sq ft</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.sqFtPerYard} sq ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tons to Cubic Yards Conversion */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>⚖️ Tons to Cubic Yards Conversion</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Quick reference: 1 cubic yard of crusher run ≈ 1.25 tons (2,500 lbs)</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "300px" }}>
              <thead>
                <tr style={{ backgroundColor: "#E0F2FE" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Tons</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Cubic Yards</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Pounds</th>
                </tr>
              </thead>
              <tbody>
                {TONS_CONVERSION.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{row.tons} ton{row.tons > 1 ? 's' : ''}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0369A1", fontWeight: "600" }}>{row.cubicYards} yd³</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(row.tons * 2000).toLocaleString()} lbs</td>
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
            {/* What is Crusher Run */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>What is Crusher Run?</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                Crusher run, also known as crush and run, quarry process, or ABC stone (Aggregate Base Course), is a blend of crushed stone and stone dust. The angular pieces interlock when compacted, creating an extremely stable and durable base layer.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                It typically contains 3/4" crushed stone mixed with smaller particles down to fine dust. This gradation allows the material to compact tightly, making it ideal for driveways, walkways, patios, and building foundations.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
                {[
                  { label: "Excellent compaction", icon: "✅" },
                  { label: "Superior drainage", icon: "💧" },
                  { label: "Long-lasting base", icon: "🏗️" },
                  { label: "Cost-effective", icon: "💰" }
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Depths */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📏 Recommended Crusher Run Depth by Project</h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { project: "Walkway / Path", depth: "2 inches", desc: "Light foot traffic only" },
                  { project: "Patio Base", depth: "3 inches", desc: "Under pavers or flagstone" },
                  { project: "Residential Driveway", depth: "4 inches", desc: "Standard car traffic" },
                  { project: "Heavy-Use Driveway", depth: "6 inches", desc: "Trucks, RVs, heavy vehicles" },
                  { project: "Parking Area / Commercial", depth: "6-8 inches", desc: "Frequent heavy traffic" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: i % 2 === 0 ? "#FEF3C7" : "#F9FAFB", borderRadius: "8px" }}>
                    <div>
                      <p style={{ fontWeight: "600", color: "#374151", margin: 0 }}>{item.project}</p>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "4px 0 0 0" }}>{item.desc}</p>
                    </div>
                    <span style={{ fontWeight: "700", color: "#D97706", fontSize: "1.1rem" }}>{item.depth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2025 Pricing */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💰 Crusher Run Prices (2025)</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#ECFDF5" }}>
                      <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Item</th>
                      <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600" }}>Price Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: "Crusher Run (per ton)", price: "$25 - $50" },
                      { item: "Crusher Run (per cubic yard)", price: "$30 - $65" },
                      { item: "Delivery Fee (local)", price: "$50 - $150" },
                      { item: "Dump Truck Load (10-22 tons)", price: "$200 - $800" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>{row.item}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600", color: "#059669" }}>{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "12px" }}>
                * Prices vary by location and quantity. Bulk orders (10+ tons) often qualify for discounts.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Formulas */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>🧮 Quick Formulas</h3>
              <div style={{ fontSize: "0.85rem", color: "#92400E" }}>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Tons from Cubic Yards:</p>
                  <code style={{ backgroundColor: "rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "4px" }}>Cubic Yards × 1.25 = Tons</code>
                </div>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Cubic Yards from Tons:</p>
                  <code style={{ backgroundColor: "rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "4px" }}>Tons ÷ 1.25 = Cubic Yards</code>
                </div>
                <div>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>Cubic Yards Needed:</p>
                  <code style={{ backgroundColor: "rgba(255,255,255,0.5)", padding: "4px 8px", borderRadius: "4px" }}>L × W × D (ft) ÷ 27</code>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <ul style={{ fontSize: "0.85rem", color: "#065F46", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Order 10-15% extra for compaction and waste</li>
                <li style={{ marginBottom: "8px" }}>Compact in 2" lifts for best results</li>
                <li style={{ marginBottom: "8px" }}>Use landscape fabric underneath to prevent mixing with soil</li>
                <li style={{ marginBottom: "8px" }}>A plate compactor rental is ~$80/day</li>
                <li>Wet the material slightly before compacting</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/crusher-run-calculator" currentCategory="Construction" />
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
            🪨 <strong>Disclaimer:</strong> Estimates are based on average crusher run density of 2,500 lbs per cubic yard. Actual weights may vary by 5-10% depending on moisture content and material composition. Always confirm quantities with your supplier before ordering. Prices reflect 2025 market averages and vary by location.
          </p>
        </div>
      </div>
    </div>
  );
}