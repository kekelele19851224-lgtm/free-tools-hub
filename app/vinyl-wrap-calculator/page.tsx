"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Vehicle size categories
const vehicleSizes = [
  { 
    id: "small", 
    label: "Small Car", 
    icon: "🚗",
    vinylFt: { min: 50, max: 55 },
    examples: "Audi A3/A4, BMW 2/3 Series, VW Golf, Honda Civic, Toyota Corolla, Mazda 3",
    avgLength: 14.5
  },
  { 
    id: "midsize", 
    label: "Mid-size Car", 
    icon: "🚙",
    vinylFt: { min: 60, max: 65 },
    examples: "Toyota Camry, Honda Accord, Tesla Model 3, Ford Mustang, BMW 5 Series, Audi A6",
    avgLength: 16
  },
  { 
    id: "fullsize", 
    label: "Full-size / Small SUV", 
    icon: "🚐",
    vinylFt: { min: 65, max: 75 },
    examples: "BMW 7 Series, Mercedes S-Class, Toyota RAV4, Honda CR-V, Audi Q5",
    avgLength: 17
  },
  { 
    id: "largesuv", 
    label: "Large SUV / Truck", 
    icon: "🛻",
    vinylFt: { min: 75, max: 100 },
    examples: "Ford F-150, Chevy Suburban, Cadillac Escalade, Toyota Tundra, GMC Sierra",
    avgLength: 19
  },
  { 
    id: "motorcycle", 
    label: "Motorcycle", 
    icon: "🏍️",
    vinylFt: { min: 10, max: 15 },
    examples: "Standard motorcycles, sport bikes, cruisers",
    avgLength: 7
  }
];

// Vehicle parts for partial wrap
const vehicleParts = [
  { id: "hood", label: "Hood", sqft: { min: 20, max: 30 }, icon: "🔲" },
  { id: "roof", label: "Roof", sqft: { min: 15, max: 25 }, icon: "⬛" },
  { id: "trunk", label: "Trunk/Tailgate", sqft: { min: 12, max: 20 }, icon: "📦" },
  { id: "frontBumper", label: "Front Bumper", sqft: { min: 15, max: 22 }, icon: "🔳" },
  { id: "rearBumper", label: "Rear Bumper", sqft: { min: 12, max: 18 }, icon: "🔳" },
  { id: "leftDoors", label: "Left Side Doors", sqft: { min: 30, max: 44 }, icon: "🚪" },
  { id: "rightDoors", label: "Right Side Doors", sqft: { min: 30, max: 44 }, icon: "🚪" },
  { id: "fenders", label: "Fenders (All)", sqft: { min: 10, max: 15 }, icon: "🔧" },
  { id: "mirrors", label: "Side Mirrors", sqft: { min: 2, max: 4 }, icon: "🪞" },
  { id: "rocker", label: "Rocker Panels", sqft: { min: 8, max: 12 }, icon: "➖" }
];

// Vinyl cost data
const vinylCosts = {
  budget: { perFt: 3, label: "Budget Vinyl", durability: "2-3 years" },
  midRange: { perFt: 6, label: "Mid-Range (3M, Avery)", durability: "5-7 years" },
  premium: { perFt: 10, label: "Premium (Color Shift, Chrome)", durability: "5-7 years" }
};

// Professional installation costs
const professionalCosts = {
  small: { min: 1500, max: 2500 },
  midsize: { min: 2000, max: 3500 },
  fullsize: { min: 2500, max: 4000 },
  largesuv: { min: 3500, max: 5500 },
  motorcycle: { min: 500, max: 1000 }
};

// Size chart data
const sizeChartData = [
  { vehicle: "Mini Cooper, Fiat 500", size: "Small", vinyl: "50 ft", sqft: "200-220" },
  { vehicle: "Honda Civic, Toyota Corolla", size: "Small", vinyl: "50-55 ft", sqft: "220-250" },
  { vehicle: "BMW 3 Series, Audi A4", size: "Small", vinyl: "55 ft", sqft: "240-260" },
  { vehicle: "Toyota Camry, Honda Accord", size: "Mid-size", vinyl: "60-65 ft", sqft: "260-290" },
  { vehicle: "Tesla Model 3, Ford Mustang", size: "Mid-size", vinyl: "60-65 ft", sqft: "270-300" },
  { vehicle: "BMW 5 Series, Mercedes E-Class", size: "Mid-size", vinyl: "65 ft", sqft: "280-310" },
  { vehicle: "Toyota RAV4, Honda CR-V", size: "Small SUV", vinyl: "65-70 ft", sqft: "290-320" },
  { vehicle: "BMW X5, Audi Q7", size: "Mid SUV", vinyl: "70-75 ft", sqft: "310-350" },
  { vehicle: "Ford F-150, Chevy Silverado", size: "Truck", vinyl: "75-85 ft", sqft: "340-380" },
  { vehicle: "Chevy Suburban, Ford Expedition", size: "Large SUV", vinyl: "85-100 ft", sqft: "380-420" }
];

