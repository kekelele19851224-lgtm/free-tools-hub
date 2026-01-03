"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Lens index options
const lensIndices = [
  { id: "1.50", value: 1.50, name: "1.50 (Standard)", material: "CR-39 Plastic", price: "$", weight: "Heavy" },
  { id: "1.53", value: 1.53, name: "1.53 (Trivex)", material: "Trivex", price: "$$", weight: "Light" },
  { id: "1.59", value: 1.59, name: "1.59 (Polycarbonate)", material: "Polycarbonate", price: "$$", weight: "Light" },
  { id: "1.60", value: 1.60, name: "1.60 (Mid-Index)", material: "MR-8", price: "$$$", weight: "Medium" },
  { id: "1.67", value: 1.67, name: "1.67 (High-Index)", material: "MR-7", price: "$$$$", weight: "Light" },
  { id: "1.74", value: 1.74, name: "1.74 (Ultra High-Index)", material: "MR-174", price: "$$$$$", weight: "Lightest" },
];

// Recommended index by prescription
const indexRecommendations = [
  { range: "0 to ±2.00", recommended: "1.50", notes: "Standard plastic is sufficient" },
  { range: "±2.00 to ±4.00", recommended: "1.56 - 1.60", notes: "Mid-index for better aesthetics" },
  { range: "±4.00 to ±6.00", recommended: "1.60 - 1.67", notes: "High-index recommended" },
  { range: "±6.00 to ±8.00", recommended: "1.67 - 1.74", notes: "High-index strongly recommended" },
  { range: "±8.00+", recommended: "1.74", notes: "Ultra high-index essential" },
];

