"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// TIRBOP Rate tiers (effective May 1, 2016 - still current)
const rateTiers = [
  { min: 0, max: 30000, saleBase: 569, nonSaleBase: 512, saleRate: 0, nonSaleRate: 0 },
  { min: 30001, max: 45000, saleBase: 0, nonSaleBase: 0, saleRate: 7.41, nonSaleRate: 5.98 },
  { min: 45001, max: 100000, saleBase: 0, nonSaleBase: 0, saleRate: 6.27, nonSaleRate: 5.41 },
  { min: 100001, max: 250000, saleBase: 0, nonSaleBase: 0, saleRate: 5.50, nonSaleRate: 4.86 },
  { min: 250001, max: 500000, saleBase: 0, nonSaleBase: 0, saleRate: 4.00, nonSaleRate: 3.50 },
  { min: 500001, max: Infinity, saleBase: 0, nonSaleBase: 0, saleRate: 3.50, nonSaleRate: 3.00 },
];

// Endorsement fees
const endorsementFees = {
  endorsement100: { label: "Endorsement 100 (Covenants)", cost: 100 },
  endorsement300: { label: "Endorsement 300 (Survey)", cost: 100 },
  endorsement900: { label: "Endorsement 900 (Environmental)", cost: 100 },
  cpl: { label: "Closing Protection Letter (CPL)", cost: 125 },
};

// Quick reference data
const quickReference = [
  { amount: 150000 },
  { amount: 200000 },
  { amount: 250000 },
  { amount: 300000 },
  { amount: 400000 },
  { amount: 500000 },
  { amount: 750000 },
];

// FAQ data
const faqs = [
  {
    question: "How much should title insurance cost in PA?",
    answer: "Title insurance costs in Pennsylvania are regulated by TIRBOP (Title Insurance Rating Bureau of Pennsylvania) and are the same regardless of which title company you use. For a $300,000 home purchase, expect to pay approximately $2,070 for a standard policy or $2,277 for an enhanced policy. Add $300-$425 for common lender endorsements and the Closing Protection Letter."
  },
  {
    question: "How to calculate title insurance cost in Pennsylvania?",
    answer: "PA title insurance uses a tiered rate structure: Base rate of $569 for the first $30,000, then incremental rates per $1,000 for higher amounts ($7.41/k up to $45k, $6.27/k up to $100k, $5.50/k up to $250k, $4.00/k up to $500k, $3.50/k above $500k). The rate is applied to either the purchase price (Sale Rate) or loan amount (Non-Sale Rate for refinances)."
  },
  {
    question: "Who pays for title insurance in PA?",
    answer: "In Pennsylvania, the buyer typically pays for title insurance. However, this is negotiable and can be part of your purchase agreement. The buyer has the legal right to select the title company. Some sellers may agree to pay for the owner's policy as part of negotiations, especially in buyer's markets."
  },
  {
    question: "What is the difference between Sale Rate and Non-Sale Rate?",
    answer: "Sale Rate applies to purchase transactions where both owner's and lender's policies are issued simultaneously. Non-Sale Rate (also called Refinance Rate) applies to refinance transactions where only a lender's policy is needed. Non-Sale rates are approximately 10-15% lower than Sale rates."
  },
  {
    question: "What is an Enhanced title insurance policy?",
    answer: "An Enhanced policy provides additional coverage beyond the standard policy, including protection against post-policy forgery, encroachment issues, building permit violations, and subdivision law violations. It costs 10% more than the standard policy but offers significantly broader protection for homeowners."
  },
  {
    question: "What are lender endorsements and do I need them?",
    answer: "Lender endorsements are policy add-ons that provide extra protection for mortgage lenders. Most PA lenders require Endorsements 100, 300, and 900 (costing $100 each). The Closing Protection Letter ($125) is mandated by the PA Insurance Commission. These fees are typically non-negotiable when obtaining a mortgage."
  }
];

