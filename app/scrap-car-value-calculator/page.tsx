"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

type Tab = 'quick' | 'detailed';
type VehicleType = 'compact' | 'sedan' | 'fullsize' | 'suv' | 'truck' | 'van';
type Condition = 'running' | 'complete' | 'nonrunning' | 'damaged' | 'shell';
type Region = 'high' | 'medium' | 'low';

// Vehicle types with average weights (in pounds)
const VEHICLE_TYPES = {
  compact: { weight: 2500, label: 'Compact Car', examples: 'Honda Civic, Toyota Corolla' },
  sedan: { weight: 3500, label: 'Mid-Size Sedan', examples: 'Toyota Camry, Honda Accord' },
  fullsize: { weight: 4000, label: 'Full-Size Sedan', examples: 'Chevy Impala, Ford Taurus' },
  suv: { weight: 4500, label: 'SUV / Crossover', examples: 'Ford Explorer, Toyota RAV4' },
  truck: { weight: 5500, label: 'Pickup Truck', examples: 'Ford F-150, Chevy Silverado' },
  van: { weight: 4500, label: 'Van / Minivan', examples: 'Honda Odyssey, Dodge Caravan' }
};

// Vehicle condition multipliers
const CONDITIONS = {
  running: { multiplier: 1.15, label: 'Running & Drivable', desc: 'Engine runs, can be driven' },
  complete: { multiplier: 1.0, label: 'Complete Vehicle', desc: 'All major parts intact' },
  nonrunning: { multiplier: 0.9, label: 'Non-Running', desc: "Doesn't start, but complete" },
  damaged: { multiplier: 0.75, label: 'Damaged / Wrecked', desc: 'Accident damage, missing parts' },
  shell: { multiplier: 0.5, label: 'Shell Only', desc: 'Body only, no major components' }
};

// Regional pricing (affects per-ton rates)
const REGIONS = {
  high: { multiplier: 1.15, label: 'High-Value States', states: 'CA, MI, OH, PA, NY, NJ, IL', priceRange: '$160-$220/ton' },
  medium: { multiplier: 1.0, label: 'Average States', states: 'TX, FL, GA, NC, WA, AZ, CO', priceRange: '$130-$180/ton' },
  low: { multiplier: 0.85, label: 'Low-Value States', states: 'WY, MT, ND, SD, NE, WV, AR', priceRange: '$100-$150/ton' }
};

// Valuable parts pricing
const PARTS = {
  engine: { min: 200, max: 600, label: 'Working Engine' },
  transmission: { min: 100, max: 400, label: 'Working Transmission' },
  catalytic: { min: 50, max: 500, label: 'Catalytic Converter' },
  wheels: { min: 50, max: 200, label: 'Aluminum/Alloy Wheels' },
  battery: { min: 10, max: 30, label: 'Good Battery' }
};

// Base scrap prices per ton (2025)
const SCRAP_PRICE_PER_TON = { min: 100, max: 220 };

