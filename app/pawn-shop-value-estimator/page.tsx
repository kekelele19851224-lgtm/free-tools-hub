"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Item categories with pawn/sell percentages
const itemCategories = [
  { id: 'electronics', label: 'Electronics (Phones, Laptops, Tablets)', emoji: '📱', pawnMin: 20, pawnMax: 35, sellMin: 30, sellMax: 45 },
  { id: 'gaming', label: 'Gaming Consoles & Games', emoji: '🎮', pawnMin: 25, pawnMax: 35, sellMin: 35, sellMax: 45 },
  { id: 'tools', label: 'Power Tools & Equipment', emoji: '🔧', pawnMin: 25, pawnMax: 40, sellMin: 35, sellMax: 50 },
  { id: 'instruments', label: 'Musical Instruments', emoji: '🎸', pawnMin: 30, pawnMax: 45, sellMin: 40, sellMax: 55 },
  { id: 'designer', label: 'Designer Items (Bags, Watches)', emoji: '👜', pawnMin: 35, pawnMax: 50, sellMin: 45, sellMax: 60 },
  { id: 'firearms', label: 'Firearms (where legal)', emoji: '🎯', pawnMin: 40, pawnMax: 55, sellMin: 50, sellMax: 65 },
  { id: 'jewelry', label: 'Jewelry (non-gold)', emoji: '💎', pawnMin: 25, pawnMax: 40, sellMin: 35, sellMax: 50 },
  { id: 'collectibles', label: 'Collectibles & Antiques', emoji: '🏺', pawnMin: 20, pawnMax: 40, sellMin: 30, sellMax: 50 },
  { id: 'cameras', label: 'Cameras & Photography', emoji: '📷', pawnMin: 25, pawnMax: 40, sellMin: 35, sellMax: 50 },
  { id: 'appliances', label: 'Small Appliances', emoji: '🔌', pawnMin: 15, pawnMax: 30, sellMin: 25, sellMax: 40 },
  { id: 'sports', label: 'Sports & Fitness Equipment', emoji: '⚽', pawnMin: 20, pawnMax: 35, sellMin: 30, sellMax: 45 },
  { id: 'other', label: 'Other Items', emoji: '📦', pawnMin: 20, pawnMax: 35, sellMin: 30, sellMax: 45 },
];

// Condition multipliers
const conditions = [
  { id: 'new', label: 'Like New / Mint', description: 'Original packaging, barely used', multiplier: 1.15, emoji: '✨' },
  { id: 'excellent', label: 'Excellent', description: 'Minor wear, fully functional', multiplier: 1.0, emoji: '👍' },
  { id: 'good', label: 'Good', description: 'Normal wear, works well', multiplier: 0.85, emoji: '👌' },
  { id: 'fair', label: 'Fair', description: 'Visible wear, still functional', multiplier: 0.7, emoji: '🤏' },
  { id: 'poor', label: 'Poor', description: 'Heavy wear, may need repair', multiplier: 0.5, emoji: '⚠️' },
];

// Brand tier multipliers
const brandTiers = [
  { id: 'premium', label: 'Premium Brand', description: 'Apple, Rolex, Fender, DeWalt', multiplier: 1.15 },
  { id: 'standard', label: 'Standard Brand', description: 'Samsung, Seiko, Yamaha, Craftsman', multiplier: 1.0 },
  { id: 'budget', label: 'Budget Brand', description: 'Generic, off-brand, unknown', multiplier: 0.8 },
];

// Gold purity data
const goldPurities = [
  { id: '10k', label: '10K Gold', purity: 0.417, description: '41.7% pure gold' },
  { id: '14k', label: '14K Gold', purity: 0.585, description: '58.5% pure gold' },
  { id: '18k', label: '18K Gold', purity: 0.750, description: '75% pure gold' },
  { id: '22k', label: '22K Gold', purity: 0.917, description: '91.7% pure gold' },
  { id: '24k', label: '24K Gold', purity: 0.999, description: '99.9% pure gold' },
];

