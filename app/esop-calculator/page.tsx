"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How do I calculate the value of my ESOP?",
    answer: "To calculate your ESOP value, multiply your number of vested options by the spread (current Fair Market Value minus your strike price). For example, if you have 10,000 options with a $1 strike price and the current FMV is $5, your potential profit is (10,000 × ($5 - $1)) = $40,000. Remember that unvested options have no current value until they vest."
  },
  {
    question: "What is a vesting schedule and how does it work?",
    answer: "A vesting schedule determines when you gain ownership of your stock options over time. The most common is a 4-year vesting schedule with a 1-year cliff: you receive 0% during the first year, then 25% vests at the 1-year mark (the 'cliff'), followed by monthly vesting of 1/48th of your total grant. This means you need to stay employed to receive the full benefit of your options."
  },
  {
    question: "What is a cliff period in ESOP?",
    answer: "A cliff is a minimum period you must work before any options vest. Most companies use a 1-year cliff, meaning if you leave before completing one year, you forfeit all options. After the cliff, you typically receive 25% of your grant immediately, then continue vesting monthly or quarterly. The cliff protects companies from giving equity to short-term employees."
  },
  {
    question: "How are ESOPs taxed when exercised?",
    answer: "ESOP taxation varies by country and option type. In the US, ISOs (Incentive Stock Options) may trigger AMT at exercise, while NSOs (Non-Qualified) are taxed as ordinary income on the spread. When you sell, gains are taxed as capital gains (long-term if held 1+ year). In India, the spread at exercise is taxed as salary income (perquisite), and sale triggers capital gains tax."
  },
  {
    question: "What happens to my ESOP if I leave the company?",
    answer: "When you leave, you typically have 90 days (sometimes longer) to exercise your vested options. Unvested options are forfeited and return to the company's option pool. If you don't exercise within the post-termination window, you lose all options. Some companies offer extended exercise windows for long-tenured employees. Always check your specific grant agreement."
  },
  {
    question: "How do I compare job offers with different ESOP packages?",
    answer: "Compare offers by looking at: 1) Ownership percentage (your shares ÷ total shares outstanding), 2) Current value based on latest 409A valuation, 3) Vesting terms (cliff, schedule), 4) Company stage and exit potential. A smaller percentage of a large company may be worth more than a larger percentage of an early startup. Also consider base salary difference and risk tolerance."
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
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export default function ESOPCalculator() {
  const [activeTab, setActiveTab] = useState<'value' | 'vesting' | 'compare'>('value');

  // Tab 1: ESOP Value Calculator
  const [numberOfOptions, setNumberOfOptions] = useState<string>("10000");
  const [strikePrice, setStrikePrice] = useState<string>("1.00");
  const [currentFMV, setCurrentFMV] = useState<string>("5.00");
  const [vestingYears, setVestingYears] = useState<string>("4");
  const [cliffMonths, setCliffMonths] = useState<string>("12");
  const [monthsEmployed, setMonthsEmployed] = useState<string>("24");
  const [growthMultiple, setGrowthMultiple] = useState<string>("5");

  // Tab 2: Vesting Schedule
  const [vestingOptions, setVestingOptions] = useState<string>("10000");
  const [vestingPeriod, setVestingPeriod] = useState<string>("4");
  const [vestingCliff, setVestingCliff] = useState<string>("12");
  const [vestingFrequency, setVestingFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [startDate, setStartDate] = useState<string>("2025-01-01");

  // Tab 3: Compare Offers
  const [offerA, setOfferA] = useState({
    name: "Company A",
    salary: "120000",
    options: "5000",
    strike: "10",
    fmv: "15",
    totalShares: "10000000",
    valuation: "150000000"
  });
  const [offerB, setOfferB] = useState({
    name: "Company B",
    salary: "100000",
    options: "20000",
    strike: "1",
    fmv: "3",
    totalShares: "1000000",
    valuation: "10000000"
  });

  // Tab 1 Calculations
  const valueResults = useMemo(() => {
    const options = parseFloat(numberOfOptions) || 0;
    const strike = parseFloat(strikePrice) || 0;
    const fmv = parseFloat(currentFMV) || 0;
    const years = parseFloat(vestingYears) || 4;
    const cliff = parseFloat(cliffMonths) || 12;
    const months = parseFloat(monthsEmployed) || 0;
    const multiple = parseFloat(growthMultiple) || 1;

    // Calculate vested shares
    let vestedShares = 0;
    if (months >= cliff) {
      const totalVestingMonths = years * 12;
      const cliffVest = options * (cliff / totalVestingMonths);
      const monthlyVest = options / totalVestingMonths;
      const monthsAfterCliff = Math.min(months - cliff, totalVestingMonths - cliff);
      vestedShares = Math.min(cliffVest + (monthlyVest * monthsAfterCliff), options);
    }

    const unvestedShares = options - vestedShares;
    const spread = Math.max(fmv - strike, 0);
    const currentValue = options * fmv;
    const totalProfit = options * spread;
    const exerciseCost = options * strike;
    const vestedValue = vestedShares * spread;
    const unvestedValue = unvestedShares * spread;
    const vestedPercent = options > 0 ? (vestedShares / options) * 100 : 0;

    // Future projections
    const futurePrice = fmv * multiple;
    const futureValue = options * (futurePrice - strike);

    return {
      options,
      vestedShares: Math.round(vestedShares),
      unvestedShares: Math.round(unvestedShares),
      vestedPercent,
      spread,
      currentValue,
      totalProfit,
      exerciseCost,
      vestedValue,
      unvestedValue,
      futurePrice,
      futureValue,
      fmv,
      strike
    };
  }, [numberOfOptions, strikePrice, currentFMV, vestingYears, cliffMonths, monthsEmployed, growthMultiple]);

  // Tab 2 Calculations - Vesting Schedule
  const vestingSchedule = useMemo(() => {
    const options = parseFloat(vestingOptions) || 0;
    const years = parseFloat(vestingPeriod) || 4;
    const cliff = parseFloat(vestingCliff) || 12;
    const totalMonths = years * 12;

    const schedule = [];
    let cumulativeVested = 0;

    for (let month = 1; month <= totalMonths; month++) {
      if (month < cliff) {
        schedule.push({
          month,
          vestedThisPeriod: 0,
          totalVested: 0,
          percent: 0,
          isCliff: false
        });
      } else if (month === cliff) {
        const cliffAmount = Math.round(options * (cliff / totalMonths));
        cumulativeVested = cliffAmount;
        schedule.push({
          month,
          vestedThisPeriod: cliffAmount,
          totalVested: cumulativeVested,
          percent: (cumulativeVested / options) * 100,
          isCliff: true
        });
      } else {
        let vestedThisPeriod = 0;
        if (vestingFrequency === 'monthly') {
          vestedThisPeriod = Math.round(options / totalMonths);
        } else if (vestingFrequency === 'quarterly' && month % 3 === 0) {
          vestedThisPeriod = Math.round((options / totalMonths) * 3);
        } else if (vestingFrequency === 'annually' && month % 12 === 0) {
          vestedThisPeriod = Math.round(options / years);
        }
        cumulativeVested = Math.min(cumulativeVested + vestedThisPeriod, options);
        schedule.push({
          month,
          vestedThisPeriod,
          totalVested: cumulativeVested,
          percent: (cumulativeVested / options) * 100,
          isCliff: false
        });
      }
    }

    return schedule;
  }, [vestingOptions, vestingPeriod, vestingCliff, vestingFrequency]);

  // Tab 3 Calculations - Compare Offers
  const compareResults = useMemo(() => {
    const a = {
      salary: parseFloat(offerA.salary) || 0,
      options: parseFloat(offerA.options) || 0,
      strike: parseFloat(offerA.strike) || 0,
      fmv: parseFloat(offerA.fmv) || 0,
      totalShares: parseFloat(offerA.totalShares) || 1,
      valuation: parseFloat(offerA.valuation) || 0
    };

    const b = {
      salary: parseFloat(offerB.salary) || 0,
      options: parseFloat(offerB.options) || 0,
      strike: parseFloat(offerB.strike) || 0,
      fmv: parseFloat(offerB.fmv) || 0,
      totalShares: parseFloat(offerB.totalShares) || 1,
      valuation: parseFloat(offerB.valuation) || 0
    };

    const ownershipA = (a.options / a.totalShares) * 100;
    const ownershipB = (b.options / b.totalShares) * 100;

    const currentValueA = a.options * (a.fmv - a.strike);
    const currentValueB = b.options * (b.fmv - b.strike);

    // 4 year total comp
    const totalCompA = (a.salary * 4) + currentValueA;
    const totalCompB = (b.salary * 4) + currentValueB;

    // If company grows 5x
    const value5xA = a.options * ((a.fmv * 5) - a.strike);
    const value5xB = b.options * ((b.fmv * 5) - b.strike);
    const total5xA = (a.salary * 4) + value5xA;
    const total5xB = (b.salary * 4) + value5xB;

    // If company grows 10x
    const value10xA = a.options * ((a.fmv * 10) - a.strike);
    const value10xB = b.options * ((b.fmv * 10) - b.strike);
    const total10xA = (a.salary * 4) + value10xA;
    const total10xB = (b.salary * 4) + value10xB;

    return {
      a: { ...a, ownership: ownershipA, currentValue: currentValueA, totalComp: totalCompA, value5x: value5xA, total5x: total5xA, value10x: value10xA, total10x: total10xA },
      b: { ...b, ownership: ownershipB, currentValue: currentValueB, totalComp: totalCompB, value5x: value5xB, total5x: total5xB, value10x: value10xB, total10x: total10xB }
    };
  }, [offerA, offerB]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>ESOP Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              ESOP Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free employee stock option calculator. Calculate your ESOP value, visualize vesting schedules, 
            and compare job offers with equity compensation.
          </p>
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
              <p style={{ fontWeight: "600", color: "#4338CA", margin: "0 0 4px 0" }}>
                Quick Formula: <strong>ESOP Value = Vested Shares × (FMV - Strike Price)</strong>
              </p>
              <p style={{ color: "#6366F1", margin: 0, fontSize: "0.95rem" }}>
                Standard vesting: 4 years with 1-year cliff • 25% vests at cliff, then monthly
              </p>
            </div>
          </div>
        </div>

        {/* Features Badge */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#ECFDF5",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #6EE7B7"
          }}>
            <span>✓</span>
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>Vesting Calculator</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EEF2FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #C7D2FE"
          }}>
            <span>✓</span>
            <span style={{ color: "#4338CA", fontWeight: "600", fontSize: "0.85rem" }}>Offer Comparison</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#FEF3C7",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #FCD34D"
          }}>
            <span>✓</span>
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Growth Projections</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("value")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "value" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "value" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 ESOP Value
          </button>
          <button
            onClick={() => setActiveTab("vesting")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "vesting" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "vesting" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📅 Vesting Schedule
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "compare" ? "#4F46E5" : "#E5E7EB",
              color: activeTab === "compare" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚖️ Compare Offers
          </button>
        </div>

        {/* Tab 1: ESOP Value Calculator */}
        {activeTab === "value" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Your ESOP Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Number of Options */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Number of Options Granted
                  </label>
                  <input
                    type="number"
                    value={numberOfOptions}
                    onChange={(e) => setNumberOfOptions(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #4F46E5",
                      fontSize: "1rem",
                      backgroundColor: "#EEF2FF",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Strike Price & Current FMV */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Strike Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={strikePrice}
                        onChange={(e) => setStrikePrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Current FMV
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={currentFMV}
                        onChange={(e) => setCurrentFMV(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Vesting Period */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vesting Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["3", "4", "5"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setVestingYears(y)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: vestingYears === y ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: vestingYears === y ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: vestingYears === y ? "600" : "normal"
                        }}
                      >
                        {y} Years
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cliff Period */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Cliff Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[{ v: "0", l: "No Cliff" }, { v: "6", l: "6 Months" }, { v: "12", l: "1 Year" }].map((c) => (
                      <button
                        key={c.v}
                        onClick={() => setCliffMonths(c.v)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: cliffMonths === c.v ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: cliffMonths === c.v ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: cliffMonths === c.v ? "600" : "normal"
                        }}
                      >
                        {c.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time at Company */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Time at Company (months)
                  </label>
                  <input
                    type="number"
                    value={monthsEmployed}
                    onChange={(e) => setMonthsEmployed(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Growth Projection */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #FCD34D"
                }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#92400E", marginBottom: "8px", fontWeight: "600" }}>
                    📈 Growth Projection (for future value)
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[{ v: "2", l: "2x" }, { v: "5", l: "5x" }, { v: "10", l: "10x" }, { v: "20", l: "20x" }].map((m) => (
                      <button
                        key={m.v}
                        onClick={() => setGrowthMultiple(m.v)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "6px",
                          border: growthMultiple === m.v ? "2px solid #D97706" : "1px solid #FCD34D",
                          backgroundColor: growthMultiple === m.v ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: growthMultiple === m.v ? "600" : "normal",
                          color: "#92400E"
                        }}
                      >
                        {m.l}
                      </button>
                    ))}
                  </div>
                </div>
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
                  📊 Your ESOP Value
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Value */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Current Vested Value</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {formatCurrency(valueResults.vestedValue)}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                    {valueResults.vestedShares.toLocaleString()} vested shares × ${valueResults.spread.toFixed(2)} spread
                  </p>
                </div>

                {/* Vesting Status */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#065F46" }}>Vested</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      {valueResults.vestedShares.toLocaleString()}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#047857" }}>
                      {valueResults.vestedPercent.toFixed(0)}% of total
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "10px",
                    padding: "16px",
                    textAlign: "center",
                    border: "1px solid #FECACA"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#991B1B" }}>Unvested</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>
                      {valueResults.unvestedShares.toLocaleString()}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#B91C1C" }}>
                      Lost if you leave
                    </p>
                  </div>
                </div>

                {/* Value Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    💵 Value Breakdown
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Total Options</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{valueResults.options.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Exercise Cost (all shares)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(valueResults.exerciseCost)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Spread per Share</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>${valueResults.spread.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                      <span style={{ color: "#065F46", fontWeight: "600" }}>Total Potential Profit</span>
                      <span style={{ fontWeight: "bold", color: "#059669" }}>{formatCurrency(valueResults.totalProfit)}</span>
                    </div>
                  </div>
                </div>

                {/* Future Value */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #FCD34D"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#92400E", fontWeight: "600" }}>
                    📈 If Company Grows {growthMultiple}x
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>Future Share Price</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#D97706" }}>
                        ${valueResults.futurePrice.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>Future Value (all vested)</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>
                        {formatCurrency(valueResults.futureValue)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Vesting Schedule */}
        {activeTab === "vesting" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📅 Vesting Settings
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Options Granted
                  </label>
                  <input
                    type="number"
                    value={vestingOptions}
                    onChange={(e) => setVestingOptions(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #4F46E5",
                      fontSize: "1rem",
                      backgroundColor: "#EEF2FF",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vesting Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["3", "4", "5", "6"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setVestingPeriod(y)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: vestingPeriod === y ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: vestingPeriod === y ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: vestingPeriod === y ? "600" : "normal"
                        }}
                      >
                        {y} Years
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Cliff Period
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[{ v: "0", l: "No Cliff" }, { v: "6", l: "6 Months" }, { v: "12", l: "1 Year" }, { v: "24", l: "2 Years" }].map((c) => (
                      <button
                        key={c.v}
                        onClick={() => setVestingCliff(c.v)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: vestingCliff === c.v ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: vestingCliff === c.v ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: vestingCliff === c.v ? "600" : "normal"
                        }}
                      >
                        {c.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vesting Frequency (after cliff)
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[{ v: "monthly", l: "Monthly" }, { v: "quarterly", l: "Quarterly" }, { v: "annually", l: "Annually" }].map((f) => (
                      <button
                        key={f.v}
                        onClick={() => setVestingFrequency(f.v as typeof vestingFrequency)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: vestingFrequency === f.v ? "2px solid #4F46E5" : "1px solid #E5E7EB",
                          backgroundColor: vestingFrequency === f.v ? "#EEF2FF" : "white",
                          cursor: "pointer",
                          fontWeight: vestingFrequency === f.v ? "600" : "normal"
                        }}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Grant Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Tip Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Most startups use 4-year vesting with 1-year cliff and monthly vesting. This is industry standard.
                  </p>
                </div>
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
                  📊 Vesting Timeline
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Visual Timeline */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Vesting Progress by Year
                  </h3>
                  {[1, 2, 3, 4].slice(0, parseInt(vestingPeriod)).map((year) => {
                    const endOfYearMonth = year * 12;
                    const yearData = vestingSchedule.find(s => s.month === endOfYearMonth);
                    const percent = yearData?.percent || 0;
                    const cliff = parseInt(vestingCliff);
                    const isBeforeCliff = endOfYearMonth <= cliff && cliff > 0;
                    
                    return (
                      <div key={year} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                            Year {year} {isBeforeCliff && year === 1 && cliff >= 12 ? "(Cliff)" : ""}
                          </span>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#059669" }}>
                            {percent.toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ backgroundColor: "#E5E7EB", borderRadius: "4px", height: "24px", overflow: "hidden" }}>
                          <div style={{
                            width: `${percent}%`,
                            height: "100%",
                            backgroundColor: isBeforeCliff && percent === 0 ? "#F3F4F6" : "#059669",
                            borderRadius: "4px",
                            transition: "width 0.3s"
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Key Milestones */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    🎯 Key Milestones
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {parseInt(vestingCliff) > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                        <span style={{ color: "#92400E" }}>🔒 Cliff ({vestingCliff} months)</span>
                        <span style={{ fontWeight: "600", color: "#D97706" }}>
                          {vestingSchedule.find(s => s.month === parseInt(vestingCliff))?.totalVested.toLocaleString() || 0} shares ({((parseInt(vestingCliff) / (parseInt(vestingPeriod) * 12)) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                      <span style={{ color: "#065F46" }}>✅ Fully Vested ({vestingPeriod} years)</span>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        {parseInt(vestingOptions).toLocaleString()} shares (100%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Detailed Schedule Table */}
                <div>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Quarterly Summary
                  </h3>
                  <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #E5E7EB", borderRadius: "8px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead style={{ backgroundColor: "#F9FAFB", position: "sticky", top: 0 }}>
                        <tr>
                          <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #E5E7EB" }}>Month</th>
                          <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB" }}>Vested</th>
                          <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB" }}>Total</th>
                          <th style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB" }}>%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vestingSchedule.filter((_, i) => (i + 1) % 3 === 0 || vestingSchedule[i]?.isCliff).map((row, index) => (
                          <tr key={index} style={{ backgroundColor: row.isCliff ? "#FEF3C7" : "white" }}>
                            <td style={{ padding: "10px", borderBottom: "1px solid #E5E7EB" }}>
                              {row.isCliff ? `${row.month} (Cliff)` : row.month}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB" }}>
                              +{row.vestedThisPeriod.toLocaleString()}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>
                              {row.totalVested.toLocaleString()}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #E5E7EB", color: "#059669" }}>
                              {row.percent.toFixed(0)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Compare Offers */}
        {activeTab === "compare" && (
          <div style={{ marginBottom: "24px" }}>
            {/* Input Section */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#4F46E5", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚖️ Compare Two Job Offers
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  {/* Offer A */}
                  <div style={{ backgroundColor: "#EEF2FF", borderRadius: "12px", padding: "20px", border: "1px solid #C7D2FE" }}>
                    <h3 style={{ margin: "0 0 16px 0", color: "#4338CA", fontWeight: "600" }}>Offer A</h3>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Company Name</label>
                      <input type="text" value={offerA.name} onChange={(e) => setOfferA({...offerA, name: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Base Salary (annual)</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input type="number" value={offerA.salary} onChange={(e) => setOfferA({...offerA, salary: e.target.value})}
                          style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Number of Options</label>
                      <input type="number" value={offerA.options} onChange={(e) => setOfferA({...offerA, options: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Strike Price</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input type="number" step="0.01" value={offerA.strike} onChange={(e) => setOfferA({...offerA, strike: e.target.value})}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Current FMV</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input type="number" step="0.01" value={offerA.fmv} onChange={(e) => setOfferA({...offerA, fmv: e.target.value})}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Total Shares Outstanding</label>
                      <input type="number" value={offerA.totalShares} onChange={(e) => setOfferA({...offerA, totalShares: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #C7D2FE", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                  </div>

                  {/* Offer B */}
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "12px", padding: "20px", border: "1px solid #6EE7B7" }}>
                    <h3 style={{ margin: "0 0 16px 0", color: "#047857", fontWeight: "600" }}>Offer B</h3>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Company Name</label>
                      <input type="text" value={offerB.name} onChange={(e) => setOfferB({...offerB, name: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Base Salary (annual)</label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input type="number" value={offerB.salary} onChange={(e) => setOfferB({...offerB, salary: e.target.value})}
                          style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Number of Options</label>
                      <input type="number" value={offerB.options} onChange={(e) => setOfferB({...offerB, options: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Strike Price</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input type="number" step="0.01" value={offerB.strike} onChange={(e) => setOfferB({...offerB, strike: e.target.value})}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Current FMV</label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                          <input type="number" step="0.01" value={offerB.fmv} onChange={(e) => setOfferB({...offerB, fmv: e.target.value})}
                            style={{ width: "100%", padding: "10px 10px 10px 24px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#4B5563", marginBottom: "4px" }}>Total Shares Outstanding</label>
                      <input type="number" value={offerB.totalShares} onChange={(e) => setOfferB({...offerB, totalShares: e.target.value})}
                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #6EE7B7", fontSize: "0.9rem", boxSizing: "border-box" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Comparison Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Comparison Table */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB" }}>Metric</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #E5E7EB", backgroundColor: "#EEF2FF", color: "#4338CA" }}>{offerA.name}</th>
                        <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #E5E7EB", backgroundColor: "#ECFDF5", color: "#047857" }}>{offerB.name}</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB" }}>Winner</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>Base Salary</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.a.salary)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.b.salary)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600",
                            backgroundColor: compareResults.a.salary > compareResults.b.salary ? "#EEF2FF" : "#ECFDF5",
                            color: compareResults.a.salary > compareResults.b.salary ? "#4338CA" : "#047857"
                          }}>
                            {compareResults.a.salary > compareResults.b.salary ? "A" : compareResults.a.salary < compareResults.b.salary ? "B" : "Tie"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>Ownership %</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{compareResults.a.ownership.toFixed(4)}%</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{compareResults.b.ownership.toFixed(4)}%</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600",
                            backgroundColor: compareResults.a.ownership > compareResults.b.ownership ? "#EEF2FF" : "#ECFDF5",
                            color: compareResults.a.ownership > compareResults.b.ownership ? "#4338CA" : "#047857"
                          }}>
                            {compareResults.a.ownership > compareResults.b.ownership ? "A" : "B"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>Current Option Value</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.a.currentValue)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.b.currentValue)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600",
                            backgroundColor: compareResults.a.currentValue > compareResults.b.currentValue ? "#EEF2FF" : "#ECFDF5",
                            color: compareResults.a.currentValue > compareResults.b.currentValue ? "#4338CA" : "#047857"
                          }}>
                            {compareResults.a.currentValue > compareResults.b.currentValue ? "A" : "B"}
                          </span>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#FEF3C7" }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>📈 If 5x Growth</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.a.value5x)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.b.value5x)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600",
                            backgroundColor: compareResults.a.value5x > compareResults.b.value5x ? "#EEF2FF" : "#ECFDF5",
                            color: compareResults.a.value5x > compareResults.b.value5x ? "#4338CA" : "#047857"
                          }}>
                            {compareResults.a.value5x > compareResults.b.value5x ? "A" : "B"}
                          </span>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#FEF3C7" }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>🚀 If 10x Growth</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.a.value10x)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{formatCurrency(compareResults.b.value10x)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600",
                            backgroundColor: compareResults.a.value10x > compareResults.b.value10x ? "#EEF2FF" : "#ECFDF5",
                            color: compareResults.a.value10x > compareResults.b.value10x ? "#4338CA" : "#047857"
                          }}>
                            {compareResults.a.value10x > compareResults.b.value10x ? "A" : "B"}
                          </span>
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: "#ECFDF5" }}>
                        <td style={{ padding: "12px 16px", fontWeight: "bold" }}>4-Year Total Comp (current)</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "bold", fontSize: "1.1rem" }}>{formatCurrency(compareResults.a.totalComp)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: "bold", fontSize: "1.1rem" }}>{formatCurrency(compareResults.b.totalComp)}</td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{ padding: "4px 12px", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "bold",
                            backgroundColor: compareResults.a.totalComp > compareResults.b.totalComp ? "#4338CA" : "#047857",
                            color: "white"
                          }}>
                            {compareResults.a.totalComp > compareResults.b.totalComp ? "A" : "B"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary Box */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "20px",
                  marginTop: "20px"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151", fontWeight: "600" }}>
                    🎯 Quick Analysis
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#4B5563" }}>
                        <strong>Higher guaranteed income:</strong>{" "}
                        <span style={{ color: compareResults.a.salary > compareResults.b.salary ? "#4338CA" : "#047857", fontWeight: "600" }}>
                          {compareResults.a.salary > compareResults.b.salary ? offerA.name : offerB.name}
                        </span>
                        {" "}(+{formatCurrency(Math.abs(compareResults.a.salary - compareResults.b.salary))}/year)
                      </p>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                        <strong>More ownership:</strong>{" "}
                        <span style={{ color: compareResults.a.ownership > compareResults.b.ownership ? "#4338CA" : "#047857", fontWeight: "600" }}>
                          {compareResults.a.ownership > compareResults.b.ownership ? offerA.name : offerB.name}
                        </span>
                        {" "}({(Math.max(compareResults.a.ownership, compareResults.b.ownership) / Math.min(compareResults.a.ownership, compareResults.b.ownership)).toFixed(0)}x more)
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#4B5563" }}>
                        <strong>Better if company succeeds (10x):</strong>{" "}
                        <span style={{ color: compareResults.a.total10x > compareResults.b.total10x ? "#4338CA" : "#047857", fontWeight: "600" }}>
                          {compareResults.a.total10x > compareResults.b.total10x ? offerA.name : offerB.name}
                        </span>
                      </p>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#4B5563" }}>
                        <strong>Lower risk:</strong>{" "}
                        <span style={{ color: compareResults.a.salary > compareResults.b.salary ? "#4338CA" : "#047857", fontWeight: "600" }}>
                          {compareResults.a.salary > compareResults.b.salary ? offerA.name : offerB.name}
                        </span>
                        {" "}(higher base salary)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 Complete Guide to Employee Stock Options</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Employee Stock Option Plans (ESOPs) are a powerful form of compensation that give employees 
                  the opportunity to own a piece of the company they work for. Understanding how to calculate 
                  and evaluate your stock options is crucial for making informed career and financial decisions.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Understanding ESOP Value</h3>
                <p>
                  Your ESOP value depends on several factors: the <strong>number of options</strong> granted, 
                  the <strong>strike price</strong> (what you pay to exercise), and the <strong>fair market value</strong> (FMV) 
                  of the stock. The &quot;spread&quot; between FMV and strike price represents your potential profit per share.
                </p>

                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #C7D2FE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#4338CA" }}>📊 Key Formula</p>
                  <p style={{ margin: 0, color: "#6366F1", fontFamily: "monospace", fontSize: "0.95rem" }}>
                    ESOP Value = Number of Vested Options × (Current FMV - Strike Price)<br />
                    Example: 5,000 × ($10 - $2) = $40,000 potential profit
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Vesting Schedules Explained</h3>
                <p>
                  Most companies use a <strong>4-year vesting schedule with a 1-year cliff</strong>. This means 
                  you receive no options until completing one year, then 25% vests at the cliff, followed by 
                  monthly vesting of the remaining 75% over the next three years. This structure incentivizes 
                  long-term commitment.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tax Considerations</h3>
                <p>
                  ESOP taxation varies by option type and jurisdiction. In the US, Incentive Stock Options (ISOs) 
                  may qualify for favorable capital gains treatment if held long enough, while Non-Qualified Stock 
                  Options (NSOs) are taxed as ordinary income at exercise. Always consult a tax professional 
                  for personalized advice.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4338CA", marginBottom: "16px" }}>📋 ESOP Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#6366F1", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Standard Vesting:</strong> 4 years</p>
                <p style={{ margin: 0 }}><strong>Typical Cliff:</strong> 1 year</p>
                <p style={{ margin: 0 }}><strong>Exercise Window:</strong> 90 days post-exit</p>
                <p style={{ margin: 0 }}><strong>ISO Limit:</strong> $100K/year</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Know your 409A valuation date</p>
                <p style={{ margin: "0 0 8px 0" }}>• Ask about post-termination exercise window</p>
                <p style={{ margin: "0 0 8px 0" }}>• Consider early exercise for tax benefits</p>
                <p style={{ margin: 0 }}>• Negotiate for more options, not shorter vesting</p>
              </div>
            </div>

            {/* Glossary */}
            <div style={{ backgroundColor: "#F9FAFB", borderRadius: "16px", padding: "24px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#374151", marginBottom: "12px" }}>📖 Glossary</h3>
              <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>FMV:</strong> Fair Market Value</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Strike:</strong> Exercise price</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Cliff:</strong> Min time before vesting</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>ISO:</strong> Incentive Stock Option</p>
                <p style={{ margin: 0 }}><strong>NSO:</strong> Non-Qualified Stock Option</p>
              </div>
            </div>

            <RelatedTools currentUrl="/esop-calculator" currentCategory="Finance" />
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
            💰 <strong>Disclaimer:</strong> This calculator provides estimates for informational purposes only. 
            Actual values depend on company-specific terms, market conditions, and tax laws. Stock options 
            involve risk and are not guaranteed to have value. Consult with a financial advisor or tax 
            professional before making decisions about your equity compensation.
          </p>
        </div>
      </div>
    </div>
  );
}
