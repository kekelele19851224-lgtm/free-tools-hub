"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// 车辆类型定价数据
const vehicleTypes: Record<string, { 
  baseFee: { min: number; max: number; avg: number };
  perMile: { min: number; max: number; avg: number };
  flatbedExtra: number;
  label: string;
  icon: string;
}> = {
  "car": { 
    baseFee: { min: 50, max: 100, avg: 75 },
    perMile: { min: 2.5, max: 5, avg: 3.5 },
    flatbedExtra: 25,
    label: "Car/Sedan",
    icon: "🚗"
  },
  "suv": { 
    baseFee: { min: 75, max: 125, avg: 100 },
    perMile: { min: 3, max: 6, avg: 4.5 },
    flatbedExtra: 35,
    label: "SUV/Truck",
    icon: "🚙"
  },
  "motorcycle": { 
    baseFee: { min: 50, max: 75, avg: 65 },
    perMile: { min: 2, max: 4, avg: 3 },
    flatbedExtra: 0,
    label: "Motorcycle",
    icon: "🏍️"
  },
  "rv": { 
    baseFee: { min: 100, max: 200, avg: 150 },
    perMile: { min: 4, max: 7, avg: 5.5 },
    flatbedExtra: 50,
    label: "RV/Camper",
    icon: "🚐"
  }
};

// AAA会员等级
const aaaTiers = [
  { name: "Classic", freeMiles: 5, perMileAfter: 4, yearlyFee: 56 },
  { name: "Plus", freeMiles: 100, perMileAfter: 4, yearlyFee: 100 },
  { name: "Premier", freeMiles: 200, perMileAfter: 4, yearlyFee: 124 }
];

// 附加服务
const additionalServices: Record<string, { min: number; max: number; avg: number; label: string }> = {
  "winch": { min: 50, max: 150, avg: 100, label: "Winch/Recovery (stuck in mud, snow, ditch)" },
  "lockout": { min: 30, max: 75, avg: 50, label: "Lockout Service (keys locked in car)" },
  "jumpstart": { min: 25, max: 75, avg: 50, label: "Jump Start (dead battery)" },
  "tire": { min: 25, max: 75, avg: 50, label: "Tire Change (flat tire)" },
  "fuel": { min: 25, max: 75, avg: 50, label: "Fuel Delivery (out of gas)" }
};

