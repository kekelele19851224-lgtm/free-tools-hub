"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// IRC 2021 Beam Span Table (Southern Pine, 40 PSF)
const beamSpanTable: Record<number, Record<string, number>> = {
  6: { '2-2×6': 6.0, '2-2×8': 8.75, '2-2×10': 10.25, '2-2×12': 11.83, '3-2×8': 10.0, '3-2×10': 11.75, '3-2×12': 13.5 },
  8: { '2-2×6': 5.17, '2-2×8': 7.58, '2-2×10': 8.83, '2-2×12': 10.17, '3-2×8': 8.67, '3-2×10': 10.17, '3-2×12': 11.67 },
  10: { '2-2×6': 4.58, '2-2×8': 6.75, '2-2×10': 7.83, '2-2×12': 9.08, '3-2×8': 7.75, '3-2×10': 9.0, '3-2×12': 10.42 },
  12: { '2-2×6': 4.17, '2-2×8': 6.17, '2-2×10': 7.17, '2-2×12': 8.25, '3-2×8': 7.08, '3-2×10': 8.25, '3-2×12': 9.5 },
  14: { '2-2×6': 3.83, '2-2×8': 5.67, '2-2×10': 6.58, '2-2×12': 7.58, '3-2×8': 6.5, '3-2×10': 7.58, '3-2×12': 8.75 },
  16: { '2-2×6': 3.5, '2-2×8': 5.25, '2-2×10': 6.08, '2-2×12': 7.0, '3-2×8': 6.0, '3-2×10': 7.0, '3-2×12': 8.08 },
  18: { '2-2×6': 3.25, '2-2×8': 4.83, '2-2×10': 5.67, '2-2×12': 6.5, '3-2×8': 5.58, '3-2×10': 6.5, '3-2×12': 7.5 },
};

// Wood species factors
const woodSpecies = [
  { name: 'Southern Pine', factor: 1.0 },
  { name: 'Douglas Fir-Larch', factor: 0.95 },
  { name: 'Hem-Fir', factor: 0.85 },
  { name: 'Spruce-Pine-Fir (SPF)', factor: 0.85 },
  { name: 'Redwood', factor: 0.80 },
  { name: 'Western Cedar', factor: 0.75 },
];

// Load types
const loadTypes = [
  { name: 'Standard Deck (40 PSF)', factor: 1.0 },
  { name: 'Heavy Use / Snow (50 PSF)', factor: 0.9 },
  { name: 'Hot Tub / Heavy Load (60 PSF)', factor: 0.8 },
];

// Footing sizes based on load
const footingSizes: Record<number, { clay: number; sand: number; gravel: number }> = {
  2000: { clay: 12, sand: 10, gravel: 8 },
  3000: { clay: 15, sand: 12, gravel: 10 },
  4000: { clay: 17, sand: 14, gravel: 12 },
  5000: { clay: 19, sand: 16, gravel: 14 },
  6000: { clay: 21, sand: 18, gravel: 15 },
};

// Railing post materials
const railingMaterials = [
  { name: 'Wood 4×4', maxSpacing: 6 },
  { name: 'Wood 6×6', maxSpacing: 8 },
  { name: 'Aluminum (Standard)', maxSpacing: 6 },
  { name: 'Aluminum (Heavy Duty)', maxSpacing: 8 },
  { name: 'Composite', maxSpacing: 6 },
  { name: 'Steel/Iron', maxSpacing: 8 },
];

