"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How do you calculate hip roof area?",
    answer: "Hip roof area is calculated by finding the surface area of all four sloping sides. For a regular hip roof, this includes two trapezoidal faces and two triangular faces. The formula accounts for both the horizontal dimensions and the roof pitch. Our calculator uses the pitch multiplier (based on the slope) applied to the footprint area, plus adjustments for the hip geometry."
  },
  {
    question: "What angle should a hipped roof be?",
    answer: "Common hip roof angles range from 18.4° (4/12 pitch) to 45° (12/12 pitch). The ideal angle depends on your climate and aesthetic preferences. In areas with heavy snow, steeper pitches (8/12 to 12/12) help snow slide off. In hurricane-prone regions, moderate pitches (4/12 to 6/12) perform better against wind. Most residential hip roofs use 4/12 to 6/12 pitch."
  },
  {
    question: "What is a 4/12 hip roof pitch?",
    answer: "A 4/12 pitch means the roof rises 4 inches vertically for every 12 inches of horizontal run. This equals an angle of about 18.4 degrees. It's considered a low-slope roof that still provides adequate water drainage. A 4/12 pitch is popular because it balances aesthetics, material costs, and ease of walking on the roof for maintenance."
  },
  {
    question: "What is the minimum slope for a hip roof?",
    answer: "The minimum recommended slope for a hip roof with asphalt shingles is 2/12 (about 9.5°), though 4/12 is preferred for better water shedding. Metal roofing can go as low as 1/12 with proper installation. Building codes in your area may specify minimum requirements. Low-slope hip roofs require enhanced underlayment and more careful installation."
  },
  {
    question: "How many bundles of shingles do I need for a hip roof?",
    answer: "Typically, 3 bundles of standard asphalt shingles cover 100 square feet (1 'square'). For a hip roof, add 10-15% for waste due to the extra cuts required at hips and valleys. For example, a 2,000 sq ft hip roof needs about 20 squares × 3 bundles = 60 bundles, plus 6-9 extra bundles for waste, totaling 66-69 bundles."
  },
  {
    question: "What is the difference between a hip roof and a gable roof?",
    answer: "A hip roof has all four sides sloping down to the walls with no vertical ends, while a gable roof has two sloping sides that meet at a ridge, with vertical triangular ends (gables). Hip roofs are more stable in high winds and offer better protection, but require more materials and complex framing. Gable roofs are simpler and cheaper to build but more vulnerable to wind damage."
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

// Pitch data with multipliers
const pitchData = [
  { pitch: "1/12", angle: 4.76, rise: 1, multiplier: 1.003, category: "Flat" },
  { pitch: "2/12", angle: 9.46, rise: 2, multiplier: 1.014, category: "Low" },
  { pitch: "3/12", angle: 14.04, rise: 3, multiplier: 1.031, category: "Low" },
  { pitch: "4/12", angle: 18.43, rise: 4, multiplier: 1.054, category: "Low" },
  { pitch: "5/12", angle: 22.62, rise: 5, multiplier: 1.083, category: "Medium" },
  { pitch: "6/12", angle: 26.57, rise: 6, multiplier: 1.118, category: "Medium" },
  { pitch: "7/12", angle: 30.26, rise: 7, multiplier: 1.158, category: "Medium" },
  { pitch: "8/12", angle: 33.69, rise: 8, multiplier: 1.202, category: "Medium" },
  { pitch: "9/12", angle: 36.87, rise: 9, multiplier: 1.250, category: "Steep" },
  { pitch: "10/12", angle: 39.81, rise: 10, multiplier: 1.302, category: "Steep" },
  { pitch: "11/12", angle: 42.51, rise: 11, multiplier: 1.357, category: "Steep" },
  { pitch: "12/12", angle: 45.00, rise: 12, multiplier: 1.414, category: "Steep" },
];

export default function HipRoofCalculator() {
  const [activeTab, setActiveTab] = useState<'area' | 'materials' | 'chart'>('area');

  // Tab 1: Area Calculator inputs
  const [buildingLength, setBuildingLength] = useState<string>("40");
  const [buildingWidth, setBuildingWidth] = useState<string>("30");
  const [selectedPitch, setSelectedPitch] = useState<string>("6/12");
  const [roofType, setRoofType] = useState<'regular' | 'pyramid'>('regular');
  const [overhang, setOverhang] = useState<string>("12"); // inches

  // Tab 2: Materials inputs
  const [manualArea, setManualArea] = useState<string>("");
  const [useManualArea, setUseManualArea] = useState<boolean>(false);
  const [wasteFactor, setWasteFactor] = useState<string>("10");

  // Tab 1 Calculations
  const areaResults = useMemo(() => {
    const length = parseFloat(buildingLength) || 0;
    const width = parseFloat(buildingWidth) || 0;
    const overhangFt = (parseFloat(overhang) || 0) / 12;
    
    // Get pitch data
    const pitch = pitchData.find(p => p.pitch === selectedPitch) || pitchData[5];
    const angleRad = (pitch.angle * Math.PI) / 180;
    const pitchRatio = pitch.rise / 12;
    
    // Adjusted dimensions with overhang
    const adjLength = length + (2 * overhangFt);
    const adjWidth = width + (2 * overhangFt);
    
    // Calculate roof rise (height from eave to ridge)
    const roofRise = (adjWidth / 2) * pitchRatio;
    
    // Common rafter length (from eave to ridge along the slope)
    const commonRafterLength = (adjWidth / 2) / Math.cos(angleRad);
    
    // Hip rafter length (diagonal from corner to ridge)
    // Hip runs at 45° in plan view, so horizontal run is (width/2) * sqrt(2)
    const hipHorizontalRun = (adjWidth / 2) * Math.sqrt(2);
    const hipRafterLength = Math.sqrt(hipHorizontalRun * hipHorizontalRun + roofRise * roofRise);
    
    // Ridge length (only for regular hip, not pyramid)
    const ridgeLength = roofType === 'pyramid' ? 0 : Math.max(0, adjLength - adjWidth);
    
    let totalArea = 0;
    
    if (roofType === 'pyramid') {
      // Pyramid hip: 4 identical triangular faces
      // Each triangle: base = adjWidth, slant height = commonRafterLength
      const triangleArea = (adjWidth * commonRafterLength) / 2;
      totalArea = 4 * triangleArea;
    } else {
      // Regular hip roof: 2 trapezoids + 2 triangles
      
      // The two triangular ends (hip ends)
      // Base = adjWidth, slant height = commonRafterLength
      const triangleArea = (adjWidth * commonRafterLength) / 2;
      
      // The two trapezoidal sides
      // Bottom base = adjLength, Top base = ridgeLength, slant height = commonRafterLength
      const trapezoidArea = ((adjLength + ridgeLength) / 2) * commonRafterLength;
      
      totalArea = (2 * triangleArea) + (2 * trapezoidArea);
    }
    
    // Footprint area (for reference)
    const footprintArea = adjLength * adjWidth;
    
    // Calculate perimeter (eave length)
    const eaveLength = 2 * (adjLength + adjWidth);
    
    // Hip length (total length of all hip ridges)
    // Regular hip has 4 hips, pyramid has 4 hips meeting at center
    const totalHipLength = 4 * hipRafterLength;

    return {
      totalArea: Math.round(totalArea),
      footprintArea: Math.round(footprintArea),
      ridgeLength: Math.round(ridgeLength * 10) / 10,
      commonRafterLength: Math.round(commonRafterLength * 10) / 10,
      hipRafterLength: Math.round(hipRafterLength * 10) / 10,
      totalHipLength: Math.round(totalHipLength * 10) / 10,
      roofRise: Math.round(roofRise * 10) / 10,
      eaveLength: Math.round(eaveLength * 10) / 10,
      pitchAngle: pitch.angle,
      pitchMultiplier: pitch.multiplier,
      pitchCategory: pitch.category,
      adjLength,
      adjWidth
    };
  }, [buildingLength, buildingWidth, selectedPitch, roofType, overhang]);

  // Tab 2 Calculations - Materials
  const materialResults = useMemo(() => {
    const baseArea = useManualArea ? (parseFloat(manualArea) || 0) : areaResults.totalArea;
    const waste = (parseFloat(wasteFactor) || 10) / 100;
    const totalArea = baseArea * (1 + waste);
    
    // Shingles: 3 bundles per square (100 sq ft)
    const squares = totalArea / 100;
    const shingleBundles = Math.ceil(squares * 3);
    
    // Ridge cap shingles: typically 1 bundle covers ~35 linear feet
    // Total ridge = main ridge + 4 hips
    const totalRidgeLength = areaResults.ridgeLength + areaResults.totalHipLength;
    const ridgeCapBundles = Math.ceil(totalRidgeLength / 35);
    
    // Sheathing: 4x8 sheets = 32 sq ft each
    const sheathingSheets = Math.ceil(totalArea / 32);
    
    // Underlayment: rolls typically cover 400 sq ft with overlap
    const underlaymentRolls = Math.ceil(totalArea / 400);
    
    // Drip edge: sold in 10ft pieces, need for eaves + rakes
    // For hip roof, rakes = hip length, eaves = perimeter
    const dripEdgePieces = Math.ceil((areaResults.eaveLength + areaResults.totalHipLength) / 10);
    
    // Roofing nails: approximately 2.5 lbs per square
    const nailsLbs = Math.ceil(squares * 2.5);

    return {
      baseArea: Math.round(baseArea),
      totalArea: Math.round(totalArea),
      squares: Math.round(squares * 10) / 10,
      shingleBundles,
      ridgeCapBundles,
      sheathingSheets,
      underlaymentRolls,
      dripEdgePieces,
      nailsLbs,
      totalRidgeLength: Math.round(totalRidgeLength)
    };
  }, [useManualArea, manualArea, areaResults, wasteFactor]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Hip Roof Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Hip Roof Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free online hip roof calculator. Calculate roof area in square feet, estimate shingles and materials, 
            and find rafter lengths. Works for both regular and pyramid hip roofs.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                <strong>Hip Roof Area Formula:</strong> Calculate each face separately, then add them together
              </p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Regular hip = 2 trapezoids + 2 triangles | Pyramid hip = 4 triangles
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("area")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "area" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "area" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Roof Area
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "materials" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "materials" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🧱 Materials
          </button>
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "chart" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "chart" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Pitch Chart
          </button>
        </div>

        {/* Tab 1: Roof Area Calculator */}
        {activeTab === 'area' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📐 Building Dimensions
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Roof Type Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roof Type
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => setRoofType('regular')}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: roofType === 'regular' ? "2px solid #2563EB" : "2px solid #E5E7EB",
                        backgroundColor: roofType === 'regular' ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🏠</div>
                      <div style={{ fontWeight: "600", color: roofType === 'regular' ? "#2563EB" : "#374151" }}>Regular Hip</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Rectangle base</div>
                    </button>
                    <button
                      onClick={() => setRoofType('pyramid')}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius: "8px",
                        border: roofType === 'pyramid' ? "2px solid #2563EB" : "2px solid #E5E7EB",
                        backgroundColor: roofType === 'pyramid' ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🔺</div>
                      <div style={{ fontWeight: "600", color: roofType === 'pyramid' ? "#2563EB" : "#374151" }}>Pyramid Hip</div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Square base</div>
                    </button>
                  </div>
                </div>

                {/* Building Length */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Building Length (ft)
                  </label>
                  <input
                    type="number"
                    value={buildingLength}
                    onChange={(e) => setBuildingLength(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="e.g., 40"
                  />
                </div>

                {/* Building Width */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Building Width (ft) {roofType === 'pyramid' && <span style={{ color: "#6B7280", fontWeight: "400" }}>- same as length for pyramid</span>}
                  </label>
                  <input
                    type="number"
                    value={roofType === 'pyramid' ? buildingLength : buildingWidth}
                    onChange={(e) => setBuildingWidth(e.target.value)}
                    disabled={roofType === 'pyramid'}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      backgroundColor: roofType === 'pyramid' ? "#F3F4F6" : "white"
                    }}
                    placeholder="e.g., 30"
                  />
                </div>

                {/* Roof Pitch */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roof Pitch
                  </label>
                  <select
                    value={selectedPitch}
                    onChange={(e) => setSelectedPitch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    {pitchData.map((p) => (
                      <option key={p.pitch} value={p.pitch}>
                        {p.pitch} ({p.angle.toFixed(1)}°) - {p.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Overhang */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Eave Overhang (inches)
                  </label>
                  <input
                    type="number"
                    value={overhang}
                    onChange={(e) => setOverhang(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="e.g., 12"
                  />
                  <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "4px" }}>
                    Typical overhang: 12-24 inches
                  </p>
                </div>

                {/* Pitch Explanation */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    <strong>{selectedPitch} pitch</strong> = roof rises {pitchData.find(p => p.pitch === selectedPitch)?.rise}&quot; 
                    for every 12&quot; of horizontal run ({pitchData.find(p => p.pitch === selectedPitch)?.angle.toFixed(1)}° angle)
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
                  📊 Roof Calculations
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Total Roof Area */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                    Total Roof Area
                  </p>
                  <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                    {areaResults.totalArea.toLocaleString()} <span style={{ fontSize: "1.25rem" }}>sq ft</span>
                  </p>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                    {(areaResults.totalArea / 100).toFixed(1)} roofing squares
                  </p>
                </div>

                {/* Key Measurements */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    📏 Key Measurements
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {roofType === 'regular' && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Ridge Length</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.ridgeLength} ft</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Common Rafter Length</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.commonRafterLength} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Hip Rafter Length</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.hipRafterLength} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Total Hip Length (4 hips)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.totalHipLength} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Roof Rise (Height)</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.roofRise} ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Eave Perimeter</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{areaResults.eaveLength} ft</span>
                    </div>
                  </div>
                </div>

                {/* Pitch Info */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #BFDBFE"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#1E40AF" }}>Pitch</span>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>{selectedPitch}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#1E40AF" }}>Angle</span>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>{areaResults.pitchAngle.toFixed(1)}°</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#1E40AF" }}>Category</span>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>{areaResults.pitchCategory} Slope</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Materials Estimator */}
        {activeTab === 'materials' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🧱 Material Inputs
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Area Source */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Roof Area Source
                  </label>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                    <button
                      onClick={() => setUseManualArea(false)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: !useManualArea ? "2px solid #2563EB" : "1px solid #D1D5DB",
                        backgroundColor: !useManualArea ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontWeight: !useManualArea ? "600" : "400",
                        color: !useManualArea ? "#2563EB" : "#374151"
                      }}
                    >
                      Use Tab 1 Result
                    </button>
                    <button
                      onClick={() => setUseManualArea(true)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        border: useManualArea ? "2px solid #2563EB" : "1px solid #D1D5DB",
                        backgroundColor: useManualArea ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontWeight: useManualArea ? "600" : "400",
                        color: useManualArea ? "#2563EB" : "#374151"
                      }}
                    >
                      Enter Manually
                    </button>
                  </div>
                  
                  {!useManualArea ? (
                    <div style={{
                      padding: "16px",
                      backgroundColor: "#F3F4F6",
                      borderRadius: "8px",
                      textAlign: "center"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#6B7280" }}>From Roof Area Calculator:</p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
                        {areaResults.totalArea.toLocaleString()} sq ft
                      </p>
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={manualArea}
                      onChange={(e) => setManualArea(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="Enter roof area in sq ft"
                    />
                  )}
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Waste Factor: {wasteFactor}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={wasteFactor}
                    onChange={(e) => setWasteFactor(e.target.value)}
                    style={{
                      width: "100%",
                      accentColor: "#2563EB"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>5% (Simple)</span>
                    <span>10% (Standard)</span>
                    <span>20% (Complex)</span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Hip roofs typically need 10-15% waste factor due to extra cuts 
                    at hips and valleys. Complex roofs may need up to 20%.
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
                  📦 Materials Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Area Summary */}
                <div style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ color: "#6B7280" }}>Base Area:</span>
                    <span style={{ color: "#111827" }}>{materialResults.baseArea.toLocaleString()} sq ft</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#6B7280" }}>With {wasteFactor}% Waste:</span>
                    <span style={{ fontWeight: "600", color: "#059669" }}>{materialResults.totalArea.toLocaleString()} sq ft</span>
                  </div>
                </div>

                {/* Materials List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#ECFDF5",
                    borderRadius: "8px",
                    border: "1px solid #A7F3D0"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#065F46" }}>Shingle Bundles</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>3 bundles = 1 square (100 sq ft)</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>{materialResults.shingleBundles}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#EFF6FF",
                    borderRadius: "8px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#1E40AF" }}>Ridge Cap Bundles</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#3B82F6" }}>~35 ft coverage per bundle ({materialResults.totalRidgeLength} ft total)</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2563EB" }}>{materialResults.ridgeCapBundles}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    border: "1px solid #FCD34D"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#92400E" }}>4×8 Sheathing Sheets</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#B45309" }}>32 sq ft per sheet</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>{materialResults.sheathingSheets}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#F3E8FF",
                    borderRadius: "8px",
                    border: "1px solid #D8B4FE"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#6B21A8" }}>Underlayment Rolls</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#7C3AED" }}>~400 sq ft per roll (with overlap)</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#7C3AED" }}>{materialResults.underlaymentRolls}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>Drip Edge (10ft pieces)</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>For eaves and hips</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>{materialResults.dripEdgePieces}</span>
                  </div>

                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#F9FAFB",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB"
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>Roofing Nails</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>~2.5 lbs per square</p>
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>{materialResults.nailsLbs} lbs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Pitch Reference Chart */}
        {activeTab === 'chart' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 Roof Pitch Reference Chart
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "20px" }}>
              Pitch is expressed as rise over run (X/12). For example, 6/12 means the roof rises 6 inches for every 12 inches of horizontal run.
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Pitch</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Angle (°)</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Rise per Foot</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Multiplier</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Category</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  {pitchData.map((pitch, index) => {
                    const isSelected = pitch.pitch === selectedPitch;
                    const categoryColors: Record<string, { bg: string; text: string }> = {
                      'Flat': { bg: '#F3F4F6', text: '#4B5563' },
                      'Low': { bg: '#DBEAFE', text: '#1D4ED8' },
                      'Medium': { bg: '#D1FAE5', text: '#059669' },
                      'Steep': { bg: '#FEE2E2', text: '#DC2626' }
                    };
                    const colors = categoryColors[pitch.category];
                    
                    const commonUse: Record<string, string> = {
                      '1/12': 'Commercial flat roofs',
                      '2/12': 'Low-slope roofing',
                      '3/12': 'Minimum for shingles',
                      '4/12': 'Standard residential',
                      '5/12': 'Standard residential',
                      '6/12': 'Popular choice',
                      '7/12': 'Traditional homes',
                      '8/12': 'Colonial style',
                      '9/12': 'Tudor, Cape Cod',
                      '10/12': 'A-frame, steep',
                      '11/12': 'Very steep',
                      '12/12': 'Maximum walkable'
                    };
                    
                    return (
                      <tr 
                        key={index}
                        style={{ 
                          backgroundColor: isSelected ? '#EFF6FF' : (index % 2 === 0 ? 'white' : '#F9FAFB'),
                          border: isSelected ? '2px solid #2563EB' : 'none'
                        }}
                      >
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: isSelected ? "700" : "600" }}>
                          {isSelected && "👉 "}{pitch.pitch}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          {pitch.angle.toFixed(1)}°
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          {pitch.rise}&quot;
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          ×{pitch.multiplier.toFixed(3)}
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: colors.bg,
                            color: colors.text,
                            fontSize: "0.8rem",
                            fontWeight: "600"
                          }}>
                            {pitch.category}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                          {commonUse[pitch.pitch]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Pitch Diagram */}
            <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#F9FAFB", borderRadius: "12px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "1rem", color: "#374151" }}>Visual Pitch Guide</h3>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { pitch: "4/12", angle: 18.4 },
                  { pitch: "6/12", angle: 26.6 },
                  { pitch: "8/12", angle: 33.7 },
                  { pitch: "12/12", angle: 45 }
                ].map((item) => (
                  <div key={item.pitch} style={{ textAlign: "center" }}>
                    <svg width="80" height="60" viewBox="0 0 80 60">
                      <polygon 
                        points={`10,50 70,50 40,${50 - 30 * Math.tan(item.angle * Math.PI / 180)}`}
                        fill="#DBEAFE" 
                        stroke="#2563EB" 
                        strokeWidth="2"
                      />
                      <line x1="10" y1="50" x2="70" y2="50" stroke="#374151" strokeWidth="1" />
                    </svg>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>{item.pitch}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>{item.angle}°</p>
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
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏠 Understanding Hip Roofs</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A <strong>hip roof</strong> (or hipped roof) is a type of roof where all sides slope downward 
                  toward the walls. Unlike a gable roof with two sloping sides, a hip roof has four sloping 
                  sides, making it more stable and resistant to high winds.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Types of Hip Roofs</h3>
                <p>
                  <strong>Regular Hip Roof:</strong> Built on a rectangular building, it has two trapezoidal faces 
                  and two triangular faces. The ridge runs along the longer dimension.<br /><br />
                  <strong>Pyramid Hip Roof:</strong> Built on a square building, all four faces are triangular and 
                  meet at a single peak (no ridge line). Also called a &quot;pavilion roof.&quot;
                </p>

                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>📐 Hip Roof Geometry</p>
                  <p style={{ margin: 0, color: "#1D4ED8", fontSize: "0.95rem" }}>
                    <strong>Ridge:</strong> Horizontal line where two sloping faces meet<br />
                    <strong>Hip Rafter:</strong> Diagonal line from corner to ridge<br />
                    <strong>Common Rafter:</strong> Perpendicular from eave to ridge<br />
                    <strong>Eave:</strong> The lower edge of the roof that overhangs the wall
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Advantages of Hip Roofs</h3>
                <p>
                  Hip roofs offer several benefits: better wind resistance (no flat gable ends to catch wind), 
                  more consistent eave overhangs for shade and rain protection, and often improved aesthetics. 
                  The main drawbacks are higher construction costs and more complex framing.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Choosing the Right Pitch</h3>
                <p>
                  Roof pitch affects drainage, materials, and appearance. Low pitches (3/12-4/12) are economical 
                  and modern-looking but require careful waterproofing. Medium pitches (5/12-7/12) are the most 
                  common for residential homes. Steep pitches (8/12+) are traditional, handle snow well, but 
                  cost more due to additional materials and safety requirements.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 1 square = 100 sq ft</p>
                <p style={{ margin: 0 }}>• 3 bundles = 1 square</p>
                <p style={{ margin: 0 }}>• 4×8 sheet = 32 sq ft</p>
                <p style={{ margin: 0 }}>• Min shingle pitch: 2/12</p>
                <p style={{ margin: 0 }}>• Common pitch: 4/12-6/12</p>
                <p style={{ margin: 0 }}>• Hip waste: +10-15%</p>
              </div>
            </div>

            {/* Warning */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Safety Note</h3>
              <p style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.7", margin: 0 }}>
                Roofing work is dangerous. Always use proper fall protection when working on roofs. 
                Consider hiring a licensed contractor for steep or complex roofs.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/hip-roof-calculator" currentCategory="Home" />
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. 
            Actual material requirements may vary based on roof complexity, waste, and installation methods. 
            Always consult with a roofing professional for accurate measurements and quotes. 
            Local building codes may have specific requirements for your area.
          </p>
        </div>
      </div>
    </div>
  );
}