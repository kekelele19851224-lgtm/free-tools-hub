"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// State median income 2024 (family size 1-4)
const stateMedianIncome: Record<string, number[]> = {
  "alabama": [53866, 66498, 78683, 94051],
  "alaska": [70192, 89213, 101821, 118790],
  "arizona": [56663, 72656, 83389, 98068],
  "arkansas": [48637, 60885, 72647, 86285],
  "california": [66944, 86968, 94392, 109784],
  "colorado": [68732, 88285, 100044, 117138],
  "connecticut": [73093, 93905, 112451, 134660],
  "delaware": [62027, 79022, 93389, 109890],
  "florida": [54789, 70782, 79078, 94350],
  "georgia": [56008, 71619, 83645, 99456],
  "hawaii": [72818, 91658, 103553, 119972],
  "idaho": [55655, 69772, 79050, 91972],
  "illinois": [63555, 81123, 96092, 113766],
  "indiana": [55080, 69671, 82618, 98536],
  "iowa": [58431, 74160, 88475, 105406],
  "kansas": [57916, 74398, 88136, 104815],
  "kentucky": [51213, 65141, 77620, 92949],
  "louisiana": [50827, 63765, 75018, 90696],
  "maine": [56814, 72037, 86463, 103547],
  "maryland": [76008, 96688, 115137, 134441],
  "massachusetts": [77378, 99156, 119844, 143573],
  "michigan": [56562, 72055, 86118, 102898],
  "minnesota": [68655, 87736, 104521, 123408],
  "mississippi": [45081, 57689, 67556, 81695],
  "missouri": [54816, 69752, 82871, 99224],
  "montana": [55784, 70037, 82893, 97737],
  "nebraska": [60682, 77407, 91833, 109056],
  "nevada": [58148, 73196, 82008, 95755],
  "new_hampshire": [73277, 93270, 111350, 131740],
  "new_jersey": [76474, 97181, 116341, 138183],
  "new_mexico": [49878, 62363, 71841, 84619],
  "new_york": [62475, 82934, 96186, 115350],
  "north_carolina": [54424, 69605, 81423, 97265],
  "north_dakota": [62553, 80649, 95616, 113551],
  "ohio": [55325, 70389, 84190, 100837],
  "oklahoma": [52050, 66269, 78091, 93251],
  "oregon": [61637, 78051, 90233, 105808],
  "pennsylvania": [59445, 75611, 90614, 108475],
  "rhode_island": [66026, 83854, 100686, 120614],
  "south_carolina": [52466, 67017, 78574, 94227],
  "south_dakota": [57758, 73671, 87454, 104026],
  "tennessee": [53499, 67972, 80231, 96252],
  "texas": [55737, 73303, 83094, 98619],
  "utah": [65103, 79818, 87851, 99713],
  "vermont": [61853, 78112, 94235, 112693],
  "virginia": [69535, 88726, 104851, 123530],
  "washington": [70103, 89298, 102545, 119835],
  "west_virginia": [46616, 59268, 70578, 84582],
  "wisconsin": [59554, 76123, 91071, 108605],
  "wyoming": [60575, 77117, 90815, 107503],
};

// State display names
const stateNames: Record<string, string> = {
  "alabama": "Alabama", "alaska": "Alaska", "arizona": "Arizona", "arkansas": "Arkansas",
  "california": "California", "colorado": "Colorado", "connecticut": "Connecticut", "delaware": "Delaware",
  "florida": "Florida", "georgia": "Georgia", "hawaii": "Hawaii", "idaho": "Idaho",
  "illinois": "Illinois", "indiana": "Indiana", "iowa": "Iowa", "kansas": "Kansas",
  "kentucky": "Kentucky", "louisiana": "Louisiana", "maine": "Maine", "maryland": "Maryland",
  "massachusetts": "Massachusetts", "michigan": "Michigan", "minnesota": "Minnesota", "mississippi": "Mississippi",
  "missouri": "Missouri", "montana": "Montana", "nebraska": "Nebraska", "nevada": "Nevada",
  "new_hampshire": "New Hampshire", "new_jersey": "New Jersey", "new_mexico": "New Mexico", "new_york": "New York",
  "north_carolina": "North Carolina", "north_dakota": "North Dakota", "ohio": "Ohio", "oklahoma": "Oklahoma",
  "oregon": "Oregon", "pennsylvania": "Pennsylvania", "rhode_island": "Rhode Island", "south_carolina": "South Carolina",
  "south_dakota": "South Dakota", "tennessee": "Tennessee", "texas": "Texas", "utah": "Utah",
  "vermont": "Vermont", "virginia": "Virginia", "washington": "Washington", "west_virginia": "West Virginia",
  "wisconsin": "Wisconsin", "wyoming": "Wyoming",
};

