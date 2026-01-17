"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Capacitance unit options
const capacitanceUnits = [
  { value: 'pF', label: 'pF', multiplier: 1e-12 },
  { value: 'nF', label: 'nF', multiplier: 1e-9 },
  { value: 'µF', label: 'µF', multiplier: 1e-6 },
  { value: 'mF', label: 'mF', multiplier: 1e-3 },
  { value: 'F', label: 'F', multiplier: 1 },
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate capacitors in series?",
    answer: "For capacitors in series, use the reciprocal formula: 1/C_total = 1/C₁ + 1/C₂ + 1/C₃ + ... Calculate the reciprocal of each capacitor value, add them together, then take the reciprocal of that sum. The total capacitance is always less than the smallest individual capacitor."
  },
  {
    question: "Why is total capacitance less in series?",
    answer: "When capacitors are connected in series, the effective plate separation increases while the charge storage ability decreases. Think of it like making the dielectric thicker - this reduces the overall capacitance. The same charge flows through all capacitors, but the voltage divides among them."
  },
  {
    question: "How do you calculate voltage across each capacitor in series?",
    answer: "The voltage across each capacitor is inversely proportional to its capacitance: V_n = V_total × (C_total / C_n). Smaller capacitors get higher voltage drops. The sum of all individual voltages equals the total applied voltage."
  },
  {
    question: "What is the formula for two capacitors in series?",
    answer: "For exactly two capacitors in series, use the simplified formula: C_total = (C₁ × C₂) / (C₁ + C₂). This is often called the 'product over sum' formula and is easier than using the reciprocal method for just two capacitors."
  },
  {
    question: "Do capacitors in series have the same charge?",
    answer: "Yes! All capacitors in series store the same charge (Q). This is because the same current flows through all of them during charging. However, the voltage across each capacitor differs based on its capacitance value (V = Q/C)."
  },
  {
    question: "When should I use capacitors in series?",
    answer: "Use series capacitors when you need: (1) Higher voltage rating - the total voltage rating increases, (2) Lower capacitance - useful for tuning circuits, (3) Voltage division - to create specific voltage drops. Series connections are common in high-voltage applications and resonant circuits."
  }
];

// Capacitor interface
interface Capacitor {
  id: number;
  value: string;
  unit: string;
}

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

// Format capacitance for display
function formatCapacitance(farads: number): string {
  if (farads === 0) return "0 F";
  
  const absValue = Math.abs(farads);
  
  if (absValue >= 1) {
    return `${farads.toPrecision(4)} F`;
  } else if (absValue >= 1e-3) {
    return `${(farads * 1e3).toPrecision(4)} mF`;
  } else if (absValue >= 1e-6) {
    return `${(farads * 1e6).toPrecision(4)} µF`;
  } else if (absValue >= 1e-9) {
    return `${(farads * 1e9).toPrecision(4)} nF`;
  } else {
    return `${(farads * 1e12).toPrecision(4)} pF`;
  }
}

