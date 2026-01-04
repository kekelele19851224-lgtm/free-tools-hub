"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// New Mexico county property tax rates (2025 data)
const NM_COUNTIES = [
  { name: "Bernalillo (Albuquerque)", rate: 0.99 },
  { name: "Catron", rate: 0.45 },
  { name: "Chaves", rate: 0.72 },
  { name: "Cibola", rate: 0.68 },
  { name: "Colfax", rate: 0.54 },
  { name: "Curry", rate: 0.75 },
  { name: "De Baca", rate: 0.52 },
  { name: "Doña Ana (Las Cruces)", rate: 0.78 },
  { name: "Eddy", rate: 0.55 },
  { name: "Grant", rate: 0.69 },
  { name: "Guadalupe", rate: 0.48 },
  { name: "Harding", rate: 0.36 },
  { name: "Hidalgo", rate: 0.58 },
  { name: "Lea", rate: 0.52 },
  { name: "Lincoln", rate: 0.47 },
  { name: "Los Alamos", rate: 1.05 },
  { name: "Luna", rate: 0.72 },
  { name: "McKinley", rate: 0.56 },
  { name: "Mora", rate: 0.42 },
  { name: "Otero", rate: 0.68 },
  { name: "Quay", rate: 0.62 },
  { name: "Rio Arriba", rate: 0.48 },
  { name: "Roosevelt", rate: 0.71 },
  { name: "San Juan", rate: 0.69 },
  { name: "San Miguel", rate: 0.55 },
  { name: "Sandoval", rate: 0.79 },
  { name: "Santa Fe", rate: 0.51 },
  { name: "Sierra", rate: 0.58 },
  { name: "Socorro", rate: 0.62 },
  { name: "Taos", rate: 0.45 },
  { name: "Torrance", rate: 0.65 },
  { name: "Union", rate: 0.48 },
  { name: "Valencia", rate: 0.82 },
];

// Quick reference mortgage payments
const QUICK_PAYMENTS = [
  { price: 100000, rate: 6.5, payment: 632 },
  { price: 200000, rate: 6.5, payment: 1264 },
  { price: 300000, rate: 6.5, payment: 1896 },
  { price: 400000, rate: 6.5, payment: 2528 },
  { price: 500000, rate: 6.5, payment: 3160 },
];

