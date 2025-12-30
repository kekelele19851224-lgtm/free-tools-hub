"use client";

import { useState } from "react";
import Link from "next/link";

// 2025 Q4 Diesel Tax Rates (Official IFTA rates)
const dieselTaxRates: Record<string, number> = {
  // US States
  AL: 0.310, AZ: 0.260, AR: 0.285, CA: 0.971, CO: 0.325,
  CT: 0.489, DE: 0.220, FL: 0.403, GA: 0.371, ID: 0.320,
  IL: 0.749, IN: 0.610, IA: 0.325, KS: 0.260, KY: 0.220,
  LA: 0.200, ME: 0.312, MD: 0.468, MA: 0.240, MI: 0.507,
  MN: 0.318, MS: 0.210, MO: 0.295, MT: 0.298, NE: 0.318,
  NV: 0.270, NH: 0.222, NJ: 0.519, NM: 0.210, NY: 0.388,
  NC: 0.403, ND: 0.230, OH: 0.470, OK: 0.190, OR: 0.000,
  PA: 0.741, RI: 0.400, SC: 0.280, SD: 0.280, TN: 0.270,
  TX: 0.200, UT: 0.385, VT: 0.310, VA: 0.327, WA: 0.584,
  WV: 0.357, WI: 0.329, WY: 0.240,
  // Canadian Provinces
  AB: 0.357, BC: 0.412, MB: 0.343, NB: 0.424, NL: 0.261,
  NS: 0.423, ON: 0.247, PE: 0.388, QC: 0.564, SK: 0.554
};

// 2025 Q4 Gasoline Tax Rates
const gasolineTaxRates: Record<string, number> = {
  // US States
  AL: 0.300, AZ: 0.180, AR: 0.247, CA: 0.000, CO: 0.270,
  CT: 0.250, DE: 0.230, FL: 0.404, GA: 0.331, ID: 0.000,
  IL: 0.669, IN: 0.360, IA: 0.300, KS: 0.240, KY: 0.250,
  LA: 0.200, ME: 0.000, MD: 0.460, MA: 0.240, MI: 0.455,
  MN: 0.318, MS: 0.210, MO: 0.295, MT: 0.000, NE: 0.318,
  NV: 0.230, NH: 0.000, NJ: 0.449, NM: 0.120, NY: 0.405,
  NC: 0.403, ND: 0.230, OH: 0.385, OK: 0.190, OR: 0.000,
  PA: 0.576, RI: 0.400, SC: 0.280, SD: 0.280, TN: 0.260,
  TX: 0.200, UT: 0.385, VT: 0.000, VA: 0.317, WA: 0.554,
  WV: 0.357, WI: 0.329, WY: 0.240,
  // Canadian Provinces
  AB: 0.357, BC: 0.398, MB: 0.343, NB: 0.298, NL: 0.206,
  NS: 0.425, ON: 0.247, PE: 0.232, QC: 0.536, SK: 0.527
};

// Surcharge states
const surchargeRates: Record<string, { diesel: number; gasoline: number }> = {
  KY: { diesel: 0.105, gasoline: 0.045 },
  VA: { diesel: 0.143, gasoline: 0.153 }
};

// State/Province names
const jurisdictions = [
  { code: "AL", name: "Alabama" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "AB", name: "Alberta (CA)" },
  { code: "BC", name: "British Columbia (CA)" },
  { code: "MB", name: "Manitoba (CA)" },
  { code: "NB", name: "New Brunswick (CA)" },
  { code: "NL", name: "Newfoundland (CA)" },
  { code: "NS", name: "Nova Scotia (CA)" },
  { code: "ON", name: "Ontario (CA)" },
  { code: "PE", name: "Prince Edward Island (CA)" },
  { code: "QC", name: "Quebec (CA)" },
  { code: "SK", name: "Saskatchewan (CA)" }
];

// Quarter options
const quarterOptions = [
  { value: "2026-Q1", label: "Q1 2026 (Jan-Mar)" },
  { value: "2025-Q4", label: "Q4 2025 (Oct-Dec)" },
  { value: "2025-Q3", label: "Q3 2025 (Jul-Sep)" },
  { value: "2025-Q2", label: "Q2 2025 (Apr-Jun)" },
  { value: "2025-Q1", label: "Q1 2025 (Jan-Mar)" }
];

