"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// State Capital Gains Tax Rates (2024-2025)
const stateCapitalGainsRates: Record<string, { name: string; rate: number }> = {
  AL: { name: "Alabama", rate: 0.050 },
  AK: { name: "Alaska", rate: 0.000 },
  AZ: { name: "Arizona", rate: 0.025 },
  AR: { name: "Arkansas", rate: 0.044 },
  CA: { name: "California", rate: 0.133 },
  CO: { name: "Colorado", rate: 0.044 },
  CT: { name: "Connecticut", rate: 0.070 },
  DE: { name: "Delaware", rate: 0.066 },
  FL: { name: "Florida", rate: 0.000 },
  GA: { name: "Georgia", rate: 0.055 },
  HI: { name: "Hawaii", rate: 0.075 },
  ID: { name: "Idaho", rate: 0.058 },
  IL: { name: "Illinois", rate: 0.050 },
  IN: { name: "Indiana", rate: 0.032 },
  IA: { name: "Iowa", rate: 0.060 },
  KS: { name: "Kansas", rate: 0.057 },
  KY: { name: "Kentucky", rate: 0.045 },
  LA: { name: "Louisiana", rate: 0.043 },
  ME: { name: "Maine", rate: 0.075 },
  MD: { name: "Maryland", rate: 0.058 },
  MA: { name: "Massachusetts", rate: 0.090 },
  MI: { name: "Michigan", rate: 0.043 },
  MN: { name: "Minnesota", rate: 0.099 },
  MS: { name: "Mississippi", rate: 0.050 },
  MO: { name: "Missouri", rate: 0.048 },
  MT: { name: "Montana", rate: 0.059 },
  NE: { name: "Nebraska", rate: 0.064 },
  NV: { name: "Nevada", rate: 0.000 },
  NH: { name: "New Hampshire", rate: 0.050 },
  NJ: { name: "New Jersey", rate: 0.109 },
  NM: { name: "New Mexico", rate: 0.059 },
  NY: { name: "New York", rate: 0.109 },
  NC: { name: "North Carolina", rate: 0.053 },
  ND: { name: "North Dakota", rate: 0.029 },
  OH: { name: "Ohio", rate: 0.040 },
  OK: { name: "Oklahoma", rate: 0.048 },
  OR: { name: "Oregon", rate: 0.099 },
  PA: { name: "Pennsylvania", rate: 0.031 },
  RI: { name: "Rhode Island", rate: 0.060 },
  SC: { name: "South Carolina", rate: 0.065 },
  SD: { name: "South Dakota", rate: 0.000 },
  TN: { name: "Tennessee", rate: 0.000 },
  TX: { name: "Texas", rate: 0.000 },
  UT: { name: "Utah", rate: 0.047 },
  VT: { name: "Vermont", rate: 0.088 },
  VA: { name: "Virginia", rate: 0.058 },
  WA: { name: "Washington", rate: 0.070 },
  WV: { name: "West Virginia", rate: 0.065 },
  WI: { name: "Wisconsin", rate: 0.076 },
  WY: { name: "Wyoming", rate: 0.000 },
  DC: { name: "Washington D.C.", rate: 0.109 }
};

// Federal Capital Gains Tax Brackets (2024-2025)
const federalCapGainsBrackets = {
  single: [
    { threshold: 47025, rate: 0.00 },
    { threshold: 518900, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 }
  ],
  married: [
    { threshold: 94050, rate: 0.00 },
    { threshold: 583750, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 }
  ]
};

// Constants
const DEPRECIATION_RECAPTURE_RATE = 0.25;
const NIIT_RATE = 0.038;
const NIIT_THRESHOLD = { single: 200000, married: 250000 };

