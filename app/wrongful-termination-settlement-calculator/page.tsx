"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Average settlement data by type
const settlementRanges = {
  "Discrimination": { low: 50000, avg: 125000, high: 300000 },
  "Retaliation": { low: 30000, avg: 75000, high: 200000 },
  "Contract Breach": { low: 20000, avg: 50000, high: 150000 },
  "Harassment": { low: 40000, avg: 100000, high: 250000 },
  "FMLA Violation": { low: 25000, avg: 60000, high: 150000 },
  "Other": { low: 15000, avg: 45000, high: 100000 },
};

// State tax rates (simplified)
const stateTaxRates: Record<string, number> = {
  "California": 13.3,
  "New York": 10.9,
  "Texas": 0,
  "Florida": 0,
  "Illinois": 4.95,
  "Pennsylvania": 3.07,
  "Ohio": 4.0,
  "Georgia": 5.75,
  "Other": 5.0,
};

// FAQ data
const faqs = [
  {
    question: "What is the most you can get for wrongful termination?",
    answer: "While most wrongful termination settlements range from $5,000 to $100,000, approximately 10% of cases result in verdicts of $1 million or more. The highest settlements typically involve discrimination (race, sex, disability), retaliation for whistleblowing, or egregious employer misconduct. California employees often receive higher settlements due to stronger employee protection laws like FEHA."
  },
  {
    question: "Is it worth suing for wrongful termination?",
    answer: "It depends on your case strength and financial situation. Consider: (1) Do you have evidence of illegal conduct? (2) How much have you lost in wages? (3) Can you afford time off work for legal proceedings? Cases with clear discrimination evidence, substantial lost wages, and documented emotional distress are more likely to result in favorable settlements. Most employment attorneys work on contingency (no upfront cost), making it accessible to pursue valid claims."
  },
  {
    question: "How much of a 25k settlement will I get?",
    answer: "From a $25,000 settlement, you can typically expect to take home $14,000-$17,000 after deductions. Attorney fees (usually 33-40%) take $8,250-$10,000. Case costs (filing fees, depositions) may be $1,000-$3,000. Some portions may be taxable, reducing your take-home further. The exact amount depends on your fee agreement and how the settlement is structured."
  },
  {
    question: "How expensive is it to sue your employer?",
    answer: "Most wrongful termination attorneys work on contingency, meaning you pay nothing upfront—they take 33-40% of your settlement only if you win. However, you may still be responsible for case costs ($2,000-$10,000) including filing fees, expert witnesses, and depositions. Some attorneys advance these costs and deduct them from your settlement. Always clarify fee structures before signing."
  },
  {
    question: "How long does a wrongful termination lawsuit take?",
    answer: "Most wrongful termination cases take 6 months to 2 years to resolve. Simple cases that settle quickly may resolve in 3-6 months. Cases that go to trial can take 2-3+ years. Factors affecting timeline include: employer's willingness to settle, court backlog, complexity of evidence, and whether appeals are filed. About 95% of cases settle before trial."
  },
  {
    question: "What damages can I recover in a wrongful termination case?",
    answer: "You may recover: (1) Back pay - wages lost from termination to settlement, (2) Front pay - future lost wages if you can't return to your position, (3) Lost benefits - health insurance, retirement contributions, etc., (4) Emotional distress - compensation for anxiety, depression, humiliation, (5) Punitive damages - additional penalties for egregious employer conduct, (6) Attorney fees - in some cases, the employer pays your legal costs."
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

export default function WrongfulTerminationCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"estimator" | "takehome">("estimator");

  // Tab 1: Settlement Estimator inputs
  const [annualSalary, setAnnualSalary] = useState<string>("75000");
  const [monthlyBenefits, setMonthlyBenefits] = useState<string>("1500");
  const [monthsUnemployed, setMonthsUnemployed] = useState<string>("6");
  const [expectedFutureMonths, setExpectedFutureMonths] = useState<string>("6");
  const [terminationType, setTerminationType] = useState<string>("Discrimination");
  const [caseStrength, setCaseStrength] = useState<"weak" | "moderate" | "strong">("moderate");
  const [state, setState] = useState<string>("California");

  // Tab 1: Results
  const [backPay, setBackPay] = useState<number>(0);
  const [frontPay, setFrontPay] = useState<number>(0);
  const [lostBenefits, setLostBenefits] = useState<number>(0);
  const [economicDamages, setEconomicDamages] = useState<number>(0);
  const [lowEstimate, setLowEstimate] = useState<number>(0);
  const [midEstimate, setMidEstimate] = useState<number>(0);
  const [highEstimate, setHighEstimate] = useState<number>(0);

  // Tab 2: Take-Home Calculator inputs
  const [settlementAmount, setSettlementAmount] = useState<string>("100000");
  const [attorneyFeePercent, setAttorneyFeePercent] = useState<string>("33");
  const [caseCosts, setCaseCosts] = useState<string>("5000");
  const [taxablePercent, setTaxablePercent] = useState<string>("50");

  // Tab 2: Results
  const [attorneyFees, setAttorneyFees] = useState<number>(0);
  const [estimatedTax, setEstimatedTax] = useState<number>(0);
  const [takeHome, setTakeHome] = useState<number>(0);

  // Multipliers based on case strength
  const strengthMultipliers = {
    weak: { low: 1.0, mid: 1.25, high: 1.5 },
    moderate: { low: 1.25, mid: 1.75, high: 2.25 },
    strong: { low: 1.5, mid: 2.5, high: 3.5 },
  };

  // Tab 1: Calculate settlement estimate
  useEffect(() => {
    const salary = parseFloat(annualSalary) || 0;
    const benefits = parseFloat(monthlyBenefits) || 0;
    const unemployedMonths = parseFloat(monthsUnemployed) || 0;
    const futureMonths = parseFloat(expectedFutureMonths) || 0;

    // Calculate economic damages
    const back = (salary / 12) * unemployedMonths;
    const front = (salary / 12) * futureMonths;
    const benefitsLost = (unemployedMonths + futureMonths) * benefits;
    const economic = back + front + benefitsLost;

    setBackPay(back);
    setFrontPay(front);
    setLostBenefits(benefitsLost);
    setEconomicDamages(economic);

    // Apply multipliers
    const multipliers = strengthMultipliers[caseStrength];
    const stateBonus = state === "California" ? 1.2 : 1.0;
    const typeBonus = terminationType === "Discrimination" ? 1.3 : 
                      terminationType === "Harassment" ? 1.2 : 1.0;

    const low = economic * multipliers.low * stateBonus * typeBonus;
    const mid = economic * multipliers.mid * stateBonus * typeBonus;
    const high = economic * multipliers.high * stateBonus * typeBonus;

    setLowEstimate(low);
    setMidEstimate(mid);
    setHighEstimate(high);

    // Update Tab 2 default with mid estimate
    setSettlementAmount(mid.toFixed(0));
  }, [annualSalary, monthlyBenefits, monthsUnemployed, expectedFutureMonths, terminationType, caseStrength, state]);

  // Tab 2: Calculate take-home amount
  useEffect(() => {
    const settlement = parseFloat(settlementAmount) || 0;
    const feePercent = parseFloat(attorneyFeePercent) || 0;
    const costs = parseFloat(caseCosts) || 0;
    const taxablePct = parseFloat(taxablePercent) || 0;

    const fees = settlement * (feePercent / 100);
    const taxableAmount = (settlement - fees) * (taxablePct / 100);
    const stateTaxRate = stateTaxRates[state] || 5;
    const federalRate = 22; // Estimated average federal rate
    const totalTaxRate = (federalRate + stateTaxRate) / 100;
    const taxes = taxableAmount * totalTaxRate;
    const net = settlement - fees - costs - taxes;

    setAttorneyFees(fees);
    setEstimatedTax(taxes);
    setTakeHome(net);
  }, [settlementAmount, attorneyFeePercent, caseCosts, taxablePercent, state]);

  // Auto-calculate benefits as 25% of monthly salary if not set
  useEffect(() => {
    const salary = parseFloat(annualSalary) || 0;
    if (salary > 0 && monthlyBenefits === "1500") {
      setMonthlyBenefits(((salary / 12) * 0.25).toFixed(0));
    }
  }, [annualSalary]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const tabs = [
    { id: "estimator" as const, label: "Settlement Estimator", icon: "💰" },
    { id: "takehome" as const, label: "Take-Home Calculator", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Wrongful Termination Settlement Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Wrongful Termination Settlement Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your potential wrongful termination settlement and calculate how much you&apos;ll actually take home after attorney fees and taxes.
          </p>
        </div>

        {/* Important Disclaimer */}
        <div style={{
          backgroundColor: "#FEF2F2",
          border: "2px solid #FCA5A5",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <div>
              <h3 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "8px", marginTop: 0 }}>Important Disclaimer</h3>
              <p style={{ color: "#991B1B", fontSize: "0.9rem", margin: 0, lineHeight: "1.6" }}>
                This calculator provides <strong>rough estimates only</strong> for informational purposes. It is NOT legal advice. Actual settlements vary dramatically based on evidence strength, employer conduct, jurisdiction, and many other factors. <strong>Always consult with a qualified employment attorney</strong> before making any legal decisions.
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
          {/* Tabs */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #7C3AED" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#7C3AED" : "#6B7280",
                  fontSize: "0.95rem",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ marginRight: "8px" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            {/* Tab 1: Settlement Estimator */}
            {activeTab === "estimator" && (
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📝 Your Information
                  </h3>

                  {/* Annual Salary */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Annual Salary ($)
                    </label>
                    <input
                      type="number"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                  </div>

                  {/* Monthly Benefits */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Monthly Benefits Value ($)
                      <span style={{ fontWeight: "400", color: "#6B7280" }}> - health insurance, 401k, etc.</span>
                    </label>
                    <input
                      type="number"
                      value={monthlyBenefits}
                      onChange={(e) => setMonthlyBenefits(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                  </div>

                  {/* Months Unemployed */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Months Already Unemployed
                    </label>
                    <input
                      type="number"
                      value={monthsUnemployed}
                      onChange={(e) => setMonthsUnemployed(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      max="60"
                    />
                  </div>

                  {/* Expected Future Months */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Expected Additional Months to Find Work
                    </label>
                    <input
                      type="number"
                      value={expectedFutureMonths}
                      onChange={(e) => setExpectedFutureMonths(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      max="60"
                    />
                  </div>

                  {/* Termination Type */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Termination Type
                    </label>
                    <select
                      value={terminationType}
                      onChange={(e) => setTerminationType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="Discrimination">Discrimination (race, age, gender, disability)</option>
                      <option value="Retaliation">Retaliation (whistleblowing, complaints)</option>
                      <option value="Harassment">Harassment (sexual, hostile work environment)</option>
                      <option value="FMLA Violation">FMLA/Medical Leave Violation</option>
                      <option value="Contract Breach">Contract Breach</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Case Strength */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Case Strength
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[
                        { id: "weak", label: "Weak", desc: "Limited evidence" },
                        { id: "moderate", label: "Moderate", desc: "Some evidence" },
                        { id: "strong", label: "Strong", desc: "Clear evidence" }
                      ].map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setCaseStrength(option.id as "weak" | "moderate" | "strong")}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "8px",
                            border: caseStrength === option.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                            backgroundColor: caseStrength === option.id ? "#F5F3FF" : "white",
                            color: caseStrength === option.id ? "#6D28D9" : "#4B5563",
                            fontWeight: caseStrength === option.id ? "600" : "400",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            textAlign: "center"
                          }}
                        >
                          <div>{option.label}</div>
                          <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      State
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="California">California</option>
                      <option value="New York">New York</option>
                      <option value="Texas">Texas</option>
                      <option value="Florida">Florida</option>
                      <option value="Illinois">Illinois</option>
                      <option value="Pennsylvania">Pennsylvania</option>
                      <option value="Ohio">Ohio</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Other">Other State</option>
                    </select>
                    {state === "California" && (
                      <p style={{ fontSize: "0.75rem", color: "#059669", marginTop: "8px" }}>
                        ✅ California has strong employee protection laws (FEHA)
                      </p>
                    )}
                  </div>
                </div>

                {/* Results */}
                <div className="calc-results" style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px", border: "2px solid #DDD6FE" }}>
                  <h3 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "20px", fontSize: "1.1rem" }}>
                    Settlement Estimate
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#EDE9FE",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #8B5CF6"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#5B21B6", marginBottom: "12px" }}>Estimated Range</p>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Low</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600", color: "#6D28D9", margin: 0 }}>{formatCurrency(lowEstimate)}</p>
                      </div>
                      <span style={{ color: "#A78BFA", fontSize: "1.5rem" }}>→</span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>Mid</p>
                        <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#7C3AED", margin: 0 }}>{formatCurrency(midEstimate)}</p>
                      </div>
                      <span style={{ color: "#A78BFA", fontSize: "1.5rem" }}>→</span>
                      <div>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>High</p>
                        <p style={{ fontSize: "1.25rem", fontWeight: "600", color: "#6D28D9", margin: 0 }}>{formatCurrency(highEstimate)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <h4 style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "12px", fontSize: "0.9rem" }}>
                    Economic Damages Breakdown:
                  </h4>
                  <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Back Pay (Lost Wages)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(backPay)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Front Pay (Future Wages)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(frontPay)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Lost Benefits</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(lostBenefits)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#DDD6FE", borderRadius: "8px" }}>
                      <span style={{ fontWeight: "600", color: "#5B21B6" }}>Total Economic Damages</span>
                      <span style={{ fontWeight: "700", color: "#5B21B6" }}>{formatCurrency(economicDamages)}</span>
                    </div>
                  </div>

                  <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      💡 <strong>Note:</strong> Emotional distress and punitive damages are added based on case strength multipliers. {state === "California" ? "California" : "Your state"}&apos;s laws and {terminationType.toLowerCase()} cases typically result in {terminationType === "Discrimination" ? "higher" : "moderate"} settlements.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Take-Home Calculator */}
            {activeTab === "takehome" && (
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📋 Settlement Details
                  </h3>

                  {/* Settlement Amount */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Settlement Amount ($)
                    </label>
                    <input
                      type="number"
                      value={settlementAmount}
                      onChange={(e) => setSettlementAmount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Auto-filled from Settlement Estimator, or enter manually
                    </p>
                  </div>

                  {/* Attorney Fee */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Attorney Fee (%)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "8px" }}>
                      {["33", "35", "40"].map((fee) => (
                        <button
                          key={fee}
                          onClick={() => setAttorneyFeePercent(fee)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: attorneyFeePercent === fee ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: attorneyFeePercent === fee ? "#EFF6FF" : "white",
                            color: attorneyFeePercent === fee ? "#1E40AF" : "#4B5563",
                            fontWeight: attorneyFeePercent === fee ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {fee}%
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={attorneyFeePercent}
                      onChange={(e) => setAttorneyFeePercent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem"
                      }}
                      min="0"
                      max="50"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Standard contingency fee is 33-40%
                    </p>
                  </div>

                  {/* Case Costs */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Case Costs ($)
                      <span style={{ fontWeight: "400", color: "#6B7280" }}> - filing fees, depositions, experts</span>
                    </label>
                    <input
                      type="number"
                      value={caseCosts}
                      onChange={(e) => setCaseCosts(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                  </div>

                  {/* Taxable Percentage */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Taxable Portion (%)
                    </label>
                    <input
                      type="number"
                      value={taxablePercent}
                      onChange={(e) => setTaxablePercent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      max="100"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Back pay is taxable; emotional distress may not be. Typically 40-60% is taxable.
                    </p>
                  </div>

                  {/* State for Tax */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      State (for tax estimate)
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="California">California (13.3% state tax)</option>
                      <option value="New York">New York (10.9% state tax)</option>
                      <option value="Texas">Texas (0% state tax)</option>
                      <option value="Florida">Florida (0% state tax)</option>
                      <option value="Illinois">Illinois (4.95% state tax)</option>
                      <option value="Other">Other (~5% state tax)</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div className="calc-results" style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", border: "2px solid #A7F3D0" }}>
                  <h3 style={{ fontWeight: "600", color: "#065F46", marginBottom: "20px", fontSize: "1.1rem" }}>
                    Take-Home Amount
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#D1FAE5",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #10B981"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#065F46", marginBottom: "8px" }}>Estimated Take-Home Amount</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#059669", margin: 0 }}>
                      {formatCurrency(takeHome)}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Gross Settlement</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(parseFloat(settlementAmount) || 0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#FEE2E2", borderRadius: "8px" }}>
                      <span style={{ color: "#991B1B" }}>Attorney Fees ({attorneyFeePercent}%)</span>
                      <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(attorneyFees)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                      <span style={{ color: "#92400E" }}>Case Costs</span>
                      <span style={{ fontWeight: "600", color: "#B45309" }}>-{formatCurrency(parseFloat(caseCosts) || 0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                      <span style={{ color: "#1E40AF" }}>Estimated Taxes</span>
                      <span style={{ fontWeight: "600", color: "#2563EB" }}>-{formatCurrency(estimatedTax)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", backgroundColor: "#D1FAE5", borderRadius: "8px", border: "2px solid #10B981" }}>
                      <span style={{ fontWeight: "700", color: "#065F46" }}>You Take Home</span>
                      <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.25rem" }}>{formatCurrency(takeHome)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      📋 <strong>Tax Note:</strong> Consult a tax professional. Back pay is taxable as income. Physical injury settlements are tax-free. Emotional distress without physical injury may be taxable.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Average Settlements Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📊 Average Wrongful Termination Settlements by Type
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Based on EEOC data and industry reports. Individual results vary significantly.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Case Type</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Low Range</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", backgroundColor: "#EDE9FE" }}>Average</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>High Range</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(settlementRanges).map(([type, range], index) => (
                  <tr key={type} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{type}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(range.low)}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F5F3FF", fontWeight: "600" }}>{formatCurrency(range.avg)}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center" }}>{formatCurrency(range.high)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "16px" }}>
            ⚠️ About 10% of cases result in settlements over $1 million. Results depend heavily on evidence, employer conduct, and jurisdiction.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Factors Affecting Settlement */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What Factors Affect Your Settlement?
              </h2>

              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { icon: "💵", title: "Lost Wages (Back Pay)", desc: "The wages you would have earned from termination to settlement. Higher salaries = higher settlements." },
                  { icon: "📈", title: "Future Wages (Front Pay)", desc: "Compensation for future lost earnings if you can't return to a similar position due to the termination." },
                  { icon: "🏥", title: "Lost Benefits", desc: "Value of health insurance, retirement contributions, bonuses, and other benefits you lost." },
                  { icon: "😰", title: "Emotional Distress", desc: "Compensation for anxiety, depression, humiliation, and other psychological impacts. Can be 0.5x-2x economic damages." },
                  { icon: "⚖️", title: "Punitive Damages", desc: "Additional penalties if the employer acted with malice, fraud, or oppression. Can significantly increase awards." },
                  { icon: "📍", title: "State Laws", desc: "California, New York, and other states have stronger employee protections, leading to higher settlements." }
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ color: "#6B7280", fontSize: "0.875rem", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Is It Worth Suing */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              border: "1px solid #FDE68A",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                🤔 Is It Worth Suing for Wrongful Termination?
              </h2>
              <p style={{ color: "#92400E", marginBottom: "16px", lineHeight: "1.7" }}>
                Consider these factors before deciding to pursue legal action:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#DCFCE7", padding: "16px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "8px" }}>✅ May Be Worth It If:</h4>
                  <ul style={{ color: "#166534", fontSize: "0.875rem", paddingLeft: "16px", margin: 0 }}>
                    <li>You have documented evidence</li>
                    <li>Lost wages exceed $50,000+</li>
                    <li>Clear discrimination/retaliation</li>
                    <li>Witnesses support your claims</li>
                    <li>Attorney takes case on contingency</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#FEE2E2", padding: "16px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#991B1B", marginBottom: "8px" }}>❌ May Not Be Worth It If:</h4>
                  <ul style={{ color: "#991B1B", fontSize: "0.875rem", paddingLeft: "16px", margin: 0 }}>
                    <li>Limited or no evidence</li>
                    <li>Low lost wages</li>
                    <li>Quick re-employment</li>
                    <li>At-will termination with no illegal motive</li>
                    <li>No attorneys willing to take case</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Attorney Fee Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💼 Attorney Fee Guide
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#166534", marginBottom: "4px" }}>33% - Standard</p>
                  <p style={{ fontSize: "0.8rem", color: "#166534", margin: 0 }}>If case settles before trial</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "4px" }}>40% - Trial</p>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>If case goes to trial</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "4px" }}>+ Case Costs</p>
                  <p style={{ fontSize: "0.8rem", color: "#1E40AF", margin: 0 }}>$2,000-$10,000 typical</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #DDD6FE"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "12px" }}>
                ⏱️ Typical Timeline
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#5B21B6", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Quick settlement: 3-6 months</li>
                <li style={{ marginBottom: "8px" }}>Average case: 6-18 months</li>
                <li style={{ marginBottom: "8px" }}>Trial: 2-3+ years</li>
                <li>~95% settle before trial</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools 
              currentUrl="/wrongful-termination-settlement-calculator" 
              currentCategory="Finance" 
            />
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

        {/* Final Disclaimer */}
        <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#FEF2F2", borderRadius: "12px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.8rem", color: "#991B1B", textAlign: "center", margin: 0 }}>
            ⚖️ <strong>Legal Disclaimer:</strong> This calculator is for informational purposes only and does not constitute legal advice. Every case is unique, and actual settlements depend on many factors not accounted for here. Always consult with a qualified employment attorney licensed in your state before making any legal decisions. Past results do not guarantee future outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
