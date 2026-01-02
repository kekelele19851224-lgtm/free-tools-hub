"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Gravel 类型数据
const gravelTypes = [
  { id: "crushed-2", name: "Crushed Stone #2", size: "1-3 inch", density: 1.4, use: "Base layer" },
  { id: "crushed-57", name: "Crushed Stone #57", size: "3/4 - 1 inch", density: 1.35, use: "Middle/Surface" },
  { id: "crushed-8", name: "Crushed Stone #8", size: "3/8 - 1/2 inch", density: 1.4, use: "Surface layer" },
  { id: "pea-gravel", name: "Pea Gravel", size: "3/8 inch", density: 1.35, use: "Surface/Decorative" },
  { id: "crusher-run", name: "Crusher Run", size: "Mixed", density: 1.5, use: "All-purpose" },
  { id: "limestone", name: "Crushed Limestone", size: "3/4 inch", density: 1.5, use: "Base/Surface" },
];

// 预计算表格数据
const quickReferenceData = [
  { length: 50, width: 10, depth: 12, label: "Small (50×10 ft)" },
  { length: 100, width: 10, depth: 12, label: "Medium (100×10 ft)" },
  { length: 100, width: 12, depth: 12, label: "Standard (100×12 ft)" },
  { length: 150, width: 12, depth: 12, label: "Large (150×12 ft)" },
  { length: 200, width: 12, depth: 12, label: "Extra Large (200×12 ft)" },
];

