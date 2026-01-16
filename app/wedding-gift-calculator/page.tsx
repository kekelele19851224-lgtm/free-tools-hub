"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Relationship base amounts
const relationshipData = [
  { value: "immediate_family", label: "Immediate Family (parent, sibling)", baseMin: 200, baseMax: 500, icon: "👨‍👩‍👧‍👦" },
  { value: "close_family", label: "Close Family (aunt, uncle, cousin)", baseMin: 150, baseMax: 250, icon: "👪" },
  { value: "close_friend", label: "Close Friend / Best Friend", baseMin: 150, baseMax: 200, icon: "💕" },
  { value: "friend", label: "Friend", baseMin: 100, baseMax: 150, icon: "😊" },
  { value: "coworker", label: "Coworker / Colleague", baseMin: 75, baseMax: 125, icon: "💼" },
  { value: "acquaintance", label: "Acquaintance / Distant Relative", baseMin: 50, baseMax: 100, icon: "👋" },
  { value: "boss", label: "Boss / Manager", baseMin: 100, baseMax: 150, icon: "👔" },
];

// Wedding style multipliers
const weddingStyles = [
  { value: "casual", label: "Casual / Backyard", multiplier: 0.9 },
  { value: "standard", label: "Standard / Traditional", multiplier: 1.0 },
  { value: "formal", label: "Formal / Black-tie", multiplier: 1.15 },
  { value: "destination", label: "Destination Wedding", multiplier: 0.75 },
];

// Gift amount reference table
const giftAmountTable = [
  { relationship: "Immediate Family", single: "$200 - $500+", couple: "$300 - $750+", notAttending: "$150 - $300" },
  { relationship: "Close Family", single: "$150 - $250", couple: "$250 - $400", notAttending: "$100 - $150" },
  { relationship: "Close Friend", single: "$150 - $200", couple: "$250 - $350", notAttending: "$100 - $150" },
  { relationship: "Friend", single: "$100 - $150", couple: "$175 - $250", notAttending: "$75 - $100" },
  { relationship: "Coworker", single: "$75 - $125", couple: "$125 - $200", notAttending: "$50 - $75" },
  { relationship: "Acquaintance", single: "$50 - $100", couple: "$100 - $175", notAttending: "$50" },
];

