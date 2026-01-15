"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Project types with recommended depths
const projectTypes = {
  "garden": { name: "Garden Bed / Decorative", depth: 2, description: "Low traffic decorative areas" },
  "walkway": { name: "Walkway / Pathway", depth: 3, description: "Moderate foot traffic" },
  "patio": { name: "Patio", depth: 3.5, description: "Outdoor seating areas" },
  "driveway": { name: "Driveway", depth: 4, description: "Vehicle traffic" },
  "parking": { name: "Parking Area", depth: 6, description: "Heavy vehicle loads" },
  "custom": { name: "Custom", depth: 3, description: "Enter your own depth" }
};

// DG types with pricing
const dgTypes = {
  "natural": { name: "Natural DG", priceMin: 40, priceMax: 100, description: "Loose, sand-like, best for low-traffic areas" },
  "stabilized": { name: "Stabilized DG", priceMin: 100, priceMax: 225, description: "With binder, more durable, good for paths" },
  "resin": { name: "Resin-Coated DG", priceMin: 250, priceMax: 350, description: "Most durable, ideal for driveways" }
};

// Compaction factors
const compactionFactors = {
  "none": { label: "No extra (exact calculation)", value: 1.0 },
  "low": { label: "+10% (light compaction)", value: 1.10 },
  "medium": { label: "+15% (standard)", value: 1.15 },
  "high": { label: "+25% (heavy compaction)", value: 1.25 }
};

