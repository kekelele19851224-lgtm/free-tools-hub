"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Fence styles
const fenceStyles = {
  "standard": { name: "Standard (Spaced)", description: "Decorative with gaps between pickets", hasGap: true, hasOverlap: false },
  "privacy": { name: "Privacy (Solid)", description: "No gaps, maximum privacy", hasGap: false, hasOverlap: false },
  "boardonboard": { name: "Board-on-Board", description: "Overlapping boards, good airflow + privacy", hasGap: false, hasOverlap: true }
};

// Common picket widths
const picketWidths = [
  { value: 1.5, label: "1.5\" (Dog ear narrow)" },
  { value: 2.5, label: "2.5\" (Narrow picket)" },
  { value: 3.5, label: "3.5\" (Standard picket)" },
  { value: 5.5, label: "5.5\" (Wide board)" },
  { value: 7.5, label: "7.5\" (Extra wide)" },
  { value: 11.5, label: "11.5\" (Wide panel)" }
];

// Common gaps
const gapOptions = [
  { value: 0.5, label: "0.5\" (Minimal)" },
  { value: 1, label: "1\" (Tight)" },
  { value: 1.5, label: "1.5\" (Standard)" },
  { value: 2, label: "2\" (Medium)" },
  { value: 2.5, label: "2.5\" (Wide)" },
  { value: 3, label: "3\" (Extra wide)" }
];

// Waste factors
const wasteFactors = {
  "none": { label: "No extra (exact)", value: 1.0 },
  "low": { label: "+5% (minimal waste)", value: 1.05 },
  "medium": { label: "+10% (recommended)", value: 1.10 },
  "high": { label: "+15% (complex install)", value: 1.15 }
};

// Fence heights with recommended rails
const fenceHeights = [
  { height: 3, rails: 2, label: "3 ft (36\")" },
  { height: 4, rails: 2, label: "4 ft (48\")" },
  { height: 5, rails: 3, label: "5 ft (60\")" },
  { height: 6, rails: 3, label: "6 ft (72\")" },
  { height: 8, rails: 4, label: "8 ft (96\")" }
];

