"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 材料密度数据 (tons per cubic yard)
const materials = [
  { id: "gravel", name: "Gravel", density: 1.4, range: "1.4 - 1.7", icon: "🪨" },
  { id: "sand", name: "Sand", density: 1.35, range: "1.3 - 1.5", icon: "🏖️" },
  { id: "dirt", name: "Dirt / Topsoil", density: 1.1, range: "1.0 - 1.35", icon: "🌱" },
  { id: "mulch", name: "Mulch / Bark", density: 0.4, range: "0.35 - 0.5", icon: "🍂" },
  { id: "concrete", name: "Concrete", density: 2.0, range: "2.0 - 2.4", icon: "🧱" },
  { id: "stone", name: "Crushed Stone", density: 1.5, range: "1.4 - 1.7", icon: "�ite" },
  { id: "asphalt", name: "Asphalt", density: 2.1, range: "2.0 - 2.4", icon: "🛣️" },
  { id: "limestone", name: "Limestone", density: 1.5, range: "1.4 - 1.6", icon: "ite" },
  { id: "custom", name: "Custom", density: 1.4, range: "—", icon: "⚙️" },
];

// 项目类型推荐深度 (inches)
const projectDepths = [
  { name: "Driveway", depth: 3, material: "gravel" },
  { name: "Walkway", depth: 2, material: "gravel" },
  { name: "Garden Bed", depth: 4, material: "mulch" },
  { name: "Patio Base", depth: 4, material: "sand" },
  { name: "French Drain", depth: 12, material: "gravel" },
];