// FAQ data
const faqs = [
  {
    question: "How much is my car worth for scrap?",
    answer: "Most scrap cars are worth $100 to $700 based on weight alone. A typical mid-size sedan (3,500 lbs) brings $175-$385 in scrap metal value. Add $200-$600 if the engine runs, $100-$400 for a good transmission, and $50-$500 for the catalytic converter. Complete running vehicles can fetch $500-$1,500+ depending on make, model, and local demand."
  },
  {
    question: "How do junkyards calculate scrap car value?",
    answer: "Junkyards primarily calculate value by multiplying your car's weight (in tons) by the current scrap metal price per ton ($100-$220). They then add value for salvageable parts like the engine, transmission, and catalytic converter. Location matters too—yards near steel mills pay more due to lower shipping costs."
  },
  {
    question: "How much is scrap metal per ton for cars?",
    answer: "As of 2025, scrap car prices range from $100 to $220 per ton depending on location and market conditions. States near steel mills (Ohio, Michigan, Pennsylvania) typically pay $160-$220/ton, while remote areas may only pay $100-$150/ton. Prices fluctuate based on global steel demand."
  },
  {
    question: "Is a catalytic converter worth money on a scrap car?",
    answer: "Yes, catalytic converters contain precious metals (platinum, palladium, rhodium) worth $50-$500 depending on the vehicle type. Trucks and SUVs typically have more valuable converters than small cars. Many scrap buyers significantly reduce their offer if the catalytic converter is missing."
  },
  {
    question: "Do I get more money if my car still runs?",
    answer: "Yes, running vehicles typically get 10-20% more than non-running ones. A working engine adds $200-$600 in value because it can be resold. However, even non-running cars have scrap value based on weight and remaining parts. The engine's condition matters more than whether the car 'drives.'"
  },
  {
    question: "How much do junkyards pay for cars without a title?",
    answer: "Cars without titles typically receive 20-40% lower offers due to additional paperwork requirements and legal risks for the buyer. Some junkyards won't buy vehicles without proper documentation. If you've lost your title, consider applying for a duplicate from your DMV before selling."
  },
  {
    question: "What factors affect scrap car prices?",
    answer: "Key factors include: 1) Vehicle weight (more metal = higher value), 2) Current scrap metal market prices, 3) Condition and completeness of the vehicle, 4) Presence of valuable parts (engine, transmission, catalytic converter), 5) Your location relative to steel mills and recycling facilities, and 6) Local demand for parts from your vehicle type."
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

export default function ScrapCarValueCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>('quick');
  
  // Quick estimate inputs
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const [condition, setCondition] = useState<Condition>('complete');
  const [region, setRegion] = useState<Region>('medium');
  
  // Detailed inputs
  const [customWeight, setCustomWeight] = useState(3500);
  const [detailedCondition, setDetailedCondition] = useState<Condition>('complete');
  const [detailedRegion, setDetailedRegion] = useState<Region>('medium');
  const [selectedParts, setSelectedParts] = useState({
    engine: true,
    transmission: true,
    catalytic: true,
    wheels: false,
    battery: false
  });

  // Quick estimate calculation
  const quickResults = useMemo(() => {
    const vehicle = VEHICLE_TYPES[vehicleType];
    const cond = CONDITIONS[condition];
    const reg = REGIONS[region];
    
    const weightTons = vehicle.weight / 2000;
    
    // Base metal value
    const metalMin = Math.round(weightTons * SCRAP_PRICE_PER_TON.min * cond.multiplier * reg.multiplier);
    const metalMax = Math.round(weightTons * SCRAP_PRICE_PER_TON.max * cond.multiplier * reg.multiplier);
    
    // Estimated parts value based on condition
    let partsMin = 0, partsMax = 0;
    if (condition === 'running' || condition === 'complete') {
      partsMin = 250; partsMax = 900;
    } else if (condition === 'nonrunning') {
      partsMin = 100; partsMax = 500;
    } else if (condition === 'damaged') {
      partsMin = 50; partsMax = 300;
    }
    
    return {
      weight: vehicle.weight,
      metalMin,
      metalMax,
      partsMin,
      partsMax,
      totalMin: metalMin + partsMin,
      totalMax: metalMax + partsMax
    };
  }, [vehicleType, condition, region]);

  // Detailed calculation
  const detailedResults = useMemo(() => {
    const cond = CONDITIONS[detailedCondition];
    const reg = REGIONS[detailedRegion];
    
    const weightTons = customWeight / 2000;
    
    // Metal value
    const metalMin = Math.round(weightTons * SCRAP_PRICE_PER_TON.min * cond.multiplier * reg.multiplier);
    const metalMax = Math.round(weightTons * SCRAP_PRICE_PER_TON.max * cond.multiplier * reg.multiplier);
    
    // Parts value
    let partsMin = 0, partsMax = 0;
    Object.entries(selectedParts).forEach(([key, selected]) => {
      if (selected) {
        const part = PARTS[key as keyof typeof PARTS];
        partsMin += part.min;
        partsMax += part.max;
      }
    });
    
    // Adjust parts value for condition
    if (detailedCondition === 'damaged') {
      partsMin = Math.round(partsMin * 0.5);
      partsMax = Math.round(partsMax * 0.5);
    } else if (detailedCondition === 'shell') {
      partsMin = 0;
      partsMax = 0;
    }
    
    return {
      weightTons: weightTons.toFixed(2),
      metalMin,
      metalMax,
      partsMin,
      partsMax,
      totalMin: metalMin + partsMin,
      totalMax: metalMax + partsMax
    };
  }, [customWeight, detailedCondition, detailedRegion, selectedParts]);

  const togglePart = (part: keyof typeof selectedParts) => {
    setSelectedParts(prev => ({ ...prev, [part]: !prev[part] }));
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Scrap Car Value Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🚗</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Scrap Car Value Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your junk car&apos;s scrap value based on weight, condition, and location. Get realistic pricing before selling to a junkyard.
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
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Reference (2025 Prices)</p>
              <p style={{ color: "#065F46", margin: 0, fontSize: "0.95rem" }}>
                <strong>Metal Only:</strong> $100-$700 • <strong>With Parts:</strong> $300-$1,500+ • <strong>Price Per Ton:</strong> $100-$220
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
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB" }}>
            <button
              onClick={() => setActiveTab("quick")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "quick" ? "#059669" : "transparent",
                color: activeTab === "quick" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              ⚡ Quick Estimate
            </button>
            <button
              onClick={() => setActiveTab("detailed")}
              style={{
                flex: 1,
                padding: "16px",
                border: "none",
                backgroundColor: activeTab === "detailed" ? "#059669" : "transparent",
                color: activeTab === "detailed" ? "white" : "#6B7280",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🔧 Detailed Calculator
            </button>
          </div>

          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {activeTab === 'quick' ? (
                  <>
                    {/* Vehicle Type */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                        🚙 Vehicle Type
                      </h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(VEHICLE_TYPES) as [VehicleType, typeof VEHICLE_TYPES.sedan][]).map(([key, vehicle]) => (
                          <button key={key} onClick={() => setVehicleType(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: vehicleType === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: vehicleType === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontWeight: "600", color: vehicleType === key ? "#059669" : "#374151", margin: 0, fontSize: "0.9rem" }}>{vehicle.label}</p>
                              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>{vehicle.examples}</p>
                            </div>
                            <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>~{vehicle.weight.toLocaleString()} lbs</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Condition */}
                    <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>📋 Vehicle Condition</h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(CONDITIONS) as [Condition, typeof CONDITIONS.complete][]).map(([key, cond]) => (
                          <button key={key} onClick={() => setCondition(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: condition === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: condition === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left" }}>
                            <p style={{ fontWeight: "600", color: condition === key ? "#059669" : "#374151", margin: 0, fontSize: "0.9rem" }}>{cond.label}</p>
                            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>{cond.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Region */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>📍 Your Location</h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(REGIONS) as [Region, typeof REGIONS.medium][]).map(([key, reg]) => (
                          <button key={key} onClick={() => setRegion(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: region === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: region === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <p style={{ fontWeight: "600", color: region === key ? "#059669" : "#374151", margin: 0, fontSize: "0.9rem" }}>{reg.label}</p>
                              <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "2px 0 0 0" }}>{reg.states}</p>
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "600" }}>{reg.priceRange}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Custom Weight */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                        ⚖️ Vehicle Weight (lbs)
                      </h3>
                      <input
                        type="number"
                        value={customWeight}
                        onChange={(e) => setCustomWeight(Number(e.target.value) || 0)}
                        style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "1.1rem", marginBottom: "12px" }}
                      />
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {[2500, 3500, 4500, 5500].map((w) => (
                          <button key={w} onClick={() => setCustomWeight(w)} style={{ padding: "8px 12px", borderRadius: "6px", border: customWeight === w ? "2px solid #059669" : "1px solid #D1D5DB", backgroundColor: customWeight === w ? "#ECFDF5" : "white", color: customWeight === w ? "#059669" : "#374151", cursor: "pointer", fontWeight: "500", fontSize: "0.85rem" }}>
                            {w.toLocaleString()} lbs
                          </button>
                        ))}
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "8px 0 0 0" }}>
                        Google &quot;[your car year make model] curb weight&quot; to find exact weight
                      </p>
                    </div>

                    {/* Detailed Condition */}
                    <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>📋 Condition</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {(Object.entries(CONDITIONS) as [Condition, typeof CONDITIONS.complete][]).slice(0, 4).map(([key, cond]) => (
                          <button key={key} onClick={() => setDetailedCondition(key)} style={{ padding: "12px", borderRadius: "8px", border: detailedCondition === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: detailedCondition === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left" }}>
                            <p style={{ fontWeight: "600", color: detailedCondition === key ? "#059669" : "#374151", margin: 0, fontSize: "0.85rem" }}>{cond.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Region */}
                    <div style={{ backgroundColor: "#F0FDF4", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>📍 Location</h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(REGIONS) as [Region, typeof REGIONS.medium][]).map(([key, reg]) => (
                          <button key={key} onClick={() => setDetailedRegion(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: detailedRegion === key ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: detailedRegion === key ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: "600", color: detailedRegion === key ? "#059669" : "#374151", fontSize: "0.9rem" }}>{reg.label}</span>
                            <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "600" }}>{reg.priceRange}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Valuable Parts */}
                    <div style={{ backgroundColor: "#ECFDF5", padding: "24px", borderRadius: "12px" }}>
                      <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>⚙️ Valuable Parts Present</h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {(Object.entries(PARTS) as [keyof typeof PARTS, typeof PARTS.engine][]).map(([key, part]) => (
                          <button key={key} onClick={() => togglePart(key)} style={{ padding: "12px 16px", borderRadius: "8px", border: selectedParts[key] ? "2px solid #059669" : "1px solid #E5E7EB", backgroundColor: selectedParts[key] ? "#ECFDF5" : "white", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ width: "20px", height: "20px", borderRadius: "4px", border: selectedParts[key] ? "none" : "2px solid #D1D5DB", backgroundColor: selectedParts[key] ? "#059669" : "white", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem" }}>
                                {selectedParts[key] && "✓"}
                              </span>
                              <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>{part.label}</span>
                            </div>
                            <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: "500" }}>${part.min}-${part.max}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Results */}
              <div className="calc-results">
                {activeTab === 'quick' ? (
                  <>
                    <div style={{ backgroundColor: "#059669", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Estimated Scrap Value</p>
                      <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>{formatCurrency(quickResults.totalMin)} - {formatCurrency(quickResults.totalMax)}</p>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>{VEHICLE_TYPES[vehicleType].label} • {quickResults.weight.toLocaleString()} lbs</p>
                    </div>

                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Value Breakdown</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>Vehicle Weight</span><span style={{ fontWeight: "600", color: "#374151" }}>{quickResults.weight.toLocaleString()} lbs ({(quickResults.weight / 2000).toFixed(2)} tons)</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🔩 Scrap Metal Value</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(quickResults.metalMin)} - {formatCurrency(quickResults.metalMax)}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>⚙️ Parts Value (est.)</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(quickResults.partsMin)} - {formatCurrency(quickResults.partsMax)}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontWeight: "600", color: "#059669" }}>Total Estimate</span><span style={{ fontWeight: "700", color: "#059669", fontSize: "1.1rem" }}>{formatCurrency(quickResults.totalMin)} - {formatCurrency(quickResults.totalMax)}</span></div>
                      </div>
                    </div>

                    <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                      <p style={{ fontSize: "0.85rem", color: "#92400E", margin: 0 }}>💡 <strong>Tip:</strong> Get 3+ quotes from local junkyards. Prices vary 20-50% between buyers. Mention if your car still runs or has a good catalytic converter.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ backgroundColor: "#059669", padding: "24px", borderRadius: "12px", textAlign: "center", marginBottom: "20px" }}>
                      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>Total Estimated Value</p>
                      <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 4px 0" }}>{formatCurrency(detailedResults.totalMin)} - {formatCurrency(detailedResults.totalMax)}</p>
                      <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>{customWeight.toLocaleString()} lbs • {detailedResults.weightTons} tons</p>
                    </div>

                    <div style={{ backgroundColor: "#F0FDF4", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                      <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📊 Detailed Breakdown</h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>Weight</span><span style={{ fontWeight: "600", color: "#374151" }}>{customWeight.toLocaleString()} lbs ({detailedResults.weightTons} tons)</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>🔩 Scrap Metal Value</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.metalMin)} - {formatCurrency(detailedResults.metalMax)}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}><span style={{ color: "#6B7280" }}>⚙️ Parts Value</span><span style={{ fontWeight: "600", color: "#374151" }}>{formatCurrency(detailedResults.partsMin)} - {formatCurrency(detailedResults.partsMax)}</span></div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontWeight: "600", color: "#059669" }}>Total Value</span><span style={{ fontWeight: "700", color: "#059669", fontSize: "1.1rem" }}>{formatCurrency(detailedResults.totalMin)} - {formatCurrency(detailedResults.totalMax)}</span></div>
                      </div>
                    </div>

                    <div style={{ padding: "16px", backgroundColor: "#DBEAFE", borderRadius: "8px", border: "1px solid #93C5FD" }}>
                      <p style={{ fontSize: "0.85rem", color: "#1E40AF", margin: 0 }}>⚠️ <strong>Note:</strong> Actual offers depend on local demand, buyer profit margins, and inspection. Expect offers to vary 20-30% from this estimate.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrap Value Reference Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📊 Scrap Car Value by Vehicle Type (2025)</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Average scrap values based on current market rates of $100-$220 per ton</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Vehicle Type</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Avg. Weight</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Metal Only</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#ECFDF5" }}>With Parts</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Compact Car", weight: "2,500 lbs", metal: "$125 - $275", withParts: "$300 - $800" },
                  { type: "Mid-Size Sedan", weight: "3,500 lbs", metal: "$175 - $385", withParts: "$400 - $1,100" },
                  { type: "Full-Size Sedan", weight: "4,000 lbs", metal: "$200 - $440", withParts: "$450 - $1,200" },
                  { type: "SUV / Crossover", weight: "4,500 lbs", metal: "$225 - $495", withParts: "$500 - $1,400" },
                  { type: "Pickup Truck", weight: "5,500 lbs", metal: "$275 - $605", withParts: "$600 - $1,800" },
                  { type: "Van / Minivan", weight: "4,500 lbs", metal: "$225 - $495", withParts: "$500 - $1,300" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.type}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.weight}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.metal}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{row.withParts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Scrap Metal Prices Table */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>💰 Current Scrap Metal Prices (2025)</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Metal types found in vehicles and their current market values</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Metal Type</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Current Price</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Found In</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metal: "Steel (car body)", price: "$100 - $220/ton", found: "Body panels, frame, structure" },
                  { metal: "Aluminum", price: "$0.50 - $0.80/lb", found: "Wheels, engine parts, radiator" },
                  { metal: "Copper", price: "$3.00 - $4.00/lb", found: "Wiring harness, radiator" },
                  { metal: "Catalytic Converter", price: "$50 - $500", found: "Exhaust system (precious metals)" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.metal}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600", color: "#059669" }}>{row.price}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", color: "#6B7280" }}>{row.found}</td>
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
            {/* How to Get Most Value */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>💵 How to Get the Most for Your Scrap Car</h2>
              <div style={{ display: "grid", gap: "16px" }}>
                {[
                  { num: 1, title: "Get Multiple Quotes", desc: "Contact 3-5 local junkyards and online buyers. Prices can vary 30-50% between buyers." },
                  { num: 2, title: "Highlight Valuable Parts", desc: "Mention if engine runs, transmission works, or catalytic converter is intact. These add $300-$1,000+." },
                  { num: 3, title: "Have Your Title Ready", desc: "Cars with clean titles get better offers. No title? Get a duplicate from DMV ($15-30)." },
                  { num: 4, title: "Consider Selling Parts", desc: "Selling catalytic converter, wheels, and battery separately can yield 2-3x more than selling whole." }
                ].map((item) => (
                  <div key={item.num} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#059669", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>{item.num}</div>
                    <div>
                      <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>{item.title}</h4>
                      <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What Affects Value */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>📈 What Affects Scrap Car Value?</h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { icon: "⚖️", title: "Vehicle Weight", desc: "More weight = more metal = higher value", bg: "#ECFDF5", color: "#059669" },
                  { icon: "📊", title: "Scrap Metal Prices", desc: "Fluctuates with global steel demand", bg: "#EFF6FF", color: "#1E40AF" },
                  { icon: "📍", title: "Location", desc: "States near steel mills pay 15-20% more", bg: "#FEF3C7", color: "#B45309" },
                  { icon: "⚙️", title: "Salvageable Parts", desc: "Running engines, catalytic converters add value", bg: "#F3E8FF", color: "#7C3AED" },
                  { icon: "📋", title: "Condition & Title", desc: "Complete cars with titles get best offers", bg: "#FEE2E2", color: "#DC2626" }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: item.bg, borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                    <div>
                      <span style={{ fontWeight: "600", color: item.color }}>{item.title}</span>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}> — {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Parts Value Guide */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>⚙️ Parts Value Guide</h3>
              <div style={{ fontSize: "0.85rem", color: "#065F46" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Working Engine</span><span style={{ fontWeight: "600" }}>$200-$600</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Catalytic Converter</span><span style={{ fontWeight: "600" }}>$50-$500</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Transmission</span><span style={{ fontWeight: "600" }}>$100-$400</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Alloy Wheels (set)</span><span style={{ fontWeight: "600" }}>$50-$200</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Car Battery</span><span style={{ fontWeight: "600" }}>$10-$30</span></div>
              </div>
            </div>

            {/* Pro Tips */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>💡 Pro Tips</h3>
              <ul style={{ fontSize: "0.85rem", color: "#92400E", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Never accept the first offer</li>
                <li style={{ marginBottom: "8px" }}>Confirm free towing is included</li>
                <li style={{ marginBottom: "8px" }}>Remove personal items first</li>
                <li style={{ marginBottom: "8px" }}>Get cash at pickup time</li>
                <li>Keep license plates (required in most states)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/scrap-car-value-calculator"
              currentCategory="Auto"
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "center", margin: 0 }}>
            🚗 <strong>Disclaimer:</strong> Estimates based on 2025 national averages. Actual offers vary by location, buyer, vehicle condition, and current metal prices. Always get multiple quotes for accurate pricing.
          </p>
        </div>
      </div>
    </div>
  );
}