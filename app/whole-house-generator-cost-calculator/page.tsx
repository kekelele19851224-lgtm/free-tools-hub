"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How much does it cost to install a whole house generator?",
    answer: "The total cost to install a whole house generator typically ranges from $6,000 to $25,000, with most homeowners spending between $7,000 and $15,000. This includes the generator unit ($2,000-$10,000), automatic transfer switch ($600-$1,200), installation labor ($2,000-$5,000), and permits ($100-$500). Costs vary based on generator size, fuel type, and installation complexity."
  },
  {
    question: "How much is a generator for a 2000 sq ft house?",
    answer: "For a 2,000 square foot house, you'll typically need an 18-22 kW generator to power most or all of your home. Expect to pay $8,000-$15,000 total installed. If you only need essentials (lights, fridge, sump pump), a 14-16 kW unit at $6,000-$10,000 may suffice. For whole-home coverage including HVAC, plan for the higher end of that range."
  },
  {
    question: "Are whole house generators worth it?",
    answer: "Yes, whole house generators are generally worth the investment. According to Consumer Reports and Remodeling magazine, they provide up to 150% return on investment and can increase home value by about 5%. They're especially valuable if you work from home, have medical equipment, live in areas with frequent outages, or want to protect expensive refrigerated items and prevent pipe freezing."
  },
  {
    question: "Is a whole house generator tax deductible?",
    answer: "Generally, whole house generators are not tax deductible for most homeowners. However, there are exceptions: if you need the generator for medical equipment (with doctor's documentation), you may deduct it as a medical expense. If you use part of your home for business, you may deduct a portion. Some states offer energy credits. Consult a tax professional for your specific situation."
  },
  {
    question: "What size generator do I need for my house?",
    answer: "Generator size depends on your home's square footage and what you want to power. For essentials only: 10-14 kW. For most home needs including HVAC: 16-22 kW. For whole-home coverage: 22-30+ kW. A 2,000 sq ft home typically needs 18-22 kW for full coverage. Calculate your total wattage needs or use our calculator above for a personalized recommendation."
  },
  {
    question: "How long do whole house generators last?",
    answer: "Quality whole house generators typically last 15-30 years or 10,000-30,000 running hours with proper maintenance. Brands like Generac, Kohler, and Cummins are known for longevity. Regular maintenance ($300-$600/year) including oil changes, filter replacements, and annual inspections is essential to maximize lifespan. Most come with 5-year warranties, with extended warranties available."
  },
  {
    question: "Natural gas vs propane generator: which is better?",
    answer: "Both have pros and cons. Natural gas is convenient if you have an existing gas line - no fuel storage needed and unlimited supply. Propane is better for off-grid homes, stores indefinitely, and works during natural gas outages. Natural gas is typically cheaper per kWh but propane generators are often less expensive upfront. Choose based on your home's existing infrastructure and local fuel costs."
  },
  {
    question: "How much does it cost to run a whole house generator per day?",
    answer: "Running costs range from $30-$170 per day depending on generator size and fuel type. A 20 kW generator uses about 2.5-3.5 gallons of propane per hour at full load, or 200-300 cubic feet of natural gas. At typical fuel prices, expect $3-$8 per hour of operation. Most outages are short, so annual fuel costs for typical use are $100-$300 plus $300-$600 for maintenance."
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

// Cost data
const generatorSizeByHome: { [key: number]: { essentials: number; most: number; whole: number } } = {
  1000: { essentials: 10, most: 14, whole: 18 },
  1500: { essentials: 12, most: 16, whole: 20 },
  2000: { essentials: 14, most: 18, whole: 22 },
  2500: { essentials: 16, most: 20, whole: 24 },
  3000: { essentials: 18, most: 22, whole: 26 },
  3500: { essentials: 20, most: 26, whole: 30 }
};

const generatorCostByKw: { [key: number]: [number, number] } = {
  10: [2000, 3500],
  12: [2500, 4000],
  14: [3000, 4500],
  16: [3500, 5000],
  18: [4000, 5500],
  20: [4500, 6500],
  22: [5000, 7500],
  24: [5500, 8500],
  26: [6000, 10000],
  30: [7500, 13000]
};

const fuelTypeMultiplier: { [key: string]: number } = {
  natural_gas: 1.0,
  propane: 1.05,
  diesel: 1.15
};

const installCostByComplexity: { [key: string]: [number, number] } = {
  basic: [2000, 3500],
  moderate: [3500, 5500],
  complex: [5500, 10000]
};

const propaneTankCost: { [key: string]: [number, number] } = {
  none: [0, 0],
  "250": [1500, 2500],
  "500": [2500, 4000]
};

export default function WholeHouseGeneratorCostCalculator() {
  const [homeSize, setHomeSize] = useState<number>(2000);
  const [fuelType, setFuelType] = useState<string>("natural_gas");
  const [coverage, setCoverage] = useState<string>("most");
  const [complexity, setComplexity] = useState<string>("moderate");
  const [propaneTank, setPropaneTank] = useState<string>("none");

  const results = useMemo(() => {
    // Get recommended kW based on home size and coverage
    const sizeData = generatorSizeByHome[homeSize];
    const recommendedKw = sizeData[coverage as keyof typeof sizeData];

    // Get generator cost
    const [genLow, genHigh] = generatorCostByKw[recommendedKw] || [4000, 6000];
    
    // Apply fuel type multiplier
    const fuelMult = fuelTypeMultiplier[fuelType];
    const generatorLow = Math.round(genLow * fuelMult);
    const generatorHigh = Math.round(genHigh * fuelMult);

    // Transfer switch cost
    const transferSwitchLow = 600 + (recommendedKw > 20 ? 200 : 0);
    const transferSwitchHigh = 1200 + (recommendedKw > 20 ? 300 : 0);

    // Installation cost
    const [installLow, installHigh] = installCostByComplexity[complexity];

    // Propane tank cost (only if propane selected)
    let tankLow = 0;
    let tankHigh = 0;
    if (fuelType === "propane" && propaneTank !== "none") {
      [tankLow, tankHigh] = propaneTankCost[propaneTank];
    }

    // Permits and other costs
    const permitsLow = 100 + (complexity === "complex" ? 100 : 0);
    const permitsHigh = 500 + (complexity === "complex" ? 200 : 0);

    // Electrical work (if needed for complex)
    const electricalLow = complexity === "complex" ? 500 : 0;
    const electricalHigh = complexity === "complex" ? 1500 : 0;

    // Gas line work
    const gasLineLow = complexity === "basic" ? 0 : (complexity === "moderate" ? 300 : 800);
    const gasLineHigh = complexity === "basic" ? 200 : (complexity === "moderate" ? 800 : 2000);

    // Total
    const totalLow = generatorLow + transferSwitchLow + installLow + tankLow + permitsLow + electricalLow + gasLineLow;
    const totalHigh = generatorHigh + transferSwitchHigh + installHigh + tankHigh + permitsHigh + electricalHigh + gasLineHigh;

    // Annual operating costs
    const maintenanceLow = 300;
    const maintenanceHigh = 600;
    const fuelCostLow = 100; // Typical annual fuel for occasional use
    const fuelCostHigh = 400;
    const annualLow = maintenanceLow + fuelCostLow;
    const annualHigh = maintenanceHigh + fuelCostHigh;

    // ROI / Home value increase (approximately 5%)
    const homeValueIncrease = Math.round((totalLow + totalHigh) / 2 * 0.5); // Rough estimate

    return {
      recommendedKw,
      generatorLow,
      generatorHigh,
      transferSwitchLow,
      transferSwitchHigh,
      installLow,
      installHigh,
      tankLow,
      tankHigh,
      permitsLow,
      permitsHigh,
      electricalLow,
      electricalHigh,
      gasLineLow,
      gasLineHigh,
      totalLow,
      totalHigh,
      annualLow,
      annualHigh,
      homeValueIncrease,
      coverage
    };
  }, [homeSize, fuelType, coverage, complexity, propaneTank]);

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F0FDF4" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #BBF7D0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Whole House Generator Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>⚡</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Whole House Generator Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate the total cost of a whole house generator including unit, installation, and equipment. 
            Get a personalized cost breakdown based on your home size and needs.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#DCFCE7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BBF7D0"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#166534", margin: "0 0 4px 0" }}>
                <strong>Quick Answer:</strong> Whole house generators cost $6,000 - $25,000 installed
              </p>
              <p style={{ color: "#15803D", margin: 0, fontSize: "0.95rem" }}>
                Most homeowners spend $7,000 - $15,000 for a complete installation. Use the calculator below for a personalized estimate.
              </p>
            </div>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #BBF7D0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#16A34A", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                🏠 Your Home Details
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Home Size */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  Home Size (Square Feet)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {[1000, 1500, 2000, 2500, 3000, 3500].map((size) => (
                    <button
                      key={size}
                      onClick={() => setHomeSize(size)}
                      style={{
                        padding: "12px 8px",
                        borderRadius: "8px",
                        border: homeSize === size ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: homeSize === size ? "#DCFCE7" : "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: homeSize === size ? "600" : "400",
                        color: homeSize === size ? "#166534" : "#4B5563"
                      }}
                    >
                      {size === 3500 ? "3,500+" : size.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  ⛽ Fuel Type
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { value: "natural_gas", label: "🔵 Natural Gas" },
                    { value: "propane", label: "🟠 Propane (LP)" },
                    { value: "diesel", label: "⚫ Diesel" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFuelType(option.value);
                        if (option.value !== "propane") setPropaneTank("none");
                      }}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "8px",
                        border: fuelType === option.value ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: fuelType === option.value ? "#DCFCE7" : "white",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: fuelType === option.value ? "600" : "400",
                        color: fuelType === option.value ? "#166534" : "#4B5563",
                        flex: "1",
                        minWidth: "100px"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coverage Level */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🔌 What Do You Want to Power?
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { value: "essentials", label: "Essentials Only", desc: "Lights, fridge, sump pump, some outlets" },
                    { value: "most", label: "Most of Home", desc: "+ HVAC, kitchen appliances, garage" },
                    { value: "whole", label: "Whole Home", desc: "Everything including EV charger, pool, etc." }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCoverage(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: coverage === option.value ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: coverage === option.value ? "#DCFCE7" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: coverage === option.value ? "#166534" : "#374151", fontSize: "0.95rem" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "2px" }}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Installation Complexity */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                  🔧 Installation Complexity
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { value: "basic", label: "Basic", desc: "Near electrical panel, existing gas line" },
                    { value: "moderate", label: "Moderate", desc: "Some trenching or gas line extension" },
                    { value: "complex", label: "Complex", desc: "New gas line, long distance, upgrades needed" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setComplexity(option.value)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "8px",
                        border: complexity === option.value ? "2px solid #16A34A" : "1px solid #E5E7EB",
                        backgroundColor: complexity === option.value ? "#DCFCE7" : "white",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: complexity === option.value ? "#166534" : "#374151", fontSize: "0.95rem" }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "2px" }}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Propane Tank (conditional) */}
              {fuelType === "propane" && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "12px", fontWeight: "600" }}>
                    📦 Need a New Propane Tank?
                  </label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      { value: "none", label: "No / Already Have" },
                      { value: "250", label: "250 Gallon" },
                      { value: "500", label: "500 Gallon" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPropaneTank(option.value)}
                        style={{
                          padding: "10px 16px",
                          borderRadius: "8px",
                          border: propaneTank === option.value ? "2px solid #16A34A" : "1px solid #E5E7EB",
                          backgroundColor: propaneTank === option.value ? "#DCFCE7" : "white",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: propaneTank === option.value ? "600" : "400",
                          color: propaneTank === option.value ? "#166534" : "#4B5563",
                          flex: "1"
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="calc-results" style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #BBF7D0",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#15803D", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                💰 Cost Estimate
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Recommended Size */}
              <div style={{
                backgroundColor: "#F0FDF4",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid #BBF7D0",
                textAlign: "center"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#166534" }}>Recommended Generator Size</p>
                <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#16A34A" }}>
                  {results.recommendedKw} kW
                </p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                  For {homeSize.toLocaleString()} sq ft home ({results.coverage === "essentials" ? "essentials" : results.coverage === "most" ? "most appliances" : "whole home"})
                </p>
              </div>

              {/* Cost Breakdown */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.95rem", fontWeight: "600" }}>
                  Cost Breakdown:
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Generator Unit ({results.recommendedKw} kW)</span>
                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.generatorLow)} - {formatCurrency(results.generatorHigh)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Automatic Transfer Switch</span>
                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.transferSwitchLow)} - {formatCurrency(results.transferSwitchHigh)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Installation Labor</span>
                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.installLow)} - {formatCurrency(results.installHigh)}</span>
                  </div>
                  {(results.gasLineLow > 0 || results.gasLineHigh > 0) && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Gas Line Work</span>
                      <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.gasLineLow)} - {formatCurrency(results.gasLineHigh)}</span>
                    </div>
                  )}
                  {(results.electricalLow > 0 || results.electricalHigh > 0) && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Electrical Upgrades</span>
                      <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.electricalLow)} - {formatCurrency(results.electricalHigh)}</span>
                    </div>
                  )}
                  {(results.tankLow > 0 || results.tankHigh > 0) && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                      <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Propane Tank</span>
                      <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.tankLow)} - {formatCurrency(results.tankHigh)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563", fontSize: "0.9rem" }}>Permits & Fees</span>
                    <span style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>{formatCurrency(results.permitsLow)} - {formatCurrency(results.permitsHigh)}</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div style={{
                backgroundColor: "#16A34A",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#BBF7D0" }}>Total Estimated Cost</p>
                <p style={{ margin: 0, fontSize: "1.75rem", fontWeight: "bold", color: "white" }}>
                  {formatCurrency(results.totalLow)} - {formatCurrency(results.totalHigh)}
                </p>
              </div>

              {/* Annual Operating Costs */}
              <div style={{
                backgroundColor: "#FEF3C7",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid #FCD34D"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.9rem", fontWeight: "600" }}>
                  📊 Annual Operating Costs
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#B45309", fontSize: "0.85rem" }}>Maintenance & Fuel:</span>
                  <span style={{ fontWeight: "600", color: "#92400E", fontSize: "0.85rem" }}>{formatCurrency(results.annualLow)} - {formatCurrency(results.annualHigh)}/year</span>
                </div>
                <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#B45309" }}>
                  Includes annual service, oil changes, and typical fuel usage for occasional outages.
                </p>
              </div>

              {/* ROI Info */}
              <div style={{
                backgroundColor: "#EEF2FF",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #C7D2FE"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#4F46E5", fontSize: "0.9rem", fontWeight: "600" }}>
                  📈 Investment Value
                </h4>
                <div style={{ fontSize: "0.85rem", color: "#4338CA", lineHeight: "1.6" }}>
                  <p style={{ margin: "0 0 4px 0" }}>• Home value increase: ~5% (up to {formatCurrency(results.homeValueIncrease)})</p>
                  <p style={{ margin: "0 0 4px 0" }}>• ROI potential: Up to 150%</p>
                  <p style={{ margin: 0 }}>• Generator lifespan: 15-30 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Tables */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BBF7D0", padding: "32px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
            📋 Generator Cost by Size
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F0FDF4" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #BBF7D0", color: "#166534" }}>Generator Size</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #BBF7D0", color: "#166534" }}>Best For</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #BBF7D0", color: "#166534" }}>Unit Cost</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #BBF7D0", color: "#166534" }}>Total Installed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { kw: "10-14 kW", use: "Essentials only (small home)", unit: "$2,000 - $4,500", total: "$5,000 - $9,000" },
                  { kw: "16-18 kW", use: "Most home (1,500-2,000 sq ft)", unit: "$3,500 - $5,500", total: "$7,000 - $12,000" },
                  { kw: "20-22 kW", use: "Whole home (2,000-2,500 sq ft)", unit: "$4,500 - $7,500", total: "$9,000 - $15,000" },
                  { kw: "24-26 kW", use: "Large home (2,500-3,000 sq ft)", unit: "$5,500 - $10,000", total: "$11,000 - $20,000" },
                  { kw: "30+ kW", use: "Very large home (3,500+ sq ft)", unit: "$7,500 - $15,000", total: "$15,000 - $25,000+" }
                ].map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600", color: "#16A34A" }}>{row.kw}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#4B5563" }}>{row.use}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#111827" }}>{row.unit}</td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#111827", fontWeight: "600" }}>{row.total}</td>
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
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BBF7D0", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
                ⚡ Understanding Whole House Generator Costs
              </h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A whole house generator (also called a standby generator) is a permanently installed backup power system 
                  that automatically turns on during a power outage. Unlike portable generators, these units are wired directly 
                  to your electrical panel and can power your entire home.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What&apos;s Included in the Cost?</h3>
                <div style={{
                  backgroundColor: "#F0FDF4",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #BBF7D0"
                }}>
                  <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "2.2" }}>
                    <li><strong>Generator Unit:</strong> The main equipment ($2,000 - $15,000 depending on size)</li>
                    <li><strong>Automatic Transfer Switch (ATS):</strong> Detects outages and switches power ($600 - $1,500)</li>
                    <li><strong>Installation Labor:</strong> Electrical, plumbing, and site work ($2,000 - $10,000)</li>
                    <li><strong>Fuel Connection:</strong> Gas line or propane tank setup ($200 - $4,000)</li>
                    <li><strong>Permits:</strong> Local building and electrical permits ($100 - $500)</li>
                    <li><strong>Concrete Pad:</strong> Foundation for the generator ($200 - $500)</li>
                  </ul>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Factors That Affect Price</h3>
                <div style={{ display: "grid", gap: "12px", margin: "16px 0" }}>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🏠 Home Size:</strong> Larger homes need bigger generators with higher output capacity
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>⛽ Fuel Type:</strong> Natural gas is convenient, propane offers independence, diesel is most powerful
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>📍 Location:</strong> Distance from panel, gas meter, and site accessibility affect labor costs
                  </div>
                  <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
                    <strong>🔧 Brand:</strong> Generac, Kohler, and Cummins are top brands with varying price points
                  </div>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Popular Generator Brands</h3>
                <div style={{
                  backgroundColor: "#EEF2FF",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "16px 0",
                  border: "1px solid #C7D2FE"
                }}>
                  <p style={{ margin: "0 0 12px 0" }}><strong>Generac:</strong> Market leader, wide range of sizes, typically $3,000 - $12,000 for the unit</p>
                  <p style={{ margin: "0 0 12px 0" }}><strong>Kohler:</strong> Premium quality, quieter operation, typically $4,000 - $15,000</p>
                  <p style={{ margin: "0" }}><strong>Cummins:</strong> Industrial durability, excellent warranties, typically $3,500 - $14,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Size Guide */}
            <div style={{ backgroundColor: "#F0FDF4", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BBF7D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#166534", marginBottom: "16px" }}>📐 Quick Size Guide</h3>
              <div style={{ fontSize: "0.9rem", color: "#15803D", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• 1,000 sq ft → 10-14 kW</p>
                <p style={{ margin: 0 }}>• 1,500 sq ft → 14-18 kW</p>
                <p style={{ margin: 0 }}>• 2,000 sq ft → 18-22 kW</p>
                <p style={{ margin: 0 }}>• 2,500 sq ft → 20-24 kW</p>
                <p style={{ margin: 0 }}>• 3,000 sq ft → 22-26 kW</p>
                <p style={{ margin: 0 }}>• 3,500+ sq ft → 26-30+ kW</p>
              </div>
            </div>

            {/* Worth It Box */}
            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "16px" }}>💡 Is It Worth It?</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>Consider a generator if you:</p>
                <p style={{ margin: 0 }}>✓ Work from home</p>
                <p style={{ margin: 0 }}>✓ Have medical equipment</p>
                <p style={{ margin: 0 }}>✓ Experience frequent outages</p>
                <p style={{ margin: 0 }}>✓ Have a sump pump</p>
                <p style={{ margin: 0 }}>✓ Want to protect food/pipes</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/whole-house-generator-cost-calculator" currentCategory="Home" />
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #BBF7D0", padding: "32px", marginBottom: "24px" }}>
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
        <div style={{ padding: "16px", backgroundColor: "#F0FDF4", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: "0.75rem", color: "#166534", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Disclaimer:</strong> These are estimated costs based on national averages and may vary significantly 
            based on your location, specific requirements, and market conditions. Always get multiple quotes from licensed 
            contractors for accurate pricing. Prices shown are for informational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}