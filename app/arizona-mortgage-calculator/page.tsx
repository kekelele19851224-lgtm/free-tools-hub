"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Arizona county property tax rates (2024)
const arizonaCounties = [
  { name: "Maricopa (Phoenix, Mesa, Scottsdale)", rate: 0.51 },
  { name: "Pima (Tucson)", rate: 0.84 },
  { name: "Pinal (Casa Grande)", rate: 0.67 },
  { name: "Yavapai (Prescott)", rate: 0.58 },
  { name: "Coconino (Flagstaff)", rate: 0.52 },
  { name: "Mohave (Lake Havasu City)", rate: 0.48 },
  { name: "Yuma", rate: 0.69 },
  { name: "Cochise (Sierra Vista)", rate: 0.72 },
  { name: "Navajo", rate: 0.57 },
  { name: "Apache", rate: 1.65 },
  { name: "Gila (Payson)", rate: 0.74 },
  { name: "Graham (Safford)", rate: 0.68 },
  { name: "Santa Cruz (Nogales)", rate: 0.79 },
  { name: "La Paz (Parker)", rate: 0.56 },
  { name: "Greenlee (Clifton)", rate: 0.46 }
];

// Loan term options
const loanTerms = [
  { years: 30, label: "30 years" },
  { years: 20, label: "20 years" },
  { years: 15, label: "15 years" },
  { years: 10, label: "10 years" }
];

// Down payment presets
const downPaymentPresets = [3, 5, 10, 15, 20, 25];

// Home price presets
const homePricePresets = [300000, 400000, 500000, 600000, 750000];