// FAQ data
const faqs = [
  {
    question: "How do I manually calculate IFTA?",
    answer: "To calculate IFTA manually: 1) Add up total miles driven across all states. 2) Add up total gallons purchased. 3) Calculate fleet MPG (Total Miles ÷ Total Gallons). 4) For each state, calculate taxable gallons (State Miles ÷ Fleet MPG). 5) Multiply taxable gallons by the state's tax rate to get tax owed. 6) Subtract tax already paid (gallons purchased × tax rate) from tax owed to get net tax due or credit for each state."
  },
  {
    question: "Is IFTA tax deductible?",
    answer: "Yes, IFTA fuel taxes are generally tax-deductible as a business expense for trucking companies and owner-operators. You can deduct the fuel taxes paid as part of your overall fuel costs. Keep all receipts and IFTA reports for documentation. Consult with a tax professional for your specific situation."
  },
  {
    question: "What size trucks need IFTA?",
    answer: "IFTA applies to qualified motor vehicles that: 1) Have two axles and a gross vehicle weight or registered gross vehicle weight exceeding 26,000 pounds (11,797 kg), OR 2) Have three or more axles regardless of weight, OR 3) Are used in combination when the combined weight exceeds 26,000 pounds. The vehicle must also travel in at least two IFTA jurisdictions."
  },
  {
    question: "What triggers an IFTA audit?",
    answer: "Common IFTA audit triggers include: 1) Significant discrepancies in reported MPG (too high or too low for vehicle type). 2) Inconsistent reporting patterns quarter to quarter. 3) Missing or incomplete records. 4) Random selection. 5) Complaints or tips. 6) Unusually high credit claims. To avoid audits, maintain accurate records of all fuel purchases and miles traveled, and ensure your reported MPG is reasonable (typically 5-8 MPG for trucks)."
  },
  {
    question: "When is IFTA due?",
    answer: "IFTA returns are due quarterly: Q1 (Jan-Mar) due April 30, Q2 (Apr-Jun) due July 31, Q3 (Jul-Sep) due October 31, Q4 (Oct-Dec) due January 31. If the due date falls on a weekend or holiday, the deadline extends to the next business day. Late filing penalties are $50 or 10% of tax due, whichever is greater, plus interest."
  }
];

// FAQ component
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

// Trip entry type
interface TripEntry {
  id: number;
  state: string;
  miles: string;
  gallons: string;
}

// Result type
interface StateResult {
  state: string;
  stateName: string;
  miles: number;
  taxableGallons: number;
  taxRate: number;
  taxOwed: number;
  gallonsPurchased: number;
  taxPaid: number;
  netTax: number;
  surcharge?: number;
}

