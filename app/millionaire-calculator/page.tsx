"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Return rate options
const returnRates = [
  { id: "conservative", name: "Conservative (6%)", rate: 0.06, description: "Bonds, CDs, stable investments" },
  { id: "moderate", name: "Moderate (8%)", rate: 0.08, description: "S&P 500 historical average" },
  { id: "aggressive", name: "Aggressive (10%)", rate: 0.10, description: "Growth stocks, higher risk" }
];

// Savings reference data (at 8% return, starting from $0)
const savingsReference = [
  { startAge: 25, targetAge: 65, years: 40, monthly: 286 },
  { startAge: 30, targetAge: 65, years: 35, monthly: 436 },
  { startAge: 35, targetAge: 65, years: 30, monthly: 671 },
  { startAge: 40, targetAge: 65, years: 25, monthly: 1051 },
  { startAge: 45, targetAge: 65, years: 20, monthly: 1698 },
  { startAge: 50, targetAge: 65, years: 15, monthly: 2890 },
  { startAge: 55, targetAge: 65, years: 10, monthly: 5466 }
];

// Milestones
const milestones = [
  { amount: 100000, label: "$100K", color: "#10B981" },
  { amount: 250000, label: "$250K", color: "#3B82F6" },
  { amount: 500000, label: "$500K", color: "#8B5CF6" },
  { amount: 1000000, label: "$1M", color: "#F59E0B" },
  { amount: 2000000, label: "$2M", color: "#EF4444" }
];

