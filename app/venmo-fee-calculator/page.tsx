"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Fee calculation functions
const calcInstantFee = (amount: number): number => {
  if (amount <= 0) return 0;
  const fee = amount * 0.0175;
  return Math.min(Math.max(fee, 0.25), 25);
};

const calcGoodsFee = (amount: number): number => {
  if (amount <= 0) return 0;
  return amount * 0.019 + 0.10;
};

const calcCreditFee = (amount: number): number => {
  if (amount <= 0) return 0;
  return amount * 0.03;
};

const calcBusinessFee = (amount: number): number => {
  if (amount <= 0) return 0;
  return amount * 0.019 + 0.10;
};

const calcTapToPayFee = (amount: number): number => {
  if (amount <= 0) return 0;
  return amount * 0.0229 + 0.09;
};

// Reverse calculation: desired amount -> buyer should pay
const calcBuyerShouldPay = (desiredAmount: number): number => {
  if (desiredAmount <= 0) return 0;
  return (desiredAmount + 0.10) / (1 - 0.019);
};

// Quick reference data
const quickReferenceData = [
  { amount: 50, instant: calcInstantFee(50), goods: calcGoodsFee(50), credit: calcCreditFee(50) },
  { amount: 100, instant: calcInstantFee(100), goods: calcGoodsFee(100), credit: calcCreditFee(100) },
  { amount: 250, instant: calcInstantFee(250), goods: calcGoodsFee(250), credit: calcCreditFee(250) },
  { amount: 500, instant: calcInstantFee(500), goods: calcGoodsFee(500), credit: calcCreditFee(500) },
  { amount: 1000, instant: calcInstantFee(1000), goods: calcGoodsFee(1000), credit: calcCreditFee(1000) },
  { amount: 1500, instant: calcInstantFee(1500), goods: calcGoodsFee(1500), credit: calcCreditFee(1500) },
  { amount: 2000, instant: calcInstantFee(2000), goods: calcGoodsFee(2000), credit: calcCreditFee(2000) },
];

