"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

interface TankInfo {
  name: string;
  capacity: number; // usable gallons (80% fill for large tanks)
  emoji: string;
}

// Base consumption rates (gallons per hour at full load)
const baseRates: Record<number, number> = {
  7: 1.5,
  10: 2.0,
  12: 2.2,
  14: 2.5,
  16: 2.8,
  20: 3.5,
  22: 3.9,
  24: 4.2,
  30: 4.8,
  38: 5.4,
};

// Common generator sizes for quick selection
const generatorSizes = [7, 10, 14, 20, 22, 24, 38];

// Load factors
const loadOptions = [
  { value: 25, label: "25% - Light", description: "Fridge, lights, phone chargers" },
  { value: 50, label: "50% - Medium", description: "Essential appliances" },
  { value: 75, label: "75% - Heavy", description: "Most home appliances" },
  { value: 100, label: "100% - Full", description: "Maximum capacity" },
];

// Load factor multipliers
const loadFactors: Record<number, number> = {
  25: 0.40,
  50: 0.55,
  75: 0.80,
  100: 1.00,
};

// Runtime quick options (in hours)
const runtimeOptions = [
  { value: 1, label: "1 Hour" },
  { value: 8, label: "8 Hours" },
  { value: 24, label: "24 Hours" },
  { value: 72, label: "3 Days" },
  { value: 168, label: "7 Days" },
];

// Tank sizes
const tanks: TankInfo[] = [
  { name: "20 lb Portable Tank", capacity: 4.7, emoji: "🔋" },
  { name: "100 Gallon Tank", capacity: 80, emoji: "🛢️" },
  { name: "250 Gallon Tank", capacity: 200, emoji: "🛢️" },
  { name: "500 Gallon Tank", capacity: 400, emoji: "🛢️" },
];

// Consumption chart data for reference table
const chartData = [
  { kw: 7, half: 0.8, three_quarter: 1.2, full: 1.5 },
  { kw: 10, half: 1.1, three_quarter: 1.6, full: 2.0 },
  { kw: 14, half: 1.4, three_quarter: 2.0, full: 2.5 },
  { kw: 20, half: 1.9, three_quarter: 2.8, full: 3.5 },
  { kw: 22, half: 2.1, three_quarter: 3.1, full: 3.9 },
  { kw: 24, half: 2.3, three_quarter: 3.4, full: 4.2 },
  { kw: 38, half: 3.0, three_quarter: 4.3, full: 5.4 },
];

// FAQ data
const faqs = [
  {
    question: "How long will a generator run on a 20lb tank of propane?",
    answer: "A 20lb propane tank holds about 4.7 gallons of usable propane. Runtime depends on your generator size and load. For example, a 20kW generator at 50% load (1.9 gph) will run approximately 2.5 hours, while a smaller 7kW generator at 50% load (0.8 gph) can run about 6 hours. Use our calculator above for exact estimates based on your setup."
  },
  {
    question: "How much propane does a generator use in 24 hours?",
    answer: "A typical home standby generator (20-24kW) uses 45-100 gallons of propane per 24 hours depending on load. At 50% load, expect around 45-55 gallons. At full load, consumption can reach 85-100 gallons. Smaller portable generators (7-10kW) use 18-48 gallons per day."
  },
  {
    question: "How long do 250 gallons of propane last with a generator?",
    answer: "With a 250-gallon tank (200 usable gallons at 80% fill), a 22kW generator at 50% load (2.1 gph) would run approximately 95 hours or about 4 days. At full load, it would last about 51 hours or 2 days. Runtime increases significantly if you only run essential appliances."
  },
  {
    question: "Is it cheaper to run a generator on propane or gas?",
    answer: "Propane is often slightly more expensive per hour than gasoline, but propane has significant advantages: it stores indefinitely without degradation, burns cleaner (less maintenance), produces fewer emissions, and propane generators typically last longer. For emergency backup use, propane is generally the better choice despite slightly higher fuel costs."
  },
  {
    question: "How much propane does a Generac generator use?",
    answer: "Generac generators follow similar consumption rates to other brands. A Generac 22kW uses approximately 2.1 gph at half load and 3.9 gph at full load. A Generac 24kW uses about 2.3 gph at half load and 4.2 gph at full load. Always check your specific model's manual for exact specifications."
  },
  {
    question: "What factors affect propane generator fuel consumption?",
    answer: "Key factors include: (1) Generator size (kW rating) - larger generators use more fuel; (2) Electrical load - running more appliances increases consumption; (3) Temperature - cold weather can increase usage by 10-15%; (4) Generator efficiency and age; (5) Altitude - higher elevations may affect performance. Operating at 50-75% load is most efficient."
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

// Helper function to get base rate for any kW (interpolation)
function getBaseRate(kw: number): number {
  if (baseRates[kw]) return baseRates[kw];
  
  // Linear interpolation for custom values
  const sizes = Object.keys(baseRates).map(Number).sort((a, b) => a - b);
  
  if (kw <= sizes[0]) return baseRates[sizes[0]] * (kw / sizes[0]);
  if (kw >= sizes[sizes.length - 1]) return baseRates[sizes[sizes.length - 1]] * (kw / sizes[sizes.length - 1]);
  
  // Find surrounding values
  for (let i = 0; i < sizes.length - 1; i++) {
    if (kw > sizes[i] && kw < sizes[i + 1]) {
      const ratio = (kw - sizes[i]) / (sizes[i + 1] - sizes[i]);
      return baseRates[sizes[i]] + ratio * (baseRates[sizes[i + 1]] - baseRates[sizes[i]]);
    }
  }
  
  return kw * 0.16; // Fallback approximation
}

// Format time display
function formatRuntime(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} minutes`;
  } else if (hours < 24) {
    return `${hours.toFixed(1)} hours`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    if (remainingHours === 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    }
    return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hr${remainingHours > 1 ? 's' : ''}`;
  }
}

