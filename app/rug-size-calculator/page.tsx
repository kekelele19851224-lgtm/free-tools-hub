"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Standard rug sizes (in inches for calculations, displayed in feet)
const standardRugSizes = [
  { name: "3' × 5'", width: 36, length: 60, area: 15, bestFor: "Entryway, Small accent" },
  { name: "4' × 6'", width: 48, length: 72, area: 24, bestFor: "Small bedroom, Bathroom" },
  { name: "5' × 7'", width: 60, length: 84, area: 35, bestFor: "Small living room, Office" },
  { name: "5' × 8'", width: 60, length: 96, area: 40, bestFor: "Medium bedroom, Office" },
  { name: "6' × 9'", width: 72, length: 108, area: 54, bestFor: "Medium bedroom, Dining (4 chairs)" },
  { name: "8' × 10'", width: 96, length: 120, area: 80, bestFor: "Living room, Dining (6 chairs)" },
  { name: "9' × 12'", width: 108, length: 144, area: 108, bestFor: "Large living room, Dining (8 chairs)" },
  { name: "10' × 14'", width: 120, length: 168, area: 140, bestFor: "Great room, Large dining" },
  { name: "12' × 15'", width: 144, length: 180, area: 180, bestFor: "Open concept, Extra large" }
];

// Runner sizes
const runnerSizes = [
  { name: "2' × 6'", width: 24, length: 72 },
  { name: "2' × 8'", width: 24, length: 96 },
  { name: "2' × 10'", width: 24, length: 120 },
  { name: "2' × 12'", width: 24, length: 144 },
  { name: "3' × 8'", width: 36, length: 96 },
  { name: "3' × 10'", width: 36, length: 120 }
];

// Round rug sizes
const roundRugSizes = [
  { name: "4' Round", diameter: 48 },
  { name: "5' Round", diameter: 60 },
  { name: "6' Round", diameter: 72 },
  { name: "8' Round", diameter: 96 },
  { name: "10' Round", diameter: 120 }
];

// Room type configurations
const roomTypes = {
  "living": { 
    name: "Living Room", 
    icon: "🛋️",
    defaultBorder: 18,
    tip: "Front legs of sofa and chairs should be on the rug"
  },
  "bedroom": { 
    name: "Bedroom", 
    icon: "🛏️",
    defaultBorder: 18,
    tip: "Rug should extend 18-24 inches beyond sides of bed"
  },
  "dining": { 
    name: "Dining Room", 
    icon: "🍽️",
    defaultBorder: 18,
    tip: "Allow 24 inches beyond table for chair pullout"
  },
  "hallway": { 
    name: "Hallway / Runner", 
    icon: "🚪",
    defaultBorder: 6,
    tip: "Leave 3-6 inches on each side of runner"
  },
  "office": { 
    name: "Home Office", 
    icon: "💼",
    defaultBorder: 12,
    tip: "Rug should fit under desk and chair movement area"
  }
};

