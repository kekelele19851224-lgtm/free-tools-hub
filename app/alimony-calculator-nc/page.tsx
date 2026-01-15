"use client";

import { useState } from "react";
import Link from "next/link";

// Duration reference data
const durationReference = [
  { years: 5, low: 2, high: 2.5 },
  { years: 10, low: 4, high: 5 },
  { years: 15, low: 6, high: 7.5 },
  { years: 20, low: 8, high: 10 },
  { years: 25, low: 10, high: 12.5 },
  { years: 30, low: 12, high: 15 }
];

// FAQ data
const faqs = [
  {
    question: "How does NC calculate alimony?",
    answer: "North Carolina does not have an official formula for calculating alimony. Instead, judges consider 16 factors listed in N.C. Gen. Stat. § 50-16.3A, including each spouse's income, earning capacity, standard of living during marriage, duration of marriage, and marital misconduct. Many attorneys use the AAML formula (30% of payor's income minus 20% of recipient's income) as a guideline estimate."
  },
  {
    question: "What is the average length of alimony in NC?",
    answer: "The duration of alimony in NC varies based on the length of marriage and circumstances. A common guideline is 40-50% of the marriage length. For example, a 10-year marriage might result in 4-5 years of alimony. Marriages of 20+ years may result in longer or even permanent alimony if the dependent spouse cannot become self-supporting."
  },
  {
    question: "What disqualifies alimony in NC?",
    answer: "In North Carolina, alimony can be denied if the dependent spouse (the one seeking alimony) engaged in illicit sexual behavior (adultery) during the marriage before or on the date of separation. Additionally, if the recipient remarries or cohabitates with another adult in a marriage-like relationship, alimony payments will terminate."
  },
  {
    question: "What is an average alimony payment?",
    answer: "There's no fixed 'average' alimony payment as it depends entirely on both spouses' incomes. Using the AAML formula, if the payor earns $10,000/month and the recipient earns $3,000/month, the estimated alimony would be approximately $2,400/month ($10,000 × 30% - $3,000 × 20%). However, actual amounts vary significantly based on the 16 factors courts consider."
  },
  {
    question: "Can a cheating spouse get alimony in NC?",
    answer: "In North Carolina, marital misconduct significantly impacts alimony. If the dependent spouse (seeking alimony) committed adultery, the court must deny alimony. Conversely, if the supporting spouse (paying) committed adultery, the court must award alimony. If both spouses committed adultery, the court has discretion to award or deny alimony."
  },
  {
    question: "Does NC have a formula for alimony?",
    answer: "No, North Carolina does not have an official statutory formula for calculating alimony. The court has broad discretion to determine the amount and duration based on 16 factors in the law. However, many family law attorneys use the AAML (American Academy of Matrimonial Lawyers) formula as a guideline: Alimony = 30% × Payor's Income - 20% × Recipient's Income, with a cap that the recipient's total income shouldn't exceed 40% of combined income."
  },
  {
    question: "What are the 16 factors NC courts consider for alimony?",
    answer: "NC courts consider: (1) marital misconduct, (2) relative earnings, (3) ages and health, (4) duration of marriage, (5) contribution to spouse's education/career, (6) standard of living, (7) education levels, (8) assets and liabilities, (9) property brought to marriage, (10) contribution as homemaker, (11) needs of custodial parent, (12) federal tax consequences, (13) any equitable distribution award, (14) relative needs, (15) relative debt, and (16) any other relevant factor."
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

export default function AlimonyCalculatorNC() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"calculator" | "duration" | "eligibility">("calculator");

  // Tab 1: Calculator inputs
  const [payorIncome, setPayorIncome] = useState<string>("8000");
  const [recipientIncome, setRecipientIncome] = useState<string>("2000");
  const [marriageYears, setMarriageYears] = useState<string>("12");

  // Tab 2: Duration inputs
  const [durationMarriageYears, setDurationMarriageYears] = useState<string>("15");

  // Tab 3: Eligibility inputs
  const [isLowerEarning, setIsLowerEarning] = useState<boolean | null>(null);
  const [payorMisconduct, setPayorMisconduct] = useState<boolean | null>(null);
  const [recipientMisconduct, setRecipientMisconduct] = useState<boolean | null>(null);
  const [isCohabitating, setIsCohabitating] = useState<boolean | null>(null);

  // Calculate alimony using different methods
  const calcAlimony = () => {
    const payor = parseFloat(payorIncome) || 0;
    const recipient = parseFloat(recipientIncome) || 0;
    const combinedIncome = payor + recipient;

    // Method 1: AAML Formula
    // Alimony = 30% × Payor - 20% × Recipient
    let aamlAlimony = (payor * 0.30) - (recipient * 0.20);
    aamlAlimony = Math.max(0, aamlAlimony);

    // 40% Cap Check
    const maxRecipientTotal = combinedIncome * 0.40;
    const maxAlimony = maxRecipientTotal - recipient;
    if (aamlAlimony > maxAlimony && maxAlimony > 0) {
      aamlAlimony = maxAlimony;
    }

    // Method 2: Income Difference (÷2)
    let incomeDiffAlimony = (payor - recipient) / 2;
    incomeDiffAlimony = Math.max(0, incomeDiffAlimony);

    // Method 3: One-Third Rule (some jurisdictions)
    let oneThirdAlimony = (payor - recipient) / 3;
    oneThirdAlimony = Math.max(0, oneThirdAlimony);

    // Recipient total with alimony
    const recipientTotalAAML = recipient + aamlAlimony;
    const percentOfCombined = (recipientTotalAAML / combinedIncome) * 100;

    return {
      payor,
      recipient,
      combinedIncome,
      aamlAlimony,
      incomeDiffAlimony,
      oneThirdAlimony,
      recipientTotalAAML,
      percentOfCombined,
      maxAlimony
    };
  };

  // Calculate duration
  const calcDuration = () => {
    const years = parseFloat(durationMarriageYears) || 0;
    const lowRange = years * 0.40;
    const highRange = years * 0.50;
    const isPermanentPossible = years >= 20;

    return {
      years,
      lowRange,
      highRange,
      isPermanentPossible
    };
  };

  // Determine eligibility
  const determineEligibility = () => {
    // Not all questions answered
    if (isLowerEarning === null || payorMisconduct === null || recipientMisconduct === null || isCohabitating === null) {
      return { status: "incomplete", message: "Please answer all questions" };
    }

    // Cohabitating = disqualified
    if (isCohabitating) {
      return { 
        status: "disqualified", 
        message: "Cohabitation disqualifies alimony",
        detail: "Under NC law, alimony terminates if the recipient cohabitates with another adult in a marriage-like relationship."
      };
    }

    // Not lower earning = not eligible
    if (!isLowerEarning) {
      return { 
        status: "not_eligible", 
        message: "You may not be eligible for alimony",
        detail: "Alimony is typically awarded to the 'dependent spouse' - the lower-earning spouse who needs financial support."
      };
    }

    // Recipient misconduct = disqualified
    if (recipientMisconduct) {
      return { 
        status: "disqualified", 
        message: "Marital misconduct may disqualify you",
        detail: "Under NC law, if the dependent spouse (you) committed adultery before separation, the court must deny alimony."
      };
    }

    // Payor misconduct = must award
    if (payorMisconduct) {
      return { 
        status: "likely_eligible", 
        message: "You are likely eligible for alimony",
        detail: "Under NC law, if the supporting spouse committed adultery, the court must award alimony to the dependent spouse."
      };
    }

    // Default - may be eligible
    return { 
      status: "may_be_eligible", 
      message: "You may be eligible for alimony",
      detail: "Based on your answers, you may qualify for alimony. The court will consider all 16 statutory factors to make a final determination."
    };
  };

  const alimonyResult = calcAlimony();
  const durationResult = calcDuration();
  const eligibilityResult = determineEligibility();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Alimony Calculator NC</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Alimony Calculator NC
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate North Carolina spousal support using multiple calculation methods. 
            Includes duration estimator and eligibility checker based on NC alimony laws.
          </p>
        </div>

        {/* NC Law Notice */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                Important: NC Has No Official Alimony Formula
              </p>
              <p style={{ color: "#2563EB", margin: 0, fontSize: "0.95rem" }}>
                North Carolina courts have broad discretion in awarding alimony based on 16 statutory factors (N.C. Gen. Stat. § 50-16.3A). 
                This calculator uses common industry guidelines (AAML formula) for estimation purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculator" ? "#1E40AF" : "#E5E7EB",
              color: activeTab === "calculator" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Alimony Calculator
          </button>
          <button
            onClick={() => setActiveTab("duration")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "duration" ? "#1E40AF" : "#E5E7EB",
              color: activeTab === "duration" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📅 Duration Estimator
          </button>
          <button
            onClick={() => setActiveTab("eligibility")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "eligibility" ? "#1E40AF" : "#E5E7EB",
              color: activeTab === "eligibility" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ✅ Eligibility Check
          </button>
        </div>

        {/* Tab 1: Alimony Calculator */}
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
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Income Information</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Payor Income */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Payor&apos;s Gross Monthly Income
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#6B7280", fontWeight: "600" }}>$</span>
                    <input
                      type="number"
                      value={payorIncome}
                      onChange={(e) => setPayorIncome(e.target.value)}
                      placeholder="Higher-earning spouse"
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem"
                      }}
                    />
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    The spouse who would pay alimony (supporting spouse)
                  </p>
                </div>

                {/* Recipient Income */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Recipient&apos;s Gross Monthly Income
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#6B7280", fontWeight: "600" }}>$</span>
                    <input
                      type="number"
                      value={recipientIncome}
                      onChange={(e) => setRecipientIncome(e.target.value)}
                      placeholder="Lower-earning spouse"
                      style={{
                        flex: 1,
                        padding: "14px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem"
                      }}
                    />
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    The spouse who would receive alimony (dependent spouse)
                  </p>
                </div>

                {/* Marriage Length */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Length of Marriage (years)
                  </label>
                  <input
                    type="number"
                    value={marriageYears}
                    onChange={(e) => setMarriageYears(e.target.value)}
                    placeholder="Years married"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Quick Presets */}
                <div style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "16px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#374151", fontWeight: "600" }}>
                    Quick Examples:
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => { setPayorIncome("10000"); setRecipientIncome("3000"); }}
                      style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "0.8rem" }}
                    >
                      $10k / $3k
                    </button>
                    <button
                      onClick={() => { setPayorIncome("8000"); setRecipientIncome("0"); }}
                      style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "0.8rem" }}
                    >
                      $8k / $0
                    </button>
                    <button
                      onClick={() => { setPayorIncome("15000"); setRecipientIncome("5000"); }}
                      style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", cursor: "pointer", fontSize: "0.8rem" }}
                    >
                      $15k / $5k
                    </button>
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
              <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Estimated Alimony</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result - AAML */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #86EFAC"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#166534" }}>AAML Formula Estimate</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#16A34A" }}>
                    ${alimonyResult.aamlAlimony.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#15803D" }}>
                    per month (${(alimonyResult.aamlAlimony * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/year)
                  </p>
                </div>

                {/* Method Comparison */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Calculation Methods Comparison
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "6px", border: "1px solid #86EFAC" }}>
                      <span style={{ color: "#166534", fontWeight: "600" }}>AAML Formula</span>
                      <span style={{ fontWeight: "bold", color: "#16A34A" }}>${alimonyResult.aamlAlimony.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Income Difference (÷2)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${alimonyResult.incomeDiffAlimony.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>One-Third Rule</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${alimonyResult.oneThirdAlimony.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Income Summary */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    💵 Post-Alimony Income
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                      <span style={{ color: "#991B1B" }}>Payor (after paying)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>${(alimonyResult.payor - alimonyResult.aamlAlimony).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F0FDF4", borderRadius: "6px" }}>
                      <span style={{ color: "#166534" }}>Recipient (after receiving)</span>
                      <span style={{ fontWeight: "600", color: "#16A34A" }}>${alimonyResult.recipientTotalAAML.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Recipient % of combined</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{alimonyResult.percentOfCombined.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Formula Box */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E40AF", fontWeight: "600" }}>AAML Formula:</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#2563EB", fontFamily: "monospace" }}>
                    Alimony = (30% × ${alimonyResult.payor.toLocaleString()}) - (20% × ${alimonyResult.recipient.toLocaleString()})<br />
                    = ${(alimonyResult.payor * 0.30).toLocaleString()} - ${(alimonyResult.recipient * 0.20).toLocaleString()} = ${alimonyResult.aamlAlimony.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Duration Estimator */}
        {activeTab === "duration" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📅 Duration Estimator</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Marriage Length */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    Length of Marriage (years)
                  </label>
                  <input
                    type="number"
                    value={durationMarriageYears}
                    onChange={(e) => setDurationMarriageYears(e.target.value)}
                    placeholder="Years married"
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "2px solid #7C3AED",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      fontWeight: "600",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Quick Buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                  {[5, 10, 15, 20, 25, 30].map((years) => (
                    <button
                      key={years}
                      onClick={() => setDurationMarriageYears(String(years))}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: durationMarriageYears === String(years) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: durationMarriageYears === String(years) ? "#F5F3FF" : "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}
                    >
                      {years} years
                    </button>
                  ))}
                </div>

                {/* Reference Table */}
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Duration Reference Table
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F5F3FF" }}>
                        <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #E5E7EB" }}>Marriage</th>
                        <th style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>Low</th>
                        <th style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>High</th>
                      </tr>
                    </thead>
                    <tbody>
                      {durationReference.map((item) => (
                        <tr key={item.years}>
                          <td style={{ padding: "8px 10px", borderBottom: "1px solid #E5E7EB" }}>{item.years} years</td>
                          <td style={{ padding: "8px 10px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{item.low} yrs</td>
                          <td style={{ padding: "8px 10px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{item.high} yrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Estimated Duration</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Estimated Alimony Duration</p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>
                    {durationResult.lowRange.toFixed(1)} - {durationResult.highRange.toFixed(1)} years
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.95rem", color: "#6D28D9" }}>
                    ({(durationResult.lowRange * 12).toFixed(0)} - {(durationResult.highRange * 12).toFixed(0)} months)
                  </p>
                </div>

                {/* Permanent Alimony Notice */}
                {durationResult.isPermanentPossible && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E" }}>
                      ⚠️ <strong>Note:</strong> For marriages of 20+ years, courts may award <strong>permanent alimony</strong> if the dependent spouse is unlikely to become self-supporting due to age, disability, or other circumstances.
                    </p>
                  </div>
                )}

                {/* Calculation Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Calculation
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Marriage Length</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{durationResult.years} years</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Low Multiplier (×0.40)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{durationResult.lowRange.toFixed(1)} years</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>High Multiplier (×0.50)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{durationResult.highRange.toFixed(1)} years</span>
                    </div>
                  </div>
                </div>

                {/* Formula */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#5B21B6", fontWeight: "600" }}>AAML Duration Formula:</p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9", fontFamily: "monospace" }}>
                    Low Range = {durationResult.years} × 0.40 = {durationResult.lowRange.toFixed(1)} years<br />
                    High Range = {durationResult.years} × 0.50 = {durationResult.highRange.toFixed(1)} years
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Eligibility Check */}
        {activeTab === "eligibility" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>✅ Eligibility Questions</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Question 1 */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#111827" }}>
                    1. Are you the lower-earning spouse?
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setIsLowerEarning(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: isLowerEarning === true ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: isLowerEarning === true ? "#F0FDF4" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: isLowerEarning === true ? "#16A34A" : "#374151"
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsLowerEarning(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: isLowerEarning === false ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: isLowerEarning === false ? "#FEF2F2" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: isLowerEarning === false ? "#DC2626" : "#374151"
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 2 */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#111827" }}>
                    2. Did your spouse commit marital misconduct (adultery)?
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setPayorMisconduct(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: payorMisconduct === true ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: payorMisconduct === true ? "#F0FDF4" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: payorMisconduct === true ? "#16A34A" : "#374151"
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setPayorMisconduct(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: payorMisconduct === false ? "2px solid #6B7280" : "1px solid #E5E7EB",
                        backgroundColor: payorMisconduct === false ? "#F9FAFB" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: payorMisconduct === false ? "#374151" : "#374151"
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 3 */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#111827" }}>
                    3. Did YOU commit marital misconduct (adultery)?
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setRecipientMisconduct(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: recipientMisconduct === true ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: recipientMisconduct === true ? "#FEF2F2" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: recipientMisconduct === true ? "#DC2626" : "#374151"
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setRecipientMisconduct(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: recipientMisconduct === false ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: recipientMisconduct === false ? "#F0FDF4" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: recipientMisconduct === false ? "#16A34A" : "#374151"
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Question 4 */}
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#111827" }}>
                    4. Are you currently living with another person (cohabitating)?
                  </p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setIsCohabitating(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: isCohabitating === true ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: isCohabitating === true ? "#FEF2F2" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: isCohabitating === true ? "#DC2626" : "#374151"
                      }}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsCohabitating(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: isCohabitating === false ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: isCohabitating === false ? "#F0FDF4" : "white",
                        cursor: "pointer",
                        fontWeight: "600",
                        color: isCohabitating === false ? "#16A34A" : "#374151"
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setIsLowerEarning(null);
                    setPayorMisconduct(null);
                    setRecipientMisconduct(null);
                    setIsCohabitating(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    backgroundColor: "#F9FAFB",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: "#6B7280",
                    marginTop: "16px"
                  }}
                >
                  Reset Answers
                </button>
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
              <div style={{ backgroundColor: "#0E7490", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Eligibility Result</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Result */}
                {eligibilityResult.status === "incomplete" ? (
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px"
                  }}>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#6B7280" }}>
                      Please answer all questions to see your eligibility result.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: eligibilityResult.status === "likely_eligible" ? "#F0FDF4" : 
                                   eligibilityResult.status === "may_be_eligible" ? "#ECFEFF" :
                                   eligibilityResult.status === "disqualified" ? "#FEF2F2" : "#FEF3C7",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: eligibilityResult.status === "likely_eligible" ? "2px solid #86EFAC" :
                            eligibilityResult.status === "may_be_eligible" ? "2px solid #67E8F9" :
                            eligibilityResult.status === "disqualified" ? "2px solid #FECACA" : "2px solid #FCD34D"
                  }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>
                      {eligibilityResult.status === "likely_eligible" ? "✅" :
                       eligibilityResult.status === "may_be_eligible" ? "✅" :
                       eligibilityResult.status === "disqualified" ? "❌" : "⚠️"}
                    </div>
                    <p style={{ 
                      margin: "0 0 12px 0", 
                      fontSize: "1.25rem", 
                      fontWeight: "bold",
                      color: eligibilityResult.status === "likely_eligible" ? "#16A34A" :
                             eligibilityResult.status === "may_be_eligible" ? "#0891B2" :
                             eligibilityResult.status === "disqualified" ? "#DC2626" : "#D97706"
                    }}>
                      {eligibilityResult.message}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                      {eligibilityResult.detail}
                    </p>
                  </div>
                )}

                {/* NC Law Key Points */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 NC Alimony Law Key Points
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                        ❌ <strong>If you (dependent) committed adultery:</strong> Court must deny alimony
                      </p>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "6px" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
                        ✅ <strong>If your spouse (supporting) committed adultery:</strong> Court must award alimony
                      </p>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        ⚠️ <strong>Cohabitation:</strong> Alimony terminates if you live with another adult in a marriage-like relationship
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                    ⚖️ <strong>Disclaimer:</strong> This is a general screening tool only. NC courts consider 16 factors when determining alimony. Consult with a North Carolina family law attorney for advice specific to your situation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚖️ Understanding Alimony in North Carolina</h2>

          <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
            <p>
              Alimony (also called spousal support or maintenance) in North Carolina is financial support that one spouse 
              pays to the other during and/or after a divorce. Unlike child support, NC does not have a fixed formula 
              for calculating alimony—courts have broad discretion based on statutory factors.
            </p>

            <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Spousal Support in NC</h3>
            <p>
              <strong>Post-Separation Support (PSS):</strong> Temporary support paid while the divorce is pending. 
              It helps the dependent spouse maintain their lifestyle during the separation period.<br /><br />
              <strong>Alimony:</strong> Long-term support awarded after the divorce is final. It can be rehabilitative 
              (to help the spouse become self-supporting), durational (for a set time), or permanent (rare, usually for 
              long marriages where the dependent spouse cannot become self-sufficient).
            </p>

            <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 16 Factors NC Courts Consider</h3>
            <p>
              Under N.C. Gen. Stat. § 50-16.3A, courts consider multiple factors including: marital misconduct, 
              relative earnings and earning capacity, ages and health of both spouses, duration of the marriage, 
              contributions to the other spouse&apos;s education or career, standard of living during marriage, 
              education levels, assets and liabilities, property brought to the marriage, contributions as homemaker, 
              and other relevant circumstances.
            </p>

            <div style={{
              backgroundColor: "#FEF3C7",
              padding: "20px",
              borderRadius: "12px",
              margin: "20px 0",
              border: "1px solid #FCD34D"
            }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#92400E" }}>⚠️ Important: Marital Misconduct Rules</p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#B45309" }}>
                <li>If the <strong>dependent spouse</strong> (seeking alimony) committed adultery → <strong>No alimony</strong></li>
                <li>If the <strong>supporting spouse</strong> (paying) committed adultery → <strong>Must pay alimony</strong></li>
                <li>If <strong>both</strong> committed adultery → Court has discretion</li>
              </ul>
            </div>

            <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When Does Alimony End?</h3>
            <p>
              In North Carolina, alimony automatically terminates when: the recipient spouse remarries, the recipient 
              spouse begins cohabitating with another adult in a marriage-like relationship, or either spouse dies. 
              The court may also set a specific end date when awarding alimony.
            </p>
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
            ⚖️ <strong>Legal Disclaimer:</strong> This calculator provides estimates for informational purposes only and is not legal advice. 
            North Carolina courts have broad discretion in awarding alimony based on 16 statutory factors. 
            Consult with a licensed North Carolina family law attorney for advice specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}