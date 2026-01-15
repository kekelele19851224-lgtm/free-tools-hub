"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Unit options
const unitOptions = [
  { id: "ohm", label: "Ω", multiplier: 1 },
  { id: "kohm", label: "kΩ", multiplier: 1000 },
  { id: "mohm", label: "MΩ", multiplier: 1000000 }
];

// Resistor interface
interface Resistor {
  id: number;
  value: string;
  unit: string;
}

// FAQ data
const faqs = [
  {
    question: "What is the formula for resistors in parallel?",
    answer: "For resistors in parallel, the formula is: 1/Req = 1/R1 + 1/R2 + 1/R3 + ... + 1/Rn. To find the equivalent resistance, calculate the sum of the reciprocals of all resistor values, then take the reciprocal of that sum. For two resistors, you can use the simplified formula: Req = (R1 × R2) / (R1 + R2). The equivalent resistance of parallel resistors is always less than the smallest individual resistor."
  },
  {
    question: "How do you calculate 3 resistors in parallel?",
    answer: "For 3 resistors in parallel, use: 1/Req = 1/R1 + 1/R2 + 1/R3. For example, with R1=100Ω, R2=200Ω, R3=300Ω: 1/Req = 1/100 + 1/200 + 1/300 = 0.01 + 0.005 + 0.00333 = 0.01833. Therefore, Req = 1/0.01833 = 54.55Ω. Notice how the equivalent resistance (54.55Ω) is less than the smallest resistor (100Ω)."
  },
  {
    question: "Why is parallel resistance always lower than individual resistors?",
    answer: "Parallel resistance is always lower because adding resistors in parallel creates additional paths for current to flow. Think of it like adding more lanes to a highway — more lanes mean less traffic resistance. Each parallel resistor provides an additional path, allowing more total current to flow for the same voltage. Even adding a very high resistance in parallel will slightly reduce the total resistance because it still provides one more path for current."
  },
  {
    question: "How to find the missing resistor in a parallel circuit?",
    answer: "To find a missing resistor value in a parallel circuit when you know the target equivalent resistance: Rearrange the parallel formula to solve for the unknown. For two resistors: Rx = (Req × R1) / (R1 - Req). For example, if you need Req = 500Ω and have R1 = 1kΩ, then Rx = (500 × 1000) / (1000 - 500) = 500000/500 = 1000Ω. Use our 'Find Missing Resistor' tab for automatic calculation."
  },
  {
    question: "How is current divided in parallel resistors?",
    answer: "In a parallel circuit, voltage is the same across all resistors, but current divides inversely proportional to resistance. Using Ohm's Law (I = V/R), lower resistance carries more current. For example, with 12V across 100Ω and 200Ω in parallel: I1 = 12/100 = 0.12A (120mA), I2 = 12/200 = 0.06A (60mA). Total current = 0.18A. The 100Ω resistor carries twice the current because it has half the resistance."
  },
  {
    question: "What is the difference between series and parallel resistors?",
    answer: "In SERIES: Resistors are connected end-to-end, current is the same through all, voltage divides, total resistance ADDS (Rtotal = R1 + R2 + R3). In PARALLEL: Resistors share the same two nodes, voltage is the same across all, current divides, total resistance is LESS than the smallest resistor (1/Rtotal = 1/R1 + 1/R2 + 1/R3). Series increases resistance; parallel decreases it."
  },
  {
    question: "What are E24 standard resistor values?",
    answer: "E24 is a standard series of preferred resistor values with 24 values per decade (±5% tolerance). The E24 values are: 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1. These values repeat in each decade (×10, ×100, ×1k, etc.). When designing circuits, use these standard values for easier component sourcing."
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

// Format resistance with appropriate unit
function formatResistance(ohms: number): string {
  if (ohms >= 1000000) {
    return `${(ohms / 1000000).toFixed(3).replace(/\.?0+$/, '')} MΩ`;
  } else if (ohms >= 1000) {
    return `${(ohms / 1000).toFixed(3).replace(/\.?0+$/, '')} kΩ`;
  } else {
    return `${ohms.toFixed(3).replace(/\.?0+$/, '')} Ω`;
  }
}

// Format current
function formatCurrent(amps: number): string {
  if (amps >= 1) {
    return `${amps.toFixed(3).replace(/\.?0+$/, '')} A`;
  } else if (amps >= 0.001) {
    return `${(amps * 1000).toFixed(3).replace(/\.?0+$/, '')} mA`;
  } else {
    return `${(amps * 1000000).toFixed(3).replace(/\.?0+$/, '')} µA`;
  }
}

// Get resistance in ohms
function getOhms(value: string, unit: string): number {
  const numValue = parseFloat(value) || 0;
  const unitData = unitOptions.find(u => u.id === unit);
  return numValue * (unitData?.multiplier || 1);
}

export default function ParallelResistorCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"parallel" | "series" | "missing">("parallel");

  // Tab 1: Parallel - resistors list
  const [parallelResistors, setParallelResistors] = useState<Resistor[]>([
    { id: 1, value: "1000", unit: "ohm" },
    { id: 2, value: "1000", unit: "ohm" }
  ]);
  const [parallelVoltage, setParallelVoltage] = useState<string>("");

  // Tab 2: Series - resistors list
  const [seriesResistors, setSeriesResistors] = useState<Resistor[]>([
    { id: 1, value: "100", unit: "ohm" },
    { id: 2, value: "200", unit: "ohm" }
  ]);

  // Tab 3: Missing resistor
  const [targetResistance, setTargetResistance] = useState<string>("500");
  const [targetUnit, setTargetUnit] = useState<string>("ohm");
  const [knownResistors, setKnownResistors] = useState<Resistor[]>([
    { id: 1, value: "1000", unit: "ohm" }
  ]);
  const [missingCircuitType, setMissingCircuitType] = useState<"parallel" | "series">("parallel");

  // Add resistor
  const addResistor = (list: Resistor[], setList: React.Dispatch<React.SetStateAction<Resistor[]>>) => {
    if (list.length < 10) {
      setList([...list, { id: Date.now(), value: "100", unit: "ohm" }]);
    }
  };

  // Remove resistor
  const removeResistor = (list: Resistor[], setList: React.Dispatch<React.SetStateAction<Resistor[]>>, id: number) => {
    if (list.length > 1) {
      setList(list.filter(r => r.id !== id));
    }
  };

  // Update resistor
  const updateResistor = (
    list: Resistor[],
    setList: React.Dispatch<React.SetStateAction<Resistor[]>>,
    id: number,
    field: "value" | "unit",
    newValue: string
  ) => {
    setList(list.map(r => r.id === id ? { ...r, [field]: newValue } : r));
  };

  // Calculate parallel resistance
  const calcParallel = () => {
    const ohmsArray = parallelResistors.map(r => getOhms(r.value, r.unit)).filter(v => v > 0);
    if (ohmsArray.length === 0) return { equivalent: 0, currents: [], totalCurrent: 0 };

    const reciprocalSum = ohmsArray.reduce((sum, r) => sum + (1 / r), 0);
    const equivalent = reciprocalSum > 0 ? 1 / reciprocalSum : 0;

    const voltage = parseFloat(parallelVoltage) || 0;
    const currents = ohmsArray.map(r => voltage > 0 ? voltage / r : 0);
    const totalCurrent = currents.reduce((sum, i) => sum + i, 0);

    return { equivalent, currents, totalCurrent, ohmsArray };
  };

  // Calculate series resistance
  const calcSeries = () => {
    const ohmsArray = seriesResistors.map(r => getOhms(r.value, r.unit)).filter(v => v > 0);
    const total = ohmsArray.reduce((sum, r) => sum + r, 0);
    return { total, ohmsArray };
  };

  // Calculate missing resistor
  const calcMissing = () => {
    const targetOhms = getOhms(targetResistance, targetUnit);
    const knownOhmsArray = knownResistors.map(r => getOhms(r.value, r.unit)).filter(v => v > 0);

    if (targetOhms <= 0 || knownOhmsArray.length === 0) {
      return { missing: 0, valid: false, message: "Enter valid values" };
    }

    if (missingCircuitType === "parallel") {
      // For parallel: 1/Req = 1/R1 + 1/R2 + ... + 1/Rx
      // 1/Rx = 1/Req - (1/R1 + 1/R2 + ...)
      const knownReciprocalSum = knownOhmsArray.reduce((sum, r) => sum + (1 / r), 0);
      const targetReciprocal = 1 / targetOhms;
      const missingReciprocal = targetReciprocal - knownReciprocalSum;

      if (missingReciprocal <= 0) {
        return {
          missing: 0,
          valid: false,
          message: "Target resistance is too high. Known resistors already produce lower equivalent resistance."
        };
      }

      return { missing: 1 / missingReciprocal, valid: true, message: "" };
    } else {
      // For series: Req = R1 + R2 + ... + Rx
      // Rx = Req - (R1 + R2 + ...)
      const knownSum = knownOhmsArray.reduce((sum, r) => sum + r, 0);
      const missing = targetOhms - knownSum;

      if (missing <= 0) {
        return {
          missing: 0,
          valid: false,
          message: "Target resistance is too low. Known resistors already exceed the target."
        };
      }

      return { missing, valid: true, message: "" };
    }
  };

  const parallelResults = calcParallel();
  const seriesResults = calcSeries();
  const missingResults = calcMissing();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Parallel Resistor Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Parallel Resistor Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate equivalent resistance for resistors in parallel or series. Find missing resistor values 
            and calculate current distribution. Supports 2-10 resistors with automatic unit conversion.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EEF2FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A5B4FC"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#3730A3", margin: "0 0 4px 0" }}>
                Two 1kΩ resistors in parallel = <strong>500Ω</strong>
              </p>
              <p style={{ color: "#4338CA", margin: 0, fontSize: "0.95rem" }}>
                Formula: 1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ... | Parallel resistance is always <strong>less than</strong> the smallest resistor
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("parallel")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "parallel" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "parallel" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚡ Parallel
          </button>
          <button
            onClick={() => setActiveTab("series")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "series" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "series" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔗 Series
          </button>
          <button
            onClick={() => setActiveTab("missing")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "missing" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "missing" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔍 Find Missing
          </button>
        </div>

        {/* Tab 1: Parallel Calculator */}
        {activeTab === "parallel" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>⚡ Resistors in Parallel</h2>
                <button
                  onClick={() => addResistor(parallelResistors, setParallelResistors)}
                  disabled={parallelResistors.length >= 10}
                  style={{
                    backgroundColor: parallelResistors.length >= 10 ? "#9CA3AF" : "white",
                    color: parallelResistors.length >= 10 ? "#6B7280" : "#4F46E5",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontWeight: "600",
                    cursor: parallelResistors.length >= 10 ? "not-allowed" : "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  + Add ({parallelResistors.length}/10)
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Circuit Diagram */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>Parallel Circuit</p>
                  <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#4C1D95" }}>
                    ┌── R₁ ──┐<br />
                    ├── R₂ ──┤<br />
                    └── Rₙ ──┘
                  </div>
                </div>

                {/* Resistor Inputs */}
                {parallelResistors.map((resistor, index) => (
                  <div key={resistor.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    <label style={{ width: "40px", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      R{index + 1}
                    </label>
                    <input
                      type="number"
                      value={resistor.value}
                      onChange={(e) => updateResistor(parallelResistors, setParallelResistors, resistor.id, "value", e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem"
                      }}
                    />
                    <select
                      value={resistor.unit}
                      onChange={(e) => updateResistor(parallelResistors, setParallelResistors, resistor.id, "unit", e.target.value)}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {unitOptions.map(u => (
                        <option key={u.id} value={u.id}>{u.label}</option>
                      ))}
                    </select>
                    {parallelResistors.length > 2 && (
                      <button
                        onClick={() => removeResistor(parallelResistors, setParallelResistors, resistor.id)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                {/* Optional Voltage Input */}
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed #E5E7EB" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Voltage (optional, for current calculation)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="number"
                      value={parallelVoltage}
                      onChange={(e) => setParallelVoltage(e.target.value)}
                      placeholder="Enter voltage"
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem"
                      }}
                    />
                    <span style={{ color: "#6B7280", fontWeight: "600" }}>V</span>
                  </div>
                </div>
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Equivalent Resistance</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Equivalent Resistance (R<sub>eq</sub>)</p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#047857" }}>
                    {formatResistance(parallelResults.equivalent)}
                  </div>
                </div>

                {/* Formula Display */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>Formula Used:</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4C1D95", fontFamily: "monospace" }}>
                    1/R<sub>eq</sub> = {parallelResistors.map((_, i) => `1/R${i + 1}`).join(" + ")}
                  </p>
                </div>

                {/* Current Distribution (if voltage provided) */}
                {parseFloat(parallelVoltage) > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                      ⚡ Current Distribution (at {parallelVoltage}V)
                    </h3>
                    {parallelResults.currents?.map((current, index) => (
                      <div key={index} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 12px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "6px",
                        marginBottom: "6px"
                      }}>
                        <span style={{ color: "#4B5563" }}>I{index + 1} (through R{index + 1})</span>
                        <span style={{ fontWeight: "600", color: "#4F46E5" }}>{formatCurrent(current)}</span>
                      </div>
                    ))}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      backgroundColor: "#EEF2FF",
                      borderRadius: "6px",
                      marginTop: "8px",
                      border: "1px solid #A5B4FC"
                    }}>
                      <span style={{ color: "#3730A3", fontWeight: "600" }}>Total Current</span>
                      <span style={{ fontWeight: "bold", color: "#4F46E5" }}>{formatCurrent(parallelResults.totalCurrent || 0)}</span>
                    </div>
                  </div>
                )}

                {/* Individual Resistor Values */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📋 Input Values</h3>
                  {parallelResults.ohmsArray?.map((ohms, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      fontSize: "0.9rem"
                    }}>
                      <span style={{ color: "#6B7280" }}>R{index + 1}</span>
                      <span style={{ color: "#111827", fontWeight: "500" }}>{formatResistance(ohms)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Series Calculator */}
        {activeTab === "series" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔗 Resistors in Series</h2>
                <button
                  onClick={() => addResistor(seriesResistors, setSeriesResistors)}
                  disabled={seriesResistors.length >= 10}
                  style={{
                    backgroundColor: seriesResistors.length >= 10 ? "#9CA3AF" : "white",
                    color: seriesResistors.length >= 10 ? "#6B7280" : "#DC2626",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    fontWeight: "600",
                    cursor: seriesResistors.length >= 10 ? "not-allowed" : "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  + Add ({seriesResistors.length}/10)
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Circuit Diagram */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#991B1B", fontWeight: "600" }}>Series Circuit</p>
                  <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#7F1D1D" }}>
                    ──R₁──R₂──R₃──Rₙ──
                  </div>
                </div>

                {/* Resistor Inputs */}
                {seriesResistors.map((resistor, index) => (
                  <div key={resistor.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    <label style={{ width: "40px", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      R{index + 1}
                    </label>
                    <input
                      type="number"
                      value={resistor.value}
                      onChange={(e) => updateResistor(seriesResistors, setSeriesResistors, resistor.id, "value", e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem"
                      }}
                    />
                    <select
                      value={resistor.unit}
                      onChange={(e) => updateResistor(seriesResistors, setSeriesResistors, resistor.id, "unit", e.target.value)}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {unitOptions.map(u => (
                        <option key={u.id} value={u.id}>{u.label}</option>
                      ))}
                    </select>
                    {seriesResistors.length > 2 && (
                      <button
                        onClick={() => removeResistor(seriesResistors, setSeriesResistors, resistor.id)}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "none",
                          backgroundColor: "#FEE2E2",
                          color: "#DC2626",
                          cursor: "pointer",
                          fontSize: "0.9rem"
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
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
              <div style={{ backgroundColor: "#B91C1C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Total Resistance</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #FCA5A5"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#991B1B" }}>Total Resistance (R<sub>total</sub>)</p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#DC2626" }}>
                    {formatResistance(seriesResults.total)}
                  </div>
                </div>

                {/* Formula Display */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#991B1B", fontWeight: "600" }}>Formula Used:</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#7F1D1D", fontFamily: "monospace" }}>
                    R<sub>total</sub> = {seriesResistors.map((_, i) => `R${i + 1}`).join(" + ")}
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📋 Calculation</h3>
                  {seriesResults.ohmsArray?.map((ohms, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      fontSize: "0.9rem"
                    }}>
                      <span style={{ color: "#6B7280" }}>R{index + 1}</span>
                      <span style={{ color: "#111827", fontWeight: "500" }}>{formatResistance(ohms)}</span>
                    </div>
                  ))}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "10px",
                    marginTop: "10px",
                    borderTop: "1px dashed #E5E7EB"
                  }}>
                    <span style={{ color: "#DC2626", fontWeight: "600" }}>Total</span>
                    <span style={{ color: "#DC2626", fontWeight: "bold" }}>{formatResistance(seriesResults.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Find Missing Resistor */}
        {activeTab === "missing" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔍 Find Missing Resistor</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Circuit Type Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Circuit Type
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setMissingCircuitType("parallel")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: missingCircuitType === "parallel" ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: missingCircuitType === "parallel" ? "#EDE9FE" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: missingCircuitType === "parallel" ? "#7C3AED" : "#374151"
                      }}
                    >
                      ⚡ Parallel
                    </button>
                    <button
                      onClick={() => setMissingCircuitType("series")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: missingCircuitType === "series" ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: missingCircuitType === "series" ? "#EDE9FE" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: missingCircuitType === "series" ? "#7C3AED" : "#374151"
                      }}
                    >
                      🔗 Series
                    </button>
                  </div>
                </div>

                {/* Target Resistance */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Target Equivalent Resistance
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      value={targetResistance}
                      onChange={(e) => setTargetResistance(e.target.value)}
                      placeholder="Desired R eq"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "6px",
                        border: "2px solid #7C3AED",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                    />
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "6px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {unitOptions.map(u => (
                        <option key={u.id} value={u.id}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Known Resistors */}
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <label style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      Known Resistor(s)
                    </label>
                    <button
                      onClick={() => addResistor(knownResistors, setKnownResistors)}
                      disabled={knownResistors.length >= 9}
                      style={{
                        backgroundColor: knownResistors.length >= 9 ? "#9CA3AF" : "#7C3AED",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        fontWeight: "600",
                        cursor: knownResistors.length >= 9 ? "not-allowed" : "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  {knownResistors.map((resistor, index) => (
                    <div key={resistor.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px"
                    }}>
                      <label style={{ width: "40px", fontSize: "0.85rem", color: "#6B7280" }}>
                        R{index + 1}
                      </label>
                      <input
                        type="number"
                        value={resistor.value}
                        onChange={(e) => updateResistor(knownResistors, setKnownResistors, resistor.id, "value", e.target.value)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem"
                        }}
                      />
                      <select
                        value={resistor.unit}
                        onChange={(e) => updateResistor(knownResistors, setKnownResistors, resistor.id, "unit", e.target.value)}
                        style={{
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        {unitOptions.map(u => (
                          <option key={u.id} value={u.id}>{u.label}</option>
                        ))}
                      </select>
                      {knownResistors.length > 1 && (
                        <button
                          onClick={() => removeResistor(knownResistors, setKnownResistors, resistor.id)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: "#FEE2E2",
                            color: "#DC2626",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#EDE9FE",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                    💡 Enter your target resistance and known resistors. The calculator will find the missing resistor value needed to achieve your target.
                  </p>
                </div>
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
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎯 Missing Resistor</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {missingResults.valid ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#EDE9FE",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #A78BFA"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>You Need This Resistor</p>
                      <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#7C3AED" }}>
                        {formatResistance(missingResults.missing)}
                      </div>
                      <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#6D28D9" }}>
                        in {missingCircuitType} with your known resistors
                      </p>
                    </div>

                    {/* Verification */}
                    <div style={{
                      backgroundColor: "#F0FDF4",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "20px",
                      border: "1px solid #86EFAC"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#166534", fontWeight: "600" }}>✓ Verification</p>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#15803D" }}>
                        {knownResistors.map((r, i) => formatResistance(getOhms(r.value, r.unit))).join(" + ")} + <strong>{formatResistance(missingResults.missing)}</strong>
                        <br />
                        in {missingCircuitType} = <strong>{formatResistance(getOhms(targetResistance, targetUnit))}</strong> ✓
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    border: "2px solid #FCA5A5"
                  }}>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#DC2626" }}>
                      ⚠️ {missingResults.message}
                    </p>
                  </div>
                )}

                {/* How It Works */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px", marginTop: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📐 Formula Used</h3>
                  {missingCircuitType === "parallel" ? (
                    <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                      <p style={{ margin: "0 0 8px 0" }}>For parallel: 1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ... + 1/R<sub>x</sub></p>
                      <p style={{ margin: 0 }}>Solving for R<sub>x</sub>: R<sub>x</sub> = 1 / (1/R<sub>eq</sub> - 1/R<sub>1</sub> - 1/R<sub>2</sub> - ...)</p>
                    </div>
                  ) : (
                    <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                      <p style={{ margin: "0 0 8px 0" }}>For series: R<sub>eq</sub> = R<sub>1</sub> + R<sub>2</sub> + ... + R<sub>x</sub></p>
                      <p style={{ margin: 0 }}>Solving for R<sub>x</sub>: R<sub>x</sub> = R<sub>eq</sub> - R<sub>1</sub> - R<sub>2</sub> - ...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Series vs Parallel Comparison</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EEF2FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Property</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Series Circuit</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Parallel Circuit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Total Resistance</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>R<sub>T</sub> = R₁ + R₂ + R₃...</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>1/R<sub>T</sub> = 1/R₁ + 1/R₂ + 1/R₃...</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Result</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>Increases total resistance</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>Decreases total resistance</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Current</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Same through all resistors</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Divides among resistors</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Voltage</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Divides among resistors</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Same across all resistors</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Example: 100Ω + 100Ω</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "bold", color: "#DC2626" }}>200Ω</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "bold", color: "#059669" }}>50Ω</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚡ Understanding Parallel Resistors</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When resistors are connected in parallel, they share the same two nodes, meaning the 
                  <strong> voltage across each resistor is identical</strong>. However, the current divides 
                  among the parallel paths. This configuration is fundamental in electronics for power 
                  distribution, voltage regulation, and creating specific resistance values.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Parallel Resistance Decreases</h3>
                <p>
                  Adding resistors in parallel creates additional paths for current flow. Think of it like 
                  adding lanes to a highway — more lanes allow more traffic (current) to flow with less 
                  congestion (resistance). Even adding a very high resistance in parallel will slightly 
                  decrease the total resistance because it still provides an additional current path.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Parallel Resistance Formula</h3>
                <p>
                  The formula for calculating equivalent resistance of parallel resistors is:
                </p>
                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "16px",
                  borderRadius: "8px",
                  margin: "16px 0",
                  fontFamily: "monospace",
                  textAlign: "center",
                  fontSize: "1.1rem"
                }}>
                  1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + 1/R<sub>3</sub> + ... + 1/R<sub>n</sub>
                </div>
                <p>
                  For just two resistors, a simplified &quot;product over sum&quot; formula can be used:
                </p>
                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "16px",
                  borderRadius: "8px",
                  margin: "16px 0",
                  fontFamily: "monospace",
                  textAlign: "center",
                  fontSize: "1.1rem"
                }}>
                  R<sub>eq</sub> = (R<sub>1</sub> × R<sub>2</sub>) / (R<sub>1</sub> + R<sub>2</sub>)
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Practical Applications</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Creating non-standard values:</strong> Combine standard resistors to achieve a specific resistance value not available commercially.</li>
                  <li><strong>Power distribution:</strong> Spread power dissipation across multiple resistors to prevent overheating.</li>
                  <li><strong>Current limiting:</strong> In LED circuits, parallel resistors can handle higher currents than a single resistor.</li>
                  <li><strong>Redundancy:</strong> If one resistor fails open in a parallel circuit, the others continue to function.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A5B4FC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#3730A3", marginBottom: "16px" }}>⚡ Quick Examples</h3>
              <div style={{ fontSize: "0.875rem", color: "#4338CA", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>1kΩ ∥ 1kΩ = <strong>500Ω</strong></p>
                <p style={{ margin: 0 }}>100Ω ∥ 100Ω = <strong>50Ω</strong></p>
                <p style={{ margin: 0 }}>1kΩ ∥ 2kΩ = <strong>667Ω</strong></p>
                <p style={{ margin: 0 }}>10kΩ ∥ 10kΩ ∥ 10kΩ = <strong>3.33kΩ</strong></p>
              </div>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#6366F1" }}>
                ∥ symbol means &quot;in parallel with&quot;
              </p>
            </div>

            {/* E24 Values */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>📋 E24 Standard Values</h3>
              <p style={{ fontSize: "0.8rem", color: "#B45309", lineHeight: "1.8", margin: 0 }}>
                1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
              </p>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#92400E" }}>
                Multiply by 10, 100, 1k, 10k, etc.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/parallel-resistor-calculator" currentCategory="Electronics" />
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
            ⚡ <strong>Disclaimer:</strong> This calculator is for educational and reference purposes only. 
            Always verify calculations for critical applications. Results assume ideal resistors without tolerance variations.
            For precision circuits, account for resistor tolerance (±1%, ±5%, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}