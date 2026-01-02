"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 地形系数
const terrainFactors: Record<string, { factor: number; description: string }> = {
  "Paved Road": { factor: 1.0, description: "Sidewalk, asphalt, concrete" },
  "Dirt Road": { factor: 1.1, description: "Packed dirt, gravel path" },
  "Light Brush": { factor: 1.2, description: "Light vegetation, easy trail" },
  "Grass": { factor: 1.3, description: "Lawn, field, park grass" },
  "Sand": { factor: 1.5, description: "Beach, desert sand" },
  "Snow (Packed)": { factor: 1.6, description: "Hard-packed snow" },
  "Snow (Loose)": { factor: 2.0, description: "Deep, soft snow" },
};

// FAQ数据
const faqs = [
  {
    question: "How to calculate calories for rucking?",
    answer: "Rucking calories are calculated using the Pandolf equation, developed by US Army researchers. The formula considers your body weight, pack weight, walking speed, terrain grade, and surface type. A simplified version: Calories ≈ (Body Weight + Pack Weight) × Distance × Terrain Factor × 0.5. Our calculator uses the full scientific formula for more accurate results."
  },
  {
    question: "Does rucking really burn more calories than walking?",
    answer: "Yes! Rucking typically burns 2-3x more calories than regular walking at the same pace. The added weight forces your muscles to work harder, increases your heart rate, and elevates your metabolic rate. A 180 lb person walking burns about 280 calories/hour, while the same person rucking with 35 lbs burns approximately 500-700 calories/hour."
  },
  {
    question: "How many calories do you burn rucking with 50 pounds?",
    answer: "A 180 lb person rucking with 50 lbs at 15 min/mile pace on flat pavement burns approximately 700-800 calories per hour. This varies based on your body weight, speed, terrain, and grade. Heavier loads and faster paces increase calorie burn significantly."
  },
  {
    question: "What is a good ruck weight for beginners?",
    answer: "Beginners should start with 10-20% of their body weight. For a 180 lb person, that's 18-36 lbs. Start with 20 lbs and gradually increase by 5 lbs per week as your fitness improves. Never exceed 1/3 of your body weight to prevent injury."
  },
  {
    question: "Is rucking better than running for weight loss?",
    answer: "Both are effective, but rucking offers unique advantages: it's lower impact on joints (3x body weight force vs 8x for running), builds more muscle, and is sustainable for longer durations. While running burns more calories per minute, many people can ruck for 60-90 minutes but only run for 20-30 minutes, potentially equalizing total calorie burn."
  }
];

// FAQ组件
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left"
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}>
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
}

