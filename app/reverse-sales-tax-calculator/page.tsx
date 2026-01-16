"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// State tax rates data (2024-2025)
const stateTaxRates = [
  { state: "Alabama", abbr: "AL", rate: 4.00, note: "Local taxes can add 1-7.5%" },
  { state: "Alaska", abbr: "AK", rate: 0, note: "No state sales tax, but local taxes may apply" },
  { state: "Arizona", abbr: "AZ", rate: 5.60, note: "Local taxes can add 0.5-5.6%" },
  { state: "Arkansas", abbr: "AR", rate: 6.50, note: "Local taxes can add 0-5.125%" },
  { state: "California", abbr: "CA", rate: 7.25, note: "Highest base state rate; local taxes can add 0.15-3%" },
  { state: "Colorado", abbr: "CO", rate: 2.90, note: "Local taxes can add 0-8.3%" },
  { state: "Connecticut", abbr: "CT", rate: 6.35, note: "No local sales taxes" },
  { state: "Delaware", abbr: "DE", rate: 0, note: "No sales tax" },
  { state: "Florida", abbr: "FL", rate: 6.00, note: "Local taxes can add 0-2.5%" },
  { state: "Georgia", abbr: "GA", rate: 4.00, note: "Local taxes can add 2-5%" },
  { state: "Hawaii", abbr: "HI", rate: 4.00, note: "Called GET; local taxes can add 0.5%" },
  { state: "Idaho", abbr: "ID", rate: 6.00, note: "No local sales taxes" },
  { state: "Illinois", abbr: "IL", rate: 6.25, note: "Local taxes can add 0-4.75%" },
  { state: "Indiana", abbr: "IN", rate: 7.00, note: "No local sales taxes" },
  { state: "Iowa", abbr: "IA", rate: 6.00, note: "Local taxes can add 0-1%" },
  { state: "Kansas", abbr: "KS", rate: 6.50, note: "Local taxes can add 1-4%" },
  { state: "Kentucky", abbr: "KY", rate: 6.00, note: "No local sales taxes" },
  { state: "Louisiana", abbr: "LA", rate: 4.45, note: "Local taxes can add 0-7%" },
  { state: "Maine", abbr: "ME", rate: 5.50, note: "No local sales taxes" },
  { state: "Maryland", abbr: "MD", rate: 6.00, note: "No local sales taxes" },
  { state: "Massachusetts", abbr: "MA", rate: 6.25, note: "No local sales taxes" },
  { state: "Michigan", abbr: "MI", rate: 6.00, note: "No local sales taxes" },
  { state: "Minnesota", abbr: "MN", rate: 6.875, note: "Local taxes can add 0-2%" },
  { state: "Mississippi", abbr: "MS", rate: 7.00, note: "No local sales taxes" },
  { state: "Missouri", abbr: "MO", rate: 4.225, note: "Local taxes can add 0.5-5.875%" },
  { state: "Montana", abbr: "MT", rate: 0, note: "No sales tax" },
  { state: "Nebraska", abbr: "NE", rate: 5.50, note: "Local taxes can add 0-2.5%" },
  { state: "Nevada", abbr: "NV", rate: 6.85, note: "Local taxes can add 0-1.53%" },
  { state: "New Hampshire", abbr: "NH", rate: 0, note: "No sales tax" },
  { state: "New Jersey", abbr: "NJ", rate: 6.625, note: "No local sales taxes" },
  { state: "New Mexico", abbr: "NM", rate: 4.875, note: "Called GRT; local taxes can add 0.375-4.313%" },
  { state: "New York", abbr: "NY", rate: 4.00, note: "Local taxes can add 3-5%" },
  { state: "North Carolina", abbr: "NC", rate: 4.75, note: "Local taxes can add 2-2.75%" },
  { state: "North Dakota", abbr: "ND", rate: 5.00, note: "Local taxes can add 0-3.5%" },
  { state: "Ohio", abbr: "OH", rate: 5.75, note: "Local taxes can add 0-2.25%" },
  { state: "Oklahoma", abbr: "OK", rate: 4.50, note: "Local taxes can add 0-7%" },
  { state: "Oregon", abbr: "OR", rate: 0, note: "No sales tax" },
  { state: "Pennsylvania", abbr: "PA", rate: 6.00, note: "Local taxes in Philadelphia (2%) and Allegheny (1%)" },
  { state: "Rhode Island", abbr: "RI", rate: 7.00, note: "No local sales taxes" },
  { state: "South Carolina", abbr: "SC", rate: 6.00, note: "Local taxes can add 1-3%" },
  { state: "South Dakota", abbr: "SD", rate: 4.20, note: "Local taxes can add 0-4.5%" },
  { state: "Tennessee", abbr: "TN", rate: 7.00, note: "Local taxes can add 1.5-2.75%" },
  { state: "Texas", abbr: "TX", rate: 6.25, note: "Local taxes can add 0-2%" },
  { state: "Utah", abbr: "UT", rate: 6.10, note: "Local taxes can add 0.7-2.95%" },
  { state: "Vermont", abbr: "VT", rate: 6.00, note: "Local taxes can add 0-1%" },
  { state: "Virginia", abbr: "VA", rate: 5.30, note: "Local taxes can add 0.7-1.7%" },
  { state: "Washington", abbr: "WA", rate: 6.50, note: "Local taxes can add 0.5-4%" },
  { state: "West Virginia", abbr: "WV", rate: 6.00, note: "Local taxes can add 0-1%" },
  { state: "Wisconsin", abbr: "WI", rate: 5.00, note: "Local taxes can add 0-1.75%" },
  { state: "Wyoming", abbr: "WY", rate: 4.00, note: "Local taxes can add 0-2%" },
  { state: "Washington D.C.", abbr: "DC", rate: 6.00, note: "No additional local taxes" },
];

