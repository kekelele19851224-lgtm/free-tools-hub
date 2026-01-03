"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Window size presets
const windowSizes = [
  { id: "small", label: "Small", dimensions: "24\" × 36\"", sqft: 6, width: 24, height: 36 },
  { id: "medium", label: "Medium", dimensions: "36\" × 48\"", sqft: 12, width: 36, height: 48 },
  { id: "large", label: "Large", dimensions: "48\" × 60\"", sqft: 20, width: 48, height: 60 },
  { id: "xlarge", label: "X-Large", dimensions: "60\" × 72\"", sqft: 30, width: 60, height: 72 },
  { id: "custom", label: "Custom", dimensions: "Custom size", sqft: 0, width: 0, height: 0 },
];

// Window types with price multipliers
const windowTypes = [
  { id: "fixed", label: "Fixed/Picture", multiplier: 1.0, description: "Non-opening, most affordable" },
  { id: "single-hung", label: "Single-Hung", multiplier: 1.15, description: "Bottom panel opens" },
  { id: "double-hung", label: "Double-Hung", multiplier: 1.25, description: "Both panels open" },
  { id: "casement", label: "Casement", multiplier: 1.30, description: "Hinged, opens outward" },
  { id: "sliding", label: "Sliding", multiplier: 1.35, description: "Horizontal slide" },
];

// Frame materials with base prices per sq ft
const frameMaterials = [
  { id: "aluminum", label: "Aluminum", basePricePerSqFt: 35, installPerSqFt: 12, description: "Affordable, less insulation" },
  { id: "vinyl", label: "Vinyl", basePricePerSqFt: 45, installPerSqFt: 14, description: "Best value, energy efficient" },
  { id: "fiberglass", label: "Fiberglass", basePricePerSqFt: 60, installPerSqFt: 16, description: "Durable, premium option" },
  { id: "wood", label: "Wood", basePricePerSqFt: 80, installPerSqFt: 20, description: "Premium, highest cost" },
];

// Glass options
const glassOptions = [
  { id: "standard", label: "Standard Impact", multiplier: 1.0, description: "Laminated impact glass" },
  { id: "lowe", label: "Low-E Coating", multiplier: 1.15, description: "Better energy efficiency" },
  { id: "triple", label: "Triple-Pane", multiplier: 1.30, description: "Maximum insulation" },
];

// Price by size reference data
const priceBySize = [
  { size: "Small (24\"×36\")", material: "$300 - $500", installed: "$500 - $900" },
  { size: "Medium (36\"×48\")", material: "$500 - $800", installed: "$800 - $1,400" },
  { size: "Large (48\"×60\")", material: "$800 - $1,200", installed: "$1,200 - $2,000" },
  { size: "X-Large (60\"×72\")", material: "$1,200 - $1,800", installed: "$1,800 - $2,800" },
];

