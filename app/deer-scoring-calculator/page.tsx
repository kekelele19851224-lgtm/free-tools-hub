"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// B&C Minimum Entry Scores
const recordBookMinimums = {
  whitetail: {
    typical: { allTime: 170, awards: 160, popeYoung: 125 },
    nonTypical: { allTime: 195, awards: 185, popeYoung: 155 }
  },
  mule: {
    typical: { allTime: 190, awards: 180, popeYoung: 145 },
    nonTypical: { allTime: 230, awards: 215, popeYoung: 165 }
  }
};

// FAQ data
const faqs = [
  {
    question: "How do you score a deer using Boone and Crockett?",
    answer: "To score a deer using the Boone and Crockett (B&C) system: 1) Measure the inside spread between main beams, 2) Measure both main beam lengths from burr to tip, 3) Measure all normal point lengths (G1-G7), 4) Measure four circumferences (H1-H4) on each antler. Add all measurements for the gross score. For net score, subtract the differences between left and right side measurements. Use a flexible steel tape and measure to the nearest 1/8 inch."
  },
  {
    question: "What is a good score for a whitetail deer?",
    answer: "For whitetail deer: 100-120\" is a mature buck most hunters would be proud of. 125-139\" is an excellent buck that qualifies for Pope & Young records. 140-159\" is a trophy-class buck. 160-169\" qualifies for B&C Awards. 170\"+ makes the B&C All-Time records. Bucks scoring 180\"+ are exceptional and rare. The average mature whitetail buck scores around 100-115 inches."
  },
  {
    question: "What is the difference between gross and net score?",
    answer: "Gross score is the total of all antler measurements added together - inside spread, main beams, all point lengths, and circumferences. Net score (also called 'typical' score) subtracts deductions for asymmetry between left and right antlers, plus any abnormal points. The B&C record book uses net scores. Many hunters prefer gross scores since 'nets are for fishermen' - the gross score better represents the total antler mass regardless of symmetry."
  },
  {
    question: "How do you measure deer antler points?",
    answer: "To measure antler points: Start at the top of the main beam where the point emerges. Stretch your tape along the outer curve of the point to its tip. A point must be at least 1 inch long to count, and at some location at least 1 inch from the tip, the length must exceed the width. The main beam tip counts as a point but is not measured separately. Measure to the nearest 1/8 inch."
  },
  {
    question: "What is the minimum score for Boone and Crockett record book?",
    answer: "B&C minimums for whitetail: 170\" net typical for All-Time records, 160\" for Awards (3-year). Non-typical whitetail: 195\" All-Time, 185\" Awards. For mule deer: 190\" typical All-Time, 180\" Awards. Non-typical mule deer: 230\" All-Time, 215\" Awards. Pope & Young (bowhunting) has lower minimums: 125\" typical whitetail, 145\" typical mule deer."
  },
  {
    question: "How do you score a non-typical buck?",
    answer: "Non-typical bucks are scored the same as typical bucks, but abnormal points ADD to the score instead of being deducted. First calculate the typical frame score (with deductions for asymmetry). Then add the total length of all abnormal points. Abnormal points include: points growing from the bottom or side of the main beam, points growing from other points, extra points beyond the normal typical frame, and any point not matching the classic typical antler configuration."
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

// Helper function to convert decimal to fraction string
function toFraction(decimal: number): string {
  const whole = Math.floor(decimal);
  const frac = decimal - whole;
  
  if (frac < 0.0625) return whole > 0 ? `${whole}` : "0";
  if (frac < 0.1875) return whole > 0 ? `${whole} 1/8` : "1/8";
  if (frac < 0.3125) return whole > 0 ? `${whole} 2/8` : "2/8";
  if (frac < 0.4375) return whole > 0 ? `${whole} 3/8` : "3/8";
  if (frac < 0.5625) return whole > 0 ? `${whole} 4/8` : "4/8";
  if (frac < 0.6875) return whole > 0 ? `${whole} 5/8` : "5/8";
  if (frac < 0.8125) return whole > 0 ? `${whole} 6/8` : "6/8";
  if (frac < 0.9375) return whole > 0 ? `${whole} 7/8` : "7/8";
  return `${whole + 1}`;
}

export default function DeerScoringCalculator() {
  const [activeTab, setActiveTab] = useState<'whitetail' | 'mule' | 'quick'>('whitetail');
  const [scoreType, setScoreType] = useState<'typical' | 'nonTypical'>('typical');
  
  // Spread measurements
  const [insideSpread, setInsideSpread] = useState<string>("18");
  
  // Main beam lengths
  const [leftMainBeam, setLeftMainBeam] = useState<string>("24");
  const [rightMainBeam, setRightMainBeam] = useState<string>("24");
  
  // Point lengths (G1-G7)
  const [leftG1, setLeftG1] = useState<string>("4");
  const [rightG1, setRightG1] = useState<string>("4");
  const [leftG2, setLeftG2] = useState<string>("10");
  const [rightG2, setRightG2] = useState<string>("10");
  const [leftG3, setLeftG3] = useState<string>("9");
  const [rightG3, setRightG3] = useState<string>("9");
  const [leftG4, setLeftG4] = useState<string>("7");
  const [rightG4, setRightG4] = useState<string>("7");
  const [leftG5, setLeftG5] = useState<string>("0");
  const [rightG5, setRightG5] = useState<string>("0");
  const [leftG6, setLeftG6] = useState<string>("0");
  const [rightG6, setRightG6] = useState<string>("0");
  const [leftG7, setLeftG7] = useState<string>("0");
  const [rightG7, setRightG7] = useState<string>("0");
  
  // Circumferences (H1-H4)
  const [leftH1, setLeftH1] = useState<string>("4.5");
  const [rightH1, setRightH1] = useState<string>("4.5");
  const [leftH2, setLeftH2] = useState<string>("4");
  const [rightH2, setRightH2] = useState<string>("4");
  const [leftH3, setLeftH3] = useState<string>("4");
  const [rightH3, setRightH3] = useState<string>("4");
  const [leftH4, setLeftH4] = useState<string>("3.5");
  const [rightH4, setRightH4] = useState<string>("3.5");
  
  // Abnormal points
  const [abnormalPoints, setAbnormalPoints] = useState<string>("0");
  
  // Quick estimator inputs
  const [quickPoints, setQuickPoints] = useState<string>("8");
  const [quickSpread, setQuickSpread] = useState<string>("18");
  const [quickBeamLength, setQuickBeamLength] = useState<string>("24");
  const [quickTineLength, setQuickTineLength] = useState<string>("8");
  const [quickMass, setQuickMass] = useState<'light' | 'medium' | 'heavy'>('medium');

  // Calculate scores
  const scoreResults = useMemo(() => {
    const spread = parseFloat(insideSpread) || 0;
    const lBeam = parseFloat(leftMainBeam) || 0;
    const rBeam = parseFloat(rightMainBeam) || 0;
    
    // Spread credit (cannot exceed longer main beam)
    const spreadCredit = Math.min(spread, Math.max(lBeam, rBeam));
    
    // Points
    const lG1 = parseFloat(leftG1) || 0;
    const rG1 = parseFloat(rightG1) || 0;
    const lG2 = parseFloat(leftG2) || 0;
    const rG2 = parseFloat(rightG2) || 0;
    const lG3 = parseFloat(leftG3) || 0;
    const rG3 = parseFloat(rightG3) || 0;
    const lG4 = parseFloat(leftG4) || 0;
    const rG4 = parseFloat(rightG4) || 0;
    const lG5 = parseFloat(leftG5) || 0;
    const rG5 = parseFloat(rightG5) || 0;
    const lG6 = parseFloat(leftG6) || 0;
    const rG6 = parseFloat(rightG6) || 0;
    const lG7 = parseFloat(leftG7) || 0;
    const rG7 = parseFloat(rightG7) || 0;
    
    // Circumferences
    const lH1 = parseFloat(leftH1) || 0;
    const rH1 = parseFloat(rightH1) || 0;
    const lH2 = parseFloat(leftH2) || 0;
    const rH2 = parseFloat(rightH2) || 0;
    const lH3 = parseFloat(leftH3) || 0;
    const rH3 = parseFloat(rightH3) || 0;
    const lH4 = parseFloat(leftH4) || 0;
    const rH4 = parseFloat(rightH4) || 0;
    
    const abnormal = parseFloat(abnormalPoints) || 0;
    
    // Column totals
    const leftTotal = lBeam + lG1 + lG2 + lG3 + lG4 + lG5 + lG6 + lG7 + lH1 + lH2 + lH3 + lH4;
    const rightTotal = rBeam + rG1 + rG2 + rG3 + rG4 + rG5 + rG6 + rG7 + rH1 + rH2 + rH3 + rH4;
    
    // Deductions (differences)
    const beamDiff = Math.abs(lBeam - rBeam);
    const g1Diff = Math.abs(lG1 - rG1);
    const g2Diff = Math.abs(lG2 - rG2);
    const g3Diff = Math.abs(lG3 - rG3);
    const g4Diff = Math.abs(lG4 - rG4);
    const g5Diff = Math.abs(lG5 - rG5);
    const g6Diff = Math.abs(lG6 - rG6);
    const g7Diff = Math.abs(lG7 - rG7);
    const h1Diff = Math.abs(lH1 - rH1);
    const h2Diff = Math.abs(lH2 - rH2);
    const h3Diff = Math.abs(lH3 - rH3);
    const h4Diff = Math.abs(lH4 - rH4);
    
    const totalDeductions = beamDiff + g1Diff + g2Diff + g3Diff + g4Diff + g5Diff + g6Diff + g7Diff + h1Diff + h2Diff + h3Diff + h4Diff;
    
    // Gross score
    const grossScore = spreadCredit + leftTotal + rightTotal + abnormal;
    
    // Net typical score (deduct differences AND abnormal points)
    const netTypicalScore = grossScore - totalDeductions - abnormal;
    
    // Net non-typical score (deduct differences but ADD abnormal points)
    const netNonTypicalScore = grossScore - totalDeductions;
    
    // Count points (only those >= 1 inch)
    let leftPoints = 0;
    let rightPoints = 0;
    if (lG1 >= 1) leftPoints++;
    if (lG2 >= 1) leftPoints++;
    if (lG3 >= 1) leftPoints++;
    if (lG4 >= 1) leftPoints++;
    if (lG5 >= 1) leftPoints++;
    if (lG6 >= 1) leftPoints++;
    if (lG7 >= 1) leftPoints++;
    leftPoints++; // beam tip counts
    
    if (rG1 >= 1) rightPoints++;
    if (rG2 >= 1) rightPoints++;
    if (rG3 >= 1) rightPoints++;
    if (rG4 >= 1) rightPoints++;
    if (rG5 >= 1) rightPoints++;
    if (rG6 >= 1) rightPoints++;
    if (rG7 >= 1) rightPoints++;
    rightPoints++; // beam tip counts
    
    return {
      spreadCredit,
      leftTotal,
      rightTotal,
      totalDeductions,
      grossScore,
      netTypicalScore,
      netNonTypicalScore,
      leftPoints,
      rightPoints,
      abnormal
    };
  }, [insideSpread, leftMainBeam, rightMainBeam, leftG1, rightG1, leftG2, rightG2, leftG3, rightG3, leftG4, rightG4, leftG5, rightG5, leftG6, rightG6, leftG7, rightG7, leftH1, rightH1, leftH2, rightH2, leftH3, rightH3, leftH4, rightH4, abnormalPoints]);

  // Quick estimator calculation
  const quickEstimate = useMemo(() => {
    const points = parseInt(quickPoints) || 8;
    const spread = parseFloat(quickSpread) || 18;
    const beam = parseFloat(quickBeamLength) || 24;
    const tine = parseFloat(quickTineLength) || 8;
    const massMultiplier = quickMass === 'light' ? 0.85 : quickMass === 'heavy' ? 1.15 : 1.0;
    
    // Estimation formula based on typical correlations
    const estimatedScore = (spread + (beam * 2) + (tine * (points - 2)) + (points * 3.5)) * massMultiplier;
    const lowEstimate = estimatedScore * 0.9;
    const highEstimate = estimatedScore * 1.1;
    
    return {
      low: Math.round(lowEstimate),
      mid: Math.round(estimatedScore),
      high: Math.round(highEstimate)
    };
  }, [quickPoints, quickSpread, quickBeamLength, quickTineLength, quickMass]);

  // Check record book eligibility
  const getEligibility = (score: number, deerType: 'whitetail' | 'mule', typical: boolean) => {
    const mins = recordBookMinimums[deerType][typical ? 'typical' : 'nonTypical'];
    return {
      bcAllTime: score >= mins.allTime,
      bcAwards: score >= mins.awards,
      popeYoung: score >= mins.popeYoung,
      minimums: mins
    };
  };

  const currentScore = scoreType === 'typical' ? scoreResults.netTypicalScore : scoreResults.netNonTypicalScore;
  const deerType = activeTab === 'mule' ? 'mule' : 'whitetail';
  const eligibility = getEligibility(currentScore, deerType, scoreType === 'typical');

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Deer Scoring Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🦌</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Deer Scoring Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free Boone and Crockett scoring calculator for whitetail and mule deer. Calculate gross &amp; net scores, 
            check record book eligibility, and get visual measurement guides.
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
            <span style={{ fontSize: "1.5rem" }}>🎯</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
                B&amp;C Minimum Scores: Whitetail <strong>170&quot;</strong> (typical) | Mule Deer <strong>190&quot;</strong> (typical)
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Pope &amp; Young: Whitetail 125&quot; | Mule Deer 145&quot; • Most mature bucks score 100-140&quot;
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
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>Boone &amp; Crockett System</span>
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
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Gross &amp; Net Scores</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EFF6FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #93C5FD"
          }}>
            <span>✓</span>
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>Record Book Check</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("whitetail")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "whitetail" ? "#166534" : "#E5E7EB",
              color: activeTab === "whitetail" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🦌 Whitetail Deer
          </button>
          <button
            onClick={() => setActiveTab("mule")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "mule" ? "#166534" : "#E5E7EB",
              color: activeTab === "mule" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🫎 Mule Deer
          </button>
          <button
            onClick={() => setActiveTab("quick")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "quick" ? "#166534" : "#E5E7EB",
              color: activeTab === "quick" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ⚡ Quick Estimator
          </button>
        </div>

        {/* Full Calculator (Whitetail/Mule) */}
        {(activeTab === "whitetail" || activeTab === "mule") && (
          <>
            {/* Score Type Toggle */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setScoreType("typical")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: scoreType === "typical" ? "2px solid #166534" : "1px solid #E5E7EB",
                    backgroundColor: scoreType === "typical" ? "#ECFDF5" : "white",
                    cursor: "pointer",
                    fontWeight: scoreType === "typical" ? "600" : "normal",
                    color: scoreType === "typical" ? "#166534" : "#374151"
                  }}
                >
                  Typical
                </button>
                <button
                  onClick={() => setScoreType("nonTypical")}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: scoreType === "nonTypical" ? "2px solid #166534" : "1px solid #E5E7EB",
                    backgroundColor: scoreType === "nonTypical" ? "#ECFDF5" : "white",
                    cursor: "pointer",
                    fontWeight: scoreType === "nonTypical" ? "600" : "normal",
                    color: scoreType === "nonTypical" ? "#166534" : "#374151"
                  }}
                >
                  Non-Typical
                </button>
              </div>
            </div>

            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              {/* Input Panel */}
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #E5E7EB",
                overflow: "hidden"
              }}>
                <div style={{ backgroundColor: "#166534", padding: "16px 24px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                    📏 Antler Measurements
                  </h2>
                </div>

                <div style={{ padding: "24px" }}>
                  {/* Inside Spread */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      D. Inside Spread of Main Beams
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.125"
                        value={insideSpread}
                        onChange={(e) => setInsideSpread(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "2px solid #166534",
                          fontSize: "1rem",
                          backgroundColor: "#ECFDF5",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>inches</span>
                    </div>
                  </div>

                  {/* Main Beams */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      F. Length of Main Beams
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Left</label>
                        <input
                          type="number"
                          step="0.125"
                          value={leftMainBeam}
                          onChange={(e) => setLeftMainBeam(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #D1D5DB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Right</label>
                        <input
                          type="number"
                          step="0.125"
                          value={rightMainBeam}
                          onChange={(e) => setRightMainBeam(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #D1D5DB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Point Lengths G1-G4 */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      G. Length of Normal Points (inches)
                    </label>
                    
                    {/* G1 - Brow Tine */}
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G1 (Brow Tine)</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input type="number" step="0.125" value={leftG1} onChange={(e) => setLeftG1(e.target.value)} placeholder="Left" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        <input type="number" step="0.125" value={rightG1} onChange={(e) => setRightG1(e.target.value)} placeholder="Right" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    {/* G2 */}
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G2</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input type="number" step="0.125" value={leftG2} onChange={(e) => setLeftG2(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        <input type="number" step="0.125" value={rightG2} onChange={(e) => setRightG2(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    {/* G3 */}
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G3</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input type="number" step="0.125" value={leftG3} onChange={(e) => setLeftG3(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        <input type="number" step="0.125" value={rightG3} onChange={(e) => setRightG3(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>
                    
                    {/* G4 */}
                    <div style={{ marginBottom: "8px" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G4</label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <input type="number" step="0.125" value={leftG4} onChange={(e) => setLeftG4(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        <input type="number" step="0.125" value={rightG4} onChange={(e) => setRightG4(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    </div>

                    {/* G5-G7 (collapsible or optional) */}
                    <details style={{ marginTop: "8px" }}>
                      <summary style={{ cursor: "pointer", fontSize: "0.85rem", color: "#6B7280" }}>+ More points (G5-G7)</summary>
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ marginBottom: "8px" }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G5</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <input type="number" step="0.125" value={leftG5} onChange={(e) => setLeftG5(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                            <input type="number" step="0.125" value={rightG5} onChange={(e) => setRightG5(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                          </div>
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G6</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <input type="number" step="0.125" value={leftG6} onChange={(e) => setLeftG6(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                            <input type="number" step="0.125" value={rightG6} onChange={(e) => setRightG6(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>G7</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            <input type="number" step="0.125" value={leftG7} onChange={(e) => setLeftG7(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                            <input type="number" step="0.125" value={rightG7} onChange={(e) => setRightG7(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* Circumferences H1-H4 */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      H. Circumferences (at narrowest point between tines)
                    </label>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>Left</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>Right</div>
                    </div>
                    
                    {[
                      { label: "H1", left: leftH1, setLeft: setLeftH1, right: rightH1, setRight: setRightH1 },
                      { label: "H2", left: leftH2, setLeft: setLeftH2, right: rightH2, setRight: setRightH2 },
                      { label: "H3", left: leftH3, setLeft: setLeftH3, right: rightH3, setRight: setRightH3 },
                      { label: "H4", left: leftH4, setLeft: setLeftH4, right: rightH4, setRight: setRightH4 },
                    ].map((h, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{h.label}</span>
                        <input type="number" step="0.125" value={h.left} onChange={(e) => h.setLeft(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                        <input type="number" step="0.125" value={h.right} onChange={(e) => h.setRight(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }} />
                      </div>
                    ))}
                  </div>

                  {/* Abnormal Points */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      E. Total Length of Abnormal Points
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        step="0.125"
                        value={abnormalPoints}
                        onChange={(e) => setAbnormalPoints(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>inches</span>
                    </div>
                    <p style={{ margin: "6px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      Points not part of the typical frame (from sides/bottom of beam, or from other points)
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
                    📊 Score Results
                  </h2>
                </div>

                <div style={{ padding: "24px" }}>
                  {/* Main Score */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #6EE7B7"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>
                      {scoreType === 'typical' ? 'Net Typical Score' : 'Net Non-Typical Score'}
                    </p>
                    <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#059669" }}>
                      {toFraction(currentScore)}&quot;
                    </div>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                      {scoreResults.leftPoints}×{scoreResults.rightPoints} {activeTab === 'whitetail' ? 'Whitetail' : 'Mule Deer'}
                    </p>
                  </div>

                  {/* Gross vs Net */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "10px",
                      padding: "16px",
                      textAlign: "center",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#B45309" }}>Gross Score</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>{toFraction(scoreResults.grossScore)}&quot;</p>
                    </div>
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "10px",
                      padding: "16px",
                      textAlign: "center",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#991B1B" }}>Deductions</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#DC2626" }}>-{toFraction(scoreResults.totalDeductions)}&quot;</p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                      Score Breakdown
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Spread Credit</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{toFraction(scoreResults.spreadCredit)}&quot;</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Left Antler Total</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{toFraction(scoreResults.leftTotal)}&quot;</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Right Antler Total</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{toFraction(scoreResults.rightTotal)}&quot;</span>
                      </div>
                      {scoreResults.abnormal > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: scoreType === 'nonTypical' ? "#ECFDF5" : "#FEE2E2", borderRadius: "6px" }}>
                          <span style={{ color: scoreType === 'nonTypical' ? "#065F46" : "#991B1B" }}>
                            Abnormal Points {scoreType === 'nonTypical' ? '(added)' : '(deducted)'}
                          </span>
                          <span style={{ fontWeight: "600", color: scoreType === 'nonTypical' ? "#059669" : "#DC2626" }}>
                            {scoreType === 'nonTypical' ? '+' : '-'}{toFraction(scoreResults.abnormal)}&quot;
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Record Book Eligibility */}
                  <div style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                      🏆 Record Book Eligibility
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", color: "#4B5563" }}>B&amp;C All-Time ({eligibility.minimums.allTime}&quot;)</span>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.8rem", 
                          fontWeight: "600",
                          backgroundColor: eligibility.bcAllTime ? "#ECFDF5" : "#F3F4F6",
                          color: eligibility.bcAllTime ? "#059669" : "#9CA3AF"
                        }}>
                          {eligibility.bcAllTime ? '✓ Qualified' : 'Not Qualified'}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", color: "#4B5563" }}>B&amp;C Awards ({eligibility.minimums.awards}&quot;)</span>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.8rem", 
                          fontWeight: "600",
                          backgroundColor: eligibility.bcAwards ? "#ECFDF5" : "#F3F4F6",
                          color: eligibility.bcAwards ? "#059669" : "#9CA3AF"
                        }}>
                          {eligibility.bcAwards ? '✓ Qualified' : 'Not Qualified'}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9rem", color: "#4B5563" }}>Pope &amp; Young ({eligibility.minimums.popeYoung}&quot;)</span>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "20px", 
                          fontSize: "0.8rem", 
                          fontWeight: "600",
                          backgroundColor: eligibility.popeYoung ? "#ECFDF5" : "#F3F4F6",
                          color: eligibility.popeYoung ? "#059669" : "#9CA3AF"
                        }}>
                          {eligibility.popeYoung ? '✓ Qualified' : 'Not Qualified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Guide SVG */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#1F2937", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Measurement Guide</h2>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>D. Inside Spread</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4B5563" }}>
                      Measure at widest point between main beams, perpendicular to skull centerline. Credit cannot exceed longer main beam.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>F. Main Beam</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4B5563" }}>
                      Measure from lowest outside edge of burr, along outer curve to beam tip. Use flexible steel tape or cable.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>G. Point Lengths</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4B5563" }}>
                      Measure from top edge of main beam, along outer curve to tip. Points must be ≥1&quot; to count. Beam tip = point but not measured.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#166534" }}>H. Circumferences</h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4B5563" }}>
                      Measure at smallest place between points. H1 between burr and G1, H2 between G1-G2, H3 between G2-G3, H4 between G3-G4.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Estimator Tab */}
        {activeTab === "quick" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#166534", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚡ Quick Score Estimator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 Use this for field estimates. For accurate scoring, use the full calculator with all measurements.
                  </p>
                </div>

                {/* Number of Points */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Number of Points
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[6, 8, 10, 12, 14].map((n) => (
                      <button
                        key={n}
                        onClick={() => setQuickPoints(String(n))}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: quickPoints === String(n) ? "2px solid #166534" : "1px solid #E5E7EB",
                          backgroundColor: quickPoints === String(n) ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          fontWeight: quickPoints === String(n) ? "600" : "normal"
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inside Spread Estimate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Estimated Inside Spread
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={quickSpread}
                      onChange={(e) => setQuickSpread(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>inches</span>
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                    Tip: Buck&apos;s ears are ~16-18&quot; tip-to-tip when alert
                  </p>
                </div>

                {/* Main Beam Length Estimate */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Estimated Main Beam Length (avg)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={quickBeamLength}
                      onChange={(e) => setQuickBeamLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>inches</span>
                  </div>
                </div>

                {/* Average Tine Length */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Estimated Average Tine Length
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={quickTineLength}
                      onChange={(e) => setQuickTineLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>inches</span>
                  </div>
                </div>

                {/* Mass */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Antler Mass
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: 'light', label: 'Light' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'heavy', label: 'Heavy' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setQuickMass(opt.value as typeof quickMass)}
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: quickMass === opt.value ? "2px solid #166534" : "1px solid #E5E7EB",
                          backgroundColor: quickMass === opt.value ? "#ECFDF5" : "white",
                          cursor: "pointer",
                          fontWeight: quickMass === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Estimated Score Range</h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Estimated Score</p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                    {quickEstimate.low}&quot; - {quickEstimate.high}&quot;
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1.25rem", color: "#047857" }}>
                    Mid: ~{quickEstimate.mid}&quot;
                  </p>
                </div>

                {/* Quick Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #E5E7EB"
                }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Score Reference
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#4B5563" }}>Average mature buck</span>
                      <span style={{ color: "#6B7280" }}>100-115&quot;</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#4B5563" }}>Good buck</span>
                      <span style={{ color: "#6B7280" }}>120-135&quot;</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#4B5563" }}>Trophy class</span>
                      <span style={{ color: "#6B7280" }}>140-160&quot;</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#059669", fontWeight: "600" }}>Pope &amp; Young min</span>
                      <span style={{ color: "#059669", fontWeight: "600" }}>125&quot;</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#D97706", fontWeight: "600" }}>B&amp;C Awards min</span>
                      <span style={{ color: "#D97706", fontWeight: "600" }}>160&quot;</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#DC2626", fontWeight: "600" }}>B&amp;C All-Time min</span>
                      <span style={{ color: "#DC2626", fontWeight: "600" }}>170&quot;</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                    ⚠️ This is a rough estimate only. Actual scores can vary significantly. Use the full calculator with all measurements for accurate scoring.
                  </p>
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🦌 Complete Guide to Deer Antler Scoring</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The <strong>Boone and Crockett Club</strong> scoring system is the gold standard for measuring 
                  deer antlers in North America. Established in 1887 by Theodore Roosevelt, it provides a standardized 
                  method to compare trophy animals and maintain historical records of exceptional specimens.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Understanding the B&amp;C Scoring System</h3>
                <p>
                  The scoring system measures five key components: <strong>inside spread</strong> (width between main beams), 
                  <strong>main beam length</strong> (from burr to tip), <strong>point lengths</strong> (G1-G7 tines), 
                  and <strong>mass</strong> (H1-H4 circumferences). All measurements are recorded to the nearest 1/8 inch 
                  using a flexible steel tape.
                </p>

                <div style={{
                  backgroundColor: "#ECFDF5",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#065F46" }}>📊 Gross vs. Net Score</p>
                  <p style={{ margin: 0, color: "#047857", fontSize: "0.95rem" }}>
                    <strong>Gross Score</strong> = Total of all measurements<br />
                    <strong>Net Score</strong> = Gross minus deductions for asymmetry<br />
                    The record books use net scores, but many hunters prefer gross (&quot;nets are for fishermen&quot;).
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Typical vs. Non-Typical</h3>
                <p>
                  <strong>Typical antlers</strong> follow the classic whitetail pattern with symmetrical points growing 
                  upward from the main beam. <strong>Non-typical antlers</strong> have abnormal points - extra tines 
                  growing from unusual locations. In typical scoring, abnormal points are deducted; in non-typical 
                  scoring, they&apos;re added to the final score.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Tips for Accurate Scoring</h3>
                <p>
                  For official scoring, antlers must air-dry for <strong>60 days</strong> after harvest. Use a 
                  <strong>1/4-inch flexible steel tape</strong> for all measurements. When measuring points, establish 
                  a baseline where the point meets the main beam. For circumferences, always measure at the narrowest 
                  point between tines.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* B&C Minimums */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>🏆 B&amp;C Minimums</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Whitetail Typical:</strong> 170&quot;</p>
                <p style={{ margin: 0 }}><strong>Whitetail Non-Typ:</strong> 195&quot;</p>
                <p style={{ margin: 0 }}><strong>Mule Deer Typical:</strong> 190&quot;</p>
                <p style={{ margin: 0 }}><strong>Mule Deer Non-Typ:</strong> 230&quot;</p>
              </div>
            </div>

            {/* Quick Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Field Judging Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Ear tips = 16-18&quot; spread reference</p>
                <p style={{ margin: "0 0 8px 0" }}>• Ear length = ~7-8&quot; tine reference</p>
                <p style={{ margin: "0 0 8px 0" }}>• Eye to nose = ~8&quot;</p>
                <p style={{ margin: 0 }}>• Eye circumference = ~4&quot;</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/deer-scoring-calculator" currentCategory="Outdoors" />
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
            🦌 <strong>Disclaimer:</strong> This calculator provides unofficial &quot;green&quot; scores for personal use only. 
            For official Boone and Crockett Club entry, trophies must be measured by a certified B&amp;C Official Measurer 
            after a 60-day drying period. Scores may vary based on measurement technique. 
            This tool is not affiliated with the Boone and Crockett Club.
          </p>
        </div>
      </div>
    </div>
  );
}