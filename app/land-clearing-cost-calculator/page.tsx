"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Cost rates per acre by land type
const landTypes = {
  brush: { 
    label: "Brush Only", 
    description: "Grass, shrubs, weeds, light vegetation",
    costLow: 200, 
    costHigh: 800,
    icon: "🌿"
  },
  light: { 
    label: "Lightly Wooded", 
    description: "Few small trees, scattered vegetation",
    costLow: 500, 
    costHigh: 2500,
    icon: "🌳"
  },
  moderate: { 
    label: "Moderately Wooded", 
    description: "Mix of small and medium trees",
    costLow: 1500, 
    costHigh: 4000,
    icon: "🌲🌳"
  },
  heavy: { 
    label: "Heavily Wooded", 
    description: "Dense large trees, thick underbrush",
    costLow: 3000, 
    costHigh: 6500,
    icon: "🌲🌲🌲"
  },
};

// Terrain multipliers
const terrainTypes = {
  flat: { label: "Flat", multiplier: 1.0, description: "Level ground, easy access" },
  sloped: { label: "Sloped", multiplier: 1.25, description: "Hills, moderate grade (+25%)" },
  steep: { label: "Steep/Rocky", multiplier: 1.5, description: "Steep terrain, rocks (+50%)" },
};

// Additional services
const additionalServices = {
  stumpRemoval: { label: "Stump Removal", costPer: 150, unit: "per stump (est.)", estimate: true },
  grading: { label: "Land Grading", costLow: 1000, costHigh: 5000, unit: "flat fee" },
  debris: { label: "Debris Hauling", costLow: 100, costHigh: 800, unit: "flat fee" },
  permit: { label: "Permit", costLow: 200, costHigh: 300, unit: "flat fee" },
};

// Clearing methods (per acre)
const clearingMethods = {
  mulching: { label: "Forestry Mulching", costLow: 400, costHigh: 600, description: "Best for brush & small trees" },
  bulldozer: { label: "Bulldozer", costLow: 1200, costHigh: 2000, description: "Fast, good for mixed terrain" },
  excavator: { label: "Excavator", costLow: 900, costHigh: 1800, description: "Stumps, rocks, precision work" },
};

// Quick reference data
const quickReference = [
  { area: 0.25, label: "¼ Acre" },
  { area: 0.5, label: "½ Acre" },
  { area: 1, label: "1 Acre" },
  { area: 2, label: "2 Acres" },
  { area: 5, label: "5 Acres" },
  { area: 10, label: "10 Acres" },
];

