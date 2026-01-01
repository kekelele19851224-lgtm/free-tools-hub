"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Span table data (inches) - Douglas Fir-Larch #2, 40psf Live + 10psf Dead, L/360
const spanTables: Record<string, Record<string, Record<number, number>>> = {
  "Douglas Fir-Larch": {
    "#1": { 12: 120, 16: 109, 24: 95 },
    "#2": { 12: 118, 16: 107, 24: 88 },
  },
  "Southern Pine": {
    "#1": { 12: 118, 16: 107, 24: 94 },
    "#2": { 12: 116, 16: 105, 24: 86 },
  },
  "Hem-Fir": {
    "#1": { 12: 116, 16: 105, 24: 92 },
    "#2": { 12: 114, 16: 103, 24: 85 },
  },
  "Spruce-Pine-Fir": {
    "#1": { 12: 114, 16: 103, 24: 90 },
    "#2": { 12: 112, 16: 101, 24: 83 },
  },
};

// Span data by joist size (Douglas Fir #2, 40/10 psf, L/360) in inches
const joistSpanData: Record<string, Record<number, number>> = {
  "2x6": { 12: 112, 16: 97, 24: 79 },
  "2x8": { 12: 148, 16: 123, 24: 101 },
  "2x10": { 12: 168, 16: 146, 24: 119 },
  "2x12": { 12: 200, 16: 174, 24: 142 },
};

// Quick reference data for table
const quickReferenceData = [
  { size: "2x6", oc12: "9'-4\"", oc16: "8'-1\"", oc24: "6'-7\"" },
  { size: "2x8", oc12: "12'-4\"", oc16: "10'-3\"", oc24: "8'-5\"" },
  { size: "2x10", oc12: "14'-0\"", oc16: "12'-2\"", oc24: "9'-11\"" },
  { size: "2x12", oc12: "16'-8\"", oc16: "14'-6\"", oc24: "11'-10\"" },
];

