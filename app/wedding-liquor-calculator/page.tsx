"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 酒吧类型配置
const barTypes: Record<string, { 
  label: string; 
  beer: number; 
  wine: number; 
  liquor: number;
  desc: string;
}> = {
  "full": { label: "Full Bar", beer: 40, wine: 30, liquor: 30, desc: "Beer, wine, and spirits" },
  "beerWine": { label: "Beer & Wine Only", beer: 60, wine: 40, liquor: 0, desc: "No hard liquor" },
  "wineSpirits": { label: "Wine & Spirits", beer: 0, wine: 50, liquor: 50, desc: "No beer" }
};

// 饮酒习惯
const drinkingLevels: Record<string, { label: string; multiplier: number; desc: string }> = {
  "light": { label: "Light", multiplier: 0.75, desc: "Mostly light drinkers" },
  "average": { label: "Average", multiplier: 1.0, desc: "Mixed crowd" },
  "heavy": { label: "Heavy", multiplier: 1.5, desc: "Party crowd" }
};

// 每瓶容量
const bottleServings = {
  beer: 1,        // 1 bottle = 1 serving
  wine: 5,        // 750ml = 5 glasses (5oz each)
  liquor: 16,     // 750ml = 16 drinks (1.5oz each)
  champagne: 6    // 750ml = 6 glasses (4oz toast)
};

// 每箱数量
const bottlesPerCase = {
  beer: 24,
  wine: 12,
  liquor: 12,
  champagne: 12
};

// 价格范围（每瓶）
const priceRanges = {
  beer: { min: 1.5, max: 3 },
  wine: { min: 8, max: 15 },
  liquor: { min: 20, max: 35 },
  champagne: { min: 12, max: 25 }
};