// FAQ数据
const faqs = [
  {
    question: "How do you calculate gravel for a driveway?",
    answer: "To calculate gravel for a driveway: 1) Measure length and width in feet, 2) Determine the depth needed (typically 12-18 inches for new driveways), 3) Multiply length × width × depth (in feet) to get cubic feet, 4) Divide by 27 to convert to cubic yards, 5) Multiply by gravel density (about 1.4 tons/yd³) to get tons needed. For a layered driveway, calculate each layer separately."
  },
  {
    question: "How much does a 1000 ft gravel driveway cost?",
    answer: "A 1000 square foot gravel driveway (e.g., 100 ft × 10 ft) at 12 inches deep would require approximately 37 cubic yards or 52 tons of gravel. At $35-$50 per ton, the material cost alone would be $1,820-$2,600. Including labor and delivery, total costs typically range from $3,000-$5,000 for professional installation."
  },
  {
    question: "How much area does 1 ton of driveway gravel cover?",
    answer: "One ton of gravel covers approximately 80-100 square feet at 2 inches deep, 50-60 square feet at 3 inches deep, or 40-50 square feet at 4 inches deep. Coverage varies based on gravel size and compaction. Larger gravel covers slightly less area than smaller, fine gravel."
  },
  {
    question: "How much would a dump truck load of gravel cost?",
    answer: "A standard dump truck holds 13-25 tons of gravel. At $35-$50 per ton for material plus $50-$150 delivery fee, a full dump truck load costs approximately $500-$1,400. Smaller trucks (10-13 tons) cost $400-$800. Always get quotes from multiple local suppliers for the best price."
  },
  {
    question: "What depth should a gravel driveway be?",
    answer: "For residential driveways with light vehicle traffic, a total depth of 12 inches (3 layers of 4 inches each) is recommended. For heavier use, 18 inches is better. The base layer should use large stone (#2), middle layer medium stone (#57), and top layer smaller stone (#8) or pea gravel for a stable, well-draining surface."
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function GravelDrivewayCalculator() {
  // 项目类型
  const [projectType, setProjectType] = useState<"new" | "refresh">("new");
  
  // 尺寸
  const [length, setLength] = useState<string>("100");
  const [width, setWidth] = useState<string>("12");
  
  // 深度模式
  const [depthMode, setDepthMode] = useState<"single" | "three">("three");
  
  // 单层深度
  const [singleDepth, setSingleDepth] = useState<string>("4");
  
  // 三层深度
  const [baseDepth, setBaseDepth] = useState<string>("6");
  const [middleDepth, setMiddleDepth] = useState<string>("4");
  const [surfaceDepth, setSurfaceDepth] = useState<string>("4");
  
  // Gravel 类型
  const [gravelType, setGravelType] = useState<string>("crusher-run");
  
  // 价格
  const [pricePerTon, setPricePerTon] = useState<string>("40");
  
  // 结果
  const [results, setResults] = useState<{
    totalCubicYards: number;
    totalTons: number;
    layers: Array<{
      name: string;
      depth: number;
      cubicYards: number;
      tons: number;
    }>;
    costLow: number;
    costHigh: number;
    customCost: number | null;
    sqft: number;
  } | null>(null);

  // 显示快速参考表
  const [showQuickRef, setShowQuickRef] = useState(false);

  // 获取当前密度
  const getCurrentDensity = (): number => {
    const gravel = gravelTypes.find(g => g.id === gravelType);
    return gravel?.density || 1.4;
  };

  // 计算
  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;

    if (l <= 0 || w <= 0) {
      alert("Please enter valid dimensions");
      return;
    }

    const sqft = l * w;
    const density = getCurrentDensity();
    const layers: Array<{ name: string; depth: number; cubicYards: number; tons: number }> = [];
    let totalCubicYards = 0;
    let totalTons = 0;

    if (projectType === "refresh" || depthMode === "single") {
      // 单层计算
      const d = parseFloat(singleDepth) || 4;
      const depthFt = d / 12;
      const cubicFt = l * w * depthFt;
      const cubicYards = cubicFt / 27;
      const tons = cubicYards * density;

      layers.push({
        name: projectType === "refresh" ? "Top-up Layer" : "Single Layer",
        depth: d,
        cubicYards,
        tons
      });

      totalCubicYards = cubicYards;
      totalTons = tons;
    } else {
      // 三层计算
      const base = parseFloat(baseDepth) || 6;
      const middle = parseFloat(middleDepth) || 4;
      const surface = parseFloat(surfaceDepth) || 4;

      // Base layer (大石子)
      const baseCubicFt = l * w * (base / 12);
      const baseCubicYards = baseCubicFt / 27;
      const baseTons = baseCubicYards * 1.4; // #2 stone density
      layers.push({ name: "Base Layer (#2 Stone)", depth: base, cubicYards: baseCubicYards, tons: baseTons });

      // Middle layer (中石子)
      const middleCubicFt = l * w * (middle / 12);
      const middleCubicYards = middleCubicFt / 27;
      const middleTons = middleCubicYards * 1.35; // #57 stone density
      layers.push({ name: "Middle Layer (#57 Stone)", depth: middle, cubicYards: middleCubicYards, tons: middleTons });

      // Surface layer (小石子)
      const surfaceCubicFt = l * w * (surface / 12);
      const surfaceCubicYards = surfaceCubicFt / 27;
      const surfaceTons = surfaceCubicYards * density;
      layers.push({ name: "Surface Layer", depth: surface, cubicYards: surfaceCubicYards, tons: surfaceTons });

      totalCubicYards = baseCubicYards + middleCubicYards + surfaceCubicYards;
      totalTons = baseTons + middleTons + surfaceTons;
    }

    // 计算成本
    const price = parseFloat(pricePerTon) || 0;
    const costLow = totalTons * 25;
    const costHigh = totalTons * 50;
    const customCost = price > 0 ? totalTons * price : null;

    setResults({
      totalCubicYards,
      totalTons,
      layers,
      costLow,
      costHigh,
      customCost,
      sqft
    });
  };

  // 重置
  const reset = () => {
    setLength("100");
    setWidth("12");
    setSingleDepth("4");
    setBaseDepth("6");
    setMiddleDepth("4");
    setSurfaceDepth("4");
    setPricePerTon("40");
    setResults(null);
  };

  // 快速尺寸选择
  const quickSizeSelect = (l: number, w: number) => {
    setLength(l.toString());
    setWidth(w.toString());
  };

  // 计算快速参考数据
  const calculateQuickRef = (l: number, w: number, d: number) => {
    const cubicFt = l * w * (d / 12);
    const cubicYards = cubicFt / 27;
    const tons = cubicYards * 1.4;
    return { cubicYards, tons, costLow: tons * 25, costHigh: tons * 50 };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Gravel Driveway Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Gravel Driveway Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much gravel you need for your driveway in cubic yards and tons. Estimate material costs for new driveways or top-up refreshes.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Driveway Details
              </h2>

              {/* Project Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Project Type
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => { setProjectType("new"); setDepthMode("three"); }}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: projectType === "new" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: projectType === "new" ? "#ECFDF5" : "white",
                      color: projectType === "new" ? "#059669" : "#4B5563",
                      fontWeight: projectType === "new" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🆕 New Driveway
                  </button>
                  <button
                    onClick={() => { setProjectType("refresh"); setDepthMode("single"); }}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: projectType === "refresh" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: projectType === "refresh" ? "#ECFDF5" : "white",
                      color: projectType === "refresh" ? "#059669" : "#4B5563",
                      fontWeight: projectType === "refresh" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🔄 Refresh Top Layer
                  </button>
                </div>
              </div>

              {/* Dimensions */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Driveway Dimensions
                </label>
                <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ flex: "1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Length (feet)
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="100"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                      min="1"
                    />
                  </div>
                  <div style={{ flex: "1" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Width (feet)
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="12"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                      min="1"
                    />
                  </div>
                </div>
                {/* Quick Size Buttons */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", color: "#6B7280", marginRight: "4px" }}>Quick:</span>
                  {[
                    { l: 50, w: 10, label: "50×10" },
                    { l: 100, w: 10, label: "100×10" },
                    { l: 100, w: 12, label: "100×12" },
                    { l: 150, w: 12, label: "150×12" },
                  ].map((size) => (
                    <button
                      key={size.label}
                      onClick={() => quickSizeSelect(size.l, size.w)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: length === size.l.toString() && width === size.w.toString() ? "#ECFDF5" : "#F9FAFB",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Depth Settings - Only for New Driveway */}
              {projectType === "new" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Layer Configuration
                  </label>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <button
                      onClick={() => setDepthMode("three")}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: depthMode === "three" ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: depthMode === "three" ? "#ECFDF5" : "white",
                        color: depthMode === "three" ? "#059669" : "#4B5563",
                        fontWeight: depthMode === "three" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      3-Layer (Recommended)
                    </button>
                    <button
                      onClick={() => setDepthMode("single")}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: depthMode === "single" ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: depthMode === "single" ? "#ECFDF5" : "white",
                        color: depthMode === "single" ? "#059669" : "#4B5563",
                        fontWeight: depthMode === "single" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      Single Layer
                    </button>
                  </div>

                  {depthMode === "three" ? (
                    <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px" }}>
                      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ flex: "1" }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                            Base Layer (inches)
                          </label>
                          <input
                            type="number"
                            value={baseDepth}
                            onChange={(e) => setBaseDepth(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #E5E7EB",
                              borderRadius: "6px",
                              fontSize: "0.875rem"
                            }}
                            min="1"
                            max="12"
                          />
                          <p style={{ fontSize: "0.625rem", color: "#9CA3AF", marginTop: "2px" }}>#2 Stone (1-3&quot;)</p>
                        </div>
                        <div style={{ flex: "1" }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                            Middle Layer (inches)
                          </label>
                          <input
                            type="number"
                            value={middleDepth}
                            onChange={(e) => setMiddleDepth(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #E5E7EB",
                              borderRadius: "6px",
                              fontSize: "0.875rem"
                            }}
                            min="1"
                            max="12"
                          />
                          <p style={{ fontSize: "0.625rem", color: "#9CA3AF", marginTop: "2px" }}>#57 Stone (3/4-1&quot;)</p>
                        </div>
                        <div style={{ flex: "1" }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                            Surface Layer (inches)
                          </label>
                          <input
                            type="number"
                            value={surfaceDepth}
                            onChange={(e) => setSurfaceDepth(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #E5E7EB",
                              borderRadius: "6px",
                              fontSize: "0.875rem"
                            }}
                            min="1"
                            max="12"
                          />
                          <p style={{ fontSize: "0.625rem", color: "#9CA3AF", marginTop: "2px" }}>#8 or Pea Gravel</p>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#059669", fontWeight: "500" }}>
                        Total Depth: {(parseFloat(baseDepth) || 0) + (parseFloat(middleDepth) || 0) + (parseFloat(surfaceDepth) || 0)} inches
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Single Layer Depth (inches)
                      </label>
                      <input
                        type="number"
                        value={singleDepth}
                        onChange={(e) => setSingleDepth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem"
                        }}
                        min="1"
                        max="24"
                      />
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                        {[4, 6, 8, 12].map((d) => (
                          <button
                            key={d}
                            onClick={() => setSingleDepth(d.toString())}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "4px",
                              border: "1px solid #E5E7EB",
                              backgroundColor: singleDepth === d.toString() ? "#ECFDF5" : "#F9FAFB",
                              color: "#4B5563",
                              fontSize: "0.75rem",
                              cursor: "pointer"
                            }}
                          >
                            {d}&quot;
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Refresh Mode - Simple Depth */}
              {projectType === "refresh" && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Top-up Depth (inches)
                  </label>
                  <input
                    type="number"
                    value={singleDepth}
                    onChange={(e) => setSingleDepth(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                    min="1"
                    max="12"
                  />
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                    {[2, 3, 4, 6].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSingleDepth(d.toString())}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "4px",
                          border: "1px solid #E5E7EB",
                          backgroundColor: singleDepth === d.toString() ? "#ECFDF5" : "#F9FAFB",
                          color: "#4B5563",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        {d}&quot;
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gravel Type - For single layer or refresh */}
              {(depthMode === "single" || projectType === "refresh") && (
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Gravel Type
                  </label>
                  <select
                    value={gravelType}
                    onChange={(e) => setGravelType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    {gravelTypes.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.size}) - {g.density} tons/yd³
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Price per Ton (optional)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                  <input
                    type="number"
                    value={pricePerTon}
                    onChange={(e) => setPricePerTon(e.target.value)}
                    placeholder="40"
                    style={{
                      width: "100%",
                      padding: "10px 12px 10px 28px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                    min="0"
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                  Typical range: $25-$50 per ton
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#059669",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "12px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Main Result Display */}
              <div style={{ 
                background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: "#059669", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  Total Gravel Needed
                </p>
                <p style={{ 
                  fontSize: "3rem", 
                  fontWeight: "bold", 
                  color: "#059669", 
                  lineHeight: "1" 
                }}>
                  {results ? results.totalTons.toFixed(1) : "—"}
                </p>
                <p style={{ color: "#065F46", marginTop: "4px", fontSize: "1rem", fontWeight: "500" }}>
                  US Tons
                </p>
                <p style={{ color: "#065F46", marginTop: "8px", fontSize: "0.875rem" }}>
                  {results ? `${results.totalCubicYards.toFixed(1)} cubic yards` : "Enter dimensions to calculate"}
                </p>
              </div>

              {/* Layer Breakdown */}
              {results && results.layers.length > 0 && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📦 Layer Breakdown
                  </p>
                  {results.layers.map((layer, index) => (
                    <div key={index} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "10px 12px",
                      backgroundColor: "white",
                      borderRadius: "8px",
                      marginBottom: index < results.layers.length - 1 ? "8px" : "0"
                    }}>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: "500", color: "#111827" }}>{layer.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{layer.depth}&quot; deep</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#059669" }}>{layer.tons.toFixed(1)} tons</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{layer.cubicYards.toFixed(1)} yd³</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cost Estimate */}
              {results && (
                <div style={{ 
                  backgroundColor: "#FEF3C7", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#92400E", textTransform: "uppercase", marginBottom: "8px" }}>
                    💰 Estimated Material Cost
                  </p>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#92400E" }}>
                    ${results.costLow.toLocaleString()} - ${results.costHigh.toLocaleString()}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#B45309", marginTop: "4px" }}>
                    Based on $25-$50 per ton
                  </p>
                  {results.customCost && (
                    <p style={{ fontSize: "0.875rem", color: "#92400E", marginTop: "8px", fontWeight: "500" }}>
                      At ${pricePerTon}/ton: <strong>${results.customCost.toLocaleString()}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Area Info */}
              {results && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  padding: "12px 16px",
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontSize: "0.875rem"
                }}>
                  <span style={{ color: "#6B7280" }}>Driveway Area</span>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{results.sqft.toLocaleString()} sq ft</span>
                </div>
              )}

              {/* Delivery Reference */}
              <div style={{ 
                backgroundColor: "#EFF6FF", 
                borderRadius: "12px", 
                padding: "16px",
                marginBottom: "16px"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#1E40AF", textTransform: "uppercase", marginBottom: "8px" }}>
                  🚚 Delivery Reference
                </p>
                <div style={{ fontSize: "0.75rem", color: "#1E40AF" }}>
                  <p style={{ marginBottom: "4px" }}>• Pickup truck: ~1 cubic yard</p>
                  <p style={{ marginBottom: "4px" }}>• Small dump truck: 8-10 tons</p>
                  <p>• Large dump truck: 13-25 tons</p>
                </div>
                {results && (
                  <p style={{ fontSize: "0.75rem", color: "#1E40AF", marginTop: "8px", fontWeight: "500" }}>
                    You need approximately {Math.ceil(results.totalTons / 15)} dump truck loads
                  </p>
                )}
              </div>

              {/* Quick Reference Toggle */}
              <button
                onClick={() => setShowQuickRef(!showQuickRef)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  backgroundColor: "#F3F4F6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151"
                }}
              >
                <span>📊 Quick Reference Table</span>
                <svg
                  style={{ width: "16px", height: "16px", transform: showQuickRef ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showQuickRef && (
                <div style={{ marginTop: "12px", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6" }}>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Size</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cubic Yds</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Tons</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Est. Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quickReferenceData.map((item, index) => {
                        const calc = calculateQuickRef(item.length, item.width, item.depth);
                        return (
                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB" }}>{item.label}</td>
                            <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{calc.cubicYards.toFixed(0)}</td>
                            <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{calc.tons.toFixed(0)}</td>
                            <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>${calc.costLow.toFixed(0)}-${calc.costHigh.toFixed(0)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p style={{ fontSize: "0.625rem", color: "#9CA3AF", marginTop: "4px" }}>
                    *Based on 12&quot; total depth at 1.4 tons/yd³
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Gravel Driveway */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is a Gravel Driveway?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                A gravel driveway is a cost-effective and durable surface made of loose stone aggregate. Properly constructed gravel driveways consist of multiple layers: a large stone base for stability, a middle layer for drainage, and a fine surface layer for a smooth finish.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                Gravel driveways typically cost $1-3 per square foot compared to $3-10 for asphalt or $8-18 for concrete. With proper maintenance, they can last 50-100 years, making them an excellent choice for rural properties and budget-conscious homeowners.
              </p>
            </div>

            {/* How to Calculate */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Calculate Gravel for a Driveway
              </h2>
              
              <div style={{ 
                backgroundColor: "#ECFDF5", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                borderLeft: "4px solid #059669"
              }}>
                <p style={{ fontWeight: "600", color: "#065F46", fontFamily: "monospace", fontSize: "0.875rem" }}>
                  Volume (ft³) = Length (ft) × Width (ft) × Depth (ft)<br />
                  Cubic Yards = Volume (ft³) ÷ 27<br />
                  Tons = Cubic Yards × Density (typically 1.4)
                </p>
              </div>

              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Example Calculation:
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Driveway:</strong> 100 ft long × 12 ft wide × 12&quot; deep
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Volume:</strong> 100 × 12 × 1 = 1,200 cubic feet
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Cubic Yards:</strong> 1,200 ÷ 27 = 44.4 cubic yards
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#ECFDF5", borderRadius: "8px", borderLeft: "4px solid #059669" }}>
                  <p style={{ fontSize: "0.875rem", color: "#065F46" }}>
                    <strong>Tons Needed:</strong> 44.4 × 1.4 = <strong>62.2 tons</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Depths */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Recommended Gravel Depths
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Use Case</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Base</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Middle</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Surface</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { use: "Light Traffic (cars only)", base: "4-6\"", middle: "4\"", surface: "4\"", total: "12-14\"" },
                      { use: "Standard Residential", base: "6\"", middle: "4-6\"", surface: "4\"", total: "14-16\"" },
                      { use: "Heavy Traffic (trucks)", base: "6-8\"", middle: "6\"", surface: "4-6\"", total: "16-20\"" },
                      { use: "Top-up / Refresh", base: "—", middle: "—", surface: "2-4\"", total: "2-4\"" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.use}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.base}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.middle}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.surface}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Order 10% extra gravel for spillage and settling",
                  "Install landscape fabric to prevent weeds",
                  "Crown the center 2-3\" higher for drainage",
                  "Compact each layer before adding the next",
                  "Edge the driveway to keep gravel contained"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#059669", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Gravel Types Guide */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                🪨 Gravel Size Guide
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#92400E" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>#2 Stone:</strong> 1-3&quot; for base</li>
                <li style={{ marginBottom: "8px" }}>• <strong>#57 Stone:</strong> 3/4-1&quot; for middle</li>
                <li style={{ marginBottom: "8px" }}>• <strong>#8 Stone:</strong> 3/8-1/2&quot; for surface</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Pea Gravel:</strong> 3/8&quot; decorative</li>
                <li>• <strong>Crusher Run:</strong> Mixed, all-purpose</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/gravel-driveway-calculator" currentCategory="Construction" />
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
      </div>
    </div>
  );
}
