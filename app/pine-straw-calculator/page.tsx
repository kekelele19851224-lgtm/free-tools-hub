"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Coverage rates (sq ft per bale at different depths)
const coverageRates = {
  "2": { sqftPerBale: 50, label: '2" (Refresh/Top-up)', description: "Light coverage for maintenance" },
  "3": { sqftPerBale: 38, label: '3" (Recommended)', description: "Standard coverage for most applications" },
  "4": { sqftPerBale: 28, label: '4" (New Installation)', description: "Heavy coverage for new beds" },
};

// Bale types
const baleTypes = {
  square: { label: "Square Bale", multiplier: 1, description: "Standard bale (~35-50 sq ft coverage)" },
  round: { label: "Round Roll", multiplier: 2.25, description: "= 2.25 square bales, easier to spread" },
};

// Pine straw types
const pineTypes = {
  slash: { label: "Slash Pine", priceRange: [4, 5], description: '5-7" needles, economical choice' },
  longleaf: { label: "Long Leaf Pine", priceRange: [5, 7], description: '10-13" needles, lasts longer' },
};

// Quick reference data
const quickReference = [
  { area: 500, label: "500 sq ft" },
  { area: 1000, label: "1,000 sq ft" },
  { area: 2000, label: "2,000 sq ft" },
  { area: 2500, label: "2,500 sq ft" },
  { area: 5000, label: "5,000 sq ft" },
  { area: 10000, label: "10,000 sq ft" },
  { area: 43560, label: "1 Acre" },
];

