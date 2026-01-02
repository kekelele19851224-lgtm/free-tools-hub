"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Texas TDI Official Owner's Policy Rates (Effective Sep 1, 2019)
// For properties $100,000 and under
const ownerPolicyFixed = [
  { min: 0, max: 10000, premium: 282 },
  { min: 10001, max: 20000, premium: 337 },
  { min: 20001, max: 30000, premium: 392 },
  { min: 30001, max: 40000, premium: 446 },
  { min: 40001, max: 50000, premium: 501 },
  { min: 50001, max: 60000, premium: 556 },
  { min: 60001, max: 70000, premium: 611 },
  { min: 70001, max: 80000, premium: 665 },
  { min: 80001, max: 90000, premium: 720 },
  { min: 90001, max: 100000, premium: 775 },
];

// For properties over $100,000
const ownerPolicyTiers = [
  { min: 100001, max: 1000000, subtract: 100000, multiply: 0.00527, add: 832 },
  { min: 1000001, max: 5000000, subtract: 1000000, multiply: 0.00433, add: 5575 },
  { min: 5000001, max: 15000000, subtract: 5000000, multiply: 0.00357, add: 22895 },
  { min: 15000001, max: 25000000, subtract: 15000000, multiply: 0.00254, add: 58595 },
  { min: 25000001, max: 50000000, subtract: 25000000, multiply: 0.00152, add: 83995 },
  { min: 50000001, max: 100000000, subtract: 50000000, multiply: 0.00138, add: 121995 },
  { min: 100000001, max: Infinity, subtract: 100000000, multiply: 0.00124, add: 190995 },
];

// Lender's Policy Rates (Simultaneous Issue with Owner's)
const lenderPolicyTiers = [
  { min: 0, max: 50000, subtract: 0, multiply: 0.00200, add: 0 },
  { min: 50001, max: 100000, subtract: 50000, multiply: 0.00175, add: 100 },
  { min: 100001, max: 1000000, subtract: 100000, multiply: 0.00162, add: 188 },
  { min: 1000001, max: 5000000, subtract: 1000000, multiply: 0.00131, add: 1646 },
  { min: 5000001, max: Infinity, subtract: 5000000, multiply: 0.00101, add: 6886 },
];

// Quick reference table
const quickReference = [
  { price: 100000, owner: 775, lender: 100 },
  { price: 150000, owner: 1096, lender: 169 },
  { price: 200000, owner: 1359, lender: 250 },
  { price: 250000, owner: 1622, lender: 331 },
  { price: 300000, owner: 1886, lender: 412 },
  { price: 350000, owner: 2149, lender: 493 },
  { price: 400000, owner: 2413, lender: 574 },
  { price: 500000, owner: 2940, lender: 736 },
  { price: 750000, owner: 4257, lender: 1141 },
  { price: 1000000, owner: 5575, lender: 1546 },
];

