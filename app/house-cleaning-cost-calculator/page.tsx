"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Cleaning types with rates
const cleaningTypes = {
  "standard": { 
    name: "Standard Cleaning", 
    description: "Regular maintenance cleaning",
    rateMin: 0.08, 
    rateMax: 0.15,
    timeMultiplier: 1
  },
  "deep": { 
    name: "Deep Cleaning", 
    description: "Thorough top-to-bottom cleaning",
    rateMin: 0.15, 
    rateMax: 0.30,
    timeMultiplier: 1.8
  },
  "moveout": { 
    name: "Move-out Cleaning", 
    description: "Comprehensive cleaning for moving",
    rateMin: 0.20, 
    rateMax: 0.35,
    timeMultiplier: 2
  }
};

// Frequency discounts
const frequencies = {
  "onetime": { name: "One-time", discount: 0, description: "Single visit" },
  "weekly": { name: "Weekly", discount: 0.20, description: "20% off" },
  "biweekly": { name: "Bi-weekly", discount: 0.15, description: "15% off" },
  "monthly": { name: "Monthly", discount: 0.10, description: "10% off" }
};

// Add-on services
const addOnServices = [
  { id: "oven", name: "Oven Interior", priceMin: 25, priceMax: 50 },
  { id: "fridge", name: "Refrigerator Interior", priceMin: 25, priceMax: 50 },
  { id: "windows", name: "Interior Windows (per window)", priceMin: 5, priceMax: 10, perUnit: true },
  { id: "cabinets", name: "Inside Cabinets", priceMin: 30, priceMax: 60 },
  { id: "laundry", name: "Laundry & Bed Linens", priceMin: 20, priceMax: 40 },
  { id: "blinds", name: "Blinds Cleaning", priceMin: 15, priceMax: 30 },
  { id: "garage", name: "Garage Cleaning", priceMin: 50, priceMax: 100 },
  { id: "walls", name: "Wall Washing", priceMin: 40, priceMax: 80 }
];

// Room rates
const roomRates = {
  bedroom: { min: 20, max: 30 },
  bathroom: { min: 25, max: 40 },
  kitchen: { min: 25, max: 50 }
};

