"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Recommended ACH by room type
const roomTypes = {
  "residential": { name: "Residential - General", minACH: 0.35, recACH: 5, source: "ASHRAE 62.2" },
  "bedroom": { name: "Bedroom", minACH: 2, recACH: 5, source: "ASHRAE" },
  "living": { name: "Living Room", minACH: 3, recACH: 5, source: "ASHRAE" },
  "kitchen": { name: "Kitchen", minACH: 7, recACH: 12, source: "ASHRAE" },
  "bathroom": { name: "Bathroom", minACH: 6, recACH: 10, source: "ASHRAE" },
  "office": { name: "Office", minACH: 4, recACH: 6, source: "ASHRAE 62.1" },
  "classroom": { name: "Classroom", minACH: 4, recACH: 6, source: "ASHRAE" },
  "conference": { name: "Conference Room", minACH: 6, recACH: 10, source: "ASHRAE" },
  "restaurant": { name: "Restaurant / Dining", minACH: 6, recACH: 10, source: "ASHRAE" },
  "retail": { name: "Retail Store", minACH: 4, recACH: 8, source: "ASHRAE" },
  "gym": { name: "Gym / Fitness Center", minACH: 8, recACH: 12, source: "ASHRAE" },
  "hospital-general": { name: "Hospital - General", minACH: 6, recACH: 10, source: "ASHRAE 170" },
  "hospital-or": { name: "Hospital - Operating Room", minACH: 15, recACH: 20, source: "ASHRAE 170" },
  "hospital-isolation": { name: "Hospital - Isolation Room", minACH: 12, recACH: 12, source: "CDC" },
  "laboratory": { name: "Laboratory", minACH: 6, recACH: 10, source: "ASHRAE" },
  "cleanroom-iso7": { name: "Clean Room (ISO 7)", minACH: 15, recACH: 50, source: "ISO 14644" },
  "cleanroom-iso5": { name: "Clean Room (ISO 5)", minACH: 250, recACH: 400, source: "ISO 14644" },
  "custom": { name: "Custom / Other", minACH: 0, recACH: 5, source: "CDC" }
};