// FAQ data
const faqs = [
  {
    question: "How long will it take to become a millionaire if I invest $1000 a month?",
    answer: "At an 8% annual return (S&P 500 historical average), investing $1,000/month starting from $0 will make you a millionaire in approximately 25-26 years. At 6% return, it takes about 33 years. At 10% return, only about 22 years. The key factors are your return rate and consistency—starting early dramatically reduces the time needed due to compound interest."
  },
  {
    question: "How much do I need to save monthly to become a millionaire by 65?",
    answer: "It depends on when you start (at 8% annual return): Start at 25 → $286/month. Start at 30 → $436/month. Start at 35 → $671/month. Start at 40 → $1,051/month. Start at 45 → $1,698/month. Starting just 10 years earlier can cut your required savings by more than half—that's the power of compound interest."
  },
  {
    question: "How much interest does $1,000,000 make a year?",
    answer: "It depends on where you invest: High-yield savings (4-5%): $40,000-$50,000/year. Bonds/CDs (5-6%): $50,000-$60,000/year. Dividend stocks (3-4%): $30,000-$40,000/year. S&P 500 index (8% avg): $80,000/year average (but varies significantly year to year). Following the 4% rule, $1 million can safely generate about $40,000/year in retirement income."
  },
  {
    question: "How to save a million dollars in 10 years?",
    answer: "To reach $1 million in 10 years at 8% return, you need to invest approximately $5,466/month ($65,600/year) starting from zero. If you already have $200,000 saved, you'd need about $3,800/month. If you have $500,000, you'd need about $1,900/month. Aggressive saving, high income, and maximizing tax-advantaged accounts (401k, IRA) are essential for this timeline."
  },
  {
    question: "What is the fastest way to become a millionaire through investing?",
    answer: "The fastest paths involve: 1) Starting early—compound interest needs time. 2) Maximizing savings rate—save 30-50% of income if possible. 3) Investing aggressively in growth assets (stocks, index funds). 4) Tax-advantaged accounts (401k match is free money). 5) Avoiding high fees. 6) Staying invested through market downturns. The \"get rich quick\" schemes usually fail—consistent investing wins."
  },
  {
    question: "How much is $1 million worth after 20 years of inflation?",
    answer: "At 3% average annual inflation, $1 million today will have the purchasing power of approximately $553,000 in 20 years. At 4% inflation, it drops to about $456,000. This is why your investment returns need to outpace inflation—a \"real\" return of 5% (8% return minus 3% inflation) actually grows your purchasing power, not just your dollar amount."
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

// Calculate years to reach target
function calculateYearsToTarget(principal: number, monthly: number, rate: number, target: number): number {
  if (rate === 0) {
    return monthly > 0 ? (target - principal) / (monthly * 12) : Infinity;
  }
  
  let balance = principal;
  let months = 0;
  const monthlyRate = rate / 12;
  
  while (balance < target && months < 1200) { // Max 100 years
    balance = balance * (1 + monthlyRate) + monthly;
    months++;
  }
  
  return months / 12;
}

// Calculate monthly savings needed
function calculateMonthlySavings(principal: number, years: number, rate: number, target: number): number {
  if (years <= 0) return 0;
  
  const months = years * 12;
  const monthlyRate = rate / 12;
  
  if (rate === 0) {
    return (target - principal) / months;
  }
  
  // Future value of principal
  const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
  
  // Amount needed from monthly contributions
  const amountNeeded = target - fvPrincipal;
  
  if (amountNeeded <= 0) return 0;
  
  // PMT formula
  const monthly = amountNeeded * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.max(0, monthly);
}

export default function MillionaireCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"time" | "savings" | "milestones">("time");
  
  // Time to Million state
  const [currentSavings, setCurrentSavings] = useState<string>("10000");
  const [monthlyContrib, setMonthlyContrib] = useState<string>("1000");
  const [returnRate, setReturnRate] = useState<string>("0.08");
  const [includeInflation, setIncludeInflation] = useState<boolean>(true);
  const inflationRate = 0.03;
  
  // Monthly Savings Needed state
  const [currentAge, setCurrentAge] = useState<string>("30");
  const [targetAge, setTargetAge] = useState<string>("65");
  const [savingsCurrentAmount, setSavingsCurrentAmount] = useState<string>("25000");
  const [savingsReturnRate, setSavingsReturnRate] = useState<string>("0.08");
  
  // Milestones state
  const [msCurrentSavings, setMsCurrentSavings] = useState<string>("5000");
  const [msMonthlyContrib, setMsMonthlyContrib] = useState<string>("500");
  const [msReturnRate, setMsReturnRate] = useState<string>("0.08");

  // Time to Million calculations
  const currentSavingsNum = parseFloat(currentSavings) || 0;
  const monthlyContribNum = parseFloat(monthlyContrib) || 0;
  const returnRateNum = parseFloat(returnRate) || 0.08;
  
  const yearsToMillion = calculateYearsToTarget(currentSavingsNum, monthlyContribNum, returnRateNum, 1000000);
  const targetYear = new Date().getFullYear() + Math.ceil(yearsToMillion);
  const totalContributed = currentSavingsNum + (monthlyContribNum * 12 * yearsToMillion);
  const interestEarned = 1000000 - totalContributed;
  
  // Inflation-adjusted value
  const realReturn = returnRateNum - inflationRate;
  const yearsToMillionReal = includeInflation ? calculateYearsToTarget(currentSavingsNum, monthlyContribNum, realReturn, 1000000) : yearsToMillion;
  const inflationAdjustedValue = 1000000 / Math.pow(1 + inflationRate, yearsToMillion);

  // Monthly Savings calculations
  const currentAgeNum = parseFloat(currentAge) || 30;
  const targetAgeNum = parseFloat(targetAge) || 65;
  const savingsCurrentNum = parseFloat(savingsCurrentAmount) || 0;
  const savingsReturnNum = parseFloat(savingsReturnRate) || 0.08;
  const yearsToTarget = targetAgeNum - currentAgeNum;
  
  const monthlyNeeded = calculateMonthlySavings(savingsCurrentNum, yearsToTarget, savingsReturnNum, 1000000);
  const totalSavingsContributed = savingsCurrentNum + (monthlyNeeded * 12 * yearsToTarget);
  const savingsInterestEarned = 1000000 - totalSavingsContributed;

  // Milestones calculations
  const msCurrentNum = parseFloat(msCurrentSavings) || 0;
  const msMonthlyNum = parseFloat(msMonthlyContrib) || 0;
  const msReturnNum = parseFloat(msReturnRate) || 0.08;
  
  const milestoneYears = milestones.map(m => ({
    ...m,
    years: calculateYearsToTarget(msCurrentNum, msMonthlyNum, msReturnNum, m.amount)
  }));

  const tabs = [
    { id: "time", label: "Time to $1M", icon: "⏱️" },
    { id: "savings", label: "Monthly Savings", icon: "💰" },
    { id: "milestones", label: "Milestones", icon: "🏆" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Millionaire Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Millionaire Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how long it takes to become a millionaire, how much to save each month, 
            and track your wealth milestones. Free tool with inflation adjustment.
          </p>
        </div>

        {/* Quick Answer Box */}
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Answer: $1,000/month at 8% return</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Starting from $0, you&apos;ll reach <strong>$1 million in ~26 years</strong>. Start at age 30 → millionaire by 56. Start at 25 → millionaire by 51!
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
                backgroundColor: activeTab === tab.id ? "#059669" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "time" && "⏱️ Your Investment Plan"}
                {activeTab === "savings" && "💰 Your Goal"}
                {activeTab === "milestones" && "🏆 Track Progress"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "time" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Current Savings ($)
                    </label>
                    <input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                      placeholder="e.g., 10000"
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

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Monthly Contribution ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyContrib}
                      onChange={(e) => setMonthlyContrib(e.target.value)}
                      placeholder="e.g., 1000"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Expected Annual Return
                    </label>
                    <select
                      value={returnRate}
                      onChange={(e) => setReturnRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {returnRates.map(r => (
                        <option key={r.id} value={r.rate}>{r.name}</option>
                      ))}
                      <option value="0.07">7% (Inflation-adjusted S&P)</option>
                      <option value="0.12">12% (Aggressive growth)</option>
                    </select>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeInflation}
                      onChange={(e) => setIncludeInflation(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                      Show inflation-adjusted value (3%/yr)
                    </span>
                  </label>
                </>
              )}

              {activeTab === "savings" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Current Age
                      </label>
                      <input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Target Age (Millionaire)
                      </label>
                      <input
                        type="number"
                        value={targetAge}
                        onChange={(e) => setTargetAge(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Current Savings ($)
                    </label>
                    <input
                      type="number"
                      value={savingsCurrentAmount}
                      onChange={(e) => setSavingsCurrentAmount(e.target.value)}
                      placeholder="0"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Expected Annual Return
                    </label>
                    <select
                      value={savingsReturnRate}
                      onChange={(e) => setSavingsReturnRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {returnRates.map(r => (
                        <option key={r.id} value={r.rate}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Years to goal:</strong> {yearsToTarget} years
                    </p>
                  </div>
                </>
              )}

              {activeTab === "milestones" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Current Savings ($)
                    </label>
                    <input
                      type="number"
                      value={msCurrentSavings}
                      onChange={(e) => setMsCurrentSavings(e.target.value)}
                      placeholder="e.g., 5000"
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

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Monthly Contribution ($)
                    </label>
                    <input
                      type="number"
                      value={msMonthlyContrib}
                      onChange={(e) => setMsMonthlyContrib(e.target.value)}
                      placeholder="e.g., 500"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Expected Annual Return
                    </label>
                    <select
                      value={msReturnRate}
                      onChange={(e) => setMsReturnRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {returnRates.map(r => (
                        <option key={r.id} value={r.rate}>{r.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      💡 <strong>Tip:</strong> The first $100K is the hardest. After that, compound interest accelerates your growth!
                    </p>
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
            <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "milestones" ? "🏆 Your Milestones" : "📊 Results"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "time" && (
                <>
                  {/* Years to Million */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Time to $1 Million</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                      {yearsToMillion < 100 ? `${yearsToMillion.toFixed(1)} years` : "100+ years"}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#D97706" }}>
                      🎯 Millionaire by <strong>{targetYear}</strong>
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Total Contributed:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${totalContributed.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Interest Earned:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>${interestEarned.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Interest %:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{((interestEarned / 1000000) * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Inflation Adjusted */}
                  {includeInflation && (
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                        ⚠️ <strong>After inflation:</strong> Your $1M will have the purchasing power of <strong>${inflationAdjustedValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong> in today&apos;s dollars.
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "savings" && (
                <>
                  {/* Monthly Needed */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Monthly Savings Needed</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${monthlyNeeded.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      to reach $1M by age {targetAgeNum}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Current Age:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{currentAgeNum}</div>
                      <div style={{ color: "#6B7280" }}>Target Age:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{targetAgeNum}</div>
                      <div style={{ color: "#6B7280" }}>Years to Save:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{yearsToTarget} years</div>
                      <div style={{ color: "#6B7280" }}>Total You&apos;ll Save:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${totalSavingsContributed.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Interest Earned:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>${savingsInterestEarned.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> Starting 5 years earlier could reduce your monthly savings by 30-40%!
                    </p>
                  </div>
                </>
              )}

              {activeTab === "milestones" && (
                <>
                  {/* Milestone Timeline */}
                  <div style={{ marginBottom: "16px" }}>
                    {milestoneYears.map((milestone, idx) => (
                      <div key={milestone.label} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: idx % 2 === 0 ? "#F9FAFB" : "white",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border: milestone.amount === 1000000 ? `2px solid ${milestone.color}` : "1px solid #E5E7EB"
                      }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          backgroundColor: milestone.color,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          marginRight: "16px",
                          flexShrink: 0
                        }}>
                          {milestone.label}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", color: "#111827" }}>
                            {milestone.years < 100 ? `${milestone.years.toFixed(1)} years` : "100+ years"}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                            Year {new Date().getFullYear() + Math.ceil(milestone.years)}
                          </div>
                        </div>
                        {milestone.amount === 1000000 && (
                          <span style={{ fontSize: "1.5rem" }}>🎉</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Insight */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3730A3" }}>
                      📈 <strong>Compound Interest Magic:</strong> Notice how the time between milestones gets shorter? That&apos;s the snowball effect of compound interest!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Monthly Savings to Become a Millionaire by 65 (at 8% Return)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Start Age</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Years to Save</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Monthly Savings</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Total Contributed</th>
                </tr>
              </thead>
              <tbody>
                {savingsReference.map((row, idx) => (
                  <tr key={row.startAge} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Age {row.startAge}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.years} years</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>${row.monthly.toLocaleString()}/mo</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>${(row.monthly * 12 * row.years).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Starting with $0. Having existing savings significantly reduces the monthly amount needed. Based on 8% average annual return (S&P 500 historical average).
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 How to Become a Millionaire</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Becoming a millionaire isn&apos;t about getting lucky or earning a six-figure salary—it&apos;s about 
                  <strong> consistent investing over time</strong>. Thanks to compound interest, even modest monthly 
                  contributions can grow into seven figures given enough time.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Power of Starting Early</h3>
                <p>
                  Starting at age 25 instead of 35 can cut your required monthly savings <strong>in half</strong>. 
                  That&apos;s because your money has 10 extra years to compound. Someone starting at 25 with just $286/month 
                  can reach the same $1 million that someone starting at 40 needs $1,051/month to achieve.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The First $100K is the Hardest</h3>
                <p>
                  A common saying in personal finance is that &quot;the first $100K is the hardest.&quot; After that, 
                  compound interest starts doing heavy lifting. At 8% return, going from $100K to $200K takes less 
                  time than going from $0 to $100K, and the acceleration continues as your balance grows.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📈 Key Numbers</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>S&P 500 Avg Return:</strong> ~10%/yr</p>
                <p style={{ margin: 0 }}><strong>After Inflation:</strong> ~7%/yr</p>
                <p style={{ margin: 0 }}><strong>Rule of 72:</strong> Years to double = 72 ÷ return%</p>
                <p style={{ margin: 0 }}><strong>At 8%:</strong> Money doubles every 9 years</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Max out 401(k) match (free money!)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use Roth IRA for tax-free growth</p>
                <p style={{ margin: "0 0 8px 0" }}>• Automate your investments</p>
                <p style={{ margin: 0 }}>• Stay invested through downturns</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/millionaire-calculator" currentCategory="Finance" />
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
            📊 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Investment returns are not guaranteed and can vary significantly. Past performance does not guarantee 
            future results. Consult a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}