"use client";

import React, { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

// 区域类型定义
type AreaType = "driveway" | "house" | "deck" | "patio" | "fence" | "roof" | "gutters" | "sidewalk";
type PropertyType = "residential" | "commercial";
type DirtLevel = "light" | "moderate" | "heavy";
type SurfaceMaterial = string;

interface CleaningArea {
  id: string;
  type: AreaType;
  size: string;
  material: SurfaceMaterial;
  dirtLevel: DirtLevel;
  stories: number; // 仅用于 house
}

// 定价数据 (per sq ft or linear ft)
const basePricing: Record<AreaType, { low: number; high: number; unit: string }> = {
  driveway: { low: 0.20, high: 0.40, unit: "sq ft" },
  house: { low: 0.15, high: 0.50, unit: "sq ft" },
  deck: { low: 0.30, high: 0.80, unit: "sq ft" },
  patio: { low: 0.25, high: 0.60, unit: "sq ft" },
  fence: { low: 0.15, high: 0.40, unit: "linear ft" },
  roof: { low: 0.50, high: 1.00, unit: "sq ft" },
  gutters: { low: 0.50, high: 1.50, unit: "linear ft" },
  sidewalk: { low: 0.20, high: 0.40, unit: "sq ft" },
};

// 表面材质选项
const materialOptions: Record<AreaType, { value: string; label: string; multiplier: number }[]> = {
  driveway: [
    { value: "concrete", label: "Concrete", multiplier: 1.0 },
    { value: "asphalt", label: "Asphalt", multiplier: 1.1 },
    { value: "pavers", label: "Brick/Pavers", multiplier: 1.3 },
    { value: "gravel", label: "Gravel", multiplier: 1.4 },
  ],
  house: [
    { value: "vinyl", label: "Vinyl Siding", multiplier: 1.0 },
    { value: "wood", label: "Wood Siding", multiplier: 1.2 },
    { value: "brick", label: "Brick", multiplier: 1.1 },
    { value: "stucco", label: "Stucco", multiplier: 1.3 },
    { value: "aluminum", label: "Aluminum", multiplier: 1.0 },
  ],
  deck: [
    { value: "wood", label: "Wood", multiplier: 1.0 },
    { value: "composite", label: "Composite", multiplier: 1.2 },
    { value: "pvc", label: "PVC/Vinyl", multiplier: 1.1 },
  ],
  patio: [
    { value: "concrete", label: "Concrete", multiplier: 1.0 },
    { value: "pavers", label: "Pavers", multiplier: 1.2 },
    { value: "flagstone", label: "Flagstone", multiplier: 1.3 },
    { value: "brick", label: "Brick", multiplier: 1.15 },
  ],
  fence: [
    { value: "wood", label: "Wood", multiplier: 1.0 },
    { value: "vinyl", label: "Vinyl/PVC", multiplier: 0.9 },
    { value: "metal", label: "Metal", multiplier: 0.85 },
  ],
  roof: [
    { value: "asphalt", label: "Asphalt Shingles", multiplier: 1.0 },
    { value: "tile", label: "Tile", multiplier: 1.3 },
    { value: "metal", label: "Metal", multiplier: 0.9 },
    { value: "slate", label: "Slate", multiplier: 1.4 },
  ],
  gutters: [
    { value: "aluminum", label: "Aluminum", multiplier: 1.0 },
    { value: "vinyl", label: "Vinyl", multiplier: 0.9 },
    { value: "steel", label: "Steel", multiplier: 1.1 },
  ],
  sidewalk: [
    { value: "concrete", label: "Concrete", multiplier: 1.0 },
    { value: "pavers", label: "Pavers", multiplier: 1.2 },
  ],
};

// 脏污程度乘数
const dirtMultipliers: Record<DirtLevel, number> = {
  light: 1.0,
  moderate: 1.25,
  heavy: 1.5,
};

// 楼层乘数
const storyMultipliers: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.0,
};

// 区域显示名称
const areaLabels: Record<AreaType, string> = {
  driveway: "Driveway",
  house: "House Exterior",
  deck: "Deck",
  patio: "Patio",
  fence: "Fence",
  roof: "Roof",
  gutters: "Gutters",
  sidewalk: "Sidewalk",
};

// 典型面积预设
const typicalSizes: Record<AreaType, number> = {
  driveway: 600,
  house: 2000,
  deck: 300,
  patio: 250,
  fence: 150,
  roof: 1500,
  gutters: 150,
  sidewalk: 200,
};

