"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Building code standards
const buildingCodes = {
  maxRise: 7.75,
  minRun: 10,
  recommendedRise: 7,
  recommendedRun: 11,
  minWidth: 36,
  comfortMin: 24,
  comfortMax: 25,
  optimalAngleMin: 30,
  optimalAngleMax: 40
};

// Concrete bag yields (cubic feet per bag)
const bagYields = {
  "40": 0.30,
  "60": 0.45,
  "80": 0.60
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate how many concrete steps I need?",
    answer: "Divide your total height by your desired rise height. For example, if the total height is 35 inches and you want 7-inch risers: 35 ÷ 7 = 5 steps. Building codes require a maximum rise of 7.75 inches. For comfort and safety, aim for 7-inch rises and 11-inch runs. Include a landing/platform at the top if entering a doorway."
  },
  {
    question: "How much concrete do I need for steps?",
    answer: "Calculate the volume of each step (step number × rise × run × width) and add them together, plus the platform volume. For 4 steps with 7\" rise, 11\" run, 36\" width, and 24\" platform: approximately 1.4-1.5 cubic yards. Add 10% for waste. One cubic yard of concrete weighs about 4,050 lbs."
  },
  {
    question: "What is the formula for concrete stair volume?",
    answer: "For solid-fill steps: Step Volume = n × Rise × Run × Width, where n is the step number from bottom. Platform Volume = Platform Depth × (Rise × Number of Steps) × Width. Total = Sum of all step volumes + platform volume. Convert cubic inches to cubic yards by dividing by 46,656."
  },
  {
    question: "How tall are 3 step concrete steps?",
    answer: "With standard 7-inch risers, 3 steps would be 21 inches (53.3 cm) tall. With maximum code-allowed 7.75-inch risers, they would be 23.25 inches tall. Most residential steps use 7\" rise for comfort. The total height includes all risers from ground to the top surface of the top step or platform."
  },
  {
    question: "What is the standard rise and run for concrete steps?",
    answer: "The standard residential rise is 7 inches (max 7.75\" per code) and run is 11 inches (min 10\" per code). The comfort formula '2R + T = 24-25 inches' helps verify: 2(7) + 11 = 25 inches ✓. Commercial stairs often use 7\" rise and 11\" run. Outdoor steps may use 6\" rise and 12\" run for easier climbing."
  },
  {
    question: "How much do concrete steps cost?",
    answer: "Concrete steps typically cost $300-$500 per step for professional installation, or $900-$5,000 total for a standard 3-5 step staircase. DIY material costs are much lower: about $150-250 per cubic yard of ready-mix concrete, plus forms and rebar. A 4-step project needs roughly 1.5 cubic yards ($225-375 in materials)."
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

export default function ConcreteStepCalculator() {
  const [activeTab, setActiveTab] = useState<"volume" | "designer" | "cost">("volume");
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  
  // Tab 1: Volume Calculator State
  const [numSteps, setNumSteps] = useState<string>("4");
  const [riseHeight, setRiseHeight] = useState<string>("7");
  const [runDepth, setRunDepth] = useState<string>("11");
  const [stairWidth, setStairWidth] = useState<string>("36");
  const [platformDepth, setPlatformDepth] = useState<string>("24");
  const [includePlatform, setIncludePlatform] = useState<boolean>(true);
  const [wastage, setWastage] = useState<string>("10");
  
  // Tab 2: Stair Designer State
  const [totalHeight, setTotalHeight] = useState<string>("35");
  const [preferredRise, setPreferredRise] = useState<string>("7");
  const [preferredRun, setPreferredRun] = useState<string>("11");
  const [designWidth, setDesignWidth] = useState<string>("36");
  
  // Tab 3: Cost Estimator State
  const [concretePrice, setConcretePrice] = useState<string>("150");
  const [laborRate, setLaborRate] = useState<string>("50");
  const [laborHours, setLaborHours] = useState<string>("8");

  // Unit conversion helpers
  const inToM = (inches: number) => inches * 0.0254;
  const cuInToCuFt = (cuIn: number) => cuIn / 1728;
  const cuFtToCuYd = (cuFt: number) => cuFt / 27;
  const cuFtToCuM = (cuFt: number) => cuFt * 0.0283168;

  // Tab 1 Calculations
  const steps = parseInt(numSteps) || 0;
  const rise = parseFloat(riseHeight) || 7;
  const run = parseFloat(runDepth) || 11;
  const width = parseFloat(stairWidth) || 36;
  const platform = parseFloat(platformDepth) || 0;
  const waste = parseFloat(wastage) || 10;
  
  // Calculate step volumes (solid fill method)
  let totalStepVolumeCuIn = 0;
  const stepBreakdown: Array<{ step: number; volume: number }> = [];
  
  for (let i = 1; i <= steps; i++) {
    const stepVolume = i * rise * run * width;
    totalStepVolumeCuIn += stepVolume;
    stepBreakdown.push({ step: i, volume: stepVolume });
  }
  
  // Platform volume
  const platformVolumeCuIn = includePlatform && platform > 0 
    ? platform * (rise * steps) * width 
    : 0;
  
  const totalVolumeCuIn = totalStepVolumeCuIn + platformVolumeCuIn;
  const totalVolumeCuFt = cuInToCuFt(totalVolumeCuIn);
  const totalVolumeCuYd = cuFtToCuYd(totalVolumeCuFt);
  const totalVolumeCuM = cuFtToCuM(totalVolumeCuFt);
  
  // With wastage
  const volumeWithWaste = totalVolumeCuFt * (1 + waste / 100);
  const volumeWithWasteYd = cuFtToCuYd(volumeWithWaste);
  
  // Concrete bags needed
  const bags40 = Math.ceil(volumeWithWaste / bagYields["40"]);
  const bags60 = Math.ceil(volumeWithWaste / bagYields["60"]);
  const bags80 = Math.ceil(volumeWithWaste / bagYields["80"]);
  
  // Total weight (concrete ~150 lbs per cu ft)
  const totalWeightLbs = volumeWithWaste * 150;
  const totalWeightKg = totalWeightLbs * 0.453592;
  
  // Total dimensions
  const totalHeightIn = rise * steps;
  const totalRunIn = run * steps + (includePlatform ? platform : 0);

  // Tab 2 Calculations
  const designTotalHeight = parseFloat(totalHeight) || 35;
  const designPrefRise = parseFloat(preferredRise) || 7;
  const designPrefRun = parseFloat(preferredRun) || 11;
  const designW = parseFloat(designWidth) || 36;
  
  // Calculate number of steps needed
  const calculatedSteps = Math.ceil(designTotalHeight / designPrefRise);
  const actualRise = designTotalHeight / calculatedSteps;
  const actualRun = designPrefRun; // Run stays as preferred
  const totalRunDesign = actualRun * calculatedSteps;
  
  // Stair angle
  const stairAngle = Math.atan(actualRise / actualRun) * (180 / Math.PI);
  
  // Comfort check (2R + T formula)
  const comfortScore = 2 * actualRise + actualRun;
  const isComfortable = comfortScore >= buildingCodes.comfortMin && comfortScore <= buildingCodes.comfortMax;
  
  // Code compliance checks
  const riseCompliant = actualRise <= buildingCodes.maxRise;
  const runCompliant = actualRun >= buildingCodes.minRun;
  const widthCompliant = designW >= buildingCodes.minWidth;
  const angleOptimal = stairAngle >= buildingCodes.optimalAngleMin && stairAngle <= buildingCodes.optimalAngleMax;

  // Tab 3 Calculations
  const pricePerYard = parseFloat(concretePrice) || 150;
  const hourlyRate = parseFloat(laborRate) || 0;
  const hours = parseFloat(laborHours) || 0;
  
  const materialCost = volumeWithWasteYd * pricePerYard;
  const laborCost = hourlyRate * hours;
  const totalCost = materialCost + laborCost;
  const costPerStep = steps > 0 ? totalCost / steps : 0;

  const tabs = [
    { id: "volume", label: "Volume Calculator", icon: "📦" },
    { id: "designer", label: "Stair Designer", icon: "📐" },
    { id: "cost", label: "Cost Estimator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F3F4F6" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Concrete Step Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪜</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Concrete Step Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate concrete volume for steps and stairs, design code-compliant staircases, 
            and estimate material costs. Includes wastage allowance and bag calculations.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#374151",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>Concrete Step Volume Formula</p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "0.9rem" }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Step:</strong> n × Rise × Run × Width
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Standard:</strong> 7&quot; rise × 11&quot; run
                </div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "6px" }}>
                  <strong>Comfort:</strong> 2R + T = 24-25&quot;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <div style={{ display: "flex", gap: "4px", backgroundColor: "#E5E7EB", borderRadius: "8px", padding: "4px" }}>
            <button
              onClick={() => setUnitSystem("imperial")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: unitSystem === "imperial" ? "#374151" : "transparent",
                color: unitSystem === "imperial" ? "white" : "#374151",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              Imperial (in)
            </button>
            <button
              onClick={() => setUnitSystem("metric")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: unitSystem === "metric" ? "#374151" : "transparent",
                color: unitSystem === "metric" ? "white" : "#374151",
                fontWeight: "500",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              Metric (cm)
            </button>
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
                backgroundColor: activeTab === tab.id ? "#374151" : "#D1D5DB",
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

        {/* Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#374151", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "volume" && "📦 Step Dimensions"}
                {activeTab === "designer" && "📐 Design Parameters"}
                {activeTab === "cost" && "💰 Cost Inputs"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* VOLUME CALCULATOR TAB */}
              {activeTab === "volume" && (
                <>
                  {/* Number of Steps */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Number of Steps
                    </label>
                    <input
                      type="number"
                      value={numSteps}
                      onChange={(e) => setNumSteps(e.target.value)}
                      min="1"
                      max="20"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[2, 3, 4, 5, 6, 8].map((n) => (
                        <button
                          key={n}
                          onClick={() => setNumSteps(n.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: numSteps === n.toString() ? "2px solid #374151" : "1px solid #D1D5DB",
                            backgroundColor: numSteps === n.toString() ? "#F3F4F6" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {n} steps
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rise & Run */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Rise Height ({unitSystem === "imperial" ? "in" : "cm"})
                      </label>
                      <input
                        type="number"
                        value={riseHeight}
                        onChange={(e) => setRiseHeight(e.target.value)}
                        step="0.25"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: rise > buildingCodes.maxRise ? "#DC2626" : "#6B7280" }}>
                        {rise > buildingCodes.maxRise ? "⚠️ Exceeds max 7.75\"" : "Max: 7.75\" • Recommended: 7\""}
                      </p>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Run Depth ({unitSystem === "imperial" ? "in" : "cm"})
                      </label>
                      <input
                        type="number"
                        value={runDepth}
                        onChange={(e) => setRunDepth(e.target.value)}
                        step="0.25"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: run < buildingCodes.minRun ? "#DC2626" : "#6B7280" }}>
                        {run < buildingCodes.minRun ? "⚠️ Below min 10\"" : "Min: 10\" • Recommended: 11\""}
                      </p>
                    </div>
                  </div>

                  {/* Stair Width */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Stair Width ({unitSystem === "imperial" ? "in" : "cm"})
                    </label>
                    <input
                      type="number"
                      value={stairWidth}
                      onChange={(e) => setStairWidth(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[36, 42, 48, 60].map((w) => (
                        <button
                          key={w}
                          onClick={() => setStairWidth(w.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: stairWidth === w.toString() ? "2px solid #374151" : "1px solid #D1D5DB",
                            backgroundColor: stairWidth === w.toString() ? "#F3F4F6" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {w}&quot;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "10px" }}>
                      <input
                        type="checkbox"
                        checked={includePlatform}
                        onChange={(e) => setIncludePlatform(e.target.checked)}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Include Top Platform/Landing</span>
                    </label>
                    {includePlatform && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Platform Depth ({unitSystem === "imperial" ? "in" : "cm"})
                        </label>
                        <input
                          type="number"
                          value={platformDepth}
                          onChange={(e) => setPlatformDepth(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Wastage */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Wastage Allowance (%)
                    </label>
                    <input
                      type="number"
                      value={wastage}
                      onChange={(e) => setWastage(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[5, 10, 15, 20].map((w) => (
                        <button
                          key={w}
                          onClick={() => setWastage(w.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: wastage === w.toString() ? "2px solid #374151" : "1px solid #D1D5DB",
                            backgroundColor: wastage === w.toString() ? "#F3F4F6" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {w}%
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* STAIR DESIGNER TAB */}
              {activeTab === "designer" && (
                <>
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      💡 Enter total height and preferred dimensions. We&apos;ll calculate steps needed and check code compliance.
                    </p>
                  </div>

                  {/* Total Height */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Total Height ({unitSystem === "imperial" ? "in" : "cm"})
                    </label>
                    <input
                      type="number"
                      value={totalHeight}
                      onChange={(e) => setTotalHeight(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                      Floor-to-floor or ground-to-platform height
                    </p>
                  </div>

                  {/* Preferred Rise & Run */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Preferred Rise ({unitSystem === "imperial" ? "in" : "cm"})
                      </label>
                      <input
                        type="number"
                        value={preferredRise}
                        onChange={(e) => setPreferredRise(e.target.value)}
                        step="0.25"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Preferred Run ({unitSystem === "imperial" ? "in" : "cm"})
                      </label>
                      <input
                        type="number"
                        value={preferredRun}
                        onChange={(e) => setPreferredRun(e.target.value)}
                        step="0.25"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Stair Width */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Stair Width ({unitSystem === "imperial" ? "in" : "cm"})
                    </label>
                    <input
                      type="number"
                      value={designWidth}
                      onChange={(e) => setDesignWidth(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Quick Presets */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Quick Presets</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => { setPreferredRise("7"); setPreferredRun("11"); }}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", color: "#374151", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Standard (7&quot;×11&quot;)
                      </button>
                      <button
                        onClick={() => { setPreferredRise("6"); setPreferredRun("12"); }}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", color: "#374151", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Gentle (6&quot;×12&quot;)
                      </button>
                      <button
                        onClick={() => { setPreferredRise("7.5"); setPreferredRun("10"); }}
                        style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #D1D5DB", backgroundColor: "white", color: "#374151", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Compact (7.5&quot;×10&quot;)
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      📦 Using volume from Tab 1: <strong>{volumeWithWasteYd.toFixed(2)} cu yd</strong> ({volumeWithWaste.toFixed(1)} cu ft)
                    </p>
                  </div>

                  {/* Concrete Price */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Concrete Price ($ per cubic yard)
                    </label>
                    <input
                      type="number"
                      value={concretePrice}
                      onChange={(e) => setConcretePrice(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[120, 150, 180, 200].map((p) => (
                        <button
                          key={p}
                          onClick={() => setConcretePrice(p.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: concretePrice === p.toString() ? "2px solid #374151" : "1px solid #D1D5DB",
                            backgroundColor: concretePrice === p.toString() ? "#F3F4F6" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Labor */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>👷 Labor Cost (Optional)</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Hourly Rate ($)
                        </label>
                        <input
                          type="number"
                          value={laborRate}
                          onChange={(e) => setLaborRate(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          value={laborHours}
                          onChange={(e) => setLaborHours(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "0.85rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* DIY Note */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>DIY Tip:</strong> For small projects, bagged concrete may be more economical than ready-mix delivery. 
                      Ready-mix typically has minimum order requirements (1-2 yards).
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
                {activeTab === "volume" && "📊 Volume Results"}
                {activeTab === "designer" && "📐 Design Results"}
                {activeTab === "cost" && "💵 Cost Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* VOLUME RESULTS */}
              {activeTab === "volume" && (
                <>
                  {/* Main Volume */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Total Concrete Needed (with {waste}% wastage)
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {volumeWithWasteYd.toFixed(2)} cu yd
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {volumeWithWaste.toFixed(1)} cu ft • {(volumeWithWaste * 0.0283168).toFixed(2)} cu m
                    </p>
                  </div>

                  {/* Bag Options */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                    {[
                      { size: "40 lb", bags: bags40, color: "#FEF3C7", border: "#F59E0B" },
                      { size: "60 lb", bags: bags60, color: "#ECFDF5", border: "#10B981" },
                      { size: "80 lb", bags: bags80, color: "#EFF6FF", border: "#3B82F6" }
                    ].map((opt) => (
                      <div key={opt.size} style={{
                        backgroundColor: opt.color,
                        borderRadius: "10px",
                        padding: "12px",
                        textAlign: "center",
                        border: `2px solid ${opt.border}`
                      }}>
                        <p style={{ margin: "0 0 4px 0", fontSize: "0.7rem", color: "#374151" }}>{opt.size} bags</p>
                        <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
                          {opt.bags}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Dimensions Summary */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Stair Dimensions</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Total Height</span>
                        <span style={{ fontWeight: "600" }}>{totalHeightIn.toFixed(1)}&quot; ({(totalHeightIn * 2.54).toFixed(1)} cm)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Total Run</span>
                        <span style={{ fontWeight: "600" }}>{totalRunIn.toFixed(1)}&quot; ({(totalRunIn * 2.54).toFixed(1)} cm)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Concrete Weight</span>
                        <span style={{ fontWeight: "600" }}>{totalWeightLbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs</span>
                      </div>
                    </div>
                  </div>

                  {/* Step Breakdown (collapsible) */}
                  <details style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "12px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: "600", color: "#374151", fontSize: "0.85rem" }}>
                      📋 Volume per Step Breakdown
                    </summary>
                    <div style={{ marginTop: "12px", fontSize: "0.8rem" }}>
                      {stepBreakdown.map((s) => (
                        <div key={s.step} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span>Step {s.step}</span>
                          <span>{cuInToCuFt(s.volume).toFixed(2)} cu ft</span>
                        </div>
                      ))}
                      {includePlatform && platform > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: "600" }}>
                          <span>Platform</span>
                          <span>{cuInToCuFt(platformVolumeCuIn).toFixed(2)} cu ft</span>
                        </div>
                      )}
                    </div>
                  </details>
                </>
              )}

              {/* DESIGNER RESULTS */}
              {activeTab === "designer" && (
                <>
                  {/* Main Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Steps Needed
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {calculatedSteps} steps
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {actualRise.toFixed(2)}&quot; rise × {actualRun}&quot; run each
                    </p>
                  </div>

                  {/* Calculated Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Total Run</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>
                        {totalRunDesign.toFixed(1)}&quot;
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: "#6B7280" }}>
                        ({(totalRunDesign / 12).toFixed(1)} ft)
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Stair Angle</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>
                        {stairAngle.toFixed(1)}°
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.7rem", color: angleOptimal ? "#059669" : "#F59E0B" }}>
                        {angleOptimal ? "✓ Optimal" : "⚠️ Outside 30-40°"}
                      </p>
                    </div>
                  </div>

                  {/* Compliance Checks */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Code Compliance</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                        <span style={{ color: "#4B5563" }}>Rise ≤ 7.75&quot;</span>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: riseCompliant ? "#D1FAE5" : "#FEE2E2", color: riseCompliant ? "#065F46" : "#DC2626" }}>
                          {riseCompliant ? "✓ PASS" : "✗ FAIL"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                        <span style={{ color: "#4B5563" }}>Run ≥ 10&quot;</span>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: runCompliant ? "#D1FAE5" : "#FEE2E2", color: runCompliant ? "#065F46" : "#DC2626" }}>
                          {runCompliant ? "✓ PASS" : "✗ FAIL"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                        <span style={{ color: "#4B5563" }}>Width ≥ 36&quot;</span>
                        <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "600", backgroundColor: widthCompliant ? "#D1FAE5" : "#FEE2E2", color: widthCompliant ? "#065F46" : "#DC2626" }}>
                          {widthCompliant ? "✓ PASS" : "✗ FAIL"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comfort Score */}
                  <div style={{
                    backgroundColor: isComfortable ? "#ECFDF5" : "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: `1px solid ${isComfortable ? "#6EE7B7" : "#FCD34D"}`
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: isComfortable ? "#065F46" : "#92400E" }}>
                      <strong>Comfort Check (2R + T):</strong> {comfortScore.toFixed(1)}&quot; 
                      {isComfortable ? " ✓ Within ideal range (24-25\")" : ` ⚠️ Outside ideal range (24-25\")`}
                    </p>
                  </div>
                </>
              )}

              {/* COST RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Total Cost */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Total Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Material Cost</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>
                        ${materialCost.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#6B7280" }}>Labor Cost</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#374151" }}>
                        ${laborCost.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Per Step Cost */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", marginBottom: "16px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#92400E" }}>Cost per Step</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>
                      ${costPerStep.toFixed(2)}
                    </p>
                  </div>

                  {/* DIY Bag Cost Comparison */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>DIY Bag Cost Estimate</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>40 lb bags (~$5 each)</span>
                        <span style={{ fontWeight: "600" }}>{bags40} bags = ${(bags40 * 5).toFixed(0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>60 lb bags (~$6 each)</span>
                        <span style={{ fontWeight: "600" }}>{bags60} bags = ${(bags60 * 6).toFixed(0)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#4B5563" }}>80 lb bags (~$7 each)</span>
                        <span style={{ fontWeight: "600" }}>{bags80} bags = ${(bags80 * 7).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Building Codes Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#374151", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📋 Building Code Requirements (IRC/IBC)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Parameter</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Minimum</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Maximum</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recommended</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { param: "Riser Height", min: "-", max: "7.75\" (19.7 cm)", rec: "7\" (17.8 cm)" },
                  { param: "Tread Depth (Run)", min: "10\" (25.4 cm)", max: "-", rec: "11\" (27.9 cm)" },
                  { param: "Stair Width", min: "36\" (91.4 cm)", max: "-", rec: "42-48\" (107-122 cm)" },
                  { param: "Headroom", min: "6\'8\" (203 cm)", max: "-", rec: "7\'+ (213+ cm)" },
                  { param: "Stair Angle", min: "20°", max: "45°", rec: "30-40°" },
                  { param: "Nosing (if any)", min: "0.75\" (1.9 cm)", max: "1.25\" (3.2 cm)", rec: "1\" (2.5 cm)" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.param}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.min}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.max}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{row.rec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * Always check local building codes as requirements may vary. The comfort formula &quot;2R + T = 24-25 inches&quot; helps ensure ease of climbing.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪜 Understanding Concrete Step Calculations</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>Solid Fill vs. Hollow Steps</h3>
                <p>
                  This calculator assumes solid-fill concrete steps, which are the most common for residential construction. 
                  Each step is poured as a solid block that includes all the concrete below it. This method is simpler 
                  for DIY projects and provides maximum durability. Larger commercial staircases may use hollow forms 
                  with reinforced shells to reduce concrete usage—a more complex calculation not covered here.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 2R + T Comfort Formula</h3>
                <p>
                  The formula &quot;2 × Rise + Tread = 24-25 inches&quot; has been used for centuries to design comfortable stairs. 
                  It&apos;s based on the average human stride length. If your calculated value is below 24&quot;, the stairs will 
                  feel too steep and cramped. Above 25&quot;, users will feel like they&apos;re taking unnaturally large steps. 
                  The standard 7&quot;×11&quot; dimensions give 2(7)+11 = 25&quot;, right at the comfortable maximum.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Ready-Mix vs. Bagged Concrete</h3>
                <p>
                  For projects under 1 cubic yard (about 27 cubic feet), bagged concrete is usually more practical and 
                  economical. Ready-mix delivery trucks typically have minimum orders of 1-2 yards, plus delivery fees. 
                  However, for larger projects, ready-mix saves significant labor time—mixing 50+ bags by hand is 
                  exhausting. Calculate your break-even point: ready-mix at $150/yard vs. bags at $5-7 each.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#374151", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📐 Quick Reference</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Standard Rise:</strong> 7&quot; (max 7.75&quot;)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Standard Run:</strong> 11&quot; (min 10&quot;)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Min Width:</strong> 36&quot;</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Comfort:</strong> 2R + T = 24-25&quot;</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  1 cu yd = 27 cu ft ≈ 4,050 lbs
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Safety Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <li>Check local building codes</li>
                <li>Use proper reinforcement (rebar)</li>
                <li>Allow 28 days for full cure</li>
                <li>Include handrails if 3+ steps</li>
                <li>Ensure proper drainage</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/concrete-step-calculator" currentCategory="Construction" />
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
            🪜 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes. 
            Always verify calculations and check local building codes before construction. 
            Consult a professional for structural requirements and permits.
          </p>
        </div>
      </div>
    </div>
  );
}