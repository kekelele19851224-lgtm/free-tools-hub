"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Rock types with densities (lbs per cubic foot)
const rockTypes = {
  "Pea Gravel (3/8\")": { density: 96, recommendedDepth: 2, coveragePerTon: 130 },
  "3/4\" River Rock": { density: 90, recommendedDepth: 2.5, coveragePerTon: 100 },
  "1-3\" River Rock": { density: 85, recommendedDepth: 3, coveragePerTon: 75 },
  "2\" River Rock": { density: 85, recommendedDepth: 3, coveragePerTon: 75 },
  "3-5\" River Rock": { density: 80, recommendedDepth: 4, coveragePerTon: 55 },
  "Large Boulders (6\"+)": { density: 75, recommendedDepth: 6, coveragePerTon: 40 },
};

// Coverage reference table
const coverageTable = [
  { size: "Pea Gravel (3/8\")", depth: "2\"", sqFtPerTon: "120-140", sqFtPerYard: "160-180" },
  { size: "3/4\" River Rock", depth: "2-3\"", sqFtPerTon: "90-110", sqFtPerYard: "120-140" },
  { size: "1-3\" River Rock", depth: "3-4\"", sqFtPerTon: "65-85", sqFtPerYard: "90-110" },
  { size: "3-5\" River Rock", depth: "4\" (single layer)", sqFtPerTon: "50-65", sqFtPerYard: "70-85" },
];