// FAQ data
const faqs = [
  {
    question: "How do you calculate air changes per hour?",
    answer: "Air Changes per Hour (ACH) is calculated using the formula: ACH = (CFM × 60) ÷ Room Volume. First, find your room volume by multiplying Length × Width × Height in feet. Then multiply your airflow rate (CFM) by 60 to convert to cubic feet per hour. Finally, divide by the room volume. For example, a 300 CFM fan in a 2,400 cubic foot room: (300 × 60) ÷ 2,400 = 7.5 ACH."
  },
  {
    question: "How much CFM do I need for 2000 square feet?",
    answer: "For a 2000 sq ft space with 8-foot ceilings (16,000 cubic feet volume), the CFM needed depends on your target ACH. For residential (5 ACH): 16,000 × 5 ÷ 60 = 1,333 CFM. For office (6 ACH): 1,600 CFM. For kitchen (12 ACH): 3,200 CFM. Always check local codes and ASHRAE standards for specific requirements."
  },
  {
    question: "How many air changes per hour do you need?",
    answer: "The CDC recommends at least 5 ACH for reducing airborne virus transmission in occupied spaces. ASHRAE standards vary by room type: Residential 4-6 ACH, Offices 6-8 ACH, Kitchens 12-15 ACH, Bathrooms 8-10 ACH, Hospital operating rooms 20-25 ACH. Higher ACH means better air quality but increased energy costs."
  },
  {
    question: "What is a good ACH for a house?",
    answer: "For residential homes, ASHRAE recommends a minimum of 0.35 ACH of outdoor air exchange. However, for good indoor air quality and virus protection, aim for 4-6 ACH total. Modern tight homes may need mechanical ventilation to achieve this. Kitchens and bathrooms should have higher rates (8-15 ACH) due to moisture and odor concerns."
  },
  {
    question: "What is ISO 14644 air changes per hour?",
    answer: "ISO 14644 is the international standard for cleanrooms. It specifies ACH based on cleanliness class: ISO 5 (Class 100) requires 250-600 ACH, ISO 6 (Class 1000) requires 90-180 ACH, ISO 7 (Class 10,000) requires 30-60 ACH, and ISO 8 (Class 100,000) requires 10-25 ACH. These high rates ensure particle contamination is minimized for pharmaceutical and semiconductor manufacturing."
  },
  {
    question: "What is the difference between ACH and CFM?",
    answer: "CFM (Cubic Feet per Minute) measures the volume of air moved per minute - it's a rate. ACH (Air Changes per Hour) measures how many times the entire room volume is replaced in one hour - it's relative to room size. A 300 CFM fan provides different ACH in different sized rooms: 7.5 ACH in a small 2,400 ft³ room, but only 3 ACH in a 6,000 ft³ room. ACH is more useful for comparing ventilation adequacy."
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

export default function AirChangesPerHourCalculator() {
  const [activeTab, setActiveTab] = useState<"calculate" | "required">("calculate");
  
  // Tab 1: ACH Calculator State
  const [unit, setUnit] = useState<string>("imperial");
  const [roomLength, setRoomLength] = useState<string>("20");
  const [roomWidth, setRoomWidth] = useState<string>("15");
  const [roomHeight, setRoomHeight] = useState<string>("8");
  const [airflowRate, setAirflowRate] = useState<string>("300");
  const [roomType, setRoomType] = useState<string>("office");
  
  // Tab 2: Required CFM Calculator State
  const [unit2, setUnit2] = useState<string>("imperial");
  const [roomLength2, setRoomLength2] = useState<string>("20");
  const [roomWidth2, setRoomWidth2] = useState<string>("15");
  const [roomHeight2, setRoomHeight2] = useState<string>("8");
  const [targetACH, setTargetACH] = useState<string>("6");
  const [roomType2, setRoomType2] = useState<string>("office");

  // Unit conversion factors
  const ftToM = 0.3048;
  const cfmToLs = 0.472;
  const lsToCfm = 2.119;
  const m3ToFt3 = 35.315;

  // Tab 1 Calculations
  const length1 = parseFloat(roomLength) || 0;
  const width1 = parseFloat(roomWidth) || 0;
  const height1 = parseFloat(roomHeight) || 0;
  const airflow1 = parseFloat(airflowRate) || 0;
  
  // Calculate volume (convert to ft³ if metric)
  let volumeFt3: number;
  let volumeM3: number;
  let airflowCFM: number;
  let airflowLS: number;
  
  if (unit === "imperial") {
    volumeFt3 = length1 * width1 * height1;
    volumeM3 = volumeFt3 / m3ToFt3;
    airflowCFM = airflow1;
    airflowLS = airflow1 * cfmToLs;
  } else {
    volumeM3 = length1 * width1 * height1;
    volumeFt3 = volumeM3 * m3ToFt3;
    airflowLS = airflow1;
    airflowCFM = airflow1 * lsToCfm;
  }
  
  // Calculate ACH
  const airPerHourFt3 = airflowCFM * 60;
  const calculatedACH = volumeFt3 > 0 ? airPerHourFt3 / volumeFt3 : 0;
  
  // Get room type data
  const roomData = roomTypes[roomType as keyof typeof roomTypes];
  
  // Determine status
  const getACHStatus = (ach: number, minACH: number, recACH: number) => {
    if (ach >= recACH) return { status: "Excellent", color: "#059669", icon: "✅", message: "Exceeds recommended ACH" };
    if (ach >= minACH) return { status: "Adequate", color: "#F59E0B", icon: "⚠️", message: "Meets minimum, below recommended" };
    if (ach >= 5) return { status: "Basic", color: "#F59E0B", icon: "⚠️", message: "Meets CDC 5+ ACH guideline" };
    return { status: "Insufficient", color: "#DC2626", icon: "❌", message: "Below recommended ventilation" };
  };
  
  const achStatus = getACHStatus(calculatedACH, roomData.minACH, roomData.recACH);
  
  // Tab 2 Calculations
  const length2 = parseFloat(roomLength2) || 0;
  const width2 = parseFloat(roomWidth2) || 0;
  const height2 = parseFloat(roomHeight2) || 0;
  const targetACHNum = parseFloat(targetACH) || 0;
  
  let volumeFt3_2: number;
  let volumeM3_2: number;
  
  if (unit2 === "imperial") {
    volumeFt3_2 = length2 * width2 * height2;
    volumeM3_2 = volumeFt3_2 / m3ToFt3;
  } else {
    volumeM3_2 = length2 * width2 * height2;
    volumeFt3_2 = volumeM3_2 * m3ToFt3;
  }
  
  // Calculate required airflow
  const requiredCFM = (targetACHNum * volumeFt3_2) / 60;
  const requiredLS = requiredCFM * cfmToLs;
  const requiredM3H = requiredLS * 3.6;

  const tabs = [
    { id: "calculate", label: "Calculate ACH", icon: "📊" },
    { id: "required", label: "Required CFM", icon: "🎯" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Air Changes per Hour Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌬️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Air Changes per Hour Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate ACH for any room or find the required CFM to meet ventilation standards. 
            Includes ASHRAE recommendations and CDC guidelines for indoor air quality.
          </p>
        </div>

        {/* Formula Box */}
        <div style={{
          backgroundColor: "#ECFEFF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A5F3FC"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#0E7490", margin: "0 0 8px 0" }}>ACH Formula</p>
              <div style={{ fontFamily: "monospace", fontSize: "0.95rem", color: "#0891B2", backgroundColor: "white", padding: "10px 14px", borderRadius: "6px", display: "inline-block" }}>
                ACH = (CFM × 60) ÷ Room Volume (ft³)
              </div>
              <p style={{ fontSize: "0.85rem", color: "#0E7490", margin: "10px 0 0 0" }}>
                CDC recommends <strong>5+ ACH</strong> to reduce airborne virus transmission in occupied spaces.
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
                backgroundColor: activeTab === tab.id ? "#0891B2" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "calculate" && "📏 Room & Airflow Details"}
                {activeTab === "required" && "🎯 Room & Target ACH"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* CALCULATE ACH TAB */}
              {activeTab === "calculate" && (
                <>
                  {/* Unit Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Measurement Unit
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setUnit("imperial")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: unit === "imperial" ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: unit === "imperial" ? "#ECFEFF" : "white",
                          color: unit === "imperial" ? "#0891B2" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🇺🇸 Imperial<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>ft, CFM</span>
                      </button>
                      <button
                        onClick={() => setUnit("metric")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: unit === "metric" ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: unit === "metric" ? "#ECFEFF" : "white",
                          color: unit === "metric" ? "#0891B2" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🌍 Metric<br/>
                        <span style={{ fontSize: "0.7rem", fontWeight: "400" }}>m, L/s</span>
                      </button>
                    </div>
                  </div>

                  {/* Room Dimensions */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Room Dimensions ({unit === "imperial" ? "feet" : "meters"})
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Length</label>
                        <input
                          type="number"
                          value={roomLength}
                          onChange={(e) => setRoomLength(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Width</label>
                        <input
                          type="number"
                          value={roomWidth}
                          onChange={(e) => setRoomWidth(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Height</label>
                        <input
                          type="number"
                          value={roomHeight}
                          onChange={(e) => setRoomHeight(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Airflow Rate */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Airflow Rate ({unit === "imperial" ? "CFM" : "L/s"})
                    </label>
                    <input
                      type="number"
                      value={airflowRate}
                      onChange={(e) => setAirflowRate(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      placeholder={unit === "imperial" ? "e.g., 300 CFM" : "e.g., 142 L/s"}
                    />
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Check your HVAC system or air purifier rating for this value
                    </p>
                  </div>

                  {/* Room Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Room Type (for comparison)
                    </label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(roomTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name} (Rec: {value.recACH} ACH)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Presets */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Common Room Sizes
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[
                        { label: "Small Office", l: 12, w: 10, h: 9 },
                        { label: "Classroom", l: 30, w: 30, h: 10 },
                        { label: "Bedroom", l: 14, w: 12, h: 8 },
                        { label: "Living Room", l: 20, w: 15, h: 8 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setUnit("imperial");
                            setRoomLength(preset.l.toString());
                            setRoomWidth(preset.w.toString());
                            setRoomHeight(preset.h.toString());
                          }}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* REQUIRED CFM TAB */}
              {activeTab === "required" && (
                <>
                  {/* Unit Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Measurement Unit
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setUnit2("imperial")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: unit2 === "imperial" ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: unit2 === "imperial" ? "#ECFEFF" : "white",
                          color: unit2 === "imperial" ? "#0891B2" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🇺🇸 Imperial (ft)
                      </button>
                      <button
                        onClick={() => setUnit2("metric")}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: unit2 === "metric" ? "2px solid #0891B2" : "1px solid #E5E7EB",
                          backgroundColor: unit2 === "metric" ? "#ECFEFF" : "white",
                          color: unit2 === "metric" ? "#0891B2" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        🌍 Metric (m)
                      </button>
                    </div>
                  </div>

                  {/* Room Dimensions */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Room Dimensions ({unit2 === "imperial" ? "feet" : "meters"})
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Length</label>
                        <input
                          type="number"
                          value={roomLength2}
                          onChange={(e) => setRoomLength2(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Width</label>
                        <input
                          type="number"
                          value={roomWidth2}
                          onChange={(e) => setRoomWidth2(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.7rem", color: "#6B7280", marginBottom: "4px" }}>Height</label>
                        <input
                          type="number"
                          value={roomHeight2}
                          onChange={(e) => setRoomHeight2(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Room Type Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Room Type
                    </label>
                    <select
                      value={roomType2}
                      onChange={(e) => {
                        setRoomType2(e.target.value);
                        const data = roomTypes[e.target.value as keyof typeof roomTypes];
                        setTargetACH(data.recACH.toString());
                      }}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      {Object.entries(roomTypes).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target ACH */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Target ACH
                    </label>
                    <input
                      type="number"
                      value={targetACH}
                      onChange={(e) => setTargetACH(e.target.value)}
                      step="0.5"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      Recommended for {roomTypes[roomType2 as keyof typeof roomTypes].name}: {roomTypes[roomType2 as keyof typeof roomTypes].recACH} ACH ({roomTypes[roomType2 as keyof typeof roomTypes].source})
                    </p>
                  </div>

                  {/* Quick ACH Presets */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Common ACH Targets
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[
                        { label: "CDC Min (5)", value: 5 },
                        { label: "Office (6)", value: 6 },
                        { label: "Kitchen (12)", value: 12 },
                        { label: "Hospital (20)", value: 20 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setTargetACH(preset.value.toString())}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "6px",
                            border: targetACH === preset.value.toString() ? "2px solid #0891B2" : "1px solid #E5E7EB",
                            backgroundColor: targetACH === preset.value.toString() ? "#ECFEFF" : "white",
                            color: "#374151",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
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
                {activeTab === "calculate" && "🌬️ Air Changes per Hour"}
                {activeTab === "required" && "🎯 Required Airflow"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* ACH RESULTS */}
              {activeTab === "calculate" && (
                <>
                  {/* Main ACH Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Your Air Changes per Hour
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                      {calculatedACH.toFixed(1)} ACH
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Air replaced {calculatedACH.toFixed(1)} times every hour
                    </p>
                  </div>

                  {/* Status */}
                  <div style={{
                    backgroundColor: `${achStatus.color}15`,
                    borderRadius: "10px",
                    padding: "12px 16px",
                    marginBottom: "16px",
                    border: `1px solid ${achStatus.color}40`
                  }}>
                    <p style={{ margin: 0, fontSize: "0.95rem", color: achStatus.color, fontWeight: "600" }}>
                      {achStatus.icon} {achStatus.status} - {achStatus.message}
                    </p>
                  </div>

                  {/* Comparison with Standard */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      Comparison: {roomData.name}
                    </h4>
                    <div style={{ position: "relative", height: "24px", backgroundColor: "#E5E7EB", borderRadius: "12px", marginBottom: "12px", overflow: "hidden" }}>
                      {/* Min ACH marker */}
                      <div style={{
                        position: "absolute",
                        left: `${Math.min((roomData.minACH / Math.max(calculatedACH, roomData.recACH, 20)) * 100, 100)}%`,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        backgroundColor: "#F59E0B"
                      }} />
                      {/* Recommended ACH marker */}
                      <div style={{
                        position: "absolute",
                        left: `${Math.min((roomData.recACH / Math.max(calculatedACH, roomData.recACH, 20)) * 100, 100)}%`,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        backgroundColor: "#059669"
                      }} />
                      {/* Your ACH bar */}
                      <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${Math.min((calculatedACH / Math.max(calculatedACH, roomData.recACH, 20)) * 100, 100)}%`,
                        backgroundColor: achStatus.color,
                        borderRadius: "12px",
                        transition: "width 0.3s"
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>Min: {roomData.minACH} ACH</span>
                      <span>Recommended: {roomData.recACH} ACH</span>
                      <span>Source: {roomData.source}</span>
                    </div>
                  </div>

                  {/* Calculation Details */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1E40AF", fontSize: "0.85rem" }}>Calculation Details</h4>
                    <div style={{ fontSize: "0.8rem", color: "#1D4ED8" }}>
                      <p style={{ margin: "0 0 4px 0" }}>Room Volume: {volumeFt3.toLocaleString(undefined, {maximumFractionDigits: 0})} ft³ ({volumeM3.toFixed(1)} m³)</p>
                      <p style={{ margin: "0 0 4px 0" }}>Airflow: {airflowCFM.toFixed(0)} CFM ({airflowLS.toFixed(1)} L/s)</p>
                      <p style={{ margin: 0 }}>Air/Hour: {airPerHourFt3.toLocaleString(undefined, {maximumFractionDigits: 0})} ft³/hr</p>
                    </div>
                  </div>
                </>
              )}

              {/* REQUIRED CFM RESULTS */}
              {activeTab === "required" && (
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
                      Required Airflow
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {requiredCFM.toFixed(0)} CFM
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      to achieve {targetACHNum} ACH
                    </p>
                  </div>

                  {/* Alternative Units */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>In L/s</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {requiredLS.toFixed(1)} L/s
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#1E40AF" }}>In m³/h</p>
                      <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>
                        {requiredM3H.toFixed(0)} m³/h
                      </p>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>Room Details</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Volume</span>
                        <span style={{ fontWeight: "600" }}>{volumeFt3_2.toLocaleString(undefined, {maximumFractionDigits: 0})} ft³ ({volumeM3_2.toFixed(1)} m³)</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Target ACH</span>
                        <span style={{ fontWeight: "600" }}>{targetACHNum} air changes/hour</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#4B5563" }}>Standard</span>
                        <span style={{ fontWeight: "600" }}>{roomTypes[roomType2 as keyof typeof roomTypes].source}</span>
                      </div>
                    </div>
                  </div>

                  {/* Formula Used */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.85rem" }}>Formula Used</h4>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#B45309", fontFamily: "monospace" }}>
                      CFM = (Target ACH × Volume) ÷ 60<br/>
                      CFM = ({targetACHNum} × {volumeFt3_2.toLocaleString(undefined, {maximumFractionDigits: 0})}) ÷ 60 = <strong>{requiredCFM.toFixed(0)}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recommended ACH Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Recommended ACH by Room Type (ASHRAE & CDC)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "600px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Room Type</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Minimum ACH</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recommended ACH</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(roomTypes).filter(([key]) => key !== "custom").map(([key, data], idx) => (
                  <tr key={key} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{data.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{data.minACH}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{data.recACH}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.8rem", color: "#6B7280" }}>{data.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
              * These are general guidelines. Specific requirements may vary based on local codes, occupancy levels, and specific activities within the space.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🌬️ Understanding Air Changes per Hour</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>What is ACH?</h3>
                <p>
                  Air Changes per Hour (ACH) measures how many times the total air volume in a room is completely 
                  replaced with fresh or filtered air in one hour. An ACH of 6 means the entire room&apos;s air is 
                  replaced 6 times per hour, or once every 10 minutes. This metric is crucial for maintaining 
                  indoor air quality, controlling pollutants, and reducing airborne disease transmission.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why ACH Matters for Health</h3>
                <p>
                  The CDC recommends at least 5 ACH in occupied spaces to reduce airborne virus transmission. 
                  Higher ACH rates dilute and remove airborne contaminants including viruses, bacteria, allergens, 
                  and volatile organic compounds (VOCs). In healthcare settings, operating rooms require 20+ ACH 
                  to prevent surgical site infections, while isolation rooms need 12+ ACH with negative pressure.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>ACH vs. CFM: What&apos;s the Difference?</h3>
                <p>
                  CFM (Cubic Feet per Minute) is an absolute measure of airflow - how much air moves per minute 
                  regardless of room size. ACH is relative to room volume - the same 300 CFM fan provides 
                  excellent ventilation (7.5 ACH) in a small office but inadequate ventilation (3 ACH) in a 
                  large classroom. Always consider ACH when evaluating ventilation adequacy, not just CFM.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#ECFEFF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A5F3FC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0E7490", marginBottom: "16px" }}>📐 Quick Formulas</h3>
              <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#0891B2", backgroundColor: "white", padding: "12px", borderRadius: "8px" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>Calculate ACH:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>ACH = (CFM × 60) ÷ Volume</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Find Required CFM:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>CFM = (ACH × Volume) ÷ 60</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>Room Volume:</strong></p>
                <p style={{ margin: 0 }}>V = L × W × H</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ CDC Guidelines</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Aim for <strong>5+ ACH</strong> minimum</li>
                <li>Higher is better for virus protection</li>
                <li>Combine HVAC + air purifiers</li>
                <li>Open windows when possible</li>
                <li>Use HEPA filters (MERV 13+)</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/air-changes-per-hour-calculator" currentCategory="Engineering" />
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
            🌬️ <strong>Disclaimer:</strong> This calculator provides estimates based on standard formulas. 
            Actual ventilation requirements depend on many factors including occupancy, activities, contaminant sources, 
            and local building codes. Consult HVAC professionals and local codes for specific applications. 
            ACH values assume well-mixed air distribution.
          </p>
        </div>
      </div>
    </div>
  );
}