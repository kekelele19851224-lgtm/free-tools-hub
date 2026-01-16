"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Wire size chart data (10 coils measurement -> wire size)
const wireSizeChart = [
  { coils10: "1 3/16", coils20: "2 3/8", wireSize: 0.1195 },
  { coils10: "1 5/16", coils20: "2 5/8", wireSize: 0.1315 },
  { coils10: "1 7/16", coils20: "2 7/8", wireSize: 0.1483 },
  { coils10: "1 9/16", coils20: "3 1/8", wireSize: 0.1620 },
  { coils10: "1 3/4", coils20: "3 1/2", wireSize: 0.1770 },
  { coils10: "1 15/16", coils20: "3 7/8", wireSize: 0.1920 },
  { coils10: "2 1/16", coils20: "4 1/8", wireSize: 0.2070 },
  { coils10: "2 3/16", coils20: "4 3/8", wireSize: 0.2180 },
  { coils10: "2 5/16", coils20: "4 5/8", wireSize: 0.2253 },
  { coils10: "2 7/16", coils20: "4 7/8", wireSize: 0.2437 },
  { coils10: "2 1/2", coils20: "5", wireSize: 0.2500 },
  { coils10: "2 5/8", coils20: "5 1/4", wireSize: 0.2625 },
  { coils10: "2 13/16", coils20: "5 5/8", wireSize: 0.2830 },
  { coils10: "3", coils20: "6", wireSize: 0.2950 },
];

// Standard spring recommendations based on door weight
const springRecommendations = [
  { minWeight: 80, maxWeight: 100, singleSpring: ".207 x 2\" x 24\"", doubleSpring: ".177 x 2\" x 21\" (pair)", ippt: 28.5 },
  { minWeight: 100, maxWeight: 120, singleSpring: ".218 x 2\" x 26\"", doubleSpring: ".177 x 2\" x 24\" (pair)", ippt: 32.5 },
  { minWeight: 120, maxWeight: 140, singleSpring: ".225 x 2\" x 28\"", doubleSpring: ".192 x 2\" x 24\" (pair)", ippt: 36.5 },
  { minWeight: 140, maxWeight: 160, singleSpring: ".234 x 2\" x 29\"", doubleSpring: ".207 x 2\" x 24\" (pair)", ippt: 40.5 },
  { minWeight: 160, maxWeight: 180, singleSpring: ".243 x 2\" x 30\"", doubleSpring: ".207 x 2\" x 27\" (pair)", ippt: 44.5 },
  { minWeight: 180, maxWeight: 200, singleSpring: ".250 x 2\" x 31\"", doubleSpring: ".218 x 2\" x 27\" (pair)", ippt: 48.5 },
  { minWeight: 200, maxWeight: 225, singleSpring: ".262 x 2\" x 32\"", doubleSpring: ".218 x 2\" x 30\" (pair)", ippt: 53.5 },
  { minWeight: 225, maxWeight: 250, singleSpring: ".273 x 2\" x 33\"", doubleSpring: ".225 x 2\" x 31\" (pair)", ippt: 59.0 },
  { minWeight: 250, maxWeight: 275, singleSpring: ".283 x 2\" x 34\"", doubleSpring: ".234 x 2\" x 31\" (pair)", ippt: 64.5 },
  { minWeight: 275, maxWeight: 300, singleSpring: ".295 x 2\" x 35\"", doubleSpring: ".243 x 2\" x 31\" (pair)", ippt: 70.0 },
  { minWeight: 300, maxWeight: 350, singleSpring: null, doubleSpring: ".250 x 2\" x 33\" (pair)", ippt: 78.0 },
  { minWeight: 350, maxWeight: 400, singleSpring: null, doubleSpring: ".262 x 2\" x 35\" (pair)", ippt: 90.0 },
];

