"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Historical prices (split-adjusted) - approximate values
const historicalPrices: Record<number, number> = {
  1: 140,   // 1 year ago
  2: 50,    // 2 years ago
  3: 15,    // 3 years ago (2022 low)
  5: 6,     // 5 years ago
  10: 3,    // 10 years ago
  15: 1.5,  // 15 years ago
  20: 0.8,  // 20 years ago
  25: 0.3,  // 25 years ago (near IPO)
};

// Stock split history
const splitHistory = [
  { date: "June 2024", ratio: "10-for-1", description: "Each share became 10 shares" },
  { date: "July 2021", ratio: "4-for-1", description: "Each share became 4 shares" },
  { date: "September 2007", ratio: "3-for-2", description: "Each share became 1.5 shares" },
  { date: "April 2006", ratio: "2-for-1", description: "Each share became 2 shares" },
  { date: "September 2001", ratio: "2-for-1", description: "Each share became 2 shares" },
];

// Historical returns data
const historicalReturns = [
  { period: "1 Year", return: "0%", note: "Flat (2024)" },
  { period: "3 Years", return: "+833%", note: "AI boom" },
  { period: "5 Years", return: "+2,233%", note: "Exceptional" },
  { period: "10 Years", return: "+4,567%", note: "Outstanding" },
  { period: "20 Years", return: "+17,400%", note: "Life-changing" },
];

