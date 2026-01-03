"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

type Tab = 'quick' | 'detailed';
type ProjectLevel = 'basic' | 'midRange' | 'premium' | 'fullReno';
type LawnType = 'none' | 'seed' | 'sod' | 'artificial';
type MulchType = 'none' | 'wood' | 'rock' | 'gravel';
type PatioType = 'none' | 'concrete' | 'paver' | 'stone';

// Price data (2025 installed costs)
const PROJECT_LEVELS = {
  basic: { min: 4, max: 6, label: 'Basic', desc: 'Lawn, mulch, basic plants' },
  midRange: { min: 8, max: 12, label: 'Mid-Range', desc: '+ Shrubs, flower beds, edging' },
  premium: { min: 15, max: 25, label: 'Premium', desc: '+ Patio, walkways, irrigation' },
  fullReno: { min: 25, max: 50, label: 'Full Renovation', desc: '+ Outdoor kitchen, water features' }
};

const LAWN_PRICES = {
  none: { min: 0, max: 0, label: 'None' },
  seed: { min: 0.10, max: 0.20, label: 'Grass Seed' },
  sod: { min: 1.00, max: 2.00, label: 'Sod' },
  artificial: { min: 8, max: 18, label: 'Artificial Turf' }
};

const MULCH_PRICES = {
  none: { min: 0, max: 0, label: 'None' },
  wood: { min: 0.50, max: 1.00, label: 'Wood Mulch (3")' },
  rock: { min: 1.50, max: 3.00, label: 'Decorative Rock' },
  gravel: { min: 1.00, max: 2.00, label: 'Gravel/Pea Stone' }
};

const PATIO_PRICES = {
  none: { min: 0, max: 0, label: 'None' },
  concrete: { min: 6, max: 12, label: 'Concrete Patio' },
  paver: { min: 12, max: 25, label: 'Paver Patio' },
  stone: { min: 20, max: 35, label: 'Natural Stone' }
};

const FEATURE_PRICES = {
  firePit: { min: 500, max: 3000, label: 'Fire Pit' },
  fountain: { min: 500, max: 2500, label: 'Water Fountain' },
  lighting: { min: 1500, max: 5000, label: 'Landscape Lighting' },
  irrigation: { min: 2500, max: 5000, label: 'Irrigation System' }
};

