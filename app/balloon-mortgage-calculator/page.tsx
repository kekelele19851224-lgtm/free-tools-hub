"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 摊销期选项
const amortizationOptions = [
  { value: 15, label: "15 years" },
  { value: 20, label: "20 years" },
  { value: 25, label: "25 years" },
  { value: 30, label: "30 years" }
];

// 气球到期选项
const balloonOptions = [
  { value: 3, label: "3 years" },
  { value: 5, label: "5 years" },
  { value: 7, label: "7 years" },
  { value: 10, label: "10 years" },
  { value: 15, label: "15 years" }
];

// FAQ数据
const faqs = [
  {
    question: "Is a balloon mortgage a good idea?",
    answer: "A balloon mortgage can be a good idea in specific situations: if you plan to sell the property before the balloon payment is due, expect a significant income increase, or are using short-term financing for investment properties. However, they carry significant risk—if you can't make the balloon payment, refinance, or sell, you could lose your home. They're best suited for experienced investors or borrowers with clear exit strategies."
  },
  {
    question: "How to calculate a balloon mortgage?",
    answer: "To calculate a balloon mortgage: 1) Determine your monthly payment using the amortization period (e.g., 30 years) even though your loan term is shorter (e.g., 5 years). 2) Calculate how much principal you'll pay off during the balloon period. 3) The remaining balance is your balloon payment. Formula: Monthly Payment = P × [r(1+r)^n] / [(1+r)^n-1], where P = principal, r = monthly rate, n = total months in amortization period."
  },
  {
    question: "What is a 30 year mortgage with a 15 year balloon?",
    answer: "A '30 due in 15' balloon mortgage means your monthly payments are calculated as if you're paying off the loan over 30 years, but the entire remaining balance is due after 15 years. This results in lower monthly payments than a standard 15-year mortgage, but you'll owe a large lump sum at the end. For example, on a $300,000 loan at 6%, your monthly payment would be about $1,799, but after 15 years you'd still owe approximately $199,000 as a balloon payment."
  },
  {
    question: "What happens if I pay extra on my balloon mortgage?",
    answer: "Extra payments on a balloon mortgage reduce your principal balance, which directly reduces your balloon payment amount. For example, paying an extra $200/month on a $300,000 loan could reduce your balloon payment by $15,000-$25,000 over 5-7 years. Extra payments also reduce total interest paid. However, confirm with your lender that extra payments apply to principal and there are no prepayment penalties."
  },
  {
    question: "Can I refinance a balloon mortgage before it's due?",
    answer: "Yes, refinancing before the balloon payment is due is one of the most common exit strategies. You can refinance into a traditional 30-year fixed mortgage, another balloon mortgage, or an ARM. However, refinancing depends on: your credit score at the time, home equity, current interest rates, and ability to qualify. It's wise to start the refinancing process 6-12 months before your balloon payment is due."
  }
];

// FAQ组件
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

