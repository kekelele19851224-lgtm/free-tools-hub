"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

// Months data
const MONTHS = [
  { num: 1, name: "January", short: "Jan" },
  { num: 2, name: "February", short: "Feb" },
  { num: 3, name: "March", short: "Mar" },
  { num: 4, name: "April", short: "Apr" },
  { num: 5, name: "May", short: "May" },
  { num: 6, name: "June", short: "Jun" },
  { num: 7, name: "July", short: "Jul" },
  { num: 8, name: "August", short: "Aug" },
  { num: 9, name: "September", short: "Sep" },
  { num: 10, name: "October", short: "Oct" },
  { num: 11, name: "November", short: "Nov" },
  { num: 12, name: "December", short: "Dec" },
];

// Generate ages 18-45
const AGES = Array.from({ length: 28 }, (_, i) => i + 18);

// Mayan prediction logic: same parity = girl, different parity = boy
const predictGender = (age: number, month: number): "girl" | "boy" => {
  const ageIsOdd = age % 2 !== 0;
  const monthIsOdd = month % 2 !== 0;
  return ageIsOdd === monthIsOdd ? "girl" : "boy";
};

// FAQ data
const faqs = [
  {
    question: "How to check Mayan calendar baby gender?",
    answer: "To use the Mayan gender predictor: 1) Take the mother's age at conception, 2) Note the month of conception (1-12), 3) If both numbers are odd OR both are even, it predicts a girl. If one is odd and one is even, it predicts a boy. For example: Age 28 (even) + June/6 (even) = Girl. Age 27 (odd) + April/4 (even) = Boy."
  },
  {
    question: "Is the Mayan gender predictor accurate?",
    answer: "The Mayan gender predictor has no scientific basis and is purely for entertainment. Like flipping a coin, it has roughly a 50% accuracy rate. Some claim 85% accuracy, but this is not supported by any scientific studies. The only reliable ways to determine baby gender are ultrasound (18-20 weeks), NIPT blood test (10+ weeks), or amniocentesis."
  },
  {
    question: "How is the Mayan method different from Chinese gender predictor?",
    answer: "The Mayan method uses simple odd/even logic with the mother's age and conception month. The Chinese gender chart uses the mother's lunar age and lunar conception month in a more complex chart format. Both are ancient methods with no scientific validity, but they use different calculation approaches."
  },
  {
    question: "Is there a 100% accurate gender calculator?",
    answer: "No gender prediction calculator is 100% accurate. The only medically accurate methods are: ultrasound (97-99% accurate after 18 weeks), NIPT blood test (99%+ accurate), CVS or amniocentesis (99%+ accurate). All calendar-based predictors like Mayan or Chinese are for entertainment only."
  },
  {
    question: "What did the Mayans believe about gender?",
    answer: "The ancient Maya had complex beliefs about gender and duality. They believed in balance between masculine and feminine energies. While the 'Mayan gender predictor' is popular today, there's limited historical evidence that the Maya actually used this specific method. It may be a modern interpretation inspired by Mayan numerology."
  },
  {
    question: "When can I find out my baby's gender?",
    answer: "You can find out your baby's gender through: NIPT blood test (as early as 10 weeks, 99%+ accurate), Ultrasound (18-20 weeks for reliable results), CVS (10-13 weeks), or Amniocentesis (15-20 weeks). Gender prediction calendars like the Mayan method can be tried anytime for fun, but have no medical accuracy."
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

export default function MayanCalendarGenderCalculator() {
  const [motherAge, setMotherAge] = useState<number>(28);
  const [conceptionMonth, setConceptionMonth] = useState<number>(6);

  // Calculate prediction
  const result = useMemo(() => {
    const gender = predictGender(motherAge, conceptionMonth);
    const ageIsOdd = motherAge % 2 !== 0;
    const monthIsOdd = conceptionMonth % 2 !== 0;
    
    return {
      gender,
      ageIsOdd,
      monthIsOdd,
      ageParity: ageIsOdd ? "Odd" : "Even",
      monthParity: monthIsOdd ? "Odd" : "Even",
      monthName: MONTHS[conceptionMonth - 1].name
    };
  }, [motherAge, conceptionMonth]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "12px 24px" }}>
          <nav style={{ fontSize: "0.875rem", color: "#6B7280" }}>
            <Link href="/" style={{ color: "#6B7280", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#111827" }}>Mayan Calendar Gender Calculator</span>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ fontSize: "2.5rem" }}>🔒</span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              Mayan Calendar Gender Calculator
            </h1>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#4B5563", maxWidth: "800px" }}>
            Predict your baby&apos;s gender using the ancient Mayan method! Enter the mother&apos;s age at conception and the month of conception to see if it&apos;s a boy or girl.
          </p>
        </div>

        {/* Quick Answer Box */}
        <div style={{
          backgroundColor: "#FDF2F8",
          borderRadius: "12px",
          padding: "20px 24px",
          marginBottom: "32px",
          border: "1px solid #FBCFE8"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>✨</span>
            <div>
              <p style={{ fontWeight: "600", color: "#9D174D", margin: "0 0 4px 0" }}>How It Works</p>
              <p style={{ color: "#9D174D", margin: 0, fontSize: "0.95rem" }}>
                <strong>Both Odd or Both Even</strong> = 👧 Girl • <strong>One Odd, One Even</strong> = 👦 Boy
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
          <div style={{ 
            background: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)", 
            padding: "16px 24px" 
          }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>🌙 Mayan Gender Predictor</h2>
          </div>
          
          <div style={{ padding: "32px" }}>
            <div className="calc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              {/* Inputs */}
              <div>
                {/* Mother's Age */}
                <div style={{ backgroundColor: "#FDF2F8", padding: "24px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    👩 Mother&apos;s Age at Conception
                  </h3>
                  <select
                    value={motherAge}
                    onChange={(e) => setMotherAge(Number(e.target.value))}
                    style={{ 
                      width: "100%", 
                      padding: "14px", 
                      border: "2px solid #FBCFE8", 
                      borderRadius: "8px", 
                      fontSize: "1.1rem",
                      backgroundColor: "white",
                      cursor: "pointer"
                    }}
                  >
                    {AGES.map((age) => (
                      <option key={age} value={age}>{age} years old</option>
                    ))}
                  </select>
                  <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.9rem", color: "#6B7280" }}>Age {motherAge} is </span>
                    <span style={{ 
                      fontWeight: "700", 
                      color: result.ageIsOdd ? "#7C3AED" : "#EC4899",
                      fontSize: "1.1rem"
                    }}>
                      {result.ageParity}
                    </span>
                  </div>
                </div>

                {/* Conception Month */}
                <div style={{ backgroundColor: "#EDE9FE", padding: "24px", borderRadius: "12px" }}>
                  <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "16px", fontSize: "1.1rem" }}>
                    📅 Month of Conception
                  </h3>
                  <select
                    value={conceptionMonth}
                    onChange={(e) => setConceptionMonth(Number(e.target.value))}
                    style={{ 
                      width: "100%", 
                      padding: "14px", 
                      border: "2px solid #C4B5FD", 
                      borderRadius: "8px", 
                      fontSize: "1.1rem",
                      backgroundColor: "white",
                      cursor: "pointer"
                    }}
                  >
                    {MONTHS.map((month) => (
                      <option key={month.num} value={month.num}>{month.name} ({month.num})</option>
                    ))}
                  </select>
                  <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "white", borderRadius: "8px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.9rem", color: "#6B7280" }}>{result.monthName} ({conceptionMonth}) is </span>
                    <span style={{ 
                      fontWeight: "700", 
                      color: result.monthIsOdd ? "#7C3AED" : "#EC4899",
                      fontSize: "1.1rem"
                    }}>
                      {result.monthParity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="calc-results">
                {/* Main Result */}
                <div style={{ 
                  background: result.gender === "girl" 
                    ? "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)" 
                    : "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
                  padding: "32px", 
                  borderRadius: "16px", 
                  textAlign: "center", 
                  marginBottom: "20px" 
                }}>
                  <p style={{ fontSize: "4rem", margin: "0 0 8px 0" }}>
                    {result.gender === "girl" ? "👧" : "👦"}
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "white", margin: "0 0 8px 0" }}>
                    It&apos;s a {result.gender === "girl" ? "Girl!" : "Boy!"}
                  </p>
                  <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    According to the Mayan Calendar
                  </p>
                </div>

                {/* Calculation Explanation */}
                <div style={{ backgroundColor: "#F9FAFB", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                  <h4 style={{ fontWeight: "600", color: "#374151", marginBottom: "12px", fontSize: "0.95rem" }}>📐 How We Got This Result</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Mother&apos;s Age</span>
                      <span style={{ fontWeight: "600", color: result.ageIsOdd ? "#7C3AED" : "#EC4899" }}>
                        {motherAge} ({result.ageParity})
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: "white", borderRadius: "6px" }}>
                      <span style={{ color: "#6B7280" }}>Conception Month</span>
                      <span style={{ fontWeight: "600", color: result.monthIsOdd ? "#7C3AED" : "#EC4899" }}>
                        {result.monthName} ({result.monthParity})
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", backgroundColor: result.gender === "girl" ? "#FDF2F8" : "#EFF6FF", borderRadius: "6px", marginTop: "4px" }}>
                      <span style={{ color: "#374151", fontWeight: "500" }}>Result</span>
                      <span style={{ fontWeight: "700", color: result.gender === "girl" ? "#EC4899" : "#3B82F6" }}>
                        {result.ageParity} + {result.monthParity} = {result.gender === "girl" ? "👧 Girl" : "👦 Boy"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div style={{ padding: "16px", backgroundColor: "#FEF3C7", borderRadius: "8px", border: "1px solid #FCD34D" }}>
                  <p style={{ fontSize: "0.8rem", color: "#92400E", margin: 0 }}>
                    ⚠️ <strong>For Entertainment Only:</strong> This prediction has no scientific basis. The only accurate ways to determine gender are medical tests like ultrasound or NIPT.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mayan Gender Chart 2025 */}
        <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "8px" }}>📊 Mayan Gender Prediction Chart 2025</h2>
          <p style={{ color: "#6B7280", marginBottom: "20px", fontSize: "0.9rem" }}>Find your age on the left, conception month on top. <span style={{ color: "#EC4899", fontWeight: "600" }}>Pink = Girl</span>, <span style={{ color: "#3B82F6", fontWeight: "600" }}>Blue = Boy</span></p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px", border: "1px solid #E5E7EB", backgroundColor: "#F3F4F6", fontWeight: "600" }}>Age</th>
                  {MONTHS.map((month) => (
                    <th key={month.num} style={{ padding: "10px", border: "1px solid #E5E7EB", backgroundColor: "#F3F4F6", fontWeight: "600" }}>
                      {month.short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGES.slice(0, 20).map((age) => (
                  <tr key={age}>
                    <td style={{ padding: "8px", border: "1px solid #E5E7EB", fontWeight: "600", backgroundColor: "#F9FAFB", textAlign: "center" }}>
                      {age}
                    </td>
                    {MONTHS.map((month) => {
                      const gender = predictGender(age, month.num);
                      return (
                        <td 
                          key={month.num} 
                          style={{ 
                            padding: "8px", 
                            border: "1px solid #E5E7EB", 
                            backgroundColor: gender === "girl" ? "#FDF2F8" : "#EFF6FF",
                            textAlign: "center",
                            color: gender === "girl" ? "#EC4899" : "#3B82F6",
                            fontWeight: "600"
                          }}
                        >
                          {gender === "girl" ? "G" : "B"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: "12px", textAlign: "center" }}>
            G = Girl, B = Boy • Chart shows ages 18-37. Pattern repeats for all ages.
          </p>
        </div>

        {/* Content + Sidebar */}
        <div className="content-sidebar" style={{ display: "flex", gap: "32px", marginBottom: "40px", flexWrap: "wrap" }}>
          {/* Main Content */}
          <div style={{ flex: "2", minWidth: "300px" }}>
            {/* How It Works */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>How the Mayan Gender Predictor Works</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "16px" }}>
                The Mayan gender prediction method is based on a simple odd/even number system. According to this ancient technique, the gender of your baby can be predicted by comparing two numbers: the mother&apos;s age at conception and the month of conception.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div style={{ backgroundColor: "#FDF2F8", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <span style={{ fontSize: "2rem" }}>👧</span>
                  <h4 style={{ fontWeight: "600", color: "#EC4899", margin: "8px 0 4px 0" }}>It&apos;s a Girl If...</h4>
                  <p style={{ fontSize: "0.9rem", color: "#9D174D", margin: 0 }}>
                    Both numbers are <strong>ODD</strong><br/>
                    OR both are <strong>EVEN</strong>
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#BE185D", marginTop: "8px", marginBottom: 0 }}>
                    Example: Age 28 + June (6)<br/>Even + Even = Girl
                  </p>
                </div>
                <div style={{ backgroundColor: "#EFF6FF", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <span style={{ fontSize: "2rem" }}>👦</span>
                  <h4 style={{ fontWeight: "600", color: "#3B82F6", margin: "8px 0 4px 0" }}>It&apos;s a Boy If...</h4>
                  <p style={{ fontSize: "0.9rem", color: "#1E40AF", margin: 0 }}>
                    One number is <strong>ODD</strong><br/>
                    and one is <strong>EVEN</strong>
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#1D4ED8", marginTop: "8px", marginBottom: 0 }}>
                    Example: Age 27 + April (4)<br/>Odd + Even = Boy
                  </p>
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#EC4899", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>1</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Determine Mother&apos;s Age</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Use the mother&apos;s age at the time of conception (not current age).</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#8B5CF6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>2</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Find Conception Month</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>January = 1, February = 2, ... December = 12.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3B82F6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>3</div>
                  <div>
                    <h4 style={{ fontWeight: "600", color: "#111827", margin: "0 0 4px 0" }}>Compare Odd/Even</h4>
                    <p style={{ fontSize: "0.9rem", color: "#6B7280", margin: 0 }}>Same parity (both odd or both even) = Girl. Different parity = Boy.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mayan vs Chinese */}
            <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #E5E7EB", padding: "32px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>Mayan vs Chinese Gender Predictor</h2>
              <p style={{ color: "#4B5563", lineHeight: "1.7", marginBottom: "20px" }}>
                Both are popular ancient methods for predicting baby gender, but they work differently:
              </p>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F3F4F6" }}>
                      <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "left", fontWeight: "600" }}>Feature</th>
                      <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Mayan Method</th>
                      <th style={{ padding: "14px", border: "1px solid #E5E7EB", textAlign: "center", fontWeight: "600" }}>Chinese Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Age Used", mayan: "Regular age", chinese: "Lunar age (+1 or +2 years)" },
                      { feature: "Month Used", mayan: "Gregorian month", chinese: "Lunar month" },
                      { feature: "Calculation", mayan: "Odd/Even logic", chinese: "Complex chart lookup" },
                      { feature: "Ease of Use", mayan: "Very easy", chinese: "Requires conversion" },
                      { feature: "Scientific Basis", mayan: "None", chinese: "None" },
                      { feature: "Accuracy", mayan: "~50%", chinese: "~50%" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "white" : "#F9FAFB" }}>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", fontWeight: "500" }}>{row.feature}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.mayan}</td>
                        <td style={{ padding: "12px", border: "1px solid #E5E7EB", textAlign: "center" }}>{row.chinese}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ flex: "1", minWidth: "280px" }}>
            {/* Quick Rule */}
            <div style={{ backgroundColor: "#FDF2F8", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #FBCFE8" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#9D174D", marginBottom: "12px" }}>🌙 The Rule</h3>
              <div style={{ fontSize: "0.9rem", color: "#9D174D" }}>
                <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #FBCFE8" }}>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>👧 Girl</p>
                  <p style={{ margin: 0 }}>Odd + Odd = Girl<br/>Even + Even = Girl</p>
                </div>
                <div>
                  <p style={{ fontWeight: "600", margin: "0 0 4px 0" }}>👦 Boy</p>
                  <p style={{ margin: 0 }}>Odd + Even = Boy<br/>Even + Odd = Boy</p>
                </div>
              </div>
            </div>

            {/* Odd/Even Reference */}
            <div style={{ backgroundColor: "#EDE9FE", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #C4B5FD" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#5B21B6", marginBottom: "12px" }}>📅 Month Numbers</h3>
              <div style={{ fontSize: "0.8rem", color: "#5B21B6" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  <span>Jan (1) - Odd</span>
                  <span>Jul (7) - Odd</span>
                  <span>Feb (2) - Even</span>
                  <span>Aug (8) - Even</span>
                  <span>Mar (3) - Odd</span>
                  <span>Sep (9) - Odd</span>
                  <span>Apr (4) - Even</span>
                  <span>Oct (10) - Even</span>
                  <span>May (5) - Odd</span>
                  <span>Nov (11) - Odd</span>
                  <span>Jun (6) - Even</span>
                  <span>Dec (12) - Even</span>
                </div>
              </div>
            </div>

            {/* Accurate Methods */}
            <div style={{ backgroundColor: "#ECFDF5", borderRadius: "16px", padding: "24px", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#065F46", marginBottom: "12px" }}>✅ Accurate Methods</h3>
              <ul style={{ fontSize: "0.85rem", color: "#065F46", margin: 0, paddingLeft: "16px" }}>
                <li style={{ marginBottom: "8px" }}>Ultrasound (18-20 weeks)</li>
                <li style={{ marginBottom: "8px" }}>NIPT blood test (10+ weeks)</li>
                <li style={{ marginBottom: "8px" }}>CVS (10-13 weeks)</li>
                <li>Amniocentesis (15-20 weeks)</li>
              </ul>
            </div>

            {/* Related Tools */}
            <RelatedTools currentUrl="/mayan-calendar-gender-calculator" currentCategory="Lifestyle" />
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
            🔮 <strong>Disclaimer:</strong> The Mayan Gender Predictor is for entertainment purposes only and has no scientific basis. Gender prediction calendars are not medically accurate. The only reliable methods to determine a baby&apos;s sex are medical procedures such as ultrasound, NIPT, CVS, or amniocentesis. Please consult your healthcare provider for accurate information.
          </p>
        </div>
      </div>
    </div>
  );
}