// Calculate title insurance premium
function calculatePremium(amount: number, isSale: boolean): number {
  if (amount <= 0) return 0;
  
  let premium = 0;
  let remaining = amount;
  
  for (const tier of rateTiers) {
    if (remaining <= 0) break;
    
    if (amount <= tier.max || tier.max === Infinity) {
      if (tier.min === 0) {
        // First tier - base rate
        premium += isSale ? tier.saleBase : tier.nonSaleBase;
        remaining -= 30000;
      } else {
        // Calculate for this tier
        const tierAmount = Math.min(remaining, tier.max - tier.min + 1);
        const thousands = tierAmount / 1000;
        premium += thousands * (isSale ? tier.saleRate : tier.nonSaleRate);
        remaining -= tierAmount;
      }
    } else if (amount > tier.max) {
      if (tier.min === 0) {
        premium += isSale ? tier.saleBase : tier.nonSaleBase;
        remaining -= 30000;
      } else {
        const tierAmount = tier.max - tier.min + 1;
        const thousands = tierAmount / 1000;
        premium += thousands * (isSale ? tier.saleRate : tier.nonSaleRate);
        remaining -= tierAmount;
      }
    }
  }
  
  return premium;
}

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

export default function PATitleInsuranceCalculator() {
  // Inputs
  const [amount, setAmount] = useState<string>("300000");
  const [transactionType, setTransactionType] = useState<"sale" | "nonSale">("sale");
  const [policyType, setPolicyType] = useState<"standard" | "enhanced">("standard");
  
  // Endorsements
  const [includeEndorsements, setIncludeEndorsements] = useState(true);
  const [includeCPL, setIncludeCPL] = useState(true);
  
  // Results
  const [results, setResults] = useState({
    basePremium: 0,
    enhancedAddon: 0,
    totalPremium: 0,
    endorsementsCost: 0,
    cplCost: 0,
    grandTotal: 0,
  });

  // Calculate
  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    const isSale = transactionType === "sale";
    
    // Base premium calculation
    const basePremium = calculatePremium(amountNum, isSale);
    
    // Enhanced addon (10% of base)
    const enhancedAddon = policyType === "enhanced" ? basePremium * 0.10 : 0;
    
    // Total premium
    const totalPremium = basePremium + enhancedAddon;
    
    // Endorsements (100 + 300 + 900)
    const endorsementsCost = includeEndorsements ? 300 : 0;
    
    // CPL
    const cplCost = includeCPL ? 125 : 0;
    
    // Grand total
    const grandTotal = totalPremium + endorsementsCost + cplCost;
    
    setResults({
      basePremium,
      enhancedAddon,
      totalPremium,
      endorsementsCost,
      cplCost,
      grandTotal,
    });
  }, [amount, transactionType, policyType, includeEndorsements, includeCPL]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>PA Title Insurance Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              PA Title Insurance Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Pennsylvania title insurance costs using official TIRBOP rates. Get accurate estimates for purchases and refinances with endorsement fees included.
          </p>
        </div>

        {/* Info Banner */}
        <div style={{
          backgroundColor: "#DBEAFE",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>📋</span>
          <div>
            <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
              Official TIRBOP Rates
            </p>
            <p style={{ fontSize: "0.875rem", color: "#1E3A8A", margin: 0 }}>
              Pennsylvania title insurance rates are regulated by the Title Insurance Rating Bureau of Pennsylvania (TIRBOP) and are uniform across all title companies.
            </p>
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
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📝 Transaction Details
                </h3>

                {/* Transaction Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Transaction Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <button
                      onClick={() => setTransactionType("sale")}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: transactionType === "sale" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: transactionType === "sale" ? "#DBEAFE" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🏡</span>
                      <p style={{ fontWeight: "600", color: transactionType === "sale" ? "#1E40AF" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        Purchase
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>Sale Rate</p>
                    </button>
                    <button
                      onClick={() => setTransactionType("nonSale")}
                      style={{
                        padding: "14px",
                        borderRadius: "8px",
                        border: transactionType === "nonSale" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: transactionType === "nonSale" ? "#DBEAFE" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🔄</span>
                      <p style={{ fontWeight: "600", color: transactionType === "nonSale" ? "#1E40AF" : "#374151", margin: "4px 0 0 0", fontSize: "0.9rem" }}>
                        Refinance
                      </p>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>Non-Sale Rate</p>
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    {transactionType === "sale" ? "Purchase Price" : "Loan Amount"}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      placeholder="300000"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {["200000", "300000", "400000", "500000"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: amount === val ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: amount === val ? "#DBEAFE" : "white",
                          color: amount === val ? "#1E40AF" : "#6B7280",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        ${formatNumber(parseInt(val))}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Policy Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Policy Type
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <button
                      onClick={() => setPolicyType("standard")}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: policyType === "standard" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: policyType === "standard" ? "#DBEAFE" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: "600", color: policyType === "standard" ? "#1E40AF" : "#374151", fontSize: "0.9rem" }}>
                            Standard Policy
                          </span>
                          <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                            Basic title protection coverage
                          </p>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Base rate</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setPolicyType("enhanced")}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border: policyType === "enhanced" ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: policyType === "enhanced" ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span style={{ fontWeight: "600", color: policyType === "enhanced" ? "#D97706" : "#374151", fontSize: "0.9rem" }}>
                            ⭐ Enhanced Policy
                          </span>
                          <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                            Extended coverage (recommended)
                          </p>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#D97706", fontWeight: "600" }}>+10%</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Lender Endorsements */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Lender Requirements (Typical)
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        backgroundColor: includeEndorsements ? "#DBEAFE" : "white",
                        border: includeEndorsements ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="checkbox"
                          checked={includeEndorsements}
                          onChange={(e) => setIncludeEndorsements(e.target.checked)}
                          style={{ width: "18px", height: "18px", accentColor: "#1E40AF" }}
                        />
                        <div>
                          <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>Endorsements 100, 300, 900</span>
                          <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>Required by most lenders</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#1E40AF", fontWeight: "600" }}>$300</span>
                    </label>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        backgroundColor: includeCPL ? "#DBEAFE" : "white",
                        border: includeCPL ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        borderRadius: "8px",
                        cursor: "pointer"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="checkbox"
                          checked={includeCPL}
                          onChange={(e) => setIncludeCPL(e.target.checked)}
                          style={{ width: "18px", height: "18px", accentColor: "#1E40AF" }}
                        />
                        <div>
                          <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>Closing Protection Letter</span>
                          <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>PA Insurance Commission mandated</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.8rem", color: "#1E40AF", fontWeight: "600" }}>$125</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results" style={{ backgroundColor: "#DBEAFE", padding: "24px", borderRadius: "12px", border: "2px solid #93C5FD" }}>
                <h3 style={{ fontWeight: "600", color: "#1E3A8A", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💰 Title Insurance Estimate
                </h3>

                {/* Amount Display */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "0 0 4px 0" }}>
                    {transactionType === "sale" ? "Purchase Price" : "Loan Amount"}
                  </p>
                  <p style={{ fontSize: "1.3rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                    ${formatNumber(parseFloat(amount) || 0)}
                  </p>
                </div>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#1E40AF",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                    Total Estimated Cost
                  </p>
                  <p style={{ fontSize: "2.2rem", fontWeight: "bold", color: "white", margin: 0 }}>
                    {formatCurrency(results.grandTotal)}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "8px" }}>
                    {policyType === "enhanced" ? "Enhanced" : "Standard"} Policy • {transactionType === "sale" ? "Purchase" : "Refinance"}
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ display: "grid", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "12px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Title Insurance Premium</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>
                      {formatCurrency(results.basePremium)}
                    </span>
                  </div>

                  {policyType === "enhanced" && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Enhanced Coverage (+10%)</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>
                        +{formatCurrency(results.enhancedAddon)}
                      </span>
                    </div>
                  )}

                  {includeEndorsements && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Lender Endorsements</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>
                        +{formatCurrency(results.endorsementsCost)}
                      </span>
                    </div>
                  )}

                  {includeCPL && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      padding: "12px", 
                      backgroundColor: "white", 
                      borderRadius: "8px",
                      alignItems: "center"
                    }}>
                      <span style={{ color: "#374151", fontWeight: "500", fontSize: "0.9rem" }}>Closing Protection Letter</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>
                        +{formatCurrency(results.cplCost)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Rate Info */}
                <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", marginBottom: "16px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    💡 <strong>Rate Applied:</strong> {transactionType === "sale" ? "Sale Rate" : "Non-Sale Rate"} 
                    {transactionType === "nonSale" && " (saves ~10-15%)"}
                  </p>
                </div>

                {/* Who Pays */}
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#374151", margin: 0 }}>
                    <strong>Who Pays:</strong> In PA, the buyer typically pays title insurance. The buyer also has the right to choose the title company.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 PA Title Insurance Rate Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            TIRBOP standard rates (title premium only, excludes endorsements)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Amount</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>Sale Rate</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>Non-Sale Rate</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>Enhanced (+10%)</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const saleRate = calculatePremium(row.amount, true);
                  const nonSaleRate = calculatePremium(row.amount, false);
                  const enhanced = saleRate * 1.1;
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                        ${formatNumber(row.amount)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#1E40AF" }}>
                        {formatCurrency(saleRate)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>
                        {formatCurrency(nonSaleRate)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706" }}>
                        {formatCurrency(enhanced)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Add $425 for typical lender fees (Endorsements 100, 300, 900 + CPL). Rates effective May 1, 2016 per TIRBOP.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Understanding Title Insurance */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📖 Understanding PA Title Insurance
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#1E3A8A", marginBottom: "8px" }}>🏠 Owner&apos;s Policy</h4>
                  <p style={{ fontSize: "0.875rem", color: "#1E40AF", margin: 0 }}>
                    Protects the homeowner&apos;s investment against title defects, liens, or ownership claims. Coverage lasts as long as you own the property. Optional but highly recommended.
                  </p>
                </div>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "8px" }}>🏦 Lender&apos;s Policy</h4>
                  <p style={{ fontSize: "0.875rem", color: "#047857", margin: 0 }}>
                    Protects the mortgage lender&apos;s financial interest. Required by all lenders in PA. Coverage decreases as the loan is paid down and expires when the mortgage is satisfied.
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>⭐ Enhanced Policy</h4>
                  <p style={{ fontSize: "0.875rem", color: "#A16207", margin: 0 }}>
                    Adds coverage for post-policy forgery, encroachment, building permit violations, and more. Costs 10% extra but provides significantly broader protection. Recommended for all homeowners.
                  </p>
                </div>
              </div>
            </div>

            {/* Rate Structure */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 PA Title Insurance Rate Structure
              </h2>
              <p style={{ color: "#6B7280", marginBottom: "16px" }}>
                Pennsylvania uses a tiered rate structure set by TIRBOP:
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "left" }}>Amount Range</th>
                      <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Sale Rate</th>
                      <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Non-Sale Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$0 - $30,000</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>$569 base</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>$512 base</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$30,001 - $45,000</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$7.41/k</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$5.98/k</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$45,001 - $100,000</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$6.27/k</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$5.41/k</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$100,001 - $250,000</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$5.50/k</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$4.86/k</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$250,001 - $500,000</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$4.00/k</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$3.50/k</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>$500,001+</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$3.50/k</td>
                      <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>+$3.00/k</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Facts */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📌 PA Title Insurance Facts
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>One-Time Payment:</strong> Paid at closing, covers you for life
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Regulated Rates:</strong> Same price at all title companies
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Buyer Pays:</strong> Typical in PA (negotiable)
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Your Choice:</strong> Buyer selects title company
                  </p>
                </div>
              </div>
            </div>

            {/* What's Covered */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                ✅ What Title Insurance Covers
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#047857", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "6px" }}>Unknown liens or encumbrances</li>
                <li style={{ marginBottom: "6px" }}>Errors in public records</li>
                <li style={{ marginBottom: "6px" }}>Forged documents</li>
                <li style={{ marginBottom: "6px" }}>Missing heirs claims</li>
                <li style={{ marginBottom: "6px" }}>Undisclosed easements</li>
                <li>Fraud and impersonation</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/pa-title-insurance-calculator"
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

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🏠 <strong>Disclaimer:</strong> This calculator uses official TIRBOP (Title Insurance Rating Bureau of Pennsylvania) rates. Actual costs may vary based on specific circumstances, additional endorsements, or title company fees. Rates shown are effective as of May 1, 2016 per TIRBOP guidelines. Always obtain an official quote from a licensed title company for your transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