// FAQ数据
const faqs = [
  {
    question: "How to calculate how much liquor for a wedding?",
    answer: "Use the 2-1 rule: plan for 2 drinks per person for the first hour, then 1 drink per person for each additional hour. For a 5-hour reception with 100 guests, that's 600 drinks total. If serving a full bar (30% liquor), you'd need about 180 liquor drinks, which equals roughly 11-12 bottles of spirits (750ml each, 16 drinks per bottle)."
  },
  {
    question: "How much does alcohol cost for a wedding of 100 guests?",
    answer: "For a 5-hour reception with 100 guests, expect to spend $1,500-$4,500 on alcohol if you're buying it yourself (DIY bar). This breaks down to $15-$45 per person. Beer and wine only options cost less ($1,000-$2,500), while full bars with premium spirits cost more. Buying from wholesale stores like Costco can reduce costs by 20-30%."
  },
  {
    question: "How many bottles of liquor for a 100 people wedding?",
    answer: "For 100 guests at a 5-hour reception with a full bar (30% liquor consumption), you'll need approximately 10-12 bottles of liquor (750ml). A good mix includes: 3 bottles vodka, 2 bottles whiskey/bourbon, 2 bottles rum, 2 bottles tequila, and 2-3 bottles of other spirits (gin, etc.). Always buy 10-15% extra."
  },
  {
    question: "What is the 3-2-1 rule for alcohol?",
    answer: "The 3-2-1 rule is a helpful guideline for wedding bar planning: 3 types of alcohol (beer, wine, spirits), 2 drinks per person during the first hour, and 1 drink per person for each subsequent hour. This formula helps ensure you have enough variety and quantity without over-buying."
  },
  {
    question: "Should I have a champagne toast at my wedding?",
    answer: "A champagne toast is traditional but optional. If you include one, plan for 1 glass per guest (about 4oz pour). A 750ml bottle yields 6 toast-sized pours. For 100 guests, you'll need about 17 bottles of champagne or sparkling wine. Many couples skip the formal toast to save money, letting guests toast with whatever they're drinking."
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function WeddingLiquorCalculator() {
  // 输入状态
  const [guests, setGuests] = useState<string>("100");
  const [duration, setDuration] = useState<string>("5");
  const [barType, setBarType] = useState<string>("full");
  const [champagneToast, setChampagneToast] = useState<boolean>(true);
  const [drinkingLevel, setDrinkingLevel] = useState<string>("average");
  const [showCost, setShowCost] = useState<boolean>(true);
  
  // 结果
  const [results, setResults] = useState<{
    totalDrinks: number;
    beerDrinks: number;
    wineDrinks: number;
    liquorDrinks: number;
    champagneDrinks: number;
    beerBottles: number;
    wineBottles: number;
    liquorBottles: number;
    champagneBottles: number;
    beerCases: number;
    wineCases: number;
    champagneCases: number;
    costLow: number;
    costHigh: number;
    perPersonLow: number;
    perPersonHigh: number;
  } | null>(null);

  // 计算
  const calculate = () => {
    const guestCount = parseInt(guests) || 0;
    const hours = parseInt(duration) || 0;
    
    if (guestCount <= 0 || hours <= 0) {
      alert("Please enter valid guest count and duration");
      return;
    }

    // 计算总杯数：第一小时2杯 + 之后每小时1杯
    const drinksPerPerson = 2 + (hours - 1) * 1;
    const levelMultiplier = drinkingLevels[drinkingLevel]?.multiplier || 1;
    const totalDrinks = Math.ceil(guestCount * drinksPerPerson * levelMultiplier);

    // 获取酒水比例
    const bar = barTypes[barType];
    const beerPercent = bar.beer / 100;
    const winePercent = bar.wine / 100;
    const liquorPercent = bar.liquor / 100;

    // 计算各类酒杯数
    const beerDrinks = Math.ceil(totalDrinks * beerPercent);
    const wineDrinks = Math.ceil(totalDrinks * winePercent);
    const liquorDrinks = Math.ceil(totalDrinks * liquorPercent);
    
    // 香槟祝酒（如果有）
    const champagneDrinks = champagneToast ? guestCount : 0;

    // 计算瓶数（+10%余量）
    const buffer = 1.1;
    const beerBottles = Math.ceil(beerDrinks / bottleServings.beer * buffer);
    const wineBottles = Math.ceil(wineDrinks / bottleServings.wine * buffer);
    const liquorBottles = Math.ceil(liquorDrinks / bottleServings.liquor * buffer);
    const champagneBottles = Math.ceil(champagneDrinks / bottleServings.champagne * buffer);

    // 计算箱数
    const beerCases = Math.ceil(beerBottles / bottlesPerCase.beer);
    const wineCases = Math.ceil(wineBottles / bottlesPerCase.wine);
    const champagneCases = Math.ceil(champagneBottles / bottlesPerCase.champagne);

    // 计算费用
    const beerCostLow = beerBottles * priceRanges.beer.min;
    const beerCostHigh = beerBottles * priceRanges.beer.max;
    const wineCostLow = wineBottles * priceRanges.wine.min;
    const wineCostHigh = wineBottles * priceRanges.wine.max;
    const liquorCostLow = liquorBottles * priceRanges.liquor.min;
    const liquorCostHigh = liquorBottles * priceRanges.liquor.max;
    const champagneCostLow = champagneBottles * priceRanges.champagne.min;
    const champagneCostHigh = champagneBottles * priceRanges.champagne.max;

    const costLow = Math.round(beerCostLow + wineCostLow + liquorCostLow + champagneCostLow);
    const costHigh = Math.round(beerCostHigh + wineCostHigh + liquorCostHigh + champagneCostHigh);

    setResults({
      totalDrinks,
      beerDrinks,
      wineDrinks,
      liquorDrinks,
      champagneDrinks,
      beerBottles,
      wineBottles,
      liquorBottles,
      champagneBottles,
      beerCases,
      wineCases,
      champagneCases,
      costLow,
      costHigh,
      perPersonLow: Math.round(costLow / guestCount * 100) / 100,
      perPersonHigh: Math.round(costHigh / guestCount * 100) / 100
    });
  };

  // 重置
  const reset = () => {
    setGuests("100");
    setDuration("5");
    setBarType("full");
    setChampagneToast(true);
    setDrinkingLevel("average");
    setShowCost(true);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Wedding Liquor Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Wedding Liquor Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate exactly how much beer, wine, champagne, and liquor you need for your wedding. Get a complete shopping list with bottles, cases, and cost estimates.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Event Details
              </h2>

              {/* Guest Count */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  👥 Number of Guests (drinking age)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                    min="10"
                    max="500"
                  />
                  <span style={{ color: "#6B7280" }}>guests</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {[50, 75, 100, 150, 200].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGuests(g.toString())}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: guests === g.toString() ? "#FEF3C7" : "#F9FAFB",
                        color: guests === g.toString() ? "#92400E" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ⏱️ Event Duration (hours)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: "80px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                    min="1"
                    max="12"
                  />
                  <span style={{ color: "#6B7280" }}>hours</span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[3, 4, 5, 6].map((h) => (
                    <button
                      key={h}
                      onClick={() => setDuration(h.toString())}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: duration === h.toString() ? "#FEF3C7" : "#F9FAFB",
                        color: duration === h.toString() ? "#92400E" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {h} hrs
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🍺 Bar Type
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(barTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setBarType(key)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: barType === key ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: barType === key ? "#F5F3FF" : "white",
                        color: barType === key ? "#7C3AED" : "#4B5563",
                        fontWeight: barType === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>{data.label}</span>
                        <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>
                          {data.beer > 0 && `🍺${data.beer}%`} {data.wine > 0 && `🍷${data.wine}%`} {data.liquor > 0 && `🥃${data.liquor}%`}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>{data.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Champagne Toast */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🥂 Champagne Toast?
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setChampagneToast(true)}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: champagneToast ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                      backgroundColor: champagneToast ? "#FEF3C7" : "white",
                      color: champagneToast ? "#92400E" : "#4B5563",
                      fontWeight: champagneToast ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🥂 Yes
                  </button>
                  <button
                    onClick={() => setChampagneToast(false)}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: !champagneToast ? "2px solid #6B7280" : "1px solid #E5E7EB",
                      backgroundColor: !champagneToast ? "#F3F4F6" : "white",
                      color: !champagneToast ? "#374151" : "#4B5563",
                      fontWeight: !champagneToast ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    No Toast
                  </button>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "6px" }}>
                  ℹ️ Separate from main bar drinks, for toasts only
                </p>
              </div>

              {/* Drinking Level */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🍹 Guest Drinking Level
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Object.entries(drinkingLevels).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setDrinkingLevel(key)}
                      style={{
                        flex: "1",
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: drinkingLevel === key ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: drinkingLevel === key ? "#ECFDF5" : "white",
                        color: drinkingLevel === key ? "#059669" : "#4B5563",
                        fontWeight: drinkingLevel === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        textAlign: "center"
                      }}
                    >
                      <div>{data.label}</div>
                      <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginTop: "2px" }}>
                        {data.multiplier === 1 ? "Standard" : `${data.multiplier}x`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Cost Toggle */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={showCost}
                    onChange={(e) => setShowCost(e.target.checked)}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#374151" }}>💰 Show cost estimate (DIY bar)</span>
                </label>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#7C3AED",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🍾 Calculate
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Total Drinks */}
              <div style={{ 
                background: results 
                  ? "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: results ? "#7C3AED" : "#6B7280",
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  🍻 Total Drinks Needed
                </p>
                <p style={{ 
                  fontSize: "3rem", 
                  fontWeight: "bold", 
                  color: results ? "#5B21B6" : "#9CA3AF",
                  lineHeight: "1" 
                }}>
                  {results ? results.totalDrinks.toLocaleString() : "—"}
                </p>
                <p style={{ 
                  color: results ? "#7C3AED" : "#6B7280",
                  marginTop: "8px", 
                  fontSize: "0.875rem"
                }}>
                  {results ? `for ${guests} guests, ${duration} hours` : "Enter details to calculate"}
                </p>
              </div>

              {/* Shopping List */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📋 Shopping List (+10% buffer)
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {results.beerBottles > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <div>
                          <span style={{ fontSize: "1.25rem", marginRight: "8px" }}>🍺</span>
                          <span style={{ color: "#374151", fontWeight: "500" }}>Beer</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{results.beerBottles} bottles</span>
                          <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "8px" }}>({results.beerCases} cases)</span>
                        </div>
                      </div>
                    )}
                    {results.wineBottles > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <div>
                          <span style={{ fontSize: "1.25rem", marginRight: "8px" }}>🍷</span>
                          <span style={{ color: "#374151", fontWeight: "500" }}>Wine</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{results.wineBottles} bottles</span>
                          <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "8px" }}>({results.wineCases} cases)</span>
                        </div>
                      </div>
                    )}
                    {results.liquorBottles > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <div>
                          <span style={{ fontSize: "1.25rem", marginRight: "8px" }}>🥃</span>
                          <span style={{ color: "#374151", fontWeight: "500" }}>Liquor</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{results.liquorBottles} bottles</span>
                          <span style={{ fontSize: "0.75rem", color: "#6B7280", marginLeft: "8px" }}>(750ml)</span>
                        </div>
                      </div>
                    )}
                    {results.champagneBottles > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                        <div>
                          <span style={{ fontSize: "1.25rem", marginRight: "8px" }}>🥂</span>
                          <span style={{ color: "#92400E", fontWeight: "500" }}>Champagne (toast)</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontWeight: "600", color: "#92400E" }}>{results.champagneBottles} bottles</span>
                          <span style={{ fontSize: "0.75rem", color: "#B45309", marginLeft: "8px" }}>({results.champagneCases} cases)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cost Estimate */}
              {results && showCost && (
                <div style={{ 
                  backgroundColor: "#ECFDF5", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#065F46", textTransform: "uppercase", marginBottom: "12px" }}>
                    💰 Estimated Cost (DIY Bar)
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${results.costLow.toLocaleString()} - ${results.costHigh.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <span style={{ color: "#6B7280" }}>Per person</span>
                    <span style={{ fontWeight: "600", color: "#059669" }}>${results.perPersonLow} - ${results.perPersonHigh}</span>
                  </div>
                  <p style={{ fontSize: "0.7rem", color: "#065F46", marginTop: "8px", fontStyle: "italic" }}>
                    💡 Buy from Costco/Total Wine to save 20-30%
                  </p>
                </div>
              )}

              {/* Drink Breakdown */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    🍹 Drink Breakdown
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {results.beerDrinks > 0 && (
                      <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#D97706" }}>{results.beerDrinks}</p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>🍺 Beers</p>
                      </div>
                    )}
                    {results.wineDrinks > 0 && (
                      <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#7C3AED" }}>{results.wineDrinks}</p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>🍷 Wine glasses</p>
                      </div>
                    )}
                    {results.liquorDrinks > 0 && (
                      <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#DC2626" }}>{results.liquorDrinks}</p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>🥃 Cocktails</p>
                      </div>
                    )}
                    {results.champagneDrinks > 0 && (
                      <div style={{ padding: "10px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#F59E0B" }}>{results.champagneDrinks}</p>
                        <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>🥂 Toasts</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              {!results && (
                <div style={{ 
                  backgroundColor: "#FEF3C7", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#92400E", marginBottom: "12px" }}>
                    📊 Quick Reference (5-hour reception)
                  </p>
                  <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>50 guests</span>
                      <span style={{ fontWeight: "600" }}>~300 drinks</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>100 guests</span>
                      <span style={{ fontWeight: "600" }}>~600 drinks</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>150 guests</span>
                      <span style={{ fontWeight: "600" }}>~900 drinks</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>200 guests</span>
                      <span style={{ fontWeight: "600" }}>~1,200 drinks</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How to Calculate */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How to Calculate Wedding Alcohol
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The industry standard for estimating alcohol at weddings is the <strong>"2-1 Rule"</strong>: guests typically consume 2 drinks during the first hour (cocktail hour), then 1 drink per hour after that.
              </p>
              
              <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "8px", marginBottom: "16px", fontFamily: "monospace", fontSize: "0.875rem", color: "#5B21B6" }}>
                Total Drinks = Guests × (2 + (Hours - 1) × 1)
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#D97706" }}>2</p>
                  <p style={{ fontSize: "0.75rem", color: "#92400E" }}>drinks/person<br/>first hour</p>
                </div>
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>1</p>
                  <p style={{ fontSize: "0.75rem", color: "#065F46" }}>drink/person<br/>each hour after</p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563EB" }}>+10%</p>
                  <p style={{ fontSize: "0.75rem", color: "#1E40AF" }}>buffer<br/>recommended</p>
                </div>
              </div>
            </div>

            {/* The 3-2-1 Rule */}
            <div style={{ 
              backgroundColor: "#F5F3FF", 
              borderRadius: "16px", 
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                🍾 The 3-2-1 Rule for Wedding Alcohol
              </h2>
              <p style={{ color: "#6D28D9", marginBottom: "16px", lineHeight: "1.7" }}>
                An easy-to-remember guideline for planning your wedding bar:
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>3</p>
                  <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "4px" }}>Types</p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Beer, Wine, Spirits</p>
                </div>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>2</p>
                  <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "4px" }}>Drinks</p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Per person, 1st hour</p>
                </div>
                <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>1</p>
                  <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "4px" }}>Drink</p>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Per person, per hour</p>
                </div>
              </div>
            </div>

            {/* Alcohol for 100 Guests */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How Much Alcohol for 100 Guests (5 Hours)
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Drinks</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Bottles</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "🍺 Beer", drinks: "240", bottles: "240", cases: "10 (24-pack)" },
                      { type: "🍷 Wine", drinks: "180", bottles: "36", cases: "3" },
                      { type: "🥃 Liquor", drinks: "180", bottles: "12", cases: "1" },
                      { type: "🥂 Champagne (toast)", drinks: "100", bottles: "17", cases: "2" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.type}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.drinks}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#7C3AED" }}>{row.bottles}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.cases}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "8px" }}>
                * Based on full bar (40% beer, 30% wine, 30% liquor) with average drinkers
              </p>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Tips to Save */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Tips to Save on Wedding Alcohol
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Buy from Costco or Total Wine (20-30% cheaper)",
                  "Return unopened bottles (check store policy)",
                  "Limit to beer & wine only (skip liquor)",
                  "Offer just 1-2 signature cocktails",
                  "Ask venue about corkage fees",
                  "Buy by the case for bulk discounts"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#7C3AED", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottle Servings Reference */}
            <div style={{ 
              backgroundColor: "#FEF3C7", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                🍾 Servings Per Bottle
              </h3>
              <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                  <span>🍷 Wine (750ml)</span>
                  <span style={{ fontWeight: "600" }}>5 glasses</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                  <span>🥂 Champagne (750ml)</span>
                  <span style={{ fontWeight: "600" }}>6 toasts</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                  <span>🥃 Liquor (750ml)</span>
                  <span style={{ fontWeight: "600" }}>16 drinks</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", backgroundColor: "white", borderRadius: "6px" }}>
                  <span>🍺 Beer</span>
                  <span style={{ fontWeight: "600" }}>1 serving</span>
                </div>
              </div>
            </div>

            <RelatedTools currentUrl="/wedding-liquor-calculator" currentCategory="Lifestyle" />
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
      </div>
    </div>
  );
}
