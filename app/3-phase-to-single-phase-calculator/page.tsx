"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Three-phase voltage presets
const voltage3PhasePresets = [
  { value: 208, label: "208V", region: "US" },
  { value: 230, label: "230V", region: "US/EU" },
  { value: 380, label: "380V", region: "EU" },
  { value: 400, label: "400V", region: "EU" },
  { value: 415, label: "415V", region: "UK/AU" },
  { value: 460, label: "460V", region: "US" },
  { value: 480, label: "480V", region: "US" }
];

// Single-phase voltage presets
const voltage1PhasePresets = [
  { value: 120, label: "120V", region: "US" },
  { value: 220, label: "220V", region: "EU/Asia" },
  { value: 230, label: "230V", region: "EU" },
  { value: 240, label: "240V", region: "US/AU" }
];

// Power factor presets
const pfPresets = [
  { value: 0.8, label: "0.80" },
  { value: 0.85, label: "0.85" },
  { value: 0.9, label: "0.90" },
  { value: 0.95, label: "0.95" },
  { value: 1.0, label: "1.00" }
];

// Equipment types for converter sizing
const equipmentTypes = [
  { id: "motor", label: "Electric Motor", icon: "⚙️", startupMultiplier: 1.5, description: "Standard induction motors" },
  { id: "compressor", label: "Compressor", icon: "🌀", startupMultiplier: 2.0, description: "Air compressors, refrigeration" },
  { id: "cnc", label: "CNC Machine", icon: "🔧", startupMultiplier: 1.5, description: "Lathes, mills, routers" },
  { id: "welder", label: "Welder", icon: "⚡", startupMultiplier: 2.5, description: "MIG, TIG, stick welders" },
  { id: "pump", label: "Pump", icon: "💧", startupMultiplier: 1.75, description: "Water, hydraulic pumps" },
  { id: "hvac", label: "HVAC Unit", icon: "❄️", startupMultiplier: 2.0, description: "AC units, heat pumps" }
];

// Converter types comparison
const converterTypes = [
  {
    type: "Static",
    icon: "📦",
    pros: ["Lowest cost", "No moving parts", "Compact size", "Low maintenance"],
    cons: ["Lower power output", "Voltage imbalance", "Not for continuous use", "Limited to single loads"],
    bestFor: "Light-duty, occasional use, single motor applications",
    priceRange: "$100 - $500"
  },
  {
    type: "Rotary",
    icon: "🔄",
    pros: ["Balanced output", "Powers multiple machines", "Reliable", "Good for continuous use"],
    cons: ["Higher initial cost", "Requires space", "Some noise", "Needs maintenance"],
    bestFor: "Workshops, multiple machines, continuous operation",
    priceRange: "$500 - $3,000"
  },
  {
    type: "Digital (VFD)",
    icon: "🖥️",
    pros: ["Most efficient", "Speed control", "Soft start", "Best power quality"],
    cons: ["Highest cost", "Complex setup", "One motor per VFD", "Sensitive to dust"],
    bestFor: "Precision applications, variable speed needs, single motor",
    priceRange: "$300 - $2,000+"
  }
];

// Common voltage combinations
const voltageCombinations = [
  { region: "USA Residential", phase1: "120/240V", phase3: "208V", notes: "Split-phase service" },
  { region: "USA Commercial", phase1: "120/240V", phase3: "480V", notes: "Industrial buildings" },
  { region: "Europe", phase1: "230V", phase3: "400V", notes: "Standard EU voltage" },
  { region: "UK", phase1: "230V", phase3: "415V", notes: "BS 7671 standard" },
  { region: "Australia", phase1: "230V", phase3: "400V", notes: "AS/NZS 3000" },
  { region: "Japan", phase1: "100/200V", phase3: "200V", notes: "50Hz/60Hz regions" }
];

