"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Activity levels
const activityLevels = [
  { id: "low", name: "Low", description: "Senior, couch potato", multiplier: 0.02 },
  { id: "moderate", name: "Moderate", description: "Average daily walks", multiplier: 0.025 },
  { id: "high", name: "High", description: "Active, working dog", multiplier: 0.03 },
  { id: "veryHigh", name: "Very High", description: "Athletic, sport dog", multiplier: 0.035 }
];

// Weight goals
const weightGoals = [
  { id: "lose", name: "Lose Weight", adjustment: -0.005 },
  { id: "maintain", name: "Maintain Weight", adjustment: 0 },
  { id: "gain", name: "Gain Weight", adjustment: 0.005 }
];

// Puppy percentages by age
const puppyPercentages = [
  { label: "8-10 weeks", minWeeks: 8, maxWeeks: 10, percent: 0.10 },
  { label: "10-16 weeks", minWeeks: 10, maxWeeks: 16, percent: 0.08 },
  { label: "16-20 weeks", minWeeks: 16, maxWeeks: 20, percent: 0.07 },
  { label: "20-26 weeks", minWeeks: 20, maxWeeks: 26, percent: 0.06 },
  { label: "26-36 weeks", minWeeks: 26, maxWeeks: 36, percent: 0.05 },
  { label: "36-52 weeks", minWeeks: 36, maxWeeks: 52, percent: 0.04 }
];

// Diet types
const dietTypes = [
  { 
    id: "pmr", 
    name: "PMR (80/10/10)", 
    description: "Prey Model Raw",
    ratios: [
      { name: "Muscle Meat", percent: 0.80, color: "#EF4444", emoji: "🥩" },
      { name: "Raw Bone", percent: 0.10, color: "#F5F5DC", emoji: "🦴" },
      { name: "Liver", percent: 0.05, color: "#8B4513", emoji: "🫀" },
      { name: "Other Organs", percent: 0.05, color: "#A0522D", emoji: "🫁" }
    ]
  },
  { 
    id: "barf", 
    name: "BARF Diet", 
    description: "Biologically Appropriate Raw Food",
    ratios: [
      { name: "Muscle Meat", percent: 0.70, color: "#EF4444", emoji: "🥩" },
      { name: "Raw Bone", percent: 0.10, color: "#F5F5DC", emoji: "🦴" },
      { name: "Vegetables", percent: 0.07, color: "#22C55E", emoji: "🥦" },
      { name: "Liver", percent: 0.05, color: "#8B4513", emoji: "🫀" },
      { name: "Other Organs", percent: 0.05, color: "#A0522D", emoji: "🫁" },
      { name: "Seeds/Nuts", percent: 0.02, color: "#D2691E", emoji: "🌰" },
      { name: "Fruits", percent: 0.01, color: "#FF6347", emoji: "🍎" }
    ]
  }
];

// Default meat prices (per lb)
const defaultPrices = {
  muscleMeat: 3.50,
  bone: 1.50,
  liver: 2.00,
  organs: 2.00,
  vegetables: 2.00,
  other: 3.00
};

// Reference table data
const feedingReference = [
  { weight: 10, low: 3.2, moderate: 4.0, high: 4.8 },
  { weight: 20, low: 6.4, moderate: 8.0, high: 9.6 },
  { weight: 30, low: 9.6, moderate: 12.0, high: 14.4 },
  { weight: 40, low: 12.8, moderate: 16.0, high: 19.2 },
  { weight: 50, low: 16.0, moderate: 20.0, high: 24.0 },
  { weight: 60, low: 19.2, moderate: 24.0, high: 28.8 },
  { weight: 75, low: 24.0, moderate: 30.0, high: 36.0 },
  { weight: 100, low: 32.0, moderate: 40.0, high: 48.0 }
];

