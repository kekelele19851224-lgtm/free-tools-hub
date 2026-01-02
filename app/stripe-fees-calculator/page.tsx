"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

const feeRates: Record<string, { percent: number; fixed: number; maxFee?: number; label: string; description: string }> = {
  domestic: { percent: 2.9, fixed: 0.30, label: "Domestic Card", description: "US-issued cards" },
  international: { percent: 3.9, fixed: 0.30, label: "International Card", description: "Non-US cards (+1%)" },
  ach: { percent: 0.8, fixed: 0, maxFee: 5.00, label: "ACH / Bank Transfer", description: "0.8% capped at $5" },
};

// Quick reference table data
const quickReference = [
  { amount: 25 },
  { amount: 50 },
  { amount: 100 },
  { amount: 250 },
  { amount: 500 },
  { amount: 1000 },
  { amount: 2500 },
  { amount: 5000 },
  { amount: 10000 },
];

// FAQ data
const faqs = [
  {
    question: "How much is the Stripe fee for $100?",
    answer: "For a $100 transaction with a US domestic card, Stripe charges 2.9% + $0.30 = $3.20. You would receive $96.80 after fees. For international cards, the fee is 3.9% + $0.30 = $4.20, leaving you with $95.80."
  },
  {
    question: "What percent of fees does Stripe take?",
    answer: "Stripe's standard fee is 2.9% + $0.30 per successful card transaction for domestic cards. International cards incur an additional 1% (3.9% + $0.30). ACH bank transfers are charged at 0.8% with a maximum fee of $5.00. In-person payments via Stripe Terminal are 2.7% + $0.05."
  },
  {
    question: "What's cheaper, PayPal or Stripe?",
    answer: "Both PayPal and Stripe charge similar rates for standard transactions: 2.9% + $0.30. However, differences emerge in specific scenarios. PayPal charges 3.49% + $0.49 for PayPal checkout, while Stripe remains at 2.9% + $0.30. For international transactions, both add approximately 1.5%. Stripe often wins for developers due to better APIs and customization options."
  },
  {
    question: "How to calculate 3% processing fee?",
    answer: "To calculate a 3% processing fee: multiply the transaction amount by 0.03. For example, $100 × 0.03 = $3.00. To pass fees to customers (reverse calculation), use the formula: Amount ÷ (1 - 0.03) = Charge Amount. So to receive $100 after a 3% fee, charge $100 ÷ 0.97 = $103.09."
  },
  {
    question: "Can I pass Stripe fees to my customers?",
    answer: "Yes, you can pass Stripe fees to customers by adding a surcharge. However, this must comply with local laws—some jurisdictions prohibit surcharging. Use the reverse calculator to determine the exact amount to charge. For example, to receive $100 after fees, you'd need to charge $103.30 (for domestic cards)."
  },
  {
    question: "Does Stripe charge fees on refunds?",
    answer: "Stripe does not refund the original processing fee when you issue a refund to a customer. For example, if you processed a $100 charge (fee: $3.20) and then refund it, you lose the $3.20 fee. Additionally, Stripe charges a $15 fee for chargebacks/disputes."
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

// Calculate standard fee
function calculateStandardFee(amount: number, type: keyof typeof feeRates): { fee: number; net: number; percent: number } {
  if (amount <= 0) return { fee: 0, net: 0, percent: 0 };
  
  const rate = feeRates[type];
  let fee: number;
  
  if (type === "ach") {
    fee = Math.min(amount * (rate.percent / 100), rate.maxFee || Infinity);
  } else {
    fee = (amount * (rate.percent / 100)) + rate.fixed;
  }
  
  const net = amount - fee;
  const percent = (fee / amount) * 100;
  
  return { fee, net, percent };
}

// Calculate reverse fee (what to charge to receive desired amount)
function calculateReverseAmount(desiredNet: number, type: keyof typeof feeRates): { charge: number; fee: number; percent: number } {
  if (desiredNet <= 0) return { charge: 0, fee: 0, percent: 0 };
  
  const rate = feeRates[type];
  let charge: number;
  let fee: number;
  
  if (type === "ach") {
    // For ACH with cap
    const uncappedCharge = desiredNet / (1 - rate.percent / 100);
    const uncappedFee = uncappedCharge * (rate.percent / 100);
    
    if (uncappedFee >= (rate.maxFee || Infinity)) {
      // Fee is capped
      charge = desiredNet + (rate.maxFee || 0);
      fee = rate.maxFee || 0;
    } else {
      charge = uncappedCharge;
      fee = uncappedFee;
    }
  } else {
    // Standard formula: charge = (desired + fixed) / (1 - percent)
    charge = (desiredNet + rate.fixed) / (1 - rate.percent / 100);
    fee = charge - desiredNet;
  }
  
  const percent = (fee / charge) * 100;
  
  return { charge, fee, percent };
}

export default function StripeFeeCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"standard" | "reverse">("standard");
  
  // Inputs
  const [amount, setAmount] = useState<string>("100");
  const [paymentType, setPaymentType] = useState<keyof typeof feeRates>("domestic");
  
  // Results
  const [results, setResults] = useState<{
    fee: number;
    net: number;
    charge: number;
    percent: number;
  }>({ fee: 0, net: 0, charge: 0, percent: 0 });

  // Calculate on input change
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    
    if (activeTab === "standard") {
      const calc = calculateStandardFee(numAmount, paymentType);
      setResults({
        fee: calc.fee,
        net: calc.net,
        charge: numAmount,
        percent: calc.percent
      });
    } else {
      const calc = calculateReverseAmount(numAmount, paymentType);
      setResults({
        fee: calc.fee,
        net: numAmount,
        charge: calc.charge,
        percent: calc.percent
      });
    }
  }, [amount, paymentType, activeTab]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const tabs = [
    { id: "standard" as const, label: "Calculate Fee", icon: "💳", description: "Enter charge amount" },
    { id: "reverse" as const, label: "Reverse Calculate", icon: "🔄", description: "Enter desired net" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Stripe Fees Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💳</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Stripe Fees Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Stripe processing fees instantly. See exactly how much you&apos;ll pay or what to charge to receive a specific amount.
          </p>
        </div>

        {/* Fee Info Banner */}
        <div style={{
          backgroundColor: "#F5F3FF",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "32px",
          border: "1px solid #DDD6FE",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.5rem" }}>ℹ️</span>
          <div>
            <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>
              Stripe Standard Rates (2025)
            </p>
            <p style={{ fontSize: "0.875rem", color: "#6D28D9", margin: 0 }}>
              Domestic: 2.9% + $0.30 | International: 3.9% + $0.30 | ACH: 0.8% (max $5)
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
                  borderBottom: activeTab === tab.id ? "3px solid #635BFF" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#635BFF" : "#6B7280",
                  fontSize: "0.95rem",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ marginRight: "8px" }}>{tab.icon}</span>
                {tab.label}
                <span style={{ display: "block", fontSize: "0.75rem", fontWeight: "400", marginTop: "2px" }}>
                  {tab.description}
                </span>
              </button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  {activeTab === "standard" ? "💵 Transaction Amount" : "🎯 Desired Amount to Receive"}
                </h3>

                {/* Amount Input */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    {activeTab === "standard" ? "Amount to Charge ($)" : "Amount You Want to Receive ($)"}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "1.25rem",
                      fontWeight: "600"
                    }}
                    min="0"
                    step="0.01"
                    placeholder="100.00"
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
                    {["25", "50", "100", "500", "1000"].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: amount === preset ? "2px solid #635BFF" : "1px solid #E5E7EB",
                          backgroundColor: amount === preset ? "#F5F3FF" : "white",
                          color: amount === preset ? "#635BFF" : "#6B7280",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          fontWeight: amount === preset ? "600" : "400"
                        }}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "10px" }}>
                    Payment Type
                  </label>
                  <div style={{ display: "grid", gap: "10px" }}>
                    {(Object.keys(feeRates) as Array<keyof typeof feeRates>).map((type) => (
                      <button
                        key={type}
                        onClick={() => setPaymentType(type)}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "10px",
                          border: paymentType === type ? "2px solid #635BFF" : "1px solid #E5E7EB",
                          backgroundColor: paymentType === type ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ 
                              fontWeight: "600", 
                              color: paymentType === type ? "#635BFF" : "#374151",
                              fontSize: "0.95rem"
                            }}>
                              {feeRates[type].label}
                            </span>
                            <p style={{ 
                              fontSize: "0.8rem", 
                              color: "#6B7280", 
                              margin: "2px 0 0 0" 
                            }}>
                              {feeRates[type].description}
                            </p>
                          </div>
                          <span style={{ 
                            fontWeight: "700", 
                            color: paymentType === type ? "#635BFF" : "#9CA3AF",
                            fontSize: "0.9rem"
                          }}>
                            {type === "ach" 
                              ? `${feeRates[type].percent}%` 
                              : `${feeRates[type].percent}% + $${feeRates[type].fixed.toFixed(2)}`
                            }
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results" style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px", border: "2px solid #DDD6FE" }}>
                <h3 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Fee Breakdown
                </h3>

                {/* Main Result */}
                <div style={{
                  backgroundColor: "#635BFF",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  {activeTab === "standard" ? (
                    <>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>You Will Receive</p>
                      <p style={{ fontSize: "2.75rem", fontWeight: "bold", color: "white", margin: 0 }}>
                        {formatCurrency(results.net)}
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "8px" }}>
                        after {formatCurrency(results.fee)} in fees ({results.percent.toFixed(2)}%)
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>You Should Charge</p>
                      <p style={{ fontSize: "2.75rem", fontWeight: "bold", color: "white", margin: 0 }}>
                        {formatCurrency(results.charge)}
                      </p>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginTop: "8px" }}>
                        to receive {formatCurrency(results.net)} after fees
                      </p>
                    </>
                  )}
                </div>

                {/* Breakdown Details */}
                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "14px 16px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#374151", fontWeight: "500" }}>
                      {activeTab === "standard" ? "Transaction Amount" : "Amount to Charge"}
                    </span>
                    <span style={{ fontWeight: "700", color: "#111827", fontSize: "1.1rem" }}>
                      {formatCurrency(activeTab === "standard" ? parseFloat(amount) || 0 : results.charge)}
                    </span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "14px 16px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#374151", fontWeight: "500" }}>Stripe Fee</span>
                    <span style={{ fontWeight: "700", color: "#DC2626", fontSize: "1.1rem" }}>
                      -{formatCurrency(results.fee)}
                    </span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "14px 16px", 
                    backgroundColor: "white", 
                    borderRadius: "8px",
                    alignItems: "center"
                  }}>
                    <span style={{ color: "#374151", fontWeight: "500" }}>Effective Fee Rate</span>
                    <span style={{ fontWeight: "700", color: "#6D28D9", fontSize: "1.1rem" }}>
                      {results.percent.toFixed(2)}%
                    </span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    padding: "14px 16px", 
                    backgroundColor: "#ECFDF5", 
                    borderRadius: "8px",
                    alignItems: "center",
                    border: "2px solid #10B981"
                  }}>
                    <span style={{ color: "#065F46", fontWeight: "600" }}>You Receive</span>
                    <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.2rem" }}>
                      {formatCurrency(results.net)}
                    </span>
                  </div>
                </div>

                {/* Formula Info */}
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    <strong>💡 Formula:</strong>{" "}
                    {activeTab === "standard" 
                      ? "Fee = (Amount × Rate%) + Fixed Fee" 
                      : "Charge = (Desired + Fixed) ÷ (1 - Rate%)"
                    }
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
            📊 Stripe Fee Quick Reference Table
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Common transaction amounts with fees for each payment type
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Amount</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F5F3FF" }}>Domestic Fee</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F5F3FF" }}>You Receive</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FEF3C7" }}>Int&apos;l Fee</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>ACH Fee</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const domestic = calculateStandardFee(row.amount, "domestic");
                  const international = calculateStandardFee(row.amount, "international");
                  const ach = calculateStandardFee(row.amount, "ach");
                  
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(row.amount)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>{formatCurrency(domestic.fee)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{formatCurrency(domestic.net)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706" }}>{formatCurrency(international.fee)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0891B2" }}>{formatCurrency(ach.fee)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Rates: Domestic 2.9% + $0.30 | International 3.9% + $0.30 | ACH 0.8% (max $5.00)
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How Fees Work */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 How to Calculate Stripe Fees
              </h2>

              <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px" }}>Standard Fee Calculation</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#1F2937",
                  color: "#10B981",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Stripe Fee = (Amount × 2.9%) + $0.30<br />
                  You Receive = Amount - Stripe Fee<br /><br />
                  Example: $100 transaction<br />
                  Fee = ($100 × 0.029) + $0.30 = $3.20<br />
                  You Receive = $100 - $3.20 = $96.80
                </code>
              </div>

              <div style={{ backgroundColor: "#F5F3FF", padding: "20px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "12px" }}>Reverse Calculation (Pass Fees to Customer)</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#1F2937",
                  color: "#A78BFA",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Charge = (Desired + $0.30) ÷ (1 - 0.029)<br /><br />
                  Example: Want to receive $100<br />
                  Charge = ($100 + $0.30) ÷ 0.971<br />
                  Charge = $103.30
                </code>
              </div>
            </div>

            {/* Fee Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💰 Stripe Fee Types Comparison
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#F5F3FF", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "12px" }}>💳 Card Payments</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#6D28D9", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>Domestic: 2.9% + $0.30</li>
                    <li style={{ marginBottom: "8px" }}>International: +1% extra</li>
                    <li style={{ marginBottom: "8px" }}>Currency conversion: +1%</li>
                    <li>In-person (Terminal): 2.7% + $0.05</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#065F46", marginBottom: "12px" }}>🏦 Bank Payments</h4>
                  <ul style={{ fontSize: "0.875rem", color: "#047857", paddingLeft: "16px", margin: 0 }}>
                    <li style={{ marginBottom: "8px" }}>ACH Direct Debit: 0.8%</li>
                    <li style={{ marginBottom: "8px" }}>ACH max fee: $5.00</li>
                    <li style={{ marginBottom: "8px" }}>Wire transfers: $8.00</li>
                    <li>Instant payouts: 1%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Info */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💳 Stripe Fee Facts
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Standard Rate</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>2.9% + $0.30 per transaction</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>No Monthly Fee</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Pay only when you process</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Chargeback Fee</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>$15 per disputed charge</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Volume Discount</p>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Available for $80K+/month</p>
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
                💡 Fee-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Use ACH for large payments ($625+)</li>
                <li style={{ marginBottom: "8px" }}>Batch invoices to reduce fixed fees</li>
                <li style={{ marginBottom: "8px" }}>Negotiate rates at high volume</li>
                <li style={{ marginBottom: "8px" }}>Consider passing fees legally</li>
                <li>Minimize chargebacks & refunds</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/stripe-fees-calculator"
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
            💳 <strong>Disclaimer:</strong> This calculator uses Stripe&apos;s published rates as of 2025. Actual fees may vary based on your account type, negotiated rates, or specific payment methods. Always verify current rates on <a href="https://stripe.com/pricing" target="_blank" rel="noopener noreferrer" style={{ color: "#635BFF" }}>Stripe&apos;s pricing page</a>. This tool is for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}
