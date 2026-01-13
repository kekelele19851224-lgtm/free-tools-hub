"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Toyota models with 2026 MSRP prices
const toyotaModels = [
  { id: "corolla", name: "Corolla", msrp: 23500, type: "Sedan", icon: "🚗" },
  { id: "corolla_cross", name: "Corolla Cross", msrp: 24500, type: "SUV", icon: "🚙" },
  { id: "camry", name: "Camry", msrp: 29100, type: "Sedan", icon: "🚗" },
  { id: "rav4", name: "RAV4", msrp: 31900, type: "SUV", icon: "🚙" },
  { id: "tacoma", name: "Tacoma", msrp: 31590, type: "Truck", icon: "🛻" },
  { id: "highlander", name: "Highlander", msrp: 40500, type: "SUV", icon: "🚙" },
  { id: "4runner", name: "4Runner", msrp: 42000, type: "SUV", icon: "🚙" },
  { id: "tundra", name: "Tundra", msrp: 42000, type: "Truck", icon: "🛻" },
  { id: "sienna", name: "Sienna", msrp: 40120, type: "Minivan", icon: "🚐" },
  { id: "gr86", name: "GR86", msrp: 30300, type: "Sports", icon: "🏎️" },
  { id: "prius", name: "Prius", msrp: 28545, type: "Hybrid", icon: "🔋" },
  { id: "custom", name: "Custom / Other", msrp: 35000, type: "", icon: "⚙️" }
];

// Loan terms
const loanTerms = [36, 48, 60, 72, 84];
const leaseTerms = [24, 36, 48];

