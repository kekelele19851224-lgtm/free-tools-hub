"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Fixture GPM values
const fixtureData = [
  { name: "Bathroom (shower + toilet + sink)", gpm: 2.5, icon: "🚿" },
  { name: "Kitchen Sink", gpm: 1.5, icon: "🚰" },
  { name: "Dishwasher", gpm: 1.5, icon: "🍽️" },
  { name: "Washing Machine", gpm: 2.0, icon: "👕" },
  { name: "Outdoor Faucet / Hose Bib", gpm: 3.0, icon: "🏡" },
  { name: "Irrigation Sprinkler Head", gpm: 2.0, icon: "💦" },
];

// Pump sizing reference data
const pumpSizingData = [
  { hp: "1/2 HP", maxTDH: 200, gpmRange: "5-10", maxDepth: "150 ft", typical: "Small homes, shallow wells" },
  { hp: "3/4 HP", maxTDH: 250, gpmRange: "8-12", maxDepth: "200 ft", typical: "Average homes" },
  { hp: "1 HP", maxTDH: 300, gpmRange: "10-15", maxDepth: "250 ft", typical: "Larger homes, moderate depth" },
  { hp: "1.5 HP", maxTDH: 400, gpmRange: "12-20", maxDepth: "350 ft", typical: "Large homes, deeper wells" },
  { hp: "2 HP", maxTDH: 500, gpmRange: "15-25", maxDepth: "450 ft", typical: "High demand, deep wells" },
  { hp: "3 HP", maxTDH: 600, gpmRange: "20-30", maxDepth: "550 ft", typical: "Very deep wells, irrigation" },
  { hp: "5 HP", maxTDH: 800, gpmRange: "25-50", maxDepth: "700+ ft", typical: "Commercial, large irrigation" },
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate what size well pump I need?",
    answer: "To size a well pump, you need three key values: 1) Required GPM (gallons per minute) based on your water fixtures, 2) Total Dynamic Head (TDH) which includes pumping depth, elevation, pressure requirements, and friction loss, 3) Match these to a pump's performance curve. A properly sized pump should deliver your required GPM at your calculated TDH without running continuously."
  },
  {
    question: "What size pump do I need for a 200 ft well?",
    answer: "For a 200 ft well pumping to a standard 40-60 PSI pressure tank, you'll typically need a 3/4 HP to 1 HP pump for residential use (8-15 GPM). The exact size depends on your static water level, required pressure, and pipe friction losses. Calculate your Total Dynamic Head (TDH) first, then match it to pump specifications."
  },
  {
    question: "What GPM well pump do I need?",
    answer: "Most residential homes need 6-12 GPM. Calculate your needs by counting fixtures: each bathroom adds 2-3 GPM, kitchen sink 1.5 GPM, washing machine 2 GPM, and outdoor faucets 3-5 GPM. Consider how many fixtures might run simultaneously during peak usage (usually 2-3) rather than adding all fixtures together."
  },
  {
    question: "What is Total Dynamic Head (TDH)?",
    answer: "Total Dynamic Head (TDH) is the total equivalent height the pump must lift water, measured in feet. It includes: 1) Pumping level (depth to water when pumping), 2) Vertical lift to highest outlet, 3) Pressure requirement (1 PSI = 2.31 ft), 4) Friction loss from pipes (typically 5-15% of total). TDH determines the pump horsepower needed."
  },
  {
    question: "Should I get a submersible or jet pump?",
    answer: "Submersible pumps are installed inside the well and are best for wells deeper than 25 feet. They're more efficient, quieter, and longer-lasting. Jet pumps sit above ground and work for shallow wells (under 25 ft for single-pipe, up to 110 ft for two-pipe). Most residential wells over 50 feet deep use submersible pumps."
  },
  {
    question: "How do I measure my well's flow rate (GPM)?",
    answer: "To test GPM: 1) Let the pump build full pressure, 2) Open a faucet near the pressure tank, 3) Time how long it takes to fill a 5-gallon bucket, 4) Calculate: GPM = (5 gallons ÷ seconds) × 60. For example, if it takes 30 seconds to fill 5 gallons, your flow rate is (5÷30)×60 = 10 GPM."
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

export default function WellPumpSizeCalculator() {
  const [activeTab, setActiveTab] = useState<'gpm' | 'sizer' | 'chart'>('gpm');

  // Tab 1: GPM Calculator - fixture counts
  const [bathrooms, setBathrooms] = useState<string>("2");
  const [kitchenSinks, setKitchenSinks] = useState<string>("1");
  const [dishwashers, setDishwashers] = useState<string>("1");
  const [washingMachines, setWashingMachines] = useState<string>("1");
  const [outdoorFaucets, setOutdoorFaucets] = useState<string>("2");
  const [sprinklerHeads, setSprinklerHeads] = useState<string>("0");
  const [simultaneousFactor, setSimultaneousFactor] = useState<string>("30");

  // Tab 2: Pump Sizer inputs
  const [wellDepth, setWellDepth] = useState<string>("200");
  const [staticWaterLevel, setStaticWaterLevel] = useState<string>("50");
  const [pumpingWaterLevel, setPumpingWaterLevel] = useState<string>("80");
  const [desiredPressure, setDesiredPressure] = useState<string>("50");
  const [verticalLift, setVerticalLift] = useState<string>("10");
  const [pipeLength, setPipeLength] = useState<string>("200");
  const [pipeSize, setPipeSize] = useState<string>("1");

  // Tab 1 Calculations - GPM
  const gpmResults = useMemo(() => {
    const bath = (parseFloat(bathrooms) || 0) * 2.5;
    const kitchen = (parseFloat(kitchenSinks) || 0) * 1.5;
    const dish = (parseFloat(dishwashers) || 0) * 1.5;
    const wash = (parseFloat(washingMachines) || 0) * 2.0;
    const outdoor = (parseFloat(outdoorFaucets) || 0) * 3.0;
    const sprinkler = (parseFloat(sprinklerHeads) || 0) * 2.0;

    const totalPotential = bath + kitchen + dish + wash + outdoor + sprinkler;
    const factor = (parseFloat(simultaneousFactor) || 30) / 100;
    const recommendedGPM = Math.max(6, Math.round(totalPotential * factor * 10) / 10);
    const peakGPM = Math.round(totalPotential * 0.5 * 10) / 10;

    return {
      totalPotential: Math.round(totalPotential * 10) / 10,
      recommendedGPM,
      peakGPM,
      minGPM: Math.max(6, Math.round(recommendedGPM * 0.8)),
      maxGPM: Math.round(recommendedGPM * 1.3)
    };
  }, [bathrooms, kitchenSinks, dishwashers, washingMachines, outdoorFaucets, sprinklerHeads, simultaneousFactor]);

  // Tab 2 Calculations - Pump Sizer
  const pumpResults = useMemo(() => {
    const pumpLevel = parseFloat(pumpingWaterLevel) || 0;
    const lift = parseFloat(verticalLift) || 0;
    const pressure = parseFloat(desiredPressure) || 0;
    const length = parseFloat(pipeLength) || 0;
    const size = parseFloat(pipeSize) || 1;

    // Pressure head (1 PSI = 2.31 ft)
    const pressureHead = pressure * 2.31;

    // Friction loss estimate (simplified - varies by pipe size and flow)
    // Approximate friction loss per 100 ft for 1" pipe at 10 GPM is about 4 ft
    const frictionFactor = size === 0.75 ? 0.08 : size === 1 ? 0.05 : size === 1.25 ? 0.03 : 0.02;
    const frictionLoss = length * frictionFactor;

    // Total Dynamic Head
    const tdh = pumpLevel + lift + pressureHead + frictionLoss;
    const tdhRounded = Math.round(tdh);

    // Recommend pump HP based on TDH
    let recommendedHP = "1/2 HP";
    let gpmRange = "5-10";
    if (tdh > 600) { recommendedHP = "5 HP"; gpmRange = "25-50"; }
    else if (tdh > 500) { recommendedHP = "3 HP"; gpmRange = "20-30"; }
    else if (tdh > 400) { recommendedHP = "2 HP"; gpmRange = "15-25"; }
    else if (tdh > 300) { recommendedHP = "1.5 HP"; gpmRange = "12-20"; }
    else if (tdh > 250) { recommendedHP = "1 HP"; gpmRange = "10-15"; }
    else if (tdh > 200) { recommendedHP = "3/4 HP"; gpmRange = "8-12"; }

    return {
      pumpLevel,
      lift,
      pressureHead: Math.round(pressureHead),
      frictionLoss: Math.round(frictionLoss),
      tdh: tdhRounded,
      recommendedHP,
      gpmRange,
      isValid: pumpLevel > 0
    };
  }, [pumpingWaterLevel, verticalLift, desiredPressure, pipeLength, pipeSize]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Well Pump Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>💧</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Well Pump Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate the GPM (gallons per minute) and horsepower needed for your well pump. 
            Determine Total Dynamic Head (TDH) based on well depth, water level, and pressure requirements.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                <strong>Quick Guide:</strong> Most homes need 6-12 GPM and 1/2 to 1.5 HP pump
              </p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                TDH = Pumping Level + Vertical Lift + Pressure (PSI × 2.31) + Friction Loss
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("gpm")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "gpm" ? "#0284C7" : "#E5E7EB",
              color: activeTab === "gpm" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🚰 GPM Calculator
          </button>
          <button
            onClick={() => setActiveTab("sizer")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "sizer" ? "#0284C7" : "#E5E7EB",
              color: activeTab === "sizer" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔧 Pump Sizer
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "chart" ? "#0284C7" : "#E5E7EB",
              color: activeTab === "chart" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Sizing Chart
          </button>
        </div>

        {/* Tab 1: GPM Calculator */}
        {activeTab === 'gpm' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🚰 Water Fixtures
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Fixture Inputs */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                  {[
                    { label: "Bathrooms (full)", value: bathrooms, setter: setBathrooms, gpm: 2.5, icon: "🚿" },
                    { label: "Kitchen Sinks", value: kitchenSinks, setter: setKitchenSinks, gpm: 1.5, icon: "🚰" },
                    { label: "Dishwashers", value: dishwashers, setter: setDishwashers, gpm: 1.5, icon: "🍽️" },
                    { label: "Washing Machines", value: washingMachines, setter: setWashingMachines, gpm: 2.0, icon: "👕" },
                    { label: "Outdoor Faucets", value: outdoorFaucets, setter: setOutdoorFaucets, gpm: 3.0, icon: "🏡" },
                    { label: "Sprinkler Heads", value: sprinklerHeads, setter: setSprinklerHeads, gpm: 2.0, icon: "💦" },
                  ].map(fixture => (
                    <div key={fixture.label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "1.25rem", width: "30px" }}>{fixture.icon}</span>
                      <label style={{ flex: 1, fontSize: "0.9rem", color: "#374151" }}>
                        {fixture.label} <span style={{ color: "#6B7280" }}>({fixture.gpm} GPM each)</span>
                      </label>
                      <input
                        type="number"
                        value={fixture.value}
                        onChange={(e) => fixture.setter(e.target.value)}
                        style={{
                          width: "70px",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="0"
                      />
                    </div>
                  ))}
                </div>

                {/* Simultaneous Usage Factor */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Simultaneous Usage Factor: {simultaneousFactor}%
                  </label>
                  <input
                    type="range"
                    value={simultaneousFactor}
                    onChange={(e) => setSimultaneousFactor(e.target.value)}
                    style={{ width: "100%" }}
                    min="20"
                    max="60"
                    step="5"
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>20% (Low)</span>
                    <span>40% (Normal)</span>
                    <span>60% (High)</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                    💡 <strong>Tip:</strong> Most homes rarely use more than 30-40% of total potential GPM at once.
                  </p>
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
              <div style={{ backgroundColor: "#0369A1", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Recommended GPM
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #0284C7"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                    Recommended Pump Flow Rate
                  </p>
                  <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#0284C7" }}>
                    {gpmResults.minGPM} - {gpmResults.maxGPM} GPM
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#0369A1" }}>
                    Target: <strong>{gpmResults.recommendedGPM} GPM</strong>
                  </p>
                </div>

                {/* Breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Total Potential GPM</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{gpmResults.totalPotential} GPM</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Simultaneous Factor</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{simultaneousFactor}%</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Peak Usage Estimate</span>
                    <span style={{ fontWeight: "600", color: "#D97706" }}>{gpmResults.peakGPM} GPM</span>
                  </div>
                </div>

                {/* HP Recommendation */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #86EFAC"
                }}>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#166534", fontWeight: "600" }}>
                    💪 Suggested Pump Size:
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#15803D" }}>
                    {gpmResults.recommendedGPM <= 10 && "1/2 to 3/4 HP for typical residential use"}
                    {gpmResults.recommendedGPM > 10 && gpmResults.recommendedGPM <= 15 && "3/4 to 1 HP for average household"}
                    {gpmResults.recommendedGPM > 15 && gpmResults.recommendedGPM <= 20 && "1 to 1.5 HP for larger homes"}
                    {gpmResults.recommendedGPM > 20 && "1.5 to 2+ HP for high demand"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pump Sizer */}
        {activeTab === 'sizer' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#0284C7", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔧 Well Specifications
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Well Depth */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Total Well Depth (ft)
                  </label>
                  <input
                    type="number"
                    value={wellDepth}
                    onChange={(e) => setWellDepth(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="200"
                  />
                </div>

                {/* Static Water Level */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Static Water Level (ft from surface)
                  </label>
                  <input
                    type="number"
                    value={staticWaterLevel}
                    onChange={(e) => setStaticWaterLevel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="50"
                  />
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                    Water level when pump is OFF
                  </p>
                </div>

                {/* Pumping Water Level */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Pumping Water Level (ft from surface)
                  </label>
                  <input
                    type="number"
                    value={pumpingWaterLevel}
                    onChange={(e) => setPumpingWaterLevel(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="80"
                  />
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                    Water level when pump is ON (drawdown)
                  </p>
                </div>

                {/* Desired Pressure */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Desired Pressure (PSI)
                  </label>
                  <input
                    type="number"
                    value={desiredPressure}
                    onChange={(e) => setDesiredPressure(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="50"
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    {[40, 50, 60].map(psi => (
                      <button
                        key={psi}
                        onClick={() => setDesiredPressure(psi.toString())}
                        style={{
                          padding: "6px 16px",
                          borderRadius: "6px",
                          border: parseInt(desiredPressure) === psi ? "2px solid #0284C7" : "1px solid #D1D5DB",
                          backgroundColor: parseInt(desiredPressure) === psi ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {psi} PSI
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vertical Lift */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vertical Lift to House (ft)
                  </label>
                  <input
                    type="number"
                    value={verticalLift}
                    onChange={(e) => setVerticalLift(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="10"
                  />
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                    Elevation difference from well to highest outlet
                  </p>
                </div>

                {/* Pipe Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Pipe Length (ft)
                    </label>
                    <input
                      type="number"
                      value={pipeLength}
                      onChange={(e) => setPipeLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Pipe Size (inches)
                    </label>
                    <select
                      value={pipeSize}
                      onChange={(e) => setPipeSize(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    >
                      <option value="0.75">3/4&quot;</option>
                      <option value="1">1&quot;</option>
                      <option value="1.25">1-1/4&quot;</option>
                      <option value="1.5">1-1/2&quot;</option>
                    </select>
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
              <div style={{ backgroundColor: "#0369A1", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Pump Recommendation
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* TDH Result */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #D97706"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                    Total Dynamic Head (TDH)
                  </p>
                  <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#D97706" }}>
                    {pumpResults.tdh} ft
                  </p>
                </div>

                {/* HP Recommendation */}
                <div style={{
                  backgroundColor: "#DCFCE7",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #22C55E"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>
                    Recommended Pump
                  </p>
                  <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#16A34A" }}>
                    {pumpResults.recommendedHP}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#15803D" }}>
                    Flow Range: {pumpResults.gpmRange} GPM
                  </p>
                </div>

                {/* TDH Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>TDH Breakdown:</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Pumping Level</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{pumpResults.pumpLevel} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Vertical Lift</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{pumpResults.lift} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Pressure Head ({desiredPressure} PSI × 2.31)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{pumpResults.pressureHead} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Friction Loss (estimated)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{pumpResults.frictionLoss} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#DBEAFE", borderRadius: "6px", border: "1px solid #93C5FD" }}>
                      <span style={{ color: "#1E40AF", fontWeight: "600" }}>Total TDH</span>
                      <span style={{ fontWeight: "700", color: "#0284C7", fontSize: "1.1rem" }}>{pumpResults.tdh} ft</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    ⚠️ <strong>Note:</strong> Always verify with pump performance curves. Actual requirements may vary based on pipe fittings, valves, and well recovery rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Sizing Chart */}
        {activeTab === 'chart' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 Well Pump Sizing Reference Chart
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              General guidelines for submersible well pump selection. Actual pump selection should be based on manufacturer curves.
            </p>

            {/* Main Sizing Table */}
            <div style={{ marginBottom: "32px", overflowX: "auto" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Pump HP vs TDH vs GPM
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#DBEAFE" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Pump HP</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Max TDH</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>GPM Range</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Typical Max Depth</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Typical Use</th>
                  </tr>
                </thead>
                <tbody>
                  {pumpSizingData.map((pump, index) => (
                    <tr key={pump.hp} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#0284C7" }}>{pump.hp}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{pump.maxTDH} ft</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{pump.gpmRange}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{pump.maxDepth}</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>{pump.typical}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submersible vs Jet */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Submersible vs Jet Pump
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px", border: "1px solid #93C5FD" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#1E40AF" }}>🔵 Submersible Pump</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#1D4ED8", lineHeight: "1.8", fontSize: "0.9rem" }}>
                    <li>Installed inside the well</li>
                    <li>Best for wells &gt;25 ft deep</li>
                    <li>Works up to 400+ ft</li>
                    <li>More efficient & quieter</li>
                    <li>Longer lifespan (10-25 years)</li>
                    <li>Higher initial cost</li>
                  </ul>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "20px", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                  <h4 style={{ margin: "0 0 12px 0", color: "#92400E" }}>🟡 Jet Pump</h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#B45309", lineHeight: "1.8", fontSize: "0.9rem" }}>
                    <li>Installed above ground</li>
                    <li>Shallow: ≤25 ft (single pipe)</li>
                    <li>Deep: 25-110 ft (two pipe)</li>
                    <li>Easier to service</li>
                    <li>Lower initial cost</li>
                    <li>Noisier operation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pressure Tank Sizing */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Pressure Tank Sizing Guide
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F0FDF4" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Pump GPM</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Minimum Tank Size</th>
                      <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Recommended Tank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { gpm: "5-10 GPM", min: "20 gallon", rec: "32-44 gallon" },
                      { gpm: "10-15 GPM", min: "32 gallon", rec: "44-62 gallon" },
                      { gpm: "15-20 GPM", min: "44 gallon", rec: "62-86 gallon" },
                      { gpm: "20-25 GPM", min: "62 gallon", rec: "86-119 gallon" },
                    ].map((row, index) => (
                      <tr key={row.gpm} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>{row.gpm}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{row.min}</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{row.rec}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ margin: "12px 0 0 0", fontSize: "0.85rem", color: "#6B7280" }}>
                * Larger tanks reduce pump cycling and extend pump life. Rule of thumb: 1-2 gallons of tank per GPM.
              </p>
            </div>

            {/* Wire Size Reference */}
            <div style={{
              backgroundColor: "#F0FDF4",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #86EFAC"
            }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#166534", fontSize: "1rem" }}>⚡ Wire Size Quick Reference (230V)</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                {[
                  { hp: "1/2 HP", wire: "14 AWG", dist: "≤300 ft" },
                  { hp: "3/4 HP", wire: "12 AWG", dist: "≤300 ft" },
                  { hp: "1 HP", wire: "10 AWG", dist: "≤300 ft" },
                  { hp: "1.5 HP", wire: "10 AWG", dist: "≤200 ft" },
                  { hp: "2 HP", wire: "8 AWG", dist: "≤300 ft" },
                  { hp: "3 HP", wire: "6 AWG", dist: "≤300 ft" },
                ].map(item => (
                  <div key={item.hp} style={{ padding: "10px", backgroundColor: "white", borderRadius: "6px", textAlign: "center" }}>
                    <p style={{ margin: 0, fontWeight: "600", color: "#166534" }}>{item.hp}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#15803D" }}>{item.wire} ({item.dist})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>💧 How to Size a Well Pump</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Choosing the right well pump size ensures adequate water pressure, efficient operation, and long pump life. 
                  An undersized pump won&apos;t meet your water needs, while an oversized pump wastes energy and may short-cycle.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 1: Determine Your GPM Needs</h3>
                <p>
                  Calculate how many gallons per minute (GPM) your household needs based on water fixtures. 
                  A typical home needs 6-12 GPM. Count your fixtures and estimate simultaneous usage (usually 30-40% of total).
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 2: Calculate Total Dynamic Head (TDH)</h3>
                <div style={{
                  backgroundColor: "#DBEAFE",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>TDH Formula:</p>
                  <p style={{ margin: 0, fontFamily: "monospace", color: "#1D4ED8", fontSize: "0.95rem" }}>
                    TDH = Pumping Level + Vertical Lift + (PSI × 2.31) + Friction Loss
                  </p>
                  <ul style={{ margin: "12px 0 0 0", paddingLeft: "20px", color: "#1D4ED8", fontSize: "0.9rem" }}>
                    <li><strong>Pumping Level:</strong> Depth to water when pump is running</li>
                    <li><strong>Vertical Lift:</strong> Height from well to highest outlet</li>
                    <li><strong>Pressure Head:</strong> Desired PSI × 2.31 feet per PSI</li>
                    <li><strong>Friction Loss:</strong> Typically 5-15% (varies by pipe size/length)</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 3: Match Pump to TDH and GPM</h3>
                <p>
                  Select a pump that delivers your required GPM at your calculated TDH. Check the manufacturer&apos;s 
                  pump curve to verify performance. The pump should operate in its &quot;sweet spot&quot; - not at the 
                  extreme ends of its curve.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Important Considerations</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li><strong>Well Recovery Rate:</strong> Your pump shouldn&apos;t exceed your well&apos;s ability to refill</li>
                  <li><strong>Pump Setting Depth:</strong> Install pump 20-30 ft below pumping level</li>
                  <li><strong>Wire Sizing:</strong> Proper wire gauge prevents voltage drop</li>
                  <li><strong>Pressure Tank:</strong> Size tank to minimize pump cycling (1-2 gal per GPM)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#DBEAFE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Typical home: 6-12 GPM</p>
                <p style={{ margin: 0 }}>• 1 PSI = 2.31 ft of head</p>
                <p style={{ margin: 0 }}>• 40-60 PSI = 92-139 ft head</p>
                <p style={{ margin: 0 }}>• Standard pressure: 40/60 PSI</p>
                <p style={{ margin: 0 }}>• Submersible: wells &gt;25 ft</p>
              </div>
            </div>

            {/* Common Pressures */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>⚡ Pressure Settings</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>30/50 PSI:</strong> Low pressure</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>40/60 PSI:</strong> Standard (most common)</p>
                <p style={{ margin: 0 }}><strong>50/70 PSI:</strong> High pressure</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/well-pump-size-calculator" currentCategory="Home" />
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on general industry guidelines. 
            Actual pump selection should be verified using manufacturer pump curves and specifications. 
            Well characteristics, local conditions, and specific requirements may vary. 
            Consult a licensed well professional for critical applications.
          </p>
        </div>
      </div>
    </div>
  );
}