"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

const beamSpanTable: Record<number, Record<string, number>> = {
  6: { '2-2×6': 6.0, '2-2×8': 8.75, '2-2×10': 10.25, '2-2×12': 11.83, '3-2×8': 10.0, '3-2×10': 11.75, '3-2×12': 13.5 },
  8: { '2-2×6': 5.17, '2-2×8': 7.58, '2-2×10': 8.83, '2-2×12': 10.17, '3-2×8': 8.67, '3-2×10': 10.17, '3-2×12': 11.67 },
  10: { '2-2×6': 4.58, '2-2×8': 6.75, '2-2×10': 7.83, '2-2×12': 9.08, '3-2×8': 7.75, '3-2×10': 9.0, '3-2×12': 10.42 },
  12: { '2-2×6': 4.17, '2-2×8': 6.17, '2-2×10': 7.17, '2-2×12': 8.25, '3-2×8': 7.08, '3-2×10': 8.25, '3-2×12': 9.5 },
  14: { '2-2×6': 3.83, '2-2×8': 5.67, '2-2×10': 6.58, '2-2×12': 7.58, '3-2×8': 6.5, '3-2×10': 7.58, '3-2×12': 8.75 },
  16: { '2-2×6': 3.5, '2-2×8': 5.25, '2-2×10': 6.08, '2-2×12': 7.0, '3-2×8': 6.0, '3-2×10': 7.0, '3-2×12': 8.08 },
  18: { '2-2×6': 3.25, '2-2×8': 4.83, '2-2×10': 5.67, '2-2×12': 6.5, '3-2×8': 5.58, '3-2×10': 6.5, '3-2×12': 7.5 },
};

const woodSpecies = [
  { name: 'Southern Pine', factor: 1.0 },
  { name: 'Douglas Fir-Larch', factor: 0.95 },
  { name: 'Hem-Fir', factor: 0.85 },
  { name: 'Spruce-Pine-Fir (SPF)', factor: 0.85 },
  { name: 'Redwood', factor: 0.80 },
  { name: 'Western Cedar', factor: 0.75 },
];

const loadTypes = [
  { name: 'Standard Deck (40 PSF)', factor: 1.0 },
  { name: 'Heavy Use / Snow (50 PSF)', factor: 0.9 },
  { name: 'Hot Tub / Heavy Load (60 PSF)', factor: 0.8 },
];

const footingSizes: Record<number, { clay: number; sand: number; gravel: number }> = {
  2000: { clay: 12, sand: 10, gravel: 8 },
  3000: { clay: 15, sand: 12, gravel: 10 },
  4000: { clay: 17, sand: 14, gravel: 12 },
  5000: { clay: 19, sand: 16, gravel: 14 },
  6000: { clay: 21, sand: 18, gravel: 15 },
};

const railingMaterials = [
  { name: 'Wood 4×4', maxSpacing: 6 },
  { name: 'Wood 6×6', maxSpacing: 8 },
  { name: 'Aluminum (Standard)', maxSpacing: 6 },
  { name: 'Aluminum (Heavy Duty)', maxSpacing: 8 },
  { name: 'Composite', maxSpacing: 6 },
  { name: 'Steel/Iron', maxSpacing: 8 },
];

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

function feetToFeetInches(feet: number): string {
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  if (inches === 12) return `${wholeFeet + 1}'-0"`;
  if (inches === 0) return `${wholeFeet}'-0"`;
  return `${wholeFeet}'-${inches}"`;
}

