"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Dirt/material types with density (tons per cubic yard)
const materialTypes = [
  { id: 'fill', name: 'Fill Dirt', density: 1.2, description: 'Common fill for grading' },
  { id: 'topsoil', name: 'Topsoil', density: 1.1, description: 'Garden and lawn soil' },
  { id: 'sand', name: 'Sand', density: 1.35, description: 'Construction sand' },
  { id: 'gravel', name: 'Gravel', density: 1.4, description: 'Crushed stone/gravel' },
  { id: 'clay', name: 'Clay Soil', density: 1.25, description: 'Heavy clay dirt' },
  { id: 'loam', name: 'Loam', density: 1.0, description: 'Mixed soil, lighter' },
];

// Dump truck sizes
const truckSizes = [
  { name: 'Small Pickup', capacity: 1, description: 'Pickup truck bed' },
  { name: 'Small Dump Truck', capacity: 6, description: '6-wheel truck' },
  { name: 'Standard Dump Truck', capacity: 10, description: 'Most common' },
  { name: 'Large Dump Truck', capacity: 14, description: 'Full-size' },
  { name: 'Super Dump', capacity: 18, description: 'Extra capacity' },
];

// Coverage reference (1 cubic yard at different depths)
const coverageReference = [
  { depth: '1 inch', sqft: 324 },
  { depth: '2 inches', sqft: 162 },
  { depth: '3 inches', sqft: 108 },
  { depth: '4 inches', sqft: 81 },
  { depth: '6 inches', sqft: 54 },
  { depth: '12 inches (1 ft)', sqft: 27 },
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate dirt yardage?",
    answer: "To calculate dirt yardage: 1) Measure your area's length and width in feet. 2) Determine the depth you need in inches. 3) Convert depth to feet by dividing by 12. 4) Multiply length × width × depth to get cubic feet. 5) Divide by 27 to get cubic yards. For example: 20ft × 10ft × 6in = 20 × 10 × 0.5 = 100 cubic feet ÷ 27 = 3.7 cubic yards."
  },
  {
    question: "How much will 1 yard of dirt cover?",
    answer: "One cubic yard of dirt covers different areas depending on depth: at 1 inch deep it covers 324 sq ft, at 2 inches it covers 162 sq ft, at 3 inches it covers 108 sq ft, at 4 inches it covers 81 sq ft, and at 6 inches it covers 54 sq ft. The formula is: Coverage (sq ft) = 324 ÷ depth (inches)."
  },
  {
    question: "How many yards is 20 tons of dirt?",
    answer: "The conversion depends on the type of dirt. Fill dirt weighs about 1.2 tons per cubic yard, so 20 tons ÷ 1.2 = approximately 16.7 cubic yards. Topsoil is lighter at 1.1 tons per yard, so 20 tons = about 18.2 cubic yards. Sand and gravel are heavier, so 20 tons = fewer cubic yards."
  },
  {
    question: "How many yards of dirt fit in a dump truck?",
    answer: "Dump truck capacity varies: a small dump truck holds about 6 cubic yards, a standard dump truck holds 10-12 cubic yards, and a large dump truck can hold 14-18 cubic yards. A regular pickup truck bed only holds about 1-2 cubic yards. Always confirm with your delivery company."
  },
  {
    question: "What's the difference between fill dirt and topsoil?",
    answer: "Fill dirt is subsoil without organic matter, used for grading, filling holes, and creating foundations. It's cheaper but doesn't support plant growth well. Topsoil is the nutrient-rich top layer of soil, ideal for gardens, lawns, and landscaping. Topsoil costs more but is necessary where you want plants to grow."
  },
  {
    question: "How much does a cubic yard of dirt weigh?",
    answer: "Weight varies by material: Fill dirt weighs about 2,400 lbs (1.2 tons) per cubic yard. Topsoil weighs about 2,200 lbs (1.1 tons). Sand weighs about 2,700 lbs (1.35 tons). Gravel weighs about 2,800 lbs (1.4 tons). Wet materials can weigh significantly more."
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

export default function DirtCalculator() {
  const [activeTab, setActiveTab] = useState<'calculate' | 'coverage' | 'convert'>('calculate');

  // Tab 1: Calculate Cubic Yards state
  const [shape, setShape] = useState<'rectangle' | 'circle' | 'triangle'>('rectangle');
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('10');
  const [depth, setDepth] = useState('6');
  const [diameter, setDiameter] = useState('10');
  const [lengthUnit, setLengthUnit] = useState<'ft' | 'in' | 'yd' | 'm'>('ft');
  const [depthUnit, setDepthUnit] = useState<'in' | 'ft'>('in');
  const [materialType, setMaterialType] = useState('fill');
  const [pricePerYard, setPricePerYard] = useState('');

  // Tab 2: Coverage state
  const [coverageYards, setCoverageYards] = useState('1');
  const [coverageDepth, setCoverageDepth] = useState('3');

  // Tab 3: Convert state
  const [convertMode, setConvertMode] = useState<'toYards' | 'toTons'>('toYards');
  const [convertValue, setConvertValue] = useState('20');
  const [convertMaterial, setConvertMaterial] = useState('fill');

  // Helper: convert length to feet
  const toFeet = (value: number, unit: string): number => {
    switch (unit) {
      case 'in': return value / 12;
      case 'yd': return value * 3;
      case 'm': return value * 3.281;
      default: return value;
    }
  };

  // Tab 1: Calculate results
  const calculateResults = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const dia = parseFloat(diameter) || 0;

    if (d <= 0) return null;

    // Convert to feet
    const lengthFt = toFeet(l, lengthUnit);
    const widthFt = toFeet(w, lengthUnit);
    const depthFt = depthUnit === 'in' ? d / 12 : d;
    const diameterFt = toFeet(dia, lengthUnit);

    let cubicFeet = 0;
    let areaSquareFeet = 0;

    switch (shape) {
      case 'rectangle':
        if (lengthFt <= 0 || widthFt <= 0) return null;
        areaSquareFeet = lengthFt * widthFt;
        cubicFeet = areaSquareFeet * depthFt;
        break;
      case 'circle':
        if (diameterFt <= 0) return null;
        const radius = diameterFt / 2;
        areaSquareFeet = Math.PI * radius * radius;
        cubicFeet = areaSquareFeet * depthFt;
        break;
      case 'triangle':
        if (lengthFt <= 0 || widthFt <= 0) return null;
        areaSquareFeet = (lengthFt * widthFt) / 2;
        cubicFeet = areaSquareFeet * depthFt;
        break;
    }

    const cubicYards = cubicFeet / 27;
    const material = materialTypes.find(m => m.id === materialType);
    const tons = cubicYards * (material?.density || 1.2);
    const pounds = tons * 2000;

    // Truck loads
    const standardTruckLoads = cubicYards / 10;

    // Cost
    const price = parseFloat(pricePerYard) || 0;
    const totalCost = price > 0 ? cubicYards * price : null;

    return {
      cubicFeet,
      cubicYards,
      tons,
      pounds,
      areaSquareFeet,
      standardTruckLoads,
      totalCost,
      materialName: material?.name || 'Fill Dirt'
    };
  }, [shape, length, width, depth, diameter, lengthUnit, depthUnit, materialType, pricePerYard]);

  // Tab 2: Coverage results
  const coverageResults = useMemo(() => {
    const yards = parseFloat(coverageYards) || 0;
    const depthInches = parseFloat(coverageDepth) || 0;

    if (yards <= 0 || depthInches <= 0) return null;

    // 1 cubic yard = 27 cubic feet
    // At depth d inches, coverage = (27 × 12) / d = 324 / d square feet per yard
    const sqFtPerYard = 324 / depthInches;
    const totalSqFt = sqFtPerYard * yards;

    return {
      sqFtPerYard,
      totalSqFt,
      depthInches
    };
  }, [coverageYards, coverageDepth]);

  // Tab 3: Convert results
  const convertResults = useMemo(() => {
    const value = parseFloat(convertValue) || 0;
    if (value <= 0) return null;

    const material = materialTypes.find(m => m.id === convertMaterial);
    const density = material?.density || 1.2;

    if (convertMode === 'toYards') {
      // tons to cubic yards
      const yards = value / density;
      return {
        input: value,
        inputUnit: 'tons',
        output: yards,
        outputUnit: 'cubic yards',
        materialName: material?.name
      };
    } else {
      // cubic yards to tons
      const tons = value * density;
      return {
        input: value,
        inputUnit: 'cubic yards',
        output: tons,
        outputUnit: 'tons',
        materialName: material?.name
      };
    }
  }, [convertMode, convertValue, convertMaterial]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF6E3" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #D4A574" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Dirt Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏗️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Dirt Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many cubic yards of dirt, topsoil, fill dirt, or gravel you need. 
            Get tonnage estimates, coverage area, and delivery truck loads for your project.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#D4A574",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #B8956E"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5C4033", margin: "0 0 4px 0" }}>
                <strong>Quick Formula:</strong> Length(ft) × Width(ft) × Depth(ft) ÷ 27 = Cubic Yards
              </p>
              <p style={{ color: "#6B4423", margin: 0, fontSize: "0.95rem" }}>
                1 cubic yard of dirt ≈ 1.1-1.4 tons (2,200-2,800 lbs) depending on material type
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculate")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculate" ? "#8B5A2B" : "#D4A574",
              color: activeTab === "calculate" ? "white" : "#5C4033",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Calculate Yards
          </button>
          <button
            onClick={() => setActiveTab("coverage")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "coverage" ? "#8B5A2B" : "#D4A574",
              color: activeTab === "coverage" ? "white" : "#5C4033",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📏 Coverage Calculator
          </button>
          <button
            onClick={() => setActiveTab("convert")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "convert" ? "#8B5A2B" : "#D4A574",
              color: activeTab === "convert" ? "white" : "#5C4033",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚖️ Tons ↔ Yards
          </button>
        </div>

        {/* Tab 1: Calculate Cubic Yards */}
        {activeTab === 'calculate' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#8B5A2B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📐 Project Dimensions
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Shape Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Area Shape
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { id: 'rectangle', label: '▭ Rectangle', icon: '▭' },
                      { id: 'circle', label: '○ Circle', icon: '○' },
                      { id: 'triangle', label: '△ Triangle', icon: '△' }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setShape(s.id as typeof shape)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: shape === s.id ? "2px solid #8B5A2B" : "1px solid #D4A574",
                          backgroundColor: shape === s.id ? "#FDF6E3" : "white",
                          cursor: "pointer",
                          fontWeight: shape === s.id ? "600" : "400",
                          color: shape === s.id ? "#8B5A2B" : "#4B5563"
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Unit */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Measurement Unit
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { id: 'ft', label: 'Feet' },
                      { id: 'in', label: 'Inches' },
                      { id: 'yd', label: 'Yards' },
                      { id: 'm', label: 'Meters' }
                    ].map(u => (
                      <button
                        key={u.id}
                        onClick={() => setLengthUnit(u.id as typeof lengthUnit)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: lengthUnit === u.id ? "2px solid #8B5A2B" : "1px solid #D4A574",
                          backgroundColor: lengthUnit === u.id ? "#FDF6E3" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: lengthUnit === u.id ? "600" : "400",
                          color: lengthUnit === u.id ? "#8B5A2B" : "#4B5563"
                        }}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                {shape === 'circle' ? (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Diameter ({lengthUnit})
                    </label>
                    <input
                      type="number"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D4A574",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                        Length ({lengthUnit})
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #D4A574",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                        Width ({lengthUnit})
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #D4A574",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Depth */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Depth
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D4A574",
                        fontSize: "1rem"
                      }}
                    />
                    <select
                      value={depthUnit}
                      onChange={(e) => setDepthUnit(e.target.value as typeof depthUnit)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D4A574",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="in">inches</option>
                      <option value="ft">feet</option>
                    </select>
                  </div>
                </div>

                {/* Material Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D4A574",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    {materialTypes.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} (~{m.density} tons/yd³)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price (Optional) */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Price per Cubic Yard (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={pricePerYard}
                      onChange={(e) => setPricePerYard(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #D4A574",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#6B4423", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Material Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {calculateResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#FDF6E3",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #8B5A2B"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B4423" }}>
                        You Need
                      </p>
                      <p style={{ margin: 0, fontSize: "3.5rem", fontWeight: "bold", color: "#8B5A2B" }}>
                        {calculateResults.cubicYards.toFixed(2)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "#6B4423" }}>
                        cubic yards
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>Cubic Feet</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>
                          {calculateResults.cubicFeet.toFixed(1)}
                        </p>
                      </div>
                      <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>Area (sq ft)</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>
                          {calculateResults.areaSquareFeet.toFixed(1)}
                        </p>
                      </div>
                      <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400E" }}>Weight (tons)</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "600", color: "#B45309" }}>
                          {calculateResults.tons.toFixed(2)}
                        </p>
                      </div>
                      <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400E" }}>Weight (lbs)</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "600", color: "#B45309" }}>
                          {calculateResults.pounds.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>

                    {/* Truck Loads */}
                    <div style={{
                      backgroundColor: "#DBEAFE",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #93C5FD"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#1E40AF" }}>
                        🚛 <strong>Delivery Estimate:</strong> {Math.ceil(calculateResults.standardTruckLoads)} standard dump truck load{Math.ceil(calculateResults.standardTruckLoads) !== 1 ? 's' : ''} (10 yd³ each)
                      </p>
                    </div>

                    {/* Cost */}
                    {calculateResults.totalCost !== null && (
                      <div style={{
                        backgroundColor: "#DCFCE7",
                        borderRadius: "8px",
                        padding: "16px",
                        border: "1px solid #86EFAC"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
                          💰 <strong>Estimated Cost:</strong> ${calculateResults.totalCost.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🏗️</p>
                    <p style={{ margin: 0 }}>Enter dimensions to calculate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Coverage Calculator */}
        {activeTab === 'coverage' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#8B5A2B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📏 Coverage Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "0.9rem", color: "#6B7280", marginTop: 0, marginBottom: "20px" }}>
                  Find out how much area your dirt will cover at a specific depth.
                </p>

                {/* Cubic Yards */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Cubic Yards of Material
                  </label>
                  <input
                    type="number"
                    value={coverageYards}
                    onChange={(e) => setCoverageYards(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D4A574",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Depth */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Desired Depth (inches)
                  </label>
                  <input
                    type="number"
                    value={coverageDepth}
                    onChange={(e) => setCoverageDepth(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D4A574",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Quick Reference */}
                <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#FDF6E3", borderRadius: "8px", border: "1px solid #D4A574" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B4423", fontWeight: "600", margin: "0 0 12px 0" }}>
                    📊 1 Cubic Yard Coverage Reference:
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem" }}>
                    {coverageReference.map(ref => (
                      <div key={ref.depth} style={{ display: "flex", justifyContent: "space-between", color: "#5C4033" }}>
                        <span>{ref.depth}:</span>
                        <span style={{ fontWeight: "600" }}>{ref.sqft} sq ft</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#6B4423", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Coverage Area
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {coverageResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#FDF6E3",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #8B5A2B"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B4423" }}>
                        Total Coverage Area
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#8B5A2B" }}>
                        {coverageResults.totalSqFt.toFixed(1)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "#6B4423" }}>
                        square feet
                      </p>
                    </div>

                    {/* Details */}
                    <div style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "16px"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                        At <strong>{coverageResults.depthInches} inches</strong> deep, each cubic yard covers <strong>{coverageResults.sqFtPerYard.toFixed(1)} sq ft</strong>
                      </p>
                    </div>

                    {/* Visualization */}
                    <div style={{
                      backgroundColor: "#DBEAFE",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #93C5FD"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                        📐 That&apos;s approximately a <strong>{Math.sqrt(coverageResults.totalSqFt).toFixed(1)} ft × {Math.sqrt(coverageResults.totalSqFt).toFixed(1)} ft</strong> square area
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>📏</p>
                    <p style={{ margin: 0 }}>Enter values to calculate coverage</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Tons to Yards Converter */}
        {activeTab === 'convert' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#8B5A2B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚖️ Tons ↔ Cubic Yards
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Conversion Mode */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Convert From
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setConvertMode('toYards')}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: convertMode === 'toYards' ? "2px solid #8B5A2B" : "1px solid #D4A574",
                        backgroundColor: convertMode === 'toYards' ? "#FDF6E3" : "white",
                        cursor: "pointer",
                        fontWeight: convertMode === 'toYards' ? "600" : "400",
                        color: convertMode === 'toYards' ? "#8B5A2B" : "#4B5563"
                      }}
                    >
                      Tons → Yards
                    </button>
                    <button
                      onClick={() => setConvertMode('toTons')}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: convertMode === 'toTons' ? "2px solid #8B5A2B" : "1px solid #D4A574",
                        backgroundColor: convertMode === 'toTons' ? "#FDF6E3" : "white",
                        cursor: "pointer",
                        fontWeight: convertMode === 'toTons' ? "600" : "400",
                        color: convertMode === 'toTons' ? "#8B5A2B" : "#4B5563"
                      }}
                    >
                      Yards → Tons
                    </button>
                  </div>
                </div>

                {/* Value */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    {convertMode === 'toYards' ? 'Tons' : 'Cubic Yards'}
                  </label>
                  <input
                    type="number"
                    value={convertValue}
                    onChange={(e) => setConvertValue(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D4A574",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Material Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Material Type
                  </label>
                  <select
                    value={convertMaterial}
                    onChange={(e) => setConvertMaterial(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D4A574",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    {materialTypes.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.density} tons/yd³)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material Density Reference */}
                <div style={{ padding: "16px", backgroundColor: "#FDF6E3", borderRadius: "8px", border: "1px solid #D4A574" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B4423", fontWeight: "600", margin: "0 0 12px 0" }}>
                    ⚖️ Material Densities (tons per cubic yard):
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.8rem" }}>
                    {materialTypes.map(m => (
                      <div key={m.id} style={{ display: "flex", justifyContent: "space-between", color: "#5C4033" }}>
                        <span>{m.name}:</span>
                        <span style={{ fontWeight: "600" }}>{m.density} t/yd³</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #D4A574",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#6B4423", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Conversion Result
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {convertResults ? (
                  <>
                    {/* Conversion Display */}
                    <div style={{
                      backgroundColor: "#FDF6E3",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #8B5A2B"
                    }}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "1.25rem", color: "#6B4423" }}>
                        {convertResults.input} {convertResults.inputUnit}
                      </p>
                      <p style={{ margin: "0 0 12px 0", fontSize: "2rem", color: "#8B5A2B" }}>
                        =
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#8B5A2B" }}>
                        {convertResults.output.toFixed(2)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "#6B4423" }}>
                        {convertResults.outputUnit}
                      </p>
                    </div>

                    {/* Material Info */}
                    <div style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                        Based on <strong>{convertResults.materialName}</strong> density
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>⚖️</p>
                    <p style={{ margin: 0 }}>Enter a value to convert</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D4A574", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🏗️ How to Calculate Dirt Yardage
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Calculating how much dirt you need is essential for landscaping, construction, and gardening projects. 
                  Whether you&apos;re filling a hole, building a raised bed, or grading your yard, getting the right amount 
                  saves money and prevents project delays.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Cubic Yard Formula</h3>
                <div style={{
                  backgroundColor: "#FDF6E3",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #D4A574",
                  textAlign: "center"
                }}>
                  <p style={{ margin: 0, fontSize: "1.1rem", color: "#8B5A2B", fontFamily: "monospace" }}>
                    Cubic Yards = (Length × Width × Depth in feet) ÷ 27
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step-by-Step Example</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #86EFAC"
                }}>
                  <p style={{ margin: "0 0 8px 0", color: "#166534" }}><strong>Problem:</strong> Fill a 20ft × 10ft area with 6 inches of topsoil</p>
                  <ol style={{ margin: "12px 0 0 0", paddingLeft: "20px", lineHeight: "2" }}>
                    <li>Convert depth to feet: 6 inches ÷ 12 = 0.5 feet</li>
                    <li>Calculate volume: 20 × 10 × 0.5 = 100 cubic feet</li>
                    <li>Convert to yards: 100 ÷ 27 = <strong>3.7 cubic yards</strong></li>
                    <li>Weight estimate: 3.7 × 1.1 tons = <strong>~4 tons</strong></li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Dirt and Their Uses</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginTop: "12px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#FDF6E3" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #D4A574" }}>Type</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #D4A574" }}>Weight</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #D4A574" }}>Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialTypes.map((m, index) => (
                        <tr key={m.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FAFAFA' }}>
                          <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>{m.name}</td>
                          <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{m.density} tons/yd³</td>
                          <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>{m.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Dump Truck Capacities</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  {truckSizes.map(truck => (
                    <div key={truck.name} style={{ padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#1E40AF", fontSize: "0.9rem" }}>{truck.name}</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1D4ED8" }}>{truck.capacity} yd³</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FDF6E3", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #D4A574" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#8B5A2B", marginBottom: "16px" }}>📋 Quick Conversions</h3>
              <div style={{ fontSize: "0.9rem", color: "#6B4423", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>• 1 cubic yard = 27 cubic feet</p>
                <p style={{ margin: 0 }}>• 1 cubic yard = 46,656 cubic inches</p>
                <p style={{ margin: 0 }}>• 1 cubic yard ≈ 0.76 cubic meters</p>
                <p style={{ margin: 0 }}>• 1 ton of dirt ≈ 0.83 cubic yards</p>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Order 10-15% extra for settling and waste</p>
                <p style={{ margin: "0 0 8px 0" }}>• Wet dirt can weigh 20-30% more</p>
                <p style={{ margin: 0 }}>• Compacted dirt needs ~25% more material</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/dirt-calculator" currentCategory="Construction" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D4A574", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FDF6E3", borderRadius: "8px", border: "1px solid #D4A574" }}>
          <p style={{ fontSize: "0.75rem", color: "#8B5A2B", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on standard material densities. 
            Actual weights may vary based on moisture content, compaction, and material composition. 
            Always confirm quantities with your supplier before ordering.
          </p>
        </div>
      </div>
    </div>
  );
}