"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 车型配置（面积和乙烯基长度）
const vehicleTypes: Record<string, {
  label: string;
  sqftMin: number;
  sqftMax: number;
  vinylFtMin: number;
  vinylFtMax: number;
  basePriceMin: number;
  basePriceMax: number;
}> = {
  "compact": { label: "Compact Car (Mini, Civic, Golf)", sqftMin: 150, sqftMax: 180, vinylFtMin: 50, vinylFtMax: 55, basePriceMin: 2000, basePriceMax: 3500 },
  "sedan": { label: "Sedan (Camry, Model 3, Accord)", sqftMin: 200, sqftMax: 250, vinylFtMin: 55, vinylFtMax: 65, basePriceMin: 2500, basePriceMax: 4500 },
  "coupe": { label: "Coupe / Sports Car (Mustang, 911)", sqftMin: 180, sqftMax: 220, vinylFtMin: 50, vinylFtMax: 60, basePriceMin: 2500, basePriceMax: 5000 },
  "suvSmall": { label: "Small SUV (CR-V, RAV4, Wrangler)", sqftMin: 220, sqftMax: 270, vinylFtMin: 65, vinylFtMax: 75, basePriceMin: 3000, basePriceMax: 4500 },
  "suvLarge": { label: "Large SUV (Tahoe, Escalade, X5)", sqftMin: 270, sqftMax: 320, vinylFtMin: 75, vinylFtMax: 90, basePriceMin: 3500, basePriceMax: 5500 },
  "truckStandard": { label: "Truck - Standard (F-150, RAM 1500)", sqftMin: 250, sqftMax: 300, vinylFtMin: 60, vinylFtMax: 80, basePriceMin: 3500, basePriceMax: 5500 },
  "truckFullsize": { label: "Truck - Full Size (F-250, 2500HD)", sqftMin: 300, sqftMax: 400, vinylFtMin: 80, vinylFtMax: 125, basePriceMin: 4000, basePriceMax: 6500 },
  "minivan": { label: "Minivan (Sienna, Odyssey)", sqftMin: 280, sqftMax: 350, vinylFtMin: 75, vinylFtMax: 100, basePriceMin: 3500, basePriceMax: 5500 },
  "commercialVan": { label: "Commercial Van (Sprinter, Transit)", sqftMin: 400, sqftMax: 500, vinylFtMin: 100, vinylFtMax: 150, basePriceMin: 5000, basePriceMax: 10000 }
};

// 覆盖范围
const coverageTypes: Record<string, { label: string; percent: number; desc: string }> = {
  "full": { label: "Full Wrap", percent: 100, desc: "Complete bumper-to-bumper coverage" },
  "threequarter": { label: "3/4 Wrap (75%)", percent: 75, desc: "Most panels except some trim" },
  "half": { label: "Half Wrap (50%)", percent: 50, desc: "Doors, hood, or strategic areas" },
  "partial": { label: "Partial (Hood/Roof)", percent: 25, desc: "Accent panels only" },
  "spot": { label: "Spot Graphics", percent: 10, desc: "Logos, decals, lettering" }
};

// 材料类型
const materialTypes: Record<string, { label: string; priceMin: number; priceMax: number; desc: string }> = {
  "standard": { label: "Standard Vinyl", priceMin: 5, priceMax: 8, desc: "Basic gloss/matte films" },
  "premium": { label: "Premium (3M, Avery)", priceMin: 9, priceMax: 12, desc: "3M 2080, Avery SW900" },
  "specialty": { label: "Specialty Finish", priceMin: 12, priceMax: 20, desc: "Chrome, color-shift, carbon fiber" }
};

// 材料质感
const finishTypes: Record<string, { label: string; multiplier: number }> = {
  "gloss": { label: "Gloss", multiplier: 1.0 },
  "matte": { label: "Matte", multiplier: 1.0 },
  "satin": { label: "Satin", multiplier: 1.05 },
  "carbonFiber": { label: "Carbon Fiber", multiplier: 1.15 },
  "chrome": { label: "Chrome", multiplier: 1.5 }
};

// 设计复杂度
const designTypes: Record<string, { label: string; multiplier: number; desc: string }> = {
  "single": { label: "Single Color", multiplier: 1.0, desc: "One solid color" },
  "twoTone": { label: "Two-Tone", multiplier: 1.2, desc: "Two colors/accents" },
  "customPrint": { label: "Custom Print", multiplier: 1.4, desc: "Printed graphics/branding" },
  "complex": { label: "Complex Graphics", multiplier: 1.6, desc: "Photo-realistic, full coverage art" }
};

