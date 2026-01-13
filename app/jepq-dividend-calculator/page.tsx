"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// JEPQ Data (estimates based on recent data)
const jepqData = {
  price: 59.00,
  annualDividend: 6.12,
  dividendYield: 0.1037,
  monthlyDividendAvg: 0.51,
  expenseRatio: 0.35,
  dividendGrowthRate: 0.05
};

// Compare ETFs data
const compareETFs = [
  { 
    symbol: "JEPQ", 
    name: "JPMorgan Nasdaq Equity Premium Income ETF", 
    yield: 10.3, 
    frequency: "Monthly",
    expenseRatio: 0.35,
    fiveYearReturn: 52,
    focus: "Nasdaq-100 + Covered Calls",
    risk: "Moderate-High",
    bestFor: "High current income, tech exposure"
  },
  { 
    symbol: "JEPI", 
    name: "JPMorgan Equity Premium Income ETF", 
    yield: 7.5, 
    frequency: "Monthly",
    expenseRatio: 0.35,
    fiveYearReturn: 45,
    focus: "S&P 500 + Covered Calls",
    risk: "Moderate",
    bestFor: "Balanced income, lower volatility"
  },
  { 
    symbol: "SCHD", 
    name: "Schwab US Dividend Equity ETF", 
    yield: 3.8, 
    frequency: "Quarterly",
    expenseRatio: 0.06,
    fiveYearReturn: 85,
    focus: "Dividend Growth Stocks",
    risk: "Moderate",
    bestFor: "Long-term growth + rising income"
  }
];

// Income targets quick reference
const incomeTargets = [
  { monthly: 500, annual: 6000 },
  { monthly: 1000, annual: 12000 },
  { monthly: 2000, annual: 24000 },
  { monthly: 3000, annual: 36000 },
  { monthly: 5000, annual: 60000 },
  { monthly: 10000, annual: 120000 }
];

