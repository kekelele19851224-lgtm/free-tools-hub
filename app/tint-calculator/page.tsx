"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// State tint laws data
const stateLaws: Record<string, { name: string; front: number; back: number; rear: number; windshield: string; notes: string }> = {
  "AL": { name: "Alabama", front: 32, back: 32, rear: 32, windshield: "AS-1 line", notes: "Non-reflective tint above AS-1 line" },
  "AK": { name: "Alaska", front: 70, back: 40, rear: 40, windshield: "AS-1 line", notes: "5 inches allowed on windshield" },
  "AZ": { name: "Arizona", front: 33, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "AR": { name: "Arkansas", front: 25, back: 25, rear: 10, windshield: "AS-1 line", notes: "10% allowed on rear if dual mirrors" },
  "CA": { name: "California", front: 70, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "CO": { name: "Colorado", front: 27, back: 27, rear: 27, windshield: "AS-1 line", notes: "4 inches allowed on windshield" },
  "CT": { name: "Connecticut", front: 35, back: 35, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear window" },
  "DE": { name: "Delaware", front: 70, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "FL": { name: "Florida", front: 28, back: 15, rear: 15, windshield: "AS-1 line", notes: "Non-reflective allowed above AS-1" },
  "GA": { name: "Georgia", front: 32, back: 32, rear: 32, windshield: "AS-1 line", notes: "6 inches allowed on windshield" },
  "HI": { name: "Hawaii", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "70% on windshield except AS-1" },
  "ID": { name: "Idaho", front: 35, back: 20, rear: 35, windshield: "AS-1 line", notes: "Non-reflective allowed" },
  "IL": { name: "Illinois", front: 35, back: 35, rear: 35, windshield: "6 inches", notes: "6 inches non-reflective allowed" },
  "IN": { name: "Indiana", front: 30, back: 30, rear: 30, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "IA": { name: "Iowa", front: 70, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "KS": { name: "Kansas", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "KY": { name: "Kentucky", front: 35, back: 18, rear: 18, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "LA": { name: "Louisiana", front: 40, back: 25, rear: 12, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "ME": { name: "Maine", front: 35, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "MD": { name: "Maryland", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "MA": { name: "Massachusetts", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "MI": { name: "Michigan", front: 0, back: 0, rear: 0, windshield: "4 inches", notes: "Any darkness, 4 inches on windshield" },
  "MN": { name: "Minnesota", front: 50, back: 50, rear: 50, windshield: "None", notes: "No windshield tint allowed" },
  "MS": { name: "Mississippi", front: 28, back: 28, rear: 28, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "MO": { name: "Missouri", front: 35, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "MT": { name: "Montana", front: 24, back: 14, rear: 14, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "NE": { name: "Nebraska", front: 35, back: 20, rear: 20, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "NV": { name: "Nevada", front: 35, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "NH": { name: "New Hampshire", front: 70, back: 35, rear: 35, windshield: "None", notes: "No windshield tint allowed" },
  "NJ": { name: "New Jersey", front: 0, back: 0, rear: 0, windshield: "None", notes: "No tint on front, any on rear" },
  "NM": { name: "New Mexico", front: 20, back: 20, rear: 20, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "NY": { name: "New York", front: 70, back: 70, rear: 0, windshield: "6 inches", notes: "Any darkness on rear window" },
  "NC": { name: "North Carolina", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "ND": { name: "North Dakota", front: 50, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "OH": { name: "Ohio", front: 50, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "OK": { name: "Oklahoma", front: 25, back: 25, rear: 25, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "OR": { name: "Oregon", front: 35, back: 35, rear: 35, windshield: "6 inches", notes: "6 inches allowed on windshield" },
  "PA": { name: "Pennsylvania", front: 70, back: 70, rear: 70, windshield: "None", notes: "No windshield tint allowed" },
  "RI": { name: "Rhode Island", front: 70, back: 70, rear: 70, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "SC": { name: "South Carolina", front: 27, back: 27, rear: 27, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "SD": { name: "South Dakota", front: 35, back: 20, rear: 20, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "TN": { name: "Tennessee", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "TX": { name: "Texas", front: 25, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "UT": { name: "Utah", front: 43, back: 0, rear: 0, windshield: "AS-1 line", notes: "Any darkness on rear windows" },
  "VT": { name: "Vermont", front: 0, back: 0, rear: 32, windshield: "AS-1 line", notes: "No tint on front side windows" },
  "VA": { name: "Virginia", front: 50, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "WA": { name: "Washington", front: 24, back: 24, rear: 24, windshield: "6 inches", notes: "6 inches allowed on windshield" },
  "WV": { name: "West Virginia", front: 35, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "WI": { name: "Wisconsin", front: 50, back: 35, rear: 35, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "WY": { name: "Wyoming", front: 28, back: 28, rear: 28, windshield: "AS-1 line", notes: "Non-reflective above AS-1" },
  "DC": { name: "Washington D.C.", front: 70, back: 50, rear: 50, windshield: "AS-1 line", notes: "Non-reflective above AS-1" }
};

// Film types with pricing
const filmTypes = {
  "dyed": { name: "Dyed Film", description: "Budget-friendly, basic heat & glare reduction", sedan: [150, 250], suv: [200, 300], truck: [180, 280] },
  "metalized": { name: "Metalized Film", description: "Reflects heat, adds window strength", sedan: [200, 350], suv: [250, 400], truck: [220, 380] },
  "carbon": { name: "Carbon Film", description: "Fade-resistant, good UV blocking", sedan: [300, 450], suv: [350, 500], truck: [320, 480] },
  "ceramic": { name: "Ceramic Film", description: "Best heat rejection, UV protection, durability", sedan: [400, 800], suv: [500, 1000], truck: [450, 900] }
};

// Glass types
const glassTypes = [
  { value: 90, label: "Clear Glass (90%)" },
  { value: 80, label: "Standard Clear (80%)" },
  { value: 75, label: "Lightly Tinted Factory (75%)" },
  { value: 70, label: "Factory Tinted (70%)" },
  { value: 20, label: "Privacy Glass - Rear (20%)" },
  { value: 15, label: "Dark Privacy Glass (15%)" }
];

// Common tint levels
const tintLevels = [
  { value: 70, label: "70% - Near Clear" },
  { value: 50, label: "50% - Light" },
  { value: 35, label: "35% - Medium" },
  { value: 20, label: "20% - Dark" },
  { value: 15, label: "15% - Very Dark" },
  { value: 5, label: "5% - Limo Tint" }
];

// FAQ data
const faqs = [
  {
    question: "What percent tint is 50 over 20?",
    answer: "When you apply 50% tint film over 20% existing tint (or privacy glass), the final VLT is: 50% × 20% = 10%. This means only 10% of visible light passes through. If you also have factory glass at 80%, the calculation is: 50% × 20% × 80% = 8% final VLT. This would be very dark and likely illegal on front windows in most states."
  },
  {
    question: "What percent tint is 15 over 20?",
    answer: "Applying 15% tint over 20% existing tint results in: 15% × 20% = 3% final VLT. With 80% factory glass: 15% × 20% × 80% = 2.4% VLT. This is extremely dark (nearly limo-black) and illegal on all windows except possibly rear windows in some states. It would significantly impair night driving visibility."
  },
  {
    question: "How do I calculate window tint percentage?",
    answer: "To calculate final tint percentage (VLT), multiply the film VLT by the glass VLT, then divide by 100. Formula: Final VLT = (Film VLT × Glass VLT) ÷ 100. For example, 35% tint on 80% factory glass: (35 × 80) ÷ 100 = 28% final VLT. For multiple layers, multiply all VLT values together as decimals, then multiply by 100."
  },
  {
    question: "What is the darkest legal tint?",
    answer: "The darkest legal tint varies by state and window position. For front side windows, limits range from 70% VLT (California, New York) to 20% VLT (New Mexico). Many states allow any darkness on rear windows. The darkest commonly legal front tint is around 20-25% in states like Texas (25%) and New Mexico (20%). Always check your specific state laws."
  },
  {
    question: "How much does car window tinting cost?",
    answer: "Car window tinting costs $150-$800+ depending on film type and vehicle size. Dyed film: $150-$300, Carbon film: $300-$500, Ceramic film: $400-$1,000+. SUVs and trucks cost more due to larger windows. Professional installation is recommended—DIY saves money but risks bubbles, peeling, and uneven application."
  },
  {
    question: "What is the difference between 20% and 35% tint?",
    answer: "20% tint allows 20% of light through (blocks 80%), appearing quite dark with limited visibility from outside. 35% tint allows 35% light through (blocks 65%), appearing medium-dark with moderate visibility. 35% is legal in more states for front windows. 20% provides more privacy and heat rejection but may impair night driving and is often illegal on front windows."
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

// VLT Visual indicator
function VLTVisual({ vlt }: { vlt: number }) {
  const opacity = 1 - (vlt / 100);
  return (
    <div style={{ position: "relative", width: "100%", height: "80px", borderRadius: "8px", overflow: "hidden", border: "2px solid #374151" }}>
      {/* Sky/background */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #87CEEB, #E0F4FF)" }} />
      {/* Tint overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0, 0, 0, ${opacity})` }} />
      {/* Labels */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: vlt < 30 ? "white" : "#1F2937", fontWeight: "bold", fontSize: "1.25rem", textShadow: vlt < 30 ? "0 1px 2px rgba(0,0,0,0.5)" : "none" }}>
          {vlt}% VLT
        </span>
      </div>
    </div>
  );
}

export default function TintCalculator() {
  const [activeTab, setActiveTab] = useState<"vlt" | "laws" | "cost">("vlt");
  
  // Tab 1: VLT Calculator State
  const [glassVLT, setGlassVLT] = useState<string>("80");
  const [filmVLT, setFilmVLT] = useState<string>("35");
  const [addSecondLayer, setAddSecondLayer] = useState<boolean>(false);
  const [secondFilmVLT, setSecondFilmVLT] = useState<string>("50");
  const [selectedState, setSelectedState] = useState<string>("TX");
  
  // Tab 2: State Laws State
  const [lawState, setLawState] = useState<string>("CA");
  
  // Tab 3: Cost Estimator State
  const [vehicleType, setVehicleType] = useState<string>("sedan");
  const [filmType, setFilmType] = useState<string>("carbon");
  const [coverage, setCoverage] = useState<string>("full");
  const [includeWindshield, setIncludeWindshield] = useState<boolean>(false);

  // VLT Calculations
  const glass = parseFloat(glassVLT) || 80;
  const film1 = parseFloat(filmVLT) || 35;
  const film2 = parseFloat(secondFilmVLT) || 50;
  
  let finalVLT: number;
  if (addSecondLayer) {
    finalVLT = (glass / 100) * (film1 / 100) * (film2 / 100) * 100;
  } else {
    finalVLT = (glass / 100) * (film1 / 100) * 100;
  }
  finalVLT = Math.round(finalVLT * 10) / 10;
  
  // Check legality
  const stateData = stateLaws[selectedState];
  const frontLegal = stateData.front === 0 || finalVLT >= stateData.front;
  const backLegal = stateData.back === 0 || finalVLT >= stateData.back;
  const rearLegal = stateData.rear === 0 || finalVLT >= stateData.rear;

  // Cost Calculations
  const filmData = filmTypes[filmType as keyof typeof filmTypes];
  const vehiclePrices = filmData[vehicleType as keyof typeof filmData] as number[];
  let costMin = vehiclePrices[0];
  let costMax = vehiclePrices[1];
  
  if (coverage === "front") {
    costMin = Math.round(costMin * 0.4);
    costMax = Math.round(costMax * 0.4);
  } else if (coverage === "rear") {
    costMin = Math.round(costMin * 0.6);
    costMax = Math.round(costMax * 0.6);
  }
  
  if (includeWindshield) {
    costMin += 100;
    costMax += 200;
  }

  const tabs = [
    { id: "vlt", label: "VLT Calculator", icon: "🔢" },
    { id: "laws", label: "State Laws", icon: "📋" },
    { id: "cost", label: "Cost Estimator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Window Tint Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚗</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Window Tint Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your final window tint percentage (VLT), check state laws for legality, 
            and estimate tinting costs. Works for cars, SUVs, and trucks.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#1E3A5F",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          color: "white"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", margin: "0 0 8px 0" }}>VLT Formula</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.9rem", backgroundColor: "rgba(255,255,255,0.1)", padding: "10px 14px", borderRadius: "6px", display: "inline-block" }}>
                Final VLT = (Film VLT% × Glass VLT%) ÷ 100
              </div>
              <p style={{ fontSize: "0.85rem", margin: "10px 0 0 0", opacity: 0.9 }}>
                <strong>Example:</strong> 35% film on 80% glass = (35 × 80) ÷ 100 = <strong>28% VLT</strong>
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
                backgroundColor: activeTab === tab.id ? "#1E3A5F" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#1E3A5F", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "vlt" && "🔢 Tint Settings"}
                {activeTab === "laws" && "📋 Select State"}
                {activeTab === "cost" && "💰 Vehicle & Film"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "550px", overflowY: "auto" }}>
              {/* VLT CALCULATOR TAB */}
              {activeTab === "vlt" && (
                <>
                  {/* Original Glass VLT */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Original Glass VLT (%)
                    </label>
                    <select
                      value={glassVLT}
                      onChange={(e) => setGlassVLT(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {glassTypes.map((g) => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Most car windows are 70-80% VLT from factory
                    </p>
                  </div>

                  {/* Tint Film VLT */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Tint Film VLT (%)
                    </label>
                    <select
                      value={filmVLT}
                      onChange={(e) => setFilmVLT(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {tintLevels.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {[70, 50, 35, 20, 5].map((v) => (
                        <button
                          key={v}
                          onClick={() => setFilmVLT(v.toString())}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: filmVLT === v.toString() ? "2px solid #1E3A5F" : "1px solid #E5E7EB",
                            backgroundColor: filmVLT === v.toString() ? "#E0E7FF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {v}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add Second Layer */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: addSecondLayer ? "12px" : "0" }}>
                      <input
                        type="checkbox"
                        checked={addSecondLayer}
                        onChange={(e) => setAddSecondLayer(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                        Add Second Tint Layer (Double Tint)
                      </span>
                    </label>
                    {addSecondLayer && (
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>
                          Second Film VLT (%)
                        </label>
                        <select
                          value={secondFilmVLT}
                          onChange={(e) => setSecondFilmVLT(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.85rem" }}
                        >
                          {tintLevels.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Select State for Legality Check */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Check Legality in State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(stateLaws).map(([code, data]) => (
                        <option key={code} value={code}>{data.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* STATE LAWS TAB */}
              {activeTab === "laws" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Select Your State
                    </label>
                    <select
                      value={lawState}
                      onChange={(e) => setLawState(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(stateLaws).map(([code, data]) => (
                        <option key={code} value={code}>{data.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* VLT Explanation */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#92400E" }}>💡 Understanding VLT</p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#B45309", lineHeight: "1.6" }}>
                      VLT (Visible Light Transmission) is the percentage of light that passes through. 
                      <strong> Higher % = lighter tint</strong>, <strong>Lower % = darker tint</strong>. 
                      A 70% limit means your final tint must allow at least 70% light through.
                    </p>
                  </div>

                  {/* Common limits */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Common Limits</p>
                    <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                      <p style={{ margin: 0 }}>• <strong>5% (Limo):</strong> Very dark, usually rear only</p>
                      <p style={{ margin: 0 }}>• <strong>20-25%:</strong> Dark, common limit in TX, NM</p>
                      <p style={{ margin: 0 }}>• <strong>35%:</strong> Medium, most common limit</p>
                      <p style={{ margin: 0 }}>• <strong>50%:</strong> Light, common in OH, VA</p>
                      <p style={{ margin: 0 }}>• <strong>70%:</strong> Nearly clear, CA, NY front limit</p>
                    </div>
                  </div>
                </>
              )}

              {/* COST ESTIMATOR TAB */}
              {activeTab === "cost" && (
                <>
                  {/* Vehicle Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Vehicle Type
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { id: "sedan", label: "Sedan/Coupe", icon: "🚗" },
                        { id: "suv", label: "SUV/Van", icon: "🚙" },
                        { id: "truck", label: "Truck", icon: "🛻" }
                      ].map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setVehicleType(v.id)}
                          style={{
                            flex: 1,
                            padding: "12px 8px",
                            borderRadius: "8px",
                            border: vehicleType === v.id ? "2px solid #1E3A5F" : "1px solid #E5E7EB",
                            backgroundColor: vehicleType === v.id ? "#E0E7FF" : "white",
                            color: vehicleType === v.id ? "#1E3A5F" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            textAlign: "center"
                          }}
                        >
                          <span style={{ fontSize: "1.25rem", display: "block", marginBottom: "4px" }}>{v.icon}</span>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Film Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Film Type
                    </label>
                    {Object.entries(filmTypes).map(([key, value]) => (
                      <label
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "10px 12px",
                          marginBottom: "6px",
                          borderRadius: "8px",
                          border: filmType === key ? "2px solid #1E3A5F" : "1px solid #E5E7EB",
                          backgroundColor: filmType === key ? "#E0E7FF" : "white",
                          cursor: "pointer"
                        }}
                      >
                        <input
                          type="radio"
                          name="filmType"
                          value={key}
                          checked={filmType === key}
                          onChange={(e) => setFilmType(e.target.value)}
                          style={{ marginTop: "2px" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", fontSize: "0.85rem", color: "#111827" }}>{value.name}</p>
                          <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>{value.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Coverage */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Coverage
                    </label>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[
                        { id: "full", label: "Full Vehicle" },
                        { id: "front", label: "Front Only" },
                        { id: "rear", label: "Rear Only" }
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setCoverage(c.id)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: coverage === c.id ? "2px solid #1E3A5F" : "1px solid #E5E7EB",
                            backgroundColor: coverage === c.id ? "#E0E7FF" : "white",
                            color: "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Include Windshield */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={includeWindshield}
                        onChange={(e) => setIncludeWindshield(e.target.checked)}
                        style={{ width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                        Include Windshield Strip (+$100-$200)
                      </span>
                    </label>
                    <p style={{ margin: "4px 0 0 20px", fontSize: "0.7rem", color: "#6B7280" }}>
                      Note: Full windshield tint is illegal in most states
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
                {activeTab === "vlt" && "🎯 Final VLT Result"}
                {activeTab === "laws" && "📋 Legal Limits"}
                {activeTab === "cost" && "💵 Cost Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* VLT RESULTS */}
              {activeTab === "vlt" && (
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
                      Final Tint Percentage
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {finalVLT}%
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Visible Light Transmission
                    </p>
                  </div>

                  {/* Visual Indicator */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                      Visual Preview
                    </p>
                    <VLTVisual vlt={finalVLT} />
                  </div>

                  {/* Calculation Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Calculation</h4>
                    <div style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>
                      {addSecondLayer ? (
                        <p style={{ margin: 0, color: "#4B5563" }}>
                          {glass}% × {film1}% × {film2}% = <strong>{finalVLT}%</strong>
                        </p>
                      ) : (
                        <p style={{ margin: 0, color: "#4B5563" }}>
                          {glass}% × {film1}% = <strong>{finalVLT}%</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Legality Check */}
                  <div style={{ backgroundColor: "#F9FAFB", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      Legality in {stateData.name}
                    </h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", borderRadius: "6px", backgroundColor: frontLegal ? "#ECFDF5" : "#FEF2F2" }}>
                        <span>Front Side Windows ({stateData.front === 0 ? "Any" : `${stateData.front}%+`})</span>
                        <span style={{ fontWeight: "bold", color: frontLegal ? "#059669" : "#DC2626" }}>
                          {frontLegal ? "✅ Legal" : "❌ Illegal"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "8px", borderRadius: "6px", backgroundColor: backLegal ? "#ECFDF5" : "#FEF2F2" }}>
                        <span>Back Side Windows ({stateData.back === 0 ? "Any" : `${stateData.back}%+`})</span>
                        <span style={{ fontWeight: "bold", color: backLegal ? "#059669" : "#DC2626" }}>
                          {backLegal ? "✅ Legal" : "❌ Illegal"}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderRadius: "6px", backgroundColor: rearLegal ? "#ECFDF5" : "#FEF2F2" }}>
                        <span>Rear Window ({stateData.rear === 0 ? "Any" : `${stateData.rear}%+`})</span>
                        <span style={{ fontWeight: "bold", color: rearLegal ? "#059669" : "#DC2626" }}>
                          {rearLegal ? "✅ Legal" : "❌ Illegal"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* STATE LAWS RESULTS */}
              {activeTab === "laws" && (
                <>
                  {/* State Info */}
                  <div style={{
                    backgroundColor: "#1E3A5F",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    color: "white",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", opacity: 0.8 }}>
                      Window Tint Laws
                    </p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold" }}>
                      {stateLaws[lawState].name}
                    </p>
                  </div>

                  {/* Legal Limits Table */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      Minimum VLT Requirements
                    </h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "10px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>🚗 Front Side Windows</span>
                        <span style={{ fontWeight: "bold", color: "#1E3A5F" }}>
                          {stateLaws[lawState].front === 0 ? "Any %" : `${stateLaws[lawState].front}%+`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "10px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>🚗 Back Side Windows</span>
                        <span style={{ fontWeight: "bold", color: "#1E3A5F" }}>
                          {stateLaws[lawState].back === 0 ? "Any %" : `${stateLaws[lawState].back}%+`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", padding: "10px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>🚗 Rear Window</span>
                        <span style={{ fontWeight: "bold", color: "#1E3A5F" }}>
                          {stateLaws[lawState].rear === 0 ? "Any %" : `${stateLaws[lawState].rear}%+`}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "white", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>🚗 Windshield</span>
                        <span style={{ fontWeight: "bold", color: "#1E3A5F" }}>
                          {stateLaws[lawState].windshield}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      📝 <strong>Note:</strong> {stateLaws[lawState].notes}
                    </p>
                  </div>

                  {/* Penalty Warning */}
                  <div style={{ backgroundColor: "#FEF2F2", borderRadius: "10px", padding: "12px", marginTop: "16px", border: "1px solid #FECACA" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#DC2626" }}>
                      ⚠️ <strong>Penalties:</strong> Illegal tint can result in $50-$200+ fines, 
                      failed inspections, and mandatory removal.
                    </p>
                  </div>
                </>
              )}

              {/* COST ESTIMATE RESULTS */}
              {activeTab === "cost" && (
                <>
                  {/* Main Cost */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Cost
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      ${costMin} - ${costMax}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {filmData.name} • {vehicleType === "sedan" ? "Sedan" : vehicleType === "suv" ? "SUV" : "Truck"} • {coverage === "full" ? "Full Vehicle" : coverage === "front" ? "Front Only" : "Rear Only"}
                    </p>
                  </div>

                  {/* Film Comparison */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      Compare Film Types ({vehicleType === "sedan" ? "Sedan" : vehicleType === "suv" ? "SUV" : "Truck"})
                    </h4>
                    <div style={{ fontSize: "0.8rem" }}>
                      {Object.entries(filmTypes).map(([key, value]) => {
                        const prices = value[vehicleType as keyof typeof value] as number[];
                        const isSelected = filmType === key;
                        return (
                          <div key={key} style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            marginBottom: "6px", 
                            padding: "8px",
                            borderRadius: "6px",
                            backgroundColor: isSelected ? "#E0E7FF" : "white",
                            border: isSelected ? "1px solid #1E3A5F" : "1px solid transparent"
                          }}>
                            <span style={{ color: "#4B5563" }}>{value.name}</span>
                            <span style={{ fontWeight: "600", color: "#059669" }}>${prices[0]}-${prices[1]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#1E40AF" }}>💡 Tips</p>
                    <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.8rem", color: "#1D4ED8", lineHeight: "1.6" }}>
                      <li>Ceramic film offers best heat rejection</li>
                      <li>Professional install recommended</li>
                      <li>Ask about warranty (lifetime available)</li>
                      <li>Get multiple quotes from local shops</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* VLT Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E3A5F", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Window Tint Percentage Chart</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Tint Level</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>VLT %</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Light Blocked</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Common Legal Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { level: "Limo Tint", vlt: 5, blocked: 95, desc: "Almost completely dark", legal: "Rear only in most states" },
                  { level: "Very Dark", vlt: 15, blocked: 85, desc: "Difficult to see inside", legal: "Rear windows, some states back side" },
                  { level: "Dark", vlt: 20, blocked: 80, desc: "Good privacy, low visibility", legal: "TX, NM front; most states rear" },
                  { level: "Medium", vlt: 35, blocked: 65, desc: "Balance of privacy & visibility", legal: "Most common legal limit" },
                  { level: "Light", vlt: 50, blocked: 50, desc: "Moderate tint, good visibility", legal: "OH, VA, MN front windows" },
                  { level: "Very Light", vlt: 70, blocked: 30, desc: "Nearly clear, slight tint", legal: "CA, NY front side windows" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 1 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.level}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      <span style={{ 
                        display: "inline-block", 
                        padding: "4px 12px", 
                        borderRadius: "12px", 
                        backgroundColor: row.vlt <= 20 ? "#1F2937" : row.vlt <= 35 ? "#4B5563" : row.vlt <= 50 ? "#9CA3AF" : "#E5E7EB",
                        color: row.vlt <= 50 ? "white" : "#1F2937",
                        fontWeight: "bold"
                      }}>
                        {row.vlt}%
                      </span>
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#DC2626" }}>{row.blocked}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#4B5563" }}>{row.desc}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#059669", fontSize: "0.8rem" }}>{row.legal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🚗 Understanding Window Tint</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>What is VLT?</h3>
                <p>
                  VLT (Visible Light Transmission) measures the percentage of visible light that passes through your 
                  window and tint film combined. A 35% VLT means 35% of light passes through while 65% is blocked. 
                  Lower VLT percentages mean darker tint. When applying tint film to factory glass, you multiply 
                  their VLT values—so 35% film on 80% glass gives you 28% final VLT, not 35%.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why States Regulate Tint</h3>
                <p>
                  Window tint laws exist for safety reasons. Law enforcement needs to see inside vehicles during 
                  traffic stops, and drivers need adequate visibility, especially at night. Front window restrictions 
                  are typically strictest, while rear windows often have no limit. States also regulate reflectivity 
                  to prevent blinding other drivers. Medical exemptions may allow darker tint for conditions 
                  requiring UV protection.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Tint</h3>
                <p>
                  Consider your priorities: privacy, heat rejection, UV protection, or appearance. Ceramic film 
                  offers the best heat rejection without being excessively dark. For front windows, stay within 
                  legal limits—a quality 35% or 50% ceramic film can block significant heat while remaining legal. 
                  For rear windows, you can often go darker. Always get professional installation for best results 
                  and warranty coverage.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#1E3A5F", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>📐 Quick Calculations</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>50% on 80% glass:</strong> 40% VLT</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>35% on 80% glass:</strong> 28% VLT</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>20% on 80% glass:</strong> 16% VLT</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>5% on 80% glass:</strong> 4% VLT</p>
                <p style={{ margin: 0, opacity: 0.8, fontSize: "0.75rem" }}>
                  *Actual results may vary slightly
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>⚠️ Important</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.7" }}>
                <li>Laws change—verify current limits</li>
                <li>Factory tint counts toward total</li>
                <li>Tickets can be $50-$200+</li>
                <li>Medical exemptions available</li>
                <li>Keep documentation in car</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/tint-calculator" currentCategory="Auto" />
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
            🚗 <strong>Disclaimer:</strong> Window tint laws vary by state and change periodically. 
            This calculator provides estimates based on general data. Always verify current laws with your 
            state DMV or a professional tint installer. Cost estimates are approximate and vary by location.
          </p>
        </div>
      </div>
    </div>
  );
}