// Constants
const FILING_FEE = 313;
const TRUSTEE_FEE_PERCENT = 0.10;
const ATTORNEY_FEE_ESTIMATE = 3500;

// FAQ data
const faqs = [
  {
    question: "What is the average Chapter 13 monthly payment?",
    answer: "Chapter 13 monthly payments typically range from $500-$600 for basic cases without mortgage arrears. If you're behind on your mortgage, payments can be $1,000-$1,500 or more. High-income filers with significant debt may pay $2,000-$3,000+ monthly. Your actual payment depends on your income, debts, expenses, and whether you're catching up on secured debt arrears."
  },
  {
    question: "How is my Chapter 13 payment calculated?",
    answer: "Your Chapter 13 payment is based on three tests: (1) Feasibility - you must be able to pay secured arrears, priority debts, trustee fees, and attorney fees; (2) Best Interest - unsecured creditors must receive at least what they'd get in Chapter 7; (3) Disposable Income - all disposable income after allowed expenses must go to the plan. The payment is the highest amount required by any of these tests."
  },
  {
    question: "Can I file bankruptcy if I make $100,000 a year?",
    answer: "Yes, you can file Chapter 13 bankruptcy regardless of income level. In fact, Chapter 13 is designed for people with regular income who can afford to repay some debts. Higher income may mean larger monthly payments and a 5-year plan instead of 3 years, but it doesn't disqualify you. The means test determines if you qualify for Chapter 7; if not, Chapter 13 is usually available."
  },
  {
    question: "Does Chapter 13 wipe out all debt?",
    answer: "No. Chapter 13 requires full payment of priority debts (recent taxes, child support, alimony) and secured debt arrears if you want to keep the property. Unsecured debts (credit cards, medical bills) may be partially paid or discharged after completing the plan. Some debts like student loans, recent taxes, and domestic support cannot be discharged in any bankruptcy."
  },
  {
    question: "How long is a Chapter 13 repayment plan?",
    answer: "Chapter 13 plans last either 36 months (3 years) or 60 months (5 years). If your income is below your state's median income for your household size, you can propose a 3-year plan. If your income is above the median, you must commit to a 5-year plan. You can always pay off your plan early if you have the funds."
  },
  {
    question: "What debts are not discharged in Chapter 13?",
    answer: "Debts that survive Chapter 13 include: most student loans, child support and alimony obligations, debts from fraud or willful injury, criminal fines and restitution, certain tax debts, debts not listed in your bankruptcy filing, and debts from death or injury caused by drunk driving. These must be paid regardless of bankruptcy."
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

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Get plan length based on income vs median
function getPlanLength(annualIncome: number, householdSize: number, state: string): number {
  const sizeIndex = Math.min(householdSize - 1, 3);
  const median = stateMedianIncome[state]?.[sizeIndex] || 70000;
  return annualIncome <= median ? 36 : 60;
}

// Quick estimate calculation (simplified)
function calculateQuickEstimate(
  monthlyIncome: number,
  householdSize: number,
  state: string,
  totalDebt: number
): {
  monthlyPayment: number;
  planMonths: number;
  paymentRange: { low: number; high: number };
} {
  const annualIncome = monthlyIncome * 12;
  const planMonths = getPlanLength(annualIncome, householdSize, state);
  
  // Simplified calculation: estimate based on debt and income
  const basePayment = totalDebt / planMonths;
  const attorneyMonthly = ATTORNEY_FEE_ESTIMATE / planMonths;
  const filingMonthly = FILING_FEE / planMonths;
  
  // Rough estimate of disposable income contribution
  const disposableEstimate = monthlyIncome * 0.15;
  
  // Minimum payment includes fees + some debt repayment
  const subtotal = Math.min(basePayment, disposableEstimate) + attorneyMonthly + filingMonthly;
  const trusteeFee = subtotal * TRUSTEE_FEE_PERCENT;
  const monthlyPayment = subtotal + trusteeFee;
  
  // Provide a range (±20%)
  return {
    monthlyPayment,
    planMonths,
    paymentRange: {
      low: Math.round(monthlyPayment * 0.8),
      high: Math.round(monthlyPayment * 1.3)
    }
  };
}

// Detailed calculation
function calculateDetailed(
  monthlyIncome: number,
  spouseIncome: number,
  householdSize: number,
  state: string,
  mortgageArrears: number,
  carArrears: number,
  priorityDebt: number,
  unsecuredDebt: number,
  monthlyExpenses: number
): {
  monthlyPayment: number;
  planMonths: number;
  breakdown: {
    mortgageArrears: number;
    carArrears: number;
    priority: number;
    unsecured: number;
    attorneyFee: number;
    trusteeFee: number;
    filingFee: number;
  };
  totalPlanCost: number;
  unsecuredPercent: number;
  disposableIncome: number;
} {
  const totalIncome = monthlyIncome + spouseIncome;
  const annualIncome = totalIncome * 12;
  const planMonths = getPlanLength(annualIncome, householdSize, state);
  
  // Calculate monthly payments for each category
  const mortgageMonthly = mortgageArrears / planMonths;
  const carMonthly = carArrears / planMonths;
  const priorityMonthly = priorityDebt / planMonths;
  const attorneyMonthly = ATTORNEY_FEE_ESTIMATE / planMonths;
  const filingMonthly = FILING_FEE / planMonths;
  
  // Calculate disposable income
  const sizeIndex = Math.min(householdSize - 1, 3);
  const median = stateMedianIncome[state]?.[sizeIndex] || 70000;
  
  // Use actual expenses if provided, otherwise estimate
  const allowedExpenses = monthlyExpenses > 0 ? monthlyExpenses : totalIncome * 0.85;
  const disposableIncome = Math.max(0, totalIncome - allowedExpenses);
  
  // Base payment (must pay)
  const basePayment = mortgageMonthly + carMonthly + priorityMonthly + attorneyMonthly + filingMonthly;
  
  // Unsecured payment is remaining disposable income
  const availableForUnsecured = Math.max(0, disposableIncome - basePayment);
  const unsecuredMonthly = Math.min(availableForUnsecured, unsecuredDebt / planMonths);
  
  // Calculate what percent of unsecured debt will be paid
  const totalUnsecuredPayment = unsecuredMonthly * planMonths;
  const unsecuredPercent = unsecuredDebt > 0 ? (totalUnsecuredPayment / unsecuredDebt) * 100 : 0;
  
  // Subtotal before trustee fee
  const subtotal = basePayment + unsecuredMonthly;
  
  // Trustee fee (on distributed amount)
  const trusteeFee = subtotal * TRUSTEE_FEE_PERCENT;
  
  // Total monthly payment
  const monthlyPayment = subtotal + trusteeFee;
  
  return {
    monthlyPayment,
    planMonths,
    breakdown: {
      mortgageArrears: mortgageMonthly,
      carArrears: carMonthly,
      priority: priorityMonthly,
      unsecured: unsecuredMonthly,
      attorneyFee: attorneyMonthly,
      trusteeFee,
      filingFee: filingMonthly
    },
    totalPlanCost: monthlyPayment * planMonths,
    unsecuredPercent: Math.min(100, unsecuredPercent),
    disposableIncome
  };
}

export default function Chapter13BankruptcyCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"quick" | "detailed" | "info">("quick");
  
  // Quick estimate inputs (simple)
  const [quickIncome, setQuickIncome] = useState<string>("5000");
  const [quickState, setQuickState] = useState<string>("california");
  const [quickHousehold, setQuickHousehold] = useState<string>("2");
  const [quickTotalDebt, setQuickTotalDebt] = useState<string>("50000");
  
  // Detailed inputs (comprehensive)
  const [detailedIncome, setDetailedIncome] = useState<string>("5000");
  const [spouseIncome, setSpouseIncome] = useState<string>("0");
  const [detailedState, setDetailedState] = useState<string>("california");
  const [detailedHousehold, setDetailedHousehold] = useState<string>("2");
  const [mortgageArrears, setMortgageArrears] = useState<string>("0");
  const [carArrears, setCarArrears] = useState<string>("0");
  const [priorityDebt, setPriorityDebt] = useState<string>("5000");
  const [unsecuredDebt, setUnsecuredDebt] = useState<string>("30000");
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>("0");

  // Calculate quick result
  const quickResult = calculateQuickEstimate(
    parseFloat(quickIncome) || 0,
    parseInt(quickHousehold) || 1,
    quickState,
    parseFloat(quickTotalDebt) || 0
  );
  
  // Calculate detailed result
  const detailedResult = calculateDetailed(
    parseFloat(detailedIncome) || 0,
    parseFloat(spouseIncome) || 0,
    parseInt(detailedHousehold) || 1,
    detailedState,
    parseFloat(mortgageArrears) || 0,
    parseFloat(carArrears) || 0,
    parseFloat(priorityDebt) || 0,
    parseFloat(unsecuredDebt) || 0,
    parseFloat(monthlyExpenses) || 0
  );

  // Get median income for display
  const quickSizeIndex = Math.min((parseInt(quickHousehold) || 1) - 1, 3);
  const quickMedian = stateMedianIncome[quickState]?.[quickSizeIndex] || 70000;
  const quickAnnual = (parseFloat(quickIncome) || 0) * 12;
  const quickAboveMedian = quickAnnual > quickMedian;
  
  const detailedSizeIndex = Math.min((parseInt(detailedHousehold) || 1) - 1, 3);
  const detailedMedian = stateMedianIncome[detailedState]?.[detailedSizeIndex] || 70000;
  const detailedAnnual = ((parseFloat(detailedIncome) || 0) + (parseFloat(spouseIncome) || 0)) * 12;
  const detailedAboveMedian = detailedAnnual > detailedMedian;

  const tabs = [
    { id: "quick", label: "Quick Estimate", icon: "⚡" },
    { id: "detailed", label: "Detailed Calculator", icon: "📋" },
    { id: "info", label: "How It Works", icon: "📖" }
  ];

  // Calculate donut chart segments for detailed view
  const segments = [
    { label: "Mortgage Arrears", value: detailedResult.breakdown.mortgageArrears, color: "#3B82F6" },
    { label: "Car Arrears", value: detailedResult.breakdown.carArrears, color: "#8B5CF6" },
    { label: "Priority Debt", value: detailedResult.breakdown.priority, color: "#EF4444" },
    { label: "Unsecured Debt", value: detailedResult.breakdown.unsecured, color: "#10B981" },
    { label: "Attorney Fee", value: detailedResult.breakdown.attorneyFee, color: "#F59E0B" },
    { label: "Trustee Fee", value: detailedResult.breakdown.trusteeFee, color: "#6366F1" },
  ].filter(s => s.value > 0);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Chapter 13 Bankruptcy Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>⚖️</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Chapter 13 Bankruptcy Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Estimate your Chapter 13 repayment plan monthly payment. Start with a quick estimate or 
            use the detailed calculator for a more accurate projection.
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div style={{
          backgroundColor: "#FEF2F2",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "32px",
          border: "1px solid #FECACA"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <div>
              <p style={{ fontWeight: "600", color: "#991B1B", margin: "0 0 4px 0" }}>Important Disclaimer</p>
              <p style={{ color: "#B91C1C", margin: 0, fontSize: "0.85rem" }}>
                This calculator provides <strong>estimates only</strong> and is not legal advice. Bankruptcy law is complex 
                and varies by jurisdiction. Please consult with a qualified bankruptcy attorney before making any decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info Box */}
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #BFDBFE"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0" }}>Average Chapter 13 Payment</p>
              <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.95rem" }}>
                Typical payments range from <strong>$500-$600/month</strong> (basic cases) to <strong>$1,500+</strong> (with mortgage arrears). 
                Your payment depends on income, debts, and what property you want to keep.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                padding: "12px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                backgroundColor: activeTab === tab.id ? "#1E40AF" : "#E5E7EB",
                color: activeTab === tab.id ? "white" : "#374151",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Calculator */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "0 16px 16px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "quick" && "⚡ Quick Estimate (4 Questions)"}
                {activeTab === "detailed" && "📋 Detailed Calculator"}
                {activeTab === "info" && "📖 Understanding Chapter 13"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* QUICK ESTIMATE TAB */}
              {activeTab === "quick" && (
                <>
                  <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "20px", padding: "12px", backgroundColor: "#F3F4F6", borderRadius: "8px" }}>
                    ⚡ Answer just 4 questions for a rough estimate. Use the <strong>Detailed Calculator</strong> tab for a more accurate projection.
                  </p>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      1. What is your monthly gross income?
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={quickIncome}
                        onChange={(e) => setQuickIncome(e.target.value)}
                        placeholder="5000"
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem"
                        }}
                      />
                      <span style={{ color: "#6B7280" }}>/month</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      2. What state do you live in?
                    </label>
                    <select
                      value={quickState}
                      onChange={(e) => setQuickState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {Object.entries(stateNames).map(([key, name]) => (
                        <option key={key} value={key}>{name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      3. How many people in your household?
                    </label>
                    <select
                      value={quickHousehold}
                      onChange={(e) => setQuickHousehold(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(size => (
                        <option key={size} value={size}>{size} {size === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "6px", fontWeight: "600" }}>
                      4. What is your total debt? (approximate)
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#6B7280" }}>$</span>
                      <input
                        type="number"
                        value={quickTotalDebt}
                        onChange={(e) => setQuickTotalDebt(e.target.value)}
                        placeholder="50000"
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem"
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: "4px" }}>
                      Include credit cards, medical bills, taxes owed, mortgage arrears, car loan arrears
                    </p>
                  </div>
                </>
              )}

              {/* DETAILED CALCULATOR TAB */}
              {activeTab === "detailed" && (
                <>
                  {/* Income Section */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px", borderBottom: "2px solid #DBEAFE", paddingBottom: "8px" }}>
                      💰 Income Information
                    </h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          Your Monthly Income ($)
                        </label>
                        <input
                          type="number"
                          value={detailedIncome}
                          onChange={(e) => setDetailedIncome(e.target.value)}
                          placeholder="5000"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          Spouse Income ($)
                        </label>
                        <input
                          type="number"
                          value={spouseIncome}
                          onChange={(e) => setSpouseIncome(e.target.value)}
                          placeholder="0"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          State
                        </label>
                        <select
                          value={detailedState}
                          onChange={(e) => setDetailedState(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.9rem",
                            backgroundColor: "white"
                          }}
                        >
                          {Object.entries(stateNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          Household Size
                        </label>
                        <select
                          value={detailedHousehold}
                          onChange={(e) => setDetailedHousehold(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.9rem",
                            backgroundColor: "white"
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6].map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Secured Debts */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px", borderBottom: "2px solid #DBEAFE", paddingBottom: "8px" }}>
                      🏠 Secured Debt Arrears
                    </h3>
                    <p style={{ fontSize: "0.7rem", color: "#6B7280", marginBottom: "8px" }}>
                      Enter amount you&apos;re <strong>behind</strong> (not total owed). Enter $0 if current on payments.
                    </p>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          Mortgage Arrears ($)
                        </label>
                        <input
                          type="number"
                          value={mortgageArrears}
                          onChange={(e) => setMortgageArrears(e.target.value)}
                          placeholder="0"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                          Car Loan Arrears ($)
                        </label>
                        <input
                          type="number"
                          value={carArrears}
                          onChange={(e) => setCarArrears(e.target.value)}
                          placeholder="0"
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            fontSize: "0.95rem",
                            boxSizing: "border-box"
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Other Debts */}
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px", borderBottom: "2px solid #DBEAFE", paddingBottom: "8px" }}>
                      💳 Other Debts
                    </h3>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                        Priority Debt ($) <span style={{ color: "#DC2626", fontSize: "0.7rem" }}>Must be paid 100%</span>
                      </label>
                      <input
                        type="number"
                        value={priorityDebt}
                        onChange={(e) => setPriorityDebt(e.target.value)}
                        placeholder="5000"
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "2px" }}>
                        Taxes owed, child support arrears, alimony
                      </p>
                    </div>
                    
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                        Unsecured Debt ($) <span style={{ color: "#059669", fontSize: "0.7rem" }}>May be reduced</span>
                      </label>
                      <input
                        type="number"
                        value={unsecuredDebt}
                        onChange={(e) => setUnsecuredDebt(e.target.value)}
                        placeholder="30000"
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "2px" }}>
                        Credit cards, medical bills, personal loans
                      </p>
                    </div>
                  </div>

                  {/* Monthly Expenses (optional) */}
                  <div>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px", borderBottom: "2px solid #DBEAFE", paddingBottom: "8px" }}>
                      📝 Monthly Expenses (Optional)
                    </h3>
                    <div>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#374151", marginBottom: "4px", fontWeight: "500" }}>
                        Total Monthly Expenses ($)
                      </label>
                      <input
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                        placeholder="Leave blank for estimate"
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "0.95rem",
                          boxSizing: "border-box"
                        }}
                      />
                      <p style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "2px" }}>
                        Rent/mortgage payment, utilities, food, insurance, car payment, etc.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* INFO TAB */}
              {activeTab === "info" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>What is Chapter 13?</h3>
                    <p style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.7" }}>
                      Chapter 13 is a &quot;reorganization&quot; bankruptcy that allows you to keep your property while 
                      repaying debts over 3-5 years. It&apos;s ideal for people with regular income who want to 
                      catch up on mortgage or car payments and protect assets from liquidation.
                    </p>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>Types of Debt</h3>
                    
                    <div style={{ backgroundColor: "#FEE2E2", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#991B1B", margin: "0 0 4px 0", fontSize: "0.85rem" }}>🔴 Priority Debts (100%)</p>
                      <p style={{ color: "#B91C1C", margin: 0, fontSize: "0.8rem" }}>Taxes, child support, alimony - must pay in full</p>
                    </div>
                    
                    <div style={{ backgroundColor: "#DBEAFE", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                      <p style={{ fontWeight: "600", color: "#1E40AF", margin: "0 0 4px 0", fontSize: "0.85rem" }}>🔵 Secured Debts (arrears)</p>
                      <p style={{ color: "#1D4ED8", margin: 0, fontSize: "0.8rem" }}>Mortgage & car arrears to keep property</p>
                    </div>
                    
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0", fontSize: "0.85rem" }}>🟢 Unsecured Debts (0-100%)</p>
                      <p style={{ color: "#047857", margin: 0, fontSize: "0.8rem" }}>Credit cards, medical bills - based on income</p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#1E40AF", marginBottom: "12px" }}>3-Year vs 5-Year Plan</h3>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.7" }}>
                      <p style={{ margin: "0 0 8px 0" }}>
                        <strong>3-Year Plan:</strong> Income <em>below</em> state median
                      </p>
                      <p style={{ margin: 0 }}>
                        <strong>5-Year Plan:</strong> Income <em>above</em> state median
                      </p>
                    </div>
                  </div>
                </>
              )}
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "quick" && "💵 Quick Estimate"}
                {activeTab === "detailed" && "💵 Detailed Estimate"}
                {activeTab === "info" && "📊 Chapter 13 vs Chapter 7"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {/* QUICK RESULTS */}
              {activeTab === "quick" && (
                <>
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#92400E" }}>
                      Estimated Payment Range
                    </p>
                    <p style={{ margin: 0, fontSize: "2rem", fontWeight: "bold", color: "#B45309" }}>
                      {formatCurrency(quickResult.paymentRange.low)} - {formatCurrency(quickResult.paymentRange.high)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#D97706" }}>
                      per month for {quickResult.planMonths / 12} years
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: quickAboveMedian ? "#FEF3C7" : "#DBEAFE",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "16px",
                    border: quickAboveMedian ? "1px solid #FCD34D" : "1px solid #93C5FD"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: quickAboveMedian ? "#92400E" : "#1E40AF" }}>
                      📊 Your income ({formatCurrency(quickAnnual)}/yr) is <strong>{quickAboveMedian ? "above" : "below"}</strong> {stateNames[quickState]} median ({formatCurrency(quickMedian)}) 
                      → <strong>{quickResult.planMonths / 12}-year plan</strong>
                    </p>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 What This Estimate Includes</h4>
                    <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85rem", color: "#4B5563", lineHeight: "1.8" }}>
                      <li>Debt repayment over {quickResult.planMonths} months</li>
                      <li>Attorney fees (~$3,500)</li>
                      <li>Filing fee ($313)</li>
                      <li>Trustee fee (~10%)</li>
                    </ul>
                  </div>

                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#4338CA" }}>
                      👉 For a more accurate estimate, use the <strong>Detailed Calculator</strong> tab to enter your specific debt types.
                    </p>
                  </div>
                </>
              )}

              {/* DETAILED RESULTS */}
              {activeTab === "detailed" && (
                <>
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Estimated Monthly Payment
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatCurrency(detailedResult.monthlyPayment)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      over {detailedResult.planMonths} months ({detailedResult.planMonths / 12} years)
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: detailedAboveMedian ? "#FEF3C7" : "#DBEAFE",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "16px",
                    border: detailedAboveMedian ? "1px solid #FCD34D" : "1px solid #93C5FD"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: detailedAboveMedian ? "#92400E" : "#1E40AF" }}>
                      📊 Income ({formatCurrency(detailedAnnual)}/yr) is <strong>{detailedAboveMedian ? "above" : "below"}</strong> {stateNames[detailedState]} median ({formatCurrency(detailedMedian)}) 
                      → <strong>{detailedResult.planMonths / 12}-year plan</strong>
                    </p>
                  </div>

                  {/* Payment Breakdown */}
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Payment Breakdown</h4>
                    <div style={{ fontSize: "0.85rem" }}>
                      {segments.map((seg, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: seg.color }} />
                            <span style={{ color: "#4B5563" }}>{seg.label}</span>
                          </div>
                          <span style={{ fontWeight: "600", color: "#111827" }}>{formatCurrency(seg.value)}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid #D1D5DB", paddingTop: "8px", marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: "600", color: "#374151" }}>Total Monthly</span>
                        <span style={{ fontWeight: "bold", color: "#059669" }}>{formatCurrency(detailedResult.monthlyPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: "#EEF2FF", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#3730A3" }}>Total Plan Cost</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#4F46E5" }}>
                        {formatCurrency(detailedResult.totalPlanCost)}
                      </p>
                    </div>
                    <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#065F46" }}>Unsecured Debt Paid</p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "1.1rem", fontWeight: "bold", color: "#059669" }}>
                        {detailedResult.unsecuredPercent.toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      ⚠️ <strong>Rough estimate only.</strong> Actual payment depends on means test, IRS expense standards, and court requirements. Consult a bankruptcy attorney.
                    </p>
                  </div>
                </>
              )}

              {/* INFO RESULTS */}
              {activeTab === "info" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                      <thead>
                        <tr style={{ backgroundColor: "#EEF2FF" }}>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "left" }}>Feature</th>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Ch. 7</th>
                          <th style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Ch. 13</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>Duration</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>3-6 mo</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>3-5 yr</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>Keep Property</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Maybe</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Yes</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>Catch Up Mortgage</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>No</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>Yes</td>
                        </tr>
                        <tr style={{ backgroundColor: "#F9FAFB" }}>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>Income Limit</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>Yes</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>No</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB" }}>Monthly Payment</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>$0</td>
                          <td style={{ padding: "10px", border: "1px solid #E5E7EB", textAlign: "center" }}>$500+</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ backgroundColor: "#ECFDF5", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#065F46", fontSize: "0.9rem" }}>✅ Chapter 13 Is Good If You:</h4>
                    <ul style={{ margin: 0, paddingLeft: "20px", color: "#047857", fontSize: "0.85rem", lineHeight: "1.8" }}>
                      <li>Want to keep your home</li>
                      <li>Have regular income</li>
                      <li>Don&apos;t qualify for Chapter 7</li>
                      <li>Need to catch up on payments</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>💰 Typical Costs</h4>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Filing Fee:</span>
                        <span style={{ fontWeight: "500" }}>$313</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>Attorney Fees:</span>
                        <span style={{ fontWeight: "500" }}>$2,500 - $6,000</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Trustee Fee:</span>
                        <span style={{ fontWeight: "500" }}>~10%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Debt Types Reference */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#1E40AF", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Understanding Debt Types in Chapter 13</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              <div style={{ backgroundColor: "#FEE2E2", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ color: "#991B1B", margin: "0 0 12px 0", fontSize: "1rem" }}>🔴 Priority Debts</h3>
                <p style={{ color: "#B91C1C", margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "600" }}>Must be paid 100%</p>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#7F1D1D", fontSize: "0.85rem", lineHeight: "1.8" }}>
                  <li>Recent income taxes (last 3 years)</li>
                  <li>Child support arrears</li>
                  <li>Alimony/spousal support owed</li>
                  <li>Criminal fines & restitution</li>
                </ul>
              </div>

              <div style={{ backgroundColor: "#DBEAFE", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ color: "#1E40AF", margin: "0 0 12px 0", fontSize: "1rem" }}>🔵 Secured Debts</h3>
                <p style={{ color: "#1D4ED8", margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "600" }}>Arrears paid to keep property</p>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#1E3A8A", fontSize: "0.85rem", lineHeight: "1.8" }}>
                  <li>Mortgage (if behind on payments)</li>
                  <li>Car loans (arrears + current)</li>
                  <li>Home equity loans</li>
                  <li>Property tax liens</li>
                </ul>
              </div>

              <div style={{ backgroundColor: "#ECFDF5", borderRadius: "12px", padding: "20px" }}>
                <h3 style={{ color: "#065F46", margin: "0 0 12px 0", fontSize: "1rem" }}>🟢 Unsecured Debts</h3>
                <p style={{ color: "#047857", margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "600" }}>0-100% based on disposable income</p>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#14532D", fontSize: "0.85rem", lineHeight: "1.8" }}>
                  <li>Credit card debt</li>
                  <li>Medical bills</li>
                  <li>Personal loans</li>
                  <li>Payday loans</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>⚖️ How Chapter 13 Payment Is Calculated</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The Three Tests</h3>
                <p>
                  Your Chapter 13 payment must satisfy three requirements. Your payment is the <strong>highest 
                  amount</strong> required by any of these tests:
                </p>
                <ol style={{ paddingLeft: "20px" }}>
                  <li><strong>Feasibility Test:</strong> Pay secured arrears, priority debts, trustee fees, and attorney fees within 60 months.</li>
                  <li><strong>Best Interest Test:</strong> Unsecured creditors receive at least what they&apos;d get in Chapter 7.</li>
                  <li><strong>Disposable Income Test:</strong> All disposable income goes to the plan for 3-5 years.</li>
                </ol>
              </div>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px" }}>
            <div style={{ backgroundColor: "#EFF6FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #BFDBFE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#1E40AF", marginBottom: "16px" }}>🤝 Next Steps</h3>
              <div style={{ fontSize: "0.85rem", color: "#1D4ED8", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>1. Gather financial documents</p>
                <p style={{ margin: "0 0 8px 0" }}>2. Complete credit counseling</p>
                <p style={{ margin: "0 0 8px 0" }}>3. Consult bankruptcy attorney</p>
                <p style={{ margin: 0 }}>4. File petition with court</p>
              </div>
            </div>

            <div style={{ backgroundColor: "#FEF3C7", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FCD34D" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#92400E", marginBottom: "12px" }}>📈 Typical Payments</h3>
              <div style={{ fontSize: "0.85rem", color: "#B45309", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>Basic case: <strong>$500-$600</strong></p>
                <p style={{ margin: 0 }}>With mortgage: <strong>$1,000-$1,500</strong></p>
                <p style={{ margin: 0 }}>High income: <strong>$2,000-$3,000+</strong></p>
              </div>
            </div>

            <RelatedTools currentUrl="/chapter-13-bankruptcy-calculator" currentCategory="Finance" />
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

        {/* Final Disclaimer */}
        <div style={{ padding: "20px", backgroundColor: "#FEF2F2", borderRadius: "12px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.85rem", color: "#991B1B", textAlign: "center", margin: 0, lineHeight: "1.7" }}>
            ⚖️ <strong>Legal Disclaimer:</strong> This calculator provides rough estimates for informational purposes only. 
            It is <strong>not legal advice</strong>. Bankruptcy law is complex and varies by jurisdiction. 
            <strong> Always consult with a qualified bankruptcy attorney</strong> before making any decisions.
          </p>
        </div>
      </div>
    </div>
  );
}