// Material prices
const prices = {
  picket35: { min: 2, max: 5 },
  picket55: { min: 4, max: 8 },
  post: { min: 10, max: 20 },
  rail: { min: 5, max: 12 },
  concrete: { min: 4, max: 6 },
  screws: { min: 8, max: 15 }
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate how many fence pickets I need?",
    answer: "To calculate fence pickets, convert your fence length to inches, then divide by (picket width + gap). For example, a 100 ft fence (1,200 inches) with 3.5\" pickets and 2\" gaps: 1,200 ÷ 5.5 = 218 pickets. Add 10% for waste, giving you 240 pickets. For privacy fences with no gaps, simply divide length by picket width."
  },
  {
    question: "How much is 100 linear feet of fencing?",
    answer: "For 100 linear feet of wood picket fence, expect to pay $1,500-$4,000 for materials and installation. Materials alone (pickets, posts, rails, concrete) typically cost $500-$1,500. A basic 4ft decorative picket fence costs less, while a 6ft privacy fence costs more. DIY installation can save $1,000-$2,000 in labor costs."
  },
  {
    question: "How much is a picket fence per foot?",
    answer: "Picket fencing costs $15-$40 per linear foot installed, depending on materials and height. Wood picket fences run $15-$30/ft, vinyl $20-$35/ft, and metal/aluminum $25-$50/ft. Materials alone cost $5-$15 per linear foot. Labor adds $10-$20 per foot. Cedar and pressure-treated pine are the most popular wood choices."
  },
  {
    question: "How do I work out how many fence boards I need?",
    answer: "For standard fencing: Boards = Fence Length (inches) ÷ (Board Width + Gap). For board-on-board fencing: Boards = [(Length - Board Width) ÷ (Board Width - Overlap)] + 1. Always round up and add 10% for waste. A 100ft fence with 5.5\" boards and 0\" gap needs about 218 boards, plus waste = 240 boards."
  },
  {
    question: "How many pickets per 8 foot section board-on-board?",
    answer: "For an 8-foot (96 inch) board-on-board section: With 5.5\" pickets and 1.5\" overlap, you need 24 pickets per section. With 3.5\" pickets and 1\" overlap, you need 38 pickets per section. Board-on-board uses about 50% more material than standard fencing but provides better privacy and looks good from both sides."
  },
  {
    question: "What is the standard spacing between fence pickets?",
    answer: "Standard picket fence spacing is 1.5\" to 2.5\" between boards for decorative fences. Privacy fences have 0\" spacing (boards touch). Board-on-board fences overlap by 1\" to 1.5\". Pool fences often require 2\" max spacing by code. Always check local regulations before building, especially for pool areas or property lines."
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

export default function FencePicketCalculator() {
  const [activeTab, setActiveTab] = useState<"pickets" | "materials">("pickets");
  
  // Tab 1: Picket Calculator State
  const [fenceStyle, setFenceStyle] = useState<string>("standard");
  const [fenceLength, setFenceLength] = useState<string>("100");
  const [picketWidth, setPicketWidth] = useState<string>("3.5");
  const [gapWidth, setGapWidth] = useState<string>("2");
  const [overlapWidth, setOverlapWidth] = useState<string>("1");
  const [wasteFactor, setWasteFactor] = useState<string>("medium");
  
  // Tab 2: Complete Materials State
  const [fenceHeight, setFenceHeight] = useState<string>("6");
  const [postSpacing, setPostSpacing] = useState<string>("8");
  const [railsPerSection, setRailsPerSection] = useState<string>("3");
  const [includeGate, setIncludeGate] = useState<boolean>(false);
  const [gateWidth, setGateWidth] = useState<string>("4");
  const [showCost, setShowCost] = useState<boolean>(true);

  // Calculations
  const lengthFt = parseFloat(fenceLength) || 0;
  const lengthIn = lengthFt * 12;
  const picketW = parseFloat(picketWidth) || 3.5;
  const gap = parseFloat(gapWidth) || 0;
  const overlap = parseFloat(overlapWidth) || 1;
  const waste = wasteFactors[wasteFactor as keyof typeof wasteFactors].value;
  
  // Calculate number of pickets based on style
  let basePickets = 0;
  const styleData = fenceStyles[fenceStyle as keyof typeof fenceStyles];
  
  if (fenceStyle === "standard") {
    basePickets = lengthIn / (picketW + gap);
  } else if (fenceStyle === "privacy") {
    basePickets = lengthIn / picketW;
  } else if (fenceStyle === "boardonboard") {
    basePickets = ((lengthIn - picketW) / (picketW - overlap)) + 1;
  }
  
  const totalPickets = Math.ceil(basePickets * waste);
  const picketsPerSection = Math.ceil((postSpacing === "8" ? 96 : 72) / (fenceStyle === "standard" ? (picketW + gap) : fenceStyle === "privacy" ? picketW : (picketW - overlap)));
  
  // Tab 2 Calculations
  const heightFt = parseFloat(fenceHeight) || 6;
  const postSpace = parseFloat(postSpacing) || 8;
  const rails = parseInt(railsPerSection) || 3;
  const gateW = parseFloat(gateWidth) || 4;
  
  // Adjust fence length for gate
  const effectiveLength = includeGate ? lengthFt - gateW : lengthFt;
  
  // Posts calculation
  const numSections = Math.ceil(effectiveLength / postSpace);
  const numPosts = numSections + 1 + (includeGate ? 2 : 0); // Extra posts for gate
  
  // Rails calculation
  const totalRails = numSections * rails;
  
  // Concrete bags (2 bags per post for 8" diameter, 24" deep hole)
  const concreteBags = numPosts * 2;
  
  // Nails/Screws calculation
  // 4 per rail-to-post connection + 2 per picket per rail
  const nailsRails = totalRails * 4;
  const nailsPickets = totalPickets * rails * 2;
  const totalNails = nailsRails + nailsPickets;
  const screwBoxes = Math.ceil(totalNails / 100); // ~100 screws per lb box
  
  // Cost estimation
  const picketPrice = picketW <= 3.5 ? prices.picket35 : prices.picket55;
  const materialCostMin = (totalPickets * picketPrice.min) + (numPosts * prices.post.min) + (totalRails * prices.rail.min) + (concreteBags * prices.concrete.min) + (screwBoxes * prices.screws.min);
  const materialCostMax = (totalPickets * picketPrice.max) + (numPosts * prices.post.max) + (totalRails * prices.rail.max) + (concreteBags * prices.concrete.max) + (screwBoxes * prices.screws.max);
  const costPerFoot = lengthFt > 0 ? ((materialCostMin + materialCostMax) / 2) / lengthFt : 0;

  // Update rails when height changes
  const handleHeightChange = (value: string) => {
    setFenceHeight(value);
    const heightData = fenceHeights.find(h => h.height.toString() === value);
    if (heightData) {
      setRailsPerSection(heightData.rails.toString());
    }
  };

  const tabs = [
    { id: "pickets", label: "Picket Calculator", icon: "🪵" },
    { id: "materials", label: "Complete Materials", icon: "📋" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Fence Picket Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Fence Picket Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many fence pickets you need for your project. Supports standard, privacy, 
            and board-on-board fence styles with complete materials list and cost estimates.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>Picket Formula</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.9rem", color: "#B45309", backgroundColor: "white", padding: "10px 14px", borderRadius: "6px", display: "inline-block" }}>
                Pickets = Fence Length (inches) ÷ (Picket Width + Gap)
              </div>
              <p style={{ fontSize: "0.85rem", color: "#92400E", margin: "10px 0 0 0" }}>
                <strong>Example:</strong> 100 ft with 3.5" pickets, 2" gap: 1200" ÷ 5.5" = 218 pickets (+10% waste = 240)
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
                backgroundColor: activeTab === tab.id ? "#78350F" : "#E5E7EB",
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

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#78350F", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "pickets" && "🪵 Fence Details"}
                {activeTab === "materials" && "📋 Project Specifications"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* PICKET CALCULATOR TAB */}
              {activeTab === "pickets" && (
                <>
                  {/* Fence Style */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Fence Style
                    </label>
                    {Object.entries(fenceStyles).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "10px 12px",
                          marginBottom: "6px",
                          borderRadius: "8px",
                          border: fenceStyle === key ? "2px solid #78350F" : "1px solid #E5E7EB",
                          backgroundColor: fenceStyle === key ? "#FEF3C7" : "white",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="radio"
                          name="fenceStyle"
                          value={key}
                          checked={fenceStyle === key}
                          onChange={(e) => setFenceStyle(e.target.value)}
                          style={{ marginTop: "2px" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "0.85rem", color: "#111827" }}>{value.name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>{value.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Fence Length */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Fence Length (feet)
                    </label>
                    <input
                      type="number"
                      value={fenceLength}
                      onChange={(e) => setFenceLength(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[50, 100, 150, 200].map((len) => (
                        <button
                          key={len}
                          onClick={() => setFenceLength(len.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: fenceLength === len.toString() ? "2px solid #78350F" : "1px solid #E5E7EB",
                            backgroundColor: fenceLength === len.toString() ? "#FEF3C7" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {len} ft
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Picket Width */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Picket Width (inches)
                    </label>
                    <select
                      value={picketWidth}
                      onChange={(e) => setPicketWidth(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {picketWidths.map((pw) => (
                        <option key={pw.value} value={pw.value}>{pw.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gap Width (only for standard style) */}
                  {fenceStyle === "standard" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Gap Between Pickets (inches)
                      </label>
                      <select
                        value={gapWidth}
                        onChange={(e) => setGapWidth(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                      >
                        {gapOptions.map((g) => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Overlap Width (only for board-on-board) */}
                  {fenceStyle === "boardonboard" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Board Overlap (inches)
                      </label>
                      <input
                        type="number"
                        value={overlapWidth}
                        onChange={(e) => setOverlapWidth(e.target.value)}
                        step="0.25"
                        min="0.5"
                        max="2"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                        Recommended: 1" to 1.5" overlap
                      </p>
                    </div>
                  )}

                  {/* Waste Factor */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Waste Allowance
                    </label>
                    <select
                      value={wasteFactor}
                      onChange={(e) => setWasteFactor(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(wasteFactors).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "0.7rem", color: "#059669", margin: "4px 0 0 0" }}>
                      ✓ Recommended: Add 10% extra for cuts and damage
                    </p>
                  </div>
                </>
              )}

              {/* COMPLETE MATERIALS TAB */}
              {activeTab === "materials" && (
                <>
                  {/* Fence Length Summary */}
                  <div style={{ padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px", marginBottom: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#374151" }}>
                      <strong>Fence:</strong> {fenceLength} ft, {fenceStyles[fenceStyle as keyof typeof fenceStyles].name}, {picketWidth}" pickets
                    </p>
                  </div>

                  {/* Fence Height */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Fence Height
                    </label>
                    <select
                      value={fenceHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {fenceHeights.map((h) => (
                        <option key={h.height} value={h.height}>{h.label} - {h.rails} rails recommended</option>
                      ))}
                    </select>
                  </div>

                  {/* Post Spacing */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Post Spacing
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setPostSpacing("6")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: postSpacing === "6" ? "2px solid #78350F" : "1px solid #E5E7EB",
                          backgroundColor: postSpacing === "6" ? "#FEF3C7" : "white",
                          color: postSpacing === "6" ? "#78350F" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        6 feet<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>Stronger</span>
                      </button>
                      <button
                        onClick={() => setPostSpacing("8")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: postSpacing === "8" ? "2px solid #78350F" : "1px solid #E5E7EB",
                          backgroundColor: postSpacing === "8" ? "#FEF3C7" : "white",
                          color: postSpacing === "8" ? "#78350F" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        8 feet<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>Standard</span>
                      </button>
                    </div>
                  </div>

                  {/* Rails per Section */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Rails per Section
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[2, 3, 4].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRailsPerSection(r.toString())}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: railsPerSection === r.toString() ? "2px solid #78350F" : "1px solid #E5E7EB",
                            backgroundColor: railsPerSection === r.toString() ? "#FEF3C7" : "white",
                            color: "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.9rem"
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Gate */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: includeGate ? "12px" : "0" }}>
                      <input
                        type="checkbox"
                        checked={includeGate}
                        onChange={(e) => setIncludeGate(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                        Include Gate
                      </span>
                    </label>
                    {includeGate && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Gate Width (feet)
                        </label>
                        <input
                          type="number"
                          value={gateWidth}
                          onChange={(e) => setGateWidth(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Show Cost Toggle */}
                  <div style={{ padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px", border: "1px solid #6EE7B7" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={showCost}
                        onChange={(e) => setShowCost(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46" }}>
                        Show Cost Estimate
                      </span>
                    </label>
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
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "pickets" && "🪵 Pickets Needed"}
                {activeTab === "materials" && "📋 Materials List"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* PICKET RESULTS */}
              {activeTab === "pickets" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      You Need
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {totalPickets}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      pickets ({picketWidth}" wide)
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Calculation Details</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Fence Length</span>
                        <span style={{ fontWeight: "600" }}>{lengthFt} ft ({lengthIn.toLocaleString()}")</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Picket Width</span>
                        <span style={{ fontWeight: "600" }}>{picketWidth}"</span>
                      </div>
                      {fenceStyle === "standard" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Gap</span>
                          <span style={{ fontWeight: "600" }}>{gapWidth}"</span>
                        </div>
                      )}
                      {fenceStyle === "boardonboard" && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Overlap</span>
                          <span style={{ fontWeight: "600" }}>{overlapWidth}"</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Base Count</span>
                        <span style={{ fontWeight: "600" }}>{Math.ceil(basePickets)} pickets</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "6px", borderTop: "1px solid #D1D5DB" }}>
                        <span style={{ color: "#4B5563" }}>With {((waste - 1) * 100).toFixed(0)}% waste</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{totalPickets} pickets</span>
                      </div>
                    </div>
                  </div>

                  {/* Per Section Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Per 8ft Section</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                        ~{picketsPerSection}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>Total Coverage</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {lengthFt} ft
                      </p>
                    </div>
                  </div>

                  {/* Style Note */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                      💡 <strong>{styleData.name}:</strong> {styleData.description}
                    </p>
                  </div>
                </>
              )}

              {/* MATERIALS LIST RESULTS */}
              {activeTab === "materials" && (
                <>
                  {/* Summary */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                    border: "2px solid #059669"
                  }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#065F46", fontWeight: "600" }}>
                      Complete Materials for {lengthFt} ft × {fenceHeight} ft Fence
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#047857" }}>
                      {numSections} sections, {postSpacing}ft spacing, {rails} rails/section
                      {includeGate && ` + ${gateWidth}ft gate`}
                    </p>
                  </div>

                  {/* Materials List */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📦 Materials List</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>🪵 Pickets ({picketWidth}" × {fenceHeight}')</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{totalPickets}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>🪵 Posts (4×4×{Math.ceil(parseFloat(fenceHeight) * 1.5)}')</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{numPosts}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>🪵 Rails (2×4×{postSpacing}')</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{totalRails}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#4B5563" }}>🧱 Concrete (50lb bags)</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{concreteBags}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#4B5563" }}>🔩 Screws/Nails (1lb boxes)</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{screwBoxes}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Estimate */}
                  {showCost && (
                    <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "16px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "0.9rem" }}>💰 Estimated Material Cost</h4>
                      <div style={{ textAlign: "center", marginBottom: "12px" }}>
                        <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#B45309" }}>
                          ${materialCostMin.toFixed(0)} - ${materialCostMax.toFixed(0)}
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#92400E" }}>
                          ~${costPerFoot.toFixed(2)} per linear foot (materials only)
                        </p>
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#B45309" }}>
                        <p style={{ margin: "0 0 2px 0" }}>• Pickets: ${(totalPickets * picketPrice.min).toFixed(0)}-${(totalPickets * picketPrice.max).toFixed(0)}</p>
                        <p style={{ margin: "0 0 2px 0" }}>• Posts: ${(numPosts * prices.post.min).toFixed(0)}-${(numPosts * prices.post.max).toFixed(0)}</p>
                        <p style={{ margin: "0 0 2px 0" }}>• Rails: ${(totalRails * prices.rail.min).toFixed(0)}-${(totalRails * prices.rail.max).toFixed(0)}</p>
                        <p style={{ margin: 0 }}>• Concrete + Hardware: ${((concreteBags * prices.concrete.min) + (screwBoxes * prices.screws.min)).toFixed(0)}-${((concreteBags * prices.concrete.max) + (screwBoxes * prices.screws.max)).toFixed(0)}</p>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.85rem", fontWeight: "600", color: "#1E40AF" }}>💡 Tips</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.75rem", color: "#1D4ED8", lineHeight: "1.6" }}>
                      <li>Post height = fence height × 1.5 (⅓ below ground)</li>
                      <li>Use 2 bags concrete per post for 8" hole, 24" deep</li>
                      <li>Add $10-20/ft for professional installation</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Picket Spacing Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#78350F", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📏 Pickets per 8-Foot Section Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Picket Width</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Privacy (0" gap)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Standard (2" gap)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Board-on-Board (1" overlap)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>3.5" (Standard)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>28</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>18</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>38</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>5.5" (Wide)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>18</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>13</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>22</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>7.5" (Extra Wide)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>13</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>10</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>15</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Board-on-board uses approximately 50% more pickets than privacy fencing for the same length.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏡 Fence Picket Guide</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>Understanding Fence Styles</h3>
                <p>
                  <strong>Standard picket fences</strong> have gaps between boards for airflow and a classic look, 
                  typically using 1.5" to 3" spacing. <strong>Privacy fences</strong> have no gaps, providing 
                  maximum privacy and wind blocking. <strong>Board-on-board</strong> (shadow box) fences alternate 
                  boards on both sides of the rails with overlap, offering privacy while allowing airflow and 
                  looking good from both sides.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing Post Spacing</h3>
                <p>
                  Standard post spacing is 8 feet on center, which works well for most residential fences up to 
                  6 feet tall. For taller fences (8 feet) or areas with high winds, reduce spacing to 6 feet for 
                  added strength. Each post should be set at least 24-36 inches deep (deeper in cold climates) 
                  with concrete for stability. Post height should be 1.5× the fence height to allow for burial.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Material Selection Tips</h3>
                <p>
                  Cedar and pressure-treated pine are the most popular wood choices. Cedar naturally resists rot 
                  and insects but costs more. Pressure-treated pine is budget-friendly but requires sealing. For 
                  rails, use 2×4 lumber cut to your post spacing length. Always check local building codes before 
                  starting - many areas have height restrictions and setback requirements from property lines.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📐 Quick Formulas</h3>
              <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#B45309", backgroundColor: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Standard/Privacy:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>L(in) ÷ (W + Gap)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Board-on-Board:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>(L - W) ÷ (W - Overlap) + 1</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Posts:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>(Length ÷ Spacing) + 1</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Post Height:</strong></p>
                <p style={{ margin: 0 }}>Fence Height × 1.5</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Order 10% extra for waste</li>
                <li>Set posts 24-36" deep</li>
                <li>Use 2 bags concrete/post</li>
                <li>Pre-stain before install</li>
                <li>Check property lines first</li>
                <li>Call 811 before digging</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/fence-picket-calculator" currentCategory="Construction" />
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
            🏡 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes. 
            Actual material requirements may vary based on site conditions, fence design, and cutting waste. 
            Prices are approximate averages and vary by location and supplier. Always verify measurements 
            and check local building codes before purchasing materials.
          </p>
        </div>
      </div>
    </div>
  );
}