// FAQ data
const faqs = [
  {
    question: "How do I reverse calculate sales tax?",
    answer: "To reverse calculate sales tax, divide the total price (including tax) by (1 + tax rate as a decimal). For example, if you paid $107.50 and the tax rate is 7.5%, calculate: $107.50 ÷ 1.075 = $100.00. The pre-tax price is $100, and the tax amount is $7.50."
  },
  {
    question: "What is the reverse sales tax formula?",
    answer: "The formula is: Pre-Tax Price = Total Price ÷ (1 + Tax Rate/100). To find the tax amount: Tax Amount = Total Price - Pre-Tax Price. This formula works for any percentage-based tax including sales tax, VAT, and GST."
  },
  {
    question: "Why do I need a reverse sales tax calculator?",
    answer: "A reverse sales tax calculator is useful for: expense reporting and reimbursements, business accounting where you need to separate revenue from tax collected, verifying vendor invoices, understanding how much you actually paid for an item vs. tax, and tax deduction purposes."
  },
  {
    question: "Which US states have no sales tax?",
    answer: "Five US states have no state-level sales tax: Alaska, Delaware, Montana, New Hampshire, and Oregon. However, Alaska allows local governments to charge sales tax, so some Alaska cities do have local sales taxes. Delaware has no sales tax at all."
  },
  {
    question: "How do local taxes affect reverse sales tax calculations?",
    answer: "Local taxes (county, city, district) are added to the state rate to create a combined rate. When reverse calculating, you must use the total combined rate, not just the state rate. For example, in Los Angeles, the combined rate is about 9.5% (7.25% state + local), not just California's 7.25%."
  },
  {
    question: "Can I use this calculator for VAT or GST?",
    answer: "Yes! The reverse calculation formula works the same for any percentage-based consumption tax. Whether it's US sales tax, European VAT, Canadian GST/HST, or Australian GST, the math is identical: divide the total by (1 + tax rate)."
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

export default function ReverseSalesTaxCalculator() {
  const [activeTab, setActiveTab] = useState<'quick' | 'bystate' | 'rates'>('quick');

  // Tab 1: Quick Calculate
  const [totalPrice, setTotalPrice] = useState<string>("107.50");
  const [taxRate, setTaxRate] = useState<string>("7.5");

  // Tab 2: By State
  const [stateTotalPrice, setStateTotalPrice] = useState<string>("100");
  const [selectedState, setSelectedState] = useState<string>("California");

  // Tab 1 Calculations
  const quickResults = useMemo(() => {
    const total = parseFloat(totalPrice) || 0;
    const rate = parseFloat(taxRate) || 0;
    
    if (total <= 0 || rate < 0) {
      return { preTax: 0, taxAmount: 0, effectiveRate: 0 };
    }

    const divisor = 1 + (rate / 100);
    const preTax = total / divisor;
    const taxAmount = total - preTax;

    return {
      preTax: Math.round(preTax * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      effectiveRate: rate
    };
  }, [totalPrice, taxRate]);

  // Tab 2 Calculations
  const stateResults = useMemo(() => {
    const total = parseFloat(stateTotalPrice) || 0;
    const stateData = stateTaxRates.find(s => s.state === selectedState);
    const rate = stateData?.rate || 0;

    if (total <= 0) {
      return { preTax: 0, taxAmount: 0, rate: 0, stateData: null };
    }

    const divisor = 1 + (rate / 100);
    const preTax = total / divisor;
    const taxAmount = total - preTax;

    return {
      preTax: Math.round(preTax * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      rate,
      stateData
    };
  }, [stateTotalPrice, selectedState]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Reverse Sales Tax Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🧾</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Reverse Sales Tax Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the original pre-tax price from a total amount including sales tax. 
            Select your state for automatic tax rate lookup, or enter any custom rate.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#DCFCE7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #86EFAC"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>
                <strong>Reverse Tax Formula:</strong> Pre-Tax Price = Total Price ÷ (1 + Tax Rate)
              </p>
              <p style={{ color: "#15803D", margin: 0, fontSize: "0.95rem" }}>
                Example: $107.50 at 7.5% tax → $107.50 ÷ 1.075 = $100.00 pre-tax
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("quick")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "quick" ? "#059669" : "#E5E7EB",
              color: activeTab === "quick" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧮 Quick Calculate
          </button>
          <button
            onClick={() => setActiveTab("bystate")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "bystate" ? "#059669" : "#E5E7EB",
              color: activeTab === "bystate" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🗺️ By State
          </button>
          <button
            onClick={() => setActiveTab("rates")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "rates" ? "#059669" : "#E5E7EB",
              color: activeTab === "rates" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 State Tax Rates
          </button>
        </div>

        {/* Tab 1: Quick Calculate */}
        {activeTab === 'quick' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🧮 Enter Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Total Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Price (Including Tax)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "1.1rem" }}>$</span>
                    <input
                      type="number"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 32px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="107.50"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Tax Rate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Sales Tax Rate (%)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="7.5"
                      step="0.01"
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                  </div>
                </div>

                {/* Common Rates Quick Select */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>
                    Quick Select Common Rates:
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[5, 6, 6.25, 6.5, 7, 7.25, 7.5, 8, 8.25, 9, 10].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setTaxRate(rate.toString())}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: parseFloat(taxRate) === rate ? "2px solid #059669" : "1px solid #D1D5DB",
                          backgroundColor: parseFloat(taxRate) === rate ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: parseFloat(taxRate) === rate ? "#059669" : "#374151",
                          fontWeight: parseFloat(taxRate) === rate ? "600" : "400"
                        }}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                    💡 <strong>Tip:</strong> Check your receipt for the exact tax rate, or use the &quot;By State&quot; tab to look up your state&apos;s rate.
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
              <div style={{ backgroundColor: "#047857", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Pre-Tax Price Display */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #059669"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                    Original Price (Before Tax)
                  </p>
                  <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    ${quickResults.preTax.toFixed(2)}
                  </p>
                </div>

                {/* Tax Amount Display */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                    Sales Tax Amount
                  </p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>
                    ${quickResults.taxAmount.toFixed(2)}
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Total Paid</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>${(parseFloat(totalPrice) || 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Tax Rate</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{taxRate}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Pre-Tax Price</span>
                    <span style={{ fontWeight: "600", color: "#059669" }}>${quickResults.preTax.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Tax Paid</span>
                    <span style={{ fontWeight: "600", color: "#D97706" }}>${quickResults.taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Verification */}
                <div style={{
                  marginTop: "16px",
                  padding: "12px",
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  border: "1px solid #BBF7D0"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534", textAlign: "center" }}>
                    ✓ Verification: ${quickResults.preTax.toFixed(2)} + ${quickResults.taxAmount.toFixed(2)} = ${(quickResults.preTax + quickResults.taxAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: By State */}
        {activeTab === 'bystate' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🗺️ Select Your State
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* State Selector */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {stateTaxRates.map(state => (
                      <option key={state.abbr} value={state.state}>
                        {state.state} ({state.rate === 0 ? 'No Tax' : `${state.rate}%`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* State Rate Info */}
                {stateResults.stateData && (
                  <div style={{
                    backgroundColor: stateResults.stateData.rate === 0 ? "#DCFCE7" : "#EFF6FF",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: stateResults.stateData.rate === 0 ? "1px solid #86EFAC" : "1px solid #BFDBFE"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: stateResults.stateData.rate === 0 ? "#166534" : "#1E40AF" }}>
                      {stateResults.stateData.state} State Tax Rate: {stateResults.stateData.rate === 0 ? 'No Sales Tax' : `${stateResults.stateData.rate}%`}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: stateResults.stateData.rate === 0 ? "#15803D" : "#1D4ED8" }}>
                      {stateResults.stateData.note}
                    </p>
                  </div>
                )}

                {/* Total Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Price (Including Tax)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "1.1rem" }}>$</span>
                    <input
                      type="number"
                      value={stateTotalPrice}
                      onChange={(e) => setStateTotalPrice(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 32px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="100.00"
                      step="0.01"
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    ⚠️ <strong>Note:</strong> This uses the base state rate only. Your actual rate may be higher with local taxes added.
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
              <div style={{ backgroundColor: "#047857", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 {selectedState} Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {stateResults.rate === 0 ? (
                  <div style={{
                    backgroundColor: "#DCFCE7",
                    borderRadius: "12px",
                    padding: "32px 20px",
                    textAlign: "center",
                    border: "2px solid #22C55E"
                  }}>
                    <span style={{ fontSize: "3rem" }}>🎉</span>
                    <p style={{ margin: "16px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#166534" }}>
                      No Sales Tax in {selectedState}!
                    </p>
                    <p style={{ margin: "8px 0 0 0", color: "#15803D" }}>
                      Your pre-tax price equals your total price: ${(parseFloat(stateTotalPrice) || 0).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Pre-Tax Price Display */}
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #059669"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                        Original Price (Before Tax)
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                        ${stateResults.preTax.toFixed(2)}
                      </p>
                    </div>

                    {/* Tax Amount Display */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                        {selectedState} Sales Tax ({stateResults.rate}%)
                      </p>
                      <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>
                        ${stateResults.taxAmount.toFixed(2)}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Total Paid</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>${(parseFloat(stateTotalPrice) || 0).toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>State Tax Rate</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{stateResults.rate}%</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Pre-Tax Price</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>${stateResults.preTax.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Tax Paid</span>
                        <span style={{ fontWeight: "600", color: "#D97706" }}>${stateResults.taxAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: State Tax Rates */}
        {activeTab === 'rates' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 US State Sales Tax Rates (2024-2025)
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "20px" }}>
              Base state sales tax rates. Local taxes may add additional percentage. States with 0% have no state-level sales tax.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>State</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Rate</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {stateTaxRates.map((state, index) => (
                    <tr 
                      key={state.abbr}
                      style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}
                    >
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>
                        {state.state} ({state.abbr})
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "9999px",
                          backgroundColor: state.rate === 0 ? "#DCFCE7" : state.rate >= 7 ? "#FEE2E2" : "#FEF3C7",
                          color: state.rate === 0 ? "#166534" : state.rate >= 7 ? "#DC2626" : "#D97706",
                          fontSize: "0.85rem",
                          fontWeight: "600"
                        }}>
                          {state.rate === 0 ? 'No Tax' : `${state.rate}%`}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontSize: "0.85rem" }}>
                        {state.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div style={{
              display: "flex",
              gap: "24px",
              marginTop: "20px",
              padding: "16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              flexWrap: "wrap"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#DCFCE7" }}></span>
                <span style={{ fontSize: "0.85rem", color: "#4B5563" }}>No Sales Tax</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#FEF3C7" }}></span>
                <span style={{ fontSize: "0.85rem", color: "#4B5563" }}>Below 7%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#FEE2E2" }}></span>
                <span style={{ fontSize: "0.85rem", color: "#4B5563" }}>7% or Higher</span>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🧾 How to Reverse Calculate Sales Tax</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Reverse sales tax calculation</strong> is the process of determining the original price 
                  of an item before sales tax was added, when you only know the total amount paid. This is 
                  useful for expense reporting, business accounting, and understanding how much of your 
                  purchase went to taxes.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Reverse Sales Tax Formula</h3>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#065F46" }}>Step-by-Step:</p>
                  <ol style={{ margin: 0, paddingLeft: "20px", color: "#047857" }}>
                    <li style={{ marginBottom: "8px" }}>Convert tax rate to decimal: Rate ÷ 100</li>
                    <li style={{ marginBottom: "8px" }}>Add 1 to the decimal: 1 + Rate</li>
                    <li style={{ marginBottom: "8px" }}>Divide total by that number: Total ÷ (1 + Rate)</li>
                    <li>Subtract to find tax: Total - Pre-Tax = Tax Amount</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Example Calculation</h3>
                <p>
                  You paid <strong>$107.50</strong> for an item in a state with <strong>7.5%</strong> sales tax:
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Convert: 7.5 ÷ 100 = 0.075</li>
                  <li>Add 1: 1 + 0.075 = 1.075</li>
                  <li>Divide: $107.50 ÷ 1.075 = <strong>$100.00</strong> (pre-tax price)</li>
                  <li>Tax paid: $107.50 - $100.00 = <strong>$7.50</strong></li>
                </ul>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Use Reverse Sales Tax</h3>
                <p>
                  This calculation is commonly needed for:
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Business expense reports</strong> — separate tax from purchase price</li>
                  <li><strong>Accounting and bookkeeping</strong> — record revenue vs. tax collected</li>
                  <li><strong>Invoice verification</strong> — check if vendors charged correct tax</li>
                  <li><strong>Tax deductions</strong> — know the actual item cost vs. tax</li>
                  <li><strong>Price comparisons</strong> — compare prices across states with different tax rates</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Formula: Total ÷ (1 + Rate)</p>
                <p style={{ margin: 0 }}>• 5% tax → divide by 1.05</p>
                <p style={{ margin: 0 }}>• 6% tax → divide by 1.06</p>
                <p style={{ margin: 0 }}>• 7% tax → divide by 1.07</p>
                <p style={{ margin: 0 }}>• 8% tax → divide by 1.08</p>
                <p style={{ margin: 0 }}>• 10% tax → divide by 1.10</p>
              </div>
            </div>

            {/* No Tax States */}
            <div style={{ backgroundColor: "#DCFCE7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #86EFAC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "16px" }}>🎉 No Sales Tax States</h3>
              <div style={{ fontSize: "0.9rem", color: "#15803D", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}>• Alaska*</p>
                <p style={{ margin: "0 0 4px 0" }}>• Delaware</p>
                <p style={{ margin: "0 0 4px 0" }}>• Montana</p>
                <p style={{ margin: "0 0 4px 0" }}>• New Hampshire</p>
                <p style={{ margin: 0 }}>• Oregon</p>
                <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", fontStyle: "italic" }}>*Alaska has no state tax but allows local taxes</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/reverse-sales-tax-calculator" currentCategory="Financial" />
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on state-level sales tax rates only. 
            Actual tax rates may vary with local county, city, and district taxes. Always verify the exact tax rate 
            from your receipt or local tax authority for accurate calculations. This tool is for informational purposes only 
            and should not be used as the sole basis for financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}