// Door weight estimates by type
const doorWeightEstimates: Record<string, Record<string, Record<string, number>>> = {
  "8x7": {
    "non-insulated": { steel: 75, aluminum: 55, wood: 130 },
    "insulated": { steel: 95, aluminum: 75, wood: 150 },
    "with-windows": { steel: 90, aluminum: 70, wood: 145 },
  },
  "9x7": {
    "non-insulated": { steel: 85, aluminum: 65, wood: 145 },
    "insulated": { steel: 110, aluminum: 85, wood: 170 },
    "with-windows": { steel: 105, aluminum: 80, wood: 165 },
  },
  "10x7": {
    "non-insulated": { steel: 95, aluminum: 75, wood: 165 },
    "insulated": { steel: 125, aluminum: 100, wood: 195 },
    "with-windows": { steel: 120, aluminum: 95, wood: 185 },
  },
  "16x7": {
    "non-insulated": { steel: 150, aluminum: 115, wood: 250 },
    "insulated": { steel: 195, aluminum: 155, wood: 300 },
    "with-windows": { steel: 185, aluminum: 145, wood: 290 },
  },
  "16x8": {
    "non-insulated": { steel: 175, aluminum: 135, wood: 290 },
    "insulated": { steel: 225, aluminum: 180, wood: 350 },
    "with-windows": { steel: 215, aluminum: 170, wood: 335 },
  },
  "18x7": {
    "non-insulated": { steel: 175, aluminum: 135, wood: 285 },
    "insulated": { steel: 225, aluminum: 180, wood: 345 },
    "with-windows": { steel: 215, aluminum: 170, wood: 330 },
  },
  "18x8": {
    "non-insulated": { steel: 200, aluminum: 155, wood: 330 },
    "insulated": { steel: 260, aluminum: 210, wood: 400 },
    "with-windows": { steel: 250, aluminum: 195, wood: 385 },
  },
};