// FAQ data
const faqs = [
  {
    question: "How do you price land clearing?",
    answer: "Land clearing is typically priced per acre, with costs ranging from $200-$800 for brush-only land to $3,000-$6,500 for heavily wooded areas. Factors affecting price include vegetation density, terrain difficulty, accessibility, stump removal needs, and debris disposal method. Most contractors provide quotes based on a site visit to assess these factors accurately."
  },
  {
    question: "How much to charge per acre for clearing?",
    answer: "Professional land clearing services typically charge: $200-$800/acre for brush clearing, $500-$2,500/acre for lightly wooded land, $1,500-$4,000/acre for moderately wooded areas, and $3,000-$6,500/acre for heavily forested land. Additional charges apply for steep terrain (+25-50%), stump removal ($100-$400 each), and debris hauling ($100-$800)."
  },
  {
    question: "How much does a permit cost to clear land?",
    answer: "Land clearing permits typically cost $200-$300, though this varies by location and project scope. Some jurisdictions require additional permits for tree removal ($50-$150 per tree), grading ($100-$500), or environmental impact assessments ($500-$2,000). Always check with your local building department before starting work."
  },
  {
    question: "How much do you get paid to clear land?",
    answer: "Land clearing contractors earn $110-$250 per hour for equipment operation. A typical crew clearing 1 acre of moderately wooded land in 6-8 hours earns $1,500-$4,000. Equipment owners earn more due to the capital investment in bulldozers ($150-$250/hour) and mulchers ($150-$300/hour). Annual earnings for established operations range from $50,000 to $200,000+."
  },
  {
    question: "What is the cheapest way to clear land?",
    answer: "The cheapest methods include: (1) Renting goats for brush clearing ($400-$800/acre), (2) DIY with chainsaw and brush cutter for small areas ($200-$500 in rental/equipment), (3) Forestry mulching for mixed vegetation ($400-$600/acre), or (4) Selling timber if you have valuable trees, which can offset or even cover clearing costs."
  },
  {
    question: "How long does it take to clear 1 acre of land?",
    answer: "Clearing time varies by vegetation density: Brush-only land takes 2-4 hours, lightly wooded areas take 4-6 hours, moderately wooded land takes 6-10 hours, and heavily forested areas take 8-16+ hours. These times assume professional equipment. DIY clearing takes significantly longer—often 2-5x the professional time."
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

export default function LandClearingCostCalculator() {
  // Input mode
  const [inputMode, setInputMode] = useState<"acres" | "sqft">("acres");
  
  // Inputs
  const [acres, setAcres] = useState<string>("1");
  const [sqft, setSqft] = useState<string>("43560");
  const [landType, setLandType] = useState<keyof typeof landTypes>("moderate");
  const [terrain, setTerrain] = useState<keyof typeof terrainTypes>("flat");
  
  // Additional services
  const [includeStumps, setIncludeStumps] = useState(false);
  const [includeGrading, setIncludeGrading] = useState(false);
  const [includeDebris, setIncludeDebris] = useState(false);
  const [includePermit, setIncludePermit] = useState(false);
  
  // Results
  const [results, setResults] = useState({
    area: 0,
    baseCostLow: 0,
    baseCostHigh: 0,
    terrainAdjustmentLow: 0,
    terrainAdjustmentHigh: 0,
    additionalLow: 0,
    additionalHigh: 0,
    totalLow: 0,
    totalHigh: 0,
    estimatedStumps: 0,
  });

  // Calculate
  useEffect(() => {
    // Get area in acres
    let areaInAcres: number;
    if (inputMode === "acres") {
      areaInAcres = parseFloat(acres) || 0;
    } else {
      areaInAcres = (parseFloat(sqft) || 0) / 43560;
    }
    
    const land = landTypes[landType];
    const terrainMult = terrainTypes[terrain].multiplier;
    
    // Base cost
    const baseLow = areaInAcres * land.costLow;
    const baseHigh = areaInAcres * land.costHigh;
    
    // Terrain adjustment
    const terrainAdjLow = baseLow * (terrainMult - 1);
    const terrainAdjHigh = baseHigh * (terrainMult - 1);
    
    // Additional services
    let addLow = 0;
    let addHigh = 0;
    
    // Estimate stumps based on land type and area
    let estStumps = 0;
    if (landType === "light") estStumps = Math.ceil(areaInAcres * 10);
    else if (landType === "moderate") estStumps = Math.ceil(areaInAcres * 25);
    else if (landType === "heavy") estStumps = Math.ceil(areaInAcres * 50);
    
    if (includeStumps && estStumps > 0) {
      addLow += estStumps * 100;
      addHigh += estStumps * 400;
    }
    
    if (includeGrading) {
      addLow += additionalServices.grading.costLow;
      addHigh += additionalServices.grading.costHigh;
    }
    
    if (includeDebris) {
      addLow += additionalServices.debris.costLow;
      addHigh += additionalServices.debris.costHigh;
    }
    
    if (includePermit) {
      addLow += additionalServices.permit.costLow;
      addHigh += additionalServices.permit.costHigh;
    }
    
    // Total
    const totalLow = (baseLow * terrainMult) + addLow;
    const totalHigh = (baseHigh * terrainMult) + addHigh;
    
    setResults({
      area: areaInAcres,
      baseCostLow: baseLow,
      baseCostHigh: baseHigh,
      terrainAdjustmentLow: terrainAdjLow,
      terrainAdjustmentHigh: terrainAdjHigh,
      additionalLow: addLow,
      additionalHigh: addHigh,
      totalLow,
      totalHigh,
      estimatedStumps: estStumps,
    });
  }, [acres, sqft, inputMode, landType, terrain, includeStumps, includeGrading, includeDebris, includePermit]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Land Clearing Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚜</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Land Clearing Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the cost to clear your land for construction, farming, or landscaping. Get instant pricing based on acreage, vegetation density, and terrain.
          </p>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #FDE68A",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>💰</span>
          <div>
            <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
              2025-2026 Average Costs
            </p>
            <p style={{ fontSize: "0.875rem", color: "#A16207", margin: 0 }}>
              Brush: $200-$800/acre | Light Woods: $500-$2,500/acre | Heavy Woods: $3,000-$6,500/acre
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📐 Property Details
                </h3>

                {/* Area Input Mode */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Area Size
                  </label>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <button
                      onClick={() => setInputMode("acres")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: inputMode === "acres" ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "acres" ? "#FFF7ED" : "white",
                        color: inputMode === "acres" ? "#EA580C" : "#6B7280",
                        fontWeight: inputMode === "acres" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      Acres
                    </button>
                    <button
                      onClick={() => setInputMode("sqft")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: inputMode === "sqft" ? "2px solid #EA580C" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "sqft" ? "#FFF7ED" : "white",
                        color: inputMode === "sqft" ? "#EA580C" : "#6B7280",
                        fontWeight: inputMode === "sqft" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      Square Feet
                    </button>
                  </div>
                  
                  {inputMode === "acres" ? (
                    <>
                      <input
                        type="number"
                        value={acres}
                        onChange={(e) => setAcres(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        step="0.25"
                        placeholder="1"
                      />
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                        {["0.25", "0.5", "1", "2", "5"].map((val) => (
                          <button
                            key={val}
                            onClick={() => setAcres(val)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: "6px",
                              border: acres === val ? "2px solid #EA580C" : "1px solid #E5E7EB",
                              backgroundColor: acres === val ? "#FFF7ED" : "white",
                              color: acres === val ? "#EA580C" : "#6B7280",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {val} acre{parseFloat(val) !== 1 ? "s" : ""}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      placeholder="43560"
                    />
                  )}
                </div>

                {/* Land Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Vegetation Type
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {(Object.keys(landTypes) as Array<keyof typeof landTypes>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setLandType(key)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: landType === key ? "2px solid #EA580C" : "1px solid #E5E7EB",
                          backgroundColor: landType === key ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{landTypes[key].icon}</span>
                            <div>
                              <span style={{ fontWeight: "600", color: landType === key ? "#EA580C" : "#374151", fontSize: "0.9rem" }}>
                                {landTypes[key].label}
                              </span>
                              <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                                {landTypes[key].description}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: landType === key ? "#EA580C" : "#9CA3AF", fontWeight: "600" }}>
                            ${landTypes[key].costLow}-${landTypes[key].costHigh}/ac
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terrain */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Terrain
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    {(Object.keys(terrainTypes) as Array<keyof typeof terrainTypes>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setTerrain(key)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: terrain === key ? "2px solid #EA580C" : "1px solid #E5E7EB",
                          backgroundColor: terrain === key ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <span style={{ fontWeight: "600", color: terrain === key ? "#EA580C" : "#374151", fontSize: "0.85rem" }}>
                          {terrainTypes[key].label}
                        </span>
                        {key !== "flat" && (
                          <p style={{ fontSize: "0.7rem", color: "#DC2626", margin: "2px 0 0 0", fontWeight: "600" }}>
                            +{Math.round((terrainTypes[key].multiplier - 1) * 100)}%
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Services */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Additional Services
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {[
                      { key: "stumps", label: "Stump Removal", checked: includeStumps, setter: setIncludeStumps, cost: `~${results.estimatedStumps} stumps est.` },
                      { key: "grading", label: "Land Grading", checked: includeGrading, setter: setIncludeGrading, cost: "$1,000-$5,000" },
                      { key: "debris", label: "Debris Hauling", checked: includeDebris, setter: setIncludeDebris, cost: "$100-$800" },
                      { key: "permit", label: "Permit", checked: includePermit, setter: setIncludePermit, cost: "$200-$300" },
                    ].map((service) => (
                      <label
                        key={service.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          backgroundColor: service.checked ? "#FFF7ED" : "white",
                          border: service.checked ? "2px solid #EA580C" : "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            checked={service.checked}
                            onChange={(e) => service.setter(e.target.checked)}
                            style={{ width: "18px", height: "18px", accentColor: "#EA580C" }}
                          />
                          <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>{service.label}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{service.cost}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div style={{ backgroundColor: "#FFF7ED", padding: "24px", borderRadius: "12px", border: "2px solid #FED7AA" }}>
                <h3 style={{ fontWeight: "600", color: "#9A3412", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💰 Estimated Cost
                </h3>

                {/* Area Display */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 4px 0" }}>Area to Clear</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                    {results.area.toFixed(2)} acres ({formatNumber(results.area * 43560)} sq ft)
                  </p>
                </div>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#EA580C",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                    Total Estimated Cost
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "white", margin: 0 }}>
                    {formatCurrency(results.totalLow)} - {formatCurrency(results.totalHigh)}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "8px" }}>
                    {landTypes[landType].label} • {terrainTypes[terrain].label} terrain
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "12px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Base Clearing</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>
                      {formatCurrency(results.baseCostLow)} - {formatCurrency(results.baseCostHigh)}
                    </span>
                  </div>

                  {terrain !== "flat" && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Terrain Adjustment</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>
                        +{formatCurrency(results.terrainAdjustmentLow)} - {formatCurrency(results.terrainAdjustmentHigh)}
                      </span>
                    </div>
                  )}

                  {results.additionalLow > 0 && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Additional Services</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>
                        +{formatCurrency(results.additionalLow)} - {formatCurrency(results.additionalHigh)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Per Unit Costs */}
                <div style={{ padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#065F46", margin: 0 }}>
                    <strong>Per Square Foot:</strong> ${(results.totalLow / (results.area * 43560) || 0).toFixed(2)} - ${(results.totalHigh / (results.area * 43560) || 0).toFixed(2)}
                  </p>
                </div>

                {/* Clearing Methods Comparison */}
                <div style={{ padding: "14px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151", marginBottom: "10px" }}>
                    Cost by Clearing Method (per acre):
                  </p>
                  {Object.entries(clearingMethods).map(([key, method]) => (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{method.label}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                        {formatCurrency(method.costLow * results.area)} - {formatCurrency(method.costHigh * results.area)}
                      </span>
                    </div>
                  ))}
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
            📊 Land Clearing Cost Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Estimated costs by property size and vegetation type (flat terrain)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Area</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>Brush Only</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>Lightly Wooded</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEE2E2" }}>Heavily Wooded</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.label}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>
                      {formatCurrency(row.area * 200)} - {formatCurrency(row.area * 800)}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706" }}>
                      {formatCurrency(row.area * 500)} - {formatCurrency(row.area * 2500)}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>
                      {formatCurrency(row.area * 3000)} - {formatCurrency(row.area * 6500)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Add 25% for sloped terrain, 50% for steep/rocky terrain. Prices do not include stump removal, grading, or debris hauling.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Clearing Methods */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🚜 Land Clearing Methods Compared
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "8px" }}>🌿 Forestry Mulching</h4>
                  <p style={{ fontSize: "0.875rem", color: "#047857", margin: "0 0 8px 0" }}>
                    <strong>Cost:</strong> $400-$600/acre | <strong>Best for:</strong> Brush, small trees
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#065F46", margin: 0 }}>
                    Grinds vegetation into mulch on-site. No debris removal needed. Leaves nutrients in soil. Ideal for pastures and natural areas.
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>🚧 Bulldozer Clearing</h4>
                  <p style={{ fontSize: "0.875rem", color: "#A16207", margin: "0 0 8px 0" }}>
                    <strong>Cost:</strong> $150-$250/hour | <strong>Best for:</strong> Large areas, mixed terrain
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                    Fast and efficient for large properties. Pushes trees and debris to burn piles or removal areas. May disturb topsoil.
                  </p>
                </div>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>⛏️ Excavator Work</h4>
                  <p style={{ fontSize: "0.875rem", color: "#2563EB", margin: "0 0 8px 0" }}>
                    <strong>Cost:</strong> $150-$300/hour | <strong>Best for:</strong> Stumps, rocks, precision
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#1E40AF", margin: 0 }}>
                    Excellent for stump removal and rocky terrain. Can selectively remove trees. Often used with bulldozer for complete clearing.
                  </p>
                </div>
              </div>
            </div>

            {/* Cost Factors */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 Factors That Affect Land Clearing Cost
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>🌳 Vegetation Density</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Dense forests with large trees cost 3-5x more than brush-only land.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>⛰️ Terrain & Access</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Slopes, rocks, and limited access can add 25-50% to costs.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>🪵 Stump Removal</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Each stump costs $100-$400 to remove. A wooded acre may have 20-50 stumps.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>🚛 Debris Disposal</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Hauling debris off-site adds $100-$800. Mulching or burning saves money.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Time Estimates */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ⏱️ Time to Clear 1 Acre
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                {[
                  { type: "Brush Only", time: "2-4 hours" },
                  { type: "Lightly Wooded", time: "4-6 hours" },
                  { type: "Moderately Wooded", time: "6-10 hours" },
                  { type: "Heavily Wooded", time: "8-16+ hours" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <span style={{ fontSize: "0.85rem", color: "#374151" }}>{item.type}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#EA580C" }}>{item.time}</span>
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
                💡 Money-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Sell timber to offset costs</li>
                <li style={{ marginBottom: "8px" }}>Use forestry mulching when possible</li>
                <li style={{ marginBottom: "8px" }}>Get 3+ quotes from contractors</li>
                <li style={{ marginBottom: "8px" }}>Clear during dry season</li>
                <li>Consider renting goats for brush!</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/land-clearing-cost-calculator"
              currentCategory="Construction"
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
            🚜 <strong>Disclaimer:</strong> These estimates are based on national averages for 2025-2026. Actual costs vary significantly by location, contractor, season, and specific site conditions. Always get multiple quotes from licensed and insured contractors before starting any land clearing project. Permit requirements vary by jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}