// FAQ data
const faqs = [
  {
    question: "What is a 1031 Exchange?",
    answer: "A 1031 exchange, named after Section 1031 of the IRS Code, allows real estate investors to defer capital gains taxes when selling an investment property by reinvesting the proceeds into a similar 'like-kind' property. This powerful tax strategy lets you preserve your investment capital and potentially grow your real estate portfolio without immediate tax consequences."
  },
  {
    question: "What is the 90% rule for 1031 exchange?",
    answer: "The 90% rule states that if you identify more than three replacement properties, the total fair market value of all identified properties cannot exceed 200% of the value of the relinquished property, OR you must acquire at least 95% of the value of all properties identified. This rule prevents investors from identifying an unlimited number of properties as potential replacements."
  },
  {
    question: "What is the 75% rule in a 1031 exchange?",
    answer: "The 75% rule is actually part of the 95% identification rule. If you identify more than three properties and their total value exceeds 200% of the relinquished property, you must acquire properties representing at least 95% of the total identified value. Some refer to this in context of the improvement exchange where 75% of exchange funds must be used for property acquisition vs improvements."
  },
  {
    question: "How much capital gains tax do I pay on $100,000?",
    answer: "The capital gains tax on $100,000 depends on your income level and filing status. For most investors, the federal rate is 15% ($15,000), plus state taxes which vary from 0% to 13.3%. High earners may pay 20% federal plus 3.8% Net Investment Income Tax. A 1031 exchange can defer these taxes entirely if you reinvest in qualifying replacement property."
  },
  {
    question: "What is boot in a 1031 exchange?",
    answer: "Boot is any cash or non-like-kind property received during a 1031 exchange that doesn't qualify for tax deferral. There are two main types: Cash Boot (leftover cash not reinvested) and Mortgage Boot (debt reduction when your new property has a smaller mortgage). Boot is taxable up to the amount of your realized gain."
  },
  {
    question: "How can I avoid capital gains tax without a 1031 exchange?",
    answer: "Alternatives include: living in the property for 2+ years to qualify for the primary residence exclusion ($250K single/$500K married), holding until death for stepped-up basis, donating to charity, using installment sales to spread gains over time, or investing in Opportunity Zones. Each strategy has specific requirements and limitations."
  }
];

// FAQ component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

// Result types
interface TaxSavingsResult {
  salePrice: number;
  adjustedBasis: number;
  totalGain: number;
  depreciationRecapture: number;
  capitalGain: number;
  federalCapGainsTax: number;
  federalDepreciationTax: number;
  stateCapGainsTax: number;
  niitTax: number;
  totalTaxIfSold: number;
  taxSavingsWithExchange: number;
}

interface BootResult {
  cashBoot: number;
  mortgageBoot: number;
  totalBoot: number;
  estimatedTaxOnBoot: number;
}

interface TimelineResult {
  saleDate: Date;
  identificationDeadline: Date;
  exchangeDeadline: Date;
}

