"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common split ratios
const forwardSplitPresets = [
  { label: "2-for-1", splitFor: 2, splitFrom: 1 },
  { label: "3-for-1", splitFor: 3, splitFrom: 1 },
  { label: "4-for-1", splitFor: 4, splitFrom: 1 },
  { label: "5-for-1", splitFor: 5, splitFrom: 1 },
  { label: "10-for-1", splitFor: 10, splitFrom: 1 },
  { label: "3-for-2", splitFor: 3, splitFrom: 2 }
];

const reverseSplitPresets = [
  { label: "1-for-2", ratio: 2 },
  { label: "1-for-4", ratio: 4 },
  { label: "1-for-5", ratio: 5 },
  { label: "1-for-8", ratio: 8 },
  { label: "1-for-10", ratio: 10 },
  { label: "1-for-20", ratio: 20 }
];

// Famous stock splits history
const famousSplits = [
  { company: "Apple (AAPL)", split: "4-for-1", date: "Aug 2020", preSplit: "$500", postSplit: "$125" },
  { company: "Tesla (TSLA)", split: "5-for-1", date: "Aug 2020", preSplit: "$2,213", postSplit: "$443" },
  { company: "Tesla (TSLA)", split: "3-for-1", date: "Aug 2022", preSplit: "$891", postSplit: "$297" },
  { company: "NVIDIA (NVDA)", split: "10-for-1", date: "Jun 2024", preSplit: "$1,200", postSplit: "$120" },
  { company: "Amazon (AMZN)", split: "20-for-1", date: "Jun 2022", preSplit: "$2,447", postSplit: "$122" },
  { company: "Google (GOOGL)", split: "20-for-1", date: "Jul 2022", preSplit: "$2,255", postSplit: "$113" }
];