// FAQ data
const faqs = [
  {
    question: "How much would a $40,000 car loan cost per month?",
    answer: "A $40,000 car loan at 6.5% APR would cost approximately: $1,228/month for 36 months, $948/month for 48 months, $781/month for 60 months, or $670/month for 72 months. The total interest paid ranges from $4,208 (36 months) to $8,240 (72 months). A larger down payment or lower interest rate will reduce these amounts."
  },
  {
    question: "How much would a $30,000 car payment be a month?",
    answer: "For a $30,000 car loan at 6.5% APR: 36 months = $921/month, 48 months = $711/month, 60 months = $586/month, 72 months = $503/month. With a 20% down payment ($6,000), you'd finance $24,000 and pay: $737/month (36 mo), $569/month (48 mo), $469/month (60 mo), or $402/month (72 mo)."
  },
  {
    question: "How much is a $70,000 car payment for 72 months?",
    answer: "A $70,000 car loan for 72 months at 6.5% APR would be approximately $1,173/month. Over the life of the loan, you'd pay $14,456 in interest, bringing your total cost to $84,456. With a $14,000 down payment (20%), your monthly payment drops to $938/month."
  },
  {
    question: "What is a good APR for a 72 month car loan?",
    answer: "As of 2026, a good APR for a 72-month car loan depends on your credit score: Excellent (750+): 5.0-6.5%, Good (700-749): 6.5-8.5%, Fair (650-699): 8.5-12%, Poor (below 650): 12-18%+. Toyota Financial Services often offers promotional rates of 0-3.9% APR for qualified buyers on select models."
  },
  {
    question: "Should I finance or lease a Toyota?",
    answer: "Choose financing if: you drive 15,000+ miles/year, want to own the car long-term, prefer no mileage restrictions, or plan to customize the vehicle. Choose leasing if: you want lower monthly payments, prefer driving a new car every 2-3 years, drive fewer than 12,000 miles/year, or want warranty coverage throughout ownership."
  },
  {
    question: "How much should I put down on a Toyota?",
    answer: "The recommended down payment is 10-20% of the vehicle price. For a $35,000 Toyota RAV4, that's $3,500-$7,000. Benefits of a larger down payment include: lower monthly payments, less interest paid overall, better loan approval odds, and avoiding being 'underwater' on your loan. For leases, $2,000-$3,000 is typical."
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

export default function ToyotaCarPaymentCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"finance" | "lease">("finance");
  
  // Finance state
  const [selectedModel, setSelectedModel] = useState<string>("rav4");
  const [vehiclePrice, setVehiclePrice] = useState<string>("31900");
  const [downPayment, setDownPayment] = useState<string>("6000");
  const [tradeIn, setTradeIn] = useState<string>("0");
  const [salesTax, setSalesTax] = useState<string>("7");
  const [interestRate, setInterestRate] = useState<string>("6.5");
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Lease state
  const [leasePrice, setLeasePrice] = useState<string>("31900");
  const [leaseDownPayment, setLeaseDownPayment] = useState<string>("2500");
  const [residualPercent, setResidualPercent] = useState<string>("55");
  const [moneyFactor, setMoneyFactor] = useState<string>("0.00250");
  const [leaseTerm, setLeaseTerm] = useState<number>(36);

  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    const model = toyotaModels.find(m => m.id === modelId);
    if (model && modelId !== "custom") {
      setVehiclePrice(model.msrp.toString());
      setLeasePrice(model.msrp.toString());
    }
  };

  // Finance calculations
  const price = parseFloat(vehiclePrice) || 0;
  const down = parseFloat(downPayment) || 0;
  const trade = parseFloat(tradeIn) || 0;
  const taxRate = (parseFloat(salesTax) || 0) / 100;
  const apr = (parseFloat(interestRate) || 0) / 100;
  const monthlyRate = apr / 12;

  const taxAmount = price * taxRate;
  const loanAmount = price + taxAmount - down - trade;
  
  // Monthly payment calculation (standard amortization formula)
  const calculateMonthlyPayment = (principal: number, rate: number, months: number): number => {
    if (rate === 0) return principal / months;
    return principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
  };

  const monthlyPayment = calculateMonthlyPayment(loanAmount, monthlyRate, loanTerm);
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  // Calculate payments for all terms (comparison)
  const termComparison = loanTerms.map(term => {
    const payment = calculateMonthlyPayment(loanAmount, monthlyRate, term);
    const total = payment * term;
    const interest = total - loanAmount;
    return { term, payment, total, interest };
  });

  // Amortization schedule (first 12 months)
  const generateAmortization = () => {
    const schedule = [];
    let balance = loanAmount;
    for (let month = 1; month <= Math.min(loanTerm, 12); month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }
    return schedule;
  };

  // Lease calculations
  const leasePriceNum = parseFloat(leasePrice) || 0;
  const leaseDown = parseFloat(leaseDownPayment) || 0;
  const residual = (parseFloat(residualPercent) || 0) / 100;
  const mf = parseFloat(moneyFactor) || 0;

  const residualValue = leasePriceNum * residual;
  const capCost = leasePriceNum - leaseDown;
  const depreciation = (capCost - residualValue) / leaseTerm;
  const financeCharge = (capCost + residualValue) * mf;
  const leaseMonthlyPayment = depreciation + financeCharge;
  const totalLeaseCost = (leaseMonthlyPayment * leaseTerm) + leaseDown;
  const leaseAPR = mf * 2400; // Convert money factor to APR equivalent

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Toyota Car Payment Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚗</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Toyota Car Payment Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate monthly payments for any Toyota vehicle. Compare finance vs lease options 
            with 2026 MSRP prices for Camry, RAV4, Corolla, Tacoma, and more.
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
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Estimate: $30,000 Toyota @ 6.5% APR</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>36 mo:</strong> $921/mo | <strong>48 mo:</strong> $711/mo | <strong>60 mo:</strong> $586/mo | <strong>72 mo:</strong> $503/mo
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          <button
            onClick={() => setActiveTab("finance")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px 8px 0 0",
              border: "none",
              backgroundColor: activeTab === "finance" ? "#DC2626" : "#E5E7EB",
              color: activeTab === "finance" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            💰 Finance (Loan)
          </button>
          <button
            onClick={() => setActiveTab("lease")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px 8px 0 0",
              border: "none",
              backgroundColor: activeTab === "lease" ? "#DC2626" : "#E5E7EB",
              color: activeTab === "lease" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            📋 Lease
          </button>
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
            <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "finance" ? "🚗 Vehicle & Loan Details" : "📋 Lease Details"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "finance" ? (
                <>
                  {/* Model Selection */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                      Select Toyota Model
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {toyotaModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelSelect(model.id)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "6px",
                            border: selectedModel === model.id ? "2px solid #DC2626" : "1px solid #E5E7EB",
                            backgroundColor: selectedModel === model.id ? "#FEE2E2" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "1.25rem" }}>{model.icon}</div>
                          <div style={{ fontSize: "0.75rem", fontWeight: "600", color: selectedModel === model.id ? "#DC2626" : "#374151" }}>{model.name}</div>
                          {model.id !== "custom" && (
                            <div style={{ fontSize: "0.65rem", color: "#6B7280" }}>${model.msrp.toLocaleString()}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Vehicle Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Down Payment & Trade-in */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Down Payment
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Trade-in Value
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={tradeIn}
                          onChange={(e) => setTradeIn(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 28px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sales Tax & Interest Rate */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Sales Tax Rate
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          step="0.1"
                          value={salesTax}
                          onChange={(e) => setSalesTax(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            paddingRight: "30px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Interest Rate (APR)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            paddingRight: "30px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Term */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Loan Term
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {loanTerms.map((term) => (
                        <button
                          key={term}
                          onClick={() => setLoanTerm(term)}
                          style={{
                            flex: 1,
                            padding: "10px 8px",
                            borderRadius: "6px",
                            border: loanTerm === term ? "2px solid #DC2626" : "1px solid #E5E7EB",
                            backgroundColor: loanTerm === term ? "#FEE2E2" : "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            color: loanTerm === term ? "#DC2626" : "#374151",
                            fontSize: "0.9rem"
                          }}
                        >
                          {term} mo
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Lease: Vehicle Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Vehicle MSRP
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={leasePrice}
                        onChange={(e) => setLeasePrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Lease Down Payment */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Down Payment (Due at Signing)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={leaseDownPayment}
                        onChange={(e) => setLeaseDownPayment(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Residual & Money Factor */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Residual Value %
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={residualPercent}
                          onChange={(e) => setResidualPercent(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            paddingRight: "30px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Money Factor
                      </label>
                      <input
                        type="number"
                        step="0.00001"
                        value={moneyFactor}
                        onChange={(e) => setMoneyFactor(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Lease Term */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Lease Term
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {leaseTerms.map((term) => (
                        <button
                          key={term}
                          onClick={() => setLeaseTerm(term)}
                          style={{
                            flex: 1,
                            padding: "12px 8px",
                            borderRadius: "6px",
                            border: leaseTerm === term ? "2px solid #DC2626" : "1px solid #E5E7EB",
                            backgroundColor: leaseTerm === term ? "#FEE2E2" : "white",
                            cursor: "pointer",
                            fontWeight: "600",
                            color: leaseTerm === term ? "#DC2626" : "#374151",
                            fontSize: "0.9rem"
                          }}
                        >
                          {term} months
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Money Factor Info */}
                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      💡 <strong>Tip:</strong> Money factor × 2400 = APR equivalent. 
                      Current MF of {moneyFactor} = {leaseAPR.toFixed(2)}% APR
                    </p>
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
                {activeTab === "finance" ? "📊 Payment Summary" : "📋 Lease Summary"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "finance" ? (
                <>
                  {/* Monthly Payment */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Monthly Payment</p>
                    <p style={{ margin: 0, fontSize: "2.75rem", fontWeight: "bold", color: "#059669" }}>
                      ${monthlyPayment.toFixed(2)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      for {loanTerm} months @ {interestRate}% APR
                    </p>
                  </div>

                  {/* Loan Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Loan Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Vehicle Price:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${price.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Sales Tax ({salesTax}%):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${taxAmount.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Down Payment:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>-${down.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Trade-in:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>-${trade.toLocaleString()}</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", fontWeight: "600" }}>Loan Amount:</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#DC2626" }}>${loanAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Total Cost */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #FCD34D"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "0.9rem" }}>💰 Total Cost Over {loanTerm} Months</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#B45309" }}>Principal:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${loanAmount.toLocaleString()}</div>
                      <div style={{ color: "#B45309" }}>Total Interest:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#DC2626" }}>${totalInterest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                      <div style={{ borderTop: "1px solid #FCD34D", paddingTop: "8px", fontWeight: "600", color: "#92400E" }}>Total Payment:</div>
                      <div style={{ borderTop: "1px solid #FCD34D", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#D97706", fontSize: "1.1rem" }}>${totalPayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                    </div>
                  </div>

                  {/* Amortization Toggle */}
                  <button
                    onClick={() => setShowAmortization(!showAmortization)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                      backgroundColor: "white",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      color: "#374151",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    {showAmortization ? "Hide" : "Show"} Amortization Schedule
                    <svg style={{ width: "16px", height: "16px", transform: showAmortization ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showAmortization && (
                    <div style={{ marginTop: "16px", maxHeight: "300px", overflowY: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#F3F4F6" }}>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Month</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Payment</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Principal</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Interest</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateAmortization().map((row) => (
                            <tr key={row.month}>
                              <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.month}</td>
                              <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>${row.payment.toFixed(2)}</td>
                              <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>${row.principal.toFixed(2)}</td>
                              <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "right", color: "#DC2626" }}>${row.interest.toFixed(2)}</td>
                              <td style={{ padding: "6px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>${row.balance.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>
                        Showing first 12 months of {loanTerm} total
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Monthly Lease Payment */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Monthly Lease Payment</p>
                    <p style={{ margin: 0, fontSize: "2.75rem", fontWeight: "bold", color: "#059669" }}>
                      ${leaseMonthlyPayment.toFixed(2)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      for {leaseTerm} months
                    </p>
                  </div>

                  {/* Lease Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Lease Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>MSRP:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${leasePriceNum.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Capitalized Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${capCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Residual Value ({residualPercent}%):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${residualValue.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Depreciation/mo:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${depreciation.toFixed(2)}</div>
                      <div style={{ color: "#6B7280" }}>Finance Charge/mo:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${financeCharge.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Due at Signing */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1D4ED8", fontSize: "0.9rem" }}>💵 Due at Signing</h4>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>
                      ${(leaseDown + leaseMonthlyPayment).toFixed(2)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#3B82F6" }}>
                      (${leaseDown.toLocaleString()} down + first month)
                    </p>
                  </div>

                  {/* Total Lease Cost */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #FCD34D"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.9rem" }}>💰 Total Lease Cost</h4>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>
                      ${totalLeaseCost.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#B45309" }}>
                      over {leaseTerm} months (no ownership at end)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Term Comparison Table - Only for Finance */}
        {activeTab === "finance" && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "40px"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Compare All Loan Terms</h2>
            </div>
            <div style={{ padding: "24px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#EFF6FF" }}>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Loan Term</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Monthly Payment</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Total Interest</th>
                    <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {termComparison.map((row, idx) => (
                    <tr key={row.term} style={{ backgroundColor: row.term === loanTerm ? "#FEE2E2" : idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: row.term === loanTerm ? "bold" : "500" }}>
                        {row.term} months {row.term === loanTerm && "✓"}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>
                        ${row.payment.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>
                        ${row.interest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "500" }}>
                        ${row.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                💡 Shorter terms = higher monthly payments but less total interest paid
              </p>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🚗 Toyota Financing Guide</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Toyota offers competitive financing options through Toyota Financial Services (TFS). Whether you&apos;re 
                  looking at a fuel-efficient Camry, versatile RAV4, or rugged Tacoma, understanding your payment options 
                  helps you make the best decision.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Finance vs Lease: Which is Better?</h3>
                
                <p><strong>Choose Financing if:</strong> You drive more than 12,000 miles/year, want to own the car long-term, 
                plan to customize your vehicle, or prefer no mileage restrictions.</p>
                
                <p><strong>Choose Leasing if:</strong> You prefer lower monthly payments, like driving a new car every 2-3 years, 
                drive fewer than 12,000 miles/year, or want warranty coverage throughout your ownership period.</p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Getting the Best APR</h3>
                <ol style={{ paddingLeft: "20px" }}>
                  <li>Check your credit score before visiting the dealer</li>
                  <li>Get pre-approved from your bank or credit union</li>
                  <li>Ask about Toyota special financing offers (often 0-3.9% for qualified buyers)</li>
                  <li>Compare rates from multiple lenders</li>
                  <li>Consider a shorter loan term for lower interest rates</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Current Rates Reference */}
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>📊 2026 Average APR by Credit</h3>
              <div style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>🟢 Excellent (750+): <strong>5.0-6.5%</strong></p>
                <p style={{ margin: 0 }}>🟡 Good (700-749): <strong>6.5-8.5%</strong></p>
                <p style={{ margin: 0 }}>🟠 Fair (650-699): <strong>8.5-12%</strong></p>
                <p style={{ margin: 0 }}>🔴 Poor (&lt;650): <strong>12-18%+</strong></p>
              </div>
            </div>

            {/* 2026 Toyota Prices */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>🚗 2026 Toyota Starting MSRP</h3>
              <div style={{ fontSize: "0.8rem", color: "#047857", lineHeight: "1.9" }}>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>Corolla</span> <strong>$23,500</strong></p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>Camry</span> <strong>$29,100</strong></p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>RAV4</span> <strong>$31,900</strong></p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>Tacoma</span> <strong>$31,590</strong></p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>Highlander</span> <strong>$40,500</strong></p>
                <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}><span>4Runner</span> <strong>$42,000</strong></p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/car-payment-calculator-toyota" currentCategory="Finance" />
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
            Actual payments may vary based on credit score, dealer fees, taxes, and other factors. 
            Toyota MSRP prices shown are base models and may differ by trim level and options. 
            Always verify financing terms with your dealer or lender before making a purchase.
          </p>
        </div>
      </div>
    </div>
  );
}