// FAQ data
const faqs = [
  {
    question: "How much do hurricane impact windows cost?",
    answer: "Hurricane impact windows typically cost $800 to $2,500 per window installed, depending on size, frame material, and glass type. Material costs range from $300 to $1,200 per window, with installation adding $100 to $400 per window. For a whole house with 15-20 windows, expect to pay $12,000 to $40,000 total."
  },
  {
    question: "How much do impact windows cost for a 2000 sq ft house?",
    answer: "A 2000 sq ft house typically has 15-20 windows. At an average of $1,200-$1,800 per window installed, you can expect to pay $18,000 to $36,000 for impact windows throughout the home. Costs vary based on window sizes, styles, and the frame material you choose."
  },
  {
    question: "Are impact windows worth the cost?",
    answer: "Yes, impact windows are worth the investment for several reasons: 1) They protect your home from hurricane damage that could cost tens of thousands to repair, 2) Many insurance companies offer 10-45% discounts on homeowners insurance, 3) They increase home value by 1-3%, 4) They reduce energy bills by improving insulation, and 5) They provide year-round security against break-ins."
  },
  {
    question: "Do impact windows reduce insurance costs?",
    answer: "Yes, impact windows can significantly reduce homeowners insurance premiums, especially in hurricane-prone areas like Florida. Discounts typically range from 10% to 45% depending on your insurance provider and location. Some Florida homeowners save $1,000-$3,000 annually on insurance after installing impact windows."
  },
  {
    question: "What are the negatives of impact windows?",
    answer: "The main drawbacks of impact windows include: 1) High upfront cost ($800-$2,500 per window), 2) Heavier than regular windows, requiring sturdy frames, 3) Some styles have visible interlayer that may affect aesthetics, 4) Limited DIY installation due to weight and precision required, and 5) Replacement glass is expensive if damaged."
  },
  {
    question: "What is the best hurricane impact window brand?",
    answer: "Top hurricane impact window brands include PGT (most popular in Florida), Andersen (Stormwatch line), Pella (Hurricane Shield), CGI Windows, and MI Windows. PGT is often considered the best value for Florida homes, while Andersen and Pella offer premium options with excellent warranties."
  },
  {
    question: "How long do impact windows last?",
    answer: "Quality hurricane impact windows typically last 25-40 years with proper maintenance. Vinyl and fiberglass frames tend to last longer than aluminum. The laminated glass itself doesn't degrade, but seals and hardware may need replacement after 15-20 years. Most manufacturers offer 10-25 year warranties."
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
        <svg
          style={{
            width: "20px",
            height: "20px",
            color: "#6B7280",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div style={{
        maxHeight: isOpen ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.2s ease-out"
      }}>
        <p style={{ color: "#4B5563", paddingBottom: "16px", margin: 0, lineHeight: "1.6" }}>{answer}</p>
      </div>
    </div>
  );
}

export default function HurricaneImpactWindowsCostCalculator() {
  // Inputs
  const [windowCount, setWindowCount] = useState<number>(10);
  const [customCount, setCustomCount] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("medium");
  const [customWidth, setCustomWidth] = useState<string>("36");
  const [customHeight, setCustomHeight] = useState<string>("48");
  const [selectedType, setSelectedType] = useState<string>("double-hung");
  const [selectedFrame, setSelectedFrame] = useState<string>("vinyl");
  const [selectedGlass, setSelectedGlass] = useState<string>("standard");
  const [isReplacement, setIsReplacement] = useState<boolean>(true);

  // Results
  const [results, setResults] = useState({
    materialLow: 0,
    materialHigh: 0,
    installLow: 0,
    installHigh: 0,
    totalLow: 0,
    totalHigh: 0,
    perWindowLow: 0,
    perWindowHigh: 0,
    perSqFtLow: 0,
    perSqFtHigh: 0,
    totalSqFt: 0,
  });

  // Calculate costs
  useEffect(() => {
    const count = customCount ? parseInt(customCount) || 10 : windowCount;
    
    // Get square footage per window
    let sqftPerWindow: number;
    if (selectedSize === "custom") {
      const w = parseFloat(customWidth) || 36;
      const h = parseFloat(customHeight) || 48;
      sqftPerWindow = (w * h) / 144; // Convert sq inches to sq feet
    } else {
      const sizeData = windowSizes.find(s => s.id === selectedSize);
      sqftPerWindow = sizeData?.sqft || 12;
    }
    
    const totalSqFt = sqftPerWindow * count;
    
    // Get multipliers
    const typeData = windowTypes.find(t => t.id === selectedType);
    const typeMultiplier = typeData?.multiplier || 1.0;
    
    const frameData = frameMaterials.find(f => f.id === selectedFrame);
    const basePricePerSqFt = frameData?.basePricePerSqFt || 45;
    const installPerSqFt = frameData?.installPerSqFt || 14;
    
    const glassData = glassOptions.find(g => g.id === selectedGlass);
    const glassMultiplier = glassData?.multiplier || 1.0;
    
    // Replacement adds extra cost
    const replacementMultiplier = isReplacement ? 1.1 : 1.0;
    
    // Calculate material costs (with 20% variance range)
    const baseMaterial = totalSqFt * basePricePerSqFt * typeMultiplier * glassMultiplier;
    const materialLow = Math.round(baseMaterial * 0.85);
    const materialHigh = Math.round(baseMaterial * 1.15);
    
    // Calculate installation costs
    const baseInstall = totalSqFt * installPerSqFt * replacementMultiplier;
    const installLow = Math.round(baseInstall * 0.85);
    const installHigh = Math.round(baseInstall * 1.15);
    
    // Totals
    const totalLow = materialLow + installLow;
    const totalHigh = materialHigh + installHigh;
    
    // Per window
    const perWindowLow = Math.round(totalLow / count);
    const perWindowHigh = Math.round(totalHigh / count);
    
    // Per sq ft
    const perSqFtLow = Math.round(totalLow / totalSqFt);
    const perSqFtHigh = Math.round(totalHigh / totalSqFt);
    
    setResults({
      materialLow,
      materialHigh,
      installLow,
      installHigh,
      totalLow,
      totalHigh,
      perWindowLow,
      perWindowHigh,
      perSqFtLow,
      perSqFtHigh,
      totalSqFt: Math.round(totalSqFt),
    });
  }, [windowCount, customCount, selectedSize, customWidth, customHeight, selectedType, selectedFrame, selectedGlass, isReplacement]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  const effectiveCount = customCount ? parseInt(customCount) || 10 : windowCount;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Hurricane Impact Windows Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🌀</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Hurricane Impact Windows Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the cost of hurricane impact windows for your home. Calculate material and installation costs by window size, type, and frame material.
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
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Quick Answer</p>
              <p style={{ color: "#1E40AF", margin: 0, fontSize: "0.95rem" }}>
                Hurricane impact windows typically cost <strong>$800 to $2,500 per window installed</strong>. For a home with 15-20 windows, expect to pay <strong>$15,000 to $40,000 total</strong>. Many Florida homeowners save 10-45% on insurance after installation.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          marginBottom: "40px",
          overflow: "hidden"
        }}>
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Number of Windows */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🪟 Number of Windows
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {[5, 10, 15, 20, 25].map((num) => (
                      <button
                        key={num}
                        onClick={() => { setWindowCount(num); setCustomCount(""); }}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: windowCount === num && !customCount ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: windowCount === num && !customCount ? "#DBEAFE" : "white",
                          color: windowCount === num && !customCount ? "#1E40AF" : "#374151",
                          fontWeight: "600",
                          cursor: "pointer",
                          fontSize: "0.95rem"
                        }}
                      >
                        {num}
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder="Other"
                      value={customCount}
                      onChange={(e) => setCustomCount(e.target.value)}
                      style={{
                        width: "80px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: customCount ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: customCount ? "#DBEAFE" : "white",
                        textAlign: "center",
                        fontSize: "0.95rem",
                        fontWeight: "600"
                      }}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                {/* Window Size */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📐 Window Size (Average)
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    {windowSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedSize === size.id ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: selectedSize === size.id ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: selectedSize === size.id ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                          {size.label}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                          {size.dimensions}
                        </p>
                      </button>
                    ))}
                  </div>
                  {selectedSize === "custom" && (
                    <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Width (inches)</label>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "0.95rem"
                          }}
                          min="12"
                          max="120"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Height (inches)</label>
                        <input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid #E5E7EB",
                            borderRadius: "6px",
                            fontSize: "0.95rem"
                          }}
                          min="12"
                          max="120"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Window Type */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🚪 Window Type
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {windowTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedType === type.id ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: selectedType === type.id ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "600", color: selectedType === type.id ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                            {type.label}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                            {type.description}
                          </p>
                        </div>
                        {type.multiplier > 1 && (
                          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            +{Math.round((type.multiplier - 1) * 100)}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Material */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🔲 Frame Material
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {frameMaterials.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedFrame === frame.id ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: selectedFrame === frame.id ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <p style={{ fontWeight: "600", color: selectedFrame === frame.id ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                          {frame.label}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                          {frame.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glass Options */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🔍 Glass Options
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {glassOptions.map((glass) => (
                      <button
                        key={glass.id}
                        onClick={() => setSelectedGlass(glass.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedGlass === glass.id ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                          backgroundColor: selectedGlass === glass.id ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "600", color: selectedGlass === glass.id ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                            {glass.label}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                            {glass.description}
                          </p>
                        </div>
                        {glass.multiplier > 1 && (
                          <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            +{Math.round((glass.multiplier - 1) * 100)}%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Installation Type */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🔧 Installation Type
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      onClick={() => setIsReplacement(false)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: !isReplacement ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: !isReplacement ? "#DBEAFE" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <p style={{ fontWeight: "600", color: !isReplacement ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                        New Construction
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                        New window openings
                      </p>
                    </button>
                    <button
                      onClick={() => setIsReplacement(true)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: isReplacement ? "2px solid #1E40AF" : "1px solid #E5E7EB",
                        backgroundColor: isReplacement ? "#DBEAFE" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <p style={{ fontWeight: "600", color: isReplacement ? "#1E40AF" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                        Replacement
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                        Replacing existing windows
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Total Cost */}
                <div style={{
                  backgroundColor: "#1E40AF",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Total Estimated Cost
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {formatCurrency(results.totalLow)} - {formatCurrency(results.totalHigh)}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                    for {effectiveCount} windows ({results.totalSqFt} sq ft total)
                  </p>
                </div>

                {/* Cost Breakdown */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#F0F9FF", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>📦 Material Cost</p>
                    <p style={{ fontSize: "1rem", fontWeight: "700", color: "#0369A1", margin: 0 }}>
                      {formatCurrency(results.materialLow)} - {formatCurrency(results.materialHigh)}
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>🔧 Installation</p>
                    <p style={{ fontSize: "1rem", fontWeight: "700", color: "#B45309", margin: 0 }}>
                      {formatCurrency(results.installLow)} - {formatCurrency(results.installHigh)}
                    </p>
                  </div>
                </div>

                {/* Per Unit Costs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Per Window</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                      {formatCurrency(results.perWindowLow)} - {formatCurrency(results.perWindowHigh)}
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Per Sq Ft</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#111827", margin: 0 }}>
                      ${results.perSqFtLow} - ${results.perSqFtHigh}
                    </p>
                  </div>
                </div>

                {/* Insurance Savings */}
                <div style={{ backgroundColor: "#ECFDF5", padding: "16px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #A7F3D0" }}>
                  <h4 style={{ fontWeight: "600", color: "#059669", marginBottom: "8px", fontSize: "0.9rem" }}>
                    💰 Potential Insurance Savings
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "#047857", margin: 0 }}>
                    Many Florida homeowners save <strong>10-45%</strong> on insurance premiums after installing impact windows. That could mean <strong>$500 - $3,000+ per year</strong> in savings!
                  </p>
                </div>

                {/* Your Selections */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.9rem" }}>
                    📋 Your Selections
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Windows:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>{effectiveCount}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Size:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {windowSizes.find(s => s.id === selectedSize)?.label || "Custom"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Type:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {windowTypes.find(t => t.id === selectedType)?.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Frame:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {frameMaterials.find(f => f.id === selectedFrame)?.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>Glass:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {glassOptions.find(g => g.id === selectedGlass)?.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Installation:</span>
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {isReplacement ? "Replacement" : "New Construction"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Impact Window Cost by Size
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            Average prices for vinyl-framed double-hung impact windows
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Window Size</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Material Only</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#DBEAFE" }}>Installed</th>
                </tr>
              </thead>
              <tbody>
                {priceBySize.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                      {row.size}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {row.material}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#1E40AF", fontWeight: "600" }}>
                      {row.installed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* Cost Factors */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💰 What Affects Impact Window Cost?
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Window Size & Shape</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Larger windows and custom shapes (arched, circular) cost significantly more due to increased materials and manufacturing complexity.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Frame Material</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Aluminum is cheapest but less energy efficient. Vinyl offers the best value. Fiberglass and wood are premium options.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Glass Type & Features</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Low-E coating adds 10-15% but improves energy efficiency. Triple-pane glass adds 25-30% for maximum insulation.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#1E40AF", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Installation Complexity</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Second-floor windows, difficult access, and replacing non-standard sizes add to labor costs. Permits may be required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✅ Benefits of Hurricane Impact Windows
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🌀</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#059669" }}>Hurricane Protection</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Withstands Category 5 winds (155+ mph)</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#EFF6FF", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>💰</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#1E40AF" }}>Insurance Savings</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - 10-45% discount on homeowners insurance</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>⚡</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#B45309" }}>Energy Efficiency</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Reduces cooling costs 10-30%</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F3E8FF", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🔇</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#7C3AED" }}>Noise Reduction</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Blocks 25-50% of outside noise</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#FEE2E2", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🔒</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#DC2626" }}>Security</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Highly resistant to break-ins</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🏠</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#374151" }}>Home Value</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> - Increases property value 1-3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Top Brands */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🏆 Top Impact Window Brands
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#374151" }}>PGT</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Best Value</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Andersen</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Premium</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#374151" }}>Pella</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Premium</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#374151" }}>CGI</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Florida Favorite</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                  <span style={{ fontWeight: "600", color: "#374151" }}>MI Windows</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Budget-Friendly</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "#EFF6FF",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #BFDBFE"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>
                💡 Money-Saving Tips
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#1E3A8A", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Get 3+ quotes from licensed contractors</li>
                <li style={{ marginBottom: "8px" }}>Ask about insurance discounts before buying</li>
                <li style={{ marginBottom: "8px" }}>Consider vinyl frames for best value</li>
                <li style={{ marginBottom: "8px" }}>Buy off-season (fall/winter) for deals</li>
                <li>Check for manufacturer rebates</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/hurricane-impact-windows-cost-calculator"
              currentCategory="Home"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🌀 <strong>Disclaimer:</strong> This calculator provides estimates based on average industry pricing. Actual costs vary by location, contractor, specific products, and market conditions. Always get multiple quotes from licensed contractors for accurate pricing. Prices shown are for the continental United States and may differ in coastal areas with higher demand.
          </p>
        </div>
      </div>
    </div>
  );
}