// FAQ data
const faqs = [
  {
    question: "How to calculate a stock split?",
    answer: "To calculate a stock split, multiply your shares by the split ratio and divide the price by the same ratio. For a 2-for-1 split: New Shares = Old Shares × 2, New Price = Old Price ÷ 2. Example: 100 shares at $200 becomes 200 shares at $100. Your total investment value ($20,000) stays the same—only the number of shares and price per share change."
  },
  {
    question: "How to calculate stock split 3-for-2?",
    answer: "In a 3-for-2 split, you receive 3 shares for every 2 shares owned. Multiply shares by 1.5 (3÷2) and divide price by 1.5. Example: 100 shares at $150 → 150 shares at $100. Total value remains $15,000. This ratio is less common than 2-for-1 but achieves a more moderate price reduction while still increasing share count."
  },
  {
    question: "How to calculate stock split 3-for-1?",
    answer: "A 3-for-1 split triples your shares while dividing the price by 3. Formula: New Shares = Old Shares × 3, New Price = Old Price ÷ 3. Example: If you own 50 shares at $300, after the split you'll have 150 shares at $100 each. Total value stays at $15,000. Tesla did a 3-for-1 split in August 2022."
  },
  {
    question: "What is a reverse stock split?",
    answer: "A reverse stock split reduces the number of shares while increasing the price proportionally. In a 1-for-10 reverse split, every 10 shares become 1 share at 10× the price. Example: 1,000 shares at $1 becomes 100 shares at $10. Companies do this to meet exchange listing requirements (minimum $1 price) or improve perception. Total value remains unchanged, though fractional shares may be cashed out."
  },
  {
    question: "Is it better to buy before or after a stock split?",
    answer: "Mathematically, it doesn't matter—your investment value is the same before and after a split. However, studies show stocks often outperform the market 12 months post-split (25-30% vs 10-12% for S&P 500). This may be due to increased accessibility attracting more buyers, or the split signaling management's confidence. The split itself doesn't create value; company fundamentals matter most."
  },
  {
    question: "What is the downside of a stock split?",
    answer: "Stock splits have few direct downsides for investors since your total value doesn't change. However: (1) Increased volatility from more retail trading, (2) No fundamental value creation—it's cosmetic, (3) Transaction costs if you sell fractional shares, (4) Potential psychological trap—lower price doesn't mean 'cheap.' Reverse splits often signal trouble, as companies use them to avoid delisting."
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

export default function StockSplitCalculator() {
  const [activeTab, setActiveTab] = useState<"forward" | "reverse" | "multiple">("forward");
  
  // Tab 1: Forward Split State
  const [shares, setShares] = useState<string>("100");
  const [price, setPrice] = useState<string>("200");
  const [splitFor, setSplitFor] = useState<string>("2");
  const [splitFrom, setSplitFrom] = useState<string>("1");
  const [costBasis, setCostBasis] = useState<string>("150");
  const [includeCostBasis, setIncludeCostBasis] = useState<boolean>(true);
  
  // Tab 2: Reverse Split State
  const [revShares, setRevShares] = useState<string>("1000");
  const [revPrice, setRevPrice] = useState<string>("2");
  const [reverseRatio, setReverseRatio] = useState<string>("10");
  const [revCostBasis, setRevCostBasis] = useState<string>("5");
  const [revIncludeCostBasis, setRevIncludeCostBasis] = useState<boolean>(true);
  
  // Tab 3: Multiple Splits State
  const [origShares, setOrigShares] = useState<string>("100");
  const [origPrice, setOrigPrice] = useState<string>("50");
  const [splits, setSplits] = useState<Array<{ splitFor: number; splitFrom: number }>>([
    { splitFor: 2, splitFrom: 1 },
    { splitFor: 4, splitFrom: 1 }
  ]);

  // Tab 1 Calculations
  const sharesNum = parseFloat(shares) || 0;
  const priceNum = parseFloat(price) || 0;
  const splitForNum = parseFloat(splitFor) || 2;
  const splitFromNum = parseFloat(splitFrom) || 1;
  const costBasisNum = parseFloat(costBasis) || 0;
  
  const splitRatio = splitForNum / splitFromNum;
  const newShares = sharesNum * splitRatio;
  const newPrice = priceNum / splitRatio;
  const totalValueBefore = sharesNum * priceNum;
  const totalValueAfter = newShares * newPrice;
  const newCostBasis = costBasisNum / splitRatio;
  const gainLoss = includeCostBasis ? (newPrice - newCostBasis) * newShares : 0;
  const gainLossPercent = includeCostBasis && newCostBasis > 0 ? ((newPrice - newCostBasis) / newCostBasis) * 100 : 0;

  // Tab 2 Calculations
  const revSharesNum = parseFloat(revShares) || 0;
  const revPriceNum = parseFloat(revPrice) || 0;
  const reverseRatioNum = parseFloat(reverseRatio) || 10;
  const revCostBasisNum = parseFloat(revCostBasis) || 0;
  
  const newRevShares = revSharesNum / reverseRatioNum;
  const wholeShares = Math.floor(newRevShares);
  const fractionalShares = newRevShares - wholeShares;
  const newRevPrice = revPriceNum * reverseRatioNum;
  const fractionalCashOut = fractionalShares * newRevPrice;
  const revTotalValue = revSharesNum * revPriceNum;
  const newRevCostBasis = revCostBasisNum * reverseRatioNum;
  const revGainLoss = revIncludeCostBasis ? (newRevPrice - newRevCostBasis) * wholeShares : 0;

  // Tab 3 Calculations
  const origSharesNum = parseFloat(origShares) || 0;
  const origPriceNum = parseFloat(origPrice) || 0;
  
  let cumulativeFactor = 1;
  splits.forEach(split => {
    cumulativeFactor *= (split.splitFor / split.splitFrom);
  });
  
  const finalShares = origSharesNum * cumulativeFactor;
  const splitAdjustedPrice = origPriceNum / cumulativeFactor;
  const origTotalValue = origSharesNum * origPriceNum;

  const addSplit = () => {
    if (splits.length < 5) {
      setSplits([...splits, { splitFor: 2, splitFrom: 1 }]);
    }
  };

  const removeSplit = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index));
  };

  const updateSplit = (index: number, field: "splitFor" | "splitFrom", value: number) => {
    const newSplits = [...splits];
    newSplits[index][field] = value;
    setSplits(newSplits);
  };

  const tabs = [
    { id: "forward", label: "Stock Split", icon: "📈" },
    { id: "reverse", label: "Reverse Split", icon: "📉" },
    { id: "multiple", label: "Multiple Splits", icon: "📊" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Stock Split Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📈</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#14532D", margin: 0 }}>
              Stock Split Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#166534", maxWidth: "800px" }}>
            Calculate how stock splits affect your shares, price, and cost basis. 
            Supports forward splits, reverse splits, and multiple split calculations.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#059669",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>Stock Split Formula</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>New Shares:</strong> Old × (Split Ratio)
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>New Price:</strong> Old ÷ (Split Ratio)
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.15)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Total Value:</strong> Unchanged
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#059669" : "#BBF7D0",
                color: activeTab === tab.id ? "white" : "#166534",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #D1FAE5",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "forward" && "📈 Forward Split Details"}
                {activeTab === "reverse" && "📉 Reverse Split Details"}
                {activeTab === "multiple" && "📊 Split History"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* FORWARD SPLIT TAB */}
              {activeTab === "forward" && (
                <>
                  {/* Shares & Price */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Shares Owned
                      </label>
                      <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Current Price ($)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Split Ratio */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                      Split Ratio
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="number"
                        value={splitFor}
                        onChange={(e) => setSplitFor(e.target.value)}
                        min="1"
                        style={{ width: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", textAlign: "center" }}
                      />
                      <span style={{ fontWeight: "600", color: "#166534" }}>for</span>
                      <input
                        type="number"
                        value={splitFrom}
                        onChange={(e) => setSplitFrom(e.target.value)}
                        min="1"
                        style={{ width: "80px", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", textAlign: "center" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                      {forwardSplitPresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => { setSplitFor(preset.splitFor.toString()); setSplitFrom(preset.splitFrom.toString()); }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: splitFor === preset.splitFor.toString() && splitFrom === preset.splitFrom.toString() ? "2px solid #059669" : "1px solid #BBF7D0",
                            backgroundColor: splitFor === preset.splitFor.toString() && splitFrom === preset.splitFrom.toString() ? "#ECFDF5" : "white",
                            color: "#166534",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: "500"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost Basis */}
                  <div style={{ backgroundColor: "#F0FDF4", borderRadius: "8px", padding: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "10px" }}>
                      <input
                        type="checkbox"
                        checked={includeCostBasis}
                        onChange={(e) => setIncludeCostBasis(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#166534" }}>Include Cost Basis Analysis</span>
                    </label>
                    {includeCostBasis && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#166534", marginBottom: "4px" }}>
                          Original Cost Basis per Share ($)
                        </label>
                        <input
                          type="number"
                          value={costBasis}
                          onChange={(e) => setCostBasis(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #BBF7D0", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* REVERSE SPLIT TAB */}
              {activeTab === "reverse" && (
                <>
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      ⚠️ Reverse splits reduce share count and increase price. Often used to meet exchange listing requirements.
                    </p>
                  </div>

                  {/* Shares & Price */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Shares Owned
                      </label>
                      <input
                        type="number"
                        value={revShares}
                        onChange={(e) => setRevShares(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Current Price ($)
                      </label>
                      <input
                        type="number"
                        value={revPrice}
                        onChange={(e) => setRevPrice(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Reverse Ratio */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                      Reverse Split Ratio (1-for-X)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: "600", color: "#166534" }}>1 for</span>
                      <input
                        type="number"
                        value={reverseRatio}
                        onChange={(e) => setReverseRatio(e.target.value)}
                        min="2"
                        style={{ width: "100px", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", textAlign: "center" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
                      {reverseSplitPresets.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setReverseRatio(preset.ratio.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: reverseRatio === preset.ratio.toString() ? "2px solid #059669" : "1px solid #BBF7D0",
                            backgroundColor: reverseRatio === preset.ratio.toString() ? "#ECFDF5" : "white",
                            color: "#166534",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: "500"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost Basis */}
                  <div style={{ backgroundColor: "#F0FDF4", borderRadius: "8px", padding: "12px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "10px" }}>
                      <input
                        type="checkbox"
                        checked={revIncludeCostBasis}
                        onChange={(e) => setRevIncludeCostBasis(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#166534" }}>Include Cost Basis</span>
                    </label>
                    {revIncludeCostBasis && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#166534", marginBottom: "4px" }}>
                          Original Cost Basis per Share ($)
                        </label>
                        <input
                          type="number"
                          value={revCostBasis}
                          onChange={(e) => setRevCostBasis(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #BBF7D0", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* MULTIPLE SPLITS TAB */}
              {activeTab === "multiple" && (
                <>
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      📊 Calculate the cumulative effect of multiple stock splits over time (e.g., Apple&apos;s 5 splits since IPO).
                    </p>
                  </div>

                  {/* Original Position */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Original Shares
                      </label>
                      <input
                        type="number"
                        value={origShares}
                        onChange={(e) => setOrigShares(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "6px", fontWeight: "600" }}>
                        Original Price ($)
                      </label>
                      <input
                        type="number"
                        value={origPrice}
                        onChange={(e) => setOrigPrice(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #BBF7D0", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Split History */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#166534", marginBottom: "8px", fontWeight: "600" }}>
                      Split History
                    </label>
                    {splits.map((split, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", backgroundColor: "#F0FDF4", padding: "8px 12px", borderRadius: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#166534", width: "60px" }}>Split {index + 1}:</span>
                        <input
                          type="number"
                          value={split.splitFor}
                          onChange={(e) => updateSplit(index, "splitFor", parseInt(e.target.value) || 2)}
                          min="1"
                          style={{ width: "50px", padding: "6px", borderRadius: "4px", border: "1px solid #BBF7D0", textAlign: "center", fontSize: "0.85rem" }}
                        />
                        <span style={{ color: "#166534", fontSize: "0.8rem" }}>for</span>
                        <input
                          type="number"
                          value={split.splitFrom}
                          onChange={(e) => updateSplit(index, "splitFrom", parseInt(e.target.value) || 1)}
                          min="1"
                          style={{ width: "50px", padding: "6px", borderRadius: "4px", border: "1px solid #BBF7D0", textAlign: "center", fontSize: "0.85rem" }}
                        />
                        {splits.length > 1 && (
                          <button
                            onClick={() => removeSplit(index)}
                            style={{ marginLeft: "auto", padding: "4px 8px", backgroundColor: "#FEE2E2", border: "none", borderRadius: "4px", color: "#DC2626", cursor: "pointer", fontSize: "0.75rem" }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    {splits.length < 5 && (
                      <button
                        onClick={addSplit}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "2px dashed #BBF7D0",
                          backgroundColor: "white",
                          color: "#059669",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem"
                        }}
                      >
                        + Add Split
                      </button>
                    )}
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
            border: "1px solid #D1FAE5",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#10B981", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "forward" && "📊 Post-Split Position"}
                {activeTab === "reverse" && "📊 Post-Reverse Position"}
                {activeTab === "multiple" && "📊 Cumulative Results"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* FORWARD SPLIT RESULTS */}
              {activeTab === "forward" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #10B981",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      After {splitFor}-for-{splitFrom} Split
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {newShares.toLocaleString(undefined, { maximumFractionDigits: 2 })} shares
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "1.25rem", color: "#065F46" }}>
                      @ ${newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per share
                    </p>
                  </div>

                  {/* Before/After Comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Before Split</p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#374151" }}>
                        {sharesNum.toLocaleString()} @ ${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                        ${totalValueBefore.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#065F46" }}>After Split</p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#059669" }}>
                        {newShares.toLocaleString(undefined, { maximumFractionDigits: 2 })} @ ${newPrice.toFixed(2)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#065F46" }}>
                        ${totalValueAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>

                  {/* Cost Basis Analysis */}
                  {includeCostBasis && costBasisNum > 0 && (
                    <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Cost Basis Analysis</h4>
                      <div style={{ fontSize: "0.85rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Original Cost Basis</span>
                          <span style={{ fontWeight: "600" }}>${costBasisNum.toFixed(2)}/share</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>New Cost Basis</span>
                          <span style={{ fontWeight: "600" }}>${newCostBasis.toFixed(2)}/share</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Total Cost</span>
                          <span style={{ fontWeight: "600" }}>${(newCostBasis * newShares).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E5E7EB" }}>
                          <span style={{ fontWeight: "600" }}>Unrealized Gain/Loss</span>
                          <span style={{ fontWeight: "bold", color: gainLoss >= 0 ? "#059669" : "#DC2626" }}>
                            {gainLoss >= 0 ? "+" : ""}${gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })} ({gainLossPercent >= 0 ? "+" : ""}{gainLossPercent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Value Unchanged Note */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginTop: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Note:</strong> Your total investment value (${totalValueAfter.toLocaleString(undefined, { minimumFractionDigits: 2 })}) remains unchanged after the split.
                    </p>
                  </div>
                </>
              )}

              {/* REVERSE SPLIT RESULTS */}
              {activeTab === "reverse" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                      After 1-for-{reverseRatio} Reverse Split
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                      {wholeShares.toLocaleString()} shares
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "1.25rem", color: "#92400E" }}>
                      @ ${newRevPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per share
                    </p>
                  </div>

                  {/* Fractional Shares Warning */}
                  {fractionalShares > 0 && (
                    <div style={{ backgroundColor: "#FEE2E2", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid #FECACA" }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#DC2626" }}>
                        ⚠️ <strong>Fractional Shares:</strong> {fractionalShares.toFixed(4)} shares will be cashed out at ~${fractionalCashOut.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Before/After Comparison */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Before</p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#374151" }}>
                        {revSharesNum.toLocaleString()} shares
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                        @ ${revPriceNum.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>After</p>
                      <p style={{ margin: 0, fontSize: "1rem", fontWeight: "600", color: "#B45309" }}>
                        {wholeShares.toLocaleString()} shares
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#92400E" }}>
                        @ ${newRevPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Summary</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#6B7280" }}>Total Value (Before)</span>
                        <span style={{ fontWeight: "600" }}>${revTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#6B7280" }}>Shares Value (After)</span>
                        <span style={{ fontWeight: "600" }}>${(wholeShares * newRevPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      {fractionalShares > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#6B7280" }}>Cash for Fractional</span>
                          <span style={{ fontWeight: "600" }}>${fractionalCashOut.toFixed(2)}</span>
                        </div>
                      )}
                      {revIncludeCostBasis && revCostBasisNum > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #E5E7EB" }}>
                          <span style={{ color: "#6B7280" }}>New Cost Basis</span>
                          <span style={{ fontWeight: "600" }}>${newRevCostBasis.toFixed(2)}/share</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* MULTIPLE SPLITS RESULTS */}
              {activeTab === "multiple" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #10B981",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Cumulative Split Factor: {cumulativeFactor}×
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {finalShares.toLocaleString(undefined, { maximumFractionDigits: 0 })} shares
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#065F46" }}>
                      Split-adjusted price: ${splitAdjustedPrice.toFixed(4)}
                    </p>
                  </div>

                  {/* Split History Table */}
                  <div style={{ backgroundColor: "#F8FAFC", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Split-by-Split Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", padding: "6px", backgroundColor: "#E5E7EB", borderRadius: "4px", fontWeight: "600" }}>
                        <span>Event</span>
                        <span>Shares</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", padding: "4px 0" }}>
                        <span style={{ color: "#6B7280" }}>Original</span>
                        <span style={{ fontWeight: "600" }}>{origSharesNum.toLocaleString()}</span>
                      </div>
                      {splits.map((split, index) => {
                        let runningShares = origSharesNum;
                        for (let i = 0; i <= index; i++) {
                          runningShares *= (splits[i].splitFor / splits[i].splitFrom);
                        }
                        return (
                          <div key={index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", padding: "4px 0" }}>
                            <span style={{ color: "#6B7280" }}>After {split.splitFor}-for-{split.splitFrom}</span>
                            <span style={{ fontWeight: "600" }}>{runningShares.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Value Summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Original Investment</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>
                        ${origTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                        {origSharesNum} @ ${origPriceNum}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#065F46" }}>Split-Adjusted Basis</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#059669" }}>
                        ${splitAdjustedPrice.toFixed(4)}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#065F46" }}>
                        per share
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Famous Stock Splits Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #D1FAE5",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📜 Famous Stock Splits History</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F0FDF4" }}>
                  <th style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "left" }}>Company</th>
                  <th style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>Split Ratio</th>
                  <th style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>Date</th>
                  <th style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>Pre-Split</th>
                  <th style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>Post-Split</th>
                </tr>
              </thead>
              <tbody>
                {famousSplits.map((split, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #D1FAE5", fontWeight: "600" }}>{split.company}</td>
                    <td style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center", color: "#059669", fontWeight: "600" }}>{split.split}</td>
                    <td style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>{split.date}</td>
                    <td style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>{split.preSplit}</td>
                    <td style={{ padding: "12px", border: "1px solid #D1FAE5", textAlign: "center" }}>{split.postSplit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D1FAE5", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#14532D", marginBottom: "20px" }}>📈 Understanding Stock Splits</h2>
              
              <div style={{ color: "#166534", lineHeight: "1.8" }}>
                <h3 style={{ color: "#14532D", marginTop: "0", marginBottom: "12px" }}>What is a Stock Split?</h3>
                <p>
                  A stock split is a corporate action where a company divides its existing shares into multiple shares. 
                  While the number of shares increases, the total value of your investment remains unchanged because 
                  the price per share decreases proportionally. For example, in a 2-for-1 split, you&apos;d have twice 
                  as many shares at half the price.
                </p>
                
                <h3 style={{ color: "#14532D", marginTop: "24px", marginBottom: "12px" }}>Why Do Companies Split Stocks?</h3>
                <p>
                  Companies typically split their stock when share prices have risen significantly, making shares 
                  expensive for retail investors. A lower price per share increases accessibility and liquidity. 
                  NVIDIA&apos;s 10-for-1 split in 2024 brought shares from ~$1,200 to ~$120, making it more accessible 
                  to everyday investors and employees receiving stock compensation.
                </p>
                
                <h3 style={{ color: "#14532D", marginTop: "24px", marginBottom: "12px" }}>Forward vs. Reverse Splits</h3>
                <p>
                  Forward splits (like 2-for-1) increase shares and are generally positive signals—companies do them 
                  when stock prices are high. Reverse splits (like 1-for-10) reduce shares and increase price, often 
                  done to meet minimum listing requirements. Reverse splits can be a warning sign of struggling companies, 
                  though not always—sometimes it&apos;s simply to meet institutional investment criteria.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#059669", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Quick Reference</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>2-for-1:</strong> 2× shares, ½ price</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>3-for-1:</strong> 3× shares, ⅓ price</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>4-for-1:</strong> 4× shares, ¼ price</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>1-for-10:</strong> 1/10 shares, 10× price</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  Total value always stays the same!
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Tax Note</h3>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                Stock splits don&apos;t trigger taxable events. Your cost basis per share adjusts, but total cost basis stays the same. Only selling shares creates a taxable event.
              </p>
            </div>

            <RelatedTools currentUrl="/stock-split-calculator" currentCategory="Finance" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #D1FAE5", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#14532D", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#166534", textAlign: "center", margin: 0 }}>
            📈 <strong>Disclaimer:</strong> This calculator is for educational purposes only. 
            Stock splits don&apos;t change the fundamental value of your investment. 
            Consult a financial advisor for investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}