// Time estimates (hours per 1000 sq ft for standard cleaning)
const getCleaningTime = (sqft: number, type: string): { min: number; max: number } => {
  const baseTimeMin = sqft / 600; // 600 sq ft per hour (fast)
  const baseTimeMax = sqft / 400; // 400 sq ft per hour (thorough)
  const multiplier = cleaningTypes[type as keyof typeof cleaningTypes].timeMultiplier;
  return {
    min: Math.round(baseTimeMin * multiplier * 10) / 10,
    max: Math.round(baseTimeMax * multiplier * 10) / 10
  };
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate the price to clean a house?",
    answer: "To calculate house cleaning costs, multiply square footage by $0.08-$0.15 for standard cleaning or $0.15-$0.30 for deep cleaning. Add $20-$30 per extra bedroom and $25-$40 per bathroom. Include add-on services like oven cleaning ($25-$50) or window cleaning ($5-$10 per window). For a 2,000 sq ft home with 3 beds and 2 baths, expect $130-$220 for standard cleaning or $240-$450 for deep cleaning."
  },
  {
    question: "What is the 80/20 rule in house cleaning?",
    answer: "The 80/20 rule (Pareto Principle) in house cleaning means 20% of your home gets 80% of the use and dirt. Focus cleaning efforts on high-traffic areas like kitchens, bathrooms, and entryways. For cleaning businesses, it also means 80% of revenue often comes from 20% of clients—prioritize recurring customers. Apply this by doing quick daily cleaning of high-use areas and deeper cleaning of low-traffic areas weekly."
  },
  {
    question: "How much to clean a 1000 square foot house?",
    answer: "A 1,000 sq ft house typically costs $80-$120 for standard cleaning and $150-$250 for deep cleaning. This assumes 1-2 bedrooms and 1 bathroom. Standard cleaning takes 1.5-2 hours, while deep cleaning takes 3-4 hours. Add $25-$40 per extra bathroom and $20-$30 per extra bedroom. Move-out cleaning for this size runs $180-$300."
  },
  {
    question: "How long does it take to deep clean a 2000 sq ft house?",
    answer: "Deep cleaning a 2,000 sq ft house typically takes 5-7 hours for one cleaner or 2.5-3.5 hours for a two-person team. Standard cleaning of the same home takes 2.5-3.5 hours solo. Factors affecting time include clutter level, number of bathrooms (add 30-45 min each for deep clean), pets, and specific add-ons like oven or refrigerator cleaning (30 min each)."
  },
  {
    question: "How much should I charge per hour for house cleaning?",
    answer: "Independent house cleaners typically charge $25-$50 per hour, while cleaning companies charge $50-$100 per hour (for a 2-person team). Rates vary by location—urban areas average $35-$60/hour, while rural areas are $20-$35/hour. Deep cleaning commands $40-$75/hour. Factor in supplies ($5-$15), travel time, and overhead. Most pros aim for $25-$35/hour take-home after expenses."
  },
  {
    question: "What is included in a standard house cleaning?",
    answer: "Standard house cleaning typically includes: dusting all surfaces and furniture, vacuuming carpets and mopping floors, cleaning and disinfecting bathrooms (toilet, sink, tub/shower), kitchen cleaning (counters, stovetop exterior, sink), making beds, emptying trash, and general tidying. It does NOT include inside ovens/refrigerators, interior windows, inside cabinets, laundry, wall washing, or deep carpet cleaning—these are add-on services."
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

export default function HouseCleaningCostCalculator() {
  const [activeTab, setActiveTab] = useState<"quick" | "detailed">("quick");
  
  // Tab 1: Quick Estimate State
  const [homeSize, setHomeSize] = useState<string>("2000");
  const [bedrooms, setBedrooms] = useState<string>("3");
  const [bathrooms, setBathrooms] = useState<string>("2");
  const [cleaningType, setCleaningType] = useState<string>("standard");
  const [frequency, setFrequency] = useState<string>("onetime");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [windowCount, setWindowCount] = useState<string>("10");
  
  // Tab 2: Detailed Calculator State
  const [pricingMethod, setPricingMethod] = useState<string>("sqft");
  const [customSqFtRate, setCustomSqFtRate] = useState<string>("0.12");
  const [hourlyRate, setHourlyRate] = useState<string>("35");
  const [numCleaners, setNumCleaners] = useState<string>("1");
  const [supplyCost, setSupplyCost] = useState<string>("10");
  const [overheadPercent, setOverheadPercent] = useState<string>("15");
  const [profitMargin, setProfitMargin] = useState<string>("20");

  // Calculations - Tab 1
  const sqft = parseFloat(homeSize) || 0;
  const beds = parseInt(bedrooms) || 0;
  const baths = parseInt(bathrooms) || 0;
  const windows = parseInt(windowCount) || 0;
  const typeData = cleaningTypes[cleaningType as keyof typeof cleaningTypes];
  const freqData = frequencies[frequency as keyof typeof frequencies];
  
  // Base cost by square footage
  const baseCostMin = sqft * typeData.rateMin;
  const baseCostMax = sqft * typeData.rateMax;
  
  // Room costs (assuming base includes 1 bed, 1 bath)
  const extraBeds = Math.max(0, beds - 1);
  const extraBaths = Math.max(0, baths - 1);
  const roomCostMin = (extraBeds * roomRates.bedroom.min) + (extraBaths * roomRates.bathroom.min);
  const roomCostMax = (extraBeds * roomRates.bedroom.max) + (extraBaths * roomRates.bathroom.max);
  
  // Add-on costs
  let addOnCostMin = 0;
  let addOnCostMax = 0;
  selectedAddOns.forEach(id => {
    const addon = addOnServices.find(a => a.id === id);
    if (addon) {
      if (addon.perUnit && id === "windows") {
        addOnCostMin += addon.priceMin * windows;
        addOnCostMax += addon.priceMax * windows;
      } else {
        addOnCostMin += addon.priceMin;
        addOnCostMax += addon.priceMax;
      }
    }
  });
  
  // Subtotal before discount
  const subtotalMin = baseCostMin + roomCostMin + addOnCostMin;
  const subtotalMax = baseCostMax + roomCostMax + addOnCostMax;
  
  // Apply frequency discount
  const discountAmount = freqData.discount;
  const totalMin = subtotalMin * (1 - discountAmount);
  const totalMax = subtotalMax * (1 - discountAmount);
  
  // Time estimate
  const timeEstimate = getCleaningTime(sqft, cleaningType);
  
  // Toggle add-on selection
  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // Calculations - Tab 2
  const detailedSqft = sqft;
  const cleaners = parseInt(numCleaners) || 1;
  const hourly = parseFloat(hourlyRate) || 35;
  const supplies = parseFloat(supplyCost) || 0;
  const overhead = parseFloat(overheadPercent) || 0;
  const profit = parseFloat(profitMargin) || 0;
  const sqftRate = parseFloat(customSqFtRate) || 0.12;
  
  let detailedBaseCost = 0;
  let estimatedHours = 0;
  
  if (pricingMethod === "sqft") {
    detailedBaseCost = detailedSqft * sqftRate;
    estimatedHours = detailedSqft / 500; // Avg 500 sq ft per hour
  } else if (pricingMethod === "hourly") {
    estimatedHours = detailedSqft / 500;
    detailedBaseCost = estimatedHours * hourly * cleaners;
  } else if (pricingMethod === "room") {
    detailedBaseCost = (beds * roomRates.bedroom.max) + (baths * roomRates.bathroom.max) + roomRates.kitchen.max;
    estimatedHours = detailedSqft / 500;
  }
  
  const laborCost = estimatedHours * hourly * cleaners;
  const totalCostBeforeMargin = laborCost + supplies;
  const overheadCost = totalCostBeforeMargin * (overhead / 100);
  const subtotalWithOverhead = totalCostBeforeMargin + overheadCost;
  const profitAmount = subtotalWithOverhead * (profit / 100);
  const finalQuote = subtotalWithOverhead + profitAmount;
  const effectiveHourlyRate = finalQuote / estimatedHours;

  const tabs = [
    { id: "quick", label: "Quick Estimate", icon: "🏠" },
    { id: "detailed", label: "Pricing Calculator", icon: "💼" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>House Cleaning Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🧹</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              House Cleaning Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate house cleaning costs based on home size, number of rooms, cleaning type, and add-on services. 
            Get accurate pricing for standard, deep, or move-out cleaning.
          </p>
        </div>

        {/* Quick Reference Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #6EE7B7"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>Quick Pricing Guide</p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.9rem", color: "#047857" }}>
                <span><strong>Standard:</strong> $0.08-$0.15/sq ft</span>
                <span><strong>Deep Clean:</strong> $0.15-$0.30/sq ft</span>
                <span><strong>Move-out:</strong> $0.20-$0.35/sq ft</span>
                <span><strong>Hourly:</strong> $25-$50/hour</span>
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
                backgroundColor: activeTab === tab.id ? "#0891B2" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "quick" && "🏠 Home Details"}
                {activeTab === "detailed" && "💼 Pricing Setup"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "650px", overflowY: "auto" }}>
              {/* QUICK ESTIMATE TAB */}
              {activeTab === "quick" && (
                <>
                  {/* Home Size */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Home Size (square feet)
                    </label>
                    <input
                      type="number"
                      value={homeSize}
                      onChange={(e) => setHomeSize(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[1000, 1500, 2000, 2500, 3000].map((size) => (
                        <button
                          key={size}
                          onClick={() => setHomeSize(size.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: homeSize === size.toString() ? "2px solid #0891B2" : "1px solid #E5E7EB",
                            backgroundColor: homeSize === size.toString() ? "#ECFEFF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {size.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bedrooms & Bathrooms */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Bedrooms
                      </label>
                      <select
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Bathrooms
                      </label>
                      <select
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cleaning Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Cleaning Type
                    </label>
                    {Object.entries(cleaningTypes).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "10px 12px",
                          marginBottom: "6px",
                          borderRadius: "8px",
                          border: cleaningType === key ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: cleaningType === key ? "#ECFEFF" : "white",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="radio"
                          name="cleaningType"
                          value={key}
                          checked={cleaningType === key}
                          onChange={(e) => setCleaningType(e.target.value)}
                          style={{ marginTop: "2px" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "0.85rem", color: "#111827" }}>{value.name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>{value.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Frequency */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Cleaning Frequency
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
                      {Object.entries(frequencies).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => setFrequency(key)}
                          style={{
                            padding: "8px 4px",
                            borderRadius: "8px",
                            border: frequency === key ? "2px solid #0891B2" : "1px solid #E5E7EB",
                            backgroundColor: frequency === key ? "#ECFEFF" : "white",
                            color: frequency === key ? "#0891B2" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            textAlign: "center"
                          }}
                        >
                          {value.name}
                          {value.discount > 0 && (
                            <span style={{ display: "block", fontSize: "0.65rem", color: "#059669" }}>
                              {value.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add-on Services */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Add-on Services (optional)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {addOnServices.map((addon) => (
                        <label
                          key={addon.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            border: selectedAddOns.includes(addon.id) ? "2px solid #0891B2" : "1px solid #E5E7EB",
                            backgroundColor: selectedAddOns.includes(addon.id) ? "#ECFEFF" : "white",
                            cursor: "pointer",
                            fontSize: "0.75rem"
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAddOns.includes(addon.id)}
                            onChange={() => toggleAddOn(addon.id)}
                          />
                          <div>
                            <span style={{ fontWeight: "500", color: "#374151" }}>{addon.name}</span>
                            <span style={{ display: "block", color: "#059669", fontSize: "0.65rem" }}>
                              ${addon.priceMin}-${addon.priceMax}{addon.perUnit ? "/ea" : ""}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Window Count (if windows selected) */}
                  {selectedAddOns.includes("windows") && (
                    <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Number of Windows
                      </label>
                      <input
                        type="number"
                        value={windowCount}
                        onChange={(e) => setWindowCount(e.target.value)}
                        min="1"
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* DETAILED CALCULATOR TAB */}
              {activeTab === "detailed" && (
                <>
                  {/* Project Summary */}
                  <div style={{ padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px", marginBottom: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
                      <strong>Project:</strong> {sqft.toLocaleString()} sq ft, {beds} bed, {baths} bath
                    </p>
                  </div>

                  {/* Pricing Method */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Pricing Method
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { id: "sqft", label: "Per Sq Ft" },
                        { id: "hourly", label: "Hourly" },
                        { id: "room", label: "Per Room" }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPricingMethod(method.id)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: pricingMethod === method.id ? "2px solid #0891B2" : "1px solid #E5E7EB",
                            backgroundColor: pricingMethod === method.id ? "#ECFEFF" : "white",
                            color: pricingMethod === method.id ? "#0891B2" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Rate based on method */}
                  {pricingMethod === "sqft" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Rate per Square Foot ($)
                      </label>
                      <input
                        type="number"
                        value={customSqFtRate}
                        onChange={(e) => setCustomSqFtRate(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                        Typical range: $0.08-$0.15 (standard), $0.15-$0.30 (deep)
                      </p>
                    </div>
                  )}

                  {/* Hourly Rate & Cleaners */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Number of Cleaners
                      </label>
                      <select
                        value={numCleaners}
                        onChange={(e) => setNumCleaners(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {[1, 2, 3, 4].map(n => (
                          <option key={n} value={n}>{n} cleaner{n > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Supply Cost */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Supply Cost ($)
                    </label>
                    <input
                      type="number"
                      value={supplyCost}
                      onChange={(e) => setSupplyCost(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Cleaning products, equipment wear (~$5-$15 per job)
                    </p>
                  </div>

                  {/* Overhead & Profit */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Overhead (%)
                      </label>
                      <input
                        type="number"
                        value={overheadPercent}
                        onChange={(e) => setOverheadPercent(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                        Insurance, travel, admin
                      </p>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Profit Margin (%)
                      </label>
                      <input
                        type="number"
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                        Target: 15-25%
                      </p>
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
                {activeTab === "quick" && "💰 Cost Estimate"}
                {activeTab === "detailed" && "📋 Quote Breakdown"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* QUICK ESTIMATE RESULTS */}
              {activeTab === "quick" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${Math.round(totalMin)} - ${Math.round(totalMax)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {typeData.name} • {sqft.toLocaleString()} sq ft
                    </p>
                  </div>

                  {/* Time Estimate */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Estimated Time</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        {timeEstimate.min}-{timeEstimate.max} hrs
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#92400E" }}>
                        (1 cleaner)
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Per Sq Ft</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${(totalMin / sqft).toFixed(2)}-${(totalMax / sqft).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Base ({sqft.toLocaleString()} sq ft)</span>
                        <span style={{ fontWeight: "600" }}>${Math.round(baseCostMin)}-${Math.round(baseCostMax)}</span>
                      </div>
                      {extraBeds > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Extra Bedrooms ({extraBeds})</span>
                          <span style={{ fontWeight: "600" }}>${extraBeds * roomRates.bedroom.min}-${extraBeds * roomRates.bedroom.max}</span>
                        </div>
                      )}
                      {extraBaths > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Extra Bathrooms ({extraBaths})</span>
                          <span style={{ fontWeight: "600" }}>${extraBaths * roomRates.bathroom.min}-${extraBaths * roomRates.bathroom.max}</span>
                        </div>
                      )}
                      {addOnCostMin > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Add-on Services</span>
                          <span style={{ fontWeight: "600" }}>${Math.round(addOnCostMin)}-${Math.round(addOnCostMax)}</span>
                        </div>
                      )}
                      {discountAmount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", color: "#059669" }}>
                          <span>{freqData.name} Discount ({(discountAmount * 100).toFixed(0)}%)</span>
                          <span style={{ fontWeight: "600" }}>-${Math.round(subtotalMin * discountAmount)}-${Math.round(subtotalMax * discountAmount)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Total</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${Math.round(totalMin)}-${Math.round(totalMax)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Frequency Tip */}
                  {frequency === "onetime" && (
                    <div style={{ backgroundColor: "#ECFEFF", borderRadius: "10px", padding: "12px", border: "1px solid #A5F3FC" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#0E7490" }}>
                        💡 <strong>Save money!</strong> Weekly cleaning saves 20%, bi-weekly saves 15%, monthly saves 10%.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* DETAILED CALCULATOR RESULTS */}
              {activeTab === "detailed" && (
                <>
                  {/* Final Quote */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Recommended Quote
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${Math.round(finalQuote)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Based on {pricingMethod === "sqft" ? "per sq ft" : pricingMethod === "hourly" ? "hourly" : "per room"} pricing
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Effective Hourly</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ${effectiveHourlyRate.toFixed(2)}/hr
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Est. Duration</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {estimatedHours.toFixed(1)} hrs
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Quote Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Labor ({estimatedHours.toFixed(1)} hrs × ${hourly} × {cleaners})</span>
                        <span style={{ fontWeight: "600" }}>${laborCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Supplies</span>
                        <span style={{ fontWeight: "600" }}>${supplies.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Overhead ({overhead}%)</span>
                        <span style={{ fontWeight: "600" }}>${overheadCost.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Profit ({profit}%)</span>
                        <span style={{ fontWeight: "600" }}>${profitAmount.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Final Quote</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${finalQuote.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Per Unit Costs */}
                  <div style={{ backgroundColor: "#ECFEFF", borderRadius: "10px", padding: "12px", border: "1px solid #A5F3FC" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", fontWeight: "600", color: "#0E7490" }}>💼 Per Unit Costs</p>
                    <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", color: "#0891B2", flexWrap: "wrap" }}>
                      <span><strong>Per Sq Ft:</strong> ${(finalQuote / sqft).toFixed(3)}</span>
                      <span><strong>Per Room:</strong> ${(finalQuote / (beds + baths)).toFixed(2)}</span>
                      <span><strong>Per Hour:</strong> ${effectiveHourlyRate.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 House Cleaning Price Guide</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Home Size</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Standard Clean</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Deep Clean</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Move-out Clean</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Est. Time</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: "1,000 sq ft", beds: "1-2 bed", standard: "$80-$150", deep: "$150-$300", moveout: "$200-$350", time: "1.5-2 hrs" },
                  { size: "1,500 sq ft", beds: "2-3 bed", standard: "$100-$180", deep: "$180-$350", moveout: "$250-$450", time: "2-3 hrs" },
                  { size: "2,000 sq ft", beds: "3-4 bed", standard: "$130-$220", deep: "$220-$450", moveout: "$350-$550", time: "2.5-4 hrs" },
                  { size: "2,500 sq ft", beds: "4-5 bed", standard: "$160-$280", deep: "$280-$550", moveout: "$450-$700", time: "3-5 hrs" },
                  { size: "3,000 sq ft", beds: "4-6 bed", standard: "$200-$350", deep: "$350-$650", moveout: "$550-$850", time: "4-6 hrs" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>
                      <strong>{row.size}</strong><br/>
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{row.beds}</span>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>{row.standard}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB" }}>{row.deep}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>{row.moveout}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Prices are estimates based on national averages. Actual costs vary by location, condition, and specific requirements.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🧹 Understanding House Cleaning Costs</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>Standard vs. Deep Cleaning</h3>
                <p>
                  <strong>Standard cleaning</strong> includes routine tasks: dusting, vacuuming, mopping, bathroom sanitizing, 
                  kitchen surface cleaning, and general tidying. It&apos;s ideal for regular maintenance every 1-2 weeks. 
                  <strong>Deep cleaning</strong> goes further with detailed scrubbing, baseboards, light fixtures, inside 
                  appliances, and hard-to-reach areas. Most homes need deep cleaning 2-4 times per year or as an initial 
                  cleaning before switching to standard maintenance.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors Affecting Price</h3>
                <p>
                  Home size is the primary factor, but number of bathrooms often matters more than bedrooms since they 
                  require more intensive cleaning. Additional factors include clutter level, pet hair, number of occupants, 
                  time since last cleaning, and special requests. First-time cleanings typically cost 20-50% more than 
                  recurring visits since they establish a baseline cleanliness.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Saving on Cleaning Costs</h3>
                <p>
                  Book recurring services for 10-20% discounts. Declutter before the cleaner arrives—less stuff means 
                  faster cleaning. Combine services with neighbors for multi-home discounts. Skip weekly service for 
                  bi-weekly if budget is tight. Handle some add-ons yourself (like laundry) to reduce costs. Get quotes 
                  from multiple cleaners and check reviews, not just price.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#ECFEFF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A5F3FC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0E7490", marginBottom: "16px" }}>✅ What&apos;s Included</h3>
              <div style={{ fontSize: "0.85rem", color: "#0891B2" }}>
                <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>Standard Cleaning:</p>
                <ul style={{ margin: "0 0 12px 0", paddingLeft: "20px", lineHeight: "1.6" }}>
                  <li>Dusting all surfaces</li>
                  <li>Vacuuming & mopping</li>
                  <li>Bathroom cleaning</li>
                  <li>Kitchen surfaces</li>
                  <li>Making beds</li>
                  <li>Emptying trash</li>
                </ul>
                <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>Deep Clean Adds:</p>
                <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6" }}>
                  <li>Baseboards & trim</li>
                  <li>Light fixtures</li>
                  <li>Behind furniture</li>
                  <li>Door frames</li>
                  <li>Detailed scrubbing</li>
                </ul>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 The 80/20 Rule</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                20% of your home gets 80% of the use. Focus regular cleaning on: kitchens, bathrooms, 
                entryways, and living rooms. Deep clean low-traffic areas (guest rooms, closets) less often.
              </p>
            </div>

            <RelatedTools currentUrl="/house-cleaning-cost-calculator" currentCategory="Home" />
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
            🧹 <strong>Disclaimer:</strong> This calculator provides estimates based on national averages. 
            Actual cleaning costs vary by location, home condition, cleaning company, and specific requirements. 
            Always get quotes from multiple providers and verify what services are included.
          </p>
        </div>
      </div>
    </div>
  );
}