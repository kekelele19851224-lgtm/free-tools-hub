"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// QQQI default data
const QQQI_DEFAULTS = {
  sharePrice: 54.25,
  monthlyDividend: 0.62,
  annualDividend: 7.44,
  dividendYield: 13.7,
  dividendGrowthRate: 2,
  priceGrowthRate: 5
};

// Preset buttons for Goal Calculator
const incomePresets = [500, 1000, 2000, 3000, 5000];

// Preset buttons for investment period
const periodPresets = [5, 10, 15, 20, 30];

// Preset buttons for monthly contribution
const contributionPresets = [0, 100, 250, 500, 1000];

// FAQ data
const faqs = [
  {
    question: "How much does QQQI pay in dividends?",
    answer: "QQQI pays monthly dividends, typically around $0.60-$0.64 per share. Over the past 12 months, QQQI paid approximately $7.44 per share in total dividends, resulting in an annual dividend yield of about 13-14%. Unlike most ETFs that pay quarterly, QQQI's monthly distribution schedule makes it popular among income-focused investors seeking regular cash flow."
  },
  {
    question: "How much do I need to invest in QQQI for $1,000 a month in dividends?",
    answer: "To earn $1,000 per month ($12,000/year) in QQQI dividends at the current yield of approximately 13.7%, you would need to invest around $87,600. This equals roughly 1,615 shares at $54.25 per share. Keep in mind that dividend amounts can fluctuate monthly, so this is an estimate based on recent distribution history."
  },
  {
    question: "Is QQQI a good investment?",
    answer: "QQQI can be suitable for investors seeking high monthly income from their portfolio. Pros include: ~14% dividend yield, monthly payments, tax-efficient structure (return of capital), and exposure to Nasdaq-100 companies. However, consider: covered call strategy caps upside potential, relatively new ETF (launched Jan 2024), and high yields come with risks. It's best suited as part of a diversified income portfolio, not as a sole investment."
  },
  {
    question: "How much to invest to make $3,000 a month in dividends from QQQI?",
    answer: "For $3,000 monthly income ($36,000/year) from QQQI at a 13.7% yield, you'd need approximately $262,800 invested, or about 4,845 shares. This is a significant investment, and many investors diversify across multiple high-yield ETFs (like SPYI, JEPQ, JEPI) rather than concentrating in a single fund."
  },
  {
    question: "Does QQQI pay dividends monthly?",
    answer: "Yes, QQQI pays dividends monthly, which is one of its key attractions. The ex-dividend date is typically around the 20th-24th of each month, with payment following 1-2 days later. This monthly schedule provides more frequent income compared to traditional quarterly-paying ETFs, making it easier to manage cash flow for living expenses or reinvestment."
  },
  {
    question: "What is the difference between QQQI and QQQ?",
    answer: "QQQ is a standard Nasdaq-100 index ETF with a low ~0.5% dividend yield but full upside potential. QQQI uses a covered call strategy on the same index, generating ~14% yield through option premiums but capping some upside gains. QQQI is designed for income; QQQ is for growth. QQQI also has a higher expense ratio (0.68% vs 0.20%) due to active management of the options strategy."
  },
  {
    question: "What is DRIP and should I use it with QQQI?",
    answer: "DRIP (Dividend Reinvestment Plan) automatically reinvests your dividends to buy more shares instead of receiving cash. With QQQI's high yield, DRIP can significantly accelerate wealth building through compounding. For example, $10,000 with DRIP enabled could grow to over $50,000 in 10 years vs ~$24,000 without DRIP. Use DRIP if you don't need current income; take cash if you're living off dividends."
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

// Format currency
function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function QQQIDividendCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"income" | "goal" | "drip">("income");

  // Tab 1: Income Calculator
  const [investmentAmount, setInvestmentAmount] = useState<string>("10000");
  const [sharePrice, setSharePrice] = useState<string>(String(QQQI_DEFAULTS.sharePrice));
  const [monthlyDividend, setMonthlyDividend] = useState<string>(String(QQQI_DEFAULTS.monthlyDividend));

  // Tab 2: Goal Calculator
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState<string>("1000");
  const [goalSharePrice, setGoalSharePrice] = useState<string>(String(QQQI_DEFAULTS.sharePrice));
  const [goalMonthlyDividend, setGoalMonthlyDividend] = useState<string>(String(QQQI_DEFAULTS.monthlyDividend));

  // Tab 3: DRIP Calculator
  const [dripInitialInvestment, setDripInitialInvestment] = useState<string>("10000");
  const [monthlyContribution, setMonthlyContribution] = useState<string>("100");
  const [investmentPeriod, setInvestmentPeriod] = useState<string>("10");
  const [enableDrip, setEnableDrip] = useState<boolean>(true);
  const [dividendGrowthRate, setDividendGrowthRate] = useState<string>(String(QQQI_DEFAULTS.dividendGrowthRate));
  const [priceGrowthRate, setPriceGrowthRate] = useState<string>(String(QQQI_DEFAULTS.priceGrowthRate));

  // Tab 1 Calculations
  const calcIncome = () => {
    const investment = parseFloat(investmentAmount) || 0;
    const price = parseFloat(sharePrice) || QQQI_DEFAULTS.sharePrice;
    const monthlyDiv = parseFloat(monthlyDividend) || QQQI_DEFAULTS.monthlyDividend;

    const shares = investment / price;
    const monthly = shares * monthlyDiv;
    const annual = monthly * 12;
    const yieldPercent = (annual / investment) * 100;

    return {
      shares: Math.floor(shares * 100) / 100,
      monthlyIncome: monthly,
      annualIncome: annual,
      dividendYield: yieldPercent || 0
    };
  };

  // Tab 2 Calculations
  const calcGoal = () => {
    const targetMonthly = parseFloat(targetMonthlyIncome) || 0;
    const price = parseFloat(goalSharePrice) || QQQI_DEFAULTS.sharePrice;
    const monthlyDiv = parseFloat(goalMonthlyDividend) || QQQI_DEFAULTS.monthlyDividend;

    const sharesNeeded = targetMonthly / monthlyDiv;
    const investmentNeeded = sharesNeeded * price;
    const annualIncome = targetMonthly * 12;

    return {
      sharesNeeded: Math.ceil(sharesNeeded),
      investmentNeeded: investmentNeeded,
      annualIncome: annualIncome
    };
  };

  // Tab 3 Calculations - DRIP projection
  const calcDrip = () => {
    const initial = parseFloat(dripInitialInvestment) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseInt(investmentPeriod) || 10;
    const divGrowth = (parseFloat(dividendGrowthRate) || 0) / 100;
    const priceGrowth = (parseFloat(priceGrowthRate) || 0) / 100;

    let currentPrice = QQQI_DEFAULTS.sharePrice;
    let currentMonthlyDiv = QQQI_DEFAULTS.monthlyDividend;
    let shares = initial / currentPrice;
    let totalContributions = initial;
    let totalDividends = 0;

    const yearlyData: Array<{
      year: number;
      shares: number;
      sharePrice: number;
      portfolioValue: number;
      annualDividend: number;
      totalDividends: number;
      totalContributions: number;
    }> = [];

    for (let year = 1; year <= years; year++) {
      let yearDividends = 0;

      // Monthly calculations for this year
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution
        if (monthly > 0) {
          shares += monthly / currentPrice;
          totalContributions += monthly;
        }

        // Calculate and potentially reinvest dividends
        const monthDiv = shares * currentMonthlyDiv;
        yearDividends += monthDiv;
        totalDividends += monthDiv;

        if (enableDrip) {
          shares += monthDiv / currentPrice;
        }
      }

      // End of year: apply growth rates for next year
      yearlyData.push({
        year,
        shares: Math.round(shares * 100) / 100,
        sharePrice: Math.round(currentPrice * 100) / 100,
        portfolioValue: Math.round(shares * currentPrice),
        annualDividend: Math.round(yearDividends),
        totalDividends: Math.round(totalDividends),
        totalContributions: Math.round(totalContributions)
      });

      // Apply growth for next year
      currentPrice *= (1 + priceGrowth);
      currentMonthlyDiv *= (1 + divGrowth);
    }

    // Calculate no-DRIP scenario for comparison
    let noDripShares = initial / QQQI_DEFAULTS.sharePrice;
    let noDripDividends = 0;
    let noDripPrice = QQQI_DEFAULTS.sharePrice;
    let noDripMonthlyDiv = QQQI_DEFAULTS.monthlyDividend;
    let noDripContributions = initial;

    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        if (monthly > 0) {
          noDripShares += monthly / noDripPrice;
          noDripContributions += monthly;
        }
        noDripDividends += noDripShares * noDripMonthlyDiv;
      }
      noDripPrice *= (1 + priceGrowth);
      noDripMonthlyDiv *= (1 + divGrowth);
    }

    const finalNoDripValue = noDripShares * yearlyData[years - 1]?.sharePrice + noDripDividends;

    return {
      yearlyData,
      finalValue: yearlyData[years - 1]?.portfolioValue || 0,
      finalShares: yearlyData[years - 1]?.shares || 0,
      totalDividends: Math.round(totalDividends),
      totalContributions: Math.round(totalContributions),
      noDripValue: Math.round(finalNoDripValue),
      dripAdvantage: Math.round((yearlyData[years - 1]?.portfolioValue || 0) - finalNoDripValue)
    };
  };

  const incomeResults = calcIncome();
  const goalResults = calcGoal();
  const dripResults = calcDrip();

  // Quick answer calculation (for $1000/month)
  const quickAnswerShares = Math.ceil(1000 / QQQI_DEFAULTS.monthlyDividend);
  const quickAnswerInvestment = quickAnswerShares * QQQI_DEFAULTS.sharePrice;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>QQQI Dividend Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              QQQI Dividend Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your QQQI dividend income, find how much to invest for your target monthly income, 
            and project long-term DRIP growth. Free NEOS Nasdaq-100 High Income ETF calculator.
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
            <span style={{ fontSize: "1.5rem" }}>💵</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>
                To earn $1,000/month in QQQI dividends, you need ~${formatCurrency(quickAnswerInvestment)} ({formatCurrency(quickAnswerShares)} shares)
              </p>
              <p style={{ color: "#047857", margin: 0, fontSize: "0.95rem" }}>
                QQQI current yield: <strong>~{QQQI_DEFAULTS.dividendYield}%</strong> | Monthly dividend: <strong>${QQQI_DEFAULTS.monthlyDividend}/share</strong> | Share price: <strong>${QQQI_DEFAULTS.sharePrice}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("income")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "income" ? "#0D9488" : "#E5E7EB",
              color: activeTab === "income" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Income Calculator
          </button>
          <button
            onClick={() => setActiveTab("goal")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "goal" ? "#0D9488" : "#E5E7EB",
              color: activeTab === "goal" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🎯 Goal Calculator
          </button>
          <button
            onClick={() => setActiveTab("drip")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "drip" ? "#0D9488" : "#E5E7EB",
              color: activeTab === "drip" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📈 DRIP Growth
          </button>
        </div>

        {/* Tab 1: Income Calculator */}
        {activeTab === "income" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0D9488", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Your Investment</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Investment Amount */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Investment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter investment amount"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1.1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setInvestmentAmount(String(amount))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: investmentAmount === String(amount) ? "2px solid #0D9488" : "1px solid #E5E7EB",
                          backgroundColor: investmentAmount === String(amount) ? "#CCFBF1" : "white",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          color: "#374151"
                        }}
                      >
                        ${formatCurrency(amount)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Share Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Share Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sharePrice}
                    onChange={(e) => setSharePrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    Current QQQI price: ~${QQQI_DEFAULTS.sharePrice}
                  </p>
                </div>

                {/* Monthly Dividend */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Monthly Dividend per Share ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyDividend}
                    onChange={(e) => setMonthlyDividend(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    Recent QQQI dividend: ~${QQQI_DEFAULTS.monthlyDividend}/share/month
                  </p>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#F0FDFA",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #99F6E4"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#0F766E" }}>
                    💡 <strong>Tip:</strong> QQQI pays dividends monthly, making it ideal for regular income. Dividend amounts may vary each month.
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💵 Your Dividend Income</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Monthly Income - Hero */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Monthly Dividend Income</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#047857" }}>
                    ${formatCurrency(Math.round(incomeResults.monthlyIncome))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#059669" }}>
                    per month
                  </p>
                </div>

                {/* Other Results */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#F0FDFA",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#0F766E" }}>Annual Income</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#0D9488" }}>
                      ${formatCurrency(Math.round(incomeResults.annualIncome))}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#F0FDFA",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#0F766E" }}>Dividend Yield</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#0D9488" }}>
                      {incomeResults.dividendYield.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* Shares Owned */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Shares You Would Own</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#B45309" }}>
                    {formatCurrency(Math.floor(incomeResults.shares))} shares
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📋 Breakdown</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Investment</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${formatCurrency(parseFloat(investmentAmount) || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>÷ Share Price</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${parseFloat(sharePrice).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>= Shares</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{incomeResults.shares.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>× Monthly Dividend</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${parseFloat(monthlyDividend).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px dashed #E5E7EB" }}>
                    <span style={{ color: "#059669", fontWeight: "600" }}>= Monthly Income</span>
                    <span style={{ color: "#059669", fontWeight: "bold", fontSize: "1.1rem" }}>${incomeResults.monthlyIncome.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Goal Calculator */}
        {activeTab === "goal" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎯 Your Income Goal</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Target Monthly Income */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Target Monthly Income ($)
                  </label>
                  <input
                    type="number"
                    value={targetMonthlyIncome}
                    onChange={(e) => setTargetMonthlyIncome(e.target.value)}
                    placeholder="How much do you want per month?"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "8px",
                      border: "2px solid #7C3AED",
                      fontSize: "1.25rem",
                      boxSizing: "border-box",
                      textAlign: "center",
                      fontWeight: "600"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    {incomePresets.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setTargetMonthlyIncome(String(amount))}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: targetMonthlyIncome === String(amount) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: targetMonthlyIncome === String(amount) ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: targetMonthlyIncome === String(amount) ? "#7C3AED" : "#374151"
                        }}
                      >
                        ${formatCurrency(amount)}/mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Share Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    QQQI Share Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={goalSharePrice}
                    onChange={(e) => setGoalSharePrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Monthly Dividend */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Monthly Dividend per Share ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={goalMonthlyDividend}
                    onChange={(e) => setGoalMonthlyDividend(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{
                  backgroundColor: "#EDE9FE",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                    🎯 This calculator shows how much you need to invest in QQQI to reach your monthly income goal.
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
              <div style={{ backgroundColor: "#5B21B6", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💎 Investment Required</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Investment Needed - Hero */}
                <div style={{
                  backgroundColor: "#EDE9FE",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #A78BFA"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Total Investment Needed</p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#7C3AED" }}>
                    ${formatCurrency(Math.round(goalResults.investmentNeeded))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#6D28D9" }}>
                    to earn ${formatCurrency(parseFloat(targetMonthlyIncome) || 0)}/month
                  </p>
                </div>

                {/* Shares Needed */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Shares Needed</p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#B45309" }}>
                    {formatCurrency(goalResults.sharesNeeded)} shares
                  </p>
                </div>

                {/* Income Summary */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#F0FDFA",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#0F766E" }}>Monthly Income</p>
                    <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "#0D9488" }}>
                      ${formatCurrency(parseFloat(targetMonthlyIncome) || 0)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#F0FDFA",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#0F766E" }}>Annual Income</p>
                    <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold", color: "#0D9488" }}>
                      ${formatCurrency(goalResults.annualIncome)}
                    </p>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📋 How It&apos;s Calculated</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Target Monthly Income</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${formatCurrency(parseFloat(targetMonthlyIncome) || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>÷ Monthly Dividend/Share</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${parseFloat(goalMonthlyDividend).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>= Shares Needed</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>{formatCurrency(goalResults.sharesNeeded)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>× Share Price</span>
                    <span style={{ color: "#111827", fontWeight: "600" }}>${parseFloat(goalSharePrice).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px dashed #E5E7EB" }}>
                    <span style={{ color: "#7C3AED", fontWeight: "600" }}>= Investment Required</span>
                    <span style={{ color: "#7C3AED", fontWeight: "bold", fontSize: "1.1rem" }}>${formatCurrency(Math.round(goalResults.investmentNeeded))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: DRIP Calculator */}
        {activeTab === "drip" && (
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📈 DRIP Growth Settings</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Initial Investment */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={dripInitialInvestment}
                    onChange={(e) => setDripInitialInvestment(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Monthly Contribution */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {contributionPresets.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setMonthlyContribution(String(amount))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: monthlyContribution === String(amount) ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: monthlyContribution === String(amount) ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          color: "#374151"
                        }}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Investment Period */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Investment Period (Years)
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {periodPresets.map((years) => (
                      <button
                        key={years}
                        onClick={() => setInvestmentPeriod(String(years))}
                        style={{
                          padding: "10px 18px",
                          borderRadius: "8px",
                          border: investmentPeriod === String(years) ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: investmentPeriod === String(years) ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: investmentPeriod === String(years) ? "#2563EB" : "#374151"
                        }}
                      >
                        {years} yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* DRIP Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    borderRadius: "8px",
                    backgroundColor: enableDrip ? "#DCFCE7" : "#F3F4F6",
                    border: enableDrip ? "2px solid #22C55E" : "1px solid #E5E7EB",
                    cursor: "pointer"
                  }}>
                    <input
                      type="checkbox"
                      checked={enableDrip}
                      onChange={(e) => setEnableDrip(e.target.checked)}
                      style={{ width: "20px", height: "20px" }}
                    />
                    <div>
                      <span style={{ fontWeight: "600", color: enableDrip ? "#166534" : "#374151" }}>
                        Enable DRIP (Reinvest Dividends)
                      </span>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: enableDrip ? "#15803D" : "#6B7280" }}>
                        Automatically reinvest dividends to buy more shares
                      </p>
                    </div>
                  </label>
                </div>

                {/* Growth Rates */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Dividend Growth (%/yr)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={dividendGrowthRate}
                      onChange={(e) => setDividendGrowthRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Price Growth (%/yr)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={priceGrowthRate}
                      onChange={(e) => setPriceGrowthRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
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
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚀 Projected Growth</h2>
              </div>
              
              <div style={{ padding: "24px" }}>
                {/* Final Value - Hero */}
                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #60A5FA"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1E40AF" }}>
                    Portfolio Value After {investmentPeriod} Years
                  </p>
                  <div style={{ fontSize: "2.75rem", fontWeight: "bold", color: "#1D4ED8" }}>
                    ${formatCurrency(dripResults.finalValue)}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#2563EB" }}>
                    {formatCurrency(Math.round(dripResults.finalShares))} shares
                  </p>
                </div>

                {/* Key Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "8px",
                    padding: "14px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#065F46" }}>Total Dividends Earned</p>
                    <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold", color: "#059669" }}>
                      ${formatCurrency(dripResults.totalDividends)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "14px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#92400E" }}>Total Contributed</p>
                    <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: "bold", color: "#B45309" }}>
                      ${formatCurrency(dripResults.totalContributions)}
                    </p>
                  </div>
                </div>

                {/* DRIP vs No DRIP Comparison */}
                {enableDrip && (
                  <div style={{
                    backgroundColor: "#F0FDF4",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #86EFAC"
                  }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#166534", fontWeight: "600" }}>
                      🔄 DRIP Advantage
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#15803D", fontSize: "0.9rem" }}>With DRIP</span>
                      <span style={{ color: "#166534", fontWeight: "bold" }}>${formatCurrency(dripResults.finalValue)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ color: "#6B7280", fontSize: "0.9rem" }}>Without DRIP</span>
                      <span style={{ color: "#6B7280", fontWeight: "600" }}>${formatCurrency(dripResults.noDripValue)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px dashed #86EFAC" }}>
                      <span style={{ color: "#059669", fontWeight: "600" }}>Extra from DRIP</span>
                      <span style={{ color: "#059669", fontWeight: "bold", fontSize: "1.1rem" }}>
                        +${formatCurrency(Math.max(0, dripResults.dripAdvantage))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Year by Year Table */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "16px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>📊 Year-by-Year Projection</h3>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#F3F4F6" }}>
                          <th style={{ padding: "8px", textAlign: "left", position: "sticky", top: 0, backgroundColor: "#F3F4F6" }}>Year</th>
                          <th style={{ padding: "8px", textAlign: "right", position: "sticky", top: 0, backgroundColor: "#F3F4F6" }}>Shares</th>
                          <th style={{ padding: "8px", textAlign: "right", position: "sticky", top: 0, backgroundColor: "#F3F4F6" }}>Value</th>
                          <th style={{ padding: "8px", textAlign: "right", position: "sticky", top: 0, backgroundColor: "#F3F4F6" }}>Dividends</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dripResults.yearlyData.map((row) => (
                          <tr key={row.year} style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <td style={{ padding: "8px", color: "#374151" }}>{row.year}</td>
                            <td style={{ padding: "8px", textAlign: "right", color: "#374151" }}>{formatCurrency(Math.round(row.shares))}</td>
                            <td style={{ padding: "8px", textAlign: "right", color: "#059669", fontWeight: "600" }}>${formatCurrency(row.portfolioValue)}</td>
                            <td style={{ padding: "8px", textAlign: "right", color: "#6B7280" }}>${formatCurrency(row.annualDividend)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QQQI Info Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "40px",
          border: "1px solid #BFDBFE"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📈 About QQQI ETF</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Full Name</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>NEOS Nasdaq-100 High Income ETF</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Dividend Yield</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>~13-14% annually</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Payment Frequency</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>Monthly</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Strategy</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>Covered Call on Nasdaq-100</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Expense Ratio</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>0.68%</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#3B82F6" }}>Launch Date</p>
              <p style={{ margin: 0, fontWeight: "600", color: "#1E3A8A" }}>January 30, 2024</p>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 Understanding QQQI Dividends</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  QQQI (NEOS Nasdaq-100 High Income ETF) is a high-yield ETF that generates income through a 
                  <strong> covered call options strategy</strong> on the Nasdaq-100 index. Unlike traditional ETFs 
                  that rely on company dividends, QQQI earns most of its income from option premiums, allowing it to 
                  offer yields of <strong>13-14%</strong> — significantly higher than the ~0.5% yield of standard QQQ.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How QQQI Generates High Yields</h3>
                <p>
                  QQQI invests in the same companies as QQQ (Apple, Microsoft, NVIDIA, Amazon, etc.) but also sells 
                  call options on the index. When you sell a call option, you receive a premium upfront in exchange 
                  for capping your upside potential. This premium is distributed to shareholders as monthly dividends. 
                  The trade-off: QQQI may underperform QQQ in strong bull markets but provides consistent income.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Monthly vs Quarterly Dividends</h3>
                <p>
                  One of QQQI&apos;s biggest attractions is its <strong>monthly payment schedule</strong>. Most ETFs pay 
                  quarterly, meaning you wait 3 months between payments. QQQI pays every month, typically around the 
                  24th-26th. This is ideal for retirees or anyone using dividends to cover monthly expenses. Recent 
                  monthly dividends have ranged from $0.53 to $0.64 per share.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tax Considerations</h3>
                <p>
                  QQQI distributions are largely classified as <strong>return of capital (ROC)</strong>, which is 
                  tax-advantaged. ROC is not immediately taxable — it reduces your cost basis and is only taxed when 
                  you sell shares. Additionally, some option gains qualify for favorable 60/40 tax treatment under 
                  Section 1256. This makes QQQI more tax-efficient than many high-yield alternatives.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Is QQQI Right for You?</h3>
                <p>
                  QQQI is best suited for income-focused investors who prioritize regular cash flow over maximum 
                  capital appreciation. It works well in sideways or moderately bullish markets. However, if you&apos;re 
                  focused on long-term growth and don&apos;t need current income, standard QQQ may be more appropriate. 
                  Many investors hold both: QQQ for growth, QQQI for income.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💵 Quick Income Reference</h3>
              <div style={{ fontSize: "0.875rem", color: "#047857", lineHeight: "2.2" }}>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>$500/mo:</span> <strong>~$43,800</strong>
                </p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>$1,000/mo:</span> <strong>~$87,600</strong>
                </p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>$2,000/mo:</span> <strong>~$175,200</strong>
                </p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>$3,000/mo:</span> <strong>~$262,800</strong>
                </p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                  <span>$5,000/mo:</span> <strong>~$438,000</strong>
                </p>
              </div>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#059669" }}>
                *Based on ~13.7% yield. Actual amounts vary.
              </p>
            </div>

            {/* Similar ETFs */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1D4ED8", marginBottom: "16px" }}>📊 Similar High-Yield ETFs</h3>
              <div style={{ fontSize: "0.85rem", color: "#1E40AF", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>SPYI</strong> - S&P 500 covered call (~12%)</p>
                <p style={{ margin: 0 }}><strong>JEPQ</strong> - Nasdaq income (~9%)</p>
                <p style={{ margin: 0 }}><strong>JEPI</strong> - S&P 500 income (~7%)</p>
                <p style={{ margin: 0 }}><strong>QYLD</strong> - Nasdaq covered call (~12%)</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/qqqi-dividend-calculator" currentCategory="Finance" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
          <p style={{ fontSize: "0.75rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator is for informational and educational purposes only and does not constitute investment advice. 
            Dividend payments are not guaranteed and may fluctuate. Past performance does not guarantee future results. 
            QQQI is a relatively new ETF (launched Jan 2024) with limited historical data. Always consult a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}