// FAQ data
const faqs = [
  {
    question: "How do I figure out how much pine straw I need?",
    answer: "Measure your landscape area in square feet (length × width). Then divide by the coverage rate based on your desired depth: for 2\" depth, divide by 50; for 3\" depth, divide by 38; for 4\" depth, divide by 28. For example, a 1,000 sq ft area at 3\" depth needs about 26 bales (1,000 ÷ 38 = 26.3, rounded up)."
  },
  {
    question: "How many bales of pine straw per 1000 square feet?",
    answer: "At the recommended 3\" depth, you'll need approximately 26 bales per 1,000 square feet. For lighter 2\" coverage (maintenance/refresh), you'll need about 20 bales. For heavier 4\" coverage (new installation), plan for about 36 bales."
  },
  {
    question: "How many bales of pine straw per acre?",
    answer: "One acre equals 43,560 square feet. At 3\" depth, you'll need approximately 1,146 bales. At 2\" depth, about 872 bales. At 4\" depth, approximately 1,556 bales. For large areas, consider buying by the truckload—a 48' trailer holds about 1,323 square bales."
  },
  {
    question: "How much should I charge per bale of pine straw?",
    answer: "For installation services, the industry standard is $8-$12 per bale installed, which includes delivery and spreading. DIY bales cost $4-$7 at retail stores like Home Depot or Lowe's. Professional installers typically double their material cost or charge $3-$4 per bale for labor plus materials. An average worker can install about 15 bales per hour."
  },
  {
    question: "What's the difference between slash and long leaf pine straw?",
    answer: "Slash pine needles are 5-7\" long, golden-brown, and more economical ($4-$5/bale). Long leaf pine needles are 10-13\" long, hold their color longer, and cost slightly more ($5-$7/bale). Long leaf is preferred for its appearance and durability, while slash is good for budget-conscious projects."
  },
  {
    question: "How long does pine straw last?",
    answer: "Pine straw typically lasts 6-12 months depending on climate, foot traffic, and weather exposure. Long leaf pine straw generally lasts longer than slash pine. Most homeowners refresh their pine straw once or twice per year. The needles decompose naturally, adding nutrients to your soil."
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

export default function PineStrawCalculator() {
  // Input mode
  const [inputMode, setInputMode] = useState<"dimensions" | "sqft">("dimensions");
  
  // Inputs
  const [length, setLength] = useState<string>("50");
  const [width, setWidth] = useState<string>("20");
  const [totalSqft, setTotalSqft] = useState<string>("1000");
  const [depth, setDepth] = useState<keyof typeof coverageRates>("3");
  const [baleType, setBaleType] = useState<keyof typeof baleTypes>("square");
  const [pineType, setPineType] = useState<keyof typeof pineTypes>("longleaf");
  
  // Results
  const [results, setResults] = useState({
    area: 0,
    balesNeeded: 0,
    rollsNeeded: 0,
    diyCostLow: 0,
    diyCostHigh: 0,
    installedCostLow: 0,
    installedCostHigh: 0,
  });

  // Calculate
  useEffect(() => {
    let area: number;
    if (inputMode === "dimensions") {
      area = (parseFloat(length) || 0) * (parseFloat(width) || 0);
    } else {
      area = parseFloat(totalSqft) || 0;
    }
    
    const coverage = coverageRates[depth];
    const pine = pineTypes[pineType];
    const bale = baleTypes[baleType];
    
    // Calculate bales needed
    let balesNeeded = Math.ceil(area / coverage.sqftPerBale);
    
    // Adjust for bale type
    let finalUnits = baleType === "round" 
      ? Math.ceil(balesNeeded / bale.multiplier)
      : balesNeeded;
    
    // Cost calculations (based on square bales equivalent)
    const diyCostLow = balesNeeded * pine.priceRange[0];
    const diyCostHigh = balesNeeded * pine.priceRange[1];
    const installedCostLow = balesNeeded * 8;
    const installedCostHigh = balesNeeded * 12;
    
    setResults({
      area,
      balesNeeded,
      rollsNeeded: Math.ceil(balesNeeded / 2.25),
      diyCostLow,
      diyCostHigh,
      installedCostLow,
      installedCostHigh,
    });
  }, [length, width, totalSqft, inputMode, depth, baleType, pineType]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pine Straw Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌲</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Pine Straw Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many bales of pine straw you need for your landscaping project. Get coverage estimates and cost comparisons for DIY vs professional installation.
          </p>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #A7F3D0",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>💡</span>
          <div>
            <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>
              Coverage Rule of Thumb
            </p>
            <p style={{ fontSize: "0.875rem", color: "#047857", margin: 0 }}>
              At 3&quot; depth (recommended): 1 bale covers ~35-40 sq ft | At 2&quot; depth: ~50 sq ft | At 4&quot; depth: ~25-30 sq ft
            </p>
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
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📐 Area & Coverage Settings
                </h3>

                {/* Input Mode Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Input Method
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => setInputMode("dimensions")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: inputMode === "dimensions" ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "dimensions" ? "#ECFDF5" : "white",
                        color: inputMode === "dimensions" ? "#059669" : "#6B7280",
                        fontWeight: inputMode === "dimensions" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      📏 Length × Width
                    </button>
                    <button
                      onClick={() => setInputMode("sqft")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: inputMode === "sqft" ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "sqft" ? "#ECFDF5" : "white",
                        color: inputMode === "sqft" ? "#059669" : "#6B7280",
                        fontWeight: inputMode === "sqft" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      📐 Total Sq Ft
                    </button>
                  </div>
                </div>

                {/* Dimension Inputs */}
                {inputMode === "dimensions" ? (
                  <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Total Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={totalSqft}
                      onChange={(e) => setTotalSqft(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {["500", "1000", "2000", "5000"].map((val) => (
                        <button
                          key={val}
                          onClick={() => setTotalSqft(val)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "6px",
                            border: totalSqft === val ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: totalSqft === val ? "#ECFDF5" : "white",
                            color: totalSqft === val ? "#059669" : "#6B7280",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          {formatNumber(parseInt(val))} sq ft
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coverage Depth */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Coverage Depth
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {(Object.keys(coverageRates) as Array<keyof typeof coverageRates>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setDepth(key)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: depth === key ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: depth === key ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontWeight: "600", color: depth === key ? "#059669" : "#374151" }}>
                              {coverageRates[key].label}
                            </span>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                              {coverageRates[key].description}
                            </p>
                          </div>
                          <span style={{ fontSize: "0.8rem", color: depth === key ? "#059669" : "#9CA3AF", fontWeight: "600" }}>
                            ~{coverageRates[key].sqftPerBale} sq ft/bale
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pine Type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Pine Straw Type
                  </label>
                  <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {(Object.keys(pineTypes) as Array<keyof typeof pineTypes>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setPineType(key)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: pineType === key ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: pineType === key ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <span style={{ fontWeight: "600", color: pineType === key ? "#059669" : "#374151", fontSize: "0.9rem" }}>
                          {pineTypes[key].label}
                        </span>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                          ${pineTypes[key].priceRange[0]}-${pineTypes[key].priceRange[1]}/bale
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", border: "2px solid #A7F3D0" }}>
                <h3 style={{ fontWeight: "600", color: "#065F46", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Pine Straw Estimate
                </h3>

                {/* Area Display */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 4px 0" }}>Total Coverage Area</p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                    {formatNumber(results.area)} sq ft
                  </p>
                </div>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#059669",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                    Bales Needed
                  </p>
                  <p style={{ fontSize: "3rem", fontWeight: "bold", color: "white", margin: 0 }}>
                    {formatNumber(results.balesNeeded)}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "8px" }}>
                    square bales at {depth}&quot; depth
                  </p>
                </div>

                {/* Alternative: Rolls */}
                <div style={{ 
                  padding: "14px", 
                  backgroundColor: "white", 
                  borderRadius: "8px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{ color: "#374151", fontWeight: "500" }}>Or in Round Rolls</span>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>1 roll = 2.25 bales</p>
                  </div>
                  <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.2rem" }}>
                    {formatNumber(results.rollsNeeded)} rolls
                  </span>
                </div>

                {/* Cost Estimates */}
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ 
                    padding: "14px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <span style={{ color: "#374151", fontWeight: "500" }}>🛒 DIY Cost</span>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>Materials only</p>
                    </div>
                    <span style={{ fontWeight: "700", color: "#2563EB", fontSize: "1rem" }}>
                      {formatCurrency(results.diyCostLow)} - {formatCurrency(results.diyCostHigh)}
                    </span>
                  </div>

                  <div style={{ 
                    padding: "14px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <span style={{ color: "#374151", fontWeight: "500" }}>👷 Professional Install</span>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>Delivered & spread</p>
                    </div>
                    <span style={{ fontWeight: "700", color: "#DC2626", fontSize: "1rem" }}>
                      {formatCurrency(results.installedCostLow)} - {formatCurrency(results.installedCostHigh)}
                    </span>
                  </div>
                </div>

                {/* Savings Tip */}
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    <strong>💰 Savings:</strong> DIY saves you {formatCurrency(results.installedCostLow - results.diyCostHigh)} - {formatCurrency(results.installedCostHigh - results.diyCostLow)} compared to professional installation!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Pine Straw Bales Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Number of square bales needed by area and depth
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Area</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>2&quot; Depth</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>3&quot; Depth ✓</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>4&quot; Depth</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Round Rolls</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const bales2 = Math.ceil(row.area / 50);
                  const bales3 = Math.ceil(row.area / 38);
                  const bales4 = Math.ceil(row.area / 28);
                  const rolls = Math.ceil(bales3 / 2.25);
                  
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.label}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatNumber(bales2)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{formatNumber(bales3)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatNumber(bales4)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{formatNumber(rolls)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Based on standard square bales. Round rolls equal approximately 2.25 square bales each.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How to Calculate */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 How to Calculate Pine Straw Needs
              </h2>

              <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px" }}>The Formula</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#1F2937",
                  color: "#10B981",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Bales Needed = Area (sq ft) ÷ Coverage Rate<br /><br />
                  Coverage Rates:<br />
                  • 2&quot; depth: 50 sq ft per bale<br />
                  • 3&quot; depth: 38 sq ft per bale (recommended)<br />
                  • 4&quot; depth: 28 sq ft per bale
                </code>
              </div>

              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Example Calculation</h3>
              <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px" }}>
                <p style={{ color: "#065F46", margin: 0, lineHeight: "1.8" }}>
                  <strong>Flower bed:</strong> 30 ft × 10 ft = 300 sq ft<br />
                  <strong>At 3&quot; depth:</strong> 300 ÷ 38 = 7.9 → <strong>8 bales needed</strong><br />
                  <strong>DIY Cost:</strong> 8 × $5 = $40<br />
                  <strong>Installed:</strong> 8 × $10 = $80
                </p>
              </div>
            </div>

            {/* Pine Types Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🌲 Slash vs Long Leaf Pine Straw
              </h2>
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "12px" }}>Slash Pine</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>Needles: 5-7 inches</li>
                    <li style={{ marginBottom: "8px" }}>Color: Golden brown</li>
                    <li style={{ marginBottom: "8px" }}>Price: $4-$5/bale</li>
                    <li style={{ marginBottom: "8px" }}>Duration: 6-9 months</li>
                    <li>Best for: Budget projects</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "12px" }}>Long Leaf Pine ⭐</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#065F46", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>Needles: 10-13 inches</li>
                    <li style={{ marginBottom: "8px" }}>Color: Rich golden</li>
                    <li style={{ marginBottom: "8px" }}>Price: $5-$7/bale</li>
                    <li style={{ marginBottom: "8px" }}>Duration: 9-12 months</li>
                    <li>Best for: Premium look</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Benefits */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✅ Benefits of Pine Straw
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { title: "Weed Control", desc: "Blocks sunlight to prevent weeds" },
                  { title: "Moisture Retention", desc: "Keeps soil moist longer" },
                  { title: "Soil Acidifier", desc: "Great for azaleas, camellias" },
                  { title: "Erosion Control", desc: "Interlocks to stay in place" },
                  { title: "Natural Look", desc: "Blends with landscape" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>{item.title}</p>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Buy 10% extra for waste</li>
                <li style={{ marginBottom: "8px" }}>Order from farms for bulk savings</li>
                <li style={{ marginBottom: "8px" }}>Apply in fall or spring</li>
                <li style={{ marginBottom: "8px" }}>Water beds before applying</li>
                <li>Keep straw away from plant stems</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/pine-straw-calculator"
              currentCategory="Home"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
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
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🌲 <strong>Disclaimer:</strong> Coverage rates and prices are estimates based on industry averages. Actual coverage may vary based on bale size, spreading technique, and supplier. Prices vary by region and season. Always buy 10% extra to account for waste and uneven areas.
          </p>
        </div>
      </div>
    </div>
  );
}
