"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Injury types with recommended multipliers
const injuryTypes = [
  { id: "whiplash", label: "Whiplash / Soft Tissue", icon: "🔸", minMult: 1.5, maxMult: 2, description: "Neck strain, minor sprains" },
  { id: "broken_minor", label: "Broken Bone (Simple)", icon: "🦴", minMult: 2, maxMult: 3, description: "Clean fracture, full recovery expected" },
  { id: "broken_major", label: "Broken Bone (Complex)", icon: "🩹", minMult: 2.5, maxMult: 3.5, description: "Multiple fractures, surgery needed" },
  { id: "herniated_disc", label: "Herniated Disc", icon: "🔴", minMult: 2.5, maxMult: 4, description: "Back/neck disc injury" },
  { id: "concussion", label: "Concussion / Mild TBI", icon: "🧠", minMult: 2.5, maxMult: 4, description: "Head injury with symptoms" },
  { id: "severe_tbi", label: "Severe TBI", icon: "⚠️", minMult: 4, maxMult: 5, description: "Traumatic brain injury with lasting effects" },
  { id: "surgery", label: "Surgery Required", icon: "🏥", minMult: 3, maxMult: 4, description: "Any injury requiring surgical intervention" },
  { id: "permanent", label: "Permanent Disability", icon: "♿", minMult: 4, maxMult: 5, description: "Lasting impairment or disability" },
  { id: "scarring", label: "Scarring / Disfigurement", icon: "💔", minMult: 3, maxMult: 5, description: "Visible permanent scarring" },
  { id: "emotional", label: "Emotional Distress (PTSD)", icon: "😢", minMult: 1.5, maxMult: 3, description: "Anxiety, depression, PTSD" }
];

// Typical settlement ranges for reference
const typicalSettlements = [
  { injury: "Whiplash (minor)", range: "$2,500 - $10,000", recovery: "2-6 weeks" },
  { injury: "Whiplash (moderate)", range: "$10,000 - $30,000", recovery: "2-6 months" },
  { injury: "Broken Arm/Leg", range: "$15,000 - $50,000", recovery: "2-4 months" },
  { injury: "Herniated Disc", range: "$50,000 - $150,000", recovery: "6-12 months" },
  { injury: "Torn ACL/MCL", range: "$25,000 - $75,000", recovery: "6-9 months" },
  { injury: "Concussion", range: "$20,000 - $100,000", recovery: "1-6 months" },
  { injury: "Traumatic Brain Injury", range: "$100,000 - $1,000,000+", recovery: "Varies" },
  { injury: "Spinal Cord Injury", range: "$500,000 - $5,000,000+", recovery: "Permanent" }
];

