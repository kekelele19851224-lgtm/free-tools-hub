"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 草坪尺寸定价
const sizeRanges = [
  { id: "small", label: "Small", sqftMin: 0, sqftMax: 7000, priceMin: 25, priceMax: 50, avg: 38 },
  { id: "medium", label: "Medium", sqftMin: 7000, sqftMax: 12000, priceMin: 45, priceMax: 75, avg: 60 },
  { id: "large", label: "Large", sqftMin: 12000, sqftMax: 22000, priceMin: 75, priceMax: 100, avg: 88 },
  { id: "xlarge", label: "X-Large", sqftMin: 22000, sqftMax: 43560, priceMin: 100, priceMax: 150, avg: 125 },
  { id: "acre", label: "1+ Acre", sqftMin: 43560, sqftMax: 999999, priceMin: 150, priceMax: 250, avg: 200 }
];

// 服务频率调整
const frequencyOptions = [
  { id: "onetime", label: "One-time", multiplier: 1.5, desc: "Single visit" },
  { id: "weekly", label: "Weekly", multiplier: 1.0, desc: "Best value" },
  { id: "biweekly", label: "Bi-weekly", multiplier: 1.15, desc: "Every 2 weeks" },
  { id: "monthly", label: "Monthly", multiplier: 1.25, desc: "Once a month" }
];

// 地形复杂度
const terrainOptions = [
  { id: "easy", label: "Easy/Flat", multiplier: 1.0, desc: "Open, flat lawn" },
  { id: "moderate", label: "Moderate", multiplier: 1.2, desc: "Some obstacles/slopes" },
  { id: "complex", label: "Complex", multiplier: 1.4, desc: "Many obstacles, steep slopes" }
];

// 草的高度
const grassHeightOptions = [
  { id: "normal", label: "Normal (<6\")", multiplier: 1.0 },
  { id: "overgrown", label: "Overgrown (6-12\")", multiplier: 1.25 },
  { id: "veryovergrown", label: "Very Overgrown (>12\")", multiplier: 1.5 }
];

// 附加服务
const additionalServices: Record<string, { min: number; max: number; avg: number; label: string }> = {
  "edging": { min: 20, max: 50, avg: 35, label: "Edging (along driveways, walkways)" },
  "trimming": { min: 25, max: 50, avg: 38, label: "Trimming/Weed Eating" },
  "blowing": { min: 15, max: 35, avg: 25, label: "Blowing/Cleanup" },
  "bagging": { min: 10, max: 30, avg: 20, label: "Bagging Clippings" },
  "fertilization": { min: 65, max: 150, avg: 100, label: "Fertilization" },
  "aeration": { min: 75, max: 200, avg: 140, label: "Aeration" },
  "weedcontrol": { min: 50, max: 125, avg: 85, label: "Weed Control" }
};

