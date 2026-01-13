"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Material data
const materials = [
  { id: "cellulose", name: "Cellulose", rPerInch: 3.7, bagWeight: 25, bagCoverage: 27, costPerSqFt: 0.90, proCostPerSqFt: 1.65, description: "Eco-friendly, made from recycled paper" },
  { id: "fiberglass", name: "Fiberglass (Loose-Fill)", rPerInch: 2.5, bagWeight: 28.6, bagCoverage: 18, costPerSqFt: 0.70, proCostPerSqFt: 1.30, description: "Cost-effective, moisture resistant" },
  { id: "fiberglass-hd", name: "Fiberglass (High-Density)", rPerInch: 2.8, bagWeight: 28.6, bagCoverage: 16, costPerSqFt: 0.85, proCostPerSqFt: 1.50, description: "Better coverage, less settling" }
];

// R-value options
const rValueOptions = [
  { value: 13, label: "R-13 (Walls - Minimum)", location: "wall" },
  { value: 19, label: "R-19 (Walls - Standard)", location: "wall" },
  { value: 30, label: "R-30 (Attic - Zone 1-2)", location: "attic" },
  { value: 38, label: "R-38 (Attic - Zone 2-3)", location: "attic" },
  { value: 49, label: "R-49 (Attic - Zone 4-7)", location: "attic" },
  { value: 60, label: "R-60 (Attic - Cold Climates)", location: "attic" }
];

// Climate zone data
const climateZones = [
  { zone: "1", states: "Hawaii, Guam, Puerto Rico", attic: "R-30 to R-49", wall: "R-13", floor: "R-13" },
  { zone: "2", states: "Southern FL, TX, AZ", attic: "R-38 to R-60", wall: "R-13 to R-15", floor: "R-13" },
  { zone: "3", states: "Southern CA, NV, LA, MS, AL, GA", attic: "R-38 to R-60", wall: "R-13 to R-15", floor: "R-19" },
  { zone: "4", states: "Central CA, TN, NC, VA, MD, DE", attic: "R-49 to R-60", wall: "R-13 to R-21", floor: "R-19 to R-25" },
  { zone: "5", states: "NV, UT, CO, KS, MO, IL, IN, OH, PA, NJ, NY", attic: "R-49 to R-60", wall: "R-13 to R-21", floor: "R-25 to R-30" },
  { zone: "6", states: "WA, OR, ID, MT, WY, ND, SD, MN, WI, MI, VT, NH, ME", attic: "R-49 to R-60", wall: "R-13 to R-21", floor: "R-25 to R-30" },
  { zone: "7", states: "Northern MN, WI, ME, AK", attic: "R-49 to R-60", wall: "R-13 to R-21", floor: "R-25 to R-30" }
];

