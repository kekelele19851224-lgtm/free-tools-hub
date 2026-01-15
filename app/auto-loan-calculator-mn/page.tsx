"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Minnesota specific data
const MN_STATE_TAX_RATE = 0.06875; // 6.875%
const METRO_TRANSIT_TAX = 0.005; // 0.5%

const metroCounties = [
  "Anoka", "Carver", "Dakota", "Hennepin", "Ramsey", "Scott", "Washington"
];

// Interest rates by credit score
const interestRates = {
  "excellent": { label: "750+ (Excellent)", newCar: 5.99, usedCar: 7.49 },
  "good": { label: "700-749 (Good)", newCar: 7.49, usedCar: 9.99 },
  "fair": { label: "650-699 (Fair)", newCar: 10.99, usedCar: 14.49 },
  "poor": { label: "600-649 (Poor)", newCar: 14.99, usedCar: 18.99 },
  "bad": { label: "Below 600", newCar: 18.99, usedCar: 22.99 }
};

// Loan terms
const loanTerms = [
  { months: 36, label: "36 months (3 years)" },
  { months: 48, label: "48 months (4 years)" },
  { months: 60, label: "60 months (5 years)" },
  { months: 72, label: "72 months (6 years)" },
  { months: 84, label: "84 months (7 years)" }
];