// FAQ数据
const faqs = [
  {
    question: "How many yards are in a ton?",
    answer: "It depends on the material density. For gravel, 1 ton equals approximately 0.71 cubic yards. For sand, it's about 0.74 cubic yards. For lighter materials like mulch, 1 ton equals about 2.5 cubic yards. Always check with your supplier for exact conversion rates."
  },
  {
    question: "How to convert cubic yards into tons?",
    answer: "Multiply the cubic yards by the material's density (in tons per cubic yard). For example: 10 cubic yards of gravel × 1.4 tons/yd³ = 14 tons. Different materials have different densities, so always use the correct density for your specific material."
  },
  {
    question: "What is 10 yd in tons?",
    answer: "10 cubic yards converts to different tonnages depending on the material: Gravel = 14 tons, Sand = 13.5 tons, Dirt = 11 tons, Mulch = 4 tons, Concrete = 20 tons. Use our calculator above for precise conversions."
  },
  {
    question: "How many tons is 1 yard of mulch?",
    answer: "One cubic yard of mulch weighs approximately 0.4 tons (800 pounds). However, this can vary based on moisture content and mulch type. Wet mulch is heavier than dry mulch, and hardwood mulch is typically heavier than pine bark."
  },
  {
    question: "What is the weight of 1 cubic yard of gravel?",
    answer: "One cubic yard of gravel weighs approximately 1.4 tons (2,800 pounds), though this can range from 1.4 to 1.7 tons depending on the gravel type, size, and moisture content. Pea gravel and river rock tend to be on the lighter end, while dense crushed stone is heavier."
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

export default function YardsToTonsCalculator() {
  // 转换方向
  const [direction, setDirection] = useState<"yardsToTons" | "tonsToYards">("yardsToTons");
  
  // 材料选择
  const [selectedMaterial, setSelectedMaterial] = useState<string>("gravel");
  const [customDensity, setCustomDensity] = useState<string>("1.4");
  
  // 输入模式
  const [inputMode, setInputMode] = useState<"direct" | "area">("direct");
  
  // 直接输入
  const [directValue, setDirectValue] = useState<string>("");
  
  // 面积计算输入
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [depth, setDepth] = useState<string>("");
  const [lengthUnit, setLengthUnit] = useState<"feet" | "inches">("feet");
  const [depthUnit, setDepthUnit] = useState<"inches" | "feet">("inches");
  
  // 结果
  const [results, setResults] = useState<{
    inputValue: number;
    inputUnit: string;
    usTons: number;
    metricTonnes: number;
    cubicYards: number;
    formula: string;
    material: string;
    density: number;
  } | null>(null);

  // 显示密度表
  const [showDensityChart, setShowDensityChart] = useState(false);

  // 获取当前密度
  const getCurrentDensity = (): number => {
    if (selectedMaterial === "custom") {
      return parseFloat(customDensity) || 1.4;
    }
    const material = materials.find(m => m.id === selectedMaterial);
    return material?.density || 1.4;
  };

  // 计算
  const calculate = () => {
    const density = getCurrentDensity();
    let cubicYards: number;
    let inputValue: number;
    let inputUnit: string;

    if (inputMode === "direct") {
      inputValue = parseFloat(directValue) || 0;
      if (inputValue <= 0) {
        alert("Please enter a valid value greater than 0");
        return;
      }

      if (direction === "yardsToTons") {
        cubicYards = inputValue;
        inputUnit = "cubic yards";
      } else {
        // tons to yards: yards = tons / density
        cubicYards = inputValue / density;
        inputUnit = "tons";
      }
    } else {
      // Area mode
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const d = parseFloat(depth) || 0;

      if (l <= 0 || w <= 0 || d <= 0) {
        alert("Please enter valid dimensions");
        return;
      }

      // Convert to feet
      const lengthFt = lengthUnit === "inches" ? l / 12 : l;
      const widthFt = lengthUnit === "inches" ? w / 12 : w;
      const depthFt = depthUnit === "inches" ? d / 12 : d;

      // Calculate cubic feet, then convert to cubic yards
      const cubicFeet = lengthFt * widthFt * depthFt;
      cubicYards = cubicFeet / 27;
      inputValue = cubicYards;
      inputUnit = "cubic yards (calculated)";
    }

    const usTons = cubicYards * density;
    const metricTonnes = usTons * 0.907185; // 1 US ton = 0.907185 metric tonnes

    const materialName = materials.find(m => m.id === selectedMaterial)?.name || "Custom";
    
    let formula: string;
    if (direction === "yardsToTons" || inputMode === "area") {
      formula = `${cubicYards.toFixed(2)} yd³ × ${density} tons/yd³ = ${usTons.toFixed(2)} tons`;
    } else {
      formula = `${inputValue.toFixed(2)} tons ÷ ${density} tons/yd³ = ${cubicYards.toFixed(2)} yd³`;
    }

    setResults({
      inputValue,
      inputUnit,
      usTons,
      metricTonnes,
      cubicYards,
      formula,
      material: materialName,
      density
    });
  };

  // 快速选择
  const quickSelect = (value: number) => {
    setDirectValue(value.toString());
    setInputMode("direct");
  };

  // 重置
  const reset = () => {
    setDirectValue("");
    setLength("");
    setWidth("");
    setDepth("");
    setResults(null);
  };

  // 快速换算参考
  const getQuickAnswers = () => {
    const density = getCurrentDensity();
    if (direction === "yardsToTons") {
      return [
        { yards: 1, tons: (1 * density).toFixed(2) },
        { yards: 5, tons: (5 * density).toFixed(2) },
        { yards: 10, tons: (10 * density).toFixed(2) },
        { yards: 20, tons: (20 * density).toFixed(2) },
      ];
    } else {
      return [
        { tons: 1, yards: (1 / density).toFixed(2) },
        { tons: 5, yards: (5 / density).toFixed(2) },
        { tons: 10, yards: (10 / density).toFixed(2) },
        { tons: 20, yards: (20 / density).toFixed(2) },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Yards to Tons Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Yards to Tons Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Convert cubic yards to tons for gravel, sand, dirt, mulch, and other landscaping materials. Get accurate weight estimates for your construction and gardening projects.
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
                Conversion Settings
              </h2>

              {/* Conversion Direction */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Conversion Direction
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setDirection("yardsToTons")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: direction === "yardsToTons" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: direction === "yardsToTons" ? "#EFF6FF" : "white",
                      color: direction === "yardsToTons" ? "#2563EB" : "#4B5563",
                      fontWeight: direction === "yardsToTons" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Yards → Tons
                  </button>
                  <button
                    onClick={() => setDirection("tonsToYards")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: direction === "tonsToYards" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: direction === "tonsToYards" ? "#EFF6FF" : "white",
                      color: direction === "tonsToYards" ? "#2563EB" : "#4B5563",
                      fontWeight: direction === "tonsToYards" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Tons → Yards
                  </button>
                </div>
              </div>

              {/* Material Selection */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Material Type
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon} {m.name} ({m.density} tons/yd³)
                    </option>
                  ))}
                </select>
                
                {selectedMaterial === "custom" && (
                  <div style={{ marginTop: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                      Custom Density (tons/yd³)
                    </label>
                    <input
                      type="number"
                      value={customDensity}
                      onChange={(e) => setCustomDensity(e.target.value)}
                      placeholder="1.4"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "0.875rem"
                      }}
                      step="0.01"
                      min="0.1"
                    />
                  </div>
                )}
              </div>

              {/* Input Mode Toggle */}
              {direction === "yardsToTons" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Input Method
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setInputMode("direct")}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: inputMode === "direct" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "direct" ? "#EFF6FF" : "white",
                        color: inputMode === "direct" ? "#2563EB" : "#4B5563",
                        fontWeight: inputMode === "direct" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      Enter Volume
                    </button>
                    <button
                      onClick={() => setInputMode("area")}
                      style={{
                        flex: "1",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: inputMode === "area" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: inputMode === "area" ? "#EFF6FF" : "white",
                        color: inputMode === "area" ? "#2563EB" : "#4B5563",
                        fontWeight: inputMode === "area" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      Calculate from Area
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Input */}
              {(inputMode === "direct" || direction === "tonsToYards") && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                    {direction === "yardsToTons" ? "Cubic Yards" : "Tons"}
                  </label>
                  <input
                    type="number"
                    value={directValue}
                    onChange={(e) => setDirectValue(e.target.value)}
                    placeholder={direction === "yardsToTons" ? "e.g., 10" : "e.g., 14"}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    min="0"
                    step="any"
                  />
                  
                  {/* Quick Select Buttons */}
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {[1, 5, 10, 20].map((val) => (
                      <button
                        key={val}
                        onClick={() => quickSelect(val)}
                        style={{
                          flex: "1",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          backgroundColor: directValue === val.toString() ? "#EFF6FF" : "#F9FAFB",
                          color: "#4B5563",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        {val} {direction === "yardsToTons" ? "yd³" : "tons"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Area Input */}
              {inputMode === "area" && direction === "yardsToTons" && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ flex: "1" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Length
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="20"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                        min="0"
                      />
                    </div>
                    <div style={{ flex: "1" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Width
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="10"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                        min="0"
                      />
                    </div>
                    <div style={{ flex: "0 0 80px" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Unit
                      </label>
                      <select
                        value={lengthUnit}
                        onChange={(e) => setLengthUnit(e.target.value as "feet" | "inches")}
                        style={{
                          width: "100%",
                          padding: "8px 4px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="feet">ft</option>
                        <option value="inches">in</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                    <div style={{ flex: "1" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Depth
                      </label>
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        placeholder="3"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                        min="0"
                      />
                    </div>
                    <div style={{ flex: "0 0 80px" }}>
                      <select
                        value={depthUnit}
                        onChange={(e) => setDepthUnit(e.target.value as "inches" | "feet")}
                        style={{
                          width: "100%",
                          padding: "8px 4px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="inches">inches</option>
                        <option value="feet">feet</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Quick Depth Presets */}
                  <div style={{ marginTop: "8px" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Common depths:</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 6, 12].map((d) => (
                        <button
                          key={d}
                          onClick={() => { setDepth(d.toString()); setDepthUnit("inches"); }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: depth === d.toString() && depthUnit === "inches" ? "#EFF6FF" : "#F9FAFB",
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
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#2563EB",
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
                background: direction === "yardsToTons" 
                  ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" 
                  : "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", 
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: direction === "yardsToTons" ? "#2563EB" : "#059669", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  {direction === "yardsToTons" ? "Weight in Tons" : "Volume in Cubic Yards"}
                </p>
                <p style={{ 
                  fontSize: "3.5rem", 
                  fontWeight: "bold", 
                  color: direction === "yardsToTons" ? "#2563EB" : "#059669", 
                  lineHeight: "1" 
                }}>
                  {results 
                    ? (direction === "yardsToTons" 
                        ? results.usTons.toFixed(2) 
                        : results.cubicYards.toFixed(2))
                    : "—"}
                </p>
                <p style={{ 
                  color: direction === "yardsToTons" ? "#1E40AF" : "#065F46", 
                  marginTop: "8px", 
                  fontSize: "0.875rem" 
                }}>
                  {results 
                    ? (direction === "yardsToTons" 
                        ? `US Tons (${results.metricTonnes.toFixed(2)} metric tonnes)`
                        : `Cubic Yards`)
                    : "Enter values to calculate"}
                </p>
              </div>

              {/* Formula & Details */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Material</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{results.material}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Density</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{results.density} tons/yd³</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "8px" }}>
                      Formula
                    </p>
                    <div style={{ 
                      backgroundColor: "white", 
                      padding: "12px", 
                      borderRadius: "8px",
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "#374151"
                    }}>
                      {results.formula}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              <div style={{ 
                backgroundColor: "#F9FAFB", 
                borderRadius: "12px", 
                padding: "16px",
                marginBottom: "16px"
              }}>
                <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                  💡 Quick Reference ({materials.find(m => m.id === selectedMaterial)?.name})
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {getQuickAnswers().map((item, index) => (
                    <div key={index} style={{ 
                      backgroundColor: "white", 
                      padding: "8px 12px", 
                      borderRadius: "6px",
                      fontSize: "0.75rem"
                    }}>
                      {direction === "yardsToTons" ? (
                        <span><strong>{item.yards}</strong> yd³ = <strong>{item.tons}</strong> tons</span>
                      ) : (
                        <span><strong>{item.tons}</strong> tons = <strong>{item.yards}</strong> yd³</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Density Chart Toggle */}
              <button
                onClick={() => setShowDensityChart(!showDensityChart)}
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
                <span>📊 Material Density Chart</span>
                <svg
                  style={{ width: "16px", height: "16px", transform: showDensityChart ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDensityChart && (
                <div style={{ marginTop: "12px", maxHeight: "200px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6", position: "sticky", top: 0 }}>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Density</th>
                        <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Range</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.filter(m => m.id !== "custom").map((m, index) => (
                        <tr key={m.id} style={{ backgroundColor: selectedMaterial === m.id ? "#EFF6FF" : index % 2 === 0 ? "white" : "#F9FAFB" }}>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB" }}>{m.icon} {m.name}</td>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{m.density}</td>
                          <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{m.range}</td>
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
            {/* What is Yards to Tons */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is Cubic Yards to Tons Conversion?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Converting cubic yards to tons is essential for landscaping, construction, and material ordering. While cubic yards measure volume (how much space material takes up), tons measure weight. Since different materials have different densities, the same volume can weigh vastly different amounts.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                For example, 1 cubic yard of lightweight mulch weighs only about 0.4 tons, while 1 cubic yard of concrete weighs approximately 2 tons. Understanding this conversion helps you order the right amount of material and estimate delivery costs.
              </p>
            </div>

            {/* How to Convert */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Convert Cubic Yards to Tons
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The conversion formula is straightforward:
              </p>
              
              <div style={{ 
                backgroundColor: "#EFF6FF", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "16px",
                borderLeft: "4px solid #2563EB"
              }}>
                <p style={{ fontWeight: "600", color: "#1E40AF", fontFamily: "monospace", fontSize: "1rem" }}>
                  Tons = Cubic Yards × Material Density (tons/yd³)
                </p>
              </div>

              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                Example Calculation:
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Volume:</strong> 10 cubic yards of gravel
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.875rem", color: "#4B5563" }}>
                    <strong>Density:</strong> 1.4 tons per cubic yard
                  </p>
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: "#EFF6FF", borderRadius: "8px", borderLeft: "4px solid #2563EB" }}>
                  <p style={{ fontSize: "0.875rem", color: "#1E40AF" }}>
                    <strong>Result:</strong> 10 yd³ × 1.4 tons/yd³ = <strong>14 tons</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Material Density Guide */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Material Density Reference Guide
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "20px", lineHeight: "1.7" }}>
                Different materials have varying densities. Here&apos;s a comprehensive guide to help you estimate weights:
              </p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Tons/Yard³</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Lbs/Yard³</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Yards/Ton</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "🪨 Gravel", tpy: 1.4, note: "Most common" },
                      { name: "🏖️ Sand (dry)", tpy: 1.35, note: "" },
                      { name: "🏖️ Sand (wet)", tpy: 1.5, note: "" },
                      { name: "🌱 Topsoil", tpy: 1.1, note: "" },
                      { name: "🍂 Mulch", tpy: 0.4, note: "Lightest" },
                      { name: "🧱 Concrete", tpy: 2.0, note: "" },
                      { name: "🛣️ Asphalt", tpy: 2.1, note: "Heaviest" },
                      { name: "🪨 Crushed Stone", tpy: 1.5, note: "" },
                    ].map((item, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{item.name}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{item.tpy}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(item.tpy * 2000).toLocaleString()}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(1 / item.tpy).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "16px", fontStyle: "italic" }}>
                Note: Actual weights may vary based on moisture content, compaction, and material source. Always verify with your supplier.
              </p>
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
                💡 Quick Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Add 10% extra to account for settling and waste",
                  "Wet material is heavier than dry material",
                  "Always verify density with your supplier",
                  "1 US ton = 2,000 lbs = 0.907 metric tonnes"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#2563EB", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project Depth Guide */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                📏 Recommended Depths
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0", fontSize: "0.875rem", color: "#92400E" }}>
                <li style={{ marginBottom: "8px" }}>• <strong>Driveway:</strong> 3-4 inches</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Walkway:</strong> 2-3 inches</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Patio Base:</strong> 4-6 inches</li>
                <li style={{ marginBottom: "8px" }}>• <strong>Garden Mulch:</strong> 2-4 inches</li>
                <li>• <strong>French Drain:</strong> 12+ inches</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/yards-to-tons-calculator" currentCategory="Construction" />
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