// 清洗速度 (sq ft per hour)
const cleaningSpeed: Record<AreaType, number> = {
  driveway: 400,
  house: 300,
  deck: 200,
  patio: 350,
  fence: 100,
  roof: 200,
  gutters: 50,
  sidewalk: 400,
};

export default function PressureWashingCalculatorPage() {
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [areas, setAreas] = useState<CleaningArea[]>([
    {
      id: "1",
      type: "driveway",
      size: "",
      material: "concrete",
      dirtLevel: "moderate",
      stories: 1,
    },
  ]);
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<{
    areaResults: {
      id: string;
      type: AreaType;
      size: number;
      lowCost: number;
      highCost: number;
      avgCostPerUnit: number;
      hours: number;
    }[];
    totalLow: number;
    totalHigh: number;
    discount: number;
    finalLow: number;
    finalHigh: number;
    totalHours: number;
    avgCostPerSqFt: number;
    diyRentalCost: number;
  } | null>(null);

  // Quick estimate 预设
  const quickEstimates = [
    { label: "1,500 sq ft House", type: "house" as AreaType, size: 1500 },
    { label: "2,000 sq ft House", type: "house" as AreaType, size: 2000 },
    { label: "2,500 sq ft House", type: "house" as AreaType, size: 2500 },
    { label: "Standard Driveway", type: "driveway" as AreaType, size: 600 },
  ];

  const addArea = () => {
    const newArea: CleaningArea = {
      id: Date.now().toString(),
      type: "driveway",
      size: "",
      material: "concrete",
      dirtLevel: "moderate",
      stories: 1,
    };
    setAreas([...areas, newArea]);
  };

  const removeArea = (id: string) => {
    if (areas.length > 1) {
      setAreas(areas.filter((a) => a.id !== id));
    }
  };

  const updateArea = (id: string, field: keyof CleaningArea, value: string | number) => {
    setAreas(
      areas.map((area) => {
        if (area.id === id) {
          const updated = { ...area, [field]: value };
          // 当类型改变时，重置材质
          if (field === "type") {
            const newType = value as AreaType;
            updated.material = materialOptions[newType][0].value;
          }
          return updated;
        }
        return area;
      })
    );
  };

  const applyQuickEstimate = (type: AreaType, size: number) => {
    setAreas([
      {
        id: "1",
        type,
        size: size.toString(),
        material: materialOptions[type][0].value,
        dirtLevel: "moderate",
        stories: type === "house" ? 2 : 1,
      },
    ]);
  };

  const calculateEstimate = () => {
    const areaResults = areas
      .filter((area) => area.size && parseFloat(area.size) > 0)
      .map((area) => {
        const size = parseFloat(area.size);
        const base = basePricing[area.type];
        const materialMult =
          materialOptions[area.type].find((m) => m.value === area.material)?.multiplier || 1.0;
        const dirtMult = dirtMultipliers[area.dirtLevel];
        const storyMult = area.type === "house" ? storyMultipliers[area.stories] || 1.0 : 1.0;
        const commercialMult = propertyType === "commercial" ? 1.3 : 1.0;

        const lowCost = size * base.low * materialMult * dirtMult * storyMult * commercialMult;
        const highCost = size * base.high * materialMult * dirtMult * storyMult * commercialMult;
        const avgCostPerUnit = ((base.low + base.high) / 2) * materialMult * dirtMult * storyMult * commercialMult;
        const hours = size / cleaningSpeed[area.type];

        return {
          id: area.id,
          type: area.type,
          size,
          lowCost,
          highCost,
          avgCostPerUnit,
          hours,
        };
      });

    if (areaResults.length === 0) {
      return;
    }

    const totalLow = areaResults.reduce((sum, r) => sum + r.lowCost, 0);
    const totalHigh = areaResults.reduce((sum, r) => sum + r.highCost, 0);
    const totalHours = areaResults.reduce((sum, r) => sum + r.hours, 0);
    const totalSize = areaResults.reduce((sum, r) => sum + r.size, 0);

    // 多区域折扣
    const discount = areaResults.length >= 2 ? 0.1 : 0;
    const finalLow = totalLow * (1 - discount);
    const finalHigh = totalHigh * (1 - discount);

    // 平均每平方英尺成本
    const avgCostPerSqFt = (finalLow + finalHigh) / 2 / totalSize;

    // DIY 租赁成本估算
    const diyRentalCost = 50 + totalHours * 5; // 基础租金 + 额外时间

    setResults({
      areaResults,
      totalLow,
      totalHigh,
      discount,
      finalLow,
      finalHigh,
      totalHours,
      avgCostPerSqFt,
      diyRentalCost,
    });
    setCalculated(true);
  };

  const reset = () => {
    setAreas([
      {
        id: "1",
        type: "driveway",
        size: "",
        material: "concrete",
        dirtLevel: "moderate",
        stories: 1,
      },
    ]);
    setPropertyType("residential");
    setCalculated(false);
    setResults(null);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0891B2 0%, #06B6D4 50%, #22D3EE 100%)",
          padding: "60px 20px",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <nav style={{ marginBottom: "24px" }}>
            <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.875rem" }}>
              Home
            </a>
            <span style={{ color: "rgba(255,255,255,0.6)", margin: "0 8px" }}>/</span>
            <span style={{ color: "white", fontSize: "0.875rem" }}>Pressure Washing Calculator</span>
          </nav>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", marginBottom: "16px" }}>
            Pressure Washing Estimate Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.9)", maxWidth: "600px", margin: "0 auto" }}>
            Get instant cost estimates for pressure washing your driveway, house, deck, and more. See prices per square foot and compare DIY vs professional costs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Calculator Section */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "60px" }}>
          {/* Left: Input */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "24px" }}>
              Enter Your Project Details
            </h2>

            {/* Property Type Toggle */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                Property Type
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["residential", "commercial"] as PropertyType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      borderRadius: "8px",
                      border: "2px solid",
                      borderColor: propertyType === type ? "#0891B2" : "#E5E7EB",
                      backgroundColor: propertyType === type ? "#ECFEFF" : "white",
                      color: propertyType === type ? "#0891B2" : "#6B7280",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      textTransform: "capitalize",
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Estimates */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                Quick Estimates
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {quickEstimates.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => applyQuickEstimate(q.type, q.size)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid #D1D5DB",
                      backgroundColor: "#F9FAFB",
                      color: "#374151",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#E5E7EB";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#F9FAFB";
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "12px" }}>
                Areas to Clean
              </label>

              {areas.map((area, index) => (
                <div
                  key={area.id}
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#0891B2" }}>
                      Area {index + 1}
                    </span>
                    {areas.length > 1 && (
                      <button
                        onClick={() => removeArea(area.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    {/* Area Type */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Type
                      </label>
                      <select
                        value={area.type}
                        onChange={(e) => updateArea(area.id, "type", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                        }}
                      >
                        {Object.entries(areaLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Size ({basePricing[area.type].unit})
                      </label>
                      <input
                        type="number"
                        value={area.size}
                        onChange={(e) => updateArea(area.id, "size", e.target.value)}
                        placeholder={`e.g., ${typicalSizes[area.type]}`}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                        }}
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Surface Material
                      </label>
                      <select
                        value={area.material}
                        onChange={(e) => updateArea(area.id, "material", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                        }}
                      >
                        {materialOptions[area.type].map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Dirt Level */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                        Dirt Level
                      </label>
                      <select
                        value={area.dirtLevel}
                        onChange={(e) => updateArea(area.id, "dirtLevel", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.875rem",
                        }}
                      >
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>

                    {/* Stories (only for house) */}
                    {area.type === "house" && (
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Number of Stories
                        </label>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {[1, 2, 3].map((num) => (
                            <button
                              key={num}
                              onClick={() => updateArea(area.id, "stories", num)}
                              style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "6px",
                                border: "1px solid",
                                borderColor: area.stories === num ? "#0891B2" : "#D1D5DB",
                                backgroundColor: area.stories === num ? "#ECFEFF" : "white",
                                color: area.stories === num ? "#0891B2" : "#6B7280",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                              }}
                            >
                              {num} Story
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addArea}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px dashed #D1D5DB",
                  backgroundColor: "transparent",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#0891B2";
                  e.currentTarget.style.color = "#0891B2";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#D1D5DB";
                  e.currentTarget.style.color = "#6B7280";
                }}
              >
                + Add Another Area
              </button>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={calculateEstimate}
                style={{
                  flex: 2,
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#0891B2",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "1rem",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0E7490")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0891B2")}
              >
                Calculate Estimate
              </button>
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "white",
                  color: "#374151",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Right: Results */}
          <div
            className="calc-results"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827", marginBottom: "24px" }}>
              Your Estimate
            </h2>

            {!calculated || !results ? (
              <div
                style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: "12px",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>💧</div>
                <p style={{ color: "#6B7280" }}>
                  Enter your project details and click "Calculate Estimate" to see pricing.
                </p>
              </div>
            ) : (
              <div>
                {/* Main Cost Display */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    color: "white",
                  }}
                >
                  <p style={{ fontSize: "0.875rem", opacity: 0.9, marginBottom: "4px" }}>
                    ESTIMATED COST
                  </p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "8px" }}>
                    ${results.finalLow.toFixed(0)} - ${results.finalHigh.toFixed(0)}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.875rem",
                    }}
                  >
                    ${results.avgCostPerSqFt.toFixed(2)}/sq ft average
                  </div>
                </div>

                {/* Breakdown by Area */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    Cost Breakdown by Area
                  </p>
                  {results.areaResults.map((ar) => (
                    <div
                      key={ar.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "500", color: "#111827" }}>{areaLabels[ar.type]}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                          {ar.size.toLocaleString()} {basePricing[ar.type].unit} • ${ar.avgCostPerUnit.toFixed(2)}/{basePricing[ar.type].unit}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "600", color: "#0891B2" }}>
                          ${ar.lowCost.toFixed(0)} - ${ar.highCost.toFixed(0)}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                          ~{ar.hours.toFixed(1)} hours
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle Discount */}
                {results.discount > 0 && (
                  <div
                    style={{
                      backgroundColor: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "1.25rem" }}>🎉</span>
                    <div>
                      <div style={{ fontWeight: "600", color: "#059669" }}>
                        Bundle Discount Applied: {(results.discount * 100).toFixed(0)}% off
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                        You save ${((results.totalHigh - results.finalHigh + results.totalLow - results.finalLow) / 2).toFixed(0)} by combining multiple areas
                      </div>
                    </div>
                  </div>
                )}

                {/* Time Estimate */}
                <div
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#6B7280" }}>Estimated Time</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>
                      {results.totalHours.toFixed(1)} - {(results.totalHours * 1.5).toFixed(1)} hours
                    </span>
                  </div>
                </div>

                {/* DIY vs Pro Comparison */}
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    DIY vs Professional
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div
                      style={{
                        backgroundColor: "#FEF3C7",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>DIY (Rental)</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ${results.diyRentalCost.toFixed(0)} - ${(results.diyRentalCost * 1.5).toFixed(0)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#92400E", marginTop: "4px" }}>
                        + your time
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#ECFEFF",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                        border: "2px solid #06B6D4",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#0E7490", marginBottom: "4px" }}>Professional</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0891B2" }}>
                        ${results.finalLow.toFixed(0)} - ${results.finalHigh.toFixed(0)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#0E7490", marginTop: "4px" }}>
                        fully done for you
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div
                  style={{
                    backgroundColor: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: "8px",
                    padding: "16px",
                  }}
                >
                  <p style={{ fontWeight: "600", color: "#0369A1", marginBottom: "8px" }}>💡 Money-Saving Tips</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#0369A1", fontSize: "0.875rem" }}>
                    <li>Bundle multiple services for 10-15% discount</li>
                    <li>Schedule during off-peak seasons (winter/early spring)</li>
                    <li>Get at least 3 quotes from local contractors</li>
                    <li>Maintain regularly to reduce heavy cleaning costs</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px", marginBottom: "60px" }}>
          {/* Main Content */}
          <div>
            {/* What is Pressure Washing */}
            <section style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How Much Does Pressure Washing Cost?
              </h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                Pressure washing costs typically range from <strong>$0.10 to $0.50 per square foot</strong> for residential properties, with the national average being around $0.35 per square foot. The total cost depends on several factors including the surface type, size of the area, level of dirt buildup, and your location.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                For a typical 2,000 square foot house exterior, homeowners can expect to pay between <strong>$200 and $600</strong>. Driveways usually cost <strong>$100 to $250</strong>, while decks and patios range from <strong>$100 to $300</strong>. Commercial pressure washing prices are generally 20-50% higher due to larger areas and stricter cleaning requirements.
              </p>
            </section>

            {/* Pricing Table */}
            <section style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                2025 Pressure Washing Prices by Surface
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #E5E7EB" }}>
                        Surface Type
                      </th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #E5E7EB" }}>
                        Cost Per Sq Ft
                      </th>
                      <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #E5E7EB" }}>
                        Typical Total Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { surface: "Driveway", perSqFt: "$0.20 - $0.40", total: "$100 - $250" },
                      { surface: "House Exterior", perSqFt: "$0.15 - $0.50", total: "$200 - $600" },
                      { surface: "Deck", perSqFt: "$0.30 - $0.80", total: "$100 - $300" },
                      { surface: "Patio", perSqFt: "$0.25 - $0.60", total: "$75 - $200" },
                      { surface: "Fence (per linear ft)", perSqFt: "$0.15 - $0.40", total: "$150 - $300" },
                      { surface: "Roof", perSqFt: "$0.50 - $1.00", total: "$300 - $700" },
                      { surface: "Gutters (per linear ft)", perSqFt: "$0.50 - $1.50", total: "$50 - $200" },
                    ].map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>
                          {row.surface}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB", color: "#0891B2", fontWeight: "600" }}>
                          {row.perSqFt}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Factors Affecting Cost */}
            <section style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Factors That Affect Pressure Washing Cost
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { title: "Surface Material", desc: "Wood and delicate surfaces require lower pressure and more time, increasing costs by 10-30%." },
                  { title: "Dirt Level", desc: "Heavy staining, mold, or mildew can add 25-50% to the base price due to extra time and chemicals." },
                  { title: "Number of Stories", desc: "Multi-story homes cost 50-100% more due to ladder work and safety requirements." },
                  { title: "Location", desc: "Urban areas and high cost-of-living regions typically have higher labor rates." },
                ].map((factor, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                      {factor.title}
                    </h3>
                    <p style={{ color: "#6B7280", fontSize: "0.875rem", lineHeight: "1.6", margin: 0 }}>
                      {factor.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div
              style={{
                backgroundColor: "#F0FDFA",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                border: "1px solid #CCFBF1",
              }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#0F766E", marginBottom: "16px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#115E59", fontSize: "0.875rem", lineHeight: "1.8" }}>
                <li>Get at least 3 quotes before hiring</li>
                <li>Ask about insurance and licensing</li>
                <li>Bundle services for discounts</li>
                <li>Schedule during off-peak seasons</li>
                <li>Ask about soft washing for delicate surfaces</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/pressure-washing-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "grid", gap: "16px" }}>
            {[
              {
                q: "How much does it cost to pressure wash a 2,000 sq ft house?",
                a: "For a typical 2,000 square foot house, expect to pay between $200 and $600 for professional pressure washing. One-story homes are on the lower end, while two-story homes with difficult-to-reach areas can cost more. The price also varies based on siding material and level of dirt buildup.",
              },
              {
                q: "What is the average pressure washing cost per square foot?",
                a: "The average pressure washing cost ranges from $0.10 to $0.50 per square foot for residential properties. Commercial pressure washing typically costs $0.15 to $1.00 per square foot. Flat surfaces like driveways are usually cheaper per square foot than vertical surfaces like house siding.",
              },
              {
                q: "How much should I charge per hour for pressure washing?",
                a: "Professional pressure washers typically charge $50 to $150 per hour, with the average being around $80-100 per hour. This rate should cover equipment costs, insurance, fuel, and labor. Many contractors prefer quoting per square foot rather than hourly to provide more accurate estimates.",
              },
              {
                q: "Is it cheaper to DIY pressure washing?",
                a: "DIY pressure washing can save money on labor, but you'll need to rent equipment ($40-100/day) and purchase cleaning solutions. For small jobs like a driveway, DIY might cost $50-100. However, professionals work faster, have better equipment, and won't risk damaging your surfaces. For large or complex jobs, hiring a pro is often worth it.",
              },
              {
                q: "How much does commercial pressure washing cost?",
                a: "Commercial pressure washing typically costs $0.15 to $1.00 per square foot, which is 20-50% higher than residential rates. Large commercial projects like parking lots may get volume discounts. Factors include building height, surface type, and any special requirements like after-hours work.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                  {faq.q}
                </h3>
                <p style={{ color: "#6B7280", lineHeight: "1.7", margin: 0, fontSize: "0.9375rem" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