// Depth chart data (R-value to depth in inches)
const depthChart = [
  { rValue: "R-13", cellulose: "3.5", fiberglass: "5.2", fiberglassHD: "4.6" },
  { rValue: "R-19", cellulose: "5.1", fiberglass: "7.6", fiberglassHD: "6.8" },
  { rValue: "R-30", cellulose: "8.1", fiberglass: "12.0", fiberglassHD: "10.7" },
  { rValue: "R-38", cellulose: "10.3", fiberglass: "15.2", fiberglassHD: "13.6" },
  { rValue: "R-49", cellulose: "13.2", fiberglass: "19.6", fiberglassHD: "17.5" },
  { rValue: "R-60", cellulose: "16.2", fiberglass: "24.0", fiberglassHD: "21.4" }
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much blown insulation I need?",
    answer: "To calculate blown insulation needs: 1) Measure the area in square feet (length × width), 2) Determine your target R-value based on climate zone and location (attic, wall, floor), 3) Divide target R-value by the material's R-value per inch to get required depth, 4) Calculate cubic feet needed (area × depth ÷ 12), then divide by coverage per bag. Our calculator automates this process for you."
  },
  {
    question: "How many bags of blow-in insulation for 1000 square feet?",
    answer: "For 1,000 sq ft at R-38 (common attic target): Cellulose requires about 37-40 bags (25 lb bags), while fiberglass needs approximately 55-60 bags. At R-30, you'll need roughly 30-33 bags of cellulose or 45-50 bags of fiberglass. The exact number depends on your target R-value and whether you have existing insulation."
  },
  {
    question: "How many inches of blown insulation is R30?",
    answer: "To achieve R-30: Cellulose blown insulation requires approximately 8-8.5 inches of depth (R-3.7 per inch). Fiberglass loose-fill needs about 11-12 inches (R-2.5 per inch). High-density fiberglass requires roughly 10-11 inches (R-2.8 per inch). Always verify with manufacturer specifications as R-values can vary slightly by brand."
  },
  {
    question: "How much insulation for a 2000 sq ft house?",
    answer: "For a 2,000 sq ft attic at R-49: Cellulose requires about 75-80 bags (25 lb), costing $1,200-$1,800 DIY or $2,800-$3,600 professionally installed. Fiberglass needs 100-110 bags, costing $1,000-$1,600 DIY or $2,200-$3,000 installed. Wall insulation adds additional cost depending on wall cavity access."
  },
  {
    question: "Is cellulose or fiberglass better for blown-in insulation?",
    answer: "Both have advantages: Cellulose offers higher R-value per inch (3.7 vs 2.5), better air sealing, and is eco-friendly (recycled paper). It's ideal for attics and retrofit projects. Fiberglass is moisture-resistant, non-flammable, doesn't settle as much, and works better in humid climates. Fiberglass costs less upfront but requires more depth for the same R-value."
  },
  {
    question: "Can I add blown insulation over existing insulation?",
    answer: "Yes, blown insulation can be added over existing insulation if it's dry and in good condition. R-values are cumulative—if you have R-19 and add R-30, you'll achieve approximately R-49. Before adding, check for moisture damage, pest infestation, or compressed/damaged insulation. Remove any vapor barriers from the new layer to prevent moisture trapping."
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

export default function BlowInInsulationCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"area" | "budget" | "chart">("area");
  
  // By Area state
  const [sqft, setSqft] = useState<string>("1000");
  const [material, setMaterial] = useState<string>("cellulose");
  const [targetR, setTargetR] = useState<number>(38);
  const [existingR, setExistingR] = useState<string>("0");
  const [installType, setInstallType] = useState<string>("diy");
  
  // By Budget state
  const [budget, setBudget] = useState<string>("1500");
  const [budgetMaterial, setBudgetMaterial] = useState<string>("cellulose");
  const [budgetTargetR, setBudgetTargetR] = useState<number>(38);
  const [budgetInstallType, setBudgetInstallType] = useState<string>("diy");

  // By Area calculations
  const sqftNum = parseFloat(sqft) || 0;
  const existingRNum = parseFloat(existingR) || 0;
  const materialData = materials.find(m => m.id === material) || materials[0];
  const neededR = Math.max(0, targetR - existingRNum);
  const depthNeeded = neededR / materialData.rPerInch;
  const cubicFeet = (sqftNum * depthNeeded) / 12;
  const bagsNeeded = Math.ceil(sqftNum / materialData.bagCoverage * (neededR / 30)); // Adjusted for R-value
  const materialCost = sqftNum * materialData.costPerSqFt * (neededR / 38);
  const proCost = sqftNum * materialData.proCostPerSqFt * (neededR / 38);
  const totalCost = installType === "diy" ? materialCost : proCost;
  const machineRental = bagsNeeded >= 10 ? 0 : 75; // Free rental with 10+ bags at most stores
  const diyCostWithRental = materialCost + machineRental;

  // By Budget calculations
  const budgetNum = parseFloat(budget) || 0;
  const budgetMaterialData = materials.find(m => m.id === budgetMaterial) || materials[0];
  const costPerSqFt = budgetInstallType === "diy" ? budgetMaterialData.costPerSqFt : budgetMaterialData.proCostPerSqFt;
  const adjustedCostPerSqFt = costPerSqFt * (budgetTargetR / 38);
  const estimatedSqft = adjustedCostPerSqFt > 0 ? budgetNum / adjustedCostPerSqFt : 0;
  const estimatedBags = Math.ceil(estimatedSqft / budgetMaterialData.bagCoverage * (budgetTargetR / 30));
  const budgetDepth = budgetTargetR / budgetMaterialData.rPerInch;

  const tabs = [
    { id: "area", label: "By Area", icon: "📐" },
    { id: "budget", label: "By Budget", icon: "💰" },
    { id: "chart", label: "R-Value Chart", icon: "📋" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Blow In Insulation Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Blow In Insulation Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator to estimate blown-in insulation needs. Calculate bags, depth, and cost for cellulose 
            or fiberglass insulation based on your area and target R-value.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#DBEAFE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Quick Reference (per 1,000 sq ft at R-38)</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                <strong>Cellulose:</strong> ~37 bags, 10.3&quot; depth, $700-$900 DIY | <strong>Fiberglass:</strong> ~55 bags, 15.2&quot; depth, $550-$750 DIY
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
                backgroundColor: activeTab === tab.id ? "#2563EB" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "area" && "📐 Project Details"}
                {activeTab === "budget" && "💰 Your Budget"}
                {activeTab === "chart" && "📋 R-Value Reference"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "area" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Area to Insulate (sq ft)
                    </label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(e.target.value)}
                      placeholder="e.g., 1000"
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
                      Insulation Material
                    </label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      {materialData.description} • R-{materialData.rPerInch}/inch
                    </p>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Target R-Value
                    </label>
                    <select
                      value={targetR}
                      onChange={(e) => setTargetR(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {rValueOptions.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Existing Insulation R-Value (if any)
                    </label>
                    <input
                      type="number"
                      value={existingR}
                      onChange={(e) => setExistingR(e.target.value)}
                      placeholder="0"
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      R-values are cumulative. Enter 0 if starting fresh.
                    </p>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Installation Type
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="installType"
                          value="diy"
                          checked={installType === "diy"}
                          onChange={(e) => setInstallType(e.target.value)}
                        />
                        <span style={{ fontSize: "0.9rem" }}>DIY</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="installType"
                          value="pro"
                          checked={installType === "pro"}
                          onChange={(e) => setInstallType(e.target.value)}
                        />
                        <span style={{ fontSize: "0.9rem" }}>Professional</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Your Budget
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
                      Insulation Material
                    </label>
                    <select
                      value={budgetMaterial}
                      onChange={(e) => setBudgetMaterial(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Target R-Value
                    </label>
                    <select
                      value={budgetTargetR}
                      onChange={(e) => setBudgetTargetR(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {rValueOptions.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Installation Type
                    </label>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="budgetInstallType"
                          value="diy"
                          checked={budgetInstallType === "diy"}
                          onChange={(e) => setBudgetInstallType(e.target.value)}
                        />
                        <span style={{ fontSize: "0.9rem" }}>DIY</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name="budgetInstallType"
                          value="pro"
                          checked={budgetInstallType === "pro"}
                          onChange={(e) => setBudgetInstallType(e.target.value)}
                        />
                        <span style={{ fontSize: "0.9rem" }}>Professional</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Tip:</strong> DIY installation with free machine rental (10+ bags) can save 40-50% vs professional installation.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "chart" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#374151" }}>Depth Required by R-Value</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#EFF6FF" }}>
                            <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "left" }}>R-Value</th>
                            <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cellulose</th>
                            <th style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Fiberglass</th>
                          </tr>
                        </thead>
                        <tbody>
                          {depthChart.map((row, idx) => (
                            <tr key={row.rValue} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                              <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.rValue}</td>
                              <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.cellulose}&quot;</td>
                              <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.fiberglass}&quot;</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      <strong>R-Value per Inch:</strong> Cellulose = R-3.7 | Fiberglass = R-2.5 | High-Density Fiberglass = R-2.8
                    </p>
                  </div>
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
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "chart" ? "📍 Climate Zone Guide" : "📊 Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "area" && (
                <>
                  {/* Bags Needed */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Bags Needed</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {bagsNeeded.toLocaleString()}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      {materialData.bagWeight} lb bags of {materialData.name}
                    </p>
                  </div>

                  {/* Details */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Project Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Area:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{sqftNum.toLocaleString()} sq ft</div>
                      <div style={{ color: "#6B7280" }}>Required Depth:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{depthNeeded.toFixed(1)} inches</div>
                      <div style={{ color: "#6B7280" }}>R-Value Needed:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>R-{neededR} {existingRNum > 0 ? `(+R-${existingRNum} existing)` : ""}</div>
                      <div style={{ color: "#6B7280" }}>Material:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{materialData.name}</div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1E40AF", fontSize: "0.9rem" }}>💰 Estimated Cost</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#3B82F6" }}>Material Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "600", color: "#1D4ED8" }}>${materialCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                      {installType === "diy" && (
                        <>
                          <div style={{ color: "#3B82F6" }}>Machine Rental:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>{machineRental === 0 ? "FREE (10+ bags)" : `$${machineRental}`}</div>
                        </>
                      )}
                      {installType === "pro" && (
                        <>
                          <div style={{ color: "#3B82F6" }}>Labor Included:</div>
                          <div style={{ textAlign: "right", fontWeight: "500" }}>Yes</div>
                        </>
                      )}
                      <div style={{ borderTop: "1px solid #BFDBFE", paddingTop: "8px", color: "#1E40AF", fontWeight: "600" }}>Total ({installType === "diy" ? "DIY" : "Pro"}):</div>
                      <div style={{ borderTop: "1px solid #BFDBFE", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#059669", fontSize: "1.1rem" }}>
                        ${(installType === "diy" ? diyCostWithRental : proCost).toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </div>
                    </div>
                  </div>

                  {/* Pro Tip */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> Home Depot & Lowe&apos;s offer free 24-hour machine rental with purchase of 10+ bags.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "budget" && (
                <>
                  {/* Estimated Coverage */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>You Can Insulate</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {estimatedSqft.toLocaleString(undefined, {maximumFractionDigits: 0})} sq ft
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      at R-{budgetTargetR} with {budgetMaterialData.name}
                    </p>
                  </div>

                  {/* Details */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 What You Get</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Budget:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${budgetNum.toLocaleString()}</div>
                      <div style={{ color: "#6B7280" }}>Bags (~):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{estimatedBags} bags</div>
                      <div style={{ color: "#6B7280" }}>Insulation Depth:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{budgetDepth.toFixed(1)} inches</div>
                      <div style={{ color: "#6B7280" }}>Installation:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{budgetInstallType === "diy" ? "DIY" : "Professional"}</div>
                    </div>
                  </div>

                  {/* Common Spaces */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1E40AF", fontSize: "0.85rem" }}>🏠 For Reference</h4>
                    <div style={{ fontSize: "0.8rem", color: "#3B82F6", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>• Small attic: 500-800 sq ft</p>
                      <p style={{ margin: 0 }}>• Average attic: 1,000-1,500 sq ft</p>
                      <p style={{ margin: 0 }}>• Large attic: 1,500-2,500 sq ft</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "chart" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#4B5563", margin: "0 0 16px 0" }}>
                      Find your climate zone and recommended R-values based on DOE guidelines:
                    </p>
                    <div style={{ maxHeight: "350px", overflowY: "auto" }}>
                      {climateZones.map((zone, idx) => (
                        <div key={zone.zone} style={{
                          backgroundColor: idx % 2 === 0 ? "#F9FAFB" : "white",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          border: "1px solid #E5E7EB"
                        }}>
                          <div style={{ fontWeight: "600", color: "#059669", marginBottom: "4px" }}>Zone {zone.zone}</div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "8px" }}>{zone.states}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "0.8rem" }}>
                            <div>
                              <span style={{ color: "#6B7280" }}>Attic:</span>
                              <div style={{ fontWeight: "500", color: "#111827" }}>{zone.attic}</div>
                            </div>
                            <div>
                              <span style={{ color: "#6B7280" }}>Wall:</span>
                              <div style={{ fontWeight: "500", color: "#111827" }}>{zone.wall}</div>
                            </div>
                            <div>
                              <span style={{ color: "#6B7280" }}>Floor:</span>
                              <div style={{ fontWeight: "500", color: "#111827" }}>{zone.floor}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      💡 Higher R-values = better insulation. Attics need the highest R-values because heat rises.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Material Comparison Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Cellulose vs Fiberglass Comparison</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Feature</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cellulose</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Fiberglass</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>R-Value per Inch</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>R-3.7 ✓</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>R-2.5</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Cost (DIY per sq ft)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$0.60-$1.20</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>$0.40-$1.00 ✓</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Eco-Friendly</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>85% recycled ✓</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>20-30% recycled</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Fire Resistance</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Treated (Class 1)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Naturally non-flammable ✓</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Moisture Resistance</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Can absorb moisture</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Moisture resistant ✓</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Air Sealing</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Excellent ✓</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Good</td>
                </tr>
                <tr>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Settling Over Time</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>May settle 15-20%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Minimal settling ✓</td>
                </tr>
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Both materials are effective insulators. Cellulose is better for air sealing and eco-friendliness; fiberglass is better for humid climates and longevity.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 What is Blow-In Insulation?</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Blow-in insulation</strong> (also called loose-fill insulation) is a type of thermal insulation 
                  that&apos;s installed using a blowing machine. Small particles of cellulose, fiberglass, or mineral wool 
                  are blown into attics, walls, and other spaces to create an effective thermal barrier.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Choose Blown-In Insulation?</h3>
                <p>
                  <strong>Better coverage:</strong> Blown insulation fills gaps, cracks, and irregular spaces that batt 
                  insulation can&apos;t reach. <strong>Easy installation:</strong> DIY-friendly with free machine rental at 
                  most home improvement stores. <strong>Cost-effective:</strong> Lower material cost per R-value compared 
                  to spray foam. <strong>Flexible:</strong> Can be added over existing insulation to boost R-value.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>DIY vs Professional Installation</h3>
                <p>
                  <strong>DIY installation</strong> can save 40-50% on costs. Most homeowners can insulate an attic in 
                  4-8 hours with a helper. Home Depot and Lowe&apos;s offer free 24-hour machine rental with purchase of 
                  10+ bags. <strong>Professional installation</strong> is recommended for wall cavities, hard-to-reach 
                  areas, or if you prefer guaranteed results with warranty coverage.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📐 Quick Depth Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>R-30 → 8&quot; cellulose / 12&quot; fiberglass</p>
                <p style={{ margin: 0 }}>R-38 → 10&quot; cellulose / 15&quot; fiberglass</p>
                <p style={{ margin: 0 }}>R-49 → 13&quot; cellulose / 20&quot; fiberglass</p>
                <p style={{ margin: 0 }}>R-60 → 16&quot; cellulose / 24&quot; fiberglass</p>
              </div>
            </div>

            {/* Cost Savings */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💰 Save on Energy Bills</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>Proper attic insulation can reduce heating/cooling costs by <strong>15-25%</strong> annually.</p>
                <p style={{ margin: 0 }}>Average savings: <strong>$200-$600/year</strong> depending on climate and home size.</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/blow-in-insulation-calculator" currentCategory="Construction" />
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
            Actual material needs may vary based on installation technique, settling, and specific product specifications. 
            Always check manufacturer coverage charts and local building codes before purchasing materials.
          </p>
        </div>
      </div>
    </div>
  );
}