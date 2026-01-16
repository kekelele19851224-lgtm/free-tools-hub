"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How do you calculate cargo density?",
    answer: "Cargo density is calculated by dividing the total weight (in pounds) by the total volume (in cubic feet). The formula is: Density = Weight (lbs) ÷ Cubic Feet. To get cubic feet from inch measurements: Cubic Feet = (Length × Width × Height) ÷ 1,728. For example, a 150 lb shipment measuring 48×40×36 inches has a volume of 40 cubic feet and a density of 3.75 lbs/cu ft."
  },
  {
    question: "How to determine freight class for XPO?",
    answer: "XPO and other LTL carriers use the NMFC (National Motor Freight Classification) system. Freight class is primarily determined by density, but also considers handling, stowability, and liability. Use our calculator to find your density, then match it to the freight class chart. Higher density = lower class = lower shipping cost. Most commodities fall into one of 18 classes from 50 to 500."
  },
  {
    question: "What is the NMFC freight class system?",
    answer: "The NMFC system is a standardized classification system created by the National Motor Freight Traffic Association (NMFTA). It assigns freight classes (50-500) based on four factors: density (weight per cubic foot), handling requirements, stowability, and liability. Class 50 is the cheapest to ship (heavy, dense items) while Class 500 is the most expensive (light, bulky items)."
  },
  {
    question: "Why is freight class important?",
    answer: "Freight class directly affects your shipping costs. Incorrectly classifying your freight can result in reclassification fees, billing adjustments, and unexpected charges. Carriers may weigh and measure your shipment to verify the class. Accurate classification helps you get accurate quotes and avoid surprises on your invoice."
  },
  {
    question: "What factors affect freight class besides density?",
    answer: "While density is the primary factor, freight class also considers: Handling - special equipment or care needed; Stowability - how well it fits with other freight; Liability - risk of damage, theft, or perishability. Hazardous materials, fragile items, or irregularly shaped freight may be assigned a higher class regardless of density."
  },
  {
    question: "What is the difference between Class 50 and Class 500 freight?",
    answer: "Class 50 freight is very dense (≥50 lbs/cu ft), compact, and easy to handle - like nuts, bolts, or steel. It's the cheapest to ship. Class 500 freight is very light (<1 lb/cu ft), bulky, and takes up lots of space - like ping pong balls or styrofoam. The huge difference in density means Class 500 can cost 5-10x more to ship than Class 50 for the same weight."
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

// Freight class data (NMFC 2025 updated 13-tier density scale)
const freightClassData = [
  { classNum: 50, minDensity: 50, maxDensity: null, examples: "Nuts, bolts, steel, heavy machinery" },
  { classNum: 55, minDensity: 35, maxDensity: 50, examples: "Bricks, hardwood flooring, cement" },
  { classNum: 60, minDensity: 30, maxDensity: 35, examples: "Car parts, car accessories" },
  { classNum: 65, minDensity: 22.5, maxDensity: 30, examples: "Car accessories, bottled beverages" },
  { classNum: 70, minDensity: 15, maxDensity: 22.5, examples: "Food items, car parts, machinery" },
  { classNum: 77.5, minDensity: 13.5, maxDensity: 15, examples: "Tires, bathroom fixtures" },
  { classNum: 85, minDensity: 12, maxDensity: 13.5, examples: "Crated machinery, cast iron stoves" },
  { classNum: 92.5, minDensity: 10.5, maxDensity: 12, examples: "Computers, monitors, refrigerators" },
  { classNum: 100, minDensity: 9, maxDensity: 10.5, examples: "Boat covers, car covers, canvas" },
  { classNum: 110, minDensity: 8, maxDensity: 9, examples: "Cabinets, framed artwork, table saws" },
  { classNum: 125, minDensity: 7, maxDensity: 8, examples: "Small household appliances" },
  { classNum: 150, minDensity: 6, maxDensity: 7, examples: "Auto sheet metal, bookcases" },
  { classNum: 175, minDensity: 5, maxDensity: 6, examples: "Clothing, couches, stuffed furniture" },
  { classNum: 200, minDensity: 4, maxDensity: 5, examples: "Auto parts, aluminum tables, packaged mattresses" },
  { classNum: 250, minDensity: 3, maxDensity: 4, examples: "Bamboo furniture, mattresses, plasma TVs" },
  { classNum: 300, minDensity: 2, maxDensity: 3, examples: "Wood cabinets, tables, chairs" },
  { classNum: 400, minDensity: 1, maxDensity: 2, examples: "Deer antlers, light fixtures" },
  { classNum: 500, minDensity: 0, maxDensity: 1, examples: "Ping pong balls, gold fish, low density items" },
];

// Get freight class from density
function getFreightClass(density: number): { classNum: number; color: string; label: string } {
  for (const fc of freightClassData) {
    if (fc.maxDensity === null && density >= fc.minDensity) {
      return { classNum: fc.classNum, color: "#059669", label: "Lowest Cost" };
    }
    if (fc.maxDensity !== null && density >= fc.minDensity && density < fc.maxDensity) {
      if (fc.classNum <= 70) return { classNum: fc.classNum, color: "#059669", label: "Low Cost" };
      if (fc.classNum <= 100) return { classNum: fc.classNum, color: "#D97706", label: "Medium Cost" };
      if (fc.classNum <= 175) return { classNum: fc.classNum, color: "#EA580C", label: "Higher Cost" };
      return { classNum: fc.classNum, color: "#DC2626", label: "High Cost" };
    }
  }
  return { classNum: 500, color: "#DC2626", label: "Highest Cost" };
}

// Common pallet sizes
const palletSizes = [
  { name: "Custom", length: "", width: "", height: "" },
  { name: "Standard Pallet (48×40×48)", length: "48", width: "40", height: "48" },
  { name: "Standard Pallet (48×40×36)", length: "48", width: "40", height: "36" },
  { name: "Euro Pallet (47×32×48)", length: "47", width: "32", height: "48" },
  { name: "Half Pallet (48×20×36)", length: "48", width: "20", height: "36" },
];

export default function FreightDensityCalculator() {
  const [activeTab, setActiveTab] = useState<'single' | 'multi' | 'chart'>('single');

  // Tab 1: Single piece inputs
  const [weight, setWeight] = useState<string>("150");
  const [length, setLength] = useState<string>("48");
  const [width, setWidth] = useState<string>("40");
  const [height, setHeight] = useState<string>("36");
  const [unit, setUnit] = useState<'inches' | 'feet' | 'cm'>('inches');
  const [selectedPallet, setSelectedPallet] = useState<string>("Custom");

  // Tab 2: Multi-piece
  const [pieces, setPieces] = useState([
    { id: 1, weight: "150", length: "48", width: "40", height: "36" },
  ]);

  // Handle pallet selection
  const handlePalletSelect = (palletName: string) => {
    setSelectedPallet(palletName);
    const pallet = palletSizes.find(p => p.name === palletName);
    if (pallet && palletName !== "Custom") {
      setLength(pallet.length);
      setWidth(pallet.width);
      setHeight(pallet.height);
    }
  };

  // Tab 1 Calculations
  const singleResults = useMemo(() => {
    const w = parseFloat(weight) || 0;
    let l = parseFloat(length) || 0;
    let wd = parseFloat(width) || 0;
    let h = parseFloat(height) || 0;

    // Convert to inches based on unit
    if (unit === 'feet') {
      l *= 12;
      wd *= 12;
      h *= 12;
    } else if (unit === 'cm') {
      l /= 2.54;
      wd /= 2.54;
      h /= 2.54;
    }

    const cubicInches = l * wd * h;
    const cubicFeet = cubicInches / 1728;
    const density = cubicFeet > 0 ? w / cubicFeet : 0;
    const freightClass = getFreightClass(density);

    return {
      cubicInches: Math.round(cubicInches),
      cubicFeet: Math.round(cubicFeet * 100) / 100,
      density: Math.round(density * 100) / 100,
      freightClass,
      weight: w
    };
  }, [weight, length, width, height, unit]);

  // Tab 2 Calculations - Multi-piece
  const multiResults = useMemo(() => {
    let totalWeight = 0;
    let totalCubicFeet = 0;

    const pieceDetails = pieces.map(piece => {
      const w = parseFloat(piece.weight) || 0;
      const l = parseFloat(piece.length) || 0;
      const wd = parseFloat(piece.width) || 0;
      const h = parseFloat(piece.height) || 0;

      const cubicInches = l * wd * h;
      const cubicFeet = cubicInches / 1728;

      totalWeight += w;
      totalCubicFeet += cubicFeet;

      return {
        ...piece,
        cubicFeet: Math.round(cubicFeet * 100) / 100
      };
    });

    const combinedDensity = totalCubicFeet > 0 ? totalWeight / totalCubicFeet : 0;
    const freightClass = getFreightClass(combinedDensity);

    return {
      pieceDetails,
      totalWeight: Math.round(totalWeight),
      totalCubicFeet: Math.round(totalCubicFeet * 100) / 100,
      combinedDensity: Math.round(combinedDensity * 100) / 100,
      freightClass
    };
  }, [pieces]);

  // Add piece
  const addPiece = () => {
    setPieces([...pieces, {
      id: Date.now(),
      weight: "",
      length: "",
      width: "",
      height: ""
    }]);
  };

  // Remove piece
  const removePiece = (id: number) => {
    if (pieces.length > 1) {
      setPieces(pieces.filter(p => p.id !== id));
    }
  };

  // Update piece
  const updatePiece = (id: number, field: string, value: string) => {
    setPieces(pieces.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Freight Density Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>📦</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Freight Density Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate cargo density and determine freight class for LTL shipments. 
            Works for XPO, FedEx, UPS, Saia, Estes, and all NMFC-based carriers.
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
                <strong>Density Formula:</strong> Weight (lbs) ÷ Cubic Feet = Density (lbs/cu ft)
              </p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                Higher density = Lower freight class = Lower shipping cost
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("single")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "single" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "single" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📦 Single Piece
          </button>
          <button
            onClick={() => setActiveTab("multi")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "multi" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "multi" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📦📦 Multi-Piece
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "chart" ? "#7C3AED" : "#E5E7EB",
              color: activeTab === "chart" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Class Chart
          </button>
        </div>

        {/* Tab 1: Single Piece Calculator */}
        {activeTab === 'single' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦 Shipment Dimensions
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Unit Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Measurement Unit
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(['inches', 'feet', 'cm'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: unit === u ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                          backgroundColor: unit === u ? "#F3E8FF" : "white",
                          cursor: "pointer",
                          fontWeight: unit === u ? "600" : "400",
                          color: unit === u ? "#7C3AED" : "#374151",
                          textTransform: "capitalize"
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Pallet Select */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Quick Select (Common Pallets)
                  </label>
                  <select
                    value={selectedPallet}
                    onChange={(e) => handlePalletSelect(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    {palletSizes.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Weight */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="150"
                  />
                </div>

                {/* Dimensions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Length ({unit})
                    </label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => { setLength(e.target.value); setSelectedPallet("Custom"); }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="48"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Width ({unit})
                    </label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => { setWidth(e.target.value); setSelectedPallet("Custom"); }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Height ({unit})
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => { setHeight(e.target.value); setSelectedPallet("Custom"); }}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="36"
                    />
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#F3E8FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9" }}>
                    💡 <strong>Tip:</strong> Measure the extreme dimensions including packaging. 
                    Round up to the nearest inch for accuracy.
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
                  📊 Results
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Freight Class Display */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: `2px solid ${singleResults.freightClass.color}`
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B7280" }}>
                    Estimated Freight Class
                  </p>
                  <p style={{ margin: 0, fontSize: "3.5rem", fontWeight: "bold", color: singleResults.freightClass.color }}>
                    {singleResults.freightClass.classNum}
                  </p>
                  <p style={{ 
                    margin: "8px 0 0 0", 
                    fontSize: "0.9rem",
                    color: singleResults.freightClass.color,
                    fontWeight: "600"
                  }}>
                    {singleResults.freightClass.label}
                  </p>
                </div>

                {/* Density Display */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                    Density
                  </p>
                  <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#059669" }}>
                    {singleResults.density} <span style={{ fontSize: "1rem" }}>lbs/cu ft</span>
                  </p>
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Weight</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{singleResults.weight} lbs</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Volume</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{singleResults.cubicFeet} cu ft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Cubic Inches</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{singleResults.cubicInches.toLocaleString()} cu in</span>
                  </div>
                </div>

                {/* Class Scale Visualization */}
                <div style={{ marginTop: "20px" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "8px" }}>
                    Freight Class Scale:
                  </p>
                  <div style={{ display: "flex", gap: "2px", alignItems: "flex-end" }}>
                    {[50, 70, 100, 150, 200, 300, 500].map((c, i) => {
                      const isActive = singleResults.freightClass.classNum === c || 
                        (i < 6 && singleResults.freightClass.classNum > c && singleResults.freightClass.classNum < [50, 70, 100, 150, 200, 300, 500][i + 1]);
                      const height = 20 + (i * 8);
                      return (
                        <div key={c} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{
                            height: `${height}px`,
                            backgroundColor: isActive ? singleResults.freightClass.color : "#E5E7EB",
                            borderRadius: "4px 4px 0 0",
                            transition: "background-color 0.3s"
                          }} />
                          <p style={{ 
                            margin: "4px 0 0 0", 
                            fontSize: "0.7rem", 
                            color: isActive ? singleResults.freightClass.color : "#9CA3AF",
                            fontWeight: isActive ? "700" : "400"
                          }}>
                            {c}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "0.7rem", color: "#059669" }}>Cheapest</span>
                    <span style={{ fontSize: "0.7rem", color: "#DC2626" }}>Most Expensive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multi-Piece Calculator */}
        {activeTab === 'multi' && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📦📦 Multi-Piece Shipment
                </h2>
                <button
                  onClick={addPiece}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "white",
                    color: "#7C3AED",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  + Add Piece
                </button>
              </div>

              <div style={{ padding: "24px" }}>
                {pieces.map((piece, index) => (
                  <div 
                    key={piece.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr 1fr 1fr 1fr auto auto",
                      gap: "12px",
                      alignItems: "center",
                      padding: "16px",
                      backgroundColor: index % 2 === 0 ? "#F9FAFB" : "white",
                      borderRadius: "8px",
                      marginBottom: "8px"
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#6B7280", width: "30px" }}>#{index + 1}</span>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Weight (lbs)</label>
                      <input
                        type="number"
                        value={piece.weight}
                        onChange={(e) => updatePiece(piece.id, 'weight', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Length (in)</label>
                      <input
                        type="number"
                        value={piece.length}
                        onChange={(e) => updatePiece(piece.id, 'length', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                        placeholder="48"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Width (in)</label>
                      <input
                        type="number"
                        value={piece.width}
                        onChange={(e) => updatePiece(piece.id, 'width', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                        placeholder="40"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Height (in)</label>
                      <input
                        type="number"
                        value={piece.height}
                        onChange={(e) => updatePiece(piece.id, 'height', e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #D1D5DB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                        placeholder="36"
                      />
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Cu Ft</label>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        {multiResults.pieceDetails.find(p => p.id === piece.id)?.cubicFeet || 0}
                      </span>
                    </div>
                    <button
                      onClick={() => removePiece(piece.id)}
                      disabled={pieces.length === 1}
                      style={{
                        padding: "8px",
                        backgroundColor: pieces.length === 1 ? "#E5E7EB" : "#FEE2E2",
                        color: pieces.length === 1 ? "#9CA3AF" : "#DC2626",
                        border: "none",
                        borderRadius: "6px",
                        cursor: pieces.length === 1 ? "not-allowed" : "pointer",
                        marginTop: "20px"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Piece Results */}
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{
                backgroundColor: "#ECFDF5",
                borderRadius: "16px",
                padding: "24px",
                border: "2px solid #A7F3D0"
              }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#065F46" }}>📊 Combined Totals</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#047857" }}>Total Pieces</span>
                    <span style={{ fontWeight: "700", color: "#065F46" }}>{pieces.length}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#047857" }}>Total Weight</span>
                    <span style={{ fontWeight: "700", color: "#065F46" }}>{multiResults.totalWeight} lbs</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#047857" }}>Total Volume</span>
                    <span style={{ fontWeight: "700", color: "#065F46" }}>{multiResults.totalCubicFeet} cu ft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #A7F3D0" }}>
                    <span style={{ color: "#047857", fontWeight: "600" }}>Combined Density</span>
                    <span style={{ fontWeight: "700", color: "#059669", fontSize: "1.25rem" }}>{multiResults.combinedDensity} lbs/cu ft</span>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "16px",
                padding: "24px",
                border: `2px solid ${multiResults.freightClass.color}`,
                textAlign: "center"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#6B7280" }}>
                  Estimated Freight Class
                </p>
                <p style={{ margin: 0, fontSize: "4rem", fontWeight: "bold", color: multiResults.freightClass.color }}>
                  {multiResults.freightClass.classNum}
                </p>
                <p style={{ 
                  margin: "8px 0 0 0", 
                  fontSize: "1rem",
                  color: multiResults.freightClass.color,
                  fontWeight: "600"
                }}>
                  {multiResults.freightClass.label}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Freight Class Chart */}
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
              📊 NMFC Freight Class Density Chart
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "20px" }}>
              Standard density-based classification (updated July 2025). Higher density = Lower class = Lower cost.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Class</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Density Range (lbs/cu ft)</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Cost Level</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Example Items</th>
                  </tr>
                </thead>
                <tbody>
                  {freightClassData.map((fc, index) => {
                    let costColor = "#059669";
                    let costLabel = "Lowest";
                    if (fc.classNum > 70 && fc.classNum <= 100) { costColor = "#D97706"; costLabel = "Medium"; }
                    else if (fc.classNum > 100 && fc.classNum <= 175) { costColor = "#EA580C"; costLabel = "Higher"; }
                    else if (fc.classNum > 175) { costColor = "#DC2626"; costLabel = "High"; }
                    else if (fc.classNum > 50) { costLabel = "Low"; }

                    return (
                      <tr 
                        key={fc.classNum}
                        style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}
                      >
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "700", fontSize: "1.1rem" }}>
                          {fc.classNum}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          {fc.maxDensity === null ? `≥ ${fc.minDensity}` : `${fc.minDensity} - ${fc.maxDensity}`}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "9999px",
                            backgroundColor: `${costColor}20`,
                            color: costColor,
                            fontSize: "0.8rem",
                            fontWeight: "600"
                          }}>
                            {costLabel}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                          {fc.examples}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Important Note */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "20px",
              border: "1px solid #FCD34D"
            }}>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E" }}>
                ⚠️ <strong>Important:</strong> Density is the primary factor, but carriers may also consider 
                handling requirements, stowability, and liability when determining final classification. 
                Always verify with your carrier&apos;s specific NMFC codes.
              </p>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>📦 Understanding Freight Density & Class</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Freight density</strong> is a key factor in determining how much it costs to ship 
                  goods via LTL (Less-Than-Truckload) carriers like XPO, FedEx Freight, UPS Freight, Saia, 
                  and Estes. It measures how much space your shipment takes relative to its weight.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How to Calculate Freight Density</h3>
                <div style={{
                  backgroundColor: "#F3E8FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #DDD6FE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#6D28D9" }}>Step-by-Step:</p>
                  <ol style={{ margin: 0, paddingLeft: "20px", color: "#7C3AED" }}>
                    <li style={{ marginBottom: "8px" }}>Measure Length × Width × Height in inches</li>
                    <li style={{ marginBottom: "8px" }}>Divide by 1,728 to get Cubic Feet</li>
                    <li style={{ marginBottom: "8px" }}>Divide Weight (lbs) by Cubic Feet</li>
                    <li>Result = Density in lbs per cubic foot</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Density Matters</h3>
                <p>
                  Carriers need to maximize trailer space and weight capacity. A shipment that takes up lots 
                  of space but weighs little (low density) costs more to ship because it prevents carriers 
                  from using that space efficiently. Conversely, dense shipments are cheaper because carriers 
                  can fit more revenue-generating freight in the same space.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Avoiding Reclassification Fees</h3>
                <p>
                  Carriers may re-weigh and re-measure your shipment at their terminal. If the actual density 
                  differs from what you declared, they&apos;ll reclassify it and adjust your bill. To avoid surprises: 
                  measure accurately, include packaging weight, and round up dimensions to the nearest inch.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#F3E8FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#6D28D9", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#7C3AED", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 1 cu ft = 1,728 cu in</p>
                <p style={{ margin: 0 }}>• Class 50 = cheapest</p>
                <p style={{ margin: 0 }}>• Class 500 = most expensive</p>
                <p style={{ margin: 0 }}>• Higher density = lower class</p>
                <p style={{ margin: 0 }}>• Standard pallet: 48×40</p>
              </div>
            </div>

            {/* Carriers */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>🚛 Works For</h3>
              <div style={{ fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 4px 0" }}>• XPO Logistics</p>
                <p style={{ margin: "0 0 4px 0" }}>• FedEx Freight</p>
                <p style={{ margin: "0 0 4px 0" }}>• UPS Freight</p>
                <p style={{ margin: "0 0 4px 0" }}>• Saia LTL Freight</p>
                <p style={{ margin: "0 0 4px 0" }}>• Estes Express</p>
                <p style={{ margin: "0 0 4px 0" }}>• Old Dominion (ODFL)</p>
                <p style={{ margin: 0 }}>• All NMFC carriers</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/freight-density-calculator" currentCategory="Business" />
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on density alone. 
            Actual freight class may vary based on commodity type, handling requirements, stowability, and liability factors. 
            Always verify classification with your carrier and the official NMFC tariff. 
            Carriers reserve the right to re-weigh and re-classify shipments.
          </p>
        </div>
      </div>
    </div>
  );
}