// FAQ data
const faqs = [
  {
    question: "What is the average property tax rate in Arizona?",
    answer: "Arizona has one of the lowest property tax rates in the United States, averaging around 0.51% to 0.56% of assessed home value. This is well below the national average of approximately 0.99%. However, rates vary significantly by county - Maricopa County (Phoenix area) has a rate of about 0.51%, while Pima County (Tucson) is higher at 0.84%, and Apache County has the highest at 1.65%."
  },
  {
    question: "How much is a mortgage payment on a $400,000 house in Arizona?",
    answer: "For a $400,000 home in Arizona with 20% down ($80,000), a 30-year fixed mortgage at 6.5% interest, your estimated monthly payment would be approximately $2,528. This includes principal and interest ($2,023), property tax (~$170 in Maricopa County), and home insurance (~$125). If you put less than 20% down, you'd also pay PMI, adding $100-200 more per month."
  },
  {
    question: "What are closing costs in Arizona?",
    answer: "Closing costs in Arizona typically range from 2% to 5% of the home's purchase price. For a $400,000 home, expect to pay between $8,000 and $20,000 in closing costs. These include loan origination fees, appraisal fees, title insurance, escrow fees, recording fees, and prepaid items like property taxes and homeowners insurance."
  },
  {
    question: "Does Arizona have first-time homebuyer programs?",
    answer: "Yes, Arizona offers several assistance programs. The HOME Plus program provides 30-year fixed-rate mortgages with down payment assistance up to 5% of the loan amount. The Arizona Is Home program offers similar benefits but excludes Maricopa and Pima counties. Maricopa County has the Home in Five program, and Pima County offers up to 20% down payment assistance for qualifying buyers."
  },
  {
    question: "What is PMI and when do I need it in Arizona?",
    answer: "Private Mortgage Insurance (PMI) is required when your down payment is less than 20% of the home's purchase price. PMI typically costs between 0.5% and 1% of the loan amount annually. For a $320,000 loan, PMI might add $133-267 to your monthly payment. Once you reach 20% equity in your home, you can request to have PMI removed."
  },
  {
    question: "What credit score do I need for a mortgage in Arizona?",
    answer: "For conventional mortgages in Arizona, you typically need a minimum credit score of 620. FHA loans may accept scores as low as 580 with a 3.5% down payment, or 500-579 with 10% down. VA loans don't have a set minimum but most lenders require 620+. Higher credit scores (740+) will qualify you for the best interest rates."
  },
  {
    question: "How is property tax calculated in Arizona?",
    answer: "Arizona property tax is calculated based on your home's Limited Property Value (LPV), which is 10% of the full cash value. The LPV can only increase by 5% per year by law. Tax rates include primary taxes (capped at 1% for owner-occupied homes) and secondary taxes for bonds and special districts. Owner-occupied homes also receive a Homeowner Rebate of up to $600."
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
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// Format currency with cents
function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

// Calculate monthly mortgage payment (P&I only)
function calculateMonthlyPI(principal: number, annualRate: number, years: number): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

// Calculate PMI (annual rate as percentage of loan)
function calculatePMI(loanAmount: number, ltv: number): number {
  if (ltv <= 80) return 0;
  // PMI rate varies by LTV: higher LTV = higher PMI
  let pmiRate = 0.5;
  if (ltv > 95) pmiRate = 1.0;
  else if (ltv > 90) pmiRate = 0.8;
  else if (ltv > 85) pmiRate = 0.6;
  return (loanAmount * pmiRate / 100) / 12;
}

// Generate amortization schedule
function generateAmortization(principal: number, annualRate: number, years: number) {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = calculateMonthlyPI(principal, annualRate, years);
  
  let balance = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;
  
  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    
    // Store yearly summaries
    if (month % 12 === 0) {
      schedule.push({
        year: month / 12,
        principalPaid: totalPrincipal,
        interestPaid: totalInterest,
        balance: Math.max(0, balance)
      });
    }
  }
  
  return schedule;
}

export default function ArizonaMortgageCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"monthly" | "affordability" | "amortization">("monthly");

  // Tab 1: Monthly Payment
  const [homePrice, setHomePrice] = useState<string>("400000");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>("20");
  const [downPaymentType, setDownPaymentType] = useState<"percent" | "amount">("percent");
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>("80000");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [selectedCounty, setSelectedCounty] = useState<number>(0);
  const [propertyTaxOverride, setPropertyTaxOverride] = useState<string>("");
  const [homeInsurance, setHomeInsurance] = useState<string>("1500");
  const [hoaFees, setHoaFees] = useState<string>("0");

  // Tab 2: Affordability
  const [annualIncome, setAnnualIncome] = useState<string>("100000");
  const [monthlyDebts, setMonthlyDebts] = useState<string>("500");
  const [affordDownPayment, setAffordDownPayment] = useState<string>("80000");
  const [affordInterestRate, setAffordInterestRate] = useState<string>("6.5");
  const [affordLoanTerm, setAffordLoanTerm] = useState<number>(30);
  const [affordCounty, setAffordCounty] = useState<number>(0);

  // Tab 1 calculations
  const homePriceNum = parseFloat(homePrice) || 0;
  const downPayment = downPaymentType === "percent" 
    ? homePriceNum * (parseFloat(downPaymentPercent) || 0) / 100
    : parseFloat(downPaymentAmount) || 0;
  const downPaymentPct = homePriceNum > 0 ? (downPayment / homePriceNum) * 100 : 0;
  const loanAmount = Math.max(0, homePriceNum - downPayment);
  const ltv = homePriceNum > 0 ? (loanAmount / homePriceNum) * 100 : 0;

  const monthlyPI = calculateMonthlyPI(loanAmount, parseFloat(interestRate) || 0, loanTerm);
  const propertyTaxRate = propertyTaxOverride ? parseFloat(propertyTaxOverride) : arizonaCounties[selectedCounty].rate;
  const monthlyPropertyTax = (homePriceNum * propertyTaxRate / 100) / 12;
  const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
  const monthlyHOA = parseFloat(hoaFees) || 0;
  const monthlyPMI = calculatePMI(loanAmount, ltv);
  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHOA + monthlyPMI;

  const totalInterest = (monthlyPI * loanTerm * 12) - loanAmount;
  const totalCost = homePriceNum + totalInterest + (monthlyPropertyTax + monthlyInsurance + monthlyHOA + monthlyPMI) * loanTerm * 12;

  // Tab 2 calculations
  const monthlyIncome = (parseFloat(annualIncome) || 0) / 12;
  const monthlyDebtsNum = parseFloat(monthlyDebts) || 0;
  const maxHousingPayment28 = monthlyIncome * 0.28;
  const maxTotalDebt36 = monthlyIncome * 0.36;
  const maxHousingPayment = Math.min(maxHousingPayment28, maxTotalDebt36 - monthlyDebtsNum);
  
  const affordDownPaymentNum = parseFloat(affordDownPayment) || 0;
  const affordTaxRate = arizonaCounties[affordCounty].rate;
  
  // Iteratively calculate max home price
  const calculateMaxHomePrice = useMemo(() => {
    let maxPrice = 0;
    for (let price = 50000; price <= 2000000; price += 5000) {
      const loan = price - affordDownPaymentNum;
      if (loan <= 0) continue;
      const pi = calculateMonthlyPI(loan, parseFloat(affordInterestRate) || 6.5, affordLoanTerm);
      const tax = (price * affordTaxRate / 100) / 12;
      const ins = 1500 / 12;
      const pmi = calculatePMI(loan, (loan / price) * 100);
      const total = pi + tax + ins + pmi;
      if (total <= maxHousingPayment) {
        maxPrice = price;
      } else {
        break;
      }
    }
    return maxPrice;
  }, [affordDownPaymentNum, affordInterestRate, affordLoanTerm, affordTaxRate, maxHousingPayment]);

  // Tab 3: Amortization
  const amortizationSchedule = useMemo(() => {
    return generateAmortization(loanAmount, parseFloat(interestRate) || 0, loanTerm);
  }, [loanAmount, interestRate, loanTerm]);

  // Sync down payment amount/percent
  const handleDownPaymentPercentChange = (value: string) => {
    setDownPaymentPercent(value);
    setDownPaymentType("percent");
    const pct = parseFloat(value) || 0;
    setDownPaymentAmount(String(Math.round(homePriceNum * pct / 100)));
  };

  const handleDownPaymentAmountChange = (value: string) => {
    setDownPaymentAmount(value);
    setDownPaymentType("amount");
    const amt = parseFloat(value) || 0;
    if (homePriceNum > 0) {
      setDownPaymentPercent((amt / homePriceNum * 100).toFixed(1));
    }
  };

  const handleHomePriceChange = (value: string) => {
    setHomePrice(value);
    const price = parseFloat(value) || 0;
    if (downPaymentType === "percent") {
      const pct = parseFloat(downPaymentPercent) || 0;
      setDownPaymentAmount(String(Math.round(price * pct / 100)));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Arizona Mortgage Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Arizona Mortgage Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your monthly mortgage payment in Arizona with property taxes by county, insurance, PMI, and HOA fees. 
            Includes all 15 Arizona counties with current tax rates.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>🌵</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
                Arizona Average Property Tax: <strong>0.51%</strong> (Maricopa County) — 4th lowest in the US!
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                $400K home with 20% down at 6.5% = ~$2,528/month (P&I + Tax + Insurance)
              </p>
            </div>
          </div>
        </div>

        {/* County Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#ECFDF5",
          padding: "8px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          border: "1px solid #6EE7B7"
        }}>
          <span style={{ fontSize: "1rem" }}>✓</span>
          <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.9rem" }}>
            All 15 Arizona Counties Included
          </span>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("monthly")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "monthly" ? "#DC2626" : "#E5E7EB",
              color: activeTab === "monthly" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Monthly Payment
          </button>
          <button
            onClick={() => setActiveTab("affordability")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "affordability" ? "#DC2626" : "#E5E7EB",
              color: activeTab === "affordability" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🎯 Affordability
          </button>
          <button
            onClick={() => setActiveTab("amortization")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "amortization" ? "#DC2626" : "#E5E7EB",
              color: activeTab === "amortization" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Amortization
          </button>
        </div>

        {/* Tab 1: Monthly Payment */}
        {activeTab === "monthly" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🏠 Loan Details</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Home Price */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Home Price
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => handleHomePriceChange(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1.1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {homePricePresets.map((price) => (
                      <button
                        key={price}
                        onClick={() => handleHomePriceChange(String(price))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: homePrice === String(price) ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: homePrice === String(price) ? "#FEF2F2" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {formatCurrency(price)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Down Payment */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Down Payment
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", flex: "1", minWidth: "120px" }}>
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => handleDownPaymentPercentChange(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "36px",
                          borderRadius: "8px",
                          border: downPaymentType === "percent" ? "2px solid #DC2626" : "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                    </div>
                    <div style={{ position: "relative", flex: "1", minWidth: "140px" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={downPaymentAmount}
                        onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: downPaymentType === "amount" ? "2px solid #DC2626" : "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    {downPaymentPresets.map((pct) => (
                      <button
                        key={pct}
                        onClick={() => handleDownPaymentPercentChange(String(pct))}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: Math.abs(parseFloat(downPaymentPercent) - pct) < 0.1 ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: Math.abs(parseFloat(downPaymentPercent) - pct) < 0.1 ? "#FEF2F2" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Term & Interest Rate */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Loan Term
                    </label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      {loanTerms.map((term) => (
                        <option key={term.years} value={term.years}>{term.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Interest Rate
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.125"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "36px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                    </div>
                  </div>
                </div>

                {/* Arizona County */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🌵 Arizona County
                  </label>
                  <select
                    value={selectedCounty}
                    onChange={(e) => { setSelectedCounty(parseInt(e.target.value)); setPropertyTaxOverride(""); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #DC2626",
                      fontSize: "1rem",
                      backgroundColor: "#FEF2F2",
                      boxSizing: "border-box"
                    }}
                  >
                    {arizonaCounties.map((county, index) => (
                      <option key={index} value={index}>{county.name} - {county.rate}%</option>
                    ))}
                  </select>
                </div>

                {/* Property Tax Override */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Property Tax Rate (Optional Override)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      step="0.01"
                      value={propertyTaxOverride}
                      onChange={(e) => setPropertyTaxOverride(e.target.value)}
                      placeholder={`Using ${arizonaCounties[selectedCounty].rate}% from county`}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "36px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                  </div>
                </div>

                {/* Insurance & HOA */}
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Home Insurance (Yearly)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(e.target.value)}
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
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      HOA Fees (Monthly)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={hoaFees}
                        onChange={(e) => setHoaFees(e.target.value)}
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Monthly Payment</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Total Monthly Payment</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {formatCurrencyWithCents(totalMonthlyPayment)}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                    Loan Amount: {formatCurrency(loanAmount)}
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Payment Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F0FDF4", borderRadius: "6px" }}>
                      <span style={{ color: "#065F46" }}>Principal & Interest</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{formatCurrencyWithCents(monthlyPI)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                      <span style={{ color: "#991B1B" }}>Property Tax ({propertyTaxRate}%)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrencyWithCents(monthlyPropertyTax)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <span style={{ color: "#92400E" }}>Home Insurance</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>{formatCurrencyWithCents(monthlyInsurance)}</span>
                    </div>
                    {monthlyPMI > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F5F3FF", borderRadius: "6px" }}>
                        <span style={{ color: "#5B21B6" }}>PMI (LTV: {ltv.toFixed(1)}%)</span>
                        <span style={{ fontWeight: "600", color: "#7C3AED" }}>{formatCurrencyWithCents(monthlyPMI)}</span>
                      </div>
                    )}
                    {monthlyHOA > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>HOA Fees</span>
                        <span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrencyWithCents(monthlyHOA)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Loan Summary */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Loan Summary
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Home Price</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(homePriceNum)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Down Payment ({downPaymentPct.toFixed(1)}%)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(downPayment)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Loan Amount</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(loanAmount)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Total Interest ({loanTerm} years)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(totalInterest)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#EFF6FF", borderRadius: "6px", border: "1px solid #93C5FD" }}>
                      <span style={{ color: "#1E40AF", fontWeight: "600" }}>Total Cost of Loan</span>
                      <span style={{ fontWeight: "bold", color: "#2563EB" }}>{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* PMI Notice */}
                {ltv > 80 && (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      💡 <strong>PMI Required:</strong> Your down payment is less than 20%. PMI will be removed once you reach 20% equity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Affordability */}
        {activeTab === "affordability" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎯 Your Financial Info</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Annual Income */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Annual Gross Income
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "14px 14px 14px 28px",
                        borderRadius: "8px",
                        border: "2px solid #7C3AED",
                        fontSize: "1.1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Monthly: {formatCurrency(monthlyIncome)}
                  </p>
                </div>

                {/* Monthly Debts */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Monthly Debt Payments
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(e.target.value)}
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
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Include: car loans, student loans, credit cards, etc.
                  </p>
                </div>

                {/* Down Payment */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Available Down Payment
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={affordDownPayment}
                      onChange={(e) => setAffordDownPayment(e.target.value)}
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

                {/* Interest Rate & Term */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "120px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Interest Rate
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.125"
                        value={affordInterestRate}
                        onChange={(e) => setAffordInterestRate(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "36px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                    </div>
                  </div>
                  <div style={{ flex: "1", minWidth: "120px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Loan Term
                    </label>
                    <select
                      value={affordLoanTerm}
                      onChange={(e) => setAffordLoanTerm(parseInt(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      {loanTerms.map((term) => (
                        <option key={term.years} value={term.years}>{term.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* County */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🌵 Arizona County
                  </label>
                  <select
                    value={affordCounty}
                    onChange={(e) => setAffordCounty(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {arizonaCounties.map((county, index) => (
                      <option key={index} value={index}>{county.name}</option>
                    ))}
                  </select>
                </div>

                {/* 28/36 Rule Info */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                    💡 <strong>28/36 Rule:</strong> Housing should be ≤28% of income, total debt ≤36%.
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
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 What You Can Afford</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Maximum Home Price</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#7C3AED" }}>
                    {formatCurrency(calculateMaxHomePrice)}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6D28D9" }}>
                    With {formatCurrency(affordDownPaymentNum)} down payment
                  </p>
                </div>

                {/* Budget Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Monthly Budget Limits
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Monthly Gross Income</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(monthlyIncome)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                      <span style={{ color: "#065F46" }}>Max Housing (28%)</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>{formatCurrency(maxHousingPayment28)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <span style={{ color: "#92400E" }}>Max Total Debt (36%)</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>{formatCurrency(maxTotalDebt36)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                      <span style={{ color: "#991B1B" }}>Your Current Debts</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(monthlyDebtsNum)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "6px", border: "1px solid #C4B5FD" }}>
                      <span style={{ color: "#5B21B6", fontWeight: "600" }}>Available for Housing</span>
                      <span style={{ fontWeight: "bold", color: "#7C3AED" }}>{formatCurrency(maxHousingPayment)}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46", fontWeight: "600" }}>
                    🏠 Comfortable Range
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>
                    Consider homes between {formatCurrency(calculateMaxHomePrice * 0.8)} and {formatCurrency(calculateMaxHomePrice)} to stay within budget with room for unexpected expenses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Amortization */}
        {activeTab === "amortization" && (
          <div style={{ marginBottom: "40px" }}>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6B7280" }}>Loan Amount</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>{formatCurrency(loanAmount)}</p>
              </div>
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6B7280" }}>Monthly P&I</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>{formatCurrencyWithCents(monthlyPI)}</p>
              </div>
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6B7280" }}>Total Interest</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>{formatCurrency(totalInterest)}</p>
              </div>
              <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#6B7280" }}>Payoff Date</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#7C3AED" }}>{new Date().getFullYear() + loanTerm}</p>
              </div>
            </div>

            {/* Amortization Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Yearly Amortization Schedule</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FEF2F2" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Year</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Principal Paid</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Interest Paid</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((row, index) => (
                      <tr key={row.year} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>Year {row.year}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>{formatCurrency(row.principalPaid)}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "right", color: "#DC2626" }}>{formatCurrency(row.interestPaid)}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600" }}>{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Arizona Property Tax Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌵 Arizona Property Tax Rates by County</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF2F2" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>County</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Tax Rate</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Annual Tax on $400K Home</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Monthly Tax</th>
                </tr>
              </thead>
              <tbody>
                {arizonaCounties.map((county, index) => (
                  <tr key={index} style={{ backgroundColor: index === 0 ? "#F0FDF4" : index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: index === 0 ? "600" : "normal" }}>
                      {county.name}
                      {index === 0 && <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>Most Popular</span>}
                    </td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626", fontWeight: "600" }}>{county.rate}%</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "right" }}>{formatCurrency(400000 * county.rate / 100)}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600" }}>{formatCurrency((400000 * county.rate / 100) / 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
              Rates are approximate averages and may vary by specific location within each county.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 Arizona Mortgage Guide</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Arizona has become one of the fastest-growing states in the U.S., attracting homebuyers with its warm climate, 
                  growing job market, and relatively affordable housing compared to coastal states. Understanding Arizona&apos;s 
                  unique mortgage landscape can help you make informed decisions when purchasing a home.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Arizona Property Tax Advantages</h3>
                <p>
                  One of Arizona&apos;s biggest advantages is its low property tax rates. The average effective property tax rate 
                  is approximately <strong>0.51%</strong>, ranking as the 4th lowest in the nation. By law, the primary property 
                  tax rate for owner-occupied homes is capped at 1% of the Limited Property Value (LPV), and homeowners receive 
                  a rebate of up to $600 annually.
                </p>

                <div style={{
                  backgroundColor: "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#991B1B" }}>🌵 Arizona-Specific Benefits</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#B91C1C" }}>
                    <li>Property tax capped at 1% for owner-occupied homes</li>
                    <li>LPV can only increase 5% annually by law</li>
                    <li>Homeowner Rebate up to $600/year on school taxes</li>
                    <li>Various down payment assistance programs available</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>First-Time Homebuyer Programs</h3>
                <p>
                  Arizona offers several assistance programs for homebuyers. The <strong>HOME Plus</strong> program provides 
                  30-year fixed-rate mortgages with down payment assistance up to 5%. The <strong>Arizona Is Home</strong> 
                  program offers similar benefits in counties outside Maricopa and Pima. Maricopa County has the 
                  <strong> Home in Five</strong> program with competitive rates and assistance.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Current Market Conditions</h3>
                <p>
                  Arizona&apos;s real estate market has seen significant growth, with Phoenix, Tucson, and Mesa being among the 
                  most active markets. While home prices have stabilized after rapid increases, inventory is increasing, 
                  giving buyers more options. The conforming loan limit in Arizona is $806,500 for 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>🌵 Arizona Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#B91C1C", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Avg Property Tax:</strong> 0.51%</p>
                <p style={{ margin: 0 }}><strong>Median Home Price:</strong> $321,400</p>
                <p style={{ margin: 0 }}><strong>Loan Limit:</strong> $806,500</p>
                <p style={{ margin: 0 }}><strong>Homeownership:</strong> 69.7%</p>
              </div>
            </div>

            {/* Current Rates */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>📈 Typical Rates</h3>
              <div style={{ fontSize: "0.85rem", color: "#2563EB", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>30-Year Fixed: ~6.5-7%</p>
                <p style={{ margin: 0 }}>15-Year Fixed: ~5.5-6%</p>
                <p style={{ margin: 0 }}>5/1 ARM: ~6-6.5%</p>
              </div>
              <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#3B82F6" }}>
                *Rates vary by lender and credit score
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/arizona-mortgage-calculator" currentCategory="Finance" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only and should not be considered financial advice. 
            Actual mortgage rates, property taxes, and insurance costs may vary. Consult with a licensed mortgage professional and tax advisor 
            for accurate information specific to your situation. Property tax rates are approximate county averages.
          </p>
        </div>
      </div>
    </div>
  );
}