// FAQ data
const faqs = [
  {
    question: "How much is car sales tax in Minnesota?",
    answer: "Minnesota charges a 6.875% Motor Vehicle Sales Tax on vehicle purchases. If you're in the Twin Cities Metro Area (Anoka, Carver, Dakota, Hennepin, Ramsey, Scott, or Washington counties), an additional 0.5% transit tax applies, bringing the total to 7.375%. The tax is calculated on the vehicle price minus any trade-in value and manufacturer rebates."
  },
  {
    question: "What is the sales tax on a $30,000 car in Minnesota?",
    answer: "For a $30,000 car in Minnesota: In Greater Minnesota, the tax would be $2,062.50 (6.875%). In Metro Area counties, it would be $2,212.50 (7.375%). If you have a $5,000 trade-in, you'd only pay tax on $25,000, saving you $343.75 to $368.75 in taxes depending on location."
  },
  {
    question: "How does trade-in reduce tax in Minnesota?",
    answer: "Minnesota allows you to subtract your trade-in value from the purchase price before calculating sales tax. For example, buying a $35,000 car with a $10,000 trade-in means you only pay tax on $25,000. At 6.875%, that's $1,718.75 instead of $2,406.25 - a savings of $687.50. Manufacturer rebates also reduce your taxable amount."
  },
  {
    question: "Can I get an 84-month auto loan in Minnesota?",
    answer: "Yes, 84-month (7-year) auto loans are available in Minnesota from many lenders. While longer terms mean lower monthly payments, you'll pay significantly more in total interest. An 84-month loan at 7% on $30,000 costs about $7,900 in interest, compared to $4,400 for a 60-month loan. Consider if the lower payment is worth the extra cost."
  },
  {
    question: "What credit score do I need for a good auto loan rate in Minnesota?",
    answer: "For the best rates (around 5-7% APR), you'll need a credit score of 750 or higher. Scores of 700-749 typically get rates around 7-10%. Fair credit (650-699) may see rates of 11-15%, while scores below 650 often face rates of 15-20% or higher. Improving your score by even 50 points before buying can save thousands in interest."
  },
  {
    question: "How do I calculate my monthly car payment?",
    answer: "Monthly payment = [P × r × (1+r)^n] / [(1+r)^n - 1], where P = principal (loan amount), r = monthly interest rate (APR/12), and n = number of months. For a $25,000 loan at 7% APR for 60 months: Monthly payment = $495.03. Our calculator does this automatically and includes Minnesota taxes."
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
function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function formatCurrencyDecimal(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

// Calculate monthly payment
function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  
  const monthlyRate = annualRate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return payment;
}

// Calculate total interest
function calculateTotalInterest(monthlyPayment: number, months: number, principal: number): number {
  return (monthlyPayment * months) - principal;
}

export default function AutoLoanCalculatorMN() {
  const [activeTab, setActiveTab] = useState<"payment" | "payoff">("payment");
  
  // Tab 1: Car Payment Calculator State
  const [vehiclePrice, setVehiclePrice] = useState<string>("35000");
  const [downPayment, setDownPayment] = useState<string>("5000");
  const [tradeInValue, setTradeInValue] = useState<string>("0");
  const [rebates, setRebates] = useState<string>("0");
  const [creditScore, setCreditScore] = useState<string>("good");
  const [carType, setCarType] = useState<string>("new");
  const [customRate, setCustomRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("60");
  const [location, setLocation] = useState<string>("metro");
  const [includeTax, setIncludeTax] = useState<boolean>(true);
  
  // Tab 2: Early Payoff Calculator State
  const [currentBalance, setCurrentBalance] = useState<string>("25000");
  const [currentPayment, setCurrentPayment] = useState<string>("450");
  const [currentRate, setCurrentRate] = useState<string>("7.5");
  const [remainingMonths, setRemainingMonths] = useState<string>("48");
  const [extraMonthly, setExtraMonthly] = useState<string>("100");
  const [oneTimePayment, setOneTimePayment] = useState<string>("0");

  // Tab 1 Calculations
  const vehiclePriceNum = parseFloat(vehiclePrice) || 0;
  const downPaymentNum = parseFloat(downPayment) || 0;
  const tradeInNum = parseFloat(tradeInValue) || 0;
  const rebatesNum = parseFloat(rebates) || 0;
  const loanTermNum = parseInt(loanTerm) || 60;
  
  // Calculate tax
  const taxableAmount = Math.max(0, vehiclePriceNum - tradeInNum - rebatesNum);
  const taxRate = location === "metro" ? MN_STATE_TAX_RATE + METRO_TRANSIT_TAX : MN_STATE_TAX_RATE;
  const salesTax = includeTax ? taxableAmount * taxRate : 0;
  
  // Get interest rate
  const rateData = interestRates[creditScore as keyof typeof interestRates];
  const baseRate = carType === "new" ? rateData.newCar : rateData.usedCar;
  const interestRate = customRate ? parseFloat(customRate) : baseRate;
  
  // Calculate loan amount
  const loanAmount = Math.max(0, vehiclePriceNum + salesTax - downPaymentNum - tradeInNum);
  
  // Calculate monthly payment
  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermNum);
  const totalInterest = calculateTotalInterest(monthlyPayment, loanTermNum, loanAmount);
  const totalCost = vehiclePriceNum + salesTax + totalInterest;
  
  // Tab 2 Calculations
  const currentBalanceNum = parseFloat(currentBalance) || 0;
  const currentPaymentNum = parseFloat(currentPayment) || 0;
  const currentRateNum = parseFloat(currentRate) || 0;
  const remainingMonthsNum = parseInt(remainingMonths) || 0;
  const extraMonthlyNum = parseFloat(extraMonthly) || 0;
  const oneTimePaymentNum = parseFloat(oneTimePayment) || 0;
  
  // Calculate original payoff
  const originalTotalPaid = currentPaymentNum * remainingMonthsNum;
  const originalInterest = originalTotalPaid - currentBalanceNum;
  
  // Calculate new payoff with extra payments
  const newBalance = currentBalanceNum - oneTimePaymentNum;
  const newMonthlyPayment = currentPaymentNum + extraMonthlyNum;
  
  // Calculate months to payoff with extra payments
  let balance = newBalance;
  let monthsToPayoff = 0;
  let totalPaidWithExtra = oneTimePaymentNum;
  const monthlyRate = currentRateNum / 100 / 12;
  
  while (balance > 0 && monthsToPayoff < 360) {
    const interestCharge = balance * monthlyRate;
    const principalPayment = Math.min(newMonthlyPayment - interestCharge, balance);
    balance -= principalPayment;
    totalPaidWithExtra += newMonthlyPayment;
    monthsToPayoff++;
    if (principalPayment <= 0) break;
  }
  
  const interestWithExtra = totalPaidWithExtra - currentBalanceNum;
  const interestSaved = Math.max(0, originalInterest - interestWithExtra);
  const monthsSaved = Math.max(0, remainingMonthsNum - monthsToPayoff);

  const tabs = [
    { id: "payment", label: "Car Payment Calculator", icon: "🚗" },
    { id: "payoff", label: "Early Payoff Calculator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Auto Loan Calculator MN</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚗</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Auto Loan Calculator MN
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your car payment in Minnesota with accurate state taxes. Includes 6.875% MN sales tax, 
            Metro Area transit tax, trade-in credit, and early payoff savings.
          </p>
        </div>

        {/* Quick Tax Info Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📋</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 8px 0" }}>Minnesota Auto Tax Rates (2024-2025)</p>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "0.9rem", color: "#1D4ED8" }}>
                <span><strong>State Tax:</strong> 6.875%</span>
                <span><strong>Metro Area:</strong> +0.5% (Total 7.375%)</span>
                <span><strong>Trade-ins & Rebates:</strong> Reduce taxable amount</span>
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
                backgroundColor: activeTab === tab.id ? "#1E40AF" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "payment" && "🚗 Loan Details"}
                {activeTab === "payoff" && "💰 Current Loan Info"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* CAR PAYMENT TAB */}
              {activeTab === "payment" && (
                <>
                  {/* Vehicle Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Vehicle Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Down Payment & Trade-in */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Down Payment
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Trade-in Value
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={tradeInValue}
                          onChange={(e) => setTradeInValue(e.target.value)}
                          style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rebates */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Manufacturer Rebates
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={rebates}
                        onChange={(e) => setRebates(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#059669", margin: "4px 0 0 0" }}>
                      ✓ Trade-in and rebates reduce your taxable amount in MN
                    </p>
                  </div>

                  {/* Car Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Vehicle Type
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setCarType("new")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: carType === "new" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: carType === "new" ? "#EFF6FF" : "white",
                          color: carType === "new" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🚙 New Car
                      </button>
                      <button
                        onClick={() => setCarType("used")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: carType === "used" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: carType === "used" ? "#EFF6FF" : "white",
                          color: carType === "used" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🚗 Used Car
                      </button>
                    </div>
                  </div>

                  {/* Credit Score */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Credit Score Range
                    </label>
                    <select
                      value={creditScore}
                      onChange={(e) => setCreditScore(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(interestRates).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label} - {carType === "new" ? value.newCar : value.usedCar}% APR
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Rate Option */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Or Enter Custom APR (%)
                    </label>
                    <input
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder={`Default: ${baseRate}%`}
                      step="0.01"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Loan Term */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Loan Term
                    </label>
                    <select
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {loanTerms.map((term) => (
                        <option key={term.months} value={term.months}>{term.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Registration Location
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setLocation("metro")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: location === "metro" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: location === "metro" ? "#EFF6FF" : "white",
                          color: location === "metro" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        🏙️ Metro Area<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>7.375% tax</span>
                      </button>
                      <button
                        onClick={() => setLocation("greater")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: location === "greater" ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: location === "greater" ? "#EFF6FF" : "white",
                          color: location === "greater" ? "#1E40AF" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        🌲 Greater MN<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>6.875% tax</span>
                      </button>
                    </div>
                    {location === "metro" && (
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "6px 0 0 0" }}>
                        Metro counties: Anoka, Carver, Dakota, Hennepin, Ramsey, Scott, Washington
                      </p>
                    )}
                  </div>

                  {/* Include Tax */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={includeTax}
                        onChange={(e) => setIncludeTax(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                        Include MN Sales Tax in Loan
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* EARLY PAYOFF TAB */}
              {activeTab === "payoff" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "16px", padding: "10px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    💡 See how extra payments can help you pay off your loan faster and save on interest.
                  </p>

                  {/* Current Balance */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Current Loan Balance
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={currentBalance}
                        onChange={(e) => setCurrentBalance(e.target.value)}
                        style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Current Payment & Rate */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Monthly Payment
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={currentPayment}
                          onChange={(e) => setCurrentPayment(e.target.value)}
                          style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        value={currentRate}
                        onChange={(e) => setCurrentRate(e.target.value)}
                        step="0.01"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Remaining Months */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Remaining Months
                    </label>
                    <input
                      type="number"
                      value={remainingMonths}
                      onChange={(e) => setRemainingMonths(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Extra Payments Section */}
                  <div style={{ padding: "16px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #6EE7B7" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#065F46", marginBottom: "12px", fontWeight: "600" }}>
                      💰 Extra Payments
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#047857", marginBottom: "4px" }}>
                          Extra Monthly
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.85rem" }}>$</span>
                          <input
                            type="number"
                            value={extraMonthly}
                            onChange={(e) => setExtraMonthly(e.target.value)}
                            style={{ width: "100%", padding: "8px 8px 8px 24px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.85rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#047857", marginBottom: "4px" }}>
                          One-Time Payment
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.85rem" }}>$</span>
                          <input
                            type="number"
                            value={oneTimePayment}
                            onChange={(e) => setOneTimePayment(e.target.value)}
                            style={{ width: "100%", padding: "8px 8px 8px 24px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.85rem", boxSizing: "border-box" }}
                          />
                        </div>
                      </div>
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
                {activeTab === "payment" && "📊 Your Car Payment"}
                {activeTab === "payoff" && "📊 Payoff Analysis"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* PAYMENT RESULTS */}
              {activeTab === "payment" && (
                <>
                  {/* Monthly Payment */}
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
                      {formatCurrencyDecimal(monthlyPayment)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {loanTermNum} months at {interestRate}% APR
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>Vehicle Price</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(vehiclePriceNum)}</span>
                      </div>
                      {tradeInNum > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>- Trade-in Value</span>
                          <span style={{ fontWeight: "600", color: "#059669" }}>-{formatCurrency(tradeInNum)}</span>
                        </div>
                      )}
                      {rebatesNum > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>- Rebates</span>
                          <span style={{ fontWeight: "600", color: "#059669" }}>-{formatCurrency(rebatesNum)}</span>
                        </div>
                      )}
                      {includeTax && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#4B5563" }}>+ MN Sales Tax ({(taxRate * 100).toFixed(3)}%)</span>
                          <span style={{ fontWeight: "600", color: "#DC2626" }}>+{formatCurrency(salesTax)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#4B5563" }}>- Down Payment</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>-{formatCurrency(downPaymentNum)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ fontWeight: "600" }}>Loan Amount</span>
                        <span style={{ fontWeight: "bold", color: "#1E40AF" }}>{formatCurrency(loanAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Cost Summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF2F2", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#991B1B" }}>Total Interest</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#DC2626" }}>
                        {formatCurrency(totalInterest)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Total Cost</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {formatCurrency(totalCost)}
                      </p>
                    </div>
                  </div>

                  {/* Tax Savings Note */}
                  {(tradeInNum > 0 || rebatesNum > 0) && includeTax && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        💰 <strong>Tax Savings:</strong> Your trade-in and rebates saved you {formatCurrency((tradeInNum + rebatesNum) * taxRate)} in MN sales tax!
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* PAYOFF RESULTS */}
              {activeTab === "payoff" && (
                <>
                  {/* Savings Summary */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Interest Saved
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(interestSaved)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Pay off <strong>{monthsSaved} months earlier</strong>
                    </p>
                  </div>

                  {/* Comparison */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Payoff Comparison</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem" }}>
                      <div>
                        <p style={{ color: "#6B7280", margin: "0 0 8px 0", fontWeight: "600" }}>Original Plan</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Time to payoff:</span>
                          <span>{remainingMonthsNum} months</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Total interest:</span>
                          <span>{formatCurrency(originalInterest)}</span>
                        </div>
                      </div>
                      <div>
                        <p style={{ color: "#059669", margin: "0 0 8px 0", fontWeight: "600" }}>With Extra Payments</p>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Time to payoff:</span>
                          <span style={{ color: "#059669", fontWeight: "600" }}>{monthsToPayoff} months</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span>Total interest:</span>
                          <span style={{ color: "#059669", fontWeight: "600" }}>{formatCurrency(interestWithExtra)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New Payment Info */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid #BFDBFE" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.85rem", color: "#1E40AF" }}>New Monthly Payment:</span>
                      <span style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#2563EB" }}>
                        {formatCurrencyDecimal(newMonthlyPayment)}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#1D4ED8" }}>
                      (Original {formatCurrency(currentPaymentNum)} + Extra {formatCurrency(extraMonthlyNum)})
                    </p>
                  </div>

                  {/* Tips */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#92400E" }}>💡 Tips</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#B45309", lineHeight: "1.6" }}>
                      <li>Even $50/month extra can save hundreds in interest</li>
                      <li>One-time payments (tax refund, bonus) have big impact</li>
                      <li>Check for prepayment penalties before paying extra</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Interest Rate Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Auto Loan Interest Rates by Credit Score</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Credit Score</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>New Car APR</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Used Car APR</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(interestRates).map(([key, data], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{data.label}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669" }}>{data.newCar}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>{data.usedCar}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>
                      {key === "excellent" && "Best rates, shop multiple lenders"}
                      {key === "good" && "Good rates, room for negotiation"}
                      {key === "fair" && "Consider credit improvement first"}
                      {key === "poor" && "High rates, large down payment helps"}
                      {key === "bad" && "May require cosigner or subprime lender"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Rates are estimates based on national averages. Actual rates depend on lender, loan term, and individual factors.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🚗 Minnesota Auto Loan Guide</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>Minnesota Car Sales Tax Explained</h3>
                <p>
                  Minnesota charges a <strong>6.875% Motor Vehicle Sales Tax</strong> on all vehicle purchases. 
                  This rate increased from 6.5% in July 2023. If you live in the Twin Cities Metro Area 
                  (Anoka, Carver, Dakota, Hennepin, Ramsey, Scott, or Washington counties), an additional 
                  0.5% transit tax applies, bringing your total to 7.375%.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Trade-Ins Save You Money</h3>
                <p>
                  Minnesota allows you to subtract your trade-in value from the purchase price before calculating 
                  sales tax. This is a significant benefit. For example, on a $35,000 car with a $10,000 trade-in, 
                  you only pay tax on $25,000. At 7.375%, that saves you $737.50 in taxes. Manufacturer rebates 
                  work the same way - they reduce your taxable amount.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Loan Term</h3>
                <p>
                  While 72 and 84-month loans offer lower monthly payments, they cost significantly more in total 
                  interest. A $30,000 loan at 7% APR costs $4,400 in interest over 60 months, but $7,900 over 
                  84 months - that&apos;s $3,500 more! We recommend the shortest term you can afford to minimize 
                  total cost and avoid being &quot;upside down&quot; on your loan.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>🏷️ MN Tax Quick Reference</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>State Tax Rate</span>
                  <span style={{ fontWeight: "600" }}>6.875%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>Metro Transit Tax</span>
                  <span style={{ fontWeight: "600" }}>+0.5%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #BFDBFE" }}>
                  <span>Metro Total</span>
                  <span style={{ fontWeight: "600" }}>7.375%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Greater MN Total</span>
                  <span style={{ fontWeight: "600" }}>6.875%</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ Money-Saving Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Maximize your trade-in value</li>
                <li>Ask about manufacturer rebates</li>
                <li>Shop multiple lenders for rates</li>
                <li>Choose shorter loan terms</li>
                <li>Make extra payments when possible</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/auto-loan-calculator-mn" currentCategory="Finance" />
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
            🚗 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
            Actual loan terms, interest rates, and taxes may vary. Tax rates are current as of 2024-2025. 
            Always verify with your lender and the Minnesota Department of Revenue for accurate figures.
          </p>
        </div>
      </div>
    </div>
  );
}