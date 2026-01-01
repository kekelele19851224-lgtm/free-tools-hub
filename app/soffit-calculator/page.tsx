"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Panel types with dimensions
const panelTypes = {
  "Triple 3 (12\" wide)": { width: 12, length: 12, coverage: 12 },
  "Quad 4 (16\" wide)": { width: 16, length: 12, coverage: 16 },
  "Double 5 (10\" wide)": { width: 10, length: 12, coverage: 10 },
};

// Material prices
const materialPrices = {
  "Vinyl": { perSqFt: 2, installPerFt: 8 },
  "Aluminum": { perSqFt: 4.5, installPerFt: 11 },
  "Wood": { perSqFt: 6, installPerFt: 13 },
};

// Panel coverage reference
const panelReference = [
  { type: "Triple 3", width: "12\"", length: "12 ft", coverage: "12 sq ft", use: "Most common" },
  { type: "Quad 4", width: "16\"", length: "12 ft", coverage: "16 sq ft", use: "Wider overhangs" },
  { type: "Double 5", width: "10\"", length: "12 ft", coverage: "10 sq ft", use: "Narrow overhangs" },
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much soffit I need?",
    answer: "To calculate soffit needs: (1) Measure the total length of all eaves where soffit will be installed, (2) Measure the overhang depth from the wall to the fascia, (3) Multiply length × depth to get total square footage, (4) Divide by panel coverage area and add 10% for waste. For example, 100 ft of eaves with 12\" overhang = 100 sq ft of soffit needed."
  },
  {
    question: "How much is it per foot to install a soffit?",
    answer: "Soffit installation costs $6-$16 per linear foot installed, depending on material. Vinyl soffit costs $6-$10/ft installed, aluminum costs $8-$14/ft, and wood costs $10-$16/ft. Material alone costs $1-$8 per square foot. A typical home with 200 linear feet of soffit costs $1,200-$3,200 for professional installation."
  },
  {
    question: "How do I calculate how many soffit vents I need?",
    answer: "Calculate soffit vents using the 1/150 or 1/300 rule: Divide your attic floor area by 150 (no roof vents) or 300 (with roof vents) to get total vent area in square feet. Convert to square inches (×144). Soffit vents should provide 50% of total ventilation. Divide by the net free area of each vent (typically 50 sq in for standard vents) to get the number needed."
  },
  {
    question: "How to figure linear feet for soffit?",
    answer: "Linear feet for soffit equals the total length of all eaves around your home. Measure along each wall where soffit will be installed: front, back, and both sides. For a 40×30 ft house, that's 40+40+30+30 = 140 linear feet. Don't forget to include garage eaves and any architectural features like dormers or bay windows."
  },
  {
    question: "What is the difference between vented and solid soffit?",
    answer: "Vented soffit has perforations or slots that allow air to flow into the attic for ventilation, while solid soffit has no openings. Most homes need a combination: vented panels near the roof edge for airflow and solid panels closer to the wall. A common ratio is 50% vented and 50% solid, though some codes require all vented panels."
  },
  {
    question: "How much J-channel and F-channel do I need?",
    answer: "J-channel runs along the wall where soffit meets siding (equals eaves length). F-channel (or fascia channel) runs along the fascia board (also equals eaves length). For 100 ft of eaves, you need approximately 100 ft of J-channel and 100 ft of F-channel. Add 10% for waste and corners."
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

export default function SoffitCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"panels" | "vents" | "cost">("panels");

  // Tab 1: Panel Calculator
  const [eavesLength, setEavesLength] = useState<string>("100");
  const [overhangDepth, setOverhangDepth] = useState<string>("12");
  const [panelType, setPanelType] = useState<string>("Triple 3 (12\" wide)");
  const [material, setMaterial] = useState<string>("Vinyl");

  // Tab 1: Results
  const [totalArea, setTotalArea] = useState<number>(0);
  const [panelsNeeded, setPanelsNeeded] = useState<number>(0);
  const [panelsWithWaste, setPanelsWithWaste] = useState<number>(0);
  const [jChannel, setJChannel] = useState<number>(0);
  const [fChannel, setFChannel] = useState<number>(0);

  // Tab 2: Vent Calculator
  const [atticArea, setAtticArea] = useState<string>("1500");
  const [hasRoofVents, setHasRoofVents] = useState<string>("yes");
  const [ventType, setVentType] = useState<string>("individual");

  // Tab 2: Results
  const [totalVentArea, setTotalVentArea] = useState<number>(0);
  const [soffitVentArea, setSoffitVentArea] = useState<number>(0);
  const [numVents, setNumVents] = useState<number>(0);

  // Tab 3: Cost Calculator
  const [installation, setInstallation] = useState<string>("professional");

  // Tab 3: Results
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Tab 1: Calculate panels
  useEffect(() => {
    const length = parseFloat(eavesLength) || 0;
    const depth = parseFloat(overhangDepth) || 0;
    const panel = panelTypes[panelType as keyof typeof panelTypes];

    if (length > 0 && depth > 0 && panel) {
      const depthFt = depth / 12;
      const area = length * depthFt;
      const panels = Math.ceil(area / panel.coverage);
      const withWaste = Math.ceil(panels * 1.1);

      setTotalArea(area);
      setPanelsNeeded(panels);
      setPanelsWithWaste(withWaste);
      setJChannel(Math.ceil(length * 1.1));
      setFChannel(Math.ceil(length * 1.1));
    }
  }, [eavesLength, overhangDepth, panelType]);

  // Tab 2: Calculate vents
  useEffect(() => {
    const attic = parseFloat(atticArea) || 0;
    const ratio = hasRoofVents === "yes" ? 300 : 150;

    if (attic > 0) {
      const totalVent = (attic / ratio) * 144; // sq inches
      const soffitVent = totalVent * 0.5;
      const vents = ventType === "individual" 
        ? Math.ceil(soffitVent / 50) // 50 sq in per vent
        : Math.ceil(soffitVent / 9); // continuous vent per linear ft

      setTotalVentArea(totalVent);
      setSoffitVentArea(soffitVent);
      setNumVents(vents);
    }
  }, [atticArea, hasRoofVents, ventType]);

  // Tab 3: Calculate cost
  useEffect(() => {
    const length = parseFloat(eavesLength) || 0;
    const prices = materialPrices[material as keyof typeof materialPrices];

    if (totalArea > 0 && prices) {
      const matCost = totalArea * prices.perSqFt;
      const labCost = installation === "professional" ? length * prices.installPerFt : 0;
      
      setMaterialCost(matCost);
      setLaborCost(labCost);
      setTotalCost(matCost + labCost);
    }
  }, [totalArea, material, installation, eavesLength]);

  const formatNumber = (num: number, decimals: number = 0): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const tabs = [
    { id: "panels" as const, label: "Panel Calculator", icon: "📐" },
    { id: "vents" as const, label: "Vent Calculator", icon: "🌬️" },
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
            <span style={{ color: "#111827" }}>Soffit Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Soffit Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much soffit you need for your project. Get panel counts, ventilation requirements, and cost estimates for vinyl, aluminum, or wood soffit.
          </p>
        </div>

        {/* Quick Reference */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>
            📏 Quick Formula
          </h2>
          <p style={{ color: "#1E40AF", margin: 0 }}>
            <strong>Soffit Area</strong> = Eaves Length (ft) × Overhang Depth (ft)<br />
            <strong>Example:</strong> 100 ft eaves × 1 ft depth = 100 sq ft of soffit needed
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
                  borderBottom: activeTab === tab.id ? "3px solid #3B82F6" : "3px solid transparent",
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
            {/* Tab 1: Panel Calculator */}
            {activeTab === "panels" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📐 Enter Measurements
                  </h3>

                  {/* Eaves Length */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Total Eaves Length (ft)
                    </label>
                    <input
                      type="number"
                      value={eavesLength}
                      onChange={(e) => setEavesLength(e.target.value)}
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
                      Measure all walls where soffit will be installed
                    </p>
                  </div>

                  {/* Overhang Depth */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Overhang Depth (inches)
                    </label>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      {[8, 12, 16, 24].map((d) => (
                        <button
                          key={d}
                          onClick={() => setOverhangDepth(d.toString())}
                          style={{
                            padding: "8px 16px",
                            borderRadius: "8px",
                            border: overhangDepth === d.toString() ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                            backgroundColor: overhangDepth === d.toString() ? "#EFF6FF" : "white",
                            color: overhangDepth === d.toString() ? "#2563EB" : "#6B7280",
                            fontWeight: overhangDepth === d.toString() ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {d}&quot;
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      value={overhangDepth}
                      onChange={(e) => setOverhangDepth(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem"
                      }}
                      min="4"
                      max="48"
                    />
                  </div>

                  {/* Panel Type */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Panel Type
                    </label>
                    <select
                      value={panelType}
                      onChange={(e) => setPanelType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.keys(panelTypes).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Material */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Material
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {Object.keys(materialPrices).map((mat) => (
                        <button
                          key={mat}
                          onClick={() => setMaterial(mat)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: material === mat ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                            backgroundColor: material === mat ? "#EFF6FF" : "white",
                            color: material === mat ? "#2563EB" : "#6B7280",
                            fontWeight: material === mat ? "600" : "400",
                            cursor: "pointer"
                          }}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#EFF6FF", padding: "24px", borderRadius: "12px", border: "2px solid #BFDBFE" }}>
                  <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "20px", fontSize: "1.1rem" }}>
                    📦 Materials Needed
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#DBEAFE",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #3B82F6"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#1E40AF", marginBottom: "8px" }}>Soffit Panels Needed</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>
                      {panelsWithWaste} panels
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#3B82F6", marginTop: "8px" }}>
                      (includes 10% for waste)
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Total Soffit Area</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(totalArea)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Panels (no waste)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{panelsNeeded} panels</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>J-Channel (wall side)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{jChannel} linear ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>F-Channel (fascia side)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{fChannel} linear ft</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                      💡 <strong>Tip:</strong> Most soffits use a mix of vented (50%) and solid (50%) panels for proper attic ventilation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Vent Calculator */}
            {activeTab === "vents" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                {/* Inputs */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "20px", fontSize: "1.1rem" }}>
                    🌬️ Ventilation Requirements
                  </h3>

                  {/* Attic Area */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Attic Floor Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={atticArea}
                      onChange={(e) => setAtticArea(e.target.value)}
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
                      Usually equals your home&apos;s footprint
                    </p>
                  </div>

                  {/* Has Roof Vents */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Do you have roof/ridge vents?
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => setHasRoofVents("yes")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: hasRoofVents === "yes" ? "2px solid #10B981" : "1px solid #E5E7EB",
                          backgroundColor: hasRoofVents === "yes" ? "#D1FAE5" : "white",
                          color: hasRoofVents === "yes" ? "#065F46" : "#6B7280",
                          fontWeight: hasRoofVents === "yes" ? "600" : "400",
                          cursor: "pointer"
                        }}
                      >
                        ✓ Yes (1/300 rule)
                      </button>
                      <button
                        onClick={() => setHasRoofVents("no")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: hasRoofVents === "no" ? "2px solid #F59E0B" : "1px solid #E5E7EB",
                          backgroundColor: hasRoofVents === "no" ? "#FEF3C7" : "white",
                          color: hasRoofVents === "no" ? "#92400E" : "#6B7280",
                          fontWeight: hasRoofVents === "no" ? "600" : "400",
                          cursor: "pointer"
                        }}
                      >
                        ✗ No (1/150 rule)
                      </button>
                    </div>
                  </div>

                  {/* Vent Type */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Vent Type
                    </label>
                    <select
                      value={ventType}
                      onChange={(e) => setVentType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "10px",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      <option value="individual">Individual Vents (4&quot;×16&quot;)</option>
                      <option value="continuous">Continuous Strip Vent</option>
                    </select>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", border: "2px solid #A7F3D0" }}>
                  <h3 style={{ fontWeight: "600", color: "#065F46", marginBottom: "20px", fontSize: "1.1rem" }}>
                    ✅ Ventilation Needed
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#D1FAE5",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #10B981"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#065F46", marginBottom: "8px" }}>
                      {ventType === "individual" ? "Soffit Vents Needed" : "Continuous Vent Length"}
                    </p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#059669", margin: 0 }}>
                      {numVents} {ventType === "individual" ? "vents" : "linear ft"}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Total Vent Area Required</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(totalVentArea)} sq in</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Soffit Vent Area (50%)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(soffitVentArea)} sq in</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Ventilation Rule Used</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>1/{hasRoofVents === "yes" ? "300" : "150"}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#065F46", margin: 0 }}>
                      💡 <strong>Note:</strong> Balanced ventilation means 50% intake (soffit) and 50% exhaust (roof/ridge). Vents should be distributed evenly along all soffits.
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
                    💰 Cost Estimate Settings
                  </h3>

                  {/* Summary from Tab 1 */}
                  <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "8px", marginBottom: "20px" }}>
                    <p style={{ fontSize: "0.875rem", color: "#1E40AF", margin: 0 }}>
                      <strong>From Panel Calculator:</strong><br />
                      {formatNumber(totalArea)} sq ft • {panelsWithWaste} panels • {eavesLength} linear ft
                    </p>
                  </div>

                  {/* Material */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Material
                    </label>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {Object.entries(materialPrices).map(([mat, prices]) => (
                        <button
                          key={mat}
                          onClick={() => setMaterial(mat)}
                          style={{
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: material === mat ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                            backgroundColor: material === mat ? "#EFF6FF" : "white",
                            cursor: "pointer",
                            textAlign: "left",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span style={{ fontWeight: material === mat ? "600" : "400", color: material === mat ? "#2563EB" : "#374151" }}>{mat}</span>
                          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>${prices.perSqFt}/sq ft</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Installation */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Installation
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => setInstallation("diy")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: installation === "diy" ? "2px solid #10B981" : "1px solid #E5E7EB",
                          backgroundColor: installation === "diy" ? "#D1FAE5" : "white",
                          color: installation === "diy" ? "#065F46" : "#6B7280",
                          fontWeight: installation === "diy" ? "600" : "400",
                          cursor: "pointer"
                        }}
                      >
                        🛠️ DIY
                      </button>
                      <button
                        onClick={() => setInstallation("professional")}
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: installation === "professional" ? "2px solid #3B82F6" : "1px solid #E5E7EB",
                          backgroundColor: installation === "professional" ? "#EFF6FF" : "white",
                          color: installation === "professional" ? "#2563EB" : "#6B7280",
                          fontWeight: installation === "professional" ? "600" : "400",
                          cursor: "pointer"
                        }}
                      >
                        👷 Professional
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "24px", borderRadius: "12px", border: "2px solid #FDE68A" }}>
                  <h3 style={{ fontWeight: "600", color: "#92400E", marginBottom: "20px", fontSize: "1.1rem" }}>
                    💵 Estimated Cost
                  </h3>

                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#FDE68A",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    marginBottom: "20px",
                    border: "2px solid #F59E0B"
                  }}>
                    <p style={{ fontSize: "0.875rem", color: "#92400E", marginBottom: "8px" }}>Total Estimated Cost</p>
                    <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#B45309", margin: 0 }}>
                      ${formatNumber(totalCost)}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#92400E", marginTop: "8px" }}>
                      {material} • {installation === "diy" ? "DIY" : "Professionally Installed"}
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Material Cost</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${formatNumber(materialCost)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Labor Cost</span>
                      <span style={{ fontWeight: "600", color: installation === "diy" ? "#10B981" : "#111827" }}>
                        {installation === "diy" ? "$0 (DIY)" : `$${formatNumber(laborCost)}`}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#374151" }}>Cost per Linear Ft</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>
                        ${formatNumber(totalCost / parseFloat(eavesLength || "1"), 2)}/ft
                      </span>
                    </div>
                  </div>

                  {installation === "diy" && (
                    <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#D1FAE5", borderRadius: "8px" }}>
                      <p style={{ fontSize: "0.8rem", color: "#065F46", margin: 0 }}>
                        💰 <strong>DIY Savings:</strong> You save approximately ${formatNumber(parseFloat(eavesLength || "0") * materialPrices[material as keyof typeof materialPrices].installPerFt)} by installing yourself!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📋 Soffit Panel Size Reference
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Panel Type</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Width</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Length</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Coverage</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {panelReference.map((panel, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{panel.type}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{panel.width}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{panel.length}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#2563EB" }}>{panel.coverage}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{panel.use}</td>
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
            {/* How to Measure */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📏 How to Measure for Soffit
              </h2>

              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { step: "1", title: "Measure Eaves Length", desc: "Walk around your home and measure along each wall where soffit will be installed. Add all lengths together." },
                  { step: "2", title: "Measure Overhang Depth", desc: "Measure from the wall to the outer edge of the fascia board. This is typically 8\"-24\" for most homes." },
                  { step: "3", title: "Calculate Total Area", desc: "Multiply total eaves length by overhang depth (in feet). Example: 150 ft × 1 ft = 150 sq ft." },
                  { step: "4", title: "Add 10% for Waste", desc: "Always order extra for cuts, mistakes, and future repairs. Multiply your panels by 1.1." },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "#3B82F6",
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

            {/* Materials Comparison */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🏠 Soffit Materials Comparison
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                {[
                  { name: "Vinyl", price: "$1-$3/sq ft", pros: ["Affordable", "Low maintenance", "Won't rot"], cons: ["Can crack in cold", "Limited colors"], color: "#DBEAFE" },
                  { name: "Aluminum", price: "$3-$6/sq ft", pros: ["Durable", "Fire resistant", "Many colors"], cons: ["Can dent", "More expensive"], color: "#E5E7EB" },
                  { name: "Wood", price: "$4-$8/sq ft", pros: ["Classic look", "Paintable", "Strong"], cons: ["Requires maintenance", "Can rot"], color: "#FEF3C7" },
                ].map((mat) => (
                  <div key={mat.name} style={{ backgroundColor: mat.color, padding: "16px", borderRadius: "8px" }}>
                    <h4 style={{ fontWeight: "600", color: "#111827", marginBottom: "8px" }}>{mat.name}</h4>
                    <p style={{ fontWeight: "600", color: "#2563EB", marginBottom: "8px" }}>{mat.price}</p>
                    <p style={{ fontSize: "0.8rem", color: "#166534", marginBottom: "4px" }}>✓ {mat.pros.join(" • ")}</p>
                    <p style={{ fontSize: "0.8rem", color: "#991B1B", margin: 0 }}>✗ {mat.cons.join(" • ")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Cost Guide */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💰 Installation Cost Guide
              </h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Vinyl Soffit</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>$6-$10/linear ft</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Aluminum Soffit</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>$8-$14/linear ft</p>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <p style={{ fontWeight: "600", color: "#374151", marginBottom: "2px", fontSize: "0.9rem" }}>Wood Soffit</p>
                  <p style={{ fontSize: "1rem", fontWeight: "bold", color: "#2563EB", margin: 0 }}>$10-$16/linear ft</p>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px" }}>
                * Includes material and professional installation
              </p>
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
                <li style={{ marginBottom: "8px" }}>Use vented panels every few feet for airflow</li>
                <li style={{ marginBottom: "8px" }}>Match soffit color to fascia or trim</li>
                <li style={{ marginBottom: "8px" }}>Install during mild weather (40-80°F)</li>
                <li style={{ marginBottom: "8px" }}>Check local codes for vent requirements</li>
                <li>Replace damaged panels promptly</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/soffit-calculator"
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
            📐 <strong>Disclaimer:</strong> These calculations are estimates based on standard panel sizes and typical installation costs. Actual material needs and costs may vary based on your specific roof design, local prices, and contractor rates. Always get multiple quotes and verify measurements before purchasing materials.
          </p>
        </div>
      </div>
    </div>
  );
}