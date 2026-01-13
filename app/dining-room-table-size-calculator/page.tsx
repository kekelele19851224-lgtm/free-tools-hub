"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Clearance options
const clearanceOptions = [
  { id: "tight", name: "Tight (30\")", inches: 30, description: "Minimum, wall-side" },
  { id: "standard", name: "Standard (36\")", inches: 36, description: "Recommended" },
  { id: "spacious", name: "Spacious (42\")", inches: 42, description: "High traffic areas" }
];

// Table shapes
const tableShapes = [
  { id: "rectangular", name: "Rectangular", icon: "▭", description: "Most common, versatile" },
  { id: "round", name: "Round", icon: "○", description: "Great for conversation" },
  { id: "square", name: "Square", icon: "□", description: "Intimate, small spaces" },
  { id: "oval", name: "Oval", icon: "⬭", description: "Soft edges, flexible" }
];

// Comfort levels for seating
const comfortLevels = [
  { id: "cozy", name: "Cozy", inches: 22, description: "Tight fit" },
  { id: "standard", name: "Standard", inches: 24, description: "Comfortable" },
  { id: "spacious", name: "Spacious", inches: 28, description: "Roomy" }
];

// Seating options
const seatingOptions = [2, 4, 6, 8, 10, 12];

// Round table seating reference
const roundTableSeating = [
  { diameter: 36, seats: 2 },
  { diameter: 42, seats: 4 },
  { diameter: 48, seats: 4 },
  { diameter: 54, seats: 6 },
  { diameter: 60, seats: 6 },
  { diameter: 72, seats: 8 },
  { diameter: 84, seats: 10 },
  { diameter: 96, seats: 12 }
];

// Room size reference data
const roomSizeReference = [
  { room: "8×10", roomFt: [8, 10], maxTable: "24×48", maxTableIn: [24, 48], seats: "2-4", shape: "Rectangular" },
  { room: "10×10", roomFt: [10, 10], maxTable: "48×48", maxTableIn: [48, 48], seats: "4", shape: "Square/Round" },
  { room: "10×12", roomFt: [10, 12], maxTable: "48×72", maxTableIn: [48, 72], seats: "6", shape: "Rectangular" },
  { room: "12×12", roomFt: [12, 12], maxTable: "72×72", maxTableIn: [72, 72], seats: "6-8", shape: "Any" },
  { room: "12×14", roomFt: [12, 14], maxTable: "72×96", maxTableIn: [72, 96], seats: "8-10", shape: "Rectangular" },
  { room: "14×16", roomFt: [14, 16], maxTable: "96×120", maxTableIn: [96, 120], seats: "10-12", shape: "Rectangular" }
];

// Standard table sizes by seating
const standardTableSizes = [
  { people: 4, rectangular: "48×30\"", round: "42-48\"", square: "36×36\"" },
  { people: 6, rectangular: "60-72×36\"", round: "54-60\"", square: "48×48\"" },
  { people: 8, rectangular: "72-96×40\"", round: "72\"", square: "60×60\"" },
  { people: 10, rectangular: "96-120×42\"", round: "84\"", square: "—" },
  { people: 12, rectangular: "120×42\"", round: "96\"", square: "—" }
];

