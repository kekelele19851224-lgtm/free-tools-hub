"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How do I solve radical equations?",
    answer: "To solve radical equations: 1) Isolate the radical on one side of the equation. 2) Raise both sides to the power that eliminates the radical (square for square roots, cube for cube roots). 3) Solve the resulting equation for the variable. 4) ALWAYS check your answer by substituting back into the original equation to identify extraneous solutions."
  },
  {
    question: "What are extraneous solutions?",
    answer: "Extraneous solutions are answers that emerge from the solving process but don't actually satisfy the original equation. They often appear when you square both sides of an equation because squaring can introduce false solutions. For example, if √x = -3, squaring gives x = 9, but √9 = 3 ≠ -3, so x = 9 is extraneous. Always verify your solutions!"
  },
  {
    question: "What is the radical of 32?",
    answer: "√32 = √(16 × 2) = √16 × √2 = 4√2 ≈ 5.657. The simplified radical form is 4√2. For cube root: ∛32 = ∛(8 × 4) = 2∛4 ≈ 3.175."
  },
  {
    question: "How do you solve √(2x + 3) = 5?",
    answer: "Step 1: Square both sides: 2x + 3 = 25. Step 2: Subtract 3: 2x = 22. Step 3: Divide by 2: x = 11. Step 4: Check: √(2(11) + 3) = √25 = 5 ✓. The solution x = 11 is valid."
  },
  {
    question: "Can a radical equation have no solution?",
    answer: "Yes! A radical equation has no solution when: 1) The equation requires a square root to equal a negative number (impossible for real numbers), like √x = -5. 2) All solutions found are extraneous after checking. For example, √(x-1) + x = 3 may have solutions that don't work when verified."
  },
  {
    question: "What's the difference between √x and x^(1/2)?",
    answer: "They are mathematically equivalent: √x = x^(1/2). Similarly, ∛x = x^(1/3), and the nth root of x equals x^(1/n). This relationship is useful because it allows you to apply exponent rules to radical expressions."
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

export default function SolveRadicalEquationsCalculator() {
  const [activeTab, setActiveTab] = useState<'type1' | 'type2' | 'type3' | 'type4'>('type1');

  // Tab 1: √(ax + b) = c
  const [t1a, setT1a] = useState('2');
  const [t1b, setT1b] = useState('3');
  const [t1c, setT1c] = useState('5');

  // Tab 2: √(ax + b) + c = d
  const [t2a, setT2a] = useState('3');
  const [t2b, setT2b] = useState('1');
  const [t2c, setT2c] = useState('2');
  const [t2d, setT2d] = useState('6');

  // Tab 3: √(ax + b) = √(cx + d)
  const [t3a, setT3a] = useState('2');
  const [t3b, setT3b] = useState('5');
  const [t3c, setT3c] = useState('1');
  const [t3d, setT3d] = useState('8');

  // Tab 4: ∛(ax + b) = c
  const [t4a, setT4a] = useState('1');
  const [t4b, setT4b] = useState('7');
  const [t4c, setT4c] = useState('2');

  // Tab 1: √(ax + b) = c results
  const type1Results = useMemo(() => {
    const a = parseFloat(t1a);
    const b = parseFloat(t1b);
    const c = parseFloat(t1c);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return null;

    const steps: string[] = [];
    const equation = `√(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}`;
    steps.push(`Original equation: ${equation}`);

    // Check if c is negative (no real solution)
    if (c < 0) {
      steps.push(`Since ${c} < 0 and square roots cannot be negative, there is NO REAL SOLUTION.`);
      return { steps, solution: null, isValid: false, noSolution: true };
    }

    // Step 1: Square both sides
    const cSquared = c * c;
    steps.push(`Step 1: Square both sides: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}² = ${cSquared}`);

    // Step 2: Subtract b
    const rightSide = cSquared - b;
    steps.push(`Step 2: Subtract ${b}: ${a}x = ${cSquared} - ${b} = ${rightSide}`);

    // Step 3: Divide by a
    const x = rightSide / a;
    steps.push(`Step 3: Divide by ${a}: x = ${rightSide} / ${a} = ${x}`);

    // Step 4: Verify
    const verify = a * x + b;
    const sqrtVerify = Math.sqrt(verify);
    const isValid = verify >= 0 && Math.abs(sqrtVerify - c) < 0.0001;

    steps.push(`Step 4: Verify - √(${a}(${x}) + ${b}) = √(${verify.toFixed(4)}) = ${sqrtVerify.toFixed(4)}`);

    if (isValid) {
      steps.push(`✓ Solution verified: ${sqrtVerify.toFixed(4)} = ${c}`);
    } else {
      steps.push(`✗ EXTRANEOUS SOLUTION: √(${verify.toFixed(4)}) ≠ ${c}`);
    }

    return { steps, solution: x, isValid, noSolution: false };
  }, [t1a, t1b, t1c]);

  // Tab 2: √(ax + b) + c = d results
  const type2Results = useMemo(() => {
    const a = parseFloat(t2a);
    const b = parseFloat(t2b);
    const c = parseFloat(t2c);
    const d = parseFloat(t2d);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || a === 0) return null;

    const steps: string[] = [];
    const equation = `√(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = ${d}`;
    steps.push(`Original equation: ${equation}`);

    // Step 1: Isolate radical
    const isolatedRight = d - c;
    steps.push(`Step 1: Isolate the radical: √(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${d} - ${c} = ${isolatedRight}`);

    // Check if isolated value is negative
    if (isolatedRight < 0) {
      steps.push(`Since ${isolatedRight} < 0 and square roots cannot be negative, there is NO REAL SOLUTION.`);
      return { steps, solution: null, isValid: false, noSolution: true };
    }

    // Step 2: Square both sides
    const squared = isolatedRight * isolatedRight;
    steps.push(`Step 2: Square both sides: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${isolatedRight}² = ${squared}`);

    // Step 3: Subtract b
    const rightSide = squared - b;
    steps.push(`Step 3: Subtract ${b}: ${a}x = ${squared} - ${b} = ${rightSide}`);

    // Step 4: Divide by a
    const x = rightSide / a;
    steps.push(`Step 4: Divide by ${a}: x = ${rightSide} / ${a} = ${x}`);

    // Step 5: Verify
    const verify = a * x + b;
    const sqrtVerify = verify >= 0 ? Math.sqrt(verify) : NaN;
    const finalCheck = sqrtVerify + c;
    const isValid = !isNaN(sqrtVerify) && Math.abs(finalCheck - d) < 0.0001;

    steps.push(`Step 5: Verify - √(${a}(${x}) + ${b}) + ${c} = √(${verify.toFixed(4)}) + ${c} = ${sqrtVerify.toFixed(4)} + ${c} = ${finalCheck.toFixed(4)}`);

    if (isValid) {
      steps.push(`✓ Solution verified: ${finalCheck.toFixed(4)} = ${d}`);
    } else {
      steps.push(`✗ EXTRANEOUS SOLUTION: Result ≠ ${d}`);
    }

    return { steps, solution: x, isValid, noSolution: false };
  }, [t2a, t2b, t2c, t2d]);

  // Tab 3: √(ax + b) = √(cx + d) results
  const type3Results = useMemo(() => {
    const a = parseFloat(t3a);
    const b = parseFloat(t3b);
    const c = parseFloat(t3c);
    const d = parseFloat(t3d);

    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return null;

    const steps: string[] = [];
    const equation = `√(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = √(${c}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)})`;
    steps.push(`Original equation: ${equation}`);

    // Step 1: Square both sides
    steps.push(`Step 1: Square both sides: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}x ${d >= 0 ? '+' : '-'} ${Math.abs(d)}`);

    // Step 2: Move x terms to one side
    const xCoeff = a - c;
    const constant = d - b;
    steps.push(`Step 2: Rearrange: ${a}x - ${c}x = ${d} - ${b}`);
    steps.push(`        ${xCoeff}x = ${constant}`);

    if (xCoeff === 0) {
      if (constant === 0) {
        steps.push(`Since 0x = 0, the equation is true for all x where both radicands are non-negative.`);
        return { steps, solution: 'All x where both radicands ≥ 0', isValid: true, noSolution: false, infinite: true };
      } else {
        steps.push(`Since 0x = ${constant} (and ${constant} ≠ 0), there is NO SOLUTION.`);
        return { steps, solution: null, isValid: false, noSolution: true };
      }
    }

    // Step 3: Divide
    const x = constant / xCoeff;
    steps.push(`Step 3: Divide by ${xCoeff}: x = ${constant} / ${xCoeff} = ${x}`);

    // Step 4: Verify
    const leftRadicand = a * x + b;
    const rightRadicand = c * x + d;
    const leftSqrt = leftRadicand >= 0 ? Math.sqrt(leftRadicand) : NaN;
    const rightSqrt = rightRadicand >= 0 ? Math.sqrt(rightRadicand) : NaN;
    const isValid = !isNaN(leftSqrt) && !isNaN(rightSqrt) && Math.abs(leftSqrt - rightSqrt) < 0.0001;

    steps.push(`Step 4: Verify - √(${a}(${x}) + ${b}) = √(${leftRadicand.toFixed(4)}) = ${leftSqrt.toFixed(4)}`);
    steps.push(`                 √(${c}(${x}) + ${d}) = √(${rightRadicand.toFixed(4)}) = ${rightSqrt.toFixed(4)}`);

    if (isValid) {
      steps.push(`✓ Solution verified: ${leftSqrt.toFixed(4)} = ${rightSqrt.toFixed(4)}`);
    } else {
      steps.push(`✗ EXTRANEOUS SOLUTION or invalid radicand`);
    }

    return { steps, solution: x, isValid, noSolution: false };
  }, [t3a, t3b, t3c, t3d]);

  // Tab 4: ∛(ax + b) = c results
  const type4Results = useMemo(() => {
    const a = parseFloat(t4a);
    const b = parseFloat(t4b);
    const c = parseFloat(t4c);

    if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) return null;

    const steps: string[] = [];
    const equation = `∛(${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}`;
    steps.push(`Original equation: ${equation}`);

    // Step 1: Cube both sides
    const cCubed = c * c * c;
    steps.push(`Step 1: Cube both sides: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}³ = ${cCubed}`);

    // Step 2: Subtract b
    const rightSide = cCubed - b;
    steps.push(`Step 2: Subtract ${b}: ${a}x = ${cCubed} - ${b} = ${rightSide}`);

    // Step 3: Divide by a
    const x = rightSide / a;
    steps.push(`Step 3: Divide by ${a}: x = ${rightSide} / ${a} = ${x}`);

    // Step 4: Verify (cube roots can be negative, so always valid)
    const verify = a * x + b;
    const cubeRoot = Math.cbrt(verify);
    const isValid = Math.abs(cubeRoot - c) < 0.0001;

    steps.push(`Step 4: Verify - ∛(${a}(${x}) + ${b}) = ∛(${verify.toFixed(4)}) = ${cubeRoot.toFixed(4)}`);

    if (isValid) {
      steps.push(`✓ Solution verified: ${cubeRoot.toFixed(4)} = ${c}`);
    } else {
      steps.push(`✗ Calculation error`);
    }

    return { steps, solution: x, isValid, noSolution: false };
  }, [t4a, t4b, t4c]);

  // Render result panel
  const renderResults = (results: { steps: string[]; solution: number | string | null; isValid: boolean; noSolution: boolean; infinite?: boolean } | null, equationType: string) => {
    if (!results) {
      return (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
          <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>√</p>
          <p style={{ margin: 0 }}>Enter coefficients to solve</p>
        </div>
      );
    }

    return (
      <>
        {/* Solution Box */}
        <div style={{
          backgroundColor: results.noSolution ? "#FEE2E2" : results.isValid ? "#DCFCE7" : "#FEF3C7",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
          marginBottom: "20px",
          border: `2px solid ${results.noSolution ? "#FCA5A5" : results.isValid ? "#86EFAC" : "#FCD34D"}`
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: results.noSolution ? "#DC2626" : results.isValid ? "#166534" : "#92400E" }}>
            {results.noSolution ? "No Real Solution" : results.isValid ? "Solution Found" : "Extraneous Solution"}
          </p>
          {!results.noSolution && (
            <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: results.isValid ? "#16A34A" : "#B45309" }}>
              x = {typeof results.solution === 'number' ? results.solution.toFixed(4).replace(/\.?0+$/, '') : results.solution}
            </p>
          )}
          {results.noSolution && (
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>∅</p>
          )}
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem", fontWeight: "600" }}>
            Step-by-Step Solution:
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {results.steps.map((step, index) => (
              <div key={index} style={{
                padding: "10px 12px",
                backgroundColor: step.startsWith('✓') ? "#DCFCE7" : step.startsWith('✗') ? "#FEE2E2" : "#F9FAFB",
                borderRadius: "6px",
                fontSize: "0.9rem",
                color: step.startsWith('✓') ? "#166534" : step.startsWith('✗') ? "#DC2626" : "#4B5563",
                fontFamily: step.includes('=') || step.includes(':') ? "monospace" : "inherit"
              }}>
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Warning for extraneous */}
        {!results.isValid && !results.noSolution && (
          <div style={{
            backgroundColor: "#FEF3C7",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #FCD34D"
          }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
              ⚠️ <strong>Extraneous Solution:</strong> The value found does not satisfy the original equation. 
              This often happens when squaring both sides introduces false solutions.
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FFFBEB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FCD34D" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Solve Radical Equations Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>√</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Solve Radical Equations Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Solve radical equations step by step. Enter the coefficients for your equation type 
            and get detailed solutions with extraneous solution checking.
          </p>
        </div>

        {/* Quick Tip Box */}
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
                <strong>Key Tip:</strong> Always check your solutions!
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Squaring both sides can introduce extraneous solutions that don&apos;t satisfy the original equation.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("type1")}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "type1" ? "#D97706" : "#FEF3C7",
              color: activeTab === "type1" ? "white" : "#D97706",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            √(ax+b) = c
          </button>
          <button
            onClick={() => setActiveTab("type2")}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "type2" ? "#D97706" : "#FEF3C7",
              color: activeTab === "type2" ? "white" : "#D97706",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            √(ax+b) + c = d
          </button>
          <button
            onClick={() => setActiveTab("type3")}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "type3" ? "#D97706" : "#FEF3C7",
              color: activeTab === "type3" ? "white" : "#D97706",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            √(ax+b) = √(cx+d)
          </button>
          <button
            onClick={() => setActiveTab("type4")}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "type4" ? "#D97706" : "#FEF3C7",
              color: activeTab === "type4" ? "white" : "#D97706",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.9rem"
            }}
          >
            ∛(ax+b) = c
          </button>
        </div>

        {/* Tab 1: √(ax + b) = c */}
        {activeTab === 'type1' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  √(ax + b) = c
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Enter the coefficients for your equation:
                </p>

                {/* Equation Preview */}
                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontFamily: "monospace",
                  fontSize: "1.25rem",
                  color: "#92400E"
                }}>
                  √({t1a}x {parseFloat(t1b) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t1b) || 0)}) = {t1c}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      a (coefficient)
                    </label>
                    <input
                      type="number"
                      value={t1a}
                      onChange={(e) => setT1a(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #FCD34D",
                        fontSize: "1rem",
                        textAlign: "center",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      b (constant)
                    </label>
                    <input
                      type="number"
                      value={t1b}
                      onChange={(e) => setT1b(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #FCD34D",
                        fontSize: "1rem",
                        textAlign: "center",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      c (equals)
                    </label>
                    <input
                      type="number"
                      value={t1c}
                      onChange={(e) => setT1c(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #FCD34D",
                        fontSize: "1rem",
                        textAlign: "center",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Example buttons */}
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 8px 0" }}>Try these examples:</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => { setT1a('2'); setT1b('3'); setT1c('5'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(2x+3)=5</button>
                    <button onClick={() => { setT1a('1'); setT1b('-4'); setT1c('3'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(x-4)=3</button>
                    <button onClick={() => { setT1a('3'); setT1b('1'); setT1c('-2'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(3x+1)=-2</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Solution
                </h2>
              </div>
              <div style={{ padding: "24px" }}>
                {renderResults(type1Results, 'type1')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: √(ax + b) + c = d */}
        {activeTab === 'type2' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  √(ax + b) + c = d
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Equation with a constant outside the radical:
                </p>

                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontFamily: "monospace",
                  fontSize: "1.25rem",
                  color: "#92400E"
                }}>
                  √({t2a}x {parseFloat(t2b) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t2b) || 0)}) {parseFloat(t2c) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t2c) || 0)} = {t2d}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>a</label>
                    <input type="number" value={t2a} onChange={(e) => setT2a(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>b</label>
                    <input type="number" value={t2b} onChange={(e) => setT2b(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>c</label>
                    <input type="number" value={t2c} onChange={(e) => setT2c(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>d</label>
                    <input type="number" value={t2d} onChange={(e) => setT2d(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 8px 0" }}>Try these examples:</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => { setT2a('3'); setT2b('1'); setT2c('2'); setT2d('6'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(3x+1)+2=6</button>
                    <button onClick={() => { setT2a('1'); setT2b('5'); setT2c('-1'); setT2d('2'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(x+5)-1=2</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Solution</h2>
              </div>
              <div style={{ padding: "24px" }}>
                {renderResults(type2Results, 'type2')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: √(ax + b) = √(cx + d) */}
        {activeTab === 'type3' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  √(ax + b) = √(cx + d)
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Equation with radicals on both sides:
                </p>

                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontFamily: "monospace",
                  fontSize: "1.1rem",
                  color: "#92400E"
                }}>
                  √({t3a}x {parseFloat(t3b) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t3b) || 0)}) = √({t3c}x {parseFloat(t3d) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t3d) || 0)})
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>a</label>
                    <input type="number" value={t3a} onChange={(e) => setT3a(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>b</label>
                    <input type="number" value={t3b} onChange={(e) => setT3b(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>c</label>
                    <input type="number" value={t3c} onChange={(e) => setT3c(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>d</label>
                    <input type="number" value={t3d} onChange={(e) => setT3d(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 8px 0" }}>Try these examples:</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => { setT3a('2'); setT3b('5'); setT3c('1'); setT3d('8'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(2x+5)=√(x+8)</button>
                    <button onClick={() => { setT3a('3'); setT3b('2'); setT3c('2'); setT3d('7'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>√(3x+2)=√(2x+7)</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Solution</h2>
              </div>
              <div style={{ padding: "24px" }}>
                {renderResults(type3Results, 'type3')}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: ∛(ax + b) = c */}
        {activeTab === 'type4' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ∛(ax + b) = c
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Cube root equation (no extraneous solutions for cube roots):
                </p>

                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  fontFamily: "monospace",
                  fontSize: "1.25rem",
                  color: "#92400E"
                }}>
                  ∛({t4a}x {parseFloat(t4b) >= 0 ? '+' : '-'} {Math.abs(parseFloat(t4b) || 0)}) = {t4c}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>a</label>
                    <input type="number" value={t4a} onChange={(e) => setT4a(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>b</label>
                    <input type="number" value={t4b} onChange={(e) => setT4b(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>c</label>
                    <input type="number" value={t4c} onChange={(e) => setT4c(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #FCD34D", fontSize: "1rem", textAlign: "center", boxSizing: "border-box" }} />
                  </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 8px 0" }}>Try these examples:</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={() => { setT4a('1'); setT4b('7'); setT4c('2'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>∛(x+7)=2</button>
                    <button onClick={() => { setT4a('2'); setT4b('-5'); setT4c('3'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>∛(2x-5)=3</button>
                    <button onClick={() => { setT4a('1'); setT4b('0'); setT4c('-3'); }} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #FCD34D", backgroundColor: "#FFFBEB", cursor: "pointer", fontSize: "0.8rem", color: "#92400E" }}>∛(x)=-3</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FCD34D",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Solution</h2>
              </div>
              <div style={{ padding: "24px" }}>
                {renderResults(type4Results, 'type4')}
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FCD34D", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                √ How to Solve Radical Equations
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A radical equation contains a variable inside a radical symbol (like √ or ∛). 
                  Solving these equations requires isolating the radical and then eliminating it by raising both sides to an appropriate power.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step-by-Step Method</h3>
                <div style={{
                  backgroundColor: "#FFFBEB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FCD34D"
                }}>
                  <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Isolate the radical</strong> on one side of the equation</li>
                    <li><strong>Raise both sides</strong> to the power of the index (square for √, cube for ∛)</li>
                    <li><strong>Solve</strong> the resulting equation</li>
                    <li><strong>Check all solutions</strong> in the original equation</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Example: Solve √(2x + 3) = 5</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #86EFAC",
                  fontFamily: "monospace"
                }}>
                  <p style={{ margin: "0 0 8px 0" }}>√(2x + 3) = 5</p>
                  <p style={{ margin: "0 0 8px 0" }}>2x + 3 = 25 &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280", fontFamily: "sans-serif" }}>← square both sides</span></p>
                  <p style={{ margin: "0 0 8px 0" }}>2x = 22 &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280", fontFamily: "sans-serif" }}>← subtract 3</span></p>
                  <p style={{ margin: "0 0 8px 0" }}>x = 11 &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280", fontFamily: "sans-serif" }}>← divide by 2</span></p>
                  <p style={{ margin: "8px 0 0 0", fontWeight: "bold", color: "#16A34A" }}>Check: √(2(11) + 3) = √25 = 5 ✓</p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>⚠️ Watch Out for Extraneous Solutions</h3>
                <div style={{
                  backgroundColor: "#FEE2E2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FCA5A5"
                }}>
                  <p style={{ margin: "0 0 12px 0", color: "#DC2626" }}>
                    <strong>Example of an extraneous solution:</strong>
                  </p>
                  <p style={{ margin: "0 0 8px 0", fontFamily: "monospace" }}>√(x) = -3</p>
                  <p style={{ margin: "0 0 8px 0", fontFamily: "monospace" }}>x = 9 &nbsp;&nbsp;&nbsp; <span style={{ color: "#6B7280", fontFamily: "sans-serif" }}>← squaring gives this</span></p>
                  <p style={{ margin: "0", color: "#DC2626" }}>
                    <strong>But √9 = 3, not -3!</strong> So x = 9 is extraneous (no real solution exists).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FFFBEB", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📋 Key Rules</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• (√a)² = a</p>
                <p style={{ margin: 0 }}>• (∛a)³ = a</p>
                <p style={{ margin: 0 }}>• √a exists only if a ≥ 0</p>
                <p style={{ margin: 0 }}>• ∛a exists for all real a</p>
                <p style={{ margin: 0 }}>• Always check solutions!</p>
              </div>
            </div>

            {/* Common Values */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4F46E5", marginBottom: "16px" }}>🔢 Perfect Squares</h3>
              <div style={{ fontSize: "0.85rem", color: "#4338CA", lineHeight: "1.8", fontFamily: "monospace" }}>
                <p style={{ margin: 0 }}>√1=1, √4=2, √9=3</p>
                <p style={{ margin: 0 }}>√16=4, √25=5, √36=6</p>
                <p style={{ margin: 0 }}>√49=7, √64=8, √81=9</p>
                <p style={{ margin: 0 }}>√100=10, √121=11</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/solve-radical-equations-calculator" currentCategory="Math" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FCD34D", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FFFBEB", borderRadius: "8px", border: "1px solid #FCD34D" }}>
          <p style={{ fontSize: "0.75rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Note:</strong> This calculator solves common types of radical equations with one variable. 
            For more complex equations (like x + √x = 6), try isolating the radical and using quadratic methods, 
            or consult a computer algebra system for step-by-step solutions.
          </p>
        </div>
      </div>
    </div>
  );
}