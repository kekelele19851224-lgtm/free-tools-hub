"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Material costs per square foot (installed)
const materials = {
  cinder: {
    label: "Cinder Block",
    costLow: 10,
    costHigh: 15,
    materialOnlyLow: 5,
    materialOnlyHigh: 8,
    lifespan: "50-100 years",
    description: "Affordable, basic option",
    icon: "🧱"
  },
  concrete: {
    label: "Concrete Block",
    costLow: 20,
    costHigh: 50,
    materialOnlyLow: 10,
    materialOnlyHigh: 25,
    lifespan: "50-100 years",
    description: "Durable, customizable colors",
    icon: "🏗️"
  },
  timber: {
    label: "Timber/Wood",
    costLow: 15,
    costHigh: 30,
    materialOnlyLow: 8,
    materialOnlyHigh: 15,
    lifespan: "5-20 years",
    description: "Natural look, easy DIY",
    icon: "🪵"
  },
  poured: {
    label: "Poured Concrete",
    costLow: 25,
    costHigh: 45,
    materialOnlyLow: 12,
    materialOnlyHigh: 22,
    lifespan: "50-100 years",
    description: "Very durable, low maintenance",
    icon: "🏛️"
  },
  brick: {
    label: "Brick",
    costLow: 20,
    costHigh: 45,
    materialOnlyLow: 10,
    materialOnlyHigh: 22,
    lifespan: "100+ years",
    description: "Classic look, long-lasting",
    icon: "🧱"
  },
  stone: {
    label: "Natural Stone",
    costLow: 25,
    costHigh: 85,
    materialOnlyLow: 15,
    materialOnlyHigh: 50,
    lifespan: "100-200 years",
    description: "Premium, beautiful finish",
    icon: "🪨"
  },
};

// Additional costs
const additionalCosts = {
  drainage: { label: "Drainage System", costLow: 10, costHigh: 50, unit: "per linear ft" },
  waterproofing: { label: "Waterproofing", costLow: 2, costHigh: 10, unit: "per sq ft" },
  permit: { label: "Building Permit", costLow: 50, costHigh: 450, unit: "flat fee" },
  engineering: { label: "Engineer Design", costLow: 500, costHigh: 2000, unit: "flat fee" },
};

// Quick reference data
const quickReference = [
  { length: 25, height: 2, label: "25ft × 2ft" },
  { length: 50, height: 3, label: "50ft × 3ft" },
  { length: 75, height: 4, label: "75ft × 4ft" },
  { length: 100, height: 4, label: "100ft × 4ft" },
  { length: 100, height: 6, label: "100ft × 6ft" },
];

