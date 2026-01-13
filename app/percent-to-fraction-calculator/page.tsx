"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common conversions table
const commonConversions = [
  { percent: 1, fraction: "1/100", decimal: "0.01" },
  { percent: 5, fraction: "1/20", decimal: "0.05" },
  { percent: 10, fraction: "1/10", decimal: "0.1" },
  { percent: 12.5, fraction: "1/8", decimal: "0.125" },
  { percent: 20, fraction: "1/5", decimal: "0.2" },
  { percent: 25, fraction: "1/4", decimal: "0.25" },
  { percent: 30, fraction: "3/10", decimal: "0.3" },
  { percent: 33.33, fraction: "1/3", decimal: "0.333..." },
  { percent: 40, fraction: "2/5", decimal: "0.4" },
  { percent: 50, fraction: "1/2", decimal: "0.5" },
  { percent: 60, fraction: "3/5", decimal: "0.6" },
  { percent: 66.67, fraction: "2/3", decimal: "0.666..." },
  { percent: 70, fraction: "7/10", decimal: "0.7" },
  { percent: 75, fraction: "3/4", decimal: "0.75" },
  { percent: 80, fraction: "4/5", decimal: "0.8" },
  { percent: 83.33, fraction: "5/6", decimal: "0.833..." },
  { percent: 87.5, fraction: "7/8", decimal: "0.875" },
  { percent: 90, fraction: "9/10", decimal: "0.9" },
  { percent: 100, fraction: "1", decimal: "1" },
  { percent: 125, fraction: "5/4 (1¼)", decimal: "1.25" },
  { percent: 150, fraction: "3/2 (1½)", decimal: "1.5" },
  { percent: 200, fraction: "2", decimal: "2" },
];