// 人工费用
const laborRates = {
  standard: { min: 3, max: 5 },
  complex: { min: 5, max: 7 }
};

// DIY工具成本
const diyToolsCost = { min: 100, max: 300 };

// FAQ数据
const faqs = [
  {
    question: "How do you calculate car wrap cost?",
    answer: "Car wrap cost is calculated by multiplying the vehicle's surface area (in square feet) by the material cost per square foot, then adding labor costs. The formula is: Total = (Square Footage × Material $/sqft) + (Square Footage × Labor $/sqft). Design complexity, material type (standard vs premium), and coverage level also affect the final price. A full wrap on a sedan typically uses 200-250 square feet of vinyl."
  },
  {
    question: "How much does it cost to wrap a whole car?",
    answer: "A full car wrap typically costs $2,000 to $7,000 for professional installation. Compact cars start around $2,000-$3,500, sedans run $2,500-$4,500, and larger SUVs/trucks can cost $3,500-$6,500 or more. Specialty finishes like chrome or color-shift vinyl can push prices to $8,000-$12,000. DIY wraps cost $500-$1,500 for materials plus $100-$300 for tools."
  },
  {
    question: "How to price a vehicle wrap?",
    answer: "To price a vehicle wrap, consider: 1) Vehicle size (determines square footage), 2) Coverage level (full vs partial), 3) Material quality (standard $5-8/sqft, premium $9-12/sqft, specialty $12-20/sqft), 4) Labor rate ($3-7/sqft), and 5) Design complexity. Add 10-15% extra vinyl for waste. Most shops calculate: Material + Labor + Design fees = Quote."
  },
  {
    question: "How much square feet to wrap a car?",
    answer: "The square footage varies by vehicle size: Compact cars need 150-180 sqft, sedans require 200-250 sqft, small SUVs use 220-270 sqft, and large SUVs/trucks need 270-400+ sqft. This translates to 50-65 feet of vinyl for most cars and 75-125 feet for larger vehicles. Always add 10-20% extra material for overlaps, curves, and mistakes."
  },
  {
    question: "Is it cheaper to wrap or paint a car?",
    answer: "Wrapping is generally cheaper than a quality paint job. A professional wrap costs $2,000-$7,000, while a high-quality paint job runs $3,500-$10,000+. Wraps also offer advantages: they're reversible, protect original paint, take less time (2-5 days vs 1-2 weeks), and can be customized with graphics. However, paint lasts longer (10+ years vs 5-7 years for wraps)."
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

export default function VehicleWrapPricingCalculator() {
  // 输入状态
  const [vehicleType, setVehicleType] = useState<string>("sedan");
  const [coverage, setCoverage] = useState<string>("full");
  const [material, setMaterial] = useState<string>("premium");
  const [finish, setFinish] = useState<string>("gloss");
  const [design, setDesign] = useState<string>("single");
  const [installType, setInstallType] = useState<string>("professional");

  // 结果
  const [results, setResults] = useState<{
    sqftMin: number;
    sqftMax: number;
    vinylFtMin: number;
    vinylFtMax: number;
    materialCostMin: number;
    materialCostMax: number;
    laborCostMin: number;
    laborCostMax: number;
    totalMin: number;
    totalMax: number;
    paintJobMin: number;
    paintJobMax: number;
    savings: number;
  } | null>(null);

  // 计算
  const calculate = () => {
    const vehicle = vehicleTypes[vehicleType];
    const coverageData = coverageTypes[coverage];
    const materialData = materialTypes[material];
    const finishData = finishTypes[finish];
    const designData = designTypes[design];

    // 计算实际面积
    const actualSqftMin = Math.round(vehicle.sqftMin * (coverageData.percent / 100));
    const actualSqftMax = Math.round(vehicle.sqftMax * (coverageData.percent / 100));

    // 计算乙烯基长度
    const actualVinylMin = Math.round(vehicle.vinylFtMin * (coverageData.percent / 100));
    const actualVinylMax = Math.round(vehicle.vinylFtMax * (coverageData.percent / 100));

    // 材料成本（含质感加成）
    const materialPriceMin = materialData.priceMin * finishData.multiplier;
    const materialPriceMax = materialData.priceMax * finishData.multiplier;
    const materialCostMin = Math.round(actualSqftMin * materialPriceMin);
    const materialCostMax = Math.round(actualSqftMax * materialPriceMax);

    // 人工成本
    let laborCostMin = 0;
    let laborCostMax = 0;
    if (installType === "professional") {
      const laborRate = finish === "chrome" || finish === "carbonFiber" ? laborRates.complex : laborRates.standard;
      laborCostMin = Math.round(actualSqftMin * laborRate.min);
      laborCostMax = Math.round(actualSqftMax * laborRate.max);
    } else {
      // DIY工具成本
      laborCostMin = diyToolsCost.min;
      laborCostMax = diyToolsCost.max;
    }

    // 设计复杂度加成
    const subtotalMin = materialCostMin + laborCostMin;
    const subtotalMax = materialCostMax + laborCostMax;
    
    // 应用设计加成（仅对专业安装）
    let totalMin = subtotalMin;
    let totalMax = subtotalMax;
    if (installType === "professional") {
      totalMin = Math.round(subtotalMin * designData.multiplier);
      totalMax = Math.round(subtotalMax * designData.multiplier);
    } else {
      // DIY只加材料的设计加成
      totalMin = Math.round(materialCostMin * designData.multiplier) + laborCostMin;
      totalMax = Math.round(materialCostMax * designData.multiplier) + laborCostMax;
    }

    // 添加10%余量
    totalMin = Math.round(totalMin * 1.1);
    totalMax = Math.round(totalMax * 1.1);

    // 油漆成本对比
    const paintJobMin = Math.round(vehicle.basePriceMin * 1.5);
    const paintJobMax = Math.round(vehicle.basePriceMax * 2);

    // 节省金额
    const avgWrap = (totalMin + totalMax) / 2;
    const avgPaint = (paintJobMin + paintJobMax) / 2;
    const savings = Math.round(((avgPaint - avgWrap) / avgPaint) * 100);

    setResults({
      sqftMin: actualSqftMin,
      sqftMax: actualSqftMax,
      vinylFtMin: actualVinylMin,
      vinylFtMax: actualVinylMax,
      materialCostMin,
      materialCostMax,
      laborCostMin,
      laborCostMax,
      totalMin,
      totalMax,
      paintJobMin,
      paintJobMax,
      savings: Math.max(0, savings)
    });
  };

  // 重置
  const reset = () => {
    setVehicleType("sedan");
    setCoverage("full");
    setMaterial("premium");
    setFinish("gloss");
    setDesign("single");
    setInstallType("professional");
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Vehicle Wrap Pricing Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Vehicle Wrap Pricing Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the cost of wrapping your car, truck, or SUV. Get accurate pricing for vinyl wraps based on vehicle size, material type, and installation method.
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
            <div style={{ flex: "1", minWidth: "320px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Vehicle & Wrap Details
              </h2>

              {/* Vehicle Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🚗 Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white"
                  }}
                >
                  {Object.entries(vehicleTypes).map(([key, data]) => (
                    <option key={key} value={key}>{data.label}</option>
                  ))}
                </select>
                <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "4px" }}>
                  📐 {vehicleTypes[vehicleType].sqftMin}-{vehicleTypes[vehicleType].sqftMax} sq ft | {vehicleTypes[vehicleType].vinylFtMin}-{vehicleTypes[vehicleType].vinylFtMax} ft vinyl
                </p>
              </div>

              {/* Coverage */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📏 Wrap Coverage
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(coverageTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setCoverage(key)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: coverage === key ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: coverage === key ? "#EFF6FF" : "white",
                        color: coverage === key ? "#2563EB" : "#4B5563",
                        fontWeight: coverage === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "center"
                      }}
                    >
                      <div>{data.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🎨 Material Quality
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(materialTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setMaterial(key)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: material === key ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: material === key ? "#F5F3FF" : "white",
                        color: material === key ? "#7C3AED" : "#4B5563",
                        fontWeight: material === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{data.label}</span>
                        <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>${data.priceMin}-${data.priceMax}/sqft</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>{data.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ✨ Finish Type
                </label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {Object.entries(finishTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setFinish(key)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: finish === key ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: finish === key ? "#ECFDF5" : "white",
                        color: finish === key ? "#059669" : "#4B5563",
                        fontWeight: finish === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      {data.label}
                      {data.multiplier > 1 && <span style={{ fontSize: "0.6rem", marginLeft: "4px" }}>+{Math.round((data.multiplier - 1) * 100)}%</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Complexity */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🖌️ Design Complexity
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(designTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setDesign(key)}
                      style={{
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: design === key ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                        backgroundColor: design === key ? "#FEF3C7" : "white",
                        color: design === key ? "#92400E" : "#4B5563",
                        fontWeight: design === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "center"
                      }}
                    >
                      <div>{data.label}</div>
                      {data.multiplier > 1 && <div style={{ fontSize: "0.6rem", color: "#9CA3AF" }}>+{Math.round((data.multiplier - 1) * 100)}%</div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Installation Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🔧 Installation Type
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setInstallType("professional")}
                    style={{
                      flex: "1",
                      padding: "12px",
                      borderRadius: "8px",
                      border: installType === "professional" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: installType === "professional" ? "#EFF6FF" : "white",
                      color: installType === "professional" ? "#2563EB" : "#4B5563",
                      fontWeight: installType === "professional" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    👨‍🔧 Professional
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>$3-7/sqft labor</div>
                  </button>
                  <button
                    onClick={() => setInstallType("diy")}
                    style={{
                      flex: "1",
                      padding: "12px",
                      borderRadius: "8px",
                      border: installType === "diy" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: installType === "diy" ? "#ECFDF5" : "white",
                      color: installType === "diy" ? "#059669" : "#4B5563",
                      fontWeight: installType === "diy" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🛠️ DIY
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>Tools: $100-300</div>
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🚗 Calculate Cost
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "14px 24px",
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
            <div style={{ flex: "1", minWidth: "320px" }}>
              {/* Total Estimate */}
              <div style={{
                background: results
                  ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: results ? "#2563EB" : "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px"
                }}>
                  💰 Estimated Total Cost
                </p>
                <p style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: results ? "#1E40AF" : "#9CA3AF",
                  lineHeight: "1"
                }}>
                  {results ? `$${results.totalMin.toLocaleString()} - $${results.totalMax.toLocaleString()}` : "—"}
                </p>
                <p style={{
                  color: results ? "#2563EB" : "#6B7280",
                  marginTop: "8px",
                  fontSize: "0.875rem"
                }}>
                  {results ? `${coverageTypes[coverage].label} • ${installType === "professional" ? "Professional Install" : "DIY"}` : "Enter details to calculate"}
                </p>
              </div>

              {/* Cost Breakdown */}
              {results && (
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📊 Cost Breakdown
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>🎨 Material Cost</span>
                      <span style={{ fontWeight: "600", color: "#7C3AED" }}>${results.materialCostMin.toLocaleString()} - ${results.materialCostMax.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>{installType === "professional" ? "👨‍🔧 Labor Cost" : "🛠️ Tools Cost"}</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>${results.laborCostMin.toLocaleString()} - ${results.laborCostMax.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#EFF6FF", borderRadius: "8px" }}>
                      <span style={{ color: "#1E40AF", fontWeight: "600" }}>📐 Surface Area</span>
                      <span style={{ fontWeight: "600", color: "#1E40AF" }}>{results.sqftMin} - {results.sqftMax} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>📦 Vinyl Needed</span>
                      <span style={{ fontWeight: "600", color: "#6B7280" }}>{results.vinylFtMin} - {results.vinylFtMax} ft</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wrap vs Paint */}
              {results && (
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#065F46", textTransform: "uppercase", marginBottom: "12px" }}>
                    🎨 Wrap vs Paint Job
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Vinyl Wrap</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>${results.totalMin.toLocaleString()}</p>
                      <p style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>to ${results.totalMax.toLocaleString()}</p>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Paint Job</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#DC2626" }}>${results.paintJobMin.toLocaleString()}</p>
                      <p style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>to ${results.paintJobMax.toLocaleString()}</p>
                    </div>
                  </div>
                  {results.savings > 0 && (
                    <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.875rem", color: "#059669", fontWeight: "600" }}>
                      💚 Save ~{results.savings}% with vinyl wrap!
                    </p>
                  )}
                </div>
              )}

              {/* Quick Reference */}
              {!results && (
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#92400E", marginBottom: "12px" }}>
                    📊 Quick Price Reference
                  </p>
                  <div style={{ fontSize: "0.8rem", color: "#92400E" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Compact Car</span>
                      <span style={{ fontWeight: "600" }}>$2,000 - $3,500</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Sedan</span>
                      <span style={{ fontWeight: "600" }}>$2,500 - $4,500</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>SUV</span>
                      <span style={{ fontWeight: "600" }}>$3,000 - $5,500</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Truck</span>
                      <span style={{ fontWeight: "600" }}>$3,500 - $6,500</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DIY Warning */}
              {results && installType === "diy" && (
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #FDE68A"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>
                    ⚠️ DIY Considerations
                  </p>
                  <ul style={{ fontSize: "0.75rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                    <li>Requires 2-5 days of work</li>
                    <li>Risk of bubbles, wrinkles, peeling</li>
                    <li>Add 15-20% extra vinyl for mistakes</li>
                    <li>Practice on small panels first</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How Costs Are Calculated */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How Vehicle Wrap Costs Are Calculated
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Vehicle wrap pricing is based on <strong>square footage</strong>, <strong>material quality</strong>, and <strong>labor costs</strong>. The formula professionals use:
              </p>

              <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "8px", marginBottom: "16px", fontFamily: "monospace", fontSize: "0.875rem", color: "#1E40AF" }}>
                Total = (Sq Ft × Material $/sqft) + (Sq Ft × Labor $/sqft) + Design Fees
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7C3AED" }}>$5-20</p>
                  <p style={{ fontSize: "0.75rem", color: "#6D28D9" }}>Material<br />/sq ft</p>
                </div>
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>$3-7</p>
                  <p style={{ fontSize: "0.75rem", color: "#065F46" }}>Labor<br />/sq ft</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>+10%</p>
                  <p style={{ fontSize: "0.75rem", color: "#92400E" }}>Extra vinyl<br />for waste</p>
                </div>
              </div>
            </div>

            {/* Cost by Vehicle Type */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Average Wrap Cost by Vehicle Type
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Vehicle Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Sq Ft</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Standard</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "🚗 Compact Car", sqft: "150-180", standard: "$1,500-$2,500", premium: "$2,000-$3,500" },
                      { type: "🚙 Sedan", sqft: "200-250", standard: "$2,000-$3,500", premium: "$2,500-$4,500" },
                      { type: "🏎️ Coupe/Sports", sqft: "180-220", standard: "$2,000-$3,500", premium: "$2,500-$5,000" },
                      { type: "🚐 Small SUV", sqft: "220-270", standard: "$2,500-$3,500", premium: "$3,000-$4,500" },
                      { type: "🚜 Large SUV", sqft: "270-320", standard: "$3,000-$4,500", premium: "$3,500-$5,500" },
                      { type: "🛻 Truck", sqft: "250-400", standard: "$3,000-$5,000", premium: "$3,500-$6,500" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.type}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.sqft}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.standard}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#7C3AED" }}>{row.premium}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "8px" }}>
                * Prices for full wrap with professional installation. Specialty finishes (chrome, color-shift) add 50%+.
              </p>
            </div>

            {/* Wrap vs Paint */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                🎨 Car Wrap vs Paint Job: Which is Better?
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Factor</th>
                      <th style={{ padding: "12px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", textAlign: "center" }}>Vinyl Wrap</th>
                      <th style={{ padding: "12px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", textAlign: "center" }}>Paint Job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { factor: "Cost", wrap: "$2,000-$7,000", paint: "$3,500-$10,000+" },
                      { factor: "Time", wrap: "2-5 days", paint: "1-2 weeks" },
                      { factor: "Lifespan", wrap: "5-7 years", paint: "10+ years" },
                      { factor: "Reversible", wrap: "✅ Yes", paint: "❌ No" },
                      { factor: "Protects Paint", wrap: "✅ Yes", paint: "N/A" },
                      { factor: "Custom Graphics", wrap: "✅ Easy", paint: "❌ Expensive" },
                      { factor: "Resale Value", wrap: "✅ Preserved", paint: "⚠️ May decrease" },
                    ].map((row, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.factor}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F0FDF4" }}>{row.wrap}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF2F2" }}>{row.paint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Tips to Save */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Tips to Save on Car Wraps
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Get 3+ quotes from local shops",
                  "Choose partial wrap over full",
                  "Skip chrome/color-shift finishes",
                  "Ask about fleet/bulk discounts",
                  "Consider matte over specialty",
                  "Schedule during off-peak times"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#2563EB", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Material Brands */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                🏆 Top Vinyl Brands
              </h3>
              <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                <div style={{ padding: "8px", backgroundColor: "white", borderRadius: "6px", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600" }}>3M</span> - Premium quality, 5-7yr durability
                </div>
                <div style={{ padding: "8px", backgroundColor: "white", borderRadius: "6px", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600" }}>Avery Dennison</span> - Great value, easy install
                </div>
                <div style={{ padding: "8px", backgroundColor: "white", borderRadius: "6px", marginBottom: "8px" }}>
                  <span style={{ fontWeight: "600" }}>ORACAL</span> - Budget-friendly option
                </div>
                <div style={{ padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600" }}>XPEL/SunTek</span> - PPF specialists
                </div>
              </div>
            </div>

            <RelatedTools currentUrl="/vehicle-wrap-pricing-calculator" currentCategory="Finance" />
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
