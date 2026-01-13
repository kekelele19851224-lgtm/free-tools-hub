"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// State pricing data (per sq ft for mid-range turnkey)
const statePricing = [
  { id: "texas", name: "Texas", low: 130, mid: 160, high: 200 },
  { id: "oklahoma", name: "Oklahoma", low: 110, mid: 140, high: 170 },
  { id: "tennessee", name: "Tennessee", low: 120, mid: 150, high: 185 },
  { id: "georgia", name: "Georgia", low: 125, mid: 155, high: 190 },
  { id: "florida", name: "Florida", low: 150, mid: 190, high: 250 },
  { id: "ohio", name: "Ohio", low: 125, mid: 160, high: 200 },
  { id: "michigan", name: "Michigan", low: 130, mid: 165, high: 210 },
  { id: "national", name: "National Average", low: 130, mid: 160, high: 200 }
];

// Build type multipliers
const buildTypes = [
  { id: "kit", name: "Kit Only (Shell)", multiplier: 0.25, description: "Materials only, no labor or interior" },
  { id: "kit-assembly", name: "Kit + Assembly", multiplier: 0.35, description: "Shell assembled, no interior finishes" },
  { id: "basic", name: "Basic Turnkey", multiplier: 0.65, description: "Move-in ready, standard finishes" },
  { id: "mid", name: "Mid-Range Turnkey", multiplier: 1.0, description: "Quality finishes, upgraded features" },
  { id: "high", name: "High-End Custom", multiplier: 1.4, description: "Premium finishes, custom design" }
];

// Interior finish levels
const finishLevels = [
  { id: "basic", name: "Basic", perSqFt: 40, description: "Concrete floors, basic fixtures" },
  { id: "mid", name: "Mid-Range", perSqFt: 75, description: "LVP flooring, quality fixtures" },
  { id: "high", name: "High-End", perSqFt: 120, description: "Hardwood, custom cabinetry" },
  { id: "luxury", name: "Luxury", perSqFt: 180, description: "Premium everything, designer finishes" }
];

