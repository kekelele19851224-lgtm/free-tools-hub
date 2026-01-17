"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Severity/relationship multipliers
const relationshipFactors = [
  { id: 'spouse-dependent', name: 'Spouse with Dependent Children', multiplier: 4, description: 'Primary breadwinner, young family' },
  { id: 'spouse-no-children', name: 'Spouse without Children', multiplier: 3, description: 'Married, no dependents' },
  { id: 'parent-minor', name: 'Parent of Minor Children', multiplier: 3.5, description: 'Children lose guidance and support' },
  { id: 'adult-child', name: 'Adult Child', multiplier: 2.5, description: 'Parents lost adult child' },
  { id: 'elderly-parent', name: 'Elderly Parent', multiplier: 2, description: 'Adult children lost elderly parent' },
];

// Settlement ranges by case type
const settlementRanges = [
  { type: 'Car Accident', low: 500000, high: 1500000, notes: 'Most common cause of wrongful death' },
  { type: 'Truck Accident', low: 1000000, high: 5000000, notes: 'Often higher due to commercial insurance' },
  { type: 'Medical Malpractice', low: 250000, high: 2000000, notes: 'Subject to state caps in some jurisdictions' },
  { type: 'Workplace Accident', low: 300000, high: 1500000, notes: 'May involve workers comp + third party' },
  { type: 'Product Liability', low: 500000, high: 3000000, notes: 'Defective products, manufacturer liability' },
  { type: 'Premises Liability', low: 200000, high: 1000000, notes: 'Unsafe property conditions' },
  { type: 'Nursing Home Neglect', low: 250000, high: 1500000, notes: 'Elder abuse and neglect cases' },
  { type: 'DUI/Drunk Driver', low: 750000, high: 3000000, notes: 'Often includes punitive damages' },
];

