"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Pool shape types
type PoolShape = "rectangular" | "circular" | "oval";

// Tab types
type TabType = "calculator" | "volume";

// Common pool sizes for quick reference
const saltChart = [
  { volume: 5000, current: 0, target: 3200 },
  { volume: 10000, current: 0, target: 3200 },
  { volume: 15000, current: 0, target: 3200 },
  { volume: 20000, current: 0, target: 3200 },
  { volume: 25000, current: 0, target: 3200 },
  { volume: 30000, current: 0, target: 3200 },
];

// FAQ data
const faqs = [
  {
    question: "How many 40lb bags of salt do I need for my pool?",
    answer: "The number of 40lb bags depends on your pool size and current salt level. For a typical 15,000-gallon pool with 0 ppm salt, you need about 400 lbs (10 bags of 40lb) to reach the ideal 3200 ppm. Use our calculator above to get the exact amount for your pool. As a quick rule: you need about 30 lbs of salt per 1,000 gallons to raise the level by approximately 1,000 ppm."
  },
  {
    question: "How to calculate how much salt a pool needs?",
    answer: "Use this formula: Salt Needed (lbs) = ((Target PPM - Current PPM) × Pool Volume (gallons) × 8.34) / 1,000,000. For example, a 15,000-gallon pool going from 0 to 3200 ppm: (3200 × 15000 × 8.34) / 1,000,000 = 400 lbs. Our calculator does this math instantly for you."
  },
  {
    question: "How much does 1 bag of salt raise ppm?",
    answer: "One 40lb bag of pool salt raises approximately 480 ppm in a 10,000-gallon pool, 320 ppm in a 15,000-gallon pool, or 240 ppm in a 20,000-gallon pool. The effect varies inversely with pool size - larger pools need more salt for the same ppm increase."
  },
  {
    question: "What is the ideal salt level for a saltwater pool?",
    answer: "The ideal salt level for most saltwater pools is between 2700-3400 ppm (parts per million), with 3200 ppm being optimal for most salt chlorine generators. This range ensures efficient chlorine production while maintaining comfortable swimming conditions. Always check your specific salt chlorinator's manual as some systems may have different requirements."
  },
  {
    question: "How long after adding salt can you swim?",
    answer: "You can typically swim 24 hours after adding salt, once it has fully dissolved and circulated throughout the pool. Run your pump continuously during this time. If the salt hasn't fully dissolved, it might irritate your skin and eyes. Always test the water chemistry before swimming to ensure proper balance."
  },
  {
    question: "What happens if pool salt is too high?",
    answer: "Excessively high salt levels (above 4000 ppm) can cause salty-tasting water, eye and skin irritation, corrosion of metal pool equipment (ladders, handrails), and may damage your salt chlorine generator. The only way to lower salt levels is to partially drain the pool and refill with fresh water."
  },
  {
    question: "What is the downside of a salt water pool?",
    answer: "Salt water pools have higher upfront costs ($1,000-$2,500 for the salt system), require cell replacement every 3-7 years ($200-$900), can corrode nearby metal fixtures and concrete, and may void warranties on some pool equipment. However, they offer lower long-term chemical costs and gentler water on skin and eyes."
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

// Get salt level status
function getSaltStatus(ppm: number): { label: string; color: string; bg: string } {
  if (ppm < 2700) return { label: "Too Low", color: "#DC2626", bg: "#FEF2F2" };
  if (ppm <= 3400) return { label: "Ideal", color: "#059669", bg: "#ECFDF5" };
  if (ppm <= 4000) return { label: "Slightly High", color: "#F59E0B", bg: "#FEF3C7" };
  return { label: "Too High", color: "#DC2626", bg: "#FEF2F2" };
}

// Calculate salt needed
function calculateSalt(volumeGal: number, currentPPM: number, targetPPM: number) {
  if (currentPPM >= targetPPM) {
    // Need to dilute - calculate water to replace
    const waterToReplace = volumeGal * (1 - targetPPM / currentPPM);
    return {
      needsMoreSalt: false,
      saltLbs: 0,
      saltKg: 0,
      bags40lb: 0,
      bags50lb: 0,
      waterToReplace: Math.round(waterToReplace),
    };
  }
  
  // Need to add salt
  const saltLbs = ((targetPPM - currentPPM) * volumeGal * 8.34) / 1000000;
  const saltKg = saltLbs * 0.453592;
  
  return {
    needsMoreSalt: true,
    saltLbs: Math.round(saltLbs),
    saltKg: Math.round(saltKg),
    bags40lb: Math.ceil(saltLbs / 40),
    bags50lb: Math.ceil(saltLbs / 50),
    waterToReplace: 0,
  };
}

// Calculate pool volume
function calculatePoolVolume(shape: PoolShape, length: number, width: number, depth: number, unit: "feet" | "meters"): number {
  // Convert to feet if in meters
  const l = unit === "meters" ? length * 3.28084 : length;
  const w = unit === "meters" ? width * 3.28084 : width;
  const d = unit === "meters" ? depth * 3.28084 : depth;
  
  switch (shape) {
    case "rectangular":
      return l * w * d * 7.5;
    case "circular":
      // For circular, 'length' is diameter
      const radius = l / 2;
      return Math.PI * radius * radius * d * 7.5;
    case "oval":
      return l * w * d * 5.9;
    default:
      return 0;
  }
}

export default function SaltPoolCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("calculator");
  
  // Salt Calculator inputs
  const [poolVolume, setPoolVolume] = useState<string>("15000");
  const [volumeUnit, setVolumeUnit] = useState<"gallons" | "liters">("gallons");
  const [currentSalt, setCurrentSalt] = useState<string>("0");
  const [targetSalt, setTargetSalt] = useState<string>("3200");
  
  // Pool Volume Calculator inputs
  const [poolShape, setPoolShape] = useState<PoolShape>("rectangular");
  const [poolLength, setPoolLength] = useState<string>("30");
  const [poolWidth, setPoolWidth] = useState<string>("15");
  const [poolDepth, setPoolDepth] = useState<string>("5");
  const [dimensionUnit, setDimensionUnit] = useState<"feet" | "meters">("feet");
  
  // Results
  const [saltResults, setSaltResults] = useState({
    needsMoreSalt: true,
    saltLbs: 400,
    saltKg: 181,
    bags40lb: 10,
    bags50lb: 8,
    waterToReplace: 0,
  });
  
  const [volumeResults, setVolumeResults] = useState({
    gallons: 16875,
    liters: 63879,
  });

  // Calculate salt results
  useEffect(() => {
    const volume = parseFloat(poolVolume) || 0;
    const volumeInGallons = volumeUnit === "liters" ? volume * 0.264172 : volume;
    const current = parseFloat(currentSalt) || 0;
    const target = parseFloat(targetSalt) || 3200;
    
    const results = calculateSalt(volumeInGallons, current, target);
    setSaltResults(results);
  }, [poolVolume, volumeUnit, currentSalt, targetSalt]);

  // Calculate volume results
  useEffect(() => {
    const length = parseFloat(poolLength) || 0;
    const width = parseFloat(poolWidth) || 0;
    const depth = parseFloat(poolDepth) || 0;
    
    const gallons = calculatePoolVolume(poolShape, length, width, depth, dimensionUnit);
    const liters = gallons * 3.78541;
    
    setVolumeResults({
      gallons: Math.round(gallons),
      liters: Math.round(liters),
    });
  }, [poolShape, poolLength, poolWidth, poolDepth, dimensionUnit]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Use calculated volume in salt calculator
  const useCalculatedVolume = () => {
    setPoolVolume(volumeResults.gallons.toString());
    setVolumeUnit("gallons");
    setActiveTab("calculator");
  };

  const currentStatus = getSaltStatus(parseFloat(currentSalt) || 0);
  const targetStatus = getSaltStatus(parseFloat(targetSalt) || 3200);

  // Calculate chart data
  const getChartData = (volume: number) => {
    const result = calculateSalt(volume, 0, 3200);
    return result;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Salt Pool Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏊</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Salt Pool Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much salt your pool needs to reach the ideal salinity level. Get results in pounds, kilograms, and number of bags.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Quick Answer</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                For a typical 15,000-gallon pool with 0 ppm salt, you need about <strong>400 lbs of salt (10 bags of 40lb)</strong> to reach the ideal 3200 ppm. Use the calculator below for your exact requirements.
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
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setActiveTab("calculator")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "calculator" ? "white" : "#F9FAFB",
                borderBottom: activeTab === "calculator" ? "3px solid #0EA5E9" : "3px solid transparent",
                color: activeTab === "calculator" ? "#0EA5E9" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🧂 Salt Calculator
            </button>
            <button
              onClick={() => setActiveTab("volume")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "volume" ? "white" : "#F9FAFB",
                borderBottom: activeTab === "volume" ? "3px solid #0EA5E9" : "3px solid transparent",
                color: activeTab === "volume" ? "#0EA5E9" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              📐 Pool Volume Calculator
            </button>
          </div>

          <div style={{ padding: "32px" }}>
            {/* Salt Calculator Tab */}
            {activeTab === "calculator" && (
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div>
                  {/* Pool Volume */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      🏊 Pool Information
                    </h3>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Pool Volume
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <input
                          type="number"
                          value={poolVolume}
                          onChange={(e) => setPoolVolume(e.target.value)}
                          style={{
                            flex: "1",
                            minWidth: "120px",
                            padding: "10px 12px",
                            border: "2px solid #E5E7EB",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "600"
                          }}
                          min="0"
                          step="100"
                        />
                        <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                          <button
                            onClick={() => setVolumeUnit("gallons")}
                            style={{
                              padding: "10px 14px",
                              border: "none",
                              backgroundColor: volumeUnit === "gallons" ? "#0EA5E9" : "white",
                              color: volumeUnit === "gallons" ? "white" : "#374151",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            Gallons
                          </button>
                          <button
                            onClick={() => setVolumeUnit("liters")}
                            style={{
                              padding: "10px 14px",
                              border: "none",
                              borderLeft: "1px solid #E5E7EB",
                              backgroundColor: volumeUnit === "liters" ? "#0EA5E9" : "white",
                              color: volumeUnit === "liters" ? "white" : "#374151",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            Liters
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                        Don&apos;t know your pool volume? Use the <button onClick={() => setActiveTab("volume")} style={{ color: "#0EA5E9", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, font: "inherit" }}>Pool Volume Calculator</button>
                      </p>
                    </div>
                  </div>

                  {/* Salt Levels */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      🧂 Salt Levels
                    </h3>

                    {/* Current Salt Level */}
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Current Salt Level (ppm)
                      </label>
                      <input
                        type="number"
                        value={currentSalt}
                        onChange={(e) => setCurrentSalt(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        max="10000"
                        step="100"
                        placeholder="0"
                      />
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                        Test with salt strips or digital meter. Enter 0 for new pools.
                      </p>
                    </div>

                    {/* Target Salt Level */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Target Salt Level (ppm)
                      </label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[2700, 3000, 3200, 3400].map((ppm) => (
                          <button
                            key={ppm}
                            onClick={() => setTargetSalt(ppm.toString())}
                            style={{
                              padding: "10px 16px",
                              borderRadius: "8px",
                              border: targetSalt === ppm.toString() ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                              backgroundColor: targetSalt === ppm.toString() ? "#E0F2FE" : "white",
                              color: targetSalt === ppm.toString() ? "#0284C7" : "#374151",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "0.9rem"
                            }}
                          >
                            {ppm}
                          </button>
                        ))}
                        <input
                          type="number"
                          value={targetSalt}
                          onChange={(e) => setTargetSalt(e.target.value)}
                          style={{
                            width: "80px",
                            padding: "10px 12px",
                            border: "2px solid #E5E7EB",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "600",
                            textAlign: "center"
                          }}
                          min="2000"
                          max="5000"
                          step="100"
                        />
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                        Ideal range: 2700-3400 ppm. Most systems work best at 3200 ppm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="calc-results">
                  {saltResults.needsMoreSalt ? (
                    <>
                      {/* Salt to Add */}
                      <div style={{
                        backgroundColor: "#0EA5E9",
                        padding: "24px",
                        borderRadius: "12px",
                        textAlign: "center",
                        marginBottom: "20px"
                      }}>
                        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                          Salt to Add
                        </p>
                        <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                          {formatNumber(saltResults.saltLbs)} lbs
                        </p>
                        <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                          ({formatNumber(saltResults.saltKg)} kg)
                        </p>
                      </div>

                      {/* Bags Needed */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                        <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>40 lb Bags</p>
                          <p style={{ fontSize: "1.75rem", fontWeight: "700", color: "#059669", margin: 0 }}>
                            {saltResults.bags40lb}
                          </p>
                        </div>
                        <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>50 lb Bags</p>
                          <p style={{ fontSize: "1.75rem", fontWeight: "700", color: "#0369A1", margin: 0 }}>
                            {saltResults.bags50lb}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Water to Replace */}
                      <div style={{
                        backgroundColor: "#F59E0B",
                        padding: "24px",
                        borderRadius: "12px",
                        textAlign: "center",
                        marginBottom: "20px"
                      }}>
                        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.9)", marginBottom: "4px" }}>
                          ⚠️ Salt Level Too High
                        </p>
                        <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", margin: "0 0 8px 0" }}>
                          Replace {formatNumber(saltResults.waterToReplace)} gallons
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                          Drain and refill with fresh water
                        </p>
                      </div>
                    </>
                  )}

                  {/* Salt Level Status */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ backgroundColor: currentStatus.bg, padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Current Level</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "700", color: currentStatus.color, margin: 0 }}>
                        {formatNumber(parseFloat(currentSalt) || 0)} ppm
                      </p>
                      <p style={{ fontSize: "0.7rem", color: currentStatus.color, margin: "4px 0 0 0" }}>
                        {currentStatus.label}
                      </p>
                    </div>
                    <div style={{ backgroundColor: targetStatus.bg, padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Target Level</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "700", color: targetStatus.color, margin: 0 }}>
                        {formatNumber(parseFloat(targetSalt) || 3200)} ppm
                      </p>
                      <p style={{ fontSize: "0.7rem", color: targetStatus.color, margin: "4px 0 0 0" }}>
                        {targetStatus.label}
                      </p>
                    </div>
                  </div>

                  {/* Calculation Formula */}
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                    <h4 style={{ fontWeight: "600", color: "#0369A1", marginBottom: "12px", fontSize: "0.9rem" }}>
                      📊 Calculation Formula
                    </h4>
                    <div style={{ fontSize: "0.85rem", color: "#0C4A6E" }}>
                      <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", backgroundColor: "#E0F2FE", padding: "8px", borderRadius: "4px" }}>
                        Salt (lbs) = (Target - Current) × Volume × 8.34 / 1,000,000
                      </p>
                      <p style={{ margin: "0 0 6px 0" }}>
                        ({formatNumber(parseFloat(targetSalt) || 3200)} - {formatNumber(parseFloat(currentSalt) || 0)}) × {formatNumber(volumeUnit === "liters" ? Math.round((parseFloat(poolVolume) || 0) * 0.264172) : parseFloat(poolVolume) || 0)} × 8.34 / 1,000,000
                      </p>
                      <p style={{ margin: 0, fontWeight: "600" }}>
                        = <span style={{ color: "#0EA5E9" }}>{formatNumber(saltResults.saltLbs)} lbs</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pool Volume Calculator Tab */}
            {activeTab === "volume" && (
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div>
                  {/* Pool Shape */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      📐 Pool Shape
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <button
                        onClick={() => setPoolShape("rectangular")}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "8px",
                          border: poolShape === "rectangular" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: poolShape === "rectangular" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>▭</div>
                        <p style={{ fontWeight: "600", color: poolShape === "rectangular" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          Rectangular
                        </p>
                      </button>
                      <button
                        onClick={() => setPoolShape("circular")}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "8px",
                          border: poolShape === "circular" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: poolShape === "circular" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>○</div>
                        <p style={{ fontWeight: "600", color: poolShape === "circular" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          Circular
                        </p>
                      </button>
                      <button
                        onClick={() => setPoolShape("oval")}
                        style={{
                          padding: "16px 8px",
                          borderRadius: "8px",
                          border: poolShape === "oval" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: poolShape === "oval" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>⬭</div>
                        <p style={{ fontWeight: "600", color: poolShape === "oval" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          Oval
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", fontSize: "1.1rem", margin: 0 }}>
                        📏 Dimensions
                      </h3>
                      <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                        <button
                          onClick={() => setDimensionUnit("feet")}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            backgroundColor: dimensionUnit === "feet" ? "#0EA5E9" : "white",
                            color: dimensionUnit === "feet" ? "white" : "#374151",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Feet
                        </button>
                        <button
                          onClick={() => setDimensionUnit("meters")}
                          style={{
                            padding: "6px 12px",
                            border: "none",
                            borderLeft: "1px solid #E5E7EB",
                            backgroundColor: dimensionUnit === "meters" ? "#0EA5E9" : "white",
                            color: dimensionUnit === "meters" ? "white" : "#374151",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Meters
                        </button>
                      </div>
                    </div>

                    {/* Length / Diameter */}
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        {poolShape === "circular" ? "Diameter" : "Length"} ({dimensionUnit})
                      </label>
                      <input
                        type="number"
                        value={poolLength}
                        onChange={(e) => setPoolLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        step="0.5"
                      />
                    </div>

                    {/* Width (not for circular) */}
                    {poolShape !== "circular" && (
                      <div style={{ marginBottom: "12px" }}>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                          Width ({dimensionUnit})
                        </label>
                        <input
                          type="number"
                          value={poolWidth}
                          onChange={(e) => setPoolWidth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "2px solid #E5E7EB",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "600"
                          }}
                          min="0"
                          step="0.5"
                        />
                      </div>
                    )}

                    {/* Average Depth */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Average Depth ({dimensionUnit})
                      </label>
                      <input
                        type="number"
                        value={poolDepth}
                        onChange={(e) => setPoolDepth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        step="0.5"
                      />
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                        Average depth = (Shallow end + Deep end) ÷ 2
                      </p>
                    </div>
                  </div>
                </div>

                {/* Volume Results */}
                <div className="calc-results">
                  {/* Volume Result */}
                  <div style={{
                    backgroundColor: "#0EA5E9",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                      Pool Volume
                    </p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                      {formatNumber(volumeResults.gallons)}
                    </p>
                    <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                      gallons
                    </p>
                  </div>

                  {/* Liters */}
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Also equals</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0369A1", margin: 0 }}>
                      {formatNumber(volumeResults.liters)} liters
                    </p>
                  </div>

                  {/* Use in Calculator Button */}
                  <button
                    onClick={useCalculatedVolume}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "#059669",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "1rem",
                      cursor: "pointer",
                      marginBottom: "20px"
                    }}
                  >
                    ✓ Use {formatNumber(volumeResults.gallons)} gallons in Salt Calculator
                  </button>

                  {/* Formula Used */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.9rem" }}>
                      Formula Used
                    </h4>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                      {poolShape === "rectangular" && (
                        <p style={{ margin: 0 }}>Length × Width × Depth × 7.5</p>
                      )}
                      {poolShape === "circular" && (
                        <p style={{ margin: 0 }}>π × (Diameter/2)² × Depth × 7.5</p>
                      )}
                      {poolShape === "oval" && (
                        <p style={{ margin: 0 }}>Length × Width × Depth × 5.9</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Salt Amount Chart */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Pool Salt Chart
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Quick reference: Salt needed to reach 3200 ppm from 0 ppm (new pool or fresh water)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Pool Size (gallons)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Salt Needed (lbs)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Salt Needed (kg)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>40 lb Bags</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#E0F2FE" }}>50 lb Bags</th>
                </tr>
              </thead>
              <tbody>
                {saltChart.map((row, index) => {
                  const data = getChartData(row.volume);
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                        {formatNumber(row.volume)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        {formatNumber(data.saltLbs)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        {formatNumber(data.saltKg)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>
                        {data.bags40lb}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0369A1", fontWeight: "600" }}>
                        {data.bags50lb}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Salt Level Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🧂 Salt Level Guide
              </h2>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
                  <div style={{ width: "100px", textAlign: "center", fontWeight: "700", color: "#DC2626" }}>Below 2700</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>Too Low</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Insufficient chlorine production</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <div style={{ width: "100px", textAlign: "center", fontWeight: "700", color: "#059669" }}>2700-3400</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#059669" }}>Ideal Range</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Optimal chlorine generation</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <div style={{ width: "100px", textAlign: "center", fontWeight: "700", color: "#F59E0B" }}>3400-4000</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#F59E0B" }}>Slightly High</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Still acceptable, monitor closely</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
                  <div style={{ width: "100px", textAlign: "center", fontWeight: "700", color: "#DC2626" }}>Above 4000</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>Too High</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - May damage equipment, dilute needed</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                  <strong>💡 Tip:</strong> Most salt chlorine generators work best at 3200 ppm. Check your system&apos;s manual for specific recommendations.
                </p>
              </div>
            </div>

            {/* How to Add Salt */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 How to Add Salt to Your Pool
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Test Current Salt Level</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Use salt test strips or a digital salt meter for accurate readings
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Salt Needed</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Use the calculator above to determine exact amount
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Distribute Evenly</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Walk around the pool pouring salt evenly along the edges
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Run the Pump</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Circulate water for 24 hours to dissolve and distribute salt
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>5</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Retest and Adjust</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Test again after 24 hours and add more if needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 Quick Facts
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 2px 0" }}>Ideal Salt Level</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>3,200 ppm</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 2px 0" }}>Acceptable Range</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>2,700 - 3,400 ppm</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 2px 0" }}>Salt per 1000 gal</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>~30 lbs (for 1000 ppm)</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 2px 0" }}>Dissolve Time</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>24 hours</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "#F0F9FF",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #BAE6FD"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0369A1", marginBottom: "12px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#0C4A6E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Use pool-grade salt only (99% pure NaCl)</li>
                <li style={{ marginBottom: "8px" }}>Don&apos;t pour salt directly into skimmer</li>
                <li style={{ marginBottom: "8px" }}>Add salt when water is warm for faster dissolving</li>
                <li style={{ marginBottom: "8px" }}>Brush pool floor to help salt dissolve</li>
                <li>Salt doesn&apos;t evaporate - only dilution lowers it</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/salt-pool-calculator"
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
            🏊 <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas. Actual salt requirements may vary based on your specific salt chlorinator model, water chemistry, and environmental factors. Always test your water before and after adding salt, and consult your equipment manual for manufacturer recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}