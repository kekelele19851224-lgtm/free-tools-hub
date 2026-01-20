"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Bathroom sizes presets
const bathroomSizes = [
  { id: 'powder', label: 'Powder Room', sqft: 20, dimensions: '4×5' },
  { id: 'small', label: 'Small Bath', sqft: 35, dimensions: '5×7' },
  { id: 'medium', label: 'Medium Bath', sqft: 50, dimensions: '5×10' },
  { id: 'large', label: 'Large Bath', sqft: 80, dimensions: '8×10' },
  { id: 'master', label: 'Master Bath', sqft: 100, dimensions: '10×10' },
  { id: 'custom', label: 'Custom Size', sqft: 0, dimensions: 'Custom' },
];

// Remodel levels
const remodelLevels = [
  { 
    id: 'budget', 
    label: 'Budget', 
    emoji: '💰',
    description: 'Basic updates, stock materials',
    costPerSqft: { min: 70, max: 100 },
    multiplier: 0.7
  },
  { 
    id: 'midrange', 
    label: 'Mid-Range', 
    emoji: '⭐',
    description: 'Quality fixtures, tile work',
    costPerSqft: { min: 100, max: 180 },
    multiplier: 1.0
  },
  { 
    id: 'upscale', 
    label: 'Upscale', 
    emoji: '✨',
    description: 'Premium materials, custom work',
    costPerSqft: { min: 180, max: 250 },
    multiplier: 1.4
  },
  { 
    id: 'luxury', 
    label: 'Luxury', 
    emoji: '👑',
    description: 'High-end finishes, spa features',
    costPerSqft: { min: 250, max: 400 },
    multiplier: 2.0
  },
];

// Region cost adjustments
const regions = [
  { id: 'low', label: 'Low Cost Area', description: 'Rural, Midwest', multiplier: 0.85 },
  { id: 'average', label: 'Average Cost', description: 'National Average', multiplier: 1.0 },
  { id: 'high', label: 'High Cost Area', description: 'Major Cities, Coastal', multiplier: 1.25 },
];

// Detailed estimate options
const vanityOptions = [
  { id: 'basic', label: 'Basic Vanity', price: 300, description: 'Builder-grade, laminate' },
  { id: 'stock', label: 'Stock Vanity', price: 800, description: 'Pre-made, wood composite' },
  { id: 'semicustom', label: 'Semi-Custom', price: 1500, description: 'Modified stock options' },
  { id: 'custom', label: 'Custom Vanity', price: 3500, description: 'Built to specification' },
];

const sinkOptions = [
  { id: 'basic', label: 'Basic Sink & Faucet', price: 200, description: 'Chrome, drop-in' },
  { id: 'standard', label: 'Standard', price: 500, description: 'Undermount, brushed nickel' },
  { id: 'premium', label: 'Premium', price: 1000, description: 'Vessel sink, designer faucet' },
];

const toiletOptions = [
  { id: 'basic', label: 'Basic Toilet', price: 200, description: 'Standard height, round' },
  { id: 'standard', label: 'Standard', price: 400, description: 'Comfort height, elongated' },
  { id: 'comfort', label: 'Comfort Height', price: 600, description: 'ADA compliant, dual flush' },
  { id: 'smart', label: 'Smart Toilet', price: 1500, description: 'Bidet, heated seat, auto-flush' },
];

const showerTubOptions = [
  { id: 'tub', label: 'Standard Tub', price: 600, description: 'Alcove tub, basic surround' },
  { id: 'combo', label: 'Tub/Shower Combo', price: 1500, description: 'Tub with tile surround' },
  { id: 'walkin', label: 'Walk-in Shower', price: 3500, description: 'Glass door, tile walls' },
  { id: 'luxury', label: 'Luxury Shower', price: 8000, description: 'Frameless glass, multiple heads' },
];

const floorTileOptions = [
  { id: 'vinyl', label: 'Vinyl/LVP', pricePerSqft: 5, description: 'Waterproof, easy install' },
  { id: 'ceramic', label: 'Ceramic Tile', pricePerSqft: 10, description: 'Durable, many styles' },
  { id: 'porcelain', label: 'Porcelain Tile', pricePerSqft: 18, description: 'Premium durability' },
  { id: 'stone', label: 'Natural Stone', pricePerSqft: 35, description: 'Marble, travertine' },
];

