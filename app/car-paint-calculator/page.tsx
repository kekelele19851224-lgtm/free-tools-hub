"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Vehicle types with surface area presets (sq ft)
const vehicleTypes = [
  { name: "Compact Car (Civic, Corolla)", minArea: 100, maxArea: 130, avgArea: 115 },
  { name: "Mid-size Sedan (Camry, Accord)", minArea: 130, maxArea: 160, avgArea: 145 },
  { name: "Full-size Sedan (Charger, Impala)", minArea: 160, maxArea: 180, avgArea: 170 },
  { name: "Coupe / Sports Car", minArea: 90, maxArea: 120, avgArea: 105 },
  { name: "Small SUV (RAV4, CR-V)", minArea: 140, maxArea: 170, avgArea: 155 },
  { name: "Mid-size SUV (Highlander, Pilot)", minArea: 170, maxArea: 210, avgArea: 190 },
  { name: "Large SUV (Tahoe, Expedition)", minArea: 210, maxArea: 250, avgArea: 230 },
  { name: "Compact Pickup", minArea: 150, maxArea: 180, avgArea: 165 },
  { name: "Full-size Pickup (F-150, Silverado)", minArea: 200, maxArea: 260, avgArea: 230 },
  { name: "Minivan", minArea: 180, maxArea: 220, avgArea: 200 },
  { name: "Motorcycle", minArea: 15, maxArea: 25, avgArea: 20 }
];

// Paint types with coverage rates (sq ft per gallon)
const paintTypes = [
  { name: "Primer / Sealer", coverage: 225, coatsRecommended: 2 },
  { name: "Basecoat - Solid Color", coverage: 375, coatsRecommended: 3 },
  { name: "Basecoat - Metallic", coverage: 325, coatsRecommended: 3 },
  { name: "Basecoat - Pearl / Candy", coverage: 300, coatsRecommended: 4 },
  { name: "Clear Coat", coverage: 450, coatsRecommended: 3 },
  { name: "Single-Stage (Color + Gloss)", coverage: 275, coatsRecommended: 3 }
];

// Cost estimation data
const qualityLevels = [
  { 
    name: "Basic", 
    description: "Single coat, minimal prep, synthetic enamel",
    minCost: 500, 
    maxCost: 1500,
    laborHours: "8-15 hours"
  },
  { 
    name: "Standard", 
    description: "2-stage paint, proper prep, urethane paint",
    minCost: 1500, 
    maxCost: 3500,
    laborHours: "20-40 hours"
  },
  { 
    name: "Premium", 
    description: "Multi-stage, extensive prep, high-quality paint",
    minCost: 3500, 
    maxCost: 7000,
    laborHours: "40-80 hours"
  },
  { 
    name: "Show Quality / Custom", 
    description: "Concours prep, custom colors, hand finishing",
    minCost: 7000, 
    maxCost: 20000,
    laborHours: "100+ hours"
  }
];

