"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Industry benchmarks for EBITDA margins
const industryBenchmarks = [
  { industry: "Software / SaaS", margin: "20-35%", evMultiple: "10-15x" },
  { industry: "Healthcare", margin: "15-25%", evMultiple: "8-12x" },
  { industry: "Manufacturing", margin: "10-20%", evMultiple: "5-8x" },
  { industry: "Retail", margin: "5-10%", evMultiple: "4-7x" },
  { industry: "Real Estate", margin: "30-50%", evMultiple: "10-15x" },
  { industry: "Restaurants", margin: "10-15%", evMultiple: "4-6x" },
  { industry: "Professional Services", margin: "15-25%", evMultiple: "5-8x" },
  { industry: "Construction", margin: "5-15%", evMultiple: "4-6x" },
  { industry: "Transportation", margin: "10-20%", evMultiple: "5-7x" },
  { industry: "E-commerce", margin: "8-15%", evMultiple: "8-12x" }
];

// EV/EBITDA multiples by industry
const industryMultiples = [
  { id: "software", name: "Software / SaaS", multiple: 12 },
  { id: "healthcare", name: "Healthcare", multiple: 10 },
  { id: "manufacturing", name: "Manufacturing", multiple: 6.5 },
  { id: "retail", name: "Retail", multiple: 5.5 },
  { id: "realestate", name: "Real Estate", multiple: 12 },
  { id: "restaurants", name: "Restaurants", multiple: 5 },
  { id: "services", name: "Professional Services", multiple: 6.5 },
  { id: "construction", name: "Construction", multiple: 5 },
  { id: "transportation", name: "Transportation", multiple: 6 },
  { id: "ecommerce", name: "E-commerce", multiple: 10 },
  { id: "custom", name: "Custom Multiple", multiple: 6 }
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate EBITDA?",
    answer: "EBITDA can be calculated using two methods: Method 1 (from Net Income): EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization. Method 2 (from Operating Income): EBITDA = Operating Income + Depreciation + Amortization. Both methods yield the same result—the choice depends on which financial data you have available."
  },
  {
    question: "What does 20% EBITDA mean?",
    answer: "A 20% EBITDA margin means that for every $100 of revenue, the company generates $20 in EBITDA. This indicates strong operational efficiency. For context, software companies often achieve 20-35% EBITDA margins, while retail typically sees 5-10%. A 20% margin is generally considered healthy across most industries."
  },
  {
    question: "Is EBITDA just gross profit?",
    answer: "No, EBITDA and gross profit are different. Gross Profit = Revenue - Cost of Goods Sold (COGS). It only considers direct production costs. EBITDA goes further by also subtracting operating expenses (SG&A, R&D, etc.) but then adds back depreciation, amortization, interest, and taxes. EBITDA provides a broader view of operational profitability."
  },
  {
    question: "What is EBITDA in simple terms?",
    answer: "EBITDA measures how much money a business makes from its core operations before accounting for: Interest (financing costs), Taxes (which vary by location), Depreciation (wear on physical assets), and Amortization (spreading intangible asset costs). It's useful for comparing companies across different tax jurisdictions and capital structures."
  },
  {
    question: "What is a good EBITDA margin?",
    answer: "A 'good' EBITDA margin varies by industry: Software/SaaS: 20-35% is excellent. Healthcare: 15-25% is strong. Manufacturing: 10-20% is healthy. Retail: 5-10% is typical. Real Estate: 30-50% is common. Generally, margins above 10% are considered acceptable, while 15%+ indicates strong operational efficiency."
  },
  {
    question: "How is EBITDA different from net income?",
    answer: "Net income is the 'bottom line' profit after ALL expenses. EBITDA adds back interest, taxes, depreciation, and amortization to net income. This makes EBITDA useful for: comparing companies with different capital structures, evaluating operational performance independent of financing decisions, and business valuations. However, EBITDA doesn't account for capital expenditures needed to maintain operations."
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

export default function EBITDACalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculate" | "margin" | "valuation">("calculate");
  
  // Calculate EBITDA state
  const [calcMethod, setCalcMethod] = useState<"netincome" | "operating">("netincome");
  const [netIncome, setNetIncome] = useState<string>("500000");
  const [interest, setInterest] = useState<string>("50000");
  const [taxes, setTaxes] = useState<string>("150000");
  const [depreciation, setDepreciation] = useState<string>("75000");
  const [amortization, setAmortization] = useState<string>("25000");
  const [operatingIncome, setOperatingIncome] = useState<string>("700000");
  
  // EBITDA Margin state
  const [marginRevenue, setMarginRevenue] = useState<string>("5000000");
  const [marginEbitda, setMarginEbitda] = useState<string>("750000");
  
  // Valuation state
  const [valEbitda, setValEbitda] = useState<string>("750000");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("manufacturing");
  const [customMultiple, setCustomMultiple] = useState<string>("6");
  const [totalDebt, setTotalDebt] = useState<string>("500000");
  const [cashOnHand, setCashOnHand] = useState<string>("200000");

  // Calculate EBITDA based on method
  const ni = parseFloat(netIncome) || 0;
  const int = parseFloat(interest) || 0;
  const tax = parseFloat(taxes) || 0;
  const dep = parseFloat(depreciation) || 0;
  const amort = parseFloat(amortization) || 0;
  const opIncome = parseFloat(operatingIncome) || 0;

  const ebitdaFromNetIncome = ni + int + tax + dep + amort;
  const ebitdaFromOperating = opIncome + dep + amort;
  const calculatedEbitda = calcMethod === "netincome" ? ebitdaFromNetIncome : ebitdaFromOperating;
  
  // Calculate EBIT
  const ebit = calculatedEbitda - dep - amort;

  // Margin calculations
  const mRevenue = parseFloat(marginRevenue) || 0;
  const mEbitda = parseFloat(marginEbitda) || 0;
  const ebitdaMargin = mRevenue > 0 ? (mEbitda / mRevenue) * 100 : 0;

  // Valuation calculations
  const vEbitda = parseFloat(valEbitda) || 0;
  const selectedInd = industryMultiples.find(i => i.id === selectedIndustry);
  const multiple = selectedIndustry === "custom" ? (parseFloat(customMultiple) || 6) : (selectedInd?.multiple || 6);
  const debt = parseFloat(totalDebt) || 0;
  const cash = parseFloat(cashOnHand) || 0;
  
  const enterpriseValue = vEbitda * multiple;
  const equityValue = enterpriseValue - debt + cash;

  // Get margin rating
  const getMarginRating = (margin: number) => {
    if (margin >= 25) return { text: "Excellent", color: "#059669" };
    if (margin >= 15) return { text: "Strong", color: "#2563EB" };
    if (margin >= 10) return { text: "Good", color: "#7C3AED" };
    if (margin >= 5) return { text: "Average", color: "#D97706" };
    return { text: "Below Average", color: "#DC2626" };
  };

  const tabs = [
    { id: "calculate", label: "Calculate EBITDA", icon: "🧮" },
    { id: "margin", label: "EBITDA Margin", icon: "📊" },
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
            <span style={{ color: "#111827" }}>EBITDA Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📈</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              EBITDA Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) from net income 
            or operating profit. Get EBITDA margin and business valuation using EV/EBITDA multiples.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>EBITDA Formula</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>Method 1:</strong> Net Income + Interest + Taxes + Depreciation + Amortization<br />
                <strong>Method 2:</strong> Operating Income + Depreciation + Amortization
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
                {activeTab === "calculate" && "🧮 Financial Data"}
                {activeTab === "margin" && "📊 Revenue & EBITDA"}
                {activeTab === "valuation" && "💰 Valuation Inputs"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "calculate" && (
                <>
                  {/* Method Selection */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                      Calculation Method
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setCalcMethod("netincome")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: calcMethod === "netincome" ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: calcMethod === "netincome" ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          fontWeight: "500",
                          color: calcMethod === "netincome" ? "#059669" : "#374151",
                          fontSize: "0.85rem"
                        }}
                      >
                        From Net Income
                      </button>
                      <button
                        onClick={() => setCalcMethod("operating")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: calcMethod === "operating" ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: calcMethod === "operating" ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          fontWeight: "500",
                          color: calcMethod === "operating" ? "#059669" : "#374151",
                          fontSize: "0.85rem"
                        }}
                      >
                        From Operating Income
                      </button>
                    </div>
                  </div>

                  {calcMethod === "netincome" ? (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                          Net Income
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            value={netIncome}
                            onChange={(e) => setNetIncome(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px 12px 10px 28px",
                              borderRadius: "6px",
                              border: "1px solid #E5E7EB",
                              fontSize: "1rem",
                              boxSizing: "border-box"
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                            Interest Expense
                          </label>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                            <input
                              type="number"
                              value={interest}
                              onChange={(e) => setInterest(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 28px",
                                borderRadius: "6px",
                                border: "1px solid #E5E7EB",
                                fontSize: "1rem",
                                boxSizing: "border-box"
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                            Taxes
                          </label>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                            <input
                              type="number"
                              value={taxes}
                              onChange={(e) => setTaxes(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "10px 12px 10px 28px",
                                borderRadius: "6px",
                                border: "1px solid #E5E7EB",
                                fontSize: "1rem",
                                boxSizing: "border-box"
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Operating Income (EBIT)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={operatingIncome}
                          onChange={(e) => setOperatingIncome(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* D&A for both methods */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Depreciation
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={depreciation}
                          onChange={(e) => setDepreciation(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Amortization
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={amortization}
                          onChange={(e) => setAmortization(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formula display */}
                  <div style={{ marginTop: "20px", backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Formula:</strong> {calcMethod === "netincome" 
                        ? "EBITDA = Net Income + Interest + Taxes + D&A"
                        : "EBITDA = Operating Income + D&A"
                      }
                    </p>
                  </div>
                </>
              )}

              {activeTab === "margin" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Total Revenue
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={marginRevenue}
                        onChange={(e) => setMarginRevenue(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      EBITDA
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={marginEbitda}
                        onChange={(e) => setMarginEbitda(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6B7280" }}>
                      <strong>Formula:</strong> EBITDA Margin = (EBITDA ÷ Revenue) × 100
                    </p>
                  </div>
                </>
              )}

              {activeTab === "valuation" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Annual EBITDA
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={valEbitda}
                        onChange={(e) => setValEbitda(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Industry (EV/EBITDA Multiple)
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {industryMultiples.map((ind) => (
                        <option key={ind.id} value={ind.id}>
                          {ind.name} ({ind.id !== "custom" ? `${ind.multiple}x` : "Custom"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedIndustry === "custom" && (
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Custom Multiple
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          step="0.5"
                          value={customMultiple}
                          onChange={(e) => setCustomMultiple(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 30px 10px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>x</span>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Total Debt
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={totalDebt}
                          onChange={(e) => setTotalDebt(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Cash on Hand
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={cashOnHand}
                          onChange={(e) => setCashOnHand(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Formulas:</strong><br />
                      EV = EBITDA × Multiple<br />
                      Equity Value = EV - Debt + Cash
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
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "calculate" && (
                <>
                  {/* EBITDA Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>EBITDA</p>
                    <p style={{ margin: 0, fontSize: "2.75rem", fontWeight: "bold", color: "#059669" }}>
                      ${calculatedEbitda.toLocaleString()}
                    </p>
                  </div>

                  {/* EBIT Comparison */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1D4ED8", fontWeight: "600" }}>
                      📊 EBIT (Operating Income)
                    </p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                      ${ebit.toLocaleString()}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#3B82F6" }}>
                      EBITDA - D&A = ${calculatedEbitda.toLocaleString()} - ${(dep + amort).toLocaleString()}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Calculation Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      {calcMethod === "netincome" ? (
                        <>
                          <div style={{ color: "#6B7280" }}>Net Income:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${ni.toLocaleString()}</div>
                          <div style={{ color: "#6B7280" }}>+ Interest:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${int.toLocaleString()}</div>
                          <div style={{ color: "#6B7280" }}>+ Taxes:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${tax.toLocaleString()}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ color: "#6B7280" }}>Operating Income:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${opIncome.toLocaleString()}</div>
                        </>
                      )}
                      <div style={{ color: "#6B7280" }}>+ Depreciation:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${dep.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>+ Amortization:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${amort.toLocaleString()}</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", fontWeight: "600" }}>= EBITDA:</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#059669" }}>${calculatedEbitda.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "margin" && (
                <>
                  {/* Margin Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>EBITDA Margin</p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {ebitdaMargin.toFixed(1)}%
                    </p>
                  </div>

                  {/* Rating */}
                  <div style={{
                    backgroundColor: "#F5F3FF",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px",
                    textAlign: "center",
                    border: "1px solid #DDD6FE"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#5B21B6" }}>Performance Rating</p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "1.5rem", 
                      fontWeight: "bold",
                      color: getMarginRating(ebitdaMargin).color
                    }}>
                      {getMarginRating(ebitdaMargin).text}
                    </p>
                  </div>

                  {/* Summary */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px"
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Revenue:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${mRevenue.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>EBITDA:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${mEbitda.toLocaleString()}</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", fontWeight: "600" }}>Margin:</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#059669" }}>{ebitdaMargin.toFixed(2)}%</div>
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 A {ebitdaMargin.toFixed(1)}% margin means for every $100 of revenue, you generate ${(ebitdaMargin).toFixed(2)} in EBITDA.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "valuation" && (
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
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Enterprise Value (EV)</p>
                    <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "bold", color: "#059669" }}>
                      ${enterpriseValue.toLocaleString()}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                      ${vEbitda.toLocaleString()} × {multiple}x
                    </p>
                  </div>

                  {/* Equity Value */}
                  <div style={{
                    backgroundColor: "#F5F3FF",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #7C3AED",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#5B21B6" }}>Equity Value</p>
                    <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: "bold", color: "#7C3AED" }}>
                      ${equityValue.toLocaleString()}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6D28D9" }}>
                      EV - Debt + Cash
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Valuation Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>EBITDA:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${vEbitda.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>× Multiple:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{multiple}x</div>
                      <div style={{ color: "#6B7280" }}>= Enterprise Value:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>${enterpriseValue.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>- Debt:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#DC2626" }}>-${debt.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>+ Cash:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>+${cash.toLocaleString()}</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", fontWeight: "600" }}>= Equity Value:</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#7C3AED" }}>${equityValue.toLocaleString()}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Industry Benchmarks Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Industry Benchmarks: EBITDA Margins & Valuation Multiples</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F3FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Industry</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Typical EBITDA Margin</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>EV/EBITDA Multiple</th>
                </tr>
              </thead>
              <tbody>
                {industryBenchmarks.map((ind, idx) => (
                  <tr key={ind.industry} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{ind.industry}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{ind.margin}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#7C3AED", fontWeight: "600" }}>{ind.evMultiple}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Benchmarks are general guidelines and may vary based on company size, growth rate, market conditions, and other factors.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>📈 Understanding EBITDA</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>EBITDA</strong> (Earnings Before Interest, Taxes, Depreciation, and Amortization) measures 
                  a company&apos;s operational profitability by excluding non-operational factors. It&apos;s widely used by 
                  investors, analysts, and business owners to evaluate financial performance.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why EBITDA Matters</h3>
                
                <p><strong>Company Comparisons:</strong> By removing interest, taxes, and non-cash expenses, EBITDA allows fair comparison between companies with different capital structures and tax situations.</p>
                
                <p><strong>Business Valuations:</strong> The EV/EBITDA multiple is one of the most common methods to value private companies and assess acquisition prices.</p>
                
                <p><strong>Cash Flow Proxy:</strong> EBITDA approximates operating cash flow, though it doesn&apos;t account for changes in working capital or capital expenditures.</p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>EBITDA vs EBIT</h3>
                <p>
                  <strong>EBIT (Operating Income)</strong> includes depreciation and amortization expenses, making it useful 
                  for capital-intensive businesses. <strong>EBITDA</strong> excludes these non-cash charges, providing a cleaner 
                  view of cash generation but potentially overstating profitability for asset-heavy companies.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Formulas */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📐 Key Formulas</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>EBITDA</strong> = NI + I + T + D + A</p>
                <p style={{ margin: 0 }}><strong>EBITDA</strong> = EBIT + D + A</p>
                <p style={{ margin: 0 }}><strong>Margin</strong> = EBITDA ÷ Revenue</p>
                <p style={{ margin: 0 }}><strong>EV</strong> = EBITDA × Multiple</p>
              </div>
            </div>

            {/* Key Definitions */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>📚 Key Terms</h3>
              <div style={{ fontSize: "0.8rem", color: "#6D28D9", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>D&A:</strong> Depreciation & Amortization</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>EBIT:</strong> Operating Income</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>EV:</strong> Enterprise Value</p>
                <p style={{ margin: 0 }}><strong>Multiple:</strong> Valuation ratio</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/ebitda-calculator" currentCategory="Finance" />
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
            📈 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            EBITDA is a non-GAAP metric and has limitations. Industry benchmarks are approximations and may vary. 
            Consult with a financial professional for business valuations and investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}