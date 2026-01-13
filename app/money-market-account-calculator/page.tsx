"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// APY presets
const apyPresets = [
  { value: 0.5, label: "0.5%", type: "Low" },
  { value: 1, label: "1%", type: "Average" },
  { value: 2, label: "2%", type: "Good" },
  { value: 3, label: "3%", type: "Great" },
  { value: 4, label: "4%", type: "High-Yield" },
  { value: 4.5, label: "4.5%", type: "Top Rate" },
  { value: 5, label: "5%", type: "Best" }
];

// Time period presets
const timePresets = [
  { value: 1, label: "1 Year" },
  { value: 2, label: "2 Years" },
  { value: 3, label: "3 Years" },
  { value: 5, label: "5 Years" },
  { value: 10, label: "10 Years" }
];

// Compounding frequency options
const compoundingOptions = [
  { id: "daily", label: "Daily", periods: 365, description: "Most common for MMAs" },
  { id: "monthly", label: "Monthly", periods: 12, description: "Standard compounding" },
  { id: "quarterly", label: "Quarterly", periods: 4, description: "Some banks use this" },
  { id: "yearly", label: "Yearly", periods: 1, description: "Simple interest" }
];

// Account comparison data
const accountComparison = [
  { 
    type: "Money Market", 
    icon: "💰", 
    apy: "3.5% - 4.5%", 
    access: "Limited (6/month)", 
    minimum: "$1,000 - $10,000",
    fdic: "Yes",
    best: "Emergency fund, short-term savings"
  },
  { 
    type: "High-Yield Savings", 
    icon: "🏦", 
    apy: "4% - 5%", 
    access: "Limited (6/month)", 
    minimum: "$0 - $100",
    fdic: "Yes",
    best: "General savings, beginners"
  },
  { 
    type: "CD (1-Year)", 
    icon: "📜", 
    apy: "4% - 4.5%", 
    access: "None (penalty)", 
    minimum: "$500 - $1,000",
    fdic: "Yes",
    best: "Fixed goals, rate lock"
  },
  { 
    type: "Regular Savings", 
    icon: "🐷", 
    apy: "0.01% - 0.5%", 
    access: "Unlimited", 
    minimum: "$0 - $25",
    fdic: "Yes",
    best: "Convenience, traditional banks"
  }
];

// Current top rates reference
const currentRates = [
  { bank: "Quontic Bank", apy: "4.25%" },
  { bank: "Vio Bank", apy: "4.11%" },
  { bank: "Sallie Mae", apy: "4.10%" },
  { bank: "CFG Bank", apy: "4.06%" },
  { bank: "National Average", apy: "0.58%" }
];

