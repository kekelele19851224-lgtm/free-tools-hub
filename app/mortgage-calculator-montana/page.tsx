"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Montana county tax rates
const montanaCounties: Record<string, { name: string; rate: number; medianHome: number }> = {
  "missoula": { name: "Missoula County", rate: 0.94, medianHome: 382400 },
  "gallatin": { name: "Gallatin County", rate: 0.74, medianHome: 526700 },
  "yellowstone": { name: "Yellowstone County", rate: 0.88, medianHome: 289300 },
  "cascade": { name: "Cascade County", rate: 0.95, medianHome: 227600 },
  "flathead": { name: "Flathead County", rate: 0.72, medianHome: 429600 },
  "lewis_clark": { name: "Lewis and Clark County", rate: 0.95, medianHome: 304100 },
  "ravalli": { name: "Ravalli County", rate: 0.77, medianHome: 386500 },
  "silver_bow": { name: "Silver Bow County", rate: 1.03, medianHome: 196400 },
  "lake": { name: "Lake County", rate: 0.69, medianHome: 328000 },
  "lincoln": { name: "Lincoln County", rate: 0.73, medianHome: 285000 },
  "park": { name: "Park County", rate: 0.71, medianHome: 385000 },
  "beaverhead": { name: "Beaverhead County", rate: 0.82, medianHome: 265000 },
  "big_horn": { name: "Big Horn County", rate: 0.91, medianHome: 165000 },
  "hill": { name: "Hill County", rate: 0.89, medianHome: 175000 },
  "custer": { name: "Custer County", rate: 0.87, medianHome: 195000 },
  "other": { name: "Other / State Average", rate: 0.79, medianHome: 300000 },
};

