"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// ============================================
// Types & Data
// ============================================

// Tank specifications
const tankSpecs = [
  { id: '20lb', label: '20 lb (BBQ Tank)', type: 'lb', capacity: 20, gallons: 4.7, tareWeight: 17, fullWeight: 37, description: 'Standard grill tank' },
  { id: '30lb', label: '30 lb', type: 'lb', capacity: 30, gallons: 7.1, tareWeight: 25, fullWeight: 55, description: 'RV/camper tank' },
  { id: '40lb', label: '40 lb', type: 'lb', capacity: 40, gallons: 9.4, tareWeight: 29, fullWeight: 69, description: 'Forklift tank' },
  { id: '100lb', label: '100 lb (Portable Cylinder)', type: 'lb', capacity: 100, gallons: 23.6, tareWeight: 70, fullWeight: 170, description: 'Home heating backup' },
  { id: '100gal', label: '100 Gallon (Residential)', type: 'gal', capacity: 100, pounds: 424, tareWeight: 215, fullWeight: 555, description: 'Small home tank' },
  { id: '120gal', label: '120 Gallon', type: 'gal', capacity: 120, pounds: 508, tareWeight: 250, fullWeight: 660, description: 'Also called 420 lb tank' },
  { id: '250gal', label: '250 Gallon', type: 'gal', capacity: 250, pounds: 1060, tareWeight: 485, fullWeight: 1335, description: 'Small to medium home' },
  { id: '500gal', label: '500 Gallon', type: 'gal', capacity: 500, pounds: 2120, tareWeight: 950, fullWeight: 2650, description: 'Most common home tank' },
  { id: '1000gal', label: '1000 Gallon', type: 'gal', capacity: 1000, pounds: 4240, tareWeight: 1760, fullWeight: 5160, description: 'Large home/commercial' },
];

// Common appliances with BTU ratings
const appliances = [
  { id: 'grill', label: 'BBQ Grill', btu: 30000, description: '20,000-40,000 BTU' },
  { id: 'patio', label: 'Patio Heater', btu: 40000, description: '30,000-50,000 BTU' },
  { id: 'firepit', label: 'Fire Pit', btu: 50000, description: '40,000-60,000 BTU' },
  { id: 'furnace', label: 'Furnace', btu: 80000, description: '60,000-100,000 BTU' },
  { id: 'waterheater', label: 'Water Heater', btu: 40000, description: '30,000-50,000 BTU' },
  { id: 'poolheater', label: 'Pool Heater', btu: 400000, description: '200,000-400,000 BTU' },
  { id: 'generator', label: 'Generator', btu: 60000, description: '40,000-80,000 BTU' },
  { id: 'custom', label: 'Custom BTU', btu: 0, description: 'Enter your own' },
];

// Quick reference data
const quickReferenceData = [
  { tankSize: '20 lb (BBQ)', gallons: '4.7 gal', weight: '37 lbs full', fillCost: '$15-25', lastsBBQ: '15-20 hrs' },
  { tankSize: '30 lb', gallons: '7.1 gal', weight: '55 lbs full', fillCost: '$22-35', lastsBBQ: '22-30 hrs' },
  { tankSize: '100 lb', gallons: '23.6 gal', weight: '170 lbs full', fillCost: '$60-90', lastsBBQ: '70+ hrs' },
  { tankSize: '100 gallon', gallons: '80 gal*', weight: '555 lbs full', fillCost: '$200-320', lastsBBQ: 'N/A' },
  { tankSize: '250 gallon', gallons: '200 gal*', weight: '1,335 lbs full', fillCost: '$500-800', lastsBBQ: 'N/A' },
  { tankSize: '500 gallon', gallons: '400 gal*', weight: '2,650 lbs full', fillCost: '$1,000-1,600', lastsBBQ: 'N/A' },
];

