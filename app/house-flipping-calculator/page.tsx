"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Quick reference data
const quickReference = [
  { arv: 200000, rehab: 30000 },
  { arv: 250000, rehab: 40000 },
  { arv: 300000, rehab: 50000 },
  { arv: 400000, rehab: 60000 },
  { arv: 500000, rehab: 75000 },
  { arv: 600000, rehab: 90000 },
];

// FAQ data
const faqs = [
  {
    question: "What is the 70% rule in house flipping?",
    answer: "The 70% rule is a guideline that states investors should pay no more than 70% of a property's After Repair Value (ARV) minus repair costs. For example, if a home's ARV is $300,000 and needs $50,000 in repairs, the maximum purchase price should be ($300,000 × 70%) - $50,000 = $160,000. The 30% margin covers holding costs, selling costs, and profit."
  },
  {
    question: "How to calculate house flip profit?",
    answer: "House flip profit = Sale Price - (Purchase Price + Buying Costs + Rehab Costs + Holding Costs + Selling Costs). Buying costs include closing costs and inspections (2-5% of purchase). Holding costs include mortgage interest, taxes, insurance, and utilities. Selling costs include agent commission and closing costs (6-9% of sale price)."
  },
  {
    question: "How much does it cost to flip a 2000 sq ft house?",
    answer: "Flipping a 2,000 sq ft house typically costs $30,000-$120,000+ for renovations depending on the scope: Light rehab ($15-30/sq ft) = $30,000-$60,000, Medium rehab ($30-60/sq ft) = $60,000-$120,000, Heavy rehab ($60-100/sq ft) = $120,000-$200,000. Add 10-20% contingency for unexpected issues."
  },
  {
    question: "What is a good ROI for flipping houses?",
    answer: "Most experienced flippers target 15-25% ROI to justify the time, effort, and risk. ROI below 10-15% may not be worth pursuing. Excellent deals can achieve 25-35%+ ROI. Remember that ROI doesn't account for your time investment—if a flip takes 200 hours and nets $40,000, that's $200/hour for your work."
  },
  {
    question: "How long does it take to flip a house?",
    answer: "Most house flips take 3-6 months from purchase to sale. Timeline breakdown: Finding/closing on property (1-2 months), Renovations (1-3 months), Listing and selling (1-2 months). Every extra month increases holding costs by $1,000-$3,000+, so speed is critical for profitability."
  },
  {
    question: "Do I need an LLC to flip houses?",
    answer: "An LLC is not legally required but highly recommended. Benefits include: liability protection (personal assets are protected), tax advantages, professional credibility, and easier access to financing. Most successful flippers operate through an LLC. Consult with a real estate attorney and accountant for your specific situation."
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

export default function HouseFlippingCalculator() {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState<string>("150000");
  const [arv, setArv] = useState<string>("250000");
  const [rehabCosts, setRehabCosts] = useState<string>("40000");
  const [holdingMonths, setHoldingMonths] = useState<string>("4");
  
  // Financing
  const [useFinancing, setUseFinancing] = useState<boolean>(false);
  const [downPayment, setDownPayment] = useState<string>("20");
  const [interestRate, setInterestRate] = useState<string>("12");
  const [loanPoints, setLoanPoints] = useState<string>("2");
  
  // Cost percentages
  const [buyingCostPercent] = useState<number>(3);
  const [sellingCostPercent] = useState<number>(8);
  const [monthlyHoldingCost, setMonthlyHoldingCost] = useState<string>("1500");
  
  // Results
  const [results, setResults] = useState({
    maxPurchase70: 0,
    passes70Rule: false,
    buyingCosts: 0,
    totalRehabWithContingency: 0,
    holdingCosts: 0,
    financingCosts: 0,
    sellingCosts: 0,
    totalInvestment: 0,
    netProfit: 0,
    roi: 0,
    cashNeeded: 0,
    cashOnCash: 0,
  });

  // Calculate
  useEffect(() => {
    const purchase = parseFloat(purchasePrice) || 0;
    const afterRepairValue = parseFloat(arv) || 0;
    const rehab = parseFloat(rehabCosts) || 0;
    const months = parseFloat(holdingMonths) || 0;
    const monthlyHolding = parseFloat(monthlyHoldingCost) || 0;
    
    // 70% Rule calculation
    const maxPurchase70 = (afterRepairValue * 0.70) - rehab;
    const passes70Rule = purchase <= maxPurchase70;
    
    // Buying costs
    const buyingCosts = purchase * (buyingCostPercent / 100);
    
    // Rehab with 10% contingency
    const totalRehabWithContingency = rehab * 1.10;
    
    // Holding costs
    const baseHoldingCosts = monthlyHolding * months;
    
    // Financing costs
    let financingCosts = 0;
    let cashNeeded = 0;
    
    if (useFinancing) {
      const dp = parseFloat(downPayment) || 20;
      const rate = parseFloat(interestRate) || 12;
      const points = parseFloat(loanPoints) || 2;
      
      const loanAmount = purchase * (1 - dp / 100);
      const monthlyInterest = loanAmount * (rate / 100) / 12;
      const totalInterest = monthlyInterest * months;
      const pointsCost = loanAmount * (points / 100);
      
      financingCosts = totalInterest + pointsCost;
      cashNeeded = (purchase * dp / 100) + buyingCosts + totalRehabWithContingency + baseHoldingCosts + pointsCost;
    } else {
      cashNeeded = purchase + buyingCosts + totalRehabWithContingency + baseHoldingCosts;
    }
    
    const holdingCosts = baseHoldingCosts + financingCosts;
    
    // Selling costs
    const sellingCosts = afterRepairValue * (sellingCostPercent / 100);
    
    // Total investment
    const totalInvestment = purchase + buyingCosts + totalRehabWithContingency + holdingCosts + sellingCosts;
    
    // Net profit
    const netProfit = afterRepairValue - totalInvestment;
    
    // ROI
    const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
    
    // Cash on Cash return
    const cashOnCash = cashNeeded > 0 ? (netProfit / cashNeeded) * 100 : 0;
    
    setResults({
      maxPurchase70,
      passes70Rule,
      buyingCosts,
      totalRehabWithContingency,
      holdingCosts,
      financingCosts,
      sellingCosts,
      totalInvestment,
      netProfit,
      roi,
      cashNeeded,
      cashOnCash,
    });
  }, [purchasePrice, arv, rehabCosts, holdingMonths, useFinancing, downPayment, interestRate, loanPoints, buyingCostPercent, sellingCostPercent, monthlyHoldingCost]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // ROI Rating
  const getRoiRating = (roi: number): { label: string; color: string; bg: string; emoji: string } => {
    if (roi >= 25) return { label: "Excellent", color: "#059669", bg: "#ECFDF5", emoji: "💎" };
    if (roi >= 15) return { label: "Good", color: "#16A34A", bg: "#F0FDF4", emoji: "🟢" };
    if (roi >= 10) return { label: "Fair", color: "#CA8A04", bg: "#FEFCE8", emoji: "🟡" };
    return { label: "Poor", color: "#DC2626", bg: "#FEF2F2", emoji: "🔴" };
  };

  const roiRating = getRoiRating(results.roi);

  // Calculate for quick reference
  const calculate70Rule = (arvVal: number, rehabVal: number): number => {
    return (arvVal * 0.70) - rehabVal;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>House Flipping Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              House Flipping Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate fix and flip profits, ROI, and verify the 70% rule. Analyze your house flipping deal with detailed cost breakdown.
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
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Deal Analysis */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📊 Deal Analysis
                  </h3>

                  {/* Purchase Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Purchase Price
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* ARV */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      After Repair Value (ARV)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                      <input
                        type="number"
                        value={arv}
                        onChange={(e) => setArv(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Rehab Costs */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Estimated Rehab Costs
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                      <input
                        type="number"
                        value={rehabCosts}
                        onChange={(e) => setRehabCosts(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                      +10% contingency will be added automatically
                    </p>
                  </div>

                  {/* Holding Period */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Holding Period (Months)
                    </label>
                    <input
                      type="number"
                      value={holdingMonths}
                      onChange={(e) => setHoldingMonths(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "600"
                      }}
                      min="1"
                      max="24"
                    />
                  </div>

                  {/* Monthly Holding Costs */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Monthly Holding Costs (Tax, Insurance, Utilities)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontWeight: "500" }}>$</span>
                      <input
                        type="number"
                        value={monthlyHoldingCost}
                        onChange={(e) => setMonthlyHoldingCost(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Financing Options */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    💰 Financing
                  </h3>
                  
                  <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                    <button
                      onClick={() => setUseFinancing(false)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: !useFinancing ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: !useFinancing ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>💵</span>
                      <p style={{ fontWeight: "600", color: !useFinancing ? "#059669" : "#374151", margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                        Cash Purchase
                      </p>
                    </button>
                    <button
                      onClick={() => setUseFinancing(true)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: useFinancing ? "2px solid #D97706" : "1px solid #E5E7EB",
                        backgroundColor: useFinancing ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>🏦</span>
                      <p style={{ fontWeight: "600", color: useFinancing ? "#D97706" : "#374151", margin: "4px 0 0 0", fontSize: "0.85rem" }}>
                        Hard Money Loan
                      </p>
                    </button>
                  </div>

                  {useFinancing && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                          Down Payment %
                        </label>
                        <input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "0.9rem"
                          }}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                          Interest Rate %
                        </label>
                        <input
                          type="number"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "0.9rem"
                          }}
                          min="0"
                          max="30"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                          Points %
                        </label>
                        <input
                          type="number"
                          value={loanPoints}
                          onChange={(e) => setLoanPoints(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "0.9rem"
                          }}
                          min="0"
                          max="10"
                          step="0.5"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div>
                {/* 70% Rule Check */}
                <div style={{
                  backgroundColor: results.passes70Rule ? "#ECFDF5" : "#FEF2F2",
                  padding: "20px",
                  borderRadius: "12px",
                  border: `2px solid ${results.passes70Rule ? "#A7F3D0" : "#FECACA"}`,
                  marginBottom: "20px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "8px" }}>
                    {results.passes70Rule ? "✅" : "❌"}
                  </div>
                  <p style={{ 
                    fontSize: "1.25rem", 
                    fontWeight: "bold", 
                    color: results.passes70Rule ? "#059669" : "#DC2626",
                    margin: "0 0 8px 0"
                  }}>
                    70% Rule: {results.passes70Rule ? "PASS" : "FAIL"}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Max Purchase: {formatCurrency(results.maxPurchase70)}
                  </p>
                  {!results.passes70Rule && (
                    <p style={{ fontSize: "0.8rem", color: "#DC2626", margin: "8px 0 0 0" }}>
                      You&apos;re paying {formatCurrency((parseFloat(purchasePrice) || 0) - results.maxPurchase70)} over the recommended price
                    </p>
                  )}
                </div>

                {/* Main Results */}
                <div style={{
                  backgroundColor: results.netProfit >= 0 ? "#059669" : "#DC2626",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Net Profit
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 12px 0" }}>
                    {formatCurrency(results.netProfit)}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: "0 0 2px 0" }}>ROI</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "white", margin: 0 }}>{results.roi.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: "0 0 2px 0" }}>Cash Needed</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "white", margin: 0 }}>{formatCurrency(results.cashNeeded)}</p>
                    </div>
                  </div>
                </div>

                {/* ROI Rating */}
                <div style={{
                  backgroundColor: roiRating.bg,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: "0.9rem", color: "#374151" }}>Deal Rating:</span>
                  <span style={{ fontSize: "1rem", fontWeight: "600", color: roiRating.color }}>
                    {roiRating.emoji} {roiRating.label} ({results.roi.toFixed(1)}% ROI)
                  </span>
                </div>

                {/* Cost Breakdown */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px", fontSize: "0.95rem" }}>
                    📋 Cost Breakdown
                  </h4>
                  <div style={{ display: "grid", gap: "8px", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280" }}>Purchase Price</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(parseFloat(purchasePrice) || 0)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280" }}>+ Buying Costs ({buyingCostPercent}%)</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(results.buyingCosts)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280" }}>+ Rehab (+10% contingency)</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(results.totalRehabWithContingency)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280" }}>+ Holding Costs ({holdingMonths} mo)</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(results.holdingCosts)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#6B7280" }}>+ Selling Costs ({sellingCostPercent}%)</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(results.sellingCosts)}</span>
                    </div>
                    <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: "8px", marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Total Investment</span>
                        <span style={{ fontWeight: "700", color: "#DC2626" }}>{formatCurrency(results.totalInvestment)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "600", color: "#374151" }}>Sale Price (ARV)</span>
                      <span style={{ fontWeight: "700", color: "#059669" }}>{formatCurrency(parseFloat(arv) || 0)}</span>
                    </div>
                    <div style={{ borderTop: "2px solid #059669", paddingTop: "8px", marginTop: "4px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "700", color: "#111827" }}>NET PROFIT</span>
                        <span style={{ fontWeight: "700", color: results.netProfit >= 0 ? "#059669" : "#DC2626", fontSize: "1.1rem" }}>
                          {formatCurrency(results.netProfit)}
                        </span>
                      </div>
                    </div>
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
            📊 70% Rule Quick Reference
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Maximum purchase price based on ARV and estimated rehab costs
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>ARV</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Rehab Costs</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>Max Purchase (70%)</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Est. Profit*</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const maxPurchase = calculate70Rule(row.arv, row.rehab);
                  const estProfit = row.arv * 0.15; // ~15% of ARV as rough profit
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                        {formatCurrency(row.arv)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>
                        {formatCurrency(row.rehab)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>
                        {formatCurrency(maxPurchase)}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#D97706" }}>
                        {formatCurrency(estProfit - row.arv * 0.05)} - {formatCurrency(estProfit + row.arv * 0.05)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            * Estimated profit assumes buying at 70% rule price with typical holding and selling costs. Actual results vary.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* 70% Rule Explained */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 The 70% Rule Explained
              </h2>
              <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "16px" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: "600", color: "#111827", marginBottom: "8px", fontFamily: "monospace" }}>
                  Max Purchase = (ARV × 70%) - Repair Costs
                </p>
                <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                  The 30% margin covers: closing costs, holding costs, selling costs, and your profit.
                </p>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ backgroundColor: "#ECFDF5", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600", color: "#059669" }}>Example</span>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    ARV = $300,000, Repairs = $50,000 → Max Purchase = ($300,000 × 70%) - $50,000 = <strong>$160,000</strong>
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ backgroundColor: "#FEF3C7", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "600", color: "#D97706" }}>Note</span>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", margin: 0 }}>
                    In competitive markets, some investors adjust to 75-80%, but this increases risk. Beginners should stick to 70% or lower.
                  </p>
                </div>
              </div>
            </div>

            {/* Rehab Cost Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🔧 Rehab Cost Guide
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "#065F46" }}>Light Rehab</span>
                    <span style={{ fontWeight: "600", color: "#059669" }}>$15-$30/sq ft</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#047857", margin: 0 }}>
                    Cosmetic updates: paint, flooring, fixtures, landscaping
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "#92400E" }}>Medium Rehab</span>
                    <span style={{ fontWeight: "600", color: "#D97706" }}>$30-$60/sq ft</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#A16207", margin: 0 }}>
                    Kitchen/bath remodel, HVAC, electrical updates, roof repair
                  </p>
                </div>
                <div style={{ backgroundColor: "#FEF2F2", padding: "16px", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontWeight: "600", color: "#991B1B" }}>Heavy Rehab</span>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>$60-$100+/sq ft</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#B91C1C", margin: 0 }}>
                    Structural work, foundation, full gut renovation, additions
                  </p>
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
                💡 Always add 10-20% contingency for unexpected issues
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Tips */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Flip Success Tips
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Buy Right:</strong> Profit is made at purchase
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Know ARV:</strong> Study comps within 0.5 miles
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Move Fast:</strong> Time = money in holding costs
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Build Team:</strong> Reliable contractors are key
                  </p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#374151", margin: 0 }}>
                    <strong>Keep Reserves:</strong> 20-30% for surprises
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Guide */}
            <div style={{
              backgroundColor: "#F9FAFB",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #E5E7EB"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
                📈 ROI Guidelines
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem" }}>💎 Excellent</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#059669" }}>25%+</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem" }}>🟢 Good</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#16A34A" }}>15-25%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem" }}>🟡 Fair</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#CA8A04" }}>10-15%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem" }}>🔴 Poor</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#DC2626" }}>&lt;10%</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/house-flipping-calculator"
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

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. Actual profits depend on market conditions, accurate ARV assessment, rehab quality, and many other factors. Always conduct thorough due diligence and consult with real estate professionals before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
