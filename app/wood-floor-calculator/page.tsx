"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Flooring type data with price ranges
const flooringTypes = [
  { id: 'hardwood', name: 'Hardwood (Solid)', icon: '🪵', materialLow: 6, materialHigh: 18, installLow: 3, installHigh: 8 },
  { id: 'engineered', name: 'Engineered Wood', icon: '🏗️', materialLow: 4, materialHigh: 12, installLow: 3, installHigh: 6 },
  { id: 'laminate', name: 'Laminate', icon: '📋', materialLow: 1, materialHigh: 5, installLow: 2, installHigh: 4 },
  { id: 'vinyl', name: 'Vinyl / LVT', icon: '✨', materialLow: 2, materialHigh: 7, installLow: 1, installHigh: 3 },
];

// Waste factor options
const wasteOptions = [
  { value: 5, label: '5%', desc: 'Simple rectangular rooms' },
  { value: 10, label: '10%', desc: 'Standard (recommended)' },
  { value: 15, label: '15%', desc: 'Complex / diagonal install' },
];

// Common room sizes for reference
const commonRoomSizes = [
  { name: 'Small Bedroom', length: 10, width: 10, sqft: 100 },
  { name: 'Standard Bedroom', length: 12, width: 12, sqft: 144 },
  { name: 'Master Bedroom', length: 14, width: 16, sqft: 224 },
  { name: 'Living Room', length: 15, width: 20, sqft: 300 },
  { name: 'Kitchen', length: 12, width: 14, sqft: 168 },
  { name: 'Bathroom', length: 8, width: 10, sqft: 80 },
  { name: 'Hallway', length: 20, width: 4, sqft: 80 },
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much wood flooring I need?",
    answer: "Measure the length and width of each room in feet, then multiply them to get the square footage. Add up all rooms, then add 10% extra for waste (cuts, mistakes, and future repairs). For example: a 12x15 room = 180 sq ft, plus 10% waste = 198 sq ft needed. Divide by the coverage per box to know how many boxes to buy."
  },
  {
    question: "How much hardwood flooring for a 12x12 room?",
    answer: "A 12x12 room is 144 square feet. With a standard 10% waste factor, you'll need about 158-160 square feet of flooring. If your flooring comes in boxes of 20 sq ft each, you'll need 8 boxes. Always round up to the nearest full box."
  },
  {
    question: "How many packs of wood flooring do I need?",
    answer: "To calculate the number of packs/boxes: First, determine your total square footage including waste. Then divide by the square feet per box (typically 20-30 sq ft). Always round up. For example: 200 sq ft total ÷ 25 sq ft per box = 8 boxes needed."
  },
  {
    question: "How much is 1000 sq ft of hardwood flooring?",
    answer: "For 1000 sq ft of hardwood flooring, expect to pay $6,000-$18,000 for materials alone ($6-$18 per sq ft). Including professional installation ($3-$8 per sq ft), the total cost ranges from $9,000 to $26,000. Engineered wood and laminate are more budget-friendly options."
  },
  {
    question: "What waste factor should I use for flooring?",
    answer: "Use 5% for simple rectangular rooms with few obstacles. Use 10% (recommended) for standard installations with some corners and doorways. Use 15% for complex room shapes, diagonal installations, patterned layouts, or if you're a DIY beginner. When in doubt, go with the higher percentage."
  },
  {
    question: "How do I measure an irregular shaped room?",
    answer: "Break the room into smaller rectangles or squares. Measure each section's length and width separately, calculate the square footage of each (length × width), then add them all together. Include closets and alcoves if you're flooring them. Our calculator supports multiple areas for this purpose."
  }
];

// Room interface
interface Room {
  id: number;
  name: string;
  length: string;
  width: string;
}

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