// FAQ data
const faqs = [
  {
    question: "How much income do you need to be approved for a $400,000 mortgage?",
    answer: "For a $400,000 mortgage at 6.5% interest, you'd need approximately $95,000-$115,000 annual income. This is based on the 28/36 rule where your housing costs shouldn't exceed 28% of gross income. With a 20% down payment ($80,000), your monthly payment would be around $2,528 for principal and interest alone, plus taxes and insurance."
  },
  {
    question: "How much of a mortgage can I afford if I make $70,000 a year?",
    answer: "With a $70,000 annual salary, you can typically afford a home priced between $230,000-$280,000. Using the 28% rule, your maximum monthly housing payment should be about $1,633. This assumes a 20% down payment, good credit, and minimal other debts. In New Mexico, with lower property taxes, you may qualify for slightly more."
  },
  {
    question: "What salary do you need for a $500,000 mortgage?",
    answer: "To afford a $500,000 mortgage, you generally need an annual income of $120,000-$140,000. The monthly principal and interest payment at 6.5% would be about $3,160, plus property taxes (~$250/month in NM) and insurance (~$145/month). Total housing costs of $3,500+ require substantial income."
  },
  {
    question: "How much is $100,000 mortgage at 6% for 30 years?",
    answer: "A $100,000 mortgage at 6% interest for 30 years has a monthly principal and interest payment of $600. Over the life of the loan, you'll pay $115,838 in interest, for a total repayment of $215,838. In New Mexico, add approximately $50-85/month for property taxes depending on your county."
  },
  {
    question: "What is the property tax rate in New Mexico?",
    answer: "New Mexico's average effective property tax rate is 0.61%-0.76%, one of the lowest in the nation. Rates vary by county: Los Alamos County has the highest at 1.05%, while Harding County has the lowest at 0.36%. Bernalillo County (Albuquerque) is 0.99%, and Santa Fe County is just 0.51%."
  },
  {
    question: "What is included in a mortgage payment (PITI)?",
    answer: "PITI stands for Principal, Interest, Taxes, and Insurance. Principal reduces your loan balance. Interest is the cost of borrowing. Taxes are property taxes (collected monthly, paid annually). Insurance includes homeowners insurance and PMI (if down payment is less than 20%). All four components make up your total monthly payment."
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

export default function MortgageCalculatorNewMexico() {
  // Calculator inputs
  const [homePrice, setHomePrice] = useState<string>("350000");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>("20");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [selectedCounty, setSelectedCounty] = useState<string>("Bernalillo (Albuquerque)");
  const [homeInsurance, setHomeInsurance] = useState<string>("1730");
  const [includeHOA, setIncludeHOA] = useState(false);
  const [hoaFee, setHoaFee] = useState<string>("150");

  // Get property tax rate for selected county
  const propertyTaxRate = useMemo(() => {
    const county = NM_COUNTIES.find(c => c.name === selectedCounty);
    return county ? county.rate : 0.76;
  }, [selectedCounty]);

  // Calculate mortgage
  const results = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const downPaymentPct = parseFloat(downPaymentPercent) || 0;
    const rate = parseFloat(interestRate) || 0;
    const insurance = parseFloat(homeInsurance) || 0;
    const hoa = includeHOA ? (parseFloat(hoaFee) || 0) : 0;

    const downPayment = price * (downPaymentPct / 100);
    const loanAmount = price - downPayment;
    
    // Monthly interest rate
    const monthlyRate = rate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Monthly principal & interest (P&I)
    let monthlyPI = 0;
    if (monthlyRate > 0 && numPayments > 0) {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else if (numPayments > 0) {
      monthlyPI = loanAmount / numPayments;
    }

    // Monthly property tax
    const annualPropertyTax = price * (propertyTaxRate / 100);
    const monthlyPropertyTax = annualPropertyTax / 12;

    // Monthly insurance
    const monthlyInsurance = insurance / 12;

    // PMI (if down payment < 20%)
    let monthlyPMI = 0;
    if (downPaymentPct < 20) {
      monthlyPMI = (loanAmount * 0.0079) / 12; // 0.79% annual PMI rate
    }

    // Total monthly payment
    const totalMonthly = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoa;

    // Total interest over life of loan
    const totalInterest = (monthlyPI * numPayments) - loanAmount;
    const totalCost = monthlyPI * numPayments;

    return {
      downPayment,
      loanAmount,
      monthlyPI: monthlyPI.toFixed(2),
      monthlyPropertyTax: monthlyPropertyTax.toFixed(2),
      monthlyInsurance: monthlyInsurance.toFixed(2),
      monthlyPMI: monthlyPMI.toFixed(2),
      monthlyHOA: hoa.toFixed(2),
      totalMonthly: totalMonthly.toFixed(2),
      annualPropertyTax: annualPropertyTax.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalCost: totalCost.toFixed(2),
      hasPMI: downPaymentPct < 20
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, propertyTaxRate, homeInsurance, includeHOA, hoaFee]);

  const formatCurrency = (num: string | number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseFloat(num.toString()));
  };

  const formatCurrencyDecimal = (num: string | number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(parseFloat(num.toString()));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>New Mexico Mortgage Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              New Mexico Mortgage Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your monthly mortgage payment in New Mexico with local property tax rates by county. See your complete PITI breakdown including principal, interest, taxes, and insurance.
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
            <span style={{ fontSize: "1.5rem" }}>📊</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>New Mexico Averages</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                <strong>Median Home:</strong> $375,000 • <strong>Property Tax:</strong> 0.61% (state avg) • <strong>Insurance:</strong> $1,730/year
              </p>
            </div>
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
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🧮 Calculate Your Monthly Payment</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Home Price & Down Payment */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🏡 Home Price & Down Payment
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Home Price ($)
                    </label>
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Down Payment (%)
                    </label>
                    <input
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                      min="0"
                      max="100"
                    />
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
                      Down payment: {formatCurrency(results.downPayment)} • Loan: {formatCurrency(results.loanAmount)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[5, 10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setDownPaymentPercent(pct.toString())}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: downPaymentPercent === pct.toString() ? "2px solid #1E40AF" : "1px solid #D1D5DB",
                          backgroundColor: downPaymentPercent === pct.toString() ? "#EFF6FF" : "white",
                          color: downPaymentPercent === pct.toString() ? "#1E40AF" : "#374151",
                          cursor: "pointer",
                          fontWeight: "500",
                          fontSize: "0.85rem"
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Details */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    💰 Loan Details
                  </h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                        step="0.125"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Loan Term
                      </label>
                      <select
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                      >
                        <option value={30}>30 years</option>
                        <option value={20}>20 years</option>
                        <option value={15}>15 years</option>
                        <option value={10}>10 years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* New Mexico Specific */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📍 New Mexico County
                  </h3>
                  
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Select Your County
                    </label>
                    <select
                      value={selectedCounty}
                      onChange={(e) => setSelectedCounty(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                    >
                      {NM_COUNTIES.map((county) => (
                        <option key={county.name} value={county.name}>
                          {county.name} ({county.rate}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    Property tax rate: <strong>{propertyTaxRate}%</strong> • Annual tax: <strong>{formatCurrency(results.annualPropertyTax)}</strong>
                  </p>
                </div>

                {/* Insurance & HOA */}
                <div style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🛡️ Insurance & HOA
                  </h3>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Annual Home Insurance ($)
                    </label>
                    <input
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>NM average: $1,730/year</p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: includeHOA ? "12px" : "0" }}>
                    <div>
                      <p style={{ fontWeight: "500", color: "#374151", margin: 0, fontSize: "0.9rem" }}>Include HOA Fees?</p>
                    </div>
                    <button
                      onClick={() => setIncludeHOA(!includeHOA)}
                      style={{
                        width: "56px",
                        height: "28px",
                        borderRadius: "14px",
                        backgroundColor: includeHOA ? "#7C3AED" : "#D1D5DB",
                        border: "none",
                        cursor: "pointer",
                        position: "relative"
                      }}
                    >
                      <div style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        position: "absolute",
                        top: "2px",
                        left: includeHOA ? "30px" : "2px",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>

                  {includeHOA && (
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Monthly HOA Fee ($)
                      </label>
                      <input
                        type="number"
                        value={hoaFee}
                        onChange={(e) => setHoaFee(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ backgroundColor: "#1E40AF", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Estimated Monthly Payment</p>
                  <p style={{ fontSize: "2.75rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatCurrencyDecimal(results.totalMonthly)}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {formatCurrency(results.loanAmount)} loan • {loanTerm} years • {interestRate}%
                  </p>
                </div>

                {/* PITI Breakdown */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Monthly Payment Breakdown (PITI)</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Principal & Interest</span>
                      <span style={{ fontWeight: "600", color: "#1E40AF" }}>{formatCurrencyDecimal(results.monthlyPI)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Property Tax</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrencyDecimal(results.monthlyPropertyTax)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Home Insurance</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrencyDecimal(results.monthlyInsurance)}</span>
                    </div>
                    {results.hasPMI && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                        <span style={{ color: "#92400E" }}>PMI (until 20% equity)</span>
                        <span style={{ fontWeight: "600", color: "#92400E" }}>{formatCurrencyDecimal(results.monthlyPMI)}</span>
                      </div>
                    )}
                    {includeHOA && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#6B7280" }}>HOA Fee</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrencyDecimal(results.monthlyHOA)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loan Summary */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📈 Loan Summary</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Home Price</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(homePrice)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Down Payment ({downPaymentPercent}%)</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(results.downPayment)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Loan Amount</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(results.loanAmount)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #A7F3D0" }}>
                      <span style={{ color: "#6B7280" }}>Total Interest ({loanTerm} yrs)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(results.totalInterest)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
                      <span style={{ color: "#374151", fontWeight: "600" }}>Total of All Payments</span>
                      <span style={{ fontWeight: "700", color: "#059669" }}>{formatCurrency(results.totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* PMI Notice */}
                {results.hasPMI && (
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>PMI Required:</strong> With less than 20% down, you&apos;ll pay Private Mortgage Insurance until you reach 20% equity. Put down {formatCurrency((parseFloat(homePrice) || 0) * 0.2)} to avoid PMI.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📋 Quick Mortgage Payment Reference</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Monthly principal & interest only (30-year fixed at 6.5%, 20% down)</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Home Price</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Down Payment (20%)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Loan Amount</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Monthly P&I</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_PAYMENTS.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{formatCurrency(row.price)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(row.price * 0.2)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(row.price * 0.8)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#1E40AF" }}>{formatCurrency(row.payment)}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* NM County Tax Rates */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📍 New Mexico Property Tax Rates by County</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "20px" }}>
                Property tax rates vary significantly across New Mexico&apos;s 33 counties. The state average is 0.61%-0.76%, well below the national average of 0.99%.
              </p>
              <div style={{ overflowX: "auto", maxHeight: "400px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#FEF3C7" }}>
                    <tr>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>County</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Tax Rate</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Annual Tax on $350K Home</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NM_COUNTIES.sort((a, b) => b.rate - a.rate).map((county, idx) => (
                      <tr key={county.name} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{county.name}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: county.rate >= 0.9 ? "#DC2626" : county.rate <= 0.5 ? "#059669" : "#374151" }}>
                          {county.rate}%
                        </td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                          {formatCurrency(350000 * (county.rate / 100))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PITI Explanation */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>What&apos;s Included in Your Mortgage Payment?</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { letter: "P", title: "Principal", desc: "The portion that pays down your loan balance each month.", color: "#1E40AF" },
                  { letter: "I", title: "Interest", desc: "The cost of borrowing money, paid to your lender.", color: "#7C3AED" },
                  { letter: "T", title: "Taxes", desc: "Property taxes collected monthly, paid to your county annually.", color: "#059669" },
                  { letter: "I", title: "Insurance", desc: "Homeowners insurance + PMI if your down payment is under 20%.", color: "#DC2626" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: item.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "1.25rem", flexShrink: 0 }}>{item.letter}</div>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* NM Highlights */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>🌵 New Mexico Facts</h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Property tax rate: 0.61% (vs 0.99% national)</li>
                <li style={{ marginBottom: "8px" }}>Median home price: $375,000</li>
                <li style={{ marginBottom: "8px" }}>No state-level transfer tax</li>
                <li style={{ marginBottom: "8px" }}>$2,000 head-of-family exemption</li>
                <li>Veterans may qualify for $4,000 exemption</li>
              </ul>
            </div>

            {/* Affordability Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Affordability Rules</h3>
              <div style={{ fontSize: "0.85rem", color: "#065F46" }}>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #A7F3D0" }}>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>28% Rule</p>
                  <p style={{ margin: 0 }}>Housing costs ≤ 28% of gross monthly income</p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>36% Rule</p>
                  <p style={{ margin: 0 }}>Total debt payments ≤ 36% of gross monthly income</p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/mortgage-calculator-new-mexico" currentCategory="Finance" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. Actual mortgage payments may vary based on lender requirements, credit score, and other factors. Property tax rates are approximate and may change. Consult with a licensed mortgage professional for accurate quotes. Data reflects latest available New Mexico averages.
          </p>
        </div>
      </div>
    </div>
  );
}