// FAQ data
const faqs = [
  {
    question: "What is the maximum payout for wrongful death?",
    answer: "There is no universal maximum for wrongful death settlements. Some cases have resulted in settlements exceeding $10 million, particularly involving commercial trucking accidents or egregious medical malpractice. However, some states impose caps on certain damages, especially in medical malpractice cases. The average wrongful death settlement is approximately $973,000, with a median of $294,728."
  },
  {
    question: "How is a wrongful death settlement calculated?",
    answer: "Wrongful death settlements typically include: (1) Economic damages - medical bills, funeral costs, lost income and benefits the deceased would have earned; (2) Non-economic damages - pain and suffering, loss of companionship, loss of guidance; (3) Sometimes punitive damages for egregious conduct. The total depends on the deceased's age, income, family situation, and the circumstances of their death."
  },
  {
    question: "How is the money split in a wrongful death lawsuit?",
    answer: "Distribution varies by state law. Generally, spouses and minor children have priority. Common distributions include: surviving spouse receives 50-100% if no children; spouse and children may split (often 1/3 to spouse, 2/3 to children); adult children may share equally if no spouse. The court often approves final distribution, especially when minors are involved."
  },
  {
    question: "How much do lawyers take from wrongful death settlements?",
    answer: "Most wrongful death attorneys work on contingency, typically taking 33-40% of the settlement. If the case goes to trial, the percentage may increase to 40%. Additional costs (expert witnesses, court fees, investigation) are also deducted. So from a $1 million settlement, the family might receive $600,000-$670,000 after fees and costs."
  },
  {
    question: "Are wrongful death settlements taxable?",
    answer: "Generally, compensatory damages for physical injuries or death are not subject to federal income tax. However, punitive damages and interest on settlements are typically taxable. State tax laws vary. It's advisable to consult with a tax professional about your specific settlement."
  },
  {
    question: "How long does a wrongful death lawsuit take?",
    answer: "Most wrongful death cases settle within 1-3 years. Simple cases with clear liability may settle in 6-12 months. Complex cases involving multiple defendants, disputed liability, or extensive damages may take 2-4 years, especially if they go to trial. Many attorneys recommend waiting until all damages are fully documented before settling."
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export default function WrongfulDeathSettlementCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'statistics' | 'distribution'>('calculator');

  // Tab 1: Settlement Calculator state
  const [medicalExpenses, setMedicalExpenses] = useState('25000');
  const [funeralCosts, setFuneralCosts] = useState('12000');
  const [annualIncome, setAnnualIncome] = useState('65000');
  const [yearsToRetirement, setYearsToRetirement] = useState('20');
  const [lostBenefits, setLostBenefits] = useState('15000');
  const [otherLosses, setOtherLosses] = useState('0');
  const [relationship, setRelationship] = useState('spouse-dependent');
  const [faultPercent, setFaultPercent] = useState('0');

  // Tab 3: Distribution state
  const [totalSettlement, setTotalSettlement] = useState('500000');
  const [attorneyPercent, setAttorneyPercent] = useState('33');
  const [legalCosts, setLegalCosts] = useState('15000');
  const [medicalLiens, setMedicalLiens] = useState('25000');

  // Tab 1: Calculate settlement
  const settlementResults = useMemo(() => {
    const medical = parseFloat(medicalExpenses) || 0;
    const funeral = parseFloat(funeralCosts) || 0;
    const income = parseFloat(annualIncome) || 0;
    const years = parseFloat(yearsToRetirement) || 0;
    const benefits = parseFloat(lostBenefits) || 0;
    const other = parseFloat(otherLosses) || 0;

    // Calculate lost future income
    const lostFutureIncome = income * years;
    
    // Total economic damages
    const economicDamages = medical + funeral + lostFutureIncome + benefits + other;

    if (economicDamages <= 0) return null;

    const relationFactor = relationshipFactors.find(r => r.id === relationship);
    if (!relationFactor) return null;

    const fault = Math.min(100, Math.max(0, parseFloat(faultPercent) || 0));
    const faultMultiplier = (100 - fault) / 100;

    // Non-economic damages (pain & suffering, loss of companionship)
    // Use multiplier range based on relationship
    const multiplierLow = Math.max(1.5, relationFactor.multiplier - 1);
    const multiplierHigh = relationFactor.multiplier + 0.5;
    
    const nonEconomicLow = (medical + funeral + (income * Math.min(years, 5))) * multiplierLow;
    const nonEconomicHigh = (medical + funeral + (income * Math.min(years, 5))) * multiplierHigh;

    // Total before fault adjustment
    const totalLow = economicDamages + nonEconomicLow;
    const totalHigh = economicDamages + nonEconomicHigh;

    // After fault adjustment
    const finalLow = totalLow * faultMultiplier;
    const finalHigh = totalHigh * faultMultiplier;

    // After attorney fees (estimate 33%)
    const afterFeesLow = finalLow * 0.67;
    const afterFeesHigh = finalHigh * 0.67;

    return {
      medical,
      funeral,
      lostFutureIncome,
      benefits,
      other,
      economicDamages,
      nonEconomicLow,
      nonEconomicHigh,
      totalLow,
      totalHigh,
      finalLow,
      finalHigh,
      afterFeesLow,
      afterFeesHigh,
      faultReduction: fault,
      multiplierLow,
      multiplierHigh,
      relationshipName: relationFactor.name
    };
  }, [medicalExpenses, funeralCosts, annualIncome, yearsToRetirement, lostBenefits, otherLosses, relationship, faultPercent]);

  // Tab 3: Distribution calculation
  const distributionResults = useMemo(() => {
    const total = parseFloat(totalSettlement) || 0;
    const attPercent = parseFloat(attorneyPercent) || 0;
    const costs = parseFloat(legalCosts) || 0;
    const liens = parseFloat(medicalLiens) || 0;

    if (total <= 0) return null;

    const attorneyFee = total * (attPercent / 100);
    const totalDeductions = attorneyFee + costs + liens;
    const familyReceives = Math.max(0, total - totalDeductions);
    const percentToFamily = (familyReceives / total) * 100;

    return {
      total,
      attorneyFee,
      costs,
      liens,
      totalDeductions,
      familyReceives,
      percentToFamily
    };
  }, [totalSettlement, attorneyPercent, legalCosts, medicalLiens]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #CBD5E1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Wrongful Death Settlement Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Wrongful Death Settlement Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate potential wrongful death settlement amounts based on economic and non-economic damages. 
            This calculator provides rough estimates for educational purposes only.
          </p>
        </div>

        {/* Important Disclaimer - Top */}
        <div style={{
          backgroundColor: "#FEF2F2",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "2px solid #FCA5A5"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>⚠️</span>
            <div>
              <p style={{ fontWeight: "700", color: "#991B1B", margin: "0 0 8px 0", fontSize: "1rem" }}>
                IMPORTANT DISCLAIMER - PLEASE READ
              </p>
              <p style={{ color: "#B91C1C", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                We understand you are going through an incredibly difficult time. This calculator provides 
                <strong> rough estimates for educational purposes only</strong> and does NOT constitute legal advice. 
                Wrongful death cases are extremely complex and emotionally challenging. Actual settlements depend on 
                evidence, jurisdiction, insurance limits, and case specifics. <strong>We strongly recommend consulting 
                with an experienced wrongful death attorney</strong> who can evaluate your unique circumstances with 
                compassion and expertise.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculator" ? "#1E3A5F" : "#E2E8F0",
              color: activeTab === "calculator" ? "white" : "#1E3A5F",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧮 Settlement Calculator
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "statistics" ? "#1E3A5F" : "#E2E8F0",
              color: activeTab === "statistics" ? "white" : "#1E3A5F",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Settlement by Case Type
          </button>
          <button
            onClick={() => setActiveTab("distribution")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "distribution" ? "#1E3A5F" : "#E2E8F0",
              color: activeTab === "distribution" ? "white" : "#1E3A5F",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Distribution Calculator
          </button>
        </div>

        {/* Tab 1: Settlement Calculator */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #CBD5E1",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E3A5F", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🧮 Enter Case Information
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Economic Damages Section */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 16px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Economic Damages
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Medical Expenses
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={medicalExpenses}
                        onChange={(e) => setMedicalExpenses(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Funeral & Burial Costs
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={funeralCosts}
                        onChange={(e) => setFuneralCosts(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Annual Income
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={annualIncome}
                        onChange={(e) => setAnnualIncome(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Years to Retirement
                    </label>
                    <input
                      type="number"
                      value={yearsToRetirement}
                      onChange={(e) => setYearsToRetirement(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Lost Benefits (annual)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={lostBenefits}
                        onChange={(e) => setLostBenefits(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Other Economic Losses
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={otherLosses}
                        onChange={(e) => setOtherLosses(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "8px",
                          border: "1px solid #CBD5E1",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Relationship to Deceased */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 12px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Relationship to Deceased
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  {relationshipFactors.map(rel => (
                    <button
                      key={rel.id}
                      onClick={() => setRelationship(rel.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: relationship === rel.id ? "2px solid #1E3A5F" : "1px solid #CBD5E1",
                        backgroundColor: relationship === rel.id ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: relationship === rel.id ? "600" : "500", color: relationship === rel.id ? "#1E3A5F" : "#374151", fontSize: "0.95rem" }}>
                            {rel.name}
                          </p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                            {rel.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Fault Percentage */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 12px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Deceased&apos;s Percentage of Fault
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={faultPercent}
                    onChange={(e) => setFaultPercent(e.target.value)}
                    style={{ width: "100%", accentColor: "#1E3A5F" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#6B7280" }}>
                    <span>0% (No fault)</span>
                    <span style={{ fontWeight: "600", color: "#1E3A5F" }}>{faultPercent}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #CBD5E1",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0F172A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Estimated Settlement Range
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {settlementResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#EFF6FF",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #3B82F6"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E3A5F" }}>
                        Estimated Settlement Range
                      </p>
                      <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: "bold", color: "#1E3A5F" }}>
                        {formatCurrency(settlementResults.finalLow)} - {formatCurrency(settlementResults.finalHigh)}
                      </p>
                      {settlementResults.faultReduction > 0 && (
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                          (Reduced by {settlementResults.faultReduction}% for comparative fault)
                        </p>
                      )}
                    </div>

                    {/* Breakdown */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                        Damages Breakdown
                      </h4>
                      <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px", fontSize: "0.9rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Medical Expenses:</span>
                          <span style={{ fontWeight: "500" }}>{formatCurrency(settlementResults.medical)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Funeral Costs:</span>
                          <span style={{ fontWeight: "500" }}>{formatCurrency(settlementResults.funeral)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Lost Future Income:</span>
                          <span style={{ fontWeight: "500" }}>{formatCurrency(settlementResults.lostFutureIncome)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Lost Benefits:</span>
                          <span style={{ fontWeight: "500" }}>{formatCurrency(settlementResults.benefits)}</span>
                        </div>
                        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Total Economic:</span>
                          <span style={{ fontWeight: "600" }}>{formatCurrency(settlementResults.economicDamages)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                          <span style={{ color: "#6B7280" }}>Non-Economic (est.):</span>
                          <span style={{ fontWeight: "500" }}>{formatCurrency(settlementResults.nonEconomicLow)} - {formatCurrency(settlementResults.nonEconomicHigh)}</span>
                        </div>
                      </div>
                    </div>

                    {/* After Attorney Fees */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E", fontWeight: "600" }}>
                        💰 Estimated After Attorney Fees (~33%)
                      </p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#B45309" }}>
                        {formatCurrency(settlementResults.afterFeesLow)} - {formatCurrency(settlementResults.afterFeesHigh)}
                      </p>
                    </div>

                    {/* CTA */}
                    <div style={{
                      backgroundColor: "#DCFCE7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #86EFAC"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534" }}>
                        🤝 <strong>We&apos;re Here to Help:</strong> These are rough estimates during a difficult time. 
                        A wrongful death attorney can provide a compassionate, accurate case evaluation.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>⚖️</p>
                    <p style={{ margin: 0 }}>Enter case information to see estimates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Settlement Statistics */}
        {activeTab === 'statistics' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #CBD5E1",
            overflow: "hidden",
            marginBottom: "24px"
          }}>
            <div style={{ backgroundColor: "#1E3A5F", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📊 Typical Settlement Ranges by Case Type
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Statistics Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#EFF6FF", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #BFDBFE" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#1E40AF" }}>Average Settlement</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#1E3A8A" }}>$973,054</p>
                </div>
                <div style={{ backgroundColor: "#F0FDF4", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #BBF7D0" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>Median Settlement</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#15803D" }}>$294,728</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #FDE68A" }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Cases Analyzed</p>
                  <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#B45309" }}>956</p>
                </div>
              </div>

              <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "24px" }}>
                These ranges are based on reported settlements and verdicts (2019-2024). Your actual settlement 
                depends on many factors including evidence, jurisdiction, insurance limits, and case specifics.
              </p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F1F5F9" }}>
                      <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>Case Type</th>
                      <th style={{ padding: "14px 16px", textAlign: "center", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>Low Range</th>
                      <th style={{ padding: "14px 16px", textAlign: "center", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>High Range</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlementRanges.map((range, index) => (
                      <tr key={range.type} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>{range.type}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{formatCurrency(range.low)}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626", fontWeight: "600" }}>{formatCurrency(range.high)}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280", fontSize: "0.9rem" }}>{range.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{
                backgroundColor: "#FEF2F2",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "24px",
                border: "1px solid #FECACA"
              }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                  ⚠️ <strong>Important:</strong> These figures are general ranges and should not be relied upon 
                  for case evaluation. Every wrongful death case is unique. The median of $294,728 better represents 
                  typical outcomes, as the average is skewed by very high verdicts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Distribution Calculator */}
        {activeTab === 'distribution' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #CBD5E1",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E3A5F", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Settlement Distribution
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  Calculate how much the family will receive after attorney fees, legal costs, and liens are deducted.
                </p>

                {/* Total Settlement */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Settlement Amount
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={totalSettlement}
                      onChange={(e) => setTotalSettlement(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Attorney Percentage */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Attorney Fee Percentage: {attorneyPercent}%
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="45"
                    value={attorneyPercent}
                    onChange={(e) => setAttorneyPercent(e.target.value)}
                    style={{ width: "100%", accentColor: "#1E3A5F" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#6B7280" }}>
                    <span>25%</span>
                    <span>33% (typical)</span>
                    <span>40% (trial)</span>
                    <span>45%</span>
                  </div>
                </div>

                {/* Legal Costs */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Legal Costs (experts, court fees, etc.)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={legalCosts}
                      onChange={(e) => setLegalCosts(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Medical Liens */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Medical Liens / Unpaid Bills
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={medicalLiens}
                      onChange={(e) => setMedicalLiens(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Info Box */}
                <div style={{ backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#374151", fontSize: "0.9rem" }}>
                    📋 Typical Deductions
                  </p>
                  <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• Attorney fees: 33-40%</p>
                    <p style={{ margin: 0 }}>• Legal costs: $5,000-$50,000+</p>
                    <p style={{ margin: 0 }}>• Medical liens: Varies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #CBD5E1",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0F172A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Distribution Breakdown
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {distributionResults ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#DCFCE7",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #86EFAC"
                    }}>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#166534" }}>
                        Family Receives
                      </p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#15803D" }}>
                        {formatCurrency(distributionResults.familyReceives)}
                      </p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#166534" }}>
                        ({distributionResults.percentToFamily.toFixed(1)}% of settlement)
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "#374151", fontWeight: "500" }}>Total Settlement:</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(distributionResults.total)}</span>
                      </div>
                      <div style={{ borderTop: "1px dashed #E5E7EB", paddingTop: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#DC2626" }}>
                          <span>− Attorney Fees ({attorneyPercent}%):</span>
                          <span>{formatCurrency(distributionResults.attorneyFee)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#DC2626" }}>
                          <span>− Legal Costs:</span>
                          <span>{formatCurrency(distributionResults.costs)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#DC2626" }}>
                          <span>− Medical Liens:</span>
                          <span>{formatCurrency(distributionResults.liens)}</span>
                        </div>
                      </div>
                      <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: "10px", marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Total Deductions:</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>{formatCurrency(distributionResults.totalDeductions)}</span>
                      </div>
                    </div>

                    {/* Note */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        💡 <strong>Note:</strong> Settlements for minor children are often placed in structured 
                        settlements or court-supervised accounts. Distribution among family members varies by 
                        state law and court approval.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>💰</p>
                    <p style={{ margin: 0 }}>Enter settlement amount to calculate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #CBD5E1", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ⚖️ How Wrongful Death Settlements Are Calculated
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Losing a loved one due to someone else&apos;s negligence is devastating. While no amount of money 
                  can replace your loved one, wrongful death settlements help provide financial security for 
                  surviving family members and hold responsible parties accountable.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Damages</h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                  <div style={{ padding: "20px", backgroundColor: "#EFF6FF", borderRadius: "12px", border: "1px solid #BFDBFE" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1E40AF" }}>Economic Damages</h4>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.9rem", lineHeight: "1.8" }}>
                      <li>Medical expenses before death</li>
                      <li>Funeral and burial costs</li>
                      <li>Lost future income</li>
                      <li>Lost benefits (pension, insurance)</li>
                      <li>Loss of household services</li>
                    </ul>
                  </div>
                  <div style={{ padding: "20px", backgroundColor: "#FDF4FF", borderRadius: "12px", border: "1px solid #E9D5FF" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#7C3AED" }}>Non-Economic Damages</h4>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.9rem", lineHeight: "1.8" }}>
                      <li>Pain and suffering (pre-death)</li>
                      <li>Loss of companionship</li>
                      <li>Loss of parental guidance</li>
                      <li>Loss of consortium</li>
                      <li>Emotional distress</li>
                    </ul>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors Affecting Settlement Value</h3>
                <div style={{
                  backgroundColor: "#F9FAFB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E5E7EB"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Age and health</strong> of the deceased</li>
                    <li><strong>Income and earning potential</strong></li>
                    <li><strong>Number of dependents</strong></li>
                    <li><strong>Relationship</strong> to surviving family members</li>
                    <li><strong>Circumstances</strong> of the death (negligence vs. gross negligence)</li>
                    <li><strong>Insurance policy limits</strong></li>
                    <li><strong>State laws</strong> and damage caps</li>
                    <li><strong>Strength of evidence</strong></li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Who Can File a Wrongful Death Claim?</h3>
                <p>
                  Eligible parties vary by state but typically include immediate family members (spouse, 
                  children, parents), financial dependents, and sometimes extended family or domestic partners. 
                  The estate&apos;s personal representative often files on behalf of all beneficiaries.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Statistics Box */}
            <div style={{ backgroundColor: "#1E3A5F", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px", margin: "0 0 16px 0" }}>📈 Settlement Statistics</h3>
              <div style={{ lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>Average: <strong>$973,054</strong></p>
                <p style={{ margin: 0 }}>Median: <strong>$294,728</strong></p>
                <p style={{ margin: 0 }}>Range: <strong>$10K - $10M+</strong></p>
              </div>
              <p style={{ margin: "16px 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>
                *Based on 956 cases (2019-2024)
              </p>
            </div>

            {/* Who Can File Box */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px", margin: "0 0 16px 0" }}>👨‍👩‍👧‍👦 Who Can File?</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Surviving spouse</p>
                <p style={{ margin: "0 0 8px 0" }}>• Children (minor or adult)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Parents (if no spouse/children)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Estate representative</p>
                <p style={{ margin: 0 }}>• Financial dependents</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/wrongful-death-settlement-calculator" currentCategory="Legal" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #CBD5E1", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div style={{ 
          padding: "24px", 
          backgroundColor: "#FEF2F2", 
          borderRadius: "12px", 
          border: "2px solid #FCA5A5" 
        }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#991B1B", fontSize: "1rem" }}>
            ⚠️ Legal Disclaimer
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#B91C1C", margin: 0, lineHeight: "1.7" }}>
            We understand you are experiencing a profound loss during an incredibly difficult time. 
            This calculator is provided <strong>strictly for educational and informational purposes</strong>. 
            The estimates generated do not constitute legal advice and should not be relied upon for 
            making legal or financial decisions. Wrongful death cases are highly complex and depend on 
            numerous factors including evidence, liability, insurance coverage, jurisdiction-specific laws, 
            and individual circumstances. <strong>We strongly encourage you to consult with an experienced 
            wrongful death attorney</strong> who can evaluate your specific situation with the compassion, 
            expertise, and personal attention your family deserves. Use of this calculator does not create 
            an attorney-client relationship.
          </p>
        </div>
      </div>
    </div>
  );
}