export default function SeriesCapacitorCalculator() {
  const [activeTab, setActiveTab] = useState<'capacitance' | 'voltage'>('capacitance');

  // Tab 1: Capacitance Calculator state
  const [capacitors, setCapacitors] = useState<Capacitor[]>([
    { id: 1, value: '10', unit: 'µF' },
    { id: 2, value: '22', unit: 'µF' }
  ]);

  // Tab 2: Voltage Distribution state
  const [voltageCapacitors, setVoltageCapacitors] = useState<Capacitor[]>([
    { id: 1, value: '100', unit: 'nF' },
    { id: 2, value: '220', unit: 'nF' }
  ]);
  const [totalVoltage, setTotalVoltage] = useState('12');

  // Add capacitor
  const addCapacitor = (isVoltageTab: boolean) => {
    const list = isVoltageTab ? voltageCapacitors : capacitors;
    const setList = isVoltageTab ? setVoltageCapacitors : setCapacitors;
    if (list.length < 10) {
      const newId = Math.max(...list.map(c => c.id), 0) + 1;
      setList([...list, { id: newId, value: '', unit: 'µF' }]);
    }
  };

  // Remove capacitor
  const removeCapacitor = (id: number, isVoltageTab: boolean) => {
    const list = isVoltageTab ? voltageCapacitors : capacitors;
    const setList = isVoltageTab ? setVoltageCapacitors : setCapacitors;
    if (list.length > 2) {
      setList(list.filter(c => c.id !== id));
    }
  };

  // Update capacitor
  const updateCapacitor = (id: number, field: 'value' | 'unit', newValue: string, isVoltageTab: boolean) => {
    const list = isVoltageTab ? voltageCapacitors : capacitors;
    const setList = isVoltageTab ? setVoltageCapacitors : setCapacitors;
    setList(list.map(c => c.id === id ? { ...c, [field]: newValue } : c));
  };

  // Calculate total capacitance (Tab 1)
  const capacitanceResults = useMemo(() => {
    const validCapacitors = capacitors.filter(c => {
      const val = parseFloat(c.value);
      return !isNaN(val) && val > 0;
    });

    if (validCapacitors.length < 2) return null;

    // Convert all to Farads
    const capacitorsInFarads = validCapacitors.map(c => {
      const val = parseFloat(c.value);
      const unit = capacitanceUnits.find(u => u.value === c.unit);
      return {
        ...c,
        farads: val * (unit?.multiplier || 1e-6)
      };
    });

    // Calculate 1/C_total = 1/C1 + 1/C2 + ...
    const reciprocalSum = capacitorsInFarads.reduce((sum, c) => sum + (1 / c.farads), 0);
    const totalCapacitance = 1 / reciprocalSum;

    return {
      capacitors: capacitorsInFarads,
      totalCapacitance,
      reciprocalSum
    };
  }, [capacitors]);

  // Calculate voltage distribution (Tab 2)
  const voltageResults = useMemo(() => {
    const voltage = parseFloat(totalVoltage);
    if (isNaN(voltage) || voltage <= 0) return null;

    const validCapacitors = voltageCapacitors.filter(c => {
      const val = parseFloat(c.value);
      return !isNaN(val) && val > 0;
    });

    if (validCapacitors.length < 2) return null;

    // Convert all to Farads
    const capacitorsInFarads = validCapacitors.map(c => {
      const val = parseFloat(c.value);
      const unit = capacitanceUnits.find(u => u.value === c.unit);
      return {
        ...c,
        farads: val * (unit?.multiplier || 1e-6)
      };
    });

    // Calculate total capacitance
    const reciprocalSum = capacitorsInFarads.reduce((sum, c) => sum + (1 / c.farads), 0);
    const totalCapacitance = 1 / reciprocalSum;

    // Calculate charge Q = C_total * V_total
    const totalCharge = totalCapacitance * voltage;

    // Calculate voltage and energy for each capacitor
    const results = capacitorsInFarads.map(c => {
      const voltageAcross = voltage * (totalCapacitance / c.farads);
      const energy = 0.5 * c.farads * voltageAcross * voltageAcross;
      return {
        ...c,
        voltage: voltageAcross,
        charge: totalCharge,
        energy
      };
    });

    const totalEnergy = results.reduce((sum, c) => sum + c.energy, 0);

    return {
      capacitors: results,
      totalCapacitance,
      totalCharge,
      totalEnergy,
      totalVoltage: voltage
    };
  }, [voltageCapacitors, totalVoltage]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EEF2FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #C7D2FE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Series Capacitor Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Series Capacitor Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the total capacitance of capacitors connected in series. Also find voltage distribution, 
            charge, and energy stored across each capacitor in your circuit.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#C7D2FE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #818CF8"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#3730A3", margin: "0 0 4px 0" }}>
                <strong>Series Capacitor Formula:</strong>
              </p>
              <p style={{ color: "#4338CA", margin: 0, fontSize: "0.95rem", fontFamily: "monospace" }}>
                1/C<sub>total</sub> = 1/C₁ + 1/C₂ + 1/C₃ + ... (Result is always less than the smallest capacitor)
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("capacitance")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "capacitance" ? "#4F46E5" : "#C7D2FE",
              color: activeTab === "capacitance" ? "white" : "#4F46E5",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔢 Total Capacitance
          </button>
          <button
            onClick={() => setActiveTab("voltage")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "voltage" ? "#4F46E5" : "#C7D2FE",
              color: activeTab === "voltage" ? "white" : "#4F46E5",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚡ Voltage Distribution
          </button>
        </div>

        {/* Tab 1: Total Capacitance Calculator */}
        {activeTab === 'capacitance' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #C7D2FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔌 Enter Capacitor Values
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", marginTop: 0, marginBottom: "16px" }}>
                  Add 2-10 capacitors connected in series
                </p>

                {/* Capacitor Inputs */}
                {capacitors.map((cap, index) => (
                  <div key={cap.id} style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "12px",
                    flexWrap: "wrap"
                  }}>
                    <span style={{ 
                      width: "24px", 
                      height: "24px", 
                      backgroundColor: "#EEF2FF", 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#4F46E5",
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}>
                      <input
                        type="number"
                        value={cap.value}
                        onChange={(e) => updateCapacitor(cap.id, 'value', e.target.value, false)}
                        placeholder="Value"
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #C7D2FE",
                          fontSize: "1rem",
                          minWidth: "80px"
                        }}
                      />
                      <select
                        value={cap.unit}
                        onChange={(e) => updateCapacitor(cap.id, 'unit', e.target.value, false)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #C7D2FE",
                          fontSize: "1rem",
                          backgroundColor: "white",
                          minWidth: "70px"
                        }}
                      >
                        {capacitanceUnits.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                    {capacitors.length > 2 && (
                      <button
                        onClick={() => removeCapacitor(cap.id, false)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                          padding: "4px 8px",
                          fontSize: "1.25rem",
                          flexShrink: 0
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {capacitors.length < 10 && (
                  <button
                    onClick={() => addCapacitor(false)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px dashed #C7D2FE",
                      backgroundColor: "transparent",
                      color: "#4F46E5",
                      cursor: "pointer",
                      fontWeight: "500",
                      marginTop: "8px"
                    }}
                  >
                    + Add Capacitor
                  </button>
                )}

                {/* Formula Display */}
                <div style={{
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>
                    Formula Used:
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6D28D9", fontFamily: "monospace" }}>
                    1/C<sub>total</sub> = 1/C₁ + 1/C₂ + ...
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #C7D2FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {capacitanceResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#EEF2FF",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #4F46E5"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6366F1" }}>
                        Total Capacitance
                      </p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#4F46E5" }}>
                        {formatCapacitance(capacitanceResults.totalCapacitance)}
                      </p>
                    </div>

                    {/* Calculation Steps */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        Calculation Steps:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {capacitanceResults.capacitors.map((cap, index) => (
                          <div key={cap.id} style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            padding: "10px 12px", 
                            backgroundColor: "#F9FAFB", 
                            borderRadius: "6px",
                            fontSize: "0.9rem"
                          }}>
                            <span style={{ color: "#4B5563" }}>1/C{index + 1}</span>
                            <span style={{ fontWeight: "500", color: "#111827", fontFamily: "monospace" }}>
                              1/{cap.value} {cap.unit} = {(1/cap.farads).toExponential(4)}
                            </span>
                          </div>
                        ))}
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          padding: "10px 12px", 
                          backgroundColor: "#DBEAFE", 
                          borderRadius: "6px",
                          fontSize: "0.9rem"
                        }}>
                          <span style={{ color: "#1E40AF" }}>Sum of reciprocals</span>
                          <span style={{ fontWeight: "600", color: "#1E40AF", fontFamily: "monospace" }}>
                            {capacitanceResults.reciprocalSum.toExponential(4)}
                          </span>
                        </div>
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          padding: "10px 12px", 
                          backgroundColor: "#DCFCE7", 
                          borderRadius: "6px",
                          fontSize: "0.9rem"
                        }}>
                          <span style={{ color: "#166534" }}>C<sub>total</sub> = 1 / sum</span>
                          <span style={{ fontWeight: "600", color: "#166534" }}>
                            {formatCapacitance(capacitanceResults.totalCapacitance)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Insight */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        💡 <strong>Note:</strong> The total capacitance ({formatCapacitance(capacitanceResults.totalCapacitance)}) is less than the smallest capacitor in the series.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>⚡</p>
                    <p style={{ margin: 0 }}>Enter at least 2 capacitor values to calculate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voltage Distribution Calculator */}
        {activeTab === 'voltage' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #C7D2FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚡ Voltage & Capacitors
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Total Voltage Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Applied Voltage (V)
                  </label>
                  <input
                    type="number"
                    value={totalVoltage}
                    onChange={(e) => setTotalVoltage(e.target.value)}
                    placeholder="e.g., 12"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #C7D2FE",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <p style={{ fontSize: "0.85rem", color: "#6B7280", marginTop: 0, marginBottom: "16px" }}>
                  Enter capacitor values (2-10 capacitors)
                </p>

                {/* Capacitor Inputs */}
                {voltageCapacitors.map((cap, index) => (
                  <div key={cap.id} style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "12px",
                    flexWrap: "wrap"
                  }}>
                    <span style={{ 
                      width: "24px", 
                      height: "24px", 
                      backgroundColor: "#EEF2FF", 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#4F46E5",
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </span>
                    <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "200px" }}>
                      <input
                        type="number"
                        value={cap.value}
                        onChange={(e) => updateCapacitor(cap.id, 'value', e.target.value, true)}
                        placeholder="Value"
                        style={{
                          flex: 1,
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #C7D2FE",
                          fontSize: "1rem",
                          minWidth: "80px"
                        }}
                      />
                      <select
                        value={cap.unit}
                        onChange={(e) => updateCapacitor(cap.id, 'unit', e.target.value, true)}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "8px",
                          border: "1px solid #C7D2FE",
                          fontSize: "1rem",
                          backgroundColor: "white",
                          minWidth: "70px"
                        }}
                      >
                        {capacitanceUnits.map(unit => (
                          <option key={unit.value} value={unit.value}>{unit.label}</option>
                        ))}
                      </select>
                    </div>
                    {voltageCapacitors.length > 2 && (
                      <button
                        onClick={() => removeCapacitor(cap.id, true)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#EF4444",
                          cursor: "pointer",
                          padding: "4px 8px",
                          fontSize: "1.25rem",
                          flexShrink: 0
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                {voltageCapacitors.length < 10 && (
                  <button
                    onClick={() => addCapacitor(true)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px dashed #C7D2FE",
                      backgroundColor: "transparent",
                      color: "#4F46E5",
                      cursor: "pointer",
                      fontWeight: "500",
                      marginTop: "8px"
                    }}
                  >
                    + Add Capacitor
                  </button>
                )}

                {/* Formula Display */}
                <div style={{
                  marginTop: "24px",
                  padding: "16px",
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>
                    Voltage Formula:
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6D28D9", fontFamily: "monospace" }}>
                    V<sub>n</sub> = V<sub>total</sub> × (C<sub>total</sub> / C<sub>n</sub>)
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #C7D2FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Voltage Distribution
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {voltageResults ? (
                  <>
                    {/* Summary Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      <div style={{
                        backgroundColor: "#EEF2FF",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#6366F1" }}>Total Capacitance</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#4F46E5" }}>
                          {formatCapacitance(voltageResults.totalCapacitance)}
                        </p>
                      </div>
                      <div style={{
                        backgroundColor: "#FEF3C7",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#D97706" }}>Total Charge (Q)</p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                          {(voltageResults.totalCharge * 1e6).toPrecision(4)} µC
                        </p>
                      </div>
                    </div>

                    {/* Per-Capacitor Results */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        Results for Each Capacitor:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {voltageResults.capacitors.map((cap, index) => (
                          <div key={cap.id} style={{
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                            padding: "16px",
                            border: "1px solid #E5E7EB"
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <span style={{ fontWeight: "600", color: "#4F46E5" }}>
                                C{index + 1}: {cap.value} {cap.unit}
                              </span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                              <div>
                                <p style={{ margin: 0, color: "#6B7280" }}>Voltage</p>
                                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#DC2626" }}>
                                  {cap.voltage.toFixed(3)} V
                                </p>
                              </div>
                              <div>
                                <p style={{ margin: 0, color: "#6B7280" }}>Charge</p>
                                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#059669" }}>
                                  {(cap.charge * 1e6).toPrecision(3)} µC
                                </p>
                              </div>
                              <div>
                                <p style={{ margin: 0, color: "#6B7280" }}>Energy</p>
                                <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#7C3AED" }}>
                                  {(cap.energy * 1e6).toPrecision(3)} µJ
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Voltage Verification */}
                    <div style={{
                      backgroundColor: "#DCFCE7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #86EFAC"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
                        ✓ <strong>Verification:</strong> Sum of voltages = {voltageResults.capacitors.reduce((sum, c) => sum + c.voltage, 0).toFixed(3)} V (equals applied voltage of {voltageResults.totalVoltage} V)
                      </p>
                    </div>

                    {/* Total Energy */}
                    <div style={{
                      marginTop: "12px",
                      backgroundColor: "#F5F3FF",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #DDD6FE"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                        ⚡ <strong>Total Energy Stored:</strong> {(voltageResults.totalEnergy * 1e6).toPrecision(4)} µJ
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>⚡</p>
                    <p style={{ margin: 0 }}>Enter voltage and at least 2 capacitor values</p>
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #C7D2FE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ⚡ How to Calculate Capacitors in Series
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  When capacitors are connected in series, the total capacitance decreases. This is the opposite 
                  of resistors, where series connection increases total resistance. Understanding this relationship 
                  is essential for circuit design and analysis.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Series Capacitor Formula</h3>
                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #C7D2FE",
                  fontFamily: "monospace",
                  textAlign: "center"
                }}>
                  <p style={{ margin: 0, fontSize: "1.1rem", color: "#4F46E5" }}>
                    1/C<sub>total</sub> = 1/C₁ + 1/C₂ + 1/C₃ + ...
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Example Calculation</h3>
                <p>
                  Let&apos;s calculate the total capacitance of two capacitors in series: 10 µF and 22 µF.
                </p>
                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ margin: 0, color: "#5B21B6", lineHeight: "2", fontFamily: "monospace" }}>
                    1/C<sub>total</sub> = 1/10 + 1/22<br/>
                    1/C<sub>total</sub> = 0.1 + 0.0455 = 0.1455<br/>
                    C<sub>total</sub> = 1/0.1455 = <strong>6.87 µF</strong>
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Does Capacitance Decrease?</h3>
                <p>
                  In a series connection, the same charge (Q) accumulates on each capacitor, but the voltage 
                  divides among them. Since capacitance is defined as C = Q/V, and the total voltage increases 
                  while charge stays the same, the effective capacitance decreases.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Voltage Distribution in Series Capacitors</h3>
                <p>
                  The voltage across each capacitor is inversely proportional to its capacitance. Smaller 
                  capacitors receive higher voltage drops:
                </p>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FCD34D",
                  fontFamily: "monospace",
                  textAlign: "center"
                }}>
                  <p style={{ margin: 0, fontSize: "1rem", color: "#92400E" }}>
                    V<sub>n</sub> = V<sub>total</sub> × (C<sub>total</sub> / C<sub>n</sub>)
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Series vs Parallel Capacitors</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginTop: "12px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#EEF2FF" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #C7D2FE" }}>Property</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #C7D2FE" }}>Series</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #C7D2FE" }}>Parallel</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Total Capacitance</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Decreases</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Increases</td>
                      </tr>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Charge (Q)</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Same on all</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Divides</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Voltage</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Divides</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>Same on all</td>
                      </tr>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Formula</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontFamily: "monospace" }}>1/C = Σ(1/Cₙ)</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontFamily: "monospace" }}>C = ΣCₙ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4F46E5", marginBottom: "16px" }}>📋 Quick Formulas</h3>
              <div style={{ fontSize: "0.9rem", color: "#4338CA", lineHeight: "2.2", fontFamily: "monospace" }}>
                <p style={{ margin: 0 }}>• 1/C = 1/C₁ + 1/C₂ + ...</p>
                <p style={{ margin: 0 }}>• Two caps: C = C₁C₂/(C₁+C₂)</p>
                <p style={{ margin: 0 }}>• Equal caps: C = C/n</p>
                <p style={{ margin: 0 }}>• Q = C<sub>total</sub> × V</p>
                <p style={{ margin: 0 }}>• E = ½CV²</p>
              </div>
            </div>

            {/* Did You Know */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: 0 }}>
                  Series capacitors are commonly used in high-voltage applications to increase the overall 
                  voltage rating beyond what a single capacitor can handle.
                </p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/series-capacitor-calculator" currentCategory="Electronics" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #C7D2FE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#EEF2FF", borderRadius: "8px", border: "1px solid #C7D2FE" }}>
          <p style={{ fontSize: "0.75rem", color: "#4F46E5", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides theoretical values for ideal capacitors. 
            Real-world capacitors may have tolerances, leakage currents, and ESR that affect actual circuit performance. 
            Always verify calculations for critical applications.
          </p>
        </div>
      </div>
    </div>
  );
}