// FAQ data
const faqs = [
  {
    question: "How much does Venmo take out of $100?",
    answer: "It depends on the transaction type. For instant transfer to your bank, Venmo charges $1.75 (1.75%). For goods and services (seller fee), it's $2.00 (1.9% + $0.10). For credit card payments, it's $3.00 (3%). Standard bank transfers are free but take 1-3 business days."
  },
  {
    question: "How to calculate Venmo fee?",
    answer: "Venmo fees vary by transaction type: Instant Transfer = 1.75% (min $0.25, max $25), Goods & Services = 1.9% + $0.10, Credit Card = 3%, Business Tap to Pay = 2.29% + $0.09. Multiply your amount by the percentage and add any flat fee to get the total."
  },
  {
    question: "Does Venmo charge a 3% fee?",
    answer: "Yes, Venmo charges a 3% fee when you send money using a credit card. However, sending money using your Venmo balance, bank account, or debit card is free. To avoid the 3% fee, simply change your payment method to a non-credit card option."
  },
  {
    question: "How much does it cost to send $1000 through Venmo?",
    answer: "Sending $1000 through Venmo is FREE if you use your bank account, debit card, or Venmo balance. If you use a credit card, it costs $30 (3%). For instant transfer to your bank after receiving $1000, the fee is $17.50 (1.75%)."
  },
  {
    question: "What is the Venmo instant transfer fee?",
    answer: "Venmo's instant transfer fee is 1.75% of the transfer amount, with a minimum fee of $0.25 and a maximum fee of $25. This means for transfers over $1,428.57, you'll only pay the $25 maximum fee regardless of the amount."
  },
  {
    question: "How can I avoid Venmo fees?",
    answer: "To avoid Venmo fees: 1) Use your bank account or debit card instead of credit card for payments, 2) Choose standard transfer (1-3 days) instead of instant transfer, 3) For personal payments between friends, don't use the 'Goods & Services' option, 4) Receive payments to your Venmo balance instead of instant transfer to bank."
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

export default function VenmoFeeCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"instant" | "goods" | "credit" | "business">("instant");

  // Instant Transfer state
  const [instantAmount, setInstantAmount] = useState<string>("500");
  const [instantFee, setInstantFee] = useState<number>(0);
  const [instantReceive, setInstantReceive] = useState<number>(0);

  // Goods & Services state
  const [goodsAmount, setGoodsAmount] = useState<string>("100");
  const [goodsMode, setGoodsMode] = useState<"forward" | "reverse">("forward");
  const [goodsFee, setGoodsFee] = useState<number>(0);
  const [goodsReceive, setGoodsReceive] = useState<number>(0);
  const [goodsBuyerPays, setGoodsBuyerPays] = useState<number>(0);

  // Credit Card state
  const [creditAmount, setCreditAmount] = useState<string>("200");
  const [creditFee, setCreditFee] = useState<number>(0);
  const [creditTotal, setCreditTotal] = useState<number>(0);

  // Business state
  const [businessAmount, setBusinessAmount] = useState<string>("500");
  const [businessType, setBusinessType] = useState<"standard" | "tap">("standard");
  const [businessFee, setBusinessFee] = useState<number>(0);
  const [businessReceive, setBusinessReceive] = useState<number>(0);

  // Calculate Instant Transfer
  useEffect(() => {
    const amount = parseFloat(instantAmount) || 0;
    const fee = calcInstantFee(amount);
    setInstantFee(fee);
    setInstantReceive(amount - fee);
  }, [instantAmount]);

  // Calculate Goods & Services
  useEffect(() => {
    const amount = parseFloat(goodsAmount) || 0;
    if (goodsMode === "forward") {
      const fee = calcGoodsFee(amount);
      setGoodsFee(fee);
      setGoodsReceive(amount - fee);
      setGoodsBuyerPays(amount);
    } else {
      const buyerPays = calcBuyerShouldPay(amount);
      const fee = calcGoodsFee(buyerPays);
      setGoodsFee(fee);
      setGoodsReceive(amount);
      setGoodsBuyerPays(buyerPays);
    }
  }, [goodsAmount, goodsMode]);

  // Calculate Credit Card
  useEffect(() => {
    const amount = parseFloat(creditAmount) || 0;
    const fee = calcCreditFee(amount);
    setCreditFee(fee);
    setCreditTotal(amount + fee);
  }, [creditAmount]);

  // Calculate Business
  useEffect(() => {
    const amount = parseFloat(businessAmount) || 0;
    const fee = businessType === "standard" ? calcBusinessFee(amount) : calcTapToPayFee(amount);
    setBusinessFee(fee);
    setBusinessReceive(amount - fee);
  }, [businessAmount, businessType]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Venmo Fee Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Venmo Fee Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Venmo fees for instant transfers, goods & services, credit card payments, and business transactions. Know exactly how much you&apos;ll pay or receive.
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
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[
              { id: "instant", label: "⚡ Instant Transfer", rate: "1.75%" },
              { id: "goods", label: "🛍️ Goods & Services", rate: "1.9% + $0.10" },
              { id: "credit", label: "💳 Credit Card", rate: "3%" },
              { id: "business", label: "🏪 Business", rate: "1.9-2.29%" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "instant" | "goods" | "credit" | "business")}
                style={{
                  flex: "1",
                  minWidth: "140px",
                  padding: "14px 12px",
                  borderRadius: "12px",
                  border: activeTab === tab.id ? "2px solid #008CFF" : "1px solid #E5E7EB",
                  backgroundColor: activeTab === tab.id ? "#E6F4FF" : "white",
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <p style={{
                  fontWeight: "600",
                  color: activeTab === tab.id ? "#0066CC" : "#374151",
                  marginBottom: "4px",
                  fontSize: "0.9rem"
                }}>
                  {tab.label}
                </p>
                <p style={{ fontSize: "0.75rem", color: activeTab === tab.id ? "#0066CC" : "#6B7280" }}>{tab.rate}</p>
              </button>
            ))}
          </div>

          {/* Instant Transfer Tab */}
          {activeTab === "instant" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Left - Input */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  ⚡ Instant Transfer to Bank
                </h3>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Transfer Amount ($)
                  </label>
                  <input
                    type="number"
                    value={instantAmount}
                    onChange={(e) => setInstantAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "1.25rem",
                      fontWeight: "600"
                    }}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Standard transfer is FREE but takes 1-3 business days.
                  </p>
                </div>
              </div>

              {/* Right - Results */}
              <div style={{ backgroundColor: "#F0F9FF", padding: "24px", borderRadius: "12px", border: "2px solid #BAE6FD" }}>
                <h3 style={{ fontWeight: "600", color: "#0369A1", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Results
                </h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #BAE6FD" }}>
                    <span style={{ color: "#0369A1" }}>Transfer Amount</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{formatCurrency(parseFloat(instantAmount) || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #BAE6FD" }}>
                    <span style={{ color: "#DC2626" }}>Instant Fee (1.75%)</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#DC2626" }}>-{formatCurrency(instantFee)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#DCFCE7", borderRadius: "10px", marginTop: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#166534" }}>You Receive</span>
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#16A34A" }}>{formatCurrency(instantReceive)}</span>
                  </div>
                </div>
                {instantFee >= 25 && (
                  <div style={{ marginTop: "12px", padding: "10px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.75rem", color: "#92400E" }}>
                      ⚠️ Maximum fee cap of $25 applied
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Goods & Services Tab */}
          {activeTab === "goods" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Left - Input */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  🛍️ Goods & Services Fee
                </h3>
                
                {/* Mode Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Calculation Mode
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setGoodsMode("forward")}
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "8px",
                        border: goodsMode === "forward" ? "2px solid #008CFF" : "1px solid #E5E7EB",
                        backgroundColor: goodsMode === "forward" ? "#E6F4FF" : "white",
                        color: goodsMode === "forward" ? "#0066CC" : "#4B5563",
                        fontWeight: goodsMode === "forward" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Calculate Fee
                    </button>
                    <button
                      onClick={() => setGoodsMode("reverse")}
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "8px",
                        border: goodsMode === "reverse" ? "2px solid #008CFF" : "1px solid #E5E7EB",
                        backgroundColor: goodsMode === "reverse" ? "#E6F4FF" : "white",
                        color: goodsMode === "reverse" ? "#0066CC" : "#4B5563",
                        fontWeight: goodsMode === "reverse" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Reverse Calculate
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    {goodsMode === "forward" ? "Payment Amount ($)" : "Amount You Want to Receive ($)"}
                  </label>
                  <input
                    type="number"
                    value={goodsAmount}
                    onChange={(e) => setGoodsAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "1.25rem",
                      fontWeight: "600"
                    }}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#EDE9FE", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#5B21B6" }}>
                    💡 <strong>Reverse mode:</strong> Enter how much you want to receive, and we&apos;ll tell you how much the buyer should pay.
                  </p>
                </div>
              </div>

              {/* Right - Results */}
              <div style={{ backgroundColor: "#FDF4FF", padding: "24px", borderRadius: "12px", border: "2px solid #E9D5FF" }}>
                <h3 style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Results
                </h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E9D5FF" }}>
                    <span style={{ color: "#7C3AED" }}>Buyer Pays</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{formatCurrency(goodsBuyerPays)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #E9D5FF" }}>
                    <span style={{ color: "#DC2626" }}>Venmo Fee (1.9% + $0.10)</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#DC2626" }}>-{formatCurrency(goodsFee)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#DCFCE7", borderRadius: "10px", marginTop: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#166534" }}>You Receive</span>
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#16A34A" }}>{formatCurrency(goodsReceive)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Credit Card Tab */}
          {activeTab === "credit" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Left - Input */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  💳 Credit Card Payment Fee
                </h3>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "1.25rem",
                      fontWeight: "600"
                    }}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEE2E2", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#991B1B" }}>
                    ⚠️ <strong>Avoid this fee:</strong> Use your bank account, debit card, or Venmo balance instead of a credit card.
                  </p>
                </div>
              </div>

              {/* Right - Results */}
              <div style={{ backgroundColor: "#FFF7ED", padding: "24px", borderRadius: "12px", border: "2px solid #FED7AA" }}>
                <h3 style={{ fontWeight: "600", color: "#C2410C", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Results
                </h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #FED7AA" }}>
                    <span style={{ color: "#C2410C" }}>Payment Amount</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{formatCurrency(parseFloat(creditAmount) || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #FED7AA" }}>
                    <span style={{ color: "#DC2626" }}>Credit Card Fee (3%)</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#DC2626" }}>+{formatCurrency(creditFee)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#FEE2E2", borderRadius: "10px", marginTop: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#991B1B" }}>Total You Pay</span>
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#DC2626" }}>{formatCurrency(creditTotal)}</span>
                  </div>
                </div>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#166534" }}>
                    ✅ <strong>If you used bank/debit:</strong> You would pay {formatCurrency(parseFloat(creditAmount) || 0)} (save {formatCurrency(creditFee)})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === "business" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Left - Input */}
              <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                  🏪 Business Profile Fee
                </h3>
                
                {/* Business Type Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Payment Type
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setBusinessType("standard")}
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "8px",
                        border: businessType === "standard" ? "2px solid #008CFF" : "1px solid #E5E7EB",
                        backgroundColor: businessType === "standard" ? "#E6F4FF" : "white",
                        color: businessType === "standard" ? "#0066CC" : "#4B5563",
                        fontWeight: businessType === "standard" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Standard (1.9% + $0.10)
                    </button>
                    <button
                      onClick={() => setBusinessType("tap")}
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "8px",
                        border: businessType === "tap" ? "2px solid #008CFF" : "1px solid #E5E7EB",
                        backgroundColor: businessType === "tap" ? "#E6F4FF" : "white",
                        color: businessType === "tap" ? "#0066CC" : "#4B5563",
                        fontWeight: businessType === "tap" ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                    >
                      Tap to Pay (2.29% + $0.09)
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    value={businessAmount}
                    onChange={(e) => setBusinessAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "2px solid #E5E7EB",
                      borderRadius: "10px",
                      fontSize: "1.25rem",
                      fontWeight: "600"
                    }}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.8rem", color: "#1E40AF" }}>
                    💡 <strong>Note:</strong> Business fees are automatically deducted from payments received.
                  </p>
                </div>
              </div>

              {/* Right - Results */}
              <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", border: "2px solid #BBF7D0" }}>
                <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "20px", fontSize: "1.1rem" }}>
                  📊 Results
                </h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #BBF7D0" }}>
                    <span style={{ color: "#166534" }}>Customer Pays</span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>{formatCurrency(parseFloat(businessAmount) || 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #BBF7D0" }}>
                    <span style={{ color: "#DC2626" }}>
                      Venmo Fee ({businessType === "standard" ? "1.9% + $0.10" : "2.29% + $0.09"})
                    </span>
                    <span style={{ fontWeight: "600", fontSize: "1.1rem", color: "#DC2626" }}>-{formatCurrency(businessFee)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#DCFCE7", borderRadius: "10px", marginTop: "8px" }}>
                    <span style={{ fontWeight: "600", color: "#166534" }}>You Receive</span>
                    <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#16A34A" }}>{formatCurrency(businessReceive)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📋 Quick Reference: Venmo Fees by Amount
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            See exactly how much Venmo charges for common transaction amounts
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Amount</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>⚡ Instant Transfer</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>🛍️ Goods & Services</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>💳 Credit Card</th>
                </tr>
              </thead>
              <tbody>
                {quickReferenceData.map((row, index) => (
                  <tr key={row.amount} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(row.amount)}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0369A1" }}>
                      {formatCurrency(row.instant)}
                      {row.instant >= 25 && <span style={{ fontSize: "0.7rem", color: "#DC2626", marginLeft: "4px" }}>(max)</span>}
                    </td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", color: "#7C3AED" }}>{formatCurrency(row.goods)}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", color: "#C2410C" }}>{formatCurrency(row.credit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#0369A1" }}></span>
              <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Instant: 1.75% (min $0.25, max $25)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#7C3AED" }}></span>
              <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>G&S: 1.9% + $0.10</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#C2410C" }}></span>
              <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Credit: 3%</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Venmo Fee Structure */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Venmo Fee Structure 2025
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "20px", lineHeight: "1.7" }}>
                Venmo offers many free services, but charges fees for certain transaction types. Understanding these fees helps you choose the most cost-effective payment method.
              </p>

              <div style={{ display: "grid", gap: "16px" }}>
                {/* Free Transactions */}
                <div style={{ backgroundColor: "#DCFCE7", padding: "20px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "12px" }}>✅ Free Transactions</h3>
                  <ul style={{ color: "#166534", fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li style={{ marginBottom: "6px" }}>Sending money using bank account, debit card, or Venmo balance</li>
                    <li style={{ marginBottom: "6px" }}>Receiving personal payments from friends</li>
                    <li style={{ marginBottom: "6px" }}>Standard bank transfer (1-3 business days)</li>
                    <li style={{ marginBottom: "6px" }}>Online purchases with Venmo</li>
                    <li>Direct deposit to Venmo account</li>
                  </ul>
                </div>

                {/* Paid Transactions */}
                <div style={{ backgroundColor: "#FEE2E2", padding: "20px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "12px" }}>💰 Transactions with Fees</h3>
                  <ul style={{ color: "#991B1B", fontSize: "0.9rem", paddingLeft: "20px", margin: 0 }}>
                    <li style={{ marginBottom: "6px" }}>Instant transfer: 1.75% (min $0.25, max $25)</li>
                    <li style={{ marginBottom: "6px" }}>Credit card payment: 3%</li>
                    <li style={{ marginBottom: "6px" }}>Goods & Services: 1.9% + $0.10</li>
                    <li style={{ marginBottom: "6px" }}>Business Tap to Pay: 2.29% + $0.09</li>
                    <li>Out-of-network ATM withdrawal: varies</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How to Avoid Fees */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                💡 How to Avoid Venmo Fees
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { icon: "🏦", tip: "Use your bank account or debit card instead of credit card (saves 3%)" },
                  { icon: "⏰", tip: "Choose standard transfer (1-3 days) instead of instant transfer" },
                  { icon: "👥", tip: "For personal payments between friends, don't select 'Goods & Services'" },
                  { icon: "💵", tip: "Keep money in your Venmo balance and pay from there" },
                  { icon: "🎯", tip: "Use Venmo for purchases at supported merchants (no fee)" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                    <span style={{ color: "#374151", fontSize: "0.9rem" }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Fee Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📊 Fee Comparison
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Credit Card</span>
                  <span style={{ fontWeight: "600", color: "#DC2626" }}>3.00%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Tap to Pay</span>
                  <span style={{ fontWeight: "600", color: "#F59E0B" }}>2.29%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Goods & Services</span>
                  <span style={{ fontWeight: "600", color: "#8B5CF6" }}>1.90%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Instant Transfer</span>
                  <span style={{ fontWeight: "600", color: "#3B82F6" }}>1.75%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>Standard Transfer</span>
                  <span style={{ fontWeight: "600", color: "#22C55E" }}>FREE</span>
                </div>
              </div>
            </div>

            {/* Instant Transfer Limits */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚡ Instant Transfer Limits
              </h3>
              <ul style={{ fontSize: "0.8rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}><strong>Min fee:</strong> $0.25</li>
                <li style={{ marginBottom: "8px" }}><strong>Max fee:</strong> $25.00</li>
                <li style={{ marginBottom: "8px" }}><strong>Rate:</strong> 1.75%</li>
                <li><strong>Best for:</strong> Transfers over $1,428 (hits max cap)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Related Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/1031-exchange-calculator", name: "1031 Exchange Calculator", desc: "Real estate tax savings", icon: "🏠" },
                  { href: "/balloon-mortgage-calculator", name: "Balloon Mortgage Calculator", desc: "Calculate balloon payments", icon: "🎈" },
                  { href: "/ifta-calculator", name: "IFTA Calculator", desc: "Fuel tax by state", icon: "🚛" }
                ].map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      textDecoration: "none"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
                    <div>
                      <p style={{ fontWeight: "500", color: "#111827", marginBottom: "2px" }}>{tool.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
            ⚠️ <strong>Disclaimer:</strong> Fee rates are based on Venmo&apos;s published fee structure as of 2025. Fees may change without notice. Always verify current rates on Venmo&apos;s official website before making transactions.
          </p>
        </div>
      </div>
    </div>
  );
}