"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Perfect squares and cubes for reference
const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];
const perfectCubes = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000];

// Common radicands for quick selection
const commonRadicands = [8, 12, 18, 20, 24, 27, 32, 45, 48, 50, 72, 75, 98, 128, 200];

// FAQ data
const faqs = [
  {
    question: "How do you simplify radicals step by step?",
    answer: "To simplify a radical: 1) Find the prime factorization of the number under the radical. 2) Group the prime factors based on the root index (pairs for square root, triplets for cube root). 3) For each complete group, move one factor outside the radical. 4) Multiply the factors outside together and the remaining factors inside together. For example, √72 = √(2³ × 3²) = √(2² × 2 × 3²) = 2 × 3 × √2 = 6√2."
  },
  {
    question: "What is the simplified form of √72?",
    answer: "√72 = 6√2. Here's how: 72 = 36 × 2 = 6² × 2. Since 36 is a perfect square, √72 = √(36 × 2) = √36 × √2 = 6√2. You can verify: (6√2)² = 36 × 2 = 72. The decimal approximation is approximately 8.485."
  },
  {
    question: "How do you simplify radicals with variables?",
    answer: "For variables under a radical, use the same grouping principle. For square roots, pair the exponents. For example: √(x⁴) = x² (because x⁴ = (x²)²), √(x⁵) = x²√x (because x⁵ = x⁴ × x = (x²)² × x), √(x⁶y⁴) = x³y² (because x⁶ = (x³)² and y⁴ = (y²)²). For cube roots, group exponents in threes."
  },
  {
    question: "Can you add radicals with different radicands?",
    answer: "You can only add or subtract radicals that have the same radicand (the number under the radical) AND the same index (square root, cube root, etc.). For example: 3√2 + 5√2 = 8√2 (same radicand). But √2 + √3 cannot be simplified further because the radicands are different. Sometimes you need to simplify first: √8 + √2 = 2√2 + √2 = 3√2."
  },
  {
    question: "How do you multiply two radicals together?",
    answer: "To multiply radicals with the same index, multiply the radicands together under one radical, then simplify. Formula: √a × √b = √(a × b). For example: √2 × √8 = √(2 × 8) = √16 = 4. With coefficients: 3√2 × 4√5 = (3 × 4) × √(2 × 5) = 12√10. For different indices, convert to fractional exponents first."
  },
  {
    question: "What is the difference between √ and ∛?",
    answer: "√ (square root) finds a number that when multiplied by itself gives the radicand: √9 = 3 because 3 × 3 = 9. ∛ (cube root) finds a number that when multiplied by itself THREE times gives the radicand: ∛8 = 2 because 2 × 2 × 2 = 8. Square roots need pairs of factors to simplify; cube roots need triplets. For example: √8 = 2√2 (one pair of 2s), but ∛8 = 2 (one triplet of 2s)."
  },
  {
    question: "How do you rationalize a denominator?",
    answer: "To rationalize a denominator with a single radical, multiply both numerator and denominator by that radical. For example: 1/√2 = (1 × √2)/(√2 × √2) = √2/2. For denominators like (a + √b), multiply by the conjugate (a - √b). For example: 1/(1 + √2) = (1 - √2)/((1 + √2)(1 - √2)) = (1 - √2)/(1 - 2) = (1 - √2)/(-1) = √2 - 1."
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
function primeFactorize(n: number): { factors: number[], factorCounts: Map<number, number> } {
  const factors: number[] = [];
  const factorCounts = new Map<number, number>();
  let num = Math.abs(Math.floor(n));
  
  if (num <= 1) {
    return { factors: [num], factorCounts: new Map([[num, 1]]) };
  }
  
  let divisor = 2;
  while (num > 1) {
    while (num % divisor === 0) {
      factors.push(divisor);
      factorCounts.set(divisor, (factorCounts.get(divisor) || 0) + 1);
      num = num / divisor;
    }
    divisor++;
    if (divisor * divisor > num && num > 1) {
      factors.push(num);
      factorCounts.set(num, (factorCounts.get(num) || 0) + 1);
      break;
    }
  }
  
  return { factors, factorCounts };
}

// Simplify radical function
function simplifyRadical(radicand: number, index: number): {
  coefficient: number;
  remainingRadicand: number;
  steps: string[];
  isPerfect: boolean;
  decimal: number;
} {
  const steps: string[] = [];
  const originalRadicand = radicand;
  
  if (radicand <= 0) {
    return {
      coefficient: 1,
      remainingRadicand: radicand,
      steps: ["Cannot simplify non-positive numbers in this calculator"],
      isPerfect: false,
      decimal: 0
    };
  }
  
  if (radicand === 1) {
    return {
      coefficient: 1,
      remainingRadicand: 1,
      steps: ["The " + (index === 2 ? "square" : index === 3 ? "cube" : index + "th") + " root of 1 is 1"],
      isPerfect: true,
      decimal: 1
    };
  }
  
  // Check if it's a perfect power
  const root = Math.pow(radicand, 1 / index);
  if (Math.abs(Math.round(root) - root) < 0.0000001) {
    const perfectRoot = Math.round(root);
    steps.push(`${radicand} is a perfect ${index === 2 ? "square" : index === 3 ? "cube" : index + "th power"}: ${perfectRoot}${index === 2 ? "²" : index === 3 ? "³" : "^" + index} = ${radicand}`);
    return {
      coefficient: perfectRoot,
      remainingRadicand: 1,
      steps,
      isPerfect: true,
      decimal: perfectRoot
    };
  }
  
  // Prime factorization
  const { factorCounts } = primeFactorize(radicand);
  
  // Build factorization string
  const factorStrings: string[] = [];
  factorCounts.forEach((count, prime) => {
    if (count === 1) {
      factorStrings.push(`${prime}`);
    } else {
      factorStrings.push(`${prime}${count === 2 ? "²" : count === 3 ? "³" : "^" + count}`);
    }
  });
  steps.push(`Step 1: Prime factorization of ${radicand} = ${factorStrings.join(" × ")}`);
  
  // Find factors that can come out
  let coefficient = 1;
  let remainingRadicand = 1;
  const outsideFactors: string[] = [];
  const insideFactors: string[] = [];
  
  factorCounts.forEach((count, prime) => {
    const groupsOut = Math.floor(count / index);
    const remaining = count % index;
    
    if (groupsOut > 0) {
      coefficient *= Math.pow(prime, groupsOut);
      outsideFactors.push(groupsOut === 1 ? `${prime}` : `${prime}${groupsOut === 2 ? "²" : groupsOut === 3 ? "³" : "^" + groupsOut}`);
    }
    if (remaining > 0) {
      remainingRadicand *= Math.pow(prime, remaining);
      insideFactors.push(remaining === 1 ? `${prime}` : `${prime}${remaining === 2 ? "²" : remaining === 3 ? "³" : "^" + remaining}`);
    }
  });
  
  // Step 2: Group factors
  const indexName = index === 2 ? "pairs" : index === 3 ? "triplets" : `groups of ${index}`;
  steps.push(`Step 2: Group prime factors into ${indexName} (for ${index === 2 ? "square" : index === 3 ? "cube" : index + "th"} root)`);
  
  // Step 3: Extract
  if (coefficient > 1) {
    const rootSymbol = index === 2 ? "√" : index === 3 ? "∛" : `${index}√`;
    if (remainingRadicand === 1) {
      steps.push(`Step 3: All factors form complete groups: ${rootSymbol}${originalRadicand} = ${coefficient}`);
    } else {
      steps.push(`Step 3: Extract ${outsideFactors.join(" × ")} = ${coefficient} outside the radical`);
      steps.push(`Step 4: ${insideFactors.join(" × ")} = ${remainingRadicand} remains inside`);
      steps.push(`Result: ${rootSymbol}${originalRadicand} = ${coefficient}${rootSymbol}${remainingRadicand}`);
    }
  } else {
    steps.push(`Step 3: No complete ${indexName} found - radical is already in simplest form`);
  }
  
  const decimal = coefficient * Math.pow(remainingRadicand, 1 / index);
  
  return {
    coefficient,
    remainingRadicand,
    steps,
    isPerfect: remainingRadicand === 1,
    decimal
  };
}

// Get root symbol
function getRootSymbol(index: number): string {
  if (index === 2) return "√";
  if (index === 3) return "∛";
  if (index === 4) return "∜";
  return `${index}√`;
}

export default function SimplifyRadicalsCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"simplify" | "operations" | "factorize">("simplify");

  // Tab 1: Simplify
  const [radicand, setRadicand] = useState<string>("72");
  const [rootIndex, setRootIndex] = useState<number>(2);

  // Tab 2: Operations
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide">("add");
  const [coef1, setCoef1] = useState<string>("3");
  const [rad1, setRad1] = useState<string>("2");
  const [coef2, setCoef2] = useState<string>("5");
  const [rad2, setRad2] = useState<string>("2");

  // Tab 3: Prime Factorization
  const [factorNumber, setFactorNumber] = useState<string>("72");

  // Calculate simplification
  const simplifyResult = simplifyRadical(parseInt(radicand) || 0, rootIndex);

  // Calculate operation result
  const calcOperation = () => {
    const c1 = parseFloat(coef1) || 0;
    const r1 = parseInt(rad1) || 0;
    const c2 = parseFloat(coef2) || 0;
    const r2 = parseInt(rad2) || 0;

    const steps: string[] = [];
    let resultCoef = 0;
    let resultRad = 0;
    let canCombine = false;

    if (operation === "add" || operation === "subtract") {
      // Simplify both radicals first
      const simp1 = simplifyRadical(r1, 2);
      const simp2 = simplifyRadical(r2, 2);
      
      const effectiveCoef1 = c1 * simp1.coefficient;
      const effectiveCoef2 = c2 * simp2.coefficient;
      const effectiveRad1 = simp1.remainingRadicand;
      const effectiveRad2 = simp2.remainingRadicand;

      steps.push(`Simplify √${r1}: ${simp1.coefficient === 1 ? "" : simp1.coefficient}√${simp1.remainingRadicand}`);
      steps.push(`Simplify √${r2}: ${simp2.coefficient === 1 ? "" : simp2.coefficient}√${simp2.remainingRadicand}`);
      steps.push(`Expression becomes: ${effectiveCoef1}√${effectiveRad1} ${operation === "add" ? "+" : "−"} ${effectiveCoef2}√${effectiveRad2}`);

      if (effectiveRad1 === effectiveRad2) {
        canCombine = true;
        resultRad = effectiveRad1;
        resultCoef = operation === "add" ? effectiveCoef1 + effectiveCoef2 : effectiveCoef1 - effectiveCoef2;
        steps.push(`Same radicand (${resultRad}), so we can ${operation}: ${effectiveCoef1} ${operation === "add" ? "+" : "−"} ${effectiveCoef2} = ${resultCoef}`);
      } else {
        steps.push(`Different radicands (${effectiveRad1} ≠ ${effectiveRad2}), cannot combine further`);
      }
    } else if (operation === "multiply") {
      // √a × √b = √(a×b)
      const productRad = r1 * r2;
      const productCoef = c1 * c2;
      steps.push(`${c1}√${r1} × ${c2}√${r2}`);
      steps.push(`= (${c1} × ${c2}) × √(${r1} × ${r2})`);
      steps.push(`= ${productCoef} × √${productRad}`);
      
      const simplified = simplifyRadical(productRad, 2);
      resultCoef = productCoef * simplified.coefficient;
      resultRad = simplified.remainingRadicand;
      
      if (simplified.coefficient > 1 || simplified.remainingRadicand !== productRad) {
        steps.push(`Simplify √${productRad}: ${simplified.coefficient === 1 ? "" : simplified.coefficient}√${simplified.remainingRadicand}`);
        steps.push(`= ${resultCoef}${resultRad === 1 ? "" : "√" + resultRad}`);
      }
      canCombine = true;
    } else if (operation === "divide") {
      // √a ÷ √b = √(a/b)
      if (r2 === 0) {
        steps.push("Cannot divide by zero");
        return { resultCoef: 0, resultRad: 0, steps, canCombine: false };
      }
      
      const quotientRad = r1 / r2;
      const quotientCoef = c1 / c2;
      steps.push(`${c1}√${r1} ÷ ${c2}√${r2}`);
      steps.push(`= (${c1} ÷ ${c2}) × √(${r1} ÷ ${r2})`);
      
      if (Number.isInteger(quotientRad)) {
        steps.push(`= ${quotientCoef.toFixed(2)} × √${quotientRad}`);
        const simplified = simplifyRadical(quotientRad, 2);
        resultCoef = quotientCoef * simplified.coefficient;
        resultRad = simplified.remainingRadicand;
        canCombine = true;
      } else {
        steps.push(`= ${quotientCoef.toFixed(2)} × √(${r1}/${r2})`);
        steps.push(`Radicand is not an integer, result: ${(quotientCoef * Math.sqrt(quotientRad)).toFixed(4)}`);
        resultCoef = quotientCoef * Math.sqrt(quotientRad);
        resultRad = 0;
        canCombine = true;
      }
    }

    return { resultCoef, resultRad, steps, canCombine };
  };

  const operationResult = calcOperation();

  // Calculate prime factorization
  const factorResult = primeFactorize(parseInt(factorNumber) || 0);
  const factorStrings: string[] = [];
  factorResult.factorCounts.forEach((count, prime) => {
    factorStrings.push(count === 1 ? `${prime}` : `${prime}${count === 2 ? "²" : count === 3 ? "³" : "^" + count}`);
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Simplify Radicals Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>√</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Simplify Radicals Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Simplify square roots, cube roots, and nth roots with step-by-step solutions. 
            Learn the prime factorization method and perform radical operations. 100% free.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#F5F3FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #C4B5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>
                √72 = <strong>6√2</strong> ≈ 8.485
              </p>
              <p style={{ color: "#6D28D9", margin: 0, fontSize: "0.95rem" }}>
                Because 72 = 36 × 2 = 6² × 2, so √72 = √(6² × 2) = 6√2
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
              backgroundColor: activeTab === "simplify" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "simplify" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            √ Simplify Radicals
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "operations" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "operations" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ➕ Radical Operations
          </button>
          <button
            onClick={() => setActiveTab("factorize")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "factorize" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "factorize" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔢 Prime Factorization
          </button>
        </div>

        {/* Tab 1: Simplify Radicals */}
        {activeTab === "simplify" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>√ Enter Radical</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Root Index Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Root Type
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { index: 2, label: "√ Square Root" },
                      { index: 3, label: "∛ Cube Root" },
                      { index: 4, label: "∜ 4th Root" },
                      { index: 5, label: "⁵√ 5th Root" }
                    ].map((item) => (
                      <button
                        key={item.index}
                        onClick={() => setRootIndex(item.index)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: rootIndex === item.index ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: rootIndex === item.index ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontWeight: "600",
                          color: rootIndex === item.index ? "#7C3AED" : "#374151",
                          fontSize: "0.9rem"
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radicand Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Number Under Radical (Radicand)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "2.5rem", color: "#7C3AED" }}>{getRootSymbol(rootIndex)}</span>
                    <input
                      type="number"
                      value={radicand}
                      onChange={(e) => setRadicand(e.target.value)}
                      placeholder="Enter number"
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: "8px",
                        border: "2px solid #7C3AED",
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Quick Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>
                    Common Examples:
                  </label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {commonRadicands.map((num) => (
                      <button
                        key={num}
                        onClick={() => setRadicand(String(num))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: radicand === String(num) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: radicand === String(num) ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "#374151"
                        }}
                      >
                        {num}
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
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Simplified Form</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>
                    {getRootSymbol(rootIndex)}{radicand} =
                  </p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#047857" }}>
                    {simplifyResult.coefficient > 1 || simplifyResult.isPerfect
                      ? `${simplifyResult.coefficient}${simplifyResult.remainingRadicand === 1 ? "" : getRootSymbol(rootIndex) + simplifyResult.remainingRadicand}`
                      : `${getRootSymbol(rootIndex)}${radicand}`
                    }
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "1rem", color: "#059669" }}>
                    ≈ {simplifyResult.decimal.toFixed(4)}
                  </p>
                </div>

                {/* Perfect Power Badge */}
                {simplifyResult.isPerfect && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "1px solid #FCD34D"
                  }}>
                    <span style={{ color: "#92400E", fontWeight: "600" }}>
                      ✨ {radicand} is a perfect {rootIndex === 2 ? "square" : rootIndex === 3 ? "cube" : rootIndex + "th power"}!
                    </span>
                  </div>
                )}

                {/* Step by Step */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>
                    📝 Step-by-Step Solution
                  </h3>
                  {simplifyResult.steps.map((step, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "12px",
                        padding: "12px",
                        backgroundColor: index === simplifyResult.steps.length - 1 ? "#F0FDF4" : "#F9FAFB",
                        borderRadius: "8px",
                        border: index === simplifyResult.steps.length - 1 ? "1px solid #86EFAC" : "1px solid #E5E7EB"
                      }}
                    >
                      <span style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "#7C3AED",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.5" }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Radical Operations */}
        {activeTab === "operations" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>➕ Radical Operations</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Operation Selection */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Operation
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {[
                      { op: "add", label: "+", name: "Add" },
                      { op: "subtract", label: "−", name: "Subtract" },
                      { op: "multiply", label: "×", name: "Multiply" },
                      { op: "divide", label: "÷", name: "Divide" }
                    ].map((item) => (
                      <button
                        key={item.op}
                        onClick={() => setOperation(item.op as typeof operation)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: operation === item.op ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: operation === item.op ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", color: operation === item.op ? "#2563EB" : "#374151" }}>{item.label}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{item.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* First Radical */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    First Radical
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="number"
                      value={coef1}
                      onChange={(e) => setCoef1(e.target.value)}
                      placeholder="Coef"
                      style={{
                        width: "80px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: "2rem", color: "#2563EB" }}>√</span>
                    <input
                      type="number"
                      value={rad1}
                      onChange={(e) => setRad1(e.target.value)}
                      placeholder="Radicand"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Operation Symbol */}
                <div style={{ textAlign: "center", fontSize: "2rem", color: "#2563EB", margin: "16px 0" }}>
                  {operation === "add" ? "+" : operation === "subtract" ? "−" : operation === "multiply" ? "×" : "÷"}
                </div>

                {/* Second Radical */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Second Radical
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="number"
                      value={coef2}
                      onChange={(e) => setCoef2(e.target.value)}
                      placeholder="Coef"
                      style={{
                        width: "80px",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        textAlign: "center"
                      }}
                    />
                    <span style={{ fontSize: "2rem", color: "#2563EB" }}>√</span>
                    <input
                      type="number"
                      value={rad2}
                      onChange={(e) => setRad2(e.target.value)}
                      placeholder="Radicand"
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        textAlign: "center"
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "8px",
                  padding: "12px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                    💡 For addition/subtraction, radicals must have the same radicand to combine.
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
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Result</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #60A5FA"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1E40AF" }}>
                    {coef1}√{rad1} {operation === "add" ? "+" : operation === "subtract" ? "−" : operation === "multiply" ? "×" : "÷"} {coef2}√{rad2} =
                  </p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1D4ED8" }}>
                    {operationResult.canCombine
                      ? operationResult.resultRad === 1
                        ? (Number.isInteger(operationResult.resultCoef)
                            ? operationResult.resultCoef
                            : operationResult.resultCoef.toFixed(4).replace(/\.?0+$/, ''))
                        : operationResult.resultRad === 0
                          ? operationResult.resultCoef.toFixed(4).replace(/\.?0+$/, '')
                          : `${Number.isInteger(operationResult.resultCoef)
                              ? operationResult.resultCoef
                              : operationResult.resultCoef.toFixed(2).replace(/\.?0+$/, '')}√${operationResult.resultRad}`
                      : "Cannot simplify"
                    }
                  </div>
                </div>

                {/* Steps */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📝 Solution Steps
                  </h3>
                  {operationResult.steps.map((step, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 12px",
                        backgroundColor: index === operationResult.steps.length - 1 ? "#DBEAFE" : "#F9FAFB",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        fontSize: "0.9rem",
                        color: "#374151"
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Prime Factorization */}
        {activeTab === "factorize" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔢 Prime Factorization</h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Enter a Number
                  </label>
                  <input
                    type="number"
                    value={factorNumber}
                    onChange={(e) => setFactorNumber(e.target.value)}
                    placeholder="Enter number to factorize"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid #DC2626",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      textAlign: "center",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Quick Selection */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>
                    Try these numbers:
                  </label>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[36, 48, 60, 72, 84, 96, 100, 120, 144, 180, 200, 360].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFactorNumber(String(num))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: factorNumber === String(num) ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: factorNumber === String(num) ? "#FEE2E2" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: "#374151"
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Why Prime Factorization */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "24px",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#991B1B", fontSize: "0.9rem" }}>
                    💡 Why Prime Factorization?
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#B91C1C" }}>
                    Prime factorization is the key to simplifying radicals. By breaking a number into its prime factors, 
                    you can identify which factors can be &quot;pulled out&quot; of the radical.
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
              <div style={{ backgroundColor: "#B91C1C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Factorization Result</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#991B1B" }}>
                    {factorNumber} =
                  </p>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#DC2626" }}>
                    {factorStrings.join(" × ") || factorNumber}
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Factor Breakdown
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {Array.from(factorResult.factorCounts.entries()).map(([prime, count]) => (
                      <div
                        key={prime}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "6px"
                        }}
                      >
                        <span style={{ color: "#374151" }}>Prime factor {prime}</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>
                          appears {count} time{count > 1 ? "s" : ""} ({prime}{count > 1 ? (count === 2 ? "²" : count === 3 ? "³" : "^" + count) : ""})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Radical Simplification Hints */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #6EE7B7"
                }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46", fontWeight: "600" }}>
                    ✨ Simplification Hints
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "#047857" }}>
                    {Array.from(factorResult.factorCounts.entries()).map(([prime, count]) => {
                      const pairs = Math.floor(count / 2);
                      const triplets = Math.floor(count / 3);
                      return (
                        <p key={prime} style={{ margin: "4px 0" }}>
                          {prime}{count > 1 ? (count === 2 ? "²" : count === 3 ? "³" : "^" + count) : ""}: 
                          {pairs > 0 && ` √ extracts ${Math.pow(prime, pairs)}`}
                          {triplets > 0 && ` | ∛ extracts ${Math.pow(prime, triplets)}`}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Perfect Squares Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Perfect Squares & Cubes Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Perfect Squares */}
              <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>Perfect Squares (n²)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                    <div
                      key={n}
                      style={{
                        padding: "8px",
                        backgroundColor: "#F5F3FF",
                        borderRadius: "6px",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{n}²</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#7C3AED" }}>{n * n}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perfect Cubes */}
              <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>Perfect Cubes (n³)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <div
                      key={n}
                      style={{
                        padding: "8px",
                        backgroundColor: "#FEF3C7",
                        borderRadius: "6px",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{n}³</div>
                      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#B45309" }}>{n * n * n}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>√ How to Simplify Radicals</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Simplifying radicals is a fundamental algebra skill. The goal is to rewrite a radical expression 
                  in its simplest form by removing any <strong>perfect square factors</strong> (for square roots) 
                  or <strong>perfect cube factors</strong> (for cube roots) from under the radical sign.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Prime Factorization Method</h3>
                <p>
                  The most reliable way to simplify radicals is using prime factorization:
                </p>
                <ol style={{ paddingLeft: "20px" }}>
                  <li><strong>Factor the radicand</strong> into its prime factors</li>
                  <li><strong>Group the factors</strong> based on the root index (pairs for √, triplets for ∛)</li>
                  <li><strong>Extract one factor</strong> from each complete group to outside the radical</li>
                  <li><strong>Multiply</strong> the outside factors together and inside factors together</li>
                </ol>

                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#5B21B6" }}>Example: Simplify √72</p>
                  <ol style={{ paddingLeft: "20px", margin: 0, color: "#6D28D9" }}>
                    <li>72 = 2 × 2 × 2 × 3 × 3 = 2³ × 3²</li>
                    <li>Group into pairs: (2 × 2) × 2 × (3 × 3)</li>
                    <li>Extract one 2 and one 3: 2 × 3 = 6</li>
                    <li>Remaining inside: 2</li>
                    <li>Result: √72 = 6√2</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Rules for Radical Operations</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Multiplication:</strong> √a × √b = √(ab)</li>
                  <li><strong>Division:</strong> √a ÷ √b = √(a/b)</li>
                  <li><strong>Addition/Subtraction:</strong> Only combine &quot;like radicals&quot; with the same radicand</li>
                  <li><strong>Power Rule:</strong> (√a)² = a</li>
                </ul>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Common Mistakes to Avoid</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>❌ √(a + b) ≠ √a + √b (cannot split addition under radical)</li>
                  <li>❌ Forgetting to check for more perfect square factors</li>
                  <li>❌ Adding radicals with different radicands</li>
                  <li>✅ Always simplify radicals before adding or subtracting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>📝 Common Simplifications</h3>
              <div style={{ fontSize: "0.9rem", color: "#6D28D9", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>√8 = 2√2</p>
                <p style={{ margin: 0 }}>√12 = 2√3</p>
                <p style={{ margin: 0 }}>√18 = 3√2</p>
                <p style={{ margin: 0 }}>√50 = 5√2</p>
                <p style={{ margin: 0 }}>√72 = 6√2</p>
                <p style={{ margin: 0 }}>√98 = 7√2</p>
                <p style={{ margin: 0 }}>√128 = 8√2</p>
              </div>
            </div>

            {/* Radical Rules */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>📐 Key Formulas</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2.2", fontFamily: "monospace" }}>
                <p style={{ margin: 0 }}>√(ab) = √a × √b</p>
                <p style={{ margin: 0 }}>√(a/b) = √a / √b</p>
                <p style={{ margin: 0 }}>(√a)² = a</p>
                <p style={{ margin: 0 }}>√a² = |a|</p>
                <p style={{ margin: 0 }}>ⁿ√(aⁿ) = a</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/simplify-radicals-calculator" currentCategory="Math" />
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
            √ <strong>Disclaimer:</strong> This calculator is for educational purposes. 
            Always verify your work, especially for homework and exams. 
            The calculator handles positive integers; for variables and complex expressions, consult your textbook or instructor.
          </p>
        </div>
      </div>
    </div>
  );
}