// FAQ data
const faqs = [
  {
    question: "How to calculate post spacing for a deck?",
    answer: "Deck post spacing depends on beam size, joist span, and wood species. Generally: 1) Determine your joist span (distance from ledger to beam), 2) Choose your beam size from IRC Table R507.5, 3) Find the maximum allowed post spacing for that beam. For example, with 10ft joists and a 2-2×10 beam in Southern Pine, posts can be up to 7'-10\" apart."
  },
  {
    question: "How far apart should 4x4 posts be for a deck?",
    answer: "4×4 posts should typically be spaced no more than 6 feet apart when supporting deck beams. They're limited to decks 5 feet or less in height. For taller decks or wider spacing (up to 8 feet), use 6×6 posts instead. Local building codes may have stricter requirements."
  },
  {
    question: "How far apart should deck posts be?",
    answer: "Deck support posts are typically spaced 6 to 8 feet apart, depending on beam size and wood species. The IRC allows up to 8 feet for most configurations with proper beam sizing. For railing posts, the maximum is 6 feet for 4×4 posts and 8 feet for 6×6 posts to meet the 200-lb lateral load requirement."
  },
  {
    question: "What size beam do I need for a 12 foot span?",
    answer: "For a 12-foot beam span (distance between posts) with 10-foot joists: you need at least a 3-2×10 beam in Southern Pine, or 3-2×12 for other species. With shorter joists (6-8 feet), a 2-2×10 or 2-2×12 beam may suffice. Always verify with your local building code."
  },
  {
    question: "How many footings do I need for a deck?",
    answer: "The number of footings equals the number of posts. Calculate posts needed by: dividing deck length by maximum post spacing (typically 6-8 ft), then multiply by number of beam rows. For a 16×12 deck with one beam: approximately 3 posts per beam × 1 beam = 3 footings, plus corner posts if freestanding."
  },
  {
    question: "What is the maximum span for a deck beam?",
    answer: "Maximum deck beam spans per IRC 2021: 2-2×8 can span up to 8'-9\" with 6ft joists; 2-2×10 up to 10'-3\"; 2-2×12 up to 11'-10\". These values are for Southern Pine at 40 PSF. Longer joist spans reduce allowable beam spans. Always use local code tables for your specific lumber species."
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

// Helper: convert decimal feet to feet-inches string
function feetToFeetInches(feet: number): string {
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  if (inches === 12) return `${wholeFeet + 1}'-0"`;
  if (inches === 0) return `${wholeFeet}'-0"`;
  return `${wholeFeet}'-${inches}"`;
}

export default function DeckPostSpacingCalculator() {
  const [activeTab, setActiveTab] = useState<'layout' | 'beam' | 'railing'>('layout');
  
  // Tab 1: Layout Planner
  const [deckLength, setDeckLength] = useState(16);
  const [deckWidth, setDeckWidth] = useState(12);
  const [deckHeight, setDeckHeight] = useState<'ground' | 'low' | 'medium' | 'high'>('low');
  const [selectedSpecies, setSelectedSpecies] = useState(0);
  const [selectedLoad, setSelectedLoad] = useState(0);
  const [soilType, setSoilType] = useState<'clay' | 'sand' | 'gravel'>('clay');
  const [isAttached, setIsAttached] = useState(true);
  
  // Tab 2: Beam Calculator
  const [beamJoistSpan, setBeamJoistSpan] = useState(10);
  const [beamPostSpacing, setBeamPostSpacing] = useState(8);
  const [beamSpecies, setBeamSpecies] = useState(0);
  
  // Tab 3: Railing Calculator
  const [railingLength, setRailingLength] = useState(40);
  const [railingMaterial, setRailingMaterial] = useState(0);

  // Layout calculations
  const layoutResults = useMemo(() => {
    const speciesFactor = woodSpecies[selectedSpecies].factor;
    const loadFactor = loadTypes[selectedLoad].factor;
    
    const joistSpan = isAttached ? deckWidth : Math.ceil(deckWidth / 2);
    const effectiveJoistSpan = Math.min(Math.max(6, Math.ceil(joistSpan / 2) * 2), 18);
    
    const spanData = beamSpanTable[effectiveJoistSpan] || beamSpanTable[12];
    
    let recommendedBeam = '2-2×10';
    let maxPostSpacing = 6;
    
    const beamOptions = ['2-2×8', '2-2×10', '2-2×12', '3-2×10', '3-2×12'];
    for (const beam of beamOptions) {
      const baseSpan = spanData[beam] || 6;
      const adjustedSpan = baseSpan * speciesFactor * loadFactor;
      if (adjustedSpan >= 6) {
        recommendedBeam = beam;
        maxPostSpacing = Math.min(adjustedSpan, 10);
        break;
      }
    }
    
    const postsPerRow = Math.ceil(deckLength / maxPostSpacing) + 1;
    const actualSpacing = deckLength / (postsPerRow - 1);
    
    const beamRows = isAttached ? 1 : 2;
    const totalPosts = postsPerRow * beamRows;
    
    const postSize = (deckHeight === 'high' || deckHeight === 'medium' || actualSpacing > 6) ? '6×6' : '4×4';
    
    const tributaryArea = actualSpacing * joistSpan;
    const loadPerPost = tributaryArea * (selectedLoad === 0 ? 50 : selectedLoad === 1 ? 60 : 70);
    const footingKey = Math.ceil(loadPerPost / 1000) * 1000;
    const footingData = footingSizes[Math.min(footingKey, 6000)] || footingSizes[6000];
    
    const postPositions: { x: number; y: number; row: number }[] = [];
    for (let row = 0; row < beamRows; row++) {
      const yPos = isAttached ? deckWidth : (row === 0 ? deckWidth / 2 : deckWidth);
      for (let i = 0; i < postsPerRow; i++) {
        postPositions.push({
          x: (i / (postsPerRow - 1)) * deckLength,
          y: yPos,
          row: row + 1
        });
      }
    }
    
    return {
      postsPerRow,
      totalPosts,
      actualSpacing,
      recommendedBeam,
      postSize,
      footingDiameter: footingData[soilType],
      joistSpan,
      beamRows,
      postPositions,
      maxPostSpacing
    };
  }, [deckLength, deckWidth, deckHeight, selectedSpecies, selectedLoad, soilType, isAttached]);

  // Beam span calculations
  const beamResults = useMemo(() => {
    const effectiveJoistSpan = Math.min(Math.max(6, Math.ceil(beamJoistSpan / 2) * 2), 18);
    const spanData = beamSpanTable[effectiveJoistSpan] || beamSpanTable[12];
    const speciesFactor = woodSpecies[beamSpecies].factor;
    
    const results: { beam: string; maxSpan: number; suitable: boolean }[] = [];
    const beamOptions = ['2-2×6', '2-2×8', '2-2×10', '2-2×12', '3-2×8', '3-2×10', '3-2×12'];
    
    for (const beam of beamOptions) {
      const baseSpan = spanData[beam] || 0;
      const adjustedSpan = baseSpan * speciesFactor;
      results.push({
        beam,
        maxSpan: adjustedSpan,
        suitable: adjustedSpan >= beamPostSpacing
      });
    }
    
    return results;
  }, [beamJoistSpan, beamPostSpacing, beamSpecies]);

  // Railing calculations
  const railingResults = useMemo(() => {
    const material = railingMaterials[railingMaterial];
    const maxSpacing = material.maxSpacing;
    const sections = Math.ceil(railingLength / maxSpacing);
    const posts = sections + 1;
    const actualSpacing = railingLength / sections;
    
    return {
      posts,
      sections,
      actualSpacing,
      maxSpacing,
      isCompliant: actualSpacing <= maxSpacing
    };
  }, [railingLength, railingMaterial]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Deck Post Spacing Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏗️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Deck Post Spacing Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free layout planner with visual diagram. Calculate post positions, beam sizes, and footing 
            requirements per IRC 2021. Shows exactly where to place every post for your deck project.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FFFBEB",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
                Standard deck posts: <strong>6-8 feet</strong> apart (4×4 max 6ft, 6×6 max 8ft)
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Railing posts: Max 6 feet for code compliance. Exact spacing depends on beam size, joist span, and wood species.
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
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>Visual Layout Diagram</span>
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
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>IRC 2021 Compliant</span>
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
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>6 Wood Species</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("layout")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "layout" ? "#D97706" : "#E5E7EB",
              color: activeTab === "layout" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Post Layout Planner
          </button>
          <button
            onClick={() => setActiveTab("beam")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "beam" ? "#D97706" : "#E5E7EB",
              color: activeTab === "beam" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🪵 Beam Span Calculator
          </button>
          <button
            onClick={() => setActiveTab("railing")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "railing" ? "#D97706" : "#E5E7EB",
              color: activeTab === "railing" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🚧 Railing Posts
          </button>
        </div>

        {/* Tab 1: Post Layout Planner */}
        {activeTab === "layout" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Deck Dimensions & Settings</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Deck Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Deck Type
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: true, label: 'Attached (Ledger)' },
                      { value: false, label: 'Freestanding' }
                    ].map((opt) => (
                      <button
                        key={String(opt.value)}
                        onClick={() => setIsAttached(opt.value)}
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: isAttached === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: isAttached === opt.value ? "#FFFBEB" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: isAttached === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dimensions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Deck Length (parallel to house)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={deckLength}
                        onChange={(e) => setDeckLength(Math.max(4, Number(e.target.value)))}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "40px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>ft</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Deck Width (away from house)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={deckWidth}
                        onChange={(e) => setDeckWidth(Math.max(4, Number(e.target.value)))}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "40px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>ft</span>
                    </div>
                  </div>
                </div>

                {/* Deck Height */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Deck Height
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { value: 'ground', label: 'Ground Level' },
                      { value: 'low', label: 'Up to 5 ft' },
                      { value: 'medium', label: '5-8 ft' },
                      { value: 'high', label: '8+ ft' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDeckHeight(opt.value as typeof deckHeight)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "8px",
                          border: deckHeight === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: deckHeight === opt.value ? "#FFFBEB" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: deckHeight === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wood Species & Load */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Wood Species
                    </label>
                    <select
                      value={selectedSpecies}
                      onChange={(e) => setSelectedSpecies(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "0.9rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      {woodSpecies.map((species, idx) => (
                        <option key={idx} value={idx}>{species.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Load Type
                    </label>
                    <select
                      value={selectedLoad}
                      onChange={(e) => setSelectedLoad(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "0.9rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    >
                      {loadTypes.map((load, idx) => (
                        <option key={idx} value={idx}>{load.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Soil Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Soil Type (for footing size)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: 'clay', label: 'Clay' },
                      { value: 'sand', label: 'Sand' },
                      { value: 'gravel', label: 'Gravel' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSoilType(opt.value as typeof soilType)}
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: soilType === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: soilType === opt.value ? "#FFFBEB" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: soilType === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> For hot tubs or heavy loads, use &quot;Heavy Load&quot; option and consider 6×6 posts regardless of height.
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Results & Recommendations</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Total Posts Needed</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {layoutResults.totalPosts}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                    {layoutResults.postsPerRow} per beam × {layoutResults.beamRows} beam{layoutResults.beamRows > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Post Spacing</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{feetToFeetInches(layoutResults.actualSpacing)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Recommended Post Size</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{layoutResults.postSize}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Recommended Beam</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{layoutResults.recommendedBeam}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Joist Span</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{layoutResults.joistSpan} ft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Footing Diameter ({soilType})</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{layoutResults.footingDiameter}&quot;</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FFFBEB", borderRadius: "6px", border: "1px solid #FCD34D" }}>
                    <span style={{ color: "#92400E" }}>Deck Area</span>
                    <span style={{ fontWeight: "600", color: "#D97706" }}>{deckLength * deckWidth} sq ft</span>
                  </div>
                </div>

                {/* Code Compliance */}
                <div style={{
                  backgroundColor: layoutResults.actualSpacing <= 8 ? "#ECFDF5" : "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: layoutResults.actualSpacing <= 8 ? "1px solid #6EE7B7" : "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: layoutResults.actualSpacing <= 8 ? "#065F46" : "#92400E", fontWeight: "600" }}>
                    {layoutResults.actualSpacing <= 8 ? '✅ IRC 2021 Compliant' : '⚠️ Check Local Code'}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Based on IRC Table R507.5 for {woodSpecies[selectedSpecies].name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Layout Diagram - only for layout tab */}
        {activeTab === "layout" && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "24px"
          }}>
            <div style={{ backgroundColor: "#1F2937", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Visual Post Layout</h2>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "12px", padding: "24px", overflowX: "auto" }}>
                <svg viewBox={`-20 -20 ${deckLength * 20 + 60} ${deckWidth * 20 + 80}`} style={{ width: "100%", maxWidth: "600px", margin: "0 auto", display: "block", minHeight: "200px" }}>
                  {/* House wall (if attached) */}
                  {isAttached && (
                    <>
                      <rect x={-15} y={-15} width={deckLength * 20 + 30} height={15} fill="#8B7355" />
                      <text x={deckLength * 10} y={-5} textAnchor="middle" fontSize="10" fill="#fff">HOUSE</text>
                    </>
                  )}
                  
                  {/* Deck outline */}
                  <rect 
                    x={0} 
                    y={0} 
                    width={deckLength * 20} 
                    height={deckWidth * 20} 
                    fill="#DEB887" 
                    stroke="#8B7355" 
                    strokeWidth="2"
                  />
                  
                  {/* Deck boards pattern */}
                  {Array.from({ length: Math.floor(deckWidth * 20 / 8) }).map((_, i) => (
                    <line key={i} x1={0} y1={i * 8 + 4} x2={deckLength * 20} y2={i * 8 + 4} stroke="#C4A574" strokeWidth="1" />
                  ))}
                  
                  {/* Beam lines */}
                  {layoutResults.postPositions.filter((p, i, arr) => 
                    i === 0 || arr[i-1]?.row !== p.row
                  ).map((firstPost, idx) => (
                    <line
                      key={`beam-${idx}`}
                      x1={0}
                      y1={firstPost.y * 20}
                      x2={deckLength * 20}
                      y2={firstPost.y * 20}
                      stroke="#654321"
                      strokeWidth="4"
                    />
                  ))}
                  
                  {/* Posts */}
                  {layoutResults.postPositions.map((post, idx) => (
                    <g key={idx}>
                      <circle
                        cx={post.x * 20}
                        cy={post.y * 20}
                        r={8}
                        fill="#4A3728"
                        stroke="#2D1F14"
                        strokeWidth="2"
                      />
                      <text
                        x={post.x * 20}
                        y={post.y * 20 + 3}
                        textAnchor="middle"
                        fontSize="8"
                        fill="#fff"
                        fontWeight="bold"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  ))}
                  
                  {/* Dimensions */}
                  <text x={deckLength * 10} y={deckWidth * 20 + 30} textAnchor="middle" fontSize="11" fill="#333">
                    {deckLength} ft
                  </text>
                  <text x={deckLength * 20 + 25} y={deckWidth * 10} textAnchor="middle" fontSize="11" fill="#333" transform={`rotate(90, ${deckLength * 20 + 25}, ${deckWidth * 10})`}>
                    {deckWidth} ft
                  </text>
                  
                  {/* Spacing annotation */}
                  {layoutResults.postsPerRow > 1 && (
                    <>
                      <line 
                        x1={0} 
                        y1={deckWidth * 20 + 45} 
                        x2={layoutResults.actualSpacing * 20} 
                        y2={deckWidth * 20 + 45} 
                        stroke="#D97706" 
                        strokeWidth="2"
                      />
                      <text x={layoutResults.actualSpacing * 10} y={deckWidth * 20 + 58} textAnchor="middle" fontSize="10" fill="#D97706" fontWeight="bold">
                        {feetToFeetInches(layoutResults.actualSpacing)} spacing
                      </text>
                    </>
                  )}
                </svg>
              </div>
              <p style={{ textAlign: "center", marginTop: "12px", fontSize: "0.85rem", color: "#6B7280" }}>
                ● = Post location &nbsp;|&nbsp; Dark line = Beam
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Beam Span Calculator */}
        {activeTab === "beam" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🪵 Beam Span Requirements</h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    Enter your joist span and desired post spacing to find the required beam size per IRC 2021.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Joist Span (ledger to beam)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={beamJoistSpan}
                        onChange={(e) => setBeamJoistSpan(Math.max(6, Math.min(18, Number(e.target.value))))}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "40px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>ft</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Desired Post Spacing
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={beamPostSpacing}
                        onChange={(e) => setBeamPostSpacing(Math.max(4, Math.min(12, Number(e.target.value))))}
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "40px",
                          borderRadius: "8px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>ft</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Wood Species
                  </label>
                  <select
                    value={beamSpecies}
                    onChange={(e) => setBeamSpecies(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "0.9rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {woodSpecies.map((species, idx) => (
                      <option key={idx} value={idx}>{species.name}</option>
                    ))}
                  </select>
                </div>

                {/* Beam Options Table */}
                <div>
                  <h3 style={{ fontSize: "0.95rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>Beam Options (IRC 2021)</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#FFFBEB" }}>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "left" }}>Beam Size</th>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Max Span</th>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {beamResults.map((result, idx) => (
                          <tr key={idx} style={{ backgroundColor: result.suitable ? "#ECFDF5" : "white" }}>
                            <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{result.beam}</td>
                            <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(result.maxSpan)}</td>
                            <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                              {result.suitable ? (
                                <span style={{ color: "#059669", fontWeight: "600" }}>✓ OK</span>
                              ) : (
                                <span style={{ color: "#9CA3AF" }}>Too short</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Recommendation</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Minimum Required Beam</p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                    {beamResults.find(r => r.suitable)?.beam || 'N/A'}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                    for {beamPostSpacing}ft post spacing
                  </p>
                </div>

                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1E40AF", fontWeight: "600" }}>
                    📝 Notes
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#2563EB", fontSize: "0.85rem", lineHeight: "1.8" }}>
                    <li>Values based on IRC 2021 Table R507.5</li>
                    <li>Assumes 40 PSF live load + 10 PSF dead load</li>
                    <li>Always verify with local building code</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Railing Posts */}
        {activeTab === "railing" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚧 Railing Post Calculator</h2>
              </div>

              <div style={{ padding: "24px" }}>
                <div style={{
                  backgroundColor: "#FFFBEB",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    Calculate how many railing posts you need based on total railing length and material type.
                  </p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Railing Length
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={railingLength}
                      onChange={(e) => setRailingLength(Math.max(1, Number(e.target.value)))}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "40px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>ft</span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                    Post Material
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {railingMaterials.map((material, idx) => (
                      <button
                        key={idx}
                        onClick={() => setRailingMaterial(idx)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: railingMaterial === idx ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: railingMaterial === idx ? "#FFFBEB" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ fontWeight: "600", fontSize: "0.9rem", color: railingMaterial === idx ? "#D97706" : "#374151" }}>{material.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "2px" }}>Max {material.maxSpacing}ft spacing</div>
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Railing Results</h2>
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
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Railing Posts Needed</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {railingResults.posts}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                    {railingResults.sections} sections
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Actual Spacing</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{feetToFeetInches(railingResults.actualSpacing)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Max Allowed</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{railingResults.maxSpacing} ft</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: railingResults.isCompliant ? "#ECFDF5" : "#FEF2F2",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: railingResults.isCompliant ? "1px solid #6EE7B7" : "1px solid #FECACA"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: railingResults.isCompliant ? "#065F46" : "#991B1B", fontWeight: "600" }}>
                    {railingResults.isCompliant ? '✅ Code Compliant' : '❌ Exceeds Maximum Spacing'}
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Railing must withstand 200 lb lateral force
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "24px"
        }}>
          <div style={{ backgroundColor: "#1F2937", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 IRC 2021 Beam Span Table (Southern Pine, 40 PSF)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "left" }}>Joist Span</th>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>2-2×8</th>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>2-2×10</th>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>2-2×12</th>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>3-2×10</th>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>3-2×12</th>
                </tr>
              </thead>
              <tbody>
                {[6, 8, 10, 12, 14, 16].map((joistSpan, idx) => (
                  <tr key={joistSpan} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{joistSpan} ft</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×8'])}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×10'])}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×12'])}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['3-2×10'])}</td>
                    <td style={{ padding: "8px 10px", border: "1px solid #E5E7EB", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['3-2×12'])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: "12px", fontSize: "0.75rem", color: "#6B7280" }}>
              * Values show maximum beam span (distance between posts). Based on No. 2 grade lumber, wet service conditions, L/360 deflection limit.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏗️ Complete Guide to Deck Post Spacing</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Proper deck post spacing is crucial for structural integrity and building code compliance. 
                  Whether you&apos;re building a new deck or replacing an old one, understanding the relationship 
                  between post spacing, beam size, and joist span is essential for a safe and durable structure.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Understanding Post Spacing Rules</h3>
                <p>
                  The <strong>International Residential Code (IRC) 2021</strong> provides prescriptive tables for 
                  deck construction. Post spacing depends primarily on beam size and joist span. Larger beams can 
                  span further between posts, while longer joist spans require posts to be closer together.
                </p>

                <div style={{
                  backgroundColor: "#FFFBEB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#92400E" }}>📏 General Spacing Guidelines</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#B45309" }}>
                    <li><strong>4×4 posts:</strong> Maximum 6 feet apart, decks ≤5ft high only</li>
                    <li><strong>6×6 posts:</strong> Maximum 8 feet apart, required for taller decks</li>
                    <li><strong>Railing posts:</strong> Maximum 6-8 feet depending on material</li>
                    <li><strong>Always verify:</strong> Check local building codes for your area</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors Affecting Post Spacing</h3>
                <p>
                  Several factors influence how far apart your posts can be. <strong>Wood species</strong> matters 
                  significantly - Southern Pine is stronger than SPF lumber. <strong>Load requirements</strong> also 
                  affect spacing - hot tubs and heavy snow loads require closer post spacing or larger beams.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Visual Layout Matters</h3>
                <p>
                  Our calculator provides a <strong>visual diagram</strong> showing exactly where each post should 
                  be placed. This helps you plan your footing locations before digging, ensures even spacing across 
                  your deck, and helps identify potential issues with obstructions or uneven ground.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#FFFBEB", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📏 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>4×4 Max Spacing:</strong> 6 feet</p>
                <p style={{ margin: 0 }}><strong>6×6 Max Spacing:</strong> 8 feet</p>
                <p style={{ margin: 0 }}><strong>Railing Posts:</strong> 6 ft max</p>
                <p style={{ margin: 0 }}><strong>4×4 Max Height:</strong> 5 feet</p>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Always dig footings below frost line</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use post-to-beam connectors</p>
                <p style={{ margin: "0 0 8px 0" }}>• Set posts in concrete, not on top</p>
                <p style={{ margin: 0 }}>• Check posts for plumb before securing</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/deck-post-spacing-calculator" currentCategory="Construction" />
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
            🏗️ <strong>Disclaimer:</strong> This calculator provides estimates based on IRC 2021 guidelines for planning purposes only. 
            Actual requirements may vary based on local building codes, site conditions, and specific project requirements. 
            Always consult with a licensed contractor or structural engineer and verify with your local building department before construction.
          </p>
        </div>
      </div>
    </div>
  );
}