// FAQ data
const faqs = [
  {
    question: "How do I know what lens thickness I need?",
    answer: "Your lens thickness depends on your prescription strength, frame size, and lens material (index). For prescriptions under ±2.00, standard 1.50 index is fine. For ±2.00 to ±4.00, consider 1.60 index. For stronger prescriptions above ±4.00, high-index lenses (1.67 or 1.74) are recommended to keep lenses thin and lightweight."
  },
  {
    question: "How do you calculate lens thickness?",
    answer: "Lens thickness is calculated using the Sagitta (Sag) formula: Sag = (r² × Power) / (2000 × (n-1)), where r is the lens radius, Power is your prescription in diopters, and n is the refractive index. For minus (nearsighted) lenses, edge thickness = center thickness + sag. For plus (farsighted) lenses, center thickness = edge thickness + sag."
  },
  {
    question: "Is 1.67 or 1.74 lens better?",
    answer: "1.74 lenses are thinner than 1.67, but both are excellent choices for high prescriptions. 1.74 is best for prescriptions above ±6.00 where maximum thinness is desired. However, 1.67 offers better value and similar results for prescriptions between ±4.00 and ±6.00. 1.74 lenses are also more fragile and reflect slightly more light."
  },
  {
    question: "How thick is a 1.67 index lens?",
    answer: "The thickness depends on your prescription and frame size. For example, a -4.00 prescription in a 50mm wide frame would be approximately 4.1mm at the edge with 1.67 index, compared to 5.5mm with standard 1.50 index. That's about 25% thinner. The higher your prescription, the more dramatic the difference."
  },
  {
    question: "What is the thinnest lens for high prescription?",
    answer: "The 1.74 index lens is the thinnest option available for high prescriptions. It can reduce edge thickness by up to 50% compared to standard 1.50 lenses. For extremely high prescriptions (±10.00+), combining 1.74 index with aspheric design and a small frame provides the thinnest possible result."
  },
  {
    question: "Does frame size affect lens thickness?",
    answer: "Yes, significantly! A larger frame requires a larger lens diameter, which dramatically increases edge thickness for minus lenses. Choosing a smaller, rounder frame can reduce edge thickness by 30-40%. For high prescriptions, frame selection is as important as lens index choice."
  },
  {
    question: "Is high index lens worth it?",
    answer: "For prescriptions above ±3.00, high-index lenses are usually worth the extra cost. Benefits include: thinner and lighter lenses, better appearance (no 'coke bottle' look), more frame options, and improved comfort. The stronger your prescription, the more value you get from high-index lenses."
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

// Calculate lens thickness
function calculateThickness(power: number, diameter: number, index: number, minThickness: number = 1.5): { center: number; edge: number; sag: number } {
  const r = diameter / 2;
  const absPower = Math.abs(power);
  
  // Sag formula: Sag ≈ (r² × |Power|) / (2000 × (n - 1))
  const sag = (r * r * absPower) / (2000 * (index - 1));
  
  if (power < 0) {
    // Minus lens (nearsighted): thin center, thick edge
    return {
      center: minThickness,
      edge: minThickness + sag,
      sag: sag
    };
  } else if (power > 0) {
    // Plus lens (farsighted): thick center, thin edge
    return {
      center: minThickness + sag,
      edge: minThickness,
      sag: sag
    };
  } else {
    return { center: minThickness, edge: minThickness, sag: 0 };
  }
}

export default function LensThicknessCalculator() {
  // Inputs
  const [spherePower, setSpherePower] = useState<string>("-4.00");
  const [cylinderPower, setCylinderPower] = useState<string>("0");
  const [frameWidth, setFrameWidth] = useState<number>(52);
  const [pd, setPd] = useState<string>("63");
  const [selectedIndex, setSelectedIndex] = useState<string>("1.60");

  // Results
  const [results, setResults] = useState({
    center: 0,
    edge: 0,
    sag: 0,
    effectiveDiameter: 0,
    isMyopia: true,
  });

  // All indices comparison
  const [comparison, setComparison] = useState<Array<{ index: string; center: number; edge: number; reduction: number }>>([]);

  // Calculate
  useEffect(() => {
    const sph = parseFloat(spherePower) || 0;
    const cyl = parseFloat(cylinderPower) || 0;
    const pupilDistance = parseFloat(pd) || 63;
    
    // Calculate effective diameter considering decentration
    // Decentration = (Frame Width - PD) / 2 for each eye
    const decentration = Math.max(0, (frameWidth - pupilDistance / 2));
    const effectiveDiameter = frameWidth + decentration * 0.5;
    
    // Use the strongest meridian power for calculation
    const strongestPower = sph < 0 ? sph + cyl : sph;
    
    const indexValue = parseFloat(selectedIndex);
    const thickness = calculateThickness(strongestPower, effectiveDiameter, indexValue);
    
    setResults({
      center: thickness.center,
      edge: thickness.edge,
      sag: thickness.sag,
      effectiveDiameter: effectiveDiameter,
      isMyopia: strongestPower < 0,
    });

    // Calculate comparison for all indices
    const baseThickness = calculateThickness(strongestPower, effectiveDiameter, 1.50);
    const baseMax = strongestPower < 0 ? baseThickness.edge : baseThickness.center;
    
    const comparisonData = lensIndices.map(lens => {
      const t = calculateThickness(strongestPower, effectiveDiameter, lens.value);
      const maxThickness = strongestPower < 0 ? t.edge : t.center;
      const reduction = baseMax > 0 ? ((baseMax - maxThickness) / baseMax) * 100 : 0;
      return {
        index: lens.id,
        center: t.center,
        edge: t.edge,
        reduction: reduction,
      };
    });
    
    setComparison(comparisonData);
  }, [spherePower, cylinderPower, frameWidth, pd, selectedIndex]);

  // Get recommended index
  const getRecommendation = (): string => {
    const power = Math.abs(parseFloat(spherePower) || 0);
    if (power <= 2) return "1.50";
    if (power <= 4) return "1.60";
    if (power <= 6) return "1.67";
    return "1.74";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Lens Thickness Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>👓</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Lens Thickness Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate how thick your eyeglass lenses will be based on your prescription and lens index. Compare different lens materials to find the best option.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #A7F3D0"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Tip</p>
              <p style={{ color: "#065F46", margin: 0, fontSize: "0.95rem" }}>
                Higher index = thinner lens. For prescriptions under ±2.00, standard 1.50 index is fine. For ±2.00 to ±4.00, consider 1.60. For ±4.00+, choose <strong>1.67 or 1.74</strong> for noticeably thinner lenses.
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
                {/* Prescription */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📋 Your Prescription
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Sphere (SPH) Power
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={spherePower}
                      onChange={(e) => setSpherePower(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                      placeholder="-4.00"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      Negative (-) for nearsighted, Positive (+) for farsighted
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {[-2, -4, -6, -8, 2, 4].map((power) => (
                      <button
                        key={power}
                        onClick={() => setSpherePower(power.toFixed(2))}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: spherePower === power.toFixed(2) ? "2px solid #0D9488" : "1px solid #E5E7EB",
                          backgroundColor: spherePower === power.toFixed(2) ? "#CCFBF1" : "white",
                          color: spherePower === power.toFixed(2) ? "#0D9488" : "#374151",
                          fontWeight: "500",
                          cursor: "pointer",
                          fontSize: "0.85rem"
                        }}
                      >
                        {power > 0 ? "+" : ""}{power.toFixed(2)}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Cylinder (CYL) Power <span style={{ color: "#9CA3AF" }}>(Optional)</span>
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={cylinderPower}
                      onChange={(e) => setCylinderPower(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                      placeholder="0"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      Astigmatism correction (usually negative)
                    </p>
                  </div>
                </div>

                {/* Frame Size */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🖼️ Frame Size
                  </h3>

                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <label style={{ fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
                        Lens Width (Eye Size)
                      </label>
                      <span style={{ fontSize: "1rem", fontWeight: "700", color: "#0D9488" }}>{frameWidth} mm</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="60"
                      value={frameWidth}
                      onChange={(e) => setFrameWidth(parseInt(e.target.value))}
                      style={{ width: "100%", accentColor: "#0D9488" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>40mm (Small)</span>
                      <span>60mm (Large)</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "6px" }}>
                      Your PD (Pupillary Distance)
                    </label>
                    <input
                      type="number"
                      value={pd}
                      onChange={(e) => setPd(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "1px solid #D1D5DB",
                        borderRadius: "8px",
                        fontSize: "1rem"
                      }}
                      placeholder="63"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      Average: 63mm for adults (range: 54-74mm)
                    </p>
                  </div>
                </div>

                {/* Lens Index */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🔍 Lens Index
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {lensIndices.map((lens) => (
                      <button
                        key={lens.id}
                        onClick={() => setSelectedIndex(lens.id)}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          border: selectedIndex === lens.id ? "2px solid #0D9488" : "1px solid #E5E7EB",
                          backgroundColor: selectedIndex === lens.id ? "#CCFBF1" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "600", color: selectedIndex === lens.id ? "#0D9488" : "#374151", margin: 0, fontSize: "0.9rem" }}>
                            {lens.name}
                            {lens.id === getRecommendation() && (
                              <span style={{ marginLeft: "8px", backgroundColor: "#FCD34D", color: "#92400E", padding: "2px 6px", borderRadius: "4px", fontSize: "0.7rem" }}>
                                RECOMMENDED
                              </span>
                            )}
                          </p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>
                            {lens.material} • {lens.weight}
                          </p>
                        </div>
                        <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>{lens.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{
                  backgroundColor: "#0D9488",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px" }}>
                    {results.isMyopia ? "Edge Thickness (thickest point)" : "Center Thickness (thickest point)"}
                  </p>
                  <p style={{ fontSize: "3rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {(results.isMyopia ? results.edge : results.center).toFixed(1)} mm
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", margin: 0 }}>
                    with {selectedIndex} index lens
                  </p>
                </div>

                {/* Thickness Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#F0FDFA", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Center Thickness</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0F766E", margin: 0 }}>
                      {results.center.toFixed(1)} mm
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#F0FDFA", padding: "16px", borderRadius: "8px", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "0 0 4px 0" }}>Edge Thickness</p>
                    <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0F766E", margin: 0 }}>
                      {results.edge.toFixed(1)} mm
                    </p>
                  </div>
                </div>

                {/* Visual Comparison */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "16px", fontSize: "0.95rem" }}>
                    📊 All Index Comparison
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {comparison.map((item, index) => {
                      const maxThickness = results.isMyopia ? item.edge : item.center;
                      const maxWidth = comparison[0] ? (results.isMyopia ? comparison[0].edge : comparison[0].center) : 10;
                      const barWidth = (maxThickness / maxWidth) * 100;
                      const isSelected = item.index === selectedIndex;
                      
                      return (
                        <div key={item.index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ width: "45px", fontSize: "0.8rem", color: isSelected ? "#0D9488" : "#6B7280", fontWeight: isSelected ? "700" : "500" }}>
                            {item.index}
                          </span>
                          <div style={{ flex: 1, height: "20px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                            <div style={{
                              width: `${barWidth}%`,
                              height: "100%",
                              backgroundColor: isSelected ? "#0D9488" : "#94A3B8",
                              borderRadius: "4px",
                              transition: "width 0.3s"
                            }} />
                          </div>
                          <span style={{ width: "55px", fontSize: "0.8rem", color: isSelected ? "#0D9488" : "#374151", fontWeight: isSelected ? "700" : "500", textAlign: "right" }}>
                            {maxThickness.toFixed(1)}mm
                          </span>
                          {item.reduction > 0 && (
                            <span style={{ width: "45px", fontSize: "0.7rem", color: "#059669", textAlign: "right" }}>
                              -{item.reduction.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px", fontSize: "0.9rem" }}>
                    💡 Recommendation
                  </h4>
                  <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                    For your prescription of <strong>{spherePower}</strong>, we recommend <strong>{getRecommendation()} index</strong> lenses.
                    {parseFloat(spherePower) < -4 && " Consider choosing a smaller frame to further reduce edge thickness."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Index Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📋 Recommended Lens Index by Prescription
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Prescription Range</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#CCFBF1" }}>Recommended Index</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {indexRecommendations.map((row, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>{row.range}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0D9488", fontWeight: "600" }}>{row.recommended}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lens Materials Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🔍 Lens Material Comparison
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Index</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Material</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Thickness</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Weight</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Price</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700" }}>1.50</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>CR-39 Plastic</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Thickest</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Heavy</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Low prescriptions (±0-2.00)</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700" }}>1.53</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Trivex</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Thick</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Light</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Kids, sports, safety</td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700" }}>1.59</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>Polycarbonate</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Medium</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Light</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Impact resistance, kids</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700" }}>1.60</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>MR-8</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Thin</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Medium</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$$$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Moderate prescriptions (±2-4.00)</td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700", color: "#0D9488" }}>1.67</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>MR-7</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0D9488" }}>Very Thin</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Light</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$$$$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>High prescriptions (±4-6.00)</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "700", color: "#0D9488" }}>1.74</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB" }}>MR-174</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0D9488" }}>Thinnest</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Lightest</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>$$$$$</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>Very high prescriptions (±6.00+)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How It Works */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🔬 How Lens Thickness Is Calculated
              </h2>
              <div style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Prescription Strength</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Higher prescription = thicker lens. A -6.00 lens is much thicker than a -2.00 lens.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Lens Diameter (Frame Size)</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Larger frames require larger lenses, which exponentially increases thickness. Smaller frames = thinner lenses.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Refractive Index</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      Higher index materials bend light more efficiently, requiring less material to achieve the same power.
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#0D9488", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>4</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>PD & Decentration</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>
                      If your PD is narrower than the frame, the optical center shifts inward, effectively increasing lens diameter needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✅ Tips for Thinner Lenses
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🖼️</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#065F46" }}>Choose Smaller Frames</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Frame size has the biggest impact on edge thickness</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F0FDFA", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>⭕</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#0F766E" }}>Pick Round or Oval Shapes</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Less edge exposure than rectangular frames</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>🔲</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#065F46" }}>Select Full-Rim Frames</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Hides edge thickness better than rimless</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#F0FDFA", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>📐</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#0F766E" }}>Center the Lenses Well</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Proper PD alignment reduces decentration</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#ECFDF5", borderRadius: "8px" }}>
                  <span style={{ fontSize: "1.25rem" }}>✨</span>
                  <div>
                    <span style={{ fontWeight: "600", color: "#065F46" }}>Consider Aspheric Design</span>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — Flatter curves reduce thickness further</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Key Points */}
            <div style={{
              backgroundColor: "#F0FDFA",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #99F6E4"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0F766E", marginBottom: "12px" }}>
                💡 Key Facts
              </h3>
              <ul style={{ fontSize: "0.85rem", color: "#0F766E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>1.74 index is ~50% thinner than 1.50</li>
                <li style={{ marginBottom: "8px" }}>Minus lenses are thickest at edges</li>
                <li style={{ marginBottom: "8px" }}>Plus lenses are thickest at center</li>
                <li style={{ marginBottom: "8px" }}>Frame size matters as much as index</li>
                <li>High-index lenses need AR coating</li>
              </ul>
            </div>

            {/* Warning */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FCD34D"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Note
              </h3>
              <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>
                This calculator provides estimates. Actual thickness may vary based on lens design (aspheric, progressive), base curve, and manufacturing. Consult your optician for precise measurements.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/lens-thickness-calculator"
              currentCategory="Lifestyle"
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
            👓 <strong>Disclaimer:</strong> This calculator provides estimates based on standard optical formulas. Actual lens thickness may vary depending on lens design, base curve, and manufacturing specifications. Always consult a licensed optician for accurate measurements and recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}