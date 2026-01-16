"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// IRC 2021 Beam Span Table (Southern Pine, 40 PSF)
// Format: { joistSpan: { beamSize: maxPostSpacing } }
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

// Footing sizes based on load (lbs)
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
  const [joistSpacing, setJoistSpacing] = useState(16);
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
    
    // Determine joist span (deck width for attached, or deck width / 2 for freestanding with center beam)
    const joistSpan = isAttached ? deckWidth : Math.ceil(deckWidth / 2);
    const effectiveJoistSpan = Math.min(Math.max(6, Math.ceil(joistSpan / 2) * 2), 18);
    
    // Get beam span table for this joist span
    const spanData = beamSpanTable[effectiveJoistSpan] || beamSpanTable[12];
    
    // Find suitable beam and post spacing
    let recommendedBeam = '2-2×10';
    let maxPostSpacing = 6;
    
    // Try to find the smallest beam that allows reasonable spacing
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
    
    // Calculate number of posts per beam row
    const postsPerRow = Math.ceil(deckLength / maxPostSpacing) + 1;
    const actualSpacing = deckLength / (postsPerRow - 1);
    
    // Number of beam rows (1 for attached, 2 for freestanding)
    const beamRows = isAttached ? 1 : 2;
    const totalPosts = postsPerRow * beamRows;
    
    // Post size recommendation
    const postSize = (deckHeight === 'high' || deckHeight === 'medium' || actualSpacing > 6) ? '6×6' : '4×4';
    
    // Footing size calculation
    const tributaryArea = actualSpacing * joistSpan;
    const loadPerPost = tributaryArea * (selectedLoad === 0 ? 50 : selectedLoad === 1 ? 60 : 70);
    const footingKey = Math.ceil(loadPerPost / 1000) * 1000;
    const footingData = footingSizes[Math.min(footingKey, 6000)] || footingSizes[6000];
    
    // Generate post positions for visualization
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-800 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-amber-200 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors">
            <span>←</span> <span>Back to All Calculators</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">
            Deck Post Spacing Calculator
          </h1>
          <p className="text-amber-100 text-lg max-w-2xl">
            Free layout planner with visual diagram. Calculate post positions, beam sizes, and footing requirements per IRC 2021.
          </p>
        </div>
      </div>

      {/* Quick Answer Box */}
      <div className="max-w-6xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg border-l-4 border-amber-500 p-4 md:p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 font-bold text-sm">💡</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Quick Answer</h2>
              <p className="text-gray-600 text-sm">
                <strong>Standard deck posts:</strong> Space 6-8 feet apart (4×4 max 6ft, 6×6 max 8ft). 
                <strong> Railing posts:</strong> Max 6 feet for code compliance.
                The exact spacing depends on beam size, joist span, and wood species.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'layout', icon: '📐', label: 'Post Layout Planner' },
            { id: 'beam', icon: '🪵', label: 'Beam Span Calculator' },
            { id: 'railing', icon: '🚧', label: 'Railing Posts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 calc-grid" style={{ gridTemplateColumns: '3fr 2fr' }}>
          {/* Input Panel */}
          <div className="lg:col-span-3 space-y-4">
            {activeTab === 'layout' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <span>📐</span> Deck Dimensions & Settings
                  </h2>
                </div>
                <div className="p-5 space-y-5">
                  {/* Attachment Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deck Type</label>
                    <div className="flex gap-2">
                      {[
                        { value: true, label: 'Attached (Ledger)' },
                        { value: false, label: 'Freestanding' }
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          onClick={() => setIsAttached(opt.value)}
                          className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                            isAttached === opt.value
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Dimensions */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deck Length (parallel to house)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deckLength}
                          onChange={(e) => setDeckLength(Math.max(4, Number(e.target.value)))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deck Width (away from house)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={deckWidth}
                          onChange={(e) => setDeckWidth(Math.max(4, Number(e.target.value)))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                      </div>
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deck Height</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'ground', label: 'Ground Level' },
                        { value: 'low', label: 'Up to 5 ft' },
                        { value: 'medium', label: '5-8 ft' },
                        { value: 'high', label: '8+ ft' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDeckHeight(opt.value as typeof deckHeight)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all ${
                            deckHeight === opt.value
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wood Species & Load */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Wood Species</label>
                      <select
                        value={selectedSpecies}
                        onChange={(e) => setSelectedSpecies(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        {woodSpecies.map((species, idx) => (
                          <option key={idx} value={idx}>{species.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Load Type</label>
                      <select
                        value={selectedLoad}
                        onChange={(e) => setSelectedLoad(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        {loadTypes.map((load, idx) => (
                          <option key={idx} value={idx}>{load.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Soil Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type (for footing size)</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'clay', label: 'Clay' },
                        { value: 'sand', label: 'Sand' },
                        { value: 'gravel', label: 'Gravel' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSoilType(opt.value as typeof soilType)}
                          className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            soilType === opt.value
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <span>🪵</span> Beam Span Requirements
                  </h2>
                </div>
                <div className="p-5 space-y-5">
                  <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                    Enter your joist span and desired post spacing to find the required beam size per IRC 2021.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joist Span (ledger to beam)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={beamJoistSpan}
                          onChange={(e) => setBeamJoistSpan(Math.max(6, Math.min(18, Number(e.target.value))))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desired Post Spacing
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={beamPostSpacing}
                          onChange={(e) => setBeamPostSpacing(Math.max(4, Math.min(12, Number(e.target.value))))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wood Species</label>
                    <select
                      value={beamSpecies}
                      onChange={(e) => setBeamSpecies(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {woodSpecies.map((species, idx) => (
                        <option key={idx} value={idx}>{species.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Beam Options Table */}
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-800 mb-2">Beam Options (IRC 2021)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-amber-50">
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Beam Size</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Max Span</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {beamResults.map((result, idx) => (
                            <tr key={idx} className={`border-b ${result.suitable ? 'bg-green-50' : ''}`}>
                              <td className="px-3 py-2 font-medium">{result.beam}</td>
                              <td className="px-3 py-2">{feetToFeetInches(result.maxSpan)}</td>
                              <td className="px-3 py-2">
                                {result.suitable ? (
                                  <span className="inline-flex items-center gap-1 text-green-700 font-medium">
                                    <span>✓</span> OK
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Too short</span>
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
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-5 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <span>🚧</span> Railing Post Calculator
                  </h2>
                </div>
                <div className="p-5 space-y-5">
                  <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg">
                    Calculate how many railing posts you need based on total railing length and material type.
                  </p>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Railing Length
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={railingLength}
                        onChange={(e) => setRailingLength(Math.max(1, Number(e.target.value)))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ft</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Post Material</label>
                    <div className="grid grid-cols-2 gap-2">
                      {railingMaterials.map((material, idx) => (
                        <button
                          key={idx}
                          onClick={() => setRailingMaterial(idx)}
                          className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all text-left ${
                            railingMaterial === idx
                              ? 'border-amber-500 bg-amber-50 text-amber-700'
                              : 'border-gray-200 hover:border-amber-300'
                          }`}
                        >
                          <div>{material.name}</div>
                          <div className="text-xs text-gray-500">Max {material.maxSpacing}ft spacing</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Layout Diagram - only for layout tab */}
            {activeTab === 'layout' && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3">
                  <h2 className="font-semibold flex items-center gap-2">
                    <span>📊</span> Visual Post Layout
                  </h2>
                </div>
                <div className="p-5">
                  <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto">
                    <svg viewBox={`-20 -20 ${deckLength * 20 + 60} ${deckWidth * 20 + 80}`} className="w-full max-w-2xl mx-auto" style={{ minHeight: '200px' }}>
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
                          strokeDasharray="none"
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
                            markerEnd="url(#arrowhead)"
                            markerStart="url(#arrowhead-start)"
                          />
                          <text x={layoutResults.actualSpacing * 10} y={deckWidth * 20 + 58} textAnchor="middle" fontSize="10" fill="#D97706" fontWeight="bold">
                            {feetToFeetInches(layoutResults.actualSpacing)} spacing
                          </text>
                        </>
                      )}
                      
                      {/* Arrow markers */}
                      <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                          <polygon points="0 0, 6 3, 0 6" fill="#D97706" />
                        </marker>
                        <marker id="arrowhead-start" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
                          <polygon points="0 0, 6 3, 0 6" fill="#D97706" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  <div className="mt-3 text-center text-sm text-gray-500">
                    ● = Post location &nbsp;|&nbsp; Dark line = Beam
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 calc-results">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <span>📋</span> Results & Recommendations
                </h2>
              </div>
              
              {activeTab === 'layout' && (
                <div className="p-5 space-y-4">
                  {/* Primary Results */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-200">
                    <div className="text-sm text-amber-700 mb-1">Total Posts Needed</div>
                    <div className="text-4xl font-bold text-amber-800">{layoutResults.totalPosts}</div>
                    <div className="text-sm text-amber-600 mt-1">
                      {layoutResults.postsPerRow} per beam × {layoutResults.beamRows} beam{layoutResults.beamRows > 1 ? 's' : ''}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Post Spacing</span>
                      <span className="font-semibold text-gray-900">{feetToFeetInches(layoutResults.actualSpacing)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Recommended Post Size</span>
                      <span className="font-semibold text-gray-900">{layoutResults.postSize}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Recommended Beam</span>
                      <span className="font-semibold text-gray-900">{layoutResults.recommendedBeam}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Joist Span</span>
                      <span className="font-semibold text-gray-900">{layoutResults.joistSpan} ft</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Footing Diameter ({soilType})</span>
                      <span className="font-semibold text-gray-900">{layoutResults.footingDiameter}"</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Deck Area</span>
                      <span className="font-semibold text-gray-900">{deckLength * deckWidth} sq ft</span>
                    </div>
                  </div>

                  {/* Code Compliance */}
                  <div className={`rounded-lg p-3 ${layoutResults.postSize === '6×6' || layoutResults.actualSpacing <= 8 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center gap-2">
                      <span>{layoutResults.actualSpacing <= 8 ? '✅' : '⚠️'}</span>
                      <span className="font-medium text-gray-800">
                        {layoutResults.actualSpacing <= 8 ? 'IRC 2021 Compliant' : 'Check Local Code'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Based on IRC Table R507.5 for {woodSpecies[selectedSpecies].name}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'beam' && (
                <div className="p-5 space-y-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-200">
                    <div className="text-sm text-amber-700 mb-1">Minimum Required Beam</div>
                    <div className="text-3xl font-bold text-amber-800">
                      {beamResults.find(r => r.suitable)?.beam || 'N/A'}
                    </div>
                    <div className="text-sm text-amber-600 mt-1">
                      for {beamPostSpacing}ft post spacing
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="font-medium text-blue-800 mb-1">📝 Notes</div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Values based on IRC 2021 Table R507.5</li>
                      <li>• Assumes 40 PSF live load + 10 PSF dead load</li>
                      <li>• Always verify with local building code</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'railing' && (
                <div className="p-5 space-y-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center border border-amber-200">
                    <div className="text-sm text-amber-700 mb-1">Railing Posts Needed</div>
                    <div className="text-4xl font-bold text-amber-800">{railingResults.posts}</div>
                    <div className="text-sm text-amber-600 mt-1">
                      {railingResults.sections} sections
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Actual Spacing</span>
                      <span className="font-semibold text-gray-900">{feetToFeetInches(railingResults.actualSpacing)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Max Allowed</span>
                      <span className="font-semibold text-gray-900">{railingResults.maxSpacing} ft</span>
                    </div>
                  </div>

                  <div className={`rounded-lg p-3 ${railingResults.isCompliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2">
                      <span>{railingResults.isCompliant ? '✅' : '❌'}</span>
                      <span className="font-medium">
                        {railingResults.isCompliant ? 'Code Compliant' : 'Exceeds Maximum Spacing'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Railing must withstand 200 lb lateral force
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reference Tables */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden content-sidebar">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-5 py-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span>📋</span> Quick Reference: IRC 2021 Beam Span Table (Southern Pine, 40 PSF)
            </h2>
          </div>
          <div className="p-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Joist Span</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">2-2×8</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">2-2×10</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">2-2×12</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">3-2×10</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-700">3-2×12</th>
                </tr>
              </thead>
              <tbody>
                {[6, 8, 10, 12, 14, 16].map((joistSpan) => (
                  <tr key={joistSpan} className="border-b hover:bg-amber-50">
                    <td className="px-3 py-2 font-medium">{joistSpan} ft</td>
                    <td className="px-3 py-2 text-center">{feetToFeetInches(beamSpanTable[joistSpan]['2-2×8'])}</td>
                    <td className="px-3 py-2 text-center">{feetToFeetInches(beamSpanTable[joistSpan]['2-2×10'])}</td>
                    <td className="px-3 py-2 text-center">{feetToFeetInches(beamSpanTable[joistSpan]['2-2×12'])}</td>
                    <td className="px-3 py-2 text-center">{feetToFeetInches(beamSpanTable[joistSpan]['3-2×10'])}</td>
                    <td className="px-3 py-2 text-center">{feetToFeetInches(beamSpanTable[joistSpan]['3-2×12'])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-gray-500">
              * Values show maximum beam span (distance between posts). Based on No. 2 grade lumber, wet service conditions, L/360 deflection limit.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-amber-700 to-orange-700 text-white px-5 py-3">
            <h2 className="font-semibold flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </h2>
          </div>
          <div className="divide-y">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="px-5 py-4 cursor-pointer hover:bg-amber-50 flex items-center justify-between">
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-8">
          <RelatedTools currentCategory="Construction" currentUrl="/deck-post-spacing-calculator" />
        </div>
      </div>
    </div>
  );
}