// FAQ data
const faqs = [
  {
    question: "How much does landscaping cost for a small yard?",
    answer: "A small yard (500-1,000 sq ft) typically costs $2,000-$6,000 for basic landscaping including lawn, mulch, and plants. Mid-range with a small patio runs $5,000-$12,000. Costs vary significantly based on materials chosen and whether you DIY or hire professionals."
  },
  {
    question: "What is the most expensive part of landscaping?",
    answer: "Hardscaping (patios, retaining walls, outdoor kitchens) is typically the most expensive at $20-50+ per square foot. Labor accounts for 40-60% of total project costs. Mature trees ($500-2,000 each) and irrigation systems ($2,500-5,000) are also significant expenses."
  },
  {
    question: "How do you price out a landscaping job?",
    answer: "Calculate square footage for each area, multiply by material costs per sq ft, add labor (typically 50-65% of materials), then add flat-rate features like fire pits or irrigation. Get multiple quotes from contractors for accurate local pricing."
  },
  {
    question: "Is sod or seed cheaper?",
    answer: "Seed is 80-90% cheaper ($0.10-0.20/sf vs $1-2/sf for sod), but takes 2-3 months to establish. Sod provides instant results and is less prone to weeds. For large areas or time-sensitive projects, sod is often worth the premium."
  },
  {
    question: "Should I landscape front or back yard first?",
    answer: "Front yard first if selling soon (curb appeal adds resale value). Backyard first if you want to enjoy the space - you'll use it more daily. Many homeowners phase projects, completing front yard basics first then investing in backyard living space."
  },
  {
    question: "Does landscaping increase home value?",
    answer: "Yes, professional landscaping can increase home value by 5-12%. Well-maintained landscapes also help homes sell faster. Focus on mature trees and clean hardscaping for best ROI. The National Association of Realtors reports landscaping recovery rates of 100-200%."
  },
  {
    question: "How much should I budget for landscaping a new home?",
    answer: "A common rule is 10% of your home's value for full landscaping. For a $400,000 home, budget $40,000. Basic landscaping can be done for $5,000-15,000. Prioritize drainage, irrigation, and a healthy lawn foundation first."
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

export default function LandscapingCostCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('quick');
  
  // Quick estimate inputs
  const [yardSize, setYardSize] = useState(2000);
  const [projectLevel, setProjectLevel] = useState<ProjectLevel>('midRange');
  const [includeInstall, setIncludeInstall] = useState(true);
  
  // Detailed inputs
  const [lawnType, setLawnType] = useState<LawnType>('sod');
  const [lawnArea, setLawnArea] = useState(1500);
  const [mulchType, setMulchType] = useState<MulchType>('wood');
  const [mulchArea, setMulchArea] = useState(300);
  const [shrubCount, setShrubCount] = useState(10);
  const [treeCount, setTreeCount] = useState(2);
  const [flowerBedArea, setFlowerBedArea] = useState(100);
  const [patioType, setPatioType] = useState<PatioType>('paver');
  const [patioArea, setPatioArea] = useState(200);
  const [walkwayLength, setWalkwayLength] = useState(30);
  const [retainingWallSqFt, setRetainingWallSqFt] = useState(0);
  const [features, setFeatures] = useState({
    firePit: false,
    fountain: false,
    lighting: false,
    irrigation: false
  });
  const [detailedIncludeInstall, setDetailedIncludeInstall] = useState(true);

  // Quick estimate calculation
  const quickResults = useMemo(() => {
    const level = PROJECT_LEVELS[projectLevel];
    const laborMultiplier = includeInstall ? 1 : 0.35;
    
    const minCost = Math.round(yardSize * level.min * laborMultiplier);
    const maxCost = Math.round(yardSize * level.max * laborMultiplier);
    
    return {
      minCost,
      maxCost,
      minPerSqFt: (level.min * laborMultiplier).toFixed(2),
      maxPerSqFt: (level.max * laborMultiplier).toFixed(2),
      level
    };
  }, [yardSize, projectLevel, includeInstall]);

  // Detailed calculation
  const detailedResults = useMemo(() => {
    const laborMultiplier = detailedIncludeInstall ? 1 : 0.35;
    
    const lawnPrices = LAWN_PRICES[lawnType];
    const lawnMin = lawnArea * lawnPrices.min * laborMultiplier;
    const lawnMax = lawnArea * lawnPrices.max * laborMultiplier;
    
    const mulchPrices = MULCH_PRICES[mulchType];
    const mulchMin = mulchArea * mulchPrices.min * laborMultiplier;
    const mulchMax = mulchArea * mulchPrices.max * laborMultiplier;
    
    const shrubMin = shrubCount * 25 * laborMultiplier;
    const shrubMax = shrubCount * 100 * laborMultiplier;
    const treeMin = treeCount * 150 * laborMultiplier;
    const treeMax = treeCount * 500 * laborMultiplier;
    const flowerMin = flowerBedArea * 3 * laborMultiplier;
    const flowerMax = flowerBedArea * 8 * laborMultiplier;
    const plantsMin = shrubMin + treeMin + flowerMin;
    const plantsMax = shrubMax + treeMax + flowerMax;
    
    const patioPrices = PATIO_PRICES[patioType];
    const patioMin = patioArea * patioPrices.min * laborMultiplier;
    const patioMax = patioArea * patioPrices.max * laborMultiplier;
    const walkwayMin = walkwayLength * 3 * 8 * laborMultiplier;
    const walkwayMax = walkwayLength * 3 * 18 * laborMultiplier;
    const wallMin = retainingWallSqFt * 20 * laborMultiplier;
    const wallMax = retainingWallSqFt * 50 * laborMultiplier;
    const hardscapeMin = patioMin + walkwayMin + wallMin;
    const hardscapeMax = patioMax + walkwayMax + wallMax;
    
    let featuresMin = 0;
    let featuresMax = 0;
    if (features.firePit) { featuresMin += 500; featuresMax += 3000; }
    if (features.fountain) { featuresMin += 500; featuresMax += 2500; }
    if (features.lighting) { featuresMin += 1500; featuresMax += 5000; }
    if (features.irrigation) { featuresMin += 2500; featuresMax += 5000; }
    if (!detailedIncludeInstall) {
      featuresMin *= 0.5;
      featuresMax *= 0.5;
    }
    
    const totalMin = Math.round(lawnMin + mulchMin + plantsMin + hardscapeMin + featuresMin);
    const totalMax = Math.round(lawnMax + mulchMax + plantsMax + hardscapeMax + featuresMax);
    
    const totalArea = lawnArea + mulchArea + flowerBedArea + patioArea + (walkwayLength * 3);
    
    return {
      lawn: { min: Math.round(lawnMin), max: Math.round(lawnMax) },
      mulch: { min: Math.round(mulchMin), max: Math.round(mulchMax) },
      plants: { min: Math.round(plantsMin), max: Math.round(plantsMax) },
      hardscape: { min: Math.round(hardscapeMin), max: Math.round(hardscapeMax) },
      features: { min: Math.round(featuresMin), max: Math.round(featuresMax) },
      totalMin,
      totalMax,
      perSqFtMin: totalArea > 0 ? (totalMin / totalArea).toFixed(2) : '0',
      perSqFtMax: totalArea > 0 ? (totalMax / totalArea).toFixed(2) : '0',
      totalArea
    };
  }, [lawnType, lawnArea, mulchType, mulchArea, shrubCount, treeCount, flowerBedArea, patioType, patioArea, walkwayLength, retainingWallSqFt, features, detailedIncludeInstall]);

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Landscaping Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌿</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Landscaping Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate lawn, garden, and outdoor project costs with 2025 pricing data. Compare materials and get instant pricing for your yard.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A7F3D0"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Reference (per sq ft, installed)</p>
              <p style={{ color: "#065F46", margin: 0, fontSize: "0.95rem" }}>
                <strong>Basic:</strong> $4-6 • <strong>Mid-Range:</strong> $8-12 • <strong>Premium:</strong> $15-25 • <strong>Full Reno:</strong> $25-50+
              </p>
            </div>
          </div>
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
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setActiveTab("quick")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "quick" ? "#059669" : "transparent",
                color: activeTab === "quick" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🎯 Quick Estimate
            </button>
            <button
              onClick={() => setActiveTab("detailed")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "detailed" ? "#059669" : "transparent",
                color: activeTab === "detailed" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              📋 Detailed Calculator
            </button>
          </div>

          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {activeTab === 'quick' ? (
                  <>
                    {/* Yard Size */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                        🏡 Yard Size (sq ft)
                      </h3>
                      <input
                        type="number"
                        value={yardSize}
                        onChange={(e) => setYardSize(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1.1rem", marginBottom: "12px" }}
                      />
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[500, 1000, 2000, 3000, 5000].map((size) => (
                          <button key={size} onClick={() => setYardSize(size)} style={{ padding: "8px 12px", borderRadius: "6px", border: yardSize === size ? "2px solid #059669" : "1px solid #D1D5DB", backgroundColor: yardSize === size ? "#ECFDF5" : "white", color: yardSize === size ? "#059669" : "#374151", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem" }}>
                            {size.toLocaleString()} sq ft
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Project Level */}
                    <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>📊 Project Level</h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(PROJECT_LEVELS) as [ProjectLevel, typeof PROJECT_LEVELS.basic][]).map(([key, level]) => (
                          <button key={key} onClick={() => setProjectLevel(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: projectLevel === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: projectLevel === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontWeight: "600", color: projectLevel === key ? "#059669" : "#374151", margin: 0, fontSize: "0.9rem" }}>{level.label}</p>
                              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>{level.desc}</p>
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "600" }}>${level.min}-${level.max}/sf</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Include Installation */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px 24px", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h3 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0", fontSize: "1rem" }}>🔧 Include Professional Installation</h3>
                          <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Labor typically adds 50-65% to material cost</p>
                        </div>
                        <button onClick={() => setIncludeInstall(!includeInstall)} style={{ width: "56px", height: "28px", borderRadius: "14px", backgroundColor: includeInstall ? "#059669" : "#D1D5DB", border: "none", cursor: "pointer", position: "relative", transition: "background-color 0.2s" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "white", position: "absolute", top: "2px", left: includeInstall ? "30px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Lawn */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>🌱 Lawn</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Type</label>
                          <select value={lawnType} onChange={(e) => setLawnType(e.target.value as LawnType)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }}>
                            <option value="none">None</option>
                            <option value="seed">Grass Seed ($0.10-0.20/sf)</option>
                            <option value="sod">Sod ($1-2/sf)</option>
                            <option value="artificial">Artificial Turf ($8-18/sf)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Area (sq ft)</label>
                          <input type="number" value={lawnArea} onChange={(e) => setLawnArea(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                      </div>
                    </div>

                    {/* Mulch */}
                    <div style={{ backgroundColor: "#FFFBEB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>🪨 Mulch & Ground Cover</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Type</label>
                          <select value={mulchType} onChange={(e) => setMulchType(e.target.value as MulchType)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }}>
                            <option value="none">None</option>
                            <option value="wood">Wood Mulch ($0.50-1/sf)</option>
                            <option value="rock">Decorative Rock ($1.50-3/sf)</option>
                            <option value="gravel">Gravel ($1-2/sf)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Area (sq ft)</label>
                          <input type="number" value={mulchArea} onChange={(e) => setMulchArea(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                      </div>
                    </div>

                    {/* Plants */}
                    <div style={{ backgroundColor: "#FDF2F8", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>🌸 Plants</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Shrubs (#)</label>
                          <input type="number" value={shrubCount} onChange={(e) => setShrubCount(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Trees (#)</label>
                          <input type="number" value={treeCount} onChange={(e) => setTreeCount(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Flower Beds (sf)</label>
                          <input type="number" value={flowerBedArea} onChange={(e) => setFlowerBedArea(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                      </div>
                    </div>

                    {/* Hardscaping */}
                    <div style={{ backgroundColor: "#F1F5F9", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>🧱 Hardscaping</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Patio Type</label>
                          <select value={patioType} onChange={(e) => setPatioType(e.target.value as PatioType)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }}>
                            <option value="none">None</option>
                            <option value="concrete">Concrete ($6-12/sf)</option>
                            <option value="paver">Pavers ($12-25/sf)</option>
                            <option value="stone">Natural Stone ($20-35/sf)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Patio Area (sq ft)</label>
                          <input type="number" value={patioArea} onChange={(e) => setPatioArea(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Walkway (linear ft)</label>
                          <input type="number" value={walkwayLength} onChange={(e) => setWalkwayLength(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Retaining Wall (sq ft)</label>
                          <input type="number" value={retainingWallSqFt} onChange={(e) => setRetainingWallSqFt(Number(e.target.value) || 0)} style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "0.9rem" }} />
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div style={{ backgroundColor: "#F5F3FF", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>✨ Special Features</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {(Object.entries(FEATURE_PRICES) as [keyof typeof FEATURE_PRICES, typeof FEATURE_PRICES.firePit][]).map(([key, feature]) => (
                          <button key={key} onClick={() => toggleFeature(key)} style={{ padding: "12px", borderRadius: "8px", border: features[key] ? "2px solid #7C3AED" : "1px solid #E5E7EB", backgroundColor: features[key] ? "#EDE9FE" : "white", cursor: "pointer", textAlign: "left" }}>
                            <p style={{ fontWeight: "600", color: features[key] ? "#7C3AED" : "#374151", margin: 0, fontSize: "0.85rem" }}>{feature.label}</p>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>${feature.min.toLocaleString()} - ${feature.max.toLocaleString()}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Include Installation */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px 24px", borderRadius: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <h3 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0", fontSize: "1rem" }}>🔧 Include Professional Installation</h3>
                          <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Labor typically adds 50-65% to material cost</p>
                        </div>
                        <button onClick={() => setDetailedIncludeInstall(!detailedIncludeInstall)} style={{ width: "56px", height: "28px", borderRadius: "14px", backgroundColor: detailedIncludeInstall ? "#059669" : "#D1D5DB", border: "none", cursor: "pointer", position: "relative", transition: "background-color 0.2s" }}>
                          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "white", position: "absolute", top: "2px", left: detailedIncludeInstall ? "30px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Results */}
              <div className="calc-results">
                {activeTab === 'quick' ? (
                  <>
                    <div style={{ backgroundColor: "#059669", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Total Estimated Cost</p>
                      <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>{formatCurrency(quickResults.minCost)} - {formatCurrency(quickResults.maxCost)}</p>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>{quickResults.level.label} • {yardSize.toLocaleString()} sq ft</p>
                    </div>

                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Cost Breakdown</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>Cost Per Sq Ft</span><span style={{ fontWeight: "600", color: "#059669" }}>${quickResults.minPerSqFt} - ${quickResults.maxPerSqFt}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>Yard Size</span><span style={{ fontWeight: "600", color: "#374151" }}>{yardSize.toLocaleString()} sq ft</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>Project Level</span><span style={{ fontWeight: "600", color: "#374151" }}>{quickResults.level.label}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ color: "#6B7280" }}>Installation</span><span style={{ fontWeight: "600", color: "#374151" }}>{includeInstall ? 'Included' : 'DIY'}</span></div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📈 Compare All Levels</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {(Object.entries(PROJECT_LEVELS) as [ProjectLevel, typeof PROJECT_LEVELS.basic][]).map(([key, level]) => {
                          const min = Math.round(yardSize * level.min * (includeInstall ? 1 : 0.35));
                          const max = Math.round(yardSize * level.max * (includeInstall ? 1 : 0.35));
                          const isSelected = projectLevel === key;
                          return (
                            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", backgroundColor: isSelected ? "#ECFDF5" : "white", borderRadius: "6px", border: isSelected ? "2px solid #059669" : "1px solid #E5E7EB" }}>
                              <span style={{ fontSize: "0.85rem", color: isSelected ? "#059669" : "#374151", fontWeight: isSelected ? "600" : "400" }}>{level.label}</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: isSelected ? "#059669" : "#6B7280" }}>{formatCurrency(min)} - {formatCurrency(max)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ backgroundColor: "#059669", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Total Estimated Cost</p>
                      <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>{formatCurrency(detailedResults.totalMin)} - {formatCurrency(detailedResults.totalMax)}</p>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>{detailedResults.totalArea.toLocaleString()} sq ft total area</p>
                    </div>

                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Cost Breakdown</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {detailedResults.lawn.max > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🌱 Lawn</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.lawn.min)} - {formatCurrency(detailedResults.lawn.max)}</span></div>}
                        {detailedResults.mulch.max > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🪨 Mulch/Ground</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.mulch.min)} - {formatCurrency(detailedResults.mulch.max)}</span></div>}
                        {detailedResults.plants.max > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🌸 Plants</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.plants.min)} - {formatCurrency(detailedResults.plants.max)}</span></div>}
                        {detailedResults.hardscape.max > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🧱 Hardscaping</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.hardscape.min)} - {formatCurrency(detailedResults.hardscape.max)}</span></div>}
                        {detailedResults.features.max > 0 && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>✨ Features</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.features.min)} - {formatCurrency(detailedResults.features.max)}</span></div>}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ color: "#6B7280" }}>Cost Per Sq Ft</span><span style={{ fontWeight: "600", color: "#059669" }}>${detailedResults.perSqFtMin} - ${detailedResults.perSqFtMax}</span></div>
                      </div>
                    </div>

                    <div style={{ padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px", border: "1px solid #93C5FD" }}>
                      <p style={{ fontSize: "0.85rem", color: "#1E40AF", margin: 0 }}>💡 <strong>Pro Tip:</strong> Professional landscaping can increase home value by up to 12%. Focus on curb appeal for front yards.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sample Projects Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📊 Sample Project Costs (2025)</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Typical landscaping project costs with professional installation</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Project Type</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Size</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "right" }}>Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { project: "Front Yard Refresh", size: "500 sq ft", cost: "$2,000 - $4,500" },
                  { project: "New Lawn (Sod)", size: "2,000 sq ft", cost: "$2,000 - $4,000" },
                  { project: "Basic Backyard", size: "2,000 sq ft", cost: "$8,000 - $12,000" },
                  { project: "Mid-Range Full Yard", size: "3,000 sq ft", cost: "$24,000 - $36,000" },
                  { project: "Paver Patio + Landscaping", size: "400 sq ft patio", cost: "$8,000 - $15,000" },
                  { project: "Premium Outdoor Living", size: "4,000 sq ft", cost: "$60,000 - $100,000+" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.project}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.size}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "right", fontWeight: "600", color: "#059669" }}>{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Cost Factors */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💰 What Affects Landscaping Costs?</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { num: 1, title: "Yard Size", desc: "Larger yards cost more but may have lower per-square-foot rates due to economies of scale." },
                  { num: 2, title: "Design Complexity", desc: "Custom designs, multiple levels, and curved lines increase labor costs significantly." },
                  { num: 3, title: "Material Quality", desc: "Premium pavers, natural stone, and mature plants cost 2-3x more than basic options." },
                  { num: 4, title: "Location", desc: "Urban areas cost 20-40% more than rural. Local material availability affects pricing." }
                ].map((item) => (
                  <div key={item.num} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>{item.num}</div>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Costs */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📋 Landscaping Material Costs (Installed)</h2>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "1rem" }}>🌱 Lawn Installation</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {[{ name: "Grass Seed", price: "$0.10 - $0.20/sf" }, { name: "Sod", price: "$1.00 - $2.00/sf" }, { name: "Artificial Turf", price: "$8 - $18/sf" }].map((item, i) => (
                      <div key={i} style={{ padding: "12px", backgroundColor: "#F0FDF4", borderRadius: "8px" }}>
                        <p style={{ fontWeight: "600", color: "#374151", margin: 0, fontSize: "0.85rem" }}>{item.name}</p>
                        <p style={{ color: "#059669", margin: "4px 0 0 0", fontSize: "0.8rem" }}>{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "1rem" }}>🧱 Hardscaping</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {[{ name: "Concrete Patio", price: "$6 - $12/sf" }, { name: "Paver Patio", price: "$12 - $25/sf" }, { name: "Walkway", price: "$8 - $18/sf" }, { name: "Retaining Wall", price: "$20 - $50/sf" }].map((item, i) => (
                      <div key={i} style={{ padding: "12px", backgroundColor: "#F1F5F9", borderRadius: "8px" }}>
                        <p style={{ fontWeight: "600", color: "#374151", margin: 0, fontSize: "0.85rem" }}>{item.name}</p>
                        <p style={{ color: "#475569", margin: "4px 0 0 0", fontSize: "0.8rem" }}>{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: "600", color: "#374151", marginBottom: "8px", fontSize: "1rem" }}>✨ Special Features</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {[{ name: "Fire Pit", price: "$500 - $3,000" }, { name: "Water Fountain", price: "$500 - $2,500" }, { name: "Landscape Lighting", price: "$1,500 - $5,000" }, { name: "Irrigation System", price: "$2,500 - $5,000" }].map((item, i) => (
                      <div key={i} style={{ padding: "12px", backgroundColor: "#F5F3FF", borderRadius: "8px" }}>
                        <p style={{ fontWeight: "600", color: "#374151", margin: 0, fontSize: "0.85rem" }}>{item.name}</p>
                        <p style={{ color: "#7C3AED", margin: "4px 0 0 0", fontSize: "0.8rem" }}>{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Cost Guide */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>📊 Quick Cost Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#065F46" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Basic (lawn, mulch)</span><span style={{ fontWeight: "600" }}>$4-6/sf</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Mid-Range (+ plants)</span><span style={{ fontWeight: "600" }}>$8-12/sf</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Premium (+ patio)</span><span style={{ fontWeight: "600" }}>$15-25/sf</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Full Renovation</span><span style={{ fontWeight: "600" }}>$25-50+/sf</span></div>
              </div>
            </div>

            {/* Money Saving Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Money-Saving Tips</h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Phase your project over time</li>
                <li style={{ marginBottom: "8px" }}>Choose native plants (cheaper & hardier)</li>
                <li style={{ marginBottom: "8px" }}>DIY soft landscaping, hire for hardscaping</li>
                <li style={{ marginBottom: "8px" }}>Get 3+ quotes to compare</li>
                <li>Schedule in off-season (fall/winter)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/landscaping-cost-calculator"
              currentCategory="Home"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🌿 <strong>Disclaimer:</strong> Cost estimates are based on national averages and may vary significantly by location, contractor, terrain, and material quality. Always obtain multiple quotes from licensed landscapers for accurate pricing. Prices reflect 2025 market rates.
          </p>
        </div>
      </div>
    </div>
  );
}