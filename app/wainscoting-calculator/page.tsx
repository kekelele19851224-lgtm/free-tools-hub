"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Height recommendations by ceiling height
const heightRecommendations = [
  { ceiling: "8 ft (96\")", recommended: "32-36\"", ratio: "⅓ of wall" },
  { ceiling: "9 ft (108\")", recommended: "36-42\"", ratio: "⅓ of wall" },
  { ceiling: "10 ft (120\")", recommended: "42-48\"", ratio: "⅓ - ⅖ of wall" },
  { ceiling: "12 ft (144\")", recommended: "48-54\"", ratio: "⅓ - ⅖ of wall" }
];

// Material cost estimates
const materialCosts = [
  { material: "MDF Chair Rail", low: 1.50, high: 3.00 },
  { material: "MDF Baseboard", low: 1.00, high: 2.50 },
  { material: "Panel Molding", low: 0.50, high: 1.50 },
  { material: "Pine Board (1×4)", low: 1.00, high: 2.00 },
  { material: "Poplar Board (1×4)", low: 2.00, high: 4.00 }
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate for wainscoting?",
    answer: "To calculate wainscoting: 1) Measure your wall width. 2) Decide on number of panels/frames you want. 3) Subtract total stile (spacer) width from wall width. 4) Divide remaining width by number of panels to get each panel's width. Formula: Panel Width = (Wall Width - (Stile Width × (Panels + 1))) ÷ Number of Panels. For height, the standard is ⅓ of wall height (32-36\" for 8ft ceilings)."
  },
  {
    question: "What is the golden ratio for wainscoting?",
    answer: "The golden ratio for wainscoting is typically ⅓ of the total wall height. For an 8-foot (96\") ceiling, this means 32\" wainscoting height. Some designers prefer the ⅖ ratio (about 38\") for taller ceilings or more dramatic effect. The key is maintaining visual balance—the wainscoting should feel proportional to the room's scale."
  },
  {
    question: "What is the golden rule of wainscoting?",
    answer: "The golden rule of wainscoting is the '⅓ rule'—wainscoting should cover approximately one-third of your wall height. Other important rules include: 1) Panels should be evenly spaced and equal in size. 2) The chair rail should be at a comfortable height (32-36\" from floor). 3) Stiles should be consistent width throughout. 4) Always account for baseboards in your measurements."
  },
  {
    question: "What is a stile in wainscoting?",
    answer: "A stile is the vertical piece of trim that separates panels in wainscoting. In picture frame wainscoting, stiles are the spaces between the rectangular frames. In board and batten, the battens themselves serve as stiles. Typical stile width ranges from 2.5\" to 4\" depending on the scale of the room and desired look. Stiles create visual rhythm and define the panel layout."
  },
  {
    question: "What is the standard wainscoting height?",
    answer: "Standard wainscoting height varies by ceiling height: 8ft ceiling = 32-36\", 9ft ceiling = 36-42\", 10ft ceiling = 42-48\", 12ft ceiling = 48-54\". In dining rooms, wainscoting is often installed at chair rail height (32-36\") to protect walls from chair backs. Bathrooms may use full-height wainscoting (to ceiling) for moisture protection."
  },
  {
    question: "How much does wainscoting cost?",
    answer: "Wainscoting costs vary by material and style. DIY materials cost $5-15 per square foot (MDF/pine) or $15-30 for hardwood. Professional installation adds $4-8 per square foot. For a 12-foot wall at 36\" height (36 sq ft), expect $180-540 for DIY materials or $320-900 with professional installation. Picture frame style is typically cheaper than raised panel."
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

// Convert decimal inches to fraction string
function toFraction(decimal: number): string {
  const whole = Math.floor(decimal);
  const remainder = decimal - whole;
  
  // Common fractions for woodworking
  const fractions = [
    { value: 0, text: "" },
    { value: 1/16, text: "1/16" },
    { value: 1/8, text: "1/8" },
    { value: 3/16, text: "3/16" },
    { value: 1/4, text: "1/4" },
    { value: 5/16, text: "5/16" },
    { value: 3/8, text: "3/8" },
    { value: 7/16, text: "7/16" },
    { value: 1/2, text: "1/2" },
    { value: 9/16, text: "9/16" },
    { value: 5/8, text: "5/8" },
    { value: 11/16, text: "11/16" },
    { value: 3/4, text: "3/4" },
    { value: 13/16, text: "13/16" },
    { value: 7/8, text: "7/8" },
    { value: 15/16, text: "15/16" },
    { value: 1, text: "" }
  ];
  
  // Find closest fraction
  let closest = fractions[0];
  let minDiff = Math.abs(remainder - fractions[0].value);
  
  for (const frac of fractions) {
    const diff = Math.abs(remainder - frac.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = frac;
    }
  }
  
  if (closest.value === 1) {
    return `${whole + 1}"`;
  }
  
  if (closest.text === "") {
    return `${whole}"`;
  }
  
  if (whole === 0) {
    return `${closest.text}"`;
  }
  
  return `${whole} ${closest.text}"`;
}

export default function WainscotingCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"pictureframe" | "boardbatten" | "materials">("pictureframe");
  
  // Picture Frame state
  const [pfWallWidth, setPfWallWidth] = useState<string>("120");
  const [pfNumFrames, setPfNumFrames] = useState<string>("4");
  const [pfStileWidth, setPfStileWidth] = useState<string>("3.5");
  const [pfWainscotingHeight, setPfWainscotingHeight] = useState<string>("36");
  const [pfTopMargin, setPfTopMargin] = useState<string>("3");
  const [pfBottomMargin, setPfBottomMargin] = useState<string>("4");
  
  // Board and Batten state
  const [bbWallWidth, setBbWallWidth] = useState<string>("120");
  const [bbNumBattens, setBbNumBattens] = useState<string>("7");
  const [bbBattenWidth, setBbBattenWidth] = useState<string>("3.5");
  const [bbWainscotingHeight, setBbWainscotingHeight] = useState<string>("36");
  
  // Materials state
  const [matWallWidth, setMatWallWidth] = useState<string>("120");
  const [matWainscotingHeight, setMatWainscotingHeight] = useState<string>("36");
  const [matNumPanels, setMatNumPanels] = useState<string>("4");
  const [matStileWidth, setMatStileWidth] = useState<string>("3.5");
  const [matPricePerFoot, setMatPricePerFoot] = useState<string>("2");

  // Picture Frame calculations
  const pfWidth = parseFloat(pfWallWidth) || 0;
  const pfFrames = parseInt(pfNumFrames) || 1;
  const pfStile = parseFloat(pfStileWidth) || 0;
  const pfHeight = parseFloat(pfWainscotingHeight) || 0;
  const pfTop = parseFloat(pfTopMargin) || 0;
  const pfBottom = parseFloat(pfBottomMargin) || 0;
  
  const pfTotalStiles = pfFrames + 1;
  const pfTotalStileWidth = pfTotalStiles * pfStile;
  const pfAvailableWidth = pfWidth - pfTotalStileWidth;
  const pfFrameWidth = pfFrames > 0 ? pfAvailableWidth / pfFrames : 0;
  const pfFrameHeight = pfHeight - pfTop - pfBottom;
  const pfFirstStileStart = 0;
  
  // Generate frame positions
  const framePositions = [];
  for (let i = 0; i < pfFrames; i++) {
    const start = pfStile + i * (pfFrameWidth + pfStile);
    framePositions.push({ start, end: start + pfFrameWidth });
  }

  // Board and Batten calculations
  const bbWidth = parseFloat(bbWallWidth) || 0;
  const bbBattens = parseInt(bbNumBattens) || 1;
  const bbBatten = parseFloat(bbBattenWidth) || 0;
  const bbHeight = parseFloat(bbWainscotingHeight) || 0;
  
  const bbTotalBattenWidth = bbBattens * bbBatten;
  const bbAvailableSpace = bbWidth - bbTotalBattenWidth;
  const bbSpacing = bbBattens > 1 ? bbAvailableSpace / (bbBattens - 1) : 0;
  const bbTotalLinearFeet = (bbBattens * bbHeight) / 12;

  // Materials calculations
  const matWidth = parseFloat(matWallWidth) || 0;
  const matHeight = parseFloat(matWainscotingHeight) || 0;
  const matPanels = parseInt(matNumPanels) || 1;
  const matStile = parseFloat(matStileWidth) || 0;
  const matPrice = parseFloat(matPricePerFoot) || 0;
  
  const matChairRail = matWidth / 12; // Convert to feet
  const matBaseboard = matWidth / 12;
  const matTotalStiles = matPanels + 1;
  const matStilesLength = (matTotalStiles * matHeight) / 12;
  const matPanelMoldingPerFrame = 2 * ((matWidth - matTotalStiles * matStile) / matPanels / 12) + 2 * ((matHeight - 7) / 12); // Approx
  const matTotalPanelMolding = matPanelMoldingPerFrame * matPanels;
  const matTotalLinearFeet = matChairRail + matBaseboard + matStilesLength + matTotalPanelMolding;
  const matEstimatedCost = matTotalLinearFeet * matPrice;

  const tabs = [
    { id: "pictureframe", label: "Picture Frame", icon: "🖼️" },
    { id: "boardbatten", label: "Board & Batten", icon: "📐" },
    { id: "materials", label: "Materials List", icon: "🧮" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Wainscoting Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🪵</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Wainscoting Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free calculator for picture frame wainscoting and board and batten projects. 
            Calculate panel spacing, frame dimensions, and material needs with measurements in fractions.
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
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Golden Rule of Wainscoting</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>Height:</strong> ⅓ of wall height (32-36&quot; for 8ft ceilings)<br />
                <strong>Panel Width:</strong> (Wall Width - Total Stile Width) ÷ Number of Panels
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
                backgroundColor: activeTab === tab.id ? "#92400E" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "pictureframe" && "🖼️ Picture Frame Wainscoting"}
                {activeTab === "boardbatten" && "📐 Board & Batten"}
                {activeTab === "materials" && "🧮 Materials Calculator"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "pictureframe" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Wall Width (inches)
                    </label>
                    <input
                      type="number"
                      value={pfWallWidth}
                      onChange={(e) => setPfWallWidth(e.target.value)}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Number of Frames
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={pfNumFrames}
                        onChange={(e) => setPfNumFrames(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Stile Width (inches)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={pfStileWidth}
                        onChange={(e) => setPfStileWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Wainscoting Height (inches)
                    </label>
                    <input
                      type="number"
                      value={pfWainscotingHeight}
                      onChange={(e) => setPfWainscotingHeight(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Top Margin (inches)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={pfTopMargin}
                        onChange={(e) => setPfTopMargin(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Bottom Margin (inches)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={pfBottomMargin}
                        onChange={(e) => setPfBottomMargin(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Tip:</strong> Stile width of 3.5&quot; matches a 2×4 board width, making it easy to create spacer blocks.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "boardbatten" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Wall Width (inches)
                    </label>
                    <input
                      type="number"
                      value={bbWallWidth}
                      onChange={(e) => setBbWallWidth(e.target.value)}
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Number of Battens
                      </label>
                      <input
                        type="number"
                        min="2"
                        value={bbNumBattens}
                        onChange={(e) => setBbNumBattens(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Batten Width (inches)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={bbBattenWidth}
                        onChange={(e) => setBbBattenWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Batten Height (inches)
                    </label>
                    <input
                      type="number"
                      value={bbWainscotingHeight}
                      onChange={(e) => setBbWainscotingHeight(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Common batten sizes:</strong> 1×3 (2.5&quot; actual), 1×4 (3.5&quot; actual), 1×6 (5.5&quot; actual)
                    </p>
                  </div>
                </>
              )}

              {activeTab === "materials" && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Wall Width (inches)
                      </label>
                      <input
                        type="number"
                        value={matWallWidth}
                        onChange={(e) => setMatWallWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Wainscoting Height (in)
                      </label>
                      <input
                        type="number"
                        value={matWainscotingHeight}
                        onChange={(e) => setMatWainscotingHeight(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Number of Panels
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={matNumPanels}
                        onChange={(e) => setMatNumPanels(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Stile Width (inches)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={matStileWidth}
                        onChange={(e) => setMatStileWidth(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Price per Linear Foot (optional)
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        step="0.5"
                        value={matPricePerFoot}
                        onChange={(e) => setMatPricePerFoot(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 10px 10px 28px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
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
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Results</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "pictureframe" && (
                <>
                  {/* Frame Dimensions */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Frame Dimensions</p>
                    <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "#059669" }}>
                      {toFraction(pfFrameWidth)} × {toFraction(pfFrameHeight)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                      Width × Height
                    </p>
                  </div>

                  {/* Key Measurements */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📏 Key Measurements</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Frame Width:</div>
                      <div style={{ textAlign: "right", fontWeight: "600", color: "#059669" }}>{toFraction(pfFrameWidth)}</div>
                      <div style={{ color: "#6B7280" }}>Frame Height:</div>
                      <div style={{ textAlign: "right", fontWeight: "600", color: "#059669" }}>{toFraction(pfFrameHeight)}</div>
                      <div style={{ color: "#6B7280" }}>Stile Width:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{toFraction(pfStile)}</div>
                      <div style={{ color: "#6B7280" }}>Number of Stiles:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{pfTotalStiles}</div>
                    </div>
                  </div>

                  {/* Visual Layout */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #FCD34D"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "0.9rem" }}>🖼️ Frame Positions (from left)</h4>
                    <div style={{ fontSize: "0.8rem", color: "#B45309" }}>
                      {framePositions.map((pos, i) => (
                        <div key={i} style={{ marginBottom: "4px" }}>
                          <strong>Frame {i + 1}:</strong> {toFraction(pos.start)} to {toFraction(pos.end)}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "boardbatten" && (
                <>
                  {/* Spacing Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Spacing Between Battens</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {toFraction(bbSpacing)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#047857" }}>
                      Cut a spacer block to this size
                    </p>
                  </div>

                  {/* Details */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📏 Layout Details</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Wall Width:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{toFraction(bbWidth)}</div>
                      <div style={{ color: "#6B7280" }}>Number of Battens:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{bbBattens}</div>
                      <div style={{ color: "#6B7280" }}>Batten Width:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{toFraction(bbBatten)}</div>
                      <div style={{ color: "#6B7280" }}>Spacing:</div>
                      <div style={{ textAlign: "right", fontWeight: "600", color: "#059669" }}>{toFraction(bbSpacing)}</div>
                    </div>
                  </div>

                  {/* Materials Needed */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <h4 style={{ margin: "0 0 8px 0", color: "#1D4ED8", fontSize: "0.9rem" }}>🪵 Materials Needed</h4>
                    <div style={{ fontSize: "0.85rem", color: "#2563EB" }}>
                      <p style={{ margin: "0 0 4px 0" }}>
                        <strong>Battens:</strong> {bbBattens} pieces @ {toFraction(bbHeight)} each
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>Total Linear Feet:</strong> {bbTotalLinearFeet.toFixed(1)} ft
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "materials" && (
                <>
                  {/* Total Materials */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>Total Linear Feet</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {matTotalLinearFeet.toFixed(1)} ft
                    </p>
                    {matPrice > 0 && (
                      <p style={{ margin: "8px 0 0 0", fontSize: "1rem", color: "#047857" }}>
                        Est. Cost: <strong>${matEstimatedCost.toFixed(2)}</strong>
                      </p>
                    )}
                  </div>

                  {/* Materials Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Materials List</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Chair Rail:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{matChairRail.toFixed(1)} ft</div>
                      <div style={{ color: "#6B7280" }}>Baseboard:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{matBaseboard.toFixed(1)} ft</div>
                      <div style={{ color: "#6B7280" }}>Stiles ({matTotalStiles} pcs):</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{matStilesLength.toFixed(1)} ft</div>
                      <div style={{ color: "#6B7280" }}>Panel Molding:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{matTotalPanelMolding.toFixed(1)} ft</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", fontWeight: "600" }}>Total:</div>
                      <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: "8px", textAlign: "right", fontWeight: "bold", color: "#059669" }}>{matTotalLinearFeet.toFixed(1)} ft</div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> Add 10-15% extra for cuts, mistakes, and waste. Consider {(matTotalLinearFeet * 1.15).toFixed(0)} ft total.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Height Recommendations Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#92400E", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📐 Recommended Wainscoting Heights</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Ceiling Height</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recommended Height</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Ratio</th>
                </tr>
              </thead>
              <tbody>
                {heightRecommendations.map((rec, idx) => (
                  <tr key={rec.ceiling} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{rec.ceiling}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{rec.recommended}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#6B7280" }}>{rec.ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🪵 Understanding Wainscoting</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Wainscoting</strong> is a decorative wall covering that typically covers the lower portion of interior walls. 
                  It adds architectural interest, protects walls from damage, and increases home value. The two most popular DIY styles 
                  are <strong>picture frame (shadow box)</strong> and <strong>board and batten</strong>.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Picture Frame Wainscoting</h3>
                <p>
                  Also called shadow box or box molding, this style creates rectangular frames using panel molding. 
                  The frames are evenly spaced with vertical sections called stiles. It&apos;s elegant and works well 
                  in dining rooms, hallways, and formal living spaces.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Board and Batten</h3>
                <p>
                  This style uses vertical boards (battens) attached directly to the wall at even intervals. 
                  It creates a clean, modern farmhouse look and is one of the easiest wainscoting styles to install. 
                  Great for bedrooms, mudrooms, and casual spaces.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Terms</h3>
                <p><strong>Stile:</strong> The vertical piece separating panels or the space between frames.</p>
                <p><strong>Rail:</strong> Horizontal pieces at top (chair rail) and bottom (baseboard).</p>
                <p><strong>Panel:</strong> The rectangular sections between stiles and rails.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Pro Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ Use a 2×4 as a spacer (3.5&quot;)</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Level is more important than level</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Caulk all seams before painting</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Prime MDF edges well</p>
                <p style={{ margin: 0 }}>✓ Add 10-15% extra material</p>
              </div>
            </div>

            {/* Material Costs */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>💰 Material Costs</h3>
              <div style={{ fontSize: "0.8rem", color: "#6D28D9", lineHeight: "1.8" }}>
                {materialCosts.slice(0, 4).map((m) => (
                  <p key={m.material} style={{ margin: "0 0 4px 0" }}>
                    <strong>{m.material}:</strong> ${m.low.toFixed(2)}-${m.high.toFixed(2)}/ft
                  </p>
                ))}
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/wainscoting-calculator" currentCategory="Construction" />
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
            🪵 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes. 
            Always measure your actual walls before purchasing materials. Actual board dimensions may vary 
            (e.g., a 1×4 is actually 3.5&quot; wide). Add 10-15% extra for cuts, waste, and mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}