// Silver purity data
const silverPurities = [
  { id: 'sterling', label: 'Sterling Silver (.925)', purity: 0.925, description: '92.5% pure silver' },
  { id: 'fine', label: 'Fine Silver (.999)', purity: 0.999, description: '99.9% pure silver' },
  { id: 'coin', label: 'Coin Silver (.900)', purity: 0.900, description: '90% pure silver' },
];

// Current approximate spot prices (USD per gram) - these would ideally be updated
const spotPrices = {
  gold: 75.50, // ~$2,350/oz
  silver: 0.95, // ~$29.50/oz
  platinum: 31.50, // ~$980/oz
};

// FAQ data
const faqs = [
  {
    question: "How much will a pawn shop give you for a $1,000 item?",
    answer: "For a $1,000 item, you can typically expect a pawn loan of $250-$400 (25-40% of value) or a sell offer of $350-$550 (35-55% of value). The exact amount depends on item category, condition, brand, and local demand. Electronics and generic items pay less, while designer goods, firearms, and musical instruments often pay more."
  },
  {
    question: "How much will a pawn shop give you for a $200 item?",
    answer: "For a $200 item, expect a pawn loan of $50-$80 (25-40%) or a sell offer of $70-$110 (35-55%). Smaller value items often get lower percentage offers because the shop's fixed costs (testing, paperwork, storage) represent a larger portion of the potential profit."
  },
  {
    question: "Do pawn shops give you more if you pawn or sell?",
    answer: "Selling outright typically pays 10-20% more than a pawn loan. When you pawn, the shop takes on risk that you won't return, plus they must store your item. When you sell, they can immediately price and display it. However, pawning lets you reclaim your item by repaying the loan plus interest."
  },
  {
    question: "How do pawn shops determine value?",
    answer: "Pawn shops assess: 1) Current market/resale value (often checking eBay sold listings), 2) Item condition, 3) Brand reputation, 4) Local demand, 5) How quickly they can resell it. They aim for 38-50% profit margin, so offers are always below resale value. For jewelry, they test metal purity and weigh it to calculate melt value."
  },
  {
    question: "What items do pawn shops pay the most for?",
    answer: "Highest-paying items include: Gold jewelry (based on weight/purity), Firearms (where legal), Designer watches (Rolex, Omega), Quality musical instruments (Gibson, Fender), High-end electronics (latest iPhones, MacBooks), and Designer handbags (Louis Vuitton, Chanel). These items have strong resale markets and hold value well."
  },
  {
    question: "How do pawn shops calculate gold value?",
    answer: "Pawn shops calculate gold value by: 1) Testing purity (karat), 2) Weighing in grams, 3) Calculating melt value (weight × purity × spot price), 4) Offering 40-60% of melt value. For example, a 10g 14K gold chain: 10g × 0.585 × $75/g = $439 melt value. Offer would be $175-$265. Gemstones are valued separately at wholesale prices."
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

export default function PawnShopValueEstimator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'general' | 'gold' | 'quick'>('general');

  // General items states
  const [category, setCategory] = useState('electronics');
  const [itemValue, setItemValue] = useState(500);
  const [condition, setCondition] = useState('excellent');
  const [brandTier, setBrandTier] = useState('standard');

  // Gold & jewelry states
  const [metalType, setMetalType] = useState<'gold' | 'silver' | 'platinum'>('gold');
  const [goldPurity, setGoldPurity] = useState('14k');
  const [silverPurity, setSilverPurity] = useState('sterling');
  const [weightGrams, setWeightGrams] = useState(10);
  const [hasGemstones, setHasGemstones] = useState(false);
  const [gemstoneValue, setGemstoneValue] = useState(0);

  // Quick estimate states
  const [quickValue, setQuickValue] = useState(200);
  const [quickCondition, setQuickCondition] = useState('good');

  // Calculate general item estimate
  const calculateGeneralEstimate = () => {
    const categoryData = itemCategories.find(c => c.id === category);
    const conditionData = conditions.find(c => c.id === condition);
    const brandData = brandTiers.find(b => b.id === brandTier);

    if (!categoryData || !conditionData || !brandData) return null;

    const conditionMult = conditionData.multiplier;
    const brandMult = brandData.multiplier;

    const pawnMin = Math.round(itemValue * (categoryData.pawnMin / 100) * conditionMult * brandMult);
    const pawnMax = Math.round(itemValue * (categoryData.pawnMax / 100) * conditionMult * brandMult);
    const sellMin = Math.round(itemValue * (categoryData.sellMin / 100) * conditionMult * brandMult);
    const sellMax = Math.round(itemValue * (categoryData.sellMax / 100) * conditionMult * brandMult);

    return {
      pawnMin,
      pawnMax,
      pawnAvg: Math.round((pawnMin + pawnMax) / 2),
      sellMin,
      sellMax,
      sellAvg: Math.round((sellMin + sellMax) / 2),
      pawnPercent: `${categoryData.pawnMin}-${categoryData.pawnMax}%`,
      sellPercent: `${categoryData.sellMin}-${categoryData.sellMax}%`,
      conditionImpact: conditionMult > 1 ? `+${Math.round((conditionMult - 1) * 100)}%` : conditionMult < 1 ? `${Math.round((conditionMult - 1) * 100)}%` : '0%',
      brandImpact: brandMult > 1 ? `+${Math.round((brandMult - 1) * 100)}%` : brandMult < 1 ? `${Math.round((brandMult - 1) * 100)}%` : '0%',
    };
  };

  // Calculate gold/jewelry estimate
  const calculateGoldEstimate = () => {
    let purity = 0;
    let spotPrice = 0;
    let metalLabel = '';

    if (metalType === 'gold') {
      const purityData = goldPurities.find(p => p.id === goldPurity);
      purity = purityData?.purity || 0.585;
      spotPrice = spotPrices.gold;
      metalLabel = purityData?.label || '14K Gold';
    } else if (metalType === 'silver') {
      const purityData = silverPurities.find(p => p.id === silverPurity);
      purity = purityData?.purity || 0.925;
      spotPrice = spotPrices.silver;
      metalLabel = purityData?.label || 'Sterling Silver';
    } else {
      purity = 0.95; // Platinum typically 95%
      spotPrice = spotPrices.platinum;
      metalLabel = 'Platinum';
    }

    const metalValue = weightGrams * purity * spotPrice;
    const totalMeltValue = metalValue + (hasGemstones ? gemstoneValue * 0.3 : 0); // Gemstones at ~30% wholesale

    const pawnMin = Math.round(totalMeltValue * 0.40);
    const pawnMax = Math.round(totalMeltValue * 0.55);
    const sellMin = Math.round(totalMeltValue * 0.50);
    const sellMax = Math.round(totalMeltValue * 0.65);

    return {
      metalLabel,
      purity: (purity * 100).toFixed(1),
      spotPrice: spotPrice.toFixed(2),
      metalValue: Math.round(metalValue),
      meltValue: Math.round(totalMeltValue),
      pawnMin,
      pawnMax,
      pawnAvg: Math.round((pawnMin + pawnMax) / 2),
      sellMin,
      sellMax,
      sellAvg: Math.round((sellMin + sellMax) / 2),
    };
  };

  // Calculate quick estimate
  const calculateQuickEstimate = () => {
    const conditionData = conditions.find(c => c.id === quickCondition);
    const conditionMult = conditionData?.multiplier || 1;

    const basePawnMin = 0.25;
    const basePawnMax = 0.40;
    const baseSellMin = 0.35;
    const baseSellMax = 0.55;

    return {
      pawnMin: Math.round(quickValue * basePawnMin * conditionMult),
      pawnMax: Math.round(quickValue * basePawnMax * conditionMult),
      sellMin: Math.round(quickValue * baseSellMin * conditionMult),
      sellMax: Math.round(quickValue * baseSellMax * conditionMult),
    };
  };

  const generalEstimate = calculateGeneralEstimate();
  const goldEstimate = calculateGoldEstimate();
  const quickEstimate = calculateQuickEstimate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FEF9E7" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #F9E79F" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pawn Shop Value Estimator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🏪</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Pawn Shop Value Estimator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate how much pawn shops will offer for your items. Compare pawn loan vs. sell outright 
            offers and learn tips to get the best price.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#B7950B",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>How Much Do Pawn Shops Pay?</strong>
              </p>
              <div style={{ color: "#FEF9E7", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>Pawn Loan:</strong> 25-40% of item&apos;s resale value</p>
                <p style={{ margin: "0" }}>• <strong>Sell Outright:</strong> 35-55% of item&apos;s resale value</p>
                <p style={{ margin: "0" }}>• <strong>Gold/Jewelry:</strong> 40-60% of melt value</p>
                <p style={{ margin: "0" }}>• Selling pays 10-20% more than pawning</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'general' ? "#B7950B" : "white",
              color: activeTab === 'general' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📦 General Items
          </button>
          <button
            onClick={() => setActiveTab('gold')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'gold' ? "#B7950B" : "white",
              color: activeTab === 'gold' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💍 Gold & Jewelry
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'quick' ? "#B7950B" : "white",
              color: activeTab === 'quick' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            ⚡ Quick Estimate
          </button>
        </div>

        {/* General Items Tab */}
        {activeTab === 'general' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B7950B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 General Item Estimator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Category */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📋 Item Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {itemCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Value */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💵 Item Value (Current Market/Retail Price)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={itemValue}
                      onChange={(e) => setItemValue(Number(e.target.value))}
                      min={10}
                      max={100000}
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    What you paid or what it sells for new/used online
                  </p>
                </div>

                {/* Condition */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    ✨ Item Condition
                  </label>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {conditions.map((cond) => (
                      <button
                        key={cond.id}
                        onClick={() => setCondition(cond.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: condition === cond.id ? "2px solid #B7950B" : "1px solid #E5E7EB",
                          backgroundColor: condition === cond.id ? "#FEF9E7" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px"
                        }}
                      >
                        <span style={{ fontSize: "1.2rem" }}>{cond.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: condition === cond.id ? "600" : "500",
                            color: condition === cond.id ? "#B7950B" : "#374151",
                            fontSize: "0.9rem"
                          }}>
                            {cond.label}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            {cond.description}
                          </div>
                        </div>
                        <div style={{ 
                          fontSize: "0.8rem", 
                          fontWeight: "600",
                          color: cond.multiplier > 1 ? "#059669" : cond.multiplier < 1 ? "#DC2626" : "#6B7280"
                        }}>
                          {cond.multiplier > 1 ? '+' : ''}{Math.round((cond.multiplier - 1) * 100)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Tier */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🏷️ Brand Tier
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {brandTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setBrandTier(tier.id)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: brandTier === tier.id ? "2px solid #B7950B" : "1px solid #E5E7EB",
                          backgroundColor: brandTier === tier.id ? "#FEF9E7" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: brandTier === tier.id ? "600" : "500",
                          color: brandTier === tier.id ? "#B7950B" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {tier.label}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "4px" }}>
                          {tier.description}
                        </div>
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
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9A7D0A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Your Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {generalEstimate && (
                  <>
                    {/* Pawn Loan Offer */}
                    <div style={{ 
                      backgroundColor: "#EBF5FB", 
                      borderRadius: "12px", 
                      padding: "20px",
                      marginBottom: "16px",
                      border: "1px solid #85C1E9"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>🏦</span>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#1A5276" }}>PAWN LOAN</h3>
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2874A6" }}>
                        ${generalEstimate.pawnMin.toLocaleString()} - ${generalEstimate.pawnMax.toLocaleString()}
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#5DADE2", margin: "8px 0 0 0" }}>
                        Get your item back when you repay loan + interest
                      </p>
                    </div>

                    {/* Sell Outright Offer */}
                    <div style={{ 
                      backgroundColor: "#E8F8F5", 
                      borderRadius: "12px", 
                      padding: "20px",
                      marginBottom: "20px",
                      border: "1px solid #76D7C4"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "1.2rem" }}>💵</span>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#0E6655" }}>SELL OUTRIGHT</h3>
                      </div>
                      <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#148F77" }}>
                        ${generalEstimate.sellMin.toLocaleString()} - ${generalEstimate.sellMax.toLocaleString()}
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#45B39D", margin: "8px 0 0 0" }}>
                        Permanent sale, no further obligations
                      </p>
                    </div>

                    {/* Factors */}
                    <div style={{ 
                      backgroundColor: "#F9FAFB", 
                      borderRadius: "12px", 
                      padding: "16px",
                      marginBottom: "16px"
                    }}>
                      <h4 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                        Factors Affecting Your Offer
                      </h4>
                      <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                        <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                          <span>📋 Category Rate:</span>
                          <span style={{ fontWeight: "600" }}>Pawn {generalEstimate.pawnPercent} / Sell {generalEstimate.sellPercent}</span>
                        </p>
                        <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                          <span>✨ Condition:</span>
                          <span style={{ fontWeight: "600", color: generalEstimate.conditionImpact.startsWith('+') ? "#059669" : generalEstimate.conditionImpact.startsWith('-') ? "#DC2626" : "#6B7280" }}>
                            {generalEstimate.conditionImpact}
                          </span>
                        </p>
                        <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                          <span>🏷️ Brand:</span>
                          <span style={{ fontWeight: "600", color: generalEstimate.brandImpact.startsWith('+') ? "#059669" : generalEstimate.brandImpact.startsWith('-') ? "#DC2626" : "#6B7280" }}>
                            {generalEstimate.brandImpact}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Tips */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                        💡 Tips to Get More
                      </p>
                      <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                        <li>Bring original box, manual & accessories</li>
                        <li>Clean the item before visiting</li>
                        <li>Visit multiple shops and compare offers</li>
                        <li>Selling pays 10-20% more than pawning</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gold & Jewelry Tab */}
        {activeTab === 'gold' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B7950B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💍 Gold & Jewelry Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Metal Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🪙 Metal Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[
                      { id: 'gold', label: 'Gold', emoji: '🥇' },
                      { id: 'silver', label: 'Silver', emoji: '🥈' },
                      { id: 'platinum', label: 'Platinum', emoji: '⚪' },
                    ].map((metal) => (
                      <button
                        key={metal.id}
                        onClick={() => setMetalType(metal.id as 'gold' | 'silver' | 'platinum')}
                        style={{
                          padding: "16px 12px",
                          borderRadius: "8px",
                          border: metalType === metal.id ? "2px solid #B7950B" : "1px solid #E5E7EB",
                          backgroundColor: metalType === metal.id ? "#FEF9E7" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{metal.emoji}</div>
                        <div style={{ 
                          fontWeight: metalType === metal.id ? "600" : "500",
                          color: metalType === metal.id ? "#B7950B" : "#374151",
                          fontSize: "0.9rem"
                        }}>
                          {metal.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purity Selection */}
                {metalType === 'gold' && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      ✨ Gold Purity (Karat)
                    </label>
                    <select
                      value={goldPurity}
                      onChange={(e) => setGoldPurity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        backgroundColor: "white"
                      }}
                    >
                      {goldPurities.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.label} - {p.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {metalType === 'silver' && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      ✨ Silver Purity
                    </label>
                    <select
                      value={silverPurity}
                      onChange={(e) => setSilverPurity(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                        boxSizing: "border-box",
                        backgroundColor: "white"
                      }}
                    >
                      {silverPurities.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.label} - {p.description}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Weight */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ⚖️ Weight (grams)
                  </label>
                  <input
                    type="number"
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    min={0.1}
                    max={1000}
                    step={0.1}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    1 oz = 28.35 grams | 1 pennyweight (dwt) = 1.555 grams
                  </p>
                </div>

                {/* Gemstones */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    backgroundColor: hasGemstones ? "#FEF9E7" : "#F9FAFB",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: hasGemstones ? "1px solid #B7950B" : "1px solid #E5E7EB"
                  }}>
                    <input
                      type="checkbox"
                      checked={hasGemstones}
                      onChange={(e) => setHasGemstones(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <div style={{ fontWeight: "500", color: "#374151" }}>💎 Has Gemstones</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Diamonds, rubies, etc. (valued at ~30% wholesale)</div>
                    </div>
                  </label>
                </div>

                {hasGemstones && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      💎 Estimated Gemstone Retail Value
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={gemstoneValue}
                        onChange={(e) => setGemstoneValue(Number(e.target.value))}
                        min={0}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          border: "1px solid #D1D5DB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Spot Price Info */}
                <div style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  padding: "12px 16px"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                    📈 <strong>Current Spot Prices (approx):</strong><br />
                    Gold: ${spotPrices.gold}/g (~$2,350/oz) | Silver: ${spotPrices.silver}/g (~$29/oz)
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9A7D0A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Jewelry Value Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Melt Value Calculation */}
                <div style={{ 
                  backgroundColor: "#FEF9E7", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #F9E79F"
                }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", fontWeight: "600", color: "#9A7D0A" }}>
                    ⚗️ Melt Value Calculation
                  </h3>
                  <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Metal:</span>
                      <span style={{ fontWeight: "600" }}>{goldEstimate.metalLabel}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Purity:</span>
                      <span style={{ fontWeight: "600" }}>{goldEstimate.purity}%</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Weight:</span>
                      <span style={{ fontWeight: "600" }}>{weightGrams}g</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Spot Price:</span>
                      <span style={{ fontWeight: "600" }}>${goldEstimate.spotPrice}/g</span>
                    </p>
                    <div style={{ borderTop: "1px solid #E5E7EB", marginTop: "8px", paddingTop: "8px" }}>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                        <span>Metal Value:</span>
                        <span style={{ fontWeight: "600" }}>${goldEstimate.metalValue.toLocaleString()}</span>
                      </p>
                      {hasGemstones && (
                        <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                          <span>Gemstone Value (30%):</span>
                          <span style={{ fontWeight: "600" }}>${Math.round(gemstoneValue * 0.3).toLocaleString()}</span>
                        </p>
                      )}
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between", fontSize: "1.1rem", color: "#B7950B" }}>
                        <span><strong>Total Melt Value:</strong></span>
                        <span><strong>${goldEstimate.meltValue.toLocaleString()}</strong></span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pawn Loan Offer */}
                <div style={{ 
                  backgroundColor: "#EBF5FB", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "16px",
                  border: "1px solid #85C1E9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "1.2rem" }}>🏦</span>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#1A5276" }}>PAWN LOAN (40-55%)</h3>
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2874A6" }}>
                    ${goldEstimate.pawnMin.toLocaleString()} - ${goldEstimate.pawnMax.toLocaleString()}
                  </div>
                </div>

                {/* Sell Outright Offer */}
                <div style={{ 
                  backgroundColor: "#E8F8F5", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #76D7C4"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "1.2rem" }}>💵</span>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#0E6655" }}>SELL OUTRIGHT (50-65%)</h3>
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#148F77" }}>
                    ${goldEstimate.sellMin.toLocaleString()} - ${goldEstimate.sellMax.toLocaleString()}
                  </div>
                </div>

                {/* Gold Tips */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    💡 Jewelry Tips
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Higher karat = more pure gold = higher value</li>
                    <li>Weigh your jewelry at home first</li>
                    <li>Designer pieces (Tiffany, Cartier) may get premiums</li>
                    <li>Pawn shops pay wholesale for gemstones, not retail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Estimate Tab */}
        {activeTab === 'quick' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#B7950B", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚡ Quick Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <p style={{ fontSize: "0.9rem", color: "#6B7280", marginTop: 0, marginBottom: "24px" }}>
                  Get a rough estimate fast. For more accurate results, use the General Items or Gold & Jewelry tabs.
                </p>

                {/* Item Value */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💵 Item Value (What you paid or current market price)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={quickValue}
                      onChange={(e) => setQuickValue(Number(e.target.value))}
                      min={10}
                      max={100000}
                      style={{
                        width: "100%",
                        padding: "16px 16px 16px 32px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1.25rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                {/* Quick Condition */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    ✨ Condition
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[
                      { id: 'excellent', label: 'Excellent', emoji: '👍' },
                      { id: 'good', label: 'Good', emoji: '👌' },
                      { id: 'fair', label: 'Fair', emoji: '🤏' },
                    ].map((cond) => (
                      <button
                        key={cond.id}
                        onClick={() => setQuickCondition(cond.id)}
                        style={{
                          padding: "16px 12px",
                          borderRadius: "8px",
                          border: quickCondition === cond.id ? "2px solid #B7950B" : "1px solid #E5E7EB",
                          backgroundColor: quickCondition === cond.id ? "#FEF9E7" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{cond.emoji}</div>
                        <div style={{ 
                          fontWeight: quickCondition === cond.id ? "600" : "500",
                          color: quickCondition === cond.id ? "#B7950B" : "#374151",
                          fontSize: "0.9rem"
                        }}>
                          {cond.label}
                        </div>
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
              border: "1px solid #F9E79F",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#9A7D0A", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Quick Estimate Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "4px" }}>For an item worth ${quickValue.toLocaleString()}</div>
                </div>

                {/* Pawn Loan */}
                <div style={{ 
                  backgroundColor: "#EBF5FB", 
                  borderRadius: "12px", 
                  padding: "24px",
                  marginBottom: "16px",
                  border: "1px solid #85C1E9",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1A5276", marginBottom: "8px" }}>
                    🏦 PAWN LOAN
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2874A6" }}>
                    ${quickEstimate.pawnMin.toLocaleString()} - ${quickEstimate.pawnMax.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#5DADE2", marginTop: "8px" }}>
                    (25-40% of value)
                  </div>
                </div>

                {/* Sell Outright */}
                <div style={{ 
                  backgroundColor: "#E8F8F5", 
                  borderRadius: "12px", 
                  padding: "24px",
                  marginBottom: "24px",
                  border: "1px solid #76D7C4",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "1rem", fontWeight: "600", color: "#0E6655", marginBottom: "8px" }}>
                    💵 SELL OUTRIGHT
                  </div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#148F77" }}>
                    ${quickEstimate.sellMin.toLocaleString()} - ${quickEstimate.sellMax.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#45B39D", marginTop: "8px" }}>
                    (35-55% of value)
                  </div>
                </div>

                {/* Note */}
                <div style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  padding: "12px 16px"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0, textAlign: "center" }}>
                    ⚠️ This is a rough estimate. Actual offers depend on item type, brand, demand, and shop policies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Common Value Examples */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #F9E79F", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            💰 Common Pawn Shop Value Examples
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { item: 'iPhone 15 Pro ($999)', pawn: '$200-$350', sell: '$300-$450' },
              { item: 'MacBook Air ($1,199)', pawn: '$240-$420', sell: '$360-$540' },
              { item: 'PS5 Console ($499)', pawn: '$125-$175', sell: '$175-$225' },
              { item: 'DeWalt Drill Set ($300)', pawn: '$75-$120', sell: '$105-$150' },
              { item: 'Fender Guitar ($800)', pawn: '$240-$360', sell: '$320-$440' },
              { item: '14K Gold Chain (10g)', pawn: '$175-$240', sell: '$220-$285' },
            ].map((example, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "16px",
                  backgroundColor: "#FEF9E7",
                  borderRadius: "12px",
                  border: "1px solid #F9E79F"
                }}
              >
                <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
                  {example.item}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6B7280", lineHeight: "1.6" }}>
                  <div>🏦 Pawn: <span style={{ color: "#2874A6", fontWeight: "500" }}>{example.pawn}</span></div>
                  <div>💵 Sell: <span style={{ color: "#148F77", fontWeight: "500" }}>{example.sell}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F9E79F", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🏪 How Pawn Shop Pricing Works
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Pawn shops need to make a profit while managing risk. When you pawn an item, they&apos;re 
                  essentially giving you a loan using your item as collateral. If you don&apos;t repay, they 
                  need to sell your item to recover their money.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Pawn Loan vs. Selling</h3>
                <div style={{
                  backgroundColor: "#FEF9E7",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #F9E79F"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <h4 style={{ color: "#2874A6", margin: "0 0 8px 0" }}>🏦 Pawn Loan</h4>
                      <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: "1.8", fontSize: "0.9rem" }}>
                        <li>Get 25-40% of value</li>
                        <li>Keep ownership of item</li>
                        <li>Repay loan + interest to get item back</li>
                        <li>30-90 day loan terms typical</li>
                      </ul>
                    </div>
                    <div>
                      <h4 style={{ color: "#148F77", margin: "0 0 8px 0" }}>💵 Sell Outright</h4>
                      <ul style={{ margin: 0, paddingLeft: "16px", lineHeight: "1.8", fontSize: "0.9rem" }}>
                        <li>Get 35-55% of value</li>
                        <li>Permanent sale</li>
                        <li>No interest or repayment</li>
                        <li>Higher payout than pawning</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Affects Your Offer</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
                  <li><strong>Resale value:</strong> What the shop can sell it for (they check eBay)</li>
                  <li><strong>Condition:</strong> Like-new items get 10-20% more</li>
                  <li><strong>Brand:</strong> Premium brands hold value better</li>
                  <li><strong>Demand:</strong> Fast-selling items get better offers</li>
                  <li><strong>Local market:</strong> Prices vary by location</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Best Items to Pawn */}
            <div style={{ backgroundColor: "#B7950B", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>🏆 Best Items to Pawn</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                <p style={{ margin: "0" }}>💍 Gold jewelry (by weight)</p>
                <p style={{ margin: "0" }}>⌚ Rolex & luxury watches</p>
                <p style={{ margin: "0" }}>🎸 Quality instruments</p>
                <p style={{ margin: "0" }}>📱 Latest iPhones/MacBooks</p>
                <p style={{ margin: "0" }}>🔧 DeWalt, Milwaukee tools</p>
                <p style={{ margin: "0" }}>👜 Louis Vuitton, Chanel bags</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FDEDEC", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #F5B7B1" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#922B21", marginBottom: "16px" }}>⚠️ Watch Out For</h3>
              <ul style={{ fontSize: "0.85rem", color: "#C0392B", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>High interest rates (10-25%/month)</li>
                <li>Short loan terms (30-90 days)</li>
                <li>Losing sentimental items</li>
                <li>Lowball first offers</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/pawn-shop-value-estimator" currentCategory="Finance" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #F9E79F", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#FEF9E7", borderRadius: "8px", border: "1px solid #F9E79F" }}>
          <p style={{ fontSize: "0.75rem", color: "#9A7D0A", textAlign: "center", margin: 0 }}>
            🏪 <strong>Disclaimer:</strong> These are estimates based on typical pawn shop practices. 
            Actual offers vary by shop, location, market conditions, and item specifics. Always visit 
            multiple shops and compare offers before making a decision.
          </p>
        </div>
      </div>
    </div>
  );
}