// FAQ data
const faqs = [
  {
    question: "How do I know what size garage door spring I need?",
    answer: "To determine the correct spring size, you need three key measurements: your door's weight, the spring's wire size (measured by counting 10 or 20 coils), and the inside diameter (typically 1¾\" or 2\" for residential doors). The door weight is the most critical factor - you can weigh your door using a bathroom scale by lifting it slightly off the ground. Our calculator uses these inputs to recommend the correct spring specifications."
  },
  {
    question: "What size spring for a 16x7 garage door?",
    answer: "A 16x7 garage door typically weighs between 150-225 lbs depending on material and insulation. Non-insulated steel doors average 150 lbs, while insulated doors with windows can reach 200+ lbs. For a 175 lb door, you'd typically need either one .243 x 2\" x 30\" spring or a pair of .207 x 2\" x 27\" springs. Always weigh your specific door for accurate spring selection."
  },
  {
    question: "How to determine spring size from wire diameter?",
    answer: "Measure the wire size by counting 10 or 20 coils and measuring the total length with a tape measure. For 10 coils: divide measurement by 10. For example, if 10 coils measure 2.5 inches, your wire size is .250\". Our wire size chart shows common measurements - 20 coil measurements are more accurate as they reduce margin of error."
  },
  {
    question: "How to calculate garage door spring turns?",
    answer: "The formula for standard lift doors is: Turns = (Door Height in inches ÷ Drum Circumference) + 1. For most 4\" drums with 12.75\" circumference, a 7' door needs about 7.5 turns, and an 8' door needs about 8.5 turns. After initial winding, you may need to adjust ¼ turn at a time until the door balances properly at waist height."
  },
  {
    question: "What does IPPT mean for garage door springs?",
    answer: "IPPT stands for Inch Pounds Per Turn - it measures the spring's lifting power per revolution. A higher IPPT means more lift force. Your door requires a specific total IPPT based on its weight and drum size. When using two springs, their IPPT values combine. For example, two springs with 25 IPPT each provide 50 IPPT total."
  },
  {
    question: "Can I replace just one garage door spring?",
    answer: "While technically possible, replacing both springs simultaneously is strongly recommended. Springs wear evenly, so if one breaks, the other is likely near failure. Using mismatched springs (one new, one worn) causes uneven tension, leading to poor door balance, accelerated wear on the new spring, and potential safety hazards."
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

export default function GarageDoorSpringSizeCalculator() {
  const [activeTab, setActiveTab] = useState<'find' | 'verify' | 'chart'>('find');

  // Tab 1: Find Spring by Door
  const [doorSize, setDoorSize] = useState<string>("16x7");
  const [doorType, setDoorType] = useState<string>("insulated");
  const [doorMaterial, setDoorMaterial] = useState<string>("steel");
  const [useCustomWeight, setUseCustomWeight] = useState<boolean>(false);
  const [customWeight, setCustomWeight] = useState<string>("");
  const [insideDiameter, setInsideDiameter] = useState<string>("2");
  const [springSystem, setSpringSystem] = useState<string>("double");
  const [doorHeight, setDoorHeight] = useState<string>("7");

  // Tab 2: Verify Existing Spring
  const [verifyWireSize, setVerifyWireSize] = useState<string>("0.218");
  const [verifyLength, setVerifyLength] = useState<string>("27");
  const [verifyID, setVerifyID] = useState<string>("2");
  const [verifyDoorHeight, setVerifyDoorHeight] = useState<string>("7");
  const [verifyDoorWeight, setVerifyDoorWeight] = useState<string>("175");

  // Tab 1 Calculations - Find Spring
  const findResults = useMemo(() => {
    let doorWeight = 0;
    
    if (useCustomWeight && customWeight) {
      doorWeight = parseFloat(customWeight) || 0;
    } else {
      const sizeData = doorWeightEstimates[doorSize];
      if (sizeData && sizeData[doorType] && sizeData[doorType][doorMaterial]) {
        doorWeight = sizeData[doorType][doorMaterial];
      }
    }

    // Find matching spring recommendation
    const recommendation = springRecommendations.find(
      r => doorWeight >= r.minWeight && doorWeight <= r.maxWeight
    );

    // Calculate turns needed
    const heightInches = parseFloat(doorHeight) * 12;
    const drumCircumference = 12.75; // Standard 4" drum
    const turnsNeeded = Math.round((heightInches / drumCircumference + 1) * 4) / 4;

    // Calculate required IPPT
    const hiMomentArm = 2; // Standard for residential
    const requiredIPPT = (doorWeight * hiMomentArm) / turnsNeeded;

    return {
      doorWeight,
      recommendation,
      turnsNeeded,
      requiredIPPT: Math.round(requiredIPPT * 10) / 10,
      springSystem,
      insideDiameter
    };
  }, [doorSize, doorType, doorMaterial, useCustomWeight, customWeight, doorHeight, springSystem, insideDiameter]);

  // Tab 2 Calculations - Verify Spring
  const verifyResults = useMemo(() => {
    const wireSize = parseFloat(verifyWireSize) || 0;
    const length = parseFloat(verifyLength) || 0;
    const id = parseFloat(verifyID) || 2;
    const doorHeightVal = parseFloat(verifyDoorHeight) || 7;
    const doorWeight = parseFloat(verifyDoorWeight) || 0;

    // Calculate IPPT using simplified formula
    // IPPT formula: industry standard approximation
    // IPPT ≈ (wire^4 × 405000 × length) / (mean_diameter^2)
    const meanDiameter = id + wireSize;
    const springIPPT = (Math.pow(wireSize, 4) * 405000 * length) / Math.pow(meanDiameter, 2);
    
    // Calculate turns needed
    const heightInches = doorHeightVal * 12;
    const drumCircumference = 12.75;
    const turnsNeeded = (heightInches / drumCircumference) + 1;

    // Calculate max turns for spring (simplified: length / wire size - 2)
    const maxTurns = Math.floor(length / wireSize) - 2;

    // Calculate weight capacity (for two springs): multiply spring IPPT by 2, then divide by 2 when combining, net effect equals IPPT × turns
    const weightCapacity = (springIPPT * 2 * turnsNeeded) / 2;

    // Check if spring is adequate
    const isAdequate = weightCapacity >= doorWeight * 0.95 && weightCapacity <= doorWeight * 1.1;
    const isTooWeak = weightCapacity < doorWeight * 0.95;
    const isTooStrong = weightCapacity > doorWeight * 1.1;

    return {
      springIPPT: Math.round(springIPPT * 10) / 10,
      turnsNeeded: Math.round(turnsNeeded * 4) / 4,
      maxTurns,
      weightCapacity: Math.round(weightCapacity),
      doorWeight,
      isAdequate,
      isTooWeak,
      isTooStrong,
      wireSize,
      length,
      id
    };
  }, [verifyWireSize, verifyLength, verifyID, verifyDoorHeight, verifyDoorWeight]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Safety Warning Banner */}
      <div style={{ backgroundColor: "#DC2626", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          <p style={{ color: "white", margin: 0, fontSize: "0.9rem", fontWeight: "500" }}>
            <strong>DANGER:</strong> Garage door springs are under extreme tension and can cause serious injury or death. 
            Professional installation is strongly recommended.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Garage Door Spring Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🔧</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Garage Door Spring Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator to find the right torsion spring size for your garage door. Enter your door weight 
            or use our estimator, verify existing springs, and get accurate specifications. No signup required.
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
                Spring size depends on <strong>door weight</strong>, not just door dimensions
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                A 16x7 door can weigh 150-225 lbs depending on material &amp; insulation. Always weigh your door for accurate results.
              </p>
            </div>
          </div>
        </div>

        {/* Features Badge */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#FEF3C7",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #FCD34D"
          }}>
            <span>✓</span>
            <span style={{ color: "#92400E", fontWeight: "600", fontSize: "0.85rem" }}>Weight Estimator</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#ECFDF5",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #6EE7B7"
          }}>
            <span>✓</span>
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>Spring Verification</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EEF2FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #C7D2FE"
          }}>
            <span>✓</span>
            <span style={{ color: "#4338CA", fontWeight: "600", fontSize: "0.85rem" }}>Wire Size Chart</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("find")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "find" ? "#D97706" : "#E5E7EB",
              color: activeTab === "find" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔍 Find Spring Size
          </button>
          <button
            onClick={() => setActiveTab("verify")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "verify" ? "#D97706" : "#E5E7EB",
              color: activeTab === "verify" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            ✅ Verify Spring
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "chart" ? "#D97706" : "#E5E7EB",
              color: activeTab === "chart" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Wire Size Chart
          </button>
        </div>

        {/* Tab 1: Find Spring Size */}
        {activeTab === "find" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔍 Door Information
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Door Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Door Size (Width x Height)
                  </label>
                  <select
                    value={doorSize}
                    onChange={(e) => setDoorSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #D97706",
                      fontSize: "1rem",
                      backgroundColor: "#FEF3C7",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    <option value="8x7">8&apos; x 7&apos; (Single Car)</option>
                    <option value="9x7">9&apos; x 7&apos; (Single Car)</option>
                    <option value="10x7">10&apos; x 7&apos; (Single Car)</option>
                    <option value="16x7">16&apos; x 7&apos; (Double Car)</option>
                    <option value="16x8">16&apos; x 8&apos; (Double Car)</option>
                    <option value="18x7">18&apos; x 7&apos; (Double Car)</option>
                    <option value="18x8">18&apos; x 8&apos; (Double Car)</option>
                  </select>
                </div>

                {/* Door Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Door Type
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { value: "non-insulated", label: "Non-Insulated" },
                      { value: "insulated", label: "Insulated" },
                      { value: "with-windows", label: "With Windows" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDoorType(opt.value)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: doorType === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: doorType === opt.value ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: doorType === opt.value ? "600" : "normal",
                          fontSize: "0.9rem"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Door Material */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Door Material
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { value: "steel", label: "Steel" },
                      { value: "aluminum", label: "Aluminum" },
                      { value: "wood", label: "Wood" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDoorMaterial(opt.value)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: doorMaterial === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: doorMaterial === opt.value ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: doorMaterial === opt.value ? "600" : "normal",
                          fontSize: "0.9rem"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Weight Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={useCustomWeight}
                      onChange={(e) => setUseCustomWeight(e.target.checked)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                      I know my door&apos;s exact weight
                    </span>
                  </label>
                </div>

                {/* Custom Weight Input */}
                {useCustomWeight && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Door Weight (lbs)
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type="number"
                        value={customWeight}
                        onChange={(e) => setCustomWeight(e.target.value)}
                        placeholder="e.g., 175"
                        style={{
                          width: "100%",
                          padding: "12px",
                          paddingRight: "50px",
                          borderRadius: "8px",
                          border: "2px solid #059669",
                          fontSize: "1rem",
                          backgroundColor: "#ECFDF5",
                          boxSizing: "border-box"
                        }}
                      />
                      <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>lbs</span>
                    </div>
                  </div>
                )}

                {/* Door Height */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Door Height (feet)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["7", "8"].map((h) => (
                      <button
                        key={h}
                        onClick={() => setDoorHeight(h)}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          border: doorHeight === h ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: doorHeight === h ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: doorHeight === h ? "600" : "normal"
                        }}
                      >
                        {h}&apos; ft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spring System */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Spring System
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: "single", label: "Single Spring" },
                      { value: "double", label: "Double Spring" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSpringSystem(opt.value)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: springSystem === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: springSystem === opt.value ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: springSystem === opt.value ? "600" : "normal",
                          fontSize: "0.9rem"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Most 16&apos;+ doors use double springs for better balance
                  </p>
                </div>

                {/* Inside Diameter */}
                <div>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Inside Diameter (ID)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: "1.75", label: "1¾\"" },
                      { value: "2", label: "2\"" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setInsideDiameter(opt.value)}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          border: insideDiameter === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: insideDiameter === opt.value ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: insideDiameter === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Check the cone markings: P175 = 1¾&quot;, P200 = 2&quot;
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Recommended Spring Size
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Door Weight Display */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                    {useCustomWeight ? "Your Door Weight" : "Estimated Door Weight"}
                  </p>
                  <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#D97706" }}>
                    {findResults.doorWeight} lbs
                  </p>
                </div>

                {/* Spring Recommendation */}
                {findResults.recommendation ? (
                  <>
                    <div style={{
                      backgroundColor: "#ECFDF5",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "20px",
                      border: "1px solid #6EE7B7"
                    }}>
                      <p style={{ margin: "0 0 12px 0", fontSize: "0.9rem", color: "#065F46", fontWeight: "600" }}>
                        🎯 Recommended Spring
                      </p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669", fontFamily: "monospace" }}>
                        {springSystem === "single" 
                          ? (findResults.recommendation.singleSpring || "Use double spring system")
                          : findResults.recommendation.doubleSpring
                        }
                      </p>
                      {springSystem === "single" && !findResults.recommendation.singleSpring && (
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>
                          ⚠️ Door too heavy for single spring. Double springs recommended.
                        </p>
                      )}
                    </div>

                    {/* Specifications */}
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                        📋 Specifications
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Inside Diameter (ID)</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{findResults.insideDiameter}&quot;</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Required IPPT</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>~{findResults.recommendation.ippt}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Turns to Wind</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{findResults.turnsNeeded} turns</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Spring System</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>
                            {springSystem === "single" ? "Single Torsion" : "Dual Torsion"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      backgroundColor: "#EEF2FF",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      border: "1px solid #C7D2FE",
                      marginBottom: "20px"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                        ℹ️ <strong>ID Note:</strong> Most residential torsion springs use <strong>2&quot; inside diameter (ID)</strong>. 
                        <span style={{ marginLeft: "4px" }}>1¾&quot; ID is also common.</span> If unsure, choose 2&quot; and verify in the <em>Verify Existing Spring</em> tab.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{
                    backgroundColor: "#FEF2F2",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #FECACA",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, color: "#991B1B", fontWeight: "600" }}>
                      ⚠️ Door weight out of standard range
                    </p>
                    <p style={{ margin: "8px 0 0 0", color: "#B91C1C", fontSize: "0.9rem" }}>
                      Please enter a weight between 80-400 lbs or consult a professional.
                    </p>
                  </div>
                )}

                {/* How to Measure Weight */}
                <div style={{
                  backgroundColor: "#EEF2FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C7D2FE"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#4338CA", fontWeight: "600" }}>
                    📏 How to Weigh Your Door
                  </p>
                  <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.8rem", color: "#6366F1", lineHeight: "1.6" }}>
                    <li>Disconnect opener and release springs</li>
                    <li>Lift door 2-3 inches off the ground</li>
                    <li>Slide bathroom scale under center</li>
                    <li>Lower door gently onto scale</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Verify Existing Spring */}
        {activeTab === "verify" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  ✅ Enter Spring Measurements
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Wire Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Wire Size (diameter in inches)
                  </label>
                  <select
                    value={verifyWireSize}
                    onChange={(e) => setVerifyWireSize(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #D97706",
                      fontSize: "1rem",
                      backgroundColor: "#FEF3C7",
                      boxSizing: "border-box",
                      cursor: "pointer"
                    }}
                  >
                    <option value="0.177">.177 (10 coils ≈ 1¾&quot;)</option>
                    <option value="0.192">.192 (10 coils ≈ 1 15/16&quot;)</option>
                    <option value="0.207">.207 (10 coils ≈ 2 1/16&quot;)</option>
                    <option value="0.218">.218 (10 coils ≈ 2 3/16&quot;)</option>
                    <option value="0.225">.225 (10 coils ≈ 2 5/16&quot;)</option>
                    <option value="0.234">.234 (10 coils ≈ 2 3/8&quot;)</option>
                    <option value="0.243">.243 (10 coils ≈ 2 7/16&quot;)</option>
                    <option value="0.250">.250 (10 coils ≈ 2½&quot;)</option>
                    <option value="0.262">.262 (10 coils ≈ 2 5/8&quot;)</option>
                    <option value="0.273">.273 (10 coils ≈ 2¾&quot;)</option>
                    <option value="0.283">.283 (10 coils ≈ 2 13/16&quot;)</option>
                    <option value="0.295">.295 (10 coils ≈ 3&quot;)</option>
                  </select>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Use the Wire Size Chart tab to find this from measurements
                  </p>
                </div>

                {/* Spring Length */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Spring Length (inches)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={verifyLength}
                      onChange={(e) => setVerifyLength(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>in</span>
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Measure coil length only, not including cones
                  </p>
                </div>

                {/* Inside Diameter */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Inside Diameter (ID)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: "1.75", label: "1¾\"" },
                      { value: "2", label: "2\"" },
                      { value: "2.625", label: "2⅝\"" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setVerifyID(opt.value)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: verifyID === opt.value ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: verifyID === opt.value ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: verifyID === opt.value ? "600" : "normal"
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Door Height */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Door Height (feet)
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {["7", "8"].map((h) => (
                      <button
                        key={h}
                        onClick={() => setVerifyDoorHeight(h)}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          border: verifyDoorHeight === h ? "2px solid #D97706" : "1px solid #E5E7EB",
                          backgroundColor: verifyDoorHeight === h ? "#FEF3C7" : "white",
                          cursor: "pointer",
                          fontWeight: verifyDoorHeight === h ? "600" : "normal"
                        }}
                      >
                        {h}&apos; ft
                      </button>
                    ))}
                  </div>
                </div>

                {/* Door Weight */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid #6EE7B7"
                }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#065F46", marginBottom: "8px", fontWeight: "600" }}>
                    Your Door Weight (lbs)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={verifyDoorWeight}
                      onChange={(e) => setVerifyDoorWeight(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "50px",
                        borderRadius: "8px",
                        border: "2px solid #059669",
                        fontSize: "1rem",
                        backgroundColor: "white",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>lbs</span>
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
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Verification Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Status Banner */}
                <div style={{
                  backgroundColor: verifyResults.isAdequate ? "#ECFDF5" : verifyResults.isTooWeak ? "#FEF2F2" : "#FEF3C7",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: verifyResults.isAdequate ? "2px solid #6EE7B7" : verifyResults.isTooWeak ? "2px solid #FECACA" : "2px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "2rem" }}>
                    {verifyResults.isAdequate ? "✅" : verifyResults.isTooWeak ? "❌" : "⚠️"}
                  </p>
                  <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: verifyResults.isAdequate ? "#059669" : verifyResults.isTooWeak ? "#DC2626" : "#D97706" }}>
                    {verifyResults.isAdequate 
                      ? "Spring Size is Correct" 
                      : verifyResults.isTooWeak 
                        ? "Spring is Too Weak" 
                        : "Spring is Too Strong"}
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: verifyResults.isAdequate ? "#047857" : verifyResults.isTooWeak ? "#B91C1C" : "#B45309" }}>
                    {verifyResults.isAdequate 
                      ? "This spring pair should properly balance your door"
                      : verifyResults.isTooWeak 
                        ? "Door will be too heavy, may cause opener strain"
                        : "Door may fly up, increased wear risk"}
                  </p>
                </div>

                {/* Comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#6B7280" }}>Your Door Weight</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
                      {verifyResults.doorWeight} lbs
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: verifyResults.isAdequate ? "#ECFDF5" : "#FEF3C7",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: verifyResults.isAdequate ? "#065F46" : "#92400E" }}>Spring Capacity (pair)</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: verifyResults.isAdequate ? "#059669" : "#D97706" }}>
                      ~{verifyResults.weightCapacity} lbs
                    </p>
                  </div>
                </div>

                {/* Spring Analysis */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📋 Spring Analysis
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Spring Specification</span>
                      <span style={{ fontWeight: "600", color: "#111827", fontFamily: "monospace" }}>
                        .{(verifyResults.wireSize * 1000).toFixed(0)} x {verifyResults.id}&quot; x {verifyResults.length}&quot;
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>IPPT (per spring)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{verifyResults.springIPPT}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Recommended Turns</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{verifyResults.turnsNeeded}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Max Safe Turns</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{verifyResults.maxTurns}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {!verifyResults.isAdequate && (
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                      💡 <strong>Recommendation:</strong> Use the &quot;Find Spring Size&quot; tab with your door weight to get the correct spring specifications.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Wire Size Chart */}
        {activeTab === "chart" && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            marginBottom: "24px"
          }}>
            <div style={{ backgroundColor: "#D97706", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📊 Wire Size Measurement Chart
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Instructions */}
              <div style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
                border: "1px solid #FCD34D"
              }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1rem", color: "#92400E", fontWeight: "600" }}>
                  📏 How to Measure Wire Size
                </h3>
                <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                  <li>Place a tape measure at the edge of one coil</li>
                  <li>Count 10 coils (or 20 for more accuracy)</li>
                  <li>Measure to the nearest 1/16&quot;</li>
                  <li>Find your measurement in the chart below</li>
                </ol>
              </div>

              {/* Wire Size Chart Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>10 Coils</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>20 Coils</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600", backgroundColor: "#ECFDF5", color: "#065F46" }}>Wire Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wireSizeChart.map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>{row.coils10}&quot;</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>{row.coils20}&quot;</td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#059669", fontFamily: "monospace" }}>.{(row.wireSize * 1000).toFixed(0).padStart(3, '0')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tips */}
              <div style={{
                backgroundColor: "#EEF2FF",
                borderRadius: "8px",
                padding: "12px 16px",
                marginTop: "20px",
                border: "1px solid #C7D2FE"
              }}>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                  💡 <strong>Pro Tip:</strong> Always measure both 10 and 20 coils. If they don&apos;t match on the chart, 
                  there may be gaps between coils (spring is still wound) or the spring has an uncommon wire size.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🔧 Understanding Garage Door Torsion Springs</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Torsion springs</strong> are the most common type of garage door springs, mounted horizontally 
                  above the door opening. They work by storing mechanical energy through twisting (torsion) - when you 
                  close the door, the springs wind up; when you open it, they unwind and release energy to help lift the door.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Spring Measurements Explained</h3>
                <p>
                  Every torsion spring is defined by three critical measurements: <strong>wire size</strong> (thickness of the wire), 
                  <strong>inside diameter</strong> (ID - the hole in the center), and <strong>length</strong> (total coil length). 
                  These are typically written as &quot;.218 x 2&quot; x 27&quot;&quot; meaning .218&quot; wire, 2&quot; ID, 27&quot; long.
                </p>

                <div style={{
                  backgroundColor: "#FEF3C7",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#92400E" }}>⚠️ Why Door Weight Matters Most</p>
                  <p style={{ margin: 0, color: "#B45309", fontSize: "0.95rem" }}>
                    Two 16x7 doors can have vastly different weights. A basic steel door might weigh 150 lbs, while an 
                    insulated door with windows could exceed 220 lbs. The spring must match the <em>weight</em>, not just 
                    the size. Using incorrect springs leads to: premature spring failure, unbalanced door, opener damage, 
                    and safety hazards.
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Single vs. Double Spring Systems</h3>
                <p>
                  Smaller doors (8&apos;-10&apos; wide) often use a single torsion spring. Larger double-car doors (16&apos;+) 
                  typically use two springs for better balance and safety. With dual springs, if one breaks, the other 
                  provides some support, preventing the door from crashing down. Dual systems also provide smoother operation 
                  and longer spring life.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Spring Cycle Life</h3>
                <p>
                  Springs are rated by &quot;cycles&quot; - one cycle equals one complete open and close. Standard springs are 
                  rated for 10,000 cycles (about 7-10 years of typical use). High-cycle springs (25,000-50,000 cycles) 
                  cost more but last significantly longer. If you open your garage door 4+ times daily, consider 
                  upgrading to high-cycle springs.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Safety Warning */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "2px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Safety Warning</h3>
              <div style={{ fontSize: "0.9rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}>
                  Torsion springs are under <strong>extreme tension</strong> and can cause serious injury or death.
                </p>
                <p style={{ margin: "0 0 12px 0" }}>• Never attempt to adjust wound springs</p>
                <p style={{ margin: "0 0 12px 0" }}>• Keep fingers away from cones</p>
                <p style={{ margin: "0 0 12px 0" }}>• Use proper winding bars only</p>
                <p style={{ margin: 0 }}>• When in doubt, hire a professional</p>
              </div>
            </div>

            {/* Common Door Weights */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>📊 Typical Door Weights</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>8x7 Steel:</strong> 75-95 lbs</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>9x7 Insulated:</strong> 110-130 lbs</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>16x7 Steel:</strong> 150-175 lbs</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>16x7 Insulated:</strong> 195-225 lbs</p>
                <p style={{ margin: 0 }}><strong>16x7 Wood:</strong> 250-300 lbs</p>
              </div>
            </div>

            {/* Standard IDs */}
            <div style={{ backgroundColor: "#EEF2FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C7D2FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#4338CA", marginBottom: "12px" }}>📏 Inside Diameters</h3>
              <div style={{ fontSize: "0.85rem", color: "#6366F1", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>1¾&quot; (P175):</strong> Common residential</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>2&quot; (P200):</strong> Most common</p>
                <p style={{ margin: 0 }}><strong>2⅝&quot;:</strong> Heavy doors / commercial</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/garage-door-spring-size-calculator" currentCategory="Auto" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#991B1B", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Garage door springs are extremely dangerous and can cause serious injury or death. Actual spring requirements 
            may vary based on door construction, track configuration, and other factors. Always verify measurements 
            and consult with a qualified garage door professional before purchasing or installing springs. 
            This is not professional advice and should not be used as a substitute for expert consultation.
          </p>
        </div>
      </div>
    </div>
  );
}