// FAQ data
const faqs = [
  {
    question: "What is 5% APY on $5,000?",
    answer: "With 5% APY on $5,000 compounded daily, you would earn approximately $256.25 in interest after one year, for a total balance of $5,256.25. Over 5 years, your balance would grow to $6,420.13, earning $1,420.13 in total interest."
  },
  {
    question: "How much will $2,500 make in a money market account?",
    answer: "At the current high-yield MMA rate of around 4% APY, $2,500 would earn approximately $102 in interest after one year. With monthly contributions of $100, your balance would grow to $3,848 after one year. The actual amount depends on your specific APY and contribution frequency."
  },
  {
    question: "How much is $1,000 with 5% APY?",
    answer: "With 5% APY compounded daily, $1,000 grows to $1,051.27 after 1 year ($51.27 interest), $1,105.16 after 2 years, and $1,284.03 after 5 years. The power of compound interest becomes more significant over longer periods."
  },
  {
    question: "How much is $10,000 at 4.5% APY for 5 years?",
    answer: "$10,000 at 4.5% APY compounded daily for 5 years grows to $12,520.39. You would earn $2,520.39 in total interest. If you add $200 monthly contributions, your final balance would be $26,048.67."
  },
  {
    question: "How is money market interest calculated?",
    answer: "Money market interest is typically calculated using compound interest with daily compounding. The formula is: A = P(1 + r/n)^(nt), where P = principal, r = annual rate, n = compounding periods per year, and t = time in years. APY (Annual Percentage Yield) already accounts for compounding, making it easier to compare rates."
  },
  {
    question: "What is the difference between APY and interest rate?",
    answer: "Interest rate is the base rate paid on your deposit, while APY (Annual Percentage Yield) includes the effect of compound interest over a year. APY is always equal to or higher than the interest rate. For example, a 4% interest rate compounded daily equals approximately 4.08% APY. Always compare APYs when shopping for accounts."
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

export default function MoneyMarketAccountCalculator() {
  // Calculator state
  const [initialDeposit, setInitialDeposit] = useState<string>("10000");
  const [apy, setApy] = useState<string>("4");
  const [years, setYears] = useState<number>(5);
  const [monthlyContribution, setMonthlyContribution] = useState<string>("100");
  const [compounding, setCompounding] = useState<string>("daily");

  // Get compounding periods
  const compoundingPeriods = compoundingOptions.find(c => c.id === compounding)?.periods || 365;

  // Calculate results
  const calculateGrowth = (principal: number, rate: number, time: number, periods: number, monthly: number) => {
    const r = rate / 100;
    let balance = principal;
    let totalContributions = principal;
    const yearlyData: { year: number; balance: number; interest: number; contributions: number }[] = [];

    for (let year = 1; year <= time; year++) {
      // Calculate for each month in this year
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution at start of month
        balance += monthly;
        totalContributions += monthly;
        
        // Apply compound interest for this month
        const monthlyRate = r / periods;
        const periodsThisMonth = periods / 12;
        balance = balance * Math.pow(1 + monthlyRate, periodsThisMonth);
      }

      yearlyData.push({
        year,
        balance: Math.round(balance * 100) / 100,
        interest: Math.round((balance - totalContributions) * 100) / 100,
        contributions: Math.round(totalContributions * 100) / 100
      });
    }

    return {
      finalBalance: Math.round(balance * 100) / 100,
      totalInterest: Math.round((balance - totalContributions) * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      yearlyData
    };
  };

  const principal = parseFloat(initialDeposit) || 0;
  const rate = parseFloat(apy) || 0;
  const monthly = parseFloat(monthlyContribution) || 0;

  const results = calculateGrowth(principal, rate, years, compoundingPeriods, monthly);

  // Calculate comparison for different compounding frequencies
  const compoundingComparison = compoundingOptions.map(opt => {
    const res = calculateGrowth(principal, rate, 1, opt.periods, 0);
    return {
      ...opt,
      balance: res.finalBalance,
      interest: res.totalInterest
    };
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Money Market Account Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Money Market Account Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much your money market account will grow with compound interest. 
            Compare APY rates, see yearly growth, and plan your savings with monthly contributions.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #6EE7B7"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Answer: $10,000 at 4% APY</p>
              <p style={{ color: "#047857", margin: 0, fontSize: "0.95rem" }}>
                <strong>1 Year:</strong> $10,407 (+$407) | <strong>5 Years:</strong> $12,214 (+$2,214) | <strong>10 Years:</strong> $14,918 (+$4,918)
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💵 Account Details</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Initial Deposit */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Initial Deposit
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "1.1rem" }}>$</span>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(e.target.value)}
                    placeholder="10000"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 28px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* APY Rate */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  APY (Annual Percentage Yield)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  {apyPresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setApy(String(preset.value))}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: parseFloat(apy) === preset.value ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: parseFloat(apy) === preset.value ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        fontSize: "0.85rem"
                      }}
                    >
                      <span style={{ color: parseFloat(apy) === preset.value ? "#059669" : "#374151", fontWeight: "600" }}>{preset.label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={apy}
                    onChange={(e) => setApy(e.target.value)}
                    step="0.1"
                    placeholder="4.0"
                    style={{
                      width: "100%",
                      padding: "12px",
                      paddingRight: "40px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                </div>
              </div>

              {/* Time Period */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Time Period
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {timePresets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setYears(preset.value)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "6px",
                        border: years === preset.value ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: years === preset.value ? "#ECFDF5" : "white",
                        color: years === preset.value ? "#059669" : "#374151",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "500"
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Contribution */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Monthly Contribution (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "1.1rem" }}>$</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    placeholder="0"
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 28px",
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* Compounding Frequency */}
              <div>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  Compounding Frequency
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {compoundingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setCompounding(opt.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "6px",
                        border: compounding === opt.id ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: compounding === opt.id ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <span style={{ fontSize: "0.9rem", fontWeight: "600", color: compounding === opt.id ? "#059669" : "#374151" }}>{opt.label}</span>
                      <span style={{ display: "block", fontSize: "0.7rem", color: "#9CA3AF" }}>{opt.description}</span>
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
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Your Earnings</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Final Balance */}
              <div style={{
                backgroundColor: "#EDE9FE",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#6D28D9" }}>Final Balance after {years} {years === 1 ? "Year" : "Years"}</p>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#5B21B6" }}>
                  ${results.finalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#065F46" }}>Total Interest Earned</p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                    ${results.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#1D4ED8" }}>Total Contributions</p>
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                    ${results.totalContributions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Yearly Growth Table */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📈 Year-by-Year Growth</h3>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB", position: "sticky", top: 0 }}>
                        <th style={{ padding: "10px", borderBottom: "1px solid #E5E7EB", textAlign: "left" }}>Year</th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #E5E7EB", textAlign: "right" }}>Balance</th>
                        <th style={{ padding: "10px", borderBottom: "1px solid #E5E7EB", textAlign: "right" }}>Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyData.map((data) => (
                        <tr key={data.year} style={{ backgroundColor: data.year % 2 === 0 ? "#F9FAFB" : "white" }}>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>Year {data.year}</td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600" }}>
                            ${data.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>
                            +${data.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* APY Effect */}
              <div style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                padding: "12px 16px"
              }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                  <strong>💡 Tip:</strong> At {apy}% APY, you earn ${(principal * (parseFloat(apy) / 100)).toFixed(2)}/year on your initial ${principal.toLocaleString()} alone (before compounding).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Compounding Comparison */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔄 Compounding Frequency Comparison (1 Year, No Monthly Contributions)</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
              {compoundingComparison.map((comp) => (
                <div
                  key={comp.id}
                  style={{
                    padding: "16px",
                    backgroundColor: comp.id === compounding ? "#EFF6FF" : "#F9FAFB",
                    borderRadius: "10px",
                    border: comp.id === compounding ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    textAlign: "center"
                  }}
                >
                  <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#374151" }}>{comp.label}</p>
                  <p style={{ margin: "0 0 8px 0", fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                    ${comp.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#059669" }}>
                    +${comp.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} interest
                  </p>
                </div>
              ))}
            </div>
            <p style={{ margin: "16px 0 0 0", fontSize: "0.85rem", color: "#6B7280", textAlign: "center" }}>
              Daily compounding earns slightly more than yearly, but the difference is small. Most MMAs use daily compounding.
            </p>
          </div>
        </div>

        {/* Account Type Comparison */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Money Market vs Other Savings Accounts</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Account Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>APY Range</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Access</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Min Balance</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {accountComparison.map((acc, idx) => (
                  <tr key={acc.type} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                      <span style={{ marginRight: "8px" }}>{acc.icon}</span>{acc.type}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{acc.apy}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{acc.access}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{acc.minimum}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{acc.best}</td>
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 Understanding Money Market Accounts</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A money market account (MMA) is a type of savings account that typically offers <strong>higher interest rates</strong> than 
                  traditional savings accounts. As of January 2026, the best MMAs offer around <strong>4% - 4.5% APY</strong>, compared 
                  to the national average of just 0.58%.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Compound Interest Works</h3>
                <p>
                  Compound interest means you earn interest on your interest. With daily compounding (most common for MMAs), 
                  your interest is calculated and added to your balance every day. This creates a snowball effect where your 
                  earnings accelerate over time. The formula is: <strong>A = P(1 + r/n)^(nt)</strong>
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>P</strong> = Principal (initial deposit)</li>
                  <li><strong>r</strong> = Annual interest rate (as decimal)</li>
                  <li><strong>n</strong> = Number of times interest compounds per year</li>
                  <li><strong>t</strong> = Time in years</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Money Market vs High-Yield Savings</h3>
                <p>
                  Both accounts offer competitive rates, but MMAs often come with <strong>check-writing privileges</strong> and 
                  <strong> debit cards</strong>. However, they typically require higher minimum balances ($1,000-$10,000) to 
                  earn the best rates or avoid fees. High-yield savings accounts usually have lower minimums but less flexibility.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips to Maximize Your Earnings</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Compare rates:</strong> Online banks typically offer 3-4x higher rates than traditional banks</li>
                  <li><strong>Watch for fees:</strong> Monthly fees can eat into your interest earnings</li>
                  <li><strong>Set up automatic transfers:</strong> Regular contributions significantly boost long-term growth</li>
                  <li><strong>Mind the minimum:</strong> Keep enough to avoid falling below minimum balance requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Current Rates */}
            <div style={{ backgroundColor: "#EDE9FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>📈 Top MMA Rates (Jan 2026)</h3>
              <div style={{ fontSize: "0.875rem", color: "#6D28D9" }}>
                {currentRates.map((rate, idx) => (
                  <div key={rate.bank} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: idx < currentRates.length - 1 ? "1px solid #C4B5FD" : "none"
                  }}>
                    <span>{rate.bank}</span>
                    <span style={{ fontWeight: "600" }}>{rate.apy}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#7C3AED" }}>
                *Rates change frequently. Always verify current rates.
              </p>
            </div>

            {/* Quick Reference */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Quick Calculations</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>$5,000 @ 4% APY = <strong>$200/year</strong></p>
                <p style={{ margin: 0 }}>$10,000 @ 4% APY = <strong>$400/year</strong></p>
                <p style={{ margin: 0 }}>$25,000 @ 4% APY = <strong>$1,000/year</strong></p>
                <p style={{ margin: 0 }}>$50,000 @ 4% APY = <strong>$2,000/year</strong></p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/money-market-account-calculator" currentCategory="Finance" />
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
            💰 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Actual earnings may vary based on your financial institution&apos;s specific terms, rate changes, and fees. 
            APY rates are subject to change at any time. Always verify current rates with your bank before making financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}