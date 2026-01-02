"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Quick reference data
const quickReference = [
  { higher: 4000, lower: 1000 },
  { higher: 5000, lower: 2000 },
  { higher: 6000, lower: 2500 },
  { higher: 7000, lower: 3000 },
  { higher: 8000, lower: 3500 },
  { higher: 10000, lower: 4000 },
  { higher: 12000, lower: 5000 },
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate spousal support in Pennsylvania?",
    answer: "Pennsylvania uses a formula-based calculation for spousal support and APL (Alimony Pendente Lite). Without dependent children: (33% × higher earner's net income) - (40% × lower earner's net income). With dependent children: (25% × higher earner's net income) - (30% × lower earner's net income). Net income is gross income minus taxes, Social Security, Medicare, and mandatory deductions."
  },
  {
    question: "What is a fair amount of spousal support?",
    answer: "In Pennsylvania, 'fair' is determined by the statutory formula. For example, if one spouse earns $6,000/month net and the other earns $2,000/month net with no children, support would be $1,180/month ($6,000 × 33% - $2,000 × 40%). The formula ensures consistency across cases, though courts can deviate in exceptional circumstances."
  },
  {
    question: "What disqualifies you from alimony in PA?",
    answer: "In Pennsylvania, adultery can disqualify a spouse from receiving spousal support. If proven, the unfaithful spouse loses their right to spousal support (though APL may still be awarded during divorce proceedings). Other factors include criminal conduct against the spouse, abuse, or voluntary unemployment to avoid paying support."
  },
  {
    question: "How long do you get spousal support in PA?",
    answer: "Spousal support continues until: (1) the divorce complaint is filed (then it converts to APL), (2) the spouses reconcile, (3) the receiving spouse remarries or cohabitates, or (4) either spouse dies. APL continues until the divorce is finalized. Post-divorce alimony duration varies based on marriage length and other factors—there's no set formula."
  },
  {
    question: "What is the difference between APL and alimony in PA?",
    answer: "Spousal Support is paid after separation but before divorce filing. APL (Alimony Pendente Lite) is paid during divorce proceedings—both use the same formula. Post-divorce Alimony is paid after divorce is final and has no set formula; courts consider 17 factors including marriage length, earning capacity, age, health, and standard of living."
  },
  {
    question: "Is spousal support taxable in Pennsylvania?",
    answer: "Since January 1, 2019 (per the Tax Cuts and Jobs Act), spousal support, APL, and alimony are NOT tax-deductible for the payer and NOT taxable income for the recipient for federal taxes. Pennsylvania state tax treatment follows federal rules. This change significantly impacted how support is calculated."
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
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function PASpousalSupportCalculator() {
  // Inputs
  const [higherIncome, setHigherIncome] = useState<string>("5000");
  const [lowerIncome, setLowerIncome] = useState<string>("2000");
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  
  // Results
  const [results, setResults] = useState({
    higherPercent: 0,
    lowerPercent: 0,
    higherAmount: 0,
    lowerAmount: 0,
    monthlySupport: 0,
    yearlySupport: 0,
    higherPercentRate: 33,
    lowerPercentRate: 40,
  });

  // Calculate
  useEffect(() => {
    const higher = parseFloat(higherIncome) || 0;
    const lower = parseFloat(lowerIncome) || 0;
    
    // Determine rates based on children
    const higherRate = hasChildren ? 0.25 : 0.33;
    const lowerRate = hasChildren ? 0.30 : 0.40;
    
    // Calculate amounts
    const higherAmount = higher * higherRate;
    const lowerAmount = lower * lowerRate;
    
    // Calculate support (cannot be negative)
    const monthlySupport = Math.max(0, higherAmount - lowerAmount);
    const yearlySupport = monthlySupport * 12;
    
    setResults({
      higherPercent: higherRate * 100,
      lowerPercent: lowerRate * 100,
      higherAmount,
      lowerAmount,
      monthlySupport,
      yearlySupport,
      higherPercentRate: hasChildren ? 25 : 33,
      lowerPercentRate: hasChildren ? 30 : 40,
    });
  }, [higherIncome, lowerIncome, hasChildren]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate for quick reference
  const calculateSupport = (higher: number, lower: number, withChildren: boolean): number => {
    const higherRate = withChildren ? 0.25 : 0.33;
    const lowerRate = withChildren ? 0.30 : 0.40;
    return Math.max(0, (higher * higherRate) - (lower * lowerRate));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>PA Spousal Support Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              PA Spousal Support Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Pennsylvania spousal support and alimony pendente lite (APL) using the official PA guidelines formula. Effective January 1, 2019.
          </p>
        </div>

        {/* Legal Notice Banner */}
        <div style={{
          backgroundColor: "#FEF2F2",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #FECACA",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          <div>
            <p style={{ fontWeight: "600", color: "#DC2626", margin: "0 0 4px 0" }}>
              Legal Disclaimer
            </p>
            <p style={{ fontSize: "0.875rem", color: "#B91C1C", margin: 0 }}>
              This calculator provides estimates only based on PA guidelines (231 Pa. Code § 1910.16-4). Actual support may differ based on court discretion and specific circumstances. This is NOT legal advice—consult a Pennsylvania family law attorney for your situation.
            </p>
          </div>
        </div>

        {/* Calculator */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          marginBottom: "40px",
          overflow: "hidden"
        }}>
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💼 Income Information
                </h3>

                {/* Higher Earner Income */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Higher Earner&apos;s Monthly Net Income
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                    <input
                      type="number"
                      value={higherIncome}
                      onChange={(e) => setHigherIncome(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      placeholder="5000"
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    After taxes, Social Security, Medicare
                  </p>
                </div>

                {/* Lower Earner Income */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Lower Earner&apos;s Monthly Net Income
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                    <input
                      type="number"
                      value={lowerIncome}
                      onChange={(e) => setLowerIncome(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      placeholder="2000"
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    After taxes, Social Security, Medicare
                  </p>
                </div>

                {/* Children Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Do you have dependent children?
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button
                      onClick={() => setHasChildren(false)}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: !hasChildren ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: !hasChildren ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>👤👤</span>
                      <p style={{ fontWeight: "600", color: !hasChildren ? "#7C3AED" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        No Children
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>33% / 40% formula</p>
                    </button>
                    <button
                      onClick={() => setHasChildren(true)}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: hasChildren ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: hasChildren ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>👨‍👩‍👧</span>
                      <p style={{ fontWeight: "600", color: hasChildren ? "#7C3AED" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        With Children
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>25% / 30% formula</p>
                    </button>
                  </div>
                </div>

                {/* Formula Display */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#5B21B6", marginBottom: "8px" }}>
                    📐 Formula Applied:
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#6D28D9", margin: 0, fontFamily: "monospace" }}>
                    ({results.higherPercentRate}% × Higher) − ({results.lowerPercentRate}% × Lower)
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results" style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px", border: "2px solid #DDD6FE" }}>
                <h3 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💰 Estimated Spousal Support
                </h3>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#7C3AED",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Monthly Support
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 8px 0" }}>
                    {formatCurrency(results.monthlySupport)}
                  </p>
                  <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {formatCurrency(results.yearlySupport)} / year
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                    📊 Calculation Breakdown:
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                        {results.higherPercentRate}% of {formatCurrency(parseFloat(higherIncome) || 0)}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#059669" }}>
                        {formatCurrency(results.higherAmount)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                        {results.lowerPercentRate}% of {formatCurrency(parseFloat(lowerIncome) || 0)}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#DC2626" }}>
                        − {formatCurrency(results.lowerAmount)}
                      </span>
                    </div>
                    <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: "8px", marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                          Support Amount
                        </span>
                        <span style={{ fontSize: "1rem", fontWeight: "700", color: "#7C3AED" }}>
                          {formatCurrency(results.monthlySupport)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Direction */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#065F46", margin: 0 }}>
                    ➡️ <strong>Payment Direction:</strong> Higher earner ({formatCurrency(parseFloat(higherIncome) || 0)}/mo) pays lower earner ({formatCurrency(parseFloat(lowerIncome) || 0)}/mo)
                  </p>
                </div>

                {/* Income Difference */}
                <div style={{ backgroundColor: "white", padding: "12px 16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Income Difference:</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                      {formatCurrency((parseFloat(higherIncome) || 0) - (parseFloat(lowerIncome) || 0))}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Support as % of Difference:</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>
                      {((results.monthlySupport / ((parseFloat(higherIncome) || 0) - (parseFloat(lowerIncome) || 1))) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 PA Spousal Support Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Monthly support amounts based on PA guidelines formula
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Higher Earner</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Lower Earner</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F5F3FF" }}>No Children (33/40)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>With Children (25/30)</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                      {formatCurrency(row.higher)}/mo
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>
                      {formatCurrency(row.lower)}/mo
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#7C3AED", fontWeight: "600" }}>
                      {formatCurrency(calculateSupport(row.higher, row.lower, false))}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#B45309", fontWeight: "600" }}>
                      {formatCurrency(calculateSupport(row.higher, row.lower, true))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Net income = gross income minus taxes, Social Security, Medicare, and mandatory deductions. Actual amounts may vary.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Three Types of Support */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 Three Types of Support in Pennsylvania
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ backgroundColor: "#F5F3FF", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "8px" }}>1️⃣ Spousal Support</h4>
                  <p style={{ fontSize: "0.875rem", color: "#6D28D9", margin: "0 0 8px 0" }}>
                    <strong>When:</strong> After separation, before divorce complaint is filed
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#6D28D9", margin: 0 }}>
                    <strong>Calculation:</strong> Formula-based (this calculator)
                  </p>
                </div>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>2️⃣ Alimony Pendente Lite (APL)</h4>
                  <p style={{ fontSize: "0.875rem", color: "#1E3A8A", margin: "0 0 8px 0" }}>
                    <strong>When:</strong> After divorce complaint filed, until divorce finalized
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#1E3A8A", margin: 0 }}>
                    <strong>Calculation:</strong> Same formula as spousal support
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>3️⃣ Post-Divorce Alimony</h4>
                  <p style={{ fontSize: "0.875rem", color: "#A16207", margin: "0 0 8px 0" }}>
                    <strong>When:</strong> After divorce is final
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#A16207", margin: 0 }}>
                    <strong>Calculation:</strong> No formula—court considers 17 statutory factors
                  </p>
                </div>
              </div>
            </div>

            {/* Formula Explanation */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 PA Spousal Support Formula Explained
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>Without Dependent Children</h4>
                  <div style={{ backgroundColor: "#E5E7EB", padding: "12px", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                    Support = (33% × Higher Income) − (40% × Lower Income)
                  </div>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px" }}>With Dependent Children</h4>
                  <div style={{ backgroundColor: "#E5E7EB", padding: "12px", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.9rem" }}>
                    Support = (25% × Higher Income) − (30% × Lower Income)
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "8px", marginBottom: 0 }}>
                    * Lower percentages because child support will also be calculated separately
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "8px" }}>📝 Net Income Includes:</h4>
                  <ul style={{ fontSize: "0.85rem", color: "#047857", margin: 0, paddingLeft: "20px" }}>
                    <li>Wages, salaries, bonuses, commissions</li>
                    <li>Business income, rental income</li>
                    <li>Interest, dividends, investments</li>
                    <li>Social Security, disability benefits</li>
                    <li>Minus: taxes, Social Security, Medicare, mandatory deductions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Points */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📌 Key Points
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Tax Status:</strong> Not deductible/taxable (post-2019)
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Adultery:</strong> May disqualify from receiving
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Ends:</strong> Remarriage, death, reconciliation
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Calculated:</strong> Before child support (post-2019)
                  </p>
                </div>
              </div>
            </div>

            {/* Disqualifying Factors */}
            <div style={{
              backgroundColor: "#FEF2F2",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FECACA"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "12px" }}>
                ❌ What Disqualifies You
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#B91C1C", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "6px" }}>Proven adultery</li>
                <li style={{ marginBottom: "6px" }}>Criminal conduct against spouse</li>
                <li style={{ marginBottom: "6px" }}>Abuse or domestic violence</li>
                <li>Voluntary unemployment to avoid paying</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/pa-spousal-support-calculator"
              currentCategory="Finance"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
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
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#B91C1C", textAlign: "center", margin: 0 }}>
            ⚖️ <strong>Important:</strong> This calculator provides estimates based on Pennsylvania support guidelines (231 Pa. Code § 1910.16-4). Results are for informational purposes only and do not constitute legal advice. Courts may deviate from guidelines based on specific circumstances. For accurate legal guidance, consult a licensed Pennsylvania family law attorney.
          </p>
        </div>
      </div>
    </div>
  );
}