// FAQ data
const faqs = [
  {
    question: "How much area will 1 yard of decomposed granite cover?",
    answer: "One cubic yard of decomposed granite covers approximately 324 square feet at 1 inch depth, 162 square feet at 2 inches, 108 square feet at 3 inches, or 81 square feet at 4 inches deep. The coverage decreases proportionally as depth increases. For most walkway projects at 3\" depth, plan for about 100 sq ft per cubic yard."
  },
  {
    question: "Is DG cheaper than gravel?",
    answer: "Decomposed granite typically costs $40-100 per cubic yard for natural DG, compared to $15-75 for standard gravel. While DG is slightly more expensive, it offers better compaction, a more refined appearance, and excellent drainage. Stabilized DG ($100-225/yard) and resin-coated DG ($250-350/yard) cost more but provide greater durability for high-traffic areas."
  },
  {
    question: "How much decomposed granite do I need per square foot?",
    answer: "At 3 inches depth (standard for walkways), you need approximately 0.009 cubic yards or about 25 pounds per square foot. At 2 inches depth, it's about 17 pounds per square foot. At 4 inches for driveways, plan for 33 pounds per square foot. Always add 10-25% extra for compaction and waste."
  },
  {
    question: "How thick should you lay decomposed granite?",
    answer: "Recommended depths vary by use: 2 inches for decorative garden beds, 3 inches for walkways and paths, 3-4 inches for patios, and 4-6 inches for driveways and parking areas. Always install over compacted soil or a gravel base, and use landscape fabric underneath to prevent weed growth and mixing with soil."
  },
  {
    question: "How much does 1 ton of decomposed granite cover?",
    answer: "One ton of decomposed granite covers approximately 100 square feet at 2 inches deep, 64 square feet at 3 inches deep, or 50 square feet at 4 inches deep. Since DG weighs about 2,700-3,000 pounds per cubic yard (1.35-1.5 tons), one cubic yard equals roughly 0.75 tons."
  },
  {
    question: "What is the difference between crushed granite and decomposed granite?",
    answer: "Decomposed granite (DG) is finer with a sand-like texture that compacts well, making it ideal for pathways and patios. Crushed granite has larger, more angular pieces (typically 1/4\" to 3/8\") better suited for drainage and base material. DG provides a smoother walking surface while crushed granite offers better drainage but a rougher texture."
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

export default function DecomposedGraniteCalculator() {
  const [activeTab, setActiveTab] = useState<"material" | "cost">("material");
  
  // Tab 1: Material Calculator State
  const [areaShape, setAreaShape] = useState<string>("rectangle");
  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("10");
  const [diameter, setDiameter] = useState<string>("12");
  const [base, setBase] = useState<string>("15");
  const [height, setHeight] = useState<string>("10");
  const [customArea, setCustomArea] = useState<string>("200");
  const [projectType, setProjectType] = useState<string>("walkway");
  const [depth, setDepth] = useState<string>("3");
  const [compaction, setCompaction] = useState<string>("medium");
  
  // Tab 2: Cost Estimator State
  const [dgType, setDgType] = useState<string>("natural");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [deliveryFee, setDeliveryFee] = useState<string>("75");
  const [installationType, setInstallationType] = useState<string>("diy");
  const [laborRate, setLaborRate] = useState<string>("75");
  const [laborHours, setLaborHours] = useState<string>("4");

  // DG constants
  const DG_DENSITY_LBS_PER_YARD = 2850; // average
  const DG_TONS_PER_YARD = DG_DENSITY_LBS_PER_YARD / 2000;
  const LBS_PER_BAG = 50;

  // Calculate area based on shape
  const calculateArea = (): number => {
    switch (areaShape) {
      case "rectangle":
        return (parseFloat(length) || 0) * (parseFloat(width) || 0);
      case "circle":
        const r = (parseFloat(diameter) || 0) / 2;
        return Math.PI * r * r;
      case "triangle":
        return 0.5 * (parseFloat(base) || 0) * (parseFloat(height) || 0);
      case "custom":
        return parseFloat(customArea) || 0;
      default:
        return 0;
    }
  };

  // Tab 1 Calculations
  const areaSqFt = calculateArea();
  const depthNum = parseFloat(depth) || 0;
  const compactionFactor = compactionFactors[compaction as keyof typeof compactionFactors].value;
  
  // Volume calculations
  const depthFt = depthNum / 12;
  const volumeCuFt = areaSqFt * depthFt;
  const volumeCuYards = volumeCuFt / 27;
  const adjustedVolumeCuYards = volumeCuYards * compactionFactor;
  
  // Weight calculations
  const weightLbs = adjustedVolumeCuYards * DG_DENSITY_LBS_PER_YARD;
  const weightTons = weightLbs / 2000;
  const bagsNeeded = Math.ceil(weightLbs / LBS_PER_BAG);
  
  // Coverage reference
  const coveragePerYard = 324 / depthNum; // sq ft per yard at given depth

  // Tab 2 Calculations
  const dgTypeData = dgTypes[dgType as keyof typeof dgTypes];
  const pricePerYard = customPrice ? parseFloat(customPrice) : (dgTypeData.priceMin + dgTypeData.priceMax) / 2;
  const materialCostMin = adjustedVolumeCuYards * dgTypeData.priceMin;
  const materialCostMax = adjustedVolumeCuYards * dgTypeData.priceMax;
  const materialCostAvg = adjustedVolumeCuYards * pricePerYard;
  
  const deliveryNum = parseFloat(deliveryFee) || 0;
  const laborRateNum = parseFloat(laborRate) || 0;
  const laborHoursNum = parseFloat(laborHours) || 0;
  const laborCost = installationType === "professional" ? laborRateNum * laborHoursNum : 0;
  
  const totalCostMin = materialCostMin + deliveryNum + laborCost;
  const totalCostMax = materialCostMax + deliveryNum + laborCost;
  const costPerSqFt = areaSqFt > 0 ? (materialCostMin + materialCostMax) / 2 / areaSqFt : 0;

  // Update depth when project type changes
  const handleProjectTypeChange = (type: string) => {
    setProjectType(type);
    if (type !== "custom") {
      setDepth(projectTypes[type as keyof typeof projectTypes].depth.toString());
    }
  };

  const tabs = [
    { id: "material", label: "Material Calculator", icon: "📐" },
    { id: "cost", label: "Cost Estimator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Decomposed Granite Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Decomposed Granite Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much decomposed granite (DG) you need for your landscaping project. 
            Get accurate estimates in cubic yards, tons, and bags with cost calculations.
          </p>
        </div>

        {/* Quick Reference Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>Quick Coverage Reference</p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.9rem", color: "#B45309" }}>
                <span><strong>1 yard @ 2":</strong> 162 sq ft</span>
                <span><strong>1 yard @ 3":</strong> 108 sq ft</span>
                <span><strong>1 yard @ 4":</strong> 81 sq ft</span>
                <span><strong>1 ton:</strong> ~64 sq ft @ 3"</span>
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
                backgroundColor: activeTab === tab.id ? "#92400E" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "material" && "📐 Area & Depth"}
                {activeTab === "cost" && "💰 Pricing Options"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* MATERIAL CALCULATOR TAB */}
              {activeTab === "material" && (
                <>
                  {/* Area Shape */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Area Shape
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { id: "rectangle", label: "Rectangle", icon: "▬" },
                        { id: "circle", label: "Circle", icon: "●" },
                        { id: "triangle", label: "Triangle", icon: "▲" },
                        { id: "custom", label: "Custom Area", icon: "✏️" }
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setAreaShape(shape.id)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: areaShape === shape.id ? "2px solid #92400E" : "1px solid #E5E7EB",
                            backgroundColor: areaShape === shape.id ? "#FEF3C7" : "white",
                            color: areaShape === shape.id ? "#92400E" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {shape.icon} {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions based on shape */}
                  {areaShape === "rectangle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Length (feet)
                        </label>
                        <input
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Width (feet)
                        </label>
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}

                  {areaShape === "circle" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Diameter (feet)
                      </label>
                      <input
                        type="number"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  )}

                  {areaShape === "triangle" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Base (feet)
                        </label>
                        <input
                          type="number"
                          value={base}
                          onChange={(e) => setBase(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Height (feet)
                        </label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}

                  {areaShape === "custom" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Total Area (square feet)
                      </label>
                      <input
                        type="number"
                        value={customArea}
                        onChange={(e) => setCustomArea(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  )}

                  {/* Project Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => handleProjectTypeChange(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(projectTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name} ({key !== "custom" ? `${value.depth}" recommended` : "custom depth"})
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      {projectTypes[projectType as keyof typeof projectTypes].description}
                    </p>
                  </div>

                  {/* Depth */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Depth (inches)
                    </label>
                    <input
                      type="number"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      step="0.5"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 6].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDepth(d.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: depth === d.toString() ? "2px solid #92400E" : "1px solid #E5E7EB",
                            backgroundColor: depth === d.toString() ? "#FEF3C7" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {d}"
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Compaction Factor */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Compaction Allowance
                    </label>
                    <select
                      value={compaction}
                      onChange={(e) => setCompaction(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(compactionFactors).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "0.7rem", color: "#059669", margin: "4px 0 0 0" }}>
                      ✓ Recommended: Add 15-25% extra for compaction and waste
                    </p>
                  </div>
                </>
              )}

              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  {/* Area Summary */}
                  <div style={{ padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px", marginBottom: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
                      <strong>Project:</strong> {areaSqFt.toFixed(0)} sq ft @ {depth}" depth = <strong>{adjustedVolumeCuYards.toFixed(2)} cubic yards</strong>
                    </p>
                  </div>

                  {/* DG Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Decomposed Granite Type
                    </label>
                    {Object.entries(dgTypes).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "12px",
                          marginBottom: "8px",
                          borderRadius: "8px",
                          border: dgType === key ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: dgType === key ? "#FEF3C7" : "white",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="radio"
                          name="dgType"
                          value={key}
                          checked={dgType === key}
                          onChange={(e) => setDgType(e.target.value)}
                          style={{ marginTop: "2px" }}
                        />
                        <div>
                          <p style={{ margin: "0 0 2px 0", fontWeight: "600", fontSize: "0.9rem", color: "#111827" }}>{value.name}</p>
                          <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#6B7280" }}>{value.description}</p>
                          <p style={{ margin: 0, fontSize: "0.8rem", color: "#059669", fontWeight: "600" }}>${value.priceMin} - ${value.priceMax} per cubic yard</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Custom Price Override */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Custom Price per Yard (optional)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder={`Default: $${((dgTypeData.priceMin + dgTypeData.priceMax) / 2).toFixed(0)}`}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Delivery Fee */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Delivery Fee
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Typical delivery: $50-150 depending on distance
                    </p>
                  </div>

                  {/* Installation Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Installation
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setInstallationType("diy")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: installationType === "diy" ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: installationType === "diy" ? "#FEF3C7" : "white",
                          color: installationType === "diy" ? "#92400E" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🔧 DIY<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>$0 labor</span>
                      </button>
                      <button
                        onClick={() => setInstallationType("professional")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: installationType === "professional" ? "2px solid #92400E" : "1px solid #E5E7EB",
                          backgroundColor: installationType === "professional" ? "#FEF3C7" : "white",
                          color: installationType === "professional" ? "#92400E" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        👷 Professional<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>$50-100/hr</span>
                      </button>
                    </div>
                  </div>

                  {/* Labor Details */}
                  {installationType === "professional" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px", padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#374151", marginBottom: "4px" }}>
                          Labor Rate ($/hr)
                        </label>
                        <input
                          type="number"
                          value={laborRate}
                          onChange={(e) => setLaborRate(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#374151", marginBottom: "4px" }}>
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          value={laborHours}
                          onChange={(e) => setLaborHours(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
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
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "material" && "🪨 Material Needed"}
                {activeTab === "cost" && "💵 Cost Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* MATERIAL RESULTS */}
              {activeTab === "material" && (
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
                      You Need
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {adjustedVolumeCuYards.toFixed(2)} yd³
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      cubic yards of decomposed granite
                    </p>
                  </div>

                  {/* Alternative Units */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Weight</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        {weightTons.toFixed(2)} tons
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#92400E" }}>
                        ({weightLbs.toLocaleString(undefined, {maximumFractionDigits: 0})} lbs)
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>50-lb Bags</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {bagsNeeded} bags
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#1E40AF" }}>
                        (if buying bagged)
                      </p>
                    </div>
                  </div>

                  {/* Project Summary */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Project Summary</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Area</span>
                        <span style={{ fontWeight: "600" }}>{areaSqFt.toFixed(1)} sq ft</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Depth</span>
                        <span style={{ fontWeight: "600" }}>{depthNum}" ({(depthNum * 2.54).toFixed(1)} cm)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Base Volume</span>
                        <span style={{ fontWeight: "600" }}>{volumeCuYards.toFixed(2)} yd³</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ color: "#4B5563" }}>With {((compactionFactor - 1) * 100).toFixed(0)}% compaction</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{adjustedVolumeCuYards.toFixed(2)} yd³</span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Info */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                      💡 <strong>Coverage:</strong> At {depthNum}" depth, 1 cubic yard covers ~{coveragePerYard.toFixed(0)} sq ft
                    </p>
                  </div>
                </>
              )}

              {/* COST RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Main Cost Result */}
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
                    <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalCostMin.toFixed(0)} - ${totalCostMax.toFixed(0)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      for {adjustedVolumeCuYards.toFixed(2)} cubic yards of {dgTypes[dgType as keyof typeof dgTypes].name}
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>Material ({adjustedVolumeCuYards.toFixed(2)} yd³)</span>
                        <span style={{ fontWeight: "600" }}>${materialCostMin.toFixed(0)} - ${materialCostMax.toFixed(0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>Delivery</span>
                        <span style={{ fontWeight: "600" }}>${deliveryNum.toFixed(0)}</span>
                      </div>
                      {installationType === "professional" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>Labor ({laborHoursNum} hrs @ ${laborRateNum}/hr)</span>
                          <span style={{ fontWeight: "600" }}>${laborCost.toFixed(0)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Total</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${totalCostMin.toFixed(0)} - ${totalCostMax.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost per sq ft */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Material Cost/yd³</p>
                      <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: "bold", color: "#B45309" }}>
                        ${dgTypeData.priceMin} - ${dgTypeData.priceMax}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Material Cost/sq ft</p>
                      <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${(materialCostMin / areaSqFt).toFixed(2)} - ${(materialCostMax / areaSqFt).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#92400E" }}>💡 Money-Saving Tips</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#B45309", lineHeight: "1.6" }}>
                      <li>Buy in bulk to save on per-yard costs</li>
                      <li>Combine orders to minimize delivery fees</li>
                      <li>Natural DG is cheapest but less durable</li>
                      <li>DIY installation saves $200-800</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Depth Recommendation Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📏 Recommended DG Depth by Project Type</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Project Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Depth</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Coverage/yd³</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best DG Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>🌸 Garden Beds / Decorative</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>2"</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>162 sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669" }}>Natural DG</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>🚶 Walkways / Paths</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>3"</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>108 sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669" }}>Stabilized DG</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>☕ Patios</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>3-4"</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>81-108 sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669" }}>Stabilized DG</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>🚗 Driveways</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>4-6"</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>54-81 sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669" }}>Resin-Coated DG</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>🅿️ Parking Areas</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>6"</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>54 sq ft</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669" }}>Resin-Coated DG</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪨 What is Decomposed Granite?</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Decomposed granite (DG) is a naturally weathered form of granite that has broken down into 
                  small particles ranging from fine powder to 3/8-inch pieces. Its sandy, gravel-like texture 
                  and warm earth tones (tan, gold, brown, gray) make it a popular choice for landscaping, 
                  pathways, and outdoor living spaces.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Decomposed Granite</h3>
                <p>
                  <strong>Natural DG</strong> is the most affordable option ($40-100/yard), consisting of loose 
                  granite particles ideal for garden beds and low-traffic decorative areas. <strong>Stabilized DG</strong> 
                  ($100-225/yard) includes binding agents that improve durability and reduce erosion, making it 
                  perfect for walkways and patios. <strong>Resin-coated DG</strong> ($250-350/yard) offers the 
                  most durability with an asphalt-like finish, best for driveways and high-traffic zones.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Installation Tips</h3>
                <p>
                  For best results, always install DG over compacted soil with landscape fabric underneath to 
                  prevent weed growth and mixing with native soil. Use metal or plastic edging to contain the 
                  material. Compact the DG in 2-inch layers while slightly moist for maximum stability. Plan 
                  for 15-25% extra material to account for compaction and settling.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📐 Quick Formulas</h3>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#B45309", backgroundColor: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Cubic Yards:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>(L × W × D) ÷ 324</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Tons Needed:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>Cubic Yards × 1.4</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Coverage:</strong></p>
                <p style={{ margin: 0 }}>324 ÷ Depth (in) = sq ft/yd³</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ DG Benefits</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Excellent drainage</li>
                <li>Natural, rustic appearance</li>
                <li>Low maintenance</li>
                <li>Affordable landscaping option</li>
                <li>Eco-friendly and permeable</li>
                <li>Reduces water runoff</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/decomposed-granite-calculator" currentCategory="Home" />
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
            🪨 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes. 
            Actual material requirements may vary based on site conditions, compaction rates, and material density. 
            Prices are approximate averages and vary by location and supplier. Always order 10-25% extra for compaction and waste.
          </p>
        </div>
      </div>
    </div>
  );
}