const wallTileOptions = [
  { id: 'paint', label: 'Paint Only', pricePerSqft: 3, description: 'Moisture-resistant paint' },
  { id: 'ceramic', label: 'Ceramic Tile', pricePerSqft: 12, description: 'Wet area tile' },
  { id: 'porcelain', label: 'Porcelain Tile', pricePerSqft: 20, description: 'Full wall coverage' },
  { id: 'marble', label: 'Marble/Stone', pricePerSqft: 45, description: 'Luxury finish' },
];

const countertopOptions = [
  { id: 'laminate', label: 'Laminate', pricePerSqft: 25, description: 'Budget-friendly' },
  { id: 'cultured', label: 'Cultured Marble', pricePerSqft: 50, description: 'Integrated sink option' },
  { id: 'quartz', label: 'Quartz', pricePerSqft: 85, description: 'Durable, low maintenance' },
  { id: 'granite', label: 'Granite', pricePerSqft: 110, description: 'Natural stone elegance' },
];

const lightingOptions = [
  { id: 'basic', label: 'Basic Lighting', price: 150, description: 'Single vanity light' },
  { id: 'standard', label: 'Standard', price: 400, description: 'Vanity + recessed' },
  { id: 'premium', label: 'Premium', price: 800, description: 'Layered lighting design' },
];

const additionalFeatures = [
  { id: 'heated_floor', label: 'Heated Floor', price: 1200, description: 'Radiant floor heating' },
  { id: 'towel_warmer', label: 'Towel Warmer', price: 350, description: 'Wall-mounted unit' },
  { id: 'vent_fan', label: 'Exhaust Fan Upgrade', price: 400, description: 'Quiet, high-CFM' },
  { id: 'move_plumbing', label: 'Move Plumbing', price: 2000, description: 'Relocate fixtures' },
  { id: 'electrical', label: 'Electrical Updates', price: 1000, description: 'New circuits, GFCI' },
  { id: 'demo', label: 'Demolition', price: 1500, description: 'Remove existing fixtures' },
  { id: 'permits', label: 'Building Permits', price: 350, description: 'Required for major work' },
];

// FAQ data
const faqs = [
  {
    question: "What is a reasonable budget for a bathroom remodel?",
    answer: "A reasonable budget depends on your bathroom size and goals. For a small bathroom (35 sq ft), expect $6,000-$15,000. Medium bathrooms (50 sq ft) typically cost $8,000-$18,000. Master bathrooms (100+ sq ft) range from $15,000-$35,000. The national average for a mid-range bathroom remodel is around $12,000-$15,000."
  },
  {
    question: "What is the 30% rule for renovations?",
    answer: "The 30% rule suggests that your bathroom renovation budget should not exceed 30% of your home's value divided by the number of bathrooms. For example, if your home is worth $300,000 and has 2 bathrooms, each bathroom renovation shouldn't exceed $45,000 ($300,000 × 30% ÷ 2). This helps ensure you don't over-improve for your neighborhood."
  },
  {
    question: "Can you remodel a bathroom for $5,000?",
    answer: "Yes, but it requires careful planning. For $5,000, you can do cosmetic updates like painting, replacing fixtures, new hardware, a basic vanity swap, and updated lighting. You'll need to keep existing plumbing locations, do some work yourself, and choose budget-friendly materials. A full renovation with new tile, shower, and layout changes typically requires $10,000+."
  },
  {
    question: "How much does a 5x7 bathroom remodel cost?",
    answer: "A 5x7 bathroom (35 sq ft) remodel typically costs $6,000-$15,000 for a mid-range renovation. Budget updates run $3,500-$6,000, while upscale renovations can reach $15,000-$25,000. The smaller size means less material but similar labor costs for plumbing and electrical work."
  },
  {
    question: "How much is labor for a bathroom remodel?",
    answer: "Labor typically accounts for 40-60% of total bathroom remodel costs. For a $15,000 project, expect $6,000-$9,000 in labor. Plumbers charge $45-$200/hour, electricians $50-$200/hour, and tile installers $10-$18/sq ft. Complex projects with plumbing relocation or custom tile work have higher labor percentages."
  },
  {
    question: "What adds the most value to a bathroom remodel?",
    answer: "Updates with the best ROI include: double vanity (most-wanted feature by buyers), walk-in shower conversion, updated tile work, improved lighting, and energy-efficient fixtures. Mid-range remodels typically recoup 60-70% of costs at resale. Focus on neutral colors and timeless designs for best returns."
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

// Progress bar component
function CostBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const percentage = Math.min((amount / total) * 100, 100);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "0.85rem", color: "#374151" }}>{label}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#111827" }}>${amount.toLocaleString()}</span>
      </div>
      <div style={{ height: "8px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ 
          width: `${percentage}%`, 
          height: "100%", 
          backgroundColor: color,
          borderRadius: "4px",
          transition: "width 0.3s ease"
        }} />
      </div>
      <div style={{ textAlign: "right", fontSize: "0.7rem", color: "#9CA3AF", marginTop: "2px" }}>
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
}

