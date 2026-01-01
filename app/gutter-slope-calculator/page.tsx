"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Conversion functions
const feetToMeters = (feet: number): number => feet * 0.3048;
const metersToFeet = (meters: number): number => meters / 0.3048;
const inchesToCm = (inches: number): number => inches * 2.54;
const cmToInches = (cm: number): number => cm / 2.54;

// Slope calculation functions
const calcTotalDrop = (lengthFeet: number, slopePerTenFeet: number): number => {
  return (lengthFeet / 10) * slopePerTenFeet;
};

const calcSlopeAngle = (slopePerTenFeet: number): number => {
  // 10 feet = 120 inches
  const riseInches = slopePerTenFeet;
  const runInches = 120;
  const radians = Math.atan(riseInches / runInches);
  return radians * (180 / Math.PI);
};

const calcSlopePercentage = (slopePerTenFeet: number): number => {
  // rise / run * 100 (10 feet = 120 inches)
  return (slopePerTenFeet / 120) * 100;
};

const calcDropPerFoot = (slopePerTenFeet: number): number => {
  return slopePerTenFeet / 10;
};

// Quick reference data
const quickReferenceData = [
  { length: 10, standard: 0.25, maximum: 0.50 },
  { length: 20, standard: 0.50, maximum: 1.00 },
  { length: 30, standard: 0.75, maximum: 1.50 },
  { length: 40, standard: 1.00, maximum: 2.00 },
  { length: 50, standard: 1.25, maximum: 2.50 },
  { length: 60, standard: 1.50, maximum: 3.00 },
  { length: 80, standard: 2.00, maximum: 4.00 },
  { length: 100, standard: 2.50, maximum: 5.00 },
];