// FAQ数据
const faqs = [
  {
    question: "How much should I charge to mow a lawn?",
    answer: "Most lawn care professionals charge $30-$65 per hour or $50-$250 per service depending on lawn size. For a typical 1/4 acre lawn (about 10,000 sq ft), charge $45-$85. Factor in your time, fuel costs, equipment wear, and desired profit margin. Weekly customers typically get 10-20% discounts."
  },
  {
    question: "How to figure out what to charge for mowing a lawn?",
    answer: "Use this formula: (Labor time × hourly rate) + Overhead + Equipment costs + Profit margin = Your price. First, estimate how long the job will take. Multiply by your target hourly rate ($30-$65). Add overhead costs (fuel, insurance, travel). Then add your profit margin (typically 20-30%)."
  },
  {
    question: "How to give an estimate for mowing a lawn?",
    answer: "Always visit the property first. Measure the lawn size, note obstacles (trees, beds, fences), check grass height and condition, and assess terrain difficulty. Then calculate: base price for size + terrain adjustment + grass condition surcharge + any additional services requested."
  },
  {
    question: "What is the 1/3 rule for mowing?",
    answer: "The 1/3 rule states you should never cut more than one-third of the grass blade height at once. For example, if your grass is 4 inches tall, only cut 1.3 inches (down to 2.7 inches). This promotes healthier grass, deeper roots, and reduces stress on your lawn. Cutting too much at once can damage the grass and promote weed growth."
  },
  {
    question: "How often should I mow my lawn?",
    answer: "During peak growing season (spring and summer), mow weekly. Cool-season grasses (Kentucky bluegrass, fescue) grow fastest in spring and fall. Warm-season grasses (Bermuda, Zoysia) grow fastest in summer. Reduce frequency to every 2-3 weeks in slower growing periods. Always follow the 1/3 rule."
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

export default function LawnMowingCostCalculator() {
  // 输入状态
  const [lawnSize, setLawnSize] = useState<string>("10000");
  const [sizeUnit, setSizeUnit] = useState<"sqft" | "acres">("sqft");
  const [grassHeight, setGrassHeight] = useState<string>("normal");
  const [terrain, setTerrain] = useState<string>("easy");
  const [frequency, setFrequency] = useState<string>("weekly");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // 结果
  const [results, setResults] = useState<{
    minCost: number;
    maxCost: number;
    avgCost: number;
    breakdown: {
      baseMowing: { min: number; max: number; avg: number };
      terrainAdj: { min: number; max: number; avg: number };
      grassAdj: { min: number; max: number; avg: number };
      frequencyAdj: { min: number; max: number; avg: number };
      servicesCost: { min: number; max: number; avg: number };
    };
    annualCost: number;
    weeksPerYear: number;
    sqft: number;
  } | null>(null);

  // 切换附加服务
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // 获取草坪尺寸（转换为sqft）
  const getSqFt = (): number => {
    const size = parseFloat(lawnSize) || 0;
    return sizeUnit === "acres" ? size * 43560 : size;
  };

  // 计算
  const calculate = () => {
    const sqft = getSqFt();
    if (sqft <= 0) {
      alert("Please enter a valid lawn size");
      return;
    }

    // 找到对应的尺寸档位
    let sizeRange = sizeRanges[0];
    for (const range of sizeRanges) {
      if (sqft >= range.sqftMin && sqft < range.sqftMax) {
        sizeRange = range;
        break;
      }
      if (sqft >= range.sqftMax) {
        sizeRange = range;
      }
    }

    // 基础割草费用（按尺寸线性插值）
    let baseMin = sizeRange.priceMin;
    let baseMax = sizeRange.priceMax;
    let baseAvg = sizeRange.avg;

    // 如果超过1英亩，按英亩数增加
    if (sqft > 43560) {
      const acres = sqft / 43560;
      baseMin = Math.round(150 * acres);
      baseMax = Math.round(250 * acres);
      baseAvg = Math.round(200 * acres);
    }

    // 地形调整
    const terrainMult = terrainOptions.find(t => t.id === terrain)?.multiplier || 1;
    const terrainAdjMin = Math.round(baseMin * (terrainMult - 1));
    const terrainAdjMax = Math.round(baseMax * (terrainMult - 1));
    const terrainAdjAvg = Math.round(baseAvg * (terrainMult - 1));

    // 草高度调整
    const grassMult = grassHeightOptions.find(g => g.id === grassHeight)?.multiplier || 1;
    const grassAdjMin = Math.round((baseMin + terrainAdjMin) * (grassMult - 1));
    const grassAdjMax = Math.round((baseMax + terrainAdjMax) * (grassMult - 1));
    const grassAdjAvg = Math.round((baseAvg + terrainAdjAvg) * (grassMult - 1));

    // 小计（用于计算频率调整）
    const subtotalMin = baseMin + terrainAdjMin + grassAdjMin;
    const subtotalMax = baseMax + terrainAdjMax + grassAdjMax;
    const subtotalAvg = baseAvg + terrainAdjAvg + grassAdjAvg;

    // 频率调整
    const freqMult = frequencyOptions.find(f => f.id === frequency)?.multiplier || 1;
    const freqAdjMin = Math.round(subtotalMin * (freqMult - 1));
    const freqAdjMax = Math.round(subtotalMax * (freqMult - 1));
    const freqAdjAvg = Math.round(subtotalAvg * (freqMult - 1));

    // 附加服务费用
    let servicesMin = 0, servicesMax = 0, servicesAvg = 0;
    selectedServices.forEach(service => {
      const svc = additionalServices[service];
      if (svc) {
        servicesMin += svc.min;
        servicesMax += svc.max;
        servicesAvg += svc.avg;
      }
    });

    // 总费用
    const minCost = baseMin + terrainAdjMin + grassAdjMin + freqAdjMin + servicesMin;
    const maxCost = baseMax + terrainAdjMax + grassAdjMax + freqAdjMax + servicesMax;
    const avgCost = baseAvg + terrainAdjAvg + grassAdjAvg + freqAdjAvg + servicesAvg;

    // 年度费用估算
    let weeksPerYear = 30; // 默认割草季节周数
    if (frequency === "weekly") weeksPerYear = 30;
    else if (frequency === "biweekly") weeksPerYear = 15;
    else if (frequency === "monthly") weeksPerYear = 7;
    else weeksPerYear = 1; // one-time

    const annualCost = Math.round(avgCost * weeksPerYear);

    setResults({
      minCost,
      maxCost,
      avgCost,
      breakdown: {
        baseMowing: { min: baseMin, max: baseMax, avg: baseAvg },
        terrainAdj: { min: terrainAdjMin, max: terrainAdjMax, avg: terrainAdjAvg },
        grassAdj: { min: grassAdjMin, max: grassAdjMax, avg: grassAdjAvg },
        frequencyAdj: { min: freqAdjMin, max: freqAdjMax, avg: freqAdjAvg },
        servicesCost: { min: servicesMin, max: servicesMax, avg: servicesAvg }
      },
      annualCost,
      weeksPerYear,
      sqft
    });
  };

  // 重置
  const reset = () => {
    setLawnSize("10000");
    setSizeUnit("sqft");
    setGrassHeight("normal");
    setTerrain("easy");
    setFrequency("weekly");
    setSelectedServices([]);
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
            <span className="text-gray-900">Lawn Mowing Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Lawn Mowing Cost Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate lawn mowing costs based on size, frequency, terrain, and additional services. Perfect for homeowners budgeting lawn care or professionals pricing jobs.
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
                Lawn Details
              </h2>

              {/* Lawn Size */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📐 Lawn Size
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="number"
                    value={lawnSize}
                    onChange={(e) => setLawnSize(e.target.value)}
                    style={{
                      width: "140px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                    min="100"
                  />
                  <select
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value as "sqft" | "acres")}
                    style={{
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="sqft">sq ft</option>
                    <option value="acres">acres</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[5000, 7500, 10000, 15000, 20000].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setLawnSize(s.toString()); setSizeUnit("sqft"); }}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: lawnSize === s.toString() && sizeUnit === "sqft" ? "#DCFCE7" : "#F9FAFB",
                        color: lawnSize === s.toString() && sizeUnit === "sqft" ? "#166534" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {s.toLocaleString()}
                    </button>
                  ))}
                  <button
                    onClick={() => { setLawnSize("1"); setSizeUnit("acres"); }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: sizeUnit === "acres" && lawnSize === "1" ? "#DCFCE7" : "#F9FAFB",
                      color: sizeUnit === "acres" && lawnSize === "1" ? "#166534" : "#4B5563",
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    1 acre
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "6px" }}>
                  💡 Average US lawn is ~10,000 sq ft (about 1/4 acre)
                </p>
              </div>

              {/* Grass Height */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🌿 Grass Height/Condition
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {grassHeightOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setGrassHeight(opt.id)}
                      style={{
                        flex: "1",
                        minWidth: "100px",
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: grassHeight === opt.id ? "2px solid #22C55E" : "1px solid #E5E7EB",
                        backgroundColor: grassHeight === opt.id ? "#DCFCE7" : "white",
                        color: grassHeight === opt.id ? "#166534" : "#4B5563",
                        fontWeight: grassHeight === opt.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      {opt.label}
                      {opt.multiplier > 1 && (
                        <span style={{ display: "block", fontSize: "0.65rem", color: "#D97706" }}>
                          +{Math.round((opt.multiplier - 1) * 100)}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terrain Complexity */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ⛰️ Terrain Complexity
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {terrainOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTerrain(opt.id)}
                      style={{
                        flex: "1",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: terrain === opt.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: terrain === opt.id ? "#EFF6FF" : "white",
                        color: terrain === opt.id ? "#2563EB" : "#4B5563",
                        fontWeight: terrain === opt.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "left"
                      }}
                    >
                      <div>{opt.label}</div>
                      <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>{opt.desc}</div>
                      {opt.multiplier > 1 && (
                        <div style={{ fontSize: "0.65rem", color: "#D97706", marginTop: "2px" }}>
                          +{Math.round((opt.multiplier - 1) * 100)}%
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Frequency */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📅 Service Frequency
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {frequencyOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFrequency(opt.id)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: frequency === opt.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: frequency === opt.id ? "#F5F3FF" : "white",
                        color: frequency === opt.id ? "#7C3AED" : "#4B5563",
                        fontWeight: frequency === opt.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{opt.label}</span>
                        {opt.multiplier !== 1 && (
                          <span style={{ 
                            fontSize: "0.65rem", 
                            color: opt.multiplier > 1 ? "#D97706" : "#059669",
                            backgroundColor: opt.multiplier > 1 ? "#FEF3C7" : "#DCFCE7",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}>
                            {opt.multiplier > 1 ? `+${Math.round((opt.multiplier - 1) * 100)}%` : "Best Value"}
                          </span>
                        )}
                        {opt.multiplier === 1 && (
                          <span style={{ 
                            fontSize: "0.65rem", 
                            color: "#059669",
                            backgroundColor: "#DCFCE7",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}>
                            Best Value
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ➕ Additional Services (optional)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(additionalServices).map(([key, data]) => (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: selectedServices.includes(key) ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: selectedServices.includes(key) ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(key)}
                        onChange={() => toggleService(key)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ flex: "1", color: "#374151" }}>{data.label}</span>
                      <span style={{ color: "#059669", fontWeight: "500", fontSize: "0.75rem" }}>+${data.min}-{data.max}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#22C55E",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🌿 Calculate Cost
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
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Main Result */}
              <div style={{ 
                background: results 
                  ? "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: results ? "#166534" : "#6B7280",
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  💰 Estimated Cost Per Visit
                </p>
                <p style={{ 
                  fontSize: "2.5rem", 
                  fontWeight: "bold", 
                  color: results ? "#15803D" : "#9CA3AF",
                  lineHeight: "1" 
                }}>
                  {results ? `$${results.minCost} - $${results.maxCost}` : "—"}
                </p>
                <p style={{ 
                  color: results ? "#166534" : "#6B7280",
                  marginTop: "8px", 
                  fontSize: "1rem",
                  fontWeight: "500"
                }}>
                  {results ? `Average: $${results.avgCost}` : "Enter details to calculate"}
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
                    📋 Cost Breakdown (Average)
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Base Mowing ({results.sqft.toLocaleString()} sq ft)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${results.breakdown.baseMowing.avg}</span>
                    </div>
                    {results.breakdown.terrainAdj.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Terrain Adjustment</span>
                        <span style={{ fontWeight: "600", color: "#D97706" }}>+${results.breakdown.terrainAdj.avg}</span>
                      </div>
                    )}
                    {results.breakdown.grassAdj.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Grass Height Surcharge</span>
                        <span style={{ fontWeight: "600", color: "#D97706" }}>+${results.breakdown.grassAdj.avg}</span>
                      </div>
                    )}
                    {results.breakdown.frequencyAdj.avg !== 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: results.breakdown.frequencyAdj.avg > 0 ? "#FEF3C7" : "#DCFCE7", borderRadius: "8px" }}>
                        <span style={{ color: results.breakdown.frequencyAdj.avg > 0 ? "#92400E" : "#166534" }}>Frequency Adjustment</span>
                        <span style={{ fontWeight: "600", color: results.breakdown.frequencyAdj.avg > 0 ? "#D97706" : "#059669" }}>
                          {results.breakdown.frequencyAdj.avg > 0 ? "+" : ""}${results.breakdown.frequencyAdj.avg}
                        </span>
                      </div>
                    )}
                    {results.breakdown.servicesCost.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Additional Services</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>+${results.breakdown.servicesCost.avg}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Annual Cost */}
              {results && frequency !== "onetime" && (
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #BFDBFE"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#1E40AF", textTransform: "uppercase", marginBottom: "8px" }}>
                    📆 Annual Cost Estimate
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1E40AF" }}>${results.annualCost.toLocaleString()}</p>
                      <p style={{ fontSize: "0.75rem", color: "#3B82F6" }}>{results.weeksPerYear} visits × ${results.avgCost} avg</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Monthly avg</p>
                      <p style={{ fontWeight: "600", color: "#1E40AF" }}>${Math.round(results.annualCost / 12)}/mo</p>
                    </div>
                  </div>
                </div>
              )}

              {/* DIY vs Professional */}
              {results && (
                <div style={{ 
                  backgroundColor: "#FEF3C7", 
                  borderRadius: "12px", 
                  padding: "16px",
                  border: "1px solid #FDE68A"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#92400E", textTransform: "uppercase", marginBottom: "12px" }}>
                    🏠 DIY vs Professional
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>DIY</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Year 1: ~$400-800</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Year 2+: ~$100/yr</p>
                      <p style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "4px" }}>+ 2-3 hrs/week labor</p>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Professional</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Annual: ${results.annualCost.toLocaleString()}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Per visit: ${results.avgCost}</p>
                      <p style={{ fontSize: "0.65rem", color: "#059669", marginTop: "4px" }}>No equipment needed</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              {!results && (
                <div style={{ 
                  backgroundColor: "#DCFCE7", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#166534", marginBottom: "12px" }}>
                    📊 Quick Reference (Weekly Service)
                  </p>
                  <div style={{ fontSize: "0.875rem", color: "#166534" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Small (&lt;7,000 sq ft)</span>
                      <span style={{ fontWeight: "600" }}>$25 - $50</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Medium (7-12k sq ft)</span>
                      <span style={{ fontWeight: "600" }}>$45 - $75</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Large (12-22k sq ft)</span>
                      <span style={{ fontWeight: "600" }}>$75 - $100</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>1 Acre+</span>
                      <span style={{ fontWeight: "600" }}>$150 - $250</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
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
                How Lawn Mowing Costs Are Calculated
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Professional lawn care companies use several factors to determine pricing. The most common pricing models are <strong>per square foot</strong> ($0.01-$0.06), <strong>per hour</strong> ($30-$65), or <strong>flat rate by size category</strong>.
              </p>
              
              <div style={{ backgroundColor: "#F3F4F6", padding: "16px", borderRadius: "8px", marginBottom: "16px", fontFamily: "monospace", fontSize: "0.875rem" }}>
                Total Cost = Base Price + Terrain Adj. + Grass Height Adj. + Frequency Adj. + Services
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#DCFCE7", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#166534", marginBottom: "8px" }}>📐 Lawn Size</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#15803D" }}>$0.01-$0.06/sqft</p>
                  <p style={{ fontSize: "0.75rem", color: "#22C55E" }}>Primary cost factor</p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>⛰️ Terrain</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#2563EB" }}>+0% to +40%</p>
                  <p style={{ fontSize: "0.75rem", color: "#3B82F6" }}>Slopes & obstacles</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>🌿 Grass Height</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#D97706" }}>+0% to +50%</p>
                  <p style={{ fontSize: "0.75rem", color: "#B45309" }}>Overgrown lawns</p>
                </div>
                <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "8px" }}>📅 Frequency</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#7C3AED" }}>-0% to +50%</p>
                  <p style={{ fontSize: "0.75rem", color: "#8B5CF6" }}>Weekly saves most</p>
                </div>
              </div>
            </div>

            {/* Pricing Table */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Lawn Mowing Prices by Size
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Lawn Size</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Square Feet</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Weekly</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Bi-weekly</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>One-time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "Small", sqft: "<7,000", weekly: "$25-$50", biweekly: "$29-$58", onetime: "$38-$75" },
                      { size: "Medium", sqft: "7,000-12,000", weekly: "$45-$75", biweekly: "$52-$86", onetime: "$68-$113" },
                      { size: "Large", sqft: "12,000-22,000", weekly: "$75-$100", biweekly: "$86-$115", onetime: "$113-$150" },
                      { size: "X-Large", sqft: "22,000-43,560", weekly: "$100-$150", biweekly: "$115-$173", onetime: "$150-$225" },
                      { size: "1 Acre", sqft: "43,560", weekly: "$150-$250", biweekly: "$173-$288", onetime: "$225-$375" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.size}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{row.sqft}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "500" }}>{row.weekly}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.biweekly}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.onetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "8px" }}>
                * Prices are for basic mowing only. Additional services like edging, trimming, and cleanup cost extra.
              </p>
            </div>

            {/* The 1/3 Rule */}
            <div style={{ 
              backgroundColor: "#ECFDF5", 
              borderRadius: "16px", 
              border: "1px solid #A7F3D0",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>
                🌿 The 1/3 Rule for Mowing
              </h2>
              <p style={{ color: "#047857", marginBottom: "16px", lineHeight: "1.7" }}>
                One of the most important rules in lawn care is the <strong>1/3 rule</strong>: never cut more than one-third of the grass blade height at once.
              </p>
              
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>4"</p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Current Height</p>
                  </div>
                  <div style={{ fontSize: "1.5rem", color: "#9CA3AF" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>1.3"</p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Max to Cut</p>
                  </div>
                  <div style={{ fontSize: "1.5rem", color: "#9CA3AF" }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563EB" }}>2.7"</p>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>New Height</p>
                  </div>
                </div>
              </div>
              
              <p style={{ color: "#047857", fontSize: "0.875rem" }}>
                <strong>Why it matters:</strong> Cutting too much at once stresses the grass, weakens roots, and promotes weed growth. Following the 1/3 rule keeps your lawn healthier and greener.
              </p>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
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
                💡 Tips to Save on Lawn Care
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Sign up for weekly service (up to 30% off vs one-time)",
                  "Bundle services together for package discounts",
                  "Book off-season maintenance at lower rates",
                  "Keep lawn regularly maintained to avoid surcharges",
                  "Compare quotes from 3+ providers",
                  "Ask about neighbor/referral discounts"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#22C55E", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Additional Services Pricing */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                ➕ Additional Service Costs
              </h3>
              <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                {Object.entries(additionalServices).slice(0, 5).map(([key, data]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>{data.label.split('(')[0].trim()}</span>
                    <span style={{ fontWeight: "600" }}>${data.min}-${data.max}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/lawn-mowing-cost-calculator" currentCategory="Lifestyle" />
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
