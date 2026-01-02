"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Additional services
const additionalServices = [
  { id: "radon", name: "Radon Testing", low: 125, high: 225, description: "Tests for radon gas" },
  { id: "mold", name: "Mold Inspection", low: 250, high: 350, description: "Checks for mold growth" },
  { id: "termite", name: "Termite/Pest", low: 75, high: 150, description: "Wood-destroying insects" },
  { id: "sewer", name: "Sewer Scope", low: 150, high: 300, description: "Camera inspection of sewer lines" },
  { id: "pool", name: "Pool/Spa", low: 150, high: 300, description: "Pool equipment & structure" },
  { id: "chimney", name: "Chimney/Fireplace", low: 100, high: 200, description: "Flue and firebox inspection" },
  { id: "roof", name: "Detailed Roof", low: 75, high: 200, description: "Beyond standard visual check" },
  { id: "foundation", name: "Foundation", low: 150, high: 300, description: "Structural foundation inspection" },
];

// Quick reference data
const quickReference = [
  { sqft: 1000, label: "Small" },
  { sqft: 1500, label: "Medium" },
  { sqft: 2000, label: "Average" },
  { sqft: 2500, label: "Large" },
  { sqft: 3000, label: "Very Large" },
  { sqft: 4000, label: "Luxury" },
];