export default function IFTACalculator() {
  // Input state
  const [baseJurisdiction, setBaseJurisdiction] = useState<string>("TX");
  const [quarter, setQuarter] = useState<string>("2025-Q4");
  const [fuelType, setFuelType] = useState<string>("diesel");
  const [entries, setEntries] = useState<TripEntry[]>([
    { id: 1, state: "", miles: "", gallons: "" },
    { id: 2, state: "", miles: "", gallons: "" },
    { id: 3, state: "", miles: "", gallons: "" }
  ]);

  // Results
  const [results, setResults] = useState<{
    totalMiles: number;
    totalGallons: number;
    mpg: number;
    stateResults: StateResult[];
    totalTaxOwed: number;
    totalTaxPaid: number;
    netTaxDue: number;
  } | null>(null);

  // Add entry
  const addEntry = () => {
    setEntries([...entries, { id: Date.now(), state: "", miles: "", gallons: "" }]);
  };

  // Remove entry
  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  // Update entry
  const updateEntry = (id: number, field: keyof TripEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Get tax rate
  const getTaxRate = (state: string): number => {
    const rates = fuelType === "diesel" ? dieselTaxRates : gasolineTaxRates;
    return rates[state] || 0;
  };

  // Calculate
  const calculate = () => {
    // Filter valid entries
    const validEntries = entries.filter(e => e.state && (parseFloat(e.miles) > 0 || parseFloat(e.gallons) > 0));

    if (validEntries.length === 0) {
      alert("Please enter at least one state with miles or gallons");
      return;
    }

    // Calculate totals
    const totalMiles = validEntries.reduce((sum, e) => sum + (parseFloat(e.miles) || 0), 0);
    const totalGallons = validEntries.reduce((sum, e) => sum + (parseFloat(e.gallons) || 0), 0);

    if (totalMiles === 0 || totalGallons === 0) {
      alert("Please enter total miles and at least some fuel purchases");
      return;
    }

    const mpg = totalMiles / totalGallons;

    // Aggregate by state
    const stateData: Record<string, { miles: number; gallons: number }> = {};
    validEntries.forEach(e => {
      if (!stateData[e.state]) {
        stateData[e.state] = { miles: 0, gallons: 0 };
      }
      stateData[e.state].miles += parseFloat(e.miles) || 0;
      stateData[e.state].gallons += parseFloat(e.gallons) || 0;
    });

    // Calculate per state
    const stateResults: StateResult[] = Object.entries(stateData).map(([state, data]) => {
      const taxRate = getTaxRate(state);
      const taxableGallons = data.miles / mpg;
      const taxOwed = taxableGallons * taxRate;
      const taxPaid = data.gallons * taxRate;
      const netTax = taxOwed - taxPaid;

      // Check for surcharge
      let surcharge = 0;
      if (surchargeRates[state]) {
        const surchargeRate = fuelType === "diesel"
          ? surchargeRates[state].diesel
          : surchargeRates[state].gasoline;
        surcharge = taxableGallons * surchargeRate;
      }

      const stateName = jurisdictions.find(j => j.code === state)?.name || state;

      return {
        state,
        stateName,
        miles: data.miles,
        taxableGallons,
        taxRate,
        taxOwed,
        gallonsPurchased: data.gallons,
        taxPaid,
        netTax: netTax + surcharge,
        surcharge: surcharge > 0 ? surcharge : undefined
      };
    });

    // Sort by state name
    stateResults.sort((a, b) => a.stateName.localeCompare(b.stateName));

    // Totals
    const totalTaxOwed = stateResults.reduce((sum, r) => sum + r.taxOwed + (r.surcharge || 0), 0);
    const totalTaxPaid = stateResults.reduce((sum, r) => sum + r.taxPaid, 0);
    const netTaxDue = stateResults.reduce((sum, r) => sum + r.netTax, 0);

    setResults({
      totalMiles,
      totalGallons,
      mpg,
      stateResults,
      totalTaxOwed,
      totalTaxPaid,
      netTaxDue
    });
  };

  // Reset
  const reset = () => {
    setEntries([
      { id: 1, state: "", miles: "", gallons: "" },
      { id: 2, state: "", miles: "", gallons: "" },
      { id: 3, state: "", miles: "", gallons: "" }
    ]);
    setResults(null);
  };

  // Export CSV
  const exportCSV = () => {
    if (!results) return;

    const headers = ["State", "Miles", "Taxable Gallons", "Tax Rate", "Tax Owed", "Gallons Purchased", "Tax Paid", "Net Tax"];
    const rows = results.stateResults.map(r => [
      r.stateName,
      r.miles.toFixed(0),
      r.taxableGallons.toFixed(2),
      `$${r.taxRate.toFixed(4)}`,
      `$${r.taxOwed.toFixed(2)}`,
      r.gallonsPurchased.toFixed(2),
      `$${r.taxPaid.toFixed(2)}`,
      `$${r.netTax.toFixed(2)}`
    ]);

    // Add summary
    rows.push([]);
    rows.push(["SUMMARY"]);
    rows.push(["Total Miles", results.totalMiles.toFixed(0)]);
    rows.push(["Total Gallons", results.totalGallons.toFixed(2)]);
    rows.push(["Fleet MPG", results.mpg.toFixed(2)]);
    rows.push(["Total Tax Owed", `$${results.totalTaxOwed.toFixed(2)}`]);
    rows.push(["Total Tax Paid", `$${results.totalTaxPaid.toFixed(2)}`]);
    rows.push(["Net Tax Due", `$${results.netTaxDue.toFixed(2)}`]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IFTA_Report_${quarter}_${baseJurisdiction}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(absValue);
    return value < 0 ? `(${formatted})` : formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">IFTA Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title Section */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", marginBottom: "12px" }}>
            IFTA Fuel Tax Calculator
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate your quarterly IFTA fuel tax obligations by state. Enter your miles traveled and fuel purchased to see tax owed or credits due.
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
          {/* Settings Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            {/* Base Jurisdiction */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                🏠 Base Jurisdiction
              </label>
              <select
                value={baseJurisdiction}
                onChange={(e) => setBaseJurisdiction(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  backgroundColor: "white"
                }}
              >
                {jurisdictions.map(j => (
                  <option key={j.code} value={j.code}>{j.name} ({j.code})</option>
                ))}
              </select>
            </div>

            {/* Quarter */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                📅 Reporting Quarter
              </label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  backgroundColor: "white"
                }}
              >
                {quarterOptions.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                ⛽ Fuel Type
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setFuelType("diesel")}
                  style={{
                    flex: "1",
                    padding: "10px",
                    borderRadius: "8px",
                    border: fuelType === "diesel" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: fuelType === "diesel" ? "#EFF6FF" : "white",
                    color: fuelType === "diesel" ? "#1E40AF" : "#4B5563",
                    fontWeight: fuelType === "diesel" ? "600" : "400",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Diesel
                </button>
                <button
                  onClick={() => setFuelType("gasoline")}
                  style={{
                    flex: "1",
                    padding: "10px",
                    borderRadius: "8px",
                    border: fuelType === "gasoline" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    backgroundColor: fuelType === "gasoline" ? "#EFF6FF" : "white",
                    color: fuelType === "gasoline" ? "#1E40AF" : "#4B5563",
                    fontWeight: fuelType === "gasoline" ? "600" : "400",
                    cursor: "pointer",
                    fontSize: "0.875rem"
                  }}
                >
                  Gasoline
                </button>
              </div>
            </div>
          </div>

          {/* Trip Data Entry */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
              📊 Enter Miles & Fuel by State
            </h2>

            {/* Headers */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 40px", gap: "12px", marginBottom: "8px", padding: "0 4px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>State/Province</span>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Miles Driven</span>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6B7280", textTransform: "uppercase" }}>Gallons Purchased</span>
              <span></span>
            </div>

            {/* Entry Rows */}
            {entries.map((entry) => (
              <div key={entry.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 40px", gap: "12px", marginBottom: "8px" }}>
                <select
                  value={entry.state}
                  onChange={(e) => updateEntry(entry.id, "state", e.target.value)}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    backgroundColor: "white"
                  }}
                >
                  <option value="">Select State...</option>
                  {jurisdictions.map(j => (
                    <option key={j.code} value={j.code}>{j.name} ({j.code})</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={entry.miles}
                  onChange={(e) => updateEntry(entry.id, "miles", e.target.value)}
                  placeholder="0"
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem"
                  }}
                  min="0"
                />
                <input
                  type="number"
                  value={entry.gallons}
                  onChange={(e) => updateEntry(entry.id, "gallons", e.target.value)}
                  placeholder="0"
                  style={{
                    padding: "10px 12px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "0.875rem"
                  }}
                  min="0"
                  step="0.01"
                />
                <button
                  onClick={() => removeEntry(entry.id)}
                  style={{
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    backgroundColor: "#FEF2F2",
                    color: "#DC2626",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  disabled={entries.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add Row Button */}
            <button
              onClick={addEntry}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                border: "1px dashed #D1D5DB",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#6B7280",
                cursor: "pointer",
                fontSize: "0.875rem",
                marginTop: "8px"
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>+</span> Add Another State
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={calculate}
              style={{
                backgroundColor: "#2563EB",
                color: "white",
                padding: "14px 32px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              🚛 Calculate IFTA Tax
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
            {results && (
              <button
                onClick={exportCSV}
                style={{
                  padding: "14px 24px",
                  border: "1px solid #059669",
                  borderRadius: "8px",
                  fontWeight: "500",
                  color: "#059669",
                  backgroundColor: "#ECFDF5",
                  cursor: "pointer"
                }}
              >
                📥 Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            padding: "32px",
            marginBottom: "40px"
          }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>
              📋 IFTA Tax Report - {quarter}
            </h2>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Miles</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{results.totalMiles.toLocaleString()}</p>
              </div>
              <div style={{ backgroundColor: "#F3F4F6", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", marginBottom: "4px" }}>Total Gallons</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}>{results.totalGallons.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div style={{ backgroundColor: "#DBEAFE", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "#1E40AF", marginBottom: "4px" }}>Fleet MPG</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1E40AF" }}>{results.mpg.toFixed(2)}</p>
              </div>
              <div style={{
                backgroundColor: results.netTaxDue >= 0 ? "#FEF3C7" : "#ECFDF5",
                padding: "20px",
                borderRadius: "12px",
                textAlign: "center",
                border: `2px solid ${results.netTaxDue >= 0 ? "#F59E0B" : "#059669"}`
              }}>
                <p style={{ fontSize: "0.75rem", color: results.netTaxDue >= 0 ? "#92400E" : "#065F46", marginBottom: "4px" }}>
                  {results.netTaxDue >= 0 ? "Net Tax Due" : "Net Credit"}
                </p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: results.netTaxDue >= 0 ? "#92400E" : "#059669" }}>
                  {formatCurrency(results.netTaxDue)}
                </p>
              </div>
            </div>

            {/* State Breakdown Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "left" }}>State</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Miles</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Taxable Gal</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Tax Rate</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Tax Owed</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Gal Purchased</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Tax Paid</th>
                    <th style={{ padding: "12px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>Net Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {results.stateResults.map((r, index) => (
                    <tr key={r.state} style={{ backgroundColor: index % 2 === 0 ? "white" : "#F9FAFB" }}>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", fontWeight: "500" }}>
                        {r.stateName}
                        {r.surcharge && <span style={{ fontSize: "0.65rem", color: "#DC2626", marginLeft: "4px" }}>+surcharge</span>}
                      </td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>{r.miles.toLocaleString()}</td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>{r.taxableGallons.toFixed(2)}</td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>${r.taxRate.toFixed(4)}</td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right", color: "#DC2626" }}>${(r.taxOwed + (r.surcharge || 0)).toFixed(2)}</td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right" }}>{r.gallonsPurchased.toFixed(2)}</td>
                      <td style={{ padding: "10px 8px", border: "1px solid #E5E7EB", textAlign: "right", color: "#059669" }}>${r.taxPaid.toFixed(2)}</td>
                      <td style={{
                        padding: "10px 8px",
                        border: "1px solid #E5E7EB",
                        textAlign: "right",
                        fontWeight: "600",
                        color: r.netTax >= 0 ? "#DC2626" : "#059669"
                      }}>
                        {formatCurrency(r.netTax)}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr style={{ backgroundColor: "#1E40AF", color: "white", fontWeight: "bold" }}>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF" }}>TOTAL</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>{results.totalMiles.toLocaleString()}</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>{results.totalGallons.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>—</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>${results.totalTaxOwed.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>{results.totalGallons.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>${results.totalTaxPaid.toFixed(2)}</td>
                    <td style={{ padding: "12px 8px", border: "1px solid #1E40AF", textAlign: "right" }}>{formatCurrency(results.netTaxDue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Oregon Note */}
            {results.stateResults.some(r => r.state === "OR") && (
              <div style={{ backgroundColor: "#FEF3C7", padding: "12px 16px", borderRadius: "8px", marginTop: "16px" }}>
                <p style={{ fontSize: "0.8rem", color: "#92400E" }}>
                  <strong>Note:</strong> Oregon uses a weight-mile tax instead of fuel tax. IFTA fuel tax rate is $0.00. You must file separately with Oregon DMV.
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ backgroundColor: "#F3F4F6", padding: "12px 16px", borderRadius: "8px", marginTop: "16px" }}>
              <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                ⚠️ This calculator provides estimates based on 2025 Q4 IFTA tax rates. Always verify with official IFTA sources before filing. Tax rates may change quarterly.
              </p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "400px" }}>
            {/* How IFTA Works */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                How IFTA Fuel Tax Works
              </h2>
              <p style={{ color: "#4B5563", marginBottom: "16px", lineHeight: "1.7" }}>
                The International Fuel Tax Agreement (IFTA) simplifies fuel tax reporting for carriers operating in multiple U.S. states and Canadian provinces. Instead of buying fuel permits for each jurisdiction, you file one quarterly report that redistributes taxes based on where you actually drove.
              </p>

              <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>📐 IFTA Calculation Formula</h3>
                <div style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#1E3A8A", lineHeight: "1.8" }}>
                  <p>1. Fleet MPG = Total Miles ÷ Total Gallons</p>
                  <p>2. Taxable Gallons = State Miles ÷ Fleet MPG</p>
                  <p>3. Tax Owed = Taxable Gallons × State Rate</p>
                  <p>4. Tax Paid = Gallons Purchased × State Rate</p>
                  <p>5. Net Tax = Tax Owed − Tax Paid</p>
                </div>
              </div>

              <p style={{ color: "#4B5563", lineHeight: "1.7" }}>
                If your net tax is <strong style={{ color: "#DC2626" }}>positive</strong>, you owe additional tax. If it&#39;s <strong style={{ color: "#059669" }}>negative</strong>, you&#39;ll receive a credit or refund.
              </p>
            </div>

            {/* IFTA Due Dates */}
            <div style={{
              backgroundColor: "#F5F3FF",
              borderRadius: "16px",
              border: "1px solid #DDD6FE",
              padding: "32px",
              marginBottom: "24px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>
                📅 IFTA Filing Due Dates
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Quarter</th>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Period</th>
                      <th style={{ padding: "12px", backgroundColor: "#EDE9FE", border: "1px solid #DDD6FE", textAlign: "left" }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { q: "Q1", period: "January - March", due: "April 30" },
                      { q: "Q2", period: "April - June", due: "July 31" },
                      { q: "Q3", period: "July - September", due: "October 31" },
                      { q: "Q4", period: "October - December", due: "January 31" }
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE", fontWeight: "600", color: "#5B21B6" }}>{row.q}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE" }}>{row.period}</td>
                        <td style={{ padding: "10px 12px", border: "1px solid #DDD6FE", fontWeight: "600" }}>{row.due}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6D28D9", marginTop: "12px" }}>
                * If the due date falls on a weekend or holiday, the deadline extends to the next business day.
              </p>
            </div>

            {/* Tips */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "32px"
            }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                💡 Tips to Avoid IFTA Audit Issues
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {[
                  { icon: "📝", tip: "Keep all fuel receipts for 4 years - they must show date, location, gallons, and price" },
                  { icon: "📍", tip: "Track miles by state using GPS, ELD, or manual odometer readings at state lines" },
                  { icon: "📊", tip: "Maintain reasonable MPG - typical trucks get 5-8 MPG; unusual numbers trigger audits" },
                  { icon: "⏰", tip: "File on time every quarter, even if you have zero miles to report" },
                  { icon: "🔍", tip: "Reconcile your fuel purchases with your credit card statements monthly" }
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                    <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
                    <span style={{ color: "#374151", fontSize: "0.9rem" }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Who Needs IFTA */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px",
              marginBottom: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                🚛 Who Needs IFTA?
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#4B5563", marginBottom: "12px" }}>
                You need an IFTA license if your vehicle:
              </p>
              <ul style={{ fontSize: "0.875rem", color: "#4B5563", paddingLeft: "20px", margin: 0 }}>
                <li style={{ marginBottom: "8px" }}>Has <strong>2+ axles</strong> and weighs over <strong>26,000 lbs</strong></li>
                <li style={{ marginBottom: "8px" }}>Has <strong>3+ axles</strong> regardless of weight</li>
                <li style={{ marginBottom: "8px" }}>Travels in <strong>2+ IFTA jurisdictions</strong></li>
              </ul>
            </div>

            {/* Non-IFTA Jurisdictions */}
            <div style={{
              backgroundColor: "#FEF3C7",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #FDE68A"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>
                ⚠️ Non-IFTA Areas
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#92400E", marginBottom: "8px" }}>
                These jurisdictions are NOT part of IFTA:
              </p>
              <ul style={{ fontSize: "0.8rem", color: "#92400E", paddingLeft: "16px", margin: 0 }}>
                <li>Alaska</li>
                <li>Hawaii</li>
                <li>District of Columbia</li>
                <li>Yukon Territory</li>
                <li>Northwest Territories</li>
                <li>Nunavut</li>
                <li>Mexico</li>
              </ul>
            </div>

            {/* Tax Rate Source */}
            <div style={{
              backgroundColor: "#ECFDF5",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid #A7F3D0"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>
                📊 Tax Rate Source
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#065F46" }}>
                Tax rates from official IFTA, Inc. tax matrix (iftach.org). Updated for <strong>Q4 2025</strong>.
              </p>
              <p style={{ fontSize: "0.75rem", color: "#059669", marginTop: "8px" }}>
                Rates change quarterly - always verify before filing.
              </p>
            </div>

            {/* Related Tools */}
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #E5E7EB",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                Related Tools
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/towing-cost-calculator", name: "Towing Cost Calculator", desc: "Estimate tow truck costs", icon: "🚗" },
                  { href: "/gravel-driveway-calculator", name: "Gravel Calculator", desc: "Calculate material needs", icon: "🛣️" },
                  { href: "/balloon-mortgage-calculator", name: "Balloon Mortgage", desc: "Calculate balloon payments", icon: "🎈" }
                ].map((tool, index) => (
                  <Link
                    key={index}
                    href={tool.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      textDecoration: "none"
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{tool.icon}</span>
                    <div>
                      <p style={{ fontWeight: "500", color: "#111827", marginBottom: "2px" }}>{tool.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>{tool.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
