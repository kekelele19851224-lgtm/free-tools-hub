"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common shelf life presets
const shelfLifePresets = [
  { label: "6 months", days: 183 },
  { label: "1 year", days: 365 },
  { label: "2 years", days: 730 },
  { label: "3 years", days: 1095 },
  { label: "5 years", days: 1825 }
];

// Temperature presets
const tempPresets = {
  taa: [50, 55, 60],
  trt: [20, 22, 23, 25]
};

// Q10 options
const q10Options = [
  { value: 1.8, label: "1.8 (More conservative)" },
  { value: 2.0, label: "2.0 (Industry standard)" },
  { value: 2.5, label: "2.5 (Less conservative)" }
];

// FAQ data
const faqs = [
  {
    question: "What is accelerated aging in medical devices?",
    answer: "Accelerated aging is a testing method that simulates the effects of long-term storage on medical device packaging by exposing it to elevated temperatures. Based on the Arrhenius equation, which states that chemical reaction rates approximately double for every 10°C increase in temperature, this method allows manufacturers to predict shelf life without waiting years for real-time results. It's commonly used to validate sterile barrier systems before market release."
  },
  {
    question: "How do you calculate accelerated aging time?",
    answer: "The accelerated aging time is calculated using the formula: AAT = Desired Real Time ÷ Aging Factor, where Aging Factor = Q10^((TAA - TRT) ÷ 10). For example, to simulate 1 year (365 days) at 55°C with ambient temperature of 23°C and Q10=2: AF = 2^((55-23)/10) = 2^3.2 = 9.19, so AAT = 365 ÷ 9.19 = 40 days."
  },
  {
    question: "What is Q10 in accelerated aging?",
    answer: "Q10 is a temperature coefficient that describes how much faster chemical reactions occur when temperature increases by 10°C. A Q10 of 2.0 means reactions double in speed for every 10°C increase. For medical device packaging, Q10=2.0 is the industry standard (ASTM F1980). A more conservative value of 1.8 may be used when greater safety margin is desired, while 2.5 is less conservative and requires material-specific data to justify."
  },
  {
    question: "What temperature should I use for accelerated aging?",
    answer: "ASTM F1980 recommends temperatures between 50°C and 60°C, with 55°C being the most commonly used. Higher temperatures (60°C) provide shorter test times but risk physical changes that wouldn't occur in real-time aging. Lower temperatures (50°C) are more conservative but require longer test times. Never exceed 60°C as it may cause unrealistic material degradation."
  },
  {
    question: "How long does accelerated aging take to simulate one year?",
    answer: "At 55°C with ambient temperature of 23°C and Q10=2.0, one year of real-time aging can be simulated in approximately 40 days. At 50°C, it takes about 69 days. At 60°C, it takes about 23 days. The exact duration depends on your specific test parameters."
  },
  {
    question: "Does accelerated aging replace real-time aging?",
    answer: "No, accelerated aging does not replace real-time aging. While regulatory bodies (FDA, EU) accept accelerated aging data for initial product submissions, manufacturers must conduct real-time aging studies in parallel to confirm the accelerated aging predictions. Accelerated aging provides an estimate that allows faster market entry, but real-time data is required for final shelf-life validation."
  },
  {
    question: "What is ASTM F1980?",
    answer: "ASTM F1980 is the 'Standard Guide for Accelerated Aging of Sterile Barrier Systems for Medical Devices.' It provides guidelines for using the Arrhenius equation to accelerate aging tests, including recommended temperature ranges, Q10 values, and calculation methods. This standard is widely recognized by regulatory bodies worldwide for medical device packaging validation."
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

// Calculate aging factor
function calculateAgingFactor(taa: number, trt: number, q10: number): number {
  return Math.pow(q10, (taa - trt) / 10);
}

// Calculate AAT from real time
function calculateAAT(realTimeDays: number, taa: number, trt: number, q10: number): number {
  const af = calculateAgingFactor(taa, trt, q10);
  return realTimeDays / af;
}

// Calculate real time from AAT
function calculateRealTime(aatDays: number, taa: number, trt: number, q10: number): number {
  const af = calculateAgingFactor(taa, trt, q10);
  return aatDays * af;
}

// Format days to readable string
function formatDays(days: number): string {
  if (days < 1) return `${(days * 24).toFixed(1)} hours`;
  if (days < 7) return `${days.toFixed(1)} days`;
  if (days < 30) return `${(days / 7).toFixed(1)} weeks`;
  if (days < 365) return `${(days / 30).toFixed(1)} months`;
  return `${(days / 365).toFixed(2)} years`;
}

export default function AcceleratedAgingCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"calculate" | "reverse" | "compare">("calculate");

  // Tab 1: Calculate AAT
  const [shelfLifeDays, setShelfLifeDays] = useState<string>("365");
  const [shelfLifeUnit, setShelfLifeUnit] = useState<string>("days");
  const [taa, setTaa] = useState<number>(55);
  const [trt, setTrt] = useState<number>(23);
  const [q10, setQ10] = useState<number>(2.0);

  // Tab 2: Reverse Calculate
  const [aatInput, setAatInput] = useState<string>("40");
  const [taaReverse, setTaaReverse] = useState<number>(55);
  const [trtReverse, setTrtReverse] = useState<number>(23);
  const [q10Reverse, setQ10Reverse] = useState<number>(2.0);

  // Tab 3: Compare
  const [compareShelfLife, setCompareShelfLife] = useState<string>("365");
  const [compareTrt, setCompareTrt] = useState<number>(23);
  const [compareQ10, setCompareQ10] = useState<number>(2.0);

  // Convert shelf life to days
  const getShelfLifeInDays = (): number => {
    const value = parseFloat(shelfLifeDays) || 0;
    switch (shelfLifeUnit) {
      case "weeks": return value * 7;
      case "months": return value * 30;
      case "years": return value * 365;
      default: return value;
    }
  };

  // Tab 1 calculations
  const realTimeDays = getShelfLifeInDays();
  const agingFactor = calculateAgingFactor(taa, trt, q10);
  const aatResult = calculateAAT(realTimeDays, taa, trt, q10);
  const aatRoundedUp = Math.ceil(aatResult);

  // Tab 2 calculations
  const reverseAatDays = parseFloat(aatInput) || 0;
  const reverseAgingFactor = calculateAgingFactor(taaReverse, trtReverse, q10Reverse);
  const reverseRealTime = calculateRealTime(reverseAatDays, taaReverse, trtReverse, q10Reverse);

  // Tab 3 calculations
  const compareRealTimeDays = parseFloat(compareShelfLife) || 365;
  const compareResults = tempPresets.taa.map(temp => {
    const af = calculateAgingFactor(temp, compareTrt, compareQ10);
    const aat = compareRealTimeDays / af;
    return {
      temp,
      af,
      aat,
      aatRounded: Math.ceil(aat)
    };
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Accelerated Aging Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌡️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Accelerated Aging Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate accelerated aging time based on ASTM F1980 and the Arrhenius equation. 
            Estimate shelf life testing duration for medical device packaging. Free, no sign-up required.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                1 year shelf life at 55°C (Q10=2) = <strong>40 days</strong> accelerated aging
              </p>
              <p style={{ color: "#2563EB", margin: 0, fontSize: "0.95rem" }}>
                Based on ASTM F1980 | Formula: AAT = Real Time ÷ Q10<sup>((TAA-TRT)/10)</sup>
              </p>
            </div>
          </div>
        </div>

        {/* ASTM Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#ECFDF5",
          padding: "8px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #6EE7B7"
        }}>
          <span style={{ fontSize: "1rem" }}>✓</span>
          <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.9rem" }}>
            Based on ASTM F1980 Standard
          </span>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculate")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculate" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "calculate" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⏱️ Calculate AAT
          </button>
          <button
            onClick={() => setActiveTab("reverse")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "reverse" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "reverse" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔄 Reverse Calculate
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "compare" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "compare" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Temperature Comparison
          </button>
        </div>

        {/* Tab 1: Calculate AAT */}
        {activeTab === "calculate" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⏱️ Test Parameters</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Desired Shelf Life */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Desired Shelf Life
                  </label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="number"
                      value={shelfLifeDays}
                      onChange={(e) => setShelfLifeDays(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem"
                      }}
                    />
                    <select
                      value={shelfLifeUnit}
                      onChange={(e) => setShelfLifeUnit(e.target.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {shelfLifePresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => { setShelfLifeDays(String(preset.days)); setShelfLifeUnit("days"); }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: parseInt(shelfLifeDays) === preset.days && shelfLifeUnit === "days" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: parseInt(shelfLifeDays) === preset.days && shelfLifeUnit === "days" ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "#374151"
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Temperature */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Accelerated Aging Temperature (TAA)
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="number"
                      value={taa}
                      onChange={(e) => setTaa(parseFloat(e.target.value) || 55)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem"
                      }}
                    />
                    <span style={{ color: "#6B7280", fontWeight: "600" }}>°C</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                    {tempPresets.taa.map((temp) => (
                      <button
                        key={temp}
                        onClick={() => setTaa(temp)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: "6px",
                          border: taa === temp ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: taa === temp ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {temp}°C
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambient Temperature */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Ambient Temperature (TRT)
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="number"
                      value={trt}
                      onChange={(e) => setTrt(parseFloat(e.target.value) || 23)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem"
                      }}
                    />
                    <span style={{ color: "#6B7280", fontWeight: "600" }}>°C</span>
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                    {tempPresets.trt.map((temp) => (
                      <button
                        key={temp}
                        onClick={() => setTrt(temp)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: "6px",
                          border: trt === temp ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: trt === temp ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {temp}°C
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q10 Factor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Q10 Factor
                  </label>
                  <select
                    value={q10}
                    onChange={(e) => setQ10(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {q10Options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> ASTM F1980 recommends 55°C with Q10=2.0 as the standard approach. 
                    Do not exceed 60°C.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Accelerated Aging Time</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#166534" }}>Required Test Duration</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#16A34A" }}>
                    {aatRoundedUp} days
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#15803D" }}>
                    ({(aatRoundedUp / 7).toFixed(1)} weeks)
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Calculation Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Desired Shelf Life</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{realTimeDays} days ({formatDays(realTimeDays)})</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Test Temperature (TAA)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{taa}°C</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Ambient Temperature (TRT)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{trt}°C</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Q10 Factor</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{q10}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#EFF6FF", borderRadius: "6px", border: "1px solid #93C5FD" }}>
                      <span style={{ color: "#1E40AF" }}>Aging Factor (AF)</span>
                      <span style={{ fontWeight: "bold", color: "#2563EB" }}>{agingFactor.toFixed(3)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "6px", border: "1px solid #86EFAC" }}>
                      <span style={{ color: "#166534", fontWeight: "600" }}>AAT (rounded up)</span>
                      <span style={{ fontWeight: "bold", color: "#16A34A", fontSize: "1.1rem" }}>{aatRoundedUp} days</span>
                    </div>
                  </div>
                </div>

                {/* Formula Display */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>Formula Used:</p>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6D28D9", fontFamily: "monospace" }}>
                    AF = Q10<sup>((TAA - TRT) / 10)</sup> = {q10}<sup>(({taa} - {trt}) / 10)</sup> = {agingFactor.toFixed(3)}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9", fontFamily: "monospace" }}>
                    AAT = RT / AF = {realTimeDays} / {agingFactor.toFixed(3)} = {aatResult.toFixed(2)} → {aatRoundedUp} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reverse Calculate */}
        {activeTab === "reverse" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔄 Reverse Calculate</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* AAT Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Accelerated Aging Time (days)
                  </label>
                  <input
                    type="number"
                    value={aatInput}
                    onChange={(e) => setAatInput(e.target.value)}
                    placeholder="Enter AAT in days"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid #7C3AED",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {[20, 40, 60, 80, 100, 120].map((days) => (
                      <button
                        key={days}
                        onClick={() => setAatInput(String(days))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: aatInput === String(days) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: aatInput === String(days) ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {days} days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Temperature */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Test Temperature (TAA)
                  </label>
                  <select
                    value={taaReverse}
                    onChange={(e) => setTaaReverse(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value={50}>50°C</option>
                    <option value={55}>55°C</option>
                    <option value={60}>60°C</option>
                  </select>
                </div>

                {/* Ambient Temperature */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Ambient Temperature (TRT)
                  </label>
                  <select
                    value={trtReverse}
                    onChange={(e) => setTrtReverse(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {tempPresets.trt.map((temp) => (
                      <option key={temp} value={temp}>{temp}°C</option>
                    ))}
                  </select>
                </div>

                {/* Q10 Factor */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Q10 Factor
                  </label>
                  <select
                    value={q10Reverse}
                    onChange={(e) => setQ10Reverse(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {q10Options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Equivalent Shelf Life</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Real-Time Equivalent</p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>
                    {formatDays(reverseRealTime)}
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.95rem", color: "#6D28D9" }}>
                    ({reverseRealTime.toFixed(0)} days)
                  </p>
                </div>

                {/* Summary */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: 0, fontSize: "1rem", color: "#374151", textAlign: "center" }}>
                    <strong>{reverseAatDays} days</strong> at <strong>{taaReverse}°C</strong> = <strong>{formatDays(reverseRealTime)}</strong> real-time aging
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>AAT Input</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{reverseAatDays} days</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Aging Factor</span>
                    <span style={{ fontWeight: "600", color: "#7C3AED" }}>{reverseAgingFactor.toFixed(3)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "6px", border: "1px solid #C4B5FD" }}>
                    <span style={{ color: "#5B21B6", fontWeight: "600" }}>Real-Time</span>
                    <span style={{ fontWeight: "bold", color: "#7C3AED" }}>{reverseRealTime.toFixed(0)} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Temperature Comparison */}
        {activeTab === "compare" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Temperature Comparison</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Shelf Life Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Desired Shelf Life (days)
                  </label>
                  <input
                    type="number"
                    value={compareShelfLife}
                    onChange={(e) => setCompareShelfLife(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid #0891B2",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {shelfLifePresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setCompareShelfLife(String(preset.days))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: compareShelfLife === String(preset.days) ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: compareShelfLife === String(preset.days) ? "#ECFEFF" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambient Temperature */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Ambient Temperature (TRT)
                  </label>
                  <select
                    value={compareTrt}
                    onChange={(e) => setCompareTrt(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {tempPresets.trt.map((temp) => (
                      <option key={temp} value={temp}>{temp}°C</option>
                    ))}
                  </select>
                </div>

                {/* Q10 Factor */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Q10 Factor
                  </label>
                  <select
                    value={compareQ10}
                    onChange={(e) => setCompareQ10(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {q10Options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Info */}
                <div style={{
                  backgroundColor: "#ECFEFF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "20px",
                  border: "1px solid #67E8F9"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#0E7490" }}>
                    💡 Compare test durations at 50°C, 55°C, and 60°C to choose the optimal temperature for your study.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0E7490", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Comparison Results</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Comparison Table */}
                <div style={{ marginBottom: "20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#ECFEFF" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #0891B2" }}>Temperature</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #0891B2" }}>Aging Factor</th>
                        <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #0891B2" }}>Test Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {compareResults.map((result, index) => (
                        <tr key={result.temp} style={{ backgroundColor: index === 1 ? "#F0FDFA" : "white" }}>
                          <td style={{ padding: "14px 12px", borderBottom: "1px solid #E5E7EB" }}>
                            <span style={{ fontWeight: "600", color: "#0E7490" }}>{result.temp}°C</span>
                            {index === 1 && <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>Recommended</span>}
                          </td>
                          <td style={{ padding: "14px 12px", textAlign: "center", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                            {result.af.toFixed(2)}
                          </td>
                          <td style={{ padding: "14px 12px", textAlign: "right", borderBottom: "1px solid #E5E7EB" }}>
                            <span style={{ fontWeight: "bold", color: "#0891B2", fontSize: "1.1rem" }}>{result.aatRounded} days</span>
                            <span style={{ color: "#6B7280", fontSize: "0.85rem", marginLeft: "8px" }}>({(result.aatRounded / 7).toFixed(1)} wks)</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #5EEAD4"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#0F766E", fontWeight: "600" }}>
                    📋 Summary for {formatDays(compareRealTimeDays)} shelf life:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#0D9488" }}>
                    <li>50°C: Conservative, longer test ({compareResults[0].aatRounded} days)</li>
                    <li>55°C: Standard approach ({compareResults[1].aatRounded} days)</li>
                    <li>60°C: Maximum temp ({compareResults[2].aatRounded} days)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Common Shelf Life Test Durations (55°C, Q10=2)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Shelf Life</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Real Time (days)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>AAT at 50°C</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>AAT at 55°C</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>AAT at 60°C</th>
                </tr>
              </thead>
              <tbody>
                {shelfLifePresets.map((preset) => {
                  const af50 = calculateAgingFactor(50, 23, 2);
                  const af55 = calculateAgingFactor(55, 23, 2);
                  const af60 = calculateAgingFactor(60, 23, 2);
                  return (
                    <tr key={preset.label}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{preset.label}</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{preset.days}</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{Math.ceil(preset.days / af50)} days</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F0FDF4", fontWeight: "600", color: "#16A34A" }}>{Math.ceil(preset.days / af55)} days</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{Math.ceil(preset.days / af60)} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
              Based on ambient temperature (TRT) = 23°C and Q10 = 2.0
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🌡️ Understanding Accelerated Aging</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Accelerated aging is a validated testing method used primarily in the medical device industry to estimate 
                  how products and packaging will perform over their intended shelf life. Instead of waiting years for 
                  real-time results, manufacturers can use elevated temperatures to simulate aging in weeks or months.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Arrhenius Equation</h3>
                <p>
                  The scientific basis for accelerated aging is the <strong>Arrhenius equation</strong>, which describes 
                  how chemical reaction rates increase with temperature. For most materials, a 10°C increase in temperature 
                  approximately doubles the reaction rate. This relationship is expressed as the <strong>Q10 factor</strong>.
                </p>

                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>📐 Key Formulas</p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.95rem", color: "#2563EB", fontFamily: "monospace" }}>
                    Aging Factor (AF) = Q10<sup>((TAA - TRT) / 10)</sup>
                  </p>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#2563EB", fontFamily: "monospace" }}>
                    Accelerated Aging Time (AAT) = Desired Real Time / AF
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>ASTM F1980 Standard</h3>
                <p>
                  <strong>ASTM F1980</strong> is the industry standard guide for accelerated aging of sterile barrier systems. 
                  It provides recommendations for test temperatures (50-60°C), Q10 values (typically 2.0), and calculation methods. 
                  Regulatory bodies including the FDA and European authorities accept data generated following this standard.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Important Considerations</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Temperature limits:</strong> Never exceed 60°C as this may cause physical changes that wouldn&apos;t occur in real-time aging</li>
                  <li><strong>Humidity:</strong> Keep relative humidity below 20% to prevent material damage</li>
                  <li><strong>Real-time confirmation:</strong> Accelerated aging data should always be confirmed with parallel real-time studies</li>
                  <li><strong>Material compatibility:</strong> Some materials may require lower temperatures or different Q10 values</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Q10 Reference */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📊 Q10 Values</h3>
              <div style={{ fontSize: "0.9rem", color: "#2563EB", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Q10 = 2.0:</strong> Industry standard</p>
                <p style={{ margin: 0 }}><strong>Q10 = 1.8:</strong> More conservative</p>
                <p style={{ margin: 0 }}><strong>Q10 = 2.5:</strong> Less conservative</p>
              </div>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#3B82F6" }}>
                Higher Q10 = shorter test time but less conservative
              </p>
            </div>

            {/* Temperature Guide */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>🌡️ Temperature Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>50°C - Conservative</p>
                <p style={{ margin: 0 }}>55°C - Standard ⭐</p>
                <p style={{ margin: 0 }}>60°C - Maximum</p>
              </div>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#D97706" }}>
                ⚠️ Never exceed 60°C
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/accelerated-aging-calculator" currentCategory="Science" />
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
            🌡️ <strong>Disclaimer:</strong> This calculator is for estimation purposes only and follows ASTM F1980 guidelines. 
            Actual test protocols should be validated by qualified professionals. Accelerated aging data should always be 
            confirmed with real-time aging studies. Consult with regulatory experts for specific compliance requirements.
          </p>
        </div>
      </div>
    </div>
  );
}