// FAQ data
const faqs = [
  {
    question: "How many pounds of propane are in a 100 gallon tank?",
    answer: "A 100 gallon propane tank holds approximately 424 pounds of propane when filled to the standard 80% capacity (80 gallons × 4.24 lbs/gallon = 339 lbs actual propane). The tank itself weighs about 215 lbs empty, so a full 100 gallon tank weighs approximately 555 pounds total. Note: Tanks are only filled to 80% to allow for thermal expansion."
  },
  {
    question: "How many gallons does a 100 lb propane tank hold?",
    answer: "A 100 lb propane tank holds approximately 23.6 gallons of propane. This is calculated by dividing 100 pounds by 4.24 lbs per gallon. The tank weighs about 70 lbs empty, so when full it weighs around 170 lbs total. These portable cylinders are commonly used for home heating backup, construction heaters, and large grills."
  },
  {
    question: "How much does it cost to fill a 100 lb propane tank?",
    answer: "Filling a 100 lb propane tank typically costs $60-$100 depending on local propane prices ($2.50-$4.00 per gallon). At refill stations, you'll pay per gallon for the actual propane dispensed. Tank exchanges may cost more ($80-$120) but include inspection. Many hardware stores, propane dealers, and farm supply stores offer refills."
  },
  {
    question: "How long will a 100 lb propane tank last?",
    answer: "A 100 lb propane tank lasts approximately: 72 hours continuous on a 30,000 BTU heater, 18-20 days at 4 hours/day heating use, 70+ hours of BBQ grilling, or 4-5 months for a gas fireplace used occasionally. Usage varies based on appliance BTU rating and how often you use it."
  },
  {
    question: "Why are propane tanks only filled to 80%?",
    answer: "Propane tanks are filled to only 80% capacity as a safety measure. Propane expands significantly with temperature changes - about 1.5% per 10°F increase. The 20% headspace allows room for this expansion, preventing dangerous over-pressurization. At 80% fill, a tank filled at 60°F won't exceed safe pressure even at 100°F+."
  },
  {
    question: "What's the difference between a 100 lb tank and 100 gallon tank?",
    answer: "A 100 lb tank and 100 gallon tank are very different sizes. A 100 lb tank is a portable cylinder holding 23.6 gallons (100 lbs of propane). A 100 gallon tank is a larger stationary tank holding 80 gallons when filled to 80% (about 339 lbs of propane). The 100 gallon tank holds roughly 3.4× more propane than the 100 lb tank."
  }
];

// Constants
const LBS_PER_GALLON = 4.24;
const BTU_PER_GALLON = 91500;
const SAFETY_FILL = 0.80;

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