// FAQ data
const faqs = [
  {
    question: "How much dividend does JEPQ pay?",
    answer: "JEPQ pays approximately $0.44-$0.58 per share monthly, totaling around $6.12 per share annually. At the current price of ~$59, this represents a dividend yield of approximately 10.3%. Monthly payments fluctuate based on market volatility and option premiums—JEPQ uses a covered call strategy that generates variable income."
  },
  {
    question: "How much does it take to make $1000 a month in dividends from JEPQ?",
    answer: "To generate $1,000 per month ($12,000/year) from JEPQ dividends, you would need to invest approximately $116,000 at the current 10.3% yield. This equals roughly 1,966 shares at $59/share. Keep in mind that JEPQ's monthly payments vary, so some months may pay more or less than your target."
  },
  {
    question: "How much do I need to invest in JEPQ to get $5000 a month?",
    answer: "To earn $5,000 monthly ($60,000/year) from JEPQ, you would need approximately $580,000 invested at a 10.3% yield. This represents about 9,830 shares. For such large positions, consider diversifying across multiple income ETFs (JEPQ, JEPI, SCHD) to reduce concentration risk."
  },
  {
    question: "Does JEPQ pay monthly dividends?",
    answer: "Yes, JEPQ pays dividends monthly, making it popular among retirees and income investors who need regular cash flow. Since its inception in May 2022, JEPQ has paid 44+ consecutive monthly dividends without missing a payment. The ex-dividend date is typically the last business day of each month."
  },
  {
    question: "What is the difference between JEPQ and JEPI?",
    answer: "Both are JPMorgan covered call ETFs paying monthly dividends, but they track different indexes. JEPQ focuses on Nasdaq-100 stocks (tech-heavy, ~10.3% yield) with higher growth potential and volatility. JEPI tracks S&P 500 stocks (~7.5% yield) with more diversification and lower volatility. JEPQ offers higher income but more risk; JEPI provides steadier returns."
  },
  {
    question: "Is JEPQ a good investment for retirement income?",
    answer: "JEPQ can be suitable for retirement income due to its high yield (~10.3%) and monthly payments. However, consider: 1) Monthly payments fluctuate significantly, 2) Covered call strategy caps upside potential, 3) Heavy tech concentration adds volatility. Many advisors suggest combining JEPQ with JEPI (for stability) and SCHD (for dividend growth) in a diversified income portfolio."
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

export default function JEPQDividendCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"income" | "goal" | "compare">("income");
  
  // Dividend Income state
  const [investmentAmount, setInvestmentAmount] = useState<string>("10000");
  const [years, setYears] = useState<string>("10");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500");
  const [reinvestDividends, setReinvestDividends] = useState<boolean>(true);
  const [customYield, setCustomYield] = useState<string>("10.3");
  
  // Income Goal state
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<string>("1000");
  const [currentInvestment, setCurrentInvestment] = useState<string>("0");
  const [goalMonthlyContribution, setGoalMonthlyContribution] = useState<string>("1000");

  // Dividend Income calculations
  const investmentNum = parseFloat(investmentAmount) || 0;
  const yearsNum = parseFloat(years) || 0;
  const monthlyContribNum = parseFloat(monthlyContribution) || 0;
  const yieldPercent = parseFloat(customYield) || 10.3;
  const annualYield = yieldPercent / 100;
  
  const initialShares = investmentNum / jepqData.price;
  const monthlyDividendPerShare = (jepqData.price * annualYield) / 12;
  
  // Simple calculation without DRIP
  const simpleMonthlyIncome = (investmentNum * annualYield) / 12;
  const simpleAnnualIncome = investmentNum * annualYield;
  
  // DRIP calculation with contributions
  let dripBalance = investmentNum;
  let totalDividends = 0;
  let totalContributions = investmentNum;
  
  for (let month = 0; month < yearsNum * 12; month++) {
    const monthlyDividend = (dripBalance * annualYield) / 12;
    totalDividends += monthlyDividend;
    
    if (reinvestDividends) {
      dripBalance += monthlyDividend;
    }
    
    dripBalance += monthlyContribNum;
    totalContributions += monthlyContribNum;
  }
  
  const finalMonthlyIncome = (dripBalance * annualYield) / 12;
  const finalAnnualIncome = dripBalance * annualYield;
  const totalReturn = dripBalance - totalContributions + (reinvestDividends ? 0 : totalDividends);

  // Income Goal calculations
  const targetMonthlyNum = parseFloat(targetMonthlyIncome) || 0;
  const currentInvestmentNum = parseFloat(currentInvestment) || 0;
  const goalMonthlyContribNum = parseFloat(goalMonthlyContribution) || 0;
  
  const targetAnnualIncome = targetMonthlyNum * 12;
  const investmentNeeded = targetAnnualIncome / annualYield;
  const additionalNeeded = Math.max(0, investmentNeeded - currentInvestmentNum);
  const sharesNeeded = investmentNeeded / jepqData.price;
  
  // Time to reach goal (simplified)
  let monthsToGoal = 0;
  if (goalMonthlyContribNum > 0 && additionalNeeded > 0) {
    let accumulated = currentInvestmentNum;
    while (accumulated < investmentNeeded && monthsToGoal < 600) {
      const monthlyDiv = (accumulated * annualYield) / 12;
      accumulated += goalMonthlyContribNum + monthlyDiv;
      monthsToGoal++;
    }
  }
  const yearsToGoal = monthsToGoal / 12;

  const tabs = [
    { id: "income", label: "Dividend Income", icon: "💰" },
    { id: "goal", label: "Income Goal", icon: "🎯" },
    { id: "compare", label: "Compare ETFs", icon: "📊" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>JEPQ Dividend Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📈</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              JEPQ Dividend Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate JEPQ dividend income, plan your retirement income goals, and compare with JEPI and SCHD. 
            Free tool with DRIP reinvestment projections.
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
              <p style={{ fontWeight: "600", color: "#3730A3", margin: "0 0 4px 0" }}>JEPQ Quick Facts (2025)</p>
              <p style={{ color: "#4338CA", margin: 0, fontSize: "0.95rem" }}>
                <strong>Yield:</strong> ~10.3% | <strong>Monthly Dividend:</strong> ~$0.51/share | <strong>Annual:</strong> ~$6.12/share | <strong>Price:</strong> ~$59 | <strong>Expense Ratio:</strong> 0.35%
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
                backgroundColor: activeTab === tab.id ? "#1E40AF" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "income" && "💰 Investment Details"}
                {activeTab === "goal" && "🎯 Your Income Goal"}
                {activeTab === "compare" && "📊 ETF Comparison"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "income" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Initial Investment ($)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
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
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Investment Period (Years)
                      </label>
                      <select
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        {[1, 3, 5, 10, 15, 20, 25, 30].map(y => (
                          <option key={y} value={y}>{y} years</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Dividend Yield (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={customYield}
                        onChange={(e) => setCustomYield(e.target.value)}
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

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={reinvestDividends}
                      onChange={(e) => setReinvestDividends(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                      Reinvest Dividends (DRIP)
                    </span>
                  </label>
                </>
              )}

              {activeTab === "goal" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Target Monthly Income ($)
                    </label>
                    <select
                      value={targetMonthlyIncome}
                      onChange={(e) => setTargetMonthlyIncome(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="500">$500/month</option>
                      <option value="1000">$1,000/month</option>
                      <option value="2000">$2,000/month</option>
                      <option value="3000">$3,000/month</option>
                      <option value="5000">$5,000/month</option>
                      <option value="10000">$10,000/month</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Current JEPQ Investment ($)
                    </label>
                    <input
                      type="number"
                      value={currentInvestment}
                      onChange={(e) => setCurrentInvestment(e.target.value)}
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
                      Monthly Contribution ($)
                    </label>
                    <input
                      type="number"
                      value={goalMonthlyContribution}
                      onChange={(e) => setGoalMonthlyContribution(e.target.value)}
                      placeholder="1000"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      How much you can invest each month toward your goal
                    </p>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Note:</strong> Calculations assume {yieldPercent}% dividend yield and DRIP reinvestment. Actual results will vary.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "compare" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ color: "#4B5563", fontSize: "0.9rem", margin: "0 0 16px 0" }}>
                      Compare JEPQ with other popular income ETFs to find the best fit for your portfolio.
                    </p>
                  </div>
                  
                  {compareETFs.map((etf, idx) => (
                    <div key={etf.symbol} style={{
                      backgroundColor: idx === 0 ? "#EEF2FF" : "#F9FAFB",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "12px",
                      border: idx === 0 ? "2px solid #1E40AF" : "1px solid #E5E7EB"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "700", color: idx === 0 ? "#1E40AF" : "#374151", fontSize: "1.1rem" }}>
                          {etf.symbol}
                        </span>
                        <span style={{ backgroundColor: "#059669", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" }}>
                          {etf.yield}% yield
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 8px 0" }}>{etf.name}</p>
                      <div style={{ fontSize: "0.8rem", color: "#4B5563" }}>
                        <span style={{ marginRight: "12px" }}>📅 {etf.frequency}</span>
                        <span>💼 {etf.expenseRatio}% ER</span>
                      </div>
                    </div>
                  ))}
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "compare" ? "📊 Detailed Comparison" : "📊 Projected Results"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "income" && (
                <>
                  {/* Current Monthly Income */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Starting Monthly Income</p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                      ${simpleMonthlyIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      ${simpleAnnualIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}/year from ${investmentNum.toLocaleString()}
                    </p>
                  </div>

                  {/* After X Years */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "1px solid #C7D2FE",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3730A3" }}>After {yearsNum} Years {reinvestDividends ? "(DRIP)" : "(No DRIP)"}</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#1E40AF" }}>
                      ${finalMonthlyIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#4338CA" }}>
                      ${finalAnnualIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}/year
                    </p>
                  </div>

                  {/* Summary */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Total Invested:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${totalContributions.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Portfolio Value:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${dripBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Total Dividends:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>${totalDividends.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      <div style={{ color: "#6B7280" }}>Shares Owned:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{(dripBalance / jepqData.price).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                    </div>
                  </div>

                  {/* DRIP Tip */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>DRIP Power:</strong> Reinvesting dividends can significantly compound your returns over time—your dividends buy more shares, which pay more dividends!
                    </p>
                  </div>
                </>
              )}

              {activeTab === "goal" && (
                <>
                  {/* Investment Needed */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Investment Needed for ${targetMonthlyNum.toLocaleString()}/month</p>
                    <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "bold", color: "#059669" }}>
                      ${investmentNeeded.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      ≈ {sharesNeeded.toLocaleString(undefined, {maximumFractionDigits: 0})} shares @ ${jepqData.price}
                    </p>
                  </div>

                  {/* Progress */}
                  {currentInvestmentNum > 0 && (
                    <div style={{
                      backgroundColor: "#F3F4F6",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px"
                    }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📊 Your Progress</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                        <div style={{ color: "#6B7280" }}>Current Investment:</div>
                        <div style={{ textAlign: "right", fontWeight: "500" }}>${currentInvestmentNum.toLocaleString()}</div>
                        <div style={{ color: "#6B7280" }}>Still Needed:</div>
                        <div style={{ textAlign: "right", fontWeight: "500", color: "#DC2626" }}>${additionalNeeded.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        <div style={{ color: "#6B7280" }}>Progress:</div>
                        <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{((currentInvestmentNum / investmentNeeded) * 100).toFixed(1)}%</div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ marginTop: "12px", backgroundColor: "#E5E7EB", borderRadius: "4px", height: "8px" }}>
                        <div style={{ 
                          backgroundColor: "#059669", 
                          borderRadius: "4px", 
                          height: "8px", 
                          width: `${Math.min(100, (currentInvestmentNum / investmentNeeded) * 100)}%`,
                          transition: "width 0.3s"
                        }}></div>
                      </div>
                    </div>
                  )}

                  {/* Time to Goal */}
                  {goalMonthlyContribNum > 0 && additionalNeeded > 0 && (
                    <div style={{
                      backgroundColor: "#EEF2FF",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #C7D2FE"
                    }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#1E40AF", fontSize: "0.9rem" }}>⏱️ Time to Reach Goal</h4>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#3730A3" }}>
                        {yearsToGoal < 50 ? `~${yearsToGoal.toFixed(1)} years` : "50+ years"}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#4338CA" }}>
                        Contributing ${goalMonthlyContribNum.toLocaleString()}/month with DRIP
                      </p>
                    </div>
                  )}

                  {/* Quick Reference */}
                  <div style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "0.85rem" }}>💡 Quick Reference</h4>
                    <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                      {incomeTargets.slice(0, 4).map(target => (
                        <div key={target.monthly} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>${target.monthly.toLocaleString()}/mo:</span>
                          <span style={{ fontWeight: "500" }}>${(target.annual / annualYield).toLocaleString(undefined, {maximumFractionDigits: 0})} needed</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "compare" && (
                <>
                  {/* Comparison Table */}
                  <div style={{ overflowX: "auto", marginBottom: "16px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#EEF2FF" }}>
                          <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Feature</th>
                          <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>JEPQ</th>
                          <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>JEPI</th>
                          <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>SCHD</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Dividend Yield</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>10.3% ✓</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>7.5%</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>3.8%</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Payment</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Monthly ✓</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>Monthly ✓</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Quarterly</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Expense Ratio</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>0.35%</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>0.35%</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>0.06% ✓</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Strategy</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.75rem" }}>Nasdaq + Calls</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.75rem" }}>S&P 500 + Calls</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.75rem" }}>Dividend Growth</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Risk Level</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Mod-High</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Moderate ✓</td>
                          <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>Moderate ✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Best For */}
                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>🎯 Best For</h4>
                    {compareETFs.map((etf) => (
                      <div key={etf.symbol} style={{ 
                        display: "flex", 
                        gap: "8px", 
                        marginBottom: "8px",
                        fontSize: "0.85rem"
                      }}>
                        <span style={{ fontWeight: "600", color: "#1E40AF", minWidth: "50px" }}>{etf.symbol}:</span>
                        <span style={{ color: "#4B5563" }}>{etf.bestFor}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Pro Tip:</strong> Consider a mix—40% JEPQ (high income), 40% JEPI (stability), 20% SCHD (growth)—for balanced income portfolio.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Income Goal Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 JEPQ Monthly Income Goals (at 10.3% Yield)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EEF2FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Monthly Income</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Annual Income</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Investment Needed</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Shares Needed</th>
                </tr>
              </thead>
              <tbody>
                {incomeTargets.map((target, idx) => (
                  <tr key={target.monthly} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600", color: "#059669" }}>${target.monthly.toLocaleString()}/mo</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>${target.annual.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>${(target.annual / 0.103).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{((target.annual / 0.103) / jepqData.price).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Based on current ~10.3% dividend yield and ~$59 share price. Actual dividends may vary month-to-month.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>📈 What is JEPQ?</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>JEPQ (JPMorgan Nasdaq Equity Premium Income ETF)</strong> is a popular income-focused ETF that combines 
                  Nasdaq-100 stock holdings with a covered call options strategy. Launched in May 2022, it has grown to over 
                  $32 billion in assets, attracting investors seeking high monthly income.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Does JEPQ Generate Income?</h3>
                <p>
                  JEPQ holds stocks like NVIDIA, Apple, Microsoft, and other Nasdaq-100 companies. It then sells call options 
                  (covered calls) on these holdings to generate premium income. This strategy produces high yields (~10%) but 
                  limits upside potential when tech stocks rally strongly. The trade-off: higher current income for potentially 
                  lower total returns compared to QQQ.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>JEPQ vs JEPI: Which Should You Choose?</h3>
                <p>
                  <strong>Choose JEPQ if:</strong> You want higher yield (~10% vs ~7.5%), believe in tech long-term, and can 
                  tolerate more volatility. <strong>Choose JEPI if:</strong> You prefer stability, want broader S&P 500 
                  diversification, and prioritize consistent income over maximum yield. Many income investors hold both for 
                  balance.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Stats */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📊 JEPQ Key Stats</h3>
              <div style={{ fontSize: "0.85rem", color: "#3730A3", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Ticker:</strong> JEPQ</p>
                <p style={{ margin: 0 }}><strong>Yield:</strong> ~10.3%</p>
                <p style={{ margin: 0 }}><strong>Frequency:</strong> Monthly</p>
                <p style={{ margin: 0 }}><strong>Expense Ratio:</strong> 0.35%</p>
                <p style={{ margin: 0 }}><strong>AUM:</strong> $32B+</p>
                <p style={{ margin: 0 }}><strong>Inception:</strong> May 2022</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Important Notes</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Monthly dividends fluctuate (±40%)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Covered calls cap upside gains</p>
                <p style={{ margin: "0 0 8px 0" }}>• Heavy tech concentration (43%+)</p>
                <p style={{ margin: 0 }}>• Past performance ≠ future results</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/jepq-dividend-calculator" currentCategory="Finance" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEE2E2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#991B1B", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Investment Disclaimer:</strong> This calculator is for educational purposes only and does not constitute investment advice. 
            Dividend yields, stock prices, and returns fluctuate. Past performance does not guarantee future results. 
            Consult a qualified financial advisor before making investment decisions. JEPQ data shown are estimates and may not reflect current values.
          </p>
        </div>
      </div>
    </div>
  );
}