// FAQ data
const faqs = [
  {
    question: "What is the 50 30 20 rule for weddings?",
    answer: "The 50/30/20 rule (sometimes 20/20/60) helps you budget across multiple wedding events. If attending the engagement party, bridal shower, and wedding, allocate 20% for the engagement gift, 20% for the shower gift, and 60% for the wedding gift. For example, with a $200 total budget: $40 engagement, $40 shower, $120 wedding gift."
  },
  {
    question: "Is $200 an appropriate wedding gift?",
    answer: "Yes, $200 is a generous and appropriate wedding gift amount. It's suitable for close friends, family members, or when attending as a couple. According to The Knot's 2024 Guest Study, the average wedding gift is around $150, so $200 exceeds the typical amount and would be well-received by most couples."
  },
  {
    question: "Is $100 per person a good wedding gift?",
    answer: "$100 per person is perfectly acceptable and aligns with the national average for wedding gifts. It's appropriate for friends, coworkers, and most family members. If attending as a couple, giving $200 total ($100 each) is considered generous and thoughtful."
  },
  {
    question: "What is the formula for wedding gift amount?",
    answer: "While there's no exact formula, consider: 1) Your relationship to the couple (closer = more), 2) Your budget comfort level, 3) Whether you're attending or bringing a plus-one, 4) The wedding style and location. A good starting point is $100-150 for average relationships, adjusted up for close family/friends or down if you're on a tight budget."
  },
  {
    question: "How much should you give if not attending the wedding?",
    answer: "If you can't attend but want to send a gift, giving 50-70% of what you would have given in person is appropriate. For example, if you'd normally give $150, sending $75-100 is thoughtful. You're not obligated to give a gift if declining, but it's a nice gesture, especially for close friends or family."
  },
  {
    question: "Is it OK to give cash as a wedding gift?",
    answer: "Absolutely! Cash is not only acceptable but often preferred by modern couples. It gives them flexibility to use the money for what they need most—whether that's a down payment, honeymoon, or paying off wedding expenses. Present cash in a nice card, and consider using a check for security at large receptions."
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

export default function WeddingGiftCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'guide' | 'tips'>('calculator');

  // Calculator inputs
  const [relationship, setRelationship] = useState<string>("friend");
  const [isAttending, setIsAttending] = useState<boolean>(true);
  const [hasPlusOne, setHasPlusOne] = useState<boolean>(false);
  const [weddingStyle, setWeddingStyle] = useState<string>("standard");
  const [inWeddingParty, setInWeddingParty] = useState<boolean>(false);
  const [budgetLevel, setBudgetLevel] = useState<string>("3");

  // Calculate gift amount
  const giftResults = useMemo(() => {
    const relationshipInfo = relationshipData.find(r => r.value === relationship);
    const styleInfo = weddingStyles.find(s => s.value === weddingStyle);
    
    if (!relationshipInfo || !styleInfo) {
      return { min: 100, max: 150, target: 125, breakdown: [] };
    }

    let minAmount = relationshipInfo.baseMin;
    let maxAmount = relationshipInfo.baseMax;
    const breakdown: string[] = [];

    breakdown.push(`Base amount for ${relationshipInfo.label}: $${minAmount} - $${maxAmount}`);

    // Not attending modifier
    if (!isAttending) {
      minAmount *= 0.6;
      maxAmount *= 0.6;
      breakdown.push("Not attending: -40%");
    }

    // Plus one modifier
    if (isAttending && hasPlusOne) {
      minAmount *= 1.8;
      maxAmount *= 1.8;
      breakdown.push("Bringing plus-one: +80%");
    }

    // Wedding party modifier
    if (inWeddingParty) {
      minAmount *= 0.85;
      maxAmount *= 0.85;
      breakdown.push("In wedding party (already contributed): -15%");
    }

    // Wedding style modifier
    minAmount *= styleInfo.multiplier;
    maxAmount *= styleInfo.multiplier;
    if (styleInfo.multiplier !== 1.0) {
      const percent = Math.round((styleInfo.multiplier - 1) * 100);
      breakdown.push(`${styleInfo.label}: ${percent > 0 ? '+' : ''}${percent}%`);
    }

    // Budget level modifier (1-5 scale -> 0.7-1.3)
    const budgetMultiplier = 0.7 + (parseInt(budgetLevel) - 1) * 0.15;
    minAmount *= budgetMultiplier;
    maxAmount *= budgetMultiplier;
    if (budgetMultiplier !== 1.0) {
      const budgetLabels = ["Tight", "Limited", "Moderate", "Comfortable", "Generous"];
      breakdown.push(`Budget level (${budgetLabels[parseInt(budgetLevel) - 1]}): ${Math.round((budgetMultiplier - 1) * 100)}%`);
    }

    // Round to nearest 5
    minAmount = Math.round(minAmount / 5) * 5;
    maxAmount = Math.round(maxAmount / 5) * 5;
    const target = Math.round((minAmount + maxAmount) / 2 / 5) * 5;

    return {
      min: Math.max(25, minAmount),
      max: Math.max(50, maxAmount),
      target: Math.max(35, target),
      breakdown
    };
  }, [relationship, isAttending, hasPlusOne, weddingStyle, inWeddingParty, budgetLevel]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF2F8" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #FBCFE8" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Wedding Gift Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💒</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Wedding Gift Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much money to give as a wedding gift based on your relationship with the couple, 
            wedding style, and budget. Get personalized recommendations with 2025 etiquette guidelines.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FCE7F3",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #F9A8D4"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#9D174D", margin: "0 0 4px 0" }}>
                <strong>Quick Guide:</strong> Average wedding gift is $100 - $150 per guest
              </p>
              <p style={{ color: "#BE185D", margin: 0, fontSize: "0.95rem" }}>
                Close friends & family: $150-$200+ | Coworkers: $75-$125 | Attending as couple: 1.5-2× single amount
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
              backgroundColor: activeTab === "calculator" ? "#DB2777" : "#FBCFE8",
              color: activeTab === "calculator" ? "white" : "#9D174D",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💵 Gift Calculator
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "guide" ? "#DB2777" : "#FBCFE8",
              color: activeTab === "guide" ? "white" : "#9D174D",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Amount Guide
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "tips" ? "#DB2777" : "#FBCFE8",
              color: activeTab === "tips" ? "white" : "#9D174D",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💡 Etiquette Tips
          </button>
        </div>

        {/* Tab 1: Gift Calculator */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DB2777", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💒 Your Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Relationship */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Your relationship to the couple
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #F9A8D4",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {relationshipData.map(rel => (
                      <option key={rel.value} value={rel.value}>
                        {rel.icon} {rel.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attending */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Are you attending the wedding?
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setIsAttending(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: isAttending ? "2px solid #DB2777" : "1px solid #F9A8D4",
                        backgroundColor: isAttending ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontWeight: isAttending ? "600" : "400",
                        color: isAttending ? "#9D174D" : "#4B5563"
                      }}
                    >
                      ✓ Yes, attending
                    </button>
                    <button
                      onClick={() => { setIsAttending(false); setHasPlusOne(false); }}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: !isAttending ? "2px solid #DB2777" : "1px solid #F9A8D4",
                        backgroundColor: !isAttending ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontWeight: !isAttending ? "600" : "400",
                        color: !isAttending ? "#9D174D" : "#4B5563"
                      }}
                    >
                      ✗ No, sending gift
                    </button>
                  </div>
                </div>

                {/* Plus One - only show if attending */}
                {isAttending && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Are you bringing a plus-one?
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => setHasPlusOne(true)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: hasPlusOne ? "2px solid #DB2777" : "1px solid #F9A8D4",
                          backgroundColor: hasPlusOne ? "#FCE7F3" : "white",
                          cursor: "pointer",
                          fontWeight: hasPlusOne ? "600" : "400",
                          color: hasPlusOne ? "#9D174D" : "#4B5563"
                        }}
                      >
                        👫 Yes
                      </button>
                      <button
                        onClick={() => setHasPlusOne(false)}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: !hasPlusOne ? "2px solid #DB2777" : "1px solid #F9A8D4",
                          backgroundColor: !hasPlusOne ? "#FCE7F3" : "white",
                          cursor: "pointer",
                          fontWeight: !hasPlusOne ? "600" : "400",
                          color: !hasPlusOne ? "#9D174D" : "#4B5563"
                        }}
                      >
                        🧍 No, just me
                      </button>
                    </div>
                  </div>
                )}

                {/* Wedding Style */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Wedding style
                  </label>
                  <select
                    value={weddingStyle}
                    onChange={(e) => setWeddingStyle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #F9A8D4",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {weddingStyles.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                </div>

                {/* In Wedding Party */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Are you in the wedding party?
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setInWeddingParty(true)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: inWeddingParty ? "2px solid #DB2777" : "1px solid #F9A8D4",
                        backgroundColor: inWeddingParty ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontWeight: inWeddingParty ? "600" : "400",
                        color: inWeddingParty ? "#9D174D" : "#4B5563"
                      }}
                    >
                      💐 Yes
                    </button>
                    <button
                      onClick={() => setInWeddingParty(false)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: !inWeddingParty ? "2px solid #DB2777" : "1px solid #F9A8D4",
                        backgroundColor: !inWeddingParty ? "#FCE7F3" : "white",
                        cursor: "pointer",
                        fontWeight: !inWeddingParty ? "600" : "400",
                        color: !inWeddingParty ? "#9D174D" : "#4B5563"
                      }}
                    >
                      🪑 No, guest only
                    </button>
                  </div>
                </div>

                {/* Budget Level */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Your budget comfort level
                  </label>
                  <input
                    type="range"
                    value={budgetLevel}
                    onChange={(e) => setBudgetLevel(e.target.value)}
                    style={{ width: "100%", accentColor: "#DB2777" }}
                    min="1"
                    max="5"
                    step="1"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>Tight</span>
                    <span>Moderate</span>
                    <span>Generous</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FCE7F3",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #F9A8D4"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#9D174D" }}>
                    💡 <strong>Tip:</strong> Give what you&apos;re comfortable with. A thoughtful gift matters more than the amount.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #FBCFE8",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9D174D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🎁 Recommended Gift Amount
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#FCE7F3",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #DB2777"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#9D174D" }}>
                    Suggested Gift Range
                  </p>
                  <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#DB2777" }}>
                    ${giftResults.min} - ${giftResults.max}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1.1rem", color: "#9D174D" }}>
                    Target: <strong>${giftResults.target}</strong>
                  </p>
                </div>

                {/* Quick Suggestions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                  {[
                    { label: "Good", amount: giftResults.min },
                    { label: "Better", amount: giftResults.target },
                    { label: "Great", amount: giftResults.max }
                  ].map(option => (
                    <div key={option.label} style={{
                      padding: "12px 8px",
                      backgroundColor: option.label === "Better" ? "#FCE7F3" : "#F9FAFB",
                      borderRadius: "8px",
                      textAlign: "center",
                      border: option.label === "Better" ? "2px solid #F9A8D4" : "1px solid #E5E7EB"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>{option.label}</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: option.label === "Better" ? "#DB2777" : "#374151" }}>
                        ${option.amount}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>How we calculated this:</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {giftResults.breakdown.map((item, index) => (
                      <div key={index} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 12px",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}>
                        <span style={{ color: "#DB2777" }}>•</span>
                        <span style={{ color: "#4B5563" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cash vs Check */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E", fontWeight: "600" }}>
                    💵 Cash or Check?
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>
                    Both are appropriate! Checks are safer for large amounts. Include a heartfelt card with your gift.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Amount Guide */}
        {activeTab === 'guide' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FBCFE8",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 Wedding Gift Amount Guide (2025)
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Reference amounts based on relationship and attendance status. These are guidelines—always give what you&apos;re comfortable with.
            </p>

            {/* Main Amount Table */}
            <div style={{ marginBottom: "32px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FCE7F3" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #FBCFE8", fontWeight: "600" }}>Relationship</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #FBCFE8", fontWeight: "600" }}>Single Guest</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #FBCFE8", fontWeight: "600" }}>Couple</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #FBCFE8", fontWeight: "600" }}>Not Attending</th>
                  </tr>
                </thead>
                <tbody>
                  {giftAmountTable.map((row, index) => (
                    <tr key={row.relationship} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FDF2F8' }}>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #FBCFE8", fontWeight: "500" }}>{row.relationship}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #FBCFE8", textAlign: "center", color: "#DB2777", fontWeight: "600" }}>{row.single}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #FBCFE8", textAlign: "center", color: "#9D174D", fontWeight: "600" }}>{row.couple}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #FBCFE8", textAlign: "center", color: "#6B7280" }}>{row.notAttending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Special Situations */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                💫 Special Situations
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#FCE7F3", padding: "20px", borderRadius: "12px", border: "1px solid #F9A8D4" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#9D174D" }}>✈️ Destination Wedding</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#BE185D", lineHeight: "1.6" }}>
                    If you&apos;re spending significantly on travel and accommodations, it&apos;s acceptable to reduce your gift amount by 25-50%. The couple will understand.
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#92400E" }}>💐 In the Wedding Party</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#B45309", lineHeight: "1.6" }}>
                    Bridesmaids and groomsmen often spend $500-$1000+ on attire, parties, and travel. A smaller gift is perfectly acceptable.
                  </p>
                </div>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px", border: "1px solid #93C5FD" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#1E40AF" }}>👨‍👩‍👧‍👦 Multiple Events</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "1.6" }}>
                    Use the 20/20/60 rule: 20% for engagement party, 20% for shower, 60% for wedding gift.
                  </p>
                </div>
                <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", border: "1px solid #86EFAC" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#166534" }}>🤝 Group Gifts</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#15803D", lineHeight: "1.6" }}>
                    Pooling resources with other guests is a great way to give a bigger gift while staying within budget.
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Differences */}
            <div style={{
              backgroundColor: "#F9FAFB",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #E5E7EB"
            }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "1rem" }}>🌎 Regional Notes</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "0.9rem" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>Northeast US</p>
                  <p style={{ margin: "4px 0 0 0", color: "#6B7280" }}>Typically 15-20% higher amounts</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>Midwest / South</p>
                  <p style={{ margin: "4px 0 0 0", color: "#6B7280" }}>Generally follows national averages</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>Major Cities (NYC, LA, SF)</p>
                  <p style={{ margin: "4px 0 0 0", color: "#6B7280" }}>Often 20-30% higher due to cost of living</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Etiquette Tips */}
        {activeTab === 'tips' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #FBCFE8",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              💡 Wedding Gift Etiquette Tips
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Modern guidelines for giving wedding gifts with grace and confidence.
            </p>

            {/* Etiquette Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
              {/* Timing */}
              <div style={{ padding: "20px", backgroundColor: "#FDF2F8", borderRadius: "12px", border: "1px solid #FBCFE8" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#9D174D", fontSize: "1.125rem" }}>⏰ When to Give Your Gift</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563", lineHeight: "1.8" }}>
                  <li><strong>Best:</strong> 2 weeks before the wedding (shipped to their home)</li>
                  <li><strong>Good:</strong> At the reception (bring a card, not wrapped box)</li>
                  <li><strong>Also OK:</strong> Up to 2-3 months after the wedding</li>
                  <li>The &quot;one year to send a gift&quot; rule is outdated—sooner is better</li>
                </ul>
              </div>

              {/* Cash vs Registry */}
              <div style={{ padding: "20px", backgroundColor: "#F0FDF4", borderRadius: "12px", border: "1px solid #86EFAC" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#166534", fontSize: "1.125rem" }}>💵 Cash vs. Registry Gift</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#166534" }}>Cash/Check ✓</p>
                    <ul style={{ margin: "8px 0 0 0", paddingLeft: "16px", color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7" }}>
                      <li>Flexible for the couple</li>
                      <li>Perfect for honeymoon funds</li>
                      <li>Helps with home down payment</li>
                      <li>Easy if registry is picked over</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: "#166534" }}>Registry Gift ✓</p>
                    <ul style={{ margin: "8px 0 0 0", paddingLeft: "16px", color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7" }}>
                      <li>You know they want/need it</li>
                      <li>Can feel more personal</li>
                      <li>Good for tight budgets</li>
                      <li>Often includes discount</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* The 50/30/20 Rule */}
              <div style={{ padding: "20px", backgroundColor: "#DBEAFE", borderRadius: "12px", border: "1px solid #93C5FD" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#1E40AF", fontSize: "1.125rem" }}>📊 The 20/20/60 Rule</h3>
                <p style={{ color: "#4B5563", margin: "0 0 12px 0" }}>
                  If you&apos;re invited to multiple events, divide your total gift budget:
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1", minWidth: "120px", padding: "12px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1D4ED8" }}>20%</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>Engagement Party</p>
                  </div>
                  <div style={{ flex: "1", minWidth: "120px", padding: "12px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1D4ED8" }}>20%</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>Bridal Shower</p>
                  </div>
                  <div style={{ flex: "1", minWidth: "120px", padding: "12px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#1D4ED8" }}>60%</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>Wedding Gift</p>
                  </div>
                </div>
              </div>

              {/* What NOT to do */}
              <div style={{ padding: "20px", backgroundColor: "#FEF2F2", borderRadius: "12px", border: "1px solid #FECACA" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#991B1B", fontSize: "1.125rem" }}>❌ What to Avoid</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563", lineHeight: "1.8" }}>
                  <li>Don&apos;t ask the couple how much their wedding cost per plate</li>
                  <li>Don&apos;t give significantly less just because it&apos;s a casual wedding</li>
                  <li>Don&apos;t go into debt for a wedding gift—give what you can afford</li>
                  <li>Don&apos;t forget to include your name with cash gifts!</li>
                  <li>Don&apos;t regift or give obviously used items</li>
                </ul>
              </div>

              {/* Card Message */}
              <div style={{ padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "1.125rem" }}>✉️ What to Write in the Card</h3>
                <p style={{ color: "#4B5563", margin: "0 0 12px 0" }}>
                  Keep it warm and personal. Here&apos;s a simple template:
                </p>
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px", fontStyle: "italic", color: "#4B5563", lineHeight: "1.8" }}>
                  <p style={{ margin: 0 }}>Dear [Names],</p>
                  <p style={{ margin: "8px 0" }}>Congratulations on your wedding! Wishing you a lifetime of love, laughter, and happiness together. Please enjoy this gift as you begin your new chapter.</p>
                  <p style={{ margin: 0 }}>With love, [Your Name]</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💒 How Much to Give for a Wedding Gift</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Figuring out how much money to give as a wedding gift can feel stressful. You want to be generous enough 
                  to honor the couple, but you also need to stay within your budget. The good news? There&apos;s no single &quot;right&quot; 
                  amount—it depends on your relationship, circumstances, and what you can comfortably afford.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The National Average</h3>
                <p>
                  According to The Knot&apos;s 2024 Guest Study, the average wedding gift in the United States is around 
                  <strong> $150 per guest</strong>. However, this varies significantly based on your relationship with the 
                  couple and where you live.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Factors to Consider</h3>
                <div style={{
                  backgroundColor: "#FCE7F3",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #F9A8D4"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#9D174D" }}>
                    <li><strong>Your relationship:</strong> Closer relationships typically warrant larger gifts</li>
                    <li><strong>Your budget:</strong> Never go into debt for a wedding gift</li>
                    <li><strong>Attendance status:</strong> Attending guests usually give more than those who can&apos;t make it</li>
                    <li><strong>Plus-one:</strong> Couples attending together should give more than a single guest</li>
                    <li><strong>Travel costs:</strong> Destination wedding guests can reasonably give less</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The &quot;Cover Your Plate&quot; Myth</h3>
                <p>
                  You may have heard that you should give enough to &quot;cover your plate&quot; at the reception. While this 
                  was once common advice, modern etiquette experts say this is outdated. Your gift should reflect your 
                  relationship with the couple and your personal budget—not the cost of the wedding venue.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Cash is King</h3>
                <p>
                  Many modern couples prefer cash gifts over physical items. It gives them flexibility to use the money 
                  for what they need most—whether that&apos;s a honeymoon, home down payment, or everyday expenses. Don&apos;t 
                  feel awkward about giving money; it&apos;s often the most appreciated gift you can give.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FCE7F3", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #F9A8D4" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#9D174D", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#BE185D", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Average gift: $100-$150</p>
                <p style={{ margin: 0 }}>• Close friend/family: $150-$200</p>
                <p style={{ margin: 0 }}>• Coworker: $75-$125</p>
                <p style={{ margin: 0 }}>• Not attending: 50-70% of normal</p>
                <p style={{ margin: 0 }}>• As a couple: 1.5-2× single rate</p>
              </div>
            </div>

            {/* Did You Know */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>78% of couples today prefer cash or honeymoon fund contributions over physical gifts.</p>
                <p style={{ margin: 0 }}>Source: The Knot 2024 Study</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/wedding-gift-calculator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #FBCFE8", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FCE7F3", borderRadius: "8px", border: "1px solid #F9A8D4" }}>
          <p style={{ fontSize: "0.75rem", color: "#9D174D", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides suggestions based on general etiquette guidelines and averages. 
            The most important factor is giving what you can comfortably afford. A thoughtful card and heartfelt wishes 
            are always appreciated, regardless of the gift amount.
          </p>
        </div>
      </div>
    </div>
  );
}