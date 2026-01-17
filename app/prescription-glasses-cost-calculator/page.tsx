"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Exam options
const examOptions = [
  { id: 'none', name: 'No exam needed', description: 'I have a valid prescription', low: 0, high: 0 },
  { id: 'basic', name: 'Basic Refraction', description: 'Prescription check only', low: 50, high: 100 },
  { id: 'comprehensive', name: 'Comprehensive Exam', description: 'Full eye health check', low: 100, high: 250 },
];

// Frame options
const frameOptions = [
  { id: 'budget', name: 'Budget', description: 'Basic frames, lesser-known brands', low: 30, high: 80 },
  { id: 'standard', name: 'Standard', description: 'Quality frames, mid-tier brands', low: 80, high: 150 },
  { id: 'designer', name: 'Designer', description: 'Brand name frames (Ray-Ban, Oakley)', low: 150, high: 300 },
  { id: 'premium', name: 'Premium/Luxury', description: 'High-end designer frames', low: 300, high: 600 },
];

// Lens type options
const lensTypeOptions = [
  { id: 'single', name: 'Single Vision', description: 'One prescription strength', low: 50, high: 150 },
  { id: 'bifocal', name: 'Bifocal', description: 'Distance + reading (visible line)', low: 100, high: 250 },
  { id: 'progressive', name: 'Progressive', description: 'Multifocal, no visible line', low: 175, high: 500 },
];

// Lens material options
const lensMaterialOptions = [
  { id: 'plastic', name: 'Standard Plastic (CR-39)', description: 'Basic, affordable', low: 0, high: 0 },
  { id: 'polycarbonate', name: 'Polycarbonate', description: 'Impact-resistant, thinner', low: 30, high: 100 },
  { id: 'highindex167', name: 'High-Index 1.67', description: 'Thin & light, for higher Rx', low: 50, high: 150 },
  { id: 'highindex174', name: 'High-Index 1.74', description: 'Thinnest option available', low: 100, high: 200 },
];

// Coating options
const coatingOptions = [
  { id: 'antireflective', name: 'Anti-Reflective (AR)', description: 'Reduces glare, clearer vision', low: 30, high: 100 },
  { id: 'bluelight', name: 'Blue Light Blocking', description: 'For screen use', low: 20, high: 75 },
  { id: 'photochromic', name: 'Photochromic (Transitions)', description: 'Darkens in sunlight', low: 80, high: 175 },
  { id: 'scratch', name: 'Scratch-Resistant', description: 'Protects lens surface', low: 15, high: 40 },
  { id: 'uv', name: 'UV Protection', description: 'Blocks harmful UV rays', low: 10, high: 30 },
];

// Insurance options
const insuranceOptions = [
  { id: 'none', name: 'No Insurance', frameAllowance: 0, lensDiscount: 0 },
  { id: 'basic', name: 'Basic Vision Plan', frameAllowance: 130, lensDiscount: 0.15 },
  { id: 'good', name: 'Good Vision Plan (VSP, EyeMed)', frameAllowance: 180, lensDiscount: 0.25 },
  { id: 'premium', name: 'Premium Vision Plan', frameAllowance: 250, lensDiscount: 0.40 },
];

