"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Duration multipliers based on marriage length (Illinois law)
const DURATION_TABLE = [
  { years: "0-5", multiplier: 0.20, display: "20%" },
  { years: "5-6", multiplier: 0.24, display: "24%" },
  { years: "6-7", multiplier: 0.28, display: "28%" },
  { years: "7-8", multiplier: 0.32, display: "32%" },
  { years: "8-9", multiplier: 0.36, display: "36%" },
  { years: "9-10", multiplier: 0.40, display: "40%" },
  { years: "10-11", multiplier: 0.44, display: "44%" },
  { years: "11-12", multiplier: 0.48, display: "48%" },
  { years: "12-13", multiplier: 0.52, display: "52%" },
  { years: "13-14", multiplier: 0.56, display: "56%" },
  { years: "14-15", multiplier: 0.60, display: "60%" },
  { years: "15-16", multiplier: 0.64, display: "64%" },
  { years: "16-17", multiplier: 0.68, display: "68%" },
  { years: "17-18", multiplier: 0.72, display: "72%" },
  { years: "18-19", multiplier: 0.76, display: "76%" },
  { years: "19-20", multiplier: 0.80, display: "80%" },
  { years: "20+", multiplier: 1.00, display: "100% or Permanent" },
];

// Get duration multiplier based on years married
const getDurationMultiplier = (years: number): { multiplier: number; display: string } => {
  if (years >= 20) return { multiplier: 1.0, display: "100% (Permanent eligible)" };
  if (years >= 19) return { multiplier: 0.80, display: "80%" };
  if (years >= 18) return { multiplier: 0.76, display: "76%" };
  if (years >= 17) return { multiplier: 0.72, display: "72%" };
  if (years >= 16) return { multiplier: 0.68, display: "68%" };
  if (years >= 15) return { multiplier: 0.64, display: "64%" };
  if (years >= 14) return { multiplier: 0.60, display: "60%" };
  if (years >= 13) return { multiplier: 0.56, display: "56%" };
  if (years >= 12) return { multiplier: 0.52, display: "52%" };
  if (years >= 11) return { multiplier: 0.48, display: "48%" };
  if (years >= 10) return { multiplier: 0.44, display: "44%" };
  if (years >= 9) return { multiplier: 0.40, display: "40%" };
  if (years >= 8) return { multiplier: 0.36, display: "36%" };
  if (years >= 7) return { multiplier: 0.32, display: "32%" };
  if (years >= 6) return { multiplier: 0.28, display: "28%" };
  if (years >= 5) return { multiplier: 0.24, display: "24%" };
  return { multiplier: 0.20, display: "20%" };
};