export default function ExchangeCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"savings" | "boot" | "timeline">("savings");

  // Tax Savings inputs
  const [salePrice, setSalePrice] = useState<string>("500000");
  const [purchasePrice, setPurchasePrice] = useState<string>("300000");
  const [depreciation, setDepreciation] = useState<string>("50000");
  const [sellingCosts, setSellingCosts] = useState<string>("8");
  const [state, setState] = useState<string>("CA");
  const [filingStatus, setFilingStatus] = useState<string>("single");
  const [annualIncome, setAnnualIncome] = useState<string>("150000");

  // Boot Calculator inputs
  const [relinquishedPrice, setRelinquishedPrice] = useState<string>("500000");
  const [relinquishedMortgage, setRelinquishedMortgage] = useState<string>("200000");
  const [replacementPrice, setReplacementPrice] = useState<string>("450000");
  const [replacementMortgage, setReplacementMortgage] = useState<string>("150000");
  const [cashTakenOut, setCashTakenOut] = useState<string>("0");

  // Timeline inputs
  const [saleDate, setSaleDate] = useState<string>("");

  // Results
  const [savingsResult, setSavingsResult] = useState<TaxSavingsResult | null>(null);
  const [bootResult, setBootResult] = useState<BootResult | null>(null);
  const [timelineResult, setTimelineResult] = useState<TimelineResult | null>(null);

  // Get federal capital gains rate
  const getFederalRate = (income: number, status: string): number => {
    const brackets = status === "married" ? federalCapGainsBrackets.married : federalCapGainsBrackets.single;
    for (const bracket of brackets) {
      if (income <= bracket.threshold) {
        return bracket.rate;
      }
    }
    return 0.20;
  };

  // Calculate Tax Savings
  const calculateSavings = () => {
    const sale = parseFloat(salePrice) || 0;
    const purchase = parseFloat(purchasePrice) || 0;
    const dep = parseFloat(depreciation) || 0;
    const costs = (parseFloat(sellingCosts) || 0) / 100;
    const income = parseFloat(annualIncome) || 0;

    const netSalePrice = sale * (1 - costs);
    const adjustedBasis = purchase - dep;
    const totalGain = netSalePrice - adjustedBasis;

    if (totalGain <= 0) {
      alert("No capital gain to calculate. Your adjusted basis exceeds the net sale price.");
      return;
    }

    const depreciationRecapture = Math.min(dep, totalGain);
    const capitalGain = totalGain - depreciationRecapture;

    const federalRate = getFederalRate(income + capitalGain, filingStatus);
    const federalCapGainsTax = capitalGain * federalRate;
    const federalDepreciationTax = depreciationRecapture * DEPRECIATION_RECAPTURE_RATE;

    const stateRate = stateCapitalGainsRates[state]?.rate || 0;
    const stateCapGainsTax = totalGain * stateRate;

    const niitThreshold = filingStatus === "married" ? NIIT_THRESHOLD.married : NIIT_THRESHOLD.single;
    const niitTax = income > niitThreshold ? capitalGain * NIIT_RATE : 0;

    const totalTaxIfSold = federalCapGainsTax + federalDepreciationTax + stateCapGainsTax + niitTax;

    setSavingsResult({
      salePrice: sale,
      adjustedBasis,
      totalGain,
      depreciationRecapture,
      capitalGain,
      federalCapGainsTax,
      federalDepreciationTax,
      stateCapGainsTax,
      niitTax,
      totalTaxIfSold,
      taxSavingsWithExchange: totalTaxIfSold
    });
  };

  // Calculate Boot
  const calculateBoot = () => {
    const relPrice = parseFloat(relinquishedPrice) || 0;
    const relMortgage = parseFloat(relinquishedMortgage) || 0;
    const repPrice = parseFloat(replacementPrice) || 0;
    const repMortgage = parseFloat(replacementMortgage) || 0;
    const cashOut = parseFloat(cashTakenOut) || 0;

    // Cash Boot = difference in price + cash taken out
    const priceDifference = Math.max(0, relPrice - repPrice);
    const cashBoot = priceDifference + cashOut;

    // Mortgage Boot = reduction in debt
    const mortgageBoot = Math.max(0, relMortgage - repMortgage);

    const totalBoot = cashBoot + mortgageBoot;

    // Estimate tax on boot (using 25% combined rate as approximation)
    const estimatedTaxOnBoot = totalBoot * 0.25;

    setBootResult({
      cashBoot,
      mortgageBoot,
      totalBoot,
      estimatedTaxOnBoot
    });
  };

  // Calculate Timeline
  const calculateTimeline = () => {
    if (!saleDate) {
      alert("Please enter the sale closing date");
      return;
    }

    const sale = new Date(saleDate);
    const identification = new Date(sale);
    identification.setDate(identification.getDate() + 45);

    const exchange = new Date(sale);
    exchange.setDate(exchange.getDate() + 180);

    setTimelineResult({
      saleDate: sale,
      identificationDeadline: identification,
      exchangeDeadline: exchange
    });
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Reset functions
  const resetSavings = () => {
    setSalePrice("500000");
    setPurchasePrice("300000");
    setDepreciation("50000");
    setSellingCosts("8");
    setState("CA");
    setFilingStatus("single");
    setAnnualIncome("150000");
    setSavingsResult(null);
  };

  const resetBoot = () => {
    setRelinquishedPrice("500000");
    setRelinquishedMortgage("200000");
    setReplacementPrice("450000");
    setReplacementMortgage("150000");
    setCashTakenOut("0");
    setBootResult(null);
  };

  const resetTimeline = () => {
    setSaleDate("");
    setTimelineResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">1031 Exchange Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            1031 Exchange Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your potential tax savings with a 1031 exchange, estimate boot amounts, and track important deadlines. Make informed decisions about your real estate investments.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid #E5E7EB", paddingBottom: "16px" }}>
            {[
              { id: "savings", label: "💰 Tax Savings", desc: "Compare sell vs exchange" },
              { id: "boot", label: "🥾 Boot Calculator", desc: "Calculate taxable boot" },
              { id: "timeline", label: "📅 Timeline", desc: "45/180 day deadlines" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "savings" | "boot" | "timeline")}
                style={{
                  flex: "1",
                  padding: "16px 12px",
                  borderRadius: "12px",
                  border: activeTab === tab.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                  backgroundColor: activeTab === tab.id ? "#EFF6FF" : "white",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <p style={{
                  fontWeight: "600",
                  color: activeTab === tab.id ? "#1E40AF" : "#374151",
                  marginBottom: "4px"
                }}>
                  {tab.label}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{tab.desc}</p>
              </button>
            ))}
          </div>

          {/* Tax Savings Tab */}
          {activeTab === "savings" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "24px" }}>
                {/* Sale Price */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>

                {/* Original Purchase Price */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Original Purchase Price ($)
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>

                {/* Depreciation Taken */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Depreciation Taken ($)
                  </label>
                  <input
                    type="number"
                    value={depreciation}
                    onChange={(e) => setDepreciation(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>

                {/* Selling Costs */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Selling Costs (%)
                  </label>
                  <input
                    type="number"
                    value={sellingCosts}
                    onChange={(e) => setSellingCosts(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem"
                    }}
                    step="0.1"
                  />
                </div>

                {/* State */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Property State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      backgroundColor: "white"
                    }}
                  >
                    {Object.entries(stateCapitalGainsRates).map(([code, data]) => (
                      <option key={code} value={code}>
                        {data.name} ({(data.rate * 100).toFixed(1)}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filing Status */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem",
                      backgroundColor: "white"
                    }}
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                  </select>
                </div>

                {/* Annual Income */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Annual Income ($)
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateSavings}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Tax Savings
                </button>
                <button
                  onClick={resetSavings}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Tax Savings Results */}
              {savingsResult && (
                <div className="calc-results" style={{ marginTop: "32px", borderTop: "1px solid #E5E7EB", paddingTop: "32px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                    📊 Tax Analysis Results
                  </h3>

                  {/* Summary Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Gain</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{formatCurrency(savingsResult.totalGain)}</p>
                    </div>
                    <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#991B1B", marginBottom: "4px" }}>Total Tax if Sold</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>{formatCurrency(savingsResult.totalTaxIfSold)}</p>
                    </div>
                    <div style={{ backgroundColor: "#DCFCE7", padding: "20px", borderRadius: "12px", textAlign: "center", border: "2px solid #22C55E" }}>
                      <p style={{ fontSize: "0.75rem", color: "#166534", marginBottom: "4px" }}>Tax Savings with 1031</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#16A34A" }}>{formatCurrency(savingsResult.taxSavingsWithExchange)}</p>
                    </div>
                  </div>

                  {/* Tax Breakdown */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Tax Breakdown (If Sold Without 1031)</h4>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Federal Capital Gains Tax ({(getFederalRate(parseFloat(annualIncome), filingStatus) * 100).toFixed(0)}%)</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency(savingsResult.federalCapGainsTax)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Depreciation Recapture Tax (25%)</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency(savingsResult.federalDepreciationTax)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>State Capital Gains Tax ({(stateCapitalGainsRates[state]?.rate * 100).toFixed(1)}%)</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency(savingsResult.stateCapGainsTax)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Net Investment Income Tax (3.8%)</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency(savingsResult.niitTax)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#FEE2E2", margin: "-4px -12px", padding: "12px", borderRadius: "8px" }}>
                        <span style={{ fontWeight: "bold", color: "#991B1B" }}>Total Tax Liability</span>
                        <span style={{ fontWeight: "bold", color: "#DC2626" }}>{formatCurrency(savingsResult.totalTaxIfSold)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Boot Calculator Tab */}
          {activeTab === "boot" && (
            <div>
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "24px" }}>
                {/* Relinquished Property */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#92400E", marginBottom: "16px" }}>🏠 Relinquished Property (Selling)</h3>
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Sale Price ($)
                      </label>
                      <input
                        type="number"
                        value={relinquishedPrice}
                        onChange={(e) => setRelinquishedPrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Mortgage Balance ($)
                      </label>
                      <input
                        type="number"
                        value={relinquishedMortgage}
                        onChange={(e) => setRelinquishedMortgage(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Replacement Property */}
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "16px" }}>🏡 Replacement Property (Buying)</h3>
                  <div style={{ display: "grid", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Purchase Price ($)
                      </label>
                      <input
                        type="number"
                        value={replacementPrice}
                        onChange={(e) => setReplacementPrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        New Mortgage ($)
                      </label>
                      <input
                        type="number"
                        value={replacementMortgage}
                        onChange={(e) => setReplacementMortgage(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "0.875rem"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Taken Out */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  💵 Cash Taken Out of Exchange ($)
                </label>
                <input
                  type="number"
                  value={cashTakenOut}
                  onChange={(e) => setCashTakenOut(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateBoot}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Boot
                </button>
                <button
                  onClick={resetBoot}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Boot Results */}
              {bootResult && (
                <div style={{ marginTop: "32px", borderTop: "1px solid #E5E7EB", paddingTop: "32px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                    🥾 Boot Calculation Results
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#92400E", marginBottom: "4px" }}>Cash Boot</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>{formatCurrency(bootResult.cashBoot)}</p>
                    </div>
                    <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#991B1B", marginBottom: "4px" }}>Mortgage Boot</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>{formatCurrency(bootResult.mortgageBoot)}</p>
                    </div>
                    <div style={{
                      backgroundColor: bootResult.totalBoot > 0 ? "#FEE2E2" : "#DCFCE7",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                      border: `2px solid ${bootResult.totalBoot > 0 ? "#DC2626" : "#22C55E"}`
                    }}>
                      <p style={{ fontSize: "0.75rem", color: bootResult.totalBoot > 0 ? "#991B1B" : "#166534", marginBottom: "4px" }}>Total Boot</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: bootResult.totalBoot > 0 ? "#DC2626" : "#16A34A" }}>{formatCurrency(bootResult.totalBoot)}</p>
                    </div>
                    <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Est. Tax on Boot</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>{formatCurrency(bootResult.estimatedTaxOnBoot)}</p>
                    </div>
                  </div>

                  {bootResult.totalBoot > 0 ? (
                    <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ color: "#92400E", fontSize: "0.875rem" }}>
                        ⚠️ <strong>Boot Detected:</strong> You have {formatCurrency(bootResult.totalBoot)} in taxable boot. To avoid this, consider purchasing a more expensive replacement property or taking on additional mortgage debt equal to the boot amount.
                      </p>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: "#DCFCE7", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ color: "#166534", fontSize: "0.875rem" }}>
                        ✅ <strong>No Boot!</strong> Your exchange qualifies for full tax deferral. You&apos;re purchasing equal or greater value and maintaining equal or greater debt.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📅 Sale Closing Date
                </label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem"
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculateTimeline}
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 32px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  Calculate Deadlines
                </button>
                <button
                  onClick={resetTimeline}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Timeline Results */}
              {timelineResult && (
                <div style={{ marginTop: "32px", borderTop: "1px solid #E5E7EB", paddingTop: "32px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                    📅 Your 1031 Exchange Timeline
                  </h3>

                  {/* Visual Timeline */}
                  <div style={{ position: "relative", padding: "20px 0" }}>
                    {/* Timeline Line */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      right: "0",
                      height: "4px",
                      backgroundColor: "#E5E7EB",
                      zIndex: 0
                    }} />

                    <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                      {/* Sale Date */}
                      <div style={{ textAlign: "center", flex: "1" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#2563EB",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontWeight: "bold"
                        }}>
                          📝
                        </div>
                        <p style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Sale Closes</p>
                        <p style={{ fontSize: "0.875rem", color: "#2563EB", fontWeight: "500" }}>{formatDate(timelineResult.saleDate)}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Day 0</p>
                      </div>

                      {/* 45-Day Deadline */}
                      <div style={{ textAlign: "center", flex: "1" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#F59E0B",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontWeight: "bold"
                        }}>
                          🔍
                        </div>
                        <p style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Identification Deadline</p>
                        <p style={{ fontSize: "0.875rem", color: "#F59E0B", fontWeight: "500" }}>{formatDate(timelineResult.identificationDeadline)}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Day 45</p>
                      </div>

                      {/* 180-Day Deadline */}
                      <div style={{ textAlign: "center", flex: "1" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          backgroundColor: "#DC2626",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 12px",
                          fontWeight: "bold"
                        }}>
                          🏁
                        </div>
                        <p style={{ fontWeight: "600", color: "#111827", marginBottom: "4px" }}>Exchange Deadline</p>
                        <p style={{ fontSize: "0.875rem", color: "#DC2626", fontWeight: "500" }}>{formatDate(timelineResult.exchangeDeadline)}</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Day 180</p>
                      </div>
                    </div>
                  </div>

                  {/* Important Notes */}
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", marginTop: "24px" }}>
                    <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>⚠️ Important Reminders</h4>
                    <ul style={{ color: "#92400E", fontSize: "0.875rem", paddingLeft: "20px", margin: 0 }}>
                      <li style={{ marginBottom: "4px" }}>You must identify replacement properties in writing within 45 days</li>
                      <li style={{ marginBottom: "4px" }}>You can identify up to 3 properties (regardless of value) OR any number if total value is under 200% of sold property</li>
                      <li style={{ marginBottom: "4px" }}>The exchange must close within 180 days - no extensions</li>
                      <li>If your tax return is due before day 180, the exchange must close by your tax filing deadline</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How 1031 Exchange Works */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How a 1031 Exchange Works
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                A 1031 exchange, also known as a like-kind exchange, allows real estate investors to defer capital gains taxes when selling an investment property by reinvesting the proceeds into another qualifying property. Named after Section 1031 of the Internal Revenue Code, this strategy has been used by savvy investors for decades to grow their portfolios tax-efficiently.
              </p>

              <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>🔄 The 1031 Exchange Process</h3>
                <div style={{ fontSize: "0.875rem", color: "#1E3A8A", lineHeight: "1.8" }}>
                  <p style={{ marginBottom: "8px" }}>1. <strong>Sell your investment property</strong> (relinquished property)</p>
                  <p style={{ marginBottom: "8px" }}>2. <strong>Work with a Qualified Intermediary</strong> who holds the proceeds</p>
                  <p style={{ marginBottom: "8px" }}>3. <strong>Identify replacement properties</strong> within 45 days</p>
                  <p style={{ marginBottom: "8px" }}>4. <strong>Close on replacement property</strong> within 180 days</p>
                  <p>5. <strong>Defer all capital gains taxes</strong> if done correctly</p>
                </div>
              </div>

              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                To fully defer taxes, you must purchase a property of <strong>equal or greater value</strong> and reinvest <strong>all the equity</strong>. Any cash or debt reduction received is considered &quot;boot&quot; and is taxable.
              </p>
            </div>

            {/* Tax Rates Info */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                💸 Capital Gains Tax Rates (2024-2025)
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Tax Type</th>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Rate</th>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Applies To</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Federal Capital Gains", rate: "0% / 15% / 20%", applies: "Based on income level" },
                      { type: "Depreciation Recapture", rate: "25%", applies: "Previously claimed depreciation" },
                      { type: "Net Investment Income Tax", rate: "3.8%", applies: "Income > $200K (single) / $250K (married)" },
                      { type: "State Capital Gains", rate: "0% - 13.3%", applies: "Varies by state" }
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE", fontWeight: "500" }}>{row.type}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE", color: "#5B21B6", fontWeight: "600" }}>{row.rate}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE", fontSize: "0.875rem" }}>{row.applies}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6D28D9", marginTop: "12px" }}>
                * Combined tax rates can exceed 40% in high-tax states like California and New York.
              </p>
            </div>

            {/* Requirements */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✅ 1031 Exchange Requirements
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { icon: "🏢", tip: "Both properties must be held for investment or business use (not personal residence)" },
                  { icon: "🏠", tip: "Properties must be \"like-kind\" - any real estate for any real estate in the US" },
                  { icon: "⏰", tip: "Identify replacement property within 45 days of sale" },
                  { icon: "📅", tip: "Complete the exchange within 180 days of sale" },
                  { icon: "🤝", tip: "Must use a Qualified Intermediary - you cannot touch the funds" },
                  { icon: "💰", tip: "Reinvest all proceeds and maintain equal or greater debt to defer 100%" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                    <span style={{ color: "#374151", fontSize: "0.9rem" }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Quick Tips
              </h3>
              <ul style={{ fontSize: "0.875rem", color: "#4B5563", paddingLeft: "20px", margin: 0 }}>
                <li style={{ marginBottom: "12px" }}>Exchange &quot;up&quot; - buy more expensive property to defer all taxes</li>
                <li style={{ marginBottom: "12px" }}>Keep debt equal or higher on replacement property</li>
                <li style={{ marginBottom: "12px" }}>Never touch the sale proceeds directly</li>
                <li style={{ marginBottom: "12px" }}>You can do multiple exchanges to defer indefinitely</li>
                <li>Consider a &quot;swap till you drop&quot; strategy for estate planning</li>
              </ul>
            </div>

            {/* Warning Box */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Common Mistakes
              </h3>
              <ul style={{ fontSize: "0.8rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Missing the 45-day ID deadline</li>
                <li style={{ marginBottom: "8px" }}>Taking cash out (creates boot)</li>
                <li style={{ marginBottom: "8px" }}>Buying cheaper replacement property</li>
                <li style={{ marginBottom: "8px" }}>Reducing mortgage debt</li>
                <li>Not using a Qualified Intermediary</li>
              </ul>
            </div>

            {/* States with No Capital Gains Tax */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                🏆 States with 0% Capital Gains Tax
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Alaska", "Florida", "Nevada", "South Dakota", "Tennessee", "Texas", "Wyoming"].map((state) => (
                  <span key={state} style={{
                    backgroundColor: "white",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    color: "#065F46",
                    border: "1px solid #A7F3D0"
                  }}>
                    {state}
                  </span>
                ))}
              </div>
            </div>

            <RelatedTools currentUrl="/1031-exchange-calculator" currentCategory="Finance" />
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

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only and should not be considered tax advice. Tax laws are complex and vary by situation. Always consult with a qualified tax professional and Qualified Intermediary before executing a 1031 exchange.
          </p>
        </div>
      </div>
    </div>
  );
}
