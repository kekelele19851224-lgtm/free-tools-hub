"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Payment frequency options
const frequencies = {
  "monthly": { name: "Monthly", periods: 12 },
  "weekly": { name: "Weekly", periods: 52 },
  "biweekly": { name: "Bi-weekly", periods: 26 }
};

// Calculate amortized payment (P&I)
const calculateAmortizedPayment = (principal: number, annualRate: number, termMonths: number): number => {
  if (annualRate === 0) return principal / termMonths;
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  return payment;
};

// Calculate interest-only payment
const calculateInterestOnlyPayment = (principal: number, annualRate: number): number => {
  return principal * (annualRate / 100 / 12);
};

// Generate amortization schedule
const generateAmortizationSchedule = (principal: number, annualRate: number, termMonths: number, payment: number) => {
  const schedule = [];
  let balance = principal;
  const monthlyRate = annualRate / 100 / 12;
  let totalInterest = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);
    totalInterest += interest;
    
    schedule.push({
      month,
      payment,
      principal: principalPaid,
      interest,
      balance
    });
  }
  
  return { schedule, totalInterest };
};

// FAQ data
const faqs = [
  {
    question: "How is a business line of credit calculated?",
    answer: "A business line of credit payment is calculated based on the amount you draw (not the total limit), the interest rate, and repayment term. For interest-only payments, multiply your balance by the annual rate divided by 12. For example, $50,000 at 8% APR = $50,000 × (0.08 ÷ 12) = $333.33/month. For principal + interest payments, use the amortization formula which spreads both principal and interest over your term."
  },
  {
    question: "What's the interest rate on a $50,000 business loan?",
    answer: "Interest rates on a $50,000 business line of credit typically range from 7% to 25% APR depending on your credit score, business revenue, and time in business. Banks offer 7-12% for well-qualified borrowers, while online lenders charge 12-25%. At 10% APR, interest-only payments would be $417/month, while a 24-month P&I payment would be $2,307/month."
  },
  {
    question: "How much line of credit can I get for my business?",
    answer: "Business line of credit limits typically range from $10,000 to $250,000, based on annual revenue (usually 10-20% of revenue), credit score (650+ preferred), time in business (1+ years), and cash flow. Startups may qualify for $10,000-$50,000, while established businesses with $500K+ revenue can access $100,000-$250,000 or more."
  },
  {
    question: "What is the monthly payment on a $400,000 loan at 7%?",
    answer: "For a $400,000 business line of credit at 7% APR: Interest-only payment = $2,333/month. With a 60-month term (P&I), payment = $7,920/month, total interest = $75,200. With a 120-month term, payment = $4,644/month, total interest = $157,280. Longer terms mean lower payments but significantly more total interest paid."
  },
  {
    question: "What is interest-only payment on a line of credit?",
    answer: "Interest-only payments mean you only pay the interest charges each month, not the principal. Your balance stays the same until you make extra payments. For a $50,000 draw at 10% APR, interest-only = $417/month. This keeps payments low but means you never pay down the debt unless you pay more than the minimum. It's common during the 'draw period' of many lines of credit."
  },
  {
    question: "How does a revolving business line of credit work?",
    answer: "A revolving line of credit lets you borrow, repay, and borrow again up to your credit limit. You only pay interest on what you draw, not the full limit. As you repay principal, that amount becomes available to borrow again. For example, with a $100,000 limit, if you draw $30,000 and repay $10,000, you'd owe $20,000 and have $80,000 available. This flexibility makes it ideal for managing cash flow."
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

export default function BusinessLineOfCreditCalculator() {
  const [activeTab, setActiveTab] = useState<"payment" | "compare" | "simulator">("payment");
  
  // Tab 1: Payment Calculator State
  const [drawAmount, setDrawAmount] = useState<string>("50000");
  const [interestRate, setInterestRate] = useState<string>("10");
  const [termMonths, setTermMonths] = useState<string>("24");
  const [paymentType, setPaymentType] = useState<string>("amortized");
  const [drawFee, setDrawFee] = useState<string>("2");
  const [originationFee, setOriginationFee] = useState<string>("500");
  
  // Tab 2: Compare Options State
  const [compareAmount, setCompareAmount] = useState<string>("75000");
  const [compareRate, setCompareRate] = useState<string>("12");
  const [compareTerm, setCompareTerm] = useState<string>("36");
  
  // Tab 3: Simulator State
  const [creditLimit, setCreditLimit] = useState<string>("100000");
  const [initialDraw, setInitialDraw] = useState<string>("40000");
  const [monthlyPayment, setMonthlyPayment] = useState<string>("2000");
  const [simRate, setSimRate] = useState<string>("10");

  // Tab 1 Calculations
  const draw = parseFloat(drawAmount) || 0;
  const rate = parseFloat(interestRate) || 0;
  const term = parseInt(termMonths) || 12;
  const drawFeePercent = parseFloat(drawFee) || 0;
  const origFee = parseFloat(originationFee) || 0;
  
  const drawFeeAmount = draw * (drawFeePercent / 100);
  const totalFees = drawFeeAmount + origFee;
  
  const interestOnlyPayment = calculateInterestOnlyPayment(draw, rate);
  const amortizedPayment = calculateAmortizedPayment(draw, rate, term);
  
  const monthlyPaymentResult = paymentType === "interest" ? interestOnlyPayment : amortizedPayment;
  
  // Total interest calculation
  let totalInterest = 0;
  if (paymentType === "interest") {
    totalInterest = interestOnlyPayment * term; // Interest-only means you still owe principal at end
  } else {
    totalInterest = (amortizedPayment * term) - draw;
  }
  
  const totalCost = draw + totalInterest + totalFees;
  
  // Tab 2 Calculations
  const comp = parseFloat(compareAmount) || 0;
  const compRate = parseFloat(compareRate) || 0;
  const compTerm = parseInt(compareTerm) || 12;
  
  const ioPayment = calculateInterestOnlyPayment(comp, compRate);
  const piPayment = calculateAmortizedPayment(comp, compRate, compTerm);
  
  const ioTotalInterest = ioPayment * compTerm;
  const piTotalInterest = (piPayment * compTerm) - comp;
  
  // Tab 3 Calculations - Simple simulation
  const limit = parseFloat(creditLimit) || 100000;
  const initDraw = parseFloat(initialDraw) || 0;
  const simPayment = parseFloat(monthlyPayment) || 0;
  const simRateVal = parseFloat(simRate) || 0;
  
  // Simulate 12 months
  const simulateMonths = 12;
  const simData: Array<{ month: number; balance: number; available: number; interest: number; }> = [];
  let simBalance = initDraw;
  let simTotalInterest = 0;
  
  for (let m = 1; m <= simulateMonths; m++) {
    const monthInterest = simBalance * (simRateVal / 100 / 12);
    simTotalInterest += monthInterest;
    const principalPaid = Math.max(0, simPayment - monthInterest);
    simBalance = Math.max(0, simBalance - principalPaid);
    
    simData.push({
      month: m,
      balance: simBalance,
      available: limit - simBalance,
      interest: monthInterest
    });
  }

  const tabs = [
    { id: "payment", label: "Payment Calculator", icon: "💰" },
    { id: "compare", label: "Compare Options", icon: "⚖️" },
    { id: "simulator", label: "Credit Simulator", icon: "📊" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Business Line of Credit Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💼</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Business Line of Credit Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate monthly payments, total interest, and costs for your business line of credit. 
            Compare interest-only vs. principal & interest options and simulate credit usage.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#1E3A8A",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>LOC Payment Formula</p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Interest-Only:</strong> Balance × (APR ÷ 12)
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Example:</strong> $50,000 @ 10% = <strong>$416.67/mo</strong>
                </div>
              </div>
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
                backgroundColor: activeTab === tab.id ? "#1E3A8A" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#1E3A8A", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "payment" && "💰 Loan Details"}
                {activeTab === "compare" && "⚖️ Comparison Setup"}
                {activeTab === "simulator" && "📊 Credit Line Setup"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "550px", overflowY: "auto" }}>
              {/* PAYMENT CALCULATOR TAB */}
              {activeTab === "payment" && (
                <>
                  {/* Draw Amount */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Draw Amount ($)
                    </label>
                    <input
                      type="number"
                      value={drawAmount}
                      onChange={(e) => setDrawAmount(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[25000, 50000, 75000, 100000, 150000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setDrawAmount(amt.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: drawAmount === amt.toString() ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                            backgroundColor: drawAmount === amt.toString() ? "#EFF6FF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${(amt/1000)}K
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest Rate & Term */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Interest Rate (APR %)
                      </label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        step="0.1"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Repayment Term (months)
                      </label>
                      <select
                        value={termMonths}
                        onChange={(e) => setTermMonths(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {[6, 12, 18, 24, 36, 48, 60].map(m => (
                          <option key={m} value={m}>{m} months</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Payment Type
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setPaymentType("amortized")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: paymentType === "amortized" ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                          backgroundColor: paymentType === "amortized" ? "#EFF6FF" : "white",
                          color: paymentType === "amortized" ? "#1E3A8A" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          textAlign: "center"
                        }}
                      >
                        <span style={{ display: "block", fontWeight: "600" }}>Principal + Interest</span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>Pay off over term</span>
                      </button>
                      <button
                        onClick={() => setPaymentType("interest")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: paymentType === "interest" ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                          backgroundColor: paymentType === "interest" ? "#EFF6FF" : "white",
                          color: paymentType === "interest" ? "#1E3A8A" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          textAlign: "center"
                        }}
                      >
                        <span style={{ display: "block", fontWeight: "600" }}>Interest Only</span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>Lower payment, no principal</span>
                      </button>
                    </div>
                  </div>

                  {/* Fees */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>💵 Fees (Optional)</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Draw Fee (%)
                        </label>
                        <input
                          type="number"
                          value={drawFee}
                          onChange={(e) => setDrawFee(e.target.value)}
                          step="0.5"
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Origination Fee ($)
                        </label>
                        <input
                          type="number"
                          value={originationFee}
                          onChange={(e) => setOriginationFee(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* COMPARE OPTIONS TAB */}
              {activeTab === "compare" && (
                <>
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      💡 Compare interest-only vs. principal & interest payments to see which option fits your cash flow.
                    </p>
                  </div>

                  {/* Amount */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Draw Amount ($)
                    </label>
                    <input
                      type="number"
                      value={compareAmount}
                      onChange={(e) => setCompareAmount(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[50000, 75000, 100000, 150000, 200000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCompareAmount(amt.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: compareAmount === amt.toString() ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                            backgroundColor: compareAmount === amt.toString() ? "#EFF6FF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${(amt/1000)}K
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rate & Term */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Interest Rate (APR %)
                      </label>
                      <input
                        type="number"
                        value={compareRate}
                        onChange={(e) => setCompareRate(e.target.value)}
                        step="0.1"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Repayment Term (months)
                      </label>
                      <select
                        value={compareTerm}
                        onChange={(e) => setCompareTerm(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {[12, 18, 24, 36, 48, 60].map(m => (
                          <option key={m} value={m}>{m} months</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quick rate buttons */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "#6B7280" }}>Quick Rate Selection:</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[7, 10, 12, 15, 18, 20].map((r) => (
                        <button
                          key={r}
                          onClick={() => setCompareRate(r.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: compareRate === r.toString() ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                            backgroundColor: compareRate === r.toString() ? "#EFF6FF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {r}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* CREDIT SIMULATOR TAB */}
              {activeTab === "simulator" && (
                <>
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                      📈 See how your balance and available credit change over 12 months with regular payments.
                    </p>
                  </div>

                  {/* Credit Limit */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Credit Limit ($)
                    </label>
                    <input
                      type="number"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[50000, 100000, 150000, 200000, 250000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setCreditLimit(amt.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: creditLimit === amt.toString() ? "2px solid #1E3A8A" : "1px solid #E5E7EB",
                            backgroundColor: creditLimit === amt.toString() ? "#EFF6FF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${(amt/1000)}K
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Initial Draw */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Initial Draw Amount ($)
                    </label>
                    <input
                      type="number"
                      value={initialDraw}
                      onChange={(e) => setInitialDraw(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                      {initDraw > 0 && limit > 0 ? `${((initDraw / limit) * 100).toFixed(0)}% of credit limit` : ""}
                    </p>
                  </div>

                  {/* Monthly Payment & Rate */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Monthly Payment ($)
                      </label>
                      <input
                        type="number"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Interest Rate (APR %)
                      </label>
                      <input
                        type="number"
                        value={simRate}
                        onChange={(e) => setSimRate(e.target.value)}
                        step="0.1"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "payment" && "📊 Payment Summary"}
                {activeTab === "compare" && "⚖️ Comparison Results"}
                {activeTab === "simulator" && "📈 12-Month Projection"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* PAYMENT CALCULATOR RESULTS */}
              {activeTab === "payment" && (
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
                      Monthly Payment
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${monthlyPaymentResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {paymentType === "interest" ? "Interest-Only" : "Principal + Interest"} • {term} months
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Total Interest</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Total Fees</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${totalFees.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Draw Amount</span>
                        <span style={{ fontWeight: "600" }}>${draw.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Total Interest ({term} mo)</span>
                        <span style={{ fontWeight: "600" }}>${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                      {drawFeeAmount > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Draw Fee ({drawFeePercent}%)</span>
                          <span style={{ fontWeight: "600" }}>${drawFeeAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                      )}
                      {origFee > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Origination Fee</span>
                          <span style={{ fontWeight: "600" }}>${origFee.toLocaleString()}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Total Cost</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning for interest-only */}
                  {paymentType === "interest" && (
                    <div style={{ backgroundColor: "#FEF2F2", borderRadius: "10px", padding: "12px", border: "1px solid #FECACA" }}>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#DC2626" }}>
                        ⚠️ <strong>Note:</strong> With interest-only payments, you&apos;ll still owe the full ${draw.toLocaleString()} principal at the end of the term.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* COMPARE OPTIONS RESULTS */}
              {activeTab === "compare" && (
                <>
                  {/* Side by Side Comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    {/* Interest-Only */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "2px solid #F59E0B",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E", fontWeight: "600" }}>Interest-Only</p>
                      <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#B45309" }}>
                        ${ioPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#92400E" }}>/month</p>
                    </div>
                    
                    {/* P&I */}
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "2px solid #059669",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#065F46", fontWeight: "600" }}>Principal + Interest</p>
                      <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                        ${piPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#065F46" }}>/month</p>
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Detailed Comparison</h4>
                    <table style={{ width: "100%", fontSize: "0.8rem" }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", padding: "8px 4px", borderBottom: "1px solid #D1D5DB" }}></th>
                          <th style={{ textAlign: "right", padding: "8px 4px", borderBottom: "1px solid #D1D5DB", color: "#B45309" }}>Interest-Only</th>
                          <th style={{ textAlign: "right", padding: "8px 4px", borderBottom: "1px solid #D1D5DB", color: "#059669" }}>P&I</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "8px 4px", color: "#4B5563" }}>Monthly Payment</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600" }}>${ioPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600" }}>${piPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr style={{ backgroundColor: "white" }}>
                          <td style={{ padding: "8px 4px", color: "#4B5563" }}>Total Interest</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600" }}>${ioTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600" }}>${piTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "8px 4px", color: "#4B5563" }}>Principal Owed at End</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600", color: "#DC2626" }}>${comp.toLocaleString()}</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "600", color: "#059669" }}>$0</td>
                        </tr>
                        <tr style={{ backgroundColor: "white" }}>
                          <td style={{ padding: "8px 4px", color: "#4B5563", fontWeight: "600" }}>Total Paid</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "bold" }}>${(ioTotalInterest + comp).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                          <td style={{ padding: "8px 4px", textAlign: "right", fontWeight: "bold" }}>${(piPayment * compTerm).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Recommendation */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                      💡 <strong>P&I saves ${(ioTotalInterest - piTotalInterest).toLocaleString(undefined, { maximumFractionDigits: 0 })} in interest</strong>, 
                      but requires ${(piPayment - ioPayment).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo more. 
                      Choose interest-only if you need lower payments short-term.
                    </p>
                  </div>
                </>
              )}

              {/* CREDIT SIMULATOR RESULTS */}
              {activeTab === "simulator" && (
                <>
                  {/* Summary Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#065F46" }}>Balance After 12 Mo</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                        ${simData[simData.length - 1]?.balance.toLocaleString(undefined, { maximumFractionDigits: 0 }) || 0}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: "#EFF6FF",
                      borderRadius: "10px",
                      padding: "12px",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Available Credit</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                        ${simData[simData.length - 1]?.available.toLocaleString(undefined, { maximumFractionDigits: 0 }) || limit}
                      </p>
                    </div>
                  </div>

                  {/* Total Interest */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", marginBottom: "16px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Total Interest Paid (12 mo)</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>
                      ${simTotalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  {/* Monthly Progress Table */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Monthly Breakdown</h4>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      <table style={{ width: "100%", fontSize: "0.75rem" }}>
                        <thead>
                          <tr style={{ position: "sticky", top: 0, backgroundColor: "#F3F4F6" }}>
                            <th style={{ textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #D1D5DB" }}>Month</th>
                            <th style={{ textAlign: "right", padding: "6px 4px", borderBottom: "1px solid #D1D5DB" }}>Interest</th>
                            <th style={{ textAlign: "right", padding: "6px 4px", borderBottom: "1px solid #D1D5DB" }}>Balance</th>
                            <th style={{ textAlign: "right", padding: "6px 4px", borderBottom: "1px solid #D1D5DB" }}>Available</th>
                          </tr>
                        </thead>
                        <tbody>
                          {simData.map((row, idx) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "transparent" }}>
                              <td style={{ padding: "6px 4px" }}>{row.month}</td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "#B45309" }}>${row.interest.toFixed(0)}</td>
                              <td style={{ padding: "6px 4px", textAlign: "right", fontWeight: "600" }}>${row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                              <td style={{ padding: "6px 4px", textAlign: "right", color: "#059669" }}>${row.available.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Credit Usage</p>
                    <div style={{ backgroundColor: "#E5E7EB", borderRadius: "8px", height: "24px", overflow: "hidden", position: "relative" }}>
                      <div style={{
                        backgroundColor: "#059669",
                        height: "100%",
                        width: `${((simData[simData.length - 1]?.balance || initDraw) / limit) * 100}%`,
                        transition: "width 0.3s"
                      }} />
                      <span style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "#374151"
                      }}>
                        {(((simData[simData.length - 1]?.balance || initDraw) / limit) * 100).toFixed(0)}% used
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rate Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E3A8A", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Business Line of Credit Rate Guide</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Lender Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>APR Range</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Credit Limit</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Min Credit Score</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Funding Speed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Traditional Bank", apr: "7% - 12%", limit: "$50K - $250K+", score: "680+", speed: "2-4 weeks" },
                  { type: "Credit Union", apr: "6% - 10%", limit: "$25K - $100K", score: "660+", speed: "1-3 weeks" },
                  { type: "Online Lender", apr: "12% - 25%", limit: "$10K - $250K", score: "600+", speed: "1-3 days" },
                  { type: "SBA Line of Credit", apr: "7% - 10%", limit: "$50K - $500K", score: "680+", speed: "3-6 weeks" },
                  { type: "Fintech/Alternative", apr: "15% - 40%", limit: "$5K - $100K", score: "550+", speed: "Same day" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.type}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>{row.apr}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.limit}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.score}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Rates and terms vary based on creditworthiness, revenue, and business history. As of 2024-2025.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💼 Understanding Business Lines of Credit</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>How It Works</h3>
                <p>
                  A business line of credit is revolving credit—you&apos;re approved for a maximum limit and can draw 
                  funds as needed. Unlike a term loan, you only pay interest on what you borrow, not the full 
                  limit. As you repay, that credit becomes available again. This makes it ideal for managing 
                  cash flow gaps, inventory purchases, or unexpected expenses.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Interest-Only vs. Principal & Interest</h3>
                <p>
                  Many lines of credit offer a &quot;draw period&quot; (often 1-2 years) where you can make interest-only 
                  payments. This keeps payments low but doesn&apos;t reduce your balance. After the draw period, 
                  you enter the &quot;repayment period&quot; with higher P&I payments. Some lenders require P&I from 
                  day one. Interest-only is great for short-term needs; P&I builds equity faster.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Fees to Watch For</h3>
                <p>
                  Beyond interest, watch for: <strong>Draw fees</strong> (1-3% per withdrawal), 
                  <strong>origination fees</strong> (0-2% upfront), <strong>annual/monthly maintenance fees</strong>, 
                  and <strong>inactivity fees</strong> if you don&apos;t use the line. Factor these into your total 
                  cost when comparing offers. A lower rate with high fees may cost more than a higher rate with none.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#1E3A8A", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📐 Quick Payment Examples</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>$50K @ 10%:</strong> $417/mo (I/O)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>$75K @ 12%:</strong> $750/mo (I/O)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>$100K @ 8%:</strong> $667/mo (I/O)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>$100K @ 8% 24mo:</strong> $4,523/mo (P&I)</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  I/O = Interest-Only • P&I = Principal + Interest
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ Best Uses</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.7" }}>
                <li>Managing cash flow gaps</li>
                <li>Seasonal inventory purchases</li>
                <li>Covering payroll timing</li>
                <li>Emergency business expenses</li>
                <li>Short-term growth projects</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/business-line-of-credit-calculator" currentCategory="Finance" />
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
            💼 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Actual rates, fees, and terms vary by lender and depend on your creditworthiness and business profile. 
            Always review loan documents carefully before accepting any financing offer.
          </p>
        </div>
      </div>
    </div>
  );
}