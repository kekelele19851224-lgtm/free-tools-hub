"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Severity levels with multiplier ranges
const severityLevels = [
  { id: 'minor', name: 'Minor / Temporary', description: 'Nerve pain that heals within weeks to months', multiplierLow: 1.5, multiplierHigh: 2 },
  { id: 'moderate', name: 'Moderate', description: 'Partial nerve damage, some lasting effects', multiplierLow: 2, multiplierHigh: 3 },
  { id: 'severe', name: 'Severe', description: 'Significant nerve damage, chronic pain, limited function', multiplierLow: 3, multiplierHigh: 4 },
  { id: 'catastrophic', name: 'Catastrophic / Permanent', description: 'Complete nerve loss, permanent disability', multiplierLow: 4, multiplierHigh: 5 },
];

// Settlement ranges by injury type
const settlementRanges = [
  { type: 'Hand Nerve Damage', low: 20000, high: 300000, notes: 'Depends on impact to dexterity and occupation' },
  { type: 'Foot/Leg Nerve Damage', low: 25000, high: 250000, notes: 'Affects mobility and daily activities' },
  { type: 'Sciatic Nerve Damage', low: 30000, high: 500000, notes: 'Can cause chronic pain and mobility issues' },
  { type: 'Spinal Nerve Damage', low: 100000, high: 1000000, notes: 'Often results in permanent disability' },
  { type: 'Facial Nerve Damage', low: 50000, high: 400000, notes: 'Visible effects, impacts quality of life' },
  { type: 'Arm/Shoulder Nerve', low: 30000, high: 350000, notes: 'Brachial plexus injuries vary widely' },
  { type: 'Minor Temporary Damage', low: 10000, high: 50000, notes: 'Full recovery expected' },
  { type: 'Permanent Nerve Damage', low: 250000, high: 1000000, notes: 'Lifelong impact on function' },
];