export default function WoodFloorCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'cost' | 'tips'>('calculator');

  // Calculator state
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: 'Room 1', length: '12', width: '12' }
  ]);
  const [flooringType, setFlooringType] = useState('hardwood');
  const [wastePercent, setWastePercent] = useState(10);
  const [boxCoverage, setBoxCoverage] = useState('20');
  const [pricePerSqFt, setPricePerSqFt] = useState('');

  // Add room
  const addRoom = () => {
    const newId = Math.max(...rooms.map(r => r.id), 0) + 1;
    setRooms([...rooms, { id: newId, name: `Room ${newId}`, length: '', width: '' }]);
  };

  // Remove room
  const removeRoom = (id: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  // Update room
  const updateRoom = (id: number, field: keyof Room, value: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Calculate results
  const results = useMemo(() => {
    // Calculate each room's area
    const roomResults = rooms.map(room => {
      const length = parseFloat(room.length) || 0;
      const width = parseFloat(room.width) || 0;
      let area = length * width;
      
      // Convert metric to sq ft if needed
      if (unitSystem === 'metric') {
        area = area * 10.764; // m² to sq ft
      }
      
      return {
        ...room,
        area: area
      };
    });

    const totalRoomArea = roomResults.reduce((sum, room) => sum + room.area, 0);
    
    if (totalRoomArea === 0) {
      return null;
    }

    // Calculate with waste
    const wasteMultiplier = 1 + (wastePercent / 100);
    const totalWithWaste = totalRoomArea * wasteMultiplier;
    const wasteAmount = totalWithWaste - totalRoomArea;

    // Calculate boxes needed
    const boxCov = parseFloat(boxCoverage) || 20;
    const boxesNeeded = Math.ceil(totalWithWaste / boxCov);
    const actualCoverage = boxesNeeded * boxCov;
    const extraCoverage = actualCoverage - totalRoomArea;

    // Calculate cost if price provided
    const price = parseFloat(pricePerSqFt) || 0;
    const materialCost = price > 0 ? actualCoverage * price : null;

    // Get flooring type info for cost estimate
    const floorInfo = flooringTypes.find(f => f.id === flooringType);
    const estimatedCostLow = floorInfo ? totalWithWaste * (floorInfo.materialLow + floorInfo.installLow) : 0;
    const estimatedCostHigh = floorInfo ? totalWithWaste * (floorInfo.materialHigh + floorInfo.installHigh) : 0;

    return {
      roomResults,
      totalRoomArea,
      wasteAmount,
      totalWithWaste,
      boxesNeeded,
      boxCoverage: boxCov,
      actualCoverage,
      extraCoverage,
      materialCost,
      estimatedCostLow,
      estimatedCostHigh,
      floorInfo
    };
  }, [rooms, unitSystem, wastePercent, boxCoverage, pricePerSqFt, flooringType]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FDF5E6" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #DEB887" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Wood Floor Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪵</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Wood Floor Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much flooring you need for your project. Get the total square footage, 
            number of boxes to buy, and estimated cost for hardwood, laminate, or vinyl flooring.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#DEB887",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #D2691E"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#8B4513", margin: "0 0 4px 0" }}>
                <strong>Quick Guide:</strong> For a 12x12 room (144 sq ft)
              </p>
              <p style={{ color: "#A0522D", margin: 0, fontSize: "0.95rem" }}>
                With 10% waste = 158 sq ft needed → 8 boxes (at 20 sq ft/box)
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("calculator")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "calculator" ? "#8B4513" : "#DEB887",
              color: activeTab === "calculator" ? "white" : "#8B4513",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Floor Calculator
          </button>
          <button
            onClick={() => setActiveTab("cost")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "cost" ? "#8B4513" : "#DEB887",
              color: activeTab === "cost" ? "white" : "#8B4513",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Cost Guide
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "tips" ? "#8B4513" : "#DEB887",
              color: activeTab === "tips" ? "white" : "#8B4513",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📏 Measurement Tips
          </button>
        </div>

        {/* Tab 1: Floor Calculator */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #DEB887",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#8B4513", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📐 Room Dimensions
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Unit System */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Units
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setUnitSystem('imperial')}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: unitSystem === 'imperial' ? "2px solid #8B4513" : "1px solid #DEB887",
                        backgroundColor: unitSystem === 'imperial' ? "#FDF5E6" : "white",
                        cursor: "pointer",
                        fontWeight: unitSystem === 'imperial' ? "600" : "400",
                        color: unitSystem === 'imperial' ? "#8B4513" : "#4B5563"
                      }}
                    >
                      🇺🇸 Feet (ft)
                    </button>
                    <button
                      onClick={() => setUnitSystem('metric')}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: unitSystem === 'metric' ? "2px solid #8B4513" : "1px solid #DEB887",
                        backgroundColor: unitSystem === 'metric' ? "#FDF5E6" : "white",
                        cursor: "pointer",
                        fontWeight: unitSystem === 'metric' ? "600" : "400",
                        color: unitSystem === 'metric' ? "#8B4513" : "#4B5563"
                      }}
                    >
                      🌍 Meters (m)
                    </button>
                  </div>
                </div>

                {/* Rooms */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Room Dimensions
                  </label>
                  
                  {rooms.map((room, index) => (
                    <div key={room.id} style={{
                      backgroundColor: "#FFFAF0",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "12px",
                      border: "1px solid #DEB887"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                          style={{
                            border: "none",
                            background: "none",
                            fontWeight: "600",
                            color: "#8B4513",
                            fontSize: "0.9rem",
                            padding: "4px 0"
                          }}
                        />
                        {rooms.length > 1 && (
                          <button
                            onClick={() => removeRoom(room.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#EF4444",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="number"
                            value={room.length}
                            onChange={(e) => updateRoom(room.id, 'length', e.target.value)}
                            placeholder="Length"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "1px solid #DEB887",
                              fontSize: "0.9rem",
                              boxSizing: "border-box"
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            {unitSystem === 'imperial' ? 'feet' : 'meters'}
                          </span>
                        </div>
                        <span style={{ color: "#6B7280" }}>×</span>
                        <div style={{ flex: 1 }}>
                          <input
                            type="number"
                            value={room.width}
                            onChange={(e) => updateRoom(room.id, 'width', e.target.value)}
                            placeholder="Width"
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: "6px",
                              border: "1px solid #DEB887",
                              fontSize: "0.9rem",
                              boxSizing: "border-box"
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            {unitSystem === 'imperial' ? 'feet' : 'meters'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addRoom}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px dashed #DEB887",
                      backgroundColor: "transparent",
                      color: "#8B4513",
                      cursor: "pointer",
                      fontWeight: "500"
                    }}
                  >
                    + Add Another Room
                  </button>
                </div>

                {/* Flooring Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Flooring Type
                  </label>
                  <select
                    value={flooringType}
                    onChange={(e) => setFlooringType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #DEB887",
                      fontSize: "1rem",
                      backgroundColor: "white"
                    }}
                  >
                    {flooringTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Waste Factor
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {wasteOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setWastePercent(option.value)}
                        style={{
                          flex: 1,
                          padding: "10px 8px",
                          borderRadius: "8px",
                          border: wastePercent === option.value ? "2px solid #8B4513" : "1px solid #DEB887",
                          backgroundColor: wastePercent === option.value ? "#FDF5E6" : "white",
                          cursor: "pointer",
                          fontWeight: wastePercent === option.value ? "600" : "400",
                          color: wastePercent === option.value ? "#8B4513" : "#4B5563",
                          fontSize: "0.85rem"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                    {wasteOptions.find(o => o.value === wastePercent)?.desc}
                  </p>
                </div>

                {/* Box Coverage */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Square Feet per Box
                  </label>
                  <input
                    type="number"
                    value={boxCoverage}
                    onChange={(e) => setBoxCoverage(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #DEB887",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    Typically 20-30 sq ft per box (check your product)
                  </span>
                </div>

                {/* Price (Optional) */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Price per Sq Ft (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                    <input
                      type="number"
                      value={pricePerSqFt}
                      onChange={(e) => setPricePerSqFt(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: "100%",
                        padding: "12px 12px 12px 28px",
                        borderRadius: "8px",
                        border: "1px solid #DEB887",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #DEB887",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#A0522D", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 Flooring Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {results ? (
                  <>
                    {/* Main Result - Boxes Needed */}
                    <div style={{
                      backgroundColor: "#FDF5E6",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #8B4513"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#A0522D" }}>
                        Boxes Needed
                      </p>
                      <p style={{ margin: 0, fontSize: "4rem", fontWeight: "bold", color: "#8B4513" }}>
                        {results.boxesNeeded}
                      </p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#A0522D" }}>
                        boxes @ {results.boxCoverage} sq ft each
                      </p>
                    </div>

                    {/* Area Breakdown */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        Area Breakdown:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Total Room Area</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{results.totalRoomArea.toFixed(1)} sq ft</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                          <span style={{ color: "#92400E" }}>+ Waste ({wastePercent}%)</span>
                          <span style={{ fontWeight: "600", color: "#92400E" }}>+{results.wasteAmount.toFixed(1)} sq ft</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#DCFCE7", borderRadius: "6px" }}>
                          <span style={{ color: "#166534" }}>Total Needed</span>
                          <span style={{ fontWeight: "600", color: "#166534" }}>{results.totalWithWaste.toFixed(1)} sq ft</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#DBEAFE", borderRadius: "6px" }}>
                          <span style={{ color: "#1E40AF" }}>Actual Purchase ({results.boxesNeeded} boxes)</span>
                          <span style={{ fontWeight: "600", color: "#1E40AF" }}>{results.actualCoverage.toFixed(1)} sq ft</span>
                        </div>
                      </div>
                    </div>

                    {/* Room Details */}
                    {results.roomResults.length > 1 && (
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                          Room Details:
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          {results.roomResults.map(room => (
                            <div key={room.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#FFFAF0", borderRadius: "6px", fontSize: "0.85rem" }}>
                              <span style={{ color: "#8B4513" }}>{room.name}</span>
                              <span style={{ fontWeight: "500", color: "#A0522D" }}>{room.area.toFixed(1)} sq ft</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cost Estimate */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E", fontWeight: "600" }}>
                        💰 Estimated Total Cost
                      </p>
                      {results.materialCost ? (
                        <p style={{ margin: "8px 0 0 0", fontSize: "1.25rem", fontWeight: "bold", color: "#B45309" }}>
                          ${results.materialCost.toFixed(2)}
                        </p>
                      ) : (
                        <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#B45309" }}>
                          ${results.estimatedCostLow.toLocaleString()} - ${results.estimatedCostHigh.toLocaleString()}
                          <span style={{ fontSize: "0.75rem", display: "block", marginTop: "4px" }}>
                            ({results.floorInfo?.name}, including installation)
                          </span>
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>📐</p>
                    <p style={{ margin: 0 }}>Enter room dimensions to see your flooring estimate</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cost Guide */}
        {activeTab === 'cost' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DEB887",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
              💰 Flooring Cost Guide
            </h2>

            {/* Cost Table */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#8B4513", marginBottom: "16px" }}>
                📊 Cost per Square Foot by Type
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FDF5E6" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Flooring Type</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Material</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Installation</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flooringTypes.map((type, index) => (
                      <tr key={type.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FFFAF0' }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ marginRight: "8px" }}>{type.icon}</span>
                          {type.name}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
                          ${type.materialLow} - ${type.materialHigh}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
                          ${type.installLow} - ${type.installHigh}
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#8B4513" }}>
                          ${type.materialLow + type.installLow} - ${type.materialHigh + type.installHigh}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Room Sizes */}
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#8B4513", marginBottom: "16px" }}>
                📐 Common Room Sizes Reference
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FDF5E6" }}>
                      <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Room Type</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Dimensions</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>Sq Ft</th>
                      <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #DEB887", fontWeight: "600" }}>With 10% Waste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonRoomSizes.map((room, index) => (
                      <tr key={room.name} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FFFAF0' }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>{room.name}</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
                          {room.length}&apos; × {room.width}&apos;
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>
                          {room.sqft} sq ft
                        </td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#8B4513" }}>
                          {Math.ceil(room.sqft * 1.1)} sq ft
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Measurement Tips */}
        {activeTab === 'tips' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DEB887",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📏 How to Measure for Flooring
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Accurate measurements are crucial to avoid buying too much or too little flooring material.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {/* Rectangular Rooms */}
              <div style={{ padding: "20px", backgroundColor: "#FDF5E6", borderRadius: "12px", border: "1px solid #DEB887" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#8B4513", fontSize: "1.125rem" }}>📐 Rectangular Rooms</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Simply measure the length and width at the widest points. Multiply length × width to get the square footage. 
                  For example: 12 ft × 15 ft = 180 sq ft.
                </p>
              </div>

              {/* L-Shaped Rooms */}
              <div style={{ padding: "20px", backgroundColor: "#DBEAFE", borderRadius: "12px", border: "1px solid #93C5FD" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#1E40AF", fontSize: "1.125rem" }}>🔲 L-Shaped Rooms</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Break the room into two or more rectangles. Measure each section separately, calculate the square footage of each, 
                  then add them together. Our calculator supports multiple areas for this purpose.
                </p>
              </div>

              {/* Closets & Alcoves */}
              <div style={{ padding: "20px", backgroundColor: "#DCFCE7", borderRadius: "12px", border: "1px solid #86EFAC" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#166534", fontSize: "1.125rem" }}>🚪 Closets & Alcoves</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Include any closets or alcoves you plan to floor. Measure them as separate rectangles and add to your total. 
                  Don&apos;t forget walk-in closets, mudrooms, and pantries.
                </p>
              </div>

              {/* Waste Factor */}
              <div style={{ padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "1.125rem" }}>♻️ Choosing Waste Factor</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  <strong>5%:</strong> Simple rectangular rooms, experienced installer<br/>
                  <strong>10%:</strong> Standard rooms, some corners/doorways<br/>
                  <strong>15%:</strong> Complex shapes, diagonal install, DIY beginner
                </p>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "1rem" }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563", lineHeight: "1.8" }}>
                <li>Always round UP to the nearest full box</li>
                <li>Keep 1-2 extra boxes for future repairs</li>
                <li>Buy all flooring from the same batch to ensure consistent color</li>
                <li>Check your product&apos;s sq ft per box before ordering</li>
                <li>Account for doorway transitions (add 2 inches per doorway)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DEB887", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪵 How to Calculate Wood Flooring Needs</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Planning a flooring project requires careful calculation to ensure you purchase the right amount 
                  of material. Buying too little means delays and potential color matching issues. Buying too much 
                  wastes money. Here&apos;s how to get it right.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 1: Measure Your Space</h3>
                <p>
                  For each room, measure the length and width in feet. Multiply these numbers to get the square 
                  footage. For a 12&apos; × 15&apos; room, that&apos;s 180 square feet. Add up all rooms you plan to floor.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 2: Add Waste Factor</h3>
                <div style={{
                  backgroundColor: "#FDF5E6",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #DEB887"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#8B4513" }}>Why add waste?</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#A0522D" }}>
                    <li>Cutting planks to fit creates unusable pieces</li>
                    <li>Some planks may be damaged in shipping</li>
                    <li>Mistakes happen during installation</li>
                    <li>You&apos;ll want extras for future repairs</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Step 3: Calculate Boxes Needed</h3>
                <p>
                  Check how many square feet each box covers (usually 20-30 sq ft). Divide your total square 
                  footage by the box coverage, then round UP. Always round up—you can&apos;t buy half a box!
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Example Calculation</h3>
                <div style={{
                  backgroundColor: "#DBEAFE",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, color: "#1E40AF", lineHeight: "2" }}>
                    Room: 12&apos; × 15&apos; = <strong>180 sq ft</strong><br/>
                    + 10% waste = 180 × 1.10 = <strong>198 sq ft</strong><br/>
                    ÷ 20 sq ft/box = 9.9 → <strong>10 boxes needed</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#FDF5E6", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DEB887" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#8B4513", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#A0522D", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 100 sq ft + 10% = 110 sq ft</p>
                <p style={{ margin: 0 }}>• 200 sq ft + 10% = 220 sq ft</p>
                <p style={{ margin: 0 }}>• 300 sq ft + 10% = 330 sq ft</p>
                <p style={{ margin: 0 }}>• 500 sq ft + 10% = 550 sq ft</p>
                <p style={{ margin: 0 }}>• 1000 sq ft + 10% = 1100 sq ft</p>
              </div>
            </div>

            {/* Did You Know */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: 0 }}>Hardwood flooring can last 100+ years with proper care, making it one of the most durable flooring options available.</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/wood-floor-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DEB887", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#FDF5E6", borderRadius: "8px", border: "1px solid #DEB887" }}>
          <p style={{ fontSize: "0.75rem", color: "#8B4513", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates only. Actual material needs may vary 
            based on room layout, installation pattern, and product specifications. Always verify with your flooring 
            supplier and consider buying 1-2 extra boxes for future repairs.
          </p>
        </div>
      </div>
    </div>
  );
}