export default function BathroomRenovationCostEstimator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'quick' | 'detailed'>('quick');

  // Quick estimate states
  const [selectedSize, setSelectedSize] = useState('medium');
  const [customLength, setCustomLength] = useState(10);
  const [customWidth, setCustomWidth] = useState(5);
  const [selectedLevel, setSelectedLevel] = useState('midrange');
  const [selectedRegion, setSelectedRegion] = useState('average');

  // Detailed estimate states
  const [detailedSqft, setDetailedSqft] = useState(50);
  const [vanity, setVanity] = useState('stock');
  const [sink, setSink] = useState('standard');
  const [toilet, setToilet] = useState('standard');
  const [showerTub, setShowerTub] = useState('combo');
  const [floorTile, setFloorTile] = useState('ceramic');
  const [wallTile, setWallTile] = useState('ceramic');
  const [countertop, setCountertop] = useState('cultured');
  const [lighting, setLighting] = useState('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['demo']);
  const [detailedRegion, setDetailedRegion] = useState('average');
  const [laborPercent, setLaborPercent] = useState(50);
  const [contingency, setContingency] = useState(10);

  // Calculate quick estimate
  const calculateQuickEstimate = () => {
    const sizeData = bathroomSizes.find(s => s.id === selectedSize);
    const sqft = selectedSize === 'custom' ? customLength * customWidth : (sizeData?.sqft || 50);
    const level = remodelLevels.find(l => l.id === selectedLevel);
    const region = regions.find(r => r.id === selectedRegion);

    const baseCostMin = sqft * (level?.costPerSqft.min || 100);
    const baseCostMax = sqft * (level?.costPerSqft.max || 180);
    const regionMultiplier = region?.multiplier || 1;

    return {
      sqft,
      min: Math.round(baseCostMin * regionMultiplier),
      max: Math.round(baseCostMax * regionMultiplier),
      avg: Math.round(((baseCostMin + baseCostMax) / 2) * regionMultiplier),
      costPerSqftMin: Math.round((baseCostMin * regionMultiplier) / sqft),
      costPerSqftMax: Math.round((baseCostMax * regionMultiplier) / sqft),
    };
  };

  // Calculate detailed estimate
  const calculateDetailedEstimate = () => {
    const vanityItem = vanityOptions.find(v => v.id === vanity);
    const sinkItem = sinkOptions.find(s => s.id === sink);
    const toiletItem = toiletOptions.find(t => t.id === toilet);
    const showerItem = showerTubOptions.find(s => s.id === showerTub);
    const floorItem = floorTileOptions.find(f => f.id === floorTile);
    const wallItem = wallTileOptions.find(w => w.id === wallTile);
    const counterItem = countertopOptions.find(c => c.id === countertop);
    const lightItem = lightingOptions.find(l => l.id === lighting);
    const region = regions.find(r => r.id === detailedRegion);

    // Calculate component costs
    const vanityCost = vanityItem?.price || 0;
    const sinkCost = sinkItem?.price || 0;
    const toiletCost = toiletItem?.price || 0;
    const showerCost = showerItem?.price || 0;
    const floorCost = (floorItem?.pricePerSqft || 0) * detailedSqft;
    const wallSqft = detailedSqft * 2.5; // Approximate wall area
    const wallCost = (wallItem?.pricePerSqft || 0) * wallSqft * 0.4; // 40% tile coverage
    const counterSqft = 4; // Approximate counter area
    const counterCost = (counterItem?.pricePerSqft || 0) * counterSqft;
    const lightCost = lightItem?.price || 0;

    // Additional features
    const featuresCost = selectedFeatures.reduce((sum, id) => {
      const feature = additionalFeatures.find(f => f.id === id);
      return sum + (feature?.price || 0);
    }, 0);

    // Materials subtotal
    const materialsCost = vanityCost + sinkCost + toiletCost + showerCost + 
                          floorCost + wallCost + counterCost + lightCost + featuresCost;

    // Labor cost
    const laborCost = materialsCost * (laborPercent / (100 - laborPercent));

    // Subtotal
    const subtotal = materialsCost + laborCost;

    // Apply region multiplier
    const regionMultiplier = region?.multiplier || 1;
    const adjustedSubtotal = subtotal * regionMultiplier;

    // Contingency
    const contingencyCost = adjustedSubtotal * (contingency / 100);
    const total = adjustedSubtotal + contingencyCost;

    return {
      breakdown: {
        vanity: Math.round(vanityCost * regionMultiplier),
        sink: Math.round(sinkCost * regionMultiplier),
        toilet: Math.round(toiletCost * regionMultiplier),
        showerTub: Math.round(showerCost * regionMultiplier),
        flooring: Math.round(floorCost * regionMultiplier),
        wallTile: Math.round(wallCost * regionMultiplier),
        countertop: Math.round(counterCost * regionMultiplier),
        lighting: Math.round(lightCost * regionMultiplier),
        features: Math.round(featuresCost * regionMultiplier),
        labor: Math.round(laborCost * regionMultiplier),
        contingency: Math.round(contingencyCost),
      },
      subtotal: Math.round(adjustedSubtotal),
      total: Math.round(total),
      costPerSqft: Math.round(total / detailedSqft),
    };
  };

  const quickEstimate = calculateQuickEstimate();
  const detailedEstimate = calculateDetailedEstimate();

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EFF6FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BFDBFE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Bathroom Renovation Cost Estimator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>🚿</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Bathroom Renovation Cost Estimator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Get accurate estimates for your bathroom remodel project. Calculate costs by size, 
            fixtures, finishes, and see a detailed breakdown of where your money goes.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#1D4ED8",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Average Bathroom Remodel Costs (2025)</strong>
              </p>
              <div style={{ color: "#BFDBFE", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>Small bathroom</strong> (35 sq ft): $6,000 - $15,000</p>
                <p style={{ margin: "0" }}>• <strong>Medium bathroom</strong> (50 sq ft): $8,000 - $18,000</p>
                <p style={{ margin: "0" }}>• <strong>Master bathroom</strong> (100+ sq ft): $15,000 - $35,000</p>
                <p style={{ margin: "0" }}>• <strong>Cost per square foot</strong>: $70 - $250</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('quick')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'quick' ? "#1D4ED8" : "white",
              color: activeTab === 'quick' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            ⚡ Quick Estimate
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'detailed' ? "#1D4ED8" : "white",
              color: activeTab === 'detailed' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📋 Detailed Estimate
          </button>
        </div>

        {/* Quick Estimate Tab */}
        {activeTab === 'quick' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BFDBFE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ⚡ Quick Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Bathroom Size */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📐 Bathroom Size
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {bathroomSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: selectedSize === size.id ? "2px solid #1D4ED8" : "1px solid #E5E7EB",
                          backgroundColor: selectedSize === size.id ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: selectedSize === size.id ? "600" : "500",
                          color: selectedSize === size.id ? "#1D4ED8" : "#374151",
                          fontSize: "0.8rem"
                        }}>
                          {size.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "2px" }}>
                          {size.id === 'custom' ? 'Enter dims' : `${size.dimensions} (${size.sqft} sq ft)`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedSize === 'custom' && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "100px" }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Length (ft)</label>
                        <input
                          type="number"
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          min={4}
                          max={20}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "100px" }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Width (ft)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(Number(e.target.value))}
                          min={4}
                          max={20}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #D1D5DB",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remodel Level */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    ✨ Remodel Level
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {remodelLevels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => setSelectedLevel(level.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedLevel === level.id ? "2px solid #1D4ED8" : "1px solid #E5E7EB",
                          backgroundColor: selectedLevel === level.id ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>{level.emoji}</span>
                          <span style={{ 
                            fontWeight: selectedLevel === level.id ? "600" : "500",
                            color: selectedLevel === level.id ? "#1D4ED8" : "#374151",
                            fontSize: "0.9rem"
                          }}>
                            {level.label}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px", marginLeft: "24px" }}>
                          {level.description}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#1D4ED8", marginTop: "2px", marginLeft: "24px" }}>
                          ${level.costPerSqft.min}-${level.costPerSqft.max}/sq ft
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    📍 Your Region
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {regions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(region.id)}
                        style={{
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: selectedRegion === region.id ? "2px solid #1D4ED8" : "1px solid #E5E7EB",
                          backgroundColor: selectedRegion === region.id ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        <div style={{ 
                          fontWeight: selectedRegion === region.id ? "600" : "500",
                          color: selectedRegion === region.id ? "#1D4ED8" : "#374151",
                          fontSize: "0.8rem"
                        }}>
                          {region.label}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "2px" }}>
                          {region.description}
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
              border: "1px solid #BFDBFE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Your Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Estimate */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Cost Range</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1D4ED8" }}>
                    ${quickEstimate.min.toLocaleString()} - ${quickEstimate.max.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#059669", fontWeight: "600", marginTop: "4px" }}>
                    Average: ${quickEstimate.avg.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>Bathroom Size</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>{quickEstimate.sqft} sq ft</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>Cost per Sq Ft</div>
                      <div style={{ fontSize: "1.25rem", fontWeight: "600", color: "#111827" }}>${quickEstimate.costPerSqftMin} - ${quickEstimate.costPerSqftMax}</div>
                    </div>
                  </div>
                </div>

                {/* Typical Cost Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                    Typical Cost Breakdown
                  </h3>
                  <CostBar label="Labor (40-60%)" amount={Math.round(quickEstimate.avg * 0.5)} total={quickEstimate.avg} color="#1D4ED8" />
                  <CostBar label="Shower/Tub (20-25%)" amount={Math.round(quickEstimate.avg * 0.22)} total={quickEstimate.avg} color="#059669" />
                  <CostBar label="Vanity & Sink (15-20%)" amount={Math.round(quickEstimate.avg * 0.17)} total={quickEstimate.avg} color="#7C3AED" />
                  <CostBar label="Tile & Flooring (10-15%)" amount={Math.round(quickEstimate.avg * 0.12)} total={quickEstimate.avg} color="#EA580C" />
                  <CostBar label="Other (10-15%)" amount={Math.round(quickEstimate.avg * 0.12)} total={quickEstimate.avg} color="#6B7280" />
                </div>

                {/* Pro Tip */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    💡 <strong>Tip:</strong> Add 10-15% contingency for unexpected issues like water damage or outdated plumbing discovered during renovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Estimate Tab */}
        {activeTab === 'detailed' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BFDBFE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📋 Detailed Estimate
                </h2>
              </div>

              <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
                {/* Square Footage */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📐 Bathroom Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={detailedSqft}
                    onChange={(e) => setDetailedSqft(Number(e.target.value))}
                    min={20}
                    max={200}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                {/* Vanity */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🪞 Vanity
                  </label>
                  <select
                    value={vanity}
                    onChange={(e) => setVanity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {vanityOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.price.toLocaleString()} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sink & Faucet */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🚰 Sink & Faucet
                  </label>
                  <select
                    value={sink}
                    onChange={(e) => setSink(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {sinkOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.price.toLocaleString()} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Toilet */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🚽 Toilet
                  </label>
                  <select
                    value={toilet}
                    onChange={(e) => setToilet(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {toiletOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.price.toLocaleString()} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Shower/Tub */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🚿 Shower / Tub
                  </label>
                  <select
                    value={showerTub}
                    onChange={(e) => setShowerTub(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {showerTubOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.price.toLocaleString()} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Floor Tile */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🏠 Floor Tile
                  </label>
                  <select
                    value={floorTile}
                    onChange={(e) => setFloorTile(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {floorTileOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.pricePerSqft}/sq ft ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wall Tile */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🧱 Wall Treatment
                  </label>
                  <select
                    value={wallTile}
                    onChange={(e) => setWallTile(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {wallTileOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.pricePerSqft}/sq ft ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Countertop */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🪨 Countertop
                  </label>
                  <select
                    value={countertop}
                    onChange={(e) => setCountertop(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {countertopOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.pricePerSqft}/sq ft ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lighting */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💡 Lighting
                  </label>
                  <select
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {lightingOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} - ${opt.price.toLocaleString()} ({opt.description})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Features */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ➕ Additional Features
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                    {additionalFeatures.map(feature => (
                      <label
                        key={feature.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 12px",
                          backgroundColor: selectedFeatures.includes(feature.id) ? "#EFF6FF" : "#F9FAFB",
                          borderRadius: "8px",
                          cursor: "pointer",
                          border: selectedFeatures.includes(feature.id) ? "1px solid #1D4ED8" : "1px solid #E5E7EB"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                          style={{ marginRight: "10px" }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: "500", color: "#374151" }}>{feature.label}</div>
                          <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>{feature.description}</div>
                        </div>
                        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#1D4ED8" }}>
                          +${feature.price.toLocaleString()}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📍 Your Region
                  </label>
                  <select
                    value={detailedRegion}
                    onChange={(e) => setDetailedRegion(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {regions.map(region => (
                      <option key={region.id} value={region.id}>
                        {region.label} ({region.description}) - {region.multiplier > 1 ? '+' : ''}{Math.round((region.multiplier - 1) * 100)}%
                      </option>
                    ))}
                  </select>
                </div>

                {/* Labor Percentage */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    👷 Labor Percentage: {laborPercent}%
                  </label>
                  <input
                    type="range"
                    min={30}
                    max={65}
                    value={laborPercent}
                    onChange={(e) => setLaborPercent(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280" }}>
                    <span>30% (DIY-heavy)</span>
                    <span>65% (Full service)</span>
                  </div>
                </div>

                {/* Contingency */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    🛡️ Contingency Buffer: {contingency}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    value={contingency}
                    onChange={(e) => setContingency(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#6B7280" }}>
                    <span>0%</span>
                    <span>25%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #BFDBFE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Detailed Breakdown
                </h2>
              </div>

              <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
                {/* Total */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Total</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1D4ED8" }}>
                    ${detailedEstimate.total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280", marginTop: "4px" }}>
                    ${detailedEstimate.costPerSqft}/sq ft
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>
                    Cost Breakdown
                  </h3>
                  <CostBar label="Shower/Tub" amount={detailedEstimate.breakdown.showerTub} total={detailedEstimate.total} color="#1D4ED8" />
                  <CostBar label="Labor" amount={detailedEstimate.breakdown.labor} total={detailedEstimate.total} color="#059669" />
                  <CostBar label="Vanity" amount={detailedEstimate.breakdown.vanity} total={detailedEstimate.total} color="#7C3AED" />
                  <CostBar label="Wall Treatment" amount={detailedEstimate.breakdown.wallTile} total={detailedEstimate.total} color="#EA580C" />
                  <CostBar label="Flooring" amount={detailedEstimate.breakdown.flooring} total={detailedEstimate.total} color="#0891B2" />
                  <CostBar label="Sink & Faucet" amount={detailedEstimate.breakdown.sink} total={detailedEstimate.total} color="#DB2777" />
                  <CostBar label="Toilet" amount={detailedEstimate.breakdown.toilet} total={detailedEstimate.total} color="#65A30D" />
                  <CostBar label="Countertop" amount={detailedEstimate.breakdown.countertop} total={detailedEstimate.total} color="#DC2626" />
                  <CostBar label="Lighting" amount={detailedEstimate.breakdown.lighting} total={detailedEstimate.total} color="#9333EA" />
                  {detailedEstimate.breakdown.features > 0 && (
                    <CostBar label="Additional Features" amount={detailedEstimate.breakdown.features} total={detailedEstimate.total} color="#F59E0B" />
                  )}
                  {detailedEstimate.breakdown.contingency > 0 && (
                    <CostBar label="Contingency" amount={detailedEstimate.breakdown.contingency} total={detailedEstimate.total} color="#6B7280" />
                  )}
                </div>

                {/* Summary Table */}
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <table style={{ width: "100%", fontSize: "0.85rem" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "6px 0", color: "#6B7280" }}>Materials Subtotal</td>
                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "500" }}>
                          ${(detailedEstimate.subtotal - detailedEstimate.breakdown.labor).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "6px 0", color: "#6B7280" }}>Labor ({laborPercent}%)</td>
                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "500" }}>
                          ${detailedEstimate.breakdown.labor.toLocaleString()}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "1px solid #E5E7EB" }}>
                        <td style={{ padding: "6px 0", color: "#6B7280" }}>Subtotal</td>
                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "500" }}>
                          ${detailedEstimate.subtotal.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "6px 0", color: "#6B7280" }}>Contingency ({contingency}%)</td>
                        <td style={{ padding: "6px 0", textAlign: "right", fontWeight: "500" }}>
                          ${detailedEstimate.breakdown.contingency.toLocaleString()}
                        </td>
                      </tr>
                      <tr style={{ borderTop: "2px solid #1D4ED8" }}>
                        <td style={{ padding: "8px 0", fontWeight: "700", color: "#111827" }}>Total</td>
                        <td style={{ padding: "8px 0", textAlign: "right", fontWeight: "700", color: "#1D4ED8", fontSize: "1.1rem" }}>
                          ${detailedEstimate.total.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Money Saving Tips */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    💰 Ways to Save
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#047857", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Choose ceramic over porcelain tile</li>
                    <li>Keep existing plumbing layout</li>
                    <li>Use a stock vanity instead of custom</li>
                    <li>DIY painting and simple installations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost by Bathroom Size Reference */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #BFDBFE", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📏 Cost by Bathroom Size
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { size: '5×7 Bathroom', sqft: '35 sq ft', range: '$6,000 - $15,000' },
              { size: '5×10 Bathroom', sqft: '50 sq ft', range: '$8,000 - $18,000' },
              { size: '8×10 Bathroom', sqft: '80 sq ft', range: '$12,000 - $25,000' },
              { size: '10×10 Master', sqft: '100 sq ft', range: '$15,000 - $35,000' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: "20px",
                  backgroundColor: "#EFF6FF",
                  borderRadius: "12px",
                  textAlign: "center",
                  border: "1px solid #BFDBFE"
                }}
              >
                <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1D4ED8", marginBottom: "4px" }}>
                  {item.size}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "8px" }}>
                  {item.sqft}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#111827" }}>
                  {item.range}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🔧 Understanding Bathroom Renovation Costs
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A bathroom renovation is one of the most impactful home improvement projects you can undertake. 
                  Whether you&apos;re updating a dated space or creating your dream spa bathroom, understanding costs 
                  helps you plan effectively and avoid budget surprises.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Affects Bathroom Remodel Cost?</h3>
                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Size:</strong> Larger bathrooms need more materials and labor</li>
                    <li><strong>Layout changes:</strong> Moving plumbing adds $1,000-$5,000+</li>
                    <li><strong>Material quality:</strong> Premium finishes cost 2-3x more</li>
                    <li><strong>Labor rates:</strong> Vary 30-50% by location</li>
                    <li><strong>Scope:</strong> Cosmetic refresh vs. full gut renovation</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Labor Cost Breakdown</h3>
                <p>
                  Labor typically accounts for 40-60% of your total bathroom remodel budget. Here&apos;s what 
                  professionals charge:
                </p>
                <div style={{
                  backgroundColor: "#F9FAFB",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #E5E7EB"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Plumber:</strong> $45-$200/hour</li>
                    <li><strong>Electrician:</strong> $50-$200/hour</li>
                    <li><strong>Tile installer:</strong> $10-$18/sq ft</li>
                    <li><strong>General contractor:</strong> 10-20% of project cost</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>ROI of Bathroom Remodels</h3>
                <p>
                  Bathroom renovations offer solid returns when selling your home. According to industry data, 
                  a mid-range bathroom remodel recoups approximately 60-70% of its cost at resale. Focus on 
                  timeless designs and quality fixtures for the best value.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#1D4ED8", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📊 Quick Stats</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                <p style={{ margin: "0 0 4px 0" }}><strong>Avg. Cost:</strong> $12,000-$15,000</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>Timeline:</strong> 2-3 weeks</p>
                <p style={{ margin: "0 0 4px 0" }}><strong>ROI:</strong> 60-70%</p>
                <p style={{ margin: 0 }}><strong>Most Expensive:</strong> Shower/tub</p>
              </div>
            </div>

            {/* Budget Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Budget Tips</h3>
              <ul style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>Refinish tub instead of replacing</li>
                <li>Keep plumbing in current locations</li>
                <li>Shop sales for fixtures</li>
                <li>Consider luxury vinyl vs. tile</li>
                <li>Paint cabinets vs. replacing</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/bathroom-renovation-cost-estimator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
          <p style={{ fontSize: "0.75rem", color: "#1D4ED8", textAlign: "center", margin: 0 }}>
            🚿 <strong>Disclaimer:</strong> These estimates are for planning purposes only. Actual costs vary by 
            location, contractor, material availability, and unforeseen conditions. Always get multiple quotes 
            from licensed contractors for accurate pricing.
          </p>
        </div>
      </div>
    </div>
  );
}