// FAQ data
const faqs = [
  {
    question: "How much will 1 ton of river rock cover?",
    answer: "One ton of river rock covers approximately 50-130 square feet depending on the rock size and depth. Pea gravel (3/8\") at 2\" depth covers about 120-140 sq ft per ton. 3/4\" river rock at 2-3\" depth covers 90-110 sq ft per ton. Larger 1-3\" river rock at 3\" depth covers 65-85 sq ft per ton. The coverage decreases as rock size increases because larger rocks require deeper coverage."
  },
  {
    question: "How do I calculate how much river stone I need?",
    answer: "To calculate river stone needed: (1) Measure your area's length and width in feet, (2) Multiply length × width to get square footage, (3) Determine depth in inches based on rock size (2\" for small, 3-4\" for large), (4) Calculate cubic yards: (Length × Width × Depth in feet) ÷ 27, (5) Convert to tons if needed: cubic yards × 1.35. For example, a 10×10 ft area at 3\" depth needs about 0.93 cubic yards or 1.25 tons of river rock."
  },
  {
    question: "How much does river stone cost per yard?",
    answer: "River stone costs $50-$150 per cubic yard depending on type and location. Pea gravel is cheapest at $30-$60/yard. Standard 1-3\" river rock costs $50-$100/yard. Decorative colored river rock can cost $100-$200/yard. Delivery typically adds $50-$100 for local delivery. Buying in bulk (5+ yards) usually offers 10-20% savings compared to smaller quantities."
  },
  {
    question: "How much does it cost to install 1 yard of river rock?",
    answer: "Installation of 1 cubic yard of river rock costs $100-$300 total, including material ($50-$150) and labor ($50-$150). Professional installation runs $1-$3 per square foot. One cubic yard covers approximately 100-160 sq ft at 2-3\" depth. DIY installation saves on labor but requires proper ground preparation including landscape fabric, edging, and a level base for best results."
  },
  {
    question: "What depth should river rock be?",
    answer: "River rock depth depends on the stone size: Small gravel (3/8\"-1/2\"): 2 inches minimum. Medium rock (3/4\"-1\"): 2-3 inches. Large rock (1-3\"): 3-4 inches. Extra large (3-5\"): 4+ inches or single layer. Deeper coverage provides better weed suppression and a more stable surface. Always install landscape fabric underneath to prevent weeds and keep rocks from sinking into soil."
  },
  {
    question: "How many bags of river rock do I need?",
    answer: "Most bagged river rock comes in 0.5 cubic foot bags (about 50 lbs). To calculate bags needed: (1) Find your cubic feet needed: Length × Width × Depth (all in feet), (2) Divide by 0.5 to get number of bags. For example, a 4×4 ft area at 3\" depth = 4 cubic feet = 8 bags. Bulk delivery is more economical for areas over 50 sq ft, as bagged rock costs 2-3× more per cubic foot."
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

export default function RiverStoneCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculator" | "coverage">("calculator");

  // Tab 1: How Much Do I Need
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("10");
  const [rockType, setRockType] = useState<string>("1-3\" River Rock");
  const [depth, setDepth] = useState<string>("3");
  const [pricePerTon, setPricePerTon] = useState<string>("50");

  // Tab 1: Results
  const [area, setArea] = useState<number>(0);
  const [volumeCuFt, setVolumeCuFt] = useState<number>(0);
  const [volumeCuYd, setVolumeCuYd] = useState<number>(0);
  const [weightTons, setWeightTons] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [bagsNeeded, setBagsNeeded] = useState<number>(0);

  // Tab 2: Coverage Calculator
  const [coverageAmount, setCoverageAmount] = useState<string>("1");
  const [coverageUnit, setCoverageUnit] = useState<string>("tons");
  const [coverageRockType, setCoverageRockType] = useState<string>("1-3\" River Rock");
  const [coverageDepth, setCoverageDepth] = useState<string>("3");
  const [coverageArea, setCoverageArea] = useState<number>(0);

  // Update depth when rock type changes
  useEffect(() => {
    const rock = rockTypes[rockType as keyof typeof rockTypes];
    if (rock) {
      setDepth(rock.recommendedDepth.toString());
    }
  }, [rockType]);

  // Tab 1: Calculate amount needed
  useEffect(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    const price = parseFloat(pricePerTon) || 0;
    const rock = rockTypes[rockType as keyof typeof rockTypes];

    if (l > 0 && w > 0 && d > 0 && rock) {
      const areaCalc = l * w;
      const depthFt = d / 12;
      const volCuFt = areaCalc * depthFt;
      const volCuYd = volCuFt / 27;
      const weightLbs = volCuFt * rock.density;
      const tons = weightLbs / 2000;
      const cost = tons * price;
      const bags = Math.ceil(volCuFt / 0.5); // 0.5 cu ft per bag

      setArea(areaCalc);
      setVolumeCuFt(volCuFt);
      setVolumeCuYd(volCuYd);
      setWeightTons(tons);
      setTotalCost(cost);
      setBagsNeeded(bags);
    }
  }, [length, width, depth, rockType, pricePerTon]);

  // Tab 2: Calculate coverage
  useEffect(() => {
    const amount = parseFloat(coverageAmount) || 0;
    const d = parseFloat(coverageDepth) || 0;
    const rock = rockTypes[coverageRockType as keyof typeof rockTypes];

    if (amount > 0 && d > 0 && rock) {
      let volCuFt;
      if (coverageUnit === "tons") {
        const weightLbs = amount * 2000;
        volCuFt = weightLbs / rock.density;
      } else {
        volCuFt = amount * 27;
      }

      const depthFt = d / 12;
      const coverage = volCuFt / depthFt;
      setCoverageArea(coverage);
    }
  }, [coverageAmount, coverageUnit, coverageRockType, coverageDepth]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const tabs = [
    { id: "calculator" as const, label: "How Much Do I Need?", icon: "📐" },
    { id: "coverage" as const, label: "Coverage Calculator", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>River Stone Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            River Stone Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much river rock you need for your landscaping project. Get estimates in cubic yards, tons, and bags with cost calculations.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#F0FDF4",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BBF7D0"
        }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#166534", marginBottom: "8px" }}>
            🪨 Quick Reference: How Much Does 1 Ton Cover?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: "12px" }}>
            <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>Pea Gravel</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#22C55E", margin: 0 }}>120-140 sq ft</p>
            </div>
            <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>3/4&quot; Rock</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#22C55E", margin: 0 }}>90-110 sq ft</p>
            </div>
            <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>1-3&quot; Rock</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#22C55E", margin: 0 }}>65-85 sq ft</p>
            </div>
            <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>3-5&quot; Rock</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#22C55E", margin: 0 }}>50-65 sq ft</p>
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
          <div style={{
            display: "flex",
            borderBottom: "1px solid #E5E7EB",
            backgroundColor: "#F9FAFB"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "16px",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #78716C" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#57534E" : "#6B7280",
                  fontSize: "0.95rem",
                  transition: "all 0.2s"
                }}
              >
                <span style={{ marginRight: "8px" }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: "32px" }}>
            {/* Tab 1: How Much Do I Need */}
            {activeTab === "calculator" && (
              <div className="calc-grid river-stone-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📏 Enter Your Measurements
                  </h3>

                  {/* Length & Width */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Length (ft)
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "10px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Width (ft)
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "10px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Rock Type */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Rock Size
                    </label>
                    <select
                      value={rockType}
                      onChange={(e) => setRockType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.keys(rockTypes).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Depth */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Depth (inches)
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      {[2, 3, 4, 6].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDepth(d.toString())}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: depth === d.toString() ? "2px solid #78716C" : "1px solid #E5E7EB",
                            backgroundColor: depth === d.toString() ? "#F5F5F4" : "white",
                            color: depth === d.toString() ? "#57534E" : "#6B7280",
                            fontWeight: depth === d.toString() ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {d}&quot;
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem"
                      }}
                      min="1"
                      max="12"
                      step="0.5"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Recommended: {rockTypes[rockType as keyof typeof rockTypes]?.recommendedDepth}&quot; for {rockType}
                    </p>
                  </div>

                  {/* Price */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Price per Ton ($)
                    </label>
                    <input
                      type="number"
                      value={pricePerTon}
                      onChange={(e) => setPricePerTon(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Typical range: $25-$75 per ton
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="calc-results river-stone-results" style={{ backgroundColor: "#F5F5F4", padding: "24px", borderRadius: "12px", border: "2px solid #D6D3D1" }}>
                  <h3 style={{ fontWeight: "600", color: "#57534E", marginBottom: "20px", fontSize: "1.1rem" }}>
                    🪨 You Will Need
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#E7E5E4",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #A8A29E"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#57534E", marginBottom: "8px" }}>Total Weight</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#44403C", margin: 0 }}>
                      {formatNumber(weightTons)} tons
                    </p>
                    <p style={{ fontSize: "1rem", color: "#78716C", marginTop: "8px" }}>
                      ({formatNumber(volumeCuYd)} cubic yards)
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Area</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(area, 0)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Volume</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(volumeCuFt)} cu ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Bags (0.5 cu ft each)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{bagsNeeded} bags</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "14px", backgroundColor: "#D6D3D1", borderRadius: "8px" }}>
                      <span style={{ fontWeight: "600", color: "#57534E" }}>Estimated Cost</span>
                      <span style={{ fontWeight: "700", color: "#44403C", fontSize: "1.25rem" }}>${formatNumber(totalCost, 0)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>Tip:</strong> Order 5-10% extra to account for settling, spillage, and uneven areas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Coverage Calculator */}
            {activeTab === "coverage" && (
              <div className="calc-grid river-stone-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📊 How Much Area Will It Cover?
                  </h3>

                  {/* Amount */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Amount
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <input
                        type="number"
                        value={coverageAmount}
                        onChange={(e) => setCoverageAmount(e.target.value)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "10px",
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}
                        min="0"
                        step="0.5"
                      />
                      <select
                        value={coverageUnit}
                        onChange={(e) => setCoverageUnit(e.target.value)}
                        style={{
                          padding: "12px 16px",
                          border: "2px solid #E5E7EB",
                          borderRadius: "10px",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="tons">Tons</option>
                        <option value="yards">Cubic Yards</option>
                      </select>
                    </div>
                  </div>

                  {/* Rock Type */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Rock Size
                    </label>
                    <select
                      value={coverageRockType}
                      onChange={(e) => setCoverageRockType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.keys(rockTypes).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Depth */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Depth (inches)
                    </label>
                    <select
                      value={coverageDepth}
                      onChange={(e) => setCoverageDepth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="2">2 inches</option>
                      <option value="3">3 inches</option>
                      <option value="4">4 inches</option>
                      <option value="6">6 inches</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div className="calc-results river-stone-results" style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", border: "2px solid #A7F3D0" }}>
                  <h3 style={{ fontWeight: "600", color: "#065F46", marginBottom: "20px", fontSize: "1.1rem" }}>
                    ✅ Coverage Result
                  </h3>

                  <div style={{
                    backgroundColor: "#D1FAE5",
                    padding: "24px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #10B981"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#065F46", marginBottom: "8px" }}>
                      {coverageAmount} {coverageUnit} will cover
                    </p>
                    <p style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669", margin: 0 }}>
                      {formatNumber(coverageArea, 0)} sq ft
                    </p>
                    <p style={{ fontSize: "0.9rem", color: "#10B981", marginTop: "8px" }}>
                      at {coverageDepth}&quot; depth
                    </p>
                  </div>

                  <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#065F46", margin: 0 }}>
                      <strong>Equivalent dimensions:</strong><br />
                      {Math.sqrt(coverageArea).toFixed(1)} ft × {Math.sqrt(coverageArea).toFixed(1)} ft (square)<br />
                      {(coverageArea / 10).toFixed(1)} ft × 10 ft (pathway)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coverage Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📋 River Rock Coverage Chart
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Rock Size</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recommended Depth</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#F0FDF4" }}>Sq Ft per Ton</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#EFF6FF" }}>Sq Ft per Yard</th>
                </tr>
              </thead>
              <tbody>
                {coverageTable.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.size}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.depth}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#16A34A", fontWeight: "600" }}>{row.sqFtPerTon}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>{row.sqFtPerYard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "16px" }}>
            * Coverage varies based on rock shape, compaction, and application method. These are typical ranges for landscaping projects.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How to Calculate */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 How to Calculate River Rock Needed
              </h2>

              <div style={{ backgroundColor: "#F5F5F4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#57534E", marginBottom: "12px" }}>The Formula</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#44403C",
                  color: "#D6D3D1",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Cubic Yards = (Length × Width × Depth in feet) ÷ 27<br />
                  Tons = Cubic Yards × 1.35 (average)<br />
                  Cost = Tons × Price per Ton
                </code>
              </div>

              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Step-by-Step Example:</h3>
              <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px" }}>
                <p style={{ color: "#92400E", margin: 0, lineHeight: "1.8" }}>
                  <strong>Project:</strong> 10 ft × 10 ft garden bed with 3&quot; river rock<br />
                  <strong>Step 1:</strong> Area = 10 × 10 = 100 sq ft<br />
                  <strong>Step 2:</strong> Depth in feet = 3&quot; ÷ 12 = 0.25 ft<br />
                  <strong>Step 3:</strong> Volume = 100 × 0.25 = 25 cu ft<br />
                  <strong>Step 4:</strong> Cubic yards = 25 ÷ 27 = 0.93 yards<br />
                  <strong>Step 5:</strong> Tons = 0.93 × 1.35 = 1.25 tons<br />
                  <strong>Result:</strong> Order 1.25-1.5 tons (with extra)
                </p>
              </div>
            </div>

            {/* Rock Sizes Guide */}
            <div style={{
              backgroundColor: "#F5F5F4",
              borderRadius: "16px",
              border: "1px solid #D6D3D1",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#57534E", marginBottom: "16px" }}>
                🪨 River Rock Size Guide
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { size: "Pea Gravel (3/8\")", use: "Walkways, patios, drainage, around plants", depth: "2\"" },
                  { size: "3/4\" River Rock", use: "Ground cover, pathways, drainage areas", depth: "2-3\"" },
                  { size: "1-3\" River Rock", use: "Garden beds, borders, dry creek beds", depth: "3-4\"" },
                  { size: "3-5\" River Rock", use: "Focal points, water features, erosion control", depth: "Single layer" },
                  { size: "6\"+ Boulders", use: "Accent pieces, retaining, natural features", depth: "As needed" },
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "16px", padding: "16px", backgroundColor: "white", borderRadius: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600", color: "#44403C", margin: "0 0 4px 0" }}>{item.size}</p>
                      <p style={{ fontSize: "0.875rem", color: "#78716C", margin: 0 }}>{item.use}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.75rem", color: "#A8A29E", margin: 0 }}>Depth</p>
                      <p style={{ fontWeight: "600", color: "#57534E", margin: 0 }}>{item.depth}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Price Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💰 Price Guide
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Per Ton</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#16A34A", margin: 0 }}>$25 - $75</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Per Cubic Yard</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>$50 - $150</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Delivery</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#F59E0B", margin: 0 }}>$50 - $100</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Installation</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#8B5CF6", margin: 0 }}>$1 - $3/sq ft</p>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                💡 Pro Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Always install landscape fabric first</li>
                <li style={{ marginBottom: "8px" }}>Order 5-10% extra for waste</li>
                <li style={{ marginBottom: "8px" }}>Bulk delivery saves 30-40% vs bags</li>
                <li style={{ marginBottom: "8px" }}>Use edging to contain rocks</li>
                <li>Deeper coverage = less maintenance</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/river-stone-calculator"
              currentCategory="Home"
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
            🪨 <strong>Disclaimer:</strong> These calculations are estimates based on typical river rock densities. Actual amounts may vary based on rock type, shape, moisture content, and supplier specifications. Always confirm with your supplier and consider ordering 5-10% extra for your project.
          </p>
        </div>
      </div>
    </div>
  );
}