// FAQ data
const faqs = [
  {
    question: "How do I figure out what size rug I need?",
    answer: "Measure your room's length and width, then subtract 24-36 inches from each dimension (to leave 12-18 inches of floor showing on each side). For a 12' × 14' room, subtract 3' from each: you'd need approximately a 9' × 11' rug. Since that's not a standard size, choose the closest option: 9' × 12'. For furniture placement, ensure at least the front legs of sofas and chairs rest on the rug."
  },
  {
    question: "What does 9x12 mean for rugs?",
    answer: "A 9x12 rug measures 9 feet wide by 12 feet long (108 inches × 144 inches), covering 108 square feet of floor space. This is one of the most popular sizes for living rooms and dining rooms. In metric, it's approximately 2.7m × 3.7m. The first number is always width, the second is length."
  },
  {
    question: "What is the 18 inch rule for rugs?",
    answer: "The 18-inch rule is a design guideline recommending you leave about 18 inches of bare floor between your rug's edges and the walls. This creates a visual frame that makes the room look balanced and proportional. For smaller rooms, 8-12 inches works better. For larger rooms, you can extend to 24 inches. This rule helps prevent rugs from looking too small (floating) or too large (overwhelming)."
  },
  {
    question: "How big is a 5 × 7 area rug?",
    answer: "A 5' × 7' rug measures 60 inches × 84 inches (approximately 152cm × 213cm), covering 35 square feet. This size works well for small living rooms, bedrooms, or as an accent rug in larger spaces. It can fit under a coffee table with a small sofa arrangement but may be too small for rooms larger than 10' × 12'."
  },
  {
    question: "What size rug for a living room with sectional?",
    answer: "For L-shaped sectionals, choose an 8' × 10' or 9' × 12' rug that extends at least 6 inches beyond the sectional on all sides. For U-shaped sectionals, you'll likely need a 10' × 14' or larger. The rug should be long enough that all front legs of the sectional rest on it. Measure your sectional's total footprint and add 12-24 inches to each dimension."
  },
  {
    question: "What size rug do I need under a dining table?",
    answer: "Add 48-54 inches to your table's dimensions (24-27 inches per side) to allow chairs to remain on the rug when pulled out. For a 6-person table (36\" × 72\"), you need at least an 8' × 10' rug. For an 8-person table (42\" × 96\"), choose a 9' × 12' or larger. Round tables need round rugs with diameter = table diameter + 48-54 inches."
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

// Find best matching standard sizes
function findMatchingSizes(widthInches: number, lengthInches: number): typeof standardRugSizes {
  return standardRugSizes
    .map(size => ({
      ...size,
      diff: Math.abs(size.width - widthInches) + Math.abs(size.length - lengthInches)
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3);
}

// Find matching runner
function findMatchingRunner(lengthInches: number): typeof runnerSizes {
  return runnerSizes
    .map(size => ({
      ...size,
      diff: Math.abs(size.length - lengthInches)
    }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2);
}

export default function RugSizeCalculator() {
  const [activeTab, setActiveTab] = useState<"room" | "dining">("room");
  
  // Tab 1: Room Calculator State
  const [roomType, setRoomType] = useState<string>("living");
  const [roomLength, setRoomLength] = useState<string>("14");
  const [roomWidth, setRoomWidth] = useState<string>("12");
  const [borderSize, setBorderSize] = useState<string>("18");
  const [unit, setUnit] = useState<string>("feet");
  
  // Tab 2: Dining Table Calculator State
  const [tableShape, setTableShape] = useState<string>("rectangle");
  const [tableLength, setTableLength] = useState<string>("72");
  const [tableWidth, setTableWidth] = useState<string>("36");
  const [tableDiameter, setTableDiameter] = useState<string>("48");
  const [chairPullout, setChairPullout] = useState<string>("24");
  const [numChairs, setNumChairs] = useState<string>("6");

  // Tab 1 Calculations
  const roomLengthNum = parseFloat(roomLength) || 0;
  const roomWidthNum = parseFloat(roomWidth) || 0;
  const borderNum = parseFloat(borderSize) || 18;
  
  // Convert to inches for calculation
  const roomLengthInches = unit === "feet" ? roomLengthNum * 12 : roomLengthNum;
  const roomWidthInches = unit === "feet" ? roomWidthNum * 12 : roomWidthNum;
  const borderInches = borderNum; // Border is always in inches
  
  // Calculate ideal rug size (room - 2*border)
  const idealRugLengthInches = Math.max(0, roomLengthInches - (2 * borderInches));
  const idealRugWidthInches = Math.max(0, roomWidthInches - (2 * borderInches));
  
  // Convert to feet for display
  const idealRugLengthFeet = idealRugLengthInches / 12;
  const idealRugWidthFeet = idealRugWidthInches / 12;
  const idealRugArea = (idealRugLengthInches * idealRugWidthInches) / 144;
  
  // Find matching standard sizes
  const isRunner = roomType === "hallway";
  const matchingSizes = isRunner 
    ? findMatchingRunner(idealRugLengthInches)
    : findMatchingSizes(idealRugWidthInches, idealRugLengthInches);
  
  // Tab 2 Calculations
  const tableLengthNum = parseFloat(tableLength) || 72;
  const tableWidthNum = parseFloat(tableWidth) || 36;
  const tableDiameterNum = parseFloat(tableDiameter) || 48;
  const chairPulloutNum = parseFloat(chairPullout) || 24;
  
  // Calculate minimum rug size for dining (table + pullout on each side)
  const minRugLength = tableLengthNum + (2 * chairPulloutNum);
  const minRugWidth = tableWidthNum + (2 * chairPulloutNum);
  const minRugDiameter = tableDiameterNum + (2 * chairPulloutNum);
  
  // Find matching sizes for dining
  const diningMatchingSizes = tableShape === "round"
    ? roundRugSizes.filter(r => r.diameter >= minRugDiameter).slice(0, 3)
    : findMatchingSizes(minRugWidth, minRugLength);

  const roomConfig = roomTypes[roomType as keyof typeof roomTypes];

  const tabs = [
    { id: "room", label: "Room Calculator", icon: "📐" },
    { id: "dining", label: "Dining Table", icon: "🍽️" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Rug Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Rug Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Find the perfect rug size for any room. Calculate ideal dimensions based on room size, 
            furniture layout, and the 18-inch rule. Get matched to standard rug sizes instantly.
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
            <span style={{ fontSize: "1.5rem" }}>📏</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>The 18-Inch Rule</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Leave <strong>18 inches</strong> of bare floor between your rug and walls for visual balance. 
                Formula: <strong>Rug Size = Room Size - 36&quot;</strong> (18&quot; on each side). 
                For smaller rooms, 8-12 inches works better.
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
                backgroundColor: activeTab === tab.id ? "#B45309" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "room" && "📐 Room Dimensions"}
                {activeTab === "dining" && "🍽️ Table Dimensions"}
              </h2>
            </div>
            
            <div style={{ padding: "24px", maxHeight: "600px", overflowY: "auto" }}>
              {/* ROOM CALCULATOR TAB */}
              {activeTab === "room" && (
                <>
                  {/* Room Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Room Type
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {Object.entries(roomTypes).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setRoomType(key);
                            setBorderSize(value.defaultBorder.toString());
                          }}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: roomType === key ? "2px solid #B45309" : "1px solid #E5E7EB",
                            backgroundColor: roomType === key ? "#FEF3C7" : "white",
                            color: roomType === key ? "#B45309" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            textAlign: "left"
                          }}
                        >
                          {value.icon} {value.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tip for selected room */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "10px 12px", marginBottom: "16px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      💡 {roomConfig.tip}
                    </p>
                  </div>

                  {/* Unit Selection */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Measurement Unit
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setUnit("feet")}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: unit === "feet" ? "2px solid #B45309" : "1px solid #E5E7EB",
                          backgroundColor: unit === "feet" ? "#FEF3C7" : "white",
                          color: unit === "feet" ? "#B45309" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        Feet
                      </button>
                      <button
                        onClick={() => setUnit("inches")}
                        style={{
                          flex: 1,
                          padding: "8px",
                          borderRadius: "6px",
                          border: unit === "inches" ? "2px solid #B45309" : "1px solid #E5E7EB",
                          backgroundColor: unit === "inches" ? "#FEF3C7" : "white",
                          color: unit === "inches" ? "#B45309" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        Inches
                      </button>
                    </div>
                  </div>

                  {/* Room Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Room {isRunner ? "Length" : "Width"} ({unit})
                      </label>
                      <input
                        type="number"
                        value={roomWidth}
                        onChange={(e) => setRoomWidth(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Room Length ({unit})
                      </label>
                      <input
                        type="number"
                        value={roomLength}
                        onChange={(e) => setRoomLength(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  {/* Floor Border */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Floor Border (inches from wall)
                    </label>
                    <select
                      value={borderSize}
                      onChange={(e) => setBorderSize(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="8">8 inches (Small rooms)</option>
                      <option value="12">12 inches (Medium rooms)</option>
                      <option value="18">18 inches (Standard - Recommended)</option>
                      <option value="24">24 inches (Large rooms)</option>
                    </select>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "4px 0 0 0" }}>
                      The 18-inch rule creates visual balance between rug and floor
                    </p>
                  </div>

                  {/* Quick Room Presets */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Quick Room Presets
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[
                        { label: "10×12", w: 10, l: 12 },
                        { label: "12×14", w: 12, l: 14 },
                        { label: "14×16", w: 14, l: 16 },
                        { label: "16×20", w: 16, l: 20 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setUnit("feet");
                            setRoomWidth(preset.w.toString());
                            setRoomLength(preset.l.toString());
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: "white",
                            color: "#374151",
                            fontSize: "0.8rem",
                            cursor: "pointer"
                          }}
                        >
                          {preset.label} ft
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* DINING TABLE TAB */}
              {activeTab === "dining" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "16px", padding: "10px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    💡 Dining rugs must extend far enough for chairs to stay on the rug when pulled out (typically 24&quot; beyond table).
                  </p>

                  {/* Table Shape */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Table Shape
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { id: "rectangle", label: "Rectangle", icon: "▬" },
                        { id: "round", label: "Round", icon: "●" },
                        { id: "square", label: "Square", icon: "■" }
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setTableShape(shape.id)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: tableShape === shape.id ? "2px solid #B45309" : "1px solid #E5E7EB",
                            backgroundColor: tableShape === shape.id ? "#FEF3C7" : "white",
                            color: tableShape === shape.id ? "#B45309" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {shape.icon} {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table Dimensions */}
                  {tableShape === "round" ? (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                        Table Diameter (inches)
                      </label>
                      <input
                        type="number"
                        value={tableDiameter}
                        onChange={(e) => setTableDiameter(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Table Width (inches)
                        </label>
                        <input
                          type="number"
                          value={tableWidth}
                          onChange={(e) => setTableWidth(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                          Table Length (inches)
                        </label>
                        <input
                          type="number"
                          value={tableLength}
                          onChange={(e) => setTableLength(e.target.value)}
                          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Chair Pullout Space */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Chair Pullout Space (inches beyond table)
                    </label>
                    <select
                      value={chairPullout}
                      onChange={(e) => setChairPullout(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="18">18 inches (Minimum)</option>
                      <option value="24">24 inches (Recommended)</option>
                      <option value="30">30 inches (Comfortable)</option>
                      <option value="36">36 inches (Generous)</option>
                    </select>
                  </div>

                  {/* Number of Chairs */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      Number of Chairs
                    </label>
                    <select
                      value={numChairs}
                      onChange={(e) => setNumChairs(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "0.9rem" }}
                    >
                      <option value="4">4 Chairs</option>
                      <option value="6">6 Chairs</option>
                      <option value="8">8 Chairs</option>
                      <option value="10">10+ Chairs</option>
                    </select>
                  </div>

                  {/* Common Table Presets */}
                  <div style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Common Table Sizes
                    </label>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {[
                        { label: "4-Person (36×48)", w: 36, l: 48 },
                        { label: "6-Person (36×72)", w: 36, l: 72 },
                        { label: "8-Person (42×96)", w: 42, l: 96 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => {
                            setTableShape("rectangle");
                            setTableWidth(preset.w.toString());
                            setTableLength(preset.l.toString());
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
                {activeTab === "room" && "🎯 Recommended Rug Size"}
                {activeTab === "dining" && "🎯 Minimum Rug Size"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* ROOM RESULTS */}
              {activeTab === "room" && (
                <>
                  {/* Calculated Size */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Ideal Rug Size
                    </p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                      {idealRugWidthFeet.toFixed(1)}&apos; × {idealRugLengthFeet.toFixed(1)}&apos;
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                      {Math.round(idealRugWidthInches)}&quot; × {Math.round(idealRugLengthInches)}&quot; ({Math.round(idealRugArea)} sq ft)
                    </p>
                  </div>

                  {/* Matching Standard Sizes */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      {isRunner ? "Recommended Runner Sizes" : "Closest Standard Sizes"}
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {matchingSizes.map((size, idx) => (
                        <div
                          key={size.name}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            backgroundColor: idx === 0 ? "#ECFDF5" : "white",
                            borderRadius: "8px",
                            border: idx === 0 ? "2px solid #059669" : "1px solid #E5E7EB"
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: "600", color: idx === 0 ? "#059669" : "#111827" }}>
                              {size.name}
                            </span>
                            {idx === 0 && (
                              <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>
                                Best Match
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                            {!isRunner && 'bestFor' in size ? (size as typeof standardRugSizes[0]).bestFor : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculation Breakdown */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid #FCD34D" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.85rem" }}>How We Calculated</h4>
                    <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
                      <p style={{ margin: "0 0 4px 0" }}>Room: {roomWidthNum} × {roomLengthNum} {unit}</p>
                      <p style={{ margin: "0 0 4px 0" }}>Border: {borderNum}&quot; on each side (×2 = {borderNum * 2}&quot;)</p>
                      <p style={{ margin: 0, fontWeight: "600" }}>Rug = Room - Border = {idealRugWidthFeet.toFixed(1)}&apos; × {idealRugLengthFeet.toFixed(1)}&apos;</p>
                    </div>
                  </div>

                  {/* Room Tip */}
                  <div style={{ backgroundColor: "#EFF6FF", borderRadius: "10px", padding: "12px", border: "1px solid #BFDBFE" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                      {roomConfig.icon} <strong>{roomConfig.name} Tip:</strong> {roomConfig.tip}
                    </p>
                  </div>
                </>
              )}

              {/* DINING RESULTS */}
              {activeTab === "dining" && (
                <>
                  {/* Minimum Size */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Minimum Rug Size
                    </p>
                    {tableShape === "round" ? (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                          {Math.ceil(minRugDiameter / 12)}&apos; Round
                        </p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                          {Math.round(minRugDiameter)}&quot; diameter minimum
                        </p>
                      </>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                          {Math.ceil(minRugWidth / 12)}&apos; × {Math.ceil(minRugLength / 12)}&apos;
                        </p>
                        <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#065F46" }}>
                          {Math.round(minRugWidth)}&quot; × {Math.round(minRugLength)}&quot; minimum
                        </p>
                      </>
                    )}
                  </div>

                  {/* Recommended Sizes */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                      Recommended Standard Sizes
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {tableShape === "round" ? (
                        (diningMatchingSizes as typeof roundRugSizes).map((size, idx) => (
                          <div
                            key={size.name}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 12px",
                              backgroundColor: idx === 0 ? "#ECFDF5" : "white",
                              borderRadius: "8px",
                              border: idx === 0 ? "2px solid #059669" : "1px solid #E5E7EB"
                            }}
                          >
                            <span style={{ fontWeight: "600", color: idx === 0 ? "#059669" : "#111827" }}>
                              {size.name}
                            </span>
                            {idx === 0 && (
                              <span style={{ fontSize: "0.75rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>
                                Best Match
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        (diningMatchingSizes as typeof standardRugSizes).map((size, idx) => (
                          <div
                            key={size.name}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "10px 12px",
                              backgroundColor: idx === 0 ? "#ECFDF5" : "white",
                              borderRadius: "8px",
                              border: idx === 0 ? "2px solid #059669" : "1px solid #E5E7EB"
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: "600", color: idx === 0 ? "#059669" : "#111827" }}>
                                {size.name}
                              </span>
                              {idx === 0 && (
                                <span style={{ marginLeft: "8px", fontSize: "0.75rem", color: "#059669", backgroundColor: "#D1FAE5", padding: "2px 6px", borderRadius: "4px" }}>
                                  Best Match
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{size.bestFor}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Calculation Explanation */}
                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "10px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.85rem" }}>Formula Used</h4>
                    <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
                      {tableShape === "round" ? (
                        <p style={{ margin: 0 }}>
                          Rug Diameter = Table ({tableDiameterNum}&quot;) + 2 × Pullout ({chairPulloutNum}&quot;) = <strong>{minRugDiameter}&quot;</strong>
                        </p>
                      ) : (
                        <>
                          <p style={{ margin: "0 0 4px 0" }}>Width: {tableWidthNum}&quot; + (2 × {chairPulloutNum}&quot;) = {minRugWidth}&quot;</p>
                          <p style={{ margin: 0 }}>Length: {tableLengthNum}&quot; + (2 × {chairPulloutNum}&quot;) = {minRugLength}&quot;</p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Standard Rug Sizes Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#B45309", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📏 Standard Rug Sizes Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Size (ft)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Size (inches)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Area (sq ft)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                {standardRugSizes.map((size, idx) => (
                  <tr key={size.name} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{size.name}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{size.width}&quot; × {size.length}&quot;</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{size.area}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{size.bestFor}</td>
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>📐 How to Choose the Right Rug Size</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The 18-Inch Rule Explained</h3>
                <p>
                  The 18-inch rule is a fundamental interior design guideline that recommends leaving approximately 
                  18 inches of bare floor between your rug&apos;s edges and the walls. This creates a visual &quot;frame&quot; 
                  that makes the room feel balanced and proportional. For smaller rooms under 10×12 feet, reduce 
                  this to 8-12 inches. For larger rooms over 14×18 feet, you can extend to 24 inches.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Living Room Rug Placement</h3>
                <p>
                  In living rooms, your rug should be large enough that at least the front legs of all seating 
                  furniture rest on it. This creates a cohesive conversation area. The most popular approach is 
                  &quot;front legs on&quot; - where front furniture legs are on the rug and back legs are off. For open 
                  floor plans, an 8×10 or 9×12 rug works for most setups. With sectionals, ensure the rug extends 
                  at least 6 inches beyond all sides.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Dining Room Rug Guidelines</h3>
                <p>
                  Dining room rugs must accommodate chairs being pulled in and out. The rule is simple: add 24-30 inches 
                  to each side of your table&apos;s dimensions. For a 6-person table (36×72 inches), you&apos;ll need at minimum 
                  an 8×10 rug. Round tables should have round rugs with diameter equal to table diameter plus 48-54 inches. 
                  Chairs catching on rug edges during meals is the most common dining rug mistake.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>📏 Quick Size Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309" }}>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <strong>Small Room (10×12)</strong><br/>
                  Rug: 5×7 or 6×9
                </div>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <strong>Medium Room (12×14)</strong><br/>
                  Rug: 8×10
                </div>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FCD34D" }}>
                  <strong>Large Room (14×18)</strong><br/>
                  Rug: 9×12
                </div>
                <div>
                  <strong>Great Room (16×20+)</strong><br/>
                  Rug: 10×14 or 12×15
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ Common Mistakes</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <li>Rug too small (&quot;floating&quot; look)</li>
                <li>Forgetting chair pullout space</li>
                <li>Not considering furniture layout</li>
                <li>Ignoring room shape</li>
                <li>Skipping rug pad</li>
              </ul>
            </div>

            <RelatedTools currentUrl="/rug-size-calculator" currentCategory="Home" />
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
            🏠 <strong>Disclaimer:</strong> This calculator provides general recommendations based on common design guidelines. 
            Actual rug needs may vary based on furniture arrangement, room shape, and personal preference. 
            We recommend using painter&apos;s tape to visualize rug dimensions on your floor before purchasing.
          </p>
        </div>
      </div>
    </div>
  );
}