export default function BalloonMortgageCalculator() {
  // 输入状态
  const [loanAmount, setLoanAmount] = useState<string>("300000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [amortizationYears, setAmortizationYears] = useState<number>(30);
  const [balloonYears, setBalloonYears] = useState<number>(5);
  const [paymentType, setPaymentType] = useState<string>("amortized");
  const [extraPayment, setExtraPayment] = useState<string>("0");
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // 结果
  const [results, setResults] = useState<{
    monthlyPayment: number;
    balloonPayment: number;
    totalInterest: number;
    totalPayments: number;
    principalPaid: number;
    interestPaid: number;
    schedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      extraPmt: number;
      balance: number;
    }>;
    comparison: {
      fixed30Monthly: number;
      fixed30TotalInterest: number;
    };
  } | null>(null);

  // 计算
  const calculate = () => {
    const P = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) / 100 || 0;
    const r = annualRate / 12; // 月利率
    const n = amortizationYears * 12; // 摊销总月数
    const balloonMonths = balloonYears * 12; // 气球到期月数
    const extra = parseFloat(extraPayment) || 0;

    if (P <= 0 || annualRate <= 0) {
      alert("Please enter valid loan amount and interest rate");
      return;
    }

    let monthlyPayment: number;
    let schedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      extraPmt: number;
      balance: number;
    }> = [];

    if (paymentType === "amortized") {
      // 本息还款：PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
      monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      // 仅利息
      monthlyPayment = P * r;
    }

    // 生成还款计划
    let balance = P;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    for (let month = 1; month <= balloonMonths && balance > 0; month++) {
      const interestPayment = balance * r;
      let principalPayment: number;

      if (paymentType === "amortized") {
        principalPayment = monthlyPayment - interestPayment;
      } else {
        principalPayment = 0;
      }

      // 添加额外还款
      const actualExtra = Math.min(extra, balance - principalPayment);
      const totalPrincipal = principalPayment + actualExtra;

      balance = Math.max(0, balance - totalPrincipal);
      totalInterestPaid += interestPayment;
      totalPrincipalPaid += totalPrincipal;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        extraPmt: actualExtra,
        balance: balance
      });
    }

    const balloonPayment = balance;
    const totalPayments = (monthlyPayment + extra) * balloonMonths + balloonPayment;

    // 计算30年固定利率对比
    const fixed30Monthly = P * (r * Math.pow(1 + r, 360)) / (Math.pow(1 + r, 360) - 1);
    const fixed30TotalInterest = fixed30Monthly * 360 - P;

    setResults({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      balloonPayment: Math.round(balloonPayment * 100) / 100,
      totalInterest: Math.round(totalInterestPaid * 100) / 100,
      totalPayments: Math.round(totalPayments * 100) / 100,
      principalPaid: Math.round(totalPrincipalPaid * 100) / 100,
      interestPaid: Math.round(totalInterestPaid * 100) / 100,
      schedule,
      comparison: {
        fixed30Monthly: Math.round(fixed30Monthly * 100) / 100,
        fixed30TotalInterest: Math.round(fixed30TotalInterest * 100) / 100
      }
    });
  };

  // 重置
  const reset = () => {
    setLoanAmount("300000");
    setInterestRate("6.5");
    setAmortizationYears(30);
    setBalloonYears(5);
    setPaymentType("amortized");
    setExtraPayment("0");
    setShowSchedule(false);
    setResults(null);
  };

  // 格式化货币
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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
            <span className="text-gray-900">Balloon Mortgage Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Balloon Mortgage Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your monthly payments and balloon payment amount. Compare interest-only vs amortized payments and see the full amortization schedule.
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
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "320px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Loan Details
              </h2>

              {/* Loan Amount */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  💰 Loan Amount
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 28px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                    min="10000"
                    max="10000000"
                  />
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {[100000, 200000, 300000, 500000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setLoanAmount(amt.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: loanAmount === amt.toString() ? "#DBEAFE" : "#F9FAFB",
                        color: loanAmount === amt.toString() ? "#1E40AF" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      ${(amt/1000)}K
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📊 Interest Rate (APR)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{
                      width: "100px",
                      padding: "12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                    min="0.1"
                    max="30"
                    step="0.1"
                  />
                  <span style={{ color: "#6B7280" }}>%</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  {[5.5, 6.0, 6.5, 7.0, 7.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setInterestRate(rate.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: interestRate === rate.toString() ? "#DBEAFE" : "#F9FAFB",
                        color: interestRate === rate.toString() ? "#1E40AF" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Amortization Period */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📅 Amortization Period
                </label>
                <select
                  value={amortizationYears}
                  onChange={(e) => setAmortizationYears(parseInt(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white"
                  }}
                >
                  {amortizationOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "4px" }}>
                  Payment calculated as if paying over this period
                </p>
              </div>

              {/* Balloon Due */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🎈 Balloon Payment Due In
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {balloonOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBalloonYears(opt.value)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: balloonYears === opt.value ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: balloonYears === opt.value ? "#F5F3FF" : "white",
                        color: balloonYears === opt.value ? "#7C3AED" : "#4B5563",
                        fontWeight: balloonYears === opt.value ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  💳 Payment Type
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setPaymentType("amortized")}
                    style={{
                      flex: "1",
                      padding: "12px",
                      borderRadius: "8px",
                      border: paymentType === "amortized" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: paymentType === "amortized" ? "#ECFDF5" : "white",
                      color: paymentType === "amortized" ? "#059669" : "#4B5563",
                      fontWeight: paymentType === "amortized" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Principal & Interest
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>Builds some equity</div>
                  </button>
                  <button
                    onClick={() => setPaymentType("interestOnly")}
                    style={{
                      flex: "1",
                      padding: "12px",
                      borderRadius: "8px",
                      border: paymentType === "interestOnly" ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                      backgroundColor: paymentType === "interestOnly" ? "#FEF3C7" : "white",
                      color: paymentType === "interestOnly" ? "#92400E" : "#4B5563",
                      fontWeight: paymentType === "interestOnly" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Interest Only
                    <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>Lower payment</div>
                  </button>
                </div>
              </div>

              {/* Extra Payment */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ➕ Extra Monthly Payment (Optional)
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
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem"
                    }}
                    min="0"
                  />
                </div>
                <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "4px" }}>
                  Extra payments reduce your balloon payment
                </p>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#7C3AED",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🎈 Calculate
                </button>
                <button
                  onClick={reset}
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
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "320px" }}>
              {/* Monthly Payment */}
              <div style={{
                background: results
                  ? "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: results ? "#7C3AED" : "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px"
                }}>
                  💵 Monthly Payment
                </p>
                <p style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: results ? "#5B21B6" : "#9CA3AF",
                  lineHeight: "1"
                }}>
                  {results ? formatCurrency(results.monthlyPayment) : "—"}
                </p>
                {results && parseFloat(extraPayment) > 0 && (
                  <p style={{ color: "#059669", marginTop: "8px", fontSize: "0.875rem" }}>
                    + {formatCurrency(parseFloat(extraPayment))} extra
                  </p>
                )}
              </div>

              {/* Balloon Payment */}
              {results && (
                <div style={{
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "16px",
                  textAlign: "center",
                  border: "1px solid #F59E0B"
                }}>
                  <p style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#92400E",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "8px"
                  }}>
                    🎈 Balloon Payment Due in {balloonYears} Years
                  </p>
                  <p style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "#92400E",
                    lineHeight: "1"
                  }}>
                    {formatCurrency(results.balloonPayment)}
                  </p>
                  <p style={{ color: "#B45309", marginTop: "8px", fontSize: "0.75rem" }}>
                    {paymentType === "interestOnly" ? "Full principal (no equity built)" : `${Math.round((1 - results.balloonPayment / parseFloat(loanAmount)) * 100)}% of principal paid off`}
                  </p>
                </div>
              )}

              {/* Cost Breakdown */}
              {results && (
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📊 Payment Summary
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Principal Paid</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{formatCurrency(results.principalPaid)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Interest Paid</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(results.interestPaid)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#EFF6FF", borderRadius: "8px" }}>
                      <span style={{ color: "#1E40AF", fontWeight: "600" }}>Total of All Payments</span>
                      <span style={{ fontWeight: "600", color: "#1E40AF" }}>{formatCurrency(results.totalPayments)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison with 30-Year Fixed */}
              {results && (
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#065F46", textTransform: "uppercase", marginBottom: "12px" }}>
                    📈 vs 30-Year Fixed Mortgage
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Balloon Monthly</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#7C3AED" }}>{formatCurrency(results.monthlyPayment)}</p>
                    </div>
                    <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>30-Year Fixed</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#6B7280" }}>{formatCurrency(results.comparison.fixed30Monthly)}</p>
                    </div>
                  </div>
                  <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.875rem", color: "#059669", fontWeight: "600" }}>
                    {results.monthlyPayment < results.comparison.fixed30Monthly 
                      ? `💚 Save ${formatCurrency(results.comparison.fixed30Monthly - results.monthlyPayment)}/month`
                      : `Monthly payment is similar`
                    }
                  </p>
                </div>
              )}

              {/* Quick Reference */}
              {!results && (
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#92400E", marginBottom: "12px" }}>
                    📊 Common Balloon Structures
                  </p>
                  <div style={{ fontSize: "0.8rem", color: "#92400E" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>30 due in 5</span>
                      <span style={{ fontWeight: "600" }}>5-year balloon</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>30 due in 7</span>
                      <span style={{ fontWeight: "600" }}>7-year balloon</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>30 due in 10</span>
                      <span style={{ fontWeight: "600" }}>10-year balloon</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>30 due in 15</span>
                      <span style={{ fontWeight: "600" }}>15-year balloon</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk Warning */}
              {results && (
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#991B1B", marginBottom: "8px" }}>
                    ⚠️ Important Reminder
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#991B1B" }}>
                    You must pay {formatCurrency(results.balloonPayment)} in {balloonYears} years. Plan ahead: refinance, sell, or save for this payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amortization Schedule */}
          {results && (
            <div style={{ marginTop: "32px", borderTop: "1px solid #E5E7EB", paddingTop: "24px" }}>
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: "#F3F4F6",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151"
                }}
              >
                📋 {showSchedule ? "Hide" : "Show"} Amortization Schedule
                <svg
                  className={`w-4 h-4 transform transition-transform ${showSchedule ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSchedule && (
                <div style={{ marginTop: "16px", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6" }}>
                        <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Month</th>
                        <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right" }}>Payment</th>
                        <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right" }}>Principal</th>
                        <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right" }}>Interest</th>
                        {parseFloat(extraPayment) > 0 && (
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right" }}>Extra</th>
                        )}
                        <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right" }}>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.filter((_, i) => i < 12 || i === results.schedule.length - 1 || i % 12 === 11).map((row, index) => (
                        <tr key={index} style={{ backgroundColor: row.month === results.schedule.length ? "#FEF3C7" : index % 2 === 0 ? "white" : "#F9FAFB" }}>
                          <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                            {row.month === results.schedule.length ? `${row.month} (Final)` : row.month}
                          </td>
                          <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "right" }}>${row.payment.toFixed(2)}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>${row.principal.toFixed(2)}</td>
                          <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "right", color: "#DC2626" }}>${row.interest.toFixed(2)}</td>
                          {parseFloat(extraPayment) > 0 && (
                            <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "right", color: "#7C3AED" }}>${row.extraPmt.toFixed(2)}</td>
                          )}
                          <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: row.month === results.schedule.length ? "bold" : "normal" }}>
                            ${row.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ backgroundColor: "#FEF3C7", fontWeight: "bold" }}>
                        <td colSpan={parseFloat(extraPayment) > 0 ? 5 : 4} style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right", color: "#92400E" }}>
                          🎈 Balloon Payment Due:
                        </td>
                        <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "right", color: "#92400E", fontSize: "1rem" }}>
                          {formatCurrency(results.balloonPayment)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "8px" }}>
                    * Showing first 12 months, yearly summaries, and final month. Full schedule has {results.schedule.length} months.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How Balloon Mortgages Work */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How Balloon Mortgages Work
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                A balloon mortgage has a <strong>short loan term</strong> (typically 5-7 years) but payments are calculated based on a <strong>longer amortization period</strong> (usually 30 years). This results in lower monthly payments, but a large "balloon" payment is due at the end.
              </p>

              <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "8px", marginBottom: "16px" }}>
                <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "8px" }}>Example: "30 due in 5" Balloon Mortgage</p>
                <p style={{ fontSize: "0.875rem", color: "#6D28D9" }}>
                  Monthly payments calculated as if you have 30 years to pay, but the entire remaining balance is due after just 5 years.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>5-7</p>
                  <p style={{ fontSize: "0.75rem", color: "#065F46" }}>Typical term<br />(years)</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>30</p>
                  <p style={{ fontSize: "0.75rem", color: "#92400E" }}>Amortization<br />(years)</p>
                </div>
                <div style={{ backgroundColor: "#FEF2F2", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>90%+</p>
                  <p style={{ fontSize: "0.75rem", color: "#991B1B" }}>Balloon as %<br />of loan</p>
                </div>
              </div>
            </div>

            {/* Interest-Only vs Amortized */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                Interest-Only vs Principal & Interest
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Factor</th>
                      <th style={{ padding: "12px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", textAlign: "center" }}>Principal & Interest</th>
                      <th style={{ padding: "12px", backgroundColor: "#FEF3C7", border: "1px solid #FDE68A", textAlign: "center" }}>Interest Only</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { factor: "Monthly Payment", pi: "Higher", io: "Lower" },
                      { factor: "Balloon Payment", pi: "Reduced", io: "Full Principal" },
                      { factor: "Total Interest", pi: "Lower", io: "Higher" },
                      { factor: "Equity Built", pi: "Some", io: "None" },
                      { factor: "Risk Level", pi: "Moderate", io: "Higher" },
                    ].map((row, index) => (
                      <tr key={index}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.factor}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F0FDF4" }}>{row.pi}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#FFFBEB" }}>{row.io}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3 Options at Balloon Due */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                3 Options When Your Balloon Payment Is Due
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "20px", borderRadius: "12px" }}>
                  <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>💰</p>
                  <p style={{ fontWeight: "600", color: "#059669", marginBottom: "8px" }}>1. Pay It Off</p>
                  <p style={{ fontSize: "0.875rem", color: "#065F46" }}>If you have the funds, simply pay the balloon payment in full.</p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px" }}>
                  <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🔄</p>
                  <p style={{ fontWeight: "600", color: "#2563EB", marginBottom: "8px" }}>2. Refinance</p>
                  <p style={{ fontSize: "0.875rem", color: "#1E40AF" }}>Get a new loan to pay off the balloon. Start 6-12 months early.</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px" }}>
                  <p style={{ fontSize: "1.5rem", marginBottom: "8px" }}>🏠</p>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>3. Sell the Property</p>
                  <p style={{ fontSize: "0.875rem", color: "#B45309" }}>Use sale proceeds to pay off the remaining balance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Pros & Cons */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ⚖️ Pros & Cons
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontWeight: "600", color: "#059669", marginBottom: "8px" }}>✅ Advantages</p>
                <ul style={{ fontSize: "0.875rem", color: "#4B5563", paddingLeft: "16px", margin: 0 }}>
                  <li style={{ marginBottom: "4px" }}>Lower monthly payments</li>
                  <li style={{ marginBottom: "4px" }}>Easier to qualify</li>
                  <li style={{ marginBottom: "4px" }}>Often lower interest rates</li>
                  <li>Good for short-term ownership</li>
                </ul>
              </div>
              <div>
                <p style={{ fontWeight: "600", color: "#DC2626", marginBottom: "8px" }}>❌ Disadvantages</p>
                <ul style={{ fontSize: "0.875rem", color: "#4B5563", paddingLeft: "16px", margin: 0 }}>
                  <li style={{ marginBottom: "4px" }}>Large lump sum due at end</li>
                  <li style={{ marginBottom: "4px" }}>Risk of foreclosure</li>
                  <li style={{ marginBottom: "4px" }}>Limited equity building</li>
                  <li>Refinancing not guaranteed</li>
                </ul>
              </div>
            </div>

            {/* Who Should Consider */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                🎯 Who Should Consider?
              </h3>
              <ul style={{ fontSize: "0.875rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Planning to sell before balloon due</li>
                <li style={{ marginBottom: "8px" }}>Expecting significant income increase</li>
                <li style={{ marginBottom: "8px" }}>Short-term investment properties</li>
                <li style={{ marginBottom: "8px" }}>House flippers</li>
                <li>Seller financing arrangements</li>
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
              <RelatedTools currentUrl="/balloon-mortgage-calculator" currentCategory="Finance" />
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
      </div>
    </div>
  );
}