// FAQ data
const faqs = [
  {
    question: "How much income do you need to be approved for a $400,000 mortgage?",
    answer: "To afford a $400,000 mortgage, you typically need an annual income of around $100,000-$120,000 using the 28% rule (housing costs shouldn't exceed 28% of gross income). With a 20% down payment ($80,000), 7% interest rate, and 30-year term, your monthly P&I would be about $2,129. Add property taxes and insurance, and you're looking at roughly $2,600-$2,800/month total."
  },
  {
    question: "How much of a house can I afford if I make $70,000 a year?",
    answer: "With a $70,000 annual income, using the 28% rule, you can afford about $1,633/month for housing. This typically translates to a home price of $250,000-$300,000, depending on your down payment, interest rate, property taxes, and other debts. In Montana, with lower property tax rates (0.79% average), you may be able to afford slightly more than in higher-tax states."
  },
  {
    question: "What is the monthly payment on a $400,000 loan at 7%?",
    answer: "A $400,000 loan at 7% interest for 30 years has a principal and interest payment of $2,661/month. For a 15-year term, it would be $3,595/month. These figures don't include property taxes, insurance, or PMI. In Montana, add approximately $263/month for property taxes (at 0.79% rate) and $100-150/month for homeowners insurance."
  },
  {
    question: "How much is a $300,000 mortgage payment for 30 years?",
    answer: "A $300,000 mortgage for 30 years at current rates (around 7%) would have a principal and interest payment of approximately $1,996/month. With Montana's average property tax rate of 0.79%, add about $198/month for taxes. Including homeowners insurance (~$100/month), your total payment would be around $2,300-$2,400/month."
  },
  {
    question: "What is the property tax rate in Montana?",
    answer: "Montana's average effective property tax rate is 0.79%, which is lower than the national average of 0.90%. However, rates vary by county: Missoula County is 0.94%, Gallatin County is 0.74%, Yellowstone County is 0.88%, and Cascade County is 0.95%. Montana also has no sales tax, which can offset housing costs compared to other states."
  },
  {
    question: "Do I need PMI for a Montana mortgage?",
    answer: "Yes, if your down payment is less than 20% of the home's purchase price, you'll typically need Private Mortgage Insurance (PMI) on a conventional loan. PMI usually costs 0.5%-1% of the loan amount annually. For example, on a $300,000 loan, PMI might be $125-$250/month. PMI can be removed once you reach 20% equity in your home."
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Calculate monthly P&I payment
function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  if (annualRate <= 0) return principal / (termYears * 12);
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  const payment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  
  return payment;
}

// Calculate PMI
function calculatePMI(loanAmount: number, homeValue: number): number {
  if (homeValue <= 0) return 0;
  const ltv = loanAmount / homeValue;
  if (ltv <= 0.80) return 0;
  const annualPMI = loanAmount * 0.0075;
  return annualPMI / 12;
}

// Generate amortization schedule
function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number
): Array<{ year: number; principalPaid: number; interestPaid: number; balance: number }> {
  if (principal <= 0 || termYears <= 0 || annualRate <= 0) return [];
  
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  
  const schedule = [];
  let balance = principal;
  let yearPrincipal = 0;
  let yearInterest = 0;
  
  for (let month = 1; month <= termYears * 12; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    yearPrincipal += principalPayment;
    yearInterest += interestPayment;
    
    if (month % 12 === 0) {
      schedule.push({
        year: month / 12,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        balance: Math.max(0, balance)
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }
  
  return schedule;
}

// Calculate affordability
function calculateAffordability(
  annualIncome: number,
  monthlyDebts: number,
  downPayment: number,
  annualRate: number,
  termYears: number,
  propertyTaxRate: number
): { maxHomePrice: number; maxLoan: number; maxPayment: number; dti: number } {
  const monthlyIncome = annualIncome / 12;
  
  const maxHousingPayment28 = monthlyIncome * 0.28;
  const maxTotalDebt36 = monthlyIncome * 0.36;
  const availableForHousing = maxTotalDebt36 - monthlyDebts;
  
  const maxPayment = Math.min(maxHousingPayment28, availableForHousing);
  
  // Estimate taxes + insurance as ~1.2% of home value annually
  const taxInsuranceRate = (propertyTaxRate + 0.35) / 100 / 12;
  
  // Iterative calculation to find max home price
  let maxHomePrice = 0;
  for (let price = 50000; price <= 2000000; price += 10000) {
    const loan = price - downPayment;
    if (loan <= 0) continue;
    
    const pi = calculateMonthlyPayment(loan, annualRate, termYears);
    const taxInsurance = price * taxInsuranceRate;
    const pmi = calculatePMI(loan, price);
    const totalPayment = pi + taxInsurance + pmi;
    
    if (totalPayment <= maxPayment) {
      maxHomePrice = price;
    } else {
      break;
    }
  }
  
  const maxLoan = Math.max(0, maxHomePrice - downPayment);
  const dti = monthlyIncome > 0 ? ((maxPayment + monthlyDebts) / monthlyIncome) * 100 : 0;
  
  return { maxHomePrice, maxLoan, maxPayment, dti };
}

export default function MortgageCalculatorMontana() {
  const [activeTab, setActiveTab] = useState<"payment" | "affordability" | "amortization">("payment");
  
  // Payment calculator state
  const [homePrice, setHomePrice] = useState<string>("400000");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>("20");
  const [loanTerm, setLoanTerm] = useState<string>("30");
  const [interestRate, setInterestRate] = useState<string>("7");
  const [county, setCounty] = useState<string>("missoula");
  const [annualInsurance, setAnnualInsurance] = useState<string>("1400");
  const [monthlyHOA, setMonthlyHOA] = useState<string>("0");
  
  // Affordability calculator state
  const [annualIncome, setAnnualIncome] = useState<string>("80000");
  const [monthlyDebts, setMonthlyDebts] = useState<string>("500");
  const [affDownPayment, setAffDownPayment] = useState<string>("60000");
  const [affRate, setAffRate] = useState<string>("7");
  const [affTerm, setAffTerm] = useState<string>("30");
  const [affCounty, setAffCounty] = useState<string>("missoula");

  // Payment calculations
  const homePriceNum = parseFloat(homePrice) || 0;
  const downPaymentNum = homePriceNum * (parseFloat(downPaymentPercent) || 0) / 100;
  const loanAmount = homePriceNum - downPaymentNum;
  const termYears = parseInt(loanTerm) || 30;
  const rate = parseFloat(interestRate) || 0;
  const taxRate = montanaCounties[county]?.rate || 0.79;
  
  const principalInterest = calculateMonthlyPayment(loanAmount, rate, termYears);
  const monthlyTax = (homePriceNum * taxRate / 100) / 12;
  const monthlyInsurance = (parseFloat(annualInsurance) || 0) / 12;
  const pmi = calculatePMI(loanAmount, homePriceNum);
  const hoa = parseFloat(monthlyHOA) || 0;
  
  const totalMonthlyPayment = principalInterest + monthlyTax + monthlyInsurance + pmi + hoa;
  const totalInterest = (principalInterest * termYears * 12) - loanAmount;
  
  // Affordability calculations
  const affTaxRate = montanaCounties[affCounty]?.rate || 0.79;
  const affordability = calculateAffordability(
    parseFloat(annualIncome) || 0,
    parseFloat(monthlyDebts) || 0,
    parseFloat(affDownPayment) || 0,
    parseFloat(affRate) || 7,
    parseInt(affTerm) || 30,
    affTaxRate
  );
  
  // Amortization schedule
  const amortizationSchedule = generateAmortizationSchedule(loanAmount, rate, termYears);
  
  // Payment breakdown for pie chart visualization
  const paymentBreakdown = [
    { label: "Principal & Interest", value: principalInterest, color: "#2563EB" },
    { label: "Property Tax", value: monthlyTax, color: "#059669" },
    { label: "Home Insurance", value: monthlyInsurance, color: "#F59E0B" },
    { label: "PMI", value: pmi, color: "#EF4444" },
    { label: "HOA", value: hoa, color: "#8B5CF6" },
  ].filter(item => item.value > 0);

  const tabs = [
    { id: "payment", label: "Payment Calculator", icon: "💵" },
    { id: "affordability", label: "Affordability", icon: "🏠" },
    { id: "amortization", label: "Amortization", icon: "📊" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Montana Mortgage Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Montana Mortgage Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your monthly mortgage payment with Montana-specific property tax rates. 
            Includes principal, interest, taxes, insurance, PMI, and HOA fees.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Montana Advantage</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Montana has <strong>no sales tax</strong> and property tax rates average <strong>0.79%</strong> (lower than the 0.90% national average). 
                This calculator uses county-specific tax rates for accurate estimates.
              </p>
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
                backgroundColor: activeTab === tab.id ? "#2563EB" : "#E5E7EB",
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

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "payment" && "💵 Loan Details"}
                {activeTab === "affordability" && "🏠 Your Finances"}
                {activeTab === "amortization" && "📊 Loan Information"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* PAYMENT CALCULATOR TAB */}
              {(activeTab === "payment" || activeTab === "amortization") && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Home Price ($)
                    </label>
                    <input
                      type="number"
                      value={homePrice}
                      onChange={(e) => setHomePrice(e.target.value)}
                      placeholder="400000"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[250000, 350000, 450000, 550000].map(price => (
                        <button
                          key={price}
                          onClick={() => setHomePrice(price.toString())}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: homePrice === price.toString() ? "#EFF6FF" : "white",
                            color: "#2563EB",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${(price/1000)}K
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Down Payment (%)
                    </label>
                    <input
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(e.target.value)}
                      placeholder="20"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      = {formatCurrency(downPaymentNum)} ({parseFloat(downPaymentPercent) < 20 && <span style={{ color: "#DC2626" }}>PMI required</span>})
                    </p>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Loan Term
                      </label>
                      <select
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.125"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="7"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Montana County
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.entries(montanaCounties).map(([key, data]) => (
                        <option key={key} value={key}>{data.name} ({data.rate}%)</option>
                      ))}
                    </select>
                  </div>
                  
                  {activeTab === "payment" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                          Annual Insurance ($)
                        </label>
                        <input
                          type="number"
                          value={annualInsurance}
                          onChange={(e) => setAnnualInsurance(e.target.value)}
                          placeholder="1400"
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                          Monthly HOA ($)
                        </label>
                        <input
                          type="number"
                          value={monthlyHOA}
                          onChange={(e) => setMonthlyHOA(e.target.value)}
                          placeholder="0"
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* AFFORDABILITY TAB */}
              {activeTab === "affordability" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Annual Gross Income ($)
                    </label>
                    <input
                      type="number"
                      value={annualIncome}
                      onChange={(e) => setAnnualIncome(e.target.value)}
                      placeholder="80000"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[50000, 70000, 100000, 150000].map(income => (
                        <button
                          key={income}
                          onClick={() => setAnnualIncome(income.toString())}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: annualIncome === income.toString() ? "#EFF6FF" : "white",
                            color: "#2563EB",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${(income/1000)}K
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Monthly Debts ($)
                    </label>
                    <input
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(e.target.value)}
                      placeholder="500"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                      Car payments, student loans, credit cards, etc.
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Down Payment Available ($)
                    </label>
                    <input
                      type="number"
                      value={affDownPayment}
                      onChange={(e) => setAffDownPayment(e.target.value)}
                      placeholder="60000"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.125"
                        value={affRate}
                        onChange={(e) => setAffRate(e.target.value)}
                        placeholder="7"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Loan Term
                      </label>
                      <select
                        value={affTerm}
                        onChange={(e) => setAffTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Montana County
                    </label>
                    <select
                      value={affCounty}
                      onChange={(e) => setAffCounty(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.entries(montanaCounties).map(([key, data]) => (
                        <option key={key} value={key}>{data.name} ({data.rate}%)</option>
                      ))}
                    </select>
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
                {activeTab === "payment" && "📋 Monthly Payment"}
                {activeTab === "affordability" && "🏠 How Much Can You Afford"}
                {activeTab === "amortization" && "📊 Loan Summary"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* PAYMENT RESULTS */}
              {activeTab === "payment" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Monthly Payment
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(totalMonthlyPayment)}
                    </p>
                  </div>

                  {/* Payment Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Payment Breakdown</h4>
                    {paymentBreakdown.map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: item.color }} />
                          <span style={{ color: "#4B5563", fontSize: "0.85rem" }}>{item.label}</span>
                        </div>
                        <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.85rem" }}>{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #D1D5DB", paddingTop: "8px", marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>Total</span>
                      <span style={{ fontWeight: "bold", color: "#059669" }}>{formatCurrency(totalMonthlyPayment)}</span>
                    </div>
                  </div>

                  {/* Loan Summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#1E40AF" }}>Loan Amount</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: "bold", color: "#2563EB" }}>
                        {formatCurrency(loanAmount)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400E" }}>Total Interest</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: "bold", color: "#B45309" }}>
                        {formatCurrency(totalInterest)}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* AFFORDABILITY RESULTS */}
              {activeTab === "affordability" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Maximum Home Price
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(affordability.maxHomePrice)}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#1E40AF" }}>Max Loan Amount</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: "bold", color: "#2563EB" }}>
                        {formatCurrency(affordability.maxLoan)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400E" }}>Max Monthly Payment</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: "bold", color: "#B45309" }}>
                        {formatCurrency(affordability.maxPayment)}
                      </p>
                    </div>
                  </div>

                  {/* DTI Info */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📊 28/36 Rule Applied</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Max Housing (28% of income):</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency((parseFloat(annualIncome) || 0) / 12 * 0.28)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Max Total Debt (36% of income):</span>
                        <span style={{ fontWeight: "500" }}>{formatCurrency((parseFloat(annualIncome) || 0) / 12 * 0.36)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Your DTI Ratio:</span>
                        <span style={{ fontWeight: "600", color: affordability.dti <= 36 ? "#059669" : "#DC2626" }}>
                          {affordability.dti.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#1E40AF" }}>
                      💡 <strong>Tip:</strong> Lenders typically want your housing payment under 28% of gross income and total debts under 36%.
                    </p>
                  </div>
                </>
              )}

              {/* AMORTIZATION RESULTS */}
              {activeTab === "amortization" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#1E40AF" }}>Loan Amount</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", fontWeight: "bold", color: "#2563EB" }}>
                        {formatCurrency(loanAmount)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#065F46" }}>Monthly P&I</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", fontWeight: "bold", color: "#059669" }}>
                        {formatCurrency(principalInterest)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#92400E" }}>Total Interest</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.95rem", fontWeight: "bold", color: "#B45309" }}>
                        {formatCurrency(totalInterest)}
                      </p>
                    </div>
                  </div>

                  {/* Visual Balance Chart */}
                  {amortizationSchedule.length > 0 && (
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📉 Balance Over Time</h4>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "100px" }}>
                        {amortizationSchedule.filter((_, i) => i % Math.ceil(amortizationSchedule.length / 15) === 0).map((data, idx) => (
                          <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                              width: "100%",
                              backgroundColor: "#2563EB",
                              borderRadius: "2px 2px 0 0",
                              height: `${(data.balance / loanAmount) * 100}px`,
                              minHeight: "2px"
                            }} />
                            <span style={{ fontSize: "0.55rem", color: "#6B7280", marginTop: "2px" }}>Y{data.year}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: "0.8rem", color: "#6B7280", textAlign: "center" }}>
                    See full amortization table below ↓
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Amortization Table (shown on amortization tab) */}
        {activeTab === "amortization" && amortizationSchedule.length > 0 && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "40px"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Yearly Amortization Schedule</h2>
            </div>
            <div style={{ padding: "24px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#EFF6FF" }}>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Year</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Principal Paid</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Interest Paid</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right" }}>Remaining Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {amortizationSchedule.slice(0, 10).map((data, idx) => (
                    <tr key={data.year} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>Year {data.year}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>{formatCurrency(data.principalPaid)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", color: "#DC2626" }}>{formatCurrency(data.interestPaid)}</td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600" }}>{formatCurrency(data.balance)}</td>
                    </tr>
                  ))}
                  {amortizationSchedule.length > 10 && (
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <td colSpan={4} style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>
                        ... {amortizationSchedule.length - 10} more years ...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Montana County Tax Rates Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📍 Montana County Property Tax Rates</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>County</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Tax Rate</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Median Home</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Annual Tax</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(montanaCounties).slice(0, 10).map(([key, data], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{data.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{data.rate}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(data.medianHome)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#B45309" }}>
                      {formatCurrency(data.medianHome * data.rate / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
              * Montana state average: 0.79% (lower than national average of 0.90%)
            </p>
          </div>
        </div>

        {/* Quick Reference Tables */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💵 Quick Payment Reference (30-Year @ 7%)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Home Price</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>20% Down</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Loan Amount</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>P&I Payment</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { price: 250000, down: 50000, loan: 200000, pi: 1331 },
                  { price: 300000, down: 60000, loan: 240000, pi: 1597 },
                  { price: 400000, down: 80000, loan: 320000, pi: 2129 },
                  { price: 500000, down: 100000, loan: 400000, pi: 2661 },
                  { price: 600000, down: 120000, loan: 480000, pi: 3194 },
                ].map((row, idx) => (
                  <tr key={row.price} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>{formatCurrency(row.price)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(row.down)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(row.loan)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{formatCurrency(row.pi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
              * Principal & Interest only. Add property taxes (~0.79%) and insurance (~$100-150/mo) for total payment.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 Understanding Your Montana Mortgage</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>How Monthly Payments Are Calculated</h3>
                <p>
                  Your monthly mortgage payment consists of four main components, often called PITI: 
                  <strong> Principal</strong> (the amount you borrowed), <strong>Interest</strong> (the cost of borrowing), 
                  <strong> Taxes</strong> (property taxes), and <strong>Insurance</strong> (homeowners insurance). 
                  If your down payment is less than 20%, you&apos;ll also pay PMI (Private Mortgage Insurance).
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 28/36 Rule</h3>
                <p>
                  Most lenders follow the 28/36 rule when determining how much you can borrow. 
                  Your housing costs (including mortgage, taxes, and insurance) shouldn&apos;t exceed <strong>28%</strong> of 
                  your gross monthly income. Your total debt payments shouldn&apos;t exceed <strong>36%</strong> of 
                  your gross monthly income.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Montana Property Tax Advantage</h3>
                <p>
                  Montana homeowners benefit from property tax rates that are lower than the national average. 
                  The state average is <strong>0.79%</strong> compared to the national average of <strong>0.90%</strong>. 
                  Additionally, Montana has <strong>no state sales tax</strong>, which can make overall living costs more affordable.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>🎯 Affordability by Income</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>$50K/yr → ~$200K home</p>
                <p style={{ margin: 0 }}>$70K/yr → ~$280K home</p>
                <p style={{ margin: 0 }}>$100K/yr → ~$400K home</p>
                <p style={{ margin: 0 }}>$150K/yr → ~$600K home</p>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#3B82F6", marginTop: "12px" }}>
                *Based on 28% rule, 20% down, 7% rate
              </p>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>🌟 Montana Benefits</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>No state sales tax</li>
                <li>Lower property taxes (0.79%)</li>
                <li>2025 property tax rebate ($400)</li>
                <li>Homestead exemption available</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/mortgage-calculator-montana" currentCategory="Finance" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
            Actual mortgage payments may vary based on your credit score, lender requirements, and other factors. 
            Property tax rates are approximate and may change. Consult with a mortgage lender for accurate quotes.
          </p>
        </div>
      </div>
    </div>
  );
}