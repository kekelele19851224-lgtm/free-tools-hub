"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Men's size data (height in inches, weight in lbs)
const mensSizeData = [
  { size: "XS", minHeight: 62, maxHeight: 66, minWeight: 100, maxWeight: 130, chest: "32-34", waist: "26-28", length: "27" },
  { size: "S", minHeight: 64, maxHeight: 68, minWeight: 125, maxWeight: 150, chest: "34-36", waist: "28-30", length: "28" },
  { size: "M", minHeight: 66, maxHeight: 70, minWeight: 145, maxWeight: 175, chest: "38-40", waist: "31-33", length: "29" },
  { size: "L", minHeight: 68, maxHeight: 72, minWeight: 170, maxWeight: 200, chest: "42-44", waist: "34-36", length: "30" },
  { size: "XL", minHeight: 70, maxHeight: 74, minWeight: 195, maxWeight: 230, chest: "46-48", waist: "37-40", length: "31" },
  { size: "2XL", minHeight: 71, maxHeight: 76, minWeight: 225, maxWeight: 260, chest: "50-52", waist: "41-44", length: "32" },
  { size: "3XL", minHeight: 72, maxHeight: 78, minWeight: 255, maxWeight: 290, chest: "54-56", waist: "45-48", length: "33" },
  { size: "4XL", minHeight: 73, maxHeight: 80, minWeight: 285, maxWeight: 320, chest: "58-60", waist: "49-52", length: "34" },
];

// Women's size data
const womensSizeData = [
  { size: "XS", minHeight: 60, maxHeight: 64, minWeight: 90, maxWeight: 110, chest: "30-32", waist: "24-26", length: "24" },
  { size: "S", minHeight: 62, maxHeight: 66, minWeight: 105, maxWeight: 125, chest: "32-34", waist: "26-28", length: "25" },
  { size: "M", minHeight: 64, maxHeight: 68, minWeight: 120, maxWeight: 145, chest: "34-36", waist: "28-30", length: "26" },
  { size: "L", minHeight: 66, maxHeight: 70, minWeight: 140, maxWeight: 165, chest: "38-40", waist: "31-33", length: "27" },
  { size: "XL", minHeight: 67, maxHeight: 72, minWeight: 160, maxWeight: 190, chest: "42-44", waist: "34-37", length: "28" },
  { size: "2XL", minHeight: 68, maxHeight: 74, minWeight: 185, maxWeight: 220, chest: "46-48", waist: "38-41", length: "29" },
  { size: "3XL", minHeight: 69, maxHeight: 76, minWeight: 215, maxWeight: 250, chest: "50-52", waist: "42-45", length: "30" },
];

// Youth size data
const youthSizeData = [
  { size: "YXS (4-5)", minHeight: 39, maxHeight: 45, minWeight: 35, maxWeight: 45, chest: "23-24", waist: "21-22", length: "16" },
  { size: "YS (6-7)", minHeight: 44, maxHeight: 50, minWeight: 43, maxWeight: 55, chest: "25-26", waist: "22-23", length: "18" },
  { size: "YM (8-10)", minHeight: 49, maxHeight: 55, minWeight: 53, maxWeight: 75, chest: "27-29", waist: "23-25", length: "20" },
  { size: "YL (12-14)", minHeight: 54, maxHeight: 62, minWeight: 73, maxWeight: 100, chest: "30-32", waist: "25-27", length: "23" },
  { size: "YXL (16-18)", minHeight: 60, maxHeight: 68, minWeight: 95, maxWeight: 130, chest: "33-35", waist: "27-29", length: "26" },
];

// International size conversion
const internationalSizes = [
  { us: "XS", uk: "XS", eu: "44", jp: "S" },
  { us: "S", uk: "S", eu: "46", jp: "M" },
  { us: "M", uk: "M", eu: "48-50", jp: "L" },
  { us: "L", uk: "L", eu: "52-54", jp: "XL" },
  { us: "XL", uk: "XL", eu: "56-58", jp: "2XL" },
  { us: "2XL", uk: "2XL", eu: "60-62", jp: "3XL" },
  { us: "3XL", uk: "3XL", eu: "64-66", jp: "4XL" },
];

