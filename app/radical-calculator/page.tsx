"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Perfect squares for reference
const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];
const perfectCubes = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000];

// FAQ data
const faqs = [
  {
    question: "How do I simplify a radical expression?",
    answer: "To simplify a radical: 1) Find the prime factorization of the number under the radical. 2) Group the factors based on the index (pairs for square roots, triplets for cube roots). 3) Move complete groups outside the radical. 4) Multiply remaining factors inside. For example, √72 = √(36 × 2) = √36 × √2 = 6√2."
  },
  {
    question: "What is the radical of 32?",
    answer: "√32 simplifies to 4√2. Here's why: 32 = 16 × 2, and √16 = 4. So √32 = √(16 × 2) = √16 × √2 = 4√2. The decimal value is approximately 5.657."
  },
  {
    question: "How do I know if a radical can be simplified?",
    answer: "A radical can be simplified if the number under it has a perfect square factor (for square roots) or perfect cube factor (for cube roots). Check if the radicand is divisible by 4, 9, 16, 25, 36, etc. If yes, you can simplify it."
  },
  {
    question: "What is the difference between √ and ³√?",
    answer: "√ (square root) asks 'what number times itself equals this?' For example, √9 = 3 because 3 × 3 = 9. ³√ (cube root) asks 'what number times itself three times equals this?' For example, ³√8 = 2 because 2 × 2 × 2 = 8."
  },
  {
    question: "Can you add or subtract radicals?",
    answer: "You can only add or subtract radicals with the same radicand (number under the radical). For example: 3√5 + 2√5 = 5√5. But 3√5 + 2√3 cannot be combined because the radicands (5 and 3) are different. This is similar to combining like terms in algebra."
  },
  {
    question: "How do you multiply radicals?",
    answer: "To multiply radicals with the same index, multiply the numbers under the radicals: √a × √b = √(ab). For example: √3 × √12 = √36 = 6. If there are coefficients, multiply them separately: 2√3 × 4√5 = 8√15."
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

// Prime factorization function
function primeFactorize(n: number): number[] {
  const factors: number[] = [];
  let num = Math.abs(Math.floor(n));
  
  if (num <= 1) return [num];
  
  for (let i = 2; i <= Math.sqrt(num); i++) {
    while (num % i === 0) {
      factors.push(i);
      num = num / i;
    }
  }
  if (num > 1) factors.push(num);
  
  return factors;
}

// Simplify radical function
function simplifyRadical(radicand: number, index: number): { coefficient: number; remainingRadicand: number; steps: string[] } {
  const steps: string[] = [];
  
  if (radicand <= 0) {
    return { coefficient: 0, remainingRadicand: radicand, steps: ["Cannot simplify non-positive numbers for real roots"] };
  }
  
  if (radicand === 1) {
    return { coefficient: 1, remainingRadicand: 1, steps: ["The root of 1 is 1"] };
  }
  
  // Get prime factorization
  const factors = primeFactorize(radicand);
  steps.push(`Prime factorization of ${radicand}: ${factors.join(" × ")}`);
  
  // Count occurrences of each factor
  const factorCounts: { [key: number]: number } = {};
  factors.forEach(f => {
    factorCounts[f] = (factorCounts[f] || 0) + 1;
  });
  
  // Extract groups based on index
  let coefficient = 1;
  let remainingRadicand = 1;
  const extractedFactors: string[] = [];
  const remainingFactors: string[] = [];
  
  Object.entries(factorCounts).forEach(([factor, count]) => {
    const f = parseInt(factor);
    const groups = Math.floor(count / index);
    const remainder = count % index;
    
    if (groups > 0) {
      coefficient *= Math.pow(f, groups);
      extractedFactors.push(`${f}${groups > 1 ? `^${groups}` : ''}`);
    }
    if (remainder > 0) {
      remainingRadicand *= Math.pow(f, remainder);
      remainingFactors.push(remainder > 1 ? `${f}^${remainder}` : `${f}`);
    }
  });
  
  if (extractedFactors.length > 0) {
    const rootSymbol = index === 2 ? "√" : index === 3 ? "∛" : `${index}√`;
    steps.push(`Group factors in ${index === 2 ? 'pairs' : index === 3 ? 'triplets' : `groups of ${index}`}`);
    steps.push(`Extract: ${extractedFactors.join(" × ")} = ${coefficient}`);
    if (remainingFactors.length > 0) {
      steps.push(`Remaining under radical: ${remainingFactors.join(" × ")} = ${remainingRadicand}`);
    }
    steps.push(`Result: ${coefficient}${rootSymbol}${remainingRadicand === 1 ? '' : remainingRadicand}`);
  } else {
    steps.push(`No complete groups of ${index} factors found`);
    steps.push(`${radicand} cannot be simplified further`);
    remainingRadicand = radicand;
  }
  
  return { coefficient, remainingRadicand, steps };
}

export default function RadicalCalculator() {
  const [activeTab, setActiveTab] = useState<'simplify' | 'evaluate' | 'operations'>('simplify');

  // Tab 1: Simplify state
  const [simplifyRadicand, setSimplifyRadicand] = useState('72');
  const [simplifyIndex, setSimplifyIndex] = useState(2);

  // Tab 2: Evaluate state
  const [evaluateRadicand, setEvaluateRadicand] = useState('64');
  const [evaluateIndex, setEvaluateIndex] = useState(2);

  // Tab 3: Operations state
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [coef1, setCoef1] = useState('3');
  const [rad1, setRad1] = useState('5');
  const [coef2, setCoef2] = useState('2');
  const [rad2, setRad2] = useState('5');

  // Simplify results
  const simplifyResults = useMemo(() => {
    const radicand = parseFloat(simplifyRadicand);
    if (isNaN(radicand) || radicand <= 0) return null;
    
    return simplifyRadical(radicand, simplifyIndex);
  }, [simplifyRadicand, simplifyIndex]);

  // Evaluate results
  const evaluateResults = useMemo(() => {
    const radicand = parseFloat(evaluateRadicand);
    if (isNaN(radicand)) return null;
    
    if (radicand < 0 && evaluateIndex % 2 === 0) {
      return { exact: null, decimal: null, error: "Cannot take even root of negative number" };
    }
    
    const decimal = radicand >= 0 
      ? Math.pow(radicand, 1 / evaluateIndex)
      : -Math.pow(Math.abs(radicand), 1 / evaluateIndex);
    
    // Check if it's a perfect root
    const rounded = Math.round(decimal);
    const isPerfect = Math.abs(Math.pow(rounded, evaluateIndex) - radicand) < 0.0001;
    
    return {
      exact: isPerfect ? rounded : null,
      decimal: decimal,
      error: null
    };
  }, [evaluateRadicand, evaluateIndex]);

  // Operations results
  const operationsResults = useMemo(() => {
    const c1 = parseFloat(coef1) || 0;
    const r1 = parseFloat(rad1) || 0;
    const c2 = parseFloat(coef2) || 0;
    const r2 = parseFloat(rad2) || 0;
    
    if (r1 <= 0 || r2 <= 0) return null;
    
    let result = '';
    let explanation = '';
    let canCompute = true;
    
    switch (operation) {
      case 'add':
        if (r1 === r2) {
          const newCoef = c1 + c2;
          result = `${newCoef}√${r1}`;
          explanation = `Same radicand: ${c1}√${r1} + ${c2}√${r2} = (${c1} + ${c2})√${r1} = ${newCoef}√${r1}`;
        } else {
          result = `${c1}√${r1} + ${c2}√${r2}`;
          explanation = `Different radicands (${r1} ≠ ${r2}): Cannot be combined further`;
          canCompute = false;
        }
        break;
      case 'subtract':
        if (r1 === r2) {
          const newCoef = c1 - c2;
          result = `${newCoef}√${r1}`;
          explanation = `Same radicand: ${c1}√${r1} - ${c2}√${r2} = (${c1} - ${c2})√${r1} = ${newCoef}√${r1}`;
        } else {
          result = `${c1}√${r1} - ${c2}√${r2}`;
          explanation = `Different radicands (${r1} ≠ ${r2}): Cannot be combined further`;
          canCompute = false;
        }
        break;
      case 'multiply':
        const newRadicand = r1 * r2;
        const newCoef = c1 * c2;
        const simplified = simplifyRadical(newRadicand, 2);
        const finalCoef = newCoef * simplified.coefficient;
        if (simplified.remainingRadicand === 1) {
          result = `${finalCoef}`;
        } else {
          result = `${finalCoef}√${simplified.remainingRadicand}`;
        }
        explanation = `${c1}√${r1} × ${c2}√${r2} = ${newCoef}√${newRadicand}${simplified.coefficient > 1 ? ` = ${result}` : ''}`;
        break;
      case 'divide':
        if (c2 === 0 || r2 === 0) {
          result = 'Undefined';
          explanation = 'Cannot divide by zero';
          canCompute = false;
        } else {
          const divRadicand = r1 / r2;
          const divCoef = c1 / c2;
          if (Number.isInteger(divRadicand) && divRadicand > 0) {
            const divSimplified = simplifyRadical(divRadicand, 2);
            const divFinalCoef = divCoef * divSimplified.coefficient;
            if (divSimplified.remainingRadicand === 1) {
              result = `${divFinalCoef.toFixed(2).replace(/\.?0+$/, '')}`;
            } else {
              result = `${divFinalCoef.toFixed(2).replace(/\.?0+$/, '')}√${divSimplified.remainingRadicand}`;
            }
            explanation = `${c1}√${r1} ÷ ${c2}√${r2} = (${c1}/${c2})√(${r1}/${r2}) = ${divCoef.toFixed(2).replace(/\.?0+$/, '')}√${divRadicand}`;
          } else {
            result = `(${c1}/${c2})√(${r1}/${r2})`;
            explanation = `${c1}√${r1} ÷ ${c2}√${r2} = (${c1}/${c2})√(${r1}/${r2}) ≈ ${(divCoef * Math.sqrt(divRadicand)).toFixed(4)}`;
          }
        }
        break;
    }
    
    return { result, explanation, canCompute };
  }, [operation, coef1, rad1, coef2, rad2]);

  // Get root symbol
  const getRootSymbol = (index: number) => {
    if (index === 2) return "√";
    if (index === 3) return "∛";
    if (index === 4) return "∜";
    return `${index}√`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFF7ED" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FDBA74" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Radical Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>√</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Radical Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Simplify radical expressions, evaluate roots, and perform operations with radicals. 
            Get step-by-step solutions to understand the simplification process.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FFEDD5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FB923C"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#C2410C", margin: "0 0 4px 0" }}>
                <strong>Quick Example:</strong> √72 = 6√2
              </p>
              <p style={{ color: "#EA580C", margin: 0, fontSize: "0.95rem" }}>
                72 = 36 × 2 = 6² × 2, so √72 = √(6² × 2) = 6√2
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("simplify")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "simplify" ? "#EA580C" : "#FFEDD5",
              color: activeTab === "simplify" ? "white" : "#EA580C",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ✨ Simplify Radical
          </button>
          <button
            onClick={() => setActiveTab("evaluate")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "evaluate" ? "#EA580C" : "#FFEDD5",
              color: activeTab === "evaluate" ? "white" : "#EA580C",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔢 Evaluate Root
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "operations" ? "#EA580C" : "#FFEDD5",
              color: activeTab === "operations" ? "white" : "#EA580C",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ➕ Radical Operations
          </button>
        </div>

        {/* Tab 1: Simplify Radical */}
        {activeTab === 'simplify' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ✨ Simplify Radical Expression
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Root Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Root Type
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setSimplifyIndex(n)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: simplifyIndex === n ? "2px solid #EA580C" : "1px solid #FDBA74",
                          backgroundColor: simplifyIndex === n ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          fontWeight: simplifyIndex === n ? "600" : "400",
                          color: simplifyIndex === n ? "#EA580C" : "#4B5563",
                          fontSize: "1.1rem"
                        }}
                      >
                        {getRootSymbol(n)} {n === 2 ? 'Square' : n === 3 ? 'Cube' : `${n}th`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radicand Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Number Under Radical (Radicand)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "2rem", color: "#EA580C" }}>{getRootSymbol(simplifyIndex)}</span>
                    <input
                      type="number"
                      value={simplifyRadicand}
                      onChange={(e) => setSimplifyRadicand(e.target.value)}
                      placeholder="Enter a number"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1.25rem",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Common Examples */}
                <div style={{ marginTop: "24px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>Try these examples:</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[12, 18, 32, 48, 72, 98, 128, 200].map(n => (
                      <button
                        key={n}
                        onClick={() => setSimplifyRadicand(n.toString())}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #FDBA74",
                          backgroundColor: "#FFF7ED",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "#EA580C"
                        }}
                      >
                        √{n}
                      </button>
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
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#C2410C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Simplified Result
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {simplifyResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#FFF7ED",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #EA580C"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#C2410C" }}>
                        {getRootSymbol(simplifyIndex)}{simplifyRadicand} =
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#EA580C" }}>
                        {simplifyResults.coefficient > 1 || simplifyResults.remainingRadicand === 1 
                          ? simplifyResults.coefficient 
                          : ''
                        }
                        {simplifyResults.remainingRadicand !== 1 && (
                          <span>
                            {getRootSymbol(simplifyIndex)}{simplifyResults.remainingRadicand}
                          </span>
                        )}
                      </p>
                      <p style={{ margin: "12px 0 0 0", fontSize: "0.9rem", color: "#6B7280" }}>
                        ≈ {Math.pow(parseFloat(simplifyRadicand), 1/simplifyIndex).toFixed(4)}
                      </p>
                    </div>

                    {/* Steps */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        Step-by-Step Solution:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {simplifyResults.steps.map((step, index) => (
                          <div key={index} style={{ 
                            display: "flex", 
                            gap: "10px",
                            padding: "10px 12px", 
                            backgroundColor: "#F9FAFB", 
                            borderRadius: "6px",
                            alignItems: "flex-start"
                          }}>
                            <span style={{ 
                              width: "24px", 
                              height: "24px", 
                              backgroundColor: "#EA580C", 
                              borderRadius: "50%", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              color: "white",
                              flexShrink: 0
                            }}>
                              {index + 1}
                            </span>
                            <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>√</p>
                    <p style={{ margin: 0 }}>Enter a positive number to simplify</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Evaluate Root */}
        {activeTab === 'evaluate' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔢 Evaluate Root
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Root Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Root Type
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => setEvaluateIndex(n)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: evaluateIndex === n ? "2px solid #EA580C" : "1px solid #FDBA74",
                          backgroundColor: evaluateIndex === n ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          fontWeight: evaluateIndex === n ? "600" : "400",
                          color: evaluateIndex === n ? "#EA580C" : "#4B5563"
                        }}
                      >
                        {getRootSymbol(n)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Number
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "2rem", color: "#EA580C" }}>{getRootSymbol(evaluateIndex)}</span>
                    <input
                      type="number"
                      value={evaluateRadicand}
                      onChange={(e) => setEvaluateRadicand(e.target.value)}
                      placeholder="Enter a number"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1.25rem",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Perfect Squares Reference */}
                <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#C2410C", fontWeight: "600", margin: "0 0 8px 0" }}>
                    Perfect Squares (1-400):
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#EA580C", margin: 0, lineHeight: "1.8" }}>
                    {perfectSquares.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#C2410C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Result
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {evaluateResults ? (
                  evaluateResults.error ? (
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      border: "1px solid #FCA5A5"
                    }}>
                      <p style={{ margin: 0, color: "#DC2626", fontWeight: "600" }}>
                        ⚠️ {evaluateResults.error}
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Main Result */}
                      <div style={{
                        backgroundColor: "#FFF7ED",
                        borderRadius: "12px",
                        padding: "24px",
                        textAlign: "center",
                        marginBottom: "20px",
                        border: "2px solid #EA580C"
                      }}>
                        <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#C2410C" }}>
                          {getRootSymbol(evaluateIndex)}{evaluateRadicand} =
                        </p>
                        {evaluateResults.exact !== null ? (
                          <>
                            <p style={{ margin: 0, fontSize: "3.5rem", fontWeight: "bold", color: "#16A34A" }}>
                              {evaluateResults.exact}
                            </p>
                            <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534", backgroundColor: "#DCFCE7", padding: "4px 12px", borderRadius: "4px", display: "inline-block" }}>
                              ✓ Perfect {evaluateIndex === 2 ? 'Square' : evaluateIndex === 3 ? 'Cube' : `${evaluateIndex}th Power`}!
                            </p>
                          </>
                        ) : (
                          <>
                            <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#EA580C" }}>
                              {evaluateResults.decimal?.toFixed(6)}
                            </p>
                            <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>
                              (irrational number)
                            </p>
                          </>
                        )}
                      </div>

                      {/* Verification */}
                      <div style={{
                        backgroundColor: "#F0FDF4",
                        borderRadius: "8px",
                        padding: "16px",
                        border: "1px solid #86EFAC"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
                          ✓ <strong>Verification:</strong> {evaluateResults.decimal?.toFixed(4)}{evaluateIndex === 2 ? '²' : evaluateIndex === 3 ? '³' : `^${evaluateIndex}`} = {Math.pow(evaluateResults.decimal || 0, evaluateIndex).toFixed(2)} ≈ {evaluateRadicand}
                        </p>
                      </div>
                    </>
                  )
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>🔢</p>
                    <p style={{ margin: 0 }}>Enter a number to evaluate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Radical Operations */}
        {activeTab === 'operations' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ➕ Radical Operations
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Operation Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Operation
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                      { id: 'add', label: '+ Add', symbol: '+' },
                      { id: 'subtract', label: '− Subtract', symbol: '−' },
                      { id: 'multiply', label: '× Multiply', symbol: '×' },
                      { id: 'divide', label: '÷ Divide', symbol: '÷' }
                    ].map(op => (
                      <button
                        key={op.id}
                        onClick={() => setOperation(op.id as typeof operation)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: operation === op.id ? "2px solid #EA580C" : "1px solid #FDBA74",
                          backgroundColor: operation === op.id ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          fontWeight: operation === op.id ? "600" : "400",
                          color: operation === op.id ? "#EA580C" : "#4B5563"
                        }}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Radical */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    First Radical
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <input
                      type="number"
                      value={coef1}
                      onChange={(e) => setCoef1(e.target.value)}
                      style={{
                        width: "60px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: "1.5rem", color: "#EA580C" }}>√</span>
                    <input
                      type="number"
                      value={rad1}
                      onChange={(e) => setRad1(e.target.value)}
                      style={{
                        width: "80px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Operation Symbol */}
                <div style={{ textAlign: "center", fontSize: "1.5rem", color: "#EA580C", margin: "12px 0" }}>
                  {operation === 'add' ? '+' : operation === 'subtract' ? '−' : operation === 'multiply' ? '×' : '÷'}
                </div>

                {/* Second Radical */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Second Radical
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <input
                      type="number"
                      value={coef2}
                      onChange={(e) => setCoef2(e.target.value)}
                      style={{
                        width: "60px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: "1.5rem", color: "#EA580C" }}>√</span>
                    <input
                      type="number"
                      value={rad2}
                      onChange={(e) => setRad2(e.target.value)}
                      style={{
                        width: "80px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #FDBA74",
                        fontSize: "1rem",
                        textAlign: "center"
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
              border: "1px solid #FDBA74",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#C2410C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Result
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {operationsResults ? (
                  <>
                    {/* Expression */}
                    <div style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "16px"
                    }}>
                      <p style={{ margin: 0, fontSize: "1.25rem", color: "#4B5563" }}>
                        {coef1}√{rad1} {operation === 'add' ? '+' : operation === 'subtract' ? '−' : operation === 'multiply' ? '×' : '÷'} {coef2}√{rad2}
                      </p>
                    </div>

                    {/* Main Result */}
                    <div style={{
                      backgroundColor: operationsResults.canCompute ? "#FFF7ED" : "#FEF3C7",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: `2px solid ${operationsResults.canCompute ? "#EA580C" : "#FCD34D"}`
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: operationsResults.canCompute ? "#C2410C" : "#92400E" }}>
                        Result
                      </p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: operationsResults.canCompute ? "#EA580C" : "#B45309" }}>
                        {operationsResults.result}
                      </p>
                    </div>

                    {/* Explanation */}
                    <div style={{
                      backgroundColor: "#F0FDF4",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #86EFAC"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
                        💡 <strong>Explanation:</strong> {operationsResults.explanation}
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>➕</p>
                    <p style={{ margin: 0 }}>Enter values to perform operation</p>
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDBA74", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                √ How to Simplify Radical Expressions
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Simplifying radicals is a fundamental skill in algebra. The goal is to rewrite a radical 
                  expression in its simplest form by extracting perfect square (or cube, etc.) factors 
                  from under the radical sign.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step-by-Step Method</h3>
                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FDBA74"
                }}>
                  <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Find prime factorization</strong> of the number under the radical</li>
                    <li><strong>Group factors</strong> based on the index (pairs for √, triplets for ∛)</li>
                    <li><strong>Extract complete groups</strong> outside the radical</li>
                    <li><strong>Multiply</strong> remaining factors inside the radical</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Example: Simplify √72</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #86EFAC",
                  fontFamily: "monospace"
                }}>
                  <p style={{ margin: "0 0 8px 0" }}>√72</p>
                  <p style={{ margin: "0 0 8px 0" }}>= √(2 × 2 × 2 × 3 × 3) &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280" }}>← prime factorization</span></p>
                  <p style={{ margin: "0 0 8px 0" }}>= √(2² × 3² × 2) &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280" }}>← group in pairs</span></p>
                  <p style={{ margin: "0 0 8px 0" }}>= 2 × 3 × √2 &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280" }}>← extract pairs</span></p>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#16A34A" }}>= 6√2 ✓</p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Perfect Squares to Know</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginTop: "12px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#FFF7ED" }}>
                        <th style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #FDBA74" }}>n</th>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <th key={n} style={{ padding: "10px", textAlign: "center", borderBottom: "2px solid #FDBA74" }}>{n}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>n²</td>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                          <td key={n} style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{n*n}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Radical Operation Rules</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  <div style={{ padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#1E40AF" }}>Multiplication</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#1D4ED8", fontFamily: "monospace" }}>
                      √a × √b = √(ab)
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FCE7F3", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#9D174D" }}>Division</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#BE185D", fontFamily: "monospace" }}>
                      √a ÷ √b = √(a/b)
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#D1FAE5", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#065F46" }}>Addition (same radicand)</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#047857", fontFamily: "monospace" }}>
                      a√c + b√c = (a+b)√c
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#92400E" }}>Power Rule</p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#B45309", fontFamily: "monospace" }}>
                      √a = a^(1/2)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FFF7ED", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FDBA74" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#EA580C", marginBottom: "16px" }}>📋 Common Simplifications</h3>
              <div style={{ fontSize: "0.9rem", color: "#C2410C", lineHeight: "2.2", fontFamily: "monospace" }}>
                <p style={{ margin: 0 }}>√8 = 2√2</p>
                <p style={{ margin: 0 }}>√12 = 2√3</p>
                <p style={{ margin: 0 }}>√18 = 3√2</p>
                <p style={{ margin: 0 }}>√32 = 4√2</p>
                <p style={{ margin: 0 }}>√48 = 4√3</p>
                <p style={{ margin: 0 }}>√50 = 5√2</p>
                <p style={{ margin: 0 }}>√72 = 6√2</p>
                <p style={{ margin: 0 }}>√98 = 7√2</p>
              </div>
            </div>

            {/* Perfect Cubes */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4F46E5", marginBottom: "16px" }}>🧊 Perfect Cubes</h3>
              <div style={{ fontSize: "0.9rem", color: "#4338CA", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>{perfectCubes.join(', ')}</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/radical-calculator" currentCategory="Math" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FDBA74", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFF7ED", borderRadius: "8px", border: "1px solid #FDBA74" }}>
          <p style={{ fontSize: "0.75rem", color: "#EA580C", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator simplifies radical expressions and performs basic 
            radical operations. For complex equations involving radicals (like √(x+3) = 5), please use a 
            computer algebra system or consult your textbook for solving techniques.
          </p>
        </div>
      </div>
    </div>
  );
}