// FAQ data
const faqs = [
  {
    question: "Can you convert three-phase into single-phase?",
    answer: "Yes, but it's rarely needed. Three-phase to single-phase conversion typically involves using only one phase of the three-phase supply, which provides about 1/3 of the total power. For balanced loads, you'd need a transformer. Most conversions go the other way—single-phase to three-phase—to run industrial equipment from residential power."
  },
  {
    question: "Do single-phase to 3-phase converters work?",
    answer: "Yes, they work well when properly sized. Phase converters (static, rotary, or digital) can effectively convert single-phase power to three-phase for running motors and equipment. The key is choosing the right type and size for your application. Rotary converters provide the best balance, while VFDs offer precise control."
  },
  {
    question: "Are phase converters worth it?",
    answer: "Phase converters are worth it when: 1) You need to run 3-phase equipment but only have single-phase power, 2) The cost of installing 3-phase service exceeds the converter cost, 3) You're in a location where 3-phase isn't available. For occasional use, a static converter may suffice. For workshops with multiple machines, a rotary converter is a better investment."
  },
  {
    question: "Can 3 phase be converted to 240V?",
    answer: "Yes. If you have 208V three-phase, you can get 208V single-phase between any two legs. For 480V three-phase, a step-down transformer can provide 240V single-phase. The single-phase voltage from a three-phase system depends on whether it's wye or delta configuration and which terminals you use."
  },
  {
    question: "How do I size a phase converter?",
    answer: "General rule: Converter HP rating should be 1.5× to 2× your largest motor's HP rating. For hard-starting loads (compressors, pumps), use 2× or more. For multiple motors, size for the largest motor plus 50% of other running loads. Always consult manufacturer guidelines for specific applications."
  },
  {
    question: "What's the formula for 3-phase to single-phase conversion?",
    answer: "For power: P(3φ) = √3 × V × I × PF. For equivalent single-phase current: I(1φ) = (√3 × I(3φ) × V(3φ)) / V(1φ). The √3 factor (approximately 1.732) accounts for the phase relationship in three-phase systems."
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
      <div style={{ maxHeight: isOpen ? "500px" : "0", overflow: "hidden", transition: "max-height 0.2s ease-out" }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function ThreePhaseToSinglePhaseCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculator" | "sizing" | "guide">("calculator");
  
  // Calculator state
  const [voltage3Phase, setVoltage3Phase] = useState<number>(480);
  const [current3Phase, setCurrent3Phase] = useState<string>("10");
  const [voltage1Phase, setVoltage1Phase] = useState<number>(240);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  
  // Sizing state
  const [equipmentHP, setEquipmentHP] = useState<string>("5");
  const [equipmentType, setEquipmentType] = useState("motor");
  const [multipleLoads, setMultipleLoads] = useState<string>("0");

  // Calculate 3-phase power and single-phase equivalent
  const sqrt3 = Math.sqrt(3);
  const current3 = parseFloat(current3Phase) || 0;
  
  // Three-phase apparent power (kVA)
  const apparentPower3Phase = (sqrt3 * voltage3Phase * current3) / 1000;
  
  // Three-phase real power (kW)
  const realPower3Phase = apparentPower3Phase * powerFactor;
  
  // Single-phase equivalent current
  const current1Phase = (sqrt3 * current3 * voltage3Phase) / voltage1Phase;
  
  // Single-phase apparent power (kVA)
  const apparentPower1Phase = (voltage1Phase * current1Phase) / 1000;

  // Converter sizing calculations
  const hp = parseFloat(equipmentHP) || 0;
  const additionalLoad = parseFloat(multipleLoads) || 0;
  const equipment = equipmentTypes.find(e => e.id === equipmentType);
  const multiplier = equipment?.startupMultiplier || 1.5;
  
  // Recommended converter sizes
  const staticConverterHP = hp * multiplier * 1.5; // Static needs more headroom
  const rotaryConverterHP = hp * multiplier + (additionalLoad * 0.5);
  const vfdHP = hp * 1.25; // VFD with soft start needs less oversizing
  
  // Convert HP to kVA (approximate: 1 HP ≈ 0.746 kW, assuming PF 0.85)
  const hpToKVA = (hpValue: number) => (hpValue * 0.746) / 0.85;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>3 Phase to Single Phase Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              3 Phase to Single Phase Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate power conversion between three-phase and single-phase electrical systems. 
            Find the right phase converter size for your equipment. Free calculator with sizing guide.
          </p>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Key Formulas</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                <strong>3-Phase Power:</strong> P = √3 × V × I × PF &nbsp;|&nbsp; 
                <strong>1-Phase Current:</strong> I₁ = (√3 × I₃ × V₃) ÷ V₁ &nbsp;|&nbsp; 
                <strong>√3 ≈ 1.732</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "calculator", label: "Power Calculator", icon: "🔢" },
            { id: "sizing", label: "Converter Sizing", icon: "📐" },
            { id: "guide", label: "Guide & Formulas", icon: "📖" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#EDE9FE" : "white",
                color: activeTab === tab.id ? "#6D28D9" : "#4B5563",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Power Calculator */}
        {activeTab === "calculator" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⚡ 3-Phase Input</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* 3-Phase Voltage */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    3-Phase Voltage (Line-to-Line)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {voltage3PhasePresets.map((v) => (
                      <button
                        key={v.value}
                        onClick={() => setVoltage3Phase(v.value)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: voltage3Phase === v.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: voltage3Phase === v.value ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        <span style={{ color: voltage3Phase === v.value ? "#6D28D9" : "#374151", fontWeight: "500" }}>{v.label}</span>
                        <span style={{ color: "#9CA3AF", fontSize: "0.7rem", display: "block" }}>{v.region}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3-Phase Current */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    3-Phase Current (A)
                  </label>
                  <input
                    type="number"
                    value={current3Phase}
                    onChange={(e) => setCurrent3Phase(e.target.value)}
                    placeholder="Enter current in amps"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Power Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Power Factor (PF)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {pfPresets.map((pf) => (
                      <button
                        key={pf.value}
                        onClick={() => setPowerFactor(pf.value)}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "6px",
                          border: powerFactor === pf.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: powerFactor === pf.value ? "#EDE9FE" : "white",
                          color: powerFactor === pf.value ? "#6D28D9" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {pf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1-Phase Voltage */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Target Single-Phase Voltage
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {voltage1PhasePresets.map((v) => (
                      <button
                        key={v.value}
                        onClick={() => setVoltage1Phase(v.value)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: voltage1Phase === v.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: voltage1Phase === v.value ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        <span style={{ color: voltage1Phase === v.value ? "#6D28D9" : "#374151", fontWeight: "500" }}>{v.label}</span>
                        <span style={{ color: "#9CA3AF", fontSize: "0.7rem", display: "block" }}>{v.region}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* 3-Phase Power */}
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#EDE9FE", borderRadius: "12px" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#6D28D9", fontSize: "0.9rem" }}>3-Phase Power</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#6D28D9" }}>
                        {realPower3Phase.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#7C3AED" }}>kW (Real)</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#6D28D9" }}>
                        {apparentPower3Phase.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#7C3AED" }}>kVA (Apparent)</div>
                    </div>
                  </div>
                </div>

                {/* Single-Phase Equivalent */}
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#065F46", fontSize: "0.9rem" }}>Single-Phase Equivalent @ {voltage1Phase}V</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                        {current1Phase.toFixed(1)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#047857" }}>Amps Required</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                        {apparentPower1Phase.toFixed(2)}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#047857" }}>kVA</div>
                    </div>
                  </div>
                </div>

                {/* Horsepower Equivalent */}
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                  <h3 style={{ margin: "0 0 8px 0", color: "#1D4ED8", fontSize: "0.9rem" }}>Motor Equivalent</h3>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#2563EB" }}>
                      {(realPower3Phase / 0.746).toFixed(1)} HP
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#1D4ED8" }}>≈ {realPower3Phase.toFixed(2)} kW</div>
                  </div>
                </div>

                {/* Formula Used */}
                <div style={{ padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#4B5563", fontFamily: "monospace" }}>
                    P = √3 × {voltage3Phase}V × {current3}A × {powerFactor} = {realPower3Phase.toFixed(2)} kW
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Converter Sizing */}
        {activeTab === "sizing" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Equipment Details</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Equipment HP */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Largest Motor / Equipment (HP)
                  </label>
                  <input
                    type="number"
                    value={equipmentHP}
                    onChange={(e) => setEquipmentHP(e.target.value)}
                    placeholder="Enter HP rating"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                    1 HP ≈ 0.746 kW | Check motor nameplate for HP rating
                  </p>
                </div>

                {/* Equipment Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Equipment Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {equipmentTypes.map((eq) => (
                      <button
                        key={eq.id}
                        onClick={() => setEquipmentType(eq.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: equipmentType === eq.id ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: equipmentType === eq.id ? "#FEF2F2" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "1.25rem" }}>{eq.icon}</span>
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: "600", color: equipmentType === eq.id ? "#DC2626" : "#374151" }}>
                              {eq.label}
                            </div>
                            <div style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>×{eq.startupMultiplier} startup</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Loads */}
                <div style={{ marginBottom: "10px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Additional Running Loads (HP)
                  </label>
                  <input
                    type="number"
                    value={multipleLoads}
                    onChange={(e) => setMultipleLoads(e.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                    Total HP of other motors running simultaneously
                  </p>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✅ Recommended Converter Size</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Static Converter */}
                <div style={{ marginBottom: "16px", padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", color: "#92400E", fontSize: "1rem" }}>📦 Static Converter</h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#B45309" }}>Budget option, light duty</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#92400E" }}>
                        {Math.ceil(staticConverterHP)} HP
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#B45309" }}>
                        ≈ {hpToKVA(staticConverterHP).toFixed(1)} kVA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rotary Converter */}
                <div style={{ marginBottom: "16px", padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "12px", border: "2px solid #059669" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", color: "#065F46", fontSize: "1rem" }}>🔄 Rotary Converter</h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#047857" }}>⭐ Recommended for most uses</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                        {Math.ceil(rotaryConverterHP)} HP
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#047857" }}>
                        ≈ {hpToKVA(rotaryConverterHP).toFixed(1)} kVA
                      </div>
                    </div>
                  </div>
                </div>

                {/* VFD */}
                <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "12px", border: "1px solid #BFDBFE" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", color: "#1D4ED8", fontSize: "1rem" }}>🖥️ Digital / VFD</h3>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#2563EB" }}>Precision, speed control</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                        {Math.ceil(vfdHP)} HP
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#2563EB" }}>
                        ≈ {hpToKVA(vfdHP).toFixed(1)} kVA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Notes */}
                <div style={{ padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>Sizing Notes:</p>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.6" }}>
                    <li>Based on {hp} HP {equipment?.label} (×{multiplier} startup factor)</li>
                    {parseFloat(multipleLoads) > 0 && <li>Plus {multipleLoads} HP additional running loads</li>}
                    <li>Always round up to nearest available size</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Guide */}
        {activeTab === "guide" && (
          <div style={{ marginBottom: "40px" }}>
            {/* Converter Types Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⚡ Phase Converter Types Comparison</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  {converterTypes.map((converter) => (
                    <div
                      key={converter.type}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ fontSize: "1.5rem" }}>{converter.icon}</span>
                        <h3 style={{ margin: 0, color: "#111827" }}>{converter.type}</h3>
                      </div>
                      
                      <div style={{ marginBottom: "12px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", fontWeight: "600", color: "#059669" }}>✅ Pros:</p>
                        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#4B5563" }}>
                          {converter.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                        </ul>
                      </div>
                      
                      <div style={{ marginBottom: "12px" }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", fontWeight: "600", color: "#DC2626" }}>❌ Cons:</p>
                        <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#4B5563" }}>
                          {converter.cons.map((con, i) => <li key={i}>{con}</li>)}
                        </ul>
                      </div>
                      
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem" }}>
                        <strong>Best for:</strong> {converter.bestFor}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: "600", color: "#7C3AED" }}>
                        Price: {converter.priceRange}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Voltage Combinations */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌍 Common Voltage Standards by Region</h2>
              </div>
              
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#EFF6FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Region</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Single-Phase</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Three-Phase</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voltageCombinations.map((combo, idx) => (
                      <tr key={combo.region} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{combo.region}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{combo.phase1}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>{combo.phase3}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{combo.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Formulas */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Electrical Formulas Reference</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                  {/* Three-Phase Power */}
                  <div style={{ padding: "20px", backgroundColor: "#EDE9FE", borderRadius: "12px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "#6D28D9" }}>3-Phase Power</h3>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1rem", textAlign: "center", marginBottom: "12px" }}>
                      P = √3 × V × I × PF
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                      P = Power (W), V = Line Voltage, I = Line Current, PF = Power Factor
                    </p>
                  </div>

                  {/* Single-Phase Power */}
                  <div style={{ padding: "20px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "#065F46" }}>1-Phase Power</h3>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1rem", textAlign: "center", marginBottom: "12px" }}>
                      P = V × I × PF
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>
                      No √3 factor needed for single-phase calculations
                    </p>
                  </div>

                  {/* Current Conversion */}
                  <div style={{ padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "#92400E" }}>3φ to 1φ Current</h3>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1rem", textAlign: "center", marginBottom: "12px" }}>
                      I₁ = (√3 × I₃ × V₃) ÷ V₁
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309" }}>
                      Equivalent single-phase current from 3-phase values
                    </p>
                  </div>

                  {/* HP to kW */}
                  <div style={{ padding: "20px", backgroundColor: "#EFF6FF", borderRadius: "12px" }}>
                    <h3 style={{ margin: "0 0 12px 0", color: "#1D4ED8" }}>HP ↔ kW</h3>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1rem", textAlign: "center", marginBottom: "12px" }}>
                      1 HP = 0.746 kW
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#2563EB" }}>
                      kW = HP × 0.746 | HP = kW ÷ 0.746
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚡ Understanding Phase Conversion</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Three-phase power is commonly used in industrial and commercial settings because it&apos;s more efficient 
                  for running large motors and equipment. However, most residential areas only have single-phase power available.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Convert Single-Phase to Three-Phase?</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Run industrial equipment:</strong> CNC machines, lathes, mills, and compressors</li>
                  <li><strong>Home workshops:</strong> Use professional-grade tools at home</li>
                  <li><strong>Cost savings:</strong> Cheaper than installing utility 3-phase service</li>
                  <li><strong>Remote locations:</strong> Where 3-phase isn&apos;t available</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The √3 Factor Explained</h3>
                <p>
                  The √3 (approximately 1.732) factor appears in three-phase calculations because of the 120° 
                  phase relationship between the three voltage waveforms. This geometric relationship means 
                  three-phase systems can deliver more power with the same wire size compared to single-phase.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EDE9FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6D28D9", marginBottom: "16px" }}>⚡ Quick Reference</h3>
              <div style={{ fontSize: "0.875rem", color: "#5B21B6", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>√3 = <strong>1.732</strong></p>
                <p style={{ margin: 0 }}>1 HP = <strong>0.746 kW</strong></p>
                <p style={{ margin: 0 }}>1 kW = <strong>1.341 HP</strong></p>
                <p style={{ margin: 0 }}>Typical PF = <strong>0.85</strong></p>
              </div>
            </div>

            {/* Sizing Rule */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "16px" }}>📐 Sizing Rule of Thumb</h3>
              <div style={{ fontSize: "0.85rem", color: "#7F1D1D", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Motors:</strong> Converter = 1.5× HP</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Compressors:</strong> Converter = 2× HP</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Welders:</strong> Converter = 2.5× HP</p>
                <p style={{ margin: 0 }}><strong>Multiple loads:</strong> Add 50% of secondary loads</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/3-phase-to-single-phase-calculator" currentCategory="Converter" />
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
            ⚡ <strong>Disclaimer:</strong> This calculator provides estimates for educational and planning purposes. 
            Always consult a licensed electrician before making electrical installations. Follow local electrical codes and safety standards.
          </p>
        </div>
      </div>
    </div>
  );
}