// FAQ data
const faqs = [
  {
    question: "How do you convert a percent to a fraction?",
    answer: "To convert a percent to a fraction: 1) Remove the % symbol. 2) Write the number over 100. 3) Simplify by finding the Greatest Common Factor (GCF) of the numerator and denominator. For example, 75% = 75/100. The GCF of 75 and 100 is 25, so 75÷25 / 100÷25 = 3/4."
  },
  {
    question: "What is 12.5% as a fraction?",
    answer: "12.5% = 1/8. Here's how: 12.5/100 → multiply both by 10 to remove decimal → 125/1000 → divide both by GCF (125) → 1/8."
  },
  {
    question: "What is 33.33% as a fraction?",
    answer: "33.33% (or 33⅓%) = 1/3. The repeating decimal 0.333... represents exactly one-third. Similarly, 66.67% (66⅔%) = 2/3."
  },
  {
    question: "What is 75% in simplest form?",
    answer: "75% in simplest fraction form is 3/4. Start with 75/100, find the GCF which is 25, then divide both numbers by 25 to get 3/4."
  },
  {
    question: "How do you convert a fraction to a percent?",
    answer: "To convert a fraction to a percent: Divide the numerator by the denominator, then multiply by 100. For example, 3/4 = 3 ÷ 4 = 0.75 × 100 = 75%."
  },
  {
    question: "What is 66.67% as a fraction?",
    answer: "66.67% (or 66⅔%) = 2/3. This is because 2 ÷ 3 = 0.6666... which equals 66.67% when rounded to two decimal places."
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

// GCD function
function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Count decimal places
function countDecimals(num: number): number {
  if (Math.floor(num) === num) return 0;
  const str = num.toString();
  if (str.includes('e-')) {
    return parseInt(str.split('e-')[1]);
  }
  return str.split('.')[1]?.length || 0;
}

// Percent to Fraction conversion
function percentToFraction(percent: number): { 
  numerator: number; 
  denominator: number; 
  wholePart: number;
  steps: string[];
} {
  const steps: string[] = [];
  
  // Step 1: Write as fraction over 100
  let numerator = percent;
  let denominator = 100;
  steps.push(`Write ${percent}% as a fraction: ${percent}/100`);
  
  // Step 2: Handle decimals
  const decimalPlaces = countDecimals(percent);
  if (decimalPlaces > 0) {
    const multiplier = Math.pow(10, decimalPlaces);
    numerator = Math.round(percent * multiplier);
    denominator = 100 * multiplier;
    steps.push(`Remove decimal: multiply both by ${multiplier} → ${numerator}/${denominator}`);
  }
  
  // Step 3: Find GCD and simplify
  const divisor = gcd(numerator, denominator);
  if (divisor > 1) {
    steps.push(`Find GCD of ${numerator} and ${denominator} = ${divisor}`);
    numerator = numerator / divisor;
    denominator = denominator / divisor;
    steps.push(`Simplify: ${numerator * divisor}÷${divisor} / ${denominator * divisor}÷${divisor} = ${numerator}/${denominator}`);
  } else {
    steps.push(`Already in simplest form: ${numerator}/${denominator}`);
  }
  
  // Handle mixed numbers (if > 100%)
  let wholePart = 0;
  if (numerator >= denominator) {
    wholePart = Math.floor(numerator / denominator);
    const remainder = numerator % denominator;
    if (remainder === 0) {
      steps.push(`Result: ${wholePart} (whole number)`);
    } else {
      steps.push(`Convert to mixed number: ${wholePart} ${remainder}/${denominator}`);
    }
    numerator = remainder;
  }
  
  return { numerator, denominator, wholePart, steps };
}

// Fraction to Percent conversion
function fractionToPercent(numerator: number, denominator: number): {
  percent: number;
  steps: string[];
} {
  const steps: string[] = [];
  
  if (denominator === 0) {
    return { percent: 0, steps: ["Cannot divide by zero"] };
  }
  
  // Step 1: Divide
  const decimal = numerator / denominator;
  steps.push(`Divide numerator by denominator: ${numerator} ÷ ${denominator} = ${decimal.toFixed(6).replace(/\.?0+$/, '')}`);
  
  // Step 2: Multiply by 100
  const percent = decimal * 100;
  steps.push(`Multiply by 100: ${decimal.toFixed(6).replace(/\.?0+$/, '')} × 100 = ${percent.toFixed(4).replace(/\.?0+$/, '')}%`);
  
  return { percent, steps };
}

export default function PercentToFractionCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"toFraction" | "toPercent" | "table">("toFraction");
  
  // Percent to Fraction state
  const [percentInput, setPercentInput] = useState<string>("75");
  
  // Fraction to Percent state
  const [numeratorInput, setNumeratorInput] = useState<string>("3");
  const [denominatorInput, setDenominatorInput] = useState<string>("4");
  
  // Table search
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Calculations
  const percentNum = parseFloat(percentInput) || 0;
  const fractionResult = percentToFraction(percentNum);
  const decimalValue = percentNum / 100;
  
  const numeratorNum = parseFloat(numeratorInput) || 0;
  const denominatorNum = parseFloat(denominatorInput) || 1;
  const percentResult = fractionToPercent(numeratorNum, denominatorNum);
  
  // Filtered table
  const filteredConversions = commonConversions.filter(item => 
    item.percent.toString().includes(searchTerm) ||
    item.fraction.includes(searchTerm) ||
    item.decimal.includes(searchTerm)
  );

  const tabs = [
    { id: "toFraction", label: "% → Fraction", icon: "🔢" },
    { id: "toPercent", label: "Fraction → %", icon: "📊" },
    { id: "table", label: "Conversion Table", icon: "📋" }
  ];

  // Format fraction display
  const formatFraction = () => {
    if (fractionResult.wholePart > 0 && fractionResult.numerator === 0) {
      return fractionResult.wholePart.toString();
    } else if (fractionResult.wholePart > 0) {
      return `${fractionResult.wholePart} ${fractionResult.numerator}/${fractionResult.denominator}`;
    } else if (fractionResult.numerator === 0) {
      return "0";
    } else {
      return `${fractionResult.numerator}/${fractionResult.denominator}`;
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
            <span style={{ color: "#111827" }}>Percent to Fraction Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🔢</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Percent to Fraction Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Convert percentages to fractions and fractions to percentages. Shows step-by-step solution 
            and simplifies to the lowest terms automatically.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EEF2FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #C7D2FE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#4338CA", margin: "0 0 4px 0" }}>Quick Method</p>
              <p style={{ color: "#4F46E5", margin: 0, fontSize: "0.95rem" }}>
                <strong>% to Fraction:</strong> Put the number over 100, then simplify. Example: 75% = 75/100 = <strong>3/4</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#6366F1" : "#E5E7EB",
                color: activeTab === tab.id ? "white" : "#374151",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#6366F1", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "toFraction" && "🔢 Enter Percentage"}
                {activeTab === "toPercent" && "📊 Enter Fraction"}
                {activeTab === "table" && "📋 Search Table"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "toFraction" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Percentage Value
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="number"
                        step="any"
                        value={percentInput}
                        onChange={(e) => setPercentInput(e.target.value)}
                        placeholder="e.g., 75"
                        style={{
                          flex: 1,
                          padding: "14px",
                          borderRadius: "8px",
                          border: "2px solid #E5E7EB",
                          fontSize: "1.25rem",
                          textAlign: "center"
                        }}
                      />
                      <span style={{ fontSize: "1.5rem", color: "#6366F1", fontWeight: "bold" }}>%</span>
                    </div>
                  </div>

                  {/* Quick Examples */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>Quick examples:</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[25, 50, 75, 12.5, 33.33, 66.67].map(val => (
                        <button
                          key={val}
                          onClick={() => setPercentInput(val.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: percentInput === val.toString() ? "#EEF2FF" : "white",
                            color: "#4F46E5",
                            fontSize: "0.85rem",
                            cursor: "pointer"
                          }}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      💡 Supports decimals like 12.5%, 33.33%, 66.67%, etc.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "toPercent" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Enter Fraction
                    </label>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                      <input
                        type="number"
                        value={numeratorInput}
                        onChange={(e) => setNumeratorInput(e.target.value)}
                        placeholder="3"
                        style={{
                          width: "100px",
                          padding: "14px",
                          borderRadius: "8px",
                          border: "2px solid #E5E7EB",
                          fontSize: "1.25rem",
                          textAlign: "center"
                        }}
                      />
                      <div style={{ 
                        width: "40px", 
                        height: "3px", 
                        backgroundColor: "#6366F1",
                        transform: "rotate(-60deg)"
                      }} />
                      <input
                        type="number"
                        value={denominatorInput}
                        onChange={(e) => setDenominatorInput(e.target.value)}
                        placeholder="4"
                        style={{
                          width: "100px",
                          padding: "14px",
                          borderRadius: "8px",
                          border: "2px solid #E5E7EB",
                          fontSize: "1.25rem",
                          textAlign: "center"
                        }}
                      />
                    </div>
                    <div style={{ textAlign: "center", marginTop: "8px", fontSize: "0.85rem", color: "#6B7280" }}>
                      Numerator / Denominator
                    </div>
                  </div>

                  {/* Quick Examples */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>Quick examples:</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[{n:1,d:2}, {n:1,d:4}, {n:3,d:4}, {n:1,d:3}, {n:2,d:3}, {n:1,d:8}].map(val => (
                        <button
                          key={`${val.n}/${val.d}`}
                          onClick={() => { setNumeratorInput(val.n.toString()); setDenominatorInput(val.d.toString()); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                            color: "#4F46E5",
                            fontSize: "0.85rem",
                            cursor: "pointer"
                          }}
                        >
                          {val.n}/{val.d}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "table" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="e.g., 25, 1/4, 0.25"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Mini Table in Input Panel */}
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#EEF2FF" }}>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>%</th>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Fraction</th>
                          <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Decimal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConversions.map((row, idx) => (
                          <tr key={row.percent} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{row.percent}%</td>
                            <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6366F1", fontWeight: "600" }}>{row.fraction}</td>
                            <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.decimal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
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
            <div style={{ backgroundColor: "#10B981", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "toFraction" && "✅ Result: Fraction"}
                {activeTab === "toPercent" && "✅ Result: Percentage"}
                {activeTab === "table" && "📖 How to Convert"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "toFraction" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #10B981",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {percentInput}% as a fraction is
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {formatFraction()}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      Decimal: {decimalValue.toFixed(6).replace(/\.?0+$/, '')}
                    </p>
                  </div>

                  {/* Steps */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📝 Step-by-Step Solution</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      {fractionResult.steps.map((step, idx) => (
                        <div key={idx} style={{ 
                          padding: "8px 12px", 
                          backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          border: "1px solid #E5E7EB"
                        }}>
                          <span style={{ color: "#6366F1", fontWeight: "600" }}>Step {idx + 1}:</span> {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formula */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                      <strong>Formula:</strong> n% = n/100, then simplify using GCD
                    </p>
                  </div>
                </>
              )}

              {activeTab === "toPercent" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #10B981",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {numeratorInput}/{denominatorInput} as a percentage is
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {percentResult.percent.toFixed(4).replace(/\.?0+$/, '')}%
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      Decimal: {(percentResult.percent / 100).toFixed(6).replace(/\.?0+$/, '')}
                    </p>
                  </div>

                  {/* Steps */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📝 Step-by-Step Solution</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      {percentResult.steps.map((step, idx) => (
                        <div key={idx} style={{ 
                          padding: "8px 12px", 
                          backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB",
                          borderRadius: "6px",
                          marginBottom: "4px",
                          border: "1px solid #E5E7EB"
                        }}>
                          <span style={{ color: "#6366F1", fontWeight: "600" }}>Step {idx + 1}:</span> {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formula */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                      <strong>Formula:</strong> (Numerator ÷ Denominator) × 100 = %
                    </p>
                  </div>
                </>
              )}

              {activeTab === "table" && (
                <>
                  {/* Method 1 */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#065F46", fontSize: "1rem" }}>% → Fraction</h4>
                    <ol style={{ margin: 0, paddingLeft: "20px", color: "#047857", fontSize: "0.9rem", lineHeight: "1.8" }}>
                      <li>Remove the % symbol</li>
                      <li>Write the number over 100</li>
                      <li>Simplify by dividing by GCD</li>
                    </ol>
                    <div style={{ marginTop: "12px", padding: "8px 12px", backgroundColor: "white", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <strong>Example:</strong> 75% → 75/100 → GCD=25 → <strong>3/4</strong>
                    </div>
                  </div>

                  {/* Method 2 */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#4338CA", fontSize: "1rem" }}>Fraction → %</h4>
                    <ol style={{ margin: 0, paddingLeft: "20px", color: "#4F46E5", fontSize: "0.9rem", lineHeight: "1.8" }}>
                      <li>Divide numerator by denominator</li>
                      <li>Multiply the result by 100</li>
                      <li>Add the % symbol</li>
                    </ol>
                    <div style={{ marginTop: "12px", padding: "8px 12px", backgroundColor: "white", borderRadius: "6px", fontSize: "0.85rem" }}>
                      <strong>Example:</strong> 3/4 → 3÷4=0.75 → 0.75×100 = <strong>75%</strong>
                    </div>
                  </div>

                  {/* Decimal Percentages */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.9rem" }}>💡 Decimal Percentages</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309" }}>
                      For 12.5%, multiply both parts by 10: 12.5/100 → 125/1000 → <strong>1/8</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Full Conversion Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#6366F1", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Common Percent to Fraction Conversions</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EEF2FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Percent</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Fraction</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Decimal</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Percent</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Fraction</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Decimal</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(commonConversions.length / 2) }).map((_, idx) => {
                  const left = commonConversions[idx * 2];
                  const right = commonConversions[idx * 2 + 1];
                  return (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{left?.percent}%</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6366F1", fontWeight: "600" }}>{left?.fraction}</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{left?.decimal}</td>
                      {right ? (
                        <>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{right.percent}%</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6366F1", fontWeight: "600" }}>{right.fraction}</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{right.decimal}</td>
                        </>
                      ) : (
                        <>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}></td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}></td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}></td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🔢 How to Convert Percent to Fraction</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The Simple Method</h3>
                <p>
                  Converting a percentage to a fraction is straightforward: <strong>divide by 100 and simplify</strong>. 
                  The word &quot;percent&quot; literally means &quot;per hundred,&quot; so 75% is the same as 75 per 100, or 75/100.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Handling Decimal Percentages</h3>
                <p>
                  For percentages with decimals like 12.5%, multiply both the numerator and denominator by 10 
                  (or 100, 1000) until you have whole numbers. Then simplify as usual.
                </p>
                <p>
                  <strong>Example:</strong> 12.5% = 12.5/100 = 125/1000 = 1/8
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Percentages Over 100%</h3>
                <p>
                  When a percentage exceeds 100%, the fraction will be improper (numerator larger than denominator). 
                  You can convert this to a mixed number for easier understanding.
                </p>
                <p>
                  <strong>Example:</strong> 150% = 150/100 = 3/2 = 1½
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4338CA", marginBottom: "16px" }}>⚡ Quick Reference</h3>
              <div style={{ fontSize: "0.85rem", color: "#4F46E5", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>25% = <strong>1/4</strong></p>
                <p style={{ margin: 0 }}>33.33% = <strong>1/3</strong></p>
                <p style={{ margin: 0 }}>50% = <strong>1/2</strong></p>
                <p style={{ margin: 0 }}>66.67% = <strong>2/3</strong></p>
                <p style={{ margin: 0 }}>75% = <strong>3/4</strong></p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Always simplify to lowest terms</p>
                <p style={{ margin: "0 0 8px 0" }}>• 33⅓% and 66⅔% are exact thirds</p>
                <p style={{ margin: "0 0 8px 0" }}>• GCD helps find simplest form</p>
                <p style={{ margin: 0 }}>• Decimals × 10 until whole numbers</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/percent-to-fraction-calculator" currentCategory="Math" />
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
            🔢 <strong>Note:</strong> This calculator automatically simplifies fractions to their lowest terms 
            using the Greatest Common Divisor (GCD). Results are mathematically accurate.
          </p>
        </div>
      </div>
    </div>
  );
}