// FAQ data
const faqs = [
  {
    question: "How to calculate gutter slope?",
    answer: "To calculate gutter slope, use the formula: Total Drop = (Gutter Length ÷ 10) × Slope Rate. The standard slope rate is 1/4 inch per 10 feet of gutter. For example, a 30-foot gutter needs: (30 ÷ 10) × 0.25 = 0.75 inches of total drop from the high end to the downspout."
  },
  {
    question: "What is the slope for gutters 50 feet?",
    answer: "For a 50-foot gutter run using the standard 1/4 inch per 10 feet slope: (50 ÷ 10) × 0.25 = 1.25 inches total drop. If using the maximum 1/2 inch per 10 feet slope for heavy rainfall areas: (50 ÷ 10) × 0.50 = 2.50 inches total drop."
  },
  {
    question: "How much should a gutter drop every 10 feet?",
    answer: "Gutters should drop between 1/4 inch (0.25\") to 1/2 inch (0.50\") for every 10 feet of length. The standard recommendation is 1/4 inch per 10 feet for most applications. Use 1/2 inch per 10 feet in areas with heavy rainfall or if you want faster drainage."
  },
  {
    question: "What is the minimum fall for gutters?",
    answer: "The minimum fall (slope) for gutters is 1/4 inch per 10 feet (approximately 0.2% grade or 0.12 degrees). This minimum ensures water flows toward the downspout rather than pooling in the gutter. Less slope can cause standing water, debris buildup, and potential overflow during rain."
  },
  {
    question: "What is gutter slope in degrees?",
    answer: "The standard gutter slope of 1/4 inch per 10 feet equals approximately 0.12 degrees (or 0.21% grade). The maximum recommended slope of 1/2 inch per 10 feet equals approximately 0.24 degrees (or 0.42% grade). These slight angles are barely visible but essential for proper drainage."
  },
  {
    question: "Should I use single or double downspouts?",
    answer: "Use a single downspout at one end for gutter runs up to 40 feet. For runs longer than 40 feet, install downspouts at both ends and slope the gutter from the center toward each end. This prevents excessive drop at one end and ensures efficient drainage for longer roof lines."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function GutterSlopeCalculator() {
  // Input state
  const [gutterLength, setGutterLength] = useState<string>("30");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  const [slopeRate, setSlopeRate] = useState<"standard" | "maximum" | "custom">("standard");
  const [customSlope, setCustomSlope] = useState<string>("0.25");
  const [downspoutConfig, setDownspoutConfig] = useState<"single" | "double">("single");

  // Results state
  const [totalDrop, setTotalDrop] = useState<number>(0);
  const [slopeAngle, setSlopeAngle] = useState<number>(0);
  const [slopePercentage, setSlopePercentage] = useState<number>(0);
  const [dropPerFoot, setDropPerFoot] = useState<number>(0);

  // Get slope value based on selection
  const getSlopeValue = (): number => {
    if (slopeRate === "standard") return 0.25;
    if (slopeRate === "maximum") return 0.50;
    return parseFloat(customSlope) || 0.25;
  };

  // Calculate results
  useEffect(() => {
    let lengthInFeet = parseFloat(gutterLength) || 0;
    
    // Convert to feet if metric
    if (unitSystem === "metric") {
      lengthInFeet = metersToFeet(lengthInFeet);
    }

    const slope = getSlopeValue();
    
    // For double downspout, each side is half the length
    const effectiveLength = downspoutConfig === "double" ? lengthInFeet / 2 : lengthInFeet;
    
    const drop = calcTotalDrop(effectiveLength, slope);
    const angle = calcSlopeAngle(slope);
    const percentage = calcSlopePercentage(slope);
    const perFoot = calcDropPerFoot(slope);

    setTotalDrop(drop);
    setSlopeAngle(angle);
    setSlopePercentage(percentage);
    setDropPerFoot(perFoot);
  }, [gutterLength, unitSystem, slopeRate, customSlope, downspoutConfig]);

  // Format measurements
  const formatDrop = (inches: number): string => {
    if (unitSystem === "metric") {
      return `${inchesToCm(inches).toFixed(2)} cm`;
    }
    return `${inches.toFixed(2)}"`;
  };

  const formatLength = (value: number): string => {
    if (unitSystem === "metric") {
      return `${value} m`;
    }
    return `${value} ft`;
  };

  const formatDropPerUnit = (inchesPerFoot: number): string => {
    if (unitSystem === "metric") {
      const cmPerMeter = inchesToCm(inchesPerFoot) * 3.28084;
      return `${cmPerMeter.toFixed(3)} cm/m`;
    }
    return `${inchesPerFoot.toFixed(4)}"/ft`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Gutter Slope Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Gutter Slope Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the proper slope (pitch) for your rain gutters. Get the exact drop needed for efficient water drainage and prevent pooling, overflow, and foundation damage.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {/* Left - Inputs */}
            <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                📏 Gutter Measurements
              </h3>

              {/* Unit System Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Unit System
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setUnitSystem("imperial")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      borderRadius: "8px",
                      border: unitSystem === "imperial" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "imperial" ? "#EFF6FF" : "white",
                      color: unitSystem === "imperial" ? "#1E40AF" : "#4B5563",
                      fontWeight: unitSystem === "imperial" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🇺🇸 Imperial (ft/in)
                  </button>
                  <button
                    onClick={() => setUnitSystem("metric")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      borderRadius: "8px",
                      border: unitSystem === "metric" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "metric" ? "#EFF6FF" : "white",
                      color: unitSystem === "metric" ? "#1E40AF" : "#4B5563",
                      fontWeight: unitSystem === "metric" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🌍 Metric (m/cm)
                  </button>
                </div>
              </div>

              {/* Gutter Length */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Gutter Length ({unitSystem === "imperial" ? "feet" : "meters"})
                </label>
                <input
                  type="number"
                  value={gutterLength}
                  onChange={(e) => setGutterLength(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "2px solid #E5E7EB",
                    borderRadius: "10px",
                    fontSize: "1.25rem",
                    fontWeight: "600"
                  }}
                  placeholder="Enter length"
                  min="0"
                  step="1"
                />
              </div>

              {/* Slope Rate */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Slope Rate
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: slopeRate === "standard" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: slopeRate === "standard" ? "#EFF6FF" : "white",
                    cursor: "pointer"
                  }}>
                    <input
                      type="radio"
                      name="slopeRate"
                      checked={slopeRate === "standard"}
                      onChange={() => setSlopeRate("standard")}
                    />
                    <div>
                      <span style={{ fontWeight: "500", color: "#111827" }}>Standard: 1/4&quot; per 10 ft</span>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>Recommended for most applications</p>
                    </div>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: slopeRate === "maximum" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: slopeRate === "maximum" ? "#EFF6FF" : "white",
                    cursor: "pointer"
                  }}>
                    <input
                      type="radio"
                      name="slopeRate"
                      checked={slopeRate === "maximum"}
                      onChange={() => setSlopeRate("maximum")}
                    />
                    <div>
                      <span style={{ fontWeight: "500", color: "#111827" }}>Maximum: 1/2&quot; per 10 ft</span>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>For heavy rainfall areas</p>
                    </div>
                  </label>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: slopeRate === "custom" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: slopeRate === "custom" ? "#EFF6FF" : "white",
                    cursor: "pointer"
                  }}>
                    <input
                      type="radio"
                      name="slopeRate"
                      checked={slopeRate === "custom"}
                      onChange={() => setSlopeRate("custom")}
                    />
                    <div style={{ flex: "1" }}>
                      <span style={{ fontWeight: "500", color: "#111827" }}>Custom</span>
                      {slopeRate === "custom" && (
                        <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            type="number"
                            value={customSlope}
                            onChange={(e) => setCustomSlope(e.target.value)}
                            style={{
                              width: "80px",
                              padding: "6px 10px",
                              border: "1px solid #D1D5DB",
                              borderRadius: "6px",
                              fontSize: "0.875rem"
                            }}
                            step="0.05"
                            min="0.1"
                            max="1"
                          />
                          <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>inches per 10 ft</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Downspout Configuration */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Downspout Configuration
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setDownspoutConfig("single")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      borderRadius: "8px",
                      border: downspoutConfig === "single" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: downspoutConfig === "single" ? "#EFF6FF" : "white",
                      color: downspoutConfig === "single" ? "#1E40AF" : "#4B5563",
                      fontWeight: downspoutConfig === "single" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Single End
                  </button>
                  <button
                    onClick={() => setDownspoutConfig("double")}
                    style={{
                      flex: "1",
                      padding: "10px",
                      borderRadius: "8px",
                      border: downspoutConfig === "double" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: downspoutConfig === "double" ? "#EFF6FF" : "white",
                      color: downspoutConfig === "double" ? "#1E40AF" : "#4B5563",
                      fontWeight: downspoutConfig === "double" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.8rem"
                    }}
                  >
                    Both Ends
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                  {downspoutConfig === "single" 
                    ? "💧 Water flows to one end" 
                    : "💧 Water flows from center to both ends (recommended for runs over 40ft)"}
                </p>
              </div>
            </div>

            {/* Right - Results */}
            <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", border: "2px solid #BBF7D0" }}>
              <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "20px", fontSize: "1.1rem" }}>
                📊 Slope Results
              </h3>

              {/* Main Result */}
              <div style={{ 
                backgroundColor: "#DCFCE7", 
                padding: "20px", 
                borderRadius: "12px", 
                textAlign: "center",
                marginBottom: "20px",
                border: "2px solid #22C55E"
              }}>
                <p style={{ fontSize: "0.875rem", color: "#166534", marginBottom: "8px" }}>Total Drop Required</p>
                <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#16A34A" }}>
                  {formatDrop(totalDrop)}
                </p>
                {downspoutConfig === "double" && (
                  <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: "8px" }}>
                    (per side, from center to each downspout)
                  </p>
                )}
              </div>

              {/* Additional Results */}
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <span style={{ color: "#374151", fontSize: "0.9rem" }}>Slope Angle</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{slopeAngle.toFixed(2)}°</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <span style={{ color: "#374151", fontSize: "0.9rem" }}>Slope Percentage</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{slopePercentage.toFixed(2)}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <span style={{ color: "#374151", fontSize: "0.9rem" }}>Drop Per {unitSystem === "imperial" ? "Foot" : "Meter"}</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{formatDropPerUnit(dropPerFoot)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <span style={{ color: "#374151", fontSize: "0.9rem" }}>Gutter Length</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{formatLength(parseFloat(gutterLength) || 0)}</span>
                </div>
              </div>

              {/* Visual Diagram */}
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "white", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "12px", textAlign: "center" }}>Visual Slope Diagram</p>
                <div style={{ position: "relative", height: "60px", backgroundColor: "#F3F4F6", borderRadius: "8px", overflow: "hidden" }}>
                  {downspoutConfig === "single" ? (
                    <>
                      {/* Single downspout diagram */}
                      <div style={{
                        position: "absolute",
                        left: "10%",
                        right: "10%",
                        top: "20px",
                        height: "8px",
                        background: "linear-gradient(to right, #3B82F6, #60A5FA)",
                        borderRadius: "4px",
                        transform: `rotate(${Math.min(slopeAngle * 5, 3)}deg)`,
                        transformOrigin: "left center"
                      }} />
                      <div style={{ position: "absolute", left: "8%", top: "35px", fontSize: "0.7rem", color: "#6B7280" }}>High End</div>
                      <div style={{ position: "absolute", right: "8%", top: "35px", fontSize: "0.7rem", color: "#6B7280" }}>↓ Downspout</div>
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "5px", fontSize: "0.7rem", color: "#2563EB", fontWeight: "600" }}>
                        {formatDrop(totalDrop)} drop
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Double downspout diagram */}
                      <div style={{
                        position: "absolute",
                        left: "10%",
                        width: "35%",
                        top: "20px",
                        height: "8px",
                        background: "linear-gradient(to left, #3B82F6, #60A5FA)",
                        borderRadius: "4px",
                        transform: `rotate(-${Math.min(slopeAngle * 5, 3)}deg)`,
                        transformOrigin: "right center"
                      }} />
                      <div style={{
                        position: "absolute",
                        right: "10%",
                        width: "35%",
                        top: "20px",
                        height: "8px",
                        background: "linear-gradient(to right, #3B82F6, #60A5FA)",
                        borderRadius: "4px",
                        transform: `rotate(${Math.min(slopeAngle * 5, 3)}deg)`,
                        transformOrigin: "left center"
                      }} />
                      <div style={{ position: "absolute", left: "8%", top: "35px", fontSize: "0.7rem", color: "#6B7280" }}>↓ Downspout</div>
                      <div style={{ position: "absolute", right: "8%", top: "35px", fontSize: "0.7rem", color: "#6B7280" }}>↓ Downspout</div>
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "35px", fontSize: "0.7rem", color: "#6B7280" }}>Center (High)</div>
                      <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "5px", fontSize: "0.7rem", color: "#2563EB", fontWeight: "600" }}>
                        {formatDrop(totalDrop)} each side
                      </div>
                    </>
                  )}
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📋 Quick Reference: Gutter Slope by Length
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Total drop required for common gutter lengths
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Gutter Length</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>
                    <span style={{ color: "#2563EB" }}>Standard</span>
                    <br />
                    <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "#6B7280" }}>1/4&quot; per 10ft</span>
                  </th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>
                    <span style={{ color: "#DC2626" }}>Maximum</span>
                    <br />
                    <span style={{ fontSize: "0.75rem", fontWeight: "400", color: "#6B7280" }}>1/2&quot; per 10ft</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {quickReferenceData.map((row, index) => (
                  <tr key={row.length} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.length} ft</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB" }}>{row.standard.toFixed(2)}&quot;</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>{row.maximum.toFixed(2)}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Gutter Slope */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is Gutter Slope?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Gutter slope (also called pitch or fall) is the angle at which rain gutters are installed to ensure water flows toward the downspouts. While gutters may appear level from the ground, they actually have a slight tilt that&apos;s essential for proper drainage.
              </p>

              <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>📐 The 1/4 Inch Rule</h3>
                <p style={{ color: "#1E3A8A", fontSize: "0.9rem", lineHeight: "1.7" }}>
                  The standard recommendation is <strong>1/4 inch of drop for every 10 feet of gutter length</strong>. This creates enough slope to move water efficiently without being so steep that water overshoots the downspout during heavy rain.
                </p>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem" }}>✅</span>
                  <div>
                    <strong style={{ color: "#111827" }}>Proper Slope Benefits</strong>
                    <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Efficient drainage, prevents standing water, reduces debris buildup</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                  <div>
                    <strong style={{ color: "#111827" }}>Too Little Slope</strong>
                    <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Water pools, mosquito breeding, rust and corrosion, overflow</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "1.25rem" }}>⚠️</span>
                  <div>
                    <strong style={{ color: "#111827" }}>Too Much Slope</strong>
                    <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>Water rushes too fast, may overshoot downspout, visible tilt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Install */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                🔧 How to Set Gutter Slope
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { step: "1", title: "Measure Length", desc: "Measure the total length of your gutter run from end to end" },
                  { step: "2", title: "Calculate Drop", desc: "Use our calculator: (Length ÷ 10) × 0.25\" for standard slope" },
                  { step: "3", title: "Mark High Point", desc: "Mark the starting point (opposite end from downspout) on the fascia board" },
                  { step: "4", title: "Mark Low Point", desc: "Measure down from level by the total drop amount at the downspout end" },
                  { step: "5", title: "Snap Chalk Line", desc: "Connect the marks with a chalk line to guide installation" },
                  { step: "6", title: "Install Gutters", desc: "Follow the chalk line when mounting hangers and gutters" }
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#7C3AED",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <strong style={{ color: "#5B21B6" }}>{item.title}</strong>
                      <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Slope Guidelines */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📏 Slope Guidelines
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#166534", fontSize: "0.875rem" }}>Minimum</p>
                  <p style={{ color: "#166534", fontSize: "0.8rem" }}>1/4&quot; per 10 ft (0.12°)</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", fontSize: "0.875rem" }}>Standard</p>
                  <p style={{ color: "#1E40AF", fontSize: "0.8rem" }}>1/4&quot; per 10 ft (0.12°)</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", fontSize: "0.875rem" }}>Maximum</p>
                  <p style={{ color: "#92400E", fontSize: "0.8rem" }}>1/2&quot; per 10 ft (0.24°)</p>
                </div>
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
              <ul style={{ fontSize: "0.8rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Use double downspouts for runs over 40 feet</li>
                <li style={{ marginBottom: "8px" }}>Check slope with a level and tape measure</li>
                <li style={{ marginBottom: "8px" }}>Add downspout at each corner or direction change</li>
                <li style={{ marginBottom: "8px" }}>Increase slope in heavy rainfall areas</li>
                <li>Re-check slope after settling (6 months)</li>
              </ul>
            </div>

            {/* Slope Conversions */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                🔄 Slope Conversions
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#065F46" }}>
                <p style={{ marginBottom: "8px" }}><strong>1/4&quot; per 10ft =</strong></p>
                <ul style={{ paddingLeft: "16px", margin: "0 0 12px 0" }}>
                  <li>0.12 degrees</li>
                  <li>0.21% grade</li>
                  <li>1:480 ratio</li>
                </ul>
                <p style={{ marginBottom: "8px" }}><strong>1/2&quot; per 10ft =</strong></p>
                <ul style={{ paddingLeft: "16px", margin: 0 }}>
                  <li>0.24 degrees</li>
                  <li>0.42% grade</li>
                  <li>1:240 ratio</li>
                </ul>
              </div>
            </div>

            <RelatedTools currentUrl="/gutter-slope-calculator" currentCategory="Home" />
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
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides general guidelines for gutter slope. Actual requirements may vary based on local building codes, rainfall intensity, roof design, and gutter type. Consult a professional for complex installations.
          </p>
        </div>
      </div>
    </div>
  );
}