// FAQ data
const faqs = [
  {
    question: "How do I know my T-shirt size without measuring?",
    answer: "The easiest way is to use your height and weight as a starting point. Our calculator estimates your size based on these measurements. For more accuracy, consider your body build (slim, average, athletic) and how you prefer your shirts to fit (tight, regular, loose). You can also measure a T-shirt that fits you well and compare it to size charts."
  },
  {
    question: "What size T-shirt should I get for my height and weight?",
    answer: "For men: if you're 5'8\" (173cm) and 170 lbs (77kg) with an average build, you'd typically wear a Medium or Large. For women: at 5'5\" (165cm) and 140 lbs (64kg), you'd usually wear a Medium. Use our calculator above for a personalized recommendation based on your exact measurements."
  },
  {
    question: "What is the difference between men's and women's T-shirt sizes?",
    answer: "Women's T-shirts are cut differently: they're typically shorter in length, narrower in the shoulders, and have a more tapered waist. A women's Medium is generally equivalent to a men's Small. Women's sizes also account for bust measurements, while men's focus more on chest width."
  },
  {
    question: "How do US, UK, and EU T-shirt sizes compare?",
    answer: "US and UK T-shirt sizes are generally the same (S, M, L, XL). EU sizes use numbers: US Small = EU 46, US Medium = EU 48-50, US Large = EU 52-54. Asian sizes (JP, CN) typically run 1-2 sizes smaller than US/UK sizes, so you may need to size up when ordering from Asian brands."
  },
  {
    question: "Should I size up or down for a relaxed fit?",
    answer: "For a relaxed or loose fit, size up by one size from your regular fit. For example, if you normally wear a Medium, choose a Large for a looser feel. For a tighter, more fitted look, you can stay true to size or even size down if the brand runs large. Always check the specific brand's size chart."
  },
  {
    question: "What T-shirt size is a youth large in adults?",
    answer: "A Youth Large (YL) is roughly equivalent to an Adult Extra Small (XS) or a very small Adult Small. Youth Large typically fits ages 12-14 with chest measurements of 30-32 inches. If a teen is between youth and adult sizes, an Adult Small usually works well."
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

export default function TShirtSizeCalculator() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'charts' | 'guide'>('calculator');

  // Calculator inputs
  const [gender, setGender] = useState<'men' | 'women' | 'youth'>('men');
  const [unitSystem, setUnitSystem] = useState<'imperial' | 'metric'>('imperial');
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("10");
  const [heightCm, setHeightCm] = useState<string>("178");
  const [weightLbs, setWeightLbs] = useState<string>("170");
  const [weightKg, setWeightKg] = useState<string>("77");
  const [bodyBuild, setBodyBuild] = useState<'slim' | 'average' | 'athletic'>('average');
  const [fitPreference, setFitPreference] = useState<'tight' | 'regular' | 'loose'>('regular');

  // Calculate size
  const sizeResult = useMemo(() => {
    // Convert to inches and lbs for calculation
    let heightInches: number;
    let weightPounds: number;

    if (unitSystem === 'imperial') {
      heightInches = (parseInt(heightFt) || 0) * 12 + (parseInt(heightIn) || 0);
      weightPounds = parseInt(weightLbs) || 0;
    } else {
      heightInches = Math.round((parseInt(heightCm) || 0) / 2.54);
      weightPounds = Math.round((parseInt(weightKg) || 0) * 2.205);
    }

    if (heightInches === 0 || weightPounds === 0) {
      return null;
    }

    // Select size data based on gender
    const sizeData = gender === 'men' ? mensSizeData : gender === 'women' ? womensSizeData : youthSizeData;

    // Find matching size
    let bestMatch = sizeData[Math.floor(sizeData.length / 2)]; // Default to middle size
    let bestScore = Infinity;

    for (const size of sizeData) {
      const heightMid = (size.minHeight + size.maxHeight) / 2;
      const weightMid = (size.minWeight + size.maxWeight) / 2;
      
      // Calculate how well this size fits
      const heightScore = Math.abs(heightInches - heightMid) / 10;
      const weightScore = Math.abs(weightPounds - weightMid) / 30;
      const totalScore = heightScore + weightScore;

      if (totalScore < bestScore) {
        bestScore = totalScore;
        bestMatch = size;
      }
    }

    // Apply modifiers
    let sizeIndex = sizeData.findIndex(s => s.size === bestMatch.size);

    // Body build modifier
    if (bodyBuild === 'athletic') {
      sizeIndex = Math.min(sizeIndex + 1, sizeData.length - 1);
    } else if (bodyBuild === 'slim') {
      sizeIndex = Math.max(sizeIndex - 1, 0);
    }

    // Fit preference modifier
    if (fitPreference === 'loose') {
      sizeIndex = Math.min(sizeIndex + 1, sizeData.length - 1);
    } else if (fitPreference === 'tight') {
      sizeIndex = Math.max(sizeIndex - 1, 0);
    }

    const recommendedSize = sizeData[sizeIndex];
    const smallerSize = sizeIndex > 0 ? sizeData[sizeIndex - 1] : null;
    const largerSize = sizeIndex < sizeData.length - 1 ? sizeData[sizeIndex + 1] : null;

    return {
      recommended: recommendedSize,
      smaller: smallerSize,
      larger: largerSize,
      heightInches,
      weightPounds
    };
  }, [gender, unitSystem, heightFt, heightIn, heightCm, weightLbs, weightKg, bodyBuild, fitPreference]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F3FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #DDD6FE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>T-Shirt Size Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>👕</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              T-Shirt Size Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Find your perfect T-shirt size based on height and weight. Get personalized recommendations 
            for men, women, and kids with international size conversion (US/UK/EU).
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#EDE9FE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #C4B5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#5B21B6", margin: "0 0 4px 0" }}>
                <strong>Quick Guide:</strong> Most adults wear size M or L
              </p>
              <p style={{ color: "#6D28D9", margin: 0, fontSize: "0.95rem" }}>
                Men 5&apos;8&quot;-5&apos;11&quot;, 160-190 lbs → M/L | Women 5&apos;4&quot;-5&apos;7&quot;, 130-160 lbs → M/L
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
              backgroundColor: activeTab === "calculator" ? "#7C3AED" : "#DDD6FE",
              color: activeTab === "calculator" ? "white" : "#5B21B6",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            👕 Size Calculator
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "charts" ? "#7C3AED" : "#DDD6FE",
              color: activeTab === "charts" ? "white" : "#5B21B6",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Size Charts
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "guide" ? "#7C3AED" : "#DDD6FE",
              color: activeTab === "guide" ? "white" : "#5B21B6",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📐 Measurement Guide
          </button>
        </div>

        {/* Tab 1: Size Calculator */}
        {activeTab === 'calculator' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #DDD6FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📏 Your Measurements
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Gender Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Category
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: 'men', label: '👨 Men', color: '#3B82F6' },
                      { value: 'women', label: '👩 Women', color: '#EC4899' },
                      { value: 'youth', label: '👦 Youth', color: '#10B981' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setGender(option.value as 'men' | 'women' | 'youth')}
                        style={{
                          flex: 1,
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: gender === option.value ? `2px solid ${option.color}` : "1px solid #DDD6FE",
                          backgroundColor: gender === option.value ? `${option.color}15` : "white",
                          cursor: "pointer",
                          fontWeight: gender === option.value ? "600" : "400",
                          color: gender === option.value ? option.color : "#4B5563",
                          fontSize: "0.9rem"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unit System Toggle */}
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
                        border: unitSystem === 'imperial' ? "2px solid #7C3AED" : "1px solid #DDD6FE",
                        backgroundColor: unitSystem === 'imperial' ? "#EDE9FE" : "white",
                        cursor: "pointer",
                        fontWeight: unitSystem === 'imperial' ? "600" : "400",
                        color: unitSystem === 'imperial' ? "#5B21B6" : "#4B5563"
                      }}
                    >
                      🇺🇸 ft/in, lbs
                    </button>
                    <button
                      onClick={() => setUnitSystem('metric')}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: unitSystem === 'metric' ? "2px solid #7C3AED" : "1px solid #DDD6FE",
                        backgroundColor: unitSystem === 'metric' ? "#EDE9FE" : "white",
                        cursor: "pointer",
                        fontWeight: unitSystem === 'metric' ? "600" : "400",
                        color: unitSystem === 'metric' ? "#5B21B6" : "#4B5563"
                      }}
                    >
                      🌍 cm, kg
                    </button>
                  </div>
                </div>

                {/* Height Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Height
                  </label>
                  {unitSystem === 'imperial' ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #DDD6FE",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                          placeholder="5"
                        />
                        <span style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", display: "block" }}>feet</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #DDD6FE",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                          placeholder="10"
                        />
                        <span style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", display: "block" }}>inches</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #DDD6FE",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                        placeholder="178"
                      />
                      <span style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", display: "block" }}>centimeters</span>
                    </div>
                  )}
                </div>

                {/* Weight Input */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Weight
                  </label>
                  <div>
                    <input
                      type="number"
                      value={unitSystem === 'imperial' ? weightLbs : weightKg}
                      onChange={(e) => unitSystem === 'imperial' ? setWeightLbs(e.target.value) : setWeightKg(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #DDD6FE",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder={unitSystem === 'imperial' ? "170" : "77"}
                    />
                    <span style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px", display: "block" }}>
                      {unitSystem === 'imperial' ? 'pounds (lbs)' : 'kilograms (kg)'}
                    </span>
                  </div>
                </div>

                {/* Body Build */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Body Build
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: 'slim', label: 'Slim', icon: '🏃' },
                      { value: 'average', label: 'Average', icon: '🧍' },
                      { value: 'athletic', label: 'Athletic', icon: '💪' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setBodyBuild(option.value as 'slim' | 'average' | 'athletic')}
                        style={{
                          flex: 1,
                          padding: "12px 8px",
                          borderRadius: "8px",
                          border: bodyBuild === option.value ? "2px solid #7C3AED" : "1px solid #DDD6FE",
                          backgroundColor: bodyBuild === option.value ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontWeight: bodyBuild === option.value ? "600" : "400",
                          color: bodyBuild === option.value ? "#5B21B6" : "#4B5563",
                          fontSize: "0.85rem"
                        }}
                      >
                        {option.icon}<br/>{option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit Preference */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Fit Preference
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {[
                      { value: 'tight', label: 'Tight' },
                      { value: 'regular', label: 'Regular' },
                      { value: 'loose', label: 'Loose' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setFitPreference(option.value as 'tight' | 'regular' | 'loose')}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "8px",
                          border: fitPreference === option.value ? "2px solid #7C3AED" : "1px solid #DDD6FE",
                          backgroundColor: fitPreference === option.value ? "#EDE9FE" : "white",
                          cursor: "pointer",
                          fontWeight: fitPreference === option.value ? "600" : "400",
                          color: fitPreference === option.value ? "#5B21B6" : "#4B5563"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#EDE9FE",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #C4B5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#5B21B6" }}>
                    💡 <strong>Tip:</strong> When in doubt, size up. A slightly loose T-shirt is more comfortable than one that&apos;s too tight.
                  </p>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="calc-results" style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #DDD6FE",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#5B21B6", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  👕 Your Recommended Size
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {sizeResult ? (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#EDE9FE",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #7C3AED"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#5B21B6" }}>
                        Recommended Size
                      </p>
                      <p style={{ margin: 0, fontSize: "4rem", fontWeight: "bold", color: "#7C3AED" }}>
                        {sizeResult.recommended.size}
                      </p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#6D28D9" }}>
                        {gender === 'men' ? "Men's" : gender === 'women' ? "Women's" : "Youth"} T-Shirt
                      </p>
                    </div>

                    {/* Alternative Sizes */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                      {sizeResult.smaller && (
                        <div style={{
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          textAlign: "center",
                          border: "1px solid #E5E7EB"
                        }}>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>For tighter fit</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>
                            {sizeResult.smaller.size}
                          </p>
                        </div>
                      )}
                      {sizeResult.larger && (
                        <div style={{
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          textAlign: "center",
                          border: "1px solid #E5E7EB"
                        }}>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6B7280" }}>For looser fit</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "1.5rem", fontWeight: "bold", color: "#374151" }}>
                            {sizeResult.larger.size}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Size Details */}
                    <div style={{ marginBottom: "20px" }}>
                      <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>
                        Size {sizeResult.recommended.size} Measurements:
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Chest</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{sizeResult.recommended.chest}&quot;</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Waist</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{sizeResult.recommended.waist}&quot;</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                          <span style={{ color: "#4B5563" }}>Length</span>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{sizeResult.recommended.length}&quot;</span>
                        </div>
                      </div>
                    </div>

                    {/* International Conversion */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      padding: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#92400E", fontWeight: "600" }}>
                        🌍 International Sizes
                      </p>
                      <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#B45309" }}>
                        US/UK: {sizeResult.recommended.size} | EU: {internationalSizes.find(s => s.us === sizeResult.recommended.size.replace(/[0-9]/g, '').trim())?.eu || 'N/A'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#6B7280" }}>
                    <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>📏</p>
                    <p style={{ margin: 0 }}>Enter your height and weight to see your recommended size</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Size Charts */}
        {activeTab === 'charts' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DDD6FE",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
              📊 T-Shirt Size Charts
            </h2>

            {/* Men's Chart */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#3B82F6", marginBottom: "16px" }}>
                👨 Men&apos;s T-Shirt Sizes
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#DBEAFE" }}>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #93C5FD", fontWeight: "600" }}>Size</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #93C5FD", fontWeight: "600" }}>Height</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #93C5FD", fontWeight: "600" }}>Weight</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #93C5FD", fontWeight: "600" }}>Chest</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #93C5FD", fontWeight: "600" }}>Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensSizeData.map((size, index) => (
                      <tr key={size.size} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#3B82F6" }}>{size.size}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{Math.floor(size.minHeight/12)}&apos;{size.minHeight%12}&quot; - {Math.floor(size.maxHeight/12)}&apos;{size.maxHeight%12}&quot;</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.minWeight}-{size.maxWeight} lbs</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.chest}&quot;</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.waist}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Women's Chart */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#EC4899", marginBottom: "16px" }}>
                👩 Women&apos;s T-Shirt Sizes
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#FCE7F3" }}>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #F9A8D4", fontWeight: "600" }}>Size</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #F9A8D4", fontWeight: "600" }}>Height</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #F9A8D4", fontWeight: "600" }}>Weight</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #F9A8D4", fontWeight: "600" }}>Bust</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #F9A8D4", fontWeight: "600" }}>Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womensSizeData.map((size, index) => (
                      <tr key={size.size} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#FDF2F8' }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #FBCFE8", fontWeight: "600", color: "#EC4899" }}>{size.size}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #FBCFE8", textAlign: "center" }}>{Math.floor(size.minHeight/12)}&apos;{size.minHeight%12}&quot; - {Math.floor(size.maxHeight/12)}&apos;{size.maxHeight%12}&quot;</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #FBCFE8", textAlign: "center" }}>{size.minWeight}-{size.maxWeight} lbs</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #FBCFE8", textAlign: "center" }}>{size.chest}&quot;</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #FBCFE8", textAlign: "center" }}>{size.waist}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Youth Chart */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#10B981", marginBottom: "16px" }}>
                👦 Youth T-Shirt Sizes
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#D1FAE5" }}>
                      <th style={{ padding: "10px 12px", textAlign: "left", borderBottom: "2px solid #6EE7B7", fontWeight: "600" }}>Size</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #6EE7B7", fontWeight: "600" }}>Height</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #6EE7B7", fontWeight: "600" }}>Weight</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #6EE7B7", fontWeight: "600" }}>Chest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {youthSizeData.map((size, index) => (
                      <tr key={size.size} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F0FDF4' }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #A7F3D0", fontWeight: "600", color: "#10B981" }}>{size.size}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #A7F3D0", textAlign: "center" }}>{Math.floor(size.minHeight/12)}&apos;{size.minHeight%12}&quot; - {Math.floor(size.maxHeight/12)}&apos;{size.maxHeight%12}&quot;</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #A7F3D0", textAlign: "center" }}>{size.minWeight}-{size.maxWeight} lbs</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #A7F3D0", textAlign: "center" }}>{size.chest}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* International Conversion */}
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                🌍 International Size Conversion
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #D1D5DB", fontWeight: "600" }}>US</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #D1D5DB", fontWeight: "600" }}>UK</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #D1D5DB", fontWeight: "600" }}>EU</th>
                      <th style={{ padding: "10px 12px", textAlign: "center", borderBottom: "2px solid #D1D5DB", fontWeight: "600" }}>Japan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {internationalSizes.map((size, index) => (
                      <tr key={size.us} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#F9FAFB' }}>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{size.us}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.uk}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.eu}</td>
                        <td style={{ padding: "10px 12px", borderBottom: "1px solid #E5E7EB", textAlign: "center" }}>{size.jp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Measurement Guide */}
        {activeTab === 'guide' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #DDD6FE",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📐 How to Measure for T-Shirts
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              For the most accurate fit, measure yourself or a T-shirt that fits you well.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {/* Chest */}
              <div style={{ padding: "20px", backgroundColor: "#EDE9FE", borderRadius: "12px", border: "1px solid #C4B5FD" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#5B21B6", fontSize: "1.125rem" }}>📏 Chest / Bust</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Measure around the fullest part of your chest, keeping the tape horizontal and snug but not tight. 
                  For women, measure over the fullest part of your bust while wearing a bra you&apos;d normally wear with a T-shirt.
                </p>
              </div>

              {/* Waist */}
              <div style={{ padding: "20px", backgroundColor: "#DBEAFE", borderRadius: "12px", border: "1px solid #93C5FD" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#1E40AF", fontSize: "1.125rem" }}>📏 Waist</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Measure around your natural waistline, which is the narrowest part of your torso, typically just above 
                  your belly button. Keep the tape snug but comfortable—you should be able to breathe normally.
                </p>
              </div>

              {/* Length */}
              <div style={{ padding: "20px", backgroundColor: "#D1FAE5", borderRadius: "12px", border: "1px solid #6EE7B7" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#166534", fontSize: "1.125rem" }}>📏 Length</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Measure from the highest point of your shoulder (where a seam would sit) down to where you want the 
                  T-shirt to end. Most T-shirts end at mid-hip, covering your waistband.
                </p>
              </div>

              {/* Measuring a T-Shirt */}
              <div style={{ padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", border: "1px solid #FCD34D" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#92400E", fontSize: "1.125rem" }}>👕 Measuring a T-Shirt</h3>
                <p style={{ color: "#4B5563", fontSize: "0.9rem", lineHeight: "1.7", margin: 0 }}>
                  Lay a well-fitting T-shirt flat. Measure chest width from armpit to armpit, then double it. 
                  Measure length from the shoulder seam to the bottom hem. Compare these to size charts.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB" }}>
              <h3 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "1rem" }}>💡 Pro Tips</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#4B5563", lineHeight: "1.8" }}>
                <li>Wear thin, form-fitting clothes when measuring yourself</li>
                <li>Keep the measuring tape level and parallel to the ground</li>
                <li>Don&apos;t pull the tape too tight—you want a comfortable fit</li>
                <li>If between sizes, size up for a relaxed fit or size down for a slim fit</li>
                <li>Different brands fit differently—always check the specific brand&apos;s size chart</li>
              </ul>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>👕 How to Find Your T-Shirt Size</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Finding the right T-shirt size can be tricky, especially when shopping online or buying from brands 
                  you&apos;re not familiar with. The good news is that with just your height and weight, you can get a 
                  reliable estimate of what size will fit you best.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The Height-Weight Method</h3>
                <p>
                  Most T-shirt size charts are based on height and weight ranges. This method works well for most 
                  body types because it accounts for your overall frame. Our calculator uses data from major 
                  clothing brands to provide accurate recommendations.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Consider Your Body Type</h3>
                <div style={{
                  backgroundColor: "#EDE9FE",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #C4B5FD"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#5B21B6" }}>
                    <li><strong>Slim build:</strong> You may prefer your calculated size or one size down</li>
                    <li><strong>Average build:</strong> Your calculated size should fit well</li>
                    <li><strong>Athletic build:</strong> Consider sizing up, especially in the chest and shoulders</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Fit Preferences Matter</h3>
                <p>
                  How you like your T-shirts to fit is personal. Some prefer a tighter, more fitted look, while 
                  others want a relaxed, comfortable fit. Our calculator lets you adjust for your preference, 
                  suggesting a size up or down based on how you like to wear your shirts.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Brand Differences</h3>
                <p>
                  Keep in mind that sizing varies between brands. A Medium from one brand might fit like a Large 
                  from another. Always check the specific brand&apos;s size chart when possible, and use our calculator 
                  as a starting point.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#EDE9FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#6D28D9", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• XS: Under 5&apos;6&quot;, &lt;130 lbs</p>
                <p style={{ margin: 0 }}>• S: 5&apos;4&quot;-5&apos;8&quot;, 125-150 lbs</p>
                <p style={{ margin: 0 }}>• M: 5&apos;6&quot;-5&apos;10&quot;, 145-175 lbs</p>
                <p style={{ margin: 0 }}>• L: 5&apos;8&quot;-6&apos;0&quot;, 170-200 lbs</p>
                <p style={{ margin: 0 }}>• XL: 5&apos;10&quot;+, 195-230 lbs</p>
              </div>
            </div>

            {/* Did You Know */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: 0 }}>The most commonly purchased T-shirt sizes are Medium and Large, accounting for about 50% of all sales.</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/t-shirt-size-calculator" currentCategory="Lifestyle" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #DDD6FE", padding: "32px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ padding: "16px", backgroundColor: "#EDE9FE", borderRadius: "8px", border: "1px solid #C4B5FD" }}>
          <p style={{ fontSize: "0.75rem", color: "#5B21B6", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on general sizing guidelines. 
            Actual fit may vary between brands and styles. Always check the specific brand&apos;s size chart when possible. 
            When in doubt, size up for comfort.
          </p>
        </div>
      </div>
    </div>
  );
}