export default function PropaneTankCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<'specs' | 'cost' | 'usage'>('specs');

  // Tank Specs tab states
  const [selectedTank, setSelectedTank] = useState('100gal');

  // Cost Calculator tab states
  const [costTank, setCostTank] = useState('100lb');
  const [pricePerGallon, setPricePerGallon] = useState(3.00);
  const [currentFillLevel, setCurrentFillLevel] = useState(20);

  // Usage Calculator tab states
  const [usageTank, setUsageTank] = useState('100lb');
  const [selectedAppliance, setSelectedAppliance] = useState('grill');
  const [customBtu, setCustomBtu] = useState(30000);
  const [hoursPerDay, setHoursPerDay] = useState(4);

  // Get tank data
  const getTankData = (tankId: string) => {
    return tankSpecs.find(t => t.id === tankId) || tankSpecs[0];
  };

  // Calculate tank specifications
  const calculateTankSpecs = (tankId: string) => {
    const tank = getTankData(tankId);
    
    if (tank.type === 'lb') {
      // Pound-rated tanks
      const propaneWeight = tank.capacity;
      const propaneGallons = tank.gallons || propaneWeight / LBS_PER_GALLON;
      const actualFillGallons = propaneGallons; // lb tanks are designed for their rated capacity at 80%
      const totalBtu = propaneGallons * BTU_PER_GALLON;
      
      return {
        tankType: 'Portable Cylinder (lb)',
        nominalCapacity: `${tank.capacity} lbs`,
        propaneWeight: propaneWeight,
        propaneGallons: propaneGallons,
        actualFillGallons: propaneGallons,
        emptyWeight: tank.tareWeight,
        fullWeight: tank.fullWeight,
        totalBtu: totalBtu,
        safetyNote: 'Lb-rated tanks are designed to hold their rated weight at 80% fill'
      };
    } else {
      // Gallon-rated tanks
      const nominalGallons = tank.capacity;
      const actualFillGallons = nominalGallons * SAFETY_FILL;
      const propaneWeight = actualFillGallons * LBS_PER_GALLON;
      const totalBtu = actualFillGallons * BTU_PER_GALLON;
      
      return {
        tankType: 'Stationary Tank (gallon)',
        nominalCapacity: `${tank.capacity} gallons`,
        propaneWeight: propaneWeight,
        propaneGallons: nominalGallons,
        actualFillGallons: actualFillGallons,
        emptyWeight: tank.tareWeight,
        fullWeight: tank.fullWeight,
        totalBtu: totalBtu,
        safetyNote: `Filled to 80% = ${actualFillGallons} gallons for safety`
      };
    }
  };

  // Calculate fill cost
  const calculateFillCost = () => {
    const tank = getTankData(costTank);
    let gallonsToFill: number;
    
    if (tank.type === 'lb') {
      const totalGallons = tank.gallons || tank.capacity / LBS_PER_GALLON;
      const currentGallons = totalGallons * (currentFillLevel / 100);
      gallonsToFill = totalGallons - currentGallons;
    } else {
      const maxFillGallons = tank.capacity * SAFETY_FILL;
      const currentGallons = maxFillGallons * (currentFillLevel / 100);
      gallonsToFill = maxFillGallons - currentGallons;
    }
    
    const cost = gallonsToFill * pricePerGallon;
    
    return {
      gallonsToFill: gallonsToFill,
      cost: cost,
      tankType: tank.type === 'lb' ? `${tank.capacity} lb tank` : `${tank.capacity} gallon tank`
    };
  };

  // Calculate usage time
  const calculateUsageTime = () => {
    const tank = getTankData(usageTank);
    const appliance = appliances.find(a => a.id === selectedAppliance);
    const btu = selectedAppliance === 'custom' ? customBtu : (appliance?.btu || 30000);
    
    let totalGallons: number;
    if (tank.type === 'lb') {
      totalGallons = tank.gallons || tank.capacity / LBS_PER_GALLON;
    } else {
      totalGallons = tank.capacity * SAFETY_FILL;
    }
    
    const totalBtu = totalGallons * BTU_PER_GALLON;
    const hoursTotal = totalBtu / btu;
    const daysAtUsage = hoursTotal / hoursPerDay;
    const gallonsPerHour = btu / BTU_PER_GALLON;
    const gallonsPerDay = gallonsPerHour * hoursPerDay;
    
    return {
      totalGallons,
      totalBtu,
      hoursTotal,
      daysAtUsage,
      gallonsPerHour,
      gallonsPerDay,
      applianceBtu: btu
    };
  };

  const tankData = calculateTankSpecs(selectedTank);
  const fillCost = calculateFillCost();
  const usageData = calculateUsageTime();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#EFF6FF" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BFDBFE" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Propane Tank Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>⛽</span>
            <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: "bold", color: "#111827", margin: 0 }}>
              How Many Pounds in a 100 Gallon Propane Tank?
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate propane tank weight, capacity, fill cost, and usage time. Works for all tank 
            sizes from 20 lb BBQ tanks to 1000 gallon home tanks.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#2563EB",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "white", margin: "0 0 8px 0" }}>
                <strong>Quick Answer: 100 Gallon vs 100 lb Tank</strong>
              </p>
              <div style={{ color: "#BFDBFE", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0" }}>• <strong>100 gallon tank:</strong> Holds ~424 lbs propane (80 gal at 80% fill) | Full weight: ~555 lbs</p>
                <p style={{ margin: "0" }}>• <strong>100 lb tank:</strong> Holds ~23.6 gallons propane | Full weight: ~170 lbs</p>
                <p style={{ margin: "0", marginTop: "8px", fontSize: "0.85rem" }}>Key formula: 1 gallon propane = 4.24 lbs | 1 gallon = 91,500 BTU</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab('specs')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'specs' ? "#2563EB" : "white",
              color: activeTab === 'specs' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            📊 Tank Specs
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'cost' ? "#2563EB" : "white",
              color: activeTab === 'cost' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            💰 Cost Calculator
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === 'usage' ? "#2563EB" : "white",
              color: activeTab === 'usage' ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            ⏱️ Usage Calculator
          </button>
        </div>

        {/* Tank Specs Tab */}
        {activeTab === 'specs' && (
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
                  📊 Select Tank Size
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Tank Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ⛽ Tank Size
                  </label>
                  <select
                    value={selectedTank}
                    onChange={(e) => setSelectedTank(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {tankSpecs.map(tank => (
                      <option key={tank.id} value={tank.id}>
                        {tank.label} - {tank.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tank Type Cards */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🏷️ Common Tank Sizes
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {['20lb', '100lb', '100gal', '500gal'].map((tankId) => {
                      const tank = getTankData(tankId);
                      return (
                        <button
                          key={tankId}
                          onClick={() => setSelectedTank(tankId)}
                          style={{
                            padding: "12px",
                            borderRadius: "8px",
                            border: selectedTank === tankId ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            backgroundColor: selectedTank === tankId ? "#EFF6FF" : "white",
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <div style={{ 
                            fontWeight: selectedTank === tankId ? "600" : "500",
                            color: selectedTank === tankId ? "#2563EB" : "#374151",
                            fontSize: "0.9rem"
                          }}>
                            {tank.label}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                            {tank.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info Box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    ⚠️ Important: lb vs Gallon Tanks
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li><strong>Lb tanks</strong> (20, 30, 100 lb): Portable cylinders rated by propane weight</li>
                    <li><strong>Gallon tanks</strong> (100-1000 gal): Stationary tanks rated by volume</li>
                    <li>All tanks filled to max 80% for safety expansion room</li>
                  </ul>
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
                  📋 Tank Specifications
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Propane Capacity</div>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2563EB" }}>
                    {tankData.propaneWeight.toFixed(0)} lbs
                  </div>
                  <div style={{ fontSize: "1.1rem", color: "#6B7280" }}>
                    ({tankData.actualFillGallons.toFixed(1)} gallons)
                  </div>
                </div>

                {/* Specs Grid */}
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #BFDBFE"
                }}>
                  <div style={{ display: "grid", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Tank Type:</span>
                      <span style={{ fontWeight: "600", color: "#1D4ED8" }}>{tankData.tankType}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Nominal Capacity:</span>
                      <span style={{ fontWeight: "600" }}>{tankData.nominalCapacity}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Propane Weight:</span>
                      <span style={{ fontWeight: "600" }}>{tankData.propaneWeight.toFixed(1)} lbs</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Propane Volume:</span>
                      <span style={{ fontWeight: "600" }}>{tankData.actualFillGallons.toFixed(1)} gallons</span>
                    </div>
                    <div style={{ borderTop: "1px solid #BFDBFE", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}>Empty Tank Weight:</span>
                      <span style={{ fontWeight: "600" }}>~{tankData.emptyWeight} lbs</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#374151" }}><strong>Full Tank Weight:</strong></span>
                      <span style={{ fontWeight: "700", color: "#2563EB", fontSize: "1.1rem" }}>~{tankData.fullWeight} lbs</span>
                    </div>
                  </div>
                </div>

                {/* BTU Info */}
                <div style={{ 
                  backgroundColor: "#F0FDF4", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#065F46", fontWeight: "600" }}>🔥 Total Energy:</span>
                    <span style={{ fontWeight: "700", color: "#059669" }}>{(tankData.totalBtu / 1000000).toFixed(2)} million BTU</span>
                  </div>
                </div>

                {/* Safety Note */}
                <div style={{
                  backgroundColor: "#FEF2F2",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FECACA"
                }}>
                  <p style={{ fontSize: "0.8rem", color: "#B91C1C", margin: 0 }}>
                    ⚠️ <strong>80% Rule:</strong> {tankData.safetyNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Calculator Tab */}
        {activeTab === 'cost' && (
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
                  💰 Cost Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Tank Size */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ⛽ Tank Size
                  </label>
                  <select
                    value={costTank}
                    onChange={(e) => setCostTank(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {tankSpecs.map(tank => (
                      <option key={tank.id} value={tank.id}>
                        {tank.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Per Gallon */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    💵 Propane Price: ${pricePerGallon.toFixed(2)}/gallon
                  </label>
                  <input
                    type="range"
                    min={2.00}
                    max={5.00}
                    step={0.25}
                    value={pricePerGallon}
                    onChange={(e) => setPricePerGallon(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>$2.00</span>
                    <span>$5.00</span>
                  </div>
                </div>

                {/* Current Fill Level */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    📊 Current Fill Level: {currentFillLevel}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={5}
                    value={currentFillLevel}
                    onChange={(e) => setCurrentFillLevel(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>Empty (0%)</span>
                    <span>Full (80%)</span>
                  </div>
                </div>

                {/* Price Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📍 Typical Propane Prices (2024-2025)
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• Refill station: $2.50 - $3.50/gal</p>
                    <p style={{ margin: 0 }}>• Tank exchange: $4.00 - $5.50/gal effective</p>
                    <p style={{ margin: 0 }}>• Bulk delivery: $2.00 - $3.00/gal</p>
                    <p style={{ margin: 0 }}>• Winter prices typically 10-20% higher</p>
                  </div>
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
                  💵 Fill Cost Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Estimated Fill Cost</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#2563EB" }}>
                    ${fillCost.cost.toFixed(2)}
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Tank:</span>
                      <span style={{ fontWeight: "600" }}>{fillCost.tankType}</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Gallons to Fill:</span>
                      <span style={{ fontWeight: "600" }}>{fillCost.gallonsToFill.toFixed(1)} gal</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Price per Gallon:</span>
                      <span style={{ fontWeight: "600" }}>${pricePerGallon.toFixed(2)}</span>
                    </p>
                    <div style={{ borderTop: "2px solid #BFDBFE", marginTop: "12px", paddingTop: "12px" }}>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                        <span><strong>Total:</strong></span>
                        <span style={{ fontWeight: "700", color: "#2563EB" }}>${fillCost.cost.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Typical Costs Reference */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "12px" }}>
                    📊 Typical Full Fill Costs
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#4B5563", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• 20 lb tank: $15 - $25</p>
                    <p style={{ margin: 0 }}>• 100 lb tank: $60 - $100</p>
                    <p style={{ margin: 0 }}>• 100 gallon tank: $200 - $320</p>
                    <p style={{ margin: 0 }}>• 500 gallon tank: $800 - $1,400</p>
                  </div>
                </div>

                {/* Money Saving Tips */}
                <div style={{
                  backgroundColor: "#ECFDF5",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", margin: "0 0 8px 0" }}>
                    💡 Ways to Save
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#047857", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Refill instead of exchange (save 20-40%)</li>
                    <li>Fill in summer when prices are lower</li>
                    <li>Compare prices at multiple locations</li>
                    <li>Buy in bulk for larger tanks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Calculator Tab */}
        {activeTab === 'usage' && (
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
                  ⏱️ Usage Calculator
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Tank Size */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ⛽ Tank Size
                  </label>
                  <select
                    value={usageTank}
                    onChange={(e) => setUsageTank(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #D1D5DB",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      boxSizing: "border-box",
                      backgroundColor: "white"
                    }}
                  >
                    {tankSpecs.map(tank => (
                      <option key={tank.id} value={tank.id}>
                        {tank.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appliance Selection */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
                    🔥 Appliance Type
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {appliances.slice(0, 6).map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedAppliance(app.id)}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: selectedAppliance === app.id ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          backgroundColor: selectedAppliance === app.id ? "#EFF6FF" : "white",
                          cursor: "pointer",
                          textAlign: "left"
                        }}
                      >
                        <div style={{ 
                          fontWeight: selectedAppliance === app.id ? "600" : "500",
                          color: selectedAppliance === app.id ? "#2563EB" : "#374151",
                          fontSize: "0.85rem"
                        }}>
                          {app.label}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#6B7280", marginTop: "4px" }}>
                          {app.description}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedAppliance('custom')}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      padding: "12px",
                      borderRadius: "8px",
                      border: selectedAppliance === 'custom' ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: selectedAppliance === 'custom' ? "#EFF6FF" : "white",
                      cursor: "pointer",
                      textAlign: "center",
                      fontWeight: selectedAppliance === 'custom' ? "600" : "500",
                      color: selectedAppliance === 'custom' ? "#2563EB" : "#374151"
                    }}
                  >
                    ⚙️ Custom BTU
                  </button>
                </div>

                {/* Custom BTU Input */}
                {selectedAppliance === 'custom' && (
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      🔢 Custom BTU Rating: {customBtu.toLocaleString()} BTU/hr
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={500000}
                      step={5000}
                      value={customBtu}
                      onChange={(e) => setCustomBtu(Number(e.target.value))}
                      style={{ width: "100%" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>5,000 BTU</span>
                      <span>500,000 BTU</span>
                    </div>
                  </div>
                )}

                {/* Hours Per Day */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                    ⏰ Hours Used Per Day: {hoursPerDay}
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={24}
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                    <span>1 hour</span>
                    <span>24 hours</span>
                  </div>
                </div>

                {/* Formula Info */}
                <div style={{
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  padding: "16px"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginTop: 0, marginBottom: "8px" }}>
                    📐 Formula Used
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "#4B5563", margin: 0, lineHeight: "1.6" }}>
                    Hours = (Gallons × 91,500 BTU/gal) ÷ Appliance BTU
                  </p>
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
                  ⏱️ Usage Estimate
                </h2>
              </div>

              <div style={{ padding: "24px" }}>
                {/* Main Result */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={{ fontSize: "0.9rem", color: "#6B7280", marginBottom: "8px" }}>Tank Will Last</div>
                  <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#2563EB" }}>
                    ~{Math.round(usageData.daysAtUsage)} days
                  </div>
                  <div style={{ fontSize: "1rem", color: "#6B7280" }}>
                    at {hoursPerDay} hours/day usage
                  </div>
                </div>

                {/* Breakdown */}
                <div style={{ 
                  backgroundColor: "#EFF6FF", 
                  borderRadius: "12px", 
                  padding: "20px",
                  marginBottom: "20px"
                }}>
                  <div style={{ fontSize: "0.9rem", lineHeight: "2" }}>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Tank Capacity:</span>
                      <span style={{ fontWeight: "600" }}>{usageData.totalGallons.toFixed(1)} gallons</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Total Energy:</span>
                      <span style={{ fontWeight: "600" }}>{(usageData.totalBtu / 1000000).toFixed(2)}M BTU</span>
                    </p>
                    <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                      <span>Appliance BTU:</span>
                      <span style={{ fontWeight: "600" }}>{usageData.applianceBtu.toLocaleString()} BTU/hr</span>
                    </p>
                    <div style={{ borderTop: "1px solid #BFDBFE", marginTop: "12px", paddingTop: "12px" }}>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                        <span>Total Run Time:</span>
                        <span style={{ fontWeight: "700", color: "#2563EB" }}>{usageData.hoursTotal.toFixed(1)} hours</span>
                      </p>
                      <p style={{ margin: "0", display: "flex", justifyContent: "space-between" }}>
                        <span>Daily Usage:</span>
                        <span style={{ fontWeight: "600" }}>{usageData.gallonsPerDay.toFixed(2)} gal/day</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Reference */}
                <div style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#065F46", marginTop: 0, marginBottom: "12px" }}>
                    📊 Common Usage Examples
                  </h3>
                  <div style={{ fontSize: "0.8rem", color: "#047857", lineHeight: "1.8" }}>
                    <p style={{ margin: 0 }}>• 20 lb tank on grill: ~15-20 hours</p>
                    <p style={{ margin: 0 }}>• 100 lb tank on 30K BTU heater: ~72 hours</p>
                    <p style={{ margin: 0 }}>• 500 gal tank heating home: ~2-4 months</p>
                  </div>
                </div>

                {/* Tips */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  border: "1px solid #FCD34D"
                }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#92400E", margin: "0 0 8px 0" }}>
                    💡 Usage Tips
                  </p>
                  <ul style={{ fontSize: "0.8rem", color: "#B45309", margin: 0, paddingLeft: "16px", lineHeight: "1.8" }}>
                    <li>Lower BTU settings extend usage significantly</li>
                    <li>Cold weather increases propane consumption</li>
                    <li>Refill when gauge shows 20-25%</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Tab */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #BFDBFE",
          overflow: "hidden",
          marginBottom: "32px"
        }}>
          <div style={{ backgroundColor: "#2563EB", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
              📋 Quick Reference: Propane Tank Sizes
            </h2>
          </div>

          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#EFF6FF" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #BFDBFE" }}>Tank Size</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BFDBFE" }}>Propane Gallons</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BFDBFE" }}>Full Weight</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BFDBFE" }}>Fill Cost</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: "600", borderBottom: "2px solid #BFDBFE" }}>BBQ Runtime</th>
                </tr>
              </thead>
              <tbody>
                {quickReferenceData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "12px 16px", fontWeight: "500" }}>{row.tankSize}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center", color: "#2563EB", fontWeight: "600" }}>{row.gallons}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.weight}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.fillCost}</td>
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>{row.lastsBBQ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: "12px 0 0 0" }}>
              * Gallon tanks shown at 80% fill capacity. BBQ runtime based on 30,000 BTU grill.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BFDBFE", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ⛽ Understanding Propane Tank Sizes
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  Propane tanks come in two main categories: <strong>portable cylinders</strong> measured in pounds (lb) 
                  and <strong>stationary tanks</strong> measured in gallons. Understanding the difference is crucial 
                  for calculating capacity, weight, and cost.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Key Conversion Factors</h3>
                <div style={{
                  backgroundColor: "#EFF6FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BFDBFE"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2" }}>
                    <li><strong>1 gallon propane = 4.24 pounds</strong> (at 60°F)</li>
                    <li><strong>1 gallon propane = 91,500 BTU</strong> of energy</li>
                    <li><strong>1 pound propane = 21,591 BTU</strong> of energy</li>
                    <li><strong>Max fill = 80%</strong> of tank capacity (safety rule)</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Pound Tanks vs Gallon Tanks</h3>
                <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
                  <div style={{ backgroundColor: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #A7F3D0" }}>
                    <h4 style={{ color: "#065F46", margin: "0 0 8px 0" }}>📦 Pound Tanks (lb)</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#047857" }}>
                      Portable cylinders rated by propane weight. A &quot;100 lb tank&quot; holds 100 lbs of propane 
                      (23.6 gallons). Common sizes: 20, 30, 40, 100 lb.
                    </p>
                  </div>
                  <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
                    <h4 style={{ color: "#1D4ED8", margin: "0 0 8px 0" }}>🏠 Gallon Tanks</h4>
                    <p style={{ fontSize: "0.9rem", margin: 0, color: "#2563EB" }}>
                      Stationary tanks rated by volume. A &quot;100 gallon tank&quot; holds up to 80 gallons 
                      (80% fill = 339 lbs). Common sizes: 100, 250, 500, 1000 gallon.
                    </p>
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 80% Fill Rule</h3>
                <p>
                  All propane tanks are filled to only 80% capacity. This isn&apos;t to cheat you—it&apos;s a critical 
                  safety measure. Propane expands approximately 1.5% for every 10°F increase in temperature. 
                  The 20% headspace prevents dangerous over-pressurization during hot weather.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Did You Know */}
            <div style={{ backgroundColor: "#2563EB", borderRadius: "16px", padding: "24px", marginBottom: "24px", color: "white" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "16px" }}>💡 Did You Know?</h3>
              <div style={{ fontSize: "0.9rem", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 12px 0" }}>A <strong>100 gallon tank</strong> holds 3.4× more propane than a <strong>100 lb tank</strong></p>
                <p style={{ margin: "0 0 12px 0" }}>Propane doesn&apos;t expire - it can be stored indefinitely</p>
                <p style={{ margin: "0" }}>Refilling saves <strong>20-40%</strong> vs tank exchange programs</p>
              </div>
            </div>

            {/* Safety Tips */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "16px" }}>⚠️ Safety Tips</h3>
              <ul style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8", margin: 0, paddingLeft: "16px" }}>
                <li>Store tanks upright outdoors</li>
                <li>Check for leaks with soapy water</li>
                <li>Never store near ignition sources</li>
                <li>Transport in well-ventilated vehicle</li>
                <li>Requalify tanks every 5-12 years</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/propane-tank-calculator" currentCategory="Home" />
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
          <p style={{ fontSize: "0.75rem", color: "#1D4ED8", textAlign: "center", margin: 0 }}>
            ⛽ <strong>Disclaimer:</strong> These calculations are estimates based on standard propane properties at 60°F. 
            Actual values may vary based on temperature, tank condition, and local regulations. 
            Always consult with a licensed propane dealer for specific requirements.
          </p>
        </div>
      </div>
    </div>
  );
}