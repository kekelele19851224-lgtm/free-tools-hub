"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Common tire sizes with diameters
const COMMON_TIRES = [
  { label: "225/60R16", diameter: 26.6 },
  { label: "235/70R16", diameter: 29.0 },
  { label: "245/75R16", diameter: 30.5 },
  { label: "265/70R17", diameter: 31.6 },
  { label: "275/60R20", diameter: 33.0 },
  { label: "285/70R17", diameter: 32.7 },
  { label: "305/70R16", diameter: 32.8 },
  { label: "315/70R17", diameter: 34.4 },
  { label: "33x12.50R15", diameter: 33.0 },
  { label: "35x12.50R17", diameter: 35.0 },
  { label: "37x12.50R17", diameter: 37.0 },
];

// Common axle ratios
const COMMON_RATIOS = [
  { ratio: 2.73, use: "Highway/Economy" },
  { ratio: 3.08, use: "Highway/Economy" },
  { ratio: 3.23, use: "Balanced" },
  { ratio: 3.42, use: "Balanced" },
  { ratio: 3.55, use: "Balanced" },
  { ratio: 3.73, use: "Performance/Towing" },
  { ratio: 4.10, use: "Performance/Towing" },
  { ratio: 4.30, use: "Off-road/Heavy Towing" },
  { ratio: 4.56, use: "Off-road/Heavy Towing" },
  { ratio: 4.88, use: "Off-road/Rock Crawling" },
];

