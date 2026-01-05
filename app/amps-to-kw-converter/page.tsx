"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Voltage presets
const voltagePresets = [
  { value: 110, label: "110V" },
  { value: 120, label: "120V" },
  { value: 220, label: "220V" },
  { value: 230, label: "230V" },
  { value: 240, label: "240V" },
  { value: 277, label: "277V" },
  { value: 380, label: "380V" },
  { value: 480, label: "480V" }
];

// Power factor presets
const pfPresets = [
  { value: 0.8, label: "0.80" },
  { value: 0.85, label: "0.85" },
  { value: 0.9, label: "0.90" },
  { value: 0.95, label: "0.95" },
  { value: 1.0, label: "1.00" }
];

// Reference table data
const referenceAmps = [1, 5, 10, 15, 20, 30, 40, 50, 60, 80, 100, 150, 200];

// FAQ data
const faqs = [
  {
    question: "How do you convert amps to kW?",
    answer: "To convert amps to kilowatts, multiply amps by volts and divide by 1000. For DC: kW = (A × V) / 1000. For single-phase AC: kW = (A × V × PF) / 1000. For three-phase AC: kW = (A × V × PF × √3) / 1000. The power factor (PF) is typically between 0.8 and 1.0 for most applications."
  },
  {
    question: "How many amps are in 1 kW?",
    answer: "The number of amps in 1 kW depends on the voltage. At 120V (single-phase, PF=1): 1 kW = 8.33 amps. At 220V: 1 kW = 4.55 amps. At 240V: 1 kW = 4.17 amps. At 480V (three-phase, PF=1): 1 kW = 1.2 amps."
  },
  {
    question: "What is 20 amps in kW?",
    answer: "20 amps converted to kW depends on voltage: At 120V = 2.4 kW, at 220V = 4.4 kW, at 240V = 4.8 kW. These calculations assume a power factor of 1.0. For AC circuits with lower power factors, multiply by the PF value."
  },
  {
    question: "How much is 200 amps in kW?",
    answer: "200 amps equals: 24 kW at 120V, 44 kW at 220V, 48 kW at 240V (single-phase, PF=1). For three-phase at 480V with PF=0.9, 200 amps equals approximately 149.8 kW."
  },
  {
    question: "What is power factor and why does it matter?",
    answer: "Power factor (PF) is the ratio of real power to apparent power in an AC circuit, ranging from 0 to 1. It indicates how efficiently electrical power is being used. A PF of 1.0 means all power is used effectively. Motors and inductive loads typically have PF of 0.8-0.95. Lower PF means you need more amps to deliver the same real power."
  },
  {
    question: "What's the difference between single-phase and three-phase?",
    answer: "Single-phase power uses one alternating current and is common in homes (120V/240V). Three-phase power uses three alternating currents 120° apart and is used in industrial settings (480V). Three-phase is more efficient for high-power applications and uses the √3 (1.732) multiplier in calculations."
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

export default function AmpsToKwConverter() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculator" | "tables" | "formulas">("calculator");
  
  // Calculator state
  const [currentType, setCurrentType] = useState<"dc" | "ac1" | "ac3">("ac1");
  const [amps, setAmps] = useState<string>("20");
  const [voltage, setVoltage] = useState<number>(220);
  const [customVoltage, setCustomVoltage] = useState<string>("");
  const [powerFactor, setPowerFactor] = useState<number>(1.0);
  const [customPF, setCustomPF] = useState<string>("");
  
  // Reference table state
  const [tableVoltage, setTableVoltage] = useState<number>(220);
  const [tablePF, setTablePF] = useState<number>(1.0);
  const [tableType, setTableType] = useState<"ac1" | "ac3">("ac1");

  // Get actual voltage value
  const getVoltage = () => {
    if (customVoltage && !isNaN(parseFloat(customVoltage))) {
      return parseFloat(customVoltage);
    }
    return voltage;
  };

  // Get actual power factor value
  const getPowerFactor = () => {
    if (customPF && !isNaN(parseFloat(customPF))) {
      return Math.min(1, Math.max(0, parseFloat(customPF)));
    }
    return powerFactor;
  };

  // Calculate kW from amps
  const calculateKW = (ampsValue: number, volts: number, pf: number, type: string): number => {
    if (type === "dc") {
      return (ampsValue * volts) / 1000;
    } else if (type === "ac1") {
      return (ampsValue * volts * pf) / 1000;
    } else {
      // Three-phase: kW = √3 × A × V × PF / 1000
      return (Math.sqrt(3) * ampsValue * volts * pf) / 1000;
    }
  };

  // Get result
  const ampsValue = parseFloat(amps) || 0;
  const voltsValue = getVoltage();
  const pfValue = getPowerFactor();
  const resultKW = calculateKW(ampsValue, voltsValue, pfValue, currentType);
  const resultWatts = resultKW * 1000;

  // Get formula string
  const getFormulaString = () => {
    if (currentType === "dc") {
      return `P(kW) = ${ampsValue} A × ${voltsValue} V ÷ 1000 = ${resultKW.toFixed(3)} kW`;
    } else if (currentType === "ac1") {
      return `P(kW) = ${ampsValue} A × ${voltsValue} V × ${pfValue} ÷ 1000 = ${resultKW.toFixed(3)} kW`;
    } else {
      return `P(kW) = √3 × ${ampsValue} A × ${voltsValue} V × ${pfValue} ÷ 1000 = ${resultKW.toFixed(3)} kW`;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Amps to kW Converter</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Amps to kW Converter
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Convert amperes (A) to kilowatts (kW) for DC, single-phase AC, and three-phase AC circuits. 
            Includes quick reference tables and conversion formulas.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Formula</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                <strong>DC:</strong> kW = A × V ÷ 1000 &nbsp;|&nbsp; 
                <strong>Single-phase AC:</strong> kW = A × V × PF ÷ 1000 &nbsp;|&nbsp; 
                <strong>Three-phase AC:</strong> kW = √3 × A × V × PF ÷ 1000
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { id: "calculator", label: "Calculator", icon: "🔢" },
            { id: "tables", label: "Reference Tables", icon: "📊" },
            { id: "formulas", label: "Formulas Guide", icon: "📐" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                border: activeTab === tab.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? "#EFF6FF" : "white",
                color: activeTab === tab.id ? "#1D4ED8" : "#4B5563",
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

        {/* Tab 1: Calculator */}
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
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⚡ Enter Values</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Current Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Current Type
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { id: "dc", label: "DC" },
                      { id: "ac1", label: "AC Single-Phase" },
                      { id: "ac3", label: "AC Three-Phase" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setCurrentType(type.id as typeof currentType)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: currentType === type.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: currentType === type.id ? "#EFF6FF" : "white",
                          color: currentType === type.id ? "#1D4ED8" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "500"
                        }}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amps Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Current (Amps)
                  </label>
                  <input
                    type="number"
                    value={amps}
                    onChange={(e) => setAmps(e.target.value)}
                    placeholder="Enter amps"
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

                {/* Voltage Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Voltage (V)
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    {voltagePresets.map((v) => (
                      <button
                        key={v.value}
                        onClick={() => { setVoltage(v.value); setCustomVoltage(""); }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "6px",
                          border: voltage === v.value && !customVoltage ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: voltage === v.value && !customVoltage ? "#EFF6FF" : "white",
                          color: voltage === v.value && !customVoltage ? "#1D4ED8" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={customVoltage}
                    onChange={(e) => setCustomVoltage(e.target.value)}
                    placeholder="Or enter custom voltage"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "0.9rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Power Factor - Only for AC */}
                {currentType !== "dc" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                      Power Factor (PF)
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                      {pfPresets.map((pf) => (
                        <button
                          key={pf.value}
                          onClick={() => { setPowerFactor(pf.value); setCustomPF(""); }}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: powerFactor === pf.value && !customPF ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: powerFactor === pf.value && !customPF ? "#EFF6FF" : "white",
                            color: powerFactor === pf.value && !customPF ? "#1D4ED8" : "#374151",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {pf.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={customPF}
                      onChange={(e) => setCustomPF(e.target.value)}
                      placeholder="Or enter custom PF (0-1)"
                      step="0.01"
                      min="0"
                      max="1"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "0.9rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                )}
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Result</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {resultKW.toFixed(3)}
                  </div>
                  <div style={{ fontSize: "1.5rem", color: "#6B7280" }}>kW</div>
                </div>

                {/* Secondary Results */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#166534" }}>
                      {resultWatts.toFixed(1)}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#166534" }}>Watts (W)</div>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1D4ED8" }}>
                      {(resultKW * 1.341).toFixed(3)}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#1D4ED8" }}>Horsepower (HP)</div>
                  </div>
                </div>

                {/* Formula Used */}
                <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Formula Used:</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563", fontFamily: "monospace" }}>
                    {getFormulaString()}
                  </p>
                </div>

                {/* Input Summary */}
                <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    <strong>Input:</strong> {ampsValue} A @ {voltsValue}V 
                    {currentType !== "dc" && ` (PF: ${pfValue})`}
                    {" | "}
                    <strong>Type:</strong> {currentType === "dc" ? "DC" : currentType === "ac1" ? "Single-Phase AC" : "Three-Phase AC"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reference Tables */}
        {activeTab === "tables" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Amps to kW Reference Tables</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Table Controls */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Voltage
                    </label>
                    <select
                      value={tableVoltage}
                      onChange={(e) => setTableVoltage(parseInt(e.target.value))}
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {voltagePresets.map((v) => (
                        <option key={v.value} value={v.value}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Power Factor
                    </label>
                    <select
                      value={tablePF}
                      onChange={(e) => setTablePF(parseFloat(e.target.value))}
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {pfPresets.map((pf) => (
                        <option key={pf.value} value={pf.value}>{pf.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Phase Type
                    </label>
                    <select
                      value={tableType}
                      onChange={(e) => setTableType(e.target.value as "ac1" | "ac3")}
                      style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="ac1">Single-Phase AC</option>
                      <option value="ac3">Three-Phase AC</option>
                    </select>
                  </div>
                </div>

                {/* Reference Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F5F3FF" }}>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Amps (A)</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Kilowatts (kW)</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Watts (W)</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Horsepower (HP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referenceAmps.map((amp, idx) => {
                        const kw = calculateKW(amp, tableVoltage, tablePF, tableType);
                        return (
                          <tr key={amp} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{amp}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{kw.toFixed(3)}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(kw * 1000).toFixed(1)}</td>
                            <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{(kw * 1.341).toFixed(3)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p style={{ marginTop: "16px", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                  Table shows conversions for {tableType === "ac1" ? "Single-Phase" : "Three-Phase"} AC at {tableVoltage}V with Power Factor {tablePF}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Formulas Guide */}
        {activeTab === "formulas" && (
          <div style={{ marginBottom: "40px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Amps to kW Conversion Formulas</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* DC Formula */}
                <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "#F0FDF4", borderRadius: "12px", border: "1px solid #BBF7D0" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#166534" }}>⚡ DC (Direct Current)</h3>
                  <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1.1rem", textAlign: "center", marginBottom: "12px" }}>
                    P(kW) = I(A) × V(V) ÷ 1000
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
                    <strong>Example:</strong> 20A at 48V DC = 20 × 48 ÷ 1000 = <strong>0.96 kW</strong>
                  </p>
                </div>

                {/* Single-Phase AC Formula */}
                <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "#EFF6FF", borderRadius: "12px", border: "1px solid #BFDBFE" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#1D4ED8" }}>🔌 Single-Phase AC</h3>
                  <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1.1rem", textAlign: "center", marginBottom: "12px" }}>
                    P(kW) = I(A) × V(V) × PF ÷ 1000
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#1D4ED8" }}>
                    <strong>Example:</strong> 20A at 220V with PF 0.9 = 20 × 220 × 0.9 ÷ 1000 = <strong>3.96 kW</strong>
                  </p>
                </div>

                {/* Three-Phase AC Formula */}
                <div style={{ marginBottom: "24px", padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#92400E" }}>⚙️ Three-Phase AC</h3>
                  <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "8px", fontFamily: "monospace", fontSize: "1.1rem", textAlign: "center", marginBottom: "12px" }}>
                    P(kW) = √3 × I(A) × V(V) × PF ÷ 1000
                  </div>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#92400E" }}>
                    <strong>Note:</strong> √3 ≈ 1.732
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E" }}>
                    <strong>Example:</strong> 50A at 480V with PF 0.85 = 1.732 × 50 × 480 × 0.85 ÷ 1000 = <strong>35.34 kW</strong>
                  </p>
                </div>

                {/* Power Factor Explanation */}
                <div style={{ padding: "20px", backgroundColor: "#F5F3FF", borderRadius: "12px", border: "1px solid #DDD6FE" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#6D28D9" }}>📖 What is Power Factor (PF)?</h3>
                  <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#5B21B6", lineHeight: "1.7" }}>
                    Power Factor is the ratio of real power (kW) to apparent power (kVA). It indicates how efficiently electrical power is being used.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem", color: "#5B21B6", lineHeight: "1.8" }}>
                    <li><strong>PF = 1.0:</strong> Purely resistive load (heaters, incandescent lights)</li>
                    <li><strong>PF = 0.85-0.95:</strong> Motors, transformers, industrial equipment</li>
                    <li><strong>PF = 0.8:</strong> Typical mixed commercial load</li>
                    <li><strong>PF &lt; 0.8:</strong> Highly inductive loads (large motors, welders)</li>
                  </ul>
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚡ Understanding Amps and Kilowatts</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Amperes (amps) measure electrical current—the flow of electrons through a conductor. 
                  Kilowatts (kW) measure power—the rate at which energy is consumed or produced. 
                  Converting between them requires knowing the voltage of your system.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Applications</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Home appliances:</strong> Understanding power consumption for energy bills</li>
                  <li><strong>Solar systems:</strong> Sizing inverters and calculating output</li>
                  <li><strong>Generators:</strong> Determining capacity requirements</li>
                  <li><strong>Industrial equipment:</strong> Selecting proper circuit breakers</li>
                  <li><strong>EV charging:</strong> Understanding charging speed and power</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Quick Reference</h3>
                <p>
                  At 220V single-phase: <strong>1 kW ≈ 4.55 amps</strong> (PF=1)<br />
                  At 240V single-phase: <strong>1 kW ≈ 4.17 amps</strong> (PF=1)<br />
                  At 480V three-phase: <strong>1 kW ≈ 1.2 amps</strong> (PF=1)
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Conversions */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1D4ED8", marginBottom: "16px" }}>⚡ Quick Conversions @ 220V</h3>
              <div style={{ fontSize: "0.875rem", color: "#1E40AF", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>10 A = <strong>2.2 kW</strong></p>
                <p style={{ margin: 0 }}>20 A = <strong>4.4 kW</strong></p>
                <p style={{ margin: 0 }}>30 A = <strong>6.6 kW</strong></p>
                <p style={{ margin: 0 }}>50 A = <strong>11 kW</strong></p>
                <p style={{ margin: 0 }}>100 A = <strong>22 kW</strong></p>
                <p style={{ margin: 0 }}>200 A = <strong>44 kW</strong></p>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>*Single-phase, PF = 1.0</p>
            </div>

            {/* Common Voltages */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>🔌 Common Voltages</h3>
              <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>110-120V:</strong> US residential</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>220-240V:</strong> US heavy appliances, EU/Asia residential</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>277V:</strong> US commercial lighting</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>380V:</strong> EU industrial 3-phase</p>
                <p style={{ margin: 0 }}><strong>480V:</strong> US industrial 3-phase</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/amps-to-kw-converter" currentCategory="Converter" />
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
            ⚡ <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. 
            For electrical installations, always consult a licensed electrician and follow local electrical codes.
          </p>
        </div>
      </div>
    </div>
  );
}