// FAQ data
const faqs = [
  {
    question: "What if you invested $1,000 in NVIDIA 20 years ago?",
    answer: "If you had invested $1,000 in NVIDIA stock 20 years ago (around 2005), your investment would be worth approximately $175,000 today, representing a return of over 17,400%. This accounts for all stock splits including the 4-for-1 split in 2021 and the 10-for-1 split in 2024. NVIDIA's transformation from a gaming graphics company to an AI and data center powerhouse has driven this remarkable growth."
  },
  {
    question: "How much will NVIDIA be in 5 years?",
    answer: "No one can predict future stock prices with certainty. However, based on historical performance, NVIDIA has averaged approximately 77% annual returns over the past 10 years. If this rate continued (which is not guaranteed), a $10,000 investment could theoretically grow to $170,000+ in 5 years. Factors that could affect future performance include AI market growth, competition, data center demand, and broader economic conditions. Always consult a financial advisor before making investment decisions."
  },
  {
    question: "How much is 5 shares of NVIDIA worth?",
    answer: "At the current price of approximately $140 per share, 5 shares of NVIDIA would be worth about $700. Note that after the June 2024 10-for-1 stock split, the share price dropped from around $1,200 to $120, making shares more accessible to retail investors while the total value remained the same for existing shareholders."
  },
  {
    question: "How to earn $500 a month from NVIDIA stock?",
    answer: "NVIDIA pays a small dividend (currently around $0.04 per share quarterly, or $0.16 annually). To earn $500/month ($6,000/year) from dividends alone, you would need approximately $5.25 million invested in NVIDIA stock at current dividend rates. Alternatively, some investors use covered call strategies or sell shares periodically to generate income, though these strategies carry different risks and tax implications."
  },
  {
    question: "How much $10,000 invested in NVIDIA 10 years ago is worth now?",
    answer: "A $10,000 investment in NVIDIA 10 years ago (around 2015) would be worth approximately $466,000 today. This represents a return of about 4,567% or roughly 46x your original investment. This growth was driven by NVIDIA's expansion into data centers, AI, and autonomous vehicles beyond its original gaming graphics business."
  },
  {
    question: "What is NVIDIA's stock split history?",
    answer: "NVIDIA has split its stock multiple times: 10-for-1 in June 2024, 4-for-1 in July 2021, 3-for-2 in September 2007, 2-for-1 in April 2006, and 2-for-1 in September 2001. The cumulative effect means 1 share from before all splits would now be 240 shares. Stock splits don't change the total value of your investment but make individual shares more affordable."
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

export default function NvidiaStockCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"historical" | "current" | "future">("historical");

  // Current price (user can update)
  const [currentPrice, setCurrentPrice] = useState<string>("140");

  // Tab 1: Historical Return inputs
  const [investmentAmount, setInvestmentAmount] = useState<string>("1000");
  const [yearsAgo, setYearsAgo] = useState<number>(5);

  // Tab 1: Results
  const [historicalValue, setHistoricalValue] = useState<number>(0);
  const [historicalReturn, setHistoricalReturn] = useState<number>(0);
  const [annualizedReturn, setAnnualizedReturn] = useState<number>(0);
  const [sharesOwned, setSharesOwned] = useState<number>(0);

  // Tab 2: Current Holdings inputs
  const [numberOfShares, setNumberOfShares] = useState<string>("100");

  // Tab 2: Results
  const [currentValue, setCurrentValue] = useState<number>(0);

  // Tab 3: Future Projection inputs
  const [futureInvestment, setFutureInvestment] = useState<string>("10000");
  const [yearsToHold, setYearsToHold] = useState<string>("5");
  const [expectedReturn, setExpectedReturn] = useState<string>("30");

  // Tab 3: Results
  const [futureValue, setFutureValue] = useState<number>(0);
  const [futureGrowth, setFutureGrowth] = useState<number>(0);

  // Tab 1: Calculate historical return
  useEffect(() => {
    const investment = parseFloat(investmentAmount) || 0;
    const price = parseFloat(currentPrice) || 140;
    const buyPrice = historicalPrices[yearsAgo] || 6;

    const shares = investment / buyPrice;
    const value = shares * price;
    const totalReturn = ((value - investment) / investment) * 100;
    const annualized = (Math.pow(value / investment, 1 / yearsAgo) - 1) * 100;

    setSharesOwned(shares);
    setHistoricalValue(value);
    setHistoricalReturn(totalReturn);
    setAnnualizedReturn(annualized);
  }, [investmentAmount, yearsAgo, currentPrice]);

  // Tab 2: Calculate current holdings value
  useEffect(() => {
    const shares = parseFloat(numberOfShares) || 0;
    const price = parseFloat(currentPrice) || 140;
    setCurrentValue(shares * price);
  }, [numberOfShares, currentPrice]);

  // Tab 3: Calculate future projection
  useEffect(() => {
    const investment = parseFloat(futureInvestment) || 0;
    const years = parseFloat(yearsToHold) || 5;
    const returnRate = parseFloat(expectedReturn) || 30;

    const future = investment * Math.pow(1 + returnRate / 100, years);
    const growth = ((future - investment) / investment) * 100;

    setFutureValue(future);
    setFutureGrowth(growth);
  }, [futureInvestment, yearsToHold, expectedReturn]);

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercent = (num: number): string => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(0)}%`;
  };

  // Quick stats for $1000 investment
  const quickStats = [
    { years: 5, label: "5 Years Ago" },
    { years: 10, label: "10 Years Ago" },
    { years: 20, label: "20 Years Ago" },
  ].map(item => {
    const buyPrice = historicalPrices[item.years];
    const price = parseFloat(currentPrice) || 140;
    const shares = 1000 / buyPrice;
    const value = shares * price;
    const returnPct = ((value - 1000) / 1000) * 100;
    return { ...item, value, returnPct };
  });

  const tabs = [
    { id: "historical" as const, label: "Historical Return", icon: "📈" },
    { id: "current" as const, label: "Current Value", icon: "💵" },
    { id: "future" as const, label: "Future Projection", icon: "🔮" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>NVIDIA Stock Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📊</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              NVIDIA Stock Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your NVIDIA (NVDA) investment returns. See what your investment would be worth if you had invested years ago, or project future growth.
          </p>
        </div>

        {/* Quick Stats - If you invested $1000 */}
        <div style={{
          backgroundColor: "#000000",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "20px", color: "#76B900" }}>
            💰 If You Invested $1,000 in NVIDIA...
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {quickStats.map((stat) => (
              <div key={stat.years} style={{
                backgroundColor: "#1a1a1a",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                border: "1px solid #333"
              }}>
                <p style={{ color: "#9CA3AF", fontSize: "0.875rem", marginBottom: "8px" }}>{stat.label}</p>
                <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#76B900", margin: "0 0 4px 0" }}>
                  {formatCurrency(stat.value)}
                </p>
                <p style={{ color: "#22C55E", fontSize: "0.875rem", margin: 0 }}>
                  {formatPercent(stat.returnPct)}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px", textAlign: "center" }}>
            Based on split-adjusted historical prices. Past performance does not guarantee future results.
          </p>
        </div>

        {/* Current Price Input */}
        <div style={{
          backgroundColor: "#F0FDF4",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          border: "1px solid #BBF7D0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <div>
              <p style={{ fontWeight: "600", color: "#166534", margin: 0 }}>NVIDIA (NVDA) Current Price</p>
              <p style={{ fontSize: "0.75rem", color: "#15803D", margin: 0 }}>Update to reflect latest market price</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontWeight: "600", color: "#166534" }}>$</span>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              style={{
                width: "100px",
                padding: "8px 12px",
                border: "2px solid #22C55E",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "600",
                textAlign: "right"
              }}
              min="0"
              step="0.01"
            />
            
              href="https://www.google.com/finance/quote/NVDA:NASDAQ"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "0.75rem",
                color: "#2563EB",
                textDecoration: "underline"
              }}
            >
              Check live price →
            </a>
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
          {/* Tabs */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #76B900" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#76B900" : "#6B7280",
                  fontSize: "0.95rem",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ marginRight: "8px" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            {/* Tab 1: Historical Return */}
            {activeTab === "historical" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📈 Calculate Historical Return
                  </h3>

                  {/* Investment Amount */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      If I had invested ($)
                    </label>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      {["1000", "5000", "10000", "50000"].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setInvestmentAmount(amount)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: investmentAmount === amount ? "2px solid #76B900" : "1px solid #E5E7EB",
                            backgroundColor: investmentAmount === amount ? "#F0FDF4" : "white",
                            color: investmentAmount === amount ? "#166534" : "#6B7280",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          ${parseInt(amount).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Years Ago */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Years Ago
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[1, 2, 3, 5, 10, 15, 20, 25].map((years) => (
                        <button
                          key={years}
                          onClick={() => setYearsAgo(years)}
                          style={{
                            padding: "12px 8px",
                            borderRadius: "8px",
                            border: yearsAgo === years ? "2px solid #76B900" : "1px solid #E5E7EB",
                            backgroundColor: yearsAgo === years ? "#F0FDF4" : "white",
                            color: yearsAgo === years ? "#166534" : "#4B5563",
                            fontWeight: yearsAgo === years ? "600" : "400",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          {years}y
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Buy price {yearsAgo} years ago: ~${historicalPrices[yearsAgo]?.toFixed(2)} (split-adjusted)
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", border: "2px solid #BBF7D0" }}>
                  <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "20px", fontSize: "1.1rem" }}>
                    💰 Your Investment Today
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#DCFCE7",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #22C55E"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#166534", marginBottom: "8px" }}>Would Be Worth</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#16A34A", margin: 0 }}>
                      {formatCurrency(historicalValue)}
                    </p>
                    <p style={{ fontSize: "1.25rem", color: "#22C55E", marginTop: "8px" }}>
                      {formatPercent(historicalReturn)} return
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Initial Investment</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${parseFloat(investmentAmount || "0").toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Shares Owned</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{sharesOwned.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Profit</span>
                      <span style={{ fontWeight: "600", color: "#22C55E" }}>{formatCurrency(historicalValue - parseFloat(investmentAmount || "0"))}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Annualized Return</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{annualizedReturn.toFixed(1)}% per year</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Current Holdings */}
            {activeTab === "current" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    💵 Your NVIDIA Holdings
                  </h3>

                  {/* Number of Shares */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      value={numberOfShares}
                      onChange={(e) => setNumberOfShares(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      step="1"
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      {["1", "5", "10", "50", "100", "500"].map((shares) => (
                        <button
                          key={shares}
                          onClick={() => setNumberOfShares(shares)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: numberOfShares === shares ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: numberOfShares === shares ? "#EFF6FF" : "white",
                            color: numberOfShares === shares ? "#1E40AF" : "#6B7280",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          {shares}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price per Share */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Price per Share ($)
                    </label>
                    <input
                      type="number"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      step="0.01"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Update with current market price for accurate value
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "24px", borderRadius: "12px", border: "2px solid #BFDBFE" }}>
                  <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📊 Holdings Value
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#DBEAFE",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #3B82F6"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#1E40AF", marginBottom: "8px" }}>Total Value</p>
                    <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>
                      {formatCurrency(currentValue)}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Shares</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{parseFloat(numberOfShares || "0").toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Price per Share</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${parseFloat(currentPrice || "0").toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      💡 <strong>Tip:</strong> After the June 2024 10-for-1 split, share counts increased 10x while price decreased 10x. Your total value remained the same.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Future Projection */}
            {activeTab === "future" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    🔮 Project Future Growth
                  </h3>

                  {/* Investment Amount */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Starting Investment ($)
                    </label>
                    <input
                      type="number"
                      value={futureInvestment}
                      onChange={(e) => setFutureInvestment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                  </div>

                  {/* Years to Hold */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Years to Hold
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={yearsToHold}
                      onChange={(e) => setYearsToHold(e.target.value)}
                      style={{ width: "100%", marginBottom: "8px" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>1 year</span>
                      <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#7C3AED" }}>{yearsToHold} years</span>
                      <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>30 years</span>
                    </div>
                  </div>

                  {/* Expected Return */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Expected Annual Return
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "12px" }}>
                      {[
                        { rate: "10", label: "Conservative", color: "#22C55E" },
                        { rate: "20", label: "Moderate", color: "#3B82F6" },
                        { rate: "40", label: "Optimistic", color: "#F59E0B" },
                        { rate: "77", label: "Historical (10yr)", color: "#EF4444" },
                      ].map((option) => (
                        <button
                          key={option.rate}
                          onClick={() => setExpectedReturn(option.rate)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: expectedReturn === option.rate ? `2px solid ${option.color}` : "1px solid #E5E7EB",
                            backgroundColor: expectedReturn === option.rate ? "#F9FAFB" : "white",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <div style={{ fontWeight: "600", color: option.color }}>{option.rate}%</div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{option.label}</div>
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem"
                      }}
                      min="0"
                      max="200"
                    />
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px", border: "2px solid #DDD6FE" }}>
                  <h3 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "20px", fontSize: "1.1rem" }}>
                    ✨ Projected Value
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#EDE9FE",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #8B5CF6"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#5B21B6", marginBottom: "8px" }}>In {yearsToHold} Years</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED", margin: 0 }}>
                      {formatCurrency(futureValue)}
                    </p>
                    <p style={{ fontSize: "1.25rem", color: "#8B5CF6", marginTop: "8px" }}>
                      {formatPercent(futureGrowth)} growth
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Starting Amount</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${parseFloat(futureInvestment || "0").toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Annual Return</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{expectedReturn}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Projected Gain</span>
                      <span style={{ fontWeight: "600", color: "#22C55E" }}>{formatCurrency(futureValue - parseFloat(futureInvestment || "0"))}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                    <p style={{ fontSize: "0.8rem", color: "#991B1B", margin: 0 }}>
                      ⚠️ <strong>Disclaimer:</strong> This is a hypothetical projection only. Past performance does not guarantee future results. Stock prices are unpredictable.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stock Split History */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📜 NVIDIA Stock Split History
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Split Ratio</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Effect</th>
                </tr>
              </thead>
              <tbody>
                {splitHistory.map((split, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{split.date}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#76B900" }}>{split.ratio}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{split.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "16px" }}>
            💡 <strong>Note:</strong> Stock splits don&apos;t change your total investment value. If you owned 1 share worth $1,000 before a 10-for-1 split, you now own 10 shares worth $100 each (still $1,000 total).
          </p>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Historical Returns */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📊 NVIDIA Historical Returns
              </h2>
              <p style={{ color: "#6B7280", marginBottom: "20px" }}>
                NVIDIA has been one of the best-performing stocks over the past two decades, driven by its expansion from gaming into AI and data centers.
              </p>
              <div style={{ display: "grid", gap: "12px" }}>
                {historicalReturns.map((item, index) => (
                  <div key={index} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: index === 0 ? "#F9FAFB" : index === 2 ? "#F0FDF4" : "#F9FAFB",
                    borderRadius: "8px",
                    border: index === 2 ? "2px solid #22C55E" : "none"
                  }}>
                    <span style={{ fontWeight: "500", color: "#374151" }}>{item.period}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontWeight: "bold", color: item.return.startsWith("+") ? "#22C55E" : "#EF4444", fontSize: "1.1rem" }}>{item.return}</span>
                      <span style={{ color: "#6B7280", fontSize: "0.8rem", marginLeft: "8px" }}>{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why NVIDIA Grew */}
            <div style={{
              backgroundColor: "#000000",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              color: "white"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#76B900", marginBottom: "16px" }}>
                🚀 Why NVIDIA Stock Grew So Much
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { icon: "🎮", title: "Gaming GPUs (2000s)", desc: "Dominated gaming graphics cards market" },
                  { icon: "⛏️", title: "Crypto Mining (2017-2021)", desc: "GPUs used for cryptocurrency mining" },
                  { icon: "🏢", title: "Data Centers (2018+)", desc: "Enterprise AI and cloud computing" },
                  { icon: "🤖", title: "AI Revolution (2023+)", desc: "ChatGPT and AI boom drove massive demand" },
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#76B900", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ color: "#9CA3AF", fontSize: "0.875rem", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📌 NVIDIA Quick Facts
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "2px" }}>Ticker Symbol</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>NVDA (NASDAQ)</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "2px" }}>IPO Date</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>January 22, 1999</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "2px" }}>Total Splits</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>5 splits (240x factor)</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "2px" }}>Dividend Yield</p>
                  <p style={{ fontWeight: "600", color: "#111827", margin: 0 }}>~0.03% annually</p>
                </div>
              </div>
            </div>

            {/* Disclaimer Box */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Important Disclaimer
              </h3>
              <ul style={{ fontSize: "0.8rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "6px" }}>Past performance ≠ future results</li>
                <li style={{ marginBottom: "6px" }}>Prices are estimates, verify before trading</li>
                <li style={{ marginBottom: "6px" }}>This is not investment advice</li>
                <li>Consult a financial advisor</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools 
              currentUrl="/nvidia-stock-calculator" 
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

        {/* Final Disclaimer */}
        <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#F3F4F6", borderRadius: "12px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            📊 <strong>Disclaimer:</strong> This calculator uses estimated historical prices and is for educational purposes only. Stock prices shown may not reflect actual market values. Past performance does not guarantee future results. Always verify current prices and consult a qualified financial advisor before making investment decisions. NVIDIA® is a registered trademark of NVIDIA Corporation.
          </p>
        </div>
      </div>
    </div>
  );
}