// FAQ data
const faqs = [
  {
    question: "How much does a home inspection cost?",
    answer: "The national average for a home inspection is $300-$450, but costs range from $200 for small homes under 1,000 sq ft to $500-$800+ for large homes over 3,000 sq ft. Factors affecting price include square footage, home age, property type, location, and any additional inspections like radon or mold testing."
  },
  {
    question: "What is the biggest red flag in a home inspection?",
    answer: "The biggest red flags include: foundation issues (cracks, water intrusion, settling), roof damage requiring replacement, electrical panel problems (especially Federal Pacific or Zinsco panels), evidence of water damage or mold, structural issues like sagging floors or cracked walls, and HVAC systems at end of life. These can indicate costly repairs ranging from $5,000 to $50,000+."
  },
  {
    question: "How to calculate home inspection cost?",
    answer: "Most inspectors charge $0.18-$0.25 per square foot, with a base rate of $250-$350 for homes up to 2,000 sq ft. Add $25-$50 for each additional 500 sq ft. Factor in premiums for older homes (+$50-$200 for pre-1980), multi-story properties, and your local market. Additional inspections like radon ($125-$225) or termite ($75-$150) are charged separately."
  },
  {
    question: "What does a standard home inspection cover?",
    answer: "A standard inspection covers: roof and attic, foundation and structure, exterior (siding, windows, doors), plumbing systems, electrical systems, HVAC (heating, ventilation, air conditioning), interior (walls, ceilings, floors), insulation, ventilation, and built-in appliances. It does NOT typically include radon, mold, termites, sewer lines, pools, or specialized testing."
  },
  {
    question: "Should I get additional inspections like radon or mold?",
    answer: "Yes, in many cases. Radon testing ($125-$225) is recommended for all homes—radon is the #2 cause of lung cancer. Mold inspection ($250-$350) is wise if you see water stains or smell musty odors. Termite inspection ($75-$150) is essential in southern states. Sewer scope ($150-$300) is smart for older homes with mature trees near sewer lines."
  },
  {
    question: "How long does a home inspection take?",
    answer: "A typical home inspection takes 2-4 hours depending on the home's size. A 1,500 sq ft home takes about 2-2.5 hours, while a 3,000+ sq ft home may take 3-4 hours or more. Add 30-60 minutes for each additional service like radon or termite testing. Buyers are encouraged to attend and ask questions during the inspection."
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

export default function HomeInspectionCostCalculator() {
  // Inputs
  const [squareFootage, setSquareFootage] = useState<string>("2000");
  const [homeAge, setHomeAge] = useState<"new" | "mid" | "old" | "veryOld">("mid");
  const [propertyType, setPropertyType] = useState<"condo" | "townhouse" | "single" | "multi">("single");
  const [areaLevel, setAreaLevel] = useState<"low" | "average" | "high" | "veryHigh">("average");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Results
  const [results, setResults] = useState({
    baseLow: 0,
    baseHigh: 0,
    ageAdjustLow: 0,
    ageAdjustHigh: 0,
    servicesLow: 0,
    servicesHigh: 0,
    totalLow: 0,
    totalHigh: 0,
    estimatedHours: 0,
  });

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Calculate
  useEffect(() => {
    const sqft = parseFloat(squareFootage) || 0;
    
    // Base cost calculation (per sq ft method)
    let baseLow = 0;
    let baseHigh = 0;
    
    if (sqft <= 1000) {
      baseLow = 200;
      baseHigh = 300;
    } else if (sqft <= 1500) {
      baseLow = 250;
      baseHigh = 350;
    } else if (sqft <= 2000) {
      baseLow = 300;
      baseHigh = 400;
    } else if (sqft <= 2500) {
      baseLow = 350;
      baseHigh = 450;
    } else if (sqft <= 3000) {
      baseLow = 400;
      baseHigh = 500;
    } else if (sqft <= 4000) {
      baseLow = 450;
      baseHigh = 600;
    } else {
      baseLow = 500 + ((sqft - 4000) / 500) * 25;
      baseHigh = 700 + ((sqft - 4000) / 500) * 35;
    }
    
    // Property type adjustment
    const typeMultipliers = {
      condo: { low: 0.75, high: 0.85 },
      townhouse: { low: 1.0, high: 1.0 },
      single: { low: 1.0, high: 1.0 },
      multi: { low: 1.35, high: 1.5 },
    };
    baseLow *= typeMultipliers[propertyType].low;
    baseHigh *= typeMultipliers[propertyType].high;
    
    // Area cost adjustment
    const areaMultipliers = {
      low: 0.85,
      average: 1.0,
      high: 1.15,
      veryHigh: 1.30,
    };
    baseLow *= areaMultipliers[areaLevel];
    baseHigh *= areaMultipliers[areaLevel];
    
    // Age adjustment (added to base, not multiplied)
    const ageAdjustments = {
      new: { low: 0, high: 0 },
      mid: { low: 0, high: 50 },
      old: { low: 50, high: 100 },
      veryOld: { low: 100, high: 200 },
    };
    const ageAdjustLow = ageAdjustments[homeAge].low;
    const ageAdjustHigh = ageAdjustments[homeAge].high;
    
    // Additional services
    let servicesLow = 0;
    let servicesHigh = 0;
    selectedServices.forEach(serviceId => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service) {
        servicesLow += service.low;
        servicesHigh += service.high;
      }
    });
    
    // Total
    const totalLow = Math.round(baseLow + ageAdjustLow + servicesLow);
    const totalHigh = Math.round(baseHigh + ageAdjustHigh + servicesHigh);
    
    // Estimated hours
    let estimatedHours = 2;
    if (sqft > 1500) estimatedHours = 2.5;
    if (sqft > 2000) estimatedHours = 3;
    if (sqft > 3000) estimatedHours = 3.5;
    if (sqft > 4000) estimatedHours = 4;
    estimatedHours += selectedServices.length * 0.25;
    
    setResults({
      baseLow: Math.round(baseLow),
      baseHigh: Math.round(baseHigh),
      ageAdjustLow,
      ageAdjustHigh,
      servicesLow,
      servicesHigh,
      totalLow,
      totalHigh,
      estimatedHours,
    });
  }, [squareFootage, homeAge, propertyType, areaLevel, selectedServices]);

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate for quick reference
  const calculateQuickRef = (sqft: number) => {
    let low = 0;
    let high = 0;
    if (sqft <= 1000) { low = 200; high = 300; }
    else if (sqft <= 1500) { low = 250; high = 350; }
    else if (sqft <= 2000) { low = 300; high = 400; }
    else if (sqft <= 2500) { low = 350; high = 450; }
    else if (sqft <= 3000) { low = 400; high = 500; }
    else { low = 450; high = 600; }
    
    return {
      basic: { low, high },
      withRadon: { low: low + 125, high: high + 225 },
      fullPackage: { low: low + 350, high: high + 675 },
    };
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Home Inspection Cost Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏠</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Home Inspection Cost Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your home inspection costs based on square footage, home age, location, and additional services like radon or mold testing.
          </p>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Property Details */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    🏡 Property Details
                  </h3>

                  {/* Square Footage */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Square Footage
                    </label>
                    <input
                      type="number"
                      value={squareFootage}
                      onChange={(e) => setSquareFootage(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "2px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "600"
                      }}
                      min="500"
                      max="20000"
                    />
                    <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                      {["1000", "1500", "2000", "2500", "3000"].map((val) => (
                        <button
                          key={val}
                          onClick={() => setSquareFootage(val)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: squareFootage === val ? "2px solid #0D9488" : "1px solid #E5E7EB",
                            backgroundColor: squareFootage === val ? "#CCFBF1" : "white",
                            color: squareFootage === val ? "#0D9488" : "#6B7280",
                            fontSize: "0.75rem",
                            cursor: "pointer"
                          }}
                        >
                          {parseInt(val).toLocaleString()} sq ft
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Home Age */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Home Age
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { value: "new", label: "< 10 years", extra: "" },
                        { value: "mid", label: "10-30 years", extra: "" },
                        { value: "old", label: "30-50 years", extra: "+$50-100" },
                        { value: "veryOld", label: "50+ years", extra: "+$100-200" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setHomeAge(option.value as typeof homeAge)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "8px",
                            border: homeAge === option.value ? "2px solid #0D9488" : "1px solid #E5E7EB",
                            backgroundColor: homeAge === option.value ? "#CCFBF1" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <p style={{ fontWeight: "600", color: homeAge === option.value ? "#0D9488" : "#374151", margin: 0, fontSize: "0.8rem" }}>
                            {option.label}
                          </p>
                          {option.extra && (
                            <p style={{ fontSize: "0.65rem", color: "#F59E0B", margin: "2px 0 0 0" }}>{option.extra}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Property Type
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {[
                        { value: "condo", label: "Condo/Apt", extra: "-15-25%" },
                        { value: "townhouse", label: "Townhouse", extra: "" },
                        { value: "single", label: "Single Family", extra: "" },
                        { value: "multi", label: "Multi-Family", extra: "+35-50%" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setPropertyType(option.value as typeof propertyType)}
                          style={{
                            padding: "10px 8px",
                            borderRadius: "8px",
                            border: propertyType === option.value ? "2px solid #0D9488" : "1px solid #E5E7EB",
                            backgroundColor: propertyType === option.value ? "#CCFBF1" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <p style={{ fontWeight: "600", color: propertyType === option.value ? "#0D9488" : "#374151", margin: 0, fontSize: "0.8rem" }}>
                            {option.label}
                          </p>
                          {option.extra && (
                            <p style={{ fontSize: "0.65rem", color: option.extra.startsWith("-") ? "#059669" : "#F59E0B", margin: "2px 0 0 0" }}>{option.extra}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Area Cost Level */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                      Area Cost Level
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "6px" }}>
                      {[
                        { value: "low", label: "Low", mult: "0.85x" },
                        { value: "average", label: "Average", mult: "1.0x" },
                        { value: "high", label: "High", mult: "1.15x" },
                        { value: "veryHigh", label: "Metro", mult: "1.3x" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setAreaLevel(option.value as typeof areaLevel)}
                          style={{
                            padding: "8px 4px",
                            borderRadius: "6px",
                            border: areaLevel === option.value ? "2px solid #0D9488" : "1px solid #E5E7EB",
                            backgroundColor: areaLevel === option.value ? "#CCFBF1" : "white",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <p style={{ fontWeight: "600", color: areaLevel === option.value ? "#0D9488" : "#374151", margin: 0, fontSize: "0.7rem" }}>
                            {option.label}
                          </p>
                          <p style={{ fontSize: "0.6rem", color: "#6B7280", margin: "2px 0 0 0" }}>{option.mult}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    ➕ Additional Inspections
                  </h3>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {additionalServices.map((service) => (
                      <label
                        key={service.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          backgroundColor: selectedServices.includes(service.id) ? "#CCFBF1" : "white",
                          border: selectedServices.includes(service.id) ? "2px solid #0D9488" : "1px solid #E5E7EB",
                          borderRadius: "8px",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => toggleService(service.id)}
                            style={{ width: "16px", height: "16px", accentColor: "#0D9488" }}
                          />
                          <div>
                            <span style={{ fontWeight: "500", color: "#374151", fontSize: "0.85rem" }}>{service.name}</span>
                            <p style={{ fontSize: "0.7rem", color: "#6B7280", margin: "2px 0 0 0" }}>{service.description}</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "#0D9488", fontWeight: "600" }}>
                          ${service.low}-${service.high}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                {/* Total Estimate */}
                <div style={{
                  backgroundColor: "#0D9488",
                  padding: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginBottom: "20px"
                }}>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", marginBottom: "4px" }}>
                    Estimated Total Cost
                  </p>
                  <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "white", margin: "0 0 8px 0" }}>
                    {formatCurrency(results.totalLow)} - {formatCurrency(results.totalHigh)}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "24px" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: "0 0 2px 0" }}>Duration</p>
                      <p style={{ fontSize: "1rem", fontWeight: "600", color: "white", margin: 0 }}>~{results.estimatedHours} hours</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: "0 0 2px 0" }}>Services</p>
                      <p style={{ fontSize: "1rem", fontWeight: "600", color: "white", margin: 0 }}>{selectedServices.length + 1} included</p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", marginBottom: "12px", fontSize: "0.95rem" }}>
                    📋 Cost Breakdown
                  </h4>
                  <div style={{ display: "grid", gap: "10px", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                      <span style={{ color: "#6B7280" }}>Base Inspection ({parseInt(squareFootage).toLocaleString()} sq ft)</span>
                      <span style={{ fontWeight: "600" }}>{formatCurrency(results.baseLow)} - {formatCurrency(results.baseHigh)}</span>
                    </div>
                    {(results.ageAdjustLow > 0 || results.ageAdjustHigh > 0) && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Older Home Premium</span>
                        <span style={{ fontWeight: "600", color: "#F59E0B" }}>+{formatCurrency(results.ageAdjustLow)} - {formatCurrency(results.ageAdjustHigh)}</span>
                      </div>
                    )}
                    {selectedServices.length > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #E5E7EB" }}>
                        <span style={{ color: "#6B7280" }}>Additional Services ({selectedServices.length})</span>
                        <span style={{ fontWeight: "600", color: "#0D9488" }}>+{formatCurrency(results.servicesLow)} - {formatCurrency(results.servicesHigh)}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#CCFBF1", margin: "-4px -8px", padding: "12px 8px", borderRadius: "6px" }}>
                      <span style={{ fontWeight: "700", color: "#0F766E" }}>TOTAL ESTIMATE</span>
                      <span style={{ fontWeight: "700", color: "#0F766E" }}>{formatCurrency(results.totalLow)} - {formatCurrency(results.totalHigh)}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Services */}
                {selectedServices.length > 0 && (
                  <div style={{ backgroundColor: "#F0FDFA", padding: "16px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #99F6E4" }}>
                    <h4 style={{ fontWeight: "600", color: "#0F766E", marginBottom: "8px", fontSize: "0.9rem" }}>
                      ✅ Selected Add-Ons
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {selectedServices.map(id => {
                        const service = additionalServices.find(s => s.id === id);
                        return service ? (
                          <span key={id} style={{ 
                            padding: "4px 10px", 
                            backgroundColor: "#0D9488", 
                            color: "white", 
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "500"
                          }}>
                            {service.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "8px", border: "1px solid #FDE68A" }}>
                  <h4 style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px", fontSize: "0.9rem" }}>
                    💡 Pro Tips
                  </h4>
                  <ul style={{ fontSize: "0.8rem", color: "#A16207", margin: 0, paddingLeft: "16px" }}>
                    <li style={{ marginBottom: "4px" }}>Get quotes from 3+ inspectors before deciding</li>
                    <li style={{ marginBottom: "4px" }}>Attend the inspection and ask questions</li>
                    <li>The cheapest inspector isn&apos;t always the best</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "32px",
          marginBottom: "40px"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            📊 Home Inspection Cost by Square Footage
          </h2>
          <p style={{ color: "#6B7280", marginBottom: "20px" }}>
            National average costs for standard single-family homes
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#F3F4F6" }}>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left" }}>Size</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>Basic Inspection</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center" }}>+ Radon</th>
                  <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", backgroundColor: "#CCFBF1" }}>Full Package*</th>
                </tr>
              </thead>
              <tbody>
                {quickReference.map((row, index) => {
                  const calc = calculateQuickRef(row.sqft);
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "600" }}>
                        {row.sqft.toLocaleString()} sq ft
                        <span style={{ fontSize: "0.75rem", color: "#6B7280", display: "block" }}>{row.label}</span>
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        ${calc.basic.low} - ${calc.basic.high}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                        ${calc.withRadon.low} - ${calc.withRadon.high}
                      </td>
                      <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#0D9488", fontWeight: "600" }}>
                        ${calc.fullPackage.low} - ${calc.fullPackage.high}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "16px" }}>
            *Full Package = Basic + Radon + Termite + Sewer Scope
          </p>
        </div>

        {/* Content + Sidebar */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* What's Included */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                ✅ What&apos;s Included in a Standard Home Inspection
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { icon: "🏠", item: "Roof & Attic" },
                  { icon: "🧱", item: "Foundation & Structure" },
                  { icon: "🚿", item: "Plumbing Systems" },
                  { icon: "⚡", item: "Electrical Systems" },
                  { icon: "❄️", item: "HVAC Systems" },
                  { icon: "🪟", item: "Windows & Doors" },
                  { icon: "🧱", item: "Walls, Ceilings, Floors" },
                  { icon: "🏡", item: "Exterior & Siding" },
                  { icon: "🌡️", item: "Insulation & Ventilation" },
                  { icon: "🔌", item: "Built-in Appliances" },
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", backgroundColor: "#F0FDFA", borderRadius: "6px" }}>
                    <span>{item.icon}</span>
                    <span style={{ fontSize: "0.9rem", color: "#0F766E" }}>{item.item}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px", padding: "12px", backgroundColor: "#FEF2F2", borderRadius: "8px" }}>
                <p style={{ fontSize: "0.85rem", color: "#B91C1C", margin: 0 }}>
                  <strong>❌ NOT Included:</strong> Radon, mold, termites, sewer lines, pools, wells, septic systems, asbestos, lead paint
                </p>
              </div>
            </div>

            {/* Cost Factors */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                📈 Factors That Affect Inspection Cost
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>📐 Square Footage</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Primary cost driver. Larger homes = more time = higher cost. Typically $0.18-$0.25 per sq ft.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>🏚️ Home Age</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Older homes (pre-1980) often have outdated wiring, plumbing, or hazardous materials requiring extra scrutiny.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>📍 Location</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Urban areas with high cost of living charge 15-30% more than rural areas.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                  <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>🏢 Property Type</h4>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", margin: 0 }}>
                    Condos cost less (no roof/exterior), while multi-family properties cost more due to multiple systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Regional Costs */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🗺️ Average Cost by City
              </h3>
              <div style={{ display: "grid", gap: "8px" }}>
                {[
                  { city: "Detroit, MI", cost: "$300" },
                  { city: "Phoenix, AZ", cost: "$350" },
                  { city: "Denver, CO", cost: "$375" },
                  { city: "Los Angeles, CA", cost: "$400" },
                  { city: "Seattle, WA", cost: "$425" },
                  { city: "New Jersey", cost: "$430" },
                  { city: "New York, NY", cost: "$500" },
                  { city: "San Francisco", cost: "$550" },
                ].map((item, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>{item.city}</span>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0D9488" }}>{item.cost}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "12px", marginBottom: 0 }}>
                *Based on 2,000 sq ft single-family home
              </p>
            </div>

            {/* Related Tools */}
            <RelatedTools
              currentUrl="/home-inspection-cost-calculator"
              currentCategory="Home"
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
            🏠 <strong>Disclaimer:</strong> These are estimated costs based on national averages. Actual prices vary by location, inspector experience, and specific property conditions. Always get quotes from multiple certified inspectors (ASHI or InterNACHI members recommended) before making a decision.
          </p>
        </div>
      </div>
    </div>
  );
}
