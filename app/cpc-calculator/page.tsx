"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Industry benchmarks
const industryBenchmarks = [
  { industry: "Legal Services", cpc: 6.75, ctr: 4.41 },
  { industry: "Finance & Insurance", cpc: 3.77, ctr: 5.07 },
  { industry: "Home Services", cpc: 2.94, ctr: 4.80 },
  { industry: "Health & Medical", cpc: 2.62, ctr: 3.27 },
  { industry: "Travel & Hospitality", cpc: 1.53, ctr: 4.68 },
  { industry: "E-commerce", cpc: 1.16, ctr: 2.69 },
  { industry: "Technology", cpc: 3.80, ctr: 2.38 },
  { industry: "Education", cpc: 2.40, ctr: 3.78 },
  { industry: "Real Estate", cpc: 2.37, ctr: 3.71 },
  { industry: "B2B Services", cpc: 3.33, ctr: 2.41 }
];

// Platform benchmarks
const platformBenchmarks = [
  { platform: "Google Search", cpc: 2.69, ctr: 3.17, icon: "🔍" },
  { platform: "Google Display", cpc: 0.63, ctr: 0.46, icon: "🖼️" },
  { platform: "Facebook Ads", cpc: 0.97, ctr: 0.90, icon: "📘" },
  { platform: "Instagram Ads", cpc: 1.20, ctr: 0.58, icon: "📷" },
  { platform: "LinkedIn Ads", cpc: 5.26, ctr: 0.39, icon: "💼" },
  { platform: "Amazon Ads", cpc: 0.89, ctr: 0.36, icon: "📦" }
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate CPC?",
    answer: "CPC (Cost Per Click) is calculated by dividing the total cost of your advertising campaign by the total number of clicks received. The formula is: CPC = Total Ad Spend ÷ Total Clicks. For example, if you spend $500 on a campaign and receive 250 clicks, your CPC would be $500 ÷ 250 = $2.00 per click."
  },
  {
    question: "What is a good CPC price?",
    answer: "A 'good' CPC varies significantly by industry and platform. For Google Search ads, the average CPC is $2.69, while Display ads average $0.63. In highly competitive industries like legal services, CPCs can exceed $6.75. A good CPC is one that delivers profitable returns—compare your CPC against your conversion rate and customer lifetime value to determine if it's sustainable for your business."
  },
  {
    question: "How much is the average CPC?",
    answer: "Average CPC varies by platform: Google Search ($2.69), Google Display ($0.63), Facebook ($0.97), Instagram ($1.20), LinkedIn ($5.26), and Amazon ($0.89). Industry also matters—legal services average $6.75 per click, while e-commerce averages $1.16. These are benchmarks; your actual CPC will depend on competition, targeting, and ad quality."
  },
  {
    question: "What's the difference between CPC and CPM?",
    answer: "CPC (Cost Per Click) means you pay each time someone clicks your ad—best for driving traffic and conversions. CPM (Cost Per Mille/Thousand) means you pay for every 1,000 impressions regardless of clicks—best for brand awareness. You can convert between them: CPC = (CPM ÷ 1000) ÷ (CTR ÷ 100). Choose CPC for performance goals and CPM for reach goals."
  },
  {
    question: "How to lower your CPC in Google Ads?",
    answer: "To lower CPC: 1) Improve Quality Score by creating relevant ad copy and landing pages, 2) Use long-tail keywords with less competition, 3) Add negative keywords to avoid irrelevant clicks, 4) Improve CTR with compelling ads (higher CTR = lower CPC), 5) Target specific audiences rather than broad ones, 6) Test different bidding strategies like Target CPA or Maximize Conversions."
  },
  {
    question: "What is CTR and why does it matter for CPC?",
    answer: "CTR (Click-Through Rate) is the percentage of people who click your ad after seeing it: CTR = (Clicks ÷ Impressions) × 100. CTR matters because Google rewards ads with high CTR by giving them higher Quality Scores, which leads to lower CPCs and better ad positions. The average CTR for Google Search is 3.17%. Improving CTR is one of the best ways to reduce your CPC."
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

export default function CPCCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"cpc" | "cpm" | "budget" | "analyzer">("cpc");
  
  // CPC Calculator state
  const [adSpend, setAdSpend] = useState<string>("500");
  const [clicks, setClicks] = useState<string>("250");
  
  // CPM to CPC state
  const [cpm, setCpm] = useState<string>("10");
  const [ctrForCpm, setCtrForCpm] = useState<string>("2");
  
  // Budget Planner state
  const [budget, setBudget] = useState<string>("1000");
  const [budgetPeriod, setBudgetPeriod] = useState<"daily" | "monthly">("monthly");
  const [targetCpc, setTargetCpc] = useState<string>("2.50");
  const [expectedCtr, setExpectedCtr] = useState<string>("3");
  
  // Campaign Analyzer state
  const [analyzerSpend, setAnalyzerSpend] = useState<string>("2500");
  const [analyzerClicks, setAnalyzerClicks] = useState<string>("1000");
  const [analyzerImpressions, setAnalyzerImpressions] = useState<string>("50000");
  const [analyzerConversions, setAnalyzerConversions] = useState<string>("50");
  const [analyzerRevenue, setAnalyzerRevenue] = useState<string>("5000");

  // CPC Calculations
  const spend = parseFloat(adSpend) || 0;
  const clickCount = parseFloat(clicks) || 0;
  const calculatedCpc = clickCount > 0 ? spend / clickCount : 0;

  // CPM to CPC Calculations
  const cpmValue = parseFloat(cpm) || 0;
  const ctrValue = parseFloat(ctrForCpm) || 0;
  const cpcFromCpm = ctrValue > 0 ? (cpmValue / 1000) / (ctrValue / 100) : 0;
  const clicksPer1000 = ctrValue > 0 ? 1000 * (ctrValue / 100) : 0;

  // Budget Planner Calculations
  const budgetValue = parseFloat(budget) || 0;
  const targetCpcValue = parseFloat(targetCpc) || 0;
  const expectedCtrValue = parseFloat(expectedCtr) || 0;
  const estimatedClicks = targetCpcValue > 0 ? budgetValue / targetCpcValue : 0;
  const estimatedImpressions = expectedCtrValue > 0 ? (estimatedClicks / (expectedCtrValue / 100)) : 0;
  const dailyClicks = budgetPeriod === "monthly" ? estimatedClicks / 30 : estimatedClicks;
  const dailyImpressions = budgetPeriod === "monthly" ? estimatedImpressions / 30 : estimatedImpressions;

  // Campaign Analyzer Calculations
  const aSpend = parseFloat(analyzerSpend) || 0;
  const aClicks = parseFloat(analyzerClicks) || 0;
  const aImpressions = parseFloat(analyzerImpressions) || 0;
  const aConversions = parseFloat(analyzerConversions) || 0;
  const aRevenue = parseFloat(analyzerRevenue) || 0;
  
  const aCpc = aClicks > 0 ? aSpend / aClicks : 0;
  const aCtr = aImpressions > 0 ? (aClicks / aImpressions) * 100 : 0;
  const aCpm = aImpressions > 0 ? (aSpend / aImpressions) * 1000 : 0;
  const aCpa = aConversions > 0 ? aSpend / aConversions : 0;
  const aConversionRate = aClicks > 0 ? (aConversions / aClicks) * 100 : 0;
  const aRoas = aSpend > 0 ? (aRevenue / aSpend) * 100 : 0;
  const aProfit = aRevenue - aSpend;

  // Find closest industry benchmark
  const getIndustryComparison = (cpc: number) => {
    if (cpc <= 1.5) return { status: "excellent", color: "#059669", text: "Below average - Great performance!" };
    if (cpc <= 2.5) return { status: "good", color: "#2563EB", text: "Around average - Good performance" };
    if (cpc <= 4) return { status: "average", color: "#D97706", text: "Above average - Room for optimization" };
    return { status: "high", color: "#DC2626", text: "High CPC - Consider optimization strategies" };
  };

  const tabs = [
    { id: "cpc", label: "Calculate CPC", icon: "💰" },
    { id: "cpm", label: "CPM to CPC", icon: "🔄" },
    { id: "budget", label: "Budget Planner", icon: "📊" },
    { id: "analyzer", label: "Campaign Analyzer", icon: "📈" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>CPC Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              CPC Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate Cost Per Click (CPC), CTR, CPM, and other key advertising metrics. 
            Plan your ad budget and analyze campaign performance for Google Ads, Facebook, and more.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>CPC Formula: Total Ad Spend ÷ Total Clicks</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Average CPC: <strong>Google Search $2.69</strong> | <strong>Google Display $0.63</strong> | <strong>Facebook $0.97</strong> | <strong>LinkedIn $5.26</strong>
              </p>
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
                backgroundColor: activeTab === tab.id ? "#7C3AED" : "#E5E7EB",
                color: activeTab === tab.id ? "white" : "#374151",
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

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "cpc" && "💰 Calculate CPC"}
                {activeTab === "cpm" && "🔄 Convert CPM to CPC"}
                {activeTab === "budget" && "📊 Budget Planner"}
                {activeTab === "analyzer" && "📈 Campaign Analyzer"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "cpc" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Total Ad Spend
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={adSpend}
                        onChange={(e) => setAdSpend(e.target.value)}
                        placeholder="Enter total ad spend"
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Total Clicks
                    </label>
                    <input
                      type="number"
                      value={clicks}
                      onChange={(e) => setClicks(e.target.value)}
                      placeholder="Enter total clicks"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6B7280" }}>
                      <strong>Formula:</strong> CPC = Total Ad Spend ÷ Total Clicks<br />
                      <strong>Example:</strong> ${spend.toLocaleString()} ÷ {clickCount.toLocaleString()} clicks = ${calculatedCpc.toFixed(2)} per click
                    </p>
                  </div>
                </>
              )}

              {activeTab === "cpm" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      CPM (Cost per 1,000 Impressions)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={cpm}
                        onChange={(e) => setCpm(e.target.value)}
                        placeholder="Enter CPM"
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      CTR (Click-Through Rate)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.1"
                        value={ctrForCpm}
                        onChange={(e) => setCtrForCpm(e.target.value)}
                        placeholder="Enter CTR"
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "30px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6B7280" }}>
                      <strong>Formula:</strong> CPC = (CPM ÷ 1000) ÷ (CTR ÷ 100)<br />
                      <strong>Clicks per 1000 impressions:</strong> {clicksPer1000.toFixed(1)} clicks
                    </p>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Budget
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                        <input
                          type="number"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px 12px 12px 28px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <select
                        value={budgetPeriod}
                        onChange={(e) => setBudgetPeriod(e.target.value as "daily" | "monthly")}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Target CPC
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={targetCpc}
                        onChange={(e) => setTargetCpc(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 12px 12px 28px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Expected CTR (Optional)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.1"
                        value={expectedCtr}
                        onChange={(e) => setExpectedCtr(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "30px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>%</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "analyzer" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Ad Spend
                      </label>
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.9rem" }}>$</span>
                        <input
                          type="number"
                          value={analyzerSpend}
                          onChange={(e) => setAnalyzerSpend(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px 10px 10px 24px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.9rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Clicks
                      </label>
                      <input
                        type="number"
                        value={analyzerClicks}
                        onChange={(e) => setAnalyzerClicks(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Impressions
                      </label>
                      <input
                        type="number"
                        value={analyzerImpressions}
                        onChange={(e) => setAnalyzerImpressions(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Conversions
                      </label>
                      <input
                        type="number"
                        value={analyzerConversions}
                        onChange={(e) => setAnalyzerConversions(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Revenue (Optional)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.9rem" }}>$</span>
                      <input
                        type="number"
                        value={analyzerRevenue}
                        onChange={(e) => setAnalyzerRevenue(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 24px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "cpc" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Cost Per Click (CPC)</p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      ${calculatedCpc.toFixed(2)}
                    </p>
                  </div>

                  {/* Industry Comparison */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600", color: "#374151" }}>
                      📊 How does your CPC compare?
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "0.9rem", 
                      color: getIndustryComparison(calculatedCpc).color,
                      fontWeight: "500"
                    }}>
                      {getIndustryComparison(calculatedCpc).text}
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#1D4ED8" }}>
                      Quick Benchmarks
                    </p>
                    <div style={{ fontSize: "0.8rem", color: "#3B82F6" }}>
                      <p style={{ margin: "0 0 4px 0" }}>🔍 Google Search Avg: <strong>$2.69</strong></p>
                      <p style={{ margin: "0 0 4px 0" }}>🖼️ Google Display Avg: <strong>$0.63</strong></p>
                      <p style={{ margin: 0 }}>📘 Facebook Avg: <strong>$0.97</strong></p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "cpm" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Equivalent CPC</p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      ${cpcFromCpm.toFixed(2)}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Cost per 1000 views</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>${cpmValue.toFixed(2)}</p>
                    </div>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Clicks per 1000 views</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>{clicksPer1000.toFixed(1)}</p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> Higher CTR = Lower effective CPC. Improve your ad creative and targeting to boost CTR and reduce costs.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Estimated Clicks ({budgetPeriod})</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {Math.round(estimatedClicks).toLocaleString()}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1D4ED8" }}>Daily Clicks</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>~{Math.round(dailyClicks).toLocaleString()}</p>
                    </div>
                    <div style={{ backgroundColor: "#F5F3FF", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#7C3AED" }}>Est. Impressions</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#7C3AED" }}>~{Math.round(estimatedImpressions).toLocaleString()}</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Budget Breakdown</p>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      <p style={{ margin: "0 0 4px 0", display: "flex", justifyContent: "space-between" }}>
                        <span>Budget:</span> <strong>${budgetValue.toLocaleString()} / {budgetPeriod}</strong>
                      </p>
                      <p style={{ margin: "0 0 4px 0", display: "flex", justifyContent: "space-between" }}>
                        <span>Target CPC:</span> <strong>${targetCpcValue.toFixed(2)}</strong>
                      </p>
                      <p style={{ margin: 0, display: "flex", justifyContent: "space-between" }}>
                        <span>Daily Budget:</span> <strong>${budgetPeriod === "monthly" ? (budgetValue / 30).toFixed(2) : budgetValue.toFixed(2)}</strong>
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "analyzer" && (
                <>
                  {/* Key Metrics Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "14px", textAlign: "center", border: "1px solid #6EE7B7" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#065F46" }}>CPC</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>${aCpc.toFixed(2)}</p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#1D4ED8" }}>CTR</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>{aCtr.toFixed(2)}%</p>
                    </div>
                    <div style={{ backgroundColor: "#F5F3FF", borderRadius: "10px", padding: "14px", textAlign: "center", border: "1px solid #DDD6FE" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#7C3AED" }}>CPM</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#7C3AED" }}>${aCpm.toFixed(2)}</p>
                    </div>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "14px", textAlign: "center", border: "1px solid #FCD34D" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#92400E" }}>CPA</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>${aCpa.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Conversion & ROI */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.8rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#6B7280" }}>Conv. Rate:</span>
                        <strong>{aConversionRate.toFixed(2)}%</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#6B7280" }}>ROAS:</span>
                        <strong style={{ color: aRoas >= 100 ? "#059669" : "#DC2626" }}>{aRoas.toFixed(0)}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Profit/Loss */}
                  <div style={{
                    backgroundColor: aProfit >= 0 ? "#ECFDF5" : "#FEE2E2",
                    borderRadius: "10px",
                    padding: "14px",
                    textAlign: "center",
                    border: `1px solid ${aProfit >= 0 ? "#6EE7B7" : "#FECACA"}`
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: aProfit >= 0 ? "#065F46" : "#991B1B" }}>
                      {aProfit >= 0 ? "💰 Profit" : "📉 Loss"}
                    </p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: aProfit >= 0 ? "#059669" : "#DC2626" }}>
                      {aProfit >= 0 ? "+" : ""}${aProfit.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Platform Benchmarks Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Average CPC by Platform (2025)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Platform</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Avg. CPC</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Avg. CTR</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {platformBenchmarks.map((p, idx) => (
                  <tr key={p.platform} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>
                      <span style={{ marginRight: "8px" }}>{p.icon}</span>{p.platform}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>${p.cpc.toFixed(2)}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB" }}>{p.ctr.toFixed(2)}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280", fontSize: "0.8rem" }}>
                      {p.platform === "Google Search" && "High-intent traffic"}
                      {p.platform === "Google Display" && "Brand awareness"}
                      {p.platform === "Facebook Ads" && "B2C targeting"}
                      {p.platform === "Instagram Ads" && "Visual products"}
                      {p.platform === "LinkedIn Ads" && "B2B leads"}
                      {p.platform === "Amazon Ads" && "Product sales"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Industry Benchmarks Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💼 Average CPC by Industry (Google Ads)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F3FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Industry</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Avg. CPC</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Avg. CTR</th>
                </tr>
              </thead>
              <tbody>
                {industryBenchmarks.map((ind, idx) => (
                  <tr key={ind.industry} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{ind.industry}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#7C3AED", fontWeight: "600" }}>${ind.cpc.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{ind.ctr.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💰 Understanding CPC (Cost Per Click)</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>CPC (Cost Per Click)</strong> is a digital advertising metric that measures how much you pay each time someone clicks on your ad. 
                  It&apos;s one of the most important metrics for PPC (Pay-Per-Click) advertising campaigns on platforms like Google Ads, Facebook, and Amazon.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Advertising Metrics</h3>
                
                <p><strong>CPC (Cost Per Click):</strong> Total Ad Spend ÷ Total Clicks. Measures cost efficiency of driving traffic.</p>
                <p><strong>CTR (Click-Through Rate):</strong> (Clicks ÷ Impressions) × 100. Measures ad relevance and appeal.</p>
                <p><strong>CPM (Cost Per Mille):</strong> (Ad Spend ÷ Impressions) × 1000. Cost per thousand impressions.</p>
                <p><strong>CPA (Cost Per Acquisition):</strong> Ad Spend ÷ Conversions. Cost to acquire a customer.</p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How to Lower Your CPC</h3>
                <ol style={{ paddingLeft: "20px" }}>
                  <li>Improve Quality Score with relevant ads and landing pages</li>
                  <li>Use long-tail keywords with less competition</li>
                  <li>Add negative keywords to avoid irrelevant clicks</li>
                  <li>Improve CTR with compelling ad copy</li>
                  <li>Test different bidding strategies</li>
                  <li>Target specific audiences for better relevance</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Formulas Reference */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>📐 Quick Formulas</h3>
              <div style={{ fontSize: "0.85rem", color: "#7C3AED", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>CPC</strong> = Spend ÷ Clicks</p>
                <p style={{ margin: 0 }}><strong>CTR</strong> = (Clicks ÷ Impr.) × 100</p>
                <p style={{ margin: 0 }}><strong>CPM</strong> = (Spend ÷ Impr.) × 1000</p>
                <p style={{ margin: 0 }}><strong>CPA</strong> = Spend ÷ Conversions</p>
                <p style={{ margin: 0 }}><strong>ROAS</strong> = Revenue ÷ Spend</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Quick Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ Higher CTR = Lower CPC</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Quality Score impacts costs</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Long-tail keywords cost less</p>
                <p style={{ margin: 0 }}>✓ Test ads to find winners</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/cpc-calculator" currentCategory="Marketing" />
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
            💰 <strong>Disclaimer:</strong> This calculator provides estimates based on industry benchmarks. 
            Actual CPC, CTR, and other metrics vary by industry, competition, targeting, ad quality, and platform algorithms. 
            Benchmark data sourced from industry reports and may not reflect current market conditions.
          </p>
        </div>
      </div>
    </div>
  );
}