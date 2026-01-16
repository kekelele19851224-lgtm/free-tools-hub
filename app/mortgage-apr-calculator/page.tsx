"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How do I calculate the APR on a mortgage?",
    answer: "APR is calculated by finding the interest rate that would produce the same monthly payment if all fees were rolled into the loan. The formula considers: loan amount, interest rate, loan term, origination fees, discount points, and closing costs. Our calculator uses the standard APR calculation method required by the Truth in Lending Act (TILA)."
  },
  {
    question: "What is the difference between APR and interest rate?",
    answer: "The interest rate is simply the cost of borrowing the principal amount. APR (Annual Percentage Rate) includes the interest rate PLUS fees like origination fees, discount points, and certain closing costs. APR is always higher than or equal to the interest rate. APR gives you a more accurate picture of the true cost of the loan."
  },
  {
    question: "Why is my APR higher than my interest rate?",
    answer: "Your APR is higher because it includes additional costs beyond just interest. These typically include: origination fees (0.5%-1% of loan), discount points (each point = 1% of loan), mortgage broker fees, and certain closing costs. The more fees you pay, the larger the gap between your interest rate and APR."
  },
  {
    question: "Should I choose a loan with lower APR or lower interest rate?",
    answer: "It depends on how long you plan to keep the loan. If you'll keep it for the full term (15-30 years), choose the lower APR. If you plan to sell or refinance within 5-7 years, compare the total 5-year costs instead. A loan with higher rate but lower fees might cost less if you don't keep it long enough to benefit from the lower rate."
  },
  {
    question: "What are discount points and should I buy them?",
    answer: "Discount points are prepaid interest that lowers your rate. Each point costs 1% of the loan amount and typically reduces your rate by 0.25%. Buy points if: you'll keep the loan long enough to break even (usually 4-7 years), you have extra cash at closing, and you want lower monthly payments. Don't buy points if you might sell or refinance soon."
  },
  {
    question: "What fees are included in APR calculation?",
    answer: "APR includes: origination fees, discount points, mortgage broker fees, and certain prepaid finance charges. APR does NOT include: title insurance, appraisal fees, credit report fees, attorney fees, recording fees, or property taxes. This is why APR alone shouldn't be your only comparison tool."
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

// Calculate monthly payment
function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
}

