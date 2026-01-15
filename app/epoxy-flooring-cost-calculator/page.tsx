"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Price data
const epoxyTypes = {
  "water-based": {
    name: "Water-Based Epoxy",
    description: "Budget-friendly, easy to apply, good for light traffic",
    diyMin: 2, diyMax: 4,
    proMin: 3, proMax: 7,
    coverage: 125,
    materialCostPerGallon: 45
  },
  "solids-100": {
    name: "100% Solids Epoxy",
    description: "Most durable, chemical resistant, industrial grade",
    diyMin: 3, diyMax: 5,
    proMin: 5, proMax: 12,
    coverage: 100,
    materialCostPerGallon: 85
  },
  "metallic": {
    name: "Metallic Epoxy",
    description: "Premium decorative finish, unique 3D effects",
    diyMin: 4, diyMax: 6,
    proMin: 8, proMax: 15,
    coverage: 80,
    materialCostPerGallon: 120
  },
  "flake": {
    name: "Flake / Chip Epoxy",
    description: "Decorative chips, hides imperfections, slip-resistant",
    diyMin: 3, diyMax: 5,
    proMin: 6, proMax: 12,
    coverage: 100,
    materialCostPerGallon: 75
  }
};

const concreteConditions = {
  "good": { name: "Good", description: "Clean, no cracks, minimal prep needed", addMin: 0, addMax: 0 },
  "fair": { name: "Fair", description: "Some cracks or stains, moderate prep", addMin: 0.5, addMax: 1 },
  "poor": { name: "Poor", description: "Major cracks, oil stains, extensive prep", addMin: 1, addMax: 2 }
};

// Common garage presets
const areaPresets = [
  { name: "1-Car Garage", sqft: 200 },
  { name: "2-Car Garage", sqft: 400 },
  { name: "3-Car Garage", sqft: 600 },
  { name: "Basement (Small)", sqft: 500 },
  { name: "Basement (Large)", sqft: 1000 }
];