// FAQ data
const faqs = [
  {
    question: "How much does title insurance cost in Texas?",
    answer: "Title insurance costs in Texas are regulated by the Texas Department of Insurance (TDI), so rates are the same at all title companies. For a $300,000 home, the owner's policy costs approximately $1,886 and the lender's policy costs about $412. The total cost ranges from about 0.5% to 0.9% of the property value, with lower percentages for higher-priced properties."
  },
  {
    question: "Who pays for title insurance in Texas?",
    answer: "In Texas, it's customary (but negotiable) for the seller to pay for the owner's title policy and the buyer to pay for the lender's title policy. However, this can vary by county and can be negotiated as part of the purchase contract. In some areas like Bexar County (San Antonio), buyers traditionally pay for both policies."
  },
  {
    question: "Is title insurance required in Texas?",
    answer: "The owner's title policy is not legally required but highly recommended to protect your ownership rights. However, if you're getting a mortgage, the lender's title policy IS required by virtually all lenders. The lender's policy protects the lender's interest in the property until the loan is paid off."
  },
  {
    question: "What does title insurance cover in Texas?",
    answer: "Title insurance protects against: (1) Unknown liens or encumbrances, (2) Errors in public records, (3) Forged documents, (4) Undisclosed heirs claiming ownership, (5) Boundary disputes, (6) Unpaid property taxes, and (7) Other defects in the title that existed before you purchased the property. It's a one-time premium that protects you for as long as you own the property."
  },
  {
    question: "Can I shop around for title insurance in Texas?",
    answer: "Since Texas regulates title insurance rates, the premium cost is the same regardless of which title company you choose. However, you CAN shop for other closing costs like escrow fees, document preparation fees, and courier fees, which vary between companies. The CFPB recommends comparing at least 3 title companies for these additional fees."
  },
  {
    question: "What is the difference between owner's and lender's title insurance?",
    answer: "The owner's policy protects YOU (the buyer) for the full property value and lasts as long as you own the home. The lender's policy protects YOUR LENDER for the loan amount and decreases as you pay down the mortgage. If you're paying cash, you only need the owner's policy. If you're financing, you'll typically need both."
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

// Calculate Owner's Policy Premium
function calculateOwnerPolicy(price: number): number {
  if (price <= 0) return 0;
  
  // Fixed rates for $100,000 and under
  if (price <= 100000) {
    const tier = ownerPolicyFixed.find(t => price >= t.min && price <= t.max);
    return tier ? tier.premium : 775;
  }
  
  // Tiered rates for over $100,000
  const tier = ownerPolicyTiers.find(t => price >= t.min && price <= t.max);
  if (tier) {
    const diff = price - tier.subtract;
    const mid = Math.round(diff * tier.multiply);
    return mid + tier.add;
  }
  return 0;
}

// Calculate Lender's Policy Premium (Simultaneous Issue)
function calculateLenderPolicy(loanAmount: number): number {
  if (loanAmount <= 0) return 0;
  
  const tier = lenderPolicyTiers.find(t => loanAmount >= t.min && loanAmount <= t.max);
  if (tier) {
    const diff = loanAmount - tier.subtract;
    const mid = Math.round(diff * tier.multiply);
    return mid + tier.add;
  }
  return 0;
}

export default function TexasTitleInsuranceCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"residential" | "commercial">("residential");

  // Inputs
  const [propertyPrice, setPropertyPrice] = useState<string>("300000");
  const [loanAmount, setLoanAmount] = useState<string>("240000");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>("20");
  const [transactionType, setTransactionType] = useState<string>("purchase");
  const [paymentType, setPaymentType] = useState<string>("financed");

  // Results
  const [ownerPremium, setOwnerPremium] = useState<number>(0);
  const [lenderPremium, setLenderPremium] = useState<number>(0);
  const [totalPremium, setTotalPremium] = useState<number>(0);
  const [ratePercent, setRatePercent] = useState<number>(0);

  // Update loan amount when price or down payment changes
  useEffect(() => {
    if (paymentType === "financed") {
      const price = parseFloat(propertyPrice) || 0;
      const downPercent = parseFloat(downPaymentPercent) || 20;
      const loan = price * (1 - downPercent / 100);
      setLoanAmount(Math.round(loan).toString());
    }
  }, [propertyPrice, downPaymentPercent, paymentType]);

  // Calculate premiums
  useEffect(() => {
    const price = parseFloat(propertyPrice) || 0;
    const loan = paymentType === "cash" ? 0 : (parseFloat(loanAmount) || 0);

    const owner = calculateOwnerPolicy(price);
    const lender = calculateLenderPolicy(loan);
    const total = owner + lender;
    const rate = price > 0 ? (total / price) * 100 : 0;

    setOwnerPremium(owner);
    setLenderPremium(lender);
    setTotalPremium(total);
    setRatePercent(rate);
  }, [propertyPrice, loanAmount, paymentType]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const tabs = [
    { id: "residential" as const, label: "Residential Purchase", icon: "🏠" },
    { id: "commercial" as const, label: "Commercial Property", icon: "🏢" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Texas Title Insurance Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🤠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Texas Title Insurance Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate title insurance costs for Texas real estate transactions. Uses official rates set by the Texas Department of Insurance (TDI).
          </p>
        </div>

        {/* Official Rate Notice */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #FDE68A",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>⚖️</span>
          <div>
            <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
              Texas Regulates Title Insurance Rates
            </p>
            <p style={{ fontSize: "0.875rem", color: "#92400E", margin: 0 }}>
              Unlike most states, Texas title insurance rates are set by the state. All title companies charge the same premium rates. Rates effective September 1, 2019.
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
                  borderBottom: activeTab === tab.id ? "3px solid #DC2626" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#DC2626" : "#6B7280",
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
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  {activeTab === "residential" ? "🏠" : "🏢"} Property Details
                </h3>

                {/* Property Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    {activeTab === "residential" ? "Home Price" : "Property Value"} ($)
                  </label>
                  <input
                    type="number"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(e.target.value)}
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
                    {["200000", "300000", "400000", "500000"].map((price) => (
                      <button
                        key={price}
                        onClick={() => setPropertyPrice(price)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: propertyPrice === price ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: propertyPrice === price ? "#FEE2E2" : "white",
                          color: propertyPrice === price ? "#DC2626" : "#6B7280",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        ${(parseInt(price) / 1000)}K
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Payment Type
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setPaymentType("financed")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: paymentType === "financed" ? "2px solid #DC2626" : "1px solid #E5E7EB",
                        backgroundColor: paymentType === "financed" ? "#FEE2E2" : "white",
                        color: paymentType === "financed" ? "#DC2626" : "#6B7280",
                        fontWeight: paymentType === "financed" ? "600" : "400",
                        cursor: "pointer"
                      }}
                    >
                      🏦 Financed
                    </button>
                    <button
                      onClick={() => setPaymentType("cash")}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: paymentType === "cash" ? "2px solid #10B981" : "1px solid #E5E7EB",
                        backgroundColor: paymentType === "cash" ? "#D1FAE5" : "white",
                        color: paymentType === "cash" ? "#065F46" : "#6B7280",
                        fontWeight: paymentType === "cash" ? "600" : "400",
                        cursor: "pointer"
                      }}
                    >
                      💵 Cash
                    </button>
                  </div>
                </div>

                {/* Down Payment / Loan Amount */}
                {paymentType === "financed" && (
                  <>
                    <div style={{ marginBottom: "20px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Down Payment (%)
                      </label>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                        {["5", "10", "20", "25"].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => setDownPaymentPercent(pct)}
                            style={{
                              padding: "8px 16px",
                              borderRadius: "8px",
                              border: downPaymentPercent === pct ? "2px solid #DC2626" : "1px solid #E5E7EB",
                              backgroundColor: downPaymentPercent === pct ? "#FEE2E2" : "white",
                              color: downPaymentPercent === pct ? "#DC2626" : "#6B7280",
                              fontWeight: downPaymentPercent === pct ? "600" : "400",
                              cursor: "pointer"
                            }}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 16px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "10px",
                          fontSize: "1rem"
                        }}
                        min="0"
                        max="100"
                      />
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#EFF6FF", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.875rem", color: "#1E40AF", margin: 0 }}>
                        <strong>Loan Amount:</strong> {formatCurrency(parseFloat(loanAmount) || 0)}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Results */}
              <div className="calc-results" style={{ backgroundColor: "#FEF2F2", padding: "24px", borderRadius: "12px", border: "2px solid #FECACA" }}>
                <h3 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📋 Title Insurance Premiums
                </h3>

                {/* Total */}
                <div style={{
                  backgroundColor: "#FEE2E2",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #DC2626"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "#991B1B", marginBottom: "8px" }}>Total Title Insurance</p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#DC2626", margin: 0 }}>
                    {formatCurrency(totalPremium)}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#B91C1C", marginTop: "8px" }}>
                    {ratePercent.toFixed(2)}% of property value
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", backgroundColor: "white", borderRadius: "8px", alignItems: "center" }}>
                    <div>
                      <span style={{ color: "#374151", fontWeight: "500" }}>Owner&apos;s Policy</span>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>Typically paid by seller</p>
                    </div>
                    <span style={{ fontWeight: "700", color: "#DC2626", fontSize: "1.1rem" }}>{formatCurrency(ownerPremium)}</span>
                  </div>

                  {paymentType === "financed" && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", backgroundColor: "white", borderRadius: "8px", alignItems: "center" }}>
                      <div>
                        <span style={{ color: "#374151", fontWeight: "500" }}>Lender&apos;s Policy</span>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>Typically paid by buyer</p>
                      </div>
                      <span style={{ fontWeight: "700", color: "#2563EB", fontSize: "1.1rem" }}>{formatCurrency(lenderPremium)}</span>
                    </div>
                  )}

                  {paymentType === "cash" && (
                    <div style={{ padding: "12px", backgroundColor: "#D1FAE5", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.8rem", color: "#065F46", margin: 0 }}>
                        💰 <strong>Cash Purchase:</strong> No lender&apos;s policy required! You save {formatCurrency(calculateLenderPolicy(parseFloat(propertyPrice) * 0.8))} compared to financing.
                      </p>
                    </div>
                  )}
                </div>

                {/* Who Pays */}
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    <strong>💡 Who Pays in Texas?</strong><br />
                    Traditionally, the <strong>seller</strong> pays for the owner&apos;s policy and the <strong>buyer</strong> pays for the lender&apos;s policy. This is negotiable in your purchase contract.
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
            📊 Texas Title Insurance Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Common property prices with 20% down payment (80% loan-to-value)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Property Price</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Loan Amount (80%)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEE2E2" }}>Owner&apos;s Policy</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>Lender&apos;s Policy</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F3F4F6" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{formatCurrency(row.price)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(row.price * 0.8)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626", fontWeight: "600" }}>{formatCurrency(row.owner)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>{formatCurrency(row.lender)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700" }}>{formatCurrency(row.owner + row.lender)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Rates based on Texas Department of Insurance Basic Premium Rates effective September 1, 2019
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How Rates Work */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 How Texas Title Insurance Rates Are Calculated
              </h2>

              <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px" }}>The Formula (for properties over $100K)</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#1F2937",
                  color: "#10B981",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Step 1: Find your price tier<br />
                  Step 2: Price - Tier Base = Difference<br />
                  Step 3: Difference × Rate = Calculated Amount<br />
                  Step 4: Calculated Amount + Base Premium = Final
                </code>
              </div>

              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Example: $350,000 Home</h3>
              <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px" }}>
                <p style={{ color: "#92400E", margin: 0, lineHeight: "1.8" }}>
                  <strong>Tier:</strong> $100,001 - $1,000,000<br />
                  <strong>Step 1:</strong> $350,000 - $100,000 = $250,000<br />
                  <strong>Step 2:</strong> $250,000 × 0.00527 = $1,318<br />
                  <strong>Step 3:</strong> $1,318 + $832 = <strong>$2,150</strong> (Owner&apos;s Policy)
                </p>
              </div>
            </div>

            {/* Owner vs Lender */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🏠 Owner&apos;s vs Lender&apos;s Policy
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "12px" }}>Owner&apos;s Policy</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#991B1B", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>Protects the homeowner</li>
                    <li style={{ marginBottom: "8px" }}>Coverage = Purchase price</li>
                    <li style={{ marginBottom: "8px" }}>Lasts as long as you own</li>
                    <li style={{ marginBottom: "8px" }}>Optional but recommended</li>
                    <li>Usually paid by seller</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>Lender&apos;s Policy</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#1E40AF", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>Protects the mortgage lender</li>
                    <li style={{ marginBottom: "8px" }}>Coverage = Loan amount</li>
                    <li style={{ marginBottom: "8px" }}>Decreases as you pay down</li>
                    <li style={{ marginBottom: "8px" }}>Required by most lenders</li>
                    <li>Usually paid by buyer</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Texas Facts */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🤠 Texas Title Insurance Facts
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Regulated Rates</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Same price at all companies</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>One-Time Payment</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>No annual premiums</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Effective Date</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Rates since Sep 1, 2019</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Regulator</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Texas Dept of Insurance</p>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                💡 Money-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Compare escrow/closing fees (they vary!)</li>
                <li style={{ marginBottom: "8px" }}>Ask about refinance discounts</li>
                <li style={{ marginBottom: "8px" }}>Negotiate who pays in your contract</li>
                <li style={{ marginBottom: "8px" }}>Cash buyers skip lender&apos;s policy</li>
                <li>Request simultaneous issue discount</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/texas-title-insurance-calculator"
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
            ⚖️ <strong>Disclaimer:</strong> This calculator uses Texas Department of Insurance Basic Premium Rates effective September 1, 2019. Actual costs may include additional fees such as escrow fees, search fees, and endorsements. This is for informational purposes only and does not constitute legal or financial advice. Consult with a title company or real estate attorney for your specific transaction.
          </p>
        </div>
      </div>
    </div>
  );
}
