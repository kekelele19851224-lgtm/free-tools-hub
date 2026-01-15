"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Wax types with recommended fragrance loads and specific gravity
const waxTypes = {
  "soy": { name: "Soy Wax", minLoad: 6, maxLoad: 10, recommended: 8, gravity: 0.90, description: "Clean-burning, eco-friendly" },
  "paraffin": { name: "Paraffin Wax", minLoad: 6, maxLoad: 12, recommended: 9, gravity: 0.86, description: "Strong scent throw" },
  "coconut": { name: "Coconut Wax", minLoad: 8, maxLoad: 12, recommended: 10, gravity: 0.92, description: "Luxury, creamy finish" },
  "beeswax": { name: "Beeswax", minLoad: 5, maxLoad: 8, recommended: 6, gravity: 0.96, description: "Natural, honey scent" },
  "soy-coconut": { name: "Soy/Coconut Blend", minLoad: 8, maxLoad: 12, recommended: 9, gravity: 0.91, description: "Best of both" },
  "palm": { name: "Palm Wax", minLoad: 6, maxLoad: 10, recommended: 7, gravity: 0.88, description: "Crystal patterns" }
};

// Common container sizes
const containerSizes = [
  { oz: 4, ml: 118, name: "4 oz (Travel)" },
  { oz: 6, ml: 177, name: "6 oz (Small)" },
  { oz: 8, ml: 237, name: "8 oz (Medium)" },
  { oz: 10, ml: 296, name: "10 oz (Standard)" },
  { oz: 12, ml: 355, name: "12 oz (Large)" },
  { oz: 16, ml: 473, name: "16 oz (XL)" }
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate wax and fragrance for candles?",
    answer: "To calculate wax amount, multiply your container's water capacity by 0.86 (wax specific gravity). For fragrance, multiply wax weight by your fragrance load percentage. Example: 8oz container holds 6.88oz wax (8 × 0.86). At 8% fragrance load: 6.88 × 0.08 = 0.55oz fragrance oil. Total fill = 6.88 + 0.55 = 7.43oz."
  },
  {
    question: "What is the fragrance load percentage for soy wax?",
    answer: "Soy wax typically has a recommended fragrance load of 6-10%, with 8% being the sweet spot for most fragrances. Going below 6% may result in weak scent throw, while exceeding 10% can cause issues like sweating, poor burn quality, or even safety hazards. Always check your specific wax manufacturer's recommendations."
  },
  {
    question: "How do I convert water weight to wax weight?",
    answer: "Multiply water weight by 0.86 to get wax weight. This is because wax is less dense than water (specific gravity ~0.86). Fill your container with water, weigh it, then multiply by 0.86. For example: 10oz water × 0.86 = 8.6oz wax. This ensures you don't overfill your containers."
  },
  {
    question: "How much does it cost to make a candle?",
    answer: "An 8oz soy candle typically costs $3-6 to make, including: wax ($1-2), fragrance oil ($0.40-0.80), container ($1-3), wick ($0.15-0.30), and label ($0.10-0.50). Labor adds $0.50-2 per candle depending on your hourly rate. Material costs vary by quality and quantity purchased—buying in bulk reduces costs significantly."
  },
  {
    question: "How do I price my homemade candles?",
    answer: "The standard formula is: Retail Price = Total Cost × 3 to 4, Wholesale Price = Total Cost × 2. For an $4 cost candle, retail would be $12-16, wholesale $8. Consider your target market too—craft fair candles typically sell for $12-20 for 8oz, while boutique candles can command $25-40. Don't underprice—it devalues your work."
  },
  {
    question: "What is the 84 candle rule?",
    answer: "The 84 candle rule suggests making 84 test candles before launching your candle business. This breaks down to: 7 different waxes × 3 different wicks × 4 different fragrance loads = 84 combinations. Testing this many variations helps you find the perfect recipe for optimal burn quality, scent throw, and appearance before selling to customers."
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

export default function CandleCalculator() {
  const [activeTab, setActiveTab] = useState<"wax" | "cost" | "convert">("wax");
  
  // Tab 1: Wax & Fragrance Calculator State
  const [containerSize, setContainerSize] = useState<string>("8");
  const [useWaterWeight, setUseWaterWeight] = useState<boolean>(false);
  const [waterWeight, setWaterWeight] = useState<string>("8");
  const [waxType, setWaxType] = useState<string>("soy");
  const [fragranceLoad, setFragranceLoad] = useState<string>("8");
  const [candleQuantity, setCandleQuantity] = useState<string>("10");
  const [unit, setUnit] = useState<string>("oz");
  
  // Tab 2: Cost & Pricing Calculator State
  const [waxCostPerLb, setWaxCostPerLb] = useState<string>("12");
  const [fragranceCostPerOz, setFragranceCostPerOz] = useState<string>("2.50");
  const [containerCost, setContainerCost] = useState<string>("1.50");
  const [wickCost, setWickCost] = useState<string>("0.20");
  const [labelCost, setLabelCost] = useState<string>("0.30");
  const [otherCost, setOtherCost] = useState<string>("0.25");
  const [laborMinutes, setLaborMinutes] = useState<string>("10");
  const [hourlyRate, setHourlyRate] = useState<string>("15");
  const [profitMargin, setProfitMargin] = useState<string>("3.5");
  
  // Tab 3: Unit Converter State
  const [convertType, setConvertType] = useState<string>("waterToWax");
  const [convertValue, setConvertValue] = useState<string>("10");
  const [convertFromUnit, setConvertFromUnit] = useState<string>("oz");
  const [convertToUnit, setConvertToUnit] = useState<string>("g");

  // Tab 1 Calculations
  const waxData = waxTypes[waxType as keyof typeof waxTypes];
  const gravity = waxData.gravity;
  const load = parseFloat(fragranceLoad) || 8;
  const qty = parseInt(candleQuantity) || 1;
  
  let containerVolumeOz = parseFloat(containerSize) || 8;
  if (useWaterWeight) {
    containerVolumeOz = parseFloat(waterWeight) || 8;
  }
  
  // Convert to grams if needed
  const containerVolumeG = containerVolumeOz * 28.35;
  
  // Calculate fill weight (what the container can hold in wax)
  const fillWeightOz = containerVolumeOz * gravity;
  const fillWeightG = fillWeightOz * 28.35;
  
  // Calculate wax and fragrance amounts
  const waxWeightOz = fillWeightOz / (1 + load / 100);
  const fragranceWeightOz = fillWeightOz - waxWeightOz;
  
  const waxWeightG = waxWeightOz * 28.35;
  const fragranceWeightG = fragranceWeightOz * 28.35;
  
  // Total for batch
  const totalWaxOz = waxWeightOz * qty;
  const totalWaxLb = totalWaxOz / 16;
  const totalFragranceOz = fragranceWeightOz * qty;
  const totalWaxG = waxWeightG * qty;
  const totalFragranceG = fragranceWeightG * qty;

  // Tab 2 Calculations
  const waxCost = parseFloat(waxCostPerLb) || 0;
  const fragCost = parseFloat(fragranceCostPerOz) || 0;
  const contCost = parseFloat(containerCost) || 0;
  const wkCost = parseFloat(wickCost) || 0;
  const lblCost = parseFloat(labelCost) || 0;
  const othCost = parseFloat(otherCost) || 0;
  const laborMin = parseFloat(laborMinutes) || 0;
  const hrRate = parseFloat(hourlyRate) || 0;
  const margin = parseFloat(profitMargin) || 3;
  
  // Cost per candle (using Tab 1 calculations)
  const waxCostPerCandle = (waxWeightOz / 16) * waxCost;
  const fragCostPerCandle = fragranceWeightOz * fragCost;
  const materialCost = waxCostPerCandle + fragCostPerCandle + contCost + wkCost + lblCost + othCost;
  const laborCost = (laborMin / 60) * hrRate;
  const totalCostPerCandle = materialCost + laborCost;
  const retailPrice = totalCostPerCandle * margin;
  const wholesalePrice = totalCostPerCandle * 2;

  // Tab 3 Calculations
  const convValue = parseFloat(convertValue) || 0;
  let convertedResult = 0;
  let convertedUnit = "";
  
  if (convertType === "waterToWax") {
    if (convertFromUnit === "oz") {
      convertedResult = convValue * 0.86;
      convertedUnit = "oz wax";
    } else {
      convertedResult = convValue * 0.86;
      convertedUnit = "g wax";
    }
  } else if (convertType === "weight") {
    // oz to g
    if (convertFromUnit === "oz" && convertToUnit === "g") {
      convertedResult = convValue * 28.35;
      convertedUnit = "g";
    } else if (convertFromUnit === "g" && convertToUnit === "oz") {
      convertedResult = convValue / 28.35;
      convertedUnit = "oz";
    } else if (convertFromUnit === "lb" && convertToUnit === "g") {
      convertedResult = convValue * 453.59;
      convertedUnit = "g";
    } else if (convertFromUnit === "g" && convertToUnit === "lb") {
      convertedResult = convValue / 453.59;
      convertedUnit = "lb";
    } else if (convertFromUnit === "oz" && convertToUnit === "lb") {
      convertedResult = convValue / 16;
      convertedUnit = "lb";
    } else if (convertFromUnit === "lb" && convertToUnit === "oz") {
      convertedResult = convValue * 16;
      convertedUnit = "oz";
    } else if (convertFromUnit === "kg" && convertToUnit === "g") {
      convertedResult = convValue * 1000;
      convertedUnit = "g";
    } else if (convertFromUnit === "g" && convertToUnit === "kg") {
      convertedResult = convValue / 1000;
      convertedUnit = "kg";
    } else if (convertFromUnit === "lb" && convertToUnit === "kg") {
      convertedResult = convValue * 0.4536;
      convertedUnit = "kg";
    } else if (convertFromUnit === "kg" && convertToUnit === "lb") {
      convertedResult = convValue / 0.4536;
      convertedUnit = "lb";
    } else if (convertFromUnit === "oz" && convertToUnit === "kg") {
      convertedResult = convValue * 0.02835;
      convertedUnit = "kg";
    } else if (convertFromUnit === "kg" && convertToUnit === "oz") {
      convertedResult = convValue / 0.02835;
      convertedUnit = "oz";
    } else {
      convertedResult = convValue;
      convertedUnit = convertToUnit;
    }
  } else if (convertType === "volume") {
    if (convertFromUnit === "ml" && convertToUnit === "floz") {
      convertedResult = convValue / 29.57;
      convertedUnit = "fl oz";
    } else if (convertFromUnit === "floz" && convertToUnit === "ml") {
      convertedResult = convValue * 29.57;
      convertedUnit = "ml";
    } else {
      convertedResult = convValue;
      convertedUnit = convertToUnit;
    }
  }

  const tabs = [
    { id: "wax", label: "Wax & Fragrance", icon: "🕯️" },
    { id: "cost", label: "Cost & Pricing", icon: "💰" },
    { id: "convert", label: "Unit Converter", icon: "🔄" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFBEB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Candle Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🕯️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#78350F", margin: 0 }}>
              Candle Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#92400E", maxWidth: "800px" }}>
            Calculate wax and fragrance amounts, estimate costs, and set profitable prices for your handmade candles. 
            Perfect for DIY candle makers and small businesses.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#B45309",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>Candle Formula Quick Reference</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Wax:</strong> Water Weight × 0.86
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Fragrance:</strong> Wax × (Load% ÷ 100)
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Price:</strong> Cost × 3-4 (retail)
                </div>
              </div>
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
                backgroundColor: activeTab === tab.id ? "#B45309" : "#FDE68A",
                color: activeTab === tab.id ? "white" : "#78350F",
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
            border: "1px solid #FDE68A",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "wax" && "🕯️ Candle Details"}
                {activeTab === "cost" && "💰 Cost Inputs"}
                {activeTab === "convert" && "🔄 Converter"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* WAX & FRAGRANCE TAB */}
              {activeTab === "wax" && (
                <>
                  {/* Container Size */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Container Size
                    </label>
                    
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#92400E" }}>
                        <input
                          type="checkbox"
                          checked={useWaterWeight}
                          onChange={(e) => setUseWaterWeight(e.target.checked)}
                        />
                        Enter water weight instead
                      </label>
                    </div>
                    
                    {!useWaterWeight ? (
                      <select
                        value={containerSize}
                        onChange={(e) => setContainerSize(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                      >
                        {containerSizes.map((size) => (
                          <option key={size.oz} value={size.oz}>{size.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="number"
                          value={waterWeight}
                          onChange={(e) => setWaterWeight(e.target.value)}
                          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                          placeholder="Water weight"
                        />
                        <select
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                        >
                          <option value="oz">oz</option>
                          <option value="g">g</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Wax Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Wax Type
                    </label>
                    <select
                      value={waxType}
                      onChange={(e) => {
                        setWaxType(e.target.value);
                        const newWax = waxTypes[e.target.value as keyof typeof waxTypes];
                        setFragranceLoad(newWax.recommended.toString());
                      }}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                    >
                      {Object.entries(waxTypes).map(([key, value]) => (
                        <option key={key} value={key}>{value.name} ({value.minLoad}-{value.maxLoad}%)</option>
                      ))}
                    </select>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#92400E" }}>
                      {waxData.description} • Recommended: {waxData.recommended}%
                    </p>
                  </div>

                  {/* Fragrance Load */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Fragrance Load (%)
                    </label>
                    <input
                      type="number"
                      value={fragranceLoad}
                      onChange={(e) => setFragranceLoad(e.target.value)}
                      min={waxData.minLoad}
                      max={waxData.maxLoad}
                      step="0.5"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[waxData.minLoad, waxData.recommended, waxData.maxLoad].map((l) => (
                        <button
                          key={l}
                          onClick={() => setFragranceLoad(l.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: fragranceLoad === l.toString() ? "2px solid #B45309" : "1px solid #FDE68A",
                            backgroundColor: fragranceLoad === l.toString() ? "#FEF3C7" : "white",
                            color: "#78350F",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {l}%
                        </button>
                      ))}
                    </div>
                    {(load < waxData.minLoad || load > waxData.maxLoad) && (
                      <p style={{ margin: "6px 0 0 0", fontSize: "0.75rem", color: "#DC2626" }}>
                        ⚠️ Outside recommended range ({waxData.minLoad}-{waxData.maxLoad}%)
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Number of Candles
                    </label>
                    <input
                      type="number"
                      value={candleQuantity}
                      onChange={(e) => setCandleQuantity(e.target.value)}
                      min="1"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[1, 6, 12, 24, 50, 100].map((n) => (
                        <button
                          key={n}
                          onClick={() => setCandleQuantity(n.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: candleQuantity === n.toString() ? "2px solid #B45309" : "1px solid #FDE68A",
                            backgroundColor: candleQuantity === n.toString() ? "#FEF3C7" : "white",
                            color: "#78350F",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* COST & PRICING TAB */}
              {activeTab === "cost" && (
                <>
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FDE68A" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 Using candle from Tab 1: <strong>{containerSize}oz {waxData.name}</strong> @ {fragranceLoad}% load
                    </p>
                  </div>

                  {/* Material Costs */}
                  <p style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "600", color: "#78350F" }}>📦 Material Costs</p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Wax Cost ($/lb)
                      </label>
                      <input
                        type="number"
                        value={waxCostPerLb}
                        onChange={(e) => setWaxCostPerLb(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Fragrance ($/oz)
                      </label>
                      <input
                        type="number"
                        value={fragranceCostPerOz}
                        onChange={(e) => setFragranceCostPerOz(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Container ($)
                      </label>
                      <input
                        type="number"
                        value={containerCost}
                        onChange={(e) => setContainerCost(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Wick ($)
                      </label>
                      <input
                        type="number"
                        value={wickCost}
                        onChange={(e) => setWickCost(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Label/Packaging ($)
                      </label>
                      <input
                        type="number"
                        value={labelCost}
                        onChange={(e) => setLabelCost(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Other ($)
                      </label>
                      <input
                        type="number"
                        value={otherCost}
                        onChange={(e) => setOtherCost(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Labor */}
                  <p style={{ margin: "16px 0 12px 0", fontSize: "0.85rem", fontWeight: "600", color: "#78350F" }}>👷 Labor Cost</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Time per Candle (min)
                      </label>
                      <input
                        type="number"
                        value={laborMinutes}
                        onChange={(e) => setLaborMinutes(e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Pricing Multiplier */}
                  <p style={{ margin: "16px 0 12px 0", fontSize: "0.85rem", fontWeight: "600", color: "#78350F" }}>🏷️ Pricing</p>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>
                      Retail Markup Multiplier
                    </label>
                    <input
                      type="number"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(e.target.value)}
                      step="0.5"
                      style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #FDE68A", fontSize: "0.85rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[2, 2.5, 3, 3.5, 4].map((m) => (
                        <button
                          key={m}
                          onClick={() => setProfitMargin(m.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: profitMargin === m.toString() ? "2px solid #B45309" : "1px solid #FDE68A",
                            backgroundColor: profitMargin === m.toString() ? "#FEF3C7" : "white",
                            color: "#78350F",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {m}×
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* UNIT CONVERTER TAB */}
              {activeTab === "convert" && (
                <>
                  {/* Conversion Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Conversion Type
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[
                        { id: "waterToWax", label: "Water → Wax" },
                        { id: "weight", label: "Weight" },
                        { id: "volume", label: "Volume" }
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setConvertType(type.id)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            border: convertType === type.id ? "2px solid #B45309" : "1px solid #FDE68A",
                            backgroundColor: convertType === type.id ? "#FEF3C7" : "white",
                            color: "#78350F",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Value Input */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                      Value to Convert
                    </label>
                    <input
                      type="number"
                      value={convertValue}
                      onChange={(e) => setConvertValue(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* From/To Units */}
                  {convertType === "waterToWax" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#78350F", marginBottom: "6px", fontWeight: "600" }}>
                        Unit
                      </label>
                      <select
                        value={convertFromUnit}
                        onChange={(e) => setConvertFromUnit(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                      >
                        <option value="oz">Ounces (oz)</option>
                        <option value="g">Grams (g)</option>
                      </select>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#92400E" }}>
                        Wax is ~86% the weight of water (specific gravity 0.86)
                      </p>
                    </div>
                  )}

                  {convertType === "weight" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>From</label>
                        <select
                          value={convertFromUnit}
                          onChange={(e) => setConvertFromUnit(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                        >
                          <option value="oz">Ounces (oz)</option>
                          <option value="g">Grams (g)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="kg">Kilograms (kg)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>To</label>
                        <select
                          value={convertToUnit}
                          onChange={(e) => setConvertToUnit(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                        >
                          <option value="g">Grams (g)</option>
                          <option value="oz">Ounces (oz)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="kg">Kilograms (kg)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {convertType === "volume" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>From</label>
                        <select
                          value={convertFromUnit}
                          onChange={(e) => setConvertFromUnit(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                        >
                          <option value="ml">Milliliters (ml)</option>
                          <option value="floz">Fluid Ounces (fl oz)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>To</label>
                        <select
                          value={convertToUnit}
                          onChange={(e) => setConvertToUnit(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "0.9rem" }}
                        >
                          <option value="floz">Fluid Ounces (fl oz)</option>
                          <option value="ml">Milliliters (ml)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FDE68A",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "wax" && "📊 Recipe Results"}
                {activeTab === "cost" && "💵 Pricing Analysis"}
                {activeTab === "convert" && "🔄 Conversion Result"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* WAX & FRAGRANCE RESULTS */}
              {activeTab === "wax" && (
                <>
                  {/* Per Candle */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "2px solid #059669"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#065F46", fontWeight: "600" }}>
                      Per Candle ({containerSize}oz {waxData.name})
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ textAlign: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#6B7280" }}>Wax Needed</p>
                        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                          {waxWeightOz.toFixed(2)} oz
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                          ({waxWeightG.toFixed(1)} g)
                        </p>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#6B7280" }}>Fragrance Oil</p>
                        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>
                          {fragranceWeightOz.toFixed(2)} oz
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                          ({fragranceWeightG.toFixed(1)} g)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Batch Total */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#92400E", fontWeight: "600" }}>
                      Batch Total ({qty} candles)
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ textAlign: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#6B7280" }}>Total Wax</p>
                        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                          {totalWaxLb.toFixed(2)} lb
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                          ({totalWaxOz.toFixed(1)} oz / {totalWaxG.toFixed(0)} g)
                        </p>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#6B7280" }}>Total Fragrance</p>
                        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>
                          {totalFragranceOz.toFixed(2)} oz
                        </p>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                          ({totalFragranceG.toFixed(1)} g)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recipe Summary */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Recipe Summary</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Wax Type</span>
                        <span style={{ fontWeight: "600" }}>{waxData.name}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Fragrance Load</span>
                        <span style={{ fontWeight: "600" }}>{fragranceLoad}%</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Fill Weight per Candle</span>
                        <span style={{ fontWeight: "600" }}>{fillWeightOz.toFixed(2)} oz ({fillWeightG.toFixed(0)} g)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#4B5563" }}>Specific Gravity</span>
                        <span style={{ fontWeight: "600" }}>{gravity}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* COST & PRICING RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Main Price */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Suggested Retail Price
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${retailPrice.toFixed(2)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Cost × {margin} markup
                    </p>
                  </div>

                  {/* Wholesale */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Wholesale (2×)</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ${wholesalePrice.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Profit per Sale</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${(retailPrice - totalCostPerCandle).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Wax ({waxWeightOz.toFixed(2)} oz)</span>
                        <span style={{ fontWeight: "600" }}>${waxCostPerCandle.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Fragrance ({fragranceWeightOz.toFixed(2)} oz)</span>
                        <span style={{ fontWeight: "600" }}>${fragCostPerCandle.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Container</span>
                        <span style={{ fontWeight: "600" }}>${contCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Wick + Label + Other</span>
                        <span style={{ fontWeight: "600" }}>${(wkCost + lblCost + othCost).toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", paddingTop: "6px", borderTop: "1px dashed #D1D5DB" }}>
                        <span style={{ color: "#4B5563" }}>Material Subtotal</span>
                        <span style={{ fontWeight: "600" }}>${materialCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Labor ({laborMin} min @ ${hrRate}/hr)</span>
                        <span style={{ fontWeight: "600" }}>${laborCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Total Cost</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${totalCostPerCandle.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Tips */}
                  <div style={{ backgroundColor: "#ECFEFF", borderRadius: "10px", padding: "12px", border: "1px solid #A5F3FC" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#0E7490" }}>
                      💡 <strong>Tip:</strong> Craft fairs typically price 8oz candles at $15-20. 
                      Boutique/luxury markets can command $25-40.
                    </p>
                  </div>
                </>
              )}

              {/* CONVERTER RESULTS */}
              {activeTab === "convert" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {convertType === "waterToWax" && `${convValue} ${convertFromUnit} water =`}
                      {convertType === "weight" && `${convValue} ${convertFromUnit} =`}
                      {convertType === "volume" && `${convValue} ${convertFromUnit} =`}
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {convertedResult.toFixed(2)} {convertedUnit}
                    </p>
                  </div>

                  {/* Quick Reference */}
                  {convertType === "waterToWax" && (
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Quick Reference</h4>
                      <div style={{ fontSize: "0.85rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {[4, 6, 8, 10, 12, 16].map((w) => (
                          <div key={w} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", backgroundColor: "white", borderRadius: "4px" }}>
                            <span style={{ color: "#4B5563" }}>{w} oz water</span>
                            <span style={{ fontWeight: "600" }}>{(w * 0.86).toFixed(2)} oz wax</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {convertType === "weight" && (
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Common Conversions</h4>
                      <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                        <p style={{ margin: 0 }}>1 oz = 28.35 g</p>
                        <p style={{ margin: 0 }}>1 lb = 16 oz = 453.59 g</p>
                        <p style={{ margin: 0 }}>1 kg = 2.205 lb = 35.27 oz</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Fragrance Load Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #FDE68A",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Wax Type & Fragrance Load Guide</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "left" }}>Wax Type</th>
                  <th style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>Min Load</th>
                  <th style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>Recommended</th>
                  <th style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>Max Load</th>
                  <th style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>Specific Gravity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(waxTypes).map(([key, value], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 1 ? "#FFFBEB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #FDE68A" }}>
                      <strong>{value.name}</strong>
                      <br/>
                      <span style={{ fontSize: "0.75rem", color: "#92400E" }}>{value.description}</span>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>{value.minLoad}%</td>
                    <td style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center", color: "#059669", fontWeight: "bold" }}>{value.recommended}%</td>
                    <td style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>{value.maxLoad}%</td>
                    <td style={{ padding: "12px", border: "1px solid #FDE68A", textAlign: "center" }}>{value.gravity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#92400E", marginTop: "12px", marginBottom: 0 }}>
              * Exceeding max load can cause poor burn quality, sweating, or safety issues. Always test your recipes.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#78350F", marginBottom: "20px" }}>🕯️ Candle Making Essentials</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#78350F", marginTop: "0", marginBottom: "12px" }}>Why Accurate Calculations Matter</h3>
                <p>
                  Candle making is part art, part science. The right wax-to-fragrance ratio ensures optimal scent throw 
                  (how well you smell the candle), clean burning, and safety. Too much fragrance oil can cause the wick 
                  to clog, create smoke, or even pose fire hazards. Too little results in a candle that barely smells. 
                  Using a calculator takes the guesswork out of recipe development.
                </p>
                
                <h3 style={{ color: "#78350F", marginTop: "24px", marginBottom: "12px" }}>Understanding Fragrance Load</h3>
                <p>
                  Fragrance load is the percentage of fragrance oil relative to the total wax weight. Different wax 
                  types have different capacities—soy wax typically holds 6-10%, while coconut wax can handle 8-12%. 
                  Start at the recommended percentage and adjust based on your specific fragrance oil and desired 
                  strength. Hot throw (scent when burning) and cold throw (scent when unlit) may vary.
                </p>
                
                <h3 style={{ color: "#78350F", marginTop: "24px", marginBottom: "12px" }}>Pricing for Profit</h3>
                <p>
                  Many new candle makers underprice their products. The standard formula is to multiply your total 
                  cost (materials + labor) by 3-4 for retail sales and by 2 for wholesale. Don&apos;t forget to include 
                  overhead costs like equipment, shipping supplies, and platform fees. Quality candles command 
                  premium prices—focus on creating a great product rather than competing on price alone.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#B45309", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📐 Quick Formulas</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Wax Weight:</strong> Water × 0.86</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Fragrance:</strong> Wax × (Load%÷100)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Retail:</strong> Cost × 3-4</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Wholesale:</strong> Cost × 2</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  1 lb = 16 oz • 1 oz = 28.35g
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FDE68A" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Safety Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <li>Never exceed max fragrance load</li>
                <li>Test candles before selling</li>
                <li>Use proper wick size for container</li>
                <li>Include warning labels</li>
                <li>Check local regulations</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/candle-calculator" currentCategory="DIY" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDE68A", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#78350F", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            🕯️ <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. 
            Always test your candle recipes thoroughly before selling. Fragrance performance varies by 
            brand and type. Follow your wax manufacturer&apos;s recommendations and local safety regulations.
          </p>
        </div>
      </div>
    </div>
  );
}