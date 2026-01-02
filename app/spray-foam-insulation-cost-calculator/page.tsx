"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Recommended thickness by application (inches)
const recommendedThickness: Record<string, { openCell: number; closedCell: number }> = {
  "Walls": { openCell: 3.5, closedCell: 2 },
  "Attic": { openCell: 8, closedCell: 3.5 },
  "Roof/Ceiling": { openCell: 5.5, closedCell: 2.5 },
  "Crawl Space": { openCell: 3, closedCell: 2 },
  "Basement": { openCell: 3, closedCell: 2 },
  "Metal Building": { openCell: 3, closedCell: 1.5 },
};

// Price per board foot
const prices = {
  openCell: { low: 0.40, high: 0.75, avg: 0.58 },
  closedCell: { low: 1.00, high: 2.00, avg: 1.50 },
};

// R-value per inch
const rValuePerInch = {
  openCell: 3.7,
  closedCell: 6.5,
};

// Labor multiplier (installed cost vs material only)
const laborMultiplier = 1.8;

// Common project presets
const projectPresets = [
  { name: "1,500 sq ft Attic", area: 1500, type: "Attic" },
  { name: "40x60 Garage/Shop", area: 2400, type: "Metal Building" },
  { name: "30x50 Shop/Barn", area: 1500, type: "Metal Building" },
  { name: "2,000 sq ft House Walls", area: 2000, type: "Walls" },
  { name: "1,000 sq ft Basement", area: 1000, type: "Basement" },
  { name: "500 sq ft Crawl Space", area: 500, type: "Crawl Space" },
];

