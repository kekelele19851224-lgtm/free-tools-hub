"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Setting presets by workplace
const workplacePresets = [
  { id: "snf", name: "SNF (Skilled Nursing)", target: 85 },
  { id: "acute", name: "Acute Care / Hospital", target: 70 },
  { id: "outpatient", name: "Outpatient Clinic", target: 85 },
  { id: "home", name: "Home Health", target: 60 },
  { id: "school", name: "School-Based", target: 75 },
  { id: "custom", name: "Custom Target", target: 80 }
];

// 8-minute rule table
const eightMinuteRule = [
  { minStart: 8, minEnd: 22, units: 1 },
  { minStart: 23, minEnd: 37, units: 2 },
  { minStart: 38, minEnd: 52, units: 3 },
  { minStart: 53, minEnd: 67, units: 4 },
  { minStart: 68, minEnd: 82, units: 5 },
  { minStart: 83, minEnd: 97, units: 6 },
  { minStart: 98, minEnd: 112, units: 7 },
  { minStart: 113, minEnd: 127, units: 8 }
];

// FAQ data
const faqs = [
  {
    question: "How do you calculate therapy productivity?",
    answer: "Therapy productivity is calculated by dividing billable minutes by total available minutes, then multiplying by 100. The formula is: Productivity % = (Billable Minutes ÷ Available Minutes) × 100. Available minutes equals your total shift time minus any unpaid breaks like lunch. For example, if you work 480 minutes (8 hours) with a 30-minute lunch, your available time is 450 minutes. If you bill 360 minutes, your productivity is (360 ÷ 450) × 100 = 80%."
  },
  {
    question: "What is a good productivity percentage for therapists?",
    answer: "Good productivity varies by setting: SNF (Skilled Nursing Facility): 85-90% is typical. Acute Care/Hospital: 65-75% is common due to patient variability. Outpatient Clinic: 80-90% is expected. Home Health: 55-65% due to travel time. School-Based: 70-80%. Remember, 100% productivity is not realistic or sustainable—therapists need time for documentation, care coordination, and meetings."
  },
  {
    question: "How do you account for lunch breaks in productivity?",
    answer: "Unpaid lunch breaks should be subtracted from your total shift time before calculating productivity. For example, if you work 8:00 AM to 5:00 PM (9 hours = 540 minutes) with a 60-minute unpaid lunch, your available time is 480 minutes. Only use this adjusted time as your denominator. Paid breaks are typically included in available time, while unpaid breaks are excluded."
  },
  {
    question: "What is the 8-minute rule for CPT billing?",
    answer: "The 8-minute rule (CMS rule) determines how to bill timed CPT codes in 15-minute units. You need at least 8 minutes to bill 1 unit. The ranges are: 8-22 min = 1 unit, 23-37 min = 2 units, 38-52 min = 3 units, 53-67 min = 4 units, etc. Each additional unit requires at least 8 more minutes beyond the midpoint of the previous range. This rule applies to Medicare Part B and many other payers."
  },
  {
    question: "What's the difference between productivity and utilization?",
    answer: "Productivity measures output per input (e.g., billable minutes ÷ available time), while utilization measures time spent on billable activities versus scheduled time. They're related but not identical. A therapist could have high utilization (lots of scheduled patient time) but lower productivity if sessions run long. Most facilities use productivity % as their primary efficiency metric."
  },
  {
    question: "How can I improve my therapy productivity?",
    answer: "Key strategies include: 1) Batch documentation—complete notes in focused blocks rather than throughout the day. 2) Use EMR templates to speed up documentation. 3) Minimize gaps between patients through better scheduling. 4) Prepare materials and review charts before sessions. 5) Group similar treatments together. 6) Communicate with scheduling staff about realistic treatment times. Remember, sustainable productivity is more important than maximizing numbers."
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

// Helper function to convert time to minutes
function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Helper function to convert minutes to time string
function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// Helper function to format time for display
function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

// Calculate CPT units using 8-minute rule
function calculateCPTUnits(minutes: number): number {
  if (minutes < 8) return 0;
  for (const range of eightMinuteRule) {
    if (minutes >= range.minStart && minutes <= range.minEnd) {
      return range.units;
    }
  }
  // For minutes beyond the table, continue the pattern
  if (minutes > 127) {
    return Math.floor((minutes + 7) / 15);
  }
  return 0;
}

export default function TherapyProductivityCalculator() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"calculate" | "goal" | "units">("calculate");
  
  // Calculate Productivity state
  const [startTime, setStartTime] = useState<string>("08:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [breakMinutes, setBreakMinutes] = useState<string>("30");
  const [billableMinutes, setBillableMinutes] = useState<string>("360");
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>("outpatient");
  
  // Goal Planner state
  const [goalStartTime, setGoalStartTime] = useState<string>("08:00");
  const [goalBillableMinutes, setGoalBillableMinutes] = useState<string>("360");
  const [goalBreakMinutes, setGoalBreakMinutes] = useState<string>("30");
  const [goalTargetPercent, setGoalTargetPercent] = useState<string>("85");
  
  // CPT Units state
  const [treatmentMinutes, setTreatmentMinutes] = useState<string>("45");

  // Calculate Productivity calculations
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  const breakMins = parseFloat(breakMinutes) || 0;
  const billableMins = parseFloat(billableMinutes) || 0;
  
  const totalShiftMinutes = endMins - startMins;
  const availableMinutes = totalShiftMinutes - breakMins;
  const productivity = availableMinutes > 0 ? (billableMins / availableMinutes) * 100 : 0;
  const nonBillableMinutes = availableMinutes - billableMins;

  // Get workplace target
  const workplace = workplacePresets.find(w => w.id === selectedWorkplace);
  const targetProductivity = workplace?.target || 80;

  // Get productivity rating
  const getProductivityRating = (prod: number, target: number) => {
    if (prod >= target + 5) return { text: "Exceeding Target! 🌟", color: "#059669", bg: "#ECFDF5" };
    if (prod >= target - 5) return { text: "Meeting Target ✓", color: "#2563EB", bg: "#EFF6FF" };
    if (prod >= target - 15) return { text: "Below Target", color: "#D97706", bg: "#FEF3C7" };
    return { text: "Needs Improvement", color: "#DC2626", bg: "#FEE2E2" };
  };

  // Goal Planner calculations
  const goalStartMins = timeToMinutes(goalStartTime);
  const goalBillableMins = parseFloat(goalBillableMinutes) || 0;
  const goalBreakMins = parseFloat(goalBreakMinutes) || 0;
  const goalTarget = parseFloat(goalTargetPercent) || 85;
  
  const requiredAvailableMinutes = goalTarget > 0 ? (goalBillableMins / goalTarget) * 100 : 0;
  const requiredShiftMinutes = requiredAvailableMinutes + goalBreakMins;
  const goalEndMins = goalStartMins + requiredShiftMinutes;
  const goalEndTime = minutesToTime(Math.ceil(goalEndMins));
  const goalNonBillableMinutes = requiredAvailableMinutes - goalBillableMins;

  // CPT Units calculations
  const treatMins = parseFloat(treatmentMinutes) || 0;
  const cptUnits = calculateCPTUnits(treatMins);
  const minutesToNextUnit = cptUnits > 0 ? ((cptUnits) * 15 + 8) - treatMins : 8 - treatMins;

  const tabs = [
    { id: "calculate", label: "Calculate Productivity", icon: "📊" },
    { id: "goal", label: "Goal Planner", icon: "🎯" },
    { id: "units", label: "CPT Units (8-Min Rule)", icon: "⏱️" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Therapy Productivity Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🏥</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Therapy Productivity Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Free productivity calculator for PT, OT, and SLP therapists. Calculate your productivity percentage, 
            plan daily goals, and convert treatment minutes to CPT billing units using the 8-minute rule.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FEF3C7",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FCD34D"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#92400E", margin: "0 0 4px 0" }}>Productivity Formula</p>
              <p style={{ color: "#B45309", margin: 0, fontSize: "0.95rem" }}>
                <strong>Productivity %</strong> = (Billable Minutes ÷ Available Minutes) × 100<br />
                <strong>Available Minutes</strong> = Total Shift - Lunch/Break
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
                backgroundColor: activeTab === tab.id ? "#0891B2" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "calculate" && "📊 Shift Details"}
                {activeTab === "goal" && "🎯 Goal Inputs"}
                {activeTab === "units" && "⏱️ Treatment Time"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "calculate" && (
                <>
                  {/* Workplace Preset */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Workplace Setting
                    </label>
                    <select
                      value={selectedWorkplace}
                      onChange={(e) => setSelectedWorkplace(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {workplacePresets.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.target}% target)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Inputs */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Break/Lunch (minutes)
                      </label>
                      <input
                        type="number"
                        value={breakMinutes}
                        onChange={(e) => setBreakMinutes(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Billable Minutes
                      </label>
                      <input
                        type="number"
                        value={billableMinutes}
                        onChange={(e) => setBillableMinutes(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Shift:</strong> {formatTimeDisplay(startTime)} - {formatTimeDisplay(endTime)} ({totalShiftMinutes} min)<br />
                      <strong>Available:</strong> {totalShiftMinutes} - {breakMins} = {availableMinutes} min
                    </p>
                  </div>
                </>
              )}

              {activeTab === "goal" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={goalStartTime}
                      onChange={(e) => setGoalStartTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Billable Minutes Required
                    </label>
                    <input
                      type="number"
                      value={goalBillableMinutes}
                      onChange={(e) => setGoalBillableMinutes(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Target Productivity %
                      </label>
                      <input
                        type="number"
                        value={goalTargetPercent}
                        onChange={(e) => setGoalTargetPercent(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Break/Lunch (min)
                      </label>
                      <input
                        type="number"
                        value={goalBreakMinutes}
                        onChange={(e) => setGoalBreakMinutes(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "6px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "16px", backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "12px" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      <strong>Goal:</strong> Complete {goalBillableMins} billable minutes at {goalTarget}% productivity
                    </p>
                  </div>
                </>
              )}

              {activeTab === "units" && (
                <>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Treatment Minutes
                    </label>
                    <input
                      type="number"
                      value={treatmentMinutes}
                      onChange={(e) => setTreatmentMinutes(e.target.value)}
                      placeholder="Enter minutes"
                      style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>

                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "8px", padding: "16px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>
                      8-Minute Rule (CMS)
                    </p>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}>
                      Each unit = 15 minutes. Minimum 8 minutes required for 1 unit. 
                      Used for Medicare Part B and most insurance billing.
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
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Results</h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "calculate" && (
                <>
                  {/* Productivity Result */}
                  <div style={{
                    backgroundColor: getProductivityRating(productivity, targetProductivity).bg,
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: `2px solid ${getProductivityRating(productivity, targetProductivity).color}`,
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: getProductivityRating(productivity, targetProductivity).color }}>
                      Your Productivity
                    </p>
                    <p style={{ margin: 0, fontSize: "3rem", fontWeight: "bold", color: getProductivityRating(productivity, targetProductivity).color }}>
                      {productivity.toFixed(1)}%
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", fontWeight: "500", color: getProductivityRating(productivity, targetProductivity).color }}>
                      {getProductivityRating(productivity, targetProductivity).text}
                    </p>
                  </div>

                  {/* Target Comparison */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#6B7280" }}>Target: {targetProductivity}%</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: productivity >= targetProductivity ? "#059669" : "#DC2626" }}>
                        {productivity >= targetProductivity ? `+${(productivity - targetProductivity).toFixed(1)}%` : `${(productivity - targetProductivity).toFixed(1)}%`}
                      </span>
                    </div>
                    <div style={{ width: "100%", height: "8px", backgroundColor: "#E5E7EB", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(productivity, 100)}%`,
                        height: "100%",
                        backgroundColor: productivity >= targetProductivity ? "#059669" : "#D97706",
                        borderRadius: "4px"
                      }} />
                    </div>
                  </div>

                  {/* Time Breakdown */}
                  <div style={{
                    backgroundColor: "#EFF6FF",
                    borderRadius: "10px",
                    padding: "16px",
                    border: "1px solid #BFDBFE"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#1D4ED8", fontSize: "0.9rem" }}>Time Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Total Shift:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{totalShiftMinutes} min</div>
                      <div style={{ color: "#6B7280" }}>Break/Lunch:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>-{breakMins} min</div>
                      <div style={{ color: "#6B7280" }}>Available Time:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{availableMinutes} min</div>
                      <div style={{ color: "#6B7280" }}>Billable Time:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{billableMins} min</div>
                      <div style={{ color: "#6B7280" }}>Non-Billable:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#D97706" }}>{nonBillableMinutes} min</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "goal" && (
                <>
                  {/* End Time Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Target End Time</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {formatTimeDisplay(goalEndTime)}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "#047857" }}>
                      To achieve {goalTarget}% productivity
                    </p>
                  </div>

                  {/* Shift Summary */}
                  <div style={{
                    backgroundColor: "#F5F3FF",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px",
                    border: "1px solid #DDD6FE"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#5B21B6", fontSize: "0.9rem" }}>📋 Shift Plan</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Start:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{formatTimeDisplay(goalStartTime)}</div>
                      <div style={{ color: "#6B7280" }}>End:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{formatTimeDisplay(goalEndTime)}</div>
                      <div style={{ color: "#6B7280" }}>Total Shift:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{Math.ceil(requiredShiftMinutes)} min</div>
                    </div>
                  </div>

                  {/* Time Allocation */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>⏰ Time Allocation</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Billable Time:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#059669" }}>{goalBillableMins} min</div>
                      <div style={{ color: "#6B7280" }}>Non-Billable:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#D97706" }}>{Math.ceil(goalNonBillableMinutes)} min</div>
                      <div style={{ color: "#6B7280" }}>Break/Lunch:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{goalBreakMins} min</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "units" && (
                <>
                  {/* CPT Units Result */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "20px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#065F46" }}>Billable CPT Units</p>
                    <p style={{ margin: 0, fontSize: "3.5rem", fontWeight: "bold", color: "#059669" }}>
                      {cptUnits}
                    </p>
                    <p style={{ margin: "8px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {treatMins} minutes = {cptUnits} unit{cptUnits !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Next Unit Info */}
                  {treatMins > 0 && treatMins < 127 && (
                    <div style={{
                      backgroundColor: minutesToNextUnit > 0 ? "#FEF3C7" : "#ECFDF5",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: minutesToNextUnit > 0 ? "1px solid #FCD34D" : "1px solid #6EE7B7"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: minutesToNextUnit > 0 ? "#92400E" : "#065F46" }}>
                        {minutesToNextUnit > 0 
                          ? `💡 Add ${minutesToNextUnit} more minute${minutesToNextUnit !== 1 ? "s" : ""} to bill ${cptUnits + 1} unit${cptUnits + 1 !== 1 ? "s" : ""}`
                          : `✓ You're at the threshold for ${cptUnits} units`
                        }
                      </p>
                    </div>
                  )}

                  {treatMins < 8 && treatMins > 0 && (
                    <div style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #FECACA"
                    }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#991B1B" }}>
                        ⚠️ Minimum 8 minutes required to bill 1 unit. Need {8 - treatMins} more minutes.
                      </p>
                    </div>
                  )}

                  {/* 8-Minute Rule Table */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>8-Minute Rule Reference</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", fontSize: "0.8rem" }}>
                      {eightMinuteRule.map((row) => (
                        <div 
                          key={row.units}
                          style={{ 
                            display: "flex", 
                            justifyContent: "space-between",
                            padding: "6px 8px",
                            backgroundColor: treatMins >= row.minStart && treatMins <= row.minEnd ? "#ECFDF5" : "transparent",
                            borderRadius: "4px",
                            border: treatMins >= row.minStart && treatMins <= row.minEnd ? "1px solid #6EE7B7" : "1px solid transparent"
                          }}
                        >
                          <span style={{ color: "#6B7280" }}>{row.minStart}-{row.minEnd} min</span>
                          <span style={{ fontWeight: "600" }}>{row.units} unit{row.units !== 1 ? "s" : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Workplace Benchmarks Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#0891B2", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Productivity Benchmarks by Setting</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#E0F2FE" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Setting</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Typical Target</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Range</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>SNF (Skilled Nursing)</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>85%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>80-92%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>High patient volume, structured schedules</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Acute Care / Hospital</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>70%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>60-75%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>Variable patient availability, emergencies</td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Outpatient Clinic</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>85%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>75-90%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>Scheduled appointments, predictable flow</td>
                </tr>
                <tr style={{ backgroundColor: "#F9FAFB" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>Home Health</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>60%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>50-65%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>Travel time not billable, driving between patients</td>
                </tr>
                <tr style={{ backgroundColor: "white" }}>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>School-Based</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>75%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>65-80%</td>
                  <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontSize: "0.8rem", color: "#6B7280" }}>IEP meetings, travel between schools</td>
                </tr>
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Benchmarks are typical industry standards. Your facility may have different expectations based on staffing, patient population, and documentation requirements.
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🏥 Understanding Therapy Productivity</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <p>
                  <strong>Therapy productivity</strong> measures the percentage of your work time spent on direct, billable patient care. 
                  It&apos;s a key metric for PT (Physical Therapy), OT (Occupational Therapy), and SLP (Speech-Language Pathology) 
                  professionals across all healthcare settings.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>What Counts as Billable Time?</h3>
                
                <p><strong>Billable activities include:</strong> Direct patient treatment, evaluations, re-evaluations, and group therapy sessions (with appropriate modifiers).</p>
                
                <p><strong>Non-billable activities include:</strong> Documentation, care coordination, team meetings, training, travel time, and administrative tasks.</p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>The 8-Minute Rule</h3>
                <p>
                  CMS (Centers for Medicare & Medicaid Services) uses the 8-minute rule for billing timed CPT codes. 
                  Each unit equals 15 minutes, but you need at least 8 minutes of treatment to bill 1 unit. 
                  This rule applies to Medicare Part B and is adopted by many other payers.
                </p>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>Balancing Productivity & Quality</h3>
                <p>
                  While meeting productivity targets is important for facility sustainability, remember that 
                  <strong> your productivity does not equal your worth</strong>. Sustainable productivity with quality 
                  patient care is always more important than maximizing numbers.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Tips */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>💡 Productivity Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>✓ Batch documentation</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Use EMR templates</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Prep charts before sessions</p>
                <p style={{ margin: "0 0 8px 0" }}>✓ Minimize gaps in schedule</p>
                <p style={{ margin: 0 }}>✓ Group similar treatments</p>
              </div>
            </div>

            {/* Therapist Types */}
            <div style={{ backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #DDD6FE" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "16px" }}>👩‍⚕️ Works For</h3>
              <div style={{ fontSize: "0.85rem", color: "#6D28D9", lineHeight: "2" }}>
                <p style={{ margin: 0 }}>🦵 PT - Physical Therapy</p>
                <p style={{ margin: 0 }}>🖐️ OT - Occupational Therapy</p>
                <p style={{ margin: 0 }}>🗣️ SLP - Speech-Language</p>
                <p style={{ margin: 0 }}>👨‍⚕️ PTA / COTA / SLPA</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/therapy-productivity-calculator" currentCategory="Healthcare" />
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
            🏥 <strong>Disclaimer:</strong> This calculator is for informational and planning purposes only. 
            Productivity targets and billing rules vary by facility, payer, and state regulations. 
            Always verify billing practices with your facility and comply with CMS guidelines for Medicare patients.
          </p>
        </div>
      </div>
    </div>
  );
}