"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Pool size presets
const poolSizes = [
  { name: "Custom", gallons: 0 },
  { name: "Hot Tub / Spa (500 gal)", gallons: 500 },
  { name: "Small Above Ground (5,000 gal)", gallons: 5000 },
  { name: "Medium Above Ground (10,000 gal)", gallons: 10000 },
  { name: "Large Above Ground (15,000 gal)", gallons: 15000 },
  { name: "Small Inground (15,000 gal)", gallons: 15000 },
  { name: "Average Inground (20,000 gal)", gallons: 20000 },
  { name: "Large Inground (30,000 gal)", gallons: 30000 },
  { name: "Olympic Pool (660,000 gal)", gallons: 660000 },
];

// FAQ data
const faqs = [
  {
    question: "What is a good alkalinity level for a pool?",
    answer: "The ideal total alkalinity (TA) for a swimming pool is 80-120 ppm (parts per million). For hot tubs and spas, aim for 100-150 ppm. Alkalinity outside this range can cause pH instability, leading to corrosion, scaling, cloudy water, and skin/eye irritation."
  },
  {
    question: "Should I correct alkalinity or pH first?",
    answer: "Always correct alkalinity first, then pH. Total alkalinity acts as a buffer that stabilizes pH levels. If you try to adjust pH without proper alkalinity, the pH will bounce around and be difficult to maintain. Once alkalinity is in range, pH adjustments become much easier and more stable."
  },
  {
    question: "How much baking soda to add to a 10,000 gallon pool?",
    answer: "To raise alkalinity by 10 ppm in a 10,000-gallon pool, add approximately 1.5 pounds (24 oz) of baking soda (sodium bicarbonate). For example, to raise alkalinity from 60 ppm to 100 ppm (40 ppm increase), you would need about 6 pounds of baking soda."
  },
  {
    question: "Will shocking a pool lower alkalinity?",
    answer: "Shocking your pool typically does not significantly lower alkalinity. However, some shock treatments contain acids that may slightly reduce both pH and alkalinity. Calcium hypochlorite shock can actually raise pH slightly. Always test your water after shocking to verify levels."
  },
  {
    question: "How long after adding baking soda can I swim?",
    answer: "You can typically swim 20-30 minutes after adding baking soda, once it has fully dissolved and circulated. Run your pump during this time to ensure even distribution. However, it's best to wait until you've retested the water and confirmed the alkalinity is within the safe range."
  },
  {
    question: "Can I use baking soda instead of alkalinity increaser?",
    answer: "Yes! Baking soda (sodium bicarbonate) is the main active ingredient in most commercial alkalinity increasers. Using pure baking soda from the grocery store is often more economical. Just make sure it's 100% sodium bicarbonate with no added ingredients."
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

export default function PoolAlkalinityCalculator() {
  const [activeTab, setActiveTab] = useState<'raise' | 'lower' | 'guide'>('raise');

  // Tab 1: Raise Alkalinity
  const [raiseVolume, setRaiseVolume] = useState<string>("10000");
  const [raiseUnit, setRaiseUnit] = useState<'gallons' | 'liters'>('gallons');
  const [raiseCurrent, setRaiseCurrent] = useState<string>("60");
  const [raiseTarget, setRaiseTarget] = useState<string>("100");
  const [raisePreset, setRaisePreset] = useState<string>("Medium Above Ground (10,000 gal)");

  // Tab 2: Lower Alkalinity
  const [lowerVolume, setLowerVolume] = useState<string>("10000");
  const [lowerUnit, setLowerUnit] = useState<'gallons' | 'liters'>('gallons');
  const [lowerCurrent, setLowerCurrent] = useState<string>("180");
  const [lowerTarget, setLowerTarget] = useState<string>("100");
  const [lowerPreset, setLowerPreset] = useState<string>("Medium Above Ground (10,000 gal)");

  // Handle preset selection for Raise
  const handleRaisePreset = (presetName: string) => {
    setRaisePreset(presetName);
    const preset = poolSizes.find(p => p.name === presetName);
    if (preset && presetName !== "Custom") {
      if (raiseUnit === 'gallons') {
        setRaiseVolume(preset.gallons.toString());
      } else {
        setRaiseVolume(Math.round(preset.gallons * 3.78541).toString());
      }
    }
  };

  // Handle preset selection for Lower
  const handleLowerPreset = (presetName: string) => {
    setLowerPreset(presetName);
    const preset = poolSizes.find(p => p.name === presetName);
    if (preset && presetName !== "Custom") {
      if (lowerUnit === 'gallons') {
        setLowerVolume(preset.gallons.toString());
      } else {
        setLowerVolume(Math.round(preset.gallons * 3.78541).toString());
      }
    }
  };

  // Tab 1 Calculations - Raise Alkalinity
  const raiseResults = useMemo(() => {
    let volumeGallons = parseFloat(raiseVolume) || 0;
    if (raiseUnit === 'liters') {
      volumeGallons = volumeGallons / 3.78541;
    }
    
    const current = parseFloat(raiseCurrent) || 0;
    const target = parseFloat(raiseTarget) || 0;
    const increase = target - current;

    if (volumeGallons <= 0 || increase <= 0) {
      return { bakingSodaLbs: 0, bakingSodaOz: 0, bakingSodaKg: 0, bakingSodaG: 0, increase: 0, isValid: false };
    }

    // 1.5 lbs of baking soda per 10,000 gallons raises TA by 10 ppm
    const bakingSodaLbs = (increase / 10) * (volumeGallons / 10000) * 1.5;
    const bakingSodaOz = bakingSodaLbs * 16;
    const bakingSodaKg = bakingSodaLbs * 0.453592;
    const bakingSodaG = bakingSodaKg * 1000;

    return {
      bakingSodaLbs: Math.round(bakingSodaLbs * 100) / 100,
      bakingSodaOz: Math.round(bakingSodaOz * 10) / 10,
      bakingSodaKg: Math.round(bakingSodaKg * 100) / 100,
      bakingSodaG: Math.round(bakingSodaG),
      increase,
      isValid: true
    };
  }, [raiseVolume, raiseUnit, raiseCurrent, raiseTarget]);

  // Tab 2 Calculations - Lower Alkalinity
  const lowerResults = useMemo(() => {
    let volumeGallons = parseFloat(lowerVolume) || 0;
    if (lowerUnit === 'liters') {
      volumeGallons = volumeGallons / 3.78541;
    }
    
    const current = parseFloat(lowerCurrent) || 0;
    const target = parseFloat(lowerTarget) || 0;
    const decrease = current - target;

    if (volumeGallons <= 0 || decrease <= 0) {
      return { acidOz: 0, acidCups: 0, acidMl: 0, acidL: 0, decrease: 0, isValid: false };
    }

    // 26 oz of muriatic acid per 10,000 gallons lowers TA by 10 ppm
    const acidOz = (decrease / 10) * (volumeGallons / 10000) * 26;
    const acidCups = acidOz / 8;
    const acidMl = acidOz * 29.5735;
    const acidL = acidMl / 1000;

    return {
      acidOz: Math.round(acidOz * 10) / 10,
      acidCups: Math.round(acidCups * 10) / 10,
      acidMl: Math.round(acidMl),
      acidL: Math.round(acidL * 100) / 100,
      decrease,
      isValid: true
    };
  }, [lowerVolume, lowerUnit, lowerCurrent, lowerTarget]);

  // Get alkalinity status color
  const getAlkalinityStatus = (ppm: number) => {
    if (ppm < 60) return { color: "#DC2626", label: "Too Low", bg: "#FEE2E2" };
    if (ppm < 80) return { color: "#D97706", label: "Low", bg: "#FEF3C7" };
    if (ppm <= 120) return { color: "#059669", label: "Ideal", bg: "#DCFCE7" };
    if (ppm <= 150) return { color: "#D97706", label: "High", bg: "#FEF3C7" };
    return { color: "#DC2626", label: "Too High", bg: "#FEE2E2" };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Pool Alkalinity Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏊</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Pool Alkalinity Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate how much baking soda to raise or muriatic acid to lower your pool&apos;s total alkalinity. 
            Works for swimming pools, above ground pools, hot tubs, and spas.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#DBEAFE",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #93C5FD"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>
                <strong>Ideal Alkalinity:</strong> 80-120 ppm for pools, 100-150 ppm for hot tubs
              </p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Always adjust alkalinity first, then pH. Alkalinity stabilizes pH and prevents wild swings.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("raise")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "raise" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "raise" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔺 Raise Alkalinity
          </button>
          <button
            onClick={() => setActiveTab("lower")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "lower" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "lower" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔻 Lower Alkalinity
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "guide" ? "#2563EB" : "#E5E7EB",
              color: activeTab === "guide" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📊 Alkalinity Guide
          </button>
        </div>

        {/* Tab 1: Raise Alkalinity */}
        {activeTab === 'raise' && (
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
                  🔺 Raise Alkalinity
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Unit Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Volume Unit
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(['gallons', 'liters'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setRaiseUnit(u)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: raiseUnit === u ? "2px solid #2563EB" : "1px solid #D1D5DB",
                          backgroundColor: raiseUnit === u ? "#DBEAFE" : "white",
                          cursor: "pointer",
                          fontWeight: raiseUnit === u ? "600" : "400",
                          color: raiseUnit === u ? "#2563EB" : "#374151",
                          textTransform: "capitalize"
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pool Size Preset */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Pool Size (Quick Select)
                  </label>
                  <select
                    value={raisePreset}
                    onChange={(e) => handleRaisePreset(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    {poolSizes.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Pool Volume */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Pool Volume ({raiseUnit})
                  </label>
                  <input
                    type="number"
                    value={raiseVolume}
                    onChange={(e) => { setRaiseVolume(e.target.value); setRaisePreset("Custom"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="10000"
                  />
                </div>

                {/* Current & Target Alkalinity */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Current (ppm)
                    </label>
                    <input
                      type="number"
                      value={raiseCurrent}
                      onChange={(e) => setRaiseCurrent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="60"
                    />
                    <span style={{
                      display: "inline-block",
                      marginTop: "4px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      backgroundColor: getAlkalinityStatus(parseFloat(raiseCurrent) || 0).bg,
                      color: getAlkalinityStatus(parseFloat(raiseCurrent) || 0).color
                    }}>
                      {getAlkalinityStatus(parseFloat(raiseCurrent) || 0).label}
                    </span>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Target (ppm)
                    </label>
                    <input
                      type="number"
                      value={raiseTarget}
                      onChange={(e) => setRaiseTarget(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="100"
                    />
                    <span style={{
                      display: "inline-block",
                      marginTop: "4px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      backgroundColor: getAlkalinityStatus(parseFloat(raiseTarget) || 0).bg,
                      color: getAlkalinityStatus(parseFloat(raiseTarget) || 0).color
                    }}>
                      {getAlkalinityStatus(parseFloat(raiseTarget) || 0).label}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: "#DBEAFE",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF" }}>
                    💡 <strong>Tip:</strong> Add baking soda gradually. Wait 4-6 hours and retest before adding more.
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
              <div style={{ backgroundColor: "#1D4ED8", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Baking Soda Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {!raiseResults.isValid ? (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "32px 20px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <span style={{ fontSize: "2.5rem" }}>⚠️</span>
                    <p style={{ margin: "12px 0 0 0", color: "#92400E", fontWeight: "500" }}>
                      {parseFloat(raiseTarget) <= parseFloat(raiseCurrent) 
                        ? "Target must be higher than current alkalinity" 
                        : "Enter valid values to calculate"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#DBEAFE",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #2563EB"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#1E40AF" }}>
                        Add Baking Soda (Sodium Bicarbonate)
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#2563EB" }}>
                        {raiseResults.bakingSodaLbs} lbs
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "#1D4ED8" }}>
                        ({raiseResults.bakingSodaOz} oz)
                      </p>
                    </div>

                    {/* Metric Conversion */}
                    <div style={{
                      backgroundColor: "#F0FDF4",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "1px solid #86EFAC"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>
                        Metric Equivalent
                      </p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                        {raiseResults.bakingSodaKg} kg ({raiseResults.bakingSodaG} g)
                      </p>
                    </div>

                    {/* Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Alkalinity Increase</span>
                        <span style={{ fontWeight: "600", color: "#059669" }}>+{raiseResults.increase} ppm</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>From → To</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{raiseCurrent} → {raiseTarget} ppm</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Pool Volume</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{parseInt(raiseVolume).toLocaleString()} {raiseUnit}</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div style={{
                      marginTop: "16px",
                      padding: "16px",
                      backgroundColor: "#EFF6FF",
                      borderRadius: "8px",
                      border: "1px solid #BFDBFE"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#1E40AF", fontWeight: "600", marginBottom: "8px" }}>
                        📋 How to Add:
                      </p>
                      <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#1D4ED8", lineHeight: "1.8" }}>
                        <li>Turn on pool pump for circulation</li>
                        <li>Broadcast baking soda across pool surface</li>
                        <li>Wait 4-6 hours before retesting</li>
                        <li>Repeat if needed (don&apos;t add all at once)</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lower Alkalinity */}
        {activeTab === 'lower' && (
          <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            {/* Input Panel */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              overflow: "hidden"
            }}>
              <div style={{ backgroundColor: "#DC2626", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  🔻 Lower Alkalinity
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Safety Warning */}
                <div style={{
                  backgroundColor: "#FEE2E2",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B", fontWeight: "600" }}>
                    ⚠️ <strong>Safety First!</strong> Muriatic acid is dangerous. Always wear:
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#DC2626" }}>
                    🥽 Goggles • 🧤 Gloves • 😷 Mask • Work in ventilated area
                  </p>
                </div>

                {/* Unit Toggle */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Volume Unit
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(['gallons', 'liters'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setLowerUnit(u)}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: "6px",
                          border: lowerUnit === u ? "2px solid #DC2626" : "1px solid #D1D5DB",
                          backgroundColor: lowerUnit === u ? "#FEE2E2" : "white",
                          cursor: "pointer",
                          fontWeight: lowerUnit === u ? "600" : "400",
                          color: lowerUnit === u ? "#DC2626" : "#374151",
                          textTransform: "capitalize"
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pool Size Preset */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Pool Size (Quick Select)
                  </label>
                  <select
                    value={lowerPreset}
                    onChange={(e) => handleLowerPreset(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    {poolSizes.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Pool Volume */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    Pool Volume ({lowerUnit})
                  </label>
                  <input
                    type="number"
                    value={lowerVolume}
                    onChange={(e) => { setLowerVolume(e.target.value); setLowerPreset("Custom"); }}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #D1D5DB",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                    placeholder="10000"
                  />
                </div>

                {/* Current & Target Alkalinity */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Current (ppm)
                    </label>
                    <input
                      type="number"
                      value={lowerCurrent}
                      onChange={(e) => setLowerCurrent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="180"
                    />
                    <span style={{
                      display: "inline-block",
                      marginTop: "4px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      backgroundColor: getAlkalinityStatus(parseFloat(lowerCurrent) || 0).bg,
                      color: getAlkalinityStatus(parseFloat(lowerCurrent) || 0).color
                    }}>
                      {getAlkalinityStatus(parseFloat(lowerCurrent) || 0).label}
                    </span>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Target (ppm)
                    </label>
                    <input
                      type="number"
                      value={lowerTarget}
                      onChange={(e) => setLowerTarget(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #D1D5DB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="100"
                    />
                    <span style={{
                      display: "inline-block",
                      marginTop: "4px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      backgroundColor: getAlkalinityStatus(parseFloat(lowerTarget) || 0).bg,
                      color: getAlkalinityStatus(parseFloat(lowerTarget) || 0).color
                    }}>
                      {getAlkalinityStatus(parseFloat(lowerTarget) || 0).label}
                    </span>
                  </div>
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
              <div style={{ backgroundColor: "#B91C1C", padding: "16px 24px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                  📊 Muriatic Acid Needed
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {!lowerResults.isValid ? (
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "32px 20px",
                    textAlign: "center",
                    border: "1px solid #FCD34D"
                  }}>
                    <span style={{ fontSize: "2.5rem" }}>⚠️</span>
                    <p style={{ margin: "12px 0 0 0", color: "#92400E", fontWeight: "500" }}>
                      {parseFloat(lowerTarget) >= parseFloat(lowerCurrent) 
                        ? "Target must be lower than current alkalinity" 
                        : "Enter valid values to calculate"}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Main Result */}
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "2px solid #DC2626"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#991B1B" }}>
                        Add Muriatic Acid (31.45% HCl)
                      </p>
                      <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: "#DC2626" }}>
                        {lowerResults.acidOz} oz
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1rem", color: "#B91C1C" }}>
                        ({lowerResults.acidCups} cups)
                      </p>
                    </div>

                    {/* Metric Conversion */}
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "12px",
                      padding: "16px",
                      textAlign: "center",
                      marginBottom: "20px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>
                        Metric Equivalent
                      </p>
                      <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#D97706" }}>
                        {lowerResults.acidMl} ml ({lowerResults.acidL} L)
                      </p>
                    </div>

                    {/* Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Alkalinity Decrease</span>
                        <span style={{ fontWeight: "600", color: "#DC2626" }}>-{lowerResults.decrease} ppm</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>From → To</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{lowerCurrent} → {lowerTarget} ppm</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                        <span style={{ color: "#4B5563" }}>Pool Volume</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>{parseInt(lowerVolume).toLocaleString()} {lowerUnit}</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div style={{
                      marginTop: "16px",
                      padding: "16px",
                      backgroundColor: "#FEF2F2",
                      borderRadius: "8px",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B", fontWeight: "600", marginBottom: "8px" }}>
                        📋 How to Add Safely:
                      </p>
                      <ol style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#DC2626", lineHeight: "1.8" }}>
                        <li>Turn OFF pool pump</li>
                        <li>Dilute acid in bucket of water (10:1 ratio)</li>
                        <li>Pour slowly into deep end</li>
                        <li>Wait 30 min, turn pump ON, circulate 6+ hours</li>
                        <li>Retest before adding more</li>
                      </ol>
                    </div>

                    {/* pH Warning */}
                    <div style={{
                      marginTop: "12px",
                      padding: "12px",
                      backgroundColor: "#FEF3C7",
                      borderRadius: "8px",
                      border: "1px solid #FCD34D"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                        ⚠️ <strong>Note:</strong> Muriatic acid will also lower pH. Retest both alkalinity AND pH after treatment.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Alkalinity Guide */}
        {activeTab === 'guide' && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>
              📊 Pool Alkalinity Reference Guide
            </h2>
            <p style={{ color: "#6B7280", marginBottom: "24px" }}>
              Understanding total alkalinity levels and how they affect your pool water chemistry.
            </p>

            {/* Alkalinity Range Chart */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Alkalinity Range Chart
              </h3>
              <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>
                <div style={{ flex: 1, padding: "12px", backgroundColor: "#FEE2E2", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#DC2626" }}>Too Low</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#991B1B" }}>&lt; 60 ppm</p>
                </div>
                <div style={{ flex: 1, padding: "12px", backgroundColor: "#FEF3C7", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#D97706" }}>Low</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#92400E" }}>60-79 ppm</p>
                </div>
                <div style={{ flex: 1.5, padding: "12px", backgroundColor: "#DCFCE7", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#059669" }}>✓ Ideal</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#166534" }}>80-120 ppm</p>
                </div>
                <div style={{ flex: 1, padding: "12px", backgroundColor: "#FEF3C7", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#D97706" }}>High</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#92400E" }}>121-150 ppm</p>
                </div>
                <div style={{ flex: 1, padding: "12px", backgroundColor: "#FEE2E2", textAlign: "center" }}>
                  <p style={{ margin: 0, fontWeight: "600", color: "#DC2626" }}>Too High</p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#991B1B" }}>&gt; 150 ppm</p>
                </div>
              </div>
            </div>

            {/* Problems Table */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Problems Caused by Improper Alkalinity
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Low Alkalinity (&lt;80 ppm)</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>High Alkalinity (&gt;120 ppm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>pH bounces wildly</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Cloudy water</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Corrosion of metal parts</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Scale buildup on surfaces</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Etching of plaster/concrete</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Clogged filters</td>
                    </tr>
                    <tr style={{ backgroundColor: "#F9FAFB" }}>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Green water (algae growth)</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Reduced chlorine effectiveness</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Eye and skin irritation</td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#DC2626" }}>Difficult to lower pH</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chemical Dosing Reference */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
                Chemical Dosing Quick Reference (per 10,000 gallons)
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ backgroundColor: "#DBEAFE", padding: "16px", borderRadius: "8px", border: "1px solid #93C5FD" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#1E40AF" }}>🔺 To Raise by 10 ppm:</p>
                  <p style={{ margin: 0, color: "#1D4ED8" }}>Add <strong>1.5 lbs</strong> (24 oz) baking soda</p>
                </div>
                <div style={{ backgroundColor: "#FEE2E2", padding: "16px", borderRadius: "8px", border: "1px solid #FECACA" }}>
                  <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#991B1B" }}>🔻 To Lower by 10 ppm:</p>
                  <p style={{ margin: 0, color: "#DC2626" }}>Add <strong>26 oz</strong> muriatic acid</p>
                </div>
              </div>
            </div>

            {/* pH Relationship */}
            <div style={{
              backgroundColor: "#F0FDF4",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #86EFAC"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#166534", marginTop: 0, marginBottom: "12px" }}>
                📚 Alkalinity & pH Relationship
              </h3>
              <p style={{ margin: "0 0 12px 0", color: "#15803D", lineHeight: "1.7" }}>
                Alkalinity and pH are closely related but different measurements:
              </p>
              <ul style={{ margin: 0, paddingLeft: "20px", color: "#047857", lineHeight: "1.8" }}>
                <li><strong>pH</strong> measures how acidic or basic the water is (scale 0-14)</li>
                <li><strong>Alkalinity</strong> measures the water&apos;s ability to resist pH changes</li>
                <li>Low alkalinity = pH will bounce around unpredictably</li>
                <li>Proper alkalinity = pH stays stable and easier to adjust</li>
                <li><strong>Always adjust alkalinity FIRST</strong>, then fine-tune pH</li>
              </ul>
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏊 Understanding Pool Total Alkalinity</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Total Alkalinity (TA)</strong> is one of the most important measurements for pool water chemistry. 
                  It acts as a buffer that prevents rapid pH fluctuations, which can damage your pool and make the water 
                  uncomfortable for swimmers.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Alkalinity Matters</h3>
                <p>
                  Think of alkalinity as your pool&apos;s &quot;shock absorber&quot; for pH. Without proper alkalinity levels, your pH 
                  can swing wildly from high to low with even small changes—like adding a little chlorine, having swimmers 
                  in the pool, or getting some rain. This is called &quot;pH bounce&quot; and it causes major problems.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How to Test Alkalinity</h3>
                <div style={{
                  backgroundColor: "#DBEAFE",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #93C5FD"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#1E40AF" }}>Testing Options:</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", color: "#1D4ED8" }}>
                    <li style={{ marginBottom: "8px" }}><strong>Test strips</strong> - Quick and easy, good for regular checks</li>
                    <li style={{ marginBottom: "8px" }}><strong>Liquid test kit</strong> - More accurate, uses titration</li>
                    <li style={{ marginBottom: "8px" }}><strong>Digital tester</strong> - Most accurate, higher cost</li>
                    <li><strong>Pool store test</strong> - Free at most pool supply stores</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Adjusting Alkalinity Step-by-Step</h3>
                <p><strong>To raise alkalinity:</strong></p>
                <ol style={{ paddingLeft: "20px" }}>
                  <li>Calculate the amount of baking soda needed using our calculator</li>
                  <li>Turn on your pool pump for circulation</li>
                  <li>Broadcast the baking soda evenly across the pool surface</li>
                  <li>Wait 4-6 hours before retesting</li>
                  <li>Repeat if needed (don&apos;t add all at once for large adjustments)</li>
                </ol>

                <p><strong>To lower alkalinity:</strong></p>
                <ol style={{ paddingLeft: "20px" }}>
                  <li>Calculate the muriatic acid needed using our calculator</li>
                  <li>Put on safety gear (goggles, gloves, mask)</li>
                  <li>Turn OFF the pump</li>
                  <li>Dilute acid in a bucket of water (10:1 ratio - water first!)</li>
                  <li>Pour slowly into the deep end of the pool</li>
                  <li>Wait 30 minutes, then turn pump on and circulate 6+ hours</li>
                  <li>Retest before adding more</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Reference */}
            <div style={{ backgroundColor: "#DBEAFE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #93C5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>📋 Quick Reference</h3>
              <div style={{ fontSize: "0.9rem", color: "#1D4ED8", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Ideal TA: 80-120 ppm</p>
                <p style={{ margin: 0 }}>• Hot tub TA: 100-150 ppm</p>
                <p style={{ margin: 0 }}>• Test weekly minimum</p>
                <p style={{ margin: 0 }}>• Adjust TA before pH</p>
                <p style={{ margin: 0 }}>• Wait 4-6 hrs between doses</p>
              </div>
            </div>

            {/* Chemicals */}
            <div style={{ backgroundColor: "#F0FDF4", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #86EFAC" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "16px" }}>🧪 Chemicals Used</h3>
              <div style={{ fontSize: "0.9rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}><strong>To Raise:</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>• Sodium Bicarbonate (Baking Soda)</p>
                <p style={{ margin: "0 0 8px 0" }}><strong>To Lower:</strong></p>
                <p style={{ margin: "0 0 4px 0" }}>• Muriatic Acid (HCl)</p>
                <p style={{ margin: 0 }}>• Sodium Bisulfate (Dry Acid)</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/pool-alkalinity-calculator" currentCategory="Home" />
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
            ⚠️ <strong>Disclaimer:</strong> This calculator provides estimates based on standard chemical concentrations. 
            Actual dosing may vary based on your specific products, water conditions, and other factors. 
            Always read chemical labels carefully and follow manufacturer instructions. 
            Handle pool chemicals with appropriate safety precautions. When in doubt, consult a pool professional.
          </p>
        </div>
      </div>
    </div>
  );
}