// Additional cost factors
const additionalCosts = {
  colorChange: { min: 500, max: 1500 },
  dentRepair: { min: 75, max: 150, per: "dent" },
  rustRepair: { min: 150, max: 500, per: "area" },
  waxFinish: { min: 100, max: 200 },
  ceramicCoating: { min: 500, max: 2000 }
};

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much paint I need for a car?",
    answer: "To calculate paint needed: 1) Determine your vehicle's surface area (typically 100-250 sq ft depending on size), 2) Divide by the paint's coverage rate (usually 300-400 sq ft/gallon for basecoat), 3) Multiply by the number of coats (2-3 for basecoat), 4) Add 15-20% for waste/overspray. For example, a mid-size sedan (145 sq ft) with 3 coats of basecoat at 350 sq ft/gal coverage: (145 × 3) ÷ 350 × 1.15 = 1.43 gallons."
  },
  {
    question: "How much would a full car repaint cost?",
    answer: "A full car repaint costs between $500 and $20,000+ depending on quality. Basic paint jobs (single coat, minimal prep) run $500-$1,500. Standard quality (proper prep, 2-stage paint) costs $1,500-$3,500. Premium jobs (extensive prep, high-quality paint) range from $3,500-$7,000. Show-quality or custom paint jobs can exceed $10,000-$20,000. Factors affecting cost include vehicle size, paint quality, color change, surface repairs needed, and labor rates in your area."
  },
  {
    question: "How much paint do I need to paint a car hood?",
    answer: "A typical car hood requires about 1-2 quarts (0.25-0.5 gallons) of basecoat for full coverage. The average hood is 15-25 square feet. With 2-3 coats of basecoat and accounting for overspray, plan for: 1 quart of primer, 1-2 quarts of basecoat, and 1 quart of clear coat. For metallic or pearl colors, you may need slightly more due to lower coverage rates."
  },
  {
    question: "What's the difference between single-stage and basecoat/clearcoat paint?",
    answer: "Single-stage paint combines color and gloss in one product - it's simpler and cheaper but less durable. Basecoat/clearcoat is a 2-stage system where color (basecoat) is applied first, then protected with a clear layer. The 2-stage system offers better durability, deeper shine, UV protection, and easier repairs. Most modern vehicles use basecoat/clearcoat systems. Single-stage is often used for budget restorations or commercial vehicles."
  },
  {
    question: "How many coats of paint does a car need?",
    answer: "A professional paint job typically requires: 2-3 coats of primer/sealer for proper adhesion and surface prep, 2-3 coats of basecoat for complete color coverage (more for lighter colors or metallics), and 2-3 coats of clear coat for protection and gloss. Allow proper flash time between coats (usually 10-15 minutes). Some colors like red, yellow, and white may require additional coats due to lower hiding power."
  },
  {
    question: "Is it cheaper to wrap or paint a car?",
    answer: "Vinyl wrapping typically costs $2,500-$5,000 for a full vehicle, making it comparable to a standard paint job. Wraps are reversible, protect original paint, and offer unique finishes. However, wraps last 5-7 years vs. 10-15+ years for quality paint. Paint is better for damaged surfaces needing repair. For color changes or temporary modifications, wrapping may be more economical. For long-term ownership and classic cars, paint is usually preferred."
  },
  {
    question: "What affects automotive paint coverage rate?",
    answer: "Several factors affect how much area paint covers: Paint type (primers cover less than clear coats), Color (whites and yellows cover less than blacks), Metallic content (flakes reduce coverage), Application method (HVLP guns are more efficient than conventional), Surface condition (porous surfaces absorb more), Temperature and humidity, Spray technique and distance, and Reduction ratio. Always buy 10-20% more than calculated to account for these variables."
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

// Format number with decimals
function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

// Convert gallons to other units
function gallonsToQuarts(gallons: number): number {
  return gallons * 4;
}

function gallonsToLiters(gallons: number): number {
  return gallons * 3.785;
}

export default function CarPaintCalculator() {
  // Active tab
  const [activeTab, setActiveTab] = useState<"quantity" | "cost" | "reference">("quantity");

  // Tab 1: Paint Quantity
  const [selectedVehicle, setSelectedVehicle] = useState<number>(1);
  const [useCustomArea, setUseCustomArea] = useState<boolean>(false);
  const [customArea, setCustomArea] = useState<string>("150");
  const [selectedPaintType, setSelectedPaintType] = useState<number>(1);
  const [numberOfCoats, setNumberOfCoats] = useState<string>("3");
  const [wasteFactor, setWasteFactor] = useState<string>("15");
  const [customCoverage, setCustomCoverage] = useState<string>("");

  // Tab 2: Cost Estimator
  const [costVehicleSize, setCostVehicleSize] = useState<number>(1);
  const [qualityLevel, setQualityLevel] = useState<number>(1);
  const [isColorChange, setIsColorChange] = useState<boolean>(false);
  const [dentCount, setDentCount] = useState<string>("0");
  const [rustAreas, setRustAreas] = useState<string>("0");
  const [includeWax, setIncludeWax] = useState<boolean>(false);
  const [includeCeramic, setIncludeCeramic] = useState<boolean>(false);

  // Tab 1 calculations
  const surfaceArea = useCustomArea ? (parseFloat(customArea) || 0) : vehicleTypes[selectedVehicle].avgArea;
  const paintType = paintTypes[selectedPaintType];
  const coverageRate = customCoverage ? parseFloat(customCoverage) : paintType.coverage;
  const coats = parseFloat(numberOfCoats) || 1;
  const waste = (parseFloat(wasteFactor) || 0) / 100;

  const totalAreaTocover = surfaceArea * coats;
  const paintNeededBase = totalAreaTocover / coverageRate;
  const paintNeededWithWaste = paintNeededBase * (1 + waste);

  // Tab 2 calculations
  const baseQuality = qualityLevels[qualityLevel];
  const vehicleSizeMultiplier = costVehicleSize <= 3 ? 1 : costVehicleSize <= 6 ? 1.2 : costVehicleSize <= 8 ? 1.4 : 1.5;

  let minTotalCost = baseQuality.minCost * vehicleSizeMultiplier;
  let maxTotalCost = baseQuality.maxCost * vehicleSizeMultiplier;

  if (isColorChange) {
    minTotalCost += additionalCosts.colorChange.min;
    maxTotalCost += additionalCosts.colorChange.max;
  }

  const dents = parseInt(dentCount) || 0;
  if (dents > 0) {
    minTotalCost += dents * additionalCosts.dentRepair.min;
    maxTotalCost += dents * additionalCosts.dentRepair.max;
  }

  const rust = parseInt(rustAreas) || 0;
  if (rust > 0) {
    minTotalCost += rust * additionalCosts.rustRepair.min;
    maxTotalCost += rust * additionalCosts.rustRepair.max;
  }

  if (includeWax) {
    minTotalCost += additionalCosts.waxFinish.min;
    maxTotalCost += additionalCosts.waxFinish.max;
  }

  if (includeCeramic) {
    minTotalCost += additionalCosts.ceramicCoating.min;
    maxTotalCost += additionalCosts.ceramicCoating.max;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Car Paint Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🎨</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Car Paint Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much paint you need for your vehicle. Estimate primer, basecoat, and clear coat quantities 
            with cost estimator. Perfect for DIY painters and professionals.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FFF7ED",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FDBA74"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#C2410C", margin: "0 0 4px 0" }}>
                Average mid-size sedan needs: <strong>1-1.5 gal</strong> primer + <strong>1.5-2 gal</strong> basecoat + <strong>1-1.5 gal</strong> clear coat
              </p>
              <p style={{ color: "#EA580C", margin: 0, fontSize: "0.95rem" }}>
                Total cost range: $1,500 - $5,000 depending on quality and prep work
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
            backgroundColor: "#ECFDF5",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #6EE7B7"
          }}>
            <span>✓</span>
            <span style={{ color: "#047857", fontWeight: "600", fontSize: "0.85rem" }}>11 Vehicle Types</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EFF6FF",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #93C5FD"
          }}>
            <span>✓</span>
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>6 Paint Types</span>
          </div>
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
            <span style={{ color: "#B45309", fontWeight: "600", fontSize: "0.85rem" }}>Cost Estimator</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("quantity")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "quantity" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "quantity" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🎨 Paint Quantity
          </button>
          <button
            onClick={() => setActiveTab("cost")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "cost" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "cost" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            💰 Cost Estimator
          </button>
          <button
            onClick={() => setActiveTab("reference")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "reference" ? "#EA580C" : "#E5E7EB",
              color: activeTab === "reference" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Reference Charts
          </button>
        </div>

        {/* Tab 1: Paint Quantity */}
        {activeTab === "quantity" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚗 Vehicle & Paint Details</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Vehicle Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vehicle Type
                  </label>
                  <select
                    value={selectedVehicle}
                    onChange={(e) => { setSelectedVehicle(parseInt(e.target.value)); setUseCustomArea(false); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "2px solid #EA580C",
                      fontSize: "1rem",
                      backgroundColor: "#FFF7ED",
                      boxSizing: "border-box"
                    }}
                  >
                    {vehicleTypes.map((vehicle, index) => (
                      <option key={index} value={index}>{vehicle.name} (~{vehicle.avgArea} sq ft)</option>
                    ))}
                  </select>
                </div>

                {/* Custom Area Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={useCustomArea}
                      onChange={(e) => setUseCustomArea(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>Use custom surface area</span>
                  </label>
                  {useCustomArea && (
                    <div style={{ marginTop: "12px" }}>
                      <div style={{ position: "relative" }}>
                        <input
                          type="number"
                          value={customArea}
                          onChange={(e) => setCustomArea(e.target.value)}
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
                        <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280" }}>sq ft</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Paint Type */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Paint Type
                  </label>
                  <select
                    value={selectedPaintType}
                    onChange={(e) => { setSelectedPaintType(parseInt(e.target.value)); setCustomCoverage(""); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {paintTypes.map((paint, index) => (
                      <option key={index} value={index}>{paint.name} (~{paint.coverage} sq ft/gal)</option>
                    ))}
                  </select>
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    Recommended: {paintType.coatsRecommended} coats
                  </p>
                </div>

                {/* Number of Coats */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Number of Coats
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumberOfCoats(String(num))}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          border: numberOfCoats === String(num) ? "2px solid #EA580C" : "1px solid #E5E7EB",
                          backgroundColor: numberOfCoats === String(num) ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          fontSize: "1rem",
                          fontWeight: numberOfCoats === String(num) ? "600" : "normal"
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Waste Factor */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Waste Factor (Overspray)
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[10, 15, 20, 25].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setWasteFactor(String(pct))}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: wasteFactor === String(pct) ? "2px solid #EA580C" : "1px solid #E5E7EB",
                          backgroundColor: wasteFactor === String(pct) ? "#FFF7ED" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: wasteFactor === String(pct) ? "600" : "normal"
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                  <p style={{ margin: "6px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                    15-20% is typical for HVLP spray guns
                  </p>
                </div>

                {/* Custom Coverage Override */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Custom Coverage Rate (Optional)
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number"
                      value={customCoverage}
                      onChange={(e) => setCustomCoverage(e.target.value)}
                      placeholder={`Using ${paintType.coverage} sq ft/gal`}
                      style={{
                        width: "100%",
                        padding: "12px",
                        paddingRight: "80px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", fontSize: "0.85rem" }}>sq ft/gal</span>
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                    💡 <strong>Tip:</strong> Check your paint&apos;s Technical Data Sheet (TDS) for exact coverage rates. Metallic and pearl colors typically cover 10-15% less than solid colors.
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
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎨 Paint Required</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #6EE7B7"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#065F46" }}>Total Paint Needed</p>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#059669" }}>
                    {formatNumber(paintNeededWithWaste)} gal
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", color: "#047857" }}>
                    {formatNumber(gallonsToQuarts(paintNeededWithWaste))} quarts • {formatNumber(gallonsToLiters(paintNeededWithWaste))} liters
                  </p>
                </div>

                {/* Calculation Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Calculation Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Surface Area</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{surfaceArea} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Number of Coats</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{coats}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Total Area to Cover</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{formatNumber(totalAreaTocover, 0)} sq ft</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>Coverage Rate</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{coverageRate} sq ft/gal</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FFF7ED", borderRadius: "6px" }}>
                      <span style={{ color: "#C2410C" }}>Base Paint Needed</span>
                      <span style={{ fontWeight: "600", color: "#EA580C" }}>{formatNumber(paintNeededBase)} gal</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                      <span style={{ color: "#92400E" }}>+ Waste Factor ({wasteFactor}%)</span>
                      <span style={{ fontWeight: "600", color: "#D97706" }}>+{formatNumber(paintNeededBase * waste)} gal</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "6px", border: "1px solid #6EE7B7" }}>
                      <span style={{ color: "#065F46", fontWeight: "600" }}>Total Required</span>
                      <span style={{ fontWeight: "bold", color: "#059669", fontSize: "1.1rem" }}>{formatNumber(paintNeededWithWaste)} gallons</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Recommendation */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1E40AF", fontWeight: "600" }}>
                    🛒 Purchase Recommendation
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#2563EB" }}>
                    Buy <strong>{Math.ceil(gallonsToQuarts(paintNeededWithWaste))} quarts</strong> ({Math.ceil(paintNeededWithWaste)} gallons) to ensure you have enough for touch-ups and mistakes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cost Estimator */}
        {activeTab === "cost" && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Project Details</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Vehicle Size */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Vehicle Size
                  </label>
                  <select
                    value={costVehicleSize}
                    onChange={(e) => setCostVehicleSize(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      backgroundColor: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    {vehicleTypes.map((vehicle, index) => (
                      <option key={index} value={index}>{vehicle.name}</option>
                    ))}
                  </select>
                </div>

                {/* Quality Level */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Paint Job Quality
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {qualityLevels.map((level, index) => (
                      <button
                        key={index}
                        onClick={() => setQualityLevel(index)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: qualityLevel === index ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                          backgroundColor: qualityLevel === index ? "#F5F3FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ fontWeight: "600", color: qualityLevel === index ? "#7C3AED" : "#374151" }}>{level.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "2px" }}>{level.description}</div>
                        <div style={{ fontSize: "0.85rem", color: "#059669", marginTop: "4px", fontWeight: "600" }}>
                          ${level.minCost.toLocaleString()} - ${level.maxCost.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                    Additional Factors
                  </label>
                  
                  {/* Color Change */}
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={isColorChange}
                      onChange={(e) => setIsColorChange(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>Color Change</span>
                      <span style={{ fontSize: "0.8rem", color: "#6B7280", marginLeft: "8px" }}>+$500-$1,500</span>
                    </div>
                  </label>

                  {/* Dent Repair */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.9rem", color: "#374151", minWidth: "100px" }}>Dent Repairs:</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[0, 1, 2, 3, 5, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => setDentCount(String(num))}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: dentCount === String(num) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                            backgroundColor: dentCount === String(num) ? "#F5F3FF" : "white",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rust Repair */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.9rem", color: "#374151", minWidth: "100px" }}>Rust Areas:</span>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[0, 1, 2, 3, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => setRustAreas(String(num))}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: rustAreas === String(num) ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                            backgroundColor: rustAreas === String(num) ? "#F5F3FF" : "white",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Protective Finish */}
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeWax}
                      onChange={(e) => setIncludeWax(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>Wax Finish</span>
                      <span style={{ fontSize: "0.8rem", color: "#6B7280", marginLeft: "8px" }}>+$100-$200</span>
                    </div>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={includeCeramic}
                      onChange={(e) => setIncludeCeramic(e.target.checked)}
                      style={{ width: "18px", height: "18px" }}
                    />
                    <div>
                      <span style={{ fontSize: "0.9rem", color: "#374151" }}>Ceramic Coating</span>
                      <span style={{ fontSize: "0.8rem", color: "#6B7280", marginLeft: "8px" }}>+$500-$2,000</span>
                    </div>
                  </label>
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
              <div style={{ backgroundColor: "#6D28D9", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Cost Estimate</h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#F5F3FF",
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "center",
                  marginBottom: "20px",
                  border: "2px solid #C4B5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#5B21B6" }}>Estimated Total Cost</p>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7C3AED" }}>
                    ${Math.round(minTotalCost).toLocaleString()} - ${Math.round(maxTotalCost).toLocaleString()}
                  </div>
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6D28D9" }}>
                    {qualityLevels[qualityLevel].name} Quality
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ marginBottom: "20px" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                    Cost Breakdown
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F5F3FF", borderRadius: "6px" }}>
                      <span style={{ color: "#5B21B6" }}>Base Paint Job ({qualityLevels[qualityLevel].name})</span>
                      <span style={{ fontWeight: "600", color: "#7C3AED" }}>
                        ${Math.round(baseQuality.minCost * vehicleSizeMultiplier).toLocaleString()} - ${Math.round(baseQuality.maxCost * vehicleSizeMultiplier).toLocaleString()}
                      </span>
                    </div>
                    {isColorChange && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF3C7", borderRadius: "6px" }}>
                        <span style={{ color: "#92400E" }}>Color Change</span>
                        <span style={{ fontWeight: "600", color: "#D97706" }}>+$500 - $1,500</span>
                      </div>
                    )}
                    {dents > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                        <span style={{ color: "#991B1B" }}>Dent Repair ({dents} dents)</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>+${dents * 75} - ${dents * 150}</span>
                      </div>
                    )}
                    {rust > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#FEF2F2", borderRadius: "6px" }}>
                        <span style={{ color: "#991B1B" }}>Rust Repair ({rust} areas)</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>+${rust * 150} - ${rust * 500}</span>
                      </div>
                    )}
                    {includeWax && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                        <span style={{ color: "#065F46" }}>Wax Finish</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>+$100 - $200</span>
                      </div>
                    )}
                    {includeCeramic && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#ECFDF5", borderRadius: "6px" }}>
                        <span style={{ color: "#065F46" }}>Ceramic Coating</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>+$500 - $2,000</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Labor Info */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#374151", fontWeight: "600" }}>
                    ⏱️ Estimated Labor Time
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#6B7280" }}>
                    {qualityLevels[qualityLevel].laborHours} for a {qualityLevels[qualityLevel].name.toLowerCase()} quality job
                  </p>
                </div>

                {/* DIY vs Pro */}
                <div style={{
                  backgroundColor: "#EFF6FF",
                  borderRadius: "8px",
                  padding: "16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#1E40AF", fontWeight: "600" }}>
                    💡 DIY Savings Potential
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#2563EB" }}>
                    DIY paint materials cost approximately ${Math.round(minTotalCost * 0.25).toLocaleString()} - ${Math.round(maxTotalCost * 0.35).toLocaleString()}.
                    You could save 50-70% by doing it yourself (equipment not included).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Reference Charts */}
        {activeTab === "reference" && (
          <div style={{ marginBottom: "40px" }}>
            {/* Vehicle Surface Area Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#EA580C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🚗 Vehicle Surface Area Reference</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FFF7ED" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Vehicle Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Min (sq ft)</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Max (sq ft)</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleTypes.map((vehicle, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{vehicle.name}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{vehicle.minArea}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{vehicle.maxArea}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#EA580C" }}>{vehicle.avgArea}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paint Coverage Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🎨 Paint Coverage Rates</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#ECFDF5" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Paint Type</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Coverage (sq ft/gal)</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Recommended Coats</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Typical Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paintTypes.map((paint, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{paint.name}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{paint.coverage}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{paint.coatsRecommended}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontSize: "0.85rem", color: "#6B7280" }}>
                          {index === 0 ? "Surface prep" : index === 4 ? "Protection/Gloss" : index === 5 ? "Budget/Classics" : "Color layer"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cost Comparison Table */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
              marginBottom: "24px"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>💰 Paint Job Quality & Cost Comparison</h2>
              </div>
              <div style={{ padding: "24px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F5F3FF" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Quality Level</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cost Range</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Labor Time</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>What&apos;s Included</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityLevels.map((level, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{level.name}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#7C3AED" }}>
                          ${level.minCost.toLocaleString()} - ${level.maxCost.toLocaleString()}
                        </td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{level.laborHours}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontSize: "0.85rem", color: "#6B7280" }}>{level.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Reference Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {/* DIY Tips */}
              <div style={{ backgroundColor: "#ECFDF5", borderRadius: "12px", padding: "20px", border: "1px solid #6EE7B7" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>🔧 DIY Tips</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#047857", fontSize: "0.9rem", lineHeight: "1.8" }}>
                  <li>Always buy 15-20% more paint than calculated</li>
                  <li>Test spray on cardboard first</li>
                  <li>Use HVLP guns for better efficiency</li>
                  <li>Work in 65-75°F, low humidity</li>
                  <li>Allow proper flash time between coats</li>
                </ul>
              </div>

              {/* Common Mistakes */}
              <div style={{ backgroundColor: "#FEF2F2", borderRadius: "12px", padding: "20px", border: "1px solid #FECACA" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Common Mistakes</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#B91C1C", fontSize: "0.9rem", lineHeight: "1.8" }}>
                  <li>Skipping proper surface prep</li>
                  <li>Spraying too close or too far</li>
                  <li>Not allowing paint to dry between coats</li>
                  <li>Painting in dusty environments</li>
                  <li>Underestimating paint quantity needed</li>
                </ul>
              </div>

              {/* Paint Layers Guide */}
              <div style={{ backgroundColor: "#EFF6FF", borderRadius: "12px", padding: "20px", border: "1px solid #93C5FD" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>📚 Typical Paint System</h3>
                <div style={{ fontSize: "0.9rem", color: "#2563EB", lineHeight: "1.8" }}>
                  <p style={{ margin: "0 0 8px 0" }}><strong>1. Prep:</strong> Sand, clean, mask</p>
                  <p style={{ margin: "0 0 8px 0" }}><strong>2. Primer:</strong> 2-3 coats, sand between</p>
                  <p style={{ margin: "0 0 8px 0" }}><strong>3. Basecoat:</strong> 3-4 coats for full coverage</p>
                  <p style={{ margin: 0 }}><strong>4. Clearcoat:</strong> 2-3 coats for protection</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🎨 Complete Guide to Automotive Paint</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Whether you&apos;re restoring a classic car, refreshing your daily driver, or customizing a project vehicle, 
                  understanding how much paint you need is crucial for a successful paint job. This calculator helps you 
                  estimate the exact quantities of primer, basecoat, and clear coat required for your project.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Understanding Paint Systems</h3>
                <p>
                  Modern automotive paint typically uses a <strong>basecoat/clearcoat system</strong>. The basecoat provides 
                  the color, while the clearcoat adds gloss and UV protection. This two-stage system offers better durability 
                  and easier repairs compared to older single-stage paints.
                </p>

                <div style={{
                  backgroundColor: "#FFF7ED",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #FDBA74"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#C2410C" }}>🎨 Paint Layer Order</p>
                  <ol style={{ margin: 0, paddingLeft: "20px", color: "#EA580C" }}>
                    <li><strong>Surface Prep:</strong> Sanding, cleaning, masking</li>
                    <li><strong>Primer/Sealer:</strong> Promotes adhesion, fills imperfections</li>
                    <li><strong>Basecoat:</strong> Your chosen color (multiple coats)</li>
                    <li><strong>Clearcoat:</strong> Protection, gloss, UV resistance</li>
                  </ol>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors Affecting Paint Coverage</h3>
                <p>
                  Several factors influence how much paint you&apos;ll actually need. <strong>Paint color</strong> matters significantly - 
                  white, yellow, and red colors typically require more coats than black or dark colors. <strong>Metallic and pearl</strong> 
                  paints have lower coverage due to the flakes in the formula. Your <strong>spray technique</strong> and equipment 
                  also affect efficiency - HVLP guns waste less paint than conventional guns.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>DIY vs Professional Paint Jobs</h3>
                <p>
                  A <strong>professional paint job</strong> costs $1,500-$10,000+ but includes expert surface preparation, 
                  proper spray booths, and warranties. <strong>DIY painting</strong> can save 50-70% on labor costs, but requires 
                  investment in equipment, proper workspace, and significant time. For your first project, consider starting 
                  with a practice panel or secondary vehicle to develop your technique.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#FFF7ED", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FDBA74" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#C2410C", marginBottom: "16px" }}>🎨 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#EA580C", lineHeight: "2" }}>
                <p style={{ margin: 0 }}><strong>Avg Coverage:</strong> 350 sq ft/gal</p>
                <p style={{ margin: 0 }}><strong>Typical Coats:</strong> 2-3 per layer</p>
                <p style={{ margin: 0 }}><strong>Waste Factor:</strong> 15-20%</p>
                <p style={{ margin: 0 }}><strong>Dry Time:</strong> 10-15 min between coats</p>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Always shake/stir paint thoroughly</p>
                <p style={{ margin: "0 0 8px 0" }}>• Strain paint before spraying</p>
                <p style={{ margin: "0 0 8px 0" }}>• Keep spray gun 6-8 inches from surface</p>
                <p style={{ margin: 0 }}>• 50% overlap on each pass</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/car-paint-calculator" currentCategory="Auto" />
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
            🎨 <strong>Disclaimer:</strong> This calculator provides estimates for planning purposes only. Actual paint requirements 
            may vary based on surface condition, spray technique, paint brand, temperature, humidity, and other factors. 
            Always consult your paint manufacturer&apos;s Technical Data Sheet (TDS) for specific coverage rates. 
            Cost estimates are approximate and vary by location and shop.
          </p>
        </div>
      </div>
    </div>
  );
}