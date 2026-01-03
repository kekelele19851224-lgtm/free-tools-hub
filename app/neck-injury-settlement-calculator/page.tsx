"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Settlement ranges by injury type
const settlementRanges = [
  { injury: "Minor Whiplash", range: "$2,500 - $10,000", description: "Soft tissue strain, recovers in weeks" },
  { injury: "Moderate Strain/Sprain", range: "$10,000 - $30,000", description: "Requires physical therapy" },
  { injury: "Herniated Disc", range: "$30,000 - $100,000", description: "May require injections or surgery" },
  { injury: "Cervical Fracture", range: "$100,000 - $500,000", description: "Broken vertebrae, serious injury" },
  { injury: "Spinal Cord Injury", range: "$500,000 - $1,000,000+", description: "Permanent damage, paralysis risk" },
];

// Multiplier guide
const multiplierGuide = [
  { range: "1.5 - 2.0", severity: "Minor", description: "Quick recovery (weeks), minimal impact on daily life" },
  { range: "2.0 - 3.0", severity: "Moderate", description: "Months of treatment, temporary limitations" },
  { range: "3.0 - 4.0", severity: "Serious", description: "Long-term effects, significant pain, lifestyle changes" },
  { range: "4.0 - 5.0", severity: "Severe", description: "Permanent injury, surgery required, disability" },
];

