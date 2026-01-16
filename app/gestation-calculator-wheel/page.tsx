"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// FAQ data
const faqs = [
  {
    question: "How does a pregnancy wheel calculator work?",
    answer: "A pregnancy wheel (also called gestation calculator or OB wheel) calculates your due date by adding 280 days (40 weeks) to the first day of your last menstrual period (LMP). It assumes a standard 28-day cycle with ovulation occurring on day 14. If your cycle is longer or shorter, the calculator adjusts accordingly. For example, with a 35-day cycle, ovulation likely occurs around day 21, so 7 days are added to the standard calculation."
  },
  {
    question: "How accurate is a gestational age calculator?",
    answer: "A gestational age calculator based on LMP is most accurate when you have regular menstrual cycles and know the exact date of your last period. It's typically accurate within 1-2 weeks. However, first-trimester ultrasound (between 8-12 weeks) is considered the gold standard for dating pregnancy, with accuracy within 3-5 days. Your healthcare provider may adjust your due date based on ultrasound measurements."
  },
  {
    question: "What is the difference between gestational age and fetal age?",
    answer: "Gestational age is calculated from the first day of your last menstrual period (LMP), while fetal age (also called conceptional age) is calculated from the actual date of conception. Since conception typically occurs about 2 weeks after LMP, fetal age is always about 2 weeks less than gestational age. Healthcare providers use gestational age as the standard measurement for pregnancy."
  },
  {
    question: "When does each trimester start and end?",
    answer: "The first trimester spans weeks 1-12, covering initial development and organ formation. The second trimester is weeks 13-27, when the baby grows rapidly and you may feel movement. The third trimester is weeks 28-40, preparing for birth. However, some sources define trimesters slightly differently (e.g., second trimester starting at week 14), so always confirm with your healthcare provider."
  },
  {
    question: "What if my cycle is irregular?",
    answer: "If you have irregular cycles, LMP-based calculations may be less accurate. In this case, early ultrasound dating becomes more important. You can still use this calculator with your best estimate of LMP, but discuss the results with your healthcare provider. They may adjust your due date based on ultrasound measurements, especially if there's a significant discrepancy."
  },
  {
    question: "Can I calculate my due date from conception date?",
    answer: "Yes! If you know your conception date (for example, from IVF or tracked ovulation), you can calculate your due date by adding 266 days (38 weeks). Our calculator's ultrasound tab allows you to enter a known gestational age from a specific date, which works similarly. Conception-based dating is often more accurate than LMP-based calculation."
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

// Helper functions
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

// Pregnancy milestones
function getMilestones(lmp: Date, edd: Date) {
  return [
    { name: "Implantation", week: "3-4", date: addDays(lmp, 23), description: "Embryo implants in uterus" },
    { name: "First Heartbeat", week: "6", date: addDays(lmp, 42), description: "Heart begins to beat" },
    { name: "First Ultrasound", week: "8", date: addDays(lmp, 56), description: "Dating scan recommended" },
    { name: "End of 1st Trimester", week: "12", date: addDays(lmp, 84), description: "Risk of miscarriage drops" },
    { name: "NT Scan / NIPT", week: "11-14", date: addDays(lmp, 77), description: "Genetic screening window" },
    { name: "Anatomy Scan", week: "18-22", date: addDays(lmp, 140), description: "Detailed ultrasound" },
    { name: "Viability", week: "24", date: addDays(lmp, 168), description: "Baby could survive if born" },
    { name: "Glucose Test", week: "24-28", date: addDays(lmp, 182), description: "Gestational diabetes screening" },
    { name: "3rd Trimester Starts", week: "28", date: addDays(lmp, 196), description: "Final stage of pregnancy" },
    { name: "Full Term", week: "37", date: addDays(lmp, 259), description: "Safe to deliver" },
    { name: "Due Date", week: "40", date: edd, description: "Expected date of delivery" },
  ];
}

export default function GestationCalculatorWheel() {
  const [activeTab, setActiveTab] = useState<'lmp' | 'edd' | 'ultrasound'>('lmp');

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Default LMP: 10 weeks ago
  const defaultLMP = addDays(today, -70);

  // Tab 1: Calculate from LMP
  const [lmpDate, setLmpDate] = useState<string>(formatDateInput(defaultLMP));
  const [cycleLength, setCycleLength] = useState<string>("28");

  // Tab 2: Calculate from Due Date
  const [eddInput, setEddInput] = useState<string>(formatDateInput(addDays(today, 210)));

  // Tab 3: Calculate from Ultrasound
  const [ultrasoundDate, setUltrasoundDate] = useState<string>(formatDateInput(today));
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState<string>("8");
  const [ultrasoundDays, setUltrasoundDays] = useState<string>("0");

  // Tab 1 Calculations - from LMP
  const lmpResults = useMemo(() => {
    const lmp = new Date(lmpDate);
    lmp.setHours(0, 0, 0, 0);
    
    const cycle = parseInt(cycleLength) || 28;
    const cycleAdjustment = cycle - 28;
    
    // Calculate EDD (280 days from LMP + cycle adjustment)
    const edd = addDays(lmp, 280 + cycleAdjustment);
    
    // Calculate conception date (typically day 14 of cycle, adjusted for cycle length)
    const ovulationDay = Math.round(cycle / 2);
    const conceptionDate = addDays(lmp, ovulationDay);
    
    // Calculate current gestational age
    const daysPregnant = daysBetween(lmp, today);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemaining = daysPregnant % 7;
    
    // Calculate trimester
    let trimester = 1;
    if (weeksPregnant >= 28) trimester = 3;
    else if (weeksPregnant >= 13) trimester = 2;
    
    // Days until due date
    const daysUntilDue = daysBetween(today, edd);
    
    // Progress percentage (0-100)
    const progressPercent = Math.min(Math.max((daysPregnant / 280) * 100, 0), 100);
    
    // Trimester dates
    const trimester1End = addDays(lmp, 84); // Week 12
    const trimester2End = addDays(lmp, 196); // Week 28
    
    // Get milestones
    const milestones = getMilestones(lmp, edd);
    
    // Is currently pregnant (between LMP and EDD + 2 weeks)?
    const isCurrentlyPregnant = daysPregnant >= 0 && daysPregnant <= 294;

    return {
      lmp,
      edd,
      conceptionDate,
      daysPregnant,
      weeksPregnant,
      daysRemaining,
      trimester,
      daysUntilDue,
      progressPercent,
      trimester1End,
      trimester2End,
      milestones,
      isCurrentlyPregnant,
      cycle
    };
  }, [lmpDate, cycleLength]);

  // Tab 2 Calculations - from EDD
  const eddResults = useMemo(() => {
    const edd = new Date(eddInput);
    edd.setHours(0, 0, 0, 0);
    
    // Calculate LMP (EDD - 280 days)
    const lmp = addDays(edd, -280);
    
    // Calculate conception date
    const conceptionDate = addDays(lmp, 14);
    
    // Calculate current gestational age
    const daysPregnant = daysBetween(lmp, today);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemaining = daysPregnant % 7;
    
    // Calculate trimester
    let trimester = 1;
    if (weeksPregnant >= 28) trimester = 3;
    else if (weeksPregnant >= 13) trimester = 2;
    
    // Days until due date
    const daysUntilDue = daysBetween(today, edd);
    
    // Progress percentage
    const progressPercent = Math.min(Math.max((daysPregnant / 280) * 100, 0), 100);
    
    // Get milestones
    const milestones = getMilestones(lmp, edd);
    
    const isCurrentlyPregnant = daysPregnant >= 0 && daysPregnant <= 294;

    return {
      lmp,
      edd,
      conceptionDate,
      daysPregnant,
      weeksPregnant,
      daysRemaining,
      trimester,
      daysUntilDue,
      progressPercent,
      milestones,
      isCurrentlyPregnant
    };
  }, [eddInput]);

  // Tab 3 Calculations - from Ultrasound
  const ultrasoundResults = useMemo(() => {
    const usDate = new Date(ultrasoundDate);
    usDate.setHours(0, 0, 0, 0);
    
    const usWeeks = parseInt(ultrasoundWeeks) || 0;
    const usDays = parseInt(ultrasoundDays) || 0;
    const usTotalDays = usWeeks * 7 + usDays;
    
    // Calculate LMP from ultrasound date and gestational age
    const lmp = addDays(usDate, -usTotalDays);
    
    // Calculate EDD (280 days from LMP)
    const edd = addDays(lmp, 280);
    
    // Calculate conception date
    const conceptionDate = addDays(lmp, 14);
    
    // Calculate current gestational age
    const daysPregnant = daysBetween(lmp, today);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const daysRemaining = daysPregnant % 7;
    
    // Calculate trimester
    let trimester = 1;
    if (weeksPregnant >= 28) trimester = 3;
    else if (weeksPregnant >= 13) trimester = 2;
    
    // Days until due date
    const daysUntilDue = daysBetween(today, edd);
    
    // Progress percentage
    const progressPercent = Math.min(Math.max((daysPregnant / 280) * 100, 0), 100);
    
    // Get milestones
    const milestones = getMilestones(lmp, edd);
    
    const isCurrentlyPregnant = daysPregnant >= 0 && daysPregnant <= 294;

    return {
      lmp,
      edd,
      conceptionDate,
      daysPregnant,
      weeksPregnant,
      daysRemaining,
      trimester,
      daysUntilDue,
      progressPercent,
      milestones,
      isCurrentlyPregnant
    };
  }, [ultrasoundDate, ultrasoundWeeks, ultrasoundDays]);

  // Get current results based on active tab
  const currentResults = activeTab === 'lmp' ? lmpResults : activeTab === 'edd' ? eddResults : ultrasoundResults;

  // Trimester colors
  const trimesterColors = {
    1: { bg: "#FDF2F8", border: "#F9A8D4", text: "#BE185D", label: "1st Trimester" },
    2: { bg: "#EDE9FE", border: "#C4B5FD", text: "#7C3AED", label: "2nd Trimester" },
    3: { bg: "#DBEAFE", border: "#93C5FD", text: "#1D4ED8", label: "3rd Trimester" }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Gestation Calculator Wheel</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🤰</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Gestation Calculator Wheel
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free online pregnancy wheel calculator. Calculate your due date, gestational age, and 
            track important pregnancy milestones. Works like an OB wheel without the spinning!
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FDF2F8",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #F9A8D4"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#BE185D", margin: "0 0 4px 0" }}>
                Pregnancy is calculated as <strong>40 weeks (280 days)</strong> from your last menstrual period
              </p>
              <p style={{ color: "#DB2777", margin: 0, fontSize: "0.95rem" }}>
                This is gestational age – fetal age is about 2 weeks less since conception occurs around day 14
              </p>
            </div>
          </div>
        </div>

        {/* Features Badge */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#FDF2F8",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #F9A8D4"
          }}>
            <span>✓</span>
            <span style={{ color: "#BE185D", fontWeight: "600", fontSize: "0.85rem" }}>Due Date Calculator</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#EDE9FE",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #C4B5FD"
          }}>
            <span>✓</span>
            <span style={{ color: "#7C3AED", fontWeight: "600", fontSize: "0.85rem" }}>Gestational Age</span>
          </div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#DBEAFE",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "1px solid #93C5FD"
          }}>
            <span>✓</span>
            <span style={{ color: "#1D4ED8", fontWeight: "600", fontSize: "0.85rem" }}>Milestone Tracker</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("lmp")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "lmp" ? "#DB2777" : "#E5E7EB",
              color: activeTab === "lmp" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            📅 From Last Period
          </button>
          <button
            onClick={() => setActiveTab("edd")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "edd" ? "#DB2777" : "#E5E7EB",
              color: activeTab === "edd" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🎯 From Due Date
          </button>
          <button
            onClick={() => setActiveTab("ultrasound")}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeTab === "ultrasound" ? "#DB2777" : "#E5E7EB",
              color: activeTab === "ultrasound" ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "0.95rem"
            }}
          >
            🔬 From Ultrasound
          </button>
        </div>

        {/* Calculator Section */}
        <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
          {/* Input Panel */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            overflow: "hidden"
          }}>
            <div style={{ backgroundColor: "#DB2777", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === 'lmp' ? '📅 Last Menstrual Period' : 
                 activeTab === 'edd' ? '🎯 Known Due Date' : '🔬 Ultrasound Dating'}
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Tab 1: LMP Input */}
              {activeTab === 'lmp' && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      First Day of Last Menstrual Period (LMP)
                    </label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={(e) => setLmpDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #DB2777",
                        fontSize: "1rem",
                        backgroundColor: "#FDF2F8",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Average Cycle Length: {cycleLength} days
                    </label>
                    <input
                      type="range"
                      min="21"
                      max="35"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(e.target.value)}
                      style={{
                        width: "100%",
                        accentColor: "#DB2777"
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6B7280" }}>
                      <span>21 days</span>
                      <span>28 (average)</span>
                      <span>35 days</span>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #FCD34D"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> If you&apos;re unsure of your cycle length, use 28 days (the average). 
                      Your doctor may adjust the due date after your first ultrasound.
                    </p>
                  </div>
                </>
              )}

              {/* Tab 2: EDD Input */}
              {activeTab === 'edd' && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Expected Due Date (EDD)
                    </label>
                    <input
                      type="date"
                      value={eddInput}
                      onChange={(e) => setEddInput(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #DB2777",
                        fontSize: "1rem",
                        backgroundColor: "#FDF2F8",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{
                    backgroundColor: "#EDE9FE",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #C4B5FD"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#6D28D9" }}>
                      💡 <strong>Note:</strong> Enter the due date given by your doctor. 
                      This will calculate your LMP and current gestational age.
                    </p>
                  </div>
                </>
              )}

              {/* Tab 3: Ultrasound Input */}
              {activeTab === 'ultrasound' && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Ultrasound Date
                    </label>
                    <input
                      type="date"
                      value={ultrasoundDate}
                      onChange={(e) => setUltrasoundDate(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "2px solid #DB2777",
                        fontSize: "1rem",
                        backgroundColor: "#FDF2F8",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Gestational Age at Ultrasound
                    </label>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: "1", minWidth: "120px" }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Weeks</label>
                        <select
                          value={ultrasoundWeeks}
                          onChange={(e) => setUltrasoundWeeks(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        >
                          {Array.from({ length: 42 }, (_, i) => (
                            <option key={i} value={i}>{i} weeks</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ flex: "1", minWidth: "120px" }}>
                        <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>Days</label>
                        <select
                          value={ultrasoundDays}
                          onChange={(e) => setUltrasoundDays(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid #D1D5DB",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                          }}
                        >
                          {Array.from({ length: 7 }, (_, i) => (
                            <option key={i} value={i}>{i} days</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#DBEAFE",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    border: "1px solid #93C5FD"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#1D4ED8" }}>
                      💡 <strong>Example:</strong> If your ultrasound on Jan 15 showed &quot;8 weeks 3 days&quot;, 
                      enter that date and gestational age above.
                    </p>
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
                📊 Your Pregnancy Dates
              </h2>
            </div>

            <div style={{ padding: "24px" }}>
              {/* Current Gestational Age */}
              <div style={{
                backgroundColor: trimesterColors[currentResults.trimester as 1|2|3].bg,
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "20px",
                border: `2px solid ${trimesterColors[currentResults.trimester as 1|2|3].border}`
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: trimesterColors[currentResults.trimester as 1|2|3].text }}>
                  Current Gestational Age
                </p>
                <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: trimesterColors[currentResults.trimester as 1|2|3].text }}>
                  {currentResults.weeksPregnant}w {currentResults.daysRemaining}d
                </p>
                <p style={{ 
                  margin: "8px 0 0 0", 
                  fontSize: "0.9rem", 
                  color: trimesterColors[currentResults.trimester as 1|2|3].text,
                  fontWeight: "600"
                }}>
                  {trimesterColors[currentResults.trimester as 1|2|3].label}
                </p>
              </div>

              {/* Due Date */}
              <div style={{
                backgroundColor: "#ECFDF5",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                marginBottom: "20px",
                border: "1px solid #6EE7B7"
              }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                  🎯 Expected Due Date
                </p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold", color: "#059669" }}>
                  {formatDate(currentResults.edd)}
                </p>
                {currentResults.daysUntilDue > 0 && (
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                    {currentResults.daysUntilDue} days to go
                  </p>
                )}
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>Progress</span>
                  <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>{Math.round(currentResults.progressPercent)}%</span>
                </div>
                <div style={{ 
                  height: "12px", 
                  backgroundColor: "#E5E7EB", 
                  borderRadius: "6px",
                  overflow: "hidden",
                  position: "relative"
                }}>
                  {/* Trimester sections */}
                  <div style={{ 
                    position: "absolute",
                    left: "0",
                    width: "30%",
                    height: "100%",
                    backgroundColor: "#FDF2F8",
                    borderRight: "1px solid #F9A8D4"
                  }} />
                  <div style={{ 
                    position: "absolute",
                    left: "30%",
                    width: "40%",
                    height: "100%",
                    backgroundColor: "#EDE9FE",
                    borderRight: "1px solid #C4B5FD"
                  }} />
                  <div style={{ 
                    position: "absolute",
                    left: "70%",
                    width: "30%",
                    height: "100%",
                    backgroundColor: "#DBEAFE"
                  }} />
                  {/* Progress fill */}
                  <div style={{ 
                    position: "relative",
                    height: "100%",
                    width: `${currentResults.progressPercent}%`,
                    backgroundColor: "#DB2777",
                    borderRadius: "6px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.7rem", color: "#9CA3AF" }}>
                  <span>Week 0</span>
                  <span>Week 12</span>
                  <span>Week 28</span>
                  <span>Week 40</span>
                </div>
              </div>

              {/* Key Dates */}
              <div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem", color: "#374151", fontWeight: "600" }}>
                  📋 Key Dates
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Last Period (LMP)</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{formatDateShort(currentResults.lmp)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>Est. Conception</span>
                    <span style={{ fontWeight: "600", color: "#111827" }}>{formatDateShort(currentResults.conceptionDate)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>2nd Trimester Starts</span>
                    <span style={{ fontWeight: "600", color: "#7C3AED" }}>{formatDateShort(addDays(currentResults.lmp, 91))}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "6px" }}>
                    <span style={{ color: "#4B5563" }}>3rd Trimester Starts</span>
                    <span style={{ fontWeight: "600", color: "#1D4ED8" }}>{formatDateShort(addDays(currentResults.lmp, 196))}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          padding: "24px",
          marginBottom: "24px"
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>
            🗓️ Pregnancy Milestones
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Milestone</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Week</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #E5E7EB", fontWeight: "600" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {currentResults.milestones.map((milestone, index) => {
                  const isPast = milestone.date < today;
                  const isCurrent = daysBetween(milestone.date, today) >= -7 && daysBetween(milestone.date, today) <= 7;
                  
                  return (
                    <tr 
                      key={index} 
                      style={{ 
                        backgroundColor: isCurrent ? "#FDF2F8" : isPast ? "#F9FAFB" : "white",
                        opacity: isPast && !isCurrent ? 0.6 : 1
                      }}
                    >
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                        {isPast && !isCurrent ? "✅ " : isCurrent ? "👉 " : "⏳ "}
                        {milestone.name}
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                        {milestone.week}
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", fontWeight: "600" }}>
                        {formatDateShort(milestone.date)}
                      </td>
                      <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB", color: "#6B7280" }}>
                        {milestone.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🤰 Understanding Pregnancy Dating</h2>

              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  A <strong>gestation calculator wheel</strong> (also called a pregnancy wheel or OB wheel) is a tool 
                  healthcare providers have used for decades to estimate due dates and track pregnancy progress. Our 
                  digital version provides the same calculations without the need for a physical wheel.
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>How Due Dates Are Calculated</h3>
                <p>
                  The standard method calculates pregnancy as <strong>280 days (40 weeks)</strong> from the first day 
                  of your last menstrual period (LMP). This is called &quot;Naegele&apos;s Rule.&quot; Since most women don&apos;t know 
                  their exact conception date, using LMP provides a consistent starting point.
                </p>

                <div style={{
                  backgroundColor: "#FDF2F8",
                  padding: "20px",
                  borderRadius: "12px",
                  margin: "20px 0",
                  border: "1px solid #F9A8D4"
                }}>
                  <p style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#BE185D" }}>📊 The Three Trimesters</p>
                  <p style={{ margin: 0, color: "#DB2777", fontSize: "0.95rem" }}>
                    <strong>1st Trimester (Weeks 1-12):</strong> Embryo develops, organs form, highest risk of miscarriage<br />
                    <strong>2nd Trimester (Weeks 13-27):</strong> Baby grows rapidly, movement felt, anatomy scan done<br />
                    <strong>3rd Trimester (Weeks 28-40):</strong> Baby gains weight, prepares for birth, you may feel tired
                  </p>
                </div>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>When Is Ultrasound Dating Used?</h3>
                <p>
                  First-trimester ultrasound (between 8-12 weeks) is the most accurate method for dating pregnancy, 
                  typically within 3-5 days. Your healthcare provider may adjust your due date if the ultrasound 
                  differs significantly from your LMP-based calculation (usually by more than 5-7 days).
                </p>

                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Why Due Dates Are Estimates</h3>
                <p>
                  Only about 5% of babies are born on their exact due date. Most healthy babies arrive between 
                  <strong> 37-42 weeks</strong>. Your due date is best viewed as the middle of a window when baby 
                  might arrive, not a precise prediction.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Facts */}
            <div style={{ backgroundColor: "#FDF2F8", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #F9A8D4" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#BE185D", marginBottom: "16px" }}>📋 Quick Facts</h3>
              <div style={{ fontSize: "0.9rem", color: "#DB2777", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>• Full term: 40 weeks (280 days)</p>
                <p style={{ margin: 0 }}>• Conception: ~Day 14 of cycle</p>
                <p style={{ margin: 0 }}>• Viable: 24+ weeks</p>
                <p style={{ margin: 0 }}>• Early term: 37-38 weeks</p>
                <p style={{ margin: 0 }}>• Full term: 39-40 weeks</p>
                <p style={{ margin: 0 }}>• Late term: 41 weeks</p>
                <p style={{ margin: 0 }}>• Post term: 42+ weeks</p>
              </div>
            </div>

            {/* When to Call Doctor */}
            <div style={{ backgroundColor: "#FEF2F2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>🚨 When to Call Your Doctor</h3>
              <div style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Heavy bleeding or spotting</p>
                <p style={{ margin: "0 0 8px 0" }}>• Severe abdominal pain</p>
                <p style={{ margin: "0 0 8px 0" }}>• Fever over 100.4°F (38°C)</p>
                <p style={{ margin: "0 0 8px 0" }}>• Decreased fetal movement</p>
                <p style={{ margin: 0 }}>• Signs of labor before 37 weeks</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/gestation-calculator-wheel" currentCategory="Health" />
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
        <div style={{ padding: "16px", backgroundColor: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.75rem", color: "#991B1B", textAlign: "center", margin: 0 }}>
            ⚠️ <strong>Medical Disclaimer:</strong> This calculator provides estimates for informational purposes only 
            and is not a substitute for professional medical advice. Pregnancy dating can vary based on individual 
            circumstances. Always consult with your healthcare provider for accurate pregnancy dating and prenatal care. 
            If you have concerns about your pregnancy, contact your doctor or midwife immediately.
          </p>
        </div>
      </div>
    </div>
  );
}