// FAQ data
const faqs = [
  {
    question: "What is the average settlement for nerve damage?",
    answer: "According to settlement data, the median nerve damage settlement is approximately $250,000, while the average is around $578,000. However, actual amounts vary significantly based on injury severity, medical costs, lost income, and jurisdiction. Minor temporary damage may settle for $10,000-$50,000, while catastrophic permanent nerve damage can exceed $1 million."
  },
  {
    question: "How is nerve damage compensation calculated?",
    answer: "Most attorneys use the 'multiplier method': Economic damages (medical bills + lost wages) are multiplied by a factor of 1.5 to 5 based on injury severity. For example, $50,000 in economic damages with a 3x multiplier = $150,000 in pain and suffering, for a total of $200,000. Some cases use the 'per diem' method, assigning a daily rate for pain and suffering."
  },
  {
    question: "What factors affect nerve damage settlement amounts?",
    answer: "Key factors include: injury severity and permanence, total medical expenses (past and future), lost wages and earning capacity, impact on daily life and activities, your percentage of fault, insurance policy limits, strength of evidence, jurisdiction laws, and quality of legal representation."
  },
  {
    question: "How much of my settlement will I actually receive?",
    answer: "After a settlement, you'll typically receive 60-70% of the total amount. Attorney fees usually range from 33-40% (contingency basis), plus costs for medical liens, court fees, and expert witnesses. For example, from a $100,000 settlement, you might receive $60,000-$67,000 after fees."
  },
  {
    question: "Can I get compensation for nerve damage from a car accident?",
    answer: "Yes, if the accident was caused by someone else's negligence. Compensation can cover medical bills, future treatment, lost income, pain and suffering, and loss of quality of life. The at-fault driver's insurance typically pays, though you may need to pursue a lawsuit if they deny or undervalue your claim."
  },
  {
    question: "How long does a nerve damage settlement take?",
    answer: "Simple cases with clear liability may settle in 3-6 months. More complex cases involving disputed liability, extensive treatment, or permanent damage can take 1-3 years, especially if they go to trial. It's often better to wait until you reach maximum medical improvement before settling."
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

export default function NerveDamageCompensationCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'ranges' | 'perdiem'>('calculator');

  // Tab 1: Settlement Calculator state
  const [pastMedical, setPastMedical] = useState('15000');
  const [futureMedical, setFutureMedical] = useState('25000');
  const [lostWages, setLostWages] = useState('10000');
  const [futureLostWages, setFutureLostWages] = useState('20000');
  const [otherExpenses, setOtherExpenses] = useState('0');
  const [severity, setSeverity] = useState('moderate');
  const [faultPercent, setFaultPercent] = useState('0');

  // Tab 3: Per Diem state
  const [dailyRate, setDailyRate] = useState('200');
  const [recoveryDays, setRecoveryDays] = useState('180');
  const [perDiemEconomic, setPerDiemEconomic] = useState('50000');

  // Tab 1: Calculate settlement
  const settlementResults = useMemo(() => {
    const economic = (parseFloat(pastMedical) || 0) +
      (parseFloat(futureMedical) || 0) +
      (parseFloat(lostWages) || 0) +
      (parseFloat(futureLostWages) || 0) +
      (parseFloat(otherExpenses) || 0);

    if (economic <= 0) return null;

    const severityLevel = severityLevels.find(s => s.id === severity);
    if (!severityLevel) return null;

    const fault = Math.min(100, Math.max(0, parseFloat(faultPercent) || 0));
    const faultMultiplier = (100 - fault) / 100;

    // Pain & suffering = economic × multiplier
    const painSufferingLow = economic * severityLevel.multiplierLow;
    const painSufferingHigh = economic * severityLevel.multiplierHigh;

    // Total before fault adjustment
    const totalLow = economic + painSufferingLow;
    const totalHigh = economic + painSufferingHigh;

    // After fault adjustment
    const finalLow = totalLow * faultMultiplier;
    const finalHigh = totalHigh * faultMultiplier;

    // After attorney fees (estimate 33%)
    const afterFeesLow = finalLow * 0.67;
    const afterFeesHigh = finalHigh * 0.67;

    return {
      economic,
      painSufferingLow,
      painSufferingHigh,
      totalLow,
      totalHigh,
      finalLow,
      finalHigh,
      afterFeesLow,
      afterFeesHigh,
      faultReduction: fault,
      multiplierLow: severityLevel.multiplierLow,
      multiplierHigh: severityLevel.multiplierHigh
    };
  }, [pastMedical, futureMedical, lostWages, futureLostWages, otherExpenses, severity, faultPercent]);

  // Tab 3: Per Diem calculation
  const perDiemResults = useMemo(() => {
    const daily = parseFloat(dailyRate) || 0;
    const days = parseFloat(recoveryDays) || 0;
    const economic = parseFloat(perDiemEconomic) || 0;

    if (daily <= 0 || days <= 0) return null;

    const painSuffering = daily * days;
    const total = economic + painSuffering;

    return {
      dailyRate: daily,
      days,
      painSuffering,
      economic,
      total
    };
  }, [dailyRate, recoveryDays, perDiemEconomic]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0F4F8" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #CBD5E1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Nerve Damage Compensation Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Nerve Damage Compensation Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate potential settlement amounts for nerve damage injuries. This calculator uses 
            the multiplier method commonly used by attorneys and insurance companies.
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
                IMPORTANT DISCLAIMER
              </p>
              <p style={{ color: "#B91C1C", margin: 0, fontSize: "0.9rem", lineHeight: "1.6" }}>
                This calculator provides <strong>rough estimates for informational purposes only</strong> and 
                does NOT constitute legal advice. Actual settlements vary significantly based on case specifics, 
                jurisdiction, evidence, and legal representation. <strong>Always consult a qualified personal 
                injury attorney</strong> for accurate case evaluation.
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
              backgroundColor: activeTab === "calculator" ? "#1E40AF" : "#DBEAFE",
              color: activeTab === "calculator" ? "white" : "#1E40AF",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧮 Settlement Calculator
          </button>
          <button
            onClick={() => setActiveTab("ranges")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "ranges" ? "#1E40AF" : "#DBEAFE",
              color: activeTab === "ranges" ? "white" : "#1E40AF",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Settlement Ranges
          </button>
          <button
            onClick={() => setActiveTab("perdiem")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "perdiem" ? "#1E40AF" : "#DBEAFE",
              color: activeTab === "perdiem" ? "white" : "#1E40AF",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📅 Per Diem Method
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
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🧮 Enter Your Damages
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Economic Damages Section */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 16px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Economic Damages
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Past Medical Expenses
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={pastMedical}
                        onChange={(e) => setPastMedical(e.target.value)}
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
                      Lost Wages (Past)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={lostWages}
                        onChange={(e) => setLostWages(e.target.value)}
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
                      Future Lost Earnings
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={futureLostWages}
                        onChange={(e) => setFutureLostWages(e.target.value)}
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

                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                    Other Expenses (property damage, equipment, etc.)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={otherExpenses}
                      onChange={(e) => setOtherExpenses(e.target.value)}
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

                {/* Injury Severity */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 12px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Injury Severity (affects multiplier)
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  {severityLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSeverity(level.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: severity === level.id ? "2px solid #1E40AF" : "1px solid #CBD5E1",
                        backgroundColor: severity === level.id ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: severity === level.id ? "600" : "500", color: severity === level.id ? "#1E40AF" : "#374151" }}>
                            {level.name}
                          </p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                            {level.description}
                          </p>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: severity === level.id ? "#1E40AF" : "#6B7280" }}>
                          {level.multiplierLow}-{level.multiplierHigh}x
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Fault Percentage */}
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 12px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Your Percentage of Fault
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={faultPercent}
                    onChange={(e) => setFaultPercent(e.target.value)}
                    style={{ width: "100%", accentColor: "#1E40AF" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#6B7280" }}>
                    <span>0% (No fault)</span>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>{faultPercent}%</span>
                    <span>100%</span>
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    In comparative negligence states, your settlement is reduced by your fault percentage.
                  </p>
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
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                        Estimated Settlement Range
                      </p>
                      <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#1E40AF" }}>
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
                        Calculation Breakdown
                      </h4>
                      <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#6B7280" }}>Economic Damages:</span>
                          <span style={{ fontWeight: "600" }}>{formatCurrency(settlementResults.economic)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#6B7280" }}>Pain & Suffering ({settlementResults.multiplierLow}-{settlementResults.multiplierHigh}x):</span>
                          <span style={{ fontWeight: "600" }}>{formatCurrency(settlementResults.painSufferingLow)} - {formatCurrency(settlementResults.painSufferingHigh)}</span>
                        </div>
                        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: "600", color: "#374151" }}>Total Before Fault Adj:</span>
                          <span style={{ fontWeight: "600" }}>{formatCurrency(settlementResults.totalLow)} - {formatCurrency(settlementResults.totalHigh)}</span>
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
                        💰 Estimated Amount After Attorney Fees (~33%)
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
                        👨‍⚖️ <strong>Next Step:</strong> These are rough estimates. For an accurate case evaluation, 
                        consult with a personal injury attorney who can review your specific circumstances.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>⚖️</p>
                    <p style={{ margin: 0 }}>Enter your damages to see estimates</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Settlement Ranges by Injury Type */}
        {activeTab === 'ranges' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #CBD5E1",
            overflow: "hidden",
            marginBottom: "24px"
          }}>
            <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📊 Typical Settlement Ranges by Injury Type
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "24px" }}>
                These ranges are based on reported settlements and verdicts. Your actual settlement depends on 
                many factors including evidence, jurisdiction, and legal representation.
              </p>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F1F5F9" }}>
                      <th style={{ padding: "14px 16px", textAlign: "left", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>Injury Type</th>
                      <th style={{ padding: "14px 16px", textAlign: "center", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>Low Estimate</th>
                      <th style={{ padding: "14px 16px", textAlign: "center", borderBottom: "2px solid #CBD5E1", fontWeight: "600" }}>High Estimate</th>
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
                  for case evaluation. Settlement amounts are highly case-specific. The median nerve damage 
                  settlement is approximately $250,000, but outcomes range from under $10,000 to over $2 million.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Per Diem Calculator */}
        {activeTab === 'perdiem' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #CBD5E1",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📅 Per Diem Method
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#6B7280", marginTop: 0, marginBottom: "20px", fontSize: "0.9rem" }}>
                  The per diem method assigns a daily dollar amount for pain and suffering, 
                  multiplied by the number of recovery days.
                </p>

                {/* Daily Rate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Daily Pain & Suffering Rate
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={dailyRate}
                      onChange={(e) => setDailyRate(e.target.value)}
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
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Common range: $100 - $500 per day based on injury severity
                  </p>
                </div>

                {/* Recovery Days */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Recovery Days
                  </label>
                  <input
                    type="number"
                    value={recoveryDays}
                    onChange={(e) => setRecoveryDays(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Days from injury to maximum medical improvement
                  </p>
                </div>

                {/* Economic Damages */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Economic Damages
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={perDiemEconomic}
                      onChange={(e) => setPerDiemEconomic(e.target.value)}
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
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Medical bills + lost wages + other expenses
                  </p>
                </div>

                {/* Quick Reference */}
                <div style={{ backgroundColor: "#F1F5F9", borderRadius: "8px", padding: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#374151", fontSize: "0.9rem" }}>
                    📋 Daily Rate Guidelines
                  </p>
                  <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• Minor pain: $100-$150/day</p>
                    <p style={{ margin: 0 }}>• Moderate pain: $150-$250/day</p>
                    <p style={{ margin: 0 }}>• Severe pain: $250-$400/day</p>
                    <p style={{ margin: 0 }}>• Debilitating pain: $400-$500+/day</p>
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
                  📊 Per Diem Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {perDiemResults ? (
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
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                        Estimated Total Settlement
                      </p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#1E40AF" }}>
                        {formatCurrency(perDiemResults.total)}
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Economic Damages:</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(perDiemResults.economic)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Pain & Suffering ({formatCurrency(perDiemResults.dailyRate)} × {perDiemResults.days} days):</span>
                        <span style={{ fontWeight: "600" }}>{formatCurrency(perDiemResults.painSuffering)}</span>
                      </div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Total:</span>
                        <span style={{ fontWeight: "600", color: "#1E40AF" }}>{formatCurrency(perDiemResults.total)}</span>
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
                        💡 <strong>Note:</strong> The per diem method is often used for shorter-term injuries. 
                        For permanent or catastrophic injuries, the multiplier method may yield different results.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>📅</p>
                    <p style={{ margin: 0 }}>Enter values to calculate</p>
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
                ⚖️ How Nerve Damage Settlements Are Calculated
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Nerve damage can result from car accidents, workplace injuries, medical malpractice, or 
                  other incidents caused by negligence. Compensation typically covers both economic losses 
                  and non-economic damages like pain and suffering.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Multiplier Method</h3>
                <p>
                  Most attorneys and insurance companies use the multiplier method to calculate pain and 
                  suffering damages. The formula is:
                </p>
                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BFDBFE",
                  textAlign: "center"
                }}>
                  <p style={{ margin: 0, fontSize: "1rem", color: "#1E40AF", fontFamily: "monospace" }}>
                    Total Settlement = Economic Damages + (Economic Damages × Multiplier)
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Understanding the Multiplier</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginTop: "16px" }}>
                  <div style={{ padding: "16px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#166534" }}>1.5 - 2x</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#15803D" }}>Minor injuries, full recovery expected</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#92400E" }}>2 - 3x</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309" }}>Moderate injuries, some lasting effects</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FED7AA", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#C2410C" }}>3 - 4x</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#EA580C" }}>Severe injuries, chronic pain, limited function</p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FECACA", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: "600", color: "#991B1B" }}>4 - 5x</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#DC2626" }}>Catastrophic, permanent disability</p>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors That Affect Your Settlement</h3>
                <div style={{
                  backgroundColor: "#F9FAFB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E5E7EB"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Injury severity</strong> - Permanent damage yields higher settlements</li>
                    <li><strong>Medical documentation</strong> - Well-documented injuries strengthen claims</li>
                    <li><strong>Impact on daily life</strong> - Inability to work or perform activities</li>
                    <li><strong>Insurance policy limits</strong> - May cap maximum recovery</li>
                    <li><strong>Comparative fault</strong> - Your percentage of fault reduces settlement</li>
                    <li><strong>Jurisdiction</strong> - Laws vary by state</li>
                    <li><strong>Legal representation</strong> - Experienced attorneys often secure higher amounts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Statistics Box */}
            <div style={{ backgroundColor: "#1E40AF", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px", margin: "0 0 16px 0" }}>📈 Settlement Statistics</h3>
              <div style={{ lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>Median Settlement: <strong>$250,000</strong></p>
                <p style={{ margin: 0 }}>Average Settlement: <strong>$578,000</strong></p>
                <p style={{ margin: 0 }}>Highest Reported: <strong>$2.9M+</strong></p>
              </div>
              <p style={{ margin: "16px 0 0 0", fontSize: "0.8rem", opacity: 0.8 }}>
                *Based on reported settlements; individual results vary significantly
              </p>
            </div>

            {/* What to Do Box */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px", margin: "0 0 16px 0" }}>✅ Steps After Injury</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>1. Seek immediate medical attention</p>
                <p style={{ margin: "0 0 8px 0" }}>2. Document everything (photos, records)</p>
                <p style={{ margin: "0 0 8px 0" }}>3. Report the incident</p>
                <p style={{ margin: "0 0 8px 0" }}>4. Don&apos;t sign anything from insurers</p>
                <p style={{ margin: 0 }}>5. Consult a personal injury attorney</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/nerve-damage-compensation-calculator" currentCategory="Legal" />
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
            This calculator is provided for <strong>educational and informational purposes only</strong>. 
            The estimates generated do not constitute legal advice and should not be relied upon for 
            making legal decisions. Settlement amounts depend on numerous factors including but not 
            limited to: strength of evidence, insurance policy limits, jurisdiction-specific laws, 
            jury decisions, attorney negotiation skills, and individual case circumstances. 
            <strong> We strongly recommend consulting with a licensed personal injury attorney</strong> who can 
            evaluate your specific situation and provide accurate legal guidance. Use of this calculator 
            does not create an attorney-client relationship.
          </p>
        </div>
      </div>
    </div>
  );
}