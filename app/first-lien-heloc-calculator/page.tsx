"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "Is a First Lien HELOC a good idea?",
    answer: "A First Lien HELOC can be an excellent choice for financially disciplined homeowners with positive monthly cash flow. It works best if you have significant home equity, consistent income, and can commit to using the velocity banking strategy. The key advantage is that your money works harder - every dollar deposited reduces your principal immediately, lowering daily interest calculations. However, it requires discipline to avoid overspending and comes with variable interest rate risk."
  },
  {
    question: "How is First Lien HELOC interest calculated?",
    answer: "First Lien HELOC interest is calculated daily based on your average daily balance, unlike traditional mortgages that use monthly amortization. This means when you deposit your paycheck, your balance drops immediately, reducing interest charges from that day forward. For example, if your balance is $200,000 at 8% APR, daily interest is about $43.84. But if you deposit $5,000, your new daily interest drops to $42.74. This daily calculation is why velocity banking works - every dollar saved reduces interest immediately."
  },
  {
    question: "What is the monthly payment on a $100,000 HELOC?",
    answer: "For a $100,000 HELOC at 8.5% APR, the interest-only payment during the draw period would be approximately $708/month. During the repayment period (typically 20 years), the principal and interest payment would be around $868/month. However, with a First Lien HELOC using velocity banking, you're encouraged to pay more than the minimum, applying your entire cash flow surplus to accelerate payoff and reduce total interest costs significantly."
  },
  {
    question: "What is the current interest rate on a First Lien HELOC?",
    answer: "First Lien HELOC rates are variable and typically tied to the Prime Rate plus a margin. As of 2024-2025, rates generally range from 7.5% to 10.5% depending on your credit score, loan-to-value ratio, and lender. While these rates appear higher than traditional mortgage rates (which might be 6-7%), the daily interest calculation method and velocity banking strategy often result in paying significantly less total interest over the life of the loan."
  },
  {
    question: "How does velocity banking work with a First Lien HELOC?",
    answer: "Velocity banking uses a First Lien HELOC as an 'all-in-one' account where your income is deposited directly into the HELOC, immediately reducing your principal balance. You then use the HELOC for daily expenses. The key is maintaining positive cash flow - the difference between income and expenses continuously pays down principal. Because interest is calculated on daily balance, keeping your balance low throughout the month dramatically reduces total interest paid, often cutting a 30-year mortgage payoff to 5-10 years."
  },
  {
    question: "Can I use a First Lien HELOC to pay off my mortgage faster?",
    answer: "Yes, this is one of the primary uses of a First Lien HELOC. By refinancing your existing mortgage into a First Lien HELOC and implementing velocity banking, many homeowners pay off their homes in 7-12 years instead of 30. The strategy works because: 1) Daily interest calculation rewards any principal reduction immediately, 2) Your entire income temporarily reduces the balance each month, 3) You only pay interest on what you actually owe each day, not on a fixed amortization schedule that front-loads interest."
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
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

// Format currency with full precision
function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function FirstLienHelocCalculator() {
  const [activeTab, setActiveTab] = useState<'payment' | 'compare' | 'payoff'>('payment');

  // Tab 1: HELOC Payment Calculator
  const [helocAmount, setHelocAmount] = useState<string>("250000");
  const [helocRate, setHelocRate] = useState<string>("8.5");
  const [drawPeriod, setDrawPeriod] = useState<string>("10");
  const [repaymentPeriod, setRepaymentPeriod] = useState<string>("20");

  // Tab 2: HELOC vs Mortgage Comparison
  const [mortgageBalance, setMortgageBalance] = useState<string>("300000");
  const [mortgageRate, setMortgageRate] = useState<string>("6.5");
  const [mortgageYearsLeft, setMortgageYearsLeft] = useState<string>("25");
  const [compareHelocRate, setCompareHelocRate] = useState<string>("8.5");
  const [monthlyIncome, setMonthlyIncome] = useState<string>("8000");
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("4000");

  // Tab 3: Payoff Calculator
  const [currentBalance, setCurrentBalance] = useState<string>("200000");
  const [payoffRate, setPayoffRate] = useState<string>("8.5");
  const [currentPayment, setCurrentPayment] = useState<string>("1500");
  const [extraPayment, setExtraPayment] = useState<string>("500");

  // Tab 1 Calculations - HELOC Payment
  const paymentResults = useMemo(() => {
    const principal = parseFloat(helocAmount) || 0;
    const annualRate = parseFloat(helocRate) || 0;
    const monthlyRate = annualRate / 100 / 12;
    const drawYears = parseInt(drawPeriod) || 10;
    const repayYears = parseInt(repaymentPeriod) || 20;
    const repayMonths = repayYears * 12;

    // Interest-only payment during draw period
    const interestOnlyPayment = principal * monthlyRate;

    // P&I payment during repayment period
    const piPayment = repayMonths > 0 
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, repayMonths)) / (Math.pow(1 + monthlyRate, repayMonths) - 1)
      : 0;

    // Total interest during draw period (interest only)
    const drawPeriodInterest = interestOnlyPayment * drawYears * 12;

    // Total interest during repayment period
    const totalRepayments = piPayment * repayMonths;
    const repayPeriodInterest = totalRepayments - principal;

    // Total interest over life of loan
    const totalInterest = drawPeriodInterest + repayPeriodInterest;
    const totalCost = principal + totalInterest;

    return {
      principal,
      interestOnlyPayment,
      piPayment,
      drawPeriodInterest,
      repayPeriodInterest,
      totalInterest,
      totalCost,
      drawYears,
      repayYears,
      totalYears: drawYears + repayYears
    };
  }, [helocAmount, helocRate, drawPeriod, repaymentPeriod]);

  // Tab 2 Calculations - HELOC vs Mortgage Comparison
  const compareResults = useMemo(() => {
    const balance = parseFloat(mortgageBalance) || 0;
    const mortRate = parseFloat(mortgageRate) || 0;
    const yearsLeft = parseInt(mortgageYearsLeft) || 25;
    const helocRateVal = parseFloat(compareHelocRate) || 0;
    const income = parseFloat(monthlyIncome) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;

    // Monthly cash flow (surplus after expenses, excluding mortgage)
    const monthlyCashFlow = income - expenses;

    // Traditional Mortgage calculations
    const mortMonthlyRate = mortRate / 100 / 12;
    const mortMonths = yearsLeft * 12;
    const mortPayment = mortMonths > 0 && mortMonthlyRate > 0
      ? (balance * mortMonthlyRate * Math.pow(1 + mortMonthlyRate, mortMonths)) / (Math.pow(1 + mortMonthlyRate, mortMonths) - 1)
      : 0;
    const mortTotalPayments = mortPayment * mortMonths;
    const mortTotalInterest = mortTotalPayments - balance;

    // First Lien HELOC with Velocity Banking
    // Simplified calculation: using cash flow surplus to pay down principal
    const helocMonthlyRate = helocRateVal / 100 / 12;
    const dailyRate = helocRateVal / 100 / 365;
    
    // Calculate HELOC payoff with velocity banking
    // Each month: deposit income, pay expenses throughout month, end with surplus paying principal
    let helocBalance = balance;
    let helocTotalInterest = 0;
    let helocMonths = 0;
    const maxMonths = 360; // 30 years max

    // Average daily balance approximation for velocity banking
    // Income comes in, expenses go out throughout month
    // Average balance is reduced by ~half the cash flow for interest calculation
    while (helocBalance > 0 && helocMonths < maxMonths) {
      // Simplified: average daily balance is current balance minus half of cash flow
      const avgDailyBalance = Math.max(helocBalance - (monthlyCashFlow * 0.5), 0);
      const monthlyInterest = avgDailyBalance * helocMonthlyRate;
      
      // Principal reduction is cash flow minus interest
      const principalReduction = Math.max(monthlyCashFlow - monthlyInterest, 0);
      
      helocTotalInterest += monthlyInterest;
      helocBalance = Math.max(helocBalance - principalReduction, 0);
      helocMonths++;

      // Safety check for no progress
      if (principalReduction <= 0 && helocBalance > 0) {
        helocMonths = maxMonths; // Not viable
        break;
      }
    }

    const helocYears = helocMonths / 12;
    const helocTotalCost = balance + helocTotalInterest;
    const mortTotalCost = balance + mortTotalInterest;

    // Savings
    const interestSaved = mortTotalInterest - helocTotalInterest;
    const yearsSaved = yearsLeft - helocYears;

    // Is HELOC viable?
    const isViable = helocMonths < maxMonths && monthlyCashFlow > 0;

    return {
      // Mortgage
      mortPayment,
      mortTotalInterest,
      mortTotalCost,
      mortYears: yearsLeft,
      // HELOC
      helocYears: Math.round(helocYears * 10) / 10,
      helocTotalInterest,
      helocTotalCost,
      helocMinPayment: balance * helocMonthlyRate, // Interest only
      // Comparison
      monthlyCashFlow,
      interestSaved,
      yearsSaved: Math.round(yearsSaved * 10) / 10,
      isViable,
      balance
    };
  }, [mortgageBalance, mortgageRate, mortgageYearsLeft, compareHelocRate, monthlyIncome, monthlyExpenses]);

  // Tab 3 Calculations - Payoff with Extra Payments
  const payoffResults = useMemo(() => {
    const balance = parseFloat(currentBalance) || 0;
    const rate = parseFloat(payoffRate) || 0;
    const payment = parseFloat(currentPayment) || 0;
    const extra = parseFloat(extraPayment) || 0;
    const monthlyRate = rate / 100 / 12;

    // Original payoff (current payment only)
    let origBalance = balance;
    let origMonths = 0;
    let origInterest = 0;
    const maxMonths = 360;

    while (origBalance > 0 && origMonths < maxMonths) {
      const interest = origBalance * monthlyRate;
      const principal = Math.min(payment - interest, origBalance);
      if (principal <= 0) {
        origMonths = maxMonths;
        break;
      }
      origInterest += interest;
      origBalance -= principal;
      origMonths++;
    }

    // New payoff (with extra payment)
    let newBalance = balance;
    let newMonths = 0;
    let newInterest = 0;
    const totalPayment = payment + extra;

    while (newBalance > 0 && newMonths < maxMonths) {
      const interest = newBalance * monthlyRate;
      const principal = Math.min(totalPayment - interest, newBalance);
      if (principal <= 0) {
        newMonths = maxMonths;
        break;
      }
      newInterest += interest;
      newBalance -= principal;
      newMonths++;
    }

    const monthsSaved = origMonths - newMonths;
    const interestSaved = origInterest - newInterest;

    return {
      origMonths,
      origYears: Math.round((origMonths / 12) * 10) / 10,
      origInterest,
      origTotalCost: balance + origInterest,
      newMonths,
      newYears: Math.round((newMonths / 12) * 10) / 10,
      newInterest,
      newTotalCost: balance + newInterest,
      monthsSaved,
      yearsSaved: Math.round((monthsSaved / 12) * 10) / 10,
      interestSaved,
      totalPayment,
      isViable: origMonths < maxMonths && newMonths < maxMonths
    };
  }, [currentBalance, payoffRate, currentPayment, extraPayment]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>First Lien HELOC Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              First Lien HELOC Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator to compare First Lien HELOC vs traditional mortgage. See how velocity banking 
            can help you pay off your home faster and save thousands in interest. No signup required.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EEF2FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #C7D2FE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#4338CA", margin: "0 0 4px 0" }}>
                First Lien HELOC uses <strong>daily interest calculation</strong> vs mortgage&apos;s monthly amortization
              </p>
              <p style={{ color: "#6366F1", margin: 0, fontSize: "0.95rem" }}>
                With velocity banking, homeowners often pay off their homes in 7-12 years instead of 30 years
              </p>
            </div>
          </div>
        </div>

        {/* Features Badge */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#ECFDF5",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #6EE7B7"
          }}>
            <span>✓</span>
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>HELOC vs Mortgage</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EEF2FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #C7D2FE"
          }}>
            <span>✓</span>
            <span style={{ color: "#4338CA", fontWeight: "600", fontSize: "0.85rem" }}>Velocity Banking</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#FEF3C7",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #FCD34D"
          }}>
            <span>✓</span>
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Payoff Calculator</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("payment")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "payment" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "payment" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💵 HELOC Payment
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "compare" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "compare" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚖️ HELOC vs Mortgage
          </button>
          <button
            onClick={() => setActiveTab("payoff")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "payoff" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "payoff" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🚀 Payoff Calculator
          </button>
        </div>

        {/* Tab 1: HELOC Payment Calculator */}
        {activeTab === "payment" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💵 HELOC Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* HELOC Amount */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    HELOC Amount
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={helocAmount}
                      onChange={(e) => setHelocAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "2px solid #4F46E5",
                        fontSize: "1rem",
                        backgroundColor: "#EEF2FF",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Interest Rate (APR)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      step="0.1"
                      value={helocRate}
                      onChange={(e) => setHelocRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                  </div>
                </div>

                {/* Draw Period */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Draw Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["5", "10", "15"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setDrawPeriod(y)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: drawPeriod === y ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: drawPeriod === y ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: drawPeriod === y ? "600" : "normal"
                        }}
                      >
                        {y} Years
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Interest-only payments during this period
                  </p>
                </div>

                {/* Repayment Period */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Repayment Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["10", "15", "20"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setRepaymentPeriod(y)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: repaymentPeriod === y ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: repaymentPeriod === y ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: repaymentPeriod === y ? "600" : "normal"
                        }}
                      >
                        {y} Years
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Principal + Interest payments during this period
                  </p>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Most First Lien HELOCs have a 10-year draw period with interest-only payments, 
                    followed by a 20-year repayment period.
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Payment Breakdown
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Payment Summary */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#4338CA" }}>Draw Period Payment</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#4F46E5" }}>
                      {formatMoney(paymentResults.interestOnlyPayment)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6366F1" }}>Interest Only</p>
                  </div>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#065F46" }}>Repayment Period</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatMoney(paymentResults.piPayment)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#047857" }}>Principal + Interest</p>
                  </div>
                </div>

                {/* Loan Details */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Loan Summary
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Loan Amount</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(paymentResults.principal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Total Loan Term</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{paymentResults.totalYears} years</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Draw Period Interest</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(paymentResults.drawPeriodInterest)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Repayment Period Interest</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(paymentResults.repayPeriodInterest)}</span>
                    </div>
                  </div>
                </div>

                {/* Total Cost */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #FECACA"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#991B1B", fontWeight: "600" }}>Total Interest</span>
                    <span style={{ color: "#DC2626", fontWeight: "bold", fontSize: "1.25rem" }}>{formatCurrency(paymentResults.totalInterest)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#991B1B", fontWeight: "600" }}>Total Cost (Principal + Interest)</span>
                    <span style={{ color: "#DC2626", fontWeight: "bold", fontSize: "1.25rem" }}>{formatCurrency(paymentResults.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: HELOC vs Mortgage Comparison */}
        {activeTab === "compare" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚖️ Compare Your Options
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Current Mortgage Section */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#374151", fontWeight: "600", borderBottom: "2px solid #E5E7EB", paddingBottom: "8px" }}>
                    🏦 Your Current Mortgage
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Remaining Balance
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={mortgageBalance}
                        onChange={(e) => setMortgageBalance(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Interest Rate
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          step="0.1"
                          value={mortgageRate}
                          onChange={(e) => setMortgageRate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            paddingRight: "30px",
                            borderRadius: "6px",
                            border: "1px solid #D1D5DB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.9rem" }}>%</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Years Remaining
                      </label>
                      <input
                        type="number"
                        value={mortgageYearsLeft}
                        onChange={(e) => setMortgageYearsLeft(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* First Lien HELOC Section */}
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#374151", fontWeight: "600", borderBottom: "2px solid #E5E7EB", paddingBottom: "8px" }}>
                    🏠 First Lien HELOC
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      HELOC Interest Rate
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.1"
                        value={compareHelocRate}
                        onChange={(e) => setCompareHelocRate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          paddingRight: "30px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.9rem" }}>%</span>
                    </div>
                  </div>
                </div>

                {/* Cash Flow Section */}
                <div style={{ 
                  backgroundColor: "#ECFDF5", 
                  borderRadius: "12px", 
                  padding: "16px",
                  border: "1px solid #6EE7B7"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#065F46", fontWeight: "600" }}>
                    💰 Your Monthly Cash Flow
                  </h3>
                  <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", color: "#047857" }}>
                    This is key to velocity banking success
                  </p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#065F46", marginBottom: "6px", fontWeight: "600" }}>
                        Monthly Income
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 10px 10px 24px",
                            borderRadius: "6px",
                            border: "1px solid #6EE7B7",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#065F46", marginBottom: "6px", fontWeight: "600" }}>
                        Monthly Expenses
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={monthlyExpenses}
                          onChange={(e) => setMonthlyExpenses(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 10px 10px 24px",
                            borderRadius: "6px",
                            border: "1px solid #6EE7B7",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                    <strong>Note:</strong> Expenses should NOT include your mortgage payment
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Comparison Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Cash Flow Display */}
                <div style={{
                  backgroundColor: compareResults.monthlyCashFlow > 0 ? "#ECFDF5" : "#FEF2F2",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: compareResults.monthlyCashFlow > 0 ? "2px solid #6EE7B7" : "2px solid #FECACA"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: compareResults.monthlyCashFlow > 0 ? "#065F46" : "#991B1B" }}>
                    Your Monthly Cash Flow Surplus
                  </p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: compareResults.monthlyCashFlow > 0 ? "#059669" : "#DC2626" }}>
                    {formatMoney(compareResults.monthlyCashFlow)}
                  </p>
                </div>

                {/* Savings Highlight */}
                {compareResults.isViable && compareResults.interestSaved > 0 && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #FCD34D"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#92400E" }}>
                      🎉 With First Lien HELOC + Velocity Banking
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "2.5rem", fontWeight: "bold", color: "#D97706" }}>
                      Save {formatCurrency(compareResults.interestSaved)}
                    </p>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#B45309" }}>
                      Pay off home in <strong>{compareResults.helocYears} years</strong> instead of {compareResults.mortYears} years
                    </p>
                  </div>
                )}

                {/* Comparison Table */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Side-by-Side Comparison
                  </h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #E5E7EB" }}>Metric</th>
                          <th style={{ padding: "10px", textAlign: "right", borderBottom: "2px solid #E5E7EB", backgroundColor: "#FEF2F2", color: "#991B1B" }}>Mortgage</th>
                          <th style={{ padding: "10px", textAlign: "right", borderBottom: "2px solid #E5E7EB", backgroundColor: "#ECFDF5", color: "#065F46" }}>First Lien HELOC</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>Payoff Time</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{compareResults.mortYears} years</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#059669" }}>
                            {compareResults.isViable ? `${compareResults.helocYears} years` : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>Total Interest</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#DC2626" }}>{formatCurrency(compareResults.mortTotalInterest)}</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#059669" }}>
                            {compareResults.isViable ? formatCurrency(compareResults.helocTotalInterest) : "N/A"}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>Total Cost</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.mortTotalCost)}</td>
                          <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#059669" }}>
                            {compareResults.isViable ? formatCurrency(compareResults.helocTotalCost) : "N/A"}
                          </td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "10px", fontWeight: "600" }}>Interest Calculation</td>
                          <td style={{ padding: "10px", textAlign: "right" }}>Monthly (Amortized)</td>
                          <td style={{ padding: "10px", textAlign: "right", color: "#059669", fontWeight: "600" }}>Daily (Simple)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Warning if not viable */}
                {!compareResults.isViable && (
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #FECACA"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                      ⚠️ <strong>Note:</strong> With your current cash flow, a First Lien HELOC may not provide significant benefits. 
                      Consider increasing income or reducing expenses for velocity banking to work effectively.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Payoff Calculator */}
        {activeTab === "payoff" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🚀 Accelerate Your Payoff
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Current Balance */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Current HELOC Balance
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "2px solid #4F46E5",
                        fontSize: "1rem",
                        backgroundColor: "#EEF2FF",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Interest Rate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Interest Rate (APR)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      step="0.1"
                      value={payoffRate}
                      onChange={(e) => setPayoffRate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                  </div>
                </div>

                {/* Current Payment */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Current Monthly Payment
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={currentPayment}
                      onChange={(e) => setCurrentPayment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Extra Payment */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #6EE7B7"
                }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#065F46", marginBottom: "8px", fontWeight: "600" }}>
                    💪 Extra Monthly Payment
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={extraPayment}
                      onChange={(e) => setExtraPayment(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "2px solid #059669",
                        fontSize: "1rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                    How much extra can you pay each month?
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Payoff Comparison
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Savings Highlight */}
                {payoffResults.isViable && payoffResults.interestSaved > 0 && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #FCD34D"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#92400E" }}>
                      🎉 By adding {formatMoney(parseFloat(extraPayment) || 0)}/month
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>
                      Save {formatCurrency(payoffResults.interestSaved)}
                    </p>
                    <p style={{ margin: 0, fontSize: "1rem", color: "#B45309" }}>
                      Pay off <strong>{payoffResults.yearsSaved} years faster</strong>
                    </p>
                  </div>
                )}

                {/* Comparison Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid #FECACA"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#991B1B", fontWeight: "600" }}>Without Extra Payment</p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>
                      {payoffResults.origYears} years
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#B91C1C" }}>
                      Interest: {formatCurrency(payoffResults.origInterest)}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.8rem", color: "#065F46", fontWeight: "600" }}>With Extra Payment</p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      {payoffResults.newYears} years
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>
                      Interest: {formatCurrency(payoffResults.newInterest)}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Payment Details
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Current Payment</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatMoney(parseFloat(currentPayment) || 0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                      <span style={{ color: "#065F46" }}>New Total Payment</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{formatMoney(payoffResults.totalPayment)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Months Saved</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{payoffResults.monthsSaved} months</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <span style={{ color: "#92400E", fontWeight: "600" }}>Interest Saved</span>
                      <span style={{ fontWeight: "bold", color: "#D97706" }}>{formatCurrency(payoffResults.interestSaved)}</span>
                    </div>
                  </div>
                </div>

                {/* Tip */}
                <div style={{
                  backgroundColor: "#EEF2FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C7D2FE"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                    💡 <strong>Pro Tip:</strong> With velocity banking, every dollar of your income temporarily reduces your balance, 
                    further cutting interest costs beyond what&apos;s shown here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 What is a First Lien HELOC?</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A <strong>First Lien HELOC</strong> (Home Equity Line of Credit) is a unique financial product that 
                  combines a traditional mortgage with a flexible line of credit. Unlike a standard HELOC that sits 
                  in second position behind your mortgage, a First Lien HELOC <em>replaces</em> your primary mortgage, 
                  becoming the first (and only) lien on your property.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Does Velocity Banking Work?</h3>
                <p>
                  Velocity banking leverages the First Lien HELOC&apos;s daily interest calculation to your advantage. 
                  Here&apos;s the strategy: your paycheck is deposited directly into the HELOC, immediately reducing your 
                  principal balance. Throughout the month, you pay expenses from this account. Any surplus at month-end 
                  permanently reduces your loan balance.
                </p>

                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #C7D2FE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#4338CA" }}>📊 Why Daily Interest Calculation Matters</p>
                  <p style={{ margin: 0, color: "#6366F1", fontSize: "0.95rem" }}>
                    <strong>Traditional Mortgage:</strong> Interest calculated monthly on original amortization schedule<br />
                    <strong>First Lien HELOC:</strong> Interest calculated daily on actual balance<br /><br />
                    When your $8,000 paycheck hits your account, your balance drops immediately. Even if you spend 
                    $6,000 throughout the month, you&apos;ve had a lower average daily balance, paying less interest.
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Who Should Consider a First Lien HELOC?</h3>
                <p>
                  This strategy works best for homeowners who have <strong>positive monthly cash flow</strong> (income 
                  exceeds expenses), <strong>financial discipline</strong> to avoid overspending on the credit line, 
                  and <strong>significant home equity</strong> (typically 20%+ to qualify). It&apos;s not recommended for 
                  those living paycheck-to-paycheck or prone to credit line overspending.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Potential Risks to Consider</h3>
                <p>
                  First Lien HELOCs come with <strong>variable interest rates</strong> that can rise with market conditions. 
                  There&apos;s also the risk of <strong>overleveraging</strong> – since you can draw on the equity, 
                  undisciplined borrowers might increase their debt. Finally, some HELOCs have <strong>balloon payments</strong> 
                  at the end of the draw period, requiring refinancing or full payoff.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Benefits */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>✅ Key Benefits</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Pay off home in 7-12 years</p>
                <p style={{ margin: 0 }}>• Save tens of thousands in interest</p>
                <p style={{ margin: 0 }}>• Daily interest calculation</p>
                <p style={{ margin: 0 }}>• Access to equity when needed</p>
                <p style={{ margin: 0 }}>• One account for mortgage + banking</p>
              </div>
            </div>

            {/* Typical Rates */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4338CA", marginBottom: "12px" }}>📊 Current Rates (2025)</h3>
              <div style={{ fontSize: "0.9rem", color: "#6366F1", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>First Lien HELOC:</strong> 7.5% - 10.5%</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Traditional Mortgage:</strong> 6.0% - 7.5%</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#818CF8" }}>
                  *Rates vary by credit score, LTV, and lender
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>📋 Typical Requirements</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Credit Score: 680+ (700+ preferred)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Home Equity: 20%+ minimum</p>
                <p style={{ margin: "0 0 8px 0" }}>• DTI Ratio: Under 43%</p>
                <p style={{ margin: 0 }}>• Stable Income History</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/first-lien-heloc-calculator" currentCategory="Finance" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Actual results depend on specific lender terms, market conditions, your financial situation, and 
            disciplined execution of the velocity banking strategy. Interest rates are variable and may change. 
            Consult with a qualified mortgage professional before making financial decisions. This is not 
            financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}