// Average lumber prices (2024)
const defaultPrices: Record<string, Record<number, number>> = {
  "2x6": { 8: 5.50, 10: 7.00, 12: 8.50, 14: 10.00, 16: 12.00 },
  "2x8": { 8: 8.00, 10: 10.00, 12: 12.00, 14: 14.00, 16: 16.00 },
  "2x10": { 8: 11.00, 10: 14.00, 12: 17.00, 14: 20.00, 16: 23.00 },
  "2x12": { 8: 14.00, 10: 18.00, 12: 22.00, 14: 26.00, 16: 30.00 },
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate how many floor joists I need?",
    answer: "To calculate floor joist count: (1) Measure the floor length in feet, (2) Convert to inches and divide by joist spacing (usually 16\"), (3) Add 1 for the starting joist. Formula: Number of Joists = (Floor Length × 12 ÷ Spacing) + 1. For a 20-foot floor with 16\" spacing: (20 × 12 ÷ 16) + 1 = 16 joists."
  },
  {
    question: "How far can a 2x10 span as a floor joist?",
    answer: "A 2x10 floor joist can span approximately 12'-2\" at 16\" on-center spacing (most common residential). At 12\" spacing, it can span up to 14'-0\", and at 24\" spacing, about 9'-11\". These values are for Douglas Fir-Larch #2 lumber with standard residential loads (40 psf live, 10 psf dead)."
  },
  {
    question: "How far can a 2x8 span for floor joist?",
    answer: "A 2x8 floor joist can span approximately 10'-3\" at 16\" on-center spacing. At 12\" spacing, the maximum span is about 12'-4\", and at 24\" spacing, approximately 8'-5\". For longer spans, consider upgrading to 2x10 or 2x12 joists."
  },
  {
    question: "What size floor joist do I need for a 12 ft span?",
    answer: "For a 12-foot span with standard 16\" on-center spacing, you'll need 2x10 joists (which can span 12'-2\"). A 2x8 only spans 10'-3\" at 16\" OC, which is insufficient. If you use 12\" spacing, a 2x8 (12'-4\" max) would work. Always verify with local building codes."
  },
  {
    question: "What is the standard floor joist spacing?",
    answer: "The most common floor joist spacing is 16 inches on-center (OC), which is standard for residential construction. Other options include: 12\" OC for heavy loads or longer spans, 19.2\" OC to optimize 8-foot sheet goods, and 24\" OC for light loads or with engineered joists. Local building codes may dictate minimum requirements."
  },
  {
    question: "Do I need rim joists?",
    answer: "Yes, rim joists (also called band joists or header joists) are essential. They run perpendicular to floor joists at each end, enclosing the joist cavity. They provide lateral stability, prevent joist rotation, support exterior walls, and help transfer loads to the foundation. Typically, you need 2 rim joists for a simple rectangular floor."
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
            transition: "transform 0.2s"
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

export default function FloorJoistCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"count" | "span" | "cost">("count");

  // Tab 1: Joist Count inputs
  const [floorLength, setFloorLength] = useState<string>("20");
  const [floorWidth, setFloorWidth] = useState<string>("12");
  const [joistSpacing, setJoistSpacing] = useState<number>(16);
  const [includeRimJoists, setIncludeRimJoists] = useState<boolean>(true);

  // Tab 1: Results
  const [joistCount, setJoistCount] = useState<number>(0);
  const [rimJoistCount, setRimJoistCount] = useState<number>(0);
  const [totalBoards, setTotalBoards] = useState<number>(0);
  const [totalLinearFeet, setTotalLinearFeet] = useState<number>(0);
  const [floorArea, setFloorArea] = useState<number>(0);

  // Tab 2: Span Calculator inputs
  const [requiredSpan, setRequiredSpan] = useState<string>("12");
  const [spanSpacing, setSpanSpacing] = useState<number>(16);
  const [woodSpecies, setWoodSpecies] = useState<string>("Douglas Fir-Larch");
  const [lumberGrade, setLumberGrade] = useState<string>("#2");

  // Tab 2: Results
  const [recommendedSize, setRecommendedSize] = useState<string>("");
  const [spanResults, setSpanResults] = useState<Array<{ size: string; maxSpan: string; meetsRequirement: boolean }>>([]);

  // Tab 3: Cost Estimator inputs
  const [costJoistCount, setCostJoistCount] = useState<string>("16");
  const [costJoistLength, setCostJoistLength] = useState<string>("12");
  const [costJoistSize, setCostJoistSize] = useState<string>("2x10");
  const [pricePerBoard, setPricePerBoard] = useState<string>("17");
  const [wastagePercent, setWastagePercent] = useState<string>("10");

  // Tab 3: Results
  const [boardsNeeded, setBoardsNeeded] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [costPerSqFt, setCostPerSqFt] = useState<number>(0);

  // Tab 1: Calculate joist count
  useEffect(() => {
    const length = parseFloat(floorLength) || 0;
    const width = parseFloat(floorWidth) || 0;

    if (length > 0 && width > 0) {
      const count = Math.ceil((length * 12) / joistSpacing) + 1;
      const rimCount = includeRimJoists ? 2 : 0;
      const total = count + rimCount;
      const linearFt = (count * width) + (rimCount * length);
      const area = length * width;

      setJoistCount(count);
      setRimJoistCount(rimCount);
      setTotalBoards(total);
      setTotalLinearFeet(linearFt);
      setFloorArea(area);
    }
  }, [floorLength, floorWidth, joistSpacing, includeRimJoists]);

  // Tab 2: Calculate span recommendations
  useEffect(() => {
    const spanFt = parseFloat(requiredSpan) || 0;
    const spanInches = spanFt * 12;

    const results: Array<{ size: string; maxSpan: string; meetsRequirement: boolean }> = [];
    let recommended = "";

    for (const size of ["2x6", "2x8", "2x10", "2x12"]) {
      const maxSpanInches = joistSpanData[size][spanSpacing];
      const feet = Math.floor(maxSpanInches / 12);
      const inches = maxSpanInches % 12;
      const maxSpanStr = `${feet}'-${inches}"`;
      const meets = maxSpanInches >= spanInches;

      results.push({ size, maxSpan: maxSpanStr, meetsRequirement: meets });

      if (meets && !recommended) {
        recommended = size;
      }
    }

    setSpanResults(results);
    setRecommendedSize(recommended || "Span too long");
  }, [requiredSpan, spanSpacing]);

  // Tab 3: Calculate cost
  useEffect(() => {
    const count = parseFloat(costJoistCount) || 0;
    const price = parseFloat(pricePerBoard) || 0;
    const wastage = parseFloat(wastagePercent) || 0;
    const length = parseFloat(costJoistLength) || 0;
    const floorLen = parseFloat(floorLength) || 0;
    const floorWid = parseFloat(floorWidth) || 0;

    const boardsWithWaste = Math.ceil(count * (1 + wastage / 100));
    const total = boardsWithWaste * price;
    const area = floorLen * floorWid;
    const perSqFt = area > 0 ? total / area : 0;

    setBoardsNeeded(boardsWithWaste);
    setTotalCost(total);
    setCostPerSqFt(perSqFt);
  }, [costJoistCount, pricePerBoard, wastagePercent, costJoistLength, floorLength, floorWidth]);

  // Update cost tab when count tab changes
  useEffect(() => {
    setCostJoistCount(totalBoards.toString());
    setCostJoistLength(floorWidth);
  }, [totalBoards, floorWidth]);

  // Update price when size changes
  useEffect(() => {
    const length = parseInt(costJoistLength) || 12;
    const nearestLength = [8, 10, 12, 14, 16].reduce((prev, curr) =>
      Math.abs(curr - length) < Math.abs(prev - length) ? curr : prev
    );
    const price = defaultPrices[costJoistSize]?.[nearestLength] || 17;
    setPricePerBoard(price.toFixed(2));
  }, [costJoistSize, costJoistLength]);

  const tabs = [
    { id: "count" as const, label: "Joist Count", icon: "🔢" },
    { id: "span" as const, label: "Span Calculator", icon: "📏" },
    { id: "cost" as const, label: "Cost Estimator", icon: "💰" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Floor Joist Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Floor Joist Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many floor joists you need, find the right joist size for your span, and estimate material costs for your flooring project.
          </p>
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
                  borderBottom: activeTab === tab.id ? "3px solid #2563EB" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#2563EB" : "#6B7280",
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
            {/* Tab 1: Joist Count */}
            {activeTab === "count" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    🏠 Floor Dimensions
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Floor Length (ft) <span style={{ color: "#6B7280", fontWeight: "400" }}>- parallel to joists</span>
                    </label>
                    <input
                      type="number"
                      value={floorLength}
                      onChange={(e) => setFloorLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="1"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Floor Width (ft) <span style={{ color: "#6B7280", fontWeight: "400" }}>- joist span direction</span>
                    </label>
                    <input
                      type="number"
                      value={floorWidth}
                      onChange={(e) => setFloorWidth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="1"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Joist Spacing (On-Center)
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {[12, 16, 19.2, 24].map((spacing) => (
                        <button
                          key={spacing}
                          onClick={() => setJoistSpacing(spacing)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "8px",
                            border: joistSpacing === spacing ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: joistSpacing === spacing ? "#EFF6FF" : "white",
                            color: joistSpacing === spacing ? "#1E40AF" : "#4B5563",
                            fontWeight: joistSpacing === spacing ? "600" : "400",
                            cursor: "pointer",
                            fontSize: "0.875rem"
                          }}
                        >
                          {spacing}&quot; OC
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      16&quot; OC is standard for residential floors
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={includeRimJoists}
                        onChange={(e) => setIncludeRimJoists(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.875rem", color: "#374151" }}>Include Rim Joists (2 boards)</span>
                    </label>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", border: "2px solid #BBF7D0" }}>
                  <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📊 Results
                  </h3>

                  <div style={{
                    backgroundColor: "#DCFCE7",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #22C55E"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#166534", marginBottom: "8px" }}>Total Boards Needed</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#16A34A", margin: 0 }}>
                      {totalBoards}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Floor Joists</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{joistCount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Rim Joists</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{rimJoistCount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Joist Length Each</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{floorWidth} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Total Linear Feet</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{totalLinearFeet.toFixed(0)} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Floor Area</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{floorArea} sq ft</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>Tip:</strong> Add 10% extra for waste and cuts. Use the Cost Estimator tab for pricing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Span Calculator */}
            {activeTab === "span" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📏 Span Requirements
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Required Span (ft)
                    </label>
                    <input
                      type="number"
                      value={requiredSpan}
                      onChange={(e) => setRequiredSpan(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="1"
                      max="25"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Distance between supporting walls or beams
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Joist Spacing
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                      {[12, 16, 24].map((spacing) => (
                        <button
                          key={spacing}
                          onClick={() => setSpanSpacing(spacing)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: spanSpacing === spacing ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: spanSpacing === spacing ? "#EFF6FF" : "white",
                            color: spanSpacing === spacing ? "#1E40AF" : "#4B5563",
                            fontWeight: spanSpacing === spacing ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {spacing}&quot; OC
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Wood Species
                    </label>
                    <select
                      value={woodSpecies}
                      onChange={(e) => setWoodSpecies(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="Douglas Fir-Larch">Douglas Fir-Larch</option>
                      <option value="Southern Pine">Southern Pine</option>
                      <option value="Hem-Fir">Hem-Fir</option>
                      <option value="Spruce-Pine-Fir">Spruce-Pine-Fir (SPF)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Lumber Grade
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["#1", "#2"].map((grade) => (
                        <button
                          key={grade}
                          onClick={() => setLumberGrade(grade)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: lumberGrade === grade ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: lumberGrade === grade ? "#EFF6FF" : "white",
                            color: lumberGrade === grade ? "#1E40AF" : "#4B5563",
                            fontWeight: lumberGrade === grade ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {grade} Grade
                        </button>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      #2 is most common for residential construction
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "24px", borderRadius: "12px", border: "2px solid #BFDBFE" }}>
                  <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "20px", fontSize: "1.1rem" }}>
                    ✅ Recommended Size
                  </h3>

                  <div style={{
                    backgroundColor: "#DBEAFE",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #3B82F6"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#1E40AF", marginBottom: "8px" }}>Use This Joist Size</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>
                      {recommendedSize}
                    </p>
                  </div>

                  <h4 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px", fontSize: "0.9rem" }}>
                    All Options at {spanSpacing}&quot; OC:
                  </h4>

                  <div style={{ display: "grid", gap: "8px" }}>
                    {spanResults.map((result) => (
                      <div
                        key={result.size}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          backgroundColor: result.meetsRequirement ? "#DCFCE7" : "#FEE2E2",
                          borderRadius: "8px",
                          border: result.size === recommendedSize ? "2px solid #22C55E" : "none"
                        }}
                      >
                        <span style={{ fontWeight: "600", color: "#111827" }}>{result.size}</span>
                        <span style={{ color: "#6B7280" }}>Max: {result.maxSpan}</span>
                        <span style={{ fontSize: "1.2rem" }}>
                          {result.meetsRequirement ? "✅" : "❌"}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      📋 Based on {woodSpecies} {lumberGrade}, 40 psf live load, 10 psf dead load, L/360 deflection limit.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Cost Estimator */}
            {activeTab === "cost" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    💵 Cost Inputs
                  </h3>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Number of Joists
                    </label>
                    <input
                      type="number"
                      value={costJoistCount}
                      onChange={(e) => setCostJoistCount(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="1"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Auto-filled from Joist Count tab, or enter manually
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Joist Size
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                      {["2x6", "2x8", "2x10", "2x12"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setCostJoistSize(size)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: costJoistSize === size ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: costJoistSize === size ? "#EFF6FF" : "white",
                            color: costJoistSize === size ? "#1E40AF" : "#4B5563",
                            fontWeight: costJoistSize === size ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Board Length (ft)
                    </label>
                    <input
                      type="number"
                      value={costJoistLength}
                      onChange={(e) => setCostJoistLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="8"
                      max="20"
                      step="2"
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Price per Board ($)
                    </label>
                    <input
                      type="number"
                      value={pricePerBoard}
                      onChange={(e) => setPricePerBoard(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      step="0.50"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "8px" }}>
                      Auto-estimated based on size and length. Adjust for your local prices.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Wastage (%)
                    </label>
                    <input
                      type="number"
                      value={wastagePercent}
                      onChange={(e) => setWastagePercent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0"
                      max="30"
                    />
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px", border: "2px solid #FDE68A" }}>
                  <h3 style={{ fontWeight: "600", color: "#92400E", marginBottom: "20px", fontSize: "1.1rem" }}>
                    💰 Cost Estimate
                  </h3>

                  <div style={{
                    backgroundColor: "#FDE68A",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #F59E0B"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#92400E", marginBottom: "8px" }}>Total Material Cost</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#B45309", margin: 0 }}>
                      ${totalCost.toFixed(2)}
                    </p>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Boards (with {wastagePercent}% waste)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{boardsNeeded}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Price per Board</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${parseFloat(pricePerBoard).toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Cost per Sq Ft</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${costPerSqFt.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>
                      ⚠️ <strong>Note:</strong> Prices are estimates. Check local lumber yards for current pricing. Does not include hardware, hangers, or labor.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
            📋 Floor Joist Span Table (Quick Reference)
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Maximum spans for Douglas Fir-Larch #2, 40 psf live load, 10 psf dead load, L/360 deflection
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Joist Size</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>12&quot; OC</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", backgroundColor: "#DBEAFE" }}>16&quot; OC ⭐</th>
                  <th style={{ padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>24&quot; OC</th>
                </tr>
              </thead>
              <tbody>
                {quickReferenceData.map((row, index) => (
                  <tr key={row.size} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.size}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.oc12}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#EFF6FF", fontWeight: "600" }}>{row.oc16}</td>
                    <td style={{ padding: "12px 16px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.oc24}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "16px" }}>
            ⭐ 16&quot; on-center is the most common spacing for residential floor systems.
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
                How to Calculate Floor Joists
              </h2>

              <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>📐 Joist Count Formula</h3>
                <code style={{ 
                  display: "block", 
                  backgroundColor: "#1E3A8A", 
                  color: "#93C5FD", 
                  padding: "16px", 
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Number of Joists = (Floor Length × 12 ÷ Spacing) + 1
                </code>
                <p style={{ color: "#1E3A8A", fontSize: "0.9rem", marginTop: "12px", marginBottom: "0" }}>
                  <strong>Example:</strong> 20 ft floor with 16&quot; spacing = (20 × 12 ÷ 16) + 1 = 16 joists
                </p>
              </div>

              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Step-by-Step Process:</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { step: "1", title: "Measure Floor Dimensions", desc: "Length (parallel to joists) and width (span direction)" },
                  { step: "2", title: "Choose Joist Spacing", desc: "16\" OC is standard for residential (also 12\", 19.2\", 24\")" },
                  { step: "3", title: "Calculate Joist Count", desc: "Use the formula above or our calculator" },
                  { step: "4", title: "Determine Joist Size", desc: "Based on span distance - use our Span Calculator tab" },
                  { step: "5", title: "Add Rim Joists", desc: "Typically 2 boards running perpendicular at each end" },
                  { step: "6", title: "Add Wastage", desc: "Add 10% extra for cuts and defects" }
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#2563EB",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      flexShrink: 0
                    }}>
                      {item.step}
                    </div>
                    <div>
                      <strong style={{ color: "#111827" }}>{item.title}</strong>
                      <p style={{ color: "#6B7280", fontSize: "0.875rem", margin: "4px 0 0 0" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Joist Sizes */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                🪵 Common Floor Joist Sizes
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { size: "2x6", actual: "1.5\" × 5.5\"", use: "Light duty, short spans (under 8 ft)", color: "#DCFCE7" },
                  { size: "2x8", actual: "1.5\" × 7.25\"", use: "Standard residential, spans up to 10-12 ft", color: "#DBEAFE" },
                  { size: "2x10", actual: "1.5\" × 9.25\"", use: "Most common choice, spans up to 12-14 ft", color: "#FEF3C7" },
                  { size: "2x12", actual: "1.5\" × 11.25\"", use: "Heavy loads, long spans up to 16+ ft", color: "#FEE2E2" }
                ].map((item) => (
                  <div key={item.size} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", backgroundColor: item.color, borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", minWidth: "60px" }}>{item.size}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: "500", color: "#374151" }}>Actual: {item.actual}</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#6B7280" }}>{item.use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Spacing Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📐 Joist Spacing Guide
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "12px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#166534", marginBottom: "4px" }}>12&quot; OC</p>
                  <p style={{ fontSize: "0.8rem", color: "#166534", margin: 0 }}>Heavy loads, longer spans</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "8px", border: "2px solid #3B82F6" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "4px" }}>16&quot; OC ⭐ Standard</p>
                  <p style={{ fontSize: "0.8rem", color: "#1E40AF", margin: 0 }}>Most residential floors</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "4px" }}>19.2&quot; OC</p>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>Optimized for 8&apos; sheets</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "#FEE2E2", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", color: "#991B1B", marginBottom: "4px" }}>24&quot; OC</p>
                  <p style={{ fontSize: "0.8rem", color: "#991B1B", margin: 0 }}>Light loads, engineered joists</p>
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
                <li style={{ marginBottom: "8px" }}>Always check local building codes</li>
                <li style={{ marginBottom: "8px" }}>Crown joists facing up</li>
                <li style={{ marginBottom: "8px" }}>Use joist hangers for connections</li>
                <li style={{ marginBottom: "8px" }}>Add blocking every 8&apos; for stability</li>
                <li>Consider I-joists for long spans</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools 
              currentUrl="/floor-joist-calculator" 
              currentCategory="Construction" 
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. Actual requirements may vary based on local building codes, specific load conditions, and lumber quality. Always consult a structural engineer or local building department for final specifications.
          </p>
        </div>
      </div>
    </div>
  );
}