// FAQ data
const faqs = [
  {
    question: "How do I calculate how much raw food I need for my dog?",
    answer: "For adult dogs, feed 2-3% of their ideal body weight daily. Low activity dogs need about 2%, moderate activity 2.5%, and high activity 3% or more. For example, a 50 lb moderately active dog needs about 20 oz (1.25 lbs) of raw food per day. Puppies need more—anywhere from 4-10% depending on age."
  },
  {
    question: "What is the 80-10-10 rule for raw dog food?",
    answer: "The 80-10-10 rule (also called PMR - Prey Model Raw) means: 80% muscle meat (including heart), 10% raw edible bone, 5% liver, and 5% other secreting organs (kidney, spleen, pancreas, brain). This ratio mimics the nutritional profile of whole prey animals that dogs would eat in the wild."
  },
  {
    question: "What is the difference between PMR and BARF diet?",
    answer: "PMR (Prey Model Raw) follows the 80/10/10 ratio with meat, bone, and organs only—no plant matter. BARF (Biologically Appropriate Raw Food) includes 70% meat, 10% bone, 10% organs, plus 7% vegetables, 2% seeds, and 1% fruit. BARF adds plant-based nutrients while PMR is strictly animal-based."
  },
  {
    question: "How much raw food should I feed my puppy?",
    answer: "Puppies need more food relative to their body weight: 8-10 weeks: 10% of body weight. 10-16 weeks: 8%. 16-20 weeks: 7%. 20-26 weeks: 6%. 26-36 weeks: 5%. 36-52 weeks: 4%. Split into 3-4 meals daily for young puppies, reducing to 2 meals as they mature."
  },
  {
    question: "How much does raw feeding cost per month?",
    answer: "Raw feeding typically costs $2-5 per pound depending on meat quality and sourcing. A 50 lb dog eating 1.25 lbs/day would need about 37.5 lbs/month, costing roughly $75-185/month. Buying in bulk, using less expensive proteins (chicken, turkey), and sourcing from local farms can significantly reduce costs."
  },
  {
    question: "How many meals per day should I feed my dog raw food?",
    answer: "Adult dogs: 1-2 meals per day. Most owners prefer twice daily. Puppies 8-16 weeks: 4 meals/day. Puppies 16-26 weeks: 3 meals/day. Puppies 26+ weeks: 2 meals/day. Some owners fast their adult dogs one day per week to mimic natural eating patterns, though this is optional."
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

export default function RawFoodCalculatorDog() {
  // Tab state
  const [activeTab, setActiveTab] = useState<"daily" | "recipe" | "cost">("daily");
  
  // Daily Amount state
  const [weight, setWeight] = useState<string>("50");
  const [weightUnit, setWeightUnit] = useState<"lbs" | "kg">("lbs");
  const [lifeStage, setLifeStage] = useState<"adult" | "puppy">("adult");
  const [puppyAge, setPuppyAge] = useState<string>("10-16 weeks");
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [weightGoal, setWeightGoal] = useState<string>("maintain");
  
  // Multi-dog state
  const [numberOfDogs, setNumberOfDogs] = useState<number>(1);
  
  // Recipe state
  const [dietType, setDietType] = useState<string>("pmr");
  const [manualAmount, setManualAmount] = useState<string>("");
  
  // Cost state
  const [meatPrice, setMeatPrice] = useState<string>("3.50");
  const [bonePrice, setBonePrice] = useState<string>("1.50");
  const [organPrice, setOrganPrice] = useState<string>("2.00");

  // Calculations
  const weightNum = parseFloat(weight) || 0;
  const weightInLbs = weightUnit === "kg" ? weightNum * 2.205 : weightNum;
  const weightInOz = weightInLbs * 16;
  
  // Get feeding percentage
  let feedingPercent = 0.025; // default moderate adult
  
  if (lifeStage === "puppy") {
    const puppyData = puppyPercentages.find(p => p.label === puppyAge);
    feedingPercent = puppyData ? puppyData.percent : 0.08;
  } else {
    const activity = activityLevels.find(a => a.id === activityLevel);
    const goal = weightGoals.find(g => g.id === weightGoal);
    feedingPercent = (activity?.multiplier || 0.025) + (goal?.adjustment || 0);
  }
  
  // Daily amount in oz (per dog)
  const dailyAmountOz = weightInOz * feedingPercent;
  const dailyAmountLbs = dailyAmountOz / 16;
  const dailyAmountGrams = dailyAmountLbs * 453.592;
  
  // Total for all dogs
  const totalDailyOz = dailyAmountOz * numberOfDogs;
  const totalWeeklyLbs = (totalDailyOz / 16) * 7;
  const totalMonthlyLbs = (totalDailyOz / 16) * 30;
  
  // Meals per day
  const mealsPerDay = lifeStage === "puppy" 
    ? (puppyAge === "8-10 weeks" || puppyAge === "10-16 weeks" ? 4 : puppyAge === "16-20 weeks" || puppyAge === "20-26 weeks" ? 3 : 2)
    : 2;

  // Recipe calculations
  const selectedDiet = dietTypes.find(d => d.id === dietType) || dietTypes[0];
  const recipeBaseOz = manualAmount ? parseFloat(manualAmount) : dailyAmountOz;
  
  // Cost calculations
  const meatPriceNum = parseFloat(meatPrice) || 3.50;
  const bonePriceNum = parseFloat(bonePrice) || 1.50;
  const organPriceNum = parseFloat(organPrice) || 2.00;
  
  // Average cost per lb (weighted by PMR ratios)
  const avgCostPerLb = (meatPriceNum * 0.80) + (bonePriceNum * 0.10) + (organPriceNum * 0.10);
  const dailyCost = (totalDailyOz / 16) * avgCostPerLb;
  const weeklyCost = dailyCost * 7;
  const monthlyCost = dailyCost * 30;

  const tabs = [
    { id: "daily", label: "Daily Amount", icon: "🥩" },
    { id: "recipe", label: "Recipe (80/10/10)", icon: "📊" },
    { id: "cost", label: "Cost Estimator", icon: "💰" }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Raw Food Calculator for Dogs</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🐕</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Raw Food Calculator for Dogs
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Calculate daily raw food amounts, get 80/10/10 recipe breakdowns, and estimate monthly costs. 
            Supports PMR and BARF diets for adult dogs and puppies.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #6EE7B7"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <div>
              <p style={{ fontWeight: "600", color: "#065F46", margin: "0 0 4px 0" }}>Quick Answer: 80/10/10 Rule</p>
              <p style={{ color: "#047857", margin: 0, fontSize: "0.95rem" }}>
                Feed adult dogs <strong>2-3% of body weight daily</strong>. Use <strong>80% muscle meat, 10% bone, 10% organs</strong> (5% liver + 5% other). A 50 lb dog needs about <strong>1-1.5 lbs/day</strong>.
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
                backgroundColor: activeTab === tab.id ? "#059669" : "#E5E7EB",
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
            <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "daily" && "🐕 Dog Information"}
                {activeTab === "recipe" && "📊 Recipe Settings"}
                {activeTab === "cost" && "💰 Price Settings"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "daily" && (
                <>
                  {/* Weight */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Dog&apos;s Weight
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="50"
                        style={{
                          flex: 1,
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem"
                        }}
                      />
                      <select
                        value={weightUnit}
                        onChange={(e) => setWeightUnit(e.target.value as "lbs" | "kg")}
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        <option value="lbs">lbs</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>

                  {/* Life Stage */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Life Stage
                    </label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["adult", "puppy"].map((stage) => (
                        <button
                          key={stage}
                          onClick={() => setLifeStage(stage as "adult" | "puppy")}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "8px",
                            border: lifeStage === stage ? "2px solid #059669" : "1px solid #E5E7EB",
                            backgroundColor: lifeStage === stage ? "#ECFDF5" : "white",
                            color: lifeStage === stage ? "#059669" : "#374151",
                            fontWeight: "500",
                            cursor: "pointer"
                          }}
                        >
                          {stage === "adult" ? "🐕 Adult" : "🐶 Puppy"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Puppy Age (conditional) */}
                  {lifeStage === "puppy" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Puppy Age
                      </label>
                      <select
                        value={puppyAge}
                        onChange={(e) => setPuppyAge(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        {puppyPercentages.map(p => (
                          <option key={p.label} value={p.label}>{p.label} ({(p.percent * 100).toFixed(0)}% body weight)</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Activity Level (adult only) */}
                  {lifeStage === "adult" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Activity Level
                      </label>
                      <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        {activityLevels.map(a => (
                          <option key={a.id} value={a.id}>{a.name} - {a.description}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Weight Goal (adult only) */}
                  {lifeStage === "adult" && (
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                        Weight Goal
                      </label>
                      <select
                        value={weightGoal}
                        onChange={(e) => setWeightGoal(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          backgroundColor: "white"
                        }}
                      >
                        {weightGoals.map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Number of Dogs */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Number of Dogs (same size)
                    </label>
                    <select
                      value={numberOfDogs}
                      onChange={(e) => setNumberOfDogs(parseInt(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        backgroundColor: "white"
                      }}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} dog{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Feeding %:</strong> {(feedingPercent * 100).toFixed(1)}% of body weight per day
                    </p>
                  </div>
                </>
              )}

              {activeTab === "recipe" && (
                <>
                  {/* Diet Type */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Diet Type
                    </label>
                    {dietTypes.map(diet => (
                      <button
                        key={diet.id}
                        onClick={() => setDietType(diet.id)}
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginBottom: "8px",
                          borderRadius: "8px",
                          border: dietType === diet.id ? "2px solid #059669" : "1px solid #E5E7EB",
                          backgroundColor: dietType === diet.id ? "#ECFDF5" : "white",
                          textAlign: "left",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ fontWeight: "600", color: dietType === diet.id ? "#059669" : "#111827" }}>
                          {diet.name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>{diet.description}</div>
                      </button>
                    ))}
                  </div>

                  {/* Manual Amount Override */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.85rem", color: "#374151", marginBottom: "6px", fontWeight: "500" }}>
                      Daily Amount (oz) - Optional Override
                    </label>
                    <input
                      type="number"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      placeholder={`Auto: ${dailyAmountOz.toFixed(1)} oz`}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.75rem", color: "#6B7280" }}>
                      Leave blank to use calculated amount from Tab 1
                    </p>
                  </div>

                  <div style={{ backgroundColor: "#EEF2FF", borderRadius: "8px", padding: "12px", border: "1px solid #C7D2FE" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3730A3" }}>
                      📊 <strong>PMR:</strong> Meat-only. <strong>BARF:</strong> Includes veggies & fruits.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "cost" && (
                <>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "0.9rem", color: "#374151", marginBottom: "8px", fontWeight: "600" }}>
                      Enter Your Local Prices (per lb)
                    </label>
                    
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>
                        🥩 Muscle Meat ($/lb)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={meatPrice}
                        onChange={(e) => setMeatPrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>
                        🦴 Raw Meaty Bones ($/lb)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={bonePrice}
                        onChange={(e) => setBonePrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ display: "block", fontSize: "0.8rem", color: "#6B7280", marginBottom: "4px" }}>
                        🫀 Organs (liver, kidney, etc.) ($/lb)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        value={organPrice}
                        onChange={(e) => setOrganPrice(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                          fontSize: "1rem",
                          boxSizing: "border-box"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#FEF3C7", borderRadius: "8px", padding: "12px", border: "1px solid #FCD34D" }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#92400E" }}>
                      💡 <strong>Tip:</strong> Buy in bulk from local farms, butchers, or ethnic grocery stores for best prices!
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
            <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
              <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {activeTab === "daily" && "📋 Daily Feeding Amount"}
                {activeTab === "recipe" && "🥩 Recipe Breakdown"}
                {activeTab === "cost" && "💵 Cost Estimate"}
              </h2>
            </div>
            
            <div style={{ padding: "24px" }}>
              {activeTab === "daily" && (
                <>
                  {/* Per Dog */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #059669",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#065F46" }}>
                      Daily Amount {numberOfDogs > 1 ? "(per dog)" : ""}
                    </p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#059669" }}>
                      {dailyAmountOz.toFixed(1)} oz
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#047857" }}>
                      {dailyAmountLbs.toFixed(2)} lbs / {dailyAmountGrams.toFixed(0)} grams
                    </p>
                  </div>

                  {/* Multi-dog totals */}
                  {numberOfDogs > 1 && (
                    <div style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: "10px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #FCD34D"
                    }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#92400E", fontSize: "0.9rem" }}>
                        🐕🐕 Total for {numberOfDogs} Dogs
                      </h4>
                      <div style={{ fontSize: "0.9rem", color: "#B45309" }}>
                        <p style={{ margin: "0 0 4px 0" }}>Daily: <strong>{(totalDailyOz).toFixed(1)} oz</strong> ({(totalDailyOz / 16).toFixed(2)} lbs)</p>
                        <p style={{ margin: 0 }}>Weekly: <strong>{totalWeeklyLbs.toFixed(1)} lbs</strong></p>
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>📋 Summary</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Weekly Need:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{totalWeeklyLbs.toFixed(1)} lbs</div>
                      <div style={{ color: "#6B7280" }}>Monthly Need:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{totalMonthlyLbs.toFixed(1)} lbs</div>
                      <div style={{ color: "#6B7280" }}>Meals/Day:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{mealsPerDay} meals</div>
                      <div style={{ color: "#6B7280" }}>Per Meal:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>{(dailyAmountOz / mealsPerDay).toFixed(1)} oz</div>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#3730A3" }}>
                      🔄 <strong>Adjust as needed!</strong> Monitor your dog&apos;s weight and energy. Increase if losing weight, decrease if gaining.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "recipe" && (
                <>
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "16px",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#374151" }}>
                      Based on <strong>{recipeBaseOz.toFixed(1)} oz</strong> daily
                    </p>
                  </div>

                  {/* Recipe Breakdown */}
                  <div style={{ marginBottom: "16px" }}>
                    {selectedDiet.ratios.map((item, idx) => (
                      <div key={item.name} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: idx % 2 === 0 ? "#F9FAFB" : "white",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        border: "1px solid #E5E7EB"
                      }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: item.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.25rem",
                          marginRight: "12px",
                          flexShrink: 0,
                          border: "2px solid #E5E7EB"
                        }}>
                          {item.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: "600", color: "#111827", fontSize: "0.9rem" }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                            {(item.percent * 100).toFixed(0)}%
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: "bold", color: "#059669", fontSize: "1.1rem" }}>
                            {(recipeBaseOz * item.percent).toFixed(1)} oz
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            {((recipeBaseOz * item.percent) / 16).toFixed(2)} lbs
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "0.85rem", fontWeight: "500", color: "#374151" }}>Visual Ratio:</p>
                    <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", height: "24px" }}>
                      {selectedDiet.ratios.map(item => (
                        <div 
                          key={item.name}
                          style={{ 
                            width: `${item.percent * 100}%`, 
                            backgroundColor: item.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: item.color === "#F5F5DC" ? "#333" : "white",
                            fontWeight: "500",
                            borderRight: "1px solid white"
                          }}
                          title={`${item.name}: ${(item.percent * 100).toFixed(0)}%`}
                        >
                          {item.percent >= 0.05 && `${(item.percent * 100).toFixed(0)}%`}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      ✅ <strong>Balance over time:</strong> You don&apos;t need exact ratios every meal. Aim for balance over a week or two.
                    </p>
                  </div>
                </>
              )}

              {activeTab === "cost" && (
                <>
                  {/* Monthly Cost */}
                  <div style={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "16px",
                    border: "2px solid #F59E0B",
                    textAlign: "center"
                  }}>
                    <p style={{ margin: "0 0 4px 0", fontSize: "0.85rem", color: "#92400E" }}>Estimated Monthly Cost</p>
                    <p style={{ margin: 0, fontSize: "2.5rem", fontWeight: "bold", color: "#B45309" }}>
                      ${monthlyCost.toFixed(0)}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#D97706" }}>
                      for {numberOfDogs} dog{numberOfDogs > 1 ? "s" : ""} • {totalMonthlyLbs.toFixed(1)} lbs/month
                    </p>
                  </div>

                  {/* Cost Breakdown */}
                  <div style={{
                    backgroundColor: "#F3F4F6",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "16px"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#374151", fontSize: "0.9rem" }}>💵 Cost Breakdown</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem" }}>
                      <div style={{ color: "#6B7280" }}>Daily Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${dailyCost.toFixed(2)}</div>
                      <div style={{ color: "#6B7280" }}>Weekly Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${weeklyCost.toFixed(2)}</div>
                      <div style={{ color: "#6B7280" }}>Monthly Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "500", color: "#B45309" }}>${monthlyCost.toFixed(2)}</div>
                      <div style={{ color: "#6B7280" }}>Yearly Cost:</div>
                      <div style={{ textAlign: "right", fontWeight: "500" }}>${(monthlyCost * 12).toFixed(0)}</div>
                    </div>
                  </div>

                  {/* Average price */}
                  <div style={{
                    backgroundColor: "#EEF2FF",
                    borderRadius: "10px",
                    padding: "12px",
                    marginBottom: "16px",
                    border: "1px solid #C7D2FE"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#3730A3" }}>
                      📊 <strong>Avg Cost/lb:</strong> ${avgCostPerLb.toFixed(2)} (weighted by 80/10/10 ratio)
                    </p>
                  </div>

                  {/* Tips */}
                  <div style={{
                    backgroundColor: "#ECFDF5",
                    borderRadius: "10px",
                    padding: "12px",
                    border: "1px solid #6EE7B7"
                  }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#065F46" }}>
                      💰 <strong>Save money:</strong> Buy whole chickens, turkey necks, and organs from local butchers or ethnic markets. Co-op buying with other raw feeders!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reference Tables */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "24px"
        }}>
          <div style={{ backgroundColor: "#059669", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>📊 Quick Reference: Adult Dog Daily Feeding (oz)</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#ECFDF5" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Dog Weight</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Low Activity (2%)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Moderate (2.5%)</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>High Activity (3%)</th>
                </tr>
              </thead>
              <tbody>
                {feedingReference.map((row, idx) => (
                  <tr key={row.weight} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.weight} lbs</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.low} oz</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#059669", fontWeight: "600" }}>{row.moderate} oz</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.high} oz</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Puppy Reference Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #E5E7EB",
          overflow: "hidden",
          marginBottom: "40px"
        }}>
          <div style={{ backgroundColor: "#F59E0B", padding: "16px 24px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🐶 Puppy Feeding Percentages by Age</h2>
          </div>
          <div style={{ padding: "24px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ backgroundColor: "#FEF3C7" }}>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "left" }}>Puppy Age</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>% Body Weight</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Meals/Day</th>
                  <th style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>Example (10 lb puppy)</th>
                </tr>
              </thead>
              <tbody>
                {puppyPercentages.map((row, idx) => (
                  <tr key={row.label} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.label}</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center", color: "#B45309", fontWeight: "600" }}>{(row.percent * 100).toFixed(0)}%</td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {row.minWeeks < 16 ? 4 : row.minWeeks < 26 ? 3 : 2}
                    </td>
                    <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                      {(10 * 16 * row.percent).toFixed(1)} oz/day
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
              * Puppies need more food relative to body weight for growth. Gradually reduce percentage as they approach adulthood (12 months for small breeds, 18-24 months for large breeds).
            </p>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "20px" }}>🥩 Understanding Raw Dog Food Diets</h2>
              
              <div style={{ color: "#4B5563", lineHeight: "1.8" }}>
                <h3 style={{ color: "#111827", marginTop: "0", marginBottom: "12px" }}>The 80/10/10 Rule Explained</h3>
                <p>
                  The 80/10/10 ratio is the foundation of <strong>PMR (Prey Model Raw)</strong> feeding. It mimics 
                  the nutritional composition of whole prey animals that dogs evolved to eat. The breakdown is:
                </p>
                <ul style={{ marginLeft: "20px", marginBottom: "20px" }}>
                  <li><strong>80% Muscle Meat</strong> - Includes heart (it&apos;s a muscle!), ground beef, chicken thighs, etc.</li>
                  <li><strong>10% Raw Edible Bone</strong> - Chicken backs, necks, turkey necks, duck frames</li>
                  <li><strong>5% Liver</strong> - Essential for vitamin A and B vitamins</li>
                  <li><strong>5% Other Organs</strong> - Kidney, spleen, pancreas, brain, testicles</li>
                </ul>
                
                <h3 style={{ color: "#111827", marginTop: "24px", marginBottom: "12px" }}>PMR vs BARF: Which to Choose?</h3>
                <p>
                  <strong>PMR</strong> is strictly animal-based, following what wolves and wild canids eat. 
                  <strong>BARF</strong> adds 7-10% plant matter (vegetables, fruits, seeds), believing dogs 
                  benefit from some plant nutrients as omnivore-leaning carnivores. Both can produce healthy dogs—
                  choose based on your philosophy and your dog&apos;s individual needs.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Tips Box */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #6EE7B7" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "16px" }}>✅ Getting Started Tips</h3>
              <div style={{ fontSize: "0.85rem", color: "#047857", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Start slow—transition over 7-14 days</p>
                <p style={{ margin: "0 0 8px 0" }}>• Feed in stainless steel bowls</p>
                <p style={{ margin: "0 0 8px 0" }}>• Keep raw food frozen until use</p>
                <p style={{ margin: "0 0 8px 0" }}>• Variety is key—rotate proteins</p>
                <p style={{ margin: 0 }}>• Monitor stool—adjust bone content</p>
              </div>
            </div>

            {/* Warning Box */}
            <div style={{ backgroundColor: "#FEE2E2", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FECACA" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#991B1B", marginBottom: "12px" }}>⚠️ Important Notes</h3>
              <div style={{ fontSize: "0.85rem", color: "#B91C1C", lineHeight: "1.8" }}>
                <p style={{ margin: "0 0 8px 0" }}>• Never feed cooked bones</p>
                <p style={{ margin: "0 0 8px 0" }}>• Avoid onions, grapes, chocolate</p>
                <p style={{ margin: "0 0 8px 0" }}>• Consult your vet before switching</p>
                <p style={{ margin: 0 }}>• Not ideal for immunocompromised dogs</p>
              </div>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/raw-food-calculator-dog" currentCategory="Pets" />
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
            🐕 <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes only. 
            Every dog is different—adjust portions based on your dog&apos;s weight changes, energy level, and stool quality. 
            Consult with a veterinarian before changing your dog&apos;s diet, especially for puppies or dogs with health conditions.
          </p>
        </div>
      </div>
    </div>
  );
}