// FAQ data
const faqs = [
  {
    question: "How is spousal support calculated in Illinois?",
    answer: "Illinois uses a statutory formula: (33.33% × Payer's Net Income) - (25% × Recipient's Net Income) = Annual Maintenance. The result cannot cause the recipient's total income to exceed 40% of the combined net income. This formula applies when combined gross income is under $500,000."
  },
  {
    question: "What is the 1/3 rule in alimony?",
    answer: "The '1/3 rule' refers to the 33.33% (one-third) of the payer's net income used in Illinois' maintenance formula. The full calculation takes 33.33% of the payer's net income and subtracts 25% of the recipient's net income to determine the support amount."
  },
  {
    question: "What disqualifies you for alimony in Illinois?",
    answer: "Factors that may disqualify or reduce alimony include: having sufficient income/assets to support yourself, short marriage duration, misconduct during marriage, cohabitation with a new partner, ability to work but choosing not to, or if combined income exceeds $500,000 (court discretion applies)."
  },
  {
    question: "Who qualifies for alimony in Illinois?",
    answer: "Either spouse can request maintenance if they lack sufficient income to meet reasonable needs. Courts consider: each spouse's income and property, standard of living during marriage, duration of marriage, age and health of both parties, contributions to the marriage (including homemaking), and career sacrifices made."
  },
  {
    question: "How long does spousal support last in Illinois?",
    answer: "Duration is based on marriage length. For marriages under 5 years, support lasts 20% of the marriage length. The percentage increases by 4% for each additional year, up to 80% for 19-20 year marriages. For marriages of 20+ years, courts may order permanent maintenance or a duration equal to the marriage length."
  },
  {
    question: "Is spousal support taxable in Illinois?",
    answer: "For divorces finalized after December 31, 2018, maintenance payments are NOT tax-deductible for the payer and NOT taxable income for the recipient. This is due to the Tax Cuts and Jobs Act of 2017 which changed the federal tax treatment of alimony."
  },
  {
    question: "Can spousal support be modified in Illinois?",
    answer: "Yes, maintenance can be modified if there's a substantial change in circumstances, such as job loss, significant income change, remarriage of the recipient, or cohabitation. Either party can petition the court for modification. Some agreements include provisions that prevent modification."
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

export default function ILSpousalSupportCalculator() {
  const [payerIncome, setPayerIncome] = useState<string>("100000");
  const [recipientIncome, setRecipientIncome] = useState<string>("40000");
  const [yearsMarried, setYearsMarried] = useState<string>("10");

  // Calculate results
  const results = useMemo(() => {
    const payer = parseFloat(payerIncome) || 0;
    const recipient = parseFloat(recipientIncome) || 0;
    const years = parseFloat(yearsMarried) || 0;

    const combinedIncome = payer + recipient;
    const maxRecipientIncome = combinedIncome * 0.40; // 40% cap

    // Base formula: 33.33% of payer - 25% of recipient
    const payerShare = payer * 0.3333;
    const recipientShare = recipient * 0.25;
    let annualMaintenance = payerShare - recipientShare;

    // Cannot be negative
    if (annualMaintenance < 0) annualMaintenance = 0;

    // Check 40% cap
    const recipientWithMaintenance = recipient + annualMaintenance;
    let cappedAmount = annualMaintenance;
    let isCapped = false;

    if (recipientWithMaintenance > maxRecipientIncome) {
      cappedAmount = maxRecipientIncome - recipient;
      if (cappedAmount < 0) cappedAmount = 0;
      isCapped = true;
    }

    const monthlyMaintenance = cappedAmount / 12;

    // Duration calculation
    const durationInfo = getDurationMultiplier(years);
    const durationYears = years * durationInfo.multiplier;
    const durationMonths = Math.round(durationYears * 12);

    // Total payments
    const totalPayments = cappedAmount * durationYears;

    // Check if guidelines apply
    const guidelinesApply = combinedIncome <= 500000;

    return {
      payerShare: payerShare.toFixed(2),
      recipientShare: recipientShare.toFixed(2),
      annualBeforeCap: annualMaintenance.toFixed(2),
      annualMaintenance: cappedAmount.toFixed(2),
      monthlyMaintenance: monthlyMaintenance.toFixed(2),
      isCapped,
      maxRecipientIncome: maxRecipientIncome.toFixed(2),
      recipientWithMaintenance: (recipient + cappedAmount).toFixed(2),
      durationMultiplier: durationInfo.display,
      durationYears: durationYears.toFixed(1),
      durationMonths,
      totalPayments: totalPayments.toFixed(2),
      combinedIncome: combinedIncome.toFixed(2),
      guidelinesApply
    };
  }, [payerIncome, recipientIncome, yearsMarried]);

  const formatCurrency = (num: string | number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseFloat(num.toString()));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>IL Spousal Support Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Illinois Spousal Support Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate Illinois maintenance (alimony) payments using the 2025 statutory formula. Calculate both payment amount and duration based on the Illinois Marriage and Dissolution of Marriage Act.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Illinois Formula (2019 Law)</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                <strong>Amount:</strong> (33.33% × Payer&apos;s Net Income) - (25% × Recipient&apos;s Net Income) • <strong>Cap:</strong> Recipient cannot exceed 40% of combined income
              </p>
            </div>
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
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Calculate Your Maintenance Estimate</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Income Inputs */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    💰 Annual Net Income
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "16px" }}>
                    Net income = Gross income minus taxes, Social Security, Medicare, and mandatory retirement contributions
                  </p>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Payer&apos;s Annual Net Income ($)
                    </label>
                    <input
                      type="number"
                      value={payerIncome}
                      onChange={(e) => setPayerIncome(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1.1rem" }}
                      placeholder="Higher-earning spouse"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Recipient&apos;s Annual Net Income ($)
                    </label>
                    <input
                      type="number"
                      value={recipientIncome}
                      onChange={(e) => setRecipientIncome(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1.1rem" }}
                      placeholder="Lower-earning spouse"
                    />
                  </div>
                </div>

                {/* Marriage Duration */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    💍 Marriage Duration
                  </h3>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Years Married
                    </label>
                    <input
                      type="number"
                      value={yearsMarried}
                      onChange={(e) => setYearsMarried(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1.1rem" }}
                      min="0"
                      step="1"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                    {[5, 10, 15, 20].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setYearsMarried(yr.toString())}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: yearsMarried === yr.toString() ? "2px solid #059669" : "1px solid #D1D5DB",
                          backgroundColor: yearsMarried === yr.toString() ? "#ECFDF5" : "white",
                          color: yearsMarried === yr.toString() ? "#059669" : "#374151",
                          cursor: "pointer",
                          fontWeight: "500",
                          fontSize: "0.85rem"
                        }}
                      >
                        {yr} years
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guidelines Notice */}
                {!results.guidelinesApply && (
                  <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <p style={{ fontSize: "0.85rem", color: "#991B1B", margin: 0 }}>
                      ⚠️ <strong>Note:</strong> Combined income exceeds $500,000. Statutory guidelines may not apply, and the court has discretion in determining maintenance.
                    </p>
                  </div>
                )}
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ backgroundColor: "#1E40AF", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Estimated Monthly Maintenance</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatCurrency(results.monthlyMaintenance)}
                  </p>
                  <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {formatCurrency(results.annualMaintenance)} per year
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📐 Calculation Breakdown</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #BFDBFE" }}>
                      <span style={{ color: "#6B7280" }}>33.33% of Payer&apos;s Income</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(results.payerShare)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #BFDBFE" }}>
                      <span style={{ color: "#6B7280" }}>25% of Recipient&apos;s Income</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>- {formatCurrency(results.recipientShare)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#374151", fontWeight: "600" }}>Annual Maintenance</span>
                      <span style={{ fontWeight: "700", color: "#1E40AF" }}>{formatCurrency(results.annualMaintenance)}</span>
                    </div>
                  </div>
                </div>

                {/* 40% Cap Warning */}
                {results.isCapped && (
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", marginBottom: "20px", border: "1px solid #FCD34D" }}>
                    <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                      ⚠️ <strong>40% Cap Applied:</strong> The calculated amount was reduced from {formatCurrency(results.annualBeforeCap)} to {formatCurrency(results.annualMaintenance)} so the recipient&apos;s total income ({formatCurrency(results.recipientWithMaintenance)}) doesn&apos;t exceed 40% of combined income ({formatCurrency(results.maxRecipientIncome)}).
                    </p>
                  </div>
                )}

                {/* Duration */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>⏱️ Payment Duration</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Marriage Length</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{yearsMarried} years</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Duration Multiplier</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{results.durationMultiplier}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#374151", fontWeight: "600" }}>Estimated Duration</span>
                      <span style={{ fontWeight: "700", color: "#059669" }}>{results.durationYears} years ({results.durationMonths} months)</span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#374151", fontWeight: "600" }}>Estimated Total Payments</span>
                    <span style={{ fontWeight: "700", color: "#111827", fontSize: "1.25rem" }}>{formatCurrency(results.totalPayments)}</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                    Based on {formatCurrency(results.annualMaintenance)}/year × {results.durationYears} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Duration Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📅 Illinois Maintenance Duration Chart</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Duration is calculated as a percentage of the marriage length</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Years Married</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Duration Multiplier</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Example Duration</th>
                </tr>
              </thead>
              <tbody>
                {DURATION_TABLE.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{row.years} years</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#1E40AF", fontWeight: "600" }}>{row.display}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {row.years === "20+" ? "20+ years or permanent" : 
                        `${(parseInt(row.years.split("-")[0]) * row.multiplier).toFixed(1)} years`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* How Formula Works */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>How Illinois Spousal Support is Calculated</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                Illinois uses a statutory formula established in the Illinois Marriage and Dissolution of Marriage Act (750 ILCS 5/504). The formula was updated in 2019 to use <strong>net income</strong> instead of gross income.
              </p>
              
              <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>The Formula</h3>
                <p style={{ fontFamily: "monospace", fontSize: "1rem", color: "#1E40AF", margin: 0, padding: "12px", backgroundColor: "white", borderRadius: "4px" }}>
                  Maintenance = (33.33% × Payer&apos;s Net Income) - (25% × Recipient&apos;s Net Income)
                </p>
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Net Income</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Gross income minus taxes, Social Security, Medicare, and mandatory retirement.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Apply the Formula</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Take 33.33% of the payer&apos;s net income and subtract 25% of the recipient&apos;s net income.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Check the 40% Cap</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Recipient&apos;s total income (their income + maintenance) cannot exceed 40% of combined net income.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Determine Duration</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Use the duration chart based on marriage length (20% to 100% of marriage years).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Income Definition */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>What is &quot;Net Income&quot; for Illinois Maintenance?</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                Net income for spousal maintenance in Illinois is defined in 750 ILCS 5/505. It starts with all income from various sources and subtracts mandatory deductions:
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "12px" }}>✅ Included in Gross Income</h4>
                  <ul style={{ fontSize: "0.85rem", color: "#065F46", margin: 0, paddingLeft: "16px" }}>
                    <li style={{ marginBottom: "6px" }}>Salary and wages</li>
                    <li style={{ marginBottom: "6px" }}>Bonuses and commissions</li>
                    <li style={{ marginBottom: "6px" }}>Self-employment income</li>
                    <li style={{ marginBottom: "6px" }}>Investment income</li>
                    <li style={{ marginBottom: "6px" }}>Rental income</li>
                    <li>Pension/retirement income</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#FEF2F2", padding: "20px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "12px" }}>➖ Deducted from Gross</h4>
                  <ul style={{ fontSize: "0.85rem", color: "#991B1B", margin: 0, paddingLeft: "16px" }}>
                    <li style={{ marginBottom: "6px" }}>Federal income taxes</li>
                    <li style={{ marginBottom: "6px" }}>State income taxes</li>
                    <li style={{ marginBottom: "6px" }}>Social Security (FICA)</li>
                    <li style={{ marginBottom: "6px" }}>Medicare</li>
                    <li style={{ marginBottom: "6px" }}>Mandatory retirement contributions</li>
                    <li>Union dues (if mandatory)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Numbers */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>📊 Key Numbers</h3>
              <div style={{ fontSize: "0.85rem", color: "#1E40AF" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>Payer&apos;s Share</span>
                  <span style={{ fontWeight: "600" }}>33.33%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>Recipient&apos;s Share</span>
                  <span style={{ fontWeight: "600" }}>25%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>Income Cap</span>
                  <span style={{ fontWeight: "600" }}>40%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Guidelines Limit</span>
                  <span style={{ fontWeight: "600" }}>$500K</span>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Important Notes</h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>This is an estimate only</li>
                <li style={{ marginBottom: "8px" }}>Courts may deviate from guidelines</li>
                <li style={{ marginBottom: "8px" }}>Many factors affect final amounts</li>
                <li style={{ marginBottom: "8px" }}>Consult with an Illinois family law attorney</li>
                <li>Tax treatment changed in 2019</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/il-spousal-support-calculator" currentCategory="Finance" />
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
            ⚖️ <strong>Disclaimer:</strong> This calculator provides estimates based on the Illinois statutory guidelines (750 ILCS 5/504) for informational purposes only. It is not legal advice. Actual maintenance amounts may vary based on many factors considered by the court. Always consult a licensed Illinois family law attorney for guidance specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}