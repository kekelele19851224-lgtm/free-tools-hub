"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How to calculate stump grinding cost?",
    answer: "Stump grinding cost is typically calculated by multiplying the stump diameter (in inches) by the rate per inch ($2-$5). For example, a 20-inch stump at $3/inch = $60. However, most companies have a minimum service fee of $100-$150, so small stumps often cost the minimum regardless of size. Add-ons like cleanup, deep grinding, or difficult access increase the total."
  },
  {
    question: "How much does it cost to grind a 12-inch stump?",
    answer: "A 12-inch stump typically costs $100-$150 to grind, which is usually the minimum service fee. At $3-$4 per inch, a 12-inch stump would calculate to $36-$48, but since this is below the minimum, you'll pay the minimum fee. Multiple 12-inch stumps together get a better per-stump rate."
  },
  {
    question: "Is it cheaper to grind or remove a stump?",
    answer: "Stump grinding is significantly cheaper than full stump removal. Grinding typically costs $100-$400 per stump, while complete removal (including all roots) costs $150-$500+ per stump. Grinding leaves roots underground to decompose naturally, while removal excavates everything. Choose grinding unless you're planning construction or planting a new tree in the exact spot."
  },
  {
    question: "How deep should you grind a stump?",
    answer: "Standard stump grinding goes 4-6 inches below ground level, which is sufficient for planting grass. If you plan to plant a new tree or install landscaping, request 8-12 inches deep (costs 20-30% more). For construction or paving, you may need 12-18 inches deep or complete removal."
  },
  {
    question: "Can I grind a stump myself?",
    answer: "Yes, but it's often not cost-effective for 1-2 stumps. Renting a small stump grinder costs $150-$300/day plus delivery. You'll also need safety gear and time to learn the equipment. DIY makes sense for 5+ stumps or if you have ongoing needs. For 1-3 stumps, hiring a professional is usually cheaper and faster."
  },
  {
    question: "What factors increase stump grinding cost?",
    answer: "Several factors can increase cost: 1) Large diameter (>24 inches), 2) Hardwood species (oak, hickory) vs softwood, 3) Deep grinding requests, 4) Difficult access (slopes, fences, near structures), 5) Extensive root systems requiring grinding, 6) Cleanup and debris removal, 7) Soil filling and reseeding the area."
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

// Size category reference data
const sizeCategories = [
  { size: "Small", range: "≤12 inches", cost: "$100 - $150", note: "Usually minimum fee" },
  { size: "Medium", range: "12-24 inches", cost: "$150 - $300", note: "Most common size" },
  { size: "Large", range: "24-36 inches", cost: "$300 - $500", note: "Requires larger equipment" },
  { size: "Extra Large", range: "36+ inches", cost: "$500 - $800+", note: "May need multiple sessions" },
];

export default function StumpGrindingCostCalculator() {
  const [activeTab, setActiveTab] = useState<'single' | 'multiple' | 'guide'>('single');

  // Tab 1: Single Stump
  const [diameter, setDiameter] = useState<string>("18");
  const [ratePerInch, setRatePerInch] = useState<string>("3.50");
  const [minimumFee, setMinimumFee] = useState<string>("125");
  const [deepGrinding, setDeepGrinding] = useState<boolean>(false);
  const [difficultAccess, setDifficultAccess] = useState<boolean>(false);
  const [cleanup, setCleanup] = useState<boolean>(false);
  const [fillReseed, setFillReseed] = useState<boolean>(false);

  // Tab 2: Multiple Stumps
  const [stumps, setStumps] = useState([
    { id: 1, diameter: "18" },
    { id: 2, diameter: "12" },
  ]);
  const [multiRatePerInch, setMultiRatePerInch] = useState<string>("3.50");
  const [multiMinimumFee, setMultiMinimumFee] = useState<string>("125");
  const [multiCleanup, setMultiCleanup] = useState<boolean>(false);
  const [multiFillReseed, setMultiFillReseed] = useState<boolean>(false);

  // Tab 1 Calculations
  const singleResults = useMemo(() => {
    const dia = parseFloat(diameter) || 0;
    const rate = parseFloat(ratePerInch) || 0;
    const minFee = parseFloat(minimumFee) || 0;

    if (dia <= 0) {
      return { baseCost: 0, addOns: 0, totalLow: 0, totalHigh: 0, isValid: false };
    }

    let baseCost = dia * rate;
    if (baseCost < minFee) {
      baseCost = minFee;
    }

    let addOns = 0;
    if (deepGrinding) addOns += baseCost * 0.25;
    if (difficultAccess) addOns += 50;
    if (cleanup) addOns += 75;
    if (fillReseed) addOns += 100;

    const totalMid = baseCost + addOns;
    const totalLow = Math.round(totalMid * 0.85);
    const totalHigh = Math.round(totalMid * 1.15);

    return {
      baseCost: Math.round(baseCost),
      addOns: Math.round(addOns),
      totalLow,
      totalHigh,
      totalMid: Math.round(totalMid),
      isValid: true
    };
  }, [diameter, ratePerInch, minimumFee, deepGrinding, difficultAccess, cleanup, fillReseed]);

  // Tab 2 Calculations
  const multipleResults = useMemo(() => {
    const rate = parseFloat(multiRatePerInch) || 0;
    const minFee = parseFloat(multiMinimumFee) || 0;
    
    const stumpDetails = stumps.map(stump => {
      const dia = parseFloat(stump.diameter) || 0;
      let cost = dia * rate;
      if (cost < minFee) cost = minFee;
      return {
        ...stump,
        cost: Math.round(cost)
      };
    });

    const validStumps = stumpDetails.filter(s => (parseFloat(s.diameter) || 0) > 0);
    const stumpCount = validStumps.length;
    const subtotal = stumpDetails.reduce((sum, s) => sum + s.cost, 0);

    // Bulk discount
    let discountPercent = 0;
    if (stumpCount >= 10) discountPercent = 20;
    else if (stumpCount >= 5) discountPercent = 15;
    else if (stumpCount >= 2) discountPercent = 10;

    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    let afterDiscount = subtotal - discountAmount;

    // Add-ons
    let addOns = 0;
    if (multiCleanup) addOns += 75 * stumpCount;
    if (multiFillReseed) addOns += 100 * stumpCount;

    const totalMid = afterDiscount + addOns;
    const totalLow = Math.round(totalMid * 0.85);
    const totalHigh = Math.round(totalMid * 1.15);

    return {
      stumpDetails,
      stumpCount,
      subtotal,
      discountPercent,
      discountAmount,
      afterDiscount,
      addOns,
      totalLow,
      totalHigh,
      totalMid: Math.round(totalMid),
      isValid: stumpCount > 0
    };
  }, [stumps, multiRatePerInch, multiMinimumFee, multiCleanup, multiFillReseed]);

  // Add stump
  const addStump = () => {
    setStumps([...stumps, { id: Date.now(), diameter: "" }]);
  };

  // Remove stump
  const removeStump = (id: number) => {
    if (stumps.length > 1) {
      setStumps(stumps.filter(s => s.id !== id));
    }
  };

  // Update stump
  const updateStump = (id: number, diameter: string) => {
    setStumps(stumps.map(s => s.id === id ? { ...s, diameter } : s));
  };

  // Get size category
  const getSizeCategory = (dia: number) => {
    if (dia <= 12) return { label: "Small", color: "#059669" };
    if (dia <= 24) return { label: "Medium", color: "#D97706" };
    if (dia <= 36) return { label: "Large", color: "#EA580C" };
    return { label: "Extra Large", color: "#DC2626" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Stump Grinding Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪵</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Stump Grinding Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate tree stump removal costs based on diameter, rate per inch, and additional services. 
            Calculate single or multiple stumps with bulk discounts.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>
                <strong>Quick Estimate:</strong> Stump Diameter × $2-$5/inch (minimum $100-$150)
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Example: 18&quot; stump × $3.50/inch = $63 → Pay minimum $125 | Large 30&quot; stump × $3.50 = $105
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("single")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "single" ? "#92400E" : "#E5E7EB",
              color: activeTab === "single" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🪵 Single Stump
          </button>
          <button
            onClick={() => setActiveTab("multiple")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "multiple" ? "#92400E" : "#E5E7EB",
              color: activeTab === "multiple" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🪵🪵 Multiple Stumps
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "guide" ? "#92400E" : "#E5E7EB",
              color: activeTab === "guide" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Cost Guide
          </button>
        </div>

        {/* Tab 1: Single Stump */}
        {activeTab === 'single' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🪵 Stump Details
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Stump Diameter */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Stump Diameter (inches)
                  </label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="18"
                  />
                  {parseFloat(diameter) > 0 && (
                    <span style={{
                      display: "inline-block",
                      marginTop: "8px",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      fontSize: "0.8rem",
                      backgroundColor: getSizeCategory(parseFloat(diameter)).color + "20",
                      color: getSizeCategory(parseFloat(diameter)).color,
                      fontWeight: "600"
                    }}>
                      {getSizeCategory(parseFloat(diameter)).label} Stump
                    </span>
                  )}
                </div>

                {/* Rate Per Inch */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Rate Per Inch ($)
                  </label>
                  <input
                    type="number"
                    value={ratePerInch}
                    onChange={(e) => setRatePerInch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="3.50"
                    step="0.50"
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                    {[2, 2.5, 3, 3.5, 4, 4.5, 5].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setRatePerInch(rate.toString())}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: parseFloat(ratePerInch) === rate ? "2px solid #92400E" : "1px solid #D1D5DB",
                          backgroundColor: parseFloat(ratePerInch) === rate ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          color: parseFloat(ratePerInch) === rate ? "#92400E" : "#374151"
                        }}
                      >
                        ${rate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimum Fee */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Minimum Service Fee ($)
                  </label>
                  <input
                    type="number"
                    value={minimumFee}
                    onChange={(e) => setMinimumFee(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="125"
                  />
                </div>

                {/* Add-ons */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                    Additional Services
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={deepGrinding}
                        onChange={(e) => setDeepGrinding(e.target.checked)}
                        style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                      />
                      <span style={{ color: "#374151" }}>Deep Grinding (8-12&quot; below grade) <span style={{ color: "#6B7280" }}>+25%</span></span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={difficultAccess}
                        onChange={(e) => setDifficultAccess(e.target.checked)}
                        style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                      />
                      <span style={{ color: "#374151" }}>Difficult Access (slope, fence, tight space) <span style={{ color: "#6B7280" }}>+$50</span></span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={cleanup}
                        onChange={(e) => setCleanup(e.target.checked)}
                        style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                      />
                      <span style={{ color: "#374151" }}>Cleanup & Haul Away Debris <span style={{ color: "#6B7280" }}>+$75</span></span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={fillReseed}
                        onChange={(e) => setFillReseed(e.target.checked)}
                        style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                      />
                      <span style={{ color: "#374151" }}>Fill Hole & Reseed Grass <span style={{ color: "#6B7280" }}>+$100</span></span>
                    </label>
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
              <div style={{ backgroundColor: "#78350F", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  💰 Estimated Cost
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {!singleResults.isValid ? (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "32px 20px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <span style={{ fontSize: "2.5rem" }}>📏</span>
                    <p style={{ margin: "12px 0 0 0", color: "#92400E", fontWeight: "500" }}>
                      Enter stump diameter to calculate cost
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #D97706"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                        Estimated Cost Range
                      </p>
                      <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#92400E" }}>
                        ${singleResults.totalLow} - ${singleResults.totalHigh}
                      </p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#B45309" }}>
                        Average: <strong>${singleResults.totalMid}</strong>
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Stump Diameter</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{diameter}&quot;</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Rate × Diameter</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>${ratePerInch} × {diameter} = ${Math.round(parseFloat(ratePerInch) * parseFloat(diameter))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Base Cost (w/ minimum)</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>${singleResults.baseCost}</span>
                      </div>
                      {singleResults.addOns > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Add-ons</span>
                          <span style={{ fontWeight: "600", color: "#D97706" }}>+${singleResults.addOns}</span>
                        </div>
                      )}
                    </div>

                    {/* Tip */}
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      border: "1px solid #A7F3D0"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#065F46" }}>
                        💡 <strong>Tip:</strong> Get 3 quotes from local pros. Prices vary by region, tree species, and company.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multiple Stumps */}
        {activeTab === 'multiple' && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#92400E", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🪵🪵 Multiple Stumps
                </h2>
                <button
                  onClick={addStump}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "white",
                    color: "#92400E",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  + Add Stump
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Rate Settings */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Rate Per Inch ($)
                    </label>
                    <input
                      type="number"
                      value={multiRatePerInch}
                      onChange={(e) => setMultiRatePerInch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="3.50"
                      step="0.50"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Minimum Fee Per Stump ($)
                    </label>
                    <input
                      type="number"
                      value={multiMinimumFee}
                      onChange={(e) => setMultiMinimumFee(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="125"
                    />
                  </div>
                </div>

                {/* Stumps List */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                    Enter Each Stump Diameter (inches)
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {stumps.map((stump, index) => (
                      <div key={stump.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ width: "80px", color: "#6B7280", fontSize: "0.9rem" }}>Stump #{index + 1}</span>
                        <input
                          type="number"
                          value={stump.diameter}
                          onChange={(e) => updateStump(stump.id, e.target.value)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #D1D5DB",
                            fontSize: "1rem",
                            maxWidth: "120px"
                          }}
                          placeholder="18"
                        />
                        <span style={{ color: "#6B7280" }}>inches</span>
                        <span style={{ fontWeight: "600", color: "#059669", minWidth: "60px" }}>
                          ${multipleResults.stumpDetails.find(s => s.id === stump.id)?.cost || 0}
                        </span>
                        <button
                          onClick={() => removeStump(stump.id)}
                          disabled={stumps.length === 1}
                          style={{
                            padding: "6px 10px",
                            backgroundColor: stumps.length === 1 ? "#E5E7EB" : "#FEE2E2",
                            color: stumps.length === 1 ? "#9CA3AF" : "#DC2626",
                            border: "none",
                            borderRadius: "6px",
                            cursor: stumps.length === 1 ? "not-allowed" : "pointer"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={multiCleanup}
                      onChange={(e) => setMultiCleanup(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                    />
                    <span style={{ color: "#374151" }}>Cleanup & Haul Away <span style={{ color: "#6B7280" }}>+$75/stump</span></span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={multiFillReseed}
                      onChange={(e) => setMultiFillReseed(e.target.checked)}
                      style={{ width: "18px", height: "18px", accentColor: "#92400E" }}
                    />
                    <span style={{ color: "#374151" }}>Fill & Reseed All <span style={{ color: "#6B7280" }}>+$100/stump</span></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              {/* Breakdown */}
              <div style={{
                backgroundColor: "#ECFDF5",
                borderRadius: "16px",
                padding: "24px",
                border: "2px solid #A7F3D0"
              }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#065F46" }}>📋 Cost Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#047857" }}>Total Stumps</span>
                    <span style={{ fontWeight: "700", color: "#065F46" }}>{multipleResults.stumpCount}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#047857" }}>Subtotal</span>
                    <span style={{ fontWeight: "700", color: "#065F46" }}>${multipleResults.subtotal}</span>
                  </div>
                  {multipleResults.discountPercent > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#047857" }}>Bulk Discount ({multipleResults.discountPercent}%)</span>
                      <span style={{ fontWeight: "700", color: "#059669" }}>-${multipleResults.discountAmount}</span>
                    </div>
                  )}
                  {multipleResults.addOns > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#047857" }}>Add-on Services</span>
                      <span style={{ fontWeight: "700", color: "#D97706" }}>+${multipleResults.addOns}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="calc-results" style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "16px",
                padding: "24px",
                border: "2px solid #D97706",
                textAlign: "center"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#92400E" }}>
                  Estimated Total
                </p>
                <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#92400E" }}>
                  ${multipleResults.totalLow} - ${multipleResults.totalHigh}
                </p>
                <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#B45309" }}>
                  Average: <strong>${multipleResults.totalMid}</strong>
                </p>
                {multipleResults.discountPercent > 0 && (
                  <p style={{
                    margin: "12px 0 0 0",
                    padding: "8px 16px",
                    backgroundColor: "#DCFCE7",
                    borderRadius: "9999px",
                    display: "inline-block",
                    fontSize: "0.85rem",
                    color: "#166534",
                    fontWeight: "600"
                  }}>
                    🎉 {multipleResults.discountPercent}% Bulk Discount Applied!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cost Guide */}
        {activeTab === 'guide' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 Stump Grinding Cost Guide
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Average pricing based on stump diameter. Actual costs vary by location, tree species, and accessibility.
            </p>

            {/* Size Pricing Table */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Cost by Stump Size
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FEF3C7" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Diameter</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Cost Range</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeCategories.map((cat, index) => (
                      <tr key={cat.size} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>{cat.size}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>{cat.range}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#059669", fontWeight: "600" }}>{cat.cost}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>{cat.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Costs */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Additional Service Costs
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {[
                  { service: "Deep Grinding (8-12\")", cost: "+20-30%" },
                  { service: "Difficult Access", cost: "+$25-$75" },
                  { service: "Root Chasing", cost: "+$50-$150" },
                  { service: "Cleanup & Haul Away", cost: "+$50-$100" },
                  { service: "Fill Hole & Reseed", cost: "+$50-$100" },
                  { service: "Same-Day Service", cost: "+$50-$100" },
                ].map(item => (
                  <div key={item.service} style={{ padding: "12px 16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}>{item.service}</p>
                    <p style={{ margin: "4px 0 0 0", color: "#D97706", fontWeight: "600" }}>{item.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DIY vs Pro Comparison */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                DIY vs Professional: Cost Comparison
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#92400E" }}>🔧 DIY Rental</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#B45309", lineHeight: "1.8", fontSize: "0.9rem" }}>
                    <li>Small grinder rental: $150-$300/day</li>
                    <li>Large grinder rental: $300-$500/day</li>
                    <li>Delivery/pickup: $50-$100</li>
                    <li>Safety gear: $30-$50</li>
                    <li><strong>Total: $230-$650+</strong></li>
                  </ul>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#92400E" }}>
                    ✅ Best for: 5+ stumps, ongoing needs
                  </p>
                </div>
                <div style={{ backgroundColor: "#DCFCE7", padding: "20px", borderRadius: "12px", border: "1px solid #86EFAC" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#166534" }}>👷 Professional Service</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#15803D", lineHeight: "1.8", fontSize: "0.9rem" }}>
                    <li>Minimum service call: $100-$150</li>
                    <li>Per inch rate: $2-$5</li>
                    <li>Multi-stump discount: 10-20%</li>
                    <li>Insurance & experience included</li>
                    <li><strong>1-3 stumps: $100-$400</strong></li>
                  </ul>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#166534" }}>
                    ✅ Best for: 1-4 stumps, convenience
                  </p>
                </div>
              </div>
            </div>

            {/* Money-Saving Tips */}
            <div style={{
              backgroundColor: "#EFF6FF",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #BFDBFE"
            }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#1E40AF" }}>💰 Money-Saving Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#1D4ED8", lineHeight: "1.8", fontSize: "0.9rem" }}>
                <li><strong>Bundle with tree removal</strong> - Many companies offer discounts when combining services</li>
                <li><strong>Get multiple quotes</strong> - Prices can vary 50%+ between companies</li>
                <li><strong>Book off-season</strong> - Winter rates are often 10-20% lower</li>
                <li><strong>Keep the mulch</strong> - Ask to leave chips on-site (free fill for garden beds)</li>
                <li><strong>Group with neighbors</strong> - Some pros offer discounts for multiple properties in one trip</li>
              </ul>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪵 How Stump Grinding Pricing Works</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Stump grinding</strong> is the most common and cost-effective way to remove tree stumps. 
                  A professional uses a specialized machine with a rotating cutting wheel to chip away the wood, 
                  typically grinding 4-6 inches below ground level.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Companies Calculate Price</h3>
                <p>
                  Most stump grinding services use one of these pricing methods:
                </p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Per-inch pricing:</strong> $2-$5 per inch of diameter (most common)</li>
                  <li><strong>Per-stump flat rate:</strong> Fixed price per stump regardless of size</li>
                  <li><strong>Hourly rate:</strong> $150-$250/hour (typically for large commercial jobs)</li>
                </ul>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Measuring Your Stump</h3>
                <div style={{
                  backgroundColor: "#FEF3C7",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#92400E" }}>How to Measure:</p>
                  <ol style={{ margin: 0, paddingLeft: "20px", color: "#B45309" }}>
                    <li style={{ marginBottom: "8px" }}>Measure at the widest point <strong>above ground</strong></li>
                    <li style={{ marginBottom: "8px" }}>Measure the trunk, not the root flare at ground level</li>
                    <li style={{ marginBottom: "8px" }}>For irregular shapes, measure longest and shortest, then average</li>
                    <li>Round up to the nearest inch</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Affects Stump Grinding Cost?</h3>
                <p>Several factors beyond size affect your final price:</p>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Tree species:</strong> Hardwoods (oak, maple) take longer than softwoods (pine)</li>
                  <li><strong>Root complexity:</strong> Surface roots extending far from stump cost extra</li>
                  <li><strong>Accessibility:</strong> Tight spaces, slopes, or obstacles increase cost</li>
                  <li><strong>Grinding depth:</strong> Standard is 4-6&quot;; deeper costs more</li>
                  <li><strong>Cleanup preference:</strong> Leaving chips vs. hauling away</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Rate: $2-$5 per inch</p>
                <p style={{ margin: 0 }}>• Minimum fee: $100-$150</p>
                <p style={{ margin: 0 }}>• Small (&lt;12&quot;): ~$100-$150</p>
                <p style={{ margin: 0 }}>• Medium (12-24&quot;): ~$150-$300</p>
                <p style={{ margin: 0 }}>• Large (24&quot;+): $300-$800+</p>
              </div>
            </div>

            {/* Bulk Discounts */}
            <div style={{ backgroundColor: "#DCFCE7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #86EFAC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "16px" }}>🎉 Bulk Discounts</h3>
              <div style={{ fontSize: "0.9rem", color: "#15803D", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}>• 2-4 stumps: ~10% off</p>
                <p style={{ margin: "0 0 4px 0" }}>• 5-9 stumps: ~15% off</p>
                <p style={{ margin: 0 }}>• 10+ stumps: ~20% off</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/stump-grinding-cost-calculator" currentCategory="Home" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
          <p style={{ fontSize: "0.75rem", color: "#92400E", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on industry averages. 
            Actual costs vary significantly by location, tree species, accessibility, and company pricing. 
            Always get multiple quotes from licensed, insured professionals before hiring. 
            Prices shown are for estimation purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}