// FAQ data
const faqs = [
  {
    question: "How much does it cost to epoxy 1000 square feet?",
    answer: "For 1,000 sq ft, expect to pay $3,000-$12,000 for professional installation depending on epoxy type. DIY costs range from $2,000-$5,000 for materials only. Basic water-based epoxy is cheapest ($3,000-$7,000 pro), while metallic finishes cost more ($8,000-$15,000 pro). Add $500-$2,000 if concrete needs significant repair."
  },
  {
    question: "How much epoxy do I need for 600 square feet?",
    answer: "For 600 sq ft with 2 coats, you'll need approximately 10-12 gallons of epoxy (assuming 100-125 sq ft coverage per gallon). Add 2-3 gallons of primer and 2-3 gallons of topcoat for a complete system. Always buy 10-15% extra for waste and touch-ups."
  },
  {
    question: "Is epoxy floor cheaper than tile?",
    answer: "Epoxy flooring typically costs $3-$12 per sq ft installed, while ceramic tile runs $10-$20 per sq ft and porcelain $15-$30 per sq ft. Epoxy is generally cheaper and more durable for garages and basements. However, tile may be preferred for living spaces due to aesthetics. Epoxy also has lower long-term maintenance costs."
  },
  {
    question: "How to calculate epoxy flooring cost?",
    answer: "Calculate epoxy cost by: 1) Measure floor area (length × width), 2) Choose epoxy type ($3-$15/sq ft range), 3) Add prep costs based on concrete condition ($0-$2/sq ft), 4) Factor in DIY vs professional installation (labor adds $3-$7/sq ft). Formula: Total = Area × (Material Cost + Prep Cost + Labor Cost)."
  },
  {
    question: "How long does epoxy flooring last?",
    answer: "Quality epoxy flooring lasts 10-20 years with proper installation and maintenance. 100% solids epoxy in residential garages often exceeds 20 years. Commercial/industrial settings with heavy traffic may see 5-10 years. Longevity depends on: surface prep quality, epoxy type, traffic level, and whether a topcoat was applied."
  },
  {
    question: "Can I epoxy my garage floor myself?",
    answer: "Yes, DIY epoxy is possible and can save 40-60% vs professional installation. Success requires: proper surface prep (cleaning, etching, crack repair), correct mixing ratios, appropriate temperature/humidity (50-80°F, <85% humidity), and adequate cure time (24-72 hours). Water-based epoxy kits are most DIY-friendly; 100% solids require more experience."
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

export default function EpoxyFlooringCostCalculator() {
  const [activeTab, setActiveTab] = useState<"cost" | "materials">("cost");
  
  // Cost Estimator State
  const [inputMethod, setInputMethod] = useState<"dimensions" | "sqft">("dimensions");
  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("20");
  const [sqft, setSqft] = useState<string>("400");
  const [epoxyType, setEpoxyType] = useState<string>("solids-100");
  const [installMethod, setInstallMethod] = useState<string>("professional");
  const [concreteCondition, setConcreteCondition] = useState<string>("good");
  const [addFlakes, setAddFlakes] = useState<boolean>(false);
  
  // Materials Calculator State
  const [matArea, setMatArea] = useState<string>("400");
  const [coverageRate, setCoverageRate] = useState<string>("100");
  const [numCoats, setNumCoats] = useState<string>("2");
  const [includePrimer, setIncludePrimer] = useState<boolean>(true);
  const [includeTopcoat, setIncludeTopcoat] = useState<boolean>(true);
  const [wastePercent, setWastePercent] = useState<string>("10");

  // Calculate floor area
  const floorArea = inputMethod === "dimensions" 
    ? (parseFloat(length) || 0) * (parseFloat(width) || 0)
    : (parseFloat(sqft) || 0);

  // Get epoxy type data
  const epoxy = epoxyTypes[epoxyType as keyof typeof epoxyTypes];
  const concrete = concreteConditions[concreteCondition as keyof typeof concreteConditions];

  // Calculate costs
  const isDIY = installMethod === "diy";
  const baseMinPerSqft = isDIY ? epoxy.diyMin : epoxy.proMin;
  const baseMaxPerSqft = isDIY ? epoxy.diyMax : epoxy.proMax;
  
  const prepMinPerSqft = concrete.addMin;
  const prepMaxPerSqft = concrete.addMax;
  
  const flakeAddon = addFlakes && epoxyType !== "flake" ? 0.5 : 0;
  
  const totalMinPerSqft = baseMinPerSqft + prepMinPerSqft + flakeAddon;
  const totalMaxPerSqft = baseMaxPerSqft + prepMaxPerSqft + flakeAddon;
  
  const totalMinCost = Math.round(floorArea * totalMinPerSqft);
  const totalMaxCost = Math.round(floorArea * totalMaxPerSqft);
  
  const materialMinCost = Math.round(floorArea * epoxy.diyMin);
  const materialMaxCost = Math.round(floorArea * epoxy.diyMax);
  
  const laborMinCost = isDIY ? 0 : Math.round(floorArea * (epoxy.proMin - epoxy.diyMin));
  const laborMaxCost = isDIY ? 0 : Math.round(floorArea * (epoxy.proMax - epoxy.diyMax));
  
  const prepMinCost = Math.round(floorArea * prepMinPerSqft);
  const prepMaxCost = Math.round(floorArea * prepMaxPerSqft);

  // Materials calculations
  const matAreaNum = parseFloat(matArea) || 0;
  const coverageNum = parseFloat(coverageRate) || 100;
  const coatsNum = parseInt(numCoats) || 2;
  const wasteNum = parseFloat(wastePercent) || 10;
  
  const baseGallons = (matAreaNum / coverageNum) * coatsNum;
  const gallonsWithWaste = baseGallons * (1 + wasteNum / 100);
  const epoxyGallons = Math.ceil(gallonsWithWaste);
  
  const primerGallons = includePrimer ? Math.ceil((matAreaNum / 200) * (1 + wasteNum / 100)) : 0;
  const topcoatGallons = includeTopcoat ? Math.ceil((matAreaNum / 150) * (1 + wasteNum / 100)) : 0;
  
  const estimatedMaterialCost = Math.round(
    epoxyGallons * epoxy.materialCostPerGallon +
    primerGallons * 35 +
    topcoatGallons * 55
  );

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  const tabs = [
    { id: "cost", label: "Cost Estimator", icon: "💰" },
    { id: "materials", label: "Materials Calculator", icon: "🪣" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Epoxy Flooring Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Epoxy Flooring Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate epoxy flooring costs for your garage, basement, or commercial space. 
            Compare DIY vs professional installation prices with our free calculator.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 8px 0" }}>How much does epoxy flooring cost?</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Epoxy flooring costs <strong>$3-$12 per sq ft</strong> for professional installation, 
                or <strong>$2-$6 per sq ft</strong> for DIY. A standard 2-car garage (400 sq ft) 
                typically costs <strong>$1,200-$4,800</strong> professionally installed.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#2563EB" : "#E5E7EB",
                color: activeTab === tab.id ? "white" : "#374151",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "cost" && "💰 Project Details"}
                {activeTab === "materials" && "🪣 Material Requirements"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  {/* Area Input Method */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Floor Area Input
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                      <button
                        onClick={() => setInputMethod("dimensions")}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: inputMethod === "dimensions" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: inputMethod === "dimensions" ? "#EFF6FF" : "white",
                          color: inputMethod === "dimensions" ? "#2563EB" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        Length × Width
                      </button>
                      <button
                        onClick={() => setInputMethod("sqft")}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: inputMethod === "sqft" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: inputMethod === "sqft" ? "#EFF6FF" : "white",
                          color: inputMethod === "sqft" ? "#2563EB" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        Square Feet
                      </button>
                    </div>
                    
                    {inputMethod === "dimensions" ? (
                      <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                        <div style={{ flex: "1", minWidth: "80px" }}>
                          <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Length (ft)</label>
                          <input
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                        <span style={{ color: "#6B7280", marginTop: "16px" }}>×</span>
                        <div style={{ flex: "1", minWidth: "80px" }}>
                          <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Width (ft)</label>
                          <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label style={{ fontSize: "0.75rem", color: "#6B7280" }}>Total Square Feet</label>
                        <input
                          type="number"
                          value={sqft}
                          onChange={(e) => setSqft(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quick Presets */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "6px", display: "block" }}>Quick Presets</label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {areaPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => {
                            setInputMethod("sqft");
                            setSqft(preset.sqft.toString());
                          }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {preset.name} ({preset.sqft} sq ft)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Epoxy Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Epoxy Type
                    </label>
                    <select
                      value={epoxyType}
                      onChange={(e) => setEpoxyType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(epoxyTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", marginBottom: 0 }}>
                      {epoxy.description}
                    </p>
                  </div>

                  {/* Installation Method */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Installation Method
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setInstallMethod("diy")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: installMethod === "diy" ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: installMethod === "diy" ? "#ECFDF5" : "white",
                          color: installMethod === "diy" ? "#059669" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🔧 DIY<br/>
                        <span style={{ fontSize: "0.75rem", fontWeight: "400" }}>${epoxy.diyMin}-${epoxy.diyMax}/sq ft</span>
                      </button>
                      <button
                        onClick={() => setInstallMethod("professional")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: installMethod === "professional" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: installMethod === "professional" ? "#EFF6FF" : "white",
                          color: installMethod === "professional" ? "#2563EB" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        👷 Professional<br/>
                        <span style={{ fontSize: "0.75rem", fontWeight: "400" }}>${epoxy.proMin}-${epoxy.proMax}/sq ft</span>
                      </button>
                    </div>
                  </div>

                  {/* Concrete Condition */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Concrete Condition
                    </label>
                    <select
                      value={concreteCondition}
                      onChange={(e) => setConcreteCondition(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(concreteConditions).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} - {value.description}</option>
                      ))}
                    </select>
                    {concreteCondition !== "good" && (
                      <p style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "4px", marginBottom: 0 }}>
                        +${concrete.addMin.toFixed(2)}-${concrete.addMax.toFixed(2)}/sq ft for surface prep
                      </p>
                    )}
                  </div>

                  {/* Add Decorative Flakes */}
                  {epoxyType !== "flake" && (
                    <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={addFlakes}
                          onChange={(e) => setAddFlakes(e.target.checked)}
                          style={{ width: "18px", height: "18px" }}
                        />
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                          Add Decorative Flakes (+$0.50/sq ft)
                        </span>
                      </label>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", marginBottom: 0, marginLeft: "26px" }}>
                        Colored chips for texture and slip-resistance
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* MATERIALS CALCULATOR TAB */}
              {activeTab === "materials" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "16px", padding: "10px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    Calculate the exact amount of epoxy, primer, and topcoat needed for your DIY project.
                  </p>

                  {/* Area */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Floor Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={matArea}
                      onChange={(e) => setMatArea(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Coverage Rate */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Coverage Rate (sq ft per gallon)
                    </label>
                    <select
                      value={coverageRate}
                      onChange={(e) => setCoverageRate(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="80">80 sq ft/gal (Metallic epoxy)</option>
                      <option value="100">100 sq ft/gal (100% Solids, Flake)</option>
                      <option value="125">125 sq ft/gal (Water-based)</option>
                      <option value="150">150 sq ft/gal (Thin coat)</option>
                    </select>
                  </div>

                  {/* Number of Coats */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Number of Coats
                    </label>
                    <select
                      value={numCoats}
                      onChange={(e) => setNumCoats(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="1">1 Coat (Light duty)</option>
                      <option value="2">2 Coats (Recommended)</option>
                      <option value="3">3 Coats (Heavy duty/Commercial)</option>
                    </select>
                  </div>

                  {/* Waste Percentage */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Overage / Waste Factor
                    </label>
                    <select
                      value={wastePercent}
                      onChange={(e) => setWastePercent(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="5">5% (Experienced installer)</option>
                      <option value="10">10% (Recommended)</option>
                      <option value="15">15% (First-time DIY)</option>
                      <option value="20">20% (Complex floor shape)</option>
                    </select>
                  </div>

                  {/* Additional Coatings */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Additional Coatings
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                        <input
                          type="checkbox"
                          checked={includePrimer}
                          onChange={(e) => setIncludePrimer(e.target.checked)}
                          style={{ width: "18px", height: "18px" }}
                        />
                        Include Primer (Recommended for adhesion)
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem" }}>
                        <input
                          type="checkbox"
                          checked={includeTopcoat}
                          onChange={(e) => setIncludeTopcoat(e.target.checked)}
                          style={{ width: "18px", height: "18px" }}
                        />
                        Include Clear Topcoat (UV protection & shine)
                      </label>
                    </div>
                  </div>
                </>
              )}
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "cost" && "📊 Cost Estimate"}
                {activeTab === "materials" && "📦 Materials Needed"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* COST RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Total Cost */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Total Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(totalMinCost)} - {formatCurrency(totalMaxCost)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {floorArea.toLocaleString()} sq ft × ${totalMinPerSqft.toFixed(2)}-${totalMaxPerSqft.toFixed(2)}/sq ft
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>Materials ({epoxy.name})</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(materialMinCost)} - {formatCurrency(materialMaxCost)}</span>
                      </div>
                      {!isDIY && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#4B5563" }}>Labor (Professional)</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(laborMinCost)} - {formatCurrency(laborMaxCost)}</span>
                        </div>
                      )}
                      {concreteCondition !== "good" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#4B5563" }}>Surface Prep ({concrete.name})</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(prepMinCost)} - {formatCurrency(prepMaxCost)}</span>
                        </div>
                      )}
                      {addFlakes && epoxyType !== "flake" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#4B5563" }}>Decorative Flakes</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(floorArea * 0.5)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per Square Foot Summary */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid #BFDBFE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", color: "#1E40AF" }}>Cost per sq ft:</span>
                      <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${totalMinPerSqft.toFixed(2)} - ${totalMaxPerSqft.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Savings Tip */}
                  {!isDIY && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        💡 <strong>DIY Savings:</strong> Do it yourself and save approximately {formatCurrency(laborMinCost)} - {formatCurrency(laborMaxCost)} on labor costs!
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* MATERIALS RESULTS */}
              {activeTab === "materials" && (
                <>
                  {/* Materials Summary */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Material Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(estimatedMaterialCost)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      For {matAreaNum.toLocaleString()} sq ft with {coatsNum} coat{coatsNum > 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Materials Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Materials List</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "#EFF6FF", borderRadius: "6px" }}>
                        <span style={{ color: "#1E40AF", fontWeight: "500" }}>🪣 Epoxy Coating</span>
                        <span style={{ fontWeight: "bold", color: "#2563EB" }}>{epoxyGallons} gallons</span>
                      </div>
                      {includePrimer && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                          <span style={{ color: "#92400E", fontWeight: "500" }}>🎨 Primer</span>
                          <span style={{ fontWeight: "bold", color: "#B45309" }}>{primerGallons} gallons</span>
                        </div>
                      )}
                      {includeTopcoat && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                          <span style={{ color: "#065F46", fontWeight: "500" }}>✨ Clear Topcoat</span>
                          <span style={{ fontWeight: "bold", color: "#059669" }}>{topcoatGallons} gallons</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculation Details */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "0.85rem" }}>Calculation Details</h4>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Base coverage:</span>
                        <span>{matAreaNum} ÷ {coverageNum} = {(matAreaNum / coverageNum).toFixed(1)} gal/coat</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>× {coatsNum} coats:</span>
                        <span>{baseGallons.toFixed(1)} gallons</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>+ {wasteNum}% overage:</span>
                        <span>{gallonsWithWaste.toFixed(1)} gallons</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", color: "#111827", paddingTop: "4px", borderTop: "1px solid #E5E7EB", marginTop: "4px" }}>
                        <span>Rounded up:</span>
                        <span>{epoxyGallons} gallons</span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#1E40AF" }}>💡 Pro Tips</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#1D4ED8", lineHeight: "1.8" }}>
                      <li>Always round up - running short mid-project is costly</li>
                      <li>Primer improves adhesion on new or porous concrete</li>
                      <li>Topcoat adds UV resistance and extends lifespan</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cost Comparison Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Epoxy Flooring Cost Comparison</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Epoxy Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>DIY Cost</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Professional</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Durability</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Water-Based</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$2-4/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$3-7/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>5-10 years</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Light traffic, DIY beginners</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>100% Solids</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$3-5/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$5-12/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>15-20 years</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Garages, industrial, high traffic</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Metallic</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$4-6/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$8-15/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>10-15 years</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Showrooms, luxury finishes</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Flake / Chip</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$3-5/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$6-12/sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>10-15 years</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Hiding imperfections, slip resistance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 Understanding Epoxy Flooring Costs</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>What Affects Epoxy Flooring Price?</h3>
                <p>
                  The cost of epoxy flooring depends on several key factors. Floor size is the primary driver - larger areas 
                  cost more overall but may have lower per-square-foot rates due to economies of scale. The type of epoxy 
                  you choose significantly impacts price, with basic water-based options at $3-7/sq ft and premium metallic 
                  finishes reaching $8-15/sq ft professionally installed.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>DIY vs Professional Installation</h3>
                <p>
                  DIY epoxy installation can save 40-60% compared to hiring professionals. A 400 sq ft garage might cost 
                  $800-$2,000 for DIY materials versus $2,000-$4,800 for professional installation. However, DIY requires 
                  proper surface preparation, correct mixing ratios, and favorable weather conditions (50-80°F, low humidity). 
                  Mistakes can be costly to fix, so consider your experience level carefully.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Surface Preparation Costs</h3>
                <p>
                  Concrete condition is often overlooked but crucial for project success. Good concrete requires only basic 
                  cleaning and etching. Fair condition floors with minor cracks add $0.50-$1.00/sq ft for repairs. Poor 
                  condition concrete with major damage can add $1-$2/sq ft or more. Skipping proper prep is the #1 cause 
                  of epoxy floor failure.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>💰 Cost by Project Size</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>1-Car Garage (200 sq ft)</span>
                  <span style={{ fontWeight: "600" }}>$600-$2,400</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>2-Car Garage (400 sq ft)</span>
                  <span style={{ fontWeight: "600" }}>$1,200-$4,800</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>3-Car Garage (600 sq ft)</span>
                  <span style={{ fontWeight: "600" }}>$1,800-$7,200</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>1,000 sq ft</span>
                  <span style={{ fontWeight: "600" }}>$3,000-$12,000</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ DIY Checklist</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Clean & degrease concrete</li>
                <li>Repair cracks & holes</li>
                <li>Etch or grind surface</li>
                <li>Check moisture levels</li>
                <li>Apply primer (recommended)</li>
                <li>Mix epoxy correctly</li>
                <li>Apply in 50-80°F temps</li>
                <li>Allow 24-72 hours cure time</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/epoxy-flooring-cost-calculator" currentCategory="Home" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
            Actual costs may vary based on your location, contractor rates, concrete condition, and specific project requirements. 
            Always get multiple quotes from licensed contractors for accurate pricing.
          </p>
        </div>
      </div>
    </div>
  );
}