// FAQ data
const faqs = [
  {
    question: "How to calculate how much vinyl wrap for a car?",
    answer: "Use the simple formula: Vehicle Length (ft) × 3 + 10-15 ft extra = Total vinyl needed. For example, a 16-foot sedan needs about 16 × 3 + 10 = 58 feet of vinyl. Alternatively, use our calculator above which accounts for vehicle size and includes waste allowance automatically."
  },
  {
    question: "How many sq ft of vinyl to wrap a truck?",
    answer: "A full-size truck like Ford F-150 or Chevy Silverado typically requires 340-380 square feet of vinyl, which equals about 75-85 linear feet of standard 5-foot wide vinyl roll. Larger trucks with extended cabs or long beds may need up to 100 feet."
  },
  {
    question: "Is it cheaper to paint a car or wrap it?",
    answer: "Vinyl wrapping is typically 30-50% cheaper than a quality paint job. A professional wrap costs $2,000-$5,000, while a comparable paint job costs $3,000-$10,000. DIY wrapping can cost as little as $500-$800 in materials. Plus, wraps protect original paint and can be removed without damage."
  },
  {
    question: "How much does it cost to vinyl wrap a whole car?",
    answer: "Professional full car wrap costs $2,000-$5,000 depending on vehicle size and vinyl quality. DIY wrapping costs $500-$1,500 for materials only. Factors affecting price include vinyl type (matte, gloss, chrome), vehicle size, and design complexity."
  },
  {
    question: "How long does vinyl wrap last?",
    answer: "Quality vinyl wrap lasts 5-7 years with proper care. Budget vinyl may only last 2-3 years. Factors affecting lifespan include sun exposure, climate, washing frequency, and vinyl quality. Premium brands like 3M and Avery offer the longest durability."
  },
  {
    question: "How much vinyl to wrap a car hood?",
    answer: "A car hood typically requires 20-30 square feet of vinyl, which translates to about 4-6 feet of a 5-foot wide roll. Always add 10-20% extra for trimming and mistakes. Larger vehicles like trucks may need up to 35 square feet for the hood."
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

export default function VinylWrapCalculator() {
  // Full wrap calculator
  const [selectedSize, setSelectedSize] = useState<string>("midsize");
  const [wastePercent, setWastePercent] = useState<number>(15);
  const [rollWidth, setRollWidth] = useState<number>(5);

  // Partial wrap calculator
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [vehicleSizeForParts, setVehicleSizeForParts] = useState<"small" | "large">("small");

  // Full wrap results
  const fullWrapResults = useMemo(() => {
    const vehicle = vehicleSizes.find(v => v.id === selectedSize);
    if (!vehicle) return null;

    const baseMin = vehicle.vinylFt.min;
    const baseMax = vehicle.vinylFt.max;
    
    // Add waste
    const withWasteMin = Math.ceil(baseMin * (1 + wastePercent / 100));
    const withWasteMax = Math.ceil(baseMax * (1 + wastePercent / 100));
    
    // Calculate square feet (assuming 5ft wide roll)
    const sqftMin = Math.round(baseMin * rollWidth);
    const sqftMax = Math.round(baseMax * rollWidth);

    // Cost estimates
    const diyCostMin = Math.round(withWasteMin * vinylCosts.midRange.perFt);
    const diyCostMax = Math.round(withWasteMax * vinylCosts.midRange.perFt);
    
    const proCost = professionalCosts[selectedSize as keyof typeof professionalCosts];

    return {
      vinylFtMin: withWasteMin,
      vinylFtMax: withWasteMax,
      sqftMin,
      sqftMax,
      diyCostMin,
      diyCostMax,
      proCostMin: proCost.min,
      proCostMax: proCost.max,
      vehicle
    };
  }, [selectedSize, wastePercent, rollWidth]);

  // Partial wrap results
  const partialWrapResults = useMemo(() => {
    if (selectedParts.length === 0) return null;

    let totalSqftMin = 0;
    let totalSqftMax = 0;

    selectedParts.forEach(partId => {
      const part = vehicleParts.find(p => p.id === partId);
      if (part) {
        // Adjust for vehicle size
        const multiplier = vehicleSizeForParts === "large" ? 1.3 : 1;
        totalSqftMin += part.sqft.min * multiplier;
        totalSqftMax += part.sqft.max * multiplier;
      }
    });

    // Add waste
    const withWasteMin = Math.ceil(totalSqftMin * 1.15);
    const withWasteMax = Math.ceil(totalSqftMax * 1.20);

    // Convert to linear feet (assuming 5ft wide)
    const linearFtMin = Math.ceil(withWasteMin / rollWidth);
    const linearFtMax = Math.ceil(withWasteMax / rollWidth);

    // Cost estimates
    const diyCostMin = Math.round(linearFtMin * vinylCosts.midRange.perFt);
    const diyCostMax = Math.round(linearFtMax * vinylCosts.midRange.perFt);

    return {
      sqftMin: Math.round(totalSqftMin),
      sqftMax: Math.round(totalSqftMax),
      withWasteMin,
      withWasteMax,
      linearFtMin,
      linearFtMax,
      diyCostMin,
      diyCostMax
    };
  }, [selectedParts, vehicleSizeForParts, rollWidth]);

  const togglePart = (partId: string) => {
    setSelectedParts(prev =>
      prev.includes(partId)
        ? prev.filter(p => p !== partId)
        : [...prev, partId]
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Vinyl Wrap Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🎨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Vinyl Wrap Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much vinyl wrap you need for your car. Get estimates by vehicle size or specific parts, plus DIY and professional installation costs.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#F5F3FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #DDD6FE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>Quick Formula</p>
              <p style={{ color: "#5B21B6", margin: 0, fontSize: "0.95rem", fontFamily: "monospace" }}>
                Vinyl (ft) = Vehicle Length (ft) × 3 + 10-15 ft extra for bumpers & waste
              </p>
            </div>
          </div>
        </div>

        {/* Main Calculators Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Full Wrap Calculator */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚗 Full Wrap Calculator</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Vehicle Size Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  Select Vehicle Size
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {vehicleSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: selectedSize === size.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: selectedSize === size.id ? "#F5F3FF" : "white",
                        color: selectedSize === size.id ? "#7C3AED" : "#374151",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <span style={{ fontWeight: "600" }}>{size.icon} {size.label}</span>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>{size.vinylFt.min}-{size.vinylFt.max} ft</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Waste Percentage */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Extra for Waste/Overlap: {wastePercent}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="25"
                  value={wastePercent}
                  onChange={(e) => setWastePercent(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#9CA3AF" }}>
                  <span>10% (Expert)</span>
                  <span>25% (Beginner)</span>
                </div>
              </div>

              {/* Results */}
              {fullWrapResults && (
                <div style={{ backgroundColor: "#7C3AED", padding: "20px", borderRadius: "12px", color: "white" }}>
                  <p style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "4px" }}>Vinyl Needed</p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                    {fullWrapResults.vinylFtMin} - {fullWrapResults.vinylFtMax} ft
                  </p>
                  <p style={{ fontSize: "0.9rem", opacity: 0.9, margin: "0 0 16px 0" }}>
                    ({fullWrapResults.sqftMin} - {fullWrapResults.sqftMax} sq ft)
                  </p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "4px" }}>DIY Cost</p>
                      <p style={{ fontWeight: "bold", margin: 0 }}>${fullWrapResults.diyCostMin} - ${fullWrapResults.diyCostMax}</p>
                    </div>
                    <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "4px" }}>Professional</p>
                      <p style={{ fontWeight: "bold", margin: 0 }}>${fullWrapResults.proCostMin.toLocaleString()} - ${fullWrapResults.proCostMax.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Examples */}
              {fullWrapResults && (
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                    <strong>Examples:</strong> {fullWrapResults.vehicle.examples}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Partial Wrap Calculator */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔧 Partial Wrap Calculator</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Vehicle Size Toggle */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Vehicle Size
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setVehicleSizeForParts("small")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: vehicleSizeForParts === "small" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: vehicleSizeForParts === "small" ? "#ECFDF5" : "white",
                      color: vehicleSizeForParts === "small" ? "#059669" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Car/Small SUV
                  </button>
                  <button
                    onClick={() => setVehicleSizeForParts("large")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: vehicleSizeForParts === "large" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: vehicleSizeForParts === "large" ? "#ECFDF5" : "white",
                      color: vehicleSizeForParts === "large" ? "#059669" : "#374151",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Truck/Large SUV
                  </button>
                </div>
              </div>

              {/* Parts Selection */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Select Parts to Wrap
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxHeight: "280px", overflowY: "auto" }}>
                  {vehicleParts.map((part) => (
                    <label
                      key={part.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: selectedParts.includes(part.id) ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: selectedParts.includes(part.id) ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedParts.includes(part.id)}
                        onChange={() => togglePart(part.id)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span>{part.icon} {part.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Partial Results */}
              {partialWrapResults ? (
                <div style={{ backgroundColor: "#059669", padding: "20px", borderRadius: "12px", color: "white" }}>
                  <p style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "4px" }}>Vinyl Needed</p>
                  <p style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0 0 4px 0" }}>
                    {partialWrapResults.linearFtMin} - {partialWrapResults.linearFtMax} ft
                  </p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.9, margin: "0 0 12px 0" }}>
                    ({partialWrapResults.withWasteMin} - {partialWrapResults.withWasteMax} sq ft with waste)
                  </p>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "10px", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "2px" }}>Estimated DIY Cost</p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>${partialWrapResults.diyCostMin} - ${partialWrapResults.diyCostMax}</p>
                  </div>
                </div>
              ) : (
                <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ color: "#9CA3AF", margin: 0 }}>Select parts above to calculate</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vinyl Wrap Size Chart */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📋 Vinyl Wrap Size Chart by Vehicle</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Standard 5ft (60&quot;) wide vinyl roll</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F3FF" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Vehicle</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Size</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Vinyl Needed</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Square Feet</th>
                </tr>
              </thead>
              <tbody>
                {sizeChartData.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>{row.vehicle}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.size}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#7C3AED" }}>{row.vinyl}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.sqft}</td>
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
            {/* Cost Comparison */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💰 Vinyl Wrap vs Paint: Cost Comparison</h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FEF3C7" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Option</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cost Range</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Durability</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Reversible?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>DIY Vinyl Wrap</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$500 - $1,500</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>5-7 years</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>✅ Yes</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Professional Wrap</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>$2,000 - $5,000</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>5-7 years</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>✅ Yes</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Quality Paint Job</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>$3,000 - $10,000</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>10+ years</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>❌ No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                <p style={{ color: "#065F46", margin: 0, fontSize: "0.9rem" }}>
                  💡 <strong>Tip:</strong> Vinyl wrap is 30-50% cheaper than paint and protects your original paint. Perfect for leased vehicles or if you like changing colors!
                </p>
              </div>
            </div>

            {/* How to Measure */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📏 How to Calculate Vinyl Wrap</h2>
              
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F5F3FF", borderRadius: "12px" }}>
                  <h4 style={{ color: "#5B21B6", margin: "0 0 8px 0" }}>Method 1: Quick Formula</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    <strong>Vehicle Length (ft) × 3 + 10-15 ft</strong> = Total vinyl needed<br />
                    Example: 16 ft car × 3 + 10 = <strong>58 feet</strong> of vinyl
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>Method 2: Surface Area</h4>
                  <p style={{ color: "#374151", margin: 0, fontSize: "0.9rem" }}>
                    Measure each panel, add 10-20% for waste, divide total by roll width (5 ft).<br />
                    <strong>Total sq ft ÷ 5 = Linear feet needed</strong>
                  </p>
                </div>
                
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "12px" }}>
                  <h4 style={{ color: "#92400E", margin: "0 0 8px 0" }}>Pro Tips</h4>
                  <ul style={{ color: "#374151", margin: 0, paddingLeft: "20px", fontSize: "0.9rem" }}>
                    <li>Always add 10-20% extra for mistakes and overlap</li>
                    <li>Bumpers and mirrors use more vinyl than expected</li>
                    <li>Round up to the nearest available roll size</li>
                    <li>Standard rolls: 25 ft, 50 ft, 60 ft, 75 ft</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Vinyl Types */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>🎨 Vinyl Types & Costs</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {Object.entries(vinylCosts).map(([key, data]) => (
                  <div key={key} style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{data.label}</span>
                      <span style={{ fontWeight: "bold", color: "#7C3AED" }}>${data.perFt}/ft</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Lasts {data.durability}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Finishes */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>✨ Popular Finishes</h3>
              <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                {[
                  { finish: "Gloss", desc: "Shiny, like fresh paint" },
                  { finish: "Matte", desc: "Flat, non-reflective" },
                  { finish: "Satin", desc: "Semi-gloss, subtle sheen" },
                  { finish: "Carbon Fiber", desc: "Textured, sporty look" },
                  { finish: "Chrome", desc: "Mirror-like, eye-catching" },
                  { finish: "Color Shift", desc: "Changes color by angle" }
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: "8px 0", borderBottom: idx < 5 ? "1px solid #E5E7EB" : "none" }}>
                    <strong>{item.finish}</strong>: {item.desc}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/vinyl-wrap-calculator" currentCategory="Auto" />
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
            🎨 <strong>Disclaimer:</strong> Estimates are based on industry averages. Actual vinyl needed may vary based on vehicle design, installer skill, and wrap coverage. Always purchase 10-20% extra to account for mistakes and waste.
          </p>
        </div>
      </div>
    </div>
  );
}