// FAQ data
const faqs = [
  {
    question: "Is $300 a lot for glasses?",
    answer: "$300 is actually around average for a complete pair of glasses in the US. You're getting a decent frame and quality lenses at this price point. Budget options can be found for under $100, while premium designer frames with advanced lenses can cost $500-$1000+. The key is matching your spending to your vision needs and lifestyle."
  },
  {
    question: "Is $200 too much for glasses?",
    answer: "$200 is a reasonable price for glasses, especially if it includes quality lenses. You can find complete pairs online for under $100, but brick-and-mortar stores with personalized fitting typically charge $200-$400. If you have vision insurance, $200 out-of-pocket often means you're getting $300-$400 worth of eyewear."
  },
  {
    question: "How much does it cost to put my prescription in glasses?",
    answer: "The cost to put prescription lenses in frames varies by lens type. Single vision lenses typically cost $50-$150. Bifocals run $100-$250, and progressive lenses range from $175-$500+. Add-ons like anti-reflective coating (+$30-$100) and high-index material (+$50-$200) increase the price. Many shops charge $30-$50 to put new lenses in your existing frames."
  },
  {
    question: "Why are glasses so expensive at the eye doctor?",
    answer: "Eye doctor offices typically charge more due to overhead costs, personalized fitting services, and often carrying premium brands. They also provide professional adjustments and warranties. You can save 30-50% by buying online, but you lose the in-person fitting experience. Many people prefer to get their exam at the doctor but purchase glasses elsewhere."
  },
  {
    question: "How can I save money on prescription glasses?",
    answer: "Several strategies can help: 1) Buy online from retailers like Zenni, EyeBuyDirect, or Warby Parker. 2) Use your vision insurance benefits before they expire. 3) Ask for your pupillary distance (PD) measurement. 4) Consider lens replacement in existing frames. 5) Skip unnecessary coatings. 6) Look for sales and bundle deals. 7) Use FSA/HSA funds."
  },
  {
    question: "What does +2.75 mean for glasses?",
    answer: "+2.75 refers to the lens power in diopters. A positive number indicates farsightedness (hyperopia) - difficulty seeing close objects. The higher the number, the stronger the prescription. +2.75 is a moderate prescription. Negative numbers (like -2.75) indicate nearsightedness (myopia). Your prescription also includes other measurements like cylinder (astigmatism) and axis."
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

export default function PrescriptionGlassesCostCalculator() {
  // State for selections
  const [examType, setExamType] = useState('none');
  const [frameType, setFrameType] = useState('standard');
  const [lensType, setLensType] = useState('single');
  const [lensMaterial, setLensMaterial] = useState('plastic');
  const [selectedCoatings, setSelectedCoatings] = useState<string[]>(['antireflective']);
  const [insuranceType, setInsuranceType] = useState('none');

  // Toggle coating selection
  const toggleCoating = (coatingId: string) => {
    setSelectedCoatings(prev => 
      prev.includes(coatingId) 
        ? prev.filter(id => id !== coatingId)
        : [...prev, coatingId]
    );
  };

  // Calculate results
  const results = useMemo(() => {
    const exam = examOptions.find(e => e.id === examType)!;
    const frame = frameOptions.find(f => f.id === frameType)!;
    const lens = lensTypeOptions.find(l => l.id === lensType)!;
    const material = lensMaterialOptions.find(m => m.id === lensMaterial)!;
    const insurance = insuranceOptions.find(i => i.id === insuranceType)!;

    // Calculate coatings total
    const coatingsLow = selectedCoatings.reduce((sum, id) => {
      const coating = coatingOptions.find(c => c.id === id);
      return sum + (coating?.low || 0);
    }, 0);
    const coatingsHigh = selectedCoatings.reduce((sum, id) => {
      const coating = coatingOptions.find(c => c.id === id);
      return sum + (coating?.high || 0);
    }, 0);

    // Total lens cost (type + material + coatings)
    const lensLow = lens.low + material.low + coatingsLow;
    const lensHigh = lens.high + material.high + coatingsHigh;

    // Subtotal without insurance
    const subtotalLow = exam.low + frame.low + lensLow;
    const subtotalHigh = exam.high + frame.high + lensHigh;

    // Apply insurance
    let insuranceSavingsLow = 0;
    let insuranceSavingsHigh = 0;

    if (insurance.frameAllowance > 0) {
      // Frame savings (up to allowance)
      const frameSavingsLow = Math.min(frame.low, insurance.frameAllowance);
      const frameSavingsHigh = Math.min(frame.high, insurance.frameAllowance);
      
      // Lens discount
      const lensSavingsLow = lensLow * insurance.lensDiscount;
      const lensSavingsHigh = lensHigh * insurance.lensDiscount;

      insuranceSavingsLow = frameSavingsLow + lensSavingsLow;
      insuranceSavingsHigh = frameSavingsHigh + lensSavingsHigh;
    }

    const totalLow = Math.max(0, subtotalLow - insuranceSavingsLow);
    const totalHigh = Math.max(0, subtotalHigh - insuranceSavingsHigh);

    return {
      exam: { low: exam.low, high: exam.high, name: exam.name },
      frame: { low: frame.low, high: frame.high, name: frame.name },
      lensType: { low: lens.low, high: lens.high, name: lens.name },
      lensMaterial: { low: material.low, high: material.high, name: material.name },
      coatings: { low: coatingsLow, high: coatingsHigh, count: selectedCoatings.length },
      lensTotal: { low: lensLow, high: lensHigh },
      subtotal: { low: subtotalLow, high: subtotalHigh },
      insuranceSavings: { low: insuranceSavingsLow, high: insuranceSavingsHigh },
      total: { low: totalLow, high: totalHigh },
      hasInsurance: insuranceType !== 'none'
    };
  }, [examType, frameType, lensType, lensMaterial, selectedCoatings, insuranceType]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDFA" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #99F6E4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Prescription Glasses Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>👓</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Prescription Glasses Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the cost of your new prescription glasses. Select your options below to see 
            a personalized price range based on frames, lenses, coatings, and insurance coverage.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#CCFBF1",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #5EEAD4"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#0F766E", margin: "0 0 4px 0" }}>
                <strong>Average Cost:</strong> $200 - $600 for a complete pair
              </p>
              <p style={{ color: "#0D9488", margin: 0, fontSize: "0.95rem" }}>
                Budget options start at ~$70 online. Designer frames with progressive lenses can exceed $1,000.
              </p>
            </div>
          </div>
        </div>

        {/* Main Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #99F6E4",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#0D9488", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🛒 Build Your Glasses
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Eye Exam */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  1. Eye Exam
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {examOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setExamType(option.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: examType === option.id ? "2px solid #0D9488" : "1px solid #E5E7EB",
                        backgroundColor: examType === option.id ? "#F0FDFA" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", color: examType === option.id ? "#0D9488" : "#374151" }}>
                            {option.name}
                          </p>
                          <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                            {option.description}
                          </p>
                        </div>
                        <span style={{ fontWeight: "600", color: "#0D9488", fontSize: "0.9rem" }}>
                          {option.low === 0 ? '$0' : `$${option.low}-$${option.high}`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Type */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  2. Frame Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {frameOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setFrameType(option.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: frameType === option.id ? "2px solid #0D9488" : "1px solid #E5E7EB",
                        backgroundColor: frameType === option.id ? "#F0FDFA" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "600", color: frameType === option.id ? "#0D9488" : "#374151", fontSize: "0.9rem" }}>
                        {option.name}
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                        ${option.low}-${option.high}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lens Type */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  3. Lens Type
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {lensTypeOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setLensType(option.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: lensType === option.id ? "2px solid #0D9488" : "1px solid #E5E7EB",
                        backgroundColor: lensType === option.id ? "#F0FDFA" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600", color: lensType === option.id ? "#0D9488" : "#374151" }}>
                            {option.name}
                          </p>
                          <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                            {option.description}
                          </p>
                        </div>
                        <span style={{ fontWeight: "600", color: "#0D9488", fontSize: "0.9rem" }}>
                          ${option.low}-${option.high}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lens Material */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  4. Lens Material
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {lensMaterialOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setLensMaterial(option.id)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: lensMaterial === option.id ? "2px solid #0D9488" : "1px solid #E5E7EB",
                        backgroundColor: lensMaterial === option.id ? "#F0FDFA" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "600", color: lensMaterial === option.id ? "#0D9488" : "#374151", fontSize: "0.85rem" }}>
                        {option.name}
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                        {option.low === 0 ? 'Included' : `+$${option.low}-$${option.high}`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coatings */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  5. Lens Coatings (select all that apply)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {coatingOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => toggleCoating(option.id)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: selectedCoatings.includes(option.id) ? "2px solid #0D9488" : "1px solid #E5E7EB",
                        backgroundColor: selectedCoatings.includes(option.id) ? "#F0FDFA" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ 
                            width: "20px", 
                            height: "20px", 
                            borderRadius: "4px", 
                            border: selectedCoatings.includes(option.id) ? "none" : "2px solid #D1D5DB",
                            backgroundColor: selectedCoatings.includes(option.id) ? "#0D9488" : "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            flexShrink: 0
                          }}>
                            {selectedCoatings.includes(option.id) && "✓"}
                          </span>
                          <div>
                            <p style={{ margin: 0, fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
                              {option.name}
                            </p>
                            <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                        <span style={{ fontWeight: "500", color: "#0D9488", fontSize: "0.85rem", flexShrink: 0 }}>
                          +${option.low}-${option.high}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  6. Vision Insurance
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #E5E7EB",
                    fontSize: "1rem",
                    backgroundColor: "white"
                  }}
                >
                  {insuranceOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name} {option.frameAllowance > 0 ? `(~$${option.frameAllowance} frame allowance)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #99F6E4",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#0F766E", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                💰 Estimated Cost
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Main Total */}
              <div style={{
                backgroundColor: "#F0FDFA",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
                marginBottom: "20px",
                border: "2px solid #0D9488"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#0F766E" }}>
                  {results.hasInsurance ? 'Your Estimated Out-of-Pocket' : 'Estimated Total Cost'}
                </p>
                <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#0D9488" }}>
                  ${results.total.low} - ${results.total.high}
                </p>
                {results.hasInsurance && results.insuranceSavings.high > 0 && (
                  <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#059669" }}>
                    💚 Saving ${results.insuranceSavings.low.toFixed(0)} - ${results.insuranceSavings.high.toFixed(0)} with insurance!
                  </p>
                )}
              </div>

              {/* Cost Breakdown */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                  Cost Breakdown:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {results.exam.high > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>👁️ {results.exam.name}</span>
                      <span style={{ fontWeight: "500", color: "#111827" }}>${results.exam.low} - ${results.exam.high}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>🕶️ Frames ({results.frame.name})</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>${results.frame.low} - ${results.frame.high}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>🔍 Lenses ({results.lensType.name})</span>
                    <span style={{ fontWeight: "500", color: "#111827" }}>${results.lensType.low} - ${results.lensType.high}</span>
                  </div>
                  {results.lensMaterial.high > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>📐 Material ({results.lensMaterial.name})</span>
                      <span style={{ fontWeight: "500", color: "#111827" }}>+${results.lensMaterial.low} - ${results.lensMaterial.high}</span>
                    </div>
                  )}
                  {results.coatings.high > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563" }}>✨ Coatings ({results.coatings.count} selected)</span>
                      <span style={{ fontWeight: "500", color: "#111827" }}>+${results.coatings.low} - ${results.coatings.high}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#E0F2FE", borderRadius: "6px", marginTop: "4px" }}>
                    <span style={{ color: "#0369A1", fontWeight: "600" }}>Subtotal (before insurance)</span>
                    <span style={{ fontWeight: "600", color: "#0369A1" }}>${results.subtotal.low} - ${results.subtotal.high}</span>
                  </div>
                  {results.hasInsurance && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#DCFCE7", borderRadius: "6px" }}>
                      <span style={{ color: "#166534" }}>🏥 Insurance Savings</span>
                      <span style={{ fontWeight: "600", color: "#166534" }}>-${results.insuranceSavings.low.toFixed(0)} to -${results.insuranceSavings.high.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Money Saving Tips */}
              <div style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "8px",
                padding: "16px",
                border: "1px solid #FCD34D"
              }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", color: "#92400E", fontWeight: "600" }}>
                  💡 Money-Saving Tips
                </p>
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                  <li>Online retailers (Zenni, EyeBuyDirect) offer 30-50% lower prices</li>
                  <li>Ask for your pupillary distance (PD) at your eye exam</li>
                  <li>Use FSA/HSA funds before they expire</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #99F6E4", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                👓 How Much Do Prescription Glasses Cost?
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  The cost of prescription glasses varies widely depending on where you shop, what features you choose, 
                  and whether you have vision insurance. Understanding what drives the price helps you make smart choices 
                  without overpaying or sacrificing quality.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Average Costs Without Insurance</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", marginTop: "12px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#F0FDFA" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #99F6E4" }}>Component</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #99F6E4" }}>Budget</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #99F6E4" }}>Average</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #99F6E4" }}>Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Frames</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$30-$80</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$80-$200</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$200-$600+</td>
                      </tr>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Single Vision Lenses</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$50-$80</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$80-$150</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$150-$300</td>
                      </tr>
                      <tr>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Progressive Lenses</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$175-$250</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$250-$400</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$400-$800+</td>
                      </tr>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB" }}>Eye Exam</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$50-$80</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$100-$150</td>
                        <td style={{ padding: "12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>$150-$250</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Affects the Price?</h3>
                <div style={{
                  backgroundColor: "#F0FDFA",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #99F6E4"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Lens Type:</strong> Progressive lenses cost 2-3x more than single vision</li>
                    <li><strong>Lens Material:</strong> High-index (thinner) lenses add $50-$200</li>
                    <li><strong>Coatings:</strong> Anti-reflective, blue light, transitions add $30-$175 each</li>
                    <li><strong>Frame Brand:</strong> Designer frames cost 3-5x more than generic</li>
                    <li><strong>Where You Buy:</strong> Online retailers are 30-50% cheaper than optical shops</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Glasses With vs Without Insurance</h3>
                <p>
                  Vision insurance typically provides a frame allowance ($100-$200) and discounts on lenses (15-40%). 
                  Most plans cover one pair per year. Even with a basic plan, you can save $100-$200 on a complete pair. 
                  FSA and HSA accounts can also be used for glasses, providing additional tax savings.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Where to Buy Prescription Glasses</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "16px" }}>
                  <div style={{ padding: "16px", backgroundColor: "#DCFCE7", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#166534" }}>💻 Online Retailers</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#15803D" }}>
                      Zenni, EyeBuyDirect, Warby Parker - Lowest prices ($70-$200)
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#92400E" }}>🏬 Big Box Stores</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#B45309" }}>
                      Costco, Walmart, Target - Mid-range ($150-$300)
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#E0E7FF", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#3730A3" }}>👨‍⚕️ Eye Doctor&apos;s Office</p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                      Best service & fitting - Higher prices ($300-$600+)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Stats */}
            <div style={{ backgroundColor: "#F0FDFA", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #99F6E4" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0D9488", marginBottom: "16px" }}>📊 Quick Stats</h3>
              <div style={{ fontSize: "0.9rem", color: "#0F766E", lineHeight: "2.2" }}>
                <p style={{ margin: 0 }}>• Average pair: <strong>$200-$300</strong></p>
                <p style={{ margin: 0 }}>• With progressives: <strong>$350-$600</strong></p>
                <p style={{ margin: 0 }}>• Budget online: <strong>$70-$120</strong></p>
                <p style={{ margin: 0 }}>• Insurance saves: <strong>$100-$200</strong></p>
              </div>
            </div>

            {/* Did You Know */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: 0 }}>
                  About 75% of adults use some form of vision correction. The global eyewear market is dominated 
                  by one company (Luxottica), which owns Ray-Ban, Oakley, LensCrafters, and more—contributing to 
                  higher retail prices.
                </p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/prescription-glasses-cost-calculator" currentCategory="Health" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #99F6E4", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F0FDFA", borderRadius: "8px", border: "1px solid #99F6E4" }}>
          <p style={{ fontSize: "0.75rem", color: "#0D9488", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on average US prices. 
            Actual costs vary by retailer, location, and specific products. Always get quotes from multiple 
            sources before purchasing. This tool is for informational purposes only and is not a substitute 
            for professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}