// FAQ data
const faqs = [
  {
    question: "How much does it cost to spray foam 1,500 square feet?",
    answer: "For 1,500 sq ft (such as an attic), spray foam insulation costs approximately $2,500-$4,500 for open-cell foam or $5,000-$9,000 for closed-cell foam with professional installation. DIY costs are roughly 40-50% less but require proper equipment and safety gear. The exact cost depends on thickness required, accessibility, and your location."
  },
  {
    question: "How much does it cost to spray foam a 40x60 building?",
    answer: "A 40x60 metal building (2,400 sq ft of wall/ceiling area) typically costs $4,000-$7,000 for open-cell or $8,000-$15,000 for closed-cell spray foam insulation. Metal buildings usually need closed-cell foam for moisture barrier properties. The total depends on whether you're insulating walls only or walls plus ceiling."
  },
  {
    question: "How much does it cost to spray foam a 30x50 shop?",
    answer: "A 30x50 shop (1,500 sq ft) costs approximately $2,500-$4,500 for open-cell or $5,000-$9,000 for closed-cell spray foam. For workshops, closed-cell is often recommended because it provides better moisture resistance and adds structural rigidity to metal buildings."
  },
  {
    question: "How many square feet does a 55 gallon drum of spray foam cover?",
    answer: "A 55-gallon drum of spray foam (one component of a two-part system) typically covers 2,000-3,000 board feet when paired with its counterpart. At 1-inch thickness, this equals 2,000-3,000 sq ft. At 3-inch thickness (common for walls), it covers approximately 670-1,000 sq ft. Coverage varies by foam density and application technique."
  },
  {
    question: "Is spray foam insulation worth the cost?",
    answer: "Spray foam typically pays for itself in 5-7 years through energy savings of 30-50% on heating/cooling costs. It also provides air sealing (reducing drafts), moisture barrier (closed-cell), noise reduction, and can increase home value. It's especially worth it in extreme climates, older homes with air leaks, or when you plan to stay long-term."
  },
  {
    question: "What is the difference between open-cell and closed-cell spray foam?",
    answer: "Open-cell foam ($0.40-$0.75/board ft) is lighter, more flexible, provides soundproofing, and has R-3.7 per inch. Closed-cell foam ($1.00-$2.00/board ft) is denser, acts as a moisture/vapor barrier, adds structural strength, and has R-6.5 per inch. Use open-cell for interior walls and soundproofing; use closed-cell for exterior walls, basements, and areas needing moisture protection."
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

export default function SprayFoamCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculator" | "estimator">("calculator");

  // Tab 1: Cost Calculator inputs
  const [area, setArea] = useState<string>("1000");
  const [applicationType, setApplicationType] = useState<string>("Walls");
  const [foamType, setFoamType] = useState<string>("both");
  const [thickness, setThickness] = useState<string>("3.5");
  const [installation, setInstallation] = useState<string>("professional");

  // Tab 1: Results
  const [openCellResults, setOpenCellResults] = useState({ boardFeet: 0, costLow: 0, costHigh: 0, rValue: 0, costPerSqFt: 0 });
  const [closedCellResults, setClosedCellResults] = useState({ boardFeet: 0, costLow: 0, costHigh: 0, rValue: 0, costPerSqFt: 0 });

  // Tab 2: Project Estimator
  const [selectedPreset, setSelectedPreset] = useState<number>(0);

  // Update thickness when application type changes
  useEffect(() => {
    const recommended = recommendedThickness[applicationType];
    if (recommended) {
      if (foamType === "openCell") {
        setThickness(recommended.openCell.toString());
      } else if (foamType === "closedCell") {
        setThickness(recommended.closedCell.toString());
      } else {
        setThickness(recommended.closedCell.toString());
      }
    }
  }, [applicationType, foamType]);

  // Calculate costs
  useEffect(() => {
    const sqFt = parseFloat(area) || 0;
    const thick = parseFloat(thickness) || 0;
    const boardFeet = sqFt * thick;

    const multiplier = installation === "professional" ? laborMultiplier : 1;

    // Open Cell calculations
    const openLow = boardFeet * prices.openCell.low * multiplier;
    const openHigh = boardFeet * prices.openCell.high * multiplier;
    const openRValue = thick * rValuePerInch.openCell;
    const openCostPerSqFt = sqFt > 0 ? ((openLow + openHigh) / 2) / sqFt : 0;

    setOpenCellResults({
      boardFeet,
      costLow: openLow,
      costHigh: openHigh,
      rValue: openRValue,
      costPerSqFt: openCostPerSqFt
    });

    // Closed Cell calculations
    const closedThick = foamType === "both" ? recommendedThickness[applicationType]?.closedCell || thick : thick;
    const closedBoardFeet = sqFt * closedThick;
    const closedLow = closedBoardFeet * prices.closedCell.low * multiplier;
    const closedHigh = closedBoardFeet * prices.closedCell.high * multiplier;
    const closedRValue = closedThick * rValuePerInch.closedCell;
    const closedCostPerSqFt = sqFt > 0 ? ((closedLow + closedHigh) / 2) / sqFt : 0;

    setClosedCellResults({
      boardFeet: closedBoardFeet,
      costLow: closedLow,
      costHigh: closedHigh,
      rValue: closedRValue,
      costPerSqFt: closedCostPerSqFt
    });
  }, [area, thickness, foamType, installation, applicationType]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const tabs = [
    { id: "calculator" as const, label: "Cost Calculator", icon: "💰" },
    { id: "estimator" as const, label: "Project Estimator", icon: "🏠" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Spray Foam Insulation Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Spray Foam Insulation Cost Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the cost of spray foam insulation for your project. Compare open-cell vs closed-cell foam and get instant estimates for walls, attics, and more.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FDE68A"
        }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>
            💡 Quick Answer: How much does spray foam insulation cost?
          </h2>
          <p style={{ color: "#92400E", margin: 0 }}>
            <strong>Open-Cell:</strong> $1.00-$1.50/sq ft installed | <strong>Closed-Cell:</strong> $1.50-$3.00/sq ft installed<br />
            For a 1,500 sq ft attic: <strong>$2,500-$9,000</strong> depending on foam type.
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
                  borderBottom: activeTab === tab.id ? "3px solid #F59E0B" : "3px solid transparent",
                  backgroundColor: activeTab === tab.id ? "white" : "transparent",
                  cursor: "pointer",
                  fontWeight: activeTab === tab.id ? "600" : "400",
                  color: activeTab === tab.id ? "#D97706" : "#6B7280",
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
            {/* Tab 1: Cost Calculator */}
            {activeTab === "calculator" && (
              <div>
                {/* Inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                  {/* Area */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Area to Insulate (sq ft)
                    </label>
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
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

                  {/* Application Type */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Application Type
                    </label>
                    <select
                      value={applicationType}
                      onChange={(e) => setApplicationType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.keys(recommendedThickness).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Thickness */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Thickness (inches)
                    </label>
                    <input
                      type="number"
                      value={thickness}
                      onChange={(e) => setThickness(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}
                      min="0.5"
                      max="12"
                      step="0.5"
                    />
                  </div>

                  {/* Installation Type */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Installation
                    </label>
                    <select
                      value={installation}
                      onChange={(e) => setInstallation(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="professional">Professional Install</option>
                      <option value="diy">DIY (Material Only)</option>
                    </select>
                  </div>
                </div>

                {/* Results - Side by Side Comparison */}
                <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  {/* Open Cell */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "2px solid #A7F3D0"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "1.5rem" }}>🟢</span>
                      <h3 style={{ fontWeight: "600", color: "#065F46", margin: 0, fontSize: "1.1rem" }}>Open-Cell Foam</h3>
                    </div>

                    <div style={{
                      backgroundColor: "#D1FAE5",
                      padding: "16px",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginBottom: "16px"
                    }}>
                      <p style={{ fontSize: "0.75rem", color: "#065F46", marginBottom: "4px" }}>Estimated Cost</p>
                      <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#059669", margin: 0 }}>
                        {formatCurrency(openCellResults.costLow)} - {formatCurrency(openCellResults.costHigh)}
                      </p>
                    </div>

                    <div style={{ display: "grid", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>Board Feet</span>
                        <span style={{ fontWeight: "600" }}>{openCellResults.boardFeet.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>R-Value</span>
                        <span style={{ fontWeight: "600" }}>R-{openCellResults.rValue.toFixed(1)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>Cost per Sq Ft</span>
                        <span style={{ fontWeight: "600" }}>${openCellResults.costPerSqFt.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "#065F46", margin: 0 }}>
                        ✓ Best for: Interior walls, soundproofing<br />
                        ✓ More affordable option<br />
                        ✓ Flexible, expands more
                      </p>
                    </div>
                  </div>

                  {/* Closed Cell */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    padding: "24px",
                    borderRadius: "12px",
                    border: "2px solid #BFDBFE"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "1.5rem" }}>🔵</span>
                      <h3 style={{ fontWeight: "600", color: "#1E40AF", margin: 0, fontSize: "1.1rem" }}>Closed-Cell Foam</h3>
                    </div>

                    <div style={{
                      backgroundColor: "#DBEAFE",
                      padding: "16px",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginBottom: "16px"
                    }}>
                      <p style={{ fontSize: "0.75rem", color: "#1E40AF", marginBottom: "4px" }}>Estimated Cost</p>
                      <p style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>
                        {formatCurrency(closedCellResults.costLow)} - {formatCurrency(closedCellResults.costHigh)}
                      </p>
                    </div>

                    <div style={{ display: "grid", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>Board Feet</span>
                        <span style={{ fontWeight: "600" }}>{closedCellResults.boardFeet.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>R-Value</span>
                        <span style={{ fontWeight: "600" }}>R-{closedCellResults.rValue.toFixed(1)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                        <span style={{ color: "#374151" }}>Cost per Sq Ft</span>
                        <span style={{ fontWeight: "600" }}>${closedCellResults.costPerSqFt.toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.75rem", color: "#1E40AF", margin: 0 }}>
                        ✓ Best for: Exterior, basements, moisture areas<br />
                        ✓ Higher R-value per inch<br />
                        ✓ Vapor barrier, adds strength
                      </p>
                    </div>
                  </div>
                </div>

                {/* Board Feet Explanation */}
                <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    📐 <strong>What is a Board Foot?</strong> 1 board foot = 1 sq ft covered at 1 inch thick. Your project: {parseFloat(area).toLocaleString()} sq ft × {thickness}&quot; = {openCellResults.boardFeet.toLocaleString()} board feet
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Project Estimator */}
            {activeTab === "estimator" && (
              <div>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                  🏠 Quick Estimates for Common Projects
                </h3>

                {/* Preset Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "32px" }}>
                  {projectPresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedPreset(index);
                        setArea(preset.area.toString());
                        setApplicationType(preset.type);
                      }}
                      style={{
                        padding: "16px",
                        borderRadius: "10px",
                        border: selectedPreset === index ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                        backgroundColor: selectedPreset === index ? "#FEF3C7" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <p style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0", fontSize: "0.9rem" }}>{preset.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{preset.area.toLocaleString()} sq ft</p>
                    </button>
                  ))}
                </div>

                {/* Selected Project Estimate */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  padding: "24px",
                  borderRadius: "12px",
                  marginBottom: "24px"
                }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                    📊 Estimate for: {projectPresets[selectedPreset].name}
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Open Cell */}
                    <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#065F46", marginBottom: "8px" }}>🟢 Open-Cell</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669", margin: "0 0 8px 0" }}>
                        {formatCurrency(openCellResults.costLow)} - {formatCurrency(openCellResults.costHigh)}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#065F46", margin: 0 }}>
                        R-{openCellResults.rValue.toFixed(0)} | {thickness}&quot; thick
                      </p>
                    </div>

                    {/* Closed Cell */}
                    <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>🔵 Closed-Cell</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB", margin: "0 0 8px 0" }}>
                        {formatCurrency(closedCellResults.costLow)} - {formatCurrency(closedCellResults.costHigh)}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#1E40AF", margin: 0 }}>
                        R-{closedCellResults.rValue.toFixed(0)} | {recommendedThickness[applicationType]?.closedCell || thickness}&quot; thick
                      </p>
                    </div>
                  </div>
                </div>

                {/* All Projects Quick Reference */}
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F3F4F6" }}>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Project</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Area</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>Open-Cell</th>
                        <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#EFF6FF" }}>Closed-Cell</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectPresets.map((preset, index) => {
                        const thick = recommendedThickness[preset.type];
                        const openBF = preset.area * (thick?.openCell || 3);
                        const closedBF = preset.area * (thick?.closedCell || 2);
                        const openCost = openBF * prices.openCell.avg * laborMultiplier;
                        const closedCost = closedBF * prices.closedCell.avg * laborMultiplier;

                        return (
                          <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                            <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{preset.name}</td>
                            <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{preset.area.toLocaleString()} sq ft</td>
                            <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>
                              {formatCurrency(openCost * 0.7)} - {formatCurrency(openCost * 1.3)}
                            </td>
                            <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>
                              {formatCurrency(closedCost * 0.7)} - {formatCurrency(closedCost * 1.3)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px" }}>
                  * Estimates include professional installation. DIY costs are approximately 40-50% less.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            ⚖️ Open-Cell vs Closed-Cell Spray Foam
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Feature</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>🟢 Open-Cell</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#EFF6FF" }}>🔵 Closed-Cell</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Cost per Board Foot", open: "$0.40 - $0.75", closed: "$1.00 - $2.00" },
                  { feature: "R-Value per Inch", open: "R-3.7", closed: "R-6.5" },
                  { feature: "Density", open: "0.5 lb/cu ft (light)", closed: "2.0 lb/cu ft (dense)" },
                  { feature: "Moisture Barrier", open: "❌ No", closed: "✅ Yes" },
                  { feature: "Air Sealing", open: "✅ Yes", closed: "✅ Yes" },
                  { feature: "Soundproofing", open: "✅ Excellent", closed: "⚠️ Good" },
                  { feature: "Structural Strength", open: "❌ No", closed: "✅ Adds rigidity" },
                  { feature: "Best For", open: "Interior walls, attics", closed: "Exterior, basements, roofs" },
                ].map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.feature}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.open}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                📐 How to Calculate Spray Foam Insulation Cost
              </h2>

              <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#166534", marginBottom: "12px" }}>The Formula</h3>
                <code style={{
                  display: "block",
                  backgroundColor: "#166534",
                  color: "#BBF7D0",
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "monospace"
                }}>
                  Board Feet = Area (sq ft) × Thickness (inches)<br />
                  Material Cost = Board Feet × Price per Board Foot<br />
                  Installed Cost = Material Cost × 1.8 (labor)
                </code>
              </div>

              <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px" }}>Step-by-Step:</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { step: "1", title: "Measure the Area", desc: "Calculate square footage of walls, ceiling, or floor to insulate" },
                  { step: "2", title: "Determine Thickness", desc: "Based on your climate zone and application (walls: 2-3.5\", attic: 6-10\")" },
                  { step: "3", title: "Calculate Board Feet", desc: "Multiply area × thickness to get total board feet needed" },
                  { step: "4", title: "Choose Foam Type", desc: "Open-cell for budget/soundproofing, closed-cell for moisture areas" },
                  { step: "5", title: "Get Total Cost", desc: "Board feet × price per board foot, plus labor if professional install" },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#F59E0B",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
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

            {/* DIY vs Professional */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              border: "1px solid #FDE68A",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>
                🛠️ DIY vs Professional Installation
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#166534", marginBottom: "8px" }}>✅ DIY Pros</h4>
                  <ul style={{ color: "#374151", fontSize: "0.875rem", paddingLeft: "16px", margin: 0 }}>
                    <li>Save 40-50% on labor</li>
                    <li>Small projects feasible</li>
                    <li>Kits available at hardware stores</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#DC2626", marginBottom: "8px" }}>❌ DIY Cons</h4>
                  <ul style={{ color: "#374151", fontSize: "0.875rem", paddingLeft: "16px", margin: 0 }}>
                    <li>Requires safety gear</li>
                    <li>Risk of improper application</li>
                    <li>No warranty coverage</li>
                  </ul>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#92400E", marginTop: "16px", marginBottom: 0 }}>
                💡 <strong>Recommendation:</strong> DIY is suitable for small areas under 200 sq ft. For larger projects, professional installation ensures proper coverage, even thickness, and comes with warranty protection.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* R-Value Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🌡️ R-Value Guide
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#FEE2E2", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#991B1B", marginBottom: "2px", fontSize: "0.9rem" }}>Walls: R-13 to R-21</p>
                  <p style={{ fontSize: "0.75rem", color: "#991B1B", margin: 0 }}>3-4&quot; closed or 4-6&quot; open</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "2px", fontSize: "0.9rem" }}>Attic: R-38 to R-60</p>
                  <p style={{ fontSize: "0.75rem", color: "#92400E", margin: 0 }}>6-10&quot; closed or 10-16&quot; open</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#DBEAFE", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "2px", fontSize: "0.9rem" }}>Basement: R-10 to R-15</p>
                  <p style={{ fontSize: "0.75rem", color: "#1E40AF", margin: 0 }}>2&quot; closed recommended</p>
                </div>
              </div>
            </div>

            {/* Energy Savings */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                💰 Energy Savings
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#065F46", paddingLeft: "16px", margin: 0 }}>
                <li style={{ marginBottom: "6px" }}>30-50% reduction in heating/cooling costs</li>
                <li style={{ marginBottom: "6px" }}>Pays for itself in 5-7 years</li>
                <li style={{ marginBottom: "6px" }}>Reduces HVAC workload</li>
                <li>Qualifies for energy tax credits</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/spray-foam-insulation-cost-calculator"
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
            💡 <strong>Disclaimer:</strong> These are estimates based on national average prices. Actual costs vary by location, contractor, accessibility, and current material prices. Always get multiple quotes from licensed insulation contractors before starting your project.
          </p>
        </div>
      </div>
    </div>
  );
}
