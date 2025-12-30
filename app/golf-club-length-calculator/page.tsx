"use client";

import { useState } from "react";
import Link from "next/link";

// 标准球杆长度 (Men's Steel Shaft)
const menStandardLengths = [
  { club: "Driver", length: 45.0, category: "woods" },
  { club: "3-Wood", length: 43.0, category: "woods" },
  { club: "5-Wood", length: 42.0, category: "woods" },
  { club: "7-Wood", length: 41.0, category: "woods" },
  { club: "3-Hybrid", length: 40.0, category: "hybrids" },
  { club: "4-Hybrid", length: 39.5, category: "hybrids" },
  { club: "5-Hybrid", length: 39.0, category: "hybrids" },
  { club: "3-Iron", length: 39.0, category: "irons" },
  { club: "4-Iron", length: 38.5, category: "irons" },
  { club: "5-Iron", length: 38.0, category: "irons" },
  { club: "6-Iron", length: 37.5, category: "irons" },
  { club: "7-Iron", length: 37.0, category: "irons", isReference: true },
  { club: "8-Iron", length: 36.5, category: "irons" },
  { club: "9-Iron", length: 36.0, category: "irons" },
  { club: "PW", length: 35.5, category: "wedges" },
  { club: "GW", length: 35.25, category: "wedges" },
  { club: "SW", length: 35.0, category: "wedges" },
  { club: "LW", length: 35.0, category: "wedges" },
  { club: "Putter", length: 34.0, category: "putter" },
];

// 身高调整表 (inches)
const heightAdjustmentTable = [
  { minHeight: 0, maxHeight: 60, adjustment: -1.5, label: "Under 5'0\"" },
  { minHeight: 60, maxHeight: 62, adjustment: -1.0, label: "5'0\" - 5'2\"" },
  { minHeight: 62, maxHeight: 64, adjustment: -0.5, label: "5'2\" - 5'4\"" },
  { minHeight: 64, maxHeight: 67, adjustment: -0.25, label: "5'4\" - 5'7\"" },
  { minHeight: 67, maxHeight: 73, adjustment: 0, label: "5'7\" - 6'1\"" },
  { minHeight: 73, maxHeight: 74, adjustment: 0.25, label: "6'1\" - 6'2\"" },
  { minHeight: 74, maxHeight: 76, adjustment: 0.5, label: "6'2\" - 6'4\"" },
  { minHeight: 76, maxHeight: 78, adjustment: 1.0, label: "6'4\" - 6'6\"" },
  { minHeight: 78, maxHeight: 999, adjustment: 1.5, label: "Over 6'6\"" },
];

