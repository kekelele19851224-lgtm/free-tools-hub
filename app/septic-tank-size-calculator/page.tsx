"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Tank size recommendations by bedrooms
const bedroomSizing = [
  { bedrooms: 1, minGallons: 750, maxGallons: 1000, dailyFlow: 150 },
  { bedrooms: 2, minGallons: 750, maxGallons: 1000, dailyFlow: 300 },
  { bedrooms: 3, minGallons: 1000, maxGallons: 1250, dailyFlow: 450 },
  { bedrooms: 4, minGallons: 1200, maxGallons: 1500, dailyFlow: 600 },
  { bedrooms: 5, minGallons: 1500, maxGallons: 1750, dailyFlow: 750 },
  { bedrooms: 6, minGallons: 1750, maxGallons: 2000, dailyFlow: 900 }
];

// Standard tank dimensions
const standardTanks = [
  { gallons: 750, length: 92, width: 60, height: 51 },
  { gallons: 1000, length: 127, width: 60, height: 51 },
  { gallons: 1250, length: 157, width: 60, height: 51 },
  { gallons: 1500, length: 157, width: 69, height: 51 },
  { gallons: 1750, length: 180, width: 69, height: 55 },
  { gallons: 2000, length: 200, width: 72, height: 58 }
];

// FAQ data
const faqs = [
  {
    question: "How do I figure out what size septic tank I need?",
    answer: "The most common method is based on the number of bedrooms: multiply bedrooms by 150 gallons per day to get daily flow, then double it for minimum tank size. For example, a 3-bedroom home uses 450 gallons/day, so you need at least a 900-gallon tank (typically rounded up to 1,000 gallons). Most jurisdictions require a minimum of 1,000 gallons regardless of home size. Also consider garbage disposals (+50% capacity), high-flow fixtures, and local codes."
  },
  {
    question: "How many bedrooms can a 2000 gallon septic tank support?",
    answer: "A 2,000-gallon septic tank can typically support 5-6 bedrooms or up to 10-12 occupants. It can handle approximately 1,000 gallons of daily wastewater flow. This size is common for larger homes, multi-family properties, or homes with high water usage. Having a larger tank than minimum required means less frequent pumping (every 4-5 years instead of 3 years)."
  },
  {
    question: "How big is a leach field for a 3 bedroom house?",
    answer: "A leach field (drain field) for a 3-bedroom house typically requires 450-600 square feet of trench area, depending on soil percolation rate. Sandy soils with fast drainage need smaller fields (300-400 sq ft), while clay soils may need 600-900 sq ft. The total area including setbacks and reserve space is usually 4,000-6,000 square feet. A percolation test determines your specific requirements."
  },
  {
    question: "How many gallons per day can a 1000 gallon septic tank handle?",
    answer: "A 1,000-gallon septic tank can handle approximately 450-500 gallons of wastewater per day. This is based on the principle that tanks should hold at least 2 days' worth of flow for proper solids settling. A 1,000-gallon tank is suitable for a 3-bedroom home with average water usage. Higher usage from garbage disposals or water-intensive appliances may require a larger tank."
  },
  {
    question: "Does a garbage disposal affect septic tank size?",
    answer: "Yes, garbage disposals significantly increase the solids load in your septic tank—typically by 50%. Many jurisdictions require increasing tank capacity by at least 50% when a garbage disposal is installed. For example, if a 3-bedroom home normally needs 1,000 gallons, adding a garbage disposal may require 1,500 gallons. Disposals also mean more frequent pumping (every 2-3 years instead of 3-5 years)."
  },
  {
    question: "What is the minimum septic tank size allowed?",
    answer: "In most U.S. jurisdictions, the minimum septic tank size for new installations is 1,000 gallons, regardless of home size. Some areas allow 750 gallons for 1-2 bedroom homes. Always check with your local health department, as requirements vary by state and county. The minimum is designed to ensure adequate treatment time and reduce pumping frequency."
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

// Round to nearest standard tank size
function roundToStandardSize(gallons: number): number {
  const standardSizes = [750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000];
  for (const size of standardSizes) {
    if (gallons <= size) return size;
  }
  return Math.ceil(gallons / 500) * 500;
}

// Get pumping frequency estimate
function getPumpingFrequency(tankSize: number, dailyFlow: number): string {
  const ratio = tankSize / dailyFlow;
  if (ratio >= 4) return "4-5 years";
  if (ratio >= 3) return "3-4 years";
  if (ratio >= 2.5) return "2-3 years";
  return "1-2 years";
}

export default function SepticTankSizeCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"bedroom" | "occupants" | "volume">("bedroom");
  
  // Bedroom-based state
  const [bedrooms, setBedrooms] = useState<string>("3");
  const [hasDisposal, setHasDisposal] = useState<boolean>(false);
  const [hasHighFlow, setHasHighFlow] = useState<boolean>(false);
  
  // Occupant-based state
  const [occupants, setOccupants] = useState<string>("4");
  const [waterPerPerson, setWaterPerPerson] = useState<string>("75");
  const [occupantDisposal, setOccupantDisposal] = useState<boolean>(false);
  const [safetyFactor, setSafetyFactor] = useState<string>("2");
  
  // Volume-based state
  const [tankShape, setTankShape] = useState<"rectangular" | "cylindrical">("rectangular");
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("5");
  const [diameter, setDiameter] = useState<string>("6");
  const [depth, setDepth] = useState<string>("4");
  const [units, setUnits] = useState<"feet" | "meters">("feet");

  // Bedroom-based calculations
  const bedroomCount = Math.min(Math.max(parseInt(bedrooms) || 1, 1), 6);
  const bedroomData = bedroomSizing.find(b => b.bedrooms === bedroomCount) || bedroomSizing[2];
  let bedroomDailyFlow = bedroomData.dailyFlow;
  let bedroomMinTank = bedroomData.minGallons;
  
  if (hasDisposal) {
    bedroomDailyFlow *= 1.5;
    bedroomMinTank *= 1.5;
  }
  if (hasHighFlow) {
    bedroomDailyFlow *= 1.25;
    bedroomMinTank *= 1.25;
  }
  
  const bedroomRecommended = roundToStandardSize(bedroomMinTank);
  const bedroomPumpFreq = getPumpingFrequency(bedroomRecommended, bedroomDailyFlow);

  // Occupant-based calculations
  const occupantCount = parseInt(occupants) || 1;
  const waterUsage = parseFloat(waterPerPerson) || 75;
  let occupantDailyFlow = occupantCount * waterUsage;
  
  if (occupantDisposal) {
    occupantDailyFlow *= 1.5;
  }
  
  const factor = parseFloat(safetyFactor) || 2;
  const occupantMinTank = occupantDailyFlow * factor;
  const occupantRecommended = roundToStandardSize(occupantMinTank);
  const occupantPumpFreq = getPumpingFrequency(occupantRecommended, occupantDailyFlow);

  // Volume-based calculations
  const lengthVal = parseFloat(length) || 0;
  const widthVal = parseFloat(width) || 0;
  const diameterVal = parseFloat(diameter) || 0;
  const depthVal = parseFloat(depth) || 0;
  
  // Convert to feet if meters
  const lengthFt = units === "meters" ? lengthVal * 3.28084 : lengthVal;
  const widthFt = units === "meters" ? widthVal * 3.28084 : widthVal;
  const diameterFt = units === "meters" ? diameterVal * 3.28084 : diameterVal;
  const depthFt = units === "meters" ? depthVal * 3.28084 : depthVal;
  
  let volumeCuFt = 0;
  if (tankShape === "rectangular") {
    volumeCuFt = lengthFt * widthFt * depthFt;
  } else {
    volumeCuFt = Math.PI * Math.pow(diameterFt / 2, 2) * depthFt;
  }
  
  const volumeGallons = volumeCuFt * 7.48;
  const volumeLiters = volumeGallons * 3.785;
  const volumeSupports = volumeGallons >= 1750 ? "5-6" : volumeGallons >= 1200 ? "4" : volumeGallons >= 1000 ? "3" : volumeGallons >= 750 ? "1-2" : "0";
  const volumeDailyCapacity = volumeGallons / 2;

  const tabs = [
    { id: "bedroom", label: "By Bedrooms", icon: "🏠" },
    { id: "occupants", label: "By Occupants", icon: "👥" },
    { id: "volume", label: "Tank Volume", icon: "📐" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Septic Tank Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚽</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Septic Tank Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator to determine the right septic tank size for your home. 
            Calculate by number of bedrooms, occupants, or tank dimensions. Get capacity in gallons and liters.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Sizing Formula</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>Daily Flow</strong> = Bedrooms × 150 gal/day (or People × 75 gal/day)<br />
                <strong>Min Tank Size</strong> = Daily Flow × 2 (for proper settling time)
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
                backgroundColor: activeTab === tab.id ? "#059669" : "#E5E7EB",
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

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "bedroom" && "🏠 Home Details"}
                {activeTab === "occupants" && "👥 Household Size"}
                {activeTab === "volume" && "📐 Tank Dimensions"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "bedroom" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Number of Bedrooms
                    </label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} Bedroom{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={hasDisposal}
                        onChange={(e) => setHasDisposal(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                        Garbage Disposal (+50% capacity)
                      </span>
                    </label>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={hasHighFlow}
                        onChange={(e) => setHasHighFlow(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                        High-Flow Fixtures (Jacuzzi, multiple showers)
                      </span>
                    </label>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px", marginTop: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Note:</strong> Most jurisdictions require a minimum of 1,000 gallons regardless of home size. Always check local codes.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "occupants" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Number of Occupants
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={occupants}
                      onChange={(e) => setOccupants(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Water Usage (gallons/person/day)
                    </label>
                    <input
                      type="number"
                      value={waterPerPerson}
                      onChange={(e) => setWaterPerPerson(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      Typical: 60-100 gal/day. Default 75 is average.
                    </p>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Safety Factor (tank multiplier)
                    </label>
                    <select
                      value={safetyFactor}
                      onChange={(e) => setSafetyFactor(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="1.5">1.5× (Minimum)</option>
                      <option value="2">2× (Standard)</option>
                      <option value="2.5">2.5× (Conservative)</option>
                      <option value="3">3× (Extra Capacity)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={occupantDisposal}
                        onChange={(e) => setOccupantDisposal(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                        Garbage Disposal (+50%)
                      </span>
                    </label>
                  </div>
                </>
              )}

              {activeTab === "volume" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Tank Shape
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          checked={tankShape === "rectangular"}
                          onChange={() => setTankShape("rectangular")}
                        />
                        <span>Rectangular</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          checked={tankShape === "cylindrical"}
                          onChange={() => setTankShape("cylindrical")}
                        />
                        <span>Cylindrical</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Units
                    </label>
                    <select
                      value={units}
                      onChange={(e) => setUnits(e.target.value as "feet" | "meters")}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="feet">Feet</option>
                      <option value="meters">Meters</option>
                    </select>
                  </div>

                  {tankShape === "rectangular" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          Length ({units})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          Width ({units})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          Depth ({units})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={depth}
                          onChange={(e) => setDepth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          Diameter ({units})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={diameter}
                          onChange={(e) => setDiameter(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                          Depth ({units})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={depth}
                          onChange={(e) => setDepth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px", marginTop: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Formula:</strong> {tankShape === "rectangular" ? "L × W × D × 7.48 gal/ft³" : "π × r² × D × 7.48 gal/ft³"}
                    </p>
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
            <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "bedroom" && (
                <>
                  {/* Recommended Size */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Recommended Tank Size</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {bedroomRecommended.toLocaleString()} gal
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {(bedroomRecommended * 3.785).toLocaleString(undefined, {maximumFractionDigits: 0})} liters
                    </p>
                  </div>

                  {/* Details */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Calculation Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Bedrooms:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{bedroomCount}</div>
                      <div style={{ color: "#6B7280" }}>Daily Flow:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{bedroomDailyFlow.toLocaleString()} gal/day</div>
                      <div style={{ color: "#6B7280" }}>Minimum Size:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{Math.round(bedroomMinTank).toLocaleString()} gal</div>
                      <div style={{ color: "#6B7280" }}>Pump Frequency:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{bedroomPumpFreq}</div>
                    </div>
                  </div>

                  {/* Adjustments */}
                  {(hasDisposal || hasHighFlow) && (
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                        ⚠️ <strong>Adjustments Applied:</strong>{" "}
                        {hasDisposal && "Garbage Disposal (+50%)"}{hasDisposal && hasHighFlow && ", "}
                        {hasHighFlow && "High-Flow Fixtures (+25%)"}
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "occupants" && (
                <>
                  {/* Recommended Size */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Recommended Tank Size</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {occupantRecommended.toLocaleString()} gal
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {(occupantRecommended * 3.785).toLocaleString(undefined, {maximumFractionDigits: 0})} liters
                    </p>
                  </div>

                  {/* Details */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Calculation Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Occupants:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{occupantCount}</div>
                      <div style={{ color: "#6B7280" }}>Water/Person:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{waterUsage} gal/day</div>
                      <div style={{ color: "#6B7280" }}>Daily Flow:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{occupantDailyFlow.toLocaleString()} gal/day</div>
                      <div style={{ color: "#6B7280" }}>Safety Factor:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{factor}×</div>
                      <div style={{ color: "#6B7280" }}>Min. Capacity:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{Math.round(occupantMinTank).toLocaleString()} gal</div>
                      <div style={{ color: "#6B7280" }}>Pump Frequency:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{occupantPumpFreq}</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "volume" && (
                <>
                  {/* Volume Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Tank Capacity</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {volumeGallons.toLocaleString(undefined, {maximumFractionDigits: 0})} gal
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {volumeLiters.toLocaleString(undefined, {maximumFractionDigits: 0})} liters
                    </p>
                  </div>

                  {/* Capacity Info */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Tank Capacity</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Volume (ft³):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{volumeCuFt.toFixed(1)} ft³</div>
                      <div style={{ color: "#6B7280" }}>Supports:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{volumeSupports} bedrooms</div>
                      <div style={{ color: "#6B7280" }}>Daily Capacity:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{volumeDailyCapacity.toLocaleString(undefined, {maximumFractionDigits: 0})} gal/day</div>
                    </div>
                  </div>

                  {/* Warning if too small */}
                  {volumeGallons > 0 && volumeGallons < 750 && (
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#991B1B" }}>
                        ⚠️ Tank is below minimum residential size (750 gal). Most codes require at least 1,000 gallons.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Standard Sizes Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Septic Tank Size Guide</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Bedrooms</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Min. Tank Size</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Daily Flow</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Max Occupants</th>
                </tr>
              </thead>
              <tbody>
                {bedroomSizing.map((row, idx) => (
                  <tr key={row.bedrooms} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.bedrooms} Bedroom{row.bedrooms > 1 ? "s" : ""}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{row.minGallons.toLocaleString()} - {row.maxGallons.toLocaleString()} gal</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.dailyFlow} gal/day</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.bedrooms * 2} people</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Based on 150 gallons/day per bedroom and 2× daily flow for tank sizing. Add 50% for garbage disposals.
            </p>
          </div>
        </div>

        {/* Tank Dimensions Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Standard Tank Dimensions</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#E0F2FE" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Capacity</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Length</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Width</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Height</th>
                </tr>
              </thead>
              <tbody>
                {standardTanks.map((tank, idx) => (
                  <tr key={tank.gallons} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#0891B2" }}>{tank.gallons.toLocaleString()} gal</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{tank.length}&quot;</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{tank.width}&quot;</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{tank.height}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Dimensions are for low-profile concrete/plastic septic tanks. Actual dimensions vary by manufacturer.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🚽 Understanding Septic Tank Sizing</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A properly sized <strong>septic tank</strong> is crucial for effective wastewater treatment. 
                  The tank must be large enough to hold waste long enough for solids to settle (typically 24-48 hours) 
                  before liquid effluent flows to the drain field.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Bedrooms, Not Bathrooms?</h3>
                <p>
                  Health departments use bedrooms to calculate potential occupancy: 2 people per bedroom × 75 gallons/day = 150 gallons per bedroom. 
                  This ensures the system can handle maximum capacity even if the home is sold to a larger family.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors That Increase Size</h3>
                <p>
                  <strong>Garbage disposals</strong> add 50% more solids. <strong>High-flow fixtures</strong> like Jacuzzis, 
                  multiple showers, or large washing machines increase daily flow. <strong>Water softeners</strong> that 
                  backwash into the septic also require larger tanks.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Local Codes Matter</h3>
                <p>
                  Most U.S. jurisdictions require a minimum 1,000-gallon tank regardless of home size. 
                  Always check with your local health department before installing. A percolation test determines 
                  drain field requirements based on soil absorption rate.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Quick Facts</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ 150 gal/day per bedroom</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ 75 gal/day per person</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Tank = 2× daily flow</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Pump every 3-5 years</p>
                <p style={{ margin: 0 }}>✓ 1,000 gal minimum (most areas)</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Important</h3>
              <p style={{ fontSize: "0.85rem", color: "#B45309", margin: 0, lineHeight: "1.6" }}>
                An undersized tank causes backups, odors, and drain field failure. When in doubt, go one size larger. The extra cost is minimal compared to repairs.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/septic-tank-size-calculator" currentCategory="Home" />
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
            🚽 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. 
            Septic system requirements vary by location. Always consult your local health department and obtain 
            proper permits before installing a septic system. A licensed professional should design your system.
          </p>
        </div>
      </div>
    </div>
  );
}