export default function PropaneGeneratorCalculator() {
  const [generatorSize, setGeneratorSize] = useState(22);
  const [customSize, setCustomSize] = useState("");
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [loadPercent, setLoadPercent] = useState(50);
  const [runtime, setRuntime] = useState(24);
  const [customRuntime, setCustomRuntime] = useState("");
  const [useCustomRuntime, setUseCustomRuntime] = useState(false);
  const [propanePrice, setPropanePrice] = useState(2.50);
  const [calculated, setCalculated] = useState(false);

  // Get current values
  const currentKW = useCustomSize && customSize ? Number(customSize) : generatorSize;
  const currentHours = useCustomRuntime && customRuntime ? Number(customRuntime) : runtime;

  // Calculate results
  const baseRate = getBaseRate(currentKW);
  const loadFactor = loadFactors[loadPercent] || 0.55;
  const consumptionPerHour = baseRate * loadFactor;
  const totalConsumption = consumptionPerHour * currentHours;
  const estimatedCost = totalConsumption * propanePrice;

  // Calculate tank runtimes
  const tankRuntimes = tanks.map(tank => ({
    ...tank,
    runtime: tank.capacity / consumptionPerHour
  }));

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setGeneratorSize(22);
    setCustomSize("");
    setUseCustomSize(false);
    setLoadPercent(50);
    setRuntime(24);
    setCustomRuntime("");
    setUseCustomRuntime(false);
    setPropanePrice(2.50);
    setCalculated(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EFF6FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BFDBFE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Propane Generator Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>⛽</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Propane Generator Fuel Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much propane your generator uses per hour, estimate costs, and find out how long 
            your fuel supply will last. Works for all generator sizes from 7kW to 38kW+.
          </p>
        </div>

        {/* Tip Box */}
        <div style={{
          backgroundColor: "#2563EB",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 4px 0" }}>
                <strong>Pro Tip</strong>
              </p>
              <p style={{ color: "#BFDBFE", margin: 0, fontSize: "0.95rem" }}>
                Generators are most efficient at 50-75% load. Running at full capacity uses significantly more 
                fuel and can reduce generator lifespan.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #BFDBFE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                ⚙️ Generator Settings
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Generator Size */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  ⚡ Generator Size (kW)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {generatorSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => { setGeneratorSize(size); setUseCustomSize(false); }}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: !useCustomSize && generatorSize === size ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: !useCustomSize && generatorSize === size ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontWeight: !useCustomSize && generatorSize === size ? "600" : "400",
                        color: !useCustomSize && generatorSize === size ? "#2563EB" : "#4B5563",
                        fontSize: "0.95rem"
                      }}
                    >
                      {size} kW
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="customSize"
                    checked={useCustomSize}
                    onChange={(e) => setUseCustomSize(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label htmlFor="customSize" style={{ fontSize: "0.85rem", color: "#6B7280" }}>Custom size:</label>
                  <input
                    type="number"
                    value={customSize}
                    onChange={(e) => { setCustomSize(e.target.value); setUseCustomSize(true); }}
                    placeholder="e.g., 18"
                    min={1}
                    max={100}
                    style={{
                      width: "80px",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "0.9rem"
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>kW</span>
                </div>
              </div>

              {/* Load Percentage */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  📊 Load Percentage
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {loadOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLoadPercent(option.value)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: loadPercent === option.value ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: loadPercent === option.value ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ 
                        fontWeight: loadPercent === option.value ? "600" : "500",
                        color: loadPercent === option.value ? "#2563EB" : "#374151",
                        fontSize: "0.9rem",
                        marginBottom: "2px"
                      }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Runtime */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                  ⏱️ Runtime Duration
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {runtimeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => { setRuntime(option.value); setUseCustomRuntime(false); }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        border: !useCustomRuntime && runtime === option.value ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: !useCustomRuntime && runtime === option.value ? "#EFF6FF" : "white",
                        cursor: "pointer",
                        fontWeight: !useCustomRuntime && runtime === option.value ? "600" : "400",
                        color: !useCustomRuntime && runtime === option.value ? "#2563EB" : "#4B5563",
                        fontSize: "0.85rem"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="customRuntime"
                    checked={useCustomRuntime}
                    onChange={(e) => setUseCustomRuntime(e.target.checked)}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <label htmlFor="customRuntime" style={{ fontSize: "0.85rem", color: "#6B7280" }}>Custom:</label>
                  <input
                    type="number"
                    value={customRuntime}
                    onChange={(e) => { setCustomRuntime(e.target.value); setUseCustomRuntime(true); }}
                    placeholder="e.g., 48"
                    min={1}
                    style={{
                      width: "80px",
                      padding: "8px 12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "6px",
                      fontSize: "0.9rem"
                    }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>hours</span>
                </div>
              </div>

              {/* Propane Price */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                  💵 Propane Price ($/gallon)
                </label>
                <input
                  type="number"
                  value={propanePrice}
                  onChange={(e) => setPropanePrice(Number(e.target.value))}
                  step="0.10"
                  min={0}
                  style={{
                    width: "120px",
                    padding: "12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "8px",
                    fontSize: "1rem"
                  }}
                />
                <span style={{ marginLeft: "8px", fontSize: "0.8rem", color: "#6B7280" }}>
                  (Avg: $2.00 - $3.50)
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleCalculate}
                  style={{
                    flex: 2,
                    padding: "14px",
                    backgroundColor: "#2563EB",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                >
                  🔢 Calculate
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: "14px",
                    backgroundColor: "#F3F4F6",
                    color: "#374151",
                    border: "1px solid #D1D5DB",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #BFDBFE",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                📊 Results
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {!calculated ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⛽</div>
                  <p style={{ margin: 0 }}>Configure settings and click Calculate!</p>
                </div>
              ) : (
                <>
                  {/* Main Results */}
                  <div style={{ 
                    backgroundColor: "#EFF6FF", 
                    borderRadius: "12px", 
                    padding: "20px",
                    marginBottom: "20px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                      <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "4px" }}>
                        {currentKW} kW Generator @ {loadPercent}% Load
                      </div>
                      <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2563EB" }}>
                        {consumptionPerHour.toFixed(2)} gph
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#4B5563" }}>
                        gallons per hour
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ 
                        backgroundColor: "white", 
                        padding: "16px", 
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>
                          Total for {formatRuntime(currentHours)}
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>
                          {totalConsumption.toFixed(1)} gal
                        </div>
                      </div>
                      <div style={{ 
                        backgroundColor: "white", 
                        padding: "16px", 
                        borderRadius: "8px",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>
                          Estimated Cost
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                          ${estimatedCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tank Runtimes */}
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", marginBottom: "12px" }}>
                      🛢️ Tank Runtime Estimates
                    </h3>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {tankRuntimes.map((tank, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 16px",
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{tank.emoji}</span>
                            <div>
                              <div style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
                                {tank.name}
                              </div>
                              <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                                {tank.capacity} gal usable
                              </div>
                            </div>
                          </div>
                          <div style={{ 
                            fontWeight: "bold", 
                            color: "#2563EB",
                            fontSize: "1rem"
                          }}>
                            {formatRuntime(tank.runtime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Consumption Reference Chart */}
        <div style={{ 
          backgroundColor: "white", 
          borderRadius: "16px", 
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
          border: "1px solid #BFDBFE", 
          padding: "32px",
          marginBottom: "32px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📋 Propane Generator Usage Chart (Gallons Per Hour)
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #BFDBFE", fontWeight: "600" }}>Generator Size</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #BFDBFE", fontWeight: "600" }}>50% Load</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #BFDBFE", fontWeight: "600" }}>75% Load</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", borderBottom: "2px solid #BFDBFE", fontWeight: "600" }}>100% Load</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "500" }}>{row.kw} kW</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{row.half} gph</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{row.three_quarter} gph</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", borderBottom: "1px solid #E5E7EB" }}>{row.full} gph</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
            * Values are estimates based on typical propane generator efficiency. Actual consumption may vary by brand and model.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                🔥 Understanding Propane Generator Fuel Consumption
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Knowing how much propane your generator uses helps you plan for emergencies, budget fuel costs, 
                  and ensure you have enough supply during extended power outages.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Factors Affecting Consumption</h3>
                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>Generator Size (kW):</strong> Larger generators consume more fuel</li>
                    <li><strong>Electrical Load:</strong> More appliances = higher consumption</li>
                    <li><strong>Temperature:</strong> Cold weather increases usage 10-15%</li>
                    <li><strong>Altitude:</strong> Higher elevations affect performance</li>
                    <li><strong>Maintenance:</strong> Well-maintained generators run more efficiently</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Propane Tank Sizes Explained</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <strong>🔋 20 lb Portable</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#2563EB" }}>
                      4.7 gallons usable. Standard BBQ grill tank.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <strong>🛢️ 100 Gallon</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#2563EB" }}>
                      80 gallons usable. Small stationary tank.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <strong>🛢️ 250 Gallon</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#2563EB" }}>
                      200 gallons usable. Common home tank.
                    </p>
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <strong>🛢️ 500 Gallon</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#2563EB" }}>
                      400 gallons usable. Extended backup power.
                    </p>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", marginTop: "8px" }}>
                  * Large tanks are filled to 80% capacity for safety, allowing propane to expand.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#2563EB", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>⚡ Quick Facts</h3>
              <div style={{ fontSize: "0.85rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• 1 gallon propane = 91,500 BTU</p>
                <p style={{ margin: "0 0 8px 0" }}>• Propane weighs ~4.2 lbs/gallon</p>
                <p style={{ margin: "0 0 8px 0" }}>• 20lb tank = ~4.7 gallons</p>
                <p style={{ margin: "0 0 8px 0" }}>• Most efficient at 50-75% load</p>
                <p style={{ margin: 0 }}>• Propane stores indefinitely</p>
              </div>
            </div>

            {/* Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Save Fuel Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Run essential loads only</p>
                <p style={{ margin: "0 0 8px 0" }}>• Use LED lights</p>
                <p style={{ margin: "0 0 8px 0" }}>• Cycle A/C rather than continuous</p>
                <p style={{ margin: "0 0 8px 0" }}>• Maintain your generator</p>
                <p style={{ margin: 0 }}>• Consider solar supplements</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/propane-generator-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
          <p style={{ fontSize: "0.75rem", color: "#2563EB", textAlign: "center", margin: 0 }}>
            ⛽ <strong>Disclaimer:</strong> These calculations are estimates based on typical propane generator efficiency. 
            Actual fuel consumption varies by brand, model, temperature, altitude, and maintenance condition. 
            Always consult your generator&apos;s manual for specific fuel consumption rates.
          </p>
        </div>
      </div>
    </div>
  );
}