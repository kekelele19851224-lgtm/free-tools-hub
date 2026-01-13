"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common savings goals presets
const savingsGoals = [
  { name: "Emergency Fund (3 mo)", amount: 5000, years: 1 },
  { name: "Emergency Fund (6 mo)", amount: 10000, years: 2 },
  { name: "Vacation", amount: 3000, years: 1 },
  { name: "Car Down Payment", amount: 5000, years: 2 },
  { name: "House Down Payment", amount: 50000, years: 5 },
  { name: "Wedding", amount: 20000, years: 2 },
];

// Interest rate presets
const ratePresets = [
  { name: "Regular Savings", rate: 0.5, description: "0.01% - 0.5%" },
  { name: "High-Yield Savings", rate: 4.5, description: "4% - 5%" },
  { name: "Money Market", rate: 4.0, description: "3.5% - 4.5%" },
  { name: "1-Year CD", rate: 4.5, description: "4% - 5%" },
  { name: "Conservative Investment", rate: 5, description: "4% - 6%" },
  { name: "Moderate Investment", rate: 7, description: "6% - 8%" },
];

// FAQ data
const faqs = [
  {
    question: "How much do I need to save a month to get $10,000 in a year?",
    answer: "To save $10,000 in one year, you'd need to save approximately $833 per month without interest. With a 5% APY high-yield savings account, you'd need about $813 per month. The exact amount depends on your starting balance and interest rate."
  },
  {
    question: "How much will I have if I save $100 a month for 30 years?",
    answer: "Saving $100/month for 30 years: With no interest, you'd have $36,000. With 5% APY, you'd have about $83,226. With 7% average investment return, you'd have approximately $121,997. Compound interest makes a huge difference over long periods!"
  },
  {
    question: "Is 1% per month the same as 12% per annum?",
    answer: "No! 1% per month compounds to 12.68% annually, not 12%. This is because each month's interest earns interest in subsequent months. The formula is (1.01)^12 - 1 = 12.68%. Always compare APY (Annual Percentage Yield) which accounts for compounding."
  },
  {
    question: "What is 5% APY on $5000?",
    answer: "With 5% APY on $5,000, you'd earn $250 in interest after one year (assuming monthly compounding and no additional deposits). After 5 years, your $5,000 would grow to approximately $6,381, earning $1,381 in interest."
  },
  {
    question: "How does compound interest work on savings?",
    answer: "Compound interest means you earn interest on both your original deposit AND on previously earned interest. For example, $1,000 at 5% earns $50 in year one ($1,050 total). In year two, you earn 5% on $1,050 = $52.50. Over time, this 'interest on interest' effect accelerates your growth."
  },
  {
    question: "What's a good monthly savings amount?",
    answer: "Financial experts recommend the 50/30/20 rule: save 20% of your after-tax income. For someone earning $4,000/month after taxes, that's $800/month. However, any amount you can consistently save is beneficial. Start with what's comfortable and increase over time."
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

// Calculate future value with monthly contributions
function calculateFutureValue(
  principal: number,
  monthlyDeposit: number,
  annualRate: number,
  years: number
): { futureValue: number; totalContributions: number; totalInterest: number; yearlyBreakdown: Array<{year: number; contributions: number; interest: number; balance: number}> } {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  
  let balance = principal;
  let totalContributions = principal;
  const yearlyBreakdown: Array<{year: number; contributions: number; interest: number; balance: number}> = [];
  
  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    totalContributions += monthlyDeposit;
    
    if (month % 12 === 0) {
      const year = month / 12;
      const yearContributions = principal + (monthlyDeposit * month);
      const yearInterest = balance - yearContributions;
      yearlyBreakdown.push({
        year,
        contributions: yearContributions,
        interest: yearInterest,
        balance
      });
    }
  }
  
  const totalInterest = balance - totalContributions;
  
  return {
    futureValue: balance,
    totalContributions,
    totalInterest,
    yearlyBreakdown
  };
}

// Calculate monthly deposit needed to reach goal
function calculateMonthlyNeeded(
  goal: number,
  currentSavings: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  
  if (monthlyRate === 0) {
    return (goal - currentSavings) / months;
  }
  
  // Future value of current savings
  const currentFV = currentSavings * Math.pow(1 + monthlyRate, months);
  
  // Remaining amount needed
  const remaining = goal - currentFV;
  
  if (remaining <= 0) return 0;
  
  // PMT formula for ordinary annuity adjusted for beginning of period
  const factor = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  
  return remaining / factor;
}

// Calculate time to reach goal
function calculateTimeToGoal(
  goal: number,
  currentSavings: number,
  monthlyDeposit: number,
  annualRate: number
): number {
  if (currentSavings >= goal) return 0;
  if (monthlyDeposit <= 0 && annualRate <= 0) return Infinity;
  
  const monthlyRate = annualRate / 100 / 12;
  let balance = currentSavings;
  let months = 0;
  const maxMonths = 1200; // 100 years max
  
  while (balance < goal && months < maxMonths) {
    balance = balance * (1 + monthlyRate) + monthlyDeposit;
    months++;
  }
  
  return months >= maxMonths ? Infinity : months / 12;
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function MonthlySavingsCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"future" | "monthly" | "time">("future");
  
  // Future Value tab state
  const [initialDeposit, setInitialDeposit] = useState<string>("1000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("500");
  const [interestRate, setInterestRate] = useState<string>("5");
  const [yearsToSave, setYearsToSave] = useState<string>("10");
  
  // Monthly Needed tab state
  const [savingsGoal, setSavingsGoal] = useState<string>("10000");
  const [currentSavings, setCurrentSavings] = useState<string>("0");
  const [goalYears, setGoalYears] = useState<string>("2");
  const [goalRate, setGoalRate] = useState<string>("5");
  
  // Time to Goal tab state
  const [targetAmount, setTargetAmount] = useState<string>("50000");
  const [startingBalance, setStartingBalance] = useState<string>("5000");
  const [monthlyAmount, setMonthlyAmount] = useState<string>("500");
  const [timeRate, setTimeRate] = useState<string>("5");

  // Calculations for Future Value tab
  const futureResult = calculateFutureValue(
    parseFloat(initialDeposit) || 0,
    parseFloat(monthlyContribution) || 0,
    parseFloat(interestRate) || 0,
    parseFloat(yearsToSave) || 0
  );
  
  // Calculations for Monthly Needed tab
  const monthlyNeeded = calculateMonthlyNeeded(
    parseFloat(savingsGoal) || 0,
    parseFloat(currentSavings) || 0,
    parseFloat(goalRate) || 0,
    parseFloat(goalYears) || 0
  );
  const weeklyNeeded = monthlyNeeded / 4.33;
  const dailyNeeded = monthlyNeeded / 30;
  
  // Calculations for Time to Goal tab
  const timeToGoal = calculateTimeToGoal(
    parseFloat(targetAmount) || 0,
    parseFloat(startingBalance) || 0,
    parseFloat(monthlyAmount) || 0,
    parseFloat(timeRate) || 0
  );
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + Math.round(timeToGoal * 12));

  const tabs = [
    { id: "future", label: "Future Value", icon: "💵" },
    { id: "monthly", label: "Monthly Needed", icon: "🎯" },
    { id: "time", label: "Time to Goal", icon: "⏱️" }
  ];

  // Calculate max balance for chart scaling
  const maxBalance = futureResult.yearlyBreakdown.length > 0 
    ? futureResult.yearlyBreakdown[futureResult.yearlyBreakdown.length - 1].balance 
    : 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Monthly Savings Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Monthly Savings Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how your savings grow with compound interest. Find out your future balance, 
            how much to save monthly for a goal, or how long until you reach your target.
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
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Power of Compound Interest</p>
              <p style={{ color: "#047857", margin: 0, fontSize: "0.95rem" }}>
                $500/month at 5% APY for 10 years = <strong>$77,641</strong> (only $60,000 contributed). 
                That&apos;s <strong>$17,641 in free interest!</strong>
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
                {activeTab === "future" && "💵 Savings Details"}
                {activeTab === "monthly" && "🎯 Your Savings Goal"}
                {activeTab === "time" && "⏱️ Your Savings Plan"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "future" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Initial Deposit ($)
                    </label>
                    <input
                      type="number"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      placeholder="1000"
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
                      placeholder="500"
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
                      Annual Interest Rate (APY %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="5"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[1, 4.5, 5, 7, 10].map(rate => (
                        <button
                          key={rate}
                          onClick={() => setInterestRate(rate.toString())}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: interestRate === rate.toString() ? "#ECFDF5" : "white",
                            color: "#059669",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Years to Save
                    </label>
                    <input
                      type="number"
                      value={yearsToSave}
                      onChange={(e) => setYearsToSave(e.target.value)}
                      placeholder="10"
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
                </>
              )}

              {activeTab === "monthly" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Savings Goal ($)
                    </label>
                    <input
                      type="number"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                      placeholder="10000"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    {/* Quick presets */}
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {savingsGoals.slice(0, 4).map(goal => (
                        <button
                          key={goal.name}
                          onClick={() => { setSavingsGoal(goal.amount.toString()); setGoalYears(goal.years.toString()); }}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                            color: "#059669",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {goal.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Current Savings ($)
                    </label>
                    <input
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                      placeholder="0"
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
                      Years to Reach Goal
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={goalYears}
                      onChange={(e) => setGoalYears(e.target.value)}
                      placeholder="2"
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
                      Annual Interest Rate (APY %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={goalRate}
                      onChange={(e) => setGoalRate(e.target.value)}
                      placeholder="5"
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
                </>
              )}

              {activeTab === "time" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Target Amount ($)
                    </label>
                    <input
                      type="number"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="50000"
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
                      Starting Balance ($)
                    </label>
                    <input
                      type="number"
                      value={startingBalance}
                      onChange={(e) => setStartingBalance(e.target.value)}
                      placeholder="5000"
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
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(e.target.value)}
                      placeholder="500"
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
                      Annual Interest Rate (APY %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={timeRate}
                      onChange={(e) => setTimeRate(e.target.value)}
                      placeholder="5"
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
                </>
              )}

              {/* Rate Reference */}
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px", marginTop: "8px" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#374151", fontWeight: "600" }}>💡 Rate Reference:</p>
                <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  <span>High-Yield Savings: 4-5%</span> • <span>CD: 4-5%</span> • <span>S&P 500 Avg: 10%</span>
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
            <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "future" && "📈 Your Future Balance"}
                {activeTab === "monthly" && "💵 Monthly Savings Needed"}
                {activeTab === "time" && "📅 Time to Reach Goal"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "future" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                      After {yearsToSave} Years You&apos;ll Have
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                      {formatCurrency(futureResult.futureValue)}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#065F46" }}>Total Contributed</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>
                        {formatCurrency(futureResult.totalContributions)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EEF2FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#3730A3" }}>Interest Earned</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#4F46E5" }}>
                        {formatCurrency(futureResult.totalInterest)}
                      </p>
                    </div>
                  </div>

                  {/* Visual Growth Chart */}
                  {futureResult.yearlyBreakdown.length > 0 && (
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📊 Growth Over Time</h4>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
                        {futureResult.yearlyBreakdown.map((data, idx) => (
                          <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                              width: "100%",
                              backgroundColor: "#059669",
                              borderRadius: "4px 4px 0 0",
                              height: `${(data.balance / maxBalance) * 100}px`,
                              minHeight: "10px"
                            }} />
                            <span style={{ fontSize: "0.6rem", color: "#6B7280", marginTop: "4px" }}>Y{data.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interest percentage */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                      🎉 <strong>{((futureResult.totalInterest / futureResult.futureValue) * 100).toFixed(1)}%</strong> of your final balance is FREE money from interest!
                    </p>
                  </div>
                </>
              )}

              {activeTab === "monthly" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                      To Reach {formatCurrency(parseFloat(savingsGoal) || 0)} in {goalYears} Years
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                      {formatCurrency(monthlyNeeded)}<span style={{ fontSize: "1rem" }}>/month</span>
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#374151" }}>Weekly</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#111827" }}>
                        {formatCurrency(weeklyNeeded)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#374151" }}>Daily</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#111827" }}>
                        {formatCurrency(dailyNeeded)}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Summary</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Goal Amount:</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(parseFloat(savingsGoal) || 0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Current Savings:</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(parseFloat(currentSavings) || 0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Total Contributions:</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency((parseFloat(currentSavings) || 0) + monthlyNeeded * (parseFloat(goalYears) || 0) * 12)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Interest Earned:</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>
                          {formatCurrency((parseFloat(savingsGoal) || 0) - (parseFloat(currentSavings) || 0) - monthlyNeeded * (parseFloat(goalYears) || 0) * 12)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      💡 <strong>Tip:</strong> Set up automatic transfers to save {formatCurrency(monthlyNeeded)} on each payday!
                    </p>
                  </div>
                </>
              )}

              {activeTab === "time" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                      Time to Reach {formatCurrency(parseFloat(targetAmount) || 0)}
                    </p>
                    {timeToGoal === Infinity ? (
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>
                        Cannot be reached
                      </p>
                    ) : (
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                        {timeToGoal.toFixed(1)} <span style={{ fontSize: "1rem" }}>years</span>
                      </p>
                    )}
                  </div>

                  {timeToGoal !== Infinity && (
                    <>
                      {/* Target Date */}
                      <div style={{
                        backgroundColor: "#EEF2FF",
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "16px",
                        textAlign: "center"
                      }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#3730A3" }}>Target Date</p>
                        <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#4F46E5" }}>
                          📅 {targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      {/* Breakdown */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#374151" }}>Months</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#111827" }}>
                            {Math.round(timeToGoal * 12)}
                          </p>
                        </div>
                        <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#374151" }}>Total Deposits</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#111827" }}>
                            {formatCurrency((parseFloat(startingBalance) || 0) + (parseFloat(monthlyAmount) || 0) * Math.round(timeToGoal * 12))}
                          </p>
                        </div>
                      </div>

                      {/* Interest earned */}
                      <div style={{
                        backgroundColor: "#ECFDF5",
                        borderRadius: "10px",
                        padding: "12px",
                        border: "1px solid #6EE7B7"
                      }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                          💰 <strong>Interest Earned:</strong> {formatCurrency((parseFloat(targetAmount) || 0) - (parseFloat(startingBalance) || 0) - (parseFloat(monthlyAmount) || 0) * Math.round(timeToGoal * 12))}
                        </p>
                      </div>
                    </>
                  )}

                  {timeToGoal === Infinity && (
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "10px",
                      padding: "12px",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                        ⚠️ Please enter a monthly contribution or interest rate greater than 0.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Yearly Breakdown Table (for Future Value tab) */}
        {activeTab === "future" && futureResult.yearlyBreakdown.length > 0 && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "40px"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Year-by-Year Breakdown</h2>
            </div>
            <div style={{ padding: "24px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#ECFDF5" }}>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Year</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Total Contributed</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Interest Earned</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {futureResult.yearlyBreakdown.map((data, idx) => (
                    <tr key={data.year} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>Year {data.year}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>{formatCurrency(data.contributions)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>{formatCurrency(data.interest)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600", color: "#B45309" }}>{formatCurrency(data.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Savings Goals Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎯 Common Savings Goals Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Goal</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Target</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Timeline</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Monthly (0%)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Monthly (5%)</th>
                </tr>
              </thead>
              <tbody>
                {savingsGoals.map((goal, idx) => {
                  const monthlyNoInterest = goal.amount / (goal.years * 12);
                  const monthlyWithInterest = calculateMonthlyNeeded(goal.amount, 0, 5, goal.years);
                  return (
                    <tr key={goal.name} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{goal.name}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(goal.amount)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{goal.years} year{goal.years > 1 ? 's' : ''}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(monthlyNoInterest)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{formatCurrency(monthlyWithInterest)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Monthly (5%) shows how much less you need to save when earning 5% APY interest
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 How to Maximize Your Savings</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The Power of Compound Interest</h3>
                <p>
                  Compound interest is often called the &quot;eighth wonder of the world.&quot; It means you earn 
                  interest not just on your original deposit, but also on the interest you&apos;ve already earned. 
                  Over time, this creates a snowball effect that accelerates your wealth growth.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 50/30/20 Rule</h3>
                <p>
                  A popular budgeting guideline suggests allocating your after-tax income as follows: 
                  <strong> 50% for needs</strong> (rent, utilities, groceries), 
                  <strong> 30% for wants</strong> (entertainment, dining out), and 
                  <strong> 20% for savings</strong> and debt repayment. Even if you can&apos;t hit 20%, 
                  saving consistently is what matters most.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips to Save More</h3>
                <p>
                  <strong>1. Automate your savings</strong> – Set up automatic transfers on payday.<br />
                  <strong>2. Use a high-yield savings account</strong> – Earn 4-5% APY instead of 0.01%.<br />
                  <strong>3. Start small</strong> – Even $50/month adds up over time.<br />
                  <strong>4. Increase with raises</strong> – Save half of every raise you receive.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Interest Rate Reference */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📈 Current Rate Reference</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2" }}>
                {ratePresets.map(preset => (
                  <div key={preset.name} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>{preset.name}:</span>
                    <strong>{preset.description}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tip */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚡ Quick Math</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>$100/mo × 30 years @ 7% = <strong>$121,997</strong></p>
                <p style={{ margin: "0 0 8px 0" }}>$500/mo × 10 years @ 5% = <strong>$77,641</strong></p>
                <p style={{ margin: 0 }}>$1000/mo × 5 years @ 5% = <strong>$68,006</strong></p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/monthly-savings-calculator" currentCategory="Finance" />
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
            💰 <strong>Disclaimer:</strong> This calculator provides estimates based on constant interest rates and regular deposits. 
            Actual results may vary. Interest rates can change, and this tool does not account for taxes, fees, or inflation. 
            Consult a financial advisor for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
}