// RPM at 65 MPH reference chart
const RPM_CHART = [
  { ratio: 3.08, tire28: 2400, tire30: 2240, tire32: 2100, tire35: 1920 },
  { ratio: 3.42, tire28: 2666, tire30: 2489, tire32: 2334, tire35: 2133 },
  { ratio: 3.73, tire28: 2908, tire30: 2714, tire32: 2545, tire35: 2327 },
  { ratio: 4.10, tire28: 3196, tire30: 2983, tire32: 2798, tire35: 2558 },
  { ratio: 4.56, tire28: 3555, tire30: 3318, tire32: 3111, tire35: 2844 },
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate gear ratio from RPM and speed?",
    answer: "Use the formula: Gear Ratio = (RPM × Tire Diameter) / (MPH × 336 × Trans Ratio). For example, if your engine runs at 2,500 RPM at 65 MPH with 30\" tires and 1:1 trans ratio: Gear Ratio = (2500 × 30) / (65 × 336 × 1) = 3.43. This tells you your axle ratio is approximately 3.42:1."
  },
  {
    question: "What RPM should I be at 70 mph?",
    answer: "Ideal RPM at 70 mph depends on your vehicle and driving style. For fuel economy, aim for 1,800-2,200 RPM. For balanced performance, 2,200-2,600 RPM is common. Most modern vehicles with overdrive transmissions run between 2,000-2,500 RPM at highway speeds. Higher RPM means more power available but lower fuel economy."
  },
  {
    question: "How does tire size affect gear ratio?",
    answer: "Larger tires effectively lower your gear ratio (like having taller gears), reducing RPM at a given speed but also reducing acceleration and power. Smaller tires raise effective gear ratio, increasing RPM. For example, going from 30\" to 33\" tires with 3.73 gears gives you an effective ratio of 3.39:1—a 9% change that affects speedometer accuracy and performance."
  },
  {
    question: "What gear ratio is best for 35 inch tires?",
    answer: "For 35\" tires, most enthusiasts recommend 4.10-4.56 gears depending on use. For daily driving with occasional off-road, 4.10 gears provide good balance. For primarily off-road or heavy towing, 4.56 gears restore power lost from larger tires. If you had 3.73 gears with stock 30\" tires, you'd need approximately 4.31 gears to maintain the same effective ratio with 35\" tires."
  },
  {
    question: "How do I calculate tire diameter from tire size?",
    answer: "For metric tire sizes (e.g., 275/60R17): Diameter = Rim Size + (Section Width × Aspect Ratio × 2 / 25.4). Example: 275/60R17 = 17 + (275 × 0.60 × 2 / 25.4) = 17 + 13 = 30 inches. For flotation sizes (e.g., 35x12.50R17), the first number is the diameter in inches."
  },
  {
    question: "Will changing tire size affect my speedometer?",
    answer: "Yes. Larger tires cause your speedometer to read slower than actual speed, while smaller tires cause it to read faster. The error percentage equals the percentage change in tire diameter. For example, going from 30\" to 33\" tires (10% increase) means when your speedometer shows 60 mph, you're actually going 66 mph."
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

export default function TireGearRatioCalculator() {
  // Main calculator
  const [tireDiameter, setTireDiameter] = useState<string>("30");
  const [axleRatio, setAxleRatio] = useState<string>("3.73");
  const [transRatio, setTransRatio] = useState<string>("1.00");
  const [mph, setMph] = useState<string>("65");
  const [rpm, setRpm] = useState<string>("2500");
  const [calcMode, setCalcMode] = useState<"rpm" | "mph" | "ratio">("rpm");

  // Tire comparison
  const [oldTireDiameter, setOldTireDiameter] = useState<string>("30");
  const [newTireDiameter, setNewTireDiameter] = useState<string>("33");
  const [originalRatio, setOriginalRatio] = useState<string>("3.73");

  // Main calculation results
  const mainResults = useMemo(() => {
    const tire = parseFloat(tireDiameter) || 30;
    const axle = parseFloat(axleRatio) || 3.73;
    const trans = parseFloat(transRatio) || 1;
    const speed = parseFloat(mph) || 65;
    const revs = parseFloat(rpm) || 2500;

    let calculatedRPM = 0;
    let calculatedMPH = 0;
    let calculatedRatio = 0;

    if (calcMode === "rpm") {
      // Calculate RPM from MPH
      calculatedRPM = (speed * axle * trans * 336) / tire;
      calculatedMPH = speed;
      calculatedRatio = axle;
    } else if (calcMode === "mph") {
      // Calculate MPH from RPM
      calculatedMPH = (revs * tire) / (axle * trans * 336);
      calculatedRPM = revs;
      calculatedRatio = axle;
    } else {
      // Calculate Ratio from RPM and MPH
      calculatedRatio = (revs * tire) / (speed * trans * 336);
      calculatedRPM = revs;
      calculatedMPH = speed;
    }

    return {
      rpm: calculatedRPM.toFixed(0),
      mph: calculatedMPH.toFixed(1),
      ratio: calculatedRatio.toFixed(2)
    };
  }, [tireDiameter, axleRatio, transRatio, mph, rpm, calcMode]);

  // Tire comparison results
  const comparisonResults = useMemo(() => {
    const oldTire = parseFloat(oldTireDiameter) || 30;
    const newTire = parseFloat(newTireDiameter) || 33;
    const origRatio = parseFloat(originalRatio) || 3.73;

    // Effective gear ratio with new tires
    const effectiveRatio = origRatio * (oldTire / newTire);
    
    // Speedometer error
    const speedoError = ((newTire - oldTire) / oldTire) * 100;
    
    // Actual speed when speedo shows 60
    const actualSpeedAt60 = 60 * (newTire / oldTire);
    
    // Recommended new ratio to match original feel
    const recommendedRatio = origRatio * (newTire / oldTire);

    // RPM change at 65 MPH
    const oldRPM = (65 * origRatio * 336) / oldTire;
    const newRPM = (65 * origRatio * 336) / newTire;
    const rpmChange = newRPM - oldRPM;

    return {
      effectiveRatio: effectiveRatio.toFixed(2),
      speedoError: speedoError.toFixed(1),
      actualSpeedAt60: actualSpeedAt60.toFixed(1),
      recommendedRatio: recommendedRatio.toFixed(2),
      oldRPM: oldRPM.toFixed(0),
      newRPM: newRPM.toFixed(0),
      rpmChange: rpmChange.toFixed(0),
      tireSizeChange: ((newTire - oldTire) / oldTire * 100).toFixed(1)
    };
  }, [oldTireDiameter, newTireDiameter, originalRatio]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Tire Gear Ratio Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚗</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Tire Gear Ratio Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate engine RPM, vehicle speed, or gear ratio. Compare tire sizes to see how changes affect your speedometer, effective gear ratio, and performance.
          </p>
        </div>

        {/* Quick Formula Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>📐</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>The Formula</p>
              <p style={{ color: "#92400E", margin: 0, fontSize: "0.95rem", fontFamily: "monospace" }}>
                RPM = (MPH × Axle Ratio × Trans Ratio × 336) / Tire Diameter
              </p>
            </div>
          </div>
        </div>

        {/* Main Calculator */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          marginBottom: "40px",
          overflow: "hidden"
        }}>
          <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🧮 RPM / Speed / Gear Ratio Calculator</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Calculation Mode */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    What do you want to calculate?
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { value: "rpm", label: "Calculate RPM" },
                      { value: "mph", label: "Calculate Speed" },
                      { value: "ratio", label: "Calculate Ratio" }
                    ].map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setCalcMode(mode.value as "rpm" | "mph" | "ratio")}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: calcMode === mode.value ? "2px solid #DC2626" : "1px solid #D1D5DB",
                          backgroundColor: calcMode === mode.value ? "#FEE2E2" : "white",
                          color: calcMode === mode.value ? "#DC2626" : "#374151",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.9rem"
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tire Diameter */}
                <div style={{ backgroundColor: "#FEE2E2", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🛞 Tire Diameter
                  </h3>
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Tire Diameter (inches)
                    </label>
                    <input
                      type="number"
                      value={tireDiameter}
                      onChange={(e) => setTireDiameter(e.target.value)}
                      style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                      step="0.1"
                    />
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["28", "30", "32", "33", "35", "37"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setTireDiameter(size)}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: tireDiameter === size ? "2px solid #DC2626" : "1px solid #D1D5DB",
                          backgroundColor: tireDiameter === size ? "#FEE2E2" : "white",
                          color: tireDiameter === size ? "#DC2626" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        {size}&quot;
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gear Ratios */}
                <div style={{ backgroundColor: "#DBEAFE", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    ⚙️ Gear Ratios
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Axle Ratio {calcMode === "ratio" && "(Calculating)"}
                      </label>
                      <input
                        type="number"
                        value={axleRatio}
                        onChange={(e) => setAxleRatio(e.target.value)}
                        disabled={calcMode === "ratio"}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          border: "1px solid #D1D5DB", 
                          borderRadius: "8px", 
                          fontSize: "1rem",
                          backgroundColor: calcMode === "ratio" ? "#F3F4F6" : "white"
                        }}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Trans Ratio
                      </label>
                      <input
                        type="number"
                        value={transRatio}
                        onChange={(e) => setTransRatio(e.target.value)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                        step="0.01"
                      />
                    </div>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#1E40AF", marginTop: "8px", marginBottom: "0" }}>
                    Trans ratio: 1.00 for direct drive, 0.70-0.75 for overdrive
                  </p>
                </div>

                {/* Speed / RPM Input */}
                <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🏎️ Speed & RPM
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Speed (MPH) {calcMode === "mph" && "(Calculating)"}
                      </label>
                      <input
                        type="number"
                        value={mph}
                        onChange={(e) => setMph(e.target.value)}
                        disabled={calcMode === "mph"}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          border: "1px solid #D1D5DB", 
                          borderRadius: "8px", 
                          fontSize: "1rem",
                          backgroundColor: calcMode === "mph" ? "#F3F4F6" : "white"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Engine RPM {calcMode === "rpm" && "(Calculating)"}
                      </label>
                      <input
                        type="number"
                        value={rpm}
                        onChange={(e) => setRpm(e.target.value)}
                        disabled={calcMode === "rpm"}
                        style={{ 
                          width: "100%", 
                          padding: "12px", 
                          border: "1px solid #D1D5DB", 
                          borderRadius: "8px", 
                          fontSize: "1rem",
                          backgroundColor: calcMode === "rpm" ? "#F3F4F6" : "white"
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ backgroundColor: "#DC2626", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    {calcMode === "rpm" ? "Engine RPM" : calcMode === "mph" ? "Vehicle Speed" : "Axle Gear Ratio"}
                  </p>
                  <p style={{ fontSize: "3rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>
                    {calcMode === "rpm" ? mainResults.rpm : calcMode === "mph" ? `${mainResults.mph} mph` : `${mainResults.ratio}:1`}
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {tireDiameter}&quot; tires • {axleRatio}:1 axle • {transRatio}:1 trans
                  </p>
                </div>

                {/* All Results */}
                <div style={{ backgroundColor: "#FEF2F2", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Complete Results</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Engine RPM</span>
                      <span style={{ fontWeight: "600", color: calcMode === "rpm" ? "#DC2626" : "#374151" }}>{mainResults.rpm} RPM</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Vehicle Speed</span>
                      <span style={{ fontWeight: "600", color: calcMode === "mph" ? "#DC2626" : "#374151" }}>{mainResults.mph} MPH</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Axle Gear Ratio</span>
                      <span style={{ fontWeight: "600", color: calcMode === "ratio" ? "#DC2626" : "#374151" }}>{mainResults.ratio}:1</span>
                    </div>
                  </div>
                </div>

                {/* Quick Reference */}
                <div style={{ padding: "16px", backgroundColor: "#EDE9FE", borderRadius: "8px", border: "1px solid #C4B5FD" }}>
                  <p style={{ fontSize: "0.85rem", color: "#6D28D9", margin: 0 }}>
                    💡 <strong>Tip:</strong> Lower axle ratio (2.73) = better fuel economy, higher ratio (4.10+) = better acceleration & towing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tire Size Comparison */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          marginBottom: "40px",
          overflow: "hidden"
        }}>
          <div style={{ backgroundColor: "#7C3AED", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🔄 Tire Size Change Comparison</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Comparison Inputs */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px" }}>
                    <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px" }}>📏 Old Tire</h4>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Diameter (inches)</label>
                    <input
                      type="number"
                      value={oldTireDiameter}
                      onChange={(e) => setOldTireDiameter(e.target.value)}
                      style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      step="0.1"
                    />
                  </div>
                  <div style={{ backgroundColor: "#EDE9FE", padding: "20px", borderRadius: "12px" }}>
                    <h4 style={{ fontWeight: "600", color: "#7C3AED", marginBottom: "12px" }}>📏 New Tire</h4>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px" }}>Diameter (inches)</label>
                    <input
                      type="number"
                      value={newTireDiameter}
                      onChange={(e) => setNewTireDiameter(e.target.value)}
                      style={{ width: "100%", padding: "10px", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "1rem" }}
                      step="0.1"
                    />
                  </div>
                </div>

                <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                    Current Axle Ratio
                  </label>
                  <input
                    type="number"
                    value={originalRatio}
                    onChange={(e) => setOriginalRatio(e.target.value)}
                    style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1rem" }}
                    step="0.01"
                  />
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                    {["3.08", "3.42", "3.55", "3.73", "4.10", "4.56"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setOriginalRatio(ratio)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: originalRatio === ratio ? "2px solid #1E40AF" : "1px solid #D1D5DB",
                          backgroundColor: originalRatio === ratio ? "#DBEAFE" : "white",
                          color: originalRatio === ratio ? "#1E40AF" : "#374151",
                          cursor: "pointer",
                          fontSize: "0.8rem"
                        }}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comparison Results */}
              <div>
                <div style={{ backgroundColor: "#7C3AED", padding: "20px", borderRadius: "12px", color: "white", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", marginBottom: "12px", fontSize: "1rem" }}>📊 Effects of Tire Change</h4>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}>
                      <span>Tire Size Change</span>
                      <span style={{ fontWeight: "600" }}>{parseFloat(comparisonResults.tireSizeChange) >= 0 ? "+" : ""}{comparisonResults.tireSizeChange}%</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}>
                      <span>Effective Gear Ratio</span>
                      <span style={{ fontWeight: "600" }}>{comparisonResults.effectiveRatio}:1</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}>
                      <span>Speedometer Error</span>
                      <span style={{ fontWeight: "600" }}>{parseFloat(comparisonResults.speedoError) >= 0 ? "+" : ""}{comparisonResults.speedoError}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>When speedometer shows 60 MPH:</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#7C3AED", margin: 0 }}>Actual: {comparisonResults.actualSpeedAt60} MPH</p>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                      <p style={{ fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>RPM at 65 MPH:</p>
                      <p style={{ fontSize: "1rem", color: "#374151", margin: 0 }}>
                        <span style={{ textDecoration: "line-through", color: "#9CA3AF" }}>{comparisonResults.oldRPM}</span> → <span style={{ fontWeight: "700", color: "#7C3AED" }}>{comparisonResults.newRPM}</span> <span style={{ fontSize: "0.85rem", color: parseFloat(comparisonResults.rpmChange) < 0 ? "#059669" : "#DC2626" }}>({parseFloat(comparisonResults.rpmChange) >= 0 ? "+" : ""}{comparisonResults.rpmChange})</span>
                      </p>
                    </div>
                    <div style={{ padding: "12px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                      <p style={{ fontSize: "0.8rem", color: "#92400E", marginBottom: "4px" }}>Recommended new ratio to match original feel:</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#D97706", margin: 0 }}>{comparisonResults.recommendedRatio}:1</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RPM at 65 MPH Chart */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📋 RPM at 65 MPH Chart</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Engine RPM at 65 MPH with 1:1 transmission ratio</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEE2E2" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Axle Ratio</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>28&quot; Tire</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>30&quot; Tire</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>32&quot; Tire</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>35&quot; Tire</th>
                </tr>
              </thead>
              <tbody>
                {RPM_CHART.map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{row.ratio}:1</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.tire28.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.tire30.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.tire32.toLocaleString()}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.tire35.toLocaleString()}</td>
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
            {/* Common Axle Ratios */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>⚙️ Common Axle Gear Ratios</h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#DBEAFE" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Ratio</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Best Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMMON_RATIOS.map((item, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>{item.ratio}:1</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB" }}>{item.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tire Diameter Formula */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📐 How to Calculate Tire Diameter</h2>
              <div style={{ padding: "20px", backgroundColor: "#FEF3C7", borderRadius: "12px", marginBottom: "16px" }}>
                <h4 style={{ fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>Metric Tires (e.g., 275/60R17)</h4>
                <p style={{ fontFamily: "monospace", color: "#374151", margin: "0 0 8px 0", fontSize: "0.95rem" }}>
                  Diameter = Rim + (Width × Aspect ÷ 25.4 × 2)
                </p>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                  Example: 275/60R17 = 17 + (275 × 0.60 ÷ 25.4 × 2) = <strong>30.0&quot;</strong>
                </p>
              </div>
              <div style={{ padding: "20px", backgroundColor: "#ECFDF5", borderRadius: "12px" }}>
                <h4 style={{ fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>Flotation Tires (e.g., 35x12.50R17)</h4>
                <p style={{ fontSize: "0.9rem", color: "#374151", margin: 0 }}>
                  The first number IS the diameter in inches. Example: <strong>35</strong>x12.50R17 = <strong>35&quot;</strong> diameter
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Common Tire Sizes */}
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#DC2626", marginBottom: "12px" }}>🛞 Common Tire Sizes</h3>
              <div style={{ fontSize: "0.8rem", color: "#991B1B" }}>
                {COMMON_TIRES.slice(0, 8).map((tire, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: idx < 7 ? "1px solid #FECACA" : "none" }}>
                    <span>{tire.label}</span>
                    <span style={{ fontWeight: "600" }}>{tire.diameter}&quot;</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 336 Constant */}
            <div style={{ backgroundColor: "#DBEAFE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "12px" }}>📚 Why 336?</h3>
              <p style={{ fontSize: "0.85rem", color: "#1E40AF", margin: 0 }}>
                336 is a simplified constant from: 60 min/hr × π × (1 mile / 63,360 inches). It converts rotational speed to linear speed.
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/tire-gear-ratio-calculator" currentCategory="Auto" />
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
            🚗 <strong>Disclaimer:</strong> This calculator provides estimates for general guidance. Actual results may vary due to tire wear, load, drivetrain loss, and measurement variations. Always verify with actual measurements for critical applications.
          </p>
        </div>
      </div>
    </div>
  );
}