// FAQ data
const faqs = [
  {
    question: "How big should my dining room table be based on room size?",
    answer: "Subtract 6 feet (72 inches) from your room's length and width to get the maximum table size. This leaves 3 feet of clearance on all sides for comfortable movement and chair access. For example, a 12×10 ft room can fit a table up to 6×4 ft (72×48 inches). If space is tight, you can reduce clearance to 30 inches minimum on one side."
  },
  {
    question: "How big of a table can I fit in a 12x12 room?",
    answer: "In a 12×12 foot room, you can fit a maximum table size of 72×72 inches (6×6 feet) with standard 36-inch clearance on all sides. This works well for a large square table seating 8, or a 72-inch round table seating 8 people comfortably. A rectangular 72×42 inch table is also a good option for 6-8 people."
  },
  {
    question: "What size dining table for an 8x10 room?",
    answer: "An 8×10 foot room is quite small for dining. With 36-inch clearance, the maximum table would be 24×48 inches (2×4 feet), which seats only 2-4 people. Consider a round 42-inch table for 4 people, or a small rectangular 48×30 inch table. Using a bench on one side can help save space."
  },
  {
    question: "What is the normal size of a 6 seater dining table?",
    answer: "A standard 6-seater rectangular table measures 60-72 inches long by 36-40 inches wide (5-6 ft × 3-3.5 ft). For round tables, a 54-60 inch diameter works well for 6 people. Allow 24 inches of table edge per person for comfortable seating. The table should fit in a room at least 10×12 feet."
  },
  {
    question: "How much space do you need around a dining table?",
    answer: "The recommended clearance is 36 inches (3 feet) from the table edge to walls or furniture. This allows people to pull out chairs and walk behind seated guests comfortably. Minimum clearance is 30 inches for tight spaces. For high-traffic areas or wheelchair access, 42-48 inches is ideal."
  },
  {
    question: "What shape dining table is best for a small room?",
    answer: "Round and oval tables work best in small rooms because they have no corners to bump into, create better traffic flow, and feel less bulky visually. A round table also promotes conversation since everyone can see each other. For very narrow rooms, a rectangular table pushed against a wall with a bench may be most space-efficient."
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

// Calculate seating capacity for rectangular table
function calculateRectangularSeating(lengthIn: number, widthIn: number, spacePerPerson: number): number {
  const longSideSeats = Math.floor(lengthIn / spacePerPerson) * 2;
  const shortSideSeats = widthIn >= 36 ? 2 : 0; // End seats if wide enough
  return longSideSeats + shortSideSeats;
}

// Calculate seating capacity for round table
function calculateRoundSeating(diameter: number, spacePerPerson: number): number {
  const circumference = Math.PI * diameter;
  return Math.floor(circumference / spacePerPerson);
}

// Calculate seating capacity for square table
function calculateSquareSeating(side: number, spacePerPerson: number): number {
  return Math.floor(side / spacePerPerson) * 4;
}

export default function DiningRoomTableSizeCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"room" | "seating" | "chart">("room");
  
  // By Room Size state
  const [roomLength, setRoomLength] = useState<string>("12");
  const [roomWidth, setRoomWidth] = useState<string>("10");
  const [tableShape, setTableShape] = useState<string>("rectangular");
  const [clearance, setClearance] = useState<string>("standard");
  
  // By Seating state
  const [numberOfPeople, setNumberOfPeople] = useState<number>(6);
  const [seatingShape, setSeatingShape] = useState<string>("rectangular");
  const [comfortLevel, setComfortLevel] = useState<string>("standard");

  // Calculations for Room Size tab
  const roomLengthIn = (parseFloat(roomLength) || 0) * 12;
  const roomWidthIn = (parseFloat(roomWidth) || 0) * 12;
  const clearanceIn = clearanceOptions.find(c => c.id === clearance)?.inches || 36;
  
  // Max table dimensions
  const maxTableLength = Math.max(0, roomLengthIn - (clearanceIn * 2));
  const maxTableWidth = Math.max(0, roomWidthIn - (clearanceIn * 2));
  
  // For round/square, use smaller dimension
  const maxDiameter = Math.min(maxTableLength, maxTableWidth);
  
  // Calculate seating capacity based on shape
  let seatingCapacity = 0;
  const spacePerPersonStandard = 24;
  
  if (tableShape === "rectangular" || tableShape === "oval") {
    seatingCapacity = calculateRectangularSeating(maxTableLength, maxTableWidth, spacePerPersonStandard);
  } else if (tableShape === "round") {
    seatingCapacity = calculateRoundSeating(maxDiameter, spacePerPersonStandard);
  } else if (tableShape === "square") {
    seatingCapacity = calculateSquareSeating(maxDiameter, spacePerPersonStandard);
  }

  // Calculations for Seating tab
  const spacePerPerson = comfortLevels.find(c => c.id === comfortLevel)?.inches || 24;
  
  let minTableLength = 0;
  let minTableWidth = 36; // Standard width
  let minDiameter = 0;
  let minRoomLength = 0;
  let minRoomWidth = 0;
  
  if (seatingShape === "rectangular") {
    // People on long sides + 2 on ends
    const longSidePeople = Math.max(2, numberOfPeople - 2);
    minTableLength = (longSidePeople / 2) * spacePerPerson;
    minTableWidth = numberOfPeople <= 4 ? 30 : (numberOfPeople <= 8 ? 36 : 42);
    minRoomLength = minTableLength + (36 * 2);
    minRoomWidth = minTableWidth + (36 * 2);
  } else if (seatingShape === "round") {
    const circumference = numberOfPeople * spacePerPerson;
    minDiameter = circumference / Math.PI;
    minRoomLength = minDiameter + (36 * 2);
    minRoomWidth = minDiameter + (36 * 2);
  } else if (seatingShape === "square") {
    const peoplePerSide = numberOfPeople / 4;
    const sideLength = peoplePerSide * spacePerPerson;
    minDiameter = Math.max(36, sideLength);
    minRoomLength = minDiameter + (36 * 2);
    minRoomWidth = minDiameter + (36 * 2);
  }

  const tabs = [
    { id: "room", label: "By Room Size", icon: "📐" },
    { id: "seating", label: "By Seating", icon: "👥" },
    { id: "chart", label: "Size Chart", icon: "📋" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Dining Room Table Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪑</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Dining Room Table Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Find the perfect dining table size for your room. Calculate by room dimensions or number of seats. 
            Supports rectangular, round, square, and oval tables.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Quick Rule: Subtract 6 Feet</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Room size minus 6 feet (3 ft clearance each side) = max table size. A <strong>12×10 ft room</strong> fits a table up to <strong>6×4 ft (72×48&quot;)</strong>.
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
                backgroundColor: activeTab === tab.id ? "#0EA5E9" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#0EA5E9", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "room" && "📐 Room Dimensions"}
                {activeTab === "seating" && "👥 Seating Requirements"}
                {activeTab === "chart" && "📋 Quick Reference"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "room" && (
                <>
                  {/* Room Dimensions */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Room Length (ft)
                      </label>
                      <input
                        type="number"
                        value={roomLength}
                        onChange={(e) => setRoomLength(e.target.value)}
                        placeholder="12"
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
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Room Width (ft)
                      </label>
                      <input
                        type="number"
                        value={roomWidth}
                        onChange={(e) => setRoomWidth(e.target.value)}
                        placeholder="10"
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
                  </div>

                  {/* Table Shape */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Table Shape
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {tableShapes.map(shape => (
                        <button
                          key={shape.id}
                          onClick={() => setTableShape(shape.id)}
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            border: tableShape === shape.id ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                            backgroundColor: tableShape === shape.id ? "#E0F2FE" : "white",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "1.25rem" }}>{shape.icon}</span>
                            <div>
                              <div style={{ fontWeight: "500", color: tableShape === shape.id ? "#0369A1" : "#111827", fontSize: "0.9rem" }}>
                                {shape.name}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clearance */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Clearance Around Table
                    </label>
                    <select
                      value={clearance}
                      onChange={(e) => setClearance(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {clearanceOptions.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.description}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> 36&quot; clearance is ideal. Use 30&quot; minimum against a wall or with a bench.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "seating" && (
                <>
                  {/* Number of People */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Number of People
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {seatingOptions.map(num => (
                        <button
                          key={num}
                          onClick={() => setNumberOfPeople(num)}
                          style={{
                            padding: "12px 20px",
                            borderRadius: "8px",
                            border: numberOfPeople === num ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                            backgroundColor: numberOfPeople === num ? "#E0F2FE" : "white",
                            color: numberOfPeople === num ? "#0369A1" : "#374151",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "1rem"
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table Shape */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Table Shape
                    </label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {tableShapes.slice(0, 3).map(shape => (
                        <button
                          key={shape.id}
                          onClick={() => setSeatingShape(shape.id)}
                          style={{
                            flex: 1,
                            padding: "12px",
                            borderRadius: "8px",
                            border: seatingShape === shape.id ? "2px solid #0EA5E9" : "1px solid #E5E7EB",
                            backgroundColor: seatingShape === shape.id ? "#E0F2FE" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{shape.icon}</div>
                          <div style={{ fontWeight: "500", color: seatingShape === shape.id ? "#0369A1" : "#111827", fontSize: "0.85rem" }}>
                            {shape.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comfort Level */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Space Per Person
                    </label>
                    <select
                      value={comfortLevel}
                      onChange={(e) => setComfortLevel(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {comfortLevels.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.inches}&quot;) - {c.description}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px", border: "1px solid #6EE7B7" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      ✅ <strong>Standard:</strong> Allow 24&quot; per person for comfortable dining.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "chart" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>📏 Room → Table Size</h3>
                    <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "12px" }}>
                      Maximum table sizes with 36&quot; clearance on all sides:
                    </p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#E0F2FE" }}>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>Room</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Max Table</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Seats</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomSizeReference.map((row, idx) => (
                            <tr key={row.room} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.room} ft</td>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.maxTable}&quot;</td>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0EA5E9", fontWeight: "500" }}>{row.seats}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>👥 Seating → Table Size</h3>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                        <thead>
                          <tr style={{ backgroundColor: "#FEF3C7" }}>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "left" }}>People</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Rect.</th>
                            <th style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center" }}>Round</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standardTableSizes.map((row, idx) => (
                            <tr key={row.people} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.people}</td>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.75rem" }}>{row.rectangular}</td>
                              <td style={{ padding: "8px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.75rem" }}>{row.round}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
            <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "room" && "🪑 Recommended Table Size"}
                {activeTab === "seating" && "📐 Minimum Dimensions"}
                {activeTab === "chart" && "📊 Visual Guide"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "room" && (
                <>
                  {/* Max Table Size */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Maximum Table Size</p>
                    {(tableShape === "rectangular" || tableShape === "oval") ? (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#B45309" }}>
                          {maxTableLength}&quot; × {maxTableWidth}&quot;
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#D97706" }}>
                          ({(maxTableLength / 12).toFixed(1)} × {(maxTableWidth / 12).toFixed(1)} ft)
                        </p>
                      </>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#B45309" }}>
                          {maxDiameter}&quot; {tableShape === "round" ? "diameter" : "sides"}
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#D97706" }}>
                          ({(maxDiameter / 12).toFixed(1)} ft)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Seating Capacity */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #6EE7B7",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Estimated Seating</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                      👥 {seatingCapacity} people
                    </p>
                  </div>

                  {/* Visual Layout */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📐 Room Layout</h4>
                    <div style={{ 
                      position: "relative", 
                      width: "100%", 
                      paddingTop: `${(parseFloat(roomWidth) / parseFloat(roomLength)) * 100}%`,
                      backgroundColor: "#E5E7EB",
                      borderRadius: "8px",
                      border: "2px solid #9CA3AF",
                      maxHeight: "200px"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: `${(maxTableLength / roomLengthIn) * 100}%`,
                        height: `${(maxTableWidth / roomWidthIn) * 100}%`,
                        backgroundColor: "#F59E0B",
                        borderRadius: tableShape === "round" ? "50%" : tableShape === "oval" ? "50%" : "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.7rem"
                      }}>
                        TABLE
                      </div>
                    </div>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#6B7280", textAlign: "center" }}>
                      Gray = Room | Orange = Table | White space = Clearance
                    </p>
                  </div>

                  {/* Tips */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3730A3" }}>
                      💡 <strong>Shape tip:</strong> {tableShape === "round" ? "Round tables are great for conversation!" : tableShape === "rectangular" ? "Rectangular maximizes seating capacity." : tableShape === "square" ? "Square works well for 4-8 people." : "Oval offers flexibility with softer edges."}
                    </p>
                  </div>
                </>
              )}

              {activeTab === "seating" && (
                <>
                  {/* Minimum Table Size */}
                  <div style={{
                    backgroundColor: "#E0F2FE",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #0EA5E9",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#0369A1" }}>Minimum Table Size for {numberOfPeople} People</p>
                    {seatingShape === "rectangular" ? (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#0284C7" }}>
                          {Math.round(minTableLength)}&quot; × {minTableWidth}&quot;
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#0369A1" }}>
                          ({(minTableLength / 12).toFixed(1)} × {(minTableWidth / 12).toFixed(1)} ft)
                        </p>
                      </>
                    ) : (
                      <>
                        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#0284C7" }}>
                          {Math.round(minDiameter)}&quot; {seatingShape === "round" ? "diameter" : "sides"}
                        </p>
                        <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#0369A1" }}>
                          ({(minDiameter / 12).toFixed(1)} ft)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Minimum Room Size */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #FCD34D",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Minimum Room Size Needed</p>
                    <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#B45309" }}>
                      {Math.ceil(minRoomLength / 12)} × {Math.ceil(minRoomWidth / 12)} ft
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#D97706" }}>
                      (with 36&quot; clearance)
                    </p>
                  </div>

                  {/* Summary */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>People:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{numberOfPeople}</div>
                      <div style={{ color: "#6B7280" }}>Space/Person:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{spacePerPerson}&quot;</div>
                      <div style={{ color: "#6B7280" }}>Table Shape:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", textTransform: "capitalize" }}>{seatingShape}</div>
                    </div>
                  </div>

                  {/* Common Sizes */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      🛒 <strong>Common {numberOfPeople}-seater:</strong> {
                        seatingShape === "rectangular" 
                          ? standardTableSizes.find(s => s.people === numberOfPeople)?.rectangular || "60-72×36\""
                          : seatingShape === "round"
                          ? standardTableSizes.find(s => s.people === numberOfPeople)?.round || "54-60\""
                          : standardTableSizes.find(s => s.people === numberOfPeople)?.square || "48×48\""
                      }
                    </p>
                  </div>
                </>
              )}

              {activeTab === "chart" && (
                <>
                  {/* Clearance Guide Visual */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 16px 0", color: "#374151", fontSize: "1rem", textAlign: "center" }}>Clearance Guide</h4>
                    <div style={{ 
                      position: "relative",
                      width: "100%",
                      height: "180px",
                      backgroundColor: "#E5E7EB",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {/* Table */}
                      <div style={{
                        width: "50%",
                        height: "40%",
                        backgroundColor: "#F59E0B",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.8rem"
                      }}>
                        TABLE
                      </div>
                      {/* Clearance labels */}
                      <div style={{ position: "absolute", top: "8px", left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", color: "#374151" }}>
                        ↕ 36&quot; min
                      </div>
                      <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", fontSize: "0.7rem", color: "#374151" }}>
                        ↕ 36&quot; min
                      </div>
                      <div style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "#374151" }}>
                        ↔ 36&quot;
                      </div>
                      <div style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", color: "#374151" }}>
                        ↔ 36&quot;
                      </div>
                    </div>
                  </div>

                  {/* Key Tips */}
                  <div style={{ marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>🔑 Key Guidelines</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                      <p style={{ margin: "0 0 8px 0" }}>• <strong>36&quot; clearance</strong> = comfortable chair movement</p>
                      <p style={{ margin: "0 0 8px 0" }}>• <strong>30&quot; minimum</strong> = tight but workable</p>
                      <p style={{ margin: "0 0 8px 0" }}>• <strong>42-48&quot;</strong> = high traffic / wheelchair access</p>
                      <p style={{ margin: "0 0 8px 0" }}>• <strong>24&quot; per person</strong> = standard seating width</p>
                      <p style={{ margin: 0 }}>• <strong>30&quot; table height</strong> = standard dining height</p>
                    </div>
                  </div>

                  {/* Shape Comparison */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#3730A3", fontSize: "0.85rem" }}>🔄 Shape Comparison</h4>
                    <div style={{ fontSize: "0.8rem", color: "#4338CA" }}>
                      <p style={{ margin: "0 0 4px 0" }}><strong>Rectangular:</strong> Best capacity, fits long rooms</p>
                      <p style={{ margin: "0 0 4px 0" }}><strong>Round:</strong> Great conversation, small spaces</p>
                      <p style={{ margin: "0 0 4px 0" }}><strong>Square:</strong> Intimate, equal seating</p>
                      <p style={{ margin: 0 }}><strong>Oval:</strong> Soft edges, flexible layout</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reference Tables */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0EA5E9", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Complete Room & Table Size Reference</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#E0F2FE" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Room Size</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Max Table Size</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Seating</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Best Shape</th>
                </tr>
              </thead>
              <tbody>
                {roomSizeReference.map((row, idx) => (
                  <tr key={row.room} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.room} ft</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.maxTable}&quot;</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0EA5E9", fontWeight: "600" }}>{row.seats}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.shape}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Based on 36&quot; (3 ft) clearance on all sides. Reduce clearance for smaller spaces or wall-side seating.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪑 How to Choose the Right Dining Table Size</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The 6-Foot Rule</h3>
                <p>
                  The simplest way to find your maximum table size is the <strong>&quot;subtract 6 feet&quot; rule</strong>. 
                  Measure your room&apos;s length and width, then subtract 6 feet from each dimension. This leaves 
                  3 feet of clearance on all sides—enough space to pull out chairs and walk behind seated guests.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Space Per Person</h3>
                <p>
                  For comfortable dining, allow <strong>24 inches of table edge per person</strong>. This gives 
                  everyone enough elbow room without feeling cramped. For formal dining or larger chairs, 
                  consider 28-30 inches per person. In tight spaces, you can squeeze to 22 inches.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Shape</h3>
                <p>
                  <strong>Rectangular tables</strong> maximize seating and work well in long rooms. 
                  <strong>Round tables</strong> are ideal for conversation and feel less cramped in small spaces. 
                  <strong>Square tables</strong> work best for 4-8 people in square rooms. 
                  <strong>Oval tables</strong> combine the capacity of rectangular with the softer feel of round.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#E0F2FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #7DD3FC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0369A1", marginBottom: "16px" }}>✨ Quick Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#0284C7", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Round tables seat more than you&apos;d expect</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use a bench to save space on one side</p>
                <p style={{ margin: "0 0 8px 0" }}>• Extension leaves add flexibility</p>
                <p style={{ margin: 0 }}>• Pedestal bases = more leg room</p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Common Mistakes</h3>
              <div style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Buying too large for the room</p>
                <p style={{ margin: "0 0 8px 0" }}>• Forgetting chair depth</p>
                <p style={{ margin: "0 0 8px 0" }}>• Not measuring doorways</p>
                <p style={{ margin: 0 }}>• Ignoring traffic flow</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/dining-room-table-size-calculator" currentCategory="Home" />
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
            🪑 <strong>Disclaimer:</strong> This calculator provides estimates based on standard guidelines. 
            Actual requirements may vary based on chair size, furniture placement, and personal preferences. 
            Always measure your specific space before purchasing furniture.
          </p>
        </div>
      </div>
    </div>
  );
}