"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Softener capacity options
const softenerCapacities = [16000, 24000, 32000, 40000, 48000, 64000, 80000];

// Quick reference data
const quickReference = [
  { people: 2, hardness: 5, label: "Slightly Hard" },
  { people: 2, hardness: 10, label: "Mod. Hard" },
  { people: 4, hardness: 5, label: "Slightly Hard" },
  { people: 4, hardness: 10, label: "Mod. Hard" },
  { people: 4, hardness: 15, label: "Hard" },
  { people: 6, hardness: 10, label: "Mod. Hard" },
  { people: 6, hardness: 15, label: "Hard" },
];

// FAQ data
const faqs = [
  {
    question: "How to calculate what size water softener you need?",
    answer: "Multiply: (Number of People) × (Daily Water Usage, ~75 gallons) × (Water Hardness in GPG). This gives your daily grain requirement. Multiply by 7 for weekly needs, then choose a softener with slightly higher capacity. Example: 4 people × 75 gal × 10 GPG = 3,000 grains/day × 7 = 21,000 grains/week → Choose a 24,000 or 32,000 grain softener."
  },
  {
    question: "What size water softener for a 4 bedroom house?",
    answer: "A 4-bedroom house typically has 3-5 occupants. With average water hardness (10 GPG), you'd need: 4 people × 75 gal × 10 GPG = 3,000 grains/day = 21,000 grains/week. A 32,000-grain softener is ideal, providing about 10 days between regenerations. For very hard water (15+ GPG), consider a 40,000-48,000 grain unit."
  },
  {
    question: "Is a 48000 grain water softener enough?",
    answer: "A 48,000-grain softener is suitable for larger households (5-6 people) or homes with very hard water (15+ GPG). For a family of 4 with moderately hard water (10 GPG), it would regenerate only every 2+ weeks, which is actually too infrequent—resin can develop issues if not regenerated regularly. A 32,000-grain unit is often more efficient for average families."
  },
  {
    question: "Does the size of a water softener matter?",
    answer: "Yes, size matters significantly. An undersized softener regenerates too frequently, wasting salt and water while wearing out faster. An oversized softener may not regenerate often enough (ideally every 7-10 days), leading to resin fouling and channeling. The right size balances capacity with efficient regeneration frequency."
  },
  {
    question: "How many grains water softener for family of 2?",
    answer: "A family of 2 typically needs: 2 people × 75 gal × water hardness (GPG). With moderate hardness (10 GPG): 1,500 grains/day = 10,500 grains/week. A 16,000-24,000 grain softener is ideal. With very hard water (15+ GPG): 2,250 grains/day = 15,750 grains/week, suggesting a 24,000-grain unit."
  },
  {
    question: "How often should a water softener regenerate?",
    answer: "Optimal regeneration is every 7-10 days. More frequent regeneration (every 2-3 days) indicates an undersized unit and wastes salt/water. Less frequent (every 2+ weeks) can cause resin problems. Modern demand-initiated systems regenerate based on actual usage, which is most efficient. Size your softener so it naturally regenerates weekly under normal use."
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

// Get hardness level info
function getHardnessLevel(gpg: number): { label: string; color: string; bg: string } {
  if (gpg <= 3) return { label: "Soft", color: "#059669", bg: "#ECFDF5" };
  if (gpg <= 7) return { label: "Slightly Hard", color: "#0EA5E9", bg: "#E0F2FE" };
  if (gpg <= 10.5) return { label: "Moderately Hard", color: "#F59E0B", bg: "#FEF3C7" };
  if (gpg <= 14) return { label: "Hard", color: "#EA580C", bg: "#FFF7ED" };
  return { label: "Very Hard", color: "#DC2626", bg: "#FEF2F2" };
}

// Get recommended capacity
function getRecommendedCapacity(weeklyGrains: number): number {
  const withReserve = weeklyGrains * 1.25; // 25% reserve
  for (const capacity of softenerCapacities) {
    if (capacity >= withReserve) return capacity;
  }
  return 80000;
}

export default function WaterSoftenerSizeCalculator() {
  // Inputs
  const [people, setPeople] = useState<number>(4);
  const [customPeople, setCustomPeople] = useState<string>("");
  const [usageLevel, setUsageLevel] = useState<"low" | "average" | "high">("average");
  const [hardnessValue, setHardnessValue] = useState<string>("10");
  const [hardnessUnit, setHardnessUnit] = useState<"gpg" | "ppm">("gpg");
  const [ironContent, setIronContent] = useState<string>("0");
  
  // Results
  const [results, setResults] = useState({
    effectivePeople: 4,
    dailyWaterUsage: 300,
    hardnessGPG: 10,
    adjustedHardness: 10,
    dailyGrains: 3000,
    weeklyGrains: 21000,
    recommendedCapacity: 32000,
    regenerationDays: 10,
  });

  // Calculate
  useEffect(() => {
    const effectivePeople = customPeople ? parseInt(customPeople) || 4 : people;
    
    // Usage per person
    const usagePerPerson = usageLevel === "low" ? 50 : usageLevel === "high" ? 100 : 75;
    const dailyWaterUsage = effectivePeople * usagePerPerson;
    
    // Convert hardness to GPG
    const rawHardness = parseFloat(hardnessValue) || 0;
    const hardnessGPG = hardnessUnit === "ppm" ? rawHardness / 17.1 : rawHardness;
    
    // Adjust for iron content (add 5 GPG per 1 ppm iron)
    const iron = parseFloat(ironContent) || 0;
    const adjustedHardness = hardnessGPG + (iron * 5);
    
    // Calculate grains
    const dailyGrains = dailyWaterUsage * adjustedHardness;
    const weeklyGrains = dailyGrains * 7;
    
    // Get recommended capacity
    const recommendedCapacity = getRecommendedCapacity(weeklyGrains);
    
    // Calculate regeneration days
    const regenerationDays = dailyGrains > 0 ? Math.floor(recommendedCapacity / dailyGrains) : 0;
    
    setResults({
      effectivePeople,
      dailyWaterUsage,
      hardnessGPG,
      adjustedHardness,
      dailyGrains,
      weeklyGrains,
      recommendedCapacity,
      regenerationDays,
    });
  }, [people, customPeople, usageLevel, hardnessValue, hardnessUnit, ironContent]);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const hardnessLevel = getHardnessLevel(results.adjustedHardness);

  // Calculate for quick reference
  const calculateQuickRef = (ppl: number, gpg: number) => {
    const daily = ppl * 75 * gpg;
    const weekly = daily * 7;
    return {
      daily,
      weekly,
      recommended: getRecommendedCapacity(weekly)
    };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Water Softener Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💧</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Water Softener Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the right grain capacity for your household. Enter your family size, water hardness, and usage to find the perfect water softener size.
          </p>
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
          <div style={{ padding: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Household */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    👨‍👩‍👧‍👦 Household Information
                  </h3>

                  {/* Number of People */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Number of People
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <button
                          key={num}
                          onClick={() => { setPeople(num); setCustomPeople(""); }}
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "8px",
                            border: people === num && !customPeople ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                            backgroundColor: people === num && !customPeople ? "#E0F2FE" : "white",
                            color: people === num && !customPeople ? "#0284C7" : "#374151",
                            fontSize: "1rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          {num}
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="7+"
                        value={customPeople}
                        onChange={(e) => setCustomPeople(e.target.value)}
                        style={{
                          width: "60px",
                          height: "44px",
                          borderRadius: "8px",
                          border: customPeople ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: customPeople ? "#E0F2FE" : "white",
                          textAlign: "center",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>

                  {/* Water Usage Level */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Water Usage Level
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <button
                        onClick={() => setUsageLevel("low")}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: usageLevel === "low" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: usageLevel === "low" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: usageLevel === "low" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          Low
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>50 gal/person</p>
                      </button>
                      <button
                        onClick={() => setUsageLevel("average")}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: usageLevel === "average" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: usageLevel === "average" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: usageLevel === "average" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          Average
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>75 gal/person</p>
                      </button>
                      <button
                        onClick={() => setUsageLevel("high")}
                        style={{
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: usageLevel === "high" ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                          backgroundColor: usageLevel === "high" ? "#E0F2FE" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: usageLevel === "high" ? "#0284C7" : "#374151", margin: 0, fontSize: "0.85rem" }}>
                          High
                        </p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>100 gal/person</p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Water Quality */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🧪 Water Quality
                  </h3>

                  {/* Hardness */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Water Hardness
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="number"
                        value={hardnessValue}
                        onChange={(e) => setHardnessValue(e.target.value)}
                        style={{
                          flex: "1",
                          padding: "10px 12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        max="100"
                        step="0.5"
                      />
                      <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                        <button
                          onClick={() => setHardnessUnit("gpg")}
                          style={{
                            padding: "10px 14px",
                            border: "none",
                            backgroundColor: hardnessUnit === "gpg" ? "#0EA5E9" : "white",
                            color: hardnessUnit === "gpg" ? "white" : "#374151",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          GPG
                        </button>
                        <button
                          onClick={() => setHardnessUnit("ppm")}
                          style={{
                            padding: "10px 14px",
                            border: "none",
                            borderLeft: "1px solid #E5E7EB",
                            backgroundColor: hardnessUnit === "ppm" ? "#0EA5E9" : "white",
                            color: hardnessUnit === "ppm" ? "white" : "#374151",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          PPM
                        </button>
                      </div>
                    </div>
                    {hardnessUnit === "ppm" && (
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                        = {(parseFloat(hardnessValue) / 17.1 || 0).toFixed(1)} GPG (PPM ÷ 17.1)
                      </p>
                    )}
                  </div>

                  {/* Iron Content */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Iron Content (Optional)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={ironContent}
                        onChange={(e) => setIronContent(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 50px 10px 12px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        max="20"
                        step="0.1"
                        placeholder="0"
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.85rem" }}>
                        ppm
                      </span>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      Adds 5 GPG for every 1 ppm of iron
                    </p>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                {/* Recommended Size */}
                <div style={{
                  backgroundColor: "#0EA5E9",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Recommended Softener Size
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatNumber(results.recommendedCapacity)}
                  </p>
                  <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    Grains
                  </p>
                </div>

                {/* Water Hardness Level */}
                <div style={{
                  backgroundColor: hardnessLevel.bg,
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: "0 0 4px 0" }}>Your Water Hardness</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "700", color: hardnessLevel.color, margin: 0 }}>
                    {hardnessLevel.label} ({results.adjustedHardness.toFixed(1)} GPG)
                  </p>
                  {parseFloat(ironContent) > 0 && (
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Includes {(parseFloat(ironContent) * 5).toFixed(1)} GPG adjustment for iron
                    </p>
                  )}
                </div>

                {/* Key Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Daily Usage</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {formatNumber(results.dailyWaterUsage)} gal
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Daily Grains</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {formatNumber(results.dailyGrains)}
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Weekly Grains</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {formatNumber(results.weeklyGrains)}
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Regeneration</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#059669", margin: 0 }}>
                      ~{results.regenerationDays} days
                    </p>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", border: "1px solid #BAE6FD" }}>
                  <h4 style={{ fontWeight: "600", color: "#0369A1", marginBottom: "12px", fontSize: "0.9rem" }}>
                    📊 Calculation Breakdown
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "#0C4A6E" }}>
                    <p style={{ margin: "0 0 6px 0" }}>
                      {results.effectivePeople} people × {usageLevel === "low" ? 50 : usageLevel === "high" ? 100 : 75} gal × {results.adjustedHardness.toFixed(1)} GPG = <strong>{formatNumber(results.dailyGrains)} grains/day</strong>
                    </p>
                    <p style={{ margin: "0 0 6px 0" }}>
                      {formatNumber(results.dailyGrains)} × 7 days = <strong>{formatNumber(results.weeklyGrains)} grains/week</strong>
                    </p>
                    <p style={{ margin: "0 0 6px 0" }}>
                      With 25% reserve = {formatNumber(results.weeklyGrains * 1.25)} grains needed
                    </p>
                    <p style={{ margin: 0, fontWeight: "600" }}>
                      → Recommended: <span style={{ color: "#0EA5E9" }}>{formatNumber(results.recommendedCapacity)} grain</span> softener
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Water Softener Size Chart
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Quick reference based on household size and water hardness (75 gal/person/day)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>People</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Hardness</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Daily Grains</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Weekly Grains</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#E0F2FE" }}>Recommended</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const calc = calculateQuickRef(row.people, row.hardness);
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                        {row.people}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>
                        {row.hardness} GPG ({row.label})
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        {formatNumber(calc.daily)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        {formatNumber(calc.weekly)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0EA5E9", fontWeight: "600" }}>
                        {formatNumber(calc.recommended)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Water Hardness Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🧪 Water Hardness Guide
              </h2>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "700", color: "#059669" }}>0-3 GPG</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#059669" }}>Soft</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - No softener needed</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#E0F2FE", borderRadius: "8px" }}>
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "700", color: "#0EA5E9" }}>3-7 GPG</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#0EA5E9" }}>Slightly Hard</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Softener beneficial</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "700", color: "#F59E0B" }}>7-10 GPG</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#F59E0B" }}>Moderately Hard</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Softener recommended</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FFF7ED", borderRadius: "8px" }}>
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "700", color: "#EA580C" }}>10-14 GPG</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#EA580C" }}>Hard</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Softener necessary</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
                  <div style={{ width: "60px", textAlign: "center", fontWeight: "700", color: "#DC2626" }}>14+ GPG</div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>Very Hard</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - High-capacity softener essential</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                  <strong>💡 Tip:</strong> To convert PPM (parts per million) or mg/L to GPG: divide by 17.1
                </p>
              </div>
            </div>

            {/* Sizing Formula */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 How to Size a Water Softener
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Daily Water Usage</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Number of people × 75 gallons (average per person)
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Daily Grain Requirement</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Daily water usage × Water hardness (GPG)
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0EA5E9", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Calculate Weekly Requirement</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Daily grains × 7 (for weekly regeneration)
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Choose Softener Capacity</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Select a softener slightly above your weekly requirement (+25% reserve)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Capacity Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📋 Softener Sizes
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>16,000</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>1-2 people</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>24,000</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>2-3 people</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>32,000</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>3-4 people</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>40,000</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>4-5 people</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>48,000</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>5-6 people</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#0EA5E9" }}>64,000+</span>
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>6+ / commercial</span>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
                *Based on moderate hardness (~10 GPG)
              </p>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "#F0F9FF",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #BAE6FD"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0369A1", marginBottom: "12px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#0C4A6E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Regenerate every 7-10 days for optimal efficiency</li>
                <li style={{ marginBottom: "8px" }}>Don&apos;t oversize - it wastes salt and causes resin issues</li>
                <li style={{ marginBottom: "8px" }}>Add 5 GPG for each 1 ppm of iron</li>
                <li>Test your water before buying</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/water-softener-size-calculator"
              currentCategory="Home"
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

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            💧 <strong>Disclaimer:</strong> This calculator provides estimates based on average water usage patterns. Actual requirements may vary based on specific household habits, appliances, and water quality. For precise sizing, consult a water treatment professional and test your water hardness.
          </p>
        </div>
      </div>
    </div>
  );
}