// FAQ数据
const faqs = [
  {
    question: "How long should your golf clubs be for your height?",
    answer: "Golf club length depends on your height combined with your wrist-to-floor measurement. For example, a golfer between 5'7\" and 6'1\" typically uses standard length clubs (37\" for a 7-iron). Taller golfers need longer clubs (+0.5\" to +1.5\"), while shorter golfers need shorter clubs (-0.5\" to -1.5\"). Use our calculator above for personalized recommendations."
  },
  {
    question: "How do I measure how long my golf clubs should be?",
    answer: "To measure for proper club length: 1) Stand straight on a flat surface wearing golf shoes, 2) Let your arms hang naturally at your sides, 3) Have someone measure from the crease of your wrist (where your hand meets your arm) straight down to the floor, 4) Record this 'wrist-to-floor' measurement in inches. Combined with your height, this determines your ideal club length."
  },
  {
    question: "What is the standard length for a 7-iron?",
    answer: "The standard length for a men's 7-iron is 37 inches with a steel shaft (37.5\" with graphite). For women, the standard 7-iron is 36 inches. The 7-iron is commonly used as the reference club for fitting because it represents the middle of the iron set."
  },
  {
    question: "What is the club length rule in golf?",
    answer: "According to the USGA Rules of Golf, all clubs (except putters) must be at least 18 inches and no more than 48 inches in length. Since 2022, an optional local rule allows competitions to limit club length to 46 inches maximum. Putters have no maximum length limit but must be at least 18 inches."
  },
  {
    question: "Do I need custom length clubs or can I use standard?",
    answer: "Most golfers between 5'5\" and 6'1\" with proportional arm length can use standard clubs. However, if you're outside this range, or if your wrist-to-floor measurement differs significantly from average for your height, custom-length clubs will improve your posture, swing plane, and ball striking consistency."
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

export default function GolfClubLengthCalculator() {
  // 输入状态
  const [gender, setGender] = useState<"men" | "women" | "junior">("men");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  
  // Imperial inputs
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("10");
  const [wtfInches, setWtfInches] = useState<string>("34");
  
  // Metric inputs
  const [heightCm, setHeightCm] = useState<string>("178");
  const [wtfCm, setWtfCm] = useState<string>("86");
  
  // 结果
  const [results, setResults] = useState<{
    totalAdjustment: number;
    fitCategory: string;
    clubs: Array<{ club: string; length: number; category: string; isReference?: boolean }>;
    heightInches: number;
    wtfInches: number;
  } | null>(null);

  // 显示测量指南
  const [showMeasureGuide, setShowMeasureGuide] = useState(false);
  
  // 显示标准图表
  const [showStandardChart, setShowStandardChart] = useState(false);

  // 转换函数
  const cmToInches = (cm: number) => cm / 2.54;
  const inchesToCm = (inches: number) => inches * 2.54;

  // 计算
  const calculate = () => {
    let heightTotalInches: number;
    let wtfTotalInches: number;

    if (unitSystem === "imperial") {
      heightTotalInches = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0);
      wtfTotalInches = parseFloat(wtfInches) || 0;
    } else {
      heightTotalInches = cmToInches(parseFloat(heightCm) || 0);
      wtfTotalInches = cmToInches(parseFloat(wtfCm) || 0);
    }

    if (heightTotalInches < 48 || heightTotalInches > 84) {
      alert("Please enter a valid height (4'0\" - 7'0\" or 120-215 cm)");
      return;
    }

    if (wtfTotalInches < 25 || wtfTotalInches > 42) {
      alert("Please enter a valid wrist-to-floor measurement (25\" - 42\" or 63-107 cm)");
      return;
    }

    // 1. 根据身高获取基础调整
    let heightAdjustment = 0;
    for (const range of heightAdjustmentTable) {
      if (heightTotalInches >= range.minHeight && heightTotalInches < range.maxHeight) {
        heightAdjustment = range.adjustment;
        break;
      }
    }

    // 2. 根据WTF微调
    // 标准WTF范围大约是身高的49-51%
    const expectedWtf = heightTotalInches * 0.44; // 大约44%的身高
    const wtfDifference = wtfTotalInches - expectedWtf;
    
    let wtfAdjustment = 0;
    if (wtfDifference < -2) {
      wtfAdjustment = -0.5; // 手臂短
    } else if (wtfDifference > 2) {
      wtfAdjustment = 0.5; // 手臂长
    }

    // 3. 性别调整
    let genderAdjustment = 0;
    if (gender === "women") {
      genderAdjustment = -1.0;
    } else if (gender === "junior") {
      genderAdjustment = -2.0;
    }

    // 4. 总调整量
    const totalAdjustment = heightAdjustment + wtfAdjustment + genderAdjustment;

    // 5. 确定适合类别
    let fitCategory = "Standard";
    if (totalAdjustment <= -1) {
      fitCategory = "Short";
    } else if (totalAdjustment >= 1) {
      fitCategory = "Long";
    } else if (totalAdjustment < 0) {
      fitCategory = "Slightly Short";
    } else if (totalAdjustment > 0) {
      fitCategory = "Slightly Long";
    }

    // 6. 计算每支球杆的推荐长度
    const adjustedClubs = menStandardLengths.map(club => ({
      ...club,
      length: parseFloat((club.length + totalAdjustment).toFixed(2))
    }));

    setResults({
      totalAdjustment,
      fitCategory,
      clubs: adjustedClubs,
      heightInches: heightTotalInches,
      wtfInches: wtfTotalInches
    });
  };

  // 重置
  const reset = () => {
    setHeightFt("5");
    setHeightIn("10");
    setWtfInches("34");
    setHeightCm("178");
    setWtfCm("86");
    setResults(null);
  };

  // 格式化调整量显示
  const formatAdjustment = (adj: number) => {
    if (adj === 0) return "Standard";
    if (adj > 0) return `+${adj}"`;
    return `${adj}"`;
  };

  // 身高快速选择
  const quickHeightSelect = (ft: number, inch: number) => {
    setHeightFt(ft.toString());
    setHeightIn(inch.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Golf Club Length Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Golf Club Length Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Find the correct golf club length based on your height and wrist-to-floor measurement. Get personalized recommendations for every club in your bag.
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
                Your Measurements
              </h2>

              {/* Gender Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Gender
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { id: "men", label: "👨 Men", color: "#2563EB" },
                    { id: "women", label: "👩 Women", color: "#EC4899" },
                    { id: "junior", label: "👦 Junior", color: "#F59E0B" }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGender(g.id as "men" | "women" | "junior")}
                      style={{
                        flex: "1",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: gender === g.id ? `2px solid ${g.color}` : "1px solid #E5E7EB",
                        backgroundColor: gender === g.id ? `${g.color}10` : "white",
                        color: gender === g.id ? g.color : "#4B5563",
                        fontWeight: gender === g.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Unit System */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Unit System
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setUnitSystem("imperial")}
                    style={{
                      flex: "1",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: unitSystem === "imperial" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "imperial" ? "#ECFDF5" : "white",
                      color: unitSystem === "imperial" ? "#059669" : "#4B5563",
                      fontWeight: unitSystem === "imperial" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🇺🇸 Imperial (ft/in)
                  </button>
                  <button
                    onClick={() => setUnitSystem("metric")}
                    style={{
                      flex: "1",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: unitSystem === "metric" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "metric" ? "#ECFDF5" : "white",
                      color: unitSystem === "metric" ? "#059669" : "#4B5563",
                      fontWeight: unitSystem === "metric" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🌍 Metric (cm)
                  </button>
                </div>
              </div>

              {/* Height Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Your Height
                </label>
                {unitSystem === "imperial" ? (
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        style={{
                          width: "80px",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="4"
                        max="7"
                      />
                      <span style={{ color: "#6B7280" }}>ft</span>
                      <input
                        type="number"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        style={{
                          width: "80px",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="0"
                        max="11"
                      />
                      <span style={{ color: "#6B7280" }}>in</span>
                    </div>
                    {/* Quick Height Select */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[
                        { ft: 5, in: 6, label: "5'6\"" },
                        { ft: 5, in: 9, label: "5'9\"" },
                        { ft: 5, in: 10, label: "5'10\"" },
                        { ft: 6, in: 0, label: "6'0\"" },
                        { ft: 6, in: 2, label: "6'2\"" },
                      ].map((h) => (
                        <button
                          key={h.label}
                          onClick={() => quickHeightSelect(h.ft, h.in)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: heightFt === h.ft.toString() && heightIn === h.in.toString() ? "#ECFDF5" : "#F9FAFB",
                            color: "#4B5563",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        style={{
                          width: "120px",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="120"
                        max="215"
                      />
                      <span style={{ color: "#6B7280" }}>cm</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[165, 170, 175, 180, 185, 190].map((cm) => (
                        <button
                          key={cm}
                          onClick={() => setHeightCm(cm.toString())}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: heightCm === cm.toString() ? "#ECFDF5" : "#F9FAFB",
                            color: "#4B5563",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {cm}cm
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wrist-to-Floor Input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Wrist-to-Floor Distance
                </label>
                {unitSystem === "imperial" ? (
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={wtfInches}
                        onChange={(e) => setWtfInches(e.target.value)}
                        style={{
                          width: "120px",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="25"
                        max="42"
                        step="0.5"
                      />
                      <span style={{ color: "#6B7280" }}>inches</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "4px" }}>
                      Typical range: 29&quot; - 37&quot;
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={wtfCm}
                        onChange={(e) => setWtfCm(e.target.value)}
                        style={{
                          width: "120px",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="63"
                        max="107"
                      />
                      <span style={{ color: "#6B7280" }}>cm</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "4px" }}>
                      Typical range: 74 - 94 cm
                    </p>
                  </div>
                )}
              </div>

              {/* Measurement Guide Toggle */}
              <button
                onClick={() => setShowMeasureGuide(!showMeasureGuide)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  backgroundColor: "#FEF3C7",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#92400E",
                  marginBottom: "20px"
                }}
              >
                <span>📏</span>
                <span style={{ fontWeight: "500" }}>How to Measure Wrist-to-Floor</span>
                <svg
                  style={{ marginLeft: "auto", width: "16px", height: "16px", transform: showMeasureGuide ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMeasureGuide && (
                <div style={{ 
                  backgroundColor: "#FFFBEB", 
                  padding: "16px", 
                  borderRadius: "8px", 
                  marginBottom: "20px",
                  fontSize: "0.875rem",
                  color: "#92400E"
                }}>
                  <ol style={{ margin: "0", paddingLeft: "20px" }}>
                    <li style={{ marginBottom: "8px" }}>Stand straight on a flat surface wearing golf shoes</li>
                    <li style={{ marginBottom: "8px" }}>Let your arms hang naturally at your sides</li>
                    <li style={{ marginBottom: "8px" }}>Have someone measure from the crease of your wrist (where your hand meets your arm) straight down to the floor</li>
                    <li>Record the measurement in inches or centimeters</li>
                  </ol>
                </div>
              )}

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
                  Calculate Club Length
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
                background: results 
                  ? results.totalAdjustment === 0 
                    ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
                    : results.totalAdjustment > 0
                      ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                      : "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: results ? (results.totalAdjustment === 0 ? "#059669" : results.totalAdjustment > 0 ? "#2563EB" : "#D97706") : "#6B7280",
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  Recommended Adjustment
                </p>
                <p style={{ 
                  fontSize: "3rem", 
                  fontWeight: "bold", 
                  color: results ? (results.totalAdjustment === 0 ? "#059669" : results.totalAdjustment > 0 ? "#2563EB" : "#D97706") : "#9CA3AF",
                  lineHeight: "1" 
                }}>
                  {results ? formatAdjustment(results.totalAdjustment) : "—"}
                </p>
                <p style={{ 
                  color: results ? (results.totalAdjustment === 0 ? "#065F46" : results.totalAdjustment > 0 ? "#1E40AF" : "#92400E") : "#6B7280",
                  marginTop: "8px", 
                  fontSize: "0.875rem",
                  fontWeight: "500"
                }}>
                  {results ? results.fitCategory : "Enter measurements to calculate"}
                </p>
              </div>

              {/* Club Length List */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  maxHeight: "360px",
                  overflowY: "auto"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    🏌️ Your Recommended Club Lengths
                  </p>
                  
                  {/* Woods */}
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "0.625rem", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px" }}>Woods</p>
                    {results.clubs.filter(c => c.category === "woods").map((club, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "0.875rem"
                      }}>
                        <span style={{ color: "#374151" }}>{club.club}</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>{club.length.toFixed(1)}&quot;</span>
                      </div>
                    ))}
                  </div>

                  {/* Hybrids */}
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "0.625rem", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px" }}>Hybrids</p>
                    {results.clubs.filter(c => c.category === "hybrids").map((club, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "0.875rem"
                      }}>
                        <span style={{ color: "#374151" }}>{club.club}</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>{club.length.toFixed(1)}&quot;</span>
                      </div>
                    ))}
                  </div>

                  {/* Irons */}
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "0.625rem", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px" }}>Irons</p>
                    {results.clubs.filter(c => c.category === "irons").map((club, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: club.isReference ? "#ECFDF5" : "white",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "0.875rem",
                        border: club.isReference ? "1px solid #059669" : "none"
                      }}>
                        <span style={{ color: "#374151" }}>
                          {club.club}
                          {club.isReference && <span style={{ fontSize: "0.625rem", color: "#059669", marginLeft: "6px" }}>★ Reference</span>}
                        </span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>{club.length.toFixed(1)}&quot;</span>
                      </div>
                    ))}
                  </div>

                  {/* Wedges */}
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "0.625rem", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px" }}>Wedges</p>
                    {results.clubs.filter(c => c.category === "wedges").map((club, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        marginBottom: "4px",
                        fontSize: "0.875rem"
                      }}>
                        <span style={{ color: "#374151" }}>{club.club}</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>{club.length.toFixed(1)}&quot;</span>
                      </div>
                    ))}
                  </div>

                  {/* Putter */}
                  <div>
                    <p style={{ fontSize: "0.625rem", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "6px" }}>Putter</p>
                    {results.clubs.filter(c => c.category === "putter").map((club, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "6px 10px",
                        backgroundColor: "white",
                        borderRadius: "6px",
                        fontSize: "0.875rem"
                      }}>
                        <span style={{ color: "#374151" }}>{club.club}</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>{club.length.toFixed(1)}&quot;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Your Measurements Summary */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F3F4F6", 
                  borderRadius: "8px", 
                  padding: "12px 16px",
                  marginBottom: "16px",
                  fontSize: "0.875rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280" }}>Your Height</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {Math.floor(results.heightInches / 12)}&apos;{Math.round(results.heightInches % 12)}&quot; ({Math.round(inchesToCm(results.heightInches))} cm)
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6B7280" }}>Wrist-to-Floor</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>
                      {results.wtfInches}&quot; ({Math.round(inchesToCm(results.wtfInches))} cm)
                    </span>
                  </div>
                </div>
              )}

              {/* Standard Chart Toggle */}
              <button
                onClick={() => setShowStandardChart(!showStandardChart)}
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
                <span>📊 Standard Length Chart (Men&apos;s)</span>
                <svg
                  style={{ width: "16px", height: "16px", transform: showStandardChart ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showStandardChart && (
                <div style={{ marginTop: "12px", maxHeight: "200px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6", position: "sticky", top: 0 }}>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Club</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Standard</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Women&apos;s</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menStandardLengths.slice(0, 12).map((club, index) => (
                        <tr key={index} style={{ backgroundColor: club.isReference ? "#ECFDF5" : index % 2 === 0 ? "white" : "#F9FAFB" }}>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB" }}>{club.club}</td>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: club.isReference ? "600" : "400" }}>{club.length}&quot;</td>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(club.length - 1).toFixed(1)}&quot;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Why Club Length Matters */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Why Golf Club Length Matters
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Playing with the correct club length is essential for proper posture, consistent ball striking, and preventing injury. Clubs that are too long force you to stand too upright, leading to toe strikes and slices. Clubs that are too short cause excessive bending, heel strikes, and back strain.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                The right length ensures you can address the ball with your eyes over the ball, arms hanging naturally, and proper spine angle. This promotes a repeatable swing and better accuracy on every shot.
              </p>
            </div>

            {/* How to Measure */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Measure for Club Length
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#065F46", marginBottom: "8px" }}>1. Height</p>
                  <p style={{ fontSize: "0.875rem", color: "#047857" }}>
                    Stand barefoot against a wall and measure from floor to top of head
                  </p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>2. Wrist-to-Floor</p>
                  <p style={{ fontSize: "0.875rem", color: "#2563EB" }}>
                    Wear golf shoes, arms relaxed at sides, measure from wrist crease to floor
                  </p>
                </div>
              </div>

              <div style={{ 
                backgroundColor: "#FEF3C7", 
                padding: "16px", 
                borderRadius: "12px",
                borderLeft: "4px solid #F59E0B"
              }}>
                <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>💡 Pro Tip</p>
                <p style={{ fontSize: "0.875rem", color: "#92400E" }}>
                  Wrist-to-floor is more accurate than height alone because two golfers of the same height can have different arm lengths. Always use both measurements for the best fit.
                </p>
              </div>
            </div>

            {/* Height Adjustment Chart */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Golf Club Length by Height Chart
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Height</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Adjustment</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>7-Iron Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { height: "Under 5'0\" (152cm)", adj: "-1.5\"", iron: "35.5\"" },
                      { height: "5'0\" - 5'2\" (152-157cm)", adj: "-1.0\"", iron: "36.0\"" },
                      { height: "5'2\" - 5'4\" (157-163cm)", adj: "-0.5\"", iron: "36.5\"" },
                      { height: "5'4\" - 5'7\" (163-170cm)", adj: "-0.25\"", iron: "36.75\"" },
                      { height: "5'7\" - 6'1\" (170-185cm)", adj: "Standard", iron: "37.0\"", highlight: true },
                      { height: "6'1\" - 6'2\" (185-188cm)", adj: "+0.25\"", iron: "37.25\"" },
                      { height: "6'2\" - 6'4\" (188-193cm)", adj: "+0.5\"", iron: "37.5\"" },
                      { height: "6'4\" - 6'6\" (193-198cm)", adj: "+1.0\"", iron: "38.0\"" },
                      { height: "Over 6'6\" (198cm+)", adj: "+1.5\"", iron: "38.5\"" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: row.highlight ? "#ECFDF5" : index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>{row.height}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: row.highlight ? "600" : "400", color: row.highlight ? "#059669" : "#374151" }}>{row.adj}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.iron}</td>
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
                ⛳ Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Most golfers 5'7\"-6'1\" use standard length",
                  "Women's clubs are typically 1\" shorter",
                  "Junior clubs are 2\"+ shorter than men's",
                  "Driver is always the longest club",
                  "7-iron is the standard reference club"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#059669", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Standard Lengths Quick Ref */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                📏 Standard Lengths (Men&apos;s)
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#92400E" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>Driver:</strong> 45&quot;</li>
                <li style={{ marginBottom: "8px" }}>• <strong>3-Wood:</strong> 43&quot;</li>
                <li style={{ marginBottom: "8px" }}>• <strong>5-Iron:</strong> 38&quot;</li>
                <li style={{ marginBottom: "8px" }}>• <strong>7-Iron:</strong> 37&quot; ★</li>
                <li style={{ marginBottom: "8px" }}>• <strong>9-Iron:</strong> 36&quot;</li>
                <li>• <strong>Putter:</strong> 34&quot;</li>
              </ul>
            </div>

            {/* Related Tools */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Related Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/bowling-handicap-calculator", name: "Bowling Handicap Calculator", desc: "Calculate bowling handicap", icon: "🎳" },
                  { href: "/yards-to-tons-calculator", name: "Yards to Tons Calculator", desc: "Convert volume to weight", icon: "🪨" },
                  { href: "/productivity-calculator", name: "Productivity Calculator", desc: "Measure work efficiency", icon: "📊" }
                ].map((tool, index) => (
                  <Link 
                    key={index}
                    href={tool.href} 
                    style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px", 
                      borderRadius: "12px", 
                      border: "1px solid #E5E7EB",
                      textDecoration: "none"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
                    <div>
                      <p style={{ fontWeight: "500", color: "#111827", marginBottom: "2px" }}>{tool.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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