export default function DeckPostSpacingCalculator() {
  const [activeTab, setActiveTab] = useState<'layout' | 'beam' | 'railing'>('layout');
  
  const [deckLength, setDeckLength] = useState(16);
  const [deckWidth, setDeckWidth] = useState(12);
  const [deckHeight, setDeckHeight] = useState<'ground' | 'low' | 'medium' | 'high'>('low');
  const [joistSpacing, setJoistSpacing] = useState(16);
  const [selectedSpecies, setSelectedSpecies] = useState(0);
  const [selectedLoad, setSelectedLoad] = useState(0);
  const [soilType, setSoilType] = useState<'clay' | 'sand' | 'gravel'>('clay');
  const [isAttached, setIsAttached] = useState(true);
  
  const [beamJoistSpan, setBeamJoistSpan] = useState(10);
  const [beamPostSpacing, setBeamPostSpacing] = useState(8);
  const [beamSpecies, setBeamSpecies] = useState(0);
  
  const [railingLength, setRailingLength] = useState(40);
  const [railingMaterial, setRailingMaterial] = useState(0);

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

  const MAIN_COLOR = "#D97706";
  const RESULT_COLOR = "#059669";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFFBEB, #FFF7ED, #FEF3C7)" }}>
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
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📐</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Deck Post Spacing Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free layout planner with visual diagram. Calculate post positions, beam sizes, and footing requirements per IRC 2021.
          </p>
        </div>

        <div style={{ backgroundColor: "#FEF3C7", borderRadius: "12px", padding: "20px 24px", marginBottom: "32px", border: "1px solid #FCD34D" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: 600, color: "#92400E", margin: "0 0 4px 0" }}>Quick Answer</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem" }}>
                Standard deck posts: space 6–8 ft apart (4×4 max 6 ft, 6×6 max 8 ft). Railing posts: max 6 ft for code compliance. Exact spacing depends on beam size, joist span, and species.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
          {[
            { id: 'layout', icon: '📐', label: 'Post Layout Planner' },
            { id: 'beam', icon: '🪵', label: 'Beam Span Calculator' },
            { id: 'railing', icon: '🚧', label: 'Railing Posts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                fontWeight: 600,
                border: activeTab === tab.id ? "none" : "1px solid #E5E7EB",
                backgroundColor: activeTab === tab.id ? MAIN_COLOR : "white",
                color: activeTab === tab.id ? "white" : "#4B5563",
                boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.2)" : "none"
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "24px" }}>
          <div>
            {activeTab === 'layout' && (
              <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ backgroundColor: MAIN_COLOR, padding: "16px 20px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>📐 Deck Dimensions & Settings</h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Deck Type</label>
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
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: `2px solid ${isAttached === opt.value ? "#F59E0B" : "#E5E7EB"}`,
                            backgroundColor: isAttached === opt.value ? "#FFFBEB" : "white",
                            color: isAttached === opt.value ? "#92400E" : "#374151",
                            fontWeight: 600
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Deck Length (parallel to house)</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={deckLength}
                          onChange={(e) => setDeckLength(Math.max(4, Number(e.target.value)))}
                          style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", paddingRight: "36px", outline: "none" }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }}>ft</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Deck Width (away from house)</label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={deckWidth}
                          onChange={(e) => setDeckWidth(Math.max(4, Number(e.target.value)))}
                          style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", paddingRight: "36px", outline: "none" }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }}>ft</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Deck Height</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
                            padding: "6px 10px",
                            borderRadius: "10px",
                            border: `2px solid ${deckHeight === opt.value ? "#F59E0B" : "#E5E7EB"}`,
                            backgroundColor: deckHeight === opt.value ? "#FFFBEB" : "white",
                            color: deckHeight === opt.value ? "#92400E" : "#374151",
                            fontWeight: 600,
                            fontSize: "0.9rem"
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Wood Species</label>
                      <select
                        value={selectedSpecies}
                        onChange={(e) => setSelectedSpecies(Number(e.target.value))}
                        style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", outline: "none" }}
                      >
                        {woodSpecies.map((species, idx) => (
                          <option key={idx} value={idx}>{species.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Load Type</label>
                      <select
                        value={selectedLoad}
                        onChange={(e) => setSelectedLoad(Number(e.target.value))}
                        style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", outline: "none" }}
                      >
                        {loadTypes.map((load, idx) => (
                          <option key={idx} value={idx}>{load.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>Soil Type (for footing size)</label>
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
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: `2px solid ${soilType === opt.value ? "#F59E0B" : "#E5E7EB"}`,
                            backgroundColor: soilType === opt.value ? "#FFFBEB" : "white",
                            color: soilType === opt.value ? "#92400E" : "#374151",
                            fontWeight: 600,
                            fontSize: "0.9rem"
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'beam' && (
              <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ backgroundColor: MAIN_COLOR, padding: "16px 20px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>🪵 Beam Span Requirements</h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "10px", padding: "12px", margin: 0 }}>
                    Enter your joist span and desired post spacing to find the required beam size per IRC 2021.
                  </p>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                        Joist Span (ledger to beam)
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={beamJoistSpan}
                          onChange={(e) => setBeamJoistSpan(Math.max(6, Math.min(18, Number(e.target.value))))}
                          style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", paddingRight: "36px", outline: "none" }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }}>ft</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                        Desired Post Spacing
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={beamPostSpacing}
                          onChange={(e) => setBeamPostSpacing(Math.max(4, Math.min(12, Number(e.target.value))))}
                          style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", paddingRight: "36px", outline: "none" }}
                        />
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }}>ft</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Wood Species</label>
                    <select
                      value={beamSpecies}
                      onChange={(e) => setBeamSpecies(Number(e.target.value))}
                      style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", outline: "none" }}
                    >
                      {woodSpecies.map((species, idx) => (
                        <option key={idx} value={idx}>{species.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <h3 style={{ fontWeight: 600, color: "#1F2937", marginBottom: "8px" }}>Beam Options (IRC 2021)</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", fontSize: "0.95rem", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#FFFBEB" }}>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>Beam Size</th>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>Max Span</th>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {beamResults.map((result, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB", backgroundColor: result.suitable ? "#ECFDF5" : "white" }}>
                              <td style={{ padding: "8px 12px", fontWeight: 600 }}>{result.beam}</td>
                              <td style={{ padding: "8px 12px" }}>{feetToFeetInches(result.maxSpan)}</td>
                              <td style={{ padding: "8px 12px" }}>
                                {result.suitable ? (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: RESULT_COLOR, fontWeight: 600 }}>
                                    <span>✓</span> OK
                                  </span>
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
            )}

            {activeTab === 'railing' && (
              <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ backgroundColor: MAIN_COLOR, padding: "16px 20px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>🚧 Railing Post Calculator</h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: "0.9rem", color: "#4B5563", backgroundColor: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: "10px", padding: "12px", margin: 0 }}>
                    Calculate how many railing posts you need based on total railing length and material type.
                  </p>
                  
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
                      Total Railing Length
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={railingLength}
                        onChange={(e) => setRailingLength(Math.max(1, Number(e.target.value)))}
                        style={{ width: "100%", border: "1px solid #D1D5DB", borderRadius: "10px", padding: "8px 12px", paddingRight: "36px", outline: "none" }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "0.85rem" }}>ft</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#374151", margin: "12px 0 8px 0" }}>Post Material</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {railingMaterials.map((material, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRailingMaterial(idx)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: "10px",
                            border: `2px solid ${railingMaterial === idx ? "#F59E0B" : "#E5E7EB"}`,
                            backgroundColor: railingMaterial === idx ? "#FFFBEB" : "white",
                            color: railingMaterial === idx ? "#92400E" : "#374151",
                            fontWeight: 600,
                            textAlign: "left"
                          }}
                        >
                          <div>{material.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>Max {material.maxSpacing}ft spacing</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ backgroundColor: RESULT_COLOR, padding: "16px 20px" }}>
                  <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>📊 Visual Post Layout</h2>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", overflowX: "auto" }}>
                    <svg viewBox={`-20 -20 ${deckLength * 20 + 60} ${deckWidth * 20 + 80}`} style={{ width: "100%", maxWidth: "700px", display: "block", margin: "0 auto", minHeight: "200px" }}>
                      {isAttached && (
                        <>
                          <rect x={-15} y={-15} width={deckLength * 20 + 30} height={15} fill="#8B7355" />
                          <text x={deckLength * 10} y={-5} textAnchor="middle" fontSize="10" fill="#fff">HOUSE</text>
                        </>
                      )}
                      <rect x={0} y={0} width={deckLength * 20} height={deckWidth * 20} fill="#DEB887" stroke="#8B7355" strokeWidth="2" />
                      {Array.from({ length: Math.floor(deckWidth * 20 / 8) }).map((_, i) => (
                        <line key={i} x1={0} y1={i * 8 + 4} x2={deckLength * 20} y2={i * 8 + 4} stroke="#C4A574" strokeWidth="1" />
                      ))}
                      {layoutResults.postPositions.filter((p, i, arr) => i === 0 || arr[i-1]?.row !== p.row).map((firstPost, idx) => (
                        <line key={`beam-${idx}`} x1={0} y1={firstPost.y * 20} x2={deckLength * 20} y2={firstPost.y * 20} stroke="#654321" strokeWidth="4" strokeDasharray="none" />
                      ))}
                      {layoutResults.postPositions.map((post, idx) => (
                        <g key={idx}>
                          <circle cx={post.x * 20} cy={post.y * 20} r={8} fill="#4A3728" stroke="#2D1F14" strokeWidth="2" />
                          <text x={post.x * 20} y={post.y * 20 + 3} textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">{idx + 1}</text>
                        </g>
                      ))}
                      <text x={deckLength * 10} y={deckWidth * 20 + 30} textAnchor="middle" fontSize="11" fill="#333">{deckLength} ft</text>
                      <text x={deckLength * 20 + 25} y={deckWidth * 10} textAnchor="middle" fontSize="11" fill="#333" transform={`rotate(90, ${deckLength * 20 + 25}, ${deckWidth * 10})`}>{deckWidth} ft</text>
                      {layoutResults.postsPerRow > 1 && (
                        <>
                          <line x1={0} y1={deckWidth * 20 + 45} x2={layoutResults.actualSpacing * 20} y2={deckWidth * 20 + 45} stroke={MAIN_COLOR} strokeWidth="2" markerEnd="url(#arrowhead)" markerStart="url(#arrowhead-start)" />
                          <text x={layoutResults.actualSpacing * 10} y={deckWidth * 20 + 58} textAnchor="middle" fontSize="10" fill={MAIN_COLOR} fontWeight="bold">
                            {feetToFeetInches(layoutResults.actualSpacing)} spacing
                          </text>
                        </>
                      )}
                      <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill={MAIN_COLOR} />
                        </marker>
                        <marker id="arrowhead-start" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                          <polygon points="0 0, 6 3, 0 6" fill={MAIN_COLOR} />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  <div style={{ marginTop: "8px", textAlign: "center", fontSize: "0.9rem", color: "#6B7280" }}>● = Post location | Dark line = Beam</div>
                </div>
              </div>
            )}
          </div>

          <div className="calc-results" style={{ position: "sticky", top: "16px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden" }}>
              <div style={{ backgroundColor: RESULT_COLOR, padding: "16px 20px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>📋 Results & Recommendations</h2>
              </div>
              
              {activeTab === 'layout' && (
                <div style={{ padding: "20px" }}>
                  <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginBottom: "6px" }}>Total Posts Needed</div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#92400E" }}>{layoutResults.totalPosts}</div>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginTop: "6px" }}>
                      {layoutResults.postsPerRow} per beam × {layoutResults.beamRows} beam{layoutResults.beamRows > 1 ? 's' : ''}
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    {[
                      { label: "Post Spacing", value: feetToFeetInches(layoutResults.actualSpacing) },
                      { label: "Recommended Post Size", value: layoutResults.postSize },
                      { label: "Recommended Beam", value: layoutResults.recommendedBeam },
                      { label: "Joist Span", value: `${layoutResults.joistSpan} ft` },
                      { label: `Footing Diameter (${soilType})`, value: `${layoutResults.footingDiameter}"` },
                      { label: "Deck Area", value: `${deckLength * deckWidth} sq ft` },
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space_between", alignItems: "center", padding: "8px 0", borderBottom: idx < 5 ? "1px solid #E5E7EB" : "none" }}>
                        <span style={{ color: "#6B7280" }}>{row.label}</span>
                        <span style={{ fontWeight: 600, color: "#111827" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderRadius: "10px", padding: "12px", marginTop: "12px", backgroundColor: layoutResults.postSize === '6×6' || layoutResults.actualSpacing <= 8 ? "#ECFDF5" : "#FEF9C3", border: layoutResults.postSize === '6×6' || layoutResults.actualSpacing <= 8 ? "1px solid #A7F3D0" : "1px solid #FDE68A" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{layoutResults.actualSpacing <= 8 ? '✅' : '⚠️'}</span>
                      <span style={{ fontWeight: 600, color: "#1F2937" }}>
                        {layoutResults.actualSpacing <= 8 ? 'IRC 2021 Compliant' : 'Check Local Code'}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "6px" }}>
                      Based on IRC Table R507.5 for {woodSpecies[selectedSpecies].name}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'beam' && (
                <div style={{ padding: "20px" }}>
                  <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginBottom: "6px" }}>Minimum Required Beam</div>
                    <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#92400E" }}>
                      {beamResults.find(r => r.suitable)?.beam || 'N/A'}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginTop: "6px" }}>
                      for {beamPostSpacing}ft post spacing
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE", marginTop: "12px" }}>
                    <div style={{ fontWeight: 600, color: "#1D4ED8", marginBottom: "6px" }}>📝 Notes</div>
                    <ul style={{ fontSize: "0.9rem", color: "#1D4ED8", margin: 0, paddingLeft: "20px" }}>
                      <li>Values based on IRC 2021 Table R507.5</li>
                      <li>Assumes 40 PSF live load + 10 PSF dead load</li>
                      <li>Always verify with local building code</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'railing' && (
                <div style={{ padding: "20px" }}>
                  <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginBottom: "6px" }}>Railing Posts Needed</div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#92400E" }}>{railingResults.posts}</div>
                    <div style={{ fontSize: "0.9rem", color: "#92400E", marginTop: "6px" }}>
                      {railingResults.sections} sections
                    </div>
                  </div>

                  <div style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ color: "#6B7280" }}>Actual Spacing</span>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{feetToFeetInches(railingResults.actualSpacing)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                      <span style={{ color: "#6B7280" }}>Max Allowed</span>
                      <span style={{ fontWeight: 600, color: "#111827" }}>{railingResults.maxSpacing} ft</span>
                    </div>
                  </div>

                  <div style={{ borderRadius: "10px", padding: "12px", marginTop: "12px", backgroundColor: railingResults.isCompliant ? "#ECFDF5" : "#FEE2E2", border: railingResults.isCompliant ? "1px solid #A7F3D0" : "1px solid #FCA5A5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{railingResults.isCompliant ? '✅' : '❌'}</span>
                      <span style={{ fontWeight: 600 }}>
                        {railingResults.isCompliant ? 'Code Compliant' : 'Exceeds Maximum Spacing'}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "6px" }}>
                      Railing must withstand 200 lb lateral force
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden", marginTop: "24px" }}>
          <div style={{ backgroundColor: "#374151", padding: "16px 20px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>📋 Quick Reference: IRC 2021 Beam Span Table (Southern Pine, 40 PSF)</h2>
          </div>
          <div style={{ padding: "20px", overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.95rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>Joist Span</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>2-2×8</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>2-2×10</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>2-2×12</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>3-2×10</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderBottom: "1px solid #E5E7EB" }}>3-2×12</th>
                </tr>
              </thead>
              <tbody>
                {[6, 8, 10, 12, 14, 16].map((joistSpan) => (
                  <tr key={joistSpan} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{joistSpan} ft</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×8'])}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×10'])}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['2-2×12'])}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['3-2×10'])}</td>
                    <td style={{ padding: "8px 12px", textAlign: "center" }}>{feetToFeetInches(beamSpanTable[joistSpan]['3-2×12'])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ marginTop: "8px", fontSize: "0.8rem", color: "#6B7280" }}>
              * Values show maximum beam span (distance between posts). Based on No. 2 grade lumber, wet service conditions, L/360 deflection limit.
            </p>
          </div>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", overflow: "hidden", marginTop: "24px" }}>
          <div style={{ backgroundColor: MAIN_COLOR, padding: "16px 20px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>❓ Frequently Asked Questions</h2>
          </div>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} style={{ borderBottom: "1px solid #E5E7EB" }}>
                <details>
                  <summary style={{ cursor: "pointer", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, color: "#111827", paddingRight: "16px" }}>{faq.question}</span>
                    <span style={{ color: MAIN_COLOR }}>▼</span>
                  </summary>
                  <div style={{ padding: "0 20px 16px 20px", color: "#4B5563", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <RelatedTools currentCategory="Construction" currentUrl="/deck-post-spacing-calculator" />
        </div>

        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🪵 Disclaimer: This calculator provides estimates based on IRC 2021 residential deck guidance. Actual requirements may vary by local building codes, lumber grade, and site conditions. Always confirm with your local building department.
          </p>
        </div>
      </div>
    </div>
  );
}

