"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Industry multiples data
const industryMultiples = {
  "software": { name: "Software / SaaS", min: 8, max: 15, typical: 10 },
  "healthcare": { name: "Healthcare", min: 7, max: 12, typical: 9 },
  "financial": { name: "Financial Services", min: 6, max: 12, typical: 8 },
  "manufacturing": { name: "Manufacturing", min: 5, max: 8, typical: 6 },
  "professional": { name: "Professional Services", min: 4, max: 8, typical: 6 },
  "retail": { name: "Retail / E-commerce", min: 4, max: 7, typical: 5 },
  "construction": { name: "Construction", min: 4, max: 6, typical: 5 },
  "restaurant": { name: "Restaurant / Food", min: 3, max: 6, typical: 4 },
  "transportation": { name: "Transportation / Logistics", min: 4, max: 7, typical: 5 },
  "custom": { name: "Custom Multiple", min: 1, max: 20, typical: 6 }
};

// FAQ data
const faqs = [
  {
    question: "How do you calculate enterprise value?",
    answer: "Enterprise Value (EV) is calculated using the formula: EV = Market Capitalization + Total Debt + Preferred Stock + Minority Interest - Cash and Cash Equivalents. For example, a company with $10M market cap, $2M debt, and $500K cash has an EV of $11.5M. This represents the theoretical takeover price of a company."
  },
  {
    question: "How much is a business worth with $500,000 in sales?",
    answer: "A business with $500,000 in annual revenue could be worth $500K to $2.5M depending on profitability and industry. If the business has 20% EBITDA margins ($100K EBITDA) and trades at 5x EBITDA, the enterprise value would be $500,000. Revenue multiples typically range from 0.5x to 3x for most small businesses, with SaaS companies commanding higher multiples (3x-10x revenue)."
  },
  {
    question: "What is the valuation of a company if 10% is $100,000?",
    answer: "If 10% of a company is worth $100,000, the total equity value is $1,000,000 ($100,000 ÷ 0.10). To find enterprise value, add total debt and subtract cash. For example, if the company has $200K debt and $50K cash: EV = $1,000,000 + $200,000 - $50,000 = $1,150,000."
  },
  {
    question: "Why is cash subtracted from enterprise value?",
    answer: "Cash is subtracted because when acquiring a company, the buyer effectively receives the company's cash. This cash can be used to pay off debt or offset the purchase price. Think of it as buying a house with money in a safe inside - you get that money as part of the deal, reducing your net cost. Enterprise value represents the net cost to acquire and control the business."
  },
  {
    question: "What is a good EV/EBITDA ratio?",
    answer: "A 'good' EV/EBITDA ratio depends on the industry. Software/SaaS companies typically trade at 8-15x EBITDA, while manufacturing trades at 5-8x. Generally, ratios below 10x are considered reasonable for most industries. Lower multiples may indicate undervaluation or higher risk, while higher multiples suggest growth expectations or premium quality. Always compare to industry peers."
  },
  {
    question: "How do I calculate how much my business is worth?",
    answer: "To value your business: 1) Calculate your adjusted EBITDA (add back owner salary, one-time expenses), 2) Research industry multiples (typically 3-8x EBITDA for small businesses), 3) Multiply EBITDA × multiple to get enterprise value, 4) Subtract debt and add excess cash for equity value. For a business with $200K EBITDA at 5x multiple: EV = $1M, and if you have $100K debt, equity value = $900K."
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
function formatCurrency(num: number): string {
  if (num >= 1000000000) {
    return "$" + (num / 1000000000).toFixed(2) + "B";
  } else if (num >= 1000000) {
    return "$" + (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return "$" + (num / 1000).toFixed(1) + "K";
  }
  return "$" + num.toLocaleString();
}

// Format full currency
function formatFullCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

export default function EnterpriseValueCalculator() {
  const [activeTab, setActiveTab] = useState<"ev" | "valuation">("ev");
  
  // Tab 1: EV Calculator State
  const [marketCap, setMarketCap] = useState<string>("10000000");
  const [totalDebt, setTotalDebt] = useState<string>("2000000");
  const [preferredStock, setPreferredStock] = useState<string>("0");
  const [minorityInterest, setMinorityInterest] = useState<string>("0");
  const [cashEquivalents, setCashEquivalents] = useState<string>("500000");
  
  // Tab 2: Business Valuation State
  const [valuationMode, setValuationMode] = useState<"ebitda-to-ev" | "ev-to-multiple">("ebitda-to-ev");
  const [ebitda, setEbitda] = useState<string>("500000");
  const [industry, setIndustry] = useState<string>("manufacturing");
  const [customMultiple, setCustomMultiple] = useState<string>("6");
  const [bizDebt, setBizDebt] = useState<string>("200000");
  const [bizCash, setBizCash] = useState<string>("100000");
  const [knownEV, setKnownEV] = useState<string>("3000000");
  const [knownEbitda, setKnownEbitda] = useState<string>("500000");

  // Tab 1 Calculations
  const marketCapNum = parseFloat(marketCap) || 0;
  const totalDebtNum = parseFloat(totalDebt) || 0;
  const preferredStockNum = parseFloat(preferredStock) || 0;
  const minorityInterestNum = parseFloat(minorityInterest) || 0;
  const cashEquivalentsNum = parseFloat(cashEquivalents) || 0;
  
  const enterpriseValue = marketCapNum + totalDebtNum + preferredStockNum + minorityInterestNum - cashEquivalentsNum;
  const netDebt = totalDebtNum - cashEquivalentsNum;
  const evToMarketCapRatio = marketCapNum > 0 ? enterpriseValue / marketCapNum : 0;
  
  // Tab 2 Calculations
  const ebitdaNum = parseFloat(ebitda) || 0;
  const industryData = industryMultiples[industry as keyof typeof industryMultiples];
  const multipleToUse = industry === "custom" ? (parseFloat(customMultiple) || 6) : industryData.typical;
  const bizDebtNum = parseFloat(bizDebt) || 0;
  const bizCashNum = parseFloat(bizCash) || 0;
  
  const calculatedEV = ebitdaNum * multipleToUse;
  const calculatedEVMin = ebitdaNum * industryData.min;
  const calculatedEVMax = ebitdaNum * industryData.max;
  const equityValue = calculatedEV - bizDebtNum + bizCashNum;
  const equityValueMin = calculatedEVMin - bizDebtNum + bizCashNum;
  const equityValueMax = calculatedEVMax - bizDebtNum + bizCashNum;
  
  // Mode B calculations
  const knownEVNum = parseFloat(knownEV) || 0;
  const knownEbitdaNum = parseFloat(knownEbitda) || 0;
  const impliedMultiple = knownEbitdaNum > 0 ? knownEVNum / knownEbitdaNum : 0;

  // Get multiple assessment
  const getMultipleAssessment = (multiple: number, industry: string) => {
    const data = industryMultiples[industry as keyof typeof industryMultiples];
    if (!data) return { color: "#6B7280", text: "N/A" };
    
    if (multiple < data.min) return { color: "#059669", text: "Below market - Potential value buy", icon: "📉" };
    if (multiple <= data.typical) return { color: "#2563EB", text: "Fair value - Within market range", icon: "✅" };
    if (multiple <= data.max) return { color: "#F59E0B", text: "Above average - Premium pricing", icon: "📈" };
    return { color: "#DC2626", text: "High premium - Above typical range", icon: "⚠️" };
  };

  const tabs = [
    { id: "ev", label: "EV Calculator", icon: "🏢" },
    { id: "valuation", label: "Business Valuation", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Enterprise Value Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏢</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Enterprise Value Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate enterprise value (EV) for public companies or estimate business value using EBITDA multiples. 
            Perfect for M&A analysis, investment decisions, and private company valuation.
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
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 8px 0" }}>Enterprise Value Formula</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                <strong>EV = Market Cap + Total Debt + Preferred Stock + Minority Interest - Cash</strong><br/>
                Enterprise value represents the total cost to acquire a company, including debt obligations minus available cash.
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

        {/* Calculator Grid */}
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
                {activeTab === "ev" && "🏢 Company Financials"}
                {activeTab === "valuation" && "💰 Business Details"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* EV CALCULATOR TAB */}
              {activeTab === "ev" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "16px", padding: "10px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    Enter the company&apos;s financial data to calculate its enterprise value. All fields are in USD.
                  </p>

                  {/* Market Capitalization */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Market Capitalization
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={marketCap}
                        onChange={(e) => setMarketCap(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        placeholder="10,000,000"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Share price × Outstanding shares</p>
                  </div>

                  {/* Total Debt */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Total Debt
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={totalDebt}
                        onChange={(e) => setTotalDebt(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        placeholder="2,000,000"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Short-term + Long-term debt</p>
                  </div>

                  {/* Preferred Stock */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Preferred Stock
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={preferredStock}
                        onChange={(e) => setPreferredStock(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        placeholder="0"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Value of preferred shares (if any)</p>
                  </div>

                  {/* Minority Interest */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Minority Interest
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={minorityInterest}
                        onChange={(e) => setMinorityInterest(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        placeholder="0"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Non-controlling interest in subsidiaries</p>
                  </div>

                  {/* Cash & Equivalents */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Cash & Cash Equivalents
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={cashEquivalents}
                        onChange={(e) => setCashEquivalents(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        placeholder="500,000"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Cash, marketable securities, liquid assets</p>
                  </div>
                </>
              )}

              {/* BUSINESS VALUATION TAB */}
              {activeTab === "valuation" && (
                <>
                  {/* Mode Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Calculation Mode
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setValuationMode("ebitda-to-ev")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: valuationMode === "ebitda-to-ev" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: valuationMode === "ebitda-to-ev" ? "#EFF6FF" : "white",
                          color: valuationMode === "ebitda-to-ev" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        📈 EBITDA → Value<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>Estimate business worth</span>
                      </button>
                      <button
                        onClick={() => setValuationMode("ev-to-multiple")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: valuationMode === "ev-to-multiple" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: valuationMode === "ev-to-multiple" ? "#EFF6FF" : "white",
                          color: valuationMode === "ev-to-multiple" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        🔍 Value → Multiple<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>Analyze deal pricing</span>
                      </button>
                    </div>
                  </div>

                  {valuationMode === "ebitda-to-ev" ? (
                    <>
                      {/* EBITDA */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Annual EBITDA
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={ebitda}
                            onChange={(e) => setEbitda(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Earnings Before Interest, Taxes, Depreciation & Amortization</p>
                      </div>

                      {/* Industry */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Industry
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                        >
                          {Object.entries(industryMultiples).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value.name} ({value.min}x - {value.max}x)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Multiple */}
                      {industry === "custom" && (
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                            Custom EBITDA Multiple
                          </label>
                          <input
                            type="number"
                            value={customMultiple}
                            onChange={(e) => setCustomMultiple(e.target.value)}
                            step="0.1"
                            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                      )}

                      {/* Debt */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Total Debt
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={bizDebt}
                            onChange={(e) => setBizDebt(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>

                      {/* Cash */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Cash & Equivalents
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={bizCash}
                            onChange={(e) => setBizCash(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Known EV */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Enterprise Value (Deal Price)
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={knownEV}
                            onChange={(e) => setKnownEV(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>Transaction value or asking price</p>
                      </div>

                      {/* Known EBITDA */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Annual EBITDA
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={knownEbitda}
                            onChange={(e) => setKnownEbitda(e.target.value)}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>

                      {/* Industry for comparison */}
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Industry (for comparison)
                        </label>
                        <select
                          value={industry}
                          onChange={(e) => setIndustry(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                        >
                          {Object.entries(industryMultiples).filter(([key]) => key !== "custom").map(([key, value]) => (
                            <option key={key} value={key}>
                              {value.name} ({value.min}x - {value.max}x typical)
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
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
                {activeTab === "ev" && "📊 Enterprise Value"}
                {activeTab === "valuation" && (valuationMode === "ebitda-to-ev" ? "💰 Business Valuation" : "🔍 Multiple Analysis")}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* EV RESULTS */}
              {activeTab === "ev" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Enterprise Value (EV)
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(enterpriseValue)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {formatFullCurrency(enterpriseValue)}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Calculation Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>Market Capitalization</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(marketCapNum)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>+ Total Debt</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>+{formatCurrency(totalDebtNum)}</span>
                      </div>
                      {preferredStockNum > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>+ Preferred Stock</span>
                          <span style={{ fontWeight: "600", color: "#DC2626" }}>+{formatCurrency(preferredStockNum)}</span>
                        </div>
                      )}
                      {minorityInterestNum > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>+ Minority Interest</span>
                          <span style={{ fontWeight: "600", color: "#DC2626" }}>+{formatCurrency(minorityInterestNum)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>- Cash & Equivalents</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>-{formatCurrency(cashEquivalentsNum)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Enterprise Value</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{formatCurrency(enterpriseValue)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Net Debt</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: netDebt >= 0 ? "#DC2626" : "#059669" }}>
                        {formatCurrency(netDebt)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>EV / Market Cap</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {evToMarketCapRatio.toFixed(2)}x
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* VALUATION RESULTS */}
              {activeTab === "valuation" && valuationMode === "ebitda-to-ev" && (
                <>
                  {/* Enterprise Value */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Enterprise Value
                    </p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(calculatedEVMin)} - {formatCurrency(calculatedEVMax)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Typical: <strong>{formatCurrency(calculatedEV)}</strong> ({multipleToUse}x EBITDA)
                    </p>
                  </div>

                  {/* Equity Value */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #BFDBFE",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                      Estimated Equity Value (What Seller Receives)
                    </p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                      {formatCurrency(equityValueMin)} - {formatCurrency(equityValueMax)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#1D4ED8" }}>
                      EV - Debt + Cash = Equity Value
                    </p>
                  </div>

                  {/* Calculation Details */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Valuation Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>EBITDA</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(ebitdaNum)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Industry Multiple Range</span>
                        <span style={{ fontWeight: "600" }}>{industryData.min}x - {industryData.max}x</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Enterprise Value Range</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(calculatedEVMin)} - {formatCurrency(calculatedEVMax)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Less: Debt</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(bizDebtNum)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Plus: Cash</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>+{formatCurrency(bizCashNum)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Industry Info */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      💡 <strong>{industryData.name}</strong> companies typically trade at {industryData.min}x-{industryData.max}x EBITDA, 
                      with {industryData.typical}x being most common.
                    </p>
                  </div>
                </>
              )}

              {/* MULTIPLE ANALYSIS RESULTS */}
              {activeTab === "valuation" && valuationMode === "ev-to-multiple" && (
                <>
                  {/* Implied Multiple */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Implied EV/EBITDA Multiple
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {impliedMultiple.toFixed(1)}x
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {formatCurrency(knownEVNum)} ÷ {formatCurrency(knownEbitdaNum)}
                    </p>
                  </div>

                  {/* Assessment */}
                  {(() => {
                    const assessment = getMultipleAssessment(impliedMultiple, industry);
                    return (
                      <div style={{
                        backgroundColor: `${assessment.color}15`,
                        borderRadius: "10px",
                        padding: "16px",
                        marginBottom: "16px",
                        border: `1px solid ${assessment.color}40`
                      }}>
                        <p style={{ margin: 0, fontSize: "0.95rem", color: assessment.color, fontWeight: "600" }}>
                          {assessment.icon} {assessment.text}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Industry Comparison */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Industry Comparison: {industryData.name}</h4>
                    <div style={{ position: "relative", height: "40px", backgroundColor: "#E5E7EB", borderRadius: "8px", marginBottom: "12px" }}>
                      {/* Range bar */}
                      <div style={{
                        position: "absolute",
                        left: `${(industryData.min / 20) * 100}%`,
                        width: `${((industryData.max - industryData.min) / 20) * 100}%`,
                        height: "100%",
                        backgroundColor: "#BFDBFE",
                        borderRadius: "8px"
                      }} />
                      {/* Typical marker */}
                      <div style={{
                        position: "absolute",
                        left: `${(industryData.typical / 20) * 100}%`,
                        top: "0",
                        bottom: "0",
                        width: "3px",
                        backgroundColor: "#2563EB",
                        transform: "translateX(-50%)"
                      }} />
                      {/* Your multiple marker */}
                      <div style={{
                        position: "absolute",
                        left: `${Math.min(impliedMultiple / 20, 1) * 100}%`,
                        top: "-4px",
                        bottom: "-4px",
                        width: "4px",
                        backgroundColor: "#059669",
                        borderRadius: "4px",
                        transform: "translateX(-50%)"
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>0x</span>
                      <span>Industry: {industryData.min}x - {industryData.max}x (typical: {industryData.typical}x)</span>
                      <span>20x</span>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                      💡 At <strong>{impliedMultiple.toFixed(1)}x EBITDA</strong>, this deal is 
                      {impliedMultiple < industryData.typical 
                        ? ` ${((1 - impliedMultiple/industryData.typical) * 100).toFixed(0)}% below` 
                        : ` ${((impliedMultiple/industryData.typical - 1) * 100).toFixed(0)}% above`
                      } the typical {industryData.typical}x multiple for {industryData.name.toLowerCase()}.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Industry Multiples Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 EV/EBITDA Multiples by Industry</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Industry</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Low</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Typical</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>High</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(industryMultiples).filter(([key]) => key !== "custom").map(([key, data], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{data.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{data.min}x</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>{data.typical}x</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{data.max}x</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>
                      {key === "software" && "Recurring revenue commands premium"}
                      {key === "healthcare" && "Regulated, stable cash flows"}
                      {key === "financial" && "Asset-heavy, regulated"}
                      {key === "manufacturing" && "Capital intensive, cyclical"}
                      {key === "professional" && "People-dependent, lower capex"}
                      {key === "retail" && "Margin pressure, competition"}
                      {key === "construction" && "Project-based, cyclical"}
                      {key === "restaurant" && "High competition, thin margins"}
                      {key === "transportation" && "Asset-heavy, fuel costs"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Multiples are indicative and vary based on company size, growth rate, profitability, and market conditions. 
              Higher growth and margins typically command higher multiples.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏢 Understanding Enterprise Value</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>What is Enterprise Value?</h3>
                <p>
                  Enterprise Value (EV) represents the total value of a company - what it would theoretically cost to acquire 
                  the entire business. Unlike market capitalization, which only reflects the value of equity (shares), EV accounts 
                  for debt obligations and cash on hand, giving a more complete picture of a company&apos;s worth.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Enterprise Value vs. Equity Value</h3>
                <p>
                  <strong>Equity Value (Market Cap)</strong> is what shareholders own - share price times shares outstanding. 
                  <strong>Enterprise Value</strong> is what you&apos;d pay to own the entire business, including assuming its debts. 
                  When acquiring a company, you pay for the equity but also take on responsibility for debts (minus any cash you receive).
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Use EV/EBITDA for Valuation?</h3>
                <p>
                  EV/EBITDA is preferred over P/E ratios for comparing companies because it&apos;s capital structure neutral - 
                  it doesn&apos;t matter how a company is financed. Two identical businesses with different debt levels will have 
                  similar EV/EBITDA multiples but very different P/E ratios. This makes it ideal for M&A analysis and 
                  comparing companies across industries.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📐 EV Formula</h3>
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px", fontFamily: "monospace", fontSize: "0.85rem", color: "#1D4ED8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>EV =</strong></p>
                <p style={{ margin: "0 0 4px 0" }}>+ Market Cap</p>
                <p style={{ margin: "0 0 4px 0" }}>+ Total Debt</p>
                <p style={{ margin: "0 0 4px 0" }}>+ Preferred Stock</p>
                <p style={{ margin: "0 0 4px 0" }}>+ Minority Interest</p>
                <p style={{ margin: "0", color: "#059669" }}>- Cash & Equivalents</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Quick Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Higher growth = Higher multiple</li>
                <li>Recurring revenue = Premium valuation</li>
                <li>Net debt negative = Cash-rich company</li>
                <li>Always compare to industry peers</li>
                <li>EBITDA should be &quot;normalized&quot; (adjusted)</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/enterprise-value-calculator" currentCategory="Finance" />
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
            🏢 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Actual company valuations depend on many factors including growth prospects, market conditions, competitive position, 
            and quality of earnings. Consult with qualified financial advisors for investment or M&A decisions.
          </p>
        </div>
      </div>
    </div>
  );
}