// FAQ data
const faqs = [
  {
    question: "How much should I settle for a neck injury?",
    answer: "Neck injury settlements vary widely based on severity. Minor whiplash cases typically settle for $2,500-$10,000, while severe injuries involving herniated discs or spinal damage can result in settlements of $100,000 or more. Your settlement depends on medical expenses, lost wages, pain and suffering, and the degree of fault assigned to each party."
  },
  {
    question: "What is considered a serious neck injury?",
    answer: "Serious neck injuries include herniated or bulging discs, cervical fractures, cervical radiculopathy (pinched nerves), spinal cord damage, and injuries requiring surgery. These injuries typically cause chronic pain, limited mobility, numbness or tingling in the arms, and may result in permanent disability. They generally warrant higher pain and suffering multipliers (3-5x)."
  },
  {
    question: "How much can I get for a neck injury?",
    answer: "The amount you can recover depends on your economic damages (medical bills, lost wages) and non-economic damages (pain and suffering). A typical formula multiplies your economic damages by 1.5-5x based on injury severity. For example, $20,000 in medical bills with a 3x multiplier could result in a $60,000 pain and suffering component, for a total of $80,000 before any fault reduction."
  },
  {
    question: "How much of a 25k settlement will I get?",
    answer: "From a $25,000 settlement, you'll typically receive $12,500-$15,000 after attorney fees and costs. If your attorney charges the standard 33% contingency fee ($8,250), and you have $2,000 in medical liens, you'd receive approximately $14,750. Use our Take-Home Calculator tab to estimate your actual payout based on your specific situation."
  },
  {
    question: "Do I need a lawyer for a neck injury claim?",
    answer: "While not legally required, having an attorney typically results in higher settlements. Studies show represented claimants receive 3-4x more than unrepresented ones, even after attorney fees. Attorneys know how to properly document injuries, negotiate with insurance companies, and identify all potential sources of compensation."
  },
  {
    question: "How long does a neck injury settlement take?",
    answer: "Most neck injury settlements take 6 months to 2 years. Simple cases with clear liability may settle in 3-6 months. Complex cases involving surgery, disputed liability, or litigation can take 1-3 years. It's generally better to wait until you've reached maximum medical improvement before settling to ensure all damages are accounted for."
  },
  {
    question: "What factors affect neck injury settlement amounts?",
    answer: "Key factors include: 1) Severity and type of injury, 2) Total medical expenses, 3) Length of treatment and recovery, 4) Impact on work and earning capacity, 5) Degree of fault assigned to you, 6) Insurance policy limits, 7) Quality of medical documentation, 8) Whether surgery was required, and 9) Permanence of the injury."
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

export default function NeckInjurySettlementCalculator() {
  const [activeTab, setActiveTab] = useState<"settlement" | "takehome">("settlement");

  // Settlement Calculator inputs
  const [medicalExpenses, setMedicalExpenses] = useState<string>("10000");
  const [futureMedical, setFutureMedical] = useState<string>("5000");
  const [propertyDamage, setPropertyDamage] = useState<string>("0");
  const [lostIncome, setLostIncome] = useState<string>("5000");
  const [futureLostIncome, setFutureLostIncome] = useState<string>("0");
  const [multiplier, setMultiplier] = useState<number>(2.5);
  const [faultPercent, setFaultPercent] = useState<number>(0);

  // Take-Home Calculator inputs
  const [settlementAmount, setSettlementAmount] = useState<string>("50000");
  const [attorneyFee, setAttorneyFee] = useState<number>(33);
  const [medicalLiens, setMedicalLiens] = useState<string>("5000");

  // Settlement results
  const [settlementResults, setSettlementResults] = useState({
    economicDamages: 0,
    nonEconomicDamages: 0,
    totalBeforeFault: 0,
    finalSettlement: 0,
  });

  // Take-Home results
  const [takeHomeResults, setTakeHomeResults] = useState({
    attorneyAmount: 0,
    liensAmount: 0,
    yourTakeHome: 0,
  });

  // Calculate settlement
  useEffect(() => {
    const medical = parseFloat(medicalExpenses) || 0;
    const future = parseFloat(futureMedical) || 0;
    const property = parseFloat(propertyDamage) || 0;
    const lost = parseFloat(lostIncome) || 0;
    const futureLost = parseFloat(futureLostIncome) || 0;

    const economicDamages = medical + future + property + lost + futureLost;
    const nonEconomicDamages = economicDamages * multiplier;
    const totalBeforeFault = economicDamages + nonEconomicDamages;
    const finalSettlement = totalBeforeFault * (1 - faultPercent / 100);

    setSettlementResults({
      economicDamages: Math.round(economicDamages),
      nonEconomicDamages: Math.round(nonEconomicDamages),
      totalBeforeFault: Math.round(totalBeforeFault),
      finalSettlement: Math.round(finalSettlement),
    });
  }, [medicalExpenses, futureMedical, propertyDamage, lostIncome, futureLostIncome, multiplier, faultPercent]);

  // Calculate take-home
  useEffect(() => {
    const settlement = parseFloat(settlementAmount) || 0;
    const liens = parseFloat(medicalLiens) || 0;

    const attorneyAmount = settlement * (attorneyFee / 100);
    const yourTakeHome = settlement - attorneyAmount - liens;

    setTakeHomeResults({
      attorneyAmount: Math.round(attorneyAmount),
      liensAmount: liens,
      yourTakeHome: Math.round(Math.max(0, yourTakeHome)),
    });
  }, [settlementAmount, attorneyFee, medicalLiens]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Neck Injury Settlement Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Neck Injury Settlement Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your potential neck injury settlement based on medical expenses, lost wages, and pain & suffering. Get a realistic range for your claim.
          </p>
        </div>

        {/* Disclaimer Top */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <p style={{ color: "#92400E", margin: 0, fontSize: "0.9rem" }}>
              <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only and does not constitute legal advice. Actual settlements vary based on jurisdiction, evidence, and negotiation. Consult a qualified personal injury attorney for an accurate case evaluation.
            </p>
          </div>
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
              <p style={{ fontWeight: "600", color: "#4338CA", margin: "0 0 4px 0" }}>Quick Answer</p>
              <p style={{ color: "#4338CA", margin: 0, fontSize: "0.95rem" }}>
                Neck injury settlements typically range from <strong>$2,500 for minor whiplash</strong> to <strong>$500,000+ for severe spinal injuries</strong>. The settlement formula is: (Economic Damages × Pain Multiplier) × (1 - Your Fault %). Most cases settle for 2-3x the total medical bills.
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
          <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setActiveTab("settlement")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "settlement" ? "#4F46E5" : "transparent",
                color: activeTab === "settlement" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              💰 Settlement Calculator
            </button>
            <button
              onClick={() => setActiveTab("takehome")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "takehome" ? "#4F46E5" : "transparent",
                color: activeTab === "takehome" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🏠 Take-Home Calculator
            </button>
          </div>

          <div style={{ padding: "32px" }}>
            {activeTab === "settlement" ? (
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Settlement Inputs */}
                <div>
                  {/* Economic Damages Section */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      📋 Economic Damages
                    </h3>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Medical Expenses (to date)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={medicalExpenses}
                          onChange={(e) => setMedicalExpenses(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="10000"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Future Medical Expenses
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={futureMedical}
                          onChange={(e) => setFutureMedical(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="5000"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Property Damage (vehicle, etc.)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={propertyDamage}
                          onChange={(e) => setPropertyDamage(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Lost Income (missed work)
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={lostIncome}
                          onChange={(e) => setLostIncome(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="5000"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Future Lost Income
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={futureLostIncome}
                          onChange={(e) => setFutureLostIncome(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pain & Suffering Multiplier */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      😣 Pain & Suffering Multiplier
                    </h3>
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>1.5x (Minor)</span>
                        <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#4F46E5" }}>{multiplier.toFixed(1)}x</span>
                        <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>5.0x (Severe)</span>
                      </div>
                      <input
                        type="range"
                        min="1.5"
                        max="5"
                        step="0.1"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#4F46E5" }}
                      />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      {multiplier <= 2 ? "Minor injury, quick recovery" :
                       multiplier <= 3 ? "Moderate injury, months of treatment" :
                       multiplier <= 4 ? "Serious injury, long-term effects" :
                       "Severe/permanent injury, surgery required"}
                    </p>
                  </div>

                  {/* Fault Percentage */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      ⚠️ Your Degree of Fault
                    </h3>
                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>0% (No fault)</span>
                        <span style={{ fontSize: "1.25rem", fontWeight: "700", color: faultPercent > 0 ? "#DC2626" : "#059669" }}>{faultPercent}%</span>
                        <span style={{ fontSize: "0.875rem", color: "#6B7280" }}>100%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={faultPercent}
                        onChange={(e) => setFaultPercent(parseInt(e.target.value))}
                        style={{ width: "100%", accentColor: "#DC2626" }}
                      />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      Your settlement is reduced by your percentage of fault (comparative negligence)
                    </p>
                  </div>
                </div>

                {/* Settlement Results */}
                <div className="calc-results">
                  {/* Final Settlement */}
                  <div style={{
                    backgroundColor: "#4F46E5",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                      Estimated Settlement
                    </p>
                    <p style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                      {formatCurrency(settlementResults.finalSettlement)}
                    </p>
                    {faultPercent > 0 && (
                      <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                        After {faultPercent}% fault reduction
                      </p>
                    )}
                  </div>

                  {/* Breakdown */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "16px", fontSize: "0.95rem" }}>
                      📊 Settlement Breakdown
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Economic Damages</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(settlementResults.economicDamages)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Pain & Suffering ({multiplier}x)</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(settlementResults.nonEconomicDamages)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Total Before Fault</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(settlementResults.totalBeforeFault)}</span>
                      </div>
                      {faultPercent > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#DC2626" }}>Fault Reduction ({faultPercent}%)</span>
                          <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(settlementResults.totalBeforeFault - settlementResults.finalSettlement)}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#4F46E5" }}>Your Potential Settlement</span>
                        <span style={{ fontWeight: "700", color: "#4F46E5", fontSize: "1.1rem" }}>{formatCurrency(settlementResults.finalSettlement)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement Range */}
                  <div style={{ backgroundColor: "#EEF2FF", padding: "16px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #C7D2FE" }}>
                    <h4 style={{ fontWeight: "600", color: "#4338CA", marginBottom: "8px", fontSize: "0.9rem" }}>
                      📈 Realistic Range
                    </h4>
                    <p style={{ fontSize: "1rem", color: "#4338CA", margin: 0 }}>
                      <strong>{formatCurrency(settlementResults.finalSettlement * 0.7)}</strong> to <strong>{formatCurrency(settlementResults.finalSettlement * 1.3)}</strong>
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#6366F1", margin: "4px 0 0 0" }}>
                      Actual settlements typically vary ±30% based on negotiation
                    </p>
                  </div>

                  {/* Note */}
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                    <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>Note:</strong> This is a pre-attorney fee estimate. Use the "Take-Home Calculator" tab to see what you'd actually receive after legal fees and medical liens.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Take-Home Calculator */
              <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Take-Home Inputs */}
                <div>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      💵 Settlement Details
                    </h3>

                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                        Total Settlement Amount
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={settlementAmount}
                          onChange={(e) => setSettlementAmount(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "8px",
                            fontSize: "1rem"
                          }}
                          placeholder="50000"
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[25000, 50000, 100000, 250000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setSettlementAmount(amount.toString())}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: settlementAmount === amount.toString() ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                            backgroundColor: settlementAmount === amount.toString() ? "#EEF2FF" : "white",
                            color: settlementAmount === amount.toString() ? "#4F46E5" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          ${(amount / 1000)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      👨‍⚖️ Attorney Fee
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <button
                        onClick={() => setAttorneyFee(33)}
                        style={{
                          padding: "14px",
                          borderRadius: "8px",
                          border: attorneyFee === 33 ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: attorneyFee === 33 ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: attorneyFee === 33 ? "#4F46E5" : "#374151", margin: 0 }}>33%</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>Standard (no trial)</p>
                      </button>
                      <button
                        onClick={() => setAttorneyFee(40)}
                        style={{
                          padding: "14px",
                          borderRadius: "8px",
                          border: attorneyFee === 40 ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: attorneyFee === 40 ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: attorneyFee === 40 ? "#4F46E5" : "#374151", margin: 0 }}>40%</p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>If case goes to trial</p>
                      </button>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                    <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                      🏥 Medical Liens
                    </h3>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={medicalLiens}
                        onChange={(e) => setMedicalLiens(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "1rem"
                        }}
                        placeholder="5000"
                      />
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                      Amount owed to medical providers or health insurance
                    </p>
                  </div>
                </div>

                {/* Take-Home Results */}
                <div className="calc-results">
                  {/* Your Take-Home */}
                  <div style={{
                    backgroundColor: "#059669",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                      Your Take-Home Amount
                    </p>
                    <p style={{ fontSize: "2.25rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                      {formatCurrency(takeHomeResults.yourTakeHome)}
                    </p>
                    <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                      {((takeHomeResults.yourTakeHome / (parseFloat(settlementAmount) || 1)) * 100).toFixed(0)}% of total settlement
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "16px", fontSize: "0.95rem" }}>
                      📊 Deductions Breakdown
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Total Settlement</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(parseFloat(settlementAmount) || 0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#DC2626" }}>Attorney Fee ({attorneyFee}%)</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(takeHomeResults.attorneyAmount)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "12px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#DC2626" }}>Medical Liens</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>-{formatCurrency(takeHomeResults.liensAmount)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#059669" }}>Your Take-Home</span>
                        <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.1rem" }}>{formatCurrency(takeHomeResults.yourTakeHome)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px", backgroundColor: "#EEF2FF", borderRadius: "8px", border: "1px solid #C7D2FE" }}>
                    <p style={{ fontSize: "0.85rem", color: "#4338CA", margin: 0 }}>
                      💡 <strong>Tip:</strong> Attorneys can often negotiate medical liens down by 20-40%, increasing your take-home amount. Ask your lawyer about lien reduction.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settlement Ranges Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Average Neck Injury Settlement Amounts
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Injury Type</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#EEF2FF" }}>Typical Settlement</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {settlementRanges.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.injury}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#4F46E5", fontWeight: "600" }}>{row.range}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Multiplier Guide */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📈 Pain & Suffering Multiplier Guide
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Choose your multiplier based on injury severity and impact on your life:
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Multiplier</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Severity</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>When to Use</th>
                </tr>
              </thead>
              <tbody>
                {multiplierGuide.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700", color: "#4F46E5" }}>{row.range}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{row.severity}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How Settlement is Calculated */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🧮 How Neck Injury Settlements Are Calculated
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#4F46E5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Economic Damages</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Add up all tangible losses: medical bills, future medical expenses, lost wages, future earning capacity, and property damage.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#4F46E5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Apply Pain & Suffering Multiplier</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Multiply economic damages by 1.5-5x based on injury severity. This compensates for physical pain, emotional distress, and reduced quality of life.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#4F46E5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Adjust for Comparative Negligence</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Your settlement is reduced by your percentage of fault. If you're 20% at fault, your recovery is reduced by 20%.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#4F46E5", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Deduct Fees & Liens</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Attorney fees (33-40%) and medical liens are deducted from your settlement to determine your actual take-home amount.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Neck Injuries */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🩺 Common Neck Injuries from Accidents
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>1️⃣</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#92400E" }}>Whiplash</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Soft tissue strain from rapid head movement</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>2️⃣</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>Herniated Disc</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Ruptured disc pressing on nerves</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FCE7F3", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>3️⃣</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#BE185D" }}>Cervical Fracture</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Broken vertebrae in the neck</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#D1FAE5", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>4️⃣</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#047857" }}>Pinched Nerve</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Compressed nerve causing radiating pain</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#EDE9FE", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>5️⃣</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#6D28D9" }}>Spinal Cord Injury</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Damage causing paralysis or weakness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Tips */}
            <div style={{
              backgroundColor: "#EEF2FF",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #C7D2FE"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4338CA", marginBottom: "12px" }}>
                💡 Maximize Your Settlement
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#4338CA", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Document everything with photos and records</li>
                <li style={{ marginBottom: "8px" }}>Get medical treatment immediately</li>
                <li style={{ marginBottom: "8px" }}>Don't accept the first offer from insurance</li>
                <li style={{ marginBottom: "8px" }}>Wait until maximum medical improvement</li>
                <li>Consider hiring a personal injury attorney</li>
              </ul>
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: "#FEF2F2",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FECACA"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "12px" }}>
                ⚠️ Common Mistakes
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#991B1B", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Settling too quickly before knowing full extent of injury</li>
                <li style={{ marginBottom: "8px" }}>Giving recorded statements to insurance without legal advice</li>
                <li style={{ marginBottom: "8px" }}>Not following doctor's treatment plan</li>
                <li>Posting about your injury on social media</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/neck-injury-settlement-calculator"
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

        {/* Bottom Disclaimer */}
        <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
          <p style={{ fontSize: "0.8rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            ⚖️ <strong>Legal Disclaimer:</strong> This calculator provides estimates for informational purposes only and does not constitute legal advice. Settlement amounts vary significantly based on jurisdiction, specific case facts, evidence quality, and negotiation outcomes. Insurance policy limits may cap your recovery regardless of damages. This tool cannot account for all variables affecting your case. For an accurate evaluation of your potential claim, please consult with a qualified personal injury attorney in your state. No attorney-client relationship is created by using this calculator.
          </p>
        </div>
      </div>
    </div>
  );
  }