export default function RuckingCalorieCalculator() {
  // 单位系统
  const [unitSystem, setUnitSystem] = useState<"imperial" | "metric">("imperial");
  
  // 输入状态
  const [bodyWeight, setBodyWeight] = useState<string>("180");
  const [ruckWeight, setRuckWeight] = useState<string>("35");
  const [duration, setDuration] = useState<string>("60");
  const [pace, setPace] = useState<string>("15"); // min per mile or min per km
  const [grade, setGrade] = useState<string>("0");
  const [terrain, setTerrain] = useState<string>("Paved Road");
  
  // 高级选项
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // 结果
  const [results, setResults] = useState<{
    totalCalories: number;
    caloriesPerHour: number;
    caloriesPerDistance: number;
    distance: number;
    walkingCalories: number;
    multiplier: number;
    intensity: string;
    loadPercent: number;
  } | null>(null);

  // 单位转换
  const lbsToKg = (lbs: number) => lbs / 2.20462;
  const kgToLbs = (kg: number) => kg * 2.20462;
  const mileToKm = (miles: number) => miles * 1.60934;
  const kmToMile = (km: number) => km / 1.60934;

  // 计算
  const calculate = () => {
    let W_kg: number; // Body weight in kg
    let L_kg: number; // Load weight in kg
    let V_ms: number; // Speed in m/s
    const G = parseFloat(grade) || 0; // Grade in %
    const η = terrainFactors[terrain]?.factor || 1.0; // Terrain factor
    const duration_min = parseFloat(duration) || 0;

    if (unitSystem === "imperial") {
      W_kg = lbsToKg(parseFloat(bodyWeight) || 0);
      L_kg = lbsToKg(parseFloat(ruckWeight) || 0);
      // pace is min/mile, convert to m/s
      const paceMinPerMile = parseFloat(pace) || 15;
      const speedMph = 60 / paceMinPerMile;
      V_ms = speedMph * 0.44704; // mph to m/s
    } else {
      W_kg = parseFloat(bodyWeight) || 0;
      L_kg = parseFloat(ruckWeight) || 0;
      // pace is min/km, convert to m/s
      const paceMinPerKm = parseFloat(pace) || 9;
      const speedKph = 60 / paceMinPerKm;
      V_ms = speedKph / 3.6; // kph to m/s
    }

    if (W_kg <= 0 || duration_min <= 0) {
      alert("Please enter valid body weight and duration");
      return;
    }

    // Pandolf equation: M = 1.5W + 2.0(W+L)(L/W)² + η(W+L)(1.5V² + 0.35VG)
    const term1 = 1.5 * W_kg; // Standing metabolic cost
    const term2 = 2.0 * (W_kg + L_kg) * Math.pow(L_kg / W_kg, 2); // Load carrying cost
    const term3 = η * (W_kg + L_kg) * (1.5 * Math.pow(V_ms, 2) + 0.35 * V_ms * G); // Movement cost
    
    let M_watts = term1 + term2 + term3;
    
    // Modern correction factor (accounts for underestimation in original Pandolf)
    const loadRatio = L_kg / W_kg;
    const correctionFactor = 1 + 0.3 * loadRatio; // ~30% increase per 100% BW load
    M_watts *= correctionFactor;
    
    // Convert to calories: 1 Watt = 0.01433 kcal/min
    const totalCalories = M_watts * 0.01433 * duration_min;
    const caloriesPerHour = M_watts * 0.01433 * 60;
    
    // Calculate distance
    let distance: number; // in user's unit (miles or km)
    if (unitSystem === "imperial") {
      const paceMinPerMile = parseFloat(pace) || 15;
      distance = duration_min / paceMinPerMile; // miles
    } else {
      const paceMinPerKm = parseFloat(pace) || 9;
      distance = duration_min / paceMinPerKm; // km
    }
    
    const caloriesPerDistance = totalCalories / distance; // per mile or per km
    
    // Calculate walking calories (no load) for comparison
    const M_walking = 1.5 * W_kg + η * W_kg * (1.5 * Math.pow(V_ms, 2) + 0.35 * V_ms * G);
    const walkingCalories = M_walking * 0.01433 * duration_min;
    
    const multiplier = totalCalories / walkingCalories;
    
    // Determine intensity
    let intensity: string;
    const loadPercent = (L_kg / W_kg) * 100;
    if (loadPercent < 15) {
      intensity = "Light";
    } else if (loadPercent < 25) {
      intensity = "Moderate";
    } else if (loadPercent < 35) {
      intensity = "Challenging";
    } else {
      intensity = "Intense";
    }

    setResults({
      totalCalories: Math.round(totalCalories),
      caloriesPerHour: Math.round(caloriesPerHour),
      caloriesPerDistance: Math.round(caloriesPerDistance),
      distance: parseFloat(distance.toFixed(1)),
      walkingCalories: Math.round(walkingCalories),
      multiplier: parseFloat(multiplier.toFixed(2)),
      intensity,
      loadPercent: parseFloat(loadPercent.toFixed(1))
    });
  };

  // 重置
  const reset = () => {
    setBodyWeight(unitSystem === "imperial" ? "180" : "82");
    setRuckWeight(unitSystem === "imperial" ? "35" : "16");
    setDuration("60");
    setPace(unitSystem === "imperial" ? "15" : "9");
    setGrade("0");
    setTerrain("Paved Road");
    setResults(null);
  };

  // 单位切换时转换值
  const handleUnitChange = (newUnit: "imperial" | "metric") => {
    if (newUnit === unitSystem) return;
    
    if (newUnit === "metric") {
      setBodyWeight(Math.round(lbsToKg(parseFloat(bodyWeight) || 0)).toString());
      setRuckWeight(Math.round(lbsToKg(parseFloat(ruckWeight) || 0)).toString());
      setPace(Math.round((parseFloat(pace) || 15) / 1.60934).toString());
    } else {
      setBodyWeight(Math.round(kgToLbs(parseFloat(bodyWeight) || 0)).toString());
      setRuckWeight(Math.round(kgToLbs(parseFloat(ruckWeight) || 0)).toString());
      setPace(Math.round((parseFloat(pace) || 9) * 1.60934).toString());
    }
    setUnitSystem(newUnit);
    setResults(null);
  };

  const weightUnit = unitSystem === "imperial" ? "lbs" : "kg";
  const paceUnit = unitSystem === "imperial" ? "min/mile" : "min/km";
  const distanceUnit = unitSystem === "imperial" ? "miles" : "km";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Rucking Calorie Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Rucking Calorie Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how many calories you burn rucking based on your weight, pack weight, pace, and terrain. Compare with regular walking to see the difference.
          </p>
        </div>

        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {/* Left: Input Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "20px" }}>
                Your Ruck Details
              </h2>

              {/* Unit System */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Unit System
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleUnitChange("imperial")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: unitSystem === "imperial" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "imperial" ? "#ECFDF5" : "white",
                      color: unitSystem === "imperial" ? "#059669" : "#4B5563",
                      fontWeight: unitSystem === "imperial" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🇺🇸 Imperial (lbs/miles)
                  </button>
                  <button
                    onClick={() => handleUnitChange("metric")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: unitSystem === "metric" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: unitSystem === "metric" ? "#ECFDF5" : "white",
                      color: unitSystem === "metric" ? "#059669" : "#4B5563",
                      fontWeight: unitSystem === "metric" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🌍 Metric (kg/km)
                  </button>
                </div>
              </div>

              {/* Body Weight */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  Body Weight ({weightUnit})
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={bodyWeight}
                    onChange={(e) => setBodyWeight(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                  />
                  <span style={{ color: "#6B7280" }}>{weightUnit}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {(unitSystem === "imperial" ? [150, 180, 200, 220] : [68, 82, 91, 100]).map((w) => (
                    <button
                      key={w}
                      onClick={() => setBodyWeight(w.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: bodyWeight === w.toString() ? "#ECFDF5" : "#F9FAFB",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ruck Weight */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🎒 Ruck Weight ({weightUnit})
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={ruckWeight}
                    onChange={(e) => setRuckWeight(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                  />
                  <span style={{ color: "#6B7280" }}>{weightUnit}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {(unitSystem === "imperial" ? [20, 30, 40, 50] : [9, 14, 18, 23]).map((w) => (
                    <button
                      key={w}
                      onClick={() => setRuckWeight(w.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: ruckWeight === w.toString() ? "#ECFDF5" : "#F9FAFB",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ⏱️ Duration (minutes)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                  />
                  <span style={{ color: "#6B7280" }}>min</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {[30, 45, 60, 90, 120].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: duration === d.toString() ? "#ECFDF5" : "#F9FAFB",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🚶 Pace ({paceUnit})
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={pace}
                    onChange={(e) => setPace(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                  />
                  <span style={{ color: "#6B7280" }}>{paceUnit}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {(unitSystem === "imperial" ? [12, 15, 18, 20] : [7, 9, 11, 12]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPace(p.toString())}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: pace === p.toString() ? "#ECFDF5" : "#F9FAFB",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "4px" }}>
                  {unitSystem === "imperial" ? "15 min/mile = 4 mph (military standard)" : "9 min/km = 6.7 kph"}
                </p>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  backgroundColor: "#F3F4F6",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#374151",
                  marginBottom: "20px"
                }}
              >
                <span>⚙️</span>
                <span style={{ fontWeight: "500" }}>Advanced Options (Terrain & Grade)</span>
                <svg
                  style={{ marginLeft: "auto", width: "16px", height: "16px", transform: showAdvanced ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAdvanced && (
                <div style={{ backgroundColor: "#F9FAFB", padding: "16px", borderRadius: "12px", marginBottom: "20px" }}>
                  {/* Grade */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      ⛰️ Terrain Grade (%)
                    </label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input
                        type="number"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        style={{
                          width: "80px",
                          padding: "8px 12px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "1rem",
                          textAlign: "center"
                        }}
                        min="0"
                        max="30"
                      />
                      <span style={{ color: "#6B7280" }}>%</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                      {[0, 5, 10, 15].map((g) => (
                        <button
                          key={g}
                          onClick={() => setGrade(g.toString())}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "4px",
                            border: "1px solid #E5E7EB",
                            backgroundColor: grade === g.toString() ? "#ECFDF5" : "white",
                            color: "#4B5563",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {g}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Surface/Terrain */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      🌍 Surface Type
                    </label>
                    <select
                      value={terrain}
                      onChange={(e) => setTerrain(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "0.875rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.entries(terrainFactors).map(([name, data]) => (
                        <option key={name} value={name}>
                          {name} ({data.factor}x) - {data.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#DC2626",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  🔥 Calculate Calories
                </button>
                <button
                  onClick={reset}
                  style={{
                    padding: "14px 24px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontWeight: "500",
                    color: "#4B5563",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Right: Result Section */}
            <div style={{ flex: "1", minWidth: "300px" }}>
              {/* Main Result */}
              <div style={{ 
                background: results 
                  ? "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: results ? "#DC2626" : "#6B7280",
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  🔥 Total Calories Burned
                </p>
                <p style={{ 
                  fontSize: "3.5rem", 
                  fontWeight: "bold", 
                  color: results ? "#DC2626" : "#9CA3AF",
                  lineHeight: "1" 
                }}>
                  {results ? results.totalCalories.toLocaleString() : "—"}
                </p>
                <p style={{ 
                  color: results ? "#991B1B" : "#6B7280",
                  marginTop: "8px", 
                  fontSize: "0.875rem"
                }}>
                  {results ? `for ${duration} minutes of rucking` : "Enter details to calculate"}
                </p>
              </div>

              {/* Comparison with Walking */}
              {results && (
                <div style={{ 
                  backgroundColor: "#ECFDF5", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#065F46", textTransform: "uppercase", marginBottom: "8px" }}>
                    📊 vs Walking (No Weight)
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontSize: "0.875rem", color: "#047857" }}>Walking would burn</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>{results.walkingCalories} cal</p>
                    </div>
                    <div style={{ 
                      backgroundColor: "#059669", 
                      color: "white", 
                      padding: "8px 16px", 
                      borderRadius: "20px",
                      fontWeight: "bold",
                      fontSize: "1.125rem"
                    }}>
                      {results.multiplier}x MORE! 🎯
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📋 Breakdown
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Calories per Hour</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{results.caloriesPerHour} cal/hr</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Calories per {unitSystem === "imperial" ? "Mile" : "Km"}</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{results.caloriesPerDistance} cal/{unitSystem === "imperial" ? "mi" : "km"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Distance Covered</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{results.distance} {distanceUnit}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Load Percentage</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>{results.loadPercent}% of body weight</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Intensity Level</span>
                      <span style={{ 
                        fontWeight: "600", 
                        color: results.intensity === "Light" ? "#059669" : 
                               results.intensity === "Moderate" ? "#D97706" :
                               results.intensity === "Challenging" ? "#EA580C" : "#DC2626"
                      }}>
                        {results.intensity}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Reference */}
              {!results && (
                <div style={{ 
                  backgroundColor: "#FEF3C7", 
                  borderRadius: "12px", 
                  padding: "16px"
                }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "#92400E", marginBottom: "12px" }}>
                    🎒 Quick Reference (180 lbs, 35 lbs ruck, 1 hour)
                  </p>
                  <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>15 min/mile (4 mph)</span>
                      <span style={{ fontWeight: "600" }}>~650 cal</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>12 min/mile (5 mph)</span>
                      <span style={{ fontWeight: "600" }}>~780 cal</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>+ 10% grade uphill</span>
                      <span style={{ fontWeight: "600" }}>+25% more</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - 两栏布局 */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content - 左侧宽 */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What is Rucking */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                What is Rucking?
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Rucking is simply walking with a weighted backpack (called a &quot;rucksack&quot;). Originally a military training exercise, rucking has become popular for fitness because it burns 2-3x more calories than regular walking while being low-impact on your joints.
              </p>
              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                Unlike running, which puts 8x your body weight of force on your knees, rucking only puts about 3x—making it sustainable for longer durations and less likely to cause injury. It&apos;s essentially &quot;cardio that builds strength.&quot;
              </p>
            </div>

            {/* How We Calculate */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How We Calculate Rucking Calories
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Our calculator uses the <strong>Pandolf equation</strong>, developed by the U.S. Army Research Institute of Environmental Medicine in the 1970s. It&apos;s the gold standard for estimating energy expenditure during load carriage.
              </p>
              
              <div style={{ backgroundColor: "#F3F4F6", padding: "16px", borderRadius: "8px", marginBottom: "16px", fontFamily: "monospace", fontSize: "0.875rem" }}>
                M = 1.5W + 2.0(W+L)(L/W)² + η(W+L)(1.5V² + 0.35VG)
              </div>
              
              <p style={{ color: "#4B5563", marginBottom: "12px", fontSize: "0.875rem" }}>Where:</p>
              <ul style={{ color: "#4B5563", paddingLeft: "20px", fontSize: "0.875rem", lineHeight: "1.8" }}>
                <li><strong>M</strong> = Metabolic rate (Watts)</li>
                <li><strong>W</strong> = Body weight (kg)</li>
                <li><strong>L</strong> = Load/pack weight (kg)</li>
                <li><strong>V</strong> = Walking speed (m/s)</li>
                <li><strong>G</strong> = Grade/slope (%)</li>
                <li><strong>η</strong> = Terrain factor (1.0-2.0)</li>
              </ul>
            </div>

            {/* Rucking vs Walking Table */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Rucking vs Walking vs Running
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Activity</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Cal/Hour*</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Joint Impact</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Builds Muscle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>Walking (no weight)</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>280</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🟢 Very Low</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>❌ Minimal</td>
                    </tr>
                    <tr style={{ backgroundColor: "#ECFDF5" }}>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>🎒 Rucking (35 lbs)</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>650-700</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🟡 Low (3x BW)</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>✅ Yes</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>Running (6 mph)</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>700-840</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🔴 High (8x BW)</td>
                      <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>❌ Minimal</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "8px" }}>
                *Based on 180 lb person at moderate pace. BW = Body Weight.
              </p>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Beginner's Guide */}
            <div style={{ 
              backgroundColor: "#ECFDF5", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>
                🎒 Beginner&apos;s Ruck Weight Guide
              </h3>
              <div style={{ fontSize: "0.875rem", color: "#047857" }}>
                <div style={{ marginBottom: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Just Starting</p>
                  <p>10-15% of body weight</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>180 lbs → 18-27 lbs</p>
                </div>
                <div style={{ marginBottom: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Intermediate</p>
                  <p>20-25% of body weight</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>180 lbs → 36-45 lbs</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Advanced</p>
                  <p>30-33% of body weight (max)</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>180 lbs → 54-60 lbs</p>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💪 Pro Tips
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Start with 20 lbs for your first ruck",
                  "Maintain a 15-20 min/mile pace",
                  "Increase weight by 5 lbs per week max",
                  "Keep weight high and close to your back",
                  "Wear supportive boots or shoes",
                  "Stay in the aerobic zone (60-70% max HR)"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#DC2626", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RelatedTools currentUrl="/rucking-calorie-calculator" currentCategory="Fitness" />
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
      </div>
    </div>
  );
}