// FAQ data
const faqs = [
  {
    question: "How big of a barndominium can I build for $250,000?",
    answer: "With a $250,000 budget, you can build approximately 1,500-2,000 square feet for a mid-range turnkey barndominium, or up to 3,500 square feet for a basic build. In lower-cost states like Oklahoma or Tennessee, your budget stretches further. This assumes you already own land—land costs can add $50,000-$150,000+ to your total investment."
  },
  {
    question: "How big of a barndominium can I build for $100,000?",
    answer: "A $100,000 budget typically allows for a 750-1,200 square foot basic turnkey barndominium, or a larger 2,000-3,000 square foot shell-only kit that you finish yourself over time. Many owners start with a kit ($30-50/sq ft) and complete interior work gradually to spread costs. This budget works best in rural areas with affordable land."
  },
  {
    question: "What is the average cost of a 2000 square foot barndominium?",
    answer: "A 2,000 square foot barndominium costs $130,000-$320,000 on average, depending on finish level and location. Basic turnkey builds run $130,000-$180,000, mid-range builds $200,000-$260,000, and high-end custom builds $260,000-$400,000+. Add $50,000-$100,000 for land, site prep, and utilities in rural areas."
  },
  {
    question: "Is it cheaper to build or buy a barndominium?",
    answer: "Building is typically 30-50% cheaper than buying a comparable traditional home. Barndominiums cost $65-$160/sq ft vs $150-$250/sq ft for conventional construction. However, barndominiums may have lower resale value in some markets. Financing can be trickier—many lenders treat them as construction loans with higher rates until completed."
  },
  {
    question: "How much does a barndominium kit cost?",
    answer: "Barndominium kits cost $20-$50 per square foot. A basic shell kit (materials only) runs $20-$35/sq ft, while kit + assembly costs $30-$50/sq ft. For a 2,000 sq ft barndominium, expect $40,000-$70,000 for the kit. Kits include exterior shell materials but not foundation, utilities, or interior finishes—budget an additional $50,000-$150,000 to complete the build."
  },
  {
    question: "What is included in barndominium turnkey pricing?",
    answer: "Turnkey pricing ($130-$250/sq ft) typically includes: foundation, steel frame and shell, roofing, siding, windows and doors, insulation, drywall, flooring, kitchen and bath fixtures, plumbing, electrical, HVAC, and basic landscaping. NOT included: land purchase, well/septic ($15,000-$30,000), driveway, detached structures, and premium upgrades. Always get a detailed scope of work from your builder."
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

export default function BarndominiumCostCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"sqft" | "budget" | "breakdown">("sqft");
  
  // By Square Footage state
  const [sqft, setSqft] = useState<string>("2000");
  const [buildType, setBuildType] = useState<string>("mid");
  const [state, setState] = useState<string>("texas");
  const [shopSqft, setShopSqft] = useState<string>("0");
  const [porchSqft, setPorchSqft] = useState<string>("0");
  
  // By Budget state
  const [budget, setBudget] = useState<string>("250000");
  const [budgetBuildType, setBudgetBuildType] = useState<string>("mid");
  const [budgetState, setBudgetState] = useState<string>("texas");
  
  // Cost Breakdown state
  const [breakdownSqft, setBreakdownSqft] = useState<string>("2000");
  const [foundationType, setFoundationType] = useState<string>("slab");
  const [finishLevel, setFinishLevel] = useState<string>("mid");
  const [breakdownShop, setBreakdownShop] = useState<string>("400");
  const [breakdownPorch, setBreakdownPorch] = useState<string>("200");
  const [includeContingency, setIncludeContingency] = useState<boolean>(true);

  // By Square Footage calculations
  const sqftNum = parseFloat(sqft) || 0;
  const shopNum = parseFloat(shopSqft) || 0;
  const porchNum = parseFloat(porchSqft) || 0;
  const stateData = statePricing.find(s => s.id === state) || statePricing[0];
  const buildTypeData = buildTypes.find(b => b.id === buildType) || buildTypes[3];
  
  const baseCostLow = sqftNum * stateData.low * buildTypeData.multiplier;
  const baseCostHigh = sqftNum * stateData.high * buildTypeData.multiplier;
  const shopCost = shopNum * 55; // $55/sq ft for shop
  const porchCost = porchNum * 25; // $25/sq ft for porch
  const totalCostLow = baseCostLow + shopCost + porchCost;
  const totalCostHigh = baseCostHigh + shopCost + porchCost;
  const avgCost = (totalCostLow + totalCostHigh) / 2;
  const monthlyPayment = (avgCost * 0.8 * 0.07 / 12) / (1 - Math.pow(1 + 0.07/12, -360)); // 20% down, 7% rate, 30 years

  // By Budget calculations
  const budgetNum = parseFloat(budget) || 0;
  const budgetStateData = statePricing.find(s => s.id === budgetState) || statePricing[0];
  const budgetBuildTypeData = buildTypes.find(b => b.id === budgetBuildType) || buildTypes[3];
  const avgPricePerSqft = ((budgetStateData.low + budgetStateData.high) / 2) * budgetBuildTypeData.multiplier;
  const estimatedSqft = avgPricePerSqft > 0 ? budgetNum / avgPricePerSqft : 0;
  const estimatedBedrooms = Math.floor(estimatedSqft / 500);
  const estimatedBathrooms = Math.max(1, Math.floor(estimatedBedrooms * 0.75));

  // Cost Breakdown calculations
  const breakdownSqftNum = parseFloat(breakdownSqft) || 0;
  const breakdownShopNum = parseFloat(breakdownShop) || 0;
  const breakdownPorchNum = parseFloat(breakdownPorch) || 0;
  const finishData = finishLevels.find(f => f.id === finishLevel) || finishLevels[1];
  
  const foundationCost = foundationType === "slab" ? breakdownSqftNum * 10 : 
                         foundationType === "pier" ? breakdownSqftNum * 8 : 
                         breakdownSqftNum * 45; // basement
  const frameSidingCost = breakdownSqftNum * 22;
  const roofingCost = breakdownSqftNum * 7;
  const plumbingCost = 8000 + (breakdownSqftNum > 2000 ? (breakdownSqftNum - 2000) * 3 : 0);
  const electricalCost = 12000 + (breakdownSqftNum > 2000 ? (breakdownSqftNum - 2000) * 4 : 0);
  const hvacCost = 10000 + (breakdownSqftNum > 2000 ? (breakdownSqftNum - 2000) * 3 : 0);
  const interiorCost = breakdownSqftNum * finishData.perSqFt;
  const windowsDoorsCost = 8000 + (breakdownSqftNum > 2000 ? 3000 : 0);
  const permitsCost = 1500;
  const breakdownShopCost = breakdownShopNum * 55;
  const breakdownPorchCost = breakdownPorchNum * 25;
  
  const subtotal = foundationCost + frameSidingCost + roofingCost + plumbingCost + 
                   electricalCost + hvacCost + interiorCost + windowsDoorsCost + 
                   permitsCost + breakdownShopCost + breakdownPorchCost;
  const contingency = includeContingency ? subtotal * 0.15 : 0;
  const grandTotal = subtotal + contingency;

  const tabs = [
    { id: "sqft", label: "By Square Footage", icon: "📐" },
    { id: "budget", label: "By Budget", icon: "💰" },
    { id: "breakdown", label: "Cost Breakdown", icon: "📋" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Barndominium Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Barndominium Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator to estimate barndominium build costs. Calculate by square footage or budget, 
            with detailed cost breakdowns for kits, turnkey builds, and custom construction.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Average Barndominium Costs (2025)</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>Kit Only:</strong> $20-$50/sq ft | <strong>Basic Turnkey:</strong> $65-$120/sq ft | <strong>Mid-Range:</strong> $130-$160/sq ft | <strong>High-End:</strong> $160-$250+/sq ft
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
                backgroundColor: activeTab === tab.id ? "#B45309" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "sqft" && "📐 Project Details"}
                {activeTab === "budget" && "💰 Your Budget"}
                {activeTab === "breakdown" && "📋 Build Specifications"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "sqft" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Living Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
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

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Build Type
                    </label>
                    <select
                      value={buildType}
                      onChange={(e) => setBuildType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {buildTypes.map(bt => (
                        <option key={bt.id} value={bt.id}>{bt.name}</option>
                      ))}
                    </select>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      {buildTypeData.description}
                    </p>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      State/Region
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {statePricing.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Shop/Garage (sq ft)
                      </label>
                      <input
                        type="number"
                        value={shopSqft}
                        onChange={(e) => setShopSqft(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Covered Porch (sq ft)
                      </label>
                      <input
                        type="number"
                        value={porchSqft}
                        onChange={(e) => setPorchSqft(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Total Budget
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "1.1rem" }}>$</span>
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
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Build Type
                    </label>
                    <select
                      value={budgetBuildType}
                      onChange={(e) => setBudgetBuildType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {buildTypes.map(bt => (
                        <option key={bt.id} value={bt.id}>{bt.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      State/Region
                    </label>
                    <select
                      value={budgetState}
                      onChange={(e) => setBudgetState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {statePricing.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Note:</strong> Budget assumes construction costs only. Add $50K-$150K+ for land, site prep, well/septic, and driveway.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "breakdown" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Living Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={breakdownSqft}
                      onChange={(e) => setBreakdownSqft(e.target.value)}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Foundation Type
                      </label>
                      <select
                        value={foundationType}
                        onChange={(e) => setFoundationType(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="slab">Concrete Slab</option>
                        <option value="pier">Pier & Beam</option>
                        <option value="basement">Basement</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Interior Finish Level
                      </label>
                      <select
                        value={finishLevel}
                        onChange={(e) => setFinishLevel(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.9rem",
                          backgroundColor: "white"
                        }}
                      >
                        {finishLevels.map(f => (
                          <option key={f.id} value={f.id}>{f.name} (${f.perSqFt}/sqft)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Shop/Garage (sq ft)
                      </label>
                      <input
                        type="number"
                        value={breakdownShop}
                        onChange={(e) => setBreakdownShop(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px" }}>
                        Covered Porch (sq ft)
                      </label>
                      <input
                        type="number"
                        value={breakdownPorch}
                        onChange={(e) => setBreakdownPorch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeContingency}
                      onChange={(e) => setIncludeContingency(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151" }}>
                      Include 15% Contingency (Recommended)
                    </span>
                  </label>
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
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Estimate</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "sqft" && (
                <>
                  {/* Total Cost */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Estimated Total Cost</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalCostLow.toLocaleString(undefined, {maximumFractionDigits: 0})} - ${totalCostHigh.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      {sqftNum.toLocaleString()} sq ft @ ${(stateData.low * buildTypeData.multiplier).toFixed(0)}-${(stateData.high * buildTypeData.multiplier).toFixed(0)}/sq ft
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Cost Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Living Area:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${baseCostLow.toLocaleString(undefined, {maximumFractionDigits: 0})} - ${baseCostHigh.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      {shopNum > 0 && (
                        <>
                          <div style={{ color: "#6B7280" }}>Shop ({shopNum} sq ft):</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>+${shopCost.toLocaleString()}</div>
                        </>
                      )}
                      {porchNum > 0 && (
                        <>
                          <div style={{ color: "#6B7280" }}>Porch ({porchNum} sq ft):</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>+${porchCost.toLocaleString()}</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Monthly Payment */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1D4ED8" }}>
                      <strong>Est. Monthly Payment:</strong> ${monthlyPayment.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo
                      <span style={{ fontSize: "0.75rem", color: "#6B7280" }}> (20% down, 7% rate, 30yr)</span>
                    </p>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  {/* Estimated Size */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>You Can Build Approximately</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {estimatedSqft.toLocaleString(undefined, {maximumFractionDigits: 0})} sq ft
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {estimatedBedrooms} Bed / {estimatedBathrooms} Bath (approx)
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Based On</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Budget:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${budgetNum.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Build Type:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{budgetBuildTypeData.name}</div>
                      <div style={{ color: "#6B7280" }}>Avg $/sq ft:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${avgPricePerSqft.toFixed(0)}</div>
                      <div style={{ color: "#6B7280" }}>Location:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{budgetStateData.name}</div>
                    </div>
                  </div>

                  {/* What's Included */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> {budgetBuildType === "kit" || budgetBuildType === "kit-assembly" 
                        ? "Kit builds require you to finish the interior. Budget an additional $40-$80/sq ft for move-in ready."
                        : "Turnkey builds include interior finishes. Add 10-20% contingency for unexpected costs."}
                    </p>
                  </div>
                </>
              )}

              {activeTab === "breakdown" && (
                <>
                  {/* Grand Total */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Estimated Total</p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                      ${grandTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                      ${(grandTotal / breakdownSqftNum).toFixed(0)}/sq ft (living area)
                    </p>
                  </div>

                  {/* Itemized Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px",
                    maxHeight: "280px",
                    overflowY: "auto"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Itemized Costs</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.8rem" }}>
                      <div style={{ color: "#6B7280" }}>Foundation ({foundationType}):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${foundationCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Steel Frame & Siding:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${frameSidingCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Roofing:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${roofingCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Windows & Doors:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${windowsDoorsCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Plumbing:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${plumbingCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Electrical:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${electricalCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>HVAC:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${hvacCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Interior ({finishData.name}):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${interiorCost.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Permits:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${permitsCost.toLocaleString()}</div>
                      {breakdownShopNum > 0 && (
                        <>
                          <div style={{ color: "#6B7280" }}>Shop ({breakdownShopNum} sq ft):</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${breakdownShopCost.toLocaleString()}</div>
                        </>
                      )}
                      {breakdownPorchNum > 0 && (
                        <>
                          <div style={{ color: "#6B7280" }}>Porch ({breakdownPorchNum} sq ft):</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>${breakdownPorchCost.toLocaleString()}</div>
                        </>
                      )}
                      <div style={{ borderTop: "1px solid #D1D5DB", paddingTop: "6px", color: "#374151" }}>Subtotal:</div>
                      <div style={{ borderTop: "1px solid #D1D5DB", paddingTop: "6px", textAlign: "right", fontWeight: "500" }}>${subtotal.toLocaleString()}</div>
                      {includeContingency && (
                        <>
                          <div style={{ color: "#D97706" }}>Contingency (15%):</div>
                          <div style={{ textAlign: "right", fontWeight: "500", color: "#D97706" }}>+${contingency.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Not Included */}
                  <div style={{
                    backgroundColor: "#FEE2E2",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FECACA"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#991B1B" }}>
                      <strong>Not Included:</strong> Land, site prep, well/septic ($15-30K), driveway, landscaping, appliances
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* State Pricing Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📍 Barndominium Costs by State (Turnkey)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>State</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Low</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Mid-Range</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>High-End</th>
                </tr>
              </thead>
              <tbody>
                {statePricing.filter(s => s.id !== "national").map((s, idx) => (
                  <tr key={s.id} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{s.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>${s.low}/sq ft</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>${s.mid}/sq ft</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>${s.high}/sq ft</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Prices are for mid-range turnkey construction (2025 estimates). Actual costs vary by contractor, site conditions, and finishes.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 What is a Barndominium?</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A <strong>barndominium</strong> (or &quot;barndo&quot;) is a steel or metal building converted into living space, 
                  combining the aesthetics of a barn with modern home amenities. They&apos;re popular for their affordability, 
                  durability, and open floor plans that don&apos;t require load-bearing interior walls.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Kit vs Turnkey: What&apos;s the Difference?</h3>
                <p>
                  <strong>Kit builds</strong> ($20-$50/sq ft) include the steel shell and materials—you handle interior 
                  finishing yourself or hire contractors separately. <strong>Turnkey builds</strong> ($130-$250/sq ft) 
                  are move-in ready with all finishes, plumbing, electrical, and HVAC installed by the builder.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Build a Barndominium?</h3>
                <p>
                  <strong>Cost savings:</strong> 30-50% cheaper than traditional homes. <strong>Speed:</strong> 3-6 months 
                  construction vs 6-12 months for stick-built. <strong>Durability:</strong> Steel frames resist rot, 
                  termites, and fire. <strong>Flexibility:</strong> Open spans allow customizable layouts without 
                  structural limitations.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Size Guide */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>📐 Size Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>1,000 sq ft → 1-2 bed</p>
                <p style={{ margin: 0 }}>1,500 sq ft → 2-3 bed</p>
                <p style={{ margin: 0 }}>2,000 sq ft → 3-4 bed</p>
                <p style={{ margin: 0 }}>2,500 sq ft → 4 bed</p>
                <p style={{ margin: 0 }}>3,000+ sq ft → 4-5 bed</p>
              </div>
            </div>

            {/* Not Included Warning */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Budget Extra For</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}>• Land: $50K-$150K+</p>
                <p style={{ margin: "0 0 4px 0" }}>• Well/Septic: $15K-$30K</p>
                <p style={{ margin: "0 0 4px 0" }}>• Driveway: $5K-$15K</p>
                <p style={{ margin: 0 }}>• Contingency: 15-20%</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/barndominium-cost-calculator" currentCategory="Construction" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. 
            Actual costs vary significantly based on location, contractor, site conditions, material choices, and market conditions. 
            Always get multiple quotes from licensed contractors before starting your project.
          </p>
        </div>
      </div>
    </div>
  );
}