// FAQ数据
const faqs = [
  {
    question: "How much does a 30 mile tow cost?",
    answer: "A 30-mile tow typically costs $130-$220 for a standard car. This includes a base hook-up fee of $75-$125 plus mileage charges of $2.50-$4.00 per mile. SUVs and trucks cost about $150-$280, while RVs can cost $250-$410. After-hours service adds 20-50% to these estimates."
  },
  {
    question: "How to calculate a tow bill?",
    answer: "Tow bills are calculated using this formula: Total = Base Fee + (Distance × Per-Mile Rate) + Surcharges. The base fee ($50-$150) covers hook-up. Per-mile rates ($2.50-$7.00) depend on vehicle type. Add surcharges for after-hours service (+25%), flatbed towing (+$25-50), or special services like winching (+$50-150)."
  },
  {
    question: "How much does AAA charge per mile for towing?",
    answer: "AAA charges $4-$7 per mile AFTER you exceed your membership's free mileage limit. Classic members get 5 free miles, Plus members get 100 free miles, and Premier members get 200 free miles. Within those limits, towing is completely free. For most local tows under 100 miles, AAA Plus ($100/year) provides free service."
  },
  {
    question: "Is it cheaper to get AAA or pay for towing?",
    answer: "AAA is usually cheaper if you need even ONE tow per year. A single 40-mile tow costs $175-$260 without coverage. AAA Plus costs $100/year and covers unlimited tows up to 100 miles each. AAA pays for itself with just one tow. Plus, you get other benefits like battery service, lockout help, and discounts."
  },
  {
    question: "When do I need flatbed towing instead of standard towing?",
    answer: "You need flatbed towing for: AWD/4WD vehicles (wheel-lift can damage drivetrain), low-clearance sports cars, electric/hybrid vehicles, luxury cars, vehicles with significant damage, and long-distance tows over 50 miles. Flatbed costs $25-$50 more but protects your vehicle better."
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

export default function TowingEstimateCalculator() {
  // 输入状态
  const [vehicleType, setVehicleType] = useState<string>("car");
  const [distance, setDistance] = useState<string>("25");
  const [timeOfDay, setTimeOfDay] = useState<"daytime" | "afterhours">("daytime");
  const [towType, setTowType] = useState<"standard" | "flatbed">("standard");
  const [situation, setSituation] = useState<"breakdown" | "accident" | "stuck">("breakdown");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // 结果
  const [results, setResults] = useState<{
    minCost: number;
    maxCost: number;
    avgCost: number;
    breakdown: {
      baseFee: { min: number; max: number; avg: number };
      mileageCost: { min: number; max: number; avg: number };
      flatbedCost: number;
      afterHoursCost: { min: number; max: number; avg: number };
      situationCost: { min: number; max: number; avg: number };
      servicesCost: { min: number; max: number; avg: number };
    };
    aaaCosts: Array<{ tier: string; cost: number; savings: number; freeMiles: number }>;
    distance: number;
  } | null>(null);

  // 切换附加服务
  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // 计算
  const calculate = () => {
    const dist = parseFloat(distance) || 0;
    if (dist <= 0) {
      alert("Please enter a valid distance");
      return;
    }

    const vehicle = vehicleTypes[vehicleType];
    
    // 基础费用
    const baseFee = { ...vehicle.baseFee };
    
    // 里程费用
    const mileageCost = {
      min: dist * vehicle.perMile.min,
      max: dist * vehicle.perMile.max,
      avg: dist * vehicle.perMile.avg
    };
    
    // Flatbed 附加费
    const flatbedCost = towType === "flatbed" ? vehicle.flatbedExtra : 0;
    
    // 计算小计（用于计算after hours百分比）
    const subtotalMin = baseFee.min + mileageCost.min + flatbedCost;
    const subtotalMax = baseFee.max + mileageCost.max + flatbedCost;
    const subtotalAvg = baseFee.avg + mileageCost.avg + flatbedCost;
    
    // After hours 附加费 (25%)
    const afterHoursCost = timeOfDay === "afterhours" 
      ? { min: subtotalMin * 0.25, max: subtotalMax * 0.25, avg: subtotalAvg * 0.25 }
      : { min: 0, max: 0, avg: 0 };
    
    // 情况附加费
    let situationCost = { min: 0, max: 0, avg: 0 };
    if (situation === "accident") {
      situationCost = { min: 50, max: 150, avg: 100 }; // 事故清理费
    } else if (situation === "stuck") {
      situationCost = { min: 50, max: 150, avg: 100 }; // 绞车费
    }
    
    // 附加服务费用
    let servicesCost = { min: 0, max: 0, avg: 0 };
    selectedServices.forEach(service => {
      const svc = additionalServices[service];
      if (svc) {
        servicesCost.min += svc.min;
        servicesCost.max += svc.max;
        servicesCost.avg += svc.avg;
      }
    });
    
    // 总费用
    const minCost = Math.round(baseFee.min + mileageCost.min + flatbedCost + afterHoursCost.min + situationCost.min + servicesCost.min);
    const maxCost = Math.round(baseFee.max + mileageCost.max + flatbedCost + afterHoursCost.max + situationCost.max + servicesCost.max);
    const avgCost = Math.round(baseFee.avg + mileageCost.avg + flatbedCost + afterHoursCost.avg + situationCost.avg + servicesCost.avg);
    
    // AAA 费用计算
    const aaaCosts = aaaTiers.map(tier => {
      let cost = 0;
      if (dist > tier.freeMiles) {
        cost = (dist - tier.freeMiles) * tier.perMileAfter;
      }
      return {
        tier: tier.name,
        cost: Math.round(cost),
        savings: avgCost - cost,
        freeMiles: tier.freeMiles
      };
    });

    setResults({
      minCost,
      maxCost,
      avgCost,
      breakdown: {
        baseFee,
        mileageCost: {
          min: Math.round(mileageCost.min),
          max: Math.round(mileageCost.max),
          avg: Math.round(mileageCost.avg)
        },
        flatbedCost,
        afterHoursCost: {
          min: Math.round(afterHoursCost.min),
          max: Math.round(afterHoursCost.max),
          avg: Math.round(afterHoursCost.avg)
        },
        situationCost,
        servicesCost
      },
      aaaCosts,
      distance: dist
    });
  };

  // 重置
  const reset = () => {
    setVehicleType("car");
    setDistance("25");
    setTimeOfDay("daytime");
    setTowType("standard");
    setSituation("breakdown");
    setSelectedServices([]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Towing Estimate Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            Towing Estimate Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate towing costs based on distance, vehicle type, and services needed. Compare prices with AAA membership to find the best option.
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
                Towing Details
              </h2>

              {/* Vehicle Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🚗 Vehicle Type
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {Object.entries(vehicleTypes).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => setVehicleType(key)}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: vehicleType === key ? "2px solid #2563EB" : "1px solid #E5E7EB",
                        backgroundColor: vehicleType === key ? "#EFF6FF" : "white",
                        color: vehicleType === key ? "#2563EB" : "#4B5563",
                        fontWeight: vehicleType === key ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        textAlign: "left"
                      }}
                    >
                      <span style={{ fontSize: "1.25rem", marginRight: "8px" }}>{data.icon}</span>
                      {data.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  📏 Towing Distance (miles)
                </label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    style={{
                      width: "120px",
                      padding: "10px 12px",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      textAlign: "center"
                    }}
                    min="1"
                    max="500"
                  />
                  <span style={{ color: "#6B7280" }}>miles</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                  {[10, 25, 50, 100, 200].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDistance(d.toString())}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: distance === d.toString() ? "#EFF6FF" : "#F9FAFB",
                        color: distance === d.toString() ? "#2563EB" : "#4B5563",
                        fontSize: "0.75rem",
                        cursor: "pointer"
                      }}
                    >
                      {d} mi
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🕐 Time of Service
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setTimeOfDay("daytime")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: timeOfDay === "daytime" ? "2px solid #059669" : "1px solid #E5E7EB",
                      backgroundColor: timeOfDay === "daytime" ? "#ECFDF5" : "white",
                      color: timeOfDay === "daytime" ? "#059669" : "#4B5563",
                      fontWeight: timeOfDay === "daytime" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    ☀️ Daytime (8am-6pm)
                  </button>
                  <button
                    onClick={() => setTimeOfDay("afterhours")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: timeOfDay === "afterhours" ? "2px solid #D97706" : "1px solid #E5E7EB",
                      backgroundColor: timeOfDay === "afterhours" ? "#FEF3C7" : "white",
                      color: timeOfDay === "afterhours" ? "#D97706" : "#4B5563",
                      fontWeight: timeOfDay === "afterhours" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    🌙 After Hours (+25%)
                  </button>
                </div>
              </div>

              {/* Tow Type */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  🚛 Tow Truck Type
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setTowType("standard")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: towType === "standard" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: towType === "standard" ? "#EFF6FF" : "white",
                      color: towType === "standard" ? "#2563EB" : "#4B5563",
                      fontWeight: towType === "standard" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Standard (Wheel-lift)
                  </button>
                  <button
                    onClick={() => setTowType("flatbed")}
                    style={{
                      flex: "1",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: towType === "flatbed" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      backgroundColor: towType === "flatbed" ? "#EFF6FF" : "white",
                      color: towType === "flatbed" ? "#2563EB" : "#4B5563",
                      fontWeight: towType === "flatbed" ? "600" : "400",
                      cursor: "pointer",
                      fontSize: "0.875rem"
                    }}
                  >
                    Flatbed (+${vehicleTypes[vehicleType].flatbedExtra})
                  </button>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "6px" }}>
                  ℹ️ Flatbed recommended for: AWD/4WD, sports cars, EVs, damaged vehicles
                </p>
              </div>

              {/* Situation */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ❓ Situation
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { id: "breakdown", label: "Breakdown", icon: "🔧" },
                    { id: "accident", label: "Accident (+$50-150)", icon: "💥" },
                    { id: "stuck", label: "Stuck (+$50-150)", icon: "🏔️" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSituation(s.id as "breakdown" | "accident" | "stuck")}
                      style={{
                        flex: "1",
                        minWidth: "100px",
                        padding: "10px 8px",
                        borderRadius: "8px",
                        border: situation === s.id ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                        backgroundColor: situation === s.id ? "#F5F3FF" : "white",
                        color: situation === s.id ? "#7C3AED" : "#4B5563",
                        fontWeight: situation === s.id ? "600" : "400",
                        cursor: "pointer",
                        fontSize: "0.75rem"
                      }}
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                  ➕ Additional Services (optional)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(additionalServices).map(([key, data]) => (
                    <label
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: selectedServices.includes(key) ? "2px solid #059669" : "1px solid #E5E7EB",
                        backgroundColor: selectedServices.includes(key) ? "#ECFDF5" : "white",
                        cursor: "pointer",
                        fontSize: "0.875rem"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(key)}
                        onChange={() => toggleService(key)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ flex: "1", color: "#374151" }}>{data.label}</span>
                      <span style={{ color: "#059669", fontWeight: "500", fontSize: "0.75rem" }}>+${data.min}-{data.max}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={calculate}
                  style={{
                    flex: "1",
                    backgroundColor: "#2563EB",
                    color: "white",
                    padding: "14px 24px",
                    borderRadius: "8px",
                    fontWeight: "600",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  💰 Calculate Estimate
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
                  ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
                  : "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)",
                borderRadius: "16px", 
                padding: "24px",
                marginBottom: "16px",
                textAlign: "center"
              }}>
                <p style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600", 
                  color: results ? "#2563EB" : "#6B7280",
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  marginBottom: "8px" 
                }}>
                  💰 Estimated Towing Cost
                </p>
                <p style={{ 
                  fontSize: "2.5rem", 
                  fontWeight: "bold", 
                  color: results ? "#1E40AF" : "#9CA3AF",
                  lineHeight: "1" 
                }}>
                  {results ? `$${results.minCost} - $${results.maxCost}` : "—"}
                </p>
                <p style={{ 
                  color: results ? "#2563EB" : "#6B7280",
                  marginTop: "8px", 
                  fontSize: "1rem",
                  fontWeight: "500"
                }}>
                  {results ? `Average: $${results.avgCost}` : "Enter details to calculate"}
                </p>
              </div>

              {/* Cost Breakdown */}
              {results && (
                <div style={{ 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", marginBottom: "12px" }}>
                    📋 Cost Breakdown (Average)
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>Base/Hook-up Fee</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${results.breakdown.baseFee.avg}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                      <span style={{ color: "#6B7280" }}>{results.distance} miles × ${vehicleTypes[vehicleType].perMile.avg}/mi</span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>${results.breakdown.mileageCost.avg}</span>
                    </div>
                    {results.breakdown.flatbedCost > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Flatbed Towing</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>+${results.breakdown.flatbedCost}</span>
                      </div>
                    )}
                    {results.breakdown.afterHoursCost.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "#FEF3C7", borderRadius: "8px" }}>
                        <span style={{ color: "#92400E" }}>After Hours (+25%)</span>
                        <span style={{ fontWeight: "600", color: "#92400E" }}>+${results.breakdown.afterHoursCost.avg}</span>
                      </div>
                    )}
                    {results.breakdown.situationCost.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>{situation === "accident" ? "Accident Cleanup" : "Winch Recovery"}</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>+${results.breakdown.situationCost.avg}</span>
                      </div>
                    )}
                    {results.breakdown.servicesCost.avg > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "8px" }}>
                        <span style={{ color: "#6B7280" }}>Additional Services</span>
                        <span style={{ fontWeight: "600", color: "#111827" }}>+${results.breakdown.servicesCost.avg}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AAA Comparison */}
              {results && (
                <div style={{ 
                  backgroundColor: "#ECFDF5", 
                  borderRadius: "12px", 
                  padding: "16px",
                  marginBottom: "16px",
                  border: "1px solid #A7F3D0"
                }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#065F46", textTransform: "uppercase", marginBottom: "12px" }}>
                    🎫 With AAA Membership
                  </p>
                  <div style={{ display: "grid", gap: "8px" }}>
                    {results.aaaCosts.map((tier) => (
                      <div 
                        key={tier.tier}
                        style={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          padding: "10px 12px", 
                          backgroundColor: "white", 
                          borderRadius: "8px",
                          border: tier.cost === 0 ? "2px solid #059669" : "1px solid #E5E7EB"
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: "600", color: "#111827", fontSize: "0.875rem" }}>AAA {tier.tier}</p>
                          <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{tier.freeMiles} free miles</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {tier.cost === 0 ? (
                            <p style={{ fontWeight: "bold", color: "#059669", fontSize: "1.125rem" }}>FREE! ✓</p>
                          ) : (
                            <p style={{ fontWeight: "600", color: "#111827" }}>${tier.cost}</p>
                          )}
                          <p style={{ fontSize: "0.75rem", color: "#059669" }}>Save ${tier.savings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#065F46", marginTop: "12px", fontStyle: "italic" }}>
                    💡 AAA Plus ($100/yr) covers most local tows for free!
                  </p>
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
                    📊 Quick Reference (Car, Daytime)
                  </p>
                  <div style={{ fontSize: "0.875rem", color: "#92400E" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>10 miles</span>
                      <span style={{ fontWeight: "600" }}>$85 - $150</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>25 miles</span>
                      <span style={{ fontWeight: "600" }}>$138 - $225</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span>50 miles</span>
                      <span style={{ fontWeight: "600" }}>$175 - $350</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>100 miles</span>
                      <span style={{ fontWeight: "600" }}>$300 - $600</span>
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
            {/* How Towing Costs Work */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How Towing Costs Are Calculated
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                Towing companies typically charge using a two-part pricing structure: a <strong>base fee</strong> (also called hook-up fee) plus a <strong>per-mile rate</strong>. The base fee covers the cost of dispatching the truck and loading your vehicle, while the per-mile rate covers the actual transport.
              </p>
              
              <div style={{ backgroundColor: "#F3F4F6", padding: "16px", borderRadius: "8px", marginBottom: "16px", fontFamily: "monospace", fontSize: "0.875rem" }}>
                Total Cost = Base Fee + (Distance × Per-Mile Rate) + Surcharges
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ backgroundColor: "#EFF6FF", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "8px" }}>Base Fee</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#2563EB" }}>$50 - $150</p>
                  <p style={{ fontSize: "0.75rem", color: "#3B82F6" }}>Hook-up & first few miles</p>
                </div>
                <div style={{ backgroundColor: "#F5F3FF", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#5B21B6", marginBottom: "8px" }}>Per Mile</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#7C3AED" }}>$2.50 - $7.00</p>
                  <p style={{ fontSize: "0.75rem", color: "#8B5CF6" }}>Varies by vehicle type</p>
                </div>
                <div style={{ backgroundColor: "#FEF3C7", padding: "16px", borderRadius: "12px" }}>
                  <p style={{ fontWeight: "600", color: "#92400E", marginBottom: "8px" }}>After Hours</p>
                  <p style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#D97706" }}>+20% to 50%</p>
                  <p style={{ fontSize: "0.75rem", color: "#B45309" }}>Nights, weekends, holidays</p>
                </div>
              </div>
            </div>

            {/* Towing Cost by Distance Table */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Average Towing Costs by Distance & Vehicle Type
              </h2>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Distance</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🚗 Car</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🚙 SUV/Truck</th>
                      <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>🚐 RV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { dist: "10 miles", car: "$85-$150", suv: "$105-$185", rv: "$140-$270" },
                      { dist: "25 miles", car: "$138-$225", suv: "$175-$275", rv: "$250-$375" },
                      { dist: "50 miles", car: "$175-$350", suv: "$225-$425", rv: "$350-$550" },
                      { dist: "100 miles", car: "$300-$600", suv: "$375-$725", rv: "$550-$900" },
                      { dist: "200 miles", car: "$550-$1,100", suv: "$675-$1,325", rv: "$1,000-$1,600" },
                    ].map((row, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.dist}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.car}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.suv}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.rv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "8px" }}>
                * Daytime rates. Add 20-50% for after-hours, weekends, or holidays.
              </p>
            </div>
          </div>

          {/* Sidebar - 右侧窄 */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* AAA Membership Comparison */}
            <div style={{ 
              backgroundColor: "#ECFDF5", 
              borderRadius: "16px", 
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>
                🎫 AAA Membership Tiers
              </h3>
              <div style={{ fontSize: "0.875rem", color: "#047857" }}>
                <div style={{ marginBottom: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Classic - $56/year</p>
                  <p>5 free miles per tow</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>$4/mile after limit</p>
                </div>
                <div style={{ marginBottom: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px", border: "2px solid #059669" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Plus - $100/year ⭐</p>
                  <p>100 free miles per tow</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>Most popular choice</p>
                </div>
                <div style={{ padding: "12px", backgroundColor: "white", borderRadius: "8px" }}>
                  <p style={{ fontWeight: "600", marginBottom: "4px" }}>Premier - $124/year</p>
                  <p>200 free miles (1x/year)</p>
                  <p style={{ fontSize: "0.75rem", color: "#059669" }}>+ car rental benefit</p>
                </div>
              </div>
            </div>

            {/* Tips to Save */}
            <div style={{ 
              backgroundColor: "white", 
              borderRadius: "16px", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Tips to Save on Towing
              </h3>
              <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                {[
                  "Check if your car insurance includes roadside assistance",
                  "AAA Plus pays for itself with just one 40+ mile tow",
                  "Get quotes from multiple companies before agreeing",
                  "Ask if first few miles are included in base fee",
                  "Avoid after-hours service if not urgent",
                  "Request tow to nearest repair shop, not farthest"
                ].map((tip, index) => (
                  <li key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", fontSize: "0.875rem", color: "#4B5563" }}>
                    <span style={{ color: "#2563EB", marginRight: "8px", fontWeight: "bold" }}>✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RelatedTools currentUrl="/towing-estimate-calculator" currentCategory="Finance" />
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