// FAQ data
const faqs = [
  {
    question: "How to estimate retaining wall cost?",
    answer: "To estimate retaining wall cost: 1) Calculate wall area (length × height in feet), 2) Choose your material ($10-$85 per sq ft), 3) Add labor costs ($15-$40 per sq ft for professional installation), 4) Include extras like drainage, permits, and waterproofing. For example, a 50ft × 4ft concrete block wall (200 sq ft) costs approximately $4,000-$10,000 installed."
  },
  {
    question: "What is the cheapest retaining wall?",
    answer: "The cheapest retaining wall options are: 1) Cinder blocks at $10-$15/sq ft installed, 2) Timber/wood at $15-$30/sq ft, 3) Gabion walls at $10-$40/sq ft. For DIY projects, wood timber walls are often the most affordable since they're easier to install without professional help. However, cheaper materials may have shorter lifespans—wood lasts 5-20 years vs. 50-100 years for concrete."
  },
  {
    question: "How much does an 80 foot retaining wall cost?",
    answer: "An 80-foot retaining wall costs $3,200-$27,200 depending on height and material. At 3 feet tall (240 sq ft): Cinder block costs $2,400-$3,600, Concrete block costs $4,800-$12,000, Natural stone costs $6,000-$20,400. At 4 feet tall (320 sq ft): add approximately 33% more to these estimates. Walls over 4 feet require permits and engineering, adding $550-$2,450 to the total."
  },
  {
    question: "Do I need a permit for a retaining wall?",
    answer: "Most cities require permits for retaining walls over 3-4 feet tall. Permit costs range from $50-$450. Walls 4 feet or taller typically also need structural engineer approval ($500-$2,000). Some areas require permits regardless of height if the wall is near property lines, supports a surcharge (like a driveway), or affects drainage. Always check local building codes before starting."
  },
  {
    question: "How long does a retaining wall last?",
    answer: "Retaining wall lifespan varies by material: Wood/timber lasts 5-20 years, Vinyl lasts 50 years, Cinder and concrete blocks last 50-100 years, Poured concrete lasts 50-100 years, Brick lasts 100+ years, Natural stone lasts 100-200 years. Proper drainage, waterproofing, and installation significantly extend lifespan. Walls without adequate drainage may fail in just 10-15 years."
  },
  {
    question: "Can I build a retaining wall myself?",
    answer: "DIY retaining walls are feasible for walls under 3-4 feet tall using interlocking blocks, timber, or gabions. DIY can save 40-60% on labor costs. However, taller walls require engineering knowledge, proper drainage design, and often permits. Mistakes in DIY walls can lead to costly failures. For walls over 4 feet or those supporting structures, hire a professional."
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

export default function RetainingWallCostCalculator() {
  // Inputs
  const [length, setLength] = useState<string>("50");
  const [height, setHeight] = useState<string>("3");
  const [material, setMaterial] = useState<keyof typeof materials>("concrete");
  const [installType, setInstallType] = useState<"diy" | "professional">("professional");
  
  // Additional options
  const [includeDrainage, setIncludeDrainage] = useState(false);
  const [includeWaterproofing, setIncludeWaterproofing] = useState(false);
  const [includePermit, setIncludePermit] = useState(false);
  
  // Results
  const [results, setResults] = useState({
    area: 0,
    materialCostLow: 0,
    materialCostHigh: 0,
    laborCostLow: 0,
    laborCostHigh: 0,
    additionalLow: 0,
    additionalHigh: 0,
    totalLow: 0,
    totalHigh: 0,
    needsPermit: false,
    needsEngineering: false,
    diySavingsLow: 0,
    diySavingsHigh: 0,
  });

  // Calculate
  useEffect(() => {
    const l = parseFloat(length) || 0;
    const h = parseFloat(height) || 0;
    const area = l * h;
    
    const mat = materials[material];
    
    // Material costs
    let matLow: number, matHigh: number;
    let laborLow = 0, laborHigh = 0;
    
    if (installType === "diy") {
      matLow = area * mat.materialOnlyLow;
      matHigh = area * mat.materialOnlyHigh;
    } else {
      // Professional includes materials + labor
      matLow = area * mat.materialOnlyLow;
      matHigh = area * mat.materialOnlyHigh;
      laborLow = area * (mat.costLow - mat.materialOnlyLow);
      laborHigh = area * (mat.costHigh - mat.materialOnlyHigh);
    }
    
    // Additional costs
    let addLow = 0, addHigh = 0;
    
    if (includeDrainage) {
      addLow += l * additionalCosts.drainage.costLow;
      addHigh += l * additionalCosts.drainage.costHigh;
    }
    
    if (includeWaterproofing) {
      addLow += area * additionalCosts.waterproofing.costLow;
      addHigh += area * additionalCosts.waterproofing.costHigh;
    }
    
    if (includePermit) {
      addLow += additionalCosts.permit.costLow;
      addHigh += additionalCosts.permit.costHigh;
    }
    
    // Check if engineering needed (height > 4ft)
    const needsEng = h > 4;
    if (needsEng && installType === "professional") {
      addLow += additionalCosts.engineering.costLow;
      addHigh += additionalCosts.engineering.costHigh;
    }
    
    // Total
    const totalLow = matLow + laborLow + addLow;
    const totalHigh = matHigh + laborHigh + addHigh;
    
    // DIY savings calculation
    const proTotalLow = area * mat.costLow;
    const proTotalHigh = area * mat.costHigh;
    const diyTotalLow = area * mat.materialOnlyLow;
    const diyTotalHigh = area * mat.materialOnlyHigh;
    
    setResults({
      area,
      materialCostLow: matLow,
      materialCostHigh: matHigh,
      laborCostLow: laborLow,
      laborCostHigh: laborHigh,
      additionalLow: addLow,
      additionalHigh: addHigh,
      totalLow,
      totalHigh,
      needsPermit: h >= 4,
      needsEngineering: needsEng,
      diySavingsLow: proTotalLow - diyTotalHigh,
      diySavingsHigh: proTotalHigh - diyTotalLow,
    });
  }, [length, height, material, installType, includeDrainage, includeWaterproofing, includePermit]);

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
            <span style={{ color: "#111827" }}>Retaining Wall Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🧱</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Retaining Wall Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the cost to build a retaining wall based on dimensions, materials, and installation type. Compare DIY vs professional installation costs.
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
              Retaining walls cost $20-$65 per sq ft installed. Materials range from $10/sq ft (cinder block) to $85/sq ft (natural stone).
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
                  📐 Wall Dimensions
                </h3>

                {/* Length */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Wall Length (feet)
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
                    min="1"
                    placeholder="50"
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {["25", "50", "75", "100"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setLength(val)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "6px",
                          border: length === val ? "2px solid #78716C" : "1px solid #E5E7EB",
                          backgroundColor: length === val ? "#F5F5F4" : "white",
                          color: length === val ? "#78716C" : "#6B7280",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        {val} ft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Wall Height (feet)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}
                    min="1"
                    max="10"
                    placeholder="3"
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {["2", "3", "4", "5", "6"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setHeight(val)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "6px",
                          border: height === val ? "2px solid #78716C" : "1px solid #E5E7EB",
                          backgroundColor: height === val ? "#F5F5F4" : "white",
                          color: height === val ? "#78716C" : "#6B7280",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        {val} ft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Height Warning */}
                {results.needsPermit && (
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "20px"
                  }}>
                    <p style={{ fontSize: "0.85rem", color: "#DC2626", margin: 0, fontWeight: "500" }}>
                      ⚠️ Walls 4ft+ typically require building permits and may need structural engineer approval.
                    </p>
                  </div>
                )}

                {/* Material */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Wall Material
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {(Object.keys(materials) as Array<keyof typeof materials>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setMaterial(key)}
                        style={{
                          padding: "12px 14px",
                          borderRadius: "8px",
                          border: material === key ? "2px solid #78716C" : "1px solid #E5E7EB",
                          backgroundColor: material === key ? "#F5F5F4" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{materials[key].icon}</span>
                            <div>
                              <span style={{ fontWeight: "600", color: material === key ? "#57534E" : "#374151", fontSize: "0.9rem" }}>
                                {materials[key].label}
                              </span>
                              <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                                {materials[key].description}
                              </p>
                            </div>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: material === key ? "#78716C" : "#9CA3AF", fontWeight: "600" }}>
                            ${materials[key].costLow}-${materials[key].costHigh}/sf
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Installation Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Installation Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button
                      onClick={() => setInstallType("diy")}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: installType === "diy" ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: installType === "diy" ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🔨</span>
                      <p style={{ fontWeight: "600", color: installType === "diy" ? "#059669" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        DIY
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>Materials only</p>
                    </button>
                    <button
                      onClick={() => setInstallType("professional")}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: installType === "professional" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: installType === "professional" ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>👷</span>
                      <p style={{ fontWeight: "600", color: installType === "professional" ? "#2563EB" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        Professional
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>Materials + Labor</p>
                    </button>
                  </div>
                </div>

                {/* Additional Options */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Additional Options
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {[
                      { key: "drainage", label: "Drainage System", checked: includeDrainage, setter: setIncludeDrainage, cost: "$10-$50/linear ft" },
                      { key: "waterproofing", label: "Waterproofing", checked: includeWaterproofing, setter: setIncludeWaterproofing, cost: "$2-$10/sq ft" },
                      { key: "permit", label: "Building Permit", checked: includePermit, setter: setIncludePermit, cost: "$50-$450" },
                    ].map((option) => (
                      <label
                        key={option.key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          backgroundColor: option.checked ? "#F5F5F4" : "white",
                          border: option.checked ? "2px solid #78716C" : "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={(e) => option.setter(e.target.checked)}
                            style={{ width: "18px", height: "18px", accentColor: "#78716C" }}
                          />
                          <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>{option.label}</span>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>{option.cost}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div style={{ backgroundColor: "#F5F5F4", padding: "24px", borderRadius: "12px", border: "2px solid #D6D3D1" }}>
                <h3 style={{ fontWeight: "600", color: "#57534E", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💰 Estimated Cost
                </h3>

                {/* Wall Area */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 4px 0" }}>Wall Area</p>
                  <p style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                    {results.area.toLocaleString()} sq ft
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: "4px 0 0 0" }}>
                    {length} ft × {height} ft
                  </p>
                </div>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#78716C",
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
                    {materials[material].label} • {installType === "diy" ? "DIY" : "Professional"}
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
                    <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Materials</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>
                      {formatCurrency(results.materialCostLow)} - {formatCurrency(results.materialCostHigh)}
                    </span>
                  </div>

                  {installType === "professional" && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Labor</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>
                        {formatCurrency(results.laborCostLow)} - {formatCurrency(results.laborCostHigh)}
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
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Additional</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>
                        +{formatCurrency(results.additionalLow)} - {formatCurrency(results.additionalHigh)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Per Unit Costs */}
                <div style={{ padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#065F46" }}>Per Square Foot:</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#059669" }}>
                      ${(results.totalLow / results.area || 0).toFixed(0)} - ${(results.totalHigh / results.area || 0).toFixed(0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", color: "#065F46" }}>Per Linear Foot:</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#059669" }}>
                      ${(results.totalLow / (parseFloat(length) || 1)).toFixed(0)} - ${(results.totalHigh / (parseFloat(length) || 1)).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* DIY Savings */}
                {installType === "professional" && (
                  <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>DIY Potential Savings:</strong> {formatCurrency(results.diySavingsLow)} - {formatCurrency(results.diySavingsHigh)}
                    </p>
                  </div>
                )}

                {/* Material Lifespan */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#374151", margin: 0 }}>
                    <strong>Expected Lifespan:</strong> {materials[material].lifespan}
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
            📊 Retaining Wall Cost Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Estimated costs by wall size and material (professional installation)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Size (L × H)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Sq Ft</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F5F5F4" }}>Cinder Block</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>Concrete Block</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>Natural Stone</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const area = row.length * row.height;
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.label}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{area}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#57534E" }}>
                        {formatCurrency(area * 10)} - {formatCurrency(area * 15)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB" }}>
                        {formatCurrency(area * 20)} - {formatCurrency(area * 50)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706" }}>
                        {formatCurrency(area * 25)} - {formatCurrency(area * 85)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Prices include materials and professional labor. Add $550-$2,450 for permits and engineering on walls over 4 feet.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Material Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🧱 Retaining Wall Materials Compared
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cost/sq ft</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Lifespan</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>DIY Friendly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Object.keys(materials) as Array<keyof typeof materials>).map((key, index) => (
                      <tr key={key} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>
                          <span style={{ marginRight: "8px" }}>{materials[key].icon}</span>
                          {materials[key].label}
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>
                          ${materials[key].costLow}-${materials[key].costHigh}
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                          {materials[key].lifespan}
                        </td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                          {key === "timber" || key === "cinder" ? "✅ Yes" : key === "stone" || key === "poured" ? "❌ No" : "⚠️ Moderate"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost Factors */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 Factors That Affect Retaining Wall Cost
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>📏 Wall Height</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Taller walls need stronger foundations. Walls over 4ft require permits and engineering.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>💧 Drainage</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Proper drainage prevents wall failure. French drains cost $10-$85 per linear foot.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>🏗️ Site Prep</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Excavation, grading, and land clearing add $500-$3,000+ to projects.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>📍 Location</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Labor rates vary by region. Urban areas typically cost 20-40% more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Height Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 Height Requirements
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#065F46", margin: 0 }}>
                    <strong>Under 3 ft:</strong> DIY friendly, usually no permit
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                    <strong>3-4 ft:</strong> May need permit, pro recommended
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#FEE2E2", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#DC2626", margin: 0 }}>
                    <strong>Over 4 ft:</strong> Permit + engineer required
                  </p>
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
                💡 Money-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Get 3+ quotes from contractors</li>
                <li style={{ marginBottom: "8px" }}>Consider DIY for walls under 3ft</li>
                <li style={{ marginBottom: "8px" }}>Use interlocking blocks (no mortar)</li>
                <li style={{ marginBottom: "8px" }}>Build during off-season for discounts</li>
                <li>Proper drainage saves repair costs</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/retaining-wall-cost-calculator"
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
            🧱 <strong>Disclaimer:</strong> These estimates are based on national averages for 2025-2026. Actual costs vary by location, contractor, site conditions, and material availability. Walls over 4 feet typically require permits and structural engineering. Always get multiple quotes and check local building codes before starting construction.
          </p>
        </div>
      </div>
    </div>
  );
}