// FAQ data
const faqs = [
  {
    question: "What is the formula for pain and suffering?",
    answer: "There are two main formulas: 1) Multiplier Method: Total Economic Damages × Multiplier (1.5 to 5). The multiplier depends on injury severity—minor injuries use 1.5-2, severe/permanent injuries use 4-5. 2) Per Diem Method: Daily Rate × Number of Days Suffering. The daily rate is often based on your daily income. Insurance companies typically use the multiplier method."
  },
  {
    question: "What is my pain and suffering worth?",
    answer: "Your pain and suffering value depends on several factors: severity of injuries, length of recovery, impact on daily life, whether injuries are permanent, medical documentation quality, and your jurisdiction. As a rough estimate, pain and suffering typically ranges from 1.5× to 5× your economic damages (medical bills + lost wages). For example, $20,000 in medical bills with moderate injuries might yield $40,000-$60,000 in pain and suffering."
  },
  {
    question: "How much will Progressive (or other insurers) pay for pain and suffering?",
    answer: "Insurance companies like Progressive, State Farm, and Geico use computer programs (like Colossus) to calculate pain and suffering. They typically start with a low multiplier (1.5-2×) and adjust based on injury severity, medical treatment, and documentation. Having an attorney often results in 2-3× higher settlements because lawyers know how to document and negotiate effectively. Without a lawyer, expect insurers to offer the lower end of the range."
  },
  {
    question: "How to calculate compensation for pain and suffering?",
    answer: "Step 1: Add up all economic damages (medical bills, lost wages, property damage). Step 2: Assess injury severity and choose an appropriate multiplier (1.5-5). Step 3: Multiply economic damages by the multiplier. Step 4: Adjust for factors like permanent injury, emotional trauma, and impact on quality of life. For example: $30,000 medical bills × 3 (moderate injury) = $90,000 pain and suffering estimate."
  },
  {
    question: "What factors increase pain and suffering compensation?",
    answer: "Factors that increase compensation: 1) Permanent or long-lasting injuries, 2) Visible scarring or disfigurement, 3) Impact on daily activities and quality of life, 4) Need for ongoing treatment, 5) Clear evidence the other party was at fault, 6) Strong medical documentation, 7) Testimony from doctors and experts, 8) Pain journal documenting daily struggles. Younger victims may also receive more due to longer-term impact."
  },
  {
    question: "Should I hire a lawyer for my pain and suffering claim?",
    answer: "Studies show that accident victims represented by attorneys receive on average 3-3.5× more compensation than those without lawyers, even after attorney fees (typically 33%). You should strongly consider a lawyer if: your injuries are serious, you have significant medical bills, the insurance company is offering a low settlement, fault is disputed, or you have permanent injuries. Most personal injury lawyers offer free consultations and work on contingency (no fee unless you win)."
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

export default function PainAndSufferingCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"multiplier" | "perDiem">("multiplier");
  
  // Multiplier method state
  const [medicalExpenses, setMedicalExpenses] = useState<string>("10000");
  const [futureMedical, setFutureMedical] = useState<string>("5000");
  const [lostWages, setLostWages] = useState<string>("5000");
  const [futureLostWages, setFutureLostWages] = useState<string>("0");
  const [propertyDamage, setPropertyDamage] = useState<string>("0");
  const [injuryType, setInjuryType] = useState<string>("broken_minor");
  const [faultPercent, setFaultPercent] = useState<string>("0");
  
  // Per diem method state
  const [dailyRate, setDailyRate] = useState<string>("200");
  const [daysOfSuffering, setDaysOfSuffering] = useState<string>("90");

  // Get selected injury
  const selectedInjury = injuryTypes.find(i => i.id === injuryType) || injuryTypes[1];

  // Calculate economic damages
  const economicDamages = 
    (parseFloat(medicalExpenses) || 0) +
    (parseFloat(futureMedical) || 0) +
    (parseFloat(lostWages) || 0) +
    (parseFloat(futureLostWages) || 0) +
    (parseFloat(propertyDamage) || 0);

  // Calculate multiplier method results
  const painSufferingLow = economicDamages * selectedInjury.minMult;
  const painSufferingMid = economicDamages * ((selectedInjury.minMult + selectedInjury.maxMult) / 2);
  const painSufferingHigh = economicDamages * selectedInjury.maxMult;

  // Calculate per diem method results
  const perDiemResult = (parseFloat(dailyRate) || 0) * (parseFloat(daysOfSuffering) || 0);

  // Calculate total settlement
  const totalLow = economicDamages + painSufferingLow;
  const totalMid = economicDamages + painSufferingMid;
  const totalHigh = economicDamages + painSufferingHigh;

  // Apply fault reduction
  const faultReduction = (parseFloat(faultPercent) || 0) / 100;
  const adjustedTotalLow = totalLow * (1 - faultReduction);
  const adjustedTotalMid = totalMid * (1 - faultReduction);
  const adjustedTotalHigh = totalHigh * (1 - faultReduction);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pain and Suffering Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Pain and Suffering Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your pain and suffering compensation for a personal injury claim. 
            Calculate using both the multiplier method and per diem method. Free instant estimates for car accidents, slip and falls, and more.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Quick Formula: Economic Damages × Multiplier (1.5 - 5)</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Example: $20,000 medical bills × 3 (moderate injury) = <strong>$60,000</strong> pain & suffering estimate. 
                Total settlement = $20,000 + $60,000 = <strong>$80,000</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("multiplier")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: activeTab === "multiplier" ? "2px solid #DC2626" : "1px solid #E5E7EB",
              backgroundColor: activeTab === "multiplier" ? "#FEF2F2" : "white",
              color: activeTab === "multiplier" ? "#DC2626" : "#4B5563",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>✖️</span> Multiplier Method
          </button>
          <button
            onClick={() => setActiveTab("perDiem")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: activeTab === "perDiem" ? "2px solid #2563EB" : "1px solid #E5E7EB",
              backgroundColor: activeTab === "perDiem" ? "#EFF6FF" : "white",
              color: activeTab === "perDiem" ? "#2563EB" : "#4B5563",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>📅</span> Per Diem Method
          </button>
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: activeTab === "multiplier" ? "#DC2626" : "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "multiplier" ? "✖️ Multiplier Method" : "📅 Per Diem Method"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "multiplier" ? (
                <>
                  {/* Economic Damages Section */}
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>
                    💰 Economic Damages
                  </h3>

                  {/* Medical Expenses */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Medical Expenses (Past)
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
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Future Medical */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Future Medical Expenses (Estimated)
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
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Lost Wages */}
                  <div style={{ marginBottom: "16px" }}>
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
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Future Lost Wages */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Future Lost Wages (Estimated)
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
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Property Damage */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Property Damage
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={propertyDamage}
                        onChange={(e) => setPropertyDamage(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  {/* Injury Type Section */}
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>
                    🩹 Injury Type (Determines Multiplier)
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                    {injuryTypes.map((injury) => (
                      <button
                        key={injury.id}
                        onClick={() => setInjuryType(injury.id)}
                        style={{
                          padding: "10px",
                          borderRadius: "8px",
                          border: injuryType === injury.id ? "2px solid #DC2626" : "1px solid #E5E7EB",
                          backgroundColor: injuryType === injury.id ? "#FEF2F2" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{injury.icon}</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: injuryType === injury.id ? "#DC2626" : "#374151" }}>
                            {injury.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px" }}>
                          {injury.minMult}× - {injury.maxMult}×
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Fault Percentage */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Your Fault Percentage (Comparative Negligence)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={faultPercent}
                        onChange={(e) => setFaultPercent(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <span style={{ fontWeight: "600", color: "#DC2626", minWidth: "45px" }}>{faultPercent}%</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "6px 0 0 0" }}>
                      If you were partially at fault, your compensation may be reduced.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Per Diem Method */}
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", marginBottom: "20px", lineHeight: "1.6" }}>
                    The Per Diem method calculates pain and suffering by assigning a daily dollar value 
                    to your suffering and multiplying by the number of days affected.
                  </p>

                  {/* Daily Rate */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Daily Rate (Value of Your Daily Suffering)
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
                          border: "1px solid #E5E7EB",
                          fontSize: "1.1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "6px 0 0 0" }}>
                      💡 Tip: Use your daily income as a starting point (Annual salary ÷ 365)
                    </p>
                  </div>

                  {/* Days of Suffering */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Days of Suffering
                    </label>
                    <input
                      type="number"
                      value={daysOfSuffering}
                      onChange={(e) => setDaysOfSuffering(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1.1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "6px 0 0 0" }}>
                      Include all days from injury until full recovery
                    </p>
                  </div>

                  {/* Quick Select Buttons */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "500" }}>
                      Quick Select Recovery Period
                    </label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {[
                        { days: 30, label: "1 Month" },
                        { days: 60, label: "2 Months" },
                        { days: 90, label: "3 Months" },
                        { days: 180, label: "6 Months" },
                        { days: 365, label: "1 Year" }
                      ].map((preset) => (
                        <button
                          key={preset.days}
                          onClick={() => setDaysOfSuffering(String(preset.days))}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: daysOfSuffering === String(preset.days) ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: daysOfSuffering === String(preset.days) ? "#EFF6FF" : "white",
                            color: daysOfSuffering === String(preset.days) ? "#2563EB" : "#374151",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Economic Damages for Per Diem */}
                  <div style={{ padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Total Economic Damages (for total settlement)
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
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
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
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Estimated Settlement</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* Economic Damages Total */}
              <div style={{
                backgroundColor: "#F3F4F6",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B7280" }}>Total Economic Damages</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>
                  ${economicDamages.toLocaleString()}
                </p>
              </div>

              {/* Pain & Suffering Estimate */}
              <div style={{
                backgroundColor: "#FEF2F2",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #FECACA"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#DC2626", fontWeight: "600" }}>
                  Pain & Suffering ({activeTab === "multiplier" ? `${selectedInjury.minMult}× - ${selectedInjury.maxMult}×` : "Per Diem"})
                </p>
                {activeTab === "multiplier" ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>Low</p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#DC2626" }}>
                        ${painSufferingLow.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: "center", backgroundColor: "#FEE2E2", borderRadius: "6px", padding: "4px" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>Mid</p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#DC2626" }}>
                        ${painSufferingMid.toLocaleString()}
                      </p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>High</p>
                      <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "bold", color: "#DC2626" }}>
                        ${painSufferingHigh.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>
                    ${perDiemResult.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Total Settlement */}
              <div style={{
                backgroundColor: "#EDE9FE",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "16px"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#6D28D9", fontWeight: "600" }}>
                  Estimated Total Settlement
                  {parseFloat(faultPercent) > 0 && ` (After ${faultPercent}% Fault Reduction)`}
                </p>
                {activeTab === "multiplier" ? (
                  <div style={{ textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "2rem", fontWeight: "bold", color: "#5B21B6" }}>
                      ${Math.round(adjustedTotalLow).toLocaleString()} - ${Math.round(adjustedTotalHigh).toLocaleString()}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#7C3AED" }}>
                      Mid Estimate: <strong>${Math.round(adjustedTotalMid).toLocaleString()}</strong>
                    </p>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#5B21B6", textAlign: "center" }}>
                    ${Math.round((perDiemResult + economicDamages) * (1 - faultReduction)).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Method Comparison */}
              {activeTab === "multiplier" && (
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#1D4ED8", fontWeight: "600" }}>
                    📊 Compare with Per Diem Method
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#2563EB" }}>
                    At ${dailyRate}/day for {daysOfSuffering} days = <strong>${perDiemResult.toLocaleString()}</strong> pain & suffering
                  </p>
                </div>
              )}

              {/* Disclaimer */}
              <div style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                padding: "12px 16px"
              }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                  <strong>⚠️ Important:</strong> This is an estimate only. Actual settlements depend on many factors 
                  including evidence, jurisdiction, and negotiation. Consult a personal injury attorney for an accurate evaluation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Typical Settlements Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Typical Settlement Ranges by Injury Type</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Injury Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Typical Settlement</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recovery Time</th>
                </tr>
              </thead>
              <tbody>
                {typicalSettlements.map((item, idx) => (
                  <tr key={item.injury} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{item.injury}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{item.range}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{item.recovery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "16px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              *Ranges are estimates based on national averages. Actual settlements vary significantly based on specific circumstances, jurisdiction, and legal representation.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚖️ Understanding Pain and Suffering Damages</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Pain and suffering is a legal term that refers to the physical discomfort and emotional distress 
                  you experience as a result of an injury. Unlike economic damages (medical bills, lost wages), 
                  pain and suffering is considered <strong>non-economic damage</strong> because it doesn&apos;t have 
                  a direct dollar value.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Two Methods to Calculate Pain and Suffering</h3>
                
                <p><strong>1. Multiplier Method (Most Common)</strong></p>
                <p>
                  Add up your economic damages and multiply by a factor of 1.5 to 5, depending on injury severity. 
                  Insurance companies typically use this method. Minor injuries get a lower multiplier (1.5-2), 
                  while severe or permanent injuries justify higher multipliers (4-5).
                </p>
                
                <p><strong>2. Per Diem Method</strong></p>
                <p>
                  Assign a daily dollar value to your suffering (often based on your daily income) and multiply 
                  by the number of days you&apos;ve been affected. This method works well for injuries with clear 
                  recovery timelines but is harder to justify for permanent injuries.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors That Affect Your Settlement</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Injury severity:</strong> More severe = higher multiplier</li>
                  <li><strong>Recovery time:</strong> Longer recovery = more compensation</li>
                  <li><strong>Permanent effects:</strong> Lasting injuries significantly increase value</li>
                  <li><strong>Impact on daily life:</strong> Can you work? Enjoy hobbies?</li>
                  <li><strong>Documentation:</strong> Medical records, photos, pain journal</li>
                  <li><strong>Liability clarity:</strong> Clear fault = stronger case</li>
                  <li><strong>Legal representation:</strong> Lawyers typically get 2-3× higher settlements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Multiplier Guide */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "16px" }}>📋 Multiplier Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#7F1D1D", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>1.5 - 2×:</strong> Minor injuries, full recovery</p>
                <p style={{ margin: 0 }}><strong>2 - 3×:</strong> Moderate injuries, some treatment</p>
                <p style={{ margin: 0 }}><strong>3 - 4×:</strong> Serious injuries, surgery needed</p>
                <p style={{ margin: 0 }}><strong>4 - 5×:</strong> Severe/permanent injuries</p>
                <p style={{ margin: 0 }}><strong>5+×:</strong> Catastrophic, life-changing</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Tips to Maximize</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✅ Keep a daily pain journal</p>
                <p style={{ margin: "0 0 8px 0" }}>✅ Document all medical visits</p>
                <p style={{ margin: "0 0 8px 0" }}>✅ Take photos of injuries</p>
                <p style={{ margin: "0 0 8px 0" }}>✅ Get witness statements</p>
                <p style={{ margin: 0 }}>✅ Consult with an attorney</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/pain-and-suffering-calculator" currentCategory="Finance" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#7F1D1D", textAlign: "center", margin: 0 }}>
            ⚖️ <strong>Legal Disclaimer:</strong> This calculator provides estimates for informational purposes only and does not constitute legal advice. 
            Pain and suffering calculations are complex and depend on many factors including jurisdiction, specific case details, evidence quality, and negotiation. 
            Always consult with a qualified personal injury attorney for an accurate evaluation of your case. Results from this calculator should not be relied upon for legal decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