// Calculate APR using Newton-Raphson method
function calculateAPR(loanAmount: number, monthlyPayment: number, years: number, totalFees: number): number {
  const numPayments = years * 12;
  const netLoan = loanAmount - totalFees; // Amount actually received
  
  // Initial guess: nominal rate
  let apr = 0.05; // Start with 5%
  
  for (let i = 0; i < 100; i++) {
    const monthlyRate = apr / 12;
    
    // Calculate present value of payments at current APR guess
    let pv = 0;
    for (let j = 1; j <= numPayments; j++) {
      pv += monthlyPayment / Math.pow(1 + monthlyRate, j);
    }
    
    // Calculate derivative
    let dpv = 0;
    for (let j = 1; j <= numPayments; j++) {
      dpv -= (j / 12) * monthlyPayment / Math.pow(1 + monthlyRate, j + 1);
    }
    
    const diff = pv - netLoan;
    
    if (Math.abs(diff) < 0.01) break;
    
    apr = apr - diff / dpv;
    
    // Bounds check
    if (apr < 0.001) apr = 0.001;
    if (apr > 0.5) apr = 0.5;
  }
  
  return apr * 100;
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function MortgageAPRCalculator() {
  const [activeTab, setActiveTab] = useState<'calculate' | 'compare' | 'explained'>('calculate');

  // Tab 1: Calculate APR inputs
  const [loanAmount, setLoanAmount] = useState<string>("400000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [originationFee, setOriginationFee] = useState<string>("1");
  const [discountPoints, setDiscountPoints] = useState<string>("0");
  const [otherFees, setOtherFees] = useState<string>("3000");

  // Tab 2: Compare Loans inputs
  const [loanA, setLoanA] = useState({
    rate: "6.5",
    points: "2",
    fees: "5000"
  });
  const [loanB, setLoanB] = useState({
    rate: "6.875",
    points: "0",
    fees: "2000"
  });
  const [compareLoanAmount, setCompareLoanAmount] = useState<string>("400000");
  const [compareLoanTerm, setCompareLoanTerm] = useState<string>("30");

  // Tab 1 Calculations
  const aprResults = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(loanTerm) || 30;
    const origFee = (parseFloat(originationFee) || 0) / 100 * principal;
    const points = (parseFloat(discountPoints) || 0) / 100 * principal;
    const other = parseFloat(otherFees) || 0;
    
    const totalFees = origFee + points + other;
    const monthlyPayment = calculateMonthlyPayment(principal, rate, years);
    const totalPayments = monthlyPayment * years * 12;
    const totalInterest = totalPayments - principal;
    
    const apr = calculateAPR(principal, monthlyPayment, years, totalFees);
    const aprDifference = apr - rate;
    
    return {
      monthlyPayment,
      totalInterest,
      totalFees,
      totalPayments,
      apr,
      aprDifference,
      principal,
      rate,
      years
    };
  }, [loanAmount, interestRate, loanTerm, originationFee, discountPoints, otherFees]);

  // Tab 2 Calculations - Compare Loans
  const compareResults = useMemo(() => {
    const principal = parseFloat(compareLoanAmount) || 0;
    const years = parseInt(compareLoanTerm) || 30;
    
    // Loan A calculations
    const rateA = parseFloat(loanA.rate) || 0;
    const pointsA = (parseFloat(loanA.points) || 0) / 100 * principal;
    const feesA = parseFloat(loanA.fees) || 0;
    const totalFeesA = pointsA + feesA;
    const monthlyA = calculateMonthlyPayment(principal, rateA, years);
    const aprA = calculateAPR(principal, monthlyA, years, totalFeesA);
    const totalInterestA = (monthlyA * years * 12) - principal;
    const fiveYearCostA = (monthlyA * 60) + totalFeesA;
    
    // Loan B calculations
    const rateB = parseFloat(loanB.rate) || 0;
    const pointsB = (parseFloat(loanB.points) || 0) / 100 * principal;
    const feesB = parseFloat(loanB.fees) || 0;
    const totalFeesB = pointsB + feesB;
    const monthlyB = calculateMonthlyPayment(principal, rateB, years);
    const aprB = calculateAPR(principal, monthlyB, years, totalFeesB);
    const totalInterestB = (monthlyB * years * 12) - principal;
    const fiveYearCostB = (monthlyB * 60) + totalFeesB;
    
    // Calculate break-even point (months)
    const monthlySavings = monthlyB - monthlyA;
    const upfrontDiff = totalFeesA - totalFeesB;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(upfrontDiff / monthlySavings) : 0;
    
    return {
      loanA: {
        rate: rateA,
        apr: aprA,
        monthly: monthlyA,
        totalFees: totalFeesA,
        totalInterest: totalInterestA,
        fiveYearCost: fiveYearCostA
      },
      loanB: {
        rate: rateB,
        apr: aprB,
        monthly: monthlyB,
        totalFees: totalFeesB,
        totalInterest: totalInterestB,
        fiveYearCost: fiveYearCostB
      },
      breakEvenMonths,
      principal,
      years
    };
  }, [compareLoanAmount, compareLoanTerm, loanA, loanB]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Mortgage APR Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏦</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Mortgage APR Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the true Annual Percentage Rate (APR) of your mortgage including all fees. 
            Compare loan offers to find the best deal for your situation.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                <strong>APR vs Interest Rate:</strong> APR includes fees, so it&apos;s always higher than the interest rate
              </p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                A 6.5% rate with 2 points and $5,000 fees ≈ 6.72% APR on a $400K loan
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculate")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculate" ? "#1D4ED8" : "#E5E7EB",
              color: activeTab === "calculate" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧮 Calculate APR
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "compare" ? "#1D4ED8" : "#E5E7EB",
              color: activeTab === "compare" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚖️ Compare Loans
          </button>
          <button
            onClick={() => setActiveTab("explained")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "explained" ? "#1D4ED8" : "#E5E7EB",
              color: activeTab === "explained" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📚 APR Explained
          </button>
        </div>

        {/* Tab 1: Calculate APR */}
        {activeTab === 'calculate' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🏠 Loan Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Loan Amount */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="400000"
                  />
                </div>

                {/* Interest Rate */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.125"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="6.5"
                  />
                </div>

                {/* Loan Term */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Loan Term (years)
                  </label>
                  <select
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>

                <div style={{ borderTop: "1px solid #E5E7EB", margin: "20px 0", paddingTop: "20px" }}>
                  <h3 style={{ fontSize: "0.95rem", color: "#374151", marginBottom: "16px", fontWeight: "600" }}>
                    💰 Fees & Costs
                  </h3>

                  {/* Origination Fee */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Origination Fee (%)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={originationFee}
                      onChange={(e) => setOriginationFee(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="1"
                    />
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
                      Typically 0.5% - 1% of loan amount
                    </p>
                  </div>

                  {/* Discount Points */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Discount Points
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={discountPoints}
                      onChange={(e) => setDiscountPoints(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="0"
                    />
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
                      Each point = 1% of loan, reduces rate by ~0.25%
                    </p>
                  </div>

                  {/* Other Fees */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Other Closing Costs ($)
                    </label>
                    <input
                      type="number"
                      value={otherFees}
                      onChange={(e) => setOtherFees(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="3000"
                    />
                  </div>
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
                  📊 APR Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* APR Display */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                    Annual Percentage Rate (APR)
                  </p>
                  <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {aprResults.apr.toFixed(3)}%
                  </p>
                </div>

                {/* Rate Comparison Visual */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "20px"
                }}>
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>Interest Rate</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{aprResults.rate.toFixed(3)}%</span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(aprResults.rate / 10) * 100}%`,
                        backgroundColor: "#3B82F6",
                        borderRadius: "4px"
                      }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>APR (with fees)</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{aprResults.apr.toFixed(3)}%</span>
                    </div>
                    <div style={{ height: "8px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${(aprResults.apr / 10) * 100}%`,
                        backgroundColor: "#059669",
                        borderRadius: "4px"
                      }} />
                    </div>
                  </div>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#DC2626", textAlign: "center" }}>
                    ⚠️ Fees add <strong>{aprResults.aprDifference.toFixed(3)}%</strong> to your effective rate
                  </p>
                </div>

                {/* Key Figures */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Monthly Payment</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(aprResults.monthlyPayment)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Total Interest ({aprResults.years} years)</span>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(aprResults.totalInterest)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Total Fees at Closing</span>
                    <span style={{ fontWeight: "600", color: "#D97706" }}>{formatCurrency(aprResults.totalFees)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#EFF6FF", borderRadius: "6px", border: "1px solid #BFDBFE" }}>
                    <span style={{ color: "#1E40AF", fontWeight: "600" }}>Total Cost of Loan</span>
                    <span style={{ fontWeight: "700", color: "#1D4ED8" }}>{formatCurrency(aprResults.totalPayments + aprResults.totalFees)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Compare Loans */}
        {activeTab === 'compare' && (
          <div style={{ marginBottom: "24px" }}>
            {/* Common Inputs */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                📋 Loan Parameters (Same for Both)
              </h2>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    value={compareLoanAmount}
                    onChange={(e) => setCompareLoanAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Loan Term
                  </label>
                  <select
                    value={compareLoanTerm}
                    onChange={(e) => setCompareLoanTerm(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="15">15 years</option>
                    <option value="20">20 years</option>
                    <option value="30">30 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Two Loan Comparison */}
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Loan A */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "2px solid #3B82F6",
                overflow: "hidden"
              }}>
                <div style={{ backgroundColor: "#3B82F6", padding: "16px 24px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                    🅰️ Loan A (Lower Rate + Higher Fees)
                  </h2>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.125"
                      value={loanA.rate}
                      onChange={(e) => setLoanA({...loanA, rate: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Discount Points
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={loanA.points}
                      onChange={(e) => setLoanA({...loanA, points: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Other Fees ($)
                    </label>
                    <input
                      type="number"
                      value={loanA.fees}
                      onChange={(e) => setLoanA({...loanA, fees: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Results */}
                  <div style={{ borderTop: "2px solid #3B82F6", paddingTop: "20px" }}>
                    <div style={{
                      backgroundColor: "#EFF6FF",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "12px"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#1E40AF" }}>APR</p>
                      <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#1D4ED8" }}>
                        {compareResults.loanA.apr.toFixed(3)}%
                      </p>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Monthly Payment</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanA.monthly)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Upfront Costs</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanA.totalFees)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>5-Year Cost</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanA.fiveYearCost)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                        <span>Total Interest</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(compareResults.loanA.totalInterest)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan B */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "2px solid #059669",
                overflow: "hidden"
              }}>
                <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                    🅱️ Loan B (Higher Rate + Lower Fees)
                  </h2>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.125"
                      value={loanB.rate}
                      onChange={(e) => setLoanB({...loanB, rate: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Discount Points
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={loanB.points}
                      onChange={(e) => setLoanB({...loanB, points: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Other Fees ($)
                    </label>
                    <input
                      type="number"
                      value={loanB.fees}
                      onChange={(e) => setLoanB({...loanB, fees: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Results */}
                  <div style={{ borderTop: "2px solid #059669", paddingTop: "20px" }}>
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "12px"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#065F46" }}>APR</p>
                      <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                        {compareResults.loanB.apr.toFixed(3)}%
                      </p>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Monthly Payment</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanB.monthly)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>Upfront Costs</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanB.totalFees)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span>5-Year Cost</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(compareResults.loanB.fiveYearCost)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                        <span>Total Interest</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(compareResults.loanB.totalInterest)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginTop: "24px",
              border: "2px solid #FCD34D"
            }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1.25rem", color: "#92400E" }}>
                🏆 Which Loan is Better?
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "16px",
                  border: compareResults.loanA.apr < compareResults.loanB.apr ? "2px solid #059669" : "1px solid #E5E7EB"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#1D4ED8" }}>
                    {compareResults.loanA.apr < compareResults.loanB.apr ? "✅ " : ""}Loan A wins if...
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                    You keep the loan for <strong>{compareResults.breakEvenMonths > 0 ? `${Math.ceil(compareResults.breakEvenMonths / 12)} years` : "the full term"}</strong> or longer
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>
                    Lower APR = lower total cost over time
                  </p>
                </div>
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "16px",
                  border: compareResults.loanB.fiveYearCost < compareResults.loanA.fiveYearCost ? "2px solid #059669" : "1px solid #E5E7EB"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#059669" }}>
                    {compareResults.loanB.fiveYearCost < compareResults.loanA.fiveYearCost ? "✅ " : ""}Loan B wins if...
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                    You sell/refinance within <strong>{compareResults.breakEvenMonths > 0 ? `${Math.ceil(compareResults.breakEvenMonths / 12)} years` : "5 years"}</strong>
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>
                    Lower upfront costs = better for short-term
                  </p>
                </div>
              </div>
              {compareResults.breakEvenMonths > 0 && (
                <p style={{ margin: "16px 0 0 0", textAlign: "center", color: "#92400E", fontWeight: "600" }}>
                  ⏱️ Break-even point: <strong>{compareResults.breakEvenMonths} months</strong> ({(compareResults.breakEvenMonths / 12).toFixed(1)} years)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: APR Explained */}
        {activeTab === 'explained' && (
          <div style={{ marginBottom: "24px" }}>
            {/* Visual Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
                📊 Interest Rate vs APR
              </h2>
              
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" }}>
                <div style={{ flex: "1", minWidth: "250px", backgroundColor: "#EFF6FF", borderRadius: "12px", padding: "24px", border: "2px solid #3B82F6" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#1D4ED8", fontSize: "1.25rem" }}>💵 Interest Rate</h3>
                  <p style={{ margin: 0, color: "#1E40AF", lineHeight: "1.7" }}>
                    The <strong>base cost</strong> of borrowing money. This is just the percentage charged on the loan principal.
                  </p>
                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B7280" }}>Example: 6.5% interest rate</p>
                  </div>
                </div>
                
                <div style={{ flex: "1", minWidth: "250px", backgroundColor: "#ECFDF5", borderRadius: "12px", padding: "24px", border: "2px solid #059669" }}>
                  <h3 style={{ margin: "0 0 12px 0", color: "#059669", fontSize: "1.25rem" }}>📈 APR</h3>
                  <p style={{ margin: 0, color: "#047857", lineHeight: "1.7" }}>
                    The <strong>true cost</strong> including interest rate + all fees. APR is always ≥ interest rate.
                  </p>
                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B7280" }}>Example: 6.847% APR (includes $7,000 in fees)</p>
                  </div>
                </div>
              </div>

              {/* Formula */}
              <div style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px"
              }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>🔢 Simplified APR Concept</h3>
                <div style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  color: "#1F2937"
                }}>
                  APR = Interest Rate + (Fees ÷ Loan Amount ÷ Loan Term) × 100
                </div>
                <p style={{ margin: "16px 0 0 0", color: "#6B7280", fontSize: "0.9rem", textAlign: "center" }}>
                  * Actual APR calculation uses a more complex iterative method per TILA regulations
                </p>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
                💰 Common Mortgage Fees Explained
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  {
                    name: "Origination Fee",
                    typical: "0.5% - 1%",
                    included: true,
                    description: "Lender's fee for processing and underwriting the loan"
                  },
                  {
                    name: "Discount Points",
                    typical: "0 - 3 points",
                    included: true,
                    description: "Prepaid interest to lower your rate. Each point = 1% of loan amount"
                  },
                  {
                    name: "Mortgage Broker Fee",
                    typical: "1% - 2%",
                    included: true,
                    description: "Fee paid to mortgage broker (if using one)"
                  },
                  {
                    name: "Title Insurance",
                    typical: "$1,000 - $4,000",
                    included: false,
                    description: "Protects lender against title disputes"
                  },
                  {
                    name: "Appraisal Fee",
                    typical: "$300 - $600",
                    included: false,
                    description: "Cost to assess the property's value"
                  },
                  {
                    name: "Credit Report Fee",
                    typical: "$25 - $50",
                    included: false,
                    description: "Fee to pull your credit report"
                  },
                  {
                    name: "Recording Fees",
                    typical: "$50 - $250",
                    included: false,
                    description: "Government fees to record the mortgage"
                  }
                ].map((fee, index) => (
                  <div 
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "16px",
                      backgroundColor: fee.included ? "#ECFDF5" : "#F9FAFB",
                      borderRadius: "8px",
                      border: fee.included ? "1px solid #A7F3D0" : "1px solid #E5E7EB"
                    }}
                  >
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: fee.included ? "#059669" : "#9CA3AF",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      flexShrink: 0
                    }}>
                      {fee.included ? "✓" : "✗"}
                    </div>
                    <div style={{ flex: "1" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{fee.name}</span>
                        <span style={{ 
                          fontSize: "0.85rem", 
                          color: fee.included ? "#059669" : "#6B7280",
                          fontWeight: "600"
                        }}>
                          {fee.included ? "Included in APR" : "NOT in APR"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>{fee.description}</span>
                        <span style={{ fontSize: "0.85rem", color: "#374151", fontWeight: "500" }}>{fee.typical}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #FCD34D"
            }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#92400E", fontSize: "1.25rem" }}>
                💡 Pro Tips for Comparing Loans
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "#92400E" }}>
                <p style={{ margin: 0 }}>
                  ✅ <strong>Compare APRs</strong> when looking at loans with similar terms and you plan to keep the loan long-term
                </p>
                <p style={{ margin: 0 }}>
                  ✅ <strong>Look at 5-year costs</strong> if you might sell or refinance within 5-7 years
                </p>
                <p style={{ margin: 0 }}>
                  ✅ <strong>Use the Loan Estimate</strong> document (page 3) to compare total costs between lenders
                </p>
                <p style={{ margin: 0 }}>
                  ⚠️ <strong>APR isn&apos;t perfect</strong> - it doesn&apos;t include all closing costs and assumes you keep the loan for the full term
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏦 Understanding Mortgage APR</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The <strong>Annual Percentage Rate (APR)</strong> is a standardized way to express the true 
                  cost of a mortgage loan. Unlike the simple interest rate, APR includes fees and costs 
                  associated with the loan, giving you a more complete picture of what you&apos;ll actually pay.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why APR Matters</h3>
                <p>
                  The Truth in Lending Act (TILA) requires lenders to disclose the APR so consumers can 
                  compare loan offers on an apples-to-apples basis. A loan with a lower interest rate 
                  might actually cost more if it has higher fees - and APR reveals this.
                </p>

                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>📊 Example Comparison</p>
                  <p style={{ margin: 0, color: "#1D4ED8", fontSize: "0.95rem" }}>
                    <strong>Loan A:</strong> 6.5% rate + 2 points + $5,000 fees = 6.72% APR<br />
                    <strong>Loan B:</strong> 6.875% rate + 0 points + $2,000 fees = 6.95% APR<br /><br />
                    Loan A has lower APR but requires $11,000 upfront vs $2,000 for Loan B.
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When to Pay Points</h3>
                <p>
                  Buying discount points makes sense if you plan to keep the loan long enough to recoup 
                  the upfront cost through lower monthly payments. Calculate your break-even point: 
                  divide the point cost by monthly savings. If you&apos;ll own the home longer than that, 
                  points may be worth it.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 1 point = 1% of loan amount</p>
                <p style={{ margin: 0 }}>• 1 point ≈ 0.25% rate reduction</p>
                <p style={{ margin: 0 }}>• APR &gt; Interest Rate (always)</p>
                <p style={{ margin: 0 }}>• Avg closing costs: 2-5%</p>
                <p style={{ margin: 0 }}>• Avg homeowner stays: 8 years</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Important Note</h3>
              <p style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.7", margin: 0 }}>
                This calculator provides estimates for educational purposes. 
                Actual APR may vary based on lender calculations and specific loan terms. 
                Always review the official Loan Estimate document from your lender.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/mortgage-apr-calculator" currentCategory="Finance" />
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
        <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates for informational and educational purposes only. 
            It is not financial advice. APR calculations are approximations and may differ from actual lender calculations. 
            Always consult with a qualified mortgage professional and review official loan documents before making financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}